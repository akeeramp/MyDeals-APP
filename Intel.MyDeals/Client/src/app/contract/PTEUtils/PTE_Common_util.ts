import { DE_Common_Util } from '../DEUtils/DE_Common_util';
import Handsontable from 'handsontable';
import { each, uniq, filter, map, where, sortBy, findWhere, max } from 'underscore';
import { StaticMomentService } from "../../shared/moment/moment.service";
import { extendMoment } from "moment-range";
import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
import { PTE_Validation_Util } from './PTE_Validation_util';
import { PTE_Load_Util } from './PTE_Load_util';

export class PTE_Common_Util {
    private static hotTable: Handsontable
    constructor(hotTable: Handsontable) {
        PTE_Common_Util.hotTable = hotTable;
    }
    static getFullNameOfProduct(item, prodName) {
        if (item.PRD_ATRB_SID > 7005) return prodName;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }
    static fullNameProdCorrector(item) {
        // When a product belongs to two different family, get the full path
        if (item.PRD_ATRB_SID == 7006) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR)).trim();
        }
        if (item.PRD_ATRB_SID == 7007) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR) + " " + item.DEAL_PRD_NM).trim();
        }
        if (item.PRD_ATRB_SID == 7008) {
            return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM)
                + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM) + " " + (item.PCSR_NBR === 'NA' ? "" : item.PCSR_NBR) + " " + item.DEAL_PRD_NM
                + " " + item.MTRL_ID).trim();
        }
        if (item.PRD_ATRB_SID > 7005) return item.HIER_VAL_NM;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }
    static mapTieredWarnings(dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
        if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
            if (dataItem._behaviors.validMsg[atrbName] != null) {
                try {
                    let jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                    if (dataItem.OBJ_SET_TYPE_CD === "KIT") {
                        if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                            dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                            dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                        }
                    }

                    if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                        dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                        dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                    } else {
                        delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                        delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                    }
                } catch (e) {

                }
            }
        }
    }
    static setWarningFields(data, curPricingTable) {
        let anyWarnings = false;
        for (let i = 0; i < data.length; i++) {
            const dataItem = data[i];
            if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;
            if (anyWarnings) {
                let dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                let isKit = 0;
                let relevantAtrbs = curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY" ? PTE_Config_Util.densityTierAtrbs : PTE_Config_Util.tierAtrbs;
                let tierCount = dataItem.NUM_OF_TIERS;
                let curTier = 1, db = 1;
                if (curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                    if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                    dimStr = "_20___";
                    isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                    relevantAtrbs = PTE_Config_Util.kitDimAtrbs;
                    tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                }
                // map tiered warnings
                if (curPricingTable['OBJ_SET_TYPE_CD'] != "DENSITY") {
                    for (let t = 1 - isKit; t <= tierCount - isKit; t++) {
                        for (let a = 0; a < relevantAtrbs.length; a++) {
                            this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);    //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (let a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
                else {
                    const densityCount = dataItem.NUM_OF_DENSITY;
                    for (let t = 1 - isKit; t <= tierCount - isKit; t++) {
                        if (db > densityCount) {
                            db = 1;
                            curTier++;
                        }
                        for (let a = 0; a < relevantAtrbs.length; a++) {
                            dimStr = (relevantAtrbs[a] == "DENSITY_RATE") ? "_8___" : "_10___";
                            if (relevantAtrbs[a] == "DENSITY_RATE") {
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + db + "____10___" + curTier), curTier);
                                db++;
                            }
                            else
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t); //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (let a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
            }
        }
    }
    static clearBadegCnt(groups) {
        DE_Common_Util.clearBadegCnt(groups);
    }
    static increaseBadgeCnt(key, groups, templates) {
        DE_Common_Util.increaseBadgeCnt(key, groups, templates);
    }
    static checkSoftWarnings(data, curPricingTable) {
        return DE_Common_Util.checkSoftWarnings(data, curPricingTable);
    }
    static clearEndCustomer(item) {
        if (item._behaviors && item._behaviors.isError && item._behaviors.isRequired && item._behaviors.validMsg) {
            delete item._behaviors.isError["END_CUSTOMER_RETAIL"];
            delete item._behaviors.validMsg["END_CUSTOMER_RETAIL"];
        }
        return item;
    }
    static setEndCustomer(item, dealType, curPricingTable) {
        if (!item._behaviors) item._behaviors = {};
        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
        if (!item._behaviors.isError) item._behaviors.isError = {};
        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
        if ((item.END_CUSTOMER_RETAIL != '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
            || ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") && item.REBATE_TYPE.toLowerCase() != "tender")) {//To show required error message
            item = this.clearEndCustomer(item);
            item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
            item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer Retail and End Customer Country/Region must be same for " + dealType + ".";
        }
        else if ((item.END_CUSTOMER_RETAIL == '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
            && ((curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || curPricingTable['OBJ_SET_TYPE_CD'] === "PROGRAM") && item.REBATE_TYPE.toLowerCase() == "tender")) {
            item = this.clearEndCustomer(item);
            item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
            item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer/Retail is required.";
        }
        return item;
    }
    static findInArray(input, id) {
        const len = input.length;
        for (let i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
    }
    static setBehaviors(item: any, elem?: string) {
        if (!item._behaviors) item._behaviors = {};
        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
        if (!item._behaviors.isError) item._behaviors.isError = {};
        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
        if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
    }
    static setBehaviorsValidMessage(item: any, elem: string, elemLabel: string, cond: string) {
        if (elem === 'ECAP_PRICE' && cond == 'equal-zero') {
            item._behaviors.isRequired[elem] = true;
            item._behaviors.isError[elem] = true;
            item._behaviors.validMsg[elem] = `${elemLabel} must be positive number`;
        }
    }
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static getPTEGenerate(columns: Array<any>, curPricingTable: any, rownumber?: number): Array<any> {
        let PTRResult: Array<any> = [];
        if(rownumber){
            let obj = {};
            each(columns, (val) => {
                if (val.data) {
                    obj[val.data.toString()] = this.hotTable.getDataAtRowProp(rownumber, val.data.toString()) != null ? this.hotTable.getDataAtRowProp(rownumber, val.data.toString()) : '';
                 }
            });
            PTRResult.push(obj);
        }
        else {
            let PTRCount = this.hotTable.countRows();
            for (let i = 0; i < PTRCount; i++) {
                let obj = {};
                if (!this.hotTable.isEmptyRow(i)) {
                    //the PTR must generate based on the columns we have there are certain hidden columns which can also has some values
                    each(columns, (val) => {
                        if (val.data) {
                            obj[val.data.toString()] = this.hotTable.getDataAtRowProp(i, val.data.toString()) != null ? this.hotTable.getDataAtRowProp(i, val.data.toString()) : '';
                        }
                    });
                    PTRResult.push(obj);
                }
                else {
                    //this means after empty row nothing to be added
                    break;
                }
            }
            //incase of tier places the NUM_OF_TIERS
            if (curPricingTable.OBJ_SET_TYPE_CD == 'VOL_TIER' || curPricingTable.OBJ_SET_TYPE_CD == 'FLEX'
                || curPricingTable.OBJ_SET_TYPE_CD == 'REV_TIER' || curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                const uniqDCID = uniq(PTRResult, 'DC_ID');
                each(uniqDCID, itmsDC => {
                    const DCPTR = where(PTRResult, { DC_ID: itmsDC.DC_ID });
                    let selTier;
                    let pivotDensity;
                    if (curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                        let rowData = max(DCPTR, (itm: any) => { return parseInt(itm.TIER_NBR) });
                        if (rowData.NUM_OF_DENSITY == "" || rowData.NUM_OF_DENSITY == null) {
                            pivotDensity = parseInt(curPricingTable.NUM_OF_DENSITY);
                        }
                        else {
                            pivotDensity = parseInt(rowData.NUM_OF_DENSITY);
                        }
                        let maxTier = parseInt(rowData.TIER_NBR);
                        let numOfRows = maxTier * pivotDensity;
                        selTier = numOfRows;
                    }
                    else {
                        let selRow = max(DCPTR, (itm: any) => { return parseInt(itm.TIER_NBR) });
                        selTier = selRow.TIER_NBR;
                    }
                    each(PTRResult, (item) => {
                        if (item.DC_ID == itmsDC.DC_ID) {
                            item.NUM_OF_TIERS = selTier;
                            if (curPricingTable.OBJ_SET_TYPE_CD == 'DENSITY') {
                                item.NUM_OF_DENSITY = pivotDensity;
                            }
                        }
                    });
                });
            }
        }
        //This function call to add all the missing attributes required for save
        PTRResult = this.addPTEAttributes(PTRResult, curPricingTable);
        return PTRResult;
    }

    static parseCellValues(field, dataItem) {
        DE_Common_Util.parseCellValues(field, dataItem);
    }

    static cellCloseValues(field, dataItem) {
        DE_Common_Util.cellCloseValues(field, dataItem);
    }

    //This function is to add all missing common attributes with expected values for save 
    static addPTEAttributes(PTRResult, curPricingTable) {
        for (let j = 0; j < PTRResult.length; j++) {
            PTRResult[j]["IS_HYBRID_PRC_STRAT"] = curPricingTable["IS_HYBRID_PRC_STRAT"] != null ? curPricingTable["IS_HYBRID_PRC_STRAT"] : null;
        }
        return PTRResult;
    }

    static initContract(tempalates, contractData) {
        // New contract template
        const c = tempalates["ObjectTemplates"].CNTRCT.ALL_TYPES;
        // contract exists
        if (contractData !== null && contractData !== undefined) {
            return contractData;
        }
        return c;
    }

    static validateOVLPFlexProduct = function (data, wipdata, mode, curPricingTable, restrictGroupFlexOverlap, overlapFlexResult, OVLPFlexPdtPTRUSRPRDError) {
        if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
            //Clearing the behaviors for the first time if no error the result will be clean
            data = PTE_Validation_Util.clearValidation(data, "PTR_USER_PRD");

            //Parent is set for PTE not DE level
            let objectId = wipdata ? 'DC_PARENT_ID':'DC_ID';
            
            //For multi tiers last record will have latest date, skipping duplicate DC_ID
            const filterData = uniq(sortBy(data, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

            const accrualEntries = filterData.filter((val) => val.FLEX_ROW_TYPE == 'Accrual')
            const drainingEntries = filterData.filter((val) => val.FLEX_ROW_TYPE == 'Draining')
            const drainingRule = drainingEntries.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == "Consumption");
            const restrictGroupFlexOverlap= drainingEntries.every((val) => val.PAYOUT_BASED_ON != null && val.PAYOUT_BASED_ON != '' && val.PAYOUT_BASED_ON == "Consumption");

           // if (accrualEntries.length > 0 && drainingRule && drainingEntries.length > 0) { restrictGroupFlexOverlap = true; }
            if (overlapFlexResult && overlapFlexResult.length && overlapFlexResult.length > 0) {
                //Assigning  validation result to a variable and finally iterate between this result and bind the errors
                const finalResult = this.checkOVLPDate(filterData, overlapFlexResult, objectId);
                if (mode) {
                    return finalResult;
                }
                each(data, (item) => {
                    each(finalResult, (itm) => {
                        //To handle multi tier condition only assign to object which has PTR_SYS_PRD in PTE and PTR_USER_PRD in DE
                        if ((objectId == 'DC_ID' && item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) || (objectId == 'DC_PARENT_ID' && item.PTR_USER_PRD && (item.PTR_USER_PRD != null || item.PTR_USER_PRD != ''))) {
                            if (item[objectId] == itm.ROW_ID && itm.dup && itm.dup == 'duplicate'&& (!(restrictGroupFlexOverlap))) {
                                OVLPFlexPdtPTRUSRPRDError = true;
                                item = PTE_Load_Util.setBehaviors(item, "PTR_USER_PRD", "duplicate", curPricingTable);
                            }
                            else if (item[objectId] == itm.ROW_ID && itm.dup && itm.dup == 'dateissue') {
                                OVLPFlexPdtPTRUSRPRDError = true;
                                item = PTE_Load_Util.setBehaviors(item, "PTR_USER_PRD", "dateissue", curPricingTable);
                            }
                            else {
                                item = PTE_Load_Util.setBehaviors(item, "FLEX", "emptyobject", curPricingTable);
                            }
                        }
                    });
                });

            }
        }
        return data;
    }
    static checkOVLPDate = function (data, resp, objectId) {
        //var momentRange = require('moment-range');
        const rangemoment = extendMoment(StaticMomentService.moment);
        //get uniq duplicate product
        const uniqOvlpCombination = uniq(map(resp, (ob) => { return ob.OVLP_ROW_ID }));
        //iterate through unique product
        each(uniqOvlpCombination, (dup) => {
            //filtering the uniq prod from response and sort to get correct first and second object
            const rowID = filter(resp, (ob) => { return ob['OVLP_ROW_ID'] == dup });
            each(rowID, (dupPro) => {
                each(rowID, (dupPr) => {
                    //checking the product date overlaps or not
                    if (dupPro.ROW_ID != dupPr.ROW_ID) {
                        let firstObj = null, secObj = null;

                        if (objectId == 'DC_PARENT_ID') {
                            //findWhere will return the first object found 
                            firstObj = findWhere(data, { 'DC_PARENT_ID': dupPro.ROW_ID });
                            secObj = findWhere(data, { 'DC_PARENT_ID': dupPr.ROW_ID });
                        }
                        else {
                            firstObj = findWhere(data, { 'DC_ID': dupPro.ROW_ID });
                            secObj = findWhere(data, { 'DC_ID': dupPr.ROW_ID });
                        }

                        const firstRange = rangemoment.range(StaticMomentService.moment(firstObj.START_DT), StaticMomentService.moment(firstObj.END_DT));
                        const secRange = rangemoment.range(StaticMomentService.moment(secObj.START_DT), StaticMomentService.moment(secObj.END_DT));
                        //identifying the dates are valid for overlap
                        if (!StaticMomentService.moment(firstObj.START_DT).isBefore(firstObj.END_DT)) {
                            findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'dateissue';
                        }
                        else if (!StaticMomentService.moment(secObj.START_DT).isBefore(secObj.END_DT)) {
                            findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'dateissue';
                        }
                        else if ((StaticMomentService.moment(firstObj.END_DT).format('MM/DD/YYYY') == StaticMomentService.moment(secObj.START_DT).format('MM/DD/YYYY')) ||
                            (StaticMomentService.moment(firstObj.START_DT).format('MM/DD/YYYY') == StaticMomentService.moment(secObj.END_DT).format('MM/DD/YYYY'))) {
                            findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                            findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';
                        }
                        //if the dates overlap add key dup as true
                        else if (firstRange.overlaps(secRange)) {
                            findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                            findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';
                        }
                    }
                });
            });
        });

        return resp;
    }

    static getOverlapFlexProducts(curPricingTable, pricingTableRowData) {
        if (curPricingTable.OBJ_SET_TYPE_CD && curPricingTable.OBJ_SET_TYPE_CD == "FLEX") {
            let data = pricingTableRowData;
            const AcrObjs = data.filter(ob => ob.FLEX_ROW_TYPE && ob.FLEX_ROW_TYPE.toLowerCase() == 'accrual');
            const DrnObjs = data.filter(ob => ob.FLEX_ROW_TYPE && ob.FLEX_ROW_TYPE.toLowerCase() == 'draining');
            let AcrInc = [], AcrExc = [], DrnInc = [], DrnExc = [];
            each(AcrObjs, (item) => {
                //to handle multi tier condition
                if (item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) {
                    const objAcr = Object.values(JSON.parse(item.PTR_SYS_PRD));
                    each(objAcr, (itm) => {
                        let objItm = {};
                        if (itm[0].EXCLUDE) {
                            AcrExc.push(itm[0].PRD_MBR_SID);
                        }
                        else {
                            objItm['RowId'] = item.DC_ID;
                            objItm['PRDMemberSid'] = itm[0].PRD_MBR_SID;
                            AcrInc.push(objItm);
                        }
                    });
                }

            });
            each(DrnObjs, (item) => {
                if (item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) {
                    const objDrn = Object.values(JSON.parse(item.PTR_SYS_PRD));
                    each(objDrn, (itm) => {
                        let objItm = {};
                        if (itm[0].EXCLUDE) {
                            DrnExc.push(itm[0].PRD_MBR_SID);
                        }
                        else {
                            objItm['RowId'] = item.DC_ID;
                            objItm['PRDMemberSid'] = itm[0].PRD_MBR_SID;
                            DrnInc.push(objItm);
                        }
                    });
                }

            });
            const uniqAcrInc = AcrInc.filter(function (a) {
                const key = a.RowId + '|' + a.PRDMemberSid;
                if (!this[key]) {
                    this[key] = true;
                    return true;
                }
            }, Object.create(null));

            const reqBody = {
                AcrInc: uniqAcrInc,
                AcrExc: AcrExc,
                DrnInc: DrnInc,
                DrnExc: DrnExc
            };
            return reqBody;
        }
        return;
    }

    static dealEditorTabValidationIssue(data : any, isWip: boolean) {
        if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.WIP_DEAL === undefined) return false;
        if (data.PRC_TBL_ROW.length > 0 && data.WIP_DEAL.length === 0) return true;

        let aryWipIds = [];
        each(data.WIP_DEAL, function (item) {
            if (aryWipIds.indexOf(item.DC_PARENT_ID) < 1) aryWipIds.push(item.DC_PARENT_ID);
        });

        let aryPtrIds = [];
        each(data.PRC_TBL_ROW, function (item) {
            if (aryPtrIds.indexOf(item.DC_ID) < 1) aryPtrIds.push(item.DC_ID);
        });

        const unpairedPtrs = this.arrBiDirectionalDifference(aryPtrIds, aryWipIds);

        let myRet = false;
        each(data.WIP_DEAL, function (item) {
            if (item.warningMessages.length > 0 && !isWip) myRet = true;
        });

        if (unpairedPtrs.length > 0) myRet = true; // If any bi-directional changes are noted, trigger
        return myRet;
    }

    static arrBiDirectionalDifference(arr1: any, arr2: any) {
        let difference1 = arr1.filter(x => arr2.indexOf(x) === -1);
        let difference2 = arr2.filter(x => arr1.indexOf(x) === -1);
        let difference = difference1.concat(difference2).sort((x, y) => x - y);
        return difference;
    }
}