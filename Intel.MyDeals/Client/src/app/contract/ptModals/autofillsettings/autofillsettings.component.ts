
import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
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
    private dropdownResponses: any = null;
    private isLoading: boolean = false;
    private spinnerMessageHeader: string = "AutoFillSetting Loading";
    private rebateTypeTitle: string = "";
    private spinnerMessageDescription: string = "AutoFillSetting loading please wait";
    private geoValues: Array<string> = [];
    private isBlend: boolean = false;
    private marketSeglist: Array<string> = [];
    private mkgvalues: Array<string> = [];
    private opValidMsg: string = "";

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
                    let custId = this.autofillData.CUSTSID ? parseInt(this.autofillData.CUSTSID) : 0;
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
            this.dialogRef.close(this.autofillData);
        }
    }
    async loadAutoFill() {
        this.isLoading = true;
        this.dropdownResponses = await this.getAllDropdownValues();
        let geoVals = this.autofillData.DEFAULT ? this.autofillData.DEFAULT['GEO_COMBINED'].value : '';
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
        this.isBlend = (mkgvalue?.indexOf("[") >= 0);
        if (this.isBlend) {
            this.mkgvalues = mkgvalue ? mkgvalue.replace('[', '').replace(']', '').split(',') : [];
        }
        else {
            this.mkgvalues = mkgvalue;
        }
        this.isLoading = false;
    }
    onAutoChange(elem: string, val: string) {
        this.autofillData.DEFAULT[`${elem}`].value = val;
    }
    OnGeoChange(elem: string, val: Array<string>) {
        this.geoValues = val;
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
