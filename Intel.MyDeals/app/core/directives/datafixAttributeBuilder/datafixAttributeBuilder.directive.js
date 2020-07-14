angular
    .module('app.core')
    .directive('datafixAttributeBuilder', datafixAttributeBuilder);

datafixAttributeBuilder.$inject = ['$compile', '$timeout', '$filter', '$localStorage', '$window', 'logger', '$linq', 'dropdownsService'];

function datafixAttributeBuilder($compile, $timeout, $filter, $localStorage, $window, logger, $linq, dropdownsService) {
    var vm = this;
    vm.MDX = [{ Text: "Modify", Value: "M" }, { Text: "Delete", Value: "D" }, { Text: "Create", Value: "X" }];
    vm.OpDataElements = null;
    vm.MyCustomersInfo = null;

    dropdownsService.getOpDataElements().then(function (response) {
        vm.OpDataElements = response.data;
    }, function (response) {
        logger.error("Unable to get op data elements.", response, response.statusText);
    });

    dropdownsService.getCustsDropdowns(true).then(function (response) {
        vm.MyCustomersInfo = response.data;
    }, function (response) {
        logger.error("Unable to get customers.", response, response.statusText);
    });

    return {
        scope: {
            attributeSettings: '=',
            selectedDatafixAttributes: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/datafixAttributeBuilder/datafixAttributeBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.root = $scope.$parent;
            $scope.DataRows = $scope.selectedDatafixAttributes === undefined ? [] : $scope.selectedDatafixAttributes;
            $scope.lookupDs = {};

            $scope.attributeDataSource = new kendo.data.DataSource({
                data: $scope.attributeSettings,
                sort: { field: "title", dir: "asc" }
            });
            
            if ($scope.DataRows.length === 0) {
                $scope.DataRows = [{
                    DataElement: "",
                    Attribute: "",
                    MtxValue: 0,
                    ObjectId: "",
                    ValueMax: "",
                    MDX: "",
                    CustId: ""
                }];
            }

            $scope.changeField = function (e) {
                e.sender.$angular_scope.$apply(function () {
                    var el = $(e.sender.element).parents(".filterRow").find(".abValue");
                    $scope.drawValueControl(el, e.sender.$angular_scope);
                });
            }

            $scope.drawValueControl = function (el, scope) {
                if (scope.dataItem.Attribute === "") return;

                var field = $linq.Enumerable().From(scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === scope.dataItem.Attribute);
                    }).ToArray()[0];

                var fieldType = field.type;
                var fieldValue = field.field;
                var html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value"/>';

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

                if (field.post_label != undefined && field.post_label != '')
                    html += '<span style="margin-left: 5px;padding: 6px;font-size: 13px;background-color: #fafafa;border-radius: 3px;color: #444444;border: 1px solid #e5e5e5;">' + field.post_label + '<span>';

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
                var index = $scope.DataRows.indexOf(dataItem);
                if (index > -1) {
                    $scope.DataRows.splice(index + 1, 0, {
                        DataElement: "",
                        Attribute: "",
                        MtxValue: 0,
                        ObjectId: "",
                        ValueMax: "",
                        MDX: "",
                        CustId: ""
                    });
                    setTimeout(function () {
                        if ($(".filterRow")[index + 1] !== undefined)
                            $(".filterRow")[index + 1].scrollIntoView();
                    }, 0);
                }
            }

            $scope.removeRow = function (dataItem) {
                if ($scope.DataRows.length === 1) {
                    $scope.DataRows = [{
                        DataElement: "",
                        Attribute: "",
                        MtxValue: 0,
                        ObjectId: "",
                        ValueMax: "",
                        MDX: "",
                        CustId: ""
                    }];
                    return;
                }
                var index = $scope.DataRows.indexOf(dataItem);
                if (index > -1) {
                    $scope.DataRows.splice(index, 1);
                }
            }

            $scope.$on('save-datafix-attribute', function (event) {
                $scope.selectedDatafixAttributes = $scope.DataRows;
            });

            $scope.OpDataElementDataSource = new kendo.data.DataSource({
                data: vm.OpDataElements
            });

            $scope.MdxDataSource = new kendo.data.DataSource({
                data: vm.MDX
            });

            $scope.MyCustomersInfoDataSource = new kendo.data.DataSource({
                data: vm.MyCustomersInfo
            });
        }],
        link: function (scope, element, attr) {
        }
    };
}

