function dealUtil() { }

dealUtil.errorCell = "-- error --";
dealUtil.gridPaddingOffset = 100;
dealUtil.gridRef = "#grid" + util.generateUUID();
dealUtil.gridContainer = "#gridDealContainer";
dealUtil.gridObj = null;
dealUtil.numLockedCols = 0;
dealUtil.schedCols = {};
dealUtil.model = {};
dealUtil.columns = [];
dealUtil.viewModel = {};
dealUtil.dealTypeAtrbs = {};
dealUtil.getDealsUrl = "/MyDeals/BySearch";
dealUtil.saveDealsUrl = "/api/MyDeals/v1/SaveDeals/";
dealUtil.findContractUrl = "/api/Contracts/v1/GetContract/";
dealUtil.findFullContractUrl = "/api/Contracts/v1/GetFullContract/";
dealUtil.saveContractUrl = "/api/Contracts/v1/SaveContract/";
dealUtil.saveFullContractUrl = "/api/Contracts/v1/SaveFullContract/";
dealUtil.savePricingStrategyUrl = "/api/MyDeals/v1/SavePricingStrategy/";
dealUtil.validateDealsUrl = "/api/MyDeals/v1/ValidateDeals/";
dealUtil.validateDealsByIdUrl = "/api/MyDeals/v1/ValidateDealsById/";
dealUtil.retrievingDataFunc = null;
dealUtil.retrievedDataFunc = null;
dealUtil.savingDataFunc = null;
dealUtil.validatingDataFunc = null;
dealUtil.savedDataFunc = null;
dealUtil.validatedDataFunc = null;
dealUtil.processedDataFunc = null;
dealUtil.errorOnDataLoadFunc = null;
dealUtil.errorOnDataSaveFunc = null;
dealUtil.errorOnDataValidationFunc = null;
dealUtil.validationResults = null;
dealUtil.validationQty = 0;



dealUtil.grid = function () {
    if (dealUtil.gridObj === undefined || dealUtil.gridObj === null) {
        dealUtil.gridObj = $(dealUtil.gridRef).data("kendoGrid");
    }
    return dealUtil.gridObj;
}

