angular
    .module('app.core')
    .directive('gridStatusBoard', gridStatusBoard);

gridStatusBoard.$inject = ['$compile', 'objsetService', '$timeout'];

function gridStatusBoard($compile, objsetService, $timeout) {
    return {
        scope: {
            custIds: '=',
            startDt: '=',
            endDt: '=',
            includeTenders: '=?',
            favContractIds: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridStatusBoard/gridStatusBoard.directive.html',
        controller: ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {

            $scope.isLoaded = false;
            $scope.stages = [];
            $scope.initDsLoaded = false;
            $scope.stageCnt = 0;
            $scope.favCount = 0;
            $scope.alertCount = 0;
            var activeFilter = 'All';

            // Construct the fav contract id map
            var favContractsMap = {};
            if (!!$scope.favContractIds) {
                $scope.favContractIds.split(",").forEach(function (favContract) {
                    favContractsMap[favContract] = favContract;
                });
            }

            $scope.toolTipOptions = {
                filter: "td:nth-child(4)",
                position: "top",
                content: function (e) {
                    var grid = e.target.closest(".k-grid").getKendoGrid();
                    if (!!grid) {
                        var dataItem = grid.dataItem(e.target.closest("tr"));
                        if (dataItem.CRE_EMP_NM === undefined || dataItem.CRE_EMP_NM === "") {
                            return "";
                        }
                        return "Created By : " + dataItem.CRE_EMP_NM;
                    }

                },
                show: function (e) {
                    if (this.content.text().length > 0) {
                        this.content.parent().css("min-width", "200px");
                        this.content.parent().css("visibility", "visible");
                    }
                },
                hide: function (e) {
                    this.content.parent().css("visibility", "hidden");
                }
            }

            $scope.contractDs = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/Dashboard/GetDashboardContractSummary",
                        type: "POST",
                        dataType: "json",
                        headers: {
                            '__RequestVerificationToken': $http.defaults.headers.common['ReqVerToken']
                        },
                        data: function () {
                            return {
                                "CustomerIds": $scope.custIds,
                                "StartDate": $scope.startDt,
                                "EndDate": $scope.endDt,
                                "DontIncludeTenders": $scope.includeTenders
                            };
                        }
                    }
                },
                sort: { field: "CNTRCT_OBJ_SID", dir: "desc" },
                pageSize: 25,
                schema: {
                    model: {
                        id: "CNTRCT_OBJ_SID",
                        fields: {
                            WF_STG_CD: { type: "string" },
                            IS_FAVORITE: { type: "boolean" },
                            HAS_ALERT: { type: "boolean" },
                            TITLE: { type: "string" },
                            CUST_NM: { type: "string" },
                            STRT_DTM: { type: "date" },
                            END_DTM: { type: "date" },
                            NOTES: { type: "string" }
                        }
                    }
                },
                requestEnd: function (e) {
                    if ($scope.initDsLoaded || e.response === undefined) return;

                    var rtn = {};
                    var tmp = [];
                    $scope.stageCnt = e.response.length;
                    $scope.favCount = 0;
                    $scope.alertCount = 0;
                    for (var i = 0; i < e.response.length; i++) {
                        if (rtn[e.response[i].WF_STG_CD] === undefined) rtn[e.response[i].WF_STG_CD] = 0;
                        rtn[e.response[i].WF_STG_CD]++;

                        if (e.response[i].HAS_ALERT && e.response[i].WF_STG_CD !== "Complete") {
                            $scope.alertCount++;
                        } else {
                            e.response[i].HAS_ALERT = false;
                        }

                        // Set the IS_FAVORITE if contract id exists in user favorite contract id map.
                        e.response[i]["IS_FAVORITE"] = false;
                        if (favContractsMap[e.response[i].CNTRCT_OBJ_SID] != undefined) {
                            e.response[i]["IS_FAVORITE"] = true;
                            $scope.favCount++;
                        }
                    }

                    angular.forEach(rtn, function (value, key) {
                        this.push({ "Stage": key, "Cnt": value });
                    }, tmp);

                    $scope.stages = tmp;

                    $scope.initDsLoaded = true;
                    $scope.isLoaded = true;

                    $scope.$apply();

                    //$timeout(function () {
                    //    $("#gridContractStatus .k-pager-info").html("Results limited to 100 most recently modified. Use Search for full list.");
                    //}, 200);
                }

            });

            $scope.jumptoSummary = window.usrRole === "DA" ? "/summary" : "";
            $scope.ds = {
                dataSource: $scope.contractDs,
                resizable: true,
                filterable: true,
                sortable: true,
                pageable: {
                    pageSize: 25,
                    buttonCount: 5
                },
                filterMenuInit: function (e) {
                    if (e.field === "CUST_NM") {
                        var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck")  //= e.target.closest(".k-grid").getKendoGrid();
                        filterMultiCheck.container.empty();
                        filterMultiCheck.checkSource.sort({ field: e.field, dir: "asc" });
                        filterMultiCheck.checkSource.data(filterMultiCheck.checkSource.view().toJSON());
                        filterMultiCheck.createCheckBoxes();
                    }
                },
                columns: [
                    {
                        field: "WF_STG_CD",
                        title: "&nbsp;",
                        width: "20px",
                        filterable: false,
                        template: '<div class="status #:WF_STG_CD#" title="#:WF_STG_CD[0]#">#:WF_STG_CD[0]#</div>'
                    }, {
                        field: "IS_FAVORITE",
                        title: "&nbsp;",
                        width: "29px",
                        filterable: false,
                        template: "<div role='button' ng-class='{\"active\":dataItem.IS_FAVORITE === true}' title='Click to add/remove as favorite' class='intelicon-favorite-rating-solid' ng-click='onFavChange(dataItem, $event)'>"
                    }, {
                        title: "Contract Title",
                        field: "TITLE",
                        width: "200px",
                        template: '<span><a href="/Contract\\#/manager/#:CNTRCT_OBJ_SID#' + $scope.jumptoSummary + '" target="_blank" title="Click to open the Contract in the Contract Editor"><span style="color: \\#FFA300;">[#:CNTRCT_OBJ_SID#]</span> #:TITLE#</a></span>'
                    }, {
                        title: "Customer",
                        field: "CUST_NM",
                        width: "140px",
                        filterable: { multi: true, search: true }
                    }, {
                        field: "STRT_DTM",
                        title: "Start Date",
                        format: "{0: MM/dd/yyyy}",
                        width: "110px",
                        filterable: {
                            ui: function (element) {
                                element.kendoDatePicker({
                                    format: "{0: MM/dd/yyyy}"
                                });
                            },
                            operators: {
                                date: {
                                    eq: "Is Equal To",
                                    neq: "Is Not Equal To",
                                    gt: "After",
                                    lt: "Before"
                                }
                            }
                        }
                    }, {
                        field: "END_DTM",
                        title: "End Date",
                        format: "{0: MM/dd/yyyy}",
                        width: "110px",
                        filterable: {
                            ui: function (element) {
                                element.kendoDatePicker({
                                    format: "{0: MM/dd/yyyy}"
                                });
                            },
                            operators: {
                                date: {
                                    eq: "Is Equal To",
                                    neq: "Is Not Equal To",
                                    gt: "After",
                                    lt: "Before"
                                }
                            }
                        }
                    }, {
                        title: "Notes",
                        field: "NOTES",
                        width: "170px"
                    }
                ]
            };

            //Changes to fav contract id will broadcast a change to dashboardController to SaveLayout changes
            $scope.onFavChange = function (dataItem, e) {
                dataItem.IS_FAVORITE = !dataItem.IS_FAVORITE;

                // If user selects/unselects too fast too many requests will queue up. If there is already a timeout called cancel it and send only one request. When user comes to peace.
                if (delayStartFunction) $timeout.cancel(delayStartFunction);
                var delayStartFunction = $timeout(function () {
                    if (!dataItem.IS_FAVORITE) {
                        delete favContractsMap[dataItem.CNTRCT_OBJ_SID];
                        $scope.favCount--;
                        if (activeFilter === 'Favorites') $scope.clkFilter('fltr_Favorites');
                    } else {
                        favContractsMap[dataItem.CNTRCT_OBJ_SID] = dataItem.CNTRCT_OBJ_SID;
                        $scope.favCount++
                    }
                    $scope.favContractIds = Object.keys(favContractsMap).map(function (k) {
                        return k;
                    }).join(',');

                    $rootScope.$broadcast('favContractChanged', { 'favContractIds': $scope.favContractIds });
                }, 500);
            }

            $scope.clkFilter = function (el) {
                $(".stgLnk").removeClass('active');
                $("#" + el).addClass('active');
                activeFilter = el.replace('fltr_', '');
                switch (activeFilter) {
                    case "All": $scope.contractDs.filter({});
                        break;
                    case "Favorites": $scope.contractDs.filter({ field: "IS_FAVORITE", operator: "eq", value: true });
                        break;
                    case "HasAlert": $scope.contractDs.filter({ field: "HAS_ALERT", operator: "eq", value: true });
                        break;
                    default:
                        $scope.contractDs.filter({ field: "WF_STG_CD", operator: "eq", value: activeFilter });
                }
            }

            $scope.$on('refresh', function (event, args) {
                var scope = event.currentScope;
                scope.custIds = args.custIds;
                scope.startDt = args.startDate;
                scope.endDt = args.endDate;
                scope.includeTenders = true;
                scope.initDsLoaded = false;
                $scope.isLoaded = false;
                scope.clkFilter('fltr_All');

                $timeout(function () {
                    scope.contractDs.read();
                }, 200);
            });

        }],
        link: function (scope, element, attr) {
        }
    };
}

