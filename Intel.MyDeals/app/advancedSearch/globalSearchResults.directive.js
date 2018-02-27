angular
    .module('app.advancedSearch')
    .directive('globalSearchResults', globalSearchResults);

globalSearchResults.$inject = ['$compile', '$timeout', 'dataService', '$uibModal'];

function globalSearchResults($compile, $timeout, dataService, $uibModal) {

    return {
        scope: {
        },
        restrict: 'AE',
        templateUrl: '/app/advancedSearch/globalSearchResults.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.opTypeModel = 'ALL';

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

            $scope.$watchCollection('$root.globalSearchResultsData.opTypeModel', function () {
                $scope.forceExecute();
            });

            $scope.forceExecute = function () {
                var win = $("#winGlobalSearchResults").data("kendoWindow");
                if ($scope.$root.globalSearchResultsData.searchText !== "" && win.element.is(":hidden")) win.open().center();

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

            $scope.gotoContract = function (id) {
                $("#winGlobalSearchResults").data("kendoWindow").close();
                var force = (window.location.href.indexOf("Contract#") >= 0);
                window.location.href = "/Contract#/manager/" + id;
                if (force) window.location.reload(true);
            }
            $scope.gotoPs = function (id) {
                $("#winGlobalSearchResults").data("kendoWindow").close();
                var force = (window.location.href.indexOf("advancedSearch#") >= 0);
                window.location.href = "/advancedSearch#/gotoPs/" + id;
                if (force) window.location.reload(true);
            }
            $scope.gotoPt = function (id) {
                $("#winGlobalSearchResults").data("kendoWindow").close();
                var force = (window.location.href.indexOf("advancedSearch#") >= 0);
                window.location.href = "/advancedSearch#/gotoPt/" + id;
                if (force) window.location.reload(true);
            }
            $scope.gotoDeal = function (id) {
                $("#winGlobalSearchResults").data("kendoWindow").close();
                var force = (window.location.href.indexOf("advancedSearch#") >= 0);
                window.location.href = "/advancedSearch#/gotoDeal/" + id;
                if (force) window.location.reload(true);
            }
            $scope.gotoAdvanced = function ()
            {
                $("#winGlobalSearchResults").data("kendoWindow").close();
                var force = (window.location.href.indexOf("advancedSearch#") >= 0);
                window.location.href = "/advancedSearch#/attributeSearch";
                if (force) window.location.reload(true);
            }

            $scope.more = function (objType) {
                $scope.$root.$broadcast('refreshSearchByType', objType, 50);
            }

            $scope.EnterPressed = function() {
                //KeyCode 13 is 'Enter'
                if (event.keyCode === 13) {
                    $scope.forceExecute();
                }
            }

            if ($scope.$root.globalSearchResultsData.searchText === "") {
                $("#winGlobalSearchResults").data("kendoWindow").close();
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}
