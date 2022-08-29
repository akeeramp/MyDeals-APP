import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { Component, Inject, Input } from "@angular/core";
import * as angular from "angular";
import { MatDialogActions, MatDialogRef, MatDialogState, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { WindowState } from "@progress/kendo-angular-dialog";
import { logger } from "../../../shared/logger/logger";
import { error } from "console";
import { overLappingcheckDealService } from "./overlappingCheckDeals.service";
import * as _ from 'underscore';



@Component({
    selector: "overlappingCheckDeal",
    templateUrl: "Client/src/app/contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component.html",
    styleUrls: ["Client/src/app/contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component.css"],

})

export class OverlappingCheckComponent {
    S_ID: any;
    constructor(private overLappingCheckDealsSvc: overLappingcheckDealService, private loggerSvc: logger, public dialogRef: MatDialogRef<OverlappingCheckComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) {

    }
    @Input() contractData: any;
    @Input() curPricingTable: any;
    private acceptYes = false;
    public pricingId: number;
    public contractDetails: any;
    private isLoading = true;
    private loadMessage = "Looking for Overlapping Deals";;
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    private ovlpErrorCount: Array<any> = [];
    private isOvlpAccess: boolean = false;
    private isdealEndDateNeedChange: boolean = false;
    private isRevalidate: boolean = false;
    private isDealEndDateChange: boolean = false;
    private isReqChange: boolean = false;
    private selectBtnText: string = "Select All";
    private ovlpData: any;
    private isSelectAll: boolean = true;
    private showKendoAlert: boolean = false;
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
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];    

    prepareGridData(Data) {
        for (var i = 0; i < Data.length; i++) {
            Data[i]["IS_SEL"] = false;
        }
        return Data;
    }

    getUIelement(value) {
        var hasResolved = false;
        var cnt = 0;
        var is_selected = false;
        this.isOvlpAccess = true;
        this.isdealEndDateNeedChange = false;
        this.isRevalidate = false;
        this.isDealEndDateChange = false;
        this.isReqChange = false;
        if (value != undefined && value != null && value != '') {
            var groupRow = _.filter(this.gridResult, { 'WIP_DEAL_OBJ_SID': value, 'PROGRAM_PAYMENT': 'Frontend YCS2' });

            if (groupRow.length > 1) {
                is_selected = groupRow[0].IS_SEL;
                //dataItem["IS_SEL"] = groupRow[0].IS_SEL
                if (_.filter(groupRow, { 'WF_STG_CD': 'Draft' }).length > 1) {
                    cnt = groupRow.length;
                }
                else if (_.filter(groupRow, { 'WF_STG_CD': 'Draft' }).length === 1) {
                    cnt = 1;
                }
                else {
                    cnt = 2;
                }
            }

            if (this.ovlpErrorCount.indexOf(value) > -1) {
                hasResolved = true;
            }

            if (hasResolved && cnt > 0 && cnt === 1 && this.isOvlpAccess) {
                this.isdealEndDateNeedChange = true;
            }
            else if (hasResolved && cnt > 1 && this.isOvlpAccess) {
                this.isRevalidate = true;
            }
            else if (!hasResolved) {
                this.isDealEndDateChange = true;
            }
            else {
                this.isReqChange = true;
            }
            return true;
        }
        else {
            return false;
        }
    }

    rejectOvlp(value) {
        this.showKendoAlert = true;
    }

    acceptOvlp(value) {
        alert('accept');
    }

    closeKendoAlert() {
        this.showKendoAlert = false;
    }

    selectAllOvlp(value) {
        this.isSelectAll = !value;
        _.each(this.gridResult, item => {
            if (item.PROGRAM_PAYMENT == "Frontend YCS2") {
                item.IS_SEL = value;
            }
        })
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    getOverlapCheckDetails() {
        this.pricingId = this.curPricingTable.DC_ID;
        this.overLappingCheckDealsSvc.getOverLappingCheckDealsDetails(this.pricingId).subscribe((result: any) => {            
            this.isLoading = false;
            this.ovlpData = this.prepareGridData(result.Data);
            this.ovlpErrorCount = distinct(result.Data, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
            this.gridResult = this.ovlpData;
            let groups = [{ field: "PROGRAM_PAYMENT" },
            { field: "WIP_DEAL_OBJ_SID" }];
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('OverLapDeals service', error);
        });
        this.overLappingCheckDealsSvc.readContract(this.pricingId).subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        });
        this.S_ID = this.contractData.CUST_MBR_SID;
        this.overLappingCheckDealsSvc.getCustomerVendors(this.S_ID).subscribe(
            (result: Array<any>) => {
                console.log(result);
            },
            function (response) {
                this.loggerSvc.error(
                    "Unable to get Customer Vendors.",
                    response,
                    response.statusText
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


    ngOnInit() {
        if (this.curPricingTable == undefined) {
            this.curPricingTable = this.data.currPt;
            this.contractData = this.data.contractData;
        }
        this.getOverlapCheckDetails();
    }


}


angular.module("app").directive(
    "overlappingCheckDeal",
    downgradeComponent({
        component: OverlappingCheckComponent,
    })
);