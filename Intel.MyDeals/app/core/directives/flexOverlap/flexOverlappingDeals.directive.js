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
                            id: "ROW_ID",
                            fields: {
                                "ROW_ID": {
                                    type: "int",
                                    editable: false
                                },
                                "PRD_HIER_SID": {
                                    type: "int",
                                    editable: false
                                },
                                "ACR_DRN_TYPE": {
                                    type: "string",
                                    editable: false
                                },
                                "HIER_VAL_NM": {
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
                    group: [{ field: "PRD_HIER_SID" }]
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
                            field: "PRD_HIER_SID",
                            title: "Row ID",
                            width: "120px",
                            filterable: { multi: true, search: true },
                            groupHeaderTemplate: function (e) {
                                var rowData = $linq.Enumerable().From($scope.flexOvlpDataSource._data)
                                    .Where(function (x) {
                                        return (x.PRD_HIER_SID == e.value);
                                    }).ToArray();
                                var rowIds = '';
                                for (var i = 0; i < rowData.length; i++) {
                                    rowIds = rowIds + (rowData[i].ROW_ID + (rowData.length == (i + 1) ? '' : ', '));
                                }                                
                                return "<span style='font-weight:bold;font-size:13px; color: red;letter-spacing:0.07em '>Overlap Row(s): " + rowIds + "</span>";

                            },
                            hidden:true
                        },      
                        {
                            field: "ROW_ID",
                            title: "ROW ID",                            
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= ROW_ID #'>#= ROW_ID #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "HIER_VAL_NM",
                            title: "Contract Product*",
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= HIER_VAL_NM #'>#= HIER_VAL_NM #</div>",
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "ACR_DRN_TYPE",
                            title: "Row_Type",
                            width: "80px",
                            template: "<div class='ovlpCell' title='#= ACR_DRN_TYPE #'>#= ACR_DRN_TYPE #</div>",
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