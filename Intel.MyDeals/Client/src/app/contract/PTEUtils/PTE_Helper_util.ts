import { PTEUtil } from "./PTE.util";
import { PTE_Load_Util } from "./PTE_Load_util";

export class PTE_Helper_Util {
    static getFormatedGeos (geos) {
        if (geos == null) { return null; }
        var isBlendedGeo = (geos.indexOf('[') > -1) ? true : false;
        if (isBlendedGeo) {
            geos = geos.replace('[', '');
            geos = geos.replace(']', '');
            geos = geos.replace(' ', '');
        }
        return geos;
    }

    //// <summary>
    //// Formats a given dictionary key to a format that ignores spaces and capitalization for easier key comparisons.
    //// Note that all keys put into the dealGrpKey should use this function for proper deal grp name merging validation.
    //// </summary>
    static formatStringForDictKey (valueToFormat) {
        var result = "";
        if (valueToFormat != null) {
            result = valueToFormat.toString().toUpperCase().replace(/\s/g, "");
        }
        return result;
    }

    static isInt (value) {
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };

    static hasDataOrPurge (data, rowStart, rowStop) {
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

    /// <summary>
    //	Sanitize data to remove non-ascii characters and hidden line breaks (Mainly for excel copy/paste)
    /// </summary>
    static sanitizeString (stringToSanitize, lineBreakReplacementCharacter) {
        var lineBreakMatches = stringToSanitize.match(/\r?\n|\r/g);
        if (lineBreakReplacementCharacter == null) { lineBreakReplacementCharacter = ""; }

        //stringToSanitize = stringToSanitize.replace(/[^\x00-\x7F]/g, ""); // NOTE: Remove non-ASCII characters (also takes out hidden characters that causes js dictionary breaking)
        stringToSanitize = stringToSanitize.replace(/\r?\n\r?\n?|\n|\r/g, lineBreakReplacementCharacter) // replace all new line characters with commas

        return stringToSanitize;
    }

    static fromOaDate (oadate) {
        var date = new Date(((oadate - 25569) * 86400000));
        var tz = date.getTimezoneOffset();
        return new Date(((oadate - 25569 + (tz / (60 * 24))) * 86400000));
    }

    static clearBehaviors (item, elem) {
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

    static colToInt (colName, rootColToLetter) {
        return rootColToLetter[colName].charCodeAt(0) - "A".charCodeAt(0);
    }

    static isCustDivisonNull (data, custAccntDiv) {
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

    static CalculateFirstEdiatableBeforeProductCol (editableColsBeforeProduct, firstEditableColBeforeProduct, rootColToLetter) {
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

    static RemoveGhostRows (pricingTableRow, rootSpreadDsData) {
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

    static setIndex (objTypeCd, rootColToLetter, intA) {
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

    static resetDirty () {
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

    static GetFirstEdiatableBeforeProductCol (firstEditableColBeforeProduct, editableColsBeforeProduct, rootColToLetter) {
        if (firstEditableColBeforeProduct !== null) {
            return firstEditableColBeforeProduct;
        } else {
            return PTE_Helper_Util.CalculateFirstEdiatableBeforeProductCol(editableColsBeforeProduct, firstEditableColBeforeProduct, rootColToLetter);
        }
    }

    static getColor(k, c, colorDictionary) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }

    static deNormalizeData = function (data, curPricingTable, kitDimAtrbs, maxKITproducts) {      //convert how we keep data in UI to MT consumable format
        if (!PTE_Load_Util.isPivotable(curPricingTable)) return data;
        //For multi tiers last record will have latest date, skipping duplicate DC_ID
        var a;
        var newData = [];
        var lData = {};
        var tierDimKey = "_____10___";
        var prodDimKey = "_____20___";

        var dimKey;
        var dimAtrbs;
        var isKit = 0;
        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
        var densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
        let dealType = curPricingTable['OBJ_SET_TYPE_CD'];

        if (dealType === "VOL_TIER" || dealType === "FLEX" ||
            dealType === "REV_TIER" || dealType === "DENSITY") {
            dimKey = tierDimKey;
            dimAtrbs = tierAtrbs;
        }
        else if (dealType === "KIT") {
            dimKey = prodDimKey;
            dimAtrbs = kitDimAtrbs;
            isKit = 1;
        }

        var prevTier = 1, densityBand = 1;

        for (var d = 0; d < data.length; d) {
            var numTiers = PTE_Load_Util.numOfPivot(data[d], curPricingTable);      //KITTODO: rename numTiers to more generic var name for kit deals?
            if (dealType == "DENSITY") {
                let numDensityBands = parseInt(data[d]["NUM_OF_DENSITY"]);
                let densityNumTiers = numTiers / numDensityBands;
                let prevRow = (d == 0) ? parseInt(data[d]["DC_ID"]) : parseInt(data[d - 1]["DC_ID"]);
                let curRow = parseInt(data[d]["DC_ID"]);
                let count = 0;

                for (var x = 1 - isKit; x <= numTiers - isKit; x++) {
                    if (prevTier != data[d].TIER_NBR || prevRow != curRow) { densityBand = 1; prevTier = data[d].TIER_NBR; }
                    if (prevRow != curRow) {
                        count = d;
                        curRow = prevRow;
                    }
                    else {
                        count = (d == 0) ? 0 : (count + numDensityBands);
                    }
                    if (x === 1 - isKit) { lData = data[d]; }
                    for (a = 0; a < densityTierAtrbs.length; a++) { // each tiered attribute
                        if (dealType == "DENSITY" && densityTierAtrbs[a] == "DENSITY_RATE") {
                            let densityDimKey = "_____8___";
                            lData[densityTierAtrbs[a] + densityDimKey + densityBand + "____10___" + data[d].TIER_NBR] = data[d][densityTierAtrbs[a]];
                            densityBand++;
                        }
                        else {
                            let densityDimKey = (densityTierAtrbs[a] == "DENSITY_BAND") ? "_____8___" : "_____10___";

                            if ((densityTierAtrbs[a] == "DENSITY_BAND") && x <= numDensityBands) {
                                lData[densityTierAtrbs[a] + densityDimKey + x] = data[d][densityTierAtrbs[a]];
                            }
                            else if (densityTierAtrbs[a] != "DENSITY_BAND" && x <= densityNumTiers) {
                                lData[densityTierAtrbs[a] + densityDimKey + x] = data[count][densityTierAtrbs[a]];
                            }
                        }
                        if (x === numTiers - isKit) { // last tier
                            delete lData[densityTierAtrbs[a]];
                        }
                    }
                    d++;
                    if (d === data.length) {
                        break;
                    }
                }

            }
            else {

                for (var t = 1 - isKit; t <= numTiers - isKit; t++) { // each tier
                    if (t === 1 - isKit) { lData = data[d]; }
                    for (a = 0; a < dimAtrbs.length; a++) { // each tiered attribute
                        lData[dimAtrbs[a] + dimKey + t] = data[d][dimAtrbs[a]];

                        if (t === numTiers - isKit) { // last tier
                            delete lData[dimAtrbs[a]];

                            if (dealType === "KIT") {
                                // Clear out the dimensions of the not-in-use tiers because KIT has dynamic tiering,
                                //		which might leave those dimensions with data, and save stray attributes with no product association in our db.
                                for (var i = 0; i < maxKITproducts; i++) {
                                    var tierToDel = (t + 1 + i);
                                    lData[dimAtrbs[a] + dimKey + tierToDel] = "";
                                }
                            }
                        }
                    }
                    // NOTE: the length of the data is the number of rows. But we need to iterate by the number of
                    //		normalized rows (which we are creating now) due to tiered dimensions in VOL-TIER and KIT.
                    //		Hence why we increment d and break on d === data.length manually.
                    //		Basically,  this d-incrementing code is mimicking a skip of rows in "data" that are not of tier_nbr 1.
                    //		But also we can't just put a "tier_nbr != 1" check because we still need to use data[d] of each corresponding tier.
                    d++;
                    if (d === data.length) {
                        break;
                    }
                }

            }
            newData.push(lData);
        }

        return newData;
    }  
}