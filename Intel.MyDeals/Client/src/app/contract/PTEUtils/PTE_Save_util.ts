import { each, find, uniq, contains, values } from 'underscore';
import { StaticMomentService } from "../../shared/moment/moment.service";
import { PTE_Common_Util } from './PTE_Common_util';
import { PTE_Validation_Util } from './PTE_Validation_util';
import { DE_Save_Util } from '../DEUtils/DE_Save_util';
import { PTE_Config_Util } from './PTE_Config_util';

export class PTE_Save_Util {
    static validatePTE(PTR: Array<any>, curPricingStrategy: any, curPricingTable: any, contractData: any, overlapFlexResult: any, validMisProd:any): any {
        //this will make sure the neccessary proprty except _behaviours for Save are added
        this.setPTRBasicPropertyForSave(PTR, curPricingStrategy, curPricingTable, contractData);
        return this.validatePTEDeal(PTR, curPricingStrategy, curPricingTable, contractData, overlapFlexResult, validMisProd);
    }
    static setPTRBasicPropertyForSave(PTR: Array<any>, curPricingStrategy: any, curPricingTable: any, contractData: any) {
        each(PTR, item => {
            item["_dirty"] = true;
            item["PS_WF_STG_CD"] = curPricingStrategy.WF_STG_CD;
            item["DC_PARENT_ID"] = curPricingTable.DC_ID;
            item["dc_type"] = 'PRC_TBL_ROW';
            item["dc_parent_type"] = 'PRC_TBL';
            item["OBJ_SET_TYPE_CD"] = curPricingTable.OBJ_SET_TYPE_CD;
            item["BACK_DATE_RSN_TXT"] = contractData.BACK_DATE_RSN;
            item["CONTRACT_TYPE"] = contractData.CONTRACT_TYPE;
            item["IS_HYBRID_PRC_STRAT"] = curPricingStrategy.IS_HYBRID_PRC_STRAT;
        });
    }
    static validatePTEDeal(PTR: Array<any>, curPricingStrategy: any, curPricingTable: any, contractData: any, overlapFlexResult: any, validMisProd: any): any {
        each(PTR, (item) => {
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
        });
        PTR = PTE_Validation_Util.validateSettlementPartner(PTR, curPricingStrategy);
        PTR = PTE_Validation_Util.validateOverArching(PTR, curPricingStrategy, curPricingTable);
        PTR = PTE_Validation_Util.validateMarketSegment(PTR, undefined, undefined);
        PTR = PTE_Validation_Util.validateHybridFields(PTR, curPricingStrategy, curPricingTable);
        //*********these conditions are added recently by comparing the JS code will revist this**********
        PTR=PTE_Validation_Util.validateFlexRowType(PTR, curPricingStrategy, curPricingTable, null, undefined, false);
        PTR=PTE_Validation_Util.validateMarketSegment(PTR, null, undefined);
        PTR=PTE_Validation_Util.validateFlexRules(PTR, curPricingTable, null, false);
       //*********these conditions are added recently by comparing the JS code will revist this**********
        if (curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY' && validMisProd != undefined) {
            PTR = this.ValidateDensityPTR(PTR, validMisProd)
        }
        if (overlapFlexResult != undefined) {
            let restrictGroupFlexOverlap = false;
            let OVLPFlexPdtPTRUSRPRDError = false;
            PTE_Common_Util.validateOVLPFlexProduct(PTR, undefined, false, curPricingTable, restrictGroupFlexOverlap, overlapFlexResult, OVLPFlexPdtPTRUSRPRDError);
        }
        let invalidFlexDate = PTE_Validation_Util.validateFlexDate(PTR, curPricingTable, undefined);
        // Check if the rows have duplicate products
        const isFlexPs = curPricingTable.OBJ_SET_TYPE_CD != undefined && curPricingTable.OBJ_SET_TYPE_CD == "FLEX";
        const isHybridPS = curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";
        const duplicateFlexRows = isFlexPs ? PTE_Validation_Util.hasDuplicateProductPteLogic(PTR) : {};
        const duplicateProductRows = isHybridPS ? PTE_Validation_Util.hasDuplicateProductPteLogic(PTR) : {};
        let hasTender, hasNonTender = false;
        //bydefault setting an error can help to avoid any missing scenario bcz of is dirty flag
        let errDeals = [0];
        let errDealsFlex = [0];
        let dictRebateType = [];
        let dictPayoutBasedon = [];
        let dictCustDivision = [];
        let dictGeoCombined = [];
        let dictPeriodProfile = [];
        let dictResetPerPeriod = [];
        let dictProgramPayment = [];
        let dictOverarchingDollar = [];
        let dictOverarchingVolume = [];
        let isTenderContract = contractData["IS_TENDER"] == "1" ? true : false
        for (let s = 0; s < PTR.length; s++) {
            if (PTR[s]["_dirty"] !== undefined && PTR[s]["_dirty"] === true) errDeals.push(s);
            if (duplicateProductRows["duplicateProductDCIds"] !== undefined && (duplicateProductRows['duplicateProductDCIds'])[PTR[s].DC_ID] !== undefined) errDeals.push(s);
            if (duplicateFlexRows["duplicateProductDCIds"] !== undefined && (duplicateFlexRows['duplicateProductDCIds'])[PTR[s].DC_ID] !== undefined) errDealsFlex.push(s);
            if ((curPricingTable.OBJ_SET_TYPE_CD !== "KIT" && curPricingTable.OBJ_SET_TYPE_CD !== "VOL_TIER"
                && curPricingTable.OBJ_SET_TYPE_CD !== "FLEX") || PTR[s].TIER_NBR == "1") {
                errDeals.push(s);
                if (PTR[s]["REBATE_TYPE"] === "TENDER") {
                    hasTender = true;
                } else {
                    hasNonTender = true;
                }
                if (isHybridPS) {
                    dictRebateType[PTR[s]["REBATE_TYPE"]] = s;
                    dictPayoutBasedon[PTR[s]["PAYOUT_BASED_ON"]] = s;
                    const isCustDivValid = PTE_Validation_Util.validateCustomerDivision(dictCustDivision, PTR[0]["CUST_ACCNT_DIV"], PTR[s]["CUST_ACCNT_DIV"]);
                    if (isCustDivValid) {
                        dictCustDivision[PTR[0]["CUST_ACCNT_DIV"]] = s;
                    }
                    else {
                        dictCustDivision[PTR[s]["CUST_ACCNT_DIV"]] = s;
                    }
                    dictGeoCombined[PTR[s]["GEO_COMBINED"]] = s;
                    if (curPricingTable.OBJ_SET_TYPE_CD !== "PROGRAM") {
                        dictPeriodProfile[PTR[s]["PERIOD_PROFILE"]] = s;
                    }
                    dictResetPerPeriod[PTR[s]["RESET_VOLS_ON_PERIOD"]] = s;
                    dictProgramPayment[PTR[s]["PROGRAM_PAYMENT"]] = s;

                    // The next two values if left blank can come in as either null or "", make them one pattern.
                    if (PTR[s]["REBATE_OA_MAX_AMT"] == null) dictOverarchingDollar[""] = s;
                    else dictOverarchingDollar[PTR[s]["REBATE_OA_MAX_AMT"]] = s;

                    if (PTR[s]["REBATE_OA_MAX_VOL"] == null) dictOverarchingVolume[""] = s;
                    else dictOverarchingVolume[PTR[s]["REBATE_OA_MAX_VOL"]] = s;
                }
            }
        }

        if (errDeals.length > 0) {
            for (let t = 0; t < errDeals.length; t++) {
                const el = PTR[errDeals[t]];
                if (el && !el._behaviors) el._behaviors = {};
                if (!el._behaviors.isError) el._behaviors.isError = {};
                if (!el._behaviors.validMsg) el._behaviors.validMsg = {};

                if (hasTender && hasNonTender && el.REBATE_TYPE == "TENDER") {
                    el._behaviors.isError["REBATE_TYPE"] = true;
                    el._behaviors.validMsg["REBATE_TYPE"] = "Cannot mix Tender and Non-Tender deals in the same table (Pricing Table).";
                }

                if (isHybridPS && Object.keys(dictProgramPayment).length == 1 && !(Object.keys(dictProgramPayment).includes("Backend"))) {
                    el._behaviors.isError["PROGRAM_PAYMENT"] = true;
                    el._behaviors.validMsg["PROGRAM_PAYMENT"] = "Hybrid Pricing Strategy Deals must be Backend only.";
                }

                // Hybrid Deals - Validate for duplicate products
                if (isHybridPS && (duplicateProductRows['duplicateProductDCIds'])[el.DC_ID] !== undefined) {
                    el._behaviors.isError["PTR_USER_PRD"] = true;
                    el._behaviors.validMsg["PTR_USER_PRD"] = "Cannot have duplicate product(s). Product(s): " +
                        (duplicateProductRows['duplicateProductDCIds'])[el.DC_ID].OverlapProduct + " are duplicated within rows " + (duplicateProductRows['duplicateProductDCIds'])[el.DC_ID].OverlapDCID + ". Please check the date range overlap.";
                }
            }
        }

        if (errDealsFlex.length > 0) {  // Flex Deals - Validate for duplicate products
            for (let t = 0; t < errDealsFlex.length; t++) {
                const el = PTR[errDealsFlex[t]];
                const splitProd = el.PTR_USER_PRD.split(',');
                if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
                    //getting flex rowType values
                    for (let tmpProd = 0; tmpProd < PTR.length; tmpProd++) {
                        if (el.DC_ID != PTR[tmpProd].DC_ID) {
                            let compareFirstProduct1 = PTR[tmpProd].PTR_USER_PRD;
                            compareFirstProduct1 = compareFirstProduct1.split(',');

                            let productCompareAll = splitProd.filter((val) => {
                                return compareFirstProduct1.includes(val)
                            });

                            if ((el.FLEX_ROW_TYPE == PTR[tmpProd].FLEX_ROW_TYPE) && (productCompareAll.length > 0)) {
                                if (PTR[tmpProd].START_DT >= el.START_DT && PTR[tmpProd].END_DT <= el.END_DT) {
                                    if (isFlexPs && (duplicateFlexRows['duplicateProductDCIds'])[el.DC_ID] !== undefined) {
                                        el._behaviors.isError["PTR_USER_PRD"] = true;
                                        el._behaviors.validMsg["PTR_USER_PRD"] = "Cannot have duplicate product(s). Product(s): " +
                                            (duplicateFlexRows['duplicateProductDCIds'])[el.DC_ID].OverlapProduct + " are duplicated within rows " + (duplicateFlexRows['duplicateProductDCIds'])[el.DC_ID].OverlapDCID + ". Please check the date range overlap.";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        each(PTR, (item) => {
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
            if (curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                if (item["PTR_USER_PRD"] && item["PTR_USER_PRD"] != null && item["PTR_USER_PRD"] != "") {
                    let products = item["PTR_USER_PRD"].replace(/,,/g, ',').split(',');
                    if (products.length > PTE_Config_Util.maxKITproducts) {
                        item._behaviors.isError['PTR_USER_PRD'] = true;
                        item._behaviors.validMsg['PTR_USER_PRD'] = "You have too many products! You may have up to 10 products";
                    }
                }
            }
            if (StaticMomentService.moment(item["START_DT"]).isAfter(contractData.END_DT) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + StaticMomentService.moment(contractData.END_DT).format("MM/DD/YYYY") + ")";
            }
            if (StaticMomentService.moment(item["END_DT"]).isBefore(contractData.START_DT) && !isTenderContract) {
                item._behaviors.isError['END_DT'] = true;
                item._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + StaticMomentService.moment(contractData.START_DT).format("MM/DD/YYYY") + ")";
            }
            if (StaticMomentService.moment(item["START_DT"]).isAfter(StaticMomentService.moment(item["END_DT"])) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Deal Start date cannot be greater than the Deal End Date";
            }
            if ((item["START_DT"] == "" || item["START_DT"] == null) && (item["TIER_NBR"] == undefined || item["TIER_NBR"] == "1") && !isTenderContract) {
                item["START_DT"] = contractData.START_DT;
            }
            if ((item["END_DT"] == "" || item["END_DT"] == null) && (item["TIER_NBR"] == undefined || item["TIER_NBR"] == "1") && !isTenderContract) {
                item["END_DT"] = contractData.END_DT;
            }
            if ((item["PROD_INCLDS"] == null || item["PROD_INCLDS"] == undefined || item["PROD_INCLDS"] == '') && (item["TIER_NBR"] == undefined || item["TIER_NBR"] == "1") && (item['NUM_OF_DENSITY'] == undefined || item['NUM_OF_DENSITY'] == "1")) {
                item._behaviors.isError['PROD_INCLDS'] = true;
                item._behaviors.validMsg['PROD_INCLDS'] = "Field is required";
            }
            if ((item["REBATE_TYPE"] == null || item["REBATE_TYPE"] == undefined || item["REBATE_TYPE"] == '') && (item["TIER_NBR"] == undefined || item["TIER_NBR"] == "1") && (item['NUM_OF_DENSITY'] == undefined || item['NUM_OF_DENSITY'] == "1")) {
                item._behaviors.isError['REBATE_TYPE'] = true;
                item._behaviors.validMsg['REBATE_TYPE'] = "Field is required";
            }
            if ((item["GEO_COMBINED"] == null || item["GEO_COMBINED"] == undefined || item["GEO_COMBINED"] == '') ) {
                //this one is removed if and tested as per js its working fine if any issue we can add this in above condition
                //&& (item["TIER_NBR"] == '' || item["TIER_NBR"] == undefined || item["TIER_NBR"] == "1") && (item['NUM_OF_DENSITY'] == undefined || item['NUM_OF_DENSITY'] == "1")
                item._behaviors.isError['GEO_COMBINED'] = true;
                item._behaviors.validMsg['GEO_COMBINED'] = "Field is required";
            }
            if (item["PAYOUT_BASED_ON"] == null || item["PAYOUT_BASED_ON"] == undefined || item["PAYOUT_BASED_ON"] == '') {
                item._behaviors.isError['PAYOUT_BASED_ON'] = true;
                item._behaviors.validMsg['PAYOUT_BASED_ON'] = "Field is required";
            }
            if ((item["PROGRAM_PAYMENT"] == null || item["PROGRAM_PAYMENT"] == undefined || item["PROGRAM_PAYMENT"] == '') && curPricingTable.OBJ_SET_TYPE_CD == "ECAP") {
                item._behaviors.isError['PROGRAM_PAYMENT'] = true;
                item._behaviors.validMsg['PROGRAM_PAYMENT'] = "Field is required";
            }
            if (item["OBJ_SET_TYPE_CD"] == "FLEX") {
                //Delete if there is any previous Error  messages
                if ((invalidFlexDate || invalidFlexDate != undefined)) {
                    each(invalidFlexDate, (item) => {
                        PTE_Validation_Util.setFlexBehaviors(item, 'START_DT', 'invalidDate', false);
                    });
                }
            }
        });

        return PTR;
    }
    static validatePTEECAP(PTR: Array<any>): any {
        //check for Ecap price 
        each(PTR, (item) => {
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
            if (item.ECAP_PRICE == null || item.ECAP_PRICE == 0 || item.ECAP_PRICE == '' || item.ECAP_PRICE < 0) {
                PTE_Common_Util.setBehaviorsValidMessage(item, 'ECAP_PRICE', 'ECAP', 'equal-zero');
            }
        });
        return PTR;
    }
    static settlementPartnerValUpdate(PTR: Array<any>) {
        each(PTR, item => {
            if (item.SETTLEMENT_PARTNER && item.SETTLEMENT_PARTNER != '') {
                let items = item.SETTLEMENT_PARTNER.split('-');
                if (items.length > 1) {
                    item.SETTLEMENT_PARTNER = item.SETTLEMENT_PARTNER.split('-')[1].trim();
                }
                else {
                    item.SETTLEMENT_PARTNER = item.SETTLEMENT_PARTNER;
                }
            }
        });
        return PTR;
    }
    //check for all attribue present
    static sanitizePTR(PTR: Array<any>, contractData: any): Array<any> {
        each(PTR, (item) => {
            if (item && (item.CUST_MBR_SID == null || item.CUST_MBR_SID == '' || item.CUST_MBR_SID == undefined)) {
                item.CUST_MBR_SID = contractData.CUST_MBR_SID;
            }
            if (item.QLTR_PROJECT != undefined && item.QLTR_PROJECT != null && item.QLTR_PROJECT != "") {
                item.QLTR_PROJECT = item.QLTR_PROJECT.toUpperCase();
            }
            if (item.PRD_EXCLDS && item.PRD_EXCLDS != undefined && item.PRD_EXCLDS != null && item.PRD_EXCLDS.length == 0) {
                item.PRD_EXCLDS = "";
            }
            if (item.FRCST_VOL != undefined && isNaN(Number(item.FRCST_VOL))) {
                item.FRCST_VOL = "";
            }
            if (item.VOLUME != undefined && isNaN(Number(item.VOLUME))) {
                item.VOLUME = "";
            }
        });
        return PTR;
    }
    static generatePTRAfterSave(result: any): Array<any> {
        let PTR = [];
        const PTRResult = result.Data.PRC_TBL_ROW;
        if (PTRResult && PTRResult.length > 0 && PTRResult[0]._actions) {
            let actions = PTRResult[0]._actions;
            PTRResult.splice(0, 1);
            each(PTRResult, (item) => {
                each(actions, act => {
                    if (item.DC_ID == act.DcID) {
                        item.DC_ID = act.AltID
                    }
                });
            });
            return PTRResult;
        }
        else {
            return PTR;
        }

    }
    static isPTEError(PTR: Array<any>, curPricingTable: any): boolean {
        //identify the uniq records by DCID and check for errors. 
        //the error has to bind first object for tier and uniq will give first uniq record
        //since we dont have client side tier level error we can use this method. But will revisit if require
        let uniqPTR = uniq(PTR, 'DC_ID');
        let iserror = find(uniqPTR, (x) => {
            if (x._behaviors && x._behaviors.isError) {
                return contains(values(x._behaviors.isError), true)
            }
        });
        return iserror != null ? true : false;
    }

    static setDataItem(dataItem: any, field: any, value, key?: any) {
        DE_Save_Util.setDataItem(dataItem, field, value, key);
    }

    static ValidateDensityPTR(PTR: Array<any>, validMisProd) {
        if (validMisProd != undefined) {
            each(PTR, (itm, indx) => {
                if (validMisProd[itm.DC_ID] != undefined && validMisProd[itm.DC_ID].cond) {
                    PTE_Common_Util.setBehaviors(itm);
                    itm._dirty = true;
                    if (validMisProd[itm.DC_ID].cond.includes('nullDensity')) {
                        itm._behaviors.isError['DENSITY_BAND'] = true;
                        itm._behaviors.validMsg['DENSITY_BAND'] = "One or more of the products do not have density band value associated with it";
                    }
                    else if (validMisProd[itm.DC_ID].cond == 'insufficientDensity') {
                        itm._behaviors.isError['DENSITY_BAND'] = true;
                        itm._behaviors.validMsg['DENSITY_BAND'] = "The no. of densities selected for the product was " + validMisProd[itm.DC_ID].selDen + "but the actual no. of densities for the product is" + validMisProd[itm.DC_ID].actDen;
                    }
                }
            });
        }
        return PTR;
    }

    static fillingPayLoad(data: any, curPricingTable: any,pteData?) {
        each(data, (item,ind) => {
            if (curPricingTable.OBJ_SET_TYPE_CD == 'KIT') {
                item["TEMP_SUM_TOTAL_DSCNT_PER_LN"] = 0;
                let obj;
                if (item['PTR_SYS_PRD'] && typeof item['PTR_SYS_PRD'] == 'string')
                    obj = JSON.parse(item['PTR_SYS_PRD']);
                else
                    obj = item['PTR_SYS_PRD'];
                let keys = Object.keys(obj);
                for (let key in keys) {
                    if (!Number.isNaN(Number(key))) {
                        if (obj[keys[key]][0].CAP != undefined && obj[keys[key]][0].CAP != null) {
                            if ((item['CAP'] == undefined || item['CAP'] == null || item['CAP'] == "" || item['CAP'] == 'No CAP') || (item['CAP'] !== undefined && item['CAP'] != null && item['CAP'] !== "" && parseFloat(item['CAP']) < parseFloat(obj[keys[key]][0].CAP)))
                                item['CAP'] = obj[keys[key]][0].CAP;
                        }
                        if (obj[keys[key]][0].YCS2 != undefined && obj[keys[key]][0].YCS2 != null) {
                            item['YCS2'] = obj[keys[key]][0].YCS2;
                        }
                    }
                }
            }
            if (curPricingTable.OBJ_SET_TYPE_CD == 'VOL_TIER' || curPricingTable.OBJ_SET_TYPE_CD == 'PROGRAM' || curPricingTable.OBJ_SET_TYPE_CD == 'FLEX' || curPricingTable.OBJ_SET_TYPE_CD == 'REV_TIER') {
                item["VOLUME"] = null;
                item["ECAP_PRICE"] = null;
            }
            if (item['REBATE_OA_MAX_VOL'] != undefined && item['REBATE_OA_MAX_VOL'] != null && item['REBATE_OA_MAX_VOL'] != "") {
                item['REBATE_OA_MAX_VOL'] = item['REBATE_OA_MAX_VOL'].toString();
            }
            if (item['REBATE_OA_MAX_AMT '] != undefined && item['REBATE_OA_MAX_AMT '] != null && item['REBATE_OA_MAX_AMT '] != "") {
                item['REBATE_OA_MAX_AMT '] = item['REBATE_OA_MAX_AMT '].toString();
            }
            if (item['REBATE_OA_MAX_AMT '] != undefined && item['REBATE_OA_MAX_AMT '] != null && item['REBATE_OA_MAX_AMT '] != "") {
                item['REBATE_OA_MAX_AMT '] = item['REBATE_OA_MAX_AMT '].toString();
            }
            if (item['END_CUSTOMER_RETAIL '] != undefined && item['REBATE_TYPE'] === "TENDER" && pteData && pteData.length > 0  ) {
                item['END_CUSTOMER_RETAIL'] = pteData ? pteData[ind] ['END_CUSTOMER_RETAIL'] : '';
                item['END_CUST_OBJ'] = pteData ? pteData[ind] ['END_CUST_OBJ'] : ''
            }
            // below condition is to remove CONSUMPTION_CUST_RPT_GEO and CONSUMPTION_COUNTRY_REGION for existing record from payload to make the behaviour similar to prod-ltm
            if (item.PAYOUT_BASED_ON == "Consumption") {
                if (item.DC_ID > 0) {
                    delete item['CONSUMPTION_CUST_RPT_GEO'];
                    delete item['CONSUMPTION_COUNTRY_REGION'];
                }
            }
        });
    }

    static saveWarningDetails(data, savedResponseWarning) {
        let index = 0;
        each(data, (dataItem) => {
            let modifiedDcid=0;
            if(!!data[0]._actions && dataItem.DC_ID<0){
                modifiedDcid=data[0]._actions.find(x=>x.Action=='ID_CHANGE' && x.DcID==dataItem.DC_ID)!=null? data[0]._actions.find(x=>x.Action=='ID_CHANGE' && x.DcID==dataItem.DC_ID).AltID:0;
            }
            if (dataItem.warningMessages && dataItem.warningMessages.length > 0
                && dataItem._behaviors['isError'] && dataItem._behaviors['validMsg']) {
                savedResponseWarning[index++] = {
                    DC_ID: dataItem.DC_ID,
                    warningMessages: dataItem.warningMessages,
                    errors: dataItem._behaviors['isError'],
                    validMsg: dataItem._behaviors['validMsg'],
                    savedDcid:modifiedDcid
                };
            }
        })
    }
}