angular
    .module('app.core')
    .directive('contractStatusBoard', contractStatusBoard);

contractStatusBoard.$inject = ['$compile', 'objsetService', 'colorDictionary', 'securityService'];

function contractStatusBoard($compile, objsetService, colorDictionary, securityService) {
    return {
        scope: {
            contractId: '=ngModel'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/gridStatusBoard/contractStatusBoard.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {

            $scope.isLoaded = false;

            objsetService.readContractStatus($scope.contractId).then(function (response) {
                $scope.init(response.data);
                $scope.isLoaded = true;
            });

            $scope.CAN_VIEW_COST_TEST = securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper); // Can view the pass/fail
            $scope.CAN_VIEW_MEET_COMP = securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null) && (window.usrRole !== "FSE"); // Can view meetcomp pass fail

            $scope.sbData = {};

            $scope.gridDs = new kendo.data.DataSource({
                data: []
            });

            $scope.mainGridOptions = {
                dataSource: $scope.gridDs,
                sortable: true,
                filterable: true,
                columns: [{
                    field: "id",
                    title: "&nbsp;",
                    width: "30px",
                    sortable: false,
                    filterable: false,
                    template: "<a href='\\#' ng-click='gotoContractManager(dataItem.id)' style='margin-left: 3px;' title='Click to open the Contract in the Contract Editor'><i class='intelicon-frame-template' style='font-size: 20px;'></i></a>"
                }, {
                    field: "stage",
                    title: "Strategy Stage",
                    template: "<span><i class='intelicon-workflow-process-outlined' style='color: {{getColorStage(dataItem)}}; font-size: 20px;'></i> {{dataItem.stage}}</span>"
                }, {
                    field: "name",
                    title: "Strategy Name",
                    template: "<a href='\\#' ng-click='gotoContractManager(dataItem.id)' style='margin-left: 3px;' title='Click to open the Contract in the Contract Editor'>{{dataItem.name}}</a>"
                }, {
                    field: "pct",
                    title: "Price Cost Test Results",
                    template: "<icon-mct-pct ng-model='dataItem.pct' icon-class=\"'medIcon'\"></icon-mct-pct>",
                    hidden: !$scope.CAN_VIEW_COST_TEST
                }, {
                    field: "mct",
                    title: "Meet Comp Test Results",
                    template: "<icon-mct-pct ng-model='dataItem.mct' icon-class=\"'medIcon'\"></icon-mct-pct>",
                    hidden: !$scope.CAN_VIEW_MEET_COMP
                }]
            };

            $scope.gotoContractManager = function (id) {
                var lnk = "/Contract#/manager/" + $scope.contractId;
                if (window.usrRole === "DA") {
                    lnk = "/Contract#/manager/" + $scope.contractId + "/summary";
                }
                window.open(lnk, '_blank');
            }

            $scope.recurCalcData = function (data, defStage) {

                var ret = [];

                for (var i = 0; i < data.length; i++) {
                    var results = ["Pass", "Fail", "InComplete", "NA"];
                    var next = "";
                    var titleCd = "TITLE";

                    if (data[i]["dc_type"] === "CNTRCT") {
                        next = "PRC_ST";
                        defStage = "InComplete";
                    }
                    var stg = !data[i]["WF_STG_CD"] ? defStage : data[i]["WF_STG_CD"];
                    ret.push({
                        "id": data[i]["DC_ID"],
                        "name": data[i][titleCd],
                        "obj": $scope.getObjType(data[i]["dc_type"]),
                        "type": data[i]["OBJ_SET_TYPE_CD"],
                        "stage": stg,
                        "valid": data[i]["PASSED_VALIDATION"],
                        "mct": data[i]["MEETCOMP_TEST_RESULT"],
                        "pct": data[i]["COST_TEST_RESULT"],
                        "children": data[i][next] === undefined ? [] : $scope.recurCalcData(data[i][next], stg)
                    });
                }

                return ret;
            }

            $scope.getObjType = function (obj) {
                if (obj === "CNTRCT") return "Contract";
                if (obj === "PRC_ST") return "Pricing Strategy";
                if (obj === "PRC_TBL") return "Pricing Table";
                if (obj === "PRC_TBL_ROW") return "Pricing Table Product";
                if (obj === "WIP_DEAL") return "WIP Deal";
                return "";
            }

            $scope.init = function (responseData) {

                var data = $scope.recurCalcData(responseData, "InComplete")[0];

                $scope.sbData = data;

                if (data === undefined || data === null) {
                    $scope.gridDs.data([]);
                } else {
                    $scope.refreshGrid(data);
                }
            }

            $scope.refreshGrid = function (d) {
                var d1 = [];
                if (d.children !== undefined) {
                    for (var i = 0; i < d.children.length; i++) {
                        d1.push({
                            "id": d.children[i].id,
                            "name": d.children[i].name,
                            "obj": d.children[i].obj,
                            "type": d.children[i].type,
                            "stage": d.children[i].stage,
                            "valid": d.children[i].valid,
                            "pct": d.children[i].pct,
                            "mct": d.children[i].mct
                        });
                    }
                }

                $scope.gridDs.data(d1);
            }
        }],
        link: function (scope, element, attr) {
        }
    };
}
