export class ExcelColumnsConfig {
    static meetCompExcelColHeaders = ["Customer", "Deal Product Name(Only Processor, Lvl 4)", "Meet Comp Sku", "Meet Comp Price", "IA Bench", "Comp Bench"];
    static meetCompExcel = [
        {
            data: 'CUST_NM',
            type: 'text',
            readOnly: false,
            width: 140
        },
        {
            data: 'HIER_VAL_NM',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'MEET_COMP_PRD',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'MEET_COMP_PRC',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'IA_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'COMP_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 75
        }
    ]
    static bulkUnifyColHeaders = ["Deal ID", "Unified Customer ID", "Unified Customer Name", "Country/Region Customer ID", "Unified Country/Region", "End Customer Retail", "End Customer Country/Region", "RPL Status Code","Error Messages"]
    static bulkUnifyColumns = [
        {
            data: 'DEAL_ID',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'UCD_GLOBAL_ID',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'UCD_GLOBAL_NAME',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'UCD_COUNTRY_CUST_ID',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'UCD_COUNTRY',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'DEAL_END_CUSTOMER_RETAIL',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'DEAL_END_CUSTOMER_COUNTRY',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'RPL_STS_CODE',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            type: 'text',
            readOnly: true,
            width: 200
        },
    ]
    static bulkUnifyDealReconColHeaders = ["Deal ID", "Unified Customer ID", "Unified Customer Name", "Country/Region Customer ID", "Unified Country/Region", "To Be Unified Customer ID", "To Be Unified Customer Name", "To Be Country/Region Customer ID", "To Be Unified Country/Region", "RPL Status Code","Error Messages"]
    static bulkUnifyDealReconColumns = [
        {
            data: 'DEAL_ID',
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'EXISTING_UCD_GLOBAL_ID',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'EXISTING_UCD_GLOBAL_NAME',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'EXISTING_UCD_COUNTRY_CUST_ID',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'EXISTING_UCD_COUNTRY',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'NEW_UCD_GLOBAL_ID',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'NEW_UCD_GLOBAL_NAME',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'NEW_UCD_COUNTRY_CUST_ID',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'NEW_UCD_COUNTRY',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'RPL_STS_CD',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'ERR_MSG',
            type: 'text',
            readOnly: false,
            width: 200
        }
    ]

