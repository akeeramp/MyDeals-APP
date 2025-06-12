import { contains, each, every } from 'underscore';
import { StaticMomentService } from "../../shared/moment/moment.service";
import { PTE_Validation_Util } from '../PTEUtils/PTE_Validation_util';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';

export class DE_Validation_Util {

    static validateWipDeals(data, curPricingStrategy, curPricingTable, contractData, isTenderContract, lookBackPeriod, templates, groups, prcTblRowData, overlapFlexDEResult,oldDEData) {
        let restrictGroupFlexOverlap = false;
        each(data, (item) => {
            PTE_Common_Util.setBehaviors(item);
        });
        this.dataConversion(data, templates);
        PTE_Validation_Util.validateFlexRules(data, curPricingTable, data, restrictGroupFlexOverlap);
        //PTE_Validation_Util.validateFlexOverlapRules(data, curPricingTable, data);
        PTE_Validation_Util.ValidateEndCustomer(data, 'OnValidate', curPricingStrategy, curPricingTable);
        PTE_Validation_Util.validateSettlementPartner(data, curPricingStrategy);
        PTE_Validation_Util.validateOverArching(data, curPricingStrategy, curPricingTable);
        data = PTE_Validation_Util.validateHybridFields(data, curPricingStrategy, curPricingTable);
        data = PTE_Validation_Util.validateHybridProducts(data, curPricingStrategy);
        PTE_Validation_Util.validateSettlementLevel(data, curPricingStrategy);
        PTE_Validation_Util.validateFlexRowType(data, curPricingStrategy, curPricingTable, data, undefined, restrictGroupFlexOverlap);
        PTE_Validation_Util.validateMarketSegment(data, data, undefined);
        PTE_Validation_Util.validateBillingLookbakPeriod(data,groups);
        return this.ValidateDealData(data, curPricingTable, curPricingStrategy, contractData, lookBackPeriod, isTenderContract, restrictGroupFlexOverlap,prcTblRowData, overlapFlexDEResult,oldDEData);
    }

