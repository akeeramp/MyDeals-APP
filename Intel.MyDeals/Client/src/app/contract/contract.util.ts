
export class ContractUtil {
   static findInArray (input, id) {
       const len = input.length;
        for (let i = 0; i < len; i++) {
            if (+input[i].DC_ID === +id) {
                return input[i];
            }
        }
        return null;
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
}