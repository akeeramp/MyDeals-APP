namespace Intel.MyDeals.Entities
{
    public static class EN
    {
        public static class OPUSERTOKEN
        {
            public const string IS_SUPER = "IsSuper";
            public const string IS_SUPER_SA = "IsSuperSa";
            public const string IS_DEVELOPER = "IsDeveloper";
            public const string IS_TESTER = "IsTester";

            public const string SUPER_LIST = "UI_SUPER_ADMINISTRATOR_LIST";
            public const string DEVELOPER_LIST = "UI_Developers_List";
            public const string TESTER_LIST = "UI_Testers_List";
            
        }

        public static class DEALTYPE
        {
            public const string VOL_TIER = "VOL TIER";
            public const string VOL_TIER_ALIAS = "VOL_TIER";
            public const string CAP_BAND = "CAP BAND";
            public const string CAP_BAND_ALIAS = "CAP_BAND";
            public const string ECAP = "ECAP";
            public const string ECAP_ALIAS = "ECAP";
            public const string PROGRAM = "PROGRAM";
            public const string PROGRAM_ALIAS = "PROGRAM";
        }

        public static class DEALFACTS
        {
            public const int FACT_15 = 15; // Product selection level
            public const int FACT_60 = 60; // Sub-vertical filter
            public const int FACT_72 = 72; // Exclusion filter
            public const int FACT_80 = 80; // Product category filter
            public const int FACT_128 = 128; // Media code filter
        }

        public static class WORKFLOWSTAGE
        {
            public const string CREATED = "Created";
            public const string REQUESTED = "Requested";
            public const string SUBMITTED = "Submitted";
            public const string SUBMITTED_FAST_TRACK = "Submitted_Fast_Track";
            public const string DA_APPROVED = "DA_Approved";
            public const string FINAL_APPROVAL = "Final_Approval";
            public const string ACTIVE = "Active";
            public const string GA_REJECTED = "GA_Rejected";
            public const string HOLD_WAITING = "Hold_Waiting";
            public const string DA_REJECTED = "DA_Rejected";
            public const string CANCELLED = "Cancelled";
            public const string CUSTOMER_DECLINED = "Customer_Declined";
        }

        public static class EMPLOYEEROLE
        {
            public const string CBA = "CBA";
            public const string DA = "DA";
            public const string FINANCE = "Finance";
            public const string FSE = "FSE";
            public const string GA = "GA";
            public const string LEGAL = "Legal";
            public const string RA = "RA";
            public const string SA = "SA";

        }

        public class ATRB
        {
            public const string DEAL_CORP_ACCNT_DIV = "DEAL_CORP_ACCNT_DIV";
                // Accordion - concatenated account divisions of Corp Cust

            public const string DEAL_NBR = "DEAL_NBR";
            public const string DEAL_ID = "DEAL_SID";
            public const string DEAL_TYPE_CD = "DEAL_TYPE_CD";
            public const string DEAL_TYPE_CD_SID = "DEAL_TYPE_CD_SID";
            public const string ATRB_SID = "ATRB_SID";
            public const string ATRB_VAL = "ATRB_VAL";
            public const string ATRB_CHAR = "ATRB_CHAR";
            public const string PRD_MBR_SID = "PRD_MBR_SID";
            public const string PRD_BCKT_SID = "PRD_BCKT_SID";
            public const string SEG_MBR_SID = "SEG_MBR_SID";
            public const string GEO_MBR_SID = "GEO_MBR_SID";
            public const string LAYER1_SID = "LAYER1_SID";
            public const string LAYER2_SID = "LAYER2_SID";
            public const string LAYER3_SID = "LAYER3_SID";
            public const string LAYER4_SID = "LAYER4_SID";
            public const string LAYER5_SID = "LAYER5_SID";
            public const string LAST_MOD_BY = "LAST_MOD_BY";
            public const string LAST_MOD_DT = "LAST_MOD_DT";
            public const string WF_STG_CD = "WF_STG_CD";
            public const string DEAL_STG_CD = "DEAL_STG_CD";
            public const string COL_NM = "COL_NM";
            public const string TRKR_NBR = "TRKR_NBR";
            public const string COMMENTS = "COMMENTS";
            public const string FILE_NAME = "FILE_NAME";
            public const string FILE_PATH = "FILE_PATH";
            public const string FILE_URL = "FILE_URL";
            public const string ATRB_COL_NM = "ATRB_COL_NM";
            public const string SCTN_ORDER = "SCTN_ORDER";
            public const string SCTN_DESC = "SCTN_DESC";
            public const string DESC = "DESC";
            public const string LABEL = "LABEL";
            public const string DATA_TYPE_SID = "DATA_TYPE_SID";
            public const string DATA_TYPE_CD = "DATA_TYPE_CD";
            public const string UI_TYPE_CD = "UI_TYPE_CD";
            public const string SCTN_CD = "SCTN_CD";
            public const string ORDER = "ORDER";
            public const string START_DT = "START_DT";
            public const string END_DT = "END_DT";
            public const string MULTI_SELECT_MENU = "MULTI_SELECT_MENU";
            public const string TOTAL_DOLLAR_AMOUNT = "TOTAL_DOLLAR_AMOUNT";
            public const string CUST_NM = "CUST_NM";
            public const string CUST_DIV_NM = "CUST_DIV_NM";
            public const string CUST_MBR_SID = "CUST_MBR_SID";
            public const string QTR_NBR = "QTR_NBR";
            public const string YR_NBR = "YR_NBR";
            public const string PRD_BUCKET_CHK = "PRD_BUCKET_CHK";
            public const string PRD_CATGRY_NM = "PRD_CATGRY_NM";
            public const string PRD_ATRB_SID = "PRD_ATRB_SID";
            public const string FACT_CD = "FACT_CD";
            public const string PGM_TYPE_CHK = "PGM_TYPE_CHK";
            public const string PRODUCT_FILTER = "PRODUCT_FILTER";
            public const string PRD_LEVEL = "PRD_LEVEL";
            public const string PRD_ATRB = "PRD_ATRB";
            public const string PRD_ID_EXCLUDE = "PRD_ID_EXCLUDE";
            public const string META_DATA_SOURCE = "META_DATA_SOURCE";
            public const string META_DEAL_MISC = "META_DEAL_MISC";
            public const string VERTICAL = "VERTICAL";
            public const string PRODUCTS = "PRODUCTS";
            public const string COST_TEST_RESULTS = "COST_TEST_RESULTS";
            public const string TARGET_REGION = "TARGET_REGION";
            public const string CEILING_VOLUME = "CEILING_VOLUME";
            public const string TIER_NBR = "TIER_NBR";
            public const string TITLE = "TITLE";
            public const string TRGT_RGN = "TRGT_RGN";
            public const string NUM_OF_TIERS = "NUM_OF_TIERS";
            public const string BAND_TYPE = "BAND_TYPE";
            public const string DEAL_MSP_PRC = "DEAL_MSP_PRC";
            public const string DEAL_PRC_CONFLICT = "DEAL_PRC_CONFLICT";
            public const string DEAL_PGM_TYPE = "DEAL_PGM_TYPE"; //"DEAL_PROGRAM_TYPE"??
            public const string TRKR_START_DT = "TRKR_START_DT";
            public const string TRKR_END_DT = "TRKR_END_DT";
            public const string DEAL_SNAPSHOT_REV = "DEAL_SNAPSHOT_REV";
            public const string DEAL_REV_START_DT = "DEAL_REV_START_DT";
            public const string DEAL_REV_END_DT = "DEAL_REV_END_DT";
            public const string DEAL_FACT_SNAPSHOT_SID = "DEAL_FACT_SNAPSHOT_SID";
            public const string LU_WF_VERT = "LU_WF_Verticals";
            public const string DEAL_COMB_TYPE = "DEAL_COMB_TYPE";
            public const string DEAL_COMB_TYPE_EFFECTIVE_DATE = "DEAL_COMB_TYPE_EFFECTIVE_DATE";

            public const string BACKDATE_REASON = "BACK_DATE_RSN";
            public const string BACKDATE_REASON_TXT = "BACK_DATE_RSN_TXT";
            public const string BENCHMARK = "BENCHMARK";
            public const string BLLG_DT = "BLLG_DT";
            public const string BOM_SYSTEM_CONFIG = "BOM_SYSTEM_CONFIG";
            public const string BUFFER_PCT = "BUFFER_PCT";
            public const string RETAIL_PULL_DOLLARS = "RETAIL_PULL_DOLLARS";
            public const string C2A_DATA_C2A_ID = "C2A_DATA_C2A_ID";

            public const string C2A_DATA_LINEUP_ID = "PARENT_LINEUP_SID";
                //"C2A_DATA_LINEUP_ID";  Attribute name changed by Insook

            public const string C2A_DATA_CUSTOMER_STATUS = "C2A_DATA_CUSTOMER_STATUS";
            public const string C2A_DATA_OVERRIDE = "C2A_DATA_OVERRIDE";
            public const string C2A_CTRCT_NM = "C2A_CTRCT_NM";
            public const string PRICE_AGREEMENT_GRP = "PRICE_AGREEMENT_GRP";
            public const string COMPETITIVE_NAME = "PLI_COMP_SKU";
            public const string COMPETITIVE_PRICE = "PLI_COMP_PRICE";
            public const string COMPETITIVE_PRODUCT_CPU = "COMPETITIVE_PRODUCT_CPU";
            public const string COMPETITIVE_PRODUCT_CS = "COMPETITIVE_PRODUCT_CS";
            public const string COMP_LIST_PRICE = "COMP_LIST_PRICE";
            public const string COMP_PRODUCT_CPU_OTHER = "COMP_PRODUCT_CPU_OTHER";
            public const string COMP_PRODUCT_CS_OTHER = "COMP_PRODUCT_CS_OTHER";
            public const string COMP_TARGET_SYSTEM_PRICE = "COMP_TARGET_SYSTEM_PRICE";
            public const string CONSUMPTION_REASON = "CONSUMPTION_REASON";
            public const string CONSUMPTION_REASON_CMNT = "CONSUMPTION_REASON_CMNT";
            public const string CONSUMPTION_REASON_DSP = "CONSUMPTION_REASON_DSP";
            public const string COST_DELTA = "COST_DELTA";
            public const string COST_TEST_OVERRIDE = "COST_TEST_OVERRIDE";
            public const string COST_TYPE_USED = "COST_TYPE_USED";
            public const string CPU_COST_TYPE_USED = "CPU_COST_TYPE_USED";
            public const string CPU_SPLIT = "CPU_SPLIT";
            public const string PNL_SPLIT = "PNL_SPLIT";
            public const string CREDIT_AMT = "CREDIT_AMT";
            public const string CREDIT_VOLUME = "CREDIT_VOLUME";
            public const string CST_CPU_COST = "CST_CPU_COST";
            public const string CST_CPU_SA = "CST_CPU_SA";
            public const string CST_CPU_SA_MAX = "CST_CPU_SA_MAX";
            public const string CST_CPU_SA_MIN = "CST_CPU_SA_MIN";
            public const string CST_CS_COST = "CST_CS_COST";
            public const string CST_CS_SA = "CST_CS_SA";
            public const string CST_CS_SA_MAX = "CST_CS_SA_MAX";
            public const string CST_CS_SA_MIN = "CST_CS_SA_MIN";
            public const string CST_ECAP_PRICE = "CST_ECAP_PRICE";
            public const string CST_KIT_ECAP = "CST_KIT_ECAP";
            public const string CST_KIT_ECAP_MAX = "CST_KIT_ECAP_MAX";
            public const string CST_KIT_ECAP_MIN = "CST_KIT_ECAP_MIN";
            public const string CS_COST_TYPE_USED = "CS_COST_TYPE_USED";
            public const string CS_SHIP_AHEAD_END_DT = "CS_SHIP_AHEAD_END_DT";
            public const string CS_SHIP_AHEAD_STRT_DT = "CS_SHIP_AHEAD_STRT_DT";
            public const string CS_SPLIT = "CS_SPLIT";
            public const string DEAL_CALC = "DEAL_CALC";
            public const string DEBIT_AMT = "DEBIT_AMT";
            public const string TRGT_RGN_CHK = "TRGT_RGN_CHK";
            public const string DEBIT_VOLUME = "DEBIT_VOLUME";
            public const string DIVISION_APPROVED_LIMIT = "DIVISION_APPROVED_LIMIT";
            public const string ECAP_PRICE_DSP = "ECAP_PRICE_DSP";
            public const string ECAP_TYPE = "ECAP_TYPE";
            public const string END_CUSTOMER_RETAIL = "END_CUSTOMER_RETAIL";
            public const string EXPIRE_YCS2 = "EXPIRE_YCS2";
            public const string IDMS_SHEET_COMMENT = "IDMS_SHEET_COMMENT";
            public const string KIT_CHK = "KIT_CHK";
            public const string L4_PRODUCT_NAME = "L4_PRODUCT_NAME";
            public const string CPU_PULL_DLR = "CPU_PULL_DLR";
            public const string CPU_PULL_DLR_SDM = "CPU_PULL_DLR_SDM";
            public const string LEGAL_COMMENTS = "LEGAL_COMMENTS";
            public const string MATERIAL_TYPE = "MTRL_TYPE_CD";
            public const string MRKT_SEG = "MRKT_SEG";
            public const string MRKT_SEG_COMBINED = "MRKT_SEG_COMBINED";
            public const string NORTHBRIDGE_SPLIT = "NORTHBRIDGE_SPLIT";
            public const string PRD_INACTIVE_FLG = "PRD_INACTIVE_FLG";
            public const string ON_ADD_DT = "ON_ADD_DT";
            public const string OVERLAP_OVERRIDE = "OVERLAP_OVERRIDE";
            public const string PAID_IN_FULL = "PAID_IN_FULL";
            public const string PAYMENT_APPROVAL = "PAYMENT_APPROVAL";
            public const string PAYOUT_BASED_ON = "PAYOUT_BASED_ON";
            public const string PROGRAM_PAYMENT = "PROGRAM_PAYMENT";
            public const string PROGRAM_GEO_COMBINED = "PROGRAM_GEO_COMBINED";
            public const string PRD_COST_FINAL = "PRD_COST_FINAL";
            public const string PRD_CST = "PRD_CST";
            public const string PRD_NM_COMBINED = "PRD_NM_COMBINED";
            public const string PRODUCT_TITLE = "PRODUCT_TITLE";
            public const string QLTR_PROJECT = "QLTR_PROJECT";
            public const string QLTR_TERMS = "QLTR_TERMS";
            public const string QTR = "QTR";
            public const string REBATE_DISTI = "REBATE_DISTI";
            public const string REBATE_PMT = "REBATE_PMT";
            public const string REBATE_QTY = "REBATE_QTY";
            public const string REBATE_BILLING_START = "REBATE_BILLING_START";
            public const string REBATE_BILLING_END = "REBATE_BILLING_END";
            public const string REBATE_ULTRABOOK = "REBATE_ULTRABOOK";
            public const string REBATE_OA_MAX_VOL = "REBATE_OA_MAX_VOL";
            public const string REBATE_OA_MAX_AMT = "REBATE_OA_MAX_AMT";
            public const string REBATE_DEAL_ID = "REBATE_DEAL_ID";
            public const string REQ_BY = "REQ_BY";
            public const string REQ_DT = "REQ_DT";
            public const string RETAIL_CYCLE = "RETAIL_CYCLE";
            public const string RETAIL_SHP_AHEAD_DT = "RETAIL_SHP_AHEAD_DT";
            public const string SA_COST_TEST_RESULTS = "SA_COST_TEST_RESULTS";
            public const string SERVER_DEAL_TYPE = "SERVER_DEAL_TYPE";
            public const string SOLD_TO_ID = "SOLD_TO_ID";
            public const string SOUTHBRIDGE_SPLIT = "SOUTHBRIDGE_SPLIT";
            public const string TENDER_PRICE = "TENDER_PRICE";
            public const string VOLUME = "VOLUME";
            public const string YCS2_OVERLAP_OVERRIDE = "YCS2_OVERLAP_OVERRIDE";
            public const string YEAR = "YEAR";
            public const string ECAP_PRICE = "ECAP_PRICE";
            public const string CAP = "CAP";
            public const string PROGRAM_TYPE = "PROGRAM_TYPE";
            public const string END_VOL = "END_VOL";
            public const string STRT_VOL = "STRT_VOL";
            public const string END_CAP = "END_CAP";
            public const string STRT_CAP = "STRT_CAP";
            public const string RATE = "RATE";
        }

        public class MESSAGES
        {
            public static readonly string BLIND_SEARCH = "No Blind Searches allowed.  Please fill in more information.";
            public static readonly string QUICK_SEARCH_SEARCHING = "Searching Deals (Quick Search)...";

            public static readonly string UNKNOWN_UNABLE_TO_PROCESS =
                "Unable to process this item for an unknown reason.";

            public static readonly string OVERRIDE_DEAL_COMMENT = "Deal was updated via the OverRide Tool.";
            public static readonly string NO_TRACKER_NUMBER = "No Tracker Number";
            public static readonly string NO_TRACKER_RANGE = "No Tracker Date Range";

            public static readonly string NO_PRODUCTS_FOR_CAP_BREAKOUT =
                "You must select a product to view CAP information.";

            public static readonly string ADD_PRODUCTS = "Add Products";
            public static readonly string LOADING_SNAPSHOT = "Loading SnapShot Data";
        }

        public class DC_MESSAGE_TYPES
        {
            public const string ACTION = "ACTION";
            public const string NON_ACTION = "";
            public const string WORKFLOW = "WORKFLOW";
        }


        public static class PROGRAMTYPE
        {
            public const string DEBIT_MEMO = "Debit Memo";
            public const string ECAP_ADJ = "ECAP Adj";
            public const string OTHER = "OTHER";
        }

        public static class PROGRAMPAYMENT
        {
            public const string FE_YCS2 = "Frontend YCS2";
            public const string FE_XOA3 = "Frontend XOA3";
            public const string BACKEND = "Backend";
        }

        public class VALUES
        {
            public const string YES = "Yes";
            public const string NO = "No";
            public static readonly string[] TRUE_LIST = new[] {"YES", "1", "TRUE"};
            public static readonly string[] FALSE_LIST = new[] {"NO", "0", "FALSE"};
            public const string NO_CAP = "No CAP";
            public const string NO_CAP_EN = "No Cap";
            public const string CAP_DEFAULT = "---";
            public const string BILLINGS = "Billings";
            public const string CONSUMPTION = "Consumption";
            public const string CONSUMER = "Consumer";
            public const string RETAIL = "Retail";
            public const string CONSUMER_RETAIL_PULL = "Consumer Retail Pull";
            public const string CONSUMER_NO_PULL = "Consumer No Pull";
            public const string ALL = "All";
            public const string NONE = "None";
            public const string WW = "WW";
            public const string NEW_LINE = "\n";
            public const int MIN_ACT_CHILD_DIV = 2;
            public const double MAX_NUMBER = 999999999;
            public const string ADDITIVE = "Additive";
            public const string OTHER = "Other";
            public const string STANDALONE = "Standalone";
            public const string SVRWS = "SvrWS";
            public const string TENDER = "Tender";
            public const string COSTTEST = "CostTest";
            public const string VALIDATION = "Validation";
            public const string EMBEDDED = "Embedded";
            public const int MAX_PRD_BUCKET = 4;
            public const string LIMIT = "LIMIT";
            public const string NO_LIMIT = "NO LIMIT";
        }

        public class KITIND
        {
            public const string Y = "Y";
            public const string N = "N";
            public const string Q = "Q";
            public const string M = "M";
            public const string E = "E";
        }

        public class STRINGFORMAT
        {
            public const string NONE = "{0}";
            public const string MONEY = "{0:c}";
            public const string INT = "{0:N0}";
            public const string INTMONEY = "{0:$0}";
            public const string DECIMAL = "{0:N2}";
            public const string DATE = "{0:d}";
            public const string DATETIME = "{0:G}";

        }

        public class DEALCOMBTYPE
        {
            public const string ADDITIVE = "Additive";
            public const string NON_ADDITIVE = "Non Additive";
            public const string MUTUALLY_EXCLUSIVE = "Mutually Exclusive";
        }

    }
}