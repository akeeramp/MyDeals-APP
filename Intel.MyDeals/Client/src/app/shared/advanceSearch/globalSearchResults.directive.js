angular
    .module('app')
    .directive('globalSearchResults', globalSearchResults);

globalSearchResults.$inject = ['$compile', '$timeout', 'dataService', '$uibModal'];

function globalSearchResults($compile, $timeout, dataService, $uibModal) {

    return {
        scope: {
        },
        restrict: 'AE',
        // templateUrl:'Client/src/app/shared/advanceSearch/globalSearchResults.directive.html',
        template:`
        <div class="container-fluid">
            <div style="margin-bottom: 15px; text-align: center;">
                <i class="search intelicon-search" style="margin-right: 10px; font-size: 28px; color: #0071C5; vertical-align: sub;"></i>
                <input type="text" placeholder="Search for deal #, contract, or pricing strategy"
                       class="k-input searchResultInpt"
                       ng-model="$root.globalSearchResultsData.searchText"
                       ng-keypress="EnterPressed($event)">
                <div class="btn-group" style="margin-top: -3px;">
                    <label class="btn btn-primary btn-sm" ng-model="$root.globalSearchResultsData.opTypeModel" uib-btn-radio="'ALL'" uncheckable>All</label>
                    <label class="btn btn-primary btn-sm" ng-model="$root.globalSearchResultsData.opTypeModel" uib-btn-radio="'CNTRCT'" uncheckable>Contract</label>
                    <label class="btn btn-primary btn-sm" ng-model="$root.globalSearchResultsData.opTypeModel" uib-btn-radio="'PRC_ST'" uncheckable>Pricing Strategy</label>
                    <label class="btn btn-primary btn-sm" ng-model="$root.globalSearchResultsData.opTypeModel" uib-btn-radio="'PRC_TBL'" uncheckable>Pricing Table</label>
                    <label class="btn btn-primary btn-sm" ng-model="$root.globalSearchResultsData.opTypeModel" uib-btn-radio="'WIP_DEAL'" uncheckable>Deals</label>
                </div>
            </div>
            <div class="row row-modal">
                <div class="col-md-{{$root.globalSearchResultsData.colCount}} row-container" ng-if="$root.globalSearchResultsData.searchIn.indexOf('CNTRCT') >= 0">
                    <h5>Contracts / Folio</h5>
                    <div class="results-container">
                        <div ng-show="$root.globalSearchResultsData.results.CNTRCT.searching" class="waiting">
                            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                            <div>Searching...</div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="no-items" ng-show="$root.globalSearchResultsData.results.CNTRCT.data.length === 0 && !$root.globalSearchResultsData.results.CNTRCT.searching">
                            No contracts found.
                        </div>
                        <div ng-repeat="item in $root.globalSearchResultsData.results.CNTRCT.data" class="search-result-item" ng-click="gotoContract(item.DC_ID)">
                            <div style="font-weight: bold; color: #003C71;">#{{item.DC_ID}}: <span style="font-weight: normal; color: #666666;">{{item.CUST_ACCNT_DIV}}</span>
                            </div>
                            <div style="color: #00AEEF;">{{item.TITLE}}</div>
                        </div>
                    </div>
                    <div class="see-more" ng-click="more('CNTRCT')" ng-show="$root.globalSearchResultsData.results.CNTRCT.data.length === $root.globalSearchResultsData.take">view more</div>
                </div>
                <div class="col-md-{{$root.globalSearchResultsData.colCount}} row-container" ng-if="$root.globalSearchResultsData.searchIn.indexOf('PRC_ST') >= 0">
                    <h5>Pricing Strategy</h5>
                    <div class="results-container">
                        <div ng-show="$root.globalSearchResultsData.results.PRC_ST.searching" class="waiting">
                            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                            <div>Searching...</div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="no-items" ng-show="$root.globalSearchResultsData.results.PRC_ST.data.length === 0 && !$root.globalSearchResultsData.results.PRC_ST.searching">
                            No pricing strategies found.
                        </div>
                        <div ng-repeat="item in $root.globalSearchResultsData.results.PRC_ST.data" class="search-result-item" ng-click="gotoPs(item.DC_ID)">
                            <div style="font-weight: bold; color: #003C71;">#{{item.DC_ID}}</div>
                            <div style="color: #00AEEF;">{{item.TITLE}}</div>
                        </div>
                    </div>
                    <div class="see-more" ng-click="more('PRC_ST')" ng-show="$root.globalSearchResultsData.results.PRC_ST.data.length === $root.globalSearchResultsData.take">view more</div>
                </div>
                <div class="col-md-{{$root.globalSearchResultsData.colCount}} row-container" ng-if="$root.globalSearchResultsData.searchIn.indexOf('PRC_TBL') >= 0">
                    <h5>Pricing Table</h5>
                    <div class="results-container">
                        <div ng-show="$root.globalSearchResultsData.results.PRC_TBL.searching" class="waiting">
                            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                            <div>Searching...</div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="no-items" ng-show="$root.globalSearchResultsData.results.PRC_TBL.data.length === 0 && !$root.globalSearchResultsData.results.PRC_TBL.searching">
                            No pricing tables found.
                        </div>
                        <div ng-repeat="item in $root.globalSearchResultsData.results.PRC_TBL.data" class="search-result-item" ng-click="gotoPt(item.DC_ID)">
                            <div style="font-weight: bold; color: #003C71;">#{{item.DC_ID}}</div>
                            <div style="color: #00AEEF;">{{item.TITLE}}</div>
                        </div>
                    </div>
                    <div class="see-more" ng-click="more('PRC_TBL')" ng-show="$root.globalSearchResultsData.results.PRC_TBL.data.length === $root.globalSearchResultsData.take">view more</div>
                </div>
                <div class="col-md-{{$root.globalSearchResultsData.colCount}} row-container" ng-if="$root.globalSearchResultsData.searchIn.indexOf('WIP_DEAL') >= 0">
                    <h5>Deal</h5>
                    <div class="results-container">
                        <div ng-show="$root.globalSearchResultsData.results.WIP_DEAL.searching" class="waiting">
                            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                            <div>Searching...</div>
                            <span class="sr-only">Loading...</span>
                        </div>
                        <div class="no-items" ng-show="$root.globalSearchResultsData.results.WIP_DEAL.data.length === 0 && !$root.globalSearchResultsData.results.WIP_DEAL.searching">
                            No deals found.
                        </div>
                        <div ng-repeat="item in $root.globalSearchResultsData.results.WIP_DEAL.data" class="search-result-item" ng-click="gotoDeal(item.DC_ID)">
                            <div class="fl">
                                <deal-popup-icon deal-id="item.DC_ID"></deal-popup-icon>
                            </div>
                            <div class="fl">
                                <div style="font-weight: bold; color: #003C71;">#{{item.DC_ID}}</div>
                                <div style="color: #00AEEF;">{{item.TITLE}}</div>
                            </div>
                            <div class="clearboth"></div>
                        </div>
                    </div>
                    <div class="see-more" ng-click="more('WIP_DEAL')" ng-show="$root.globalSearchResultsData.results.WIP_DEAL.data.length === $root.globalSearchResultsData.take">view more</div>
                </div>
            </div>
            <div class="search-advanced-tag">
                Not what you are looking for? Try our <a ng-click="gotoAdvanced()" style="cursor: pointer;">Advanced Search</a>
            </div>
        </div>
        
        <style>
            .k-window-actions .k-i-close {
                color: #ffffff !important;
            }
        
            .row.row-modal .row-container {
                padding: 0;
                font-size: 12px;
                font-family: "Intel Clear";
                font-weight: 200;
                font-style: normal;
            }
        
            .results-container {
                border: 1px solid #eeeeee;
                margin: 0 4px;
                padding: 5px;
                height: 250px;
                overflow: auto;
            }
        
            .row-modal h5 {
                margin: 0 4px 2px 6px;
                font-size: 18px;
                font-weight: 200;
                font-family: "Intel Clear";
                font-style: normal;
            }
        
            .waiting {
                text-align: center;
                padding-top: 50px;
                color: #999999;
            }
            .waiting div {
                margin-top: 10px;
            }
            .no-items {
                padding: 35px 5px;
                text-align: center;
            }
            .search-result-item {
                border-bottom: 1px solid #eeeeee;
                padding: 5px;
                cursor: pointer;
            }
            .search-result-item:hover {
                background-color: #efefef;
            }
            .see-more {
                text-align: right;
                cursor: pointer;
                color: #00AEEF;
                margin-right: 6px;
            }
            .see-more:hover {
                color: #0071C5;
            }
            .search-advanced-tag {
                margin-top: 8px;
                margin-bottom: -15px;
                margin-left: -25px;
                text-align: left;
            }
            .searchResultInpt {
                height: 22px;
                padding-left: 5px;
                margin-right: 6px;
                width: 325px;
                margin-bottom: 15px;
            }
        </style>`,
        controller: ['$scope', '$http', function ($scope, $http) {

           let  kenWindow= $("#winGlobalSearchResults").kendoWindow({
                title: "About Alvar Aalto",
                visible: false,
                width:"900px"
            });

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
                    if(kenWindow.data("kendoWindow").wrapper){
                        kenWindow.data("kendoWindow").wrapper.width("900px");
                    }
                    //kenWindow.data("kendoWindow").wrapper.width("900px");
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
                if(kenWindow.data("kendoWindow")){
                    kenWindow.data("kendoWindow").close()
                };
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}