    static ValidateDealData(data, curPricingTable, curPricingStrategy, contractData, lookBackPeriod, isTenderContract, restrictGroupFlexOverlap, prcTblRowData, overlapFlexDEResult,oldDEData) {
        var isShowStopperError = false;
        if (overlapFlexDEResult != undefined) {
            let restrictGroupFlexOverlap = false;
            let OVLPFlexPdtPTRUSRPRDError = false;
            PTE_Common_Util.validateOVLPFlexProduct(data, prcTblRowData, false, curPricingTable, restrictGroupFlexOverlap, overlapFlexDEResult, OVLPFlexPdtPTRUSRPRDError);
        }
        var invalidFlexDate = PTE_Validation_Util.validateFlexDate(data, curPricingTable, data);

        this.valideFlexDuplicateProducts(data, curPricingTable);
        each(data, (item) => {
            if ((item["USER_AVG_RPU"] == null || item["USER_AVG_RPU"] == "")
                && (item["USER_MAX_RPU"] == null || item["USER_MAX_RPU"] == "")
                && item["RPU_OVERRIDE_CMNT"] != null && item["RPU_OVERRIDE_CMNT"] !== "") {
                item["RPU_OVERRIDE_CMNT"] = "";
            }

            if ((curPricingStrategy.WF_STG_CD.toString().toUpperCase() == "APPROVED" || Object.keys(item.TRKR_NBR).length > 0) && !isTenderContract) {
                if (parseInt(item.CONSUMPTION_LOOKBACK_PERIOD) < parseInt(lookBackPeriod[item.DC_ID])) {
                    item._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD'] = true;
                    item._behaviors.validMsg['CONSUMPTION_LOOKBACK_PERIOD'] = "Lookback Period can only be increased after approval";
                    isShowStopperError = true;
                }
            }

            if ((curPricingStrategy.WF_STG_CD.toString().toUpperCase() == "APPROVED" || Object.keys(item.TRKR_NBR).length > 0) && !isTenderContract) {
                if (!(parseInt(item.CONSUMPTION_LOOKBACK_PERIOD) < parseInt(lookBackPeriod[item.DC_ID]))) {
                    if (item._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD']) {
                        item._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD'] = true;
                        item._behaviors.validMsg['CONSUMPTION_LOOKBACK_PERIOD'] = "Consumption Lookback Period must be a whole number between 0 and 24.";
                        isShowStopperError = true;
                    }
                }
            }

            if (item.CONSUMPTION_COUNTRY_REGION != null && item.CONSUMPTION_COUNTRY_REGION != undefined && item.CONSUMPTION_COUNTRY_REGION != "") {
                if (item.CONSUMPTION_CUST_RPT_GEO != null && item.CONSUMPTION_CUST_RPT_GEO != undefined && item.CONSUMPTION_CUST_RPT_GEO != "") {
                    item._behaviors.isError['CONSUMPTION_CUST_RPT_GEO'] = true;
                    item._behaviors.validMsg['CONSUMPTION_CUST_RPT_GEO'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    item._behaviors.isError['CONSUMPTION_COUNTRY_REGION'] = true;
                    item._behaviors.validMsg['CONSUMPTION_COUNTRY_REGION'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    isShowStopperError = true;
                }
            }
            if (item._behaviors != undefined && item._behaviors.isError != undefined) {
                if (Object.keys(item._behaviors.isError).includes('START_DT')) {
                    delete item._behaviors.isError['START_DT'];
                }
                if (Object.keys(item._behaviors.validMsg).includes('START_DT')) {
                    delete item._behaviors.validMsg['START_DT'];
                }
            }
            if (Object.keys(item._behaviors.isError).includes('END_DT')) {
                delete item._behaviors.isError['END_DT'];
            }
            if (Object.keys(item._behaviors.validMsg).includes('END_DT')) {
                delete item._behaviors.validMsg['END_DT'];
            }

            if (item["START_DT"] == undefined || item["START_DT"] == null || item["START_DT"] == "" || item["START_DT"] == "Invalid date") {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Start date is required";
                isShowStopperError = true;
            }

            if (item["END_DT"] == undefined || item["END_DT"] == null || item["END_DT"] == "" || item["END_DT"] == "Invalid date") {
                item._behaviors.isError['END_DT'] = true;
                item._behaviors.validMsg['END_DT'] = "End date is required";
                isShowStopperError = true;
            }            

            if (StaticMomentService.moment(item["START_DT"]).isAfter(contractData.END_DT) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + StaticMomentService.moment(contractData.END_DT).format("MM/DD/YYYY") + ")";
                isShowStopperError = true;
            }

            if (StaticMomentService.moment(item["END_DT"]).isBefore(contractData.START_DT) && !isTenderContract) {
                item._behaviors.isError['END_DT'] = true;
                item._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + StaticMomentService.moment(contractData.START_DT).format("MM/DD/YYYY") + ")";
                isShowStopperError = true;
            }

            if (StaticMomentService.moment(item["START_DT"]).isAfter(StaticMomentService.moment(item["END_DT"])) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Deal Start date cannot be greater than the Deal End Date";
                isShowStopperError = true;
            }

            if (item["OEM_PLTFRM_LNCH_DT"] && item["OEM_PLTFRM_EOL_DT"] && item["OEM_PLTFRM_LNCH_DT"] !== "" && item["OEM_PLTFRM_EOL_DT"] !== "" && StaticMomentService.moment(item["OEM_PLTFRM_EOL_DT"]).isSameOrBefore(item["OEM_PLTFRM_LNCH_DT"])) {
                item._behaviors.isError['OEM_PLTFRM_EOL_DT'] = true;
                item._behaviors.validMsg['OEM_PLTFRM_EOL_DT'] = "OEM Platform EOL Date must be after the OEM Platform Launch Date";
                isShowStopperError = true;
            }

            if (item["REBATE_BILLING_START"] == undefined || item["REBATE_BILLING_START"] == null || item["REBATE_BILLING_START"] == "" || item["REBATE_BILLING_START"] == "Invalid date") {
                item._behaviors.isError['REBATE_BILLING_START'] = true;
                item._behaviors.validMsg['REBATE_BILLING_START'] = "Start date is required";
                isShowStopperError = true;
            }

            if (item["REBATE_BILLING_END"] == undefined || item["REBATE_BILLING_END"] == null || item["REBATE_BILLING_END"] == "" || item["REBATE_BILLING_END"] == "Invalid date") {
                item._behaviors.isError['REBATE_BILLING_END'] = true;
                item._behaviors.validMsg['REBATE_BILLING_END'] = "End date is required";
                isShowStopperError = true;
            } 

            // Remove after validation error supressing rollback is corrected
            if (StaticMomentService.moment(item["REBATE_BILLING_START"]).isAfter(StaticMomentService.moment(item["START_DT"])) && item["PAYOUT_BASED_ON"].toUpperCase() === "CONSUMPTION") {
                item._behaviors.isError['REBATE_BILLING_START'] = true;
                item._behaviors.validMsg['REBATE_BILLING_START'] = "The Billing Start Date must be on or earlier than the Deal Start Date.";
                isShowStopperError = true;
            }

            if (item["END_CUSTOMER_RETAIL"] != undefined && item["END_CUSTOMER_RETAIL"] != null) { // && isTenderFlag == "1"
                if (item._behaviors.isError['END_CUSTOMER_RETAIL']) {
                    isShowStopperError = true;
                } else {
                    if (item._behaviors.isError['END_CUSTOMER_RETAIL']) {
                        delete item._behaviors.isError['END_CUSTOMER_RETAIL'];
                        delete item._behaviors.validMsg['END_CUSTOMER_RETAIL'];
                    }
                    item["END_CUSTOMER_RETAIL"] = item["END_CUSTOMER_RETAIL"].toString();
                }
            }

            if (item["REBATE_BILLING_START"] !== undefined && item["REBATE_BILLING_END"] !== undefined) {
                if(StaticMomentService.moment(item["REBATE_BILLING_START"], "MM/DD/YYYY").isValid() && StaticMomentService.moment(item["REBATE_BILLING_START"], "MM/DD/YYYY").isBefore(StaticMomentService.moment('1/1/1900',"MM/DD/YYYY"))){
                    item["REBATE_BILLING_START"]=contractData.START_DT;
                    isShowStopperError = true;
                }

                if(StaticMomentService.moment(item["REBATE_BILLING_END"], "MM/DD/YYYY").isValid() && StaticMomentService.moment(item["REBATE_BILLING_END"], "MM/DD/YYYY").isBefore(StaticMomentService.moment('1/1/1900',"MM/DD/YYYY"))){
                    item["REBATE_BILLING_END"]=contractData.END_DT;
                    isShowStopperError = true;
                }

                if (StaticMomentService.moment(item["REBATE_BILLING_START"], "MM/DD/YYYY").isValid() && StaticMomentService.moment(item["REBATE_BILLING_END"], "MM/DD/YYYY").isValid() && StaticMomentService.moment(item["REBATE_BILLING_START"]).isAfter(StaticMomentService.moment(item["REBATE_BILLING_END"]))) {
                    item._behaviors.isError['REBATE_BILLING_START'] = true;
                    item._behaviors.validMsg['REBATE_BILLING_START'] = "Billing Start date cannot be greater than the Billing End Date";
                    isShowStopperError = true;
                }
            }
             //this check added for consumption lockdown US twc3167-9409
            if((item.HAS_TRACKER == "1") && (item.PAYOUT_BASED_ON == "Consumption")){
                let iserror =DE_Validation_Util.valideConsumptionParams(item,oldDEData);
                if(iserror)
                    isShowStopperError = true;
            }

            if (curPricingStrategy.IS_HYBRID_PRC_STRAT == "1" || item["OBJ_SET_TYPE_CD"] == "FLEX") {
                let dictGroupTypeAcr = {};
                let dictGroupTypeDrn = {};
                let dictGroupType = {};

                //Calculating Accrual Line
                if (Object.keys(dictGroupTypeAcr).length == 0) {
                    data.map(function (data, index) {
                        if (data.FLEX_ROW_TYPE && data.FLEX_ROW_TYPE.toLowerCase() == 'accrual') {
                            dictGroupTypeAcr[data["DEAL_COMB_TYPE"]] = index;
                        }
                    });
                }

                //Calculating Draining Line
                if (Object.keys(dictGroupTypeDrn).length == 0) {
                    data.map(function (data, index) {
                        if (data.FLEX_ROW_TYPE && data.FLEX_ROW_TYPE.toLowerCase() == 'draining') {
                            dictGroupTypeDrn[data["DEAL_COMB_TYPE"]] = index;
                        }
                    });
                }                

                if (Object.keys(dictGroupTypeAcr).length > 1) {
                    if (item.FLEX_ROW_TYPE.toLowerCase() == 'accrual') {
                        item._behaviors.isError['DEAL_COMB_TYPE'] = true;
                        item._behaviors.validMsg['DEAL_COMB_TYPE'] = "All deals within Accrual should have the same 'Group Type' value";
                        isShowStopperError = true;
                    }
                }
                if (Object.keys(dictGroupTypeDrn).length > 1) {
                    if (item.FLEX_ROW_TYPE.toLowerCase() == 'draining') {
                        item._behaviors.isError['DEAL_COMB_TYPE'] = true;
                        item._behaviors.validMsg['DEAL_COMB_TYPE'] = "All deals within Draining should have the same 'Group Type' value";
                        isShowStopperError = true;
                    }
                }

                if (item["OBJ_SET_TYPE_CD"] == "FLEX") {
                    //Delete if there is any previous Error  messages
                    if ((invalidFlexDate || invalidFlexDate != undefined)) {
                        each(invalidFlexDate, (item) => {
                            item = PTE_Validation_Util.setFlexBehaviors(item, 'START_DT', 'invalidDate', restrictGroupFlexOverlap);
                            isShowStopperError = true;
                        });
                    }
                }

                if (curPricingStrategy.IS_HYBRID_PRC_STRAT == "1") {
                    data.map(function (data, index) {
                        dictGroupType[data["DEAL_COMB_TYPE"]] = index;
                    });

                    if (Object.keys(dictGroupType).length > 1) {
                        item._behaviors.isError['DEAL_COMB_TYPE'] = true;
                        item._behaviors.validMsg['DEAL_COMB_TYPE'] = "All deals within a PS should have the same 'Group Type' value";
                        isShowStopperError = true;
                    }
                }
            }

            if (item["OBJ_SET_TYPE_CD"] == "FLEX") {
                if ((invalidFlexDate || invalidFlexDate != undefined)) {
                    each(invalidFlexDate, (item) => {
                        if (!restrictGroupFlexOverlap) {
                            item = PTE_Validation_Util.setFlexBehaviors(item, 'START_DT', 'invalidDate', restrictGroupFlexOverlap);
                            isShowStopperError = true;
                        }
                    });
                }
                if (!isShowStopperError && item._behaviors && item._behaviors.isError && item._behaviors.isError.hasOwnProperty("PTR_USER_PRD")) {
                    isShowStopperError = true;
                }
            }

            if (!isShowStopperError) {
                if (item._behaviors.isError['MRKT_SEG'] || item._behaviors.isError['REBATE_OA_MAX_VOL'] ||
                    item._behaviors.isError['REBATE_OA_MAX_AMT'] || item._behaviors.isError['CONSUMPTION_TYPE'] ||
                    item._behaviors.isError['FLEX_ROW_TYPE'] || item._behaviors.isError['RESET_VOLS_ON_PERIOD'] ||
                    item._behaviors.isError['SETTLEMENT_PARTNER'] || item._behaviors.isError['AR_SETTLEMENT_LVL'] ||
                    item._behaviors.isError['REBATE_TYPE'] || item._behaviors.isError['PAYOUT_BASED_ON'] ||
                    item._behaviors.isError['CUST_ACCNT_DIV'] || item._behaviors.isError['GEO_COMBINED'] ||
                    item._behaviors.isError['PERIOD_PROFILE'] || item._behaviors.isError['PROGRAM_PAYMENT'] ||
                    item._behaviors.isError['START_DT'] || item._behaviors.isError['END_DT']) {
                    isShowStopperError = true;
                }

                for (var e = 0; e < Object.keys(item._behaviors.validMsg).length; e++) {
                    if (Object.keys(item._behaviors.validMsg)[e] !== "DC_ID" && PTE_Config_Util.hybridSaveBlockingColumns.indexOf(Object.keys(item._behaviors.validMsg)[e]) >= 0) {
                        isShowStopperError = true; break;
                    }
                }
            }
        });

        return isShowStopperError;
    }

    static valideFlexDuplicateProducts(data, curPricingTable) {

        if (curPricingTable.OBJ_SET_TYPE_CD != undefined && curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
            const duplicateFlexRows = PTE_Validation_Util.hasDuplicateProductPteLogic(data);
            let errDealsFlex = [0];
            for (let s = 0; s < data.length; s++) {
                if (duplicateFlexRows["duplicateProductDCIds"] !== undefined && (duplicateFlexRows['duplicateProductDCIds'])[data[s].DC_ID] !== undefined) errDealsFlex.push(s);
            }
            if (errDealsFlex.length > 0) {  // Flex Deals - Validate for duplicate products
                for (let t = 0; t < errDealsFlex.length; t++) {
                    const el = data[errDealsFlex[t]];
                    const splitProd = el.PTR_USER_PRD.split(',');
                    if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
                        //getting flex rowType values
                        for (let tmpProd = 0; tmpProd < data.length; tmpProd++) {
                            if (el.DC_ID != data[tmpProd].DC_ID) {
                                let compareFirstProduct1 = data[tmpProd].PTR_USER_PRD;
                                compareFirstProduct1 = compareFirstProduct1.split(',');

                                let productCompareAll = splitProd.filter((val) => {
                                    return compareFirstProduct1.includes(val)
                                });

                                if ((el.FLEX_ROW_TYPE == data[tmpProd].FLEX_ROW_TYPE) && (productCompareAll.length > 0)) {
                                    if ((StaticMomentService.moment(data[tmpProd].START_DT).isSameOrAfter(StaticMomentService.moment(el.START_DT)) &&
                                        StaticMomentService.moment(data[tmpProd].START_DT).isSameOrBefore(StaticMomentService.moment(el.END_DT))) ||
                                        ((StaticMomentService.moment(data[tmpProd].END_DT).isSameOrBefore(StaticMomentService.moment(el.END_DT))) &&
                                        (StaticMomentService.moment(data[tmpProd].END_DT).isSameOrAfter(StaticMomentService.moment(el.START_DT))))) {
                                        if ((duplicateFlexRows['duplicateProductDCIds'])[el.DC_ID] !== undefined) {
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
        }
    }

    static dataConversion(data, templates) {
        each(data, (item) => {
            if (item.QLTR_PROJECT != undefined && item.QLTR_PROJECT != null && item.QLTR_PROJECT != "")
                item.QLTR_PROJECT = item.QLTR_PROJECT.toUpperCase();
            if (Array.isArray(item.TRGT_RGN)) item.TRGT_RGN = item.TRGT_RGN.join();
            if (Array.isArray(item.QLTR_BID_GEO)) item.QLTR_BID_GEO = item.QLTR_BID_GEO.join();
            if (Array.isArray(item.DEAL_SOLD_TO_ID)) item.DEAL_SOLD_TO_ID = item.DEAL_SOLD_TO_ID.join();
            for (var key in templates) {
                if (templates.hasOwnProperty(key)) {
                    if (templates[key].type === "date") {
                        if (item[key] != undefined && item[key] != null && item[key] != "")
                            item[key] = StaticMomentService.moment(item[key]).format("MM/DD/YYYY");
                    }
                }
            }
            if (item["ON_ADD_DT"] !== undefined) item["ON_ADD_DT"] = StaticMomentService.moment(item["ON_ADD_DT"]).format("MM/DD/YYYY");
            if (item["REBATE_BILLING_START"] !== undefined) item["REBATE_BILLING_START"] = StaticMomentService.moment(item["REBATE_BILLING_START"]).format("MM/DD/YYYY");
            if (item["REBATE_BILLING_END"] !== undefined) item["REBATE_BILLING_END"] = StaticMomentService.moment(item["REBATE_BILLING_END"]).format("MM/DD/YYYY");
            if (item["LAST_REDEAL_DT"] !== undefined) item["LAST_REDEAL_DT"] = StaticMomentService.moment(item["LAST_REDEAL_DT"]).format("MM/DD/YYYY");
        });
    }
    static validateTenderDahsboardDeals(data, templates,groups,oldDEData) {
        let isShowStopperError = false;
        PTE_Validation_Util.validateBillingLookbakPeriod(data,groups);
        for (var i = 0; i < data.length; i++) {
            if (data[i]._dirty) {
                this.dataConversion(data, templates);
                
            }
            if ((data[i].WF_STG_CD.toString().toUpperCase() == "WON" || Object.keys(data[i].TRKR_NBR).length > 0)) {
                   
                if (data[i]._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD']) {
                    data[i]._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD'] = true;
                    data[i]._behaviors.validMsg['CONSUMPTION_LOOKBACK_PERIOD'] = "Consumption Lookback Period must be a whole number between 0 and 24.";
                    isShowStopperError = true;
                }
            }

            //this check added for consumption lockdown US twc3167-9409
            if (data[i].CONSUMPTION_COUNTRY_REGION != null && data[i].CONSUMPTION_COUNTRY_REGION != undefined && data[i].CONSUMPTION_COUNTRY_REGION != "") {
                if (data[i].CONSUMPTION_CUST_RPT_GEO != null && data[i].CONSUMPTION_CUST_RPT_GEO != undefined && data[i].CONSUMPTION_CUST_RPT_GEO != "") {
                    data[i]._behaviors.isError['CONSUMPTION_CUST_RPT_GEO'] = true;
                    data[i]._behaviors.validMsg['CONSUMPTION_CUST_RPT_GEO'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    data[i]._behaviors.isError['CONSUMPTION_COUNTRY_REGION'] = true;
                    data[i]._behaviors.validMsg['CONSUMPTION_COUNTRY_REGION'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    isShowStopperError = true;
                }
            }

            if (data[i]["START_DT"] == undefined || data[i]["START_DT"] == null || data[i]["START_DT"] == "" || data[i]["START_DT"] == "Invalid date") {
               // delete  data[i]._behaviors.isError["START_DT"];
               // delete  data[i]._behaviors.validMsg["START_DT"];
                data[i]._behaviors.isError['START_DT'] = true;
                data[i]._behaviors.validMsg['START_DT'] = "Start date is required";
                isShowStopperError = true;
            }

            if (data[i]["END_DT"] == undefined || data[i]["END_DT"] == null || data[i]["END_DT"] == "" || data[i]["END_DT"] == "Invalid date") {
                data[i]._behaviors.isError['END_DT'] = true;
                data[i]._behaviors.validMsg['END_DT'] = "End date is required";
                isShowStopperError = true;
            } 
            
            if (data[i]["REBATE_BILLING_START"] == undefined || data[i]["REBATE_BILLING_START"] == null || data[i]["REBATE_BILLING_START"] == "" || data[i]["REBATE_BILLING_START"] == "Invalid date") {
                data[i]._behaviors.isError['REBATE_BILLING_START'] = true;
                data[i]._behaviors.validMsg['REBATE_BILLING_START'] = "Start date is required";
                isShowStopperError = true;
            }

            if (data[i]["REBATE_BILLING_END"] == undefined || data[i]["REBATE_BILLING_END"] == null || data[i]["REBATE_BILLING_END"] == "" || data[i]["REBATE_BILLING_END"] == "Invalid date") {
                data[i]._behaviors.isError['REBATE_BILLING_END'] = true;
                data[i]._behaviors.validMsg['REBATE_BILLING_END'] = "End date is required";
                isShowStopperError = true;
            } 

            if((data[i].HAS_TRACKER == "1") && (data[i].PAYOUT_BASED_ON == "Consumption")){
                let iserror =DE_Validation_Util.valideConsumptionParams(data[i],oldDEData);
                if(iserror)
                    isShowStopperError = true;
            }
            if (data[i].PAYABLE_QUANTITY !== undefined && data[i].PAYABLE_QUANTITY != null && data[i].PAYABLE_QUANTITY != ""
                && data[i].VOLUME !== undefined && data[i].VOLUME != null && data[i].VOLUME != ""
            ) {
                const hasPayableQtyError = data[i].PAYABLE_QUANTITY > data[i].VOLUME;
                if (hasPayableQtyError) {
                    data[i]._behaviors.validMsg['PAYABLE_QUANTITY'] = "Payable Quantity cannot be greater than Ceiling Volume.\n";
                    data[i]._behaviors.isError['PAYABLE_QUANTITY'] = true;
                    isShowStopperError = true;
                }
            }
            
        }
        
        return isShowStopperError;
    }


    static valideConsumptionParams(item,oldDEData) {
        let iserror=false;
        if ((item.HAS_TRACKER == "1" && item._behaviors != undefined && item._behaviors.isDirty != undefined)
             && (item.PAYOUT_BASED_ON == "Consumption")) {
                each(item._behaviors.isDirty, (key,value) => {
                    let newlist=[];
                    let oldlist=[];
                    if (value == 'CONSUMPTION_CUST_PLATFORM') {
                         newlist = item.CONSUMPTION_CUST_PLATFORM.toString().split(',');
                         oldlist = oldDEData.find(x => x.DC_ID == item.DC_ID).CONSUMPTION_CUST_PLATFORM.toString().split(',');
                    }
                    else if (value == 'CONSUMPTION_SYS_CONFIG') {
                         newlist = item.CONSUMPTION_SYS_CONFIG.toString().split(',');
                         oldlist = oldDEData.find(x => x.DC_ID == item.DC_ID).CONSUMPTION_SYS_CONFIG.toString().split(',');
                    }
                    else if (value == 'CONSUMPTION_CUST_SEGMENT') {
                         newlist = item.CONSUMPTION_CUST_SEGMENT.toString().split(',');
                         oldlist = oldDEData.find(x => x.DC_ID == item.DC_ID).CONSUMPTION_CUST_SEGMENT.toString().split(',');
                    }
                    else if (value == 'CONSUMPTION_CUST_RPT_GEO') {
                         newlist = item.CONSUMPTION_CUST_RPT_GEO.toString().split(',');
                         oldlist = oldDEData.find(x => x.DC_ID == item.DC_ID).CONSUMPTION_CUST_RPT_GEO.toString().split(',');
                       let isValue=  newlist.every(el => el === '');
                       if(isValue){
                        if(item.CONSUMPTION_COUNTRY_REGION !=undefined && item.CONSUMPTION_COUNTRY_REGION!=null && item.CONSUMPTION_COUNTRY_REGION!=""){
                            if (item._behaviors.isError && !!item._behaviors.isError["CONSUMPTION_COUNTRY_REGION"])
                                delete item._behaviors.isError[value];
                            if (item._behaviors.validMsg && !!item._behaviors.validMsg["CONSUMPTION_COUNTRY_REGION"])
                              delete item._behaviors.validMsg[value];
                        }
                      }
                    }
                    else if (value == 'CONSUMPTION_COUNTRY_REGION') {
                         newlist = item.CONSUMPTION_COUNTRY_REGION.toString().split('|');
                         oldlist = oldDEData.find(x => x.DC_ID == item.DC_ID).CONSUMPTION_COUNTRY_REGION.toString().split('|');
                         let isValue=  newlist.every(el => el === '');
                       if(isValue){
                        if(item.CONSUMPTION_CUST_RPT_GEO !=undefined && item.CONSUMPTION_CUST_RPT_GEO!=null && item.CONSUMPTION_CUST_RPT_GEO!=""){
                            if (item._behaviors.isError && !!item._behaviors.isError["CONSUMPTION_CUST_RPT_GEO"])
                                delete item._behaviors.isError[value];
                            if (item._behaviors.validMsg && !!item._behaviors.validMsg["CONSUMPTION_CUST_RPT_GEO"])
                              delete item._behaviors.validMsg[value];
                        }
                      }
                    }
                    let isempty=oldlist.every(el => el === '');
                    if(!isempty)
                    {
                    
                     let isSubset = every(oldlist, (element) =>
                        {   return  contains(newlist, element);});
                       if(!isSubset)
                       {
                        iserror=true;
                        if (!item._behaviors.isError) item._behaviors.isError = {};
                        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
                        item._behaviors.isError[value] = true;
                           item._behaviors.validMsg[value] = "Can not remove existing consumption parameters after Tracker Number is generated";
                       }
                       else if(value== 'CONSUMPTION_COUNTRY_REGION' || value == 'CONSUMPTION_CUST_RPT_GEO' ||
                        value == 'CONSUMPTION_CUST_SEGMENT' || value == 'CONSUMPTION_SYS_CONFIG'||value == 'CONSUMPTION_CUST_PLATFORM')
                       {
                        if (item._behaviors.isError && !!item._behaviors.isError[value])
                            delete item._behaviors.isError[value];
                        if (item._behaviors.validMsg && !!item._behaviors.validMsg[value])
                          delete item._behaviors.validMsg[value];
                       }
                    }
                })                
            }

            return iserror;
    }

}