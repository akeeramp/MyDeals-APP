import { DE_Save_Util } from '../DEUtils/DE_Save_util';
export class PTE_Save_Util {
    static saveDeal(data, curPricingTable, curPricingStrategy, groups, templates) {
        DE_Save_Util.saveDealData(data, curPricingTable, curPricingStrategy, groups, templates);
    }
}