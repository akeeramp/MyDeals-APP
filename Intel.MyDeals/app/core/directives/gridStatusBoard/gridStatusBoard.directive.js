angular
    .module('app.core')
    .directive('gridStatusBoard', gridStatusBoard);

gridStatusBoard.$inject = ['$compile', 'objsetService', '$timeout'];

function gridStatusBoard($compile, objsetService, $timeout) {
    return {
        scope: {
            custId: '=',
            startDt: '=',
            endDt: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridStatusBoard/gridStatusBoard.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

        	$scope.isLoaded = false;
            $scope.stages = [];
            $scope.initDsLoaded = false;
            $scope.stageCnt = 0;

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
                                "CustomerIds": [$scope.custId],
                                "StartDate": $scope.startDt,
                                "EndDate": $scope.endDt
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
                            PASSED_VALIDATION: { type: "string" },
                            TITLE: { type: "string" },
                            CUST_NM: { type: "string" },
                            STRT_DTM: { type: "date" },
                            END_DTM: { type: "date" },
                            NOTES: { type: "string" },
                            NUM_APPRV_PRC_ST: { type: "number" },
                            NUM_PRC_ST: { type: "number" },
                            PERC_PRC_ST: { type: "number"}
                        }
                    }
                },
                requestEnd: function (e) {
                    if ($scope.initDsLoaded || e.response === undefined) return;

                    var rtn = {};
                    var tmp = [];
                    $scope.stageCnt = e.response.length;

                    for (var i = 0; i < e.response.length; i++) {
                        e.response[i]["PERC_PRC_ST"] = (e.response[i]["NUM_PRC_ST"] === 0 ? 0 : e.response[i]["NUM_APPRV_PRC_ST"] / e.response[i]["NUM_PRC_ST"] * 100);

                        // temporary untill we get stages
                        if (rtn[e.response[i].WF_STG_CD] === undefined) rtn[e.response[i].WF_STG_CD] = 0;
                        rtn[e.response[i].WF_STG_CD]++;
                    }

                    angular.forEach(rtn, function (value, key) {
                        this.push({ "Stage": key, "Cnt": value });
                    }, tmp);

                    $scope.stages = tmp;
                    $scope.$apply();

                    $scope.initDsLoaded = true;
                    $scope.isLoaded = true;
                }

            });

            $scope.jumptoSummary = window.usrRole === "DA" ? "/summary" : "";
            $scope.ds = {
                dataSource: $scope.contractDs,
                resizable: true,
                filterable: true,
                sortable: true,
                pageable: true,
                columns: [
                    {
                        field: "WF_STG_CD",
                        title: "&nbsp;",
                        width: "20px",
                        filterable: false,
                        template: '<div class="status #:WF_STG_CD#" title="#:WF_STG_CD[0]#">#:WF_STG_CD[0]#</div>'
                    }, {
                        title: "Contract Title",
                        field: "TITLE",
                        template: '<span><a href="/Contract\\#/manager/#:CNTRCT_OBJ_SID#' + $scope.jumptoSummary + '" target="_blank" title="Click to open the Contract in the Contract Editor"><span style="color: \\#FFA300;">[#:CNTRCT_OBJ_SID#]</span> #:TITLE#</a></span>'
                    }, {
                        title: "Customer",
                        field: "CUST_NM",
                        width: "140px",
                        filterable: { multi: true }
                    }, {
                        field: "STRT_DTM",
                        title: "Start Date",
                        format: "{0: MM/dd/yyyy}",
                        width: "110px",
                        filterable: { multi: true }
                    }, {
                        field: "END_DTM",
                        title: "End Date",
                        format: "{0: MM/dd/yyyy}",
                        width: "110px",
                        filterable: { multi: true }
                    }, {
                        title: "Notes",
                        field: "NOTES",
                        width: "170px"
                    }
                ]
            };

            $scope.clkFilter = function (el) {
                $(".stgLnk").removeClass('active');
                $("#" + el).addClass('active');
                var elStatus = el.replace('fltr_', '');

                if (elStatus === "All")
                    $scope.contractDs.filter({});
                else
                    $scope.contractDs.filter({ field: "WF_STG_CD", operator: "eq", value: elStatus });
            }

            $scope.$on('refresh', function (event, args) {
                var scope = event.currentScope;
                scope.custId = args.custId;
                scope.startDt = args.startDate;
                scope.endDt = args.endDate;
                scope.initDsLoaded = false;
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

