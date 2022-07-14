
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
}