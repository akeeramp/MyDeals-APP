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
import { each } from 'underscore';

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
    @Input() isInActCustSearch: boolean = false;
    @Input() in_Is_Tender_Dashboard: boolean = false;//will recieve true when DE Grid Used in Tender Dashboard Screen
    @Input() in_DataSet: any = '';
    @Output() iconUpdate: EventEmitter<any> = new EventEmitter<any>();
    @Output() refresh_Contract_Data: EventEmitter<any> = new EventEmitter<any>();
    @Output() reLoad: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeDeletedRow = new EventEmitter<any>();
    private ecapDimKey = "20___0";
    private kitEcapdim = "20_____1";
    private subKitEcapDim = "20_____2";
    private dim = "10___";
    private fields: any;
    private usrRole = (<any>window).usrRole;
    private isSuper = (<any>window).isSuper;

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
        if (!this.isInActCustSearch)
            this.iconUpdate.emit(eventData);
    }

    reload(eventData) {
        if (!this.isInActCustSearch)
            this.reLoad.emit('');
    }
    refreshContractData(eventData: boolean) {
        if (!this.isInActCustSearch)
            this.refresh_Contract_Data.emit(eventData);
    }

    uiControlWrapper(passedData, field) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        if (field == "VOLUME" || field == "CONSUMPTION_LOOKBACK_PERIOD" || field == "FRCST_VOL" ||
            field == "CREDIT_VOLUME" || field == "DEBIT_VOLUME" || field == "REBATE_OA_MAX_VOL") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.decimalPipe.transform(data[field], "1.0-0");
        }
        else if (field == "REBATE_OA_MAX_AMT" || field == "MAX_RPU" || field == "USER_MAX_RPU" ||
            field == "AVG_RPU" || field == "USER_AVG_RPU" || field == "TOTAL_DOLLAR_AMOUNT" || field == "MAX_PAYOUT"
            || field == "ADJ_ECAP_UNIT" || field == "CREDIT_AMT" || field == "DEBIT_AMT") {
            if (data[field] != undefined && data[field] != null && data[field] != "")
                data[field] = this.currencyPipe.transform(parseFloat(data[field]), 'USD', 'symbol', '1.2-2');
        }
        else if (field == "BLLG_DT" || field == "LAST_TRKR_START_DT_CHK" || field == "ON_ADD_DT"
            || field == "REBATE_BILLING_START" || field == "REBATE_BILLING_END") {
            if (data[field] != undefined) {
                if (data[field] == "Invalid date") data[field] = "";
                else if (data[field] != null && data[field] != "") data[field] = this.datePipe.transform(data[field], "MM/dd/yyyy");
            }
        }
        return data;
    }

    keyArray(data: any) {
        return Object.keys(data).sort();
    }

    uiDimControlWrapper(passedData, field) {
        let data = JSON.parse(JSON.stringify(passedData)) as typeof passedData;
        let dim = "";
        if (field == "ECAP_PRICE" && data.OBJ_SET_TYPE_CD == "ECAP") {
            if (data.ECAP_PRICE && data.ECAP_PRICE[this.ecapDimKey] !== undefined && data.ECAP_PRICE[this.ecapDimKey] !== null && data.ECAP_PRICE[this.ecapDimKey] !== "")
                data.ECAP_PRICE[this.ecapDimKey] = !Number.isNaN(Number(data.ECAP_PRICE[this.ecapDimKey])) ? this.currencyPipe.transform(data.ECAP_PRICE[this.ecapDimKey], 'USD', 'symbol', '1.2-2') : data.ECAP_PRICE[this.ecapDimKey];
            dim = this.ecapDimKey;
        }
        else if (field == "KIT_ECAP" || field == "CAP_KIT" || field == "YCS2_KIT") {
            field = field == "CAP_KIT" ? "CAP" : field == "YCS2_KIT" ? "YCS2_PRC_IRBT" : "ECAP_PRICE";
            if (data[field] && data[field][this.kitEcapdim] !== undefined && data[field][this.kitEcapdim] !== null && data[field][this.kitEcapdim] !== "" && data[field][this.kitEcapdim] !== "No YCS2" && data[field][this.kitEcapdim] !== "No CAP")
                data[field][this.kitEcapdim] = !Number.isNaN(Number(data[field][this.kitEcapdim])) ? this.currencyPipe.transform(data[field][this.kitEcapdim], 'USD', 'symbol', '1.2-2') : data[field][this.kitEcapdim];
            dim = this.kitEcapdim;
        }
        else if (field == "SUBKIT_ECAP") {
            if (data.ECAP_PRICE && data.ECAP_PRICE[this.subKitEcapDim] !== undefined && data.ECAP_PRICE[this.subKitEcapDim] !== null && data.ECAP_PRICE[this.subKitEcapDim] !== "")
                data.ECAP_PRICE[this.subKitEcapDim] = !Number.isNaN(Number(data.ECAP_PRICE[this.subKitEcapDim])) ? this.currencyPipe.transform(data.ECAP_PRICE[this.subKitEcapDim], 'USD', 'symbol', '1.2-2') : data.ECAP_PRICE[this.subKitEcapDim];
            dim = this.subKitEcapDim;
            field = "ECAP_PRICE";
        }
        else if (field == "COMPETITIVE_PRICE") {
            if (data[field] && data[field][this.ecapDimKey] !== undefined && data[field][this.ecapDimKey] !== null && data[field][this.ecapDimKey] !== "")
                data[field][this.ecapDimKey] = !Number.isNaN(Number(data[field][this.ecapDimKey])) ? this.currencyPipe.transform(data[field][this.ecapDimKey], 'USD', 'symbol', '1.2-2') : data[field][this.ecapDimKey];
            dim = this.ecapDimKey;
        }
        return { 'data': data, 'field': field, 'dim': dim };
    }
    getClassNm(passedData, field) {
        var classNm = "";
        if (passedData != undefined && passedData._behaviors != undefined) {
            if (passedData._behaviors.isHidden != undefined && passedData._behaviors.isHidden[field])
                classNm += " isHiddenCell";
            if (passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field])
                classNm += " isReadOnlyCell";
            if (passedData._behaviors.isRequired != undefined && passedData._behaviors.isRequired[field])
                classNm += " isRequiredCell";
            if (passedData._behaviors.isError != undefined && passedData._behaviors.isError[field])
                classNm += " isErrorCell";
            if (passedData._behaviors.isSaved != undefined && passedData._behaviors.isSaved[field])
                classNm += " isSavedCell";
            if (passedData._behaviors.isDirty != undefined && passedData._behaviors.isDirty[field])
                classNm += " isDirtyCell";
            if ( passedData.HAS_TRACKER=="1" && field=='LAST_REDEAL_DT' && passedData._behaviors.isDirty != undefined ){
                if (passedData._behaviors.isDirty['CONSUMPTION_CUST_PLATFORM'] == true || passedData._behaviors.isDirty['CONSUMPTION_SYS_CONFIG'] == true ||
                    passedData._behaviors.isDirty['CNSMPTN_LKBACK_PERD_DT'] == true || passedData._behaviors.isDirty['CONSUMPTION_REASON'] == true ||
                    passedData._behaviors.isDirty['CONSUMPTION_CUST_SEGMENT'] == true || passedData._behaviors.isDirty['CONSUMPTION_CUST_RPT_GEO'] == true ||
                    passedData._behaviors.isDirty['CONSUMPTION_COUNTRY_REGION'] == true || passedData._behaviors.isDirty['CONSUMPTION_REASON_CMNT'] == true ||
                    passedData._behaviors.isDirty['CONSUMPTION_TYPE'] == true || passedData._behaviors.isDirty['SYS_PRICE_POINT'] == true ||
                    passedData._behaviors.isDirty['CONSUMPTION_LOOKBACK_PERIOD'] == true || passedData._behaviors.isDirty['QLTR_PROJECT'] == true) {
                    if (passedData.LAST_REDEAL_DT == '') {
                        passedData.LAST_REDEAL_DT = this.datePipe.transform(new Date(), "MM/dd/yyyy");
                    }
                    classNm = "";
                }
            }
        } 
        return classNm.replace(" isRequiredCell", "");
    }
    getMissingCostCapTitle(in_DataItem) {
        return GridUtil.getMissingCostCapTitle(in_DataItem);
    }

    getPercData(passedData) {
        return GridUtil.getPercData(passedData);
    }

    numberWithCommas(data) {
        return GridUtil.numberWithCommas(data);
    }

    applySoftWarnings(passedData, field) {
        return GridUtil.applySoftWarnings(passedData, field);
    }

    applySoftWarningsClass(finalMsg) {
        return GridUtil.applySoftWarningsClass(finalMsg);
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
                each(this.fields, row => {
                    if (data[row.field] && data[row.field][key] && !Number.isNaN(Number(data[row.field][key]))) {
                        if (row.format == "number" && row.field == "INCENTIVE_RATE")
                            data[row.field][dim] = data[row.field][dim] != "Unlimited" ? this.decimalPipe.transform(data[row.field][dim]) : data[row.field][dim];
                        else if (row.format == "number")
                            data[row.field][dim] = data[row.field][dim] != "Unlimited" ? this.decimalPipe.transform(data[row.field][dim], "1.0-0") : data[row.field][dim];
                        else
                            data[row.field][dim] = data[row.field][dim] != "Unlimited" ? this.currencyPipe.transform(data[row.field][dim], 'USD', 'symbol', '1.2-2') : data[row.field][dim];
                    }
                })
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
                each(this.fields, row => {
                    let dim = (row.field == "DENSITY_BAND" || row.field == "DENSITY_RATE") ? "8___" : "10___" + numTiers;
                    if (row.field == "DENSITY_RATE") {
                        for (let bands = 1; bands <= passedData.NUM_OF_DENSITY; bands++) {
                            data[row.field][dim + bands + '____' + key] = this.currencyPipe.transform(data[row.field][dim + bands + '____' + key], 'USD', 'symbol', '1.2-2');
                        }
                    } else if (row.field == "STRT_PB" || row.field == "END_PB") {
                        if (!Number.isNaN(Number(data[row.field][key]))) {
                            if (row.format == "number")  data[row.field][key] = this.decimalPipe.transform(data[row.field][key], "1.0-3");
                        }
                    }
                })
            }
        }
        return GridUtil.uiControlScheduleWrapperDensity(data);
    }
    getResultSingleIconNm(result) {
        return GridUtil.getResultSingleIconNm(result);
    }
    uiBoolControlWrapper(passedData, field) {
        return GridUtil.uiBoolControlWrapper(passedData, field);
    }
    uiProductDimControlWrapper(passedData) {
        return passedData["TITLE"].split(',');
    }
    uiKitCalculatedValuesControlWrapper(passedData, kitType, column) {
        return this.currencyPipe.transform(PTE_Load_Util.kitCalculatedValues(passedData, kitType, column), 'USD', 'symbol', '1.2-2');
    }
    uiControlBackEndRebateWrapper(passedData) {
        let dim = this.in_Deal_Type == "KIT" ? this.kitEcapdim : this.ecapDimKey;
        return typeof PTE_Load_Util.calcBackEndRebate(passedData, this.in_Deal_Type, "ECAP_PRICE", dim) == 'number' ? this.currencyPipe.transform(PTE_Load_Util.calcBackEndRebate(passedData, this.in_Deal_Type, "ECAP_PRICE", dim), 'USD', 'symbol', '1.2-2') : '';
    }
    uiTotalDiscountPerLineControlWrapper(passedData, dimkey) {
        var data = passedData["QTY"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - are QTY and dscnt_per_line required columns?

        if (data === undefined || data === null) return "";
        var dataDscnt = passedData["DSCNT_PER_LN"] != undefined ? parseFloat(passedData["DSCNT_PER_LN"][dimkey]) : 0;
        return new CurrencyPipe('en-us').transform(parseFloat(passedData["QTY"][dimkey]) * dataDscnt, 'USD', 'symbol', '1.2-2');
    }
    getResultSingleIcon(passedData, field) {
        let parent = document.getElementById(field + "_" + passedData.DC_ID);
        let child = parent.getElementsByTagName('i');
        if (child != undefined && child.length == 1)
            child[0].style.color = this.getColorStyle(passedData[field]);
        return;
    }
    getColorStyle = function (result) {
        return PTE_Load_Util.getColorPct(result);
    }
    isReadonlyCell(passedData, field) {
        if (passedData._behaviors != undefined && passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly[field] != undefined)
            return true;
        else if (field == "KIT_ECAP") {
            if (passedData._behaviors != undefined && passedData._behaviors.isReadOnly != undefined && passedData._behaviors.isReadOnly["ECAP_PRICE"] != undefined)
                return true;
        }
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
    hasVertical(data) {
        return TenderDashboardGridUtil.hasVertical(data);
    }
    stgFullTitleChar(passedData) {
       return GridUtil.stgFullTitleChar(passedData);
    }
    fieldVal(passedData, field, dimKey) {
        return (dimKey !== '')
            ? !!passedData[field] && !!passedData[field][dimKey] ? passedData[field][dimKey] : ''
            : !!passedData[field] && !!passedData[field] ? passedData[field] : '';
    }

    startVal(passedData, startDt, dimKey) {
        return (dimKey !== '')
            ? !!passedData[startDt] && !!passedData[startDt][dimKey] ? passedData[startDt][dimKey] : ''
            : !!passedData[startDt] && !!passedData[startDt] ? passedData[startDt] : '';
    }
    checkingMsg(passedData, field, startDt, dimKey) {
        const cap = (dimKey !== "")
            ? !!passedData[startDt] && !!passedData.CAP[dimKey] ? parseFloat(passedData.CAP[dimKey].toString().replace(/,|$/g, '')) : ""
            : !!passedData[startDt] && !!passedData.CAP ? parseFloat(passedData.CAP.toString().replace(/,|$/g, '')) : "";
        const ecap = (dimKey !== "")
            ? !!passedData[startDt] && !!passedData.ECAP_PRICE[dimKey] ? parseFloat(passedData.ECAP_PRICE[dimKey].toString().replace(/,|$/g, '')) : ""
            : !!passedData[startDt] && !!passedData.ECAP_PRICE ? parseFloat(passedData.ECAP_PRICE.toString().replace(/,|$/g, '')) : "";
        if (ecap > cap) {
            const dsplCap = cap === "" ? "No CAP" : cap;
            const dsplEcap = ecap === "" ? "No ECAP" : ecap;
            return {
                'msg': "ECAP $" + dsplEcap + " is greater than the CAP $" + dsplCap + "",
                'msgClass': "isSoftWarnCell"
            }
        }
        if (this.fieldVal(passedData, field, dimKey) !== "" && this.fieldVal(passedData, field, dimKey).indexOf("-") > -1) {
            return {
                'msg': "CAP price " + this.fieldVal(passedData, field, dimKey) + " cannot be a range.",
                'msgClass': "isSoftWarnCell"
            }
        }
        return {
            'msg': '',
            'msgClass': ""
        }

    }
    densityBands(passedData) {
        let data = parseInt(passedData.NUM_OF_DENSITY);
        let band = []
        for (let i = 1; i <= data; i++) {
            band.push(i);
        }
        return band;
    }
    checkIndex(passedData, field) {
        let keys = this.key(passedData, field);
        for (let i = 0; i < keys.length; i++)
            if (passedData[field].hasOwnProperty(keys[i]) && keys[i].indexOf('___') >= 0 && keys[i].indexOf('_____') < 0) return true;
        return false;
    }
    key(passedData, field) {
        if (field == 'TIER_NBR' && passedData[field]) return Object.keys(passedData.TIER_NBR);
        else if (field == 'TOTAL_DSCNT_PR_LN' && passedData["QTY"] && typeof passedData["QTY"] == 'object') return Object.keys(passedData["QTY"]).sort();
        else if (field == 'PRIMARY_OR_SECONDARY' && passedData["ECAP_PRICE"] && typeof passedData["ECAP_PRICE"] == 'object') return Object.keys(passedData["ECAP_PRICE"]).sort();
        else if (field == 'TRKR_NBR' && passedData[field] && typeof passedData[field] == 'object') return Object.keys(passedData["TRKR_NBR"]).sort();
        else if (field == 'DENSITY_BAND' && passedData[field] && typeof passedData[field] == 'object') return Object.keys(passedData["DENSITY_BAND"]);
        else if (field == 'DENSITY_RATE' && passedData[field] && typeof passedData[field] == 'object') return Object.keys(passedData["DENSITY_RATE"]);
        else if (passedData[field] && typeof passedData[field] == 'object') return Object.keys(passedData[field]);
        else return [];
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
        if (!dimKey) dimKey = '';
        if (dimKey !== '' && !!passedData[field]) {
            if (passedData[field][dimKey] !== undefined) passedData[field][dimKey] = passedData[field][dimKey].replace(/$|,/g, '');
        } else {
            if (passedData[field] !== undefined) passedData[field] = passedData[field].replace(/$|,/g, '');
        }
        if (!passedData[startDt])
            passedData[startDt] = {};
        if (!passedData[startDt][dimKey])
            passedData[startDt][dimKey] = "";
        if (!passedData[endDt])
            passedData[endDt] = {};
        if (!passedData[endDt][dimKey])
            passedData[endDt][dimKey] = "";
    }
    getProductSid(dimProduct, dimKey) {
        return GridUtil.getProductMbrSid(dimProduct, dimKey);
    }
    getBidActions(data) {
        return TenderDashboardGridUtil.getBidActions(data);
    }
    removeDeletedRowData(event) {
        if (!this.isInActCustSearch)
            this.removeDeletedRow.emit(event);
    }
    ngOnInit() {
        if (!this.in_Is_Tender_Dashboard)//if not Tender Dashboard Screen, take salesforce Id from contract data
            this.in_DataItem.SALESFORCE_ID = this.contract_Data.SALESFORCE_ID;
        this.fields = this.in_Deal_Type === 'REV_TIER' ? PTE_Config_Util.revTierFields : this.in_Deal_Type === 'DENSITY' ? PTE_Config_Util.densityFields : PTE_Config_Util.volTierFields;
    }

}