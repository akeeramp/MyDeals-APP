
export class PTE_Config_Util {

    static productValidationDependencies = [
        "GEO_COMBINED", "PROGRAM_PAYMENT", "PROD_INCLDS", "REBATE_TYPE", "MRKT_SEG"
    ];
    static kitDimAtrbs: Array<string> = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];
    static tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
    static densityTierAtrbs = ["DENSITY_RATE", "STRT_PB", "END_PB", "DENSITY_BAND", "TIER_NBR"];
    static tenderOnlyColumns = ["CAP", "YCS2", "SERVER_DEAL_TYPE", "QLTR_BID_GEO"];
    static tenderRequiredColumns = ["VOLUME"];
    static vistextHybridOnlyColumns = ["REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT"];
    static hybridSaveBlockingColumns = ['REBATE_TYPE', 'PAYOUT_BASED_ON', 'CUST_ACCNT_DIV', 'GEO_COMBINED', 'PERIOD_PROFILE', 'RESET_VOLS_ON_PERIOD', 'PROGRAM_PAYMENT', 'SETTLEMENT_PARTNER', 'AR_SETTLEMENT_LVL'];
    static volTierFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Vol", "field": "STRT_VOL", "format": "number", "align": "right" },
        { "title": "End Vol", "field": "END_VOL", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
    ];
    static revTierFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Rev", "field": "STRT_REV", "format": "currency", "align": "right" },
        { "title": "End Rev", "field": "END_REV", "format": "currency", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Incentive Rate (%)", "field": "INCENTIVE_RATE", "format": "number", "align": "right" }
    ];
    static densityFields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Band", "field": "DENSITY_BAND", "format": "", "align": "right" },
        { "title": "Start PB", "field": "STRT_PB", "format": "number", "align": "right" },
        { "title": "End PB", "field": "END_PB", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "DENSITY_RATE", "format": "currency", "align": "right" }
    ];
    static maxKITproducts: number = 10;
    static tenderDropDownAtrbs = ["DEAL_COMB_TYPE", "CONTRACT_TYPE", "PERIOD_PROFILE", "RESET_VOLS_ON_PERIOD", "BACK_DATE_RSN", "CONSUMPTION_REASON", "MRKT_SEG", "QLTR_BID_GEO", "SETTLEMENT_PARTNER","EXPIRE_FLG"];
    static contractDropDownAtrbs = ["DEAL_COMB_TYPE", "CONTRACT_TYPE", "PERIOD_PROFILE", "RESET_VOLS_ON_PERIOD", "BACK_DATE_RSN", "CONSUMPTION_REASON", "MRKT_SEG", "SEND_TO_VISTEX", "SERVER_DEAL_TYPE", "SETTLEMENT_PARTNER", "EXPIRE_FLG"];
    static dimPrdBktFields = ["TRKR_NBR", "ECAP_PRICE", "CAP", "CAP_STRT_DT", "CAP_END_DT", "YCS2_PRC_IRBT", "YCS2_START_DT", "YCS2_END_DT"];
}