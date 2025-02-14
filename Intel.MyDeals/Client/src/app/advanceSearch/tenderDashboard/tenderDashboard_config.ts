export class TenderDashboardConfig {
    public static operatorSettings = {
        "operators": [
            {
                "operator": "LIKE",
                "operCode": "contains",
                "label": "contains"
            },
            {
                "operator": "=",
                "operCode": "eq",
                "label": "equal to"
            },
            {
                "operator": "IN",
                "operCode": "in",
                "label": "in"
            },
            {
                "operator": "!=",
                "operCode": "neq",
                "label": "not equal to"
            },
            {
                "operator": "<",
                "operCode": "lt",
                "label": "less than"
            },
            {
                "operator": "<=",
                "operCode": "lte",
                "label": "less than or equal to"
            },
            {
                "operator": ">",
                "operCode": "gt",
                "label": "greater than"
            },
            {
                "operator": ">=",
                "operCode": "gte",
                "label": "greater than or equal to"
            }
        ],
        "types": [
            {
                "type": "string",
                "uiType": "textbox"
            }, {
                "type": "string_with_in",
                "uiType": "textbox"
            }, {
                "type": "string_limited",
                "uiType": "textbox"
            },
            {
                "type": "autocomplete",
                "uiType": "textbox"
            },
            {
                "type": "number",
                "uiType": "numeric"
            },
            {
                "type": "numericOrPercentage",
                "uiType": "numeric"
            },
            {
                "type": "money",
                "uiType": "numeric"
            },
            {
                "type": "date",
                "uiType": "datepicker"
            },
            {
                "type": "list",
                "uiType": "combobox"
            },
            {
                "type": "bool",
                "uiType": "checkbox"
            },
            {
                "type": "singleselect",
                "uiType": "combobox"
            },
            {
                "type": "singleselect_ext",
                "uiType": "combobox"
            },
            {
                "type": "singleselect_read_only",
                "uiType": "combobox"
            }
        ],
        "types2operator": [
            {
                "type": "number",
                "operator": ["=", "IN", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "numericOrPercentage",
                "operator": ["=", "IN", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "money",
                "operator": ["=", "IN", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "date",
                "operator": ["=", "!=", "<", "<=", ">", ">="]
            },
            {
                "type": "string",
                "operator": ["=", "LIKE", "!="]
            },
            {
                "type": "string_with_in",
                "operator": ["=", "!=", "LIKE", "IN"]
            },
            {
                "type": "string_limited",
                "operator": ["=", "!=", "IN"]
            },
            {
                "type": "autocomplete",
                "operator": ["=", "!=", "IN"]
            },
            {
                "type": "list",
                "operator": ["LIKE","="]
            },
            {
                "type": "list",
                "subType": "xml",
                "operator": ["="]
            },
            {
                "type": "bool",
                "operator": ["=", "!="]
            },
            {
                "type": "singleselect",
                "operator": ["="]
            },
            {
                "type": "singleselect_read_only",
                "operator": ["="]
            },
            {
                "type": "singleselect_ext",
                "operator": ["=", "!="]
            }
        ]
    };
    public static attributeSetting = [
        {
            field: "Customer.CUST_NM",
            title: "Customer",
            type: "list",
            width: 140,
            lookupText: "CUST_NM",
            lookupValue: "CUST_SID",
            lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
        }, {
            field: "CUST_ACCNT_DIV",
            title: "Division",
            type: "string",
            width: 140
        }, {
            field: "CNTRCT_TITLE",
            title: "Folio Title",
            type: "string",
            width: 140
        }, {
            field: "PRC_ST_OBJ_SID",
            title: "Pricing Strategy Id",
            type: "number",
            width: 140
        }, {
            field: "CNTRCT_OBJ_SID",
            title: "Folio Id",
            type: "number",
            width: 110
        }, {
            field: "DC_ID",
            title: "Deal",
            type: "number",
            width: 100

        }, {
            field: "WF_STG_CD",
            title: "Deal Status",
            type: "list",
            width: 140,
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [
                { Value: "Draft" },
                { Value: "Requested" },
                { Value: "Submitted" },
                { Value: "Won" },
                { Value: "Offer" },
                { Value: "Lost" },
                { Value: "Cancelled" }
            ]

        }, {
            field: "OBJ_SET_TYPE_CD",
            title: "Deal Type",
            type: "singleselect",
            width: 130,
            lookupText: "OBJ_SET_TYPE_NM",
            lookupValue: "OBJ_SET_TYPE_CD",
            lookups: [
                {  Value: "ECAP" },
                {  Value: "KIT" }
            ]
        }, {
            field: "DEAL_DESC",
            title: "Deal Description",
            type: "string",
            width: 210,
            filterable: "objFilter",
        }, {
            field: "START_DT",
            title: "Start Date",
            type: "date",
            width: 130
        }, {
            field: "END_DT",
            title: "End Date",
            type: "date",
            width: 130
        }, {
            field: "PRODUCT_CATEGORIES",
            title: "Product Verticals",
            type: "list",
            width: 150,
            lookupText: "PRD_CAT_NM",
            lookupValue: "PRD_CAT_NM",
            lookupUrl: "/api/Products/GetProductCategories"
        }, {
            field: "PRODUCT_FILTER",
            title: "Product",
            type: "string",
            width: 400,
            dimKey: 20,
        }, {
            field: "MRKT_SEG",
            title: "Market Segment",
            type: "list",
            width: 140,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
        }, {
            field: "TRKR_NBR",
            title: "Tracker #",
            type: "string",
            width: 210,
            dimKey: 20
           
        }, {
            field: "CAP",
            title: "CAP",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}"           
        }, {
            field: "ECAP_PRICE",
            title: "ECAP Price",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}"         
        }, {
            field: "VOLUME",
            title: "Ceiling Vol",
            type: "number",
            width: 120
        }, {
            field: "PROGRAM_PAYMENT",
            title: "Program Payment",
            type: "list",
            width: 140,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT"
        }, {
            field: "PAYOUT_BASED_ON",
            title: "Payout Based On",
            type: "list",
            width: 140,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
        }, {
            field: "SERVER_DEAL_TYPE",
            title: "Server Deal Type",
            type: "list",
            width: 140,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
        }, {
            field: "GEO_COMBINED",
            title: "Geo",
            type: "string",
            width: 100
        },{
            field: "NET_VOL_PAID",
            title: "Net Credited Volume",
            type: "number",
            width: 120
        }, {
            field: "TOT_QTY_PAID",
            title: "Total Qty Paid",
            type: "number",
            format: "{0:c}",
            width: 120
        },{
            field: "END_CUSTOMER_RETAIL",
            title: "End Customer",
            type: "string",
            width: 140
        }, {
            field: "QUOTE_LN_ID",
            title: "Quote Line Number",
            type: "string",
            width: 140
        }, {
            field: "DEAL_GRP_NM ",
            title: "Kit Name",
            type: "string",
            width: 140
        }, {
            field: "NOTES",
            title: "Comments / notes",
            type: "string",
            width: 250
        }, {
            field: "GEO_APPROVED_BY",
            title: "GEO Approved By",
            type: "string",
            width: 160
        }, {
            field: "DIV_APPROVED_BY",
            title: "DIV Approved By",
            type: "string",
            width: 160
        }, {
            field: "CRE_EMP_NAME",
            title: "Created By",
            type: "string",
            width: 160
        }, {
            field: "CRE_DTM",
            title: "Created Time",
            type: "string",
            width: 140
        },
        {
            field: "AR_SETTLEMENT_LVL",
            title: "Settlement Level",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL"
        },
        {
            field: "PERIOD_PROFILE",
            title: "Period Profile",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PERIOD_PROFILE"
        }, {
            field: "CONSUMPTION_LOOKBACK_PERIOD",
            title: "Billing Rolling Lookback Period",
            type: "number",
            width: 160
        }, {
            field: "AUTO_APPROVE_RULE_INFO",
            title: "Auto-Approved By",
            type: "string",
            width: 100
        }
    ];

    public static advancedSearchAttributeSettings = [
        {
            field: "Customer.CUST_NM",
            title: "Customer",
            type: "list",
            width: 140,
            filterable: "/api/Customers/GetMyCustomersNameInfo",
            lookupText: "CUST_NM",
            lookupValue: "CUST_SID",
            lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
        }, {
            field: "CUST_ACCNT_DIV",
            title: "Division",
            type: "string",
            width: 140
        }, {
            field: "CNTRCT_TITLE",
            title: "Contract Title",
            type: "string",
            width: 140,
            template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_TITLE#</a>"
        }, {
            field: "CNTRCT_OBJ_SID",
            title: "Contract Id",
            type: "string",
            width: 110,
            template: "<a href='/Contract\\#/manager/#=data.CNTRCT_OBJ_SID#' target='_blank' class='objDealId'>#=data.CNTRCT_OBJ_SID#</a>"
        }, {
            field: "PRC_ST_TITLE",
            title: "Pricing Strategy",
            type: "string",
            width: 140,
            template: "<a href='/Contract\\#/gotoPs/#=data.PRC_ST_OBJ_SID#' target='_blank' class='objDealId'>#=data.PRC_ST_TITLE#</a>"
        }, {
            field: "CNTRCT_C2A_DATA_C2A_ID",
            title: "C2A Id",
            type: "string",
            width: 100
        }, {
            field: "DC_ID",
            title: "Deal",
            type: "number",
            width: 100,
            filterable: "numObjFilter",
            template: "<deal-popup-icon deal-id=\"'#=data.DC_ID#'\"></deal-popup-icon><a href='/Contract\\#/gotoDeal/#=data.DC_ID#' target='_blank' class='objDealId'>#=data.DC_ID#</a>"
        }, {
            field: "WF_STG_CD",
            title: "Deal Status",
            type: "list",
            width: 140,
            template: "#=gridUtils.stgFullTitleChar(data)#",
            filterable: "lookups",
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [
                { Value: "Draft" },
                { Value: "Requested" },
                { Value: "Submitted" },
                { Value: "Pending" },
                { Value: "Approved" },
                { Value: "Active" },
                { Value: "Hold" },
                { Value: "Lost" },
                { Value: "Offer" },
                { Value: "Won" },
                { Value: "Cancelled" }
            ]

        }, {
            field: "OBJ_SET_TYPE_CD",
            title: "Deal Type",
            type: "list",
            width: 130,
            filterable: "lookups",
            lookupText: "OBJ_SET_TYPE_NM",
            lookupValue: "OBJ_SET_TYPE_CD",
            lookups: [

                { Value: "LUMP_SUM" },
                { Value: "ECAP" },
                { Value: "FLEX" },
                { Value: "KIT" },
                { Value: "PROGRAM" },
                { Value: "REV_TIER" },
                { Value: "VOL_TIER" },
            ]
        }, {
            field: "DEAL_DESC",
            title: "Deal Description",
            type: "string",
            width: 210,
            filterable: "objFilter",
        }, {
            field: "START_DT",
            title: "Start Date",
            type: "date",
            template: "#if(START_DT==null){#  #}else{# #= momentService.moment(START_DT).format('MM/DD/YYYY') # #}#",
            width: 130
        }, {
            field: "END_DT",
            title: "End Date",
            type: "date",
            template: "#if(END_DT==null){#  #}else{# #= momentService.moment(END_DT).format('MM/DD/YYYY') # #}#",
            width: 130
        }, {
            field: "OEM_PLTFRM_LNCH_DT",
            title: "OEM Platform Launch Date",
            type: "date",
            template: "#if(OEM_PLTFRM_LNCH_DT==null){#  #}else{# #= momentService.moment(OEM_PLTFRM_LNCH_DT).format('MM/DD/YYYY') # #}#",
            width: 130
        }, {
            field: "OEM_PLTFRM_EOL_DT",
            title: "OEM Platform EOL Date",
            type: "date",
            template: "#if(OEM_PLTFRM_EOL_DT==null){#  #}else{# #= momentService.moment(OEM_PLTFRM_EOL_DT).format('MM/DD/YYYY') # #}#",
            width: 130
        }, {
            field: "PRODUCT_CATEGORIES",
            title: "Product Verticals",
            type: "list",
            width: 150,
            filterable: "listMultiProdCatFilter",
            lookupText: "PRD_CAT_NM",
            lookupValue: "PRD_CAT_NM",
            lookupUrl: "/api/Products/GetProductCategories"
        }, {
            field: "PRODUCT_FILTER",
            title: "Product",
            type: "string",
            width: 400,
            dimKey: 20,
            filterable: "objFilter",
            template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
        }, {
            field: "MRKT_SEG",
            title: "Market Segment",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
        }, {
            field: "REBATE_TYPE",
            title: "Rebate Type",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDistinctDropdownCodes/REBATE_TYPE"
        }, {
            field: "TRKR_NBR",
            title: "Tracker #",
            type: "string",
            width: 210,
            dimKey: 20,
            filterable: "objFilter",
            template: "<span id='trk_#= data.DC_ID #'>#= gridUtils.tenderDim(data, 'TRKR_NBR') #</span>"
        }, {
            field: "CAP",
            title: "CAP",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: "moneyObjFilter",
            template: "#= gridUtils.tenderDim(data, 'CAP', 'c') #"
        }, {
            field: "ECAP_PRICE",
            title: "ECAP Price",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: "moneyObjFilter",
            template: "#= gridUtils.tenderDim(data, 'ECAP_PRICE', 'c') #"
        }, {
            field: "VOLUME",
            title: "Ceiling Vol",
            type: "number",
            width: 120
        }, {
            field: "PAYABLE_QUANTITY",
            title: "Payable Quantity",
            type: "number",
            width: 120
        }, {
            field: "STRT_VOL",
            title: "Start Volume",
            type: "number",
            width: 170,
            dimKey: 10,
            format: "{0:n}",
            filterable: "numObjFilter",
            template: "#= gridUtils.tierDim(data, 'STRT_VOL', 'n') #"
        }, {
            field: "END_VOL",
            title: "End Volume",
            type: "number",
            width: 170,
            dimKey: 10,
            format: "{0:n}",
            filterable: "numObjFilter",
            template: "#= gridUtils.tierDim(data, 'END_VOL', 'n') #"
        }, {
            field: "RATE",
            title: "Rate",
            type: "money",
            width: 170,
            dimKey: 10,
            format: "{0:c}",
            filterable: "moneyObjFilter",
            template: "#= gridUtils.tierDim(data, 'RATE', 'c') #"
        }, {
            field: "PROGRAM_PAYMENT",
            title: "Program Payment",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT"
        }, {
            field: "PAYOUT_BASED_ON",
            title: "Payout Based On",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
        }, {
            field: "SERVER_DEAL_TYPE",
            title: "Server Deal Type",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
        }, {
            field: "GEO_COMBINED",
            title: "Geo",
            type: "string",
            width: 100
        }, {
            field: "TOTAL_DOLLAR_AMOUNT",
            title: "Total Dollar Amount",
            type: "number",
            width: 170,
            format: "{0:c}",
            filterable: "moneyObjFilter"
        }, {
            field: "NET_VOL_PAID",
            title: "Net Credited Volume",
            type: "number",
            filterable: false,
            sortable: false,
            width: 120
        },{
            field: "TOT_QTY_PAID",
            title: "Total Qty Paid",
            type: "number",
            format: "{0:c}",
            filterable: false,
            sortable: false,
            width: 120
        },{
            field: "END_CUSTOMER_RETAIL",
            title: "End Customer",
            type: "string",
            width: 140
        }, {
            field: "QUOTE_LN_ID",
            title: "Quote Line Number",
            type: "string",
            width: 140
        }, {
            field: "DEAL_GRP_NM ",
            title: "Kit Name",
            type: "string",
            width: 140
        }, {
            field: "NOTES",
            title: "Comments / notes",
            type: "string",
            width: 250
        }, {
            field: "GEO_APPROVED_BY",
            title: "GEO Approved By",
            type: "string",
            width: 160
        }, {
            field: "DIV_APPROVED_BY",
            title: "DIV Approved By",
            type: "string",
            width: 160
        }, {
            field: "CRE_EMP_NAME",
            title: "Created By",
            type: "string",
            width: 160
        }, {
            field: "CRE_DTM",
            title: "Created Time",
            type: "string",
            template: "#= momentService.moment(CHG_DTM).format('MM/DD/YYYY HH:mm:ss') #",
            width: 140
        },
        {
            field: "AR_SETTLEMENT_LVL",
            title: "Settlement Level",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL"
        },
        {
            field: "PERIOD_PROFILE",
            title: "Period Profile",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PERIOD_PROFILE"
        }, {
            field: "CONSUMPTION_LOOKBACK_PERIOD",
            title: "Billing Rolling Lookback Period",
            type: "number",
            width: 160
        }, {
            field: "AUTO_APPROVE_RULE_INFO",
            title: "Auto-Approved By",
            type: "string",
            width: 160
        }
    ];
    public static advancedSearchColumnConfig = [
        {
            field: "Customer_NM",
            title: "Customer",
            type: "list",
            excelTemplate: "#=Customer.CUST_NM#",
            width: 140,
            filterable: "/api/Customers/GetMyCustomersNameInfo",
            lookupText: "CUST_NM",
            lookupValue: "CUST_SID",
            lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
        }, {
            field: "CUST_ACCNT_DIV",
            title: "Division",
            type: "string",
            width: 140
        }, {
            field: "CNTRCT_TITLE",
            title: "Contract Title",
            type: "string",
            width: 140
        }, {
            field: "CNTRCT_OBJ_SID",
            title: "Contract Id",
            type: "string",
            width: 110
        }, {
            field: "PRC_ST_TITLE",
            title: "Pricing Strategy",
            type: "string",
            width: 140
        }, {
            field: "CNTRCT_C2A_DATA_C2A_ID",
            title: "C2A Id",
            type: "string",
            width: 100
        }, {
            field: "DC_ID",
            title: "Deal",
            type: "number",
            width: 120,
            filterable: "numObjFilter",
        }, {
            field: "WF_STG_CD",
            title: "Deal Status",
            type: "list",
            width: 140,
            filterable: "lookups",
            lookupText: "Value",
            lookupValue: "Value",
            lookups: [
                { Value: "Draft" },
                { Value: "Requested" },
                { Value: "Submitted" },
                { Value: "Pending" },
                { Value: "Approved" },
                { Value: "Active" },
                { Value: "Hold" },
                { Value: "Lost" },
                { Value: "Offer" },
                { Value: "Won" },
                { Value: "Cancelled" }
            ]

        }, {
            field: "OBJ_SET_TYPE_CD",
            title: "Deal Type",
            type: "list",
            width: 130,
            filterable: "lookups",
            lookupText: "OBJ_SET_TYPE_NM",
            lookupValue: "OBJ_SET_TYPE_CD",
            lookups: [

                { Value: "LUMP_SUM" },
                { Value: "ECAP" },
                { Value: "FLEX" },
                { Value: "KIT" },
                { Value: "PROGRAM" },
                { Value: "REV_TIER" },
                { Value: "VOL_TIER" },
            ]
        }, {
            field: "DEAL_DESC",
            title: "Deal Description",
            type: "string",
            width: 210,
            filterable: "objFilter",
        }, {
            field: "START_DT",
            title: "Start Date",
            type: "date",
            width: 130
        }, {
            field: "END_DT",
            title: "End Date",
            type: "date",
            width: 130
        }, {
            field: "OEM_PLTFRM_LNCH_DT",
            title: "OEM Platform Launch Date",
            type: "date",
            width: 130
        }, {
            field: "OEM_PLTFRM_EOL_DT",
            title: "OEM Platform EOL Date",
            type: "date",
            width: 130
        }, {
            field: "PRODUCT_CATEGORIES",
            title: "Product Verticals",
            type: "list",
            width: 150,
            filterable: "listMultiProdCatFilter",
            lookupText: "PRD_CAT_NM",
            lookupValue: "PRD_CAT_NM",
            lookupUrl: "/api/Products/GetProductCategories"
        }, {
            field: "TITLE",
            title: "Product",
            excelTemplate: "#=TITLE#",
            template: "#=gridUtils.uiProductControlWrapper(data, 'TITLE')#",
            type: "string",
            width: 400,
            dimKey: 20,
            filterable: "objFilter",
        }, {
            field: "MRKT_SEG",
            title: "Market Segment",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
        }, {
            field: "REBATE_TYPE",
            title: "Rebate Type",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDistinctDropdownCodes/REBATE_TYPE"
        }, {
            field: "TRKR_NBR_VAL",
            title: "Tracker #",
            type: "string",
            width: 210,
            dimKey: 20,
            filterable: "objFilter",
        }, {
            field: "CAP_VAL",
            title: "CAP",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: "moneyObjFilter"
        }, {
            field: "ECAP_PRICE_VAL",
            title: "ECAP Price",
            excelTemplate: "#=ECAP_PRICE.20___0#",
            type: "money",
            width: 170,
            dimKey: 20,
            format: "{0:c}",
            filterable: "moneyObjFilter",
        }, {
            field: "VOLUME",
            title: "Ceiling Vol",
            type: "number",
            width: 120
        }, {
            field: "PAYABLE_QUANTITY",
            title: "Payable Quantity",
            type: "number",
            width: 120
        }, {
            field: "STRT_VOL_VAL",
            title: "Start Volume",
            type: "number",
            width: 170,
            dimKey: 10,
            format: "{0:n}",
            filterable: "numObjFilter",
        }, {
            field: "END_VOL_VAL",
            title: "End Volume",
            type: "number",
            width: 170,
            dimKey: 10,
            format: "{0:n}",
            filterable: "numObjFilter",
        }, {
            field: "RATE_VAL",
            title: "Rate",
            type: "money",
            width: 170,
            dimKey: 10,
            format: "{0:c}",
            filterable: "moneyObjFilter"
        }, {
            field: "PROGRAM_PAYMENT",
            title: "Program Payment",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PROGRAM_PAYMENT"
        }, {
            field: "PAYOUT_BASED_ON",
            title: "Payout Based On",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
        }, {
            field: "SERVER_DEAL_TYPE",
            title: "Server Deal Type",
            type: "list",
            width: 140,
            filterable: "lookupUrl",
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
        }, {
            field: "GEO_COMBINED",
            title: "Geo",
            type: "string",
            width: 100
        }, {
            field: "TOTAL_DOLLAR_AMOUNT",
            title: "Total Dollar Amount",
            type: "number",
            width: 170,
            format: "{0:c}",
            filterable: "moneyObjFilter"
        }, {
            field: "NET_VOL_PAID",
            title: "Net Credited Volume",
            type: "number",
            filterable: false,
            sortable: false,
            width: 120
        }, {
            field: "TOT_QTY_PAID",
            title: "Total Qty Paid",
            type: "number",
            format: "{0:c}",
            filterable: false,
            sortable: false,
            width: 120
        },{
            field: "END_CUSTOMER_RETAIL",
            title: "End Customer",
            type: "string",
            width: 140
        }, {
            field: "QUOTE_LN_ID",
            title: "Quote Line Number",
            type: "string",
            width: 140
        }, {
            field: "DEAL_GRP_NM",
            title: "Kit Name",
            type: "string",
            width: 140
        }, {
            field: "NOTES",
            title: "Comments / notes",
            type: "string",
            width: 250
        }, {
            field: "GEO_APPROVED_BY",
            title: "GEO Approved By",
            type: "string",
            width: 160
        }, {
            field: "DIV_APPROVED_BY",
            title: "DIV Approved By",
            type: "string",
            width: 160
        }, {
            field: "CRE_EMP_NAME",
            title: "Created By",
            type: "string",
            width: 160
        }, {
            field: "CRE_DTM",
            title: "Created Time",
            type: "string",
            width: 140
        },
        {
            field: "AR_SETTLEMENT_LVL",
            title: "Settlement Level",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/AR_SETTLEMENT_LVL"
        },
        {
            field: "PERIOD_PROFILE",
            title: "Period Profile",
            type: "singleselect",
            width: 160,
            lookupText: "DROP_DOWN",
            lookupValue: "DROP_DOWN",
            lookupUrl: "/api/Dropdown/GetDropdowns/PERIOD_PROFILE"
        }, {
            field: "CONSUMPTION_LOOKBACK_PERIOD",
            title: "Billing Rolling Lookback Period",
            type: "number",
            width: 160
        }, {
            field: "AUTO_APPROVE_RULE_INFO",
            title: "Auto-Approved By",
            type: "string",
            width: 160
        }
    ];

    public static tenderDashboardBasicContractData = {
        WF_STG_CD: "InComplete",
        DC_ID: -101,
        TITLE: "",
        CUST_MBR_SID: null,
        CUST_ACCNT_DIV: null,
        CUST_ACCNT_DIV_UI: "",
        COMP_MISSING_FLG: 0,
        HAS_ATTACHED_FILES: 0,
        OBJ_SET_TYPE_CD: "ALL_TYPES",
        TENDER_PUBLISHED: 0,
        START_DT: "01/01/2018", // These are just set to whatever, switched out mid tier to current Q
        END_DT: "04/30/2018", // These are just set to whatever, switched out mid tier to current Q
        C2A_DATA_C2A_ID: "Tender Folio Auto",
        MEETCOMP_TEST_RESULT: "Not Run Yet",
        COST_TEST_RESULT: "Not Run Yet",
        CUST_ACCPT: "Acceptance Not Required in C2A",
        PASSED_VALIDATION: "Dirty",
        HAS_TRACKER: 0,
        OVERLAP_RESULT: "Not Run Yet",
        COST_MISSING_FLG: 0,
        SYS_COMMENTS: 0,
        CAP_MISSING_FLG: 0,
        IN_REDEAL: 0,
        IS_TENDER: 1,
        VERTICAL_ROLLUP: "",
        _behaviors: {
            isRequired:
            {
                "CUST_MBR_SID": true,
                "TITLE": true
            },
            isHidden:
            {
                "CUST_ACCNT_DIV_UI": true
            }
        }
    };

    public static tenderDashboardCustomSettings = [{
        field: "OBJ_SET_TYPE_CD",
        operator: "=",
        value: "ECAP",
        source: null
    }, {
        field: "END_CUSTOMER_RETAIL",
        operator: "LIKE",
        value: "",
        source: null
    }, {
        field: "QUOTE_LN_ID",
        operator: "LIKE",
        value: "",
        source: null
    }];
}