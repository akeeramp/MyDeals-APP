(function () {
    'use strict';
    angular
       .module('app.admin') //TODO: once we integrate with contract manager change the module to contract
       .controller('ProductSelectorModalController', ProductSelectorModalController);

    ProductSelectorModalController.$inject = ['$filter', '$scope', '$uibModal', '$uibModalInstance', 'productSelectionLevels', 'enableSplitProducts', 'ProductSelectorService', 'pricingTableRow', '$timeout', 'logger', 'gridConstants', 'suggestedProduct'];

    function ProductSelectorModalController($filter, $scope, $uibModal, $uibModalInstance, productSelectionLevels, enableSplitProducts, ProductSelectorService, pricingTableRow, $timeout, logger, gridConstants, suggestedProduct) {
        var vm = this;
        // Non CPU verticals with drill down level 4
        var verticalsWithDrillDownLevel4 = ["EIA CPU", "EIA MISC"];
        var productTypeToApplyMediaCode = ["EIA CPU", "CPU", "EIA MISC"];
        var verticalsWithNoMMSelection = ["CS", "WC"];
        var verticalsWithGDMFamlyAsDrillLevel5 = ["CS", "EIA CS", "EIA CPU", 'EIA MISC']
        vm.productSelectionLevels = productSelectionLevels.data.ProductSelectionLevels;
        vm.productSelectionLevelsAttributes = productSelectionLevels.data.ProductSelectionLevelsAttributes;

        // Variables with vm are binded to HTML
        vm.showSuggestions = false;
        vm.suggestedProducts = [];
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
        vm.enableSplitProducts = enableSplitProducts;
        vm.splitProducts = false;
        vm.openCAPBreakOut = openCAPBreakOut;
        vm.showSingleProductHeirarchy = showSingleProductHeirarchy;
        vm.getVerticalsUnderMarkLevel = getVerticalsUnderMarkLevel;
        vm.isValidCapDetails = isValidCapDetails;
        vm.drillDownPrd = "Select";
        var searchProcessed = false;
        if (pricingTableRow.PROD_INCLDS == undefined || pricingTableRow.PROD_INCLDS == null || pricingTableRow.PROD_INCLDS == "") {
            pricingTableRow.PROD_INCLDS = 'All';
        }

        function populateValidProducts() {
            if (pricingTableRow.PTR_SYS_PRD == "") {
                return;
            }
            var sysProducts = JSON.parse(pricingTableRow.PTR_SYS_PRD);
            for (var key in sysProducts) {
                if (sysProducts.hasOwnProperty(key)) {
                    angular.forEach(sysProducts[key], function (item) {
                        vm.addedProducts.push(item);
                    });
                }
            }
        }

        function getVerticalsUnderMarkLevel(markLevelName) {
            var markLevel = vm.selectedPathParts.length == 0 ? 'MRK_LVL1' : 'MRK_LVL2';
            var verticals = vm.productSelectionLevels.filter(function (x) {
                return x[markLevel] == markLevelName && x['PRD_CAT_NM'] != null && x['PRD_CAT_NM'] != ""
            });

            verticals = $filter('unique')(verticals, 'PRD_CAT_NM');

            verticals = verticals.map(function (elem) {
                return elem.PRD_CAT_NM;
            }).join(" | ");

            return verticals;
        }

        populateValidProducts();

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
                return el.toString().trim().toUpperCase() === string.toString().trim().toUpperCase();
            });
            return newArr.length > 0;
        }

        var getProductSelectionResults = function (item, selectionLevel) {
            vm.items = [];
            vm.gridData = [];
            dataSourceProduct.read();
            var data = {
                "searchHash": item.path,
                "startDate": moment(pricingTableRow.START_DT).format("l"),
                "endDate": moment(pricingTableRow.END_DT).format("l"),
                "selectionLevel": selectionLevel,
                "drillDownFilter4": null,
                "drillDownFilter5": null,
                "custSid": pricingTableRow.CUST_MBR_SID,
                "geoSid": pricingTableRow.GEO_COMBINED.toString()
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

        function validateMediaCode(data, mediaCode) {
            if (mediaCode.toUpperCase() == "ALL") return data;
            var prdIdToremove = [];
            for (var p = 0; p < data.length; p++) {
                if (arrayContainsString(productTypeToApplyMediaCode, data[p].DEAL_PRD_TYPE)) {
                    if (data[p].MM_MEDIA_CD) {
                        if (!arrayContainsString(data[p].MM_MEDIA_CD.split(','), mediaCode)) {
                            prdIdToremove.push(data[p].PRD_MBR_SID);
                        }
                    } else {
                        prdIdToremove.push(data[p].PRD_MBR_SID);
                    }
                }
            }
            data = data.filter(function (x) {
                return !arrayContainsString(prdIdToremove, x.PRD_MBR_SID);
            });

            return data;
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
            vm.showSuggestions = false;
            vm.errorMessage = "";
            if (index === 0) {
                updateDrillDownPrd();
            }
            vm.selectedPathParts.splice(index, vm.selectedPathParts.length);
            var item = vm.selectedPathParts.length > 0 ? vm.selectedPathParts[vm.selectedPathParts.length - 1]
                : newItem();
            getItems(item);
        }

        function updateDrillDownPrd() {
            if (vm.drillDownPrd !== "Select" && vm.suggestedProducts.length > 0) {
                vm.drillDownPrd = "Select";
                vm.showSuggestions = true;
                vm.hideSelection = true;
            }
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
                    // Dont apply media code filter if its coming from searched results, as the filter applied on server side
                    if (!searchProcessed) {
                        vm.gridData = validateMediaCode(vm.gridData, pricingTableRow.PROD_INCLDS);
                    }
                    searchProcessed = false;
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
                // Add validations here
                vm.addedProducts.push(value);
            });
            vm.addedProducts = $filter("unique")(vm.addedProducts, 'PRD_MBR_SID');
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
                    field: "PRD_END_DTM",
                    title: "Product End Date",
                    type: "date",
                    template: "#= kendo.toString(new Date(PRD_END_DTM), 'M/d/yyyy') #",
                    width: "150px"
                },
                {
                    field: "CAP_START",
                    title: "CAP Availability Date",
                    template: "<div>{{vm.getFormatedDate(dataItem.CAP_START)}}</div>",
                    width: "150px"
                },
                {
                    field: "CAP_END",
                    title: "CAP End Date",
                    template: "<div>{{vm.getFormatedDate(dataItem.CAP_END)}}</div>",
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
                    field: "MM_MEDIA_CD",
                    title: "Media Code",
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

        vm.getPrductDetails = function (dataItem, priceCondition) {
            return [{
                'CUST_MBR_SID': pricingTableRow.CUST_MBR_SID,
                'PRD_MBR_SID': dataItem.PRD_MBR_SID,
                'GEO_MBR_SID': pricingTableRow.GEO_COMBINED,
                'DEAL_STRT_DT': moment(pricingTableRow.START_DT).format("l"),
                'DEAL_END_DT': moment(pricingTableRow.END_DT).format("l"),
                'getAvailable': 'N',
                'priceCondition': priceCondition
            }];
        }

        // TODO remove once integrated in CM
        function openCAPBreakOut(dataItem, priceCondition) {
            var productData = {
                'CUST_MBR_SID': pricingTableRow.CUST_MBR_SID,
                'PRD_MBR_SID': dataItem.PRD_MBR_SID,
                'GEO_MBR_SID': pricingTableRow.GEO_COMBINED,
                'DEAL_STRT_DT': moment(pricingTableRow.START_DT).format("l"),
                'DEAL_END_DT': moment(pricingTableRow.END_DT).format("l"),
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

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        }

        vm.save = function () {
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
                    MM_MEDIA_CD: x.MM_MEDIA_CD,
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
            var pricingTableSysProducts = {};
            angular.forEach(vm.addedProducts, function (item, key) {
                if (!pricingTableSysProducts.hasOwnProperty(item.USR_INPUT)) {
                    pricingTableSysProducts[item.USR_INPUT] = [item];
                } else {
                    pricingTableSysProducts[item.USR_INPUT].push(item);
                }
            });
            var productSelectorOutput = { 'splitProducts': vm.splitProducts, 'validateSelectedProducts': pricingTableSysProducts };
            $uibModalInstance.close(productSelectorOutput);
        }

        // Load mark levels when coming from a blank cell
        getItems();

        // Called when user enters value into search box and hits enter
        vm.searchProduct = function (userInput, columnType, isSuggestProduct) {
            userInput = !userInput ? vm.userInput : userInput;
            if (userInput == "") return [];
            if (isSuggestProduct) {
                vm.drillDownPrd = userInput;
                vm.userInput = userInput;
            }

            if (userInput.indexOf('"') >= 0) {
                columnType = "EPM_NM";
                userInput = userInput.replace(/["]/g, "");
            }

            var data = [{
                ROW_NUMBER: 1, // By default pass one as user will select only one value from popup
                USR_INPUT: userInput.replace(/\s\s+/g, ' '),
                EXCLUDE: "",
                FILTER: pricingTableRow.PROD_INCLDS,
                START_DATE: pricingTableRow.START_DT,
                END_DATE: pricingTableRow.END_DT,
                GEO_COMBINED: pricingTableRow.GEO_COMBINED,
                PROGRAM_PAYMENT: pricingTableRow.PROGRAM_PAYMENT,
                COLUMN_TYPE: !!columnType ? (columnType == "EPM_NM" ? 1 : 0) : 0,
                // Send 1 if EPM_NM
            }];

            ProductSelectorService.GetProductDetails(data, pricingTableRow.CUST_MBR_SID).then(function (response) {
                vm.showSuggestions = false;
                processProducts(response.data);
            }, function (response) {
                logger.error("Unable to get products.", response, response.statusText);
            });
        }

        function autoSearchForSuggestion() {
            if (suggestedProduct.mode == "auto") {
                vm.userInput = suggestedProduct.prodname;
                ProductSelectorService.IsProductExistsInMydeals(vm.userInput).then(function (response) {
                    if (response.data) {
                        setTimeout(function () {
                            vm.searchProduct();
                        }, 1500);
                    } else {
                        showAutocorrectedSuggestions(vm.userInput)
                    }
                }, function (response) {
                    logger.error("Unable to get check if product exists in MyDeals.", response, response.statusText);
                });
            }
        }

        function showAutocorrectedSuggestions(userInput) {
            ProductSelectorService.GetAutoCorrectedProduct(userInput).then(function (response) {
                vm.suggestedProducts = response.data;
                vm.showSuggestions = true;
            }, function (response) {
                logger.error("Unable to get auto-corrected product suggestions.", response, response.statusText);
            });
        }

        autoSearchForSuggestion();

        vm.clearSearch = function () {
            vm.selectPath(0);
            vm.userInput = "";
        }

        vm.productSuggestions = [];

        vm.productDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.productSuggestions);
                },
            }
        });

        vm.productOptions = {
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        var param = e.data.filter.filters[0].value;
                        if (param === "") {
                            e.success([]);
                        } else {
                            param = param.replace(/["]/g, "");
                            ProductSelectorService.GetSearchString(param).then(function (response) {
                                e.success(response.data);
                            }, function (response) {
                                logger.error("Unable to get product suggestions.", response, response.statusText);
                            });
                        }
                    },
                    parameterMap: function (data, action) {
                        var newParams = {
                            filter: data.filter.filters[0].value
                        };
                        return newParams;
                    }
                }
            },
            dataTextField: "Name",
            serverFiltering: true,
            filter: "startsWith",
            height: 300,
            delay: 700,
            minLength: 2,
            select: function (e) {
                vm.searchProduct(e.dataItem.Name, e.dataItem.Type);
            },
            //template: '<div class="productSelector searchTemplate">#: Name #<div><small><b>Type:</b> #= Type #</small></div></div>',
        };

        function showSingleProductHeirarchy(product) {
            var data = {
                "searchHash": product.HIER_NM_HASH,
                "startDate": moment(pricingTableRow.START_DT).format("l"),
                "endDate": moment(pricingTableRow.END_DT).format("l"),
                "selectionLevel": product.PRD_ATRB_SID,
                "drillDownFilter4": null,
                "drillDownFilter5": null,
                "custSid": pricingTableRow.CUST_MBR_SID,
                "geoSid": pricingTableRow.GEO_COMBINED.toString()
            }

            ProductSelectorService.GetProductSelectionResults(data).then(function (response) {
                processProducts(response.data);
            }, function (response) {
                logger.error("Unable to get products.", response, response.statusText);
            });
        }

        // Search functionality code, refine this further
        vm.productSearchValues = [];
        function processProducts(data) {
            vm.hideSelection = true;

            vm.errorMessage = "";
            vm.showSuggestions = false;

            vm.productSearchValues = [];
            vm.selectedPathParts = []; // Reset the breadcrumb
            vm.showSearchResults = false; // Hide the grid
            vm.searchItems = []; // store conflict hierarchical levels, for user selection

            vm.productSearchValues = data;

            vm.errorMessage = vm.productSearchValues.length == 0 ? "Unable to find this product. The product does not match the global filter criteria or is not active within the deal date range." : "";
            if (vm.errorMessage != "") {
                vm.showSuggestions = true;
            }
            var productCategories = $filter('unique')(vm.productSearchValues, 'PRD_CAT_NM');

            vm.searchItems = productCategories.map(function (i) {
                return {
                    name: i.PRD_CAT_NM,
                    level: "VERTICAL",
                    path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " "
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
                if (brandNames.length == 1 && brandNames[0].PRD_ATRB_SID == 7003) {
                    vm.selectPath(vm.selectedPathParts.length + 1);
                    return;
                }
                brandNames = $filter('unique')(brandNames, 'BRND_NM');
                vm.searchItems = brandNames.map(function (i) {
                    return {
                        name: i.BRND_NM,
                        level: "Brand",
                        vertical: item.vertical,
                        path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " " + i.BRND_NM + " "
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

                if (familyNames.length == 1 && familyNames[0].PRD_ATRB_SID == 7004) {
                    vm.selectPath(vm.selectedPathParts.length + 1);
                    return;
                }

                var familyNames = $filter('unique')(familyNames, 'FMLY_NM');
                vm.searchItems = familyNames.map(function (i) {
                    return {
                        name: i.FMLY_NM,
                        path: i.DEAL_PRD_TYPE + " " + i.PRD_CAT_NM + " " + i.BRND_NM + " " + i.FMLY_NM + " ",
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
                vm.selectedPathParts.push({ name: item.name, path: item.path });

                // Filter the search results based on the hierarchy
                var products = $filter('where')(vm.productSearchValues,
                   { 'PRD_CAT_NM': item.vertical, 'FMLY_NM': item.name, 'BRND_NM': item.brand });

                if (products.length == 1 && products[0].PRD_ATRB_SID == 7005) {
                    vm.selectPath(vm.selectedPathParts.length + 1);
                    return;
                }

                if (products.length == 1 && products[0].PRD_ATRB_SID > 7006) {
                    vm.selectedPathParts.push({
                        name: products[0].PCSR_NBR, path: products[0].DEAL_PRD_TYPE + " "
                            + products[0].PRD_CAT_NM + " " + products[0].BRND_NM + " " + products[0].FMLY_NM + " " + products[0].PCSR_NBR + " "
                    });
                }

                if (products.length == 1 && products[0].PRD_ATRB_SID > 7007) {
                    vm.selectedPathParts.push({
                        name: products[0].DEAL_PRD_NM, path: products[0].DEAL_PRD_TYPE + " "
                            + products[0].PRD_CAT_NM + " " + products[0].BRND_NM + " " + products[0].FMLY_NM + " "
                            + products[0].PCSR_NBR + " " + products[0].DEAL_PRD_NM + " "
                    });
                }

                vm.gridData = products;
                searchProcessed = true;
                dataSourceProduct.read();
                vm.searchItems = [];
                vm.showSearchResults = true;
                $timeout(function () {
                    toggleColumnsWhenEmpty(vm.gridData);
                });
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

        function getProductHeirarrchy(products) {
            products.map(function (a) {
                a.HIER_HASH = a.PRD_CAT_NM + ((a.BRND_NM == "" || a.BRND_NM == 'NA') ? "" : "|" + a.BRND_NM)
                    + ((a.FMLY_NM == "" || a.FMLY_NM == 'NA') ? "" : "|" + a.FMLY_NM)
                    + ((a.PCSR_NBR == "" || a.PCSR_NBR == 'NA') ? "" : "|" + a.PCSR_NBR)
                    + ((a.DEAL_PRD_NM == "" || a.DEAL_PRD_NM == 'NA') ? "" : "|" + a.DEAL_PRD_NM)
                    + ((a.MTRL_ID == "" || a.MTRL_ID == 'NA') ? "" : "|" + a.MTRL_ID);
                return a;
            });

            var heirarchy = [];
            for (var i = 0; i < products.length; i++) {
                var chain = products[i].HIER_HASH.split("|");
                var currentNode = heirarchy;
                for (var j = 0; j < chain.length; j++) {
                    var wantedNode = chain[j];
                    var lastNode = currentNode;
                    for (var k = 0; k < currentNode.length; k++) {
                        if (currentNode[k].name == wantedNode) {
                            currentNode = currentNode[k].items;
                            break;
                        }
                    }
                    // If we couldn't find an item in this list of children
                    // that has the right name, create one:
                    if (lastNode == currentNode) {
                        var newNode = currentNode[k] = { name: wantedNode, items: [] };
                        currentNode = newNode.items;
                    }
                }
            }

            return heirarchy;
        };

        vm.showTree = false;
        vm.treeData = [];
        vm.showHeirarrchyTree = function () {
            if (vm.addedProducts.length === 0) return;
            if (!vm.showTree) {
                vm.selectPath(0);
                vm.treeData.data = getProductHeirarrchy(vm.addedProducts),
                vm.tree.dataSource = vm.treeData;
            }
            vm.showTree = !vm.showTree;
        }

        vm.treeData = {
            data: getProductHeirarrchy(vm.addedProducts),
            schema: {
                model: {
                    children: "items",
                    hasChildren: function (e) {
                        var test = e.items.length;
                        return test > 0;
                    }
                }
            }
        }

        vm.tree = {
            dataSource: {}
        };
    }
})();