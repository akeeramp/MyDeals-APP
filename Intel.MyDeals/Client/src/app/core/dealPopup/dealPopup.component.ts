import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger"; 
import { dealPopupService } from "./dealPopup.service";
import { colorDictionary, opGridTemplate } from "../angular.constants";
import { AppEvent, broadCastService } from "./broadcast.service";
import * as moment from "moment";
import { DE_Load_Util } from "../../contract/DEUtils/DE_Load_util";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { lnavService } from "../../contract/lnav/lnav.service"; 
import * as _ from "underscore";
@Component({
    selector: "deal-popup",
    templateUrl: "Client/src/app/core/dealPopup/dealPopup.component.html", 
})

export class dealPopupComponent {
    @Input() dealId: any;
    @Input() initLeft: any;
    @Input() initTop: any;
    @Input() isOpen: any;

    propSearchFilter: any;
    showPanel: any;
    path: any;
    limitTo: any;
    openWithData: any;
    CAN_VIEW_MEET_COMP: boolean;
    CAN_VIEW_COST_TEST: boolean;
    isLoading = true;
    disableQoute=false;
    disableShedule=false
    productsLoaded= false;
    timelineLoaded = false;
    showSedulecolums = false;
    showProductscolums = false;
    toggleserachgrid = false;
    disablePayment = true;
    helpTip :any;
    sel: any;
    percData: any;
    pieData: any = []; 
    groups = [];
    groupColumns = {}; 
    timelineData = [];  
    atrbMap: any;
    properties: any = [];
    scheduleData: any = [];
    timelinegridResult: any;
    searchHeight = 140;
    data: any; 

    private timelinegridData: GridDataResult;
    private productsgridData: GridDataResult;
    private propertiesgridData: GridDataResult;
    private searchgridData: GridDataResult;
    private schedulegridData: GridDataResult;
   
    propertiesInclude = ["RATE", "DENSITY_RATE", "STRT_VOL", "END_VOL", "STRT_REV", "END_REV", "STRT_PB", "END_PB"];
    propertiesExclude = ["PASSED_VALIDATION", "DC_PARENT_ID", "TIER_NBR"];

    private state: State = {
        skip: 0,
        take: 25,        
    };

    private searchstate: State = {
        skip: 0,
        group: [{ field: "group" }],

    };

    private newsearchstate: State = {
        skip: 0,
        group: [],

    };

    private schedulestate: State = {
        skip: 0,
        group: [],

    };


    constructor(private loggersvc: logger, private dealPopupsvc: dealPopupService, private brdcstservice: broadCastService,private lnavSvc: lnavService) {        
     }


