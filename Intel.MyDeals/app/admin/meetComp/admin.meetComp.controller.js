/// <reference path="meetComp.service.js" />
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('meetCompController', meetCompController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];
    meetCompController.$inject = ['$scope', 'dataService', 'meetCompService', 'logger', '$localStorage', 'confirmationModal', '$linq', 'gridConstants', '$timeout', '$q'];

    function meetCompController($scope, dataService, meetCompService, logger, $localStorage, confirmationModal, $linq, gridConstants, $timeout, $q) { 
        var vm = this;
        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            $timeout(function () {
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
            });
        }
        vm.isAcess = false;
        
        if (usrRole == 'GA' && isSuper) {
            vm.isAcess = true;            
        }
        else {
            vm.isAcessMessage = 'You don\'t have access to view this page';
        }
        if (vm.isAcess == true) {
            vm.meetCompDIMMasterData = [];
            vm.isCustomerMissing = false;
            vm.selectedCustomerID = -1;
            vm.isCatMissing = false;
            vm.selectedProdCatName = -1;
            vm.isBrandMissing = false;
            vm.selectedBrandName = -1;
            vm.selectedProductName = -1;

            $scope.customerIDS = [];

            $scope.loading = true;
            $scope.setBusy("Meet Comp...", "Please wait we are fetching Meet Comp Data...");

            vm.meetCompMasterData = [];
            $scope.scope = $scope;
            $scope.selectedCustomerId = '';

            $scope.$storage = $localStorage;

            $scope.$storage = $localStorage.$default({
                selectedCustomerId: ''
            });

            if ($scope.$storage.selectedCustomerId) {
                $scope.selectedCustomerId = $scope.$storage.selectedCustomerId;
                vm.selectedCustomerID = $scope.$storage.selectedCustomerId;
            }

            var getCustomerIdByAccess = function () {
                dataService.get("api/Customers/GetMyCustomerNames")
                    .then(function (response) {
                        var obj = {
                            'CUST_NM': 'All Customer',
                            'CUST_SID': 1
                        }
                        response.data.push(obj);

                        return response.data;

                    }, function (response) {
                        logger.error("Unable to get Meet Comp Data [Customers by ID].", response, response.statusText);
                    });
            }

            var getCustomerDIMData = function () {
                var cid = $scope.selectedCustomerId == '' ? - 1 : $scope.selectedCustomerId;                

                meetCompService.getMeetCompDIMData(cid, 'DIM')
                    .then(function (response) {
                        vm.meetCompDIMMasterData = response.data;
                        if (vm.meetCompDIMMasterData.length > 0) {
                            $scope.meetCompProdCatName.read();
                        }
                        $scope.isBusy = false;
                        if (vm.selectedCustomerID == -1) {
                            var comboCustomer = $("#comboCustomer").data("kendoComboBox");
                            comboCustomer.text("ALL CUSTOMER");
                        }
                        
                    }, function (response) {
                        logger.error("Unable to get Meet Comp Data [DIM Data].", response, response.statusText);
                    });
            }

            getCustomerDIMData();

            $scope.custDs = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        dataService.get("api/Customers/GetMyCustomerNames")
                            .then(function (response) {
                                var obj = {
                                    'CUST_NM': 'ALL CUSTOMER',
                                    'CUST_SID': -1
                                }
                                response.data.unshift(obj);
                                e.success(response.data);
                            }, function (response) {
                                logger.error("Unable to get Meet Comp Data [Customers].", response, response.statusText);
                            });

                    }
                }
            });
            $scope.selectCustomerOptions = {
                placeholder: "Select a Customer...",
                dataTextField: "CUST_NM",
                dataValueField: "CUST_SID",
                valuePrimitive: true,
                autoBind: false,
                autoClose: false,
                dataSource: $scope.custDs,
                change: function (e) {
                    if (this.selectedIndex > -1) {
                        vm.selectedCustomerID = this.value();
                        $scope.selectedCustomerId = this.value();
                        getCustomerDIMData(vm.selectedCustomerID, 'DIM');
                        $scope.loading = true;
                        $scope.setBusy("Meet Comp...", "Please wait we are fetching Meet Comp Data...");
                        $scope.meetCompProdCatName.read();                        
                    }
                    else {
                        vm.selectedCustomerID = -1;                        
                    }

                    reset();
                }
            };

            $scope.meetCompProdCatName = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        if (vm.selectedCustomerID > -1) {
                            var result = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .Where(function (x) {
                                    return (x.CUST_MBR_SID == vm.selectedCustomerID);
                                })
                                .GroupBy(function (x) {
                                    return (x.PRD_CAT_NM);
                                }).Select(function (x) {
                                    return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                                })
                                .ToArray();
                            e.success(result);
                        } else if (vm.selectedCustomerID == -1) {
                            var result = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .GroupBy(function (x) {
                                    return (x.PRD_CAT_NM);
                                }).Select(function (x) {
                                    return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                                })
                                .ToArray();
                            e.success(result);
                        }
                        else {
                            e.success([]);
                        }

                    }
                }
            });

            $scope.meetCompProdCatNameOptions = {
                placeholder: "Select a Product Vertical...",
                dataTextField: "PRD_CAT_NM",
                dataValueField: "PRD_CAT_NM",
                valuePrimitive: true,
                autoBind: true,
                autoClose: true,
                dataSource: $scope.meetCompProdCatName,
                change: function (e) {
                    if (this.selectedIndex > -1) {
                        vm.selectedProdCatName = this.text();
                        $scope.meetCompBrandName.read();
                    }
                    else {
                        vm.selectedProdCatName = -1;                        
                    }                    
                }
            };

            $scope.meetCompBrandName = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        if (vm.selectedCustomerID > -1) {
                            var brandName = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .Where(function (x) {
                                    return (x.PRD_CAT_NM == vm.selectedProdCatName &&
                                        x.CUST_MBR_SID == vm.selectedCustomerID);
                                })
                                .GroupBy(function (x) {
                                    return (x.BRND_NM);
                                }).Select(function (x) {
                                    return { 'BRND_NM': x.source[0].BRND_NM };
                                })
                                .ToArray();

                            if (brandName.length == 1 && brandName[0].BRND_NM == 'NA') {
                                var comboBrndName = $("#comboBrndName").data("kendoComboBox");
                                comboBrndName.value(brandName[0].BRND_NM);
                                comboBrndName.text(brandName[0].BRND_NM);
                                comboBrndName.enable(false);
                                vm.selectedBrandName = brandName[0].BRND_NM;
                                $scope.selectProdName.read();
                            }
                            else {                                
                                var comboBrndName = $("#comboBrndName").data("kendoComboBox");
                                comboBrndName.value();
                                comboBrndName.text("");
                                vm.selectedBrandName = -1;
                                comboBrndName.enable(true);

                                var comboProdName = $("#comboProdName").data("kendoMultiSelect");
                                comboProdName.value([]);                                
                                comboProdName.trigger("change");

                            }
                            e.success(brandName);
                        } else if (vm.selectedCustomerID == -1) {
                            var brandName = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .Where(function (x) {
                                    return (x.PRD_CAT_NM == vm.selectedProdCatName);
                                })
                                .GroupBy(function (x) {
                                    return (x.BRND_NM);
                                }).Select(function (x) {
                                    return { 'BRND_NM': x.source[0].BRND_NM };
                                })
                                .ToArray();

                            if (brandName.length == 1 && brandName[0].BRND_NM == 'NA') {
                                var comboBrndName = $("#comboBrndName").data("kendoComboBox");
                                comboBrndName.value(brandName[0].BRND_NM);
                                comboBrndName.text(brandName[0].BRND_NM);
                                comboBrndName.enable(false);
                                vm.selectedBrandName = brandName[0].BRND_NM;
                                $scope.selectProdName.read();
                            }
                            else {
                                var comboBrndName = $("#comboBrndName").data("kendoComboBox");
                                comboBrndName.value();
                                comboBrndName.text("");
                                vm.selectedBrandName = -1;
                                comboBrndName.enable(true);                                
                            }
                            e.success(brandName);
                        }
                    }
                }
            });

            $scope.selectBrandNameOptions = {
                placeholder: "Select a Brand Name...",
                dataTextField: "BRND_NM",
                dataValueField: "BRND_NM",
                valuePrimitive: true,
                autoBind: true,
                autoClose: true,
                dataSource: $scope.meetCompBrandName,
                change: function (e) {
                    if (this.selectedIndex > -1) {
                        vm.selectedBrandName = this.text();
                        $scope.selectProdName.read();

                    }
                    else {
                        vm.selectedBrandName = -1;                        
                    }

                    //resetting Prod Name
                    var comboProdName = $("#comboProdName").data("kendoMultiSelect");
                    comboProdName.value([]);
                    comboProdName.trigger("change");

                }
            };

            $scope.selectProdName = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        if (vm.selectedCustomerID > -1) {
                            var prodName = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .Where(function (x) {
                                    return (x.PRD_CAT_NM == vm.selectedProdCatName &&
                                        x.CUST_MBR_SID == vm.selectedCustomerID &&
                                        x.BRND_NM == vm.selectedBrandName);
                                })
                                .GroupBy(function (x) {
                                    return (x.HIER_VAL_NM);
                                }).Select(function (x) {
                                    return { 'HIER_VAL_NM': x.source[0].HIER_VAL_NM };
                                })
                                .ToArray();
                            e.success(prodName);
                        }
                        else if (vm.selectedCustomerID == -1) {
                            var prodName = $linq.Enumerable().From(vm.meetCompDIMMasterData)
                                .Where(function (x) {
                                    return (x.PRD_CAT_NM == vm.selectedProdCatName &&
                                        x.BRND_NM == vm.selectedBrandName);
                                })
                                .GroupBy(function (x) {
                                    return (x.HIER_VAL_NM);
                                }).Select(function (x) {
                                    return { 'HIER_VAL_NM': x.source[0].HIER_VAL_NM };
                                })
                                .ToArray();
                            e.success(prodName);
                        }
                    }
                }
            });

            $scope.selectProdNameOptions = {
                placeholder: "All Product(s) selected...",
                dataTextField: "HIER_VAL_NM",
                dataValueField: "HIER_VAL_NM",
                valuePrimitive: true,
                autoBind: true,
                autoClose: false,
                dataSource: $scope.selectProdName,
                change: function (e) {
                    if (this.selectedIndex > -1) {
                        vm.selectedProductName = this.text();

                    }
                    else {
                        vm.selectedProductName = -1;                        
                    }

                }
            };

            var getMeetCompDataByCompID = function (cid) {
                if (cid || cid == '') {
                    if (cid == '') {
                        cid = -1;
                    }
                }
                meetCompService.getMeetCompDIMData(cid, 'DIM')
                    .then(function (response) {
                        vm.meetCompMasterData = response.data;
                        vm.dataSource.read();
                    }, function (response) {
                        logger.error("Unable to get Meet Comp Data. [COMP Data]", response, response.statusText);
                    });
            }

            vm.fetchMeetCompData = function () {
                var selectedProdNames = $("#comboCustomer").data("kendoComboBox");
                var tempCustomer = selectedProdNames.text().toString();
                if (vm.selectedCustomerID > -1 || tempCustomer != "ALL CUSTOMER") {
                    vm.isCustomerMissing = false;
                }
                if (vm.selectedProdCatName != -1) {
                    vm.isCatMissing = false;
                }
                if (vm.selectedBrandName != -1) {
                    vm.isBrandMissing = false;
                }
                if (vm.selectedCustomerID == -1 && tempCustomer != "ALL CUSTOMER") {
                    logger.warning('Not a valid customer');
                    vm.isCustomerMissing = true;
                    //Reset grid to Blank
                    resetGrid();
                }
                else if (vm.selectedProdCatName == -1) {
                    logger.warning('Not a valid Product Vertical');
                    vm.isCatMissing = true;
                    //Reset grid to Blank
                    resetGrid();
                }
                else if (vm.selectedBrandName == -1) {
                    logger.warning('Not a valid Brand Name');
                    vm.isBrandMissing = true;
                    //Reset grid to Blank
                    resetGrid();
                }
                else {
                    $scope.loading = true;
                    $scope.setBusy("Meet Comp...", "Please wait we are fetching Meet Comp Data...");
                    var selectedProdNames = $("#comboProdName").data("kendoMultiSelect");
                    var value = selectedProdNames.value();
                    if (value.length == 0) {
                        value = -1;
                    }
                    meetCompService.getMeetCompData(vm.selectedCustomerID, vm.selectedProdCatName, vm.selectedBrandName, value.toString())
                        .then(function (response) {
                            vm.meetCompMasterData = response.data;
                            var grid = $("#grid").data().kendoGrid;
                            grid.setDataSource(vm.dataSource);
                            vm.dataSource.read();
                            $scope.isBusy = false;
                        }, function (response) {
                            logger.error("Unable to get Meet Comp Data [MC Data].", response, response.statusText);
                        });
                }
            }
            var resetGrid = function () {
                vm.meetCompMasterData = [];
                var grid = $("#grid").data().kendoGrid;
                grid.setDataSource(vm.dataSource);
                vm.dataSource.read();
            }
            var reset = function () {
                var comboCatName = $("#comboCatName").data("kendoComboBox");
                comboCatName.value([]);
                comboCatName.text("");
                vm.selectedProdCatName = -1;
                //comboCatName.selectedIndex = -1;

                var comboBrndName = $("#comboBrndName").data("kendoComboBox");
                comboBrndName.value([]);
                comboBrndName.text("");
                vm.selectedBrandName = -1;
                //comboBrndName.selectedIndex = -1;

                var comboProdName = $("#comboProdName").data("kendoMultiSelect");
                comboProdName.value([]);
                comboProdName.trigger("change");                

                //Reset grid to Blank
                vm.meetCompMasterData = [];
                var grid = $("#grid").data().kendoGrid;
                grid.setDataSource(vm.dataSource);
                vm.dataSource.read();
            }

            vm.dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        e.success(vm.meetCompMasterData);
                    }
                },
                pageSize: 8,
                //group: ([{ field: "CUST_NM" }, { field: "PRD_CAT_NM" }, { field: "HIER_VAL_NM" }]),            
                schema: {
                    model: {
                        id: "MEET_COMP_SID",
                        fields: {
                            MEET_COMP_SID: {
                                editable: false, nullable: true
                            },
                            CUST_NM: { validation: { required: true }, type:"string" },
                            PRD_CAT_NM: { validation: { required: true }, type: "string" },
                            HIER_VAL_NM: { validation: { required: true }, type: "string"  },                            
                            ACTV_IND: { validation: { required: true }, type: "boolean" },
                            MEET_COMP_PRD: { editable: false, validation: { required: false } },
                            MEET_COMP_PRC: { editable: false, validation: { required: true }, type: "number" },
                            COMP_BNCH: { editable: false, validation: { required: true }, type: "number" },
                            IA_BNCH: { editable: false, validation: { required: true }, type: "number" },
                            CRE_EMP_NM: { editable: false, validation: { required: true } },
                            CRE_DTM: { type: "date", editable: false },
                            CHG_EMP_NM: { editable: false, validation: { required: true } },
                            CHG_DTM: { type: "date", editable: false }
                        }
                    }
                }
            });

            vm.gridOptions = {
                dataSource: vm.dataSource,
                filterable: true,
                scrollable: true,
                sortable: true,
                navigatable: true,
                resizable: true,
                reorderable: true,
                columnMenu: true,
                groupable: true,
                sort: function (e) { gridUtils.cancelChanges(e); },
                filter: function (e) { gridUtils.cancelChanges(e); },
                editable: { mode: "inline", confirmation: false },
                toolbar: gridUtils.clearAllFiltersToolbar(),
                pageable: {
                    refresh: true,
                    pageSizes: gridConstants.pageSizes
                },
                dataBound: function () {
                    var grid = $('#grid').data('kendoGrid');
                    $(grid.thead.find('th')).each(function () {
                        $(this).prop('title', $(this).data('title'));
                    });
                },
                columns: [
                    { field: "CUST_NM", title: "Customer", width: "9%", filterable: { multi: true, search: true } },
                    { field: "PRD_CAT_NM", title: "Vertical", width: "6%", filterable: { multi: true, search: true } },
                    { field: "HIER_VAL_NM", title: "Product", width: "9%", filterable: { multi: true, search: true } },
                    { field: "ACTV_IND", title: "Activate/Deactivate", width: "6%", template: "<toggle ng-click='vm.gridSelectItem(dataItem,$event)' size='btn-sm' ng-model='dataItem.ACTV_IND'></toggle>", editor: activateDeactivate, attributes: { style: "text-align: center;" }, filterable: { multi: true, search: true }, groupable: false },
                    { field: "MEET_COMP_PRD", title: "Meet Comp SKU", width: "9%", filterable: { multi: true, search: true }, groupable: false },
                    { field: "MEET_COMP_PRC", title: "Meet Comp Price", width: "9%", format: "{0:c}", groupable: false },
                    { field: "IA_BNCH", title: "IA Bench", width: "8%", groupable: false },
                    { field: "COMP_BNCH", title: "Comp Bench", width: "8%", groupable: false },
                    { field: "CRE_EMP_NM", title: "Created By", width: "11%", filterable: { multi: true, search: true }, groupable: false },
                    {
                        field: "CRE_DTM", title: "Created Date", width: "11%", type: "date",
                        template: "#= kendo.toString(new Date(CRE_DTM), 'M/d/yyyy') #",
                        filterable: {
                            extra: false,
                            ui: "datepicker"
                        },
                        groupable: false
                    },
                    { field: "CHG_EMP_NM", title: "Last Modified By", width: "11%", filterable: { multi: true, search: true }, groupable: false },
                    {
                        field: "CHG_DTM", title: "Last Modified Date", width: "11%", type: "date",
                        template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy') #",
                        filterable: {
                            extra: false,
                            ui: "datepicker"
                        },
                        groupable: false
                    }
                ]
            };

            //Custom Editor for Toggle view
            function activateDeactivate(container, options) {
                return "<toggle size='btn-sm' field='" + options.field + "' ng-model='" + options.field + "' ></toggle>";
            }

            //Activate/Deactivate Meet Comp Record
            vm.gridSelectItem = function (dataItem, event) {
                $scope.loading = true;
                $scope.setBusy("Meet Comp...", "Please wait we are Activating/Deactivating Meet Comp Data...");
                meetCompService.activateDeactivateMeetComp(dataItem.MEET_COMP_SID, dataItem.ACTV_IND)
                    .then(function (response) {
                        if (response.data[0].MEET_COMP_SID > 0) {
                            var CHG_DTM = moment(response.data[0].CHG_DTM).format("l"); 
                            dataItem.CHG_EMP_NM = usrName;
                            dataItem.CHG_DTM = CHG_DTM;
                            var grid = $('#grid').data('kendoGrid');
                            var tempGroup = grid.dataSource.group();
                            grid.dataSource.group([]);
                            $("#grid").find("tr[data-uid='" + dataItem.uid + "'] td:eq(11)").text(CHG_DTM);                            
                            grid.dataSource.group(tempGroup);
                            //vm.dataSource.read();
                            $scope.isBusy = false;
                        }
                        else {
                            $scope.isBusy = false;
                            logger.error("Activate Deactivate Meet Comp failed");
                        }

                    }, function (response) {
                        $scope.isBusy = false;
                        logger.error("Activate Deactivate Meet Comp failed", response, response.statusText);
                    });
            }
        }
    }
})();