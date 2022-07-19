/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../../shared/logger/logger';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field } from '../pricingTableEditor/handsontable.interface';
import { pricingTableEditorService } from '../pricingTableEditor/pricingTableEditor.service';
import Handsontable from 'handsontable';
import { IntlService } from "@progress/kendo-angular-intl";
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util'

export class PTEUtil {

    // Handsontable Config Defaults
    private static defaultDateFormat = 'MM/DD/YYYY';
    private static defaultDatePickerConfig = {
        // First day of the week (0: Sunday, 1: Monday, etc)
        firstDay: 1,
        showWeekNumber: true,
        numberOfMonths: 1,
        licenseKey: '8cab5-12f1d-9a900-04238-a4819',
        // disableDayFn(date) {
        //   // Disable Sunday and Saturday
        //   return date.getDay() === 0 || date.getDay() === 6;
        // }
    };
    static calculateKitRebate = function (data, firstTierRowIndex, numOfTiers, isDataPivoted) {
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
    static calculateTotalDsctPerLine = function (dscntPerLine, qty) {
        return (parseFloat(dscntPerLine) * parseInt(qty) || 0);
    }
    static assignProductProprties = function (data, isTenderContract, curPricingTable) {
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
    static pivotData = function (data, isTenderContract, curPricingTable, kitDimAtrbs) {        //convert how we save data in MT to UI spreadsheet consumable format
        data = this.assignProductProprties(data, isTenderContract, curPricingTable);
        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"];
        var densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
        if (!this.isPivotable(curPricingTable)) return data;
        var newData = [];
        let dealType = curPricingTable['OBJ_SET_TYPE_CD'];

        for (var d = 0; d < data.length; d++) {
            // Tiered data
            var productJSON = data[d]["PTR_SYS_PRD"] !== undefined && data[d]["PTR_SYS_PRD"] !== null && data[d]["PTR_SYS_PRD"] !== "" ? JSON.parse(data[d]["PTR_SYS_PRD"]) : [];
            var numTiers = this.numOfPivot(data[d], curPricingTable);
            let curTier = 1, db = 1, dt = 1;

            for (var t = 1; t <= numTiers; t++) {
                var lData = this.deepClone(data[d]);

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
                                lData[endKey] =parseFloat(lData[endKey] || 0);
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
    static deepClone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    static isPivotable = function (curPricingTable) {
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
    static numOfPivot = function (dataItem, curPricingTable) {
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
    static generateHandsontableColumn(pteService: pricingTableEditorService,
        loggerService: logger,
        dropdownResponses: any[],
        templateColumnFields: PRC_TBL_Model_Field[],
        templateColumnAttributes: PRC_TBL_Model_Attributes[],
        item: PRC_TBL_Model_Column,
        index: number): Handsontable.ColumnSettings {
        let currentColumnConfig: Handsontable.ColumnSettings = {
            data: item.field,
            width: item.width,
            readOnly:false
        }

        /* Type & Format */
        if (!_.isUndefined(templateColumnFields[item.field].type)) {
            const itemField = templateColumnFields[item.field].type;

            if (itemField === 'number') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                const cellFormat: string = templateColumnFields[item.field].format;
                if (cellFormat && cellFormat.toLowerCase().includes('0:d')) { // Decimalized
                    currentColumnConfig.numericFormat = {
                        pattern: '0,0.00',
                        culture: 'en-US'
                    }
                } else if (cellFormat && cellFormat.toLowerCase().includes('0:c')) { // Currency
                    currentColumnConfig.numericFormat = {
                        pattern: '$0,0.00',
                        culture: 'en-US'
                    }
                }
            } else if (itemField === 'percent') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                currentColumnConfig.numericFormat = {
                    pattern: '0,0.00%',
                    culture: 'en-US'
                }
            } else if (item.field === 'END_VOL') {
                currentColumnConfig.type = 'numeric';

                currentColumnConfig.numericFormat = {
                    pattern: '0,0',
                    culture: 'en-US'
                }
            } else if (itemField === 'date') {
                currentColumnConfig.type = 'date';
                currentColumnConfig.dateFormat = this.defaultDateFormat;
                currentColumnConfig.datePickerConfig = this.defaultDatePickerConfig;
            } else {
                currentColumnConfig.type = 'text';
            }

            if (!_.isUndefined(templateColumnAttributes[item.field])) {
                currentColumnConfig.type = 'dropdown';
                if (item.lookupUrl) {
                    currentColumnConfig.source=_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                }
            }
        }
        /* Is Required & Nullable */
        if (item.isRequired || !templateColumnFields[item.field].nullable) {
            currentColumnConfig.allowEmpty = false;

            if (item.isRequired) {
                item.title += ' *'; // Add `*` to header
            }
        }

        /* Sorting */
        if (item.sortable) {
            currentColumnConfig.columnSorting = {
                indicator: true,
                headerAction: true,
                // WIP: Comparsion Function
            }
        }
        /* Editable or not */
        if(!templateColumnFields[`${item.field}`].editable){
            currentColumnConfig.readOnly=true;
        }
        return currentColumnConfig;
    }
    static getCellComments(PTR: any,columns:Array<any>): Array<any> {
        let cellComments = [];
        _.each(PTR, (item, rowInd) => {
            if (item._behaviors.validMsg) {
                _.each(item._behaviors.validMsg, (val, key) => {
                    let colInd = _.findIndex(columns, { field: key });
                    cellComments.push({ row: rowInd, col: colInd, comment: { value: val,readOnly: true }, className: 'error-border' });
                    if (_.findWhere(cellComments, { row: rowInd, col: 0 }) == undefined) {
                        cellComments.push({ row: rowInd, col: 0, className: 'error-cell' });
                    }
                });
            }
        });
        return cellComments;
    }
    static getMergeCells(PTR: any,columns:Array<any>,NUMOFTIERS:string):Array<any> {
        let mergCells = [];
        //identify distinct DCID, bcz the merge will happen for each DCID and each DCID can have diff  NUM_OF_TIERS
        let distDCID = _.uniq(PTR, 'DC_ID');
        _.each(distDCID, (item) => {
            let curPTR = _.findWhere(PTR, { DC_ID: item.DC_ID });

            //get NUM_OF_TIERS acoording this will be the row_span for handson
            let NUM_OF_TIERS =curPTR.NUM_OF_TIERS !=undefined ? parseInt(curPTR.NUM_OF_TIERS) :parseInt(NUMOFTIERS);
            _.each(columns, (colItem, ind) => {
                if (!colItem.isDimKey && !colItem.hidden) {
                    let rowIndex = _.findIndex(PTR, { DC_ID: item.DC_ID });
                    mergCells.push({ row: rowIndex, col: ind, rowspan: NUM_OF_TIERS, colspan: 1 });
                }
            })
        });
        return mergCells;
    }
    static setBehaviors(item:any, elem?:string) {
        if (!item._behaviors) item._behaviors = {};
        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
        if (!item._behaviors.isError) item._behaviors.isError = {};
        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
        if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    }
    static setBehaviorsValidMessage(item:any, elem:string, elemLabel:string, cond:string){
        if (elem === 'ECAP_PRICE' && cond=='equal-zero') {
            item._behaviors.isRequired[elem] = true;
            item._behaviors.isError[elem] = true;
            item._behaviors.validMsg[elem] = `${elemLabel} must be positive number`;
        }
    }
    static validatePTE(PTR:Array<any>,ObjType:string):any{
        if(ObjType=='ECAP'){
            return PTEUtil.validatePTEECAP(PTR);
        }
        else{
            return PTEUtil.validatePTEDeal(PTR);
        }
    }
    static validatePTEDeal(PTR:Array<any>):any{
        _.each(PTR,(item) =>{
            //defaulting the behaviours object
            PTEUtil.setBehaviors(item);
        });
        return PTR;
    }
    static validatePTEECAP(PTR:Array<any>):any{
        //check for Ecap price 
        _.each(PTR,(item) =>{
            //defaulting the behaviours object
            PTEUtil.setBehaviors(item);
            if(item.ECAP_PRICE==null || item.ECAP_PRICE==0 || item.ECAP_PRICE=='' || item.ECAP_PRICE <0){
                PTEUtil.setBehaviorsValidMessage(item,'ECAP_PRICE','ECAP','equal-zero');
            }
        });
        return PTR;
    }
    // set PTR_SYS_PRD attr value after getting transform results
    static cookProducts(transformResults, rowData): any {
        let data = rowData;

        // Process multiple match products
        var isAllValidated = true;
        var key: any;
        for (key in transformResults.ProdctTransformResults) {
            let r = key - 1;
            // Flag dependency column errors - these columns may cause product translator to not find a valid product
            if (!!transformResults.InvalidDependancyColumns && !!transformResults.InvalidDependancyColumns[key] && transformResults.InvalidDependancyColumns[key].length > 0) {
                for (var i = 0; i < transformResults.InvalidDependancyColumns[key].length; i++) {
                    data[r]._behaviors.isError[transformResults.InvalidDependancyColumns[key][i]] = true;
                    data[r]._behaviors.validMsg[transformResults.InvalidDependancyColumns[key][i]] = "Value is invalid and may cause the product to validate incorrectly."
                }
            }
            // If no duplicate or invalid add valid JSON
            data[r].PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
        }
        return data;
    }
    static hasProductDependency(currentPricingTableRowData, productValidationDependencies, hasProductDependencyErr): boolean {
        // Validate columns that product is dependent on
        for (var i = 0; i < currentPricingTableRowData.length; i++) {
            for (var d = 0; d < productValidationDependencies.length; d++) {
                if (currentPricingTableRowData[i][productValidationDependencies[d]] === null || currentPricingTableRowData[i][productValidationDependencies[d]] === "") {
                    PTEUtil.setBehaviors(currentPricingTableRowData[i]);
                    currentPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]] = true;
                    currentPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]] = "This field is required.";
                    currentPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]] = true;
                    hasProductDependencyErr = true;
                }
                else {
                    if (currentPricingTableRowData[i]._behaviors !== undefined
                        && currentPricingTableRowData[i]._behaviors.isError !== undefined
                        && currentPricingTableRowData[i]._behaviors.validMsg !== undefined
                        && currentPricingTableRowData[i]._behaviors.isRequired !== undefined) {
                        delete currentPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]];
                        delete currentPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]];
                        delete currentPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]];
                    }
                }
            }
        }
        return hasProductDependencyErr;
    }

}