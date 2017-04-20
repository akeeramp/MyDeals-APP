angular
    .module('app.contract')
    .controller('ContractController', ContractController);

ContractController.$inject = ['$scope', '$state', '$filter', 'contractData', 'isNewContract', 'templateData', 'objsetService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope', 'confirmationModal', 'dataService', 'customerService', 'contractManagerConstants'];

function ContractController($scope, $state, $filter, contractData, isNewContract, templateData, objsetService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope, confirmationModal, dataService, customerService, contractManagerConstants) {
    // store template information
    //
    $scope.templates = $scope.templates || templateData.data;
    $scope.constants = contractManagerConstants;
    $scope.isContractDetailsPage = $state.current.name == $scope.constants.ContractDetails;

    // determine if the contract is existing or new... if new, look for pre-population attributes from the URL parameters
    //
    $scope.initContract = function (contractData) {
        // New contract template
        var c = util.clone($scope.templates.ObjectTemplates.CNTRCT.ALL_TYPES);

        // contract exists
        if (contractData !== null && contractData !== undefined) {
            if (contractData.data[0] !== undefined) {
                contractData.data[0]._behaviors = c._behaviors;
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

    // populate the contract data upon entry... If multiple controller instances are called, reference the initial instance
    //
    $scope.contractData = $scope.contractData || $scope.initContract(contractData);
    $scope.isNewContract = isNewContract;
    $scope.contractData.displayTitle = "";

    var updateDisplayTitle = function () {
        $scope.contractData.displayTitle = isNewContract ? $scope.contractData.TITLE :
                "#" + $scope.contractData.DC_ID + " - " + $scope.contractData.TITLE;
    }
    updateDisplayTitle();

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

        $scope.contractData.MinYear = parseInt(moment().format("YYYY")) - 5;
        $scope.contractData.MaxYear = parseInt(moment().format("YYYY")) + 10;

        // Contract custom initializations and functions
        // Dummy attribute on the UI which will hold the array of customer divisions
        $scope.contractData.CUST_ACCNT_DIV_UI = $scope.contractData["CUST_ACCNT_DIV"].split('/');
        $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
        $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = true;
        $scope.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = !$scope.isNewContract;

        // In case of existing contract back date reason and text is captured display them
        $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN !== "";
        $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN === "";
        $scope.contractData._behaviors.isRequired["BACK_DATE_RSN_TXT"] = $scope.contractData.BACK_DATE_RSN_TXT !== "";
        $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = $scope.contractData.BACK_DATE_RSN_TXT === "";

        // By default set the CUST_ACCPT to pending(99) if new contract
        $scope.contractData.CUST_ACCPT = $scope.contractData.CUST_ACCPT == "" ? 99 : $scope.contractData.CUST_ACCPT;
        $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = ($scope.contractData.CUST_ACCPT == 99);

        // Set customer acceptance rulesc
        var setCustAcceptanceRules = function (newValue) {
            $scope.contractData._behaviors.isHidden["C2A_DATA_C2A_ID"] = (newValue == 99);
            $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = (newValue != 99) && (!hasUnSavedFiles && !hasFiles);
            $scope.contractData.C2A_DATA_C2A_ID = (newValue == 99) ? "" : $scope.contractData.C2A_DATA_C2A_ID;
            $scope.contractData.IsAttachmentRequired = ($scope.contractData.C2A_DATA_C2A_ID === "") && (newValue != 99);
            $scope.contractData.AttachmentError = $scope.contractData.AttachmentError && $scope.contractData.IsAttachmentRequired;
        }

        // Contract name validation
        var isDuplicateContractTitle = function (title) {
            if (title == "") return;
            objsetService.isDuplicateContractTitle($scope.contractData.DC_ID, title).then(function (response) {
                $scope.contractData._behaviors.isError['TITLE'] = response.data;
                $scope.contractData._behaviors.validMsg['TITLE'] = "";
                if (response.data) {
                    $scope.contractData._behaviors.validMsg['TITLE'] = "This contract name already exists in another contract.";
                }
            });
        }

        $scope.updateCorpDivision = function (custId) {
            if (custId === "" || custId == null) return;
            dataService.get("/api/Customers/GetMyCustomerDivsByCustNmSid/" + custId).then(function (response) {
                // only show if more than 1 result
                // TODO: This is a temp fix API is getting the 2002 and 2003 level records, fix the API
                response.data = $filter('where')(response.data, { CUST_LVL_SID: 2003 });

                if (response.data.length <= 1) {
                    $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
                    $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = true;
                    $scope.contractData.CUST_ACCNT_DIV_UI = response.data[0].CUST_DIV_NM.toString();
                } else {
                    $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = false;
                    $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = true;
                }
                if (!!$("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect")) {
                    $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").dataSource.data(response.data);
                    $("#CUST_ACCNT_DIV_UI").data("kendoMultiSelect").value($scope.contractData.CUST_ACCNT_DIV_UI);
                }
            }, function (response) {
                logger.error("Unable to get Customer Divisions.", response, response.statusText);
            });
        }

        // Customer and Customer Div functions
        var initiateCustDivCombobox = function () {
            if ($scope.contractData.CUST_ACCNT_DIV_UI !== "") {
                $scope.updateCorpDivision($scope.contractData.CUST_MBR_SID);
            }
        }

        initiateCustDivCombobox();

        var setDefaultContractTitle = function (custDiv) {
            // if user has touched the Title do not set the title
            if ($scope.contractData.DC_ID <= 0 && custDiv !== ""
                && !$scope.contractData._behaviors.isDirty['TITLE'] && $scope.contractData.CUST_MBR_SID > 0) {
                var defaultContractName = "";
                defaultContractName = "Intel-" + custDiv + " Q" +
                    $scope.contractData.START_QTR + " " + $scope.contractData.START_YR;
                if ($scope.contractData.START_QTR != $scope.contractData.END_QTR
                    || $scope.contractData.START_YR != $scope.contractData.END_YR) {
                    defaultContractName += "- Q" + $scope.contractData.END_QTR + " " + $scope.contractData.END_YR;
                }

                $scope.contractData.TITLE = defaultContractName;
                //User has not changed the title, system doing it set dirty flag to false.
                $timeout(function () {
                    $scope.contractData._behaviors.isDirty['TITLE'] = false;
                });
            }
        }

        // Date Functions
        var validateDate = function (dateType) {
            $scope.contractData._behaviors.isError['START_DT'] =
                $scope.contractData._behaviors.isError['END_DT'] = false;
            $scope.contractData._behaviors.validMsg['START_DT'] =
                $scope.contractData._behaviors.validMsg['END_DT'] = "";

            var startDate = $scope.contractData.START_DT;
            var endDate = $scope.contractData.END_DT;

            if (dateType == 'START_DT') {
                if (moment(startDate).isAfter(endDate) || moment(startDate).year() < $scope.contractData.MinYear) {
                    $scope.contractData._behaviors.isError['START_DT'] = true;
                    $scope.contractData._behaviors.validMsg['START_DT'] = moment(startDate).year() < $scope.contractData.MinYear ?
                        "Start date cannot be less than year " + $scope.contractData.MinYear : "Start date cannot be greater than End Date";
                }
            } else {
                if (moment(endDate).isBefore(startDate) || moment(endDate).year() > $scope.contractData.MaxYear) {
                    $scope.contractData._behaviors.isError['END_DT'] = true;
                    $scope.contractData._behaviors.validMsg['END_DT'] = moment(endDate).year() > $scope.contractData.MaxYear ?
                        "End date cannot be greater than year " + $scope.contractData.MaxYear : "End date cannot be less than Start Date";
                }
            }
        }

        // Update start date and end date based on the quarter selection
        var updateDateByQuarter = function (qtrType, qtrValue, yearValue) {
            var customerMemberSid = $scope.contractData.CUST_MBR_SID == "" ? null : $scope.contractData.CUST_MBR_SID;
            var quarterDetails = customerService.getCustomerCalendar(customerMemberSid, null, qtrValue, yearValue)
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
                }, function (response) {
                    errInGettingDates(response);
                });
        }

        var resetQtrYrDirty = function () {
            // When loading quarter and year from date user never makes changes to Quarter and Year we just load them
            $scope.contractData._behaviors.isDirty['START_QTR'] = $scope.contractData._behaviors.isDirty['START_YR'] = false;
            $scope.contractData._behaviors.isDirty['END_QTR'] = $scope.contractData._behaviors.isDirty['END_YR'] = false;
        }

        var updateQuarterByDates = function (dateType, value) {
            var customerMemberSid = $scope.contractData.CUST_MBR_SID == "" ? null : $scope.contractData.CUST_MBR_SID;
            var quarterDetails = customerService.getCustomerCalendar(customerMemberSid, value, null, null).then(function (response) {
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
                }, 500);
            }, function (response) {
                errInGettingDates(response);
            });
        }

        var getCurrentQuarterDetails = function () {
            var customerMemberSid = $scope.contractData.CUST_MBR_SID == "" ? null : $scope.contractData.CUST_MBR_SID;
            var quarterDetails = customerService.getCustomerCalendar(customerMemberSid, new Date, null, null)
                .then(function (response) {
                    $scope.contractData.START_QTR = $scope.contractData.END_QTR = response.data.QTR_NBR;
                    $scope.contractData.START_YR = $scope.contractData.END_YR = response.data.YR_NBR;

                    $scope.contractData._behaviors.isError['START_DT'] =
                                    $scope.contractData._behaviors.isError['END_DT'] = false;
                    $scope.contractData._behaviors.validMsg['START_DT'] =
                        $scope.contractData._behaviors.validMsg['END_DT'] = "";

                    // By default we dont want a contract to be backdated
                    $scope.contractData.START_DT = moment(response.data.QTR_STRT).isBefore(today) ?
                        today : moment(response.data.QTR_STRT).format('l');

                    $scope.contractData.END_DT = moment(response.data.QTR_END).format('l');
                    $timeout(function () {
                        resetQtrYrDirty();
                    }, 500);

                    // Unwatch all the dates, quarter and year, else they will go crazy
                    unWatchStartQuarter = unWatchEndQuarter = unWatchStartDate = unWatchEndDate = true;

                    $timeout(function () {
                        unWatchStartQuarter = unWatchEndQuarter = unWatchStartDate = unWatchEndDate = false;
                    }, 500);
                }, function (response) {
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
                    }, 100);
                }, function () {
                    $timeout(function () {
                        // If the old value is also past date its infinite confirmation loop, hence add todays date on cancellation
                        $scope.contractData.START_DT = (moment(oldDate).isBefore(today)) ? today : oldDate;
                    }, 100);
                });
            } else {
                $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
                $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
                $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = true;
                $scope.contractData.BACK_DATE_RSN = "";
            }
        }

        if ($scope.contractData.DC_ID <= 0) {
            getCurrentQuarterDetails();
        } else {
            updateQuarterByDates('START_DT', $scope.contractData.START_DT);
            updateQuarterByDates('END_DT', $scope.contractData.END_DT);
        }

        $timeout(function () {
            !$scope.isNewContract ? $scope.status = { 'isOpen': true } :
                setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
        }, 300);
    }

    // File save methods and variable
    var hasUnSavedFiles = false;
    var hasFiles = false;

    $scope.fileUploadOptions = { saveUrl: '/FileUpload/save', autoUpload: false };

    $scope.filePostAddParams = function (e) {
        e.data = {
            custMbrSid: $scope.contractData.CUST_MBR_SID,
            objSid: $scope.contractData.DC_ID, // Contract
            objTypeSid: 1
        }
    };

    $scope.onFileSelect = function (e) {
        // Hide default kendo upload and clear buttons as contract is not generated at this point. Upload files after contract id is generated.
        // TODO: Do we want to show them in edit scenario ?
        $timeout(function () {
            $(".k-clear-selected").hide();
            $(".k-upload-selected").hide();
        });

        $scope.contractData._behaviors.isRequired["C2A_DATA_C2A_ID"] = $scope.contractData._behaviors.isError["C2A_DATA_C2A_ID"] = false;
        $scope.contractData._behaviors.validMsg["C2A_DATA_C2A_ID"] = "";
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

    $scope.onComplete = function () {
        logger.success("Contract attachments uploaded", null, "Upload successful");
        $timeout(function () {
            $scope._dirty = false; // don't want to kick of listeners
            $state.go('contract.manager', {
                cid: $scope.contractData.DC_ID
            });
        });
    }

    $scope.onError = function () {
        logger.error("Files Upload failed, Please try again.");
    }

    $scope.uploadFile = function (e) {
        $(".k-upload-selected").click();
    }

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                if (!$scope.isNewContract) {
                    logger.info("Loading contract attachments...");
                    // TODO: Read only when hasFiles is true
                    dataService.get("/api/Files/GetFileAttachments/" + $scope.contractData.CUST_MBR_SID + "/" + 1 + "/" + $scope.contractData.DC_ID + "/CNTRCT")
                        .then(function (response) {
                            e.success(response.data);
                            hasFiles = response.data.length > 0;
                            setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
                        }, function (response) {
                            logger.error("Unable to get file attachments.", response, response.statusText);
                        });
                }
            },
            destroy: function (e) {
                kendo.confirm("Are you sure you want to delete this attachment?").then(function () {
                    logger.info("Method Not Implemented");
                    hasFiles = $('#fileAttachmentGrid').data("kendoGrid")._data.length > 0;
                    setCustAcceptanceRules($scope.contractData.CUST_ACCPT);
                }, function () {
                    // If grid is hidden on DOM load, scope doesn't contain the grid name($scope.fileAttachmentGrid is undefined), hack use jQuery
                    $('#fileAttachmentGrid').data("kendoGrid").cancelChanges();
                });
            },
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

    $scope.fileAttachmentGridOptions = {
        dataSource: dataSource,
        filterable: false,
        sortable: true,
        selectable: true,
        resizable: true,
        columnMenu: false,
        editable: { mode: "inline", confirmation: false },
        columns: [
        { field: "ATTCH_SID", title: "ID", hidden: true },
        //IE doesn't support download tag on anchor, added target='_blank' as a work around
        { field: "FILE_NM", title: "File Name", template: "<a download target='_blank' href='/api/Files/OpenFileAttachment/#: FILE_DATA_SID #/'>#: FILE_NM #</a>" },
        { field: "CHG_EMP_WWID", title: "Added By", width: "25%" },
        { field: "CHG_DTM", title: "Date Added", width: "25%", type: "date", template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy') #" }]
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
        // if Pricing Strategy or Pricing Table was being edited, save it
        //debugger;

        var saveStates = ["contract.manager.strategy", "contract.manager.strategy.wip", "contract.details"];
        if ((saveStates.indexOf(fromState.name) >= 0) && $scope._dirty) {
            // stop the state change... need to save
            event.preventDefault();

            // async save data
            $scope.saveEntireContractBase(fromState.name, toState, toParams);
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
    $scope.$watch('contractData',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue["CUST_MBR_SID"] != newValue["CUST_MBR_SID"]) {
                $scope.contractData.CUST_ACCNT_DIV_UI = "";
                $scope.updateCorpDivision(newValue["CUST_MBR_SID"]);
                getCurrentQuarterDetails();
            }

            if (oldValue["CUST_ACCNT_DIV_UI"].toString() !== newValue["CUST_ACCNT_DIV_UI"].toString()) {
                setDefaultContractTitle(newValue["CUST_ACCNT_DIV_UI"]);
                $timeout(function () {
                    $scope.contractData.CUST_ACCNT_DIV = newValue["CUST_ACCNT_DIV_UI"].toString().replace(/,/g, '/')
                }, 1)
            }

            if (oldValue["START_QTR"] !== newValue["START_QTR"]
                || oldValue["START_YR"] !== newValue["START_YR"]) {
                if (!unWatchStartQuarter) {
                    if (delayStartFunction) $timeout.cancel(delayStartFunction);
                    delayStartFunction = $timeout(function () {
                        updateDateByQuarter('START_DATE', newValue["START_QTR"], newValue["START_YR"]);
                        setDefaultContractTitle($scope.contractData.CUST_ACCNT_DIV_UI);
                    }, 500);
                }
                unWatchStartQuarter = false;
            }

            if (oldValue["END_QTR"] !== newValue["END_QTR"]
                            || oldValue["END_YR"] !== newValue["END_YR"]) {
                if (!unWatchEndQuarter) {
                    if (delayEndDateFunction) $timeout.cancel(delayEndDateFunction);
                    delayEndDateFunction = $timeout(function () {
                        updateDateByQuarter('END_DATE', newValue["END_QTR"], newValue["END_YR"]);
                        setDefaultContractTitle($scope.contractData.CUST_ACCNT_DIV_UI);
                    }, 500);
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

            if (oldValue["BACK_DATE_RSN"] !== newValue["BACK_DATE_RSN"]) {
                // other(106) reason selected
                $scope.contractData._behaviors.isRequired["BACK_DATE_RSN_TXT"] = (newValue["BACK_DATE_RSN"] == 106);
                $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = (newValue["BACK_DATE_RSN"] != 106);
                if (newValue["BACK_DATE_RSN"] != 106) $scope.contractData.BACK_DATE_RSN_TXT = "";
            }

            if (oldValue["CUST_ACCPT"] !== newValue["CUST_ACCPT"]) {
                setCustAcceptanceRules(newValue["CUST_ACCPT"]);
            }

            if (oldValue["C2A_DATA_C2A_ID"] !== newValue["C2A_DATA_C2A_ID"]) {
                $scope.contractData.IsAttachmentRequired = (newValue["C2A_DATA_C2A_ID"] === "" && $scope.contractData.CUST_ACCPT != 99);
                $scope.contractData.AttachmentError = ($scope.contractData.CUST_ACCPT != 99) && $scope.contractData.IsAttachmentRequired && (!hasUnSavedFiles && !hasFiles);
            }

            el._dirty = true;
            el._dirtyContractOnly = true;
        }, true);

    // **** LEFT NAVIGATION Methods ****
    //
    $scope.isLnavHidden = !$scope.isExistingContract();
    $scope.toggleLnav = function () {
        $scope.isLnavHidden = !$scope.isLnavHidden;
        $(window).trigger('resize');
        $scope.resizeEvent();
    }
    $scope.resizeEvent = function () {
        $timeout(function () {
            var evt = $window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 200);
            window.dispatchEvent(evt);
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

    // **** MINI NAV ICON Methods ****ex
    //
    $scope.isSearchHidden = true;
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
        $scope.curPricingStrategy = ps;
    }
    $scope.hideAddPricingTable = function () {
        $scope.isAddPricingTableHidden = true;
        $scope.isAddStrategyHidden = true;
        $scope.isAddStrategyBtnHidden = false;
        $scope.isSearchHidden = true;
        $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.CAP_BAND);
        $scope.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type
        $scope.clearPtTemplateIcons();
        $scope.curPricingStrategy = {}; //clears curPricingStrategy
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

    // **** PRICING TABLE Methods ****
    //
    $scope.addCustomToTemplates = function () {
        angular.forEach($scope.templates.ModelTemplates.PRC_TBL, function (value, key) {
            value._custom = {
                "ltr": value.name[0],
                "_active": false
            };
        });
    }
    $scope.clearPtTemplateIcons = function () {
        angular.forEach($scope.templates.ModelTemplates.PRC_TBL, function (value, key) {
            value._custom._active = false;
        });
    }
    $scope.selectPtTemplateIcon = function (ptTmplt) {
        $scope.clearPtTemplateIcons();
        ptTmplt._custom._active = true;
        $scope.newPricingTable["OBJ_SET_TYPE_CD"] = ptTmplt.name;
        $scope.newPricingTable["_extraAtrbs"] = ptTmplt.extraAtrbs;
        $scope.newPricingTable["_defaultAtrbs"] = ptTmplt.defaultAtrbs;

        // Maybe don't do this...
        //if (util.isEmpty(ptTmplt.extraAtrbs)) {
        //    $scope.customAddPtValidate();
        //}
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
        if ($scope.curPricingTableId > 0 && $scope.curPricingTable !== null && $scope.curPricingTable.DC_PARENT_ID === id) {
            $scope.curPricingTable = {
            };
            $scope.curPricingTableId = 0;
        }
    }

    // **** DELETE Methods ****
    //
    $scope.deletePricingStrategy = function (ps) {
        kendo.confirm("Are you sure that you want to delete this pricing strategy?").then(function () {
            $scope.$apply(function () {
                topbar.show();

                // Remove from DB first... then remove from screen
                objsetService.deletePricingStrategy($scope.getCustId(), ps).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            logger.warning("Unable to Deleted the Pricing Strategy", ps, "Delete Failed");
                            return;
                        }

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingStrategyIf(ps.DC_ID);
                        $scope.unmarkCurPricingTableIf(ps.DC_ID);

                        // delete item
                        $scope.contractData.PRC_ST.splice($scope.contractData.PRC_ST.indexOf(ps), 1);

                        logger.success("Deleted the Pricing Strategy", ps, "Delete Sucessful");
                        topbar.hide();
                    },
                    function (result) {
                        logger.error("Could not delete the Pricing Strategy.", result, result.statusText);
                        topbar.hide();
                    }
                    );
            });
        });
    }
    $scope.deletePricingTable = function (ps, pt) {
        kendo.confirm("Are you sure that you want to delete this pricing table?").then(function () {
            $scope.$apply(function () {
                topbar.show();

                // Remove from DB first... then remove from screen
                objsetService.deletePricingTable($scope.getCustId(), pt).then(
                    function (data) {
                        if (data.data.MsgType !== 1) {
                            logger.warning("Unable to Deleted the Pricing Table", pt, "Delete Failed");
                            return;
                        }

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingTableIf(ps.DC_ID);

                        // delete item
                        ps.PRC_TBL.splice(ps.PRC_TBL.indexOf(pt), 1);

                        logger.success("Deleted the Pricing Table", pt, "Save Sucessful");
                        topbar.hide();
                    },
                    function (response) {
                        logger.error("Could not delete the Pricing Table.", response, response.statusText);
                        topbar.hide();
                    }
            );
            });
        });
    }

    // **** SAVE CONTRACT Methods ****
    //
    $scope.saveEntireContractBase = function (stateName, toState, toParams) {
        // async save data
        topbar.show();

        var source = "";
        if (stateName === "contract.manager.strategy") source = "PRC_TBL";
        if (stateName === "contract.manager.strategy.wip") source = "WIP_DEAL";

        // sync all detail data sources into main grid datasource for a single save
        if ($scope.spreadDs !== undefined) $scope.spreadDs.sync();
        if ($scope.gridDs !== undefined) $scope.gridDs.sync();

        var sData = $scope.spreadDs === undefined ? undefined : $scope.pricingTableData.PRC_TBL_ROW;
        var gData = $scope.gridDs === undefined ? undefined : $scope.gridDs.data(); // TODO after multi dim... need to see if we can read the variable instead of the source

        //debugger;

        var contractData = $scope._dirtyContractOnly ? [$scope.contractData] : [];
        var curPricingTableData = $scope.curPricingTable.DC_ID === undefined ? [] : [$scope.curPricingTable];

        // Pricing Table Row
        if (curPricingTableData.length > 0 && sData != undefined) {
            // Only save if a product has been filled out
            sData = sData.filter(function (obj) {
                return obj.PTR_USER_PRD !== undefined && obj.PTR_USER_PRD !== null && obj.PTR_USER_PRD !== "";
            });

            for (var s = 0; s < sData.length; s++) {
                if (sData[s].DC_ID === null) sData[s].DC_ID = $scope.uid--;
                sData[s].DC_PARENT_ID = curPricingTableData[0].DC_ID;
                sData[s].dc_type = "PRC_TBL_ROW";
                sData[s].dc_parent_type = curPricingTableData[0].dc_type;
                sData[s].OBJ_SET_TYPE_CD = curPricingTableData[0].OBJ_SET_TYPE_CD;
            }
        }

        // Wip Deal
        if (gData !== undefined && gData !== null) {
            for (var i = 0; i < gData.length; i++) {
                // TODO... this should probably mimic Pticing Table Rows
                if (gData[i].DC_ID === null) gData[i].DC_ID = $scope.uid--;
                if ($scope.gridDetailsDs[gData[i].DC_ID] !== undefined) {
                    gData[i]._MultiDim = $scope.gridDetailsDs[gData[i].DC_ID].data();
                }
            }
        }

        // Contract is Contract + Pricing Strategies + Pricing Tables in heierarchial format
        // sData is the raw spreadsheet data
        // gData is the raw grid data

        var modCt = [];
        var modPs = [];

        for (var c = 0; c < contractData.length; c++) {
            var mCt = {
            };
            Object.keys(contractData[c]).forEach(function (key, index) {
                if (key[0] !== '_' && key !== "Customer" && key !== "PRC_ST") mCt[key] = this[key];
            }, contractData[c]);
            modCt.push(mCt);

            if (contractData[c]["PRC_ST"] === undefined) contractData[c]["PRC_ST"] = [];
            var item = contractData[c]["PRC_ST"];
            for (var p = 0; p < item.length; p++) {
                var mPs = {
                };
                Object.keys(item[p]).forEach(function (key, index) {
                    if (key[0] !== '_' && key !== "PRC_TBL") mPs[key] = this[key];
                }, item[p]);
                modPs.push(mPs);
            }
        }

        var data = {
            "Contract": modCt,
            "PricingStrategy": modPs,
            "PricingTable": curPricingTableData,
            "PricingTableRow": sData === undefined ? [] : sData,
            "WipDeals": gData === undefined ? [] : gData,
            "EventSource": source
        }

        objsetService.updateContractAndCurPricingTable($scope.getCustId(), data).then(
            function (results) {
                if (!!results.data.PRC_TBL_ROW) {
                    $scope.updateResults(results.data.PRC_TBL_ROW, $scope.pricingTableData.PRC_TBL_ROW, $scope.spreadDs);
                    $scope.spreadDs.read();
                }
                if (!!results.data.WIP_DEAL) {
                    $scope.updateResults(results.data.WIP_DEAL, $scope.pricingTableData.WIP_DEAL, $scope.gridDs);
                    $scope.gridDs.read();
                }

                //debugger;
                // need to check for messages / Actions / ext...
                //        var gData = $scope.gridDs === undefined ? undefined : $scope.gridDs.data(); // TODO after multi dim... need to see if we can read the variable instead of the source
                //if ($scope.gridDs !== undefined) $scope.gridDs.sync();

                $scope.resetDirty();
                logger.success("Saved the contract", $scope.contractData, "Save Sucessful");
                topbar.hide();

                var reloadState = toState.name == $scope.constants.ContractDetails;
                if (toState !== undefined) $state.go(toState.name, toParams, { reload: reloadState });
            },
            function (response) {
                logger.error("Could not save the contract.", response, response.statusText);
                topbar.hide();
            }
        );
    }

    $scope.updateResults = function (data, source) {
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
                            if (data[i]["DC_ID"] === source[p]["DC_ID"]) $scope.mapProperty(source[p], data[i]);
                        }
                    } else {
                        if (data[i]["DC_ID"] === source["DC_ID"]) $scope.mapProperty(source, data[i]);
                    }
                }
            }
        }
    }
    $scope.mapProperty = function (src, data) {
        if (src["DC_ID"] === data["DC_ID"]) {
            var arItems = data;
            for (var key in arItems) {
                if (arItems.hasOwnProperty(key) && key[0] !== '_' && data[key] !== undefined)
                    src[key] = data[key];
            }
        }
    }
    $scope.mapActionIdChange = function (src, action) {
        if (src["DC_ID"] === action["DcID"])
            src["DC_ID"] = action["AltID"];
    }

    $scope.saveEntireContract = function () {
        if (!$scope._dirty) return;
        $scope.saveEntireContractBase($state.current.name);
    }
    $scope.getCustId = function () {
        return $scope.contractData['CUST_MBR_SID'];
    }

    $scope.checkForMessages = function (collection, key, data) {
        var isValid = true;
        if (data.data[key] !== undefined) {
            for (var i = 0; i < data.data[key].length; i++) {
                if (data.data[key][i].DC_ID !== undefined && data.data[key][i].DC_ID === collection.DC_ID && data.data[key][i].warningMessages.length > 0) {
                    angular.forEach(data.data[key][i]._behaviors.ValidMsg,
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

    $scope.saveContract = function () {
        topbar.show();

        // Contract Data
        var ct = $scope.contractData;

        // check for NEW contract
        if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

        // Add to DB first... then add to screen
        objsetService.createContract($scope.getCustId(), ct).then(
            function (data) {
                $scope.updateResults(data.data.CNTRCT, ct);

                //Check for errors
                if (!$scope.checkForMessages(ct, "CNTRCT", data)) {
                    logger.error("Could not create the contract.", data, "Save unsuccessful");
                    topbar.hide();
                    return;
                };

                logger.success("Saved the contract", ct, "Save Sucessful");
                topbar.hide();

                if (hasUnSavedFiles) {
                    $scope.uploadFile();
                } else {
                    $timeout(function () {
                        $scope._dirty = false; // don't want to kick of listeners
                        $state.go('contract.manager', {
                            cid: $scope.contractData.DC_ID
                        }, { reload: true });
                    });
                }
            },
            function (result) {
                logger.error("Could not create the contract.", result, result.statusText);
                topbar.hide();
            }
        );
    }
    $scope.isValid = true;
    $scope.customContractValidate = function () {
        $scope.isValid = true;
        var ct = $scope.contractData;

        // If user has clicked on save, that means he has accepted the default contract name set, make it dirty to avoid any changes to dates making a change to contract name.
        $scope.contractData._behaviors.isDirty['TITLE'] = true;

        // Clear all values
        angular.forEach($scope.contractData,
            function (value, key) {
                // Do not clear the custom validations user has to correct them e.g contract name duplicate
                if (ct._behaviors.validMsg[key] === "" || ct._behaviors.validMsg[key] === "* field is required"
                    || ct._behaviors.validMsg[key] === undefined) {
                    ct._behaviors.validMsg[key] = "";
                    ct._behaviors.isError[key] = false;
                    if (ct[key] === null) ct[key] = "";// Special handling for CUST_MBR_SID only field where user can make it null by clearing combobox
                }
            });

        // Check required
        angular.forEach($scope.contractData,
            function (value, key) {
                if (key[0] !== '_' && value !== undefined && value !== null && !Array.isArray(value) &&
                    typeof (value) !== "object" && (typeof (value) === "string" && value.trim() === "") && ct._behaviors.isRequired[key] === true && ct._behaviors.validMsg[key] === "") {
                    ct._behaviors.validMsg[key] = "* field is required";
                    ct._behaviors.isError[key] = true;
                    $scope.isValid = false;
                }
                if (ct._behaviors.validMsg[key] !== "") {
                    $scope.isValid = false;
                }
            });

        $scope.contractData._behaviors.isError["CUST_ACCNT_DIV_UI"] = $scope.contractData._behaviors.isError["CUST_ACCNT_DIV"];
        $scope.contractData._behaviors.validMsg["CUST_ACCNT_DIV_UI"] = $scope.contractData._behaviors.validMsg["CUST_ACCNT_DIV"];

        if ($scope.contractData.IsAttachmentRequired && (!hasFiles && !hasUnSavedFiles)) {
            $scope.contractData.AttachmentError = true;
            $scope.isValid = false;
        }

        if ($scope.isValid) {
            $scope.saveContract();
        } else {
            $timeout(function () {
                if (!!$("input.isError")[0]) $("input.isError")[0].focus();
            }, 300);
        }
    }

    // **** NEW PRICING STRATEGY Methods ****
    //
    //debugger;
    $scope.newStrategy = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
    $scope.addPricingStrategy = function () {
        topbar.show();
        var ct = $scope.contractData;

        // Clone base model and populate changesmod
        var ps = util.clone($scope.templates.ObjectTemplates.PRC_ST.ALL_TYPES);
        ps.DC_ID = $scope.uid--;
        ps.DC_PARENT_ID = ct.DC_ID;
        ps.PRC_TBL = [];
        ps.TITLE = $scope.newStrategy.TITLE;
        //debugger;

        // Add to DB first... then add to screen
        objsetService.createPricingStrategy($scope.getCustId(), ps).then(
            function (data) {
                $scope.updateResults(data.data.PRC_ST, ps);

                if ($scope.contractData.PRC_ST === undefined) $scope.contractData.PRC_ST = [];
                $scope.contractData.PRC_ST.push(ps);
                $scope.showAddPricingTable(ps);
                logger.success("Added Pricing Strategy", ps, "Save Sucessful");
                topbar.hide();
                $scope.newStrategy.TITLE = "";
            },
            function (result) {
                logger.error("Could not create the pricing strategy.", response, response.statusText);
                topbar.hide();
            }
        );
    }
    $scope.customAddPsValidate = function () {
        var isValid = true;

        // Clear all values
        angular.forEach($scope.newStrategy,
            function (value, key) {
                $scope.newStrategy._behaviors.validMsg[key] = "";
                $scope.newStrategy._behaviors.isError[key] = false;
            });

        // Check required
        angular.forEach($scope.newStrategy,
            function (value, key) {
                if (key[0] !== '_' && !Array.isArray(value) && (!isNaN(value) || value === undefined || value === null || value.trim() === "") && $scope.newStrategy._behaviors.isRequired[key] === true) {
                    $scope.newStrategy._behaviors.validMsg[key] = "* field is required";
                    $scope.newStrategy._behaviors.isError[key] = true;
                    isValid = false;
                }
            });

        // Check unique name
        angular.forEach($scope.newStrategy,
                    function (value, key) {
                        if (key === "TITLE") {
                            if ($scope.contractData.PRC_ST === undefined) $scope.contractData.PRC_ST = [];
                            for (var i = 0; i < $scope.contractData.PRC_ST.length; i++) {
                                if (value.toLowerCase() == $scope.contractData.PRC_ST[i].TITLE.toLowerCase()) {
                                    $scope.newStrategy._behaviors.validMsg[key] = "* must have unique name within contract";
                                    $scope.newStrategy._behaviors.isError[key] = true;
                                    isValid = false;
                                    break;
                                }
                            }
                        }
                    });

        if (isValid) {
            $scope.addPricingStrategy();
        }
    }

    // **** NEW PRICING TABLE Methods ****
    //
    $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.CAP_BAND);
    $scope.newPricingTable.OBJ_SET_TYPE_CD = ""; //reset new PT deal type so it does not inherit from clone
    $scope.addPricingTable = function () {
        topbar.show();

        // Clone base model and populate changes
        //debugger;
        var pt = util.clone($scope.templates.ObjectTemplates.PRC_TBL[$scope.newPricingTable.OBJ_SET_TYPE_CD]);
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
            if ($scope.newPricingTable._defaultAtrbs.hasOwnProperty(atrb) && pt.hasOwnProperty(atrb)) {  //note: if in future we give these two objects overlapping properties, then we may get unwanted overwriting here.
                if (Array.isArray($scope.newPricingTable._defaultAtrbs[atrb].value)) {
                    //Array, Middle Tier expects a comma separated string
                    pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value.join();
                } else {
                    //String
                    pt[atrb] = $scope.newPricingTable._defaultAtrbs[atrb].value;
                }
            }
        }

        //debugger;
        // Add to DB first... then add to screen
        objsetService.createPricingTable($scope.getCustId(), pt).then(
            function (data) {
                $scope.updateResults(data.data.PRC_TBL, pt);

                if ($scope.curPricingStrategy.PRC_TBL === undefined) $scope.curPricingStrategy.PRC_TBL = [];
                $scope.curPricingStrategy.PRC_TBL.push(pt);
                $scope.hideAddPricingTable();

                $scope.curPricingTable = pt;
                $scope.curPricingTableId = pt.DC_ID;

                logger.success("Added Pricing Table", pt, "Save Sucessful");
                topbar.hide();

                // load the screen
                $state.go('contract.manager.strategy', {
                    cid: $scope.contractData.DC_ID, sid: pt.DC_PARENT_ID, pid: pt.DC_ID
                }, { reload: true });
            },
            function (response) {
                logger.error("Could not create the pricing table.", response, response.statusText);
                topbar.hide();
            }
    );
    }
    $scope.customAddPtValidate = function () {
        var isValid = true;

        // Clear all values
        angular.forEach($scope.newPricingTable,
            function (value, key) {
                $scope.newPricingTable._behaviors.validMsg[key] = "";
                $scope.newPricingTable._behaviors.isError[key] = false;
            });

        // Check required
        angular.forEach($scope.newPricingTable,
            function (value, key) {
                if (key[0] !== '_' && !Array.isArray(value) && (!isNaN(value) || value === undefined || value === null || value.trim() === "") && $scope.newPricingTable._behaviors.isRequired[key] === true) {
                    $scope.newPricingTable._behaviors.validMsg[key] = "* field is required";
                    $scope.newPricingTable._behaviors.isError[key] = true;
                    isValid = false;
                }
            });

        // Check unique name within ps
        angular.forEach($scope.newPricingTable,
                    function (value, key) {
                        if (key === "TITLE") {
                            if ($scope.curPricingStrategy.PRC_TBL === undefined) $scope.curPricingStrategy.PRC_TBL = [];
                            for (var i = 0; i < $scope.curPricingStrategy.PRC_TBL.length; i++) {
                                if (value.toLowerCase() == $scope.curPricingStrategy.PRC_TBL[i].TITLE.toLowerCase()) {
                                    $scope.newPricingTable._behaviors.validMsg[key] = "* must have unique name within strategy";
                                    $scope.newPricingTable._behaviors.isError[key] = true;
                                    isValid = false;
                                    break;
                                }
                            }
                        }
                    });

        // Check Extra atribs
        angular.forEach($scope.newPricingTable["_extraAtrbs"],
        function (value, key) {
            if (value.isRequired === true && (value.value === undefined || value.value === "")) {
                value.validMsg = "* field is required";
                value.isError = true;
                isValid = false;
            } else {
                value.isError = false;
            }
        });

        // Check if selected deal type
        angular.forEach($scope.newPricingTable,
            function (value, key) {
                if (key === "OBJ_SET_TYPE_CD") {
                    if ($scope.newPricingTable.OBJ_SET_TYPE_CD == "") {
                        $scope.newPricingTable._behaviors.validMsg[key] = "* please select a deal type";
                        $scope.newPricingTable._behaviors.isError[key] = true;
                        isValid = false;
                    }
                }
            });

        if (isValid) {
            $scope.addPricingTable();
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

    $scope.nonCorpMrktSegments = [];
    dataService.get("/api/Dropdown/GetDropdowns/MRKT_SEG_NON_CORP").then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.nonCorpMrktSegments.push(response.data[i].DROP_DOWN);
            }
        },
        function (response) {
            logger.error("Unable to get Non Corp Market Segments.", response, response.statusText);
        }
    );

    $scope.subMrktSegments = [];
    dataService.get("/api/Dropdown/GetDropdowns/MRKT_SUB_SEGMENT").then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                $scope.subMrktSegments.push(response.data[i].DROP_DOWN);
            }
        },
        function (response) {
            logger.error("Unable to get Market Sub Segments.", response, response.statusText);
        }
    );

    //toggles all given tree view nodes to the "checked" boolean state
    function setAllNodes(nodes, checked) {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].set("checked", checked);

            if (nodes[i].hasChildren) {
                setAllNodes(nodes[i].children.view(), checked);
            }
        }
    }

    //returns subset of 'base' nodes that are non corp market segments
    function getNonCorpNodes(treeView) {
        var base = treeView.dataSource.view();
        var ret = [];
        for (var i = 0; i < base.length; i++) {
            if ($scope.nonCorpMrktSegments.indexOf(base[i].DROP_DOWN) > -1)
                ret.push(base[i])
        }
        return ret;
    }

    //given boolean emb, either returns all tree nodes that ARE embedded sub segments or all tree nodes that ARE NOT embedded sub segments
    function getEmbeddedNodes(treeNodes, emb) {
        var ret = [];
        if (emb) {
            //return all embedded market sub segments
            for (var i = 0; i < treeNodes.length; i++) {
                if ($scope.subMrktSegments.indexOf(treeNodes[i].DROP_DOWN) > -1) {
                    ret.push(treeNodes[i])
                }
                if (treeNodes[i].hasChildren) {
                    ret = ret.concat(getEmbeddedNodes(treeNodes[i].children.view(), emb));
                }
            }
        } else {
            //return all tree nodes that are NOT embedded market sub segments
            //Note: had to hardcode Embedded to be excluded from the result set, unchecking embedded will also uncheck all its children.  Remove that extra condition if we prevent checking of parent nodes.
            for (var i = 0; i < treeNodes.length; i++) {
                if (!($scope.subMrktSegments.indexOf(treeNodes[i].DROP_DOWN) > -1) && treeNodes[i].DROP_DOWN != "Embedded") {
                    ret.push(treeNodes[i]);
                }
                //TODO: need to also add recursive call line here if there will ever be other sub-trees other than "Embedded"
            }
        }
        return ret;
    }

    //output a.concat(b) with duplicates stripped out, i.e. if a contains "C" and b contains "C", only one occurance of "C" will be in final return
    function arrayMergeUnique(a, b) {
        for (var i = 0; i < b.length; i++) {
            if (a.indexOf(b[i]) < 0) {
                a.push(b[i]);
            }
        }
        return a;
    }

    //returns a bool indicating whether a member of $scope.nonCorpMrktSegments has been removed (i.e. present in oldVal, not present in newVal)
    function removedNonCorpMemberNode(newVal, oldVal) {
        for (var i = 0; i < $scope.nonCorpMrktSegments.length; i++) {
            if (newVal.indexOf($scope.nonCorpMrktSegments[i]) < 0 && oldVal.indexOf($scope.nonCorpMrktSegments[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    function checkedEmbeddedSubSegment(newVal, oldVal, checkBool) {
        if (checkBool) {
            //check if user checked a node that is an embedded sub segment
            for (var i = 0; i < $scope.subMrktSegments.length; i++) {
                if (newVal.indexOf($scope.subMrktSegments[i]) > -1 && oldVal.indexOf($scope.subMrktSegments[i]) < 0) {
                    return true;
                }
            }
            return false;
        } else {
            //check if user checked a node that is not an embedded sub segment
            for (var i = 0; i < newVal.length; i++) {
                if (oldVal.indexOf(newVal[i]) < 0 && !($scope.subMrktSegments.indexOf(newVal[i]) > -1)) {
                    return true;
                }
            }
            return false;
        }
    }

    //setting a few constants for the strings that occur a lot
    var GEO = "GEO_COMBINED";
    var MRKT_SEG = "MRKT_SEG"

    //these strings will need to be updated if they ever change it in the db or admin screen... TODO: tap into default values bool in basic dropdowns table once those db changes are made
    var WW = "Worldwide";
    var ALL = "All";
    var NONCORP = "NON Corp"

    var uncheckAllNC = true;

    //watch for user changing global auto-fill default values
    $scope.$watch('newPricingTable._defaultAtrbs',
        function (newValue, oldValue, el) {

            if (oldValue === newValue) return;

            if (oldValue != null && newValue == null) return;

            if (oldValue == null && newValue != null) {
                //initialize, hard coded for now, build into an admin page in future.
                newValue["ECAP_TYPE"].value = "MCP";
                newValue[MRKT_SEG].value = [ALL];
                newValue[GEO].value = [WW];
                newValue["PAYOUT_BASED_ON"].value = "Billings"; //TODO: typo- need to correct to "Billing" in db
                newValue["MEET_COMP_PRICE_QSTN"].value = "Price";
                newValue["PROGRAM_PAYMENT"].value = "Backend";

            } else {

                //if (oldValue["ECAP_TYPE"].value != newValue["ECAP_TYPE"].value) {
                //}

                if (oldValue[MRKT_SEG].value.toString() != newValue[MRKT_SEG].value.toString()) {

                    var treeView = $("#" + MRKT_SEG).data("kendoTreeView");
                    var multiSelect = $("#" + MRKT_SEG + "_MS").data("kendoMultiSelect");

                    if (treeView != null) {

                        if (newValue[MRKT_SEG].value.length > 0) {
                            //Logic for "ALL"
                            if (newValue[MRKT_SEG].value.indexOf(ALL) > -1 && !(oldValue[MRKT_SEG].value.indexOf(ALL) > -1)) {
                                //if user has another mrkt seg selected and then selects ALL, need to deselect all other MRKT SEGs
                                newValue[MRKT_SEG].value = [ALL];
                                multiSelect.value([ALL]);
                                setAllNodes(treeView.dataSource.view(), false);
                                treeView.dataItem(treeView.findByText(ALL)).set("checked", true);
                            } else if (oldValue[MRKT_SEG].value.length == 1 && oldValue[MRKT_SEG].value[0] == ALL && newValue[MRKT_SEG].value.indexOf(ALL) > -1) {
                                //if user had ALL selected and selects another MRKT SEG, need to deselect ALL
                                newValue[MRKT_SEG].value.splice(newValue[MRKT_SEG].value.indexOf(ALL), 1);
                                multiSelect.value(newValue[MRKT_SEG].value);
                                treeView.dataItem(treeView.findByText(ALL)).set("checked", false);
                            }

                            //Logic for NonCorp
                            if (newValue[MRKT_SEG].value.indexOf(NONCORP) > -1 && !(oldValue[MRKT_SEG].value.indexOf(NONCORP) > -1)) {
                                //if user selects NonCorp, make sure all NonCorp nodes are checked
                                newValue[MRKT_SEG].value = arrayMergeUnique(newValue[MRKT_SEG].value, $scope.nonCorpMrktSegments);
                                multiSelect.value(newValue[MRKT_SEG].value);
                                setAllNodes(getNonCorpNodes(treeView), true);
                            } else if (newValue[MRKT_SEG].value.indexOf(NONCORP) < 0 && oldValue[MRKT_SEG].value.indexOf(NONCORP) > -1) {
                                //if user deselects NonCorp, make sure all NonCorp nodes are unchecked
                                if (uncheckAllNC) {
                                    newValue[MRKT_SEG].value = newValue[MRKT_SEG].value.filter(function (x) { return $scope.nonCorpMrktSegments.indexOf(x) < 0 });
                                    multiSelect.value(newValue[MRKT_SEG].value);
                                    setAllNodes(getNonCorpNodes(treeView), false);
                                } else {
                                    //if user deselects a noncorp member, the noncorp node itself must be unchecked.  this case accounts for that scenario so that the noncorp node can be unchecked without all other noncorp market segments being unchecked along with it.
                                    uncheckAllNC = true;
                                }
                            } else if (newValue[MRKT_SEG].value.indexOf(NONCORP) > -1 && removedNonCorpMemberNode(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value)) {
                                //if user deselects any Noncorp member node, deselect NonCorp node itself if noncorp node was in selection
                                newValue[MRKT_SEG].value.splice(newValue[MRKT_SEG].value.indexOf(NONCORP), 1);
                                multiSelect.value(newValue[MRKT_SEG].value);
                                if (treeView.dataItem(treeView.findByText(NONCORP)).checked == true) {
                                    treeView.dataItem(treeView.findByText(NONCORP)).set("checked", false);
                                    uncheckAllNC = false; //set NONCORP to unchecked, but do not want to uncheck all noncorp nodes on next sweep.
                                }
                            }

                            //Logic for Embedded
                            //getEmbeddedNodes
                            if (checkedEmbeddedSubSegment(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value, true)) {
                                //if select any EMBEDDED SUB SEGMENT, uncheck all non Embedded SUB SEGMENTS
                                newValue[MRKT_SEG].value = newValue[MRKT_SEG].value.filter(function (x) { return $scope.subMrktSegments.indexOf(x) > -1 });
                                multiSelect.value(newValue[MRKT_SEG].value);
                                setAllNodes(getEmbeddedNodes(treeView.dataSource.view(), false), false);
                            } else if (checkedEmbeddedSubSegment(newValue[MRKT_SEG].value, oldValue[MRKT_SEG].value, false)) {
                                //if select non EMBEDDED SUB SEGMENT, uncheck all EMBEDDED SUB SEGMENTS
                                newValue[MRKT_SEG].value = newValue[MRKT_SEG].value.filter(function (x) { return $scope.subMrktSegments.indexOf(x) < 0 });
                                multiSelect.value(newValue[MRKT_SEG].value);
                                setAllNodes(getEmbeddedNodes(treeView.dataSource.view(), true), false);
                            }

                            //TODO: if select embedded, do not let them. is that possible? may need to disable checkchicldren
                        }
                    }
                }

                if (oldValue[GEO].value.toString() != newValue[GEO].value.toString()) {
                    if (newValue[GEO].value.length > 1) {
                        if (newValue[GEO].value.indexOf(WW) > -1 && !(oldValue[GEO].value.indexOf(WW) > -1)) {
                            //if user has another geo selected and then selects WW, need to deselect all other GEOs
                            newValue[GEO].value = [WW];
                            $("#" + GEO).data("kendoMultiSelect").value([WW])
                        } else if (oldValue[GEO].value.length == 1 && oldValue[GEO].value[0] == WW && newValue[GEO].value.indexOf(WW) > -1) {
                            //if user had WW selected and selects another GEO, need to deselect WW
                            newValue[GEO].value.splice(newValue[GEO].value.indexOf(WW), 1)
                            $("#" + GEO).data("kendoMultiSelect").value(newValue[GEO].value)
                        }
                    }
                }

                //if (oldValue["PAYOUT_BASED_ON"] != newValue["PAYOUT_BASED_ON"]) {
                //}

                //if (oldValue["MEET_COMP_PRICE_QSTN"] != newValue["MEET_COMP_PRICE_QSTN"]) {
                //}

                //if (oldValue["PROGRAM_PAYMENT"] != newValue["PROGRAM_PAYMENT"]) {
                //}
            }

        }, true)

    // **** VALIDATE PRICING TABLE Methods ****
    //

    $scope.showWipDeals = function () {
        $state.go('contract.manager.strategy.wip', {
            cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId
        }, { reload: true });
    }
    $scope.backToPricingTable = function () {
        $scope.spreadNeedsInitialization = true;
        $state.go('contract.manager.strategy', {
            cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId
        }, { reload: true });
    }

    $scope.validateWipDeals = function () {
        debugger;
    }

    topbar.hide();
}