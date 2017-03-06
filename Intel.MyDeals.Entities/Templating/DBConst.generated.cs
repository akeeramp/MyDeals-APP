
/*
File Updated: 3/3/2017 11:42:39 PM
On: PWECKENR-MOBL
From: EG1RDMDBDEV01\DEALSDEV,3180, MYDEALS
*/
using System;
using System.Collections.Generic;
using System.Linq;
using Intel.Opaque.Data;
using Intel.MyDeals.Entities;

namespace Intel.MyDeals.Entities {

	//-- AttributeCodes -----------------------------------------------------------------------------------

	public static class AttributeCodes {
		public const string DC_ID = "DC_ID";
		public const string DC_PARENT_ID = "DC_PARENT_ID";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3576
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string C2A_DATA_C2A_ID = "C2A_DATA_C2A_ID";

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
		/// ATRB_SID: 3372
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string DEAL_CUST_NM = "DEAL_CUST_NM";

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
		/// ATRB_SID: 3616
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Int32
		///</summary>
		public const string DEAL_SID = "DEAL_SID";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3327
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string DEAL_STG_CD = "DEAL_STG_CD";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3331
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string ECAP_TYPE = "ECAP_TYPE";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3320
		/// TGT_COL_TYPE: DATETIME
		/// DOT_NET_DATA_TYPE: System.DateTime
		///</summary>
		public const string END_DT = "END_DT";

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
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7090
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string HIER_VAL_NM = "HIER_VAL_NM";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3474
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string MRKT_SEG_COMBINED = "MRKT_SEG_COMBINED";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3654
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string MRKT_SEG_NON_CORP = "MRKT_SEG_NON_CORP";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3653
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string MRKT_SUB_SEGMENT = "MRKT_SUB_SEGMENT";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3490
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Int32
		///</summary>
		public const string NUM_OF_TIERS = "NUM_OF_TIERS";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3002
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string OBJ_SET_TYPE_CD = "OBJ_SET_TYPE_CD";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3004
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Int32
		///</summary>
		public const string OBJ_SET_TYPE_SID = "OBJ_SET_TYPE_SID";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 75
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PRD_VERTICAL = "PRD_VERTICAL";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7073
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string PRICE_SEGMENT = "PRICE_SEGMENT";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 18
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PROGRAM_ECAP_TYPE = "PROGRAM_ECAP_TYPE";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3319
		/// TGT_COL_TYPE: DATETIME
		/// DOT_NET_DATA_TYPE: System.DateTime
		///</summary>
		public const string START_DT = "START_DT";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3569
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string TERMS = "TERMS";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 33
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string TITLE = "TITLE";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7080
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string TRDMRK_NM = "TRDMRK_NM";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 24
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string TRKR_NBR = "TRKR_NBR";

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


	//-- DealSaveActionCodes ------------------------------------------------------------------------------

	public static class DealSaveActionCodes {

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


	//-- ToolConstantName ---------------------------------------------------------------------------------

	public static class ToolConstantName {
		public const string COST_TEST_TYPES = "COST_TEST_TYPES";
		public const string DB_ERROR_CONTACT_EMAIL = "DB_ERROR_CONTACT_EMAIL";
		public const string DB_LOGGING = "DB_LOGGING";
		public const string EIA_DIV_NM = "EIA_DIV_NM";
		public const string ENV = "ENV";
		public const string gfgf = "gfgf";
		public const string santhoshi = "santhoshi";
	}


	//-- Roles ---------------------------------------------------------------------------------

	public static class RoleTypes {
		public const string CBA = "CBA";
		public const string DA = "DA";
		public const string Finance = "Finance";
		public const string FSE = "FSE";
		public const string GA = "GA";
		public const string Legal = "Legal";
		public const string RA = "RA";
		public const string SA = "SA";
	}


	//-- WorkFlow Stages ---------------------------------------------------------------------------------

	public static class WorkFlowStages {
		public const string Requested = "Requested";
		public const string Cancelled = "Cancelled";
		public const string Expired = "Expired";
		public const string GA_Approved = "GA_Approved";
		public const string Created = "Created";
		public const string SA_Approved = "SA_Approved";
		public const string Test_WF = "Test WF";
	}


