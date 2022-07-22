import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "underscore";
import { forkJoin } from 'rxjs';
import { autoFillService } from "../autofillsettings/autofillsetting.service";
import { logger } from '../../../shared/logger/logger';

@Component({
    selector: "autofill-selector",
    templateUrl: "Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.html",
    styleUrls: ["Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.css"]
})

export class AutoFillComponent {
    @ViewChild('multiselect', { static: true }) public multiselect: any;
    private dropdownResponses: any = null;
    private isLoading: boolean = false;
    private spinnerMessageHeader: string = "AutoFillSetting Loading";
    private rebateTypeTitle: string = "";
    private spinnerMessageDescription: string = "AutoFillSetting loading please wait";
    private geoValues: Array<string> = [];
    private geos: Array<string> = [];
    private isBlend: boolean = false;
    private marketSeglist: Array<string> = [];
    private mkgvalues: Array<string> = [];
    private opValidMsg: string = "";
    private isMultipleGeosSelected: boolean = false;
    private CurrPricingStrategy: any = {};
    private currPricingTable: any = {};
    private contractData: any = {};
    private newPricingTable: any = {};
    private dealType: string = "";
    private custID;
    private ptTemplate;


    constructor(
        private autoSvc: autoFillService,
        private loggerSvc: logger,
        public dialogRef: MatDialogRef<AutoFillComponent>,
        @Inject(MAT_DIALOG_DATA) public autofillData: any
    ) { }


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

    onMktgValueChange(event: any) {
        if (event && event.length > 0) {
            if (_.indexOf(event, 'All Direct Market Segments') >= 0) {
                this.mkgvalues = ['All Direct Market Segments'];
            }
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
        } else if (this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === "0" || this.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value === 0) {
            this.opValidMsg = "Overarching Maximum Dollars must be blank or > 0";
        } else if (this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === "0" ||
            this.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value === 0) {
            this.opValidMsg = "Overarching Maximum Volume must be blank or > 0";
        } else {
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
            this.dialogRef.close(this.autofillData);
        })
    }

    addPricingTable() {
        let pt = this.ptTemplate;
        if (!pt) {
            this.loggerSvc.error("Could not create the Pricing Table.", "Error");
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
            this.dialogRef.close(this.autofillData);            
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

    async loadAutoFill() {
        this.isLoading = true;
        this.currPricingTable = this.autofillData.currPt;
        this.contractData = this.autofillData.contractData;
        this.CurrPricingStrategy = this.autofillData.currPs;
        this.newPricingTable = this.autofillData.newPt;
        this.ptTemplate = this.autofillData.ptTemplate;
        this.dealType = this.newPricingTable.OBJ_SET_TYPE_CD;
        if (this.contractData != null) {
            this.custID = this.contractData.CUST_MBR_SID;
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
        this.isBlend = false;
        this.marketSeglist = this.dropdownResponses['MRKT_SEG'].map(a => a.DROP_DOWN);
        let mkgvalue = this.autofillData.DEFAULT['MRKT_SEG'].value;
        this.multiselect.toggle(true);        
        if (mkgvalue?.indexOf("[") >= 0) {
            this.mkgvalues = mkgvalue ? mkgvalue.replace('[', '').replace(']', '').split(',') : [];
        }
        else {
            this.mkgvalues = mkgvalue;
        }        
        this.isLoading = false;
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
        this.rebateTypeTitle = this.autofillData.ISTENDER ? "Tender Table" : "Pricing Table";
        this.loadAutoFill();
    }

}

angular.module("app").directive(
    "autofillSelector",
    downgradeComponent({
        component: AutoFillComponent,
    })
);
