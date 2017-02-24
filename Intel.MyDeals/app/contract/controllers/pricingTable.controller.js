angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', 'pricingTableData', 'dataService', 'logger'];

function PricingTableController($scope, $state, $stateParams, pricingTableData, dataService, logger) {
    // Access to parent scope
    //
    var root = $scope.$parent.$parent;

    // Set Pricing Strategy ID and Object
    //
    if (root.curPricingStrategyId !== $stateParams.sid) {
        root.curPricingStrategyId = $stateParams.sid;
        root.curPricingStrategy = util.findInArray(root.contractData.PricingStrategy, root.curPricingStrategyId);
    }
    if (root.curPricingStrategy === null) {
        logger.error("Unable to locate Pricing Strategy " + $stateParams.sid);
        $state.go('contract.manager', { cid: root.contractData.DC_ID });
    }

    // Set Pricing Table ID and Object
    //
    if (root.curPricingTableId !== $stateParams.pid) {
        root.curPricingTableId = $stateParams.pid;
        if (root.curPricingStrategy.PricingTable !== undefined)
            root.curPricingTable = util.findInArray(root.curPricingStrategy.PricingTable, root.curPricingTableId);
    }
    if (root.curPricingTable === null) {
        logger.error("Unable to locate Pricing Table " + $stateParams.pid);
        $state.go('contract.manager', { cid: root.contractData.DC_ID });
    }

    $scope.$parent.$parent.spreadNeedsInitialization = true;
    $scope.getColumns = function (ptTemplate) {
        var cols = [];
        if (ptTemplate !== undefined && ptTemplate !== null) {
            angular.forEach(ptTemplate.columns, function (value, key) {
                var col = {};
                if (ptTemplate.columns[key].width) col.width = ptTemplate.columns[key].width;
                cols.push(col);
            });
        }
        return cols;
    }

    //data
    //
    root.pricingTableData = root.pricingTableData || pricingTableData.data;  // temporary until we use the db returned set
    //debugger;

    if (root.pricingTableData.PricingTable[0] === undefined) {
        root.pricingTableData.PricingTable[0] = { "_MultiDim": [] };
    }

    if (root.pricingTableData.WipDeals === undefined) {
        root.pricingTableData.WipDeals = [];
    }

    $scope.dataSpreadSheet = root.pricingTableData.PricingTable[0]._MultiDim;
    $scope.dataGrid = root.pricingTableData.WipDeals;

    var ptTemplate = root.templates.ModelTemplates.PricingTable[root.curPricingTable.OBJSET_TYPE_CD];
    var columns = $scope.getColumns(ptTemplate);

    $scope.colToLetter = {};

    // Define Kendo Spreadsheet options
    //
    root.spreadDs = new kendo.data.DataSource({
        data: $scope.dataSpreadSheet,
        schema: {
            model: ptTemplate.model
        }
    });

    //debugger;
    // sample reload data source call
    //root.spreadDs.read().then(function () {
    //    var view = root.spreadDs.view();
    //});

    $scope.ptSpreadOptions = {
        sheetsbar: false,
        columns: columns.length + 1,  // need to show one extra column for a bug in the spreadsheet... will remove it during render event
        toolbar: {
            home: false,
            insert: false,
            data: false
        },
        sheets: [
        {
            columns: columns
        }],
        change: function (e) {
            //debugger;
            $scope.$apply(function () {
                root._dirty = true;
            });
        },
        render: function (e) {
            if ($scope.$parent.$parent.spreadNeedsInitialization) {
                $scope.$parent.$parent.spreadNeedsInitialization = false;

                var intA = "A".charCodeAt(0);

                //debugger;
                var c = 1;
                var sheet = e.sender.activeSheet();

                // With initial configuration of datasource spreadsheet displays all the fields as columns,
                // thus setting up datasource in  reneder event where selective columns from datasource can be displayed.
                sheet.setDataSource(root.spreadDs, ptTemplate.columns);

                angular.forEach(ptTemplate.columns, function (value, key) {
                    $(".k-spreadsheet-view .k-spreadsheet-fixed-container .k-spreadsheet-pane .k-spreadsheet-column-header div:nth-of-type(" + c + ") div").html(value.title);
                    $scope.colToLetter[value.title] = String.fromCharCode(intA + c);
                    c++;
                });

                // hide default binding name (first row)
                sheet.hideRow(0);

                // now disable and remove the extra column we added for the spreadsheet bug
                // TODO find a better fix for this
                sheet.hideColumn(c - 1);
                var range = sheet.range(String.fromCharCode(intA + c) + "1:" + String.fromCharCode(intA + c) + "100");
                range.enable(false);
                // done with bug workaround
            }
        }
    };

    var wipTemplate = root.templates.ModelTemplates.WipDeals[root.curPricingTable.OBJSET_TYPE_CD];

    // Define Kendo Main Grid options
    //
    gridUtils.onDataValueChange = function (e) {
        root._dirty = true;
    }

    var gTools = new gridTools(wipTemplate.model, wipTemplate.columns);
    gTools.assignColSettings();

    root.gridDs = gTools.createDataSource($scope.dataGrid);
    $scope.mainGridOptions = {
        dataSource: root.gridDs,
        columns: gTools.cols,
        toolbar: "&nbsp;",
        scrollable: true,
        sortable: true,
        editable: true,
        navigatable: true,
        filterable: true,
        groupable: true,
        resizable: true,
        reorderable: true,
        columnMenu: true,
        save: gTools.saveCell,
        dataBound: function (e) {
            e.sender.thead.find("[data-index=0]>.k-header-column-menu").remove();
        }
    };

    // Define Kendo Details Grid options
    //
    root.gridDetailsDs = {};
    $scope.detailGridOptions = function (dataItem, pivotName) {
        var gt = new gridTools(wipTemplate.detailsModel, wipTemplate.detailsColumns);
        gt.assignColSettings();

        var idIndx = $scope.dataGrid.indexOfField("DC_ID", dataItem["DC_ID"]);
        var src = $scope.dataGrid[idIndx][pivotName];

        // define datasource not inline so we can reference it
        if (root.gridDetailsDs[dataItem["DC_ID"]] === undefined) root.gridDetailsDs[dataItem["DC_ID"]] = gt.createDataSource(src);
        return {
            dataSource: root.gridDetailsDs[dataItem["DC_ID"]],
            columns: gt.cols,
            sortable: true,
            editable: true,
            resizable: true,
            reorderable: true,
            save: gTools.saveCell,
            dataBound: function (e) {
                e.sender.thead.find("[data-index=0]>.k-header-column-menu").remove();
            }
        };
    };

    // Reset relative dirty bits
    //
    $scope.resetDirty = function () {
        var field = "isDirty";
        var mainData = $scope.mainGridOptions.dataSource.data();

        if ($scope.dataGrid !== undefined) {
            for (var i = 0; i < $scope.dataGrid.length; i++) {
                if (mainData[i] !== undefined) mainData[i]._dirty = false;
                angular.forEach(mainData[i],
                    function (value, key) {
                        var item = mainData[i];
                        if (item._behaviors[field] === undefined) item._behaviors[field] = {};
                        item._behaviors[field][key] = false;

                        //_MultiDim
                        if (!util.isNull(root.gridDetailsDs[item["DC_ID"]])) {
                            var detailData = root.gridDetailsDs[item["DC_ID"]].data();
                            for (var ii = 0; ii < item._MultiDim.length; ii++) {
                                detailData[ii]._dirty = false;
                                angular.forEach(detailData[ii],
                                    function (v1, k1) {
                                        var item2 = detailData[ii];
                                        if (item2._behaviors === undefined || item2._behaviors === null) item2._behaviors = {};
                                        if (item2._behaviors[field] === undefined || item2._behaviors[field] === null) item2._behaviors[field] = {};
                                        item2._behaviors[field][k1] = false;
                                    });
                            }
                        }
                    });
            }
        }
    }

    // Watch for any changes to contract data to set a dirty bit
    //
    $scope.$watch('$parent.$parent._dirty', function (newValue, oldValue, el) {
        if (newValue === false) {
            $scope.resetDirty();
        }
    }, true);

    // force a resize event to format page
    $scope.resizeEvent();

    topbar.hide();
}