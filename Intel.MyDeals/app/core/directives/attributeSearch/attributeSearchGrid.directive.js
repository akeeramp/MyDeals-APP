angular
    .module('app.core')
    .directive('attributeSearchGrid', attributeSearchGrid);

attributeSearchGrid.$inject = ['$compile', 'objsetService', '$timeout', '$filter', '$localStorage', '$window', 'userPreferencesService', 'logger', '$linq'];

function attributeSearchGrid($compile, objsetService, $timeout, $filter, $localStorage, $window, userPreferencesService, logger, $linq) {

    return {
        scope: {
            opOptions: '=',
            startDate: '=',
            endDate: '=',
            customers: '=',
            customFilter: '=',
            operatorSettings: '=',
            attributeSettings: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/attributeSearch/attributeSearchGrid.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {


            $scope.root = $scope.$parent;

            $scope.data = [];
            $scope.optionsDetails = {};
            $scope.dataDetails = {};
            $scope.newDataItemToAddOnExpand = null;

            $scope.isBusy = false;
            $scope.isBusyMsgTitle = "";
            $scope.isBusyMsgDetail = "";
            $scope.isBusyType = "";
            $scope.isBusyShowFunFact = false;
            $scope.searchText = "";
            $scope.curLinkedVal = "";
            $scope.columnSearchFilter = "";

            $scope.rulesDataSource = new kendo.data.DataSource({
                data: $scope.rules
            });

            $scope.$watch('ruleToRun', function (newValue, oldValue, scope) {
                if (newValue === oldValue) return;
                $scope.root.$broadcast('search-rule-loaded', newValue);
            });

            $scope.getOperators = function(fieldType) {
                var opers = $linq.Enumerable().From($scope.operatorSettings.types2operator)
                    .Where(function (x) {
                        return (x.type === fieldType);
                    }).ToArray()[0].operator;

                var operData = $linq.Enumerable().From($scope.operatorSettings.operators)
                    .Where(function (x) {
                        return (opers.indexOf(x.operator) >= 0);
                    }).ToArray();

                var rtn = {};
                for (var i = 0; i < operData.length; i++) {
                    rtn[operData[i].operCode] = operData[i].label;
                }

                return rtn;
            }

            $scope.initFilters = function() {
                $scope.moneyObjFilter = {
                    ui: function (element) {
                        element.kendoNumericTextBox({
                            format: "d",
                            decimals: 2
                        });
                    },
                    operators: {
                        object: $scope.getOperators("money")
                    }
                };

                $scope.numObjFilter = {
                    ui: function (element) {
                        element.kendoNumericTextBox({
                            format: "d",
                            decimals: 0
                        });
                    },
                    operators: {
                        object: $scope.getOperators("number")
                    }
                };

                $scope.objFilter = {
                    ui: function (element) {
                        element[0].className = "k-textbox";
                    }
                };

                for (var s = 0; s < $scope.attributeSettings.length; s++) {
                    var item = $scope.attributeSettings[s];
                    if (item.filterable !== undefined && typeof item.filterable === "string") {
                        if (item.filterable === "objFilter") item.filterable = $scope.objFilter;
                        else if (item.filterable === "numObjFilter") item.filterable = $scope.numObjFilter;
                        else if (item.filterable === "moneyObjFilter") item.filterable = $scope.moneyObjFilter;
                    }
                }
            }

            $scope.initFilters();

            $scope.getModel = function () {
                var fields = {};
                for (var s = 0; s < $scope.attributeSettings.length; s++) {
                    var item = $scope.attributeSettings[s];
                    fields[item.field] = {
                        type: item.dimKey !== undefined && item.dimKey !== "" ? "object" : item.type
                    }
                }
                return {
                    fields: fields
                };
            }

            $scope.getColumns = function() {
                var cols = [];
                for (var s = 0; s < $scope.attributeSettings.length; s++) {
                    var item = $scope.attributeSettings[s];
                    cols.push({
                        field: item.field,
                        title: item.title,
                        width: item.width,
                        format: item.format,
                        filterable: item.filterable,
                        template: item.template,
                        excelTemplate: item.excelTemplate,
                        bypassExport: item.bypassExport,
                        lookupValue: item.lookupValue,
                        lookupText: item.lookupText,
                        lookupUrl: item.lookupUrl,
                        lookups: item.lookups
                    });
                }
                return cols;
            }

            $scope.$on('reload-search-dataSource', function (event, args) {
                if (args !== undefined && args !== null && args.columns !== undefined) $scope.colsShowHide(args.columns);
                $scope.loadData();
            });

            $scope.$on('reload-search-rules', function (event, args) {
                $scope.loadRules(args);
            });

            $scope.colsShowHide = function(cols) {
                for (var i = 0; i < $scope.grid.columns.length; i++) {
                    if (cols === undefined || cols === null || cols.length === 0) {
                        $scope.grid.showColumn($scope.grid.columns[i].field);
                    } else {
                        if (cols.indexOf($scope.grid.columns[i].field) < 0) {
                            $scope.grid.hideColumn($scope.grid.columns[i].field);
                        } else {
                            $scope.grid.showColumn($scope.grid.columns[i].field);
                        }
                    }
                }
            }

            $scope.getDsOptions = function() {
                return {
                    type: 'odata',
                    transport: {
                        read: {
                            url: $scope.opOptions.url,
                            type: "GET",
                            dataType: "json"
                        }
                    },
                    schema: {
                        model: $scope.getModel(),
                        data: function(data) {
                            return data["Items"];
                        },
                        total: function(data) {
                            return data["Count"];
                        }
                    },
                    pageSize: 25,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    requestStart: function(e) {
                        $scope.setBusy($scope.opOptions.busy.search.title, $scope.opOptions.busy.search.message);
                    },
                    requestEnd: function(e) {
                        $scope.setBusy("", "");
                    }
                }
            };

            $scope.ds = new kendo.data.DataSource($scope.getDsOptions());

            $scope.gridOptions = {
                autoBind: false,
                dataSource: $scope.ds,
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains"
                        },
                        object: {
                            contains: "Contains"
                        }
                    }
                },
                filterMenuInit: function (e) {
                    var hideOperatorForAtrbs = ["OBJ_SET_TYPE_CD", "OBJ_SET_TYPE_CD", "Customer.CUST_NM", "WF_STG_CD", "MRKT_SEG", "REBATE_TYPE", "PROGRAM_PAYMENT", "PAYOUT_BASED_ON"];
                    if (hideOperatorForAtrbs.indexOf(e.field) >= 0) {
                        var firstValueDropDown = e.container.find("select:eq(0)").data("kendoDropDownList");
                        var infoMsg = e.container.find(".k-filter-help-text");
                        setTimeout(function () {
                            infoMsg.hide();
                            firstValueDropDown.wrapper.hide();
                        });
                    }
                },
                sortable: true,
                resizable: true,
                reorderable: true,
                scrollable: true,
                pageable: {
                    pageSizes: [25, 100, 250, "all"]
                },
                columns: $scope.getColumns()
            }

            $scope.saveCurrentToExcel = function () {
                gridUtils.dsToExcel($scope.grid, $scope.ds, "Search Export", true);
            }

            $scope.saveToExcel = function () {
                var newDsOptions = $scope.getDsOptions();
                newDsOptions.pageSize = 'all';
                newDsOptions.requestStart = function(e) {
                    $scope.setBusy($scope.opOptions.busy.export.title, $scope.opOptions.busy.export.message);
                };

                var ds = new kendo.data.DataSource(newDsOptions);

                //using fetch, so we can process the data when the request is successfully completed
                ds.fetch(function () {
                    gridUtils.dsToExcel($scope.grid, this, "Search Export", false);
                });

            }

            $scope.columnMenu = {
                openOnClick: true,
                open: function () {
                    $.each($scope.grid.columns, function () {
                        if (this.hidden) {
                            $("input[data-field='" + this.field + "']").prop("checked", false);
                        }
                    });
                }
            };

            $scope.onColumnChange = function (val) {
                var col = null;

                for (var i = 0; i < $scope.grid.columns.length; i++)
                    if ($scope.grid.columns[i]["field"] === val.field)
                        col = $scope.grid.columns[i];

                if (!col) return;

                if (col.hidden) {
                    $scope.grid.showColumn(val.field);
                } else {
                    $scope.grid.hideColumn(val.field);
                }


            }

            if ($scope.opOptions.customToolbarTemplate !== undefined) {
                $scope.gridOptions.toolbar = kendo.template($("#" + $scope.opOptions.customToolbarTemplate).html());
            }

            $scope.navToPath = function (dataItem) {
                $scope.setBusy("Looking for Contract", "Looking for the deal's contract");
                objsetService.getPath(dataItem.DC_ID, "WIP_DEAL").then(
                        function (data) {

                            $scope.setBusy("Found Contract", "Redirecting you there now", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            topbar.hide();

                            document.location.href = "/Contract#/manager/" + data.data;

                        },
                        function (response) {
                            logger.error("Could not find the Deal's contract.", response, response.statusText);
                            topbar.hide();
                        }
                    );
            }

            $scope.customFunc = function(func, dataItem) {
                return func(dataItem, $scope);
            }

            $scope.chkClick = function (dataItem) {
                $scope.root.chkClick(dataItem, $scope);
            }

            $scope.changeBidAction = function (e) {
                var dataItem = e.sender.$angular_scope.dataItem;
                $scope.root.changeBidAction(dataItem, $scope);
            }

            $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
                $timeout(function () {
                	var newState = msg != undefined && msg !== "";
                	if (isShowFunFact == null) { isShowFunFact = false; }

                    // if no change in state, simple update the text
                    if ($scope.isBusy === newState) {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                        $scope.isBusyShowFunFact = isShowFunFact;
                        return;
                    }

                    $scope.isBusy = newState;
                    if ($scope.isBusy) {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                        $scope.isBusyShowFunFact = isShowFunFact;
                    } else {
                        $timeout(function () {
                            $scope.isBusyMsgTitle = msg;
                            $scope.isBusyMsgDetail = !detail ? "" : detail;
                            $scope.isBusyType = msgType;
                            $scope.isBusyShowFunFact = isShowFunFact;
                        }, 500);
                    }
                });
            }

            $scope.EnterPressed = function (event) {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13) {
                    $scope.loadData();
                }
            };

            $scope.loadData = function () {
                $scope.gridOptions.dataSource.read();
            }

            $scope.loadRules = function (rules) {
                $scope.rulesDataSource = new kendo.data.DataSource({
                    data: rules
                });

                $scope.ruleToRun = "";
                $scope.rulesDataSource.read();
            }

            $scope.renderCustNm = function (dataItem) {
                return dataItem.CUST_MBR_SID;
            }

            $scope.clearSortingFiltering = function () {
                $scope.searchText = "";

                if ($scope.grid.dataSource.filter() !== undefined) {
                    $scope.grid.dataSource.filter({});
                }
                if ($scope.grid.dataSource.sort() !== undefined) {
                    $scope.grid.dataSource.sort({});
                }

                $scope.grid.dataSource.read();
            }

        }],
        link: function (scope, element, attr) {
            scope.elGrid = element;
            scope.grid = $(element).find(".search-grid").data("kendoGrid");
        }
    };
}