	//-- Workflow Actions ---------------------------------------------------------------------------------

	public static class WorkFlowActions {
		public const string Approve = "Approve";
		public const string Cancel = "Cancel";
		public const string Reject = "Reject";
		public const string Redeal = "Redeal";
		public const string Fast_Track = "Fast Track";
		public const string DeleteLineup = "DeleteLineup";
	}


	//-- Security Actions ---------------------------------------------------------------------------------

	public static class SecurityActns {
		public const string WRAP_SECURITY = "WRAP_SECURITY";
		public const string C_ACCOUNT_BASED = "C_ACCOUNT_BASED";
		public const string C_GEO_BASED = "C_GEO_BASED";
		public const string C_GLOBAL_BASED = "C_GLOBAL_BASED";
		public const string ADMIN_GOD_MODE = "ADMIN_GOD_MODE";
		public const string CAN_ADMIN_SYS_LOCK = "CAN_ADMIN_SYS_LOCK";
		public const string CAN_LOCK_SYSTEM = "CAN_LOCK_SYSTEM";
		public const string C_ADD_ATTACHMENTS = "C_ADD_ATTACHMENTS";
		public const string C_APPROVE_ = "C_APPROVE ";
		public const string C_CANCEL_DEAL = "C_CANCEL_DEAL";
		public const string C_COPY_DEAL = "C_COPY_DEAL";
		public const string C_CREATE_DEAL = "C_CREATE_DEAL";
		public const string C_DELETE_DEAL = "C_DELETE_DEAL";
		public const string C_REJECT_DEAL = "C_REJECT_DEAL";
		public const string C_UPDATE_DEAL = "C_UPDATE_DEAL";
		public const string C_VIEW = "C_VIEW";
		public const string C_VIEW_ATTACHMENTS = "C_VIEW_ATTACHMENTS";
		public const string C_VIEW_BMT_ACCEPTED_ECAP = "C_VIEW_BMT_ACCEPTED_ECAP";
		public const string C_VIEW_DEAL = "C_VIEW_DEAL";
		public const string C_VIEW_HISTORY = "C_VIEW_HISTORY";
		public const string C_VIEW_MMBP_ACCEPTED_ECAP = "C_VIEW_MMBP_ACCEPTED_ECAP";
		public const string DEAL_HIDDEN = "DEAL_HIDDEN";
		public const string DEAL_READ_ONLY = "DEAL_READ_ONLY";
		public const string ATRB_HIDDEN = "ATRB_HIDDEN";
		public const string ATRB_READ_ONLY = "ATRB_READ_ONLY";
		public const string ATRB_REQUIRED = "ATRB_REQUIRED";
		public const string CAN_DEVELOPER_ONLY = "CAN_DEVELOPER_ONLY";
		public const string C_REDEAL_DEAL = "C_REDEAL_DEAL";
		public const string C_SAVE_DATA_PRICE_APPROVE = "C_SAVE_DATA_PRICE_APPROVE";
		public const string C_RUN_COST_TEST_APPROVE = "C_RUN_COST_TEST_APPROVE";
		public const string C_SAVE_DATA_DT_APPROVE = "C_SAVE_DATA_DT_APPROVE";
		public const string C_SAVE_DATA_BY_APPROVE = "C_SAVE_DATA_BY_APPROVE";
		public const string C_FAST_TRACK = "C_FAST_TRACK";
		public const string CAN_CREATE_RETRO_DEALS = "CAN_CREATE_RETRO_DEALS";
		public const string C_INCREASE_DATE = "C_INCREASE_DATE";
		public const string C_DECREASE_PRICE = "C_DECREASE_PRICE";
		public const string C_APPROVE_FASTTRACK = "C_APPROVE_FASTTRACK";
		public const string C_REQ_COMPONENTS = "C_REQ_COMPONENTS";
		public const string C_IDMS_READ_ONLY_ = "C_IDMS_READ_ONLY ";
		public const string C_IDMS_ACTION_DISABLED_ = "C_IDMS_ACTION_DISABLED ";
		public const string C_TARGET_REGIONS_DISABLED = "C_TARGET_REGIONS_DISABLED";
		public const string C_VIEW_QUOTE_LETTER = "C_VIEW_QUOTE_LETTER";
		public const string CAN_CREATE_QTR_RETRO_DEALS = "CAN_CREATE_QTR_RETRO_DEALS";
		public const string CAN_CREATE_DEAL_PRIOR_TO_QTR = "CAN_CREATE_DEAL_PRIOR_TO_QTR";
		public const string CAN_VIEW_LEGAL_COMMENTS = "CAN_VIEW_LEGAL_COMMENTS";
		public const string C_CAN_VIEW_ADMINTOOL = "C_CAN_VIEW_ADMINTOOL";
		public const string C_DECREASE_DATE = "C_DECREASE_DATE";
		public const string CAN_MANAGE_EMAIL = "CAN_MANAGE_EMAIL";
		public const string CAN_MANAGE_CHIPSET_SPLITOUT = "CAN_MANAGE_CHIPSET_SPLITOUT";
		public const string CAN_MANAGE_COMPETITIVE_PRODUCTS = "CAN_MANAGE_COMPETITIVE_PRODUCTS";
		public const string C_CAN_VIEW_C2A_INTERFACE = "C_CAN_VIEW_C2A_INTERFACE";
		public const string C_INCREASE_PRICE = "C_INCREASE_PRICE";
		public const string C_DELETE_DEAL_LINEUP = "C_DELETE_DEAL_LINEUP";
		public const string ATRB_DELETED = "ATRB_DELETED";
		public const string CALC_MSP = "CALC_MSP";
		public const string CK_REV_LEVEL = "CK_REV_LEVEL";
		public const string COMMON_DEAL_SAVE = "COMMON_DEAL_SAVE";
		public const string CONCURRENCY_CHECK = "CONCURRENCY_CHECK";
		public const string COPY_WB_FULL = "COPY_WB_FULL";
		public const string COPY_WB_HEADER = "COPY_WB_HEADER";
		public const string COPY_WB_OVERLAP = "COPY_WB_OVERLAP";
		public const string COPY_WB_PROD = "COPY_WB_PROD";
		public const string DEAL_APPROVE = "DEAL_APPROVE";
		public const string DEAL_CANCEL = "DEAL_CANCEL";
		public const string DEAL_CREATED = "DEAL_CREATED";
		public const string DEAL_DELETE = "DEAL_DELETE";
		public const string DEAL_DELETED = "DEAL_DELETED";
		public const string DEAL_REJECT = "DEAL_REJECT";
		public const string DEAL_ROLLBACK_TO_ACTIVE = "DEAL_ROLLBACK_TO_ACTIVE";
		public const string ECAP_VALIDATION = "ECAP_VALIDATION";
		public const string GEN_TRACKER = "GEN_TRACKER";
		public const string ID_CHANGE = "ID_CHANGE";
		public const string LAYER = "LAYER";
		public const string MESSAGE = "MESSAGE";
		public const string PREP2DEAL = "PREP2DEAL";
		public const string PROCESS_QUOTE_LETTER = "PROCESS_QUOTE_LETTER";
		public const string PURGE_WIP = "PURGE_WIP";
		public const string QUEUE_QUOTE_LETTER = "QUEUE_QUOTE_LETTER";
		public const string REDEAL = "REDEAL";
		public const string SAVE = "SAVE";
		public const string SEND_QUOTE_LETTER = "SEND_QUOTE_LETTER";
		public const string SNAPSHOT = "SNAPSHOT";
		public const string UPDATE_APPROVERS = "UPDATE_APPROVERS";
		public const string WB_CHECK = "WB_CHECK";
		public const string WB_LOCK = "WB_LOCK";
		public const string WB_UNLOCK = "WB_UNLOCK";
		public const string YCS2_OVERLAP = "YCS2_OVERLAP";
		public const string CAN_REMOVE_WB_LOCK = "CAN_REMOVE_WB_LOCK";
		public const string CAN_VIEW_COST_TEST = "CAN_VIEW_COST_TEST";
		public const string CAN_VIEW_MEET_COMP = "CAN_VIEW_MEET_COMP";
	}


