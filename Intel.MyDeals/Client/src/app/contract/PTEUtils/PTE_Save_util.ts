import * as _ from 'underscore';
import * as moment from 'moment';
import { PTE_Common_Util } from './PTE_Common_util';
import { PTE_Validation_Util } from './PTE_Validation_util';

export class PTE_Save_Util {    
    static validatePTE(PTR: Array<any>, curPricingStrategy: any, curPricingTable: any, contractData: any, VendorDropDownResult: any):any{
        //this will make sure the neccessary proprty except _behaviours for Save are added
        this.setPTRBasicPropertyForSave(PTR,curPricingStrategy,curPricingTable,contractData);
        if(curPricingTable.OBJ_SET_TYPE_CD=='ECAP'){
            return this.validatePTEECAP(PTR);
        }
        else{
            return this.validatePTEDeal(PTR, curPricingStrategy, VendorDropDownResult, curPricingTable, contractData);
        }
    }
    static setPTRBasicPropertyForSave(PTR:Array<any>,curPricingStrategy:any,curPricingTable:any,contractData:any){
     _.each(PTR, item=>{
        item["_dirty"]=true;
        item["PS_WF_STG_CD"]=curPricingStrategy.WF_STG_CD;
        item["DC_PARENT_ID"]=curPricingTable.DC_ID;
        item["dc_type"]='PRC_TBL_ROW';
        item["dc_parent_type"]='PRC_TBL';
        item["OBJ_SET_TYPE_CD"]=curPricingTable.OBJ_SET_TYPE_CD;
        item["BACK_DATE_RSN_TXT"]=contractData.BACK_DATE_RSN;
        item["CONTRACT_TYPE"]=contractData.CONTRACT_TYPE;
        item["IS_HYBRID_PRC_STRAT"]=curPricingStrategy.IS_HYBRID_PRC_STRAT;
     });
    }
    static validatePTEDeal(PTR: Array<any>, curPricingStrategy: any, VendorDropDownResult: any, curPricingTable: any, contractData: any):any{
        _.each(PTR,(item) =>{
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
        });
        PTR = PTE_Validation_Util.validateSettlementPartner(PTR, curPricingStrategy, VendorDropDownResult);
        PTR = PTE_Validation_Util.validateOverArching(PTR, curPricingStrategy, curPricingTable);
        PTR = PTE_Validation_Util.validateMarketSegment(PTR, undefined, undefined);
        PTR = PTE_Validation_Util.validateHybridFields(PTR, curPricingStrategy, curPricingTable);
        // Check if the rows have duplicate products
        var isHybridPS = curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";
        var duplicateProductRows = isHybridPS ? PTE_Validation_Util.hasDuplicateProduct(PTR) : {};
        var hasTender, hasNonTender = false;
        var errDeals = [];
        var dictRebateType = [];
        var dictPayoutBasedon = [];
        var dictCustDivision = [];
        var dictGeoCombined = [];
        var dictPeriodProfile = [];
        var dictResetPerPeriod = [];
        var dictProgramPayment = [];
        var dictOverarchingDollar = [];
        var dictOverarchingVolume = [];
        let isTenderContract = contractData["IS_TENDER"] == "1" ? true : false
        for (var s = 0; s < PTR.length; s++) {
            if ((curPricingTable.OBJ_SET_TYPE_CD !== "KIT" && curPricingTable.OBJ_SET_TYPE_CD !== "VOL_TIER"
                && curPricingTable.OBJ_SET_TYPE_CD !== "FLEX") || PTR[s].TIER_NBR == "1") {
                errDeals.push(s);
                if (PTR[s]["REBATE_TYPE"] === "TENDER") {
                    hasTender = true;
                } else {
                    hasNonTender = true;
                }
                if (isHybridPS) {
                    dictRebateType[PTR[s]["REBATE_TYPE"]] = s;
                    dictPayoutBasedon[PTR[s]["PAYOUT_BASED_ON"]] = s;
                    var isCustDivValid = PTE_Validation_Util.validateCustomerDivision(dictCustDivision, PTR[0]["CUST_ACCNT_DIV"], PTR[s]["CUST_ACCNT_DIV"]);
                    if (isCustDivValid) {
                        dictCustDivision[PTR[0]["CUST_ACCNT_DIV"]] = s;
                    }
                    else {
                        dictCustDivision[PTR[s]["CUST_ACCNT_DIV"]] = s;
                    }
                    dictGeoCombined[PTR[s]["GEO_COMBINED"]] = s;
                    if (curPricingTable.OBJ_SET_TYPE_CD !== "PROGRAM") {
                        dictPeriodProfile[PTR[s]["PERIOD_PROFILE"]] = s;
                    }
                    dictResetPerPeriod[PTR[s]["RESET_VOLS_ON_PERIOD"]] = s;
                    dictProgramPayment[PTR[s]["PROGRAM_PAYMENT"]] = s;

                    // The next two values if left blank can come in as either null or "", make them one pattern.
                    if (PTR[s]["REBATE_OA_MAX_AMT"] == null) dictOverarchingDollar[""] = s;
                    else dictOverarchingDollar[PTR[s]["REBATE_OA_MAX_AMT"]] = s;

                    if (PTR[s]["REBATE_OA_MAX_VOL"] == null) dictOverarchingVolume[""] = s;
                    else dictOverarchingVolume[PTR[s]["REBATE_OA_MAX_VOL"]] = s;
                }
            }
        }

        if (errDeals.length > 0) {
            for (var t = 0; t < errDeals.length; t++) {
                var el = PTR[errDeals[t]];
                if (!el._behaviors) el._behaviors = {};
                if (!el._behaviors.isError) el._behaviors.isError = {};
                if (!el._behaviors.validMsg) el._behaviors.validMsg = {};
                if (hasTender && hasNonTender) {
                    el._behaviors.isError["REBATE_TYPE"] = true;
                    el._behaviors.validMsg["REBATE_TYPE"] = "Cannot mix Tender and Non-Tender deals in the same table.";
                }
                if (isHybridPS && Object.keys(dictProgramPayment).length == 1 && !(dictProgramPayment.includes('Backend'))) {
                    el._behaviors.isError["PROGRAM_PAYMENT"] = true;
                    el._behaviors.validMsg["PROGRAM_PAYMENT"] = "Hybrid Pricing Strategy Deals must be Backend only.";
                }
                if (isHybridPS && duplicateProductRows.duplicateProductDCIds[el.DC_ID] !== undefined) {
                    el._behaviors.isError["PTR_USER_PRD"] = true;
                    el._behaviors.validMsg["PTR_USER_PRD"] = "Cannot have duplicate product(s). Product(s): " +
                        duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapProduct + " are duplicated within rows " + duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapDCID + ". Please check the date range overlap.";

                }
            }
        }
        _.each(PTR, (item) => {
            //defaulting the behaviours object
            PTE_Common_Util.setBehaviors(item);
            if (moment(item["START_DT"]).isAfter(contractData.END_DT) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(contractData.END_DT).format("MM/DD/YYYY") + ")";
            }
            if (moment(item["END_DT"]).isBefore(contractData.START_DT) && !isTenderContract) {
                item._behaviors.isError['END_DT'] = true;
                item._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(contractData.START_DT).format("MM/DD/YYYY") + ")";
            }
            if (moment(item["START_DT"]).isAfter(moment(item["END_DT"])) && !isTenderContract) {
                item._behaviors.isError['START_DT'] = true;
                item._behaviors.validMsg['START_DT'] = "Deal Start date cannot be greater than the Deal End Date";
            }
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
    static settlementPartnerValUpdate(PTR:Array<any>){
     _.each(PTR,item=>{
        if(item.SETTLEMENT_PARTNER && item.SETTLEMENT_PARTNER !=''){
            item.SETTLEMENT_PARTNER=item.SETTLEMENT_PARTNER.split('-')[1].trim();
        }
     });
     return PTR;
    }
    //check for all attribue present
    static sanitizePTR(PTR:Array<any>,contractData:any):Array<any>{
        _.each(PTR,(item) =>{
            if(item && (item.CUST_MBR_SID ==null || item.CUST_MBR_SID=='' || item.CUST_MBR_SID==undefined)){
                item.CUST_MBR_SID=contractData.CUST_MBR_SID;
            }
        });
        return PTR;
    }
    static generatePTRAfterSave(result:any):Array<any>{
        let PTR=[];
        const PTRResult=result.Data.PRC_TBL_ROW;
        if(PTRResult && PTRResult.length>0 && PTRResult[0]._actions){
            let actions=PTRResult[0]._actions;
            PTRResult.splice(0,1);
            _.each(PTRResult,(item)=>{
                _.each(actions,act=>{
                    if(item.DC_ID==act.DcID){
                        item.DC_ID=act.AltID
                    }
                });
            });
            return PTRResult;
        }
        else{
            return PTR;
        }
        
    }
}