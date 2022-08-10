import * as _ from 'underscore';
import { PTE_Common_Util } from './PTE_Common_util';

export class PTE_Save_Util {    
    static validatePTE(PTR:Array<any>,curPricingStrategy:any,curPricingTable:any,contractData:any):any{
        //this will make sure the neccessary proprty except _behaviours for Save are added
        this.setPTRBasicPropertyForSave(PTR,curPricingStrategy,curPricingTable,contractData);
        if(curPricingTable.OBJ_SET_TYPE_CD=='ECAP'){
            return this.validatePTEECAP(PTR);
        }
        else{
            return this.validatePTEDeal(PTR);
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