	//-- Build Object Data --------------------------------------------------------------------------------

	public enum OpDataElementType {
		Contract = 10,
		PricingStrategy = 20,
		PricingTable = 30,
		PricingTableRow = 40,
		WipDeals = 50,
		Deals = 60,
		Unknown = 0
	}

	public static class OpDataElementTypeRepository
	{
		public static readonly OpDataElementTypeCollection OpDetCollection = new OpDataElementTypeCollection(
			new List<OpDataElementTypeItem>
			{
				new OpDataElementTypeItem {Id = 1, OpDeType = OpDataElementType.Contract, Alias = "CNTRCT", Order = 10 },
				new OpDataElementTypeItem {Id = 2, OpDeType = OpDataElementType.PricingStrategy, Alias = "PRC_ST", Order = 20 },
				new OpDataElementTypeItem {Id = 3, OpDeType = OpDataElementType.PricingTable, Alias = "PRC_TBL", Order = 30 },
				new OpDataElementTypeItem {Id = 4, OpDeType = OpDataElementType.PricingTableRow, Alias = "PRC_TBL_ROW", Order = 40 },
				new OpDataElementTypeItem {Id = 5, OpDeType = OpDataElementType.WipDeals, Alias = "WIP_DEAL", Order = 50 },
				new OpDataElementTypeItem {Id = 6, OpDeType = OpDataElementType.Deals, Alias = "DEAL", Order = 60 },
			},

			new Dictionary<OpDataElementType, OpDataElementType>
			{
				[OpDataElementType.Contract] = OpDataElementType.PricingStrategy,
				[OpDataElementType.PricingStrategy] = OpDataElementType.PricingTable,
				[OpDataElementType.PricingTable] = OpDataElementType.PricingTableRow,
				[OpDataElementType.PricingTableRow] = OpDataElementType.WipDeals,
				[OpDataElementType.WipDeals] = OpDataElementType.Deals,
			}
		);
	}


