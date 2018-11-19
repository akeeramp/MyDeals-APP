(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerExcludeGroupsController', managerExcludeGroupsController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerExcludeGroupsController.$inject = [
        '$scope', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger',
        '$uibModal', '$timeout', '$compile', '$uibModalStack', 'isToolReq', 'rootDataItem', 'securityService'
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
        $compile,
        $uibModalStack, isToolReq, rootDataItem, securityService) {
        //$scope.$uibModalInstance = $injector.get('$uibModalInstance');

        // Variables
        if (isToolReq === undefined) isToolReq = true;
        var root = $scope.$parent; // Access to parent scope
        $scope.rootDataItem = rootDataItem;
        $scope.isToolReq = isToolReq;
        if ($scope.isToolReq) {
            root.curPricingTable.DC_ID = undefined;
        }

        root.wipData = [];
        $scope.root = root;
        $scope.loading = true;
        $scope.msg = "Loading Deals";
        $scope.pctFilterEnabled = root.CAN_VIEW_COST_TEST;
        $scope._dirty = false;
        $scope.getColorStyle = function (c) {
            return { color: $scope.getColorPct(c) };
        }
        $scope.getColorPct = function (d) {
            if (!d) d = "InComplete";
            return $scope.getColor('pct', d);
        }
        $scope.getColor = function (k, c) {
            if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                return colorDictionary[k][c];
            }
            return "#aaaaaa";
        }

        $scope.dismissPopup = function () {
            var openedModal = $uibModalStack.getTop();
            $uibModalStack.dismiss(openedModal.key);
        }

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
                        cellCurrValues: function () {
                            return angular.copy(dataItem["DEAL_GRP_EXCLDS"]);
                        },
                        cellCommentValue: function () {
                            return angular.copy(dataItem["DEAL_GRP_CMNT"]);
                        },
                        colInfo: function () {
                            return col;
                        },
                        enableCheckbox: function () {
                            return enabledList.indexOf(dataItem["PS_WF_STG_CD"]) < 0 && (window.usrRole !== "DA");
                        },
                        excludeOutliers: function () {
                            return false;
                        }
                    }
                });

                modal.result.then(
                    function (result) {
                        dataItem.DEAL_GRP_EXCLDS = result.DEAL_GRP_EXCLDS;
                        dataItem.DEAL_GRP_CMNT = result.DEAL_GRP_CMNT;
                        dataItem._dirty = true;
                        $scope._dirty = true;
                    },
                    function () {
                    });
            });

        root["CAN_VIEW_COST_TEST"] = root.CAN_VIEW_COST_TEST === undefined ?
            securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper)
            : root.CAN_VIEW_COST_TEST; // Can view the pass/fail

        var pctTemplate = root.CAN_VIEW_COST_TEST
            ? "#= gridPctUtils.getResultMapping(data.COST_TEST_RESULT, 'true', '', '', '', 'font-size: 20px !important;', '', true) #"
            : "&nbsp;";

        $scope.togglePctFilter = function () {
            $scope.pctFilterEnabled = !$scope.pctFilterEnabled;
            $scope.filterPct();
        }
        $scope.filterPct = function () {
            $timeout(function () {
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
            function (event, args) {
                if (!$scope.firstGridLoaded) {
                    if ($scope.pctFilterEnabled) {
                        $timeout(function () {
                            if ($scope.isToolReq) {
                                // if allowed... add tab to go back to PCT tab
                                $scope.filterPct();

                                var html = '<li class="btnGoToPCT" ng-click="gotoPct()" class="k-item k-state-default"><span unselectable="on" class="k-link" title="Click to go back to Price Cost Test">Price Cost Test</span></li>';
                                var template = angular.element(html);
                                var linkFunction = $compile(template);
                                linkFunction($scope);

                                $(".k-tabstrip-wrapper ul.k-tabstrip-items").append(template);
                            }

                        },
                            500);
                    }
                }
                $scope.firstGridLoaded = true;
            });

        $scope.gotoPct = function () {
            $state.go('contract.pct');
        }

        $scope.saveAndRunPct = function () {
            if (!$scope._dirty) return;
            $scope.$broadcast('requestOpGridDirtyRows');
        }
        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            $timeout(function () {
                var newState = msg != undefined && msg !== "";
                isShowFunFact = true; // Always show fun fact
                // if no change in state, simple update the text
                if ($scope.isBusy === newState) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                    return;
                }

                $scope.isBusy = newState;
                if ($scope.isBusy) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                } else {
                    $timeout(function () {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                        $scope.isBusyShowFunFact = isShowFunFact;
                    }, 100);
                }
            });
        }
        $scope.$on('receiveOpGridDirtyRows',
            function (event, data) {

                if (data.length === 0) {
                    kendo.alert("There were no items to save.");
                    return;
                }

                // Date object value will be pulled in by a day when it binds to api parameter. Due to timezone offset value present on it
                // Hence convert it to string before sending to API
                for (var i = 0; i < data.length; i++) {
                    data[i]['START_DT'] = kendo.toString(new Date(data[i]['START_DT']), 'M/d/yyyy hh:mm');
                    data[i]['END_DT'] = kendo.toString(new Date(data[i]['END_DT']), 'M/d/yyyy hh:mm');
                }
                if (typeof root.setBusy != 'undefined') {
                    root.setBusy("Saving Groupings", "Please wait while we exclude the deals from the groups");
                }

                objsetService.updateWipDeals($scope.contractData.CUST_MBR_SID, $scope.contractData.DC_ID, data).then(
                    function (results) {
                        $scope._dirty = false;
                        $scope.$broadcast('resetOpGridDirtyRows');
                        if (typeof root.setBusy != 'undefined') {
                            root.setBusy("Running Cost Test", "Currently running Price Cost Test");
                        }
                        if (!$scope.isToolReq && typeof $scope.isToolReq != 'undefined') {
                            var selectedItem = [];
                            selectedItem.push($scope.rootDataItem.PRC_ST_OBJ_SID);
                            objsetService.runBulkPctPricingStrategy(selectedItem).then(function (data) {
                                $scope.root.refreshContractData();
                                $timeout(function () {
                                    if (typeof root.setBusy != 'undefined') {
                                        $scope.root.setBusy("", "");
                                    }
                                    $scope.msg = "Refreshing all Deals";
                                    $scope.loading = true;
                                    $scope.getWipDeals();
                                }, 1000);
                            });
                        }
                        else {
                            objsetService.runPctContract($scope.root.contractData.DC_ID).then(
                                function (e) {
                                    $scope.root.refreshContractData();
                                    $timeout(function () {
                                        if (typeof root.setBusy != 'undefined') {
                                            $scope.root.setBusy("", "");
                                        }
                                        $scope.msg = "Refreshing all Deals";
                                        $scope.loading = true;
                                        $scope.getWipDeals();
                                    }, 1000);
                                },
                                function (response) {
                                    if (typeof root.setBusy != 'undefined') {
                                        $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                                    }
                                    logger.error("Could not run Cost Test in Exclude Groups for contract " + $scope.root.contractData.DC_ID, response, response.statusText);
                                    $timeout(function () {
                                        $scope.root.setBusy("", "");
                                    }, 2000);
                                }
                            );
                        }


                    },
                    function (response) {
                        logger.error("Could not save Deal Exludes.", response, response.statusText);
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
                field: "PTR_USER_PRD",
                title: "Contract product",
                template: "#=gridUtils.uiReadonlyControlWrapper(data, 'PTR_USER_PRD')#",
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
                excelTemplate: "#=gridUtils.uiReadonlyDimExcelControlWrapper(data, 'ECAP_PRICE', '20___0', 'currency')#",
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
            $timeout(function () {
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
                            PTR_USER_PRD: { type: "string" },
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
                            "DEAL_DESC": {
                                "Groups": ["Grouping Exclusions"]
                            },
                            "DEAL_GRP_EXCLDS": {
                                "Groups": ["Grouping Exclusions"]
                            },
                            "DEAL_GRP_CMNT": {
                                "Groups": ["Grouping Exclusions"]
                            },
                            "PTR_USER_PRD": {
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
        $scope.getWipDeals = function () {
            objsetService.readWipExclusionFromContract($scope.contractData.DC_ID).then(function (response) {
                if (response.data) {
                    //Cherry Picking the Deal for Tender Dashboard
                    if (!$scope.isToolReq) {
                        var tempItem = $filter('where')(response.data.WIP_DEAL, { 'DC_ID': $scope.rootDataItem.DC_ID });
                        response.data.WIP_DEAL = {};
                        response.data.WIP_DEAL = tempItem;
                    }

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
                    }, 2000);
                }
            });
        }

        $scope.getWipDeals();

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").removeClass("active");
            $("#overlapDiv").removeClass("active");
            $("#groupExclusionDiv").addClass("active");
            $("#dealProducts").removeClass("active");
            $scope.$apply();
        }, 50);
    }
})();
