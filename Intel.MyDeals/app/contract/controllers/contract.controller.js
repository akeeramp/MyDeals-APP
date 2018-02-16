(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('ContractController', ContractController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];
    ContractController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$linq', 'contractData', 'copyContractData', 'isNewContract', 'templateData', 'objsetService', 'securityService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope', 'confirmationModal', 'dataService', 'customerCalendarService', 'contractManagerConstants', 'MrktSegMultiSelectService', '$compile'];

    function ContractController($scope, $state, $filter, $localStorage, $linq, contractData, copyContractData, isNewContract, templateData, objsetService, securityService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope, confirmationModal, dataService, customerCalendarService, contractManagerConstants, MrktSegMultiSelectService, $compile) {
        // store template information
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
        $scope.colToLetter = {};
        $scope.letterToCol = {};
        var intA = "A".charCodeAt(0);
        $scope.pageTitle = "Pricing Table Editor";
        $scope.isPtr = false;
        $scope.isWip = false;
        $scope.child = null;
        $scope.isAutoSaving = false;
        $scope.defCust = $localStorage.selectedCustomerId;
        $scope.switchingTabs = false;
        $scope.maxKITproducts = 10;
        $scope.pc = new perfCacheBlock("Contract Controller", "");

        var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR"]; // TODO: Loop through isDimKey attrbites for this instead for dynamicness
        $scope.kitDimAtrbs = ["ECAP_PRICE", "DSCNT_PER_LN", "QTY", "PRD_BCKT", "TIER_NBR", "TEMP_TOTAL_DSCNT_PER_LN"];

        $scope.flowMode = "Deal Entry";
        if ($state.current.name.indexOf("contract.compliance") >= 0) $scope.flowMode = "Compliance";
        if ($state.current.name.indexOf("contract.summary") >= 0) $scope.flowMode = "Manage";

        //var s1 = securityService.chkAtrbRules('ATRB_READ_ONLY', 'SA', 'CNTRCT', 'ALL_TYPES', 'InComplete', 'TITLE');

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
        $scope.canDeleteAttachment = function (wfStage) {
            return securityService.chkDealRules('C_DELETE_ATTACHMENTS', window.usrRole, null, null, wfStage);

        }
        // Hard code for now until security is put in place
        if (window.usrRole === "Legal") {
            $scope.CAN_VIEW_COST_TEST = true;
            $scope.CAN_EDIT_COST_TEST = false;
        }

        $scope.swapUnderscore = function (str) {
            return str.replace(/_/g, ' ');
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
            return val.replace(/_/g, ' ');
        }

        $scope.enableDealEditorTab = function () {
            if (!$scope.isPtr) return true;
            var data = $scope.pricingTableData;
            if (data === undefined || data === null || data.PRC_TBL_ROW === undefined || data.PRC_TBL_ROW.length === 0) return false;
            return true;
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

        $scope.needMct = function () {
            if (!$scope.contractData.PRC_ST || $scope.contractData.PRC_ST.length === 0) return false

            for (var m = 0; m < $scope.contractData.PRC_ST.length; m++) {
                var item = $scope.contractData.PRC_ST[m].MEETCOMP_TEST_RESULT;
                if (item !== "" && item.toUpperCase() !== "INCOMPLETE") {
                    return false;
                }
            }
            return true;
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

                $timeout(function () {
                    $scope.$apply();
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
        if ($scope.isContractDetailsPage) {
            var today = moment().format('l');

            // Set dates Max and Min Values for numeric text box
            // Setting MinDate to (Today - 5 years + 1) | +1 to accommodate HP dates, Q4 2017 spreads across two years 2017 and 2018
            $scope.contractData.MinYear = parseInt(moment().format("YYYY")) - 6;
            $scope.contractData.MaxYear = parseInt(moment().format("YYYY")) + 21;

            // Set the initial Max and Min date, actual dates will be updated as per the selected customer
            $scope.contractData.MinDate = moment().subtract(6, 'years').format('l');
            $scope.contractData.MaxDate = moment().add(21, 'years').format('l');

            // If new contract... default customer to the last customer used on the dashboard
            if (!$scope.contractData.CUST_MBR_SID && !!$scope.defCust)
                $scope.contractData.CUST_MBR_SID = $scope.defCust;

            // Contract custom initializations and functions
            // Dummy attribute on the UI which will hold the array of customer divisions
            $scope.contractData.CUST_ACCNT_DIV_UI = !$scope.contractData["CUST_ACCNT_DIV"] ? "" : $scope.contractData["CUST_ACCNT_DIV"].split('/');

            $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
            $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = false;
            $scope.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = !$scope.isNewContract;

            // In case of existing contract back date reason and text is captured display them
            $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN !== "" && $scope.contractData.BACK_DATE_RSN !== undefined;
            $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = !$scope.contractData._behaviors.isRequired["BACK_DATE_RSN"];

            // By default set the CUST_ACCPT to pending(99) if new contract
            $scope.contractData.CUST_ACCPT = $scope.contractData.CUST_ACCPT === "" ? 'Pending' : $scope.contractData.CUST_ACCPT;
            $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: ($scope.contractData.CUST_ACCPT === 'Pending');

            // TODO: Ideally undefined check should be removed, once we run the DBConst.tt and DealPropertyWrapper.tt we can remove this
            // Not running now I see many new Attributes added for VOL_TIER
            $scope.contractData["NO_END_DT"] = ($scope.contractData.NO_END_DT_RSN !== "" && $scope.contractData.NO_END_DT_RSN !== undefined);

            // Set customer acceptance rulesc
            var setCustAcceptanceRules = function (newValue) {
                $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = false; //US77403 wants it always shown -formerly: (newValue === 'Pending');
                $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = (newValue !== 'Pending') && (!hasUnSavedFiles && !hasFiles);
                if ($scope.contractData.DC_ID < 0) $scope.contractData.C2A_DATA_C2A_ID = (newValue === 'Pending') ? "" : $scope.contractData.C2A_DATA_C2A_ID;
                $scope.contractData.IsAttachmentRequired = ($scope.contractData.C2A_DATA_C2A_ID === "") && (newValue !== 'Pending');
                $scope.contractData.AttachmentError = $scope.contractData.AttachmentError &&
                    $scope.contractData.IsAttachmentRequired;
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
                //debugger;
                if (custId === "" || custId == null) return;
                dataService.get("/api/Customers/GetMyCustomerDivsByCustNmSid/" + custId).then(function (response) {
                    // only show if more than 1 result
                    // TODO: This is a temp fix API is getting the 2002 and 2003 level records, fix the API
                    response.data = $filter('where')(response.data, { CUST_LVL_SID: 2003 });

                    if (response.data.length <= 1) {
                        $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                        $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                        if ($scope.contractData.CUST_ACCNT_DIV_UI !== undefined) $scope.contractData.CUST_ACCNT_DIV_UI = response.data[0].CUST_DIV_NM.toString();
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
                    if ($scope.existingMinEndDate !== "") {
                        if (moment(endDate).isBefore($scope.existingMinEndDate)) {
                            $scope.contractData._behaviors.isError['END_DT'] = true;
                            $scope.contractData._behaviors
                                .validMsg['END_DT'] = "Contract end date cannot be less than current Contract end date - " + $scope.existingMinEndDate;
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
                var quarterDetails = customerCalendarService.getCustomerCalendar(customerMemberSid, value, null, null)
                    .then(function (response) {
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
                var quarterDetails = customerCalendarService.getCustomerCalendar(customerMemberSid, new Date, null, null)
                    .then(function (response) {
                        $scope.contractData.MinDate = moment(response.data.MIN_STRT).format('l');
                        $scope.contractData.MaxDate = moment(response.data.MIN_END).format('l');
                        $scope.contractData.START_QTR = $scope.contractData.END_QTR = response.data.QTR_NBR;
                        $scope.contractData.START_YR = $scope.contractData.END_YR = response.data.YR_NBR;

                        $scope.contractData._behaviors.isError['START_DT'] =
                            $scope.contractData._behaviors.isError['END_DT'] = false;
                        $scope.contractData._behaviors.validMsg['START_DT'] =
                            $scope.contractData._behaviors.validMsg['END_DT'] = "";

                        // By default we dont want a contract to be backdated
                        $scope.contractData.START_DT = moment(response.data.QTR_STRT).isBefore(today)
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
                $scope.contractData.CUST_ACCNT_DIV_UI = !$scope.contractData["CUST_ACCNT_DIV"] ? "" : $scope.contractData["CUST_ACCNT_DIV"].split('/');
                $scope.updateCorpDivision($scope.copyContractData.CUST_MBR_SID);
            }

            if ($scope.contractData.DC_ID <= 0 && $scope.isCopyContract === false) {
                getCurrentQuarterDetails();
            } else {
                updateQuarterByDates('START_DT', $scope.contractData.START_DT);
                updateQuarterByDates('END_DT', $scope.contractData.END_DT);
            }

            $timeout(function () {
                !$scope.isNewContract
                    ? $scope.status = { 'isOpen': true }
                    : setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
            }, 300);
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
                    result[key] = value;
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

            $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = $scope.contractData._behaviors
                .isError["C2A_DATA_C2A_ID"] = false;
            if ($scope.contractData.DC_ID < 0) $scope.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
            hasUnSavedFiles = true;
            $scope.contractData.AttachmentError = false;
        }

        $scope.onFileRemove = function (e) {
            var numberOfFiles = $("#fileUploader").data("kendoUpload").getFiles().length;
            if (numberOfFiles <= 1) {
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
                    template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy') #",
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
                    $scope.contractData.CUST_ACCNT_DIV = newValue["CUST_ACCNT_DIV_UI"].toString()
                        .replace(/,/g, '/');
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
                    pastDateConfirm(newValue["START_DT"], oldValue["START_DT"]);
                    if (!unWatchStartDate) {
                        updateQuarterByDates('START_DT', newValue["START_DT"]);
                    }
                }
                unWatchStartDate = false;
            }

            if (oldValue["END_DT"] !== newValue["END_DT"]) {
                if (moment(oldValue["END_DT"]).format('l') === moment(newValue["END_DT"]).format('l')) return;
                if (isValidDate('END_DT', oldValue["END_DT"], newValue["END_DT"])) {
                    if (!unWatchEndDate) {
                        updateQuarterByDates('END_DT', newValue["END_DT"]);
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

        $scope.showAddPricingTable = function (ps) {
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
                    alert("Cannot insert a new row. You already have the maxium number of rows allowed in one Pricing Table. Pleas emake a new Pricing table or delete some existing rows the current pricing table.");
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

                        $scope.$broadcast('addRowByTrackerNumber', newRow)
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
                var t = inpt.position().top + inpt.height() + 4;
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
            }, 2000);
        }

        // **** AUTODILL DEFAULTS Methods ****
        //
        function openAutofillModal(pt) {

            if (pt != null) {
                $scope.setNptTemplate(pt);
                //if pt not null, need to also update the nPT default atrb values
                updateNPTDefaultValues(pt);
            }

            var autofillData = {
                'DEALTYPE': $scope.newPricingTable["OBJ_SET_TYPE_CD"],
                'EXTRA': $scope.newPricingTable["_extraAtrbs"],             //may not be needed, extras are a one time set thing such as num tiers that we may choose to keep in the LNAV
                'DEFAULT': $scope.newPricingTable["_defaultAtrbs"]
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

            //note: copy pasted from the watch function far below, slight modificaitons, can probably be compressed to 1 function call for reusability?
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

            //not sure if necessary, javascript pass by value/reference always throwin' me off. :(
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

        // **** UNMARK CURRENT Methods ****
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
            topbar.show();

            var data = {
                objSetType: objSetType,
                ids: ids,
                attribute: atrb,
                value: value
            };

            objsetService.updateAtrbValue($scope.getCustId(), $scope.contractData.DC_ID, data).then(
                function (results) {
                    $scope.setBusy("Done", "Save Complete.");
                    topbar.hide();
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.isAutoSaving = false;
                },
                function (response) {
                    $scope.setBusy("Error", "Could not save the value.", "Error");
                    logger.error("Could not save the value.", response, response.statusText);
                    topbar.hide();
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                    $scope.isAutoSaving = false;
                }
            );

        }

        $scope.emailData = [];

        $scope.actionPricingStrategy = function (ps, actn) {
        	$scope.setBusy("Updating Pricing Strategy...", "Please wait as we update the Pricing Strategy!", "Info", true);
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
        	$scope.setBusy("Updating Pricing Strategies...", "Please wait as we update the Pricing Strategy!", "Info", true);

            $scope.emailData = data;
            $scope.pricingStrategyStatusUpdated = false;
            objsetService.actionPricingStrategies($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, data).then(
                function (data) {
                    $scope.messages = data.data.Messages;



                    $timeout(function () {
                        $scope.$broadcast('refresh');
                        $("#wincontractMessages").data("kendoWindow").open();
                        $scope.refreshContractData();
                        $scope.setBusy("", "");
                    }, 50);

                    $scope.pricingStrategyStatusUpdated = true;
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
                if (!dataItem._actions) dataItem._actions = {};
                dataItem._actions["Hold"] = true;
            }
            if (dataItem.WF_STG_CD !== "Hold" && $scope.messages[0].ShortMessage === "Hold") {
                // put on hold
                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.isReadOnly) dataItem._behaviors.isReadOnly = {};
                dataItem._behaviors.isReadOnly["DEAL_GRP_EXCLDS"] = true;
                dataItem._behaviors.isReadOnly["DEAL_GRP_CMNT"] = true;
            }
            if (dataItem.WF_STG_CD === "Hold" && $scope.messages[0].ShortMessage !== "Hold") {
                // taken off hold
                if (!dataItem._behaviors) dataItem._behaviors = {};
                if (!dataItem._behaviors.isReadOnly) dataItem._behaviors.isReadOnly = {};
                dataItem._behaviors.isReadOnly["DEAL_GRP_EXCLDS"] = false;
                dataItem._behaviors.isReadOnly["DEAL_GRP_CMNT"] = false;
            }

            dataItem.WF_STG_CD = $scope.messages[0].ShortMessage;
            if ($scope.messages.length > 1) {
                dataItem.PS_WF_STG_CD = $scope.messages[1].ShortMessage;
            }
        }

        $scope.chgTerms = function() {
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
            kendo.confirm("Are you sure that you want to delete this pricing strategy?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Deleting...", "Deleting the Pricing Strategy", "Info");
                    $scope._dirty = false;
                    topbar.show();
                    // Remove from DB first... then remove from screen
                    objsetService.deletePricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("Delete Failed", "Unable to Deleted the Pricing Strategy", "Error");
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

                            $scope.setBusy("Delete Successful", "Deleted the Pricing Strategy", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);
                            topbar.hide();

                            // redirect if focused PT belongs to deleted PS
                            if (deleteReload) {
                                $state.go('contract.manager', {
                                    cid: $scope.contractData.DC_ID
                                }, { reload: true });
                            }
                        },
                        function (result) {
                            logger.error("Could not delete the Pricing Strategy.", result, result.statusText, "Error");
                            topbar.hide();
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.rollBackPricingStrategy = function (ps) {
            kendo.confirm("Are you sure that you want to undo this pricing strategy re-deal?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("RollBack...", "Rolling the Pricing Strategy back", "Info");
                    $scope._dirty = false;
                    topbar.show();
                    // Remove from DB first... then remove from screen
                    objsetService.rollBackPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps.DC_ID).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("RollBack Failed", "Unable to RollBack the Pricing Strategy re-deal", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            $scope.setBusy("RollBack Successful", "RollBack the Pricing Strategy re-deal", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);
                            topbar.hide();

                            // You changed the list, just reload it.
                            $scope.reloadPage();
                        },
                        function (result) {
                            logger.error("Could not RollBack the Pricing Strategy.", result, result.statusText, "Error");
                            topbar.hide();
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.cancelPricingStrategy = function (ps) {
            kendo.confirm("Are you sure that you want to cancel this pricing strategy?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Cancel...", "Canceling the Pricing Strategy back", "Info");
                    $scope._dirty = false;
                    topbar.show();
                    objsetService.cancelPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, ps).then(
                        function (data) {
                            if (data.data.Messages[0].MsgType !== 1) {
                                $scope.setBusy("Cancel Failed", "Unable to Cancel the Pricing Strategy", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            $scope.setBusy("Cancel Successful", "Cancel the Pricing Strategy", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);
                            topbar.hide();

                            $state.go('contract.manager', {
                                cid: $scope.contractData.DC_ID
                            }, { reload: true });
                        },
                        function (result) {
                            logger.error("Could not Cancel the Pricing Strategy.", result, result.statusText, "Error");
                            topbar.hide();
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.deletePricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to delete this pricing table?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Deleting...", "Deleting the Pricing Table", "Info", true);
                    $scope._dirty = false;
                    topbar.show();

                    // Remove from DB first... then remove from screen
                    objsetService.deletePricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("Delete Failed", "Unable to Delete the Pricing Table", "Error");
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

                            $scope.setBusy("Delete Successful", "Deleted the Pricing Table", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            topbar.hide();

                            // redirect if deleted the currently focused PT
                            if (deleteReload) {
                                $state.go('contract.manager', {
                                    cid: $scope.contractData.DC_ID
                                }, { reload: true });
                            }
                        },
                        function (response) {
                            logger.error("Could not delete the Pricing Table.", response, response.statusText, "Error");
                            $scope.setBusy("", "");
                            topbar.hide();
                        }
                    );
                });
            });
        }
        // ROLLBACK NEED TO VERIFY BELOW WITH PHIL
        $scope.rollBackPricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to undo this pricing table re-deal?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Rollback...", "Rolling Back the Pricing Table");
                    $scope._dirty = false;
                    topbar.show();

                    // Remove from DB first... then remove from screen
                    objsetService.rollBackPricingTable($scope.getCustId(), $scope.contractData.DC_ID, pt.DC_ID).then(
                        function (data) {
                            if (data.data.MsgType !== 1) {
                                $scope.setBusy("RollBack Failed", "Unable to RollBack the Pricing Table re-deal", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            logger.info(data.data.Message, data.data.Message, "Rollback Results");
                            $scope.setBusy("RollBack Successful", "RollBack the Pricing Table re-deal", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            topbar.hide();

                            // You changed the list, just reload it.
                            $scope.reloadPage();
                        },
                        function (response) {
                            logger.error("Could not RollBack the Pricing Table.", response, response.statusText, "Error");
                            $scope.setBusy("", "");
                            topbar.hide();
                        }
                    );
                });
            });
        }
        $scope.cancelPricingTable = function (ps, pt) {
            kendo.confirm("Are you sure that you want to cancel this pricing table?").then(function () {
                $scope.$apply(function () {
                    $scope.setBusy("Canceling...", "Canceling the Pricing Table");
                    $scope._dirty = false;
                    topbar.show();
                    objsetService.cancelPricingTable($scope.getCustId(), $scope.contractData.DC_ID, $scope.contractData.CUST_ACCPT, pt).then(
                        function (data) {
                            if (data.data.Messages[0].MsgType !== 1) {
                                $scope.setBusy("Cancel Failed", "Unable to Cancel the Pricing Table", "Error");
                                $timeout(function () {
                                    $scope.setBusy("", "");
                                }, 4000);
                                return;
                            }

                            $scope.setBusy("Cancel Successful", "Canceled the Pricing Table", "Success");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 2000);
                            topbar.hide();

                            $state.go('contract.manager', {
                                cid: $scope.contractData.DC_ID
                            }, { reload: true });
                        },
                        function (result) {
                            logger.error("Could not Cancel the Pricing Table.", result, result.statusText, "Error");
                            topbar.hide();
                            $scope.setBusy("", "");
                        }
                    );
                });
            });
        }
        $scope.deletePricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Deleting...", "Deleting the Pricing Table Row and Deal");
                $scope._dirty = false;
                topbar.show();

                // Remove from DB first... then remove from screen
                objsetService.deletePricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Delete Failed", "Unable to Deleted the Pricing Table", "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.$broadcast('removeRow', wip.DC_PARENT_ID);

                        $scope.setBusy("Delete Successful", "Deleted the Pricing Table Row and Deal", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        topbar.hide();

                    },
                    function (response) {
                        logger.error("Could not delete the Pricing Table.", response, response.statusText);
                        $scope.setBusy("", "");
                        topbar.hide();
                    }
                );
            });
        }
        $scope.rollbackPricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Rolling Back...", "Rolling Back the Pricing Table Row and Deal");
                $scope._dirty = false;
                topbar.show();

                // Remove from DB first... then remove from screen
                objsetService.rollbackPricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            $scope.setBusy("Rollback Failed", "Unable to Rollback the Pricing Table", "Error");
                            $timeout(function () {
                                $scope.setBusy("", "");
                            }, 4000);
                            return;
                        }

                        $scope.setBusy("Rollback Successful", "Rollback of the Pricing Table Row and Deal", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        topbar.hide();

                        // You changed the deals list, just reload it.
                        $scope.reloadPage();
                    },
                    function (response) {
                        logger.error("Could not Rollback the Pricing Table.", response, response.statusText);
                        $scope.setBusy("", "");
                        topbar.hide();
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
            $scope.copyObj("Pricing Strategy", c.PRC_ST, ps.DC_ID, objsetService.copyPricingStrategy);
        }
        $scope.copyPricingTable = function (ps, pt) {
            $scope.copyObj("Pricing Table", ps.PRC_TBL, pt.DC_ID, objsetService.copyPricingTable);
        }
        $scope.copyObj = function (objType, objTypes, id, invokFunc) {
            $scope.setBusy("Copying", "Copying the " + objType);
            $scope._dirty = false;
            topbar.show();

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
                topbar.hide();
                $scope.setBusy("", "");
                return;
            }

            var item = util.clone(selectedItems[0]);
            if (!item) {
                kendo.alert("Unable to copy the " + objType);
                topbar.hide();
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
                    topbar.hide();
                    $scope.setBusy("", "");
                },
                function (response) {
                    logger.error("Could not copy the " + objType + ".", response, response.statusText);
                    topbar.hide();
                    $scope.setBusy("", "");
                }
            );
        }

        // **** UNGROUP Methods ****
        //
        $scope.unGroupPricingTableRow = function (wip) {
            $scope.$apply(function () {
                $scope.setBusy("Splitting Deals...", "Splitting the Grouped Pricing Table Row into seperate deals");
                $scope._dirty = false;
                topbar.show();

                // Remove from DB first... then remove from screen
                objsetService.unGroupPricingTableRow(wip.CUST_MBR_SID, $scope.contractData.DC_ID, wip.DC_PARENT_ID).then(
                    function (data) {
                        if (!!data.data.MsgType && data.data.MsgType !== 1) {
                            $scope.setBusy("Splitting Failed", "Unable to Split the Pricing Table Row");
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
                                var dcPrdTitle = data.data.Messages[m].ExtraDetails;

                                for (var d = 0; d < $scope.wipData.length; d++) {
                                    if ($scope.wipData[d].DC_ID === dcId) {
                                        $scope.wipData[d].DC_PARENT_ID = dcParentId;
                                        $scope.wipData[d]._parentCnt = 1;
                                        $scope.wipData[d].PTR_USER_PRD = dcPrdTitle;
                                    }
                                }
                            }
                        }

                        // notify opGrid of the change
                        $scope.$broadcast('updateGroup', data.data.Messages);

                        // refresh upper contract
                        if (wip !== undefined) $scope.refreshContractData(wip.DC_ID);

                        $scope.setBusy("Split Successful", "Split the Pricing Table Row into single Deals", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        topbar.hide();

                    },
                    function (response) {
                        logger.error("Could not split the Pricing Table Row.", response, response.statusText);
                        topbar.hide();
                    }
                );
            });
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
                    // sync all detail data sources into main grid datasource for a single save
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
                    }
                }
                $scope.$broadcast('syncDs');

                // Pricing Table Row
                if (curPricingTableData.length > 0 && sData != undefined) {
                    // Only save if a product has been filled out
                    sData = sData.filter(function (obj) {
                        return obj.PTR_USER_PRD !== undefined && obj.PTR_USER_PRD !== null && obj.PTR_USER_PRD !== "";
                    });

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


                    var validated_DC_Id = [];
                    for (var s = 0; s < sData.length; s++) {

                    	if (curPricingTableData[0].OBJ_SET_TYPE_CD === "VOL_TIER") {
                    		// HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Now we have to turn them back before saving.
                    		if (sData[s]["END_VOL"].toString().toUpperCase() != "UNLIMITED") {
                    			sData[s]["END_VOL"] = parseInt(sData[s]["END_VOL"].toString().replace(/,/g, "") || 0);
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
                                if (!sData[s]._behaviors) sData[s]._behaviors = {};
                                if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                sData[s]._behaviors.isError[dateFields[d]] = true;
                                sData[s]._behaviors.validMsg[dateFields[d]] = "Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.";
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push("Date is invalid or formated improperly. Try formatting as mm/dd/yyyy.");
                            } else {
                                // check dates against contract
                                if (dateFields[d] === "START_DT") {
                                    var tblStartDate = sData[s][dateFields[d]];
                                    var endDate = $scope.contractData.END_DT;
                                    if (moment(tblStartDate).isAfter(endDate)) {
                                        if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                        if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                        sData[s]._behaviors.isError['START_DT'] = true;
                                        sData[s]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")";
                                        if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                        errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment(endDate).format("MM/DD/YYYY") + ")");
                                    }
                                }
                                if (dateFields[d] === "END_DT") {
                                    var tblEndDate = sData[s][dateFields[d]];
                                    var startDate = $scope.contractData.START_DT;
                                    if (moment(tblEndDate).isBefore(startDate)) {
                                        if (sData[s]._behaviors !== null && sData[s]._behaviors !== undefined) {
                                            if (!sData[s]._behaviors.isError) sData[s]._behaviors.isError = {};
                                            if (!sData[s]._behaviors.validMsg) sData[s]._behaviors.validMsg = {};
                                            sData[s]._behaviors.isError['END_DT'] = true;
                                            sData[s]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")";
                                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                            errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment(startDate).format("MM/DD/YYYY") + ")");
                                        }
                                    }
                                }
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

                    sData = $scope.deNormalizeData(util.deepClone(sData));
                }
            }

            // WIP Deals
            if (stateName === "contract.manager.strategy.wip" && !bypassLowerContract) {
                source = "WIP_DEAL";
                gData = $scope.wipData;

                for (var iterator = 0; iterator < gData.length; iterator++) {
                    if (gData[iterator].EXPIRE_FLG === true) {
                        gData[iterator].EXPIRE_FLG = 1;

                    }
                    else {
                        gData[iterator].EXPIRE_FLG = 0;
                    }
                }

                // Wip Deal
                if (gData !== undefined && gData !== null) {
                    for (var i = 0; i < gData.length; i++) {
                        // TODO... this should probably mimic Pricing Table Rows
                        if (gData[i].DC_ID === null || gData[i].DC_ID === 0) gData[i].DC_ID = $scope.uid--;

                        // Kindof a lame hack... should make it more dynamic, but for now let's see if we can get this working
                        if (Array.isArray(gData[i].TRGT_RGN)) gData[i].TRGT_RGN = gData[i].TRGT_RGN.join();
                        if (Array.isArray(gData[i].QLTR_BID_GEO)) gData[i].QLTR_BID_GEO = gData[i].QLTR_BID_GEO.join();
                        if (Array.isArray(gData[i].DEAL_SOLD_TO_ID)) gData[i].DEAL_SOLD_TO_ID = gData[i].DEAL_SOLD_TO_ID.join();


                        // check dates against contract
                        if (moment(gData[i]["START_DT"]).isAfter($scope.contractData.END_DT)) {
                            if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                            if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                            gData[i]._behaviors.isError['START_DT'] = true;
                            gData[i]._behaviors.validMsg['START_DT'] = "Start date cannot be greater than the Contract End Date (" + moment($scope.contractData.END_DT).format("MM/DD/YYYY") + ")";
                            if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                            errs.PRC_TBL_ROW.push("Start date cannot be greater than the Contract End Date (" + moment($scope.contractData.END_DT).format("MM/DD/YYYY") + ")");
                        }

                        if (moment(gData[i]["END_DT"]).isBefore($scope.contractData.START_DT)) {
                            if (gData[i]._behaviors !== null && gData[i]._behaviors !== undefined) {
                                if (!gData[i]._behaviors.isError) gData[i]._behaviors.isError = {};
                                if (!gData[i]._behaviors.validMsg) gData[i]._behaviors.validMsg = {};
                                gData[i]._behaviors.isError['END_DT'] = true;
                                gData[i]._behaviors.validMsg['END_DT'] = "End date cannot be earlier than the Contract Start Date (" + moment($scope.contractData.START_DT).format("MM/DD/YYYY") + ")";
                                if (!errs.PRC_TBL_ROW) errs.PRC_TBL_ROW = [];
                                errs.PRC_TBL_ROW.push("End date cannot be earlier than the Contract Start Date (" + moment($scope.contractData.START_DT).format("MM/DD/YYYY") + ")");
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

                        // This is silly hardcoding because these are not in our tempalte and they are used by DSA only - set them to proper dates.
                        if (gData[i]["ON_ADD_DT"] !== undefined) gData[i]["ON_ADD_DT"] = moment(gData[i]["ON_ADD_DT"]).format("MM/DD/YYYY");
                        if (gData[i]["REBATE_BILLING_START"] !== undefined) gData[i]["REBATE_BILLING_START"] = moment(gData[i]["REBATE_BILLING_START"]).format("MM/DD/YYYY");
                        if (gData[i]["REBATE_BILLING_END"] !== undefined) gData[i]["REBATE_BILLING_END"] = moment(gData[i]["REBATE_BILLING_END"]).format("MM/DD/YYYY");
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

            return {
                "Contract": modCt,
                "PricingStrategy": modPs,
                "PricingTable": curPricingTableData,
                "PricingTableRow": sData === undefined ? [] : sData,
                "WipDeals": gData === undefined ? [] : gData,
                "EventSource": source,
                "Errors": errs
            }
        }

        $scope.validateTitles = function () {
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
                        $scope.curPricingTable._behaviors.validMsg["TITLE"] = "The Pricing Table needs a Title.";
                        $scope.curPricingTable._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    }
                    else if (!isPtUnique) {
                        $scope.curPricingTable._behaviors.validMsg["TITLE"] = "The Pricing Table must have unique name within contract.";
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
                        $scope.curPricingStrategy._behaviors.validMsg["TITLE"] = "The Pricing Strategy needs a Title.";
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else if (!isPsUnique) {
                        $scope.curPricingStrategy._behaviors
                            .validMsg["TITLE"] = "The Pricing Strategy must have unique name within strategy.";
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = true;
                        rtn = false;
                    } else {
                        $scope.curPricingStrategy._behaviors.isError["TITLE"] = false;
                    }
                }
            }

            return rtn;
        }

        // **** SAVE CONTRACT Methods ****
        //
        $scope.saveEntireContractBase = function (stateName, forceValidation, forcePublish, toState, toParams, delPtr, callback) {
            if (!$scope._dirty && !forceValidation) {
                return;
            }

            // if save already started saving... exit
            // if validate triggers from product translation continue..validating data
            if ($scope.isBusyMsgTitle !== "Saving your data..." && $scope.isBusyMsgTitle !== "Validating your data..." && $scope.isBusyMsgTitle !== "Overlapping Deals...") {
                if (!!$scope.isBusyMsgTitle && $scope.isBusyMsgTitle !== "") return;
            }

            $scope.saveEntireContractRoot(stateName, forceValidation, forcePublish, toState, toParams, delPtr, null, callback);

            return;
        }

        $scope.saveEntireContractRoot = function (stateName, forceValidation, forcePublish, toState, toParams, delPtr, bypassLowerContract, callback) {
            var pc = new perfCacheBlock("Save Contract Root", "UX");
            var pcUi = new perfCacheBlock("Gather data to pass", "UI");

            if (forceValidation === undefined || forceValidation === null) forceValidation = false;
            if (forcePublish === undefined || forcePublish === null) forcePublish = false;
            if (bypassLowerContract === undefined || bypassLowerContract === null) bypassLowerContract = false;

            $scope.setBusy("Saving your data...", "Please wait as we save your information!", "Info", true);

            // async save data
            topbar.show();

            $scope.clearValidations();

            if (!$scope.validateTitles()) {
                $scope.setBusy("", "");
                topbar.hide();
                $scope.isAutoSaving = false;

                var msg = [];
                if ($scope.curPricingTable._behaviors.isError["TITLE"]) msg.push("Pricing Table");
                if ($scope.curPricingStrategy._behaviors.isError["TITLE"]) msg.push("Pricing Strategy");

                kendo.alert("The " + msg.join(" and ") + " either must have a title or needs a unique name in order to save.");
                return;
            }

            var data = $scope.createEntireContractBase(stateName, $scope._dirtyContractOnly, forceValidation, bypassLowerContract);
            pc.mark("Built data structure");

            // If there are critical errors like bad dates, we need to stop immediately and have the user fix them
            if (!!data.Errors && !angular.equals(data.Errors, {})) {
                logger.warning("Please fix validation errors before proceeding", $scope.contractData, "");
                $scope.syncCellValidationsOnAllRows($scope.pricingTableData["PRC_TBL_ROW"]); /////////////
                $scope.setBusy("", "");
                topbar.hide();
                return;
            }

            var copyData = util.deepClone(data);
            $scope.compressJson(copyData);
            if ($scope.removeCleanItems(copyData, delPtr)) {
                $scope.setBusy("");
                topbar.hide();
                $scope.isAutoSaving = false;
                kendo.alert("Nothing to save.");
                return;
            }

            util.console("updateContractAndCurPricingTable Started");
            var isDelPtr = !!delPtr && delPtr.length > 0;

            pc.add(pcUi.stop());
            var pcService = new perfCacheBlock("Update Contract And CurPricing Table", "MT");
            objsetService.updateContractAndCurPricingTable($scope.getCustId(), $scope.contractData.DC_ID, copyData, forceValidation, forcePublish, isDelPtr).then(
                function (results) {

                    var data = results.data.Data;

                    pcService.addPerfTimes(results.data.PerformanceTimes);
                    pc.add(pcService.stop());
                    var pcUI = new perfCacheBlock("Processing returned data", "UI");
                    util.console("updateContractAndCurPricingTable Returned");

                    var i;
                    $scope.setBusy("Saving your data...Done", "Processing results now!", "Info", true);

                    var anyWarnings = false;

                    pc.mark("Constructing returnset");
                    if (!!data.PRC_TBL_ROW) {
                        data.PRC_TBL_ROW = $scope.pivotData(data.PRC_TBL_ROW);
                        for (i = 0; i < data.PRC_TBL_ROW.length; i++) {
                            if (!!data.PRC_TBL_ROW[i].PTR_SYS_PRD) {
                                // check for pivots
                                data.PRC_TBL_ROW[i].PTR_SYS_PRD = $scope.uncompress(data.PRC_TBL_ROW[i].PTR_SYS_PRD);
                            }
                            if (data.PRC_TBL_ROW[i].warningMessages !== undefined && data.PRC_TBL_ROW[i].warningMessages.length > 0) anyWarnings = true;
                        }

                        $scope.updateResults(data.PRC_TBL_ROW, $scope.pricingTableData.PRC_TBL_ROW); ////////////

                        if (!!$scope.spreadDs) {
                            $scope.spreadDs.read();
                            $scope.syncCellValidationsOnAllRows($scope.pricingTableData.PRC_TBL_ROW);
                        }
                    }

                    if (!!data.WIP_DEAL) {
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
                                }
                            }
                            $scope.updateResults(data.WIP_DEAL, $scope.pricingTableData === undefined ? [] : $scope.pricingTableData.WIP_DEAL);
                        }
                    }

                    topbar.hide();

                    if (!anyWarnings || !forceValidation) {
                        $scope.stealthMode = true;
                        $scope.setBusy("Save Successful", "Saved the contract", "Success");
                        $scope.$broadcast('saveComplete', data);
                        $scope.resetDirty();

                        if (!!toState) {
                            $scope.stealthMode = false;
                            if ($scope.switchingTabs) toState = toState.replace(/.wip/g, '');
                            $state.go(toState, toParams, { reload: true });
                        } else {
                            $timeout(function () {
                                if ($scope.isBusyMsgTitle !== "Overlapping Deals...")
                                    $scope.setBusy("", "");
                                $scope.stealthMode = false;
                            }, 1000);
                        }
                    } else {
                        $scope.setBusy("Saved with warnings", "Didn't pass Validation", "Warning");
                        $scope.$broadcast('saveWithWarnings', data);
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 2000);
                    }

                    if (toState === undefined || toState === null || toState === "") {
                        $scope.refreshContractData($scope.curPricingStrategyId, $scope.curPricingTableId);
                    }
                    $scope.isAutoSaving = false;

                    util.console("updateContractAndCurPricingTable Complete");

                    //if a callback function is provided, invoke it now once everything else is completed
                    if (!!callback && typeof callback === "function") {
                        callback();
                        pc.add(pcUI.stop());
                        $scope.pc.add(pc.stop());
                    } else {
                        pc.add(pcUI.stop());
                        $scope.pc.add(pc.stop());
                        $scope.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                    }

                },
                function (response) {
                    $scope.setBusy("Error", "Could not save the contract.", "Error");
                    logger.error("Could not save the contract.", response, response.statusText);
                    topbar.hide();
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
                        var letter = (c >= 25) ? String.fromCharCode(intA) + String.fromCharCode(intA + c - 25) : String.fromCharCode(intA + c);
                        $scope.colToLetter[value.field] = letter;
                        $scope.letterToCol[letter] = value.field;
                    }
                });
            }
            return cols;
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
                    sheet.range(row + 1, c++).validation($scope.myDealsValidation(isError, msg, isRequired));
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

            //if (!!data.WipDeals) {
            //    data.WipDeals = data.WipDeals.filter(function (a) { return a._dirty });
            //}

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

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER") {
                var pivotFieldName = "NUM_OF_TIERS";
                return !!$scope.curPricingTable[pivotFieldName];        //For code review - Note: is this redundant?  can't we just have VT and KIT always return true?  VT will always have a num of tiers.  If actually not redundant then we need to do similar for KIT deal type
            }

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                return true;
            }
        }
        $scope.numOfPivot = function (dataItem) {
            if (!$scope.curPricingTable) return false;

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER" || $scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
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
                    return parseInt($scope.curPricingTable[pivotFieldName]);
                }

                if (!!dataItem[pivotFieldName]) return parseInt(dataItem[pivotFieldName]);      //if dataItem (ptr) has its own num tiers atrb


                //VT deal type
                var pivotVal = $scope.curPricingTable[pivotFieldName];

                return pivotVal === undefined ? 1 : parseInt(pivotVal);
            }

            return 1;   //num of pivot is 1 for undim deal types
        }

        $scope.pivotData = function (data) {        //convert how we save data in MT to UI spreadsheet consumable format
            if (!$scope.isPivotable()) return data;
            var newData = [];

            for (var d = 0; d < data.length; d++) {
                // Tiered data
                var numTiers = $scope.numOfPivot(data[d]);
                for (var t = 1; t <= numTiers; t++) {
                    var lData = util.deepClone(data[d]);
                    if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER") {
                        // Vol-tier specific cols with tiers
                        for (var i = 0; i < tierAtrbs.length; i++) {
                            var tieredItem = tierAtrbs[i];
                            lData[tieredItem] = lData[tieredItem + "_____10___" + t];

                            mapTieredWarnings(data[d], lData, tieredItem, tieredItem, t);

                    		// HACK: To give end volumes commas, we had to format the nubers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                            if (tieredItem == "END_VOL" && lData["END_VOL"].toString().toUpperCase() != "UNLIMITED") {
                        		lData["END_VOL"] = kendo.toString(parseInt(lData["END_VOL"] || 0), "n0");
							}
                        }
                        // Disable all Start vols except the first
                        if (t !== 1 && !!data[d]._behaviors) {
                            if (!data[d]._behaviors.isReadOnly) {
                                data[d]._behaviors.isReadOnly = {};
                            }
                            lData._behaviors.isReadOnly["STRT_VOL"] = true;
                        }
                    } else if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                        // KIT specific cols with 'tiers'
                        for (var i = 0; i < $scope.kitDimAtrbs.length; i++) {
                            var tieredItem = $scope.kitDimAtrbs[i];
                            lData[tieredItem] = lData[tieredItem + "_____20___" + (t - 1)]; //-1 because KIT dim starts at 0 whereas VT num tiers begin at 1
                            if (tieredItem == "TIER_NBR") {
                                lData[tieredItem] = t; // KIT add tier number
                            }
                            mapTieredWarnings(data[d], lData, tieredItem, tieredItem, (t - 1));
                        }

                        lData["TEMP_TOTAL_DSCNT_PER_LN"] = $scope.calculateTotalDsctPerLine(lData["DSCNT_PER_LN_____20___" + (t - 1)], lData["QTY_____20___" + (t - 1)]);
                        lData["TEMP_KIT_REBATE"] = $scope.calculateKitRebate(data, d, numTiers, true);
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
                    kitRebateTotalVal += (parseFloat(data[firstTierRowIndex]["ECAP_PRICE_____20___" + i]) || 0);
                } else {
                    if (i < data.length) {
                        kitRebateTotalVal += (parseFloat(data[(firstTierRowIndex + i)]["ECAP_PRICE"]) || 0);
                    }
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

            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "VOL_TIER") {
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

                            if ($scope.curPricingTable['OBJ_SET_TYPE_CD'] === "KIT") {
                                // Clear out the dimensions of the not-in-use tiers because KIT has dynamic tiering,
                                //		which might leave those dimensions with data, and save stray attributes with no product association in our db.
                                for (var i = 0 ; i < $scope.maxKITproducts; i++) {
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
            $scope.saveEntireContractBase($state.current.name, false, false, null, null, delIds);
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

        $scope.saveContract = function () {
            topbar.show();
            $scope.setBusy("Saving Contract", "Saving the Contract Information");

            // Contract Data
            var ct = $scope.contractData;

            // check for NEW contract
            if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

            // Add to DB first... then add to screen
            objsetService.createContract($scope.getCustId(), $scope.contractData.DC_ID, ct).then(
                function (data) {
                    $scope.updateResults(data.data.CNTRCT, ct);

                    //Check for errors
                    if (!$scope.checkForMessages(ct, "CNTRCT", data)) {
                        topbar.hide();
                        $scope.setBusy("Save unsuccessful", "Could not create the contract", "Error");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        return;
                    };

                    $scope.setBusy("Save Successful", "Saved the contract", "Success");
                    topbar.hide();

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
                    topbar.hide();
                }
            );
        }

        $scope.copyContract = function () {
            topbar.show();
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
                        topbar.hide();
                        $scope.setBusy("Copy Unsuccessful", "Could not copy the contract", "Error");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        return;
                    };

                    $scope.setBusy("Copy Successful", "Copied the contract", "Success");
                    topbar.hide();

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
                    topbar.hide();
                }
            );
        }

        $scope.isValid = true;
        $scope.customContractValidate = function () {
            $scope.isValid = true;
            var ct = $scope.contractData;

            // If user has clicked on save, that means he has accepted the default contract name set, make it dirty to avoid any changes to dates making a change to contract name.
            if (!$scope.contractData._behaviors) $scope.contractData._behaviors = {};
            $scope.contractData._behaviors.isDirty['TITLE'] = true;

            if (!$scope.contractData.CUST_MBR_SID) {
                $scope.contractData._behaviors.validMsg["CUST_MBR_SID"] = "Please select a valid customer";
                $scope.contractData._behaviors.isError["CUST_MBR_SID"] = true;
                $scope.isValid = false;
            } else {
                $scope.contractData._behaviors.validMsg["CUST_MBR_SID"] = "";
                $scope.contractData._behaviors.isError["CUST_MBR_SID"] = false;
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
                if ($scope.isCopyContract) {
                    $scope.copyContract();
                } else {
                    $scope.saveContract();
                }
            } else {
                $timeout(function () {
                    if (!!$("input.isError")[0]) $("input.isError")[0].focus();
                },
                    300);
            }
        }

        $scope.quickSaveContract = function (rtnFunc, param) {
            topbar.show();
            $scope.setBusy("Saving Contract", "Saving the Contract Information");

            // Contract Data
            var ct = $scope.contractData;

            objsetService.createContract($scope.getCustId(), $scope.contractData.DC_ID, ct).then(
                function (data) {
                    if (!!rtnFunc) rtnFunc(param);
                    $scope.updateResults(data.data.CNTRCT, ct);
                    $scope.setBusy("Save Successful", "Saved the contract", "Success");
                    topbar.hide();

                    $scope.setBusy("", "");
                },
                function (result) {
                    logger.error("Could not create the contract.", result, result.statusText);
                    $scope.setBusy("", "");
                    topbar.hide();
                }
            );
        }

        // **** NEW PRICING STRATEGY Methods ****
        //
        $scope.newStrategy = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
        $scope.addPricingStrategy = function () {
            topbar.show();

            $scope.setBusy("Saving...", "Saving the Pricing Strategy", "Info", true);

            var ct = $scope.contractData;

            // Clone base model and populate changesmod
            var ps = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
            ps.DC_ID = $scope.uid--;
            ps.DC_PARENT_ID = ct.DC_ID;
            ps.PRC_TBL = [];
            ps.TITLE = $scope.newStrategy.TITLE;

            // Add to DB first... then add to screen
            objsetService.createPricingStrategy($scope.getCustId(), $scope.contractData.DC_ID, ps).then(
                function (data) {
                    $scope.updateResults(data.data.PRC_ST, ps);

                    if ($scope.contractData.PRC_ST === undefined) $scope.contractData.PRC_ST = [];
                    $scope.contractData.PRC_ST.push(ps);
                    $scope.showAddPricingTable(ps);
                    topbar.hide();
                    $scope.setBusy("Save Successful", "Added Pricing Strategy", "Success");
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 1000);
                    $scope.newStrategy.TITLE = "";
                    $scope.curPricingStrategy = ps;
                    $scope.curPricingStrategyId = ps.DC_ID;
                    $scope.addStrategyDisabled = false;
                    $scope.refreshContractData($scope.curPricingStrategyId);
                },
                function (result) {
                    $scope.addStrategyDisabled = false;
                    logger.error("Could not create the pricing strategy.", response, response.statusText);
                    $scope.setBusy("", "");
                    topbar.hide();
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
            topbar.show();

            $scope.setBusy("Saving...", "Saving Pricing Table", "Info");

            // Clone base model and populate changes
            var pt = util.clone($scope.templates.ObjectTemplates.PRC_TBL[$scope.newPricingTable.OBJ_SET_TYPE_CD]);
            if (!pt) {
                $scope.addTableDisabled = false;
                logger.error("Could not create the pricing table.", "Error");
                topbar.hide();
                $scope.setBusy("", "");
                return;
            }

            pt.DC_ID = $scope.uid--;
            pt.DC_PARENT_ID = $scope.curPricingStrategy.DC_ID;
            pt.OBJ_SET_TYPE_CD = $scope.newPricingTable.OBJ_SET_TYPE_CD;
            pt.TITLE = $scope.newPricingTable.TITLE;

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
                    $scope.setBusy("Saved", "Redirecting you to the Contract Editor");
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
                    logger.error("Could not create the pricing table.", response, response.statusText);
                    topbar.hide();
                    $scope.setBusy("", "");
                }
            );
        }

        $scope.editPricingTable = function () {
            topbar.show();

            $scope.setBusy("Saving...", "Saving Pricing Table", "Info", true);

            // Clone base model and populate changes
            var pt = util.clone($scope.currentPricingTable);

            //for now we do not allow edit of extra atrbs
            //for (var atrb in $scope.newPricingTable._extraAtrbs) {
            //    if ($scope.newPricingTable._extraAtrbs.hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {
            //        //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
            //        pt[atrb] = $scope.newPricingTable._extraAtrbs[atrb].value;
            //    }
            //}
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

                    logger.success("Edited Pricing Table", pt, "Save Successful");
                    topbar.hide();
                    $scope.setBusy("", "");
                },
                function (response) {
                    $scope.addTableDisabled = false;
                    logger.error("Could not edit the pricing table.", response, response.statusText);
                    topbar.hide();
                    $scope.setBusy("", "");
                }
            );
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

            // Check if selected deal type
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
            if (oldValue === newValue) return;

            if (oldValue != null && newValue == null) return;

            if (oldValue == null && newValue != null) {
                //initialize, hard coded for now, build into an admin page in future.
                if ($scope.currentPricingTable == null) {
                    if (!!newValue["REBATE_TYPE"]) newValue["REBATE_TYPE"].value = "MCP";
                    if (!!newValue[MRKT_SEG]) newValue[MRKT_SEG].value = ["All Direct Market Segments"];
                    if (!!newValue[GEO]) newValue[GEO].value = ["Worldwide"];
                    if (!!newValue["PAYOUT_BASED_ON"]) newValue["PAYOUT_BASED_ON"].value = "Consumption";
                    if (!!newValue["PROGRAM_PAYMENT"]) newValue["PROGRAM_PAYMENT"].value = "Backend";
                    if (!!newValue["PROD_INCLDS"]) newValue["PROD_INCLDS"].value = "Tray";
                    if (!!newValue["NUM_OF_TIERS"]) newValue["NUM_OF_TIERS"].value = "1";
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
                    if (!!newValue["NUM_OF_TIERS"]) newValue["NUM_OF_TIERS"].value = $scope.currentPricingTable["NUM_OF_TIERS"];
                }
            } else {
                // TODO: Hook these up to service (add service into injection and physical files)
                if (!!newValue[MRKT_SEG]) newValue[MRKT_SEG].value = MrktSegMultiSelectService.setMkrtSegMultiSelect(MRKT_SEG, (MRKT_SEG + "_MS"), newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value);
                if (!!newValue[GEO]) newValue[GEO].value = MrktSegMultiSelectService.setGeoMultiSelect(GEO, newValue[GEO].value, oldValue[GEO].value);

                //if (oldValue["ECAP_TYPE"].value != newValue["ECAP_TYPE"].value) {
                //}

                //if (oldValue["PAYOUT_BASED_ON"] != newValue["PAYOUT_BASED_ON"]) {
                //}

                //if (oldValue["MEET_COMP_PRICE_QSTN"] != newValue["MEET_COMP_PRICE_QSTN"]) {
                //}

                //if (oldValue["PROGRAM_PAYMENT"] != newValue["PROGRAM_PAYMENT"]) {
                //}
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
            $scope.setBusy("Loading...", "Loading the Deal Editor", "Info", true);
            $scope.saveEntireContractRoot($state.current.name, true, true, 'contract.manager.strategy.wip', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
        }
        $scope.gotoToPricingTable = function () {
            $scope.setBusy("Loading...", "Loading the Pricing Table Editor", "Info");
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
            if ($scope.isPtr) return;

            if (!$scope._dirty) {
                $scope.switchingTabs = true;
                $scope.gotoToPricingTable();
            } else {
                $scope.switchingTabs = true;
                $scope.$broadcast('syncDs');
                $scope.saveEntireContractBase($state.current.name, true, true, 'contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
                //$scope.setBusy("Loading...", "Loading the Deal Editor");
                //$scope.saveEntireContractRoot($state.current.name, true, true, 'contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
                //$scope.publishWipDealsBase();
                //$scope.$broadcast('syncDs');
                //$scope.saveEntireContractBase($state.current.name, false, false, 'contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
            }
        }

        $scope.validateWipDeals = function (callback) {
            $scope.saveEntireContractBase($state.current.name, true, true, null, null, null, callback);
        }

        $scope.editPricingStrategyName = function (ps) {
            $scope.openRenameTitle(ps, "Pricing Strategy");
        }

        $scope.editPricingTableName = function (pt) {
            $scope.openRenameTitle(pt, "Pricing Table");
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

                if (!$scope.validateTitles()) {
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
            $scope.goto('Manage', 'contract.summary');
        }
        $scope.goto = function (mode, state) {
            //if ($scope.flowMode === mode) return;

            $scope.flowMode = mode;
            $state.go(state, { cid: $scope.contractData.DC_ID });
        }

        $scope.downloadQuoteLetter = function (customerSid, objTypeSid, objSid) {

            //document.location.href = "/api/QuoteLetter/GetDealQuoteLetter/" + dealdId ;
            var downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + customerSid + "/" + objTypeSid + "/" + objSid;
            window.open(downloadPath, '_blank', '');
            //$scope.attachmentCount = response.data.length;
            //$scope.initComplete = true;
            //hasFiles = response.data.length > 0;
            //setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
            //},
            //,function (response){
            //    logger.error("Unable to download quote letter pdf.", response, response.statusText);
            //    //$scope.attachmentCount = -1; // Causes the 'Failed to retrieve attachments!' message to be displayed.
            //    //$scope.initComplete = true;
            //    //hasFiles = false;
            //});

            //return deferred.promise;
        }

        topbar.hide();

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
            if (data.length > 0 && ($scope.curPricingTable['OBJ_SET_TYPE_CD'] !== "KIT")) {
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
    }
})();