angular
    .module('app.contract')
    .controller('ContractController', ContractController);

ContractController.$inject = ['$scope', '$state', 'contractData', 'templateData', 'objsetService', 'templatesService', 'logger', '$uibModal', '$timeout', '$window', '$location', '$rootScope'];

function ContractController($scope, $state, contractData, templateData, objsetService, templatesService, logger, $uibModal, $timeout, $window, $location, $rootScope) {
    
    // store template information
    //
    $scope.templates = $scope.templates || templateData.data;

    // determine if the contract is existing or new... if new, look for pre-population attributes from the URL parameters
    //
    $scope.initContract = function (contractData) {
        // contract exists
        if (contractData !== null && contractData !== undefined) {
            if (contractData.data[0] !== undefined) return contractData.data[0];
            // Could not find the contract
            $state.go('nocontract');
        }

        // new contract
        debugger;
        var c = util.clone($scope.templates.ObjectTemplates.CNTRCT.ALL_TYPES);

        // check URL and see if any parameters were passed.
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



    // Don't let the user leave unless the data is savedte
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


    // Watch for any changes to contract data to set a dirty bit
    //
    $scope.$watch('contractData',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;
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
    $scope.resizeEvent = function() {
        $timeout(function () {
            var evt = $window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 200);
            window.dispatchEvent(evt);
        });
    }


    // **** MINI NAV ICON Methods ****
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
        $scope.clearPtTemplateIcons();
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
    $scope.addCustomToTemplates = function() {
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
                    function(data) {

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
                    function(data) {

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
        if (stateName === "contract.manager.strategy") source = "pricingTable";
        if (stateName === "contract.manager.strategy.wip") source = "wipDeal";

        // sync all detail data sources into main grid datasource for a single save
        var sData = $scope.spreadDs === undefined ? undefined : $scope.spreadDs.data();
        var gData = $scope.gridDs === undefined ? undefined : $scope.gridDs.data();

        // if there is grid data... merge details with primary datasource for full picture
        if (gData !== undefined && gData !== null) {
            for (var i = 0; i < gData.length; i++) {
                var id = gData[i].ID;
                if ($scope.gridDetailsDs[id] !== undefined) {
                    gData[i]._MultiDim = $scope.gridDetailsDs[id].data();
                }
            }
        }
        
        // validate that we have access to spreadDs, gridDs and GridDetailsDs
        var contractData = $scope._dirtyContractOnly ? [$scope.contractData] : [];
        var curPricingTableData = $scope.curPricingTable.DC_ID === undefined ? [] : [$scope.curPricingTable];

        objsetService.updateContractAndCurPricingTable($scope.getCustId(), contractData, curPricingTableData, sData, gData, source).then(
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

        // check for NEW contract
        if (ct.DC_ID <= 0) ct.DC_ID = $scope.uid--;

        // Add to DB first... then add to screen
        objsetService.createContract($scope.getCustId(), ct).then(
            function (data) {
                $scope.updateNegativeIds(ct, "Contract", data);
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
    $scope.customContractValidate = function () {
        var isValid = true;
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
                if (key[0] !== '_' && value !== undefined && value !== null && !Array.isArray(value) && typeof (value) !== "object" && (typeof(value) === "string" && value.trim() === "") && ct._behaviors.isRequired[key] === true) {
                    ct._behaviors.validMsg[key] = "* field is required";
                    ct._behaviors.isError[key] = true;
                    isValid = false;
                }
            });

        if (isValid) {
            $scope.saveContract();
        }
    }

    $scope.updateNegativeIds = function(collection, key, data) {
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

        if (isValid) {
            $scope.addPricingStrategy();
        }
    }


    // **** NEW PRICING TABLE Methods ****
    //
    $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PRC_TBL.CAP_BAND);
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
    $scope.validatePricingTable = function() {
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
