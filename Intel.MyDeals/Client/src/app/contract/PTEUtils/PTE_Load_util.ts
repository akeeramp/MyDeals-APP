import { DE_Load_Util } from '../DEUtils/DE_Load_util';
export class PTE_Load_Util {
    static getRulesForDE(objSetTypeCd) {
        return DE_Load_Util.getRules(objSetTypeCd);
    }
    static wipTemplateColumnSettings(template, isTenderContract, objSetTypeCd) {
        DE_Load_Util.removeWipColumns(template, isTenderContract);
        DE_Load_Util.assignColSettings(template, objSetTypeCd);
    }
    static getHideIfAllrules(groups) {
        return DE_Load_Util.getHideIfAllrules(groups);
    }
    static kitCalculatedValues(data, kitType, column) {
        return DE_Load_Util.kitCalculatedValues(data, kitType, column);
    }
    static calcBackEndRebate(data, dealType, column, dim) {
        return DE_Load_Util.calcBackEndRebate(data, dealType, column, dim);
    }
    static getColorPct(result) {
        return DE_Load_Util.getColorPct(result);
    }
}