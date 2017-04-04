(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductSelectorController', ProductSelectorController);

    ProductSelectorController.$inject = ['$scope', 'dataService', 'ProductSelectorService', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$state'];

    function ProductSelectorController($scope, dataService, ProductSelectorService, logger, confirmationModal, gridConstants, $linq, $state) {
        var vm = this;
        vm.showGrid = false;
        var attributeMasterValues = '';
        var IncludeAttributeSelected = [1, 2];
        var ExcludeAttributeSelected;
        vm.userInput = [];
        vm.products = "";
        vm.invalidProducts = [];
        vm.multipleMatchProducts = [];
        vm.makeHierarchy = makeHierarchy;
        vm.addToMydealProducts = addToMydealProducts;
        var selectionLevel = '';
        vm.selectionLevelDropDownList = '';
        vm.PROD_MBR_SID = 0;
        vm.fetchProductDetails = fetchProductDetails;
        vm.makeHierarchy = makeHierarchy;
        $scope.IsVisible = false;

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
                                    loadSelectionLevelValues();
                                }
                            };
                            $scope.selectedIds = [0];
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
                    e.data["PRD_SELC_LVL"] = vm.selectionLevelDropDownList;
                    e.success(e.data);
                    logger.success("Product added.");
                    $scope.IsSelVisible = $scope.IsHidden ? false : true;
                }
            },
            pageSize: 10,
            schema: {
                model: {
                    id: "PROD_MBR_SID",
                    fields: {
                        USR_INPUT: { validation: { required: true } },
                        PRD_ATRB_SID: { validation: { required: true } },
                        PRD_SELC_LVL: { validation: { required: true } },
                        EXCLUDE: { validation: { required: false } },
                        FILTER: { validation: { required: false } },
                        START_DATE: { validation: { required: false }, type: "date" },
                        END_DATE: { validation: { required: false }, type: "date" },
                        "_behaviors": { type: "object" }
                    }
                }
            },
        });

        vm.gridOptionsProduct = {
            dataSource: vm.dataSourceProduct,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            enableHorizontalScrollbar:true,
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: { mode: "inline", confirmation: false },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
              {
                  command: [
                      { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                      { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }

                  ],
                  title: " ",
                  width: "100px"
              },
              { field: "USR_INPUT", title: "Product Name", width: "200px" },
              { field: "PRD_ATRB_SID", template: " #= PRD_SELC_LVL # ", title: "Selection Level", width: "200px", editor: selectionLevelDropDownList },
              { field: "EXCLUDE", title: "Exclude", width: "200px" },
              { field: "FILTER", template: " #= FILTER # ", title: "Filter", width: "200px" },
              { field: "START_DATE", template: "#=gridUtils.uiControlWrapper(data, 'START_DATE', \"date:'MM/dd/yyyy'\")#", title: "Start date", width: "200px" },
              { field: "END_DATE", template: "#=gridUtils.uiControlWrapper(data, 'END_DATE', \"date:'MM/dd/yyyy'\")#", title: "End Date", width: "200px" }
            ]
        };

        loadDDLValues();

        function loadSelectionLevelValues() {
            var dealTypeSelect = $("#dropdownDealType").data("kendoDropDownList");
            var value = dealTypeSelect.value();

            ProductSelectorService.GetProdSelectionLevel(value)
                .then(
                    function (response) {
                        if (response.statusText == "OK") {
                            selectionLevel = response.data;
                        }
                    },
                    function (response) {
                        logger.error("Unable to get Product.", response, response.statusText);
                    }
                );
        }
        function selectionLevelDropDownList(container, options) {
            $('<input id="selectionLevelDropDownList" required name="' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    optionLabel: "Select Level",
                    autoBind: false,
                    autoSync: true,
                    autoWidth: true,
                    dataTextField: "PRD_SELC_LVL",
                    dataValueField: "PRD_ATRB_SID",
                    dataSource:
                        {
                            data: selectionLevel,
                        },
                    change: function (e) {
                        vm.selectionLevelDropDownList = $("#selectionLevelDropDownList").data("kendoDropDownList").text();
                    }
                });
        }

        function fetchProductDetails() {
            var data = $scope.prodGrid._data;

            ProductSelectorService.TranslateProducts(data)
                .then(
                    function (response) {
                        if (response.statusText == "OK") {
                            vm.showGrid = true;
                            cookProducts(response.data);
                        }
                    },
                    function (response) {
                        logger.error("Unable to get Product.", response, response.statusText);
                    }
                );
        }

        vm.dataSource = new kendo.data.ObservableArray({});
        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable:true,
            columnMenu: true,
            scrollable: true,
            editable: "popup",
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
              {
                  command: [
                      { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                      { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }

                  ],
                  title: " ",
                  width: "100px"
              },
              { field: "USR_INPUT", template: " #= USR_INPUT # ", title: "User Input", width: "200px" },
              { field: "PRD_MBR_SID", title: "Product No", width: "200px" },
              { field: "PRD_CAT_NM", template: " #= PRD_CAT_NM # ", title: "Category Name", width: "200px" },
              { field: "BRND_NM", template: " #= BRND_NM # ", title: "Brand Name", width: "200px" },
              { field: "FMLY_NM", template: " #= FMLY_NM # ", title: "Family Name", width: "200px" },
              { field: "PCSR_NBR", template: " #= PCSR_NBR # ", title: "Processor No", width: "200px" },
              { field: "KIT_NM", template: " #= KIT_NM # ", title: "KIT Name", width: "200px" },
              
            ]
        };

        function cookProducts(data) {
            reset();
            for (var key in data.ProdctTransformResults) {
                for (var i = 0; i < data.ValidProducts[key].length; i++) {
                    vm.dataSource.push(data.ValidProducts[key][i]);
                }

                // Process invalid products to make html to display
                if (data.InValidProducts[key].length > 0) {
                    var object = { "Row": "", "Items": [] };
                    object.Row = key;
                    object.Items = data.InValidProducts[key].join(", ")
                    vm.invalidProducts.push(object);
                }

                // Process multiple match products to make html to display
                if (!!data.DuplicateProducts[key]) {
                    var object = { "Row": "", "Items": [] };
                    object.Row = key;
                    object.Items = !!data.DuplicateProducts[key] ? data.DuplicateProducts[key] : "";
                    vm.multipleMatchProducts.push(object);
                }
            }
        }

        var reset = function reset() {
            // Make observable array empty
            vm.dataSource.splice(0, vm.dataSource.length);
            vm.multipleMatchProducts = [];
            vm.invalidProducts = [];
        }

        // Build the Hierarchy
        function makeHierarchy(productHierarchy) {
            var ph = productHierarchy.PRD_CAT_NM;
            if (productHierarchy.BRND_NM !== "") ph += " / " + productHierarchy.BRND_NM;
            if (productHierarchy.FMLY_NM !== "") ph += " / " + productHierarchy.FMLY_NM;
            if (productHierarchy.PCSR_NBR !== "") ph += " / " + productHierarchy.PCSR_NBR;
            if (productHierarchy.DEAL_PRD_NM !== "") ph += " / " + productHierarchy.DEAL_PRD_NM;
            return ph;
        }

        // Add to my deals products from multiple match bucket
        function addToMydealProducts(p) {
            //  linq less number lines
            var productExists = $linq.Enumerable().From(vm.dataSource)
                .Where(function (x) {
                    return x.PRD_MBR_SID == p.PRD_MBR_SID;
                })
                .ToArray().length > 0;
            if (productExists) {
                logger.error("Product already exists.", "", "Not allowed");
            } else {
                vm.dataSource.push(p);
            }
        }
    }
})();