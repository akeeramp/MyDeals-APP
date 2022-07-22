import * as angular from "angular";
import * as _ from "underscore";
import { lnavService } from "../lnav/lnav.service";
import { logger } from "../../shared/logger/logger";
import { lnavUtil } from '../lnav.util';
import { downgradeComponent } from "@angular/upgrade/static";
import { headerService } from "../../shared/header/header.service";
import { templatesService } from "../../shared/services/templates.service";
import { pricingTableComponent } from "../pricingTable/pricingTable.component";
import { MatDialog } from '@angular/material/dialog';
import { AutoFillComponent } from "../ptModals/autofillsettings/autofillsettings.component";
import { contractDetailsService } from "../contractDetails/contractDetails.service";
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { pricingTableEditorService } from "../pricingTableEditor/pricingTableEditor.service";

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

export class lnavComponent {
    constructor(private loggerSvc: logger, private templatesSvc: templatesService, private lnavSvc: lnavService, private pricingTableComp: pricingTableComponent, private headerSvc: headerService, private contractDetailsSvc: contractDetailsService, private dialog: MatDialog, private pteSVC: pricingTableEditorService) {

    }
    @Input() contractId: number;
    @Input() contractData;
    @Input() UItemplate;
    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

    public query = "";
    public newStrategy: any = {};
    public PtDealTypes;
    public ptTITLE = "";
    public newPricingTable: any = {};;
    public isTenderContract = false;
    public currentPricingTable: any = {};
    public isAddStrategyHidden = true;
    public isAddPricingTableHidden = true;
    public isLnavHidden: any = { isLnavHid: false, source: 'PT' };
    public renameMapping = {};
    public container: any;
    public strategyTreeCollapseAll = true; isCollapsed = false; isSearchHidden = false; isSummaryHidden = true;
    isAddStrategyBtnHidden = true;
    private CAN_VIEW_COST_TEST: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
    private CAN_VIEW_MEET_COMP: boolean = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null) && ((<any>window).usrRole !== "FSE"); // Can view meetcomp pass fail
    private CAN_VIEW_EXPORT = true;
    private CAN_VIEW_ALL_DEALS = true;
    private usrRole;
    private isSuper = true;
    private superPrefix = "";
    private extraUserPrivsDetail: Array<string> = [];
    private contractType = "Contract";
    private selectedTab: number = 0;
    private selectedModel;
    private contractId_Map: contractIds = { Model: 'PTE', C_ID: 0, ps_id: 0, pt_id: 0, contractData: {} };
    public flowMode = "Deal Entry";
    private autoFillData: any = null;
    // Initialize current strategy and pricing table variables
    public curPricingTable: any = {}; curPricingTableId = 0;
    curPricingStrategyId = 0; curPricingStrategy: any = {}; spreadNeedsInitialization = true;
    public isPtr = false; isWip = false; isPSExpanded = [];
    public custId: any;
    public objTypeCdMessage;


    //Output Emitter to load the Pricing table data
    loadPTE(psId, ptId) {
        const contractId_Map: contractIds = {
            Model: 'PTE',
            ps_id: psId,
            C_ID: this.contractId,
            contractData: this.contractData,
            pt_id: ptId
        };
        this.modelChange.emit(contractId_Map);
    }
    loadModel(model: string) {
        const contractId_Map: contractIds = {
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
        this.isAddStrategyBtnHidden = !this.isAddStrategyBtnHidden;
        this.isSearchHidden = false;
        this.isAddPricingTableHidden = true;
    }
    customAddPsValidate() {
        let isvalid = true;
        this.isAddStrategyBtnHidden = true;
        const values = this.newStrategy;

        // Clear all values
        _.each(values,
            function (value, key) {
                values._behaviors.validMsg[key] = "";
                values._behaviors.isError[key] = false;
            });
        // Check required
        _.each(values,
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
            ps.DC_ID = response.PRC_ST[1].DC_ID;
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
        _.each(this.PtDealTypes,
            function (value) {
                value._custom._active = false;
            });
    }
    customAddPtValidate() {
        let isValid = true;
        this.newPricingTable["TITLE"] = this.ptTITLE;
        const values = this.newPricingTable;
        isValid = this.isValidPt(values);       
        if (isValid) {
            this.addPricingTable();
        }
    }
    isValidPt(values) {
        let isValid = true;
        // Clear all values
        _.each(values,
            function (value, key) {
                if (values._behaviors.validMsg[key]) {
                    values._behaviors.validMsg[key] = "";
                    values._behaviors.isError[key] = false;
                }
            });

        //// Check required
        _.each(values,
            function (value, key) {
                if (key[0] !== '_' &&
                    !Array.isArray(value) &&
                    (!isNaN(value) || value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                    values._behaviors.isRequired[key] === true) {
                    values._behaviors.validMsg[key] = "* field is required";
                    values._behaviors.isError[key] = true;
                    isValid = false;
                }
            });

        // Check unique name within ps
        if (!!this.curPricingStrategy) {
            if (this.curPricingStrategy.PRC_TBL === undefined) {
                this.curPricingStrategy.PRC_TBL = [];
            }
            var isUnique = lnavUtil.IsUniqueInList(this.curPricingStrategy.PRC_TBL, this.newPricingTable["TITLE"], "TITLE", false);

            if (!isUnique) {
                this.newPricingTable._behaviors.validMsg["TITLE"] = "* must have unique name within strategy";
                this.newPricingTable._behaviors.isError["TITLE"] = true;
                isValid = false;
            }
        }

        // Check name length
        if (this.newPricingTable["TITLE"].length > 80) {
            this.newPricingTable._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
            this.newPricingTable._behaviors.isError["TITLE"] = true;
            isValid = false;
        }

        // Check if there is a selected deal type
        if (this.newPricingTable.OBJ_SET_TYPE_CD == "") {
            this.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "* please select a deal type";
            this.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = true;
            isValid = false;
         }

         return isValid;
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
        this.PtDealTypes = null;
        this.clearNptTemplate();
        this.curPricingStrategy = ps;
        this.ptTITLE = "";
        let isHybridDeal = (Number(this.curPricingStrategy.IS_HYBRID_PRC_STRAT) == 1 ? true : false);
        this.PtDealTypes = lnavUtil.filterDealTypes(this.UItemplate, isHybridDeal);
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
    onSelectMenu(event: any, ps: any, pt: any): void {
        //Number eventIndex = parseInt(event.index);
        switch (event.item?.text) {
            case "Add Pricing Strategy":
                this.toggleAddStrategy();
                break;
            case "Copy Pricing Strategy":
                this.copyPricingStrategy();
                break;
            case "Add Pricing Table":
                this.showAddPricingTable(ps);
                break;
            case "Edit Pricing Strategy Name":
                this.editPricingStrategyName(ps);
                break;
            case "Edit Autofill Defaults":
                this.openAutoFill(ps, pt);
                break;
            case "Delete Pricing Strategy":
                this.deletePricingStrategy(ps);
                break;
            default:
                break;
        }

    }
    openAutoFill(ps, pt) {
        let ptTemplate;
        let isVistexHybrid;
        if (ps != null) {
            this.curPricingStrategy = ps;
        }
        if (pt != null) {
            this.curPricingTable = pt;
            this.newPricingTable = pt;
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            this.newPricingTable["_defaultAtrbs"] = lnavUtil.updateNPTDefaultValues(pt, ptTemplate.defaultAtrbs);
        }
        else {            
            ptTemplate = this.UItemplate.ModelTemplates.PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
            this.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            this.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
            this.newPricingTable = lnavUtil.setDefaultAttributes(this.newPricingTable, this.isTenderContract, pt, this.contractData);
        }
        if (this.contractData != null) { // Moved down due to normal items missing customer level fields in some cases.
            this.custId = this.contractData.CUST_MBR_SID; //contractData.data[0].Customer.CUST_SID;
        }
        if (this.curPricingStrategy.IS_HYBRID_PRC_STRAT) {
            isVistexHybrid = (this.curPricingStrategy.IS_HYBRID_PRC_STRAT === "1" ? true : false);
        }
        else {
            isVistexHybrid = (ps.IS_HYBRID_PRC_STRAT === "1" ? true : false);
        }

        let autofillData = {
            "ISTENDER": this.isTenderContract,
            "isVistexHybrid": isVistexHybrid,            
            "DEFAULT": lnavUtil.getTenderBasedDefaults(this.newPricingTable, this.isTenderContract),
            "ISVISTEX": false,            
            "contractData": this.contractData,
            "currPt": pt,
            "currPs": this.curPricingStrategy,
            "newPt": this.newPricingTable,
            "ptTemplate": ptTemplate
        };
        this.autoFillData = autofillData;
        const dialogRef = this.dialog.open(AutoFillComponent, {
            height: '750px',
            width: '1500px',
            data: autofillData,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //the scuscriber to this in PTE ngonint code and this fill help autofill setting from PTE screen
                this.autoFillData = result;                
                if (pt == null) {
                    this.newPricingTable = this.autoFillData["newPt"];
                    this.contractDetailsSvc.readContract(this.contractData.DC_ID).subscribe((response: Array<any>) => {
                        this.contractData = response[0];
                        this.loadPTE(this.newPricingTable.DC_PARENT_ID, this.newPricingTable.DC_ID);
                    });
                    this.hideAddPricingTable();
                }              
            }
        });
    }    
    selectPtTemplateIcon(DealType) {
        let isValid = true;
        this.clearPtTemplateIcons();
        const Title = this.ptTITLE;
        DealType._custom._active = true;
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL[DealType.name];
        this.newPricingTable["TITLE"] = Title;
        this.newPricingTable["OBJ_SET_TYPE_CD"] = DealType.name;
        this.newPricingTable["_extraAtrbs"] = DealType.extraAtrbs;
        this.newPricingTable["_defaultAtrbs"] = DealType.defaultAtrbs
        if (DealType.name !== "" && !!this.newPricingTable._behaviors && !!this.newPricingTable._behaviors.isError) {
            this.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = false;
            this.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "";
        }
        const values = this.newPricingTable;
        isValid = this.isValidPt(values);
        if (isValid) {
            this.openAutoFill(null, null);
        }
        else {
            this.clearPtTemplateIcons();
        }       
    }
    hideAddPricingTable() {
        this.isAddPricingTableHidden = true;
        this.isAddStrategyHidden = true;
        this.isAddStrategyBtnHidden = true;
        this.isSearchHidden = false;        
        this.clearPtTemplateIcons();        
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
    toggleLnav(src: string) {
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
        this.isAddStrategyBtnHidden = true;
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
        this.newPricingTable = this.UItemplate.ObjectTemplates.PRC_TBL.ECAP;
        this.newStrategy.IS_HYBRID_PRC_STRAT = false;
        this.contractData?.PRC_ST.map((x, i) => {
            this.isPSExpanded[i] = false
        });
        //code for autofill change to accordingly change values
        this.lnavSvc.autoFillData.subscribe(res => {
            this.autoFillData = res;
        }, err => {
            this.loggerSvc.error("lnavSvc::isAutoFillChange**********", err);
        });
    }
    ngAfterViewInit() {
        //This will help to highlight the selectd PT incase of search result landing directly to PT. The logic can apply only once the page is rendered
        this.lnavSvc.lnavHieight.subscribe(res => {
            this.contractId_Map = res;
            (<any>$(`#sumPSdata_${this.contractId_Map.ps_id}`)).collapse('show');
        }, err => {
            this.loggerSvc.error("lnavSvc::lnavHieight**********", err);
        });
    }
}

angular.module("app").directive(
    "lnavView",
    downgradeComponent({
        component: lnavComponent,
    })
);