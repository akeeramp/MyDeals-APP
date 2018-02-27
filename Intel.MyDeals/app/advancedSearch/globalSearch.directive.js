angular
    .module('app.advancedSearch')
    .directive('globalSearch', globalSearch);

globalSearch.$inject = ['$timeout', 'logger', 'objsetService', 'dataService', '$rootScope', '$compile', '$templateRequest', 'colorDictionary', '$uibModal'];

function globalSearch($timeout, logger, objsetService, dataService, $rootScope, $compile, $templateRequest, colorDictionary, $uibModal) {
    return {
        scope: {
            dataItem: '=ngModel'
        },
        restrict: 'AE',
        templateUrl: '/app/advancedSearch/globalSearch.html',
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
