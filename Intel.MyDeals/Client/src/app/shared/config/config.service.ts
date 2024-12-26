
import { OperatorSetting, AttributeSetting } from './config.model'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})

export class ConfigService {
    operatorSettings: OperatorSetting[] = [{
        operator: 'LIKE',
        operCode: 'contains',
        label: 'contains'
    },
    {
        operator: '=',
        operCode: 'eq',
        label: 'equal to'
    },
    {
        operator: 'IN',
        operCode: 'in',
        label: 'in'
    },
    {
        operator: '!=',
        operCode: 'neq',
        label: 'not equal to'
    },
    {
        operator: "<",
        operCode: "lt",
        label: "less than"
    },
    {
        operator: "<=",
        operCode: "lte",
        label: "less than or equal to"
    },
    {
        operator: ">",
        operCode: "gt",
        label: "greater than"
    },
    {
        operator: ">=",
        operCode: "gte",
        label: "greater than or equal to"
    },
    {
        operator: "contains",
        operCode: "gte",
        label: "contains"
    }
    ]

    attributeSettings: AttributeSetting[] = [{
        field: "Customer.CUST_NM",
        title: "Customer",
        type: "list",
        width: 140
    },
    {
        field: "CUST_ACCNT_DIV",
        title: "Division",
        type: "string",
        width: 140
    },
    {
        field: "CNTRCT_TITLE",
        title: "Contract Title",
        type: "string",
        width: 140
    },
    {
        field: "PRC_ST_OBJ_SID",
        title: "Pricing Strategy Id",
        type: "number",
        width: 140
    },
    {
        field: "CNTRCT_OBJ_SID",
        title: "Contract Id",
        type: "string",
        width: 110
    },
    {
        field: "DC_ID",
        title: "Deal",
        type: "number",
        width: 100
    },
    {
        field: "WF_STG_CD",
        title: "Deal Status",
        type: "list",
        width: 140
    },
    {
        field: "OBJ_SET_TYPE_CD",
        title: "Deal Type",
        type: "singleselect",
        width: 130
    },
    {
        field: "DEAL_DESC",
        title: "Deal Description",
        type: "string",
        width: 210
    },
    {
        field: "START_DT",
        title: "Start Date",
        type: "date",
        width: 130
    },
    {
        field: "END_DT",
        title: "End Date",
        type: "date",
        width: 130
    },
    {
        field: "PRODUCT_CATEGORIES",
        title: "Product Verticals",
        type: "list",
        width: 150
    },
    {
        field: "PRODUCT_FILTER",
        title: "Product",
        type: "string",
        width: 400
    },
    {
        field: "MRKT_SEG",
        title: "Market Segment",
        type: "list",
        width: 140
    },
    {
        field: "TRKR_NBR",
        title: "Tracker #",
        type: "string",
        width: 210
    },
    {
        field: "CAP",
        title: "CAP",
        type: "money",
        width: 170
    },
    {
        field: "ECAP_PRICE",
        title: "ECAP Price",
        type: "money",
        width: 170
    },
    {
        field: "VOLUME",
        title: "Ceiling Vol",
        type: "number",
        width: 120
    },
    {
        field: "PROGRAM_PAYMENT",
        title: "Program Payment",
        type: "list",
        width: 140
    },
    {
        field: "PAYOUT_BASED_ON",
        title: "Payout Based On",
        type: "list",
        width: 140
    },
    {
        field: "SERVER_DEAL_TYPE",
        title: "Server Deal Type",
        type: "list",
        width: 140
    },
    {
        field: "GEO_COMBINED",
        title: "Geo",
        type: "string",
        width: 100
    },
    {
        field: "NET_VOL_PAID",
        title: "Net Credited Volume",
        type: "number",
        width: 120
    },
    {
        field: "TOT_QTY_PAID",
        title: "Total Qty Paid",
        type: "number",
        width: 120
    },
    {
        field: "END_CUSTOMER_RETAIL",
        title: "End Customer",
        type: "string",
        width: 140
    },
    {
        field: "QUOTE_LN_ID",
        title: "Quote Line Number",
        type: "string",
        width: 140
    },
    {
        field: "DEAL_GRP_NM ",
        title: "Kit Name",
        type: "string",
        width: 140
    },
    {
        field: "NOTES",
        title: "Comments / notes",
        type: "string",
        width: 250
    },
    {
        field: "GEO_APPROVED_BY",
        title: "GEO Approved By",
        type: "string",
        width: 160
    },
    {
        field: "DIV_APPROVED_BY",
        title: "DIV Approved By",
        type: "string",
        width: 160
    },
    {
        field: "CRE_EMP_NAME",
        title: "Created By",
        type: "string",
        width: 160
    },
    {
        field: "CRE_DTM",
        title: "Created Time",
        type: "string",
        width: 140
    },
    {
        field: "AR_SETTLEMENT_LVL",
        title: "Settlement Level",
        type: "singleselect",
        width: 160
    },
    {
        field: "PERIOD_PROFILE",
        title: "Period Profile",
        type: "singleselect",
        width: 160
    },
    {
        field: "CONSUMPTION_LOOKBACK_PERIOD",
        title: "Billing Rolling Lookback Period",
        type: "number",
        width: 160
    },
    {
        field: "AUTO_APPROVE_RULE_INFO",
        title: "Auto-Approved By",
        type: "string",
        width: 100
    }
    ]
}