	//-- Build ObjectSet Data -----------------------------------------------------------------------------

	public enum OpDataElementSetType {
		ECAP = 3,
		PROGRAM = 4,
		VOL_TIER = 5,
		CAP_BAND = 7,
		GENERAL = 9,
		Unknown = 0
	}

	public static class OpDataElementSetTypeRepository
	{
		public static readonly OpDataElementSetTypeCollection  OpDestCollection  = new OpDataElementSetTypeCollection(
			new List<OpDataElementSetTypeItem>
			{
				new OpDataElementSetTypeItem {Id = 3, OpDeSetType = OpDataElementSetType.ECAP, Alias = "ECAP", Description = "ECAP Deal Types", TemplateDealNumber = -1, TrackerDtLetter = "E", Order = 3 },
				new OpDataElementSetTypeItem {Id = 4, OpDeSetType = OpDataElementSetType.PROGRAM, Alias = "PROGRAM", Description = "PROGRAM Deal Type", TemplateDealNumber = -3, TrackerDtLetter = "L", Order = 4 },
				new OpDataElementSetTypeItem {Id = 5, OpDeSetType = OpDataElementSetType.VOL_TIER, Alias = "VOL_TIER", Description = "VOL TIER Deal Type", TemplateDealNumber = -2, TrackerDtLetter = "T", Order = 5 },
				new OpDataElementSetTypeItem {Id = 7, OpDeSetType = OpDataElementSetType.CAP_BAND, Alias = "CAP_BAND", Description = "CAP BAND Deal Type", TemplateDealNumber = -4, TrackerDtLetter = "C", Order = 7 },
				new OpDataElementSetTypeItem {Id = 9, OpDeSetType = OpDataElementSetType.GENERAL, Alias = "GENERAL", Description = "General Basic Type", TemplateDealNumber = 0, TrackerDtLetter = "", Order = 9 },
			},

			new Dictionary<OpDataElementType, List<OpDataElementSetType>>
			{
				[OpDataElementType.Contract] = new List<OpDataElementSetType> { OpDataElementSetType.GENERAL },
				[OpDataElementType.PricingStrategy] = new List<OpDataElementSetType> { OpDataElementSetType.GENERAL },
				[OpDataElementType.PricingTable] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
				[OpDataElementType.PricingTableRow] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
				[OpDataElementType.WipDeals] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
			}
		);
	}

	//-- MyDealsAtrbLookup ----------------------------------------------------------------------

}
