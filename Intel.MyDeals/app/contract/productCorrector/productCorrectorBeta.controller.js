angular
    .module('app.admin')
    .controller('ProductCorrectorBetaModalController', ProductCorrectorBetaModalController);

ProductCorrectorBetaModalController.$inject = ['$filter', '$scope', '$uibModalInstance', 'GetProductCorrectorData', 'ProductSelectorService', 'productCorrectorService', 'contractData', 'RowId', 'ProductRows', '$linq', '$timeout', 'logger', 'gridConstants', '$uibModal', 'CustSid'];

function ProductCorrectorBetaModalController($filter, $scope, $uibModalInstance, GetProductCorrectorData, ProductSelectorService, productCorrectorService, contractData, RowId, ProductRows, $linq, $timeout, logger, gridConstants, $uibModal, CustSid) {
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
    vm.isCalCollapsed = false;
    vm.isLvlCollapsed = false;
    vm.ProductCorrectorData = util.deepClone(GetProductCorrectorData);

    vm.suggestionActions = [
        { text: 'Product Selector', primary: true, action: onProductSelector },
        { text: 'Delete Product', action: onDeleteProduct },
        { text: 'Show Suggestions', action: onShowSuggestions }
    ];

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
            vm.rowDCId = ProductRows.length > 1
                ? ProductRows[vm.issueRowKeys[vm.curRowIndx - 1] - 1].DC_ID
                : ProductRows[0].DC_ID;
        }, 10);
    }


    vm.selectRow = function (indx) {
        var x;

        vm.curRowIndx = indx;
        vm.curRowId = vm.issueRowKeys[vm.curRowIndx - 1];
        updateRowDcId();
        vm.curRow = !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]
            ? vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]
            : vm.ProductCorrectorData.InValidProducts[vm.curRowId];
        vm.curRowProds = [];

        // Manage all products entered for the row's cell
        for (var p = 0; p < vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId].length; p++) {
            var item = vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][p];
            var reason = "Found the Product";
            var status = "Good";
            var matchId = "";
            var matchName = "";
            var cnt = 0;

            if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId] && !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item]) {
                reason = "Found multiple matches";
                status = "Issue";
                cnt += vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item].length;
            }
            if (!!vm.ProductCorrectorData.InValidProducts[vm.curRowId] && vm.ProductCorrectorData.InValidProducts[vm.curRowId].indexOf(item) >= 0) {
                reason = "Unable to locate the product";
                status = "Issue";
            }

            // Look for valid products with soft warnings
            if (!!vm.ProductCorrectorData.ValidProducts[vm.curRowId] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item] && !!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item][0]) {
                // recently fixed item
                if (status === "Issue") {
                    matchId = vm.ProductCorrectorData.ValidProducts[vm.curRowId][item][0].PRD_MBR_SID;
                    matchName = vm.ProductCorrectorData.ValidProducts[vm.curRowId][item][0].HIER_VAL_NM;
                }

                // check for soft warning, but need to research why Valid Products have an array of matches
            }

            vm.curRowProds.push({
                "id": p,
                "name": item,
                "status": status,
                "reason": reason,
                "cnt": cnt,
                "matchId": matchId,
                "matchName": matchName
            });
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
            var dataitem = vm.ProductCorrectorData.DuplicateProducts[vm.curRowId];
            for (var k in dataitem) {
                if (dataitem.hasOwnProperty(k)) {
                    vm.curRowPrdCnt++;
                    for (var r = 0; r < dataitem[k].length; r++) {
                        vm.curRowData.push(dataitem[k][r]);
                        if (curRowCategories.indexOf(dataitem[k][r].PRD_CAT_NM) < 0)
                            curRowCategories.push(dataitem[k][r].PRD_CAT_NM);
                        if (curRowLvl.indexOf(dataitem[k][r].PRD_ATRB_SID) < 0)
                            curRowLvl.push(dataitem[k][r].PRD_ATRB_SID);
                    }
                }
            }
        }

        // Build filters        
        for (x = 0; x < vm.curRowProds.length; x++) {
            if (vm.curRowProds[x].status === "Issue") {
                vm.curRowIssues.push({
                    "id": x,
                    "name": vm.curRowProds[x].name,
                    "value": vm.curRowProds[x].name,
                    "selected": false,
                    "status": vm.curRowProds[x].status,
                    "cnt": vm.curRowProds[x].cnt
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

        vm.applyFilterAndGrouping();
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
        if (vm.curRowPrdCnt > 1) {
            group.push({ field: "USR_INPUT", dir: "asc" });
        }
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
                if (data.InValidProducts.hasOwnProperty(key) && data.InValidProducts[key].length > 0) {
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
        pageSize: 50,
        schema: {
            model: {
                id: "PROD_MBR_SID",
                fields: {
                    "USR_INPUT": {
                        type: "string"
                    },
                    "HIER_VAL_NM": {
                        type: "string"
                    },
                    "PRD_CAT_NM": {
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
                    }
                }
            }
        }
    });

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
        enableHorizontalScrollbar: true,
        columns: [
            {
                field: "USR_INPUT",
                title: "User Entered",
                groupHeaderTemplate: "#= value #  <i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc'>Can't find what you are looking for?  <span class='or'>Use the</span> </span><span class='lnk' ng-click='vm.gotoSelector(\"#=value#\")'>Product Selector</span><span class='or'> OR </span><span class='lnk' ng-click='vm.removeProd(\"#=value#\")'>Remove Product</span>",
                hidden: true
            },
            {
                field: "selected",
                filterable: false,
                sortable: false,
                width: "50px",
                headerTemplate: "&nbsp;",
                template: '<input type=\'checkbox\' ng-click="vm.clickProd(#=data.PRD_MBR_SID#, \'#=data.USR_INPUT#\', \'#=data.HIER_VAL_NM#\')" ng-model="selected" class=\'check with-font\' id="prdChk#=data.PRD_MBR_SID#" /><label for="prdChk#=data.PRD_MBR_SID#"></label>'
            },
            {
                field: "HIER_VAL_NM",
                title: "Product",
                width: "150px"
            },
            {
                field: "PRD_CAT_NM",
                title: "Product Category",
                width: "80px",
                groupHeaderTemplate: "#= value #"
            },
            {
                field: "HIER_NM_HASH",
                title: "Product Details"
            },
            {
                field: "PRD_STRT_DTM",
                title: "Product Effective Date",
                template: "#= kendo.toString(new Date(PRD_STRT_DTM), 'M/d/yyyy') + ' - ' + kendo.toString(new Date(PRD_END_DTM), 'M/d/yyyy') #"
            },
            {
                field: "CAP",
                title: "CAP Info",
                template: "<op-popover ng-click='vm.openCAPBreakOut(dataItem, \"CAP\")' op-options='CAP' op-label='' op-data='vm.getPrductDetails(dataItem, \"CAP\")'>#=gridUtils.uiMoneyDatesControlWrapper(data, 'CAP', 'CAP_START', 'CAP_END')#</op-popover>",
                width: "150px"
            }
        ]
    }

    vm.clickProd = function (id, lookup, name) {

        var item = util.findInArrayWhere(vm.curRowProds, "name", lookup);
        if (!item) return;

        item.matchId = id;
        item.matchName = name;

        if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) return;
        if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name]) return;

        var foundItem = util.findInArrayWhere(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name], "PRD_MBR_SID", item.matchId);
        if (!foundItem) return;

        if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId]) vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};
        if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name]) vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name] = [];
        vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name].push(foundItem);

        // remove
        delete vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name];
        vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name] = {};

        vm.applyFilterAndGrouping();

        var allMatched = true;
        for (var m = 0; m < vm.curRowProds.length; m++) {
            if (vm.curRowProds[m].matchId === "" && vm.curRowProds[m].status === "Issue") allMatched = false;
        }

        if (allMatched && vm.curRowIndx <= vm.numIssueRows) {
            vm.nextRow();
        } else {
            vm.selectRow(vm.curRowIndx);
        }
    }

    vm.openProdSelector = function (dataItem) {
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

        if (!dataItem) {
            dataItem = "";
        }

        var suggestedProduct = {
            'mode': 'auto',
            'prodname': dataItem
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
                var obj = {}; // Local Object

                for (var key in validateSelectedProducts) {
                    const prodName = key;
                    obj[prodName] = validateSelectedProducts[key];
                }
                vm.ProductCorrectorData.ValidProducts[vm.curRowId] = obj;
            });
    }

    vm.clkPrdUsrNm = function (dataItem) {
        if (dataItem.matchId === "") {

            // clear filters
            angular.forEach(vm.curRowIssues, function (value, key) {
                key.selected = false;
            });

            // filter this product
            var scope = angular.element(document.getElementById('fltrPrdChk' + dataItem.id)).scope();
            if (!scope) {
                // go to product selector
                vm.gotoSelector(dataItem.name);
                return;
            }
            scope.$parent.item.selected = true;

            // perform filter
            vm.applyFilterAndGrouping();

        } else {

            // remove matched settings
            dataItem.matchId = "";
            dataItem.matchName = "";

            vm.ProductCorrectorData.ValidProducts[vm.curRowId][dataItem.name] = [];
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
    function onShowSuggestions(e) {
        vm.suggestProd(vm.suggestItem.name);
    }


    vm.gotoSelector = function (prdNm) {
        kendo.confirm("Unable to locate the product (" + prdNm + ").\nWould you like to look for it in the Product Selector?").then(function () {
            vm.launchSelector(prdNm);
        });
    }
    vm.launchSelector = function (prdNm) {
        var rowDcId = vm.rowDCId;
        var key = vm.curRowId;

        alert('TODO: display popup for ' + prdNm + ':\n1) Exact match but with errors like prod outside deal range.\n2) Top 10 or 15 possible matches... maybe.');
        vm.openProdSelector(prdNm);
    }

    vm.removeProd = function (prdNm) {
        kendo.confirm("This will remove product (" + prdNm + ") from the <b>Product Corrector</b> AND from the <b>Pricing Table</b>?<br/>Would you like to delete this product?").then(function () {
            alert('TODO: delete from corrector and spreadsheet');
        });
    }

    vm.suggestProd = function (prdNm) {
        kendo.confirm("This is where we would suggest results for " + prdNm.name + "?").then(function () { });
    }

    //Go to Next ROW for conflict or Invalid Product
    vm.nextRow = function () {
        var indx = vm.curRowIndx + 1;
        if (indx > vm.numIssueRows) return;
        vm.selectRow(indx);
    }

    //Go to Previous ROW for conflict or Invalid Product
    vm.prevRow = function () {
        var indx = vm.curRowIndx - 1;
        if (indx < 1) return;
        vm.selectRow(indx);
    }

    // Dismiss the Modal popup by clicking Cancel button
    vm.cancel = function () {
        $uibModalInstance.close(vm.ProductCorrectorData);
    }


    //Getting CAP Product Details for Tooltip
    vm.getPrductDetails = function (dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = ProductRows[vm.issueRowKeys[vm.curRowIndx - 1] - 1];
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

    //// NOT DONE
    vm.openCAPBreakOut = function (dataItem, priceCondition) {
        var currentPricingTableRow = [];
        if (ProductRows.length > 1) {
            currentPricingTableRow = ProductRows[vm.issueRowKeys[vm.curRowIndx - 1] - 1];
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

    //// NOT DONE
    vm.saveProducts = function () {

        // This might not be working

        GetProductCorrectorData = vm.ProductCorrectorData;

        for (var r = 0; r < vm.numIssueRows; r++) {
            var key = vm.issueRowKeys[r];

            if (!!GetProductCorrectorData.InValidProducts[key] && GetProductCorrectorData.InValidProducts[key].length === 0) {
                delete GetProductCorrectorData.InValidProducts[key];
            }

            if (!!GetProductCorrectorData.DuplicateProducts[key]) {
                if (Object.keys(GetProductCorrectorData.DuplicateProducts[key]).length === 0) {
                    delete GetProductCorrectorData.DuplicateProducts[key];
                } else {
                    var foundItems = false;
                    for (var k in GetProductCorrectorData.DuplicateProducts[key]) {
                        var item = GetProductCorrectorData.DuplicateProducts[key][k];
                        if (Array.isArray(item) && item.length > 0) foundItems = true;
                    }
                    if (!foundItems)
                        delete GetProductCorrectorData.DuplicateProducts[key];

                }
            }
        }

        $uibModalInstance.close(GetProductCorrectorData);

    }






    //Master Product Data massaging
    $timeout(function () {
        vm.initProducts();
        vm.selectRow(1);
    }, 1);

}