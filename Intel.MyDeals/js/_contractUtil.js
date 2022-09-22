function contractutil() { }
//1
contractutil.compress = function (data) {
    return data;
    if (!data || data === "" || data[0] !== "{") return data;
    return LZString.compressToBase64(data);
}
//2
contractutil.uncompress = function (data) {
    //return data;
    if (!data || data === "" || data[0] === "{") return data;
    return LZString.decompressFromBase64(data);
}
//3
contractutil.compressJson = function (data) {
    if (!data.PricingTableRow) return;
    for (var d = 0; d < data.PricingTableRow.length; d++) {
        data.PricingTableRow[d].PTR_SYS_PRD = contractutil.compress(data.PricingTableRow[d].PTR_SYS_PRD);
        data.PricingTableRow[d].PTR_SYS_INVLD_PRD = contractutil.compress(data.PricingTableRow[d].PTR_SYS_INVLD_PRD);
    }
    return data;
}
//4
contractutil.checkForMessages = function (collection, key, data) {
    var isValid = true;
    if (data.data[key] !== undefined) {
        for (var i = 0; i < data.data[key].length; i++) {
            if (data.data[key][i].DC_ID !== undefined &&
                data.data[key][i].DC_ID === collection.DC_ID &&
                data.data[key][i].warningMessages.length > 0) {
                angular.forEach(data.data[key][i]._behaviors.validMsg,
                    function (value, key) {
                        collection._behaviors.validMsg[key] = value;
                        collection._behaviors.isError[key] = value !== "";
                        isValid = false;
                    });
            }
        }
    }
    // TODO: Consolidate all the messages warning and errors show in the Validation summary panel ??
    return isValid;
}
//5
contractutil.getTenderBasedDefaults = function (newPricingTable, isTenderContract) {
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
//6
contractutil.updateNPTDefaultValues = function (pt, nptDefaults) {
    //note: copy pasted from the watch function far below, slight modifications, can probably be compressed to 1 function call for re-usability?
    if (!!nptDefaults["REBATE_TYPE"]) nptDefaults["REBATE_TYPE"].value = pt["REBATE_TYPE"];
    if (!!nptDefaults["MRKT_SEG"]) nptDefaults["MRKT_SEG"].value = pt["MRKT_SEG"].split(',');
    if (!!nptDefaults["GEO"]) {
        if (pt["GEO"].indexOf('[') > -1) {
            nptDefaults["GEO"].value = pt["GEO"];
        } else {
            nptDefaults["GEO"].value = pt["GEO"].split(',');
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
//7
contractutil.removeCleanItems = function (data, delPtr) {
    if (data.Contract === undefined) data.Contract = [];
    if (data.PricingStrategy === undefined) data.PricingStrategy = [];
    if (data.PricingTable === undefined) data.PricingTable = [];
    if (data.PricingTableRow === undefined) data.PricingTableRow = [];
    if (data.WipDeals === undefined) data.WipDeals = [];
    if (!!data.PricingTableRow && !!delPtr && delPtr.length > 0) {
        data.PricingTableRow = data.PricingTableRow.filter(function (a) { return delPtr.indexOf(a.DC_ID) });
    }
    // for now... performance changes are breaking delete and translate
    return false;
    if (!!data.EventSource && data.EventSource === "WIP_DEAL") {
        return (
            data.Contract.length === 0 &&
            data.PricingStrategy.length === 0 &&
            data.PricingTableRow.length === 0 &&
            data.WipDeals.length === 0);
    }
    return false;
}
//8
contractutil.validateCustomerDivision = function (dictCustDivision, baseCustDiv, custDiv) {
    if (baseCustDiv != null && custDiv != null) {
        if (Object.keys(dictCustDivision).length == 1 && baseCustDiv.indexOf("/") !== -1 && custDiv.indexOf("/") !== -1
            && baseCustDiv.split("/").length == custDiv.split("/").length) {
            var divs = custDiv.split("/");
            for (var z = 0; z < divs.length; z++) {
                if (baseCustDiv.indexOf(divs[z]) == -1) {
                    return false;
                }
            }
            return true;
        }
        else { return false }
    }
    else {
        return false;
    }
}
//9
contractutil.arrBiDirectionalDifference = function (arr1, arr2) {
    let difference1 = arr1.filter(x => arr2.indexOf(x) === -1);
    let difference2 = arr2.filter(x => arr1.indexOf(x) === -1);
    let difference = difference1.concat(difference2).sort((x, y) => x - y);
    return difference;
}
//10
contractutil.IsUniqueInList = function (listToCheck, value, keyToCompare, checkForDouble) {
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
//11
contractutil.ApplyTitlesToChildren = function (contractData) {
    if (!!contractData.PRC_ST) {
        for (var x = 0; x < contractData.PRC_ST.length; x++) {
            var prnt = contractData.PRC_ST[x];
            if (!!prnt._behaviors && !!prnt._behaviors.isReadOnly && !!prnt._behaviors.isReadOnly.TITLE) {
                if (!!prnt.PRC_TBL) {
                    for (var c = 0; c < prnt.PRC_TBL.length; c++) {
                        var child = prnt.PRC_TBL[c];
                        if (!child._behaviors) child._behaviors = {};
                        if (!child._behaviors.isReadOnly) child._behaviors.isReadOnly = {};
                        child._behaviors.isReadOnly.TITLE = prnt._behaviors.isReadOnly.TITLE;
                    }
                }
            }
        }
    }
    return contractData;
}
//12
contractutil.calculateKitRebate = function (data, firstTierRowIndex, numOfTiers, isDataPivoted) {
    var kitRebateTotalVal = 0;
    for (var i = 0; i < numOfTiers; i++) {
        if (isDataPivoted) {
            var qty = (parseFloat(data[firstTierRowIndex]["QTY_____20___" + i]) || 0);
            kitRebateTotalVal += (qty * parseFloat(data[firstTierRowIndex]["ECAP_PRICE_____20___" + i]) || 0);
        } else if (i < data.length) {
            var qty = (parseFloat(data[(firstTierRowIndex + i)]["QTY"]) || 0);
            kitRebateTotalVal += (qty * parseFloat(data[(firstTierRowIndex + i)]["ECAP_PRICE"]) || 0);
        }
    }
    var rebateVal = (kitRebateTotalVal - parseFloat(data[firstTierRowIndex]["ECAP_PRICE_____20_____1"])) // Kit rebate - KIT ECAP (tier of "-1")
    return rebateVal;
}
//13
contractutil.calculateTotalDsctPerLine = function (dscntPerLine, qty) {
    return (parseFloat(dscntPerLine) * parseInt(qty) || 0);
}
//14
contractutil.keyContractItemchanged = function (oldValue, newValue, DC_ID) {
    function purgeBehaviors(lData) {
        var remItems = [
            "IsAttachmentRequired", "MinYear", "MaxYear", "END_QTR", "END_YR", "START_QTR", "START_YR",
            "AttachmentError", "displayTitle", "CUST_ACCNT_DIV_UI", "PASSED_VALIDATION"
        ];
        var remItemsIfNoId = ["C2A_DATA_C2A_ID"];
        lData._behaviors = {};
        lData._actions = {};
        lData._settings = {};
        lData.infoMessages = [];
        lData.warningMessages = [];
        lData._dirty = {};
        for (var d = 0; d < remItems.length; d++) {
            lData[remItems[d]] = "";
        }
        if (DC_ID < 0) {
            for (var d = 0; d < remItemsIfNoId.length; d++) {
                lData[remItemsIfNoId[d]] = "";
            }
        }
        if (!!lData.PRC_ST) {
            for (var s = 0; s < lData.PRC_ST.length; s++) {
                var item = lData.PRC_ST[s];
                item._behaviors = {};
                item._actions = {};
                item._settings = {};
                item.infoMessages = [];
                item.warningMessages = [];
                item.PASSED_VALIDATION = "";
                if (!!item.PRC_TBL) {
                    for (var t = 0; t < item.PRC_TBL.length; t++) {
                        item.PRC_TBL[t]._behaviors = {};
                        item.PRC_TBL[t]._behaviors = {};
                        item.PRC_TBL[t]._actions = {};
                        item.PRC_TBL[t]._settings = {};
                        item.PRC_TBL[t].infoMessages = [];
                        item.PRC_TBL[t].warningMessages = [];
                        item.PRC_TBL[t].PASSED_VALIDATION = "";
                    }
                }
            }
        }
        var str = kendo.stringify(lData).replace(',"undefined":[]', '');
        for (var d = 0; d < remItems.length; d++) {
            var find = ',"' + remItems[d] + '":""';
            var regex = new RegExp(find, "g");
            str = str.replace(regex, "");
        }
        return str;
    }
    var rtn = purgeBehaviors(util.deepClone(oldValue)) !== purgeBehaviors(util.deepClone(newValue));
    //if (rtn) debugger;
    return rtn;
}
//15
contractutil.isPivotable = function (curPricingTable) {
    if (!curPricingTable) return false;
    if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" ||
        curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
        var pivotFieldName = "NUM_OF_TIERS";
        return !!curPricingTable[pivotFieldName];        //For code review - Note: is this redundant?  can't we just have VT and KIT always return true?  VT will always have a num of tiers.  If actually not redundant then we need to do similar for KIT deal type
    }
    if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
        return true;
    }
}
//16
// If Tender and ECAP get the CAP value from Product JSON, if more than one product assign CAP, YCS2 value of first product only.
contractutil.assignProductProprties = function (data, isTenderContract, curPricingTable) {
    if (isTenderContract && curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") {
        for (var d = 0; d < data.length; d++) {

            if (angular.equals(data[d], {}) || data[d]["PTR_SYS_PRD"] === "" || data[d]["PTR_USER_PRD"] === null || typeof (data[d]["PTR_USER_PRD"]) == 'undefined') continue;;

            // product JSON
            var productJSON = JSON.parse(data[d]["PTR_SYS_PRD"]);
            var sysProduct = [];

            var productArray = [];
            for (var key in productJSON) {
                if (productJSON.hasOwnProperty(key)) {
                    angular.forEach(productJSON[key], function (item) {
                        sysProduct.push(item);
                    });
                }
            }
            // Take the first product
            var contractProduct = data[d]["PTR_USER_PRD"].split(',')[0];
            sysProduct = sysProduct.filter(function (x) {
                return x.USR_INPUT === contractProduct || x.HIER_VAL_NM === contractProduct;
            });

            data[d]["CAP"] = sysProduct.length !== 0 ? sysProduct[0]["CAP"] : "";
            data[d]["YCS2"] = sysProduct.length !== 0 ? sysProduct[0]["YCS2"] : "";
        }
    }
    return data;
}
//17
contractutil.setToSame = function (data, elem) {
    angular.forEach(data, (item) => {
        if (item[elem] != undefined && (item[elem] == null || item[elem] == '')) {
            item[elem] = null;
        }
    });
    return data;
}
//18
//helper function for clear and set behaviors
contractutil.clearValidation = function (data, elem) {
    angular.forEach(data, (item) => {
        if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
            delete item._behaviors.isRequired[elem];
            delete item._behaviors.isError[elem];
            delete item._behaviors.validMsg[elem];
        }
    });
    return data;
}
//19
contractutil.clearSettlementPartner = function (data) {
    angular.forEach(data, (item) => {
        if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
            if (item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() != 'cash' && item.HAS_TRACKER == "0") {
                item.SETTLEMENT_PARTNER = null;
            }
            delete item._behaviors.isRequired["SETTLEMENT_PARTNER"];
            delete item._behaviors.isError["SETTLEMENT_PARTNER"];
            delete item._behaviors.validMsg["SETTLEMENT_PARTNER"];
        }
        if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && item.HAS_TRACKER == "0") {
            if (item._behaviors && item._behaviors.isReadOnly)
                delete item._behaviors.isReadOnly["SETTLEMENT_PARTNER"];
        }
    });
    return data;
}
//20
contractutil.validateFlexDate = function (data, curPricingTable, wipData) {
    if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
        data = contractutil.clearValidation(data, 'START_DT');
        var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
        var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
        var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
        //For multi tiers last record will have latest date, skipping duplicate DC_ID
        var filterData = _.uniq(_.sortBy(accrualEntries, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

        var maxAccrualDate = new Date(Math.max.apply(null, filterData.map(function (x) { return new Date(x.START_DT); })));

        var drainingInvalidDates = drainingEntries.filter((val) => moment(val.START_DT) < (moment(maxAccrualDate)));
    }

    return drainingInvalidDates;
}
//21
contractutil.setFlexBehaviors = function (item, elem, cond, restrictGroupFlexOverlap) {
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    item._behaviors.isRequired[elem] = true;
    item._behaviors.isError[elem] = true;

    if (cond == 'flexrowtype' && elem == 'FLEX_ROW_TYPE') {
        item._behaviors.validMsg[elem] = "There should be at least one accrual product.";
    }
    
    else if (cond == 'nequalpayout' && elem == 'PAYOUT_BASED_ON') {
        item._behaviors.validMsg[elem] = "Products within the same bucket should have same payout based on value";
    }

    else if (cond == 'notallowed' && elem == 'PAYOUT_BASED_ON') {
        item._behaviors.validMsg[elem] = "Consumption based accrual with billings based draining is not valid";
    }
    return item;
}
//23
contractutil.validateFlexRules = function (data, curPricingTable, wipData, restrictGroupFlexOverlap) {
    if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
        data = contractutil.clearValidation(data, 'PAYOUT_BASED_ON');
        var accrualRule = true, drainingRule = true;
        var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
        var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
        var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
        var filterData = _.uniq(_.sortBy(accrualEntries, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
        accrualRule = filterData.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == filterData[0].PAYOUT_BASED_ON);
        drainingRule = drainingEntries.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == drainingEntries[0].PAYOUT_BASED_ON);
        if (!accrualRule) {
            angular.forEach(filterData, (item) => {
                item = contractutil.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'nequalpayout', restrictGroupFlexOverlap);
            });
        }
        if (!drainingRule) {
            angular.forEach(drainingEntries, (item) => {
                item = contractutil.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'nequalpayout', restrictGroupFlexOverlap);
            });
        }
        if ((filterData.some(function (el) { return el.PAYOUT_BASED_ON.toUpperCase() == 'CONSUMPTION' })) && (drainingEntries.some(function (el) { return el.PAYOUT_BASED_ON.toUpperCase() == 'BILLINGS' }))) {
            var restrictedAccrualData = filterData.filter((val) => val.PAYOUT_BASED_ON.toUpperCase() == 'CONSUMPTION');
            var restrictedDraininngData = drainingEntries.filter((val) => val.PAYOUT_BASED_ON.toUpperCase() == 'BILLINGS');
            angular.forEach(restrictedAccrualData, (item) => {
                item = contractutil.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'notallowed', restrictGroupFlexOverlap);
            });
            angular.forEach(restrictedDraininngData, (item) => {
                item = contractutil.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'notallowed', restrictGroupFlexOverlap);
            });
        }
    }
    return data;
}
//24
contractutil.clearEndCustomer = function (item) {
    if (item._behaviors && item._behaviors.isError && item._behaviors.isRequired && item._behaviors.validMsg) {
        delete item._behaviors.isError["END_CUSTOMER_RETAIL"];
        delete item._behaviors.validMsg["END_CUSTOMER_RETAIL"];
    }
    return item;
}
//25
contractutil.setEndCustomer = function (item, dealType, curPricingTable) {
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    if ((item.END_CUSTOMER_RETAIL != '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
        || ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") && item.REBATE_TYPE.toLowerCase() != "tender")) {//To show required error message
        item = contractutil.clearEndCustomer(item);
        item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
        item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer Retail and End Customer Country/Region must be same for " + dealType + ".";
    }
    else if ((item.END_CUSTOMER_RETAIL == '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
        && ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "PROGRAM") && item.REBATE_TYPE.toLowerCase() == "tender")) {
        item = contractutil.clearEndCustomer(item);
        item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
        item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer/Retail is required.";
    }
    return item;
}
//26
contractutil.validateDate = function (dateType, contractData, existingMinEndDate) {
    contractData._behaviors.isError['START_DT'] =
        contractData._behaviors.isError['END_DT'] = false;
    contractData._behaviors.validMsg['START_DT'] =
        contractData._behaviors.validMsg['END_DT'] = "";

    var startDate = contractData.START_DT;
    var endDate = contractData.END_DT;

    if (dateType == 'START_DT') {
        if (moment(startDate).isAfter(endDate) || moment(startDate).isBefore(contractData.MinDate)) {
            contractData._behaviors.isError['START_DT'] = true;
            contractData._behaviors
                .validMsg['START_DT'] = moment(startDate).isBefore(contractData.MinDate)
                    ? "Start date cannot be less than - " + contractData.MinDate
                    : "Start date cannot be greater than End Date";
        }
    } else {
        if (moment(endDate).isBefore(startDate) || moment(endDate).isAfter(contractData.MaxDate)) {
            contractData._behaviors.isError['END_DT'] = true;
            contractData._behaviors
                .validMsg['END_DT'] = moment(endDate).isAfter(contractData.MaxDate)
                    ? "End date cannot be greater than - " + contractData.MaxDate
                    : "End date cannot be less than Start Date";
        }
        if (existingMinEndDate !== "" && contractData.PRC_ST != null && contractData.PRC_ST.length != 0) {
            if (moment(endDate).isBefore(existingMinEndDate)) {
                contractData._behaviors.isError['END_DT'] = true;
                contractData._behaviors
                    .validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + existingMinEndDate + " - if you have already created pricing strategies. ";
            }
        }
    }

    return contractData;
}
//27
contractutil.validateTitles = function (dataItem, curPricingStrategy, contractData, curPricingTable, ptTitle) {
    var rtn = true;

    if (!curPricingStrategy) return true;
    var isPsUnique = contractutil.IsUniqueInList(contractData.PRC_ST, curPricingStrategy["TITLE"], "TITLE", true);
    var isPtUnique = !curPricingTable ? true : contractutil.IsUniqueInList(curPricingStrategy.PRC_TBL, curPricingTable["TITLE"], "TITLE", true);

    // Pricing Table
    if (!!curPricingTable) {
        if (!curPricingTable._behaviors) curPricingTable._behaviors = {};
        if (!curPricingTable._behaviors.validMsg) curPricingTable._behaviors.validMsg = {};
        if (!curPricingTable._behaviors.isError) curPricingTable._behaviors.isError = {};

        if (!curPricingTable._behaviors.isDirty || curPricingTable._behaviors.isDirty.TITLE) {
            if (curPricingTable !== undefined && curPricingTable.TITLE === "") {
                curPricingTable._behaviors.validMsg["TITLE"] = "The " + ptTitle + " needs a Title.";
                curPricingTable._behaviors.isError["TITLE"] = true;
                rtn = false;
            }
            else if (!isPtUnique) {
                curPricingTable._behaviors.validMsg["TITLE"] = "Table title (" + ptTitle + ") must be a unique name within this contract.";
                curPricingTable._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else if (curPricingTable["TITLE"] !== undefined && curPricingTable["TITLE"].length > 80) {
                curPricingTable._behaviors.validMsg["TITLE"] = "The title (" + ptTitle + ") cannot have more than 80 characters.";
                curPricingTable._behaviors.isError["TITLE"] = true;
                rtn = false;
            }
            else {
                curPricingTable._behaviors.isError["TITLE"] = false;
            }
        }
    }

    // Pricing Strategy
    if (!!curPricingStrategy) {
        if (!curPricingStrategy._behaviors) curPricingStrategy._behaviors = {};
        if (!curPricingStrategy._behaviors.validMsg) curPricingStrategy._behaviors.validMsg = {};
        if (!curPricingStrategy._behaviors.isError) curPricingStrategy._behaviors.isError = {};

        if (!curPricingStrategy._behaviors.isDirty || curPricingStrategy._behaviors.isDirty.TITLE) {
            if (curPricingStrategy !== undefined && curPricingStrategy.TITLE === "") {
                curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + ptTitle + " needs a Title.";
                curPricingStrategy._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else if (!isPsUnique) {
                curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + ptTitle + " must have unique name.";
                curPricingStrategy._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else if (curPricingStrategy["TITLE"] !== undefined && curPricingStrategy["TITLE"].length > 80) {
                curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + ptTitle + " cannot have more than 80 characters.";
                curPricingStrategy._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else {
                curPricingStrategy._behaviors.isError["TITLE"] = false;
            }
        }
    }

    if (dataItem !== undefined) {
        if (!dataItem._behaviors) dataItem._behaviors = {};
        if (!dataItem._behaviors.validMsg) dataItem._behaviors.validMsg = {};
        if (!dataItem._behaviors.isError) dataItem._behaviors.isError = {};

        if (!dataItem._behaviors.isDirty || dataItem._behaviors.isDirty.TITLE) {
            if (dataItem !== undefined && dataItem.TITLE === "") {
                dataItem._behaviors.validMsg["TITLE"] = "The " + ptTitle + " needs a Title.";
                dataItem._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else if (!isPsUnique) {
                dataItem._behaviors.validMsg["TITLE"] = "The " + ptTitle + " must have unique name.";
                dataItem._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else if (dataItem["TITLE"] !== undefined && dataItem["TITLE"].length > 80) {
                dataItem._behaviors.validMsg["TITLE"] = "The " + ptTitle + " cannot have more than 80 characters.";
                dataItem._behaviors.isError["TITLE"] = true;
                rtn = false;
            } else {
                dataItem._behaviors.isError["TITLE"] = false;
            }
        }
    }
    return rtn;
}
//28
contractutil.validateMarketSegment = function (data, wipData, spreadDs) {
    data = contractutil.clearValidation(data, 'MRKT_SEG');
    var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
    //In SpreadData for Multi-Tier Tier_NBR one always has the updated date
    //Added if condition as this function gets called both on saveandvalidate of WIP and PTR.As spreadDS is undefined in WIP object added this condition
    var spreadData;
    if (spreadDs != undefined) {
        spreadData = spreadDs;
    }
    else {
        spreadData = data
    }
    //For multi tiers last record will have latest date, skipping duplicate DC_ID
    var filterData = _.uniq(_.sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
    var isMarketSegment = filterData.some((val) => val.MRKT_SEG == null || val.MRKT_SEG == '');
    if (isMarketSegment) {
        angular.forEach(data, (item) => {
            if (item.MRKT_SEG == null || item.MRKT_SEG == '') {
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
                if (!item._behaviors.isError) item._behaviors.isError = {};
                if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
                item._behaviors.isRequired["MRKT_SEG"] = true;
                item._behaviors.isError["MRKT_SEG"] = true;
                item._behaviors.validMsg["MRKT_SEG"] = "Market Segment is required.";

            }
        });

    }
    return data;
}


contractutil.ValidateEndCustomer = function (data, actionName, curPricingStrategy, curPricingTable) {
    if (actionName !== "OnLoad") {
        angular.forEach(data, (item) => {
            if (item._behaviors && item._behaviors.validMsg && item._behaviors.validMsg["END_CUSTOMER_RETAIL"] != undefined) {
                item = contractutil.clearEndCustomer(item);
            }
        });
    }
    if (curPricingStrategy.IS_HYBRID_PRC_STRAT === '1' && (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP")) {
        var rebateType = data.filter(ob => ob.REBATE_TYPE.toLowerCase() == 'tender');
        if (rebateType && rebateType.length > 0) {
            if (data.length > 1) {
                var endCustObj = ""
                if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                    endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                }
                angular.forEach(data, (item) => {
                    var parsedEndCustObj = "";
                    if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                        parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                        if (parsedEndCustObj.length != endCustObj.length) {
                            angular.forEach(data, (item) => {
                                item = contractutil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
                            });
                        }
                        else {
                            for (var i = 0; i < parsedEndCustObj.length; i++) {
                                var exists = false;
                                angular.forEach(endCustObj, (item) => {
                                    if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                        item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                        exists = true;
                                    }
                                });
                                if (!exists) {
                                    angular.forEach(data, (item) => {
                                        item = contractutil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
                                    });
                                    i = parsedEndCustObj.length;
                                }
                            }
                        }
                    }
                    if (endCustObj == "" || parsedEndCustObj == "") {
                        if (parsedEndCustObj.length != endCustObj.length) {
                            angular.forEach(data, (item) => {
                                item = contractutil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
                            });
                        }
                    }
                });
            }

        }
        else {
            if (data.length > 1) {
                var endCustObj = ""
                if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                    endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                }
                angular.forEach(data, (item) => {
                    var parsedEndCustObj = "";
                    if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                        parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                        if (parsedEndCustObj.length != endCustObj.length) {
                            angular.forEach(data, (item) => {
                                item = contractutil.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                            });
                        }
                        else {
                            for (var i = 0; i < parsedEndCustObj.length; i++) {
                                var exists = false;
                                angular.forEach(endCustObj, (item) => {
                                    if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                        item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                        exists = true;
                                    }
                                });
                                if (!exists) {
                                    angular.forEach(data, (item) => {
                                        item = contractutil.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                                    });
                                    i = parsedEndCustObj.length;
                                }
                            }
                        }
                    }
                    if (endCustObj == "" || parsedEndCustObj == "") {
                        if (parsedEndCustObj.length != endCustObj.length) {
                            angular.forEach(data, (item) => {
                                item = contractutil.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                            });
                        }
                    }
                });
            }
        }
    }

    return data;
}

contractutil.setSettlementPartner = function (item, Cond) {
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    item._behaviors.isRequired["SETTLEMENT_PARTNER"] = true;
    item._behaviors.isError["SETTLEMENT_PARTNER"] = true;
    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    if (item.HAS_TRACKER == 0 || item.HAS_TRACKER == undefined) {
        if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() !== 'cash') {
            item._behaviors.isReadOnly["SETTLEMENT_PARTNER"] = true;
        }
        if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash') {
            delete item._behaviors.isReadOnly["SETTLEMENT_PARTNER"];
        }
        else {
            if (Cond == '1') {
                item._behaviors.validMsg["SETTLEMENT_PARTNER"] = "For hybrid deal vendor must be same if any settlement level is cash";
            }
        }
    }
    return item;
}

