import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { managerExcludeGroupsService } from './managerExcludeGroups.service';
import { logger } from "../../shared/logger/logger";
import { DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from "@angular/material/core";
import { RowClassArgs, RowArgs } from "@progress/kendo-angular-grid";
import * as moment from "moment";

@Component({
    selector: "exclude-deal-group-modal-dialog",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/excludeDealGroupModal.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class excludeDealGroupModalDialog {
    pctGroupDealsView: boolean = false;
    showKendoAlert: boolean;
    titleText: string;
    isData: boolean;
    isLoading: boolean;
    constructor(public dialogRef: MatDialogRef<excludeDealGroupModalDialog>, @Inject(MAT_DIALOG_DATA) public dataItem: any, private managerExcludeGrpSvc: managerExcludeGroupsService, private loggerSvc: logger) {
    }
    private isSelected: boolean = true;
    private role = (<any>window).usrRole;
    private wwid = (<any>window).usrWwid;
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";
    private gridResult = [];
    private dealArray = [];
    private dealId;
    private childGridData;
    private childGridData1;
    private childGridData2;
    private childgridColumns;
    private childGridResult;
    private color: ThemePalette = 'primary';
    private GRP_BY = 0;
    private enabledList = ["Pending", "Approved"];
    private hasCheckbox: boolean = false;
    private enableCheckbox;
    private hasComment = false;
    private isDealToolsChecked = false;
    private DEAL_GRP_CMNT;
    private OVLP_DEAL_ID: Array<any>;
    @Output() public selectAllData: EventEmitter<void> = new EventEmitter()

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            filters: [],
            logic: "and",
        }
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
    public gridData: any;

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        if (state.filter.filters[0] && (state.filter.filters[0]['filters'][0]['field'] == "OVLP_DEAL_STRT_DT" || state.filter.filters[0]['filters'][0]['field'] == "OVLP_DEAL_END_DT")) {
            state.filter.filters[0]['filters'][0]['value'] = moment(state.filter.filters[0]['filters'][0]['value']).format("MM/DD/YYYY")
            if (state.filter.filters[0]['filters'] != undefined && state.filter.filters[0]['filters'].length == 2) {
                state.filter.filters[0]['filters'][1]['value'] = moment(state.filter.filters[0]['filters'][1]['value']).format("MM/DD/YYYY")
            }
        }
        this.gridData = process(this.gridResult, this.state);
        let childgridresult1 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 1);
        let childgridresult2 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 0);
        this.childGridData1 = process(childgridresult1, this.state);
        this.childGridData2 = process(childgridresult2, this.state);
        this.childGridData = process(this.childGridResult, this.state);
        if (this.childGridData.data.length > 0) {
            this.gridData.data = this.gridResult;
        }
        if (state.filter.filters[0] && (state.filter.filters[0]['filters'][0]['field'] == "OVLP_DEAL_STRT_DT" || state.filter.filters[0]['filters'][0]['field'] == "OVLP_DEAL_END_DT")) {
            state.filter.filters[0]['filters'][0]['value'] = new Date(state.filter.filters[0]['filters'][0]['value'])
            if (state.filter.filters[0]['filters'] != undefined && state.filter.filters[0]['filters'].length == 2) {
                state.filter.filters[0]['filters'][1]['value'] = new Date(state.filter.filters[0]['filters'][1]['value'])
            }
        }
    }

    public expandInStockProducts({ dataItem }: RowArgs): boolean {
        return true;
    }
    public expandedDetailKeys: any[] = ['Deals below are included as part of the Cost Test', 'Deals shown in grey overlap but are NOT included as part of the Cost Test'];

    public expandDetailsBy = (dataItem: any): number => {
        return dataItem.data;
    };

    clkAllItems(): void {
        for (let i = 0; i < this.childGridResult.length; i++) {
            if (this.childGridResult[i].CST_MCP_DEAL_FLAG === 1) {
                this.childGridResult[i].selected = !this.isDealToolsChecked;
            }
        }
        let childgridresult1 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 1);
        let childgridresult2 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 0);
        this.childGridData1 = process(childgridresult1, this.state);
        this.childGridData2 = process(childgridresult2, this.state);
        this.childGridData = process(this.childGridResult, this.state);
    }

    getFormatedDim(dataItem, field, dim, format) {
        const item = dataItem[field];
        if (item === undefined || item[dim] === undefined) return ""; //return item; // Used to return "undefined" which would show on the UI.
        if (format === "currency") {
            const isDataNumber = /^\d + $/.test(item[dim]);
            if (isDataNumber) return item[dim];
            return (item[dim].includes('No')) ? item[dim] : '$' + item[dim];
        }
        return item[dim];
    }
    public rowCallback = (context: RowClassArgs) => {
        const exChk = context.dataItem.EXCLD_DEAL_FLAG;
        const cstChk = context.dataItem.CST_MCP_DEAL_FLAG;
        if (cstChk === 1 || (cstChk === 0 && exChk === 1)) { return { blue: true } }
        else if (cstChk === 0) { return { grey: true } }
        else if (cstChk === 2) { return { blue: true } }
        else { return { grey: true } }
    };

    public rowCallbackParent = (context: RowClassArgs) => {
        return { navyblue: true }
    };
    close(): void {
        this.dialogRef.close();
    }


    ok() {
        this.OVLP_DEAL_ID = this.childGridResult.filter(x => x.selected == true).map(y => y.OVLP_DEAL_ID).join();
        const returnVal: any = [];
        const value: any = {};
        value.DEAL_GRP_CMNT = this.DEAL_GRP_CMNT;
        value.DEAL_GRP_EXCLDS = this.OVLP_DEAL_ID;
        returnVal.push(value);
        if (value.DEAL_GRP_EXCLDS !== null && value.DEAL_GRP_EXCLDS !== "" && value.DEAL_GRP_CMNT === "") {
            this.showKendoAlert = true;
        } else {
            this.dialogRef.close(returnVal);
        }
    }
    cancel(): void {
        this.dialogRef.close();
    }
    closeKendoAlert() {
        this.showKendoAlert = false;
    }

    loadExcludeDealGroupModel() {
        this.isLoading = true;
        if (this.dataItem.cellCurrValues?.DEAL_ID) {
            this.pctGroupDealsView = true;
        }
        this.dealId = this.dataItem.cellCurrValues?.DC_ID ? this.dataItem.cellCurrValues.DC_ID : this.dataItem.cellCurrValues.DEAL_ID;
        this.dealArray.push(this.dataItem.cellCurrValues);
        var gdata = JSON.parse(JSON.stringify(this.dealArray));
        for (let row of gdata) {
            var ecap = row["ECAP_PRICE"] === undefined || row["ECAP_PRICE"] === null
                ? ""
                : (row["ECAP_PRICE"]["20___0"] === undefined || row["ECAP_PRICE"]["20___0"] === null)
                    ? row["ECAP_PRICE"]
                    : row["ECAP_PRICE"]["20___0"];
            var cntrctTtl = "Product: " + (row["TITLE"]);
            let a = {};
            a["OVLP_DEAL_ID"] = row["DC_ID"] === undefined || row["DC_ID"] === "" ? row["DEAL_ID"] : row["DC_ID"]
            a["OVLP_DEAL_TYPE"] = row['OBJ_SET_TYPE_CD']
            a["OVLP_REBT_TYPE"] = row["REBATE_TYPE"] === undefined || row["REBATE_TYPE"] == "" ? row["REBT_TYPE"] : row["REBATE_TYPE"]
            a["OVLP_CNTRCT_NM"] = cntrctTtl
            a["OVLP_WF_STG_CD"] = this.pctGroupDealsView ? row["WF_STG_CD"] : row["DSPL_WF_STG_CD"]
            a["OVLP_DEAL_END_DT"] = this.pctGroupDealsView ? row["DEAL_END_DT"] : row["END_DT"]
            a["OVLP_DEAL_STRT_DT"] = this.pctGroupDealsView ? row["DEAL_STRT_DT"] : row["START_DT"]
            a["OVLP_ADDITIVE"] = this.pctGroupDealsView ? row["ADDITIVE"] : row["DEAL_COMB_TYPE"]
            a["OVLP_DEAL_DESC"] = row["DEAL_DESC"]
            a["OVLP_ECAP_PRC"] = Number(ecap)
            a["OVLP_MAX_RPU"] = row["MAX_RPU"]
            a["OVLP_MKT_SEG"] = row["MRKT_SEG"]
            a["OVLP_CNSMPTN_RSN"] = this.pctGroupDealsView ? row["CNSMPTN_RSN"] : row["CONSUMPTION_REASON"]
            this.gridResult.push(a);

        }
        this.gridData = process(this.gridResult, this.state);
        this.managerExcludeGrpSvc.getExcludeGroupDetails(this.dealId).subscribe((result: any) => {
            this.isLoading = false;;
            this.childGridResult = result;
            if (this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != undefined && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != null && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != '') {
                const selectedDealIds = this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS.split(',');
                for (let i = 0; i < this.childGridResult.length; i++) {
                    if (selectedDealIds.indexOf(this.childGridResult[i].OVLP_DEAL_ID.toString()) > -1) {
                        this.childGridResult[i].selected = true;
                    }

                }
            }
            let childgridresult1 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 1);
            let childgridresult2 = this.childGridResult.filter(x => x.CST_MCP_DEAL_FLAG === 0);
            this.childGridData1 = process(childgridresult1, this.state);
            this.childGridData2 = process(childgridresult2, this.state);
            if (this.childGridData1.data.length > 0 && this.childGridData2.data.length > 0) {
                this.isData = true;
                this.childgridColumns = [{ data: 'Deals below are included as part of the Cost Test' }, { data: 'Deals shown in grey overlap but are NOT included as part of the Cost Test' }];
            }
            else if (this.childGridData1.data.length > 0 && this.childGridData2.data.length == 0) {
                this.isData = true;
                this.childgridColumns = [{ data: 'Deals below are included as part of the Cost Test' }];
            }
            else if (this.childGridData2.data.length > 0 && this.childGridData1.data.length == 0) {
                this.isData = true;
                this.childgridColumns = [{ data: 'Deals shown in grey overlap but are NOT included as part of the Cost Test' }];
            }
            else {
                this.isData = false;
            }
            this.childGridData = process(this.childGridResult, this.state);
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('Customer service subgrid', error);
        })
        this.enableCheckbox = this.enabledList.indexOf(this.dataItem.cellCurrValues.PS_WF_STG_CD);
        if (this.enableCheckbox < 0 && ((<any>window).usrRole !== "DA")) {
            this.hasCheckbox = true;
        }
        if (this.dataItem?.enableCheckbox == false) {
            this.hasCheckbox = this.dataItem.enableCheckbox;
        }
        this.DEAL_GRP_CMNT = (this.dataItem.cellCurrValues.DEAL_GRP_CMNT === null || this.dataItem.cellCurrValues.DEAL_GRP_CMNT == undefined) ? "" : this.dataItem.cellCurrValues.DEAL_GRP_CMNT;
    }

    convertToChildData(dataItem) {
        if (dataItem.data == 'Deals below are included as part of the Cost Test') {
            if (!this.hasCheckbox) {
                this.titleText = "Cannot edit when deal is in Sumbitted, Pending, Active, Offer or Won stages."
            }
            else {
                this.titleText = null;
            }
            return this.childGridData1;
        }
        else {
            this.titleText = "This deal does not belong in any Cost Test Group and will be ignored in the Cost Test calculations."
            return this.childGridData2;

        }
    }

    ngOnInit() {
        this.loadExcludeDealGroupModel();
    }
}
