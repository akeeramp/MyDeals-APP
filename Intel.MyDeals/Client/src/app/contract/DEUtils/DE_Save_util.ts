import { PTE_Common_Util } from "../PTEUtils/PTE_Common_util";
import { PTEUtil } from "../PTEUtils/PTE.util";
import { DE_Common_Util } from "../DEUtils/DE_Common_util";
import { PTE_Validation_Util } from "../PTEUtils/PTE_Validation_util";
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

    static saveDealData(data, contractData, curPricingTable, curPricingStrategy, isTenderContract, groups, templates) {
        PTE_Validation_Util.validateDeal(data, contractData, curPricingTable, curPricingStrategy, isTenderContract);
        PTE_Common_Util.setWarningFields(data, curPricingTable);
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                PTE_Common_Util.setBehaviors(data[i], '');
                this.savedWithWarning(data[i], groups, templates);
            }
        }
    }
}