dealUtil.init = function () {
    dealUtil.schedCols["VOL_TIER"] = [
        { mode: "Tier", field: "TIER_NBR", title: "Tier" },
        { mode: "Start", field: "STRT_VOL", title: "Start Vol" },
        { mode: "End", field: "END_VOL", title: "End Vol" },
        { mode: "Rate", field: "RATE", title: "Rate" }
    ];
    dealUtil.schedCols["CAP_BAND"] = [
        { mode: "Tier", field: "TIER_NBR", title: "Tier" },
        { mode: "Start", field: "STRT_CAP", title: "Start Cap" },
        { mode: "End", field: "END_CAP", title: "End Cap" },
        { mode: "Rate", field: "RATE", title: "Rate" }
    ];

    dealUtil.model = {
        _status: { type: "bool" },
        _linked: { type: "bool" },
        _dirty: { type: "bool" },
        _dealDetails: { type: "string" },
        DealId: { type: "number" },
        Schedule: { type: "object" },
        QLTR_TERMS: { type: 'string' },
        Agreement: { type: 'string' },
        HasFiles: { type: 'string' },
        AuditHistory: { type: 'string' },
        BACK_DATE_RSN: { type: 'string' },
        REBATE_BILLING_END: { type: 'date' },
        REBATE_BILLING_START: { type: 'date' },
        C2A_DATA_C2A_ID: { type: 'string' },
        CAP: { type: 'object' },
        VOLUME: { type: 'number' },
        CommentHistory: { type: 'string' },
        COMMENTS: { type: 'string' },
        COMP_PRICE_CPU: { type: 'string' },
        COMP_PRICE_CS: { type: 'string' },
        COMPETITIVE_PRODUCT_CPU: { type: 'string' },
        COMP_PRODUCT_CPU_OTHER: { type: 'string' },
        COMPETITIVE_PRODUCT_CS: { type: 'string' },
        COMP_PRODUCT_CS_OTHER: { type: 'string' },
        //CONSUMPTION_REASON: { type: 'string' },
        //CONSUMPTION_REASON_CMNT: { type: 'string' },
        COST: { type: 'string' },
        DEAL_COST_TEST_FAIL_OVERRIDE: { type: 'string' },
        DEAL_COST_TEST_RESULT: { type: 'string' },
        CS_SHIP_AHEAD_END_DT: { type: 'string' },
        CS_SHIP_AHEAD_STRT_DT: { type: 'string' },
        DealAction: { type: 'string' },
        DEAL_DESC: { type: 'object' },
        DealDetails: { type: 'string' },
        REBATE_DISTI: { type: 'string' },
        //DIVISION_APPROVED_LIMIT: { type: 'string' },
        ECAP_PRICE: { type: 'object' },
        REBATE_TYPE: { type: 'string' },
        END_CUSTOMER_RETAIL: { type: 'string' },
        END_DT: { type: 'date' },
        TRGT_RGN_CHK: { type: 'object' },
        IDMS_SHEET_COMMENT: { type: 'string' },
        DEAL_COMB_TYPE: { type: 'string' },
        LINKED_IND: { type: 'number' },
        MRKT_SEG_COMBINED: { type: 'string' },
        DEAL_MEETCOMP_TEST_FAIL_OVERRIDE: { type: 'string' },
        DEAL_MEETCOMP_TEST_RESULT: { type: 'string' },
        ON_ADD_DT: { type: 'date' },
        REBATE_OA_MAX_AMT: { type: 'number' },
        REBATE_OA_MAX_VOL: { type: 'number' },
        PAYOUT_BASED_ON: { type: 'string' },
        PRD_NM_COMBINED: { type: 'string' },
        PROGRAM_PAYMENT: { type: 'string' },
        PROGRAM_TYPE: { type: 'object' },
        QLTR_PROJECT: { type: 'string' },
        REBATE_DEAL_ID: { type: 'string' },
        SERVER_DEAL_TYPE: { type: 'string' },
        DEAL_STG_CD: { type: 'string' },
        DEAL_TYPE_CD: { type: 'string' },
        START_DT: { type: 'date' },
        Status: { type: 'string' },
        TRGT_RGN: { type: 'object' },
        TOTAL_DOLLAR_AMOUNT: { type: 'object' },
        TRKR_NBR: { type: 'object' }
    };

    dealUtil.columns = [
        {
            field: "_status", title: "Status", group: "Deal Common", encoded: true, locked: false, sortable: false, filterable: false, hidden: false, width: 28,
            template: '# var id=dealUtil.safeDealId(DealId); # <div id="status_#=id#" uid="#=id#" data-bind="visible: _dirty" class="glyphicon glyphicon-floppy-disk"></div>',
            headerTemplate: '<div class="glyphicon glyphicon-floppy-disk"></div>', editable: false
        },
        {
            field: "_linked", title: "Linked", group: "Deal Common", encoded: false, locked: false, sortable: false, filterable: false, hidden: false, width: 28,
            template: '<input type="checkbox" id="_linked#=uid#" class="_linked" uid="#=uid#" />',
            headerTemplate: '<i class="fa fa-link"></i>', editable: false
            //template: '<input type="checkbox" data-bind="checked: _linked" uid="#=uid#" />',
        },
        //{
        //    field: "Deal Details", title: "Deal Details", group: "Deal Common", encoded: false, locked: true, sortable: false, filterable: false, hidden: false, width: 250,
        //    template: '<div id="dealdetails#= dealUtil.safeDealId(DealId) #">#= dealUtil.GetTemplateDealSummary(data) #</div>',
        //    headerTemplate: '<a href="\\#">Deal Details</a>', editable: true
        //},

        { field: "DealId", title: "Deal Id", width: "70px", editable: false },
        { field: "DEAL_TYPE_CD", title: "Deal Type", width: "100px" },
        { field: "DEAL_SUB_TYPE_CD", title: "Deal Sub Type", width: "80px" },
        { field: "DEAL_STG_CD", title: "Deal Stage", width: "80px" },
        { field: "START_DT", title: "Start Date", width: "80px", format: "{0:MM/dd/yyyy}" },
        { field: "END_DT", title: "End Date", width: "80px", format: "{0:MM/dd/yyyy}" },
        { field: "CUSTOMER.CUST_DIV_NM", title: "Customer", width: "100px" },
        { field: "TRKR_NBR", title: "Tracker Number", group: "Deal Common", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 130, editable: false },
        { field: "MRKT_SEG_COMBINED", title: "Market Segment", group: "Deal Common", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 200, editable: true },
        { field: "BACK_DATE_RSN", title: "Backdate Reason", group: "BackDate / Consumption", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 140, editable: true, editor: dealUtil.lookupEditor },
        { field: "PRD_NM_COMBINED", title: "Products", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 200, editable: true },

        {
            field: "Schedule",
            title: "Schedule",
            width: "300px",
            headerTemplate: "Schedule Window",
            template: '#=dealUtil.getSchedule(data)#',
            editor: dealUtil.getScheduleEdit
        },

        { field: "TRGT_RGN_CHK", title: "Geo", group: "All Deals", encoded: true, locked: false, sortable: false, filterable: false, hidden: false, width: 80, editable: true },
        { field: "TRGT_RGN", title: "Target Region", group: "All Deals", encoded: true, locked: false, sortable: false, filterable: false, hidden: false, width: 150, editable: true },
        { field: "PROGRAM_PAYMENT", title: "Program Payment", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 105, editable: true },
        { field: "END_CUSTOMER_RETAIL", title: "End Customer/Retail", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true },
        { field: "C2A_DATA_C2A_ID", title: "C2A ID", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true },
        { field: "REBATE_OA_MAX_VOL", title: "Overarching Maximum Volume", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, editable: true },
        { field: "REBATE_OA_MAX_AMT", title: "Overarching Maximum Dollar", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 180, editable: true },
        { field: "REBATE_DEAL_ID", title: "Rebate Deal ID", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 120, editable: true },
        { field: "REBATE_DISTI", title: "Disti Name", group: "All Deals", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, editable: true },
        //{ field: "CONSUMPTION_REASON_CMNT", title: "Consumption Reason Comment", group: "BackDate / Consumption", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 200, editable: true },
        //{ field: "CONSUMPTION_REASON", title: "Consumption Reason", group: "BackDate / Consumption", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 150, editable: true, editor: dealUtil.lookupEditor },
        { field: "PAYOUT_BASED_ON", title: "Payout Based On", group: "Payout Based On", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true, editor: dealUtil.lookupEditor },
        { field: "REBATE_BILLING_START", title: "Billing START Date (for Consumption)", group: "Payout Based On", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 240, format: "{0:MM/dd/yyyy}", editable: true },
        { field: "REBATE_BILLING_END", title: "Billing END Date (for Consumption)", group: "Payout Based On", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 220, format: "{0:MM/dd/yyyy}", editable: true },
        { field: "CS_SHIP_AHEAD_STRT_DT", title: "CS Ship Ahead Start Date", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true, editor: dealUtil.lookupEditor },
        { field: "CS_SHIP_AHEAD_END_DT", title: "CS Ship Ahead End Date", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true, editor: dealUtil.lookupEditor },
        { field: "QLTR_TERMS", title: "Additional Terms And Condition", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true },
        { field: "QLTR_PROJECT", title: "Project", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, editable: true },
        { field: "ECAP_TYPE", title: "Ecap Type", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 90, editable: true, editor: dealUtil.lookupEditor },
        //{ field: "DIVISION_APPROVED_LIMIT", title: "Division Approved Limit", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 90, editable: true, editor: dealUtil.lookupEditor },
        { field: "VOLUME", title: "Ceiling Volume", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 80, format: "{0:n0}", editable: true },
        { field: "SERVER_DEAL_TYPE", title: "Server Deal Type ", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, editable: true },
        { field: "IDMS_SHEET_COMMENT", title: "IDMS Sheet Comment", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 150, editable: true },
        { field: "ECAP_PRICE", title: "Ecap Price", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 90, format: "{0:c}", editable: true },
        { field: "CAP", title: "CAP", group: "ECAP Only", encoded: false, locked: false, sortable: false, filterable: false, hidden: false, width: 80, editable: true },
        { field: "ON_ADD_DT", title: "On Ad Date", group: "ECAP Only", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, format: "{0:MM/dd/yyyy}", editable: true },
        { field: "COMPETITIVE_PRODUCT_CPU", title: "Comp Product CPU", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 220, editable: true, editor: dealUtil.lookupEditor },
        { field: "COMP_PRODUCT_CPU_OTHER", title: "Comp Product CPU other", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 150, editable: true },
        { field: "COMP_PRICE_CPU", title: "Comp Price CPU", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, format: "{0:c}", editable: true },
        { field: "COMPETITIVE_PRODUCT_CS", title: "Comp Product CS", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 220, editable: true, editor: dealUtil.lookupEditor },
        { field: "COMP_PRODUCT_CS_OTHER", title: "Comp Product CS other", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 150, editable: true },
        { field: "COMP_PRICE_CS", title: "Comp Price CS", group: "Competitive", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 100, format: "{0:c}", editable: true },
        { field: "TOTAL_DOLLAR_AMOUNT", title: "Total Dollar Amount", group: "Program, Vol Tier, Cap Band", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 200, format: "{0:c}", editable: true },
        { field: "PROGRAM_TYPE", title: "Program Type", group: "Program, Vol Tier, Cap Band", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, editable: true, editor: dealUtil.lookupEditor },
        { field: "DEAL_DESC", title: "Deal Description", group: "Program, Vol Tier, Cap Band", encoded: true, locked: false, sortable: true, filterable: false, hidden: false, width: 100, editable: true },
        { field: "DEAL_COST_TEST_RESULT", title: "Cost Test Result", group: "Legal Folder", encoded: true, locked: false, sortable: true, filterable: true, hidden: false, width: 70, editable: true },
        { field: "DEAL_COST_TEST_FAIL_OVERRIDE", title: "Cost Test Override", group: "Legal Folder", encoded: false, locked: false, sortable: false, filterable: false, hidden: false, width: 70, editable: true },
        { field: "DEAL_MEETCOMP_TEST_RESULT", title: "Meet Comp Results", group: "Legal Folder", encoded: false, locked: false, sortable: false, filterable: false, hidden: false, width: 70, editable: true },
        { field: "DEAL_MEETCOMP_TEST_FAIL_OVERRIDE", title: "Meet Comp Override", group: "Legal Folder", encoded: false, locked: false, sortable: false, filterable: false, hidden: false, width: 70, editable: true }
    ];
}

