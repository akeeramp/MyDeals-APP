(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('ContractController', ContractController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];
    ContractController.$inject = ['$scope', '$uibModalStack', '$state', '$filter', '$localStorage', '$linq', 'contractData', 'copyContractData', 'isNewContract', 'isTender', 'templateData', 'objsetService', 'securityService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope', 'confirmationModal', 'dataService', 'customerCalendarService', 'contractManagerConstants', 'MrktSegMultiSelectService', '$compile', 'colorDictionary', '$q', 'opGridTemplate','productSelectorService'];

    function ContractController($scope, $uibModalStack, $state, $filter, $localStorage, $linq, contractData, copyContractData, isNewContract, isTender, templateData, objsetService, securityService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope, confirmationModal, dataService, customerCalendarService, contractManagerConstants, MrktSegMultiSelectService, $compile, colorDictionary, $q, opGridTemplate, productSelectorService) {
        // store template information ()
        if (contractData && contractData.data.length > 0) { // Safety check for user jumping to contract that they don't have access to tossing errors (MEETCOMP_TEST_RESULT key not found)
            $scope.MEETCOMP_TEST_RESULT = contractData.data[0].MEETCOMP_TEST_RESULT;
            $scope.COST_TEST_RESULT = contractData.data[0].COST_TEST_RESULT;
        } else {
            $scope.MEETCOMP_TEST_RESULT = "";
            $scope.COST_TEST_RESULT = "";
        }

        if (contractData != null && contractData.data[0].Customer !== undefined) {
            objsetService.getCustomerVendorDropDown('GetCustomerVendors/' + contractData.data[0].Customer.CUST_SID).then(function (response) {
                $scope.getVendorDropDownResult = response.data;
            },function (response) {
                logger.error("Unable to get Settlement Partner list.", response, response.statusText);
            });
        }
        $scope.overlapFlexResult = null;
        $scope.selectedTAB = 'PTR'; // Tender Deals
        $scope._tabDetails = []; // Tender Deals
        $scope.templates = $scope.templates || templateData.data;
        $scope.constants = contractManagerConstants;
        $scope.isContractDetailsPage = $state.current.name === $scope.constants.ContractDetails;
        $scope.isBusy = false;
        $scope.isBusyMsgTitle = "";
        $scope.isBusyMsgDetail = "";
        $scope.isBusyType = "";
        $scope.isBusyShowFunFact = false;
        $scope.stealthMode = false;
        $scope.messages = [];
        $scope.pendingList = [];
        $scope.colToLetter = {};
        $scope.letterToCol = {};
        var intA = "A".charCodeAt(0);
        $scope.pageTitle = "Pricing Table Editor";
        $scope.isPtr = false;
        $scope.isWip = false;
        $scope.child = null;
        $scope.isAutoSaving = false;
        $scope.defCust = $localStorage.selectedCustomerIds !== undefined && $localStorage.selectedCustomerIds.length > 0 ? $localStorage.selectedCustomerIds[0] : undefined;
        $scope.switchingTabs = false;
        $scope.maxKITproducts = 10;
        $scope.$root.pc = null;
        $scope.delPtrIds = [];
        $scope.helpTopicDealEditorFeatures = HelpTopicEnum.DealEditor_Features;
        $scope.helpTopicContractAndDealViews = HelpTopicEnum.ContractManager_ContractAndDealViews;
        $scope.helpTopicGroupingExclusions = HelpTopicEnum.ContractManager_GroupingExclusions;
        $scope.contractHeaderMaxCharWidth = 55;
        $scope.isSuper = window.isSuper;
        $scope.isErrorWarning = false;
        $scope.forceNavigation = false;
        $scope.usrRole = window.usrRole;
        $scope.actualClikedTabName = 'PTR';
        $scope.currentTAB = 'PTR';
        $scope.isTenderWidgetVisible = false;
        $scope.inCompleteCapMissing = false;
        $scope.enablePTRReload = false;
        $scope.showMCTag = false;
        // custom Contract Titles
        $scope.isTenderContract = isTender;
        $scope.isVistex = false;
        $scope.isVistexHybrid = 0;
        $scope.isPerformanceDisplayUser = window.isTester || window.isDeveloper;

        $scope.contractType = "Contract";
        $scope.contractName = $scope.contractType + " Name:";
        $scope.psTitle = "Pricing Strategy";
        $scope.ptTitle = "Pricing Table";
        $scope.ptTitleLbl = "Enter " + $scope.ptTitle + " Name";
        $scope.pageTitle = $scope.ptTitle + " Editor";

        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR", "STRT_REV", "END_REV", "INCENTIVE_RATE", "STRT_PB", "END_PB"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
        $scope.kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];

        //Tender only columns for PRC_TBL_ROW
        $scope.tenderOnlyColumns = ["CAP", "YCS2", "SERVER_DEAL_TYPE", "QLTR_BID_GEO"];
        $scope.tenderRequiredColumns = ["VOLUME"];
        $scope.vistextHybridOnlyColumns = ["REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT"];
        $scope.hybridSaveBlockingColumns = ['REBATE_TYPE', 'PAYOUT_BASED_ON', 'CUST_ACCNT_DIV', 'GEO_COMBINED', 'PERIOD_PROFILE', 'RESET_VOLS_ON_PERIOD', 'PROGRAM_PAYMENT', 'SETTLEMENT_PARTNER', 'AR_SETTLEMENT_LVL'];

        var editableArSettlementLevelAfterApproval = ["Issue Credit to Billing Sold To", "Issue Credit to Default Sold To by Region"];

        $scope.flowMode = "Deal Entry";
        if ($state.current.name.indexOf("contract.compliance") >= 0) $scope.flowMode = "Compliance";
        else if ($state.current.name.indexOf("contract.summary") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.timeline") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.deals") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.export") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.pct") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.grouping") >= 0) $scope.flowMode = "Manage";
        else if ($state.current.name.indexOf("contract.overlapping") >= 0) $scope.flowMode = "Manage";


        //var s1 = securityService.chkAtrbRules('ATRB_READ_ONLY', 'SA', 'CNTRCT', 'ALL_TYPES', 'InComplete', 'TITLE');
        $scope.C_CREATE_CONTRACT = securityService.chkDealRules('C_CREATE_CONTRACT', window.usrRole, null, null, null);
        $scope.CAN_VIEW_COST_TEST = securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper); // Can view the pass/fail
        $scope.CAN_EDIT_COST_TEST = securityService.chkDealRules('C_EDIT_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "SA" && window.isSuper); // Can go to cost test screen and make changes
        $scope.CAN_RUN_COST_TEST = securityService.chkDealRules('C_EDIT_COST_TEST', window.usrRole, null, null, null) || ((window.usrRole === "GA" || window.usrRole === "SA") && window.isSuper); // Can view the pass/fail
        $scope.CAN_VIEW_MEET_COMP = securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null);
        $scope.CAN_EDIT_MEET_COMP = securityService.chkDealRules('C_EDIT_MEET_COMP', window.usrRole, null, null, null);
        $scope.C_ADD_PRICING_STRATEGY = securityService.chkDealRules('C_ADD_PRICING_STRATEGY', window.usrRole, null, null, null);
        $scope.C_DEL_PRICING_STRATEGY = securityService.chkDealRules('C_DEL_PRICING_STRATEGY', window.usrRole, null, null, null);
        $scope.C_VIEW_ATTACHMENTS = securityService.chkDealRules('C_VIEW_ATTACHMENTS', window.usrRole, null, null, null);
        $scope.C_ADD_ATTACHMENTS = securityService.chkDealRules('C_ADD_ATTACHMENTS', window.usrRole, null, null, null);
        $scope.C_EDIT_PRODUCT = securityService.chkDealRules('C_EDIT_PRODUCT', window.usrRole, null, null, null);
        $scope.C_DELETE_CONTRACT = securityService.chkDealRules('C_DELETE_CONTRACT', window.usrRole, null, null, null);

        $scope.C_HOLD_DEALS = (window.usrRole === "FSE" || window.usrRole === "GA" || window.usrRole === "DA");
        $scope.C_DEL_DEALS = (window.usrRole === "FSE" || window.usrRole === "GA");
        $scope.CAN_VIEW_EXPORT = true;
        $scope.CAN_VIEW_EXCLUDE_GROUPS = true;
        $scope.CAN_VIEW_ALL_DEALS = true;  //Removed for DE8996 - (window.isDeveloper || window.isTester);
        $scope.canDeleteAttachment = function (wfStage) {
            return securityService.chkDealRules('C_DELETE_ATTACHMENTS', window.usrRole, null, null, wfStage);
        }

        $scope.usrRole = window.usrRole;

        // Hard code for now until security is put in place
        if (window.usrRole === "Legal") {
            $scope.CAN_VIEW_COST_TEST = true;
            $scope.CAN_EDIT_COST_TEST = false;
        }

        $scope.swapUnderscore = function (str) {
            return str.replace(/_/g, ' ');
        }

        $scope.inCompleteDueToCapMissing = function (isTrue) {
            $scope.inCompleteCapMissing = isTrue;
        }

        // determine if the contract is existing or new... if new, look for pre-population attributes from the URL parameters

        $scope.initContract = function (contractData) {
            // New contract template
            var c = util.clone($scope.templates.ObjectTemplates.CNTRCT.ALL_TYPES);

            // contract exists
            if (contractData !== null && contractData !== undefined) {
                if (contractData.data[0] !== undefined) {
                    //contractData.data[0]._behaviors = c._behaviors; // DE29422 - This was resetting passed behaviors with an override of what the new contract required should be.
                    return contractData.data[0];
                }
                // Could not find the contract
                $state.go('nocontract');
            }

            // check URL and see if any parameters were passed.
            // TODO check the purpose of this code
            var s = $location.search();
            angular.forEach(s,
                function (value, key) {
                    if (c[key] !== undefined && s[key] !== undefined && s[key] !== "") {
                        c[key] = s[key];
                    }
                });

            return c;
        }

        $scope.ApplyTitlesToChildren = function () {
            if (!!$scope.contractData.PRC_ST) {
                for (var x = 0; x < $scope.contractData.PRC_ST.length; x++) {
                    var prnt = $scope.contractData.PRC_ST[x];
                    if (!!prnt._behaviors && !!prnt._behaviors.isReadOnly && !!prnt._behaviors.isReadOnly.TITLE) {
                        if (!!prnt.PRC_TBL) {
                            for (var c = 0; c < prnt.PRC_TBL.length; c++) {
                                var child = prnt.PRC_TBL[c];
                                if (!child._behaviors) child._behaviors = {};
                                if (!child._behaviors.isReadOnly) child._behaviors.isReadOnly = {};
                                child._behaviors.isReadOnly.TITLE = prnt._behaviors.isReadOnly.TITLE;
                            }
                        }
                    }
                }
            }
        }

        $scope.removeBlanks = function (val) {

            return val.replace(/_/g, '');

        }
        //Business Purpose: For Hybrid Pricing Strategy only Deal type is ECAP
        $scope.HybridDealType = [];
        $scope.HybridDealType.push({
            DEAL_TYPE: "ECAP",
            IS_HYBRID_PRC_STRAT: 'active',
            UI_ENABLED: true,
            UI_VISIBLE: true
        });
        $scope.HybridDealType.push({
            DEAL_TYPE: "KIT",
            IS_HYBRID_PRC_STRAT: 'disabled',
            UI_ENABLED: false,
            UI_VISIBLE: true
        });
        $scope.HybridDealType.push({
            DEAL_TYPE: "PROGRAM",
            IS_HYBRID_PRC_STRAT: 'disabled',
            UI_ENABLED: false,
            UI_VISIBLE: false
        });
        $scope.HybridDealType.push({
            DEAL_TYPE: "VOL TIER",
            IS_HYBRID_PRC_STRAT: 'active',
            UI_ENABLED: true,
            UI_VISIBLE: true
        });

        $scope.disableLinks = function (val) {
            if ($scope.contractData.PRC_ST && $scope.curPricingStrategy != null && $scope.curPricingStrategy.DC_ID != undefined) {
                var IS_HYBRID_PRC_STRAT = false;
                $scope.isActiveDefault = '';
                $scope.uiVisible = true;
                for (var i = 0; i < $scope.contractData.PRC_ST.length; i++) {
                    if ($scope.contractData.PRC_ST[i].DC_ID == $scope.curPricingStrategy.DC_ID) {
                        IS_HYBRID_PRC_STRAT = $scope.contractData.PRC_ST[i].IS_HYBRID_PRC_STRAT; //IS_HYBRID_PRC_STRAT = 1 in case Hybrid Pricing Strategy 
                        break;
                    }
                }
                //return true or false for UI Visibility
                if (IS_HYBRID_PRC_STRAT == "1") {
                    for (var index = 0; index < $scope.HybridDealType.length; index++) {
                        if (val.replace(/_/g, ' ') == $scope.HybridDealType[index].DEAL_TYPE) {
                            $scope.isActiveDefault = $scope.HybridDealType[index].IS_HYBRID_PRC_STRAT;
                            $scope.uiVisible = $scope.HybridDealType[index].UI_VISIBLE;
                            return $scope.HybridDealType[index].UI_ENABLED; //Return true for ECAP false for KIT so that KIT will be disabled
                        }
                    }
                    return false;

                }
            }

            return true;
        }

        $scope.enableDealEditorTab = function () {
            if (!$scope.isPtr) return true;
            var data = $scope.pricingTableData;
            if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.PRC_TBL_ROW.length === 0) return false;
            return true;
        }

        function arrBiDirectionalDifference(arr1, arr2) {
            let difference1 = arr1.filter(x => arr2.indexOf(x) === -1);
            let difference2 = arr2.filter(x => arr1.indexOf(x) === -1);
            let difference = difference1.concat(difference2).sort((x, y) => x - y);

            return difference;
        }

        $scope.dealEditorTabValidationIssue = function () {
            var data = $scope.pricingTableData;
            if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.WIP_DEAL === undefined) return false;
            if (data.PRC_TBL_ROW.length > 0 && data.WIP_DEAL.length === 0) return true;

            // Now gather up all PTR IDs on both tabs to detect un-saved ones
            var aryWipIds = [];
            angular.forEach(data.WIP_DEAL, function (item) {
                if (aryWipIds.indexOf(item.DC_PARENT_ID) < 1) aryWipIds.push(item.DC_PARENT_ID);
            });

            var aryPtrIds = [];
            angular.forEach(data.PRC_TBL_ROW, function (item) {
                if (aryPtrIds.indexOf(item.DC_ID) < 1) aryPtrIds.push(item.DC_ID);
            });

            var unpairedPtrs = arrBiDirectionalDifference(aryPtrIds, aryWipIds);

            var myRet = false;
            angular.forEach(data.WIP_DEAL, function (item) {
                if (item.warningMessages.length > 0 && !$scope.isWip) myRet = true;
            });

            if (unpairedPtrs.length > 0) myRet = true; // If any bi-directional changes are noted, trigger
            return myRet;
        }

        $scope.enableFlowBtn = function () {
            if ($scope.contractData.PRC_ST === undefined || $scope.contractData.PRC_ST.length === 0) return false;

            var passedItems = [];
            for (var ps = 0; ps < $scope.contractData.PRC_ST.length; ps++) {
                var psItem = $scope.contractData.PRC_ST[ps];
                if (psItem.PRC_TBL !== undefined) {
                    for (var pt = 0; pt < psItem.PRC_TBL.length; pt++) {
                        if (psItem.PRC_TBL[pt].PASSED_VALIDATION === "Complete") {
                            passedItems.push(psItem.PRC_TBL[pt]);
                        }
                    }
                }
            }

            return passedItems.length > 0;
        }

        $scope.showMeetCompTitle = function () {
            return $scope.enableFlowBtn() ? "" : "Please click the Deal Editor in order to validate your deals before entering Meet Comp Data.";
        }
        $scope.showManageTitle = function () {
            return $scope.enableFlowBtn() ? "" : "Please click the Deal Editor in order to validate your deals.";
        }

        $scope.removeDimKeyFromWipTemplates = function () {
            if ($scope.templates === undefined) return;
            if ($scope.templates.ModelTemplates === undefined) return;
            if ($scope.templates.ModelTemplates.WIP_DEAL === undefined) return;

            var wipTemplates = $scope.templates.ModelTemplates.WIP_DEAL;
            for (var key in wipTemplates) {
                if (wipTemplates.hasOwnProperty(key)) {
                    for (var i = 0; i < wipTemplates[key].columns.length; i++) {
                        var indx = wipTemplates[key].columns[i].field.indexOf("____");
                        if (indx >= 0) {
                            wipTemplates[key].columns[i].field = wipTemplates[key].columns[i].field.substr(0, indx);
                        }
                    }

                    var fields = wipTemplates[key].model.fields;
                    var wipModel = {};
                    for (var fKey in fields) {
                        if (fields.hasOwnProperty(fKey)) {
                            var fIndx = fKey.indexOf("____");
                            if (fIndx >= 0) {
                                wipModel[fKey.substr(0, fIndx)] = fields[fKey];
                            } else {
                                wipModel[fKey] = fields[fKey];
                            }
                        }
                    }
                    wipTemplates[key].model.fields = wipModel;
                }
            }
        }
        $scope.removeDimKeyFromWipTemplates();

        $scope.setBusy = function (msg, detail, msgType, isShowFunFact, isInstant) { // msgType can be Success, Error, Warning, and Info
            if (isInstant == null) {
                isInstant = false;
            }

            if (isInstant) {
                $scope.setBusyBase(msg, detail, msgType, isShowFunFact);
            } else {
                $timeout(function () {
                    $scope.setBusyBase(msg, detail, msgType, isShowFunFact);
                });
            }
        }

        $scope.setBusyBase = function (msg, detail, msgType, isShowFunFact) {
            var newState = msg != undefined && msg !== "";
            if (isShowFunFact == null) { isShowFunFact = false; }

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
                }, 500);
            }
        }
        // populate the contract data upon entry... If multiple controller instances are called, reference the initial instance
        //
        $scope.contractData = $scope.contractData || $scope.initContract(contractData);
        $scope.isNewContract = isNewContract;
        $scope.contractData.displayTitle = "";
        $scope.ApplyTitlesToChildren();
        $scope.initialEndDateReadOnly = !!$scope.contractData._behaviors && !!$scope.contractData._behaviors.isReadOnly && !!$scope.contractData._behaviors.isReadOnly["END_DT"] && $scope.contractData._behaviors.isReadOnly["END_DT"];
        $scope.initialStartDateReadOnly = !!$scope.contractData._behaviors && !!$scope.contractData._behaviors.isReadOnly && !!$scope.contractData._behaviors.isReadOnly["START_DT"] && $scope.contractData._behaviors.isReadOnly["START_DT"];
        $scope.existingMinEndDate = $scope.contractData.DC_ID > 0 ? $scope.contractData['END_DT'] : "";

        //PS object is holding the Pricing Strategy ID with Pricing Strategy Status
        $scope.PS = {};
        if ($scope.contractData.PRC_ST) {
            for (var n = 0; n < $scope.contractData.PRC_ST.length; n++) {
                $scope.PS[$scope.contractData.PRC_ST[n].DC_ID] = $scope.contractData.PRC_ST[n].IS_HYBRID_PRC_STRAT;
            }
        }
        var isCopyTender = (copyContractData !== undefined && copyContractData.data.length > 0 && copyContractData.data[0].IS_TENDER === "1");
        if ($location.url().split('tender=').length > 1 || $scope.contractData["IS_TENDER"] === "1" || isCopyTender || $scope.isTenderContract) {
            $scope.isTenderContract = true;
            $scope.contractType = "Tender Folio";
            $scope.contractName = $scope.contractType + " Name:";
            $scope.psTitle = "Tender Sheet";
            $scope.ptTitle = "Tender Table";
            $scope.ptTitleLbl = "Enter Tender Table Name";
            $scope.contractData["CUST_ACCPT"] = "Acceptance Not Required in C2A";
            $scope.contractData["C2A_DATA_C2A_ID"] = "Tender Folio Auto";
            $scope.isTenderContract = $scope.contractData["IS_TENDER"];
            if ($location.url().split('tender=').length > 1 || $scope.isTenderContract) {
                $scope.contractData["IS_TENDER"] = "1";
            }
        }
        if (($state.current.name == 'contract.manager' || $state.current.name == 'contract.summary') && $scope.isTenderContract) {
            $state.go('contract.manager.strategy', {
                cid: $scope.contractData.DC_ID,
                sid: $scope.contractData.PRC_ST[0].DC_ID,
                pid: $scope.contractData.PRC_ST[0].PRC_TBL[0].DC_ID
            }, { reload: true });

        }
        if (($state.current.name == 'contract.manager.strategy' || $state.current.name == 'contract.manager.strategy.wip') && $scope.isTenderContract) {
            $scope.isTenderWidgetVisible = true;
        }

        if ($state.current.name == 'contract.manager.strategy.wip' && $scope.isTenderContract) {
            $scope.selectedTAB = 'DE'; // DE- Deal Editor
            $scope.currentTAB = 'DE'; // DE- Deal Editor
        }

        $scope.setMcTag = function (bit) {
            $scope.showMCTag = bit;
        }

        $scope.goToTenderDashboard = function () {
            $localStorage.selectedContractID = $scope.contractData.DC_ID;
            $localStorage.selectedDealType = $scope.contractData.PRC_ST[0].PRC_TBL[0].OBJ_SET_TYPE_CD;
            $scope._dirtyContractOnly = false;
            $scope._dirty = false;
            document.location.href = "/advancedSearch#/tenderDashboard?DealType=" + $localStorage.selectedDealType + "&FolioId=" + $scope.contractData.DC_ID + "&search";
        }

        if ($scope.isTenderContract && $scope.contractData.TENDER_PUBLISHED == "1") {
            $scope.goToTenderDashboard();
        }

        $scope.saveBtnName = function () {
            if ($scope.isCopyContract) return 'Copy ' + $scope.contractType;
            return $scope.contractData.DC_ID > 0 ? 'Save ' + $scope.contractType : 'Create ' + $scope.contractType;
        }

        $scope.needMct = function () {
            if (!$scope.contractData.PRC_ST || $scope.contractData.PRC_ST.length === 0) return false;

            for (var m = 0; m < $scope.contractData.PRC_ST.length; m++) {
                var item = $scope.contractData.PRC_ST[m].COMP_MISSING_FLG;
                if (item !== "" && (item === "1" || item === 1)) {
                    return true;
                }
            }
            return false;
        }

        var updateDisplayTitle = function () {
            $scope.contractData.displayTitle = isNewContract
                ? $scope.contractData.TITLE
                : "#" + $scope.contractData.DC_ID + " - " + $scope.contractData.TITLE;
        }
        updateDisplayTitle();

        $scope.OverrideDeleteContract = function () {
            // can't delete contract if it has a tracker number
            if ($scope.contractData.HAS_TRACKER === "1") {
                $scope.C_DELETE_CONTRACT = false;
            }
        }

        $scope.refreshContractData = function (id, ptId) {
            objsetService.readContract($scope.contractData.DC_ID).then(function (data) {
                $scope.contractData = $scope.initContract(data);
                $scope.contractData.CUST_ACCNT_DIV_UI = "";

                // if the current strategy was changed, update it
                if (id != undefined && $scope.curPricingStrategyId === id) {
                    $scope.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, id);
                    if (id != undefined && $scope.curPricingTableId === ptId && !!$scope.curPricingStrategy) {
                        $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, ptId);
                    }
                }

                $scope.OverrideDeleteContract();

                $scope.$broadcast("refreshContractDataComplete");


                $timeout(function () {
                    $scope.$apply();
                });

                if ($scope.forceNavigation && $scope.isTenderContract) {
                    if (($scope.actualClikedTabName == "MC" || $scope.actualClikedTabName == "PD") && $scope.curPricingStrategy.PASSED_VALIDATION == "Complete") {
                        if ($scope.isMCForceRunReq() && !$scope.inCompleteCapMissing) {
                            $scope.gotoMCPage();
                        }
                        else {
                            $scope.gotoPDPage();
                        }
                    }
                    else if ($scope.curPricingStrategy.PASSED_VALIDATION != "Complete" && $scope.selectedTAB == "PTR") {
                        $scope.selectedTAB = "DE"; //Purpose: If No Error/Warning go to Deal Editor Automatically
                        $scope.currentTAB = "DE"; //Purpose: If No Error/Warning go to Deal Editor Automatically
                        $scope.resetDirty();
                        $scope.publishWipDealsFromTab();
                        $scope.setBusy("", "");
                    }

                    if ($scope.contractData.TENDER_PUBLISHED == "1") {
                        $scope.goToTenderDashboard();
                    }

                }

                });
        }

        $scope.gotoMCPage = function () {
            $scope.isPtr = false;
            $scope.selectedTAB = "MC"; //Purpose: If No Error/Warning go to Meet Comp Automatically
            $scope.currentTAB = "MC"; //Purpose: If No Error/Warning go to Meet Comp Automatically
            $scope.setBusy("", "");
            $scope.resetDirty();
        }

        $scope.gotoPDPage = function () {
            $scope.isPtr = false;
            $scope.setBusy("", "");
            $scope.selectedTAB = "PD"; //Purpose: If not InComplete send it for publishing deals
            $scope.currentTAB = "PD"; //Purpose: If not InComplete send it for publishing deals
            $scope.resetDirty();
            $scope.setBusy("", "");
            $scope.loadPublishGrid();
            $scope.forceNavigation = false;
        }

        $scope.goToPublished = function () {
            $scope.isPtr = false;
            $scope.setBusy("", "");
            if ($scope.actualClikedTabName == "PD") {
                $scope.gotoPDPage();
            }
            $scope.resetDirty();
        }

        $scope.setForceNavigationForMC = function () {
            $scope.forceNavigation = true;
        }

        $scope.deleteContract = function () {

            // TODO need to check if there are any tracker numbers
            if (!$scope.C_DELETE_CONTRACT) {
                kendo.alert("Unable to Delete a Contract that contains deals with tracker numbers.");
                return;
            }

            kendo.confirm("Are you sure that you want to delete this contract?").then(function () {
                $scope.$apply(function () {

                    $scope.setBusy("Deleting...", "Deleting the Contract");
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

                            // redirect if focused PT belongs to deleted PS
                            document.location.href = "/Dashboard#/portal";
                        },
                        function (result) {
                            logger.error("Could not delete Contract " + $scope.contractData.DC_ID, result, result.statusText);
                            $scope.setBusy("", "");
                        }
                    );
                });
            });

        }

        // Initialize current strategy and pricing table variables
        //
        $scope.curPricingStrategyId = 0;
        $scope.curPricingStrategy = {};
        $scope.curPricingTable = {};
        $scope.curPricingTableId = 0;
        $scope.spreadNeedsInitialization = true;

        // other variable definitions
        //
        $scope.uid = -100;
        $scope.isExistingContract = function () {
            return $scope.contractData.DC_ID > 0;
        }
        $scope.contractData.CUST_ACCNT_DIV_UI = "";
        // Contract detail page initializations
        if ($scope.isContractDetailsPage || ($scope.isTenderContract && isTender)) {
            var today = moment().format("l");

            // Set dates Max and Min Values for numeric text box
            // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
            $scope.contractData.MinYear = parseInt(moment().format("YYYY")) - 6;
            $scope.contractData.MaxYear = parseInt(moment("2099").format("YYYY"));

            // Set the initial Max and Min date, actual dates will be updated as per the selected customer
            $scope.contractData.MinDate = moment().subtract(6, "years").format("l");
            $scope.contractData.MaxDate = moment("2099").format("l");

            // If new contract... default customer to the last customer used on the dashboard
            if (!$scope.contractData.CUST_MBR_SID && !!$scope.defCust)
                $scope.contractData.CUST_MBR_SID = $scope.defCust;

            //$scope.contractData.CNTRCT_CUST_TYPE = $scope.contractData.CNTRCT_CUST_TYPE === "" ? 'Direct' : $scope.contractData.CNTRCT_CUST_TYPE;

            //$scope.contractData._behaviors.isReadOnly["CNTRCT_CUST_TYPE"] = !$scope.isNewContract;

            // Contract custom initializations and functions
            // Dummy attribute on the UI which will hold the array of customer divisions
            $scope.contractData.CUST_ACCNT_DIV_UI = !$scope.contractData["CUST_ACCNT_DIV"] ? "" : $scope.contractData["CUST_ACCNT_DIV"].split("/");

            $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
            $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = false;
            $scope.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = !$scope.isNewContract;

            // In case of existing contract back date reason and text is captured display them
            $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN !== "" && $scope.contractData.BACK_DATE_RSN !== undefined;
            $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = !$scope.contractData._behaviors.isRequired["BACK_DATE_RSN"];

            // By default set the CUST_ACCPT to pending(99) if new contract
            $scope.contractData.CUST_ACCPT = $scope.contractData.CUST_ACCPT === "" ? "Pending" : $scope.contractData.CUST_ACCPT;
            $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: ($scope.contractData.CUST_ACCPT === 'Pending');

            // TODO: Ideally undefined check should be removed, once we run the DBConst.tt and DealPropertyWrapper.tt we can remove this
            // Not running now I see many new Attributes added for VOL_TIER
            $scope.contractData["NO_END_DT"] = ($scope.contractData.NO_END_DT_RSN !== "" && $scope.contractData.NO_END_DT_RSN !== undefined);

            // Set customer acceptance rules
            var setCustAcceptanceRules = function (newValue) {
                $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: (newValue === 'Pending');
                $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = (newValue !== 'Pending') && (!hasUnSavedFiles && !hasFiles) && !$scope.isTenderContract;
                if ($scope.contractData.DC_ID < 0) $scope.contractData.C2A_DATA_C2A_ID = (newValue === 'Pending') ? "" : $scope.contractData.C2A_DATA_C2A_ID;
                $scope.contractData.IsAttachmentRequired = !$scope.isTenderContract && $scope.contractData.C2A_DATA_C2A_ID === "" && newValue !== 'Pending';
                $scope.contractData.AttachmentError = $scope.contractData.AttachmentError && $scope.contractData.IsAttachmentRequired;

                if (!$scope.isNewContract) {
                    $timeout(function () {
                        $(".radCustAccpt input[type=radio]").attr('disabled', true);
                    });
                }
            }

            // Contract name validation
            var isDuplicateContractTitle = function (title) {
                if (title === "") return;
                objsetService.isDuplicateContractTitle($scope.contractData.DC_ID, title).then(function (response) {
                    $scope.contractData._behaviors.isError['TITLE'] = response.data;
                    $scope.contractData._behaviors.validMsg['TITLE'] = "";
                    if (response.data) {
                        $scope.contractData._behaviors
                            .validMsg['TITLE'] = "This contract name already exists in another contract.";
                    }
                });
            }

            $scope.updateCorpDivision = function (custId) {
                if (custId === "" || custId == null) return;
                dataService.get("/api/Customers/GetMyCustomerDivsByCustNmSid/" + custId).then(function (response) {
                    // only show if more than 1 result
                    // TODO: This is a temp fix API is getting the 2002 and 2003 level records, fix the API
                    response.data = $filter('where')(response.data, { CUST_LVL_SID: 2003 });
                    //US860853
                    if (response.data[0].PRC_GRP_CD == '') { kendo.alert("Missing Price Group Code"); }
                    //US860853 END
                    if (response.data.length <= 1) {
                        $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                        $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                        //US2444394: commented out below because we no longer want to save Customer Account Division names if there is only one possible option
                        //if ($scope.contractData.CUST_ACCNT_DIV_UI !== undefined) $scope.contractData.CUST_ACCNT_DIV_UI = response.data[0].CUST_DIV_NM.toString();
                    } else {
                        $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = false;
                        $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false; // never required... blank now mean ALL
                    }
                    if (!!$("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect")) {
                        $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").dataSource.data(response.data);
                        $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").value($scope.contractData.CUST_ACCNT_DIV_UI);
                    }
                },
                    function (response) {
                        logger.error("Unable to get Customer Divisions.", response, response.statusText);
                    });
            }

            // Customer and Customer Div functions
            var initiateCustDivCombobox = function () {
                $scope.updateCorpDivision($scope.contractData.CUST_MBR_SID);
            }

            initiateCustDivCombobox();

            // Date Functions
            var validateDate = function (dateType) {
                $scope.contractData._behaviors.isError['START_DT'] =
                    $scope.contractData._behaviors.isError['END_DT'] = false;
                $scope.contractData._behaviors.validMsg['START_DT'] =
                    $scope.contractData._behaviors.validMsg['END_DT'] = "";

                var startDate = $scope.contractData.START_DT;
                var endDate = $scope.contractData.END_DT;

                if (dateType == 'START_DT') {
                    if (moment(startDate).isAfter(endDate) || moment(startDate).isBefore($scope.contractData.MinDate)) {
                        $scope.contractData._behaviors.isError['START_DT'] = true;
                        $scope.contractData._behaviors
                            .validMsg['START_DT'] = moment(startDate).isBefore($scope.contractData.MinDate)
                                ? "Start date cannot be less than - " + $scope.contractData.MinDate
                                : "Start date cannot be greater than End Date";
                    }
                } else {
                    if (moment(endDate).isBefore(startDate) || moment(endDate).isAfter($scope.contractData.MaxDate)) {
                        $scope.contractData._behaviors.isError['END_DT'] = true;
                        $scope.contractData._behaviors
                            .validMsg['END_DT'] = moment(endDate).isAfter($scope.contractData.MaxDate)
                                ? "End date cannot be greater than - " + $scope.contractData.MaxDate
                                : "End date cannot be less than Start Date";
                    }
                    if ($scope.existingMinEndDate !== "" && $scope.contractData.PRC_ST != null && $scope.contractData.PRC_ST.length != 0) {
                        if (moment(endDate).isBefore($scope.existingMinEndDate)) {
                            $scope.contractData._behaviors.isError['END_DT'] = true;
                            $scope.contractData._behaviors
                                .validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + $scope.existingMinEndDate + " - if you have already created pricing strategies. ";
                        }
                    }
                }
            }

            // Update start date and end date based on the quarter selection
            var updateDateByQuarter = function (qtrType, qtrValue, yearValue) {
                if (!qtrValue && !yearValue) return;

                var customerMemberSid = $scope.contractData.CUST_MBR_SID === "" ? null : $scope.contractData.CUST_MBR_SID;
                var quarterDetails = customerCalendarService.getCustomerCalendar(customerMemberSid, null, qtrValue, yearValue)
                    .then(function (response) {
                        if (qtrType == 'START_DATE') {
                            $scope.contractData.START_DT = moment(response.data.QTR_STRT).format('l');
                            validateDate('START_DT');
                            unWatchStartDate = true;
                        } else {
                            $scope.contractData.END_DT = moment(response.data.QTR_END).format('l');
                            validateDate('END_DT');
                            unWatchEndDate = true;
                        }
                    },
                        function (response) {
                            errInGettingDates(response);
                        });
            }

            var noEndDateChanged = function (noEndDate, updateEndDate) {

                $scope.contractData._behaviors.isReadOnly["END_DT"] = noEndDate;
                $scope.contractData._behaviors.isReadOnly["END_QTR"] = noEndDate;
                $scope.contractData._behaviors.isReadOnly["END_YR"] = noEndDate;
                $scope.contractData._behaviors.isHidden["NO_END_DT_RSN"] = !noEndDate;
                $scope.contractData._behaviors.isRequired["NO_END_DT_RSN"] = noEndDate;
                $scope.contractData.NO_END_DT_RSN = noEndDate ? $scope.contractData.NO_END_DT_RSN : "";
                if (!!$("#NO_END_DT_RSN").data("kendoDropDownList")) {
                    $("#NO_END_DT_RSN").data("kendoDropDownList").text($scope.contractData.NO_END_DT_RSN);
                }
                if (noEndDate && updateEndDate) {
                    $scope.contractData.END_DT = $scope.contractData.MaxDate;
                }
            }

            if (!$scope.initialEndDateReadOnly) {
                noEndDateChanged($scope.contractData.NO_END_DT, false);
            }

            var resetQtrYrDirty = function () {
                // When loading quarter and year from date user never makes changes to Quarter and Year we just load them
                $scope.contractData._behaviors.isDirty['START_QTR'] = $scope.contractData._behaviors
                    .isDirty['START_YR'] = false;
                $scope.contractData._behaviors.isDirty['END_QTR'] = $scope.contractData._behaviors
                    .isDirty['END_YR'] = false;
            }

            var updateQuarterByDates = function (dateType, value) {
                var customerMemberSid = $scope.contractData
                    .CUST_MBR_SID ==
                    ""
                    ? null
                    : $scope.contractData.CUST_MBR_SID;
                var qtrValue = isTender == true ? "4" : null;
                var yearValue = isTender == true ? new Date().getFullYear() : null;
                var quarterDetails = customerCalendarService.getCustomerCalendar(customerMemberSid, value, qtrValue, yearValue)
                    .then(function (response) {
                        if (moment(response.data.QTR_END) < moment(new Date())) {
                            response.data.QTR_END = moment(response.data.QTR_END).add(365, 'days').format('l');
                        }
                        $scope.contractData.MinDate = moment(response.data.MIN_STRT).format('l');
                        $scope.contractData.MaxDate = moment(response.data.MIN_END).format('l');
                        if (dateType == 'START_DT') {
                            $scope.contractData.START_QTR = response.data.QTR_NBR;
                            $scope.contractData.START_YR = response.data.YR_NBR;
                            validateDate('START_DT');
                            unWatchStartQuarter = true;
                        } else {
                            $scope.contractData.END_QTR = response.data.QTR_NBR;
                            $scope.contractData.END_YR = response.data.YR_NBR;
                            validateDate('END_DT');
                            unWatchEndQuarter = true;
                        }
                        $timeout(function () {
                            resetQtrYrDirty();
                        },
                            500);
                    },
                        function (response) {
                            errInGettingDates(response);
                        });
            }

            var getCurrentQuarterDetails = function () {
                var customerMemberSid = $scope.contractData.CUST_MBR_SID == "" ? null : $scope.contractData.CUST_MBR_SID;
                var isDate = isTender == true ? null : new Date();
                var qtrValue = isTender == true ? "4" : null;
                var yearValue = isTender == true ? new Date().getFullYear() : null;
                var quarterDetails = customerCalendarService.getCustomerCalendar(customerMemberSid, isDate, qtrValue, yearValue)
                    .then(function (response) {

                        if (moment(response.data.QTR_END) < moment(new Date())) {
                            response.data.QTR_END = moment(response.data.QTR_END).add(365, 'days').format('l');
                        }

                        $scope.contractData.MinDate = moment(response.data.MIN_STRT).format('l');
                        $scope.contractData.MaxDate = moment(response.data.MIN_END).format('l');
                        $scope.contractData.START_QTR = $scope.contractData.END_QTR = response.data.QTR_NBR;
                        $scope.contractData.START_YR = $scope.contractData.END_YR = response.data.YR_NBR;

                        $scope.contractData._behaviors.isError['START_DT'] =
                            $scope.contractData._behaviors.isError['END_DT'] = false;
                        $scope.contractData._behaviors.validMsg['START_DT'] =
                            $scope.contractData._behaviors.validMsg['END_DT'] = "";

                        // By default we dont want a contract to be backdated
                        $scope.contractData.START_DT = isTender == 1 ? moment().format('l') : moment(response.data.QTR_STRT).isBefore(today)
                            ? today
                            : moment(response.data.QTR_STRT).format('l');

                        $scope.contractData.END_DT = moment(response.data.QTR_END).format('l');


                        $timeout(function () {
                            resetQtrYrDirty();
                        }, 500);

                        // Unwatch all the dates, quarter and year, else they will go crazy
                        unWatchStartQuarter = unWatchEndQuarter = unWatchStartDate = unWatchEndDate = true;

                        $timeout(function () {
                            unWatchStartQuarter = unWatchEndQuarter = unWatchStartDate = unWatchEndDate = false;
                        }, 500);
                    },
                        function (response) {
                            errInGettingDates(response);
                        });
            }

            var errInGettingDates = function (response) {
                logger.error("Unable to get Customer Calendar Dates.", response, response.statusText);
            }

            var unWatchStartQuarter = false;
            var unWatchEndQuarter = false;
            var unWatchStartDate = false;
            var unWatchEndDate = false;

            var pastDateConfirm = function (newDate, oldDate) {
                if (moment(newDate).isBefore(today)) {
                    kendo.confirm($scope.constants.pastDateConfirmText).then(function () {
                        $timeout(function () {
                            $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = false;
                            $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = true;
                        },
                            100);
                    },
                        function () {
                            $timeout(function () {
                                // If the old value is also past date its infinite confirmation loop, hence add todays date on cancellation
                                $scope.contractData.START_DT = (moment(oldDate).isBefore(today)) ? today : oldDate;
                            },
                                100);
                        });
                } else {
                    $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
                    $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
                    $scope.contractData.BACK_DATE_RSN = "";
                }
            }

            $scope.isCopyContract = false;
            $scope.copyContractData = null;
            if ($location.url().split('copycid=').length > 1) {
                $scope.isCopyContract = true;

                // Copy contract properties from source contract
                $scope.copyContractData = copyContractData.data[0];
                $scope.contractData.TITLE = $scope.copyContractData.TITLE + ' (copy)';
                $scope.contractData.CUST_MBR_SID = $scope.copyContractData.CUST_MBR_SID;
                $scope.contractData.START_DT = moment($scope.copyContractData.START_DT).format('l');
                $scope.contractData.START_QTR = $scope.copyContractData.START_QTR;
                $scope.contractData.START_YR = $scope.copyContractData.START_YR;
                $scope.contractData.END_DT = moment($scope.copyContractData.END_DT).format('l');
                $scope.contractData.END_QTR = $scope.copyContractData.END_QTR;
                $scope.contractData.END_YR = $scope.copyContractData.END_YR;
                $scope.contractData.CUST_ACCNT_DIV = $scope.copyContractData.CUST_ACCNT_DIV;
                $scope.contractData.IS_TENDER = $scope.copyContractData.IS_TENDER;
                $scope.contractData.CUST_ACCNT_DIV_UI = !$scope.contractData["CUST_ACCNT_DIV"] ? "" : $scope.contractData["CUST_ACCNT_DIV"].split('/');
                $scope.updateCorpDivision($scope.copyContractData.CUST_MBR_SID);

                // Check for Backdate Reason
                pastDateConfirm($scope.contractData.START_DT, $scope.contractData.START_DT);
            }

            if ($scope.contractData.DC_ID <= 0 && $scope.isCopyContract === false) {
                getCurrentQuarterDetails();
            } else {
                if (moment($scope.contractData.END_DT) > moment('2099/12/31').add(0, 'years')) {
                    $scope.contractData.END_DT = moment('2099/12/31').format("MM/DD/YYYY"); 
                }
                updateQuarterByDates('START_DT', $scope.contractData.START_DT);
                updateQuarterByDates('END_DT', $scope.contractData.END_DT);
            }

            $timeout(function () {
                !$scope.isNewContract
                    ? $scope.status = { 'isOpen': true }
                    : setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
            }, 300);

            $timeout(function () {
                if ($scope.contractData.DC_ID > 0) {
                    $(".radCustAccpt input[type=radio]").attr('disabled', true);
                }
            });
        }

        // File save methods and variable
        var hasUnSavedFiles = false;
        var hasFiles = false;

        $scope.fileUploadOptions = { saveUrl: '/FileAttachments/Save', autoUpload: false };

        $scope.filePostAddParams = function (e) {
            uploadSuccessCount = 0;
            uploadErrorCount = 0;
            e.data = {
                custMbrSid: $scope.contractData.CUST_MBR_SID,
                objSid: $scope.contractData.DC_ID, // Contract
                objTypeSid: 1
            }
        };

        $scope.OverrideDeleteContract();

        $scope.$on('busy', function (event, title, message) {
            $scope.setBusy(title, message);
        });

        $scope.$on("kendoRendered",
            function (e) {
                applyQuarters("StartSlider");
                applyQuarters("EndSlider");
            });

        function applyQuarters(id) {
            var slider = $("#" + id + " .k-slider");
            if (slider.length <= 0) return;

            var sliderItems = slider.find(".k-slider-items");
            var steps = {};
            steps[0] = "Q1";
            steps[1] = "Q2";
            steps[2] = "Q3";
            steps[3] = "Q4";

            $.each(steps,
                function (index, value) {
                    var item = sliderItems.find("li:eq(" + (index) + ")");
                    item.attr("title", value);
                    item.find("span").text(value);
                });
        }

        $scope.filterDealTypes = function (items) {
            var result = {};
            angular.forEach(items, function (value, key) {
                if (value.name !== 'ALL_TYPES' && value.name !== 'TENDER') {
                    if ($scope.isTenderContract) {
                        if (['ECAP', 'KIT'].indexOf(value.name) >= 0) result[key] = value;
                    } else {
                        result[key] = value;
                    }
                }
            });
            return result;
        }

        $scope.onFileSelect = function (e) {
            // Hide default kendo upload and clear buttons as contract is not generated at this point. Upload files after contract id is generated.
            // TODO: Do we want to show them in edit scenario ?
            $timeout(function () {
                $(".k-clear-selected").hide();
                $(".k-upload-selected").hide();
            });

            $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = $scope.contractData._behaviors.isError["C2A_DATA_C2A_ID"] = false;
            if ($scope.contractData.DC_ID < 0) $scope.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
            hasUnSavedFiles = true;
            $scope.contractData.AttachmentError = false;
        }

        $scope.onFileRemove = function (e) {
            var numberOfFiles = $("#fileUploader").data("kendoUpload").getFiles().length;
            if (numberOfFiles <= 1 && !$scope.isTenderContract) {
                $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = true;
                hasUnSavedFiles = false;
            }
        }

        var uploadSuccessCount = 0;
        $scope.onSuccess = function (e) {
            uploadSuccessCount++;
        }

        var uploadErrorCount = 0;
        $scope.onError = function (e) {
            uploadErrorCount++;
        }

        $scope.onComplete = function (e) {
            if (uploadSuccessCount > 0) {
                logger.success("Successfully uploaded " + uploadSuccessCount + " attachment(s).", null, "Upload successful");
            }
            if (uploadErrorCount > 0) {
                logger.error("Unable to upload " + uploadErrorCount + " attachment(s).", null, "Upload failed");
            }

            $timeout(function () {
                $scope._dirty = false; // don't want to kick of listeners
                $state.go('contract.manager', { cid: $scope.contractData.DC_ID });
            });
        }

        $scope.uploadFile = function (e) {
            $(".k-upload-selected").click();
        }

        $scope.attachmentCount = 1; // Can't be 0 or initialization won't happen.
        $scope.initComplete = false;

        var attachmentsDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    if (!$scope.isNewContract) {
                        $scope.optionCallback = e;
                        // TODO: Read only when hasFiles is true
                        dataService.get("/api/FileAttachments/Get/" +
                            $scope.contractData.CUST_MBR_SID +
                            "/" +
                            1 +
                            "/" +
                            $scope.contractData.DC_ID +
                            "/CNTRCT")
                            .then(function (response) {
                                e.success(response.data);
                                $scope.attachmentCount = response.data.length;
                                $scope.initComplete = true;
                                hasFiles = response.data.length > 0;
                                setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
                            },
                                function (response) {
                                    logger.error("Unable to retrieve attachments.", response, response.statusText);
                                    $scope.attachmentCount = -1; // Causes the 'Failed to retrieve attachments!' message to be displayed.
                                    $scope.initComplete = true;
                                    hasFiles = false;
                                });
                    }
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "ATTCH_SID",
                    fields: {
                        ATTCH_SID: { editable: false, nullable: true },
                        FILE_NM: { validation: { required: false }, editable: false },
                        CHG_EMP_WWID: { validation: { required: false }, editable: false },
                        CHG_DTM: { validation: { required: false }, editable: false },
                    }
                }
            },
        });

        $scope.deleteAttachmentActions = [
            {
                text: 'Cancel',
                action: function () { }
            },
            {
                text: 'Yes, Delete',
                primary: true,
                action: function () {
                    dataService.post("/api/FileAttachments/Delete/" + deleteAttachmentParams.custMbrSid + "/" + deleteAttachmentParams.objTypeSid + "/" + deleteAttachmentParams.objSid + "/" + deleteAttachmentParams.fileDataSid + "/CNTRCT")
                        .then(function (response) {
                            logger.success("Successfully deleted attachment.", null, "Delete successful");

                            // Refresh the Existing Attachments grid to reflect the newly deleted attachment.
                            $scope.fileAttachmentGridOptions.dataSource.transport.read($scope.optionCallback);
                        },
                            function (response) {
                                logger.error("Unable to delete attachment.", null, "Delete failed");

                                // Refresh the Existing Attachments grid.  There should be no changes, but just incase.
                                $scope.fileAttachmentGridOptions.dataSource.transport.read($scope.optionCallback);
                            });
                }
            }
        ];

        var deleteAttachmentParams;
        $scope.deleteAttachment = function (custMbrSid, objTypeSid, objSid, fileDataSid) {
            deleteAttachmentParams = { custMbrSid: custMbrSid, objTypeSid: objTypeSid, objSid: objSid, fileDataSid: fileDataSid };
            $("#deleteAttachmentDialog").data("kendoDialog").open();
        }

        $scope.fileAttachmentGridOptions = {
            dataSource: attachmentsDataSource,
            filterable: false,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: false,
            editable: { mode: "inline", confirmation: false },
            columns: [
                {
                    field: "ATTCH_SID",
                    title: "ID",
                    hidden: true
                },
                {
                    field: "FILE_DATA_SID",
                    title: "&nbsp;",
                    template: "<a class='delete-attach-icon' ng-if='C_DELETE_ATTACHMENTS' ng-click='deleteAttachment(#= CUST_MBR_SID #, #= OBJ_TYPE_SID #, #= OBJ_SID #, #= FILE_DATA_SID #)'><i class='intelicon-trash-outlined' title='Click to delete this attachment'></i></a>",
                    width: "10%"
                },
                {
                    field: "FILE_NM",
                    title: "File Name",
                    //IE doesn't support download tag on anchor, added target='_blank' as a work around
                    template: "<a download target='_blank' href='/api/FileAttachments/Open/#: FILE_DATA_SID #/'>#: FILE_NM #</a>",
                    width: "40%"
                },
                {
                    field: "CHG_EMP_WWID",
                    title: "Added By",
                    width: "25%"
                },
                {
                    field: "CHG_DTM",
                    title: "Date Added",
                    type: "date",
                    template: "#= kendo.toString(new Date(gridUtils.stripMilliseconds(CHG_DTM)), 'M/d/yyyy') #",
                    width: "25%"
                }
            ]
        };

        // Don't let the user leave unless the data is saved
        //
        $scope._dirty = false;
        $scope._dirtyContractOnly = false;
        $scope.resetDirty = function () {
            $scope._dirty = false;
            $scope._dirtyContractOnly = false;
        }
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            // EXITING RIGHT AWAY... PUPOSELY NOT WARNING USERS IF THE DATA CHANGED.  USERS ARE GETTING FLUSTERED WITH THIS FEATURE.
            // LEAVING IT HERE IN CASE WE HAVE TO BRING IT BACK
            return;

            // if Pricing Strategy or Pricing Table was being edited, save it

            var saveStates = ["contract.manager.strategy", "contract.manager.strategy.wip", "contract.details"];
            if (!$scope.switchingTabs && (saveStates.indexOf(fromState.name) >= 0) && $scope._dirty && !$scope.isAutoSaving) {
                $scope.isAutoSaving = true;

                if (confirm('Would you like to save your changes?')) {
                    event.preventDefault();
                    // async save data
                    $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);

                    $scope.saveEntireContractRoot(fromState.name, false, false, toState.name, toParams);
                }

                //var modalOptions = {
                //    closeButtonText: 'Leave Anyway',
                //    actionButtonText: 'Save',
                //    hasActionButton: true,
                //    headerText: 'Unsaved Data',
                //    bodyText: 'Would you like to save your changes?'
                //};

                //confirmationModal.showModal({}, modalOptions).then(function (result) {
                //            event.preventDefault();
                //            // async save data
                //            $scope.saveEntireContractBase(fromState.name, false, false, toState.name, toParams);
                //}, function (response) {
                //});

                //$confirm({ text: 'Would you like to save your changes?', title: 'Unsaved Data', ok: 'Save', cancel: 'Leave Anyway' })
                //    .then(function () {
                //        event.preventDefault();
                //        // async save data
                //        $scope.saveEntireContractBase(fromState.name, false, false, toState.name, toParams);
                //    });
                //if (confirm("Would you like to save your changes?")) {
                //    event.preventDefault();
                //    // async save data
                //    $scope.saveEntireContractBase(fromState.name, false, false, toState.name, toParams);
                //} else {
                //    $scope._dirty = false;
                //}
            }
        });

        var delayStartFunction;
        var delayEndDateFunction;
        var isValidDate = function (type, oldDate, newDate) {
            var isValid = true;
            if (moment(newDate, "l", true).isValid()) {
                if ($scope.contractData._behaviors.validMsg[type] == "Invalid date.") {
                    $scope.contractData._behaviors.isError[type] = false;
                    $scope.contractData._behaviors.validMsg[type] = "";
                }
                isValid = true;
            } else {
                isValid = false;
                $scope.contractData._behaviors.isError[type] = true;
                $scope.contractData._behaviors.validMsg[type] = "Invalid date."
            }
            return isValid;
        }

        // Watch for any changes to contract data to set a dirty bit
        //
        $scope.$watch('contractData', function (newValue, oldValue, el) {
            if (oldValue === newValue || $scope.stealthMode) return;

            if (oldValue["CUST_MBR_SID"] != newValue["CUST_MBR_SID"]) {
                $scope.contractData.CUST_ACCNT_DIV_UI = "";
                $scope.updateCorpDivision(newValue["CUST_MBR_SID"]);
                $scope.contractData.NO_END_DT = false;
                if (!$scope.initialEndDateReadOnly) {
                    noEndDateChanged($scope.contractData.NO_END_DT, false);
                }
                getCurrentQuarterDetails();
            }

            if (oldValue["CUST_ACCNT_DIV_UI"].toString() !== newValue["CUST_ACCNT_DIV_UI"].toString()) {
                $timeout(function () {
                    $scope.contractData.CUST_ACCNT_DIV = newValue["CUST_ACCNT_DIV_UI"].toString().replace(/,/g, '/');
                }, 1);
            }

            if (oldValue["START_QTR"] !== newValue["START_QTR"] || oldValue["START_YR"] !== newValue["START_YR"]) {
                if (!unWatchStartQuarter) {
                    if (delayStartFunction) $timeout.cancel(delayStartFunction);
                    delayStartFunction = $timeout(function () {
                        updateDateByQuarter('START_DATE', newValue["START_QTR"], newValue["START_YR"]);
                    }, 500);
                }
                unWatchStartQuarter = false;
            }

            if (oldValue["END_QTR"] !== newValue["END_QTR"] || oldValue["END_YR"] !== newValue["END_YR"]) {
                if (!unWatchEndQuarter) {
                    if (delayEndDateFunction) $timeout.cancel(delayEndDateFunction);
                    delayEndDateFunction = $timeout(function () {
                        updateDateByQuarter('END_DATE', newValue["END_QTR"], newValue["END_YR"]);
                    },
                        500);
                }
                unWatchEndQuarter = false;
            }

            if (oldValue["START_DT"] !== newValue["START_DT"]) {
                if (moment(oldValue["START_DT"]).format('l') === moment(newValue["START_DT"]).format('l')) return;
                if (isValidDate('START_DT', oldValue["START_DT"], newValue["START_DT"])) {
                    if ($scope.isContractDetailsPage || ($scope.isTenderContract && isTender)) {
                        pastDateConfirm(newValue["START_DT"], oldValue["START_DT"]);
                        if (!unWatchStartDate) {
                            updateQuarterByDates('START_DT', newValue["START_DT"]);
                        }
                    }
                }
                unWatchStartDate = false;
            }

            if (oldValue["END_DT"] !== newValue["END_DT"]) {
                if (moment(oldValue["END_DT"]).format('l') === moment(newValue["END_DT"]).format('l')) return;
                if (isValidDate('END_DT', oldValue["END_DT"], newValue["END_DT"])) {
                    if ($scope.isContractDetailsPage || ($scope.isTenderContract && isTender)) {
                        if (!unWatchEndDate) {
                            updateQuarterByDates('END_DT', newValue["END_DT"]);
                        }
                    }
                }
                unWatchEndDate = false;
            }

            if (oldValue["TITLE"] !== newValue["TITLE"]) {
                updateDisplayTitle();
                isDuplicateContractTitle(newValue["TITLE"]);
            }

            if (oldValue["CUST_ACCPT"] !== newValue["CUST_ACCPT"]) {
                if (!!setCustAcceptanceRules) setCustAcceptanceRules(newValue["CUST_ACCPT"]);
            }

            if (oldValue["C2A_DATA_C2A_ID"] !== newValue["C2A_DATA_C2A_ID"]) {
                $scope.contractData.IsAttachmentRequired = (newValue["C2A_DATA_C2A_ID"] === ""
                    && $scope.contractData.CUST_ACCPT !== 'Pending');
                $scope.contractData.AttachmentError = ($scope.contractData.CUST_ACCPT !== 'Pending') &&
                    $scope.contractData.IsAttachmentRequired &&
                    (!hasUnSavedFiles && !hasFiles);
            }

            if (oldValue["NO_END_DT"] !== newValue["NO_END_DT"]) {
                noEndDateChanged(newValue["NO_END_DT"], true);
            }

            if ($scope.keyContractItemchanged(oldValue, newValue)) {
                el._dirty = true;
                el._dirtyContractOnly = true;
            }
        }, true);

        $scope.keyContractItemchanged = function (oldValue, newValue) {
            function purgeBehaviors(lData) {
                var remItems = [
                    "IsAttachmentRequired", "MinYear", "MaxYear", "END_QTR", "END_YR", "START_QTR", "START_YR",
                    "AttachmentError", "displayTitle", "CUST_ACCNT_DIV_UI", "PASSED_VALIDATION"
                ];
                var remItemsIfNoId = ["C2A_DATA_C2A_ID"];

                lData._behaviors = {};
                lData._actions = {};
                lData._settings = {};
                lData.infoMessages = [];
                lData.warningMessages = [];
                lData._dirty = {};

                for (var d = 0; d < remItems.length; d++) {
                    lData[remItems[d]] = "";
                }
                if ($scope.contractData.DC_ID < 0) {
                    for (var d = 0; d < remItemsIfNoId.length; d++) {
                        lData[remItemsIfNoId[d]] = "";
                    }
                }

                if (!!lData.PRC_ST) {
                    for (var s = 0; s < lData.PRC_ST.length; s++) {
                        var item = lData.PRC_ST[s];
                        item._behaviors = {};
                        item._actions = {};
                        item._settings = {};
                        item.infoMessages = [];
                        item.warningMessages = [];
                        item.PASSED_VALIDATION = "";

                        if (!!item.PRC_TBL) {
                            for (var t = 0; t < item.PRC_TBL.length; t++) {
                                item.PRC_TBL[t]._behaviors = {};
                                item.PRC_TBL[t]._behaviors = {};
                                item.PRC_TBL[t]._actions = {};
                                item.PRC_TBL[t]._settings = {};
                                item.PRC_TBL[t].infoMessages = [];
                                item.PRC_TBL[t].warningMessages = [];
                                item.PRC_TBL[t].PASSED_VALIDATION = "";
                            }
                        }
                    }
                }
                var str = kendo.stringify(lData).replace(',"undefined":[]', '');
                for (var d = 0; d < remItems.length; d++) {
                    var find = ',"' + remItems[d] + '":""';
                    var regex = new RegExp(find, "g");
                    str = str.replace(regex, "");
                }

                return str;
            }

            var rtn = purgeBehaviors(util.deepClone(oldValue)) !== purgeBehaviors(util.deepClone(newValue));
            //if (rtn) debugger;
            return rtn;
        }

        // **** LEFT NAVIGATION Methods ****
        //
        $scope.isLnavHidden = !$scope.isExistingContract();
        $scope.toggleLnav = function () {
            $scope.isLnavHidden = !$scope.isLnavHidden;
            $(window).trigger('resize');
            $scope.resizeEvent();
        }
        $scope.refreshEvent = function () {
            //debugger;
        }
        $scope.resizeEvent = function () {
            $timeout(function () {
                var evt = $window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 200);
                evt.initUIEvent('resize', true, false, window, 200);
                window.dispatchEvent(evt);
                $timeout(function () {
                    var splitter = $("#k-splitter").data("kendoSplitter");
                    if (splitter !== undefined && splitter !== null) splitter.resize();
                }, 10);
            });
        }
        $scope.strategyTreeCollapseAll = true;
        $scope.toggleStrategyTree = function () {
            var container = angular.element(".lnavStrategyContainer");
            while (container.length !== 0) {
                //isCollapsed is only defined in the ng-repeat's local scope, so we need to iterate through them here
                container.scope().isCollapsed = $scope.strategyTreeCollapseAll;
                container = container.next();
            }
            $scope.strategyTreeCollapseAll = !$scope.strategyTreeCollapseAll;
        }

        // **** MINI NAV ICON Methods ****
        //
        $scope.isSearchHidden = true;
        $scope.isSummaryHidden = true;

        $scope.isAddPricingTableHidden = true;
        $scope.toggleSearch = function () {
            $scope.isSearchHidden = !$scope.isSearchHidden;
            $scope.isAddStrategyHidden = true;
            $scope.isAddStrategyBtnHidden = false;
            $scope.isAddPricingTableHidden = true;
        }

        $scope.gotoContractEditor = function (ps, pt) {
            $scope.isPtr = false;
            $scope.isWip = false;

            if (pt === undefined && ps.PRC_TBL !== undefined && ps.PRC_TBL.length > 0) {
                // let's see if there are any pts... if so, grab the first one
                if (ps.PRC_TBL.length === 1) {
                    pt = ps.PRC_TBL[0];
                } else {
                    var pts = ps.PRC_TBL;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'selectPricingTableModal',
                        controller: 'selectPricingTableModalCtrl',
                        controllerAs: '$ctrl',
                        size: 'md',
                        resolve: {
                            pts: function () {
                                return pts;
                            }
                        }
                    });

                    modalInstance.result.then(function (retPt) {
                        if (retPt === undefined) return;
                        $scope.gotoContractEditor(ps, retPt);
                        return;
                    }, function () { });

                    return;
                }
            }

            if (!pt) {
                $state.go('contract.manager',
                    {
                        cid: ps.DC_PARENT_ID
                    }, { reload: true });
            }

            if (!!pt) {
                $state.go('contract.manager.strategy',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID,
                        pid: pt.DC_ID
                    }, { reload: true });
            } else {
                $state.go('contract.manager.strategy',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID
                    }, { reload: true });
            }
        }


        $scope.showAddPricingTable = function (ps) {

            // if its hybrid PS and already contains a PS do not allow to create one mor pricing table.
            if (ps.IS_HYBRID_PRC_STRAT !== undefined && ps.IS_HYBRID_PRC_STRAT == "1" && ps.PRC_TBL != undefined && ps.PRC_TBL.length > 0) {
                kendo.alert("You can add only one pricing table within a hybrid pricing strategy");
                return;
            }
            $scope.isAddPricingTableHidden = false;
            $scope.isAddStrategyHidden = true;
            $scope.isAddStrategyBtnHidden = true;
            $scope.isSearchHidden = true;
            $scope.clearNptTemplate();
            $scope.curPricingStrategy = ps;
            if (!!$scope.curPricingStrategy && !$scope.curPricingStrategy.PRC_TBL) {
                // default Pricing Table title to Pricing Strategy title
                $scope.newPricingTable.TITLE = $scope.curPricingStrategy.TITLE;
            } else {
                // look for the title in existing titles
                var defTitle = $scope.curPricingStrategy.TITLE;
                for (var t = 0; t < $scope.curPricingStrategy.PRC_TBL.length; t++) {
                    if ($scope.curPricingStrategy.PRC_TBL[t].TITLE === defTitle) {
                        defTitle = "";
                    }
                }
                $scope.newPricingTable.TITLE = defTitle;
            }
        }
        $scope.showEditPricingTableDefaults = function (pt) {
            openAutofillModal(pt);
        }
        $scope.addByECAPTracker = function () {
            if ($scope.spreadDs !== undefined && $scope.curPricingTable.OBJ_SET_TYPE_CD === 'PROGRAM') {

                // Check if row count is over the number of rows we allow
                if ($scope.spreadDs._data.length >= ($scope.ptRowCount - 1)) {
                    alert("Cannot insert a new row. You already have the maximum number of rows allowed in one " + $scope.ptTitle + ". Please make a new " + $scope.ptTitle + " or delete some existing rows the current " + $scope.ptTitle + ".");
                    return;
                }

                var modal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'ecapAutoFillTrackerModal',
                    controller: 'EcapTrackerAutoFillModalCtrl',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        custId: function () {
                            return $scope.contractData.CUST_MBR_SID;
                        }
                    }
                });

                // TODO: get the SP information for the new row
                modal.result.then(
                    function (newRow) {
                        newRow["CUST_ACCNT_DIV"] = $scope.contractData.CUST_ACCNT_DIV;
                        newRow["CUST_MBR_SID"] = $scope.contractData.CUST_MBR_SID;

                        $scope.$broadcast('addRowByTrackerNumber', newRow);
                    },
                    function () {
                        // Do Nothing on cancel
                    }
                );
            }
        }
        $scope.hideAddPricingTable = function () {
            $scope.isAddPricingTableHidden = true;
            $scope.isAddStrategyHidden = true;
            $scope.isAddStrategyBtnHidden = false;
            $scope.isSearchHidden = true;
            $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.ECAP);
            $scope.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type
            $scope.clearPtTemplateIcons();
            // $scope.curPricingStrategy = {}; //clears curPricingStrategy
        }

        // **** PRICING STRATEGY Methods ****
        //
        $scope.isAddStrategyHidden = true;
        $scope.isAddStrategyBtnHidden = false;
        $scope.toggleAddStrategy = function () {
            $scope.isAddStrategyHidden = !$scope.isAddStrategyHidden;
            $scope.isAddStrategyBtnHidden = !$scope.isAddStrategyHidden;
            $scope.isSearchHidden = true;
            $scope.isAddPricingTableHidden = true;
        }
        $scope.addStrategyDisabled = false;

        if (!$scope.contractData.PRC_ST) {
            $scope.toggleAddStrategy();
            $timeout(function () {
                var inpt = $("#inptPrcTitle");
                if (inpt.length > 0 && inpt.position() !== undefined) {
                    var t = inpt.position().top + inpt.height() + 4;
                    $("#divHelpAddPs").css({
                        display: "inline"
                    });
                    $("#divHelpAddPs").animate({
                        opacity: 1,
                        top: t
                    }, 2000, function () {
                        $("#navIconAddPs").animate({
                            backgroundColor: "#f3D54E"
                        }, 500, function () {
                            $("#navIconAddPs").animate({
                                backgroundColor: "#0071C5"
                            }, 2000, function () {
                                $("#inptPrcTitle").animate({
                                    backgroundColor: "#f3D54E"
                                }, 500, function () {
                                    $("#inptPrcTitle").animate({
                                        backgroundColor: "#ffffff"
                                    }, 2000);
                                });
                            });
                        });
                        $timeout(function () {
                            $("#divHelpAddPs").animate({
                                opacity: 0
                            }, 2000, function () {
                                $("#divHelpAddPs").css({
                                    display: "none"
                                });
                            });
                        }, 6000);
                    });
                }
            }, 2000);
        }

        function getTenderBasedDefaults() {
            var data = $scope.newPricingTable["_defaultAtrbs"];

            if ($scope.isTenderContract) {
                data["REBATE_TYPE"].opLookupUrl = data["REBATE_TYPE"].opLookupUrl
                    .replace("GetDropdowns/REBATE_TYPE", "GetFilteredRebateTypes/true");
            } else {
                data["REBATE_TYPE"].opLookupUrl = data["REBATE_TYPE"].opLookupUrl
                    .replace("GetDropdowns/REBATE_TYPE", "GetFilteredRebateTypes/false");
            }

            return data;
        }

        // **** AUTODILL DEFAULTS Methods ****
        //
        function openAutofillModal(pt) {

            if (pt != null) {
                $scope.setNptTemplate(pt);
                //if pt not null, need to also update the nPT default atrb values
                updateNPTDefaultValues(pt);
            }

            $scope.isVistexHybrid = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined ? $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT : "0";
            if (contractData != null
                && contractData.data[0].Customer.VISTEX_CUST_FLAG != null && contractData.data[0].Customer.VISTEX_CUST_FLAG != undefined
                && contractData.data[0].Customer.VISTEX_CUST_FLAG != '') {
                $scope.isVistex = contractData.data[0].Customer.VISTEX_CUST_FLAG;
            }
            var autofillData = {
                'ISTENDER': $scope.isTenderContract,
                'isVistexHybrid': $scope.isVistexHybrid,
                'DEALTYPE': $scope.newPricingTable["OBJ_SET_TYPE_CD"],
                'EXTRA': $scope.newPricingTable["_extraAtrbs"],             //may not be needed, extras are a one time set thing such as num tiers that we may choose to keep in the LNAV
                'DEFAULT': getTenderBasedDefaults(),
                'ISVISTEX': $scope.isVistex
            }

            var autofillModal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'app/contract/autofillSettings/autofillSettings.html',
                controller: 'AutofillSettingsController',
                controllerAs: 'vm',
                windowClass: 'autofill-modal-window',
                size: 'lg',
                resolve: {
                    autofillData: autofillData
                }
            });

            autofillModal.result.then(
                function (autofills) {
                    $scope.newPricingTable["_defaultAtrbs"] = autofills;

                    if (pt != null) { //pt is null when not yet created
                        //need to trigger a save if it is an existing pricing table, otherwise it will save when user clicks add
                        $scope.customEditPtValidate();
                    } else {
                        $scope.customAddPtValidate();
                    }
                },
                function (type) {
                    var title = $scope.newPricingTable["TITLE"];    //preserve user title, if any
                    $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL[type]);
                    $scope.newPricingTable["TITLE"] = title;
                    $scope.clearPtTemplateIcons();
                });
        }

        function updateNPTDefaultValues(pt) {
            var nptDefaults = $scope.newPricingTable["_defaultAtrbs"];

            //note: copy pasted from the watch function far below, slight modifications, can probably be compressed to 1 function call for re-usability?
            if (!!nptDefaults["REBATE_TYPE"]) nptDefaults["REBATE_TYPE"].value = pt["REBATE_TYPE"];
            if (!!nptDefaults[MRKT_SEG]) nptDefaults[MRKT_SEG].value = pt[MRKT_SEG].split(',');
            if (!!nptDefaults[GEO]) {
                if (pt[GEO].indexOf('[') > -1) {
                    nptDefaults[GEO].value = pt[GEO];
                } else {
                    nptDefaults[GEO].value = pt[GEO].split(',');
                }
            }
            if (!!nptDefaults["PAYOUT_BASED_ON"]) nptDefaults["PAYOUT_BASED_ON"].value = pt["PAYOUT_BASED_ON"];
            if (!!nptDefaults["PROGRAM_PAYMENT"]) nptDefaults["PROGRAM_PAYMENT"].value = pt["PROGRAM_PAYMENT"];
            if (!!nptDefaults["PROD_INCLDS"]) nptDefaults["PROD_INCLDS"].value = pt["PROD_INCLDS"];
            if (!!nptDefaults["NUM_OF_TIERS"]) nptDefaults["NUM_OF_TIERS"].value = pt["NUM_OF_TIERS"];
            if (!!nptDefaults["NUM_OF_DENSITY"]) nptDefaults["NUM_OF_DENSITY"].value = pt["NUM_OF_DENSITY"];
            if (!!nptDefaults["SERVER_DEAL_TYPE"]) nptDefaults["SERVER_DEAL_TYPE"].value = pt["SERVER_DEAL_TYPE"];
            if (!!nptDefaults["PERIOD_PROFILE"]) nptDefaults["PERIOD_PROFILE"].value = pt["PERIOD_PROFILE"];
            if (!!nptDefaults["AR_SETTLEMENT_LVL"]) nptDefaults["AR_SETTLEMENT_LVL"].value = pt["AR_SETTLEMENT_LVL"];
            if (!!nptDefaults["REBATE_OA_MAX_VOL"]) nptDefaults["REBATE_OA_MAX_VOL"].value = pt["REBATE_OA_MAX_VOL"];
            if (!!nptDefaults["REBATE_OA_MAX_AMT"]) nptDefaults["REBATE_OA_MAX_AMT"].value = pt["REBATE_OA_MAX_AMT"];
            if (!!nptDefaults["FLEX_ROW_TYPE"]) nptDefaults["FLEX_ROW_TYPE"].value = pt["FLEX_ROW_TYPE"];
            //not sure if necessary, javascript pass by value/reference always throwing me off. :(
            $scope.newPricingTable["_defaultAtrbs"] = nptDefaults;
        }

        // **** PRICING TABLE Methods ****
        //
        $scope.addTableDisabled = false;
        $scope.addCustomToTemplates = function () {
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    value._custom = {
                        "ltr": value.name[0],
                        "_active": false
                    };
                });
        }
        $scope.clearPtTemplateIcons = function () {
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    value._custom._active = false;
                });
        }
        $scope.selectPtTemplateIcon = function (ptTmplt) {
            $scope.clearPtTemplateIcons();
            ptTmplt._custom._active = true;
            var title = $scope.newPricingTable["TITLE"];    //preserve, if any
            $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL[ptTmplt.name]);
            $scope.newPricingTable["TITLE"] = title;
            $scope.newPricingTable["OBJ_SET_TYPE_CD"] = ptTmplt.name;
            $scope.newPricingTable["_extraAtrbs"] = ptTmplt.extraAtrbs;
            $scope.newPricingTable["_defaultAtrbs"] = ptTmplt.defaultAtrbs;

            if (ptTmplt.name !== "" && !!$scope.newPricingTable._behaviors && !!$scope.newPricingTable._behaviors.isError) {
                $scope.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = false;
                $scope.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "";
            }
            if (!$scope.isTenderContract)
                openAutofillModal(null);
        }
        $scope.setNptTemplate = function (pt) {
            $scope.currentPricingTable = pt;
            var ptTemplate = $scope.templates.ModelTemplates.PRC_TBL[pt.OBJ_SET_TYPE_CD];
            //$scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.ECAP); //TODO: replace with existing/current rather than new...? -> clone curPT rather than template? - keep it same as "new" pricing table and copy it over later, todo rename "new"pt variable
            $scope.newPricingTable = util.clone(pt);
            $scope.newPricingTable["OBJ_SET_TYPE_CD"] = pt.OBJ_SET_TYPE_CD;
            $scope.newPricingTable["_extraAtrbs"] = ptTemplate.extraAtrbs;
            $scope.newPricingTable["_defaultAtrbs"] = ptTemplate.defaultAtrbs;
        }
        $scope.clearNptTemplate = function () {
            $scope.currentPricingTable = null;
            angular.forEach($scope.templates.ModelTemplates.PRC_TBL,
                function (value, key) {
                    value._custom._active = false;
                });
            $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.ECAP);
            $scope.newPricingTable["OBJ_SET_TYPE_CD"] = "";
        }
        $scope.addCustomToTemplates();

        // **** UN-MARK CURRENT Methods ****
        //
        $scope.unmarkCurPricingStrategyIf = function (id) {
            if ($scope.curPricingStrategyId === id) {
                $scope.curPricingStrategy = {};
                $scope.curPricingStrategyId = 0;
            }
        }
        $scope.unmarkCurPricingTableIf = function (id) {
            if ($scope.curPricingTableId > 0 &&
                $scope.curPricingTable !== null &&
                $scope.curPricingTable.DC_PARENT_ID === id) {
                $scope.curPricingTable = {
                };
                $scope.curPricingTableId = 0;
            }
        }

        $scope.updateAtrbValue = function (objSetType, ids, atrb, value) {
            $scope.setBusy("Saving", "Please wait while your information is being saved.");

            var data = {
                objSetType: objSetType,
                ids: ids,
                attribute: atrb,
                value: value
            };

            objsetService.updateAtrbValue($scope.getCustId(), $scope.contractData.DC_ID, data).then(
                function (results) {
                    $scope.setBusy("Done", "Save Complete.");
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.isAutoSaving = false;
                },
                function (response) {
                    $scope.setBusy("Error", "Could not save the value.", "Error");
                    logger.error("Could not save the value.", response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.isAutoSaving = false;
                }
            );

        }

        $scope.emailData = [];

        $scope.actionPricingStrategy = function (ps, actn) {
            $scope.setBusy("Updating " + $scope.psTitle + "...", "Please wait as we update the " + $scope.psTitle + "!", "Info", true);
            objsetService.actionPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, ps, actn).then(
                function (data) {
                    $scope.messages = data.data.Messages;

                    $timeout(function () {
                        $scope.$broadcast('refresh');
                        $("#wincontractMessages").data("kendoWindow").open();
                        if (ps !== undefined) $scope.refreshContractData(ps.DC_ID);
                        $scope.setBusy("", "");
                    }, 50);
                },
                function (result) {
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.$on('SyncHiddenItems',
            function (event, data, dataItem) {
                $scope.syncHoldItems(data, dataItem);
            });

        $scope.actionPricingStrategies = function (data, emailEnabled) {
            $scope.setBusy("Updating " + $scope.psTitle + "...", "Please wait as we update the " + $scope.psTitle + "!", "Info", true);

            var pcActn = new perfCacheBlock("Action Pricing Strategies", "MT");

            $scope.emailData = data;
            $scope.pricingStrategyStatusUpdated = false;
            objsetService.actionPricingStrategies($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, data).then(
                function (response) {
                    pcActn.addPerfTimes(response.data.PerformanceTimes);
                    if ($scope.$root.pc !== null) $scope.$root.pc.add(pcActn.stop());
                    $scope.messages = response.data.Data.Messages;

                    $timeout(function () {
                        $scope.$broadcast('refresh');
                        $scope.$broadcast('actionPricingStrategyComplete');
                        $("#wincontractMessages").data("kendoWindow").open();
                        $scope.refreshContractData();
                        $scope.setBusy("", "");
                    }, 50);

                    $scope.pricingStrategyStatusUpdated = true;

                    if ($scope.$root.pc !== null) {
                        $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                        $scope.$root.pc = null;
                    }

                },
                function (result) {

                }
            );
        }
        $scope.actionWipDeal = function (wip, actn) {
            $scope.setBusy("Updating Wip Deal...", "Please wait as we update the Wip Deal!", "Info", true);
            objsetService.actionWipDeal($scope.getCustId(), $scope.contractData.DC_ID, wip, actn).then(
                function (data) {
                    $scope.syncHoldItems(data, { Cancel: [wip] });
                    $scope.$broadcast('refreshStage', { Cancel: [wip] });
                },
                function (result) {
                    $scope.setBusy("", "");
                }
            );
        }
        $scope.actionWipDeals = function (data) {
            $scope.setBusy("Updating Wip Deals...", "Please wait as we update the Wip Deals!", "Info", true);
            objsetService.actionWipDeals($scope.getCustId(), $scope.contractData.DC_ID, data).then(
                function (data) {
                    $scope.messages = data.data.Messages;
                    $scope.$broadcast('refreshStage');

                    $timeout(function () {
                        //$scope.$broadcast('refresh');
                        //$("#wincontractMessages").data("kendoWindow").open();
                        //$scope.refreshContractData();
                        $scope.setBusy("", "");
                    }, 50);
                },
                function (result) {
                    //debugger;
                }
            );
        }
        $scope.syncHoldWipAllActions = function (wip) {
            var arActions = ["Approve", "Reject", "Hold", "Cancel"];

            for (var a = 0; a < arActions.length; a++) {
                var actionItems = wip[arActions[a]];
                if (actionItems !== undefined && actionItems !== null) {
                    for (var i = 0; i < actionItems.length; i++) {
                        $scope.syncHoldWip(actionItems[i]);
                    }
                }
            }
        }
        $scope.syncHoldWip = function (dataItem) {
            if (dataItem.WF_STG_CD === "Hold" && $scope.messages[0].ShortMessage !== "Hold") {
                // taken off hold
                if (!dataItem._actions) dataItem._actions = {};
                dataItem._actions["Hold"] = true;

                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.isReadOnly) dataItem._behaviors.isReadOnly = {};
                $scope.reloadPage();
                //dataItem._behaviors.isReadOnly["DEAL_GRP_EXCLDS"] = false;
                //dataItem._behaviors.isReadOnly["DEAL_GRP_CMNT"] = false;
            }
            if (dataItem.WF_STG_CD !== "Hold" && $scope.messages[0].ShortMessage === "Hold") {
                // put on hold
                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.isReadOnly) dataItem._behaviors.isReadOnly = {};
                $scope.$broadcast('onHold',dataItem);
                //dataItem._behaviors.isReadOnly["DEAL_GRP_EXCLDS"] = true;
                //dataItem._behaviors.isReadOnly["DEAL_GRP_CMNT"] = true;
            }

            if ($scope.messages[0].ShortMessage.indexOf("You do not have permission") < 0 && $scope.messages[0].ShortMessage.indexOf("The stage was changed by another") < 0) {
                dataItem.WF_STG_CD = $scope.messages[0].ShortMessage;
            }
            //PS moved to
            if ($scope.messages.length > 1) {
                for (var i = 1; i < $scope.messages.length; i++) {
                    if ($scope.messages[i].Message.indexOf("PS moved to ") >= 0) {
                        dataItem.PS_WF_STG_CD = $scope.messages[1].ShortMessage;
                    }
                }
            }
        }

        $scope.chgTerms = function () {
            var dataItem = $scope.curPricingStrategy;

            var data = {
                objSetType: "PRC_ST",
                ids: [dataItem["DC_ID"]],
                attribute: "TERMS",
                value: dataItem["TERMS"]
            };

            objsetService.updateAtrbValue($scope.getCustId(), $scope.contractData.DC_ID, data).then(
                function (results) {
                    $("#termSave").show();
                    $timeout(function () {
                        $("#termSave").hide();
                    }, 3000);
                },
                function (response) {
                }
            );
        }

        $scope.syncHoldItems = function (data, wip) {
            $scope.messages = data.data.Messages;

            $timeout(function () {
                $scope.syncHoldWipAllActions(wip);
                $scope.$broadcast('refresh');
                $scope.$broadcast('refreshStage', wip);
                $("#wincontractMessages").data("kendoWindow").open();
                $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);
                $scope.setBusy("", "");
            }, 50);

        }

        // **** DELETE Methods ****
        //
        $scope.deletePricingStrategy = function (ps) {
            kendo.confirm("Are you sure that you want to delete this " + $scope.psTitle + "?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Deleting...", "Deleting the " + $scope.psTitle, "Info");
                    $scope._dirty = false;
                    // Remove from DB first... then remove from screen
                    objsetService.deletePricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("Delete Failed", "Unable to Deleted the " + $scope.psTitle, "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            var deleteReload = false;
                            if ($scope.curPricingTableId > 0) {
                                deleteReload = true;
                            }

                            // might need to unmark the current selected item
                            $scope.unmarkCurPricingStrategyIf(ps.DC_ID);
                            $scope.unmarkCurPricingTableIf(ps.DC_ID);

                            // delete item
                            $scope.contractData.PRC_ST.splice($scope.contractData.PRC_ST.indexOf(ps), 1);

                            $scope.setBusy("Delete Successful", "Deleted the " + $scope.psTitle, "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);

                            // redirect if focused PT belongs to deleted PS
                            if (deleteReload) {
                                $state.go('contract.manager', {
                                    cid: $scope.contractData.DC_ID
                                }, { reload: true });
                            }
                        },
                        function (result) {
                            logger.error("Could not delete " + $scope.psTitle + " " + ps.DC_ID, result, result.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.rollBackPricingStrategy = function (ps) {
            kendo.confirm("Are you sure that you want to undo this " + $scope.psTitle + " re-deal?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("RollBack...", "Rolling the " + $scope.psTitle + " back", "Info");
                    $scope._dirty = false;
                    // Remove from DB first... then remove from screen
                    objsetService.rollBackPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps.DC_ID).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("RollBack Failed", "Unable to RollBack the " + $scope.psTitle + " re-deal", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            logger.info(data.data.Message, data.data.Message, "Rollback Results");
                            $scope.setBusy("RollBack Successful", "RollBack the " + $scope.psTitle + " re-deal", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);

                            // You changed the list, just reload it.
                            $scope.reloadPage();
                        },
                        function (result) {
                            logger.error("Could not RollBack the " + $scope.psTitle + " " + ps.DC_ID, result, result.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.cancelPricingStrategy = function (ps) {
            kendo.confirm("Are you sure that you want to cancel this " + $scope.psTitle + "?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Cancel...", "Canceling the " + $scope.psTitle + " back", "Info");
                    $scope._dirty = false;
                    objsetService.cancelPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, ps).then(
                        function (data) {
                            if (data.data.Messages[0].MsgType !== 1) {
                                $scope.setBusy("Cancel Failed", "Unable to Cancel the " + $scope.psTitle + " with Deals having Trackers", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            $scope.setBusy("Cancel Successful", "Cancel the " + $scope.psTitle, "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);

                            $state.go('contract.manager', {
                                cid: $scope.contractData.DC_ID
                            }, { reload: true });
                        },
                        function (result) {
                            logger.error("Could not Cancel the " + $scope.psTitle + " " + ps.DC_ID, result, result.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.deletePricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to delete this " + $scope.ptTitle + "?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Deleting...", "Deleting the " + $scope.ptTitle, "Info", true);
                    $scope._dirty = false;

                    // Remove from DB first... then remove from screen
                    objsetService.deletePricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("Delete Failed", "Unable to Delete the " + $scope.ptTitle, "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            var deleteReload = false;
                            if ($scope.curPricingTableId === pt.DC_ID) {
                                deleteReload = true;
                            }

                            // might need to unmark the current selected item
                            $scope.unmarkCurPricingTableIf(ps.DC_ID);

                            // delete item
                            ps.PRC_TBL.splice(ps.PRC_TBL.indexOf(pt), 1);

                            $scope.setBusy("Delete Successful", "Deleted the " + $scope.ptTitle, "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);

                            // redirect if deleted the currently focused PT
                            if (deleteReload) {
                                $state.go('contract.manager', {
                                    cid: $scope.contractData.DC_ID
                                }, { reload: true });
                            }
                        },
                        function (response) {
                            logger.error("Could not delete the " + $scope.ptTitle + " " + pt.DC_ID, response, response.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        // ROLLBACK NEED TO VERIFY BELOW WITH PHIL
        $scope.rollBackPricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to undo this " + $scope.ptTitle + " re-deal?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Rollback...", "Rolling Back the " + $scope.ptTitle);
                    $scope._dirty = false;

                    // Remove from DB first... then remove from screen
                    objsetService.rollBackPricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt.DC_ID).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("RollBack Failed", "Unable to RollBack the " + $scope.ptTitle + "re-deal", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            logger.info(data.data.Message, data.data.Message, "Rollback Results");
                            $scope.setBusy("RollBack Successful", "RollBack the " + $scope.ptTitle + " re-deal", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);

                            // You changed the list, just reload it.
                            $scope.reloadPage();
                        },
                        function (response) {
                            logger.error("Could not RollBack the " + $scope.ptTitle + " " + pt.DC_ID, response, response.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.cancelPricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to cancel this " + $scope.ptTitle + "?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Canceling...", "Canceling the " + $scope.ptTitle);
                    $scope._dirty = false;
                    objsetService.cancelPricingTable($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, pt).then(
                        function (data) {
                            if (data.data.Messages[0].MsgType !== 1) {
                                $scope.setBusy("Cancel Failed", "Unable to Cancel the " + $scope.ptTitle + " with Deals having Trackers", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            $scope.setBusy("Cancel Successful", "Canceled the " + $scope.ptTitle, "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);

                            $state.go('contract.manager', {
                                cid: $scope.contractData.DC_ID
                            }, { reload: true });
                        },
                        function (result) {
                            logger.error("Could not Cancel the " + $scope.ptTitle + " " + pt.DC_ID, result, result.statusText, "Error");
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.deletePricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Deleting...", "Deleting the " + $scope.ptTitle + " Row and Deal");
                $scope._dirty = false;

                // Remove from DB first... then remove from screen
                objsetService.deletePricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Delete Failed", "Unable to Deleted the " + $scope.ptTitle, "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.$broadcast('removeRow', wip.DC_PARENT_ID);
                        $scope.refreshContractData($scope.curPricingStrategyId);

                        $scope.setBusy("Delete Successful", "Deleted the " + $scope.ptTitle + " Row and Deal", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                    },
                    function (response) {
                        logger.error("Could not delete the " + $scope.ptTitle + " " + wip.DC_PARENT_ID, response, response.statusText);
                        $scope.setBusy("", "");
                    }
                );
            });
        }
        $scope.rollbackPricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Rolling Back...", "Rolling Back the " + $scope.ptTitle + " Row and Deal");
                $scope._dirty = false;

                // Remove from DB first... then remove from screen
                objsetService.rollbackPricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Rollback Failed", "Unable to Rollback the " + $scope.ptTitle, "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.setBusy("Rollback Successful", "Rollback of the " + $scope.ptTitle + " Row and Deal", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);

                        // You changed the deals list, just reload it.
                        $scope.reloadPage();
                    },
                    function (response) {
                        logger.error("Could not Rollback the " + $scope.ptTitle + " " + pt.DC_ID, response, response.statusText);
                        $scope.setBusy("", "");
                    }
                );
            });
        }

        $scope.reloadPage = function () {
            $state.reload();
        }

        // **** COPY Methods ****
        //
        $scope.copyPricingStrategy = function (c, ps) {
            $scope.copyObj($scope.psTitle, c.PRC_ST, ps.DC_ID, objsetService.copyPricingStrategy);
        }
        $scope.copyPricingTable = function (ps, pt) {
            $scope.copyObj($scope.ptTitle, ps.PRC_TBL, pt.DC_ID, objsetService.copyPricingTable);
        }
        $scope.copyObj = function (objType, objTypes, id, invokFunc) {
            $scope.setBusy("Copying", "Copying the " + objType);
            $scope._dirty = false;

            // Clone selected obj based on id
            var selectedItems = $linq.Enumerable().From(objTypes).Where(
                function (x) {
                    return (x.DC_ID === id);
                }).ToArray();

            var titles = $linq.Enumerable().From(objTypes).Select(
                function (x) {
                    return x.TITLE;
                }).ToArray();

            if (selectedItems.length === 0) {
                kendo.alert("Unable to locate the " + objType);
                $scope.setBusy("", "");
                return;
            }

            var item = util.clone(selectedItems[0]);
            if (!item) {
                kendo.alert("Unable to copy the " + objType);
                $scope.setBusy("", "");
                return;
            }

            // clear values
            item.DC_ID = $scope.uid--;
            item.HAS_TRACKER = "0";
            item.COST_TEST_RESULT = "Not Run Yet";
            item.MEETCOMP_TEST_RESULT = "Not Run Yet";

            // define new TITLE
            while (titles.indexOf(item.TITLE) >= 0) {
                item.TITLE += " (copy)";
            }

            // Add to DB first... then add to screen
            invokFunc($scope.getCustId(), $scope.contractData.DC_ID, id, item).then(
                function (data) {
                    // reload the left nav to show the new details
                    logger.success("Copied the " + objType + ".", data, "Copy Successful");
                    $scope.refreshContractData();
                    $scope.setBusy("", "");
                },
                function (response) {
                    logger.error("Could not copy the " + objType + ".", response, response.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        // **** UNGROUP Methods ****
        //
        $scope.unGroupPricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Splitting Deals...", "Splitting the Grouped " + $scope.ptTitle + " Row into seperate deals");
                $scope._dirty = false;

                // Remove from DB first... then remove from screen
                objsetService.unGroupPricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (!!data.data.MsgType && data.data.MsgType !== 1) {
                            $scope.setBusy("Splitting Failed", "Unable to Split the " + $scope.ptTitle + " Row");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        // update local data with new ids to prevent the need to refresh the screen
                        if (!!data.data.Messages) {
                            for (var m = 0; m < data.data.Messages.length; m++) {
                                var dcId = data.data.Messages[m].KeyIdentifiers[0];
                                var dcParentId = data.data.Messages[m].KeyIdentifiers[1];
                                var dcPrdTitle = data.data.Messages[m].ExtraDetails[0];
                                var dcKitName = data.data.Messages[m].ExtraDetails[1];

                                if ($scope.wipData !== undefined) {
                                    for (var d = 0; d < $scope.wipData.length; d++) {
                                        if ($scope.wipData[d].DC_ID === dcId) {
                                            $scope.wipData[d].DC_PARENT_ID = dcParentId;
                                            $scope.wipData[d]._parentCnt = 1;
                                            $scope.wipData[d].PTR_USER_PRD = dcPrdTitle;
                                            if (dcKitName !== "") {
                                                $scope.wipData[d].DEAL_GRP_NM = dcKitName;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // notify opGrid of the change
                        $scope.$broadcast('updateGroup', data.data.Messages);

                        // refresh upper contract
                        if (wip !== undefined) $scope.refreshContractData(wip.DC_ID);

                        $scope.setBusy("Split Successful", "Split the " + $scope.ptTitle + " Row into single Deals", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);

                    },
                    function (response) {
                        logger.error("Could not split the " + $scope.ptTitle + " Row.", response, response.statusText);
                    }
                );
            });
        }

        // this function takes an array of date ranges in this format:
        // [{ start: Date, end: Date}]
        // the array is first sorted, and then checked for any overlap

        function hasDuplicateProduct(pricingTableRows) {
            var rows = angular.copy(pricingTableRows);
            var sortedRanges = rows.sort((previous, current) => {

                previous.START_DT = previous.START_DT instanceof Date ? previous.START_DT : new Date(previous.START_DT);
                current.END_DT = current.END_DT instanceof Date ? current.END_DT : new Date(current.END_DT);

                previous.END_DT = previous.END_DT instanceof Date ? previous.END_DT : new Date(previous.END_DT);
                current.START_DT = current.START_DT instanceof Date ? current.START_DT : new Date(current.START_DT);

                // get the start date from previous and current
                var previousTime = previous.START_DT.getTime();
                var currentTime = current.END_DT.getTime();

                // if the previous is earlier than the current
                if (previousTime < currentTime) {
                    return -1;
                }

                // if the previous time is the same as the current time
                if (previousTime === currentTime) {
                    return 0;
                }

                // if the previous time is later than the current time
                return 1;
            });

            var dictDuplicateProducts = {};

            var result = sortedRanges.reduce((result, current, idx, arr) => {
                // get the previous range
                if (idx === 0) { return result; }
                var previous = arr[idx - 1];


                // check for any overlap
                var previousEnd = previous.END_DT.getTime();
                var currentStart = current.START_DT.getTime();
                var overlap = (previousEnd >= currentStart);

                // store the result
                if (overlap) {
                    if (previous.PTR_SYS_PRD !== "") {
                        var sysProducts = JSON.parse(previous.PTR_SYS_PRD);
                        for (var key in sysProducts) {
                            if (sysProducts.hasOwnProperty(key)) {
                                angular.forEach(sysProducts[key], function (item) {
                                    if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                        dictDuplicateProducts[item.PRD_MBR_SID] = previous.DC_ID;
                                    } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(previous.DC_ID.toString()) < 0) {
                                        dictDuplicateProducts[item.PRD_MBR_SID] += "," + previous.DC_ID;
                                        if (result.duplicateProductDCIds[previous.DC_ID] == undefined) {
                                            result.duplicateProductDCIds[previous.DC_ID] = {
                                                "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                                "OverlapProduct": key
                                            }
                                        } else {
                                            result.duplicateProductDCIds[previous.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                            result.duplicateProductDCIds[previous.DC_ID].OverlapProduct += "," + key;
                                        }
                                    }
                                });
                            }
                        }
                    }

                    if (current.PTR_SYS_PRD !== "") {
                        var sysProducts = JSON.parse(current.PTR_SYS_PRD);
                        for (var key in sysProducts) {
                            if (sysProducts.hasOwnProperty(key)) {
                                angular.forEach(sysProducts[key], function (item) {
                                    if (dictDuplicateProducts[item.PRD_MBR_SID] == undefined) {
                                        dictDuplicateProducts[item.PRD_MBR_SID] = current.DC_ID;
                                    } else if (dictDuplicateProducts[item.PRD_MBR_SID].toString().indexOf(current.DC_ID.toString()) < 0) {
                                        dictDuplicateProducts[item.PRD_MBR_SID] += "," + current.DC_ID;
                                        if (result.duplicateProductDCIds[current.DC_ID] == undefined) {
                                            result.duplicateProductDCIds[current.DC_ID] = {
                                                "OverlapDCID": dictDuplicateProducts[item.PRD_MBR_SID],
                                                "OverlapProduct": key
                                            }
                                        } else {
                                            result.duplicateProductDCIds[current.DC_ID].OverlapDCID += "," + dictDuplicateProducts[item.PRD_MBR_SID];
                                            result.duplicateProductDCIds[current.DC_ID].OverlapProduct += "," + key;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                return result;

                // seed the reduce  
            }, { overlap: false, duplicateProductDCIds: {} });

            // return the final results  
            return result;
        }

        function validateCustomerDivision(dictCustDivision, baseCustDiv, custDiv) {
            if (baseCustDiv != null && custDiv != null) {
                if (Object.keys(dictCustDivision).length == 1 && baseCustDiv.indexOf("/") !== -1 && custDiv.indexOf("/") !== -1
                    && baseCustDiv.split("/").length == custDiv.split("/").length) {
                    var divs = custDiv.split("/");
                    for (var z = 0; z < divs.length; z++) {
                        if (baseCustDiv.indexOf(divs[z]) == -1) {
                            return false;
                        }
                    }
                    return true;
                }
                else { return false }
            }
            else {
                return false;
            }
        }


        // **** SAVE CONTRACT Methods ****
        //
        $scope.createEntireContractBase = function (stateName, dirtyContractOnly, forceValidation, bypassLowerContract) {
       
                var source = "";
                var modCt = [];
                var modPs = [];
                var modPt = [];
                var sData = [];
                var gData = [];
                var errs = {};
                var needPrdVld = [];

                var contractData = [];
                var curPricingTableData = [];

                // Contract and Pricing Strategies
                if (dirtyContractOnly) {
                    contractData = [$scope.contractData];
                    for (var c = 0; c < contractData.length; c++) {
                        var mCt = {};
                        Object.keys(contractData[c]).forEach(function (key, index) {
                            if (key[0] !== '_' && key !== "Customer" && key !== "PRC_ST") mCt[key] = this[key];
                        }, contractData[c]);
                        modCt.push(mCt);

                        if (!contractData[c]["PRC_ST"]) contractData[c]["PRC_ST"] = [];
                        var item = contractData[c]["PRC_ST"];
                        for (var p = 0; p < item.length; p++) {
                            var mPs = {};
                            Object.keys(item[p]).forEach(function (key, index) {
                                if (key[0] !== '_' && key !== "PRC_TBL") mPs[key] = this[key];
                            }, item[p]);
                            modPs.push(mPs);

                            if (!item[p]["PRC_TBL"]) item[p]["PRC_TBL"] = [];
                            var ptItem = item[p]["PRC_TBL"];

                            for (var t = 0; t < ptItem.length; t++) {
                                var mPt = {};
                                Object.keys(ptItem[t]).forEach(function (key, index) {
                                    if (key[0] !== '_') mPt[key] = this[key];
                                }, ptItem[t]);

                                if (mPt.dirty !== undefined && mPt.dirty === true) {
                                    modPt.push(mPt);
                                    mPt.dirty = false;
                                }
                            }
                        }
                    }
                }

                // Pricing Table Header
                if (!!$scope.curPricingTable.DC_ID) curPricingTableData = [$scope.curPricingTable];

                // Pricing Table Rows
                if (stateName === "contract.manager.strategy" && !bypassLowerContract) {
                    source = "PRC_TBL";

                    if ($scope.spreadDs !== undefined) {
                        // sync all detail data sources into main grid data source for a single save
                        var data = cleanupData($scope.spreadDs._data);
                        // TODO: Temp fix till sync function is updated

                        $scope.spreadDs.data(data);
                        $scope.spreadDs.sync();

                    }
           
                    sData = $scope.spreadDs === undefined ? undefined : $scope.pricingTableData.PRC_TBL_ROW;

                    // Remove any lingering blank rows from the data
                    if (!!sData) {
                        for (var n = sData.length - 1; n >= 0; n--) {
                            if (!sData[n].PS_WF_STG_CD) {
                                sData[n].PS_WF_STG_CD = $scope.curPricingStrategy.WF_STG_CD;
                            }
                            if (sData[n].DC_ID === null && sData[n].PTR_USER_PRD === "") {
                                sData.splice(n, 1);
                            }
                            //For every save remove previous validation message
                            if (sData[n]._behaviors) {
                                if (sData[n]._behaviors.validMsg) sData[n]._behaviors.validMsg = {};
                                if (sData[n]._behaviors.isError) sData[n]._behaviors.isError = {};
                            }
                            //US1071237: Vistex R2 Post Release: Convert Project Name to Upper Case
                            sData[n].QLTR_PROJECT = sData[n].QLTR_PROJECT.toUpperCase();
                            //Removes extra space from the value string.
                            sData[n].GEO_COMBINED = $scope.spreadDs._data[n].GEO_COMBINED;
                            sData[n].QLTR_BID_GEO = $scope.spreadDs._data[n].QLTR_BID_GEO;
                            if (sData[n].GEO_COMBINED != undefined && sData[n].GEO_COMBINED != null && sData[n].GEO_COMBINED.toString().contains(' ')) {
                                sData[n].GEO_COMBINED = sData[n].GEO_COMBINED.toString().split(',').map(function (value) { return value.trim(); }).join(',');
                            }
                            if (sData[n].QLTR_BID_GEO != undefined && sData[n].QLTR_BID_GEO != null && sData[n].QLTR_BID_GEO.toString().contains(' ')) {
                                sData[n].QLTR_BID_GEO = sData[n].QLTR_BID_GEO.toString().split(',').map(function (value) { return value.trim(); }).join(',');
                            }
                        }
                    }
                    $scope.$broadcast('syncDs');

                    // Pricing Table Row
                    if (curPricingTableData.length > 0 && sData != undefined) {
                        //validate settlement partner for PTE
                        sData = $scope.validateSettlementPartner(sData);
                        //validate OAV&OAD partner for PTE
                        sData = $scope.validateOverArching(sData);
                        sData = $scope.validateHybridFields(sData);
                        //validate settlement level for PTE
                        //sData = $scope.validateSettlementLevel(sData);
                        //validate Flex product overlap for PTE
                        $scope.OVLPFlexPdtPTRUSRPRDError = false;
                        sData = $scope.validateOVLPFlexProduct(sData);
                        //validate Flex row type for PTE
                        sData = $scope.validateFlexRowType(sData);
                        //validate Market Segment
                        sData = $scope.validateMarketSegment(sData);
                        

                        // find all date fields
                        var dateFields = [];
                        var fields = $scope.templates.ModelTemplates.PRC_TBL_ROW[$scope.curPricingTable.OBJ_SET_TYPE_CD].model.fields;
                        for (var key in fields) {
                            if (fields.hasOwnProperty(key)) {
                                if (typeof fields[key] !== 'function') {
                                    if (fields[key].type === "date" || key.slice(-3) === "_DT") dateFields.push(key);
                                }
                            }
                        }


                        //
                        // This is a temporary fix to mock-stop users from mixing Tender with non-Tender deals.  Once the Stablization release happens, we can remove this check.
                        //
                        var hasTender = false;
                        var hasNonTender = false;
                        var dictRebateType = {};
                        var dictPayoutBasedon = {};
                        var dictCustDivision = {};
                        var dictPayoutBasedon = {};
                        var dictGeoCombined = {};
                        var dictPeriodProfile = {};
                        var dictResetPerPeriod = {};
                        //var dictArSettlement = {};
                        var dictProgramPayment = {};
                        var dictOverarchingVolume = {};
                        var dictOverarchingDollar = {};
                        var isHybridPS = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";

                        // Check if the rows have duplicate products
                        var duplicateProductRows = isHybridPS ? hasDuplicateProduct(sData) : {};

                        var errDeals = [];
                        if (curPricingTableData[0].OBJ_SET_TYPE_CD === "ECAP" || curPricingTableData[0].OBJ_SET_TYPE_CD === "KIT"
                            || curPricingTableData[0].OBJ_SET_TYPE_CD === "PROGRAM" || curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER"
                            || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX" || curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER"
                            || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY") {
                            for (var s = 0; s < sData.length; s++) {
                                if (sData[s]["_dirty"] !== undefined && sData[s]["_dirty"] === true) errDeals.push(s);
                                if (duplicateProductRows["duplicateProductDCIds"] !== undefined && duplicateProductRows.duplicateProductDCIds[sData[s].DC_ID] !== undefined) errDeals.push(s);
                                if ((curPricingTableData[0].OBJ_SET_TYPE_CD !== "KIT" && curPricingTableData[0].OBJ_SET_TYPE_CD !== "VOL_TIER" && curPricingTableData[0].OBJ_SET_TYPE_CD !== "FLEX") || sData[s].TIER_NBR === 1) {
                                    if (sData[s]["REBATE_TYPE"] === "TENDER") {
                                        hasTender = true;
                                    } else {
                                        hasNonTender = true;
                                    }
                                    if (isHybridPS) {
                                        dictRebateType[sData[s]["REBATE_TYPE"]] = s;
                                        dictPayoutBasedon[sData[s]["PAYOUT_BASED_ON"]] = s;
                                        var isCustDivValid = validateCustomerDivision(dictCustDivision, sData[0]["CUST_ACCNT_DIV"], sData[s]["CUST_ACCNT_DIV"]);
                                        if (isCustDivValid) {
                                            dictCustDivision[sData[0]["CUST_ACCNT_DIV"]] = s;
                                        }
                                        else {
                                            dictCustDivision[sData[s]["CUST_ACCNT_DIV"]] = s;
                                        }
                                        dictGeoCombined[sData[s]["GEO_COMBINED"]] = s;
                                        if (curPricingTableData[0].OBJ_SET_TYPE_CD !== "PROGRAM") {
                                            dictPeriodProfile[sData[s]["PERIOD_PROFILE"]] = s;
                                        }
                                        dictResetPerPeriod[sData[s]["RESET_VOLS_ON_PERIOD"]] = s;
                                        dictProgramPayment[sData[s]["PROGRAM_PAYMENT"]] = s;

                                        // The next two values if left blank can come in as either null or "", make them one pattern.
                                        if (sData[s]["REBATE_OA_MAX_AMT"] == null) dictOverarchingDollar[""] = s;
                                        else dictOverarchingDollar[sData[s]["REBATE_OA_MAX_AMT"]] = s;

                                        if (sData[s]["REBATE_OA_MAX_VOL"] == null) dictOverarchingVolume[""] = s;
                                        else dictOverarchingVolume[sData[s]["REBATE_OA_MAX_VOL"]] = s;
                                    }
                                }
                            }
                            if (errDeals.length > 0) {
                                for (var t = 0; t < errDeals.length; t++) {
                                    var el = sData[errDeals[t]];
                                    if (!el._behaviors) el._behaviors = {};
                                    if (!el._behaviors.isError) el._behaviors.isError = {};
                                    if (!el._behaviors.validMsg) el._behaviors.validMsg = {};
                                    if (hasTender && hasNonTender) {
                                        el._behaviors.isError["REBATE_TYPE"] = true;
                                        el._behaviors.validMsg["REBATE_TYPE"] = "Cannot mix Tender and Non-Tender deals in the same " + $scope.ptTitle + ".";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push(el._behaviors.validMsg["REBATE_TYPE"]);
                                    }

                                    // Run through all PTR items and bubble up errors for a server side save block.
                                    // TODO: Implement only hybrids/Flex attributes list as part of this blocking since we don't want to also block potential Mid Tier side issues
                                    // See "$scope.validateHybridFields" for list of fields to add for this check
                                    for (var e = 0; e < Object.keys(el._behaviors.validMsg).length; e++) {
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        // Remove this element since it is causing a line to say broke without an error, and ensure element is on the list of blocking attributes only
                                        if (Object.keys(el._behaviors.validMsg)[e] !== "DC_ID" && $scope.hybridSaveBlockingColumns.indexOf(Object.keys(el._behaviors.validMsg)[e]) >= 0) { 
                                            if (!errs.PRC_TBL_ROW.contains(el._behaviors.validMsg[Object.keys(el._behaviors.validMsg)[e]])) {
                                                errs.PRC_TBL_ROW.push(el._behaviors.validMsg[Object.keys(el._behaviors.validMsg)[e]])
                                            }
                                        }
                                    }

                                    if (isHybridPS && Object.keys(dictProgramPayment).length == 1 && !(Object.keys(dictProgramPayment).contains("Backend"))) {
                                        el._behaviors.isError["PROGRAM_PAYMENT"] = true;
                                        el._behaviors.validMsg["PROGRAM_PAYMENT"] = "Hybrid Pricing Strategy Deals must be Backend only.";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push(el._behaviors.validMsg["PROGRAM_PAYMENT"]);
                                    }
                                    if (isHybridPS && duplicateProductRows.duplicateProductDCIds[el.DC_ID] !== undefined) {
                                        el._behaviors.isError["PTR_USER_PRD"] = true;
                                        el._behaviors.validMsg["PTR_USER_PRD"] = "Cannot have duplicate product(s). Product(s): " +
                                            duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapProduct + " are duplicate within rows " + duplicateProductRows.duplicateProductDCIds[el.DC_ID].OverlapDCID + ". Please check the date range overlap.";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push(el._behaviors.validMsg["PTR_USER_PRD"]);
                                    }
                                }
                            }
                        }


                        var validated_DC_Id = [];
                        var invalidFlexDate = $scope.validateFlexDate(sData);

                        for (var s = 0; s < sData.length; s++) {
                            //Adding settlment partner error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['SETTLEMENT_PARTNER']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["SETTLEMENT_PARTNER"]);
                            }

                            //Adding Market Segment error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['MRKT_SEG']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["MRKT_SEG"]);
                            }
                            //Adding Overarching  error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['REBATE_OA_MAX_AMT']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["REBATE_OA_MAX_AMT"]);
                            }
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['REBATE_OA_MAX_VOL']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["REBATE_OA_MAX_VOL"]);
                            }
                            //Adding settlment level error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['AR_SETTLEMENT_LVL']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
                            }
                            //Adding FLEX overlap product error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['PTR_USER_PRD'] && $scope.OVLPFlexPdtPTRUSRPRDError) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["PTR_USER_PRD"]);
                            }

                            //Adding FLEX Row type error into err object in PTE
                            if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['FLEX_ROW_TYPE']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["FLEX_ROW_TYPE"]);
                            }

                            if (curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX" || curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER"
                                || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY") {
                                // Set attribute Keys for adding dimensions
                                let rateKey;
                                let endKey;
                                let strtKey;
                                if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                                    rateKey = "RATE"; endKey = "END_VOL"; strtKey = "STRT_VOL";
                                }
                                else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER") {
                                    rateKey = "INCENTIVE_RATE"; endKey = "END_REV"; strtKey = "STRT_REV";
                                }
                                else { // DENSITY
                                    rateKey = "RATE"; endKey = "END_PB"; strtKey = "STRT_PB";
                                }

                                // If Vol Tier or Flex, take the schedule as Ints, otherwise, do a float convert
                                if (curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "FLEX") {
                                    // HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Now we have to turn them back before saving.
                                    if (sData[s][endKey] != null && sData[s][endKey] != undefined && sData[s][endKey].toString().toUpperCase() != "UNLIMITED") {
                                        sData[s][endKey] = parseInt(sData[s][endKey].toString().replace(/,/g, "") || 0);
                                    }
                                    if (sData[s][rateKey] === null) {
                                        sData[s][rateKey] = parseInt(0);
                                    }
                                    if (sData[s][strtKey] === null) {
                                        sData[s][strtKey] = parseInt(0);
                                    }
                                }
                                else { // curPricingTableData[0].OBJ_SET_TYPE_CD === "REV_TIER" || curPricingTableData[0].OBJ_SET_TYPE_CD === "DENSITY"
                                    // HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Now we have to turn them back before saving.
                                    if (sData[s][endKey] != null && sData[s][endKey] != undefined && sData[s][endKey].toString().toUpperCase() != "UNLIMITED") {
                                        sData[s][endKey] = parseFloat(sData[s][endKey].toString().replace(/,/g, "") || 0);
                                    }
                                    if (sData[s][rateKey] === null) {
                                        sData[s][rateKey] = parseFloat(0);
                                    }
                                    if (sData[s][strtKey] === null) {
                                        sData[s][strtKey] = parseFloat(0);
                                    }
                                }

                            }

                            if (sData[s].DC_ID === null || sData[s].DC_ID === 0) sData[s].DC_ID = $scope.uid--;
                            sData[s].DC_PARENT_ID = curPricingTableData[0].DC_ID;
                            sData[s].dc_type = "PRC_TBL_ROW";
                            sData[s].dc_parent_type = curPricingTableData[0].dc_type;
                            sData[s].OBJ_SET_TYPE_CD = curPricingTableData[0].OBJ_SET_TYPE_CD;

                            if (util.isInvalidDate(sData[s].START_DT)) sData[s].START_DT = $scope.contractData["START_DT"];
                            if (util.isInvalidDate(sData[s].END_DT)) sData[s].END_DT = $scope.contractData["END_DT"];

                            // Let's store the backdate rns from the contract in the text field so we can leverage it in rules
                            sData[s].BACK_DATE_RSN_TXT = $scope.contractData.BACK_DATE_RSN;

                            // fix date formats
                            for (var d = 0; d < dateFields.length; d++) {
                                sData[s][dateFields[d]] = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY");
                                if (sData[s][dateFields[d]] === "Invalid date") {
                                    if (dateFields[d] !== "OEM_PLTFRM_LNCH_DT" && dateFields[d] !== "OEM_PLTFRM_EOL_DT") {//(isProgramNRE === true || (dateFields[d] !== "OEM_PLTFRM_LNCH_DT" && dateFields[d] !== "OEM_PLTFRM_EOL_DT"))
                                        if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                        if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                        if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                        sData[s]._behaviors.isError[dateFields[d]] = true;
                                        sData[s]._behaviors.validMsg[dateFields[d]] = "Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push("Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.");
                                    }
                                } else {
                                    // check dates against contract
                                    if (dateFields[d] === "START_DT") {
                                        var tblStartDate = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY"); 
                                        var endDate = moment($scope.contractData.END_DT).format("MM/DD/YYYY"); 
                                        var isTenderFlag = "0";
                                        if ($scope.contractData["IS_TENDER"] !== undefined) isTenderFlag = $scope.contractData["IS_TENDER"];
                                        //Delete if there is any previous Error  messages
                                        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['START_DT']) {
                                            delete sData[s]._behaviors.isError['START_DT'];
                                            delete sData[s]._behaviors.validMsg['START_DT'];
                                        }
                                        // check dates against contract - Tender contracts don't observe start/end date within contract.
                                        if (moment(tblStartDate).isAfter(endDate) && isTenderFlag !== "1" && sData[s]["OBJ_SET_TYPE_CD"] != "VOL_TIER") {
                                            if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                            if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                            if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                            sData[s]._behaviors.isError['START_DT'] = true;
                                            sData[s]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")";
                                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                            errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")");
                                        }

                                        //Validating Votier deal Dates
                                        if (sData[s]["OBJ_SET_TYPE_CD"] == "VOL_TIER" && sData[s]["NUM_OF_TIERS"] == sData[s]["TIER_NBR"]) {
                                            var FirstTire = s + 1 - sData[s]["TIER_NBR"];
                                            if (!(moment(sData[FirstTire]["START_DT"]).isSame(tblStartDate))) {
                                                sData[FirstTire]["START_DT"] = tblStartDate;
                                            }

                                            if (moment(tblStartDate).isAfter(endDate) && isTenderFlag !== "1") {
                                                if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                                if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                                if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                                sData[FirstTire]._behaviors.isError['START_DT'] = true;
                                                sData[FirstTire]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")";
                                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                                errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")");
                                            }
                                        }

                                        //Validating Flex Accrual Start Dates
                                        if (sData[s]["OBJ_SET_TYPE_CD"] == "FLEX") {
                                            //Delete if there is any previous Error  messages
                                            if ((invalidFlexDate || invalidFlexDate != undefined)) {
                                                angular.forEach(invalidFlexDate, (item) => {
                                                    $scope.setFlexBehaviors(item, 'START_DT', 'invalidDate');
                                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                                    errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg['START_DT']);
                                                });
                                            }
                                        }
                                        
                                    }
                                    if (dateFields[d] === "END_DT") {
                                        var tblStartDate = moment(sData[s][dateFields[d - 1]]).format("MM/DD/YYYY"); 
                                        var tblEndDate = moment(sData[s][dateFields[d]]).format("MM/DD/YYYY"); 
                                        var startDate = moment($scope.contractData.START_DT).format("MM/DD/YYYY"); 
                                        var isTenderFlag = "0";
                                        if ($scope.contractData["IS_TENDER"] !== undefined) isTenderFlag = $scope.contractData["IS_TENDER"];

                                        if (sData[s]._behaviors.isError && sData[s]._behaviors.isError['END_DT']) {
                                            delete sData[s]._behaviors.isError['END_DT'];
                                            delete sData[s]._behaviors.validMsg['END_DT'];
                                        }


                                        if (moment(tblEndDate).isBefore(startDate) && isTenderFlag !== "1" && sData[s]["OBJ_SET_TYPE_CD"] != "VOL_TIER") {
                                            if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                            if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                            if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                            sData[s]._behaviors.isError['END_DT'] = true;
                                            sData[s]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")"; 
                                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                            errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")"); 
                                        }
                                        
                                        if (sData[s]["OBJ_SET_TYPE_CD"] == "VOL_TIER" && sData[s]["NUM_OF_TIERS"] == sData[s]["TIER_NBR"]) {


                                            var FirstTire = s + 1 - sData[s]["TIER_NBR"];
                                            if (!(moment(sData[FirstTire]["END_DT"]).isSame(tblEndDate))) {
                                                sData[FirstTire]["END_DT"] = tblEndDate;
                                            }


                                            if (moment(tblEndDate).isBefore(startDate) && isTenderFlag !== "1") {
                                                if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                                if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                                if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                                sData[FirstTire]._behaviors.isError['END_DT'] = true;
                                                sData[FirstTire]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")"; 
                                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                                errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")"); 
                                            }

                                        }
                                      
                                    }
                                }

                                // PTR Level Check - Readonly will be true if AR_SETTLEMENT_LVL is "Cash" and the deal has a tracker. Otherwise, the user is allowed to 
                                // swap between "Issue Credit to Billing Sold To" or "Issue Credit to Default Sold To by Region".
                                var dataHyb = sData.filter(obj => obj.AR_SETTLEMENT_LVL != null);
                                var hasInvalidArSettlementForHybirdDealsPtr = isHybridPS && $.unique(dataHyb.map(function (dataItem) { return dataItem["AR_SETTLEMENT_LVL"] })).length > 1;
                                if (hasInvalidArSettlementForHybirdDealsPtr == false && sData[s].HAS_TRACKER == "1" && sData[s]._behaviors.isReadOnly["AR_SETTLEMENT_LVL"] != true
                                    && editableArSettlementLevelAfterApproval.indexOf(sData[s].AR_SETTLEMENT_LVL) < 0) {
                                    sData[s]._behaviors.isError["AR_SETTLEMENT_LVL"] = true;
                                    sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"] = "Settlement Level can be updated between \"" + editableArSettlementLevelAfterApproval.join(" / ") + "\" for active deals";
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push(sData[s]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
                                }
                            }

                            if (forceValidation) {
                                // check for rows that need to be translated
                                // TODO:  merged cells are not updated with valid JSON, hence the work around to check for the unique DC_ID's
                                var isValidatedRow = validated_DC_Id.filter(function (x) {
                                    return x == sData[s].DC_ID;
                                }).length > 0;

                                if (!isValidatedRow) {
                                    validated_DC_Id.push(sData[s].DC_ID);
                                    if ((!!sData[s].PTR_USER_PRD && sData[s].PTR_USER_PRD !== "") && (!sData[s].PTR_SYS_PRD || sData[s].PTR_SYS_PRD === "") ||
                                        (!(!sData[s].PTR_SYS_INVLD_PRD || sData[s].PTR_SYS_PRD === ""))) {
                                        if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                        if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                        if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                        sData[s]._behaviors.isError["PTR_USER_PRD"] = true;
                                        sData[s]._behaviors.validMsg["PTR_USER_PRD"] = "Product Translator needs to run.";
                                        needPrdVld.push({
                                            "row": s + 1,
                                            "DC_ID": sData[s].DC_ID,
                                            "PTR_USER_PRD": sData[s].PTR_USER_PRD
                                        });
                                    }
                                }
                            }
                        }
                        // We should de-normalize pricing table row only when we are hitting MT
                        // If there are errors don't de-normalize, else PricingTableRow and spreadSheet data will be different
                        if (!(errs.PRC_TBL_ROW !== undefined && errs.PRC_TBL_ROW.length !== 0)) {
                            sData = $scope.deNormalizeData(util.deepClone(sData));
                        }
                    }
                }

                // WIP Deals
                if (stateName === "contract.manager.strategy.wip" && !bypassLowerContract) {
                    source = "WIP_DEAL";
                    gData = $scope.wipData;
                    var uData = $scope.LookBackPeriod;
                    var isTenderFlag = "0";
                    if ($scope.contractData["IS_TENDER"] !== undefined) isTenderFlag = $scope.contractData["IS_TENDER"];
                    var isHybridPricingStatergy = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT != undefined && $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT == "1";
                    var dictGroupType = {};
                    var dictWipOverMaxVol = {};
                    var dictWipOverMaxAmt = {};

                    // Wip Deal
                    if (gData !== undefined && gData !== null) {
                        gData = $scope.ValidateEndCustomer(gData, "SaveAndValidate");
                        //validate settlement parter for DE
                        gData = $scope.validateSettlementPartner(gData);
                        //validate OAV & OAD parter for DE
                        gData = $scope.validateOverArching(gData);
                        gData = $scope.validateHybridFields(gData);
                        //validate settlement level for DE
                        gData = $scope.validateSettlementLevel(gData);
                        //validate flex overlap products for DE
                        $scope.OVLPFlexPdtPTRUSRPRDError = false;
                        gData = $scope.validateOVLPFlexProduct(gData);
                        //validate Flex Row Type for DE
                        gData = $scope.validateFlexRowType(gData);
                        //validate Market Segment
                        gData = $scope.validateMarketSegment(gData);

                        var hasInvalidArSettlementForHybirdDeals = isHybridPricingStatergy && $.unique(gData.map(function (dataItem) { return dataItem["AR_SETTLEMENT_LVL"] })).length > 1;
                        var invalidFlexDate = $scope.validateFlexDate(gData);

                        for (var i = 0; i < gData.length; i++) {
                            if ((gData[i]["USER_AVG_RPU"] == null || gData[i]["USER_AVG_RPU"] == "")
                                && (gData[i]["USER_MAX_RPU"] == null || gData[i]["USER_MAX_RPU"] == "")
                                && gData[i]["RPU_OVERRIDE_CMNT"] != null && gData[i]["RPU_OVERRIDE_CMNT"] !== "") {
                                gData[i]["RPU_OVERRIDE_CMNT"] = "";
                            }
                            // Adding settlment partner error into err object in DE
                            if (gData[i]._behaviors.isError['SETTLEMENT_PARTNER']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["SETTLEMENT_PARTNER"]);
                            }

                            //US1071237: Vistex R2 Post Release: Convert Project Name to Upper Case
                            gData[i].QLTR_PROJECT = gData[i].QLTR_PROJECT.toUpperCase();

                            if (gData[i]._behaviors.isError['MRKT_SEG']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["MRKT_SEG"]);
                            }

                            // This forces all items onto the save side errors checking.  Need to scale it to only the fields we care about.
                            for (var e = 0; e < Object.keys(gData[i]._behaviors.validMsg).length; e++) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                // Remove this element since it is causing a line to say broke without an error, and ensure element is on the list of blocking attributes only
                                if (Object.keys(gData[i]._behaviors.validMsg)[e] !== "DC_ID" && $scope.hybridSaveBlockingColumns.indexOf(Object.keys(gData[i]._behaviors.validMsg)[e]) >= 0) { 
                                    if (!errs.PRC_TBL_ROW.contains(gData[i]._behaviors.validMsg[Object.keys(gData[i]._behaviors.validMsg)[e]])) {
                                        errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg[Object.keys(gData[i]._behaviors.validMsg)[e]])
                                    }
                                }
                            }

                            // Adding Overarching error into err object in DE
                            if (gData[i]._behaviors.isError['REBATE_OA_MAX_VOL']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["REBATE_OA_MAX_VOL"]);
                            }
                            if (gData[i]._behaviors.isError['REBATE_OA_MAX_AMT']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["REBATE_OA_MAX_AMT"]);
                            }
                            // Adding settlment level error into err object in DE
                            if (gData[i]._behaviors.isError['AR_SETTLEMENT_LVL']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
                            }
                            // Adding FLEX overlap Product error into err object in DE
                            if (gData[i]._behaviors.isError['PTR_USER_PRD'] && $scope.OVLPFlexPdtPTRUSRPRDError) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["PTR_USER_PRD"]);
                            }

                            // Adding FLEX Row Type Product error into err object in DE
                            if (gData[i]._behaviors.isError['FLEX_ROW_TYPE']) {
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["FLEX_ROW_TYPE"]);
                            }
                            
                            // TODO... this should probably mimic Pricing Table Rows
                            if (gData[i].DC_ID === null || gData[i].DC_ID === 0) gData[i].DC_ID = $scope.uid--;

                            // Kindof a lame hack... should make it more dynamic, but for now let's see if we can get this working
                            // ^ very informative Phil... :)  Here we convert the data of Array format used by Kendo to a string format expected by our middle tier 
                            if (Array.isArray(gData[i].TRGT_RGN)) gData[i].TRGT_RGN = gData[i].TRGT_RGN.join();
                            if (Array.isArray(gData[i].QLTR_BID_GEO)) gData[i].QLTR_BID_GEO = gData[i].QLTR_BID_GEO.join();
                            if (Array.isArray(gData[i].DEAL_SOLD_TO_ID)) gData[i].DEAL_SOLD_TO_ID = gData[i].DEAL_SOLD_TO_ID.join();

                            if (($scope.curPricingStrategy.WF_STG_CD.toString().toUpperCase() == "APPROVED" || Object.keys(gData[i].TRKR_NBR).length > 0) && isTenderFlag !== "1") {
                                if (gData[i].CONSUMPTION_LOOKBACK_PERIOD < uData[gData[i].DC_ID]) {
                                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                    gData[i]._behaviors.isError['CONSUMPTION_LOOKBACK_PERIOD'] = true;
                                    gData[i]._behaviors.validMsg['CONSUMPTION_LOOKBACK_PERIOD'] = "Lookback Period can only increase after approval";
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push("Lookback Period can only increase after approval");
                                }
                            }

                            if (gData[i].CONSUMPTION_COUNTRY != null && gData[i].CONSUMPTION_COUNTRY != undefined && gData[i].CONSUMPTION_COUNTRY != "") {
                                if (gData[i].CONSUMPTION_CUST_RPT_GEO != null && gData[i].CONSUMPTION_CUST_RPT_GEO != undefined && gData[i].CONSUMPTION_CUST_RPT_GEO != "") {
                                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                    gData[i]._behaviors.isError['CONSUMPTION_CUST_RPT_GEO'] = true;
                                    gData[i]._behaviors.validMsg['CONSUMPTION_CUST_RPT_GEO'] = "Please enter value in either Customer Reported Geo or Consumption Country ,but not both";
                                    gData[i]._behaviors.isError['CONSUMPTION_COUNTRY'] = true;
                                    gData[i]._behaviors.validMsg['CONSUMPTION_COUNTRY'] = "Please enter value in either Customer Reported Geo or Consumption Country ,but not both";
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push("Please enter value in either Customer Reported Geo or Consumption Country ,but not both");
                                }
                            }

                            // check dates against contract - Tender contracts don't observe start/end date within contract.
                            if (moment(gData[i]["START_DT"]).isAfter($scope.contractData.END_DT) && isTenderFlag !== "1") {
                                if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                gData[i]._behaviors.isError['START_DT'] = true;
                                gData[i]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment($scope.contractData.END_DT).format("MM/DD/YYYY") + ")"; 
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment($scope.contractData.END_DT).format("MM/DD/YYYY") + ")"); 
                            }

                            // check dates against contract - Tender contracts don't observe start/end date within contract.
                            if (moment(gData[i]["END_DT"]).isBefore($scope.contractData.START_DT) && isTenderFlag !== "1") {
                                if (gData[i]._behaviors !== null && gData[i]._behaviors !== undefined) {
                                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                    gData[i]._behaviors.isError['END_DT'] = true;
                                    gData[i]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment($scope.contractData.START_DT).format("MM/DD/YYYY") + ")"; 
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment($scope.contractData.START_DT).format("MM/DD/YYYY") + ")"); 
                                }
                            }

                            // check Deal dates 
                            if (moment(gData[i]["START_DT"]).isAfter(moment(gData[i]["END_DT"])) && isTenderFlag !== "1") {
                                if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                gData[i]._behaviors.isError['START_DT'] = true;
                                gData[i]._behaviors.validMsg['START_DT'] = "Deal Start date cannot be greater than the Deal End Date";
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push("Start date cannot be greater than the Deal End Date");
                            }

                            if (gData[i]["OBJ_SET_TYPE_CD"] == "FLEX") {
                                //Delete if there is any previous Error  messages
                                if ((invalidFlexDate || invalidFlexDate != undefined)) {
                                    angular.forEach(invalidFlexDate, (item) => {
                                        $scope.setFlexBehaviors(item, 'START_DT', 'invalidDate');
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg['START_DT']);
                                    });
                                }
                            }

                            if (gData[i]["END_CUSTOMER_RETAIL"] != undefined && gData[i]["END_CUSTOMER_RETAIL"] != null) { // && isTenderFlag == "1"
                                if (gData[i]._behaviors.isError['END_CUSTOMER_RETAIL']) {
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["END_CUSTOMER_RETAIL"]);
                                }
                                else if (gData[i]["END_CUSTOMER_RETAIL"].length > 60) {
                                    if (gData[i]._behaviors !== null && gData[i]._behaviors !== undefined) {
                                        if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                        if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                        gData[i]._behaviors.isError['END_CUSTOMER_RETAIL'] = true;
                                        gData[i]._behaviors.validMsg['END_CUSTOMER_RETAIL'] = "End Customer text can not be longer than 60 Characters";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push("End Customer text can not be longer than 60 Characters");
                                    }
                                }
                                else {
                                    if (gData[i]._behaviors.isError['END_CUSTOMER_RETAIL']) {
                                        delete gData[i]._behaviors.isError['END_CUSTOMER_RETAIL'];
                                        delete gData[i]._behaviors.validMsg['END_CUSTOMER_RETAIL'];
                                    }
                                    gData[i]["END_CUSTOMER_RETAIL"] = gData[i]["END_CUSTOMER_RETAIL"].toString();
                                }
                            }

                            var fields = $scope.templates.ModelTemplates.PRC_TBL_ROW[$scope.curPricingTable.OBJ_SET_TYPE_CD].model.fields;
                            for (var key in fields) {
                                if (fields.hasOwnProperty(key)) {
                                    if (fields[key].type === "date") {
                                        gData[i][key] = moment(gData[i][key]).format("MM/DD/YYYY");
                                    }
                                }
                            }

                            // This is silly hard-coding because these are not in our template and they are used by DSA only - set them to proper dates.
                            if (gData[i]["ON_ADD_DT"] !== undefined) gData[i]["ON_ADD_DT"] = moment(gData[i]["ON_ADD_DT"]).format("MM/DD/YYYY"); 
                            if (gData[i]["REBATE_BILLING_START"] !== undefined) gData[i]["REBATE_BILLING_START"] = moment(gData[i]["REBATE_BILLING_START"]).format("MM/DD/YYYY"); 
                            if (gData[i]["REBATE_BILLING_END"] !== undefined) gData[i]["REBATE_BILLING_END"] = moment(gData[i]["REBATE_BILLING_END"]).format("MM/DD/YYYY"); 
                            if (gData[i]["LAST_REDEAL_DT"] !== undefined) gData[i]["LAST_REDEAL_DT"] = moment(gData[i]["LAST_REDEAL_DT"]).format("MM/DD/YYYY"); 

                            // Hybrid pricing strategy logic and Flex deal type validation error for DEAL_COMB_TYPE
                            if (isHybridPricingStatergy || gData[i]["OBJ_SET_TYPE_CD"] == "FLEX") {
                                dictGroupType[gData[i]["DEAL_COMB_TYPE"]] = i;
                                if (Object.keys(dictGroupType).length > 1) {
                                    if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                    if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                    gData[i]._behaviors.isError['DEAL_COMB_TYPE'] = true;
                                    gData[i]._behaviors.validMsg['DEAL_COMB_TYPE'] = "All deals within a PS should have the same 'Group Type' value";
                                    if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                    errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg['DEAL_COMB_TYPE']);
                                }

                            }

                            // WIP Deal Level Check - Readonly will be true if AR_SETTLEMENT_LVL is "Cash" and the deal has a tracker. Otherwise, the user is allowed to 
                            // swap between "Issue Credit to Billing Sold To" or "Issue Credit to Default Sold To by Region".
                            if (hasInvalidArSettlementForHybirdDeals == false && gData[i].HAS_TRACKER == "1" && gData[i]._behaviors.isReadOnly["AR_SETTLEMENT_LVL"] != true
                                && editableArSettlementLevelAfterApproval.indexOf(gData[i].AR_SETTLEMENT_LVL) < 0) {
                                gData[i]._behaviors.isError["AR_SETTLEMENT_LVL"] = true;
                                gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"] = "Settlement Level can be updated between \"" + editableArSettlementLevelAfterApproval.join(" / ") + "\" for active deals";
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push(gData[i]._behaviors.validMsg["AR_SETTLEMENT_LVL"]);
                            }
                        }
                    }
                }

                // see if we are only saving upper contract PT items
                if (modPt.length > 0) {
                    return {
                        "Contract": modCt,
                        "PricingStrategy": modPs,
                        "PricingTable": modPt,
                        "PricingTableRow": [],
                        "WipDeals": [],
                        "EventSource": source,
                        "Errors": errs
                    }
                }

                //
                // REMOVED THIS BECAUSE PARTIAL SAVES ARE CAuSING HAVOC IN TRANSLATION... UNTIL WE HAVE A WORK AROUND, NEED TO PASS UP ENTIRE COLLECTION
                //
                //var sDataSave = sData.filter(function (a) {
                //	var hasErrors = false;
                //	if (a._behaviors != null && a._behaviors !== undefined) {
                //		var errors = a._behaviors.isError;
                //		hasErrors = (errors !== null && errors !== undefined && Object.keys(errors).length !== 0 && errors.constructor === Object); // HACK: if a user doesn't change anything on an existing contract, but clicks "Save", then errors won't show up unless we include rows with errors. This can occur after user copies a PT.
                //	}
                //	var isPrdNeedsValidation = (a.PTR_SYS_PRD == null);
                //	return (a._dirty || hasErrors || isPrdNeedsValidation);
                //});

                //.filter(function (a) { return a._dirty })
                return {
                    "Contract": [],
                    "PricingStrategy": [],
                    "PricingTable": curPricingTableData,
                    "PricingTableRow": sData === undefined ? [] : sData, //sDataSave, //sData.filter(function (a) { return a._dirty }),
                    "WipDeals": gData === undefined ? [] : gData.filter(function (a) { return a._dirty }),
                    "EventSource": source,
                    "Errors": errs
                }
            
        }

        $scope.validateTitles = function (dataItem) {
            var rtn = true;

            if (!$scope.curPricingStrategy) return true;
            var isPsUnique = $scope.IsUniqueInList($scope.contractData.PRC_ST, $scope.curPricingStrategy["TITLE"], "TITLE", true);
            var isPtUnique = !$scope.curPricingTable ? true : $scope.IsUniqueInList($scope.curPricingStrategy.PRC_TBL, $scope.curPricingTable["TITLE"], "TITLE", true);

            // Pricing Table
            if (!!$scope.curPricingTable) {
                if (!$scope.curPricingTable._behaviors) $scope.curPricingTable._behaviors = {};
                if (!$scope.curPricingTable._behaviors.validMsg) $scope.curPricingTable._behaviors.validMsg = {};
                if (!$scope.curPricingTable._behaviors.isError) $scope.curPricingTable._behaviors.isError = {};

                if (!$scope.curPricingTable._behaviors.isDirty || $scope.curPricingTable._behaviors.isDirty.TITLE) {
                    if ($scope.curPricingTable !== undefined && $scope.curPricingTable.TITLE === "") {
                        $scope.curPricingTable._behaviors.validMsg["TITLE"] = "The " + $scope.ptTitle + " needs a Title.";
                        $scope.curPricingTable._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    }
                    else if (!isPtUnique) {
                        $scope.curPricingTable._behaviors.validMsg["TITLE"] = "The " + $scope.ptTitle + " must have unique name within contract.";
                        $scope.curPricingTable._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if ($scope.curPricingTable["TITLE"] !== undefined && $scope.curPricingTable["TITLE"].length > 80) {
                        $scope.curPricingTable._behaviors.validMsg["TITLE"] = "The " + $scope.ptTitle + " cannot have more than 80 characters.";
                        $scope.curPricingTable._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    }
                    else {
                        $scope.curPricingTable._behaviors.isError["TITLE"] = false;
                    }
                }
            }

            // Pricing Strategy
            if (!!$scope.curPricingStrategy) {
                if (!$scope.curPricingStrategy._behaviors) $scope.curPricingStrategy._behaviors = {};
                if (!$scope.curPricingStrategy._behaviors.validMsg) $scope.curPricingStrategy._behaviors.validMsg = {};
                if (!$scope.curPricingStrategy._behaviors.isError) $scope.curPricingStrategy._behaviors.isError = {};

                if (!$scope.curPricingStrategy._behaviors.isDirty || $scope.curPricingStrategy._behaviors.isDirty.TITLE) {
                    if ($scope.curPricingStrategy !== undefined && $scope.curPricingStrategy.TITLE === "") {
                        $scope.curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + $scope.psTitle + " needs a Title.";
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if (!isPsUnique) {
                        $scope.curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + $scope.psTitle + " must have unique name.";
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if ($scope.curPricingStrategy["TITLE"] !== undefined && $scope.curPricingStrategy["TITLE"].length > 80) {
                        $scope.curPricingStrategy._behaviors.validMsg["TITLE"] = "The " + $scope.ptTitle + " cannot have more than 80 characters.";
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else {
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = false;
                    }
                }
            }

            if (dataItem !== undefined) {
                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.validMsg) dataItem._behaviors.validMsg = {};
                if (!dataItem._behaviors.isError) dataItem._behaviors.isError = {};

                if (!dataItem._behaviors.isDirty || dataItem._behaviors.isDirty.TITLE) {
                    if (dataItem !== undefined && dataItem.TITLE === "") {
                        dataItem._behaviors.validMsg["TITLE"] = "The " + $scope.psTitle + " needs a Title.";
                        dataItem._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if (!isPsUnique) {
                        dataItem._behaviors.validMsg["TITLE"] = "The " + $scope.psTitle + " must have unique name.";
                        dataItem._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if (dataItem["TITLE"] !== undefined && dataItem["TITLE"].length > 80) {
                        dataItem._behaviors.validMsg["TITLE"] = "The " + $scope.ptTitle + " cannot have more than 80 characters.";
                        dataItem._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else {
                        dataItem._behaviors.isError["TITLE"] = false;
                    }
                }
            }

            return rtn;
        }

        // **** SAVE CONTRACT Methods ****
        //
        $scope.saveEntireContractBase = function (stateName, forceValidation, forcePublish, toState, toParams, delPtr, callback) {
            //common place to call flex product overlap for PTE/DE
            $scope.getOVLPProduct(function (err) {
                if (!err) {
                    if (!$scope._dirty && !forceValidation) {
                        return;
                    }

                    // if save already started saving... exit
                    // if validate triggers from product translation continue..validating data
                    if ($scope.isBusyMsgTitle !== "Saving your data..." && $scope.isBusyMsgTitle !== "Validating your data..." && $scope.isBusyMsgTitle !== "Overlapping Deals...") {
                        if (!!$scope.isBusyMsgTitle && $scope.isBusyMsgTitle !== "") return;
                    }

                    var gData = [];
                    var isDatesOverlap = false;
                    gData = $scope.wipData;
                    if (gData !== undefined && gData !== null) {
                        for (var i = 0; i < gData.length; i++) {
                            if ((moment(gData[i]["START_DT"]).isBefore($scope.contractData.START_DT) || moment(gData[i]["END_DT"]).isAfter($scope.contractData.END_DT)) && isDatesOverlap == false) {
                                isDatesOverlap = true;
                            }
                        }
                    }

                    if (isDatesOverlap == false) {
                        $scope.saveEntireContractRoot(stateName, forceValidation, forcePublish, toState, toParams, delPtr, null, callback);
                    }
                    else {
                        kendo.confirm("Extending Deal Dates will result in the extension of Contract Dates. Please click 'OK', if you want to proceed.").then(function () {
                            $scope.saveEntireContractRoot(stateName, forceValidation, forcePublish, toState, toParams, delPtr, null, callback);
                        },
                            function () {
                                $scope.setBusy("", "");
                                return;
                            });
                    }
                    return;
                }
                else {
                    logger.stickyError("Something went wrong please try after sometime");
                    return;
                }
            });
        }

       

        $scope.saveEntireContractRoot = function (stateName, forceValidation, forcePublish, toState, toParams, delPtr, bypassLowerContract, callback) {
            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Contract Controller", "");
            var pc = new perfCacheBlock("Save Contract Root", "UX");
            var pcUi = new perfCacheBlock("Gather data to pass", "UI");

            if (forceValidation === undefined || forceValidation === null) forceValidation = false;
            if (forcePublish === undefined || forcePublish === null) forcePublish = false;
            if (bypassLowerContract === undefined || bypassLowerContract === null) bypassLowerContract = false;

            $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);

            $scope.clearValidations();

            if (!$scope.validateTitles()) {
                $scope.setBusy("", "");
                $scope.isAutoSaving = false;

                var msg = [];
                if ($scope.curPricingTable._behaviors.isError["TITLE"]) msg.push($scope.ptTitle);
                if ($scope.curPricingStrategy._behaviors.isError["TITLE"]) msg.push($scope.psTitle);

                kendo.alert("The " + msg.join(" and ") + " either must have a title or needs a unique name in order to save.");
                return;
            }

            var data = $scope.createEntireContractBase(stateName, $scope._dirtyContractOnly, forceValidation, bypassLowerContract);
            var stagePending = false;
            $scope.pendingList.length = 0; 

            //checking for pending deal and set the flag true
            for (var i = 0; i < data.WipDeals.length; i++) {                
                if (data.WipDeals[i].WF_STG_CD == "Pending")
                {
                    stagePending = true;
                    $scope.pendingList.push(data.WipDeals[i].DC_ID);
                }
            }


            pc.mark("Built data structure");

            // If there are critical errors like bad dates, we need to stop immediately and have the user fix them
            if (!!data.Errors && !angular.equals(data.Errors, {}) && data.Errors.PRC_TBL_ROW.length > 0) {
                logger.warning("Please fix validation errors before proceeding", $scope.contractData, "");
                $scope.syncCellValidationsOnAllRows($scope.pricingTableData["PRC_TBL_ROW"]); /////////////
                $scope.setBusy("", "");
                if (data.PricingTableRow != undefined && data.PricingTableRow != null && data.PricingTableRow.length > 0) {
                    $scope.$broadcast('saveWithWarnings', data.PricingTableRow);
                }
                return;
            }

            var copyData = util.deepClone(data);
            $scope.compressJson(copyData);
            if ($scope.removeCleanItems(copyData, delPtr)) {
                $scope.setBusy("");
                $scope.isAutoSaving = false;
                kendo.alert("Nothing to save.");
                return;
            }

            util.console("updateContractAndCurPricingTable Started");
            var isDelPtr = !!delPtr && delPtr.length > 0;
            if (isDelPtr) copyData.PtrDelIds = delPtr;

            pc.add(pcUi.stop());
            var pcService = new perfCacheBlock("Update Contract And CurPricing Table", "MT");
            objsetService.updateContractAndCurPricingTable($scope.getCustId(), $scope.contractData.DC_ID, copyData, forceValidation, forcePublish, isDelPtr).then(
                function (results) {
                    $scope.overlapFlexResult = null;
                    var data = results.data.Data;
                    if ($scope.getVendorDropDownResult != null && $scope.getVendorDropDownResult != undefined
                        && $scope.getVendorDropDownResult.length > 0) {
                        var customerVendor = $scope.getVendorDropDownResult;
                        angular.forEach($scope.pricingTableData.PRC_TBL_ROW, (item) => {
                            var partnerID = customerVendor.filter(x => x.DROP_DOWN == item.SETTLEMENT_PARTNER);
                            if (partnerID && partnerID.length == 1) {
                                item.SETTLEMENT_PARTNER = partnerID[0].BUSNS_ORG_NM;
                            }
                        });
                        angular.forEach($scope.pricingTableData.WIP_DEAL, (item) => {
                            var partnerID = customerVendor.filter(x => x.DROP_DOWN == item.SETTLEMENT_PARTNER);
                            if (partnerID && partnerID.length == 1) {
                                item.SETTLEMENT_PARTNER = partnerID[0].BUSNS_ORG_NM;
                            }
                        });
                    }
                    if (data != null && data != undefined && data.WIP_DEAL != undefined && data.WIP_DEAL != null) {
                        $scope.$broadcast('updateDealAtrb', data);
                    }

                    pcService.addPerfTimes(results.data.PerformanceTimes);
                    pc.add(pcService.stop());
                    var pcUI = new perfCacheBlock("Processing returned data", "UI");
                    util.console("updateContractAndCurPricingTable Returned");

                    var i;
                    $scope.setBusy("Saving your data...Done", "Processing results now!", "Info", true);

                    var anyWarnings = false;
                    var totalWarnings = 0
                    var totalserverWarnings = 0;
                    pc.mark("Constructing returnset");
                    if (!!data.PRC_TBL_ROW) {
                        data.PRC_TBL_ROW = $scope.pivotData(data.PRC_TBL_ROW);
                        for (i = 0; i < data.PRC_TBL_ROW.length; i++) {
                            if (!!data.PRC_TBL_ROW[i].PTR_SYS_PRD) {
                                // check for pivots
                                data.PRC_TBL_ROW[i].PTR_SYS_PRD = $scope.uncompress(data.PRC_TBL_ROW[i].PTR_SYS_PRD);
                            }
                            if (data.PRC_TBL_ROW[i].warningMessages !== undefined && data.PRC_TBL_ROW[i].warningMessages.length > 0) {
                                anyWarnings = true;
                                totalWarnings++;
                            }
                            if (data.PRC_TBL_ROW[i]._behaviors !== undefined && data.PRC_TBL_ROW[i]._behaviors.isError.SERVER_DEAL_TYPE) {
                                totalserverWarnings++;
                            }
                        }

                        $scope.updateResults(data.PRC_TBL_ROW, $scope.pricingTableData.PRC_TBL_ROW); ////////////

                        // When products(# of products are rows in KIT) are added or removed, _action will be first row, ignore this when copying _behaviours
                        var actionOffeset = 0;
                        for (var i = 0; i < data.PRC_TBL_ROW.length; i++) {
                            if (data.PRC_TBL_ROW[i]["_actions"] !== undefined) {
                                actionOffeset++;
                            }
                        }

                        if (!!$scope.spreadDs) {
                            $scope.spreadDs.read();

                            for (var p = 0; p < $scope.pricingTableData.PRC_TBL_ROW.length; p++) {
                                if (data.PRC_TBL_ROW[p] !== undefined && (data.PRC_TBL_ROW[p].DC_ID === $scope.pricingTableData.PRC_TBL_ROW[p].DC_ID ||
                                    data.PRC_TBL_ROW[p].DC_ID === undefined)) {
                                    if (data.PRC_TBL_ROW[p + actionOffeset] != undefined) {
                                        $scope.pricingTableData.PRC_TBL_ROW[p]._behaviors = data.PRC_TBL_ROW[p + actionOffeset]._behaviors;
                                    }
                                }
                            }

                            $scope.syncCellValidationsOnAllRows($scope.pricingTableData.PRC_TBL_ROW);
                        }
                    }

                    if (!!data.WIP_DEAL && stateName !== "contract.manager.strategy") { // Wip deal and Not in pricing table row tab // HACK: To prevent PTR from using WIP deal warnings
                        if (!$scope.switchingTabs) {
                            for (i = 0; i < data.WIP_DEAL.length; i++) {
                                var dataItem = data.WIP_DEAL[i];
                                if (dataItem.warningMessages !== undefined && dataItem.warningMessages.length > 0) anyWarnings = true;

                                if (anyWarnings) {
                                    var dimStr = "_10___";  // NOTE: 10___ is the dim defined in _gridUtil.js
                                    var isKit = 0;
                                    var relevantAtrbs = tierAtrbs;
                                    var tierCount = dataItem.NUM_OF_TIERS;

                                    if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                                        if (dataItem.PRODUCT_FILTER === undefined) { continue; }
                                        dimStr = "_20___";
                                        isKit = 1;          // KIT dimensions are 0-based indexed unlike VT's num_of_tiers which begins at 1
                                        relevantAtrbs = $scope.kitDimAtrbs;
                                        tierCount = Object.keys(dataItem.PRODUCT_FILTER).length;
                                    }
                                    // map tiered warnings
                                    for (var t = 1 - isKit; t <= tierCount - isKit; t++) {
                                        for (var a = 0; a < relevantAtrbs.length; a++) {
                                            mapTieredWarnings(dataItem, dataItem, relevantAtrbs[a], (relevantAtrbs[a] + dimStr + t), t);    //TODO: what happens in negative dim cases? this doesnt cover does it?
                                        }
                                    }
                                    for (var a = 0; a < relevantAtrbs.length; a++) {
                                            delete dataItem._behaviors.validMsg[relevantAtrbs[a]];
                                    }
                                }
                            }
                            $scope.updateResults(data.WIP_DEAL, $scope.pricingTableData === undefined ? [] : $scope.pricingTableData.WIP_DEAL);
                            $scope.getLookBackPeriod();
                        }
                    }
                    if (!anyWarnings || !forceValidation) {
                        $scope.stealthMode = true;
                        $scope.setBusy("Save Successful", "Saved the contract", "Success");
                        if (stateName == "contract.manager.strategy") {
                            $scope.reloadPage();
                        }
                        $scope.$broadcast('saveComplete', data);
                        $scope.resetDirty();

                        $scope.delPtrIds = [];

                        if (!!toState) {
                            $scope.stealthMode = false;
                            if (!$scope.isTenderContract || $scope.enablePTRReload == true) {
                                if ($scope.switchingTabs) toState = toState.replace(/.wip/g, '');
                                $state.go(toState, toParams, { reload: true });
                            }

                        } else {
                            $timeout(function () {
                                if ($scope.isBusyMsgTitle !== "Overlapping Deals...")
                                    $scope.setBusy("", "");
                                $scope.stealthMode = false;
                            }, 1000);
                        }
                        if ($scope.isTenderContract && ($scope.selectedTAB == 'PTR' || $scope.selectedTAB == 'DE')) {
                            $scope.forceNavigation = true; //Purpose: If No Error/Warning go to Meet Comp Automatically-After Refreshing Contract
                        }
                        else {
                            $scope.forceNavigation = false;
                        }

                    } else {
                        if ($scope.isTenderContract && $scope.selectedTAB == 'PTR') {
                            $scope.forceNavigation = false; //Purpose: If No Error/Warning go to PTR Automatically-After Refreshing Contract
                        }

                        $scope.setBusy("Saved with warnings", "Didn't pass Validation", "Warning");
                        $scope.$broadcast('saveWithWarnings', data);
                        if (toState == "contract.manager.strategy.wip" && toParams != undefined && totalWarnings == totalserverWarnings) {
                            $state.go(toState, toParams, { reload: true });
                        }
                        else {
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);
                        }    
                    }

                    if (toState === undefined || toState === null || toState === "" || $scope.isTenderContract) {

                        $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);
                    }
                    $scope.isAutoSaving = false;

                    util.console("updateContractAndCurPricingTable Complete");

                    $("#dealEditor").data("kendoGrid").dataSource.read();
                    $("#dealEditor").data("kendoGrid").refresh(); 

                    //if a callback function is provided, invoke it now once everything else is completed
                    if (!!callback && typeof callback === "function") {
                        callback();
                        pc.add(pcUI.stop());
                        if ($scope.$root.pc !== null) $scope.$root.pc.add(pc.stop());
                    } else {
                        pc.add(pcUI.stop());
                        if ($scope.$root.pc !== null) {
                            $scope.$root.pc.add(pc.stop());
                            $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                            $scope.$root.pc = null;
                        }
                    }
                    //$("#dealEditor").data("kendoGrid").dataSource.read();
                    //$("#dealEditor").data("kendoGrid").refresh(); 
                },
                function (response) {
                    $scope.setBusy("Error", "Could not save the contract.", "Error");
                    logger.error("Could not save contract " + $scope.contractData.DC_ID, response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.isAutoSaving = false;
                }
            );
        }

        $scope.saveCell = function (dataItem, newField) {
            if (dataItem._behaviors === undefined) dataItem._behaviors = {};
            if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
            dataItem._behaviors.isDirty[newField] = true;
            dataItem._dirty = true;
            $scope._dirty = true;
        }

        $scope.getColumns = function (ptTemplate) {
            var cols = [];
            var c = -1;

            if (ptTemplate !== undefined && ptTemplate !== null) {
                angular.forEach(ptTemplate.columns, function (value, key) {
                    var col = {};
                    if (ptTemplate.columns[key].width) col.width = ptTemplate.columns[key].width;
                    cols.push(col);

                    c += 1;
                    if (value.hidden === false) {
                        // Create column to letter mapping
                        var letter = (c > 25) ? String.fromCharCode(intA) + String.fromCharCode(intA + c - 26) : String.fromCharCode(intA + c);
                        $scope.colToLetter[value.field] = letter;
                        $scope.letterToCol[letter] = value.field;
                    }
                });
            }
            return cols;
        }

        $scope.forceRun = function () {
            var data = $scope.contractData.PRC_ST;
            if (data !== undefined) {
                for (var d = 0; d < data.length; d++) {
                    if (data[d].MEETCOMP_TEST_RESULT === "" || data[d].MEETCOMP_TEST_RESULT === "Not Run Yet") return true;
                    if (data[d].COST_TEST_RESULT === "" || data[d].COST_TEST_RESULT === "Not Run Yet") return true;
                }
            }
            return false;
        }

        $scope.syncCellValidationsOnAllRows = function (data) {
            // kind of annoying, but layering validations tends to stall all validations.
            // so... before applying any validations, we are cleaning all existing validations

            $timeout(function () {
                $scope.clearValidations();

                var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
                if (spreadsheet === undefined) return;
                var sheet = spreadsheet.activeSheet();
                var rowsCount = sheet._rows._count;
                var offset = 0;

                // Offset detects which data[i] are actions (ID_CHNAGE, etc.) rather than actual data for adding validations to each row
                for (var i = 0; i < data.length; i++) { // NOTE: We can have multiple offsets because of vol-tier
                    if (!!data[i] && !!data[i]._actions) {
                        offset += 1;
                    }
                }

                var firstUntouchedRowFinder = 0; // when this == 1, then it will add the rest of the dropdown validation back in (in the for loop below) It can also turn into 3, which will do nothing
                sheet.batch(function () {
                    var ptTemplate = $scope.templates.ModelTemplates.PRC_TBL_ROW[$scope.curPricingTable.OBJ_SET_TYPE_CD];
                    if (ptTemplate !== undefined && ptTemplate !== null) {
                        for (var i = 0; i < rowsCount; i++) {
                            firstUntouchedRowFinder += $scope.syncCellValidationsOnSingleRow(sheet, data[i + offset], i, firstUntouchedRowFinder);
                        }
                    }
                });
            }, 10);
        }

        $scope.syncCellValidationsOnSingleRow = function (sheet, dataItem, row, isTheFirstUntouchedRowIfEqualsToOne) {
            var ptTemplate = $scope.templates.ModelTemplates.PRC_TBL_ROW[$scope.curPricingTable.OBJ_SET_TYPE_CD];
            $scope.columns = $scope.getColumns(ptTemplate);
            var c = 0;
            if (!!dataItem) {
                var beh = dataItem._behaviors;
                if (!beh) beh = {};

                angular.forEach(ptTemplate.model.fields, function (value, key) {
                    var isError = !!beh.isError && !!beh.isError[value.field];
                    var isRequired = !!beh.isRequired && !!beh.isRequired[value.field];
                    var msg = isError ? beh.validMsg[value.field] : (isRequired) ? "This field is required." : "UNKNOWN";

                    // TODO: In the future. Dropdowns do work, but their (red highlighting) validations do not allow us to ignore case-sensitivity.
                    // If we can figure out how to ignore case-sesitive, we can put these dropdwons back in
                    // re-add dropdwwns back into existing rows (dataItem only contains existing rows) Note that re-adding all the validation to the entire column will show unneccessary red flags
                    //if (value.uiType === "DROPDOWN") {
                    //    var myRange = sheet.range(row + 1, c++);
                    //    reapplyDropdowns(myRange, false, value.field);
                    //} else {
                    //To highlight error messages on correct rows [DE11710,DE117042]
                    if (!dataItem.ROW_NUMBER) 
                        sheet.range(row + 1, c++).validation($scope.myDealsValidation(isError, msg, isRequired));
                    else
                        sheet.range(dataItem.ROW_NUMBER, c++).validation($scope.myDealsValidation(isError, msg, isRequired));

                    //}
                });
            } else if (isTheFirstUntouchedRowIfEqualsToOne === 0) {
                return 1;
            } else if (isTheFirstUntouchedRowIfEqualsToOne === 1) {
                //// TODO: In the future. Dropdowns do work, but their (red highlighting) validations do not allow us to ignore case-sensitivity.
                //// If we can figure out how to ignore case-sesitive, we can put these dropdwons back in
                //// HACK: This is so we get the dropdowns back on the untouched rows without red flags!
                //// re-add dropdowns into untouched rows
                //angular.forEach(ptTemplate.model.fields, function (value, key) {
                //    if (value.uiType === "DROPDOWN") {
                //        var myRange = sheet.range($scope.colToLetter[value.field] + (row + 1) + ":" + $scope.colToLetter[value.field] + $scope.ptRowCount);
                //        reapplyDropdowns(myRange, true, value.field);
                //    }
                //});
                return 2;
            }
            return 0;
        }

        //// TODO: In the future. Dropdowns do work, but their (red highlighting) validations do not allow us to ignore case-sensitivity.
        //// If we can figure out how to ignore case-sesitive, we can put these dropdwons back in
        //function reapplyDropdowns(sheetRange, allowNulls, valueField) {
        //    sheetRange.validation({
        //        dataType: "list",
        //        showButton: true,
        //        from: "DropdownValuesSheet!" + $scope.colToLetter[valueField] + ":" + $scope.colToLetter[valueField],
        //        allowNulls: allowNulls,
        //        type: "warning",
        //        titleTemplate: "Invalid value",
        //        messageTemplate: "Invalid value. Please use the dropdown for available options."
        //    });
        //}

        $scope.clearValidations = function () {
            var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
            if (!spreadsheet) return;

            var sheet = spreadsheet.activeSheet();
            var rowsCount = sheet._rows._count;

            sheet.batch(function () {
                var ptTemplate = $scope.templates.ModelTemplates.PRC_TBL_ROW[$scope.curPricingTable.OBJ_SET_TYPE_CD];
                if (ptTemplate !== undefined && ptTemplate !== null) {
                    for (var row = 0; row < rowsCount; row++) {
                        var c = 0;
                        angular.forEach(ptTemplate.columns, function (value, key) {
                            sheet.range(row + 1, c++).validation(null);
                        });
                    }
                }
            });
        }

        $scope.removeCleanItems = function (data, delPtr) {

            if (data.Contract === undefined) data.Contract = [];
            if (data.PricingStrategy === undefined) data.PricingStrategy = [];
            if (data.PricingTable === undefined) data.PricingTable = [];
            if (data.PricingTableRow === undefined) data.PricingTableRow = [];
            if (data.WipDeals === undefined) data.WipDeals = [];

            if (!!data.PricingTableRow && !!delPtr && delPtr.length > 0) {
                data.PricingTableRow = data.PricingTableRow.filter(function (a) { return delPtr.indexOf(a.DC_ID) });
            }

            // for now... performance changes are breaking delete and translate
            return false;

            if (!!data.EventSource && data.EventSource === "WIP_DEAL") {
                return (
                    data.Contract.length === 0 &&
                    data.PricingStrategy.length === 0 &&
                    data.PricingTableRow.length === 0 &&
                    data.WipDeals.length === 0);
            }

            return false;
        }

        $scope.compressJson = function (data) {
            if (!data.PricingTableRow) return;
            for (var d = 0; d < data.PricingTableRow.length; d++) {
                data.PricingTableRow[d].PTR_SYS_PRD = $scope.compress(data.PricingTableRow[d].PTR_SYS_PRD);
                data.PricingTableRow[d].PTR_SYS_INVLD_PRD = $scope.compress(data.PricingTableRow[d].PTR_SYS_INVLD_PRD);
            }
        }
        $scope.compress = function (data) {
            return data;
            if (!data || data === "" || data[0] !== "{") return data;
            return LZString.compressToBase64(data);
        }
        $scope.uncompress = function (data) {
            //return data;
            if (!data || data === "" || data[0] === "{") return data;
            return LZString.decompressFromBase64(data);
        }
        $scope.uncompressJson = function (data) {
            if (!data) return;
            for (var d = 0; d < data.length; d++) {
                data[d].PTR_SYS_PRD = $scope.uncompress(data[d].PTR_SYS_PRD);
                data[d].PTR_SYS_INVLD_PRD = $scope.uncompress(data[d].PTR_SYS_INVLD_PRD);
            }
        }

        function mapTieredWarnings(dataItem, dataToTieTo, atrbName, atrbToSetErrorTo, tierNumber) {
            // Tie warning message (valid message and red highlight) to its specific tier
            // NOTE: this expects that tiered errors come in the form of a Dictionary<tier, message>
            if (!!dataItem._behaviors && !!dataItem._behaviors.validMsg && !jQuery.isEmptyObject(dataItem._behaviors.validMsg)) {
                if (dataItem._behaviors.validMsg[atrbName] != null) {
                    try {
                        // Parse the Dictionary json
                        var jsonTierMsg = JSON.parse(dataItem._behaviors.validMsg[atrbName]);

                        if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                            // KIT ECAP
                            if (jsonTierMsg["-1"] != null && jsonTierMsg["-1"] != undefined) {
                                dataToTieTo._behaviors.validMsg["ECAP_PRICE_____20_____1"] = jsonTierMsg["-1"];
                                dataToTieTo._behaviors.isError["ECAP_PRICE_____20_____1"] = true;
                            }
                        }

                        if (jsonTierMsg[tierNumber] != null && jsonTierMsg[tierNumber] != undefined) {
                            // Set the validation message
                            dataToTieTo._behaviors.validMsg[atrbToSetErrorTo] = jsonTierMsg[tierNumber];
                            dataToTieTo._behaviors.isError[atrbToSetErrorTo] = true;
                        } else {
                            // Delete the tier-specific validation if it doesn't tie to this specific tier
                            delete dataToTieTo._behaviors.validMsg[atrbToSetErrorTo];
                            delete dataToTieTo._behaviors.isError[atrbToSetErrorTo];
                        }
                    } catch (e) {
                        // not Valid Json String
                    }
                }
            }
        }

        $scope.isPivotable = function () {

            if (!$scope.curPricingTable) return false;

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" ||
                $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
                var pivotFieldName = "NUM_OF_TIERS";
                return !!$scope.curPricingTable[pivotFieldName];        //For code review - Note: is this redundant?  can't we just have VT and KIT always return true?  VT will always have a num of tiers.  If actually not redundant then we need to do similar for KIT deal type
            }

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                return true;
            }
        }
        $scope.numOfPivot = function (dataItem) {
            if ($scope.curPricingTable === undefined) return 1;

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" ||
                $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {

                var pivotFieldName = "NUM_OF_TIERS";
                // if dataItem has numtiers return it do not calculate and update here. pricingTableController.js pivotKITDeals will take care of updating correct NUM_TIERS
                if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" && !!dataItem && !!dataItem["PTR_USER_PRD"]) {
                    if (dataItem["NUM_OF_TIERS"] !== undefined) return dataItem["NUM_OF_TIERS"];
                    var pivotVal = dataItem["PTR_USER_PRD"].split(",").length;  //KITTODO: do we have a better way of calculating number of rows without splitting PTR_USER_PRD?
                    dataItem['NUM_OF_TIERS'] = pivotVal;  //KITTODO: not sure if necessary to set num of tiers at ptr level, but it appears to be expected when applying red validation markers to various dim rows (saveEntireContractRoot()'s call of MapTieredWarnings())
                    return pivotVal;
                }

                if (!$scope.isPivotable()) return 1;

                if (dataItem === undefined) {
                    return $scope.curPricingTable[pivotFieldName] === undefined ? 1 : parseInt($scope.curPricingTable[pivotFieldName]);
                }

                if (!!dataItem[pivotFieldName]) return parseInt(dataItem[pivotFieldName]);      //if dataItem (ptr) has its own num tiers atrb


                //VT deal type
                var pivotVal = $scope.curPricingTable[pivotFieldName];

                return pivotVal === undefined ? 1 : parseInt(pivotVal);
            }

            return 1;   //num of pivot is 1 for undim deal types
        }

        // If Tender and ECAP get the CAP value from Product JSON, if more than one product assign CAP, YCS2 value of first product only.
        $scope.assignProductProprties = function (data) {
            if ($scope.isTenderContract && $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "ECAP") {
                for (var d = 0; d < data.length; d++) {

                    if (angular.equals(data[d], {}) || data[d]["PTR_SYS_PRD"] === "" || data[d]["PTR_USER_PRD"] === null || typeof (data[d]["PTR_USER_PRD"]) == 'undefined') continue;;

                    // product JSON
                    var productJSON = JSON.parse(data[d]["PTR_SYS_PRD"]);
                    var sysProduct = [];

                    var productArray = [];
                    for (var key in productJSON) {
                        if (productJSON.hasOwnProperty(key)) {
                            angular.forEach(productJSON[key], function (item) {
                                sysProduct.push(item);
                            });
                        }
                    }
                    // Take the first product
                    var contractProduct = data[d]["PTR_USER_PRD"].split(',')[0];
                    sysProduct = sysProduct.filter(function (x) {
                        return x.USR_INPUT === contractProduct || x.HIER_VAL_NM === contractProduct;
                    });

                    data[d]["CAP"] = sysProduct.length !== 0 ? sysProduct[0]["CAP"] : "";
                    data[d]["YCS2"] = sysProduct.length !== 0 ? sysProduct[0]["YCS2"] : "";
                }
            }
            return data;
        }

        $scope.pivotData = function (data) {        //convert how we save data in MT to UI spreadsheet consumable format
            data = $scope.assignProductProprties(data);
            if (!$scope.isPivotable()) return data;
            var newData = [];

            for (var d = 0; d < data.length; d++) {
                // Tiered data
                var productJSON = data[d]["PTR_SYS_PRD"] !== undefined && data[d]["PTR_SYS_PRD"] !== null && data[d]["PTR_SYS_PRD"] !== "" ? JSON.parse(data[d]["PTR_SYS_PRD"]) : [];
                var numTiers = $scope.numOfPivot(data[d]);
                for (var t = 1; t <= numTiers; t++) {
                    var lData = util.deepClone(data[d]);
                    if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" ||
                        $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
                        // Set attribute Keys for adding dimensions
                        let endKey;
                        let strtKey;
                        if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                            endKey = "END_VOL"; strtKey = "STRT_VOL";
                        }
                        else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER") {
                            endKey = "END_REV"; strtKey = "STRT_REV";
                        }
                        else { // DENSITY
                            endKey = "END_PB"; strtKey = "STRT_PB";
                        }
                        // Vol-tier specific cols with tiers
                        for (var i = 0; i < tierAtrbs.length; i++) {
                            var tieredItem = tierAtrbs[i];
                            lData[tieredItem] = lData[tieredItem + "_____10___" + t];

                            mapTieredWarnings(data[d], lData, tieredItem, tieredItem, t);

                            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX") {
                                // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                                if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                                    lData[endKey] = kendo.toString(parseInt(lData[endKey] || 0), "n0");
                                }
                            }
                            else {
                                // HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                                if (tieredItem === endKey && lData[endKey] !== undefined && lData[endKey].toString().toUpperCase() !== "UNLIMITED") {
                                    lData[endKey] = kendo.toString(parseFloat(lData[endKey] || 0), "n2");
                                }
                            }

                        }
                        // Disable all Start vols except the first if there is no tracker, else disable them all
                        if (!!data[d]._behaviors && ((t === 1 && data[d].HAS_TRACKER === "1") || t !== 1)) {
                            if (!data[d]._behaviors.isReadOnly) {
                                data[d]._behaviors.isReadOnly = {};
                            }
                            lData._behaviors.isReadOnly[strtKey] = true;
                        }
                        // Disable all End volumes except for the last tier if there is a tracker
                        if (!!data[d]._behaviors && data[d].HAS_TRACKER === "1") {
                            if (t !== numTiers) {
                                if (!data[d]._behaviors.isReadOnly) {
                                    data[d]._behaviors.isReadOnly = {};
                                }
                                lData._behaviors.isReadOnly[endKey] = true;
                            }
                        }
                    } else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                        // KIT specific cols with 'tiers'
                        for (var i = 0; i < $scope.kitDimAtrbs.length; i++) {
                            var tieredItem = $scope.kitDimAtrbs[i];
                            lData[tieredItem] = lData[tieredItem + "_____20___" + (t - 1)]; //-1 because KIT dim starts at 0 whereas VT num tiers begin at 1
                            if (tieredItem == "TIER_NBR") {
                                lData[tieredItem] = t; // KIT add tier number
                                if (lData[tieredItem] != 1) {
                                    lData['DEAL_GRP_NM'] = null;
                                }
                            }
                            mapTieredWarnings(data[d], lData, tieredItem, tieredItem, (t - 1));
                        }

                        lData["TEMP_TOTAL_DSCNT_PER_LN"] = $scope.calculateTotalDsctPerLine(lData["DSCNT_PER_LN_____20___" + (t - 1)], lData["QTY_____20___" + (t - 1)]);
                        lData["TEMP_KIT_REBATE"] = $scope.calculateKitRebate(data, d, numTiers, true);
                        if (productJSON.length !== 0) {
                            angular.forEach(productJSON, function (value, key) {
                                var bckt = data[d]["PRD_BCKT" + "_____20___" + (t - 1)];
                                if (bckt !== undefined && key.toUpperCase() === bckt.toUpperCase()) {
                                    lData["CAP"] = value[0]["CAP"];
                                    lData["YCS2"] = value[0]["YCS2"];
                                }
                            });
                        }
                    }
                    newData.push(lData);
                }
            }
            return newData;
        }

        $scope.calculateTotalDsctPerLine = function (dscntPerLine, qty) {
            return (parseFloat(dscntPerLine) * parseInt(qty) || 0);
        }

        $scope.calculateKitRebate = function (data, firstTierRowIndex, numOfTiers, isDataPivoted) {
            var kitRebateTotalVal = 0;
            for (var i = 0; i < numOfTiers; i++) {
                if (isDataPivoted) {
                    var qty = (parseFloat(data[firstTierRowIndex]["QTY_____20___" + i]) || 0);
                    kitRebateTotalVal += (qty * parseFloat(data[firstTierRowIndex]["ECAP_PRICE_____20___" + i]) || 0);
                } else if (i < data.length) {
                    var qty = (parseFloat(data[(firstTierRowIndex + i)]["QTY"]) || 0);
                    kitRebateTotalVal += (qty * parseFloat(data[(firstTierRowIndex + i)]["ECAP_PRICE"]) || 0);
                }
            }
            var rebateVal = (kitRebateTotalVal - parseFloat(data[firstTierRowIndex]["ECAP_PRICE_____20_____1"])) // Kit rebate - KIT ECAP (tier of "-1")
            return rebateVal; // kendo.toString(rebateVal, "$#,##0.00;-$#,##0.00");
        }

        $scope.deNormalizeData = function (data) {      //convert how we keep data in UI to MT consumable format
            if (!$scope.isPivotable()) return data;
            var a;
            var newData = [];
            var lData = {};
            var tierDimKey = "_____10___";
            var prodDimKey = "_____20___";

            var dimKey;
            var dimAtrbs;
            var isKit = 0;

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "FLEX" ||
                $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "REV_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "DENSITY") {
                dimKey = tierDimKey;
                dimAtrbs = tierAtrbs;
            }
            else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                dimKey = prodDimKey;
                dimAtrbs = $scope.kitDimAtrbs;
                isKit = 1;
            }

            for (var d = 0; d < data.length; d) {
                var numTiers = $scope.numOfPivot(data[d]);      //KITTODO: rename numTiers to more generic var name for kit deals?

                for (var t = 1 - isKit; t <= numTiers - isKit; t++) { // each tier
                    if (t === 1 - isKit) { lData = data[d]; }
                    for (a = 0; a < dimAtrbs.length; a++) { // each tiered attribute
                            lData[dimAtrbs[a] + dimKey + t] = data[d][dimAtrbs[a]];

                        if (t === numTiers - isKit) { // last tier
                            delete lData[dimAtrbs[a]];

                            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT" ) {
                                // Clear out the dimensions of the not-in-use tiers because KIT has dynamic tiering,
                                //		which might leave those dimensions with data, and save stray attributes with no product association in our db.
                                for (var i = 0; i < $scope.maxKITproducts; i++) {
                                    var tierToDel = (t + 1 + i);
                                    lData[dimAtrbs[a] + dimKey + tierToDel] = "";
                                }
                            }
                        }
                    }
                    // NOTE: the length of the data is the number of rows. But we need to iterate by the number of
                    //		normalized rows (which we are creating now) due to tiered dimensions in VOL-TIER and KIT.
                    //		Hence why we increment d and break on d === data.length manually.
                    //		Basically,  this d-incrementing code is mimicking a skip of rows in "data" that are not of tier_nbr 1.
                    //		But also we can't just put a "tier_nbr != 1" check because we still need to use data[d] of each corresponding tier.
                    d++;
                    if (d === data.length) {
                        break;
                    }
                }
                newData.push(lData);
            }

            return newData;
        }

        $scope.myDealsValidation = function (isError, msg, isReq) {
            return {
                comparerType: "custom",
                dataType: "custom",
                from: "=MYDEALS_ERROR(" + isError + ")",
                type: "warning",
                allowNulls: !isReq,
                messageTemplate: msg
            };
        };

        $scope.renameMapping = {};

        $scope.updateResults = function (data, source) {
            $scope.renameMapping = {};
            var i, p;
            if (data !== undefined && data !== null) {
                // look for actions -> this has to be first because remapping might happen
                for (i = 0; i < data.length; i++) {
                    if (data[i]["_actions"] !== undefined) {
                        var actions = data[i]["_actions"];
                        for (var a = 0; a < actions.length; a++) {
                            if (actions[a]["Action"] === "ID_CHANGE") {
                                if (Array.isArray(source)) {
                                    for (p = 0; p < source.length; p++) {
                                        $scope.mapActionIdChange(source[p], actions[a]);
                                    }
                                } else {
                                    $scope.mapActionIdChange(source, actions[a]);
                                }
                            }
                        }
                    }
                }

                // Now look for items that need to be updated
                for (i = 0; i < data.length; i++) {
                    if (data[i]["DC_ID"] !== undefined && data[i]["DC_ID"] !== null) {
                        if (Array.isArray(source)) {
                            for (p = 0; p < source.length; p++) {
                                if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = $scope.renameMapping[data[i]["DC_ID"]];
                                if (data[i]["DC_ID"] === source[p]["DC_ID"]) {
                                    $scope.mapProperty(source[p], data[i]);
                                }
                            }
                        } else {
                            if (data[i]["DC_ID"] <= 0) data[i]["DC_ID"] = $scope.renameMapping[data[i]["DC_ID"]];
                            if (data[i]["DC_ID"] === source["DC_ID"]) $scope.mapProperty(source, data[i]);
                        }
                    }
                }
            }
        }
        $scope.mapProperty = function (src, data) {
            if ($scope.isPivotable()) {
                var srcTierNum = parseInt(src.TIER_NBR);
                var dataTierNum = parseInt(data.TIER_NBR);
                if (src["DC_ID"] === data["DC_ID"] && (!srcTierNum && dataTierNum === 1 || srcTierNum === dataTierNum)) {
                    var arItems = data;
                    for (var key in arItems) {
                        if (arItems.hasOwnProperty(key) && data[key] !== undefined)
                            src[key] = data[key];
                    }
                }
            } else {
                if (src["DC_ID"] === data["DC_ID"]) {
                    var arItems = data;
                    for (var key in arItems) {
                        if (arItems.hasOwnProperty(key) && data[key] !== undefined)
                            src[key] = data[key];
                    }
                }
            }
        }
        $scope.mapActionIdChange = function (src, action) {
            if (src["DC_ID"] === action["DcID"]) {
                $scope.renameMapping[src["DC_ID"]] = action["AltID"];
                src["DC_ID"] = action["AltID"];
            }
        }

        $scope.delPtrs = function (delIds) {
            //$scope.saveEntireContractRoot($state.current.name, true, true, 'contract.manager.strategy.wip', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
            $scope.saveEntireContractBase($state.current.name, true, true, null, null, delIds); // DE55623, force publish as well, used to pass ($state.current.name, false, false, null, null, delIds)
        }

        $scope.saveEntireContract = function (deletePtr, forceValidation, forcePublish) {
            $scope.saveEntireContractBase($state.current.name, forceValidation, forcePublish, null, null, deletePtr);
        }
        $scope.getCustId = function () {
            return $scope.contractData['CUST_MBR_SID'];
        }

        $scope.checkForMessages = function (collection, key, data) {
            var isValid = true;
            if (data.data[key] !== undefined) {
                for (var i = 0; i < data.data[key].length; i++) {
                    if (data.data[key][i].DC_ID !== undefined &&
                        data.data[key][i].DC_ID === collection.DC_ID &&
                        data.data[key][i].warningMessages.length > 0) {
                        angular.forEach(data.data[key][i]._behaviors.validMsg,
                            function (value, key) {
                                collection._behaviors.validMsg[key] = value;
                                collection._behaviors.isError[key] = value !== "";
                                isValid = false;
                            });
                    }
                }
            }

            //
            // TODO: Consolidate all the messages warning and errors show in the Validation summary panel ??
            return isValid;
        }

        $scope.saveUpperContract = function () {
            $scope.saveEntireContractRoot($state.current.name,
                false,
                false,
                false,
                false,
                false,
                false,
                true);
        }
        $scope.createTenderContract = function (ct) {
            //Adding TENDER_PUBLISHED for Tender Contract
            ct.TENDER_PUBLISHED = 0;

            //Cloning PS
            var ps = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
            ps.DC_ID = $scope.uid--;
            ps.DC_PARENT_ID = ct.DC_ID;
            ps.PRC_TBL = [];

            // Clone base model and populate changes
            var pt = util.clone($scope.templates.ObjectTemplates.PRC_TBL[$scope.newPricingTable.OBJ_SET_TYPE_CD]);
            if (!pt) {
                $scope.addTableDisabled = false;
                logger.error("Could not create the " + $scope.ptTitle + ".", "Error");
                $scope.setBusy("", "");
                return;
            }

            pt.DC_ID = $scope.uid--;
            pt.DC_PARENT_ID = $scope.curPricingStrategy.DC_ID;
            pt.OBJ_SET_TYPE_CD = $scope.newPricingTable.OBJ_SET_TYPE_CD;

            for (var atrb in $scope.newPricingTable._extraAtrbs) {
                if ($scope.newPricingTable._extraAtrbs.hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {
                    //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                    pt[atrb] = $scope.newPricingTable._extraAtrbs[atrb].value;
                }
            }
            for (var atrb in $scope.newPricingTable._defaultAtrbs) {
                if ($scope.newPricingTable._defaultAtrbs.hasOwnProperty(atrb) &&
                    pt.hasOwnProperty(atrb)) {
                    //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                    if (Array.isArray($scope.newPricingTable._defaultAtrbs[atrb].value)) {
                        //Array, Middle Tier expects a comma separated string
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value.join();
                    } else {
                        //String
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value;
                    }
                }
            }

            var data = {
                "Contract": [ct],
                "PricingStrategy": [ps],
                "PricingTable": [pt],
                "PricingTableRow": [],
                "WipDeals": [],
                "EventSource": "",
                "Errors": {}
            }

            objsetService.createTenderContract($scope.getCustId(), $scope.contractData.DC_ID, data).then(
                function (data) {
                    $scope.updateResults(data.data.CNTRCT, ct);

                    $scope.updateResults(data.data.PRC_ST, ps);

                    if ($scope.contractData.PRC_ST === undefined) $scope.contractData.PRC_ST = [];
                    $scope.contractData.PRC_ST.push(ps);
                    $scope.showAddPricingTable(ps);


                    $scope.updateResults(data.data.PRC_TBL, pt); //?? needed?
                    //Check for errors
                    if (!$scope.checkForMessages(ct, "CNTRCT", data)) {
                        $scope.setBusy("Save unsuccessful", "Could not create the Tender Folio", "Error");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        return;
                    };

                    if (hasUnSavedFiles) {
                        $scope.uploadFile();
                    } else {
                        $timeout(function () {
                            $scope._dirty = false; // don't want to kick of listeners

                            $uibModalStack.dismissAll();//Closing Tender Folio Popup

                            $state.go('contract.manager.strategy', {
                                cid: $scope.contractData.DC_ID,
                                sid: pt.DC_PARENT_ID,
                                pid: pt.DC_ID
                            }, { reload: true }); // HACK: workaround for the bug where the "view more options" button is un-click-able after saving


                        });
                    }
                    $scope.setBusy("Save Successful", "Saved the Tender Folio", "Success");

                    $scope.setBusy("", "");
                },
                function (result) {
                    logger.error("Could not create the Tender Folio", result, result.statusText);
                    $scope.setBusy("", "");
                }
            );
            return true;
        }
        $scope.saveContract = function () {
            if ($scope.isTenderContract) {
                $scope.setBusy("Saving Tender Folio", "Saving the Tender Folio Information");
            } else {
                $scope.setBusy("Saving Contract", "Saving the Contract Information");
            }

            // Contract Data
            var ct = $scope.contractData;

            // check for NEW contract
            if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;
            if ($scope.isTenderContract) {
                $scope.createTenderContract(ct); // Creating Tender Contract
            }
            else {
                // Add to DB first... then add to screen
                objsetService.createContract($scope.getCustId(), $scope.contractData.DC_ID, ct).then(
                    function (data) {
                        $scope.updateResults(data.data.CNTRCT, ct);

                        //Check for errors
                        if (!$scope.checkForMessages(ct, "CNTRCT", data)) {
                            $scope.setBusy("Save unsuccessful", "Could not create the contract", "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        };

                        $scope.setBusy("Save Successful", "Saved the contract", "Success");

                        if (hasUnSavedFiles) {
                            $scope.uploadFile();
                        } else {
                            $timeout(function () {
                                $scope._dirty = false; // don't want to kick of listeners
                                $state.go('contract.manager',
                                    {
                                        cid: $scope.contractData.DC_ID
                                    },
                                    { reload: true });
                            });
                        }
                        $scope.setBusy("", "");
                    },
                    function (result) {
                        logger.error("Could not create the contract.", result, result.statusText);
                        $scope.setBusy("", "");
                    }
                );
            }
        }

        $scope.copyContract = function () {
            $scope.setBusy("Copy Contract", "Copying the Contract Information");

            // Contract Data
            var ct = $scope.contractData;

            // check for NEW contract
            if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

            // Add to DB first... then add to screen
            objsetService.copyContract($scope.getCustId(), $scope.contractData.DC_ID, $scope.copyContractData.DC_ID, ct).then(
                function (data) {
                    $scope.updateResults(data.data.CNTRCT, ct);

                    //Check for errors
                    if (!$scope.checkForMessages(ct, "CNTRCT", data)) {
                        $scope.setBusy("Copy Unsuccessful", "Could not copy the contract", "Error");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        return;
                    };

                    $scope.setBusy("Copy Successful", "Copied the contract", "Success");

                    $timeout(function () {
                        $scope._dirty = false; // don't want to kick of listeners
                        $state.go('contract.manager',
                            {
                                cid: $scope.contractData.DC_ID
                            },
                            { reload: true });
                    });

                    $scope.setBusy("", "");
                },
                function (result) {
                    logger.error("Could not create the contract.", result, result.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.isValid = true;
        $scope.customContractValidate = function () {
            $scope.isValid = true;
            var ct = $scope.contractData;
            var maximumDate = moment(ct.START_DT).add(20, 'years').format('l');
            // If user has clicked on save, that means he has accepted the default contract name set, make it dirty to avoid any changes to dates making a change to contract name.
            if (!$scope.contractData._behaviors) $scope.contractData._behaviors = {};
            $scope.contractData._behaviors.isDirty['TITLE'] = true;

            if (!$scope.contractData.CUST_MBR_SID) {
                $scope.contractData._behaviors.validMsg["CUST_MBR_SID"] = "Please select a valid customer";
                $scope.contractData._behaviors.isError["CUST_MBR_SID"] = true;
                $scope.isValid = false;
            } else if (moment(ct.END_DT) > moment('2099/12/31').add(0, 'years')) {
                $scope.contractData._behaviors.validMsg["END_DT"] = "Please select a date before 2099/12/31";
                $scope.contractData._behaviors.isError["END_DT"] = true;
                $scope.isValid = false;
            }
            else if (moment(ct.END_DT).isBefore(ct.START_DT) || moment(ct.END_DT).isAfter(maximumDate)) {
                $scope.contractData._behaviors
                    .validMsg['END_DT'] = moment(ct.END_DT).isAfter(maximumDate)
                        ? "End date cannot be greater than - " + maximumDate
                        : "End date cannot be less than Start Date";
                $scope.contractData._behaviors.isError["END_DT"] = true;
                $scope.isValid = false;
            }
            else {
                $scope.contractData._behaviors.validMsg["CUST_MBR_SID"] = "";
                $scope.contractData._behaviors.isError["CUST_MBR_SID"] = false;
                $scope.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
                $scope.contractData._behaviors.isError["C2A_DATA_C2A_ID"] = false;
            }

            // Clear all values
            angular.forEach($scope.contractData,
                function (value, key) {
                    // Do not clear the custom validations user has to correct them e.g contract name duplicate
                    if (ct._behaviors.validMsg[key] === "" ||
                        ct._behaviors.validMsg[key] === "* field is required" ||
                        ct._behaviors.validMsg[key] === undefined) {
                        ct._behaviors.validMsg[key] = "";
                        ct._behaviors.isError[key] = false;
                        if (ct[key] === null) ct[key] = "";
                        // Special handling for CUST_MBR_SID only field where user can make it null by clearing combobox
                    }
                });

            // Check required
            angular.forEach($scope.contractData,
                function (value, key) {
                    if (key[0] !== '_' &&
                        value !== undefined &&
                        value !== null &&
                        !Array.isArray(value) &&
                        typeof (value) !== "object" &&
                        (typeof (value) === "string" && value.trim() === "") &&
                        ct._behaviors.isRequired[key] === true &&
                        ct._behaviors.validMsg[key] === "") {
                        ct._behaviors.validMsg[key] = "* field is required";
                        ct._behaviors.isError[key] = true;
                        $scope.isValid = false;
                    }
                    if (ct._behaviors.validMsg[key] !== "") {
                        $scope.isValid = false;
                    }
                });

            $scope.contractData._behaviors.isError["CUST_ACCNT_DIV_UI"] = $scope.contractData._behaviors
                .isError["CUST_ACCNT_DIV"];
            $scope.contractData._behaviors.validMsg["CUST_ACCNT_DIV_UI"] = $scope.contractData._behaviors
                .validMsg["CUST_ACCNT_DIV"];

            if ($scope.contractData.IsAttachmentRequired && (!hasFiles && !hasUnSavedFiles)) {
                $scope.contractData.AttachmentError = true;
                $scope.isValid = false;
            }

            if ($scope.isValid) {
                if ($scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] == false && $scope.contractData.CUST_ACCNT_DIV == "") {
                    kendo.confirm("The division is blank. Do you intend for this contract to apply to all divisions ?").then(function () {
                        if ($scope.isCopyContract) {
                            $scope.copyContract();
                        } else {
                            $scope.saveContract();
                        }
                    },
                        function () {
                            return;
                        });
                }
                else {
                    if ($scope.isCopyContract) {
                        $scope.copyContract();
                    } else {
                        $scope.saveContract();
                    }
                }
            } else {
                $timeout(function () {
                    if (!!$("input.isError")[0]) $("input.isError")[0].focus();
                },
                    300);
            }
        }

        $scope.quickSaveContract = function (rtnFunc, param, param2) {
            $scope.setBusy("Saving Contract", "Saving the Contract Information");

            // Contract Data
            var ct = $scope.contractData;

            objsetService.createContract($scope.getCustId(), $scope.contractData.DC_ID, ct).then(
                function (data) {
                    $scope.updateResults(data.data.CNTRCT, ct);
                    $scope.setBusy("Save Successful", "Saved the contract", "Success");
                    if (!!rtnFunc) {
                        rtnFunc(param, param2);
                        return;
                    };
                    $scope.setBusy("", "");
                },
                function (result) {
                    logger.error("Could not create the contract.", result, result.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        // **** NEW PRICING STRATEGY Methods ****
        //
        $scope.newStrategy = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
        $scope.addPricingStrategy = function () {

            $scope.setBusy("Saving...", "Saving the " + $scope.psTitle, "Info", true);

            var ct = $scope.contractData;

            // Clone base model and populate changesmod
            var ps = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
            ps.DC_ID = $scope.uid--;
            ps.DC_PARENT_ID = ct.DC_ID;
            ps.PRC_TBL = [];
            ps.TITLE = $scope.newStrategy.TITLE;
            ps.IS_HYBRID_PRC_STRAT = ($scope.newStrategy.IS_HYBRID_PRC_STRAT === true ? 1 : 0);

            // Add to DB first... then add to screen
            objsetService.createPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps).then(
                function (data) {
                    $scope.updateResults(data.data.PRC_ST, ps);

                    if ($scope.contractData.PRC_ST === undefined) $scope.contractData.PRC_ST = [];
                    $scope.contractData.PRC_ST.push(ps);
                    $scope.showAddPricingTable(ps);
                    $scope.setBusy("Save Successful", "Added " + $scope.psTitle, "Success");
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 1000);
                    $scope.newStrategy.TITLE = "";
                    $scope.newStrategy.IS_HYBRID_PRC_STRAT = true;
                    $scope.curPricingStrategy = ps;
                    $scope.curPricingStrategyId = ps.DC_ID;
                    $scope.addStrategyDisabled = false;
                    $scope.refreshContractData($scope.curPricingStrategyId);
                },
                function (response) {
                    $scope.addStrategyDisabled = false;
                    logger.error("Could not create the " + $scope.psTitle + ".", response, response.statusText);
                    $scope.setBusy("", "");
                });
        }
        $scope.customAddPsValidate = function () {
            var isValid = true;
            $scope.addStrategyDisabled = true;

            // Clear all values
            angular.forEach($scope.newStrategy,
                function (value, key) {
                    $scope.newStrategy._behaviors.validMsg[key] = "";
                    $scope.newStrategy._behaviors.isError[key] = false;
                });

            // Check required
            angular.forEach($scope.newStrategy,
                function (value, key) {
                    if (key[0] !== '_' &&
                        !Array.isArray(value) &&
                        (value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                        $scope.newStrategy._behaviors.isRequired[key] === true) {
                        $scope.newStrategy._behaviors.validMsg[key] = "* field is required";
                        $scope.newStrategy._behaviors.isError[key] = true;
                        isValid = false;
                    }
                });

            // Check unique name
            if ($scope.contractData.PRC_ST === undefined) {
                $scope.contractData.PRC_ST = [];
            }
            var isUnique = $scope.IsUniqueInList($scope.contractData.PRC_ST, $scope.newStrategy["TITLE"], "TITLE", false);
            if (!isUnique) {
                $scope.newStrategy._behaviors.validMsg["TITLE"] = "* must have unique name within contract";
                $scope.newStrategy._behaviors.isError["TITLE"] = true;
                isValid = false;
            }

            // Check name length
            if ($scope.newStrategy["TITLE"].length > 80) {
                $scope.newStrategy._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
                $scope.newStrategy._behaviors.isError["TITLE"] = true;
                isValid = false;
            }

            if (isValid) {
                $scope.addPricingStrategy();
            } else {
                $scope.addStrategyDisabled = false;
            }
        }

        $scope.IsUniqueInList = function (listToCheck, value, keyToCompare, checkForDouble) {
            // Check unique name
            var count = 0;
            if (!listToCheck) return true;

            for (var i = 0; i < listToCheck.length; i++) {
                if (!!listToCheck[i][keyToCompare] && !!value && value.toLowerCase() === listToCheck[i][keyToCompare].toLowerCase()) { //!! is same as checking undefined
                    if (checkForDouble) { // having one in he list is okay, but 2 is a no
                        count += 1;
                        if (count >= 2) {
                            return false;
                        }
                    } else {
                        // not checking doubles, so any if there is any in the list, then return false
                        return false;
                    }
                }
            }
            return true;
        }


        $scope.$on('refreshContractData', function (event, args) {
            $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);
        });

        $scope.$on('refreshNoWipData', function (event, args) {
            $scope._dirty = false; // don't want to kick of listeners
            $state.go('contract.manager.strategy', {
                cid: $scope.contractData.DC_ID,
                sid: $scope.curPricingStrategy.DC_ID,
                pid: $scope.curPricingTable.DC_ID
            }, { reload: true }); // HACK: workaorund for the bug where the "view more options" button is unclickable after saving
        });

        $scope.$on('btnPctMctRunning', function (event, args) {
            $scope.setBusy("Running", "Price Cost Test and Meet Comp Test.", "Info", true);
        });

        $scope.$on('btnPctMctComplete', function (event, args) {
            $scope.setBusy("Complete", "Reloading the page now.", "Success");
            $timeout(function () {
                $scope.setBusy("", "");
            }, 2000);
        });

        // **** NEW/EDIT PRICING TABLE Methods ****
        //
        $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.ECAP);
        $scope.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type so it does not inherit from clone
        $scope.addPricingTable = function () {

            $scope.setBusy("Saving...", "Saving " + $scope.ptTitle, "Info");

            // Clone base model and populate changes
            var pt = util.clone($scope.templates.ObjectTemplates.PRC_TBL[$scope.newPricingTable.OBJ_SET_TYPE_CD]);
            if (!pt) {
                $scope.addTableDisabled = false;
                logger.error("Could not create the " + $scope.ptTitle + ".", "Error");
                $scope.setBusy("", "");
                return;
            }

            pt.DC_ID = $scope.uid--;
            pt.DC_PARENT_ID = $scope.curPricingStrategy.DC_ID;
            pt.OBJ_SET_TYPE_CD = $scope.newPricingTable.OBJ_SET_TYPE_CD;
            pt.TITLE = $scope.newPricingTable.TITLE;
            pt.IS_HYBRID_PRC_STRAT = pt.IS_HYBRID_PRC_STRAT !== undefined ? $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT : "";

            for (var atrb in $scope.newPricingTable._extraAtrbs) {
                if ($scope.newPricingTable._extraAtrbs.hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {
                    //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                    pt[atrb] = $scope.newPricingTable._extraAtrbs[atrb].value;
                }
            }
            for (var atrb in $scope.newPricingTable._defaultAtrbs) {
                if ($scope.newPricingTable._defaultAtrbs.hasOwnProperty(atrb) &&
                    pt.hasOwnProperty(atrb)) {
                    //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                    if (Array.isArray($scope.newPricingTable._defaultAtrbs[atrb].value)) {
                        //Array, Middle Tier expects a comma separated string
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value.join();
                    } else {
                        //String
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value;
                    }
                }
            }

            // Add to DB first... then add to screen
            objsetService.createPricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt).then(
                function (data) {
                    $scope.updateResults(data.data.PRC_TBL, pt);
                    $scope.setBusy("Saved", "Redirecting you to the " + $scope.contractType + " Editor");
                    $scope._dirty = false;
                    //$scope.addTableDisabled = false;  //commented out, as we are routing we away anyways we do not need to re-enable this, leaving this in also allows users to potentially add the same table twice, creating duplicates
                    // load the screen
                    $state.go('contract.manager.strategy', {
                        cid: $scope.contractData.DC_ID,
                        sid: pt.DC_PARENT_ID,
                        pid: pt.DC_ID
                    }, { reload: true }); // HACK: workaorund for the bug where the "view more options" button is unclickable after saving
                },
                function (response) {
                    $scope.addTableDisabled = false;
                    logger.error("Could not create the " + $scope.ptTitle + ".", response, response.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.editPricingTable = function () {
            $scope.setBusy("Saving...", "Saving " + $scope.ptTitle, "Info", true);

            // Clone base model and populate changes
            var pt = util.clone($scope.currentPricingTable);

            for (var atrb in $scope.newPricingTable._defaultAtrbs) {
                if ($scope.newPricingTable._defaultAtrbs.hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {  //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                    if (Array.isArray($scope.newPricingTable._defaultAtrbs[atrb].value)) {
                        //Array, Middle Tier expects a comma separated string
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value.join();
                        $scope.currentPricingTable[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value.join();
                    } else {
                        //String
                        pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value;
                        $scope.currentPricingTable[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value;
                    }
                }
            }

            objsetService.updatePricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt).then(
                function (data) {
                    $scope.updateResults(data.data.PRC_TBL, pt); //?? needed?

                    $scope.addTableDisabled = false;
                    //$scope.curPricingTable = pt;
                    //var seeme = $scope.curPricingTable
                    //$scope.curPricingTableId = pt.DC_ID;

                    logger.success("Edited " + $scope.ptTitle, pt, "Save Successful");
                    $scope.setBusy("", "");
                },
                function (response) {
                    $scope.addTableDisabled = false;
                    logger.error("Could not edit the " + $scope.ptTitle + "e " + pt.DC_ID, response, response.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

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

        $scope.customEditPtValidate = function () {
            var isValid = true;
            $scope.addTableDisabled = true;

            // Check required
            angular.forEach($scope.newPricingTable,
                function (value, key) {
                    if (key[0] !== '_' && !Array.isArray(value) && (value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) && $scope.newPricingTable._behaviors.isRequired[key] === true) {
                        $scope.newPricingTable._behaviors.validMsg[key] = "* field is required";
                        $scope.newPricingTable._behaviors.isError[key] = true;
                        isValid = false;
                    }
                });

            // No check for defaultatribs because they are optional
            if (isValid) {
                $scope.editPricingTable();
            } else {
                $scope.addTableDisabled = false;
            }
        }

        $scope.customAddPtValidate = function () {
            var isValid = true;
            $scope.addTableDisabled = true;

            // Clear all values
            angular.forEach($scope.newPricingTable,
                function (value, key) {
                    $scope.newPricingTable._behaviors.validMsg[key] = "";
                    $scope.newPricingTable._behaviors.isError[key] = false;
                });

            // Check required
            angular.forEach($scope.newPricingTable,
                function (value, key) {
                    if (key[0] !== '_' &&
                        !Array.isArray(value) &&
                        (!isNaN(value) || value === undefined || value === null || (typeof (value) === "string" && value.trim() === "")) &&
                        $scope.newPricingTable._behaviors.isRequired[key] === true) {
                        $scope.newPricingTable._behaviors.validMsg[key] = "* field is required";
                        $scope.newPricingTable._behaviors.isError[key] = true;
                        isValid = false;
                    }
                });

            // Check unique name within ps
            if (!!$scope.curPricingStrategy) {
                if ($scope.curPricingStrategy.PRC_TBL === undefined) {
                    $scope.curPricingStrategy.PRC_TBL = [];
                }
                var isUnique = $scope.IsUniqueInList($scope.curPricingStrategy.PRC_TBL, $scope.newPricingTable["TITLE"], "TITLE", false);

                if (!isUnique) {
                    $scope.newPricingTable._behaviors.validMsg["TITLE"] = "* must have unique name within strategy";
                    $scope.newPricingTable._behaviors.isError["TITLE"] = true;
                    isValid = false;
                }
            }

            // Check name length
            if ($scope.newPricingTable["TITLE"].length > 80) {
                $scope.newPricingTable._behaviors.validMsg["TITLE"] = "* must be 80 characters or less";
                $scope.newPricingTable._behaviors.isError["TITLE"] = true;
                isValid = false;
            }

            // Check Extra atribs
            angular.forEach($scope.newPricingTable["_extraAtrbs"],
                function (value, key) {
                    if (key !== "_dirty") {
                        if (value.isRequired === true && (value.value === undefined || value.value === "")) {
                            value.validMsg = "* field is required";
                            value.isError = true;
                            isValid = false;
                        } else {
                            value.isError = false;
                        }
                    }
                });

            // Check if there is a selected deal type
            if ($scope.newPricingTable.OBJ_SET_TYPE_CD == "") {
                $scope.newPricingTable._behaviors.validMsg["OBJ_SET_TYPE_CD"] = "* please select a deal type";
                $scope.newPricingTable._behaviors.isError["OBJ_SET_TYPE_CD"] = true;
                isValid = false;
            }

            if (isValid) {
                $scope.addPricingTable();
            } else {
                $scope.addTableDisabled = false;
            }
        }
        $scope.newPricingTableExtraLength = function () {
            if ($scope.newPricingTable === undefined || $scope.newPricingTable._extraAtrbs === undefined) return 0;
            return Object.keys($scope.newPricingTable._extraAtrbs).length;
        }
        $scope.newPricingTableDefaultLength = function () {
            if ($scope.newPricingTable === undefined || $scope.newPricingTable._defaultAtrbs === undefined) return 0;
            return Object.keys($scope.newPricingTable._defaultAtrbs).length;
        }

        //setting a few constants for the strings that occur a lot
        var GEO = "GEO_COMBINED";
        var MRKT_SEG = "MRKT_SEG";
        
        //watch for user changing global auto-fill default values
        $scope.$watch('newPricingTable._defaultAtrbs', function (newValue, oldValue, el) {
            var dealType = $scope.newPricingTable.OBJ_SET_TYPE_CD;
            
            if (oldValue === newValue) return;

            if (oldValue != null && newValue == null) return;
            if ((oldValue == null && newValue != null) || ($scope.isTenderContract && $scope.newPricingTable["OBJ_SET_TYPE_CD"] == 'KIT')) {
                //initialize, hard coded for now, build into an admin page in future.
                var marketSegment = ($scope.isTenderContract) ? "Corp" : "All Direct Market Segments";
                if ($scope.currentPricingTable == null) {
                    if (!!newValue["REBATE_TYPE"]) newValue["REBATE_TYPE"].value = $scope.isTenderContract ? "TENDER" : "MCP";
                    if (!!newValue[MRKT_SEG]) newValue[MRKT_SEG].value = [marketSegment];
                    if (!!newValue[GEO]) newValue[GEO].value = ["Worldwide"];
                    if (!!newValue["PAYOUT_BASED_ON"]) dealType == 'FLEX' || dealType == 'REV_TIER' || dealType =='DENSITY' ? newValue["PAYOUT_BASED_ON"].value = "Billings" : newValue["PAYOUT_BASED_ON"].value = "Consumption";
                    if (!!newValue["PROGRAM_PAYMENT"]) newValue["PROGRAM_PAYMENT"].value = "Backend";
                    if (!!newValue["PROD_INCLDS"]) newValue["PROD_INCLDS"].value = "Tray";
                    if (!!newValue["FLEX_ROW_TYPE"]) newValue["FLEX_ROW_TYPE"].value = "Accrual";
                    if (!!newValue["NUM_OF_DENSITY"]) newValue["NUM_OF_DENSITY"].value = "1";
                    if (!$scope.isTenderContract && !$scope.newPricingTable["OBJ_SET_TYPE_CD"] == 'KIT') {
                        //if (!!newValue["NUM_OF_TIERS"] && !$scope.newPricingTable["OBJ_SET_TYPE_CD"] == 'KIT') newValue["NUM_OF_TIERS"].value = "1";
                        if (!!newValue["SERVER_DEAL_TYPE"] && !$scope.newPricingTable["OBJ_SET_TYPE_CD"] == 'KIT') newValue["SERVER_DEAL_TYPE"].value = "";
                    }
                    if (!!newValue["NUM_OF_TIERS"]) newValue["NUM_OF_TIERS"].value = "1";
                    if (!!newValue["NUM_OF_DENSITY"]) newValue["NUM_OF_DENSITY"].value = "1";// This is all cases, above kit is done here anyhow.
                    if ($scope.isTenderContract) { // Tenders come in without a customer defined immediately
                        // Tenders don't have a customer at this point, Default to blank for customer defaults and let pricingTable.Controller.js handle tender defaults
                        if (!!newValue["PERIOD_PROFILE"]) newValue["PERIOD_PROFILE"].value = "Yearly";
                        if (!!newValue["AR_SETTLEMENT_LVL"]) newValue["AR_SETTLEMENT_LVL"].value = ""; // Old value "Issue Credit to Billing Sold To"
                    } else {
                        if (!!newValue["PERIOD_PROFILE"]) newValue["PERIOD_PROFILE"].value =
                            ($scope.contractData.Customer == undefined) ? "" : $scope.contractData.Customer.DFLT_PERD_PRFL;
                        if (!!newValue["AR_SETTLEMENT_LVL"]) {
                            // Set AR_SETTLEMENT_LVL to customer default first, and if that is blank, then fall back on deal level rules
                            var newArSettlementValue = ($scope.contractData.Customer == undefined) ? "" : $scope.contractData.Customer.DFLT_AR_SETL_LVL;
                            if ($scope.contractData.Customer.DFLT_AR_SETL_LVL == "User Select on Deal Creation") { // If this is cust default, force it blank
                                newArSettlementValue = "";
                            } else {
                                if (newArSettlementValue == "")
                                    newArSettlementValue = ($scope.newPricingTable["OBJ_SET_TYPE_CD"] == "ECAP" ||
                                        $scope.newPricingTable["OBJ_SET_TYPE_CD"] == "KIT")
                                        ? "Issue Credit to Billing Sold To"
                                        : "Issue Credit to Default Sold To by Region";
                            }
                            newValue["AR_SETTLEMENT_LVL"].value = newArSettlementValue;
                        }
                    }
                    if (!!newValue["REBATE_OA_MAX_VOL"]) newValue["REBATE_OA_MAX_VOL"].value = "";
                    if (!!newValue["REBATE_OA_MAX_AMT"]) newValue["REBATE_OA_MAX_AMT"].value = "";

                } else {
                    if (!!newValue["REBATE_TYPE"]) newValue["REBATE_TYPE"].value = $scope.currentPricingTable["REBATE_TYPE"];
                    if (!!newValue[MRKT_SEG]) newValue[MRKT_SEG].value = $scope.currentPricingTable[MRKT_SEG].split(',');
                    if (!!newValue[GEO]) {
                        if ($scope.currentPricingTable[GEO].indexOf('[') > -1) {
                            newValue[GEO].value = $scope.currentPricingTable[GEO];
                        } else {
                            newValue[GEO].value = $scope.currentPricingTable[GEO].split(',');
                        }
                    }
                    if (!!newValue["PAYOUT_BASED_ON"]) newValue["PAYOUT_BASED_ON"].value = $scope.currentPricingTable["PAYOUT_BASED_ON"];
                    if (!!newValue["PROGRAM_PAYMENT"]) newValue["PROGRAM_PAYMENT"].value = $scope.currentPricingTable["PROGRAM_PAYMENT"];
                    if (!!newValue["PROD_INCLDS"]) newValue["PROD_INCLDS"].value = $scope.currentPricingTable["PROD_INCLDS"];
                    if (!!newValue["NUM_OF_TIERS"]) newValue["NUM_OF_TIERS"].value = $scope.currentPricingTable["NUM_OF_TIERS"] != "" ? $scope.currentPricingTable["NUM_OF_TIERS"] : "1";
                    if (!!newValue["NUM_OF_DENSITY"]) newValue["NUM_OF_DENSITY"].value = $scope.currentPricingTable["NUM_OF_DENSITY"] != "" ? $scope.currentPricingTable["NUM_OF_DENSITY"] : "1";
                    if (!!newValue["SERVER_DEAL_TYPE"]) newValue["SERVER_DEAL_TYPE"].value = $scope.currentPricingTable["SERVER_DEAL_TYPE"];
                    if (!!newValue["PERIOD_PROFILE"]) newValue["PERIOD_PROFILE"].value = $scope.currentPricingTable["PERIOD_PROFILE"] != "" ? $scope.currentPricingTable["PERIOD_PROFILE"] : $scope.contractData.Customer.DFLT_PERD_PRFL;
                    if (!!newValue["AR_SETTLEMENT_LVL"]) {
                        // Set AR_SETTLEMENT_LVL to Auto Fill values first, then customer default, and if still blank, then fall back on deal level rules
                        var newArSettlementValue = $scope.currentPricingTable["AR_SETTLEMENT_LVL"] != ""
                            ? $scope.currentPricingTable["AR_SETTLEMENT_LVL"]
                            : $scope.contractData.Customer.DFLT_AR_SETL_LVL;
                        if (newArSettlementValue == $scope.contractData.Customer.DFLT_AR_SETL_LVL && $scope.contractData.Customer.DFLT_AR_SETL_LVL == "User Select on Deal Creation") {
                            newArSettlementValue = "";
                        } else {
                            if (newArSettlementValue == "") // If no auto fill or customer default, default to Deal values
                                newArSettlementValue = ($scope.currentPricingTable["OBJ_SET_TYPE_CD"] == "ECAP" ||
                                    $scope.currentPricingTable["OBJ_SET_TYPE_CD"] == "KIT")
                                    ? "Issue Credit to Billing Sold To"
                                    : "Issue Credit to Default Sold To by Region";
                        }
                        newValue["AR_SETTLEMENT_LVL"].value = newArSettlementValue;
                    }
                    if (!!newValue["REBATE_OA_MAX_VOL"]) newValue["REBATE_OA_MAX_VOL"].value = $scope.currentPricingTable["REBATE_OA_MAX_VOL"];
                    if (!!newValue["REBATE_OA_MAX_AMT"]) newValue["REBATE_OA_MAX_AMT"].value = $scope.currentPricingTable["REBATE_OA_MAX_AMT"];
                }
            } else {
                // TODO: Hook these up to service (add service into injection and physical files)
                if (!!newValue[MRKT_SEG]) newValue[MRKT_SEG].value = MrktSegMultiSelectService.setMkrtSegMultiSelect(MRKT_SEG, (MRKT_SEG + "_MS"), newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value);
                if (!!newValue[GEO]) newValue[GEO].value = MrktSegMultiSelectService.setGeoMultiSelect(GEO, newValue[GEO].value, oldValue[GEO].value);
            }
        },
            true);

        // **** VALIDATE PRICING TABLE Methods ****
        //

        $scope.validatePricingTable = function (forceRun) {

            if (forceRun === undefined || !forceRun) {
                $scope.saveEntireContractBase($state.current.name, true, true);
            } else {
                $scope.saveEntireContractRoot($state.current.name, true, forceRun);
            }
        }

        $scope.publishWipDealsFromTab = function () {
            if ($scope.enableDealEditorTab() === false) return;
            if ($scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock($scope.ptTitle + " Editor Save, Validate & Tab Switch", "UX");
            $scope.publishWipDeals();
        }

        $scope.publishWipDeals = function () {
            if ($scope.isWip) return;

            if ($scope.spreadDs.data().length === 0) {
                $scope.setBusy("No Products Found", "Please add products.", "Warning");
                $timeout(function () {
                    $scope.setBusy("", "");
                }, 2000);
                return;
            }

            $scope.setBusy("Loading...", "Loading the Deal Editor", "Info", true);

            var isPtrDirty = false;
            if ($scope.pricingTableData !== undefined && $scope.pricingTableData.PRC_TBL_ROW !== undefined) {
                var dirtyItems = $linq.Enumerable().From($scope.pricingTableData.PRC_TBL_ROW).Where(
                    function (x) {
                        return (x.PASSED_VALIDATION === 'Dirty');
                    }).ToArray();
                if (dirtyItems.length > 0) isPtrDirty = true;
            }



            // *** Removed because it opens a data integrity issue:
            // If use clicks save... then clicks the tab, it will bypass translation and PTR and WIP will be out of sync
            //!$scope._dirty &&
            if (!isPtrDirty && !$scope._dirty) {
                $state.go('contract.manager.strategy.wip',
                    {
                        cid: $scope.contractData.DC_ID,
                        sid: $scope.curPricingStrategyId,
                        pid: $scope.curPricingTableId
                    },
                    { reload: true });
            } else {
                if (!!$scope.child) {
                    $scope.child.validateSavepublishWipDeals();
                } else {
                    $scope.publishWipDealsBase();
                }
            }
        }
        $scope.publishWipDealsBase = function () {
            if ($scope.curPricingTable != undefined && $scope.curPricingTable != null && $scope.curPricingTable != ""
                && $scope.curPricingTable.OBJ_SET_TYPE_CD != undefined && $scope.curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
                $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);
                $scope.saveEntireContractBase($state.current.name, true, true, 'contract.manager.strategy.wip', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
            }
            else {
                $scope.setBusy("Loading...", "Loading the Deal Editor", "Info", true);
                $scope.saveEntireContractRoot($state.current.name, true, true, 'contract.manager.strategy.wip', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
            }            
        }
        $scope.gotoToPricingTable = function () {
            $scope.setBusy("Loading...", "Loading the " + $scope.ptTitle + " Editor", "Info");
            $scope.spreadNeedsInitialization = true;
            $state.go('contract.manager.strategy',
                {
                    cid: $scope.contractData.DC_ID,
                    sid: $scope.curPricingStrategyId,
                    pid: $scope.curPricingTableId
                },
                { reload: true });
        }
        $scope.backToPricingTable = function () {
            var isDirty = $("button.notdirty");
            if (isDirty !== undefined && isDirty.length > 0) {
                $scope._dirty = false;
            }
            if ($scope.isPtr) return;

            if (!$scope._dirty) {
                $scope.switchingTabs = true;
                $scope.gotoToPricingTable();
            } else {
                $scope.switchingTabs = true;
                $scope.$broadcast('syncDs');
                $scope.saveEntireContractBase($state.current.name, true, true, 'contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
            }
        }

        $scope.validateWipDeals = function (callback) {
            $scope.saveEntireContractBase($state.current.name, true, true, null, null, null, callback);
        }

        $scope.editPricingStrategyName = function (ps) {
            $scope.openRenameTitle(ps, $scope.psTitle);
        }

        $scope.editPricingTableName = function (pt) {
            $scope.openRenameTitle(pt, $scope.ptTitle);
        }

        $scope.openRenameTitle = function (dataItem, mode, defVal, errMsg) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'renameTitleModal',
                controller: 'renameTitleModalCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    },
                    mode: function () {
                        return mode;
                    },
                    defVal: function () {
                        return defVal;
                    },
                    errMsg: function () {
                        return errMsg;
                    }
                }
            });

            modalInstance.result.then(function (retOrigValue) {
                if (retOrigValue === dataItem.TITLE) return;

                $scope._dirty = true;
                $scope._dirtyContractOnly = true;

                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.isDirty) dataItem._behaviors.isDirty = {};
                dataItem._behaviors.isDirty["TITLE"] = true;
                dataItem.dirty = true;

                if (!$scope.validateTitles(dataItem)) {
                    $scope.openRenameTitle(dataItem, mode, dataItem.TITLE, dataItem._behaviors.validMsg["TITLE"]);
                    dataItem.TITLE = retOrigValue;
                    dataItem.dirty = false;
                    dataItem._behaviors.isDirty["TITLE"] = false;
                } else {
                    $scope.updateAtrbValue(dataItem.dc_type, [dataItem.DC_ID], "TITLE", dataItem.TITLE);
                    //$scope.saveUpperContract();
                }

            }, function () { });
        }

        $scope.openDealProducts = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/contract/partials/ptModals/dealProductsModal.html',
                controller: 'dealProductsModalCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function () { }, function () { });
        }

        $scope.toggleTerms = function () {
            var splitter = $("#k-splitter").data("kendoSplitter");
            if (splitter.options.panes[1].collapsed) {
                splitter.expand(".k-pane:last");
            } else {
                splitter.collapse(".k-pane:last");
            }
            splitter.resize();
        }

        $scope.gotoDealEntry = function () {
            //we reset any PS/PT/WIP specific information to remove unnecessary highlights or headers - perhaps this should be kept in the $scope.goto function instead?
            $scope.curPricingStrategyId = 0;
            $scope.curPricingStrategy = {};
            $scope.curPricingTable = {};
            $scope.curPricingTableId = 0;
            $scope.isPtr = false;
            $scope.isWip = false;

            $scope.goto('Deal Entry', 'contract.manager');
        }
        $scope.gotoCompliance = function () {
            if (!$scope.enableFlowBtn()) return;
            $scope.goto('Compliance', 'contract.compliance');
        }
        $scope.gotoManage = function () {
            if (!$scope.enableFlowBtn()) return;
            $scope.isAddPricingTableHidden = true;
            $scope.isAddStrategyHidden = true;
            $scope.isAddStrategyBtnHidden = true;
            $scope.isSearchHidden = true;

            $scope.goto('Manage', 'contract.summary');
        }
        $scope.goto = function (mode, state) {
            //if ($scope.flowMode === mode) return;
            $scope.flowMode = mode;
            $state.go(state, { cid: $scope.contractData.DC_ID });
        }

        $scope.downloadQuoteLetter = function (customerSid, objTypeSid, objSid) {
            var downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + customerSid + "/" + objTypeSid + "/" + objSid + "/0";
            window.open(downloadPath, '_blank', '');
        }

        function cleanupData(data) {

            // Remove any lingering blank rows from the data
            for (var n = data.length - 1; n >= 0; n--) {
                if (data[n].DC_ID === null && (data[n].PTR_USER_PRD === null || data[n].PTR_USER_PRD.toString().replace(/\s/g, "").length === 0)) {
                    data.splice(n, 1);
                } else {
                    if (util.isInvalidDate(data[n].START_DT)) data[n].START_DT = moment($scope.contractData["START_DT"]).format("MM/DD/YYYY"); 
                    if (util.isInvalidDate(data[n].END_DT)) data[n].END_DT = moment($scope.contractData["END_DT"]).format("MM/DD/YYYY"); 
                }
            }

            // fix merge issues
            if (data.length > 0 && ($scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "KIT" && $scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "FLEX" && $scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "VOL_TIER"
                && $scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "REV_TIER" && $scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "DENSITY")) {
                var lastItem = data[data.length - 1];
                var numTier = $scope.numOfPivot(lastItem);
                var offset = data.length % numTier;
                if (offset > 0) {
                    for (var a = 0; a < numTier - offset; a++) {
                        data.push(util.deepClone(lastItem));
                    }
                }
            }
            return data;
        }

        $scope.isOverCharacterLimit = function (str, limit) {
            if (typeof str !== 'string') {
                return false;
            }
            return (str.length >= limit);
        }

        //MC SYNC for pricingTableData
        $scope.$on('refreshPricingTableData', function (event, isCapMissed) {
            $scope.setBusy("Updating", "Pricing Table...");
            objsetService.readPricingTable($scope.curPricingTable.DC_ID).then(
                function (results) {
                    $scope.pricingTableData = results.data;
                    $scope.setBusy("Done", "Updation Complete.");
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.$broadcast('refreshContractData');
                },
                function (response) {
                    $scope.setBusy("Error", "Could not update Pricing Table...", "Error");
                    logger.error("Could not update Pricing Table.", response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                }
            );

        });

        $scope.isMCForceRunReq = function () {
            var mcForceRun = false;
            if ($scope.pricingTableData !== undefined && $scope.pricingTableData.PRC_TBL_ROW !== undefined && $scope.pricingTableData.PRC_TBL_ROW.length > 0) {
                var dirtyItems = $linq.Enumerable().From($scope.pricingTableData.PRC_TBL_ROW).Where(
                    function (x) {
                        return (x.MEETCOMP_TEST_RESULT === 'Not Run Yet' || x.MEETCOMP_TEST_RESULT === 'InComplete' || x.DC_ID <= 0);
                    }).ToArray();
                if (dirtyItems.length > 0) mcForceRun = true;

                return mcForceRun;
            }
        }

        $scope.isPTRPartiallyComplete = function (selectedTab) {
            var isPtrDirty = false;
            var rootScopeDirty = $scope._dirty;
            if ($scope.pricingTableData !== undefined && $scope.pricingTableData.PRC_TBL_ROW !== undefined && $scope.pricingTableData.PRC_TBL_ROW.length > 0) {
                var dirtyItems = $linq.Enumerable().From($scope.pricingTableData.PRC_TBL_ROW).Where(
                    function (x) {
                        return (x.PASSED_VALIDATION === 'Dirty');
                    }).ToArray();
                if (dirtyItems.length > 0) isPtrDirty = true;
            }
            else {
                isPtrDirty = true;
            }
            //IF DE
            if (selectedTab == 'DE') {
                var isDirty = $("button.notdirty");
                if (isDirty !== undefined && isDirty.length > 0) {
                    $scope._dirty = false;
                    rootScopeDirty = false;
                }
            }

            if (!isPtrDirty && !rootScopeDirty) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.tenderWidgetPathManager = function (_actionName, _tabName) {

            var isFired = false;
            var isPartiallyValid = true;
            var isPTREmpty = $scope.pricingTableData.PRC_TBL_ROW.length > 0 ? false : true;
            var mcForceRunReq = $scope.isMCForceRunReq();
            $scope.actualClikedTabName = _tabName;

            if ($scope.currentTAB == _tabName) {
                return;
            }

            if (_tabName == 'PTR') {
                isFired = true;
                $scope.enablePTRReload = true;
            }

            if ($scope.currentTAB == 'PTR' && _tabName != 'PTR') {
                isPartiallyValid = $scope.isPTRPartiallyComplete('PTR');
            }

            if ($scope.currentTAB == 'DE' && _tabName != 'DE') {
                isPartiallyValid = $scope.isPTRPartiallyComplete('DE');
            }

            if (_tabName == 'DE') {
                $scope.enablePTRReload = true;
                if (isPartiallyValid == false) {
                    if (!!$scope.child) {
                        $scope.inCompleteCapMissing = false;
                        if ($scope.currentTAB == 'PTR' && !isPTREmpty) {
                            $scope.child.validateSavepublishWipDeals();
                        }
                        else if ($scope.currentTAB == 'DE' && !isPTREmpty) {
                            $scope.$broadcast('fireSaveAndValidateGrid');
                        }

                    } else {
                        $scope.publishWipDealsBase();
                    }
                }
                else if (($scope.curPricingStrategy.PASSED_VALIDATION == 'Complete' || isPartiallyValid == true) && $scope.enableDealEditorTab() === true) {
                    isFired = true;
                    $scope.wipData = [];
                    $scope.selectedTAB = _tabName;
                    $scope.currentTAB = _tabName;
                    $state.go('contract.manager.strategy.wip', {
                        cid: $scope.contractData.DC_ID,
                        sid: $scope.contractData.PRC_ST[0].DC_ID,
                        pid: $scope.contractData.PRC_ST[0].PRC_TBL[0].DC_ID
                    }, { reload: true });
                }
                else {
                    logger.stickyError("Validate all your product(s) to open Deal Editor.");
                }

            }

            if (_tabName == 'MC') {
                if ($scope.curPricingStrategy.PASSED_VALIDATION == 'Complete' && isPartiallyValid == true) {
                    isFired = true;
                    $scope.selectedTAB = _tabName;
                    $scope.currentTAB = _tabName;
                    $scope.isPtr = false;
                    $scope.enablePTRReload = false;
                }
                else if (isPartiallyValid == false) {
                    if (!!$scope.child) {
                        $scope.inCompleteCapMissing = false;
                        if ($scope.currentTAB == 'PTR' && !isPTREmpty) {
                            $scope.child.validateSavepublishWipDeals();
                        }
                        else if ($scope.currentTAB == 'DE' && !isPTREmpty) {
                            $scope.enablePTRReload = true;
                            $scope.$broadcast('fireSaveAndValidateGrid');
                        }

                    } else {
                        $scope.publishWipDealsBase();
                    }
                }
                else if (isPartiallyValid == true && $scope.curPricingStrategy.PASSED_VALIDATION != 'Complete' && $scope.enableDealEditorTab() === true) {
                    isFired = true;
                    $scope.isPtr = false;
                    $scope.enablePTRReload = true;
                    if ($scope.selectedTAB != 'DE') {
                        $scope.selectedTAB = "DE"; // Send it to Deal Editor
                        $scope.currentTAB = 'DE';
                        _actionName = 'publishWipDealsFromTab';
                    }
                }
                else {
                    logger.stickyError("Validate all your product(s) to open Deal Editor.");
                }

            }

            if (_tabName == 'PD') {
                if (isPartiallyValid == false) {
                    $scope.inCompleteCapMissing = false;

                    if (!!$scope.child) {
                        if ($scope.currentTAB == 'PTR' && !isPTREmpty) {
                            $scope.child.validateSavepublishWipDeals();
                        }
                        else if ($scope.currentTAB == 'DE' && !isPTREmpty) {
                            $scope.$broadcast('fireSaveAndValidateGrid');
                            $scope.enablePTRReload = true;
                        }

                    } else {
                        $scope.publishWipDealsBase();
                    }
                }
                else if ($scope.curPricingStrategy.PASSED_VALIDATION == 'Complete' && ((($scope.curPricingStrategy.MEETCOMP_TEST_RESULT != 'InComplete' && $scope.curPricingStrategy.MEETCOMP_TEST_RESULT != 'Not Run Yet' && !mcForceRunReq) || $scope.inCompleteCapMissing) && isPartiallyValid == true)) {
                    isFired = true;
                    $scope.selectedTAB = _tabName;
                    $scope.currentTAB = _tabName;
                    $scope.isPtr = false;
                    $scope.enablePTRReload = false;
                    $scope.loadPublishGrid();
                }
                else if ($scope.curPricingStrategy.PASSED_VALIDATION == 'Complete' && ($scope.curPricingStrategy.MEETCOMP_TEST_RESULT == 'InComplete' || $scope.curPricingStrategy.MEETCOMP_TEST_RESULT == 'Not Run Yet' || mcForceRunReq) && isPartiallyValid == true) {
                    isFired = true;
                    $scope.selectedTAB = 'MC';
                    $scope.currentTAB = 'MC';
                    $scope.isPtr = false;
                    $scope.enablePTRReload = false;
                }
                else if (isPartiallyValid == true && $scope.curPricingStrategy.PASSED_VALIDATION != 'Complete' && $scope.enableDealEditorTab() === true) {
                    isFired = true;
                    if ($scope.selectedTAB != 'DE') {
                        $scope.selectedTAB = "DE";
                        $scope.currentTAB = 'DE';
                        $scope.enablePTRReload = true;
                        _actionName = 'publishWipDealsFromTab';
                    }
                }
                else {
                    logger.stickyError("Meet Comp is not passed. You can not Publish this deal yet.");
                }

            }

            if (isPTREmpty) {
                $scope.enablePTRReload = false;
            }

            if (angular.isFunction($scope[_actionName]) && isFired)
                $scope[_actionName]();
        }
        $scope.exlusionList = [];
        $scope.addExclusionList = function (dataItem) {
            if ($scope.exlusionList.indexOf(dataItem.id) > -1) {
                $scope.exlusionList.splice($scope.exlusionList.indexOf(dataItem.id), 1);
            } else {
                $scope.exlusionList.push(dataItem.id);
            }
        }
        $scope.selectAllExclusion = function (mode) {
            var isChecked = document.getElementById('chkDealTools').checked;
            $scope.exlusionList = [];
            if (isChecked) {
                for (var i = 0; i < $scope.wipData.length; i++) {
                    $scope.exlusionList.push($scope.wipData[i].DC_ID);
                }
            }
        }
        $scope.publishTenderDeal = function () {
            $scope.setBusy("Publishing deals", "Converting into individual deals. Then we will redirect you to Tender Dashboard.");
            objsetService.publishTenderDeals($scope.contractData.DC_ID, $scope.exlusionList).then(
                function (data) {

                    if (data) {
                        if (data.data == true) {
                            $scope.setBusy("Published deals Successfully", "Redirecting to Tender Dashboard", "Success");
                            $scope._dirty = false;
                            $scope.goToTenderDashboard();
                            return;
                        } else {
                            logger.stickyError("Publishing deals failed. Contact Administrator.");
                        }
                        $scope.setBusy("", "");
                    }
                    else {
                        logger.stickyError("Publishing deals failed. Contact Administrator.");
                    }

                },
                function (result) {
                    logger.stickyError("Could not publish deals.", result, result.statusText);
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.loadPublishGrid = function () {
            // Generates options that kendo's html directives will use
            var root = $scope;	// Access to parent scope

            root.wipData = [];
            $scope.loading = true;
            $scope.setBusy("Loading Deals...", "Please wait we are fetching WIP Deals...");
            $scope.msg = "Loading Deals";
            function initGrid(data) {

                $timeout(function () {
                    var order = 0;
                    var dealTypes = [
                        { dealType: $scope.curPricingTable.OBJ_SET_TYPE_CD, name: $scope.curPricingTable.OBJ_SET_TYPE_CD },

                    ];
                    var show = [
                        "EXCLUDE_AUTOMATION", "DC_ID", "MEETCOMP_TEST_RESULT", "COST_TEST_RESULT", "MISSING_CAP_COST_INFO", "PASSED_VALIDATION", "CUST_MBR_SID", "END_CUSTOMER_RETAIL", "START_DT", "END_DT", "WF_STG_CD", "OBJ_SET_TYPE_CD",
                        "PTR_USER_PRD", "PRODUCT_CATEGORIES", "PROD_INCLDS", "TITLE", "SERVER_DEAL_TYPE", "DEAL_COMB_TYPE", "DEAL_DESC", "TIER_NBR", "ECAP_PRICE",
                        "KIT_ECAP", "CAP", "CAP_START_DT", "CAP_END_DT", "YCS2_PRC_IRBT", "YCS2_START_DT", "YCS2_END_DT", "VOLUME", "ON_ADD_DT", "MRKT_SEG", "GEO_COMBINED",
                        "TRGT_RGN", "QLTR_BID_GEO", "QLTR_PROJECT", "QUOTE_LN_ID", "PERIOD_PROFILE", "AR_SETTLEMENT_LVL", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "TERMS", "REBATE_BILLING_START", "REBATE_BILLING_END", "CONSUMPTION_REASON",
                        "CONSUMPTION_REASON_CMNT", "CONSUMPTION_CUST_PLATFORM", "CONSUMPTION_CUST_SEGMENT", "CONSUMPTION_CUST_RPT_GEO", "CONSUMPTION_COUNTRY", "BACK_DATE_RSN", "REBATE_DEAL_ID", "REBATE_OA_MAX_VOL", "REBATE_OA_MAX_AMT", "REBATE_TYPE", "TERMS", "TOTAL_DOLLAR_AMOUNT", "NOTES", "PRC_ST_OBJ_SID"
                    ];
                    var usedCols = [];
                    var excludeCols = ["details", "tools", "TRKR_NBR", "DC_PARENT_ID", "tender_actions", "CNTRCT_OBJ_SID"];

                    if (window.usrRole == 'FSE') {
                        excludeCols.push("MEETCOMP_TEST_RESULT");
                    }

                    root.wipOptions = {
                        "isLayoutConfigurable": false,
                        "isVisibleAdditionalDiscounts": false,

                    };
                    root.wipOptions.showMCPCT = true;
                    root.wipOptions.isPinEnabled = false;
                    root.wipOptions.default = {};
                    root.wipOptions.default.groups = opGridTemplate.groups[$scope.curPricingTable.OBJ_SET_TYPE_CD];
                    root.wipOptions.default.groupColumns = opGridTemplate.templates[$scope.curPricingTable.OBJ_SET_TYPE_CD];

                    root.wipOptions.columns = [];

                    root.wipOptions.model = { fields: {}, id: "DC_ID" };

                    var hasDeals = [];
                    for (var x = 0; x < data.length; x++) {
                        if (hasDeals.indexOf(data[x].OBJ_SET_TYPE_CD) < 0) hasDeals.push(data[x].OBJ_SET_TYPE_CD);
                        //Checking Exclude Automation Presence
                        if (!data[x].EXCLUDE_AUTOMATION) {
                            data[x]["EXCLUDE_AUTOMATION"] = false;
                        }
                    }

                    for (var d = 0; d < dealTypes.length; d++) {
                        var dealType = dealTypes[d];
                        if (hasDeals.indexOf(dealType.dealType) >= 0) {
                            var wipTemplate = root.templates.ModelTemplates.WIP_DEAL[dealType.dealType];
                            if (wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION') > 0) {
                                wipTemplate.columns.splice(wipTemplate.columns.findIndex(e => e.field === 'EXCLUDE_AUTOMATION'), 1);
                            }

                            if (window.usrRole === "GA") {
                                wipTemplate.columns.unshift({
                                    field: "EXCLUDE_AUTOMATION",
                                    title: "Exclude from Price Rules",
                                    width: 150,
                                    template: "<div class='dealTools'><div class='fl' ><input type='checkbox' ng-model='dataItem.EXCLUDE_AUTOMATION' class= 'grid-link-checkbox with-font lnkChk_{{dataItem.DC_PARENT_ID}}' id = 'lnkChk_{{dataItem.DC_PARENT_ID}}' /> <label for='lnkChk_{{dataItem.DC_PARENT_ID}}' style='margin: 10px 0 0 10px;' title='Exclude from Price Approval Rules' ng-click='addExclusionList(dataItem)'></label></div ></div>",
                                    bypassExport: true,
                                    hidden: false,
                                    uiType: "CheckBox",
                                    isDimKey: false,
                                    isRequired: false,
                                    sortable: false,
                                    filterable: false,
                                    headerTemplate: "<input type='checkbox' ng-click='excludeAllItems()' class='with-font' id='chkDealTools' title='Exclude from Price Approval Rules' /><label id='lblExclAutoHeader' for='chkDealTools' style='margin-left: 20px;margin-top: -70px; ' title='Exclude from Price Approval Rules'>Exclude from Price Rules</label>",
                                    mjrMnrChg: "MINOR",
                                    lookupUrl: "",
                                    lookupText: "",
                                    lookupValue: "",
                                    locked: false,
                                    lockable: false
                                });
                            }

                            wipTemplate.columns.push({
                                bypassExport: false,
                                field: "NOTES",
                                filterable: true,
                                sortable: true,
                                title: "Notes",
                                width: 150
                            });
                            for (var c = 0; c < wipTemplate.columns.length; c++) {
                                var col = wipTemplate.columns[c];

                                col.hidden = show.indexOf(col.field) < 0;
                                col.locked = false;


                                if (excludeCols.indexOf(col.field) < 0) {
                                    // add to column
                                    if (usedCols.indexOf(col.field) < 0) {
                                        usedCols.push(col.field);
                                        root.wipOptions.columns.push(col);
                                    }

                                }

                                if (col["field"] == "CUST_MBR_SID") {
                                    col.filterable = {
                                        multi: true,
                                        search: true,
                                        itemTemplate: function (e) {
                                            if (e.field == "all") {
                                                return '<li class="k-item"><label class="k-label"><input type="checkbox" class="k-check-all" value="Select All">Select All</label></li>';
                                            } else {
                                                return '<li class="k-item"><label class="k-label"><input type="checkbox" class="" value="#=data.CUST_MBR_SID#">#=Customer.CUST_NM#</label></li>'
                                            }
                                        }
                                    };
                                }
                            }


                            Object.keys(wipTemplate.model.fields).forEach(function (key, index) {
                                if (excludeCols.indexOf(key) < 0) {
                                    if (root.wipOptions.model.fields[key] === undefined)
                                        root.wipOptions.model.fields[key] = this[key];
                                }
                            }, wipTemplate.model.fields);
                        }
                    }

                    root.wipData = data;
                }, 10);
                $timeout(function () {
                    $scope.msg = "Done";
                    $scope.loading = false;
                }, 2000);
            }

            // Get all WIP
            objsetService.readWipFromContract($scope.contractData.DC_ID).then(function (response) {
                if (response.data) {
                    initGrid(response.data.WIP_DEAL);
                    $scope.msg = "Drawing Grid";
                }
            }, function (result) {
                logger.stickyError("Could not get deals.", result, result.statusText);
                $scope.setBusy("", "");
            });
        }
        //Unique Check Row and Product Combination
        $scope.groupBy = function (list, f) {
            var groups = {};
            list.forEach(function (o) {
                var group = JSON.stringify(f(o));
                groups[group] = groups[group] || [];
                groups[group].push(o);
            });
            return Object.keys(groups).map(function (group) {
                return groups[group];
            })
        }
        //validate flex overlap product
        $scope.getOVLPProduct = function (callback) {
            $scope.overlapFlexResult = null;
            if ($scope.curPricingTable.OBJ_SET_TYPE_CD && $scope.curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
                var data = $scope.pricingTableData.PRC_TBL_ROW;
                var AcrObjs = data.filter(ob => ob.FLEX_ROW_TYPE && ob.FLEX_ROW_TYPE.toLowerCase() == 'accrual');
                var DrnObjs = data.filter(ob => ob.FLEX_ROW_TYPE && ob.FLEX_ROW_TYPE.toLowerCase() == 'draining');
                var AcrInc = [], AcrExc = [], DrnInc = [], DrnExc = [];

                //getting Accrual include and exclude product
                angular.forEach(AcrObjs, (item) => {
                    //to handle multi tier condition
                    if (item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) {
                        var objAcr = Object.values(JSON.parse(item.PTR_SYS_PRD));
                        angular.forEach(objAcr, (itm) => {
                            var objItm = {};
                            if (itm[0].EXCLUDE) {
                                AcrExc.push(itm[0].PRD_MBR_SID);
                            }
                            else {
                                objItm['RowId'] = item.DC_ID;
                                objItm['PRDMemberSid'] = itm[0].PRD_MBR_SID;
                                AcrInc.push(objItm);
                            }
                        });
                    }

                });
                //getting Darining include and exclude product
                angular.forEach(DrnObjs, (item) => {
                    if (item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) {
                        var objDrn = Object.values(JSON.parse(item.PTR_SYS_PRD));
                        angular.forEach(objDrn, (itm) => {
                            var objItm = {};
                            if (itm[0].EXCLUDE) {
                                DrnExc.push(itm[0].PRD_MBR_SID);
                            }
                            else {
                                objItm['RowId'] = item.DC_ID;
                                objItm['PRDMemberSid'] = itm[0].PRD_MBR_SID;
                                DrnInc.push(objItm);
                            }
                        });
                    }

                });
                
                var uniqAcrInc = AcrInc.filter(function (a) {
                    var key = a.RowId + '|' + a.PRDMemberSid;
                    if (!this[key]) {
                        this[key] = true;
                        return true;
                    }
                }, Object.create(null));

                var reqBody = {
                    AcrInc: uniqAcrInc,
                    AcrExc: AcrExc,
                    DrnInc: DrnInc,
                    DrnExc: DrnExc
                };

                productSelectorService.GetProductOVLPValidation(reqBody)
                    .then(function (response) {
                        if (response.data && response.data.length && response.data.length > 0) {
                            $scope.overlapFlexResult = response.data;
                        }
                        callback(false);
                    }, function (err) {
                        console.error(e);
                        callback(true);
                    });
            }
            else {
                callback(false);
            }
        }
        $scope.validateOVLPFlexProduct = function (data,mode) {
        if ($scope.curPricingTable.OBJ_SET_TYPE_CD && $scope.curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
                //Clearing the behaviors for the first time if no error the result will be clean
                $scope.clearValidation(data, "PTR_USER_PRD");
                if ($scope.overlapFlexResult && $scope.overlapFlexResult.length && $scope.overlapFlexResult.length > 0) {
                    //Parent is different at PTE and DE level
                    var objectId = $scope.wipData ? 'DC_PARENT_ID' : 'DC_ID';
                    //In SpreadData for Multi-Tier Tier_NBR one always has the updated date
                    //Added if condition as this function gets called both on saveandvalidate of WIP and PTR.As spreadDS is undefined in WIP object added this condition
                    var spreadData;
                    if ($scope.spreadDs != undefined) {
                        spreadData = $scope.spreadDs.data();
                    }
                    else {
                         spreadData = data
                    }
                    
                    //For multi tiers last record will have latest date, skipping duplicate DC_ID
                    var filterData = _.uniq(_.sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
                    //Assigning  validation result to a variable and finally iterate between this result and bind the errors
                    var finalResult = $scope.checkOVLPDate(filterData, $scope.overlapFlexResult, objectId);
                    if (mode) {
                        return finalResult;
                    }
                    angular.forEach(data, (item) => {
                        angular.forEach(finalResult, (itm) => {
                            //To handle multi tier condition only assign to object which has PTR_SYS_PRD in PTE and PTR_USER_PRD in DE
                            if ((objectId == 'DC_ID' && item.PTR_SYS_PRD && (item.PTR_SYS_PRD != null || item.PTR_SYS_PRD != '')) || (objectId == 'DC_PARENT_ID' && item.PTR_USER_PRD && (item.PTR_USER_PRD != null || item.PTR_USER_PRD != ''))) {
                                if (item[objectId] == itm.ROW_ID && itm.dup && itm.dup == 'duplicate') {
                                    $scope.OVLPFlexPdtPTRUSRPRDError = true;
                                    $scope.setBehaviors(item, "PTR_USER_PRD", "duplicate");
                                }
                                else if (item[objectId] == itm.ROW_ID && itm.dup && itm.dup == 'dateissue') {
                                    $scope.OVLPFlexPdtPTRUSRPRDError = true;
                                    $scope.setBehaviors(item, "PTR_USER_PRD", "dateissue");
                                }
                                else {
                                    $scope.setBehaviors(item, "FLEX", "emptyobject");
                                }
                            }
                        });
                    });

                }
            }
        return data;
        }
        $scope.checkOVLPDate = function (data, resp, objectId) {
            window['moment-range'].extendMoment(moment);
            //get uniq duplicate product
            var uniqOvlpCombination = _.uniq(_.map(resp, (ob) => {return ob.OVLP_ROW_ID }));
            //iterate through unique product
            _.each(uniqOvlpCombination, (dup) => {
                //filtering the uniq prod from response and sort to get correct first and second object
                var rowID = _.filter(resp, (ob) => { return ob['OVLP_ROW_ID'] == dup });
                _.each(rowID, (dupPro) => {
                    _.each(rowID, (dupPr) => {
                        //checking the product date overlaps or not
                        if (dupPro.ROW_ID != dupPr.ROW_ID) {
                            var firstObj = null, secObj = null;

                            if (objectId == 'DC_PARENT_ID') {
                                //findWhere will return the first object found 
                                firstObj = _.findWhere(data, { 'DC_PARENT_ID': dupPro.ROW_ID });
                                secObj = _.findWhere(data, { 'DC_PARENT_ID': dupPr.ROW_ID });
                            }
                            else {
                                firstObj = _.findWhere(data, { 'DC_ID': dupPro.ROW_ID });
                                secObj = _.findWhere(data, { 'DC_ID': dupPr.ROW_ID });
                            }

                            var firstRange = moment.range(moment(firstObj.START_DT), moment(firstObj.END_DT));
                            var secRange = moment.range(moment(secObj.START_DT), moment(secObj.END_DT));
                            //identifying the dates are valid for overlap
                            if (!moment(firstObj.START_DT).isBefore(firstObj.END_DT)) {
                                _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'dateissue';
                            }
                            else if (!moment(secObj.START_DT).isBefore(secObj.END_DT)) {
                                _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'dateissue';
                            }
                            else if ((moment(firstObj.END_DT).format('MM/DD/YYYY') == moment(secObj.START_DT).format('MM/DD/YYYY')) || 
                                (moment(firstObj.START_DT).format('MM/DD/YYYY') == moment(secObj.END_DT).format('MM/DD/YYYY'))) { 
                                _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                                _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';                                
                            }
                            //if the dates overlap add key dup as true
                            else if (firstRange.overlaps(secRange)) {
                                _.findWhere(resp, { 'ROW_ID': firstObj[objectId] })['dup'] = 'duplicate';
                                _.findWhere(resp, { 'ROW_ID': secObj[objectId] })['dup'] = 'duplicate';                                
                            }
                        } 
                    });
                });

            });

            return resp;
        }

        //validate Flex Row Type 
        $scope.validateFlexRowType = function (data) {
            if ($scope.curPricingTable.OBJ_SET_TYPE_CD && $scope.curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
                $scope.clearValidation(data, 'FLEX_ROW_TYPE');

                var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
                var accrualSingleTierEntries = data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual' && val.NUM_OF_TIERS.toString() === '1');
                var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');

                if (drainingEntries.length > 0 && accrualEntries.length==0) {
                    angular.forEach(data, (item) => {
                        $scope.setFlexBehaviors(item, 'FLEX_ROW_TYPE', 'flexrowtype');
                    });
                }
                //Validate overarching fields for FLEX Accrual rows
                if (accrualSingleTierEntries.length > 0) {
                    $scope.validateOverArching(accrualSingleTierEntries);
                }
                $scope.validateHybridFields(data);
            }
            return data;
        }

        //validate Flex dates
        $scope.validateFlexDate = function (data) {
            if ($scope.curPricingTable.OBJ_SET_TYPE_CD && $scope.curPricingTable.OBJ_SET_TYPE_CD === "FLEX") {
                $scope.clearValidation(data, 'START_DT');
                var accrualEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Accrual');
                var drainingEntries = data.filter((val) => val.FLEX_ROW_TYPE == 'Draining');
                var objectId = $scope.wipData ? 'DC_PARENT_ID' : 'DC_ID';
                //For multi tiers last record will have latest date, skipping duplicate DC_ID
                var filterData = _.uniq(_.sortBy(accrualEntries, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

                var maxAccrualDate = new Date(Math.max.apply(null, filterData.map(function (x) { return new Date(x.START_DT); })));

                var drainingInvalidDates = drainingEntries.filter((val) => moment(val.START_DT) < (moment(maxAccrualDate).add(1, 'days')));
            }

            return drainingInvalidDates;
        }

        //validate settlement level for hybrid 
        $scope.validateSettlementLevel = function (data) {
            var hybCond = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond=false ;
            //calling clear all validation
            $scope.clearValidation(data, 'AR_SETTLEMENT_LVL');
            if (hybCond == '1') {
                retCond = data.every((val) => val.AR_SETTLEMENT_LVL != null && val.AR_SETTLEMENT_LVL != '' && val.AR_SETTLEMENT_LVL ==
                    data[0].AR_SETTLEMENT_LVL);
                if (!retCond) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'AR_SETTLEMENT_LVL', 'notequal');
                    });
                }
            }
            return data;
        }
        // validate OverArching conditions
        $scope.validateOverArching = function (data) {
            var hybCond = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT, retZeroOAD = false, retZeroOAV = false;
            var isFlexAccrual = data.every((val) => val.FLEX_ROW_TYPE === 'Accrual'); 
            var isFlatRate = $scope.curPricingTable.OBJ_SET_TYPE_CD === 'VOL_TIER'; 
            //calling clear overarching in the begening
            $scope.clearValidation(data,'REBATE_OA_MAX_AMT');
            $scope.clearValidation(data,'REBATE_OA_MAX_VOL');
            //to fix a defect, setting the property value to same
            $scope.setToSame(data, 'REBATE_OA_MAX_AMT');
            $scope.setToSame(data, 'REBATE_OA_MAX_VOL');

            if (hybCond == '1' || isFlexAccrual) {
                //condition to check values are zero
                retZeroOAV = data.every((val) => val.REBATE_OA_MAX_VOL === 0);
                retZeroOAD = data.every((val) => val.REBATE_OA_MAX_AMT === 0);
                
                if (retZeroOAV) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero');
                    });
                }
                else if (retZeroOAD) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero');
                    });
                }

                //else if (retOAVCond && retOADCond) { But on a line by line bases to capture both values filled out, not entire table both columns filled out.
                var testMaxAmtValues = [];
                var testMaxAmtCount = 0;
                var testMaxVolValues = [];
                var testMaxVolCount = 0;
                angular.forEach(data, (item) => {
                    // Are both values populated on this item?
                    if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT !== "") &&
                        (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL !== "")) {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth');
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth');
                    }
                    // Are both values empty for this item?
                    if (!(isFlexAccrual == 1 || isFlatRate == 1)) { // Pulls Flex/Vol Tier out of this test
                        if ((item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") &&
                            (item.REBATE_OA_MAX_VOL !== undefined && item.REBATE_OA_MAX_VOL === null || item.REBATE_OA_MAX_VOL == "")) {
                            $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalemptyboth');
                            $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalemptyboth');
                        }
                    }
                    if (isFlatRate == 1) { // Check single column for Vol Tier - must have values
                        if (item.REBATE_OA_MAX_AMT !== undefined && item.REBATE_OA_MAX_AMT === null || item.REBATE_OA_MAX_AMT === "") {
                            $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero');
                        }
                    }
                    // Check for 0 values
                    if (item.REBATE_OA_MAX_AMT !== null && item.REBATE_OA_MAX_AMT === "0") {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalzero');
                    }
                    if (item.REBATE_OA_MAX_VOL !== null && item.REBATE_OA_MAX_VOL === "0") {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalzero');
                    }
                    // Check for all values equal (tiers undefined is an ECAP Hybrid, tiers = 1 is a flex or VT Hybrid)
                    if (item.REBATE_OA_MAX_AMT !== null && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
                        testMaxAmtCount++;
                        if (item.REBATE_OA_MAX_AMT !== undefined && testMaxAmtValues.indexOf(item.REBATE_OA_MAX_AMT.toString()) < 0) {
                            testMaxAmtValues.push(item.REBATE_OA_MAX_AMT.toString());
                        }
                    }
                    if (item.REBATE_OA_MAX_VOL !== null && (item.NUM_OF_TIERS === undefined || item.NUM_OF_TIERS.toString() === '1')) {
                        testMaxVolCount++;
                        if (item.REBATE_OA_MAX_VOL !== undefined && testMaxVolValues.indexOf(item.REBATE_OA_MAX_VOL.toString()) < 0) {
                            testMaxVolValues.push(item.REBATE_OA_MAX_VOL.toString());
                        }
                    }
                });
                // Check if this is a flex, and if it is, only accrual single tier rows count..
                var elementCount = isFlexAccrual != 1 ? data.length : data.filter((val) => val.FLEX_ROW_TYPE === 'Accrual' && val.NUM_OF_TIERS.toString() === '1').length;
                if (testMaxAmtValues.length > 1 || (testMaxAmtCount > 0 && testMaxAmtCount != elementCount)) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'notequal');
                    });
                }
                if (testMaxVolValues.length > 1 || (testMaxVolValues > 0 && testMaxVolCount != elementCount)) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'notequal');
                    });
                }
                if (testMaxAmtValues.length > 0 && testMaxVolValues.length > 0) {
                    angular.forEach(data, (item) => {
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_AMT', 'equalboth');
                        $scope.setBehaviors(item, 'REBATE_OA_MAX_VOL', 'equalboth');
                    });
                }
                
            }
            return data;
        }
        $scope.validateHybridFields = function (data) {
            var hybCond = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT, retOAVCond = false, retOADCond = false, retOAVEmptCond = false, retOADEmptCond = false, retZeroOAD = false, retZeroOAV = false;
            var isFlexDeal = $scope.curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
            //calling clear overarching in the begening

            if (hybCond == '1' || isFlexDeal) {
                // Assume cleared, the apply breaks
                $scope.clearValidation(data, 'REBATE_TYPE');
                $scope.clearValidation(data, 'PAYOUT_BASED_ON');
                $scope.clearValidation(data, 'CUST_ACCNT_DIV');
                $scope.clearValidation(data, 'GEO_COMBINED');
                $scope.clearValidation(data, 'PERIOD_PROFILE');
                $scope.clearValidation(data, 'RESET_VOLS_ON_PERIOD');
                $scope.clearValidation(data, 'PROGRAM_PAYMENT');
                $scope.clearValidation(data, 'SETTLEMENT_PARTNER');
                $scope.clearValidation(data, 'AR_SETTLEMENT_LVL');

                $scope.itemValidationBlock(data, "REBATE_TYPE", ["notequal", "equalblank"]);
                $scope.itemValidationBlock(data, "PAYOUT_BASED_ON", ["notequal"]);
                $scope.itemValidationBlock(data, "CUST_ACCNT_DIV", ["notequal"]);
                $scope.itemValidationBlock(data, "GEO_COMBINED", ["notequal", "equalblank"]);
                $scope.itemValidationBlock(data, "PERIOD_PROFILE", ["notequal", "equalblank"]);
                $scope.itemValidationBlock(data, "RESET_VOLS_ON_PERIOD", ["notequal", "equalblank"]);
                $scope.itemValidationBlock(data, "PROGRAM_PAYMENT", ["notequal", "equalblank"]);
                $scope.itemValidationBlock(data, "SETTLEMENT_PARTNER", ["notequal"]);
                $scope.itemValidationBlock(data, "AR_SETTLEMENT_LVL", ["notequal", "equalblank"]);

                //var valTestX = data.map((val) => val.REBATE_OA_MAX_AMT).filter((value, index, self) => self.indexOf(value) === index) // null valus = not filled out
            }
            return data;
        }

        $scope.itemValidationBlock = function (data, key, mode) {
            var objectId = $scope.wipData ? 'DC_PARENT_ID' : 'DC_ID';
            //In SpreadData for Multi-Tier Tier_NBR one always has the updated date
            //Added if condition as this function gets called both on saveandvalidate of WIP and PTR.As spreadDS is undefined in WIP object added this condition
            var spreadData;
            if ($scope.spreadDs != undefined) {
                spreadData = $scope.spreadDs.data();
            }
            else {
                spreadData = data
            }

            //For multi tiers last record will have latest date, skipping duplicate DC_ID
            var filterData = _.uniq(_.sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });

            var v1 = filterData.map((val) => val[key]).filter((value, index, self) => self.indexOf(value) === index);
            var hasNotNull = v1.some(function (el) { return el !== null && el != ""; }); 

            if (mode.indexOf("notequal") >= 0) { // Returns -1 if not in list
                //if(v1.length > 1 && v1[0] !== "" && v1[0] != null) {  
                if (v1.length > 1 && hasNotNull) {
                    angular.forEach(data, (item) => {
                        if (!item._behaviors) item._behaviors = {};
                        if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                        if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set error message
                            $scope.setBehaviors(item, key, 'notequal');
                        }
                    });
                }
            }
            if (mode.indexOf("equalblank") >= 0) { // Returns -1 if not in list
                if (v1.contains(null) && v1[0] !== "") {
                    var v1List = data.filter((val) => val[key] === null);
                    angular.forEach(v1List, (item) => {
                        if (!item._behaviors) item._behaviors = {};
                        if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                        if (item._behaviors.isReadOnly[key] === undefined) { // If not read only, set blank error message
                            $scope.setBehaviors(item, key, 'equalblank');
                        }
                    });
                }
            }
            //Additional check for settlement partner if AR Settlement Level is 'CASH'
            if (key == "SETTLEMENT_PARTNER" && !hasNotNull) {
                angular.forEach(data, (item) => {
                    if (!item._behaviors) item._behaviors = {};
                    if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
                    if (item._behaviors.isReadOnly[key] === undefined && item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash') { // If not read only, set error message
                        $scope.setBehaviors(item, key, 'equalblank');
                    }
                });
            }
        }

          //validate settlement partner
        $scope.validateSettlementPartner = function (data) {            
            var hybCond = $scope.curPricingStrategy.IS_HYBRID_PRC_STRAT, retCond = true;
            //check if settlement is cash and pgm type is backend
            var cashObj = data.filter(ob => ob.AR_SETTLEMENT_LVL && ob.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && ob.PROGRAM_PAYMENT && ob.PROGRAM_PAYMENT.toLowerCase() == 'backend');
            if (cashObj && cashObj.length > 0) {
                if ($scope.getVendorDropDownResult != null && $scope.getVendorDropDownResult != undefined && $scope.getVendorDropDownResult.length > 0) {
                    var customerVendor = $scope.getVendorDropDownResult;
                    angular.forEach(data, (item) => {
                        var partnerID = customerVendor.filter(x => x.BUSNS_ORG_NM == item.SETTLEMENT_PARTNER);
                        if (partnerID && partnerID.length == 1) {
                            item.SETTLEMENT_PARTNER = partnerID[0].DROP_DOWN;
                        }
                    });
                }
                else if (hybCond == '1') {
                    retCond = data.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '' && val.SETTLEMENT_PARTNER == data[0].SETTLEMENT_PARTNER);
                    if (!retCond) {
                        angular.forEach(data, (item) => {
                            $scope.setSettlementPartner(item, '1');
                        });
                    }
                    else {
                        $scope.clearSettlementPartner(data);
                    }
                }
                else {
                    retCond = cashObj.every((val) => val.SETTLEMENT_PARTNER != null && val.SETTLEMENT_PARTNER != '');
                    if (!retCond) {
                        angular.forEach(data, (item) => {
                                if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
                                    if (item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() != 'cash' && item.HAS_TRACKER == "0") {
                                        item.SETTLEMENT_PARTNER = null;
                                    }
                                    delete item._behaviors.isRequired["SETTLEMENT_PARTNER"];
                                    delete item._behaviors.isError["SETTLEMENT_PARTNER"];
                                    delete item._behaviors.validMsg["SETTLEMENT_PARTNER"];
                                }
                        });
                    }
                    else {
                        $scope.clearSettlementPartner(data);
                    }

                }
            }
            else {
                $scope.clearSettlementPartner(data);
            }
            return data;
        }
        $scope.clearSettlementPartner = function (data) {
            angular.forEach(data, (item) => {
                if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
                    if (item.AR_SETTLEMENT_LVL && item.AR_SETTLEMENT_LVL.toLowerCase() != 'cash' && item.HAS_TRACKER == "0") {
                        item.SETTLEMENT_PARTNER = null;
                    }
                    delete item._behaviors.isRequired["SETTLEMENT_PARTNER"];
                    delete item._behaviors.isError["SETTLEMENT_PARTNER"];
                    delete item._behaviors.validMsg["SETTLEMENT_PARTNER"];
                }
                if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash' && item.HAS_TRACKER == "0") {
                    if (item._behaviors && item._behaviors.isReadOnly)
                    delete item._behaviors.isReadOnly["SETTLEMENT_PARTNER"];
                }
            });
        }
        $scope.setSettlementPartner = function (item, Cond) {
            if (!item._behaviors) item._behaviors = {};
            if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
            if (!item._behaviors.isError) item._behaviors.isError = {};
            if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
            item._behaviors.isRequired["SETTLEMENT_PARTNER"] = true;
            item._behaviors.isError["SETTLEMENT_PARTNER"] = true;
            if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
            if (item.HAS_TRACKER == 0 || item.HAS_TRACKER == undefined) {
                if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() !== 'cash') {
                    item._behaviors.isReadOnly["SETTLEMENT_PARTNER"] = true;
                }
                if (item.AR_SETTLEMENT_LVL != undefined && item.AR_SETTLEMENT_LVL.toLowerCase() == 'cash') {
                    delete item._behaviors.isReadOnly["SETTLEMENT_PARTNER"];
                }
                else {
                    if (Cond == '1') {
                        item._behaviors.validMsg["SETTLEMENT_PARTNER"] = "For hybrid deal vendor must be same if any settlement level is cash";
                    }
                }
            }

        }

        //helper function for clear and set behaviors
        $scope.clearValidation = function (data, elem) {
            angular.forEach(data, (item) => {
                if (item._behaviors && item._behaviors.isRequired && item._behaviors.isError && item._behaviors.validMsg) {
                    delete item._behaviors.isRequired[elem];
                    delete item._behaviors.isError[elem];
                    delete item._behaviors.validMsg[elem];
                }
            });
        }

        $scope.setFlexBehaviors = function (item, elem, cond) {
            if (!item._behaviors) item._behaviors = {};
            if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
            if (!item._behaviors.isError) item._behaviors.isError = {};
            if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
            if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
            item._behaviors.isRequired[elem] = true;
            item._behaviors.isError[elem] = true;
           
            if (cond == 'flexrowtype' && elem == 'FLEX_ROW_TYPE') {
                item._behaviors.validMsg[elem] = "There should be atleast one accrual product.";
            }
            else if (cond == 'invalidDate' && elem == 'START_DT') {
                item._behaviors.validMsg[elem] = "Draining products should have atleast 1 day delay from Accrual Start date";
            }

        }
        $scope.setBehaviors = function (item, elem, cond) {
            var isFlexDeal = (item.OBJ_SET_TYPE_CD === 'FLEX');
            if (!item._behaviors) item._behaviors = {};
            if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
            if (!item._behaviors.isError) item._behaviors.isError = {};
            if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
            if (!item._behaviors.isReadOnly) item._behaviors.isReadOnly = {};
            item._behaviors.isRequired[elem] = true;
            item._behaviors.isError[elem] = true;

            // Start with Hybrid items
            // REBATE_TYPE

            switch (elem) {
                case 'REBATE_TYPE':
                    $scope.setBehaviorsValidMessage(item, elem, 'Rebate Type', cond);
                    break;
                case 'PAYOUT_BASED_ON':
                    $scope.setBehaviorsValidMessage(item, elem, 'Payout Based On', cond);
                    break;
                case 'CUST_ACCNT_DIV':
                    $scope.setBehaviorsValidMessage(item, elem, 'Customer Account Division', cond);
                    break;
                case 'GEO_COMBINED':
                    $scope.setBehaviorsValidMessage(item, elem, 'Geo', cond);
                    break;
                case 'PERIOD_PROFILE':
                    $scope.setBehaviorsValidMessage(item, elem, 'Period Profile', cond);
                    break;
                case 'RESET_VOLS_ON_PERIOD':
                    $scope.setBehaviorsValidMessage(item, elem, 'Reset Per Period', cond);
                    break;
                case 'PROGRAM_PAYMENT':
                    $scope.setBehaviorsValidMessage(item, elem, 'Program Payment', cond);
                    break;
                case 'SETTLEMENT_PARTNER':
                    $scope.setBehaviorsValidMessage(item, elem, 'Settlement Partner', cond);
                    break;
                case 'AR_SETTLEMENT_LVL':
                    $scope.setBehaviorsValidMessage(item, elem, 'Settlement Level', cond);
                    break;
                default:
                // code block
            }


            if (elem == 'REBATE_TYPE' || elem == 'PAYOUT_BASED_ON' || elem == 'CUST_ACCNT_DIV' || elem == 'GEO_COMBINED' || elem == 'PERIOD_PROFILE' || elem == 'RESET_VOLS_ON_PERIOD' || elem == 'PROGRAM_PAYMENT'
                || elem == 'SETTLEMENT_PARTNER' || elem == 'AR_SETTLEMENT_LVL') {
                // no opeeration - taken in above case statement
            }
            else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_VOL') {
                $scope.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond);
            }
            else if (cond == 'notequal' && elem == 'REBATE_OA_MAX_AMT') {
                $scope.setBehaviorsValidMessage(item, elem, 'Overarching Max Dollar', cond);
            }
            else if (cond == 'equalemptyboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
                item._behaviors.validMsg[elem] = "Entering both an Overarching Maximum Volume and Overarching Maximum Dollar value is not allowed.";
            }
            else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_VOL') {
                $scope.setBehaviorsValidMessage(item, elem, 'Overarching Max Volume', cond);
            }
            else if (cond == 'equalzero' && elem == 'REBATE_OA_MAX_AMT') {
                $scope.setBehaviorsValidMessage(item, elem, 'Overarching Max Doller', cond);
            }
            else if (cond == 'equalboth' && (elem == 'REBATE_OA_MAX_AMT' || elem == 'REBATE_OA_MAX_VOL')) {
                item._behaviors.validMsg[elem] = "Both Overarching Maximum Volume and Overarching Maximum Dollars cannot contain values. Choose one or the other.";
            }
            else if (cond == 'duplicate' && elem == 'PTR_USER_PRD') {
                item._behaviors.validMsg[elem] = "Overlapping products identified, please change the overlapping Accrual and Draining dates.";
            }
            else if (cond == 'dateissue' && elem == 'PTR_USER_PRD') {
                item._behaviors.validMsg[elem] = "Deal End Date must be greater than Start Date, please correct.";
            }
            else if (cond == 'emptyobject' && elem == 'FLEX') {
                delete item._behaviors.isRequired[elem];
                delete item._behaviors.isError[elem];
            }

            else {
                item._behaviors.validMsg[elem] = 'All Settlement Levels must be same within a Hybrid Pricing Strategy.';
            }
        }
        $scope.setBehaviorsValidMessage = function (item, elem, elemLabel, cond) {
           var isFlexDeal = $scope.curPricingTable.OBJ_SET_TYPE_CD === 'FLEX';
            var dealTypeLabel = isFlexDeal === true ? "FLEX PT": "HYBRID PS";

            if (cond == 'notequal') {
                item._behaviors.validMsg[elem] = "All deals within a " + dealTypeLabel + " should have the same '" + elemLabel + "' value.";
            }
            else if (cond == 'equalblank') {
                if (elem === 'SETTLEMENT_PARTNER') {
                    item._behaviors.validMsg[elem] = "Settlement Partner is required when Settlement level is Cash";
                }
                else {
                    item._behaviors.validMsg[elem] = "Deals within a " + dealTypeLabel + " must have a '" + elemLabel + "' value.";
                }
            }
            else if (cond == 'equalblankorzero') {
                item._behaviors.validMsg[elem] = elemLabel + " must be blank or > 0.";
            }
            else if (cond == 'equalzero') {
                item._behaviors.validMsg[elem] = elemLabel + " must be > 0.";
            }
        }
        $scope.setToSame = function (data, elem) {
            angular.forEach(data, (item) => {
                if (item[elem] != undefined && (item[elem] == null || item[elem] == '')) {
                    item[elem] = null;
                }
            });
        }
        $scope.ValidateEndCustomer = function (data, actionName) {
            if (actionName !== "OnLoad") {
                angular.forEach(data, (item) => {
                    if (item._behaviors && item._behaviors.validMsg && item._behaviors.validMsg["END_CUSTOMER_RETAIL"] != undefined) {
                        $scope.clearEndCustomer(item);
                    }
                });
            }
            if ($scope.curPricingStrategy.IS_HYBRID_PRC_STRAT === '1' && $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER") {
                var rebateType = data.filter(ob => ob.REBATE_TYPE.toLowerCase() == 'tender');                
                if (rebateType && rebateType.length > 0) {
                    if (data.length > 1) {
                        var endCustObj = ""
                        if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                            endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                        }
                        angular.forEach(data, (item) => {
                            var parsedEndCustObj = "";
                            if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                                parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                                else if (parsedEndCustObj.length == 1 && parsedEndCustObj[0]["END_CUSTOMER_RETAIL"] != "") {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                                else {
                                    for (var i = 0; i < parsedEndCustObj.length; i++) {
                                        var exists = false;
                                        angular.forEach(endCustObj, (item) => {
                                            if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                                item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                                exists = true;
                                            }
                                        });
                                        if (!exists) {
                                            angular.forEach(data, (item) => {
                                                $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                            });
                                            i = parsedEndCustObj.length;
                                        }
                                    }
                                }
                            }
                            if (endCustObj == "" || parsedEndCustObj == "") {
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                            }
                        });
                    }
                    
                }
                else {
                    if (data.length > 1) {
                        var endCustObj = ""
                        if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                            endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                        }
                        angular.forEach(data, (item) => {
                            var parsedEndCustObj = "";
                            if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                                parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                                else if (parsedEndCustObj.length == 1 && parsedEndCustObj[0]["END_CUSTOMER_RETAIL"] != "") {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                                else {
                                    for (var i = 0; i < parsedEndCustObj.length; i++) {
                                        var exists = false;
                                        angular.forEach(endCustObj, (item) => {
                                            if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                                item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                                exists = true;
                                            }
                                        });
                                        if (!exists) {
                                            angular.forEach(data, (item) => {
                                                $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                            });
                                            i = parsedEndCustObj.length;
                                        }
                                    }
                                }
                            }
                            if (endCustObj == "" || parsedEndCustObj == "") {
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Hybrid Vol_Tier Deal');
                                    });
                                }
                            }
                        });
                    }
                }
            }
            else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "PROGRAM") {
                var rebateType = data.filter(ob => ob.REBATE_TYPE.toLowerCase() == 'tender');
                if (rebateType && rebateType.length > 0) {
                    if (data.length > 1) {
                        var endCustObj = ""
                        if (data[0].END_CUST_OBJ != null && data[0].END_CUST_OBJ != undefined && data[0].END_CUST_OBJ != "") {
                            endCustObj = JSON.parse(data[0].END_CUST_OBJ)
                        }
                        angular.forEach(data, (item) => {
                            var parsedEndCustObj = "";
                            if (item.END_CUST_OBJ != null && item.END_CUST_OBJ != undefined && item.END_CUST_OBJ != "") {
                                parsedEndCustObj = JSON.parse(item.END_CUST_OBJ);
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Program Deal');
                                    });
                                }
                                else if (parsedEndCustObj.length == 1 && parsedEndCustObj[0]["END_CUSTOMER_RETAIL"] != "") {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Program Deal');
                                    });
                                }
                                else {
                                    for (var i = 0; i < parsedEndCustObj.length; i++) {
                                        var exists = false;
                                        angular.forEach(endCustObj, (item) => {
                                            if (item["END_CUSTOMER_RETAIL"] == parsedEndCustObj[i]["END_CUSTOMER_RETAIL"] &&
                                                item["PRIMED_CUST_CNTRY"] == parsedEndCustObj[i]["PRIMED_CUST_CNTRY"]) {
                                                exists = true;
                                            }
                                        });
                                        if (!exists) {
                                            angular.forEach(data, (item) => {
                                                $scope.setEndCustomer(item, 'Program Deal');
                                            });
                                            i = parsedEndCustObj.length;
                                        }
                                    }
                                }
                            }
                            if (endCustObj == "" || parsedEndCustObj == "") {
                                if (parsedEndCustObj.length != endCustObj.length) {
                                    angular.forEach(data, (item) => {
                                        $scope.setEndCustomer(item, 'Program Deal');
                                    });
                                }
                            }
                        });
                    }
                }
            }
            return data;
        }
        $scope.clearEndCustomer = function (item) {
            if (item._behaviors && item._behaviors.isError && item._behaviors.isRequired && item._behaviors.validMsg) {
                delete item._behaviors.isError["END_CUSTOMER_RETAIL"];
                delete item._behaviors.validMsg["END_CUSTOMER_RETAIL"];
            }
        }
        $scope.setEndCustomer = function (item, dealType){
            if (!item._behaviors) item._behaviors = {};
            if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
            if (!item._behaviors.isError) item._behaviors.isError = {};
            if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
            if ((item.END_CUSTOMER_RETAIL != '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
                || ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" && item.REBATE_TYPE.toLowerCase() != "tender")) {//To show required error message
                $scope.clearEndCustomer(item);
                item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
                item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer Retail and End Customer Country must be same for " + dealType + ".";
            }
            else if ((item.END_CUSTOMER_RETAIL == '' && item.END_CUSTOMER_RETAIL != null && item.END_CUSTOMER_RETAIL != undefined)
                && (($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "PROGRAM") && item.REBATE_TYPE.toLowerCase() == "tender")) {
                $scope.clearEndCustomer(item);
                item._behaviors.isError["END_CUSTOMER_RETAIL"] = true;
                item._behaviors.validMsg["END_CUSTOMER_RETAIL"] = "End Customer/Retail is required.";
            }
        }

        $scope.validateMarketSegment = function (data) {
            $scope.clearValidation(data, 'MRKT_SEG');
            var objectId = $scope.wipData ? 'DC_PARENT_ID' : 'DC_ID';
            //In SpreadData for Multi-Tier Tier_NBR one always has the updated date
            //Added if condition as this function gets called both on saveandvalidate of WIP and PTR.As spreadDS is undefined in WIP object added this condition
            var spreadData;
            if ($scope.spreadDs != undefined) {
                spreadData = $scope.spreadDs.data();
            }
            else {
                spreadData = data
            }

            //For multi tiers last record will have latest date, skipping duplicate DC_ID
            var filterData = _.uniq(_.sortBy(spreadData, function (itm) { return itm.TIER_NBR }), function (obj) { return obj[objectId] });
            var isMarketSegment = filterData.some((val) => val.MRKT_SEG == null || val.MRKT_SEG == '');
            if (isMarketSegment) {
                angular.forEach(data, (item) => {
                    if (item.MRKT_SEG == null || item.MRKT_SEG == '') {
                        if (!item._behaviors) item._behaviors = {};
                        if (!item._behaviors.isRequired) item._behaviors.isRequired = {};
                        if (!item._behaviors.isError) item._behaviors.isError = {};
                        if (!item._behaviors.validMsg) item._behaviors.validMsg = {};
                        item._behaviors.isRequired["MRKT_SEG"] = true;
                        item._behaviors.isError["MRKT_SEG"] = true; 
                        item._behaviors.validMsg["MRKT_SEG"] = "Market Segment is required.";
                       
                    }
                });

            }
            return data;
        }
    }
})();