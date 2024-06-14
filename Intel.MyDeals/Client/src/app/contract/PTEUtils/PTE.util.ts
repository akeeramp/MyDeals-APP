import { each, uniq, sortBy, pluck, findWhere, findIndex, reject, find, keys, isUndefined } from 'underscore';
import Handsontable from 'handsontable';
import { HandsonLicenseKey } from '../../shared/config/handsontable.licenseKey.config';

import {  PRC_TBL_Model_Column, PRC_TBL_Model_Field } from '../pricingTableEditor/handsontable.interface';
import { PTE_Common_Util } from '../PTEUtils/PTE_Common_util'
import { StaticMomentService } from "../../shared/moment/moment.service";
import { PTE_Helper_Util } from './PTE_Helper_util';
import { PTE_Validation_Util } from './PTE_Validation_util';
import { PTE_Load_Util } from './PTE_Load_util';
import { PTE_Config_Util } from './PTE_Config_util';
import { PTE_CellChange_Util } from './PTE_CellChange_util';

export class PTEUtil {

    // Handsontable Config Defaults
    private static defaultDateFormat = 'MM/DD/YYYY';
    private static defaultDatePickerConfig = {
        // First day of the week (0: Sunday, 1: Monday, etc)
        firstDay: 1,
        showWeekNumber: true,
        numberOfMonths: 1,
        licenseKey: HandsonLicenseKey.license,
    };
   
