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
            var checkBoxColumnExists = options.columns.filter(function (x) {
                return x.field == 'CheckBox'
            });

            if (checkBoxColumnExists.length == 0) {
                options.columns.unshift({
                    template: '<input id="{{dataItem.PRD_MBR_SID}}" ng-model="dataItem.selected" ng-click="vm.toggleSelect($event, dataItem)" class="checkbox-custom" type="checkbox">' +
                        '<label for="{{dataItem.PRD_MBR_SID}}" class="checkbox-custom-label"></label>',
                    headerTemplate: '<input id="header-chbx" ng-click="vm.toggleSelectAll($event)" class="checkbox-custom" type="checkbox">' +
                        '<label style="margin:0px" for="header-chbx" class="checkbox-custom-label"></label>',
                    width: 90,
                    sortable:false,
                    field: "CheckBox",
                    filterable: false,
                });
            }
        }
    }

    kGridCheckboxController.$inject = ['$scope'];

    function kGridCheckboxController($scope) {
        $scope.vm.toggleSelect = function (ev, dataItem) {
            if (ev.target.checked) {
                $scope.vm.selectedItems.push(dataItem);
            } else {
                var index = $scope.vm.selectedItems.indexOf(dataItem);
                $scope.vm.selectedItems.splice(index, 1);
            }
        };

        $scope.vm.toggleSelectAll = function (ev) {
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var items = grid.dataSource.data();
            items.forEach(function (item) {
                item.selected = ev.target.checked;
                if (ev.target.checked) {
                    $scope.vm.selectedItems.push(item);
                } else {
                    var index = $scope.vm.selectedItems.indexOf(item);
                    $scope.vm.selectedItems.splice(index, 1);
                }
            });
        };
    }
})();