contractutil.validateSettlementPartner = function (data, curPricingStrategy, getVendorDropDownResult) {
    var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond = true;
    //check if settlement is cash and pgm type is backend
    var cashObj = data.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
    if (cashObj && cashObj.length > 0) {
        if (getVendorDropDownResult != null && getVendorDropDownResult != undefined && getVendorDropDownResult.length > 0) {
            var customerVendor = getVendorDropDownResult;
            angular.forEach(data, (item) => {
                var partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
                if (partnerID && partnerID.length == 1) {
                    item.SETTLEMENT_PARTNER = partnerID[0].DROP_DOWN;
                }
            });
        }
        else if (hybCond == '1') {
            retCond = data.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '' && val.SETTLEMENT_PARTNER == data[0].SETTLEMENT_PARTNER);
            if (!retCond) {
                angular.forEach(data, (item) => {
                    item = contractutil.setSettlementPartner(item, '1');
                });
            }
            else {
                data = contractutil.clearSettlementPartner(data);
            }
        }
        else {
            retCond = cashObj.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '');
            if (!retCond) {
                angular.forEach(data, (item) => {
                    if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
                        if (item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() != 'cash' && item.HAS_TRACKER == "0") {
                            item.SETTLEMENT_PARTNER = null;
                        }
                        delete item._behaviors.isRequired["SETTLEMENT_PARTNER"];
                        delete item._behaviors.isError["SETTLEMENT_PARTNER"];
                        delete item._behaviors.validMsg["SETTLEMENT_PARTNER"];
                    }
                });
            }
            else {
                data = contractutil.clearSettlementPartner(data);
            }

        }
    }
    else {
        data = contractutil.clearSettlementPartner(data);
    }
    return data;
}

