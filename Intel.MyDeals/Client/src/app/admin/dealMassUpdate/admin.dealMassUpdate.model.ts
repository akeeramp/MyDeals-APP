export interface AttributeFeildvalues {
    ATRB_SID: number;
    ATRB_LBL: string;
    ATRB_VAL_TXT: string;
}

export interface DealMassUpdateData {
    DEAL_IDS: string;
    ATRB_SID: number;
    UPD_VAL: string;
    SEND_VSTX_FLG: boolean;
}

export interface DealMassUpdateResults {
    DEAL_ID: number;
    ATRB_DESC: string;
    UPD_MSG: string;
    ERR_FLAG: number;
}