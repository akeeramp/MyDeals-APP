using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Intel.MyDeals.Entities
{
    public static class AttributeCodes
    {

        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 88
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string AAC_COST = "AAC_COST";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 91
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string AAC_COST_COMMENTS = "AAC_COST_COMMENTS";


        ///<summary>
        /// DIM_SID: 103
        /// DIM_CD: ADMACCSS
        /// ATRB_SID: 103002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ACCESS_LVL = "ACCESS_LVL";


        ///<summary>
        /// DIM_SID: 103
        /// DIM_CD: ADMACCSS
        /// ATRB_SID: 103003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ACCESS_LVL_NAME = "ACCESS_LVL_NAME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 1
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ACTIVE = "ACTIVE";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ACTN_CATGRY_CD = "ACTN_CATGRY_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3560
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string ADJ_ECAP_UNIT = "ADJ_ECAP_UNIT";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99011
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ADMIN_ACCESS_LEVEL = "ADMIN_ACCESS_LEVEL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3513
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ADMIN_TOOL_LINK = "ADMIN_TOOL_LINK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3599
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Guid
        ///</summary>
        public const string AGRMNT_GUID = "AGRMNT_GUID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 143
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string AGRMNT_NM = "AGRMNT_NM";


        ///<summary>
        /// DIM_SID: 103
        /// DIM_CD: ADMACCSS
        /// ATRB_SID: 103001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_ADM_ACS_LVL = "ALL_ADM_ACS_LVL";


        ///<summary>
        /// DIM_SID: 12
        /// DIM_CD: ASPBND
        /// ATRB_SID: 12001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_ASPBND = "ALL_ASPBND";


        ///<summary>
        /// DIM_SID: 100
        /// DIM_CD: CTPATRB
        /// ATRB_SID: 100001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_CT_PATRB_NM = "ALL_CT_PATRB_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_CUST_NM = "ALL_CUST_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_DEAL_NM = "ALL_DEAL_NM";


        ///<summary>
        /// DIM_SID: 13
        /// DIM_CD: FATTCH
        /// ATRB_SID: 13001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_FATTCH = "ALL_FATTCH";


        ///<summary>
        /// DIM_SID: 4
        /// DIM_CD: GEO
        /// ATRB_SID: 4001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_GEO_NM = "ALL_GEO_NM";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_MRKT_OPER = "ALL_MRKT_OPER";


        ///<summary>
        /// DIM_SID: 9
        /// DIM_CD: PATRB
        /// ATRB_SID: 9001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_PATRB_NM = "ALL_PATRB_NM";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_PGM = "ALL_PGM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_PRD_NM = "ALL_PRD_NM";


        ///<summary>
        /// DIM_SID: 14
        /// DIM_CD: PRDCAT
        /// ATRB_SID: 14001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_PRDCAT = "ALL_PRDCAT";


        ///<summary>
        /// DIM_SID: 102
        /// DIM_CD: RFVER
        /// ATRB_SID: 102001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ALL_RF_VER = "ALL_RF_VER";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_SEG_NM = "ALL_SEG_NM";


        ///<summary>
        /// DIM_SID: 10
        /// DIM_CD: TIER
        /// ATRB_SID: 10001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_TIER_NM = "ALL_TIER_NM";


        ///<summary>
        /// DIM_SID: 11
        /// DIM_CD: VLVL
        /// ATRB_SID: 11001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_VLVL = "ALL_VLVL";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_WFSTG = "ALL_WFSTG";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16008
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALLOW_REDEAL = "ALLOW_REDEAL";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7068
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string APAC_GROSS_Rev_Grouping = "APAC_GROSS_Rev_Grouping";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7066
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string APAC_SKU_Rev_Grouping = "APAC_SKU_Rev_Grouping";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 2
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ASP_BND_DESC = "ASP_BND_DESC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string ASP_PRC = "ASP_PRC";


        ///<summary>
        /// DIM_SID: 12
        /// DIM_CD: ASPBND
        /// ATRB_SID: 12002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ASPBND_NM = "ASPBND_NM";


        ///<summary>
        /// DIM_SID: 12
        /// DIM_CD: ASPBND
        /// ATRB_SID: 12005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ASPBND_NM_ALIAS = "ASPBND_NM_ALIAS";


        ///<summary>
        /// DIM_SID: 12
        /// DIM_CD: ASPBND
        /// ATRB_SID: 12006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ASPBND_NM_DESC = "ASPBND_NM_DESC";


        ///<summary>
        /// DIM_SID: 12
        /// DIM_CD: ASPBND
        /// ATRB_SID: 12007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ASPBND_NM_ORD = "ASPBND_NM_ORD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99012
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ATOM_Z_QSTN = "ATOM_Z_QSTN";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 36
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ATRB_SCTN = "ATRB_SCTN";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99010
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ATRB_SCTN_DESC = "ATRB_SCTN_DESC";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99009
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ATRB_SCTN_LKUP = "ATRB_SCTN_LKUP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3601
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string AVG_RPU = "AVG_RPU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3596
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BACK_DATE_RSN = "BACK_DATE_RSN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3597
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BACK_DATE_RSN_TXT = "BACK_DATE_RSN_TXT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3580
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BAND_TYPE = "BAND_TYPE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7047
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string BASE_NM = "BASE_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3521
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string BLLG_DT = "BLLG_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3617
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BLNDNG_GEO_SUMRY = "BLNDNG_GEO_SUMRY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3430
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BMT_APPROVED_BY = "BMT_APPROVED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3496
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string BMT_APPROVED_DT = "BMT_APPROVED_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3500
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BMT_REQUESTED_BY = "BMT_REQUESTED_BY";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7039
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string BNB_STATUS = "BNB_STATUS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3357
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BOM_SYSTEM_CONFIG = "BOM_SYSTEM_CONFIG";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 94
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string BOX_ADDER = "BOX_ADDER";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 95
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BOX_ADDER_COMMENTS = "BOX_ADDER_COMMENTS";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string BRND_NM = "BRND_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7048
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string BRND_UNIQ_NM = "BRND_UNIQ_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3504
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BUFFER_PCT = "BUFFER_PCT";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 61
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BUFFER_PCT_COMMENTS = "BUFFER_PCT_COMMENTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3509
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string BUFFER_PCT_DETAIL = "BUFFER_PCT_DETAIL";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2024
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string C2A_ACC_NM = "C2A_ACC_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2025
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string C2A_CPM_ID = "C2A_CPM_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3595
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string C2A_CTRCT_NM = "C2A_CTRCT_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3576
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string C2A_DATA_C2A_ID = "C2A_DATA_C2A_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3578
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string C2A_DATA_CUSTOMER_STATUS = "C2A_DATA_CUSTOMER_STATUS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3579
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string C2A_DATA_OVERRIDE = "C2A_DATA_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3581
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string C2A_UPLOADS_LINK = "C2A_UPLOADS_LINK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 86
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CAP = "CAP";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 89
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CASH_COST = "CASH_COST";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 92
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CASH_COST_COMMENTS = "CASH_COST_COMMENTS";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2016
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CCP_GRP_CD = "CCP_GRP_CD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7050
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CHPST_GRAPH_NM = "CHPST_GRAPH_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7049
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CMT_OBJ_CD = "CMT_OBJ_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3514
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COGNOS_REPORT_LINK = "COGNOS_REPORT_LINK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3448
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COLUMN_CALC_BASED_ON = "COLUMN_CALC_BASED_ON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3350
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMMENT_HISTORY = "COMMENT_HISTORY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3351
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMMENTS = "COMMENTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3112
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string COMP_PRICE_CPU = "COMP_PRICE_CPU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3113
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string COMP_PRICE_CS = "COMP_PRICE_CS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3480
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMP_PRODUCT_CPU_OTHER = "COMP_PRODUCT_CPU_OTHER";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3481
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMP_PRODUCT_CS_OTHER = "COMP_PRODUCT_CS_OTHER";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3356
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string COMP_TARGET_SYSTEM_PRICE = "COMP_TARGET_SYSTEM_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3458
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMPETITIVE_NAME = "COMPETITIVE_NAME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3354
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string COMPETITIVE_PRICE = "COMPETITIVE_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3353
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMPETITIVE_PRODUCT = "COMPETITIVE_PRODUCT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3482
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMPETITIVE_PRODUCT_CPU = "COMPETITIVE_PRODUCT_CPU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3483
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COMPETITIVE_PRODUCT_CS = "COMPETITIVE_PRODUCT_CS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3459
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CONSUMPTION_REASON = "CONSUMPTION_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3460
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CONSUMPTION_REASON_CMNT = "CONSUMPTION_REASON_CMNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3519
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CONSUMPTION_REASON_DSP = "CONSUMPTION_REASON_DSP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3502
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string COST_DELTA = "COST_DELTA";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3637
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_FORMULA = "COST_FORMULA";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 82
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_SECURITY = "COST_SECURITY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3638
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_TEST_INCOMPLETE_REASON = "COST_TEST_INCOMPLETE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3449
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_TEST_OVERRIDE = "COST_TEST_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3636
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_TEST_RESULT = "COST_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3556
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string COST_TYPE_USED = "COST_TYPE_USED";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7024
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_CACHE = "CPU_CACHE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3557
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CPU_COST_TYPE_USED = "CPU_COST_TYPE_USED";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7046
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CPU_GFX_SRC_DIE = "CPU_GFX_SRC_DIE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7042
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_MKT_SEGMENT = "CPU_MKT_SEGMENT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7025
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_PACKAGE = "CPU_PACKAGE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7051
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_PERFVALUE = "CPU_PERFVALUE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7052
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_PSLV = "CPU_PSLV";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3584
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CPU_PULL_DLR = "CPU_PULL_DLR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3589
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CPU_PULL_DLR_SDM = "CPU_PULL_DLR_SDM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7067
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_SPEED = "CPU_SPEED";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3484
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CPU_SPLIT = "CPU_SPLIT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7043
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_VOLTAGE_SEGMENT = "CPU_VOLTAGE_SEGMENT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7023
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CPU_WATTAGE = "CPU_WATTAGE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3541
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CPY_TO_SAP_IND = "CPY_TO_SAP_IND";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3510
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CREDIT_AMT = "CREDIT_AMT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3488
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string CREDIT_VOLUME = "CREDIT_VOLUME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3558
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CS_COST_TYPE_USED = "CS_COST_TYPE_USED";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3346
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string CS_SHIP_AHEAD_DT = "CS_SHIP_AHEAD_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3463
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CS_SHIP_AHEAD_END_DT = "CS_SHIP_AHEAD_END_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3462
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CS_SHIP_AHEAD_STRT_DT = "CS_SHIP_AHEAD_STRT_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3485
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CS_SPLIT = "CS_SPLIT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3523
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CAP = "CST_CAP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3534
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CPU_COST = "CST_CPU_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3545
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CST_CPU_FINAL_COST = "CST_CPU_FINAL_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3528
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CPU_SA = "CST_CPU_SA";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3530
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CPU_SA_MAX = "CST_CPU_SA_MAX";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3529
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CPU_SA_MIN = "CST_CPU_SA_MIN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3535
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CST_CS_COST = "CST_CS_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3546
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CST_CS_FINAL_COST = "CST_CS_FINAL_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3531
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CS_SA = "CST_CS_SA";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3533
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CS_SA_MAX = "CST_CS_SA_MAX";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3532
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_CS_SA_MIN = "CST_CS_SA_MIN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3544
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string CST_DEAL_PRD_MBR_SID = "CST_DEAL_PRD_MBR_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3512
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_ECAP_PRICE = "CST_ECAP_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3525
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_KIT_ECAP = "CST_KIT_ECAP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3527
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_KIT_ECAP_MAX = "CST_KIT_ECAP_MAX";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3526
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_KIT_ECAP_MIN = "CST_KIT_ECAP_MIN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3524
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string CST_MAX_BAND_RATE = "CST_MAX_BAND_RATE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 84
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CST_SECURITY_BUFFER = "CST_SECURITY_BUFFER";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 83
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CST_SECURITY_COST = "CST_SECURITY_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3505
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string CST_TEST_RUN_DT = "CST_TEST_RUN_DT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7055
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CST_USE_IN_CALC = "CST_USE_IN_CALC";


        ///<summary>
        /// DIM_SID: 100
        /// DIM_CD: CTPATRB
        /// ATRB_SID: 100002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CT_PATRB_NM = "CT_PATRB_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2017
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CTRY_CD = "CTRY_CD";


        ///<summary>
        /// DIM_SID: 4
        /// DIM_CD: GEO
        /// ATRB_SID: 4004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CTRY_NM = "CTRY_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2023
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_CATGRY = "CUST_CATGRY";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2010
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_CHNL = "CUST_CHNL";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 43
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_DEALTYPE_ASGN = "CUST_DEALTYPE_ASGN";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_DIV_NM = "CUST_DIV_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 27
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_GEO_SEG_ASGN = "CUST_GEO_SEG_ASGN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3011
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string CUST_MBR_SID = "CUST_MBR_SID";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_NM = "CUST_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2018
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_SRCH_NM = "CUST_SRCH_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2011
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string CUST_TYPE = "CUST_TYPE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7030
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DB_LD_ATRB_SID = "DB_LD_ATRB_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3594
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_COMB_TYPE = "DEAL_COMB_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3591
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_CORP_ACCNT_DIV = "DEAL_CORP_ACCNT_DIV";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3647
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_COST_TEST_FAIL_OVERRIDE = "DEAL_COST_TEST_FAIL_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3648
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_COST_TEST_FAIL_OVERRIDE_REASON = "DEAL_COST_TEST_FAIL_OVERRIDE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3652
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_COST_TEST_RESULT = "DEAL_COST_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3440
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_CUST_DIV_NM = "DEAL_CUST_DIV_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3372
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_CUST_NM = "DEAL_CUST_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 33
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_DESC = "DEAL_DESC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3624
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string DEAL_GROUP_LOCK = "DEAL_GROUP_LOCK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3200
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_GRP_CATGRY = "DEAL_GRP_CATGRY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3201
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_GRP_NM = "DEAL_GRP_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3649
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_MEETCOMP_TEST_FAIL_OVERRIDE = "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3650
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON = "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3651
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_MEETCOMP_TEST_RESULT = "DEAL_MEETCOMP_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 128
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_MM_MEDIA_CD = "DEAL_MM_MEDIA_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 97
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string DEAL_MSP_PRC = "DEAL_MSP_PRC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_NBR = "DEAL_NBR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3434
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_OFF_ROADMAP_FLG = "DEAL_OFF_ROADMAP_FLG";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3492
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PGM_TYPE = "DEAL_PGM_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3639
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_COST_TEST_FAIL_OVERRIDE = "DEAL_PLI_COST_TEST_FAIL_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3640
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON = "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3646
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_COST_TEST_INCOMPLETE_REASON = "DEAL_PLI_COST_TEST_INCOMPLETE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3645
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_COST_TEST_RESULT = "DEAL_PLI_COST_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3641
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE = "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3642
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON = "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3644
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_MEETCOMP_TEST_RESULT = "DEAL_PLI_MEETCOMP_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3643
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PLI_PLI_NET_PRICE_CONCATE = "DEAL_PLI_PLI_NET_PRICE_CONCATE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 98
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PRC_CONFLICT = "DEAL_PRC_CONFLICT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 60
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PRD_ATRB = "DEAL_PRD_ATRB";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DEAL_PRD_NM = "DEAL_PRD_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DEAL_PRD_TYPE = "DEAL_PRD_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 57
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PROGRAM_TYPE_ALT = "DEAL_PROGRAM_TYPE_ALT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 81
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_PROGRAM_TYPE_GEN = "DEAL_PROGRAM_TYPE_GEN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3616
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string DEAL_SID = "DEAL_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3540
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_SOLD_TO_ID = "DEAL_SOLD_TO_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3327
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_STG_CD = "DEAL_STG_CD";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 37
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DEAL_TYPE_ATRB = "DEAL_TYPE_ATRB";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_TYPE_CD = "DEAL_TYPE_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3004
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string DEAL_TYPE_CD_SID = "DEAL_TYPE_CD_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3010
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DEAL_TYPE_DESC = "DEAL_TYPE_DESC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3511
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string DEBIT_AMT = "DEBIT_AMT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3489
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string DEBIT_VOLUME = "DEBIT_VOLUME";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7020
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DEVICE_TYPE = "DEVICE_TYPE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 133
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DieSize_COMMENTS = "DieSize_COMMENTS";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 132
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string DieSize_COST = "DieSize_COST";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 38
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DIM_FLG = "DIM_FLG";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 66
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DIV_APPROVED_BY = "DIV_APPROVED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 67
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string DIV_APPROVED_DT = "DIV_APPROVED_DT";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2015
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DIV_CCP_GRP_CD = "DIV_CCP_GRP_CD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7063
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DIV_CD = "DIV_CD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7036
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DIV_NM = "DIV_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 4
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string DIVISION_APPROVAL_PRICE = "DIVISION_APPROVAL_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3471
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string DIVISION_APPROVED_LIMIT = "DIVISION_APPROVED_LIMIT";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8012
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DRAWING_ORD = "DRAWING_ORD";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 45
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string DROP_DOWN_LOOKUP = "DROP_DOWN_LOOKUP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3615
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string ECAP_FLR = "ECAP_FLR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 5
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string ECAP_PRICE = "ECAP_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3518
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ECAP_PRICE_DSP = "ECAP_PRICE_DSP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3331
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ECAP_TYPE = "ECAP_TYPE";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5007
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string EMB_SEG_MBR_SID = "EMB_SEG_MBR_SID";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 85
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_ADM_ACCESS = "EMP_ADM_ACCESS";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 28
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_CUST_ASGN = "EMP_CUST_ASGN";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 29
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_CUST_EMAIL_NOTIF = "EMP_CUST_EMAIL_NOTIF";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 30
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_CUST_FULL_ACCESS = "EMP_CUST_FULL_ACCESS";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 31
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_GEO_ASGN = "EMP_GEO_ASGN";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 32
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EMP_VRTCL_ASGN = "EMP_VRTCL_ASGN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3522
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ENABLE_ECAP_VALIDATION_CONF = "ENABLE_ECAP_VALIDATION_CONF";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 106
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string END_CAP = "END_CAP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3348
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string END_CUSTOMER_RETAIL = "END_CUSTOMER_RETAIL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3320
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string END_DT = "END_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 6
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string END_VOL = "END_VOL";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7056
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EPM_NM = "EPM_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7057
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EST_DIE_SIZE = "EST_DIE_SIZE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3562
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string EXPIRE_YCS2 = "EXPIRE_YCS2";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2026
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string EXT_CUST_EMAIL = "EXT_CUST_EMAIL";


        ///<summary>
        /// DIM_SID: 13
        /// DIM_CD: FATTCH
        /// ATRB_SID: 13002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FATTCH_NM = "FATTCH_NM";


        ///<summary>
        /// DIM_SID: 13
        /// DIM_CD: FATTCH
        /// ATRB_SID: 13005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FATTCH_NM_ALIAS = "FATTCH_NM_ALIAS";


        ///<summary>
        /// DIM_SID: 13
        /// DIM_CD: FATTCH
        /// ATRB_SID: 13006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FATTCH_NM_DESC = "FATTCH_NM_DESC";


        ///<summary>
        /// DIM_SID: 13
        /// DIM_CD: FATTCH
        /// ATRB_SID: 13007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FATTCH_NM_ORD = "FATTCH_NM_ORD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7045
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FG_MTRL_STS_CD = "FG_MTRL_STS_CD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7058
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FG_OLD_MTRL_NBR = "FG_OLD_MTRL_NBR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3516
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FILE_ATTCH_SHARE_DRIVE = "FILE_ATTCH_SHARE_DRIVE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 7
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FILE_NAME = "FILE_NAME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 8
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FILE_PATH = "FILE_PATH";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 9
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FILE_URL = "FILE_URL";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FMLY_NM = "FMLY_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7027
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FMLY_NM_MM = "FMLY_NM_MM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7053
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FMLY_UNIQ_NM = "FMLY_UNIQ_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7059
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FRCST_DVC_NM = "FRCST_DVC_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3603
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string FRCST_VOL = "FRCST_VOL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3497
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FSE_APPROVED_BY = "FSE_APPROVED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 70
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FSE_APPROVED_BY_FACT = "FSE_APPROVED_BY_FACT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3498
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string FSE_APPROVED_DT = "FSE_APPROVED_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 71
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string FSE_APPROVED_DT_FACT = "FSE_APPROVED_DT_FACT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 10
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string FSE_APPROVED_PRICE = "FSE_APPROVED_PRICE";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2027
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string FSE_CUST_EMAIL = "FSE_CUST_EMAIL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3501
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FSE_REQUESTED_BY = "FSE_REQUESTED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 79
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string FSE_REQUESTED_BY_FACT = "FSE_REQUESTED_BY_FACT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 76
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string FSE_REQUESTED_PRICE = "FSE_REQUESTED_PRICE";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2022
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string GDM_CUST_DIV_NM = "GDM_CUST_DIV_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7044
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string GDM_PRD_TYPE_NM = "GDM_PRD_TYPE_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2021
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string GDM_SLD_TO_CUST_NM = "GDM_SLD_TO_CUST_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7038
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string GDM_VRT_NM = "GDM_VRT_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 68
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string GEO_APPROVED_BY = "GEO_APPROVED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 69
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string GEO_APPROVED_DT = "GEO_APPROVED_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 11
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string GEO_APPROVED_PRICE = "GEO_APPROVED_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3620
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string GEO_COMBINED = "GEO_COMBINED";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5002
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string GEO_MBR_SID = "GEO_MBR_SID";


        ///<summary>
        /// DIM_SID: 4
        /// DIM_CD: GEO
        /// ATRB_SID: 4002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string GEO_NM = "GEO_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 78
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string GEO_REQUESTED_BY = "GEO_REQUESTED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 77
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string GEO_REQUESTED_PRICE = "GEO_REQUESTED_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 12
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string GEO_STG_ID = "GEO_STG_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3515
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string HELP_LINK = "HELP_LINK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 104
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string HIST_ECAP_PRICE = "HIST_ECAP_PRICE";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2012
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string HOSTED_GEO = "HOSTED_GEO";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 63
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string IDMS_APPL = "IDMS_APPL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3464
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_SHEET_COMMENT = "IDMS_SHEET_COMMENT";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 113
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_ACCR_READ = "IDMS_WRAP_ACCR_READ";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 114
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_ACCR_WRITE = "IDMS_WRAP_ACCR_WRITE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 117
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_ADMIN_READ = "IDMS_WRAP_ADMIN_READ";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 118
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_ADMIN_WRITE = "IDMS_WRAP_ADMIN_WRITE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 115
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_CONS_WRITE = "IDMS_WRAP_CONS_WRITE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 119
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_MAINT_READ = "IDMS_WRAP_MAINT_READ";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 120
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_MAINT_WRITE = "IDMS_WRAP_MAINT_WRITE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 53
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_RBFC_READ = "IDMS_WRAP_RBFC_READ";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 112
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_RBFC_WRITE = "IDMS_WRAP_RBFC_WRITE";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 116
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string IDMS_WRAP_RPRT_READ = "IDMS_WRAP_RPRT_READ";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2013
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string INDUS_KEY_CD = "INDUS_KEY_CD";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2029
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string IS_CORP_ACCNT = "IS_CORP_ACCNT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7062
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ITM_MKT_DSC = "ITM_MKT_DSC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3465
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string KIT_CHK = "KIT_CHK";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7065
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string KIT_IND = "KIT_IND";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3520
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string L4_PRODUCT_NAME = "L4_PRODUCT_NAME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3613
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string LAR_FLR = "LAR_FLR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3326
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LAST_MOD_BY = "LAST_MOD_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3342
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string LAST_MOD_DT = "LAST_MOD_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3450
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LEGAL_COMMENTS = "LEGAL_COMMENTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3587
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINE_NBR = "LINE_NBR";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 122
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_DGEMM = "LINEUP_DGEMM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 124
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_PLATFORM = "LINEUP_PLATFORM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 121
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_SGEMM = "LINEUP_SGEMM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 52
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_SPEC_AVG_BM = "LINEUP_SPEC_AVG_BM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 42
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_SPEC_FP = "LINEUP_SPEC_FP";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 41
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_SPEC_INT = "LINEUP_SPEC_INT";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 51
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_SPEC_TPCC = "LINEUP_SPEC_TPCC";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 123
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_STREAM = "LINEUP_STREAM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 44
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string LINEUP_VRT_SECURITY = "LINEUP_VRT_SECURITY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 13
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MARKET_SEGMENT = "MARKET_SEGMENT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3549
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_AAC = "MAX_AAC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3553
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_AAC_SEC = "MAX_AAC_SEC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3550
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_CASH = "MAX_CASH";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3554
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_CASH_SEC = "MAX_CASH_SEC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3548
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_PCOS = "MAX_PCOS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3552
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_PCOS_SEC = "MAX_PCOS_SEC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3600
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string MAX_RPU = "MAX_RPU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3551
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_VARIABLE = "MAX_VARIABLE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3555
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MAX_VARIABLE_SEC = "MAX_VARIABLE_SEC";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3604
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string MCA_PRI_PROD = "MCA_PRI_PROD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3605
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string MCA_SEC_PROD = "MCA_SEC_PROD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3606
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MCAR_OVERRIDE = "MCAR_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3607
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MCAR_OVERRIDE_CMNT = "MCAR_OVERRIDE_CMNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3625
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MEET_COMP_PRICE_QSTN = "MEET_COMP_PRICE_QSTN";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99014
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MEET_COMP_PRICE_QSTN_DDWN = "MEET_COMP_PRICE_QSTN_DDWN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3635
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MEETCOMP_TEST_RESULT = "MEETCOMP_TEST_RESULT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3564
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string META_DATA_SOURCE = "META_DATA_SOURCE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3563
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string META_DEAL_MISC = "META_DEAL_MISC";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7040
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MM_BNB_TRANSFER_DATE = "MM_BNB_TRANSFER_DATE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7029
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MM_MEDIA_CD = "MM_MEDIA_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3433
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MMBP_APPROVED_BY = "MMBP_APPROVED_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3432
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string MMBP_APPROVED_DT = "MMBP_APPROVED_DT";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MRKT_OPER_CD = "MRKT_OPER_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 59
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MRKT_SEG = "MRKT_SEG";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3474
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string MRKT_SEG_COMBINED = "MRKT_SEG_COMBINED";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MRKTOP_DIV_NM = "MRKTOP_DIV_NM";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MRKTOP_GDM_VRT_NM = "MRKTOP_GDM_VRT_NM";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MRKTOP_OP_CD = "MRKTOP_OP_CD";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6010
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MRKTOP_PRD_CATGRY_NM = "MRKTOP_PRD_CATGRY_NM";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 96
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string MSP_PRD = "MSP_PRD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7008
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MTRL_ID = "MTRL_ID";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7070
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string MTRL_TYPE_CD = "MTRL_TYPE_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99013
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string NAND_SSD_QSTN = "NAND_SSD_QSTN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3631
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string NO_CRE_DEAL = "NO_CRE_DEAL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3486
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string NORTHBRIDGE_SPLIT = "NORTHBRIDGE_SPLIT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3490
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string NUM_OF_TIERS = "NUM_OF_TIERS";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7041
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string OFF_ROADMAP_FLG = "OFF_ROADMAP_FLG";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3435
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string ON_ADD_DT = "ON_ADD_DT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7037
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string OP_CD = "OP_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3559
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string ORIG_ECAP_TRKR_NBR = "ORIG_ECAP_TRKR_NBR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3468
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string OVERLAP_OVERRIDE = "OVERLAP_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3363
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string OVERLAPPING_DEALS = "OVERLAPPING_DEALS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3577
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PARENT_LINEUP_SID = "PARENT_LINEUP_SID";


        ///<summary>
        /// DIM_SID: 9
        /// DIM_CD: PATRB
        /// ATRB_SID: 9002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PATRB_NM = "PATRB_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 35
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PAYOUT_BASED_ON = "PAYOUT_BASED_ON";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3608
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PCA_PRI_PROD = "PCA_PRI_PROD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3609
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PCA_SEC_PROD = "PCA_SEC_PROD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3610
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PCAR_OVERRIDE = "PCAR_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3611
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PCAR_OVERRIDE_CMNT = "PCAR_OVERRIDE_CMNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3561
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string PERFORM_CTST = "PERFORM_CTST";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16009
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string PERFORM_ECAP_VAL = "PERFORM_ECAP_VAL";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16010
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string PERFORM_ECAP_VAL_LINEUP = "PERFORM_ECAP_VAL_LINEUP";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PGM_TYPE = "PGM_TYPE";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PGM_TYPE_ALIAS = "PGM_TYPE_ALIAS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 54
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PGM_TYPE_CHK = "PGM_TYPE_CHK";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PGM_TYPE_DESC = "PGM_TYPE_DESC";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99008
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PGM_TYPE_LKUP = "PGM_TYPE_LKUP";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PGM_TYPE_ORD = "PGM_TYPE_ORD";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5004
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PGM_TYPE_SID = "PGM_TYPE_SID";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 87
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PL_SPLIT_VAL = "PL_SPLIT_VAL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3632
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_CAP_TYPE = "PLI_CAP_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3627
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PLI_COMP_BENCH = "PLI_COMP_BENCH";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3623
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PLI_COMP_PRICE = "PLI_COMP_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3621
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_COMP_SKU = "PLI_COMP_SKU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3622
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_COMP_SKU_OTHR = "PLI_COMP_SKU_OTHR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 140
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PLI_COST = "PLI_COST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 141
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_COST_TYPE_USED = "PLI_COST_TYPE_USED";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3626
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PLI_CPU_BENCH = "PLI_CPU_BENCH";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 144
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_DTL_QSTN = "PLI_DTL_QSTN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3598
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Guid
        ///</summary>
        public const string PLI_GUID = "PLI_GUID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 142
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PLI_LOCATOR = "PLI_LOCATOR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3634
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_NET_PRICE_CONCATE = "PLI_NET_PRICE_CONCATE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3633
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PLI_ODM_CAP = "PLI_ODM_CAP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3343
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PLI_SORT_ORD = "PLI_SORT_ORD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 130
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PNL_SPLIT = "PNL_SPLIT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 14
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PnL_Split_for_KITS = "PnL_Split_for_KITS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3441
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PORTFOLIO = "PORTFOLIO";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2014
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRC_GRP_CD = "PRC_GRP_CD";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRCSSR_NBR = "PRCSSR_NBR";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7035
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRD_ATRB = "PRD_ATRB";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5006
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRD_ATRB_SID = "PRD_ATRB_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 131
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRD_BUCKET_CHK = "PRD_BUCKET_CHK";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5003
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRD_BUCKT_SID = "PRD_BUCKT_SID";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 47
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PRD_BUFFER_PCT = "PRD_BUFFER_PCT";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 39
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PRD_CAP_PRICE = "PRD_CAP_PRICE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRD_CATGRY_NM = "PRD_CATGRY_NM";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7033
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRD_CATGRY_NM_DESC = "PRD_CATGRY_NM_DESC";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 46
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PRD_COST = "PRD_COST";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 48
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_COST_COMMENTS = "PRD_COST_COMMENTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3508
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_COST_DETAIL = "PRD_COST_DETAIL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3507
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string PRD_COST_FINAL = "PRD_COST_FINAL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3503
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_CST = "PRD_CST";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 72
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_ID_EXCLUDE = "PRD_ID_EXCLUDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3543
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Boolean
        ///</summary>
        public const string PRD_INACTIVE_FLG = "PRD_INACTIVE_FLG";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 80
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_LEVEL = "PRD_LEVEL";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5000
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRD_MBR_SID = "PRD_MBR_SID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3477
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_NM_COMBINED = "PRD_NM_COMBINED";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 55
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRD_TYPE_CHK = "PRD_TYPE_CHK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 75
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRD_VERTICAL = "PRD_VERTICAL";


        ///<summary>
        /// DIM_SID: 14
        /// DIM_CD: PRDCAT
        /// ATRB_SID: 14002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRDCAT_NM = "PRDCAT_NM";


        ///<summary>
        /// DIM_SID: 14
        /// DIM_CD: PRDCAT
        /// ATRB_SID: 14005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRDCAT_NM_ALIAS = "PRDCAT_NM_ALIAS";


        ///<summary>
        /// DIM_SID: 14
        /// DIM_CD: PRDCAT
        /// ATRB_SID: 14006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRDCAT_NM_DESC = "PRDCAT_NM_DESC";


        ///<summary>
        /// DIM_SID: 14
        /// DIM_CD: PRDCAT
        /// ATRB_SID: 14007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRDCAT_NM_ORD = "PRDCAT_NM_ORD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 135
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string PRI_PROD = "PRI_PROD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3585
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRICE_AGREEMENT_GRP = "PRICE_AGREEMENT_GRP";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7069
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PRICE_SKU_NM = "PRICE_SKU_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 15
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRODUCT_FILTER = "PRODUCT_FILTER";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 49
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PRODUCT_TITLE = "PRODUCT_TITLE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3586
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROG_VOLTIER_NM = "PROG_VOLTIER_NM";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3204
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROG_VOLTIER_RPU = "PROG_VOLTIER_RPU";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 16
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_GEO = "PROGRAM_GEO";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 17
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_GEO_COMBINED = "PROGRAM_GEO_COMBINED";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3495
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_PAYMENT = "PROGRAM_PAYMENT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 58
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_PAYMENT_ALT = "PROGRAM_PAYMENT_ALT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 18
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_TYPE = "PROGRAM_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3593
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string PROGRAM_TYPE_VOL_TIER = "PROGRAM_TYPE_VOL_TIER";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7060
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PS_LEAD_FREE = "PS_LEAD_FREE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7061
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string PS_MARKET_SEGMENT = "PS_MARKET_SEGMENT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3568
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string QLTR_PROJECT = "QLTR_PROJECT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3569
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string QLTR_TERMS = "QLTR_TERMS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3394
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string QTR = "QTR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 56
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string RATE = "RATE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3392
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RATE_BASED_ON = "RATE_BASED_ON";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 64
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string RBFC_DOLLAR = "RBFC_DOLLAR";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 73
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string RBFC_DOLLAR_FINAL = "RBFC_DOLLAR_FINAL";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 74
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RBFC_RA_CMT_FINAL = "RBFC_RA_CMT_FINAL";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 65
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RBFC_RA_COMMENTS = "RBFC_RA_COMMENTS";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 62
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string RBFC_ROLE_ACCESS = "RBFC_ROLE_ACCESS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3571
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string REBATE_BILLING_END = "REBATE_BILLING_END";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3570
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string REBATE_BILLING_START = "REBATE_BILLING_START";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3575
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string REBATE_DEAL_ID = "REBATE_DEAL_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3567
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string REBATE_DISTI = "REBATE_DISTI";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3574
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string REBATE_OA_MAX_AMT = "REBATE_OA_MAX_AMT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3573
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string REBATE_OA_MAX_VOL = "REBATE_OA_MAX_VOL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3565
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string REBATE_PMT = "REBATE_PMT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3566
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string REBATE_QTY = "REBATE_QTY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 107
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string REDEAL_FRST_REQ_DT = "REDEAL_FRST_REQ_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 134
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string REMARKS = "REMARKS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 19
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string REQ_BY = "REQ_BY";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3324
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string REQ_DT = "REQ_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3466
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RETAIL_CYCLE = "RETAIL_CYCLE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3612
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string RETAIL_PULL = "RETAIL_PULL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3618
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string RETAIL_PULL_USR_DEF = "RETAIL_PULL_USR_DEF";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3619
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RETAIL_PULL_USR_DEF_CMNT = "RETAIL_PULL_USR_DEF_CMNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3436
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RETAIL_SHP_AHEAD_DT = "RETAIL_SHP_AHEAD_DT";


        ///<summary>
        /// DIM_SID: 102
        /// DIM_CD: RFVER
        /// ATRB_SID: 102002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RF_VER = "RF_VER";


        ///<summary>
        /// DIM_SID: 4
        /// DIM_CD: GEO
        /// ATRB_SID: 4003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string RGN_NM = "RGN_NM";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ROLE_TIER_CD = "ROLE_TIER_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3628
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RPU_CALC_TYPE = "RPU_CALC_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3614
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RPU_OVERRIDE_CMNT = "RPU_OVERRIDE_CMNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3602
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string RPU_OVERRIDE_COMMENT = "RPU_OVERRIDE_COMMENT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3467
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string SA_COST_TEST_RESULTS = "SA_COST_TEST_RESULTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 136
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string SEC_PROD = "SEC_PROD";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 40
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SECURITY_ACCOUNT_ROLE_ASGN = "SECURITY_ACCOUNT_ROLE_ASGN";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8010
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SEG_DESC = "SEG_DESC";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5001
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string SEG_MBR_SID = "SEG_MBR_SID";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SEG_NM = "SEG_NM";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SEG_NM_EMB = "SEG_NM_EMB";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3347
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string SERVER_DEAL_TYPE = "SERVER_DEAL_TYPE";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7026
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SKU_FSB_NAME = "SKU_FSB_NAME";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7021
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SKU_NM = "SKU_NM";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2019
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SLS_ORG_CD = "SLS_ORG_CD";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SOLD_TO_ID = "SOLD_TO_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3487
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string SOUTHBRIDGE_SPLIT = "SOUTHBRIDGE_SPLIT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7054
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SPEC_CD = "SPEC_CD";


        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2020
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SPLT_PRC_SLS_ORG_CD = "SPLT_PRC_SLS_ORG_CD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3319
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string START_DT = "START_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 105
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string STRT_CAP = "STRT_CAP";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 20
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string STRT_VOL = "STRT_VOL";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7028
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SUB_VERTICAL = "SUB_VERTICAL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3517
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string SUPPORT_EMAIL = "SUPPORT_EMAIL";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7022
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string SVR_PRCSSR_TYPE = "SVR_PRCSSR_TYPE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3506
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string TENDER_PRICE = "TENDER_PRICE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 21
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string TIER_NBR = "TIER_NBR";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5005
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string TIER_NBR_SID = "TIER_NBR_SID";


        ///<summary>
        /// DIM_SID: 10
        /// DIM_CD: TIER
        /// ATRB_SID: 10002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TIER_NM = "TIER_NM";


        ///<summary>
        /// DIM_SID: 10
        /// DIM_CD: TIER
        /// ATRB_SID: 10005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TIER_NM_ALAIS = "TIER_NM_ALAIS";


        ///<summary>
        /// DIM_SID: 10
        /// DIM_CD: TIER
        /// ATRB_SID: 10006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TIER_NM_DESC = "TIER_NM_DESC";


        ///<summary>
        /// DIM_SID: 10
        /// DIM_CD: TIER
        /// ATRB_SID: 10007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TIER_NM_ORD = "TIER_NM_ORD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 22
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string TOTAL_DOLLAR_AMOUNT = "TOTAL_DOLLAR_AMOUNT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 23
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string TRGT_RGN = "TRGT_RGN";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 50
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string TRGT_RGN_CHK = "TRGT_RGN_CHK";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 100
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string TRKR_END_DT = "TRKR_END_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 24
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string TRKR_NBR = "TRKR_NBR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3009
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string TRKR_NBR_DT_LTR = "TRKR_NBR_DT_LTR";


        ///<summary>
        /// DIM_SID: 4
        /// DIM_CD: GEO
        /// ATRB_SID: 4005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TRKR_NBR_GEO_LTR = "TRKR_NBR_GEO_LTR";


        ///<summary>
        /// DIM_SID: 15
        /// DIM_CD: PGM
        /// ATRB_SID: 15008
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TRKR_NBR_PGM_LTR = "TRKR_NBR_PGM_LTR";


        ///<summary>
        /// DIM_SID: 8
        /// DIM_CD: SEG
        /// ATRB_SID: 8013
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TRKR_NBR_SEG_LTR = "TRKR_NBR_SEG_LTR";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7032
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string TRKR_NBR_VRT_LTR = "TRKR_NBR_VRT_LTR";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 99
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string TRKR_START_DT = "TRKR_START_DT";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7031
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string UI_DSPLY_ATRB_SID = "UI_DSPLY_ATRB_SID";


        ///<summary>
        /// DIM_SID: 6
        /// DIM_CD: MRKTOP
        /// ATRB_SID: 6015
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string USE_BNB_STS = "USE_BNB_STS";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 90
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string VARIABLE_COST = "VARIABLE_COST";


        ///<summary>
        /// DIM_SID: 999
        /// DIM_CD: MISC
        /// ATRB_SID: 93
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string VARIABLE_COST_COMMENTS = "VARIABLE_COST_COMMENTS";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3316
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string VERTICAL = "VERTICAL";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3630
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string VIP_AVG_PCT = "VIP_AVG_PCT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3629
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string VIP_MAX_PCT = "VIP_MAX_PCT";


        ///<summary>
        /// DIM_SID: 11
        /// DIM_CD: VLVL
        /// ATRB_SID: 11002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string VLVL_NM = "VLVL_NM";


        ///<summary>
        /// DIM_SID: 11
        /// DIM_CD: VLVL
        /// ATRB_SID: 11005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string VLVL_NM_ALIAS = "VLVL_NM_ALIAS";


        ///<summary>
        /// DIM_SID: 11
        /// DIM_CD: VLVL
        /// ATRB_SID: 11006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string VLVL_NM_DESC = "VLVL_NM_DESC";


        ///<summary>
        /// DIM_SID: 11
        /// DIM_CD: VLVL
        /// ATRB_SID: 11007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string VLVL_NM_ORD = "VLVL_NM_ORD";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3321
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string VOLUME = "VOLUME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 25
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string VOLUME_BAND = "VOLUME_BAND";


        ///<summary>
        /// DIM_SID: 7
        /// DIM_CD: PRD
        /// ATRB_SID: 7064
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string VRTCL_SEG_CD = "VRTCL_SEG_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WF_NAME = "WF_NAME";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 26
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string WF_STG_CD = "WF_STG_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_ACTN_CD = "WFSTG_ACTN_CD";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16002
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_CD = "WFSTG_CD";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_DESC = "WFSTG_DESC";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_LOC_CD = "WFSTG_LOC_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_LOC_CD_LKUP = "WFSTG_LOC_CD_LKUP";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16007
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_ORD = "WFSTG_ORD";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16006
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_STS_CD = "WFSTG_STS_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99005
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_STS_CD_LKUP = "WFSTG_STS_CD_LKUP";


        ///<summary>
        /// DIM_SID: 16
        /// DIM_CD: WFSTG
        /// ATRB_SID: 16004
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_TIER_CD = "WFSTG_TIER_CD";


        ///<summary>
        /// DIM_SID: 99
        /// DIM_CD: LKUP
        /// ATRB_SID: 99003
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string WFSTG_TIER_CD_LKUP = "WFSTG_TIER_CD_LKUP";


        ///<summary>
        /// DIM_SID: 5
        /// DIM_CD: ATRB_MTX
        /// ATRB_SID: 5008
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string WORKBOOK_ID = "WORKBOOK_ID";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 139
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string YCS2_END_DT = "YCS2_END_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3542
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.String
        ///</summary>
        public const string YCS2_OVERLAP_OVERRIDE = "YCS2_OVERLAP_OVERRIDE";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 137
        /// TGT_COL_TYPE: MONEY
        /// DOT_NET_DATA_TYPE: System.Double
        ///</summary>
        public const string YCS2_PRC_IRBT = "YCS2_PRC_IRBT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 138
        /// TGT_COL_TYPE: DATETIME
        /// DOT_NET_DATA_TYPE: System.DateTime
        ///</summary>
        public const string YCS2_START_DT = "YCS2_START_DT";


        ///<summary>
        /// DIM_SID: 3
        /// DIM_CD: DEAL
        /// ATRB_SID: 3393
        /// TGT_COL_TYPE: INT
        /// DOT_NET_DATA_TYPE: System.Int32
        ///</summary>
        public const string YEAR = "YEAR";

    }
    public static class DealSaveActionCodes
    {

        ///<summary>
        /// ACTN_SID: 195
        /// SRT_ORD: 3300
        /// Message back to WIP Action Queue with ATRB_DELETED and ATRB_SID in OBJ_SID for a specific OBJ_SET.
        ///</summary>
        public const string ATRB_DELETED = "ATRB_DELETED";


        ///<summary>
        /// ACTN_SID: 196
        /// SRT_ORD: 1600
        /// Calculate CAP MSP.
        ///</summary>
        public const string CALC_MSP = "CALC_MSP";


        ///<summary>
        /// ACTN_SID: 197
        /// SRT_ORD: 2200
        /// Used in snapshot, check the revision level of a deal.
        ///</summary>
        public const string CK_REV_LEVEL = "CK_REV_LEVEL";


        ///<summary>
        /// ACTN_SID: 198
        /// SRT_ORD: 100
        /// Execute items common to the deal save process for all deal types.
        ///</summary>
        public const string COMMON_DEAL_SAVE = "COMMON_DEAL_SAVE";


        ///<summary>
        /// ACTN_SID: 199
        /// SRT_ORD: 200
        /// Prevent multiple users are actioning same item at once.
        ///</summary>
        public const string CONCURRENCY_CHECK = "CONCURRENCY_CHECK";


        ///<summary>
        /// ACTN_SID: 200
        /// SRT_ORD: 2800
        /// Copy Full workbook with deals if customer same.
        ///</summary>
        public const string COPY_WB_FULL = "COPY_WB_FULL";


        ///<summary>
        /// ACTN_SID: 201
        /// SRT_ORD: 2500
        /// Copy any additional attributes that exist in source workbook to target.
        ///</summary>
        public const string COPY_WB_HEADER = "COPY_WB_HEADER";


        ///<summary>
        /// ACTN_SID: 202
        /// SRT_ORD: 2600
        /// Copy overlapping deals if customer the same.
        ///</summary>
        public const string COPY_WB_OVERLAP = "COPY_WB_OVERLAP";


        ///<summary>
        /// ACTN_SID: 203
        /// SRT_ORD: 2700
        /// Copy PRODUCTS - PLI data even if customer different.
        ///</summary>
        public const string COPY_WB_PROD = "COPY_WB_PROD";


        ///<summary>
        /// ACTN_SID: 204
        /// SRT_ORD: 700
        /// Action deal to approve.
        ///</summary>
        public const string DEAL_APPROVE = "DEAL_APPROVE";


        ///<summary>
        /// ACTN_SID: 205
        /// SRT_ORD: 900
        /// Action deal to cancel.
        ///</summary>
        public const string DEAL_CANCEL = "DEAL_CANCEL";


        ///<summary>
        /// ACTN_SID: 206
        /// SRT_ORD: 3100
        /// Message back to WIP Action Queue with new deal_sids change.
        ///</summary>
        public const string DEAL_CREATED = "DEAL_CREATED";


        ///<summary>
        /// ACTN_SID: 207
        /// SRT_ORD: 1000
        /// Action a deal like approve, reject, delete.
        ///</summary>
        public const string DEAL_DELETE = "DEAL_DELETE";


        ///<summary>
        /// ACTN_SID: 208
        /// SRT_ORD: 1100
        /// Action flag to indicate a deal, prep, PLI and/or group has been deleted.
        ///</summary>
        public const string DEAL_DELETED = "DEAL_DELETED";


        ///<summary>
        /// ACTN_SID: 209
        /// SRT_ORD: 800
        /// Action deal to reject.
        ///</summary>
        public const string DEAL_REJECT = "DEAL_REJECT";


        ///<summary>
        /// ACTN_SID: 210
        /// SRT_ORD: 1200
        /// Functionally "delete a deal with an active tracker number". Roll the deal details back to the last valid active tracker state.
        ///</summary>
        public const string DEAL_ROLLBACK_TO_ACTIVE = "DEAL_ROLLBACK_TO_ACTIVE";


        ///<summary>
        /// ACTN_SID: 211
        /// SRT_ORD: 1900
        /// Validate ECAP deals.
        ///</summary>
        public const string ECAP_VALIDATION = "ECAP_VALIDATION";


        ///<summary>
        /// ACTN_SID: 212
        /// SRT_ORD: 1400
        /// Generate a tracker number.
        ///</summary>
        public const string GEN_TRACKER = "GEN_TRACKER";


        ///<summary>
        /// ACTN_SID: 213
        /// SRT_ORD: 3200
        /// Message back to WIP Action Queue with deal_prep ID change.
        ///</summary>
        public const string ID_CHANGE = "ID_CHANGE";


        ///<summary>
        /// ACTN_SID: 214
        /// SRT_ORD: 300
        /// Merge existing deal details into WIP scheme.
        ///</summary>
        public const string LAYER = "LAYER";


        ///<summary>
        /// ACTN_SID: 215
        /// SRT_ORD: 3400
        /// Write a message to or from the WIP Action Queue.
        ///</summary>
        public const string MESSAGE = "MESSAGE";


        ///<summary>
        /// ACTN_SID: 216
        /// SRT_ORD: 1800
        /// Write a deal from DEAL_PREP.
        ///</summary>
        public const string PREP2DEAL = "PREP2DEAL";


        ///<summary>
        /// ACTN_SID: 217
        /// SRT_ORD: 2000
        /// Execute steps to process a quote letter.
        ///</summary>
        public const string PROCESS_QUOTE_LETTER = "PROCESS_QUOTE_LETTER";


        ///<summary>
        /// ACTN_SID: 218
        /// SRT_ORD: 2400
        /// Remove all deal details from WIP_ATRB and or WIP_ACTN.
        ///</summary>
        public const string PURGE_WIP = "PURGE_WIP";


        ///<summary>
        /// ACTN_SID: 219
        /// SRT_ORD: 3000
        /// Add quote letter to queue to be processed by batch job.
        ///</summary>
        public const string QUEUE_QUOTE_LETTER = "QUEUE_QUOTE_LETTER";


        ///<summary>
        /// ACTN_SID: 220
        /// SRT_ORD: 1700
        /// Execute code to support redeal action with sub-actions of ecap_split and non_ecap_split distinctions.
        ///</summary>
        public const string REDEAL = "REDEAL";


        ///<summary>
        /// ACTN_SID: 221
        /// SRT_ORD: 600
        /// Write a deal from WIP_ATRB to proper scheme.
        ///</summary>
        public const string SAVE = "SAVE";


        ///<summary>
        /// ACTN_SID: 222
        /// SRT_ORD: 2900
        /// Try to send the current quote letter immediately.
        ///</summary>
        public const string SEND_QUOTE_LETTER = "SEND_QUOTE_LETTER";


        ///<summary>
        /// ACTN_SID: 223
        /// SRT_ORD: 2100
        /// Either push to or pull from snapshot as needed; push to snapshot on deal save.
        ///</summary>
        public const string SNAPSHOT = "SNAPSHOT";


        ///<summary>
        /// ACTN_SID: 224
        /// SRT_ORD: 1300
        /// Update FSE, DIV, GEO approvers (by, date time, price, etc) for ECAP, Program, Vol Tier.
        ///</summary>
        public const string UPDATE_APPROVERS = "UPDATE_APPROVERS";


        ///<summary>
        /// ACTN_SID: 225
        /// SRT_ORD: 400
        /// See if the workbook is currently checked out. Result will be written to WIP_ACTN as a MESSAGE.
        ///</summary>
        public const string WB_CHECK = "WB_CHECK";


        ///<summary>
        /// ACTN_SID: 226
        /// SRT_ORD: 500
        /// Attempt to check out a workbook. Result will be written to WIP_ACTN as a MESSAGE.
        ///</summary>
        public const string WB_LOCK = "WB_LOCK";


        ///<summary>
        /// ACTN_SID: 227
        /// SRT_ORD: 2300
        /// Attempt to check in a workbook. Result will be written to WIP_ACTN as a MESSAGE.
        ///</summary>
        public const string WB_UNLOCK = "WB_UNLOCK";


        ///<summary>
        /// ACTN_SID: 228
        /// SRT_ORD: 1500
        /// Do a YCS2 overlap check.
        ///</summary>
        public const string YCS2_OVERLAP = "YCS2_OVERLAP";

    }
    public static class ToolConstantName
    {
        public const string C_C2A_ENABLED = "C_C2A_ENABLED";
        public const string C2A_NON_PROD_EMAIL_DIST = "C2A_NON_PROD_EMAIL_DIST";
        public const string CA_ENVIRONMENT = "CA_ENVIRONMENT";
        public const string CAN_SA_BYPASS_BACK_DATING = "CAN_SA_BYPASS_BACK_DATING";
        public const string CAP_MSP_Load_Completion_DT = "CAP_MSP_Load_Completion_DT";
        public const string CDMS_DB_VERSION = "CDMS_DB_VERSION";
        public const string CI_BUILD_END = "CI_BUILD_END";
        public const string CI_BUILD_START = "CI_BUILD_START";
        public const string CLIENT_CACHE = "CLIENT_CACHE";
        public const string CLIENT_DEBUG_MODE = "CLIENT_DEBUG_MODE";
        public const string COGNOS_BLOCKING_KILL_MINUTES = "COGNOS_BLOCKING_KILL_MINUTES";
        public const string COMMENTS = "COMMENTS";
        public const string COST_WB_DEACTIVATED_DATE = "COST_WB_DEACTIVATED_DATE";
        public const string COSTTEST_OVERRIDEFLAG_DQ_EMAIL = "COSTTEST_OVERRIDEFLAG_DQ_EMAIL";
        public const string CST_TST_DEAL_PRD_TYPE_SID = "CST_TST_DEAL_PRD_TYPE_SID";
        public const string CURRENT_TEST_ID = "CURRENT_TEST_ID";
        public const string CURRENT_UI_LOGGING_LEVEL = "CURRENT_UI_LOGGING_LEVEL";
        public const string CUST_DATA_WA = "CUST_DATA_WA";
        public const string DAYS_BACK = "DAYS_BACK";
        public const string DAYS_TO_EXPIRE = "DAYS_TO_EXPIRE";
        public const string DB_DEBUG = "DB_DEBUG";
        public const string DB_ERROR_CONTACT_EMAIL = "DB_ERROR_CONTACT_EMAIL";
        public const string DEAL_COMB_TYPE_EFFECTIVE_DATE = "DEAL_COMB_TYPE_EFFECTIVE_DATE";
        public const string DEALS = "DEALS";
        public const string DEALS_RETURNED_MAX = "DEALS_RETURNED_MAX";
        public const string DELETE_ME_DEAL_MODIFY_PR_1 = "DELETE_ME__DEAL_MODIFY_PR_1";
        public const string DELETE_ME_DEAL_MODIFY_PR_2 = "DELETE_ME__DEAL_MODIFY_PR_2";
        public const string DELETE_ME_DEAL_MODIFY_PR_3 = "DELETE_ME__DEAL_MODIFY_PR_3";
        public const string DELETE_ME_DEAL_MODIFY_PR_4 = "DELETE_ME__DEAL_MODIFY_PR_4";
        public const string DELETE_ME_DEAL_MODIFY_PR_5 = "DELETE_ME__DEAL_MODIFY_PR_5";
        public const string DELETE_ME_DEAL_MODIFY_PR_6 = "DELETE_ME__DEAL_MODIFY_PR_6";
        public const string DELETE_ME_DEAL_MODIFY_PR_7 = "DELETE_ME__DEAL_MODIFY_PR_7";
        public const string DELETE_ME_DEAL_NBR_MAPPING_PR_1 = "DELETE_ME__DEAL_NBR_MAPPING_PR_1";
        public const string DELETE_ME_DEAL_NBR_MAPPING_PR_2 = "DELETE_ME__DEAL_NBR_MAPPING_PR_2";
        public const string DELETE_ME_DOCKING_Custom = "DELETE_ME__DOCKING_Custom";
        public const string DELETE_ME_DOCKING_Default = "DELETE_ME__DOCKING_Default";
        public const string DELETE_ME_DOCKING_HighRes = "DELETE_ME__DOCKING_HighRes";
        public const string DELETE_ME_DOCKING_LowRes = "DELETE_ME__DOCKING_LowRes";
        public const string DELETE_ME_DOCKING_MediumRes = "DELETE_ME__DOCKING_MediumRes";
        public const string DELETE_ME_DOCKING_Properties = "DELETE_ME__DOCKING_Properties";
        public const string DELETE_ME_FILE_UPLOADER_FOLDER = "DELETE_ME__FILE_UPLOADER_FOLDER";
        public const string DELETE_ME_FILE_UPLOADER_PHYSICAL_FOLDER = "DELETE_ME__FILE_UPLOADER_PHYSICAL_FOLDER";
        public const string DELETE_ME_THRESHOLD_CAPLoadingError = "DELETE_ME__THRESHOLD_CAPLoadingError";
        public const string DELETE_ME_THRESHOLD_CAPLoadingWarning = "DELETE_ME__THRESHOLD_CAPLoadingWarning";
        public const string DELETE_ME_THRESHOLD_DB_RoundTrip = "DELETE_ME__THRESHOLD_DB_RoundTrip";
        public const string DELETE_ME_THRESHOLD_DealBasicActionError = "DELETE_ME__THRESHOLD_DealBasicActionError";
        public const string DELETE_ME_THRESHOLD_DealBasicActionWarning = "DELETE_ME__THRESHOLD_DealBasicActionWarning";
        public const string DELETE_ME_THRESHOLD_DealListLoadingError = "DELETE_ME__THRESHOLD_DealListLoadingError";
        public const string DELETE_ME_THRESHOLD_DealListLoadingMTDBError = "DELETE_ME__THRESHOLD_DealListLoadingMTDBError";
        public const string DELETE_ME_THRESHOLD_DealListLoadingMTDBWarning = "DELETE_ME__THRESHOLD_DealListLoadingMTDBWarning";
        public const string DELETE_ME_THRESHOLD_DealListLoadingWarning = "DELETE_ME__THRESHOLD_DealListLoadingWarning";
        public const string DELETE_ME_THRESHOLD_DealLoadError = "DELETE_ME__THRESHOLD_DealLoadError";
        public const string DELETE_ME_THRESHOLD_DealLoadWarning = "DELETE_ME__THRESHOLD_DealLoadWarning";
        public const string DELETE_ME_THRESHOLD_DealValidationError = "DELETE_ME__THRESHOLD_DealValidationError";
        public const string DELETE_ME_THRESHOLD_DealValidationWarning = "DELETE_ME__THRESHOLD_DealValidationWarning";
        public const string DELETE_ME_THRESHOLD_ECAPValidationError = "DELETE_ME__THRESHOLD_ECAPValidationError";
        public const string DELETE_ME_THRESHOLD_ECAPValidationMTDBError = "DELETE_ME__THRESHOLD_ECAPValidationMTDBError";
        public const string DELETE_ME_THRESHOLD_ECAPValidationMTDBWarning = "DELETE_ME__THRESHOLD_ECAPValidationMTDBWarning";
        public const string DELETE_ME_THRESHOLD_ECAPValidationWarning = "DELETE_ME__THRESHOLD_ECAPValidationWarning";
        public const string DELETE_ME_THRESHOLD_GapsInDealNbrs = "DELETE_ME__THRESHOLD_GapsInDealNbrs";
        public const string DELETE_ME_THRESHOLD_LoadingConstantsError = "DELETE_ME__THRESHOLD_LoadingConstantsError";
        public const string DELETE_ME_THRESHOLD_LoadingConstantsWarning = "DELETE_ME__THRESHOLD_LoadingConstantsWarning";
        public const string DELETE_ME_THRESHOLD_LoadingCustomersError = "DELETE_ME__THRESHOLD_LoadingCustomersError";
        public const string DELETE_ME_THRESHOLD_LoadingCustomersWarning = "DELETE_ME__THRESHOLD_LoadingCustomersWarning";
        public const string DELETE_ME_THRESHOLD_LoadingDealTypesError = "DELETE_ME__THRESHOLD_LoadingDealTypesError";
        public const string DELETE_ME_THRESHOLD_LoadingDealTypesWarning = "DELETE_ME__THRESHOLD_LoadingDealTypesWarning";
        public const string DELETE_ME_THRESHOLD_LoadingGeosError = "DELETE_ME__THRESHOLD_LoadingGeosError";
        public const string DELETE_ME_THRESHOLD_LoadingGeosWarning = "DELETE_ME__THRESHOLD_LoadingGeosWarning";
        public const string DELETE_ME_THRESHOLD_LoadingLookupDataError = "DELETE_ME__THRESHOLD_LoadingLookupDataError";
        public const string DELETE_ME_THRESHOLD_LoadingLookupDataWarning = "DELETE_ME__THRESHOLD_LoadingLookupDataWarning";
        public const string DELETE_ME_THRESHOLD_LoadingProductsError = "DELETE_ME__THRESHOLD_LoadingProductsError";
        public const string DELETE_ME_THRESHOLD_LoadingProductsWarning = "DELETE_ME__THRESHOLD_LoadingProductsWarning";
        public const string DELETE_ME_THRESHOLD_LoadingToolDataError = "DELETE_ME__THRESHOLD_LoadingToolDataError";
        public const string DELETE_ME_THRESHOLD_LoadingToolDataWarning = "DELETE_ME__THRESHOLD_LoadingToolDataWarning";
        public const string DELETE_ME_THRESHOLD_ProductAddedError = "DELETE_ME__THRESHOLD_ProductAddedError";
        public const string DELETE_ME_THRESHOLD_ProductAddedWarning = "DELETE_ME__THRESHOLD_ProductAddedWarning";
        public const string DELETE_ME_THRESHOLD_SaveError = "DELETE_ME__THRESHOLD_SaveError";
        public const string DELETE_ME_THRESHOLD_SaveMTDBError = "DELETE_ME__THRESHOLD_SaveMTDBError";
        public const string DELETE_ME_THRESHOLD_SaveMTDBWarning = "DELETE_ME__THRESHOLD_SaveMTDBWarning";
        public const string DELETE_ME_THRESHOLD_SaveWarning = "DELETE_ME__THRESHOLD_SaveWarning";
        public const string DELETE_ME_THRESHOLD_TabSwitchingError = "DELETE_ME__THRESHOLD_TabSwitchingError";
        public const string DELETE_ME_THRESHOLD_TabSwitchingWarning = "DELETE_ME__THRESHOLD_TabSwitchingWarning";
        public const string DELETE_ME_THRESHOLD_WorkflowError = "DELETE_ME__THRESHOLD_WorkflowError";
        public const string DELETE_ME_THRESHOLD_WorkflowMTDBError = "DELETE_ME__THRESHOLD_WorkflowMTDBError";
        public const string DELETE_ME_THRESHOLD_WorkflowMTDBWarning = "DELETE_ME__THRESHOLD_WorkflowMTDBWarning";
        public const string DELETE_ME_THRESHOLD_WorkflowWarning = "DELETE_ME__THRESHOLD_WorkflowWarning";
        public const string DIE_SIZE_EXECUTION_DAYS = "DIE_SIZE_EXECUTION_DAYS";
        public const string EIA_DIV_NM = "EIA_DIV_NM";
        public const string EMP_CHG_THRESHOLD = "EMP_CHG_THRESHOLD";
        public const string Enter_Constant_Name = "Enter Constant Name";
        public const string FUTURE_SKU_NON_PROD_EMAIL_DIST = "FUTURE_SKU_NON_PROD_EMAIL_DIST";
        public const string FUTURE_SKU_PROD_EMAIL_DIST = "FUTURE_SKU_PROD_EMAIL_DIST";
        public const string HACK_BAD_PLI_GUID_WB_ID = "HACK_BAD_PLI_GUID_WB_ID";
        public const string HACK_SET_DEAL_CHANGED_NOW = "HACK_SET_DEAL_CHANGED_NOW";
        public const string HACK_TO_SNAPSHOT_DEAL_ATRB_SIDS = "HACK_TO_SNAPSHOT_DEAL_ATRB_SIDS";
        public const string HEARTBEAT_ERROR_LEVEL = "HEARTBEAT_ERROR_LEVEL";
        public const string HEARTBEAT_INTERVAL = "HEARTBEAT_INTERVAL";
        public const string HEARTBEAT_WARN_LEVEL = "HEARTBEAT_WARN_LEVEL";
        public const string ICOST_ERROR_CONTACTS = "ICOST_ERROR_CONTACTS";
        public const string ICOST_ERROR_LOG_DAYS = "ICOST_ERROR_LOG_DAYS";
        public const string ICOST_HIST_LOG_DAYS = "ICOST_HIST_LOG_DAYS";
        public const string iCOST_PRODUCTS = "iCOST_PRODUCTS";
        public const string IDMS_UI_Run_Level = "IDMS_UI_Run_Level";
        public const string JMSQ_ERROR_REPORT_DAYS_BACK = "JMSQ_ERROR_REPORT_DAYS_BACK";
        public const string JMSQ_PROCESS_TIMEOUT = "JMSQ_PROCESS_TIMEOUT";
        public const string LINEUP_ATRB_EXCL_LIST = "LINEUP_ATRB_EXCL_LIST";
        public const string LINEUP_BAB_IMPORT_YYWW = "LINEUP_BAB_IMPORT_YYWW";
        public const string LINEUP_COST_TEST_PRD_MODE_1 = "LINEUP_COST_TEST_PRD_MODE_1";
        public const string LINEUP_COST_TEST_PRD_MODE_2 = "LINEUP_COST_TEST_PRD_MODE_2";
        public const string LINEUP_COST_TEST_ROLES = "LINEUP_COST_TEST_ROLES";
        public const string LINEUP_ODM_MODEL_CUST_NM = "LINEUP_ODM_MODEL_CUST_NM";
        public const string LINEUP_STG_EXPIRE_EXCL = "LINEUP_STG_EXPIRE_EXCL";
        public const string LOCK_OUT_OVERRIDE_USERS = "LOCK_OUT_OVERRIDE_USERS";
        public const string LOCKED_OUT_ROLES = "LOCKED_OUT_ROLES";
        public const string LU_WF_Verticals = "LU_WF_Verticals";
        public const string MAX_PRE_DCS_DEAL_SID = "MAX_PRE_DCS_DEAL_SID";
        public const string MISC_MM_LIST = "MISC_MM_LIST";
        public const string NASP_PTL_Deal_Dtl_Load_St_Dt = "NASP_PTL_Deal_Dtl_Load_St_Dt";
        public const string NETASP_CUST_FLTR = "NETASP_CUST_FLTR";
        public const string NETWORK_HEARTBEAT_ERROR_LEVEL = "NETWORK_HEARTBEAT_ERROR_LEVEL";
        public const string NETWORK_HEARTBEAT_INTERVAL = "NETWORK_HEARTBEAT_INTERVAL";
        public const string NETWORK_HEARTBEAT_WARN_LEVEL = "NETWORK_HEARTBEAT_WARN_LEVEL";
        public const string NON_PROD_EMAIL_DIST = "NON_PROD_EMAIL_DIST";
        public const string PDL_CAP_MSP_CUT_OFF_DATE = "PDL_CAP_MSP_CUT_OFF_DATE";
        public const string PDL_CAP_MSP_CUTOFF_DAYS_DM_BATCH = "PDL_CAP_MSP_CUTOFF_DAYS_DM_BATCH";
        public const string PIC_ENVIRONMENT = "PIC_ENVIRONMENT";
        public const string PLI_ROLLBACK_ATRB_LIST = "PLI_ROLLBACK_ATRB_LIST";
        public const string PR_CDMS_DROP_OBJ_KEY = "PR_CDMS_DROP_OBJ_KEY";
        public const string PR_CDMS_UPD_CAP_MSP_DOWNSTREAM_OMIT_DEALS = "PR_CDMS_UPD_CAP_MSP_DOWNSTREAM__OMIT_DEALS";
        public const string PR_DUPE_ATRB_FIX_SECTIONS = "PR_DUPE_ATRB_FIX_SECTIONS";
        public const string PRD_INACTIVE_UPD_DT = "PRD_INACTIVE_UPD_DT";
        public const string RBFC_DSS_CUST_DMD_POST_QTR = "RBFC_DSS_CUST_DMD_POST_QTR";
        public const string RBFC_DSS_CUST_DMD_PRE_QTR = "RBFC_DSS_CUST_DMD_PRE_QTR";
        public const string RBFC_DSS_POST_QTR = "RBFC_DSS_POST_QTR";
        public const string RBFC_DSS_PRE_QTR = "RBFC_DSS_PRE_QTR";
        public const string SAP_JMS_PROD_EMAIL_DIST = "SAP_JMS_PROD_EMAIL_DIST";
        public const string SQLAGENTJOBS_EnableDisable = "SQLAGENTJOBS_EnableDisable";
        public const string TCD_RELEASE_DATE = "TCD_RELEASE_DATE";
        public const string TESTHARNESS_DEAL_LIST = "TESTHARNESS_DEAL_LIST";
        public const string TRKR_GEN_CUTOFF = "TRKR_GEN_CUTOFF";
        public const string TRUNCATE_STAGE_PRESERVATION_WINDOW = "TRUNCATE_STAGE_PRESERVATION_WINDOW";
        public const string UI_Developers_List = "UI_Developers_List";
        public const string UI_SUPER_ADMINISTRATOR_LIST = "UI_SUPER_ADMINISTRATOR_LIST";
        public const string UI_Testers_List = "UI_Testers_List";
        public const string VALUE = "VALUE";
        public const string VW_CDMS_DQ_DEAL_MISSING_PRD_EXCL_DEAL = "VW_CDMS_DQ_DEAL_MISSING_PRD_EXCL_DEAL";
        public const string VW_DQ_MISSING_DL_TRKR_NBRS_IGNORE_DEALS = "VW_DQ_MISSING_DL_TRKR_NBRS__IGNORE_DEALS";
        public const string WBID_DELETE_BLANK_PLIROW_ONLOAD = "WBID_DELETE_BLANK_PLIROW_ONLOAD";
        public const string WORKBOOK_SETTINGS = "WORKBOOK_SETTINGS";
    }

    //-------------------------------------------------------------------------------------------

    namespace DCSAtrbLookup
    {

        ///<summary>
        /// ATRB_SID: 3004
        ///</summary>
        public static class DEAL_TYPE_CD_SID_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ALL_DEALS = @"All Deals";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string ASP_TIER = @"ASP TIER";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string CAP_BAND = @"CAP BAND";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string DEAL_GRP = @"DEAL_GRP";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string ECAP = @"ECAP";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string PLI = @"PLI";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string PROGRAM = @"PROGRAM";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string VOL_TIER = @"VOL TIER";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All Deals", @"ASP TIER", @"CAP BAND", @"DEAL_GRP", @"ECAP", @"PLI", @"PROGRAM", @"VOL TIER" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"All Deals"},
                {2, @"ASP TIER"},
                {7, @"CAP BAND"},
                {6, @"DEAL_GRP"},
                {3, @"ECAP"},
                {8, @"PLI"},
                {4, @"PROGRAM"},
                {5, @"VOL TIER"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 3628
        ///</summary>
        public static class RPU_CALC_TYPE_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string SPIFF = @"SPIFF";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string VIP = @"VIP";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"SPIFF", @"VIP" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"SPIFF"},
                {2, @"VIP"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 3632
        ///</summary>
        public static class PLI_CAP_TYPE_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string BUY_THROUGH_ODM = @"Buy through ODM";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Buy through ODM" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"Buy through ODM"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5001
        ///</summary>
        public static class SEG_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string ALL = @"All";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string BLENDED = @"Blended";
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string COMMUNICATIONS = @"Communications";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string CONSUMER = @"Consumer";
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string CONSUMER_ELECTRONICS_SPD = @"Consumer Electronics(SPD)";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CONSUMER_NO_PULL = @"Consumer No Pull";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string CONSUMER_RETAIL_PULL = @"Consumer Retail Pull";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string CORP = @"Corp";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string EDUCATION = @"Education";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string EMBEDDED = @"Embedded";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string GOVERNMENT = @"Government";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string RETAIL = @"Retail";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string SMB = @"SMB";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string STORAGE = @"Storage";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All", @"Blended", @"Communications", @"Consumer", @"Consumer Electronics(SPD)", @"Consumer No Pull", @"Consumer Retail Pull", @"Corp", @"Education", @"Embedded", @"Government", @"LAD", @"Retail", @"SMB", @"Storage" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {10, @"All"},
                {9, @"Blended"},
                {15, @"Communications"},
                {2, @"Consumer"},
                {16, @"Consumer Electronics(SPD)"},
                {12, @"Consumer No Pull"},
                {13, @"Consumer Retail Pull"},
                {3, @"Corp"},
                {8, @"Education"},
                {6, @"Embedded"},
                {7, @"Government"},
                {11, @"LAD"},
                {4, @"Retail"},
                {5, @"SMB"},
                {14, @"Storage"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5002
        ///</summary>
        public static class GEO_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string APAC = @"APAC";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string ASMO = @"ASMO";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string EMEA = @"EMEA";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string IJKK = @"IJKK";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string PRC = @"PRC";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string WORLDWIDE = @"Worldwide";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"APAC", @"ASMO", @"EMEA", @"IJKK", @"Other", @"PRC", @"Worldwide" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7, @"APAC"},
                {6, @"ASMO"},
                {5, @"EMEA"},
                {2, @"IJKK"},
                {3, @"Other"},
                {4, @"PRC"},
                {1, @"Worldwide"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5003
        ///</summary>
        public static class PRD_BUCKT_SID_VAL
        {
            ///<summary>
            /// ID: -1
            ///</summary>
            public const string KIT = @"KIT";
            ///<summary>
            /// ID: 0
            ///</summary>
            public const string PRIMARY = @"Primary";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string SECONDARY1 = @"Secondary1";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string SECONDARY2 = @"Secondary2";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string SECONDARY3 = @"Secondary3";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string SECONDARY4 = @"Secondary4";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"KIT", @"Primary", @"Secondary1", @"Secondary2", @"Secondary3", @"Secondary4" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {-1, @"KIT"},
                {0, @"Primary"},
                {1, @"Secondary1"},
                {2, @"Secondary2"},
                {3, @"Secondary3"},
                {4, @"Secondary4"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5004
        ///</summary>
        public static class PGM_TYPE_SID_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string CHAMP = @"CHAMP";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string DEBIT_MEMO = @"Debit Memo";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ECAP_ADJ = @"ECAP Adj";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MCP = @"MCP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string MDF = @"MDF";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string NRE = @"NRE";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string SEED = @"SEED";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string TENDER = @"Tender";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"CHAMP", @"Debit Memo", @"ECAP Adj", @"MCP", @"MDF", @"NRE", @"Other", @"SEED", @"Tender" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"CHAMP"},
                {2, @"Debit Memo"},
                {1, @"ECAP Adj"},
                {8, @"MCP"},
                {4, @"MDF"},
                {5, @"NRE"},
                {3, @"Other"},
                {7, @"SEED"},
                {6, @"Tender"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5006
        ///</summary>
        public static class PRD_ATRB_SID_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ALL_PRODUCT_ATTRIBUTES = @"All Product Attributes";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string CORE = @"Core";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string DP = @"DP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string DT = @"DT";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string IPF = @"IPF";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string LCIA = @"LCIA";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string LPIA = @"LPIA";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MB = @"Mb";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string MP = @"MP";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string SVRWS = @"SvrWS";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string UP = @"UP";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"All Product Attributes", @"Core", @"DP", @"DT", @"IPF", @"LCIA", @"LPIA", @"Mb", @"MP", @"SvrWS", @"UP" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"All Product Attributes"},
                {2, @"Core"},
                {3, @"DP"},
                {4, @"DT"},
                {5, @"IPF"},
                {6, @"LCIA"},
                {7, @"LPIA"},
                {8, @"Mb"},
                {9, @"MP"},
                {10, @"SvrWS"},
                {11, @"UP"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 5007
        ///</summary>
        public static class EMB_SEG_MBR_SID_VAL
        {
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string DSS = @"DSS";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string EBM_EMBEDDED_BOARD_MANUFACTURER = @"EBM (Embedded Board Manufacturer)";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string ENERGY = @"Energy";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string GAMING = @"Gaming";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string INDUSTRIAL = @"Industrial";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string MAG_MILITARY_AEROSPACE_GOVT = @"MAG (Military Aerospace Govt)";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string MEDIA_PHONES = @"Media Phones";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string MEDICAL = @"Medical";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string PRINT_IMAGING = @"Print Imaging";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string THIN_CLIENT = @"Thin Client";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string TRANSACTIONAL_RETAIL = @"Transactional Retail";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string TRANSPORTATION = @"Transportation";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string VISUAL_RETAIL = @"Visual Retail";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"DSS", @"EBM (Embedded Board Manufacturer)", @"Energy", @"Gaming", @"Industrial", @"MAG (Military Aerospace Govt)", @"Media Phones", @"Medical", @"Other", @"Print Imaging", @"Thin Client", @"Transactional Retail", @"Transportation", @"Visual Retail" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {8, @"DSS"},
                {10, @"EBM (Embedded Board Manufacturer)"},
                {13, @"Energy"},
                {2, @"Gaming"},
                {3, @"Industrial"},
                {6, @"MAG (Military Aerospace Govt)"},
                {11, @"Media Phones"},
                {5, @"Medical"},
                {14, @"Other"},
                {1, @"Print Imaging"},
                {12, @"Thin Client"},
                {7, @"Transactional Retail"},
                {4, @"Transportation"},
                {9, @"Visual Retail"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 7002
        ///</summary>
        public static class DEAL_PRD_TYPE_VAL
        {
            ///<summary>
            /// ID: 7516
            ///</summary>
            public const string CABLE_MODEM = @"Cable Modem";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string CPU = @"CPU";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string CS = @"CS";
            ///<summary>
            /// ID: 7505
            ///</summary>
            public const string DHG_SPD = @"DHG/SPD";
            ///<summary>
            /// ID: 7508
            ///</summary>
            public const string ECG = @"ECG";
            ///<summary>
            /// ID: 7504
            ///</summary>
            public const string ECPD_EMD = @"ECPD EMD";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string EIA_CPU = @"EIA CPU";
            ///<summary>
            /// ID: 7502
            ///</summary>
            public const string EIA_CS = @"EIA CS";
            ///<summary>
            /// ID: 7503
            ///</summary>
            public const string EIA_MISC = @"EIA MISC";
            ///<summary>
            /// ID: 7500
            ///</summary>
            public const string EPSD = @"EPSD";
            ///<summary>
            /// ID: 7509
            ///</summary>
            public const string FMG = @"FMG";
            ///<summary>
            /// ID: 7514
            ///</summary>
            public const string IA_SW_SERVICE = @"IA SW/Service";
            ///<summary>
            /// ID: 7511
            ///</summary>
            public const string IMC = @"IMC";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 7517
            ///</summary>
            public const string LOM = @"LOM";
            ///<summary>
            /// ID: 7507
            ///</summary>
            public const string NAND = @"NAND";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string NAND_SSD = @"NAND (SSD)";
            ///<summary>
            /// ID: 7518
            ///</summary>
            public const string NIC = @"NIC";
            ///<summary>
            /// ID: 7510
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7506
            ///</summary>
            public const string PCG_MISC = @"PCG MISC";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string PLATFORM_KIT = @"PLATFORM_KIT";
            ///<summary>
            /// ID: 7512
            ///</summary>
            public const string SMART_PHONE = @"SMART PHONE";
            ///<summary>
            /// ID: 7513
            ///</summary>
            public const string TCD = @"TCD";
            ///<summary>
            /// ID: 7501
            ///</summary>
            public const string UPSD = @"UPSD";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string WC = @"WC";
            ///<summary>
            /// ID: 7515
            ///</summary>
            public const string WORLD_AHEAD = @"World Ahead";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Cable Modem", @"CPU", @"CS", @"DHG/SPD", @"ECG", @"ECPD EMD", @"EIA CPU", @"EIA CS", @"EIA MISC", @"EPSD", @"FMG", @"IA SW/Service", @"IMC", @"LAD", @"LOM", @"NAND", @"NAND (SSD)", @"NIC", @"Other", @"PCG MISC", @"PLATFORM_KIT", @"SMART PHONE", @"TCD", @"UPSD", @"WC", @"World Ahead" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7516, @"Cable Modem"},
                {3, @"CPU"},
                {4, @"CS"},
                {7505, @"DHG/SPD"},
                {7508, @"ECG"},
                {7504, @"ECPD EMD"},
                {5, @"EIA CPU"},
                {7502, @"EIA CS"},
                {7503, @"EIA MISC"},
                {7500, @"EPSD"},
                {7509, @"FMG"},
                {7514, @"IA SW/Service"},
                {7511, @"IMC"},
                {6, @"LAD"},
                {7517, @"LOM"},
                {7507, @"NAND"},
                {7, @"NAND (SSD)"},
                {7518, @"NIC"},
                {7510, @"Other"},
                {7506, @"PCG MISC"},
                {2, @"PLATFORM_KIT"},
                {7512, @"SMART PHONE"},
                {7513, @"TCD"},
                {7501, @"UPSD"},
                {8, @"WC"},
                {7515, @"World Ahead"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 7003
        ///</summary>
        public static class PRD_CATGRY_NM_VAL
        {
            ///<summary>
            /// ID: 7616
            ///</summary>
            public const string CABLE_MODEM = @"Cable Modem";
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CS = @"CS";
            ///<summary>
            /// ID: 7605
            ///</summary>
            public const string DHG_SPD = @"DHG/SPD";
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string DT = @"DT";
            ///<summary>
            /// ID: 7608
            ///</summary>
            public const string ECG = @"ECG";
            ///<summary>
            /// ID: 7604
            ///</summary>
            public const string ECPD_EMD = @"ECPD EMD";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string EIA_CPU = @"EIA CPU";
            ///<summary>
            /// ID: 7602
            ///</summary>
            public const string EIA_CS = @"EIA CS";
            ///<summary>
            /// ID: 7603
            ///</summary>
            public const string EIA_MISC = @"EIA MISC";
            ///<summary>
            /// ID: 7600
            ///</summary>
            public const string EPSD = @"EPSD";
            ///<summary>
            /// ID: 7609
            ///</summary>
            public const string FMG = @"FMG";
            ///<summary>
            /// ID: 7614
            ///</summary>
            public const string IA_SW_SERVICE = @"IA SW/Service";
            ///<summary>
            /// ID: 7611
            ///</summary>
            public const string IMC = @"IMC";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string LAD = @"LAD";
            ///<summary>
            /// ID: 7617
            ///</summary>
            public const string LOM = @"LOM";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string MB = @"Mb";
            ///<summary>
            /// ID: 7607
            ///</summary>
            public const string NAND = @"NAND";
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string NAND_SSD = @"NAND (SSD)";
            ///<summary>
            /// ID: 7618
            ///</summary>
            public const string NIC = @"NIC";
            ///<summary>
            /// ID: 7610
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7606
            ///</summary>
            public const string PCG_MISC = @"PCG MISC";
            ///<summary>
            /// ID: 7612
            ///</summary>
            public const string SMART_PHONE = @"SMART PHONE";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string SVRWS = @"SvrWS";
            ///<summary>
            /// ID: 7613
            ///</summary>
            public const string TCD = @"TCD";
            ///<summary>
            /// ID: 7601
            ///</summary>
            public const string UPSD = @"UPSD";
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string WC = @"WC";
            ///<summary>
            /// ID: 7615
            ///</summary>
            public const string WORLD_AHEAD = @"World Ahead";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Cable Modem", @"CS", @"DHG/SPD", @"DT", @"ECG", @"ECPD EMD", @"EIA CPU", @"EIA CS", @"EIA MISC", @"EPSD", @"FMG", @"IA SW/Service", @"IMC", @"LAD", @"LOM", @"Mb", @"NAND", @"NAND (SSD)", @"NIC", @"Other", @"PCG MISC", @"SMART PHONE", @"SvrWS", @"TCD", @"UPSD", @"WC", @"World Ahead" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {7616, @"Cable Modem"},
                {12, @"CS"},
                {7605, @"DHG/SPD"},
                {9, @"DT"},
                {7608, @"ECG"},
                {7604, @"ECPD EMD"},
                {13, @"EIA CPU"},
                {7602, @"EIA CS"},
                {7603, @"EIA MISC"},
                {7600, @"EPSD"},
                {7609, @"FMG"},
                {7614, @"IA SW/Service"},
                {7611, @"IMC"},
                {14, @"LAD"},
                {7617, @"LOM"},
                {10, @"Mb"},
                {7607, @"NAND"},
                {15, @"NAND (SSD)"},
                {7618, @"NIC"},
                {7610, @"Other"},
                {7606, @"PCG MISC"},
                {7612, @"SMART PHONE"},
                {11, @"SvrWS"},
                {7613, @"TCD"},
                {7601, @"UPSD"},
                {16, @"WC"},
                {7615, @"World Ahead"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99001
        ///</summary>
        public static class ROLE_TIER_CD_VAL
        {
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string TIER_0 = @"Tier_0";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string TIER_1 = @"Tier_1";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string TIER_2 = @"Tier_2";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string TIER_3 = @"Tier_3";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string TIER_4 = @"Tier_4";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Tier_0", @"Tier_1", @"Tier_2", @"Tier_3", @"Tier_4" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {1, @"Tier_0"},
                {2, @"Tier_1"},
                {3, @"Tier_2"},
                {4, @"Tier_3"},
                {5, @"Tier_4"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99002
        ///</summary>
        public static class WFSTG_ACTN_CD_VAL
        {
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string APPROVE = @"Approve";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string CANCEL = @"Cancel";
            ///<summary>
            /// ID: 45
            ///</summary>
            public const string FAST_TRACK = @"Fast Track";
            ///<summary>
            /// ID: 46
            ///</summary>
            public const string REDEAL = @"Redeal";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string REJECT = @"Reject";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Approve", @"Cancel", @"Fast Track", @"Redeal", @"Reject" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {6, @"Approve"},
                {7, @"Cancel"},
                {45, @"Fast Track"},
                {46, @"Redeal"},
                {8, @"Reject"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99004
        ///</summary>
        public static class WFSTG_LOC_CD_LKUP_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string LEFT = @"Left";
            ///<summary>
            /// ID: 10
            ///</summary>
            public const string RIGHT = @"Right";
            ///<summary>
            /// ID: 11
            ///</summary>
            public const string TOP = @"Top";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Left", @"Right", @"Top" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"Left"},
                {10, @"Right"},
                {11, @"Top"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99005
        ///</summary>
        public static class WFSTG_STS_CD_LKUP_VAL
        {
            ///<summary>
            /// ID: 12
            ///</summary>
            public const string CLOSED = @"Closed";
            ///<summary>
            /// ID: 13
            ///</summary>
            public const string OPEN = @"Open";
            ///<summary>
            /// ID: 14
            ///</summary>
            public const string PENDING = @"Pending";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Closed", @"Open", @"Pending" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {12, @"Closed"},
                {13, @"Open"},
                {14, @"Pending"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99006
        ///</summary>
        public static class WF_NAME_VAL
        {
            ///<summary>
            /// ID: 15
            ///</summary>
            public const string GENERAL_WF = @"General WF";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"General WF" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {15, @"General WF"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99007
        ///</summary>
        public static class ACTN_CATGRY_CD_VAL
        {
            ///<summary>
            /// ID: 16
            ///</summary>
            public const string ACCOUNT = @"Account";
            ///<summary>
            /// ID: 17
            ///</summary>
            public const string ADMIN = @"Admin";
            ///<summary>
            /// ID: 18
            ///</summary>
            public const string ATTRIBUTE = @"Attribute";
            ///<summary>
            /// ID: 19
            ///</summary>
            public const string DEAL = @"Deal";
            ///<summary>
            /// ID: 20
            ///</summary>
            public const string MENU = @"Menu";
            ///<summary>
            /// ID: 21
            ///</summary>
            public const string SYSTEM = @"System";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Account", @"Admin", @"Attribute", @"Deal", @"Menu", @"System" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {16, @"Account"},
                {17, @"Admin"},
                {18, @"Attribute"},
                {19, @"Deal"},
                {20, @"Menu"},
                {21, @"System"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99008
        ///</summary>
        public static class PGM_TYPE_LKUP_VAL
        {
            ///<summary>
            /// ID: 9
            ///</summary>
            public const string CHAMP = @"CHAMP";
            ///<summary>
            /// ID: 2
            ///</summary>
            public const string DEBIT_MEMO = @"Debit Memo";
            ///<summary>
            /// ID: 1
            ///</summary>
            public const string ECAP_ADJ = @"ECAP Adj";
            ///<summary>
            /// ID: 8
            ///</summary>
            public const string MCP = @"MCP";
            ///<summary>
            /// ID: 4
            ///</summary>
            public const string MDF = @"MDF";
            ///<summary>
            /// ID: 5
            ///</summary>
            public const string NRE = @"NRE";
            ///<summary>
            /// ID: 3
            ///</summary>
            public const string OTHER = @"Other";
            ///<summary>
            /// ID: 7
            ///</summary>
            public const string SEED = @"SEED";
            ///<summary>
            /// ID: 6
            ///</summary>
            public const string TENDER = @"Tender";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"CHAMP", @"Debit Memo", @"ECAP Adj", @"MCP", @"MDF", @"NRE", @"Other", @"SEED", @"Tender" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {9, @"CHAMP"},
                {2, @"Debit Memo"},
                {1, @"ECAP Adj"},
                {8, @"MCP"},
                {4, @"MDF"},
                {5, @"NRE"},
                {3, @"Other"},
                {7, @"SEED"},
                {6, @"Tender"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99009
        ///</summary>
        public static class ATRB_SCTN_LKUP_VAL
        {
            ///<summary>
            /// ID: 50
            ///</summary>
            public const string C2A_DATA = @"C2A Data";
            ///<summary>
            /// ID: 40
            ///</summary>
            public const string COMMENTS = @"COMMENTS";
            ///<summary>
            /// ID: 41
            ///</summary>
            public const string FILE_ATTCH = @"FILE_ATTCH";
            ///<summary>
            /// ID: 51
            ///</summary>
            public const string INVISIBLE = @"INVISIBLE";
            ///<summary>
            /// ID: 30
            ///</summary>
            public const string LEGAL_FOLDER = @"LEGAL_FOLDER";
            ///<summary>
            /// ID: 31
            ///</summary>
            public const string LINE_ITM = @"LINE_ITM";
            ///<summary>
            /// ID: 32
            ///</summary>
            public const string OVERLAPPING_DEALS = @"OVERLAPPING_DEALS";
            ///<summary>
            /// ID: 42
            ///</summary>
            public const string QUESTION = @"QUESTION";
            ///<summary>
            /// ID: 33
            ///</summary>
            public const string REB_BMT_APPROVED = @"REB_BMT_APPROVED";
            ///<summary>
            /// ID: 34
            ///</summary>
            public const string REB_COMMENTS_ATTACHMENTS = @"REB_COMMENTS_ATTACHMENTS";
            ///<summary>
            /// ID: 35
            ///</summary>
            public const string REB_COMPETITIVE = @"REB_COMPETITIVE";
            ///<summary>
            /// ID: 36
            ///</summary>
            public const string REB_GEN = @"REB_GEN";
            ///<summary>
            /// ID: 37
            ///</summary>
            public const string REB_MMBP_APPROVED = @"REB_MMBP_APPROVED";
            ///<summary>
            /// ID: 43
            ///</summary>
            public const string REB_PAYMENTS = @"REB_PAYMENTS";
            ///<summary>
            /// ID: 44
            ///</summary>
            public const string REB_PNL_SPLIT = @"REB_PNL_SPLIT";
            ///<summary>
            /// ID: 38
            ///</summary>
            public const string REB_TRGT_REG = @"REB_TRGT_REG";
            ///<summary>
            /// ID: 39
            ///</summary>
            public const string SCHD = @"SCHD";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"C2A Data", @"COMMENTS", @"FILE_ATTCH", @"INVISIBLE", @"LEGAL_FOLDER", @"LINE_ITM", @"OVERLAPPING_DEALS", @"QUESTION", @"REB_BMT_APPROVED", @"REB_COMMENTS_ATTACHMENTS", @"REB_COMPETITIVE", @"REB_GEN", @"REB_MMBP_APPROVED", @"REB_PAYMENTS", @"REB_PNL_SPLIT", @"REB_TRGT_REG", @"SCHD" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {50, @"C2A Data"},
                {40, @"COMMENTS"},
                {41, @"FILE_ATTCH"},
                {51, @"INVISIBLE"},
                {30, @"LEGAL_FOLDER"},
                {31, @"LINE_ITM"},
                {32, @"OVERLAPPING_DEALS"},
                {42, @"QUESTION"},
                {33, @"REB_BMT_APPROVED"},
                {34, @"REB_COMMENTS_ATTACHMENTS"},
                {35, @"REB_COMPETITIVE"},
                {36, @"REB_GEN"},
                {37, @"REB_MMBP_APPROVED"},
                {43, @"REB_PAYMENTS"},
                {44, @"REB_PNL_SPLIT"},
                {38, @"REB_TRGT_REG"},
                {39, @"SCHD"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99013
        ///</summary>
        public static class NAND_SSD_QSTN_VAL
        {
            ///<summary>
            /// ID: 86
            ///</summary>
            public const string CLIENT = @"Client";
            ///<summary>
            /// ID: 87
            ///</summary>
            public const string DATA_CENTER = @"Data Center";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Client", @"Data Center" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {86, @"Client"},
                {87, @"Data Center"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }

        ///<summary>
        /// ATRB_SID: 99014
        ///</summary>
        public static class MEET_COMP_PRICE_QSTN_DDWN_VAL
        {
            ///<summary>
            /// ID: 89
            ///</summary>
            public const string PRICE_PERFORMANCE = @"Price / Performance";
            ///<summary>
            /// ID: 88
            ///</summary>
            public const string PRICE_ONLY = @"Price Only";

            ///<summary>
            /// All values associated with this lookup
            ///</summary>
            public static readonly string[] Values = { @"Price / Performance", @"Price Only" };

            ///<summary>
            /// Keyed values associated with the lookup
            ///</summary>
            public static readonly Dictionary<int, string> Dict = new Dictionary<int, string>(){
                {89, @"Price / Performance"},
                {88, @"Price Only"}
            };

            ///<summary>
            /// Try to get named value from an ID, or String.Empty on error
            ///</summary>
            public static string TryGetValue(int id)
            {
                string ret;
                if (Dict.TryGetValue(id, out ret))
                {
                    return ret;
                }
                return String.Empty;
            }

            ///<summary>
            /// Try to get and ID from a name (case insensitive), or null on error.
            ///</summary>
            public static int? TryGetId(string value)
            {
                var v = value.Trim().ToLower();
                foreach (var kvp in Dict.Where(itm => itm.Value.Trim().ToLower() == v))
                {
                    return kvp.Key;
                }
                return null;
            }

        }
    }

    //-------------------------------------------------------------------------------------------




    public partial class MyDealsAttribute
    {


        [DataMember]
        public Int16 DIM_SID { set; get; }

        [DataMember]
        public Int32 ATRB_SID { set; get; }

        [DataMember]
        public String DIM_CD { set; get; }

        [DataMember]
        public String ATRB_CD { set; get; }

        [DataMember]
        public String DATA_TYPE_CD { set; get; }

        [DataMember]
        public String UI_TYPE_CD { set; get; }

        [DataMember]
        public String ATRB_DESC { set; get; }

        [DataMember]
        public String ATRB_LBL { set; get; }

        [DataMember]
        public String DOT_NET_DATA_TYPE { set; get; }

        [DataMember]
        public String TGT_COL_TYPE { set; get; }

        [DataMember]
        public String FMT_MSK { set; get; }

        [DataMember]
        public Int32 ATRB_SRT_ORD { set; get; }

        [DataMember]
        public Int32 ATRB_MAX_LEN { set; get; }

        [DataMember]
        public Boolean IS_FACT { set; get; }

        [DataMember]
        public Int32 PVT_MSK { set; get; }

        [DataMember]
        public Boolean ACTV_IND { set; get; }
    }
    public class DcsAttributeHelper
    {
        private struct PVT_MSK_CONST
        {
            public const int tdeal_PRD_LINE_AGRMNT_ATRB_PVT = 1;
            public const int tdeal_DEAL_PREP_ATRB_PVT = 2;
            public const int tdeal_DEAL_ATRB_PVT = 4;
            public const int tdeal_DEAL_ATRB_PVT_SNAPSHOT = 8;
            public const int tdeal_DEAL_ATRB_PVT_ARCHV = 16;
            public const int tdeal_DEAL_ATRB_MTX = 64;
        };
        public static readonly Dictionary<int, string> ATTRIBUTE_PIVOT_MASK_MAP = new Dictionary<int, string>
        {
            {PVT_MSK_CONST.tdeal_PRD_LINE_AGRMNT_ATRB_PVT,"tdeal_PRD_LINE_AGRMNT_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_PREP_ATRB_PVT,"tdeal_DEAL_PREP_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT,"tdeal_DEAL_ATRB_PVT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT_SNAPSHOT,"tdeal_DEAL_ATRB_PVT_SNAPSHOT"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_PVT_ARCHV,"tdeal_DEAL_ATRB_PVT_ARCHV"},
            {PVT_MSK_CONST.tdeal_DEAL_ATRB_MTX,"tdeal_DEAL_ATRB_MTX"}
        };
    }
}
