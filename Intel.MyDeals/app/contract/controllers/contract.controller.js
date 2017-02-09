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
        if (contractData !== null && contractData !== undefined) return contractData.data[0];

        // new contract
        var c = util.clone($scope.templates.ObjectTemplates.Contract.Generic);

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
    $scope.isPricingStrategiesHidden = false;
    $scope.isExistingContract = function () {
        return $scope.contractData.dc_id > 0;
    }



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
        $scope.isPricingStrategiesHidden = false;
    }
    $scope.showAddPricingTable = function (ps) {
        $scope.isAddPricingTableHidden = false;
        $scope.isAddStrategyHidden = true;
        $scope.isAddStrategyBtnHidden = true;
        $scope.isSearchHidden = true;
        $scope.isPricingStrategiesHidden = true;
        $scope.curPricingStrategy = ps;
    }
    $scope.hideAddPricingTable = function () {
        $scope.isAddPricingTableHidden = true;
        $scope.isAddStrategyHidden = true;
        $scope.isAddStrategyBtnHidden = false;
        $scope.isSearchHidden = true;
        $scope.isPricingStrategiesHidden = false;
        $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PricingTable.Generic);
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
        $scope.isPricingStrategiesHidden = false;
    }


    // **** PRICING TABLE Methods ****
    //
    $scope.addCustomToTemplates = function() {
        angular.forEach($scope.templates.ModelTemplates.PricingTable, function (value, key) {
            value._custom = {
                "ltr": value.name[0],
                "_active": false
            };
        });
    }
    $scope.clearPtTemplateIcons = function () {
        angular.forEach($scope.templates.ModelTemplates.PricingTable, function (value, key) {
            value._custom._active = false;
        });
    }
    $scope.selectPtTemplateIcon = function (ptTmplt) {
        $scope.clearPtTemplateIcons();
        ptTmplt._custom._active = true;
        $scope.newPricingTable["OBJSET_TYPE_CD"] = ptTmplt.name;
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
        if ($scope.curPricingTableId > 0 && $scope.curPricingTable !== null && $scope.curPricingTable.dc_parent_id === id) {
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
                objsetService.deletePricingStrategy(ps.dc_id).then(
                    function(data) {

                        // TODO need to handle exception/error here... right now we do not read response for pass/fail

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingStrategyIf(ps.dc_id);
                        $scope.unmarkCurPricingTableIf(ps.dc_id);

                        // delete item
                        $scope.contractData.PricingStrategy.splice($scope.contractData.PricingStrategy.indexOf(ps), 1);

                        logger.success("Deleted the Pricing Strategy", ps, "Save Sucessful");
                        topbar.hide();
                    },
                    function (result) {
                        logger.error("Could not delete the Pricing Strategy.", response, response.statusText);
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
                objsetService.deletePricingTable(pt.dc_id).then(
                    function(data) {

                        // TODO need to handle exception/error here... right now we do not read response for pass/fail

                        // might need to unmark the current selected item
                        $scope.unmarkCurPricingTableIf(ps.dc_id);

                        // delete item
                        ps.PricingTable.splice(ps.PricingTable.indexOf(pt), 1);

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
        var curPricingTableData = $scope.curPricingTable.dc_id === undefined ? [] : [$scope.curPricingTable];

        objsetService.updateContractAndCurStrategy(contractData, curPricingTableData, sData, gData, source).then(
            function (data) {
                $scope.resetDirty();
                logger.success("Saved the contract", $scope.contractData, "Save Sucessful");
                topbar.hide();
                if (toState !== undefined) $state.go(toState.name, toParams);
            },
            function (result) {
                debugger;
                logger.error("Could not save the contract.", response, response.statusText);
                topbar.hide();
            }
        );
    }
    $scope.saveEntireContract = function () {
        if (!$scope._dirty) return;
        $scope.saveEntireContractBase($state.current.name);
    }
    $scope.saveContract = function () {
        topbar.show();

        // Contract Data
        var ct = $scope.contractData;

        // check for NEW contract
        if (ct.dc_id <= 0) ct.dc_id = $scope.uid--;

        // Add to DB first... then add to screen
        objsetService.createContract(ct).then(
            function (data) {

                // TODO need to handle exception/error here... right now we do not read response for pass/fail
                // let's fake getting a real deal # if it is a new contract
                if (ct.dc_id <= 0) ct.dc_id = -ct.dc_id;

                logger.success("Saved the contract", ct, "Save Sucessful");
                topbar.hide();

                // load the screen
                $state.go('contract.manager', { cid: ct.dc_id });
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
                if (key[0] !== '_' && !Array.isArray(value) && typeof(value) !== "object" && (!isNaN(value) || value.trim() === "") && ct._behaviors.isRequired[key] === true) {
                    ct._behaviors.validMsg[key] = "* field is required";
                    ct._behaviors.isError[key] = true;
                    isValid = false;
                }
            });

        if (isValid) {
            $scope.saveContract();
        }
    }


    // **** NEW PRICING STRATEGY Methods ****
    //
    $scope.newStrategy = util.clone($scope.templates.ObjectTemplates.PricingStrategy.Generic);
    $scope.addPricingStrategy = function () {
        topbar.show();
        var ct = $scope.contractData;

        // Clone base model and populate changes
        var ps = util.clone($scope.templates.ObjectTemplates.PricingStrategy.Generic);
        ps.dc_id = $scope.uid--;
        ps.dc_parent_id = ct.dc_sid;
        ps.dc_sid = 0;
        ps.PricingTable = [];
        ps.TITLE = $scope.newStrategy.TITLE;

        // Add to DB first... then add to screen
        objsetService.createPricingStrategy(ps).then(
            function (data) {
                // TODO need to handle exception/error here... right now we do not read response for pass/fail
                // let's fake getting a real deal #
                ps.dc_id = -ps.dc_id;

                $scope.contractData.PricingStrategy.push(ps);
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
    $scope.newPricingTable = util.clone($scope.templates.ObjectTemplates.PricingTable.Generic);
    $scope.addPricingTable = function () {
        topbar.show();

        //debugger;
        // Clone base model and populate changes
        var pt = util.clone($scope.templates.ObjectTemplates.PricingTable.Generic);
        pt.dc_id = $scope.uid--;
        pt.dc_parent_id = $scope.curPricingStrategy.dc_id;
        pt.dc_sid = $scope.curPricingStrategy.dc_sid;
        pt.OBJSET_TYPE_CD = $scope.newPricingTable.OBJSET_TYPE_CD;
        pt.TITLE = $scope.newPricingTable.TITLE;
        pt._defaultAtrbs = $scope.newPricingTable._defaultAtrbs;

        // Add to DB first... then add to screen
        objsetService.createPricingTable(pt).then(
            function (data) {

                // TODO need to handle exception/error here... right now we do not read response for pass/fail
                // let's fake getting a real deal #
                pt.dc_id = -pt.dc_id;

                $scope.curPricingStrategy.PricingTable.push(pt);
                $scope.hideAddPricingTable();

                logger.success("Added Pricing Table", pt, "Save Sucessful");
                topbar.hide();

                // load the screen
                $state.go('contract.manager.strategy', { cid: $scope.contractData.dc_id, sid: pt.dc_parent_id, pid: pt.dc_id });
            },
            function (result) {
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
        if ($scope.newPricingTable._extraAtrbs === undefined) return 0;
        return Object.keys($scope.newPricingTable._extraAtrbs).length;
    }
    $scope.newPricingTableDefaultLength = function () {
        if ($scope.newPricingTable._defaultAtrbs === undefined) return 0;
        return Object.keys($scope.newPricingTable._defaultAtrbs).length;
    }

    // **** VALIDATE PRICING TABLE Methods ****
    //
    $scope.validatePricingTable = function() {
        $scope.showWipDeals();
    }


    $scope.showWipDeals = function () {
        $state.go('contract.manager.strategy.wip', { cid: $scope.contractData.dc_id, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
    }
    $scope.backToPricingTable = function () {
        $scope.spreadNeedsInitialization = true;
        $state.go('contract.manager.strategy', { cid: $scope.contractData.dc_id, sid: $scope.curPricingStrategyId, pid: $scope.curPricingTableId });
    }

    $scope.validateWipDeals = function () {
        debugger;
    }



    topbar.hide();
}
