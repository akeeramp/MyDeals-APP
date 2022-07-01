import * as angular from "angular";
import { lnavService } from "../lnav/lnav.service";
import { logger } from "../../shared/logger/logger";
import { lnavUtil } from '../lnav.util';
import { downgradeComponent } from "@angular/upgrade/static";
import { headerService } from "../../shared/header/header.service";
import { templatesService } from "../../shared/services/templates.service";
import { pricingTableComponent } from "../pricingTable/pricingTable.component";
import { contractDetailsService } from "../contractDetails/contractDetails.service";
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";

export interface contractIds {
     Model: string;
     C_ID: number;
     ps_id: number;
    pt_id: number;
    contractData: any;
}

@Component({
    selector: "lnavView",
    templateUrl: "Client/src/app/contract/lnav/lnav.component.html",
    styleUrls: ['Client/src/app/contract/lnav/lnav.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class lnavComponent  {
    constructor(private loggerSvc: logger, private templatesSvc: templatesService, private lnavSvc: lnavService, private pricingTableComp: pricingTableComponent, private headerSvc: headerService, private contractDetailsSvc: contractDetailsService) {
     
    }
    @Input() contractId: number;
    @Input() contractData;
    @Input() UItemplate;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>(); 

    public query = "";
    public newStrategy: any = {};
    public PtDealTypes;
    public ptTITLE = "";
    public newPricingTable;
    public isTenderContract = false;
    public currentPricingTable: any = {};
    public isAddStrategyHidden = true;
    public isAddPricingTableHidden = true;
    public isLnavHidden: any = {isLnavHid:false,source:'PT'};
    public renameMapping = {};
    public container: any;
    public strategyTreeCollapseAll = true; isCollapsed = false; isSearchHidden = false; isSummaryHidden = true;
    isAddStrategyBtnHidden = false;
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
    public flowMode = "Deal Entry";
    // Initialize current strategy and pricing table variables
    public curPricingTable: any = {}; curPricingTableId = 0;
    curPricingStrategyId = 0; curPricingStrategy: any = {}; spreadNeedsInitialization = true;
    public isPtr = false; isWip = false; isPSExpanded = [];

    //Output Emitter to load the Pricing table data
    loadPTE(psId, ptId) {
        const contractId_Map:contractIds={
            Model: 'PTE',
            ps_id: psId,
            C_ID: this.contractId,
            contractData: this.contractData,
            pt_id: ptId
        };
        this.modelChange.emit(contractId_Map);
    }

    loadModel(model:string) {
        const contractId_Map:contractIds={
            Model: model,
            ps_id: 0,
            C_ID: this.contractId,
            contractData: this.contractData,
            pt_id: 0
        };
        this.selectedModel = model;
        this.modelChange.emit(contractId_Map);
    }

    // **** PRICING STRATEGY Methods ****
    toggleAddStrategy() {
        this.isAddStrategyHidden = !this.isAddStrategyHidden;       
        this.isSearchHidden = false;
        this.isAddPricingTableHidden = true;
    }
    
    customAddPsValidate() {
        let isvalid = true;       
        this.isAddStrategyBtnHidden = true;        
        const values = this.newStrategy; 

        // Clear all values
        angular.forEach(values,
            function (value, key) {
                values._behaviors.validMsg[key] = "";
                values._behaviors.isError[key] = false;
            });
        // Check required
        angular.forEach(values,
            function (value, key) {
                if (key[0] !== '_' &&
                    !Array.isArray(value) &&
                    (value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                    values._behaviors.isRequired[key] === true) {
                    values._behaviors.validMsg[key] = "* field is required";
                    values._behaviors.isError[key] = true;
                    isvalid = false;
                }
            });

        // Check unique name
        if (this.contractData.PRC_ST === undefined) {
            this.contractData.PRC_ST = [];
        }
        var isUnique = lnavUtil.IsUniqueInList(this.contractData.PRC_ST, this.newStrategy["TITLE"], "TITLE", false);
        if (!isUnique) {
            this.newStrategy._behaviors.validMsg["TITLE"] = "* must have unique name within contract";
            this.newStrategy._behaviors.isError["TITLE"] = true;
            isvalid = false;
        }

        // Check name length
        if (this.newStrategy["TITLE"].length > 80) {
            this.newStrategy._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
            this.newStrategy._behaviors.isError["TITLE"] = true;
            isvalid = false;
        }
        if (isvalid) {
            this.addPricingStrategy();
        } else {
            this.isAddStrategyBtnHidden = false;
        }
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
        ps.IS_HYBRID_PRC_STRAT = (this.newStrategy.IS_HYBRID_PRC_STRAT === true ? 1 : 0);

        this.lnavSvc.createPricingStrategy(custId, contractId, ps).subscribe((response: any) => {
            if (this.contractData.PRC_ST === undefined) this.contractData.PRC_ST = [];
            ps.DC_ID=response.PRC_ST[1].DC_ID ;
            this.contractData.PRC_ST.push(ps);
            this.showAddPricingTable(ps);

            this.newStrategy.TITLE = "";
            this.newStrategy.IS_HYBRID_PRC_STRAT = true;
            this.curPricingStrategy = ps;
            this.curPricingStrategyId = ps.DC_ID;
            this.contractDetailsSvc.readContract(contractId).subscribe((response: Array<any>) => {
                this.contractData = response[0];
            });

        })
    }   

    refreshContractData(cId) {
         this.contractDetailsSvc
            .readContract(cId)
            .subscribe((response: Array<any>) => {
                this.contractData = response[0];                
            });
    }

    // **** PRICING TABLE Methods ****

    clearPtTemplateIcons() {
        /*angular.forEach(this.templates.ModelTemplates.PRC_TBL,
            function (value, key) {
                value._custom._active = false;
            });*/
    }    

    selectPtTemplateIcon(DealType) {
        const Title = this.ptTITLE;
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL[DealType.name];
        this.newPricingTable["TITLE"] = Title;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = DealType.name;
        this.newPricingTable["_extraAtrbs"] = DealType.extraAtrbs;
        this.newPricingTable["_defaultAtrbs"] = DealType.defaultAtrbs
        this.newPricingTable = lnavUtil.defaultAttribs(this.newPricingTable, this.isTenderContract, this.contractData);
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
            this.loggerSvc.error("Could not create the Pricing Table.", "Error");            
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
        this.lnavSvc.createPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, pt).subscribe((response: any) => {
            pt.DC_ID = response.PRC_TBL[1].DC_ID;
            this.contractDetailsSvc.readContract(this.contractData.DC_ID).subscribe((response: Array<any>) => {
                this.contractData = response[0];
                this.loadPTE(pt.DC_PARENT_ID, pt.DC_ID);
            });
        })
    }

    clearNptTemplate() {
        this.currentPricingTable = null;        
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL.ECAP;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = "";
    }

    /* Ps and Pt Tree*/
    showAddPricingTable(ps) {       
        this.isAddPricingTableHidden = false;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;
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

    copyPricingStrategy() {
        alert('all inputs ready, Functionality Coming Soon');
    }

    editPricingStrategyName(ps) {
        alert('all inputs ready, Functionality Coming Soon');
    }

    deletePricingStrategy(ps) {
        alert('all inputs ready, Functionality Coming Soon');
    }
    
    onSelectMenu(event: any, ps: any): void {        
        switch (parseInt(event.index)) {
            case 0:
                this.toggleAddStrategy();
                break;
            case 1:
                this.copyPricingStrategy();
                break;
            case 2:
                this.showAddPricingTable(ps);
                break;
            case 3:
                this.editPricingStrategyName(ps);
                break;
            case 4:
                this.deletePricingStrategy(ps);
                break;
            default:
                break;
        }

    }
    

    hideAddPricingTable() {
        this.isAddPricingTableHidden = true;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = false;
        this.isSearchHidden = false;
        //this.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.ECAP);
        this.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type
        this.clearPtTemplateIcons();
        // $scope.curPricingStrategy = {}; //clears curPricingStrategy
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

    // **** LEFT NAVIGATION Methods ****    
    toggleLnav(src:string) {
        this.isLnavHidden['isLnavHid'] = !this.isLnavHidden['isLnavHid'];
        this.isLnavHidden['source'] = src;
        this.lnavSvc.isLnavHidden.next(this.isLnavHidden);
    }
    toggleStrategyTree() {        
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = !this.isPSExpanded[i];
        });
        this.strategyTreeCollapseAll = !this.strategyTreeCollapseAll;
    }
    isExistingContract() {
        return this.contractData.DC_ID > 0;
    }
    toggleSearch() {
        this.isSearchHidden = !this.isSearchHidden;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = false;
        this.isAddPricingTableHidden = true;
    }

    //LNAv flow Mini
    gotoDealEntry() {
        //we reset any PS/PT/WIP specific information to remove unnecessary highlights or headers - perhaps this should be kept in the $scope.goto function instead?
        this.curPricingStrategyId = 0;
        this.curPricingStrategy = {};
        this.curPricingTable = {};
        this.curPricingTableId = 0;
        this.isPtr = false;
        this.isWip = false;
        this.goto('Deal Entry', 'contract.manager');
    }
    gotoCompliance() {
        if (!lnavUtil.enableFlowBtn(this.contractData)) return;
        this.goto('Compliance', 'contract.compliance');
    }
    gotoManage() {
        if (!lnavUtil.enableFlowBtn(this.contractData)) return;
        this.isAddPricingTableHidden = true;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;
        this.goto('Manage', 'contract.summary');
    }

    goto(mode, state) {       
        this.flowMode = mode;        
    } 

    removeBlanks(val) {
        return val.replace(/_/g, '');
    }

    ngOnInit() {
        this.newStrategy = this.UItemplate["ObjectTemplates"]?.PRC_ST.ALL_TYPES;
        this.newStrategy.IS_HYBRID_PRC_STRAT = false;
        this.PtDealTypes = lnavUtil.filterDealTypes(this.UItemplate);
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = false
        });
    }
}

angular.module("app").directive(
    "lnavView",
    downgradeComponent({
        component: lnavComponent,
    })
);