    loadPopupdata(sel) {
        this.data = this.intializedata(); 
        this.isOpen = true;
        this.openWithData = false;
        this.percData = null;
        this.CAN_VIEW_COST_TEST = this.lnavSvc.chkDealRules('CAN_VIEW_COST_TEST', (<any>window).usrRole, null, null, null) || ((<any>window).usrRole === "GA" && (<any>window).isSuper); // Can view the pass/fail
        this.CAN_VIEW_MEET_COMP = this.lnavSvc.chkDealRules('CAN_VIEW_MEET_COMP', (<any>window).usrRole, null, null, null);
            
        this.dealPopupsvc.getWipDealById(this.dealId).subscribe((result: any) => {
            if (result.Data === null) {
                this.loggersvc.warn("Unable to locate Deal # '" + this.dealId + "'", "No Deal");
                this.closeNav();
                return;
            } 
            let numTiers, t;
            this.isLoading = false;
            this.data = result.Data;
            this.path = result.Path;
            this.atrbMap = result.AtrbMap;
            this.openWithData = true;
            this.sel = this.sel === undefined ? 1 : sel;
            this.showPanel = true;
            this.data.START_DT = moment(this.data.START_DT).format("MM/DD/YY");
            this.data.END_DT = moment(this.data.END_DT).format("MM/DD/YY");
            this.data.NOTES = this.data.NOTES.replace(/\n/g, '<br/>');
            this.groups = opGridTemplate.groups[this.data.OBJ_SET_TYPE_CD];
            this.groupColumns = opGridTemplate.templates[this.data.OBJ_SET_TYPE_CD];

            if (this.data.OBJ_SET_TYPE_CD !== "ECAP" && this.data.OBJ_SET_TYPE_CD !== "KIT") {
                this.disableQoute = true; 
            }

            if (this.data.OBJ_SET_TYPE_CD === "PROGRAM" || this.data.OBJ_SET_TYPE_CD === "ECAP") {
                this.disableShedule = true;
            }
            if (this.data.OBJ_SET_TYPE_CD === "ECAP" || this.data.OBJ_SET_TYPE_CD === "KIT" || this.data.IS_HYBRID_PRC_STRAT =="1") {
                this.disablePayment = false;
            }
            if (!(this.data.WF_STG_CD !== 'Cancelled' && (this.data.WF_STG_CD === 'Active' || this.data.WF_STG_CD === 'Won' || this.data.WF_STG_CD === 'Offer' || this.data.WF_STG_CD === 'Pending' || this.data.HAS_TRACKER === '1'))) {
                this.disableQoute = true;
            }

            if (this.data.CREDIT_VOLUME === "") this.data.CREDIT_VOLUME = 0;
            if (this.data.DEBIT_VOLUME === "") this.data.DEBIT_VOLUME = 0;
            if (this.data.CREDIT_AMT === "") this.data.CREDIT_AMT = 0;
            if (this.data.DEBIT_AMT === "") this.data.DEBIT_AMT = 0;
            this.percData = DE_Load_Util.getTotalDealVolume(this.data); 
            this.pieData.push({ type: "Credit / Debit", percentage: this.percData.perc });
            this.pieData.push({ type: "Accruable", percentage: (100 - this.percData.perc) });

            //shedule task

            let rateKey, endKey, strtKey, addedSymbol, fixedPoints: any;

            if (this.data.OBJ_SET_TYPE_CD === "VOL_TIER" || this.data.OBJ_SET_TYPE_CD === "FLEX" || this.data.OBJ_SET_TYPE_CD === "REV_TIER" || this.data.OBJ_SET_TYPE_CD === "DENSITY") {
                numTiers = parseInt(this.data.NUM_OF_TIERS);
                  rateKey = "RATE"; endKey = "END_VOL"; strtKey = "STRT_VOL"; addedSymbol = "$"; fixedPoints = 2; // Defaults for VOL_TIER/FLEX

                if (this.data.OBJ_SET_TYPE_CD === "REV_TIER") { // Defaults for REV_TIER
                    rateKey = "INCENTIVE_RATE"; endKey = "END_REV"; strtKey = "STRT_REV"; addedSymbol = ""; fixedPoints = 2;
                }
                if (this.data.OBJ_SET_TYPE_CD === "DENSITY") { // Defaults for DENSITY
                    rateKey = "DENSITY_RATE"; endKey = "END_PB"; strtKey = "STRT_PB"; addedSymbol = ""; fixedPoints = 3;
                }

                for (t = 1; t <= numTiers; t++) {
                    const r = this.data[rateKey]["10___" + t];
                    let rate;
                    if (r == undefined) {
                        rate = '';
                    }else
                     rate = Number.isNaN(r) ? "" : "$" + parseFloat(r).toFixed(fixedPoints);
                    this.scheduleData.push({
                        STRT_VOL: this.data[strtKey]["10___" + t],
                        END_VOL: this.data[endKey]["10___" + t],
                        RATE: rate,
                        TIER_NBR: t
                    });
                }

            } else if (this.data.OBJ_SET_TYPE_CD === "KIT") {
                const prd = this.data.PRODUCT_NAME;
                prd["20_____1"] = ""; // add KIT
                for (const k in prd) {
                    if (prd.hasOwnProperty(k)) {
                        if (typeof prd[k] !== 'function') {
                            const dimIndx = k.split("20___")[1];
                            this.scheduleData.push({
                                YCS2_PRC_IRBT: this.data.YCS2_PRC_IRBT["20___" + dimIndx],
                                YCS2_END_DT: this.data.YCS2_END_DT["20___" + dimIndx],
                                YCS2_START_DT: this.data.YCS2_START_DT["20___" + dimIndx],
                                TRKR_NBR: this.data.TRKR_NBR["20___" + dimIndx],
                                QTY: this.data.QTY["20___" + dimIndx],
                                ECAP_PRICE: this.data.ECAP_PRICE["20___" + dimIndx],
                                DSCNT_PER_LN: this.data.DSCNT_PER_LN["20___" + dimIndx],
                                CAP: this.data.CAP["20___" + dimIndx],
                                CAP_END_DT: this.data.CAP_END_DT["20___" + dimIndx],
                                CAP_STRT_DT: this.data.CAP_STRT_DT["20___" + dimIndx],
                                PRD_TYPE: this.getDimLabel("20___" + dimIndx),
                                PRODUCT: prd[k]
                            });
                        }
                    }
                }
            } 

            for (const k in this.data) {
                
                if (this.data.hasOwnProperty(k)) {
                   
                    if (typeof this.data[k] !== 'function') {
                        if (this.propertiesInclude.indexOf(k) >= 0 || (this.groupColumns[k] !== undefined && this.propertiesExclude.indexOf(k) < 0))
                        {
                            let mapVal;
                            let atrbVal;
                            mapVal = this.atrbMap[k] === undefined ? k : this.atrbMap[k];
                            atrbVal = this.data[k];

                            if (k === "CUST_MBR_SID") {
                                mapVal = "Customer";
                                atrbVal = this.data.Customer.CUST_NM;
                            }
                            if (k === "DC_ID") {
                                mapVal = "Deal #";
                            }
                            this.properties.push({
                                key: mapVal,
                                value: atrbVal,
                                group: this.groupColumns[k] === undefined ? "All" : this.groupColumns[k].Groups[0]
                            });
                           

                        }
                    }

                }
            }
            
            this.helpTip = 0;
        }, () => { 
            this.loggersvc.warn("Unable to locate Deal # '" + this.dealId + "'", "No Deal");
            this.closeNav();
        });
    }

