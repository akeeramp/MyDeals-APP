import { DE_Common_Util } from '../DEUtils/DE_Common_util';
import Handsontable from 'handsontable';
import * as _ from 'underscore';

import { PTE_Config_Util } from '../PTEUtils/PTE_Config_util';
export class PTE_Common_Util {
    private static hotTable:Handsontable
    constructor(hotTable:Handsontable){
        PTE_Common_Util.hotTable=hotTable;
    }
    static getFullNameOfProduct (item, prodName) {
        if (item.PRD_ATRB_SID > 7005) return prodName;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }
    static mapTieredWarnings (dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
        if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
            if (dataItem._behaviors.validMsg[atrbName] != null) {
                try {
                    var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

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
        var anyWarnings = false;
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;
            if (anyWarnings) {
                var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                var isKit = 0;
                var relevantAtrbs = curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY" ? PTE_Config_Util.densityTierAtrbs : PTE_Config_Util.tierAtrbs;
                var tierCount = dataItem.NUM_OF_TIERS;
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
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);    //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
                        delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                    }
                }
                else {
                    var densityCount = dataItem.NUM_OF_DENSITY;
                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                        if (db > densityCount) {
                            db = 1;
                            curTier++;
                        }
                        for (var a = 0; a < relevantAtrbs.length; a++) {
                            dimStr = (relevantAtrbs[a] == "DENSITY_RATE") ? "_8___" : "_10___";
                            if (relevantAtrbs[a] == "DENSITY_RATE") {
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + db + "____10___" + curTier), curTier);
                                db++;
                            }
                            else
                                this.mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t); //TODO: what happens in negative dim cases? this doesnt cover does it?
                        }
                    }
                    for (var a = 0; a < relevantAtrbs.length; a++) {
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
    static checkSoftWarnings(data, objSetTypeCd) {
        return DE_Common_Util.checkSoftWarnings(data, objSetTypeCd);
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
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static getPTEGenerate(columns:Array<any>,curPricingTable:any,rownumber?:number): Array<any> {
        let PTRResult: Array<any> = [];
        if(rownumber){
            let obj={}
            _.each(columns,(val) => {
                if (val.data) {
                    obj[val.data.toString()] = this.hotTable.getDataAtRowProp(rownumber, val.data.toString()) != null ? this.hotTable.getDataAtRowProp(rownumber, val.data.toString()) : null;
                }
            });
            PTRResult.push(obj);
        }
        else{
            let PTRCount = this.hotTable.countRows();
            for (let i = 0; i < PTRCount; i++) {
                let obj = {};
                if (!this.hotTable.isEmptyRow(i)) {
                    //the PTR must generate based on the columns we have there are certain hidden columns which can also has some values
                     _.each(columns,(val) => {
                        if (val.data) {
                            obj[val.data.toString()] = this.hotTable.getDataAtRowProp(i, val.data.toString()) != null ? this.hotTable.getDataAtRowProp(i, val.data.toString()) : null;
                        }
                    });
                    PTRResult.push(obj);
                }
                else{
                  //this means after empty row nothing to be added
                    break;
                }
            }
            //incase of tier places the NUM_OF_TIERS
            if(curPricingTable.OBJ_SET_TYPE_CD=='VOL_TIER' || curPricingTable.OBJ_SET_TYPE_CD=='FLEX' || curPricingTable.OBJ_SET_TYPE_CD=='REV_TIER'){
                const uniqDCID=_.uniq(PTRResult,'DC_ID');
                _.each(uniqDCID,itmsDC=>{
                    let DCPTR=_.where(PTRResult,{DC_ID:itmsDC.DC_ID});
                    let selTier=_.max(DCPTR,(itm:any)=>{return itm.TIER_NBR;});
                    _.each(PTRResult,(item)=>{
                        if(item.DC_ID==itmsDC.DC_ID){
                            item.NUM_OF_TIERS=selTier.TIER_NBR;
                        }
                    });
                });
            }
        }
        return PTRResult;
    }

    static parseCellValues(field, dataItem) {
        DE_Common_Util.parseCellValues(field, dataItem);
    }

    static cellCloseValues(field, dataItem) {
        DE_Common_Util.cellCloseValues(field, dataItem);
    }
}