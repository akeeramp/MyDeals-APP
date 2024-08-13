export interface AdminQuoteLetter {
    BODY_INFO: string;
    HDR_INFO: string;
    OBJ_SET_TYPE_CD: string;
    PROGRAM_PAYMENT: string;
    TMPLT_SID: number;
    MenuText?: string
}

export interface DownloadQuoteLetterData {
    ObjectTypeId: string;
    ObjectSid: string;
    RebateType: string;
    Status: string;
    CustomerSid: string;
    DealStage: string;
}