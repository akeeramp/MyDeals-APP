import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { logger } from "../../../shared/logger/logger";
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
    @Input() responseData: any;
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
    private is_selected: boolean = false;
    private isNoDealsFound: boolean = false;
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
        },
        {
            text: "250",
            value: 250
        },
        {
            text: "500",
            value: 500
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
        this.is_selected = false;
        this.isOvlpAccess = true;
        this.isdealEndDateNeedChange = false;
        this.isRevalidate = false;
        this.isDealEndDateChange = false;
        this.isReqChange = false;
        if (value != undefined && value != null && value != '') {
            var groupRow = _.filter(this.gridResult, { 'WIP_DEAL_OBJ_SID': value, 'PROGRAM_PAYMENT': 'Frontend YCS2' });

            if (groupRow.length > 1) {
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
                this.is_selected = groupRow[0].IS_SEL;
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

    acceptOvlp(WIP_DEAL_OBJ_SID, YCS2_OVERLAP_OVERRIDE) {
        var tempdata = this.ovlpData;
        var START_DT = '';
        var END_DT = '';
        var dcID = 0;
        var splitData = [];
        if (WIP_DEAL_OBJ_SID.toString().indexOf(',') > -1) {
            splitData = WIP_DEAL_OBJ_SID.toString().split(',');
        }
        else {
            splitData.push(WIP_DEAL_OBJ_SID);
        }
        _.each(splitData, item => {
            var data = parseInt(item);
            var dealinfo = _.filter(this.ovlpData, { 'WIP_DEAL_OBJ_SID': data, 'WF_STG_CD': "Draft", OVLP_CD: "SELF_OVLP" });
            if (dealinfo != undefined && dealinfo != null && dealinfo.length > 0) {
                START_DT = dealinfo[0].START_DT;
                END_DT = dealinfo[0].END_DT;
            }
        })
        this.updateOverlapping(splitData, YCS2_OVERLAP_OVERRIDE);
    }

    updateOverlapping(data, YCS2_OVERLAP_OVERRIDE) {
        this.isLoading = true;
        this.overLappingCheckDealsSvc.updateOverlappingDeals(data, YCS2_OVERLAP_OVERRIDE).subscribe((result: any) => {
            this.isLoading = false;
            if (result[0].PRICING_TABLES > 0) {
                if (YCS2_OVERLAP_OVERRIDE === 'N') {
                    for (var j = 0; j < data.length; j++) {
                        this.ovlpErrorCount.push(parseInt(data[j]));
                        //Finding all the indexes in an Array
                        this.resetIsSelect(parseInt(data[j]));
                    }
                }
                else {
                    for (var j = 0; j < data.length; j++) {
                        if (this.ovlpErrorCount.indexOf(parseInt(data[j])) > -1) {
                            this.ovlpErrorCount.splice(this.ovlpErrorCount.indexOf(parseInt(data[j])), 1);
                        }
                        this.resetIsSelect(parseInt(data[j]));
                    }
                }

            }
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('OverLapDeals service', error);
        });
    }

    //Reset IS_SEL
    resetIsSelect(data) {
        for (var m = 0; m < this.ovlpData.length; m++) {
            if (this.ovlpData[m].WIP_DEAL_OBJ_SID == parseInt(data) && this.ovlpData[m].PROGRAM_PAYMENT === "Frontend YCS2") {
                this.ovlpData[m].IS_SEL = false;
            }
        }
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

    selectCheckBox(value) {
        _.each(this.gridResult, item => {
            if (item.WIP_DEAL_OBJ_SID == value && item.PROGRAM_PAYMENT == "Frontend YCS2") {
                item.IS_SEL = !item.IS_SEL;
            }
        })
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    acceptSelectAll() {
        var selectedIDS = _.filter(this.gridResult, { 'IS_SEL': true, 'PROGRAM_PAYMENT': 'Frontend YCS2' });
        var ids = distinct(selectedIDS, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
        if (selectedIDS.length > 0) {
            this.acceptOvlp(ids.toString(), 'Y');
        }
        else {
            this.loggerSvc.error('Select An overlap with an Active or Draft deal', 'OverLap');
        }
    }

    getOverlapCheckDetails() {
        this.pricingId = this.curPricingTable.DC_ID;
        if (!!this.responseData && this.responseData) {
            this.ovlpData = this.prepareGridData(this.responseData);
            this.ovlpErrorCount = distinct(this.responseData, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
            this.gridResult = this.ovlpData;
            if (this.gridResult.length == 0) {
                this.isNoDealsFound = true;
            }
            else {
                this.isNoDealsFound = false;
            }
            let groups = [{ field: "PROGRAM_PAYMENT" },
            { field: "WIP_DEAL_OBJ_SID" }];
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        }
        else
        {
            this.overLappingCheckDealsSvc.getOverLappingCheckDealsDetails(this.pricingId).subscribe((result: any) => {
                this.isLoading = false;
                this.ovlpData = this.prepareGridData(result.Data);
                this.ovlpErrorCount = distinct(result.Data, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
                this.gridResult = this.ovlpData;
                if (this.gridResult.length == 0) {
                    this.isNoDealsFound = true;
                }
                else {
                    this.isNoDealsFound = false;
                }
                let groups = [{ field: "PROGRAM_PAYMENT" },
                { field: "WIP_DEAL_OBJ_SID" }];
                this.state.group = groups;
                this.gridData = process(this.gridResult, this.state);
            }, (error) => {
                this.isLoading = false;
                this.loggerSvc.error('OverLapDeals service', error);
            });
        }



        this.overLappingCheckDealsSvc.readContract(this.pricingId).subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        },(err)=>{
            this.loggerSvc.error("Unable to get contract data","Error",err);
        });
        this.S_ID = this.contractData.CUST_MBR_SID;
        this.overLappingCheckDealsSvc.getCustomerVendors(this.S_ID).subscribe(
            (result: Array<any>) => {},
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

    openDealEditor(value) {
        window.location.href = "#/contractmanager/WIP/" + value.CONTRACT_NBR + "/" + value.PRICE_STRATEGY + "/" + value.PRICING_TABLES + "/" + value.OVLP_DEAL_OBJ_SID;
    }

    getOverlapDetails() {
        this.pricingId = this.contractData.DC_ID;
        this.overLappingCheckDealsSvc.getOverLappingDealsDetails(this.pricingId).subscribe((result: any) => {
            this.loadMessage = "Done";
            this.ovlpData = this.prepareGridData(result.Data);
            this.ovlpErrorCount = distinct(result.Data, "WIP_DEAL_OBJ_SID").map(item => item["WIP_DEAL_OBJ_SID"]);
            this.gridResult = result.Data;
            if (this.gridResult.length == 0) {
                this.isNoDealsFound = true;
            }
            else {
                this.isNoDealsFound = false;
            }
            let groups = [{ field: "PROGRAM_PAYMENT" },
            { field: "WIP_DEAL_OBJ_SID" }];
            // this.filterOverLapData(this.gridResult);
            this.state.group = groups;
            this.gridData = process(this.gridResult, this.state);
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('OverLapDeals service', error);
        });
        this.overLappingCheckDealsSvc.readContract(this.pricingId).subscribe((response: Array<any>) => {
            this.contractDetails = response[0];
        }, (err) => {
            this.loggerSvc.error("Unable to get contract data", "Error", err);
        });
        this.S_ID = this.contractData.CUST_MBR_SID;

        this.overLappingCheckDealsSvc.getCustomerVendors(this.S_ID).subscribe(
            (result: Array<any>) => {
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

    ngOnInit() {
        if (this.curPricingTable == undefined) {
            this.curPricingTable = this.data.currPt;
            this.contractData = this.data.contractData;
            this.responseData = this.data.responseData;
        }
        if (this.data.srcScrn == "overLapping") {
            this.getOverlapDetails();
        }
        else {
            this.getOverlapCheckDetails();
        }
    }


}
