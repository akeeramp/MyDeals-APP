import { opGridTemplate } from "../../core/angular.constants"
import { colorDictionary } from "../../core/angular.constants";
export class DE_Load_Util {
    static assignColSettings(wipTemplate, objSetTypeCd) {
        var cnt = 0;
        var indxs = [];
        var columnKeys = Object.keys(opGridTemplate.templates[`${objSetTypeCd}`]);
        for (var i = 0; i < columnKeys.length; i++) {
            indxs[columnKeys[i]] = cnt++;
        }
        for (var i = 0; i < wipTemplate.columns.length; i++) {
            wipTemplate.columns[i].indx = indxs[wipTemplate.columns[i].field] === undefined ? 0 : indxs[wipTemplate.columns[i].field];
            wipTemplate.columns[i].hidden = false;
        }
        var zeroIndexColumns = wipTemplate.columns.filter(x => x.indx == 0);
        if (zeroIndexColumns != undefined && zeroIndexColumns != null && zeroIndexColumns.length > 0) {
            var indexes = (zeroIndexColumns.length - 1) * -1;
            for (var i = 0; i < wipTemplate.columns.length; i++) {
                for (var j = 0; j < zeroIndexColumns.length; j++) {
                    if (wipTemplate.columns[i].field == zeroIndexColumns[j].field) {
                        wipTemplate.columns[i].indx = indexes++;
                        break;
                    }
                }
            }
        }
        wipTemplate.columns = wipTemplate.columns.sort((a, b) => (a.indx > b.indx) ? 1 : -1);
    }

    static removeWipColumns(wipTemplate, isTenderContract) {
        for (var i = wipTemplate.columns.length - 1; i >= 0; i--) {
            // For tender deals hide these columns
            if (typeof wipTemplate.columns[i] !== "undefined" &&
                opGridTemplate.hideForTender.indexOf(wipTemplate.columns[i].field) !== -1 && isTenderContract) {
                wipTemplate.columns.splice(i, 1);
            }
            // For non tender deals hide these columns
            if (typeof wipTemplate.columns[i] !== "undefined" && opGridTemplate.hideForNonTender.indexOf(wipTemplate.columns[i].field) !== -1 && !isTenderContract) {
                wipTemplate.columns.splice(i, 1);
            }
            // For standard deal editor hide these columns
            if (typeof wipTemplate.columns[i] !== "undefined" && opGridTemplate.hideForStandardDealEditor.indexOf(wipTemplate.columns[i].field) !== -1) {
                wipTemplate.columns.splice(i, 1);
            }
        }
        if (!isTenderContract) {
            for (var i = 0; i < opGridTemplate.hideForNonTender.length; i++) {
                delete wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
            }
        }
        else {
            for (var i = 0; i < opGridTemplate.hideForTender.length; i++) {
                delete wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
            }
        }

        for (var i = 0; i < opGridTemplate.hideForStandardDealEditor.length; i++) {
            delete wipTemplate.model.fields[opGridTemplate.hideForNonTender[i]];
        }
    }

    static getRules(dealType) {
        var groups = opGridTemplate.groups[`${dealType}`];
        var newArray = [];
        for (var i = 0; i < groups.length; i++) {
            newArray.push({ "name": groups[i].name, "order": groups[i].order, "isTabHidden": false, "rules": groups[i].rules, "numErrors": 0 })
        }
        groups = newArray;
        groups = groups.sort((a, b) => (a.order > b.order) ? 1 : -1);
        return groups;
    }

    static getHideIfAllrules(groups) {
        var hideIfAll: any = [];
        if (groups != null && groups != undefined && groups.length > 0) {
            for (var g = 0; g < groups.length; g++) {
                var group = groups[g];
                if (group.rules != undefined) {
                    for (var r = 0; r < group.rules.length; r++) {
                        if (group.rules[r].logical === "HideIfAll") {
                            group.rules[r].name = group.name;
                            group.rules[r].show = false;
                            hideIfAll.push(group.rules[r]);
                        }
                    }
                }
            }
        }
        return hideIfAll;
    }

