(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('searchResults', searchResults);

    searchResults.$inject = ['$compile', 'dataService'];
    function searchResults($compile, dataService) {
        return {
            restrict: 'E',
            scope: {
                custId: '@',
                startDt: '@',
                endDt: '@',
                value: '@',
                hideSearch: '@'
            },
            transclude: true,
            templateUrl: '/app/core/directives/searchResults/searchResults.directive.html',
            link: function (scope, element, attrs) {
                scope.searchResultItems = [];
                scope.searchResultContracts = {};
                scope.searchResultPricingStrategies = {};
                scope.searchResultPricingTables = {};

                scope.showResults = false;
                scope.showLoading = false;
                scope.searchText = scope.value;
                //scope.hideSearch = false;
                //scope.hideSearch = !!scope.hideSearch;

                //scope.$watch("searchText", function (newValue, oldValue) {
                //    //This gets called when data changes.
                //    console.log(newValue)
                //    console.log(oldValue)

                //    //TODO: hook up the below to work with search - but first get them reading the right data
                //    console.log(scope.custId)
                //    console.log(scope.startDt)
                //    console.log(scope.endDt)
                //});

                scope.searchAll = function () {
                    //clear any previous search data
                    scope.searchResultItems = [];
                    scope.searchResultContracts = {};
                    scope.searchResultPricingStrategies = {};
                    scope.searchResultPricingTables = {};

                    //perform search operation
                    dataService.get("api/Search/GetSearchResults/" + scope.searchText).then(function (data) {
                        console.log(data.data);
                        if (!!data.data) {
                            scope.searchResultItems = data.data;

                            for (var i = 0; i < data.data.length; i++) {
                                switch (data.data[i].OBJ_TYPE_SID) {
                                    case 1: //CONTRACTS
                                        if (scope.searchResultContracts[data.data[i].CUSTOMER] == null) {
                                            scope.searchResultContracts[data.data[i].CUSTOMER] = [];
                                        }
                                        scope.searchResultContracts[data.data[i].CUSTOMER].push(data.data[i]);
                                        break;
                                    case 2: //PRICING STRATEGY
                                        if (scope.searchResultPricingStrategies[data.data[i].CUSTOMER] == null) {
                                            scope.searchResultPricingStrategies[data.data[i].CUSTOMER] = [];
                                        }
                                        scope.searchResultPricingStrategies[data.data[i].CUSTOMER].push(data.data[i]);
                                        break;
                                    case 3: //PRICING TABLE
                                        if (scope.searchResultPricingTables[data.data[i].CUSTOMER] == null) {
                                            scope.searchResultPricingTables[data.data[i].CUSTOMER] = [];
                                        }
                                        scope.searchResultPricingTables[data.data[i].CUSTOMER].push(data.data[i]);
                                        break;
                                    default:
                                        //other OBJ_TYPE_SID than defined above, do nothing for now
                                }
                            }
                        }
                        scope.showResults = true;
                    });
                }

                //press enter key to search as well
                $("#searchField").keyup(function (event) {
                    if (event.keyCode === 13) {
                        $("#searchButton").click();
                    }
                });

                //for dictionary size check
                scope.isEmpty = function (obj) {
                    return Object.keys(obj).length === 0;
                }

                scope.resetSearch = function() {
                    scope.searchResultItems = [];
                    scope.searchResultContracts = {};
                    scope.searchResultPricingStrategies = {};
                    scope.searchResultPricingTables = {};

                    scope.showResults = false;
                    scope.showLoading = false;
                    //scope.searchText = "";

                    scope.showLoading = true;
                    scope.searchAll();
                }

            }
        }
    }
})();