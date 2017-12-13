(function () {
    'use strict';
    angular
        .module('app.advancedSearch')
        .controller('AdvancedSearchController', AdvancedSearchController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    AdvancedSearchController.$inject = ['dataService', '$scope', 'logger', 'gridConstants'];

    function AdvancedSearchController(dataService, $scope, logger, gridConstants) {

            $scope.dataSource = new kendo.data.DataSource({
                type: "json",
                transport: {
                    read: function (e) {

                        $scope.optionCallback = e;
                        if (!!$scope.searchText)
                        {                            
                            //perform search operation
                            dataService.get("api/Search/GetAdvancedSearchResults/" + $scope.searchText).then(function (response) {
                                e.success(response.data);
                        }, function (response) {
                            logger.error("No Results Found", response, response.statusText);
                        });
                      }
                    },
                },
                batch: true,
                pageSize: 25,
                schema: {
                    model: {
                        id: "Row_ID",
                        fields: {
                            CUST_NM: { editable: false, nullable: true },
                            DIVISION: { editable: false, nullable: true },
                            CONTRACT_NAME: { editable: false, nullable: true },
                            PRICING_STRATEGY_NAME: { editable: false, nullable: true },
                            PRICING_TABLE_NAME: { editable: false, nullable: true },
                            WIP_DEAL: { editable: false, nullable: true },
                            TRKR_NBR: { editable: false, nullable: true },
                            PRODUCT: { editable: false, nullable: true },
                            START_DT: { type: "date", editable: false, nullable: true },
                            END_DT: { type: "date", editable: false, nullable: true }
                        }
                    }
                }
            });
            $scope.gridOptions = {
                dataSource: $scope.dataSource,
                filterable: gridConstants.filterable,
                sortable: true,
                selectable: true,
                resizable: true,
                groupable: true,
                sort: function (e) { gridUtils.cancelChanges(e); },
                filter: function (e) { gridUtils.cancelChanges(e); },
                pageable: {
                    refresh: true,
                    pageSizes: gridConstants.pageSizes
                },
                //change: vm.onChange,
                toolbar: gridUtils.clearAllFiltersToolbar(),
                columns: [
                    {
                        field: "[Row_ID]",
                        title: "",
                        hidden: true
                    },
                    {
                        field: "CUST_NM",
                        title: "Customer"
                    },
                    {
                        field: "DIVISION",
                        title: "Division Name"
                    },
                    {
                        field: "CONTRACT_NAME",
                        title: "Contract"
                    },
                    {
                        field: "PRICING_STRATEGY_NAME",
                        title: "Strategy"
                    },
                    {
                        field: "PRICING_TABLE_NAME",
                        title: "Table"
                    },
                    {
                        field: "TRKR_NBR",
                        title: "Tracker#"
                    },
                    {
                        field: "WIP_DEAL",
                        title: "Deal#"
                    },
                    {
                        field: "PRODUCT",
                        title: "Sku"
                    },
                    {
                        field: "START_DT",
                        title: "Start Date"
                    },
                    {
                        field: "END_DT",
                        title: "End Date"
                    }]
            }
     
        $scope.googleStyleSearch = function () {
            $scope.gridOptions.dataSource.transport.read($scope.optionCallback);            
        }       
    }
})();