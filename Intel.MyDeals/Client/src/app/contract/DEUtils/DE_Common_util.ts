import { PTE_Load_Util } from "../PTEUtils/PTE_Load_util";

export class DE_Common_Util {
    static clearBadegCnt(groups): void {
        for (var g = 0; g < groups.length; g++) {
            groups[g].numErrors = 0;
        }
    }
    static increaseBadgeCnt(key, groups, templates): void {
        if (templates[key] === undefined) return;
        for (var i = 0; i < templates[key].Groups.length; i++) {
            for (var g = 0; g < groups.length; g++) {
                if (groups[g].name === templates[key].Groups[i] || groups[g].name === "All") {
                    groups[g].numErrors++;
                }
            }
        }
    }
    static checkSoftWarnings(gridResult, curPricingTable): number {
        var numSoftWarn = 0;
        if (curPricingTable.OBJ_SET_TYPE_CD == "ECAP" || curPricingTable.OBJ_SET_TYPE_CD == "KIT") {
            for (var w = 0; w < gridResult.length; w++) {
                if (!!gridResult[w]["CAP"]) {
                    if (gridResult[w]["CAP"]["20___0"] === "No CAP") {
                        numSoftWarn++;
                    }
                    var numOfPivot = PTE_Load_Util.numOfPivot(gridResult[w], curPricingTable);
                    for (var i = 0; i < numOfPivot; i++) {
                        let dim = "20___" + i;
                        var cap = parseFloat(gridResult[w]["CAP"][dim]);
                        var ecap = parseFloat(gridResult[w]["ECAP_PRICE"][dim]);
                        if (ecap > cap) {
                            numSoftWarn++;
                        }
                    }
                }
                gridResult[w]._behaviors.isReadOnly["TOTAL_CR_DB_PERC"] = true;
            }
        }
        return numSoftWarn;
    }
    static showBool = function (val) {
        return val === "1" ? "Yes" : " ";
    }

