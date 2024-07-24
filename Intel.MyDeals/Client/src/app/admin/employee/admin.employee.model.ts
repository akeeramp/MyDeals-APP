export interface OpUserTokenParameters {
	roleTypeId: number;
	isDeveloper: number;
	isTester: number;
	isSuper: number;
}

export interface ManageUsersInfo {
	ACTV_IND: boolean;
	EMP_WWID: number;
	FRST_NM: string;
	IS_DEVELOPER: boolean;
	IS_SUPER: boolean;
	IS_TESTER: boolean;
	LST_MOD_BY: string;
	LST_MOD_DT: string;
	LST_NM: string;
	MI: string;
	USR_CUST: string;
	USR_GEOS: string;
	USR_ROLE: string;
	USR_VERTS: string;
	[key: string]: unknown;
}

export interface Product {
	ACTV_IND: boolean;
	ALL_PRD_NM: string;
	ALL_PRD_NM_SID: number;
	BRND_NM: string;
	BRND_NM_SID: number;
	CPU_CACHE: string;
	CPU_PACKAGE: string;
	CPU_PROCESSOR_NUMBER: string;
	CPU_VOLTAGE_SEGMENT: string;
	CPU_WATTAGE: string;
	DEAL_PRD_NM: string;
	DEAL_PRD_NM_SID: number;
	DEAL_PRD_TYPE: string;
	DEAL_PRD_TYPE_SID: number;
	EPM_NM: string;
	FMLY_NM: string;
	FMLY_NM_MM: string;
	FMLY_NM_SID: number;
	GDM_BRND_NM: string;
	GDM_FMLY_NM: string;
	HAS_L1: number;
	HAS_L2: number;
	HIER_NM_HASH: string;
	HIER_VAL_NM: string;
	MM_CUST_CUSTOMER: string;
	MM_MEDIA_CD: string;
	MTRL_ID: string;
	MTRL_ID_SID: number;
	MTRL_TYPE_CD: string;
	NAND_Density: string;
	NAND_FAMILY: string;
	PCSR_NBR: string;
	PCSR_NBR_SID: number;
	PRD_ATRB_SID: number;
	PRD_CAT_NM: string;
	PRD_CAT_NM_SID: number;
	PRD_END_DTM: string;
	PRD_Fmly_Txt: string;
	PRD_MBR_SID: number;
	PRD_STRT_DTM: string;
	PRICE_SEGMENT: string;
	SBS_NM: string;
	SKU_MARKET_SEGMENT: string;
	SKU_NM: string;
	SUB_VERTICAL: string;
	USR_INPUT: string;
}

export interface EmployeeCustomers {
	empWWID: number;
	custIds: number[];
	vertIds: number[];
}

export interface DynamicObj {
	[key: string]: any
}