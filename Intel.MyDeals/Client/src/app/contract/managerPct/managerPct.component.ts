import * as angular from "angular";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, SelectAllCheckboxState, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { managerPctservice } from "./managerPct.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { FormBuilder } from "@angular/forms";

@Component({
    selector: "manager-pct",
    templateUrl: "Client/src/app/contract/managerPct/managerPct.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/managerPct.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class managerPctComponent {
    constructor(private loggerSvc: logger, private managerPctSvc: managerPctservice, private lnavSvc: lnavService, private headerSvc: headerService, private formBuilder: FormBuilder) {
        
    }
    //public view: GridDataResult;
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    userRole = ""; canEmailIcon = true;
    isPSExpanded = []; isPTExpanded = {};
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail
    private CAN_VIEW_EXPORT = true;
    private CAN_VIEW_ALL_DEALS = true;
    private usrRole;
    private isSuper = true;
    private superPrefix = "";
    private extraUserPrivsDetail: Array<string> = [];
    private contractType = "Contract";
    private selectedTab = 0;
    private selectedModel;
    private pctFilter = "";
    private isSummaryHidden = false;
    private context = {};
    private needToRunPct = false;
    private dealPtIdDict = {};
    private CostTestGroupDetails = {};
    public mySelection = [];
    public selectAllState: SelectAllCheckboxState = "unchecked";
    private gridResult;
    public pricingStrategyFilter;

    private CAN_EDIT_COST_TEST = this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper); // Can go to cost test screen and make changes
    private hasNoPermission = !(this.CAN_EDIT_COST_TEST == undefined ? this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper) : this.CAN_EDIT_COST_TEST);
    private hasNoPermissionOvr = this.hasNoPermission && (<any>window).usrRole !== "Legal";
    private hasPermissionPrice = (<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal" || ((<any>window).usrRole === "SA" && (<any>window).isSuper);
    // This variable gives Super GA to see RTL_PULL_DLR and CAP (CAP column only for ECAP deals)
    private hasSpecialPricePermission = (this.hasPermissionPrice || ((<any>window).usrRole === "GA" && (<any>window).isSuper));

    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        }
    }
    public gridData: any;
    gridDataSet = {}; parentGridData = {};
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;
    toggleSum() {
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = !this.isPSExpanded[i]
        });
        this.isAllCollapsed = !this.isAllCollapsed;
    }

    togglePt(pt) {
        if (!this.isPTExpanded[pt.DC_ID]) {
            return;
        }
        const ptDcId = pt.DC_ID;
        //check whether arrow icon is expanded/collapsed ,only if it is expanded then call API to get the data
        if (this.isPTExpanded[ptDcId]) {
            this.managerPctSvc.getPctDetails(pt.DC_ID).subscribe(
                (response) => {
                    if (response !== undefined) {
                        this.CostTestGroupDetails[pt.DC_ID] = response["CostTestGroupDetailItems"];
                        this.gridData = response["CostTestDetailItems"];
                        this.gridDataSet[pt.DC_ID] = distinct(this.gridData, "DEAL_ID");
                        this.parentGridData[pt.DC_ID] = this.gridData;
                    }
                },
                function (response) {
                    this.loggerSvc.error("Could not load data.", response, response.statusText);
                }
            )
        }

    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    public cellClickHandler(args: CellClickEvent): void {
        if (!args.isEdited) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex,
            );
        }
    }

    public cellCloseHandler(args: CellCloseEvent): void {
        const { formGroup, dataItem } = args;
    }

    public onSelectedKeysChange(): void {
        const len = this.mySelection.length;
        if (len === 0) {
            this.selectAllState = "unchecked";
        } else if (len > 0 && len < this.gridResult.length) {
            this.selectAllState = "indeterminate";
        } else {
            this.selectAllState = "checked";
        }

    }

    public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
        if (checkedState === "checked") {
            this.selectAllState = "checked";
            this.mySelection = this.gridResult.map((val, index) => index);
        } else {
            this.mySelection = [];
            this.selectAllState = "unchecked";
        }
    }

    distinctPrimitive(fieldName: string) {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    lastMeetCompRunCalc() {
        return "Last Run: 2 hrs ago";
    }

    saveAndRunMeetComp() {
        //kujoih
    }

    forceRunMeetComp() {
        //sjcvacv
    }

    showHelpTopicCostTest() {
        const helpTopic = "Cost+Test";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    onTabSelect(event: any) {
        this.selectedTab = event.index;
        this.headerSvc.getUserDetails().subscribe(res => {
            this.usrRole = res.UserToken.Role.RoleTypeCd;
            (<any>window).usrRole = this.usrRole;

            if (this.isSuper) {
                this.superPrefix = "Super";
                this.extraUserPrivsDetail.push("Super User");
            }
        });
        this.selTab(event.title);
        if (this.pctFilter != "") {
            this.pricingStrategyFilter = this.contractData?.PRC_ST.filter(x => x.COST_TEST_RESULT == this.pctFilter);
        }
        else {
            this.pricingStrategyFilter = this.contractData?.PRC_ST;
        }
    }
    swapUnderscore(str) {
        return str.replace(/_/g, ' ');
    }
    selTab(tabName) {
        if (tabName == "All") {
            this.pctFilter = "";
        }
        else if (tabName == "Failures") {
            this.pctFilter = "Fail";
        }
        else if (tabName == "Passes") {
            this.pctFilter = "Pass";
        }
        else if (tabName == "InCompletes") {
            this.pctFilter = "InComplete";
        }
        else if (tabName == "NA") {
            this.pctFilter = "NA";
        }
    }

    ngOnInit() {
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.contractData?.PRC_ST.map((x, i) => {
            //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
            this.isPSExpanded[i] = false;
            if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
        })
        this.pricingStrategyFilter = this.contractData?.PRC_ST;
    }


}
angular.module("app").directive(
    "managerPct",
    downgradeComponent({
        component: managerPctComponent,
    })
);