    static legalExceptionExcelColumns = [
        {
            title: "Active",
            field: "ACTV_IND",
            width: 115,
            headerTemplate: "<div class='isRequired'> Active </div>"
        },
        {
            title: "Hidden",
            field: "IS_DSBL",
            width: 115,
            headerTemplate: "<div class='isRequired'> Hidden </div>"
        },
        {
            title: "PCT Legal Exception Sid",
            field: "MYDL_PCT_LGL_EXCPT_SID",
            hidden: true,
            width: 120,
        },
        {
            field: "PCT_EXCPT_NBR",
            title: "PCT Exception No.",
            headerTemplate: "<div class='isRequired'> PCT Exception No. </div>",
            width: 150
        },
        {
            field: "VER_NBR",
            title: "Version No.",
            headerTemplate: "<div class='isRequired'> Version No. </div>",
            width: 150
        },
        {
            field: "INTEL_PRD",
            headerTemplate: "<div class='isRequired'> Intel Product </div>",
            title: "Intel Product",
            width: 540
        },
        {
            field: "SCPE",
            headerTemplate: "<div class='isRequired'> Scope </div>",
            title: "Scope",
            width: 200
        },
        {
            field: "PRC_RQST",
            title: "Price Request",
            headerTemplate: "<div class='isRequired'> Price Request </div>",
            width: 160
        },
        {
            field: "COST",
            title: "Cost",
            headerTemplate: "<div class='isRequired'> Cost </div>",
            width: 120
        },
        {
            field: "PCT_LGL_EXCPT_STRT_DT",
            width: 150,
            headerTemplate: "<div class='isRequired'> Exception Start Date </div>",
            title: "Exception Start Date"
        },
        {
            field: "PCT_LGL_EXCPT_END_DT",
            title: "Exception End Date",
            headerTemplate: "<div class='isRequired'> Exception End Date </div>",
            width: 150
        },
        {
            title: "Forecasted Volume By Quarter",
            field: "FRCST_VOL_BYQTR",
            headerTemplate: "<div class='isRequired'> Forecasted Volume By Quarter </div>",
            width: 120
        },
        {
            field: "CUST_PRD",
            title: "Customer Product",
            headerTemplate: "<div class='isRequired'> Customer Product </div>",
            width: 150
        },
        {
            field: "MEET_COMP_PRD",
            title: "Comp Product",
            headerTemplate: "<div class='isRequired'> Comp Product </div>",
            width: 150
        },
        {
            field: "MEET_COMP_PRC",
            title: "Comp Price",
            headerTemplate: "<div class='isRequired'> Comp Price </div>",
            width: 150
        },
        {
            title: "Deal List",
            field: "DEALS_USED_IN_EXCPT",
            width: 120
        },
        {
            field: "BUSNS_OBJ",
            title: "Business Object",
            headerTemplate: "<div class='isRequired'> Business Object </div>",
            width: 150
        },
        {
            field: "PTNTL_MKT_IMPCT",
            title: "Potential Market Impact",
            headerTemplate: "<div class='isRequired'> Potential Market Impact </div>",
            width: 180
        },
        {
            field: "OTHER",
            title: "Other",
            headerTemplate: "<div class='isRequired'> Other </div>",
            width: 120
        },
        {
            field: "JSTFN_PCT_EXCPT",
            title: "Justification for PCT Expiry",
            headerTemplate: "<div class='isRequired'> Justification for PCT Expiry </div>",
            width: 220
        },
        {
            field: "EXCPT_RSTRIC_DURN",
            title: "Exceptions, Restrictions & Durations",
            headerTemplate: "<div class='isRequired'> Exceptions, Restrictions & Durations </div>",
            width: 150
        },
        {
            field: "RQST_CLNT",
            title: "Requesting Client",
            headerTemplate: "<div class='isRequired'> Requesting Client </div>",
            width: 150
        },
        {
            field: "RQST_ATRNY",
            title: "Requesting Attorney",
            headerTemplate: "<div class='isRequired'> Requesting Attorney </div>",
            width: 150
        },
        {
            field: "APRV_ATRNY",
            title: "Approving Attorney",
            headerTemplate: "<div class='isRequired'> Approving Attorney </div>",
            width: 150
        },
        {
            field: "DT_APRV",
            title: "Date Approved",
            headerTemplate: "<div class='isRequired'> Date Approved </div>",
            width: 150
        },
        {
            field: "CHG_EMP_NAME",
            title: "Entered By",
            headerTemplate: "<div class='isRequired'> Entered By </div>",
            width: 150
        },
        {
            field: "CHG_DTM",
            title: "Entered Date",
            headerTemplate: "<div class='isRequired'> Entered Date </div>",
            width: 150
        }
    ]

    
static bulkPriceUpdatesColHeaders = [
    "Deal ID","Deal Description","ECAP Price","Ceiling Volume","Deal Start Date","Deal End Date","Billings Start Date","Billings End Date","Project Name","Tracker Effective Date","Additional Terms","Deal stage","Update Status","Error Messages"
]

static bulkPriceUpdateColumnData =  [
    {
        data: 'DealId',
        type: 'numeric',
        readOnly: false,
        width: 80
    },
    {
        data: 'DealDesc',
        type: 'text',
        readOnly: false,
        width: 150
    },
    
    {
        data: 'EcapPrice',
        type: 'numeric',
        readOnly: false,
        width: 90
    },
    {
        data: 'Volume',
        type: 'numeric',
        readOnly: false,
        width: 100
    },
    {
        data: 'DealStartDate',
        type: 'text',
        readOnly: false,
        width: 100
    },
    
    {
        data: 'DealEndDate',
        type: 'text',
        readOnly: false,
        width: 100
    },
    {
        data: 'BillingsStartDate',
        type: 'text',
        readOnly: false,
        width: 100
    },{
        data: 'BillingsEndDate',
        type: 'text',
        readOnly: false,
        width: 153
    },{
        data: 'ProjectName',
        type: 'text',
        readOnly: false,
        width: 150
    },{
        data: 'TrackerEffectiveStartDate',
        type: 'text',
        readOnly: false,
        width: 130
    },{
        data: 'AdditionalTermsAndConditions',
        type: 'text',
        readOnly: false,
        width: 150
    },{
        data: 'DealStage',
        type: 'text',
        readOnly: true,
        width: 100
    },{
        data: 'UpdateStatus',
        type: 'text',
        readOnly: true,
        width: 100,
    },{
        data: 'ValidationMessages',
        type: 'text',
        readOnly: true,
        width: 250,
    }
]

}