angular
    .module('app.core')
    .directive('datafixAttributeBuilder', datafixAttributeBuilder);

datafixAttributeBuilder.$inject = ['$compile', '$timeout', '$filter', '$localStorage', '$window', 'logger', '$linq'];

function datafixAttributeBuilder($compile, $timeout, $filter, $localStorage, $window, logger, $linq) {
    var vm = this;
    vm.MDX = [{ Text: "Modify", Value: "M" }, { Text: "Delete", Value: "D" }, { Text: "Create", Value: "X" }];

    return {
        scope: {
            attributeSettings: '=',
            selectedDatafixAttributes: '=',
            opdataElements: '=',
            myCustomersInfo: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/datafixAttributeBuilder/datafixAttributeBuilder.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            $scope.root = $scope.$parent;
            $scope.DataRows = $scope.selectedDatafixAttributes === undefined ? [] : $scope.selectedDatafixAttributes;
            $scope.lookupDs = {};

            $scope.attributeDataSource = new kendo.data.DataSource({
                data: $scope.attributeSettings,
                sort: { field: "Text", dir: "asc" }
            });

            $scope.OpDataElementDataSource = new kendo.data.DataSource({
                data: $scope.opdataElements
            });

            $scope.MdxDataSource = new kendo.data.DataSource({
                data: vm.MDX
            });

            $scope.MyCustomersInfoDataSource = new kendo.data.DataSource({
                data: $scope.myCustomersInfo
            });
            
            if ($scope.DataRows.length === 0) {
                $scope.DataRows = [{
                    OBJ_TYPE_SID: "",
                    ATRB_SID: "",
                    ATRB_RVS_NBR: 0,
                    ATRB_MTX_SID: 0,
                    OBJ_SID: "",
                    ATRB_VAL: "",
                    ATRB_VAL_MAX: "",
                    MDX_CD: "",
                    CUST_MBR_SID: "",
                    BTCH_ID: ""
                }];
            } else {
                $timeout(function () {
                    var els = $(".abValue");
                    for (var e = 0; e < els.length; e++) {
                        var scope = angular.element(els[e]).scope();
                        $scope.drawValueControl($(els[e]), scope);
                    }
                }, 0);                
            }

            $scope.changeField = function (e) {
                e.sender.$angular_scope.$apply(function () {
                    var el = $(e.sender.element).parents(".filterRow").find(".abValue");
                    $scope.drawValueControl(el, e.sender.$angular_scope);
                });
            }

            $scope.drawValueControl = function (el, scope) {
                if (scope.dataItem.ATRB_SID === "") return;

                var field = $linq.Enumerable().From(scope.attributeSettings)
                    .Where(function (x) {
                        return (x.field === scope.dataItem.ATRB_SID);
                    }).ToArray()[0];

                var fieldType = field.type;
                var fieldValue = field.field;
                var html = '<input class="k-textbox" style="width: 200px;" ng-model="dataItem.value"/>';

                

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
                        OBJ_TYPE_SID: "",
                        ATRB_SID: 0,
                        ATRB_RVS_NBR: 0,
                        ATRB_MTX_SID: 0,
                        OBJ_SID: "",
                        ATRB_VAL: "",
                        ATRB_VAL_MAX: "",
                        MDX_CD: "",
                        CUST_MBR_SID: "",
                        BTCH_ID: ""
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
                        OBJ_TYPE_SID: "",
                        ATRB_SID: "",
                        ATRB_RVS_NBR: 0,
                        ATRB_MTX_SID: 0,
                        OBJ_SID: "",
                        ATRB_VAL: "",
                        ATRB_VAL_MAX: "",
                        MDX_CD: "",
                        CUST_MBR_SID: "",
                        BTCH_ID: ""
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
           
        }],
        link: function (scope, element, attr) {
        }
    };
}

