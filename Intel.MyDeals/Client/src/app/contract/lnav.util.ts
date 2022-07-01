import * as angular from "angular";

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

    static filterDealTypes(UItemplate) {
        let result = {};
        const dealDisplayOrder = ["ECAP", "VOL_TIER", "PROGRAM", "FLEX", "DENSITY", "REV_TIER", "KIT"];
        const items = UItemplate["ModelTemplates"].PRC_TBL;
        angular.forEach(items, function (value, key) {
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