dealUtil.generateGrid = function (data) {
    var grd = "";
    grd += '<div data-role="grid"';
    grd += ' data-editable="true"';
    grd += ' data-resizable="true"';
    grd += ' data-sortable="true"';
    grd += ' data-scrollable="true"';
    grd += ' data-filterable="true"';
    grd += ' data-groupable="true"';
    grd += ' data-pageable="{ refresh: true, pageSizes: [25, 50, 100, 250] }"';
    grd += ' data-navigatable="true"';
    grd += ' data-columns=\'' + kendo.stringify(dealUtil.columns) + '\'';
    grd += ' data-bind="source: dealData, events: {edit: onEdit, save: onSave, dataBound: onDataBound}"';
    grd += ' class="smDealGrid" id="' + dealUtil.gridRef.replace("#","") + '"></div>';
    
    $(dealUtil.gridContainer).html(grd);

    dealUtil.generateViewModel(data);
    dealUtil.applyCustomEditors();

    $(window).resize(function () {
        dealUtil.resizeGridContent();
    });

    window.setTimeout(function () {
        dealUtil.resizeGridContent();
        $(dealUtil.gridRef).data("kendoGrid").refresh();
    }, 50);

}

dealUtil.renderGridByDealIds = function (dealIds) {
    window.setTimeout(function () {
        if (!(dealUtil.retrievingDataFunc === null || dealUtil.retrievingDataFunc === undefined)) dealUtil.retrievingDataFunc();
    }, 50);

    var data = new Object();
    data.DraftDealIds = null;
    data.DealIds = dealIds;
    data.PricingTableIds = null;
    data.RebateStrategyIds = null;
    //debugger;

    op.ajaxPostAsync(dealUtil.getDealsUrl, data, function (data) {
        if (!(dealUtil.retrievedDataFunc === null || dealUtil.retrievedDataFunc === undefined)) dealUtil.retrievedDataFunc();

        //debugger;
        window.setTimeout(function () {
            dealUtil.generateGrid(data);
            window.setTimeout(function () {
                if (!(dealUtil.processedDataFunc === null || dealUtil.processedDataFunc === undefined))  dealUtil.processedDataFunc();
            }, 50);
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to retrieve Deals");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataLoadFunc === null || dealUtil.errorOnDataLoadFunc === undefined))  dealUtil.errorOnDataLoadFunc();
        }, 50);
    });
}

