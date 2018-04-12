(function() {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerExcludeGroupsController', managerExcludeGroupsController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerExcludeGroupsController.$inject = [
        '$scope', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger',
        '$uibModal', '$timeout', '$compile'
    ];

    function managerExcludeGroupsController($scope,
        $state,
        $stateParams,
        $filter,
        objsetService,
        confirmationModal,
        dataService,
        logger,
        $uibModal,
        $timeout,
        $compile) {


        // Variables
        var root = $scope.$parent; // Access to parent scope
        root.curPricingTable.DC_ID = undefined;
        root.wipData = [];
        $scope.root = root;
        $scope.loading = true;
        $scope.msg = "Loading Deals";
        $scope.pctFilterEnabled = root.CAN_VIEW_COST_TEST;
        $scope._dirty = false;

        $scope.$on('ManageExcludeGroups',
            function (event, dataItem) {

                var col = {
                    lookupUrl: "/api/Dropdown/GetDealGroupDropdown",
                    lookupText: "DROP_DOWN",
                    lookupValue: "DROP_DOWN"
                }

                if (dataItem["DEAL_GRP_EXCLDS"] === undefined || dataItem["DEAL_GRP_EXCLDS"] === null) dataItem["DEAL_GRP_EXCLDS"] = "";
                if (dataItem["DEAL_GRP_CMNT"] === undefined || dataItem["DEAL_GRP_CMNT"] === null) dataItem["DEAL_GRP_CMNT"] = "";

                var enabledList = ["Pending", "Approved"];

                var modal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/partials/ptModals/excludeDealGroupMultiSelectModal.html',
                    controller: 'ExcludeDealGroupMultiSelectCtrl',
                    controllerAs: 'vm',
                    windowClass: '',
                    size: 'lg',
                    resolve: {
                        dataItem: angular.copy(dataItem),
                        cellCurrValues: function() {
                            return angular.copy(dataItem["DEAL_GRP_EXCLDS"]);
                        },
                        cellCommentValue: function() {
                            return angular.copy(dataItem["DEAL_GRP_CMNT"]);
                        },
                        colInfo: function() {
                            return col;
                        },
                        enableCheckbox: function() {
                            return enabledList.indexOf(dataItem["PS_WF_STG_CD"]) < 0;
                        },
                        excludeOutliers: function () {
                            return false;
                        }
                    }
                });

                modal.result.then(
                    function(result) {
                        dataItem.DEAL_GRP_EXCLDS = result.DEAL_GRP_EXCLDS;
                        dataItem.DEAL_GRP_CMNT = result.DEAL_GRP_CMNT;
                        dataItem._dirty = true;
                        $scope._dirty = true;
                    },
                    function() {
                    });
            });

        var pctTemplate = root.CAN_VIEW_COST_TEST
            ? "#= gridPctUtils.getResultMapping(data.COST_TEST_RESULT, 'true', '', '', '', 'font-size: 20px !important;', '', true) #"
            : "&nbsp;";

        $scope.togglePctFilter = function() {
            $scope.pctFilterEnabled = !$scope.pctFilterEnabled;
            $scope.filterPct();
        }
        $scope.filterPct = function() {
            $timeout(function() {
                    var grid = $("#grdExcludeGroups .k-grid").data("kendoGrid");
                    if ($scope.pctFilterEnabled) {
                        grid.dataSource.filter({
                            logic: "or",
                            filters: [
                                {
                                    field: "COST_TEST_RESULT",
                                    operator: "eq",
                                    value: "Fail"
                                },
                                {
                                    field: "COST_TEST_RESULT",
                                    operator: "eq",
                                    value: "InComplete"
                                }
                            ]
                        });
                    } else {
                        grid.dataSource.filter({});
                    }
                },
                10);
        }

        $scope.firstGridLoaded = false;
        $scope.$on('OpGridDataBound',
            function(event, args) {
                if (!$scope.firstGridLoaded) {
                    if ($scope.pctFilterEnabled) {
                        $timeout(function() {

                                // if allowed... add tab to go back to PCT tab
                                $scope.filterPct();

                                var html = '<li ng-click="gotoPct()" class="k-item k-state-default"><span unselectable="on" class="k-link" title="Click to go back to Price Cost Test">Price Cost Test</span></li>';
                                var template = angular.element(html);
                                var linkFunction = $compile(template);
                                linkFunction($scope);

                                $(".k-tabstrip-wrapper ul.k-tabstrip-items").append(template);
                            },
                            500);
                    }
                }
                $scope.firstGridLoaded = true;
            });

        $scope.gotoPct = function() {
            $state.go('contract.pct');
        }

        $scope.saveAndRunPct = function() {
            if (!$scope._dirty) return;
            $scope.$broadcast('requestOpGridDirtyRows');
        }

        $scope.$on('receiveOpGridDirtyRows',
            function(event, data) {

                if (data.length === 0) {
                    kendo.alert("There were no items to save.");
                    return;
                }

                topbar.show();
                root.setBusy("Saving Groupings", "Please wait while we exclude the deals from the groups");
                objsetService.updateWipDeals($scope.contractData.CUST_MBR_SID, $scope.contractData.DC_ID, data).then(
                    function(results) {
                        topbar.hide();
                        $scope._dirty = false;
                        $scope.$broadcast('resetOpGridDirtyRows');

                        topbar.show();
                        root.setBusy("Running Cost Test", "Currently running Price Cost Test");
                        objsetService.runPctContract($scope.root.contractData.DC_ID).then(
                            function (e) {
                                topbar.hide();
                                $scope.root.refreshContractData();
                                $timeout(function () {
                                    $scope.root.setBusy("", "");
                                    $scope.msg = "Refreshing all Deals";
                                    $scope.loading = true;
                                    $scope.getWipDeals();
                                }, 1000);
                            },
                            function (response) {
                                $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                                logger.error("Could not run Cost Test.", response, response.statusText);
                                $timeout(function () {
                                    $scope.root.setBusy("", "");
                                }, 2000);
                            }
                        );

                    },
                    function(response) {
                        logger.error("Could not save Deal Exludes.", response, response.statusText);
                        topbar.hide();
                        root.setBusy("", "");
                    }
                );
            });



        $scope.columns = [
            {
                field: "DC_ID",
                title: "Deal #",
                template: "#=gridUtils.uiControlWrapperDirtyIndicator(data, '_dirty')# #=gridUtils.uiReadonlyControlWrapper(data, 'DC_ID')#",
                width: 120
            }, {
                field: "DEAL_DESC",
                title: "Deal Description",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'DEAL_DESC')#",
                width: 120
            }, {
                field: "DEAL_GRP_EXCLDS",
                title: "Exclude Deal Group",
                template: "#=gridUtils.uiControlWrapperGrpWithDefault(data, 'DEAL_GRP_EXCLDS')#",
                excelTemplate: "#=DEAL_GRP_EXCLDS#",
                width: 120
            }, {
                field: "DEAL_GRP_CMNT",
                title: "Exclusion Reason",
                template: "#=gridUtils.uiControlWrapper(data, 'DEAL_GRP_CMNT')#",
                width: 120
            }, {
                field: "TITLE",
                title: "My Deals Product",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'TITLE')#",
                width: 120
            }, {
                field: "COST_TEST_RESULT",
                title: "Cost Test Results",
                template: pctTemplate,
                excelTemplate: "#=COST_TEST_RESULT#",
                filterable: { multi: true },
                width: 120
            }, {
                field: "OBJ_SET_TYPE_CD",
                title: "Deal Type",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'OBJ_SET_TYPE_CD')#",
                filterable: { multi: true },
                width: 120
            }, {
                field: "DSPL_WF_STG_CD",
                title: "Stage",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'DSPL_WF_STG_CD')#",
                filterable: { multi: true },
                width: 120
            }, {
                field: "START_DT",
                title: "Deal Start",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'START_DT', \"date:'MM/dd/yyyy'\")#",
                width: 120
            }, {
                field: "END_DT",
                title: "Deal End",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'END_DT', \"date:'MM/dd/yyyy'\")#",
                width: 120
            }, {
                field: "DEAL_COMB_TYPE",
                title: "Additive",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'DEAL_COMB_TYPE')#",
                filterable: { multi: true },
                width: 120
            }, {
                field: "ECAP_PRICE",
                title: "ECAP Price",
                template: "#=gridUtils.uiReadonlyDimControlWrapper(data, 'ECAP_PRICE', '20___0', 'currency')#",
                width: 120
            }, {
                field: "MAX_RPU",
                title: "Max RPU",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'MAX_RPU', 'currency')#",
                width: 120
            }, {
                field: "CONSUMPTION_REASON",
                title: "Consumption Reason",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'CONSUMPTION_REASON')#",
                filterable: { multi: true },
                width: 120
            }, {
                field: "CONSUMPTION_REASON_CMNT",
                title: "Consumption Reason Comment",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'CONSUMPTION_REASON_CMNT')#",
                width: 160
            }
        ];

        $scope.displayCols = [];
        for (var c = 0; c < $scope.columns.length; c++) {
            if ($scope.columns[c].field !== "COST_TEST_RESULT" || root.CAN_VIEW_COST_TEST) {
                $scope.displayCols.push($scope.columns[c]);
            }
        }

        // Generates options that kendo's html directives will use
        // Generates options that kendo's html directives will use
        function initGrid(data) {
            $timeout(function() {
                    root.wipOptions = {
                        isLayoutConfigurable: false,
                        isVisibleAdditionalDiscounts: false,
                        isPinEnabled: false,
                        columns: $scope.displayCols,
                        model: {
                            id: "DC_ID",
                            fields: {
                                DSPL_WF_STG_CD: { type: "string" },
                                DEAL_GRP_EXCLDS: { type: "string" },
                                DEAL_GRP_CMNT: { type: "string" },
                                TITLE: { type: "string" },
                                COST_TEST_RESULT: { type: "string" },
                                MEETCOMP_TEST_RESULT: { type: "string" },
                                OBJ_SET_TYPE_CD: { type: "string" },
                                START_DT: { type: "date" },
                                END_DT: { type: "date" },
                                DEAL_COMB_TYPE: { type: "string" },
                                ECAP_PRICE: { type: "object" }, 
                                MAX_RPU: { type: "number" },
                                DEAL_DESC: { type: "string" },
                                CONSUMPTION_REASON: { type: "string" },
                                CONSUMPTION_REASON_CMNT: { type: "string" }
                            }
                        },
                        default: {
                            groups: [
                                { "name": "Grouping Exclusions", "order": 0 }
                            ],
                            groupColumns: {
                                "DC_ID": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "DEAL_GRP_EXCLDS": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "DEAL_GRP_CMNT": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "TITLE": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "COST_TEST_RESULT": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "MEETCOMP_TEST_RESULT": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "OBJ_SET_TYPE_CD": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "DSPL_WF_STG_CD": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "START_DT": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "END_DT": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "DEAL_COMB_TYPE": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "ECAP_PRICE": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "MAX_RPU": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "DEAL_DESC": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "CONSUMPTION_REASON": {
                                    "Groups": ["Grouping Exclusions"]
                                },
                                "CONSUMPTION_REASON_CMNT": {
                                    "Groups": ["Grouping Exclusions"]
                                }
                            }
                        }
                    };

                    root.wipData = data;
                },
                10);
        }

        // Get all WIP
        $scope.getWipDeals = function() {
            objsetService.readWipExclusionFromContract($scope.contractData.DC_ID).then(function (response) {
                if (response.data) {

                    for (var d = 0; d < response.data.WIP_DEAL.length; d++) {
                        var item = response.data.WIP_DEAL[d];
                        if (item["DEAL_GRP_EXCLDS"] === undefined || item["DEAL_GRP_EXCLDS"] === null) item["DEAL_GRP_EXCLDS"] = "";
                        if (item["DEAL_GRP_CMNT"] === undefined || item["DEAL_GRP_CMNT"] === null) item["DEAL_GRP_CMNT"] = "";
                        item["DSPL_WF_STG_CD"] = gridUtils.stgFullTitleChar(item);
                        item["TITLE"] = item["TITLE"].replace(/,/g, ", ");
                    }

                    initGrid(response.data.WIP_DEAL);
                    $scope.msg = "Gathering Deals";
                    $timeout(function () {
                        $scope.msg = "Done";
                        $scope.loading = false;
                    },2000);
                }
            });
        }

        $scope.getWipDeals();

        $timeout(function() {
                $("#approvalDiv").removeClass("active");
                $("#pctDiv").removeClass("active");
                $("#contractReviewDiv").removeClass("active");
                $("#dealReviewDiv").removeClass("active");
                $("#historyDiv").removeClass("active");
                $("#overlapDiv").removeClass("active");
                $("#groupExclusionDiv").addClass("active");
                $scope.$apply();
            },
            50);


    }
})();
