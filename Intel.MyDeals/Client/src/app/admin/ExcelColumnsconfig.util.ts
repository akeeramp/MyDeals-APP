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
    static bulkUnifyColHeaders = ["Deal ID", "Unified Customer ID", "Unified Customer Name", "Country/Region Customer ID", "Unified Country/Region", "End Customer Retail", "End Customer Country/Region", "RPL Status Code", "Error Messages"]
    static bulkUnifyColumns = [
        {
            data: 'DEAL_ID',//0 deal id
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'UCD_GLOBAL_ID',//1 Unified Customer ID
            type: 'numeric',
            readOnly: false,
            width: 130
        },
        {
            data: 'UCD_GLOBAL_NAME',//2 Unified Customer Name
            type: 'text',
            readOnly: false,
            width: 180
        },
        {
            data: 'UCD_COUNTRY_CUST_ID',//3 Country/Region Customer ID
            type: 'numeric',
            readOnly: false,
            width: 130
        },
        {
            data: 'UCD_COUNTRY',//4 Unified Country/Region
            type: 'text',
            readOnly: false,
            width: 180
        },
        {
            data: 'DEAL_END_CUSTOMER_RETAIL',//5 End Customer Retail
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'DEAL_END_CUSTOMER_COUNTRY',//6 End Customer Country/Region
            type: 'text',
            readOnly: false,
            width: 180
        },
        {
            data: 'RPL_STS_CODE',//7 RPL Status code
            type: 'text',
            readOnly: false,
            width: 180
        },
        {
            type: 'text',//8 Error Msges
            readOnly: true,
            width: 260
        },
    ]
    static DealReconColHeaders = ["Deal ID", "Unified Customer ID", "Unified Customer Name", "Country/Region Customer ID", "Unified Country/Region", "To Be Unified Customer ID", "To Be Unified Customer Name", "To Be Country/Region Customer ID", "To Be Unified Country/Region", "RPL Status Code", "Error Messages"]
    static DealReconColumns = [
        {
            data: 'Deal_ID',// 0 Deal ID A
            type: 'numeric',
            readOnly: false,
            width: 75
        },
        {
            data: 'Unified_Customer_ID',//1 Unified Customer ID B
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'Unified_Customer_Name',//2 Unified Customer Name c
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'Country_Region_Customer_ID',//3 d Country Region Customer ID
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'Unified_Country_Region',//4 e Unified Country Region
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'To_be_Unified_Customer_ID',//5 f To be Unified Customer ID
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'To_be_Unified_Customer_Name',//6 g To be Unified Customer Name
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'To_be_Country_Region_Customer_ID',//7 h To be Country Region Customer ID
            type: 'numeric',
            readOnly: false,
            width: 150
        },
        {
            data: 'To_be_Unified_Country_Region',//8 i To be Unified Country Region
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Rpl_Status_Code', // 9 j 
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'ERR_MSG',
            type: 'text',
            readOnly: false,
            width: 260
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