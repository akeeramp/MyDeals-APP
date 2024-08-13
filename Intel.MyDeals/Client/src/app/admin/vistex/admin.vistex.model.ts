export interface VistexLogsInfo {
	BTCH_ID: string;
	CRE_DTM: Date;
	DEAL_ID: number;
	ERR_MSG: string;
	INTRFC_RQST_DTM: Date;
	INTRFC_RSPN_DTM: Date;
	RQST_JSON_DATA: string;
	RQST_SID: number;
	RQST_STS: string;
	RQST_TYPE: string;
	VISTEX_HYBRID_TYPE: string;
}

export interface VistexLogFilters {
	Dealmode: string;
	StartDate: any;
	EndDate: any;
}

export interface VistexResponseUpdData {
	strTransantionId: string;
	strVistexStage: string;
	dealId?: number;
	rqstSid: number;
	strErrorMessage: string;
}

export interface RequestDetails {
	RQST_NAME: string
	RQST_TYPE: string
}