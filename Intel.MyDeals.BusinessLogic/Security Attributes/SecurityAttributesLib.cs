using Intel.MyDeals.DataLibrary;
using Intel.MyDeals.Entities;
using Intel.MyDeals.IBusinessLogic;
using Intel.MyDeals.IDataLibrary;
using Intel.Opaque;
using System.Collections.Generic;
using System.Linq;

namespace Intel.MyDeals.BusinessLogic
{
	public class SecurityAttributesLib : ISecurityAttributesLib
	{
		private readonly ISecurityAttributesDataLib _securityAttributesDataLib;

		public SecurityAttributesLib(ISecurityAttributesDataLib _securityAttributesDataLib)
		{
			this._securityAttributesDataLib = _securityAttributesDataLib;
		}

		/// <summary>
		/// TODO: This parameterless constructor is left as a reminder,
		/// once we fix our unit tests to use Moq remove this constructor, also remove direct reference to "Intel.MyDeals.DataLibrary"
		/// </summary>
		public SecurityAttributesLib()
		{
			this._securityAttributesDataLib = new SecurityAttributesDataLib();
		}

		#region Security Mapping

		public Dictionary<string, List<string>> GetDealTypeAtrbs()
		{
			Dictionary<string, List<string>> testList = new Dictionary<string, List<string>>();

			// TODO: Get non-hard-coded data
			#region Hard-coded Lists
			List<string> capBandList = new List<string> {
				"DIV_APPROVED_BY"
				, "DIV_APPROVED_DT"
				,"GEO_APPROVED_BY"
				, "GEO_APPROVED_DT"
				, "FSE_APPROVED_BY_FACT"
				, "FSE_APPROVED_DT_FACT"
				, "GEO_REQUESTED_BY"
				, "FSE_REQUESTED_BY_FACT"
				, "C2A_DATA_C2A_ID"
				, "PARENT_LINEUP_SID"
				, "C2A_DATA_CUSTOMER_STATUS"
				, "C2A_DATA_OVERRIDE"
				, "C2A_CTRCT_NM"
				, "COMMENTS"
				, "COST_TEST_OVERRIDE"
				, "LEGAL_COMMENTS"
				, "SA_COST_TEST_RESULTS"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_PLI_NET_PRICE_CONCATE"
				, "DEAL_PLI_MEETCOMP_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_INCOMPLETE_REASON"
				, "DEAL_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_RESULT"
				, "DEAL_COST_TEST_RESULT"
				, "PRODUCT_FILTER"
				, "PRODUCT_TITLE"
				, "DEAL_TYPE_CD"
				, "DEAL_NBR"
				, "START_DT"
				, "END_DT"
				, "DEAL_STG_CD"
				, "DEAL_CUST_NM"
				, "YEAR"
				, "QTR"
				, "DEAL_CUST_DIV_NM"
				, "PRD_NM_COMBINED"
				, "ECAP_PRICE_DSP"
				, "CONSUMPTION_REASON_DSP"
				, "PRD_INACTIVE_FLG"
				, "PRICE_AGREEMENT_GRP"
				, "PROG_VOLTIER_NM"
				, "LINE_NBR"
				, "NUM_OF_TIERS"
				, "REQ_BY"
				, "DEAL_DESC"
				, "PAYOUT_BASED_ON"
				, "REQ_DT"
				, "LAST_MOD_BY"
				, "LAST_MOD_DT"
				, "END_CUSTOMER_RETAIL"
				, "RATE_BASED_ON"
				, "PORTFOLIO"
				, "CONSUMPTION_REASON"
				, "CONSUMPTION_REASON_CMNT"
				, "MRKT_SEG_COMBINED"
				, "PROGRAM_PAYMENT"
				, "REBATE_PMT"
				, "REBATE_QTY"
				, "REBATE_DISTI"
				, "REBATE_BILLING_START"
				, "REBATE_BILLING_END"
				, "REBATE_OA_MAX_VOL"
				, "REBATE_OA_MAX_AMT"
				, "REBATE_DEAL_ID"
				, "DEAL_CORP_ACCNT_DIV"
				, "PROGRAM_TYPE_VOL_TIER"
				, "DEAL_COMB_TYPE"
				, "BACK_DATE_RSN"
				, "BACK_DATE_RSN_TXT"
				, "TIER_NBR"
				, "TRGT_RGN"
				, "TRKR_NBR"
				, "WF_STG_CD"
				, "TRGT_RGN_CHK"
				, "RATE"
				, "PRD_LEVEL"
				, "TRKR_START_DT"
				, "TRKR_END_DT"
				, "STRT_CAP"
				, "END_CAP"
				, "DEAL_MM_MEDIA_CD"
				, "PLI_LOCATOR"
				, "DEAL_TYPE_CD_SID"
				, "TRKR_NBR_DT_LTR"
				, "CUST_MBR_SID"
				, "PERFORM_CTST"
				, "BAND_TYPE"
			};
			List<string> dealGrpList = new List<string> {
				 "CUST_MBR_SID"
				, "DEAL_GRP_NM"
				, "START_DT"
				, "END_DT"
				, "ECAP_TYPE"
				, "PLI_SORT_ORD"
				, "COMMENTS"
				, "DEAL_CUST_NM"
				, "YEAR"
				, "QTR"
				,  "DEAL_CUST_DIV_NM"
				,  "MRKT_SEG_COMBINED"
				,  "REBATE_BILLING_START"
				,  "REBATE_BILLING_END"
				,  "MEET_COMP_PRICE_QSTN"
			};
			List<string> ecapList = new List<string> {
				"FSE_REQUESTED_PRICE"
				,"GEO_REQUESTED_PRICE"
				,"BMT_APPROVED_BY"
				,"MMBP_APPROVED_DT"
				,"MMBP_APPROVED_BY"
				,"BMT_APPROVED_DT"
				,"FSE_APPROVED_BY"
				,"FSE_APPROVED_DT"
				,"BMT_REQUESTED_BY"
				,"FSE_REQUESTED_BY"
				, "C2A_DATA_C2A_ID"
				, "PARENT_LINEUP_SID"
				, "C2A_DATA_CUSTOMER_STATUS"
				, "C2A_DATA_OVERRIDE"
				, "C2A_CTRCT_NM"
				, "COMMENTS"
				, "COMMENT_HISTORY"
				, "COST_TEST_OVERRIDE"
				, "LEGAL_COMMENTS"
				, "SA_COST_TEST_RESULTS"
				, "COST_DELTA"
				, "PRD_CST"
				, "BUFFER_PCT"
				, "PRD_COST_FINAL"
				, "CST_ECAP_PRICE"
				, "L4_PRODUCT_NAME"
				, "CST_KIT_ECAP"
				, "CST_KIT_ECAP_MIN"
				, "CST_KIT_ECAP_MAX"
				, "CST_CPU_SA"
				, "CST_CPU_SA_MIN"
				, "CST_CPU_SA_MAX"
				, "CST_CS_SA"
				, "CST_CS_SA_MIN"
				, "CST_CS_SA_MAX"
				, "CST_CPU_COST"
				, "CST_CS_COST"
				, "CST_CPU_FINAL_COST"
				, "CST_CS_FINAL_COST"
				, "COST_TYPE_USED"
				, "CPU_COST_TYPE_USED"
				, "CS_COST_TYPE_USED"
				, "CPU_PULL_DLR"
				, "CPU_PULL_DLR_SDM"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_PLI_NET_PRICE_CONCATE"
				, "DEAL_PLI_MEETCOMP_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_INCOMPLETE_REASON"
				, "DEAL_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_RESULT"
				, "DEAL_COST_TEST_RESULT"
				, "PRODUCT_FILTER"
				, "PRODUCT_TITLE"
				, "DEAL_PRC_CONFLICT"
				, "DEAL_TYPE_CD"
				, "DEAL_NBR"
				, "START_DT"
				, "END_DT"
				, "VOLUME"
				, "DEAL_STG_CD"
				, "DEAL_CUST_NM"
				, "YEAR"
				, "QTR"
				, "DEAL_CUST_DIV_NM"
				, "OVERLAP_OVERRIDE"
				, "DIVISION_APPROVED_LIMIT"
				, "PRD_NM_COMBINED"
				, "NORTHBRIDGE_SPLIT"
				, "SOUTHBRIDGE_SPLIT"
				, "ECAP_PRICE_DSP"
				, "CONSUMPTION_REASON_DSP"
				, "DEAL_SOLD_TO_ID"
				, "PRD_INACTIVE_FLG"
				, "PRICE_AGREEMENT_GRP"
				, "LINE_NBR"
				, "KIT_CHK"
				, "COMP_PRICE_CPU"
				, "COMP_PRICE_CS"
				, "COMPETITIVE_PRICE"
				, "COMP_TARGET_SYSTEM_PRICE"
				, "BOM_SYSTEM_CONFIG"
				, "COMPETITIVE_NAME"
				, "COMP_PRODUCT_CPU_OTHER"
				, "COMP_PRODUCT_CS_OTHER"
				, "COMPETITIVE_PRODUCT_CPU"
				, "COMPETITIVE_PRODUCT_CS"
				, "REQ_BY"
				, "DEAL_DESC"
				, "PAYOUT_BASED_ON"
				, "REQ_DT"
				, "LAST_MOD_BY"
				, "ECAP_TYPE"
				, "LAST_MOD_DT"
				,  "SERVER_DEAL_TYPE"
				,  "END_CUSTOMER_RETAIL"
				,  "ON_ADD_DT"
				,  "RETAIL_SHP_AHEAD_DT"
				,  "CONSUMPTION_REASON"
				,  "CONSUMPTION_REASON_CMNT"
				,  "CS_SHIP_AHEAD_STRT_DT"
				,  "CS_SHIP_AHEAD_END_DT"
				,  "IDMS_SHEET_COMMENT"
				,  "RETAIL_CYCLE"
				,  "MRKT_SEG_COMBINED"
				,  "PROGRAM_PAYMENT"
				,  "TENDER_PRICE"
				,  "YCS2_OVERLAP_OVERRIDE"
				,  "EXPIRE_YCS2"
				,  "REBATE_PMT"
				,  "REBATE_QTY"
				,  "REBATE_DISTI"
				,  "QLTR_PROJECT"
				,  "QLTR_TERMS"
				,  "REBATE_BILLING_START"
				,  "REBATE_BILLING_END"
				,  "REBATE_OA_MAX_VOL"
				,  "REBATE_OA_MAX_AMT"
				,  "REBATE_DEAL_ID"
				,  "DEAL_CORP_ACCNT_DIV"
				,  "DEAL_COMB_TYPE"
				,  "BACK_DATE_RSN"
				,  "BACK_DATE_RSN_TXT"
				,  "CREDIT_VOLUME"
				,  "DEBIT_VOLUME"
				,  "CREDIT_AMT"
				,  "DEBIT_AMT"
				,  "BLLG_DT"
				,  "DIVISION_APPROVAL_PRICE"
				,  "ECAP_PRICE"
				,  "FSE_APPROVED_PRICE"
				,  "GEO_APPROVED_PRICE"
				,  "TRGT_RGN"
				,  "TRKR_NBR"
				,  "TRGT_RGN_CHK"
				,  "PRD_LEVEL"
				,  "CAP"
				,  "DEAL_MSP_PRC"
				,  "TRKR_START_DT"
				,  "TRKR_END_DT"
				,  "DEAL_MM_MEDIA_CD"
				,  "PNL_SPLIT"
				,  "PRD_BUCKET_CHK"
				,  "PLI_LOCATOR"
				,  "DEAL_TYPE_CD_SID"
				,  "TRKR_NBR_DT_LTR"
				,  "CUST_MBR_SID"
				,  "CS_SPLIT"
				,  "PERFORM_CTST"
			};
			List<string> pliList = new List<string> {
				 "PLI_NET_PRICE_CONCATE"
				, "MEETCOMP_TEST_RESULT"
				, "COST_TEST_RESULT"
				, "COST_FORMULA"
				, "COST_TEST_INCOMPLETE_REASON"
				, "ECAP_PRICE"
				, "END_VOL"
				, "PROGRAM_TYPE"
				, "STRT_VOL"
				, "TOTAL_DOLLAR_AMOUNT"
				, "DEAL_DESC"
				, "PAYOUT_BASED_ON"
				, "RATE"
				, "CAP"
				, "STRT_CAP"
				, "END_CAP"
				, "DEAL_MM_MEDIA_CD"
				, "REMARKS"
				, "PRI_PROD"
				, "SEC_PROD"
				, "YCS2_PRC_IRBT"
				, "YCS2_START_DT"
				, "YCS2_END_DT"
				, "PLI_COST"
				, "PLI_COST_TYPE_USED"
				, "AGRMNT_NM"
				, "PLI_DTL_QSTN"
				, "DEAL_TYPE_CD"
				, "CUST_MBR_SID"
				, "START_DT"
				, "END_DT"
				, "DEAL_CUST_NM"
				, "DEAL_CUST_DIV_NM"
				, "RETAIL_CYCLE"
				, "MRKT_SEG_COMBINED"
				, "NUM_OF_TIERS"
				, "REBATE_BILLING_START"
				, "REBATE_BILLING_END"
				, "BACK_DATE_RSN"
				, "BACK_DATE_RSN_TXT"
				, "MAX_RPU"
				, "AVG_RPU"
				, "FRCST_VOL"
				, "MCAR_OVERRIDE"
				, "MCAR_OVERRIDE_CMNT"
				, "PCAR_OVERRIDE"
				, "PCAR_OVERRIDE_CMNT"
				, "RPU_OVERRIDE_CMNT"
				, "BLNDNG_GEO_SUMRY"
				, "RETAIL_PULL_USR_DEF"
				, "RETAIL_PULL_USR_DEF_CMNT"
				, "GEO_COMBINED"
				, "PLI_COMP_SKU"
				, "PLI_COMP_SKU_OTHR"
				, "PLI_COMP_PRICE"
				, "PLI_CPU_BENCH"
				, "PLI_COMP_BENCH"
				, "RPU_CALC_TYPE"
				, "VIP_MAX_PCT"
				, "VIP_AVG_PCT"
				, "NO_CRE_DEAL"
				, "PLI_CAP_TYPE"
				, "PLI_ODM_CAP"
			};
			List<string> programlist = new List<string> {
				"DIV_APPROVED_BY"
				,"DIV_APPROVED_DT"
				,"GEO_APPROVED_BY"
				,"GEO_APPROVED_DT"
				,"FSE_APPROVED_BY_FACT"
				,"FSE_APPROVED_DT_FACT"
				,"GEO_REQUESTED_BY"
				,"FSE_REQUESTED_BY_FACT"
				,"BMT_APPROVED_BY"
				,"MMBP_APPROVED_DT"
				, "MMBP_APPROVED_BY"
				, "C2A_DATA_C2A_ID"
				, "PARENT_LINEUP_SID"
				, "C2A_DATA_CUSTOMER_STATUS"
				, "C2A_DATA_OVERRIDE"
				, "C2A_CTRCT_NM"
				, "COMMENTS"
				, "DEAL_OFF_ROADMAP_FLG"
				, "ON_ADD_DT"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_PLI_NET_PRICE_CONCATE"
				, "DEAL_PLI_MEETCOMP_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_INCOMPLETE_REASON"
				, "DEAL_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_RESULT"
				, "DEAL_COST_TEST_RESULT"
				, "PRODUCT_FILTER"
				, "DEAL_TYPE_CD"
				, "DEAL_NBR"
				, "START_DT"
				, "END_DT"
				, "DEAL_STG_CD"
				, "DEAL_CUST_NM"
				, "YEAR"
				, "QTR"
				, "DEAL_CUST_DIV_NM"
				, "RETAIL_CYCLE"
				, "PRD_NM_COMBINED"
				, "ECAP_PRICE_DSP"
				, "CONSUMPTION_REASON_DSP"
				, "PRD_INACTIVE_FLG"
				, "PRICE_AGREEMENT_GRP"
				, "PROG_VOLTIER_NM"
				, "LINE_NBR"
				, "REQ_BY"
				, "PAYOUT_BASED_ON"
				, "REQ_DT"
				, "LAST_MOD_BY"
				, "LAST_MOD_DT"
				, "END_CUSTOMER_RETAIL"
				, "CONSUMPTION_REASON"
				, "CONSUMPTION_REASON_CMNT"
				, "MRKT_SEG_COMBINED"
				, "DEAL_PGM_TYPE"
				, "PROGRAM_PAYMENT"
				, "ORIG_ECAP_TRKR_NBR"
				, "ADJ_ECAP_UNIT"
				, "REBATE_PMT"
				, "REBATE_QTY"
				, "REBATE_DISTI"
				, "REBATE_BILLING_START"
				, "REBATE_BILLING_END"
				, "REBATE_OA_MAX_VOL"
				, "REBATE_OA_MAX_AMT"
				, "REBATE_DEAL_ID"
				, "DEAL_CORP_ACCNT_DIV"
				, "DEAL_COMB_TYPE"
				, "BACK_DATE_RSN"
				, "BACK_DATE_RSN_TXT"
				, "PROGRAM_GEO"
				, "PROGRAM_GEO_COMBINED"
				, "PROGRAM_TYPE"
				, "TOTAL_DOLLAR_AMOUNT"
				, "TRKR_NBR"
				, "WF_STG_CD"
				, "DEAL_DESC"
				, "PRODUCT_TITLE"
				, "PGM_TYPE_CHK"
				, "PRD_LEVEL"
				, "TRKR_START_DT"
				, "TRKR_END_DT"
				, "DEAL_MM_MEDIA_CD"
				, "PLI_LOCATOR"
				, "DEAL_TYPE_CD_SID"
				, "TRKR_NBR_DT_LTR"
				, "CUST_MBR_SID"
				, "SA_COST_TEST_RESULTS"
				, "PERFORM_CTST"
			};
			List<string> volTierList = new List<string> {
				"DIV_APPROVED_BY"
				,"DIV_APPROVED_DT"
				,"GEO_APPROVED_BY"
				,"GEO_APPROVED_DT"
				,"FSE_APPROVED_BY_FACT"
				,"FSE_APPROVED_DT_FACT"
				,"GEO_REQUESTED_BY"
				,"FSE_REQUESTED_BY_FACT"
				,"C2A_DATA_C2A_ID"
				,"PARENT_LINEUP_SID"
				, "C2A_DATA_CUSTOMER_STATUS"
				, "C2A_DATA_OVERRIDE"
				, "C2A_CTRCT_NM"
				, "COMMENTS"
				, "COST_TEST_OVERRIDE"
				, "LEGAL_COMMENTS"
				, "SA_COST_TEST_RESULTS"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_PLI_PLI_NET_PRICE_CONCATE"
				, "DEAL_PLI_MEETCOMP_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_RESULT"
				, "DEAL_PLI_COST_TEST_INCOMPLETE_REASON"
				, "DEAL_COST_TEST_FAIL_OVERRIDE"
				, "DEAL_COST_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE"
				, "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON"
				, "DEAL_MEETCOMP_TEST_RESULT"
				, "DEAL_COST_TEST_RESULT"
				, "PRODUCT_FILTER"
				, "PRODUCT_TITLE"
				, "DEAL_TYPE_CD"
				, "DEAL_NBR"
				, "START_DT"
				, "END_DT"
				, "DEAL_STG_CD"
				, "DEAL_CUST_NM"
				, "YEAR"
				, "QTR"
				, "DEAL_CUST_DIV_NM"
				, "RETAIL_CYCLE"
				, "PRD_NM_COMBINED"
				, "ECAP_PRICE_DSP"
				, "CONSUMPTION_REASON_DSP"
				, "PRD_INACTIVE_FLG"
				, "PRICE_AGREEMENT_GRP"
				, "PROG_VOLTIER_NM"
				, "LINE_NBR"
				, "KIT_CHK"
				, "NUM_OF_TIERS"
				, "REQ_BY"
				, "DEAL_DESC"
				, "PAYOUT_BASED_ON"
				, "REQ_DT"
				, "LAST_MOD_BY"
				, "LAST_MOD_DT"
				, "END_CUSTOMER_RETAIL"
				, "RATE_BASED_ON"
				, "PORTFOLIO"
				, "CONSUMPTION_REASON"
				, "CONSUMPTION_REASON_CMNT"
				, "MRKT_SEG_COMBINED"
				, "PROGRAM_PAYMENT"
				, "REBATE_PMT"
				, "REBATE_QTY"
				, "REBATE_DISTI"
				, "REBATE_BILLING_START"
				, "REBATE_BILLING_END"
				, "REBATE_OA_MAX_VOL"
				, "REBATE_OA_MAX_AMT"
				, "REBATE_DEAL_ID"
				, "DEAL_CORP_ACCNT_DIV"
				, "PROGRAM_TYPE_VOL_TIER"
				, "DEAL_COMB_TYPE"
				, "BACK_DATE_RSN"
				, "BACK_DATE_RSN_TXT"
				, "END_VOL"
				, "STRT_VOL"
				, "TIER_NBR"
				, "TRGT_RGN"
				, "TRKR_NBR"
				, "WF_STG_CD"
				, "TRGT_RGN_CHK"
				, "RATE"
				, "PRD_LEVEL"
				, "TRKR_START_DT"
				, "TRKR_END_DT"
				, "DEAL_MM_MEDIA_CD"
				, "PNL_SPLIT"
				, "PLI_LOCATOR"
				, "DEAL_TYPE_CD_SID"
				, "TRKR_NBR_DT_LTR"
				, "CUST_MBR_SID"
				, "PERFORM_CTST"
				, "BAND_TYPE"
			};
			#endregion

			testList.Add("CAP BAND", capBandList);
			testList.Add("DEAL_GRP", dealGrpList);
			testList.Add("ECAP", ecapList);
			testList.Add("PLI", pliList);
			testList.Add("PROGRAM", programlist);
			testList.Add("VOL TIER", volTierList);

			return testList;
		}

