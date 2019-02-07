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
            saveCat: '=',
            saveSubCat: '=',
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
            $scope.selectedRuleItem = '';
            $scope.isDefaultPresnt = false;
            $scope.resetRuleInitiated = false;
            $scope.deleteRuleInitiated = false;
            $scope.defaultSelection = true;

            $scope.cat = $scope.saveCat === undefined ? "DealSearch" : $scope.saveCat;
            $scope.subcat = $scope.saveSubCat === undefined ? "SearchRules" : $scope.saveSubCat;
            //$scope.cat = "DealSearch";
            //$scope.subcat = "SearchRules";

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
                userPreferencesService.getActions($scope.cat, $scope.subcat)
                    .then(function (data) {

                        $scope.myRules = [];
                        if (data.data.length > 0) {
                            for (var r = 0; r < data.data.length; r++) {
                                if (data.data[r].PRFR_KEY === "Rules") {
                                    $scope.myRules = JSON.parse(data.data[r].PRFR_VAL);
                                    $scope.rulesDataSource = new kendo.data.DataSource({
                                        data: $scope.rules = JSON.parse(data.data[r].PRFR_VAL)
                                    });
                                }
                            }
                        }

                        $scope.root.$broadcast('search-rules-updated', $scope.myRules);

                        if ($scope.saveCat == 'TenderDealSearch') {//This checking req for Tender dashboard only
                            var isValuePresent = false;
                            if (!$scope.data) { $scope.data = $scope.customSettings; }
                            for (var i = 0; i < $scope.data.length; i++) {
                                if ($scope.data[i].value.toString().length > 0) {
                                    isValuePresent = true;
                                }
                                else {
                                    isValuePresent = false;
                                    break;
                                }
                            }

                            if (isValuePresent == false) {
                                if ($scope.rules != undefined && $scope.rules && $scope.rules.length > 0) {
                                    //Attribute Builder
                                    var flag = false;
                                    if ($scope.resetRuleInitiated == false && $scope.defaultSelection) {
                                        for (var rulesCounter = 0; rulesCounter < $scope.rules.length; rulesCounter++) {
                                            //Calling RuleEngine Setter
                                            if ($scope.rules[rulesCounter].default == true) {
                                                sleepAndResetDDL($scope.rules[rulesCounter].title);
                                                $scope.selectedRuleItem = $scope.rules[rulesCounter].title;
                                                flag = true;
                                                $scope.isDefaultPresnt = true;
                                                $scope.ruleEngine($scope.rules[rulesCounter].rule);
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        $scope.buildRuleFormula();
                                    }
                                }
                                else {
                                    $scope.resetRuleInitiated = false;
                                    $scope.buildRuleFormula();
                                }
                                if (flag == false && $scope.defaultSelection) {
                                    $scope.resetRuleInitiated = false;
                                    sleepAndResetDDL();
                                }
                            } else {
                                sleepAndResetDDL();
                            }
                        }

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
                    .updateAction($scope.cat, $scope.subcat, "Rules", JSON.stringify($scope.myRules))
                    .then(function (response) {
                        $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                        op.notifySuccess("The search rule saved.", "Saved");
                    },
                    function (response) {
                        logger.error("Unable to save Search Rule.", response, response.statusText);
                    });
            }

            //Rule Selection Select Event
            $scope.onRuleSelect = function (e) {
                if ($scope.selectedRuleItem != e.dataItem.title) {
                    $scope.selectedRuleItem = e.dataItem.title;
                    if (e.dataItem && $scope.deleteRuleInitiated == false) {
                        $scope.ruleEngine(e.dataItem.rule);
                    }
                    else {
                        $scope.deleteRuleInitiated = false;
                        $scope.selectedRuleItem = '';
                        sleepAndResetDDL();
                    }
                }
                else {
                    $scope.deleteRuleInitiated = false;
                }
            }

            var doNotRunRule = false;
            function sleepAndResetDDL(title) {
                var title = title;
                if (title === undefined) {
                    doNotRunRule = true;
                }
                $timeout(function () {
                    var dropdownlist = $("#ruleDropDownList").data("kendoDropDownList");
                    if (title && title.length > 0) {
                        $("#ruleDropDownList").data("kendoDropDownList").value(title);
                    } else if (dropdownlist !== undefined) {
                        dropdownlist.select(-1);
                    }
                });
            }

            //Remove Created Rule
            $scope.deleteSaveRule = function (dataItem, event) {
                event.preventDefault();

                var selectedDDl = $("#ruleDropDownList").data("kendoDropDownList").text();

                for (var itmCnt = 0; itmCnt < $scope.rules.length; itmCnt++) {
                    if ($scope.rules[itmCnt].title == dataItem.title) {
                        $scope.rules.splice(itmCnt, 1);
                        if ($scope.rules.length > 0 && (selectedDDl == dataItem.title || selectedDDl.length == 0)) {
                            $("#ruleDropDownList").data("kendoDropDownList").select(itmCnt == 0 ? $scope.rules.length - 1 : 0);
                        }
                        $scope.deleteRuleInitiated = true;
                        userPreferencesService
                            .updateAction($scope.cat, $scope.subcat, "Rules", JSON.stringify($scope.rules))
                            .then(function (response) {
                                op.notifySuccess("Rule was removed", "Saved");
                                $scope.rulesDataSource = new kendo.data.DataSource({
                                    data: $scope.rules
                                });

                                $scope.rulesDataSource.read();
                                if ($scope.rules.length > 0 && (selectedDDl == dataItem.title || selectedDDl.length == 0)) {
                                    sleepAndResetDDL();
                                    $scope.clearRule();
                                } else {
                                    $("#ruleDropDownList").data("kendoDropDownList").value(selectedDDl);
                                    $scope.ruleExtracter(selectedDDl);
                                }
                            },
                            function (response) {
                                logger.error("Unable to make Default Rule.", response, response.statusText);
                            });
                        break;
                    }
                }
            }

            //Setting Default Rule on User Click
            $scope.setDefaultRule = function (dataItem, event) {
                event.preventDefault();
                var selectionType = '';
                for (var itmCnt = 0; itmCnt < $scope.rules.length; itmCnt++) {
                    if ($scope.rules[itmCnt].title == dataItem.title) {
                        $scope.rules[itmCnt]["default"] = !$scope.rules[itmCnt]["default"];
                        selectionType = !$scope.rules[itmCnt]["default"];
                    }
                    else {
                        $scope.rules[itmCnt]["default"] = false;
                    }
                }
                //adding item to rule dropdown
                $scope.rulesDataSource = new kendo.data.DataSource({
                    data: $scope.rules
                });

                $scope.rulesDataSource.read();

                userPreferencesService
                    .updateAction($scope.cat, $scope.subcat, "Rules", JSON.stringify($scope.rules))
                    .then(function (response) {
                        if (selectionType == false) {
                            op.notifySuccess("The rule saved as Default", "Saved");
                        }
                        else if (selectionType == true) {
                            op.notifySuccess("Default selection was removed", "Saved");
                        }

                    },
                    function (response) {
                        logger.error("Unable to make Default Rule.", response, response.statusText);
                    });
            }

            //Run Rule to filter Result
            $scope.runRuleOnSelection = function () {
                $scope.runRule();
            }

            $scope.$watch('ruleToRun', function (newValue, oldValue, scope) {
                if (newValue === oldValue) return;
                $scope.$broadcast('search-rule-loaded', newValue);
            });

            function sleepAndDDL(title) {
                $timeout(function () {
                    var dropdownlist = $("#ruleDropDownList").data("kendoDropDownList");
                    dropdownlist.select($scope.rules.length - 1);

                    //Call Run Rules
                    $scope.runRuleOnSelection();
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
                                return (x.title !== undefined && x.title.toUpperCase() === title.toUpperCase());
                        }).ToArray().length > 0) {
                            kendo.confirm("The title was already used.  Would you like to enter a different name?").then(function () {
                                $scope.saveRule();
                            }, function () { });
                            return;
                        }

                        $scope.myRules.push({
                            title: title,
                            rule: $scope.generateCurrentRule(),
                            columns: $scope.saveCat == 'TenderDealSearch' ? '' : $scope.getColumns(),
                            default: false
                        });

                        userPreferencesService
                            .updateAction($scope.cat, $scope.subcat, "Rules", JSON.stringify($scope.myRules))
                            .then(function (response) {
                                $scope.root.$broadcast('search-rules-updated', $scope.myRules);
                                op.notifySuccess("The search rule saved.", "Saved");

                                //Added for Tecnder Dashboard
                                if ($scope.saveCat == 'TenderDealSearch') {
                                    //adding item to rule dropdown
                                    $scope.rulesDataSource = new kendo.data.DataSource({
                                        data: $scope.myRules
                                    });

                                    $scope.rules = $scope.myRules;
                                    $scope.rulesDataSource.read();
                                    sleepAndDDL(title);
                                }

                            },
                            function (response) {
                                logger.error("Unable to save Search Rule.", response, response.statusText);
                            });
                    },
                    function () { });
            };

            $scope.removeCustomRule = function () {
                if (!$scope.validateRules()) return;

                userPreferencesService.updateAction($scope.cat, $scope.subcat, "CustomSearch", "[]")
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to clear Custom Search Options.", response, response.statusText);
                    });
            }

            $scope.runRule = function () {
                if (!$scope.validateRules()) return;
                userPreferencesService.updateAction($scope.cat, $scope.subcat, "CustomSearch", JSON.stringify($scope.generateCurrentRule()))
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
                var gridWrapper = $("#" + $scope.gridId).find(".search-grid");
                if (gridWrapper.length === 0) gridWrapper = $("#" + $scope.gridId + " .op-grid");
                var grid = gridWrapper.data("kendoGrid");
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
                    .updateAction($scope.cat, $scope.subcat, "Rules", JSON.stringify($scope.myRules))
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
                if ($scope.saveCat == 'TenderDealSearch') {
                    angular.forEach($scope.customSettings, function (val) {
                        val.source = $scope.attributeSettingsCopy;
                    });
                    $scope.data = $scope.customSettings;
                    $scope.resetRuleInitiated = true;
                    $scope.initRules();
                }
                else {
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


                if ($scope.saveCat == 'TenderDealSearch' && $scope.data.length && $scope.rules && $scope.rules.length > 0) {
                    if ($("#ruleDropDownList").data("kendoDropDownList").text().length > 0) {
                        $("#ruleDropDownList").data("kendoDropDownList").select(-1);
                        $scope.selectedRuleItem = '';
                    }
                }

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
                if (!rule.rule[0]["source"]) {
                    rule.rule[0]["source"] = $scope.attributeSettingsCopy;
                }
                $scope.data = rule.rule;
                $scope.initRules();
                $scope.runRule();
            });

            $scope.initRules = function () {
                $scope.buildRuleFormula();
            }

            //Extract Rule from Rules
            $scope.ruleExtracter = function (ruleName) {
                for (var rulesCounter = 0; rulesCounter < $scope.rules.length; rulesCounter++) {
                    //Calling RuleEngine Setter
                    if ($scope.rules[rulesCounter].title == ruleName) {
                        $scope.ruleEngine($scope.rules[rulesCounter].rule);
                        break;
                    }
                }
            }

            //overriding default or selected rule
            $scope.ruleEngine = function (rule) {
                //IF Any Default Rule then Reset $scope.data to default rule i:e $scope.data = []; and then $scope.data = $scope.rules[rulesCounter].rule[ruleCounter]
                var ruleNode = $scope.data[0];
                $scope.data = [];
                for (var ruleCounter = 0; ruleCounter < rule.length; ruleCounter++) {
                    var tempRuleNode = angular.copy(ruleNode);
                    tempRuleNode.field = rule[ruleCounter].field;
                    tempRuleNode.operator = rule[ruleCounter].operator;
                    tempRuleNode.value = rule[ruleCounter].value;

                    //Pushing Dataitem fpor Default rule
                    $scope.data.push(tempRuleNode);

                }
                //Geretae Rule UI
                $scope.buildRuleFormula();
            }

            function sleepAndRunWell() {
                if (doNotRunRule) {
                    doNotRunRule = false;
                    return;
                }
                $timeout(function () {
                    $scope.runRuleOnSelection();
                }, 200);
            }

            $scope.buildRuleFormula = function () {
                for (var a = 0; a < $scope.data.length; a++) {
                    var item = $scope.data[a];
                    item.operatorDataSource = $scope.getOperDatasource(item.field);
                    if (a > 0) {
                        item.source = $scope.data[0].source;
                    }
                }

                $timeout(function () {
                    var els = $(".abValue");
                    for (var e = 0; e < els.length; e++) {
                        var scope = angular.element(els[e]).scope();
                        $scope.drawValueControl($(els[e]), scope);
                    }
                    //Run Rules for TenderDealSearch
                    if ($scope.saveCat == 'TenderDealSearch' && $scope.data.length && $scope.rules && $scope.rules.length > 0) {
                        if ($("#ruleDropDownList").data("kendoDropDownList").text().length > 0) {
                            if ($scope.deleteRuleInitiated == false) {
                                sleepAndRunWell();
                            }
                            else {
                                $scope.deleteRuleInitiated == false;
                            }
                        }
                    }

                    if ($scope.defaultSelection == false && $("#ruleDropDownList").data("kendoDropDownList")) {
                        $("#ruleDropDownList").data("kendoDropDownList").select(-1);
                    }

                }, 0);
            }

            $scope.loadMyRules();
            if ($scope.customSettings == undefined || $scope.customSettings == null) {      //removeCustomRule triggers a validateRules call which we don't want when coming in from the tender search page as we will be creating it with a blank end customer.  need to potentially re-visit tender page interaction with user saved rules.
                $scope.removeCustomRule();
            }
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

