export class PrimeCust_Map {
    public IS_ACTV: boolean;
    public PRIM_CUST_ID: any;
    public PRIM_SID: any;
    public PRIM_CUST_NM: string;
    public PRIM_LVL_ID: any;
    public PRIM_LVL_NM: string;
    public PRIM_CUST_CTRY: string;
    public RPL_STS_CD: any;
}

export interface RplStatusCode {
    RPL_STS: boolean;
    RPL_STS_CD: string;
    RPL_STS_SID: number;
}

export interface Countires {
    CTRY_CD: string;
    CTRY_NM: string;
    CTRY_XPORT_CTRL_CD: string;
}

export interface UnPrimeDeals {
    CHG_DTM: Date;
    CNTRCT_OBJ_SID: number;
    EMP_WWID: number;
    END_CUST_OBJ: string;
    END_CUSTOMER_COUNTRY: string;
    END_CUSTOMER_RETAIL: string;
    OBJ_SID: number;
    TITLE: string;
    UNIFIED_STATUS: string;
    UNIFIED_REASON: string;
}

export interface PrimeCustomerDetails {
    IS_PRIME: number;
    IS_RPL: number;
    PRIM_CUST_ID: number;
    PRIM_CUST_NM: string;
    PRIM_LVL_ID: number;
    RPL_STS_CD: string;
}

export interface UnPrimeAtrbs {
    IS_PRIMED_CUST: string;
    IS_RPL: string;
    PRIMED_CUST_NM: string;
    PRIMED_CUST_ID: string;
    PRIMED_CUST_CNTRY: string;
    END_CUST_OBJ: string;
    END_CUSTOMER_RETAIL: string;
    IS_PRIME?: any;
}

export interface EndCustomer {
    END_CUSTOMER_RETAIL: string;
    IS_EXCLUDE: string;
    IS_PRIMED_CUST: string;
    IS_RPL: string;
    PRIMED_CUST_CNTRY: string;
    PRIMED_CUST_ID: string;
    PRIMED_CUST_NM: string;
    RPL_STS_CD: string;
}

export interface UnifyDeal {
    DEAL_ID: number;
    UCD_GLOBAL_ID: number;
    UCD_GLOBAL_NAME: string;
    UCD_COUNTRY_CUST_ID: number;
    UCD_COUNTRY: string;
    DEAL_END_CUSTOMER_RETAIL: string;
    DEAL_END_CUSTOMER_COUNTRY: string;
    RPL_STS_CODE: string;
}

export interface UnifiedDealsSummary {
    COMMENTS: string;
    Deal_No: string;
    No_Of_Deals: number;
}