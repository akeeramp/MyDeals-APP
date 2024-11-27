import { Component, EventEmitter, Inject, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataStateChangeEvent, ExcelExportEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from "@angular/material/core";
import { RowClassArgs, RowArgs } from "@progress/kendo-angular-grid";
import { sortBy } from 'underscore';
import { saveAs } from "@progress/kendo-file-saver";
import { Workbook } from '@progress/kendo-angular-excel-export';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

import { managerExcludeGroupsService } from './managerExcludeGroups.service';
import { logger } from "../../shared/logger/logger";
import { MomentService } from "../../shared/moment/moment.service";

@Component({
    selector: "exclude-deal-group-modal-dialog",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/excludeDealGroupModal.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})
export class excludeDealGroupModalDialog implements OnDestroy{
    pctGroupDealsView: boolean = false;
    showKendoAlert: boolean;
    titleText: string;
    isData: boolean;
    isLoading: boolean;
    constructor(public dialogRef: MatDialogRef<excludeDealGroupModalDialog>,
                @Inject(MAT_DIALOG_DATA) public dataItem: any,
                private managerExcludeGrpSvc: managerExcludeGroupsService,
                private loggerSvc: logger,
                private momentService: MomentService) {}
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private isSelected: boolean = true;    
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";
    private gridResult = [];
    private dealArray = [];
    private dealId;
    private childGridData;
    private childGridData1;
    private childGridData2;
    private childGrid = [];
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
    @Output() public selectAllData: EventEmitter<void> = new EventEmitter();
    public isConsumptionToggleOn: boolean = true;
    private readonly childGroup1Title = 'Deals below are included as part of the Cost Test';

    private state: State = {
        skip: 0,
        group: [],
        filter: {
            filters: [],
            logic: "and",
        }
    }
    public gridData: GridDataResult;

    public Consumptioncolumns = [
        { title: "Payout Based On", field: "OVLP_CONSUMPTION_PAYOUT_BASED_ON" },
        { title: "Billings START Date (for Consumption)",field: "OVLP_CONSUMPTION_REBATE_BILLING_STRT_DATE" },
        { title: "Billings END Date (for Consumption)",  field: "OVLP_CONSUMPTION_REBATE_BILLING_END_DATE" },
        { title: "Billing Rolling Lookback Period (Months)", field:"OVLP_CONSUMPTION_LOOKBACK_PERIOD" },
        { title :"Consumption Type" ,field:"OVLP_CONSUMPTION_TYPE" },
        { title: "Customer Segment", field: "OVLP_CONSUMPTION_CUSTOMER_SEGMENT" },
        { title: "Customer Reported Sales Geo", field: "OVLP_CONSUMPTION_RPT_GEO" },
        { title: "System Price Point", field: "OVLP_CONSUMPTION_SYSTEM_PRICE_POINT" },
        { title: "Project Name", field: "OVLP_CONSUMPTION_PROJECT_NAME" },
        { title: "Consumption Reason Comment", field: "OVLP_CONSUMPTION_REASON_CMNT" }];

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
        this.state.filter.filters.forEach((row) => {
            if (row['filters'][0]['field'] == "OVLP_DEAL_STRT_DT" || row['filters'][0]['field'] == "OVLP_DEAL_END_DT") {
                this.childGridResult.forEach((row) => {
                    row.OVLP_DEAL_STRT_DT = new Date(row.OVLP_DEAL_STRT_DT);
                    row.OVLP_DEAL_END_DT = new Date(row.OVLP_DEAL_END_DT);
                })
            }
        })
        this.childGridData = process(this.childGridResult, this.state);
        this.state.filter.filters.forEach((row) => {
            if (row['filters'][0]['field'] == "OVLP_DEAL_STRT_DT" || row['filters'][0]['field'] == "OVLP_DEAL_END_DT") {
                this.childGridResult.forEach((row) => {
                    row.OVLP_DEAL_STRT_DT = row.OVLP_DEAL_STRT_DT.toLocaleDateString();
                    row.OVLP_DEAL_END_DT = row.OVLP_DEAL_END_DT.toLocaleDateString();                                       
                })
            }
        })
        //included in PCT
        this.childGridData1 = this.childGridData.data.filter(x => x.GRP_BY === 1);
        // not included in PCT
        this.childGridData2 = this.childGridData.data.filter(x => x.GRP_BY === 2);
        if (this.childGridData.data.length > 0) {
            this.gridData.data = this.gridResult;
        }
    }

    public expandInStockProducts({ dataItem }: RowArgs): boolean {
        return true;
    }
    public expandedDetailKeys: any[] = [this.childGroup1Title, 'Deals shown in grey overlap but are NOT included as part of the Cost Test'];

    public expandDetailsBy = (dataItem: any): number => {
        return dataItem.data;
    };

    clkAllItems(event): void {
        this.childGridData.data.forEach((row) => {
                row.selected = event.target.checked;
        });
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
        if (cstChk === 1 || cstChk === 2 || (cstChk === 0 && exChk === 1)) { return 'childColor blue' }
        else {
            return 'grey'
        }
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

    loadExcludeDealGroupModel(isToggleOn: boolean = true) {
        this.isLoading = true;
        this.hasCheckbox = true;
        this.gridResult = [];
        this.dealArray = [];
        this.childGridData = null;
        this.childGridData1 = null;
        this.childGridData2 = null;
        this.childGrid = [];
        this.childGridResult = null;

        if (this.dataItem.cellCurrValues?.DEAL_ID) {
            this.pctGroupDealsView = true;
        }
        this.dealId = this.dataItem.cellCurrValues?.DC_ID ? this.dataItem.cellCurrValues.DC_ID : this.dataItem.cellCurrValues.DEAL_ID;
        this.dealArray.push(this.dataItem.cellCurrValues);
        let groupData = JSON.parse(JSON.stringify(this.dealArray));
        for (let row of groupData) {
            let ecap = row["ECAP_PRICE"] === undefined || row["ECAP_PRICE"] === null
                ? ""
                : (row["ECAP_PRICE"]["20___0"] === undefined || row["ECAP_PRICE"]["20___0"] === null)
                    ? row["ECAP_PRICE"]
                    : row["ECAP_PRICE"]["20___0"];
            let contractTitle = row["REBT_TYPE"] && row["REBT_TYPE"] == "TENDER" ? "My Deals Product: " + (row["PRODUCT"]) : row["TITLE"] ? "My Deals Product: " + (row["TITLE"]) : "My Deals Product: " + (row["PRODUCT"]);
            let mydealTitle = row["REBT_TYPE"] && row["REBT_TYPE"] == "TENDER" ? (row["PRODUCT"]) : row["PTR_USER_PRD"] ? (row["PTR_USER_PRD"]) : (row["PRODUCT"]);
            let a = {};
            a["OVLP_DEAL_ID"] = row["DC_ID"] === undefined || row["DC_ID"] === "" ? row["DEAL_ID"] : row["DC_ID"];
            a["OVLP_DEAL_TYPE"] = row['OBJ_SET_TYPE_CD'];
            a["OVLP_REBT_TYPE"] = row["REBATE_TYPE"] === undefined || row["REBATE_TYPE"] == "" ? row["REBT_TYPE"] : row["REBATE_TYPE"];
            a["OVLP_CNTRCT_NM"] = contractTitle;
            a["OVLP_PTR_USER_PRD"] = mydealTitle;
            a["OVLP_WF_STG_CD"] = this.pctGroupDealsView ? row["WF_STG_CD"] : row["DSPL_WF_STG_CD"];
            a["OVLP_DEAL_END_DT"] = this.pctGroupDealsView ? row["DEAL_END_DT"] : row["END_DT"];
            a["OVLP_DEAL_STRT_DT"] = this.pctGroupDealsView ? row["DEAL_STRT_DT"] : row["START_DT"];
            a["OVLP_ADDITIVE"] = this.pctGroupDealsView ? row["ADDITIVE"] : row["DEAL_COMB_TYPE"];
            a["OVLP_DEAL_DESC"] = row["DEAL_DESC"];
            a["OVLP_ECAP_PRC"] = row["REBT_TYPE"] && row["REBT_TYPE"] == "TENDER" ? row["ECAP_PRC"] : Number(ecap);
            a["OVLP_MAX_RPU"] = row["MAX_RPU"];
            a["OVLP_MKT_SEG"] = row["MRKT_SEG"];
            a["OVLP_CNSMPTN_RSN"] = this.pctGroupDealsView ? row["CNSMPTN_RSN"] : row["CONSUMPTION_REASON"];
            a["OVLP_CONSUMPTION_CUST_PLATFORM"] = row["CONSUMPTION_CUST_PLATFORM"];
            a["OVLP_CONSUMPTION_SYS_CONFIG"] = row["CONSUMPTION_SYS_CONFIG"];
            a["OVLP_CONSUMPTION_COUNTRY_REGION"] = row["CONSUMPTION_COUNTRY_REGION"];
            a["OVLP_CONSUMPTION_PAYOUT_BASED_ON"] = row["PAYOUT_BASED_ON"]
            a["OVLP_CONSUMPTION_REBATE_BILLING_STRT_DATE"] = row["REBATE_BILLING_START"];
            a["OVLP_CONSUMPTION_REBATE_BILLING_END_DATE"] = row["REBATE_BILLING_END"];
            a["OVLP_CONSUMPTION_LOOKBACK_PERIOD"] = row["CONSUMPTION_LOOKBACK_PERIOD"];
            a["OVLP_CONSUMPTION_TYPE"] = row["CONSUMPTION_TYPE"];
            a["OVLP_CNSMPTN_RSN"] = row["CONSUMPTION_REASON"];
            a["OVLP_CONSUMPTION_REASON_CMNT"] = row["CONSUMPTION_REASON_CMNT"];
            a["OVLP_CONSUMPTION_CUSTOMER_SEGMENT"] = row["CONSUMPTION_CUST_SEGMENT"];
            a["OVLP_CONSUMPTION_RPT_GEO"] = row["CONSUMPTION_CUST_RPT_GEO"];
            a["OVLP_CONSUMPTION_SYSTEM_PRICE_POINT"] = row["SYS_PRICE_POINT"];
            a["OVLP_CONSUMPTION_PROJECT_NAME"] = row["QLTR_PROJECT"];
                
            
            this.gridResult.push(a);
        }
        this.gridData = process(this.gridResult, this.state);
        this.managerExcludeGrpSvc.getExcludeGroupDetails(this.dealId, isToggleOn).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
            this.isLoading = false;;
            this.childGridResult = result;
            if (this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != undefined && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != null && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != '') {
                const selectedDealIds = this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS.split(',').map(x=>x.trim());
                for (let i = 0; i < this.childGridResult.length; i++) {
                    if (selectedDealIds.indexOf(this.childGridResult[i].OVLP_DEAL_ID.toString()) > -1) {
                        this.childGridResult[i].selected = true;
                    }

                }
            }

            for (let i = 0; i < this.childGridResult.length; i++) {
                let exChk = this.childGridResult[i]["EXCLD_DEAL_FLAG"];
                let cstChk =this.childGridResult[i]["CST_MCP_DEAL_FLAG"];
                if (this.childGridResult[i]["SELF_OVLP"] !== 1) {
                    if (cstChk === 1 || (cstChk === 0 && exChk === 1)) {
                        this.childGridResult[i]["GRP_BY"] = 1;
                    } else if (cstChk === 0) {
                        this.childGridResult[i]["GRP_BY"] = 2;
                    } else if (cstChk === 2) {
                        this.childGridResult[i]["GRP_BY"] = 1;
                    } else {
                        this.childGridResult[i]["GRP_BY"] = 2;
                    }
                }
            }

            this.childGridResult = sortBy(sortBy(sortBy(this.childGridResult, 'OVLP_WF_STG_CD'), 'CST_MCP_DEAL_FLAG').reverse(), 'EXCLD_DEAL_FLAG').reverse();
            this.childGridData = process(this.childGridResult, this.state);
            //filtering child grid accordingly - whether included in PCT or not
            //included in PCT
            this.childGridData1 = this.childGridData.data.filter(x => x.GRP_BY === 1);
            // not included in PCT
            this.childGridData2 = this.childGridData.data.filter(x => x.GRP_BY === 2);
            if (this.childGridData1.length > 0) {
                this.isData = true;
                this.childGrid[0] = [{ data: this.childGroup1Title }];
            }
            if (this.childGridData2.length > 0) {
                this.isData = true;
                this.childGrid[1] = [{ data: 'Deals shown in grey overlap but are NOT included as part of the Cost Test' }];
            }
            if (this.childGridData1.length == 0 && this.childGridData2.length == 0) {
                this.isData = false;
            }
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
        if ((this.gridData && this.gridData.data && this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'active'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'offer' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'won'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'pending' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'submitted'))
            this.hasCheckbox = false;
        this.DEAL_GRP_CMNT = (this.dataItem.cellCurrValues.DEAL_GRP_CMNT === null || this.dataItem.cellCurrValues.DEAL_GRP_CMNT == undefined) ? "" : this.dataItem.cellCurrValues.DEAL_GRP_CMNT;
    }
    viewConsumptionOnly() {
        if (this.isConsumptionToggleOn) {
            this.loadExcludeDealGroupModel(true);
        }
        else {
            this.loadExcludeDealGroupModel(false);
        }
    }

    //handling changes on toggle changes
    onToggleChange() {
        this.childGrid = []
        //during on condition all the values are displayed including unchecked and deals overlapped
        if (this.isSelected) {
            //filtering child grid accordingly - whether included in PCT or not
            //included in PCT
            this.childGridData1 = this.childGridData.data.filter(x => x.GRP_BY === 1);
            // not included in PCT
            this.childGridData2 = this.childGridData.data.filter(x => x.GRP_BY === 2);
            //checking for data included in PCT
            if (this.childGridData1.length > 0) {
                this.isData = true;
                this.childGrid[0] = [{ data: this.childGroup1Title }];
            }
            //checking for data not included in pct
            if (this.childGridData2.length > 0) {
                this.isData = true;
                this.childGrid[1] = [{ data: 'Deals shown in grey overlap but are NOT included as part of the Cost Test' }];
            }
            if (this.childGridData1.length == 0 && this.childGridData2.length == 0) {
                this.isData = false;
            }
        } else {
            // during off condition only data checked and included in PCT are shown
            this.childGridData1 = this.childGridData.data.filter(x => x.GRP_BY === 1 && x.EXCLD_DEAL_FLAG === 1);
            if (this.childGridData1.length > 0) {
                this.isData = true;
                this.childGrid[0] = [{ data: this.childGroup1Title }];
            }
            else {
                this.isData = false;
            }
        }
    }

    convertToChildData(dataItem) {
        if (dataItem.data == this.childGroup1Title) {
            return this.childGridData1;
        } else {
            return this.childGridData2;
        }
    }
    checkCheckboxIsDisabled(dataItem) {
        if (dataItem["CST_MCP_DEAL_FLAG"] && dataItem["CST_MCP_DEAL_FLAG"] === 0 && dataItem["EXCLD_DEAL_FLAG"] && dataItem["EXCLD_DEAL_FLAG"] === 0) {
            return true;
        }
        else if (dataItem["CST_MCP_DEAL_FLAG"] && dataItem["CST_MCP_DEAL_FLAG"] === 0 && dataItem["EXCLD_DEAL_FLAG"] && dataItem["EXCLD_DEAL_FLAG"] === 0) {
            return true
        } else if ((this.gridData && this.gridData.data && this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'active'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'offer' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'won'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'pending' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'submitted')) {
            return true;
        } else {
            return false;
        }
    }
    getTitle(dataItem) {
        if (dataItem["CST_MCP_DEAL_FLAG"] && dataItem["CST_MCP_DEAL_FLAG"] === 0 && dataItem["EXCLD_DEAL_FLAG"] && dataItem["EXCLD_DEAL_FLAG"] === 0)
            return "This deal does not belong in any Cost Test Group and will be ignored in the Cost Test calculations."
        if ((this.gridData && this.gridData.data && this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'active'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'offer' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'won'
            || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'pending' || this.gridData.data[0]["OVLP_WF_STG_CD"].toLowerCase() == 'submitted'))
            return "Cannot edit when deal is in Sumbitted, Pending, Active, Offer or Won stages."
        return ""
    }

    public onExcelExport(args: ExcelExportEvent): void {
        args.preventDefault();
        this.loading = true;

        const workbook = args.workbook;
        const workbookRows = workbook.sheets[0].rows;

        const headerBackgroundColour = workbookRows[0].cells[0].background;
        const headerTextColour = workbookRows[0].cells[0].color;

        if (this.isSelected) {   // Then include child row data
            // Included Group
            this.childGrid.forEach(childRow => {
                workbookRows.push({ cells: [Object.assign({ value: childRow[0].data, colSpan: workbook.sheets[0].columns.length, type: 'header', background: headerBackgroundColour, color: headerTextColour })]});

                if (childRow[0].data == this.childGroup1Title) {
                    this.spliceChildGridDataIntoWorkbook(workbookRows, this.childGridData1);
                } else {
                    this.spliceChildGridDataIntoWorkbook(workbookRows, this.childGridData2);
                }
            });
        }

        new Workbook(workbook).toDataURL().then((dataUrl: string) => {
            saveAs(dataUrl, 'ExcludeDealGroup.xlsx');
            this.loading =  false;
        });
    }

    private spliceChildGridDataIntoWorkbook(workbookRows, childGridData) {
        childGridData.forEach(childGridRow => {
            workbookRows.splice(workbookRows.length + 1, 0, { cells: this.generateChildRowData(childGridRow), type: 'data' });
        });
    }

    private generateChildRowData(childGridRowRaw) {
        const definedRows = ['OVLP_DEAL_ID', 'OVLP_DEAL_TYPE', 'OVLP_REBT_TYPE', 'OVLP_CNTRCT_NM', 'OVLP_PTR_USER_PRD', 'OVLP_WF_STG_CD', 'OVLP_DEAL_STRT_DT', 'OVLP_DEAL_END_DT', 'OVLP_ADDITIVE', 'OVLP_DEAL_DESC', 'OVLP_ECAP_PRC', 'OVLP_MAX_RPU', 'OVLP_MKT_SEG', 'OVLP_CONSUMPTION_CUST_PLATFORM', 'OVLP_CONSUMPTION_SYS_CONFIG', 'OVLP_CONSUMPTION_COUNTRY_REGION', 'OVLP_CNSMPTN_RSN'];

        let processedWorkbookRow = [];
        definedRows.forEach(rowField => {
            processedWorkbookRow.push({ value: childGridRowRaw[rowField] });
        });

        return processedWorkbookRow;
    }

    ngOnInit() {
        this.viewConsumptionOnly();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
