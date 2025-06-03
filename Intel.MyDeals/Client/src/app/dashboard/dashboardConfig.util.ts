export class DashboardConfig {
    public static readonly exceptionFields: Array<string> = [
        "CNTRCT_OBJ_SID",
        "CUST_OBJ_SID",
        "CRE_EMP_OBJ_SID",
        "UPD_EMP_OBJ_SID",
        "IS_TENDER",
        "HAS_ALERT",
        "CUST_NM"
    ];

    public static readonly parseFilter: object = {
        "eq": "=",
        "neq": "!=",
        "gt": ">",
        "gte": ">=",
        "lt": "<",
        "lte": "<=",
        "contains": "LIKE",
        "startswith": "LIKE",
        "endswith": "LIKE",
        "in": "IN"
    };

    public static readonly activeTabs: object = {
        "fltr_All": "all",
        "fltr_Favorites": "fav",
        "fltr_HasAlert": "alert",
        "fltr_All_Contract": "allC",
        "fltr_Completed_Contract": "CC",
        "fltr_InCompleted_Contract": "ICC",
        "fltr_All_Tender": "allT",
        "fltr_Complete_Tender": "CT",
        "fltr_InComplete_Tender": "ICT",
        "fltr_Cancelled_Tender": "CA"
    };

    public static readonly activeTabFilterComp: object = {
        "all": [],
        "fav": [],
        "alert": [],
        "allC": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 0
                    }
                ],
        "CC": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 0
                    },
                    {
                        field: "WF_STG_CD",
                        operator: "=",
                        value: 'Complete'
                    }
                ],
        "ICC": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 0
                    },
                    {
                        field: "WF_STG_CD",
                        operator: "=",
                        value: 'InComplete'
                    }
                ],
        "allT": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 1
                    }
                ],
        "CT": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 1
                    },
                    {
                        field: "WF_STG_CD",
                        operator: "=",
                        value: 'Complete'
                    }
                ],
        "ICT": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 1
                    },
                    {
                        field: "WF_STG_CD",
                        operator: "=",
                        value: 'InComplete'
                    }
                ],
        "CA": [
                    {
                        field: "IS_TENDER",
                        operator: "=",
                        value: 1
                    },
                    {
                        field: "WF_STG_CD",
                        operator: "=",
                        value: 'Cancelled'
                    }
                ]
    };
}