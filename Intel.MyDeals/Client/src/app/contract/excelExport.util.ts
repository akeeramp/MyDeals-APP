import { StaticMomentService } from "../shared/moment/moment.service";
import { GridUtil } from "../contract/grid.util"
import { DE_Load_Util } from "../contract/DEUtils/DE_Load_util"
import { DecimalPipe, CurrencyPipe} from '@angular/common';

export class ExcelExport {
    static exportDimTrkrControlWrapper(passedData) {
        var tmplt = '';
        var dim = "";
        var field = "TRKR_NBR";
        var data = passedData[field];

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  

        var tmplt = '';
        if (passedData[field] !== undefined) {
            dim = "20_____2"
            if (passedData[field][dim] != null) {
                tmplt += passedData[field][dim];
                tmplt += ", ";
            }
            dim = "20_____1"
            if (passedData[field][dim] != null) {
                tmplt += passedData[field][dim];
                tmplt += ", ";
            }

            for (var index in sortedKeys) { 
                dim = sortedKeys[index];
                if (data.hasOwnProperty(dim) && dim.indexOf("___") >= 0 && dim.indexOf("_____") < 0) {  
                    tmplt += passedData[field][dim];
                    tmplt += ", ";
                }
            }
        }
        if (tmplt != '') {
            tmplt = tmplt.slice(0, -2);
        }

        return tmplt;
    }
    static formatDate = function (data) {
        return data ? StaticMomentService.moment(data).format("MM/DD/YYYY") : '';
    }
    static exportControlScheduleWrapper(passedData) {
        var tmplt = 'Tier, Start Vol, End Vol, Rate\n';
        var fields = [
            { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
            { "title": "Start Vol", "field": "STRT_VOL", "format": "number", "align": "right" },
            { "title": "End Vol", "field": "END_VOL", "format": "number", "align": "right" }, 
            { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
        ];

        var numTiers = 0;
        var tiers = passedData.TIER_NBR;
        for (var key in tiers) {
            if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
                numTiers++;
                var dim = "10___" + numTiers;
                var vals = [];
                for (var f = 0; f < fields.length; f++) {
                    var val = passedData[fields[f].field] ? passedData[fields[f].field][dim] : '';
                    if (val !== "Unlimited") {
                        val = ExcelExport.getFormattedData(val, fields[f].format);
                    }
                    vals.push(val);
                }
                tmplt += vals.join(", ").replace(/null/g, '').replace(/undefined/g, '') + '\n';
            }
        }

        return tmplt;
    }
    static exportControlScheduleWrapperDensity(passedData) {
        var tmplt = 'Tier,Band, Start PB, End PB, Rate\n';
        var fields = [
            { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
            { "title": "Band", "field": "DENSITY_BAND", "format": "", "align": "right" },
            { "title": "Start PB", "field": "STRT_PB", "format": "fixedpoint", "align": "right" },
            { "title": "End PB", "field": "END_PB", "format": "fixedpoint", "align": "right" },
            { "title": "Rate", "field": "DENSITY_RATE", "format": "currency", "align": "right" }
        ];

        var numTiers = 0;
        var tiers = passedData.TIER_NBR;
        for (var key in tiers) {
            if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
                numTiers++;
                for (let b = 1; b <= parseInt(passedData.NUM_OF_DENSITY); b++) {
                    var vals = [];
                    for (var f = 0; f < fields.length; f++) {
                        var dim = (fields[f].field == "DENSITY_BAND") ? "8___" + numTiers : "10___" + numTiers;
                        if (fields[f].field == "DENSITY_BAND") {
                            vals.push(ExcelExport.getFormattedData(passedData[fields[f].field]["8___" + b], fields[f].format));
                        }
                        else if (fields[f].field == "DENSITY_RATE") {
                            vals.push(ExcelExport.getFormattedData(passedData[fields[f].field]["8___" + b + "____" + dim], fields[f].format));
                        }
                        else {
                            var val = passedData[fields[f].field][dim];
                            if (val !== "Unlimited") {
                                val = ExcelExport.getFormattedData(val, fields[f].format);
                            }
                            vals.push(val);
                        }
                    }
                    tmplt += vals.join(", ").replace(/null/g, '').replace(/undefined/g, '') + '\n';                    
                }
            }
        }

        return tmplt;
    }
    static exportControlScheduleWrapperRevTier(passedData) {
        var tmplt = 'Tier, Start Rev, End Rev, Incentive Rate (%)\n';
        var fields = [
            { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
            { "title": "Start Rev", "field": "STRT_REV", "format": "currency", "align": "right" },
            { "title": "End Rev", "field": "END_REV", "format": "currency", "align": "right" }, 
            { "title": "Incentive Rate (%)", "field": "INCENTIVE_RATE", "format": "twofixedpoint", "align": "right" }
        ];

        var numTiers = 0;
        var tiers = passedData.TIER_NBR;
        for (var key in tiers) {
            if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
                numTiers++;
                var dim = "10___" + numTiers;
                var vals = [];
                for (var f = 0; f < fields.length; f++) {
                    var val = passedData[fields[f].field][dim];
                    if (val !== "Unlimited") {
                        val = ExcelExport.getFormattedData(val, fields[f].format);
                    }
                    vals.push(val);
                }
                tmplt += vals.join(", ").replace(/null/g, '').replace(/undefined/g, '') + '\n';
            }
        }

        return tmplt;
    }
    static exportDimControlWrapper(passedData, field, dim, format) {
        var tmplt = '';
        if (passedData[field] === undefined) return tmplt;

        if (dim == "20_____2" && passedData.HAS_SUBKIT == "0") {
            tmplt += 'No Sub KIT';
        } else {
            if (passedData[field] !== undefined) {
                var val = passedData[field][dim];
                if (val != 'No YCS2') val = ExcelExport.getFormattedData(val, format);
                if (passedData.OBJ_SET_TYPE_CD == "KIT") {
                    tmplt += val + '\n';
                } else {
                    tmplt += val;
                }
            }
        }
        return tmplt;
    }
    static exportPositiveDimControlWrapper(passedData, field, format) {
        var data = passedData[field];

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  

        var tmplt = '';
        for (var index in sortedKeys) { 
            let dimkey = sortedKeys[index];
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  
                var val = passedData[field][dimkey];
                if (val !== "Unlimited" || val != "No YCS2") {
                    val = ExcelExport.getFormattedData(val, format);
                }
                if (passedData.OBJ_SET_TYPE_CD == "KIT") {
                    tmplt += val + '\n';
                } else {
                    tmplt += val;
                }
            }
        }

        return tmplt;
    }
    static exportPrimarySecondaryDimControlWrapper(passedData) {
        var data = passedData["ECAP_PRICE"];    
        var setPrimary = true;

        var tmplt = '';
        for (var dimkey in data) {
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  
                if (setPrimary) {
                    tmplt += 'Primary';
                    setPrimary = false;
                } else {
                    tmplt += 'Secondary';
                }
                tmplt += '\n';
            }
        }

