(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('flexOverlappingDeals', flexOverlappingDeals);

    flexOverlappingDeals.$inject = ['$compile', '$filter', 'objsetService', 'securityService', '$timeout', 'logger', '$linq', '$uibModal'];

    function flexOverlappingDeals($compile, $filter, objsetService, securityService, $timeout, logger, $linq, $uibModal) {
        kendo.culture("en-US");

        return {
            scope: {
                ptrData: '='
            },
            restrict: 'AE',
            transclude: true,
            templateUrl: '/app/core/directives/flexOverlap/flexOverlappingDeals.directive.html',
            controller: ['$scope', 'dataService', function ($scope, dataService) {
                $scope.loading = true;
                $scope.msg = "Looking for Flex Product Overlapping";
                $scope.flexOvlpDataSource = new kendo.data.DataSource({
                    transport: {
                        read: function (e) {
                            e.success($scope.ptrData);
                            $timeout(function () {
                                $scope.loading = false;
                            }, 1000);
                        }
                    },
                    error: function (e) {
                        // handle data operation error
                        alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                        $timeout(function () {
                            $scope.loading = false;
                        }, 1000);
                    },
                    schema: {
                        model: {
                            id: "CONTRACTNUMBER",
                            fields: {
                                "DC_ID": {
                                    type: "int",
                                    editable: false
                                },
                                "DUP_ID": {
                                    type: "int",
                                    editable: false
                                },
                                "PTR_USER_PRD": {
                                    type: "string",
                                    editable: false
                                },
                                "START_DT": {
                                    type: "string",
                                    editable: false
                                },
                                "END_DT": {
                                    type: "string",
                                    editable: false
                                }
                            }
                        }
                    },
                    pageSize: 25,
                    group: [{ field: "DUP_ID" }]
                });

                $scope.gridOptions = {
                    dataSource: $scope.flexOvlpDataSource,
                    scrollable: true,
                    sortable: true,
                    editable: false,
                    navigatable: true,
                    filterable: true,
                    resizable: true,
                    reorderable: true,                    
                    noRecords: {
                        template: "<div style='padding: 100px;'>No Overlapping deals were found</div>"
                    },
                    pageable: {
                        refresh: false,
                        pageSizes: [25, 50, 100, 250, 500],
                        buttonCount: 5
                    },
                    columns: [                        
                        {
                            field: "DUP_ID",
                            title: "ROW ID",
                            hidden: true,
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= DUP_ID #'>#= DUP_ID #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "DC_ID",
                            title: "Duplicate ROW ID",
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= DC_ID #'>#= DC_ID #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "PTR_USER_PRD",
                            title: "Contract Product*",
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= PTR_USER_PRD #'>#= PTR_USER_PRD #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "START_DT",
                            title: "Deal Start Date",
                            width: "80px",                            
                            template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') #",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "END_DT",
                            title: "Deal End Date",
                            width: "80px",
                            template: "#= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                            filterable: { multi: true, search: true }
                        },
                    ]
                };

            }],
            link: function (scope, element, attrs) {

            }
        };
    }
})();