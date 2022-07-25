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

            //if (item.field == 'QLTR_PROJECT') {
            //    currentColumnConfig.validator = this.projectValidator;
            //}
            if (item.field == "END_VOL" || item.field == "END_PB") {
                currentColumnConfig.validator = this.EndValueValidator;
            }
            else if (itemField === 'number') {
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
            } 
            else if (templateColumnFields[item.field].uiType && templateColumnFields[item.field].uiType=='DROPDOWN') {
                currentColumnConfig.type = 'dropdown';
                if (item.lookupUrl) {
                    currentColumnConfig.source=_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                }
            }
            else {
                currentColumnConfig.type = 'text';
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
            PTE_Common_Util.setBehaviors(item);
        });
        return PTR;
    }
    static validatePTEECAP(PTR:Array<any>):any{
        //check for Ecap price 
        _.each(PTR,(item) =>{
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
            if(item.ECAP_PRICE==null || item.ECAP_PRICE==0 || item.ECAP_PRICE=='' || item.ECAP_PRICE <0){
                PTE_Common_Util.setBehaviorsValidMessage(item,'ECAP_PRICE','ECAP','equal-zero');
            }
        });
        return PTR;
    }
    static getCellComments(PTR: any,columns:Array<any>): Array<any> {
        let cellComments = [];
        _.each(PTR, (item, rowInd) => {
            if (item._behaviors && item._behaviors.validMsg) {
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
    // set PTR_SYS_PRD attr value after getting transform results
    static cookProducts(transformResults:any, rowData:Array<any>): any {
        // Process multiple match products
        var isAllValidated = true;
        var key: any;
        for (key in transformResults.ProdctTransformResults) {
            _.each(rowData,(data)=>{
                // Flag dependency column errors - these columns may cause product translator to not find a valid product
                if (!!transformResults.InvalidDependancyColumns && !!transformResults.InvalidDependancyColumns[key] && transformResults.InvalidDependancyColumns[key].length > 0) {
                    for (var i = 0; i < transformResults.InvalidDependancyColumns[key].length; i++) {
                        data._behaviors.isError[transformResults.InvalidDependancyColumns[key][i]] = true;
                        data._behaviors.validMsg[transformResults.InvalidDependancyColumns[key][i]] = "Value is invalid and may cause the product to validate incorrectly."
                    }
                }
                // If no duplicate or invalid add valid JSON,setting the value for the DC_IDs which are return frrom API
                if(data && data.DC_ID==key){
                    data.PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
                }
            });
           
        }
        return rowData;
    }
    static hasProductDependency(currentPricingTableRowData, productValidationDependencies, hasProductDependencyErr): boolean {
       //this code will help us to identify uniq entry in case of tier
        let uniqDCIDS=_.uniq(_.pluck(currentPricingTableRowData,'DC_ID'));
        let distinctPricingTableRowData=[];
        _.each(uniqDCIDS,DCID=>{
            distinctPricingTableRowData.push(_.findWhere(currentPricingTableRowData,{DC_ID:DCID}));
        });
        // Validate columns that product is dependent on
        for (var i = 0; i < distinctPricingTableRowData.length; i++) {
            for (var d = 0; d < productValidationDependencies.length; d++) {
                if (distinctPricingTableRowData[i][productValidationDependencies[d]] === null || distinctPricingTableRowData[i][productValidationDependencies[d]] === "") {
                    PTE_Common_Util.setBehaviors(distinctPricingTableRowData[i]);
                    distinctPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]] = true;
                    distinctPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]] = "This field is required.";
                    distinctPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]] = true;
                    hasProductDependencyErr = true;
                }
                else {
                    if (distinctPricingTableRowData[i]._behaviors !== undefined
                        && distinctPricingTableRowData[i]._behaviors.isError !== undefined
                        && distinctPricingTableRowData[i]._behaviors.validMsg !== undefined
                        && distinctPricingTableRowData[i]._behaviors.isRequired !== undefined) {
                        delete distinctPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]];
                        delete distinctPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]];
                        delete distinctPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]];
                    }
                }
            }
        }
        return hasProductDependencyErr;
    }
    //this will help to have a custom cell validation which allow only alphabets
    static projectValidator(value, callback) {
        if (/^[a-zA-Z ]{2,30}$/.test(value)) {
            callback(true);
        } else {
            callback(false);
        }
    }
    static EndValueValidator(value, callBack) {
        if (value != undefined && (!Number.isNaN(Number(value)) || value.toLowerCase() == "unlimited")) {
            callBack(true);
        } else {
            callBack(false);
        }
    }
}