dealUtil.formatDates = function(deals) {
    var dateAtrbs = [];
    Object.keys(dealUtil.model).forEach(function (key, index) {
        if (this[key].type === "date" || key.slice(-3) === "_DT") dateAtrbs.push(key);
    }, dealUtil.model);

    for (var d = 0; d < deals.length; d++) {
        for (var k = 0; k < dateAtrbs.length; k++) {
            if (deals[d][dateAtrbs[k]] !== "") {
                deals[d][dateAtrbs[k]] = moment(deals[0][dateAtrbs[k]]).format("MM/DD/YYYY");
            }
        }
    }
    return deals;
}

dealUtil.saveDeals = function (deals) {
    window.setTimeout(function () {
        if (!(dealUtil.savingDataFunc === null || dealUtil.savingDataFunc === undefined)) dealUtil.savingDataFunc();
    }, 50);

    dealUtil.formatDates(deals);

    op.ajaxPostAsync(dealUtil.saveDealsUrl, deals, function (data) {
        //debugger;
        window.setTimeout(function () {
            if (!(dealUtil.savedDataFunc === null || dealUtil.savedDataFunc === undefined)) dealUtil.savedDataFunc();
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Deals");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataSaveFunc === null || dealUtil.errorOnDataSaveFunc === undefined)) dealUtil.errorOnDataSaveFunc();
        }, 50);
    });
}

dealUtil.validateDealsByIds = function (dealIds) {
    window.setTimeout(function () {
        if (!(dealUtil.validatingDataFunc === null || dealUtil.validatingDataFunc === undefined)) dealUtil.validatingDataFunc();
    }, 50);

    dealUtil.validationResults = null;
    dealUtil.validationQty = dealIds.length;

    op.ajaxPostAsync(dealUtil.validateDealsByIdUrl, dealIds, function (data) {
        //debugger;
        dealUtil.validationResults = data;
        window.setTimeout(function () {
            if (!(dealUtil.validatedDataFunc === null || dealUtil.validatedDataFunc === undefined)) dealUtil.validatedDataFunc();
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Deals");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataValidationFunc === null || dealUtil.errorOnDataValidationFunc === undefined)) dealUtil.errorOnDataValidationFunc();
        }, 50);
    });
}
dealUtil.validateDeals = function (deals) {
    window.setTimeout(function () {
        if (!(dealUtil.validatingDataFunc === null || dealUtil.validatingDataFunc === undefined)) dealUtil.validatingDataFunc();
    }, 50);

    dealUtil.validationResults = null;
    dealUtil.validationQty = deals.length;
    dealUtil.formatDates(deals);

    op.ajaxPostAsync(dealUtil.validateDealsUrl, deals, function (data) {
        //debugger;
        dealUtil.validationResults = data;
        window.setTimeout(function () {
            if (!(dealUtil.validatedDataFunc === null || dealUtil.validatedDataFunc === undefined)) dealUtil.validatedDataFunc();
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Deals");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataValidationFunc === null || dealUtil.errorOnDataValidationFunc === undefined)) dealUtil.errorOnDataValidationFunc();
        }, 50);
    });
}
dealUtil.displayValidationResults = function() {
    if (dealUtil.validationResults === null || dealUtil.validationResults === undefined) return;

    var data = [];
    for (var i = 0; i < dealUtil.validationResults.Messages.length; i++) {
        var item = dealUtil.validationResults.Messages[i];
        data.push({
            ExtraDetails: item.ExtraDetails,
            Message: item.Message,
            DealNbr: item.KeyIdentifiers[1]
        });
    }


    var dealUtilValidationContainer = $("#dealUtilValidationContainer");

    var msg = (data.length === 0)
        ? "All " + data.length + " deal(s) passed Validation!!!"
        : "There are " + data.length + " out of " + dealUtil.validationQty + " deals failing validation.";

    var bdy = "<div id='dealUtilValidationContainer'><div id='dealUtilValidationMsg'></div><div id='dealUtilValidationGrid'></div></div>";

    if (dealUtilValidationContainer === null || dealUtilValidationContainer === undefined || dealUtilValidationContainer.length === 0) {
        $("#modals").append(bdy);
    }

    var myWindow = $("#dealUtilValidationContainer");

    myWindow.kendoWindow({
        width: "600px",
        height: "320px",
        title: "Deal Validation Results",
        actions: ["Close"]
    });

    myWindow.data("kendoWindow").open();
    myWindow.data("kendoWindow").center();


    $("#dealUtilValidationMsg").html(msg);

    //debugger;
    window.setTimeout(function () {

        $("#dealUtilValidationGrid").kendoGrid({
            dataSource: {
                data: data,
                schema: {
                    model: {
                        fields: {
                            DealNbr: { type: "number" },
                            ExtraDetails: { type: "string" },
                            Message: { type: "string" }
                        }
                    }
                },
                group: { field: "DealNbr" }
            },
            height: 300,
            sortable: true,
            filterable: true,
            columns: [
                { field: "ExtraDetails", title: "Fields", width: "100px" },
                { field: "Message", title: "Message" }
            ]
        });

    }, 50);
}


