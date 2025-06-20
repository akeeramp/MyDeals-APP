export class PTE_Config_Util {
    static girdMaxRows: number = 250;
    static gridMinRows: number = 199;
    static maxKITproducts: number = 10;
    static maxNoofproducts: number = 50;
    static flushSysPrdFields = ["PTR_USER_PRD", "PRD_EXCLDS", "START_DT", "END_DT", "GEO_COMBINED", "PROD_INCLDS", "PROGRAM_PAYMENT", "REBATE_TYPE", "MRKT_SEG"];
    static productValidationDependencies = ["GEO_COMBINED", "PROGRAM_PAYMENT", "PROD_INCLDS", "REBATE_TYPE", "MRKT_SEG"];
    static kitDimAtrbs: Array<string> = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];
    static tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "DENSITY_RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
    static densityTierAtrbs = ["DENSITY_RATE", "DENSITY_BAND", "TIER_NBR"];
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
    static nonvolTierFields = [
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
        { "title": "Rate", "field": "DENSITY_RATE", "format": "currency", "align": "right" }
    ];

    static tenderDropDownAtrbs = ["DEAL_COMB_TYPE", "CONTRACT_TYPE", "PERIOD_PROFILE", "RESET_VOLS_ON_PERIOD", "BACK_DATE_RSN", "CONSUMPTION_REASON", "MRKT_SEG", "QLTR_BID_GEO", "SETTLEMENT_PARTNER", "EXPIRE_FLG", "SERVER_DEAL_TYPE", "EXPIRE_YCS2"];
    static contractDropDownAtrbs = ["DEAL_COMB_TYPE", "CONTRACT_TYPE", "PERIOD_PROFILE", "RESET_VOLS_ON_PERIOD", "BACK_DATE_RSN", "CONSUMPTION_REASON", "MRKT_SEG", "SEND_TO_VISTEX", "SERVER_DEAL_TYPE", "SETTLEMENT_PARTNER", "EXPIRE_FLG", "CONSUMPTION_TYPE", "EXPIRE_YCS2"];
    static dimPrdBktFields = ["TRKR_NBR", "ECAP_PRICE", "CAP", "CAP_STRT_DT", "CAP_END_DT", "YCS2_PRC_IRBT", "YCS2_START_DT", "YCS2_END_DT"];
    static dropdownFilterColumns = ["TRKR_NBR", "ECAP_PRICE", "CAP", "CAP_STRT_DT", "CAP_END_DT", "EXPIRE_FLG", "YCS2_PRC_IRBT", "YCS2_START_DT", "YCS2_END_DT"];
    static tenderDashboardDropColumns = ["CUST_MBR_SID", "PAYOUT_BASED_ON", "PERIOD_PROFILE", "MRKT_SEG", "AR_SETTLEMENT_LVL", "PROGRAM_PAYMENT", "WF_STG_CD", "SERVER_DEAL_TYPE"];
    static tenderDashboardDateColumns = ["START_DT", "END_DT", "CAP_STRT_DT", "CAP_END_DT", "ON_ADD_DT", "REBATE_BILLING_START", "REBATE_BILLING_END", "YCS2_START_DT", "YCS2_END_DT"];
    static tenderDashboardNumericColumns = ["DC_ID", "ECAP_PRICE", "CAP", "REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT", "VOLUME",  "TOTAL_DOLLAR_AMOUNT", "CONSUMPTION_LOOKBACK_PERIOD"];
    static opGridTemplate = {
        "groups": {
            "ECAP": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "Payment", "order": 10 },
                { "name": "CAP Info", "order": 98 },
                { "name": "All", "order": 99 }
            ],
            "VOL_TIER": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "RPU", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "HAS_L1", "value": "0" }] },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ],
            "REV_TIER": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                // Force Removed for now until we can work out RPUs for REV_TIER, bring back old line when RPU returns
                { "name": "RPU", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "OBJ_SET_TYPE_CD", "value": "REV_TIER" }] },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ],
            "PROGRAM": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "RPU", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "HAS_L1", "value": "0" }] },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ],
            "KIT": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "SubKit", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "HAS_SUBKIT", "value": "0" }] },
                { "name": "CAP Info", "order": 98 },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ],
            "LUMP_SUM": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "RPU", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "HAS_L1", "value": "0" }] },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ],
            "FLEX": [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                { "name": "Backdate", "order": 2 },
                { "name": "RPU", "order": 3, "rules": [{ "logical": "HideIfAll", "atrb": "HAS_L1", "value": "0" }] },
                { "name": "Payment", "order": 10 },
                { "name": "All", "order": 99 }
            ]
        },
        "templates": {
            "ECAP": {
                "EXCLUDE_AUTOMATION": {
                    "Groups": ["Deal Info"]
                },
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "Payment"]
                },
                "CNTRCT_OBJ_SID": { //note: this is tender Folio Id
                    "Groups": ["Deal Info"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "tender_actions": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "SubKit", "Payment"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "MEETCOMP_TEST_RESULT": {
                    "Groups": ["Deal Info"]
                },
                "COST_TEST_RESULT": {
                    "Groups": ["Deal Info"]
                },
                "MISSING_CAP_COST_INFO": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "COMP_SKU": {
                    "Groups": ["Deal Info"]
                },
                "COMPETITIVE_PRICE": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "ECAP_PRICE": {
                    "Groups": ["Deal Info", "CAP Info"]
                },
                "BACKEND_REBATE": {
                    "Groups": ["Deal Info"]
                },
                "CAP_INFO": {
                    "Groups": ["Deal Info", "CAP Info"]
                },
                "CAP": {
                    "Groups": ["All", "CAP Info"]
                },
                "CAP_STRT_DT": {
                    "Groups": ["All", "CAP Info"]
                },
                "CAP_END_DT": {
                    "Groups": ["All", "CAP Info"]
                },
                "YCS2_INFO": {
                    "Groups": ["Deal Info"]
                },
                "YCS2_PRC_IRBT": {
                    "Groups": ["All"]
                },
                "YCS2_START_DT": {
                    "Groups": ["All"]
                },
                "YCS2_END_DT": {
                    "Groups": ["All"]
                },
                "YCS2_OVERLAP_OVERRIDE": {
                    "Groups": ["All"]
                },
                "VOLUME": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "PAYABLE_QUANTITY": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "ON_ADD_DT": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_SOLD_TO_ID": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_YCS2": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "QLTR_BID_GEO": {
                    "Groups": ["Deal Info"]
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "RESET_VOLS_ON_PERIOD": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "QUOTE_LN_ID": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "REBATE_OA_MAX_VOL": {
                    "Groups": ["All"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
                "GEO_APPROVED_BY": {
                    "Groups": ["Deal Info"]
                },
                "DIV_APPROVED_BY": {
                    "Groups": ["Deal Info"]
                },
                "AUTO_APPROVE_RULE_INFO": {
                    "Groups": ["All"]
                }
            },
            "VOL_TIER": {
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "TIER_NBR": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "RESET_VOLS_ON_PERIOD": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "FRCST_VOL": {
                    "Groups": ["RPU"]
                },
                "MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "RPU_OVERRIDE_CMNT": {
                    "Groups": ["RPU"]
                },
                "REBATE_OA_MAX_VOL": {
                    "Groups": ["All"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
            },
            "REV_TIER": {
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "TIER_NBR": {
                    "Groups": ["Deal Info"]
                },
                "MAX_PAYOUT": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "RESET_VOLS_ON_PERIOD": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
            },
            "PROGRAM": {
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU", "Payment"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "TOTAL_DOLLAR_AMOUNT": {
                    "Groups": ["Deal Info"]
                },
                "ORIG_ECAP_TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "ADJ_ECAP_UNIT": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "OEM_PLTFRM_LNCH_DT": {
                    "Groups": ["Deal Info"]
                },
                "OEM_PLTFRM_EOL_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "ON_ADD_DT": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SEND_TO_VISTEX": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "FRCST_VOL": {
                    "Groups": ["RPU"]
                },
                "MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "RPU_OVERRIDE_CMNT": {
                    "Groups": ["RPU"]
                },
                "REBATE_OA_MAX_VOL": {
                    "Groups": ["All"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
            },
            "KIT": {
                "EXCLUDE_AUTOMATION": {
                    "Groups": ["Deal Info"]
                },
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "SubKit", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "SubKit", "Payment"]
                },
                "CNTRCT_OBJ_SID": { //note: this is tender Folio Id
                    "Groups": ["Deal Info"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "tender_actions": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info", "SubKit", "Payment"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "MEETCOMP_TEST_RESULT": {
                    "Groups": ["Deal Info"]
                },
                "COST_TEST_RESULT": {
                    "Groups": ["Deal Info"]
                },
                "MISSING_CAP_COST_INFO": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["All"]
                },
                "DEAL_GRP_NM": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "HAS_SUBKIT": {
                    "Groups": ["All"]
                },
                "PRD_BCKT": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "PRD_BCKT_SUBKIT": {
                    "Groups": ["SubKit"]
                },
                "PRIMARY_OR_SECONDARY": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "ECAP_PRICE": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "KIT_ECAP": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "SUBKIT_ECAP": {
                    "Groups": ["SubKit"]
                },
                "KIT_REBATE_BUNDLE_DISCOUNT": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "SUBKIT_REBATE_BUNDLE_DISCOUNT": {
                    "Groups": ["SubKit"]
                },
                "BACKEND_REBATE": {
                    "Groups": ["Deal Info"]
                },
                "DSCNT_PER_LN": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "QTY": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "TOTAL_DSCNT_PR_LN": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "KIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE": {
                    "Groups": ["Deal Info", "SubKit"]
                },
                "SUBKIT_SUM_OF_TOTAL_DISCOUNT_PER_LINE": {
                    "Groups": ["SubKit"]
                },
                "CAP_INFO": {
                    "Groups": ["Deal Info", "CAP Info"]
                },
                "CAP": {
                    "Groups": ["All", "CAP Info"]
                },
                "CAP_STRT_DT": {
                    "Groups": ["All", "CAP Info"]
                },
                "CAP_END_DT": {
                    "Groups": ["All", "CAP Info"]
                },
                "CAP_KIT": {
                    "Groups": ["Deal Info", "CAP Info"]
                },
                "YCS2_INFO": {
                    "Groups": ["Deal Info"]
                },
                "YCS2_PRC_IRBT": {
                    "Groups": ["All"]
                },
                "YCS2_START_DT": {
                    "Groups": ["All"]
                },
                "YCS2_END_DT": {
                    "Groups": ["All"]
                },
                "YCS2_KIT": {
                    "Groups": ["All"]
                },
                "YCS2_OVERLAP_OVERRIDE": {
                    "Groups": ["All"]
                },
                "CS_SHIP_AHEAD_STRT_DT": {
                    "Groups": ["All"]
                },
                "CS_SHIP_AHEAD_END_DT": {
                    "Groups": ["All"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "VOLUME": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "PAYABLE_QUANTITY": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "ON_ADD_DT": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "QLTR_BID_GEO": {
                    "Groups": ["Deal Info"]
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "RESET_VOLS_ON_PERIOD": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "REBATE_OA_MAX_VOL": {
                    "Groups": ["All"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
                "GEO_APPROVED_BY": {
                    "Groups": ["Deal Info"]
                },
                "DIV_APPROVED_BY": {
                    "Groups": ["Deal Info"]
                },
                "AUTO_APPROVE_RULE_INFO": {
                    "Groups": ["All"]
                }
            },
            "LUMP_SUM": {
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU", "Payment"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "TOTAL_DOLLAR_AMOUNT": {
                    "Groups": ["Deal Info"]
                },
                "ORIG_ECAP_TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "ADJ_ECAP_UNIT": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "OEM_PLTFRM_LNCH_DT": {
                    "Groups": ["Deal Info"]
                },
                "OEM_PLTFRM_EOL_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "ON_ADD_DT": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"] //, "Consumption"
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SEND_TO_VISTEX": {
                    "Groups": ["Deal Info"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "FRCST_VOL": {
                    "Groups": ["RPU"]
                },
                "MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "RPU_OVERRIDE_CMNT": {
                    "Groups": ["RPU"]
                },
                "REBATE_OA_MAX_VOL": {
                    "Groups": ["All"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
            },
            "FLEX": {
                "tools": {
                    "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "details": {
                    "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU", "Payment"]
                },
                "DC_ID": {
                    "Groups": ["Deal Info"]
                },
                "DC_PARENT_ID": {
                    "Groups": ["Deal Info"]
                },
                "PASSED_VALIDATION": {
                    "Groups": ["Deal Info"]
                },
                "CUST_MBR_SID": {
                    "Groups": ["Deal Info"]
                },
                "FLEX_ROW_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "START_DT": {
                    "Groups": ["Deal Info"]
                },
                "END_DT": {
                    "Groups": ["Deal Info"]
                },
                "WF_STG_CD": {
                    "Groups": ["Deal Info"]
                },
                "EXPIRE_FLG": {
                    "Groups": ["All"]
                },
                "TRKR_NBR": {
                    "Groups": ["Deal Info"]
                },
                "LAST_REDEAL_DT": {
                    "Groups": ["Deal Info"]
                },
                "OBJ_SET_TYPE_CD": {
                    "Groups": ["All"]
                },
                "PTR_USER_PRD": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRODUCT_CATEGORIES": {
                    "Groups": ["Deal Info"]
                },
                "TITLE": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "PRD_EXCLDS": {
                    "Groups": ["Deal Info", "RPU"]
                },
                "SERVER_DEAL_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_COMB_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "DEAL_DESC": {
                    "Groups": ["Deal Info"]
                },
                "PROD_INCLDS": {
                    "Groups": ["Deal Info"]
                },
                "TIER_NBR": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "MRKT_SEG": {
                    "Groups": ["Deal Info"]
                },
                "CONTRACT_TYPE": {
                    "Groups": ["Deal Info"]
                },
                "GEO_COMBINED": {
                    "Groups": ["Deal Info"]
                },
                "TRGT_RGN": {
                    "Groups": ["Deal Info"]
                },
                "END_CUSTOMER_RETAIL": {
                    "Groups": ["Deal Info"]
                },
                "PRIMED_CUST_CNTRY": {
                    "Groups": ["Deal Info"]
                },
                "PAYOUT_BASED_ON": {
                    "Groups": ["Deal Info", "Consumption"]
                },
                "PROGRAM_PAYMENT": {
                    "Groups": ["Deal Info"]
                },
                "PERIOD_PROFILE": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "RESET_VOLS_ON_PERIOD": {
                    "Groups": ["Deal Info"]
                },
                "REBATE_BILLING_START": {
                    "Groups": ["Consumption"]
                },
                "REBATE_BILLING_END": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_LOOKBACK_PERIOD": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_TYPE": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_REASON_CMNT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_PLATFORM": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_SEGMENT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_CUST_RPT_GEO": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_COUNTRY_REGION": {
                    "Groups": ["Consumption"]
                },
                "SYS_PRICE_POINT": {
                    "Groups": ["Consumption"]
                },
                "CONSUMPTION_SYS_CONFIG": {
                    "Groups": ["Consumption"]
                },
                "QLTR_PROJECT": {
                    "Groups": ["Consumption"]
                },
                "AR_SETTLEMENT_LVL": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "SETTLEMENT_PARTNER": {
                    "Groups": ["Deal Info", "Payment"]
                },
                "TERMS": {
                    "Groups": ["Deal Info"]
                },
                "BACK_DATE_RSN": {
                    "Groups": ["Backdate"]
                },
                "FRCST_VOL": {
                    "Groups": ["RPU"]
                },
                "MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_MAX_RPU": {
                    "Groups": ["RPU"]
                },
                "AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "USER_AVG_RPU": {
                    "Groups": ["RPU"]
                },
                "RPU_OVERRIDE_CMNT": {
                    "Groups": ["RPU"]
                },
                "REBATE_OA_MAX_AMT": {
                    "Groups": ["All"]
                },
                /*"TOTAL_CR_DB_PERC": {
                    "Groups": ["Payment"]
                },*/
            }
        },
        "requiredForTender": ["VOLUME", "PAYABLE_QUANTITY", "END_CUSTOMER_RETAIL"],
        "hideForTender": ["DEAL_SOLD_TO_ID", "EXPIRE_YCS2", "DC_PARENT_ID"],
        "hideForNonTender": ["EXCLUDE_AUTOMATION", "MEETCOMP_TEST_RESULT", "COST_TEST_RESULT", "QUOTE_LN_ID", "PAYABLE_QUANTITY"],
        "hideForStandardDealEditor": ["EXCLUDE_AUTOMATION", "tender_actions", "GEO_APPROVED_BY", "DIV_APPROVED_BY", "CNTRCT_OBJ_SID"],
    };
}