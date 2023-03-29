import { each, uniq, sortBy, findIndex } from 'underscore';
import { StaticMomentService } from "../../shared/moment/moment.service";
import { lnavUtil } from "../lnav.util";
import { PTE_Load_Util } from './PTE_Load_util';
import { PTE_Config_Util } from './PTE_Config_util';
import { DE_Validation_Util } from "../DEUtils/DE_Validation_util"
import { DE_Save_Util } from '../DEUtils/DE_Save_util';
import { PTE_Helper_Util } from './PTE_Helper_util';
import { PTE_Common_Util } from './PTE_Common_util';

export class PTE_Validation_Util {
    static getCorrectedPtrUsrPrd (userInpProdName) {
        userInpProdName = userInpProdName.trim();
        var retVal = "";
        if (userInpProdName.indexOf("NAND") != -1) {
            if (userInpProdName.indexOf(",") != -1) {

                var splitStr = userInpProdName.split(",");
                for (var i = 0; i < splitStr.length; i++) {
                    var individProdName = splitStr[i].trim();
                    if (individProdName.indexOf("NAND") != -1) {
                        retVal = retVal + ((retVal.length == 0) ? individProdName.substring(individProdName.lastIndexOf(" ")) : "," + individProdName.substring(individProdName.lastIndexOf(" ")));
                    } else {
                        retVal = retVal + ((retVal.length == 0) ? individProdName : "," + individProdName);
                    }
                }
            } else {
                retVal = userInpProdName.substring(userInpProdName.lastIndexOf(" "));
            }
        } else {
            retVal = userInpProdName;
        }
        return retVal;
    }

    static buildTranslatorOutputObject (invalidProductJSONRows, data) {
        invalidProductJSONRows.forEach(item => {
            var inValidJSON = JSON.parse(item.PTR_SYS_INVLD_PRD);
            var validJSON = (item.PTR_SYS_PRD != null && item.PTR_SYS_PRD != "") ? JSON.parse(item.PTR_SYS_PRD) : "";
            data.ValidProducts[item.ROW_NUMBER] = validJSON;
            data.ProdctTransformResults[item.ROW_NUMBER] = inValidJSON.ProdctTransformResults;
            data.DuplicateProducts[item.ROW_NUMBER] = inValidJSON.DuplicateProducts;
            data.InValidProducts[item.ROW_NUMBER] = inValidJSON.InValidProducts;
        });
        return data;
    }

    static buildTranslatorOutputObjectproductCorroctor(invalidProductJSONRows, data, currentPricingTableRowData) {
        //To remove the DC_ID data which got saved (if DC_ID changed)
        if (data && data.InValidProducts) {
            let invalidProduct = PTE_Common_Util.deepClone(data.InValidProducts)
            each(invalidProduct, (invldPrd, key) => {
                let indx = findIndex(currentPricingTableRowData, { DC_ID: parseInt(key) })
                if (parseInt(key) < 0 && indx < 0) {
                    delete data.InValidProducts[key]
                }
            })
        }
        if (data && data.ProdctTransformResults) {
            let pdtTransformRslt = PTE_Common_Util.deepClone(data.ProdctTransformResults)
            each(pdtTransformRslt, (prdrslt, key) => {
                let indx = findIndex(currentPricingTableRowData, { DC_ID: parseInt(key) })
                if (parseInt(key) < 0 && indx < 0) {
                    delete data.ProdctTransformResults[key]
                }
            })
        }
        if (data && data.DuplicateProducts) {
            let dupPdt = PTE_Common_Util.deepClone(data.DuplicateProducts)
            each(dupPdt, (dup, key) => {
                let indx = findIndex(currentPricingTableRowData, { DC_ID: parseInt(key) })
                if (parseInt(key) < 0 && indx < 0) {
                    delete data.DuplicateProducts[key]
                }
            })
        }
        if (data && data.ValidProducts) {
            let validPdt = PTE_Common_Util.deepClone(data.ValidProducts)
            each(validPdt, (validPd, key) => {
                let indx = findIndex(currentPricingTableRowData, { DC_ID: parseInt(key) })
                if (parseInt(key) < 0 && indx < 0) {
                    delete data.ValidProducts[key]
                }
            })
        }
        if (!data)
            data = { ValidProducts: {}, ProdctTransformResults: {}, DuplicateProducts: {}, InValidProducts: {}};
        invalidProductJSONRows.forEach(item => {
            var inValidJSON = JSON.parse(item.PTR_SYS_INVLD_PRD);
            var validJSON = (item.PTR_SYS_PRD != null && item.PTR_SYS_PRD != "") ? JSON.parse(item.PTR_SYS_PRD) : "";
            if(validJSON)
                data['ValidProducts'][item.DC_ID] = validJSON;
            if (inValidJSON.ProdctTransformResults)
                data['ProdctTransformResults'][item.DC_ID] = inValidJSON.ProdctTransformResults;
            if (inValidJSON.DuplicateProducts)
                data['DuplicateProducts'][item.DC_ID] = inValidJSON.DuplicateProducts;
            if (inValidJSON.InValidProducts)
                data['InValidProducts'][item.DC_ID] = inValidJSON.InValidProducts;
        });
        return data;
    }


