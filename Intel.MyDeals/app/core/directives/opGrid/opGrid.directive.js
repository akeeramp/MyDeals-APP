angular
    .module('app.core')
    .directive('opGrid', opGrid);

opGrid.$inject = ['$compile', 'objsetService', '$timeout', 'colorDictionary', '$uibModal', '$filter', 'userPreferencesService', 'logger', '$localStorage', 'securityService', '$linq'];

function opGrid($compile, objsetService, $timeout, colorDictionary, $uibModal, $filter, userPreferencesService, logger, $localStorage, securityService, $linq) {

    return {
        scope: {
            opData: '=',
            opOptions: '=',
            opHelp: '=',
            opRootScope: '=',
            opRootParentScope: '=',
            opName: '=',
            opIsTender: '@'
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/opGrid/opGrid.directive.html',
        controller: ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
            $scope.$storage = $localStorage;

            $scope.$storage = $localStorage.$default({
                CustomLayoutForECAP: undefined,
                CustomLayoutForKIT: undefined,
                CustomLayoutForPROGRAM: undefined,
                CustomLayoutForVOL_TIER: undefined
            });

            var depth = 5;
            var d = 0;
            var tierAtrbs = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR"];

            $scope.opRoleCanCopyDeals = (usrRole == 'FSE' || usrRole == 'GA');
            if ($scope.opName === undefined) $scope.opName = "DealEditor";

            $scope.isOverlapping = false;
            $scope.isOvlpAccess = false;
            $scope.ovlpErrorCount = [];
            $scope.ovlpDataRep = [];
            $scope.numColsLocked = 0;
            $scope.wrapEnabled = false;
            $scope.fontSize = 'md';


            $timeout(function () {
                $scope.tabStripDelay = true;
                $timeout(function () {
                    $scope.configureSortableTab();
                }, 10);
            }, 10);

            $scope.assignVal = function (field, defval) {
                var item = $scope.opOptions[field];
                return (item === undefined || item === null) ? defval : item;
            }

            $scope.displayFrontEndDateMessage = function (dataItem) {
                var today = new Date();
                var isFrontendDeal = (dataItem.PROGRAM_PAYMENT === undefined ? false : dataItem.PROGRAM_PAYMENT.indexOf('Frontend') !== -1); // If not there, default to false, else check for front end
                //var earlyDateRequested = (dataItem.START_DT < today);
                var wipDealDraftStage = (dataItem.WF_STG_CD === undefined ? false : dataItem.WF_STG_CD.indexOf('Draft') !== -1); // If not there, default to false, else check for WF STG end

                return (isFrontendDeal && wipDealDraftStage);
            }

            $scope.ovlpData = [];
            $scope.stages = [];
            $scope.initDsLoaded = false;
            $scope.stageCnt = 0;
            $scope.elGrid = null;
            $scope.grid = null;
            $scope.isToolbarVisible = false;
            $scope.hideToolbar = !!$scope.opOptions.hideToolbar ? $scope.opOptions.hideToolbar : false;
            $scope.ds = {};
            $scope.contractDs = null;
            $scope.isGridVisible = false;
            $scope.curGroup = "";
            $scope._dirty = false;
            $scope.searchFilter = "";
            $scope.columnSearchFilter = "";
            $scope.isLayoutConfigurable = $scope.assignVal("isLayoutConfigurable", false);
            $scope.isPricingTableEnabled = $scope.assignVal("isPricingTableEnabled", false);
            $scope.isCustomToolbarEnabled = $scope.assignVal("isCustomToolbarEnabled", false);
            $scope.isOverlapNeeded = $scope.assignVal("isOverlapNeeded", false);
            $scope.isExportable = $scope.assignVal("isExportable", false);
            $scope.exportableExcludeFields = $scope.assignVal("exportableExcludeFields", []);
            $scope.isPinEnabled = $scope.assignVal("isPinEnabled", true);
            $scope.isEditable = $scope.assignVal("isEditable", false);
            $scope.detailTemplateName = $scope.assignVal("detailTemplateName", "");
            $scope.detailInit = $scope.assignVal("detailInit", undefined);
            $scope.scrollable = $scope.assignVal("scrollable", true);
            $scope.resizable = $scope.assignVal("resizable", true);
            $scope.pageable = $scope.assignVal("pageable", {
                refresh: true,
                pageSizes: [25, 50, 100, 250, 500],
                buttonCount: 5
            });
            $scope.openCAPBreakOut = openCAPBreakOut;
            $scope.getPrductDetails = getPrductDetails;
            $scope.numSoftWarn = $scope.opOptions.numSoftWarn;
            $scope.dealTypes = [];
            $scope.dealCnt = 0;
            $scope.isGridDataLoaded = false;
            $scope.isLayoutConfigurablePrev = $scope.isLayoutConfigurable;
            $scope.isTenderPlatform = ($scope.opIsTender === null || $scope.opIsTender === undefined) ? false : $scope.opIsTender === "true";

            $scope.CAN_VIEW_COST_TEST = securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper); // Can view the pass/fail
            $scope.CAN_VIEW_MEET_COMP = securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null) || (window.usrRole === "FSE" && $scope.isTenderPlatform);

            $scope.root = !!$scope.opOptions.rootScope ? $scope.opOptions.rootScope : $scope.$parent.$parent.$parent;
            if (!$scope.root || !$scope.root.saveCell) { // possible this directive is called from nested parent hierarchy
                $scope.root = $scope.$parent;
                while (d < depth && !$scope.root.saveCell) {
                    $scope.root = $scope.root.$parent;

                    if ($scope.root == null) break;
                }
            }

            // change from the below to allow this to work from all scopes applied.  It will need to be tested from all pages that use opGrid
            $scope.parentRoot = $scope.root;
            //$scope.parentRoot = !!$scope.opOptions.rootParentScope ? $scope.opOptions.rootParentScope : $scope.$parent.$parent.$parent.$parent.$parent;

            $scope.openDealProducts = function (dataItem) {
                return $scope.parentRoot.openDealProducts(dataItem);
            }

            $scope.$on('refreshMCTData', function (event, data) {
                if (data.length > 0) {
                    $scope.parentRoot.refreshGridRows([data[0].DEAL_OBJ_SID], null);
                }
            });

            $scope.$on('refreshPCTData', function (event, data) {
                if (data.length > 0) {
                    $scope.parentRoot.refreshGridRows([data[0].DC_ID], null);
                    logger.success("Please wait for the result to be updated...");
                }
            });

            $scope.openPCTScreen = function (dataItem) {
                if (dataItem.PRC_ST_OBJ_SID === undefined) dataItem["PRC_ST_OBJ_SID"] = dataItem._parentIdPS;
                if (dataItem.PRC_ST_OBJ_SID) {
                    objsetService.readContract(dataItem.CNTRCT_OBJ_SID).then(function (data) {
                        $scope.contractData = data.data[0];
                        var tempcontractDataPS = {};
                        for (var i = 0; i < $scope.contractData.PRC_ST.length; i++) {
                            if ($scope.contractData.PRC_ST[i].DC_ID === dataItem.PRC_ST_OBJ_SID) {
                                tempcontractDataPS = ($scope.contractData.PRC_ST[i]);
                            }
                        }
                        $scope.contractData.PRC_ST = [];
                        $scope.contractData.PRC_ST.push(tempcontractDataPS);
                        $scope.contractData.CUST_ACCNT_DIV_UI = "";
                        $scope.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, dataItem.PRC_ST_OBJ_SID);
                        $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, $scope.curPricingStrategy.PRC_TBL[0].DC_ID);

                        $timeout(function () {
                            $scope.$apply();
                        });

                        var modal = $uibModal.open({
                            backdrop: 'static',
                            templateUrl: 'app/contract/partials/ptModals/managerPctModal.html',
                            controller: 'managerPctController',
                            //controllerAs: 'contract',
                            size: 'lg',
                            windowClass: 'tenderPctFolio-modal-window',
                            resolve: {
                                contractData: function () {
                                    return $scope.contractData;
                                },
                                dataItem: function () {
                                    return dataItem;
                                },
                                isToolReq: function () {
                                    return false;
                                }
                            }
                        });

                        modal.result.then(
                            function () {
                                //Close Event will come here
                            },
                            function () {
                                // Do Nothing on cancel
                            });
                    });
                }

            }

            $scope.runPCTMCT = function (mode) {
                var data = $scope.contractDs.data();
                if (data.length > 0) {
                    var selectedItem = [];
                    var selectedDeals = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].isLinked == true) {
                            selectedItem.push(data[i].PRC_ST_OBJ_SID);
                            selectedDeals.push(data[i].DC_ID);
                        }
                    }
                    if (selectedItem.length > 0) {
                        $(".iconRunPct").addClass("fa-spin grn");
                        $scope.$root.$broadcast('btnPctMctRunning', {});
                        objsetService.runBulkPctPricingStrategy(selectedItem).then(function (data) {
                            $(".iconRunPct").removeClass("fa-spin grn");
                            $scope.$root.$broadcast('btnPctMctComplete', {});
                            $scope.parentRoot.refreshGridRows(selectedDeals, null);
                            logger.success("Please wait for the result to be updated...");
                        });
                    }
                }

            }

            // This method is used for tender approvel Submitted to Offer stage change
            // Run PCT before stage change call
            $scope.$on('TenderRunPCTBeforeApproval', function (e, arg) {
                var selectedItem = arg.tenders.map(function (x) {
                    return x.PS_ID; // PS Id to run PCT
                });
                if (selectedItem.length > 0) {
                    $(".iconRunPct").addClass("fa-spin grn");
                    $scope.$root.$broadcast('btnPctMctRunning', {});
                    objsetService.runBulkPctPricingStrategy(selectedItem).then(function (data) {
                        // PCT completed, irrespective of result call stage change method, this method will return 
                        // error message if DB has a fail result and UI has pass result for PCT and MCT
                        $(".iconRunPct").removeClass("fa-spin grn");
                        $scope.parentRoot.actionTenderDeals(arg.tenders, arg.newVal);
                    });
                }
            });

            $scope.openMCTScreen = function (dataItem) {
                if (dataItem.PRC_ST_OBJ_SID === undefined) dataItem["PRC_ST_OBJ_SID"] = dataItem._parentIdPS;
                if (dataItem.PRC_ST_OBJ_SID) {
                    var modal = $uibModal.open({
                        backdrop: 'static',
                        templateUrl: 'app/contract/partials/ptModals/meetCompModal.html',
                        controller: 'MeetCompController',
                        //controllerAs: 'contract',
                        size: 'lg',
                        windowClass: 'tenderFolio-modal-window',
                        resolve: {
                            dataItem: function () {
                                return dataItem;
                            },
                            parentScope: function () {
                                return $scope;
                            }
                        }
                    });

                    modal.result.then(
                        function () {
                            //Close Event will come here
                        },
                        function () {
                            // Do Nothing on cancel
                        });
                }

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

            $scope.showHelpTopicHelper = function (dataItem) {
                showHelpTopic($scope.opHelp);
            }

            $scope.showStage = function (dataItem) {
                return gridUtils.stgFullTitleChar(dataItem);
            }

            $scope.opGridId = "";
            $scope.checkforCustomerLayout = function (dealType) {
                var key = "CustomLayoutFor" + dealType;
                if ($scope.$storage[$scope.opName + "_" + key] !== undefined && $scope.$storage[$scope.opName + "_" + key].length > 0) {
                    $timeout(function () {
                        // Custom layout assigns page size, page size change triggers read operaion , no need of calling read oeparation again
                        $scope.applyCustomLayoutToGrid($scope.$storage[$scope.opName + "_" + key]);
                        $scope.contractDs.read();
                    }, 10);
                    return;
                }

                userPreferencesService.getActions($scope.opName, key)
                    .then(function (response) {
                        $scope.$storage[$scope.opName + "_" + key] = response.data;
                        $timeout(function () {
                            // Custom layout assigns page size, page size change triggers read operaion , no need of calling read oeparation again
                            $scope.applyCustomLayoutToGrid($scope.$storage[$scope.opName + "_" + key]);
                            $scope.contractDs.read();
                        }, 10);
                    }, function (response) {
                        $timeout(function () {
                            $scope.contractDs.read();
                        }, 10);
                        logger.error("Unable to get Custom Layout.", response, response.statusText);
                    });
            }


            $scope.assignColSettings = function () {
                if ($scope.opOptions.columns === undefined) return [];

                var indxs = {};
                var cnt = 0;
                angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                    this[key] = cnt++;
                }, indxs);

                var cols = $scope.opOptions.columns;
                for (var c = 0; c < cols.length; c++) {

                    if (cols[c].editor !== undefined) {
                        if (cols[c].editor === "multiDimEditor") {
                            cols[c].editor = $scope.multiDimEditor;
                        } else if (cols[c].editor === "scheduleEditor") {
                            cols[c].editor = $scope.scheduleEditor;
                        } else if (cols[c].editor === "BID_ACTNS") {
                            cols[c].editor = $scope.bidActnsEditor
                        }
                    } else if (cols[c].lookupUrl !== undefined && cols[c].lookupUrl !== "") {
                        cols[c].editor = $scope.lookupEditor;
                    }

                    //fix multi dim to single dim column for nested data
                    cols[c].field = cols[c].field.split("_____")[0];

                    // mark index order
                    cols[c].indx = indxs[cols[c].field] === undefined ? 0 : indxs[cols[c].field];

                    if (cols[c].locked) $scope.numColsLocked++;

                    // mark everything hidden by default
                    cols[c].hidden = true;

                    if (cols[c].filterable !== undefined && cols[c].filterable) {

                        if (cols[c].filterable === true) {
                            cols[c].filterable = { multi: true, search: true };
                            if (cols[c]["field"] == "WF_STG_CD") {
                                cols[c].filterable = {
                                    multi: true,
                                    search: true,
                                    itemTemplate: function (e) {
                                        if (e.field == "all") {
                                            return '<li class="k-item"><label class="k-label"><input type="checkbox" class="k-check-all" value="Select All">Select All</label></li>';
                                        } else {
                                            return '<li class="k-item"><label class="k-label"><input type="checkbox" class="" value="#=data.WF_STG_CD#">#=gridUtils.stgFullTitleChar(data)#</label></li>'
                                        }
                                    }
                                };
                            }
                            if (cols[c]["field"] == "CUST_MBR_SID") {
                                cols[c].filterable = {
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
                    }
                }
                // now sort the columns based on the group settings
                cols.sort(function (a, b) {
                    return a.indx - b.indx;
                });
                return cols;
            }

            $scope.columnMenu = {
                openOnClick: true,
                open: function () {
                    var selector;
                    $.each($scope.grid.columns, function () {
                        if (this.hidden) {
                            $("input[data-field='" + this.field + "']").prop("checked", false);
                        }
                    });
                }
            };

            $scope.onColumnChange = function (val) {
                var col = null;

                for (var i = 0; i < $scope.grid.columns.length; i++)
                    if ($scope.grid.columns[i]["field"] === val.field)
                        col = $scope.grid.columns[i];

                if (!col) return;

                var colGrp = $scope.opOptions.groupColumns[val.field];
                if (col.hidden) {
                    $scope.grid.showColumn(val.field);
                    if (colGrp !== undefined && colGrp !== null) {
                        if (colGrp.Groups === undefined) colGrp.Groups = [];
                        colGrp.Groups.push($scope.curGroup);
                    }
                } else {
                    $scope.grid.hideColumn(val.field);

                    var index = colGrp.Groups.indexOf($scope.curGroup);
                    if (index > -1) {
                        colGrp.Groups.splice(index, 1);
                    }
                }
            }

            $scope.cloneWithOrder = function (source) {
                if (!$scope.opOptions[source]) return;

                var newArray = [];
                var grps = $scope.opOptions[source].groups;
                if (grps === undefined || grps === null) grps = [];
                for (var i = 0; i < grps.length; i++) {
                    newArray.push({ "name": grps[i].name, "order": grps[i].order, "isPinned": grps[i].isPinned, "isTabHidden": grps[i].isTabHidden });
                }
                $scope.opOptions.groups = newArray;

                var newObj = {};
                var cols = $scope.opOptions[source].groupColumns;
                for (var key in cols) {
                    if (cols.hasOwnProperty(key)) {
                        newArray = [];
                        for (i = 0; i < cols[key].Groups.length; i++) {
                            newArray.push(cols[key].Groups[i]);
                        }
                        newObj[key] = {};
                        newObj[key].Groups = newArray;
                    }
                }
                $scope.opOptions.groupColumns = newObj;
                //util.clone($scope.opOptions[source].groupColumns);
            }

            // Apply the default layout.  Later, we'll apply the custom layout if there is one.
            $scope.cloneWithOrder("default");

            $scope.configureSortableTab = function () {
                $("#tabstrip ul.k-tabstrip-items").kendoSortable({
                    filter: "li.k-item",
                    axis: "x",
                    container: "ul.k-tabstrip-items",
                    hint: function (element) {
                        return $("<div id='hint' class='gradTab k-widget k-header k-tabstrip'><ul class='k-tabstrip-items k-reset'><li class='k-item k-tab-on-top'>" + element.html() + "</li></ul></div>");
                    },
                    change: function (e) {
                        var tabstrip = $("#tabstrip").data("kendoTabStrip"),
                            reference = tabstrip.tabGroup.children().eq(e.newIndex);

                        if (e.oldIndex < e.newIndex) {
                            tabstrip.insertAfter(e.item, reference);
                        } else {
                            tabstrip.insertBefore(e.item, reference);
                        }
                    }
                });
            }

            $scope.alignGroupOrder = function () {
                var tabstrip = $("#tabstrip").data("kendoTabStrip");
                var grps = $scope.opOptions.groups;
                for (var g = 0; g < grps.length; g++) {
                    if (grps[g].name === "All") {
                        grps[g].order = 99;
                    } else if (grps[g].name === "CAP Info") {
                        grps[g].order = 98;
                    } else {
                        grps[g].order = tabstrip.tabGroup === undefined ? 50 : tabstrip.tabGroup.find(':contains("' + grps[g].name + '")').index();
                        // if we can't find the tab... it is probably a new one being added and not rendered yet.
                        if (grps[g].order === -1) grps[g].order = 50;
                    }
                }
            }

            $scope.clkAllItems = function () {
                var isChecked = document.getElementById('chkDealTools').checked;
                var data = $scope.contractDs.view();
                for (var i = 0; i < data.length; i++) {
                    data[i].isLinked = isChecked;                    
                }
            }
            $scope.excludeAllItems = function () {
                var isChecked = document.getElementById('chkDealTools').checked;
                var data = $scope.contractDs.view();
                for (var i = 0; i < data.length; i++) {
                    data[i].EXCLUDE_AUTOMATION = isChecked; // This is the select all checking a box, not the value
                    data[i].dirty = true;
                }
                $scope.contractDs.sync();
                $scope.root.selectAllExclusion();
            }
            //Call contract.controller.js => addExclusionList()
            $scope.addExclusionList = function (dataItem) {
                $scope.root.addExclusionList(dataItem);                
            }
            $scope.clickPin = function (e, grpName) {
                var el = $(e.currentTarget);
                var isPinned;
                if (el.hasClass("active")) {
                    el.removeClass("active");
                    isPinned = false;
                } else {
                    el.addClass("active");
                    isPinned = true;
                }

                for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                    if ($scope.opOptions.groups[g].name === grpName) {
                        $scope.opOptions.groups[g].isPinned = isPinned;
                    }
                }
            }

            $scope.addTab = function () {
                kendo.prompt("Tab name:", "").then(function (data) {
                    if (data === "") data = "New Tab";

                    // Prevent duplicate tab names.
                    for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                        if ($scope.opOptions.groups[g].name.trim().toLowerCase() === data.trim().toLowerCase()) {
                            logger.error("Tab name already exists.", null, "Add Tab Failed");
                            return;
                        }
                    }

                    $scope.addToTab(data.trim());
                },
                    function () {
                        // cancel
                    });
            }

            $scope.renameTab = function () {
                kendo.prompt("Tab name:", $scope.curGroup).then(function (data) {
                    if (data === "" || data.toLowerCase() == "overlapping") return;

                    for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                        if ($scope.opOptions.groups[g].name === $scope.curGroup) {
                            $scope.opOptions.groups[g].name = data;
                        }
                    }

                    // change group name in column list
                    angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                        var index = value.Groups.indexOf($scope.curGroup);
                        if (index > -1) {
                            value.Groups[index] = data;
                        }
                    });

                    $scope.curGroup = data;
                    $scope.alignGroupOrder();
                    $scope.$apply();
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                    $scope.configureSortableTab();
                },
                    function () {
                        // cancel
                    });
            }

            $scope.removeTab = function (e, grpName) {
                for (var i = 0; i < $scope.opOptions.groups.length; i++) {
                    if ($scope.opOptions.groups[i].name === grpName) {
                        $scope.opOptions.groups.splice(i, 1);
                        break;
                    }
                }

                angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                    var index = value.Groups.indexOf(grpName);
                    if (index > -1) {
                        value.Groups.splice(index, 1);
                    }
                });

                $scope.selectFirstTab();
            }

            $scope.defaultColumnOrderArr = [];
            $scope.defaultLayout = function () {
                $scope.opOptions.groups = [];
                $timeout(function () {
                    $scope.cloneWithOrder("default");

                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                    $scope.configureSortableTab();
                    $scope.selectFirstTab();
                    $scope.reorderGridColumns($scope.defaultColumnOrderArr);
                    $scope.applyHideIfAllRules($scope.opData);
                    $scope.grid.dataSource.pageSize(25);  // 25 is the default page size.
                }, 10);
            }

            $scope.customLayout = function (reportError) {
                reportError = typeof reportError === 'undefined' ? true : reportError;
                // Get the persisted grid settings.

                if ($scope.$storage[$scope.opName + "_CustomLayoutFor" + $scope.dealTypes[0]] !== undefined) {
                    $scope.applyCustomLayoutToGrid($scope.$storage[$scope.opName + "_CustomLayoutFor" + $scope.dealTypes[0]]);
                    return;
                }

                userPreferencesService.getActions($scope.opName, "CustomLayoutFor" + $scope.dealTypes[0])
                    .then(function (response) {
                        $scope.$storage[$scope.opName + "_CustomLayoutFor" + $scope.dealTypes[0]] = response.data;
                        if (response.data && response.data.length > 0) {
                            $scope.applyCustomLayoutToGrid(response.data);
                        } else {
                            if (reportError) {
                                kendo.alert("You have not saved a custom layout yet.");
                            }
                        }
                    }, function (response) {
                        logger.error("Unable to get Custom Layout.", response, response.statusText);
                    });
            }

            //$scope.getColorStyle = function (c) {
            //    if (typeof $scope.root.getColorStyle != 'undefined') {
            //        return $scope.root.getColorStyle(c);
            //    }
            //    else if ($scope.root.$parent.getColorStyle != 'undefined') {
            //        return $scope.root.$parent.getColorStyle(c);
            //    }
            //}

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


            $scope.applyCustomLayoutToGrid = function (data) {
                if (!$scope.isLayoutConfigurable) return;

                $scope.defaultColumnOrderArr = $scope.getColumnOrder();

                //$scope.opOptions.groups = [];
                $scope.opOptions.custom = {};

                // 'Groups' (which tabs to show)
                var groupsSetting = data.filter(function (obj) {
                    return obj.PRFR_KEY === "Groups";
                });
                if (groupsSetting && groupsSetting.length > 0) {
                    $scope.opOptions.custom.groups = JSON.parse(groupsSetting[0].PRFR_VAL);
                }

                // 'GroupColumns' (which columns to show for each of the tabs)
                var groupColumnsSetting = data.filter(function (obj) {
                    return obj.PRFR_KEY === "GroupColumns";
                });
                if (groupColumnsSetting && groupColumnsSetting.length > 0) {
                    $scope.opOptions.custom.groupColumns = JSON.parse(groupColumnsSetting[0].PRFR_VAL);
                }

                // 'ColumnOrder' (the column order, remember that all tabs 'share' a single grid)
                var customColumnOrderArr = [];
                var columnOrderSetting = data.filter(function (obj) {
                    return obj.PRFR_KEY === "ColumnOrder";
                });
                if (columnOrderSetting && columnOrderSetting.length > 0) {
                    customColumnOrderArr = JSON.parse(columnOrderSetting[0].PRFR_VAL);
                }

                // 'PageSize'
                var pageSize = 25;
                var pageSizeArr = data.filter(function (obj) {
                    return obj.PRFR_KEY === "PageSize";
                });
                if (pageSizeArr && pageSizeArr.length > 0) {
                    pageSize = Number(pageSizeArr[0].PRFR_VAL);
                }

                if (!$scope.opOptions["custom"] || $scope.opOptions["custom"].groups) {
                    $scope.cloneWithOrder("custom");
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                    $scope.configureSortableTab();
                    $scope.selectFirstTab();
                    $scope.reorderGridColumns(customColumnOrderArr);
                    if ($scope.contractDs.pageSize() != pageSize) {
                        $scope.contractDs.pageSize(pageSize);
                    }
                }

                // Apply the settings.
                //$timeout(function () {
                //    $scope.cloneWithOrder("custom");

                //    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                //    $scope.configureSortableTab();
                //    $scope.selectFirstTab();
                //    $scope.reorderGridColumns(customColumnOrderArr);
                //    $scope.grid.dataSource.pageSize(pageSize);
                //}, 10);
                //Apply the settings.
                $timeout(function () {
                    $scope.validateGrid();
                }, 10);
            }

            $scope.reorderGridColumns = function (columnOrderArr) {
                var grid = $scope.grid;

                for (var c = 0; c < columnOrderArr.length; c++) {
                    var fieldToMatch = columnOrderArr[c];

                    for (var i = 0; i < grid.columns.length; i++) {
                        if (grid.columns[i]["field"] === fieldToMatch) {
                            // Sold to id column hidden for Tender deals, 
                            // thus grid will have less column than columnOrderArr, check for undefined
                            if (grid.columns[c] !== undefined) {
                                grid.reorderColumn(c, grid.columns[i]);
                            }
                            break;
                        }
                    }
                }
            }

            $scope.saveLayout = function () {
                $scope.alignGroupOrder();

                // We don't want to persist the isPinned setting.
                var groupSettings = util.deepClone($scope.opOptions.groups);
                for (var i = 0; i < groupSettings.length; i++) {
                    groupSettings[i].isPinned = false;
                }

                // Persist the current 'Groups' settings.
                userPreferencesService.updateAction(
                    $scope.opName, // CATEGORY
                    "CustomLayoutFor" + $scope.dealTypes[0], // SUBCATEGORY
                    "Groups", // ID
                    JSON.stringify(groupSettings)) // VALUE
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to save Custom Layout.", response, response.statusText);
                    });

                // Persist the current 'GroupColumns' settings.
                userPreferencesService.updateAction(
                    $scope.opName, // CATEGORY
                    "CustomLayoutFor" + $scope.dealTypes[0], // SUBCATEGORY
                    "GroupColumns", // ID
                    JSON.stringify($scope.opOptions.groupColumns)) // VALUE
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to save Custom Layout.", response, response.statusText);
                    });

                // Persist the current column order.
                userPreferencesService.updateAction(
                    $scope.opName, // CATEGORY
                    "CustomLayoutFor" + $scope.dealTypes[0], // SUBCATEGORY
                    "ColumnOrder", // ID
                    JSON.stringify($scope.getColumnOrder($scope.grid))) // VALUE
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to save Custom Layout.", response, response.statusText);
                    });

                // Persist the page size.
                userPreferencesService.updateAction(
                    $scope.opName, // CATEGORY
                    "CustomLayoutFor" + $scope.dealTypes[0], // SUBCATEGORY
                    "PageSize", // ID
                    JSON.stringify($scope.grid.dataSource.pageSize())) // VALUE
                    .then(function (response) {
                    }, function (response) {
                        logger.error("Unable to save Custom Layout.", response, response.statusText);
                    });

                // Clear out stored session... next time we will load it
                $scope.$storage[$scope.opName + "_CustomLayoutFor" + $scope.dealTypes[0]] = undefined;
            }

            $scope.getColumnOrder = function () {
                var grid = $scope.grid;
                var columnOrderArr = [];

                for (var i = 0; i < grid.columns.length; i++) {
                    columnOrderArr.push(grid.columns[i]["field"]);
                }

                return columnOrderArr;
            }

            $scope.displayDealTypes = function () {
                var modDealTypes = [];
                for (var i = 0; i < $scope.dealTypes.length; i++) {
                    if (!!$scope.dealTypes[i]) modDealTypes.push($scope.dealTypes[i].replace(/_/g, ' '));
                }
                return modDealTypes.length > 0 ? $scope.dealCnt + " " + modDealTypes.join() + ($scope.dealCnt === 1 ? " Deal" : " Deals") : "";
            }

            $scope.$on('attachments-changed', function (event, args) {
                // TODO::TJE This code is not working.
                // Attachments were added/removed for the deal, so update the state of the paper-clip icon accordingly.
                //$scope.ds.dataSource.transport.read($scope.optionCallback);
            });

            $scope.$on('data-item-changed', function (event, fieldName, dataItem, el) {
                $scope.saveFunctions(dataItem, fieldName, dataItem[fieldName], el);
            });

            // Check the tender deals and approve them, this action is triggered from only tender dashboard
            $scope.$on('check-tender-deals', function (event, action) {
                var data = $scope.contractDs.data();
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].PS_WF_STG_CD == "Submitted" && data[i]["_actionsPS"] !== undefined && data[i]["_actionsPS"][action]) {
                        data[i]["isLinked"] = true;
                    }
                }
            });

            // Tender deals quick actions trigger handling
            $scope.$on('check-tender-deals-action', function (event, args) {
                var actionsChecked = false;
                var isTenderStage = (args["action"] == "Offer" || args["action"] == "Won" || args["action"] == "Lost") ? true : false;
                var data = $scope.contractDs.data();

                var checkedDeals = data.filter(function (x) {
                    return x["isLinked"] === true
                });

                // if user has selected deals, go ahead and trigger actions. Else select the deals which matches the actions user is doing
                if (checkedDeals.length > 0) {
                    actionsChecked = true;
                    var checkedDealsValid = checkedDeals.filter(function (x) {
                        return ((!isTenderStage && x["_actionsPS"][args["action"]] == true)
                            || (isTenderStage && ((x["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(args["action"])) != -"1")))
                    });
                    if (checkedDealsValid.length == 0) {
                        kendo.alert("The selected deals cannot be set to " + args["action"]);
                        return;
                    }

                } else {
                    for (var i = 0; i <= data.length - 1; i++) {
                        if (!isTenderStage && data[i]["_actionsPS"] !== undefined && data[i]["_actionsPS"][args["action"]]) {
                            data[i]["isLinked"] = true;
                            actionsChecked = true;
                        } else if (isTenderStage && data[i]["WF_STG_CD"] != args["action"]
                            && (data[i]["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(args["action"])) != -"1") {
                            data[i]["isLinked"] = true;
                            actionsChecked = true;
                        }
                    }
                }

                if (actionsChecked) {

                    checkedDeals = data.filter(function (x) {
                        return x["isLinked"] === true;//&& (x["_actionsPS"][args["action"]] == true || ((x["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(args["action"])) != -"1"))
                    });

                    if (checkedDeals.length === 0) {
                        kendo.alert("The selected deals cannot be set to " + args["action"]);
                        return;
                    }

                    $timeout(function () {
                        if (!isTenderStage) {
                            $scope.broadcast("approval-actions-updated", { newValue: args["action"], dataItem: checkedDeals[0], gridDS: checkedDeals });
                        } else {
                            $scope.broadcast("bid-actions-updated", { newValue: args["action"], dataItem: checkedDeals[0], gridDS: checkedDeals });
                        }
                    });
                } else {
                    kendo.alert("The selected action cannot be performed.");
                    return;
                }
            });

            $scope.applyHideIfAllRules = function (data) {
                var hideIfAll = [];

                // init all rules
                if (!!$scope.opOptions.default) {
                    if (!!$scope.opOptions.default.groups) {
                        for (g = 0; g < $scope.opOptions.default.groups.length; g++) {
                            group = $scope.opOptions.default.groups[g];
                            if (!!group.rules) {
                                for (r = 0; r < group.rules.length; r++) {
                                    if (group.rules[r].logical === "HideIfAll") {
                                        group.rules[r].name = group.name;
                                        group.rules[r].show = false;
                                        hideIfAll.push(group.rules[r]);
                                    }
                            }
                        }
                    }
                }

                for (i = 0; i < data.length; i++) {
                    if ($scope.dealTypes.indexOf(data[i].OBJ_SET_TYPE_CD) < 0) $scope.dealTypes.push(data[i].OBJ_SET_TYPE_CD);

                    for (r = 0; r < hideIfAll.length; r++) {
                        if (!!data[i][hideIfAll[r].atrb] && data[i][hideIfAll[r].atrb] !== hideIfAll[r].value) {
                            hideIfAll[r].show = true;
                        }
                    }
                }

                for (r = 0; r <= hideIfAll.length; r++) {
                    if (!!$scope.opOptions.groups) {
                        for (g = 0; g < $scope.opOptions.groups.length; g++) {
                            group = $scope.opOptions.groups[g];
                            if (!!group && hideIfAll[r] && group.name === hideIfAll[r].name) {
                                group.isHidden = !hideIfAll[r].show;
                                //} else {
                                //    group.isHidden = false;
                            }
                        }
                    }
                }
            }

            $scope.contractDs = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        util.console("contractDs read Started");
                        $scope.optionCallback = e;
                        var i, r, g, group;
                        var data = $scope.opData;

                        $scope.applyHideIfAllRules(data);

                        var childParent = {};
                        for (i = 0; i < data.length; i++) {
                            var item = data[i];
                            if (item.isLinked === undefined) item.isLinked = false;
                            if (childParent[item.DC_PARENT_ID] === undefined) childParent[item.DC_PARENT_ID] = 0;
                            childParent[item.DC_PARENT_ID]++;
                        }

                        $scope.dealCnt = data.length;

                        // now set total values
                        for (var j = 0; j < data.length; j++) {
                            data[j]["_parentCnt"] = childParent[data[j].DC_PARENT_ID];
                        }

                        var source = data;

                        // on success
                        util.console("contractDs read Ended");

                        $scope.broadcast("grid-datasource-read-complete");

                        e.success(source);
                    },
                    create: function (e) {
                        var source = $scope.opData;
                        for (var i = 0; i < e.data.models.length; i++) {
                            var item = e.data.models[i];

                            // assign an ID to the new item
                            source.push(item);

                            // on success
                            e.success(item);
                        }
                    },
                    update: function (e) {
                        util.console("contractDs update Started");
                        var source = $scope.opData;
                        // locate item in original datasource and update it
                        for (var i = 0; i < e.data.models.length; i++) {
                            var item = e.data.models[i];
                            if ($scope.getIndexById(item.DC_ID, source) === null) {
                                source.push(item);
                            } else {
                                source[$scope.getIndexById(item.DC_ID, source)] = item;
                            }
                        }
                        // on success
                        util.console("contractDs update Ended");
                        e.success();
                    },
                    destroy: function (e) {
                        var source = $scope.opData;

                        // locate item in original datasource and remove it
                        source.splice($scope.getIndexById(e.data.DC_ID, source), 1);

                        // on success
                        e.success();
                    }
                },
                error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                },
                batch: true,
                //Added for DE26504
                sort: [
                    { field: "PASSED_VALIDATION", dir: "desc" }
                ],
                //
                schema: {
                    model: $scope.opOptions.model
                },
                pageSize: 25
            });

            var isDisableViaDealGrp = function (comparison) {
                if (typeof comparison !== "string") {
                    return false;
                }
                return comparison.toUpperCase() !== "ADDITIVE" && comparison.toUpperCase() !== "NON ADDITIVE";
            }

            var triedToApplyCustomLayout = false;
            var disableCellsBasedOnAnotherCellValue;

            $scope.ds = {
                dataSource: $scope.contractDs,
                columns: $scope.opOptions.columns,
                scrollable: $scope.scrollable,
                //scrollable: {
                //    virtual: true // <--- Test to improve performance, loads slightly faster but messes up scrolling quickly through large data, virtualization can't keep up with out large set
                //},
                //excel: {
                //    allPages: true
                //},
                noRecords: {
                    template: "<div style='padding: 50px;'>No data found.  Please check your filters.</div>"
                },
                sortable: true,
                editable: $scope.isEditable,
                autoBind: false,
                navigatable: true,
                filterable: true,
                resizable: $scope.resizable,
                reorderable: true,
                pageable: $scope.pageable,
                filterMenuInit: $scope.opOptions.filterMenuInit,

                save: function (e) {
                    var newField = util.getFirstKey(e.values);

                    //disableCellsBasedOnAnotherCellValue(e.model, newField, e.values[newField], "DEAL_COMB_TYPE", "DEAL_GRP_EXCLDS", isDisableViaDealGrp); // TODO: hard coded sadness.
                    $scope.saveFunctions(e.model, newField, e.values[newField]);
                    gridUtils.onDataValueChange(e);

                },
                edit: function (e) {
                    var grid = this;
                    var isDetailTemplate = !!grid.detailTemplate ? 1 : 0;
                    var fieldName = "";
                    if (gridUtils.lockedCell(e)) {
                        fieldName = grid.columns[e.container.index()].field
                    } else {
                        fieldName = grid.columns[e.container.index() - isDetailTemplate + $scope.numColsLocked].field;
                    }
                    // TODO - Make the tempalte have a "Modeled after" field and replace the next line with that replacment
                    if (fieldName === "KIT_ECAP") fieldName = "ECAP_PRICE"; // Broken out special purpose field needs to be renamed back to ECAP PRICE
                    if (e.model._behaviors.isReadOnly[fieldName] === true || e.model._behaviors.isHidden[fieldName] === true) {
                        $scope.grid.closeCell();
                    }
                },
                dataBound: function (e) {
                    if ($scope.isGridDataLoaded) return;
                    $scope.isGridDataLoaded = true;

                    if ($scope.curGroup === "") {
                        $scope.selectFirstTab();
                        $scope.validateGrid();
                    }

                    var grid = this;
                    var majCols = [];
                    for (var g = 0; g < grid.columns.length; g++) {
                        if (grid.columns[g].mjrMnrChg !== null && grid.columns[g].mjrMnrChg !== "" && grid.columns[g].mjrMnrChg !== "MINOR") {
                            majCols.push(grid.columns[g].title);
                        }
                    }

                    var colCells = $(".k-grid-header thead tr th");
                    for (var c = 0; c < colCells.length; c++) {
                        if (majCols.indexOf(colCells[c].textContent) >= 0) {
                            $(colCells[c]).css("border-bottom", "3px solid #0071C5");
                        }
                    }

                    $scope.$root.$broadcast("OpGridDataBound");

                    //$timeout(function () {
                    //    $scope.overlappingDealsSetup();
                    //}, 3000);
                }
            };

            disableCellsBasedOnAnotherCellValue = function (model, newField, fieldName, changedCell, cellToDisable, isDisabledFunction) {
                if (newField === changedCell && !!fieldName) {
                    model._behaviors.isReadOnly[cellToDisable] = isDisabledFunction(fieldName);
                }
            };
            if ($scope.detailTemplateName !== "" && !!$scope.detailInit) {
                $scope.ds.detailTemplate = kendo.template($("#detail-template").html());
                $scope.ds.detailInit = $scope.detailInit;
            }

            $scope.selectFirstTab = function () {
                if ($scope.opOptions.groups[0] === undefined) return;

                $scope.curGroup = $scope.opOptions.groups[0].name;

                $timeout(function () {
                    // select the first column
                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                    if (!!tabStrip) {
                        tabStrip.select(0);
                        if ($scope.opOptions.groups !== undefined) {
                            $scope.showCols($scope.curGroup);
                            if ($scope.root) {
                                $scope.root.setBusy("", "");
                            }

                        }
                    }
                }, 10);
            }

            $scope.exportToExcelCustomColumns = function () {
                gridUtils.dsToExcel($scope.grid, $scope.ds.dataSource, "Deal Editor Export", true);
            }

            $scope.exportToExcel = function () {
                gridUtils.dsToExcel($scope.grid, $scope.ds.dataSource, "Deal Editor Export", false);
            }

            $scope.drawDetails = function (data) {
                return "hh";
            }

            $scope.getIndexById = function (id, source) {
                var l = source.length;

                for (var j = 0; j < l; j++) {
                    if (source[j].ID === id || source[j].DC_ID === id) {
                        return j;
                    }
                }
                return null;
            }

            function formatDate(date) { // HACK: format date hack so js datetime would be readable for C# API
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();

                return (month + "/" + day + "/" + year + " " + hour + ':' + minute + ':' + second);
            }

            $scope.lookupEditor = function (container, options) {
                var field = $(container).closest("[data-role=grid]").data("kendoGrid").dataSource.options.schema.model.fields[options.field];
                var cols = $(container).closest("[data-role=grid]").data("kendoGrid").columns;
                var col = { field: options.field };

                for (var c = 0; c < cols.length; c++) {
                    if (cols[c].field === options.field) {
                        col = cols[c];
                        break;
                    }
                }

                // col is Read-only
                if (options.model._behaviors.isReadOnly[col.field]) {
                    return;
                }

                if (col.uiType === "ComboBox" || col.uiType === "DROPDOWN") {

                    // Note: we shouldnt put atrb specific logic here, but if not here then where? template too generic and this is where we call it...
                    if (col.field === "RETAIL_CYCLE") {

                        var retailPullParams = {
                            PRD_MBR_SID: options.model["PRODUCT_FILTER"],
                            DealStartDate: formatDate(options.model["START_DT"]),
                            DealEndDate: formatDate(options.model["END_DT"])
                        };

                        $('<input required name="' + options.field + '"/>')
                            .appendTo(container)
                            .kendoComboBox({
                                autoBind: false,
                                valuePrimitive: true,
                                dataTextField: field.opLookupText,
                                dataValueField: field.opLookupValue,
                                dataSource: {
                                    type: "json",
                                    transport: {
                                        read: {
                                            url: field.opLookupUrl,
                                            dataType: 'json',
                                            type: "POST",
                                            data: retailPullParams,
                                        }
                                    }
                                }
                            });
                    } else {

                        $('<input name="' + options.field + '"/>')
                            .appendTo(container)
                            .kendoComboBox({
                                autoBind: false,
                                valuePrimitive: col.field !== "Customer",
                                dataTextField: field.opLookupText,
                                dataValueField: field.opLookupValue,
                                dataSource: {
                                    type: "json",
                                    transport: {
                                        read: field.opLookupUrl
                                    }
                                }
                            });
                    }
                } else if (col.uiType.toUpperCase() === "MULTISELECT") {

                    var lookupText = field.opLookupText;
                    var id = "";
                    if (col.field === "DEAL_SOLD_TO_ID") {
                        // TODO:change to dynamic
                        id = options.model["CUST_MBR_SID"];
                        id += "/" + options.model["GEO_COMBINED"].replace(/\//g, ',');
                        id += "/" + options.model["CUST_ACCNT_DIV"].replace(/\//g, ',');

                        lookupText = "subAtrbCd";
                    }

                    ////Note: this was first approach, had issues with reading back in string format and getting linked rows to sync
                    //$('<select data-bind="value:' + options.field + '" name="' + options.field + '"/>')
                    //	.appendTo(container)
                    //	.kendoMultiSelect({
                    //		autoBind: false,
                    //		valuePrimitive: true,
                    //		dataTextField: field.opLookupText,
                    //		dataValueField: field.opLookupValue,
                    //		dataSource: {
                    //			type: "json",
                    //			transport: {
                    //				read: {
                    //					url: field.opLookupUrl + "/" + id,
                    //					dataType: 'json',
                    //					type: "GET",
                    //				}
                    //			}
                    //		}
                    //	});

                    ////Note: this was second approach - this appending apprach had trouble marking the correct level _dirty attribute so that the grid actually saves it, also did not get linked rows to sync
                    var multiCompiled = $compile('<div class="myDealsControl" style="margin: 0;" op-control-flat ng-model="dataItem" op-cd="\'' + options.field + '\'" op-type="\'MULTISELECT\'" op-lookup-url="\'' + field.opLookupUrl + '/' + id + '\'" op-lookup-text="\'' + lookupText + '\'" op-lookup-value="\'' + field.opLookupValue + '\'" op-ui-mode="\'VERTICAL\'"></div>')(angular.element(container).scope());
                    $(container).append(multiCompiled);

                } else if (col.uiType.toUpperCase() === "EMBEDDEDMULTISELECT") {

                    //note: as this is a reusable directive we probably shouldnt put TRGT_RGN specific logic here, but if not here then where?
                    if (options.field.toUpperCase() === "TRGT_RGN") {
                        openTargetRegionModal(container, col);
                    }
                    else if (options.field.toUpperCase() === "MRKT_SEG") {
                        openMarketSegmentModal(container, col);
                    }
                    //else if (options.field.toUpperCase() === "DEAL_GRP_EXCLDS") {
                    //    openDealGroupModal(container, col);
                    //}

                } else {
                    $('<input required name="' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                            autoBind: false,
                            valuePrimitive: true,
                            dataTextField: field.opLookupText,
                            dataValueField: field.opLookupValue,
                            dataSource: {
                                type: "json",
                                transport: {
                                    read: field.opLookupUrl
                                }
                            }
                        });
                }
            }

            $scope.scheduleEditor = function (container, options) {
                var numTiers = options.model.NUM_OF_TIERS; // DE21100 - Was reading from autofill field ($scope.root.curPricingTable.NUM_OF_TIERS) which is not correct

                var tmplt = '<table>';
                var fields = [
                    { "title": "Tier", "field": "TIER_NBR", "format": "", "align": "left" },
                    { "title": "Start Vol", "field": "STRT_VOL", "format": "", "align": "right" },
                    { "title": "End Vol", "field": "END_VOL", "format": "", "align": "right" },
                    { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
                ];

                tmplt += '<tr style="height: 15px;">';
                for (var t = 0; t < fields.length; t++) {
                    var w = t === 0 ? "width: 50px;" : "";
                    tmplt += '<th style="padding: 0 4px; font-weight: 400; text-transform: uppercase; font-size: 10px; background: #eeeeee; text-align: center;' + w + '">' + fields[t].title + '</th>';
                }
                tmplt += '</tr>';

                for (var d = 1; d <= numTiers; d++) {
                    var dim = "10___" + d;
                    tmplt += '<tr style="height: 25px;">';
                    for (var f = 0; f < fields.length; f++) {
                        if (f === 0) {
                            tmplt += '<td style="margin: 0; padding: 0; text-align: ' + fields[f].align + ';"><span class="ng-binding" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + '\'] ' + gridUtils.getFormat(fields[f].field, fields[f].format) + ')"></span></td>';
                        } else if (f === fields.length - 1) { //rate
                            tmplt += '<td style="margin: 0; padding: 0;"><input kendo-numeric-text-box id="sched_contrl_' + fields[f].field + '_' + dim + '" k-min="0" k-decimals="2" k-format="\'n2\'" k-ng-model="dataItem.' + fields[f].field + '[\'' + dim + '\']" k-on-change="updateScheduleEditor(dataItem, \'' + fields[f].field + '\', ' + d + ')" style="max-width: 100%; margin:0;" /></td>';
                        } else {
                            if (f === 2 || d === 1) {   //if end vol or if it is the very first tier, allow editable
                                tmplt += '<td style="margin: 0; padding: 0;"><input kendo-numeric-text-box id="sched_contrl_' + fields[f].field + '_' + dim + '" k-min="1" k-max="999999999" k-decimals="0" k-format="\'n0\'" k-ng-model="dataItem.' + fields[f].field + '[\'' + dim + '\']" k-on-change="updateScheduleEditor(dataItem, \'' + fields[f].field + '\', ' + d + ')" style="max-width: 100%; margin:0;" /></td>';
                            } else { //else disabled
                                tmplt += '<td style="margin: 0; padding: 0;"><span class="ng-binding" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + '\'] ' + gridUtils.getFormat(fields[f].field, fields[f].format) + ')"></span></td>';
                            }

                        }
                    }
                    tmplt += '</tr>';
                }
                tmplt += '</table>';

                var compiled = $compile(tmplt)(angular.element(container).scope());
                $(container).append(compiled);

            }

            $scope.updateDirty = function (dataItem, field) {

                // default QTY value
                if (field == "QTY") {   //additional dirty updates needed? -> hide the logic for a CAP_____20_____1 thing in here?
                    var kit_key = "20_____1";
                    var capKitSum = 0;
                    var ycs2KitSum = 0;

                    for (var i = 0; i < 10; i++) {
                        var key = "20___" + i;
                        if (!dataItem[field].hasOwnProperty(key)) {
                            break;
                        }
                        else {
                            if (dataItem[field][key] === null) {
                                dataItem[field][key] = 1;
                            }
                        }

                        // if quantity changes, we also need to update the CAP Kit and YCS2 Kit column values that we save/display
                        if (dataItem["CAP"].hasOwnProperty(key) && !isNaN(dataItem["CAP"][key]) && dataItem["CAP"][key] != null) {
                            capKitSum += (dataItem["CAP"][key] * dataItem[field][key]);
                        }
                        if (dataItem["YCS2_PRC_IRBT"].hasOwnProperty(key) && !isNaN(dataItem["YCS2_PRC_IRBT"][key]) && dataItem["YCS2_PRC_IRBT"][key] != null) {
                            ycs2KitSum += (dataItem["YCS2_PRC_IRBT"][key] * dataItem[field][key]);
                        }
                    }
                    //set CAP Kit and YCS2 Kit values
                    if (dataItem["CAP"].hasOwnProperty(kit_key)) {
                        dataItem["CAP"][kit_key] = capKitSum;
                    }
                    if (dataItem["YCS2_PRC_IRBT"].hasOwnProperty(kit_key)) {
                        dataItem["YCS2_PRC_IRBT"][kit_key] = ycs2KitSum;
                    }
                }
                // default DSCNT_PER_LN value
                if (field == "DSCNT_PER_LN") {
                    for (var i = 0; i < 10; i++) {
                        var key = "20___" + i;
                        if (!dataItem[field].hasOwnProperty(key)) {
                            break;
                        }
                        else {
                            if (dataItem[field][key] === null) {
                                dataItem[field][key] = 0;
                            }
                        }
                    }
                }

                // update
                $scope.saveFunctions(dataItem, field, dataItem[field])
            }

            $scope.updateScheduleEditor = function (dataItem, field, row) {
                //if empty or max value, set to "Unlimited"
                if (field === "STRT_VOL" || field === "END_VOL") {
                    if (dataItem[field]["10___" + row] === null || dataItem[field]["10___" + row] == 999999999 || dataItem[field]["10___" + row] == "999999999") {
                        dataItem[field]["10___" + row] = "Unlimited";
                    }
                }

                //save primary column and propogate changes if necessary
                $scope.saveFunctions(dataItem, field, dataItem[field])

                if (field === "END_VOL") {
                    //if there is a next row/tier
                    if (!!dataItem["STRT_VOL"]["10___" + (row + 1)]) {
                        if (dataItem[field]["10___" + row] === "Unlimited") {
                            //if end vol is "Unlimited", then also set next start vol to "Unlimited" as well
                            dataItem["STRT_VOL"]["10___" + (row + 1)] = "Unlimited";
                        } else {
                            //if end vol is a number, then set next start vol to that number + 1
                            dataItem["STRT_VOL"]["10___" + (row + 1)] = parseInt(dataItem[field]["10___" + row]) + 1;
                        }

                        $scope.saveFunctions(dataItem, "STRT_VOL", dataItem["STRT_VOL"])
                    }
                }
            }

            $scope.multiDimEditor = function (container, options) {
                var field = $(container).closest("[data-role=grid]").data("kendoGrid").dataSource.options.schema.model.fields[options.field];
                var cols = $(container).closest("[data-role=grid]").data("kendoGrid").columns;
                var col = { field: options.field };

                for (var c = 0; c < cols.length; c++) {
                    if (cols[c].field === options.field) col = cols[c];
                }

                var el = "";
                if (options.field === "KIT_ECAP") { //Special condition for Kit Ecap which actually reads from Ecap Price -1 dim

                    el += $scope.createEditEl("ECAP_PRICE", field.uiType, "20_____1", field.format);
                } else if (options.field === "SUBKIT_ECAP") {
                    el += $scope.createEditEl("ECAP_PRICE", field.uiType, "20_____2", field.format);
                } else {    //All other multi-dim editors
                    var dim_base = "20___";
                    var dim_index = 0;  //start with dim 0 - the primary product
                    var model = options.model[options.field];
                    if (model) {
                        while (model.hasOwnProperty(dim_base + dim_index)) {
                            el += $scope.createEditEl(options.field, field.uiType, dim_base + dim_index, field.format);
                            dim_index++;
                        }
                    }
                }


                $(el).appendTo(container);
            }
            $scope.bidActnsEditor = function (container, options) {
                var el = "";
                var approveActions = [];
                var bidActions = [];

                if (options.model._contractPublished === 0) {
                    $("<div style='padding-left: 4px;'>Loading Folio...</div>").appendTo(container);
                    document.location.href = "/contract#/manager/" + options.model._contractId;
                    return;
                }

                approveActions.push({ text: "Action", value: "Action" })  //placeholder dummy for a user non-selection
                for (var actn in options.model["_actionsPS"]) {
                    if (options.model["_actionsPS"].hasOwnProperty(actn)) {
                        if (options.model["_actionsPS"][actn] == true && actn != "Cancel" && actn != "Hold") {   //the manage screen does not display checkboxes for Cancel or Hold so we will avoid that here as well
                            approveActions.push({ text: actn, value: actn })
                        }
                    }
                }

                if (approveActions.length > 1) {    // checking >1 instead of 0 because of the "Actions" placeholder we put in
                    //Approval actions
                    $('<input required name="' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                            dataTextField: "text",
                            dataValueField: "value",
                            dataSource: approveActions,
                            index: 0,
                            value: "Action",
                            text: "Action",
                            change: function (e) {
                                $scope.broadcast("approval-actions-updated", { newValue: this.value(), dataItem: options.model, gridDS: $scope.contractDs.data() });
                            }
                        });
                } else if (options.model["BID_ACTNS"].length > 1) { // checking >1 because if only 1 available it is meaningless to set to same bid status
                    //Select traditional bid action
                    var ind = options.model["BID_ACTNS"].map(function (e) { return e.BidActnName; }).indexOf(options.model["WF_STG_CD"]);
                    bidActions = angular.copy(options.model["BID_ACTNS"]);  //we create a copy because we do not want what the dropdown to fully databind and potentially allow the user selection to have an effect on their possible bid actions
                    if (ind == -1) ind = 0;
                    $('<input required name="' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                            dataTextField: "BidActnName",
                            dataValueField: "BidActnValue",
                            dataSource: bidActions,
                            index: ind,
                            value: options.model["BID_ACTNS"][ind].BidActnValue,
                            text: options.model["BID_ACTNS"][ind].BidActnName,
                            change: function (e) {
                                $scope.broadcast("bid-actions-updated", { newValue: this.value(), dataItem: options.model, gridDS: $scope.contractDs.data() });
                            }
                        });
                } else {    //no actions possible, just display same
                    el = "<div id='cb_actn_#=data.DC_ID#'>" + gridUtils.getBidActions(options.model) + "</div>";
                    $(el).appendTo(container);
                }
            }

            $scope.createEditEl = function (field, type, dimKey, format) {
                var el = '<div class="dimKey">' + $scope.translateDimKey(dimKey) + ':</div>';
                if (type === "TextBox") {
                    el += '<input ng-model="dataItem.' + field + '[\'' + dimKey + '\']" id="dim_contrl_' + field + '_' + dimKey + '" k-on-change="updateDirty(dataItem, \'' + field + '\')" style="width: 100%;" />';

                } else if (type === "ComboBox") {

                } else if (type === "DropDown") {

                } else if (type === "DatePicker") {

                } else if (type === "Label") {

                } else if (type === "CheckBox") {

                } else if (type === "NumericTextBox") { //2 decimal places used for money
                    el += '<input kendo-numeric-text-box id="dim_contrl_' + field + '_' + dimKey + '" k-min="0" k-decimals="2" k-format="\'n2\'" k-ng-model="dataItem.' + field + '[\'' + dimKey + '\']" k-on-change="updateDirty(dataItem, \'' + field + '\')" style="max-width: 100%; margin:0;" />';
                } else if (type === "IntegerTextBox") { //0 decimal places used for item counts
                    el += '<input kendo-numeric-text-box id="dim_contrl_' + field + '_' + dimKey + '" k-min="0" k-decimals="0" k-format="\'n0\'" k-ng-model="dataItem.' + field + '[\'' + dimKey + '\']" k-on-change="updateDirty(dataItem, \'' + field + '\')" style="max-width: 100%; margin:0;" />';
                } else {
                    el += '<input ng-model="dataItem.' + field + '[\'' + dimKey + '\']" id="dim_contrl_' + field + '_' + dimKey + '" k-on-change="updateDirty(dataItem, \'' + field + '\')" style="width: 100%;" />';
                }

                return el;
            }

            $scope.translateDimKey = function (key) {
                switch (key) {
                    case "20_____1":
                        return "Kit";
                    case "20_____2":
                        return "Sub-Kit";
                    case "20___0":
                        return "Primary";
                    case "20___1":
                        return "Secondary 1";
                    case "20___2":
                        return "Secondary 2";
                    case "20___3":
                        return "Secondary 3";
                    case "20___4":
                        return "Secondary 4";
                    case "20___5":
                        return "Secondary 5";
                    case "20___6":
                        return "Secondary 6";
                    case "20___7":
                        return "Secondary 7";
                    case "20___8":
                        return "Secondary 8";
                    case "20___9":
                        return "Secondary 9";
                    default:
                        return "";
                }
            }

            $scope.filterDealType = function (dealType) {
                var dealTypes = [
                    { dealType: "ECAP", name: "ECAP" },
                    { dealType: "VOL_TIER", name: "Volume Tier" },
                    { dealType: "KIT", name: "Kit" },
                    { dealType: "PROGRAM", name: "Program" }
                ];

                for (var d = 0; d < dealTypes.length; d++) {
                    if (dealType === dealTypes[d].name) {
                        $scope.contractDs.filter({
                            field: "OBJ_SET_TYPE_CD",
                            operator: "eq",
                            value: dealTypes[d].dealType
                        });
                        return true;
                    }
                }
                return false;
            }

            $scope.sendEmail = function () {
                var rootUrl = window.location.protocol + "//" + window.location.host;
                var gridDs = $scope.contractDs.data();
                var items = [];
                for (var i = 0; i <= gridDs.length - 1; i++) {
                    if (gridDs[i].isLinked) {
                        var item = {
                            "CUST_NM": gridDs[i].Customer !== undefined ? gridDs[i].Customer.CUST_NM : "",
                            "VERTICAL_ROLLUP": gridDs[i].PRODUCT_CATEGORIES,
                            "CNTRCT": gridDs[i].CNTRCT_OBJ_SID + " " + gridDs[i].CNTRCT_TITLE,
                            "DC_ID": gridDs[i]._parentIdPS,
                            "NEW_STG": gridDs[i].PS_WF_STG_CD,
                            "DEAL_ID": gridDs[i].DC_ID,
                            "END_CUSTOMER_RETAIL": gridDs[i].END_CUSTOMER_RETAIL,
                            "FOLIO_ID": gridDs[i].CNTRCT_OBJ_SID,
                            "url": rootUrl + "/advancedSearch#/gotoPs/" + gridDs[i]._parentIdPS,
                            "folioUrl": rootUrl + "/Contract#/manager/" + gridDs[i].CNTRCT_OBJ_SID
                        };
                        items.push(item);
                    }
                }
                $rootScope.$broadcast('send-notification', items);
            }

            $scope.copyDeals = function () {
                var rootUrl = window.location.protocol + "//" + window.location.host;
                var gridDs = $scope.contractDs.data();
                var dealIds = [];
                for (var i = 0; i <= gridDs.length - 1; i++) {
                    if (gridDs[i].isLinked) {
                        dealIds.push(gridDs[i].DC_ID);
                    }
                }
                $rootScope.$broadcast('copy-tender-deals', dealIds);
            }

            $scope.showCols = function (grpName) {

                if ($scope.contractDs.filter() !== undefined) $scope.contractDs.filter({});
                $scope.searchFilter = $scope.opOptions["initSearchStr"] === undefined ? "" : $scope.opOptions["initSearchStr"];

                if ($scope.curGroup === grpName) {
                    $scope.ovlpDataSource.filter({});
                }
                if (grpName.toLowerCase() == "overlapping") {
                    $scope.isOverlapping = true;
                    $scope.isLayoutConfigurablePrev = $scope.isLayoutConfigurable;
                    $scope.isLayoutConfigurable = false;
                }
                else {
                    $scope.isOverlapping = false;
                    $scope.isLayoutConfigurable = $scope.isLayoutConfigurablePrev;
                    $scope.ovlpDataSource.filter({});
                }

                if (grpName.toLowerCase() == "subkit") {
                    $scope.contractDs.filter({
                        field: "HAS_SUBKIT",
                        operator: "eq",
                        value: "1"
                    });
                }

                $scope.filterDealType(grpName);

                var c;
                var colNames = [];
                $scope.curGroup = grpName;

                for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                    var item = $scope.opOptions.groups[g];
                    if (item.name === grpName || item.isPinned)
                        angular.forEach($scope.opOptions.groupColumns, function (v, k) {
                            if (v.Groups.indexOf(item.name) >= 0 && this.indexOf(item.name) < 0) this.push(k);
                        }, colNames);
                }

                var useKendo = true;

                if (useKendo) {
                    // KENDO WAY... but it is slow

                    if (grpName === "All") {
                        for (c = 0; c < $scope.grid.columns.length; c++) {
                            $scope.grid.showColumn(c);
                        }

                    } else {

                        //hide all columns -- NOTE the one by one SHOW/HIDE columns is an expensive call... spend more time determining if we need to actually make the call
                        if (!!$scope.grid && !!$scope.grid.columns) {
                            for (c = 0; c <= $scope.grid.columns.length; c++) {
                                if ($scope.grid.columns[c] !== undefined && $scope.grid.columns[c].field !== "") {

                                    if (colNames.indexOf($scope.grid.columns[c].field) >= 0) {
                                        // show column
                                        if ($scope.grid.columns[c].hidden !== undefined && $scope.grid.columns[c].hidden === true) {
                                            $scope.grid.showColumn(c);
                                        }
                                    } else {
                                        // hide column
                                        if ($scope.grid.columns[c].hidden === undefined || $scope.grid.columns[c].hidden === false) {
                                            $scope.grid.hideColumn(c);
                                        }
                                    }

                                }
                            }
                        }

                        //show columns in list
                        //for (c = 0; c < colNames.length; c++) {
                        //    $scope.grid.showColumn(colNames[c]);
                        //}
                    }
                    $scope.grid.resize();
                    // Hack to resize grid
                    if (grpName.toLowerCase() != "subkit") {
                        //TODO: rather than not calling the timeout for subkit grpname, we should probably find a more elegant way to combine filters
                        $timeout(function () { $scope.searchGrid(); });
                    }
                } else {

                    if (grpName === "All") {
                        for (c = 0; c < $scope.grid.columns.length; c++) {
                            $scope.grid.showColumn(c);
                        }

                    } else {

                        if (!!$scope.grid && !!$scope.grid.columns) {
                            for (c = 0; c <= $scope.grid.columns.length; c++) {
                                if ($scope.grid.columns[c] !== undefined && $scope.grid.columns[c].field !== "") {
                                    $scope.grid.columns[c].hidden = colNames.indexOf($scope.grid.columns[c].field) < 0;
                                }
                            }
                        }

                        $scope.grid.setOptions({
                            columns: $scope.grid.columns
                        });
                        //$scope.grid.setOptions(originalOptions);

                        //$scope.grid.refresh();
                        //debugger;
                        //$scope.grid.setOptions({
                        //    columns: $scope.grid.columns
                        //});
                    }
                    $scope.grid.resize();

                }

            }

            $scope.passThoughFunc = function (func, dataItem, arg1, arg2) {
                if (func === undefined || func === null) return null;
                return func(dataItem, arg1, arg2);
            }

            $scope.broadcast = function (broadcastCommand, dataItem) {
                $scope.$root.$broadcast(broadcastCommand, dataItem);
            }

            $scope.saveFunctions = function (model, col, newVal) {
                if (col == "tender_actions") return;    //tender actions operate separetely from the grid in the tender dashboard if the user selects an action they are either doing nothing or triggering an independent save event that will reset the dirty flags anyways and so do not need the dirty flag modifiers to trigger. same chain of thought applies to linked deals and tender deals cannot be grouped so nothing in this function needs to execute.

                model.dirty = true;
                $scope._dirty = true;
                $scope.root._dirty = true;

                $scope.root.saveCell(model, col, $scope, newVal);

                if (model.isLinked !== undefined && model.isLinked) {
                    $scope.syncLinked(col, newVal);
                }

                if (model._parentCnt !== undefined && model._parentCnt > 1) {
                    $scope.syncGrouped(col, newVal, model);
                }
            }

            $scope.syncLinked = function (newField, newValue) {
                var data = $scope.contractDs.view();
                for (var v = 0; v < data.length; v++) {
                    var dataItem = data[v];
                    if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                        $scope.applySaveCell(dataItem, newField, newValue);
                    }
                }
            }

            $scope.syncGrouped = function (newField, newValue, model) {
                var data = $scope.contractDs.data();  // must be data instead of view.  This MUST cross paging
                var groupId = model.DC_PARENT_ID;
                for (var v = 0; v < data.length; v++) {
                    var dataItem = data[v];
                    if (dataItem.DC_PARENT_ID === groupId) {
                        $scope.applySaveCell(dataItem, newField, newValue);
                    }
                }
            }

            $scope.applySaveCell = function (dataItem, newField, newValue) {
                if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                if (dataItem._behaviors.isReadOnly === undefined) dataItem._behaviors.isReadOnly = {};
                if (dataItem._behaviors.isReadOnly[newField] === undefined || dataItem._behaviors.isReadOnly[newField] === false) {
                    if (dataItem._behaviors.isHidden === undefined) dataItem._behaviors.isHidden = {};
                    if (dataItem._behaviors.isHidden[newField] === undefined || dataItem._behaviors.isHidden[newField] === false) {
                        if (dataItem[newField] !== newValue) dataItem.set(newField, newValue);
                        $scope.root.saveCell(dataItem, newField, $scope, newValue);
                    }
                }
                //disableCellsBasedOnAnotherCellValue(dataItem, newField, newValue, "DEAL_COMB_TYPE", "DEAL_GRP_EXCLDS", isDisableViaDealGrp); // TODO: hard coded sadness.
            }

            $scope.$on('refresh', function (event, args) {
            });

            $scope.$on('requestOpGridDirtyRows', function (event, args) {
                var rows = [];
                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (data[d]._dirty !== undefined && data[d]._dirty === true) rows.push(data[d]);
                }
                $scope.$root.$broadcast('receiveOpGridDirtyRows', rows);
            });

            $scope.$on('resetOpGridDirtyRows', function (event, args) {
                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    data[d].set("_dirty", false);
                }
            });

            $scope.$on('refreshStage', function (event, args) {
                if (!!args) {
                    $scope.syncAllActions(args);
                }
            });
            $scope.syncAllActions = function (dataItems) {
                var arActions = ["Approve", "Reject", "Hold", "Cancel"];

                for (var a = 0; a < arActions.length; a++) {
                    var actionItems = dataItems[arActions[a]];
                    if (actionItems !== undefined && actionItems !== null) {
                        for (var i = 0; i < actionItems.length; i++) {
                            var dataItem = $scope.findDataItemById(actionItems[i]["DC_ID"]);
                            if (dataItem !== undefined && dataItem !== null) {
                                if (actionItems[i]["WF_STG_CD"] !== undefined) dataItem["WF_STG_CD"] = actionItems[i]["WF_STG_CD"];
                                if (actionItems[i]["PS_WF_STG_CD"] !== undefined) dataItem["PS_WF_STG_CD"] = actionItems[i]["PS_WF_STG_CD"];
                                if (arActions[a] === "Cancel") {
                                    if (dataItem["_behaviors"] === undefined) dataItem["_behaviors"] = {};
                                    if (dataItem["_behaviors"]["isReadOnly"] === undefined) dataItem["_behaviors"]["isReadOnly"] = {};
                                    // force everything readonly
                                    var fields = $scope.opOptions.columns;
                                    for (var f = 0; f < fields.length; f++) {
                                        dataItem["_behaviors"]["isReadOnly"][fields[f].field] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            $scope.$on('saveComplete', function (event, args) {
                // need to clean out all flags... dirty, error, validMsg
                $scope.cleanFlags();

                // clear out checkboxes
                $.each($scope.grid.columns, function () {
                    $("input.grid-link-checkbox").prop("checked", false);
                });

                if (!!args.WIP_DEAL) {
                    for (var i = 0; i < args.WIP_DEAL.length; i++) {
                        var dataItem = $scope.findDataItemById(args.WIP_DEAL[i]["DC_ID"]);
                        if (!!dataItem) {
                            dataItem["PASSED_VALIDATION"] = args.WIP_DEAL[i]["PASSED_VALIDATION"];
                            dataItem["REBATE_BILLING_START"] = args.WIP_DEAL[i]["REBATE_BILLING_START"];
                            dataItem["REBATE_BILLING_END"] = args.WIP_DEAL[i]["REBATE_BILLING_END"];
                            dataItem["WF_STG_CD"] = args.WIP_DEAL[i]["WF_STG_CD"];
                            dataItem["PS_WF_STG_CD"] = args.WIP_DEAL[i]["PS_WF_STG_CD"];
                            dataItem["TRKR_NBR"] = args.WIP_DEAL[i]["TRKR_NBR"];
                            dataItem["IN_REDEAL"] = args.WIP_DEAL[i]["IN_REDEAL"];
                            dataItem["AVG_RPU"] = args.WIP_DEAL[i]["AVG_RPU"];
                            dataItem["MAX_RPU"] = args.WIP_DEAL[i]["MAX_RPU"];
                            dataItem["EXPIRE_FLG"] = args.WIP_DEAL[i]["EXPIRE_FLG"];
                            dataItem["_behaviors"] = args.WIP_DEAL[i]["_behaviors"];
                            dataItem["_dirty"] = false;
                            dataItem["isLinked"] = false;
                        }
                    }
                }
            });

            $scope.$on('saveWithWarnings', function (event, args) {
                // need to clean out all flags... dirty, error, validMsg
                $scope.cleanFlags();

                // need to set all flags... dirty, error, validMsg
                if (!!args.WIP_DEAL) {
                    for (var i = 0; i < args.WIP_DEAL.length; i++) {
                        var dataItem = $scope.findDataItemById(args.WIP_DEAL[i]["DC_ID"]);
                        if (!!dataItem) {
                            dataItem["PASSED_VALIDATION"] = args.WIP_DEAL[i]["PASSED_VALIDATION"];
                            dataItem["WF_STG_CD"] = args.WIP_DEAL[i]["WF_STG_CD"];
                            dataItem["PS_WF_STG_CD"] = args.WIP_DEAL[i]["PS_WF_STG_CD"];
                            dataItem["TRKR_NBR"] = args.WIP_DEAL[i]["TRKR_NBR"];
                            dataItem["IN_REDEAL"] = args.WIP_DEAL[i]["IN_REDEAL"];
                            dataItem["AVG_RPU"] = args.WIP_DEAL[i]["AVG_RPU"];
                            dataItem["MAX_RPU"] = args.WIP_DEAL[i]["MAX_RPU"];
                            dataItem["EXPIRE_FLG"] = args.WIP_DEAL[i]["EXPIRE_FLG"];
                            dataItem["_behaviors"] = args.WIP_DEAL[i]["_behaviors"];
                        }

                        if (args.WIP_DEAL[i].warningMessages !== undefined && args.WIP_DEAL[i].warningMessages.length !== 0) {
                            var beh = args.WIP_DEAL[i]._behaviors;
                            if (!beh) beh = {};
                            if (beh.isError === undefined) beh.isError = {};
                            if (beh.validMsg === undefined) beh.validMsg = {};

                            if (dataItem != null) {
                                Object.keys(beh.isError).forEach(function (key, index) {
                                    if (tierAtrbs.contains(key) && !!dataItem.NUM_OF_TIERS) {
                                        // Is a Rate Breakout column, so set to the parent attribute so that validations badge increments correctly because tiered attirbutes are not in the model
                                        var tempKey = "TIER_NBR";
                                        dataItem._behaviors.isError[tempKey] = true;
                                    } else {
                                        dataItem._behaviors.isError[key] = beh.isError[key];
                                        dataItem._behaviors.validMsg[key] = beh.validMsg[key];
                                    }
                                    $scope.increaseBadgeCnt(key);

                                },
                                    beh.isError);
                            }
                        }
                    }

                    $scope.validateGrid();
                }

            });

            $scope.$on('saveOpGridData', function (event, args) {
                $timeout(function () {
                    util.console("contractDs.sync Started");
                    $scope.contractDs.sync();
                    util.console("contractDs.sync Ended");
                    $scope.root.saveEntireContract();
                }, 100);
            });

            $scope.increaseBadgeCnt = function (key) {
                if ($scope.opOptions.groupColumns[key] === undefined) return;
                for (var i = 0; i < $scope.opOptions.groupColumns[key].Groups.length; i++) {
                    for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                        if ($scope.opOptions.groups[g].name === $scope.opOptions.groupColumns[key].Groups[i] || $scope.opOptions.groups[g].name === "All") {
                            $scope.opOptions.groups[g].numErrors++;
                        }
                    }
                }
            }

            $scope.showBool = function (val) {
                return val === "1" ? "Yes" : " ";
            }

            $scope.findDataItemById = function (id) {
                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (!!data[d]["DC_ID"] && data[d]["DC_ID"] === id) return data[d];
                }
                return null;
            }

            $scope.addRow = function (scope, dataItem) {
                var data = scope.contractDs.data();
                data.unshift(dataItem);
                data[0].dirty = true;  // tell datasource something changed
                scope.contractDs.sync();
            }

            $scope.removeRow = function (scope, ptrId) {
                var row = null;
                var data = scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (data[d].DC_PARENT_ID === ptrId) row = data[d];
                }
                if (!!row) data.splice(data.indexOf(row), 1);
                if (data.length === 0) {
                    $scope.$root.$broadcast('refreshNoWipData', true);
                } else {
                    scope.contractDs.sync();
                }
            }

            $scope.$on('syncDs', function (event, args) {
                event.currentScope.contractDs.sync();
            });

            $scope.$on('addRow', function (event, args) {
                $scope.addRow(event.currentScope, args);
            });

            $scope.$on('removeRow', function (event, ptrId) {
                $scope.removeRow(event.currentScope, ptrId);
            });

            $scope.$on('updateGroup', function (event, msgs) {
                if (!msgs) return;
                var data = $scope.contractDs.data();

                for (var m = 0; m < msgs.length; m++) {
                    var dcId = msgs[m].KeyIdentifiers[0];
                    var dcParentId = msgs[m].KeyIdentifiers[1];
                    var dcPrdTitle = msgs[m].ExtraDetails[0];
                    var dcKitName = msgs[m].ExtraDetails[1];

                    for (var d = 0; d < data.length; d++) {
                        if (data[d].DC_ID === dcId) {
                            data[d].DC_PARENT_ID = dcParentId;
                            data[d]._parentCnt = 1;
                            data[d].PTR_USER_PRD = dcPrdTitle;
                            if (dcKitName != "") {
                                data[d].DEAL_GRP_NM = dcKitName;
                            }
                        }
                    }
                }

                event.currentScope.contractDs.sync();
            });

            $scope.$on('searchOpGrid', function (event, searchStr) {
                $scope.searchFilter = searchStr;
                $scope.searchGrid();
            });

            $scope.cleanFlags = function () {
                $scope.clearBadges();

                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    var beh = data[d]._behaviors;

                    // clear items for this row
                    beh.isError = {};
                    beh.validMsg = {};
                    beh.isDirty = {};
                }

                $scope._dirty = false;
                $scope.root._dirty = false;
            }

            $scope.saveWipDeals = function () {
                if (!$scope._dirty) return;

                $scope.root.setBusy("Saving your data..", "Please wait while saving data.");
                $timeout(function () {
                    util.console("contractDs.sync Started");
                    $scope.contractDs.sync();
                    util.console("contractDs.sync Ended");
                    $scope.root.saveEntireContract();
                }, 100);
            }

            $scope.toggleTerms = function () {
                $scope.root.toggleTerms();
            }

            $scope.backToPricingTable = function () {
                $scope.root.backToPricingTable();
            }

            $scope.clearBadges = function () {
                var grps = $scope.opOptions.groups;
                angular.forEach(grps, function (value, key) {
                    grps[key].numErrors = 0;
                });
            }

            $scope.validateGrid = function () {
                var valid = true;

                // clear out badges
                $scope.clearBadges();

                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (!$scope.validateRow(data[d], $scope)) valid = false;
                }

                return valid;
            }

            $scope.toggleWrap = function () {
                var gridEl = $scope.elGrid;
                $scope.wrapEnabled = !$scope.wrapEnabled;
                var newVal = $scope.wrapEnabled ? "normal" : "nowrap";
                var newH = $scope.wrapEnabled ? "100%" : "auto";

                $(gridEl).find(".ng-binding").css("white-space", newVal);
                $(gridEl).find(".ng-binding").css("height", newH);
                $timeout(function () {
                    $scope.grid.autoFitColumn(2);
                }, 0);
            }

            $scope.clkSearchGrid = function (e) {
                if (e.keyCode === 13)
                    $scope.searchGrid();
            }

            $scope.searchGrid = function () {

                var tab = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                var searchValue = $scope.searchFilter;

                if (tab !== undefined && tab !== null && tab.select().text().indexOf('Overlapping') > -1) {
                    if (searchValue.length < 3) {
                        $scope.ovlpDataSource.filter({});
                        return;
                    }

                    $scope.ovlpDataSource.filter({
                        logic: "or",
                        filters: [
                            {
                                field: "OVLP_DEAL_OBJ_SID",
                                operator: "contains",
                                value: searchValue
                            }, {
                                field: "WF_STG_CD",
                                operator: "contains",
                                value: searchValue
                            }, {
                                field: "PRODUCT_NM",
                                operator: "contains",
                                value: searchValue
                            }
                        ]
                    });
                }
                else {
                    if (searchValue.length < 3) {
                        // This breaks the tab filtering
                        $scope.clearSearchGrid();
                        return;
                    }

                    $scope.contractDs.filter({
                        logic: "or",
                        filters: [
                            {
                                field: "DC_ID",
                                operator: "eq",
                                value: searchValue
                            }, {
                                field: "WF_STG_CD",
                                operator: "contains",
                                value: searchValue
                            }, {
                                field: "PTR_USER_PRD",
                                operator: "contains",
                                value: searchValue
                            }, {
                                field: "TITLE",
                                operator: "contains",
                                value: searchValue
                            }, {
                                field: "NOTES",
                                operator: "contains",
                                value: searchValue
                            }
                        ]
                    });
                }

            }

            $scope.clearSearchGrid = function () {
                if (!$scope.filterDealType($scope.curGroup)) {
                    $scope.contractDs.filter({});
                }
            }

            $scope.addToTab = function (data) {
                $scope.opOptions.groups.push({ "name": data, "order": 50, "numErrors": 0 });

                // Add Tools
                if ($scope.opOptions.groupColumns.tools.Groups === undefined) $scope.opOptions.groupColumns.tools.Groups = [];
                $scope.opOptions.groupColumns.tools.Groups.push(data);

                // Add Deal Details
                if ($scope.opOptions.groupColumns.details.Groups === undefined) $scope.opOptions.groupColumns.details.Groups = [];
                $scope.opOptions.groupColumns.details.Groups.push(data);

                $scope.alignGroupOrder();

                $scope.$applyAsync();

                $timeout(function () {
                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                    tabStrip.reload();

                    // Select the tab that was added, and then update which columns are shown.
                    // TODO:TJE - Need to test name w/ all special charaters to see if any of them break this code.
                    tabStrip.select("li:contains('" + data + "')");
                    $scope.showCols(data);

                    $scope.configureSortableTab();
                }, 100);
            }

            // Selecting Overlapping Tab
            $scope.selectOverlappingTab = function () {
                $timeout(function () {
                    // select the Overlapping column
                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                    tabStrip.select("li:contains('Overlapping')");
                }, 10);
            }

            //Accept Overlapping
            $scope.acceptOvlp = function (data, YCS2_OVERLAP_OVERRIDE) {
                var tempdata = $scope.ovlpData;
                var START_DT = '';
                var END_DT = '';
                var dcID = 0;

                for (var i = 0; i < tempdata.length; i++) {
                    if (tempdata[i].WIP_DEAL_OBJ_SID == data && tempdata[i].WF_STG_CD == "Draft" && tempdata[i].OVLP_CD == "SELF_OVLP") {
                        START_DT = tempdata[i].START_DT;
                        END_DT = tempdata[i].END_DT;
                    }
                }
                for (var i = 0; i < tempdata.length; i++) {
                    if (tempdata[i].WIP_DEAL_OBJ_SID == data && tempdata[i].WF_STG_CD == "Active" && tempdata[i].OVLP_CD == "FE_HARD_STOP") {
                        if (YCS2_OVERLAP_OVERRIDE == 'Y') {
                            var d = new Date(START_DT);
                            dcID = tempdata[i].OVLP_DEAL_OBJ_SID;
                            d.setDate(d.getDate() - 1);
                            if (d >= new Date(tempdata[i].START_DT)) {
                                var tempEND_DT = d.getMonth("MM") + 1 + "/" + d.getDate() + "/" + d.getFullYear();
                                $scope.ovlpData[i].END_DT = "<span style='color:red'> " + tempEND_DT + " - Pending </span>";
                            }
                            else {
                                var dO = new Date(END_DT);
                                dO.setDate(dO.getDate() + 1);
                                var tempSTART_DT = dO.getMonth("MM") + 1 + "/" + dO.getDate() + "/" + dO.getFullYear();
                                $scope.ovlpData[i].START_DT = "<span style='color:red'> " + tempSTART_DT + " - Pending </span>";
                            }
                        }
                        else {
                            $scope.ovlpData[i].START_DT = $scope.ovlpDataRep[i].START_DT;
                            $scope.ovlpData[i].END_DT = $scope.ovlpDataRep[i].END_DT;
                        }

                    }
                }
                $scope.ovlpDataSource.read();

                objsetService.updateOverlappingDeals(data, YCS2_OVERLAP_OVERRIDE)
                    .then(function (response) {
                        if (response.data[0].PRICING_TABLES > 0) {
                            // Change in Deal Editor
                            // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
                            var indx = -1;
                            $scope.opData.some(function (e, i) {
                                if (e.DC_ID === data) {
                                    indx = i;
                                    return true;
                                }
                            });

                            if (indx > -1) {
                                $scope.opData[indx].YCS2_OVERLAP_OVERRIDE = YCS2_OVERLAP_OVERRIDE == 'Y' ? 'Y' : 'N';
                                $scope.contractDs.read();
                            }

                            if (YCS2_OVERLAP_OVERRIDE === 'N') {
                                $scope.ovlpErrorCount.push(data);
                            }
                            else {
                                if ($scope.ovlpErrorCount.indexOf(data) > -1) {
                                    $scope.ovlpErrorCount.splice($scope.ovlpErrorCount.indexOf(data), 1);
                                }
                            }

                            var grps = $scope.opOptions.groups;
                            //var indx = grps.findIndex(item => item.name == 'Overlapping');

                            // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
                            var indx = -1;
                            grps.some(function (e, i) {
                                if (e.name == 'Overlapping') {
                                    indx = i;
                                    return true;
                                }
                            });

                            grps[indx].numErrors = $scope.ovlpErrorCount.length;
                            $scope.ovlpDataSource.read();

                        } else {
                            return false;
                        }
                    });
            }

            //Reject
            $scope.rejectOvlp = function (OVLP_DEAL_OBJ_SID) {
                kendo.alert("Please <b>edit</b> and <b>re-validate</b> your deal to avoid overlapping with other deals");
                var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                tabStrip.select(0);
                $scope.showCols($scope.opOptions.groups[0].name);
                $scope.searchFilter = OVLP_DEAL_OBJ_SID;
                $timeout(function () { $scope.searchGrid(); });
            }


            // Go to Deal Details
            $scope.gotoDealDetails = function (dataItem) {
                var sid = $scope.parentRoot.curPricingTable;
                if (dataItem.OVLP_CD == "SELF_OVLP" || dataItem.PRICING_TABLES === $scope.parentRoot.curPricingTable.DC_ID) {
                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                    tabStrip.select(0);
                    $scope.showCols($scope.opOptions.groups[0].name);
                    $scope.searchFilter = dataItem.OVLP_DEAL_OBJ_SID;
                    $timeout(function () { $scope.searchGrid(); });
                }
                else {
                    var win = window.open("Contract#/manager/" + dataItem.CONTRACT_NBR + "/" + dataItem.PRICE_STRATEGY + "/" + dataItem.PRICING_TABLES + "/wip?searchTxt=" + dataItem.WIP_DEAL_OBJ_SID, '_blank');
                    win.focus();
                }

            }

            //Overlapping GRID
            $scope.ovlpDataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        e.success($scope.ovlpData);
                    },
                },
                error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                },
                schema: {
                    model: {
                        id: "CONTRACTNUMBER",
                        fields: {
                            "PROGRAM_PAYMENT": {
                                type: "string"
                            },
                            "CONTRACTNUMBER": {
                                type: "number"
                            },
                            "OVLP_DEAL_OBJ_SID": {
                                type: "string",
                                editable: false
                            },
                            "WIP_DEAL_OBJ_SID": {
                                type: "number",
                                editable: false
                            },
                            "WF_STG_CD": {
                                type: "string",
                                editable: false
                            },
                            "CUST_ACCNT_DIV": {
                                type: "string",
                                editable: false
                            },
                            "PRODUCT_NM": {
                                type: "string",
                                editable: false
                            },
                            "GEO_COMBINED": {
                                type: "string",
                                editable: false
                            },
                            "SOLD_TO_ID": {
                                type: "string",
                                editable: false
                            },
                            "START_DT": {
                                type: "stirng",
                                editable: false
                            },
                            "END_DT": {
                                type: "string",
                                editable: false
                            },
                            "ECAP_PRICE": {
                                type: "number",
                                editable: false
                            },
                            "DEAL_COMB_TYPE": {
                                type: "string",
                                editable: false
                            },
                            "ECAP_TYPE": {
                                type: "string",
                                editable: false
                            },
                            "MRKT_SEG": {
                                type: "string",
                                editable: false
                            },
                            "OVLP_CD": {
                                type: "string",
                                editable: false
                            }
                        }
                    }
                },
                pageSize: 25,
                group: [{ field: "PROGRAM_PAYMENT" }, { field: "WIP_DEAL_OBJ_SID", aggregates: [{ field: "WIP_DEAL_OBJ_SID", aggregate: "count" }] }]
            });

            $scope.ovlp = {
                dataSource: $scope.ovlpDataSource,
                scrollable: true,
                sortable: true,
                editable: false,
                navigatable: true,
                filterable: true,
                resizable: true,
                reorderable: true,
                pageable: {
                    refresh: true,
                    pageSizes: [25, 50, 100, 250, 500],
                    buttonCount: 5
                },
                columns: [
                    {
                        field: "WF_STG_CD",
                        filterable: false,
                        template: "<div class='fl gridStatusMarker #=WF_STG_CD#' title='#=WF_STG_CD#'>{{stageOneChar(dataItem.WF_STG_CD)}}</div>",
                        title: " ",
                        width: "21px"
                    },
                    {
                        field: "PROGRAM_PAYMENT",
                        title: "Type",
                        width: "120px",
                        filterable: { multi: true, search: true },
                        groupHeaderTemplate: function (e) {
                            if (e.value === "Frontend YCS2") {
                                return "<span style='font-weight:bold;font-size:13px; color: red;letter-spacing:0.07em '>Front End Overlap</span>";
                            }
                            else {
                                return "<span style='font-weight:bold;font-size:13px; color: red;letter-spacing:0.07em '>Billings Overlap</span>";
                            }
                        },
                        hidden: true
                    },
                    {
                        field: "WIP_DEAL_OBJ_SID",
                        title: "Contract",
                        width: "120px",
                        groupHeaderTemplate: function (e) {
                            var hasResolved = false;
                            var cnt = 0;
                            var groupRow = $filter("where")($scope.ovlpDataSource._data, { 'WIP_DEAL_OBJ_SID': e.value, 'PROGRAM_PAYMENT': 'Frontend YCS2' });
                            if (groupRow.length > 1) {

                                if ($filter("where")(groupRow, { 'WF_STG_CD': 'Draft' }).length > 1) {
                                    cnt = groupRow.length;
                                }
                                else if ($filter("where")(groupRow, { 'WF_STG_CD': 'Draft' }).length == 1) {
                                    cnt = 1;
                                }
                                else {
                                    cnt = 2;
                                }

                            }
                            if ($scope.ovlpErrorCount.indexOf(e.value) > -1) {
                                hasResolved = true;
                            }

                            if (hasResolved && cnt > 0 && cnt == 1 && $scope.isOvlpAccess) {
                                return "<span class=\"grpTitle\" style='font-weight:bold'>" +
                                    e.value +
                                    "</span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was located matching an Active or Draft deal.  In order to be able to create this new deal, the System will need to change the End date of the deal.  Is that ok?</span>&nbsp;<span class='lnk btnYes' ng-click='acceptOvlp(" +
                                    e.value +
                                    ",\"Y\")'><i class='intelicon-check' style='font-size: 12px !important;'></i> Yes </span > <span class='or'>&nbsp;OR&nbsp;</span> <span class='lnk btnNo' ng-click='rejectOvlp(" +
                                    e.value +
                                    ")'><i class='intelicon-close-max' style='font-size: 10px !important;padding-right: 3px;'></i>&nbsp;No</span>";
                            }
                            else if (hasResolved && cnt > 1 && $scope.isOvlpAccess) {
                                return "<span class=\"grpTitle\" style='font-weight:bold'>" +
                                    e.value +
                                    " </span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was located matching another Draft deal.  Please correct and revalidate.</span>&nbsp;<span class='lnk btnYes' ng-click='rejectOvlp(" +
                                    e.value +
                                    ")'><i class='intelicon-check' style='font-size: 12px !important;'></i>Yes</span>";
                            }
                            else if (!hasResolved) {
                                return "<span class=\"grpTitle\" style='font-weight:bold'>" +
                                    e.value +
                                    " </span><i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;'>An overlap was located matching an Active or Draft deal.  In order to be able to create this new deal, the System will need to change the End date of the deal.  Is that ok?</span>&nbsp;<span class='undolnk' ng-click='acceptOvlp(" +
                                    e.value +
                                    ", \"N\")'><i class='intelicon-home-outlined intelicon-undo' style='font-size: 10px !important;padding-right: 3px;'></i>Undo</span>";
                            }
                            else {
                                return "<span class=\"grpTitle\" style='font-weight:bold'>" +
                                    e.value +
                                    " </span> <i class='intelicon-arrow-back-left skyblue pl10'></i> <span class='grpDesc' style='font-weight:bold;letter-spacing:0.07em '>Please correct and revalidate.</span>";
                            }

                        },
                        filterable: { multi: true, search: true },
                        hidden: true
                    },
                    {
                        field: "OVLP_DEAL_OBJ_SID",
                        title: "Deal #",
                        template: "#= OVLP_DEAL_OBJ_SID #",
                        width: "80px",
                        template: "<div class='ovlpCell'><a ng-click='gotoDealDetails(dataItem)' class='btnDeal'> #= OVLP_DEAL_OBJ_SID # </a></div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "CONTRACT_NBR",
                        title: "Contract",
                        template: "<div class='ovlpCell' title='#= CONTRACT_NM # ( #= CONTRACT_NBR # )'>#= CONTRACT_NM # ( #= CONTRACT_NBR # )</div>",
                        width: "120px",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "PRICE_STRATEGY",
                        title: "Pricing Strategy",
                        template: "<div class='ovlpCell' title='#= PRICE_STRATEGY_NM # ( #= PRICE_STRATEGY # )'>#= PRICE_STRATEGY_NM # ( #= PRICE_STRATEGY # )</div>",
                        width: "120px",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "PRICING_TABLES",
                        title: "Pricing Table",
                        template: "<div class='ovlpCell' title='#= PRICING_TABLES_NM # ( #= PRICING_TABLES # )'>#= PRICING_TABLES_NM # ( #= PRICING_TABLES # )</div>",
                        width: "120px",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "WF_STG_CD",
                        title: "Stage",
                        width: "80px",
                        template: "<div class='ovlpCell'> #= WF_STG_CD # </div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "CUST_ACCNT_DIV",
                        title: "Customer Division",
                        width: "120px",
                        template: "<div class='ovlpCell'> #= CUST_ACCNT_DIV # </div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "PRODUCT_NM",
                        title: "My Deals Product",
                        width: "120px",
                        template: "<div class='ovlpCell' title='#= PRODUCT_NM #'>#= PRODUCT_NM #</div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "GEO_COMBINED",
                        title: "Geo",
                        width: "100px",
                        template: "<div class='ovlpCell' title='#= GEO_COMBINED #'> #= GEO_COMBINED # </div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "SOLD_TO_ID",
                        title: "Sold To ID",
                        width: "120px",
                        template: "<div class='ovlpCell' title='#= SOLD_TO_ID #'> #= SOLD_TO_ID # </div>",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "START_DT",
                        title: "Deal Start Date",
                        width: "120px",
                        template: "<div class='ovlpCell'> #= kendo.toString(START_DT) # </div>",
                        groupable: false
                    },
                    {
                        field: "END_DT",
                        title: "Deal End Date",
                        width: "120px",
                        template: "<div class='ovlpCell'> #= kendo.toString(END_DT) # </div>",
                        groupable: false
                    },
                    {
                        field: "ECAP_PRICE",
                        title: "ECAP Price",
                        width: "120px",
                        template: "<div class='ovlpCell' ng-bind='(dataItem.ECAP_PRICE | currency)' title='#= ECAP_PRICE #'> #= kendo.parseFloat(ECAP_PRICE) # </div>",
                        format: "{0:c}",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "DEAL_COMB_TYPE",
                        title: "Additive",
                        template: "<div class='ovlpCell' title='#= DEAL_COMB_TYPE #'> #= DEAL_COMB_TYPE # </div>",
                        width: "120px",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "ECAP_TYPE",
                        title: "ECAP Type",
                        template: "<div class='ovlpCell' title='#= ECAP_TYPE #'> #= ECAP_TYPE # </div>",
                        width: "150px",
                        filterable: { multi: true, search: true }
                    },
                    {
                        field: "MRKT_SEG",
                        title: "Market Segment",
                        template: "<div class='ovlpCell' title='#= MRKT_SEG #'> #= MRKT_SEG # </div>",
                        width: "150px",
                        filterable: { multi: true, search: true }
                    }
                ]
            };
            $scope.addTabRequired = function () {
                var data = "Overlapping";
                var tabItems = $scope.opOptions.groups;
                var tabFound = false;
                for (var j = 0; j < tabItems.length; j++) {
                    if (tabItems[j].name == data) {
                        tabFound = true;
                        break;
                    }
                }
                if (!tabFound) {
                    $scope.addToTab(data);
                }
                $scope.selectOverlappingTab();
            }

            $scope.ovlpErrorCounter = function (data) {
                $scope.ovlpErrorCount = [];
                var grps = $scope.opOptions.groups;
                var rowCount = $filter('unique')(data, 'WIP_DEAL_OBJ_SID');
                for (var z = 0; z < rowCount.length; z++) {
                    $scope.ovlpErrorCount.push(rowCount[z].WIP_DEAL_OBJ_SID);
                }

                // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
                var indx = -1;
                grps.some(function (e, i) {
                    if (e.name == 'Overlapping') {
                        indx = i;
                        return true;
                    }
                });
                grps[indx].numErrors = rowCount.length;
            }

            //Remove Overlap TAB
            $scope.removeOverlapTab = function () {
                var grps = $scope.opOptions.groups;

                // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
                var indx = -1;
                grps.some(function (e, i) {
                    if (e.name === 'Overlapping') {
                        indx = i;
                        return true;
                    }
                });

                if (indx > -1) {
                    $scope.opOptions.groups.splice(indx, 1);
                }

                if ($scope.opOptions.groupColumns.tools !== undefined) {
                    var tabData = $scope.opOptions.groupColumns.tools.Groups;
                    var indxTab = tabData.indexOf('Overlapping');
                    if (indx > -1) {
                        $scope.opOptions.groupColumns.tools.Groups.splice(indxTab, 1);

                        $scope.$applyAsync();

                        $timeout(function () {
                            $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                            $scope.configureSortableTab();
                        },
                            100);
                    }
                }
            }


            $scope.objSids = [];
            $scope.objType = "PricingTable";
            $scope.openOverlappingDealCheck = function () {
                if ($scope.parentRoot.curPricingTable) {
                    var pricingTableId = $scope.parentRoot.curPricingTable.DC_ID;
                    $scope.objSids = [pricingTableId];
                    $scope.objType = "PricingTable";
                    var html = "<overlapping-deals obj-sids='objSids' obj-type='objType' style='height: 100%;'></overlapping-deals>";
                    var template = angular.element(html);
                    $compile(template)($scope);

                    $("#smbWindow").html(template);

                    $("#smbWindow").kendoWindow({
                        width: "800px",
                        height: "500px",
                        title: "Overlapping Deals",
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

            }

            $scope.overlappingDealsSetup = function () {
                // Moved this block up before Overlap return to re-include the perf block rendering that was displaced.
                $timeout(function () {
                    if ($scope.$root.pc && $scope.$root.pc !== null) {
                        $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                        $scope.$root.pc = null;
                    }
                }, 2000);
                return;

                // comment this out for now until we prove this works.

                var dealType = $scope.dealTypes[0];
                if (dealType.toUpperCase() === "ECAP" && $scope.isOverlapNeeded) {
                    var pcService = new perfCacheBlock("Overlapping Check", "MT");

                    util.console("Overlapping Deals Started");
                    $scope.$parent.$parent.setBusy("Overlapping Deals...", "Looking for Overlapping Deals!");
                    if (usrRole === "GA" || usrRole === "FSE") {
                        $scope.isOvlpAccess = true;
                    }
                    //Fetch Overlapping Data
                    var pricingTableID = $scope.parentRoot.curPricingTable.DC_ID;

                    //Calling WEBAPI
                    objsetService.getOverlappingDealsFromPricingTable(pricingTableID)
                        .then(function (response) {
                            pcService.addPerfTimes(response.data.PerformanceTimes);

                            var pcUi = new perfCacheBlock("Overlapping Tab Processing", "UI");
                            util.console("Overlapping Deals Returned");
                            if (response.data) {
                                var data = response.data.Data;
                                if (data.length > 0) {

                                    $scope.isOverlapping = true;

                                    //Checking TAB already exist or not
                                    $scope.addTabRequired();

                                    //Calculate Error count
                                    $scope.ovlpErrorCounter(data);

                                    //Assigning Data to Overlapping GRID
                                    $scope.ovlpData = data;

                                    //Data massaging for END_DT
                                    for (var i = 0; i < $scope.ovlpData.length; i++) {
                                        //START DT massaging
                                        var d = new Date($scope.ovlpData[i].START_DT);
                                        $scope.ovlpData[i]
                                            .START_DT =
                                            d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

                                        //END DT massaging
                                        var d = new Date($scope.ovlpData[i].END_DT);
                                        $scope.ovlpData[i]
                                            .END_DT = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
                                    }

                                    $scope.ovlpDataSource.read();

                                    //Saving data for RedoUndo
                                    $scope.ovlpDataRep = angular.copy($scope.ovlpData);

                                    //Hiding Column Preference and Grid Preferences
                                    $scope.isLayoutConfigurable = false;

                                    $scope.$root.$broadcast('refreshContractData', true);
                                } else {
                                    //Remove overlapping tab
                                    util.console("Remove overlapping tab");
                                    $scope.removeOverlapTab();
                                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                                    if (!!tabStrip && $scope.curGroup === "Overlapping") {
                                        tabStrip.select(0);
                                        if ($scope.opOptions.groups !== undefined) {
                                            $scope.showCols($scope.opOptions.groupColumns.tools.Groups[0]);
                                        }
                                    }

                                    // Cleanup... if the deals HAD overlapp, they do not any more.  So reset the OVERLAP_RESULT to Pass
                                    var wips = $scope.parentRoot.pricingTableData.WIP_DEAL;
                                    for (var w = 0; w < wips.length; w++) {
                                        if (wips[w].OVERLAP_RESULT === "Fail") wips[w].OVERLAP_RESULT = "Pass";
                                    }

                                    $scope.$root.$broadcast('refreshContractData', false);

                                    util.console("Remove overlapping tab DONE");
                                }
                            }
                            pcService.add(pcUi.stop());

                            if ($scope.$root.pc !== null) {
                                $scope.$root.pc.add(pcService.stop());
                                $scope.$root.pc.stop();
                            }
                            $scope.$parent.$parent.setBusy("", "");
                            $timeout(function () {
                                if ($scope.$root.pc !== null) {
                                    $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                                    $scope.$root.pc = null;
                                }
                            }, 2000);

                        },
                            function (response) {
                                //empty after moving sync and validate to happen before the getOverlappingDeals call is made
                                $scope.$parent.$parent.setBusy("", "");
                            });
                } else {
                    if ($scope.$root.pc !== null) $scope.$root.pc.stop();
                    $timeout(function () {
                        if ($scope.$root.pc !== null) {
                            $scope.$root.pc.stop().drawChart("perfChart", "perfMs", "perfLegend");
                            $scope.$root.pc = null;
                        }
                    }, 2000);

                }
            }

            $scope.$on('fireSaveAndValidateGrid', function (event, args) {
                $scope.saveAndValidateGrid();
            });
            
            $scope.saveAndValidateGrid = function () {
                if (!$scope._dirty) return;

                if (!$scope.$root.pc || $scope.$root.pc === null) $scope.$root.pc = new perfCacheBlock("Deal Editor Save & Validate", "UX");

                //procedures within sync and validate wip deals must complete before overlapping deals setup is run to ensure user changes are accounted for, thus we pass in overlappingDealsSetup as a callback function
                $scope.syncAndValidateWipDeals($scope.overlappingDealsSetup);

                return;
            }

            $scope.syncAndValidateWipDeals = function (callback) {
                $scope.parentRoot.setBusy("Saving your data...", "Please wait as we Save your information!");
                $timeout(function () {
                    util.console("syncAndValidateWipDeals");
                    util.console("contractDs.sync Started");

                    // Change array to string to prevent [object object] issue
                    var gData = $scope.contractDs.data();
                    for (var i = 0; i < gData.length; i++) {
                        if (gData[i].QLTR_BID_GEO !== undefined && Array.isArray(gData[i].QLTR_BID_GEO)) gData[i].QLTR_BID_GEO = gData[i].QLTR_BID_GEO.join();
                        if (gData[i].DEAL_SOLD_TO_ID !== undefined && Array.isArray(gData[i].DEAL_SOLD_TO_ID)) gData[i].DEAL_SOLD_TO_ID = gData[i].DEAL_SOLD_TO_ID.join();
                    }

                    $scope.contractDs.sync();

                    util.console("contractDs.sync Ended");
                    $scope.root.validateWipDeals(callback);
                },
                    100);
            }

            $scope.validateRow = function (row, scope) {
                var valid = true;
                if (row._behaviors === undefined || row._behaviors.isError === undefined) return true;

                var beh = row._behaviors;
                if (beh.isRequired === undefined) beh.isRequired = {};
                if (beh.isReadOnly === undefined) beh.isReadOnly = {};
                if (beh.isHidden === undefined) beh.isHidden = {};

                // clear validation for this row
                //beh.isError = {};
                //beh.validMsg = {};

                // check for required fields
                //angular.forEach(beh.isRequired, function (value, key) {
                //    if ((row[key] === undefined || row[key] === null || row[key] === '') && (beh.isReadOnly[key] === undefined && !beh.isReadOnly[key]) && (beh.isHidden[key] === undefined && !beh.isHidden[key])) {
                //        var cols = this.grid.columns;
                //        var title = cols.find(function (v, i) {
                //            return cols[i].field === key;
                //        }).title;
                //        beh.isError[key] = true;

                //        if (beh.validMsg[key] === undefined) beh.validMsg[key] = "";
                //        beh.validMsg[key] += title + " is required<br/>";

                //        $scope.increaseBadgeCnt(key);
                //        valid = false;
                //        row["PASSED_VALIDATION"] = "Dirty";
                //    }
                //}, scope);

                // check for errors
                angular.forEach(beh.isError, function (value, key) {
                    //Removed:&& (beh.isReadOnly[key] === undefined || !beh.isReadOnly[key] || window.usrRole == 'SA' ) to solve SA will have readonly field, wont fire this rule for SA
                    if (!!$scope.opOptions.model.fields[key] && beh.isError[key] && (beh.isHidden[key] === undefined || !beh.isHidden[key])) {
                        $scope.increaseBadgeCnt(key);
                        valid = false;
                        row["PASSED_VALIDATION"] = "Dirty";
                    } else {
                        //// NOTE: the below is commented out to allow us to add validations to inidividual cells on tiered attributes in Rate Breakout.
                        //// Rate Breakout is TIER_NUM. Al tiered attributes (END_VOL, STRT_VOL, and RATE) masquerade as TIER_NUM and are therefore not in the model.
                        //// If you need to uncomment the below, make sure to alter tiered attribute validations as well.
                        //beh.isError[key] = false;
                        //beh.validMsg[key] = "";
                    }
                }, scope);

                return valid;
            }

            $scope.opOptions.columns = $scope.assignColSettings();

            function getProductMbrSid(dimProduct, dimKey) {
                var prd_mbr_sid = "";
                if (!dimKey) {
                    dimKey = "20___0";
                }
                for (var p in dimProduct) {

                    if (dimProduct.hasOwnProperty(p) && p.lastIndexOf(dimKey) > -1) {
                        prd_mbr_sid = dimProduct[p];
                        if (isNaN(prd_mbr_sid)) {
                            var splitKey = p.split("___");
                            if (splitKey.length > 1) {
                                prd_mbr_sid = splitKey[1];
                            }
                            else {
                                prd_mbr_sid = 0;
                            }
                        }
                        break;
                    }
                }
                return prd_mbr_sid;
            }

            function getPrductDetails(dataItem, priceCondition, dimkey) {
                return [{
                    'CUST_MBR_SID': !!dataItem.CUST_MBR_SID ? dataItem.CUST_MBR_SID : $scope.$parent.$parent.getCustId(),
                    'PRD_MBR_SID': getProductMbrSid(dataItem.PRODUCT_FILTER, dimkey),
                    'GEO_MBR_SID': dataItem.GEO_COMBINED,
                    'DEAL_STRT_DT': moment(dataItem.START_DT).format("l"),
                    'DEAL_END_DT': moment(dataItem.END_DT).format("l"),
                    'getAvailable': 'N',
                    'priceCondition': priceCondition
                }];
            }

            function openCAPBreakOut(dataItem, priceCondition, dimkey) {
                var productData = {
                    'CUST_MBR_SID': !!dataItem.CUST_MBR_SID ? dataItem.CUST_MBR_SID : $scope.$parent.$parent.getCustId(),
                    'PRD_MBR_SID': getProductMbrSid(dataItem.PRODUCT_FILTER, dimkey),
                    'GEO_MBR_SID': dataItem.GEO_COMBINED,
                    'DEAL_STRT_DT': moment(dataItem.START_DT).format("l"),
                    'DEAL_END_DT': moment(dataItem.END_DT).format("l"),
                    'getAvailable': 'N', // If sent as 'Y' gets the current CAP info
                    'priceCondition': priceCondition // CAP or YCS2
                }
                var capModal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/productCAPBreakout/productCAPBreakout.html',
                    controller: 'ProductCAPBreakoutController',
                    controllerAs: 'vm',
                    windowClass: 'cap-modal-window',
                    size: 'lg',
                    resolve: {
                        productData: angular.copy(productData),
                        priceCondition: function () {
                            return priceCondition;
                        }
                    }
                });

                capModal.result.then(
                    function () {
                    },
                    function () {
                    });
            }

            function openTargetRegionModal(container, col) {
                var containerDataItem = angular.element(container).scope().dataItem;

                var targetRegionData = {
                    'TRGT_RGN': containerDataItem.TRGT_RGN,
                    'GEO_MBR_SID': containerDataItem.GEO_COMBINED,
                    'LOOKUPURL': col.lookupUrl
                }
                var trgtRgnModal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/targetRegionPicker/targetRegionPicker.html',
                    controller: 'TargetRegionPickerController',
                    controllerAs: 'vm',
                    windowClass: 'cap-modal-window',
                    size: 'md',
                    resolve: {
                        targetRegionData: angular.copy(targetRegionData),
                    }
                });

                trgtRgnModal.result.then(
                    function (targetRegions) { //returns as an array
                        containerDataItem.TRGT_RGN = targetRegions.join();
                        containerDataItem.dirty = true;
                        $scope._dirty = true;
                        $scope.root._dirty = true;

                        $scope.root.saveCell(containerDataItem, "TRGT_RGN", $scope);
                        //Note: we do not call the below because we do not want target region to update all linked rows.  If we did, uncomment the below line and comment out the one above
                        //$scope.saveFunctions(containerDataItem, "TRGT_RGN", containerDataItem.TRGT_RGN)
                    },
                    function () {
                    });
            }

            function openMarketSegmentModal(container, col) {
                var containerDataItem = angular.element(container).scope().dataItem;
                console.log(col)

                var mrktSegModal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'multiSelectModal',
                    controller: 'MultiSelectModalCtrl',
                    controllerAs: '$ctrl',
                    windowClass: 'multiselect-modal-window',
                    size: 'md',

                    resolve: {
                        items: function () {
                            return {
                                'label': col.title,
                                'uiType': col.uiType,
                                'opLookupUrl': col.lookupUrl,
                                'opLookupText': col.lookupText,
                                'opLookupValue': col.lookupValue
                            };
                        },
                        cellCurrValues: function () {
                            if (typeof containerDataItem.MRKT_SEG == "string") {
                                return containerDataItem.MRKT_SEG.split(",").map(function (item) {
                                    return item.trim();
                                });
                            } else {
                                return containerDataItem.MRKT_SEG.map(function (item) {
                                    return item.trim();
                                });
                            }
                        },
                        colName: function () {
                            return "MRKT_SEG";
                        },
                        isBlendedGeo: function () {
                            return false;
                        }
                    }
                });

                mrktSegModal.result.then(
                    function (marketSegments) { //returns as an array
                        containerDataItem.MRKT_SEG = marketSegments;
                        //for some reason I can't get the grid to flag these cells as dirty when changing it via modal, so we manually do it below
                        //containerDataItem.dirty = true;
                        //$scope._dirty = true;
                        //$scope.root._dirty = true;
                        //$scope.$parent.$parent.$parent.$parent.$parent.saveCell(containerDataItem, "MRKT_SEG");

                        $scope.saveFunctions(containerDataItem, "MRKT_SEG", containerDataItem.MRKT_SEG);
                    },
                    function () {
                    });
            }

            //function openDealGroupModal(container, col) {
            //    var containerDataItem = angular.element(container).scope().dataItem;

            //    var modal = $uibModal.open({
            //        backdrop: 'static',
            //        templateUrl: 'app/contract/partials/ptModals/excludeDealGroupMultiSelectModal.html',
            //        controller: 'ExcludeDealGroupMultiSelectCtrl',
            //        controllerAs: 'vm',
            //        windowClass: '',
            //        size: 'lg',
            //        resolve: {
            //            dealId: angular.copy(containerDataItem["DC_ID"]),
            //            cellCurrValues: function () {
            //                return angular.copy(containerDataItem["DEAL_GRP_EXCLDS"]);
            //            },
            //            cellCommentValue: function () {
            //                return angular.copy(containerDataItem["DEAL_GRP_CMNT"]);
            //            },
            //            colInfo: function () {
            //                return col;
            //            },
            //            enableCheckbox: function () {
            //                return containerDataItem["PS_WF_STG_CD"] !== "Pending" && containerDataItem["PS_WF_STG_CD"] !== "Approved";
            //            }
            //        }
            //    });

            //    modal.result.then(
            //        function (result) {
            //            containerDataItem.DEAL_GRP_EXCLDS = result.DEAL_GRP_EXCLDS;
            //            containerDataItem.DEAL_GRP_CMNT = result.DEAL_GRP_CMNT;
            //            containerDataItem.dirty = true;
            //            $scope._dirty = true;
            //            $scope.root._dirty = true;

            //            $scope.root.saveCell(containerDataItem, "DEAL_GRP_EXCLDS", containerDataItem.DEAL_GRP_EXCLDS)
            //            $scope.root.saveCell(containerDataItem, "DEAL_GRP_CMNT", containerDataItem.DEAL_GRP_CMNT)
            //        },
            //        function () {
            //        });
            //}


            if ($scope.opData.length > 0) {
                $scope.checkforCustomerLayout($scope.opData[0].OBJ_SET_TYPE_CD);
            }


        }],
        link: function (scope, element, attr) {
            scope.elGrid = element;
            scope.grid = $(element).find(".op-grid").data("kendoGrid");
            scope.isToolbarVisible = true;
        }
    };
}

