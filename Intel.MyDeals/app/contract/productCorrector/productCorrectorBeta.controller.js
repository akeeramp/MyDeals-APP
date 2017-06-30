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
    vm.invalidProdName = '';
    vm.productsToDeleteUponSave = [];
    vm.ProductCorrectorData = util.deepClone(GetProductCorrectorData);
    vm.allDone = false;
    vm.curRowDone = false;

    vm.suggestionActions = [
        { text: 'Use Product Selector', primary: true, action: onProductSelector },
        { text: 'Delete Product', action: onDeleteProduct }
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
        for (var p = 0; p < vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId].length; p++) {
            var item = vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][p];
            var reason = "Found the Product";
            var status = "Good";
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

                    var name = [];
                    var pItem = vm.ProductCorrectorData.ValidProducts[vm.curRowId][item];
                    for (var n = 0; n < pItem.length; n++) {
                        name.push(pItem[n].HIER_VAL_NM);
                    }
                    matchName = name.length === 0 ? "" : name.length === 1 ? name[0] : name.length + " products";
                }

            }

            vm.curRowProds.push({
                "id": p,
                "name": item,
                "status": status,
                "reason": reason,
                "cnt": cnt,
                "matchName": matchName
            });

            if (matchName === "" && status === "Issue") isDirty = true;
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
                    if (!!dataitem[k]) {
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

        vm.curRowDone = !isDirty;

        if (!bypassFilter) vm.applyFilterAndGrouping();
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
                groupHeaderTemplate: "<span class=\"grpTitle\">#= value #</span>  <i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc'>Can't find what you are looking for?  <span class='or'>Use the</span> </span><span class='lnk' ng-click='vm.launchSelector(\"#=value#\")'>Product Selector</span><span class='or'> OR </span><span class='lnk' ng-click='vm.removeProd(\"#=value#\")'>Remove Product</span>",
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
            },
            {
                field: "MM_MEDIA_CD",
                title: "Media Code",
                width: "120px"
            },
        ]
    }

    vm.clickProd = function (id, lookup, name) {
        var item = util.findInArrayWhere(vm.curRowProds, "name", lookup);
        if (!item) return;

        item.matchName = name;

        if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId]) return;
        if (!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name]) return;

        var foundItem = util.findInArrayWhere(vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][item.name], "HIER_VAL_NM", item.matchName);
        if (!foundItem) return;

        if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId]) vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};
        if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name]) vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name] = [];
        vm.ProductCorrectorData.ValidProducts[vm.curRowId][item.name].push(foundItem);

        vm.removeAndFilter(item.name);

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

        var allMatched = true;
        for (var m = 0; m < vm.curRowProds.length; m++) {
            if (vm.curRowProds[m].matchName === "" && vm.curRowProds[m].status === "Issue") allMatched = false;
        }

        if (allMatched && vm.curRowIndx <= vm.numIssueRows) {
            if (!vm.nextAvailRow()) {
                // no more work to do
                vm.allDone = true;
            }
        } else {
            vm.selectRow(vm.curRowIndx);
        }
    }

    vm.openProdSelector = function (dataItem, rowId) {

        if (ProductRows.length > 1) {
            var currentPricingTableRow = ProductRows[rowId - 1];
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

                for (var key in validateSelectedProducts) {
                    if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId])
                        vm.ProductCorrectorData.ValidProducts[vm.curRowId] = {};

                    if (!vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName])
                        vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName] = [];

                    vm.ProductCorrectorData.ValidProducts[vm.curRowId][vm.invalidProdName].push(validateSelectedProducts[key][0]);

                }

                //vm.initProducts();
                vm.removeAndFilter(vm.invalidProdName);
                //vm.selectRow(vm.curRowId);
                vm.invalidProdName = '';

            });
    }

    vm.clkPrdUsrNm = function (dataItem) {
        if (dataItem.matchName === "") {
            // clear filters
            angular.forEach(vm.curRowIssues, function (value, key) {
                key.selected = false;
            });

            // filter this product
            var scope = angular.element(document.getElementById('fltrPrdChk' + dataItem.id)).scope();
            if (!scope) {
                // go to product selector
                vm.suggestAction(dataItem);
                return;
            }
            scope.$parent.item.selected = true;

            // perform filter
            vm.applyFilterAndGrouping();
        } else {
            // remove matched settings
            dataItem.matchName = "";

            vm.allDone = false;

            vm.ProductCorrectorData.ValidProducts[vm.curRowId][dataItem.name] = [];

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

        //alert('TODO: display popup for ' + prdNm + ':\n1) Exact match but with errors like prod outside deal range.\n2) Top 10 or 15 possible matches... maybe.');
        vm.openProdSelector(prdNm, key);
    }

    vm.removeProd = function (prdNm) {
        kendo.confirm("This will remove product (" + prdNm + ") from the <b>Product Corrector</b> AND from the <b>Pricing Table</b>?<br/>Would you like to delete this product?").then(function () {
            // record what we need to delete from the spreadsheet json
            vm.productsToDeleteUponSave.push({
                "name": prdNm,
                "rowId": vm.curRowId,
                "rowIndx": vm.curRowIndx
            });

            // delete from duplicates if exists
            if (!!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId] && !!vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdNm]) {
                delete vm.ProductCorrectorData.DuplicateProducts[vm.curRowId][prdNm];
            }

            // delete from invalid if exists
            var delItem = vm.ProductCorrectorData.InValidProducts[vm.curRowId];
            for (var i = 0; i < delItem.length; i++) {
                if (delItem[i] === prdNm) {
                    delItem.splice(i, 1);
                    //delete delItem[i];
                }
            }

            //Delete fromProdctTransformResults
            if (!!vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId] && !!vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][prdNm]) {
                delete vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId][prdNm];
            }
            var transItem = vm.ProductCorrectorData.ProdctTransformResults[vm.curRowId];
            for (var t = 0; t < transItem.length; t++) {
                if (transItem[t] === prdNm) {
                    transItem.splice(t, 1);
                    //delete transItem[t];
                }
            }

            // Delete from Issue Key
            for (var r = 0; r < vm.curRowProds.length; r++) {
                if (!!vm.curRowProds[r] && vm.curRowProds[r].name === prdNm) {
                    vm.curRowProds.splice(r, 1);
                    //delete vm.curRowProds[r];
                }
            }

            vm.selectRow(vm.curRowIndx);

            //alert('TODO: delete from corrector and spreadsheet');
        });
    }

    vm.suggestProd = function (prdNm) {
        kendo.confirm("This is where we would suggest results for " + prdNm.name + "?").then(function () { });
    }

    vm.nextAvailRow = function () {
        for (var r = 0; r < vm.issueRowKeys.length; r++) {
            vm.selectRow(r+1);
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

    vm.saveProducts = function() {

        // This might not be working
        var pRows = ProductRows;
        for (var d = 0; d < vm.productsToDeleteUponSave.length; d++) {
            var dItem = vm.productsToDeleteUponSave[d];
            var usrPrd = pRows[dItem.rowIndx - 1].PTR_USER_PRD;
            usrPrd += "---";
            debugger;

        }

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