// Find/Load a contract (single one)
dealUtil.findContract = function (contract) {
    window.setTimeout(function () {
        if (!(dealUtil.savingDataFunc === null || dealUtil.savingDataFunc === undefined)) dealUtil.savingDataFunc();
    }, 50);

    op.ajaxGetAsync(dealUtil.findContractUrl + "/" + contract.CNTRCT_SID, function (data) {
        //debugger;
        if (data === undefined || data === null) alert("Your contract was not found and the load failed.");
        else alert("I found your contract and loaded it's data.");

        window.setTimeout(function () {
            if (!(dealUtil.savedDataFunc === null || dealUtil.savedDataFunc === undefined)) dealUtil.savedDataFunc(data);
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to find the Contract");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataSaveFunc === null || dealUtil.errorOnDataSaveFunc === undefined)) dealUtil.errorOnDataSaveFunc();
        }, 50);
    });
}

// Save a contract
dealUtil.saveContract = function (contract) {
    dealUtil.saveContracts([contract]);
}

dealUtil.saveContracts = function (contracts) {
    window.setTimeout(function () {
        if (!(dealUtil.savingDataFunc === null || dealUtil.savingDataFunc === undefined)) dealUtil.savingDataFunc();
    }, 50);

    op.ajaxPostAsync(dealUtil.saveContractUrl, contracts, function (data) {
        //debugger;
        window.setTimeout(function () {
            if (!(dealUtil.savedDataFunc === null || dealUtil.savedDataFunc === undefined)) dealUtil.savedDataFunc(data);
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Contract");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataSaveFunc === null || dealUtil.errorOnDataSaveFunc === undefined)) dealUtil.errorOnDataSaveFunc();
        }, 50);
    });
}

dealUtil.saveFullContract = function (fullContracts) {
    window.setTimeout(function () {
        if (!(dealUtil.savingDataFunc === null || dealUtil.savingDataFunc === undefined)) dealUtil.savingDataFunc();
    }, 50);

    op.ajaxPostAsync(dealUtil.saveFullContractUrl, fullContracts, function (data) {
        //debugger;
        window.setTimeout(function () {
            if (!(dealUtil.savedDataFunc === null || dealUtil.savedDataFunc === undefined)) dealUtil.savedDataFunc(data);
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Contract");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataSaveFunc === null || dealUtil.errorOnDataSaveFunc === undefined)) dealUtil.errorOnDataSaveFunc();
        }, 50);
    });
}

dealUtil.savePricingStrategy = function (pricingStrategy) {
    dealUtil.savePricingStrategies([pricingStrategy]);
}

dealUtil.savePricingStrategies = function (pricingStrategies) {
    window.setTimeout(function () {
        if (!(dealUtil.savingDataFunc === null || dealUtil.savingDataFunc === undefined)) dealUtil.savingDataFunc();
    }, 50);

    op.ajaxPostAsync(dealUtil.savePricingStrategyUrl, pricingStrategies, function (data) {
        //debugger;
        window.setTimeout(function () {
            if (!(dealUtil.savedDataFunc === null || dealUtil.savedDataFunc === undefined)) dealUtil.savedDataFunc(data);
        }, 50);
    }, function (xhr) {
        //debugger;
        op.notifyError(xhr.statusText, "Unable to save Pricing Strategy");
        window.setTimeout(function () {
            if (!(dealUtil.errorOnDataSaveFunc === null || dealUtil.errorOnDataSaveFunc === undefined)) dealUtil.errorOnDataSaveFunc();
        }, 50);
    });
}

dealUtil.applyCustomEditors = function () {
    var cols = $(dealUtil.gridRef).data("kendoGrid").columns;

    var customerEditors = {};
    for (var c = 0; c < dealUtil.columns.length; c++) {
        if (dealUtil.columns[c].editor !== undefined && dealUtil.columns[c].editor !== "") {
            customerEditors[dealUtil.columns[c].field] = dealUtil.columns[c].editor;
        }
    }

    for (c = 0; c < cols.length; c++) {
        if (customerEditors[cols[c].field] !== undefined) {
            cols[c].editor = customerEditors[cols[c].field];
        }
    }
}

