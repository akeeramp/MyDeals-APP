(function () {
    'use strict';

angular
    .module('app.contract')
    .controller('managerController', managerController);

managerController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary'];

function managerController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary) {

    var root = $scope.$parent;	// Access to parent scope
    $scope.stageFilter = [];
    $scope.dealTypeFilter = "";
    $scope.canEdit = true;
    $scope.canFilterDealTypes = false;
    $scope.$parent.isSummaryHidden = false;

    $timeout(function () {
        $("#timelineDiv").removeClass("active");
        $("#overlappingDiv").removeClass("active");
        $("#pctDiv").removeClass("active");
        $("#approvalDiv").addClass("active");
        $scope.$apply();
    }, 50);

    // loop through data and setup deal types for faster sorting
    for (var s = 0; s < root.contractData.PRC_ST.length; s++) {
        var sItem = root.contractData.PRC_ST[s];
        sItem.dealType = [];
        if (sItem.PRC_TBL !== undefined) {
            for (var pt = 0; pt < sItem.PRC_TBL.length; pt++) {
                var ptItem = sItem.PRC_TBL[pt];
                sItem.dealType.push(ptItem.OBJ_SET_TYPE_CD);
            }
        }
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

    $scope.selTab = function (tabName) {
        $scope.dealTypeFilter = tabName === "All" ? "" : tabName;
    }

    $scope.clkRow = function (e) {
        if (e.target.checked)
            for (var i = 0; i < document.getElementsByName(e.target.name).length; i++) {
                if (document.getElementsByName(e.target.name)[i].id !== e.target.id)
                    document.getElementsByName(e.target.name)[i].checked = false;
            }

        // clear global check
        document.getElementById('all_rad_approve').checked = false;
        document.getElementById('all_rad_revise').checked = false;
        document.getElementById('all_rad_cancel').checked = false;
    }

    $scope.clkAllRow = function (e, className) {
        var i;

        if (e.target.checked)
            for (i = 0; i < document.getElementsByName(e.target.name).length; i++) {
                if (document.getElementsByName(e.target.name)[i].id !== e.target.id)
                    document.getElementsByName(e.target.name)[i].checked = false;
            }

        // clear all
        var items = document.getElementsByClassName('psCheck');
        for (i = 0; i < items.length; i++) {
            items[i].checked = false;
        }


        items = document.getElementsByClassName(className);
        for (i = 0; i < items.length; i++) {
            if (!$(items[i]).hasClass('disabled')) {
                items[i].checked = e.target.checked;
            }
        }


    }
    

    $scope.summaryFilter = function (ps) {
        return (
            ($scope.dealTypeFilter === undefined || $scope.dealTypeFilter === '' || ps.dealType === undefined || ps.dealType.indexOf($scope.dealTypeFilter) >= 0) &&
            ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0 || $scope.titleInPt(ps)) && 
            $scope.stageInPs(ps)
            );
    }

    $scope.titleInPt = function (ps) {
        if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
        for (var i = 0; i < ps.PRC_TBL.length; i++) {
            if (ps.PRC_TBL[i].TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0) return ps;
        }
        return null;
    }

    $scope.stageInPs = function (ps) {
        var stg = [];
        for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
            if (root.contractData.PRC_ST[c].filtered)
                stg.push(root.contractData.PRC_ST[c].WF_STG_CD);
        }
        if (stg.length === 0 || stg.indexOf(ps.WF_STG_CD) >= 0) return ps;
        return null;
    }

    $scope.gotoContractEditor = function (ps, pt) {
        if (!pt) {
            $state.go('contract.manager',
            {
                cid: ps.DC_PARENT_ID
            });
        } else {
            $state.go('contract.manager.strategy',
                {
                    cid: ps.DC_PARENT_ID,
                    sid: ps.DC_ID,
                    pid: pt.DC_ID
                });
        }
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

    $scope.clearFilter = function() {
        for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
            root.contractData.PRC_ST[c].filtered = false;
        }
        $timeout(function () {
            $scope.$apply();
        }, 500);
    }

    $scope.hasFilter = function () {
        for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
            if (root.contractData.PRC_ST[c].filtered) return true;
        }
        return false;
    }

    $scope.togglePt = function (pt) {

        if (pt.isLoading === undefined || pt.isLoading === true) {

            $scope.sumGridOptions = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: {
                            url: "/api/Dashboard/GetWipSummary/" + pt.DC_ID,
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
                        field: "NOTES",
                        title: "Tools",
                        width: "90px",
                        template: "<deal-tools ng-model='dataItem'></deal-tools>"
                    }, {
                        field: "DC_ID",
                        title: "Deal Id",
                        width: "90px",
                        template: "<div class='dealLnk'><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ dataItem.PASSED_VALIDATION || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\" || dataItem.PASSED_VALIDATION === \"Valid\" || dataItem.PASSED_VALIDATION === \"Finalizing\"), \"intelicon-protection-failed-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i><a href=''>#=DC_ID#</a></div>"
                    }, {
                        field: "TRKR_NBR",
                        title: "Tracker Number",
                        width: "120px"
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

    function getItem(items) {
        var allPs = root.contractData.PRC_ST;
        var id = parseInt(items.getAttribute("dcId"));

        var result = $.grep(allPs, function (e) { return e.DC_ID === id; });
        var stage = result.length > 0 ? result[0].WF_STG_CD : "";

        return { "DC_ID": id, "WF_STG_CD": stage };
    }

    function getActionItems(data, actn) {
        var ids = [];
        var items = $(".psCheck-" + actn);
        for (var i = 0; i < items.length; i++) {
            if (items[i].checked) {
                ids.push(getItem(items[i]));
            }
        }

        if (ids.length > 0) data[actn] = ids;
    }

    $scope.actionItems = function () {
        var data = {};

        getActionItems(data, "Approve");
        getActionItems(data, "Revise");
        getActionItems(data, "Cancel");
        getActionItems(data, "Hold");

        if (Object.keys(data).length === 0) {
            kendo.alert("No Pricing Strategies were selected.");
            return;
        }

        root.actionPricingStrategies(data);
    }


    $scope.ptDs = new kendo.data.DataSource({});

    $scope.ptOptions = {
        dataSource: $scope.ptDs,
        resizable: true,
        sortable: true,
        pageable: true,
        columns: [
            {
                field: "DC_ID",
                title: "Deal Id",
                width: "100px"
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Type",
                width: "100px"
            }, {
                field: "WF_STG_CD",
                title: "Stage",
                width: "100px"
            }, {
                field: "STRT_DTM",
                title: "Start Date",
                format: "{0: MM/dd/yyyy}",
                width: "90px"
            }, {
                field: "END_DTM",
                title: "End Date",
                format: "{0: MM/dd/yyyy}",
                width: "90px"
            }, {
                field: "PASSED_VALIDATION",
                title: "Valid",
                width: "60px"
            }
        ]
    };



    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });


    $scope.clearFilter();
}
})();
