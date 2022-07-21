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
    //this will help to have a custom cell validation which allow only alphabets
    static projectValidator(value, callback) {
        if (/^[a-zA-Z ]{2,30}$/.test(value)) {
            callback(true);
        } else {
            callback(false);
        }
    }
    static EndValueValidator(value, callBack) {
        if (value != undefined && (/^[0-9]+$/.test(value) || value.toLowerCase() == "unlimited")) {
            callBack(true);
        } else {
            callBack(false);
        }
    }
}