    closeNav() {
        this.sel = 0;
        this.isOpen = false;
        this.openWithData = false;
        this.isLoading = true;
        this.timelineLoaded = false;
        const dealdata = {
            id: this.dealId,
            key: "QuickDealWidgetClosed"
        }
        
        this.brdcstservice.dispatch(new AppEvent(dealdata.key, dealdata));
    }

      refresh  () {
        const sel = this.sel;
        this.isOpen = false;
        this.openWithData = false;
        this.isLoading = true;
        this.data = {};
        this.path = {};
        this.atrbMap = {};
        this.sel = 0;
        this.showPanel = false;
        this.properties = [];
        this.helpTip = 0;
        this.percData = {};
        this.groups = [];
        this.groupColumns = {};
        this.timelineLoaded = false;
        this.timelineData = [];
        this.productsLoaded = false;
        this.pieData = [];
        this.scheduleData = [];
        this.loadPopupdata(sel);
    }


    uiPropertyWrapper(data) {

        let dimkey: any;
        if (typeof data.value === 'object') {
            if (data.value === undefined || data.value === null) return "";
            const sortedKeys = Object.keys(data.value).sort();
            let tmplt = '';
            for (const index in sortedKeys) { //only looking for positive dim keys
                dimkey = sortedKeys[index];
                if (data.value.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                    const val = data.value[dimkey];
                    tmplt +=  this.getDimLabel(dimkey) + ":" + val;
                }
            }
            return tmplt;
        } else return data.value;
    }  
       
      
    focusMenu(event, id) {
         this.sel = id;
        if (this.sel === 6) this.openTimeline();
        if (this.sel === 4) this.openProducts();
         
        if (this.sel === 3) this.openSearch();

        if (this.sel === 2) { 
               
                // NEED TO CHANGE THIS FOR REV_TIER/DENSITY
                if ((this.data.OBJ_SET_TYPE_CD === "VOL_TIER" || this.data.OBJ_SET_TYPE_CD === "FLEX"
                    || this.data.OBJ_SET_TYPE_CD === "REV_TIER" || this.data.OBJ_SET_TYPE_CD === "DENSITY"))
                 this.showSedulecolums = true;
            if ((this.data.OBJ_SET_TYPE_CD === "KIT"))
                this.showProductscolums = true;
                    
            this.openSchedulegrid();
        }

        this.showPanel = true;
    }

    
    openTimeline = function () { 
        const pstdata = {
            objSid: this.dealId,
          objTypeSid: 5,
          objTypeIds: [5]
        }
        this.dealPopupsvc.getTimelineDetails(pstdata).subscribe((result: Array<any>) => {
            this.timelineLoaded = true;
            for (let d = 0; d < result.length; d++) {
                result[d].user = result[d].FRST_NM + " " + result[d].LST_NM;
                result[d].ATRB_VAL = result[d].ATRB_VAL.replace(/; /g, '<br/>');
            }
            this.timelinegridResult = result;
            this.timelinegridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('error in loading template details', error);
        });
    }

    datateplateStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.timelinegridData = process(this.timelinegridResult, this.state);
    }
     

    openProducts() {
            const prdIds = [];
            const prods = this.data.PRODUCT_FILTER;
            _.each(prods, function (value, key) {
                prdIds.push(value);
            });
        const productdata = {
            PrdIds: prdIds
        }
        
        this.dealPopupsvc.getProductsByIds(productdata).subscribe((result: any) => {
            this.productsLoaded = true;
            
            this.productsgridData = process(result, this.state);
        }, (error) => {
            this.loggersvc.error('error in loading product details', error);
        });
    }

    public group = [{ field: "group" }];

    openSearch() {
        this.group = [];
        this.properties = _.sortBy(this.properties, 'key');
        this.searchgridData = process(this.properties, this.newsearchstate); 
    }

    dataSearchStateChange(state: DataStateChangeEvent): void {
        this.searchstate = state;
        this.searchgridData = process(this.properties, this.searchstate);
    }


    public onFilter(event): void {
        const inputValue = event.target.value;
        if (inputValue != "") {
            const newdata = this.properties.filter(x => x.key.toLowerCase().includes(inputValue.toLowerCase()));
            this.searchgridData = process(newdata, this.searchstate);
        } else {
            this.searchgridData = process(this.properties, this.searchstate);
        }
    }


    openSchedulegrid() {
        this.schedulegridData = process(this.scheduleData, this.schedulestate); 
    }

    dataScheduleStateChange(state: DataStateChangeEvent): void {
        this.schedulestate = state;
        this.schedulegridData = process(this.properties, this.schedulestate);
    }

    QuickDealOpenPanel() {
        this.brdcstservice.on("QuickDealClosePanel").subscribe(() => {
            this.closePanel();
        });

        this.brdcstservice.on("QuickDealShowPanel").subscribe(() => {
            this.displayPanel();
        });
    }
     
    closeControl() {
        this.closeNav();
    }

    refreshControl() {
        this.refresh();
    }

    closePanel() {
        this.showPanel = false;
    }

    displayPanel() {
        this.showPanel = true;
    }

    tglGroup(data) {
        if (data.length > 0) {
            this.group = [];
            this.searchgridData = process(this.properties, this.newsearchstate);
        }
        else {
            this.group = [{ field: "group" }];
            this.searchgridData = process(this.properties, this.searchstate);
        }
    }

    tglGrdSize(toggleserachgrid) {
        if (toggleserachgrid) {
            this.searchHeight = 140;
            this.toggleserachgrid = false;
        }
        else {
            this.searchHeight = 298;
            this.toggleserachgrid = true;
        }
    }

    displayDealType() {
        return this.data.OBJ_SET_TYPE_CD === undefined ? "" : this.data.OBJ_SET_TYPE_CD.replace(/_/g, ' ');
    }

    getColorPct(costTestResult) {
        if (!costTestResult) costTestResult = "InComplete";
        return this.getColor('pct', costTestResult, colorDictionary);

    }
    getColorMct(meetCostTestResult) { 
        if (!meetCostTestResult) meetCostTestResult = "InComplete";
        return this.getColor('mct', meetCostTestResult, colorDictionary);
    }
     
    getColor(k: string, c: string, colorDictionary): string {
      
            const status = c.toLowerCase();
            switch (status) {
                case "not run yet":
                    return "#c7c7c7";
                case "overridden":
                    return "#0071c5";
                case "pass":
                    return "#c4d600";
                case "incomplete":
                    return "#F3D54E";
                case "fail":
                    return "#FF0000";
                case "na":
                    return "#c7c7c7";
                default:
                    return "#aaaaaa";
            }
        
    }

    getTrackerTitle() {
        return (this.data.HAS_TRACKER !== undefined && this.data.HAS_TRACKER === "1")
            ? "Has a tracker number"
            : "No Tracker Yet";
    }
    getStageBgColorStyle(bgstyle) {
        return { backgroundColor: this.getColorStage(bgstyle) };
    }
    
    getColorStage(d) {
        if (!d) d = "Draft";
        return this.getColorst('stage', d);
    }

    getColorst(k, c) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }


    intializedata() {
        return {
            DC_ID: 0,
            NOTES:'',
            }
    }

    getDimLabel(key) {
        let dim = "";
        if (key.indexOf("20____2") >= 0) dim = "SubKit";
        if (key.indexOf("20_____2") >= 0) dim = "SubKit";
        if (key.indexOf("20____1") >= 0) dim = "Kit";
        if (key.indexOf("20_____1") >= 0) dim = "Kit";
        if (key.indexOf("20___0") >= 0) dim = "Primary";
        if (key.indexOf("20___1") >= 0) dim = "Secondary 1";
        if (key.indexOf("20___2") >= 0) dim = "Secondary 2";
        if (key.indexOf("20___3") >= 0) dim = "Secondary 3";
        if (key.indexOf("20___4") >= 0) dim = "Secondary 4";
        if (key.indexOf("20___5") >= 0) dim = "Secondary 5";
        if (key.indexOf("20___6") >= 0) dim = "Secondary 6";
        if (key.indexOf("20___7") >= 0) dim = "Secondary 7";
        if (key.indexOf("20___8") >= 0) dim = "Secondary 8";
        if (key.indexOf("20___9") >= 0) dim = "Secondary 9";
        if (key.indexOf("10___1") >= 0) dim = "Tier 1";
        if (key.indexOf("10___2") >= 0) dim = "Tier 2";
        if (key.indexOf("10___3") >= 0) dim = "Tier 3";
        if (key.indexOf("10___4") >= 0) dim = "Tier 4";
        if (key.indexOf("10___5") >= 0) dim = "Tier 5";
        if (key.indexOf("10___6") >= 0) dim = "Tier 6";
        if (key.indexOf("10___7") >= 0) dim = "Tier 7";
        if (key.indexOf("10___8") >= 0) dim = "Tier 8";
        if (key.indexOf("10___9") >= 0) dim = "Tier 9";
        return dim;
    }


    downloadQuoteLetter()
    {
        const customerSid = this.data.CUST_MBR_SID;
        const objSid = this.data.DC_ID;
        const objTypeSid = 5;
        const downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + customerSid + "/" + objTypeSid + "/" + objSid + "/0";
        window.open(downloadPath, '_blank', '');
    }

    ngOnInit() {
        this.loadPopupdata(this.sel);
       this. QuickDealOpenPanel();
    }
    
}
 