        return tmplt;
    }
    static exportKitCalculatedValuesControlWrapper(passedData, kittype, column) {
        var tmplt = '';
        if (passedData.HAS_SUBKIT == "0" && kittype == "subkit") {
            tmplt += 'No Sub KIT';
        } else {
            var val = DE_Load_Util.kitCalculatedValues(passedData, kittype, column);
            tmplt += ExcelExport.getFormattedData(val, "currency");
        }
        return tmplt;
    }
    static exportBackEndRebateWrapper(passedData, dealType, atrb2, dim2, format) {
        var tmplt = '';
        if (dealType == "ECAP") {
            var val = DE_Load_Util.calculateECAPBackEndRebate(passedData, atrb2, dim2);
        } else {
            var val = DE_Load_Util.calcKITBackendRebate(passedData, atrb2, dim2);
        }
        tmplt += ExcelExport.getFormattedData(val, format);
        return tmplt;
    }
    static exportTotalDiscountPerLineControlWrapper(passedData) {
        var data = passedData["QTY"];   

        var tmplt = '';
        for (var dimkey in data) {
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  
                tmplt += ExcelExport.getFormattedData(passedData.QTY[dimkey] * passedData.DSCNT_PER_LN[dimkey], "currency") + "\n";
            }
        }

        return tmplt;
    }
    static uiDimInfoExcelControlWrapper(passedData, field) {
        var data = passedData["ECAP_PRICE"];    

        if (data === undefined || data === null) return "";

        var sortedKeys = Object.keys(data).sort();  

        var YCS2modifier = field === "YCS2" ? "_PRC_IRBT" : "";
        var st = field === "YCS2" ? "_START_DT" : "_STRT_DT";
        var en = "_END_DT";

        var tmplt = '';
        for (var index in sortedKeys) { 
            let dimkey = sortedKeys[index];
            if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  

                var ycs2Field = passedData[field + YCS2modifier] === undefined ? undefined : passedData[field + YCS2modifier][dimkey];
                if (ycs2Field !== undefined && ycs2Field !== null) {
                    if (ycs2Field.indexOf("No") >= 0) {
                        tmplt += ycs2Field + "<br/>";
                    } else if (passedData[field + st] === undefined) {
                        tmplt += ycs2Field + "<br/>";
                    } else {
                        tmplt += ycs2Field + " : " + passedData[field + st][dimkey] + " - " + passedData[field + en][dimkey] + "<br/>";
                    }
                }
            }
        }

        return tmplt;
    }
    static uiCrDbPercExcelWrapper = function (passedData) {
        var percData = DE_Load_Util.getTotalDealVolume(passedData);
        if (passedData["VOLUME"] !== undefined && percData.vol !== 999999999) {
            return DE_Load_Util.numberWithCommas(percData.numerator) + ' out of ' + DE_Load_Util.numberWithCommas(percData.vol);
        } else {
            return DE_Load_Util.numberWithCommas(percData.numerator);
        }
    }
    static getExportExcelData(templateHtml, dataItem, field) {
        if (templateHtml.includes("exportDimTrkrControlWrapper"))
            return ExcelExport.exportDimTrkrControlWrapper(dataItem)
        else if (templateHtml.includes("formatDate"))
            return ExcelExport.formatDate(dataItem[field])
        else if (templateHtml.includes("exportControlScheduleWrapperDensity"))
            return ExcelExport.exportControlScheduleWrapperDensity(dataItem)
        else if (templateHtml.includes("exportControlScheduleWrapperRevTier"))
            return ExcelExport.exportControlScheduleWrapperRevTier(dataItem)
        else if (templateHtml.includes("exportControlScheduleWrapper"))
            return ExcelExport.exportControlScheduleWrapper(dataItem)
        else if (templateHtml.includes("exportDimControlWrapper")) {
            if (field == "ECAP_PRICE")
                return ExcelExport.exportDimControlWrapper(dataItem, "ECAP_PRICE", '20___0', 'currency')
            if (field == "KIT_ECAP")
                return ExcelExport.exportDimControlWrapper(dataItem, "ECAP_PRICE", '20_____1', 'currency')
            if (field == "SUBKIT_ECAP")
                return ExcelExport.exportDimControlWrapper(dataItem, "ECAP_PRICE", '20_____2', 'currency')
            if (field == "CAP_KIT")
                return ExcelExport.exportDimControlWrapper(dataItem, 'CAP', '20_____1', 'currency')
            if (field == "YCS2_KIT")
                return ExcelExport.exportDimControlWrapper(dataItem, 'YCS2_PRC_IRBT', '20_____1', 'currency')
        }
        else if (templateHtml.includes("exportPositiveDimControlWrapper")) {
            if (field == "QTY")
                return ExcelExport.exportPositiveDimControlWrapper(dataItem, field, 'number')
            else if (field == "CAP_STRT_DT" || field == "CAP_END_DT" || field == "YCS2_START_DT" || field == "YCS2_END_DT")
                return ExcelExport.exportPositiveDimControlWrapper(dataItem, field, 'date')
            else
                return ExcelExport.exportPositiveDimControlWrapper(dataItem, field, 'currency')
        }
        else if (templateHtml.includes("exportPrimarySecondaryDimControlWrapper"))
            return ExcelExport.exportPrimarySecondaryDimControlWrapper(dataItem)
        else if (templateHtml.includes("exportKitCalculatedValuesControlWrapper")) {
            if (field == "KIT_REBATE_BUNDLE_DISCOUNT")
                return ExcelExport.exportKitCalculatedValuesControlWrapper(dataItem, 'kit', 'rebateBundle')
            if (field == "SUBKIT_REBATE_BUNDLE_DISCOUNT")
                return ExcelExport.exportKitCalculatedValuesControlWrapper(dataItem, 'subkit', 'rebateBundle')
            if (field == "KIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE")
                return ExcelExport.exportKitCalculatedValuesControlWrapper(dataItem, 'kit', 'sumTD')
            if (field == "SUBKIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE")
                return ExcelExport.exportKitCalculatedValuesControlWrapper(dataItem, 'subkit', 'sumTD')
        }
        else if (templateHtml.includes("exportBackEndRebateWrapper")) {
            if (field == "BACKEND_REBATE" && dataItem.OBJ_SET_TYPE_CD == 'ECAP')
                return ExcelExport.exportBackEndRebateWrapper(dataItem, 'ECAP', 'ECAP_PRICE', '20___0', 'currency')
            if (field == "BACKEND_REBATE" && dataItem.OBJ_SET_TYPE_CD == 'KIT')
                return ExcelExport.exportBackEndRebateWrapper(dataItem, 'KIT', 'ECAP_PRICE', '20_____1', 'currency')
        }
        else if (templateHtml.includes("exportTotalDiscountPerLineControlWrapper"))
            return ExcelExport.exportTotalDiscountPerLineControlWrapper(dataItem)
        else if (templateHtml.includes("uiDimInfoExcelControlWrapper")) {
            if (field == "CAP_INFO")
                return ExcelExport.uiDimInfoExcelControlWrapper(dataItem, 'CAP')
            if (field == "YCS2_INFO")
                return ExcelExport.uiDimInfoExcelControlWrapper(dataItem, 'YCS2')
        }
        else if (templateHtml.includes("uiCrDbPercExcelWrapper"))
            return ExcelExport.uiCrDbPercExcelWrapper(dataItem)
        else if (templateHtml.includes("getMissingCostCapTitle"))
            return GridUtil.getMissingCostCapTitle(dataItem)
        else if (templateHtml.includes("stgFullTitleChar"))
            return GridUtil.stgFullTitleChar(dataItem)
    }
    static getFormattedData(data, format) {
        if (format.toLowerCase() == "currency") {
            if (!Number.isNaN(Number(data)))
                return new CurrencyPipe('en-us').transform(data, 'USD', 'symbol', '1.2-2');
        }
        else if (format.toLowerCase() == "number") {
            if (!Number.isNaN(Number(data)))
                return new DecimalPipe('en-us').transform(data, "1.0-0");
        }
        else if (format.toLowerCase() == "fixedpoint") {
            if (!Number.isNaN(Number(data)))
                return new DecimalPipe('en-us').transform(data, "1.0-3");
        }
        else if (format.toLowerCase() == "twofixedpoint") {
            if (!Number.isNaN(Number(data)))
                return new DecimalPipe('en-us').transform(data, "1.0-2");
        }
        else if (format.toLowerCase() == "date") {
            return StaticMomentService.moment(data).format("MM/DD/YYYY");
        }
        else
            return data;
    }
}