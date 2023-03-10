import * as _ from 'underscore';
import { DE_Load_Util } from '../DEUtils/DE_Load_util';
import { PTE_Config_Util } from './PTE_Config_util';
import { PTE_Common_Util } from './PTE_Common_util';
import { PRC_TBL_Model_Column } from '../pricingTableEditor/handsontable.interface';
import Handsontable from 'handsontable';

export class PTE_Load_Util {
    private static hotTable: Handsontable;
    constructor(hotTable: Handsontable) {
        PTE_Load_Util.hotTable = hotTable;
    }
    static getRulesForDE(objSetTypeCd) {
        return DE_Load_Util.getRules(objSetTypeCd);
    }
    static wipTemplateColumnSettings(template, isTenderContract, objSetTypeCd, isTenderDashboard) {
        DE_Load_Util.removeWipColumns(template, isTenderContract, isTenderDashboard);
        DE_Load_Util.assignColSettings(template, objSetTypeCd, isTenderDashboard);
    }
    static getHideIfAllrules(groups) {
        return DE_Load_Util.getHideIfAllrules(groups);
    }
    static kitCalculatedValues(data, kitType, column) {
        return DE_Load_Util.kitCalculatedValues(data, kitType, column);
    }
    static calcBackEndRebate(data, dealType, column, dim) {
        return DE_Load_Util.calcBackEndRebate(data, dealType, column, dim);
    }
    static getColorPct(result) {
        return DE_Load_Util.getColorPct(result);
    }
    static checkForMessages(collection, key, data) {
        var isValid = true;
        if (data.data[key] !== undefined) {
            for (var i = 0; i < data.data[key].length; i++) {
                if (data.data[key][i].DC_ID !== undefined &&
                    data.data[key][i].DC_ID === collection.DC_ID &&
                    data.data[key][i].warningMessages.length > 0) {
                    _.each(data.data[key][i]._behaviors.validMsg,
                        function (value, key) {
                            collection._behaviors.validMsg[key] = value;
                            collection._behaviors.isError[key] = value !== "";
                            isValid = false;
                        });
                }
            }
        }
        return isValid;
    }
    //coomon util has same functionality need to modify that with this
    static setBehaviors(item, elem, cond, curPricingTable) {
        var isFlexDeal = (item.OBJ_SET_TYPE_CD === 'FLEX');
        if (!item._behaviors) item._behaviors = {};
        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
        if (!item._behaviors.isError) item._behaviors.isError = {};
        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
        if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
        item._behaviors.isRequired[elem] = true;
        item._behaviors.isError[elem] = true;

        switch (elem) {
            case 'REBATE_TYPE':
                this.setBehaviorsValidMessage(item, elem, 'Rebate Type', cond, curPricingTable);
                break;
            case 'PAYOUT_BASED_ON':
                this.setBehaviorsValidMessage(item, elem, 'Payout Based On', cond, curPricingTable);
                break;
            case 'CUST_ACCNT_DIV':
                this.setBehaviorsValidMessage(item, elem, 'Customer Account Division', cond, curPricingTable);
                break;
            case 'GEO_COMBINED':
                this.setBehaviorsValidMessage(item, elem, 'Geo', cond, curPricingTable);
                break;
            case 'PERIOD_PROFILE':
                this.setBehaviorsValidMessage(item, elem, 'Period Profile', cond, curPricingTable);
                break;
            case 'RESET_VOLS_ON_PERIOD':
                this.setBehaviorsValidMessage(item, elem, 'Reset Per Period', cond, curPricingTable);
                break;
            case 'PROGRAM_PAYMENT':
                this.setBehaviorsValidMessage(item, elem, 'Program Payment', cond, curPricingTable);
                break;
            case 'SETTLEMENT_PARTNER':
                this.setBehaviorsValidMessage(item, elem, 'Settlement Partner', cond, curPricingTable);
                break;
            case 'AR_SETTLEMENT_LVL':
                this.setBehaviorsValidMessage(item, elem, 'Settlement Level', cond, curPricingTable);
                break;
            case 'CONSUMPTION_TYPE':
                this.setBehaviorsValidMessage(item, elem, 'Consumption Type', cond, curPricingTable);
                break;
            case 'END_CUSTOMER_RETAIL':
                this.setBehaviorsValidMessage(item, elem, 'End Customer Country/Region', cond, curPricingTable);
                break;
            default:
        }

        if (elem == 'REBATE_TYPE' || elem == 'PAYOUT_BASED_ON' || elem == 'CUST_ACCNT_DIV' || elem == 'GEO_COMBINED' || elem == 'PERIOD_PROFILE' || elem == 'RESET_VOLS_ON_PERIOD' || elem == 'PROGRAM_PAYMENT'
            || elem == 'SETTLEMENT_PARTNER' || elem == 'AR_SETTLEMENT_LVL' || elem == 'CONSUMPTION_TYPE' || elem == 'END_CUSTOMER_RETAIL') {
            // no operation - taken in above case statement
        }
        else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_VOL') {
            this.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond, curPricingTable);
        }
        else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_AMT') {
            this.setBehaviorsValidMessage(item, elem, 'Overarching Max Dollar', cond, curPricingTable);
        }
        else if (cond == 'equalemptyboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
            item._behaviors.validMsg[elem] = "Entering both an Overarching Maximum Volume and Overarching Maximum Dollar value is not allowed.";
        }
        else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_VOL') {
            this.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond, curPricingTable);
        }
        else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_AMT') {
            this.setBehaviorsValidMessage(item, elem, 'Overarching Max Doller', cond, curPricingTable);
        }
        else if (cond == 'equalboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
            item._behaviors.validMsg[elem] = "Both Overarching Maximum Volume and Overarching Maximum Dollars cannot contain values. Choose one or the other.";
        }
        else if (cond == 'duplicate' && elem == 'PTR_USER_PRD') {
            item._behaviors.validMsg[elem] = "Overlapping products have been identified, please change the overlapping Accrual and Draining dates.";
        }
        else if (cond == 'dateissue' && elem == 'PTR_USER_PRD') {
            item._behaviors.validMsg[elem] = "Deal End Date must be greater than Start Date, please correct.";
        }
        else if (cond != '' && elem == 'DENSITY_BAND') {
            item._behaviors.validMsg[elem] = cond;
            if (!item.isDensity) { item.isDensity = {}; item.isDensity[elem] = true; item.isDensity['ErrorMsg'] = cond; }
            else { item.isDensity['ErrorMsg'] = cond; }
        }
        else if (cond == 'emptyobject' && elem == 'FLEX') {
            delete item._behaviors.isRequired[elem];
            delete item._behaviors.isError[elem];
        }

        else {
            item._behaviors.validMsg[elem] = 'All Settlement Levels must be the same within a Hybrid Pricing Strategy.';
        }

        return item;
    }
    //coomon util has same functionality need to modify that with this
    static setBehaviorsValidMessage(item, elem, elemLabel, cond, curPricingTable) {
        var isFlexDeal = curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
        var dealTypeLabel = isFlexDeal === true ? "FLEX PT" : "HYBRID PS";

        if (cond == 'notequal') {
            item._behaviors.validMsg[elem] = "All deals within a " + dealTypeLabel + " should have the same '" + elemLabel + "' value.";
        }
        else if (cond == 'equalblank') {
            if (elem === 'SETTLEMENT_PARTNER') {
                item._behaviors.validMsg[elem] = "Settlement Partner is required when Settlement level is Cash";
            }
            else {
                item._behaviors.validMsg[elem] = "Deals within a " + dealTypeLabel + " must have a '" + elemLabel + "' value.";
            }
        }
        else if (cond == 'equalblankorzero') {
            item._behaviors.validMsg[elem] = elemLabel + " must be blank or > 0.";
        }
        else if (cond == 'equalzero') {
            item._behaviors.validMsg[elem] = elemLabel + " must be > 0.";
        }
        return item;
    }
    static getCellComments(PTR: any, columns: Array<any>): Array<any> {
        let cellComments = [];
        _.each(PTR, (item, rowInd) => {
            //this piece of code is to bind comments to the cell 
            if (item && item._behaviors && item._behaviors.validMsg && item._behaviors.isError) {
                let msg = "";
                _.each(item._behaviors.isError, (val, key) => {
                    let colInd = _.findIndex(columns, { field: key });
                    if (key == 'PTR_USER_PRD' || key == 'PRD_EXCLDS') {
                        if (val == true && item._behaviors.validMsg[`${key}`] && item._behaviors.validMsg[`${key}`] == 'Invalid Product') {
                            cellComments.push({ row: rowInd, col: colInd, comment: { value: item._behaviors.validMsg[`${key}`], readOnly: true }, className: 'error-product error-border' });
                            msg += columns[colInd].title + ": " + item._behaviors.validMsg[`${key}`];
                        }
                        else if (val == false && item._behaviors.validMsg[`${key}`] && item._behaviors.validMsg[`${key}`] == 'Valid Product') {
                            cellComments.push({ row: rowInd, col: colInd, comment: { value: '', readOnly: true }, className: 'success-product' });
                        }
                        else if (val == true && !item._behaviors.validMsg[`${key}`]) {
                            cellComments.push({ row: rowInd, col: colInd, comment: { value: '', readOnly: true }, className: 'error-product' });
                        }
                        else {
                            //this logic is to handle incase a product is success but still there are error binding but we need to maintain the success color but give message
                            if (val == true && item._behaviors.validMsg[`${key}`] && (item._behaviors.validMsg[`${key}`] != 'Invalid Product')) {
                                let cellMeta = this.hotTable.getCellMeta(rowInd, colInd);
                                if (cellMeta && cellMeta.className && cellMeta.className.toString().match('success-product')) {
                                    cellComments.push({ row: rowInd, col: colInd, comment: { value: item._behaviors.validMsg[`${key}`], readOnly: true }, className: 'success-product error-border' });
                                }
                                else {
                                    cellComments.push({ row: rowInd, col: colInd, comment: { value: item._behaviors.validMsg[`${key}`], readOnly: true }, className: 'error-product error-border' });
                                }
                                msg += columns[colInd].title + ": " + item._behaviors.validMsg[`${key}`];
                            }
                        }
                    }
                    else {
                        //only if there is error
                        if (val) {
                            cellComments.push({ row: rowInd, col: colInd, comment: { value: item._behaviors.validMsg[`${key}`], readOnly: true }, className: 'error-border' });
                            msg += columns[colInd].title + ": " + item._behaviors.validMsg[`${key}`];
                        }
                    }
                });
                // error cell for consoldate message in first column
                if (_.findWhere(cellComments, { row: rowInd, col: 0 }) == undefined && msg != "") {
                    cellComments.push({ row: rowInd, col: 0, comment: { value: msg, readOnly: true }, className: 'error-cell' });
                }
            }
        });
        return cellComments;
    }
    static PTEColumnSettings(template, isTenderContract, curPricingTable) {
        if (template !== undefined && template !== null) {
            for (var i = template.columns.length - 1; i >= 0; i--) {
                if (!isTenderContract && PTE_Config_Util.tenderOnlyColumns.indexOf(template.columns[i].field) !== -1) {
                    template.columns.splice(i, 1);
                }
                if (isTenderContract) {
                    if (PTE_Config_Util.vistextHybridOnlyColumns.indexOf(template.columns[i].field) !== -1) {
                        template.columns.splice(i, 1);
                    }
                }
            }
            // For tender contracts make the Period profile and Ar settlement level as readonly
            if (isTenderContract && template.model.fields["PERIOD_PROFILE"] !== undefined) {
                template.model.fields.PERIOD_PROFILE.editable = false;
            }
            if (isTenderContract && template.model.fields["AR_SETTLEMENT_LVL"] !== undefined) {
                template.model.fields.AR_SETTLEMENT_LVL.editable = false;
            }
            // Show overarching columns only for hybrid deals
            if (isTenderContract) {
                PTE_Config_Util.vistextHybridOnlyColumns.forEach(function (x) {
                    delete template.model.fields[x];
                });
            }
            // For non hybrid deals make Overarching max volume and amount readonly in PTR, they are still editable in WIP if they got values
            if (curPricingTable["IS_HYBRID_PRC_STRAT"] != "1" && curPricingTable["OBJ_SET_TYPE_CD"] != "FLEX") {
                if (template.model.fields["REBATE_OA_MAX_VOL"] !== undefined) template.model.fields.REBATE_OA_MAX_VOL.editable = false;
                if (template.model.fields["REBATE_OA_MAX_AMT"] !== undefined) template.model.fields.REBATE_OA_MAX_AMT.editable = false;
            }
            // Remove tender only columns for non tender deals.
            if (!isTenderContract) {
                PTE_Config_Util.tenderOnlyColumns.forEach(function (x) {
                    delete template.model.fields[x];
                });
            }
            else {
                PTE_Config_Util.tenderRequiredColumns.forEach(function (x) {
                    //checking the last index not *
                    if(template.model.fields[x].label.charAt(template.model.fields[x].label.length - 1) !='*'){
                        template.model.fields[x].label += " *";
                    }
                      
                });
                for (i = 0; i < template.columns.length; i++) {
                    if (PTE_Config_Util.tenderRequiredColumns.indexOf(template.columns[i].field) >= 0) {
                           //checking the last index not *
                        if(template.columns[i].title.charAt(template.columns[i].title.length - 1) !='*'){
                            template.columns[i].title += " *";
                        }
                    }
                }
            }
        }
    }
    static getMergeCells(PTR: any, columns: Array<any>, curPricingTable: any): Array<any> {
        let mergCells = [];
        let startOffset;
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
        let distDCID = _.uniq(PTR, 'DC_ID');
        _.each(distDCID, (item) => {
            let curPTR = _.findWhere(PTR, { DC_ID: item.DC_ID });
            let rowIndex = _.findIndex(PTR, { DC_ID: item.DC_ID });
            startOffset = rowIndex;
            //get NUM_OF_TIERS acoording this will be the row_span for handson 
            let NUM_OF_TIERS = this.numOfPivot(curPTR, curPricingTable);
            _.each(columns, (colItem, ind) => {
                if (!colItem.isDimKey && !colItem.hidden && NUM_OF_TIERS != 1) {
                    mergCells.push({ row: rowIndex, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
                }
                if (curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY' && (colItem.field == 'TIER_NBR' || colItem.field == 'STRT_PB' || colItem.field == 'END_PB')) {
                    let pivotDensity = parseInt(curPTR.NUM_OF_DENSITY);
                    let densityTiers = NUM_OF_TIERS / pivotDensity;
                    for (let i = 1; i <= densityTiers; i++) {
                        mergCells.push({ row: startOffset, col: ind, rowspan: pivotDensity, colspan: 1 });
                        startOffset = startOffset + pivotDensity;
                    }
                    startOffset = rowIndex;
                }
            })
        });
        return mergCells;
    }
    static pivotData(data, isTenderContract, curPricingTable, kitDimAtrbs) {        //convert how we save data in MT to UI spreadsheet consumable format
        data = this.assignProductProprties(data, isTenderContract, curPricingTable);
        var tierAtrbs = PTE_Config_Util.tierAtrbs;
        var densityTierAtrbs = PTE_Config_Util.densityTierAtrbs;
        if (!this.isPivotable(curPricingTable)) return data;
        var newData = [];
        let dealType = curPricingTable['OBJ_SET_TYPE_CD'];

        for (var d = 0; d < data.length; d++) {
            // Tiered data
            var productJSON = data[d]["PTR_SYS_PRD"] !== undefined && data[d]["PTR_SYS_PRD"] !== null && data[d]["PTR_SYS_PRD"] !== "" ? JSON.parse(data[d]["PTR_SYS_PRD"]) : [];
            var numTiers = this.numOfPivot(data[d], curPricingTable);
            let curTier = 1, db = 1, dt = 1;

            for (var t = 1; t <= numTiers; t++) {
                var lData = PTE_Common_Util.deepClone(data[d]);

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

                        PTE_Common_Util.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, t);

                        if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                            // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                            if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                                lData[endKey] = parseInt(lData[endKey] || 0);
                            }
                        }
                        else {
                            // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                            if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                                lData[endKey] = parseFloat(lData[endKey] || 0);
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
                                PTE_Common_Util.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, curTier);
                            }
                            else {
                                lData[tieredItem] = lData[tieredItem + dimKey + db];
                                PTE_Common_Util.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, db);

                            }

                            if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                                lData[endKey] = parseFloat(lData[endKey].replace(/[$,]/g, '') || 0);
                            }

                            if (tieredItem === strtKey && lData[strtKey] !== undefined) {
                                //lData[strtKey] = thousands_separators((parseFloat(lData[strtKey].replace(/[$,]/g, ''))).toFixed(3));
                                lData[strtKey] = parseFloat(lData[strtKey].replace(/[$,]/g, '') || 0);
                            }

                        }
                        else {
                            lData[tieredItem] = lData[tieredItem + "_____8___" + db + "____10___" + curTier];
                            PTE_Common_Util.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, curTier);
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
                        let tieredItem = kitDimAtrbs[i];
                        lData[tieredItem] = lData[tieredItem + "_____20___" + (t - 1)]; //-1 because KIT dim starts at 0 whereas VT num tiers begin at 1
                        if (tieredItem == "TIER_NBR") {
                            lData[tieredItem] = t; // KIT add tier number
                            if (lData[tieredItem] != 1) {
                                lData['DEAL_GRP_NM'] = null;
                            }
                        }
                        PTE_Common_Util.mapTieredWarnings(data[d], lData, tieredItem, tieredItem, (t - 1));
                    }

                    lData["TEMP_TOTAL_DSCNT_PER_LN"] = this.calculateTotalDsctPerLine(lData["DSCNT_PER_LN_____20___" + (t - 1)], lData["QTY_____20___" + (t - 1)]);
                    lData["TEMP_KIT_REBATE"] = this.calculateKitRebate(data, d, numTiers, true);
                    if (productJSON.length !== 0) {
                        _.each(productJSON, function (value, key) {
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
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static numOfPivot(dataItem, curPricingTable) {
        if (curPricingTable === undefined) return 1;
        if (curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" || curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" ||
            curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
            var pivotFieldName = "NUM_OF_TIERS";
            var pivotDensity = curPricingTable["NUM_OF_DENSITY"];
            // if dataItem has numtiers return it do not calculate and update here. pricingTableController.js pivotKITDeals will take care of updating correct NUM_TIERS
            if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" && !!dataItem && !!dataItem["PTR_USER_PRD"]) {
                var pivotVal = dataItem["PTR_USER_PRD"].split(",").length;  //KITTODO: do we have a better way of calculating number of rows without splitting PTR_USER_PRD?
                dataItem['NUM_OF_TIERS'] = pivotVal;  //KITTODO: not sure if necessary to set num of tiers at ptr level, but it appears to be expected when applying red validation markers to various dim rows (saveEntireContractRoot()'s call of MapTieredWarnings())
                return pivotVal;
            }
            if (!this.isPivotable(curPricingTable)) return 1;
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
    static isPivotable(curPricingTable) {
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
    static assignProductProprties(data, isTenderContract, curPricingTable) {
        if (isTenderContract && curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") {
            for (var d = 0; d < data.length; d++) {

                if (_.isEqual(data[d], {}) || data[d]["PTR_SYS_PRD"] === "" || data[d]["PTR_USER_PRD"] === null || typeof (data[d]["PTR_USER_PRD"]) == 'undefined') continue;;

                // product JSON
                var productJSON = JSON.parse(data[d]["PTR_SYS_PRD"]);
                var sysProduct = [];

                var productArray = [];
                for (var key in productJSON) {
                    if (productJSON.hasOwnProperty(key)) {
                        _.each(productJSON[key], function (item) {
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
    static calculateTotalDsctPerLine(dscntPerLine, qty) {
        dscntPerLine=dscntPerLine.toString().replace(/[$,]/g, "");
        return (parseFloat(dscntPerLine) * parseInt(qty) || 0);
    }
    static calculateKitRebate(data, firstTierRowIndex, numOfTiers, isDataPivoted) {
        var kitRebateTotalVal = 0;
        for (var i = 0; i < numOfTiers; i++) {
            if (isDataPivoted) {
                var qty = (parseFloat(data[firstTierRowIndex]["QTY_____20___" + i]) || 0);
                const ecapPrice= data[firstTierRowIndex]["ECAP_PRICE_____20___" + i].toString().replace(/[$,]/g, "");
                kitRebateTotalVal += (qty * parseFloat(ecapPrice) || 0);
            } else if (i < data.length) {
                var qty = (parseFloat(data[(firstTierRowIndex + i)]["QTY"]) || 0);
                const ecapPrice= data[(firstTierRowIndex + i)]["ECAP_PRICE"].toString().replace(/[$,]/g, "");
                kitRebateTotalVal += (qty * parseFloat(ecapPrice) || 0);
            }
        }
        const ecapPrice= data[firstTierRowIndex]["ECAP_PRICE_____20_____1"].toString().replace(/[$,]/g, "");
        var rebateVal = (kitRebateTotalVal - parseFloat(ecapPrice)) // Kit rebate - KIT ECAP (tier of "-1")
        return rebateVal;
    }

    static mapProperty(src, data, curPricingTable) {
        if (this.isPivotable(curPricingTable)) {
            var srcTierNum = parseInt(src.TIER_NBR);
            var dataTierNum = parseInt(data.TIER_NBR);
            if (src["DC_ID"] === data["DC_ID"] && (!srcTierNum && dataTierNum === 1 || srcTierNum === dataTierNum)) {
                var arItems = data;
                for (var key in arItems) {
                    if (arItems.hasOwnProperty(key) && data[key] !== undefined)
                        src[key] = data[key];
                }
            }
        } else {
            if (src["DC_ID"] === data["DC_ID"]) {
                var arItems = data;
                for (var key in arItems) {
                    if (arItems.hasOwnProperty(key) && data[key] !== undefined)
                        src[key] = data[key];
                }
            }
        }
    }

    static mapActionIdChange(src, action, renameMapping) {
        if (src["DC_ID"] === action["DcID"]) {
            renameMapping[src["DC_ID"]] = action["AltID"];
            src["DC_ID"] = action["AltID"];
        }
    }

    static updateResults(data, source, curPricingTable) {
        let renameMapping = {};
        var i, p;
        if (data !== undefined && data !== null) {
            // look for actions -> this has to be first because remapping might happen
            for (i = 0; i < data.length; i++) {
                if (data[i]["_actions"] !== undefined) {
                    var actions = data[i]["_actions"];
                    for (var a = 0; a < actions.length; a++) {
                        if (actions[a]["Action"] === "ID_CHANGE") {
                            if (Array.isArray(source)) {
                                for (p = 0; p < source.length; p++) {
                                    this.mapActionIdChange(source[p], actions[a], renameMapping);
                                }
                            } else {
                                this.mapActionIdChange(source, actions[a], renameMapping);
                            }
                        }
                    }
                }
            }

            // Now look for items that need to be updated
            for (i = 0; i < data.length; i++) {
                if (data[i]["DC_ID"] !== undefined && data[i]["DC_ID"] !== null) {
                    if (Array.isArray(source)) {
                        for (p = 0; p < source.length; p++) {
                            if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = renameMapping[data[i]["DC_ID"]];
                            if (data[i]["DC_ID"] === source[p]["DC_ID"]) {
                                this.mapProperty(source[p], data[i], curPricingTable);
                            }
                        }
                    } else {
                        if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = renameMapping[data[i]["DC_ID"]];
                        if (data[i]["DC_ID"] === source["DC_ID"]) this.mapProperty(source, data[i], curPricingTable);
                    }
                }
            }
        }
    }
    static getHiddenColumns(columnTemplates, customerDivisions) {
        let hiddenColumns = [];
        _.each(columnTemplates, (item: PRC_TBL_Model_Column, index) => {
            /* Hidden Columns */
            if (item.hidden) {
                hiddenColumns.push(index);
            }
            if (item.field == "CUST_ACCNT_DIV") {
                var custD = customerDivisions.filter(function (x) {
                    return x["ACTV_IND"] === true
                });
                if (!customerDivisions || custD.length <= 1) {
                    hiddenColumns.push(index);
                }
            }
        });
        return hiddenColumns;
    }
    static getLookBackPeriod(data) {
        return DE_Load_Util.getLookBackPeriod(data);
    }
    static disableCells(hotTable: Handsontable, row: number, col: number, prop: any, columnConfig: Array<Handsontable.ColumnSettings>, curPricingTable: any, isTenderContract: boolean, hybridstat: any) {
        //logic for making by default all the cell except PTR_USER_PRD readonly
        const cellProperties = {};
        if (((<any>window).usrRole != 'GA' && (<any>window).usrRole != 'FSE') || curPricingTable.PS_WF_STG_CD == 'Submitted' || ((<any>window).usrRole == 'FSE' && curPricingTable.PS_WF_STG_CD != 'Draft' && curPricingTable.PS_WF_STG_CD != '')) {
            if (hotTable.getDataAtRowProp(row, 'DC_ID') == null || hotTable.getDataAtRowProp(row, 'DC_ID') == '') {
                cellProperties['readOnly'] = true;
            }
            else {
                if (hotTable.getDataAtRowProp(row, '_behaviors') != undefined && hotTable.getDataAtRowProp(row, '_behaviors') != null) {
                    var behaviors = hotTable.getDataAtRowProp(row, '_behaviors');
                    if (behaviors.isReadOnly != undefined && behaviors.isReadOnly != null) {
                        if (behaviors.isReadOnly["ECAP_PRICE"] != undefined && behaviors.isReadOnly["ECAP_PRICE"] != null && prop == "ECAP_PRICE_____20_____1" && behaviors.isReadOnly["ECAP_PRICE"] == true) {
                            cellProperties['readOnly'] = true;
                        }
                        if (behaviors.isReadOnly[prop] != undefined && behaviors.isReadOnly[prop] != null && behaviors.isReadOnly[prop] == true) {
                            cellProperties['readOnly'] = true;
                        }
                    }
                }
            }
        }
        else {
            if ((hotTable.getDataAtRowProp(row, 'DC_ID') == undefined || hotTable.getDataAtRowProp(row, 'DC_ID') == null || hotTable.getDataAtRowProp(row, 'DC_ID') == '') && prop != 'PTR_USER_PRD') {
                cellProperties['readOnly'] = true;
            }
            else {
                if(hotTable.getDataAtRowProp(row, 'DC_ID') != null) {
                    cellProperties['readOnly'] = false;
                }
                //column config has readonly property for certain column persisting that assigning for other
                if (_.findWhere(columnConfig, { data: prop }).readOnly) {
                    cellProperties['readOnly'] = true;
                }
                if ((prop == 'STRT_VOL' || prop == 'STRT_REV' || prop == 'STRT_PB') && hotTable.getDataAtRowProp(row, 'TIER_NBR') && hotTable.getDataAtRowProp(row, 'TIER_NBR') != 1) {
                    cellProperties['readOnly'] = true;
                }

                //for tender contract PERIOD_PROFILE and AR_SETTLEMENT_LVL are disable by default 
                if (isTenderContract && (prop == 'PERIOD_PROFILE' || prop == 'AR_SETTLEMENT_LVL')) {
                    cellProperties['readOnly'] = true;
                }
                if (curPricingTable.PS_WF_STG_CD == 'Requested' || curPricingTable.PS_WF_STG_CD == 'Draft' || curPricingTable.PS_WF_STG_CD == '') {
                    if (hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') == undefined || hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') == null || hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') !== 'Cash') {
                        if (prop == 'SETTLEMENT_PARTNER') {
                            cellProperties['readOnly'] = true;
                        }
                    } else {
                        if (prop == 'SETTLEMENT_PARTNER') {
                            cellProperties['readOnly'] = false;
                        }
                    }
                    if (hotTable.getDataAtRowProp(row, 'PROGRAM_PAYMENT') != undefined && hotTable.getDataAtRowProp(row, 'PROGRAM_PAYMENT') != null && hotTable.getDataAtRowProp(row, 'PROGRAM_PAYMENT') != '' && curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") {
                        if (hotTable.getDataAtRowProp(row, 'PROGRAM_PAYMENT').toLowerCase() != 'backend') {
                            if (prop == 'PERIOD_PROFILE' || prop == 'RESET_VOLS_ON_PERIOD' || prop == 'AR_SETTLEMENT_LVL' || prop == 'SETTLEMENT_PARTNER') {
                                cellProperties['readOnly'] = true;
                            }
                        } else {
                            if (hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') != 'Cash') {
                                if (prop == 'PERIOD_PROFILE' || prop == 'RESET_VOLS_ON_PERIOD' || prop == 'AR_SETTLEMENT_LVL') {
                                    cellProperties['readOnly'] = false;
                                }
                            } else {
                                if (prop == 'PERIOD_PROFILE' || prop == 'RESET_VOLS_ON_PERIOD' || prop == 'AR_SETTLEMENT_LVL' || prop == 'SETTLEMENT_PARTNER') {
                                    cellProperties['readOnly'] = false;
                                }
                            }
                        }
                    }
                    if ((curPricingTable.OBJ_SET_TYPE_CD == "REV_TIER" || curPricingTable.OBJ_SET_TYPE_CD == "DENSITY") && prop == "RESET_VOLS_ON_PERIOD") {
                        cellProperties['readOnly'] = true;
                    }
                    if (prop == "REBATE_TYPE" && isTenderContract) {
                        cellProperties['readOnly'] = true;
                    }
                    if (prop == "AR_SETTLEMENT_LVL" && isTenderContract) {
                        cellProperties['readOnly'] = true;
                    }
                    if (prop == "PERIOD_PROFILE" && isTenderContract) {
                        cellProperties['readOnly'] = true;
                    }
                }
                if (curPricingTable.PS_WF_STG_CD == 'Approved' && curPricingTable.PASSED_VALIDATION == 'Dirty' && prop == 'SETTLEMENT_PARTNER' && hotTable.getDataAtRowProp(row, 'AR_SETTLEMENT_LVL') == 'Cash') {
                    cellProperties['readOnly'] = false;
                }
                if ((prop == 'REBATE_OA_MAX_AMT' || prop == 'REBATE_OA_MAX_VOL') && hybridstat == "1" && (hotTable.getDataAtRowProp(row, 'PTR_USER_PRD') != undefined && hotTable.getDataAtRowProp(row, 'PTR_USER_PRD') != null) && (curPricingTable.PS_WF_STG_CD == 'Requested' || curPricingTable.PS_WF_STG_CD == 'Draft' || curPricingTable.PS_WF_STG_CD == '')) {
                    cellProperties['readOnly'] = false;
                }
                //cell behaviors
                if (hotTable.getDataAtRowProp(row, '_behaviors') != undefined && hotTable.getDataAtRowProp(row, '_behaviors') != null) {
                    var behaviors = hotTable.getDataAtRowProp(row, '_behaviors');
                    if (behaviors.isReadOnly != undefined && behaviors.isReadOnly != null) {
                        if (behaviors.isReadOnly["ECAP_PRICE"] != undefined && behaviors.isReadOnly["ECAP_PRICE"] != null && prop == "ECAP_PRICE_____20_____1" && behaviors.isReadOnly["ECAP_PRICE"] == true) {
                            cellProperties['readOnly'] = true;
                        }
                        if (behaviors.isReadOnly[prop] != undefined && behaviors.isReadOnly[prop] != null && behaviors.isReadOnly[prop] == true) {
                            cellProperties['readOnly'] = true;
                        }
                    }
                }
            }
        }
        return cellProperties;
    }

    static setPrdColor(PTR: any[]): any[] {
        _.each(PTR, data => {
            PTE_Common_Util.setBehaviors(data);
            if (data._behaviors.isError['PTR_USER_PRD'] != true && data._behaviors.isError['PTR_USER_PRD'] == undefined) {
                data._behaviors.isError['PTR_USER_PRD'] = false;
                data._behaviors.validMsg['PTR_USER_PRD'] = 'Valid Product';
                if (data['PRD_EXCLDS'] && !data._behaviors.isError['PRD_EXLCDS']) {
                    data._behaviors.isError['PRD_EXCLDS'] = false;
                    data._behaviors.validMsg['PRD_EXCLDS'] = 'Valid Product';
                }
            }
            else {
                data._behaviors.isError['PTR_USER_PRD'] = true;
                if (data['PRD_EXCLDS']) {
                    data._behaviors.isError['PRD_EXCLDS'] = true;
                }
            }
        })
        return PTR;
    }

    static bindWarningDetails(data, savedWarningDetails) {
        _.each(savedWarningDetails, (warning) => {
            _.each(data, (dataItem) => {
                if (dataItem.DC_ID == warning.DC_ID) {
                    if (!dataItem.warningMessages)
                        dataItem.warningMessages = {};
                    dataItem.warningMessages = warning.warningMessages;
                    if (!dataItem._behaviors['validMsg'])
                        dataItem._behaviors['validMsg'] = {};
                    dataItem._behaviors['validMsg'] = warning.validMsg;
                    if (!dataItem._behaviors['isError'])
                        dataItem._behaviors['isError'] = {};
                    dataItem._behaviors['isError'] = warning.errors;
                }
            })
        })
    }
}
