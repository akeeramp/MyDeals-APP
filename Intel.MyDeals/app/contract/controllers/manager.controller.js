(function () {
    'use strict';

    angular
        .module('app.contract')
            .controller('managerController', managerController)
            .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];


    managerController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal', '$location'];

    function managerController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal, $location) {

        var root = $scope.$parent;	// Access to parent scope
        $scope.root = root;
        $scope.stageFilter = [];
        $scope.dealTypeFilter = "";
        $scope.canEdit = true;
        $scope.canFilterDealTypes = false;
        $scope.$parent.isSummaryHidden = false;
        $scope.hideIfNotPending = root.contractData.CUST_ACCPT !== "Pending";
        $scope.isPending = root.contractData.CUST_ACCPT === "Pending";
        $scope.pendingWarningActions = [];
        $scope.showPendingInfo = true;
        $scope.showPendingFile = false;
        $scope.showPendingC2A = false;
        $scope.needToRunPct = false;
        $scope.canBypassEmptyActions = false;
        $scope.ranManuallySincePageLoaded = false;
        root.enablePCT = false;
        $scope.needToRunOverlaps = [];
        $scope.canActionIcon = true;
        $scope.hasVertical = false;
        $scope.canEmailIcon = true;
        $scope.userRole = window.usrRole;

        $scope.$parent.spreadDs = undefined; // clear spreadDs so that we don't have an existing spreadDs when navigating to a spreadsheet

        $scope.showPending = function (page) {
            $scope.showPendingInfo = false;
            $scope.showPendingFile = false;
            $scope.showPendingC2A = false;
            if (page === "showPendingInfo") {
                $scope.showPendingInfo = true;
            } else if (page === "showPendingFile") {
                $scope.showPendingFile = true;
            } else if (page === "showPendingC2A") {
                $scope.showPendingC2A = true;
            }

        }

        $scope.getmissingCapCostTitle = function (item) {
            var ret = "";
            if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1") {
                ret += "Your strategy/deal is missing CAP and Division Approver will not be able to approve till this is fixed.\n" +
                       "Missing CAP issues are handled currently with PriceOps via a weekly DQ process. \nIf there is urgency in \n" +
                       "getting this deal approved please raise a TAC ticket in service now";
            }
            if (item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
                ret !== "" ? ret += " \n" : ret;
                ret += "Your strategy/deal is missing Cost and Division Approver will not be able to approve till this is fixed.\n" +
                        "Missing Cost issues are handled currently with iCost team via a weekly DQ process.\nIf there is urgency in \n" +
                        "getting this deal approved please raise a TAC ticket in service now";
            }
            return ret;
        }

        $timeout(function () {
            $("#approvalDiv").addClass("active");
            $("#pctDiv").removeClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").removeClass("active");
            $("#overlapDiv").removeClass("active");
            $("#groupExclusionDiv").removeClass("active");
            $("#dealProducts").removeClass("active");
            $scope.$apply();
        }, 50);

        // loop through data and setup deal types for faster sorting
        var hasPendingStage = false;

        if (root.contractData.PRC_ST === null || root.contractData.PRC_ST === undefined) {
            // TODO: put error here maybe?
            return;
        }

        if (root.contractData.PRC_ST !== undefined) {
            for (var s = 0; s < root.contractData.PRC_ST.length; s++) {
                var sItem = root.contractData.PRC_ST[s];
                sItem.dealType = [];
                if (sItem.PRC_TBL !== undefined) {
                    for (var pt = 0; pt < sItem.PRC_TBL.length; pt++) {
                        var ptItem = sItem.PRC_TBL[pt];
                        sItem.dealType.push(ptItem.OBJ_SET_TYPE_CD);
                    }

                    //$scope.hideIfNotPending
                }
                if (sItem.WF_STG_CD === "Pending") {
                    hasPendingStage = true;
                }
            }
        }
        if (!hasPendingStage) $scope.hideIfNotPending = true;

        $scope.canAction = function (actn, dataItem, isExists) {
            return dataItem._actions[actn] !== undefined && (isExists || dataItem._actions[actn] === true);
        }

        $scope.hasVertical = function (dataItem) {
            var psHasUserVerticals = true;
            //if (dataItem.dc_type === "PRC_ST")
            //{
            if (window.usrRole === "DA") {
                if (window.usrVerticals.length > 0) {
                    var userVerticals = window.usrVerticals.split(",");
                    var dataVerticals = dataItem.VERTICAL_ROLLUP.split(",");

                    psHasUserVerticals = findOne(dataVerticals, userVerticals);
                }
                return psHasUserVerticals;
                // else, DA is All Verticals and gets a free pass
            }
            //}
            return psHasUserVerticals;
        }

        /**
         * @description determine if an array contains one or more items from another array.  Vanilla safe JS.
         * @param {array} haystack the array to search.
         * @param {array} arr the array providing items to check for in the haystack.
         * @return {boolean} true|false if haystack contains at least one item from arr.
         */
        var findOne = function (haystack, arr) {
            return arr.some(function (v) {
                return haystack.indexOf(v) >= 0;
            });
        };

        $scope.actionReason = function (actn, dataItem) {
            var rtn = "";
            if (!!dataItem._actionReasons && !!dataItem._actionReasons[actn]) {
                rtn = dataItem._actionReasons[actn];
            }
            return rtn;
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
            if (!d) d = "InComplete";
            return $scope.getColor('pct', d);
        }
        $scope.getColorMct = function (d) {
            if (!d) d = "InComplete";
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


            if (e.target.id.indexOf("email") > 0) {
                var anyEmailChecked = false;
                var items = document.getElementsByClassName('psCheck-Email');
                for (var i = 0; i < items.length; i++)
                    if (items[i].checked) anyEmailChecked = true;

                items = document.getElementsByClassName('psCheck-Approve');
                for (var i = 0; i < items.length; i++) items[i].checked = false;

                items = document.getElementsByClassName('psCheck-Revise');
                for (var i = 0; i < items.length; i++) items[i].checked = false;

                if (e.target.checked || anyEmailChecked) {
                    $scope.canActionIcon = false;
                    $scope.canEmailIcon = true;
                } else {
                    $scope.canActionIcon = true;
                    $scope.canEmailIcon = true;
                }

            } else {
                var anyActionChecked = false;
                var items = document.getElementsByClassName('psCheck-Approve');
                for (var i = 0; i < items.length; i++)
                    if (items[i].checked) anyActionChecked = true;

                var items = document.getElementsByClassName('psCheck-Revise');
                for (var i = 0; i < items.length; i++)
                    if (items[i].checked) anyActionChecked = true;

                items = document.getElementsByClassName('psCheck-Email');
                for (var i = 0; i < items.length; i++) items[i].checked = false;

                if (e.target.checked || anyActionChecked) {
                    $scope.canActionIcon = true;
                    $scope.canEmailIcon = false;
                } else {
                    $scope.canActionIcon = true;
                    $scope.canEmailIcon = true;
                }
            }

            // clear global check
            document.getElementById('all_rad_approve').checked = false;
            document.getElementById('all_rad_revise').checked = false;
            document.getElementById('all_rad_email').checked = false;
            //document.getElementById('all_rad_cancel').checked = false; // Appears to have been removed somewhere
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

            var availChkbox = 0;
            items = document.getElementsByClassName(className);
            for (i = 0; i < items.length; i++) {
                if (!$(items[i]).hasClass('disabled') && $(items[i]).is(':visible')) {
                    items[i].checked = e.target.checked;
                    availChkbox++;
                }
            }
            if (availChkbox === 0) {
                e.target.checked = false;
            }

        }

        $scope.$on('ExecutionPctMctComplete', function (event, executedFromBtn) {
            if (!!executedFromBtn && executedFromBtn === true) $scope.ranManuallySincePageLoaded = true;

            objsetService.readContract($scope.root.contractData.DC_ID).then(function (data) {
                var atrbs = ["WF_STG_CD", "PASSED_VALIDATION", "COST_TEST_RESULT", "MEETCOMP_TEST_RESULT"];
                var newContractData = $scope.root.initContract(data);

                var tmpNewPs = util.stripContractTree(newContractData, atrbs);
                var tmpPs = util.stripContractTree($scope.root.contractData, atrbs);
                var hasKeyDataChanged = angular.toJson(tmpNewPs) !== angular.toJson(tmpPs);

                var anyChecked = false;
                var items = document.getElementsByClassName('psCheck');
                for (var c = 0; c < items.length; c++) {
                    if (items[c].checked) anyChecked = true;
                }

                var anyExpanded = $(".chevron.intelicon-down").length > 0;

                // only update the screen if atrbs changed AND user did not "touch" the screen layout
                if (executedFromBtn || hasKeyDataChanged) {

                    if (executedFromBtn || (!anyChecked && !anyExpanded)) {
                        $scope.root.contractData = newContractData;
                        $scope.root.contractData.CUST_ACCNT_DIV_UI = "";

                        $timeout(function () {
                            $scope.root.$apply();
                        });
                    } else {
                        op.notifyInfo("Refresh the screen to see latest Cost Test Results", "Cost Test Complete");
                    }

                }
            });
        });
        var fromToggle = false;
        $scope.pendingChange = function (e) {
            fromToggle = true;
            $scope.togglePending(true);
        }
        $scope.togglePending = function (runActions) {
            if (!$scope.isPending) {
                $scope.isPending = true;
                root.contractData.CUST_ACCPT = "Pending";
                if (runActions) $scope.actionItems(true, false);
            } else {
                $scope.isPending = false;
                root.contractData.CUST_ACCPT = "Accepted";
                if (runActions) $scope.actionItems(true, true);
            }
        }

        $scope.deleteContract = function () {
            $scope.root.deleteContract();
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        $scope.summaryFilter = function (ps) {
            return (
                ($scope.dealTypeFilter === undefined || $scope.dealTypeFilter === '' || ps.dealType === undefined || ps.dealType.indexOf($scope.dealTypeFilter) >= 0) &&
                ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp(escapeRegExp($scope.titleFilter), "i")) >= 0 || $scope.titleInPt(ps)) &&
                $scope.stageInPs(ps)
                );
        }

        $scope.titleInPt = function (ps) {
            if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
            for (var i = 0; i < ps.PRC_TBL.length; i++) {
                if (ps.PRC_TBL[i].TITLE.search(new RegExp(escapeRegExp($scope.titleFilter), "i")) >= 0) return ps;
            }
            return null;
        }

        $scope.stageInPs = function (ps) {
            var stg = [];
            if (root.contractData.PRC_ST !== undefined) {
                for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
                    if (root.contractData.PRC_ST[c].filtered)
                        stg.push(root.contractData.PRC_ST[c].WF_STG_CD);
                }
                if (stg.length === 0 || stg.indexOf(ps.WF_STG_CD) >= 0) return ps;
            }
            return null;
        }

        $scope.gotoContractEditor = function (ps, pt) {
            root.gotoContractEditor(ps, pt);
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

        $scope.clearFilter = function () {
            if (root.contractData.PRC_ST !== undefined) {
                for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
                    root.contractData.PRC_ST[c].filtered = false;
                }
                $timeout(function () {
                    $scope.$apply();
                }, 500);
            }
        }

        $scope.hasFilter = function () {
            if (root.contractData.PRC_ST !== undefined) {
                for (var c = 0; c < root.contractData.PRC_ST.length; c++) {
                    if (root.contractData.PRC_ST[c].filtered) return true;
                }
            }
            return false;
        }

        $scope.$on('data-item-changed', function (event, fieldName, dataItem, el) {
            var ids = [];
            if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                var data = el.closest(".k-grid").data("kendoGrid").dataSource.data();
                ids = $scope.syncLinked(fieldName, dataItem[fieldName], data);
            } else {
                ids.push(dataItem["DC_ID"]);
            }
            $scope.updateAtrbValue("WIP_DEAL", ids, fieldName, dataItem[fieldName]);
        });

        $scope.$on('refreshContractDataComplete', function (event) {
            $scope.calcNeedToRunStatus();
        });

        $scope.$on('actionPricingStrategyComplete', function (event) {
            $scope.canEmailIcon = true;
        });


        $scope.calcNeedToRunStatus = function () {
            root.enablePCT = false;
            if (root.contractData.PRC_ST === undefined || root.contractData.PRC_ST === null) return;

            for (var d = 0; d < root.contractData.PRC_ST.length; d++) {
                var stg = root.contractData.PRC_ST[d].WF_STG_CD;
                if (stg !== "Pending" && stg !== "Approved") {
                    root.enablePCT = true;
                }
            }
        }

        //refreshContractDataComplete
        $scope.syncLinked = function (newField, newValue, data) {
            var ids = [];
            for (var v = 0; v < data.length; v++) {
                var dataItem = data[v];
                if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                    if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                    if (dataItem._behaviors.isReadOnly === undefined) dataItem._behaviors.isReadOnly = {};
                    if (dataItem._behaviors.isReadOnly[newField] === undefined || dataItem._behaviors.isReadOnly[newField] === false) {
                        if (dataItem._behaviors.isHidden === undefined) dataItem._behaviors.isHidden = {};
                        if (dataItem._behaviors.isHidden[newField] === undefined || dataItem._behaviors.isHidden[newField] === false) {
                            dataItem.set(newField, newValue);
                            ids.push(dataItem.DC_ID);
                        }
                    }
                }
            }
            return ids;
        }

        $scope.clkAllItem = function (ev, id) {
            var isChecked = document.getElementById("ptId_" + id + "chkDealTools").checked;
            var grid = $('#detailGrid_' + id).data("kendoGrid");
            var data = grid.dataSource.view();
            for (var i = 0; i < data.length; i++) {
                data[i].isLinked = isChecked;
            }
        }

        $scope.togglePt = function (ps, pt) {

            $("#sumWipGrid_" + pt.DC_ID).html("<div style='margin: 10px;'><ul class='fa-ul'><li><i class='fa-li fa fa-spinner fa-spin'></i>Loading...</li></ul></div>");

            var ds;

            if (pt.OBJ_SET_TYPE_CD === "ECAP" || pt.OBJ_SET_TYPE_CD === "KIT") { // ECAP or KIT pt grid
                ds = new kendo.data.DataSource({
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
                                START_DT: { type: "date" },
                                END_DT: { type: "date" },
                                COST_TEST_RESULT: { type: "string" },
                                MEETCOMP_TEST_RESULT: { type: "string" },
                                NOTES: { type: "string" },
                                TRKR_NBR: { type: "object" },
                                TITLE: { type: "string" },
                                REBATE_TYPE: { type: "string" },
                                VOLUME: { type: "string" },
                                END_CUSTOMER_RETAIL: { type: "string" },
                                DEAL_DESC: { type: "string" },
                                WF_STG_CD: { type: "string" },
                                EXPIRE_FLG: { type: "string" }
                            }
                        }
                    },
                    requestEnd: function (e) {
                        for (var i = 0; i < e.response.length; i++) {
                            if (e.response[i].WF_STG_CD === "Draft") e.response[i].WF_STG_CD = e.response[i].PS_WF_STG_CD;
                        }

                        drawGrid(pt);
                    },
                    sort: { field: "sortOrder", dir: "desc" }
                });

                $scope.sumGridOptions = function (gridId) {
                    return {
                        filterable: true,
                        resizable: true,
                        autoBind: false,
                        dataSource: ds,
                        sortable: true,
                        height: 250,
                        columns: [
                            {
                                field: "NOTES",
                                title: "Tools",
                                width: "200px",
                                locked: true,
                                template: "<deal-tools ng-model='dataItem' is-split-enabled='false' is-editable='true' is-quote-letter-enabled='true' is-delete-enabled='false'></deal-tools>",
                                headerTemplate: "<input type='checkbox' ng-click='clkAllItem($event, " + gridId + ")' class='with-font'  id='ptId_" + gridId + "chkDealTools' /><label for='ptId_" + gridId + "chkDealTools'>Tools</label>",
                                filterable: false,
                                sortable: false
                            }, {
                                field: "DC_ID",
                                title: "Deal Id",
                                width: "120px",
                                locked: true,
                                template: "<div class='dealLnk'><deal-popup-icon deal-id=\"'#=DC_ID#'\"></deal-popup-icon><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ dataItem.PASSED_VALIDATION || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-alert-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "TRKR_NBR",
                                title: "Tracker Number",
                                width: "150px",
                                locked: true,
                                template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "OBJ_SET_TYPE_CD",
                                title: "Type",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "START_DT",
                                title: "Deal Start/End",
                                width: "170px",
                                template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "TITLE",
                                title: "Product",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "CAP",
                                title: "CAP",
                                template: "#= gridUtils.getFormatedDim(data, 'CAP', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                filterable: false
                            }, {
                                field: "ECAP_PRICE",
                                title: "ECAP",
                                template: "#= gridUtils.getFormatedDim(data, 'ECAP_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                filterable: false
                            }, {
                                field: "YCS2_PRC_IRBT",
                                title: "YCS2",
                                template: "#= gridUtils.getFormatedDim(data, 'YCS2_PRC_IRBT', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                filterable: false
                            }, {
                                field: "REBATE_TYPE",
                                title: "Rebate Type",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "COST_TEST_RESULT",
                                title: "Cost Test Result",
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: { multi: true, search: true }
                            }, {
                                field: "COMP_SKU",
                                title: "Comp SKU",
                                template: "#= gridUtils.getFormatedDim(data, 'COMP_SKU', '20___0', 'string') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: false
                            }, {
                                field: "COMPETITIVE_PRICE",
                                title: "Comp Price",
                                template: "#= gridUtils.getFormatedDim(data, 'COMPETITIVE_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: false
                            }, {
                                field: "MEETCOMP_TEST_RESULT",
                                title: "Meet Comp Test Result",
                                width: "100px",
                                hidden: !root.CAN_VIEW_MEET_COMP,
                                filterable: { multi: true, search: true }
                            }, {
                                field: "VOLUME",
                                title: "Ceiling Volume",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "END_CUSTOMER_RETAIL",
                                title: "End Customer",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "DEAL_DESC",
                                title: "Deal Description",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "WF_STG_CD",
                                title: "Stage",
                                width: "100px",
                                filterable: { multi: true, search: true },
                                template: "#= gridUtils.stgFullTitleChar(data) #"
                            }, {
                                field: "EXPIRE_FLG",
                                title: "Expired",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "HAS_ATTACHED_FILES",
                                title: "Attachments",
                                width: "80px",
                                template: "#= gridUtils.hasAttachments(data, 'HAS_ATTACHED_FILES') #"
                            }
                        ]
                    }
                }
            }
            else { // Non-ECAP pt grids
                ds = new kendo.data.DataSource({
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
                                COST_TEST_RESULT: { type: "string" },
                                MEETCOMP_TEST_RESULT: { type: "string" },
                                NOTES: { type: "string" },
                                TRKR_NBR: { type: "object" },
                                TITLE: { type: "string" },
                                DEAL_DESC: { type: "string" },
                                MAX_RPU: { type: "string" }
                            }
                        }
                    },
                    requestEnd: function (e) {
                        for (var i = 0; i < e.response.length; i++) {
                            if (e.response[i].WF_STG_CD === "Draft") e.response[i].WF_STG_CD = e.response[i].PS_WF_STG_CD;
                        }

                        drawGrid(pt);
                    }
                });
                $scope.sumGridOptions = function (gridId) {
                    return {
                        filterable: true,
                        resizable: true,
                        autoBind: false,
                        dataSource: ds,
                        sortable: true,
                        height: 250,
                        columns: [
                            {
                                field: "NOTES",
                                title: "Tools",
                                width: "200px",
                                locked: true,
                                template: "<deal-tools ng-model='dataItem' is-split-enabled='false' is-editable='true' is-quote-letter-enabled='true' is-delete-enabled='false'></deal-tools>",
                                headerTemplate: "<input type='checkbox' ng-click='clkAllItem($event, " + gridId + ")' class='with-font'  id='ptId_" + gridId + "chkDealTools' /><label for='ptId_" + gridId + "chkDealTools'>Tools</label>",
                                filterable: false,
                                sortable: false
                            }, {
                                field: "DC_ID",
                                title: "Deal Id",
                                width: "120px",
                                locked: true,
                                template: "<div class='dealLnk'><deal-popup-icon deal-id=\"'#=DC_ID#'\"></deal-popup-icon><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ dataItem.PASSED_VALIDATION || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\"), \"intelicon-alert-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "TRKR_NBR",
                                title: "Tracker Number",
                                width: "150px",
                                locked: true,
                                template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "OBJ_SET_TYPE_CD",
                                title: "Type",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "START_DT",
                                title: "Deal Start/End",
                                width: "170px",
                                template: "#= kendo.toString(new Date(START_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(END_DT), 'M/d/yyyy') #",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "TITLE",
                                title: "Product",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "REBATE_TYPE",
                                title: "Rebate Type",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "COST_TEST_RESULT",
                                title: "Cost Test Result",
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: { multi: true, search: true }
                            }, {
                                field: "COMP_SKU",
                                title: "Comp SKU",
                                template: "#= gridUtils.getFormatedDim(data, 'COMP_SKU', '20___0', 'string') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: false
                            }, {
                                field: "COMPETITIVE_PRICE",
                                title: "Comp Price",
                                template: "#= gridUtils.getFormatedDim(data, 'COMPETITIVE_PRICE', '20___0', 'currency') #", // NOTE: this works because it's an ECAP (only 1 dimension/tier ever)
                                width: "100px",
                                hidden: !root.CAN_VIEW_COST_TEST,
                                filterable: false
                            }, {
                                field: "MEETCOMP_TEST_RESULT",
                                title: "Meet Comp Test Result",
                                width: "100px",
                                hidden: !root.CAN_VIEW_MEET_COMP,
                                filterable: { multi: true, search: true }
                            }, {
                                field: "MAX_RPU",
                                title: "Max RPU",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "DEAL_DESC",
                                title: "Deal Description",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "WF_STG_CD",
                                title: "Stage",
                                width: "100px",
                                filterable: { multi: true, search: true },
                                template: "#= gridUtils.stgFullTitleChar(data) #"
                            }, {
                                field: "EXPIRE_FLG",
                                title: "Expired",
                                width: "100px",
                                filterable: { multi: true, search: true }
                            }, {
                                field: "HAS_ATTACHED_FILES",
                                title: "Attachments",
                                width: "80px",
                                template: "#= gridUtils.hasAttachments(data, 'HAS_ATTACHED_FILES') #"
                            }
                        ]
                    }
                }
            }

            ds.read();
        }

        function drawGrid(pt) {
            if ($("#detailGrid_" + pt.DC_ID).length === 0) {
                var html = "<kendo-grid options='sumGridOptions(" + pt.DC_ID + ")' id='detailGrid_" + pt.DC_ID + "' class='opUiContainer md dashboard sumGridOptionsExpand'></kendo-grid>";
                var template = angular.element(html);
                var linkFunction = $compile(template);
                linkFunction($scope);

                $("#sumWipGrid_" + pt.DC_ID).html(template);
            }

        }

        function getItem(items, actn) {
            var allPs = root.contractData.PRC_ST;
            var id = parseInt(items.getAttribute("dcId"));

            var result = $.grep(allPs, function (e) { return e.DC_ID === id; });
            var stage = result.length > 0 ? result[0].WF_STG_CD : "";
            var title = result.length > 0 ? result[0].TITLE : "";
            var hasL1 = result.length > 0 ? result[0].HAS_L1 !== "0" : false;

            return { "DC_ID": id, "WF_STG_CD": stage, "TITLE": title, "ACTN": actn, "HAS_L1": hasL1 };
        }

        function getActionItems(data, dataItem, actn, actnText) {
            var ids = [];
            var items = $(".psCheck-" + actn);

            for (var i = 0; i < items.length; i++) {
                if (items[i].checked) {
                    var item = getItem(items[i], actnText);
                    ids.push(item);
                    dataItem.push(item);
                    if (item.WF_STG_CD === "Requested" && actn === "Approve" && window.usrRole === "GA") {
                        $scope.needToRunOverlaps.push(item.DC_ID);
                    }
                }
            }

            if (ids.length > 0) data[actn] = ids;
        }

        $scope.actionItems = function (fromToggle, checkForRequirements) {

            if (fromToggle === undefined && checkForRequirements === undefined) {
                var ids = [];
                var anyEmailChecked = false;
                var items = document.getElementsByClassName('psCheck-Email');
                for (var i = 0; i < items.length; i++)
                    if (items[i].checked) {
                        ids.push(parseInt(items[i].attributes["dcid"].value));
                        anyEmailChecked = true;
                    }

                if (anyEmailChecked) {
                    $scope.openEmailMsg(ids);
                    return;
                }
            }

            if (fromToggle === undefined || fromToggle === null) fromToggle = false;
            if (checkForRequirements === undefined || checkForRequirements === null) checkForRequirements = false;

            var ps = root.contractData.PRC_ST;


            // look for checked ending
            if (ps !== undefined) {
                for (var p = 0; p < ps.length; p++) {
                    if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0].checked) {
                        $scope.isPending = true;
                        root.contractData.CUST_ACCPT = "Accepted";
                        checkForRequirements = true;
                    }
                }
            }

            if ($scope.isPending === false && root.contractData.CUST_ACCPT !== "Pending" && (root.contractData.C2A_DATA_C2A_ID === "" && root.contractData.HAS_ATTACHED_FILES === "0")) {
                $scope.dialogPendingWarning.open();
            } else if ($scope.isPending === false && root.contractData.CUST_ACCPT !== "Pending") {
                $scope.continueAction(fromToggle, false);
            } else if ($scope.isPending === true && root.contractData.CUST_ACCPT !== "Accepted") {
                $scope.continueAction(fromToggle, checkForRequirements);
            } else {
                $scope.actionItemsBase();
            };
        }



        $scope.onSuccess = function (e) {
            root.contractData.HAS_ATTACHED_FILES = "1";
        }
        $scope.fileUploadOptions = { saveUrl: '/FileAttachments/Save', autoUpload: true };
        $scope.filePostAddParams = function (e) {
            e.data = {
                custMbrSid: root.contractData.CUST_MBR_SID,
                objSid: root.contractData.DC_ID, // Contract
                objTypeSid: 1
            }
        };


        $scope.test = function () {
            $scope.togglePending(true);
        }

        $scope.resetToggle = function () {
            // This is pretty bad... please don't tell anyone I did this :)
            // The toggle is setup like Angular but really only one way binding.
            // Some... I redraw and rebind to scope to toggle it back.
            var html = $("#toggle-container").html();
            var template = angular.element(html);
            var linkFunction = $compile(template);
            linkFunction($scope);
            $("#toggle-container").html(template);
        }

        $scope.closeDialog = function () {
            $scope.togglePending(false);
            $scope.resetToggle();
            $scope.dialogPendingWarning.close();
        }
        $scope.continueAction = function (fromToggle, checkForRequirements) {
            if ($scope.isPending === true && root.contractData.CUST_ACCPT === "Accepted" && root.contractData.HAS_ATTACHED_FILES === "0" && root.contractData.C2A_DATA_C2A_ID.trim() === "") return;
            $scope.dialogPendingWarning.close();

            if (!checkForRequirements) {
                $scope.canBypassEmptyActions = fromToggle && root.contractData.CUST_ACCPT === "Accepted";
                $scope.actionItemsBase(true, true);
            } else {
                $scope.actionItemsBase(true);
            }
        }
        $scope.actionItemsBase = function (approvePending, saveCustAcceptance) {
            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Contract Manager", "");
            var pcUi = new perfCacheBlock("Gather data to pass", "UI");

            var data = {};
            var dataItems = [];

            if (!!approvePending && approvePending === true && $scope.canBypassEmptyActions) {
                var ps = root.contractData.PRC_ST;
                if (ps !== undefined) {
                    for (var p = 0; p < ps.length; p++) {
                        if (ps[p].WF_STG_CD === "Pending") {
                            $("#rad_approve_" + ps[p].DC_ID)[0].checked = true;
                        }
                    }
                }
            }

            $scope.needToRunOverlaps = [];

            getActionItems(data, dataItems, "Approve", "Send for Approval");
            getActionItems(data, dataItems, "Revise", "Send for Revision");
            getActionItems(data, dataItems, "Cancel", "Send for Cancelling");
            getActionItems(data, dataItems, "Hold", "Send for Holding");

            if (Object.keys(data).length === 0) {
                if (!$scope.canBypassEmptyActions) {
                    kendo.alert("No Pricing Strategies were selected.");
                }
                $scope.canBypassEmptyActions = false;
                if (saveCustAcceptance === true) {
                    root.quickSaveContract();
                }
                return;
            }

            $scope.context = dataItems;

            if ($scope.$root.pc !== null) $scope.$root.pc.add(pcUi.stop());
            var pcUser = new perfCacheBlock("User Modal", "UI");

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'actionSummaryModal',
                controller: 'actionSummaryModalCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    dataItems: function () {
                        return dataItems;
                    },
                    showErrMsg: function () {
                        return root.needMct();
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if ($scope.$root.pc !== null) $scope.$root.pc.add(pcUser.stop());
                if (saveCustAcceptance === true) {
                    root.quickSaveContract($scope.checkPriorToActioning, data, result);
                } else {
                    $scope.checkPriorToActioning(data, result);
                }
                $scope.canBypassEmptyActions = false;
            }, function () {
                if (saveCustAcceptance === true && fromToggle) {
                    fromToggle = false;
                    $scope.togglePending(false);
                    $scope.resetToggle();
                }
            });

        }

        $scope.sendEmail = function () {
            var dataItem = {
                from: "philip.w.eckenroth@intel.com",
                to: "",
                subject: "Hello World",
                body: "Hello <b>World</b>"
            };
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'emailModal',
                controller: 'emailModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function (result) {
            }, function () { });
        }

        $scope.openEmailMsg = function (ids) {

            $("#wincontractMessages").data("kendoWindow").close();

            var rootUrl = window.location.protocol + "//" + window.location.host;

            var items = [];

            for (var a = 0; a < $scope.root.contractData.PRC_ST.length; a++) {
                var stItem = $scope.root.contractData.PRC_ST[a];
                if (!!stItem && ids.indexOf(stItem.DC_ID) >= 0) {
                    var item = {
                        "CUST_NM": $scope.root.contractData.Customer.CUST_NM,
                        "VERTICAL_ROLLUP": stItem.VERTICAL_ROLLUP,
                        "CNTRCT": "#" + $scope.root.contractData.DC_ID + " " + $scope.root.contractData.TITLE,
                        "DC_ID": stItem.DC_ID,
                        "NEW_STG": stItem.WF_STG_CD,
                        "TITLE": stItem.TITLE,
                        "url": rootUrl + "/advancedSearch#/gotoPs/" + stItem.DC_ID
                    };
                    items.push(item);
                }
            }

            if (items.length === 0) {
                kendo.alert("No items were selected to email.");
                return;
            }

            var custNames = [];
            for (var x = 0; x < items.length; x++) {
                if (custNames.indexOf(items[x].CUST_NM) < 0)
                    custNames.push(items[x].CUST_NM);
            }

            var data = {
                from: window.usrEmail,
                items: items
            }

            var actnList = [];
            actnList.push(kendo.template($("#emailItemTemplate").html())(data));
            var msg = actnList.join("\n\n");

            var dataItem = {
                from: "mydeals.notification@intel.com",
                to: "",
                subject: "My Deals Action Required for " + custNames.join(', ') + "!",
                body: msg
            };
            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'emailModal',
                controller: 'emailModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function (result) {
            }, function () { });
        }


        $scope.openOverlappingDealCheck = function (ovrlpData) {
            $scope.$root.ovrlpData = ovrlpData === undefined ? [] : ovrlpData;

            var html = "<overlapping-deals obj-sids='[]' obj-type='\"local\"' style='height: 100%;'></overlapping-deals>";
            var template = angular.element(html);
            $compile(template)($scope);

            $("#smbWindow").html(template);

            $("#smbWindow").kendoWindow({
                width: "800px",
                height: "500px",
                title: "Overlapping Deals - Please fix before you continue",
                visible: false,
                actions: [
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                close: function () {
                    $("#smbWindow").html("");
                }
            }).data("kendoWindow").center().open();
        }

        $scope.checkPriorToActioning = function (data, result) {

            if ($scope.needToRunOverlaps.length > 0) {
                $scope.root.setBusy("Overlapping Deals Check", "Running Overlapping Deals Check.", "Info", true);
                var pcPct = new perfCacheBlock("Running Overlapping check", "MT");
                objsetService.getOverlappingDealsFromPricingStrategy($scope.needToRunOverlaps.join(',')).then(
                    function (e) {
                        if ($scope.$root.pc !== null) $scope.$root.pc.add(pcPct.stop());
                        $scope.root.setBusy("PCT/MCT Complete", "Price Cost Test and Meet Comp Test Completed.", "Success");

                        if (e.data.Data.length === 0) {
                            $scope.checkPctMctPriorToActioning(data, result);
                        } else {
                            $scope.openOverlappingDealCheck(e.data.Data);
                            $scope.root.setBusy("", "");
                        }
                    },
                    function (response) {
                        $scope.root.setBusy("Error", "Could not Run Overlapping Check.");
                        logger.error("Could not run Overlapping Cheack.", response, response.statusText);
                        $timeout(function () {
                            $scope.root.setBusy("", "");
                        }, 2000);
                    }
                );
            } else {
                $scope.checkPctMctPriorToActioning(data, result);
            }
        }

        $scope.checkPctMctPriorToActioning = function (data, result) {
            // check for running MCP or PCT
            //debugger;
            var ids = $scope.getIdsToPctMct(data);
            if (ids.length > 0) {
                $(".iconRunPct").addClass("fa-spin grn");
                $scope.root.setBusy("Running PCT/MCT", "Running Price Cost Test and Meet Comp Test.", "Info", true);
                var pcPct = new perfCacheBlock("Running PCT/MCT", "MT");
                objsetService.runPctContract($scope.root.contractData.DC_ID).then(
                    function (e) {
                        if ($scope.$root.pc !== null) $scope.$root.pc.add(pcPct.stop());

                        //Look at PCT/MCT results and determine if we can proceed - PCT updated test results, actionPricingStrategies now checks for fails
                        var msg = e.data.Message;
                        if (msg.includes("Didn't Pass")) // Failed PCT
                        {
                            if ($scope.$root.pc !== null) $scope.root.setBusy("PCT/MCT Complete", "Price Cost Test and Meet Comp Test Completed with Failure Result.  Approval actions will not be run.", "Warning");
                        }
                        else // Passed PCT
                        {
                            if ($scope.$root.pc !== null) $scope.root.setBusy("PCT/MCT Complete", "Price Cost Test and Meet Comp Test Completed.", "Success");
                        }

                        $(".iconRunPct").removeClass("fa-spin grn");
                        root.actionPricingStrategies(data, result);
                    },
                    function (response) {
                        $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                        logger.error("Could not run Cost Test in manager for contract " + $scope.root.contractData.DC_ID, response, response.statusText);
                        $timeout(function () {
                            $scope.root.setBusy("", "");
                            $(".iconRunPct").removeClass("fa-spin grn");
                        }, 2000);
                    }
                );
            } else {
                root.actionPricingStrategies(data, result);
            }
        }

        $scope.getIdsToPctMct = function (data) {
            var rtn = [];

            // If I just ran it by hand... don't do it again
            if ($scope.ranManuallySincePageLoaded) return rtn;

            var role = window.usrRole;
            var apprItems = data["Approve"];
            if (!!apprItems) {
                for (var a = 0; a < apprItems.length; a++) {
                    var stage = apprItems[a]["WF_STG_CD"];
                    var hasL1 = apprItems[a]["HAS_L1"];
                    if (hasL1 && ((role === "GA" && stage === "Requested") || (role === "DA" && stage === "Submitted"))) {
                        rtn.push(apprItems[a]["DC_ID"]);
                    }
                }
            }
            return rtn;
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

        $scope.refreshContract = function () {
            root.refreshContractData();
            $scope.LAST_COST_TEST_RUN_DSPLY = '&nbsp;';
        }

        if ($location.url().split('searchTxt=').length > 1) {
            var sTxt = $location.url().split('searchTxt=')[1];
            var decodedTxt = $('<div/>').html(sTxt).text();
            decodedTxt = decodeURIComponent((decodedTxt + '').replace(/\+/g, '%20'));
            $scope.titleFilter = decodedTxt;
        }

        $scope.clearFilter();
        $scope.calcNeedToRunStatus();

    }
})();
