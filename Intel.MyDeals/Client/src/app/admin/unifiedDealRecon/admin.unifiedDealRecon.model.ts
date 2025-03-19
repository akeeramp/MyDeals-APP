﻿export class Unified_Deal_Recon {
    public CNTRCT_OBJ_SID: number;
    public TITLE: string;
    public OBJ_SID: number;
    public END_CUSTOMER_RETAIL: string;
    public END_CUSTOMER_COUNTRY: string;
    public EMP_WWID: string;
    public UNIFIED_STATUS: string;
    public UNIFIED_REASON: string;
}

export interface DealRecon {
    Deal_ID: number;
    Unified_Customer_ID: number;
    Unified_Customer_Name: string;
    Country_Region_Customer_ID: number;
    Unified_Country_Region: string;
    To_be_Unified_Customer_ID: number;
    To_be_Unified_Customer_Name: string;
    To_be_Country_Region_Customer_ID: number;
    To_be_Unified_Country_Region: string;
    Rpl_Status_Code: string;
    ERR_MSG?: string;
}

export interface DealReconInvalidRecords {
    DEAL_ID: number;
    ERR_MSG: string;
    EXISTING_UCD_COUNTRY: string;
    EXISTING_UCD_COUNTRY_CUST_ID: number;
    EXISTING_UCD_GLOBAL_ID: number;
    EXISTING_UCD_GLOBAL_NAME: string;
    NEW_UCD_COUNTRY: string;
    NEW_UCD_COUNTRY_CUST_ID: number;
    NEW_UCD_GLOBAL_ID: number;
    NEW_UCD_GLOBAL_NAME: string;
    RPL_STS_CD: string;
}

export interface DealReconConfigCols {
    data?: string;
    type: string;
    readOnly: boolean;
    width: number;
}

export interface END_CUST_OBJ {
    END_CUSTOMER: string;
    END_CUSTOMER_COUNTRY: string;
}

export interface ReprocessUCD_OBJ {
    DEAL_ID: string;
    END_CUSTOMER: string;
    END_CUSTOMER_COUNTRY: string;
}