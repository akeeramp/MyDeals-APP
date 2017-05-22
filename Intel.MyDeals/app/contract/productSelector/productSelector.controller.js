(function () {
    'use strict';
    angular
       .module('app.admin') //TODO: once we integrate with contract manager change the module to contract
       .controller('ProductSelectorModalController', ProductSelectorModalController);

    ProductSelectorModalController.$inject = ['$filter', '$scope', '$uibModal', '$uibModalInstance', 'productSelectionLevels', 'ProductSelectorService', 'contractData', '$timeout', 'logger', 'gridConstants'];

    function ProductSelectorModalController($filter, $scope, $uibModal, $uibModalInstance, productSelectionLevels, ProductSelectorService, contractData, $timeout, logger, gridConstants) {
        var vm = this;
        // Non CPU verticals with drill down level 4
        var verticalsWithDrillDownLevel4 = ["EIA CPU", "EIA MISC"];
        var verticalsWithNoMMSelection = ["CS", "WC"];
        var verticalsWithGDMFamlyAsDrillLevel5 = ["CS", "EIA CS", "EIA CPU", 'EIA MISC']
        vm.productSelectionLevels = productSelectionLevels.data.ProductSelectionLevels;
        vm.productSelectionLevelsAttributes = productSelectionLevels.data.ProductSelectionLevelsAttributes;

        // Variables with vm are binded to HTML
        vm.selectedPathParts = [];
        vm.items = [];
        vm.gridData = [];
        vm.selectedProducts = [];
        vm.addedProducts = [];
        vm.userInput = "";
        vm.selectItem = selectItem;
        vm.gridSelectItem = gridSelectItem;
        vm.selectPath = selectPath;
        vm.getDisplayTemplate = getDisplayTemplate;
        vm.addProducts = addProducts;
        vm.clearProducts = clearProducts;
        vm.hideSelection = false;
        vm.selectedItems = [];
        vm.prdSelLvlAtrbsForCategory = [];

        // Get the drilldown items based on the selection level
        // The selection follows a pattern, if only single item present select it,
        // if the selected item is NA look for the alternate columns for values ex: GDM Family, NAND Famliy
        var getItems = function (item) {
            vm.selectedItems = []; // Clear the selected items, when user moves around drill levels
            if (vm.selectedPathParts.length === 0) {
                var markLevel1 = $filter('unique')(vm.productSelectionLevels, 'MRK_LVL1');

                vm.items = markLevel1.filter(function (i) {
                    return i.MRK_LVL1 != null
                        && i.MRK_LVL1 != ""
                        && i.PRD_MRK_MBR_SID != null;
                }).map(function (i) {
                    return {
                        name: i.MRK_LVL1,
                        path: '',
                    }
                });
                return;
            }
            if (vm.selectedPathParts.length === 1) {
                var markLevel2 = $filter('unique')(vm.productSelectionLevels, 'MRK_LVL2');
                vm.items = markLevel2.filter(function (i) {
                    return i.MRK_LVL2 != null
                            && i.MRK_LVL2 != ""
                            && i.MRK_LVL1 == item.name
                            && i.PRD_MRK_MBR_SID != null;
                }).map(function (i) {
                    return {
                        name: i.MRK_LVL2,
                        path: ''
                    }
                });
                if (vm.items.length == 1) {
                    vm.selectItem(vm.items[0]);
                }
                return;
            }
            if (vm.selectedPathParts.length === 2) {
                var markLevel2 = $filter('where')(vm.productSelectionLevels, {
                    'MRK_LVL1': vm.selectedPathParts[0].name,
                    'MRK_LVL2': item.name,
                    'PRD_ATRB_SID': 7003
                });
                markLevel2 = $filter('unique')(markLevel2, 'PRD_CAT_NM');
                vm.items = markLevel2.map(function (i) {
                    return {
                        name: i.PRD_CAT_NM,
                        path: i.HIER_NM_HASH // From this level we get hierarchy to get deal products
                    }
                });
                if (vm.items.length == 1) {
                    vm.selectItem(vm.items[0]);
                }
                return;
            }
            if (vm.selectedPathParts.length === 3) {
                var brandName = vm.productSelectionLevels.filter(function (i) {
                    return i.PRD_CAT_NM == item.name && i.PRD_ATRB_SID == 7004;
                });
                brandName = $filter('unique')(brandName, 'BRND_NM');
                vm.items = brandName.map(function (i) {
                    return {
                        name: i.BRND_NM,
                        path: i.HIER_NM_HASH
                    }
                });

                // For non CPU products check for GDM columns
                // All this special handling would go if GDM attributes are populated at hierarchical columns
                if (vm.items.length == 1 && vm.items[0].name == 'NA') {
                    vm.prdSelLvlAtrbsForCategory = vm.productSelectionLevelsAttributes.filter(function (x) {
                        return x.PRD_CAT_NM == item.name
                    });
                    if (arrayContainsString(verticalsWithDrillDownLevel4, item.name)) {
                        vm.items = $filter('unique')(vm.prdSelLvlAtrbsForCategory, 'GDM_BRND_NM');
                        vm.items = vm.items.map(function (i) {
                            return {
                                name: i.GDM_BRND_NM,
                                path: item.path,
                                drillDownFilter4: i.GDM_BRND_NM == "" ? 'Blank_GDM' : i.GDM_BRND_NM
                            }
                        });
                        if (vm.items.length == 1) {
                            vm.selectItem(vm.items[0])
                        }
                    } else {
                        vm.selectItem(vm.items[0]);
                    }
                }
                return;
            }
            if (vm.selectedPathParts.length === 4) {
                var familyName = vm.productSelectionLevels.filter(function (i) {
                    return i.HIER_NM_HASH.startsWith(item.path) && i.PRD_ATRB_SID == 7005;
                });

                familyName = $filter('unique')(familyName, 'FMLY_NM');
                vm.items = familyName.map(function (i) {
                    return {
                        name: i.FMLY_NM,
                        path: i.HIER_NM_HASH
                    }
                });

                if (vm.items.length == 1 && vm.items[0].name == 'NA') {
                    var drillLevel5 = $filter('unique')(vm.prdSelLvlAtrbsForCategory, 'PRD_FMLY_TXT');
                    // Check if we have prd_fmly_txt

                    if ((drillLevel5.length == 1 && drillLevel5[0].PRD_FMLY_TXT == "") ||
                        arrayContainsString(verticalsWithGDMFamlyAsDrillLevel5, drillLevel5[0].PRD_CAT_NM)) {
                        // If null or empty fall back to GDM_FMLY_NM
                        drillLevel5 = $filter('unique')(vm.prdSelLvlAtrbsForCategory, 'GDM_FMLY_NM');
                        if (vm.selectedPathParts[3].drillDownFilter4 != undefined && vm.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                            drillLevel5 = drillLevel5.filter(function (x) {
                                return x.GDM_BRND_NM == vm.selectedPathParts[3].drillDownFilter4;
                            })
                        }
                        vm.items = drillLevel5.map(function (i) {
                            return {
                                name: i.GDM_FMLY_NM, //TODO Chane these values in db
                                path: vm.items[0].path,
                                drillDownFilter5: i.GDM_FMLY_NM == "" ? 'Blank' : i.GDM_FMLY_NM,
                                drillDownFilter4: vm.selectedPathParts[3].drillDownFilter4
                            }
                        });
                    } else {
                        if (vm.selectedPathParts[3].drillDownFilter4 != undefined && vm.selectedPathParts[3].drillDownFilter4 != "Blank_GDM") {
                            drillLevel5 = drillLevel5.filter(function (x) {
                                return x.PRD_FMLY_TXT == vm.selectedPathParts[3].drillDownFilter4;
                            })
                        }
                        vm.items = drillLevel5.map(function (i) {
                            return {
                                name: i.PRD_FMLY_TXT,
                                path: vm.items[0].path,
                                drillDownFilter5: i.PRD_FMLY_TXT == "" ? 'Blank_PRD' : i.PRD_FMLY_TXT,
                                drillDownFilter4: vm.selectedPathParts[3].drillDownFilter4
                            }
                        });
                    }

                    if (vm.items.length == 1) {
                        vm.selectItem(vm.items[0]);
                    }
                }
                return;
            }
            if (vm.selectedPathParts.length === 5) {
                getProductSelectionResults(item, 7006);
                return;
            }
            if (vm.selectedPathParts.length === 6) {
                getProductSelectionResults(item, 7007);
                return;
            }
            if (vm.selectedPathParts.length === 7) {
                getProductSelectionResults(item, 7008);
                return;
            }
        }

        // TODO: Move this to util.js
        function arrayContainsString(array, string) {
            var newArr = array.filter(function (el) {
                return el === string;
            });
            return newArr.length > 0;
        }

        var getProductSelectionResults = function (item, selectionLevel) {
            vm.items = [];
            vm.gridData = [];
            dataSourceProduct.read();
            var data = {
                "searchHash": item.path,
                "startDate": contractData.START_DT,
                "endDate": contractData.END_DT,
                "selectionLevel": selectionLevel,
                "drillDownFilter4": null,
                "drillDownFilter5": null,
                "custSid": contractData.CUST_MBR_SID,
                "geoSid": contractData.GEO_MBR_SID.toString()
            }

            // We need to send two special attributes for getting the data for non CPU products
            // drillDownFilter4 = GDM_BRND_NM/EDW Product Family/GDM_FMLY depends upon vertical
            // drillDownFilter5 = GDM_FMLY/NAND Family depends upon vertical
            if (selectionLevel == 7007) {
                data.drillDownFilter4 = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4,
                data.drillDownFilter5 = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5
            }

            ProductSelectorService.GetProductSelectionResults(data).then(function (response) {
                if (response.data.length == 1 && response.data[0].HIER_VAL_NM == 'NA') {
                    //if the processor number is NA, send GDM values to filter out L4 data
                    response.data[0]['drillDownFilter4'] = (!!!item.drillDownFilter4 && item.drillDownFilter4 == "") ? null : item.drillDownFilter4;
                    response.data[0]['drillDownFilter5'] = (!!!item.drillDownFilter5 && item.drillDownFilter5 == "") ? null : item.drillDownFilter5;
                    vm.gridSelectItem(response.data[0]);
                } else {
                    vm.gridData = response.data;
                    toggleColumnsWhenEmpty(vm.gridData);
                    dataSourceProduct.read();
                }
            });
        }

        function toggleColumnsWhenEmpty(data) {
            var grid = $("#prodGrid").data("kendoGrid");
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

        // When user clicks on the drill down levels
        function selectItem(item) {
            vm.selectedPathParts.push(item);
            getItems(item);
        }

        // Called when user clicks on grid column hyper links for drill down PCSR->L4->MM
        function gridSelectItem(dataItem) {
            var item = newItem();
            item.name = dataItem.HIER_VAL_NM;
            item.path = dataItem.HIER_NM_HASH,
            item.drillDownFilter4 = dataItem.drillDownFilter4,
            item.drillDownFilter5 = dataItem.drillDownFilter5,
            vm.selectedPathParts.push(item);
            getItems(item);
        }

        // When user clicks on the breadcrumb
        function selectPath(index) {
            vm.hideSelection = false;
            vm.errorMessage = "";
            vm.selectedPathParts.splice(index, vm.selectedPathParts.length);
            var item = vm.selectedPathParts.length > 0 ? vm.selectedPathParts[vm.selectedPathParts.length - 1]
                : newItem();
            getItems(item);
        }

        var newItem = function () {
            return {
                'name': '',
                'path': '',
                'drillDownFilter4': '',
                'drillDownFilter5': '',
            }
        }

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

        function getDisplayTemplate() {
            var displayTemplateType = vm.items.length == 0 ? "prodGrid" : (vm.items.length < 8 ? "btnGroup" : "btnGrid");
            return displayTemplateType;
        }

        function addProducts() {
            // Add them to box, check for duplicate prd_mbr_sid
            angular.forEach(vm.selectedItems, function (value, key) {
                if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                    vm.addedProducts.push(value);
                }
            });
        }

        // Grid ddiplay helper functions
        function clearProducts() {
            vm.addedProducts = [];
        }

        vm.checkForBlank = function (val) {
            if (val == "") {
                return "Blank";
            }
            return val;
        }

        vm.allowMMSelection = function (dataItem) {
            if (dataItem.PRD_ATRB_SID == 7007) {
                return !arrayContainsString(verticalsWithNoMMSelection, dataItem.PRD_CAT_NM);
            }
            return false;
        }

        vm.getFormatedDate = function (datVal) {
            var date = kendo.toString(new Date(datVal), 'M/d/yyyy');
            if (date == '1/1/0001') {
                return '';
            }
            return date;
        }

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
                    template: "<a role='button' ng-if='dataItem.PRD_ATRB_SID == 7006' ng-click='vm.gridSelectItem(dataItem)'>#= PCSR_NBR #</a><div ng-if='dataItem.PRD_ATRB_SID != 7006'>#= PCSR_NBR #</div>",
                    width: "150px"
                },
                {
                    field: "DEAL_PRD_NM",
                    title: "Deal Product Name",
                    template: "<a role='button' ng-if='vm.allowMMSelection(dataItem)' ng-click='vm.gridSelectItem(dataItem)'>#= DEAL_PRD_NM #</a><div ng-if='!vm.allowMMSelection(dataItem)'>#= DEAL_PRD_NM #</div>",
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
                    field: "CAP_START_DATE",
                    title: "CAP Availability date",
                    template: "<div>{{vm.getFormatedDate(dataItem.CAP_START_DATE)}}</div>",
                    width: "150px"
                },
                {
                    field: "CPU_PROCESSOR_NUMBER",
                    title: "CPU Processor number",
                    width: "150px"
                },
                {
                    field: "FMLY_NM_MM",
                    title: "EDW Family Name",
                    template: "<div kendo-tooltip k-content='dataItem.EPM_NMFMLY_NM_MM'>{{dataItem.FMLY_NM_MM}}</div>",
                    //template: "<div kendo-tooltip k-content='dataItem.FMLY_NM_MM'>{{(dataItem.FMLY_NM_MM | limitTo: 20) + (dataItem.FMLY_NM_MM.length > 20 ? '...' : '')}}</div>",
                    width: "150px"
                },
                {
                    field: "EPM_NM",
                    title: "EPM Name",
                    //TODO: Convert this a limitTo directive
                    template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{dataItem.EPM_NM}}</div>",
                    //template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{(dataItem.EPM_NM | limitTo: 20) + (dataItem.EPM_NM.length > 20 ? '...' : '')}}</div>",
                    width: "180px"
                },
                {
                    field: "SKU_NM",
                    title: "SKU Name",
                    template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{dataItem.SKU_NM}}</div>",
                    //template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{(dataItem.SKU_NM | limitTo: 20) + (dataItem.SKU_NM.length > 20 ? '...' : '')}}</div>",
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
        }

        vm.getPrductDetails = function (dataItem, priceCondition) {
            return [{
                'CUST_MBR_SID': contractData.CUST_MBR_SID,
                'PRD_MBR_SID': dataItem.PRD_MBR_SID,
                'GEO_MBR_SID': contractData.GEO_MBR_SID.toString(),
                'DEAL_STRT_DT': contractData.START_DT,
                'DEAL_END_DT': contractData.END_DT,
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
                    contractData: angular.copy(contractData),
                }
            });

            capModal.result.then(
                function () {
                },
                function () {
                });
        }

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        }

        vm.save = function () {
            logger.success("Products add successful");
            $uibModalInstance.dismiss();
        }

        // Load mark levels when coming from a blank cell
        getItems();

        // Called when user enters value into search box and hits enter
        vm.searchProduct = function (row) {
            // TODO when Integrated make  remove this
            row = 1;
            if (vm.userInput == "") return;
            var searchObject = [{
                ROW_NUMBER: row,
                USR_INPUT: vm.userInput,
                EXCLUDE: "",
                FILTER: "",
                START_DATE: contractData.START_DT,
                END_DATE: contractData.END_DT
            }];

            ProductSelectorService.TranslateProducts(searchObject, contractData.CUST_MBR_SID, contractData.GEO_MBR_SID.toString()).then(function (response) {
                processProducts(response.data);
            }, function (response) {
                logger.error("Unable to get products.", response, response.statusText);
            });
        }

        vm.clearSearch = function () {
            vm.selectPath(0);
            vm.userInput = "";
        }

        // Search functionality code, refine this further
        vm.productSearchValues = [];
        function processProducts(data) {
            vm.hideSelection = true;
            vm.errorMessage = "";
            vm.productSearchValues = [];
            vm.selectedPathParts = []; // Reset the breadcrumb
            vm.showSearchResults = false; // Hide the grid
            vm.searchItems = []; // store conflict hierarchical levels, for user selection

            var validProductMatches = data["ValidProducts"];
            var products = validProductMatches[1];
            if (products.length > 0) {
                vm.productSearchValues = products;
            }

            // If empty look out for conflicts
            if (vm.productSearchValues.length === 0) {
                var multipleMatch = data["DuplicateProducts"];
                var duplicateProducts = multipleMatch[1];
                for (var key in duplicateProducts) {
                    vm.productSearchValues = duplicateProducts[key];
                }
            }

            vm.errorMessage = vm.productSearchValues.length == 0 ? "Unable to match with a valid product. Click on Select to find products" : "";
            var productCategories = $filter('unique')(vm.productSearchValues, 'PRD_CAT_NM');

            vm.searchItems = productCategories.map(function (i) {
                return {
                    name: i.PRD_CAT_NM,
                    level: "VERTICAL",
                    path: i.DEAL_PRD_TYPE + "/" + i.PRD_CAT_NM + "/"
                }
            });
            if (vm.searchItems.length == 1) {
                vm.selectsearchItem(vm.searchItems[0]);
            }
            return;
        }

        vm.selectsearchItem = function (item) {
            if (item.level == "VERTICAL") {
                var markLevel = $filter('where')(vm.productSelectionLevels, {
                    PRD_CAT_NM: item.name,
                    PRD_ATRB_SID: 7003,
                });

                var markLvl2s = $filter('unique')(markLevel, 'MRK_LVL2');
                vm.searchItems = markLvl2s.map(function (i) {
                    return {
                        name: i.MRK_LVL2,
                        vertical: item.name,
                        verticalPath: item.path,
                        path: '',
                        level: "MARKLEVEL2"
                    }
                });
                if (vm.searchItems.length == 1) {
                    vm.selectsearchItem(vm.searchItems[0]);
                }
                return;
            }
            if (item.level == "MARKLEVEL2") {
                var markLevel1s = $filter('where')(vm.productSelectionLevels, {
                    PRD_CAT_NM: item.vertical,
                    PRD_ATRB_SID: 7003,
                    MRK_LVL2: item.name
                });

                var markLevel1 = markLevel1s[0].MRK_LVL1;

                vm.selectedPathParts = [{ name: markLevel1 },
                    { name: item.name }, { name: item.vertical, path: item.verticalPath }];

                var brandNames = $filter('where')(vm.productSearchValues, { 'PRD_CAT_NM': item.vertical });
                brandNames = $filter('unique')(brandNames, 'BRND_NM');
                vm.searchItems = brandNames.map(function (i) {
                    return {
                        name: i.BRND_NM,
                        level: "Brand",
                        vertical: item.vertical,
                        path: i.DEAL_PRD_TYPE + "/" + i.PRD_CAT_NM + "/" + i.BRND_NM + "/"
                    }
                });
                if (vm.searchItems.length == 1) {
                    vm.selectsearchItem(vm.searchItems[0]);
                }
                return;
            }
            if (item.level == "Brand") {
                vm.selectedPathParts.push(item);
                var familyNames = $filter('where')(vm.productSearchValues,
                    { 'PRD_CAT_NM': item.vertical, 'BRND_NM': item.name });

                var familyNames = $filter('unique')(familyNames, 'FMLY_NM');

                vm.searchItems = familyNames.map(function (i) {
                    return {
                        name: i.FMLY_NM,
                        path: i.DEAL_PRD_TYPE + "/" + i.PRD_CAT_NM + "/" + i.BRND_NM + "/" + i.FMLY_NM + "/",
                        brand: i.BRND_NM,
                        vertical: i.PRD_CAT_NM,
                        level: 'Family'
                    }
                });
                if (vm.searchItems.length == 1) {
                    vm.selectsearchItem(vm.searchItems[0]);
                }
                return;
            }
            if (item.level == "Family") {
                // Filter the search results based on the hierarchy
                var products = $filter('where')(vm.productSearchValues,
                   { 'PRD_CAT_NM': item.vertical, 'FMLY_NM': item.name, 'BRND_NM': item.brand });

                // Due to  bug in product translation will not be able to further drill down to next level,
                // hence currently showing all L4 for the hierarchy
                vm.selectedPathParts.push({ name: item.name, path: item.path });
                vm.gridData = products;
                dataSourceProduct.read();
                vm.searchItems = [];
                vm.showSearchResults = true;
                $timeout(function () {
                    toggleColumnsWhenEmpty(vm.gridData);
                });
            }
        }
    }
})();