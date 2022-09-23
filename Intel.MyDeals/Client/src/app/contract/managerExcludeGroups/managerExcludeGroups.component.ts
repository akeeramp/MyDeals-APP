import * as angular from "angular";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, SelectAllCheckboxState, CellClickEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { managerExcludeGroupsService } from "./managerExcludeGroups.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { excludeDealGroupModalDialog } from "./excludeDealGroupModal.component"
import { GridUtil } from "../grid.util"
import { OverlappingCheckComponent } from "../ptModals/overlappingCheckDeals/overlappingCheckDeals.component";
@Component({
    selector: "manager-exclude-groups",
    templateUrl: "Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.html",
    styleUrls: ['Client/src/app/contract/managerExcludeGroups/managerExcludeGroups.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class managerExcludeGroupsComponent {
    showPCT: boolean = true;
    constructor(private loggerSvc: logger, private managerExcludeGrpSvc: managerExcludeGroupsService, private lnavSvc: lnavService, private headerSvc: headerService, private formBuilder: FormBuilder, protected dialog: MatDialog) {

    }
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() groupTab: any;
    userRole = ""; canEmailIcon = true;
    dealCnt = 0;
    elGrid = null;
    grid = null;
    wrapEnabled = false;
    isPSExpanded = []; isPTExpanded = {};
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private usrRole;
    private isSuper = true;
    private superPrefix = "";
    private extraUserPrivsDetail: Array<string> = [];
    private contractType = "Contract";
    private context = {};
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";
    private gridResult;
    public pricingStrategyFilter;
    private loading = true;

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
    gridDataSet = {}; parentGridData = {};
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;

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

    loadExcludeGroups() {
        this.isLoading = true;
        this.managerExcludeGrpSvc.readWipExclusionFromContract(this.contractData.DC_ID).subscribe((result: any) => {
            this.isLoading = false;
            this.gridResult = result.WIP_DEAL;
            for (let d = 0; d < this.gridResult.length; d++) {
                const item = this.gridResult[d];
                if (item["DEAL_GRP_EXCLDS"] === undefined || item["DEAL_GRP_EXCLDS"] === null) item["DEAL_GRP_EXCLDS"] = "";
                if (item["DEAL_GRP_CMNT"] === undefined || item["DEAL_GRP_CMNT"] === null) item["DEAL_GRP_CMNT"] = "";
                item["DSPL_WF_STG_CD"] = GridUtil.stgFullTitleChar(item);
                item["TITLE"] = item["TITLE"].replace(/,/g, ", ");
            }
            this.displayDealTypes();
            this.gridData = process(this.gridResult, this.state);
        }, (error) => {
            this.loggerSvc.error('Customer service', error);
            this.isLoading = false;
        });

    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    cellClickHandler(args: CellClickEvent): void {
        if (args.column.field == "DEAL_GRP_EXCLDS") {
            this.openExcludeDealGroupModal(args.dataItem);
        }
    }

    openExcludeDealGroupModal(dataItem) {
        const dialogRef = this.dialog.open(excludeDealGroupModalDialog, {
            width: "1900px",
            height: "600px",
            data: {
                cellCurrValues: dataItem
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {
            if (returnVal != undefined && returnVal != null && returnVal.length > 0) {
                this.updateModalDataItem(dataItem, "DEAL_GRP_CMNT", returnVal[0].DEAL_GRP_CMNT);
                this.updateModalDataItem(dataItem, "DEAL_GRP_EXCLDS", returnVal[0].DEAL_GRP_EXCLDS);
            }
        });
    }

    updateModalDataItem(dataItem, field, returnValue) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            dataItem[field] = returnValue;
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
        }
    }

    showHelpTopicGroup() {
        const helpTopic = "Grouping+Exclusions";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    saveAndRunPct() {
        const dirtyRecords = this.gridResult.filter(x => x._dirty == true);
        this.isLoading = true;
        this.managerExcludeGrpSvc.updateWipDeals(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, dirtyRecords).subscribe((result: any) => {
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
            this.managerExcludeGrpSvc.runPctContract(this.contractData.DC_ID).subscribe((res) => {
                this.loadExcludeGroups();
            }, (err) => {
                this.loggerSvc.error('Could not run Cost Test in Exclude Groups for contract', err);
                this.isLoading = false;
            });
        }, (error) => {
            this.loggerSvc.error('Could not update exclude deals', error);
            this.isLoading = false;
        });
    }
    togglePctFilter() {
        //kujoih
    }
    exportToExcel() {
        //kujoih
    }
    exportToExcelCustomColumns() {
        //kujoih
    }
    openOverlappingDealCheck() {
        let data = {
            "contractData": this.contractData,
            "currPt": this.contractData,
        }
        const dialogRef = this.dialog.open(OverlappingCheckComponent, {
            height: '530px',
            width: '800px',
            data: data,
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

    toggleWrap() {
    }
    displayDealTypes() {
        let data = this.gridResult;
        let modDealTypes = [];
        for (let i = 0; i < data.length; i++) {
            if(data[i].OBJ_SET_TYPE_CD){
                let deal= data[i].OBJ_SET_TYPE_CD;
                modDealTypes.push(deal.replace(/_/g, ' '));
            }
        }
        let dealsTypesArray = Array.from(new Set(modDealTypes));
        this.dealCnt = modDealTypes.length;
        return modDealTypes.length > 0 ? this.dealCnt + " " + dealsTypesArray.join() + (this.dealCnt === 1 ? " Deal" : " Deals") : "";
    }

    ngOnInit() {
        if(this.groupTab  === 'groupExclusionDiv'){
            this.showPCT = false;
        }
        this.userRole = (<any>window).usrRole;
        this.loadExcludeGroups();
    }


}
angular.module("app").directive(
    "managerExcludeGroups",
    downgradeComponent({
        component: managerExcludeGroupsComponent,
    })
);