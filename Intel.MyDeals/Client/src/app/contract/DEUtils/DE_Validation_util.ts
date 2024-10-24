import { each } from 'underscore';
import { StaticMomentService } from "../../shared/moment/moment.service";
import { PTE_Validation_Util } from '../PTEUtils/PTE_Validation_util';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';

export class DE_Validation_Util {

    static validateWipDeals(data, curPricingStrategy, curPricingTable, contractData, isTenderContract, lookBackPeriod, templates) {
        let restrictGroupFlexOverlap = false;
        each(data, (item) => {
            PTE_Common_Util.setBehaviors(item);
        });
        this.dataConversion(data, templates);
        PTE_Validation_Util.validateFlexRules(data, curPricingTable, data, restrictGroupFlexOverlap);
        PTE_Validation_Util.validateFlexOverlapRules(data, curPricingTable, data);
        PTE_Validation_Util.ValidateEndCustomer(data, 'OnValidate', curPricingStrategy, curPricingTable);
        PTE_Validation_Util.validateSettlementPartner(data, curPricingStrategy);
        PTE_Validation_Util.validateOverArching(data, curPricingStrategy, curPricingTable);
        data = PTE_Validation_Util.validateHybridFields(data, curPricingStrategy, curPricingTable);
        data = PTE_Validation_Util.validateHybridProducts(data, curPricingStrategy);
        PTE_Validation_Util.validateSettlementLevel(data, curPricingStrategy);
        PTE_Validation_Util.validateFlexRowType(data, curPricingStrategy, curPricingTable, data, undefined, restrictGroupFlexOverlap);
        PTE_Validation_Util.validateMarketSegment(data, data, undefined);
        return this.ValidateDealData(data, curPricingTable, curPricingStrategy, contractData, lookBackPeriod, isTenderContract, restrictGroupFlexOverlap);
    }

    static ValidateDealData(data, curPricingTable, curPricingStrategy, contractData, lookBackPeriod, isTenderContract, restrictGroupFlexOverlap) {
        var isShowStopperError = false;

        if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
            var invalidFlexDate = PTE_Validation_Util.validateFlexDate(data, curPricingTable, data);
            if ((invalidFlexDate || invalidFlexDate != undefined)) {
                each(invalidFlexDate, (item) => {
                    if (!restrictGroupFlexOverlap) {
                        item = PTE_Validation_Util.setFlexBehaviors(item, 'START_DT', 'invalidDate', restrictGroupFlexOverlap);
                        isShowStopperError = true;
                    }
                });
            }
        }

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

            if (item.CONSUMPTION_COUNTRY_REGION != null && item.CONSUMPTION_COUNTRY_REGION != undefined && item.CONSUMPTION_COUNTRY_REGION != "") {
                if (item.CONSUMPTION_CUST_RPT_GEO != null && item.CONSUMPTION_CUST_RPT_GEO != undefined && item.CONSUMPTION_CUST_RPT_GEO != "") {
                    item._behaviors.isError['CONSUMPTION_CUST_RPT_GEO'] = true;
                    item._behaviors.validMsg['CONSUMPTION_CUST_RPT_GEO'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    item._behaviors.isError['CONSUMPTION_COUNTRY_REGION'] = true;
                    item._behaviors.validMsg['CONSUMPTION_COUNTRY_REGION'] = "Please enter a value in either Customer Reported Sales Geo or Consumption Country/Region, but not both";
                    isShowStopperError = true;
                }
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
                if (!isShowStopperError && item._behaviors && item._behaviors.isError && item._behaviors.isError.hasOwnProperty("START_DT")) {
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
    static validateTenderDahsboardDeals(data, templates) {
        let isShowStopperError = false;
        for (var i = 0; i < data.length; i++) {
            if (data[i]._dirty) {
                this.dataConversion(data, templates);
                
            }
        }
        return isShowStopperError;
    }

}