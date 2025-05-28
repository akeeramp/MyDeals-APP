export class UiDropdownItem {
    public ACTV_IND: boolean;
    public ATRB_CD: string;
    public ATRB_SID: number;
    public CUST_NM: string;
    public CUST_MBR_SID: number;
    public DROP_DOWN: string;
    public OBJ_SET_TYPE_SID: number;
    public OBJ_SET_TYPE_CD: string;
    public ATRB_LKUP_TTIP: string;
    public ATRB_LKUP_DESC: string;
    public ATRB_LKUP_SID?: string | number;
    public ORD: string;
    public LK_UP_SID?: number;
}

export class UiDropdownResponseItem {
    public ACTV_IND: boolean;
    public ATRB_CD: string;
    public ATRB_LKUP_DESC: string;
    public ATRB_LKUP_SID: number;
    public ATRB_LKUP_TTIP: string;
    public ATRB_SID: number;
    public CUST_MAP_ID: string;
    public CUST_NM: string;
    public CUST_MBR_SID: number;
    public DFLT_FLG: number;
    public DROP_DOWN: string;
    public OBJ_SET_TYPE_SID: number;
    public OBJ_SET_TYPE_CD: string;
    public ORD: string;
}

export type BulkDeleteResponse = {
    ATRB_LKUP_SID: number,
    ACTV_IND: boolean
}