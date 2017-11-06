angular
    .module('app.admin')
    .controller('ProductCorrectorBetaModalController', ProductCorrectorBetaModalController);

ProductCorrectorBetaModalController.$inject = ['$compile', '$filter', '$scope', '$uibModalInstance', 'GetProductCorrectorData', 'productSelectorService', 'productCorrectorService', 'contractData', 'RowId', 'ProductRows', '$linq', '$timeout', 'logger', 'gridConstants', '$uibModal', 'CustSid', 'dealType', 'confirmationModal', 'crossVertical'];

function ProductCorrectorBetaModalController($compile, $filter, $scope, $uibModalInstance, GetProductCorrectorData, productSelectorService, productCorrectorService, contractData, RowId, ProductRows, $linq, $timeout, logger, gridConstants, $uibModal, CustSid, dealType, confirmationModal, crossVertical) {
    var vm = this;
    vm.totRows = 0;
    vm.curRowIndx = 0;
    vm.numIssueRows = 0;
    vm.curRow = {};
    vm.issueRowKeys = [];
    vm.rowDCId = "";
    vm.curRowProds = [];
    vm.curRowData = [];
    vm.curRowIssues = [];
    vm.isPrdCollapsed = false;
    vm.isExcludePrdCollapsed = false;
    vm.isCalCollapsed = false;
    vm.isLvlCollapsed = false;
    vm.invalidProdName = '';
    vm.ProductCorrectorData = util.deepClone(GetProductCorrectorData);
    vm.ProductCorrectorData.AutoValidatedProducts = util.deepClone(GetProductCorrectorData.ValidProducts);
    vm.allDone = false;
    vm.curRowDone = false;
    vm.isValidCapDetails = isValidCapDetails;
    //vm.includeExcludeMode = CorrectorMode;
    vm.isIncludeProd = false;
    vm.isExcludeProd = false;
    vm.DEAL_TYPE = dealType;
    vm.showIncludeExcludeLabel = false;

    //Deal type checking: make it false if you don't want to show the label in Product(s) not found area.
    if (vm.DEAL_TYPE == "VOL_TIER" || vm.DEAL_TYPE == "PROGRAM") {
        vm.showIncludeExcludeLabel = true;
    }

    function prdLvlDecoder(indx) {
        if (indx === 7003) return "Product Category";
        if (indx === 7004) return "Brand";
        if (indx === 7005) return "Family";
        if (indx === 7006) return "Processor #";
        if (indx === 7007) return "L4";
        if (indx === 7008) return "Material Id";
        return "";
    }

    function updateRowDcId() {
        $timeout(function () {
            if (ProductRows.length > 1) {
                vm.rowDCId = $linq.Enumerable().From(ProductRows)
                                                .Where(function (x) {
                                                    return (x.ROW_NUMBER == vm.issueRowKeys[vm.curRowIndx - 1]);
                                                }).ToArray()[0].DC_ID
            } else {
                vm.rowDCId = ProductRows[0].DC_ID;
            }
        });
    }

    vm.selectRow = function (indx, bypassFilter) {
        var x;
        var isDirty = false;

        vm.curRowDone = false;
        vm.curRowIndx = indx;
        vm.curRowId = vm.issueRowKeys[vm.curRowIndx - 1];
        updateRowDcId();
        vm.curRow = !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]
            ? vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]
            : vm.ProductCorrectorData.InValidProducts[vm.curRowId];
        vm.curRowProds = [];

        // Manage all products entered for the row's cell
        for (var ptr in vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId]) {
            if (vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId].hasOwnProperty(ptr)) {
                for (var p = 0; p < vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][ptr].length; p++) {
                    var item = vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][ptr][p];
                    var reason = "Found the Product";
                    var status = "Good";
                    var exclude = "";
                    var matchName = [];
                    var cnt = 0;

                    if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId] && !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item]) {
                        reason = "Found multiple matches";
                        status = "Issue";
                        cnt += $linq.Enumerable().From(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item])
                                .Where(function (x) {
                                    return (x.EXCLUDE == (ptr == "E"));
                                }).ToArray().length;
                    }
                    if (!!vm.ProductCorrectorData.InValidProducts[vm.curRowId][ptr] && vm.ProductCorrectorData.InValidProducts[vm.curRowId][ptr].indexOf(item) >= 0) {
                        reason = "Unable to locate the product";
                        status = "Issue";
                        exclude = ptr;
                    }

                    // Look for valid products with soft warnings
                    if (!!vm.ProductCorrectorData.ValidProducts[vm.curRowId] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item][0]) {
                        // recently fixed item
                        if (status === "Issue") {
                            var name = [];
                            var pItem = vm.ProductCorrectorData.ValidProducts[vm.curRowId][item];
                            for (var n = 0; n < pItem.length; n++) {
                                name.push(pItem[n].HIER_VAL_NM);
                            }
                            matchName.push(name.length === 0 ? "" : name.length === 1 ? name[0] : name.length + " products");
                        }
                    }

                    vm.curRowProds.push({
                        "id": p,
                        "name": item,
                        "status": status,
                        "reason": reason,
                        "cnt": cnt,
                        "matchName": matchName,
                        "exclude": ptr
                    });

                    if (matchName.length === 0 && status === "Issue") isDirty = true;
                }
            }
        }

        //Build Datasource
        vm.curRowData = [];
        vm.curRowCategories = [];
        vm.curRowLvl = [];
        vm.curRowIssues = [];
        var curRowCategories = [];
        var curRowLvl = [];
        vm.curRowPrdCnt = 0;
        if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) {
            var flag = false;
            var dataitem = vm.ProductCorrectorData.DuplicateProducts[vm.curRowId];
            var validDataItem = vm.ProductCorrectorData.ValidProducts[vm.curRowId];
            for (var k in dataitem) {
                if (dataitem.hasOwnProperty(k)) {
                    vm.curRowPrdCnt++;
                    if (!!dataitem[k]) {
                        for (var r = 0; r < dataitem[k].length; r++) {
                            if (!!vm.ProductCorrectorData.ValidProducts[vm.curRowId]) {
                                if (!!vm.ProductCorrectorData.ValidProducts[vm.curRowId][k] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][k].length > 0) {
                                    var result = [];
                                    result = validDataItem[k].filter(function (value) {
                                        return value.PRD_MBR_SID == dataitem[k][r].PRD_MBR_SID;
                                    });
                                    if (result.length > 0) {
                                        var flag = true;
                                        dataitem[k][r]["IS_SEL"] = 'true';
                                    }
                                }
                            }
                            if (flag == false) {
                                dataitem[k][r]["IS_SEL"] = false;
                            }
                            vm.curRowData.push(dataitem[k][r]);
                            flag = false;
                            if (curRowCategories.indexOf(dataitem[k][r].PRD_CAT_NM) < 0)
                                curRowCategories.push(dataitem[k][r].PRD_CAT_NM);
                            if (curRowLvl.indexOf(dataitem[k][r].PRD_ATRB_SID) < 0)
                                curRowLvl.push(dataitem[k][r].PRD_ATRB_SID);
                        }
                    }
                }
            }
        }

        //Remove Search Header
        vm.isIncludeProd = $linq.Enumerable().From(vm.curRowProds)
                                            .Where(function (x) {
                                                return (x.exclude == "I");
                                            }).ToArray().length > 0;

        vm.isExcludeProd = $linq.Enumerable().From(vm.curRowProds)
                                .Where(function (x) {
                                    return (x.exclude == "E");
                                }).ToArray().length > 0;

        // Build filters
        for (x = 0; x < vm.curRowProds.length; x++) {
            if (vm.curRowProds[x].status === "Issue") {
                vm.curRowIssues.push({
                    "id": x,
                    "name": vm.curRowProds[x].name,
                    "value": vm.curRowProds[x].name,
                    "selected": false,
                    "status": vm.curRowProds[x].status,
                    "cnt": vm.curRowProds[x].cnt,
                    "exclude": vm.curRowProds[x].exclude
                });
            }
        }
        for (x = 0; x < curRowCategories.length; x++) {
            vm.curRowCategories.push({
                "id": x,
                "name": curRowCategories[x],
                "value": curRowCategories[x],
                "selected": false
            });
        }
        for (x = 0; x < curRowLvl.length; x++) {
            vm.curRowLvl.push({
                "id": x,
                "name": prdLvlDecoder(curRowLvl[x]),
                "value": curRowLvl[x],
                "selected": false
            });
        }

        vm.curRowDone = !isDirty;

        for (var key in vm.curRowIssues) {
            if (vm.curRowIssues.hasOwnProperty(key) && vm.curRowIssues[key].cnt == 0) {
                var emptyData = {
                    BRND_NM: "",
                    CAP: "",
                    CAP_END: "01/01/0001",
                    CAP_START: "01/01/001",
                    DEAL_PRD_NM: "",
                    DEAL_PRD_TYPE: "",
                    FMLY_NM: "",
                    HAS_L1: "",
                    HAS_L2: "",
                    HIER_NM_HASH: "",
                    HIER_VAL_NM: "",
                    MM_MEDIA_CD: "",
                    MTRL_ID: "",
                    PCSR_NBR: "",
                    PRD_ATRB_SID: "",
                    PRD_CAT_NM: "",
                    PRD_END_DTM: "01/01/0001",
                    PRD_MBR_SID: 0,
                    PRD_STRT_DTM: "01/01/0001",
                    USR_INPUT: vm.curRowIssues[key].name,
                    YCS2: "",
                    YCS2_END: "",
                    YCS2_START: "",
                    EXCLUDE: false
                }
                vm.curRowData.push(emptyData);
            }
        }

        if (!bypassFilter) vm.applyFilterAndGrouping();
        toggleColumnsWhenEmptyConflictGrid(vm.curRowData);
    }


    vm.clickFilter = function () {
        vm.applyFilterAndGrouping();
    }

    vm.applyFilterAndGrouping = function () {
        function buildFilterGroup(field, masterFilters, data) {
            var filters = [];
            var filterItem = $linq.Enumerable().From(data).Where(function (x) { return (x.selected); }).ToArray();
            for (var f = 0; f < filterItem.length; f++) {
                filters.push({ field: field, operator: "eq", value: filterItem[f].value });
            }

            if (filters.length === 0) return;

            masterFilters.push({
                logic: "or",
                filters: filters
            });
        }

        // Now apply grouping
        var group = [];
        group.push({ field: "USR_INPUT", dir: "asc" });
        //if (vm.curRowCategories.length > 1) {
        //    group.push({ field: "PRD_CAT_NM", dir: "asc" });
        //}
        vm.gridOptionsPotential.dataSource.group(group);

        // Now apply filtering
        var filters = [];
        buildFilterGroup("USR_INPUT", filters, vm.curRowIssues);
        buildFilterGroup("PRD_CAT_NM", filters, vm.curRowCategories);
        buildFilterGroup("PRD_ATRB_SID", filters, vm.curRowLvl);
        vm.gridOptionsPotential.dataSource.filter(filters);

        // Refresh Datasource
        vm.gridOptionsPotential.dataSource.read();

        $timeout(function () {
            $("#prodGrid").data("kendoGrid").resize();
        }, 10);
    }

    vm.initProducts = function () {
        vm.totRows = 0;
        vm.numIssueRows = 0;
        vm.issueRowKeys = [];
        vm.curRow = {};
        vm.curRowIndx = 0;
        vm.curRowProds = [];
        vm.curRowData = [];
        vm.curRowIssues = [];

        var key;
        var data = vm.ProductCorrectorData;
        var issueRowIds = [];

        if (!!data.DuplicateProducts) {
            for (key in data.DuplicateProducts) {
                if (data.DuplicateProducts.hasOwnProperty(key)) {
                    if (issueRowIds.indexOf(key) < 0) issueRowIds.push(key);
                    if (vm.issueRowKeys.indexOf(key) < 0) vm.issueRowKeys.push(key);
                }
            }
        }

        if (!!data.InValidProducts) {
            for (key in data.InValidProducts) {
                if (data.InValidProducts.hasOwnProperty(key) && (data.InValidProducts[key]["E"].length > 0
                        || data.InValidProducts[key]["I"].length > 0)) {
                    if (issueRowIds.indexOf(key) < 0) issueRowIds.push(key);
                    if (vm.issueRowKeys.indexOf(key) < 0) vm.issueRowKeys.push(key);
                }
            }
        }

        vm.numIssueRows = issueRowIds.length;
        vm.totRows = Object.keys(data.ProdctTransformResults).length;
    }

    vm.dataSourceProduct = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.curRowData);
            }
        },
        pageSize: 25,
        sort: {
            field: "IS_SEL",
            dir: "desc"
        },
        schema: {
            model: {
                id: "PROD_MBR_SID",
                fields: {
                    "USR_INPUT": {
                        type: "string"
                    },
                    "IS_SEL": {
                        type: "boolean"
                    },
                    "HIER_VAL_NM": {
                        type: "string"
                    },
                    "PRD_CAT_NM": {
                        type: "string"
                    },
                    "DEAL_PRD_NM": {
                        type: "string"
                    },
                    "GDM_FMLY_NM": {
                        type: "string"
                    },
                    "HIER_NM_HASH": {
                        type: "string"
                    },
                    "PRD_STRT_DTM": {
                        type: "string"
                    },
                    "CAP": {
                        type: "object"
                    },
                    "EXCLUDE": {
                        type: "boolean"
                    },
                    "BRND_NM": {
                        type: "string"
                    },
                    "FMLY_NM": {
                        type: "string"
                    }
                }
            }
        }
    });

    //Column toggling logic
    function toggleColumnsWhenEmptyConflictGrid(data) {
        var grid = $("#prodGrid").data("kendoGrid");
        if (!!grid) {
            angular.forEach(grid.columns, function (item, key) {
                var columnValue = $filter('unique')(data, item.field);
                if (columnValue.length == 1 && item.field !== undefined && item.field != "CheckBox" && item.field != "IS_SEL" && item.field != "USR_INPUT" && item.field != 'CAP' && item.field != 'YCS2' &&
                    (columnValue[0][item.field] == "" || columnValue[0][item.field] == null || columnValue[0][item.field] == 'NA')) {
                    grid.hideColumn(item.field);//hide column
                } else {
                    grid.showColumn(item.field); //show column
                }
            });
        }
    }

    function gridDataBound(e) {
        var grid = e.sender;
        var data = grid.dataSource.data();
        if (!data.length) {
            return;
        }
        for (var item in data) {
            if (data[item].PRD_MBR_SID == 0) {
                grid.tbody.find("tr[data-uid=" + data[item].uid + "]").hide();
                var expandLink = grid.tbody.find("tr[data-uid=" + data[item].uid + "]").closest("tr").prev().find("a");
                expandLink.on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                expandLink.css({ 'opacity': '0', 'cursor': 'default' });
            }
        }
    };

    vm.gridOptionsPotential = {
        dataSource: vm.dataSourceProduct,
        filterable: gridConstants.filterable,
        scrollable: true,
        sortable: true,
        resizable: true,
        reorderable: true,
        pageable: {
            pageSizes: gridConstants.pageSizes
        },
        dataBound: gridDataBound,
        enableHorizontalScrollbar: true,
        columns: [
             {
                 field: "EXCLUDE",
                 title: "",
                 width: "4px",
                 template: '<div class="fl gridStatusMarker #=EXCLUDE#" title="#=EXCLUDE#"></div>',
                 hidden: false,
                 filterable: false
             },
            {
                field: "USR_INPUT",
                title: "User Entered",
                width: "150px",
                groupHeaderTemplate: "<span class=\"grpTitle\">#= value #</span><i ng-click='vm.removeProd(\"#=value#\")' title=\"Remove Product\" class='intelicon-close-max skyblue pl10 removeProduct'></i>  <i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc'>Can't find what you are looking for?  <span class='or'>Use the</span> </span><span class='lnk' ng-click='vm.launchSelector(\"#=value#\")'>Product Selector</span>",
                hidden: false,
                filterable: { multi: true, search: true }
            },
            {
                field: "IS_SEL",
                filterable: false,
                sortable: {
                    initialDirection: "desc"
                },
                width: "50px",
                headerTemplate: "&nbsp;",
                template: '<div ng-if="!(vm.DEAL_TYPE == \'ECAP\' && dataItem.CAP.indexOf(\'-\') > -1)"><input type=\'checkbox\' ng-click="vm.clickProd(#=data.PRD_MBR_SID#, \'#=data.USR_INPUT#\', \'#=data.HIER_VAL_NM#\',$event)" ng-model="IS_SEL" class=\'check with-font\' id="prdChk#=data.PRD_MBR_SID#" ng-checked="#=IS_SEL#" checked ="#=IS_SEL#"/><label for="prdChk#=data.PRD_MBR_SID#"></label></div>' +
                          '<div ng-if="vm.DEAL_TYPE == \'ECAP\' && dataItem.CAP.indexOf(\'-\') > -1"><input type=\'checkbox\' title="CAP price cannot be a range." ng-disabled="true" ng-click="vm.clickProd(#=data.PRD_MBR_SID#, \'#=data.USR_INPUT#\', \'#=data.HIER_VAL_NM#\',$event)" ng-model="IS_SEL" class=\'check with-font\' id="prdChk#=data.PRD_MBR_SID#" ng-checked="#=IS_SEL#" checked ="#=IS_SEL#"/><label title="CAP price cannot be a range." ng-disabled="true" for="prdChk#=data.PRD_MBR_SID#"></label></div>'
            },
            {
                field: "HIER_VAL_NM",
                title: "Product",
                template: '<div ng-class="{\'text-danger\': vm.isValidCapDetails(dataItem)}" title="{{vm.isValidCapDetails(dataItem, true)}}">#= HIER_VAL_NM #</div>',
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "PRD_CAT_NM",
                title: "Product Category",
                width: "80px",
                groupHeaderTemplate: "#= value #",
                filterable: { multi: true, search: true }
            },
            {
                field: "BRND_NM",
                title: "Brand Name",
                width: "80px",
                groupHeaderTemplate: "#= value #",
                filterable: { multi: true, search: true }
            },
            {
                field: "FMLY_NM",
                title: "Family Name",
                width: "80px",
                groupHeaderTemplate: "#= value #",
                filterable: { multi: true, search: true }
            },
            {
                field: "PRD_STRT_DTM",
                title: "Product Effective Date",
                template: "#= kendo.toString(new Date(PRD_STRT_DTM), 'M/d/yyyy') + ' - ' + kendo.toString(new Date(PRD_END_DTM), 'M/d/yyyy') #",
                width: "120px"
            },
            {
                field: "CAP",
                title: "CAP Info",
                template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-label='' op-data='vm.getPrductDetails(dataItem, \"CAP\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'CAP', 'CAP_START', 'CAP_END')#</op-popover>",
                width: "150px"
            },
            {
                field: "MM_MEDIA_CD",
                title: "Media Code",
                width: "120px",
                filterable: { multi: true, search: true }
            },
            {
                field: "YCS2",
                title: "YCS2",
                width: "150px",
                template: "<op-popover op-options='YCS2' op-data='vm.getPrductDetails(dataItem, \"YCS2\")'>#= YCS2 #</op-popover>"
            },
            {
                field: "GDM_FMLY_NM",
                title: "GDM Family Name",
                template: "<div kendo-tooltip k-content='dataItem.GDM_FMLY_NM'>{{dataItem.GDM_FMLY_NM}}</div>",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "HIER_NM_HASH",
                title: "Product Description",
                template: "<div kendo-tooltip k-content='dataItem.HIER_NM_HASH'>{{dataItem.HIER_NM_HASH}}</div>",
                hidden: true
            },
            {
                field: "CPU_PROCESSOR_NUMBER",
                title: "CPU Processor number",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "MM_CUST_CUSTOMER",
                title: "MM Customer Name",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "FMLY_NM_MM",
                title: "EDW Family Name",
                template: "<div kendo-tooltip k-content='dataItem.FMLY_NM_MM'>{{dataItem.FMLY_NM_MM}}</div>",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "EPM_NM",
                title: "EPM Name",
                template: "<div kendo-tooltip k-content='dataItem.EPM_NM'>{{dataItem.EPM_NM}}</div>",
                width: "180px",
            },
            {
                field: "SKU_NM",
                title: "SKU Name",
                template: "<div kendo-tooltip k-content='dataItem.SKU_NM'>{{dataItem.SKU_NM}}</div>",
                width: "180px",
                filterable: { multi: true, search: true }
            },
            {
                field: "NAND_FAMILY",
                title: "NAND FAMILY",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "NAND_Density",
                title: "Nand Density",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_CACHE",
                title: "CPU CACHE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_PACKAGE",
                title: "CPU PACKAGE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_WATTAGE",
                title: "CPU WATTAGE",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "CPU_VOLTAGE_SEGMENT",
                title: "Voltage Segment",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "PRICE_SEGMENT",
                title: "Price Segment",
                width: "150px",
                filterable: { multi: true, search: true }
            },
            {
                field: "SBS_NM",
                title: "SBS Name",
                width: "150px",
                filterable: { multi: true, search: true }
            },
        ]
    }

    function getFullNameOfProduct(item) {
        if (item.PRD_ATRB_SID > 7005) return item.HIER_VAL_NM;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }

    function validCrossVerticals(item) {
        if (vm.DEAL_TYPE === 'ECAP') return true;
        var existingProductTypes = [];
        for (var key in vm.ProductCorrectorData.ValidProducts[vm.curRowId]) {
            angular.forEach(vm.ProductCorrectorData.ValidProducts[vm.curRowId][key], function (product) {
                existingProductTypes.push(product.PRD_CAT_NM);
            });
        }

        existingProdTypes = $filter("unique")(existingProductTypes, 'PRD_CAT_NM');

        var isValid = isValidProductCombination(existingProdTypes, item.PRD_CAT_NM);
        // Check if valid combination
        if (!isValid) {
            logger.error(crossVertical.message);
            //var modalOptions = {
            //    closeButtonText: 'Ok',
            //    actionButtonText: '',
            //    hasActionButton: false,
            //    headerText: '',
            //    bodyText: crossVertical.message
            //};
            //confirmationModal.showModal({}, modalOptions).then(function (result) {
            //    //
            //}, function (response) {
            //    //
            //});
        }
        return isValid;
    }

    function isValidProductCombination(existingProdTypes, newProductType) {
        var isValid = true;
        var selfCheck = newProductType == undefined;
        for (var i = 0; i < existingProdTypes.length; i++) {
            if (i == existingProdTypes.length - 1 && selfCheck) break;
            newProductType = selfCheck ? existingProdTypes[i + 1] : newProductType;
            if (arrayContainsString(crossVertical.productCombination1, existingProdTypes[i])) {
                isValid = arrayContainsString(crossVertical.productCombination1, newProductType);
                if (!isValid) break;
            }
            else if (arrayContainsString(crossVertical.productCombination2, existingProdTypes[i])) {
                isValid = arrayContainsString(crossVertical.productCombination2, newProductType);
                if (!isValid) break;
            } else {
                isValid = existingProdTypes[i] == newProductType;
                if (!isValid) break;
            }
        };
        return isValid
    }

    function arrayContainsString(array, string) {
        var newArr = array.filter(function (el) {
            return el.toString().trim().toUpperCase() === string.toString().trim().toUpperCase();
        });
        return newArr.length > 0;
    }

    vm.clickProd = function (id, lookup, name, event) {
        var item = util.findInArrayWhere(vm.curRowProds, "name", lookup);
        if (!item) return;

        var allMatched = true;
        var isChecked = event.target.checked;
        if (isChecked) {
            var foundItem = util.findInArrayWhere(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name], "PRD_MBR_SID", id);
            if (!validCrossVerticals(foundItem)) {
                event.target.checked = false;
                return;
            }
            //Item added from the selected List
            item.matchName.push(name);

            if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) return;
            if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name]) return;

            var foundItem = util.findInArrayWhere(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name], "PRD_MBR_SID", id);
            if (!foundItem) return;

            if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId]) vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};
            if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name]) vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name] = [];
            foundItem.HIER_VAL_NM = getFullNameOfProduct(foundItem);
            vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name].push(foundItem);

            vm.curRowData.forEach(function (item) {
                if (item.PRD_MBR_SID == foundItem.PRD_MBR_SID) {
                    item.IS_SEL = true;
                }
            });

            if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) {
                if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][lookup]) {
                    if (vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][lookup].length == 1) {
                        vm.removeAndFilter(item.name);
                    }
                }
            }
        }
        else {
            //Item deleted from the selected List
            var delIndex = item.matchName.indexOf(name);
            item.matchName.splice(delIndex, 1);

            if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) return;
            if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name]) return;

            var foundItem = util.findInArrayWhere(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name], "PRD_MBR_SID", id);
            if (!foundItem) return;

            if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId]) vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};
            if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name]) vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name] = [];

            vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name] = vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name].filter(function (obj) {
                return obj.USR_INPUT != lookup;
            });

            vm.curRowData.forEach(function (item) {
                if (item.PRD_MBR_SID == foundItem.PRD_MBR_SID) {
                    item.IS_SEL = false;
                }
            });
        }
    }

    vm.removeAndFilter = function (prdName) {
        // remove
        if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) {
            delete vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdName];
            vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdName] = {};
        }

        var isEmpty = true;
        for (var r = 0; r < vm.curRowIssues.length; r++) {
            if (vm.curRowIssues[r].name === prdName) vm.curRowIssues[r].cnt = NaN;
            if (!isNaN(vm.curRowIssues[r].cnt) && vm.curRowIssues[r].cnt > 0) isEmpty = false;
        }

        // let's purge the local storage if all products are matched
        if (isEmpty) {
            vm.curRowData = [];
        }

        vm.applyFilterAndGrouping();

        vm.selectRow(vm.curRowIndx);

        var allMatched = true;
        for (var m = 0; m < vm.curRowProds.length; m++) {
            if (vm.curRowProds[m].matchName.length == 0 && vm.curRowProds[m].status === "Issue") allMatched = false;
        }

        if (allMatched && vm.curRowIndx <= vm.numIssueRows) {
            if (!vm.nextAvailRow()) {
                // no more work to do
                vm.allDone = true;
            }
        }
    }

    vm.openProdSelector = function (dataItem, rowId) {
        if (ProductRows.length > 1) {
            var currentPricingTableRow = $linq.Enumerable().From(ProductRows)
                                                .Where(function (x) {
                                                    return (x.DC_ID == vm.rowDCId);
                                                }).ToArray()[0];
        }
        else {
            var currentPricingTableRow = ProductRows[0];
        }

        var pricingTableRow = {
            'START_DT': currentPricingTableRow.START_DT,
            'END_DT': currentPricingTableRow.END_DT,
            'CUST_MBR_SID': CustSid,
            'GEO_COMBINED': currentPricingTableRow.GEO_COMBINED,
            'PTR_SYS_PRD': "",
            'PTR_SYS_INVLD_PRD': "",
            'PROGRAM_PAYMENT': currentPricingTableRow.PROGRAM_PAYMENT,
            'PROD_INCLDS': currentPricingTableRow.PROD_INCLDS
        };

        if (!dataItem) {
            vm.invalidProdName = "";
        }
        else {
            vm.invalidProdName = dataItem;
        }

        // If the product name has mbr_sid as 0, it is invalid product
        var isProductExists = vm.curRowData.filter(function (x) {
            return x.USR_INPUT === dataItem && x.PRD_MBR_SID == 0
        }).length === 0;

        // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
        var indx = -1;
        vm.curRowProds.some(function (e, i) {
            if (e.name == dataItem) {
                indx = i;
                return true;
            }
        });
        var isExcludeProduct = vm.curRowProds[indx].exclude == "I" ? false : true;

        var suggestedProduct = {
            'mode': 'auto',
            'prodname': dataItem,
            'productExists': isProductExists,
            'isExcludeProduct': isExcludeProduct
        };

        var modal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productSelector/productSelector.html',
            controller: 'ProductSelectorModalController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: 'prdSelector-modal-window',
            resolve: {
                productSelectionLevels: ['productSelectorService', function (productSelectorService) {
                    var dtoDateRange = {
                        startDate: moment(pricingTableRow.START_DT).format("l"), endDate: moment(pricingTableRow.END_DT).format("l"), mediaCode: pricingTableRow.PROD_INCLDS
                    };
                    return productSelectorService.GetProductSelectorWrapper(dtoDateRange).then(function (response) {
                        return response;
                    }, function (response) {
                        logger.error("Unable to launch product selector.", response, response.statusText);
                    });
                }],
                pricingTableRow: angular.copy(pricingTableRow),
                enableSplitProducts: function () {
                    return false;
                },
                suggestedProduct: angular.copy(suggestedProduct),
                dealType: function () {
                    return dealType;
                }
            }
        });

        modal.result.then(
            function (productSelectorOutput) {
                var validateSelectedProducts = productSelectorOutput.validateSelectedProducts;

                for (var key in validateSelectedProducts) {
                    if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId])
                        vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};

                    if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName])
                        vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName] = [];

                    angular.forEach(validateSelectedProducts[key], function (product) {
                        var isValid = validCrossVerticals(product);
                        if (isValid) {
                            vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName].push(product);
                        }
                    });
                }

                vm.removeAndFilter(vm.invalidProdName);

                vm.invalidProdName = '';
            });
    }

    vm.clkPrdUsrNm = function (dataItem) {
        if (dataItem.status === "Good") return;
        if (dataItem.matchName.length == 0) {
            if (!!dataItem && dataItem.cnt <= 0) {
                vm.launchSelector(dataItem.name);
                return;
            }
            // clear filters
            angular.forEach(vm.curRowIssues, function (value, key) {
                value.selected = false;
                if (dataItem.name == value.name && value.cnt > 0) {
                    value.selected = true;
                }
            });

            // perform filter
            vm.applyFilterAndGrouping();

        } else {
            // remove matched settings
            dataItem.matchName = [];

            vm.allDone = false;

            vm.ProductCorrectorData.ValidProducts[vm.curRowId][dataItem.name] = [];
            delete vm.ProductCorrectorData.ValidProducts[vm.curRowId][dataItem.name]

            if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId])
                vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][dataItem.name] = GetProductCorrectorData.DuplicateProducts[vm.curRowId][dataItem.name];

            vm.selectRow(vm.curRowIndx);
        }
    }

    vm.suggestItem = {};
    vm.suggestAction = function (dataItem) {
        vm.suggestItem = dataItem;
        $scope.dialog.open();
    }

    vm.getFormatedDate = function (datVal) {
        var date = kendo.toString(new Date(datVal), 'M/d/yyyy');
        if (date === '1/1/0001') {
            return '';
        }
        return date;
    }

    function onProductSelector(e) {
        vm.launchSelector(vm.suggestItem.name);
    }
    function onDeleteProduct(e) {
        vm.removeProd(vm.suggestItem.name);
    }

    vm.launchSelector = function (prdNm, productExist) {
        var rowDcId = vm.rowDCId;
        var key = vm.curRowId;
        vm.openProdSelector(prdNm, key, productExist);
    }

    vm.removeProd = function (prdNm, exclude) {
        kendo.confirm("This will remove product (" + prdNm + ") from the <b>Product Corrector</b> AND from the <b>Pricing Table</b>?<br/>Would you like to delete this product?").then(function () {
            // delete from duplicates if exists
            if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId] && !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdNm]) {
                delete vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdNm];
            }

            // delete from valid if exists
            if (!!vm.ProductCorrectorData.ValidProducts[vm.curRowId] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][prdNm]) {
                delete vm.ProductCorrectorData.ValidProducts[vm.curRowId][prdNm];
            }

            // delete from invalid if exists
            // For exclude product repeat the loop to fetch exclude product also
            var cnt = 0;
            if (!exclude) {
                cnt = 1;
            }
            for (var m = 0; m <= cnt; m++) {
                var exclude = m == 0 ? "I" : "E";

                var delItem = vm.ProductCorrectorData.InValidProducts[vm.curRowId][exclude];
                if (!!delItem) {
                    for (var i = 0; i < delItem.length; i++) {
                        if (delItem[i] === prdNm) {
                            delItem.splice(i, 1);
                        }
                    }
                }

                //Delete fromProdctTransformResults
                if (!!vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][exclude] && !!vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][exclude][prdNm]) {
                    delete vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][exclude][prdNm];
                }
                var transItem = vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][exclude];
                for (var t = 0; t < transItem.length; t++) {
                    if (transItem[t] === prdNm) {
                        transItem.splice(t, 1);
                        //delete transItem[t];
                    }
                }

                // Delete from Issue Key
                for (var r = 0; r < vm.curRowProds.length; r++) {
                    if (!!vm.curRowProds[r] && vm.curRowProds[r].name === prdNm && vm.curRowProds[r].exclude === exclude) {
                        vm.curRowProds.splice(r, 1);
                    }
                }
            }

            //Remove Search Header
            vm.isIncludeProd = $linq.Enumerable().From(vm.curRowProds)
                                                .Where(function (x) {
                                                    return (x.exclude == "I");
                                                }).ToArray().length > 0;

            vm.isExcludeProd = $linq.Enumerable().From(vm.curRowProds)
                                    .Where(function (x) {
                                        return (x.exclude == "E");
                                    }).ToArray().length > 0;

            vm.selectRow(vm.curRowIndx);
        });
    }

    vm.nextAvailRow = function () {
        for (var r = 0; r < vm.issueRowKeys.length; r++) {
            vm.selectRow(r + 1);
            if (!vm.curRowDone) {
                return true;
            }
        }
        return false;
    }

    vm.nextRow = function () {
        var indx = parseInt(vm.curRowIndx) + 1;
        if (indx > vm.numIssueRows) return false;
        vm.selectRow(indx);
        return true;
    }

    vm.prevRow = function () {
        var indx = parseInt(vm.curRowIndx) - 1;
        if (indx < 1) return false;
        vm.selectRow(indx);
        return true;
    }

    // Dismiss the Modal popup by clicking Cancel button
    vm.cancel = function () {
        vm.curRowData = [];
        vm.curRowProds = [];
        GetProductCorrectorData.AutoValidatedProducts = util.deepClone(GetProductCorrectorData.ValidProducts);
        $uibModalInstance.close(GetProductCorrectorData);
    }

    //Getting CAP Product Details for Tooltip
    vm.getPrductDetails = function (dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = $linq.Enumerable().From(ProductRows)
                                                .Where(function (x) {
                                                    return (x.ROW_NUMBER == vm.issueRowKeys[vm.curRowIndx - 1]);
                                                }).ToArray()[0];
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

    vm.openCAPBreakOut = function (dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = $linq.Enumerable().From(ProductRows)
                                                .Where(function (x) {
                                                    return (x.ROW_NUMBER == vm.issueRowKeys[vm.curRowIndx - 1]);
                                                }).ToArray()[0];
        }
        else {
            currentPricingTableRow = ProductRows[0];
        }

        var productData = {
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
                productData: angular.copy(productData)
            }
        });

        capModal.result.then(
            function () {
            },
            function () {
            });
    }

    vm.saveProducts = function () {
        for (var r = 0; r < vm.numIssueRows; r++) {
            var key = vm.issueRowKeys[r];

            if (!!vm.ProductCorrectorData.InValidProducts[key] && vm.ProductCorrectorData.InValidProducts[key].length === 0) {
                delete vm.ProductCorrectorData.InValidProducts[key];
            }

            if (!!vm.ProductCorrectorData.DuplicateProducts[key]) {
                if (Object.keys(vm.ProductCorrectorData.DuplicateProducts[key]).length === 0) {
                    delete vm.ProductCorrectorData.DuplicateProducts[key];
                } else {
                    var foundItems = false;
                    for (var k in vm.ProductCorrectorData.DuplicateProducts[key]) {
                        //If any Item present in Valid List Delete from Duplicate
                        if (!!vm.ProductCorrectorData.ValidProducts[key]) {
                            if (!!vm.ProductCorrectorData.ValidProducts[key][k]) {
                                if (vm.ProductCorrectorData.ValidProducts[key][k].length > 0) {
                                    delete vm.ProductCorrectorData.DuplicateProducts[key][k];
                                }
                            }
                        }

                        var item = vm.ProductCorrectorData.DuplicateProducts[key][k];
                        if (Array.isArray(item) && item.length > 0) foundItems = true;
                    }
                    if (!foundItems)
                        delete vm.ProductCorrectorData.DuplicateProducts[key];
                }
            }

            if (!!vm.ProductCorrectorData.InValidProducts[key]) {
                var exclude = "";
                for (var m = 0; m <= 1; m++) {
                    exclude = (m == 0) ? "I" : "E";
                    if (vm.ProductCorrectorData.InValidProducts[key][exclude]) {
                        var invalidCopy = angular.copy(vm.ProductCorrectorData.InValidProducts[key][exclude]);
                        for (var j = 0; j < vm.ProductCorrectorData.InValidProducts[key][exclude].length; j++) {
                            var foundItems = false;
                            prodName = vm.ProductCorrectorData.InValidProducts[key][exclude][j];
                            if (!!vm.ProductCorrectorData.ValidProducts[key]) {
                                var item = vm.ProductCorrectorData.ValidProducts[key][prodName];
                                if (Array.isArray(item) && item.length > 0) foundItems = true;
                                if (foundItems) {
                                    // delete from invalid if exists
                                    var delItem = invalidCopy;
                                    for (var i = 0; i < delItem.length; i++) {
                                        if (delItem[i] === prodName) {
                                            invalidCopy.splice(i, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    vm.ProductCorrectorData.InValidProducts[key][exclude] = invalidCopy;
                }

            }
        }

        $uibModalInstance.close(vm.ProductCorrectorData);
    }

    function isValidCapDetails(productJson, showErrorMesssage) {
        if (vm.DEAL_TYPE !== 'ECAP') {
            return !showErrorMesssage ? false : productJson.HIER_NM_HASH;
        }
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

    //Master Product Data massaging
    $timeout(function () {
        vm.initProducts();
        vm.selectRow(1);
    }, 1);
}