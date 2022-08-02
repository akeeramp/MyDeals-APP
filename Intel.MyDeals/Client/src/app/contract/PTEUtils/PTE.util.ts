/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../../shared/logger/logger';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field } from '../pricingTableEditor/handsontable.interface';
import { pricingTableEditorService } from '../pricingTableEditor/pricingTableEditor.service';
import Handsontable from 'handsontable';
import { IntlService } from "@progress/kendo-angular-intl";
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util'
import * as moment from 'moment';

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
            else if (templateColumnFields[item.field].uiType &&(templateColumnFields[item.field].uiType=='DROPDOWN' ||  templateColumnFields[item.field].uiType=='MULTISELECT' ||  templateColumnFields[item.field].uiType=='EMBEDDEDMULTISELECT')) {
                currentColumnConfig.type = 'dropdown';
                if (item.lookupUrl) {
                    //market segment has items which has child so we need to pass the full object
                    if(item.field=='MRKT_SEG'){
                        currentColumnConfig.source=dropdownResponses[`${item.field}`];
                    }else{
                        currentColumnConfig.source=_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                    }
                    
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
    // set PTR_SYS_PRD attr value after getting transform results
    static cookProducts(transformResults:any, rowData:Array<any>): any {
        let inValidProd:any[]=[]
        _.each(rowData,(data)=>{
            //setting PTR_SYS_PRD for valid products
            _.each(transformResults.ValidProducts,(val,DCID)=>{
                if(data && data.DC_ID==DCID){
                    data.PTR_SYS_PRD = JSON.stringify(val)
                    PTE_Common_Util.setBehaviors(data);
                    data._behaviors.isError['PTR_USER_PRD']=false;
                }
            });
               //setting PTR_SYS_PRD for InValidProducts
           _.each(transformResults.InValidProducts,(val,DCID)=>{
              if(val.I && val.I.length>0){
                if(data && data.DC_ID==DCID){
                    PTE_Common_Util.setBehaviors(data);
                    data._behaviors.isError['PTR_USER_PRD']=true;
                }
              }
            });
             //setting PTR_SYS_PRD for DuplicateProducts
            _.each(transformResults.DuplicateProducts,(val,DCID)=>{
                  if(data && data.DC_ID==DCID){
                      PTE_Common_Util.setBehaviors(data);
                      data._behaviors.isError['PTR_USER_PRD']=true;
                  }
              });
         });
        //setting InValidProducts for corrector
        _.each(transformResults.InValidProducts,(val,DCID)=>{
            if(val.I && val.I.length>0){
                inValidProd.push({DCID,Product:val.I.toString()});
              }
            });
         return {rowData,inValidProd};
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
    static translationToSendObj(curPricingTable:any,currentPricingTableRowData:Array<any>,contractData:any):any{
        //Getting deal type
        let dealType = curPricingTable.OBJ_SET_TYPE_CD;

        // Pricing table rows products to be translated
        let pricingTableRowData = currentPricingTableRowData.filter((x) => {
            return ((x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true))
                || (dealType == "KIT"); //|| ($scope.isExcludePrdChange);
        });

        //find uniq records incase of tier logic
        pricingTableRowData=_.uniq(pricingTableRowData,'DC_ID');
        // Convert into format accepted by translator API
        // ROW_NUMBER, CUST_MBR_SID, IS_HYBRID_PRC_STRAT - Remove hard coded values
        let translationInput = pricingTableRowData.map((row, index) =>{
            return {
                ROW_NUMBER: row.DC_ID,
                USR_INPUT: row.PTR_USER_PRD,
                EXCLUDE: false,
                FILTER: row.PROD_INCLDS,
                START_DATE: moment(row.START_DT).format("l"),
                END_DATE: moment(row.END_DT).format("l"),
                GEO_COMBINED: row.GEO_COMBINED,
                PROGRAM_PAYMENT: row.PROGRAM_PAYMENT,
                PAYOUT_BASED_ON: row.PAYOUT_BASED_ON,
                CUST_MBR_SID: contractData.CUST_MBR_SID,
                IS_HYBRID_PRC_STRAT: curPricingTable.IS_HYBRID_PRC_STRAT,
                SendToTranslation: (dealType == "KIT") || !(row.PTR_SYS_INVLD_PRD != null && row.PTR_SYS_INVLD_PRD != "")
            }
        });

        let translationInputToSend = translationInput.filter(function (x) {
            // If we already have the invalid JSON don't translate the products again
            return x.SendToTranslation == true;
        });

        // Products invalid JSON data present in the row
        let invalidProductJSONRows = pricingTableRowData.filter(function (x) {
            return (x.PTR_SYS_INVLD_PRD != null && x.PTR_SYS_INVLD_PRD != "");
        });

        return translationInput;
    }
}