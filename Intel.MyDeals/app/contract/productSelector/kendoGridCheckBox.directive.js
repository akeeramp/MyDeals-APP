(function () {
    'use strict';
    angular
       .module('app.admin')
       .directive('kendoGridCheckBox', kendoGridCheckBox);

    kendoGridCheckBox.$inject = ['$filter'];

    function kendoGridCheckBox($filter) {
        var directive = {
            restrict: 'A',
            scope: {
            	vm: '=kGridCheckbox',
            	checkboxAttr: '=checkboxAttr',
            	checkboxIsGeneric: '=checkboxIsGeneric'
            },
            controller: kGridCheckboxController,
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            var options = scope.$eval(attrs.kOptions);
            scope.vm.selectedItems = [];
            var checkBoxColumnExists = options.columns.filter(function (x) {
                return x.field == 'CheckBox'
            });

            var checkboxAttr = angular.copy(scope.checkboxAttr);
            if (checkboxAttr === null || checkboxAttr === undefined) {
            	checkboxAttr = "PRD_MBR_SID";
			}
            var checkBoxtemplate = '';
            if (scope.vm.dealType == 'VOL_TIER' || scope.vm.dealType == 'FLEX' || scope.vm.dealType == 'PROGRAM' || scope.checkboxIsGeneric) {
            	checkBoxtemplate = '<div><input id="{{dataItem.' + checkboxAttr + '}}" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label for="{{dataItem.' + checkboxAttr + '}}" class="checkbox-custom-label"></label></div>';
            } else {
            	checkBoxtemplate = '<div ng-if="dataItem.CAP.indexOf(\'-\') > -1"><input id="{{dataItem.' + checkboxAttr + '}}" title="CAP price cannot be a range." ng-disabled="true" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label title="CAP price cannot be a range." ng-disabled="true" for="{{dataItem.' + checkboxAttr + '}}" class="checkbox-custom-label"></label></div>' +
                        '<div ng-if="!(dataItem.CAP.indexOf(\'-\') > -1)"><input id="{{dataItem.PRD_MBR_SID}}" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label for="{{dataItem.' + checkboxAttr + '}}" class="checkbox-custom-label"></label></div>'
            }

            if (checkBoxColumnExists.length == 0) {
                options.columns.unshift({
                    template: checkBoxtemplate,
                    headerTemplate: '<input id="header-chbx" ng-click="vm.toggleSelectAll($event)" class="checkbox-custom" type="checkbox">' +
                        '<label style="margin:0px" for="header-chbx" class="checkbox-custom-label"></label>',
                    width: 60,
                    sortable: false,
                    field: "CheckBox",
                    filterable: false,
                });
            }
        }
    }

    kGridCheckboxController.$inject = ['$scope'];

    function kGridCheckboxController($scope) {
        $scope.vm.toggleSelect = function (ev, dataItem) {
            if ($scope.vm.disableSelection) {
                return;
            }
            dataItem.selected = ev.target.checked;
            $scope.vm.selectProduct(dataItem);
        };

        $scope.vm.toggleSelectAll = function (ev) {
            if ($scope.vm.disableSelection) {
                return;
            }
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var data = grid.dataSource.data();
            var filters = grid.dataSource.filter();
            var query = new kendo.data.Query(data);
            var items = query.filter(filters).data;
            for (var i = items.length - 1; i >= 0; i--) {
                if ($scope.vm.dealType === 'ECAP' && (items[i].CAP !== undefined && items[i].CAP.indexOf('-') > -1)) {
                    continue;
                }
                if (items[i]._disabled !== undefined && items[i]._disabled !== null && items[i]._disabled === true) {
                    continue;
                }
                items[i].selected = ev.target.checked;
                var isValid = $scope.vm.selectProduct(items[i]);
                if (isValid === false) {
                    break;
                }

            }
        };
    }
})();