
/*
File Updated: 1/12/2017 2:08:42 PM
On: PWECKENR-MOBL5
From: EG1RDMDBDEV01\DEALSDEV,3180, MYDEALS
*/
using System;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.Entities {
	public static class AttributeCodes {

        public const string DEAL_TYPE_CD = "DEAL_TYPE_CD";
        public const string DEAL_TYPE_CD_SID = "DEAL_TYPE_CD_SID";
        public const string DEAL_SID = "DEAL_SID";
        public const string CUST_MBR_SID = "CUST_MBR_SID";
        public const string NUM_OF_TIERS = "NUM_OF_TIERS";
        public const string TRKR_NBR = "TRKR_NBR";
        public const string DEAL_STG_CD = "DEAL_STG_CD";
        public const string START_DT = "START_DT";
        public const string END_DT = "END_DT";



        ///<summary>
        /// DIM_SID: 2
        /// DIM_CD: CUST
        /// ATRB_SID: 2001
        /// TGT_COL_TYPE: VARCHAR
        /// DOT_NET_DATA_TYPE: System.Object
        ///</summary>
        public const string ALL_CUST_NM = "ALL_CUST_NM";

		///<summary>
		/// DIM_SID: 4
		/// DIM_CD: GEO
		/// ATRB_SID: 4001
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string ALL_GEO_NM = "ALL_GEO_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7001
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string ALL_PRD_NM = "ALL_PRD_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7068
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string APAC_GROSS_REV_GROUPING = "APAC_GROSS_REV_GROUPING";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7039
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string BNB_STATUS = "BNB_STATUS";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7082
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string BRAND_GROUP = "BRAND_GROUP";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7024
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string CPU_CACHE = "CPU_CACHE";

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
		/// ATRB_SID: 7086
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string CPU_PROCESSOR_NUMBER = "CPU_PROCESSOR_NUMBER";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7055
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string CST_USE_IN_CALC = "CST_USE_IN_CALC";

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
		/// ATRB_SID: 2010
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string CUST_CHNL = "CUST_CHNL";

		///<summary>
		/// DIM_SID: 2
		/// DIM_CD: CUST
		/// ATRB_SID: 2003
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string CUST_DIV_NM = "CUST_DIV_NM";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7030
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string DB_LD_ATRB_SID = "DB_LD_ATRB_SID";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7020
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string DEVICE_TYPE = "DEVICE_TYPE";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7084
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string GDM_BRND_NM = "GDM_BRND_NM";

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
		/// ATRB_SID: 7085
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string GDM_FMLY_NM = "GDM_FMLY_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7071
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string GDM_PRC_SKU_REV_GRP = "GDM_PRC_SKU_REV_GRP";

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
		/// DIM_SID: 4
		/// DIM_CD: GEO
		/// ATRB_SID: 4002
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string GEO_NM = "GEO_NM";

		///<summary>
		/// DIM_SID: 2
		/// DIM_CD: CUST
		/// ATRB_SID: 2012
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string HOST_GEO = "HOST_GEO";

		///<summary>
		/// DIM_SID: 2
		/// DIM_CD: CUST
		/// ATRB_SID: 2013
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string INDUS_KEY_CD = "INDUS_KEY_CD";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7065
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string KIT_IND = "KIT_IND";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7074
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string MKTING_CD_NM = "MKTING_CD_NM";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7077
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string NAND_DENSITY = "NAND_DENSITY";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7076
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string NAND_FAMILY = "NAND_FAMILY";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7078
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string NAND_INTERFACE = "NAND_INTERFACE";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7041
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string OFF_ROADMAP_FLG = "OFF_ROADMAP_FLG";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7037
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string OP_CD = "OP_CD";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7006
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PCSR_NBR = "PCSR_NBR";

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
		/// ATRB_SID: 7035
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_ATRB = "PRD_ATRB";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7003
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_CAT_NM = "PRD_CAT_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7033
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_CATGRY_NM_DESC = "PRD_CATGRY_NM_DESC";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7089
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_END_DTM = "PRD_END_DTM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7083
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_FMLY_TXT = "PRD_FMLY_TXT";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7088
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRD_STRT_DTM = "PRD_STRT_DTM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7073
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRICE_SEGMENT = "PRICE_SEGMENT";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7081
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string REBATE_PROD_FLAG = "REBATE_PROD_FLAG";

		///<summary>
		/// DIM_SID: 4
		/// DIM_CD: GEO
		/// ATRB_SID: 4003
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string RGN_NM = "RGN_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7079
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string SBS_NM = "SBS_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7042
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string SKU_MARKET_SEGMENT = "SKU_MARKET_SEGMENT";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7054
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string SPEC_CD = "SPEC_CD";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7028
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string SUB_VERTICAL = "SUB_VERTICAL";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7072
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string SUPER_GRP_NM = "SUPER_GRP_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7080
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string TRDMRK_NM = "TRDMRK_NM";

		///<summary>
		/// DIM_SID: 4
		/// DIM_CD: GEO
		/// ATRB_SID: 4005
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string TRKR_NBR_GEO_LTR = "TRKR_NBR_GEO_LTR";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7032
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string TRKR_NBR_VRT_LTR = "TRKR_NBR_VRT_LTR";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7031
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string UI_DSPLY_ATRB_SID = "UI_DSPLY_ATRB_SID";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7064
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string VRTCL_SEG_CD = "VRTCL_SEG_CD";
	}

	public static class DealSaveActionCodes {
	}

	public static class ToolConstantName {
		public const string abhi = "abhi";
		public const string Abhinav = "Abhinav";
		public const string akash = "akash";
		public const string assasdsd = "assasdsd";
		public const string BATCH_LOG = "BATCH_LOG";
		public const string da = "da";
		public const string DB_ERROR_CONTACT_EMAIL = "DB_ERROR_CONTACT_EMAIL";
		public const string DB_LOGGING = "DB_LOGGING";
		public const string DEPLOY_DT = "DEPLOY_DT";
		public const string ENV = "ENV";
		public const string ICOST_ERROR_CONTACTS_MYDL = "ICOST_ERROR_CONTACTS_MYDL";
		public const string ICOST_ERROR_LOG_DAYS = "ICOST_ERROR_LOG_DAYS";
		public const string ICOST_HIST_LOG_DAYS = "ICOST_HIST_LOG_DAYS";
		public const string iCOST_PRODUCTS = "iCOST_PRODUCTS";
		public const string MISC_MM_LIST = "MISC_MM_LIST";
		public const string qweqwef = "qweqwef";
		public const string sa = "sa";
		public const string santhoshi = "santhoshi";
	}

	//-------------------------------------------------------------------------------------------

	namespace MyDealsAtrbLookup {
	}

	//-------------------------------------------------------------------------------------------

}
