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

export class generateFilter {
    public static generateFilter(model:any) {
       return {
            "filters": [
                {
                    "filters": [
                        {
                            "field": "lkup.OBJ_SET_TYPE_CD",
                            "operator": "eq",
                            "value": model.OBJ_SET_TYPE_CD.toString().toUpperCase().trim()
                        }
                    ],
                    "logic": "or"
                },
                {
                    "filters": [
                        {
                            "field": "lkup.ATRB_CD",
                            "operator": "eq",
                            "value": model.ATRB_CD.toString().toUpperCase().trim()
                        }
                    ],
                    "logic": "or"
                },
                {
                    "filters": [
                        {
                            "field": "lkup.CUST_NM",
                            "operator": "eq",
                            "value": model.CUST_NM.toString().toUpperCase().trim()
                        }
                    ],
                    "logic": "or"
                },
                {
                    "filters": [
                        {
                            "field": "lkup.DROP_DOWN",
                            "operator": "eq",
                            "value": model.DROP_DOWN.toString().toUpperCase().trim()
                        }
                    ],
                    "logic": "or"
                }
            ],
                "logic": "and"
        }
    }
}