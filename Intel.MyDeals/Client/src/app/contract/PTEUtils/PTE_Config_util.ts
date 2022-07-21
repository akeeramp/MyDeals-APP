
export class PTE_Config_Util {

   static  productValidationDependencies = [
        "GEO_COMBINED", "PROGRAM_PAYMENT", "PROD_INCLDS", "REBATE_TYPE", "MRKT_SEG"
    ];
    static kitDimAtrbs: Array<string> = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];
    static tenderOnlyColumns = ["CAP", "YCS2", "SERVER_DEAL_TYPE", "QLTR_BID_GEO"];
    static tenderRequiredColumns = ["VOLUME"];
    static vistextHybridOnlyColumns = ["REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT"];
    static hybridSaveBlockingColumns = ['REBATE_TYPE', 'PAYOUT_BASED_ON', 'CUST_ACCNT_DIV', 'GEO_COMBINED', 'PERIOD_PROFILE', 'RESET_VOLS_ON_PERIOD', 'PROGRAM_PAYMENT', 'SETTLEMENT_PARTNER', 'AR_SETTLEMENT_LVL'];

}