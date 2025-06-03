/* eslint-disable @typescript-eslint/no-inferrable-types */
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { each, filter } from 'underscore';

import { logger } from "../../../shared/logger/logger";
import { overLappingcheckDealService } from "./overlappingCheckDeals.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'overlapping-check-deal',
    templateUrl: 'Client/src/app/contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component.html',
    styleUrls: ['Client/src/app/contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component.css'],
})
export class OverlappingCheckComponent implements OnInit, OnDestroy  {

    S_ID: any;

    constructor(private overLappingCheckDealsSvc: overLappingcheckDealService,
                private loggerService: logger,
                public dialogRef: MatDialogRef<OverlappingCheckComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

    @Input() contractData: any;
    @Input() curPricingTable: any;
    @Input() responseData: any;
    public pricingId: number;
    public contractDetails: any;
    private isLoading = true;
    private loadMessage = "Looking for Overlapping Deals";;
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private ovlpErrorCount: Array<any> = [];
    private isOvlpAccess: boolean = false;
    private isdealEndDateNeedChange: boolean = false;
    private isRevalidate: boolean = false;
    private isDealEndDateChange: boolean = false;
    private isReqChange: boolean = false;
    private ovlpData: any;
    private isSelectAll: boolean = true;
    private showKendoAlert: boolean = false;
    private is_selected: boolean = false;
    private isNoDealsFound: boolean = false;
    private title: string = "Overlapping Deals";
    private readonly destroy$ = new Subject<void>();
    private state: State = {
        skip: 0,
        take: 50,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    closeWindow(): void {
        this.dialogRef.close();
    }

    private pageSizes: PageSizeItem[] = [
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 },
        { text: "250", value: 250 },
        { text: "500", value: 500 }
    ];

    prepareGridData(data) {
        for (let i = 0; i < data.length; i++) {
            data[i]["IS_SEL"] = false;
        }
        return data;
    }

    getUiElement(value) {
        let hasResolved = false;
        let count = 0;
        this.is_selected = false;
        this.isOvlpAccess = true;
        this.isdealEndDateNeedChange = false;
        this.isRevalidate = false;
        this.isDealEndDateChange = false;
        this.isReqChange = false;
        if (value != undefined && value != null && value != '') {
            const GROUP_ROW = filter(this.gridResult, { 'WIP_DEAL_OBJ_SID': value, 'PROGRAM_PAYMENT': 'Frontend YCS2' });

            if (GROUP_ROW.length > 1) {
                if (filter(GROUP_ROW, { 'WF_STG_CD': 'Draft' }).length > 1) {
                    count = GROUP_ROW.length;
                } else if (filter(GROUP_ROW, { 'WF_STG_CD': 'Draft' }).length === 1) {
                    count = 1;
                } else {
                    count = 2;
                }
            }

            if (this.ovlpErrorCount.indexOf(value) > -1) {
                hasResolved = true;
            }

            if (hasResolved && count > 0 && count === 1 && this.isOvlpAccess) {
                this.is_selected = GROUP_ROW[0].IS_SEL;
                this.isdealEndDateNeedChange = true;
            } else if (hasResolved && count > 1 && this.isOvlpAccess) {
                this.isRevalidate = true;
            } else if (!hasResolved) {
                this.isDealEndDateChange = true;
            } else {
                this.isReqChange = true;
            }

            return true;
        } else {
            return false;
        }
    }

    rejectOverlap(value) {
        this.showKendoAlert = true;
    }

    acceptOverlap(WIP_DEAL_OBJ_SID, YCS2_OVERLAP_OVERRIDE) {
        let startDate = '';
        let endDate = '';
        let splitData = [];

        if (WIP_DEAL_OBJ_SID.toString().indexOf(',') > -1) {
            splitData = WIP_DEAL_OBJ_SID.toString().split(',');
        } else {
            splitData.push(WIP_DEAL_OBJ_SID);
        }

        each(splitData, item => {
            const DATA = parseInt(item);
            const DEAL_INFO = filter(this.ovlpData, { 'WIP_DEAL_OBJ_SID': DATA, 'WF_STG_CD': "Draft", OVLP_CD: "SELF_OVLP" });
            if (DEAL_INFO != undefined && DEAL_INFO != null && DEAL_INFO.length > 0) {
                startDate = DEAL_INFO[0].START_DT;
                endDate = DEAL_INFO[0].END_DT;
            }
        });

        this.updateOverlapping(splitData, YCS2_OVERLAP_OVERRIDE);
    }

    updateOverlapping(data, YCS2_OVERLAP_OVERRIDE) {
        this.isLoading = true;
        this.overLappingCheckDealsSvc.updateOverlappingDeals(data, YCS2_OVERLAP_OVERRIDE)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
            this.isLoading = false;
            if (result[0].PRICING_TABLES > 0) {
                if (YCS2_OVERLAP_OVERRIDE === 'N') {
                    for (let j = 0; j < data.length; j++) {
                        this.ovlpErrorCount.push(parseInt(data[j]));
                        //Finding all the indexes in an Array
                        this.resetIsSelect(parseInt(data[j]));
                    }
                } else {
                    for (let j = 0; j < data.length; j++) {
                        if (this.ovlpErrorCount.indexOf(parseInt(data[j])) > -1) {
                            this.ovlpErrorCount.splice(this.ovlpErrorCount.indexOf(parseInt(data[j])), 1);
                        }
                        this.resetIsSelect(parseInt(data[j]));
                    }
                }
            }
        }, (error) => {
            this.isLoading = false;
            this.loggerService.error('OverLapDeals service', error);
        });
    }

    //Reset IS_SEL
    resetIsSelect(data) {
        for (let m = 0; m < this.ovlpData.length; m++) {
            if (this.ovlpData[m].WIP_DEAL_OBJ_SID == parseInt(data) && this.ovlpData[m].PROGRAM_PAYMENT === "Frontend YCS2") {
                this.ovlpData[m].IS_SEL = false;
            }
        }
    }

    closeKendoAlert() {
        this.showKendoAlert = false;
    }

    selectAllOverlap(value) {
        this.isSelectAll = !value;
        each(this.gridResult, (item) => {
            if (item.PROGRAM_PAYMENT == "Frontend YCS2") {
                item.IS_SEL = value;
            }
        });
    }

    selectCheckbox(value) {
        each(this.gridResult, item => {
            if (item.WIP_DEAL_OBJ_SID == value && item.PROGRAM_PAYMENT == "Frontend YCS2") {
                item.IS_SEL = !item.IS_SEL;
            }
        });
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    acceptSelectAll() {
        const SELECTED_IDS = filter(this.gridResult, { 'IS_SEL': true, 'PROGRAM_PAYMENT': 'Frontend YCS2' });
        const DISTINCT_IDS = distinct(SELECTED_IDS, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
        if (SELECTED_IDS.length > 0) {
            this.acceptOverlap(DISTINCT_IDS.toString(), 'Y');
        } else {
            this.loggerService.error('Select An overlap with an Active or Draft deal', 'OverLap');
        }
    }

    getOverlapCheckDetails() {
        this.pricingId = this.curPricingTable.DC_ID;
        if (!!this.responseData && this.responseData) {
            this.title = "Overlapping Deals - Please fix before you continue";
            this.ovlpData = this.prepareGridData(this.responseData);
            this.ovlpErrorCount = distinct(this.responseData, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
            this.gridResult = this.ovlpData;
            if (this.gridResult.length == 0) {
                this.isNoDealsFound = true;
            } else {
                this.isNoDealsFound = false;
            }
            let groups = [{ field: "PROGRAM_PAYMENT" }, { field: "WIP_DEAL_OBJ_SID" }];
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        } else {
            this.overLappingCheckDealsSvc.getOverLappingCheckDealsDetails(this.pricingId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: any) => {
                this.isLoading = false;
                this.title = "Overlapping Deals";
                this.ovlpData = this.prepareGridData(result.Data);
                this.ovlpErrorCount = distinct(result.Data, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
                this.gridResult = this.ovlpData;
                if (this.gridResult.length == 0) {
                    this.isNoDealsFound = true;
                } else {
                    this.isNoDealsFound = false;
                }
                let groups = [{ field: "PROGRAM_PAYMENT" }, { field: "WIP_DEAL_OBJ_SID" }];
                this.state.group = groups;
                this.gridData = process(this.gridResult, this.state);
            }, (error) => {
                this.isLoading = false;
                this.loggerService.error('OverLapDeals service', error);
            });
        }

        this.overLappingCheckDealsSvc.readContract(this.pricingId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        },(error)=>{
            this.loggerService.error("Unable to get contract data","Error",error);
        });

        this.S_ID = this.contractData.CUST_MBR_SID;
        this.overLappingCheckDealsSvc.getCustomerVendors(this.S_ID)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: Array<any>) => {
            // 
        }, (error) => {
                this.loggerService.error(
                    "Unable to get Customer Vendors.",
                    error,
                    error.statusText
                );
            }
        );
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    openDealEditor(value) {
        window.open(`/Contract#/gotoDeal/${value.OVLP_DEAL_OBJ_SID}`, '_blank')
    }

    getOverlapDetails() {
        this.pricingId = this.contractData.DC_ID;
        this.overLappingCheckDealsSvc.getOverLappingDealsDetails(this.pricingId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
            this.loadMessage = "Done";
            this.ovlpData = this.prepareGridData(result.Data);
            this.ovlpErrorCount = distinct(result.Data, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
            this.gridResult = result.Data;
            if (this.gridResult.length == 0) {
                this.isNoDealsFound = true;
            } else {
                this.isNoDealsFound = false;
            }
            let groups = [{ field: "PROGRAM_PAYMENT" }, { field: "WIP_DEAL_OBJ_SID" }];
            // this.filterOverLapData(this.gridResult);
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
        }, (error) => {
            this.isLoading = false;
            this.loggerService.error('OverLapDeals service', error);
        });
        this.overLappingCheckDealsSvc.readContract(this.pricingId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        }, (error) => {
            this.loggerService.error("Unable to get contract data", "Error", error);
        });
        this.S_ID = this.contractData.CUST_MBR_SID;

        this.overLappingCheckDealsSvc.getCustomerVendors(this.S_ID)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: Array<any>) => {
            //
        }, (response) => {
            this.loggerService.error(
                "Unable to get Customer Vendors.",
                response,
                response.statusText
            );
        });
    }

    ngOnInit() {
        if (this.curPricingTable == undefined) {
            this.curPricingTable = this.data.currPt;
            this.contractData = this.data.contractData;
            this.responseData = this.data.responseData;
        }

        if (this.data.srcScrn == "overLapping") {
            this.getOverlapDetails();
        } else {
            this.getOverlapCheckDetails();
        }
    }

    private readonly offset = 25;
    private left = window.innerWidth / 3;
    private top = window.innerHeight / 3;
    private kendoWindowWidth = 800;
    private kendoWindowHeight = 430;

    // TWC3119-683 - Logic from https://www.telerik.com/forums/dynamically-re-position-kendo-window-for-angular#4857547
    kendoWindowOnEnd() {
        const WINDOW_WIDTH = window.innerWidth;
        const WINDOW_HEIGHT = window.innerHeight;
        const POSITION_TOP = WINDOW_HEIGHT - this.kendoWindowHeight - this.offset;
        const POSITION_RIGHT = WINDOW_WIDTH - this.kendoWindowWidth - this.offset;

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

     
 //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
 ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}