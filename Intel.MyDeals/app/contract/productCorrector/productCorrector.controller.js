angular
    .module('app.admin')
    .controller('ProductCorrectorModalController', ProductCorrectorModalController);

ProductCorrectorModalController.$inject = ['$filter', '$scope', '$uibModalInstance', 'GetProductCorrectorData', 'ProductSelectorService', 'productCorrectorService', 'contractData', 'RowId', 'ProductRows', '$linq', '$timeout', 'logger', 'gridConstants', '$uibModal', 'CustSid'];

function ProductCorrectorModalController($filter, $scope, $uibModalInstance, GetProductCorrectorData, ProductSelectorService, productCorrectorService, contractData, RowId, ProductRows, $linq, $timeout, logger, gridConstants, $uibModal, CustSid) {
    var vm = this;
    vm.selectedPathParts = [];
    vm.invalidProducts = [];
    vm.suggestedProduct = [];
    vm.items = []; // This will have Different dimension where conflicts arises
    vm.addedProducts = []; // This will hold the product added by the User without conflict
    vm.hideSelection = false; // This will determine when to show Invalid Product(s) and when to show Multiple
    vm.nextRow = nextRow; // This method will help to navigate to next Rows
    vm.prevRow = prevRow; // This method will help to navigate to previous Rows
    vm.clearProducts = clearProducts; // Clear all the selected Products
    vm.selectedDataSet = []; // Container for Selected Data
    //vm.selectionLevel = ''; // Hold current dimension Level
    vm.rows = 0; // will give number of ROW
    vm.currentRow = RowId; // Will Give current ROW Number.. This value is passed from the Parent page
    vm.isMultipleProduct = true; // Any Use Input having Multiple Product(s)
    vm.isInvalidProduct = true; // Any Use Input having Invalid Product(s)
    vm.isNextDisabled = false; // This will enable disable Next Navigation button
    vm.isPrevDisabled = false; // This will enable disable Previous Navigation button
    vm.productSuggestion = productSuggestion;
    vm.saveProducts = saveProducts; // This method actually moved Multiple or invalid product to the Valid products
    vm.addProductSuggested = addProductSuggested; //Added Product from the Suggestion List
    vm.opMode = ''; // To determine its a Duplicate product Ops or InValid Product ops
    vm.hideNavigation = false; // This ill determine when to hide the navigation
    var isConflict = false;
    var _selectionLevel = 0;
    vm.productName = '';
    var _lastConflictedState = 0;
    var lastConflictedColumn = '';
    var pageNumber = [];
    vm.rowNumber = 1;
    vm.resetAddedList = 1;
    var productHierarchy = [];
    vm.breadCumLevel = [];
    vm.showSearchResults = false; // Hide the grid
    vm.selectedProducts = [];
    vm.gridData = [];
    vm.addProducts = addProducts; // This method will add products in Selected List
    vm.suggestedProd = [];
    vm.openCAPBreakOut = openCAPBreakOut;
    vm.selectPath = selectPath; // Click on bread cum
    vm.rowDCId = "";
    vm.isValidCapDetails = isValidCapDetails;
    vm.invalidSuggestionProd = '';
    vm.masterSuggestionList = {
    };

    //Product Selector Modal opener
    vm.openProdSelector = function (row) {
        var pricingTableRow = {
            'START_DT': ProductRows["0"].START_DT,
            'END_DT': ProductRows["0"].END_DT,
            'CUST_MBR_SID': CustSid,
            'GEO_COMBINED': ProductRows["0"].GEO_COMBINED,
            'PTR_SYS_PRD': "",
            'PTR_SYS_INVLD_PRD': "",
            'PROGRAM_PAYMENT': ProductRows["0"].PROGRAM_PAYMENT,
            'PROD_INCLDS': ProductRows["0"].PROD_INCLDS
        };

        var suggestedProduct = {
            'mode': 'auto',
            'prodname': vm.productName
        };

        var modal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productSelector/productSelector.html',
            controller: 'ProductSelectorModalController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: 'prdSelector-modal-window',
            resolve: {
                productSelectionLevels: ['ProductSelectorService', function (ProductSelectorService) {
                    var dtoDateRange = {
                        startDate: pricingTableRow.START_DT, endDate: pricingTableRow.END_DT
                    };
                    return ProductSelectorService.GetProductSelectorWrapper(dtoDateRange).then(function (response) {
                        return response;
                    });
                }],
                pricingTableRow: angular.copy(pricingTableRow),
                enableSplitProducts: function () {
                    return false;
                },
                suggestedProduct: angular.copy(suggestedProduct)
            }
        });
        modal.result.then(
            function (productSelectorOutput) {
                var validateSelectedProducts = productSelectorOutput.validateSelectedProducts;
                for (var key in validateSelectedProducts) {
                    vm.addedProducts.push(validateSelectedProducts[key]["0"]);
                }
            });
    }

    //Page number calculation and navigation
    var generatePagination = function (e) {
        pageNumber = [];
        for (var key in GetProductCorrectorData.ProdctTransformResults) {
            if (!!GetProductCorrectorData.DuplicateProducts[key]) {
                if (pageNumber.indexOf(key) == -1) {
                    pageNumber.push(key);
                }
            }
            if (!!GetProductCorrectorData.InValidProducts[key]) {
                if (GetProductCorrectorData.InValidProducts[key].length > 0) {
                    if (pageNumber.indexOf(key) == -1) {
                        pageNumber.push(key);
                    }
                }
            }
        }

        if (pageNumber.length > 0) {
            vm.rows = pageNumber.length;
            if (vm.rows > vm.rowNumber) {
            }
            if (pageNumber.length != 1) {
                vm.currentRow = pageNumber[vm.rowNumber - 1];
            }
            else {
                vm.currentRow = pageNumber[0];
            }

            updateRowDCID();
        }

        if (vm.rows <= 1) {
            vm.hideNavigation = true;
        }
    }

    function updateRowDCID() {
        $timeout(function () {
            if (ProductRows.length > 1) {
                var currentPricingTableRow = ProductRows[vm.currentRow - 1];
            }
            else {
                var currentPricingTableRow = ProductRows[0];
            }
            vm.rowDCId = currentPricingTableRow.DC_ID;
        }, 10);
    }

    // Invalid Product Grid/////
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.invalidProducts);
            }
        },
        schema: {
            model: {
                fields: {
                    USR_INPUT: {}
                }
            }
        },
        pageSize: 5,
    });

    vm.handleChange = function (data, dataItem, columns) {
        productSuggestion(dataItem);
    };
    vm.gridOptions = {
        dataSource: dataSource,
        filterable: false,
        sortable: false,
        selectable: "row",
        resizable: false,
        groupable: false,
        scrollable: false,
        editable: false,
        pageable: false,
        dataBound: function (e) {
            e.sender.select("tr:eq(1)");
        },
        columns: [
            {
                command: [
                    { name: "destroy", template: "<a class='k-grid-delete deleteOnHover' ng-click='vm.deleteInvalid(dataItem)' title='Click to delete invalid product. Please save changes to prceeed to next product.' style='margin-right: 6px;cursor:pointer'><span class='k-icon k-i-close'></span></a>" }

                ],
                title: "",
                width: "10%"
            },
            { field: "USR_INPUT", template: "#= USR_INPUT #", title: "User Entered Product" },
        ]
    };

    vm.suggestionNotFound = '';

    //Delete item from the InValid List
    vm.deleteInvalid = function (dataItem) {
        for (var j = 0; j < GetProductCorrectorData.InValidProducts[vm.currentRow].length; j++) {
            if (GetProductCorrectorData.InValidProducts[vm.currentRow][j] == dataItem.USR_INPUT) {
                GetProductCorrectorData.InValidProducts[vm.currentRow].splice(j, 1);
            }
        }
        for (var d = 0; d < vm.invalidProducts.length; d++) {
            if (vm.invalidProducts[d].USR_INPUT == dataItem.USR_INPUT) {
                vm.invalidProducts.splice(d, 1);
            }
        }
        if (vm.invalidProducts.length == 0) {
            _selectionLevel = 0;
            productHierarchy = [];
            vm.items = []; // Clear Hierarchy Values
            vm.gridData = [];  // Clear all the GRID data      

            // Reset Suggestion list
            vm.clearSuggedtedProd();

            //Reset Bread cum
            vm.breadCumLevel = [];
            vm.selectedPathParts = [];

            generatePagination(); // Regenerate Pagination

            vm.showSearchResults = 0;

            cookProducts(); // Calling Cook Product to go to next available product
        }        

        dataSource.read();

    }

    // Further suggestion
    vm.selectSuggestion = function (dataItem) {
        vm.suggestionNotFound = dataItem;
        if (dataItem && dataItem.length > 0) {
            var tempString = dataItem;
            // Step 1: Taking first 4 character
            if (tempString.length > 3) {
                if (tempString != tempString.substring(0, 4)) {
                    vm.suggestedProd.push(tempString.substring(0, 4));
                }
            }
            //Step 2: Spliting by "/"
            if (tempString.indexOf('/') != -1) {
                var tempArr = tempString.split('/');
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempString != tempArr[i].replace(/[^\w\s]/gi, '')) {
                        if (vm.suggestedProd.indexOf(tempArr[i].replace(/[^\w\s]/gi, '')) == -1) {
                            vm.suggestedProd.push(tempArr[i].replace(/[^\w\s]/gi, ''));
                        }
                    }
                }
            }

            //Step 3: Spliting by " "
            if (tempString.indexOf(' ') != -1) {
                var tempArr = tempString.split(' ');
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempString != tempArr[i].replace(/[^\w\s]/gi, '')) {
                        if (vm.suggestedProd.indexOf(tempArr[i].replace(/[^\w\s]/gi, '')) == -1) {
                            vm.suggestedProd.push(tempArr[i].replace(/[^\w\s]/gi, ''));
                        }
                    }
                }
            }

            //Step 4: Spliting by "-"
            if (tempString.indexOf('-') != -1) {
                var tempArr = tempString.split('-');
                for (var i = 0; i < tempArr.length; i++) {
                    if (tempString != tempArr[i].replace(/[^\w\s]/gi, '')) {
                        if (vm.suggestedProd.indexOf(tempArr[i].replace(/[^\w\s]/gi, '')) == -1) {
                            vm.suggestedProd.push(tempArr[i].replace(/[^\w\s]/gi, ''));
                        }
                    }
                }
                if (tempArr.length > 0) {
                    if (tempString != tempArr[0] + "-" + tempArr[1].replace(/[^\d-]/gi, '')) {
                        if (vm.suggestedProd.indexOf(tempArr[0] + "-" + tempArr[1].replace(/[^\d-]/gi, '')) == -1) {
                            vm.suggestedProd.push(tempArr[0] + "-" + tempArr[1].replace(/[^\d-]/gi, ''));
                        }
                    }
                }
            }

            //Step 5: Removing all special characters
            if (tempString != tempString.replace(/[^\w\s]/gi, '') && tempString.replace(/[^\w\s]/gi, '').length > 0) {                
                if (vm.suggestedProd.indexOf(tempString.replace(/[^\w\s]/gi, '')) == -1) {
                    vm.suggestedProd.push(tempString.replace(/[^\w\s]/gi, ''));
                }             
            }

            //Step 6 : Remove alphabet from the string
            if (tempString != tempString.replace(/[^\d-]/gi, '') && tempString.replace(/[^\d-]/gi, '').length > 0) {
                if (vm.suggestedProd.indexOf(tempString.replace(/[^\d-]/gi, '')) == -1) {
                    vm.suggestedProd.push(tempString.replace(/[^\d-]/gi, ''));
                }
            }
        }

        if (vm.suggestedProd.length > 0) {
            vm.masterSuggestionList[tempString] = vm.suggestedProd;
        }
    }
    vm.clearSuggedtedProd = function (e) {
        vm.suggestedProd = [];
        delete vm.masterSuggestionList[vm.suggestionNotFound];
    }
    // Suggested Product Grid
    var dataSourceProduct = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.gridData);
            },
        },
        pageSize: 10,
        schema: {
            model: {
                id: "PROD_MBR_SID"
            }
        },
    });

    vm.gridOptionsProduct = {
        dataSource: dataSourceProduct,
        filterable: gridConstants.filterable,
        scrollable: true,
        sortable: true,
        resizable: true,
        reorderable: true,
        pageable: {
            pageSizes: gridConstants.pageSizes,
        },
        enableHorizontalScrollbar: true,
        columns: [
            {
                field: "PCSR_NBR",
                title: "Processor Number",
                template: "#= PCSR_NBR #",
                width: "150px"
            },
            {
                field: "DEAL_PRD_NM",
                title: "Deal Product Name",
                template: "#= DEAL_PRD_NM #",
                width: "180px"
            },
            {
                field: "MTRL_ID",
                title: "Material Id",
                width: "150px"
            },
            {
                field: "PRD_STRT_DTM",
                title: "Product Start Date",
                type: "date",
                template: "#= kendo.toString(new Date(PRD_STRT_DTM), 'M/d/yyyy') #",
                width: "150px"
            },
            {
                field: "CAP_START",
                title: "CAP Availability date",
                template: "<div>{{vm.getFormatedDate(dataItem.CAP_START)}}</div>",
                width: "150px"
            },
            {
                field: "CAP",
                title: "CAP Price",
                width: "150px",
                template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-data='vm.getPrductDetails(dataItem, \"CAP\")'>#= CAP #</op-popover>"
            },
            {
                field: "YCS2",
                title: "YCS2",
                width: "150px",
                template: "<op-popover op-options='YCS2' op-data='vm.getPrductDetails(dataItem, \"YCS2\")'>#= YCS2 #</op-popover>"
            },
            {
                field: "CPU_PROCESSOR_NUMBER",
                title: "CPU Processor number",
                width: "150px"
            },
            {
                field: "FMLY_NM_MM",
                title: "EDW Family Name",
                template: "<div kendo-tooltip k-content='dataItem.FMLY_NM_MM'>{{dataItem.FMLY_NM_MM}}</div>",
                width: "150px"
            },
            {
                field: "EPM_NM",
                title: "EPM Name",
                template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{dataItem.EPM_NM}}</div>",
                width: "180px"
            },
            {
                field: "SKU_NM",
                title: "SKU Name",
                template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{dataItem.SKU_NM}}</div>",
                width: "180px"
            },
            {
                field: "NAND_FAMILY",
                title: "NAND FAMILY",
                width: "150px"
            },
            {
                field: "NAND_Density",
                title: "Nand Density",
                width: "150px"
            },
            {
                field: "CPU_CACHE",
                title: "CPU CACHE",
                width: "150px"
            },
            {
                field: "CPU_PACKAGE",
                title: "CPU PACKAGE",
                width: "150px"
            },
            {
                field: "CPU_WATTAGE",
                title: "CPU WATTAGE",
                width: "150px"
            },
            {
                field: "CPU_VOLTAGE_SEGMENT",
                title: "Voltage Segment",
                width: "150px"
            },
            {
                field: "PRICE_SEGMENT",
                title: "Price Segment",
                width: "150px"
            },
            {
                field: "SBS_NM",
                title: "SBS Name",
                width: "150px"
            },
            {
                field: "MM_CUST_CUSTOMER",
                title: "MM Customer Name",
                width: "150px"
            }
        ]
    }

    vm.getFormatedDate = function (datVal) {
        var date = kendo.toString(new Date(datVal), 'M/d/yyyy');
        if (date == '1/1/0001') {
            return '';
        }
        return date;
    }

    //Getting CAP Product Details for Tooltip
    vm.getPrductDetails = function (dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = ProductRows[vm.currentRow - 1];
        }
        else {
            currentPricingTableRow = ProductRows[0];
        }
        return [{
            'CUST_MBR_SID': CustSid,
            'PRD_MBR_SID': dataItem.PRD_MBR_SID,
            'GEO_MBR_SID': currentPricingTableRow.GEO_COMBINED,
            'DEAL_STRT_DT': currentPricingTableRow.START_DT,
            'DEAL_END_DT': currentPricingTableRow.END_DT,
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }];
    }

    function openCAPBreakOut(dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = ProductRows[vm.currentRow - 1];
        }
        else {
            currentPricingTableRow = ProductRows[0];
        }

        productData = {
            'CUST_MBR_SID': CustSid,
            'PRD_MBR_SID': dataItem.PRD_MBR_SID,
            'GEO_MBR_SID': currentPricingTableRow.GEO_COMBINED,
            'DEAL_STRT_DT': currentPricingTableRow.START_DT,
            'DEAL_END_DT': currentPricingTableRow.END_DT,
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }
        var capModal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productCAPBreakout/productCAPBreakout.html',
            controller: 'ProductCAPBreakoutController',
            controllerAs: 'vm',
            windowClass: 'cap-modal-window',
            size: 'lg',
            resolve: {
                productData: angular.copy(productData),
            }
        });

        capModal.result.then(
            function () {
            },
            function () {
            });
    }

    // Invalid Product Grid/////
    var dataSourceSuggested = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.suggestedProduct);
            }
        },
        schema: {
            model: {
                fields: {
                    HIER_VAL_NM: {},
                    MM_CUST_CUSTOMER: {}
                }
            }
        },
        pageSize: 5,
        serverPaging: true,
        serverSorting: true
    });
    vm.addChange = function (data, dataItem, columns) {
        addProductSuggested(dataItem);
    };

    vm.gridOptionsSuggested = {
        dataSource: dataSourceSuggested,
        filterable: false,
        sortable: false,
        selectable: "row",
        resizable: false,
        groupable: false,
        columnMenu: false,
        scrollable: false,
        editable: false,
        pageable: false,
        columns: [
            { field: "HIER_VAL_NM", title: "Product", template: "<div kendo-tooltip k-content='dataItem.HIER_NM_HASH'>{{dataItem.HIER_VAL_NM}}</div>" },
            { field: "MM_CUST_CUSTOMER", title: "MM Customer", hidden: true },
        ]
    };

    // Hide Column
    function toggleColumnsWhenEmpty(data) {
        var grid = $("#suggestionProdGrid").data("kendoGrid");
        if (!!grid) {
            var isNANDProduct = data.filter(function (x) {
                x.PRD_CAT_NM == 'NAND' || x.PRD_CAT_NM == "NAND (SSD)"
            });
            if (isNANDProduct.length == 0) {
                grid.hideColumn("MM_CUST_CUSTOMER");//hide column
            } else {
                grid.showColumn("MM_CUST_CUSTOMER"); //show column
            }
        }
    }

    function toggleColumnsWhenEmptyConflictGrid(data) {
        var grid = $("#prodGrid").data("kendoGrid");
        if (!!grid) {
            angular.forEach(vm.gridOptionsProduct.columns, function (item, key) {
                var columnValue = $filter('unique')(data, item.field);
                if (columnValue.length == 1 && item.field !== undefined && item.field != "CheckBox" && item.field != 'CAP' && item.field != 'YCS2' &&
                    (columnValue[0][item.field] == "" || columnValue[0][item.field] == null || columnValue[0][item.field] == 'NA')) {
                    grid.hideColumn(item.field);//hide column
                } else {
                    grid.showColumn(item.field); //show column
                }
            });
        }
    }

    // Click on Selected ITEM. Check Next Conflict or Show Product
    vm.selectsearchItem = function (item) {
        var data = GetProductCorrectorData; // assigning data to a local copy

        if (vm.selectedPathParts.indexOf(item.name) == -1) {
            vm.breadCumLevel[_selectionLevel] = item.name; // Generating Tree View
            var tempItem = {
                name: item.name
            }
            vm.selectedPathParts.push(tempItem);
        }
        else {
        }

        lastConflictedColumn = item.name;

        var result = checkNextLevelOfConflict(item); // Checking for conflict

        if (result) {
        }
        else {
            var dataSelected = [];

            //Fetching All the valid product for the selected Hierarchy
            dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                .Where(function (x) {
                    return (x.DEAL_PRD_TYPE == productHierarchy[0] &&
                        x.PRD_CAT_NM == productHierarchy[1] &&
                        x.BRND_NM == productHierarchy[2] &&
                        x.FMLY_NM == productHierarchy[3]
                    );
                })
                .ToArray();
            
            //Calling WEb APi for the Product details...
            ProductSelectorService.GetProductAttributes(dataSelected)
                .then(function (response) {
                    dataSelected = response.data.length > 0 ? response.data : dataSelected;

                    vm.items = [];

                    var flag = 0;

                    // Adding Products to the Selected List
                    angular.forEach(dataSelected, function (value, key) {
                        //Duplicate check
                        vm.showSearchResults = true;
                        if (!$filter("where")(vm.gridData, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                            vm.gridData.push(value);

                            if (!flag)
                                flag = 1;
                        }
                    });

                    dataSourceProduct.read();

                    $timeout(function () {
                        toggleColumnsWhenEmptyConflictGrid(vm.gridData);
                    });

                    if (flag == 1) {
                    }
                    else {
                        logger.error("Can not insert duplicate product ");
                    }

                }, function (response) {
                    logger.error("Unable to get product details", response, response.statusText);
                });

            
        }
    }

    // Master Product(s) massaging
    var cookProducts = function (e) {
        var result = false;
        var data = GetProductCorrectorData;

        for (var key in data.ProdctTransformResults) {
            if (key == vm.currentRow) {
                // Process invalid product(s) to make html to display
                if (!!data.InValidProducts[key] && data.InValidProducts[vm.currentRow].length > 0) {
                    vm.invalidProducts = [];
                    vm.opMode = 'I';
                    vm.isInvalidProduct = false;
                    vm.isMultipleProduct = true;
                    vm.productName = data.InValidProducts[vm.currentRow]["0"];
                    for (var j = 0; j < data.InValidProducts[vm.currentRow].length; j++) {
                        vm.invalidProducts.push({ "USR_INPUT": data.InValidProducts[vm.currentRow][j] });
                    }
                    dataSource.read();
                }
                    // Process multiple match product(s) to make html to display
                else if (!!data.DuplicateProducts[key]) {
                    vm.opMode = 'D';
                    vm.isInvalidProduct = true;
                    vm.isMultipleProduct = false;

                    var object = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
                    object.Row = key;
                    object.Items = !!data.DuplicateProducts[key] ? data.DuplicateProducts[key] : "";

                    var isConflict = false;
                    for (var prod in object.Items) {
                        vm.productName = prod;
                        if (object.Items[prod].length > 0) {
                            vm.selectedDataSet = object.Items[prod];
                            var item = {
                                name: ""
                            };
                            result = checkNextLevelOfConflict();
                            if (result) {
                                break;
                            }
                            else if (!vm.selectedDataSet[0].EXACT_MATCH) {
                                var item = {
                                    name: vm.selectedDataSet[0].FMLY_NM == null ? "" : vm.selectedDataSet[0].FMLY_NM
                                };
                                vm.selectsearchItem(item);

                                break;
                            }
                        }
                    }
                }
                    // Checking for Valid Product(s)
                else if (!!data.ValidProducts[key]) {
                    vm.items = [];
                    for (var a = 0; a < data.ProdctTransformResults[key].length; a++) {
                        var value = data.ProdctTransformResults[key][a];
                        if (!!data.ValidProducts[key][value]) {
                            for (var i = 0; i < data.ValidProducts[key][value].length; i++) {
                                data.ValidProducts[key][value][i]["ROW_NUMBER"] = key;
                                vm.addedProducts.push(data.ValidProducts[key][value][i]);
                            }
                        }
                    }
                }
                if (!!data.ValidProducts[key]) {
                    includedListPopulation();
                }
            }
        }

        //productSuggestion(item);
    }
    //populating Valid product in Included list
    function includedListPopulation() {
        vm.addedProducts = [];
        var data = GetProductCorrectorData;
        for (var key in data.ProdctTransformResults) {
            if (key == vm.currentRow) {
                if (!!data.ValidProducts[key]) {
                    for (var a = 0; a < data.ProdctTransformResults[key].length; a++) {
                        var value = data.ProdctTransformResults[key][a];
                        if (!!data.ValidProducts[key][value]) {
                            for (var i = 0; i < data.ValidProducts[key][value].length; i++) {
                                data.ValidProducts[key][value][i]["ROW_NUMBER"] = key;
                                vm.addedProducts.push(data.ValidProducts[key][value][i]);
                            }
                        }
                    }
                }
            }
        }
    }

    // Checking for Conflict up to FAMILY LEVEL
    function cehckingConflict(data, _selectionLevel, item) {
        // Checking for conflict in Deal Product Type i.e. CPU or EIA products
        if (item.name && item.name.length > 0) {
            productHierarchy.push(item.name);
        }
        if (_selectionLevel == 0) {
            isConflict = $linq.Enumerable().From(data)
                .GroupBy(function (x) {
                    return (x.DEAL_PRD_TYPE);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .GroupBy(function (x) {
                        return (x.DEAL_PRD_TYPE);
                    }).Select(function (x) {
                        return { 'DEAL_PRD_TYPE': x.source[0].DEAL_PRD_TYPE };
                    })
                    .ToArray();

                //vm.selectedDataSet = datas;
                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].DEAL_PRD_TYPE });
                }
                conflictLevel = "DEAL_PRD_TYPE";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .GroupBy(function (x) {
                        return (x.DEAL_PRD_TYPE);
                    }).Select(function (x) {
                        return { 'DEAL_PRD_TYPE': x.source[0].DEAL_PRD_TYPE };
                    })
                    .ToArray();
                //vm.selectedDataSet = datas;
                if (dataS.length > 0) {
                    item.name = dataS[0].DEAL_PRD_TYPE;
                }
            }
        }
        //Checking for conflict in Category Name i.e. DT OR Mb or etc
        if (_selectionLevel == 1) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.DEAL_PRD_TYPE == item.name);
                })
                .GroupBy(function (x) {
                    return (x.PRD_CAT_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.DEAL_PRD_TYPE == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.PRD_CAT_NM);
                    }).Select(function (x) {
                        return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].PRD_CAT_NM });
                }
                conflictLevel = "PRD_CAT_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.DEAL_PRD_TYPE == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.PRD_CAT_NM);
                    }).Select(function (x) {
                        return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                    }).ToArray();

                if (dataS.length > 0) {
                    item.name = dataS[0].PRD_CAT_NM;
                }
            }
        }
        //Checking for conflict in Brand Name i.e. ci3 or ci5, ci7 etc
        if (_selectionLevel == 2) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.PRD_CAT_NM == item.name &&
                        x.DEAL_PRD_TYPE == productHierarchy[0]);
                })
                .GroupBy(function (x) {
                    return (x.BRND_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.PRD_CAT_NM == item.name && x.DEAL_PRD_TYPE == productHierarchy[0]);
                    })
                    .GroupBy(function (x) {
                        return (x.BRND_NM);
                    }).Select(function (x) {
                        return { 'BRND_NM': x.source[0].BRND_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].BRND_NM });
                }
                conflictLevel = "BRND_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.PRD_CAT_NM == item.name && x.DEAL_PRD_TYPE == productHierarchy[0]);
                    })
                    .GroupBy(function (x) {
                        return (x.BRND_NM);
                    }).Select(function (x) {
                        return { 'BRND_NM': x.source[0].BRND_NM };
                    })
                    .ToArray();

                if (dataS.length > 0) {
                    item.name = dataS[0].BRND_NM;
                }
            }
        }
        //Checking for conflict in Family Name i.e  Haswell, Kaby Lake, Skylake etc
        if (_selectionLevel == 3) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.BRND_NM == item.name && x.DEAL_PRD_TYPE == productHierarchy[0] && x.PRD_CAT_NM == productHierarchy[1]);
                })
                .GroupBy(function (x) {
                    return (x.FMLY_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.BRND_NM == item.name && x.DEAL_PRD_TYPE == productHierarchy[0] && x.PRD_CAT_NM == productHierarchy[1]);
                    })
                    .GroupBy(function (x) {
                        return (x.FMLY_NM);
                    }).Select(function (x) {
                        return { 'FMLY_NM': x.source[0].FMLY_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].FMLY_NM });
                }
                conflictLevel = "FMLY_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.BRND_NM == item.name && x.DEAL_PRD_TYPE == productHierarchy[0] && x.PRD_CAT_NM == productHierarchy[1]);
                    })
                    .GroupBy(function (x) {
                        return (x.FMLY_NM);
                    }).Select(function (x) {
                        return { 'FMLY_NM': x.source[0].FMLY_NM };
                    })
                    .ToArray();
                if (dataS.length > 0) {
                    item.name = dataS[0].FMLY_NM;
                }
            }
        }
        return isConflict;
    }

    // Loop to drill down for Conflict up to FAMILY LEVEL
    function checkNextLevelOfConflict(item) {
        if (_selectionLevel > -1 && _selectionLevel < 4) {
            for (var cnt = _selectionLevel; cnt < 4; cnt++) {
                if (!item) {
                    item = { name: "" };
                }
                var result = cehckingConflict(vm.selectedDataSet, _selectionLevel, item);
                _selectionLevel = cnt + 1;
                if (result) {
                    _lastConflictedState = _selectionLevel;
                    return result;
                }
            }
        }
        if (_selectionLevel == 4) {
            productHierarchy.push(item.name);
        }

        return result = false;
    }

    //Click Breadcrumb
    function selectPath(item) {
        var nextConflictedLevel = '';
        if (item > 0) {
            nextConflictedLevel = vm.selectedPathParts[item - 1].name;
        }
        _selectionLevel = vm.breadCumLevel.indexOf(nextConflictedLevel); // Fetching Next conflicted level

        if (_selectionLevel < 4 && _selectionLevel > 1) {
            //Reset Grid
            vm.gridData = [];
            dataSourceProduct.read();

            vm.showSearchResults = false;

            //Resetting Suggestion
            vm.suggestedProd = [];
            vm.masterSuggestionList = {};

            //Removing Element from BreadCrumb Array
            vm.selectedPathParts.splice(item, vm.selectedPathParts.length);

            productHierarchy.splice(item, productHierarchy.length);

            var tempSelectionLevel = item;
            var vartempitem = { name: nextConflictedLevel };

            //Checking conflict
            for (var cnt = _selectionLevel; cnt < 4; cnt++) {
                if (item == 0) {
                    item = { name: "" };
                }
                var result = cehckingConflict(vm.selectedDataSet, _selectionLevel, vartempitem);
                _selectionLevel = cnt + 1;
                if (result) {
                    _lastConflictedState = _selectionLevel;
                    return result;
                }
            }
        }
        else if (item == 0) {
            productHierarchy = [];
            _selectionLevel = 0;
            vm.gridData = [];
            dataSourceProduct.read();
            vm.showSearchResults = false;
            //Resetting Suggestion
            vm.suggestedProd = [];
            vm.masterSuggestionList = {};
            vm.selectedPathParts = [];

            var result = checkNextLevelOfConflict();//calling to regenerate the hierarchy
            if (!result) {
                var item = {
                    name: productHierarchy[3]
                }
                vm.selectsearchItem(item);
            }
        }
    }

    //Calling for generating number of Rows
    generatePagination();

    //Master Product Data massaging
    cookProducts();

    //Add some suggestion for the searching
    vm.addToSuggestList = function (item) {
        for (var key in vm.masterSuggestionList) {
            var suggestedIndex = vm.masterSuggestionList[key].indexOf(item);
            if (suggestedIndex != -1) {
                for (var mm = 0; mm < vm.invalidProducts.length; mm++) {
                    if (vm.invalidProducts[mm].USR_INPUT == key) {
                        vm.invalidProducts.splice(mm, 1);
                    }
                }

                if (GetProductCorrectorData.InValidProducts[vm.currentRow].indexOf(key) != -1) {
                    var invalidIndex = GetProductCorrectorData.InValidProducts[vm.currentRow].indexOf(key);
                    var transformIndex = GetProductCorrectorData.ProdctTransformResults[vm.currentRow].indexOf(key);
                    GetProductCorrectorData.InValidProducts[vm.currentRow].splice(invalidIndex, 1);
                    GetProductCorrectorData.ProdctTransformResults[vm.currentRow].splice(transformIndex, 1);
                    GetProductCorrectorData.InValidProducts[vm.currentRow].push(item);
                    GetProductCorrectorData.ProdctTransformResults[vm.currentRow].push(item);
                }
            }
        }

        var flagFound = vm.invalidProducts.indexOf(item);

        if (flagFound == -1) {
            var itemSuggested = {
                USR_INPUT: item
            };

            vm.invalidProducts.unshift(itemSuggested);
            dataSource.read();

            for (var z = 0; z < vm.suggestedProd.length; z++) {
                if (vm.suggestedProd[z] == item) {
                    vm.suggestedProd = [];
                }
            }
        }
        else {
            logger.error("Same product name exist");
        }
    }

    //Go to Next ROW for conflict or Invalid Product
    function nextRow() {
        if (vm.rowNumber < vm.rows) {
            vm.rowNumber = +vm.rowNumber + 1;
            vm.currentRow = pageNumber[vm.rowNumber - 1];
            updateRowDCID();
            vm.addedProducts = [];
            productHierarchy = [];
            //Reset Bread cum
            vm.breadCumLevel = [];
            vm.selectedPathParts = [];
            //reseting Grid
            vm.gridData = [];
            dataSourceProduct.read();
            vm.showSearchResults = false;
            //Resetting Suggestion
            vm.suggestedProd = [];
            vm.masterSuggestionList = {};
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.rowNumber == vm.rows) {
            vm.isNextDisabled = true;
        }
    }

    //Go to Previous ROW for conflict or Invalid Product
    function prevRow() {
        if (vm.rowNumber > 1) {
            vm.rowNumber = vm.rowNumber - 1;
            vm.currentRow = +pageNumber[vm.rowNumber - 1];
            updateRowDCID();
            vm.addedProducts = [];
            productHierarchy = [];
            //Reset Bread cum
            vm.breadCumLevel = [];
            vm.selectedPathParts = [];
            //reseting Grid
            vm.gridData = [];
            dataSourceProduct.read();
            vm.showSearchResults = false;
            //Resetting Suggestion
            vm.suggestedProd = [];
            vm.masterSuggestionList = {};
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.rowNumber == 1) {
            vm.isPrevDisabled = true;
        }
    }

    //Add suggestion to the suggestion product
    function productSuggestion(item) {
        vm.invalidSuggestionProd = item.USR_INPUT;
        var row = {};
        if (ProductRows.length > 1) {
            row = ProductRows[vm.currentRow - 1];
        }
        else {
            row = ProductRows[0];
        }
        var searchStringDTO = {
            'prdEntered': item.USR_INPUT,
            'returnMax': 5,
            'startDate': row.START_DT,
            'endDate': row.END_DT
        }

        ProductSelectorService.GetProductSuggestions(searchStringDTO)
            .then(function (response) {
                if (response.data.length > 0) {
                    vm.suggestedProduct = [];
                    angular.forEach(response.data, function (value, key) {
                        if (!$filter("where")(vm.suggestedProduct, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                            vm.suggestedProduct.push(value);
                        }
                    });
                    dataSourceSuggested.read();
                    $timeout(function () {
                        toggleColumnsWhenEmpty(vm.suggestedProduct);
                    }, 1)
                }
                else {
                    vm.suggestedProd = [];
                    vm.selectSuggestion(item.USR_INPUT);
                    vm.suggestedProduct = [];
                    dataSourceSuggested.read();
                    logger.warning("Unable to get suggestions, please check the global filters selected.");
                }
            }, function (response) {
                logger.error("Unable to run Suggest Product", response, response.statusText);
            });
    }

    // Add selected Products from the Product Suggestion
    function addProductSuggested(item) {
        if (item.PRD_ATRB_SID <= 7005) {
            logger.error("Unable to add. Deals can be created at Processor, L4 or Material ID level");
            return;
        }

        //Fetch CAP values
        var row = {};
        if (ProductRows.length > 1) {
            row = ProductRows[vm.currentRow - 1];
        }
        else {
            row = ProductRows[0];
        }

        var data = {
            "productsid": item.PRD_MBR_SID,
            "startDate": row.START_DT,
            "endDate": row.END_DT,
            "custSid": CustSid,
            "geoSid": row.GEO_COMBINED,
            "getAvailable": 'Y',
            "priceCondition": "",
        }

        ProductSelectorService.GetCAPForProduct(data)
            .then(function (response) {
                //Create a new object for selected
                var selectedObject = {};

                selectedObject["BRND_NM"] = item.BRND_NM;
                selectedObject["CAP"] = !!response.data[0] ? response.data[0].CAP : "No CAP";
                selectedObject["CAP_START"] = !!response.data[0] ? response.data[0].CAP_START : "1/1/0001";
                selectedObject["CAP_END"] = !!response.data[0] ? response.data[0].CAP_END : "1/1/0001";
                selectedObject["DEAL_PRD_NM"] = item.DEAL_PRD_NM;
                selectedObject["DEAL_PRD_TYPE"] = item.DEAL_PRD_TYPE;
                selectedObject["EXACT_MATCH"] = false;
                selectedObject["FMLY_NM"] = item.FMLY_NM;
                selectedObject["HAS_L1"] = false;
                selectedObject["HAS_L2"] = false;
                selectedObject["HIER_NM_HASH"] = item.HIER_NM_HASH;
                selectedObject["HIER_VAL_NM"] = item.HIER_VAL_NM;
                selectedObject["MTRL_ID"] = item.MTRL_ID;
                selectedObject["PCSR_NBR"] = item.PCSR_NBR;
                selectedObject["PRD_ATRB_SID"] = item.PRD_ATRB_SID;
                selectedObject["PRD_CAT_NM"] = item.PRD_CAT_NM;
                selectedObject["PRD_END_DTM"] = item.PRD_END_DTM;
                selectedObject["PRD_MBR_SID"] = item.PRD_MBR_SID;
                selectedObject["PRD_STRT_DTM"] = item.PRD_STRT_DTM;
                selectedObject["USR_INPUT"] = item.USR_INPUT;
                selectedObject["CAP_PRC_COND"] = !!response.data[0] ? response.data[0].CAP_PRC_COND : "";
                selectedObject["YCS2"] = !!response.data[0] ? response.data[0].YCS2 : "No YCS2";
                selectedObject["YCS2_END"] = !!response.data[0] ? response.data[0].YCS2_END : "1/1/0001";;
                selectedObject["YCS2_START"] = !!response.data[0] ? response.data[0].YCS2_START : "1/1/0001";

                if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: item.PRD_MBR_SID }).length > 0) {
                    vm.addedProducts.push(selectedObject);
                }
            }, function (response) {
                logger.error("Unable to get CAP for the product", response, response.statusText);
            });
    }
    // Clear all the selected Product from the Selected BOX
    function clearProducts() {
        vm.addedProducts = [];
    }

    // Dismiss the Modal popup by clicking Cancel button
    vm.cancel = function () {
        $uibModalInstance.close(GetProductCorrectorData);
    }

    //Adding products to the selected list
    function addProducts() {
        // Add them to box, check for duplicate prd_mbr_sid
        angular.forEach(vm.selectedItems, function (value, key) {
            if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                vm.addedProducts.push(value);
                vm.addedProducts = vm.addedProducts.map(function (x) {
                    return {
                        BRND_NM: x.BRND_NM,
                        CAP: x.CAP,
                        CAP_END: x.CAP_END,
                        CAP_START: x.CAP_START,
                        DEAL_PRD_NM: x.DEAL_PRD_NM,
                        DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                        FMLY_NM: x.FMLY_NM,
                        HAS_L1: x.HAS_L1,
                        HAS_L2: x.HAS_L2,
                        HIER_NM_HASH: x.HIER_NM_HASH,
                        HIER_VAL_NM: x.HIER_VAL_NM,
                        MTRL_ID: x.MTRL_ID,
                        PCSR_NBR: x.PCSR_NBR,
                        PRD_ATRB_SID: x.PRD_ATRB_SID,
                        PRD_CAT_NM: x.PRD_CAT_NM,
                        PRD_END_DTM: x.PRD_END_DTM,
                        PRD_MBR_SID: x.PRD_MBR_SID,
                        PRD_STRT_DTM: x.PRD_STRT_DTM,
                        USR_INPUT: x.USR_INPUT,
                        YCS2: x.YCS2,
                        YCS2_END: x.YCS2_END,
                        YCS2_START: x.YCS2_START
                    }
                });
                
            }
        });

        vm.selectedItems = [];
    }

    // Save Selected product(s) for the Row
    function saveProducts() {
        if (vm.addedProducts.length > 0) {
            var validObject = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
            for (var s = 0; s < vm.addedProducts.length; s++) {
                vm.addedProducts[s]["ROW_NUMBER"] = vm.currentRow;
            }

            var selectedInput = $linq.Enumerable().From(vm.addedProducts)
                .GroupBy(function (x) {
                    return (x.USR_INPUT);
                }).Select(function (x) {
                    return { 'USR_INPUT': x.source[0].USR_INPUT };
                }).ToArray();

            var obj = {};

            for (var m = 0; m < selectedInput.length; m++) {
                var products = $linq.Enumerable().From(vm.addedProducts)
                    .Where(function (x) {
                        return (x.USR_INPUT == selectedInput[m].USR_INPUT);
                    }).ToArray();

                var tempProdNm = selectedInput[m].USR_INPUT;

                const prodName = tempProdNm;

                obj[prodName] = products;
            }
            GetProductCorrectorData.ValidProducts[vm.currentRow] = obj;

            if (vm.opMode == 'D') {
                // Deleting User input from the Particular Row
                delete GetProductCorrectorData.DuplicateProducts[vm.currentRow][vm.productName];

                // Deleting Complete Row fromDuplicate Product
                var flag = 0;
                var object = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
                object.Row = vm.currentRow;
                object.Items = !!GetProductCorrectorData.DuplicateProducts[vm.currentRow] ? GetProductCorrectorData.DuplicateProducts[vm.currentRow] : "";
                for (var prod in object.Items) {
                    flag = 1;
                }
                if (flag == 0)
                    delete GetProductCorrectorData.DuplicateProducts[vm.currentRow];
            }
            else {
                var dataSelected = $linq.Enumerable().From(vm.addedProducts)
                    .GroupBy(function (x) {
                        return (x.USR_INPUT);
                    }).Select(function (x) {
                        return { 'USR_INPUT': x.source[0].USR_INPUT };
                    }).ToArray();
                var tempProductName = vm.invalidSuggestionProd;
                for (var j = 0; j < GetProductCorrectorData.InValidProducts[vm.currentRow].length; j++) {
                    for (var z = 0; z < dataSelected.length; z++) {
                        if (dataSelected[z].USR_INPUT == tempProductName) {
                            var transfromIndex = GetProductCorrectorData.ProdctTransformResults[vm.currentRow].indexOf(tempProductName);
                            GetProductCorrectorData.ProdctTransformResults[vm.currentRow][transfromIndex] = dataSelected[z].USR_INPUT;

                            var invalidIndex = GetProductCorrectorData.InValidProducts[vm.currentRow].indexOf(tempProductName);
                            if (invalidIndex != -1) {
                                GetProductCorrectorData.InValidProducts[vm.currentRow].splice(invalidIndex, 1);
                            }
                        }

                        //Removing From invalid item;
                        for (var d = 0; d < vm.invalidProducts.length; d++) {
                            if (vm.invalidProducts[d].USR_INPUT == dataSelected[z].USR_INPUT) {
                                vm.invalidProducts.splice(d, 1);
                            }
                        }
                    }
                }
                if (GetProductCorrectorData.InValidProducts[vm.currentRow].length == 0) {
                    vm.invalidProducts = [];
                }
                else {
                }
            }

            _selectionLevel = 0;
            productHierarchy = [];
            vm.items = [];
            vm.gridData = [];
            dataSourceProduct.read();
            dataSource.read();

            vm.showSearchResults = 0;

            var previousPage = vm.currentRow;

            // Reset Suggestion list
            vm.clearSuggedtedProd();

            //Reset Bread cum
            vm.breadCumLevel = [];
            vm.selectedPathParts = [];

            generatePagination();

            //Added List reset logic
            for (var p = 0; p < pageNumber.length; p++) {
                if (pageNumber[p] == previousPage) {
                    vm.resetAddedList = 0;
                    break;
                }
                else {
                    vm.resetAddedList = 1;
                }
            }

            if (vm.rowNumber == vm.rows && vm.resetAddedList == 1) {
                vm.rowNumber = vm.rowNumber - 1;
            }
            else if ((vm.rowNumber == 1 || vm.rowNumber == vm.rows) && vm.resetAddedList == 1) {
                vm.rowNumber = vm.rowNumber;
            }
            else if (vm.rowNumber < vm.rows - 1 && vm.resetAddedList == 1) {
                vm.rowNumber = vm.rowNumber + 1;
            }

            if (vm.resetAddedList == 1) {
                vm.addedProducts = [];
            }

            if ((pageNumber.length + 1) == vm.rowNumber || (pageNumber.length == 1)) {
                vm.rowNumber = 1;
                vm.currentRow = pageNumber[0];
            }
            if (pageNumber.length != 0) {
                cookProducts();
            }
            else {
                vm.cancel();
            }
        }
        else {
            logger.error("No product selected");
            /// When user deletes the product and clicks save move to next item            
        }
    }

    // These validation rules are taken from MT CAP Validations. Both the places rules should be in sync
    function isValidCapDetails(productJson, showErrorMesssage) {
        var errorMessage = "";
        var cap = productJson.CAP.toString();
        if (cap.toUpperCase() == "NO CAP") {
            errorMessage = "Product entered does not have CAP within the Deal's start date and end date.";
        }
        if (cap.indexOf('-') > -1) {
            errorMessage = "CAP price " + cap + " cannot be a range.";
        }
        if (!showErrorMesssage) {
            return errorMessage == "" ? false : true;
        } else {
            return errorMessage == "" ? productJson.HIER_NM_HASH : errorMessage;
        }
    }
}