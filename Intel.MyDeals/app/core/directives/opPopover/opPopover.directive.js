angular
    .module('app.core')
    .directive('opPopover', opPopover);

opPopover.$inject = ['$compile', 'dataService', '$timeout', 'logger'];

function opPopover($compile, dataService, $timeout, logger) {
    kendo.culture("en-US");
    return {
        scope: {
            opData: '&',
            opOptions: '@'
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/opPopover/opPopover.directive.html',
        controller: ['$scope', 'dataService', function ($scope, dataService) {
        }],
        link: function (scope, element, attrs) {
            var capColumns = [
                  { field: "CAP", title: "CAP", template: "#= isNaN(CAP) ? CAP : kendo.toString(parseFloat(CAP), 'c') #" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "CAP_START", title: "Start Date", template: "#= kendo.toString(new Date(CAP_START), 'M/d/yyyy') #" },
                  { field: "CAP_END", title: "End Date", template: " #= kendo.toString(new Date(CAP_END), 'M/d/yyyy') #" }
            ];

            var ycs2Columns = [
                  { field: "YCS2", title: "YCS2", template: "#= isNaN(YCS2) ? YCS2 : kendo.toString(parseFloat(YCS2), 'c') #" },
                  { field: "GEO_MBR_SID", title: "GEO" },
                  { field: "YCS2_START", title: "Start Date", template: "#= kendo.toString(new Date(YCS2_START), 'M/d/yyyy') #" },
                  { field: "YCS2_END", title: "End Date", template: " #= kendo.toString(new Date(YCS2_END), 'M/d/yyyy') #" }
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
                if (!!data && data.length === 1) {
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
                templateUrl: 'capPopoverTemplate.html'
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
                if (scope.gridData.length === 0) {
                    scope.getData();
                }
                scope.dynamicPopover.isOpen = true;
            }

            function hidePopover() {
                scope.dynamicPopover.isOpen = false;
                scope.insidePopover = false;                
            }

            scope.closePopover = function(event){
                scope.insidePopover = false;
                scope.dynamicPopover.isOpen = false;                
                event.stopPropagation();
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

            scope.openCAPBreakOut = function (dataItem, priceCondition) {
                var currentPricingTableRow = [];
                if (ProductRows.length > 1) {
                    currentPricingTableRow = ProductRows[vm.currentRow - 1];
                }
                else {
                    currentPricingTableRow = ProductRows[0];
                }

                var productData = {
                    'CUST_MBR_SID': CustSid,
                    'PRD_MBR_SID': dataItem.PRD_MBR_SID,
                    'GEO_MBR_SID': currentPricingTableRow.GEO_COMBINED,
                    'DEAL_STRT_DT': currentPricingTableRow.START_DT,
                    'DEAL_END_DT': currentPricingTableRow.END_DT,
                    'getAvailable': 'N',
                    'priceCondition': priceCondition
                }
                var capModal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/productCAPBreakout/productCAPBreakout.html',
                    controller: 'ProductCAPBreakoutController',
                    controllerAs: 'vm',
                    windowClass: 'cap-modal-window',
                    size: 'lg',
                    resolve: {
                        productData: angular.copy(productData)
                    }
                });

                capModal.result.then(
                    function () {
                    },
                    function () {
                    });
            }

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