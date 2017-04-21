
/*
File Updated: 4/20/2017 3:22:25 PM
On: JJYEH-MOBL
From: EG1RDMDBDEV01\DEALSDEV,3180, MYDEALS
*/

namespace Intel.MyDeals.Entities {

	public static class Attributes
	{

		public static MyDealsAttribute ALL_BCKT_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ALL_BCKT_NM",
			ATRB_DESC = "All Buckets",
			ATRB_LBL = "All Buckets",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 20001,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "BCKT",
			DIM_SID = 20,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ALL_CUST_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ALL_CUST_NM",
			ATRB_DESC = "All Customers",
			ATRB_LBL = "All Customers",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2001,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ALL_GEO_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ALL_GEO_NM",
			ATRB_DESC = "World Wide",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 4001,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "GEO",
			DIM_SID = 4,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ALL_PRD_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ALL_PRD_NM",
			ATRB_DESC = "All Products",
			ATRB_LBL = "All Products",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7001,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ALL_TIER_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ALL_TIER_NM",
			ATRB_DESC = "All Tier Nodes",
			ATRB_LBL = "All Tier Nodes",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 10001,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "TIER",
			DIM_SID = 10,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute APAC_GROSS_REV_GROUPING = new MyDealsAttribute()
		{
			ATRB_COL_NM = "APAC_GROSS_REV_GROUPING",
			ATRB_DESC = "APAC_GROSS_Rev_Grouping",
			ATRB_LBL = "APAC GROSS Rev Grouping",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7068,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute AVG_RPU = new MyDealsAttribute()
		{
			ATRB_COL_NM = "AVG_RPU",
			ATRB_DESC = "Avg RPU",
			ATRB_LBL = "Avg RPU",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3601,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute BACK_DATE_RSN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BACK_DATE_RSN",
			ATRB_DESC = "Backdate Reason",
			ATRB_LBL = "Backdate Reason",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3596,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute BACK_DATE_RSN_TXT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BACK_DATE_RSN_TXT",
			ATRB_DESC = "Backdate Reason Text",
			ATRB_LBL = "Backdate Reason Text",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3597,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute BCKT_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BCKT_NM",
			ATRB_DESC = "Bucket Name",
			ATRB_LBL = "Bucket Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 20002,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "BCKT",
			DIM_SID = 20,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute BLLG_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BLLG_DT",
			ATRB_DESC = "Last Credit/Debit payment date",
			ATRB_LBL = "Last Credit/Debit payment date",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3521,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute BNB_STATUS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BNB_STATUS",
			ATRB_DESC = "GDM BNB Status",
			ATRB_LBL = "BNB Status",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7039,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute BRAND_GROUP = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BRAND_GROUP",
			ATRB_DESC = "Brand Group",
			ATRB_LBL = "Brand Group",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7082,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute BRND_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BRND_NM",
			ATRB_DESC = "Brand Name",
			ATRB_LBL = "Brand Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7004,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute BRND_UNIQ_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "BRND_UNIQ_NM",
			ATRB_DESC = "GDM Brand Full Path",
			ATRB_LBL = "Brand Full Path",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7048,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute C2A_DATA_C2A_ID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "C2A_DATA_C2A_ID",
			ATRB_DESC = "C2A ID",
			ATRB_LBL = "C2A ID",
			ATRB_MAX_LEN = 500,
			ATRB_SID = 3576,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute C2A_STATUS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "C2A_STATUS",
			ATRB_DESC = "C2A Status",
			ATRB_LBL = "C2A Status",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 101,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "CheckBox"
		};
		public static MyDealsAttribute CAP = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CAP",
			ATRB_DESC = "CAP",
			ATRB_LBL = "CAP",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 86,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute CAP_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CAP_PRICE",
			ATRB_DESC = "Product CAP Price for Customer",
			ATRB_LBL = "Product CAP Price for Customer",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 39,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "SYS",
			DIM_SID = 999,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute COMMENTS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMMENTS",
			ATRB_DESC = "Comments",
			ATRB_LBL = "Public Comments",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3351,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COMP_BENCH = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMP_BENCH",
			ATRB_DESC = "PLI COMP Bench",
			ATRB_LBL = "COMP Bench",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3627,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COMP_SKU = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMP_SKU",
			ATRB_DESC = "Competitive SKU",
			ATRB_LBL = "Competitive SKU",
			ATRB_MAX_LEN = 255,
			ATRB_SID = 3621,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "CMNT_HIST"
		};
		public static MyDealsAttribute COMP_SKU_OTHR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMP_SKU_OTHR",
			ATRB_DESC = "Competitive SKU Other",
			ATRB_LBL = "Comp Sku Other",
			ATRB_MAX_LEN = 255,
			ATRB_SID = 3622,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COMP_TARGET_SYSTEM_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMP_TARGET_SYSTEM_PRICE",
			ATRB_DESC = "Competitive Target System Price",
			ATRB_LBL = "Competitive Target System Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3356,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COMPETITIVE_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COMPETITIVE_PRICE",
			ATRB_DESC = "Competitive Price Textbox",
			ATRB_LBL = "Competitive Price Textbox",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3354,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute CONSUMPTION_REASON = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CONSUMPTION_REASON",
			ATRB_DESC = "Consumption Reason",
			ATRB_LBL = "Consumption Reason",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3459,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute CONSUMPTION_REASON_CMNT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CONSUMPTION_REASON_CMNT",
			ATRB_DESC = "Consumption Reason Comment",
			ATRB_LBL = "Consumption Reason Comment",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3460,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute CONTRACT_STATUS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CONTRACT_STATUS",
			ATRB_DESC = "Contract Status",
			ATRB_LBL = "Contract Status",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 34,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute COST_TEST_FAIL_OVERRIDE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COST_TEST_FAIL_OVERRIDE",
			ATRB_DESC = "Deal Cost Test Fail Override",
			ATRB_LBL = "Deal Cost Test Fail Override",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3647,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COST_TEST_FAIL_OVERRIDE_REASON = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COST_TEST_FAIL_OVERRIDE_REASON",
			ATRB_DESC = "Competitive Price Textbox",
			ATRB_LBL = "Competitive Price Textbox",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3648,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COST_TEST_OVERRIDE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COST_TEST_OVERRIDE",
			ATRB_DESC = "Cost Test Override",
			ATRB_LBL = "Cost Test Override",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3449,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute COST_TEST_RESULT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COST_TEST_RESULT",
			ATRB_DESC = "Deal Cost Test Result",
			ATRB_LBL = "Deal Cost Test Result",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3652,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute COST_TYPE_USED = new MyDealsAttribute()
		{
			ATRB_COL_NM = "COST_TYPE_USED",
			ATRB_DESC = "Cost Type Used",
			ATRB_LBL = "Cost Type Used",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3556,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute CPU_CACHE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CPU_CACHE",
			ATRB_DESC = "CPU Cache",
			ATRB_LBL = "CPU Cache",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7024,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CPU_PACKAGE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CPU_PACKAGE",
			ATRB_DESC = "CPU Package",
			ATRB_LBL = "CPU Package",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7025,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CPU_PROCESSOR_NUMBER = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CPU_PROCESSOR_NUMBER",
			ATRB_DESC = "CPU Processor Number",
			ATRB_LBL = "Processor Number",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7086,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CPU_VOLTAGE_SEGMENT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CPU_VOLTAGE_SEGMENT",
			ATRB_DESC = "CPU Voltage Segment",
			ATRB_LBL = "Voltage Segment",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7043,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CPU_WATTAGE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CPU_WATTAGE",
			ATRB_DESC = "CPU Wattage",
			ATRB_LBL = "CPU Wattage",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7023,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CREDIT_VOLUME = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CREDIT_VOLUME",
			ATRB_DESC = "Credit Volume",
			ATRB_LBL = "Credit Volume",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3488,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute CS_SHIP_AHEAD_END_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CS_SHIP_AHEAD_END_DT",
			ATRB_DESC = "CS Ship Ahead End Date",
			ATRB_LBL = "CS Ship Ahead End Date",
			ATRB_MAX_LEN = 20,
			ATRB_SID = 3463,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute CS_SHIP_AHEAD_STRT_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CS_SHIP_AHEAD_STRT_DT",
			ATRB_DESC = "CS Ship Ahead Start Date",
			ATRB_LBL = "CS Ship Ahead Start Date",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3462,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute CSL_WWID_EXCEPTIONS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CSL_WWID_EXCEPTIONS",
			ATRB_DESC = "Employee safety net of users",
			ATRB_LBL = "Employee safety net of users",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5044,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CST_USE_IN_CALC = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CST_USE_IN_CALC",
			ATRB_DESC = "Cost Type to be used during calculation",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 0,
			ATRB_SID = 7055,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CTRY_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CTRY_CD",
			ATRB_DESC = "Country Code",
			ATRB_LBL = "Country Code",
			ATRB_MAX_LEN = 20,
			ATRB_SID = 2017,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CTRY_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CTRY_NM",
			ATRB_DESC = "Country Name",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 4004,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "GEO",
			DIM_SID = 4,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CUST_ACCNT_DIV = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_ACCNT_DIV",
			ATRB_DESC = "Account Divisions",
			ATRB_LBL = "Customer Account Divisions",
			ATRB_MAX_LEN = 512,
			ATRB_SID = 3591,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute CUST_ACCPT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_ACCPT",
			ATRB_DESC = "Customer Accepted",
			ATRB_LBL = "Customer Accepted",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 3660,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute CUST_CHNL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_CHNL",
			ATRB_DESC = "Customer Channel",
			ATRB_LBL = "Customer Channel",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2010,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CUST_DIV_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_DIV_NM",
			ATRB_DESC = "Rebate Customer Division Name",
			ATRB_LBL = "Rebate Customer Division Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2003,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CUST_MBR_SID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_MBR_SID",
			ATRB_DESC = "Customer Member SID",
			ATRB_LBL = "customer ID",
			ATRB_MAX_LEN = 8,
			ATRB_SID = 3011,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute CUST_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_NM",
			ATRB_DESC = "Customer Name",
			ATRB_LBL = "Customer Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2002,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute CUST_SRCH_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "CUST_SRCH_NM",
			ATRB_DESC = "Customer Search Name",
			ATRB_LBL = "Customer Search Name",
			ATRB_MAX_LEN = 20,
			ATRB_SID = 2018,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DB_LD_ATRB_SID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DB_LD_ATRB_SID",
			ATRB_DESC = "Product ATRB_SIDs to load into DB for a given PRD_CATGRY",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7030,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DEAL_COMB_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_COMB_TYPE",
			ATRB_DESC = "Deal Combination type",
			ATRB_LBL = "Additive",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 3594,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute DEAL_CUST_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_CUST_NM",
			ATRB_DESC = "Customer name",
			ATRB_LBL = "Customer Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3372,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DEAL_MSP_PRC = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_MSP_PRC",
			ATRB_DESC = "MSP Price for a product in a deal",
			ATRB_LBL = "MSP Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 97,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DEAL_PRD_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_PRD_NM",
			ATRB_DESC = "Deal Product name",
			ATRB_LBL = "Deal Product name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7007,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DEAL_PRD_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_PRD_TYPE",
			ATRB_DESC = "Deal Product Type Code",
			ATRB_LBL = "Deal Product Type Code",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7002,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DEAL_SID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_SID",
			ATRB_DESC = "DEAL Number to be saved as part of DEAL_PREP table ",
			ATRB_LBL = "DEAL ID",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3616,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DEAL_SOLD_TO_ID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_SOLD_TO_ID",
			ATRB_DESC = "Sold To Id",
			ATRB_LBL = "Sold To Id",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3540,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "SoldToPicker"
		};
		public static MyDealsAttribute DEAL_STG_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEAL_STG_CD",
			ATRB_DESC = "Current Stage",
			ATRB_LBL = "Current Stage",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3327,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DEBIT_VOLUME = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEBIT_VOLUME",
			ATRB_DESC = "Debit Volume",
			ATRB_LBL = "Debit Volume",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3489,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DEVICE_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DEVICE_TYPE",
			ATRB_DESC = "Device Type",
			ATRB_LBL = "Device Type",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7020,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DIV_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DIV_CD",
			ATRB_DESC = "DIV_CD",
			ATRB_LBL = "Div code",
			ATRB_MAX_LEN = 6,
			ATRB_SID = 7063,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DIV_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DIV_NM",
			ATRB_DESC = "Division Short Name",
			ATRB_LBL = "Div Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7036,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute DIVISION_APPROVAL_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DIVISION_APPROVAL_PRICE",
			ATRB_DESC = "Division Approval Price",
			ATRB_LBL = "Division Approval Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 4,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute DIVISION_APPROVED_LIMIT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DIVISION_APPROVED_LIMIT",
			ATRB_DESC = "Division Approved Limit",
			ATRB_LBL = "Division Approved Limit",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3471,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute DRAWING_ORD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "DRAWING_ORD",
			ATRB_DESC = "UI Drawing Order",
			ATRB_LBL = "UI Drawing Order",
			ATRB_MAX_LEN = 20,
			ATRB_SID = 3657,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute ECAP_FLR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ECAP_FLR",
			ATRB_DESC = "ECAP Floor",
			ATRB_LBL = "ECAP Floor",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3615,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ECAP_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ECAP_PRICE",
			ATRB_DESC = "ECAP Price",
			ATRB_LBL = "ECAP Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute ECAP_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ECAP_TYPE",
			ATRB_DESC = "ECAP type code",
			ATRB_LBL = "ECAP Type",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3331,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute EMP_ADM_ACCESS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EMP_ADM_ACCESS",
			ATRB_DESC = "Employee Admin Access Assignment",
			ATRB_LBL = "Employee Admin Access Assignment",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5085,
			DATA_TYPE_CD = "BIT",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Boolean",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "CheckBox"
		};
		public static MyDealsAttribute EMP_CUST_ASGN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EMP_CUST_ASGN",
			ATRB_DESC = "Customer Assignment for Employee",
			ATRB_LBL = "Customer Assignment for Employee",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5028,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute EMP_GEO_ASGN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EMP_GEO_ASGN",
			ATRB_DESC = "GEO assgiend to an employee",
			ATRB_LBL = "GEO assgiend to an employee",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5031,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute EMP_VRTCL_ASGN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EMP_VRTCL_ASGN",
			ATRB_DESC = "Vercial assigned for an employee",
			ATRB_LBL = "Vercial assigned for an employee",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5032,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute END_CUSTOMER_RETAIL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "END_CUSTOMER_RETAIL",
			ATRB_DESC = "End Customer/Retail",
			ATRB_LBL = "End Customer/Retail",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3348,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute END_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "END_DT",
			ATRB_DESC = "Deal end date",
			ATRB_LBL = "End Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3320,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "DatePicker"
		};
		public static MyDealsAttribute EPM_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EPM_NM",
			ATRB_DESC = "External Product Name",
			ATRB_LBL = "External Product Name",
			ATRB_MAX_LEN = 255,
			ATRB_SID = 7056,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute EST_DIE_SIZE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EST_DIE_SIZE",
			ATRB_DESC = "Estimated Die Size",
			ATRB_LBL = "Estimated Die Size",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 7057,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute EXPIRE_YCS2 = new MyDealsAttribute()
		{
			ATRB_COL_NM = "EXPIRE_YCS2",
			ATRB_DESC = "Expire SAP YCS2",
			ATRB_LBL = "Expire YCS2",
			ATRB_MAX_LEN = 3,
			ATRB_SID = 3562,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute FG_MTRL_STS_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FG_MTRL_STS_CD",
			ATRB_DESC = "Finished Goood Material Status Code",
			ATRB_LBL = "Finished Good Status",
			ATRB_MAX_LEN = 2,
			ATRB_SID = 7045,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FG_OLD_MTRL_NBR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FG_OLD_MTRL_NBR",
			ATRB_DESC = "FG_OLD_MTRL_NBR",
			ATRB_LBL = "DSA FG_OLD_MTRL_NBR",
			ATRB_MAX_LEN = 21,
			ATRB_SID = 7058,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FMLY_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FMLY_NM",
			ATRB_DESC = "Family name",
			ATRB_LBL = "Family name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7005,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FMLY_NM_MM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FMLY_NM_MM",
			ATRB_DESC = "Family name at MTRL level",
			ATRB_LBL = "EDW Family Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7027,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FMLY_UNIQ_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FMLY_UNIQ_NM",
			ATRB_DESC = "GDM Family Full Path",
			ATRB_LBL = "Family Full Path",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7053,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FRCST_DVC_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FRCST_DVC_NM",
			ATRB_DESC = "FRCST_DVC_NM",
			ATRB_LBL = "Forecast Device Name",
			ATRB_MAX_LEN = 30,
			ATRB_SID = 7059,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute FSE_APPROVED_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "FSE_APPROVED_PRICE",
			ATRB_DESC = "FSE Approved Price",
			ATRB_LBL = "FSE Approved Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 10,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute GDM_BRND_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_BRND_NM",
			ATRB_DESC = "GDM Brand Name",
			ATRB_LBL = "Brand ",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7084,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_CUST_DIV_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_CUST_DIV_NM",
			ATRB_DESC = "GDM Customer Divisioin Name",
			ATRB_LBL = "GDM Customer Divisioin Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2022,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_FMLY_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_FMLY_NM",
			ATRB_DESC = "GDM Family Name",
			ATRB_LBL = "Family ",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7085,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_PRC_SKU_REV_GRP = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_PRC_SKU_REV_GRP",
			ATRB_DESC = "GDM_PRC_SKU_REV_GRP",
			ATRB_LBL = "PRC Sku Rev Group",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7071,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_PRD_TYPE_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_PRD_TYPE_NM",
			ATRB_DESC = "GDM Product Type Name",
			ATRB_LBL = "Product Type",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7044,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_SLD_TO_CUST_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_SLD_TO_CUST_NM",
			ATRB_DESC = "GDM Sold To Customer Name",
			ATRB_LBL = "GDM Sold To Customer Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2021,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GDM_VRT_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GDM_VRT_NM",
			ATRB_DESC = "GDM Vertical Name",
			ATRB_LBL = "Vertical",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7038,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute GEO_APPROVED_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GEO_APPROVED_PRICE",
			ATRB_DESC = "Geo Approved Price",
			ATRB_LBL = "Geo Approved Price",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 11,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute GEO_COMBINED = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GEO_COMBINED",
			ATRB_DESC = "GEO Combined",
			ATRB_LBL = "GEO Combined",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3620,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "MultiGeoSelector"
		};
		public static MyDealsAttribute GEO_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "GEO_NM",
			ATRB_DESC = "GEO Name",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 4002,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "GEO",
			DIM_SID = 4,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute HIER_NM_HASH = new MyDealsAttribute()
		{
			ATRB_COL_NM = "HIER_NM_HASH",
			ATRB_DESC = "Product Hierarchy Hash Names",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 1000,
			ATRB_SID = 7091,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute HIER_VAL_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "HIER_VAL_NM",
			ATRB_DESC = "Product Hierarchy Names",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7090,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute HOST_GEO = new MyDealsAttribute()
		{
			ATRB_COL_NM = "HOST_GEO",
			ATRB_DESC = "Hosted Geo",
			ATRB_LBL = "Hosted Geo",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2012,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute INDUS_KEY_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "INDUS_KEY_CD",
			ATRB_DESC = "Industry Key Code",
			ATRB_LBL = "Industry Key Code",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2013,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute IS_CHKOUT_USER = new MyDealsAttribute()
		{
			ATRB_COL_NM = "IS_CHKOUT_USER",
			ATRB_DESC = "employee is a chkout user",
			ATRB_LBL = "Checkout User",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5042,
			DATA_TYPE_CD = "BIT",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Boolean",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "CheckBox"
		};
		public static MyDealsAttribute IS_DEV_USR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "IS_DEV_USR",
			ATRB_DESC = "employee is a dev user",
			ATRB_LBL = "Developer",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5041,
			DATA_TYPE_CD = "BIT",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Boolean",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "CheckBox"
		};
		public static MyDealsAttribute IS_SUPER_USER = new MyDealsAttribute()
		{
			ATRB_COL_NM = "IS_SUPER_USER",
			ATRB_DESC = "employee is a super user",
			ATRB_LBL = "Super User",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5043,
			DATA_TYPE_CD = "BIT",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.Boolean",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "CheckBox"
		};
		public static MyDealsAttribute KIT_IND = new MyDealsAttribute()
		{
			ATRB_COL_NM = "KIT_IND",
			ATRB_DESC = "KIT_IND",
			ATRB_LBL = "KIT_IND",
			ATRB_MAX_LEN = 1,
			ATRB_SID = 7065,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MAX_RPU = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MAX_RPU",
			ATRB_DESC = "Max RPU",
			ATRB_LBL = "Max RPU",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3600,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute MEET_COMP_PRICE_QSTN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MEET_COMP_PRICE_QSTN",
			ATRB_DESC = "Meet-Comp Analysis Price question",
			ATRB_LBL = "Price Only",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3625,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute MEETCOMP_TEST_FAIL_OVERRIDE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MEETCOMP_TEST_FAIL_OVERRIDE",
			ATRB_DESC = "Deal Meet Comp Test Fail Override",
			ATRB_LBL = "Deal Meet Comp Test Fail Override",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3649,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute MEETCOMP_TEST_FAIL_OVERRIDE_REASON = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MEETCOMP_TEST_FAIL_OVERRIDE_REASON",
			ATRB_DESC = "Deal Meet Comp Test Fail Override Reason",
			ATRB_LBL = "Deal Meet Comp Test Fail Override Reason",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3650,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute MEETCOMP_TEST_RESULT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MEETCOMP_TEST_RESULT",
			ATRB_DESC = "Deal Meet Comp Test Result",
			ATRB_LBL = "Deal Meet Comp Test Result",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3651,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute MKTING_CD_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MKTING_CD_NM",
			ATRB_DESC = "Marketing Code Name",
			ATRB_LBL = "Mkting CD Nm",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7074,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MM_BNB_TRANSFER_DATE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MM_BNB_TRANSFER_DATE",
			ATRB_DESC = "Material BNB transfer date",
			ATRB_LBL = "BNB Transfer Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 7040,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MM_MEDIA_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MM_MEDIA_CD",
			ATRB_DESC = "CPU MM Media",
			ATRB_LBL = "Media",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7029,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MRKT_SEG_COMBINED = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MRKT_SEG_COMBINED",
			ATRB_DESC = "Concatenated Market Segment",
			ATRB_LBL = "Market Segment",
			ATRB_MAX_LEN = 500,
			ATRB_SID = 3474,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "MultiMSSelector"
		};
		public static MyDealsAttribute MRKT_SEG_NON_CORP = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MRKT_SEG_NON_CORP",
			ATRB_DESC = "market sub segment for Non-Corp",
			ATRB_LBL = "Non-Corp Sub-Segment",
			ATRB_MAX_LEN = 500,
			ATRB_SID = 3654,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MRKT_SUB_SEGMENT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MRKT_SUB_SEGMENT",
			ATRB_DESC = "market sub segment for embedded",
			ATRB_LBL = "Market Sub-Segment",
			ATRB_MAX_LEN = 500,
			ATRB_SID = 3653,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MSP_PRICE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MSP_PRICE",
			ATRB_DESC = "Product MSP Price for Customer",
			ATRB_LBL = "Product MSP Price for Customer",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 96,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "SYS",
			DIM_SID = 999,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MTRL_ID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MTRL_ID",
			ATRB_DESC = "Material ID",
			ATRB_LBL = "Material ID",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7008,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute MTRL_TYPE_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "MTRL_TYPE_CD",
			ATRB_DESC = "Material Type Code",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 4,
			ATRB_SID = 7070,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute NA = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NA",
			ATRB_DESC = "system default for security engine to imply rule is not tied to an attribute",
			ATRB_LBL = "Not Applicable",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 90001,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "SYS",
			DIM_SID = 999,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute NAND_DENSITY = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NAND_DENSITY",
			ATRB_DESC = "Nand Density",
			ATRB_LBL = "NAND Density",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7077,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute NAND_FAMILY = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NAND_FAMILY",
			ATRB_DESC = "Nand Family",
			ATRB_LBL = "NAND Family",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7076,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute NAND_INTERFACE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NAND_INTERFACE",
			ATRB_DESC = "Nand Interface",
			ATRB_LBL = "NAND Interface",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7078,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute NOTES = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NOTES",
			ATRB_DESC = "Notes",
			ATRB_LBL = "Notes",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3661,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute NUM_OF_TIERS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "NUM_OF_TIERS",
			ATRB_DESC = "NUM OF TIERS",
			ATRB_LBL = "Select no of Bands",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3490,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute OBJ_SET_TYPE_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "OBJ_SET_TYPE_CD",
			ATRB_DESC = "Deal Type Name",
			ATRB_LBL = "Deal Type",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3002,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute OBJ_SET_TYPE_SID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "OBJ_SET_TYPE_SID",
			ATRB_DESC = "Deal Type Code ID",
			ATRB_LBL = "Deal Type Code ID",
			ATRB_MAX_LEN = 10,
			ATRB_SID = 3004,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute OFF_ROADMAP_FLG = new MyDealsAttribute()
		{
			ATRB_COL_NM = "OFF_ROADMAP_FLG",
			ATRB_DESC = "Off roadmap flag for COGNOS",
			ATRB_LBL = "DSA OFF ROADMAP FLG",
			ATRB_MAX_LEN = 1,
			ATRB_SID = 7041,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute ON_ADD_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "ON_ADD_DT",
			ATRB_DESC = "On Ad Date",
			ATRB_LBL = "On Ad Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3435,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "DatePicker"
		};
		public static MyDealsAttribute OP_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "OP_CD",
			ATRB_DESC = "Operation Code",
			ATRB_LBL = "Op code",
			ATRB_MAX_LEN = 15,
			ATRB_SID = 7037,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PAYOUT_BASED_ON = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PAYOUT_BASED_ON",
			ATRB_DESC = "Payout based on",
			ATRB_LBL = "Payout Based On",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 35,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute PCSR_NBR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PCSR_NBR",
			ATRB_DESC = "Processor number",
			ATRB_LBL = "Processor number",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7006,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRC_GRP_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRC_GRP_CD",
			ATRB_DESC = "Price Customer Group Code",
			ATRB_LBL = "Price Customer Group Code",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2014,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_ATRB = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_ATRB",
			ATRB_DESC = "Product Attribute for all dimension level",
			ATRB_LBL = "DSA PRD Atrb",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 7035,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_CAT_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_CAT_NM",
			ATRB_DESC = "Product Category name",
			ATRB_LBL = "Product Category name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7003,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_CATGRY_NM_DESC = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_CATGRY_NM_DESC",
			ATRB_DESC = "Product Category Name Full Description",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7033,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_COST = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_COST",
			ATRB_DESC = "Product Cost",
			ATRB_LBL = "Cost",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 140,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_END_DTM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_END_DTM",
			ATRB_DESC = "Product End Date",
			ATRB_LBL = "Product End date",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7089,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_FMLY_TXT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_FMLY_TXT",
			ATRB_DESC = "PRD_FMLY_TXT",
			ATRB_LBL = "EDW Product family",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7083,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_LEVEL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_LEVEL",
			ATRB_DESC = "Product Level",
			ATRB_LBL = "Product Level",
			ATRB_MAX_LEN = 10,
			ATRB_SID = 80,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_STRT_DTM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_STRT_DTM",
			ATRB_DESC = "Product Start Date",
			ATRB_LBL = "Product Start date",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7088,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRD_VERTICAL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRD_VERTICAL",
			ATRB_DESC = "Vertical",
			ATRB_LBL = "Vertical",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 75,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRICE_SEGMENT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRICE_SEGMENT",
			ATRB_DESC = "Price Segment",
			ATRB_LBL = "Price segment",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7073,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PRODUCT_FILTER = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PRODUCT_FILTER",
			ATRB_DESC = "Product name",
			ATRB_LBL = "Products",
			ATRB_MAX_LEN = 10,
			ATRB_SID = 15,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "LINK_LABEL"
		};
		public static MyDealsAttribute PROGRAM_ECAP_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PROGRAM_ECAP_TYPE",
			ATRB_DESC = "Object set types",
			ATRB_LBL = "Deal Types",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 18,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute PROGRAM_PAYMENT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PROGRAM_PAYMENT",
			ATRB_DESC = "Program Payment",
			ATRB_LBL = "Program Payment",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3495,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute PTR_SYS_PRD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PTR_SYS_PRD",
			ATRB_DESC = "Processed Product List",
			ATRB_LBL = "Processed Product List",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3659,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute PTR_USER_PRD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "PTR_USER_PRD",
			ATRB_DESC = "PTR User Product List",
			ATRB_LBL = "Include Product(s)",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3658,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute REBATE_BILLING_END = new MyDealsAttribute()
		{
			ATRB_COL_NM = "REBATE_BILLING_END",
			ATRB_DESC = "Billing END Date (for Consumption)",
			ATRB_LBL = "Billing END Date (for Consumption)",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3571,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "DatePicker"
		};
		public static MyDealsAttribute REBATE_BILLING_START = new MyDealsAttribute()
		{
			ATRB_COL_NM = "REBATE_BILLING_START",
			ATRB_DESC = "Billing START Date (for Consumption)",
			ATRB_LBL = "Billing START Date (for Consumption)",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3570,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "DatePicker"
		};
		public static MyDealsAttribute REBATE_PROD_FLAG = new MyDealsAttribute()
		{
			ATRB_COL_NM = "REBATE_PROD_FLAG",
			ATRB_DESC = "Rebate Product Flag",
			ATRB_LBL = "DSA Rebate Flag",
			ATRB_MAX_LEN = 1,
			ATRB_SID = 7081,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute RETAIL_CYCLE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RETAIL_CYCLE",
			ATRB_DESC = "Retail Cycle",
			ATRB_LBL = "Retail Cycle",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3466,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute RETAIL_PULL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RETAIL_PULL",
			ATRB_DESC = "Retail Pull $",
			ATRB_LBL = "Retail Pull $",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3612,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute RETAIL_PULL_USR_DEF = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RETAIL_PULL_USR_DEF",
			ATRB_DESC = "Retail Pull$ User Defined",
			ATRB_LBL = "Retail Pull$ User Defined",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3618,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute RETAIL_PULL_USR_DEF_CMNT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RETAIL_PULL_USR_DEF_CMNT",
			ATRB_DESC = "Retail Pull Dollar User Defined Comments",
			ATRB_LBL = "Retail Pull Dollar User Defined Comments",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3619,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute RETAIL_SHP_AHEAD_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RETAIL_SHP_AHEAD_DT",
			ATRB_DESC = "Retail Ship Ahead Date",
			ATRB_LBL = "Retail Ship Ahead",
			ATRB_MAX_LEN = 20,
			ATRB_SID = 3436,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Label"
		};
		public static MyDealsAttribute RGN_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "RGN_NM",
			ATRB_DESC = "Regioin Name",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 4003,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "GEO",
			DIM_SID = 4,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SBS_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SBS_NM",
			ATRB_DESC = "SBS Nm",
			ATRB_LBL = "SBS Name ",
			ATRB_MAX_LEN = 40,
			ATRB_SID = 7079,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SECURITY_ACCOUNT_ROLE_ASGN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SECURITY_ACCOUNT_ROLE_ASGN",
			ATRB_DESC = "SECURITY_ACCOUNT_ROLE_ASGN",
			ATRB_LBL = "User Account Security",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 5040,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "SECUR",
			DIM_SID = 50,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SERVER_DEAL_TYPE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SERVER_DEAL_TYPE",
			ATRB_DESC = "Server Deal Type",
			ATRB_LBL = "Server Deal Type",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 3347,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute SKU_MARKET_SEGMENT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SKU_MARKET_SEGMENT",
			ATRB_DESC = "CPU Mkt Segment",
			ATRB_LBL = "Product Market Segment",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7042,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SKU_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SKU_NM",
			ATRB_DESC = "Sku name",
			ATRB_LBL = "Sku Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7021,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SLS_ORG_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SLS_ORG_CD",
			ATRB_DESC = "Sales Org Code",
			ATRB_LBL = "Sales Org Code",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2019,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SOLD_TO_ID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SOLD_TO_ID",
			ATRB_DESC = "Sold To ID",
			ATRB_LBL = "Sold To ID",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 2004,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "CUST",
			DIM_SID = 2,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SPEC_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SPEC_CD",
			ATRB_DESC = "Material Spec Code",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 1,
			ATRB_SID = 7054,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute START_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "START_DT",
			ATRB_DESC = "Deal start date",
			ATRB_LBL = "Start Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3319,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "DatePicker"
		};
		public static MyDealsAttribute SUB_VERTICAL = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SUB_VERTICAL",
			ATRB_DESC = "Sub Vertical Deal Prd Name level",
			ATRB_LBL = "Sub Vertical",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7028,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute SUPER_GRP_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "SUPER_GRP_NM",
			ATRB_DESC = "Super Group Name",
			ATRB_LBL = "Super Group",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7072,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute TERMS = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TERMS",
			ATRB_DESC = "Additional Terms and Conditions",
			ATRB_LBL = "Additional Terms and Conditions",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3569,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute TIER_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TIER_NM",
			ATRB_DESC = "Tier Node Name",
			ATRB_LBL = "Tier Node Name",
			ATRB_MAX_LEN = 100,
			ATRB_SID = 10002,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "TIER",
			DIM_SID = 10,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute TITLE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TITLE",
			ATRB_DESC = "Object Title",
			ATRB_LBL = "Title",
			ATRB_MAX_LEN = 500,
			ATRB_SID = 33,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute TRDMRK_NM = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TRDMRK_NM",
			ATRB_DESC = "Trade Mark",
			ATRB_LBL = "EPM Trademark",
			ATRB_MAX_LEN = 40,
			ATRB_SID = 7080,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute TRGT_RGN = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TRGT_RGN",
			ATRB_DESC = "Target Region",
			ATRB_LBL = "Target Region",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 23,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "TargetRegionPicker"
		};
		public static MyDealsAttribute TRKR_NBR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TRKR_NBR",
			ATRB_DESC = "Tracker number",
			ATRB_LBL = "Tracker Number",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 24,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "Tracker"
		};
		public static MyDealsAttribute TRKR_NBR_GEO_LTR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TRKR_NBR_GEO_LTR",
			ATRB_DESC = "Tracker number generation-GEO letter",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 10,
			ATRB_SID = 4005,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "GEO",
			DIM_SID = 4,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute TRKR_NBR_VRT_LTR = new MyDealsAttribute()
		{
			ATRB_COL_NM = "TRKR_NBR_VRT_LTR",
			ATRB_DESC = "Tracker number generation-Vertical letter",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 10,
			ATRB_SID = 7032,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute UI_DSPLY_ATRB_SID = new MyDealsAttribute()
		{
			ATRB_COL_NM = "UI_DSPLY_ATRB_SID",
			ATRB_DESC = "Product ATRB_SIDs to display in UI for a given PRD_CATGRY",
			ATRB_LBL = default(System.String),
			ATRB_MAX_LEN = 100,
			ATRB_SID = 7031,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute VOLUME = new MyDealsAttribute()
		{
			ATRB_COL_NM = "VOLUME",
			ATRB_DESC = "Ceiling Volume",
			ATRB_LBL = "Ceiling Volume",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 3321,
			DATA_TYPE_CD = "INT",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Int32",
			FRMT_MSK = "{0:d}",
			TGT_COL_TYPE = "INT",
			UI_TYPE_CD = "TextBox"
		};
		public static MyDealsAttribute VRTCL_SEG_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "VRTCL_SEG_CD",
			ATRB_DESC = "VRTCL_SEG_CD",
			ATRB_LBL = "EDW Vertical Seg Code",
			ATRB_MAX_LEN = 12,
			ATRB_SID = 7064,
			DATA_TYPE_CD = "CUSTOM",
			DIM_CD = "PRD",
			DIM_SID = 7,
			DOT_NET_DATA_TYPE = "System.Object",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute WF_STG_CD = new MyDealsAttribute()
		{
			ATRB_COL_NM = "WF_STG_CD",
			ATRB_DESC = "Workflow stage code",
			ATRB_LBL = "Stage",
			ATRB_MAX_LEN = 50,
			ATRB_SID = 26,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "WorkFlow"
		};
		public static MyDealsAttribute YCS2_END_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "YCS2_END_DT",
			ATRB_DESC = "YCS2 End Date",
			ATRB_LBL = "YCS2 End Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 139,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "LINK_LABEL"
		};
		public static MyDealsAttribute YCS2_OVERLAP_OVERRIDE = new MyDealsAttribute()
		{
			ATRB_COL_NM = "YCS2_OVERLAP_OVERRIDE",
			ATRB_DESC = "YCS2 Overlp Override flag",
			ATRB_LBL = "YCS2 Overlp Override",
			ATRB_MAX_LEN = 3,
			ATRB_SID = 3542,
			DATA_TYPE_CD = "VARCHAR",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.String",
			FRMT_MSK = "{0}",
			TGT_COL_TYPE = "VARCHAR",
			UI_TYPE_CD = "ComboBox"
		};
		public static MyDealsAttribute YCS2_PRC_IRBT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "YCS2_PRC_IRBT",
			ATRB_DESC = "YCS2 Price/Instant Rebate",
			ATRB_LBL = "YCS2 Price/Instant Rebate",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 137,
			DATA_TYPE_CD = "MONEY",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.Double",
			FRMT_MSK = "{0:c}",
			TGT_COL_TYPE = "MONEY",
			UI_TYPE_CD = default(System.String)
		};
		public static MyDealsAttribute YCS2_START_DT = new MyDealsAttribute()
		{
			ATRB_COL_NM = "YCS2_START_DT",
			ATRB_DESC = "YCS2 Start Date",
			ATRB_LBL = "YCS2 Start Date",
			ATRB_MAX_LEN = 0,
			ATRB_SID = 138,
			DATA_TYPE_CD = "DATETIME",
			DIM_CD = "DEAL",
			DIM_SID = 3,
			DOT_NET_DATA_TYPE = "System.DateTime",
			FRMT_MSK = "{0:MM/dd/yyyy HH:mm:ss.fff}",
			TGT_COL_TYPE = "DATETIME",
			UI_TYPE_CD = "LINK_LABEL"
		};

	}

}