contractutil.getColor = function (k, c, colorDictionary) {
    if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
        return colorDictionary[k][c];
    }
    return "#aaaaaa";
}

contractutil.numOfPivot = function (dataItem, curPricingTable) {
    if (curPricingTable === undefined) return 1;
    if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" || curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" ||
        curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
        var pivotFieldName = "NUM_OF_TIERS";
        var pivotDensity = curPricingTable["NUM_OF_DENSITY"];
        // if dataItem has numtiers return it do not calculate and update here. pricingTableController.js pivotKITDeals will take care of updating correct NUM_TIERS
        if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" && !!dataItem && !!dataItem["PTR_USER_PRD"]) {
            if (dataItem["NUM_OF_TIERS"] !== undefined) return dataItem["NUM_OF_TIERS"];
            var pivotVal = dataItem["PTR_USER_PRD"].split(",").length;  //KITTODO: do we have a better way of calculating number of rows without splitting PTR_USER_PRD?
            dataItem['NUM_OF_TIERS'] = pivotVal;  //KITTODO: not sure if necessary to set num of tiers at ptr level, but it appears to be expected when applying red validation markers to various dim rows (saveEntireContractRoot()'s call of MapTieredWarnings())
            return pivotVal;
        }
        if (!contractutil.isPivotable(curPricingTable)) return 1;
        if (dataItem === undefined) {
            //condition for density also added here, this is identified in case of split product
            return curPricingTable[pivotFieldName] === undefined ? 1 : (pivotDensity == undefined ? parseInt(curPricingTable[pivotFieldName]) : parseInt(curPricingTable[pivotFieldName]) * parseInt(pivotDensity));
        }
        if (!!dataItem[pivotFieldName]) return parseInt(dataItem[pivotFieldName]);      //if dataItem (ptr) has its own num tiers atrb
        //VT deal type
        var pivotVal = curPricingTable[pivotFieldName];
        //logic to add Density multiply by number of tier to add those many rows in spreadsheet
        return pivotVal === undefined ? 1 : (pivotDensity == undefined ? parseInt(pivotVal) : parseInt(pivotVal) * parseInt(pivotDensity));
    }
    return 1;   //num of pivot is 1 for undim deal types
}

