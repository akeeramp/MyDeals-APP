import * as angular from "angular";
import * as _ from 'underscore';
export class lnavUtil {

    static IsUniqueInList(listToCheck: any, value: any, keyToCompare: any, checkForDouble: boolean) {
        // Check unique name
        var count = 0;
        if (!listToCheck) return true;
        for (var i = 0; i < listToCheck.length; i++) {
            if (!!listToCheck[i][keyToCompare] && !!value && value.toLowerCase() === listToCheck[i][keyToCompare].toLowerCase()) { //!! is same as checking undefined
                if (checkForDouble) { // having one in he list is okay, but 2 is a no
                    count += 1;
                    if (count >= 2) {
                        return false;
                    }
                } else {
                    // not checking doubles, so any if there is any in the list, then return false
                    return false;
                }
            }
        }
        return true;
    }

    static defaultAttribs(newPricingTable, isTenderContract, contractData) {
        const dealType = newPricingTable.OBJ_SET_TYPE_CD;
        const marketSegment = (isTenderContract) ? "Corp" : "All Direct Market Segments";

        if (newPricingTable["_defaultAtrbs"].REBATE_TYPE) newPricingTable["_defaultAtrbs"].REBATE_TYPE.value = isTenderContract ? "TENDER" : "MCP";
        if (newPricingTable["_defaultAtrbs"].MRKT_SEG) newPricingTable["_defaultAtrbs"].MRKT_SEG.value = marketSegment;
        if (newPricingTable["_defaultAtrbs"].GEO_COMBINED) newPricingTable["_defaultAtrbs"].GEO_COMBINED.value = ["Worldwide"];
        if (newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON) dealType == 'FLEX' || dealType == 'REV_TIER' || dealType == 'DENSITY' ? newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Billings" : newPricingTable["_defaultAtrbs"].PAYOUT_BASED_ON.value = "Consumption";
        if (newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT) newPricingTable["_defaultAtrbs"].PROGRAM_PAYMENT.value = "Backend";
        if (newPricingTable["_defaultAtrbs"].PROD_INCLDS) newPricingTable["_defaultAtrbs"].PROD_INCLDS.value = "Tray";
        if (newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE) newPricingTable["_defaultAtrbs"].FLEX_ROW_TYPE.value = "Accrual";
        if (newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        if (!isTenderContract && dealType != "KIT") {

            if (newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE && dealType != 'KIT') newPricingTable["_defaultAtrbs"].SERVER_DEAL_TYPE.value = "";
        }

        if (newPricingTable["_defaultAtrbs"].NUM_OF_TIERS) newPricingTable["_defaultAtrbs"].NUM_OF_TIERS.value = "1";
        if (newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY) newPricingTable["_defaultAtrbs"].NUM_OF_DENSITY.value = "1";
        if (isTenderContract) { // Tenders come in without a customer defined immediately
            // Tenders don't have a customer at this point, Default to blank for customer defaults and let pricingTable.Controller.js handle tender defaults
            if (newPricingTable["_defaultAtrbs"].PERIOD_PROFILE) newPricingTable["_defaultAtrbs"].PERIOD_PROFILE.value = "Yearly";
            if (newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL) newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL.value = ""; // Old value "Issue Credit to Billing Sold To"
        }
        else {
            if (newPricingTable["_defaultAtrbs"].PERIOD_PROFILE) newPricingTable["_defaultAtrbs"].PERIOD_PROFILE.value =
                (contractData.Customer == undefined) ? "" : contractData.Customer.DFLT_PERD_PRFL;
            if (newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL) {
                // Set AR_SETTLEMENT_LVL to customer default first, and if that is blank, then fall back on deal level rules
                let newArSettlementValue = (contractData.Customer == undefined) ? "" : contractData.Customer.DFLT_AR_SETL_LVL;
                if (contractData.Customer.DFLT_AR_SETL_LVL == "User Select on Deal Creation") { // If this is cust default, force it blank
                    newArSettlementValue = "";
                } else {
                    if (newArSettlementValue == "")
                        newArSettlementValue = (dealType == "ECAP" ||
                            dealType == "KIT")
                            ? "Issue Credit to Billing Sold To"
                            : "Issue Credit to Default Sold To by Region";
                }
                newPricingTable["_defaultAtrbs"].AR_SETTLEMENT_LVL.value = newArSettlementValue;
            }
        }
        if (newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL) newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_VOL.value = "";
        if (newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT) newPricingTable["_defaultAtrbs"].REBATE_OA_MAX_AMT.value = "";
        return newPricingTable;
    }

    static updateNPTDefaultValues(pt, nptDefaults) {
        //note: copy pasted from the watch function far below, slight modifications, can probably be compressed to 1 function call for re-usability?
        if (!!nptDefaults["REBATE_TYPE"]) nptDefaults["REBATE_TYPE"].value = pt["REBATE_TYPE"];
        if (!!nptDefaults["MRKT_SEG"]) nptDefaults["MRKT_SEG"].value = pt["MRKT_SEG"].split(',');
        if (!!nptDefaults["GEO_COMBINED"]) {
            if (pt["GEO_COMBINED"].indexOf('[') > -1) {
                nptDefaults["GEO_COMBINED"].value = pt["GEO_COMBINED"];
            } else {
                nptDefaults["GEO_COMBINED"].value = pt["GEO_COMBINED"].split(',');
            }
        }
        if (!!nptDefaults["PAYOUT_BASED_ON"]) nptDefaults["PAYOUT_BASED_ON"].value = pt["PAYOUT_BASED_ON"];
        if (!!nptDefaults["PROGRAM_PAYMENT"]) nptDefaults["PROGRAM_PAYMENT"].value = pt["PROGRAM_PAYMENT"];
        if (!!nptDefaults["PROD_INCLDS"]) nptDefaults["PROD_INCLDS"].value = pt["PROD_INCLDS"];
        if (!!nptDefaults["NUM_OF_TIERS"]) nptDefaults["NUM_OF_TIERS"].value = pt["NUM_OF_TIERS"];
        if (!!nptDefaults["NUM_OF_DENSITY"]) nptDefaults["NUM_OF_DENSITY"].value = pt["NUM_OF_DENSITY"];
        if (!!nptDefaults["SERVER_DEAL_TYPE"]) nptDefaults["SERVER_DEAL_TYPE"].value = pt["SERVER_DEAL_TYPE"];
        if (!!nptDefaults["PERIOD_PROFILE"]) nptDefaults["PERIOD_PROFILE"].value = pt["PERIOD_PROFILE"];
        if (!!nptDefaults["AR_SETTLEMENT_LVL"]) nptDefaults["AR_SETTLEMENT_LVL"].value = pt["AR_SETTLEMENT_LVL"];
        if (!!nptDefaults["REBATE_OA_MAX_VOL"]) nptDefaults["REBATE_OA_MAX_VOL"].value = pt["REBATE_OA_MAX_VOL"];
        if (!!nptDefaults["REBATE_OA_MAX_AMT"]) nptDefaults["REBATE_OA_MAX_AMT"].value = pt["REBATE_OA_MAX_AMT"];
        if (!!nptDefaults["FLEX_ROW_TYPE"]) nptDefaults["FLEX_ROW_TYPE"].value = pt["FLEX_ROW_TYPE"];
        //not sure if necessary, javascript pass by value/reference always throwing me off. :(
        return nptDefaults;
    }

    static getTenderBasedDefaults(newPricingTable, isTenderContract) {
        var data = newPricingTable["_defaultAtrbs"];
        if (isTenderContract) {
            data["REBATE_TYPE"].opLookupUrl = data["REBATE_TYPE"].opLookupUrl
                .replace("GetDropdowns/REBATE_TYPE", "GetFilteredRebateTypes/true");
        } else {
            data["REBATE_TYPE"].opLookupUrl = data["REBATE_TYPE"].opLookupUrl
                .replace("GetDropdowns/REBATE_TYPE", "GetFilteredRebateTypes/false");
        }
        return data;
    }

    static enableFlowBtn(contractData) {
        if (contractData.PRC_ST === undefined || contractData.PRC_ST.length === 0) return false;
        var passedItems = [];
        for (var ps = 0; ps < contractData.PRC_ST.length; ps++) {
            var psItem = contractData.PRC_ST[ps];
            if (psItem.PRC_TBL !== undefined) {
                for (var pt = 0; pt < psItem.PRC_TBL.length; pt++) {
                    if (psItem.PRC_TBL[pt].PASSED_VALIDATION === "Complete") {
                        passedItems.push(psItem.PRC_TBL[pt]);
                    }
                }
            }
        }
        return passedItems.length > 0;
    }

    static filterDealTypes(UItemplate, isHybrid) {
        let result = {};
        let dealDisplayOrder = [];
        if (isHybrid) {
            dealDisplayOrder = ["ECAP", "VOL_TIER"];
        } else {
            dealDisplayOrder = ["ECAP", "VOL_TIER", "PROGRAM", "FLEX", "DENSITY", "REV_TIER", "KIT"];
        }
        const items = UItemplate["ModelTemplates"].PRC_TBL;
        _.each(items, function (value, key) {
            if (value.name !== 'ALL_TYPES' && value.name !== 'TENDER') {
                value._custom = {
                    "ltr": value.name[0],
                    "_active": false
                };
                result[key] = value;
            }
        });
        result = dealDisplayOrder.map((object) => result[object]).filter(obj => obj !== undefined);
        return result;
    }

}

