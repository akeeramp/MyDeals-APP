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
                        model: {
                            id: "DC_ID",
                            fields: {
                                DC_ID: { type: "number" },
                                OBJ_SET_TYPE_CD: { type: "string" },
                                PASSED_VALIDATION: { type: "string" },
                                COST_TEST_RESULT: { type: "string" },
                                MEETCOMP_TEST_RESULT: { type: "string" },                                
                                WF_STG_CD: { type: "string" },
                                START_DT: { type: "date" },
                                END_DT: { type: "date" },
                                NOTES: { type: "string" },
                                TRKR_NBR: { type: "string" },
                                TITLE: { type: "string" }
                            }
                        }
                    }
                },
                sortable: true,
                height: 250,
                columns: [
                    {
                        field: "COST_TEST_RESULT",
                        title: "PCT Result",
                        width: "120px"
                    }, {
                        field: "MEETCOMP_TEST_RESULT",
                        title: "MCT Result",
                        width: "120px"
                    }, {
                        field: "DC_ID",
                        title: "Deal Id",
                        width: "100px",
                        template: "<div class='dealLnk'><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{dataItem.PASSED_VALIDATION || \"Not validated yet\"}}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Valid\" || dataItem.PASSED_VALIDATION === \"Finalizing\" || dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-protection-failed-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i><a href=''>#=DC_ID#</a></div>"
                    }, {
                        field: "OBJ_SET_TYPE_CD",
                        title: "Type",
                        width: "100px"
                    }, {
                        field: "START_DT",
                        title: "Deal Start/End",
                        width: "170px",
                        template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #"
                    }, {
                        field: "TITLE",
                        title: "Product"
                    }
                ]

            }
            var html = "<kendo-grid options='sumGridOptions' class='opUiContainer md dashboard'></kendo-grid>";
            var template = angular.element(html);
            var linkFunction = $compile(template);
            linkFunction($scope);

            $("#sumWipGrid_" + pt.DC_ID).html(template);

            pt.isLoading = false;
        }

    }


    //// loop through data and setup deal types for faster sorting
    //for (var s = 0; s < root.contractData.PRC_ST.length; s++) {
    //    var sItem = root.contractData.PRC_ST[s];
    //    sItem.dealType = [];
    //    if (sItem.PRC_TBL !== undefined) {
    //        for (var pt = 0; pt < sItem.PRC_TBL.length; pt++) {
    //            var ptItem = sItem.PRC_TBL[pt];
    //            sItem.dealType.push(ptItem.OBJ_SET_TYPE_CD);
    //        }
    //    }
    //}


}
})();