contractutil.pivotData = function (data, isTenderContract, curPricingTable, kitDimAtrbs) {        //convert how we save data in MT to UI spreadsheet consumable format
    data = contractutil.assignProductProprties(data, isTenderContract, curPricingTable);
    var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"];
    var densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
    if (!contractutil.isPivotable(curPricingTable)) return data;
    var newData = [];
    let dealType = curPricingTable['OBJ_SET_TYPE_CD'];

    for (var d = 0; d < data.length; d++) {
        // Tiered data
        var productJSON = data[d]["PTR_SYS_PRD"] !== undefined && data[d]["PTR_SYS_PRD"] !== null && data[d]["PTR_SYS_PRD"] !== "" ? JSON.parse(data[d]["PTR_SYS_PRD"]) : [];
        var numTiers = contractutil.numOfPivot(data[d], curPricingTable);
        let curTier = 1, db = 1, dt = 1;

        for (var t = 1; t <= numTiers; t++) {
            var lData = util.deepClone(data[d]);

            if (dealType === "VOL_TIER" || dealType === "FLEX" ||
                dealType === "REV_TIER") {
                // Set attribute Keys for adding dimensions
                let endKey;
                let strtKey;
                if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                    endKey = "END_VOL"; strtKey = "STRT_VOL";
                }
                else if (curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER") {
                    endKey = "END_REV"; strtKey = "STRT_REV";
                }

                // Vol-tier specific cols with tiers
                for (var i = 0; i < tierAtrbs.length; i++) {
                    var tieredItem = tierAtrbs[i];
                    lData[tieredItem] = lData[tieredItem + "_____10___" + t];

                    lData = contractutil.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, t, curPricingTable);

                    if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                        // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                        if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                            lData[endKey] = kendo.toString(parseInt(lData[endKey] || 0), "n0");
                        }
                    }
                    else {
                        // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                        if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                            lData[endKey] = kendo.toString(parseFloat(lData[endKey] || 0), "n2");
                        }
                    }

                }
                // Disable all Start vols except the first if there is no tracker, else disable them all
                if (!!data[d]._behaviors && ((t === 1 && data[d].HAS_TRACKER === "1") || t !== 1)) {
                    if (!data[d]._behaviors.isReadOnly) {
                        data[d]._behaviors.isReadOnly = {};
                    }
                    lData._behaviors.isReadOnly[strtKey] = true;
                }
                // Disable all End volumes except for the last tier if there is a tracker
                if (!!data[d]._behaviors && data[d].HAS_TRACKER === "1") {
                    if (t !== numTiers) {
                        if (!data[d]._behaviors.isReadOnly) {
                            data[d]._behaviors.isReadOnly = {};
                        }
                        lData._behaviors.isReadOnly[endKey] = true;
                    }
                }
            }
            else if (dealType === "DENSITY") {
                let densityBands = parseInt(data[d]["NUM_OF_DENSITY"]);
                let densityNumTiers = numTiers / densityBands;

                if (db > densityBands) {
                    db = 1;
                    curTier++;
                }

                if (dt > densityNumTiers) {
                    dt = 1;
                }
                // Set attribute Keys for adding dimensions
                let endKey = "END_PB", strtKey = "STRT_PB";

                // Density specific cols with tiers
                for (var i = 0; i < densityTierAtrbs.length; i++) {
                    var tieredItem = densityTierAtrbs[i];
                    if (tieredItem != "DENSITY_RATE") {
                        let dimKey = (tieredItem == "DENSITY_BAND") ? "_____8___" : "_____10___";
                        if (tieredItem != "DENSITY_BAND") {
                            lData[tieredItem] = lData[tieredItem + dimKey + curTier];
                            lData = contractutil.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, curTier, curPricingTable);
                        }
                        else {
                            lData[tieredItem] = lData[tieredItem + dimKey + db];
                            lData = contractutil.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, db, curPricingTable);

                        }

                        if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                            lData[endKey] = kendo.toString(parseFloat(lData[endKey].replace(/[$,]/g, '') || 0), "n3");
                        }

                        if (tieredItem === strtKey && lData[strtKey] !== undefined) {
                            //lData[strtKey] = thousands_separators((parseFloat(lData[strtKey].replace(/[$,]/g, ''))).toFixed(3));
                            lData[strtKey] = kendo.toString(parseFloat(lData[strtKey].replace(/[$,]/g, '') || 0), "n3");
                        }

                    }
                    else {
                        lData[tieredItem] = lData[tieredItem + "_____8___" + db + "____10___" + curTier];
                        lData = contractutil.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, curTier, curPricingTable);
                    }
                }
                // Disable all Start vols except the first if there is no tracker, else disable them all
                let densityBandCount = parseInt(data[d]["NUM_OF_DENSITY"]);
                if (!!data[d]._behaviors && ((t === 1 && data[d].HAS_TRACKER === "1") || t > densityBandCount)) {
                    if (!data[d]._behaviors.isReadOnly) {
                        data[d]._behaviors.isReadOnly = {};
                    }
                    lData._behaviors.isReadOnly[strtKey] = true;
                }
                // Disable all End volumes except for the last tier if there is a tracker
                if (!!data[d]._behaviors && data[d].HAS_TRACKER === "1") {
                    if (densityBandCount != 1) {
                        if (t < numTiers - densityBandCount) {
                            if (!data[d]._behaviors.isReadOnly) {
                                data[d]._behaviors.isReadOnly = {};
                            }
                            lData._behaviors.isReadOnly[endKey] = true;
                        }
                    }
                    else {
                        if (t != numTiers) {
                            if (!data[d]._behaviors.isReadOnly) {
                                data[d]._behaviors.isReadOnly = {};
                            }
                            lData._behaviors.isReadOnly[endKey] = true;
                        }
                    }
                }
            }
            else if (dealType === "KIT") {
                // KIT specific cols with 'tiers'
                for (var i = 0; i < kitDimAtrbs.length; i++) {
                    var tieredItem = kitDimAtrbs[i];
                    lData[tieredItem] = lData[tieredItem + "_____20___" + (t - 1)]; //-1 because KIT dim starts at 0 whereas VT num tiers begin at 1
                    if (tieredItem == "TIER_NBR") {
                        lData[tieredItem] = t; // KIT add tier number
                        if (lData[tieredItem] != 1) {
                            lData['DEAL_GRP_NM'] = null;
                        }
                    }
                    lData = contractutil.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, (t - 1), curPricingTable);
                }

                lData["TEMP_TOTAL_DSCNT_PER_LN"] = contractutil.calculateTotalDsctPerLine(lData["DSCNT_PER_LN_____20___" + (t - 1)], lData["QTY_____20___" + (t - 1)]);
                lData["TEMP_KIT_REBATE"] = contractutil.calculateKitRebate(data, d, numTiers, true);
                if (productJSON.length !== 0) {
                    angular.forEach(productJSON, function (value, key) {
                        var bckt = data[d]["PRD_BCKT" + "_____20___" + (t - 1)];
                        if (bckt !== undefined && key.toUpperCase() === bckt.toUpperCase()) {
                            lData["CAP"] = value[0]["CAP"];
                            lData["YCS2"] = value[0]["YCS2"];
                        }
                    });
                }
            }

            newData.push(lData);
            dt++; db++;
        }
    }
    return newData;
}


contractutil.mapTieredWarnings = function (dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber, curPricingTable) {
    // Tie warning message (valid message and red highlight) to its specific tier
    // NOTE: this expects that tiered errors come in the form of a Dictionary<tier, message>
    if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
        if (dataItem._behaviors.validMsg[atrbName] != null) {
            try {
                // Parse the Dictionary json
                var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                    // KIT ECAP
                    if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                        dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                        dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                    }
                }
                if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                    // Set the validation message
                    if (atrbToSetErrorTo.contains("DENSITY_RATE")) {
                        if (dataToTieTo.dc_type == "WIP_DEAL") {
                            let densityRateCheck = Object.values(dataToTieTo.DENSITY_RATE).every(item => item <= 0);
                            if (densityRateCheck) {
                                dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                                dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                            }
                            else {
                                delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                                delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                            }
                        }
                        else if (dataToTieTo.DENSITY_RATE <= 0) {
                            dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                            dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                        }
                        else {
                            delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                            delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                        }
                    }
                    else {
                        dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                        dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                    }
                } else {
                    // Delete the tier-specific validation if it doesn't tie to this specific tier
                    delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                    delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                }
            } catch (e) {
                // not Valid Json String
            }
        }
    }
    return dataToTieTo;
}  