import { DE_Common_Util } from '../DEUtils/DE_Common_util';

export class PTE_Common_Util {
    static tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
    static densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
    static kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];
    static getFullNameOfProduct (item, prodName) {
        if (item.PRD_ATRB_SID > 7005) return prodName;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }
    static mapTieredWarnings (dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
        if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
            if (dataItem._behaviors.validMsg[atrbName] != null) {
                try {
                    var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                    if (dataItem.OBJ_SET_TYPE_CD === "KIT") {
                        if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                            dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                            dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                        }
                    }

                    if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                        dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                        dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                    } else {
                        delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                        delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                    }
                } catch (e) {

                }
            }
        }
    }
    static setWarningFields(data, curPricingTable) {
        var anyWarnings = false;
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;
            if (anyWarnings) {
                var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                var isKit = 0;
                var relevantAtrbs = curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY" ? this.densityTierAtrbs : this.tierAtrbs;
                var tierCount = dataItem.NUM_OF_TIERS;
                let curTier = 1, db = 1;
                if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                    if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                    dimStr = "_20___";
                    isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                    relevantAtrbs = this.kitDimAtrbs;
                    tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                }
                // map tiered warnings
                if (curPricingTable['OBJ_SET_TYPE_CD'] != "DENSITY") {
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);    //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
                else {
                    var densityCount = dataItem.NUM_OF_DENSITY;
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        if (db > densityCount) {
                            db = 1;
                            curTier++;
                        }
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            dimStr = (relevantAtrbs[a] == "DENSITY_RATE") ? "_8___" : "_10___";
                            if (relevantAtrbs[a] == "DENSITY_RATE") {
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + db + "____10___" + curTier), curTier);
                                db++;
                            }
                            else
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t); //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
            }
        }
    }
    static clearBadegCnt(groups) {
        DE_Common_Util.clearBadegCnt(groups);
    }
    static increaseBadgeCnt(key, groups, templates) {
        DE_Common_Util.increaseBadgeCnt(key, groups, templates);
    }
    static checkSoftWarnings(data, objSetTypeCd) {
        return DE_Common_Util.checkSoftWarnings(data, objSetTypeCd);
    }
    static clearEndCustomer(item) {
        if (item._behaviors && item._behaviors.isError && item._behaviors.isRequired && item._behaviors.validMsg) {
            delete item._behaviors.isError["END_CUSTOMER_RETAIL"];
            delete item._behaviors.validMsg["END_CUSTOMER_RETAIL"];
        }
        return item;
    }
    static setEndCustomer(item, dealType, curPricingTable) {
        if (!item._behaviors) item._behaviors = {};
        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
        if (!item._behaviors.isError) item._behaviors.isError = {};
        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
        if ((item.END_CUSTOMER_RETAIL != '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
            || ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") && item.REBATE_TYPE.toLowerCase() != "tender")) {//To show required error message
            item = this.clearEndCustomer(item);
            item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
            item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer Retail and End Customer Country/Region must be same for " + dealType + ".";
        }
        else if ((item.END_CUSTOMER_RETAIL == '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
            && ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "PROGRAM") && item.REBATE_TYPE.toLowerCase() == "tender")) {
            item = this.clearEndCustomer(item);
            item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
            item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer/Retail is required.";
        }
        return item;
    }
    static findInArray(input, id) {
        const len = input.length;
        for (let i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
    }
}