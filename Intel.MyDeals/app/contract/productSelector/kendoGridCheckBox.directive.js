(function () {
    'use strict';
    angular
       .module('app.admin')
       .directive('kendoGridCheckBox', kendoGridCheckBox);

    kendoGridCheckBox.$inject = ['$filter'];

    function kendoGridCheckBox($filter) {
        var directive = {
            restrict: 'A',
            scope: { vm: '=kGridCheckbox' },
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

            var checkBoxtemplate = '';
            if (scope.vm.dealType == 'VOL_TIER') {
                checkBoxtemplate = '<div><input id="{{dataItem.PRD_MBR_SID}}" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label for="{{dataItem.PRD_MBR_SID}}" class="checkbox-custom-label"></label></div>';
            } else {
                checkBoxtemplate = '<div ng-if="dataItem.CAP.indexOf(\'-\') > -1"><input id="{{dataItem.PRD_MBR_SID}}" title="CAP price cannot be a range." ng-disabled="true" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label title="CAP price cannot be a range." ng-disabled="true" for="{{dataItem.PRD_MBR_SID}}" class="checkbox-custom-label"></label></div>' +
                        '<div ng-if="!(dataItem.CAP.indexOf(\'-\') > -1)"><input id="{{dataItem.PRD_MBR_SID}}" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label for="{{dataItem.PRD_MBR_SID}}" class="checkbox-custom-label"></label></div>'
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
            dataItem.selected = ev.target.checked;
            $scope.vm.selectProduct(dataItem);
        };

        $scope.vm.toggleSelectAll = function (ev) {
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var data = grid.dataSource.data();
            var filters = grid.dataSource.filter();
            var query = new kendo.data.Query(data);
            var items = query.filter(filters).data;
            items.forEach(function (item) {
                // When select all clicked do not select the products with CAP range for ECAP deal
                if (!(item.CAP.indexOf('-') > -1) && $scope.vm.dealType == 'VOL_TIER') {
                    if (item.selected == ev.target.checked) {
                        return;
                    }
                    item.selected = ev.target.checked;
                    $scope.vm.selectProduct(item);
                }
            });
        };
    }
})();