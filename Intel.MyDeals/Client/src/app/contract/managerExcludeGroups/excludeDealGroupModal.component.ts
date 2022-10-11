import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { managerExcludeGroupsService } from './managerExcludeGroups.service';
import { logger } from "../../shared/logger/logger";
import { DomSanitizer } from '@angular/platform-browser';
import { DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from "@angular/material/core";
import { RowClassArgs } from "@progress/kendo-angular-grid";

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
    constructor(public dialogRef: MatDialogRef<excludeDealGroupModalDialog>, @Inject(MAT_DIALOG_DATA) public dataItem: any, private managerExcludeGrpSvc: managerExcludeGroupsService, private loggerSvc: logger, private sanitized: DomSanitizer) {
    }

    private role = (<any>window).usrRole;
    private wwid = (<any>window).usrWwid;
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";
    private gridResult;
    private dealArray = [];
    private dealId;
    private childGridData;
    private childGridResult;
    private color: ThemePalette = 'primary';
    private GRP_BY = 0;
    private enabledList = ["Pending", "Approved"];
    private hasCheckbox: boolean;
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
            logic: "and",
            filters: [],
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
        this.gridData = process(this.gridResult, this.state);
    }
    clkAllItems(): void {
        for (let i = 0; i < this.childGridResult.length; i++) {
            this.childGridResult[i].selected = !this.isDealToolsChecked;
        }
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
        this.dialogRef.close(returnVal);
    }
    cancel(): void {
        this.dialogRef.close();
    }
    filterData(IS_SELECTED) {
        //dfsgddg;
    }

    loadExcludeDealGroupModel() {
        if(this.dataItem.cellCurrValues?.DEAL_ID){
            this.pctGroupDealsView = true;
        }
        this.dealId = this.dataItem.cellCurrValues?.DC_ID ? this.dataItem.cellCurrValues.DC_ID : this.dataItem.cellCurrValues.DEAL_ID;
        this.dealArray.push(this.dataItem.cellCurrValues);
        this.gridResult = this.dealArray;
        this.gridData = process(this.gridResult, this.state);
        this.managerExcludeGrpSvc.getExcludeGroupDetails(this.dealId).subscribe((result: any) => {
            this.childGridResult = result;
            if (this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != undefined && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != null && this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS != '') {
                const selectedDealIds = this.dataItem.cellCurrValues.DEAL_GRP_EXCLDS.split(',');
                for (let i = 0; i < this.childGridResult.length; i++) {
                    if (selectedDealIds.indexOf(this.childGridResult[i].OVLP_DEAL_ID.toString()) > -1) {
                        this.childGridResult[i].selected = true;
                    }

                }
            }

            this.childGridData = process(this.childGridResult, this.state);
        }, (error) => {
            this.loggerSvc.error('Customer service subgrid', error);
        })
        this.enableCheckbox = this.enabledList.indexOf(this.dataItem.cellCurrValues.PS_WF_STG_CD);
        if (this.enableCheckbox < 0 && ((<any>window).usrRole !== "DA")) {
            this.hasCheckbox = true;
        }
        this.DEAL_GRP_CMNT = (this.dataItem.cellCurrValues.DEAL_GRP_CMNT === null || this.dataItem.cellCurrValues.DEAL_GRP_CMNT == undefined) ? "" : this.dataItem.cellCurrValues.DEAL_GRP_CMNT;
    }

    ngOnInit() {
        this.loadExcludeDealGroupModel();
    }


}

angular.module("app").directive(
    "excludeDealGroupModalDialog",
    downgradeComponent({
        component: excludeDealGroupModalDialog,
    })
);