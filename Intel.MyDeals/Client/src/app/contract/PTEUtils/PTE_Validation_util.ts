import { ContractUtil } from '../contract.util';
import { PTEUtil } from '../PTEUtils/PTE.util';
import { PTE_Helper_Util } from '../PTEUtils/PTE_Helper_util';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util';
import * as _ from 'underscore';

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

    static massagingObjectsForJSON (key, transformResult) {
        for (var validKey in transformResult.ValidProducts[key]) {
            transformResult.ValidProducts[key][validKey] = transformResult.ValidProducts[key][validKey].map(function (x) {
                return {
                    BRND_NM: x.BRND_NM,
                    CAP: x.CAP,
                    CAP_END: x.CAP_END,
                    CAP_START: x.CAP_START,
                    DEAL_PRD_NM: x.DEAL_PRD_NM,
                    DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                    DERIVED_USR_INPUT: x.DERIVED_USR_INPUT,
                    FMLY_NM: x.FMLY_NM,
                    HAS_L1: x.HAS_L1,
                    HAS_L2: x.HAS_L2,
                    HIER_NM_HASH: x.HIER_NM_HASH,
                    HIER_VAL_NM: x.HIER_VAL_NM,
                    MM_MEDIA_CD: x.MM_MEDIA_CD,
                    MTRL_ID: x.MTRL_ID,
                    MTRL_TYPE_CD: x.MTRL_TYPE_CD == undefined ? "" : x.MTRL_TYPE_CD,
                    PCSR_NBR: x.PCSR_NBR,
                    PRD_ATRB_SID: x.PRD_ATRB_SID,
                    PRD_CAT_NM: x.PRD_CAT_NM,
                    PRD_END_DTM: x.PRD_END_DTM,
                    PRD_MBR_SID: x.PRD_MBR_SID,
                    PRD_STRT_DTM: x.PRD_STRT_DTM,
                    USR_INPUT: x.USR_INPUT,
                    YCS2: x.YCS2,
                    YCS2_END: x.YCS2_END,
                    YCS2_START: x.YCS2_START,
                    EXCLUDE: x.EXCLUDE,
                    NAND_TRUE_DENSITY: x.NAND_TRUE_DENSITY ? x.NAND_TRUE_DENSITY : ''
                }
            });
        }
        return transformResult;
    }

    static validateMultiGeoForHybrid (data) {
        //This is Comma Separated GEOS
        var prod_used = [];
        for (var i = 0; i < data.length; i++) {
            //Add Products
            if (data[i].IS_HYBRID_PRC_STRAT == "1") {
                var temp_split = (data[i].PTR_USER_PRD.toLowerCase().trim().split(/\s*,\s*/));
                for (var j = 0; j < temp_split.length; j++) {
                    prod_used.push(temp_split[j]);
                }
            }
            //Checking GEO
            //Added a check to check for Geo_Combined only if it exists.
            if (data[i].GEO_COMBINED && data[i].GEO_COMBINED.indexOf(',') > -1 && data[i].IS_HYBRID_PRC_STRAT == "1") {
                var firstBracesPos = data[i].GEO_COMBINED.lastIndexOf('[');
                var lastBracesPos = data[i].GEO_COMBINED.lastIndexOf(']');
                var lastComma = data[i].GEO_COMBINED.lastIndexOf(',');
                if (lastComma > lastBracesPos) {
                    return "1";
                }
            }
        }
        //This is to Check Product Line
        if (prod_used.length > 0) {
            var uniq = prod_used
                .map(function (e) {
                    return e;
                }).reduce((a, b) => {
                    a[b] = (a[b] || 0) + 1;
                    return a
                }, {})
            //Duplicate Product Check
            var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1)
            if (duplicates.length > 0) {
                return "2";
            }
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
                var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"];
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
    static ValidateEndCustomer(data: any, actionName: string, isHybrid, objSetTypeCd) {
        if (actionName !== "OnLoad") {
            _.each(data, (item) => {
                if (item._behaviors && item._behaviors.validMsg && item._behaviors.validMsg["END_CUSTOMER_RETAIL"] != undefined) {
                    item = ContractUtil.clearEndCustomer(item);
                }
            });
        }
        if (isHybrid === '1' && (objSetTypeCd === "VOL_TIER" || objSetTypeCd === "ECAP")) {
            var rebateType = data.filter(ob => ob.REBATE_TYPE.toLowerCase() == 'tender');
            if (rebateType && rebateType.length > 0) {
                if (data.length > 1) {
                    var endCustObj = ""
                    if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                        endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                    }
                    _.each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', objSetTypeCd);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    _.each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        _.each(data, (item) => {
                                            item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', objSetTypeCd);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid Vol_Tier Deal', objSetTypeCd);
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
                    _.each(data, (item) => {
                        var parsedEndCustObj = "";
                        if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                            parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid ' + objSetTypeCd + ' Deal', objSetTypeCd);
                                });
                            }
                            else {
                                for (var i = 0; i < parsedEndCustObj.length; i++) {
                                    var exists = false;
                                    _.each(endCustObj, (item) => {
                                        if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                            item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                            exists = true;
                                        }
                                    });
                                    if (!exists) {
                                        _.each(data, (item) => {
                                            item = ContractUtil.setEndCustomer(item, 'Hybrid ' + objSetTypeCd + ' Deal', objSetTypeCd);
                                        });
                                        i = parsedEndCustObj.length;
                                    }
                                }
                            }
                        }
                        if (endCustObj == "" || parsedEndCustObj == "") {
                            if (parsedEndCustObj.length != endCustObj.length) {
                                _.each(data, (item) => {
                                    item = ContractUtil.setEndCustomer(item, 'Hybrid ' + objSetTypeCd + ' Deal', objSetTypeCd);
                                });
                            }
                        }
                    });
                }
            }
        }
        return data;
    }
    static validateDeal(data: Array<any>, curPricingTable, curPricingStrategy): any {
        _.each(data, (item) => {
            //defaulting the behaviours object
            PTEUtil.setBehaviors(item);
        });
        if (curPricingTable.OBJ_SET_TYPE_CD == 'ECAP') {
            return this.validateECAP(data);
        }
        this.ValidateEndCustomer(data, 'SaveAndValidate', curPricingStrategy.IS_HYBRID_PRC_STRATEGY, curPricingTable.OBJ_SET_TYPE_CD)
    }
    static validateECAP(data: Array<any>): any {
        //check for Ecap price 
        _.each(data, (item) => {
            //defaulting the behaviours object
            if (item.ECAP_PRICE["20___0"] == null || item.ECAP_PRICE["20___0"] == 0 || item.ECAP_PRICE["20___0"] == '' || item.ECAP_PRICE["20___0"] < 0) {
                PTEUtil.setBehaviorsValidMessage(item, 'ECAP_PRICE', 'ECAP', 'equal-zero');
            }
        });
        return data;
    }    
}