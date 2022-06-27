function pricingtableutil() { }

//1
pricingtableutil.getFormatedGeos = function (geos) {
    if (geos == null) { return null; }
    var isBlendedGeo = (geos.indexOf('[') > -1) ? true : false;
    if (isBlendedGeo) {
        geos = geos.replace('[', '');
        geos = geos.replace(']', '');
        geos = geos.replace(' ', '');
    }
    return geos;
}

//2
//// <summary>
//// Formats a given dictionary key to a format that ignores spaces and capitalization for easier key comparisons.
//// Note that all keys put into the dealGrpKey should use this function for proper deal grp name merging validation.
//// </summary>
pricingtableutil.formatStringForDictKey = function (valueToFormat) {
    var result = "";
    if (valueToFormat != null) {
        result = valueToFormat.toString().toUpperCase().replace(/\s/g, "");
    }
    return result;
}

//3
pricingtableutil.isInt = function (value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

//4
pricingtableutil.hasDataOrPurge = function (data, rowStart, rowStop) {
    var ids = [];
    if (data.length === 0) return ids;
    for (var n = rowStop; n >= rowStart; n--) {
        if (!!data[n]) {
            if (data[n].DC_ID !== null && data[n].DC_ID > 0) {
                if (ids.indexOf(data[n].DC_ID) < 0) ids.push(data[n].DC_ID);
            } else if (data[n].DC_ID !== null && data[n].DC_ID < 0) {
                data.splice(n, 1);
            }
        }
    }
    return ids;
}

//5
/// <summary>
//	Sanitize data to remove non-ascii characters and hidden line breaks (Mainly for excel copy/paste)
/// </summary>
pricingtableutil.sanitizeString = function (stringToSanitize, lineBreakReplacementCharacter) {
    var lineBreakMatches = stringToSanitize.match(/\r?\n|\r/g);
    if (lineBreakReplacementCharacter == null) { lineBreakReplacementCharacter = ""; }

    //stringToSanitize = stringToSanitize.replace(/[^\x00-\x7F]/g, ""); // NOTE: Remove non-ASCII characters (also takes out hidden characters that causes js dictionary breaking)
    stringToSanitize = stringToSanitize.replace(/\r?\n\r?\n?|\n|\r/g, lineBreakReplacementCharacter) // replace all new line characters with commas

    return stringToSanitize;
}

//6
pricingtableutil.getCorrectedPtrUsrPrd = function (userInpProdName) {
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

//7
// Combine the valid and invalid JSON into single object, corrector understands following object type
pricingtableutil.buildTranslatorOutputObject = function (invalidProductJSONRows, data) {
    angular.forEach(invalidProductJSONRows, function (item) {
        var inValidJSON = JSON.parse(item.PTR_SYS_INVLD_PRD);
        var validJSON = (item.PTR_SYS_PRD != null && item.PTR_SYS_PRD != "") ? JSON.parse(item.PTR_SYS_PRD) : "";
        data.ValidProducts[item.ROW_NUMBER] = validJSON;
        data.ProdctTransformResults[item.ROW_NUMBER] = inValidJSON.ProdctTransformResults;
        data.DuplicateProducts[item.ROW_NUMBER] = inValidJSON.DuplicateProducts;
        data.InValidProducts[item.ROW_NUMBER] = inValidJSON.InValidProducts;
    });
    return data;
}

//8
//Trimming unwanted Property to make JSON light
pricingtableutil.massagingObjectsForJSON = function (key, transformResult) {
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

//9
pricingtableutil.getFullNameOfProduct = function (item, prodName) {
    if (item.PRD_ATRB_SID > 7005) return prodName;
    return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
}

//10
pricingtableutil.validateMultiGeoForHybrid = function (data) {
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

//11
pricingtableutil.fromOaDate = function (oadate) {
    var date = new Date(((oadate - 25569) * 86400000));
    var tz = date.getTimezoneOffset();
    return new Date(((oadate - 25569 + (tz / (60 * 24))) * 86400000));
}

//12 
pricingtableutil.splitProductForDensity = function (response) {
    let prdObj = {};
    //skipping the excluded products
    _.each(response.validateSelectedProducts, (prdDet, prd) => {
        if (prdDet && prdDet.length > 0 && !prdDet[0].EXCLUDE) {
            prdObj[`${prd}`] = prdDet;
        }
    });

    if (response.splitProducts) {
        let prod = {};
        let items = _.keys(prdObj);
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

//13
pricingtableutil.mapTieredWarnings = function (dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
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

//14
pricingtableutil.clearBehaviors = function (item, elem) {
    if (!item._behaviors) item._behaviors = {};
    if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
    if (!item._behaviors.isError) item._behaviors.isError = {};
    if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    // removing the key because in setRowIdStyle it check for objects not for value
    delete item._behaviors.isRequired[elem];
    delete item._behaviors.isError[elem];
    delete item._behaviors.validMsg[elem];
}

//15
pricingtableutil.colToInt = function (colName, rootColToLetter) {
    return rootColToLetter[colName].charCodeAt(0) - "A".charCodeAt(0);
}

//16
pricingtableutil.isCustDivisonNull = function (data, custAccntDiv) {
    if (custAccntDiv != "") {
        for (var i = 0; i < data.length; i++) {
            if (data[i].CUST_ACCNT_DIV == null || data[i].CUST_ACCNT_DIV == "") {
                return true;
            }
        }
        return false;
    }
    else {
        return false;
    }
}

//17
pricingtableutil.CalculateFirstEdiatableBeforeProductCol = function (editableColsBeforeProduct, firstEditableColBeforeProduct, rootColToLetter) {
    if (editableColsBeforeProduct.length > 0) {
        for (var i = 0; i < editableColsBeforeProduct.length; i++) {
            if (firstEditableColBeforeProduct === null) {
                firstEditableColBeforeProduct = editableColsBeforeProduct[i];
            } else if (rootColToLetter[firstEditableColBeforeProduct] > rootColToLetter[editableColsBeforeProduct[i]]) {
                // set to new firstEditableColBeforeProduct if that column is the before the previous firstEditableColBeforeProduct because they might be out of order
                firstEditableColBeforeProduct = editableColsBeforeProduct;
            }
        }
    } else {
        firstEditableColBeforeProduct = "PTR_USER_PRD";
    }

    return firstEditableColBeforeProduct;
}

//18
pricingtableutil.anyPtrDirtyValidation = function ($linq, pricingTableRow) {
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

//19
pricingtableutil.getUserInput = function (updatedUserInput, products, typeOfProduct, fieldNm, $filter) {

    var userInput = products.filter(function (x) {
        return x.EXCLUDE === (typeOfProduct === "E");
    });
    userInput = $filter('unique')(userInput, fieldNm);

    userInput = userInput.map(function (elem) {
        return elem[fieldNm];
    }).join(",");

    if (userInput !== "") {
        updatedUserInput = updatedUserInput === "" || fieldNm !== 'HIER_VAL_NM' ? userInput : updatedUserInput + "," + userInput;
    }
    return updatedUserInput;
}

//20
pricingtableutil.FixEcapKitField = function (pricingTableRow) {
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

//21
pricingtableutil.updateProductBucket = function (row, pivottedRows, productBcktName, numTier, tierNumber, productJSON, $filter) {
    var row = angular.copy(row);

    // Case
    var buckProd = $filter('filter')(pivottedRows, function (item) {
        return item['DC_ID'] == row['DC_ID'] && item['PRD_BCKT'].toLowerCase() == productBcktName.toLowerCase();
    }, true);

    if (buckProd.length === 0) { // no corresponding row (essentially a new row)
        row["PRD_BCKT"] = productBcktName;

        // Tender only colums
        row["CAP"] = productJSON[productBcktName] !== undefined ? productJSON[productBcktName][0].CAP : "";
        row["YCS2"] = productJSON[productBcktName] !== undefined ? productJSON[productBcktName][0].YCS2 : "";

        // Clear out any tiered values because this is an essentially new row.  Do not clear out unless it comes from a relevant user action - we don't want this to happen when the product corrects in-place to what we have defined in the system (i.e. after user manual copy paste or typed entry).
        row["ECAP_PRICE"] = 0;
        row["DSCNT_PER_LN"] = 0;
        row["QTY"] = 1;
        row["TEMP_TOTAL_DSCNT_PER_LN"] = 0;
    } else {
        row = buckProd[0]; //Select the first one even of there are duplicates
        row["CAP"] = productJSON[productBcktName] !== undefined ? productJSON[productBcktName][0].CAP : "";
        row["YCS2"] = productJSON[productBcktName] !== undefined ? productJSON[productBcktName][0].YCS2 : "";
    }
    row["NUM_OF_TIERS"] = numTier;
    row["TIER_NBR"] = tierNumber + 1;

    // For deal group merge to work only the Tier 1 needs to have deal group name
    if (row["TIER_NBR"] != 1) {
        row['DEAL_GRP_NM'] = null;
    }
    return row;
}

//22
// Converts JSON sysproducts to array
pricingtableutil.populateValidProducts = function (sysProducts, $filter) {
    var kitReOrderObject = { 'ReOrderedJSON': '', 'PRD_DRAWING_ORD': '' };

    var addedProducts = [];
    for (var key in sysProducts) {
        if (sysProducts.hasOwnProperty(key)) {
            angular.forEach(sysProducts[key], function (item) {
                addedProducts.push(item);
            });
        }
    }
    // Orders KIT products
    addedProducts = $filter('kitProducts')(addedProducts, 'DEAL_PRD_TYPE');
    var pricingTableSysProducts = {};
    // Construct the new reordered JSON for KIT, if user input is Ci3, derived user input will be selected products
    angular.forEach(addedProducts, function (item, key) {
        if (!pricingTableSysProducts.hasOwnProperty(item.DERIVED_USR_INPUT)) {
            pricingTableSysProducts[item.DERIVED_USR_INPUT] = [item];
        } else {
            pricingTableSysProducts[item.DERIVED_USR_INPUT].push(item);
        }
    });

    kitReOrderObject.ReOrderedJSON = pricingTableSysProducts;
    kitReOrderObject.PRD_DRAWING_ORD = addedProducts.map(function (p) {
        return p.PRD_MBR_SID;
    }).join(',');

    kitReOrderObject.contractProducts = addedProducts.map(function (p) {
        return p.DERIVED_USR_INPUT;
    }).join(',');

    return kitReOrderObject;
}

//23
//To Remove Ghost Rows from the pricing table
pricingtableutil.RemoveGhostRows = function (pricingTableRow, rootSpreadDsData) {
    for (var i = 0; i < pricingTableRow.length; i++) {
        if (pricingTableRow.length != rootSpreadDsData.length) {
            if (i < rootSpreadDsData.length) {
                if (rootSpreadDsData[i].DC_ID != pricingTableRow[i].DC_ID) {
                    pricingTableRow.splice(i, 1);
                    i--;
                }
            }
            else {
                pricingTableRow.splice(i, 1);
                i--;
            }
        }
    }
}

//24
pricingtableutil.setIndex = function (objTypeCd, rootColToLetter, intA) {
    let endVolIndex;
    let strtVolIndex;
    let rateIndex;
    if (objTypeCd === "VOL_TIER" || objTypeCd === "FLEX") {
        endVolIndex = (rootColToLetter["END_VOL"].charCodeAt(0) - intA);
        strtVolIndex = (rootColToLetter["STRT_VOL"].charCodeAt(0) - intA);
        rateIndex = (rootColToLetter["RATE"].charCodeAt(0) - intA);
    }
    else if (objTypeCd === "REV_TIER") {
        endVolIndex = (rootColToLetter["END_REV"].charCodeAt(0) - intA);
        strtVolIndex = (rootColToLetter["STRT_REV"].charCodeAt(0) - intA);
        rateIndex = (rootColToLetter["INCENTIVE_RATE"].charCodeAt(0) - intA);
    }
    else {
        endVolIndex = (rootColToLetter["END_PB"].charCodeAt(0) - intA);
        strtVolIndex = (rootColToLetter["STRT_PB"].charCodeAt(0) - intA);
        rateIndex = (rootColToLetter["DENSITY_RATE"].charCodeAt(0) - intA);
    }
    return { endVolIndex, strtVolIndex, rateIndex };
}

//25
// Reset relative dirty bits
pricingtableutil.resetDirty = function () {
    var field = "isDirty";
    //var mainData = $scope.mainGridOptions.dataSource.data();

    //if ($scope.dataGrid !== undefined) {
    //	for (var i = 0; i < $scope.dataGrid.length; i++) {
    //		if (mainData[i] !== undefined) mainData[i]._dirty = false;
    //		angular.forEach(mainData[i],
    //            function (value, key) {
    //            	var item = mainData[i];
    //            	if (item._behaviors[field] === undefined) item._behaviors[field] = {};
    //            	item._behaviors[field][key] = false;

    //            	//_MultiDim
    //            	if (!util.isNull(root.gridDetailsDs[item["DC_ID"]])) {
    //            		var detailData = root.gridDetailsDs[item["DC_ID"]].data();
    //            		for (var ii = 0; ii < item._MultiDim.length; ii++) {
    //            			detailData[ii]._dirty = false;
    //            			angular.forEach(detailData[ii],
    //                            function (v1, k1) {
    //                            	var item2 = detailData[ii];
    //                            	if (item2._behaviors === undefined || item2._behaviors === null) item2._behaviors = {};
    //                            	if (item2._behaviors[field] === undefined || item2._behaviors[field] === null) item2._behaviors[field] = {};
    //                            	item2._behaviors[field][k1] = false;
    //                            });
    //            		}
    //            	}
    //            });
    //	}
    //}
}

//26
pricingtableutil.clearDensityValidation = function (DCID, objTypeCd, rootSpreadDsData) {
    //the same function is called from onChange when there is a delete 
    if (objTypeCd == "DENSITY") {
        let data = rootSpreadDsData;
        _.each(data, (itm) => {
            if (itm.DC_ID == DCID) {
                pricingtableutil.clearBehaviors(itm, 'DENSITY_BAND');
                pricingtableutil.clearBehaviors(itm, 'DC_ID');
                itm.DENSITY_BAND = null;
            }
        });
    }
}

//27
pricingtableutil.GetFirstEdiatableBeforeProductCol = function (firstEditableColBeforeProduct, editableColsBeforeProduct, rootColToLetter) {
    if (firstEditableColBeforeProduct !== null) {
        return firstEditableColBeforeProduct;
    } else {
        return pricingtableutil.CalculateFirstEdiatableBeforeProductCol(editableColsBeforeProduct, firstEditableColBeforeProduct, rootColToLetter);
    }
}

//28
pricingtableutil.warningHandler = function (pricingTableData, kitDimAtrbs) {
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
                        pricingtableutil.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);
                    }
                }
                for (var a = 0; a < relevantAtrbs.length; a++) {
                    delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                }
            }
        }
    }
}

//29
pricingtableutil.setModalOptions = function (confirmationModPerDealGrp, key, maxKITproducts) {
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