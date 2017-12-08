(function () {
    'use strict';

angular
    .module('app.contract')
    .controller('managerController', managerController);

managerController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal'];

function managerController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal) {

    var root = $scope.$parent;	// Access to parent scope
    $scope.root = root;
    $scope.stageFilter = [];
    $scope.dealTypeFilter = "";
    $scope.canEdit = true;
    $scope.canFilterDealTypes = false;
    $scope.$parent.isSummaryHidden = false;
    $scope.hideIfNotPending = root.contractData.CUST_ACCPT !== "Pending";
    $scope.pendingWarningActions = [];
    $scope.showPendingInfo = true;
    $scope.showPendingFile = false;
    $scope.showPendingC2A = false;
    $scope.needToRunPct = false;
    $scope.canBypassEmptyActions = false;

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

    $timeout(function () {
        $("#timelineDiv").removeClass("active");
        $("#overlappingDiv").removeClass("active");
        $("#pctDiv").removeClass("active");
        $("#approvalDiv").addClass("active");
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

    $scope.refreshContractDataIfNeeded = function (e, executedFromBtn) {
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

                    $timeout(function() {
                        $scope.root.$apply();
                    });
                } else {
                    op.notifyInfo("Refresh the screen to see latest Cost Test Results", "Cost Test Complete");
                }

            }
        });
    }

    $scope.isPending = root.contractData.CUST_ACCPT === "Pending";
    $scope.pendingChange = function (e) {
        if (!$scope.isPending) {
            $scope.isPending = true;
            root.contractData.CUST_ACCPT = "Pending";
            $scope.actionItems(true, false);
        } else {
            $scope.isPending = false;
            root.contractData.CUST_ACCPT = "Accepted";
            $scope.actionItems(true, true);
        }
    }

    $scope.deleteContract = function () {

        // TODO need to check if there are any tracker numbers

        kendo.confirm("Are you sure that you want to delete this contract?").then(function () {
            $scope.$apply(function () {

                $scope.setBusy("Deleting...", "Deleting the Contract");
                topbar.show();
                // Remove from DB first... then remove from screen
                objsetService.deleteContract($scope.getCustId(), $scope.contractData.DC_ID).then(
                    function (data) {

                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Delete Failed", "Unable to Deleted the Contract");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.setBusy("Delete Successful", "Deleted the Contract");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 2000);
                        topbar.hide();

                        // redirect if focused PT belongs to deleted PS
                        document.location.href = "/Dashboard#/portal";
                    },
                    function (result) {
                        logger.error("Could not delete the Contract.", result, result.statusText);
                        topbar.hide();
                        $scope.setBusy("", "");
                    }
                );
            });
        });

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
        root.isPtr = false;
        root.isWip = false;

        if (!pt) {
            $state.go('contract.manager',
            {
                cid: ps.DC_PARENT_ID
            });
        } else {
            if (ps.PASSED_VALIDATION === "Complete") {
                root.isWip = true;
                $state.go('contract.manager.strategy.wip',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID,
                        pid: pt.DC_ID
                    });
            } else {
                root.isPtr = true;
                $state.go('contract.manager.strategy',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID,
                        pid: pt.DC_ID
                    });
            }
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

    $scope.togglePt = function (ps,pt) {

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
                                TRKR_NBR: { type: "object" },
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
                        locked: true,
                        template: "<deal-tools ng-model='dataItem' is-file-attachment-enabled='false'></deal-tools>"
                    }, {
                        field: "DC_ID",
                        title: "Deal Id",
                        width: "90px",
                        locked: true,
                        template: "<div class='dealLnk'><i class='intelicon-protection-solid valid-icon validf_{{dataItem.PASSED_VALIDATION}}' title='Validation: {{ dataItem.PASSED_VALIDATION || \"Not validated yet\" }}' ng-class='{ \"intelicon-protection-solid\": (dataItem.PASSED_VALIDATION === undefined || dataItem.PASSED_VALIDATION === \"\"), \"intelicon-protection-checked-verified-solid\": (dataItem.PASSED_VALIDATION === \"Complete\" || dataItem.PASSED_VALIDATION === \"Valid\" || dataItem.PASSED_VALIDATION === \"Finalizing\"), \"intelicon-protection-failed-solid\": (dataItem.PASSED_VALIDATION === \"Dirty\") }'></i>#=DC_ID#</div>"
                    }, {
                        field: "TRKR_NBR",
                        title: "Tracker Number",
                        width: "150px",
                        locked: true,
                        template: "#=gridUtils.concatDimElements(data, 'TRKR_NBR')#"
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

            if ($("#detailGrid_" + pt.DC_ID).length === 0) {
                var html = "<kendo-grid options='sumGridOptions' id='detailGrid_" + pt.DC_ID + "' class='opUiContainer md dashboard'></kendo-grid>";
                var template = angular.element(html);
                var linkFunction = $compile(template);
                linkFunction($scope);

                $("#sumWipGrid_" + pt.DC_ID).html(template);
            }

            pt.isLoading = false;
        }

    }

    function getItem(items, actn) {
        var allPs = root.contractData.PRC_ST;
        var id = parseInt(items.getAttribute("dcId"));

        var result = $.grep(allPs, function (e) { return e.DC_ID === id; });
        var stage = result.length > 0 ? result[0].WF_STG_CD : "";
        var title = result.length > 0 ? result[0].TITLE : "";

        return { "DC_ID": id, "WF_STG_CD": stage, "TITLE": title, "ACTN": actn };
    }

    function getActionItems(data, dataItem, actn, actnText) {
        var ids = [];
        var items = $(".psCheck-" + actn);

        for (var i = 0; i < items.length; i++) {
            if (items[i].checked) {
                var item = getItem(items[i], actnText);
                ids.push(item);
                dataItem.push(item);
            }
        }

        if (ids.length > 0) data[actn] = ids;
    }

    $scope.actionItems = function (fromToggle, checkForRequirements) {
        if (fromToggle === undefined || fromToggle === null) fromToggle = false;
        if (checkForRequirements === undefined || checkForRequirements === null) checkForRequirements = false;

        // look for checked ending
        var ps = root.contractData.PRC_ST;
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




    $scope.closeDialog = function () {
        $timeout(function () {
            if ($scope.isPending) {
                $scope.isPending = false;
                $scope.root.contractData.CUST_ACCPT = "Accepted";
            } else {
                $scope.isPending = true;
                $scope.root.contractData.CUST_ACCPT = "Pending";
            }
            $scope.$apply();
        }, 500);
        $scope.dialogPendingWarning.close();
    }
    $scope.continueAction = function (fromToggle, checkForRequirements) {
        if ($scope.isPending === true && root.contractData.CUST_ACCPT === "Accepted" && root.contractData.HAS_ATTACHED_FILES === "0" && root.contractData.C2A_DATA_C2A_ID.trim() === "") return;
        $scope.dialogPendingWarning.close();

        if (!checkForRequirements) {
            $scope.canBypassEmptyActions = fromToggle;
            root.quickSaveContract($scope.actionItemsBase, true);
        } else {
            $scope.actionItemsBase(true);
        }
    }
    $scope.actionItemsBase = function (approvePending) {
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

        getActionItems(data, dataItems, "Approve", "Send for Approval");
        getActionItems(data, dataItems, "Revise", "Send for Revision");
        getActionItems(data, dataItems, "Cancel", "Send for Cancelling");
        getActionItems(data, dataItems, "Hold", "Send for Holding");

        if (Object.keys(data).length === 0) {
            if (!$scope.canBypassEmptyActions) {
                kendo.alert("No Pricing Strategies were selected.");
            }
            $scope.canBypassEmptyActions = false;
            return;
        }

        $scope.context = dataItems;


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
            $scope.checkPctMctPriorToActioning(data, result);
            $scope.canBypassEmptyActions = false;
        }, function () { });

    }

    $scope.checkPctMctPriorToActioning = function (data, result) {

        // check for running MCP or PCT
        var ids = $scope.getIdsToPctMct(data);
        if (ids.length > 0) {
            $(".iconRunPct").addClass("fa-spin grn");
            $scope.root.setBusy("Running PCT/MCT", "Running Price Cost Test and Meet Comp Test.");
            objsetService.runPctContract($scope.root.contractData.DC_ID).then(
                function (e) {

                    //TODO Look at PCT/MCT results and determine if we can proceed
                    //
                    var testType = window.usrRole === "GA" ? "MCT" : "PCT";


                    $scope.root.setBusy("PCT/MCT Complete", "Price Cost Test and Meet Comp Test Completed.");
                    $(".iconRunPct").removeClass("fa-spin grn");
                    root.actionPricingStrategies(data, result);
                },
                function (response) {
                    $scope.root.setBusy("Error", "Could not Run " + $scope.textMsg + ".");
                    logger.error("Could not run Cost Test.", response, response.statusText);
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
                if ((role === "GA" && stage === "Requested") || (role === "DA" && stage === "Submitted")) {
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
    $scope.clearFilter();


}
})();
