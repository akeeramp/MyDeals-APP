import { AfterViewInit, Component, Inject, Input, OnInit, Optional, QueryList, ViewChildren } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { aggregateBy, AggregateDescriptor, AggregateResult } from "@progress/kendo-data-query";
import { Workbook, WorkbookSheet, WorkbookSheetRow } from "@progress/kendo-angular-excel-export";
import { saveAs } from "@progress/kendo-file-saver";

import { ComplexStackingModalService } from "./complexStackingModal.service";
import { MomentService } from "../../../shared/moment/moment.service";
import { logger } from "../../../shared/logger/logger";
import * as _ from 'lodash-es';
import { forEach } from "underscore";
import { DynamicObj } from "../../../admin/employee/admin.employee.model";
import { utils, writeFileXLSX, WritingOptions } from "xlsx";
import { ActivatedRoute } from "@angular/router";
export interface GroupingGridData {
    groupingClass: string;
    gridData: GridDataResult;
    rpuTotal: AggregateResult;
}

@Component({
    selector: 'complex-stacking-modal',
    templateUrl: 'Client/src/app/contract/contractManager/complexStackingModal/complexStackingModal.component.html',
    styleUrls: ['Client/src/app/contract/contractManager/complexStackingModal/complexStackingModal.component.css']
})
export class ComplexStackingModalComponent implements OnInit, AfterViewInit {

    private isLoading = false;
    private isLoadingDealInfo = false;
    private isExportingData = false;
    private expandedDealId;
    private readonly COLUMNS_CONFIG = [        
        {
            field: 'GROUPED_BY',
            title: 'Main Deal ID',
            hidden: true
        }, {
            field: 'WIP_DEAL_OBJ_SID',
            title: 'Overlapped Deal ID'
        }, {
            field: 'CONTRACT_NM',
            title: 'Contract Name',
            hidden: true
        }, {
            field: 'DealType',
            title: 'Deal Type',
        }, {
            field: 'WF_STG_CD',
            title: 'Stage',
        }, {
            field: 'MAX_RPU',
            title: 'Max RPU'
        }, {
            field: 'CUST_ACCNT_DIV',
            title: 'Customer Division',
        }, {
            field: 'PRODUCT_NM',
            title: 'Product',
        }, {
            field: 'GEO_COMBINED',
            title: 'Geo',
        }, {
            field: 'START_DT',
            title: 'Start Date',
        }, {
            field: 'END_DT',
            title: 'End Date',
        }, {
            field: 'ECAP_PRICE',
            title: 'ECAP Price',
        }, {
            field: 'ECAP_TYPE',
            title: 'Rebate Type',
        }
    ]

    private groupedData = {};
    public detailData = {};
    public displayId = {};
    public exportData = {};
    public showNoGroupingAvailableMessage = false;

