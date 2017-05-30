(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductSelectorController', ProductSelectorController);

    ProductSelectorController.$inject = ['$filter', '$scope', 'dataService', 'ProductSelectorService', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$state', '$uibModal'];

    function ProductSelectorController($filter, $scope, dataService, ProductSelectorService, logger, confirmationModal, gridConstants, $linq, $state, $uibModal) {
        var vm = this
        vm.checked = false;

        //Product Selector Modal opener
        vm.openProdSelector = function (row) {
            var modal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'app/contract/productSelector/productSelector.html',
                controller: 'ProductSelectorModalController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdSelector-modal-window',
                resolve: {
                    productSelectionLevels: ['ProductSelectorService', function (ProductSelectorService) {
                        var dtoDateRange = { startDate: $scope.contractData.START_DT, endDate: $scope.contractData.END_DT };
                        return ProductSelectorService.GetProductSelectorWrapper(dtoDateRange);
                    }],
                    contractData: angular.copy($scope.contractData)
                }
            });

            modal.result.then(
                //close
                function () {
                    toastr.success("Products updated successfully.");
                },
                function () {
                });
        }

        vm.closeModal = function () {
            dialog.close(result);
        }

        // TODO This will coded
        $scope.contractData = { 'CUST_MBR_SID': 2, 'GEO_MBR_SID': 1, "START_DT": "01/01/2017", "END_DT": "12/31/2017" };

        vm.invalidProducts = []; // This will hold InValid Products
        vm.isMultipleORInvalid = true;  // Checking for In there any Duplicate or Invalid Product found or not
        vm.PROD_MBR_SID = 0;
        vm.fetchProductDetails = fetchProductDetails; //  This method will Translate the User Inserted product into Product Details.
        $scope.IsVisible = false; //  Scope Visibility Variable to used for Hide and show div
        vm.datSourceCorrector = {}; // Will Hold Global Product Master List
        vm.addProducts = addProducts; // Method for Adding Valid products to the list
        vm.validProducts = []; // Contain Valid Product
        vm.currentRow = 1; // Will hold the clicked row Number. In case of Bulk it will hold 1
        vm.gridData = [];
        vm.selectedID = 3;
        //Product Corrector Modal opener
        vm.openProdCorrector = function (row) {
            var gridData  = vm.gridData;
            var modal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'app/contract/productCorrector/productCorrector.html',
                controller: 'ProductCorrectorModalController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdCorrector-modal-window',
                resolve: {
                    GetProductCorrectorData: angular.copy(vm.datSourceCorrector), //Product Master List
                    contractData: angular.copy($scope.contractData), // Contract data
                    RowId: angular.copy(vm.currentRow), // Row ID which should be validated
                    ProductRows: function () {
                        return angular.copy(vm.gridData);
                    }
                }
            });

            modal.result.then(
                //close
                function (GetProductCorrectorData) {
                    toastr.success("Products updated successfully.");
                    vm.datSourceCorrector = GetProductCorrectorData;
                    addProducts();
                    dataSource.read();
                    vm.checked = false;
                },
                function () {
                });
        }

        // Load Deal Type Values
        var loadDDLValues = function (e) {
            ProductSelectorService.GetProdDealType()
                .then(
                function (response) {
                    if (response.statusText == "OK") {
                        $scope.selectOptions = {
                            optionLabel: "Select Deal Type...",
                            dataTextField: "OBJ_SET_TYPE_CD",
                            dataValueField: "OBJ_SET_TYPE_SID",
                            valuePrimitive: true,
                            dataSource: {
                                data: response.data,
                            },
                            change: function (e) {
                                $scope.IsVisible = $scope.IsHidden ? false : true;
                            }
                        };
                        $scope.selectedIds = [1];
                    }
                },
                function (response) {
                    logger.error("Unable to get Product.", response, response.statusText);
                }
                );
        };

        // declare dataSource bound to backend
        vm.dataSourceProduct = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                },
                update: function (e) {
                },
                destroy: function (e) {
                },
                create: function (e) {
                }
            },
            pageSize: 10,
            autoSync: false,
            schema: {
                model: {
                    id: "ROW_NUMBER",
                    fields: {
                        ROW_NUMBER: { editable: false, nullable: true },
                        USR_INPUT: { validation: { required: true } },
                        EXCLUDE: { validation: { required: false } },
                        FILTER: { validation: { required: false } },
                        START_DATE: { validation: { required: false }, type: "date" },
                        END_DATE: { validation: { required: false }, type: "date" },
                        "_behaviors": { type: "object" }
                    }
                }
            },
        });
        vm.handleDoubleClick = function () {
            fetchProductDetailsOnClick();
        };

        // Options for the User Input Product Grid
        vm.gridOptionsProduct = {
            dataSource: [{
                ROW_NUMBER: 1,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }, {
                ROW_NUMBER: 2,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            },
            {
                ROW_NUMBER: 3,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }, {
                ROW_NUMBER: 4,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            },
            {
                ROW_NUMBER: 5,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }, {
                ROW_NUMBER: 6,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            },
            {
                ROW_NUMBER: 7,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }, {
                ROW_NUMBER: 8,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            },
            {
                ROW_NUMBER: 9,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }, {
                ROW_NUMBER: 10,
                USR_INPUT: "",
                EXCLUDE: "",
                FILTER: "",
                START_DATE: "",
                END_DATE: ""
            }],
            filterable: true,
            selectable: "row",
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            enableHorizontalScrollbar: true,
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            columns: [
                { field: "ROW_NUMBER", title: "Sl No", width: "50px", editor: RWNM },
                { field: "USR_INPUT", title: "Product Name", width: "200px" },
                { field: "EXCLUDE", title: "Exclude", width: "200px" },
                { field: "FILTER", template: " #= FILTER # ", title: "Filter", width: "200px" },
                { field: "START_DATE", template: "#=gridUtils.uiControlWrapper(data, 'START_DATE', \"date:'MM/dd/yyyy'\")#", title: "Start date", width: "200px", editor: dateTime },
                { field: "END_DATE", template: "#=gridUtils.uiControlWrapper(data, 'END_DATE', \"date:'MM/dd/yyyy'\")#", title: "End Date", width: "200px", editor: dateTime }
            ]
        };

        // Load Deal Type Values
        loadDDLValues();

        //Editor for Start Date and End Date
        function RWNM(container, options) {

        }

        //Editor for Start Date and End Date
        function dateTime(container, options) {
            $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" />')
                .appendTo(container)
                .kendoDatePicker({
                    format: "MM/dd/yyyy",
                    value: kendo.toString(new Date(), 'MM/dd/yyyy')
                });
        }

        // Translate Bulk Product(s)
        function fetchProductDetails() {
            if (!vm.checked) {
                var dataSelect = [];
                var dealTypeSelect = $("#dropdownDealType").data("kendoDropDownList");
                var value = dealTypeSelect.value();

                if (value >= 0 && value != "" && value != null) {
                    var CUST_CD = $scope.contractData.CUST_MBR_SID;
                    var GEO_MBR_SID = $scope.contractData.GEO_MBR_SID.toString();
                    var resultData = $linq.Enumerable().From($scope.prodGrid._data)
                        .Where(function (x) {
                            return x.USR_INPUT.length > 0 && x.START_DATE > 0 && x.END_DATE > 0;
                        }).ToArray();

                    for (var i = 0; i < resultData.length; i++) {
                        var sendObj = {
                            ROW_NUMBER: resultData[i].ROW_NUMBER,
                            USR_INPUT: resultData[i].USR_INPUT,
                            EXCLUDE: resultData[i].EXCLUDE,
                            FILTER: resultData[i].FILTER,
                            START_DATE: resultData[i].START_DATE,
                            END_DATE: resultData[i].END_DATE
                        }
                        dataSelect.push(sendObj);
                    }
                    if (resultData.length > 0) {
                        vm.checked = true;
                        ProductSelectorService.TranslateProducts(dataSelect, CUST_CD, GEO_MBR_SID)
                            .then(
                            function (response) {
                                if (response.statusText == "OK") {
                                    cookProducts(response.data, dataSelect);
                                    vm.validProducts = [];
                                }
                            },
                            function (response) {
                                logger.error("Unable to get Product.", response, response.statusText);
                                vm.checked = false;
                            }
                            );
                    }
                    else {
                        logger.error('Not a valid row');
                    }
                }
                else {
                    logger.error('Not a Valid Deal type');
                }
            }
        }

        // Translate Product(s) by Double Clicking on Rows
        function fetchProductDetailsOnClick() {
            var dealTypeSelect = $("#dropdownDealType").data("kendoDropDownList");
            var value = dealTypeSelect.value();

            if (value >= 0 && value != "" && value != null) {
                var grid = $("#prodGrid").data("kendoGrid");
                var selectedItem = grid.dataItem(grid.select());
                var sendObj = {
                    ROW_NUMBER: selectedItem.ROW_NUMBER,
                    USR_INPUT: selectedItem.USR_INPUT,
                    EXCLUDE: selectedItem.EXCLUDE,
                    FILTER: selectedItem.FILTER,
                    START_DATE: selectedItem.START_DATE,
                    END_DATE: selectedItem.END_DATE
                }
                vm.currentRow = selectedItem.ROW_NUMBER;
                var CUST_CD = $scope.contractData.CUST_MBR_SID;
                var GEO_MBR_SID = $scope.contractData.GEO_MBR_SID.toString();
                var dataSelect = [];
                dataSelect.push(sendObj);

                if (dataSelect.length > 0) {
                    ProductSelectorService.TranslateProducts(dataSelect, CUST_CD, GEO_MBR_SID)
                        .then(
                        function (response) {
                            if (response.statusText == "OK") {
                                cookProducts(response.data, dataSelect);
                            }
                        },
                        function (response) {
                            logger.error("Unable to get Product.", response, response.statusText);
                        }
                        );
                }
                else {
                    logger.error('Not a valid row');
                }
            }
            else {
                logger.error('Not a Valid Deal type');
            }

        }

        // Data Source for Final PRoduct Grid
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.validProducts);
                },
                update: function (e) {

                },
                destroy: function (e) {

                },
                create: function (e) {

                }
            },
            schema: {
                model: {
                    fields: {
                        ROW_NUMBER: {},
                        USR_INPUT: {},
                        PRD_MBR_SID: {},
                        DEAL_PRD_NM: {},
                        PRD_CAT_NM: {},
                        BRND_NM: {},
                        FMLY_NM: {},
                        PCSR_NBR: {},
                        KIT_NM: {},
                        CAP: {},
                        CAP_START_DATE: {},
                        CAP_END_DATE: {},
                        CAP_PRC_COND: {},
                        YCS2: {},
                        YCS2_START_DATE: {},
                        YCS2_END_DATE: {}
                    }
                }
            },
            group: ([{ field: "ROW_NUMBER" }, { field: "USR_INPUT" }]),
            pageSize: 5,
            serverPaging: true,
            serverSorting: true
        });

        // Options for Final Product Grid
        vm.gridOptions = {
            dataSource: dataSource,
            filterable: true,
            sortable: false,
            selectable: true,
            resizable: true,
            groupable: true,
            columnMenu: true,
            scrollable: true,
            editable: false,
            pageable: true,
            dataBound: function () {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [
                {
                    command: [
                        { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }

                    ],
                    title: " ",
                    width: "100px"
                },
                { field: "ROW_NUMBER", template: " #= ROW_NUMBER # ", title: "Row No", width: "200px", hidden: true },
                { field: "USR_INPUT", template: " #= USR_INPUT # ", title: "User Input", width: "200px" },
                { field: "PRD_MBR_SID", title: "Product No", width: "200px" },
                { field: "DEAL_PRD_NM", template: " #= DEAL_PRD_NM # ", title: "Deal Prod Name", width: "200px" },
                { field: "PRD_CAT_NM", template: " #= PRD_CAT_NM # ", title: "Category Name", width: "200px" },
                { field: "BRND_NM", template: " #= BRND_NM # ", title: "Brand Name", width: "200px" },
                { field: "FMLY_NM", template: " #= FMLY_NM # ", title: "Family Name", width: "200px" },
                { field: "PCSR_NBR", template: " #= PCSR_NBR # ", title: "Processor No", width: "200px" },
                { field: "KIT_NM", template: " #= KIT_NM # ", title: "KIT Name", width: "200px" },
                {
                    field: "MM_CUST_CUSTOMER",
                    title: "MM Customer Name",
                    width: "150px"
                },
                {
                    field: "CAP",
                    title: "CAP Price",
                    width: "150px",
                    template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, null)' op-options='CAP' op-label='#= CAP #' op-data='vm.getPrductDetails(dataItem, null)' />"
                },
                {
                    field: "YCS2",
                    title: "YCS2",
                    width: "150px",
                    template: "<op-popover op-options='YCS2' op-label='#= YCS2 #' op-data='vm.getPrductDetails(dataItem, \"YCS2\")' />"
                }
            ]
        };

        //Getting CAP Product Details for Tooltip
        vm.getPrductDetails = function (dataItem, priceCondition) {
            return [{
                'CUST_MBR_SID': $scope.contractData.CUST_MBR_SID,
                'PRD_MBR_SID': dataItem.PRD_MBR_SID,
                'GEO_MBR_SID': $scope.contractData.GEO_MBR_SID.toString(),
                'DEAL_STRT_DT': $scope.contractData.START_DT,
                'DEAL_END_DT': $scope.contractData.END_DT,
                'getAvailable': 'N',
                'priceCondition': priceCondition == null ? dataItem.CAP_PRC_COND : priceCondition
            }];
        }

        // TODO remove once integrated in CM
        vm.openCAPBreakOut = function (dataItem, priceCondition) {
            var capModal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'app/contract/productCAPBreakout/productCAPBreakout.html',
                controller: 'ProductCAPBreakoutController',
                controllerAs: 'vm',
                windowClass: 'cap-modal-window',
                size: 'lg',
                resolve: {
                    productData: angular.copy(dataItem),
                    contractData: angular.copy($scope.contractData),
                }
            });

            capModal.result.then(
                function () {
                },
                function () {
                });
        }

        // Master Product Massaging
        function cookProducts(data, gridData) {
            //reset();
            vm.datSourceCorrector = data;
            vm.gridData = gridData;
            var isAllValidated = 1;
            var multipleMatch = false;
            for (var key in data.ProdctTransformResults) {
                // Process invalid products to make html to display
                if (data.InValidProducts[key].length > 0) {
                    multipleMatch = true;
                    vm.openProdCorrector();
                    vm.isMultipleORInvalid = false;
                    vm.checked = true;
                    isAllValidated = 0;
                    break;
                }

                // Process multiple match products to make html to display
                if (!!data.DuplicateProducts[key]) {
                    vm.openProdCorrector();
                    vm.isMultipleORInvalid = false;
                    vm.checked = true;
                    isAllValidated = 0;
                    break;
                }

            }

            // Refreshed the Grid
            if (isAllValidated == 1) {
                addProducts();
                dataSource.read();
            }
        }

        //Add Product in The Product GRID
        function addProducts() {
            //vm.validProducts = [];
            var data = vm.datSourceCorrector;
            for (var key in data.ProdctTransformResults) {
                if (!!data.ValidProducts[key]) {
                    for (var a = 0; a < data.ProdctTransformResults[key].length; a++) {
                        var value = data.ProdctTransformResults[key][a];
                        if (!!data.ValidProducts[key][value]) {
                            for (var i = 0; i < data.ValidProducts[key][value].length; i++) {
                                data.ValidProducts[key][value][i]["ROW_NUMBER"] = key;
                                vm.validProducts.push(data.ValidProducts[key][value][i]);
                            }
                        }
                    }
                }
            }
        }
    }
})();