import { DE_Common_Util } from "../DEUtils/DE_Common_util";
import { PTE_Config_Util } from "../PTEUtils/PTE_Config_util";
export class DE_Save_Util {
    static savedWithWarning(dataItem, groups, templates) {
        DE_Common_Util.clearBadegCnt(groups);
        if (dataItem != null) {
            var keys = Object.keys(dataItem._behaviors.isError);
            var tempKey = "TIER_NBR";
            for (var key in keys) {
                if (PTE_Config_Util.tierAtrbs.includes(keys[key]) && dataItem.NUM_OF_TIERS != undefined && (dataItem._behaviors.isError[tempKey] == undefined || !dataItem._behaviors.isError[tempKey])) {
                    dataItem._behaviors.isError[tempKey] = true;
                    DE_Common_Util.increaseBadgeCnt(tempKey, groups, templates);
                }
                DE_Common_Util.increaseBadgeCnt(keys[key], groups, templates);
            }
        }
    }

    static setDataItem(dataItem: any, field: any, value: any, key?: any) {
        if ((dataItem._behaviors != undefined && dataItem._behaviors.isReadOnly != undefined
            && (dataItem._behaviors.isReadOnly[field] === undefined || !dataItem._behaviors.isReadOnly[field]))
            || field == "IS_PRIMED_CUST" || field == "PRIMED_CUST_CNTRY" || field == "PRIMED_CUST_NM" || field == "PRIMED_CUST_ID"
            || field == "IS_RPL" || field == "END_CUST_OBJ") {
            if (dataItem._behaviors.isHidden === undefined) dataItem._behaviors.isHidden = {};
            if (dataItem._behaviors.isHidden[field] === undefined || dataItem._behaviors.isHidden[field] === false) {
                if (key != undefined && key != null && key != "") {
                    if (dataItem[field][key] != undefined && dataItem[field][key] != null)
                        dataItem[field][key] = value;
                }
                else
                    dataItem[field] = value;
                if (dataItem._behaviors.isDirty == undefined)
                    dataItem._behaviors.isDirty = {};
                dataItem._behaviors.isDirty[field] = true;
                dataItem["_dirty"] = true;
            }
        }
    }    
}