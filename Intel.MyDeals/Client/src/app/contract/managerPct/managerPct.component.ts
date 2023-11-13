import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { DataStateChangeEvent, CellClickEvent, CellCloseEvent } from "@progress/kendo-angular-grid";
import { distinct, process, State } from "@progress/kendo-data-query";
import { managerPctservice } from "./managerPct.service";
import { ThemePalette } from "@angular/material/core";
import { lnavService } from "../lnav/lnav.service";
import { headerService } from "../../shared/header/header.service";
import { contractManagerservice } from "../contractManager/contractManager.service";
import { MomentService } from "../../shared/moment/moment.service";
import { excludeDealGroupModalDialog } from "../managerExcludeGroups/excludeDealGroupModal.component";
import { MatDialog } from "@angular/material/dialog";
import { each } from 'underscore';
import { tenderGroupExclusionModalComponent } from "../ptModals/tenderDashboardModals/tenderGroupExclusionModal.component";

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
    selector: 'manager-pct',
    templateUrl: 'Client/src/app/contract/managerPct/managerPct.component.html',
    styleUrls: ['Client/src/app/contract/managerPct/managerPct.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class managerPctComponent {
    isRunning: boolean;
    contractId: string;
    lastRun: any;
    refreshPage: boolean;
    constructor(private loggerSvc: logger,
                protected dialog: MatDialog,
                private contractManagerSvc:contractManagerservice,
                private managerPctSvc: managerPctservice,
                private lnavSvc: lnavService,
                private headerSvc: headerService,
                private momentService: MomentService) {}
    //public view: GridDataResult;
    public isLoading: boolean;
    private color: ThemePalette = 'primary';
    PCTResultView = false;
    @Input() contractData: any;
    @Input() UItemplate: any;
    @Input() tab: any;
    @Input() isTenderDashboard: boolean = false;//will recieve true when PCT Used in Tender Dashboard Screen
    @Input() PS_ID: any;
    @Input() WIP_ID: any;
    @Output() refreshedContractData = new EventEmitter<any>();
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() isDirty = new EventEmitter<any>();
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
    private parent_dcId: any;
    private psId: any;
    private ptId: any;
    private showMultipleDialog: boolean = false;
    private pteTableData: any
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
    private ECAP_KIT_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'REBATE_BILLING_START', 'PYOUT_BASE_ON', 'CAP', 'ECAP_PRC', 'ECAP_FLR', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']
    private VOL_REV_FLEX_DNSTY_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'REBATE_BILLING_START', 'PYOUT_BASE_ON', 'MAX_RPU', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']
    private PGM_Col = ['TOOLS', 'PRC_CST_TST_STS', 'DEAL_ID', 'PRODUCT', 'PCSR_NBR', 'DEAL_DESC', 'GRP_DEALS', 'DEAL_STRT_DT', 'REBATE_BILLING_START', 'PYOUT_BASE_ON', 'OEM_PLTFRM_LNCH_DT', 'OEM_PLTFRM_EOL_DT', 'MAX_RPU', 'LOW_NET_PRC', 'PRD_COST', 'CST_TYPE', 'COST_TEST_OVRRD_FLG', 'COST_TEST_OVRRD_CMT', 'RTL_CYC_NM', 'RTL_PULL_DLR', 'MKT_SEG', 'GEO', 'PYOUT_BASE_ON', 'CNSMPTN_RSN', 'PROG_PMT', 'DEAL_GRP_CMNT', 'LAST_COST_TEST_RUN']
    public expandDetailsBy = (dataItem: any): number => {
        return dataItem;
    };
    toggleSum() {
        this.refreshPage= false;
        this.contractData?.PRC_ST.map((x, i) => {
            if (this.isAllCollapsed == true) this.isPSExpanded[i] = true;
            else this.isPSExpanded[i] = false;
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
                        let rollupPCTStatus = [];
                        for (let i = 0; i < this.gridData.length; i++) {
                            Object.assign(this.gridData[i], { PS_WF_STG_CD: pt.PS_WF_STG_CD });
                            //Deal id is not parent id here..Make deal tool directive work assigning this value
                            Object.assign(this.gridData[i], { DC_PARENT_ID: this.gridData[i].DEAL_ID });
                            this.gridData[i]["_readonly"] = pt.PS_WF_STG_CD !== "Submitted";
                            var pct = this.gridData[i]["PRC_CST_TST_STS"];
                            if (this.gridData[i]["COST_TEST_OVRRD_FLG"]) {
                                var isOverridden = this.gridData[i]["COST_TEST_OVRRD_FLG"] === "Yes";
                                pct = isOverridden ? "Pass" : this.gridData[i]["PRC_CST_TST_STS"];
                                this.gridData[i]["PRC_CST_TST_STS"] = pct;
                            }
                            if (!rollupPCTStatus[this.gridData[i].DEAL_ID]) {
                                rollupPCTStatus[this.gridData[i].DEAL_ID] = this.gridData[i]["PRC_CST_TST_STS"];
                            }
                            else {
                                if (pct === "Fail") {
                                    rollupPCTStatus[this.gridData[i].DEAL_ID] = "Fail";
                                } else if (pct === "InComplete" && rollupPCTStatus[this.gridData[i].DEAL_ID] !== "Fail") {
                                    rollupPCTStatus[this.gridData[i].DEAL_ID] = "InComplete";
                                } else if (pct === "Pass" && rollupPCTStatus[this.gridData[i].DEAL_ID] === "NA") {
                                    rollupPCTStatus[this.gridData[i].DEAL_ID] = "Pass";
                                }
                            }
                            let _actions = this.contractData?.PRC_ST.filter(x => x.DC_ID == pt.DC_PARENT_ID).map(y => y._actions);
                            if (_actions)
                                this.gridData[i]["_actionsPS"] = _actions[0];
                        }
                        this.parentGridData[pt.DC_ID] = JSON.parse(JSON.stringify(this.gridData));
                        this.parentGridResult[pt.DC_ID] = JSON.parse(JSON.stringify(this.parentGridData[pt.DC_ID]));
                        let parentData:any = distinct(this.gridData, "DEAL_ID");
                        each(parentData, (item) => {
                            item["PRC_CST_TST_STS"] = rollupPCTStatus[item["DEAL_ID"]];
                        });
                        //this.state[pt.DC_ID].take = parentData.length;
                        if (this.pctFilter != '') parentData = parentData.filter(x => x.PRC_CST_TST_STS == this.pctFilter);
                        this.gridDataSet[pt.DC_ID] = process(parentData, this.state[pt.DC_ID]);
                        this.gridResult[pt.DC_ID] = JSON.parse(JSON.stringify(this.gridDataSet[pt.DC_ID]));
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
            each(parentfilter.data, (item) => {
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
        if (args.column.field == "GRP_DEALS" && args.dataItem.PRC_CST_TST_STS != 'NA') {
            this.openExcludeDealGroupModal(args.dataItem);
        }
    }
    openExcludeDealGroupModal(dataItem) {
        const dialogRef = this.dialog.open(excludeDealGroupModalDialog, {
            width: "90%",
            panelClass: 'post-dialog-container-exclude',
            maxWidth: "auto",
            data: {
                cellCurrValues: dataItem,
                enableCheckbox: false,
                excludeOutliers: true
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
                    if ((ptData[0].OBJ_SET_TYPE_CD == 'ECAP' || ptData[0].OBJ_SET_TYPE_CD == 'KIT') && !this.ECAP_KIT_Col.includes(fieldName)) {
                        return true;
                    }
                    else if ((ptData[0].OBJ_SET_TYPE_CD == 'VOL_TIER' || ptData[0].OBJ_SET_TYPE_CD == 'REV_TIER' || ptData[0].OBJ_SET_TYPE_CD == 'DENSITY' || ptData[0].OBJ_SET_TYPE_CD == 'FLEX') && !this.VOL_REV_FLEX_DNSTY_Col.includes(fieldName)) {
                        return true;
                    }
                    else if (ptData[0].OBJ_SET_TYPE_CD == 'PROGRAM' && !this.PGM_Col.includes(fieldName)) {
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
        
        if (!this.enabledPCT)
            return value + " is saved";

        if (this.lastRun) {

            // Get local time in UTC
            var currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
            var localTime = this.momentService.moment(currentTime).format("MM/DD/YY HH:mm:ss");
            // Get server time from a PST time string... manually convert it to UTC
            var lastruntime = this.momentService.moment(this.lastRun);

            var serverPstTime = lastruntime.format("MM/DD/YY HH:mm:ss");

            var timeDiff = this.momentService.moment.duration(this.momentService.moment(serverPstTime).diff(this.momentService.moment(localTime)));
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

    async executePctViaBtn() {
        await this.executePct();
        await this.loadPctDetails();
    }
    async executePct() {
        this.isRunning = true;
        await this.contractManagerSvc.runPctContract(this.contractData.DC_ID).toPromise().catch((err) => {
            this.isRunning = false;
            this.isLoading = false;
            this.loggerSvc.error("Could not run Cost Test for contract " + this.contractId, err);
        });
        this.isRunning = false;
    }
    refreshGrid(){
        this.refreshPage = true;
        this.isAllCollapsed = true;
        this.isPSExpanded = []; this.isPTExpanded = {};
        this.gridDataSet = {}; this.parentGridData = {};
        this.gridResult = {};
    }
    async loadPctDetails(){
        this.isPctLoading = true;
        let response:any = await this.contractManagerSvc.readContract(this.contractId).toPromise().catch((error) => {
            this.isPctLoading = false;
            this.loggerSvc.error('Get Upper Contract service', error);
        });
        if (response && response.length > 0) {
            this.contractData = response[0];
            this.calcNeedToRunStatus();
            if (this.isTenderDashboard && this.contractData.PRC_ST && this.PS_ID)//PCT screen of Tender Dashboard displays only particular PS not all
                this.contractData.PRC_ST = this.contractData.PRC_ST.filter(x => x.DC_ID == this.PS_ID);
            this.refreshedContractData.emit({ contractData: this.contractData });
            this.refreshGrid();
            this.contractId = this.contractData.DC_ID;
            this.lastRun = this.contractData.LAST_COST_TEST_RUN;
            this.contractData?.PRC_ST.map((x, i) => {
                //intially setting all the PS row arrow icons and PT data row arrow icons as collapses. this isPSExpanded,isPTExpanded is used to change the arrow icon css accordingly
                this.isPSExpanded[i] = false;
                if (this.isTenderDashboard)//PCT screen of Tender Dashboard data needs to be expanded on load
                    this.isPSExpanded[i] = true;
                if (x.PRC_TBL != undefined) {
                    x.PRC_TBL.forEach((y) => this.isPTExpanded[y.DC_ID] = false);
                    if (this.isTenderDashboard) {//PCT screen of Tender Dashboard data needs to be expanded on load
                        x.PRC_TBL.forEach((y) => { this.isPTExpanded[y.DC_ID] = true; this.togglePt(y); });
                    }
                }
            })
        }
        this.isPctLoading = false;
        if (this.pctFilter != "") {
            this.pricingStrategyFilter = this.contractData?.PRC_ST.filter(x => x.COST_TEST_RESULT == this.pctFilter);
        }
        else {
            this.pricingStrategyFilter = this.contractData?.PRC_ST;
        }
    }

    showHelpTopicCostTest() {
        window.open('https://intel.sharepoint.com/sites/mydealstrainingportal/SitePages/Price-Cost-Test.aspx', '_blank');
    }

    async onTabSelect(event: any) {
        this.gridDataSet = {};
        let data = JSON.parse(JSON.stringify(this.contractData));
        this.selectedTab = event.index;
        if (this.isTenderDashboard && event.index == 1)//PCT screen of Tender Dashboard have only two tabs (All, Grouping Exclusions)
            this.selectedTab = 5;
        let res = await this.headerSvc.getUserDetails().toPromise().catch((err) => {
            this.loggerSvc.error("Unable to get user role details","Error",err);
        });
        this.usrRole = res.UserToken.Role.RoleTypeCd;
        (<any>window).usrRole = this.usrRole;

        if (this.isSuper) {
            this.superPrefix = "Super";
            this.extraUserPrivsDetail.push("Super User");
        }
        if (this.selectedTab == 5) {
            event.preventDefault();
            if (!this.isTenderDashboard)
                this.loadModel('groupExclusionDiv');
            else {//PCT screen of Tender Dashboard requires Grouping Exclusion Tab as a popup modal
                this.selectedTab = 0;
                this.openGroupExclusionModal();
                event.index = 0;
                event.title = "All";
            }
        }
        this.selTab(event.title);
        if (this.pctFilter != "") {
            this.pricingStrategyFilter = data?.PRC_ST.filter(x => x.COST_TEST_RESULT == this.pctFilter);
            each(this.pricingStrategyFilter, item => {
                item.PRC_TBL = item.PRC_TBL.filter(x => x.COST_TEST_RESULT == this.pctFilter);
            });
        }
        else {
            this.pricingStrategyFilter = data?.PRC_ST;
        }
    }
    openGroupExclusionModal() {
        const dialogRef = this.dialog.open(tenderGroupExclusionModalComponent, {
            width: "1420px",
            panelClass:'tender-grouping-exclusion',
            data: {
                contractData: this.contractData,
                WIP_ID: this.WIP_ID,
                isTenderDashboard: this.isTenderDashboard,
                selLnav: 'groupExclusionDiv',
                UItemplate: this.UItemplate
            }
        });
        dialogRef.afterClosed().subscribe((returnVal) => {

        });
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
        this.isDirty.emit(true);
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
    updateTitleFilter() {
        if (this.titleFilter != "") {
            this.pricingStrategyFilter = [];
            each(this.contractData.PRC_ST, (item) => {
                if (item.TITLE.search(new RegExp(this.titleFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) >= 0 || (item.PRC_TBL && item.PRC_TBL.length > 0 && item.PRC_TBL.filter(x => x.TITLE.search(new RegExp(this.titleFilter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) >= 0).length > 0)) {
                    this.pricingStrategyFilter.push(item)
                }
            })
        }
        else {
            this.pricingStrategyFilter = this.contractData.PRC_ST;
        }
    }
    openPTEeditor(value) {
        this.parent_dcId = value.DC_PARENT_ID
        this.psId = value.DC_ID;
        let prc_tbl = value?.PRC_TBL;
        if (prc_tbl.length > 1) {
            this.showMultipleDialog = true;
            this.pteTableData = prc_tbl;
        } else {
            this.showMultipleDialog = false;
            this.ptId = prc_tbl[0].DC_ID;
            window.location.href = "Contract#/manager/PT/" + this.parent_dcId + "/" + this.psId + "/" + this.ptId + "/0";

        }
    }
    pickPt(pte) {
        this.ptId = pte.DC_ID;
        window.location.href = "Contract#/manager/PT/" + this.parent_dcId + "/" + this.psId + "/" + this.ptId + "/0";
    }
    openPTE(dcId, psId, ptId) {
        this.parent_dcId = dcId
        this.psId = psId;
        this.ptId = ptId;
        window.location.href = "Contract#/manager/PT/" + this.parent_dcId + "/" + this.psId + "/" + this.ptId + "/0";
    }
    closeMultiple() {
        this.showMultipleDialog = false;
    }
    calcNeedToRunStatus() {
        this.enabledPCT = false;
        if (this.contractData.PRC_ST === undefined || this.contractData.PRC_ST === null) return;

        for (var d = 0; d < this.contractData.PRC_ST.length; d++) {
            var stg = this.contractData.PRC_ST[d].WF_STG_CD;
            if (stg !== "Pending" && stg !== "Approved") {
                this.enabledPCT = true;
            }
        }
    }
    async loadPct() {
        await this.loadPctDetails();
        if (this.enabledPCT)
            setTimeout(() => { this.executePct(); }, 0)
    }
    ngOnInit() {
        if(this.tab === 'groupExclusionDiv'){
            this.selectedTab = 5;
        }
        this.userRole = (<any>window).usrRole;
        this.PCTResultView = ((<any>window).usrRole === 'GA' && (<any>window).isSuper);
        this.lastRun = this.contractData.LAST_COST_TEST_RUN;
        this.contractId= this.contractData.DC_ID;
        each(this.contractData?.PRC_ST, (item) => {
            each(item.PRC_TBL, (prcTbl) => {
                this.state[prcTbl.DC_ID] = {
                    skip: 0,
                    group: [],
                    filter: {
                        logic: "and",
                        filters: [],
                    }
                }
                this.is_Deal_Tools_Checked[prcTbl.DC_ID] = false;
            })           
        })
        this.pricingStrategyFilter = this.contractData?.PRC_ST;
        if (this.isTenderDashboard) {//If PCT screen triggered from Tender Dashboard, all datas needs to be expanded
            this.isAllCollapsed = false;
        }
        this.loadPct();
    }
    goToNavManagePCT(dataItem) {
        window.open(`/Contract#/gotoDeal/${dataItem.DEAL_ID}`, '_blank')
    }
}