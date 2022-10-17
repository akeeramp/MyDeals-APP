import * as angular from "angular";
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { DataStateChangeEvent, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { managerPctservice } from "./managerPct.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { FormBuilder } from "@angular/forms";
import { contractManagerservice } from "../contractManager/contractManager.service";
import * as moment from "moment";
import { excludeDealGroupModalDialog } from "../managerExcludeGroups/excludeDealGroupModal.component";
import { MatDialog } from "@angular/material/dialog";
import * as _ from 'underscore';

export interface contractIds {
    Model: string;
    C_ID: number;
    ps_id: number;
    pt_id: number;
    ps_index: number;
    pt_index: number;
    contractData: any;
}

@Component({
    selector: "manager-pct",
    templateUrl: "Client/src/app/contract/managerPct/managerPct.component.html",
    styleUrls: ['Client/src/app/contract/managerPct/managerPct.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class managerPctComponent {
    isRunning: boolean;
    contractId: string;
    lastRun: any;
    refreshPage: boolean;
    constructor(private loggerSvc: logger,protected dialog: MatDialog, private contractManagerSvc:contractManagerservice,private managerPctSvc: managerPctservice, private lnavSvc: lnavService, private headerSvc: headerService, private formBuilder: FormBuilder) {
        //pls dont remove this even it its not as part of the route this is to handle condtions when we traverse between contract details with in manage tab
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    //public view: GridDataResult;
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() tab: any;
    @Output() refreshedContractData = new EventEmitter<any>();
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    private spinnerMessageHeader = "Complete"; 
    private spinnerMessageDescription = "Reloading the page now.";
    public isPctLoading = false;
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
    private gridResult = {};
    public pricingStrategyFilter;
    private isExcludeGroup = false;

    private CAN_EDIT_COST_TEST = this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper); // Can go to cost test screen and make changes
    private hasNoPermission = !(this.CAN_EDIT_COST_TEST == undefined ? this.lnavSvc.chkDealRules('C_EDIT_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "SA" && (<any>window).isSuper) : this.CAN_EDIT_COST_TEST);
    private hasNoPermissionOvr = this.hasNoPermission && (<any>window).usrRole !== "Legal";
    private hasPermissionPrice = (<any>window).usrRole === "DA" || (<any>window).usrRole === "Legal" || ((<any>window).usrRole === "SA" && (<any>window).isSuper);
    // This variable gives Super GA to see RTL_PULL_DLR and CAP (CAP column only for ECAP deals)
    private hasSpecialPricePermission = (this.hasPermissionPrice || ((<any>window).usrRole === "GA" && (<any>window).isSuper));
    text: string;
    runIfStaleByHours = 3;
    forceRunValue = true;
    enabledPCT = false;
    private is_Deal_Tools_Checked: any[] = [];
    private state: State[] = [];
    public gridData: any;
    gridDataSet = {}; parentGridData = {}; parentGridResult = {};
    titleFilter = ""; public isAllCollapsed = true; canEdit = true;
    toggleSum() {
        this.refreshPage= false;
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = !this.isPSExpanded[i]
        });
        this.isAllCollapsed = !this.isAllCollapsed;
    }

    togglePt(pt) {
        this.refreshPage= false;
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
                        for (let i = 0; i < this.gridData.length; i++) {
                            Object.assign(this.gridData[i], { PS_WF_STG_CD: pt.PS_WF_STG_CD });
                            //Deal id is not parent id here..Make deal tool directive work assigning this value
                            Object.assign(this.gridData[i], { DC_PARENT_ID: this.gridData[i].DEAL_ID });
                            this.gridData[i]["_readonly"] = pt.PS_WF_STG_CD !== "Submitted";
                            if (this.gridData[i]["COST_TEST_OVRRD_FLG"]) {
                                var isOverridden = this.gridData[i]["COST_TEST_OVRRD_FLG"] === "Yes";
                                var pct = isOverridden ? "Pass" : this.gridData[i]["PRC_CST_TST_STS"];
                                this.gridData[i]["PRC_CST_TST_STS"] = pct;
                            }
                            let _actions = this.contractData?.PRC_ST.filter(x => x.DC_ID == pt.DC_PARENT_ID).map(y => y._actions);
                            if (_actions)
                                this.gridData[i]["_actionsPS"] = _actions[0];
                        }
                        this.gridDataSet[pt.DC_ID] = process(distinct(this.gridData, "DEAL_ID"), this.state[pt.DC_ID]);
                        this.gridResult[pt.DC_ID] = JSON.parse(JSON.stringify(this.gridDataSet[pt.DC_ID]));
                        this.parentGridData[pt.DC_ID] = this.gridData;
                        this.parentGridResult[pt.DC_ID] = JSON.parse(JSON.stringify(this.parentGridData[pt.DC_ID]));
                    }

                },
                function (response) {
                    this.loggerSvc.error("Could not load data.", response, response.statusText);
                }
            )
        }

    }

    dataStateChange(state: DataStateChangeEvent,id): void {
        this.state[id] = state;
        let parentfilter = process(this.parentGridResult[id], this.state[id]);
        this.parentGridData[id] = parentfilter.data;
        this.gridDataSet[id] = process(this.gridResult[id].data, this.state[id]);
        if (parentfilter.data.length > 0 && this.gridDataSet[id].data.length <= 0) {
            _.each(parentfilter.data, (item) => {
                let data = this.gridResult[id].data.filter(x => x.DEAL_ID == item.DEAL_ID);
                if (data && data.length > 0) {
                    this.gridDataSet[id].data.push(item);
                }
            })
        }
    }

    public cellClickHandler(args: CellClickEvent): void {
        if (!args.isEdited) {
            args.sender.editCell(
                args.rowIndex,
                args.columnIndex,
            );
        }
        if (args.column.field == "GRP_DEALS") {
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
                // this.updateModalDataItem(dataItem, "DEAL_GRP_CMNT", returnVal[0].DEAL_GRP_CMNT);
                // this.updateModalDataItem(dataItem, "DEAL_GRP_EXCLDS", returnVal[0].DEAL_GRP_EXCLDS);
            }
        });
    }
    public cellCloseHandler(args: CellCloseEvent): void {
        const { formGroup, dataItem } = args;
    }

    distinctPrimitive(id, fieldName: string) {
        return distinct(this.parentGridResult[id], fieldName).map(item => item[fieldName]);
    }

    isHidden(id, fieldName) {
        if (this.gridDataSet[id] && this.gridDataSet[id].data && this.gridDataSet[id].data.length > 0) {
            let parsedData = JSON.parse(this.gridDataSet[id].data[0].OBJ_PATH_HASH);
            let psData = this.contractData?.PRC_ST.filter(x => x.DC_ID == parsedData['PS']);
            if (psData) {
                let ptData = psData[0].PRC_TBL.filter(x => x.DC_ID == id);
                if (ptData) {
                    if (ptData[0].OBJ_SET_TYPE_CD == 'ECAP' && fieldName == 'MAX_RPU') {
                        return true;
                    }
                    else if (ptData[0].OBJ_SET_TYPE_CD !== 'ECAP' && (fieldName == 'CAP' || fieldName == 'ECAP_PRC' || fieldName == 'ECAP_FLR')) {
                        return true;
                    }
                    else if (ptData[0].OBJ_SET_TYPE_CD !== 'PROGRAM' && (fieldName == 'OEM_PLTFRM_LNCH_DT' || fieldName == 'OEM_PLTFRM_EOL_DT')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    lastMeetCompRunCalc(value) {
        this.text = value;
        if (this.isRunning) {
            return "Running " + this.text;
        }
        
        if (!this.enabledPCT && this.lastRun) {

            // Get local time in UTC
            var currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            // currentTime.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            var localTime = moment(currentTime).format("MM/DD/YY HH:mm:ss");
            // Get server time from a PST time string... manually convert it to UTC
            var lastruntime = moment(this.lastRun);

            var serverPstTime = lastruntime.format("MM/DD/YY HH:mm:ss");
            //var serverPstTime = moment(this.lastRun).add(moment.duration("08:00:00")).format('YYYY-MM-DD HH:mm:ss');

            var timeDiff = moment.duration(moment(serverPstTime).diff(moment(localTime)));
            var hh = Math.abs(timeDiff.asHours());
            var mm = Math.abs(timeDiff.asMinutes());
            var ss = Math.abs(timeDiff.asSeconds());

            var dsplNum = hh;
            var dsplMsg = " hours ago";
            this.needToRunPct = this.forceRun() || (this.runIfStaleByHours > 0 && dsplNum >= this.runIfStaleByHours) ? true : false;
            
            if (dsplNum < 1) {
                dsplNum = mm;
                dsplMsg = " mins ago";
                if (!this.forceRun()) this.needToRunPct = false;
            }
            if (dsplNum < 1) {
                dsplNum = ss;
                dsplMsg = " secs ago";
                if (!this.forceRun()) this.needToRunPct = false;
            }

            return "Last Run: " + Math.round(dsplNum) + dsplMsg;

        } else {
            // never ran
            this.needToRunPct = this.runIfStaleByHours > 0;
            return "Last Run: Never";
        }
    }
    forceRun() {
        var data = this.contractData.PRC_ST;
        if (data !== undefined) {
            for (var d = 0; d < data.length; d++) {
                if (data[d].MEETCOMP_TEST_RESULT === "" || data[d].MEETCOMP_TEST_RESULT === "Not Run Yet") return true;
                if (data[d].COST_TEST_RESULT === "" || data[d].COST_TEST_RESULT === "Not Run Yet") return true;
            }
        }
        return false;
    }

    executePctViaBtn() {
        this.executePct();
    }
    executePct() {
        this.isRunning = true;
        this.contractId= this.contractData.DC_ID;
        this.contractManagerSvc.runPctContract(this.contractData.DC_ID).subscribe((res) => {
            this.isRunning = false;
            this.loadPctDetails();
        }, (err) => {
            this.isRunning = false;
              this.loggerSvc.error("Could not run price Cost Test for contract " + this.contractId, err);
        });
        
    }
    refreshGrid(){
        this.refreshPage = true;
        this.isAllCollapsed = true;
        this.isPSExpanded = []; this.isPTExpanded = {};
        this.gridDataSet = {}; this.parentGridData = {};
        this.gridResult = {};
    }
    loadPctDetails(){
        this.isPctLoading = true;
        this.contractManagerSvc.readContract(this.contractId).subscribe((response: any) => {
            this.contractData = response[0];
            this.refreshedContractData.emit({ contractData: this.contractData });
            this.refreshGrid();
            this.contractId= this.contractData.DC_ID;
            this.lastRun = this.contractData.LAST_COST_TEST_RUN;
            this.contractData?.PRC_ST.map((x, i) => {
                //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
                this.isPSExpanded[i] = false;
                if (x.PRC_TBL != undefined) x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
            })
            this.isPctLoading = false;

        }, (error) => {
            this.isPctLoading = false;
            this.loggerSvc.error('Get Upper Contract service', error);
        });
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
        },(err)=>{
            this.loggerSvc.error("Unable to get user role details","Error",err);
        });
        if (this.selectedTab == 5) {
            event.preventDefault();
            this.loadModel('groupExclusionDiv');
        }
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
            this.isExcludeGroup = false;
        }
        else if (tabName == "Failures") {
            this.pctFilter = "Fail";
            this.isExcludeGroup = false;
        }
        else if (tabName == "Passes") {
            this.pctFilter = "Pass";
            this.isExcludeGroup = false;
        }
        else if (tabName == "InCompletes") {
            this.pctFilter = "InComplete";
            this.isExcludeGroup = false;
        }
        else if (tabName == "NA") {
            this.pctFilter = "NA";
            this.isExcludeGroup = false;
        }
        else if (tabName == "Grouping Exclusions") {
            this.isExcludeGroup = true;
        }
    }

    selectAllIDs(event, ptId) {
        this.is_Deal_Tools_Checked[ptId] = event.target.checked;
        for (let i = 0; i < this.gridDataSet[ptId].data.length; i++) {
            this.gridDataSet[ptId].data[i].isLinked = event.target.checked;
        }
        for (let j = 0; j < this.parentGridData[ptId].length; j++) {
            this.parentGridData[ptId][j].isLinked = event.target.checked;
        }
    }
    loadModel(model: string) {
        const contractId_Map: contractIds = {
            Model: model,
            ps_id: 0,
            pt_id: 0,
            ps_index: 0,
            pt_index: 0,
            C_ID: this.contractData.DC_ID,
            contractData: this.contractData
        };
        this.modelChange.emit(contractId_Map);
    }
    refreshContractData(eventData) {
        if (eventData) {
            this.loadPctDetails();
        }
    }

    ngOnInit() {
        if(this.tab === 'groupExclusionDiv'){
            this.selectedTab = 5;
        }
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.lastRun = this.contractData.LAST_COST_TEST_RUN;
        this.contractId= this.contractData.DC_ID;
        this.loadPctDetails();
        _.each(this.contractData?.PRC_ST, (item) => {
            _.each(item.PRC_TBL, (prcTbl) => {
                this.state[prcTbl.DC_ID] = {
                    skip: 0,
                    take: 25,
                    group: [],
                    filter: {
                        logic: "and",
                        filters: [],
                    }
                }
                this.is_Deal_Tools_Checked[prcTbl.DC_ID] = false;
            })           
        })
        setTimeout(() => {
            var isPCForceReq = this.contractData?.PRC_ST?.filter(x => x.COST_TEST_RESULT == 'Not Run Yet' || x.COST_TEST_RESULT == 'InComplete' || x.DC_ID <= 0).length > 0 ? true : false;
            var isMCForceReq = this.contractData?.PRC_ST?.filter(x => x.MEETCOMP_TEST_RESULT == 'Not Run Yet' || x.MEETCOMP_TEST_RESULT == 'InComplete' || x.DC_ID <= 0).length > 0 ? true : false;
            if (isMCForceReq || isPCForceReq)
                this.executePct();
        }, 2000);
        this.pricingStrategyFilter = this.contractData?.PRC_ST;
    }


}
angular.module("app").directive(
    "managerPct",
    downgradeComponent({
        component: managerPctComponent,
    })
);