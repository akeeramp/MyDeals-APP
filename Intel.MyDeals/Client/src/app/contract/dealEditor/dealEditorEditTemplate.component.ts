import * as angular from 'angular';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';

@Component({
    selector: 'deal-editor-edit',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorEditTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorEditTemplateComponent {

    constructor() {        
    }
    @Input() in_Field_Name: string = '';
    @Input() in_Deal_Type: string = '';
    @Input() in_DataItem: any = '';
    @Input() in_DropDownResponses: any;
    private dropDowResponse: any = {};
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
    private fields: any;
    translateDimKey(key) {
        switch (key) {
            case "20_____1":
                return "Kit";
            case "20_____2":
                return "Sub-Kit";
            case "20___0":
                return "Primary";
            case "20___1":
                return "Secondary 1";
            case "20___2":
                return "Secondary 2";
            case "20___3":
                return "Secondary 3";
            case "20___4":
                return "Secondary 4";
            case "20___5":
                return "Secondary 5";
            case "20___6":
                return "Secondary 6";
            case "20___7":
                return "Secondary 7";
            case "20___8":
                return "Secondary 8";
            case "20___9":
                return "Secondary 9";
            default:
                return "";
        }
    }

    valueChange(dataItem: any, field: any): void {
        this.updateDataItem(dataItem, field);
    }

    updateDataItem(dataItem: any, field: string) {
        if (dataItem != undefined && dataItem._behaviors != undefined) {
            if (dataItem._behaviors.isDirty == undefined)
                dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[field] = true;
            dataItem["_dirty"] = true;
        }
    }

    tierArray(keys: any) {
        var valueIsNumber = Number.isNaN(Number(keys));
        var arr = new Array();
        if (!valueIsNumber) {
            keys = parseInt(keys);
            for (var i = 1; i <= keys; i++) {
                arr.push(i);
            }
        }
        else {
            for (var key in keys) {
                arr.push(key);
            }
        }
        return arr;
    }

    updateTierAttributes(dataItem: any, field: string, row: number) {
        if (field === "END_VOL" || field === "END_REV" || field === "END_PB") {
            if (field === "END_REV" && (dataItem[field]["10___" + row] === null || dataItem[field]["10___" + row] == 9999999999.99 || dataItem[field]["10___" + row] == "9999999999.99")) {
                dataItem[field]["10___" + row] = "9999999999.99";
            }
            else if ((dataItem[field]["10___" + row] === null || dataItem[field]["10___" + row] == 999999999 || dataItem[field]["10___" + row] == "999999999")) {
                dataItem[field]["10___" + row] = "Unlimited";
            }
        }
        if ((field === "STRT_VOL" || field === "STRT_REV" || field === "RATE" || field === "INCENTIVE_RATE" || field === "STRT_PB") && dataItem[field]["10___" + row] === null) {
            dataItem[field]["10___" + row] = "0";
        }
        if (field === "DENSITY_RATE") {
            for (var key in dataItem[field]) {
                if (key.indexOf("___") >= 0 && dataItem[field][key] == null) {
                    dataItem[field][key] = "0";
                }
            }
        }
        this.updateDataItem(dataItem, field);
        if (field === "END_VOL") {
            //if there is a next row/tier
            if (!!dataItem["STRT_VOL"]["10___" + (row + 1)]) {
                if (dataItem[field]["10___" + row] === "Unlimited") {
                    dataItem["STRT_VOL"]["10___" + (row + 1)] = "0";
                } else {
                    //if end vol is a number, then set next start vol to that number + 1
                    dataItem["STRT_VOL"]["10___" + (row + 1)] = parseInt(dataItem[field]["10___" + row]) + 1;
                }
                this.updateDataItem(dataItem, 'STRT_VOL');
            }
        }

        // REV ITEMS
        if (field === "END_REV") {
            //if there is a next row/tier
            if (!!dataItem["STRT_REV"]["10___" + (row + 1)]) {
                if (dataItem[field]["10___" + row] === "9999999999.99") { // Was "Unlimited"
                    dataItem["STRT_REV"]["10___" + (row + 1)] = "0";
                } else {
                    //if end vol is a number, then set next start vol to that number + .01 (a penny)
                    dataItem["STRT_REV"]["10___" + (row + 1)] = (dataItem[field]["10___" + row] + .01).toFixed(2);
                }
                this.updateDataItem(dataItem, 'STRT_REV');
            }
        }

        //DENSITY ITEMS
        if (field === "END_PB") {
            //if there is a next row/tier
            if (!!dataItem["STRT_PB"]["10___" + (row + 1)]) {
                if (dataItem[field]["10___" + row] === "Unlimited") {
                    dataItem["STRT_PB"]["10___" + (row + 1)] = "0";
                } else {
                    //if end pb is a number, then set next start pb to that number + 0.001
                    dataItem["STRT_PB"]["10___" + (row + 1)] = (dataItem[field]["10___" + row] + .001).toFixed(3);;
                }
                this.updateDataItem(dataItem, 'STRT_PB');
            }
        }
    }
    ngOnInit() {
        this.fields = (this.in_Deal_Type === 'VOL_TIER' || this.in_Deal_Type === 'FLEX') ? PTE_Config_Util.volTierFields : this.in_Deal_Type === 'REV_TIER' ? PTE_Config_Util.revTierFields : PTE_Config_Util.densityFields;
        var keys = Object.keys(this.in_DropDownResponses.__zone_symbol__value);
        for (var key = 0; key < keys.length; key++) {
            if (keys[key] != "QLTR_BID_GEO")
                this.dropDowResponse[`${keys[key]}`] = this.in_DropDownResponses.__zone_symbol__value[keys[key]].map(a => a.DROP_DOWN);
            else
                this.dropDowResponse[`${keys[key]}`] = this.in_DropDownResponses.__zone_symbol__value[keys[key]].map(a => a.dropdownName);
        }
    }
}

angular.module("app").directive(
    "dealEditorEdit",
    downgradeComponent({
        component: dealEditorEditTemplateComponent,
    })
);