dealUtil.generateViewModel = function (data) {
    dealUtil.viewModel = kendo.observable({
        dealData: new kendo.data.DataSource({
            schema: {
                model: {
                    id: "DealId",
                    fields: dealUtil.model
                }
            },
            batch: true,
            data: data,
            pageSize: 50
        }),
        onEdit: function (e) {
            var fieldName = e.container.find("input[name]").attr("name");
            if (!dealUtil.CanEditAtrb(fieldName, e.model)) {
                $(dealUtil.gridRef).data("kendoGrid").closeCell();
            }
        },
        onSave: function (e) {
            var grid = $(dealUtil.gridRef).data("kendoGrid");
            var data = e.data.dealData.data();
            var dataItem = e.model;

            var cols = grid.columns;
            var colLocked = [];
            for (var c = 0; c < cols.length; c++) {
                if (cols[c].locked !== undefined && cols[c].locked)
                    colLocked.push(cols[c].field);
            }
            dealUtil.numLockedCols = colLocked.length;

            if ($("#_linked" + dataItem.uid).is(':checked')) {
                for (var key in e.values) {
                    if (e.values.hasOwnProperty(key)) {
                        for (var d = 0; d < data.length; d++) {
                            if ($("#_linked" + data[d].uid).is(':checked') && data[d].uid !== dataItem.uid) {
                                if (key.indexOf("Schedule") < 0) {
                                    data[d][key] = e.values[key];
                                } else {
                                    // RIGHT NOW THIS ONLY WORKS FOR A SINGLE SCHEDULE
                                    // IF DEALS CAN HAVE MULTIPLE SCHEDULES... THIS WILL NEED TO CHANGE
                                    if (data[d].DEAL_TYPE_CD === dataItem.DEAL_TYPE_CD) {
                                        data[d].Schedule.data = dataItem.Schedule.data;

                                        var evalStr = "data[d]." + key + " = '" + e.values[key] + "'";
                                        eval(evalStr);
                                    }
                                }
                                data[d]._dirty = true;

                                var row = grid.tbody.find("tr[data-uid='" + data[d].uid + "']");
                                // can do an entire row refresh here becaue we are NOT in focus of the row
                                dealUtil.kendoFastRedrawRow(grid, row, colLocked);
                            }
                        }
                    }                     
                }
            }
            dataItem.set('_dirty', true);
            //var row = grid.tbody.find("tr[data-uid='" + dataItem.uid + "']");

            //window.setTimeout(function () {
            //    dealUtil.kendoFastRedrawRow(grid, row, colLocked);
            //}, 50);
        },
        onDataBound: function (e) {
            dealUtil.setDataSource();
        }
    });
    kendo.bind($(dealUtil.gridContainer), dealUtil.viewModel);
}

dealUtil.catchError = function (e) {
    //debugger;
    return dealUtil.errorCell;
}

dealUtil.safeDealId = function (dealId) {
    return dealId;
}

dealUtil.getSchedule = function (data) {
    var cols = dealUtil.schedCols[data.DEAL_TYPE_CD.replace(" ","")];
    if (cols === undefined || cols === null) return "";
    var curTier = 0;
    var numTiers = parseInt(data.NUM_OF_TIERS);
    var aBuf = [];

    var buf = "<table class='smTable'><thead><tr>";
    for (var c = 0; c < cols.length; c++) {
        buf += kendo.format("<th style='text-align: right;'>{0}</th>", cols[c].title);
    }
    buf += "</tr>";

    /// set to [1] for now because TIER_NBR is keyed differently
    Object.keys(data[cols[1].field]).forEach(function (key, index) {
        if (key[0] !== '_' && key !== "uid" && key !== "parent") {
            curTier++;

            /// temp fix until TIER_NBR is keyed differently
            if (curTier <= numTiers) {
                var tmpBuf = "";
                for (var c = 0; c < cols.length; c++) {
                    /// temp fix until TIER_NBR is keyed differently
                    var useKey = (c === 0) ? key.split('/')[1] : key;
                    tmpBuf += kendo.format("<td style='padding: 2px;text-align: right;'>{0}</td>", data[cols[c].field][useKey]);
                }
                aBuf.push("<tr>" + tmpBuf + "</tr>");
            }
        }
    }, data[cols[0].field]);

    aBuf = aBuf.sort();
    for (var a = 0; a < aBuf.length; a++) {
        buf += aBuf[a];
    }

    buf += "</table>";
    return buf;
}

dealUtil.getScheduleEdit = function (container, options) {
    var cols = dealUtil.schedCols[options.model.DEAL_TYPE_CD.replace(" ", "")];
    if (cols === undefined || cols === null) return "";
    var curTier = 0;
    var numTiers = parseInt(options.model.NUM_OF_TIERS);
    var aBuf = [];

    var buf = "<table class='smTable'><thead><tr>";
    for (var c = 0; c < cols.length; c++) {
        buf += kendo.format("<th style='text-align: right; padding-right: 6px;'>{0}</th>", cols[c].title);
    }
    buf += "</thead></tr>";

    ///// set to [1] for now because TIER_NBR is keyed differently
    Object.keys(options.model[cols[1].field]).forEach(function (key, index) {
        if (key[0] !== '_' && key !== "uid" && key !== "parent") {
            curTier++;

            /// temp fix until TIER_NBR is keyed differently
            if (curTier <= numTiers) {
                var tmpBuf = "";
                for (var c = 0; c < cols.length; c++) {
                    /// temp fix until TIER_NBR is keyed differently
                    var useKey = (c === 0) ? key.split('/')[1] : key;

                    if (options.model._readonly.indexOf(cols[c].field) >= 0 || cols[c].field === "TIER_NBR") {
                        tmpBuf += kendo.format("<td style='text-align: right;'>{0}</td>", options.model[cols[c].field][useKey]);
                    } else {
                        tmpBuf += kendo.format("<td><input data-bind='value: {0}[\"{1}\"]' style='width: 95%; text-align: right; line-height: 1em; padding-right: 4px;' class='k-textbox'/></td>", cols[c].field, useKey);
                    }
                }
                aBuf.push("<tr>" + tmpBuf + "</tr>");
            }
        }
    }, options.model[cols[0].field]);

    aBuf = aBuf.sort();
    for (var a = 0; a < aBuf.length; a++) {
        buf += aBuf[a];
    }

    buf += "</table>";

    $(buf).appendTo(container);
}

