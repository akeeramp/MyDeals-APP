(function () {
    'use strict';

angular
    .module('app.contract')
    .controller('managerPctController', managerPctController);

managerPctController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary'];

function managerPctController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary) {

    var root = $scope.$parent;	// Access to parent scope

    $scope.pctFilter = "";
    $scope.$parent.isSummaryHidden = false;
    gridPctUtils.columns = {};

    $timeout(function () {
        $("#dealTypeDiv").removeClass("active");
        $("#approvalDiv").removeClass("active");
        $("#pctDiv").addClass("active");
        $scope.$apply();
    }, 50);

    $scope.selTab = function (tabName) {
        $scope.pctFilter = tabName === "All" ? "" : tabName;
    }

    $scope.getStageBgColorStyle = function (c) {
        return { backgroundColor: $scope.getColorStage(c) };
    }
    $scope.getColorStyle = function (c) {
        return { color: $scope.getColorPct(c) };
    }

    $scope.getColor = function (k, c) {
        if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
            return colorDictionary[k][c];
        }
        return "#aaaaaa";
    }
    $scope.getColorType = function (d) {
        return $scope.getColor('type', d);
    }
    $scope.getColorStage = function (d) {
        if (!d) d = "Draft";
        return $scope.getColor('stage', d);
    }
    $scope.getColorPct = function (d) {
        if (!d) d = "INCOMPLETE";
        return $scope.getColor('pct', d);
    }
    $scope.getColorMct = function (d) {
        if (!d) d = "INCOMPLETE";
        return $scope.getColor('mct', d);
    }

    $scope.isAllCollapsed = true;
    $scope.toggleSum = function () {
        var container = angular.element(".sumPsContainer");
        while (container.length !== 0) {
            //isCollapsed is only defined in the ng-repeat's local scope, so we need to iterate through them here
            container.scope().isCollapsed = $scope.isAllCollapsed;
            container = container.next();
        }
        $scope.isAllCollapsed = !$scope.isAllCollapsed;
    }

    $scope.gotoContractEditor = function (ps, pt) {
        if (!pt) {
            $state.go('contract.manager',
                {
                    cid: ps.DC_PARENT_ID
                });
        }

        $state.go('contract.manager.strategy',
            {
                cid: ps.DC_PARENT_ID,
                sid: ps.DC_ID,
                pid: pt.DC_ID
            });
    }


    $scope.customFilter = function (ps) {
        return (
            ($scope.pctFilter === undefined || $scope.pctFilter === '' || ps.COST_TEST_RESULT === '' || ps.COST_TEST_RESULT === $scope.pctFilter || ps.MEETCOMP_TEST_RESULT === '' || ps.MEETCOMP_TEST_RESULT === $scope.pctFilter) &&
            ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0 || $scope.titleInPt(ps))
            );
    }

    $scope.titleInPt = function (ps) {
        if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
        for (var i = 0; i < ps.PRC_TBL.length; i++) {
            if (ps.PRC_TBL[i].TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0) return ps;
        }
        return null;
    }

    $scope.togglePt = function (pt) {

        if (pt.isLoading === undefined || pt.isLoading === true) {

            $scope.sumGridOptions = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            url: "/api/PricingTables/v1/GetPctDetails/" + pt.DC_ID,
                            type: "GET",
                            dataType: "json"
                        }
                    },
                    schema: {
                        model: $scope.templates.models[pt.OBJ_SET_TYPE_CD]
                    },
                    group: { field: "DEAL_ID" },
                    requestEnd: function (e) {
                        var response = e.response;
                        for (var i = 0; i < response.length; i++) {
                            var item = response[i];
                            if (!gridPctUtils.columns[item.DEAL_ID]) {
                                var cols = $scope.templates.columns[pt.OBJ_SET_TYPE_CD];
                                var tmplt = "<table style='float: left; margin-top: -23px;'><colgroup><col style='width: 30px;'>";
                                var tr = "<td></td>";
                                for (var c = 0; c < cols.length; c++) {
                                    var val = item[cols[c].field];
                                    if (!!cols[c].format) {
                                        val = kendo.toString(val, cols[c].format.replace("{0:", "").replace("}", ""));
                                    }
                                    if (!!cols[c].template) {
                                        var newVal = kendo.template(cols[c].template)(item);
                                        if (newVal.indexOf("ng-bind") < 0) {
                                            val = newVal;
                                        }
                                    }
                                    if (cols[c].field === "DEAL_ID") {
                                        val = "<b>" + val + "</b>";
                                    }
                                    tmplt += "<col style='width:" + cols[c].width + "'>";

                                    if (cols[c].field === "PRC_CST_TST_STS") {
                                        tr += "<td style='padding-left: 0; padding-right: 6px;'>" + (cols[c].parent ? val : "") + "</td>";
                                    } else {
                                        tr += "<td style='padding-left: 6px; padding-right: 6px;'>" + (cols[c].parent ? val : "") + "</td>";
                                    }
                                }
                                tmplt += "</colgroup><tbody><tr>" + tr + "</tr></tbody></table>";

                                gridPctUtils.columns[item.DEAL_ID] = tmplt;
                            }
                        }
                    }
                },
                sortable: false,
                height: 250,
                columns: $scope.templates.columns[pt.OBJ_SET_TYPE_CD],
                dataBound: function() {
                    var grid = this;
                    if (grid.dataSource.group().length > 0) {
                        $(".k-grouping-row").each(function () {
                            grid.collapseGroup(this);
                        });
                    }
                }

            }
            var html = "<kendo-grid options='sumGridOptions' class='opUiContainer md dashboard'></kendo-grid>";
            var template = angular.element(html);
            var linkFunction = $compile(template);
            linkFunction($scope);

            $("#sumWipGrid_" + pt.DC_ID).html(template);

            pt.isLoading = false;
        }

    }

    // Global Settings
    $scope.cellColumns = {
        "PRC_CST_TST_STS": {
            field: "PRC_CST_TST_STS",
            title: "PCT Result",
            width: "120px",
            template: "#= gridPctUtils.getResultMapping(PRC_CST_TST_STS) #",
            parent: true
        },
        "DEAL_ID": {
            field: "DEAL_ID",
            title: "Deal Id",
            width: "100px",
            template: "#=DEAL_ID#",
            groupHeaderTemplate: "#=gridPctUtils.getColumnTemplate(value)#",
            parent: true
        },
        "DEAL_STRT_DT": {
            field: "DEAL_STRT_DT",
            title: "Deal Start/End",
            width: "170px",
            template: "#= kendo.toString(new Date(DEAL_STRT_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(DEAL_END_DT), 'M/d/yyyy') #",
            parent: true
        },
        "PRODUCT": {
            field: "PRODUCT",
            title: "Product",
            width: "170px",
            parent: false
        },
        "CAP": {
            field: "CAP",
            title: "CAP",
            format: "{0:c}",
            width: "100px",
            parent: false
        },
        "MAX_RPU": {
            field: "MAX_RPU",
            title: "Max RPU",
            format: "{0:c}",
            width: "100px",
            parent: false
        },
        "ECAP_PRC": {
            field: "ECAP_PRC",
            title: "ECAP Price",
            format: "{0:c}",
            width: "100px",
            parent: false
        },
        "ECAP_FLR": {
            field: "ECAP_FLR",
            title: "ECAP Floor",
            format: "{0:c}",
            width: "100px",
            parent: false
        },
        "LOW_NET_PRC": {
            field: "LOW_NET_PRC",
            title: "Lowest Net Price",
            format: "{0:c}",
            width: "140px",
            parent: false
        },
        "PRD_COST": {
            field: "PRD_COST",
            title: "Cost",
            format: "{0:c}",
            width: "100px",
            parent: false
        },
        "COST_TEST_OVRRD_FLG": {
            field: "COST_TEST_OVRRD_FLG",
            title: "Cost Test Analysis<br\>Override",
            width: "140px",
            parent: false
        },
        "COST_TEST_OVRRD_CMT": {
            field: "COST_TEST_OVRRD_CMT",
            title: "Cost Test Analysis<br\>Override Comments",
            width: "140px",
            parent: false
        },
        "RTL_CYC_NM": {
            field: "RTL_CYC_NM",
            title: "Retail Cycle",
            width: "140px",
            parent: false
        },
        "RTL_PULL_DLR": {
            field: "RTL_PULL_DLR",
            title: "Retail Pull $",
            format: "{0:c}",
            width: "140px",
            parent: false
        },
        "MKT_SEG": {
            field: "MKT_SEG",
            title: "Market Segment",
            width: "140px",
            parent: true
        },
        "GEO": {
            field: "GEO",
            title: "GEO",
            width: "140px",
            parent: true
        },
        "PYOUT_BASE_ON": {
            field: "PYOUT_BASE_ON",
            title: "Payout Based On",
            width: "140px",
            parent: true
        },
        "GRP_DEALS": {
            field: "GRP_DEALS",
            title: "Group Deals",
            width: "140px",
            parent: true
        },
        "LAST_COST_TEST_RUN": {
            field: "LAST_COST_TEST_RUN",
            title: "Time / Date Last Cost Ran",
            width: "160px",
            template: "#= kendo.toString(new Date(LAST_COST_TEST_RUN), 'M/d/yyyy HH:mm:ss') #",
            parent: false
        },
        "CNSMPTN_RSN": {
            field: "CNSMPTN_RSN",
            title: "Consumption Reason",
            width: "140px",
            parent: true
        },
        "PROG_PMT": {
            field: "PROG_PMT",
            title: "Program Payment",
            width: "140px",
            parent: true
        }
    }
    $scope.templates = {
        "models" : {
            "ECAP": {
                id: "DEAL_ID",
                fields: {
                    PRC_CST_TST_STS: { type: "string" },
                    DEAL_ID: { type: "number" },
                    DEAL_STRT_DT: { type: "string" },
                    PRODUCT: { type: "string" },
                    CAP: { type: "number" },
                    ECAP_PRC: { type: "number" },
                    ECAP_FLR: { type: "number" },
                    LOW_NET_PRC: { type: "number" },
                    PRD_COST: { type: "number" },
                    COST_TEST_OVRRD_FLG: { type: "string" },
                    COST_TEST_OVRRD_CMT: { type: "string" },
                    RTL_CYC_NM: { type: "string" },
                    RTL_PULL_DLR: { type: "number" },
                    MKT_SEG: { type: "string" },
                    GEO: { type: "string" },
                    PYOUT_BASE_ON: { type: "string" },
                    CNSMPTN_RSN: { type: "string" },
                    PROG_PMT: { type: "string" },
                    GRP_DEALS: { type: "string" },
                    LAST_COST_TEST_RUN: { type: "string" }
                }
            },
            "VOL_TIER": {
                id: "DEAL_ID",
                fields: {
                    PRC_CST_TST_STS: { type: "string" },
                    DEAL_ID: { type: "number" },
                    DEAL_STRT_DT: { type: "string" },
                    PRODUCT: { type: "string" },
                    MAX_RPU: { type: "number" },
                    LOW_NET_PRC: { type: "number" },
                    PRD_COST: { type: "number" },
                    COST_TEST_OVRRD_FLG: { type: "string" },
                    COST_TEST_OVRRD_CMT: { type: "string" },
                    RTL_CYC_NM: { type: "string" },
                    RTL_PULL_DLR: { type: "number" },
                    MKT_SEG: { type: "string" },
                    GEO: { type: "string" },
                    PYOUT_BASE_ON: { type: "string" },
                    CNSMPTN_RSN: { type: "string" },
                    PROG_PMT: { type: "string" },
                    GRP_DEALS: { type: "string" },
                    LAST_COST_TEST_RUN: { type: "string" }
                }
            },
            "PROGRAM": {
                id: "DEAL_ID",
                fields: {
                    PRC_CST_TST_STS: { type: "string" },
                    DEAL_ID: { type: "number" },
                    DEAL_STRT_DT: { type: "string" },
                    PRODUCT: { type: "string" },
                    MAX_RPU: { type: "number" },
                    LOW_NET_PRC: { type: "number" },
                    PRD_COST: { type: "number" },
                    COST_TEST_OVRRD_FLG: { type: "string" },
                    COST_TEST_OVRRD_CMT: { type: "string" },
                    RTL_CYC_NM: { type: "string" },
                    RTL_PULL_DLR: { type: "number" },
                    MKT_SEG: { type: "string" },
                    GEO: { type: "string" },
                    PYOUT_BASE_ON: { type: "string" },
                    CNSMPTN_RSN: { type: "string" },
                    PROG_PMT: { type: "string" },
                    GRP_DEALS: { type: "string" },
                    LAST_COST_TEST_RUN: { type: "string" }
                }
            }
        },
        "columns": {
            "ECAP": [
                $scope.cellColumns["PRC_CST_TST_STS"],
                $scope.cellColumns["DEAL_ID"],
                $scope.cellColumns["DEAL_STRT_DT"],
                $scope.cellColumns["PRODUCT"],
                $scope.cellColumns["CAP"],
                $scope.cellColumns["ECAP_PRC"],
                $scope.cellColumns["ECAP_FLR"],
                $scope.cellColumns["LOW_NET_PRC"],
                $scope.cellColumns["PRD_COST"],
                $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                $scope.cellColumns["RTL_CYC_NM"],
                $scope.cellColumns["RTL_PULL_DLR"],
                $scope.cellColumns["MKT_SEG"],
                $scope.cellColumns["GEO"],
                $scope.cellColumns["PYOUT_BASE_ON"],
                $scope.cellColumns["CNSMPTN_RSN"],
                $scope.cellColumns["PROG_PMT"],
                $scope.cellColumns["GRP_DEALS"],
                $scope.cellColumns["LAST_COST_TEST_RUN"]
            ],
            "VOL_TIER": [
                $scope.cellColumns["PRC_CST_TST_STS"],
                $scope.cellColumns["DEAL_ID"],
                $scope.cellColumns["DEAL_STRT_DT"],
                $scope.cellColumns["PRODUCT"],
                $scope.cellColumns["MAX_RPU"],
                $scope.cellColumns["LOW_NET_PRC"],
                $scope.cellColumns["PRD_COST"],
                $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                $scope.cellColumns["RTL_CYC_NM"],
                $scope.cellColumns["RTL_PULL_DLR"],
                $scope.cellColumns["MKT_SEG"],
                $scope.cellColumns["GEO"],
                $scope.cellColumns["PYOUT_BASE_ON"],
                $scope.cellColumns["CNSMPTN_RSN"],
                $scope.cellColumns["PROG_PMT"],
                $scope.cellColumns["GRP_DEALS"],
                $scope.cellColumns["LAST_COST_TEST_RUN"]
            ],
            "PROGRAM": [
                $scope.cellColumns["PRC_CST_TST_STS"],
                $scope.cellColumns["DEAL_ID"],
                $scope.cellColumns["DEAL_STRT_DT"],
                $scope.cellColumns["PRODUCT"],
                $scope.cellColumns["MAX_RPU"],
                $scope.cellColumns["LOW_NET_PRC"],
                $scope.cellColumns["PRD_COST"],
                $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                $scope.cellColumns["RTL_CYC_NM"],
                $scope.cellColumns["RTL_PULL_DLR"],
                $scope.cellColumns["MKT_SEG"],
                $scope.cellColumns["GEO"],
                $scope.cellColumns["PYOUT_BASE_ON"],
                $scope.cellColumns["CNSMPTN_RSN"],
                $scope.cellColumns["PROG_PMT"],
                $scope.cellColumns["GRP_DEALS"],
                $scope.cellColumns["LAST_COST_TEST_RUN"]
            ]
        }
    }




}
})();
