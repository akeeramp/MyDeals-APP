angular
    .module('app.core')
    .directive('opPopover', opPopover);

opPopover.$inject = ['$compile', 'dataService', '$timeout', 'logger'];

function opPopover($compile, dataService, $timeout, logger) {
    return {
        scope: {
            opData: '&',
            opOptions: '@',
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/opPopover/opPopover.directive.html',
        controller: ['$scope', 'dataService', function ($scope, dataService) {
        }],
        link: function (scope, element, attrs) {
            var capColumns = [
                  { field: "CAP", title: "CAP" },
                  { field: "CAP_START", title: "Start Date", template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') #" },
                  { field: "CAP_END", title: "End Date", template: " #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" },
            ];

            var ycs2Columns = [
                  { field: "YCS2", title: "YCS2" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "YCS2_START", title: "Start Date", template: "#= kendo.toString(new Date(YCS2_START), 'M/d/yyyy') #" },
                  { field: "YCS2_END", title: "End Date", template: " #= kendo.toString(new Date(YCS2_END), 'M/d/yyyy') #" },
            ];

            scope.gridData = [];
            scope.dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        e.success(scope.gridData);
                    }
                }
            });

            scope.gridOptions = {
                dataSource: scope.dataSource,
                sortable: true,
                columns: scope.opOptions == "CAP" ? capColumns : ycs2Columns
            };

            scope.getData = function () {
                var data = scope.opData();
                // Fail silently
                if (data.length == 1) {
                    scope.loading = true;
                    dataService.post("api/Products/GetProductCAPYCS2Data/" + data[0].getAvailable + "/" + data[0].priceCondition, data).then(function (response) {
                        scope.loading = false;
                        scope.dataSource.read();
                        scope.gridData = response.data;
                        return scope.gridData;
                    },
                     function (response) {
                         logger.error("Unable to get data", response, response.statusText);
                     });
                }
            }

            scope.insidePopover = false;

            scope.dynamicPopover = {
                templateUrl: 'capPopoverTemplate.html',
            };

            scope.$watch('insidePopover', function (insidePopover) {
                togglePopover(insidePopover);
            });

            scope.$watch('dynamicPopover', function (dynamicPopover) {
                scope.insidePopover = dynamicPopover.isOpen;
            });

            function togglePopover(isInsidePopover) {
                $timeout.cancel(togglePopover.$timer);
                togglePopover.$timer = $timeout(function () {
                    if (isInsidePopover) {
                        showPopover();
                    } else {
                        hidePopover();
                    }
                }, 100);
            }

            function showPopover() {
                if (scope.dynamicPopover.isOpen) {
                    return;
                }
                if (scope.gridData.length == 0) {
                    scope.getData();
                }
                scope.dynamicPopover.isOpen = true;
            }

            function hidePopover() {
                scope.dynamicPopover.isOpen = false;
                scope.insidePopover = false;
            }

            $(document).bind('mouseover', function (e) {
                var target = e.target;
                if (inside(target)) {
                    scope.insidePopover = true;
                    scope.$digest();
                }
            });

            $(document).bind('mouseout', function (e) {
                var target = e.target;
                if (inside(target)) {
                    scope.insidePopover = false;
                    scope.$digest();
                }
            });

            scope.$on('$destroy', function () {
                $(document).unbind('mouseenter');
                $(document).unbind('mouseout');
            });

            function inside(target) {
                return insideTrigger(target) || insidePopover(target);
            }

            function insideTrigger(target) {
                return element[0].contains(target);
            }

            function insidePopover(target) {
                var isIn = false;
                var popovers = element.find('.popover-inner');
                for (var i = 0, len = popovers.length; i < len; i++) {
                    if (popovers[i].contains(target)) {
                        isIn = true;
                        break;
                    }
                }
                return isIn;
            }
        }
    };
}