    static parseCellValues(field, dataItem) {
        if (field == "ECAP_PRICE" && dataItem.OBJ_SET_TYPE_CD == "ECAP")
            dataItem["ECAP_PRICE"]["20___0"] = parseInt(dataItem["ECAP_PRICE"]["20___0"] || 0);
        if (field == "KIT_ECAP")
            dataItem["ECAP_PRICE"]["20_____1"] = parseInt(dataItem["ECAP_PRICE"]["20_____1"] || 0);
        if (field == "VOLUME" || field == "FRCST_VOL" || field == "CONSUMPTION_LOOKBACK_PERIOD" || field == "REBATE_OA_MAX_VOL") {
            if (dataItem[field] != undefined && dataItem[field] != null)
                dataItem[field] = parseInt(dataItem[field] || 0);
        }
        if (field == "USER_MAX_RPU" || field == "USER_AVG_RPU" || field == "TOTAL_DOLLAR_AMOUNT" || field == "ADJ_ECAP_UNIT"
            || field == "MAX_PAYOUT" || field == "REBATE_OA_MAX_AMT") {
            if (dataItem[field] != undefined && dataItem[field] != null)
                dataItem[field] = parseFloat(dataItem[field] || 0);
        }
        if (field == "REBATE_BILLING_START" || field == "REBATE_BILLING_END"
            || field == "START_DT" || field == "LAST_REDEAL_DT" || field == "END_DT"
            || field == "OEM_PLTFRM_LNCH_DT" || field == "OEM_PLTFRM_EOL_DT" || field == "ON_ADD_DT") {
            if (dataItem[field] != undefined && dataItem[field] != null && dataItem[field] != "" && dataItem[field] != "Invalid date")
                dataItem[field] = new Date(dataItem[field]);
            else if (dataItem[field] == "Invalid date")
                dataItem[field] = "";
        }
        if (field == "TIER_NBR") {
            var tiers = dataItem.TIER_NBR;
            for (var key in tiers) {
                if (dataItem.OBJ_SET_TYPE_CD === 'VOL_TIER' || dataItem.OBJ_SET_TYPE_CD === 'FLEX') {
                    if (!Number.isNaN(Number(dataItem["STRT_VOL"][key])))
                        dataItem["STRT_VOL"][key] = parseInt(dataItem["STRT_VOL"][key] || 0);
                    if (!Number.isNaN(Number(dataItem["END_VOL"][key])))
                        dataItem["END_VOL"][key] = parseInt(dataItem["END_VOL"][key] || 0);
                    dataItem["RATE"][key] = parseFloat(dataItem["RATE"][key] || 0);
                }
                else if (dataItem.OBJ_SET_TYPE_CD === 'REV_TIER') {
                    if (!Number.isNaN(Number(dataItem["STRT_REV"][key])))
                        dataItem["STRT_REV"][key] = parseFloat(dataItem["STRT_REV"][key] || 0);
                    if (!Number.isNaN(Number(dataItem["END_REV"][key])))
                        dataItem["END_REV"][key] = parseFloat(dataItem["END_REV"][key] || 0);
                    dataItem["INCENTIVE_RATE"][key] = parseFloat(dataItem["INCENTIVE_RATE"][key] || 0);
                }
                else if (dataItem.OBJ_SET_TYPE_CD === 'DENSITY') {
                    for (var i = 0; i < dataItem["NUM_OF_DENSITY"]; i++) {
                        dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key] = parseFloat(dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key] || 0);
                    }
                    if (!Number.isNaN(Number(dataItem["STRT_PB"][key])))
                        dataItem["STRT_PB"][key] = parseFloat(dataItem["STRT_PB"][key] || 0);
                    if (!Number.isNaN(Number(dataItem["END_PB"][key])))
                        dataItem["END_PB"][key] = parseFloat(dataItem["END_PB"][key] || 0);
                }
            }
        }
        if ((field == "ECAP_PRICE" || field == "DSCNT_PER_LN") && dataItem.OBJ_SET_TYPE_CD == "KIT") {
            var tiers = dataItem[field];
            for (var key in tiers) {
                dataItem[field][key] = parseInt(dataItem[field][key] || 0);
            }
        }
        if (field == "QLTR_BID_GEO" && dataItem[field] != undefined && dataItem[field] != null && dataItem[field] != "") {
            dataItem[field] = dataItem[field].split(",").map(function (item) {
                return item.trim();
            });
        }
    }

    static cellCloseValues(field, dataItem) {
        if (field == "ECAP_PRICE" && dataItem.OBJ_SET_TYPE_CD == "ECAP") {
            if (dataItem["ECAP_PRICE"]["20___0"] != undefined && dataItem["ECAP_PRICE"]["20___0"] != null && dataItem["ECAP_PRICE"]["20___0"] != "")
                dataItem["ECAP_PRICE"]["20___0"] = dataItem["ECAP_PRICE"]["20___0"].toString();
            else
                dataItem["ECAP_PRICE"]["20___0"] = "0";
        }
        if (field == "KIT_ECAP") {
            if (dataItem["ECAP_PRICE"]["20_____1"] != undefined && dataItem["ECAP_PRICE"]["20_____1"] != null && dataItem["ECAP_PRICE"]["20_____1"] != "")
                dataItem["ECAP_PRICE"]["20_____1"] = dataItem["ECAP_PRICE"]["20_____1"].toString();
            else
                dataItem["ECAP_PRICE"]["20_____1"] = "0";
        }
        if (field == "VOLUME" || field == "FRCST_VOL" || field == "CONSUMPTION_LOOKBACK_PERIOD" || field == "REBATE_OA_MAX_VOL" ||
            field == "USER_MAX_RPU" || field == "USER_AVG_RPU" || field == "TOTAL_DOLLAR_AMOUNT" || field == "ADJ_ECAP_UNIT"
            || field == "MAX_PAYOUT" || field == "REBATE_OA_MAX_AMT") {
            if (dataItem[field] != undefined && dataItem[field] != null && dataItem[field] != "")
                dataItem[field] = dataItem[field].toString();
            else if (dataItem[field] == 0)
                dataItem[field] = "0";
            else
                dataItem[field] = "";
        }      
        if (field == "TIER_NBR") {
            var tiers = dataItem.TIER_NBR;
            for (var key in tiers) {
                if (dataItem.OBJ_SET_TYPE_CD === 'VOL_TIER' || dataItem.OBJ_SET_TYPE_CD === 'FLEX') {
                    if (!Number.isNaN(Number(dataItem["STRT_VOL"][key])))
                        dataItem["STRT_VOL"][key] = dataItem["STRT_VOL"][key].toString();
                    if (!Number.isNaN(Number(dataItem["END_VOL"][key])))
                        dataItem["END_VOL"][key] = dataItem["END_VOL"][key].toString();
                    dataItem["RATE"][key] = dataItem["RATE"][key].toString();
                }
                else if (dataItem.OBJ_SET_TYPE_CD === 'REV_TIER') {
                    if (!Number.isNaN(Number(dataItem["STRT_REV"][key])))
                        dataItem["STRT_REV"][key] = dataItem["STRT_REV"][key].toString();
                    if (!Number.isNaN(Number(dataItem["END_REV"][key])))
                        dataItem["END_REV"][key] = dataItem["END_REV"][key].toString();
                    dataItem["INCENTIVE_RATE"][key] = dataItem["INCENTIVE_RATE"][key].toString();
                }
                else if (dataItem.OBJ_SET_TYPE_CD === 'DENSITY') {
                    for (var i = 0; i < dataItem["NUM_OF_DENSITY"]; i++) {
                        dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key] = dataItem["DENSITY_RATE"]["8___" + (i + 1) + "____" + key].toString();
                    }
                    if (!Number.isNaN(Number(dataItem["STRT_PB"][key])))
                        dataItem["STRT_PB"][key] = dataItem["STRT_PB"][key].toString();
                    if (!Number.isNaN(Number(dataItem["END_PB"][key])))
                        dataItem["END_PB"][key] = dataItem["END_PB"][key].toString();
                }
            }
        }
        if ((field == "ECAP_PRICE" || field == "DSCNT_PER_LN") && dataItem.OBJ_SET_TYPE_CD == "KIT") {
            var tiers = dataItem[field];
            for (var key in tiers) {
                dataItem[field][key] = dataItem[field][key].toString();
            }
        }
    }
}