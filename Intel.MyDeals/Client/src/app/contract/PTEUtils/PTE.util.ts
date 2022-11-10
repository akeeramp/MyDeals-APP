/* eslint-disable prefer-const */
import * as _ from 'underscore';
import { logger } from '../../shared/logger/logger';
import { PRC_TBL_Model_Attributes, PRC_TBL_Model_Column, PRC_TBL_Model_Field } from '../pricingTableEditor/handsontable.interface';
import { pricingTableEditorService } from '../pricingTableEditor/pricingTableEditor.service';
import Handsontable from 'handsontable';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util'
import * as moment from 'moment';
import { PTE_Helper_Util } from './PTE_Helper_util';

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
   
    static generateHandsontableColumn(isTenderContract:any,pteService: pricingTableEditorService,
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

            if (item.field == "END_VOL" || item.field == "END_PB" || item.field === 'STRT_VOL') {
                currentColumnConfig.type = 'numeric';
                currentColumnConfig.numericFormat = {
                    pattern: '0,0',
                    culture: 'en-US'
                }
                if (item.field == "END_VOL" || item.field == "END_PB") {
                    currentColumnConfig.validator = this.EndValueValidator;
                }
            }
            else if (itemField === 'number') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                const cellFormat: string = templateColumnFields[item.field].format;
                if (cellFormat && cellFormat.toLowerCase().includes('0:d')) { // Decimalized
                    currentColumnConfig.numericFormat = {
                        pattern: '0,00',
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
                currentColumnConfig.numericFormat = {
                    pattern: '0,0.00',
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
                    // for tender, PAYOUT_BASED_ON  must not have Billings
                    if(item.field=='PAYOUT_BASED_ON' && isTenderContract){
                        currentColumnConfig.source=_.reject(_.pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`),itm=>{ return itm =='Billings'});
                    }
                    //market segment has items which has child so we need to pass the full object
                    else if(item.field=='MRKT_SEG'){
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
        /* Is Required & Nullable -- this is behaviour of handsone but as part of our validate process we check this */
        // if (item.isRequired || !templateColumnFields[item.field].nullable) {
        //     currentColumnConfig.allowEmpty = false;
        // }
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
        _.each(rowData,(data)=>{
            //setting PTR_SYS_PRD for valid products
            _.each(transformResults.ValidProducts,(val,DCID)=>{
                if(data && data.DC_ID==DCID){
                    let foramttedTranslatedResult = PTEUtil.massagingObjectsForJSON(DCID, transformResults);
                    var userInput = PTEUtil.updateUserInput(foramttedTranslatedResult.ValidProducts[DCID]);
                    var contractProducts = userInput['contractProducts'].toString().replace(/(\r\n|\n|\r)/gm, "");
                    data.PTR_USER_PRD = contractProducts;
                    var excludeProducts = userInput['excludeProducts'];                   
                    data.PTR_SYS_PRD = JSON.stringify(val)
                    PTE_Common_Util.setBehaviors(data);
                    data._behaviors.isError['PTR_USER_PRD']=false;
                    data._behaviors.validMsg['PTR_USER_PRD'] = 'Valid Product';
                    if (excludeProducts != "" && excludeProducts != null) {
                        data.PRD_EXCLDS = excludeProducts;
                        data._behaviors.isError['PRD_EXCLDS'] = false;
                        data._behaviors.validMsg['PRD_EXCLDS'] = 'Valid Product';
                    }
                }
            });
               //setting PTR_SYS_PRD for InValidProducts
           _.each(transformResults.InValidProducts,(val,DCID)=>{
              if(val.I && val.I.length>0){
                    if(data && data.DC_ID==DCID){
                        PTE_Common_Util.setBehaviors(data);
                        if (_.has(val, data.PTR_USER_PRD)) {
                            data._behaviors.isError['PTR_USER_PRD'] = true;
                            data._behaviors.validMsg['PTR_USER_PRD'] = 'Invalid product';
                        }
                        if (_.has(val, data.PRD_EXCLDS)) {
                            data._behaviors.isError['PRD_EXCLDS'] = true;
                            data._behaviors.validMsg['PRD_EXCLDS'] = 'Invalid product';
                        }
                    }
                }
            });
            //setting PTR_SYS_PRD for DuplicateProducts
            _.each(transformResults.DuplicateProducts, (val, DCID) =>{
                if (data && data.DC_ID == DCID) {
                    PTE_Common_Util.setBehaviors(data);
                    if (_.has(val, data.PTR_USER_PRD)) {
                        data._behaviors.isError['PTR_USER_PRD'] = true;
                        data._behaviors.validMsg['PTR_USER_PRD'] = 'Invalid product';
                    }
                    if (_.has(val, data.PRD_EXCLDS)) {
                        data._behaviors.isError['PRD_EXCLDS'] = true;
                        data._behaviors.validMsg['PRD_EXCLDS'] = 'Invalid product';
                    }
                }
            });
        });

        return { rowData };
    }
    static isValidForProdCorrector(transformResults:any){
         let isError=[];
           //setting PTR_SYS_PRD for DuplicateProducts
          _.each(transformResults.DuplicateProducts,(val,key)=>{
                if(_.keys(val).length>0){
                    isError.push('1');
                }
            });
            _.each(transformResults.InValidProducts,(val,key)=>{
                if ((val.I && val.I.length > 0) || (val.E && val.E.length > 0) ){
                    isError.push('2');
                }
            });
        return isError;
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
    static translationToSendObj(curPricingTable:any,currentPricingTableRowData:Array<any>,contractData: any, isExcludePrdChange:any):any{
        //Getting deal type
        let dealType = curPricingTable.OBJ_SET_TYPE_CD;

        // Pricing table rows products to be translated
        let pricingTableRowData = currentPricingTableRowData.filter((x) => {
            return ((x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true))
                || (dealType == "KIT") || (isExcludePrdChange);
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

        if (currentPricingTableRowData && currentPricingTableRowData[0] && currentPricingTableRowData[0].PRD_EXCLDS != undefined) {
            _.each(pricingTableRowData, obj => {
                if (!!obj.PRD_EXCLDS && obj.PRD_EXCLDS.length > 0) {
                    let object = {
                        ROW_NUMBER: obj.DC_ID,
                        USR_INPUT: obj.PRD_EXCLDS,
                        EXCLUDE: true,
                        FILTER: obj.PROD_INCLDS,
                        START_DATE: moment(obj.START_DT).format("l"),
                        END_DATE: moment(obj.END_DT).format("l"),
                        GEO_COMBINED: PTE_Helper_Util.getFormatedGeos(obj.GEO_COMBINED),
                        PROGRAM_PAYMENT: obj.PROGRAM_PAYMENT,
                        PAYOUT_BASED_ON: obj.PAYOUT_BASED_ON,
                        CUST_MBR_SID: contractData.CUST_MBR_SID,
                        IS_HYBRID_PRC_STRAT: curPricingTable.IS_HYBRID_PRC_STRAT,
                        //SendToTranslation: (dealType == "DENSITY") || !(obj.PTR_SYS_INVLD_PRD != null && obj.PTR_SYS_INVLD_PRD != "")
                        SendToTranslation: (dealType == "DENSITY" || isExcludePrdChange || !(obj.PTR_SYS_INVLD_PRD != null && obj.PTR_SYS_INVLD_PRD != ""))
                    }
                    translationInput.push(object);
                }
            })
        }

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

    static massagingObjectsForJSON(key, transformResult) {
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

    static updateUserInput(validProducts) {
        if (!validProducts) {
            return "";
        }
        let input = { contractProducts: "", excludeProducts: "" };
        for (var prd in validProducts) {
            if (validProducts.hasOwnProperty(prd)) {
                var contractProducts = "";
                var excludeProducts = "";

                // Include products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === false;
                });
                if (products.length !== 0) {
                    var contDerivedUserInput = _.uniq(products, 'HIER_VAL_NM');
                    if (products.length === 1 && contDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() == contDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        contractProducts = contDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        contractProducts = contDerivedUserInput.length == 1 ? PTE_Common_Util.getFullNameOfProduct(contDerivedUserInput[0], contDerivedUserInput[0].DERIVED_USR_INPUT) : contDerivedUserInput[0].DERIVED_USR_INPUT;
                    }
                    if (contractProducts !== "") {
                        input.contractProducts = input.contractProducts === "" ? contractProducts : input.contractProducts + "," + contractProducts;
                    }
                }

                // Exclude Products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === true;
                });
                if (products.length !== 0) {
                    var exclDerivedUserInput = _.uniq(products, 'HIER_VAL_NM');
                    if (products.length === 1 && exclDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() === exclDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        excludeProducts = exclDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        excludeProducts = exclDerivedUserInput.length == 1 ? PTE_Common_Util.getFullNameOfProduct(exclDerivedUserInput[0], exclDerivedUserInput[0].DERIVED_USR_INPUT) : exclDerivedUserInput[0].DERIVED_USR_INPUT;
                    }
                    if (excludeProducts !== "") {
                        input.excludeProducts = input.excludeProducts === "" ? excludeProducts : input.excludeProducts + "," + excludeProducts;
                    }
                }
            }
        }
        return input;
    }

    static updateUserInputFromCorrector(validProducts, autoValidatedProducts) {
        if (!validProducts) {
            return "";
        }
        var products = { 'contractProducts': '', 'excludeProducts': '' };

        for (var prd in validProducts) {
            if (!!autoValidatedProducts && autoValidatedProducts.hasOwnProperty(prd)) {
                var autoTranslated = {};
                autoTranslated[prd] = autoValidatedProducts[prd];

                var updatedUserInput = PTEUtil.updateUserInput(autoTranslated);

                // Include products
                var autoValidContProd = updatedUserInput["contractProducts"];
                if (autoValidContProd !== "") {
                    products.contractProducts = products.contractProducts === "" ? autoValidContProd : products.contractProducts + "," + autoValidContProd;
                }

                // Exclude Products
                var autoValidExcludeProd = updatedUserInput["excludeProducts"];
                if (autoValidExcludeProd !== "") {
                    products.excludeProducts = products.excludeProducts === "" ? autoValidExcludeProd : products.excludeProducts + "," + autoValidExcludeProd;
                }
            }
            else if (validProducts.hasOwnProperty(prd)) {
                products.contractProducts = this.getUserInput(products.contractProducts, validProducts[prd], "I", 'HIER_VAL_NM');
                products.excludeProducts = this.getUserInput(products.excludeProducts, validProducts[prd], "E", 'HIER_VAL_NM');
            }
        }
        return products;
    }

    static getUserInput = function (updatedUserInput, products, typeOfProduct, fieldNm) {

        var userInput = products.filter(function (x) {
            return x.EXCLUDE === (typeOfProduct === "E");
        });
        userInput = _.uniq(userInput, fieldNm);

        userInput = userInput.map(function (elem) {
            return elem[fieldNm];
        }).join(",");

        if (userInput !== "") {
            updatedUserInput = updatedUserInput === "" || fieldNm !== 'HIER_VAL_NM' ? userInput : updatedUserInput + "," + userInput;
        }
        return updatedUserInput;
    }

    static getValidDenProducts(item, prdSrc) {
        /*
        * A single row can have multiple products & in spreadDs data the products are sorted
        * Also in case of product corrector the user input is not a valid product until selected from the list.
        * In that case it will be good to read HIER_VAL_NM from the response as user input
        */
        let userInput;
        if (prdSrc) {
            userInput = this.updateUserInputFromCorrector(item, "");
        }
        else {
            userInput = this.updateUserInput(item);
        }
        return userInput == '' ? userInput : userInput.contractProducts.split(',');
    }
}
