export class Cust_Map {
	public ACTV_IND: boolean;
	public ATRB_LKUP_DESC: string;
	public ATRB_LKUP_SID: any;
	public ATRB_SID: number;
	public BUSNS_ORG_NM: string;
	public CTRY_CD: string;
	public CTRY_NM: string;
	public CUST_MBR_SID: any;
	public CUST_NM: string;
	public DROP_DOWN: any;
	public OBJ_SET_TYPE_SID: number;
	public VNDR_ID: any;
}

export interface Cust_Dropdown_Map {
	ACCESS_TYPE: boolean;
	ACTV_IND: boolean;
	CUST_CHNL: string;
	CUST_DIV_NM: string;
	CUST_DIV_SID: number;
	CUST_LVL_SID: number;
	CUST_NM: string;
	CUST_SID: number;
	DEAL_FLG: number;
	DFLT_AR_SETL_LVL: string;
	DFLT_CUST_RPT_GEO: string;
	DFLT_DOUBLE_CONSUMPTION: boolean;
	DFLT_ENFORCE_PAYABLE_QUANTITY: boolean;
	DFLT_LOOKBACK_PERD: number;
	DFLT_PERD_PRFL: string;
	DFLT_SETTLEMENT_PARTNER: string;
	DFLT_TNDR_AR_SETL_LVL: string;
	DISP_NM: string;
	HOST_GEO: string;
	PRC_GRP_CD: string;
	VISTEX_CUST_FLAG: string;
}

export interface Vendor_Map {
	BUSNS_ORG_NM: string;
	CTRY_CD: string;
	CTRY_NM: string;
	VNDR_ID: number;
}