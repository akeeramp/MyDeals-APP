import { Component, Input, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { PTE_Save_Util } from '../PTEUtils/PTE_Save_util';
import { each } from 'underscore';
import { TooltipDirective } from "@progress/kendo-angular-tooltip";
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { TenderDashboardGridUtil } from '../tenderDashboardGrid.util';
import { GridUtil } from '../grid.util'
import { PTE_Validation_Util } from '../PTEUtils/PTE_Validation_util';
import { utils } from '../../shared/util/util';

@Component({
    selector: 'deal-editor-edit',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorEditTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorEditTemplateComponent {

    constructor() {
        const today = new Date();
        this.minDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());        
    }
    @Input() in_Field_Name: string = '';
    @Input() in_Deal_Type: string = '';
    @Input() in_DataItem: any = '';
    @Input() in_DropDownResponses: any;
    @Input() in_DataSet: any;
    @Input() in_Is_Tender_Dashboard: boolean = false;//will recieve true when DE Grid Used in Tender Dashboard Screen
    @Output() invalidField = new EventEmitter<any>();
    @Output() bidActionsUpdated = new EventEmitter<any>();
    @ViewChild("dealDateToolTip", { static: false }) dealDateToolTip: NgbTooltip;
    @ViewChild("excludeAutoToolTip", { static: false }) excludeAutoToolTip: NgbTooltip;
    @ViewChild(TooltipDirective)
    public toolTipDir: TooltipDirective;
    private message = "";
    private dropDowResponse: any = {};
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private dim = "10___";
    private fields: any;
    private autoCorrect: boolean = true;
    private decimals: number = 2;
    private bidActnsDropdownData: any = [];
    private bidActnsDropDownText: string ="text";
    private bidActnsDropDownValue: string = "value";
    private selectedValue: any;
    public confirmDialog: boolean = false;
    // Calculate the minimum date as 20 years before today's date
    public minDate: Date = new Date(new Date().getFullYear() - 20, new Date().getMonth(), new Date().getDate());
    private minDateErrMessage = "The selected date cannot be beyond 20 years";

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
    closeDialogs(dataItem: any, field: any) {
        if (field == 'EXPIRE_YCS2') {
            this.confirmDialog = false;
        }
    }
    confirmExpire(dataItem: any, field: any) {
        if (field == 'EXPIRE_YCS2') {
            
            if ((dataItem.isLinked != undefined && dataItem.isLinked) || (dataItem._parentCnt > 1 && !dataItem.isLinked)) {
                each(this.in_DataSet, (item) => {
                    if ((item.isLinked != undefined && item.isLinked && dataItem.isLinked) || (dataItem._parentCnt > 1 && dataItem.DC_PARENT_ID == item.DC_PARENT_ID && !dataItem.isLinked)) {
                        PTE_Save_Util.setDataItem(item, field, 'Yes');
                    }
                })
            } else {
                PTE_Save_Util.setDataItem(dataItem, field, 'Yes');
            }
            this.confirmDialog = false;
        }
    }
    valueChange(dataItem: any, field: any, key?: any): void {        
        if (((field == 'ECAP_PRICE' || field == 'DSCNT_PER_LN') && this.in_Deal_Type == 'KIT') && key != undefined && key != null && key != "" && dataItem[field][key] == null) {
            dataItem[field][key] = 0;
        }
        if (field == 'KIT_ECAP' && this.in_Deal_Type == 'KIT' && key == undefined) {
            field = "ECAP_PRICE";
            key = '20_____1';
        }
        if (field == 'EXPIRE_YCS2' && dataItem.EXPIRE_YCS2 == 'Yes') {
            dataItem.EXPIRE_YCS2 = '';
            this.confirmDialog = true;
        }
        if ((dataItem.isLinked != undefined && dataItem.isLinked) || (dataItem._parentCnt > 1 && !dataItem.isLinked)) {// if modified dataItem is linked, then modifying corresponding columns of all other linked data
            each(this.in_DataSet, (item) => {
                if ((item.isLinked != undefined && item.isLinked && dataItem.isLinked) || (dataItem._parentCnt > 1 && dataItem.DC_PARENT_ID == item.DC_PARENT_ID && !dataItem.isLinked)) {
                    let value;
                    if (key != undefined && key != null && key != "" && item[field][key] != undefined && item[field][key] != null) {
                        if (((field == 'ECAP_PRICE' || field == 'DSCNT_PER_LN') && this.in_Deal_Type == 'KIT')) { // if modified value is KIT deal ECAP_PRICE and DSCNT_PER_LN then all dim keys values needs to be copied
                            var keys = Object.keys(item[field])
                            for (var index in keys) {
                                if (dataItem[field][keys[index]] != undefined && dataItem[field][keys[index]] != null) {
                                    value = dataItem[field][keys[index]];
                                }
                                else // if modified record having less no.of.products than other records, then clearing out values for those products
                                    value = 0;
                                PTE_Save_Util.setDataItem(item, field, value, keys[index]);
                            }
                        }
                        else {// copy only modified key column to all other selected records
                            value = dataItem[field][key];
                            PTE_Save_Util.setDataItem(item, field, value, key)
                        }
                    }
                    else {// copy only modified column to all other selected records
                        value = dataItem[field];
                        PTE_Save_Util.setDataItem(item, field, value);
                    }
                }
            })
        }
        else
            this.updateDataItem(dataItem, field);
    }    
    onKeyDown(event, dealDate) {
        if (event.keyCode == 13) {
            this.onBlur(dealDate);
        }
    }
    onBlur(dealDate) {
        //check if invalid date format
        if (dealDate.status === "INVALID") {
            this.message = this.in_Field_Name + " is not a valid date.";
            this.dealDateToolTip.ngbTooltip = this.message;
            this.invalidField.emit(true);
            this.dealDateToolTip.open();
        }
        // Check if the date is before the minimum date, show tooltip error
        else if (dealDate.value && new Date(dealDate.value) < this.minDate) {
            this.message = this.minDateErrMessage;
            this.dealDateToolTip.ngbTooltip = this.message;
            this.invalidField.emit(true);
            this.dealDateToolTip.open();
        } else {
            // If the date is valid and not before the minimum date
            this.invalidField.emit(false);
            this.dealDateToolTip.close();
        }
    }
    showToolTip(dataItem, field, eventTarget: Element) {
        if (field == 'CONTRACT_TYPE') {
            if (dataItem.CONTRACT_TYPE == undefined || dataItem.CONTRACT_TYPE == null || dataItem.CONTRACT_TYPE == '') {
                this.toolTipDir.toggle(eventTarget);
            }
        }
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

    saveLinkedDataItem(dataItem: any, field: string, value: any, key: string) { // to modify the linked/selected records if Tier column is modified 
        if ((dataItem.isLinked != undefined && dataItem.isLinked) || (dataItem._parentCnt > 1 && !dataItem.isLinked)) {
            each(this.in_DataSet, (item) => {
                if ((item.isLinked != undefined && item.isLinked && dataItem.isLinked) || (dataItem._parentCnt > 1 && dataItem.DC_PARENT_ID == item.DC_PARENT_ID && !dataItem.isLinked))  {
                    if (field == 'RATE' || field == 'INCENTIVE_RATE' || field == "DENSITY_RATE") {// if modified column is rate, then all dim key values needs to be copied to all other selected records
                        let keys = Object.keys(item[field])
                        for (var index in keys) {
                            if (dataItem[field][keys[index]] != undefined && dataItem[field][keys[index]] != null)
                                value = dataItem[field][keys[index]];
                            else// if modified record having less no.of.Tiers than other records, then clearing out values for those tiers
                                value = 0;
                            PTE_Save_Util.setDataItem(item, field, value, keys[index])
                        }
                    }
                    else {// copy only modified column to all other selected records
                        if (item[field][key] != undefined && item[field][key] != null) {
                            value = dataItem[field][key];
                            PTE_Save_Util.setDataItem(item, field, value, key)
                        }
                    }
                }
            })
        }
    }
    updateTierAttributes(dataItem: any, field: string, row: number) {
        let dimKey = "10___" + (row);
        if (field === "END_VOL" || field === "END_REV") {
            if (field === "END_REV" && (dataItem[field]["10___" + row] == 9999999999.99 || dataItem[field][dimKey] == "9999999999.99")) {
                dataItem[field][dimKey] = 9999999999.99;
            } else if (field != "END_REV" && (dataItem[field][dimKey] === null || dataItem[field][dimKey] == 999999999 || dataItem[field][dimKey] == "999999999")) {
                dataItem[field][dimKey] = "Unlimited";
            }
            this.saveLinkedDataItem(dataItem, field, dataItem[field][dimKey], dimKey)
        } else if ((field === "STRT_VOL" || field === "STRT_REV" || field === "RATE" || field === "INCENTIVE_RATE") && dataItem[field][dimKey] === null) {
            dataItem[field][dimKey] = 0;
            this.saveLinkedDataItem(dataItem, field, 0, dimKey)
        } else
            if (field === "DENSITY_RATE") {
                for (let key in dataItem[field]) {
                    if (key.indexOf("___") >= 0 && dataItem[field][key] == null) {
                        dataItem[field][key] = 0;
                        this.saveLinkedDataItem(dataItem, field, 0, key)
                    }
                }
            }
        this.updateDataItem(dataItem, field);
        //if there is a next row/tier
        let keys = ["STRT_VOL", "STRT_REV"];
        dimKey = "10___" + (row + 1);
        each(keys, (key) => {
            if (dataItem[key] && (dataItem[key][dimKey]==0 || !!dataItem[key][dimKey])) {
                if (field === "END_VOL" || field === "END_REV") {
                    if (dataItem[field]["10___" + row].toString().toLowerCase() === "unlimited" || dataItem[field]["10___" + row] === "9999999999.99") {
                        dataItem[key][dimKey] = 0;
                    } else if (field === "END_VOL") {
                        //if end vol is a number, then set next start vol to that number + 1
                        dataItem[key][dimKey] = parseInt(dataItem[field]["10___" + row]) + 1;
                    } else {// field === "END_REV"
                        //if end rev is a number, then set next start rev to that number + .01 (a penny)
                        dataItem[key][dimKey] = (dataItem[field]["10___" + row] + .01).toFixed(2);
                    }
                }
                this.saveLinkedDataItem(dataItem, key, dataItem[key][dimKey], dimKey);
                this.updateDataItem(dataItem, key);
            }
        });
    }
    hasVertical(data) {
        TenderDashboardGridUtil.hasVertical(data);
    }
    stgFullTitleChar(passedData) {
        GridUtil.stgFullTitleChar(passedData);
    }
    convertToLowerCase(value) {
        if (typeof value !== 'number' && value != null)
            return value.toLowerCase();
        return value;
    }
    //Min conditions for Numeric TextBox added here
    getMinValue(field: string) {
        if (field.includes('RATE'))
            return '0.00';
        else if (field.includes('_REV'))
            return '0.01';
        else
            return '1';
    }
    getBidActions(data) {
        return TenderDashboardGridUtil.getBidActions(data);
    }
    actionChange(dataItem) { 
        this.bidActionsUpdated.emit({
            newValue: this.selectedValue[this.bidActnsDropDownValue],
            dataItem: dataItem
        });
    }
    onExcludeBlur(value) {
        if (value == undefined || value == null || value == "") {
            this.invalidField.emit(true);
            this.excludeAutoToolTip.open();
        }
        else {
            this.invalidField.emit(false);
            this.excludeAutoToolTip.close();
        }
    }
    ngOnInit() {
        this.fields = (this.in_Deal_Type === 'VOL_TIER' || this.in_Deal_Type === 'FLEX') ? PTE_Config_Util.volTierFields : this.in_Deal_Type === 'REV_TIER' ? PTE_Config_Util.revTierFields : PTE_Config_Util.densityFields;
        var keys = Object.keys(this.in_DropDownResponses);
         each(keys, key => {
            if (key == "EXPIRE_FLG")
                this.dropDowResponse[`${key}`] = this.in_DropDownResponses[key];
            else if (key != "QLTR_BID_GEO")
                this.dropDowResponse[`${key}`] = this.in_DropDownResponses[key].map(a => a.DROP_DOWN);
            else
                this.dropDowResponse[`${key}`] = this.in_DropDownResponses[key].map(a => a.dropdownName);
        });
        if (this.in_Field_Name == "tender_actions") {//dropdown values added for the field tender_actions(tender Dashboard)
            let approveActions = [];
            approveActions.push({ text: "Action", value: "Action" })  //placeholder dummy for a user non-selection
            for (var actn in this.in_DataItem["_actionsPS"]) {
                if (this.in_DataItem["_actionsPS"].hasOwnProperty(actn)) {
                    if (this.in_DataItem["_actionsPS"][actn] == true && actn != "Cancel" && actn != "Hold") {   //the manage screen does not display checkboxes for Cancel or Hold so we will avoid that here as well
                        approveActions.push({ text: actn, value: actn })
                    }
                }
            }
            if (approveActions.length > 1) {
                this.bidActnsDropdownData = approveActions;
                this.bidActnsDropDownText = "text";
                this.bidActnsDropDownValue = "value";
                this.selectedValue = { text: "Action", value: "Action" };
            }
            else if (this.in_DataItem["BID_ACTNS"].length > 1) {
                var ind = this.in_DataItem["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(this.in_DataItem["WF_STG_CD"]);
                let bidActions = PTE_Common_Util.deepClone(this.in_DataItem["BID_ACTNS"]);  //we create a copy because we do not want what the dropdown to fully databind and potentially allow the user selection to have an effect on their possible bid actions
                if (ind == -1) ind = 0;
                this.bidActnsDropdownData = bidActions;
                this.bidActnsDropDownText = "BidActnName";
                this.bidActnsDropDownValue = "BidActnValue";
                this.selectedValue = { BidActnName: this.in_DataItem["BID_ACTNS"][ind].BidActnName, BidActnValue: this.in_DataItem["BID_ACTNS"][ind].BidActnValue };
            }
        }
    }
}