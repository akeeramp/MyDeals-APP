angular
    .module('app.core')
    .directive('ruleAttributeBuilder', ruleAttributeBuilder);

ruleAttributeBuilder.$inject = ['$compile', 'objsetService', '$timeout', '$filter', '$localStorage', '$window', 'ruleService', 'logger', '$linq'];

function ruleAttributeBuilder($compile, objsetService, $timeout, $filter, $localStorage, $window, ruleService, logger, $linq) {

    return {
        scope: {
            gridId: '=',
            operatorSettings: '=',
            attributeSettings: '=',
            criteria: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/ruleAttributeBuilder/ruleAttributeBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.root = $scope.$parent;
            $scope.data = $scope.criteria == undefined ? [] : $scope.criteria;
            $scope.myRules = [];
            $scope.fieldDict = {};
            $scope.subTypeDict = {};
            $scope.currentRule = "";
            $scope.currentRuleColumns = "";
            $scope.lookupDs = {};
            $scope.selectedRuleItem = '';
            $scope.isDefaultPresnt = false;
            $scope.resetRuleInitiated = false;
            $scope.deleteRuleInitiated = false;
            $scope.defaultSelection = true;

            for (var i = 0; i < $scope.attributeSettings.length; i++) {
                $scope.fieldDict[$scope.attributeSettings[i].field] = $scope.attributeSettings[i].type;
                $scope.subTypeDict[$scope.attributeSettings[i].field] = $scope.attributeSettings[i].subType;
            }

            $scope.attributeSettingsCopy = angular.copy($scope.attributeSettings).sort(function (a, b) {
                var x = a["title"];
                var y = b["title"];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });

            if ($scope.data[0] !== undefined && !$scope.data[0]["source"]) {
                $scope.data[0]["source"] = $scope.attributeSettingsCopy;
            }

            if ($scope.data.length === 0) {
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
                            value: x.value,
                            valueType: x.valueType,
                            subType: $scope.subTypeDict[x.field]
                        };
                    }).ToArray();
            }

            $scope.drawValueControl = function (el, scope) {
                if (scope.dataItem.field === "") return;

                var field = $linq.Enumerable().From(scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === scope.dataItem.field);
                    }).ToArray()[0];

                var fieldType = field.type;
                var fieldValue = field.field;
                var operator = scope.dataItem.operator;
                var html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value"/>';
                var helpMsg = {};
                helpMsg["IN"] = 'Enter comma separated values:  <i>example:  500, 600, 700</i>';
                //helpMsg["string_with_in"] = operator == "LIKE" ? 'Enter comma separated values: <i>example: Dell, Acer, Samsung</i><br/>Use <i style="margin-right: 3px;">%</i> at the end for "Starts With" searches. <i>example: Del%, Samsun%</i><br/>Use <i style="margin-right: 3px;">*</i> for wildcard searches. <i>example: Del*, Sam sun*</i>' : 'Use <i style="margin-right: 3px;">*</i> for wildcard searches. <i>example: Sam sun*</i>';
                helpMsg["string_with_in"] = operator == "LIKE" ? 'Enter comma separated values: <i>example: Dell, Acer, Samsung</i><br/>Use <i style="margin-right: 3px;">*</i> for wildcard searches. <i>example: Del*, Sam sun*</i>' : 'Use <i style="margin-right: 3px;">*</i> for wildcard searches. <i>example: Sam sun*</i>';
                helpMsg["string"] = helpMsg["string_limited"] = 'Use <i style="margin-right: 3px;">*</i> for wildcard searches <i>example:  i7-5*</i>';

                if (scope.dataItem.operator === "IN") {
                    html = '<input class="k-textbox" style="width: 200px;font-size:11px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                    if (helpMsg["IN"] !== undefined) html += '<div class="sm-help">' + helpMsg["IN"] + '</div>';
                } else {
                    switch (fieldType) {
                        case "string":
                        case "string_with_in":
                        case "string_limited":
                            {
                                html = '<input class="k-textbox" style="width: 200px;font-size:11px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                            } break;
                        case "autocomplete":
                            {
                                html = '<input kendo-auto-complete k-options="autocompleteOptions" style="width: 200px;font-size:11px;" ng-model="dataItem.value" ng-keyup="suggestionPressed($event,\'' + fieldValue + '\')" k-data-source="suggestionText"/>';
                            } break;
                        case "number":
                            {
                                html = '<input kendo-numeric-text-box k-decimals="0" k-format="\'#\'" style="width: 200px;font-size:11px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                            } break;
                        case "money":
                            {
                                html = '<input kendo-numeric-text-box restrict-decimals=true k-format="\'c\'" style="width: 200px;font-size:11px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                            } break;
                        case "numericOrPercentage":
                            {
                                if (scope.dataItem.valueType == undefined)
                                    scope.dataItem.valueType = "{text:\"$\",value:\"$\"}";
                                html = '<input kendo-numeric-text-box k-decimals="0" k-format="\'#\'" style="width: 137px;font-size:11px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                                html += '<select class="opUiContainer sm" kendo-drop-down-list style="width: 60px;" k-ng-model="dataItem.valueType"><option value="%">%</option><option value="$">Unit</option></select>'
                            } break;
                        case "date":
                            {
                                html = '<input kendo-date-picker k-format="\'MM/dd/yyyy\'" style="width: 200px;" k-ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                            } break;
                        case "list":
                            {
                                var key = fieldValue.replace(/\./g, "_");
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
                                //html += 'k-tag-mode="\'single\'" ';
                                html += 'k-value-primitive="true" ';
                                html += 'k-ng-model="dataItem.value" ';
                                html += 'k-auto-close="false" ';
                                html += 'k-data-source="lookupDs.' + key + '" ';
                                html += 'class="opUiContainer sm" ';
                                html += 'style="min-width: 200px; max-width: 100%;"></select>{{dataItem.value}}';
                            } break;
                        case "singleselect_ext":
                        case "singleselect_read_only":
                        case "singleselect":
                            {
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
                                html += 'style="min-width: 200px; max-width: 400px;" ng-disabled="' + (fieldType == "singleselect_read_only" ? "true" : "false") + '" ></select>{{dataItem.value}}';
                            } break;
                        case "bool":
                            {
                                html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value" ng-keypress="enterPressed($event)"/>';
                            } break;
                    }

                    if (helpMsg[fieldType] !== undefined) html += '<div class="sm-help">' + helpMsg[fieldType] + '</div>';

                    if (field.post_label != undefined && field.post_label != '')
                        html += '<span style="margin-left: 5px;padding: 6px;font-size: 13px;background-color: #fafafa;border-radius: 3px;color: #444444;border: 1px solid #e5e5e5;">' + field.post_label + '<span>';
                }

                var x = angular.element(html);
                el.html(x);
                $compile(x)(scope);
            }

            $scope.enterPressed = function (event) {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13) {
                    return false;
                    //$scope.runRule();
                }
            };

            $scope.suggestionPressed = function (event, fieldValue) {
                $scope.suggestionText = new kendo.data.DataSource({
                    transport: {
                        read: {
                            url: "/api/Rules/GetSuggestion/" + fieldValue + "/" + event.target.value,
                            dataType: "json"
                        }
                    }
                });
            };

            $scope.autocompleteOptions = {
                filter: "contains"
            }

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

            $scope.getOperDatasource = function (field) {
                if (field === "") {
                    return new kendo.data.DataSource({ data: [] });
                };

                var fieldType = $linq.Enumerable().From($scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === field);
                    }).ToArray()[0].type;

                var fieldSubType = $linq.Enumerable().From($scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === field);
                    }).ToArray()[0].subType;

                var opers = $linq.Enumerable().From($scope.operatorSettings.types2operator)
                    .Where(function (x) {
                        return (x.type === fieldType && x.subType === fieldSubType);
                    }).ToArray()[0].operator;

                var operData = $linq.Enumerable().From($scope.operatorSettings.operators)
                    .Where(function (x) {
                        return (opers.indexOf(x.operator) >= 0);
                    }).ToArray();

                return new kendo.data.DataSource({
                    data: operData
                });
            }

            $scope.$on('save-criteria', function (event) {
                $scope.criteria = $scope.generateCurrentRule();
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

                    if ($scope.defaultSelection == false && $("#ruleDropDownList").data("kendoComboBox")) {
                        $("#ruleDropDownList").data("kendoComboBox").select(-1);
                    }

                }, 0);
            }


            $scope.initRules();
        }],
        link: function (scope, element, attr) {
        }
    };
}