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
                ret = "Missing CAP";
            }
            if (item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
                ret = "Missing Cost";
            }
            if (item.CAP_MISSING_FLG !== undefined && item.CAP_MISSING_FLG == "1" && item.COST_MISSING_FLG !== undefined && item.COST_MISSING_FLG == "1") {
                ret = "Missing Cost and CAP";
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
            return { backgroundColor: commonUtil.getColorStage(c,colorDictionary) };
        }
        $scope.getColorStyle = function (c) {
            return { color: $scope.getColorPct(c, colorDictionary) };
        }
        $scope.getColorType = function (d) {
            return commonUtil.getColor('type', d, colorDictionary);
        }        
        $scope.getColorPct = function (d) {
            if (!d) d = "InComplete";
            return commonUtil.getColor('pct', d, colorDictionary);
        }
        $scope.getColorMct = function (d) {
            if (!d) d = "InComplete";
            return commonUtil.getColor('mct', d, colorDictionary);
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
        
        $scope.summaryFilter = function (ps) {
            return (
                ($scope.dealTypeFilter === undefined || $scope.dealTypeFilter === '' || ps.dealType === undefined || ps.dealType.indexOf($scope.dealTypeFilter) >= 0) &&
                ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp(commonUtil.escapeRegExp($scope.titleFilter), "i")) >= 0 || $scope.titleInPt(ps)) &&
                $scope.stageInPs(ps)
            );
        }

        $scope.titleInPt = function (ps) {
            if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
            for (var i = 0; i < ps.PRC_TBL.length; i++) {
                if (ps.PRC_TBL[i].TITLE.search(new RegExp(commonUtil.escapeRegExp($scope.titleFilter), "i")) >= 0) return ps;
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

        //US860853
        commonUtil.checkpricegrpcode($scope.root);
        
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

        function onDataBound() {
            var wrapper = this.wrapper,
                header = wrapper.find(".k-grid-header"),
                id = wrapper.attr('id');

            function scrollFixed() {

                // Position of y-scroll
                var offset = $(this).scrollTop() + 120,
                    tableOffsetTop = wrapper[0].offsetTop,
                    tableOffsetBottom = tableOffsetTop + wrapper.height() - header.height();

                // When scroll position is greater than table header position apply fix header css else remove it
                if (offset < tableOffsetTop || offset > tableOffsetBottom) {
                    header.removeClass("fixed-header");
                } else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && !header.hasClass("fixed")) {
                    header.addClass("fixed-header");
                }
            }

            // Grids container where scroll appears
            $("#sum-container").scroll(scrollFixed);
        }

        $scope.togglePt = function (ps, pt) {

            $("#sumWipGrid_" + pt.DC_ID).html("<div style='margin: 10px;'><ul class='fa-ul'><li><i class='fa-li fa fa-spinner fa-spin'></i>Loading...</li></ul></div>");

            var ds;

            if (pt.OBJ_SET_TYPE_CD === "ECAP") { // ECAP pt grid
                ds = new kendo.data.DataSource({                    
                    transport: commonUtil.transport(pt.DC_ID),
                    schema: commonUtil.schema(pt.OBJ_SET_TYPE_CD),
                    requestEnd: function (e) {
                        commonUtil.checkStage(e.response);
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
                        dataBound: onDataBound,
                        sortable: true,
                        height: 250,
                        columns: commonUtil.sumGridColumns(pt.OBJ_SET_TYPE_CD, gridId, root.CAN_VIEW_COST_TEST, root.CAN_VIEW_MEET_COMP)
                    }
                }
            }
            else if (pt.OBJ_SET_TYPE_CD === "KIT") { //KIT pt grid
                ds = new kendo.data.DataSource({
                    transport: commonUtil.transport(pt.DC_ID),
                    schema: commonUtil.schema(pt.OBJ_SET_TYPE_CD),
                    requestEnd: function (e) {
                        commonUtil.checkStage(e.response);
                        drawGrid(pt);
                    },
                    sort: { field: "sortOrder", dir: "desc" }
                });

                $scope.sumGridOptions = function (gridId) {
                    return {
                        filterable: true,
                        resizable: true,
                        dataBound: onDataBound,
                        autoBind: false,
                        dataSource: ds,
                        sortable: true,
                        height: 250,
                        columns: commonUtil.sumGridColumns(pt.OBJ_SET_TYPE_CD, gridId, root.CAN_VIEW_COST_TEST, root.CAN_VIEW_MEET_COMP)
                    }
                }
            }
            else { // Non-ECAP pt grids (PROGRAM, VT)
                ds = new kendo.data.DataSource({
                    transport: commonUtil.transport(pt.DC_ID),
                    schema: commonUtil.schema(pt.OBJ_SET_TYPE_CD),
                    requestEnd: function (e) {
                        commonUtil.checkStage(e.response);
                        drawGrid(pt);
                    }
                });
                $scope.sumGridOptions = function (gridId) {
                    return {
                        filterable: true,
                        resizable: true,
                        autoBind: false,
                        dataBound: onDataBound,
                        dataSource: ds,
                        sortable: true,
                        height: 250,
                        columns: commonUtil.sumGridColumns(pt.OBJ_SET_TYPE_CD, gridId, root.CAN_VIEW_COST_TEST, root.CAN_VIEW_MEET_COMP)
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
                    if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0] != null && $("#rad_approve_" + ps[p].DC_ID)[0].checked) {
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
                        if (ps[p].WF_STG_CD === "Pending" && $("#rad_approve_" + ps[p].DC_ID)[0] != null) {
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

            // Check unique stages as per role
            var stageToCheck = "";
            if (window.usrRole == "DA") {
                stageToCheck = "Approved"
            } else if (window.usrRole == "GA") {
                stageToCheck = "Submitted"
            }

            // set this flag to false when stages are not unique as per role
            var stagesOK = true;

            for (var a = 0; a < $scope.root.contractData.PRC_ST.length; a++) {
                var stItem = $scope.root.contractData.PRC_ST[a];
                if (!!stItem && ids.indexOf(stItem.DC_ID) >= 0) {
                    var item = {
                        "CUST_NM": $scope.root.contractData.Customer.CUST_NM,
                        "VERTICAL_ROLLUP": stItem.VERTICAL_ROLLUP,
                        "CNTRCT": "#" + $scope.root.contractData.DC_ID + " " + $scope.root.contractData.TITLE,
                        "C2A_ID": $scope.root.contractData.C2A_DATA_C2A_ID,
                        "DC_ID": stItem.DC_ID,
                        "NEW_STG": stItem.WF_STG_CD,
                        "TITLE": stItem.TITLE,
                        "url": rootUrl + "/advancedSearch#/gotoPs/" + stItem.DC_ID,
                        "contractUrl": rootUrl + "/Contract#/manager/" + $scope.root.contractData.DC_ID
                    };

                    if (stageToCheck != "" && stageToCheck != item.NEW_STG) {
                        stagesOK = false;
                    }

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

            var subject = "";
            var eBodyHeader = "";

            if (stagesOK && window.usrRole === "DA") {
                subject = "My Deals Deals Approved for ";
                eBodyHeader = "My Deals Deals Approved!";
            } else if (stagesOK && window.usrRole === "GA") {
                subject = "My Deals Approval Required for "
                eBodyHeader = "My Deals Approval Required!";
            } else {
                subject = "My Deals Action Required for ";
                eBodyHeader = "My Deals Action Required!";
            }

            subject = subject + custNames.join(', ') + "!";

            var data = {
                from: window.usrEmail,
                items: items,
                eBodyHeader: eBodyHeader
            }

            var actnList = [];
            actnList.push(kendo.template($("#emailItemTemplate").html())(data));
            var msg = actnList.join("\n\n");

            var dataItem = {
                from: "mydeals.notification@intel.com",
                to: "",
                subject: subject,
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
                        logger.error("Could not run Overlapping Check.", response, response.statusText);
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
            var role = window.usrRole;
            var apprItems = data["Approve"];
            if (!!apprItems) {
                for (var a = 0; a < apprItems.length; a++) {
                    var stage = apprItems[a]["WF_STG_CD"];
                    if (((role === "GA" && stage === "Requested") || (role === "DA" && stage === "Submitted"))) {
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
