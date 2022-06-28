import * as angular from "angular";
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { templatesService } from "../../shared/services/templates.service";
import { lnavService } from "../lnav/lnav.service";
import { pricingTableComponent } from "../pricingTable/pricingTable.component";
import { headerService } from "../../shared/header/header.service";

export interface contractIds {
     Model:string;
     C_ID: number;
     ps_id: number;
     pt_id: number;
}

@Component({
    selector: "lnavView",
    templateUrl: "Client/src/app/contract/lnav/lnav.component.html",
    styleUrls: ['Client/src/app/contract/lnav/lnav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class lnavComponent  {
    constructor(private loggerSvc: logger, private templatesSvc: templatesService, private lnavSvc: lnavService, private pricingTableComp: pricingTableComponent, private headerSvc: headerService) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @Input() contractId: number;
    @Input() contractData;
    @Input() UItemplate;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>(); 

    public psTITLE = "";
    public newStrategy: any = {};
    public PtDealTypes;
    public ptTITLE = "";
    public newPricingTable;
    public isTenderContract = false;
    public curPricingStrategy: any = {};
    public currentPricingTable: any = {};
    public isAddStrategyHidden = true;
    public isAddPricingTableHidden = true;
    public renameMapping = {};
    public curPricingStrategyId;
    public container: any;
    public strategyTreeCollapseAll = true; isCollapsed = false;

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
    //Output Emitter to load the Pricing table data
    loadPTE(psId, ptId) {
        const contractId_Map:contractIds={
            Model: 'PTE',
            ps_id: psId,
            C_ID: this.contractId,
            pt_id: ptId
        };
        this.modelChange.emit(contractId_Map);
    }

    loadModel(model:string) {
        const contractId_Map:contractIds={
            Model: model,
            ps_id: 0,
            C_ID: this.contractId,
            pt_id: 0
        };
        this.selectedModel = model;
        this.modelChange.emit(contractId_Map);
    }
    /* PRICING STRATEGY */
    customAddPsValidate() {
        let isvalid = true;
        if (this.psTITLE.length > 80) {
            isvalid = false;
        }
        this.newStrategy.TITLE = this.psTITLE;
        const values = this.newStrategy;
        this.addPricingStrategy();

        // Clear all values
        angular.forEach(values,
            function (value, key) {
                values._behaviors.validMsg[key] = "";
                values._behaviors.isError[key] = false;
            });
    }

    addPricingStrategy() {
        const ct = this.contractData;
        const custId = this.contractData.CUST_MBR_SID;
        const contractId = this.contractData.DC_ID
        const ps = this.UItemplate["ObjectTemplates"].PRC_ST.ALL_TYPES;
        ps.DC_ID = -100;
        ps.DC_PARENT_ID = ct.DC_ID;
        ps.PRC_TBL = [];
        ps.TITLE = this.newStrategy.TITLE;
        ps.IS_HYBRID_PRC_STRAT = 0;//(this.newStrategy.IS_HYBRID_PRC_STRAT === true ? 1 : 0);

        this.lnavSvc.createPricingStrategy(custId, contractId, ps).subscribe((response: any) => {
            if (this.contractData.PRC_ST === undefined) this.contractData.PRC_ST = [];
            ps.DC_ID=response.PRC_ST[1].DC_ID ;
            this.contractData.PRC_ST.push(ps);
            this.showAddPricingTable(ps);

            this.newStrategy.TITLE = "";
            this.newStrategy.IS_HYBRID_PRC_STRAT = true;
            this.curPricingStrategy = ps;
            this.curPricingStrategyId = ps.DC_ID;
        })
    }

    getCustId = function () {
        return this.contractData['CUST_MBR_SID'];
    }

    /*PRICING TABLE */
    filterDealTypes() {
        let result = {};
        const dealDisplayOrder = ["ECAP", "VOL_TIER", "PROGRAM", "FLEX", "DENSITY", "REV_TIER", "KIT"];
        const items = this.UItemplate["ModelTemplates"].PRC_TBL;
        angular.forEach(items, function (value, key) {
            if (value.name !== 'ALL_TYPES' && value.name !== 'TENDER') {
                value._custom = {
                    "ltr": value.name[0],
                    "_active": false
                };
                result[key] = value;
            }
        });
        result = dealDisplayOrder.map((object) => result[object]).filter(obj => obj !== undefined);
        this.PtDealTypes = result;
    }

    removeBlanks(val) {
        return val.replace(/_/g, '');
    }

    selectPtTemplateIcon(DealType) {
        const Title = this.ptTITLE;
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL[DealType.name];
        this.newPricingTable["TITLE"] = Title;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = DealType.name;
        this.newPricingTable["_extraAtrbs"] = DealType.extraAtrbs;
        this.newPricingTable["_defaultAtrbs"] = DealType.defaultAtrbs
        this.defaultAttribs();
    }

    defaultAttribs() {
        const dealType = this.newPricingTable.OBJ_SET_TYPE_CD;
        const marketSegment = (this.isTenderContract) ? "Corp" : "All Direct Market Segments";

        if (this.newPricingTable["_defaultAtrbs"].REBATE_TYPE) this.newPricingTable["_defaultAtrbs"].REBATE_TYPE.value = this.isTenderContract ? "TENDER" : "MCP";
        if (this.newPricingTable["_defaultAtrbs"].MRKT_SEG) this.newPricingTable["_defaultAtrbs"].MRKT_SEG.value = marketSegment;
        if (this.newPricingTable["_defaultAtrbs"].GEO_COMBINED) this.newPricingTable["_defaultAtrbs"].GEO_COMBINED.value = ["Worldwide"];
        if (this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON) dealType == 'FLEX' || dealType == 'REV_TIER' || dealType == 'DENSITY' ? this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Billings" : this.newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Consumption";
        if (this.newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT) this.newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT.value = "Backend";
        if (this.newPricingTable["_defaultAtrbs"].PROD_INCLDS) this.newPricingTable["_defaultAtrbs"].PROD_INCLDS.value = "Tray";
        if (this.newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE) this.newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE.value = "Accrual";
        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        if (!this.isTenderContract && dealType != "KIT") {

            if (this.newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE && dealType != 'KIT') this.newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE.value = "";
        }

        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_TIERS) this.newPricingTable["_defaultAtrbs"].NUM_OF_TIERS.value = "1";
        if (this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) this.newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        if (this.isTenderContract) { // Tenders come in without a customer defined immediately
            // Tenders don't have a customer at this point, Default to blank for customer defaults and let pricingTable.Controller.js handle tender defaults
            if (this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE) this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE.value = "Yearly";
            if (this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL) this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL.value = ""; // Old value "Issue Credit to Billing Sold To"
        }
        else {
            if (this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE) this.newPricingTable["_defaultAtrbs"].PERIOD_PROFILE.value =
                (this.contractData.Customer == undefined) ? "" : this.contractData.Customer.DFLT_PERD_PRFL;
            if (this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL) {
                // Set AR_SETTLEMENT_LVL to customer default first, and if that is blank, then fall back on deal level rules
                let newArSettlementValue = (this.contractData.Customer == undefined) ? "" : this.contractData.Customer.DFLT_AR_SETL_LVL;
                if (this.contractData.Customer.DFLT_AR_SETL_LVL == "User Select on Deal Creation") { // If this is cust default, force it blank
                    newArSettlementValue = "";
                } else {
                    if (newArSettlementValue == "")
                        newArSettlementValue = (dealType == "ECAP" ||
                            dealType == "KIT")
                            ? "Issue Credit to Billing Sold To"
                            : "Issue Credit to Default Sold To by Region";
                }
                this.newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL.value = newArSettlementValue;
            }
        }
        if (this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL) this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL.value = "";
        if (this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT) this.newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT.value = "";
    }

    customAddPtValidate() {
        const isValid = true;
        this.newPricingTable.TITLE = this.ptTITLE;
        if (isValid) {
            this.addPricingTable();
        }
    }
    addPricingTable() {
        const pt = this.UItemplate["ObjectTemplates"].PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
        if (!pt) {
            //.addTableDisabled = false;
            this.loggerSvc.error("Could not create the Pricing Table.", "Error");
            //$scope.setBusy("", "");
            return;
        }

        pt.DC_ID = -100;
        pt.DC_PARENT_ID = this.curPricingStrategy.DC_ID;
        pt.OBJ_SET_TYPE_CD = this.newPricingTable.OBJ_SET_TYPE_CD;
        pt.TITLE = this.newPricingTable.TITLE;
        pt.IS_HYBRID_PRC_STRAT = pt.IS_HYBRID_PRC_STRAT !== undefined ? this.curPricingStrategy.IS_HYBRID_PRC_STRAT : "";

        for (const atrb in this.newPricingTable._defaultAtrbs) {
            if (this.newPricingTable._defaultAtrbs['atrb'] === undefined &&
                pt['atrb'] === undefined) {
                //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                if (Array.isArray(this.newPricingTable._defaultAtrbs[atrb].value)) {
                    //Array, Middle Tier expects a comma separated string
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value.join();
                } else {
                    //String
                    pt[atrb] = this.newPricingTable._defaultAtrbs[atrb].value;
                }
            }
        }

        this.lnavSvc.createPricingTable(this.getCustId(), this.contractData.DC_ID, pt).subscribe((response: any) => {
            pt.DC_ID=response.PRC_TBL[1].DC_ID;
            this.loadPTE(pt.DC_PARENT_ID, pt.DC_ID);
            //window.location.href = "/Contract#/contractmanager/" + this.contractData["DC_ID"];
        })
    }

    clearNptTemplate() {
        this.currentPricingTable = null;
        //angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
        //    function (value, key) {
        //        value._custom._active = false;
        //    });
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL.ECAP;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = "";
    }

    /* Ps and Pt Tree*/
    showAddPricingTable(ps) {

        // if its hybrid PS and already contains a PS do not allow to create one mor pricing table.
        //if (ps.IS_HYBRID_PRC_STRAT !== undefined && ps.IS_HYBRID_PRC_STRAT == "1" && ps.PRC_TBL != undefined && ps.PRC_TBL.length > 0) {
        //    kendo.alert("You can add only one pricing table within a hybrid pricing strategy");
        //    return;
        //}
        this.isAddPricingTableHidden = false;
        this.isAddStrategyHidden = true;
        //$scope.isAddStrategyBtnHidden = true;
        //$scope.isSearchHidden = true;
        this.clearNptTemplate();
        this.curPricingStrategy = ps;
        if (!!this.curPricingStrategy && !this.curPricingStrategy.PRC_TBL) {
            // default Pricing Table title to Pricing Strategy title
            this.newPricingTable.TITLE = this.curPricingStrategy.TITLE;
        } else {
            // look for the title in existing titles
            let defTitle = this.curPricingStrategy.TITLE;
            for (let t = 0; t < this.curPricingStrategy.PRC_TBL.length; t++) {
                if (this.curPricingStrategy.PRC_TBL[t].TITLE === defTitle) {
                    defTitle = "";
                }
            }
            this.newPricingTable.TITLE = defTitle;
        }
    }

    toggleAddStrategy() {
        this.isAddStrategyHidden = !this.isAddStrategyHidden;
        //this.isAddStrategyBtnHidden = !this.isAddStrategyHidden;
        //this.isSearchHidden = true;
        this.isAddPricingTableHidden = true;
    }

    //Help navigation
    showHelpTopicMeetComp() {
        const helpTopic = "Auto+Population";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    showHelpTopicCostTest() {
        const helpTopic = "Cost+Test";
        if (helpTopic && String(helpTopic).length > 0) {
            window.open('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
        } else {
            window.open('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
        }
    }

    showHelpTopicContract() {
        const helpTopic = "Contract+Navigator";
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

        if (event.title == "Deal Entry") {
            this.loadModel('PTE');
        }
        else if (event.title == "Meet Comp") {
            this.loadModel('MeetComp');
        }
        else if (event.title == "Manage") {
            this.loadModel('Manage');
        }
    }

    openMeetCompTab() {
        this.selectedTab = 1;
        this.loadModel('MeetComp');
    }

    toggleStrategyTree() {
        console.log("arrow clicked");
        let container = angular.element(".lnavStrategyContainer");
        console.log("arrow entered", container);
        while (container.length !== 0) {
            //isCollapsed is only defined in the ng-repeat's local scope, so we need to iterate through them here
            !this.isCollapsed == this.strategyTreeCollapseAll;
            container = container.next();
        }
        this.strategyTreeCollapseAll = !this.strategyTreeCollapseAll;
    }

    isExistingContract() {
        return this.contractData.DC_ID > 0;
    }

    ngOnInit() {
        this.newStrategy = this.UItemplate["ObjectTemplates"]?.PRC_ST.ALL_TYPES;
        this.filterDealTypes();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "lnavView",
    downgradeComponent({
        component: lnavComponent,
    })
);