		#endregion

		public SecurityWrapper GetSecurityMasks()
		{
			List<OpRoleType> opRoleTypes = new List<OpRoleType>();

			List<SecurityAttribute> securityActions = new List<SecurityAttribute>();
			// TODO: Remove and replace with dynamic data 
			#region security Actions Hard-coded
			SecurityAttribute atest7 = new SecurityAttribute { FACT_ATRB_CD = "ACTIVE", ATRB_BIT = 0, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest8 = new SecurityAttribute { FACT_ATRB_CD = "ADJ_ECAP_UNIT", ATRB_BIT = 13, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest9 = new SecurityAttribute { FACT_ATRB_CD = "ADMIN_TOOL_LINK", ATRB_BIT = 3, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest10 = new SecurityAttribute { FACT_ATRB_CD = "AGRMNT_GUID", ATRB_BIT = 14, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest11 = new SecurityAttribute { FACT_ATRB_CD = "AGRMNT_NM", ATRB_BIT = 9, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest12 = new SecurityAttribute { FACT_ATRB_CD = "ALL_DEAL_NM", ATRB_BIT = 11, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest13 = new SecurityAttribute { FACT_ATRB_CD = "ASP_BND_DESC", ATRB_BIT = 1, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest14 = new SecurityAttribute { FACT_ATRB_CD = "ASP_PRC", ATRB_BIT = 2, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest15 = new SecurityAttribute { FACT_ATRB_CD = "AVG_RPU", ATRB_BIT = 0, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest16 = new SecurityAttribute { FACT_ATRB_CD = "BACK_DATE_RSN", ATRB_BIT = 11, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest17 = new SecurityAttribute { FACT_ATRB_CD = "BACK_DATE_RSN_TXT", ATRB_BIT = 12, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest18 = new SecurityAttribute { FACT_ATRB_CD = "BAND_TYPE", ATRB_BIT = 0, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest19 = new SecurityAttribute { FACT_ATRB_CD = "BLLG_DT", ATRB_BIT = 11, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest20 = new SecurityAttribute { FACT_ATRB_CD = "BLNDNG_GEO_SUMRY", ATRB_BIT = 0, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest21 = new SecurityAttribute { FACT_ATRB_CD = "BMT_APPROVED_BY", ATRB_BIT = 14, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest22 = new SecurityAttribute { FACT_ATRB_CD = "BMT_APPROVED_DT", ATRB_BIT = 3, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest23 = new SecurityAttribute { FACT_ATRB_CD = "BMT_REQUESTED_BY", ATRB_BIT = 6, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest24 = new SecurityAttribute { FACT_ATRB_CD = "BOM_SYSTEM_CONFIG", ATRB_BIT = 8, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest25 = new SecurityAttribute { FACT_ATRB_CD = "BUFFER_PCT", ATRB_BIT = 10, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest26 = new SecurityAttribute { FACT_ATRB_CD = "BUFFER_PCT_DETAIL", ATRB_BIT = 15, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest27 = new SecurityAttribute { FACT_ATRB_CD = "C2A_CTRCT_NM", ATRB_BIT = 10, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest28 = new SecurityAttribute { FACT_ATRB_CD = "C2A_DATA_C2A_ID", ATRB_BIT = 12, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest29 = new SecurityAttribute { FACT_ATRB_CD = "C2A_DATA_CUSTOMER_STATUS", ATRB_BIT = 14, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest30 = new SecurityAttribute { FACT_ATRB_CD = "C2A_DATA_OVERRIDE", ATRB_BIT = 15, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest31 = new SecurityAttribute { FACT_ATRB_CD = "C2A_UPLOADS_LINK", ATRB_BIT = 1, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest32 = new SecurityAttribute { FACT_ATRB_CD = "CAP", ATRB_BIT = 4, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest33 = new SecurityAttribute { FACT_ATRB_CD = "COGNOS_REPORT_LINK", ATRB_BIT = 4, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest34 = new SecurityAttribute { FACT_ATRB_CD = "COLUMN_CALC_BASED_ON", ATRB_BIT = 6, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest35 = new SecurityAttribute { FACT_ATRB_CD = "COMMENTS", ATRB_BIT = 4, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest36 = new SecurityAttribute { FACT_ATRB_CD = "COMMENT_HISTORY", ATRB_BIT = 3, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest37 = new SecurityAttribute { FACT_ATRB_CD = "COMPETITIVE_NAME", ATRB_BIT = 9, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest38 = new SecurityAttribute { FACT_ATRB_CD = "COMPETITIVE_PRICE", ATRB_BIT = 6, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest39 = new SecurityAttribute { FACT_ATRB_CD = "COMPETITIVE_PRODUCT", ATRB_BIT = 5, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest40 = new SecurityAttribute { FACT_ATRB_CD = "COMPETITIVE_PRODUCT_CPU", ATRB_BIT = 8, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest41 = new SecurityAttribute { FACT_ATRB_CD = "COMPETITIVE_PRODUCT_CS", ATRB_BIT = 9, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest42 = new SecurityAttribute { FACT_ATRB_CD = "COMP_PRICE_CPU", ATRB_BIT = 2, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest43 = new SecurityAttribute { FACT_ATRB_CD = "COMP_PRICE_CS", ATRB_BIT = 3, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest44 = new SecurityAttribute { FACT_ATRB_CD = "COMP_PRODUCT_CPU_OTHER", ATRB_BIT = 6, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest45 = new SecurityAttribute { FACT_ATRB_CD = "COMP_PRODUCT_CS_OTHER", ATRB_BIT = 7, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest46 = new SecurityAttribute { FACT_ATRB_CD = "COMP_TARGET_SYSTEM_PRICE", ATRB_BIT = 7, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest47 = new SecurityAttribute { FACT_ATRB_CD = "CONSUMPTION_REASON", ATRB_BIT = 10, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest48 = new SecurityAttribute { FACT_ATRB_CD = "CONSUMPTION_REASON_CMNT", ATRB_BIT = 11, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest49 = new SecurityAttribute { FACT_ATRB_CD = "CONSUMPTION_REASON_DSP", ATRB_BIT = 9, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest50 = new SecurityAttribute { FACT_ATRB_CD = "COST_DELTA", ATRB_BIT = 8, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest51 = new SecurityAttribute { FACT_ATRB_CD = "COST_FORMULA", ATRB_BIT = 4, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest52 = new SecurityAttribute { FACT_ATRB_CD = "COST_TEST_INCOMPLETE_REASON", ATRB_BIT = 5, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest53 = new SecurityAttribute { FACT_ATRB_CD = "COST_TEST_OVERRIDE", ATRB_BIT = 7, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest54 = new SecurityAttribute { FACT_ATRB_CD = "COST_TEST_RESULT", ATRB_BIT = 3, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest55 = new SecurityAttribute { FACT_ATRB_CD = "COST_TYPE_USED", ATRB_BIT = 9, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest56 = new SecurityAttribute { FACT_ATRB_CD = "CPU_COST_TYPE_USED", ATRB_BIT = 10, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest57 = new SecurityAttribute { FACT_ATRB_CD = "CPU_PULL_DLR", ATRB_BIT = 2, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest58 = new SecurityAttribute { FACT_ATRB_CD = "CPU_PULL_DLR_SDM", ATRB_BIT = 6, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest59 = new SecurityAttribute { FACT_ATRB_CD = "CPU_SPLIT", ATRB_BIT = 10, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest60 = new SecurityAttribute { FACT_ATRB_CD = "CPY_TO_SAP_IND", ATRB_BIT = 11, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest61 = new SecurityAttribute { FACT_ATRB_CD = "CREDIT_AMT", ATRB_BIT = 0, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest62 = new SecurityAttribute { FACT_ATRB_CD = "CREDIT_VOLUME", ATRB_BIT = 14, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest63 = new SecurityAttribute { FACT_ATRB_CD = "CST_CAP", ATRB_BIT = 13, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest64 = new SecurityAttribute { FACT_ATRB_CD = "CST_CPU_COST", ATRB_BIT = 8, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest65 = new SecurityAttribute { FACT_ATRB_CD = "CST_CPU_FINAL_COST", ATRB_BIT = 15, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest66 = new SecurityAttribute { FACT_ATRB_CD = "CST_CPU_SA", ATRB_BIT = 2, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest67 = new SecurityAttribute { FACT_ATRB_CD = "CST_CPU_SA_MAX", ATRB_BIT = 4, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest68 = new SecurityAttribute { FACT_ATRB_CD = "CST_CPU_SA_MIN", ATRB_BIT = 3, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest69 = new SecurityAttribute { FACT_ATRB_CD = "CST_CS_COST", ATRB_BIT = 9, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest70 = new SecurityAttribute { FACT_ATRB_CD = "CST_CS_FINAL_COST", ATRB_BIT = 0, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest71 = new SecurityAttribute { FACT_ATRB_CD = "CST_CS_SA", ATRB_BIT = 5, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest72 = new SecurityAttribute { FACT_ATRB_CD = "CST_CS_SA_MAX", ATRB_BIT = 7, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest73 = new SecurityAttribute { FACT_ATRB_CD = "CST_CS_SA_MIN", ATRB_BIT = 6, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest74 = new SecurityAttribute { FACT_ATRB_CD = "CST_DEAL_PRD_MBR_SID", ATRB_BIT = 14, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest75 = new SecurityAttribute { FACT_ATRB_CD = "CST_ECAP_PRICE", ATRB_BIT = 2, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest76 = new SecurityAttribute { FACT_ATRB_CD = "CST_KIT_ECAP", ATRB_BIT = 15, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest77 = new SecurityAttribute { FACT_ATRB_CD = "CST_KIT_ECAP_MAX", ATRB_BIT = 1, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest78 = new SecurityAttribute { FACT_ATRB_CD = "CST_KIT_ECAP_MIN", ATRB_BIT = 0, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest79 = new SecurityAttribute { FACT_ATRB_CD = "CST_MAX_BAND_RATE", ATRB_BIT = 14, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest80 = new SecurityAttribute { FACT_ATRB_CD = "CST_TEST_RUN_DT", ATRB_BIT = 11, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest81 = new SecurityAttribute { FACT_ATRB_CD = "CS_COST_TYPE_USED", ATRB_BIT = 11, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest82 = new SecurityAttribute { FACT_ATRB_CD = "CS_SHIP_AHEAD_DT", ATRB_BIT = 0, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest83 = new SecurityAttribute { FACT_ATRB_CD = "CS_SHIP_AHEAD_END_DT", ATRB_BIT = 13, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest84 = new SecurityAttribute { FACT_ATRB_CD = "CS_SHIP_AHEAD_STRT_DT", ATRB_BIT = 12, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest85 = new SecurityAttribute { FACT_ATRB_CD = "CS_SPLIT", ATRB_BIT = 11, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest86 = new SecurityAttribute { FACT_ATRB_CD = "CUST_GEO_SEG_ASGN", ATRB_BIT = 10, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest87 = new SecurityAttribute { FACT_ATRB_CD = "CUST_MBR_SID", ATRB_BIT = 1, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest88 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_COMB_TYPE", ATRB_BIT = 9, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest89 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_CORP_ACCNT_DIV", ATRB_BIT = 7, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest90 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_COST_TEST_FAIL_OVERRIDE", ATRB_BIT = 14, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest91 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_COST_TEST_FAIL_OVERRIDE_REASON", ATRB_BIT = 15, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest92 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_COST_TEST_RESULT", ATRB_BIT = 3, ATRB_MAGNITUDE = 18 };
			SecurityAttribute atest93 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_CUST_DIV_NM", ATRB_BIT = 4, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest94 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_CUST_NM", ATRB_BIT = 10, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest95 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_DESC", ATRB_BIT = 11, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest96 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_GROUP_LOCK", ATRB_BIT = 7, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest97 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_GRP_NM", ATRB_BIT = 4, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest98 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE", ATRB_BIT = 0, ATRB_MAGNITUDE = 18 };
			SecurityAttribute atest99 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE_REASON", ATRB_BIT = 1, ATRB_MAGNITUDE = 18 };
			SecurityAttribute atest100 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_MEETCOMP_TEST_RESULT", ATRB_BIT = 2, ATRB_MAGNITUDE = 18 };
			SecurityAttribute atest101 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_MM_MEDIA_CD", ATRB_BIT = 13, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest102 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_MSP_PRC", ATRB_BIT = 5, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest103 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_NBR", ATRB_BIT = 13, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest104 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_OFF_ROADMAP_FLG", ATRB_BIT = 1, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest105 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PGM_TYPE", ATRB_BIT = 1, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest106 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_COST_TEST_FAIL_OVERRIDE", ATRB_BIT = 6, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest107 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_COST_TEST_FAIL_OVERRIDE_REASON", ATRB_BIT = 7, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest108 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_COST_TEST_INCOMPLETE_REASON", ATRB_BIT = 13, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest109 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_COST_TEST_RESULT", ATRB_BIT = 12, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest110 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE", ATRB_BIT = 8, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest111 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_MEETCOMP_TEST_FAIL_OVERRIDE_REASON", ATRB_BIT = 9, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest112 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_MEETCOMP_TEST_RESULT", ATRB_BIT = 11, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest113 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PLI_PLI_NET_PRICE_CONCATE", ATRB_BIT = 10, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest114 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PRC_CONFLICT", ATRB_BIT = 6, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest115 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PRD_ATRB", ATRB_BIT = 5, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest116 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PROGRAM_TYPE_ALT", ATRB_BIT = 2, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest117 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_PROGRAM_TYPE_GEN", ATRB_BIT = 3, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest118 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_SID", ATRB_BIT = 15, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest119 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_SOLD_TO_ID", ATRB_BIT = 10, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest120 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_STG_CD", ATRB_BIT = 12, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest121 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_TYPE_CD", ATRB_BIT = 12, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest122 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_TYPE_CD_SID", ATRB_BIT = 14, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest123 = new SecurityAttribute { FACT_ATRB_CD = "DEAL_TYPE_DESC", ATRB_BIT = 0, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest124 = new SecurityAttribute { FACT_ATRB_CD = "DEBIT_AMT", ATRB_BIT = 1, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest125 = new SecurityAttribute { FACT_ATRB_CD = "DEBIT_VOLUME", ATRB_BIT = 15, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest126 = new SecurityAttribute { FACT_ATRB_CD = "DIVISION_APPROVAL_PRICE", ATRB_BIT = 3, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest127 = new SecurityAttribute { FACT_ATRB_CD = "DIVISION_APPROVED_LIMIT", ATRB_BIT = 3, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest128 = new SecurityAttribute { FACT_ATRB_CD = "DIV_APPROVED_BY", ATRB_BIT = 6, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest129 = new SecurityAttribute { FACT_ATRB_CD = "DIV_APPROVED_DT", ATRB_BIT = 7, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest130 = new SecurityAttribute { FACT_ATRB_CD = "ECAP_FLR", ATRB_BIT = 14, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest131 = new SecurityAttribute { FACT_ATRB_CD = "ECAP_PRICE", ATRB_BIT = 4, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest132 = new SecurityAttribute { FACT_ATRB_CD = "ECAP_PRICE_DSP", ATRB_BIT = 8, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest133 = new SecurityAttribute { FACT_ATRB_CD = "ECAP_TYPE", ATRB_BIT = 13, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest134 = new SecurityAttribute { FACT_ATRB_CD = "ENABLE_ECAP_VALIDATION_CONF", ATRB_BIT = 12, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest135 = new SecurityAttribute { FACT_ATRB_CD = "END_CAP", ATRB_BIT = 11, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest136 = new SecurityAttribute { FACT_ATRB_CD = "END_CUSTOMER_RETAIL", ATRB_BIT = 2, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest137 = new SecurityAttribute { FACT_ATRB_CD = "END_DT", ATRB_BIT = 8, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest138 = new SecurityAttribute { FACT_ATRB_CD = "END_VOL", ATRB_BIT = 5, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest139 = new SecurityAttribute { FACT_ATRB_CD = "EXPIRE_YCS2", ATRB_BIT = 15, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest140 = new SecurityAttribute { FACT_ATRB_CD = "FILE_ATTCH_SHARE_DRIVE", ATRB_BIT = 6, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest141 = new SecurityAttribute { FACT_ATRB_CD = "FILE_NAME", ATRB_BIT = 6, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest142 = new SecurityAttribute { FACT_ATRB_CD = "FILE_PATH", ATRB_BIT = 7, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest143 = new SecurityAttribute { FACT_ATRB_CD = "FILE_URL", ATRB_BIT = 8, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest144 = new SecurityAttribute { FACT_ATRB_CD = "FRCST_VOL", ATRB_BIT = 2, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest145 = new SecurityAttribute { FACT_ATRB_CD = "FSE_APPROVED_BY", ATRB_BIT = 4, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest146 = new SecurityAttribute { FACT_ATRB_CD = "FSE_APPROVED_BY_FACT", ATRB_BIT = 10, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest147 = new SecurityAttribute { FACT_ATRB_CD = "FSE_APPROVED_DT", ATRB_BIT = 5, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest148 = new SecurityAttribute { FACT_ATRB_CD = "FSE_APPROVED_DT_FACT", ATRB_BIT = 11, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest149 = new SecurityAttribute { FACT_ATRB_CD = "FSE_APPROVED_PRICE", ATRB_BIT = 9, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest150 = new SecurityAttribute { FACT_ATRB_CD = "FSE_REQUESTED_BY", ATRB_BIT = 7, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest151 = new SecurityAttribute { FACT_ATRB_CD = "FSE_REQUESTED_BY_FACT", ATRB_BIT = 1, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest152 = new SecurityAttribute { FACT_ATRB_CD = "FSE_REQUESTED_PRICE", ATRB_BIT = 14, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest153 = new SecurityAttribute { FACT_ATRB_CD = "GEO_APPROVED_BY", ATRB_BIT = 8, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest154 = new SecurityAttribute { FACT_ATRB_CD = "GEO_APPROVED_DT", ATRB_BIT = 9, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest155 = new SecurityAttribute { FACT_ATRB_CD = "GEO_APPROVED_PRICE", ATRB_BIT = 10, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest156 = new SecurityAttribute { FACT_ATRB_CD = "GEO_COMBINED", ATRB_BIT = 3, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest157 = new SecurityAttribute { FACT_ATRB_CD = "GEO_REQUESTED_BY", ATRB_BIT = 0, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest158 = new SecurityAttribute { FACT_ATRB_CD = "GEO_REQUESTED_PRICE", ATRB_BIT = 15, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest159 = new SecurityAttribute { FACT_ATRB_CD = "GEO_STG_ID", ATRB_BIT = 11, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest160 = new SecurityAttribute { FACT_ATRB_CD = "HELP_LINK", ATRB_BIT = 5, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest161 = new SecurityAttribute { FACT_ATRB_CD = "HIST_ECAP_PRICE", ATRB_BIT = 9, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest162 = new SecurityAttribute { FACT_ATRB_CD = "IDMS_SHEET_COMMENT", ATRB_BIT = 14, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest163 = new SecurityAttribute { FACT_ATRB_CD = "KIT_CHK", ATRB_BIT = 15, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest164 = new SecurityAttribute { FACT_ATRB_CD = "L4_PRODUCT_NAME", ATRB_BIT = 10, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest165 = new SecurityAttribute { FACT_ATRB_CD = "LAR_FLR", ATRB_BIT = 12, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest166 = new SecurityAttribute { FACT_ATRB_CD = "LAST_MOD_BY", ATRB_BIT = 11, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest167 = new SecurityAttribute { FACT_ATRB_CD = "LAST_MOD_DT", ATRB_BIT = 14, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest168 = new SecurityAttribute { FACT_ATRB_CD = "LEGAL_COMMENTS", ATRB_BIT = 8, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest169 = new SecurityAttribute { FACT_ATRB_CD = "LINE_NBR", ATRB_BIT = 5, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest170 = new SecurityAttribute { FACT_ATRB_CD = "MARKET_SEGMENT", ATRB_BIT = 12, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest171 = new SecurityAttribute { FACT_ATRB_CD = "MAX_AAC", ATRB_BIT = 2, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest172 = new SecurityAttribute { FACT_ATRB_CD = "MAX_AAC_SEC", ATRB_BIT = 6, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest173 = new SecurityAttribute { FACT_ATRB_CD = "MAX_CASH", ATRB_BIT = 3, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest174 = new SecurityAttribute { FACT_ATRB_CD = "MAX_CASH_SEC", ATRB_BIT = 7, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest175 = new SecurityAttribute { FACT_ATRB_CD = "MAX_PCOS", ATRB_BIT = 1, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest176 = new SecurityAttribute { FACT_ATRB_CD = "MAX_PCOS_SEC", ATRB_BIT = 5, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest177 = new SecurityAttribute { FACT_ATRB_CD = "MAX_RPU", ATRB_BIT = 15, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest178 = new SecurityAttribute { FACT_ATRB_CD = "MAX_VARIABLE", ATRB_BIT = 4, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest179 = new SecurityAttribute { FACT_ATRB_CD = "MAX_VARIABLE_SEC", ATRB_BIT = 8, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest180 = new SecurityAttribute { FACT_ATRB_CD = "MCAR_OVERRIDE", ATRB_BIT = 5, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest181 = new SecurityAttribute { FACT_ATRB_CD = "MCAR_OVERRIDE_CMNT", ATRB_BIT = 6, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest182 = new SecurityAttribute { FACT_ATRB_CD = "MCA_PRI_PROD", ATRB_BIT = 3, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest183 = new SecurityAttribute { FACT_ATRB_CD = "MCA_SEC_PROD", ATRB_BIT = 4, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest184 = new SecurityAttribute { FACT_ATRB_CD = "MEETCOMP_TEST_RESULT", ATRB_BIT = 2, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest185 = new SecurityAttribute { FACT_ATRB_CD = "MEET_COMP_PRICE_QSTN", ATRB_BIT = 8, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest186 = new SecurityAttribute { FACT_ATRB_CD = "META_DATA_SOURCE", ATRB_BIT = 1, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest187 = new SecurityAttribute { FACT_ATRB_CD = "META_DEAL_MISC", ATRB_BIT = 0, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest188 = new SecurityAttribute { FACT_ATRB_CD = "MMBP_APPROVED_BY", ATRB_BIT = 0, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest189 = new SecurityAttribute { FACT_ATRB_CD = "MMBP_APPROVED_DT", ATRB_BIT = 15, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest190 = new SecurityAttribute { FACT_ATRB_CD = "MRKT_SEG", ATRB_BIT = 4, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest191 = new SecurityAttribute { FACT_ATRB_CD = "MRKT_SEG_COMBINED", ATRB_BIT = 4, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest192 = new SecurityAttribute { FACT_ATRB_CD = "NORTHBRIDGE_SPLIT", ATRB_BIT = 12, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest193 = new SecurityAttribute { FACT_ATRB_CD = "NO_CRE_DEAL", ATRB_BIT = 14, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest194 = new SecurityAttribute { FACT_ATRB_CD = "NUM_OF_TIERS", ATRB_BIT = 0, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest195 = new SecurityAttribute { FACT_ATRB_CD = "ON_ADD_DT", ATRB_BIT = 2, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest196 = new SecurityAttribute { FACT_ATRB_CD = "ORIG_ECAP_TRKR_NBR", ATRB_BIT = 12, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest197 = new SecurityAttribute { FACT_ATRB_CD = "OVERLAPPING_DEALS", ATRB_BIT = 9, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest198 = new SecurityAttribute { FACT_ATRB_CD = "OVERLAP_OVERRIDE", ATRB_BIT = 2, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest199 = new SecurityAttribute { FACT_ATRB_CD = "PARENT_LINEUP_SID", ATRB_BIT = 13, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest200 = new SecurityAttribute { FACT_ATRB_CD = "PAYOUT_BASED_ON", ATRB_BIT = 12, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest201 = new SecurityAttribute { FACT_ATRB_CD = "PCAR_OVERRIDE", ATRB_BIT = 9, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest202 = new SecurityAttribute { FACT_ATRB_CD = "PCAR_OVERRIDE_CMNT", ATRB_BIT = 10, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest203 = new SecurityAttribute { FACT_ATRB_CD = "PCA_PRI_PROD", ATRB_BIT = 7, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest204 = new SecurityAttribute { FACT_ATRB_CD = "PCA_SEC_PROD", ATRB_BIT = 8, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest205 = new SecurityAttribute { FACT_ATRB_CD = "PERFORM_CTST", ATRB_BIT = 14, ATRB_MAGNITUDE = 12 };
			SecurityAttribute atest206 = new SecurityAttribute { FACT_ATRB_CD = "PGM_TYPE_CHK", ATRB_BIT = 15, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest207 = new SecurityAttribute { FACT_ATRB_CD = "PLI_CAP_TYPE", ATRB_BIT = 15, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest208 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COMP_BENCH", ATRB_BIT = 10, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest209 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COMP_PRICE", ATRB_BIT = 6, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest210 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COMP_SKU", ATRB_BIT = 4, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest211 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COMP_SKU_OTHR", ATRB_BIT = 5, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest212 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COST", ATRB_BIT = 6, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest213 = new SecurityAttribute { FACT_ATRB_CD = "PLI_COST_TYPE_USED", ATRB_BIT = 7, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest214 = new SecurityAttribute { FACT_ATRB_CD = "PLI_CPU_BENCH", ATRB_BIT = 9, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest215 = new SecurityAttribute { FACT_ATRB_CD = "PLI_DTL_QSTN", ATRB_BIT = 10, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest216 = new SecurityAttribute { FACT_ATRB_CD = "PLI_GUID", ATRB_BIT = 13, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest217 = new SecurityAttribute { FACT_ATRB_CD = "PLI_LOCATOR", ATRB_BIT = 8, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest218 = new SecurityAttribute { FACT_ATRB_CD = "PLI_NET_PRICE_CONCATE", ATRB_BIT = 1, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest219 = new SecurityAttribute { FACT_ATRB_CD = "PLI_ODM_CAP", ATRB_BIT = 0, ATRB_MAGNITUDE = 17 };
			SecurityAttribute atest220 = new SecurityAttribute { FACT_ATRB_CD = "PLI_SORT_ORD", ATRB_BIT = 15, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest221 = new SecurityAttribute { FACT_ATRB_CD = "PNL_SPLIT", ATRB_BIT = 14, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest222 = new SecurityAttribute { FACT_ATRB_CD = "PORTFOLIO", ATRB_BIT = 5, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest223 = new SecurityAttribute { FACT_ATRB_CD = "PRD_BUCKET_CHK", ATRB_BIT = 15, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest224 = new SecurityAttribute { FACT_ATRB_CD = "PRD_COST_DETAIL", ATRB_BIT = 14, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest225 = new SecurityAttribute { FACT_ATRB_CD = "PRD_COST_FINAL", ATRB_BIT = 13, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest226 = new SecurityAttribute { FACT_ATRB_CD = "PRD_CST", ATRB_BIT = 9, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest227 = new SecurityAttribute { FACT_ATRB_CD = "PRD_ID_EXCLUDE", ATRB_BIT = 12, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest228 = new SecurityAttribute { FACT_ATRB_CD = "PRD_INACTIVE_FLG", ATRB_BIT = 13, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest229 = new SecurityAttribute { FACT_ATRB_CD = "PRD_LEVEL", ATRB_BIT = 2, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest230 = new SecurityAttribute { FACT_ATRB_CD = "PRD_NM_COMBINED", ATRB_BIT = 5, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest231 = new SecurityAttribute { FACT_ATRB_CD = "PRD_TYPE_CHK", ATRB_BIT = 0, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest232 = new SecurityAttribute { FACT_ATRB_CD = "PRD_VERTICAL", ATRB_BIT = 13, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest233 = new SecurityAttribute { FACT_ATRB_CD = "PRICE_AGREEMENT_GRP", ATRB_BIT = 3, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest234 = new SecurityAttribute { FACT_ATRB_CD = "PRI_PROD", ATRB_BIT = 1, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest235 = new SecurityAttribute { FACT_ATRB_CD = "PRODUCT_FILTER", ATRB_BIT = 14, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest236 = new SecurityAttribute { FACT_ATRB_CD = "PRODUCT_TITLE", ATRB_BIT = 13, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest237 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_GEO", ATRB_BIT = 15, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest238 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_GEO_COMBINED", ATRB_BIT = 0, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest239 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_PAYMENT", ATRB_BIT = 2, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest240 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_PAYMENT_ALT", ATRB_BIT = 3, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest241 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_TYPE", ATRB_BIT = 1, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest242 = new SecurityAttribute { FACT_ATRB_CD = "PROGRAM_TYPE_VOL_TIER", ATRB_BIT = 8, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest243 = new SecurityAttribute { FACT_ATRB_CD = "PROG_VOLTIER_NM", ATRB_BIT = 4, ATRB_MAGNITUDE = 14 };
			SecurityAttribute atest244 = new SecurityAttribute { FACT_ATRB_CD = "PROG_VOLTIER_RPU", ATRB_BIT = 5, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest245 = new SecurityAttribute { FACT_ATRB_CD = "PnL_Split_for_KITS", ATRB_BIT = 13, ATRB_MAGNITUDE = 0 };
			SecurityAttribute atest246 = new SecurityAttribute { FACT_ATRB_CD = "QLTR_PROJECT", ATRB_BIT = 5, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest247 = new SecurityAttribute { FACT_ATRB_CD = "QLTR_TERMS", ATRB_BIT = 6, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest248 = new SecurityAttribute { FACT_ATRB_CD = "QTR", ATRB_BIT = 13, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest249 = new SecurityAttribute { FACT_ATRB_CD = "RATE", ATRB_BIT = 1, ATRB_MAGNITUDE = 2 };
			SecurityAttribute atest250 = new SecurityAttribute { FACT_ATRB_CD = "RATE_BASED_ON", ATRB_BIT = 11, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest251 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_BILLING_END", ATRB_BIT = 8, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest252 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_BILLING_START", ATRB_BIT = 7, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest253 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_DEAL_ID", ATRB_BIT = 11, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest254 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_DISTI", ATRB_BIT = 4, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest255 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_OA_MAX_AMT", ATRB_BIT = 10, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest256 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_OA_MAX_VOL", ATRB_BIT = 9, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest257 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_PMT", ATRB_BIT = 2, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest258 = new SecurityAttribute { FACT_ATRB_CD = "REBATE_QTY", ATRB_BIT = 3, ATRB_MAGNITUDE = 13 };
			SecurityAttribute atest259 = new SecurityAttribute { FACT_ATRB_CD = "REDEAL_FRST_REQ_DT", ATRB_BIT = 12, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest260 = new SecurityAttribute { FACT_ATRB_CD = "REMARKS", ATRB_BIT = 0, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest261 = new SecurityAttribute { FACT_ATRB_CD = "REQ_BY", ATRB_BIT = 2, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest262 = new SecurityAttribute { FACT_ATRB_CD = "REQ_DT", ATRB_BIT = 10, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest263 = new SecurityAttribute { FACT_ATRB_CD = "RETAIL_CYCLE", ATRB_BIT = 0, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest264 = new SecurityAttribute { FACT_ATRB_CD = "RETAIL_PULL", ATRB_BIT = 11, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest265 = new SecurityAttribute { FACT_ATRB_CD = "RETAIL_PULL_USR_DEF", ATRB_BIT = 1, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest266 = new SecurityAttribute { FACT_ATRB_CD = "RETAIL_PULL_USR_DEF_CMNT", ATRB_BIT = 2, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest267 = new SecurityAttribute { FACT_ATRB_CD = "RETAIL_SHP_AHEAD_DT", ATRB_BIT = 3, ATRB_MAGNITUDE = 7 };
			SecurityAttribute atest268 = new SecurityAttribute { FACT_ATRB_CD = "RPU_CALC_TYPE", ATRB_BIT = 11, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest269 = new SecurityAttribute { FACT_ATRB_CD = "RPU_OVERRIDE_CMNT", ATRB_BIT = 13, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest270 = new SecurityAttribute { FACT_ATRB_CD = "RPU_OVERRIDE_COMMENT", ATRB_BIT = 1, ATRB_MAGNITUDE = 15 };
			SecurityAttribute atest271 = new SecurityAttribute { FACT_ATRB_CD = "SA_COST_TEST_RESULTS", ATRB_BIT = 1, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest272 = new SecurityAttribute { FACT_ATRB_CD = "SEC_PROD", ATRB_BIT = 2, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest273 = new SecurityAttribute { FACT_ATRB_CD = "SERVER_DEAL_TYPE", ATRB_BIT = 1, ATRB_MAGNITUDE = 6 };
			SecurityAttribute atest274 = new SecurityAttribute { FACT_ATRB_CD = "SOUTHBRIDGE_SPLIT", ATRB_BIT = 13, ATRB_MAGNITUDE = 8 };
			SecurityAttribute atest275 = new SecurityAttribute { FACT_ATRB_CD = "START_DT", ATRB_BIT = 7, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest276 = new SecurityAttribute { FACT_ATRB_CD = "STRT_CAP", ATRB_BIT = 10, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest277 = new SecurityAttribute { FACT_ATRB_CD = "STRT_VOL", ATRB_BIT = 3, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest278 = new SecurityAttribute { FACT_ATRB_CD = "SUPPORT_EMAIL", ATRB_BIT = 7, ATRB_MAGNITUDE = 10 };
			SecurityAttribute atest279 = new SecurityAttribute { FACT_ATRB_CD = "TENDER_PRICE", ATRB_BIT = 12, ATRB_MAGNITUDE = 9 };
			SecurityAttribute atest280 = new SecurityAttribute { FACT_ATRB_CD = "TIER_NBR", ATRB_BIT = 4, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest281 = new SecurityAttribute { FACT_ATRB_CD = "TOTAL_DOLLAR_AMOUNT", ATRB_BIT = 5, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest282 = new SecurityAttribute { FACT_ATRB_CD = "TRGT_RGN", ATRB_BIT = 6, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest283 = new SecurityAttribute { FACT_ATRB_CD = "TRGT_RGN_CHK", ATRB_BIT = 14, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest284 = new SecurityAttribute { FACT_ATRB_CD = "TRKR_END_DT", ATRB_BIT = 8, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest285 = new SecurityAttribute { FACT_ATRB_CD = "TRKR_NBR", ATRB_BIT = 7, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest286 = new SecurityAttribute { FACT_ATRB_CD = "TRKR_NBR_DT_LTR", ATRB_BIT = 15, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest287 = new SecurityAttribute { FACT_ATRB_CD = "TRKR_START_DT", ATRB_BIT = 7, ATRB_MAGNITUDE = 3 };
			SecurityAttribute atest288 = new SecurityAttribute { FACT_ATRB_CD = "VERTICAL", ATRB_BIT = 6, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest289 = new SecurityAttribute { FACT_ATRB_CD = "VIP_AVG_PCT", ATRB_BIT = 13, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest290 = new SecurityAttribute { FACT_ATRB_CD = "VIP_MAX_PCT", ATRB_BIT = 12, ATRB_MAGNITUDE = 16 };
			SecurityAttribute atest291 = new SecurityAttribute { FACT_ATRB_CD = "VOLUME", ATRB_BIT = 9, ATRB_MAGNITUDE = 5 };
			SecurityAttribute atest292 = new SecurityAttribute { FACT_ATRB_CD = "VOLUME_BAND", ATRB_BIT = 8, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest293 = new SecurityAttribute { FACT_ATRB_CD = "WF_STG_CD", ATRB_BIT = 9, ATRB_MAGNITUDE = 1 };
			SecurityAttribute atest294 = new SecurityAttribute { FACT_ATRB_CD = "YCS2_END_DT", ATRB_BIT = 5, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest295 = new SecurityAttribute { FACT_ATRB_CD = "YCS2_OVERLAP_OVERRIDE", ATRB_BIT = 12, ATRB_MAGNITUDE = 11 };
			SecurityAttribute atest296 = new SecurityAttribute { FACT_ATRB_CD = "YCS2_PRC_IRBT", ATRB_BIT = 3, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest297 = new SecurityAttribute { FACT_ATRB_CD = "YCS2_START_DT", ATRB_BIT = 4, ATRB_MAGNITUDE = 4 };
			SecurityAttribute atest298 = new SecurityAttribute { FACT_ATRB_CD = "YEAR", ATRB_BIT = 12, ATRB_MAGNITUDE = 6 };
			securityActions.Add(atest7);
			securityActions.Add(atest8);
			securityActions.Add(atest9);
			securityActions.Add(atest10);
			securityActions.Add(atest11);
			securityActions.Add(atest12);
			securityActions.Add(atest13);
			securityActions.Add(atest14);
			securityActions.Add(atest15);
			securityActions.Add(atest16);
			securityActions.Add(atest17);
			securityActions.Add(atest18);
			securityActions.Add(atest19);
			securityActions.Add(atest20);
			securityActions.Add(atest21);
			securityActions.Add(atest22);
			securityActions.Add(atest23);
			securityActions.Add(atest24);
			securityActions.Add(atest25);
			securityActions.Add(atest26);
			securityActions.Add(atest27);
			securityActions.Add(atest28);
			securityActions.Add(atest29);
			securityActions.Add(atest30);
			securityActions.Add(atest31);
			securityActions.Add(atest32);
			securityActions.Add(atest33);
			securityActions.Add(atest34);
			securityActions.Add(atest35);
			securityActions.Add(atest36);
			securityActions.Add(atest37);
			securityActions.Add(atest38);
			securityActions.Add(atest39);
			securityActions.Add(atest40);
			securityActions.Add(atest41);
			securityActions.Add(atest42);
			securityActions.Add(atest43);
			securityActions.Add(atest44);
			securityActions.Add(atest45);
			securityActions.Add(atest46);
			securityActions.Add(atest47);
			securityActions.Add(atest48);
			securityActions.Add(atest49);
			securityActions.Add(atest50);
			securityActions.Add(atest51);
			securityActions.Add(atest52);
			securityActions.Add(atest53);
			securityActions.Add(atest54);
			securityActions.Add(atest55);
			securityActions.Add(atest56);
			securityActions.Add(atest57);
			securityActions.Add(atest58);
			securityActions.Add(atest59);
			securityActions.Add(atest60);
			securityActions.Add(atest61);
			securityActions.Add(atest62);
			securityActions.Add(atest63);
			securityActions.Add(atest64);
			securityActions.Add(atest65);
			securityActions.Add(atest66);
			securityActions.Add(atest67);
			securityActions.Add(atest68);
			securityActions.Add(atest69);
			securityActions.Add(atest70);
			securityActions.Add(atest71);
			securityActions.Add(atest72);
			securityActions.Add(atest73);
			securityActions.Add(atest74);
			securityActions.Add(atest75);
			securityActions.Add(atest76);
			securityActions.Add(atest77);
			securityActions.Add(atest78);
			securityActions.Add(atest79);
			securityActions.Add(atest80);
			securityActions.Add(atest81);
			securityActions.Add(atest82);
			securityActions.Add(atest83);
			securityActions.Add(atest84);
			securityActions.Add(atest85);
			securityActions.Add(atest86);
			securityActions.Add(atest87);
			securityActions.Add(atest88);
			securityActions.Add(atest89);
			securityActions.Add(atest90);
			securityActions.Add(atest91);
			securityActions.Add(atest92);
			securityActions.Add(atest93);
			securityActions.Add(atest94);
			securityActions.Add(atest95);
			securityActions.Add(atest96);
			securityActions.Add(atest97);
			securityActions.Add(atest98);
			securityActions.Add(atest99);
			securityActions.Add(atest100);
			securityActions.Add(atest101);
			securityActions.Add(atest102);
			securityActions.Add(atest103);
			securityActions.Add(atest104);
			securityActions.Add(atest105);
			securityActions.Add(atest106);
			securityActions.Add(atest107);
			securityActions.Add(atest108);
			securityActions.Add(atest109);
			securityActions.Add(atest110);
			securityActions.Add(atest111);
			securityActions.Add(atest112);
			securityActions.Add(atest113);
			securityActions.Add(atest114);
			securityActions.Add(atest115);
			securityActions.Add(atest116);
			securityActions.Add(atest117);
			securityActions.Add(atest118);
			securityActions.Add(atest119);
			securityActions.Add(atest120);
			securityActions.Add(atest121);
			securityActions.Add(atest122);
			securityActions.Add(atest123);
			securityActions.Add(atest124);
			securityActions.Add(atest125);
			securityActions.Add(atest126);
			securityActions.Add(atest127);
			securityActions.Add(atest128);
			securityActions.Add(atest129);
			securityActions.Add(atest130);
			securityActions.Add(atest131);
			securityActions.Add(atest132);
			securityActions.Add(atest133);
			securityActions.Add(atest134);
			securityActions.Add(atest135);
			securityActions.Add(atest136);
			securityActions.Add(atest137);
			securityActions.Add(atest138);
			securityActions.Add(atest139);
			securityActions.Add(atest140);
			securityActions.Add(atest141);
			securityActions.Add(atest142);
			securityActions.Add(atest143);
			securityActions.Add(atest144);
			securityActions.Add(atest145);
			securityActions.Add(atest146);
			securityActions.Add(atest147);
			securityActions.Add(atest148);
			securityActions.Add(atest149);
			securityActions.Add(atest150);
			securityActions.Add(atest151);
			securityActions.Add(atest152);
			securityActions.Add(atest153);
			securityActions.Add(atest154);
			securityActions.Add(atest155);
			securityActions.Add(atest156);
			securityActions.Add(atest157);
			securityActions.Add(atest158);
			securityActions.Add(atest159);
			securityActions.Add(atest160);
			securityActions.Add(atest161);
			securityActions.Add(atest162);
			securityActions.Add(atest163);
			securityActions.Add(atest164);
			securityActions.Add(atest165);
			securityActions.Add(atest166);
			securityActions.Add(atest167);
			securityActions.Add(atest168);
			securityActions.Add(atest169);
			securityActions.Add(atest170);
			securityActions.Add(atest171);
			securityActions.Add(atest172);
			securityActions.Add(atest173);
			securityActions.Add(atest174);
			securityActions.Add(atest175);
			securityActions.Add(atest176);
			securityActions.Add(atest177);
			securityActions.Add(atest178);
			securityActions.Add(atest179);
			securityActions.Add(atest180);
			securityActions.Add(atest181);
			securityActions.Add(atest182);
			securityActions.Add(atest183);
			securityActions.Add(atest184);
			securityActions.Add(atest185);
			securityActions.Add(atest186);
			securityActions.Add(atest187);
			securityActions.Add(atest188);
			securityActions.Add(atest189);
			securityActions.Add(atest190);
			securityActions.Add(atest191);
			securityActions.Add(atest192);
			securityActions.Add(atest193);
			securityActions.Add(atest194);
			securityActions.Add(atest195);
			securityActions.Add(atest196);
			securityActions.Add(atest197);
			securityActions.Add(atest198);
			securityActions.Add(atest199);
			securityActions.Add(atest200);
			securityActions.Add(atest201);
			securityActions.Add(atest202);
			securityActions.Add(atest203);
			securityActions.Add(atest204);
			securityActions.Add(atest205);
			securityActions.Add(atest206);
			securityActions.Add(atest207);
			securityActions.Add(atest208);
			securityActions.Add(atest209);
			securityActions.Add(atest210);
			securityActions.Add(atest211);
			securityActions.Add(atest212);
			securityActions.Add(atest213);
			securityActions.Add(atest214);
			securityActions.Add(atest215);
			securityActions.Add(atest216);
			securityActions.Add(atest217);
			securityActions.Add(atest218);
			securityActions.Add(atest219);
			securityActions.Add(atest220);
			securityActions.Add(atest221);
			securityActions.Add(atest222);
			securityActions.Add(atest223);
			securityActions.Add(atest224);
			securityActions.Add(atest225);
			securityActions.Add(atest226);
			securityActions.Add(atest227);
			securityActions.Add(atest228);
			securityActions.Add(atest229);
			securityActions.Add(atest230);
			securityActions.Add(atest231);
			securityActions.Add(atest232);
			securityActions.Add(atest233);
			securityActions.Add(atest234);
			securityActions.Add(atest235);
			securityActions.Add(atest236);
			securityActions.Add(atest237);
			securityActions.Add(atest238);
			securityActions.Add(atest239);
			securityActions.Add(atest240);
			securityActions.Add(atest241);
			securityActions.Add(atest242);
			securityActions.Add(atest243);
			securityActions.Add(atest244);
			securityActions.Add(atest245);
			securityActions.Add(atest246);
			securityActions.Add(atest247);
			securityActions.Add(atest248);
			securityActions.Add(atest249);
			securityActions.Add(atest250);
			securityActions.Add(atest251);
			securityActions.Add(atest252);
			securityActions.Add(atest253);
			securityActions.Add(atest254);
			securityActions.Add(atest255);
			securityActions.Add(atest256);
			securityActions.Add(atest257);
			securityActions.Add(atest258);
			securityActions.Add(atest259);
			securityActions.Add(atest260);
			securityActions.Add(atest261);
			securityActions.Add(atest262);
			securityActions.Add(atest263);
			securityActions.Add(atest264);
			securityActions.Add(atest265);
			securityActions.Add(atest266);
			securityActions.Add(atest267);
			securityActions.Add(atest268);
			securityActions.Add(atest269);
			securityActions.Add(atest270);
			securityActions.Add(atest271);
			securityActions.Add(atest272);
			securityActions.Add(atest273);
			securityActions.Add(atest274);
			securityActions.Add(atest275);
			securityActions.Add(atest276);
			securityActions.Add(atest277);
			securityActions.Add(atest278);
			securityActions.Add(atest279);
			securityActions.Add(atest280);
			securityActions.Add(atest281);
			securityActions.Add(atest282);
			securityActions.Add(atest283);
			securityActions.Add(atest284);
			securityActions.Add(atest285);
			securityActions.Add(atest286);
			securityActions.Add(atest287);
			securityActions.Add(atest288);
			securityActions.Add(atest289);
			securityActions.Add(atest290);
			securityActions.Add(atest291);
			securityActions.Add(atest292);
			securityActions.Add(atest293);
			securityActions.Add(atest294);
			securityActions.Add(atest295);
			securityActions.Add(atest296);
			securityActions.Add(atest297);
			securityActions.Add(atest298);
			#endregion

			List<SecurityMask> securityMasks = new List<SecurityMask>();
			// TODO: Remove and replace with dynamic data 
			#region Security Masks hard-coded

			SecurityMask masktest1 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "000F.FFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest2 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.1FFD.FFFC.FE01.B7FF.8F07.37FF.FBFF.FFBF.FDFE.7F8E.F100.EDF7.CFC2.FAFF.C638" };
			SecurityMask masktest3 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest4 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest5 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest6 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "C_IDMS_ACTION_DISABLED ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest7 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "C_IDMS_READ_ONLY ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest8 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "C_IDMS_READ_ONLY ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest9 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_EMAIL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest10 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest11 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest12 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest13 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest14 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest15 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "C_CREATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest16 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_CHIPSET_SPLITOUT", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest17 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_DELETE_DEAL_LINEUP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest18 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_COMPETITIVE_PRODUCTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest19 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_REMOVE_WB_LOCK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest20 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_MEET_COMP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest21 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest22 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest23 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest24 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest25 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest26 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest27 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest28 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest29 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest30 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest31 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest32 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest33 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest34 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest35 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest36 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest37 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest38 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest39 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest40 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest41 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest42 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest43 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest44 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest45 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest46 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest47 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000" };
			SecurityMask masktest48 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest49 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest50 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.1000.0000" };
			SecurityMask masktest51 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.1000.0000" };
			SecurityMask masktest52 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest53 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest54 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest55 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest56 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest57 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest58 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest59 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.04FD.E00C.7E01.B3FF.8F07.37FF.FBF7.829B.FDE8.7D8E.F100.EDF7.CFC2.E2FF.C638" };
			SecurityMask masktest60 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest61 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0800.1000.8000.0000.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest62 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest63 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest64 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0400.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest65 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest66 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0100.0000.0000.0400.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest67 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest68 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest69 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest70 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest71 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest72 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest73 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest74 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0002.BFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest75 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest76 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest77 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest78 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "C_ADD_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest79 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "C_COPY_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest80 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest81 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest82 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest83 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_COST_TEST", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest84 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "000F.FFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest85 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.1FFD.FFFC.FE01.B7FF.8F07.37FF.FBFF.FFBF.FDFE.7F8E.F100.EDF7.CFC2.FAFF.C638" };
			SecurityMask masktest86 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest87 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest88 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest89 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest90 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "C_IDMS_ACTION_DISABLED ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest91 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "C_IDMS_READ_ONLY ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest92 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_IDMS_READ_ONLY ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest93 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_EMAIL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest94 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest95 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest96 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest97 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest98 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_DELETE_DEAL_LINEUP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest99 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "C_CREATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest100 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "C_CAN_VIEW_C2A_INTERFACE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest101 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest102 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest103 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest104 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest105 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest106 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest107 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest108 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest109 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest110 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest111 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest112 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest113 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest114 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest115 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest116 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest117 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest118 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000" };
			SecurityMask masktest119 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest120 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest121 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest122 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest123 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest124 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest125 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest126 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest127 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest128 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest129 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest130 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest131 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest132 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest133 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest134 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.04FD.E00C.7E01.B3FF.8F07.37FF.FBF7.829B.FDE8.7D8E.F100.EDF7.CFC2.E2FF.C638" };
			SecurityMask masktest135 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest136 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest137 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest138 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest139 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.8000.0400.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest140 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest141 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0100.0180.0000.0400.0000.0000.0000.0000.0006.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest142 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest143 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest144 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest145 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "000F.FFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest146 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest147 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest148 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest149 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest150 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest151 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest152 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "C_COPY_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest153 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest154 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest155 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest156 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest157 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest158 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "C_COPY_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest159 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "C_ADD_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest160 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest161 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest162 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest163 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest164 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest165 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest166 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest167 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "000A.FFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest168 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.04FD.E00C.7E01.B3FF.8F07.37FF.FBF7.829B.FDE8.7D8E.F100.EDF7.CFC2.E2FF.C638" };
			SecurityMask masktest169 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest170 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest171 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest172 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest173 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0400.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest174 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest175 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0100.0000.0000.0400.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest176 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest177 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.8000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest178 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest179 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest180 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest181 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest182 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest183 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest184 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest185 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest186 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000" };
			SecurityMask masktest187 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest188 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest189 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest190 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest191 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest192 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest193 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest194 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest195 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest196 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest197 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest198 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest199 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest200 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest201 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest202 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest203 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest204 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest205 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest206 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest207 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest208 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest209 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest210 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest211 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest212 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest213 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest214 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest215 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest216 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest217 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest218 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "C_CAN_VIEW_C2A_INTERFACE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest219 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "C_CREATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest220 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "C_DELETE_DEAL_LINEUP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest221 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_MEET_COMP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest222 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest223 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest224 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest225 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest226 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest227 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_EMAIL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest228 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_MEET_COMP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest229 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest230 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest231 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "C_IDMS_ACTION_DISABLED ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest232 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest233 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest234 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest235 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest236 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.1FFD.FFFC.FE01.B7FF.8F07.37FF.FBFF.FFBF.FDFE.7F8E.F100.EDF7.CFC2.FAFF.C638" };
			SecurityMask masktest237 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0002.BFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest238 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "C_ADD_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest239 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_COST_TEST", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest240 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "C_ADD_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest241 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "C_COPY_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest242 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "000F.FFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.0000.0000" };
			SecurityMask masktest243 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.1FFD.FFFC.FE01.B7FF.8F07.37FF.FBFF.FFBF.FDFE.7F8E.F100.EDF7.CFC2.FAFF.C638" };
			SecurityMask masktest244 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest245 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest246 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest247 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest248 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest249 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest250 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest251 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000" };
			SecurityMask masktest252 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest253 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest254 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest255 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest256 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest257 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest258 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest259 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest260 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest261 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest262 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest263 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest264 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_EMAIL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest265 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_IDMS_READ_ONLY ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest266 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest267 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest268 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest269 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest270 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest271 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest272 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest273 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest274 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest275 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest276 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest277 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest278 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest279 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest280 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest281 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest282 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest283 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest284 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest285 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest286 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest287 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest288 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest289 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest290 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest291 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest292 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest293 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest294 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest295 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest296 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_QTR_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest297 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest298 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest299 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest300 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest301 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest302 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest303 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest304 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest305 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest306 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest307 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_DEAL_PRIOR_TO_QTR", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest308 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest309 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest310 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest311 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest312 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest313 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_MEET_COMP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest314 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_REMOVE_WB_LOCK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest315 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_COMPETITIVE_PRODUCTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest316 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "C_DELETE_DEAL_LINEUP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest317 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_DELETE_DEAL_LINEUP", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest318 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_MANAGE_CHIPSET_SPLITOUT", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest319 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_CAN_VIEW_C2A_INTERFACE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest320 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest321 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_REQ_COMPONENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest322 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000" };
			SecurityMask masktest323 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest324 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest325 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.1000.0000" };
			SecurityMask masktest326 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.4000.0000.1000.0000" };
			SecurityMask masktest327 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest328 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest329 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest330 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest331 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest332 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000" };
			SecurityMask masktest333 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest334 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest335 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest336 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest337 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest338 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest339 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest340 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_VIEW_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest341 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0002.BFC0.0000.0000.0000.2000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest342 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "000F.FFC0.0000.0000.04FD.E00C.FE01.B3FF.8F07.37FF.FBF7.829B.FDE8.7D8E.F100.EDF7.CFC2.E2FF.C638" };
			SecurityMask masktest343 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.0000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest344 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0100.0000.0000.0400.0000.0000.0000.0000.0002.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest345 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.0000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest346 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.1B00.1FF0.0000.0400.0000.0000.0008.7D24.0016.0200.0000.0000.0000.1800.0000" };
			SecurityMask masktest347 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_COPY_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest348 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_ADD_ATTACHMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest349 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest350 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest351 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest352 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REJECT_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest353 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest354 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest355 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest356 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest357 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest358 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest359 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest360 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_APPROVE ", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest361 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_UPDATE_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest362 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_COST_TEST", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest363 = new SecurityMask { OBJ_TYPE = null, ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "C_CAN_VIEW_ADMINTOOL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest364 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "All Role Types", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0100.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest365 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest366 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest367 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest368 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest369 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest370 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest371 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest372 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest373 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest374 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest375 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.0E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest376 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest377 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest378 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.07C8" };
			SecurityMask masktest379 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest380 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest381 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest382 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest383 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest384 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest385 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest386 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest387 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest388 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest389 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest390 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest391 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest392 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest393 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest394 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest395 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest396 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest397 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest398 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest399 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest400 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest401 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest402 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest403 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest404 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest405 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest406 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest407 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest408 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest409 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest410 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest411 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest412 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest413 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest414 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest415 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest416 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest417 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest418 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest419 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest420 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest421 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest422 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest423 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest424 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest425 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest426 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest427 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest428 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest429 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest430 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest431 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest432 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest433 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest434 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest435 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest436 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest437 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest438 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest439 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest440 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest441 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest442 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest443 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0008.0400.0000.2200.0000.0000.0000.0000.0000" };
			SecurityMask masktest444 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C08.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest445 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C08.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest446 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest447 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest448 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest449 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest450 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest451 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest452 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest453 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest454 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest455 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest456 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest457 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest458 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest459 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest460 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.0E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest461 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest462 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest463 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0004.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest464 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest465 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest466 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest467 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest468 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest469 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest470 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest471 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest472 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest473 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest474 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest475 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest476 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest477 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest478 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest479 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest480 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest481 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest482 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest483 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest484 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest485 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest486 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest487 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest488 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest489 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest490 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest491 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest492 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest493 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest494 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest495 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest496 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest497 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest498 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest499 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest500 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest501 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest502 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest503 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest504 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest505 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest506 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest507 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest508 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest509 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest510 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest511 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest512 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest513 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest514 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest515 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest516 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest517 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.0E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest518 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest519 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest520 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.3700.0C02.0180.0000.0000.0000.0000.0000.0000.01C8" };
			SecurityMask masktest521 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest522 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0008.0400.0000.2200.0000.0000.0000.0000.0000" };
			SecurityMask masktest523 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest524 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest525 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest526 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest527 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0008.0000.0000.2200.0000.0000.0000.2000.4010" };
			SecurityMask masktest528 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest529 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest530 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest531 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest532 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest533 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest534 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest535 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest536 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest537 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest538 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest539 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest540 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest541 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest542 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest543 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest544 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest545 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest546 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest547 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest548 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.0E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest549 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest550 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest551 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest552 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest553 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest554 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest555 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest556 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest557 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "C_FAST_TRACK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest558 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "C_FAST_TRACK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest559 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest560 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest561 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest562 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest563 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest564 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest565 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest566 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest567 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest568 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest569 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest570 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest571 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest572 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest573 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest574 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest575 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest576 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest577 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest578 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest579 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest580 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest581 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest582 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest583 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest584 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest585 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest586 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest587 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest588 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest589 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest590 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest591 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest592 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest593 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest594 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest595 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest596 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest597 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest598 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest599 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest600 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest601 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest602 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest603 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest604 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.1000.0000.0000.0000.0000.0000.0000.0000.0000.0608" };
			SecurityMask masktest605 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C00.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest606 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C00.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest607 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest608 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest609 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest610 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest611 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest612 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest613 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest614 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest615 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest616 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest617 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest618 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest619 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest620 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest621 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest622 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest623 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.0E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest624 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest625 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest626 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0044.0000.8E01.83FF.8404.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest627 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest628 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest629 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest630 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest631 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest632 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest633 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest634 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest635 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest636 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest637 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest638 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest639 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest640 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest641 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest642 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest643 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest644 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest645 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest646 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest647 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest648 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest649 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest650 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest651 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest652 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest653 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest654 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest655 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest656 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest657 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest658 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest659 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest660 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest661 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest662 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_PRICE_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest663 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest664 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest665 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest666 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest667 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest668 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest669 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest670 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest671 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest672 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest673 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest674 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest675 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest676 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest677 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest678 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest679 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest680 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest681 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest682 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest683 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest684 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest685 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest686 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_DECREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest687 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest688 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest689 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest690 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest691 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_VIEW_QUOTE_LETTER", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest692 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest693 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest694 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest695 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest696 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_PRICE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest697 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "C_FAST_TRACK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest698 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "C_FAST_TRACK", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest699 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest700 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest701 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest702 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest703 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.2200.0000.0000.0000.2000.4010" };
			SecurityMask masktest704 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C08.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest705 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.3C08.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest706 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest707 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest708 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest709 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest710 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest711 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0008.0000.0000.0200.0000.0000.0000.2000.4010" };
			SecurityMask masktest712 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest713 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest714 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest715 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "C_REDEAL_DEAL", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest716 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0003.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest717 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest718 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest719 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest720 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest721 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest722 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest723 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest724 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest725 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest726 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest727 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest728 = new SecurityMask { OBJ_TYPE = "ECAP", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.8000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest729 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "All Role Types", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0100.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest730 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest731 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest732 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest733 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest734 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest735 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest736 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest737 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest738 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest739 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest740 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest741 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest742 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest743 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest744 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest745 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest746 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest747 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest748 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest749 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest750 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest751 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest752 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest753 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest754 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest755 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest756 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest757 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest758 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest759 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest760 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest761 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest762 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest763 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest764 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest765 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest766 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest767 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest768 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest769 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest770 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest771 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest772 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest773 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest774 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest775 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest776 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest777 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest778 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest779 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest780 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest781 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest782 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest783 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest784 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest785 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest786 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest787 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest788 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest789 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest790 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest791 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest792 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest793 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest794 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest795 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest796 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest797 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest798 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest799 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest800 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest801 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest802 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest803 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest804 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest805 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest806 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest807 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest808 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest809 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest810 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest811 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest812 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest813 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest814 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest815 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest816 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest817 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest818 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest819 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest820 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest821 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest822 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest823 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest824 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest825 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest826 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest827 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest828 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest829 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest830 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest831 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest832 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest833 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest834 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest835 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest836 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest837 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest838 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest839 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0002.0010.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest840 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest841 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest842 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest843 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest844 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest845 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest846 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest847 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest848 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest849 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest850 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest851 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest852 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest853 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest854 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest855 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest856 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest857 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest858 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest859 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest860 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest861 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest862 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest863 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0002.0010.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest864 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2001.4000" };
			SecurityMask masktest865 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest866 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest867 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest868 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest869 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest870 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest871 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest872 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest873 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest874 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest875 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest876 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest877 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest878 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest879 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest880 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest881 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest882 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest883 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest884 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest885 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest886 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest887 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest888 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest889 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest890 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest891 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest892 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest893 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest894 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest895 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest896 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest897 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest898 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest899 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest900 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest901 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest902 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest903 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest904 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest905 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest906 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest907 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest908 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest909 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest910 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest911 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest912 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest913 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest914 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest915 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest916 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest917 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest918 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest919 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest920 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest921 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest922 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest923 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest924 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest925 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest926 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest927 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest928 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest929 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest930 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest931 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0002.0010.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest932 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0021.0000" };
			SecurityMask masktest933 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest934 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest935 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest936 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest937 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest938 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest939 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest940 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2020.4000" };
			SecurityMask masktest941 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest942 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest943 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest944 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest945 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest946 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest947 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest948 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest949 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest950 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest951 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest952 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest953 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest954 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest955 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest956 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest957 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest958 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest959 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest960 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest961 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest962 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest963 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest964 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0002.0010.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest965 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest966 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest967 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest968 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest969 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest970 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest971 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest972 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.3000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest973 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.2021.4000" };
			SecurityMask masktest974 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest975 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest976 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest977 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest978 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest979 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest980 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest981 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest982 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest983 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest984 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest985 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest986 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest987 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest988 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest989 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest990 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest991 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest992 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_READ_ONLY", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest993 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest994 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest995 = new SecurityMask { OBJ_TYPE = "PROGRAM", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest996 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest997 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest998 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest999 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1000 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1001 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1002 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1003 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1004 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1005 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1006 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1007 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1008 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1009 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1010 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1011 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1012 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1013 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1014 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1015 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1016 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1017 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1018 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1019 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1020 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1021 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1022 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1023 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1024 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1025 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1026 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1027 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1028 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1029 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1030 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1031 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1032 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1033 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1034 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1035 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1036 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1037 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1038 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1039 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1040 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1041 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1042 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1043 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1044 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1045 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1046 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1047 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1048 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1049 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1050 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1051 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1052 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1053 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1054 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1055 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1056 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1057 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1058 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1059 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1060 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1061 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1062 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1063 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1064 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1065 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1066 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1067 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1068 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1069 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1070 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1071 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1072 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1073 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1074 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1075 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1076 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1077 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1078 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1079 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1080 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1081 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1082 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1083 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1084 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1085 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1086 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1087 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1088 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1089 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1090 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1091 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1092 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1093 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1094 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1095 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1096 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1097 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1098 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1099 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1100 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1101 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1102 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1103 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1104 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1105 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1106 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1107 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1108 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1109 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1110 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1111 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1112 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1113 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1114 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1115 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1116 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1117 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1118 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1119 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1120 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1121 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1122 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1123 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1124 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1125 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1126 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1127 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1128 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1129 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1130 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1131 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1132 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1133 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1134 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1135 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1136 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1137 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1138 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1139 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1140 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1141 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1142 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1143 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1144 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1145 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1146 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1147 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1148 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1149 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1150 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1151 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1152 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1153 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1154 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1155 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1156 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1157 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1158 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1159 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1160 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1161 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1162 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1163 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1164 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1165 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1166 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1167 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1168 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1169 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.6000.0000" };
			SecurityMask masktest1170 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1171 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1172 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1173 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1174 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1175 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1176 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1177 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1178 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1179 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1180 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1181 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1182 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1183 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1184 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1185 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1186 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1187 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1188 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1189 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1190 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1191 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1192 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1193 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1194 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1195 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1196 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1197 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1198 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1199 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1200 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1201 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1202 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1203 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1204 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1205 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1206 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1207 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1208 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1209 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1210 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1211 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1212 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1213 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1214 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1215 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1216 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1217 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1218 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1219 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1220 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1221 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1222 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1223 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1224 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1225 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1226 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1227 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.2008.0020" };
			SecurityMask masktest1228 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1229 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1230 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1231 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1232 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1233 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1234 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1235 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1236 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1237 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1238 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1239 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1240 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1241 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1242 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1243 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1244 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1245 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1246 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1247 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1248 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1249 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1250 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1251 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1252 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1253 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1254 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1255 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1256 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1257 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1258 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1259 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1260 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1261 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1262 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1263 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1264 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1265 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1266 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1267 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1268 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1269 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1270 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1271 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1272 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1273 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1274 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1275 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1276 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1277 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1278 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1279 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1280 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1281 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1282 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1283 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1284 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1285 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1286 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1287 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1288 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1289 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1290 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1291 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1292 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1293 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1294 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1295 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1296 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1297 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1298 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1299 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1300 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1301 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1302 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1303 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1304 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1305 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1306 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1307 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1308 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1309 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1310 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1311 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1312 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1313 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1314 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1315 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1316 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1317 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1318 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1319 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1320 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1321 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1322 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0020" };
			SecurityMask masktest1323 = new SecurityMask { OBJ_TYPE = "VOL TIER", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0002.6008.0000" };
			SecurityMask masktest1324 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1325 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1326 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1327 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1328 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1329 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1330 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1331 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1332 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1333 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1334 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1335 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1336 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1337 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1338 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1339 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1340 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1341 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1342 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1343 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1344 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1345 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1346 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1347 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1348 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "CBA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1349 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1350 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1351 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1352 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1353 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1354 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1355 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1356 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1357 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1358 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1359 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1360 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1361 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1362 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1363 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1364 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1365 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1366 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1367 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1368 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1369 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1370 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1371 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1372 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1373 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1374 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1375 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1376 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1377 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1378 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1379 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1380 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1381 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1382 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1383 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1384 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1385 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1386 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1387 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1388 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1389 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1390 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1391 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1392 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1393 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1394 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1395 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1396 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1397 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1398 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1399 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1400 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1401 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "DA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1402 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1403 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1404 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1405 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1406 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1407 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1408 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1409 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1410 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1411 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1412 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1413 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1414 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1415 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1416 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1417 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1418 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1419 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1420 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1421 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1422 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1423 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1424 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1425 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1426 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Finance", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1427 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1428 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1429 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1430 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1431 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1432 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1433 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1434 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1435 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1436 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1437 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1438 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1439 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1440 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1441 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1442 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1443 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1444 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1445 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1446 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1447 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1448 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.01C0" };
			SecurityMask masktest1449 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1450 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1451 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1452 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1453 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1454 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1455 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1456 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1457 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1458 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1459 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1460 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1461 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1462 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1463 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1464 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1465 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1466 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1467 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1468 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1469 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1470 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1471 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "FSE", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1472 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1473 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1474 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1475 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1476 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1477 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1478 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1479 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1480 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1481 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1482 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1483 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1484 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1485 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1486 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1487 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1488 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1489 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1490 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1491 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1492 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1493 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1494 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1495 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1496 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1497 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.6000.0000" };
			SecurityMask masktest1498 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1499 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1500 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1501 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1502 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1503 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1504 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1505 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1506 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1507 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1508 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1509 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1510 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1511 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1512 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1513 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1514 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1515 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1516 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1517 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1518 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1519 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1520 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1521 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1522 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "GA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1523 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1524 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1525 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1526 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1527 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1528 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1529 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1530 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1531 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1532 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1533 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1534 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1535 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1536 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1537 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1538 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1539 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1540 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1541 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1542 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1543 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1544 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1545 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1546 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1547 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1548 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1549 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "Legal", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1550 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1551 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1552 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1553 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1554 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1555 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.2000.0000" };
			SecurityMask masktest1556 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1557 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1558 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1559 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1560 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1561 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1562 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1563 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1564 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1565 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1566 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1567 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1568 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1569 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1570 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1571 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1572 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1573 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1574 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1575 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1576 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1577 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "FSE_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1578 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1579 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1580 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1581 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1582 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1583 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Requested", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1584 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1585 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1586 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1587 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1588 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1589 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1590 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_TARGET_REGIONS_DISABLED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1591 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1592 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1593 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1594 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1595 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1596 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "RA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1597 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1598 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1599 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1600 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1601 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1602 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "C_INCREASE_DATE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1603 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "CAN_VIEW_LEGAL_COMMENTS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1604 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1605 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1606 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1607 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1608 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1609 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1610 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1611 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1612 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1613 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1614 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1615 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1616 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "CAN_CREATE_RETRO_DEALS", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1617 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1618 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1619 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1620 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1621 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_BY_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1622 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1623 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1624 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "C_SAVE_DATA_DT_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1625 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1626 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "C_RUN_COST_TEST_APPROVE", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0001" };
			SecurityMask masktest1627 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1628 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1629 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1630 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1631 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1632 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1633 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1634 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1635 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1636 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Customer_Declined", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1637 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1638 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1639 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Cancelled", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1640 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Hold_Waiting", ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0E00.0000.6400.2700.0002.0180.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1641 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0004.0000.0000.0000.0000.0000.0000.0000.0000.0000" };
			SecurityMask masktest1642 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Created", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0001.0010.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1643 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Requested", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1644 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1645 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Submitted_Fast_Track", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1646 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Approved", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1647 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "DA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1648 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "GA_Rejected", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1649 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Final_Approval", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1650 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Active", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1651 = new SecurityMask { OBJ_TYPE = "CAP BAND", ROLE_TYPE_CD = "SA", WFSTG_CD = "Expired", ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0C00.0002.6000.0000" };
			SecurityMask masktest1652 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "CBA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.000F.FFFF.1880.0180.0200.1000.0000.0201.03D1.0210.04F8.0190.06FF.2C10.0022.382B.8030" };
			SecurityMask masktest1653 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "DA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1800.0000" };
			SecurityMask masktest1654 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "Finance", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.000F.FFFF.1880.0180.0200.1000.0000.0201.03D1.0210.04F8.0190.06FF.2C10.0022.382B.8030" };
			SecurityMask masktest1655 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0006.4FF8.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.00C0.0000.0000.0000.0000" };
			SecurityMask masktest1656 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "FSE", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1800.0000" };
			SecurityMask masktest1657 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_REQUIRED", PERMISSION_MASK = "0000.0000.0000.0000.1800.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.1800.0000" };
			SecurityMask masktest1658 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "GA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.0006.4FF8.0000.0000.0000.0000.0000.0000.0000.0000.0000.0000.00C0.0000.0000.0000.0000" };
			SecurityMask masktest1659 = new SecurityMask { OBJ_TYPE = "PLI", ROLE_TYPE_CD = "RA", WFSTG_CD = null, ACTN_CD = "ATRB_HIDDEN", PERMISSION_MASK = "0000.0000.000F.FFFF.1880.0180.0200.1000.0000.0201.03D1.0210.04F8.0190.06FF.2C10.0022.382B.8030" };

			securityMasks.Add(masktest1);
			securityMasks.Add(masktest2);
			securityMasks.Add(masktest3);
			securityMasks.Add(masktest4);
			securityMasks.Add(masktest5);
			securityMasks.Add(masktest6);
			securityMasks.Add(masktest7);
			securityMasks.Add(masktest8);
			securityMasks.Add(masktest9);
			securityMasks.Add(masktest10);
			securityMasks.Add(masktest11);
			securityMasks.Add(masktest12);
			securityMasks.Add(masktest13);
			securityMasks.Add(masktest14);
			securityMasks.Add(masktest15);
			securityMasks.Add(masktest16);
			securityMasks.Add(masktest17);
			securityMasks.Add(masktest18);
			securityMasks.Add(masktest19);
			securityMasks.Add(masktest20);
			securityMasks.Add(masktest21);
			securityMasks.Add(masktest22);
			securityMasks.Add(masktest23);
			securityMasks.Add(masktest24);
			securityMasks.Add(masktest25);
			securityMasks.Add(masktest26);
			securityMasks.Add(masktest27);
			securityMasks.Add(masktest28);
			securityMasks.Add(masktest29);
			securityMasks.Add(masktest30);
			securityMasks.Add(masktest31);
			securityMasks.Add(masktest32);
			securityMasks.Add(masktest33);
			securityMasks.Add(masktest34);
			securityMasks.Add(masktest35);
			securityMasks.Add(masktest36);
			securityMasks.Add(masktest37);
			securityMasks.Add(masktest38);
			securityMasks.Add(masktest39);
			securityMasks.Add(masktest40);
			securityMasks.Add(masktest41);
			securityMasks.Add(masktest42);
			securityMasks.Add(masktest43);
			securityMasks.Add(masktest44);
			securityMasks.Add(masktest45);
			securityMasks.Add(masktest46);
			securityMasks.Add(masktest47);
			securityMasks.Add(masktest48);
			securityMasks.Add(masktest49);
			securityMasks.Add(masktest50);
			securityMasks.Add(masktest51);
			securityMasks.Add(masktest52);
			securityMasks.Add(masktest53);
			securityMasks.Add(masktest54);
			securityMasks.Add(masktest55);
			securityMasks.Add(masktest56);
			securityMasks.Add(masktest57);
			securityMasks.Add(masktest58);
			securityMasks.Add(masktest59);
			securityMasks.Add(masktest60);
			securityMasks.Add(masktest61);
			securityMasks.Add(masktest62);
			securityMasks.Add(masktest63);
			securityMasks.Add(masktest64);
			securityMasks.Add(masktest65);
			securityMasks.Add(masktest66);
			securityMasks.Add(masktest67);
			securityMasks.Add(masktest68);
			securityMasks.Add(masktest69);
			securityMasks.Add(masktest70);
			securityMasks.Add(masktest71);
			securityMasks.Add(masktest72);
			securityMasks.Add(masktest73);
			securityMasks.Add(masktest74);
			securityMasks.Add(masktest75);
			securityMasks.Add(masktest76);
			securityMasks.Add(masktest77);
			securityMasks.Add(masktest78);
			securityMasks.Add(masktest79);
			securityMasks.Add(masktest80);
			securityMasks.Add(masktest81);
			securityMasks.Add(masktest82);
			securityMasks.Add(masktest83);
			securityMasks.Add(masktest84);
			securityMasks.Add(masktest85);
			securityMasks.Add(masktest86);
			securityMasks.Add(masktest87);
			securityMasks.Add(masktest88);
			securityMasks.Add(masktest89);
			securityMasks.Add(masktest90);
			securityMasks.Add(masktest91);
			securityMasks.Add(masktest92);
			securityMasks.Add(masktest93);
			securityMasks.Add(masktest94);
			securityMasks.Add(masktest95);
			securityMasks.Add(masktest96);
			securityMasks.Add(masktest97);
			securityMasks.Add(masktest98);
			securityMasks.Add(masktest99);
			securityMasks.Add(masktest100);
			securityMasks.Add(masktest101);
			securityMasks.Add(masktest102);
			securityMasks.Add(masktest103);
			securityMasks.Add(masktest104);
			securityMasks.Add(masktest105);
			securityMasks.Add(masktest106);
			securityMasks.Add(masktest107);
			securityMasks.Add(masktest108);
			securityMasks.Add(masktest109);
			securityMasks.Add(masktest110);
			securityMasks.Add(masktest111);
			securityMasks.Add(masktest112);
			securityMasks.Add(masktest113);
			securityMasks.Add(masktest114);
			securityMasks.Add(masktest115);
			securityMasks.Add(masktest116);
			securityMasks.Add(masktest117);
			securityMasks.Add(masktest118);
			securityMasks.Add(masktest119);
			securityMasks.Add(masktest120);
			securityMasks.Add(masktest121);
			securityMasks.Add(masktest122);
			securityMasks.Add(masktest123);
			securityMasks.Add(masktest124);
			securityMasks.Add(masktest125);
			securityMasks.Add(masktest126);
			securityMasks.Add(masktest127);
			securityMasks.Add(masktest128);
			securityMasks.Add(masktest129);
			securityMasks.Add(masktest130);
			securityMasks.Add(masktest131);
			securityMasks.Add(masktest132);
			securityMasks.Add(masktest133);
			securityMasks.Add(masktest134);
			securityMasks.Add(masktest135);
			securityMasks.Add(masktest136);
			securityMasks.Add(masktest137);
			securityMasks.Add(masktest138);
			securityMasks.Add(masktest139);
			securityMasks.Add(masktest140);
			securityMasks.Add(masktest141);
			securityMasks.Add(masktest142);
			securityMasks.Add(masktest143);
			securityMasks.Add(masktest144);
			securityMasks.Add(masktest145);
			securityMasks.Add(masktest146);
			securityMasks.Add(masktest147);
			securityMasks.Add(masktest148);
			securityMasks.Add(masktest149);
			securityMasks.Add(masktest150);
			securityMasks.Add(masktest151);
			securityMasks.Add(masktest152);
			securityMasks.Add(masktest153);
			securityMasks.Add(masktest154);
			securityMasks.Add(masktest155);
			securityMasks.Add(masktest156);
			securityMasks.Add(masktest157);
			securityMasks.Add(masktest158);
			securityMasks.Add(masktest159);
			securityMasks.Add(masktest160);
			securityMasks.Add(masktest161);
			securityMasks.Add(masktest162);
			securityMasks.Add(masktest163);
			securityMasks.Add(masktest164);
			securityMasks.Add(masktest165);
			securityMasks.Add(masktest166);
			securityMasks.Add(masktest167);
			securityMasks.Add(masktest168);
			securityMasks.Add(masktest169);
			securityMasks.Add(masktest170);
			securityMasks.Add(masktest171);
			securityMasks.Add(masktest172);
			securityMasks.Add(masktest173);
			securityMasks.Add(masktest174);
			securityMasks.Add(masktest175);
			securityMasks.Add(masktest176);
			securityMasks.Add(masktest177);
			securityMasks.Add(masktest178);
			securityMasks.Add(masktest179);
			securityMasks.Add(masktest180);
			securityMasks.Add(masktest181);
			securityMasks.Add(masktest182);
			securityMasks.Add(masktest183);
			securityMasks.Add(masktest184);
			securityMasks.Add(masktest185);
			securityMasks.Add(masktest186);
			securityMasks.Add(masktest187);
			securityMasks.Add(masktest188);
			securityMasks.Add(masktest189);
			securityMasks.Add(masktest190);
			securityMasks.Add(masktest191);
			securityMasks.Add(masktest192);
			securityMasks.Add(masktest193);
			securityMasks.Add(masktest194);
			securityMasks.Add(masktest195);
			securityMasks.Add(masktest196);
			securityMasks.Add(masktest197);
			securityMasks.Add(masktest198);
			securityMasks.Add(masktest199);
			securityMasks.Add(masktest200);
			securityMasks.Add(masktest201);
			securityMasks.Add(masktest202);
			securityMasks.Add(masktest203);
			securityMasks.Add(masktest204);
			securityMasks.Add(masktest205);
			securityMasks.Add(masktest206);
			securityMasks.Add(masktest207);
			securityMasks.Add(masktest208);
			securityMasks.Add(masktest209);
			securityMasks.Add(masktest210);
			securityMasks.Add(masktest211);
			securityMasks.Add(masktest212);
			securityMasks.Add(masktest213);
			securityMasks.Add(masktest214);
			securityMasks.Add(masktest215);
			securityMasks.Add(masktest216);
			securityMasks.Add(masktest217);
			securityMasks.Add(masktest218);
			securityMasks.Add(masktest219);
			securityMasks.Add(masktest220);
			securityMasks.Add(masktest221);
			securityMasks.Add(masktest222);
			securityMasks.Add(masktest223);
			securityMasks.Add(masktest224);
			securityMasks.Add(masktest225);
			securityMasks.Add(masktest226);
			securityMasks.Add(masktest227);
			securityMasks.Add(masktest228);
			securityMasks.Add(masktest229);
			securityMasks.Add(masktest230);
			securityMasks.Add(masktest231);
			securityMasks.Add(masktest232);
			securityMasks.Add(masktest233);
			securityMasks.Add(masktest234);
			securityMasks.Add(masktest235);
			securityMasks.Add(masktest236);
			securityMasks.Add(masktest237);
			securityMasks.Add(masktest238);
			securityMasks.Add(masktest239);
			securityMasks.Add(masktest240);
			securityMasks.Add(masktest241);
			securityMasks.Add(masktest242);
			securityMasks.Add(masktest243);
			securityMasks.Add(masktest244);
			securityMasks.Add(masktest245);
			securityMasks.Add(masktest246);
			securityMasks.Add(masktest247);
			securityMasks.Add(masktest248);
			securityMasks.Add(masktest249);
			securityMasks.Add(masktest250);
			securityMasks.Add(masktest251);
			securityMasks.Add(masktest252);
			securityMasks.Add(masktest253);
			securityMasks.Add(masktest254);
			securityMasks.Add(masktest255);
			securityMasks.Add(masktest256);
			securityMasks.Add(masktest257);
			securityMasks.Add(masktest258);
			securityMasks.Add(masktest259);
			securityMasks.Add(masktest260);
			securityMasks.Add(masktest261);
			securityMasks.Add(masktest262);
			securityMasks.Add(masktest263);
			securityMasks.Add(masktest264);
			securityMasks.Add(masktest265);
			securityMasks.Add(masktest266);
			securityMasks.Add(masktest267);
			securityMasks.Add(masktest268);
			securityMasks.Add(masktest269);
			securityMasks.Add(masktest270);
			securityMasks.Add(masktest271);
			securityMasks.Add(masktest272);
			securityMasks.Add(masktest273);
			securityMasks.Add(masktest274);
			securityMasks.Add(masktest275);
			securityMasks.Add(masktest276);
			securityMasks.Add(masktest277);
			securityMasks.Add(masktest278);
			securityMasks.Add(masktest279);
			securityMasks.Add(masktest280);
			securityMasks.Add(masktest281);
			securityMasks.Add(masktest282);
			securityMasks.Add(masktest283);
			securityMasks.Add(masktest284);
			securityMasks.Add(masktest285);
			securityMasks.Add(masktest286);
			securityMasks.Add(masktest287);
			securityMasks.Add(masktest288);
			securityMasks.Add(masktest289);
			securityMasks.Add(masktest290);
			securityMasks.Add(masktest291);
			securityMasks.Add(masktest292);
			securityMasks.Add(masktest293);
			securityMasks.Add(masktest294);
			securityMasks.Add(masktest295);
			securityMasks.Add(masktest296);
			securityMasks.Add(masktest297);
			securityMasks.Add(masktest298);
			securityMasks.Add(masktest299);
			securityMasks.Add(masktest300);
			securityMasks.Add(masktest301);
			securityMasks.Add(masktest302);
			securityMasks.Add(masktest303);
			securityMasks.Add(masktest304);
			securityMasks.Add(masktest305);
			securityMasks.Add(masktest306);
			securityMasks.Add(masktest307);
			securityMasks.Add(masktest308);
			securityMasks.Add(masktest309);
			securityMasks.Add(masktest310);
			securityMasks.Add(masktest311);
			securityMasks.Add(masktest312);
			securityMasks.Add(masktest313);
			securityMasks.Add(masktest314);
			securityMasks.Add(masktest315);
			securityMasks.Add(masktest316);
			securityMasks.Add(masktest317);
			securityMasks.Add(masktest318);
			securityMasks.Add(masktest319);
			securityMasks.Add(masktest320);
			securityMasks.Add(masktest321);
			securityMasks.Add(masktest322);
			securityMasks.Add(masktest323);
			securityMasks.Add(masktest324);
			securityMasks.Add(masktest325);
			securityMasks.Add(masktest326);
			securityMasks.Add(masktest327);
			securityMasks.Add(masktest328);
			securityMasks.Add(masktest329);
			securityMasks.Add(masktest330);
			securityMasks.Add(masktest331);
			securityMasks.Add(masktest332);
			securityMasks.Add(masktest333);
			securityMasks.Add(masktest334);
			securityMasks.Add(masktest335);
			securityMasks.Add(masktest336);
			securityMasks.Add(masktest337);
			securityMasks.Add(masktest338);
			securityMasks.Add(masktest339);
			securityMasks.Add(masktest340);
			securityMasks.Add(masktest341);
			securityMasks.Add(masktest342);
			securityMasks.Add(masktest343);
			securityMasks.Add(masktest344);
			securityMasks.Add(masktest345);
			securityMasks.Add(masktest346);
			securityMasks.Add(masktest347);
			securityMasks.Add(masktest348);
			securityMasks.Add(masktest349);
			securityMasks.Add(masktest350);
			securityMasks.Add(masktest351);
			securityMasks.Add(masktest352);
			securityMasks.Add(masktest353);
			securityMasks.Add(masktest354);
			securityMasks.Add(masktest355);
			securityMasks.Add(masktest356);
			securityMasks.Add(masktest357);
			securityMasks.Add(masktest358);
			securityMasks.Add(masktest359);
			securityMasks.Add(masktest360);
			securityMasks.Add(masktest361);
			securityMasks.Add(masktest362);
			securityMasks.Add(masktest363);
			securityMasks.Add(masktest364);
			securityMasks.Add(masktest365);
			securityMasks.Add(masktest366);
			securityMasks.Add(masktest367);
			securityMasks.Add(masktest368);
			securityMasks.Add(masktest369);
			securityMasks.Add(masktest370);
			securityMasks.Add(masktest371);
			securityMasks.Add(masktest372);
			securityMasks.Add(masktest373);
			securityMasks.Add(masktest374);
			securityMasks.Add(masktest375);
			securityMasks.Add(masktest376);
			securityMasks.Add(masktest377);
			securityMasks.Add(masktest378);
			securityMasks.Add(masktest379);
			securityMasks.Add(masktest380);
			securityMasks.Add(masktest381);
			securityMasks.Add(masktest382);
			securityMasks.Add(masktest383);
			securityMasks.Add(masktest384);
			securityMasks.Add(masktest385);
			securityMasks.Add(masktest386);
			securityMasks.Add(masktest387);
			securityMasks.Add(masktest388);
			securityMasks.Add(masktest389);
			securityMasks.Add(masktest390);
			securityMasks.Add(masktest391);
			securityMasks.Add(masktest392);
			securityMasks.Add(masktest393);
			securityMasks.Add(masktest394);
			securityMasks.Add(masktest395);
			securityMasks.Add(masktest396);
			securityMasks.Add(masktest397);
			securityMasks.Add(masktest398);
			securityMasks.Add(masktest399);
			securityMasks.Add(masktest400);
			securityMasks.Add(masktest401);
			securityMasks.Add(masktest402);
			securityMasks.Add(masktest403);
			securityMasks.Add(masktest404);
			securityMasks.Add(masktest405);
			securityMasks.Add(masktest406);
			securityMasks.Add(masktest407);
			securityMasks.Add(masktest408);
			securityMasks.Add(masktest409);
			securityMasks.Add(masktest410);
			securityMasks.Add(masktest411);
			securityMasks.Add(masktest412);
			securityMasks.Add(masktest413);
			securityMasks.Add(masktest414);
			securityMasks.Add(masktest415);
			securityMasks.Add(masktest416);
			securityMasks.Add(masktest417);
			securityMasks.Add(masktest418);
			securityMasks.Add(masktest419);
			securityMasks.Add(masktest420);
			securityMasks.Add(masktest421);
			securityMasks.Add(masktest422);
			securityMasks.Add(masktest423);
			securityMasks.Add(masktest424);
			securityMasks.Add(masktest425);
			securityMasks.Add(masktest426);
			securityMasks.Add(masktest427);
			securityMasks.Add(masktest428);
			securityMasks.Add(masktest429);
			securityMasks.Add(masktest430);
			securityMasks.Add(masktest431);
			securityMasks.Add(masktest432);
			securityMasks.Add(masktest433);
			securityMasks.Add(masktest434);
			securityMasks.Add(masktest435);
			securityMasks.Add(masktest436);
			securityMasks.Add(masktest437);
			securityMasks.Add(masktest438);
			securityMasks.Add(masktest439);
			securityMasks.Add(masktest440);
			securityMasks.Add(masktest441);
			securityMasks.Add(masktest442);
			securityMasks.Add(masktest443);
			securityMasks.Add(masktest444);
			securityMasks.Add(masktest445);
			securityMasks.Add(masktest446);
			securityMasks.Add(masktest447);
			securityMasks.Add(masktest448);
			securityMasks.Add(masktest449);
			securityMasks.Add(masktest450);
			securityMasks.Add(masktest451);
			securityMasks.Add(masktest452);
			securityMasks.Add(masktest453);
			securityMasks.Add(masktest454);
			securityMasks.Add(masktest455);
			securityMasks.Add(masktest456);
			securityMasks.Add(masktest457);
			securityMasks.Add(masktest458);
			securityMasks.Add(masktest459);
			securityMasks.Add(masktest460);
			securityMasks.Add(masktest461);
			securityMasks.Add(masktest462);
			securityMasks.Add(masktest463);
			securityMasks.Add(masktest464);
			securityMasks.Add(masktest465);
			securityMasks.Add(masktest466);
			securityMasks.Add(masktest467);
			securityMasks.Add(masktest468);
			securityMasks.Add(masktest469);
			securityMasks.Add(masktest470);
			securityMasks.Add(masktest471);
			securityMasks.Add(masktest472);
			securityMasks.Add(masktest473);
			securityMasks.Add(masktest474);
			securityMasks.Add(masktest475);
			securityMasks.Add(masktest476);
			securityMasks.Add(masktest477);
			securityMasks.Add(masktest478);
			securityMasks.Add(masktest479);
			securityMasks.Add(masktest480);
			securityMasks.Add(masktest481);
			securityMasks.Add(masktest482);
			securityMasks.Add(masktest483);
			securityMasks.Add(masktest484);
			securityMasks.Add(masktest485);
			securityMasks.Add(masktest486);
			securityMasks.Add(masktest487);
			securityMasks.Add(masktest488);
			securityMasks.Add(masktest489);
			securityMasks.Add(masktest490);
			securityMasks.Add(masktest491);
			securityMasks.Add(masktest492);
			securityMasks.Add(masktest493);
			securityMasks.Add(masktest494);
			securityMasks.Add(masktest495);
			securityMasks.Add(masktest496);
			securityMasks.Add(masktest497);
			securityMasks.Add(masktest498);
			securityMasks.Add(masktest499);
			securityMasks.Add(masktest500);
			securityMasks.Add(masktest501);
			securityMasks.Add(masktest502);
			securityMasks.Add(masktest503);
			securityMasks.Add(masktest504);
			securityMasks.Add(masktest505);
			securityMasks.Add(masktest506);
			securityMasks.Add(masktest507);
			securityMasks.Add(masktest508);
			securityMasks.Add(masktest509);
			securityMasks.Add(masktest510);
			securityMasks.Add(masktest511);
			securityMasks.Add(masktest512);
			securityMasks.Add(masktest513);
			securityMasks.Add(masktest514);
			securityMasks.Add(masktest515);
			securityMasks.Add(masktest516);
			securityMasks.Add(masktest517);
			securityMasks.Add(masktest518);
			securityMasks.Add(masktest519);
			securityMasks.Add(masktest520);
			securityMasks.Add(masktest521);
			securityMasks.Add(masktest522);
			securityMasks.Add(masktest523);
			securityMasks.Add(masktest524);
			securityMasks.Add(masktest525);
			securityMasks.Add(masktest526);
			securityMasks.Add(masktest527);
			securityMasks.Add(masktest528);
			securityMasks.Add(masktest529);
			securityMasks.Add(masktest530);
			securityMasks.Add(masktest531);
			securityMasks.Add(masktest532);
			securityMasks.Add(masktest533);
			securityMasks.Add(masktest534);
			securityMasks.Add(masktest535);
			securityMasks.Add(masktest536);
			securityMasks.Add(masktest537);
			securityMasks.Add(masktest538);
			securityMasks.Add(masktest539);
			securityMasks.Add(masktest540);
			securityMasks.Add(masktest541);
			securityMasks.Add(masktest542);
			securityMasks.Add(masktest543);
			securityMasks.Add(masktest544);
			securityMasks.Add(masktest545);
			securityMasks.Add(masktest546);
			securityMasks.Add(masktest547);
			securityMasks.Add(masktest548);
			securityMasks.Add(masktest549);
			securityMasks.Add(masktest550);
			securityMasks.Add(masktest551);
			securityMasks.Add(masktest552);
			securityMasks.Add(masktest553);
			securityMasks.Add(masktest554);
			securityMasks.Add(masktest555);
			securityMasks.Add(masktest556);
			securityMasks.Add(masktest557);
			securityMasks.Add(masktest558);
			securityMasks.Add(masktest559);
			securityMasks.Add(masktest560);
			securityMasks.Add(masktest561);
			securityMasks.Add(masktest562);
			securityMasks.Add(masktest563);
			securityMasks.Add(masktest564);
			securityMasks.Add(masktest565);
			securityMasks.Add(masktest566);
			securityMasks.Add(masktest567);
			securityMasks.Add(masktest568);
			securityMasks.Add(masktest569);
			securityMasks.Add(masktest570);
			securityMasks.Add(masktest571);
			securityMasks.Add(masktest572);
			securityMasks.Add(masktest573);
			securityMasks.Add(masktest574);
			securityMasks.Add(masktest575);
			securityMasks.Add(masktest576);
			securityMasks.Add(masktest577);
			securityMasks.Add(masktest578);
			securityMasks.Add(masktest579);
			securityMasks.Add(masktest580);
			securityMasks.Add(masktest581);
			securityMasks.Add(masktest582);
			securityMasks.Add(masktest583);
			securityMasks.Add(masktest584);
			securityMasks.Add(masktest585);
			securityMasks.Add(masktest586);
			securityMasks.Add(masktest587);
			securityMasks.Add(masktest588);
			securityMasks.Add(masktest589);
			securityMasks.Add(masktest590);
			securityMasks.Add(masktest591);
			securityMasks.Add(masktest592);
			securityMasks.Add(masktest593);
			securityMasks.Add(masktest594);
			securityMasks.Add(masktest595);
			securityMasks.Add(masktest596);
			securityMasks.Add(masktest597);
			securityMasks.Add(masktest598);
			securityMasks.Add(masktest599);
			securityMasks.Add(masktest600);
			securityMasks.Add(masktest601);
			securityMasks.Add(masktest602);
			securityMasks.Add(masktest603);
			securityMasks.Add(masktest604);
			securityMasks.Add(masktest605);
			securityMasks.Add(masktest606);
			securityMasks.Add(masktest607);
			securityMasks.Add(masktest608);
			securityMasks.Add(masktest609);
			securityMasks.Add(masktest610);
			securityMasks.Add(masktest611);
			securityMasks.Add(masktest612);
			securityMasks.Add(masktest613);
			securityMasks.Add(masktest614);
			securityMasks.Add(masktest615);
			securityMasks.Add(masktest616);
			securityMasks.Add(masktest617);
			securityMasks.Add(masktest618);
			securityMasks.Add(masktest619);
			securityMasks.Add(masktest620);
			securityMasks.Add(masktest621);
			securityMasks.Add(masktest622);
			securityMasks.Add(masktest623);
			securityMasks.Add(masktest624);
			securityMasks.Add(masktest625);
			securityMasks.Add(masktest626);
			securityMasks.Add(masktest627);
			securityMasks.Add(masktest628);
			securityMasks.Add(masktest629);
			securityMasks.Add(masktest630);
			securityMasks.Add(masktest631);
			securityMasks.Add(masktest632);
			securityMasks.Add(masktest633);
			securityMasks.Add(masktest634);
			securityMasks.Add(masktest635);
			securityMasks.Add(masktest636);
			securityMasks.Add(masktest637);
			securityMasks.Add(masktest638);
			securityMasks.Add(masktest639);
			securityMasks.Add(masktest640);
			securityMasks.Add(masktest641);
			securityMasks.Add(masktest642);
			securityMasks.Add(masktest643);
			securityMasks.Add(masktest644);
			securityMasks.Add(masktest645);
			securityMasks.Add(masktest646);
			securityMasks.Add(masktest647);
			securityMasks.Add(masktest648);
			securityMasks.Add(masktest649);
			securityMasks.Add(masktest650);
			securityMasks.Add(masktest651);
			securityMasks.Add(masktest652);
			securityMasks.Add(masktest653);
			securityMasks.Add(masktest654);
			securityMasks.Add(masktest655);
			securityMasks.Add(masktest656);
			securityMasks.Add(masktest657);
			securityMasks.Add(masktest658);
			securityMasks.Add(masktest659);
			securityMasks.Add(masktest660);
			securityMasks.Add(masktest661);
			securityMasks.Add(masktest662);
			securityMasks.Add(masktest663);
			securityMasks.Add(masktest664);
			securityMasks.Add(masktest665);
			securityMasks.Add(masktest666);
			securityMasks.Add(masktest667);
			securityMasks.Add(masktest668);
			securityMasks.Add(masktest669);
			securityMasks.Add(masktest670);
			securityMasks.Add(masktest671);
			securityMasks.Add(masktest672);
			securityMasks.Add(masktest673);
			securityMasks.Add(masktest674);
			securityMasks.Add(masktest675);
			securityMasks.Add(masktest676);
			securityMasks.Add(masktest677);
			securityMasks.Add(masktest678);
			securityMasks.Add(masktest679);
			securityMasks.Add(masktest680);
			securityMasks.Add(masktest681);
			securityMasks.Add(masktest682);
			securityMasks.Add(masktest683);
			securityMasks.Add(masktest684);
			securityMasks.Add(masktest685);
			securityMasks.Add(masktest686);
			securityMasks.Add(masktest687);
			securityMasks.Add(masktest688);
			securityMasks.Add(masktest689);
			securityMasks.Add(masktest690);
			securityMasks.Add(masktest691);
			securityMasks.Add(masktest692);
			securityMasks.Add(masktest693);
			securityMasks.Add(masktest694);
			securityMasks.Add(masktest695);
			securityMasks.Add(masktest696);
			securityMasks.Add(masktest697);
			securityMasks.Add(masktest698);
			securityMasks.Add(masktest699);
			securityMasks.Add(masktest700);
			securityMasks.Add(masktest701);
			securityMasks.Add(masktest702);
			securityMasks.Add(masktest703);
			securityMasks.Add(masktest704);
			securityMasks.Add(masktest705);
			securityMasks.Add(masktest706);
			securityMasks.Add(masktest707);
			securityMasks.Add(masktest708);
			securityMasks.Add(masktest709);
			securityMasks.Add(masktest710);
			securityMasks.Add(masktest711);
			securityMasks.Add(masktest712);
			securityMasks.Add(masktest713);
			securityMasks.Add(masktest714);
			securityMasks.Add(masktest715);
			securityMasks.Add(masktest716);
			securityMasks.Add(masktest717);
			securityMasks.Add(masktest718);
			securityMasks.Add(masktest719);
			securityMasks.Add(masktest720);
			securityMasks.Add(masktest721);
			securityMasks.Add(masktest722);
			securityMasks.Add(masktest723);
			securityMasks.Add(masktest724);
			securityMasks.Add(masktest725);
			securityMasks.Add(masktest726);
			securityMasks.Add(masktest727);
			securityMasks.Add(masktest728);
			securityMasks.Add(masktest729);
			securityMasks.Add(masktest730);
			securityMasks.Add(masktest731);
			securityMasks.Add(masktest732);
			securityMasks.Add(masktest733);
			securityMasks.Add(masktest734);
			securityMasks.Add(masktest735);
			securityMasks.Add(masktest736);
			securityMasks.Add(masktest737);
			securityMasks.Add(masktest738);
			securityMasks.Add(masktest739);
			securityMasks.Add(masktest740);
			securityMasks.Add(masktest741);
			securityMasks.Add(masktest742);
			securityMasks.Add(masktest743);
			securityMasks.Add(masktest744);
			securityMasks.Add(masktest745);
			securityMasks.Add(masktest746);
			securityMasks.Add(masktest747);
			securityMasks.Add(masktest748);
			securityMasks.Add(masktest749);
			securityMasks.Add(masktest750);
			securityMasks.Add(masktest751);
			securityMasks.Add(masktest752);
			securityMasks.Add(masktest753);
			securityMasks.Add(masktest754);
			securityMasks.Add(masktest755);
			securityMasks.Add(masktest756);
			securityMasks.Add(masktest757);
			securityMasks.Add(masktest758);
			securityMasks.Add(masktest759);
			securityMasks.Add(masktest760);
			securityMasks.Add(masktest761);
			securityMasks.Add(masktest762);
			securityMasks.Add(masktest763);
			securityMasks.Add(masktest764);
			securityMasks.Add(masktest765);
			securityMasks.Add(masktest766);
			securityMasks.Add(masktest767);
			securityMasks.Add(masktest768);
			securityMasks.Add(masktest769);
			securityMasks.Add(masktest770);
			securityMasks.Add(masktest771);
			securityMasks.Add(masktest772);
			securityMasks.Add(masktest773);
			securityMasks.Add(masktest774);
			securityMasks.Add(masktest775);
			securityMasks.Add(masktest776);
			securityMasks.Add(masktest777);
			securityMasks.Add(masktest778);
			securityMasks.Add(masktest779);
			securityMasks.Add(masktest780);
			securityMasks.Add(masktest781);
			securityMasks.Add(masktest782);
			securityMasks.Add(masktest783);
			securityMasks.Add(masktest784);
			securityMasks.Add(masktest785);
			securityMasks.Add(masktest786);
			securityMasks.Add(masktest787);
			securityMasks.Add(masktest788);
			securityMasks.Add(masktest789);
			securityMasks.Add(masktest790);
			securityMasks.Add(masktest791);
			securityMasks.Add(masktest792);
			securityMasks.Add(masktest793);
			securityMasks.Add(masktest794);
			securityMasks.Add(masktest795);
			securityMasks.Add(masktest796);
			securityMasks.Add(masktest797);
			securityMasks.Add(masktest798);
			securityMasks.Add(masktest799);
			securityMasks.Add(masktest800);
			securityMasks.Add(masktest801);
			securityMasks.Add(masktest802);
			securityMasks.Add(masktest803);
			securityMasks.Add(masktest804);
			securityMasks.Add(masktest805);
			securityMasks.Add(masktest806);
			securityMasks.Add(masktest807);
			securityMasks.Add(masktest808);
			securityMasks.Add(masktest809);
			securityMasks.Add(masktest810);
			securityMasks.Add(masktest811);
			securityMasks.Add(masktest812);
			securityMasks.Add(masktest813);
			securityMasks.Add(masktest814);
			securityMasks.Add(masktest815);
			securityMasks.Add(masktest816);
			securityMasks.Add(masktest817);
			securityMasks.Add(masktest818);
			securityMasks.Add(masktest819);
			securityMasks.Add(masktest820);
			securityMasks.Add(masktest821);
			securityMasks.Add(masktest822);
			securityMasks.Add(masktest823);
			securityMasks.Add(masktest824);
			securityMasks.Add(masktest825);
			securityMasks.Add(masktest826);
			securityMasks.Add(masktest827);
			securityMasks.Add(masktest828);
			securityMasks.Add(masktest829);
			securityMasks.Add(masktest830);
			securityMasks.Add(masktest831);
			securityMasks.Add(masktest832);
			securityMasks.Add(masktest833);
			securityMasks.Add(masktest834);
			securityMasks.Add(masktest835);
			securityMasks.Add(masktest836);
			securityMasks.Add(masktest837);
			securityMasks.Add(masktest838);
			securityMasks.Add(masktest839);
			securityMasks.Add(masktest840);
			securityMasks.Add(masktest841);
			securityMasks.Add(masktest842);
			securityMasks.Add(masktest843);
			securityMasks.Add(masktest844);
			securityMasks.Add(masktest845);
			securityMasks.Add(masktest846);
			securityMasks.Add(masktest847);
			securityMasks.Add(masktest848);
			securityMasks.Add(masktest849);
			securityMasks.Add(masktest850);
			securityMasks.Add(masktest851);
			securityMasks.Add(masktest852);
			securityMasks.Add(masktest853);
			securityMasks.Add(masktest854);
			securityMasks.Add(masktest855);
			securityMasks.Add(masktest856);
			securityMasks.Add(masktest857);
			securityMasks.Add(masktest858);
			securityMasks.Add(masktest859);
			securityMasks.Add(masktest860);
			securityMasks.Add(masktest861);
			securityMasks.Add(masktest862);
			securityMasks.Add(masktest863);
			securityMasks.Add(masktest864);
			securityMasks.Add(masktest865);
			securityMasks.Add(masktest866);
			securityMasks.Add(masktest867);
			securityMasks.Add(masktest868);
			securityMasks.Add(masktest869);
			securityMasks.Add(masktest870);
			securityMasks.Add(masktest871);
			securityMasks.Add(masktest872);
			securityMasks.Add(masktest873);
			securityMasks.Add(masktest874);
			securityMasks.Add(masktest875);
			securityMasks.Add(masktest876);
			securityMasks.Add(masktest877);
			securityMasks.Add(masktest878);
			securityMasks.Add(masktest879);
			securityMasks.Add(masktest880);
			securityMasks.Add(masktest881);
			securityMasks.Add(masktest882);
			securityMasks.Add(masktest883);
			securityMasks.Add(masktest884);
			securityMasks.Add(masktest885);
			securityMasks.Add(masktest886);
			securityMasks.Add(masktest887);
			securityMasks.Add(masktest888);
			securityMasks.Add(masktest889);
			securityMasks.Add(masktest890);
			securityMasks.Add(masktest891);
			securityMasks.Add(masktest892);
			securityMasks.Add(masktest893);
			securityMasks.Add(masktest894);
			securityMasks.Add(masktest895);
			securityMasks.Add(masktest896);
			securityMasks.Add(masktest897);
			securityMasks.Add(masktest898);
			securityMasks.Add(masktest899);
			securityMasks.Add(masktest900);
			securityMasks.Add(masktest901);
			securityMasks.Add(masktest902);
			securityMasks.Add(masktest903);
			securityMasks.Add(masktest904);
			securityMasks.Add(masktest905);
			securityMasks.Add(masktest906);
			securityMasks.Add(masktest907);
			securityMasks.Add(masktest908);
			securityMasks.Add(masktest909);
			securityMasks.Add(masktest910);
			securityMasks.Add(masktest911);
			securityMasks.Add(masktest912);
			securityMasks.Add(masktest913);
			securityMasks.Add(masktest914);
			securityMasks.Add(masktest915);
			securityMasks.Add(masktest916);
			securityMasks.Add(masktest917);
			securityMasks.Add(masktest918);
			securityMasks.Add(masktest919);
			securityMasks.Add(masktest920);
			securityMasks.Add(masktest921);
			securityMasks.Add(masktest922);
			securityMasks.Add(masktest923);
			securityMasks.Add(masktest924);
			securityMasks.Add(masktest925);
			securityMasks.Add(masktest926);
			securityMasks.Add(masktest927);
			securityMasks.Add(masktest928);
			securityMasks.Add(masktest929);
			securityMasks.Add(masktest930);
			securityMasks.Add(masktest931);
			securityMasks.Add(masktest932);
			securityMasks.Add(masktest933);
			securityMasks.Add(masktest934);
			securityMasks.Add(masktest935);
			securityMasks.Add(masktest936);
			securityMasks.Add(masktest937);
			securityMasks.Add(masktest938);
			securityMasks.Add(masktest939);
			securityMasks.Add(masktest940);
			securityMasks.Add(masktest941);
			securityMasks.Add(masktest942);
			securityMasks.Add(masktest943);
			securityMasks.Add(masktest944);
			securityMasks.Add(masktest945);
			securityMasks.Add(masktest946);
			securityMasks.Add(masktest947);
			securityMasks.Add(masktest948);
			securityMasks.Add(masktest949);
			securityMasks.Add(masktest950);
			securityMasks.Add(masktest951);
			securityMasks.Add(masktest952);
			securityMasks.Add(masktest953);
			securityMasks.Add(masktest954);
			securityMasks.Add(masktest955);
			securityMasks.Add(masktest956);
			securityMasks.Add(masktest957);
			securityMasks.Add(masktest958);
			securityMasks.Add(masktest959);
			securityMasks.Add(masktest960);
			securityMasks.Add(masktest961);
			securityMasks.Add(masktest962);
			securityMasks.Add(masktest963);
			securityMasks.Add(masktest964);
			securityMasks.Add(masktest965);
			securityMasks.Add(masktest966);
			securityMasks.Add(masktest967);
			securityMasks.Add(masktest968);
			securityMasks.Add(masktest969);
			securityMasks.Add(masktest970);
			securityMasks.Add(masktest971);
			securityMasks.Add(masktest972);
			securityMasks.Add(masktest973);
			securityMasks.Add(masktest974);
			securityMasks.Add(masktest975);
			securityMasks.Add(masktest976);
			securityMasks.Add(masktest977);
			securityMasks.Add(masktest978);
			securityMasks.Add(masktest979);
			securityMasks.Add(masktest980);
			securityMasks.Add(masktest981);
			securityMasks.Add(masktest982);
			securityMasks.Add(masktest983);
			securityMasks.Add(masktest984);
			securityMasks.Add(masktest985);
			securityMasks.Add(masktest986);
			securityMasks.Add(masktest987);
			securityMasks.Add(masktest988);
			securityMasks.Add(masktest989);
			securityMasks.Add(masktest990);
			securityMasks.Add(masktest991);
			securityMasks.Add(masktest992);
			securityMasks.Add(masktest993);
			securityMasks.Add(masktest994);
			securityMasks.Add(masktest995);
			securityMasks.Add(masktest996);
			securityMasks.Add(masktest997);
			securityMasks.Add(masktest998);
			securityMasks.Add(masktest999);
			securityMasks.Add(masktest1000);
			securityMasks.Add(masktest1001);
			securityMasks.Add(masktest1002);
			securityMasks.Add(masktest1003);
			securityMasks.Add(masktest1004);
			securityMasks.Add(masktest1005);
			securityMasks.Add(masktest1006);
			securityMasks.Add(masktest1007);
			securityMasks.Add(masktest1008);
			securityMasks.Add(masktest1009);
			securityMasks.Add(masktest1010);
			securityMasks.Add(masktest1011);
			securityMasks.Add(masktest1012);
			securityMasks.Add(masktest1013);
			securityMasks.Add(masktest1014);
			securityMasks.Add(masktest1015);
			securityMasks.Add(masktest1016);
			securityMasks.Add(masktest1017);
			securityMasks.Add(masktest1018);
			securityMasks.Add(masktest1019);
			securityMasks.Add(masktest1020);
			securityMasks.Add(masktest1021);
			securityMasks.Add(masktest1022);
			securityMasks.Add(masktest1023);
			securityMasks.Add(masktest1024);
			securityMasks.Add(masktest1025);
			securityMasks.Add(masktest1026);
			securityMasks.Add(masktest1027);
			securityMasks.Add(masktest1028);
			securityMasks.Add(masktest1029);
			securityMasks.Add(masktest1030);
			securityMasks.Add(masktest1031);
			securityMasks.Add(masktest1032);
			securityMasks.Add(masktest1033);
			securityMasks.Add(masktest1034);
			securityMasks.Add(masktest1035);
			securityMasks.Add(masktest1036);
			securityMasks.Add(masktest1037);
			securityMasks.Add(masktest1038);
			securityMasks.Add(masktest1039);
			securityMasks.Add(masktest1040);
			securityMasks.Add(masktest1041);
			securityMasks.Add(masktest1042);
			securityMasks.Add(masktest1043);
			securityMasks.Add(masktest1044);
			securityMasks.Add(masktest1045);
			securityMasks.Add(masktest1046);
			securityMasks.Add(masktest1047);
			securityMasks.Add(masktest1048);
			securityMasks.Add(masktest1049);
			securityMasks.Add(masktest1050);
			securityMasks.Add(masktest1051);
			securityMasks.Add(masktest1052);
			securityMasks.Add(masktest1053);
			securityMasks.Add(masktest1054);
			securityMasks.Add(masktest1055);
			securityMasks.Add(masktest1056);
			securityMasks.Add(masktest1057);
			securityMasks.Add(masktest1058);
			securityMasks.Add(masktest1059);
			securityMasks.Add(masktest1060);
			securityMasks.Add(masktest1061);
			securityMasks.Add(masktest1062);
			securityMasks.Add(masktest1063);
			securityMasks.Add(masktest1064);
			securityMasks.Add(masktest1065);
			securityMasks.Add(masktest1066);
			securityMasks.Add(masktest1067);
			securityMasks.Add(masktest1068);
			securityMasks.Add(masktest1069);
			securityMasks.Add(masktest1070);
			securityMasks.Add(masktest1071);
			securityMasks.Add(masktest1072);
			securityMasks.Add(masktest1073);
			securityMasks.Add(masktest1074);
			securityMasks.Add(masktest1075);
			securityMasks.Add(masktest1076);
			securityMasks.Add(masktest1077);
			securityMasks.Add(masktest1078);
			securityMasks.Add(masktest1079);
			securityMasks.Add(masktest1080);
			securityMasks.Add(masktest1081);
			securityMasks.Add(masktest1082);
			securityMasks.Add(masktest1083);
			securityMasks.Add(masktest1084);
			securityMasks.Add(masktest1085);
			securityMasks.Add(masktest1086);
			securityMasks.Add(masktest1087);
			securityMasks.Add(masktest1088);
			securityMasks.Add(masktest1089);
			securityMasks.Add(masktest1090);
			securityMasks.Add(masktest1091);
			securityMasks.Add(masktest1092);
			securityMasks.Add(masktest1093);
			securityMasks.Add(masktest1094);
			securityMasks.Add(masktest1095);
			securityMasks.Add(masktest1096);
			securityMasks.Add(masktest1097);
			securityMasks.Add(masktest1098);
			securityMasks.Add(masktest1099);
			securityMasks.Add(masktest1100);
			securityMasks.Add(masktest1101);
			securityMasks.Add(masktest1102);
			securityMasks.Add(masktest1103);
			securityMasks.Add(masktest1104);
			securityMasks.Add(masktest1105);
			securityMasks.Add(masktest1106);
			securityMasks.Add(masktest1107);
			securityMasks.Add(masktest1108);
			securityMasks.Add(masktest1109);
			securityMasks.Add(masktest1110);
			securityMasks.Add(masktest1111);
			securityMasks.Add(masktest1112);
			securityMasks.Add(masktest1113);
			securityMasks.Add(masktest1114);
			securityMasks.Add(masktest1115);
			securityMasks.Add(masktest1116);
			securityMasks.Add(masktest1117);
			securityMasks.Add(masktest1118);
			securityMasks.Add(masktest1119);
			securityMasks.Add(masktest1120);
			securityMasks.Add(masktest1121);
			securityMasks.Add(masktest1122);
			securityMasks.Add(masktest1123);
			securityMasks.Add(masktest1124);
			securityMasks.Add(masktest1125);
			securityMasks.Add(masktest1126);
			securityMasks.Add(masktest1127);
			securityMasks.Add(masktest1128);
			securityMasks.Add(masktest1129);
			securityMasks.Add(masktest1130);
			securityMasks.Add(masktest1131);
			securityMasks.Add(masktest1132);
			securityMasks.Add(masktest1133);
			securityMasks.Add(masktest1134);
			securityMasks.Add(masktest1135);
			securityMasks.Add(masktest1136);
			securityMasks.Add(masktest1137);
			securityMasks.Add(masktest1138);
			securityMasks.Add(masktest1139);
			securityMasks.Add(masktest1140);
			securityMasks.Add(masktest1141);
			securityMasks.Add(masktest1142);
			securityMasks.Add(masktest1143);
			securityMasks.Add(masktest1144);
			securityMasks.Add(masktest1145);
			securityMasks.Add(masktest1146);
			securityMasks.Add(masktest1147);
			securityMasks.Add(masktest1148);
			securityMasks.Add(masktest1149);
			securityMasks.Add(masktest1150);
			securityMasks.Add(masktest1151);
			securityMasks.Add(masktest1152);
			securityMasks.Add(masktest1153);
			securityMasks.Add(masktest1154);
			securityMasks.Add(masktest1155);
			securityMasks.Add(masktest1156);
			securityMasks.Add(masktest1157);
			securityMasks.Add(masktest1158);
			securityMasks.Add(masktest1159);
			securityMasks.Add(masktest1160);
			securityMasks.Add(masktest1161);
			securityMasks.Add(masktest1162);
			securityMasks.Add(masktest1163);
			securityMasks.Add(masktest1164);
			securityMasks.Add(masktest1165);
			securityMasks.Add(masktest1166);
			securityMasks.Add(masktest1167);
			securityMasks.Add(masktest1168);
			securityMasks.Add(masktest1169);
			securityMasks.Add(masktest1170);
			securityMasks.Add(masktest1171);
			securityMasks.Add(masktest1172);
			securityMasks.Add(masktest1173);
			securityMasks.Add(masktest1174);
			securityMasks.Add(masktest1175);
			securityMasks.Add(masktest1176);
			securityMasks.Add(masktest1177);
			securityMasks.Add(masktest1178);
			securityMasks.Add(masktest1179);
			securityMasks.Add(masktest1180);
			securityMasks.Add(masktest1181);
			securityMasks.Add(masktest1182);
			securityMasks.Add(masktest1183);
			securityMasks.Add(masktest1184);
			securityMasks.Add(masktest1185);
			securityMasks.Add(masktest1186);
			securityMasks.Add(masktest1187);
			securityMasks.Add(masktest1188);
			securityMasks.Add(masktest1189);
			securityMasks.Add(masktest1190);
			securityMasks.Add(masktest1191);
			securityMasks.Add(masktest1192);
			securityMasks.Add(masktest1193);
			securityMasks.Add(masktest1194);
			securityMasks.Add(masktest1195);
			securityMasks.Add(masktest1196);
			securityMasks.Add(masktest1197);
			securityMasks.Add(masktest1198);
			securityMasks.Add(masktest1199);
			securityMasks.Add(masktest1200);
			securityMasks.Add(masktest1201);
			securityMasks.Add(masktest1202);
			securityMasks.Add(masktest1203);
			securityMasks.Add(masktest1204);
			securityMasks.Add(masktest1205);
			securityMasks.Add(masktest1206);
			securityMasks.Add(masktest1207);
			securityMasks.Add(masktest1208);
			securityMasks.Add(masktest1209);
			securityMasks.Add(masktest1210);
			securityMasks.Add(masktest1211);
			securityMasks.Add(masktest1212);
			securityMasks.Add(masktest1213);
			securityMasks.Add(masktest1214);
			securityMasks.Add(masktest1215);
			securityMasks.Add(masktest1216);
			securityMasks.Add(masktest1217);
			securityMasks.Add(masktest1218);
			securityMasks.Add(masktest1219);
			securityMasks.Add(masktest1220);
			securityMasks.Add(masktest1221);
			securityMasks.Add(masktest1222);
			securityMasks.Add(masktest1223);
			securityMasks.Add(masktest1224);
			securityMasks.Add(masktest1225);
			securityMasks.Add(masktest1226);
			securityMasks.Add(masktest1227);
			securityMasks.Add(masktest1228);
			securityMasks.Add(masktest1229);
			securityMasks.Add(masktest1230);
			securityMasks.Add(masktest1231);
			securityMasks.Add(masktest1232);
			securityMasks.Add(masktest1233);
			securityMasks.Add(masktest1234);
			securityMasks.Add(masktest1235);
			securityMasks.Add(masktest1236);
			securityMasks.Add(masktest1237);
			securityMasks.Add(masktest1238);
			securityMasks.Add(masktest1239);
			securityMasks.Add(masktest1240);
			securityMasks.Add(masktest1241);
			securityMasks.Add(masktest1242);
			securityMasks.Add(masktest1243);
			securityMasks.Add(masktest1244);
			securityMasks.Add(masktest1245);
			securityMasks.Add(masktest1246);
			securityMasks.Add(masktest1247);
			securityMasks.Add(masktest1248);
			securityMasks.Add(masktest1249);
			securityMasks.Add(masktest1250);
			securityMasks.Add(masktest1251);
			securityMasks.Add(masktest1252);
			securityMasks.Add(masktest1253);
			securityMasks.Add(masktest1254);
			securityMasks.Add(masktest1255);
			securityMasks.Add(masktest1256);
			securityMasks.Add(masktest1257);
			securityMasks.Add(masktest1258);
			securityMasks.Add(masktest1259);
			securityMasks.Add(masktest1260);
			securityMasks.Add(masktest1261);
			securityMasks.Add(masktest1262);
			securityMasks.Add(masktest1263);
			securityMasks.Add(masktest1264);
			securityMasks.Add(masktest1265);
			securityMasks.Add(masktest1266);
			securityMasks.Add(masktest1267);
			securityMasks.Add(masktest1268);
			securityMasks.Add(masktest1269);
			securityMasks.Add(masktest1270);
			securityMasks.Add(masktest1271);
			securityMasks.Add(masktest1272);
			securityMasks.Add(masktest1273);
			securityMasks.Add(masktest1274);
			securityMasks.Add(masktest1275);
			securityMasks.Add(masktest1276);
			securityMasks.Add(masktest1277);
			securityMasks.Add(masktest1278);
			securityMasks.Add(masktest1279);
			securityMasks.Add(masktest1280);
			securityMasks.Add(masktest1281);
			securityMasks.Add(masktest1282);
			securityMasks.Add(masktest1283);
			securityMasks.Add(masktest1284);
			securityMasks.Add(masktest1285);
			securityMasks.Add(masktest1286);
			securityMasks.Add(masktest1287);
			securityMasks.Add(masktest1288);
			securityMasks.Add(masktest1289);
			securityMasks.Add(masktest1290);
			securityMasks.Add(masktest1291);
			securityMasks.Add(masktest1292);
			securityMasks.Add(masktest1293);
			securityMasks.Add(masktest1294);
			securityMasks.Add(masktest1295);
			securityMasks.Add(masktest1296);
			securityMasks.Add(masktest1297);
			securityMasks.Add(masktest1298);
			securityMasks.Add(masktest1299);
			securityMasks.Add(masktest1300);
			securityMasks.Add(masktest1301);
			securityMasks.Add(masktest1302);
			securityMasks.Add(masktest1303);
			securityMasks.Add(masktest1304);
			securityMasks.Add(masktest1305);
			securityMasks.Add(masktest1306);
			securityMasks.Add(masktest1307);
			securityMasks.Add(masktest1308);
			securityMasks.Add(masktest1309);
			securityMasks.Add(masktest1310);
			securityMasks.Add(masktest1311);
			securityMasks.Add(masktest1312);
			securityMasks.Add(masktest1313);
			securityMasks.Add(masktest1314);
			securityMasks.Add(masktest1315);
			securityMasks.Add(masktest1316);
			securityMasks.Add(masktest1317);
			securityMasks.Add(masktest1318);
			securityMasks.Add(masktest1319);
			securityMasks.Add(masktest1320);
			securityMasks.Add(masktest1321);
			securityMasks.Add(masktest1322);
			securityMasks.Add(masktest1323);
			securityMasks.Add(masktest1324);
			securityMasks.Add(masktest1325);
			securityMasks.Add(masktest1326);
			securityMasks.Add(masktest1327);
			securityMasks.Add(masktest1328);
			securityMasks.Add(masktest1329);
			securityMasks.Add(masktest1330);
			securityMasks.Add(masktest1331);
			securityMasks.Add(masktest1332);
			securityMasks.Add(masktest1333);
			securityMasks.Add(masktest1334);
			securityMasks.Add(masktest1335);
			securityMasks.Add(masktest1336);
			securityMasks.Add(masktest1337);
			securityMasks.Add(masktest1338);
			securityMasks.Add(masktest1339);
			securityMasks.Add(masktest1340);
			securityMasks.Add(masktest1341);
			securityMasks.Add(masktest1342);
			securityMasks.Add(masktest1343);
			securityMasks.Add(masktest1344);
			securityMasks.Add(masktest1345);
			securityMasks.Add(masktest1346);
			securityMasks.Add(masktest1347);
			securityMasks.Add(masktest1348);
			securityMasks.Add(masktest1349);
			securityMasks.Add(masktest1350);
			securityMasks.Add(masktest1351);
			securityMasks.Add(masktest1352);
			securityMasks.Add(masktest1353);
			securityMasks.Add(masktest1354);
			securityMasks.Add(masktest1355);
			securityMasks.Add(masktest1356);
			securityMasks.Add(masktest1357);
			securityMasks.Add(masktest1358);
			securityMasks.Add(masktest1359);
			securityMasks.Add(masktest1360);
			securityMasks.Add(masktest1361);
			securityMasks.Add(masktest1362);
			securityMasks.Add(masktest1363);
			securityMasks.Add(masktest1364);
			securityMasks.Add(masktest1365);
			securityMasks.Add(masktest1366);
			securityMasks.Add(masktest1367);
			securityMasks.Add(masktest1368);
			securityMasks.Add(masktest1369);
			securityMasks.Add(masktest1370);
			securityMasks.Add(masktest1371);
			securityMasks.Add(masktest1372);
			securityMasks.Add(masktest1373);
			securityMasks.Add(masktest1374);
			securityMasks.Add(masktest1375);
			securityMasks.Add(masktest1376);
			securityMasks.Add(masktest1377);
			securityMasks.Add(masktest1378);
			securityMasks.Add(masktest1379);
			securityMasks.Add(masktest1380);
			securityMasks.Add(masktest1381);
			securityMasks.Add(masktest1382);
			securityMasks.Add(masktest1383);
			securityMasks.Add(masktest1384);
			securityMasks.Add(masktest1385);
			securityMasks.Add(masktest1386);
			securityMasks.Add(masktest1387);
			securityMasks.Add(masktest1388);
			securityMasks.Add(masktest1389);
			securityMasks.Add(masktest1390);
			securityMasks.Add(masktest1391);
			securityMasks.Add(masktest1392);
			securityMasks.Add(masktest1393);
			securityMasks.Add(masktest1394);
			securityMasks.Add(masktest1395);
			securityMasks.Add(masktest1396);
			securityMasks.Add(masktest1397);
			securityMasks.Add(masktest1398);
			securityMasks.Add(masktest1399);
			securityMasks.Add(masktest1400);
			securityMasks.Add(masktest1401);
			securityMasks.Add(masktest1402);
			securityMasks.Add(masktest1403);
			securityMasks.Add(masktest1404);
			securityMasks.Add(masktest1405);
			securityMasks.Add(masktest1406);
			securityMasks.Add(masktest1407);
			securityMasks.Add(masktest1408);
			securityMasks.Add(masktest1409);
			securityMasks.Add(masktest1410);
			securityMasks.Add(masktest1411);
			securityMasks.Add(masktest1412);
			securityMasks.Add(masktest1413);
			securityMasks.Add(masktest1414);
			securityMasks.Add(masktest1415);
			securityMasks.Add(masktest1416);
			securityMasks.Add(masktest1417);
			securityMasks.Add(masktest1418);
			securityMasks.Add(masktest1419);
			securityMasks.Add(masktest1420);
			securityMasks.Add(masktest1421);
			securityMasks.Add(masktest1422);
			securityMasks.Add(masktest1423);
			securityMasks.Add(masktest1424);
			securityMasks.Add(masktest1425);
			securityMasks.Add(masktest1426);
			securityMasks.Add(masktest1427);
			securityMasks.Add(masktest1428);
			securityMasks.Add(masktest1429);
			securityMasks.Add(masktest1430);
			securityMasks.Add(masktest1431);
			securityMasks.Add(masktest1432);
			securityMasks.Add(masktest1433);
			securityMasks.Add(masktest1434);
			securityMasks.Add(masktest1435);
			securityMasks.Add(masktest1436);
			securityMasks.Add(masktest1437);
			securityMasks.Add(masktest1438);
			securityMasks.Add(masktest1439);
			securityMasks.Add(masktest1440);
			securityMasks.Add(masktest1441);
			securityMasks.Add(masktest1442);
			securityMasks.Add(masktest1443);
			securityMasks.Add(masktest1444);
			securityMasks.Add(masktest1445);
			securityMasks.Add(masktest1446);
			securityMasks.Add(masktest1447);
			securityMasks.Add(masktest1448);
			securityMasks.Add(masktest1449);
			securityMasks.Add(masktest1450);
			securityMasks.Add(masktest1451);
			securityMasks.Add(masktest1452);
			securityMasks.Add(masktest1453);
			securityMasks.Add(masktest1454);
			securityMasks.Add(masktest1455);
			securityMasks.Add(masktest1456);
			securityMasks.Add(masktest1457);
			securityMasks.Add(masktest1458);
			securityMasks.Add(masktest1459);
			securityMasks.Add(masktest1460);
			securityMasks.Add(masktest1461);
			securityMasks.Add(masktest1462);
			securityMasks.Add(masktest1463);
			securityMasks.Add(masktest1464);
			securityMasks.Add(masktest1465);
			securityMasks.Add(masktest1466);
			securityMasks.Add(masktest1467);
			securityMasks.Add(masktest1468);
			securityMasks.Add(masktest1469);
			securityMasks.Add(masktest1470);
			securityMasks.Add(masktest1471);
			securityMasks.Add(masktest1472);
			securityMasks.Add(masktest1473);
			securityMasks.Add(masktest1474);
			securityMasks.Add(masktest1475);
			securityMasks.Add(masktest1476);
			securityMasks.Add(masktest1477);
			securityMasks.Add(masktest1478);
			securityMasks.Add(masktest1479);
			securityMasks.Add(masktest1480);
			securityMasks.Add(masktest1481);
			securityMasks.Add(masktest1482);
			securityMasks.Add(masktest1483);
			securityMasks.Add(masktest1484);
			securityMasks.Add(masktest1485);
			securityMasks.Add(masktest1486);
			securityMasks.Add(masktest1487);
			securityMasks.Add(masktest1488);
			securityMasks.Add(masktest1489);
			securityMasks.Add(masktest1490);
			securityMasks.Add(masktest1491);
			securityMasks.Add(masktest1492);
			securityMasks.Add(masktest1493);
			securityMasks.Add(masktest1494);
			securityMasks.Add(masktest1495);
			securityMasks.Add(masktest1496);
			securityMasks.Add(masktest1497);
			securityMasks.Add(masktest1498);
			securityMasks.Add(masktest1499);
			securityMasks.Add(masktest1500);
			securityMasks.Add(masktest1501);
			securityMasks.Add(masktest1502);
			securityMasks.Add(masktest1503);
			securityMasks.Add(masktest1504);
			securityMasks.Add(masktest1505);
			securityMasks.Add(masktest1506);
			securityMasks.Add(masktest1507);
			securityMasks.Add(masktest1508);
			securityMasks.Add(masktest1509);
			securityMasks.Add(masktest1510);
			securityMasks.Add(masktest1511);
			securityMasks.Add(masktest1512);
			securityMasks.Add(masktest1513);
			securityMasks.Add(masktest1514);
			securityMasks.Add(masktest1515);
			securityMasks.Add(masktest1516);
			securityMasks.Add(masktest1517);
			securityMasks.Add(masktest1518);
			securityMasks.Add(masktest1519);
			securityMasks.Add(masktest1520);
			securityMasks.Add(masktest1521);
			securityMasks.Add(masktest1522);
			securityMasks.Add(masktest1523);
			securityMasks.Add(masktest1524);
			securityMasks.Add(masktest1525);
			securityMasks.Add(masktest1526);
			securityMasks.Add(masktest1527);
			securityMasks.Add(masktest1528);
			securityMasks.Add(masktest1529);
			securityMasks.Add(masktest1530);
			securityMasks.Add(masktest1531);
			securityMasks.Add(masktest1532);
			securityMasks.Add(masktest1533);
			securityMasks.Add(masktest1534);
			securityMasks.Add(masktest1535);
			securityMasks.Add(masktest1536);
			securityMasks.Add(masktest1537);
			securityMasks.Add(masktest1538);
			securityMasks.Add(masktest1539);
			securityMasks.Add(masktest1540);
			securityMasks.Add(masktest1541);
			securityMasks.Add(masktest1542);
			securityMasks.Add(masktest1543);
			securityMasks.Add(masktest1544);
			securityMasks.Add(masktest1545);
			securityMasks.Add(masktest1546);
			securityMasks.Add(masktest1547);
			securityMasks.Add(masktest1548);
			securityMasks.Add(masktest1549);
			securityMasks.Add(masktest1550);
			securityMasks.Add(masktest1551);
			securityMasks.Add(masktest1552);
			securityMasks.Add(masktest1553);
			securityMasks.Add(masktest1554);
			securityMasks.Add(masktest1555);
			securityMasks.Add(masktest1556);
			securityMasks.Add(masktest1557);
			securityMasks.Add(masktest1558);
			securityMasks.Add(masktest1559);
			securityMasks.Add(masktest1560);
			securityMasks.Add(masktest1561);
			securityMasks.Add(masktest1562);
			securityMasks.Add(masktest1563);
			securityMasks.Add(masktest1564);
			securityMasks.Add(masktest1565);
			securityMasks.Add(masktest1566);
			securityMasks.Add(masktest1567);
			securityMasks.Add(masktest1568);
			securityMasks.Add(masktest1569);
			securityMasks.Add(masktest1570);
			securityMasks.Add(masktest1571);
			securityMasks.Add(masktest1572);
			securityMasks.Add(masktest1573);
			securityMasks.Add(masktest1574);
			securityMasks.Add(masktest1575);
			securityMasks.Add(masktest1576);
			securityMasks.Add(masktest1577);
			securityMasks.Add(masktest1578);
			securityMasks.Add(masktest1579);
			securityMasks.Add(masktest1580);
			securityMasks.Add(masktest1581);
			securityMasks.Add(masktest1582);
			securityMasks.Add(masktest1583);
			securityMasks.Add(masktest1584);
			securityMasks.Add(masktest1585);
			securityMasks.Add(masktest1586);
			securityMasks.Add(masktest1587);
			securityMasks.Add(masktest1588);
			securityMasks.Add(masktest1589);
			securityMasks.Add(masktest1590);
			securityMasks.Add(masktest1591);
			securityMasks.Add(masktest1592);
			securityMasks.Add(masktest1593);
			securityMasks.Add(masktest1594);
			securityMasks.Add(masktest1595);
			securityMasks.Add(masktest1596);
			securityMasks.Add(masktest1597);
			securityMasks.Add(masktest1598);
			securityMasks.Add(masktest1599);
			securityMasks.Add(masktest1600);
			securityMasks.Add(masktest1601);
			securityMasks.Add(masktest1602);
			securityMasks.Add(masktest1603);
			securityMasks.Add(masktest1604);
			securityMasks.Add(masktest1605);
			securityMasks.Add(masktest1606);
			securityMasks.Add(masktest1607);
			securityMasks.Add(masktest1608);
			securityMasks.Add(masktest1609);
			securityMasks.Add(masktest1610);
			securityMasks.Add(masktest1611);
			securityMasks.Add(masktest1612);
			securityMasks.Add(masktest1613);
			securityMasks.Add(masktest1614);
			securityMasks.Add(masktest1615);
			securityMasks.Add(masktest1616);
			securityMasks.Add(masktest1617);
			securityMasks.Add(masktest1618);
			securityMasks.Add(masktest1619);
			securityMasks.Add(masktest1620);
			securityMasks.Add(masktest1621);
			securityMasks.Add(masktest1622);
			securityMasks.Add(masktest1623);
			securityMasks.Add(masktest1624);
			securityMasks.Add(masktest1625);
			securityMasks.Add(masktest1626);
			securityMasks.Add(masktest1627);
			securityMasks.Add(masktest1628);
			securityMasks.Add(masktest1629);
			securityMasks.Add(masktest1630);
			securityMasks.Add(masktest1631);
			securityMasks.Add(masktest1632);
			securityMasks.Add(masktest1633);
			securityMasks.Add(masktest1634);
			securityMasks.Add(masktest1635);
			securityMasks.Add(masktest1636);
			securityMasks.Add(masktest1637);
			securityMasks.Add(masktest1638);
			securityMasks.Add(masktest1639);
			securityMasks.Add(masktest1640);
			securityMasks.Add(masktest1641);
			securityMasks.Add(masktest1642);
			securityMasks.Add(masktest1643);
			securityMasks.Add(masktest1644);
			securityMasks.Add(masktest1645);
			securityMasks.Add(masktest1646);
			securityMasks.Add(masktest1647);
			securityMasks.Add(masktest1648);
			securityMasks.Add(masktest1649);
			securityMasks.Add(masktest1650);
			securityMasks.Add(masktest1651);
			securityMasks.Add(masktest1652);
			securityMasks.Add(masktest1653);
			securityMasks.Add(masktest1654);
			securityMasks.Add(masktest1655);
			securityMasks.Add(masktest1656);
			securityMasks.Add(masktest1657);
			securityMasks.Add(masktest1658);
			securityMasks.Add(masktest1659);
			#endregion

			
			return new SecurityWrapper(opRoleTypes, securityActions, securityMasks);
			//return new SecurityWrapper(null, null, null);
			//return DataCollections.GetSecurityWrapper();
		}
		
		public List<AppRoleTier> GetAppRoleTiers()
		{
			return new List<AppRoleTier>();
			//return DataCollections.GetAppRoleTiers();
		}

		public List<OpRoleType> GetOpRoleTypes()
		{
			// Load Role Types
			return GetAppRoleTiers().Where(r => r.APPL_CD == "IDMS").Select(appRoleTier => new OpRoleType
			{
				RoleTypeId = appRoleTier.ROLE_TYPE_SID,
				RoleTypeCd = appRoleTier.ROLE_TYPE_CD,
				RoleTier = appRoleTier.ROLE_TIER_CD,
				RoleTypeDescription = appRoleTier.ROLE_TYPE_DESC,
				RoleTypeDisplayName = appRoleTier.ROLE_TYPE_DSPLY_CD
			}).ToList();
		}

		#region SecurityActions

		public List<SecurityActions> GetSecurityActions()
		{
			return _securityAttributesDataLib.GetSecurityActions();
		}

		public SecurityActions ManageSecurityAction(SecurityActions action, CrudModes state)
		{
			return _securityAttributesDataLib.ManageSecurityAction(action, state);
		}

		public bool DeleteSecurityAction(int id)
		{
			return _securityAttributesDataLib.DeleteSecurityAction(id);
		}

		#endregion SecurityActions

		#region Admin Applications

		public List<AdminApplications> GetAdminApplications()
		{
			return _securityAttributesDataLib.GetAdminApplications();
		}

		public AdminApplications ManageAdminApplication(AdminApplications app, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminApplication(app, state);
		}

		public bool DeleteAdminApplication(int id)
		{
			return _securityAttributesDataLib.DeleteAdminApplication(id);
		}

		#endregion Admin Applications

		#region Admin DealTypes

		public List<AdminDealType> GetAdminDealTypes()
		{
			return _securityAttributesDataLib.GetAdminDealTypes();
		}

		public AdminDealType ManageAdminDealType(AdminDealType dealType, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminDealType(dealType, state);
		}

		public bool DeleteAdminDealType(int id)
		{
			return _securityAttributesDataLib.DeleteAdminDealType(id);
		}

		#endregion Admin DealTypes

		#region Admin RoleTypes

		public List<AdminRoleType> GetAdminRoleTypes()
		{
			return _securityAttributesDataLib.GetAdminRoleTypes();
		}

		public AdminRoleType ManageAdminRoleType(AdminRoleType roleType, CrudModes state)
		{
			return _securityAttributesDataLib.ManageAdminRoleType(roleType, state);
		}

		public bool DeleteAdminRoleType(int id)
		{
			return _securityAttributesDataLib.DeleteAdminRoleType(id);
		}

		#endregion Admin RoleTypes
	}
}