dealUtil.GetTemplateDealSummary = function (data) {
    var st = moment(data.START_DT).format("MM/DD/YYYY");
    var en = moment(data.END_DT).format("MM/DD/YYYY");
    var cust = (data.CUSTOMER === undefined) ? "" : data.CUSTOMER.CUST_DIV_NM;
    var dealtype = (data.DEAL_TYPE_CD === undefined) ? "" : data.DEAL_TYPE_CD;

    var trkr = "<div style='width: 25px !important; float: right; padding-left: 8px;'>" + ((data.HasTracker + "" === "true") ? "<i class='fa fa-paw' title='Deal has a tracker number'></i>" : "&nbsp;") + "</div>";
    var flg = "<div style='width: 25px !important; float: right; padding-left: 8px;'>" + dealUtil.getStageFlagIcon(data.DEAL_STG_CD) + "</div>";

    // If it is not a real deal, don't make a link to it...
    var dealLink = (data.DealId.toString().indexOf("(") >= 0 || data.DealId.toString().indexOf("-") >= 0)
        ? data.DealId
        : "<a href='/DealDetails/" + dealUtil.safeDealId(data.DealId, true) + "/Primary' target='_blank'><strong><span class='dealIdSpan'>" + data.DealId + "</span></strong></a>";

    var top = "<div style='float: left; font-weight: bold; margin-left: 8px;'>" + dealLink + " - " + data.DEAL_TYPE_CD + "</div><div class='fl'> / " + data.DEAL_SUB_TYPE_CD + "</div><div style='float: right; font-size: 9px; color: #666666;'>" + data.DEAL_STG_CD + flg + "</div>";
    var bottom = "<div style='float: left; margin-left: 8px;'>" + cust + "</div><div style='float: right; font-size: 9px; color: #666666;'>" + st + " - " + en + trkr + "</div>";
    return "<div class='dealcolor" + dealtype.replace(/ /g, "") + "' did='" + data.DealId + "' >" + top + "<div class='clearboth'></div>" + bottom + "</div>";
}

dealUtil.getStageFlagIcon = function (stage) {
    if (stage === "Active")
        return "<div class='glyphicon glyphicon-flag' style='color: green;'></div>";

    if (stage === "Expired" || stage === "Cancelled" || stage === "Customer_Declined")
        return "<div class='glyphicon glyphicon-flag' style='color: black;'></div>";

    return "<div class='glyphicon glyphicon-flag' style='color: #666600;'></div>";
}

dealUtil.lookupEditor = function (container, options) {
    var dealtype = options.model.DEAL_TYPE_CD;
    if (dealtype === undefined || dealtype === null) dealtype = "ALL";

    var url = kendo.format("api/Dropdown/GetDropdowns/{0}/{1}", dealtype, options.field);
    $('<input data-text-field="DROP_DOWN" data-value-field="DROP_DOWN" name="' + options.field + '" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: false,
            dataSource: {
                type: "json",
                transport: {
                    read: url
                }
            }
        });
}

dealUtil.kendoFastRedrawRow = function (grid, row, colLocked) {
    // Updates a single row in a kendo grid without firing a databound event.
    // This is needed since otherwise the entire grid will be redrawn.

    var dataItem = grid.dataItem(row);

    // record linked value... it is NOT part of the dataItem
    var isLinked = $("#_linked" + dataItem.uid).is(':checked');
    var rowChildren = $(row).children('td[role="gridcell"]');

    var cols = [];
    for (var c = 0; c < grid.columns.length; c++) {
        if (colLocked.indexOf(grid.columns[c].field) < 0)
            cols.push(grid.columns[c]);
    }

    for (var i = 0; i < cols.length; i++) {

        var column = cols[i];
        var template = column.template;
        var cell = rowChildren.eq(i);

        if (template !== undefined) {
            var kendoTemplate = kendo.template(template);

            // Render using template
            cell.html(kendoTemplate(dataItem));
        } else {
            var fieldValue = dataItem[column.field];

            var format = column.format;
            var values = column.values;

            if (values !== undefined && values != null) {
                // use the text value mappings (for enums)
                for (var j = 0; j < values.length; j++) {
                    var value = values[j];
                    if (value.value == fieldValue) {
                        cell.html(value.text);
                        break;
                    }
                }
            } else if (format !== undefined) {
                // use the format
                cell.html(kendo.format(format, fieldValue));
            } else {
                // Just dump the plain old value
                cell.html(fieldValue);
            }
        }
    }

    $("#_linked" + dataItem.uid).prop('checked', isLinked);
}

