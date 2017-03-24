angular
    .module('app.contract')
    .controller('ContractController', ContractController);

ContractController.$inject = ['$scope', '$state', 'contractData', 'isNewContract', 'templateData', 'objsetService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope', 'confirmationModal', 'dataService', 'customerService', 'contractManagerConstants'];

function ContractController($scope, $state, contractData, isNewContract, templateData, objsetService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope, confirmationModal, dataService, customerService, contractManagerConstants) {
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
                $scope.contractData.TITLE + " - #" + $scope.contractData.DC_ID;
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
        $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV_UI"] = $scope.isNewContract;
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
                if (response.data.length <= 1) {
                    $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV_UI"] = false;
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
        $scope._dirty = false; // don't want to kick of listeners
        $state.go('contract.manager', {
            cid: $scope.contractData.DC_ID
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
        destroy: function (e) {
            var commandCell = e.container.find("td:first");
            commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
        },
        columns: [
        {
            command: [
                { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
            ], title: "", width: "7%"
        },
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
            if ($scope.contractData._behaviors.validMsg[type] == "Invaid date.") {
                $scope.contractData._behaviors.isError[type] = false;
                $scope.contractData._behaviors.validMsg[type] = "";
            }
            isValid = true;
        } else {
            isValid = false;
            $scope.contractData._behaviors.isError[type] = true;
            $scope.contractData._behaviors.validMsg[type] = "Invaid date."
        }
        return isValid;
    }
    // Watch for any changes to contract data to set a dirty bit
    //
    $scope.$watch('contractData',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue["CUST_MBR_SID"] !== newValue["CUST_MBR_SID"]) {
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
        while (container.length != 0) {
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
                objsetService.deletePricingStrategy(ps.DC_ID).then(
                    function (data) {
                        // TODO need to handle exception/error here... right now we do not read response for pass/fail

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingStrategyIf(ps.DC_ID);
                        $scope.unmarkCurPricingTableIf(ps.DC_ID);

                        // delete item
                        $scope.contractData.PRC_ST.splice($scope.contractData.PRC_ST.indexOf(ps), 1);

                        logger.success("Deleted the Pricing Strategy", ps, "Save Sucessful");
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
                objsetService.deletePricingTable(pt.DC_ID).then(
                    function (data) {
                        // TODO need to handle exception/error here... right now we do not read response for pass/fail

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingTableIf(ps.DC_ID);

                        // delete item
                        ps.PRC_TBL.splice(ps.PRC_TBL.indexOf(pt), 1);

                        logger.success("Deleted the Pricing Table", pt, "Save Sucessful");
                        topbar.hide();
                    },
                    function (result) {
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
        //debugger;

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
                if (gData[i].DC_ID === null) gData[i].DC_ID = $scope.uid--;
                var id = gData[i].ID;
                if ($scope.gridDetailsDs[id] !== undefined) {
                    gData[i]._MultiDim = $scope.gridDetailsDs[id].data();
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
                }
                if (!!results.data.WIP_DEAL) {
                    $scope.updateResults(results.data.WIP_DEAL, $scope.pricingTableData.WIP_DEAL, $scope.gridDs);
                }

                debugger;
                // need to check for messages / Actions / ext...
                //        var gData = $scope.gridDs === undefined ? undefined : $scope.gridDs.data(); // TODO after multi dim... need to see if we can read the variable instead of the source
                //if ($scope.gridDs !== undefined) $scope.gridDs.sync();

                $scope.resetDirty();
                logger.success("Saved the contract", $scope.contractData, "Save Sucessful");
                topbar.hide();

                if (toState !== undefined) $state.go(toState.name, toParams);
            },
            function (response) {
                logger.error("Could not save the contract.", response, response.statusText);
                topbar.hide();
            }
        );
    }

    $scope.updateResults = function (data, source, ds) {
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
                if (data[i]["DC_ID"] !== undefined) {
                    if (Array.isArray(source)) {
                        for (p = 0; p < source.length; p++) {
                            $scope.mapProperty(source[p], data[i]);
                        }
                    } else {
                        $scope.mapProperty(source, data[i]);
                    }
                }
            }

            // reload the datasource
            if (ds !== undefined && ds !== null) ds.read();
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
                    $scope._dirty = false; // don't want to kick of listeners
                    $state.go('contract.manager', {
                        cid: ct.DC_ID
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
                if (key[0] !== '_' && !Array.isArray(value) && (!isNaN(value) || value.trim() === "") && $scope.newStrategy._behaviors.isRequired[key] === true) {
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
        pt._defaultAtrbs = $scope.newPricingTable._defaultAtrbs;

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
                });
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
                if (key[0] !== '_' && !Array.isArray(value) && (!isNaN(value) || value.trim() === "") && $scope.newPricingTable._behaviors.isRequired[key] === true) {
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

    // **** VALIDATE PRICING TABLE Methods ****
    //
    $scope.validatePricingTable = function () {
        $scope.showWipDeals();
    }

    $scope.showWipDeals = function () {
        $state.go('contract.manager.strategy.wip', {
            cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId
        });
    }
    $scope.backToPricingTable = function () {
        $scope.spreadNeedsInitialization = true;
        $state.go('contract.manager.strategy', {
            cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId
        });
    }

    $scope.validateWipDeals = function () {
        debugger;
    }

    topbar.hide();
}