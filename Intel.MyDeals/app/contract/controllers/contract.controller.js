angular
    .module('app.contract')
    .controller('ContractController', ContractController);

ContractController.$inject = ['$scope', '$state', 'contractData', 'templateData', 'objsetService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope', 'confirmationModal', 'dataService', 'customerService', 'contractManagerConstants'];

function ContractController($scope, $state, contractData, templateData, objsetService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope, confirmationModal, dataService, customerService, contractManagerConstants) {
    // store template information
    //
    $scope.templates = $scope.templates || templateData.data;

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

    $scope.contractData.MinYear = 2012;
    $scope.contractData.MaxYear = 2027;

    $scope.constants = contractManagerConstants;

    // Contract custom initializations and functions
    $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV"] = $scope.contractData["CUST_ACCNT_DIV"] === undefined || $scope.contractData["CUST_ACCNT_DIV"] === "";
    $scope.contractData._behaviors.isReadOnly["CUST_MBR_SID"] = $scope.contractData.DC_ID > 0;

    // In case of existing contract back date reason and text is captured display them
    $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN !== "";
    $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = $scope.contractData.BACK_DATE_RSN === "";
    $scope.contractData._behaviors.isRequired["BACK_DATE_RSN_TXT"] = $scope.contractData.BACK_DATE_RSN_TXT !== "";
    $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = $scope.contractData.BACK_DATE_RSN_TXT === "";

    // By default set the CUST_ACCPT to pending(99) if new contract
    $scope.contractData.CUST_ACCPT = $scope.contractData.CUST_ACCPT == "" ? 99 : $scope.contractData.CUST_ACCPT;
    var today = moment().startOf('date');

    // File save methods and variable
    $scope.fileUploadOptions = { saveUrl: 'save', removeUrl: 'remove', autoUpload: false };

    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                //fileService.getFileAttachments()
                //    .then(function (response) {
                //        e.success(response.data);
                //    }, function (response) {
                //        logger.error("Unable to get constants.", response, response.statusText);
                //    });
            },
            destroy: function (e) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Delete Attachment',
                    hasActionButton: true,
                    headerText: 'Delete confirmation',
                    bodyText: 'Are you sure you would like to Delete this Attachment ?'
                };

                confirmationModal.showModal({}, modalOptions).then(function (result) {
                    //fileService.deleteFileAttachments(e.data).then(function (response) {
                    //    e.success(response.data);
                    //    logger.success("Attachment Deleted.");
                    //}, function (response) {
                    //    logger.error("Unable to delete Attachment.", response, response.statusText);
                    //});
                });
            },
        },
        pageSize: 25,
        schema: {
            model: {
                id: "ATTCH_SID"
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
        destroy: function (e) {
            var commandCell = e.container.find("td:first");
            commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
        },
        columns: [
           {
               command: [
                   { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                   { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
               ],
               title: " ",
               width: "7%"
           },
          { "field": "FILE_NM", "title": "File Name", "template": "<a href='/api/FileAttachments/OpenAttachment/#: OBJ_SID #/#: ATTCH_SID #'>#: FILE_NM #</a>" },
          { "field": "CHG_EMP_WWID", "title": "Added By", width: "25%" },
          { "field": "CHG_DTM", "title": "Date Added", width: "25%" }
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
                    "Start date cannot be less than year " + $scope.contractData.MinYear : "Start date cannot be after End Date";
            }
        } else {
            if (moment(endDate).isBefore(startDate) || moment(endDate).year() > $scope.contractData.MaxYear) {
                $scope.contractData._behaviors.isError['END_DT'] = true;
                $scope.contractData._behaviors.validMsg['END_DT'] = moment(endDate).year() > $scope.contractData.MaxYear ?
                    "End date cannot be greater than year " + $scope.contractData.MaxYear : "End date cannot be before End Date";
            }
        }
    }

    // Update start date and end date based on the quarter selection
    var updateDateByQuarter = function (qtrType, qtrValue, yearValue) {
        var customerMemberSid = $scope.contractData.CUST_MBR_SID == "" ? null : $scope.contractData.CUST_MBR_SID;
        var quarterDetails = customerService.getCustomerCalendar(customerMemberSid, null, qtrValue, yearValue)
            .then(function (response) {
                if (qtrType == 'START_DATE') {
                    $scope.contractData.START_DT = response.data.QTR_STRT;
                    validateDate('START_DT');
                    unWatchStartDate = true;
                } else {
                    $scope.contractData.END_DT = response.data.QTR_END;
                    validateDate('END_DT');
                    unWatchEndDate = true;
                }
            }, function (response) {
                errInGettingDates(response);
            });
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

                // By default we dont want a contract to be backdated
                $scope.contractData.START_DT = moment(response.data.QTR_STRT).isBefore(today) ?
                    moment().format() : response.data.QTR_STRT;

                $scope.contractData.END_DT = response.data.QTR_END;

                // Unwatch all the dates, quarter and year, else they will go crazy
                unWatchStartQuarter = unWatchEndQuarter = unWatchStartDate = unWatchEndDate = true;
            }, function (response) {
                errInGettingDates(response);
            });
    }

    var errInGettingDates = function (response) {
        logger.error("Unable to get Customer Calendar Dates.", response, response.statusText);
    }

    if ($scope.contractData.DC_ID <= 0) {
        getCurrentQuarterDetails();
    } else {
        updateQuarterByDates('START_DT', $scope.contractData.START_DT);
        updateQuarterByDates('END_DT', $scope.contractData.END_DT);
    }

    var unWatchStartQuarter, unWatchEndQuarter, unWatchStartDate, unWatchEndDate = false;

    var pastDateConfirm = function (newDate, oldDate) {
        if (moment(newDate).isBefore(today)) {
            kendo.confirm($scope.constants.pastDateConfirmText).then(function () {
                $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = false;
                $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = true;
            }, function () {
                $scope.contractData.START_DT = oldDate;
            });
        } else {
            $scope.contractData._behaviors.isHidden["BACK_DATE_RSN"] = true;
            $scope.contractData._behaviors.isRequired["BACK_DATE_RSN"] = false;
            $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = true;
            $scope.contractData.BACK_DATE_RSN = "";
        }
    }

    // Watch for any changes to contract data to set a dirty bit
    //
    $scope.$watch('contractData',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue["CUST_MBR_SID"] !== newValue["CUST_MBR_SID"]) {
                $scope.contractData.CUST_ACCNT_DIV = "";
                $scope.updateCorpDivision(newValue["CUST_MBR_SID"]);
                getCurrentQuarterDetails();
            }

            if (oldValue["START_QTR"] !== newValue["START_QTR"]
                || oldValue["START_YR"] !== newValue["START_YR"]) {
                if (!unWatchStartQuarter) {
                    updateDateByQuarter('START_DATE', newValue["START_QTR"], newValue["START_YR"]);
                }
                unWatchStartQuarter = false;
            }

            if (oldValue["END_QTR"] !== newValue["END_QTR"]
                            || oldValue["END_YR"] !== newValue["END_YR"]) {
                if (!unWatchEndQuarter) {
                    updateDateByQuarter('END_DATE', newValue["END_QTR"], newValue["END_YR"]);
                }
                unWatchEndQuarter = false;
            }

            if (oldValue["START_DT"] !== newValue["START_DT"]) {
                pastDateConfirm(newValue["START_DT"], oldValue["START_DT"]);
                if (!unWatchStartDate) {
                    updateQuarterByDates('START_DT', newValue["START_DT"]);
                }
                unWatchStartDate = false;
            }

            if (oldValue["END_DT"] !== newValue["END_DT"]) {
                if (!unWatchEndDate) {
                    updateQuarterByDates('END_DT', newValue["END_DT"]);
                }
                unWatchEndDate = false;
            }

            if (oldValue["TITLE"] !== newValue["TITLE"]) {
                isDuplicateContractTitle(newValue["TITLE"]);
            }

            if (oldValue["BACK_DATE_RSN"] !== newValue["BACK_DATE_RSN"]) {
                // other(106) reason selected
                $scope.contractData._behaviors.isRequired["BACK_DATE_RSN_TXT"] = (newValue["BACK_DATE_RSN"] == 106);
                $scope.contractData._behaviors.isHidden["BACK_DATE_RSN_TXT"] = (newValue["BACK_DATE_RSN"] != 106);
                if (newValue["BACK_DATE_RSN"] != 106) $scope.contractData.BACK_DATE_RSN_TXT = "";
            }

            el._dirty = true;
            el._dirtyContractOnly = true;
        }, true);

    // Customer and Customer Div functions
    var initiateCustDivCombobox = function () {
        if ($scope.contractData.CUST_ACCNT_DIV !== "") {
            $scope.updateCorpDivision($scope.contractData.CUST_MBR_SID);
        }
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
                $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV"] = false;
                $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = false;
                $scope.contractData._behaviors.isReadOnly["CUST_ACCNT_DIV"] = true;
                $scope.contractData.CUST_ACCNT_DIV = response.data[0].CUST_DIV_NM.toString();
            } else {
                $scope.contractData._behaviors.isHidden["CUST_ACCNT_DIV"] = false;
                $scope.contractData._behaviors.isReadOnly["CUST_ACCNT_DIV"] = false;
                $scope.contractData._behaviors.isRequired["CUST_ACCNT_DIV"] = true;
            }
            if (!!$("#CUST_ACCNT_DIV").data("kendoMultiSelect")) {
                $("#CUST_ACCNT_DIV").data("kendoMultiSelect").dataSource.data(response.data);
                $("#CUST_ACCNT_DIV").data("kendoMultiSelect").value($scope.contractData.CUST_ACCNT_DIV.split("/"));
            }
        }, function (response) {
            logger.error("Unable to get Customer Divisions.", response, response.statusText);
        });
    }

    initiateCustDivCombobox();

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
            $scope.curPricingTable = {};
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

        debugger;

        var contractData = $scope._dirtyContractOnly ? [$scope.contractData] : [];
        var curPricingTableData = $scope.curPricingTable.DC_ID === undefined ? [] : [$scope.curPricingTable];


        // Pricing Table Row
        if (curPricingTableData.length > 0) {
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
            var mCt = {};
            Object.keys(contractData[c]).forEach(function (key, index) {
                if (key[0] !== '_' && key !== "Customer" && key !== "PRC_ST") mCt[key] = this[key];
            }, contractData[c]);
            modCt.push(mCt);

            if (contractData[c]["PRC_ST"] === undefined) contractData[c]["PRC_ST"] = [];
            var item = contractData[c]["PRC_ST"];
            for (var p = 0; p < item.length; p++) {
                var mPs = {};
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

        debugger;

        objsetService.updateContractAndCurPricingTable($scope.getCustId(), data).then(
            function (data) {
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
    $scope.saveEntireContract = function () {
        if (!$scope._dirty) return;
        $scope.saveEntireContractBase($state.current.name);
    }
    $scope.getCustId = function () {
        return $scope.contractData['CUST_MBR_SID'];
    }
    $scope.saveContract = function () {
        topbar.show();

        // Contract Data
        var ct = $scope.contractData;
        ct.CUST_ACCNT_DIV = $scope.contractData.CUST_ACCNT_DIV.toString().replace(",", "/");

        // check for NEW contract
        if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

        // Add to DB first... then add to screen
        objsetService.createContract($scope.getCustId(), ct).then(
            function (data) {
                $scope.updateNegativeIds(ct, "CNTRCT", data);
                logger.success("Saved the contract", ct, "Save Sucessful");
                topbar.hide();

                // load the screen
                //debugger;
                $scope._dirty = false; // don't want to kick of listeners
                $state.go('contract.manager', { cid: ct.DC_ID });
            },
            function (result) {
                logger.error("Could not create the contract.", response, response.statusText);
                topbar.hide();
            }
        );
    }
    $scope.isValid = true;
    $scope.customContractValidate = function () {
        $scope.isValid = true;
        var ct = $scope.contractData;

        // Clear all values
        angular.forEach($scope.contractData,
            function (value, key) {
                ct._behaviors.validMsg[key] = "";
                ct._behaviors.isError[key] = false;
            });

        // Check required
        angular.forEach($scope.contractData,
            function (value, key) {
                if (key[0] !== '_' && value !== undefined && value !== null && !Array.isArray(value) && typeof (value) !== "object" && (typeof (value) === "string" && value.trim() === "") && ct._behaviors.isRequired[key] === true) {
                    ct._behaviors.validMsg[key] = "* field is required";
                    ct._behaviors.isError[key] = true;
                    $scope.isValid = false;
                }
            });

        if ($scope.isValid) {
            $scope.saveContract();
        }
    }

    $scope.updateNegativeIds = function (collection, key, data) {
        if (collection.DC_ID <= 0) {
            for (var a = 0; a < data.data[key].Actions.length; a++) {
                var action = data.data[key].Actions[a];
                if (action.Action === "ID_CHANGE" && action.DcID === collection.DC_ID) {
                    collection.DC_ID = action.AltID;
                }
            }
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
                $scope.updateNegativeIds(ps, "PRC_ST", data);

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
                //debugger;

                $scope.updateNegativeIds(pt, "PRC_TBL", data);

                if ($scope.curPricingStrategy.PRC_TBL === undefined) $scope.curPricingStrategy.PRC_TBL = [];
                $scope.curPricingStrategy.PRC_TBL.push(pt);
                $scope.hideAddPricingTable();

                logger.success("Added Pricing Table", pt, "Save Sucessful");
                topbar.hide();

                // load the screen
                //debugger;
                $state.go('contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: pt.DC_PARENT_ID, pid: pt.DC_ID });
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
        $state.go('contract.manager.strategy.wip', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
    }
    $scope.backToPricingTable = function () {
        $scope.spreadNeedsInitialization = true;
        $state.go('contract.manager.strategy', { cid: $scope.contractData.DC_ID, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
    }

    $scope.validateWipDeals = function () {
        debugger;
    }

    topbar.hide();
}