dealUtil.resizeGridContent = function () {
    var gridElement = $(dealUtil.gridRef);
    var height = $(window).height() - dealUtil.gridPaddingOffset;

    var dataArea = gridElement.find(".k-grid-content");
    var gridKendo = gridElement.data("kendoGrid");
    if (gridKendo === null || gridKendo === undefined) return;

    dataArea.height(height);
    gridElement.height(height);
    kendo.resize(gridElement);
}

dealUtil.markCellReadOnly = function (cell) {
    cell.addClass("readonly");
}

dealUtil.markCellEditable = function (cell) {
    cell.removeClass("readonly");
}

dealUtil.markCellRequired = function (cell) {
    if (!cell.hasClass("readonly"))
        cell.addClass("required");
}

dealUtil.markCellNotRequired = function (cell) {
    cell.removeClass("required");
}

dealUtil.setDataSource = function () {
    var grid = dealUtil.grid();
    //var dataSource = grid.dataSource;
    
    //this.element.find('tr.k-master-row').each(function () {
    //    var row = $(this);
    //    var data = dataSource.getByUid(row.data('uid'));

    //    if (data.get('DealId').indexOf("(") >= 0) {
    //        row.find('.k-hierarchy-cell a').css({ opacity: 0.3, cursor: 'default' }).click(function (e) { e.stopImmediatePropagation(); return false; });
    //    }
    //});

    var indx = 0;
    var col2IndxMapping = {};
    $.each(grid.columns, function () {
        var col = this;
        col2IndxMapping[col.field] = indx++;
    });

    var model = dealUtil.model;
    var dataItems = grid.dataSource.data();

    for (var x = 0; x < dataItems.length; x++) {
        var dataItem = dataItems[x];
        var tr = $(dealUtil.gridRef).find("[data-uid='" + dataItem.uid + "']");
        //dealUtil.updateAttachments(dataItem);

        for (var key in model) {
            if (dataItem.hasOwnProperty(key) && col2IndxMapping[key] !== undefined) {
                if (dataItem[key] === null || dataItem[key] === undefined) dataItem[key] = "";

                var cell = $("td[role='gridcell']:nth-child(" + (col2IndxMapping[key] + (1 - dealUtil.numLockedCols)) + ")", tr);

                if (!dealUtil.CanEditAtrb(key, dataItem)) {
                    dealUtil.markCellReadOnly(cell);
                } else {
                    dealUtil.markCellEditable(cell);
                }

                if (dealUtil.IsRequiredAtrb(key, dataItem)) {
                    dealUtil.markCellRequired(cell);
                } else {
                    dealUtil.markCellNotRequired(cell);
                }
            }
        }
    }

    dealUtil.setDealTypeColors();
}

dealUtil.setDealTypeColors = function () {
    var aDealType = ["ECAP", "PROGRAM", "VOL_TIER", "CAP_BAND"];
    for (var d = 0; d < aDealType.length; d++) {
        $(".k-grid-content-locked>table>tbody>tr>td>div>div.dealcolor" + aDealType[d]).each(function () {
            $(this).parent().parent().removeClass("readonly");
            $(this).parent().parent().addClass("dealcolor" + aDealType[d]);
        });
    }
}

dealUtil.CanEditAtrb = function (atrbCd, dataItem) {
    var doNotEdit = ["DealId", "Agreement", "HasTracker", "DEAL_TYPE_CD", "DEAL_STG_CD", "CommentHistory", "PRD_NM_COMBINED", "_linked", "_status"];
    var doEdit = ["COMMENTS"];

    try {
//        if (!dataItem._settings["C_EDIT_CONTRACT"] && !doEdit.contains(atrbCd)) return false;
//        if (dataItem.saving !== undefined && dataItem.saving !== null && dataItem.saving === true) return false;

        if (atrbCd[0] === '_' || doNotEdit.indexOf(atrbCd) >= 0) return false;

        if (dataItem._readonly.indexOf(atrbCd) >= 0) return false;

        var dealAtrbs = dealUtil.dealTypeAtrbs[dataItem.DEAL_TYPE_CD];
        if (dealAtrbs !== undefined && dealAtrbs !== null && (dealAtrbs.indexOf(atrbCd) < 0)) {
            return false;
        }
        if (dataItem["DEAL_STG_CD"] !== undefined && dataItem["DEAL_STG_CD"] === "Draft") return true;
    } catch (e) {
        util.log(e.message);
        return false;
    }
    return true;
}

dealUtil.IsRequiredAtrb = function (atrbCd, dataItem) {
    try {
        if (dataItem._required.indexOf(atrbCd) >= 0) return true;
        //var dealAtrbs = dealUtil.dealTypeAtrbs[dataItem.DEAL_TYPE_CD];
        //if (dealAtrbs !== undefined && dealAtrbs !== null && !dealAtrbs.contains(atrbCd)) {
        //    return false;
        //}

        //if (secUtil.ChkAtrbRules("ATRB_REQUIRED", atrbCd, window.opRole, dataItem.DEAL_STG_CD, dataItem.DEAL_TYPE_CD)) return true;
        return false;
    } catch (e) {
        util.log(e.message);
        return false;
    }
    return false;
}