    static generateHandsontableColumn(isTenderContract:any,
                                      dropdownResponses: any[],
                                      templateColumnFields: PRC_TBL_Model_Field[],
                                      item: PRC_TBL_Model_Column): Handsontable.ColumnSettings {
        let currentColumnConfig: Handsontable.ColumnSettings = {
            data: item.field,
            width: item.width,
            readOnly:false
        }

        /* Type & Format */
        if (templateColumnFields[item.field].type != null) {
            const ITEM_FIELD = templateColumnFields[item.field].type;

            if (item.field == "END_VOL" || item.field == "END_PB" || item.field === 'STRT_VOL') {
                currentColumnConfig.type = 'numeric';
                currentColumnConfig.numericFormat = {
                    pattern: '0,0',
                    culture: 'en-US'
                }
                if (item.field == "END_VOL" || item.field == "END_PB") {
                    currentColumnConfig.validator = this.EndValueValidator;
                }
            } else if (item.field == "VOLUME") {
                currentColumnConfig.type = 'text';
            } else if (ITEM_FIELD === 'number') {
                currentColumnConfig.type = 'numeric';

                // Formatting
                const CELL_FORMAT: string = templateColumnFields[item.field].format;
                if (CELL_FORMAT && CELL_FORMAT.toLowerCase().includes('0:d')) { // Decimalized
                    currentColumnConfig.numericFormat = {
                        pattern: '0,00',
                        culture: 'en-US'
                    }
                } else if (CELL_FORMAT && CELL_FORMAT.toLowerCase().includes('0:c')) { // Currency
                    currentColumnConfig.numericFormat = {
                        pattern: '$0,0.00',
                        culture: 'en-US'
                    }

                    // TWC3119-682 - Currency cells have a max numeric value
                    // const MAX_VALUE = 1000000000; // API max value is 1E23, set to 1E9
                    // currentColumnConfig.validator = (value, callback) => {
                    //     if (value > MAX_VALUE) {
                    //         callback(false);
                    //     } else {
                    //         callback(true);
                    //     }
                    // }
                }
            } else if (ITEM_FIELD === 'percent') {
                currentColumnConfig.type = 'numeric';
                currentColumnConfig.numericFormat = {
                    pattern: '0,0.00',
                    culture: 'en-US'
                }
            } else if (ITEM_FIELD === 'date') {
                currentColumnConfig.type = 'date';
                currentColumnConfig.dateFormat = this.defaultDateFormat;
                currentColumnConfig.datePickerConfig = this.defaultDatePickerConfig;
                currentColumnConfig.correctFormat = true
            }  else if (templateColumnFields[item.field].uiType &&(templateColumnFields[item.field].uiType=='DROPDOWN' ||  templateColumnFields[item.field].uiType=='MULTISELECT' ||  templateColumnFields[item.field].uiType=='EMBEDDEDMULTISELECT')) {
                currentColumnConfig.type = 'dropdown';
                if (item.lookupUrl) {
                    // for tender, PAYOUT_BASED_ON  must not have Billings
                    if (item.field == 'PAYOUT_BASED_ON' && isTenderContract) {
                        currentColumnConfig.source=reject(pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`),itm=>{ return itm =='Billings'});
                    } else if(item.field == 'MRKT_SEG') {    // market segment has items which has child so we need to pass the full object
                        currentColumnConfig.source=dropdownResponses[`${item.field}`];
                    } else {
                        currentColumnConfig.source=pluck(dropdownResponses[`${item.field}`],`${item.lookupValue}`);
                    }
                }
            } else {
                currentColumnConfig.type = 'text';
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
        each(PTR,(item) =>{
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
        });
        return PTR;
    }
    static validatePTEECAP(PTR:Array<any>):any{
        //check for Ecap price 
        each(PTR,(item) =>{
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
        each(PTR, (item, rowInd) => {
            if (item._behaviors && item._behaviors.validMsg) {
                each(item._behaviors.validMsg, (val, key) => {
                    let colInd = findIndex(columns, { field: key });
                    cellComments.push({ row: rowInd, col: colInd, comment: { value: val,readOnly: true }, className: 'error-border' });
                    if (findWhere(cellComments, { row: rowInd, col: 0 }) == undefined) {
                        cellComments.push({ row: rowInd, col: 0, className: 'error-cell' });
                    }
                });
            }
        });
        return cellComments;
    }
    // set PTR_SYS_PRD attr value after getting transform results
    static cookProducts(transformResults:any, rowData:Array<any>): any {
        each(rowData, (data) => {

            //this logic has been removed added in pricing table editor validateproducts later
            PTE_Common_Util.setBehaviors(data);
            if (data['PTR_USER_PRD'] && data['PTR_USER_PRD'] != '') {
                
                data._behaviors.isError['PTR_USER_PRD'] = false;
                data._behaviors.validMsg['PTR_USER_PRD'] = 'Valid Product';
            }
            if (data['PRD_EXCLDS'] && data['PRD_EXCLDS'] != '') {
                data._behaviors.isError['PRD_EXCLDS'] = false;
                data._behaviors.validMsg['PRD_EXCLDS'] = 'Valid Product';
            }
            
            //setting PTR_SYS_PRD for valid products
            if (transformResults && transformResults.ValidProducts) {
                each(transformResults.ValidProducts, (val, DCID) => {
                    if (data && data.DC_ID == DCID) {
                        let foramttedTranslatedResult = PTEUtil.massagingObjectsForJSON(DCID, transformResults);
                        const userInput = PTEUtil.updateUserInput(foramttedTranslatedResult.ValidProducts[DCID]);
                        if (userInput && userInput['contractProducts']) {
                            const contractProducts = userInput['contractProducts'].toString().replace(/(\r\n|\n|\r)/gm, "");
                            data.PTR_USER_PRD = contractProducts;
                            data.PTR_SYS_PRD = JSON.stringify(val)
                            PTE_Common_Util.setBehaviors(data);
                            data._behaviors.isError['PTR_USER_PRD'] = false;
                            data._behaviors.validMsg['PTR_USER_PRD'] = 'Valid Product';
                            if (userInput['excludeProducts']) {
                                const excludeProducts = userInput['excludeProducts'];
                                if (excludeProducts != "" && excludeProducts != null) {
                                    data.PRD_EXCLDS = excludeProducts;
                                    data._behaviors.isError['PRD_EXCLDS'] = false;
                                    data._behaviors.validMsg['PRD_EXCLDS'] = 'Valid Product';
                                }
                            }
                        }
                    }
                });
            }
               //setting PTR_SYS_PRD for InValidProducts
            if (transformResults && transformResults.InValidProducts) {
                each(transformResults.InValidProducts, (val, DCID) => {
                        if (data && data.DC_ID == DCID) {
                            PTE_Common_Util.setBehaviors(data);
                            if (val.I && val.I.length > 0 && find(val['I'], (test) => { return data.PTR_USER_PRD.includes(test) })) {
                                data._behaviors.isError['PTR_USER_PRD'] = true;
                                data._behaviors.validMsg['PTR_USER_PRD'] = 'Invalid product';
                            }
                            if (val.E && val.E.length > 0 && find(val['E'], (test) => { return data.PRD_EXCLDS.includes(test) })) {
                                data._behaviors.isError['PRD_EXCLDS'] = true;
                                data._behaviors.validMsg['PRD_EXCLDS'] = 'Invalid product';
                            }
                    }
                });
            }
            //setting PTR_SYS_PRD for DuplicateProducts
            if (transformResults && transformResults.DuplicateProducts) {
                each(transformResults.DuplicateProducts, (val, DCID) => {
                    if (data && data.DC_ID == DCID) {
                        PTE_Common_Util.setBehaviors(data);
                        if (find(val, (test) => { return data.PTR_USER_PRD.includes(test) })) {
                           
                            data._behaviors.isError['PTR_USER_PRD'] = true;
                            data._behaviors.validMsg['PTR_USER_PRD'] = 'Invalid product';
                        }
                        if (find(val, (test) => { return data.PTR_USER_PRD.includes(test) })) {
                            data._behaviors.isError['PRD_EXCLDS'] = true;
                            data._behaviors.validMsg['PRD_EXCLDS'] = 'Invalid product';
                        }
                    }
                });
            }
        });

        return { rowData };
    }
    static isValidForProdCorrector(transformResults:any){
         let isError=[];
           //setting PTR_SYS_PRD for DuplicateProducts
        if (transformResults && transformResults.DuplicateProducts) {
            each(transformResults.DuplicateProducts, (val) => {
                if (keys(val).length > 0) {
                    isError.push('1');
                }
            });
        }
        if (transformResults && transformResults.InValidProducts) {
            each(transformResults.InValidProducts, (val) => {
                if ((val.I && val.I.length > 0) || (val.E && val.E.length > 0)) {
                    isError.push('1');
                }
            });
        }
        
        return isError;
    }
    static hasProductDependency(currentPricingTableRowData, productValidationDependencies, hasProductDependencyErr): boolean {
       //this code will help us to identify uniq entry in case of tier
        let uniqDCIDS=uniq(pluck(currentPricingTableRowData,'DC_ID'));
        let distinctPricingTableRowData=[];
        each(uniqDCIDS,DCID=>{
            distinctPricingTableRowData.push(findWhere(currentPricingTableRowData,{DC_ID:DCID}));
        });
        // Validate columns that product is dependent on
        for (let i = 0; i < distinctPricingTableRowData.length; i++) {
            for (let d = 0; d < productValidationDependencies.length; d++) {
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
    static translationToSendObj(curPricingTable: any, currentPricingTableRowData: Array<any>, contractData: any, isExcludePrdChange: any): any {
        //Getting deal type
        let dealType = curPricingTable.OBJ_SET_TYPE_CD;

        // Pricing table rows products to be translated
        let pricingTableRowData = currentPricingTableRowData.filter((x) => {

            return (
                (x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true) ||
                (((x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) && (x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null)) ? ((Object.keys(JSON.parse(x.PTR_SYS_PRD)).length != x.PTR_USER_PRD.split(',').length) ? true : false) : false)
                || (dealType == "KIT") || (isExcludePrdChange)
            );
        });

        //find uniq records incase of tier logic
        pricingTableRowData=uniq(pricingTableRowData,'DC_ID');
        // Convert into format accepted by translator API
        // ROW_NUMBER, CUST_MBR_SID, IS_HYBRID_PRC_STRAT - Remove hard coded values
        let translationInput = pricingTableRowData.map((row, index) =>{
            return {
                ROW_NUMBER: row.DC_ID,
                USR_INPUT: PTE_Validation_Util.getCorrectedPtrUsrPrd(row.PTR_USER_PRD),
                EXCLUDE: false,
                FILTER: row.PROD_INCLDS,
                START_DATE: StaticMomentService.moment(row.START_DT).format("l"),
                END_DATE: StaticMomentService.moment(row.END_DT).format("l"),
                GEO_COMBINED: row.GEO_COMBINED,
                PROGRAM_PAYMENT: row.PROGRAM_PAYMENT,
                PAYOUT_BASED_ON: row.PAYOUT_BASED_ON,
                CUST_MBR_SID: contractData.CUST_MBR_SID,
                IS_HYBRID_PRC_STRAT: curPricingTable.IS_HYBRID_PRC_STRAT,
                SendToTranslation: (dealType == "KIT") || !(row.PTR_SYS_INVLD_PRD != null && row.PTR_SYS_INVLD_PRD != "")
            }
        });

        if (currentPricingTableRowData && currentPricingTableRowData[0] && currentPricingTableRowData[0].PRD_EXCLDS != undefined) {
            each(pricingTableRowData, obj => {
                if (!!obj.PRD_EXCLDS && obj.PRD_EXCLDS.length > 0) {
                    let object = {
                        ROW_NUMBER: obj.DC_ID,
                        USR_INPUT: obj.PRD_EXCLDS,
                        EXCLUDE: true,
                        FILTER: obj.PROD_INCLDS,
                        START_DATE: StaticMomentService.moment(obj.START_DT).format("l"),
                        END_DATE: StaticMomentService.moment(obj.END_DT).format("l"),
                        GEO_COMBINED: PTE_Helper_Util.getFormatedGeos(obj.GEO_COMBINED),
                        PROGRAM_PAYMENT: obj.PROGRAM_PAYMENT,
                        PAYOUT_BASED_ON: obj.PAYOUT_BASED_ON,
                        CUST_MBR_SID: contractData.CUST_MBR_SID,
                        IS_HYBRID_PRC_STRAT: curPricingTable.IS_HYBRID_PRC_STRAT,
                        SendToTranslation: (dealType == "DENSITY" || isExcludePrdChange || !(obj.PTR_SYS_INVLD_PRD != null && obj.PTR_SYS_INVLD_PRD != ""))
                    }
                    translationInput.push(object);
                }
            })
        }

       
        return translationInput;
    }

    static massagingObjectsForJSON(key, transformResult) {
        for (let validKey in transformResult.ValidProducts[key]) {
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
        for (let prd in validProducts) {
            if (validProducts.hasOwnProperty(prd)) {
                let contractProducts = "";
                let excludeProducts = "";

                // Include products
                let Includeproducts = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === false;
                });
                if (Includeproducts.length !== 0) {
                    let contDerivedUserInput = uniq(Includeproducts, 'HIER_VAL_NM');
                    each(contDerivedUserInput ,(inputcontract)=>{
                        if (Includeproducts.length === 1 && inputcontract.DERIVED_USR_INPUT.trim().toLowerCase() == inputcontract.HIER_NM_HASH.trim().toLowerCase()) {
                            contractProducts = inputcontract.HIER_VAL_NM;
                        } else {
                            contractProducts = contDerivedUserInput.length == 1 ? PTE_Common_Util.getFullNameOfProduct(inputcontract, inputcontract.DERIVED_USR_INPUT) : inputcontract.DERIVED_USR_INPUT;
                        }
                        if (contractProducts !== "") {
                            input.contractProducts = input.contractProducts === "" ? contractProducts : input.contractProducts + "," + contractProducts;
                        }
                    })
                }

                // Exclude Products
                let products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === true;
                });
                if (products.length !== 0) {
                    const exclDerivedUserInput = uniq(products, 'HIER_VAL_NM');
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
        let products = { 'contractProducts': '', 'excludeProducts': '' };

        for (let prd in validProducts) {
            if (!!autoValidatedProducts && autoValidatedProducts.hasOwnProperty(prd)) {
                let autoTranslated = {};
                autoTranslated[prd] = autoValidatedProducts[prd];

                const updatedUserInput = PTEUtil.updateUserInput(autoTranslated);

                // Include products
                const autoValidContProd = updatedUserInput["contractProducts"];
                if (autoValidContProd !== "") {
                    products.contractProducts = products.contractProducts === "" ? autoValidContProd : products.contractProducts + "," + autoValidContProd;
                }

                // Exclude Products
                const autoValidExcludeProd = updatedUserInput["excludeProducts"];
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

        let userInput = products.filter(function (x) {
            return x.EXCLUDE === (typeOfProduct === "E");
        });
        userInput = uniq(userInput, fieldNm);

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

    static isEqual(data1, data2) {
        data1 = data1.split(',').map((item) => item.trim());
        data2 = data2.split(',').map((item) => item.trim());

        let equal = data1.every(item => data2.includes(item)) && data2.every(item => data1.includes(item));
        return equal;
    }
    static findInArrayWhere = function (myArray, field, val) {
        for (let i = 0; i < myArray.length; i++) {
            if (myArray[i][field] === val) {
                return myArray[i];
            }
        }
        return null;
    }

    static populateValidProducts = function (sysProducts) {
        let kitReOrderObject = {
            ReOrderedJSON: {}, PRD_DRAWING_ORD: '', contractProducts: ''};

        let addedProducts = [];
        for (let key in sysProducts) {
            if (sysProducts.hasOwnProperty(key)) {
                each(sysProducts[key], (item) =>{
                    addedProducts.push(item);
                });
            }
        }
        // Orders KIT products
        addedProducts = sortBy(addedProducts,'DEAL_PRD_TYPE');//$filter('kitProducts')(addedProducts, 'DEAL_PRD_TYPE');
        let pricingTableSysProducts = {};
        // Construct the new reordered JSON for KIT, if user input is Ci3, derived user input will be selected products
        each(addedProducts, (item) => {
            if (!pricingTableSysProducts.hasOwnProperty(item.DERIVED_USR_INPUT)) {
                pricingTableSysProducts[item.DERIVED_USR_INPUT] = [item];
            } else {
                pricingTableSysProducts[item.DERIVED_USR_INPUT].push(item);
            }
        });

        kitReOrderObject['ReOrderedJSON'] = pricingTableSysProducts;
        kitReOrderObject['PRD_DRAWING_ORD'] = addedProducts.map(function (p) {
            return p.PRD_MBR_SID;
        }).join(',');

        kitReOrderObject['contractProducts'] = addedProducts.map(function (p) {
            return p.DERIVED_USR_INPUT;
        }).join(',');

        return kitReOrderObject;
    }

    static updateProductOrdering(data, transformResults, curPricingTable) {
        let isAllValidated = true;
        let r: number;
        let isProductChanged = false;
        if (transformResults && transformResults.Data) {
            transformResults = transformResults.Data;
        }
        if (transformResults && transformResults.ProdctTransformResults) {
            for (let key in transformResults.ProdctTransformResults) {
                r = data.findIndex(x => x.DC_ID == key);
                if (r >= 0) {
                    // Flag dependency column errors - these columns may cause product translator to not find a valid product
                    if (!!transformResults.InvalidDependancyColumns && !!transformResults.InvalidDependancyColumns[key] && transformResults.InvalidDependancyColumns[key].length > 0) {
                        for (let i = 0; i < transformResults.InvalidDependancyColumns[key].length; i++) {
                            data[r]._behaviors.isError[transformResults.InvalidDependancyColumns[key][i]] = true;
                            data[r]._behaviors.validMsg[transformResults.InvalidDependancyColumns[key][i]] = "Value is invalid and may cause the product to validate incorrectly."
                        }
                    }

                    //Trimming unwanted Property to make JSON light
                    if (!!transformResults.ValidProducts[key]) {
                        transformResults = this.massagingObjectsForJSON(key, transformResults);
                    }

                    // If no duplicate or invalid add valid JSON
                    data[r].PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
                    PTE_CellChange_Util.updatePrdColumns(r, 'PTR_SYS_PRD', data[r].PTR_SYS_PRD);
                    if ((!!transformResults.InValidProducts[key] && (transformResults.InValidProducts[key]["I"].length > 0
                        || transformResults.InValidProducts[key]["E"].length > 0)) || (transformResults.DuplicateProducts !== undefined
                        && !!transformResults.DuplicateProducts[key])) {
                        isAllValidated = false;
                        break;
                    }

                    if (isAllValidated) {
                        let userInput: any;
                        if (curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                            //to update PTR_USER_PRD column with corrected data in the proper order --which used to check product order changed or not
                            for (let prd in transformResults.ValidProducts[key]) {
                                if (transformResults.ValidProducts[key].hasOwnProperty(prd)) {
                                    let products = transformResults.ValidProducts[key][prd].filter(function (x) {
                                        return x.EXCLUDE === false;
                                    });
                                    if (products.length !== 0) {
                                        let contDerivedUserInput = uniq(products, 'HIER_VAL_NM');
                                        if (products.length === 1 && contDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() == contDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                                            contractProducts = contDerivedUserInput[0].HIER_VAL_NM;
                                        }
                                        else {
                                            contractProducts = contDerivedUserInput.length == 1 ? PTE_Common_Util.getFullNameOfProduct(contDerivedUserInput[0], contDerivedUserInput[0].DERIVED_USR_INPUT) : contDerivedUserInput[0].DERIVED_USR_INPUT;
                                        }
                                        let ptrUsrPrd = data[r].PTR_USER_PRD.split(',');
                                        ptrUsrPrd[findIndex(ptrUsrPrd, prd)] = contractProducts;
                                        data[r].PTR_USER_PRD = ptrUsrPrd.join(',');
                                    }
                                }
                            }
                            var kitObject = this.populateValidProducts(transformResults.ValidProducts[key]);
                            transformResults.ValidProducts[key] = kitObject['ReOrderedJSON'];
                            let input = { 'contractProducts': '', 'excludeProducts': '' };
                            if (transformResults.ValidProducts[key]) {
                                input.contractProducts = kitObject['contractProducts'];
                            }
                            userInput = input;
                        } else {
                            userInput = this.updateUserInput(transformResults.ValidProducts[key]);
                        }

                        var contractProducts = userInput.contractProducts.toString().replace(/(\r\n|\n|\r)/gm, ""); // TODO: probably move all these replace functions should into the custom paste instead
                        var originalProducts = data[r].PTR_USER_PRD.toString().replace(/(\r\n|\n|\r)/gm, ""); // NOTE: This replace function takes out hidden new line characters, which break js dictionaries

                        if (curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                            var orignalUnswappedDataDict = {}; // Dictionary<product, original dataItem>
                            var originalProductsArr = originalProducts.split(',');
                            var isProductOrderChanged = (contractProducts !== originalProducts);

                            if (isProductOrderChanged) {
                                // Create a dictionary of products with their original tiered data
                                for (let i = 0; i < originalProductsArr.length; i++) {
                                    let originalIndex = r + i;
                                    if(data[originalIndex]!=undefined)
                                    orignalUnswappedDataDict[PTE_Helper_Util.formatStringForDictKey(originalProductsArr[i])] = PTE_Common_Util.deepClone(data[originalIndex]);
                                }
                            }
                        }

                        data[r].PTR_USER_PRD = contractProducts;   // Change the PTR_USER_PRD to the re-ordered product list
                        PTE_CellChange_Util.updatePrdColumns(r, 'PTR_USER_PRD', data[r].PTR_USER_PRD);
                        data[r].PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
                        PTE_CellChange_Util.updatePrdColumns(r, 'PTR_SYS_PRD', data[r].PTR_SYS_PRD);
                        // KIT update PRD_DRWAING_ORDER and merged rows
                        if (curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                            data[r].PRD_DRAWING_ORD = kitObject.PRD_DRAWING_ORD;
                            let tierNbr = PTE_Load_Util.numOfPivot(data[r], curPricingTable);
                            let mergedRows = r + tierNbr;
                            let modifiedNumTiers = data[r].PTR_USER_PRD.split(',').length;
                            modifiedNumTiers = modifiedNumTiers < tierNbr ? tierNbr : modifiedNumTiers;
                            for (let a = mergedRows - 1; a >= r; a--) { // look at each tier by it's index, going backwards
                                if (isProductOrderChanged) {
                                    isProductChanged = true;
                                    // We had swapped around the product order, so we need to map corresponding dimmed/tiered attributes to their new product order too
                                    const newContractProdArr = contractProducts.split(',');
                                    const currProduct = newContractProdArr[(a - r)]; // NOTE: this asssumes we swapped the PTR_USER_PRD to the re-ordered product list already
                                    for (var d = 0; d < PTE_Config_Util.kitDimAtrbs.length; d++) {
                                        if (PTE_Config_Util.kitDimAtrbs[d] == "TIER_NBR") { continue; }
                                        if (data[a] != undefined) {
                                            // Check for undefined..Extra product might have been from user input translated e.g., 7230(F) ==> 7230F,7230
                                            if (orignalUnswappedDataDict[PTE_Helper_Util.formatStringForDictKey(currProduct)] !== undefined) {
                                                data[a][PTE_Config_Util.kitDimAtrbs[d]] = orignalUnswappedDataDict[PTE_Helper_Util.formatStringForDictKey(currProduct)][PTE_Config_Util.kitDimAtrbs[d]];
                                                PTE_CellChange_Util.updatePrdColumns(a, PTE_Config_Util.kitDimAtrbs[d], data[a][PTE_Config_Util.kitDimAtrbs[d]]);
                                            }
                                        }
                                    }
                                }
                                if(data[a]!=undefined)
                                {
                                data[a].PTR_USER_PRD = data[r].PTR_USER_PRD;
                                data[a].PRD_DRAWING_ORD = data[r].PRD_DRAWING_ORD;
                                data[a].PTR_SYS_PRD = data[r].PTR_SYS_PRD;
                                data[a]['dirty'] = true;
                                modifiedNumTiers--;
                                }
                            }
                        }
                    }
                }
            }
        }
        return isProductChanged;
    }
}
