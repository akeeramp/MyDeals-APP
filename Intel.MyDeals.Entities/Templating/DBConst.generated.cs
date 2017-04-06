
/*
File Updated: 4/6/2017 9:41:35 AM
On: MHTIPPIN-MOBL
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
		public const string dc_type = "dc_type";
		public const string dc_parent_type = "dc_parent_type";

		///<summary>
		/// DIM_SID: 20
		/// DIM_CD: BCKT
		/// ATRB_SID: 20001
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string ALL_BCKT_NM = "ALL_BCKT_NM";

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
		/// DIM_SID: 10
		/// DIM_CD: TIER
		/// ATRB_SID: 10001
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string ALL_TIER_NM = "ALL_TIER_NM";

		///<summary>
		/// DIM_SID: 7
		/// DIM_CD: PRD
		/// ATRB_SID: 7068
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string APAC_GROSS_REV_GROUPING = "APAC_GROSS_REV_GROUPING";

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
		/// DIM_SID: 20
		/// DIM_CD: BCKT
		/// ATRB_SID: 20002
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string BCKT_NM = "BCKT_NM";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 101
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string C2A_STATUS = "C2A_STATUS";

		///<summary>
		/// DIM_SID: 999
		/// DIM_CD: SYS
		/// ATRB_SID: 39
		/// TGT_COL_TYPE: MONEY
		/// DOT_NET_DATA_TYPE: System.Double
		///</summary>
		public const string CAP_PRICE = "CAP_PRICE";

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
		/// ATRB_SID: 34
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string CONTRACT_STATUS = "CONTRACT_STATUS";

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
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5044
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string CSL_WWID_EXCEPTIONS = "CSL_WWID_EXCEPTIONS";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3591
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string CUST_ACCNT_DIV = "CUST_ACCNT_DIV";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3660
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string CUST_ACCPT = "CUST_ACCPT";

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
		/// ATRB_SID: 3657
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Int32
		///</summary>
		public const string DRAWING_ORD = "DRAWING_ORD";

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
		/// ATRB_SID: 3331
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string ECAP_TYPE = "ECAP_TYPE";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5085
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Boolean
		///</summary>
		public const string EMP_ADM_ACCESS = "EMP_ADM_ACCESS";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5028
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string EMP_CUST_ASGN = "EMP_CUST_ASGN";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5031
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string EMP_GEO_ASGN = "EMP_GEO_ASGN";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5032
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string EMP_VRTCL_ASGN = "EMP_VRTCL_ASGN";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3620
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string GEO_COMBINED = "GEO_COMBINED";

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
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5042
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Boolean
		///</summary>
		public const string IS_CHKOUT_USER = "IS_CHKOUT_USER";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5041
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Boolean
		///</summary>
		public const string IS_DEV_USR = "IS_DEV_USR";

		///<summary>
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5043
		/// TGT_COL_TYPE: INT
		/// DOT_NET_DATA_TYPE: System.Boolean
		///</summary>
		public const string IS_SUPER_USER = "IS_SUPER_USER";

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
		/// ATRB_SID: 3600
		/// TGT_COL_TYPE: MONEY
		/// DOT_NET_DATA_TYPE: System.Double
		///</summary>
		public const string MAX_RPU = "MAX_RPU";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3625
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string MEET_COMP_PRICE_QSTN = "MEET_COMP_PRICE_QSTN";

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
		/// DIM_SID: 999
		/// DIM_CD: SYS
		/// ATRB_SID: 96
		/// TGT_COL_TYPE: MONEY
		/// DOT_NET_DATA_TYPE: System.Double
		///</summary>
		public const string MSP_PRICE = "MSP_PRICE";

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
		/// DIM_SID: 999
		/// DIM_CD: SYS
		/// ATRB_SID: 90001
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string NA = "NA";

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
		/// ATRB_SID: 3661
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string NOTES = "NOTES";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 35
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PAYOUT_BASED_ON = "PAYOUT_BASED_ON";

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
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 80
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PRD_LEVEL = "PRD_LEVEL";

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
		/// ATRB_SID: 15
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PRODUCT_FILTER = "PRODUCT_FILTER";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 18
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PROGRAM_ECAP_TYPE = "PROGRAM_ECAP_TYPE";

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
		/// ATRB_SID: 3659
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PTR_SYS_PRD = "PTR_SYS_PRD";

		///<summary>
		/// DIM_SID: 3
		/// DIM_CD: DEAL
		/// ATRB_SID: 3658
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string PTR_USER_PRD = "PTR_USER_PRD";

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
		/// DIM_SID: 50
		/// DIM_CD: SECUR
		/// ATRB_SID: 5040
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.String
		///</summary>
		public const string SECURITY_ACCOUNT_ROLE_ASGN = "SECURITY_ACCOUNT_ROLE_ASGN";

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
		/// DIM_SID: 10
		/// DIM_CD: TIER
		/// ATRB_SID: 10002
		/// TGT_COL_TYPE: VARCHAR
		/// DOT_NET_DATA_TYPE: System.Object
		///</summary>
		public const string TIER_NM = "TIER_NM";

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
		/// DB Returned Action that a given attribute should be deleted
		///</summary>
		public const string ATRB_DELETED = "ATRB_DELETED";


		///<summary>
		/// ACTN_SID: 213
		/// SRT_ORD: 3200
		/// DB Returned Action to execute object ID change
		///</summary>
		public const string ID_CHANGE = "ID_CHANGE";


		///<summary>
		/// ACTN_SID: 215
		/// SRT_ORD: 3400
		/// DB Returned Action Message
		///</summary>
		public const string MESSAGE = "MESSAGE";


		///<summary>
		/// ACTN_SID: 207
		/// SRT_ORD: 1000
		/// UI Generated Action to initiate a delete object action
		///</summary>
		public const string OBJ_DELETE = "OBJ_DELETE";


		///<summary>
		/// ACTN_SID: 208
		/// SRT_ORD: 1100
		/// DB Returned Action that a given OBJECT should be deleted
		///</summary>
		public const string OBJ_DELETED = "OBJ_DELETED";


		///<summary>
		/// ACTN_SID: 221
		/// SRT_ORD: 600
		/// UI Generated Action to initiate a save object action
		///</summary>
		public const string SAVE = "SAVE";

	}


	//-- ToolConstantName ---------------------------------------------------------------------------------

	public static class ToolConstantName {
		public const string ADMIN_MESSAGE = "ADMIN_MESSAGE";
		public const string BATCH_LOG = "BATCH_LOG";
		public const string COST_TEST_TYPES = "COST_TEST_TYPES";
		public const string CSL_WWID_EXCEPTIONS = "CSL_WWID_EXCEPTIONS ";
		public const string CUTOFF_DATE = "CUTOFF_DATE";
		public const string DB_ERROR_CONTACT_EMAIL = "DB_ERROR_CONTACT_EMAIL";
		public const string DB_LOGGING = "DB_LOGGING";
		public const string EIA_DIV_NM = "EIA_DIV_NM";
		public const string ICOST_ERROR_CONTACTS_MYDL = "ICOST_ERROR_CONTACTS_MYDL";
		public const string ICOST_ERROR_LOG_DAYS = "ICOST_ERROR_LOG_DAYS";
		public const string ICOST_HIST_LOG_DAYS = "ICOST_HIST_LOG_DAYS";
		public const string iCOST_PRODUCTS = "iCOST_PRODUCTS";
		public const string MISC_MM_LIST = "MISC_MM_LIST";
		public const string PRODUCT_SELECTION_LEVEL = "PRODUCT_SELECTION_LEVEL";
		public const string santhoshi = "santhoshi";
		public const string SELECTION_LEVEL = "SELECTION_LEVEL";
		public const string SSPEC_PRD_TYPES = "SSPEC_PRD_TYPES";
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
		public const string InComplete = "InComplete";
		public const string Complete = "Complete";
		public const string Draft = "Draft";
		public const string Requested = "Requested";
		public const string Submitted = "Submitted";
		public const string Pending = "Pending";
		public const string Accepted = "Accepted";
		public const string Working = "Working";
		public const string Finalized = "Finalized";
		public const string Active = "Active";
		public const string HoldWaiting = "HoldWaiting";
		public const string Expired = "Expired";
		public const string Cancelled = "Cancelled";
		public const string LostBid = "LostBid";
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
		public const string C_ACCOUNT_BASED = "C_ACCOUNT_BASED";
		public const string C_GEO_BASED = "C_GEO_BASED";
		public const string C_GLOBAL_BASED = "C_GLOBAL_BASED";
		public const string C_ADD_ATTACHMENTS = "C_ADD_ATTACHMENTS";
		public const string C_APPROVE_ = "C_APPROVE ";
		public const string C_CANCEL_DEAL = "C_CANCEL_DEAL";
		public const string C_REJECT_DEAL = "C_REJECT_DEAL";
		public const string C_UPDATE_DEAL = "C_UPDATE_DEAL";
		public const string C_VIEW_ATTACHMENTS = "C_VIEW_ATTACHMENTS";
		public const string ATRB_HIDDEN = "ATRB_HIDDEN";
		public const string ATRB_READ_ONLY = "ATRB_READ_ONLY";
		public const string ATRB_REQUIRED = "ATRB_REQUIRED";
		public const string C_VIEW_QUOTE_LETTER = "C_VIEW_QUOTE_LETTER";
		public const string ATRB_DELETED = "ATRB_DELETED";
		public const string OBJ_DELETE = "OBJ_DELETE";
		public const string OBJ_DELETED = "OBJ_DELETED";
		public const string ID_CHANGE = "ID_CHANGE";
		public const string MESSAGE = "MESSAGE";
		public const string SAVE = "SAVE";
		public const string CAN_VIEW_COST_TEST = "CAN_VIEW_COST_TEST";
		public const string CAN_VIEW_MEET_COMP = "CAN_VIEW_MEET_COMP";
		public const string C_VERTCL_BASED = "C_VERTCL_BASED";
	}


	//-- Build Object Data --------------------------------------------------------------------------------

	public enum OpDataElementType {
		CNTRCT = 1,
		PRC_ST = 2,
		PRC_TBL = 3,
		PRC_TBL_ROW = 4,
		WIP_DEAL = 5,
		DEAL = 6,
		Unknown = 0
	}

	public static class OpDataElementTypeRepository
	{
		public static readonly OpDataElementTypeCollection OpDetCollection = new OpDataElementTypeCollection(
			new List<OpDataElementTypeItem>
			{
				new OpDataElementTypeItem {Id = 1, OpDeType = OpDataElementType.CNTRCT, Alias = "CNTRCT", Order = 10 },
				new OpDataElementTypeItem {Id = 2, OpDeType = OpDataElementType.PRC_ST, Alias = "PRC_ST", Order = 20 },
				new OpDataElementTypeItem {Id = 3, OpDeType = OpDataElementType.PRC_TBL, Alias = "PRC_TBL", Order = 30 },
				new OpDataElementTypeItem {Id = 4, OpDeType = OpDataElementType.PRC_TBL_ROW, Alias = "PRC_TBL_ROW", Order = 40 },
				new OpDataElementTypeItem {Id = 5, OpDeType = OpDataElementType.WIP_DEAL, Alias = "WIP_DEAL", Order = 50 },
				new OpDataElementTypeItem {Id = 6, OpDeType = OpDataElementType.DEAL, Alias = "DEAL", Order = 60 },
			},

			new Dictionary<OpDataElementType, OpDataElementType>
			{
				[OpDataElementType.CNTRCT] = OpDataElementType.PRC_ST,
				[OpDataElementType.PRC_ST] = OpDataElementType.PRC_TBL,
				[OpDataElementType.PRC_TBL] = OpDataElementType.PRC_TBL_ROW,
				[OpDataElementType.PRC_TBL_ROW] = OpDataElementType.WIP_DEAL,
				[OpDataElementType.WIP_DEAL] = OpDataElementType.DEAL,
			}
		);
	}


	//-- Build ObjectSet Data -----------------------------------------------------------------------------

	public enum OpDataElementSetType {
		ECAP = 3,
		PROGRAM = 4,
		VOL_TIER = 5,
		CAP_BAND = 7,
		ALL_TYPES = 9,
		Unknown = 0
	}

	public static class OpDataElementSetTypeRepository
	{
		public static readonly OpDataElementSetTypeCollection  OpDestCollection  = new OpDataElementSetTypeCollection(
			new List<OpDataElementSetTypeItem>
			{
				new OpDataElementSetTypeItem {Id = 3, OpDeSetType = OpDataElementSetType.ECAP, Alias = "ECAP", Description = "ECAP Deal Type", TemplateDealNumber = -1, TrackerDtLetter = "E", Order = 3 },
				new OpDataElementSetTypeItem {Id = 4, OpDeSetType = OpDataElementSetType.PROGRAM, Alias = "PROGRAM", Description = "PROGRAM Deal Type", TemplateDealNumber = -3, TrackerDtLetter = "L", Order = 4 },
				new OpDataElementSetTypeItem {Id = 5, OpDeSetType = OpDataElementSetType.VOL_TIER, Alias = "VOL_TIER", Description = "VOL TIER Deal Type", TemplateDealNumber = -2, TrackerDtLetter = "T", Order = 5 },
				new OpDataElementSetTypeItem {Id = 7, OpDeSetType = OpDataElementSetType.CAP_BAND, Alias = "CAP_BAND", Description = "CAP BAND Deal Type", TemplateDealNumber = -4, TrackerDtLetter = "C", Order = 7 },
				new OpDataElementSetTypeItem {Id = 9, OpDeSetType = OpDataElementSetType.ALL_TYPES, Alias = "ALL_TYPES", Description = "ALL Object set types", TemplateDealNumber = 0, TrackerDtLetter = "", Order = 9 },
			},

			new Dictionary<OpDataElementType, List<OpDataElementSetType>>
			{
				[OpDataElementType.CNTRCT] = new List<OpDataElementSetType> { OpDataElementSetType.ALL_TYPES },
				[OpDataElementType.PRC_ST] = new List<OpDataElementSetType> { OpDataElementSetType.ALL_TYPES },
				[OpDataElementType.PRC_TBL] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
				[OpDataElementType.PRC_TBL_ROW] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
				[OpDataElementType.WIP_DEAL] = new List<OpDataElementSetType> { OpDataElementSetType.ECAP,OpDataElementSetType.PROGRAM,OpDataElementSetType.VOL_TIER,OpDataElementSetType.CAP_BAND },
			}
		);
	}

	//-- MyDealsAtrbLookup ----------------------------------------------------------------------

}