    @Input() isModel = true;
    @Input() inputData :any;
    // Deal Ids are in `data.dealIds: number[]`
    constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data,
        @Optional() public DIALOG_REF: MatDialogRef<ComplexStackingModalComponent>,
        private complexStackingModalService: ComplexStackingModalService,
        private momentService: MomentService,
        private loggerService: logger, private route: ActivatedRoute) { }
    

    private readonly offset = 25;
    private left = window.innerWidth / 3;
    private top = window.innerHeight / 3;
    private kendoWindowWidth = 950;
    private kendoWindowHeight = 430;
    private spinnerMessageDescription = "Loading Complex Stacking Data."
    public spinnerMessageHeader: any;
    public isBusyShowFunFact: any;
    public msgType: any;
    private kendoWindowOnEnd(): void {
        const CURRENT_WINDOW_WIDTH = window.innerWidth;
        const WINDOW_HEIGHT = window.innerHeight;
        const POSITION_TOP = (WINDOW_HEIGHT - this.kendoWindowHeight - this.offset);
        const POSITION_RIGHT = (CURRENT_WINDOW_WIDTH - this.kendoWindowWidth - this.offset);

        if (this.top < this.offset) {
            this.top = this.offset;
        }

        if (this.top > POSITION_TOP) {
            this.top = POSITION_TOP;
        }

        if (this.left < this.offset) {
            this.left = this.offset;
        }

        if (this.left > POSITION_RIGHT) {
            this.left = POSITION_RIGHT;
        }
    }

    private closeModal(outputData: DynamicObj[] = []): void {
        this.DIALOG_REF.close(outputData);
    }

    private get hasMultipleGroupings(): boolean {
        return this.grpDeals != undefined && this.grpDeals.length > 0;
    }

    private grpDeals: any[] = [];
    private dealInfos: any[] = [];
    private readonly GROUPING_AGGREGATES: AggregateDescriptor[] = [
        { field: 'MAX_RPU', aggregate: 'sum' }
    ];

    private acceptAllGroupings(): void {        
        const acceptedList = [];
        _.uniqBy(this.grpDeals, 'psId').forEach(obj => acceptedList.push({ ObjID: obj.psId, ObjType: 2 }))
        this.closeModal(acceptedList);
    }

    formComplexStackingGroup() {
        let csMode = "COMPLEX_GRP_DATA";
        if (this.route.snapshot.queryParams.manageType == 'complexStackingDiv') {
            csMode = "COMPLEX_GRP_DATA_READONLY";
        }
        if (this.isModel) {
            this.processResponse(this.data.ovlpObjs);
            return;
        }
        this.isLoading = true;
        const data = [{ ObjId: this.inputData.DC_ID, ObjType: 2 }] ;
        this.complexStackingModalService.getComplexStackingGroup(csMode, data).toPromise()
            .then((response) => {
                this.processResponse(response);
            })
            .catch((error) => {
                this.isLoading = false;
                this.loggerService.error('Get Complex Stacking Deal Group', error);
            });
    }

    public expandDetailsBy = (dataItem): number => {
        const dealId = this.expandedDealId = dataItem.dealId;
        if (!_.has(this.detailData, dealId)) {
            this.isLoadingDealInfo = true;            
            const inputDealIds = _.uniq(dataItem.assoDealIds.split(",").map(Number))
            this.getComplexStackingDealInfo(inputDealIds).then(() => {
                const nestedGridGrpArr = this.formatNestedGridData(dealId);
                this.detailData[dealId] = nestedGridGrpArr;
                this.isLoadingDealInfo = false;  
            });                  
        }
        this.displayId[dealId] = !this.displayId[dealId];
        return dealId;
    };

    private acceptedItems = {};

    private processResponse(response: any) {
        this.isLoading = false;
        if (response.GroupItems && response.GroupItems.length > 0) {
            this.showNoGroupingAvailableMessage = false;
            this.data = {
                ovlpObjs: response
            };
            const ovlpObjs = this.data.ovlpObjs;
            if (ovlpObjs.GroupItems && ovlpObjs.GroupItems.length > 0) {
                this.dealInfos = ovlpObjs.DealInfos;
                this.groupedData = _.mapValues(_.groupBy(ovlpObjs.GroupItems, 'PickedDeal'), gList => gList.map(grp => _.omit(grp, 'PickedDeal')));
                const dealIds = Object.keys(this.groupedData);
                forEach(dealIds, (dealId) => {
                    this.displayId[dealId] = false;
                    const parentGridInfo = this.formatParentGridData(dealId);
                    this.grpDeals.push(parentGridInfo);
                });
            }
        }
        else {
            this.showNoGroupingAvailableMessage = true;
        }
    }

    ngOnInit() {
        this.formComplexStackingGroup()
    }

    async getComplexStackingDealInfo(dealIds: number[]): Promise<void> {
        const payload = [];
        _.forEach(_.uniq(dealIds), (val) => payload.push({ "ObjId": val, "ObjType": 5 }));
        const apiRes = await this.complexStackingModalService.getComplexStackingGroup("DEAL_INFO", payload).toPromise().catch(error => {
            this.loggerService.error('Get Complex Stacking Deal Group Info', error);
        });
        if (apiRes.DealInfos && apiRes.DealInfos.length > 0) {
            this.dealInfos = apiRes.DealInfos;
        }
    }

    formatParentGridData(dealId) {
        const parentGridInfoObj = {};
        const grpArr = this.groupedData[dealId];
        parentGridInfoObj["label"] = "DEAL " + dealId;
        parentGridInfoObj["gridlabel"] = "Single Overlap";
        parentGridInfoObj["hasMoreThanOneGrp"] = false;
        if (grpArr.length > 1) {
            parentGridInfoObj["label"] = "GROUP " + dealId;
            parentGridInfoObj["gridlabel"] = "Multiple Overlaps";
            parentGridInfoObj["hasMoreThanOneGrp"] = true;
        }
        parentGridInfoObj["dealId"] = dealId;
        parentGridInfoObj["psId"] = grpArr[0].ObjID;
        parentGridInfoObj["assoDealIds"] = _.map(grpArr, (item) => item.AssociatedDeals).toString();
        return parentGridInfoObj;
    }

    formatNestedGridData(dealId) {
        const nestedGridGrpArr = this.groupedData[dealId]; //Copying values to new variable
        for (let i = 0; i < nestedGridGrpArr.length; i++) {
            const CURRENT_GROUPING_LETTER = String.fromCharCode(97 + i).toUpperCase();
            const groupedDeals = [];
            const assoDealIds = nestedGridGrpArr[i].AssociatedDeals.split(",").map(Number);
            groupedDeals.push(
                ...this.dealInfos.filter((deal: any) => assoDealIds.includes(deal.WIP_DEAL_OBJ_SID)).map((itm) => ({ ...itm, GROUPED_BY: nestedGridGrpArr.length > 1 ? "GROUP " + dealId + " " + CURRENT_GROUPING_LETTER : "DEAL " + dealId }))
            )
            //Move the matching dealid with overlaping dealId on top
            groupedDeals.unshift(groupedDeals.splice(groupedDeals.findIndex(item => item.WIP_DEAL_OBJ_SID == dealId), 1)[0])
            nestedGridGrpArr[i]["gridData"] = groupedDeals;
            nestedGridGrpArr[i]["total"] = groupedDeals.length
            nestedGridGrpArr[i]["rpuTotal"] = aggregateBy(groupedDeals, this.GROUPING_AGGREGATES)
        }
        return nestedGridGrpArr;
    }

    async getExportData() {
        const inputDealIds = [];
        _.forOwn(this.groupedData, (value) => {
            _.forEach(value, (item) => {
                inputDealIds.push(...item.AssociatedDeals.split(",").map(Number))
            });
        });
        await this.getComplexStackingDealInfo(_.flatMap(inputDealIds));
        const dealIds = Object.keys(this.groupedData);
        forEach(dealIds, (dealId) => {
            const parentGridInfo = {};
            const nestedGridInfo = this.formatNestedGridData(dealId);            
            parentGridInfo["groupedDeals"] = nestedGridInfo;
            this.exportData[dealId] = parentGridInfo;            
        });        
    }

    async exportDataToExcel(): Promise<void> {
        if (Object.keys(this.groupedData).length > 0) {
            this.isExportingData = true;
            if (Object.keys(this.exportData).length === 0) {
                await this.getExportData();
            }            
            const HEADER = this.COLUMNS_CONFIG.map((item) => item.field);
            const COLUMN_WIDTHS = [{ wch: 16 }, { wch: 8 }, { wch: 18 }, { wch: 10 }, { wch: 12 }, { wch: 24 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 38 }, { wch: 100 }, { wch: 28 }, { wch: 26 }, { wch: 100 }, { wch: 28 }, { wch: 16 }];

            const SHEET = utils.json_to_sheet([]);            
            const dealIds = Object.keys(this.exportData);
            for (let i = 0; i < dealIds.length; i++) {
                const dealId = dealIds[i];
                const dealData = this.exportData[dealId].groupedDeals;
                for (let j = 0; j < dealData.length; j++) {
                    const gridData = new Array(...dealData[j].gridData);
                    gridData.push({ WF_STG_CD: "Total RPU:", MAX_RPU: "$ " + dealData[j].rpuTotal.MAX_RPU.sum.toFixed(2) })
                    gridData.push({});
                    utils.sheet_add_aoa(SHEET, [this.COLUMNS_CONFIG.map((item) => item.title)], { origin: -1 });
                    utils.sheet_add_json(SHEET, gridData, { header: HEADER, origin: -1, skipHeader: true });                    
                }                
            }
            
            SHEET["!cols"] = COLUMN_WIDTHS;

            const WB = utils.book_new(SHEET);
            const WB_OPTIONS: WritingOptions = {
                compression: true,
            };            
            writeFileXLSX(WB, `MyDeals_Complex Grouping_${this.momentService.moment().format('MMDDYYYY_HHmm')}.xlsx`, WB_OPTIONS);
            this.isExportingData = false;
        } else {
            this.loggerService.warn('', 'No data to export');
        }
    }
    
    ngAfterViewInit(): void {

    }
}