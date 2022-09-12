angular
    .module('app')
    .directive('globalSearch', globalSearch);

globalSearch.$inject = ['$timeout', 'logger', 'objsetService', 'dataService', '$rootScope', '$compile', '$templateRequest', 'colorDictionary', '$uibModal'];

function globalSearch($timeout, logger, objsetService, dataService, $rootScope, $compile, $templateRequest, colorDictionary, $uibModal) {
    return {
        scope: {
            dataItem: '=ngModel'
        },
        restrict: 'AE',
        // templateUrl:'Client/src/app/shared/advanceSearch/globalSearch.html',
        template:`
        <a class="search intelicon-search" style="margin-right: 5px; float: left; font-size: 14px;"></a>
        <input type="text" 
               placeholder="Search for deal #, contract, or pricing strategy" 
               class="globalSearchInpt" 
               ng-model="$root.globalSearchResultsData.searchText" 
               ng-keypress="enterPressed($event)">
        
        <div class="btn-group" style="margin-right: 4px;">
            <button class="btn btn-xs btn-default custom-xs-btn" type="button" ng-click="executeOnly('ALL')">in <b>All</b></button>
            <button class="btn btn-xs btn-default dropdown-toggle need-all-xs" aria-expanded="false" type="button" data-toggle="dropdown">
                <span class="caret"></span>
                <span class="sr-only">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right dropdown-search" role="menu">
                <li><a ng-click="executeOnly('CNTRCT')">in <b>Contracts</b></a></li>
                <li><a ng-click="executeOnly('PRC_ST')">in <b>Pricing Strategies</b></a></li>
                <li><a ng-click="executeOnly('PRC_TBL')">in <b>Pricing Tables</b></a></li>
                <li><a ng-click="executeOnly('WIP_DEAL')">in <b>Deals</b></a></li>
                <li class="divider"></li>
                <li><a ng-click="executeOnly('ALL')">in <b>All</b></a></li>
            </ul>
        </div>
        
        <style>
            .custom-xs-btn{
                padding: 1px 5px!important;
            }
            .need-all-xs .caret:before {
                position: relative!important;
                top: -4px!important;
            }
            .globalSearchInpt {
                width: 320px; 
                font-size: 14px; 
                line-height: .9em; 
                padding: 4px 5px 5px 5px; 
                border: 0 solid transparent; 
                height: auto;
            }
            @media (max-width: 970px) {
                .globalSearchInpt {
                    width: 176px; 
                }
            }
            @media (max-width: 810px) {
                .globalSearchInpt {
                    width: 57px; 
                }
            }
            .dropdown-search li {
                cursor: pointer;
            }
            .k-window-titlebar.k-dialog-titlebar.k-header {
                /*display: none;*/
            }
        </style>`,
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.enterPressed = function (event) {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13 && $scope.checkForNotEmpty()) {
                    $scope.executeSearch();
                }
            };

            $scope.checkForNotEmpty = function() {
                if ($scope.$root.globalSearchResultsData.searchText === "") {
                    kendo.alert("Please enter one of the following:<br/><br/>  1) Contract / Pricing Strategy / Pricing Table Name or Number <br/>  2) Deal Number.");
                    return false;
                }
                return true;
            }

            if ($scope.$root.globalSearchResultsData === undefined) {
                $scope.$root.globalSearchResultsData = {
                    take: 5,
                    opTypeModel: 'ALL',
                    searchIn: ["CNTRCT", "PRC_ST", "PRC_TBL", "WIP_DEAL"],
                    colCount: 4,
                    searchText: "",
                    results: {
                        CNTRCT: { searching: false, data: [] },
                        PRC_ST: { searching: false, data: [] },
                        PRC_TBL: { searching: false, data: [] },
                        WIP_DEAL: { searching: false, data: [] }
                    }
                };
            }

            $scope.$root.globalSearchResultsData.enterPressed = function (event) {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13 && $scope.$root.globalSearchResultsData.searchText !== "") {
                    var win = $("#winGlobalSearchResults").data("kendoWindow");
                    if ($scope.$root.globalSearchResultsData.searchText !== "" && win.element.is(":hidden")) win.open().center();

                    $scope.forceExecute();
                }
            };

            $scope.forceExecute = function () {
                if ($scope.$root.globalSearchResultsData.opTypeModel === 'ALL') {
                    $scope.$root.globalSearchResultsData.searchIn = ["CNTRCT", "PRC_ST", "PRC_TBL", "WIP_DEAL"];
                    $scope.$root.globalSearchResultsData.colCount = 3;
                    $scope.$root.$broadcast('refreshSearchByType');
                    $("#winGlobalSearchResults").data("kendoWindow").wrapper.width("900px");
                } else {
                    $scope.$root.globalSearchResultsData.searchIn = [$scope.$root.globalSearchResultsData.opTypeModel];
                    $scope.$root.globalSearchResultsData.colCount = 12;
                    $scope.$root.$broadcast('refreshSearchByType', $scope.$root.globalSearchResultsData.opTypeModel);
                    $("#winGlobalSearchResults").data("kendoWindow").wrapper.width("450px");
                }
            }

            $scope.clearResults = function () {
                $scope.$root.globalSearchResultsData.results = {
                    CNTRCT: { searching: false, data: [] },
                    PRC_ST: { searching: false, data: [] },
                    PRC_TBL: { searching: false, data: [] },
                    WIP_DEAL: { searching: false, data: [] }
                };
            }

            $scope.checkResults = function() {
                return !$scope.$root.globalSearchResultsData.results.CNTRCT.searching
                    && !$scope.$root.globalSearchResultsData.results.PRC_ST.searching
                    && !$scope.$root.globalSearchResultsData.results.PRC_TBL.searching
                    && !$scope.$root.globalSearchResultsData.results.WIP_DEAL.searching;
            }

            $scope.drawResults = function() {
                console.log("All Done");
            }

            $scope.executeOnly = function(optype) {
                if (!$scope.checkForNotEmpty()) return;

                if (optype === "ALL") {
                    $scope.executeSearch();
                    return;
                }

                $scope.$root.globalSearchResultsData.status = "Searching";
                $scope.$root.globalSearchResultsData.searchIn = [optype];
                $scope.$root.globalSearchResultsData.colCount = 12;
                $scope.$root.globalSearchResultsData.opTypeModel = optype;

                var sText = $scope.$root.globalSearchResultsData.searchText;
                if (sText === undefined || sText === null || sText === "") {
                    return;
                }
                //$("#winGlobalSearchResults").show();
                console.log("open Window 1");
                $("#winGlobalSearchResults").data("kendoWindow").wrapper.width("450px");
                $("#winGlobalSearchResults").data("kendoWindow").open().center();
                $scope.clearResults();

                $scope.executeSearchByType(optype, $scope.$root.globalSearchResultsData.take);

            }

            $scope.executeSearch = function () {
                $scope.$root.globalSearchResultsData.status = "Searching";
                $scope.$root.globalSearchResultsData.searchIn = ["CNTRCT", "PRC_ST", "PRC_TBL", "WIP_DEAL"];
                $scope.$root.globalSearchResultsData.colCount = 3;
                $scope.$root.globalSearchResultsData.opTypeModel = 'ALL';

                var sText = $scope.$root.globalSearchResultsData.searchText;
                if (sText === undefined || sText === null || sText === "") {
                    return;
                }
                //$("#winGlobalSearchResults").show();
                console.log("open Window 2");
                $("#winGlobalSearchResults").data("kendoWindow").wrapper.width("900px");
                $("#winGlobalSearchResults").data("kendoWindow").open().center();
                $scope.clearResults();

                $scope.executeSearchByType('CNTRCT', $scope.$root.globalSearchResultsData.take);
                $scope.executeSearchByType('PRC_ST', $scope.$root.globalSearchResultsData.take);
                $scope.executeSearchByType('PRC_TBL', $scope.$root.globalSearchResultsData.take);
                $scope.executeSearchByType('WIP_DEAL', $scope.$root.globalSearchResultsData.take);

            }

            $scope.executeSearchByType = function(optype, take) {
                $scope.$root.globalSearchResultsData.results[optype].searching = true;
                $scope.$root.globalSearchResultsData.results[optype].data = [];

                var url = "/api/Search/GetGlobalSearchList/" + optype + "/" + take + "/" + $scope.$root.globalSearchResultsData.searchText;
                op.ajaxGetAsync(url, function (response) {
                    $scope.$apply(function() {
                        console.log("Done: " + optype);
                        $scope.$root.globalSearchResultsData.results[optype].searching = false;
                        $scope.$root.globalSearchResultsData.results[optype].data = response;
                        if ($scope.checkResults()) {
                            $scope.drawResults();
                        }
                    });
                }, function () {
                });
            }

            $scope.$on('refreshSearchByType', function (event, opType, take) {
                if (opType === undefined || opType === null) {
                    $scope.executeSearch();
                } else {
                    if (take === undefined) take = $scope.$root.globalSearchResultsData.take;
                    $scope.executeSearchByType(opType, take);
                }
            });
        }],
        link: function (scope, element, attr) {
            scope.el = element;
        }
    };
}
