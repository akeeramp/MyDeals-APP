angular
    .module('app.core')
    .directive('attributeBuilder', attributeBuilder);

attributeBuilder.$inject = ['$compile', 'objsetService', '$timeout', '$filter', '$localStorage', '$window', 'userPreferencesService', 'logger', '$linq'];

function attributeBuilder($compile, objsetService, $timeout, $filter, $localStorage, $window, userPreferencesService, logger, $linq) {

    return {
        scope: {
            gridId: '=',
            operatorSettings: '=',
            attributeSettings: '=',
            customSettings: '=',
            runSearch: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/attributeBuilder/attributeBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.root = $scope.$parent;
            $scope.data = [];
            $scope.myRules = [];
            $scope.fieldDict = {};
            $scope.currentRule = "";
            $scope.currentRuleColumns = "";
            $scope.lookupDs = {};

            $scope.tenderAttributeBuilder = ($scope.customSettings !== undefined && $scope.customSettings.length) > 0;

            for (var i = 0; i < $scope.attributeSettings.length; i++) {
                $scope.fieldDict[$scope.attributeSettings[i].field] = $scope.attributeSettings[i].type;
            }

            $scope.attributeSettingsCopy = angular.copy($scope.attributeSettings).sort(function (a, b) {
                var x = a["title"];
                var y = b["title"];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });

            if ($scope.data.length === 0) {
                if ($scope.tenderAttributeBuilder) {
                    //tender dashboard requires deal type as preset required search attribute
                    angular.forEach($scope.customSettings, function (val) {
                        val.source = $scope.attributeSettingsCopy;
                    });
                    $scope.data = $scope.customSettings;

                } else {
                    $scope.data = [
                        {
                            field: "",
                            operator: "",
                            value: "",
                            source: new kendo.data.DataSource({
                                data: $scope.attributeSettingsCopy
                            })
                        }
                    ];
                }
            }

            $scope.loadMyRules = function () {
                userPreferencesService.getActions("DealSearch", "SearchRules")
                    .then(function (data) {
                        $scope.myRules = data.data.length > 0 ? JSON.parse(data.data[0].PRFR_VAL) : [];
                        $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                    },
                    function (response) {
                        logger.error("Unable to get your list of rules.", response, response.statusText);
                    });
            }

            $scope.attributeDataSource = new kendo.data.DataSource({
                data: $scope.attributeSettingsCopy
            });

            $scope.changeField = function (e) {
                e.sender.$angular_scope.$apply(function () {
                    var dataItem = e.sender.$angular_scope.dataItem;
                    dataItem.operatorDataSource = $scope.getOperDatasource(dataItem.field);
                    dataItem.value = "";
                    dataItem.operator = "=";

                    var el = $(e.sender.element).closest(".filterRow").find(".abValue");
                    $scope.drawValueControl(el, e.sender.$angular_scope);
                });
            }

            $scope.changeOper = function (e) {
                e.sender.$angular_scope.$apply(function () {
                    var el = $(e.sender.element).closest(".filterRow").find(".abValue");
                    $scope.drawValueControl(el, e.sender.$angular_scope);
                });
            }

            $scope.isGlobal = function () {
                return ($scope.data.length === 1 &&
                    $scope.data.field === undefined &&
                    $scope.data.operator === undefined &&
                    $scope.data.value === undefined);
            }

            $scope.validateRules = function () {

                // global search check is allowed
                if ($scope.isGlobal()) return true;

                var invalidRows = $linq.Enumerable().From($scope.data)
                    .Where(function (x) {
                        return (x.field === "" || x.operator === "" || x.value === "");
                    }).ToArray();

                if (invalidRows.length > 0) {
                    kendo.alert("This rule is not complete.  Please fix the rule before proceeding.");
                    return false;
                }

                return true;
            }

            $scope.fixRules = function () {
                var invalidRows = $scope.validateRules();
                for (var i = 0; i < invalidRows.length; i++) {
                    $scope.removeRow(invalidRows[i]);
                }
            }

            $scope.generateCurrentRule = function () {
                return $linq.Enumerable().From($scope.data)
                    .Select(function (x) {
                        return {
                            type: $scope.fieldDict[x.field],
                            field: x.field,
                            operator: x.operator,
                            value: x.value
                        };
                    }).ToArray();
            }

            $scope.saveRule = function () {
                if (!$scope.validateRules()) return;

                if ($scope.currentRule === "") {
                    $scope.saveAsRule();
                    return;
                }

                var curRule = $linq.Enumerable().From($scope.myRules)
                    .Where(function (x) {
                        return (x.title.toUpperCase() === $scope.currentRule.toUpperCase());
                    }).ToArray()[0];

                curRule.rule = $scope.data;
                curRule.columns = $scope.getColumns();

                userPreferencesService
                    .updateAction("DealSearch", "SearchRules", "Rules", JSON.stringify($scope.myRules))
                    .then(function (response) {
                        $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                        op.notifySuccess("The search rule saved.", "Saved");
                    },
                    function (response) {
                        logger.error("Unable to save Search Rule.", response, response.statusText);
                    });
            }

            $scope.saveAsRule = function () {
                if (!$scope.validateRules()) return;

                kendo.prompt("Please, enter a name for the rule:<div style='font-size: 11px;'><b>Note:</b> The rule name must be unique.</div>", "")
                    .then(function (title) {

                        if (title === "") {
                            kendo.confirm("Please enter a name for the rule.  Would you like to try again?").then(function () {
                                $scope.saveRule();
                            }, function () { });
                            return;
                        }

                        if ($linq.Enumerable().From($scope.myRules)
                            .Where(function (x) {
                                return (x.title.toUpperCase() === title.toUpperCase());
                        }).ToArray().length > 0) {
                            kendo.confirm("The title was already used.  Would you like to enter a different nam?").then(function () {
                                $scope.saveRule();
                            }, function () { });
                            return;
                        }

                        $scope.myRules.push({
                            title: title,
                            rule: $scope.generateCurrentRule(),
                            columns: $scope.getColumns()
                        });

                        userPreferencesService
                            .updateAction("DealSearch", "SearchRules", "Rules", JSON.stringify($scope.myRules))
                            .then(function (response) {
                                $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                                op.notifySuccess("The search rule saved.", "Saved");
                            },
                            function (response) {
                                logger.error("Unable to save Search Rule.", response, response.statusText);
                            });
                    },
                    function () { });
            };

            $scope.removeCustomRule = function () {
                if (!$scope.validateRules()) return;

                userPreferencesService.updateAction("DealSearch", "SearchOptions", "CustomSearch", "[]")
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to clear Custom Search Options.", response, response.statusText);
                    });
            }

            $scope.runRule = function () {
                if (!$scope.validateRules()) return;
                userPreferencesService.updateAction("DealSearch", "SearchOptions", "CustomSearch", JSON.stringify($scope.generateCurrentRule()))
                    .then(function (response) {
                        var runRule = {
                            rule: $scope.data
                        }
                        if ($scope.currentRule !== "") runRule.columns = $scope.currentRuleColumns;

                        $scope.root.$broadcast('invoke-search-datasource', runRule);
                    }, function (response) {
                        logger.error("Unable to save Custom Search Options.", response, response.statusText);
                    });
            }

            $scope.getColumns = function () {
                // locate grid and get columns
                var grid = $("#" + $scope.gridId).find(".search-grid").data("kendoGrid");
                var cols = [];

                for (var i = 0; i < grid.columns.length; i++)
                    if (grid.columns[i].hidden === undefined || grid.columns[i].hidden === false)
                        cols.push(grid.columns[i].field);

                return cols;
            }

            $scope.drawValueControl = function (el, scope) {
                var html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value"/>';
                var helpMsg = {};
                helpMsg["IN"] = 'Enter comma separated values:  <i>example:  500, 600, 700</i>';
                helpMsg["string"] = 'Use <i style="margin-right: 3px;">*</i> for wildcard searches <i>example:  i7-5*</i>';

                if (scope.dataItem.field === "") return;

                var field = $linq.Enumerable().From(scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === scope.dataItem.field);
                    }).ToArray()[0];

                var fieldType = field.type;

                if (scope.dataItem.operator === "IN") {
                    html = '<input class="k-textbox" style="width: 250px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    if (helpMsg["IN"] !== undefined) html += '<div class="sm-help">' + helpMsg["IN"] + '</div>';
                } else {
                    if (fieldType === "string") {
                        html = '<input class="k-textbox" style="width: 250px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    }
                    else if (fieldType === "number") {
                        html = '<input kendo-numeric-text-box k-decimals="0" k-format="\'#\'" style="width: 200px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    }
                    else if (fieldType === "money") {
                        html = '<input kendo-numeric-text-box restrict-decimals=true k-format="\'c\'" style="width: 200px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    }
                    else if (fieldType === "date") {
                        html = '<input kendo-date-picker k-format="\'MM/dd/yyyy\'" style="width: 200px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    }
                    else if (fieldType === "list") {

                        var key = field.field.replace(/\./g, "_");
                        if ($scope.lookupDs[key] === undefined) {

                            // by url
                            if (field.lookupUrl !== undefined && field.lookupUrl !== "") {
                                $scope.lookupDs[key] = new kendo.data.DataSource({
                                    transport: {
                                        read: {
                                            url: field.lookupUrl,
                                            dataType: "json"
                                        }
                                    }
                                });
                            }

                            // by local data
                            if (field.lookups !== undefined && field.lookups.length > 0) {
                                $scope.lookupDs[key] = new kendo.data.DataSource({
                                    data: field.lookups
                                });
                            }
                        }

                        html = '';
                        html += '<select kendo-multi-select ';
                        html += 'k-data-text-field="\'' + field.lookupText + '\'" ';
                        html += 'k-data-value-field="\'' + field.lookupValue + '\'" ';
                        html += 'k-filter="\'contains\'" ';
                        html += 'k-auto-bind="true" ';
                        html += 'k-tag-mode="\'single\'" ';
                        html += 'k-value-primitive="true" ';
                        html += 'k-ng-model="dataItem.value" ';
                        html += 'k-auto-close="false" ';
                        html += 'k-data-source="lookupDs.' + key + '" ';
                        html += 'class="opUiContainer sm" ';
                        html += 'style="min-width: 200px; max-width: 400px;"></select>{{dataItem.value}}';
                    }
                    else if (fieldType === "singleselect") {

                        var key = field.field.replace(/\./g, "_");
                        if ($scope.lookupDs[key] === undefined) {

                            // by url
                            if (field.lookupUrl !== undefined && field.lookupUrl !== "") {
                                $scope.lookupDs[key] = new kendo.data.DataSource({
                                    transport: {
                                        read: {
                                            url: field.lookupUrl,
                                            dataType: "json"
                                        }
                                    }
                                });
                            }

                            // by local data
                            if (field.lookups !== undefined && field.lookups.length > 0) {
                                $scope.lookupDs[key] = new kendo.data.DataSource({
                                    data: field.lookups
                                });
                            }
                        }

                        html = '';
                        html += '<select kendo-drop-down-list ';
                        html += 'k-data-text-field="\'' + field.lookupText + '\'" ';
                        html += 'k-data-value-field="\'' + field.lookupValue + '\'" ';
                        html += 'k-filter="\'contains\'" ';
                        html += 'k-auto-bind="true" ';
                        html += 'k-tag-mode="\'single\'" ';
                        html += 'k-value-primitive="true" ';
                        html += 'k-ng-model="dataItem.value" ';
                        html += 'k-auto-close="false" ';
                        html += 'k-data-source="lookupDs.' + key + '" ';
                        html += 'class="opUiContainer sm" ';
                        html += 'style="min-width: 200px; max-width: 400px;"></select>{{dataItem.value}}';
                    }
                    else if (fieldType === "bool") {
                        html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    }

                    if (helpMsg[fieldType] !== undefined) html += '<div class="sm-help">' + helpMsg[fieldType] + '</div>';
                }


                var x = angular.element(html);
                el.html(x);
                $compile(x)(scope);
            }

            $scope.enterPressed = function (event) {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13) {
                    $scope.runRule();
                }
            };

            $scope.closeField = function (e) {
                setTimeout(function () {
                    $(e.sender.element).focusout();
                }, 0);
            }

            $scope.addRow = function (dataItem) {
                var index = $scope.data.indexOf(dataItem);
                if (index > -1) {
                    $scope.data.splice(index + 1, 0,
                    {
                        field: "",
                        operator: "",
                        value: "",
                        source: new kendo.data.DataSource({
                            data: $scope.attributeSettingsCopy
                        })
                    });

                    setTimeout(function () {
                        if ($(".filterRow")[index + 1] !== undefined)
                            $(".filterRow")[index + 1].scrollIntoView();
                    }, 0);
                }
            }

            $scope.removeRow = function (dataItem) {
                if ($scope.data.length === 1) {
                    $scope.data[0] = {
                        field: "",
                        operator: "",
                        value: "",
                        source: new kendo.data.DataSource({
                            data: $scope.attributeSettingsCopy
                        })
                    }
                    $scope.currentRule = "";
                    $scope.currentRuleColumns = [];
                    return;
                }
                var index = $scope.data.indexOf(dataItem);
                if (index > -1) {
                    $scope.data.splice(index, 1);
                }
            }

            $scope.deleteRule = function () {
                var rule = $linq.Enumerable().From($scope.myRules)
                    .Where(function (x) {
                        return (x.title.toUpperCase() === $scope.currentRule.toUpperCase());
                    }).ToArray()[0];

                var index = $scope.myRules.indexOf(rule);
                if (index > -1) {
                    $scope.myRules.splice(index, 1);
                }

                userPreferencesService
                    .updateAction("DealSearch", "SearchRules", "Rules", JSON.stringify($scope.myRules))
                    .then(function (response) {
                        $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                        $scope.clearRule();
                        $scope.currentRule = "";
                        $scope.currentRuleColumns = [];
                        op.notifySuccess("The search rule saved.", "Saved");
                    },
                    function (response) {
                        logger.error("Unable to save Search Rule.", response, response.statusText);
                    });
            }

            $scope.clearRule = function () {
                $scope.data = [];
                $scope.data[0] = {
                    field: "",
                    operator: "",
                    value: "",
                    source: new kendo.data.DataSource({
                        data: $scope.attributeSettingsCopy
                    })
                };
                $scope.currentRule = "";
                $scope.currentRuleColumns = [];
            }

            $scope.getOperDatasource = function (field) {
                if (field === "") {
                    return new kendo.data.DataSource({ data: [] });
                };

                var fieldType = $linq.Enumerable().From($scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === field);
                    }).ToArray()[0].type;

                var opers = $linq.Enumerable().From($scope.operatorSettings.types2operator)
                    .Where(function (x) {
                        return (x.type === fieldType);
                    }).ToArray()[0].operator;

                var operData = $linq.Enumerable().From($scope.operatorSettings.operators)
                    .Where(function (x) {
                        return (opers.indexOf(x.operator) >= 0);
                    }).ToArray();

                return new kendo.data.DataSource({
                    data: operData
                });
            }

            $scope.$on('search-rule-loaded', function (event, rule) {
                if (rule === undefined || rule === null || rule === "") return;

                $scope.currentRule = rule.title;
                $scope.currentRuleColumns = rule.columns;
                $scope.data = rule.rule;
                $scope.initRules();
                $scope.runRule();
            });

            $scope.initRules = function () {
                for (var a = 0; a < $scope.data.length; a++) {
                    var item = $scope.data[a];
                    item.operatorDataSource = $scope.getOperDatasource(item.field);
                }

                setTimeout(function () {
                    var els = $(".abValue");
                    for (var e = 0; e < els.length; e++) {
                        var scope = angular.element(els[e]).scope();
                        $scope.drawValueControl($(els[e]), scope);
                    }
                }, 0);
            }

            $scope.loadMyRules();
            $scope.removeCustomRule();
            $scope.initRules();
            if ($scope.runSearch) {
                $timeout(function () {
                    $scope.runRule();
                });
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}