    static kitCalculatedValues = function (items, kittype, column) {
        var data = items["ECAP_PRICE"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - also are QTY and dscnt_per_line required columns? if not we are going to need to put in checks
        if (data === undefined) return "";
        var total = 0.00;
        var subkitSumCounter = 2;   //subkits are always going to be the primary and first secondary item, so only sum those two dims in that case

        for (var dimkey in data) {
            if (subkitSumCounter == 0) {
                break;
            }
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {
                if (kittype == "subkit") {
                    subkitSumCounter--;
                }
                var qty = 1;
                if (items["QTY"] && items["QTY"] != null) {
                    qty = parseInt(items["QTY"][dimkey] || 0);
                }
                if (column == "rebateBundle" && items["ECAP_PRICE"] !== undefined) {
                    if (items["ECAP_PRICE"][dimkey] != undefined && items["ECAP_PRICE"][dimkey] != null)
                        total += qty * parseFloat(items["ECAP_PRICE"][dimkey].toString().replace(/,|$/g, ''));
                }
                if (column == "sumTD" && items["DSCNT_PER_LN"] !== undefined) {
                    total += qty * items["DSCNT_PER_LN"][dimkey];
                }
            }
        }

        if (column == "rebateBundle") {
            if (kittype == "subkit") {
                total = total - items["ECAP_PRICE"]["20_____2"];
            }
            if (kittype == "kit") {
                total = total - items["ECAP_PRICE"]["20_____1"];
            }
        }
        return total;
    }

    static calcBackEndRebate(items, dealType, atrb2, dim2) {
        if (dealType == "ECAP") {
            return this.calculateECAPBackEndRebate(items, atrb2, dim2);
        }
        else {
            return this.calcKITBackendRebate(items, atrb2, dim2);
        }
    }

    static calculateECAPBackEndRebate = function (passedData, atrb2, dim2) {
        var dim1 = "20___0";
        var CAP = passedData["CAP"];
        var YCS2 = passedData["YCS2_PRC_IRBT"];
        var ecapPrice = passedData[atrb2];

        if (CAP === undefined || YCS2 === undefined || ecapPrice === undefined) return "";

        var data1;
        if (CAP[dim1] == "No CAP" && YCS2[dim1] == "No YCS2") {
            return "";
        } else if (CAP[dim1] == "No CAP") {
            data1 = YCS2[dim1];
        } else if (YCS2[dim1] == "No YCS2") {
            data1 = CAP[dim1];
        } else {
            data1 = Math.min(CAP[dim1], YCS2[dim1]);
        }

        if (!(dim2 == "" || dim2 == null)) {
            ecapPrice = ecapPrice[dim2];
        }

        if (ecapPrice === undefined) return "";

        return data1 - ecapPrice;
    }

    static calcKITBackendRebate = function (passedData, atrb2, dim2) {
        var dimSuffix = "20___";
        var CAP = passedData["CAP"];
        var YCS2 = passedData["YCS2_PRC_IRBT"];
        var ecapPrice = passedData[atrb2];
        var kitProds = passedData["TITLE"].split(',');

        var netPrice = 0.0;;
        for (var i = 0; i <= kitProds.length - 1; i++) {
            var dim1 = dimSuffix + i;
            var data1 = 0.0;
            if (CAP[dim1] == "No CAP" && YCS2[dim1] == "No YCS2") {
                if (i == 0) return "";
                continue;
            } else if (CAP[dim1] == "No CAP") {
                data1 = YCS2[dim1];
            } else if (YCS2[dim1] == "No YCS2") {
                data1 = CAP[dim1];
            } else {
                data1 = Math.min(CAP[dim1], YCS2[dim1]);
            }
            var netPrice = netPrice + (data1 * parseFloat(passedData["QTY"][dim1]));
        }

        if (!(dim2 == "" || dim2 == null)) {
            ecapPrice = ecapPrice[dim2];
        }

        if (ecapPrice === undefined) return "";

        return netPrice - ecapPrice;
    }

    static getTotalDealVolume = function (passedData) {

        var crVol = passedData.CREDIT_VOLUME === undefined || passedData.CREDIT_VOLUME === "" || passedData.CREDIT_VOLUME === null || isNaN(passedData.CREDIT_VOLUME)
            ? 0
            : parseFloat(passedData.CREDIT_VOLUME);
        var dbVol = passedData.DEBIT_VOLUME === undefined || passedData.DEBIT_VOLUME === "" || passedData.DEBIT_VOLUME === null || isNaN(passedData.DEBIT_VOLUME)
            ? 0
            : parseFloat(passedData.DEBIT_VOLUME);
        var vol = passedData.VOLUME === undefined || passedData.VOLUME === "" || passedData.VOLUME === null || isNaN(passedData.VOLUME)
            ? 0
            : parseFloat(passedData.VOLUME);

        var numerator = crVol - dbVol;
        if (numerator < 0) numerator = 0;
        var perc = vol === 0 ? 0 : numerator / vol * 100;
        perc = Math.round(perc * 100) / 100;

        return {
            numerator: numerator,
            vol: vol,
            perc: perc
        }
    }
    static numberWithCommas = function (x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    static getResultMappingIconClass = function (result) {
        if (result === "NA") {
            return "intelicon-information-solid";
        } else if (result === "Pass" || result === "Overridden") {
            return "intelicon-passed-completed-solid";
        } else if (result === "InComplete") {
            return "intelicon-help-solid";
        } else if (result === "Fail") {
            return "intelicon-alert-solid";
        } else {
            return "intelicon-help-outlined";
        }
    }

    static getColorPct = function (d) {
        if (!d) d = "InComplete";
        return this.getColor('pct', d);
    }
    static getColor(k, c) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }
    static getColorStage(d) {
        if (!d) d = "Draft";
        return this.getColor('stage', d);
    }
}