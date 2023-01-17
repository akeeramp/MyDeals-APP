import { Component, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { NgbPopoverConfig } from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from '@angular/material/dialog';
import { logger } from '../../shared/logger/logger';
import { GridUtil } from '../grid.util';
import { PTE_Load_Util } from '../PTEUtils/PTE_Load_util';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
import { ProductBreakoutComponent } from '../ptModals/productSelector/productBreakout/productBreakout.component';
import { TenderDashboardGridUtil } from '../tenderDashboardGrid.util';

@Component({
    selector: 'deal-editor-cell',
    templateUrl: 'Client/src/app/contract/dealEditor/dealEditorCellTemplate.component.html',
    styleUrls: ['Client/src/app/contract/dealEditor/dealEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class dealEditorCellTemplateComponent {

    constructor(private loggerService: logger,
            public dialogService: MatDialog,
            private decimalPipe: DecimalPipe,
            private currencyPipe: CurrencyPipe,
            private datePipe: DatePipe,
            popoverConfig: NgbPopoverConfig) {
        popoverConfig.placement = 'auto';
        popoverConfig.container = 'body';
        popoverConfig.autoClose = 'outside';
        popoverConfig.animation = false;
        popoverConfig.triggers = 'mouseenter:mouseleave';   // Disabled to use default click behaviour to prevent multiple popover windows from appearing
        popoverConfig.openDelay = 500;   // milliseconds
        popoverConfig.closeDelay = 500; // milliseconds
        }

    @Input() in_Field_Name: string = '';
    @Input() in_Template: string = '';
    @Input() in_Deal_Type: string = '';
    @Input() in_DataItem: any = '';
    @Input() contract_Data: any = '';
    @Input() grid_Data: any = '';
    @Input() in_Is_Tender_Dashboard: boolean = false;//will recieve true when DE Grid Used in Tender Dashboard Screen
    @Output() iconUpdate: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh_Contract_Data: EventEmitter<any> = new EventEmitter<any>();
    @Output() reLoad: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeDeletedRow = new EventEmitter<any>();
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private subKitEcapDim = "20_____2";
    private dim = "10___";
    private fields: any;
    private YCS2modifier:string = "";
    private fieldModifier: string = "";
    private fieldText: string = "";

    private openModal(columnTypes: string, currentPricingTableRow, productMemberSId, priceCondition) {
        // Open Modal with data
        this.dialogService.open(ProductBreakoutComponent, {
            data: {
                columnTypes: columnTypes,
                productData: [{
                    'CUST_MBR_SID': currentPricingTableRow.CUST_MBR_SID,
                    'PRD_MBR_SID': productMemberSId,
                    'GEO_MBR_SID': currentPricingTableRow.GEO_COMBINED,
                    'DEAL_STRT_DT': currentPricingTableRow.START_DT,
                    'DEAL_END_DT': currentPricingTableRow.END_DT,
                    'getAvailable': 'N',
                    'priceCondition': priceCondition
                }]
            },
            panelClass: 'product-breakout-modal'
        });
    }
        
    updateIcon(eventData: boolean) {
        this.iconUpdate.emit(eventData);
    }

    reload(eventData) {
        this.reLoad.emit('');
    }
    refreshContractData(eventData: boolean) {
        this.refresh_Contract_Data.emit(eventData);
    }

    uiControlWrapper(passedData, field, format) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "VOLUME" || field == "CONSUMPTION_LOOKBACK_PERIOD" || field == "FRCST_VOL" ||
            field == "CREDIT_VOLUME" || field == "DEBIT_VOLUME" || field == "REBATE_OA_MAX_VOL") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.decimalPipe.transform(data[field], "1.0-0");
        }
        if (field == "REBATE_OA_MAX_AMT" || field == "MAX_RPU" || field == "USER_MAX_RPU" ||
            field == "AVG_RPU" || field == "USER_AVG_RPU" || field == "TOTAL_DOLLAR_AMOUNT" || field == "MAX_PAYOUT"
            || field == "ADJ_ECAP_UNIT" || field == "CREDIT_AMT" || field == "DEBIT_AMT") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.currencyPipe.transform(parseFloat(data[field]), 'USD', 'symbol', '1.2-2');
        }
        if (field == "BLLG_DT" || field == "LAST_TRKR_START_DT_CHK" || field == "ON_ADD_DT"
            || field == "REBATE_BILLING_START" || field == "REBATE_BILLING_END") {
            if (data[field] == "Invalid date") data[field] = "";
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.datePipe.transform(data[field], "MM/dd/yyyy");
        }
        return GridUtil.uiControlWrapper(data, field, format);
    }

    uiControlDealWrapper(passedData, field) {
        return GridUtil.uiControlDealWrapper(passedData, field);
    }

    uiCustomerControlWrapper(passedData, field) {
        return GridUtil.uiCustomerControlWrapper(passedData, field);
    }

    keyArray(data: any) {
        let arr = new Array();
        let keys = Object.keys(data).sort();
        for (let i = 0; i < keys.length; i++) {
            arr.push(keys[i]);
        }
        return arr;
    }

    uiDimControlWrapper(passedData, field) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        let dim = "";
        if (field == "ECAP_PRICE" && data.OBJ_SET_TYPE_CD == "ECAP") {
            if (data.ECAP_PRICE && data.ECAP_PRICE[this.ecapDimKey] !== undefined && data.ECAP_PRICE[this.ecapDimKey] !== null && data.ECAP_PRICE[this.ecapDimKey] !== "")
                data.ECAP_PRICE[this.ecapDimKey] = typeof data.ECAP_PRICE[this.ecapDimKey] == 'number' ? this.currencyPipe.transform(data.ECAP_PRICE[this.ecapDimKey], 'USD', 'symbol', '1.2-2') : data.ECAP_PRICE[this.ecapDimKey];
            dim = this.ecapDimKey;
        }
        if (field == "KIT_ECAP" || field == "CAP_KIT" || field == "YCS2_KIT") {
            field = field == "CAP_KIT" ? "CAP" : field == "YCS2_KIT" ? "YCS2_PRC_IRBT" : "ECAP_PRICE";
            if (data[field] && data[field][this.kitEcapdim] !== undefined && data[field][this.kitEcapdim] !== null && data[field][this.kitEcapdim] !== "")
                data[field][this.kitEcapdim] = typeof data[field][this.kitEcapdim] == 'number' ? this.currencyPipe.transform(data[field][this.kitEcapdim], 'USD', 'symbol', '1.2-2') : data[field][this.kitEcapdim];
            dim = this.kitEcapdim;
        }
        if (field == "SUBKIT_ECAP") {
            if (data.ECAP_PRICE && data.ECAP_PRICE[this.subKitEcapDim] !== undefined && data.ECAP_PRICE[this.subKitEcapDim] !== null && data.ECAP_PRICE[this.subKitEcapDim] !== "")
                data.ECAP_PRICE[this.subKitEcapDim] = typeof data.ECAP_PRICE[this.subKitEcapDim] == 'number' ? this.currencyPipe.transform(data.ECAP_PRICE[this.subKitEcapDim], 'USD', 'symbol', '1.2-2') : data.ECAP_PRICE[this.subKitEcapDim];
            dim = this.subKitEcapDim;
            field = "ECAP_PRICE";
        }
        if (field == "COMPETITIVE_PRICE") {
            if (data[field] && data[field][this.ecapDimKey] !== undefined && data[field][this.ecapDimKey] !== null && data[field][this.ecapDimKey] !== "")
                data[field][this.ecapDimKey] = typeof data[field][this.ecapDimKey] == 'number' ? this.currencyPipe.transform(data[field][this.ecapDimKey], 'USD', 'symbol', '1.2-2') : data[field][this.ecapDimKey];
            dim = this.ecapDimKey;
        }
        return GridUtil.uiDimControlWrapper(data, field, dim);
    }

    getMissingCostCapIcon(passedData) {
        return GridUtil.getMissingCostCapIcon(passedData);
    }

    uiPositiveDimControlWrapper(passedData, field) {
        try {
            let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
            let value = data[field];
            if(value){
                const sortedKeys = Object.keys(value).sort();
                for (const index in sortedKeys) {
                    const dimKey = sortedKeys[index];
                    if (data[field][dimKey] !== undefined && data[field][dimKey] !== null && data[field][dimKey] !== "") {
                        if (field == "ECAP_PRICE" || field == "DSCNT_PER_LN" || (field == "CAP" && data[field][dimKey] != "No CAP") || (field == "YCS2_PRC_IRBT" && data[field][dimKey] != "No YCS2")) {
                            data[field][dimKey] = this.currencyPipe.transform(data[field][dimKey], 'USD', 'symbol', '1.2-2');
                        }
                    }
                    if (field == "QTY") {
                        data[field][dimKey] = this.decimalPipe.transform(data[field][dimKey], "1.0-0");
                    }
                    if (field == "CAP_STRT_DT" || field == "CAP_END_DT" || field == "YCS2_START_DT" || field == "YCS2_END_DT" && data[field][dimKey] != undefined && data[field][dimKey] != null && data[field][dimKey] != "") {
                        if (data[field][dimKey] == "Invalid date") data[field][dimKey] = "";
                        if (data[field][dimKey] != undefined && data[field][dimKey] != null && data[field][dimKey] != "")
                        data[field][dimKey] = this.datePipe.transform(data[field][dimKey], "MM/dd/yyyy");
                    }
                }
                return GridUtil.uiPositiveDimControlWrapper(data, field);
            }
            else{
                return '';
            }
        }
        catch(ex){
            console.error('uiPositiveDimControlWrapper::execption',ex);
        }
     
    }

    uiValidationErrorDetail(passedData) {
        return GridUtil.uiValidationErrorDetail(passedData);
    }

    uiControlScheduleWrapper(passedData) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        let numTiers = 0;
        let tiers = data.TIER_NBR;
        for (const key in tiers) {
            if (Object.hasOwnProperty.call(tiers, key) && key.indexOf("___") >= 0) {
                numTiers++;
                const dim = "10___" + numTiers;
                for (let f = 0; f < this.fields.length; f++) {
                    if (data[this.fields[f].field] && data[this.fields[f].field][key] && !Number.isNaN(Number(data[this.fields[f].field][key]))) {
                        if (this.fields[f].format == "number" && this.fields[f].field == "INCENTIVE_RATE")
                            data[this.fields[f].field][dim] = this.decimalPipe.transform(data[this.fields[f].field][dim], "1.0-2");
                        else if (this.fields[f].format == "number")
                            data[this.fields[f].field][dim] = this.decimalPipe.transform(data[this.fields[f].field][dim], "1.0-0");
                        else
                            data[this.fields[f].field][dim] = this.currencyPipe.transform(data[this.fields[f].field][dim], 'USD', 'symbol', '1.2-2');
                    }
                }
            }
        }
        return GridUtil.uiControlScheduleWrapper(data);
    }
    uiControlScheduleWrapperDensity(passedData) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        let numTiers = 0;
        let tiers = data.TIER_NBR;
        for (const key in tiers) {
            if (Object.hasOwnProperty.call(tiers, key) && key.indexOf("___") >= 0) {
                numTiers++;
                for (let f = 0; f < this.fields.length; f++) {
                    let dim = (this.fields[f].field == "DENSITY_BAND" || this.fields[f].field == "DENSITY_RATE") ? "8___" : "10___" + numTiers;
                    if (this.fields[f].field == "DENSITY_RATE") {
                        for (let bands = 1; bands <= passedData.NUM_OF_DENSITY; bands++) {
                            data[this.fields[f].field][dim + bands + '____' + key] = this.currencyPipe.transform(data[this.fields[f].field][dim + bands + '____' + key], 'USD', 'symbol', '1.2-2');
                        }
                    }
                    else if (this.fields[f].field == "STRT_PB" || this.fields[f].field == "END_PB") {
                        if (!Number.isNaN(Number(data[this.fields[f].field][key]))) {
                            if (this.fields[f].format == "number")
                                data[this.fields[f].field][key] = this.decimalPipe.transform(data[this.fields[f].field][key], "1.0-3");
                        }
                    }
                }
            }
        }
        return GridUtil.uiControlScheduleWrapperDensity(data);
    }

    uiReadonlyControlWrapper(passedData, field) {
        return GridUtil.uiReadonlyControlWrapper(passedData, field);
    }
    uiDimTrkrControlWrapper(passedData) {
        return GridUtil.uiDimTrkrControlWrapper(passedData);
    }
    uiStartDateWrapper(passedData, field) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "START_DT" || field == "LAST_REDEAL_DT") {
            if (data[field] == "Invalid date") data[field] = "";
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.datePipe.transform(data[field], "MM/dd/yyyy");
        }
        return GridUtil.uiStartDateWrapper(data, field);
    }
    uiControlEndDateWrapper(passedData, field) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "END_DT" || field == "OEM_PLTFRM_LNCH_DT" || field == "OEM_PLTFRM_EOL_DT") {
            if (data[field] == "Invalid date") data[field] = "";
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.datePipe.transform(data[field], "MM/dd/yyyy");
        }
        return GridUtil.uiControlEndDateWrapper(data, field);
    }
    uiBoolControlWrapper(passedData, field) {
        return GridUtil.uiBoolControlWrapper(passedData, field);
    }
    uiProductDimControlWrapper(passedData, type) {
        return GridUtil.uiProductDimControlWrapper(passedData, type);
    }
    uiProductControlWrapper(passedData) {
        return GridUtil.uiProductControlWrapper(passedData);
    }
    uiParentControlWrapper(passedData) {
        return GridUtil.uiParentControlWrapper(passedData);
    }
    uiMultiselectArrayControlWrapper(passedData, field) {
        return GridUtil.uiMultiselectArrayControlWrapper(passedData, field);
    }
    uiPrimarySecondaryDimControlWrapper(passedData) {
        return GridUtil.uiPrimarySecondaryDimControlWrapper(passedData);
    }
    uiKitCalculatedValuesControlWrapper(passedData, kitType, column) {
        let value = this.currencyPipe.transform(PTE_Load_Util.kitCalculatedValues(passedData, kitType, column), 'USD', 'symbol', '1.2-2');
        return GridUtil.uiKitCalculatedValuesControlWrapper(passedData, kitType, value);
    }
    uiControlBackEndRebateWrapper(passedData) {
        let dim = this.in_Deal_Type == "KIT" ? this.kitEcapdim : this.ecapDimKey;
        let value = this.currencyPipe.transform(PTE_Load_Util.calcBackEndRebate(passedData, this.in_Deal_Type, "ECAP_PRICE", dim), 'USD', 'symbol', '1.2-2');
        return GridUtil.uiControlBackEndRebateWrapper(value);
    }
    uiTotalDiscountPerLineControlWrapper(passedData) {
        return GridUtil.uiTotalDiscountPerLineControlWrapper(passedData);
    }
    getResultSingleIcon(passedData, field) {
        let parent = document.getElementById(field + "_" + passedData.DC_ID);
        parent.innerHTML = GridUtil.getResultSingleIcon(passedData, field);
        let child = parent.getElementsByTagName('i');
        if (child != undefined && child.length == 1)
            child[0].style.color = this.getColorStyle(passedData[field]);
        return;
    }
    getColorStyle = function (result) {
        return PTE_Load_Util.getColorPct(result);
    }
    uiCrDbPercWrapper(passedData) {
        return GridUtil.uiCrDbPercWrapper(passedData);
    }
    getFormatedDim(passedData) {
        return GridUtil.getFormatedDim(passedData, 'TempCOMP_SKU', '20___0');
    }
    isReadonlyCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field] != undefined)
            return true;
        return false;
    }
    isDirtyCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isDirty != undefined && passedData._behaviors.isDirty[field] != undefined)
            return true;
        return false;
    }
    isErrorCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError[field] != undefined)
            return true;
        else if (field == "KIT_ECAP" || field == "SUBKIT_ECAP") {
            if (passedData._behaviors != undefined && passedData._behaviors.isError != undefined && passedData._behaviors.isError["ECAP_PRICE"] != undefined)
                return true;
        }
        return false;
    }
    isHiddenCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isHidden != undefined && passedData._behaviors.isHidden[field] != undefined)
            return true;
        return false;
    }
    isRequiredCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isRequired != undefined && passedData._behaviors.isRequired[field] != undefined)
            return true;
        return false;
    }
    isSavedCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isSaved != undefined && passedData._behaviors.isSaved[field] != undefined)
            return true;
        return false;
    }
    uiMoneyDatesControlWrapper(passedData, field, startDt, endDt, dimKey) {        
        return GridUtil.uiMoneyDatesControlWrapper(passedData, field, startDt, endDt, dimKey)
    }
    getProductSid(dimProduct, dimKey) {
        return GridUtil.getProductMbrSid(dimProduct, dimKey);
    }
    getBidActions(data) {
        return TenderDashboardGridUtil.getBidActions(data);
    }
    removeDeletedRowData(event) {
        this.removeDeletedRow.emit(event);
    }
    uiReadonlyFolioWrapper(data, field) {
        return TenderDashboardGridUtil.uiReadonlyFolioWrapper(data, field)
    }
    ngOnChanges() {
        try {
            if (!this.in_Is_Tender_Dashboard)//if not Tender Dashboard Screen, take salesforce Id from contract data
                this.in_DataItem.SALESFORCE_ID = this.contract_Data.SALESFORCE_ID;
            this.fields = (this.in_Deal_Type === 'VOL_TIER' || this.in_Deal_Type === 'FLEX') ? PTE_Config_Util.volTierFields : this.in_Deal_Type === 'REV_TIER' ? PTE_Config_Util.revTierFields : PTE_Config_Util.densityFields;
            if (this.in_Field_Name === "CAP_INFO") {
                this.fieldModifier = "CAP";
                this.fieldText = this.fieldModifier + "_STRT_DT";
            }
            else if (this.in_Field_Name === "YCS2_INFO") {
                this.fieldModifier = "YCS2";
                this.YCS2modifier = "_PRC_IRBT";
                this.fieldText = this.fieldModifier + "_START_DT";
            }
        } catch(ex) {
            console.error(ex);
        }
    }

}