    static validateMultiGeoForHybrid(data: any, isHybrid: any) {
        if (isHybrid == 1 || isHybrid == '1') {
            //This is Comma Separated GEOS
            var prod_used = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].IS_CANCELLED !== "1") {
                    //Add Products
                    var temp_split = (data[i].PTR_USER_PRD.toLowerCase().trim().split(/\s*,\s*/));
                    for (var j = 0; j < temp_split.length; j++) {
                        prod_used.push(temp_split[j]);
                    }
                    //Checking GEO
                    //Added a check to check for Geo_Combined only if it exists.
                    if (data[i].GEO_COMBINED && data[i].GEO_COMBINED.indexOf(',') > -1) {
                        var firstBracesPos = data[i].GEO_COMBINED.lastIndexOf('[');
                        var lastBracesPos = data[i].GEO_COMBINED.lastIndexOf(']');
                        var lastComma = data[i].GEO_COMBINED.lastIndexOf(',');
                        if (lastComma > lastBracesPos) {
                            return "1";
                        }
                    }
                }
            }
            ////This is to Check Product Line -- commented below part, Once Mitusha confirmed, will delete it.
            //if (prod_used.length > 0) {
            //    var uniq = prod_used
            //        .map(function (e) {
            //            return e;
            //        }).reduce((a, b) => {
            //            a[b] = (a[b] || 0) + 1;
            //            return a
            //        }, {})
            //    //Duplicate Product Check
            //    var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
            //    if (duplicates.length > 0) {
            //        return "2";
            //    }
            //}
        }
        return "0";
       }

    static splitProductForDensity (response) {
        let prdObj = {};
        //skipping the excluded products
        response.validateSelectedProducts.forEach((prdDet, prd) => {
            if (prdDet && prdDet.length > 0 && !prdDet[0].EXCLUDE) {
                prdObj[`${prd}`] = prdDet;
            }
        });

        if (response.splitProducts) {
            let prod = {};
            let items = Object.keys(prdObj);
            for (var i = 0; i < items.length; i++) {
                let obj = {};
                obj[`${items[i]}`] = prdObj[`${items[i]}`]
                prod[i + 1] = obj;
            }
            return prod;
        }
        else {
            return { "1": prdObj }
        }
    }

    static anyPtrDirtyValidation ($linq, pricingTableRow) {
        var validServerType = $linq.Enumerable().From(pricingTableRow).Where(
            function (x) {
                return x._behaviors.isError.SERVER_DEAL_TYPE === true;
            }).ToArray();

        var dirtyItems = $linq.Enumerable().From(pricingTableRow).Where(
            function (x) {
                return x.PASSED_VALIDATION === "Dirty";
            }).ToArray();

        return dirtyItems.length > validServerType.length;
    }

    static FixEcapKitField (pricingTableRow) {
        // Implement a rule to set KIT_ECAP column read only property = source column read only setting
        for (var i = 0; i < pricingTableRow.length; i++) {
            var item = pricingTableRow[i];
            if (item._behaviors !== undefined && item._behaviors.isReadOnly !== undefined && item._behaviors.isReadOnly["ECAP_PRICE"] !== undefined && item._behaviors.isReadOnly["ECAP_PRICE"] === true) {
                item._behaviors.isReadOnly["ECAP_PRICE_____20_____1"] = true;
            }

            //Enable Kit Name Field when Pricing Table Copied from Approved Pricing Table
            if (item._behaviors !== undefined && item._behaviors.isReadOnly !== undefined && item._behaviors.isReadOnly["DEAL_GRP_NM"] != undefined) {
                if (item["OBJ_SET_TYPE_CD"] == "KIT" && item["HAS_TRACKER"] == "0" && item["PS_WF_STG_CD"] == "Approved") {
                    delete item._behaviors.isReadOnly["DEAL_GRP_NM"];
                }
            }
        }
    }

    static clearDensityValidation (DCID, objTypeCd, rootSpreadDsData) {
        //the same function is called from onChange when there is a delete 
        if (objTypeCd == "DENSITY") {
            let data = rootSpreadDsData;
            data.forEach(itm => {
                if (itm.DC_ID == DCID) {
                    PTE_Helper_Util.clearBehaviors(itm, 'DENSITY_BAND');
                    PTE_Helper_Util.clearBehaviors(itm, 'DC_ID');
                    itm.DENSITY_BAND = null;
                }
            });
        }
    }

    static warningHandler (pricingTableData, kitDimAtrbs) {
        for (var i = 0; i < pricingTableData.data.WIP_DEAL.length; i++) {
            var dataItem = pricingTableData.data.WIP_DEAL[i];
            var objTypeCd = dataItem.OBJ_SET_TYPE_CD;
            if (objTypeCd === "KIT" || objTypeCd === "FLEX" || objTypeCd === "VOL_TIER"
                || objTypeCd === "REV_TIER" || objTypeCd === "DENSITY") {
                var anyWarnings = false;
                if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;
                var tierAtrbs = PTE_Config_Util.tierAtrbs;
                if (anyWarnings) {
                    var dimStr = "_10___";
                    var isKit = 0;
                    var relevantAtrbs = tierAtrbs;
                    var tierCount = dataItem.NUM_OF_TIERS;

                    if (objTypeCd === "KIT") {
                        if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                        dimStr = "_20___";
                        isKit = 1;
                        relevantAtrbs = kitDimAtrbs;
                        tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                    }

                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            PTE_Common_Util.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
            }
        }
    }

    static setModalOptions (confirmationModPerDealGrp, key, maxKITproducts) {
        var modalOptions = null;
        if (confirmationModPerDealGrp[key].isNonEditableKITname) {
            // User tried to merge a deal group name that exists and cannot be edited (like when it has a tracker number)
            modalOptions = {
                closeButtonText: "Okay",
                hasActionButton: false,
                headerText: "Cannot merge KIT name",
                bodyText: "A Kit with the name \"" + key + "\" already exists and its products cannot be edited. Please choose a different KIT name.",
                closeResults: { "key": key }
            };
        }
        else if (confirmationModPerDealGrp[key].RowCount > maxKITproducts) {
            // Cannot merge
            modalOptions = {
                closeButtonText: "Okay",
                hasActionButton: false,
                headerText: "Cannot merge KIT name",
                bodyText: "A Kit with the name \"" + key + "\" already exists.  Unfortunately, you cannot merge these rows since merging them will exceed the max limit of products you can have (which is 10).  Please specify a different Kit Name or remove products from this row and try again.",
                closeResults: { "key": key }
            };
        } else {
            // Ask user if they want to merge
            modalOptions = {
                closeButtonText: "Cancel",
                actionButtonText: "Merge rows",
                hasActionButton: true,
                headerText: "KIT name merge confirmation",
                bodyText: "A Kit with the name \"" + key + "\" already exists.  Would you like to merge rows containing this Kit Name?  Please note that any duplicate products will automatically be removed upon merging.",
                actionResults: { "key": key }, // HACK: without this, we won't get the correct key in the modal's .then()
                closeResults: { "key": key }
            };
        }
        return modalOptions;
    }    
    static validateDeal(data: Array<any>, contractData, curPricingTable, curPricingStrategy, isTenderContract, lookBackPeriod, templates, groups): any {
        let isShowStopperError = DE_Validation_Util.validateWipDeals(data, curPricingStrategy, curPricingTable, contractData, isTenderContract, lookBackPeriod, templates);
        PTE_Common_Util.setWarningFields(data, curPricingTable);
        return isShowStopperError;
    }
    static validateTenderDashboardDeal(data, curPricingTable, groups, templates) {
        let isShowStopperError = DE_Validation_Util.validateTenderDahsboardDeals(data, templates);
        PTE_Common_Util.setWarningFields(data, curPricingTable);
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                DE_Save_Util.savedWithWarning(data[i], groups, templates);
            }
        }
        return isShowStopperError;
    }
    static setToSame(data, elem) {
        each(data, (item) => {
            if (item[elem] != undefined && (item[elem] == null || item[elem] == '')) {
                item[elem] = null;
            }
        });
        return data;
    }

    static clearValidation(data, elem) {
        each(data, (item) => {
            if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
                delete item._behaviors.isRequired[elem];
                delete item._behaviors.isError[elem];
                delete item._behaviors.validMsg[elem];
            }
        });
        return data;
    }

    static clearSettlementPartner = function (data) {
        each(data, (item) => {
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

    static validateFlexDate(data, curPricingTable, wipData) {
        if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
            data = this.clearValidation(data, 'START_DT');
            var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
            var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
            var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
            //For multi tiers last record will have latest date, skipping duplicate DC_ID
            var filterData = uniq(sortBy(accrualEntries, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

            var minAccrualDate = new Date(Math.min.apply(null, filterData.map(function (x) { return new Date(x.START_DT); })));

            var drainingInvalidDates = drainingEntries.filter(
                (val) => StaticMomentService.moment(val.START_DT) < (StaticMomentService.moment(minAccrualDate).add(0, 'days'))
            );
        }
        return drainingInvalidDates;
    }

    static setFlexBehaviors(item, elem, cond, restrictGroupFlexOverlap) {
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
        else if (cond == 'invalidDate' && elem == 'START_DT') {
            item._behaviors.validMsg[elem] = "Accrual Date needs to start on or before the Draining dates";
        }
        return item;
    }

    static validateFlexRules(data, curPricingTable, wipData, restrictGroupFlexOverlap) {
        if (curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
            data = this.clearValidation(data, 'PAYOUT_BASED_ON');
            var accrualRule = true, drainingRule = true;
            var objectId = wipData ? 'DC_PARENT_ID' : 'DC_ID';
            var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
            var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
            var filterData = uniq(sortBy(accrualEntries, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
            accrualRule = filterData.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == filterData[0].PAYOUT_BASED_ON);
            drainingRule = drainingEntries.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == drainingEntries[0].PAYOUT_BASED_ON);
            if (accrualEntries.length > 0 && drainingRule && drainingEntries.length > 0) { restrictGroupFlexOverlap = true; }
            if (!accrualRule) {
                each(filterData, (item) => {
                    item = this.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'nequalpayout', restrictGroupFlexOverlap);
                });
            }
            if (!drainingRule) {
                each(drainingEntries, (item) => {
                    item = this.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'nequalpayout', restrictGroupFlexOverlap);
                });
            }
            if ((filterData.some(function (el) { return el.PAYOUT_BASED_ON.toUpperCase() == 'CONSUMPTION' })) && (drainingEntries.some(function (el) { return el.PAYOUT_BASED_ON.toUpperCase() == 'BILLINGS' }))) {
                var restrictedAccrualData = filterData.filter((val) => val.PAYOUT_BASED_ON.toUpperCase() == 'CONSUMPTION');
                var restrictedDraininngData = drainingEntries.filter((val) => val.PAYOUT_BASED_ON.toUpperCase() == 'BILLINGS');
                each(restrictedAccrualData, (item) => {
                    item = this.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'notallowed', restrictGroupFlexOverlap);
                });
                each(restrictedDraininngData, (item) => {
                    item = this.setFlexBehaviors(item, 'PAYOUT_BASED_ON', 'notallowed', restrictGroupFlexOverlap);
                });
            }
        }
        return data;
    }

    static clearEndCustomer = function (item) {
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

    static validateDate(dateType, contractData, existingMinEndDate) {
        contractData._behaviors.isError['START_DT'] =
            contractData._behaviors.isError['END_DT'] = false;
        contractData._behaviors.validMsg['START_DT'] =
            contractData._behaviors.validMsg['END_DT'] = "";

        var startDate = contractData.START_DT;
        var endDate = contractData.END_DT;

        if (dateType == 'START_DT') {
            if (StaticMomentService.moment(startDate).isAfter(endDate) || StaticMomentService.moment(startDate).isBefore(contractData.MinDate)) {
                contractData._behaviors.isError['START_DT'] = true;
                contractData._behaviors
                    .validMsg['START_DT'] = StaticMomentService.moment(startDate).isBefore(contractData.MinDate)
                        ? "Start date cannot be less than - " + contractData.MinDate
                        : "Start date cannot be greater than End Date";
            }
        } else {
            if (StaticMomentService.moment(endDate).isBefore(startDate) || StaticMomentService.moment(endDate).isAfter(contractData.MaxDate)) {
                contractData._behaviors.isError['END_DT'] = true;
                contractData._behaviors
                    .validMsg['END_DT'] = StaticMomentService.moment(endDate).isAfter(contractData.MaxDate)
                        ? "End date cannot be greater than - " + contractData.MaxDate
                        : "End date cannot be less than Start Date";
            }
            if (existingMinEndDate !== "" && contractData.PRC_ST != null && contractData.PRC_ST.length != 0) {
                if (StaticMomentService.moment(endDate).isBefore(existingMinEndDate)) {
                    contractData._behaviors.isError['END_DT'] = true;
                    contractData._behaviors
                        .validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + existingMinEndDate + " - if you have already created pricing strategies. ";
                }
            }
        }
        return contractData;
    }

    static validateTitles = function (dataItem, curPricingStrategy, contractData, curPricingTable, ptTitle) {
        var rtn = true;

        if (!curPricingStrategy) return true;
        var isPsUnique = lnavUtil.IsUniqueInList(contractData.PRC_ST, curPricingStrategy["TITLE"], "TITLE", true);
        var isPtUnique = !curPricingTable ? true : lnavUtil.IsUniqueInList(curPricingStrategy.PRC_TBL, curPricingTable["TITLE"], "TITLE", true);

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

    static validateMarketSegment = function (data, wipData, spreadDs) {
        data = this.clearValidation(data, 'MRKT_SEG');
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
        var filterData = uniq(sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
        var isMarketSegment = filterData.some((val) => val.MRKT_SEG == null || val.MRKT_SEG == '');
        if (isMarketSegment) {
            each(data, (item) => {
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

     static ValidateEndCustomer(data, actionName, curPricingStrategy, curPricingTable) {
        if (actionName !== "OnLoad") {
            each(data, (item) => {
                if (item._behaviors && item._behaviors.validMsg && item._behaviors.validMsg["END_CUSTOMER_RETAIL"] != undefined) {
                    item = this.clearEndCustomer(item);
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
                    each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                each(data, (item) => {
                                    item = this.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        each(data, (item) => {
                                            item = this.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                each(data, (item) => {
                                    item = this.setEndCustomer(item, 'Hybrid Vol_Tier Deal', curPricingTable);
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
                    each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                each(data, (item) => {
                                    item = this.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        each(data, (item) => {
                                            item = this.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                each(data, (item) => {
                                    item = this.setEndCustomer(item, 'Hybrid ' + curPricingTable['OBJ_SET_TYPE_CD'] + ' Deal', curPricingTable);
                                });
                            }
                        }
                    });
                }
            }
        }

        return data;
    }

    static setSettlementPartner = function (item, Cond) {
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

    static validateSettlementPartner = function (data, curPricingStrategy) {
        var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond = true;
        //check if settlement is cash and pgm type is backend
        var cashObj = data.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
        if (cashObj && cashObj.length > 0) {
            if (hybCond == '1') {
                retCond = data.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '' && val.SETTLEMENT_PARTNER == data[0].SETTLEMENT_PARTNER);
                if (!retCond) {
                    each(data, (item) => {
                        item = this.setSettlementPartner(item, '1');
                    });
                }
                else {
                    data = this.clearSettlementPartner(data);
                }
            }
            else {
                retCond = cashObj.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '');
                if (!retCond) {
                    each(data, (item) => {
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
                    data = this.clearSettlementPartner(data);
                }

            }
        }
        else {
            data = this.clearSettlementPartner(data);
        }
        return data;
    }

    static itemValidationBlock (data, key, mode, curPricingTable) {        
        //For multi tiers last record will have latest date, skipping duplicate DC_ID
        var filterData = uniq(sortBy(data, function (itm) { return itm.TIER_NBR }), function (obj) { return obj["DC_ID"] });

        var v1 = filterData.map((val) => val[key]).filter((value, index, self) => self.indexOf(value) === index);
        var hasNotNull = v1.some(function (el) { return el !== null && el != ""; });

        if (mode.indexOf("notequal") >= 0) { // Returns -1 if not in list 
            if (v1.length > 1 && hasNotNull) {
                each(data, (item) => {
                    if (!item._behaviors) item._behaviors = {};
                    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                    if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set error message
                        PTE_Load_Util.setBehaviors(item, key, 'notequal', curPricingTable);
                    }
                });
            }
        }
        if (mode.indexOf("equalblank") >= 0) { // Returns -1 if not in list
            if (hasNotNull == false && v1[0] !== "") {
                var v1List = data.filter((val) => val[key] === null);
                each(v1List, (item) => {
                    if (!item._behaviors) item._behaviors = {};
                    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                    if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set blank error message
                        PTE_Load_Util.setBehaviors(item, key, 'equalblank', curPricingTable);
                    }
                });
            }
        }
        //Additional check for settlement partner if AR Settlement Level is 'CASH'
        if (key == "SETTLEMENT_PARTNER" && !hasNotNull) {
            each(data, (item) => {
                if (!item._behaviors) item._behaviors = {};
                if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                if (item._behaviors.isReadOnly[key] === undefined && item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash') { // If not read only, set error message
                    PTE_Load_Util.setBehaviors(item, key, 'equalblank', curPricingTable);
                }
            });
        }

        if (key == "END_CUSTOMER_RETAIL") {
            var uniqueEndCustomerCountry = filterData.map((val) => val["PRIMED_CUST_CNTRY"]).filter((value, index, self) => self.indexOf(value) === index);
            if (uniqueEndCustomerCountry.length > 1) {
                each(data, (item) => {
                    if (!item._behaviors) item._behaviors = {};
                    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                    if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set error message
                        PTE_Load_Util.setBehaviors(item, key, 'notequal', curPricingTable);
                    }
                });
            }
        }

        return data;
    }
    // validate OverArching conditions
    static validateOverArching = function (data, curPricingStrategy, curPricingTable) {
        var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retZeroOAD = false, retZeroOAV = false;
        var isFlexAccrual = data.every((val) => val.FLEX_ROW_TYPE === 'Accrual');
        var isFlatRate = curPricingTable.OBJ_SET_TYPE_CD === 'VOL_TIER';
        //calling clear overarching in the begening
        data = this.clearValidation(data, 'REBATE_OA_MAX_AMT');
        data = this.clearValidation(data, 'REBATE_OA_MAX_VOL');
        //to fix a defect, setting the property value to same
        data = this.setToSame(data, 'REBATE_OA_MAX_AMT');
        data = this.setToSame(data, 'REBATE_OA_MAX_VOL');

        if (hybCond == '1' || isFlexAccrual) {
            //condition to check values are zero
            retZeroOAV = data.every((val) => val.REBATE_OA_MAX_VOL === 0);
            retZeroOAD = data.every((val) => val.REBATE_OA_MAX_AMT === 0);

            if (retZeroOAV) {
                each(data, (item) => {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero', curPricingTable);
                });
            }
            else if (retZeroOAD) {
                each(data, (item) => {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero', curPricingTable);
                });
            }
            var testMaxAmtValues = [];
            var testMaxAmtCount = 0;
            var testMaxVolValues = [];
            var testMaxVolCount = 0;
            var rebateMaxAmt;
            var rabateMaxVOL;
            each(data, (item) => {
                // Are both values populated on this item?
                if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT !== "") &&
                    (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL !== "")) {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
                }
                // Are both values empty for this item?
                if (!(isFlexAccrual == 1 || isFlatRate == true)) { // Pulls Flex/Vol Tier out of this test
                    if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") &&
                        (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL === null || item.REBATE_OA_MAX_VOL == "")) {
                        item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalemptyboth', curPricingTable);
                        item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalemptyboth', curPricingTable);
                    }
                }
                if (isFlatRate == true) { // Check single column for Vol Tier - must have values              
                    if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") &&
                        (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL === null || item.REBATE_OA_MAX_VOL == "")) {
                        item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                        item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
                    }
                }
                // Check for 0 values
                if (item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT === "0") {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero', curPricingTable);
                }
                if (item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL === "0") {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero', curPricingTable);
                }
                if (Number(item.TIER_NBR) == 1 && Number(item.NUM_OF_TIERS) > 1) {
                    rebateMaxAmt = item.REBATE_OA_MAX_AMT
                }
                else if (Number(item.TIER_NBR) == 1 && Number(item.NUM_OF_TIERS) == 1) {
                    rebateMaxAmt = item.REBATE_OA_MAX_AMT
                }
                else if(item.REBATE_OA_MAX_AMT != null && item.REBATE_OA_MAX_AMT !=undefined){
                    rebateMaxAmt = item.REBATE_OA_MAX_AMT
                }
                // Check for all values equal (tiers undefined is an ECAP Hybrid, tiers = 1 is a flex or VT Hybrid)
                if (rebateMaxAmt !== null && (item.NUM_OF_TIERS === undefined || (item.NUM_OF_TIERS.toString() === '1') || item.FLEX_ROW_TYPE === 'Accrual')) {
                    testMaxAmtCount++;
                    if (rebateMaxAmt !== undefined && testMaxAmtValues.indexOf(rebateMaxAmt.toString()) < 0) {
                        testMaxAmtValues.push(rebateMaxAmt.toString());
                    }
                }
                if (Number(item.TIER_NBR) == 1 && Number(item.NUM_OF_TIERS) > 1) {
                    rabateMaxVOL = item.REBATE_OA_MAX_VOL
                }
                else if (Number(item.TIER_NBR) == 1 && Number(item.NUM_OF_TIERS) == 1) {
                    rabateMaxVOL = item.REBATE_OA_MAX_VOL
                }
                else if(item.REBATE_OA_MAX_VOL != null && item.REBATE_OA_MAX_VOL !=undefined){
                    rabateMaxVOL = item.REBATE_OA_MAX_VOL
                }
                if (rabateMaxVOL !== null && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
                    testMaxVolCount++;
                    if (rabateMaxVOL !== undefined && testMaxVolValues.indexOf(rabateMaxVOL.toString()) < 0) {
                        testMaxVolValues.push(rabateMaxVOL.toString());
                    }
                }
            });
            // Check if this is a flex, and if it is, only accrual single tier rows count..
            var elementCount = isFlexAccrual != 1 ? data.length : data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual').length;
            if (testMaxAmtValues.length > 1 || (testMaxAmtCount > 0 && testMaxAmtCount != elementCount)) {
                each(data, (item) => {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'notequal', curPricingTable);
                });
            }
            if (testMaxVolValues.length > 1 || (testMaxVolValues.length > 0 && testMaxVolCount != elementCount)) {
                each(data, (item) => {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'notequal', curPricingTable);
                });
            }
            if (testMaxAmtValues.length > 0 && testMaxVolValues.length > 0) {
                each(data, (item) => {
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth', curPricingTable);
                    item = PTE_Load_Util.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth', curPricingTable);
                });
            }
        }
        return data;
    }
    static validateFlexRowType = function (data, curPricingStrategy, curPricingTable, wipData, spreadDs, restrictGroupFlexOverlap) {
        if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
            data = this.clearValidation(data, 'FLEX_ROW_TYPE');

            var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
            var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
            restrictGroupFlexOverlap = drainingEntries.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == "Consumption");

            if (drainingEntries.length > 0 && accrualEntries.length == 0) {
                each(data, (item) => {
                    item = this.setFlexBehaviors(item, 'FLEX_ROW_TYPE', 'flexrowtype', restrictGroupFlexOverlap);
                });
            }

            if (accrualEntries.length > 0) {
                this.validateOverArching(accrualEntries, curPricingStrategy, curPricingTable);
            }
            this.validateHybridFields(data, curPricingStrategy, curPricingTable, wipData, spreadDs);
        }
        return data;
    }
    static validateHybridFields = function (data, curPricingStrategy, curPricingTable) {
        var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT;            
        var isFlexDeal = curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
        //calling clear overarching in the begening

        if (hybCond == '1' || isFlexDeal) {
            data = this.clearValidation(data, 'REBATE_TYPE');
            data = this.clearValidation(data, 'PAYOUT_BASED_ON');
            data = this.clearValidation(data, 'CUST_ACCNT_DIV');
            data = this.clearValidation(data, 'GEO_COMBINED');
            data = this.clearValidation(data, 'PERIOD_PROFILE');
            data = this.clearValidation(data, 'RESET_VOLS_ON_PERIOD');
            data = this.clearValidation(data, 'PROGRAM_PAYMENT');
            data = this.clearValidation(data, 'SETTLEMENT_PARTNER');
            data = this.clearValidation(data, 'AR_SETTLEMENT_LVL');
            data = this.clearValidation(data, 'CONSUMPTION_TYPE');
            this.itemValidationBlock(data, "REBATE_TYPE", ["notequal", "equalblank"], curPricingTable);
            if (hybCond == "1") {
                this.itemValidationBlock(data, "PAYOUT_BASED_ON", ["notequal"], curPricingTable);
            }
            this.itemValidationBlock(data, "CUST_ACCNT_DIV", ["notequal"], curPricingTable);
            this.itemValidationBlock(data, "GEO_COMBINED", ["notequal", "equalblank"], curPricingTable);
            this.itemValidationBlock(data, "PERIOD_PROFILE", ["notequal", "equalblank"], curPricingTable);
            this.itemValidationBlock(data, "RESET_VOLS_ON_PERIOD", ["notequal", "equalblank"], curPricingTable);
            this.itemValidationBlock(data, "PROGRAM_PAYMENT", ["notequal", "equalblank"], curPricingTable);
            this.itemValidationBlock(data, "SETTLEMENT_PARTNER", ["notequal"], curPricingTable);
            this.itemValidationBlock(data, "AR_SETTLEMENT_LVL", ["notequal", "equalblank"], curPricingTable);
            this.itemValidationBlock(data, "CONSUMPTION_TYPE", ["notequal", "equalblank"], curPricingTable);
            if (isFlexDeal) {
                data = this.clearValidation(data, 'END_CUSTOMER_RETAIL', curPricingTable);
                this.itemValidationBlock(data, "END_CUSTOMER_RETAIL", ["notequal"], curPricingTable);
            }
        }
        return data;
    }
    //validate settlement level for hybrid 
    static validateSettlementLevel = function (data, curPricingStrategy) {
        var hybCond = curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond = false;
        //calling clear all validation
        data = this.clearValidation(data, 'AR_SETTLEMENT_LVL');
        if (hybCond == '1') {
            retCond = data.every((val) => val.AR_SETTLEMENT_LVL != null && val.AR_SETTLEMENT_LVL != '' && val.AR_SETTLEMENT_LVL ==
                data[0].AR_SETTLEMENT_LVL);
            if (!retCond) {
                each(data, (item) => {
                    this.setBehaviors(item, 'AR_SETTLEMENT_LVL', 'notequal');
                });
            }
        }
        return data;
    }

    static hasDuplicateProduct(pricingTableRows) {
        var rows = JSON.parse(JSON.stringify(pricingTableRows));
        var sortedRanges = rows.sort((previous, current) => {

            previous.START_DT = previous.START_DT instanceof Date ? previous.START_DT : new Date(previous.START_DT);
            current.END_DT = current.END_DT instanceof Date ? current.END_DT : new Date(current.END_DT);

            previous.END_DT = previous.END_DT instanceof Date ? previous.END_DT : new Date(previous.END_DT);
            current.START_DT = current.START_DT instanceof Date ? current.START_DT : new Date(current.START_DT);

            // get the start date from previous and current
            var previousTime = previous.START_DT.getTime();
            var currentTime = current.END_DT.getTime();

            // if the previous is earlier than the current
            if (previousTime < currentTime) {
                return -1;
            }

            // if the previous time is the same as the current time
            if (previousTime === currentTime) {
                return 0;
            }

            // if the previous time is later than the current time
            return 1;
        });

        var dictDuplicateProducts = {};

        var result = sortedRanges.reduce((result, current, idx, arr) => {
            // get the previous range
            if (idx === 0) { return result; }
            var previous = arr[idx - 1];


            // check for any overlap
            var previousEnd = previous.END_DT.getTime();
            var currentStart = current.START_DT.getTime();
            var overlap = (previousEnd >= currentStart);

            // store the result
            if (overlap) {
                if (previous.PTR_SYS_PRD !== "") {
                    var sysProducts = JSON.parse(previous.PTR_SYS_PRD);
                    for (var key in sysProducts) {
                        if (sysProducts.hasOwnProperty(key)) {
                            each(sysProducts[key], function (item) {
                                if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                    dictDuplicateProducts[item.PRD_MBR_SID] = previous.DC_ID;
                                } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(previous.DC_ID.toString()) < 0) {
                                    dictDuplicateProducts[item.PRD_MBR_SID] += "," + previous.DC_ID;
                                    if (result.duplicateProductDCIds[previous.DC_ID] == undefined) {
                                        result.duplicateProductDCIds[previous.DC_ID] = {
                                            "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                            "OverlapProduct": key
                                        }
                                    } else {
                                        result.duplicateProductDCIds[previous.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                        result.duplicateProductDCIds[previous.DC_ID].OverlapProduct += "," + key;
                                    }
                                }
                            });
                        }
                    }
                }

                if (current.PTR_SYS_PRD !== "") {
                    var sysProducts = JSON.parse(current.PTR_SYS_PRD);
                    for (var key in sysProducts) {
                        if (sysProducts.hasOwnProperty(key)) {
                            each(sysProducts[key], function (item) {
                                if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                    dictDuplicateProducts[item.PRD_MBR_SID] = current.DC_ID;
                                } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(current.DC_ID.toString()) < 0) {
                                    dictDuplicateProducts[item.PRD_MBR_SID] += "," + current.DC_ID;
                                    if (result.duplicateProductDCIds[current.DC_ID] == undefined) {
                                        result.duplicateProductDCIds[current.DC_ID] = {
                                            "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                            "OverlapProduct": key
                                        }
                                    } else {
                                        result.duplicateProductDCIds[current.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                        result.duplicateProductDCIds[current.DC_ID].OverlapProduct += "," + key;
                                    }
                                }
                            });
                        }
                    }
                }
            }

            return result;

            // seed the reduce  
        }, { overlap: false, duplicateProductDCIds: {} });

        // return the final results  
        return result;
    }

    static validateCustomerDivision(dictCustDivision, baseCustDiv, custDiv) {
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
}