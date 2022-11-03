import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "underscore";
import { forkJoin, Observable, of } from 'rxjs';
import { autoFillService } from "../autofillsettings/autofillsetting.service";
import { logger } from '../../../shared/logger/logger';
import { CheckedState } from "@progress/kendo-angular-treeview";
import { templatesService } from "../../../shared/services/templates.service";

@Component({
    selector: "autofill-selector",
    templateUrl: "Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.html",
    styleUrls: ["Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class AutoFillComponent {
    private dropdownResponses: any = null;
    private isLoading: boolean = false;
    private spinnerMessageHeader: string = "";
    private rebateTypeTitle: string = "";
    private spinnerMessageDescription: string = "";
    private msgType: string = "";
    private geoValues: Array<string> = [];
    private geos: Array<string> = [];
    private isBlend: boolean = false;
    private marketSeglist: any = [];
    private nonCorpMarketSeg: any = [];
    private mkgvalues: Array<string> = [];
    private multSlctMkgValues: Array<string> = [];
    private parentKeys: any = [];
    private opValidMsg: string = "";
    private isMultipleGeosSelected: boolean = false;
    private CurrPricingStrategy: any = {};
    private currPricingTable: any = {};
    private contractData: any = {};
    private newPricingTable: any = {};
    private dealType: string = "";
    private custID;
    private ptTemplate;
    //UItemplate is to get lnav data
    public UItemplate: any;

    constructor(
        private autoSvc: autoFillService,
        private loggerSvc: logger, private templatesSvc: templatesService,
        public dialogRef: MatDialogRef<AutoFillComponent>,
        @Inject(MAT_DIALOG_DATA) public autofillData: any
    ) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG  
    }

    setBusy(msg, detail, msgType, showFunFact) {
        setTimeout(() => {
            const newState = msg != undefined && msg !== "";

            // if no change in state, simple update the text            
            if (this.isLoading === newState) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
                return;
            }
            this.isLoading = newState;
            if (this.isLoading) {
                this.spinnerMessageHeader = msg;
                this.spinnerMessageDescription = !detail ? "" : detail;
                this.msgType = msgType;
            } else {
                setTimeout(() => {
                    this.spinnerMessageHeader = msg;
                    this.spinnerMessageDescription = !detail ? "" : detail;
                    this.msgType = msgType;
                }, 100);
            }
        });
    }

    public isChecked = (dataItem: any, index: string): CheckedState => {
        if (this.containsItem(dataItem)) { return 'checked'; }
        if (this.isIndeterminate(dataItem.items)) { return 'indeterminate'; }
        return 'none';
    };

    private containsItem(item: any): boolean {
        if (this.mkgvalues != undefined && this.mkgvalues != null && this.mkgvalues.length > 0)
            return this.mkgvalues.indexOf(item['DROP_DOWN']) > -1;
        else
            return false;
    }

    private isIndeterminate(items: any[] = []): boolean {
        if (items != undefined && items != null) {
            let idx = 0;
            let item;
            while (item = items[idx]) {
                if (this.isIndeterminate(item.items) || this.containsItem(item)) {
                    return true;
                }
                idx += 1;
            }
        }
        return false;
    }
    async getAllDropdownValues() {
        let dropObjs = {};
        _.each(this.autofillData.DEFAULT, (val, key) => {
            if (val.opLookupUrl && val.opLookupUrl != '' && val.opLookupUrl != undefined) {
                if (key == 'PERIOD_PROFILE') {
                    let custId = this.custID ? parseInt(this.custID) : 0;
                    dropObjs[`${key}`] = this.autoSvc.readDropdownEndpoint(val.opLookupUrl + `/${custId}`);
                }
                else {
                    dropObjs[`${key}`] = this.autoSvc.readDropdownEndpoint(val.opLookupUrl);
                }
            }

        });
        dropObjs[`${'MRKT_SEG_NON_CORP'}`] = this.autoSvc.readDropdownEndpoint("/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP")
        let result = await forkJoin(dropObjs).toPromise().catch((err) => {
            this.loggerSvc.error('AutoFillComponent::getAllDrowdownValues::service', err);
        });
        return result;
    }
    OnGeoChange(elem: string, val: Array<string>) {
        this.geos = val;
        this.geoValues = val;
        if (val.length > 1) {
            this.isMultipleGeosSelected = true;
        }
        else {
            this.isMultipleGeosSelected = false;
        }
        if (this.isBlend) {
            this.updateBlend(elem);
            this.autofillData.DEFAULT[`${elem}`].value = this.geos;
        } else {
            this.geoValues = val;
            this.autofillData.DEFAULT[`${elem}`].value = this.geoValues;
        }

    }
    updateBlend(elem: string) {
        if (this.isBlend) {
            this.geos = this.convertToBlend(this.geos);
        } else {
            this.geos = this.convertFromBlend(this.geos);
        }
        this.autofillData.DEFAULT[`${elem}`].value = this.geos;
    }

    convertToBlend(data) {  //geos is array
        if (data.indexOf("Worldwide") > -1) {    //contains WW
            if (data.length > 1) {   //contains an item other than WW
                data.splice(data.indexOf("Worldwide"), 1);
                data = "[" + data.join() + "],Worldwide";
                this.geoValues.push("Worldwide");
            }
        } else {
            if (data.length > 0) {   //does not contain geo and is not empty
                data = "[" + this.geos.join() + "]";
            }
        }
        return data;
    }

    convertFromBlend(data) {    //geos is blend string
        if (data.length > 1) {
            return data.replace('[', '').replace(']', '').split(',');
        } else {
            return data;
        }
    }

    onMarkSegChange(event: any) {
        this.mkgvalues = this.multSlctMkgValues;
    }

    onMktgValueChange(event: any) {
        if (event && event.length > 0) {
            var selectedList = event.join(",");
            if (_.indexOf(event, 'All Direct Market Segments') > 0 || (event.length == 1 && _.indexOf(event, 'All Direct Market Segments') == 0)) {
                this.mkgvalues = ['All Direct Market Segments'];
                this.multSlctMkgValues = this.mkgvalues;
            }
            else {
                if (_.indexOf(event, 'All Direct Market Segments') == 0) {
                    this.mkgvalues.splice(0, 1);
                }
                _.each(this.mkgvalues, (key) => {
                    var selectedData = this.marketSeglist.filter(x => x.DROP_DOWN == key);
                    if (selectedData != undefined && selectedData != null && selectedData.length > 0 && selectedData[0].items != undefined && selectedData[0].items != null && selectedData[0].items.length > 0) {
                        this.mkgvalues = [selectedData[0].items[0].DROP_DOWN];
                    }
                });
                _.each(this.parentKeys, (key) => {
                    if (selectedList.includes(key)) {
                        this.mkgvalues = [this.mkgvalues[this.mkgvalues.length - 1]];
                    }
                });
                if (_.indexOf(this.mkgvalues, "NON Corp") >= 0) {
                    let corpMarkSeg = _.map(this.nonCorpMarketSeg, (x) => { return x.DROP_DOWN })
                    _.each(corpMarkSeg, (val) => {
                        if ((_.indexOf(this.mkgvalues, val) < 0)) {
                            this.mkgvalues.push(val);
                        }
                    })
                }
                this.multSlctMkgValues = _.clone(this.mkgvalues);
                let nonCorpIdx = _.indexOf(this.multSlctMkgValues, "NON Corp");
                if (nonCorpIdx != -1) {
                    this.multSlctMkgValues.splice(nonCorpIdx, 1);
                }
            }
            if (this.autofillData["DEFAULT"].hasOwnProperty("MRKT_SEG")) {
                this.autofillData["DEFAULT"]["MRKT_SEG"].value = this.multSlctMkgValues;
            }
            this.multSlctMkgValues.sort();
        }
        else {
            this.multSlctMkgValues = this.mkgvalues;
        }
    }

    asIsOrder(a, b) {
        return 1;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    onSave() {
        this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.validMsg = this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.validMsg = "";
        this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.isError = this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.isError = false;
        this.opValidMsg = "";
        if (this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value != null && // Can't fill in both values
            this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value !== "" &&
            this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value != null &&
            this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value !== "") {
            this.opValidMsg =
                "Both Overarching Maximum Volume and Overarching Maximum Dollars cannot be filled out.  Pick only one.";
        } else if (this.autofillData.isVistexHybrid != null &&
            this.autofillData.isVistexHybrid === true &&
            ((this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === "" || this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === null)
                && (this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === "" || this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === null))) {
            this.opValidMsg =
                "Hybrid Deals require either Overarching Maximum Dollars or Overarching Maximum Volume be filled out.  Pick one.";
        } else if (this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === "0" || this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === 0) {
            this.opValidMsg = "Overarching Maximum Dollars must be blank or > 0";
        } else if (this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === "0" ||
            this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === 0) {
            this.opValidMsg = "Overarching Maximum Volume must be blank or > 0";
        } else {
            if (this.autofillData.ISTENDER) {
                // For Tenders, default to blank and let priceTable.controller.js handle setting it
                if (this.autofillData.DEFAULT.AR_SETTLEMENT_LVL.value !== "") {
                    this.autofillData.DEFAULT.AR_SETTLEMENT_LVL.value = "";
                }
                if (this.autofillData.DEFAULT.PERIOD_PROFILE.value !== "Yearly") {
                    this.autofillData.DEFAULT.PERIOD_PROFILE.value = "Yearly";
                }
            }
            this.isLoading = true;
            this.setBusy("Saving...", "Saving your data...", "Info", false);
            if (this.currPricingTable == null) {
                this.addPricingTable();
            } else {
                this.editPricingTable();
            }
        }
    }

    editPricingTable() {
        var isValid = true;
        var pt = this.currPricingTable;
        for (var atrb in this.autofillData["DEFAULT"]) {
            if (this.autofillData["DEFAULT"].hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {  //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                if (Array.isArray(this.autofillData["DEFAULT"][atrb].value)) {
                    //Array, Middle Tier expects a comma separated string
                    pt[atrb] = this.autofillData["DEFAULT"][atrb].value.join();
                    this.currPricingTable[atrb] = this.autofillData["DEFAULT"][atrb].value.join();
                } else {
                    //String
                    pt[atrb] = this.autofillData["DEFAULT"][atrb].value;
                    this.currPricingTable[atrb] = this.autofillData["DEFAULT"][atrb].value;
                }
            }
        }

        this.autoSvc.updatePricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, pt).subscribe((response: any) => {
            var res = response;
            this.isLoading = false;
            this.setBusy("", "", "", false);
            this.dialogRef.close(this.autofillData);
            let dealType: any;
            if (this.autofillData.ISTENDER) {
                dealType = "Tender"
            }
            else {
                dealType = "Pricing"
            }
            this.loggerSvc.success("Edited " + dealType + " Table", "Save Successful",);
        }, (err) => {
            this.loggerSvc.error("Unable to update Pricing Table", "Error", err);
        })
        this.isLoading = false;
        this.setBusy("", "", "", false);
    }

    addPricingTable() {

        let pt = this.UItemplate["ObjectTemplates"].PRC_TBL[this.newPricingTable.OBJ_SET_TYPE_CD];
        if (!pt) {
            this.loggerSvc.error("Could not create the Pricing Table.", "Error");
            this.isLoading = false;
            this.setBusy("", "", "", false);
            return;
        }
        pt.DC_ID = -100;
        pt.DC_PARENT_ID = this.CurrPricingStrategy.DC_ID;
        pt.OBJ_SET_TYPE_CD = this.newPricingTable.OBJ_SET_TYPE_CD;
        pt.TITLE = this.newPricingTable.TITLE;
        pt.IS_HYBRID_PRC_STRAT = pt.IS_HYBRID_PRC_STRAT !== undefined ? this.CurrPricingStrategy.IS_HYBRID_PRC_STRAT : "";

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
        this.autoSvc.createPricingTable(this.contractData.CUST_MBR_SID, this.contractData.DC_ID, pt).subscribe((response: any) => {
            pt = response.PRC_TBL[1];
            this.autofillData.newPt = pt;
            this.isLoading = false;
            this.setBusy("", "", "", false);
            this.dialogRef.close(this.autofillData);
            let dealType: any;
            if (this.autofillData.ISTENDER) {
                dealType = "Tender"
            }
            else {
                dealType = "Pricing"
            }
            this.loggerSvc.success("Created " + dealType + " Table", "Save Successful",);
        }, (err) => {
            this.loggerSvc.error("Could Not create Pricing Table", "Error", err);
            this.isLoading = false;
        })
    }


    isUIDisable(elem: string, val: string) {
        var dealType = this.dealType;
        var rowType = dealType == 'FLEX' ? this.autofillData.DEFAULT.FLEX_ROW_TYPE.value : true;
        var rebateType = this.autofillData.DEFAULT.REBATE_TYPE.value;
        if (elem == "NUM_OF_TIERS") {
            var hybCond = this.autofillData.isVistexHybrid;
            if ((hybCond == true || rowType == 'Draining') && elem == 'NUM_OF_TIERS') {
                if (val == '1') {
                    if (this.autofillData.DEFAULT.NUM_OF_TIERS.value != "1") {
                        this.autofillData.DEFAULT.NUM_OF_TIERS.value = "1";
                    }
                    return false;
                }
                else
                    return true;
            }
            else {
                return false;
            }
        }
        else if (elem == "PAYOUT_BASED_ON") {
            var isVistex = this.autofillData.ISVISTEX;
            if (isVistex && val == 'Billings' && dealType == 'KIT') {
                return true;
            }
            else if ((dealType == 'REV_TIER' || dealType == 'DENSITY') && val == 'Consumption') { // Disable Autofill field
                return true;
            }
            else if ((dealType === 'VOL_TIER' || dealType === 'PROGRAM') && (rebateType === 'TENDER' || rebateType === 'TENDER ACCRUAL')) {
                this.autofillData.DEFAULT.PAYOUT_BASED_ON.value = "Consumption";
                // return true;
            }
            else {
                false;
            }
        }
        else if ((elem == 'REBATE_OA_MAX_VOL' || elem == 'REBATE_OA_MAX_AMT') && rowType == 'Draining' && dealType == 'FLEX') {
            // Clear existing values for overarching fields
            this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value = "";
            this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value = "";
            return true;
        }
        else {
            return false;
        }
    }
    hasChildren(node: any): boolean {
        return node.items && node.items.length > 0;
    }
    fetchChildren(node: any): Observable<any[]> {
        // returns the items collection of the parent node as children
        return of(node.items);
    }

    loadTemplateDetails() {
        this.isLoading = true;
        this.setBusy("Loading...", "Loading data, please wait..", "Info", true);
        this.templatesSvc.readTemplates().subscribe((response: Array<any>) => {
            this.UItemplate = response;
        }, (error) => {
            this.isLoading = false;
            this.loggerSvc.error('loadAllContractDetails::readTemplates:: service', error);
        })
    }

    async loadAutoFill() {
        this.isLoading = true;
        this.setBusy("Loading...", "Loading data, please wait..", "Info", true);
        this.currPricingTable = this.autofillData.currPt;
        this.contractData = this.autofillData.contractData;
        this.CurrPricingStrategy = this.autofillData.currPs;
        this.newPricingTable = this.autofillData.newPt;
        this.ptTemplate = this.autofillData.ptTemplate;
        this.dealType = this.newPricingTable.OBJ_SET_TYPE_CD;
        if (this.contractData != null) {
            this.custID = this.contractData.CUST_MBR_SID;
        }
        if (this.autofillData.ISTENDER) {
            this.autofillData.DEFAULT['REBATE_TYPE'].isHidden = true;
            this.autofillData.DEFAULT['AR_SETTLEMENT_LVL'].isHidden = true;
            this.autofillData.DEFAULT['PERIOD_PROFILE'].isHidden = true;
            this.autofillData.DEFAULT.PAYOUT_BASED_ON.opLookupUrl = "/api/Dropdown/GetConsumptionPayoutDropdowns/PAYOUT_BASED_ON";
            this.autofillData.DEFAULT.PROGRAM_PAYMENT.opLookupUrl = "/api/Dropdown/GetProgPaymentDropdowns/PROGRAM_PAYMENT";
        }

        this.dropdownResponses = await this.getAllDropdownValues();

        let geoVals = this.autofillData.DEFAULT ? this.autofillData.DEFAULT['GEO_COMBINED'].value : '';
        this.autofillData.DEALTYPE_DISPLAY = this.dealType.replace("_", "").toUpperCase();
        this.isBlend = (geoVals?.indexOf("[") >= 0);
        if (this.isBlend) {
            this.geoValues = geoVals ? geoVals.replace('[', '').replace(']', '').split(',') : [];
        }
        else {
            this.geoValues = geoVals;
        }
        this.geos = geoVals;
        this.marketSeglist = this.dropdownResponses['MRKT_SEG'];
        this.nonCorpMarketSeg = this.dropdownResponses['MRKT_SEG_NON_CORP'];
        _.each(this.marketSeglist, (key) => {
            if (key.items != undefined && key.items != null && key.items.length > 0) {
                this.parentKeys.push(key.DROP_DOWN);
            }
        });
        let mkgvalue = this.autofillData.DEFAULT['MRKT_SEG'].value;
        if (mkgvalue?.indexOf("[") >= 0) {
            this.mkgvalues = mkgvalue ? mkgvalue.replace('[', '').replace(']', '').split(',') : [];
        }
        else {
            this.mkgvalues = mkgvalue;
        }
        this.multSlctMkgValues = this.mkgvalues;
        this.isLoading = false;
        this.setBusy("", "", "", false);
    }
    onAutoChange(elem: string, val: string) {
        if (elem == "PAYOUT_BASED_ON" && val == "Consumption") {
            this.autofillData.DEFAULT['PROGRAM_PAYMENT'].value = "Backend";
        }
        if (elem == 'PROGRAM_PAYMENT' && val.toUpperCase().indexOf("FRONTEND") > -1) {
            this.autofillData.DEFAULT['PAYOUT_BASED_ON'].value = "Billings";
        }
        this.autofillData.DEFAULT[`${elem}`].value = val;
    }
    OnTierChange(elem: string, val: string) {
        this.autofillData.DEFAULT[`${elem}`].value = val;
    }
    ngOnInit() {
        try {
            this.rebateTypeTitle = this.autofillData.ISTENDER ? "Tender Table" : "Pricing Table";
            this.loadTemplateDetails();
            this.loadAutoFill();
        }
        catch (ex) {
            this.loggerSvc.error('Something went wrong', 'Error');
            console.error('Auo_Fill::ngOnInit::', ex);
        }
    }

}

angular.module("app").directive(
    "autofillSelector",
    downgradeComponent({
        component: AutoFillComponent,
    })
);
