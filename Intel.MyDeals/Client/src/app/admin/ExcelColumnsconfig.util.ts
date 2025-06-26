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
            width: 80
        },
        {
            data: 'IA_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'COMP_BNCH',
            type: 'numeric',
            readOnly: false,
            width: 75
        }
    ]

    static unifiedDealCustomerExcelColHeaders = ["Is Active", "Unified Customer ID", "Unified Customer Name", "Country Customer ID", "Country Customer Name", "Unified Country", "RPL Status Code",];
    static unifiedDealCustomerExcel = [
        {
            data: 'Is Active',
            type: 'text',
            readOnly: false,
            width: 140
        },
        {
            data: 'Unified Customer ID',
            type: 'numeric',
            readOnly: false,
            width: 150
        },
        {
            data: 'Unified Customer Name',
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'Country Customer ID',
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'Country Customer Name',
            type: 'text',
            readOnly: false,
            width: 75
        },
        {
            data: 'Unified Country',
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'RPL Status Code',
            type: 'text',
            readOnly: false,
            width: 75
        }
    ]


    static unifiedDealExcel = [
        {
            data: 'CNTRCT_OBJ_SID',
            type: 'numeric',
            readOnly: false,
            width: 140,
            headerTemplate: "Contract Id"
        },
        {
            data: 'TITLE',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Contract/Tender Folio Name"
        },
        {
            data: 'OBJ_SID',
            type: 'numeric',
            readOnly: false,
            width: 150,
            headerTemplate: "Deal ID"
        },
        {
            data: 'END_CUSTOMER_RETAIL',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "End Customer Retail"
        },
        {
            data: 'END_CUSTOMER_COUNTRY',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "End Customer Country/Region"
        },
        {
            data: 'EMP_WWID',
            type: 'numeric',
            readOnly: false,
            width: 75,
            headerTemplate: "Creator WWID"
        },
        {
            data: 'UNIFIED_STATUS',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Status"
        },
        {
            data: 'UNIFIED_REASON',
            type: 'text',
            readOnly: false,
            width: 75,
            headerTemplate: "Reason Info"
        }
    ]


    static GetReportMissingCostDataExcel = [
        {
            data: 'ProductName',
            type: 'text',
            readOnly: false,
            width: 140
        },
        {
            data: 'Vertical',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'Processor',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'MissingYearAndCost',
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'ImpactedDeals',
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'Family',
            type: 'text',
            readOnly: false,
            width: 75
        },
        {
            data: 'Brand',
            type: 'text',
            readOnly: false,
            width: 75
        }
    ]

    static GetReportNewProductMissingCostDataExcel = [

        {
            data: 'ProductName',
            type: 'text',
            readOnly: false,
            width: 140
        },
        {
            data: 'Vertical',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'Brand',
            type: 'text',
            readOnly: false,
            width: 75
        },
        {
            data: 'Family',
            type: 'text',
            readOnly: false,
            width: 75
        },
        {
            data: 'Processor',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'ProducID',
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'Issue',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'DaysAgo',
            type: 'text',
            readOnly: false,
            width: 75
        },
        {
            data: 'MissingYearAndCost',
            type: 'text',
            readOnly: false,
            width: 80
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

    //Need to add the error messages
    static SDMBulkCopyColHeaders = ["Cycle Name", "Start Date", "End Date", "Category Name", "Processor Number", "SKU Name", "CPU FLR", "APAC PD", "IJKK PD", "PRC PD", "EMEA PD", "ASMO PD","IS DELETE", "Error Message"]

    static SDMBulkCopyColumns = [
     
        {
            data: 'CYCLE_NM',//0 Unified Customer ID
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'CURR_STRT_DT',//1 Unified Customer Name
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'CURR_END_DT',//2 Country/Region Customer ID
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'CPU_VRT_NM',//3 Unified Country/Region
            type: 'text',
            readOnly: false,
            width: 120
        },
        {
            data: 'CPU_PROCESSOR_NUMBER',//5 End Customer Country/Region
            type: 'text',
            readOnly: false,
            width: 180
        },
        {
            data: 'CPU_SKU_NM',//4 End Customer Retail
            type: 'text',
            readOnly: false,
            width: 400
        },
        {
            data: 'CPU_FLR',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'APAC_PD',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'IJKK_PD',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'PRC_PD',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'EMEA_PD',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'ASMO_PD',//6 RPL Status code
            type: 'numeric',
            readOnly: false,
            width: 80
        },
        {
            data: 'IS_DELETE',//6 RPL Status code
            type: 'text',
            readOnly: false,
            width: 80
        },
        {
            data: 'ERROR',
            type: 'text',//7 Error Msges
            readOnly: true,
            width: 260
        },
    ];

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
        width: 120
    },{
        data: 'ProjectName',
        type: 'text',
        readOnly: false,
        width: 120
    },{
        data: 'TrackerEffectiveStartDate',
        type: 'text',
        readOnly: false,
        width: 120
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

    static GetUCMReportDataDataExcel = [
        {
            data: 'DealId',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'CustomerName',
            type: 'text',
            readOnly: false,
            width: 400
        },

        {
            data: 'DealStartDate',
            type: 'text',
            readOnly: false,
            width: 400
        },
        {
            data: 'DealEndDate',
            type: 'text',
            readOnly: false,
            width: 400
        },
        {
            data: 'DealStage',
            type: 'text',
            readOnly: false,
            width: 400
        },

        {
            data: 'EndCustomerRetail',
            type: 'text',
            readOnly: false,
            width: 500
        },
        {
            data: 'EndCustomerCountryRegion',
            type: 'text',
            readOnly: false,
            width: 500
        }, {
            data: 'UnifiedGlobalCustomerId',
            type: 'text',
            readOnly: false,
            width: 500
        }, {
            data: 'UnifiedGlobalCustomerName',
            type: 'text',
            readOnly: false,
            width: 500
        }, {
            data: 'UnifiedCountryRegionCustomerId',
            type: 'numeric',
            readOnly: false,
            width: 500
        }, {
            data: 'UnifiedCountryRegionCustomerName',
            type: 'text',
            readOnly: false,
            width: 500
        }, {
            data: 'RplStatus',
            type: 'text',
            readOnly: false,
            width: 300
        }, {
            data: 'RplStatusCode',
            type: 'text',
            readOnly: false,
            width: 300,
        }
    ]
    static ProductSelReport = [
        {
            data: 'PCSR_NBR',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Processor Number"

        },
        {
            data: 'DEAL_PRD_NM',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "Deal Product Name"
        },
        {
            data: 'FMLY_NM',
            type: 'numeric',
            readOnly: false,
            width: 150,
            headerTemplate: "GDM Family Name"
        },
        {
            data: 'MTRL_ID',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "Material Id"
        },
        {
            data: 'PRD_STRT_DTM',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "Product Start Date"
        },
        {
            data: 'PRD_END_DTM',
            type: 'numeric',
            readOnly: false,
            width: 100,
            headerTemplate: "Product End Date"
        },
        {
            data: 'CAP',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "CAP Info"
        },
        {
            data: 'YCS2',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "YCS2"
        },
        {
            data: 'CPU_PROCESSOR_NUMBER',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "CPU Processor number"
        },
        {
            data: 'MM_MEDIA_CD',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "Media Code"
        },
        {
            data: 'MM_CUST_CUSTOMER',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "MM Customer Name"
        },
        {
            data: 'GDM_FMLY_NM',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "EDW Family Name"
        },
        {
            data: 'EPM_NM',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "EPM Name"
        },
        {
            data: 'SKU_NM',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "SKU Name"
        },
        {
            data: 'CPU_CACHE',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "CPU CACHE"
        },
        {
            data: 'GEO',
            type: 'text',
            readOnly: false,
            width: 100,
            headerTemplate: "Geo"
        },
        {
            data: 'actv_ind',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Is Active"
        },
    ]

    static reportCustomerExcel = [
        {
            data: 'CUST_NM',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Customer Name"
        },
        {
            data: 'OBJ_SID',
            type: 'numeric',
            readOnly: false,
            width: 140,
            headerTemplate: "Deal ID"
        },
        {
            data: 'OBJ_SET_TYPE_CD',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Deal Type"
        },
        {
            data: 'WF_STG_CD',
            type: 'numeric',
            readOnly: false,
            width: 150,
            headerTemplate: "Stage"
        },
        {
            data: 'START_DT',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Deal Start Date"
        },
        {
            data: 'END_DT',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Deal End Date"
        },
        {
            data: 'PAYOUT_BASED_ON',
            type: 'numeric',
            readOnly: false,
            width: 75,
            headerTemplate: "Payout Source"
        },
        {
            data: 'REBATE_BILLING_START',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Billings Start Date"
        },
        {
            data: 'REBATE_BILLING_END',
            type: 'text',
            readOnly: false,
            width: 75,
            headerTemplate: "Billings End Date"
        }
    ]
    
        static reportProductExcel = [
        {
            data: 'PRODUCT',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Product Name"
        },
        {
            data: 'OBJ_SID',
            type: 'numeric',
            readOnly: false,
            width: 140,
            headerTemplate: "Deal ID"
        },
        {
            data: 'OBJ_SET_TYPE_CD',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "Deal Type"
        },
        {
            data: 'WF_STG_CD',
            type: 'numeric',
            readOnly: false,
            width: 150,
            headerTemplate: "Stage"
        },
        {
            data: 'START_DT',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Deal Start Date"
        },
        {
            data: 'END_DT',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Deal End Date"
        },
        {
            data: 'PAYOUT_BASED_ON',
            type: 'numeric',
            readOnly: false,
            width: 75,
            headerTemplate: "Payout Source"
        },
        {
            data: 'REBATE_BILLING_START',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Billings Start Date"
        },
        {
            data: 'REBATE_BILLING_END',
            type: 'text',
            readOnly: false,
            width: 75,
            headerTemplate: "Billings End Date"
        }
    ]
    static  ProductVerticalExcel = [
        {
            data: 'GDM_PRD_TYPE_NM',
            type: 'text',
            readOnly: false,
            width: 140,
            headerTemplate: "Gdm Product Type"
        },
        {
            data: 'GDM_VRT_NM',
            type: 'text',
            readOnly: false,
            width: 150,
            headerTemplate: "GDM Vertical Name"
        },
        {
            data: 'DIV_NM',
            type: 'numeric',
            readOnly: false,
            width: 150,
            headerTemplate: "Division Short Name"

        },
        {
            data: 'OP_CD',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Op Code"

        },
        {
            data: 'DEAL_PRD_TYPE',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Deal Product Type"
        },
        {
            data: 'PRD_CAT_NM',
            type: 'numeric',
            readOnly: false,
            width: 75,
            headerTemplate: "Product Vertical"
        },
        {
            data: 'CHG_EMP_NM',
            type: 'text',
            readOnly: false,
            width: 80,
            headerTemplate: "Last Updated By"
        },
        {
            data: 'CHG_DTM',
            type: 'text',
            readOnly: false,
            width: 75,
            headerTemplate: "Last Update Date"
        }
    ]


    static GetproductsExcelCalDef = [
        {
            data: 'Id',
            type: 'numeric',
            readOnly: false,
            width: 100
        },
        {
            data: 'Type',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Category',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Brand',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Family',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Processor Number',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Name',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Material ID',
            type: 'text',
            readOnly: false,
            width: 100 
        },
        {
            data: 'Start Date',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'End Date',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Is Active',
            type: 'text',
            readOnly: false,
            width: 100
        }   
    ]

    static GetDropDownExcelCalDef = [
        {
            data: 'Is Active',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Deal Type',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Group',
            type: 'text',
            readOnly: false,
            width: 200
        },
        {
            data: 'Customer',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Value',
            type: 'text',
            readOnly: false,
            width: 200
        },
        {
            data: 'Description',
            type: 'text',
            readOnly: false,
            width: 100
        },
        {
            data: 'Tooltip',
            type: 'text',
            readOnly: false,
            width: 100
        },
    ]

    static GetUsrRolePermissionExcel = [
        {
            data: 'Database Name',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'User Name',
            type: 'text',
            readOnly: false,
            width: 300
        },
        {
            data: 'User Type',
            type: 'text',
            readOnly: false,
            width: 300
        },
        {
            data: 'Database User Name',
            type: 'text',
            readOnly: false,
            width: 500
        },
        {
            data: 'Role',
            type: 'text',
            readOnly: false,
            width: 200
        },
        {
            data: 'Permission Type',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'Permission State',
            type: 'text',
            readOnly: false,
            width: 150
        },
        {
            data: 'Object Type',
            type: 'text',
            readOnly: false,
            width: 300
        },
        {
            data: 'Object Name',
            type: 'text',
            readOnly: false,
            width: 300
        },
        {
            data: 'Row Refresh Date',
            type: 'text',
            readOnly: false,
            width: 150
        }
    ]
    
}