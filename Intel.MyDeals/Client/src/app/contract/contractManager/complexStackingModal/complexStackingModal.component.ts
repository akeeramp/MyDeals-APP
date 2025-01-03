import { AfterViewInit, Component, Inject, QueryList, ViewChildren } from "@angular/core";
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
export class ComplexStackingModalComponent implements AfterViewInit {

    private isLoading = false;
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
            title: 'ECAP Type',
        }
    ]

    private groupedData = {};

    // Deal Ids are in `data.dealIds: number[]`
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public DIALOG_REF: MatDialogRef<ComplexStackingModalComponent>,
        private complexStackingModalService: ComplexStackingModalService,
        private momentService: MomentService,
        private loggerService: logger) { }

    private readonly offset = 25;
    private left = window.innerWidth / 3;
    private top = window.innerHeight / 3;
    private kendoWindowWidth = 950;
    private kendoWindowHeight = 430;

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
        return this.grpDeals != undefined && this.grpDeals.length > 0 && this.dealInfos.length > 0;
    }

    private grpDeals: any[] = []
    private dealInfos: any[] = []
    private readonly GROUPING_AGGREGATES: AggregateDescriptor[] = [
        { field: 'MAX_RPU', aggregate: 'sum' }
    ];

    @ViewChildren('groupingGrid') groupingGridElements: QueryList<GridComponent>
    private triggerExcelExportForAllGrids(): void {
        this.groupingGridElements.forEach((grid: GridComponent) => {
            grid.saveAsExcel();
        });
    }

    private allGridSheetData: WorkbookSheet[] = [];
    private overrideExcelExport(event: any, grid: unknown): void {
        event.preventDefault();

        this.allGridSheetData.push(event.workbook.sheets[0]);
    }

    private excelExportAllGroupings(): void {
        this.triggerExcelExportForAllGrids();

        const ROWS: WorkbookSheetRow[] = [];        
        for (const GRID_SHEET of this.allGridSheetData) {
            ROWS.push(...GRID_SHEET.rows);
            ROWS.push({ cells: [] });
        }

        const EXPORT_SHEET: WorkbookSheet = {
            rows: ROWS
        };

        const EXPORT_WORKBOOK: Workbook = new Workbook({
            sheets: [EXPORT_SHEET]
        });

        EXPORT_WORKBOOK.toDataURL().then((dataUrl) => {
            saveAs(dataUrl, `MyDeals_Complex Grouping_${this.momentService.moment().format('MMDDYYYY_HHmm')}.xlsx`);
        });
    }

    private acceptAllGroupings(): void {        
        const acceptedList = [];
        if (Object.keys(this.acceptedItems).filter(key => this.acceptedItems[key]).length > 0) {
            for (const key in this.acceptedItems) {
                if (this.acceptedItems[key]) {
                    acceptedList.push({ dealId: key, value: 1 })
                }
            }
        } else {
            const approverValue = (<any>window).usrRole === 'DA' ? 2 : 1;
            _.uniqBy(this.grpDeals, 'psId').forEach(obj => acceptedList.push({ psId: obj.psId, value: approverValue }))            
        }
        this.closeModal(acceptedList);
    }

    ngAfterViewInit(): void {
        this.formComplexStackingGroup();
    }

    formComplexStackingGroup() {
        const ovlpObjs = this.data.ovlpObjs;
        if (ovlpObjs.GroupItems && ovlpObjs.GroupItems.length > 0) {            
            this.dealInfos = ovlpObjs.DealInfos;
            this.groupedData = _.mapValues(_.groupBy(ovlpObjs.GroupItems, 'PickedDeal'), gList => gList.map(grp => _.omit(grp, 'PickedDeal')));
            const dealIds = Object.keys(this.groupedData);
            forEach(dealIds, (dealId) => {
                const tempObj = {};
                const grpArr = this.groupedData[dealId];                
                for (let i = 0; i < grpArr.length; i++) {
                    const CURRENT_GROUPING_LETTER = String.fromCharCode(97 + i).toUpperCase();
                    const groupedDeals = [];
                    const assoDealIds = grpArr[i].AssociatedDeals.split(",").map(Number);
                    groupedDeals.push(
                        ...this.dealInfos.filter((deal: any) => assoDealIds.includes(deal.WIP_DEAL_OBJ_SID)).map((itm) => ({ ...itm, GROUPED_BY: grpArr.length > 1 ? "GROUP " + dealId + " " + CURRENT_GROUPING_LETTER : "DEAL " + dealId }))
                    )
                    grpArr[i]["gridData"] = groupedDeals;
                    grpArr[i]["total"] = groupedDeals.length
                    grpArr[i]["rpuTotal"] = aggregateBy(groupedDeals, this.GROUPING_AGGREGATES)                    
                }
                tempObj["label"] = "DEAL " + dealId;
                tempObj["hasMoreThanOneGrp"] = false;

                if (grpArr.length > 1) {
                    tempObj["label"] = "GROUP " + dealId;
                    tempObj["hasMoreThanOneGrp"] = true;
                }
                tempObj["dealId"] = dealId;
                tempObj["psId"] = grpArr[0].ObjID;
                tempObj["groupedDeals"] = grpArr;
                this.grpDeals.push(tempObj);
            });
            this.isLoading = false;
        }
    }

    private acceptedItems = {};

    onCheckboxChange(checkBoxType, event, data) {
        const dealId = data.dealId;
        if (event.currentTarget.checked) {
            this.acceptedItems[dealId] = true;
        } else {
            delete this.acceptedItems[dealId];
        }
    }

    ngOnInit() {
        this.isLoading = true;
    }

    isAnyItemChecked(): boolean {
        return (this.acceptedItems && (Object.keys(this.acceptedItems).filter(key => this.acceptedItems[key]).length > 0));
    }

}