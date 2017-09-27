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
                    }
                },
                sortable: true,
                height: 250,
                columns: $scope.templates.columns[pt.OBJ_SET_TYPE_CD]

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
        "COST_TEST_RESULT": {
            field: "COST_TEST_RESULT",
            title: "PCT Result",
            width: "120px"
        },
        "DC_ID": {
            field: "DC_ID",
            title: "Deal Id",
            width: "100px",
            template:
                "<div class='dealLnk'><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{dataItem.PASSED_VALIDATION || \"Not validated yet\"}}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Valid\" || dataItem.PASSED_VALIDATION === \"Finalizing\" || dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-protection-failed-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i><a href=''>#=DC_ID#</a></div>"
        },
        "START_DT": {
            field: "START_DT",
            title: "Deal Start/End",
            width: "170px",
            template:
                "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #"
        },
        "TITLE": {
            field: "TITLE",
            title: "Product",
            width: "170px"
        },
        "CAP": {
            field: "CAP",
            title: "CAP",
            width: "100px"
        },
        "MAX_RPU": {
            field: "MAX_RPU",
            title: "Max RPU",
            width: "100px"
        },
        "ECAP_PRICE": {
            field: "ECAP_PRICE",
            title: "ECAP Price",
            width: "100px"
        },
        "ECAP_FLR": {
            field: "ECAP_FLR",
            title: "ECAP Floor",
            width: "100px"
        },
        "TITLE1": {
            field: "TITLE",
            title: "Lowest Net Price",
            width: "100px"
        },
        "TITLE2": {
            field: "TITLE",
            title: "Cost",
            width: "100px"
        },
        "TITLE3": {
            field: "TITLE",
            title: "Cost Test Analysis Override",
            width: "140px"
        },
        "TITLE4": {
            field: "TITLE",
            title: "Cost Test Analysis Override Comments",
            width: "140px"
        },
        "TITLE5": {
            field: "TITLE",
            title: "Retail Cycle",
            width: "140px"
        },
        "TITLE6": {
            field: "TITLE",
            title: "Retail Pull $",
            width: "140px"
        },
        "MRKT_SEG": {
            field: "MRKT_SEG",
            title: "Market Segment",
            width: "140px"
        },
        "GEO_COMBINED": {
            field: "GEO_COMBINED",
            title: "GEO",
            width: "140px"
        },
        "TITLE7": {
            field: "TITLE",
            title: "Payout Based On",
            width: "140px"
        },
        "TITLE8": {
            field: "TITLE",
            title: "Group Deals",
            width: "140px"
        },
        "TITLE9": {
            field: "TITLE",
            title: "Time / Date Last Cost Ran",
            width: "140px"
        }
    }
    $scope.templates = {
        "models" : {
            "ECAP": {
                id: "DC_ID",
                fields: {
                    COST_TEST_RESULT: { type: "string" },
                    DC_ID: { type: "number" },
                    START_DT: { type: "string" },
                    TITLE: { type: "string" },
                    CAP: { type: "number" },
                    ECAP_PRICE: { type: "number" },
                    ECAP_FLR: { type: "number" },
                    TITLE1: { type: "string" },
                    TITLE2: { type: "string" },
                    TITLE3: { type: "string" },
                    TITLE4: { type: "string" },
                    TITLE5: { type: "string" },
                    TITLE6: { type: "string" },
                    MRKT_SEG: { type: "string" },
                    GEO_COMBINED: { type: "string" },
                    TITLE7: { type: "string" },
                    TITLE8: { type: "string" },
                    TITLE9: { type: "string" }
                }
            },
            "VOL_TIER": {
                id: "DC_ID",
                fields: {
                    COST_TEST_RESULT: { type: "string" },
                    DC_ID: { type: "number" },
                    START_DT: { type: "string" },
                    TITLE: { type: "string" },
                    MAX_RPU: { type: "number" },
                    TITLE1: { type: "string" },
                    TITLE2: { type: "string" },
                    TITLE3: { type: "string" },
                    TITLE4: { type: "string" },
                    TITLE5: { type: "string" },
                    TITLE6: { type: "string" },
                    MRKT_SEG: { type: "string" },
                    GEO_COMBINED: { type: "string" },
                    TITLE7: { type: "string" },
                    TITLE8: { type: "string" },
                    TITLE9: { type: "string" }
                }
            },
            "PROGRAM": {
                id: "DC_ID",
                fields: {
                    COST_TEST_RESULT: { type: "string" },
                    DC_ID: { type: "number" },
                    START_DT: { type: "string" },
                    TITLE: { type: "string" },
                    MAX_RPU: { type: "number" },
                    TITLE1: { type: "string" },
                    TITLE2: { type: "string" },
                    TITLE3: { type: "string" },
                    TITLE4: { type: "string" },
                    TITLE5: { type: "string" },
                    TITLE6: { type: "string" },
                    MRKT_SEG: { type: "string" },
                    GEO_COMBINED: { type: "string" },
                    TITLE7: { type: "string" },
                    TITLE8: { type: "string" },
                    TITLE9: { type: "string" }
                }
            }
        },
        "columns": {
            "ECAP": [
                $scope.cellColumns["COST_TEST_RESULT"],
                $scope.cellColumns["DC_ID"],
                $scope.cellColumns["START_DT"],
                $scope.cellColumns["TITLE"],
                $scope.cellColumns["CAP"],
                $scope.cellColumns["ECAP_PRICE"],
                $scope.cellColumns["ECAP_FLR"],
                $scope.cellColumns["TITLE1"],
                $scope.cellColumns["TITLE2"],
                $scope.cellColumns["TITLE3"],
                $scope.cellColumns["TITLE4"],
                $scope.cellColumns["TITLE5"],
                $scope.cellColumns["TITLE6"],
                $scope.cellColumns["MRKT_SEG"],
                $scope.cellColumns["GEO_COMBINED"],
                $scope.cellColumns["TITLE7"],
                $scope.cellColumns["TITLE8"],
                $scope.cellColumns["TITLE9"]
            ],
            "VOL_TIER": [
                $scope.cellColumns["COST_TEST_RESULT"],
                $scope.cellColumns["DC_ID"],
                $scope.cellColumns["START_DT"],
                $scope.cellColumns["TITLE"],
                $scope.cellColumns["MAX_RPU"],
                $scope.cellColumns["TITLE1"],
                $scope.cellColumns["TITLE2"],
                $scope.cellColumns["TITLE3"],
                $scope.cellColumns["TITLE4"],
                $scope.cellColumns["TITLE5"],
                $scope.cellColumns["TITLE6"],
                $scope.cellColumns["MRKT_SEG"],
                $scope.cellColumns["GEO_COMBINED"],
                $scope.cellColumns["TITLE7"],
                $scope.cellColumns["TITLE8"],
                $scope.cellColumns["TITLE9"]
            ],
            "PROGRAM": [
                $scope.cellColumns["COST_TEST_RESULT"],
                $scope.cellColumns["DC_ID"],
                $scope.cellColumns["START_DT"],
                $scope.cellColumns["TITLE"],
                $scope.cellColumns["MAX_RPU"],
                $scope.cellColumns["TITLE1"],
                $scope.cellColumns["TITLE2"],
                $scope.cellColumns["TITLE3"],
                $scope.cellColumns["TITLE4"],
                $scope.cellColumns["TITLE5"],
                $scope.cellColumns["TITLE6"],
                $scope.cellColumns["MRKT_SEG"],
                $scope.cellColumns["GEO_COMBINED"],
                $scope.cellColumns["TITLE7"],
                $scope.cellColumns["TITLE8"],
                $scope.cellColumns["TITLE9"]
            ]
        }

    }



}
})();
