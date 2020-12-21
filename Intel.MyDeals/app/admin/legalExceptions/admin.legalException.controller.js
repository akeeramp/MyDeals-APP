(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('legalExceptionsController', legalExceptionsController)

    legalExceptionsController.$inject = ['legalExceptionService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq', 'productSelectorService', '$uibModal'];

    //--------------------------------------------------------------------
    // LegalExceptionsController
    //--------------------------------------------------------------------

    function legalExceptionsController(legalExceptionService, $scope, logger, confirmationModal, gridConstants, $linq, productSelectorService, $uibModal) {
        var vm = this;
        var filterData = "";
        var rowID = 0;
        var filterDataChildGrid = "";
        vm.validationMessage = "";
        $scope.ChildGridSelect = false;
        vm.exceptionData;
        vm.legalExceptionData;
        vm.colSize = 12;
        vm.hideColInGrid = true;
        vm.btnName = 'intelicon-show-results-outlined';
        vm.btnColor = 'rgba(255,255,255,0)';
        vm.toolTip = 'Show Additional Column';
        //Legal and SA can see the Screen..
        if (window.usrRole != 'Legal' && window.usrRole != 'SA' && !window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }

        //Show Hide Additional Column
        $scope.showHideAllCol = function () {
            vm.hideColInGrid = vm.hideColInGrid == true ? false : true;
            var grid = $("#grid").data("kendoGrid");
            if (vm.hideColInGrid == true) {
                for (var i = 8; i < 28; i++) {
                    grid.hideColumn(i);                    
                }
                vm.btnColor = 'rgba(255,255,255,0)';
                vm.toolTip = 'Show Additional Column';
            } else {
                for (var i = 8; i < 28; i++) {
                    grid.showColumn(i);                    
                }
                vm.btnColor = '#008bd1';                
                vm.toolTip = 'Hide Additional Column';
                vm.colSize = 12;
            }            
        }

        vm.dataSource = new kendo.data.DataSource({

            transport: {
                read: function (e) {
                    legalExceptionService.getLegalExceptions()
                        .then(function (response) {
                            if (response.data.length > 0) {                                                             
                                for (var i = 0; i < response.data.length; i++) {
                                    response.data[i]["IS_SELECTED"] = false;                                     
                                }
                                e.success(response.data);                                                                     
                            }
                            
                        }, function (response) {
                            logger.error("Unable to get Legal exceptions.", response, response.statusText);
                        });
                },
                update: function (e) {
                    if (isInvalidateRow(e, 'update')) {
                        e.error();
                    } else {
                        legalExceptionService.updateLegalException(e.data.models[0])
                            .then(function (response) {
                                e.success(response.data);
                                ClearSelectedItem();
                                logger.success("Legal exception were successfully updated.");

                            }, function (response) {
                                logger.error("Unable to update Legal exception.", response, response.statusText);
                            });
                    }
                },
                create: function (e) {
                    if (isInvalidateRow(e, 'create')) {
                        e.error();
                    } else {
                        legalExceptionService.createLegalException(e.data.models[0])
                            .then(function (response) {
                                e.success(response.data);
                                ClearSelectedItem();
                                logger.success("Legal exceptions added.");

                            }, function (response) {
                                logger.error("Unable to add new Legal exceptions", response, response.statusText);
                            });
                    }
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Legal Exception',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Legal Exception ?'
                    };
                    confirmationModal.showModal({}, modalOptions).then(function (result) {
                        legalExceptionService.deleteLegalException(e.data.models[0]).then(function (response) {
                            e.success(response.data);
                            ClearSelectedItem();
                            logger.success("Legal Exception Deleted.");

                        }, function (response) {
                            logger.error("Unable to delete Legal Exception.", response, response.statusText);
                        });
                    }, function (response) {
                        cancelChanges();
                        ClearSelectedItem();
                    });
                },
            },
            batch: true,
            pageSize: 25,
            filter: [{
                field: "ACTV_IND", operator: "eq", value: "true"

            }],
            sort: { field: "INTEL_PRD", dir: "asc" },
            schema: {
                model: {

                    id: "MYDL_PCT_LGL_EXCPT_SID",
                    fields: {
                        IS_SELECTED: { editable: true, defaultValue: false, type: "boolean" }
                        ,IS_ChildGrid: { editable: true,  type: "boolean" }
                        , ACTV_IND: { editable: true, defaultValue: true, type: "boolean" }
                        , PCT_EXCPT_NBR: {
                            validation: {
                                required: { message: "* field is required" },
                            }
                        },
                        VER_NBR: { type: "int", editable: false, defaultValue: 1 },
                        INTEL_PRD: {
                            validation: {
                                required: { message: "* field is required" },
                            }
                        },
                        IS_DSBL: { editable: true, defaultValue: false, type: "boolean" }
                        , SCPE: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , PRC_RQST: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , COST: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , PCT_LGL_EXCPT_STRT_DT: {
                            type: "date", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , PCT_LGL_EXCPT_END_DT: {
                            type: "date", validation: {
                                required: { message: "* field is required" },
                                exceptionEndDateValidation: exceptionEndDateValidation
                            }
                        }
                        , FRCST_VOL_BYQTR: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , CUST_PRD: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , MEET_COMP_PRD: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , MEET_COMP_PRC: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , BUSNS_OBJ: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , PTNTL_MKT_IMPCT: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , OTHER: { type: "string" }
                        , JSTFN_PCT_EXCPT: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , RQST_CLNT: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , RQST_ATRNY: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , APRV_ATRNY: {
                            type: "string", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , DT_APRV: {
                            type: "date", validation: {
                                required: { message: "* field is required" }
                            }
                        }
                        , CHG_EMP_NAME: { type: "string", editable: false, defaultValue: usrName }
                        , CHG_DTM: { type: "date", editable: false, defaultValue: moment().format('l') }
                        , DEALS_USED_IN_EXCPT: { type: "string", editable: false }
                    }
                },
            },
        });

        //--------------------------------------------------------------------
        // Add Legal Exception
        //--------------------------------------------------------------------

        $scope.addLegalException = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/admin/legalExceptions/addLegalException.html',
                controller: 'addLegalExceptionController',
                controllerAs: 'vm',
                size: 'sm',
                windowClass: 'prdSelector-modal-window',
                resolve: {
                    
                }
            });
            modalInstance.result.then(function (isSaved) {
                if (isSaved == true || isSaved.toLowerCase() == "true") {
                    vm.dataSource.read();
                }
                vm.cancel();
            }, function () { });

            modalInstance.result.then(function (returnData) {
                vm.cancel();
            }, function () { });
        }

        //--------------------------------------------------------------------
        // Update Legal Exception
        //--------------------------------------------------------------------

        $scope.updateLegalException = function (dataItem, mode) {
            if (mode == true) {                 
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'app/admin/legalExceptions/updateLegalException.html',
                    controller: 'updateLegalExceptionController',
                    controllerAs: 'vm',
                    size: 'sm',
                    windowClass: 'prdSelector-modal-window',
                    backdrop: false,
                    resolve: {
                        dataItem: function () {
                            return util.deepClone(dataItem);                            
                        }
                    }
                });
                modalInstance.result.then(function (returnData) {
                    if (returnData) {
                        $scope.findAndReplace(returnData);
                        $("#grid").data("kendoGrid").refresh();
                        var grid = $("#childGrid").data("kendoGrid");
                        grid.refresh();
                    }                    
                    vm.cancel();
                }, function () { });

                modalInstance.result.then(function (returnData) {
                    vm.cancel();
                }, function () { });
            }
            else {
                logger.warning("Exception that has been applied to a Deal cannot be Edited.");
            }
            

        }

        $scope.findAndReplace = function (dataItem) {
            for (var i = 0; i < $("#grid").data("kendoGrid")._data.length; i++) {
                if ($("#grid").data("kendoGrid")._data[i]["PCT_EXCPT_NBR"] == dataItem.PCT_EXCPT_NBR) {
                    
                    $("#grid").data("kendoGrid")._data[i]["ACTV_IND"] = dataItem.ACTV_IND;
                    $("#grid").data("kendoGrid")._data[i]["APRV_ATRNY"] = dataItem.APRV_ATRNY;
                    $("#grid").data("kendoGrid")._data[i]["BUSNS_OBJ"] = dataItem.BUSNS_OBJ;
                    $("#grid").data("kendoGrid")._data[i]["CHG_DTM"] = moment(dataItem.CHG_DTM).format("l");
                    $("#grid").data("kendoGrid")._data[i]["CHG_EMP_NAME"] = dataItem.CHG_EMP_NAME;
                    $("#grid").data("kendoGrid")._data[i]["CHG_EMP_WWID"] = dataItem.CHG_EMP_WWID;
                    $("#grid").data("kendoGrid")._data[i]["COST"] = dataItem.COST;
                    $("#grid").data("kendoGrid")._data[i]["CRE_DTM"] = moment(dataItem.CRE_DTM).format("l");

                    $("#grid").data("kendoGrid")._data[i]["CRE_EMP_WWID"] = dataItem.CRE_EMP_WWID;
                    $("#grid").data("kendoGrid")._data[i]["CUST_PRD"] = dataItem.CUST_PRD;
                    $("#grid").data("kendoGrid")._data[i]["DT_APRV"] = dataItem.DT_APRV;
                    $("#grid").data("kendoGrid")._data[i]["EXCPT_RSTRIC_DURN"] = dataItem.EXCPT_RSTRIC_DURN;
                    $("#grid").data("kendoGrid")._data[i]["FRCST_VOL_BYQTR"] = dataItem.FRCST_VOL_BYQTR;
                    $("#grid").data("kendoGrid")._data[i]["INTEL_PRD"] = dataItem.INTEL_PRD;
                    $("#grid").data("kendoGrid")._data[i]["IS_DSBL"] = dataItem.IS_DSBL;
                    $("#grid").data("kendoGrid")._data[i]["JSTFN_PCT_EXCPT"] = dataItem.JSTFN_PCT_EXCPT;

                    $("#grid").data("kendoGrid")._data[i]["MEET_COMP_PRC"] = dataItem.MEET_COMP_PRC;
                    $("#grid").data("kendoGrid")._data[i]["MEET_COMP_PRD"] = dataItem.MEET_COMP_PRD;
                    $("#grid").data("kendoGrid")._data[i]["MYDL_PCT_LGL_EXCPT_SID"] = dataItem.MYDL_PCT_LGL_EXCPT_SID;
                    $("#grid").data("kendoGrid")._data[i]["OTHER"] = dataItem.OTHER;
                    $("#grid").data("kendoGrid")._data[i]["PCT_EXCPT_NBR"] = dataItem.PCT_EXCPT_NBR;
                    $("#grid").data("kendoGrid")._data[i]["PCT_LGL_EXCPT_END_DT"] = dataItem.PCT_LGL_EXCPT_END_DT;
                    $("#grid").data("kendoGrid")._data[i]["PCT_LGL_EXCPT_STRT_DT"] = dataItem.PCT_LGL_EXCPT_STRT_DT;
                    $("#grid").data("kendoGrid")._data[i]["PRC_RQST"] = dataItem.PRC_RQST;

                    $("#grid").data("kendoGrid")._data[i]["PTNTL_MKT_IMPCT"] = dataItem.PTNTL_MKT_IMPCT;
                    $("#grid").data("kendoGrid")._data[i]["RQST_ATRNY"] = dataItem.RQST_ATRNY;
                    $("#grid").data("kendoGrid")._data[i]["RQST_CLNT"] = dataItem.RQST_CLNT;
                    $("#grid").data("kendoGrid")._data[i]["SCPE"] = dataItem.SCPE;
                    $("#grid").data("kendoGrid")._data[i]["USED_IN_DL"] = dataItem.USED_IN_DL;
                    $("#grid").data("kendoGrid")._data[i]["VER_CRE_DTM"] = dataItem.VER_CRE_DTM;
                    $("#grid").data("kendoGrid")._data[i]["VER_NBR"] = dataItem.VER_NBR;
                    $("#grid").data("kendoGrid")._data[i]["DEALS_USED_IN_EXCPT"] = dataItem.DEALS_USED_IN_EXCPT;
                }
            }
        }

        //--------------------------------------------------------------------
        // View Legal Exception
        //--------------------------------------------------------------------
        $scope.viewLegalException = function (dataItem) {
            vm.colSize = 6;
            vm.legalExceptionData = dataItem;            
        }

        //--------------------------------------------------------------------
        // View Legal Exception Deal List
        //--------------------------------------------------------------------
        $scope.viewLegalExceptionDealList = function (dataItem, mode) {
            if (mode == true) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'app/admin/legalExceptions/viewLegalExceptionDealList.html',
                    controller: 'viewLegalExceptionDealListController',
                    controllerAs: 'vm',
                    size: 'sm',
                    windowClass: 'prdSelector-modal-window',
                    backdrop: false,
                    resolve: {
                        dataItem: function () {
                            return dataItem;
                        }
                    }
                });

                modalInstance.result.then(function (returnData) {
                    vm.cancel();
                }, function () { });
            }
            else{
                logger.warning("Exception has not been applied to a Deal.");
            }
            
        }

        //--------------------------------------------------------------------
        // Download Legal Exception 
        //--------------------------------------------------------------------
        $scope.downloadException = function () {

            var selectedData = $linq.Enumerable().From(filterData)
                .Where(function (x) {
                    return (x.IS_SELECTED == true);
                })
                .ToArray();

            if (selectedData.length > 0) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'app/admin/legalExceptions/downloadLegalException.html',
                    controller: 'downloadLegalExceptionController',
                    controllerAs: 'vm',
                    size: 'sm',
                    windowClass: 'prdSelector-modal-window',
                    backdrop: false,
                    resolve: {
                        dataItem: function () {
                            return selectedData;
                        }
                    }
                });

                modalInstance.result.then(function (returnData) {
                    vm.cancel();
                }, function () { });
            }
            else {
                logger.warning("Please select a current version exception to Download.");
            }

        }

        //--------------------------------------------------------------------
        // Compare Legal Exceptions
        //--------------------------------------------------------------------

        $scope.openCompareLegalException = function () {
           
            var selectedData = $linq.Enumerable().From(filterData)
                .Where(function (x) {
                    return (x.IS_SELECTED == true);
                })
                .ToArray();

            var selectedChildItem = $linq.Enumerable().From(filterDataChildGrid)
                .Where(function (x) {
                    return (x.IS_ChildGrid == true);
                })
                .ToArray();
            var flag = "";
            if (selectedChildItem.length == 1 && selectedData.length==1)
            {
                if (selectedData[0]['MYDL_PCT_LGL_EXCPT_SID'] == selectedChildItem[0]['MYDL_PCT_LGL_EXCPT_SID']) {
                    flag = "false";
                    selectedData = selectedData.concat(selectedChildItem);
                }
                else
                {
                    flag = "true";
                }
            }          
           
            if (flag != "true")
            {
                if ((selectedData.length == 2 && selectedChildItem.length == 0) || (selectedData.length == 0 && selectedChildItem.length == 2) || flag == "false" ) {


                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'app/admin/legalExceptions/compareLegalException.html',
                        controller: 'compareController',
                        controllerAs: 'vm',
                        size: 'sm',
                        windowClass: 'prdSelector-modal-window',
                        resolve: {
                            RuleConfig: ['legalExceptionService', function () {

                            }],
                            dataItem: function () {
                                if (selectedData.length == 2) {
                                    return selectedData;
                                }

                                if (selectedChildItem.length == 2) {
                                    return selectedChildItem;
                                }
                            }
                        }
                    });

                    modalInstance.result.then(function (returnData) {
                        vm.cancel();
                    }, function () { });
                }
                else {
                    logger.warning('Please Select 2 Exception to Compare');
                }
            }
            else
            {
                logger.warning('Previous version cannot be compared against other Exceptions');
            }
        }

        //--------------------------------------------------------------------
        // Text Area Editor
        //--------------------------------------------------------------------
        $scope.ok = function () {
            vm.colSize = 12;
        }

        $scope.showLogger = function () {
            logger.warning("Exception that has been applied to a Deal cannot be Deleted.");
        }

        function textareaEditor(container, options) {
            ClearSelectedItem();

            $('<textarea name="' + options.field + '" style="width: ' + container.width() + 'px;height:150px" validationMessage="* field is required" placeholder="Please enter.." ' +
                'required name="' + options.field + '" />').appendTo(container);
            $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>').appendTo(container);
        }

        var editNotAllowed = ( usrRole == "Legal" || window.isDeveloper ) ? true : false;
        var amendmentAllowed = ( usrRole == "Legal" || window.isDeveloper ) ? 1 : 0;

        $scope.isEditable = function (dataItem) {
            return editNotAllowed === 1 ? false : dataItem.ACTV_IND && dataItem.USED_IN_DL !== 'Y';
        }
        
        //--------------------------------------------------------------------
        // Grid Options
        //--------------------------------------------------------------------

        vm.gridOptions = {

            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            selectable: true,
            enableHorizontalScrollbar: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: false,
            sort: function (e) { ClearSelectedItem(); gridUtils.cancelChanges(e); },
            filter: function (e) { ClearSelectedItem(); gridUtils.cancelChanges(e); },
            toolbar: GridMenuButton(editNotAllowed,amendmentAllowed),

            editable: { mode: "inline", confirmation: false },

            detailTemplate: "<div class='childGrid opUiContainer md k-grid k-widget'  kendo-grid k-options='detailInit(dataItem)' style='width:100%;' id='childGrid'></div>",
            
            detailExpand: function (e) {                               
                var dataItem = e.sender.dataItem(e.masterRow);                
                ChildGrid(dataItem);               
                e.sender.tbody.find('.k-detail-row').each(function (idx,item) {
                    if (item !== e.detailRow[0]) {
                        e.sender.collapseRow($(item).prev());
                    }
                })
            }, 
            dataBound: function (e) {
                $scope.viewLegalException(vm.dataSource.view()[0]);
                this.element.find('tbody tr:first').addClass('k-state-selected');
            },
            columns: [

                {
                    headerTemplate: "<div class='dealTools'><p  style='font-weight: bold;font-size:14px;'>Select All</p><input type='checkbox' class='grid-link-checkbox with-font' id='lnkChk' ng-model='dataItem.Select_All' style='height: 17px; width: 17px; border: 2px solid; cursor: pointer;' ng-click='selectItem(\"FALSE\",$event, dataItem)' /> </div>",
                    command: [

                        { name: "select", template: "<div class='dealTools'><input type='checkbox' class='grid-link-checkbox with-font' id='lnkChk' ng-model='dataItem.IS_SELECTED' style='height: 17px; width: 17px; border: 2px solid; cursor: pointer;' ng-click='selectItem(\"FALSE\",$event, dataItem)' /> </div>" }
                    ],
                    width: 58,
                    attributes: { style: "text-align: center;" },
                    hidden: !editNotAllowed
                },
                {
                    command: [

                        { name: "view", template: "<div class='dealTools' ng-if='" + editNotAllowed + "'><i class='rulesGidIcon intelicon-search clrGreen dealTools' title='View' ng-click='viewLegalException(dataItem)' style='font-size: 20px; cursor: pointer;'></i></div>" },
                        { name: "edit", template: "<div class='dealTools' ng-if='" + editNotAllowed + " && dataItem.DEALS_USED_IN_EXCPT == \"\"'><i class='intelicon-edit' title='Edit' ng-click='updateLegalException(dataItem,true)' style='font-size: 20px; margin-left: 10px; cursor: pointer;'></i></div>" },
                        { name: "cantEdit", template: "<div class='dealTools' ng-if='" + editNotAllowed + " && dataItem.DEALS_USED_IN_EXCPT != \"\"'><i class='intelicon-no-access' title='Edit' ng-click='updateLegalException(dataItem, false)' style='font-size: 20px; margin-left: 10px; cursor: pointer;color: \\#00AEEF'></i></div>" },
                        { name: "deallist", template: "<div class='dealTools' ng-if='" + editNotAllowed + " && dataItem.DEALS_USED_IN_EXCPT != \"\"' style='margin-left: 10px;'><i class='intelicon-reports-outlined' title='List of deals applied to this Exception' ng-click='viewLegalExceptionDealList(dataItem, true)' style='font-size: 20px; margin-left: 10px; cursor: pointer; color:\\#1a3e6f'></i></div>" },
                        { name: "deallistBlur", template: "<div class='dealTools' ng-if='" + editNotAllowed + " && dataItem.DEALS_USED_IN_EXCPT == \"\"' style='margin-left: 10px;'><i class='intelicon-reports-outlined' title='List of deals applied to this Exception' ng-click='viewLegalExceptionDealList(dataItem, false)' style='font-size: 20px; margin-left: 10px; cursor: pointer; color:\\#b1babf'></i></div>" },
                        { name: "cantDelete", template: "<a ng-if='" + editNotAllowed + " && dataItem.ACTV_IND && dataItem.DEALS_USED_IN_EXCPT != \"\"' title='Only exception not applied to a deal can be Deleted' style='margin-left: 10px; cursor: pointer;'><i class='intelicon-trash-solid dealTools' title='Only exception not applied to a deal can be Deleted' style='color: \\#b1babf;opacity: 1;font-size: 20px;margin-left: 20px;' ng-click='showLogger()'></i></a>" },
                        { name: "destroy", template: "<a ng-if='" + editNotAllowed + " && dataItem.ACTV_IND && dataItem.DEALS_USED_IN_EXCPT == \"\"' title='Only exception not applied to a deal can be Deleted' class='k-grid-delete' href='\\#' style='margin-left: 10px; cursor: pointer;'><i class='k-icon k-i-close' title='Only exception not applied to a deal can be Deleted' style='color:\\#1a3e6f;opacity: 1;'></i></a>" }
                    ],
                    width: 140,
                    attributes: { style: "text-align: center;" },
                    hidden: !editNotAllowed
                },
                {
                    title: "Active",
                    field: "ACTV_IND",
                    width: 115,
                    headerTemplate: "<div class='isRequired'> Active </div>",
                    template: gridUtils.boolViewer('ACTV_IND'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" },
                    editable: $scope.isEditable
                },
                {
                    title: "Hidden",
                    field: "IS_DSBL",
                    width: 115,
                    headerTemplate: "<div class='isRequired'> Hidden </div>",
                    template: gridUtils.boolViewer('IS_DSBL'),
                    editor: gridUtils.boolEditor,
                    attributes: { style: "text-align: center;" },
                    editable: function (dataItem) {
                        return editNotAllowed === 1 ? false : true;
                    }
                },
                {
                    title: "PCT Legal Exception Sid",
                    field: "MYDL_PCT_LGL_EXCPT_SID",
                    hidden: true,
                    width: 120,
                    filterable: { multi: true, search: true }
                },
                {
                    field: "PCT_EXCPT_NBR",
                    title: "PCT Exception No.",
                    headerTemplate: "<div class='isRequired'> PCT Exception No. </div>",
                    width: 150,
                    edit: onGridEditing,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable
                },
                {
                    field: "VER_NBR",
                    title: "Version No.",
                    headerTemplate: "<div class='isRequired'> Version No. </div>",
                    width: 150,
                    //edit: onGridEditing,
                    filterable: { multi: true, search: true },
                    editable: false
                },
                {
                    field: "INTEL_PRD",
                    headerTemplate: "<div class='isRequired'> Intel Product </div>",
                    editor: textareaEditor,
                    title: "Intel Product",
                    width: 540,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable
                },
                {
                    field: "SCPE",
                    headerTemplate: "<div class='isRequired'> Scope </div>",
                    editor: textareaEditor,
                    title: "Scope",
                    width: 200,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden:vm.hideColInGrid
                },
                {
                    field: "PRC_RQST",
                    editor: textareaEditor,
                    title: "Price Request",
                    headerTemplate: "<div class='isRequired'> Price Request </div>",
                    width: 160,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "COST",
                    title: "Cost",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Cost </div>",
                    width: 120,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "PCT_LGL_EXCPT_STRT_DT",
                    width: 150,
                    headerTemplate: "<div class='isRequired'> Exception Start Date </div>",
                    template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_STRT_DT), 'M/d/yyyy') #",
                    title: "Exception Start Date",
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "PCT_LGL_EXCPT_END_DT",
                    title: "Exception End Date",
                    headerTemplate: "<div class='isRequired'> Exception End Date </div>",
                    template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_END_DT), 'M/d/yyyy') #",
                    width: 150,
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    title: "Forecasted Volume By Quarter",
                    field: "FRCST_VOL_BYQTR",
                    headerTemplate: "<div class='isRequired'> Forecasted Volume By Quarter </div>",
                    hidden: true,
                    width: 120,
                    filterable: { multi: true, search: true }
                },
                {
                    field: "CUST_PRD",
                    title: "Customer Product",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Customer Product </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "MEET_COMP_PRD",
                    title: "Comp Product",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Comp Product </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "MEET_COMP_PRC",
                    title: "Comp Price",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Comp Price </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    title: "Deal List",
                    field: "DEALS_USED_IN_EXCPT",
                    hidden: true,
                    width: 120,
                    filterable: { multi: true, search: true },
                    hidden: vm.hideColInGrid
                },
                {
                    field: "BUSNS_OBJ",
                    title: "Business Object",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Business Object </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "PTNTL_MKT_IMPCT",
                    title: "Potential Market Impact",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Potential Market Impact </div>",
                    width: 180,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "OTHER",
                    title: "Other",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Other </div>",
                    width: 120,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "JSTFN_PCT_EXCPT",
                    title: "Justification for PCT Expiry",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Justification for PCT Expiry </div>",
                    width: 220,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "EXCPT_RSTRIC_DURN",
                    title: "Exceptions, Restrictions & Durations",
                    editor: textareaEditor,
                    headerTemplate: "<div class='isRequired'> Exceptions, Restrictions & Durations </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "RQST_CLNT",
                    title: "Requesting Client",
                    headerTemplate: "<div class='isRequired'> Requesting Client </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "RQST_ATRNY",
                    title: "Requesting Attorney",
                    headerTemplate: "<div class='isRequired'> Requesting Attorney </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "APRV_ATRNY",
                    title: "Approving Attorney",
                    headerTemplate: "<div class='isRequired'> Approving Attorney </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "DT_APRV",
                    title: "Date Approved",
                    template: "#= kendo.toString(new Date(DT_APRV), 'M/d/yyyy') #",
                    headerTemplate: "<div class='isRequired'> Date Approved </div>",
                    width: 150,
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    editable: $scope.isEditable,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "CHG_EMP_NAME",
                    title: "Entered By",
                    headerTemplate: "<div class='isRequired'> Entered By </div>",
                    width: 150,
                    filterable: { multi: true, search: true },
                    editable: false,
                    hidden: vm.hideColInGrid
                },
                {
                    field: "CHG_DTM",
                    title: "Entered Date",
                    headerTemplate: "<div class='isRequired'> Entered Date </div>",
                    template: "#= kendo.toString(new Date(gridUtils.stripMilliseconds(CHG_DTM)), 'M/d/yyyy') #",
                    width: 150,
                    filterable: {
                        extra: false,
                        ui: "datepicker"
                    },
                    editable: false,
                    hidden: vm.hideColInGrid
                }
            ]            
        }

        //--------------------------------------------------------------------
        // CancelChanges
        //--------------------------------------------------------------------

        function cancelChanges() {
            var grid = $("#grid").data("kendoGrid");
            grid.cancelChanges();
        }

        //--------------------------------------------------------------------
        // Exception End Date Validtion
        //--------------------------------------------------------------------

        function exceptionEndDateValidation(input) {
            var row = input.closest("tr");
            var grid = row.closest("[data-role=grid]").data("kendoGrid");
            var dataItem = grid.dataItem(row);
            if (input.is("[name='PCT_LGL_EXCPT_END_DT']") && input.val() != "" &&
                moment(moment(input.val()).format('l')).isBefore(moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format('l'))) {
                input.attr("data-exceptionEndDateValidation-msg", "End Date cannot be before Start Date");
                return false;
            }
            return true;
        }

        //--------------------------------------------------------------------
        // Checking Max Length of Editable Field
        //--------------------------------------------------------------------

        function onGridEditing(arg) {
            arg.container.find("input[name='PCT_EXCPT_NBR']").attr('maxlength', '10');
            arg.container.find("input[name='VER_NBR']").attr('maxlength', '4');
        }

        //--------------------------------------------------------------------
        // To clear selected checkbox 
        //--------------------------------------------------------------------

        function ClearSelectedItem() {
            for (var i = 0; i < filterData.length; i++) {
                filterData[i].IS_SELECTED = false;
            }
            for (var i = 0; i < filterDataChildGrid.length; i++) {
                filterDataChildGrid[i].IS_SELECTED = false;
                filterDataChildGrid[i].IS_ChildGrid = false;
            }
        }

        //--------------------------------------------------------------------
        // IsInvalidateRow
        //--------------------------------------------------------------------

        function isInvalidateRow(e, mode) {
            vm.validationMessage = "";
            if (moment(moment(e.data.models[0].PCT_LGL_EXCPT_END_DT).format('l')).isBefore(moment().format('l'))) {
                e.data.models[0].ACTV_IND = false;
            }

            if (mode === "create") {
                if (e.data.models[0].ACTV_IND == false) {
                    $scope.$apply(function () {
                        vm.validationMessage = 'Cannot create inactive legal exception.';
                    });
                    return true;
                }
            }

            e.data.models[0].PCT_LGL_EXCPT_STRT_DT = moment(e.data.models[0].PCT_LGL_EXCPT_STRT_DT).format("l");
            e.data.models[0].PCT_LGL_EXCPT_END_DT = moment(e.data.models[0].PCT_LGL_EXCPT_END_DT).format("l");
            e.data.models[0].DT_APRV = moment(e.data.models[0].DT_APRV).format("l");
            e.data.models[0].VER_CRE_DTM = moment(e.data.models[0].VER_CRE_DTM).format("l");

            return false;
        }

        //--------------------------------------------------------------------
        // DetailInit
        //--------------------------------------------------------------------

        $scope.detailInit = function (parentDataItem) {       
           
            var id = parentDataItem.MYDL_PCT_LGL_EXCPT_SID;
            ClearSelectedItem();
            return {
                dataSource: {
                    transport: {
                        read: function (e) {                                                    
                            legalExceptionService.getVersionDetailsPCTExceptions(id, 1)
                                .then(function (response) {
                                    if (response.data.length > 0) {
                                        e.success(response.data);                                        
                                    }
                                }, function (response) {
                                    logger.error("Unable to get Legal exceptions.", response, response.statusText);
                                });
                        },
                        create: function (e) {
                        }
                    },
                    pageSize: 10,                  
                    schema: {
                        model: {
                            id: "MYDL_PCT_LGL_EXCPT_SID",
                            fields:
                            {                              
                                IS_SELECTED: { editable: true, defaultValue: false, type: "boolean" },                                
                                IS_ChildGrid: { editable: true, defaultValue: false, type: "boolean" },
                                VER_NBR: { type: "int", editable: false, defaultValue: 1 },
                                CHG_EMP_NAME: { type: "string", editable: false, defaultValue: usrName },
                                CHG_DTM: { type: "date", editable: false, defaultValue: moment().format('l') }
                            }
                        }
                    },
                },
                filterable: true,
                scrollable: false,
                sortable: true,
                enableHorizontalScrollbar: true,

                pageable: {
                    refresh: true,

                },
                navigatable: true,
                resizable: true,
                reorderable: true,
                columns:
                    [
                        {
                            command: [

                                { name: "select", template: "<div class='dealTools' ><input type='checkbox'  class='grid-link-checkbox with-font' id='lnkChk' ng-model='dataItem.IS_SELECTED' style='height: 17px;width: 17px; border: 2px solid;' ng-click='selectItemChildGrid($event, dataItem)' /> </div>" }
                            ],
                            width: 50,
                            attributes: { style: "text-align: center;" }

                        },
                        {
                            field: "VER_NBR",
                            title: "Version No",
                            headerTemplate: "<div class='isRequired'> Version No. </div>",
                            width: 100,                            
                            filterable: { multi: true, search: true },
                            editable: false
                        },

                        {
                            field: "CHG_EMP_NAME",
                            title: "Version Created By",
                            headerTemplate: "<div class='isRequired'> Version Created By </div>",                            
                            width: 200,
                            filterable: { multi: true, search: true },
                            editable: false
                        },
                        {
                            field: "MYDL_PCT_LGL_EXCPT_SID",
                            hidden: true,
                            width: 200,                            
                            filterable: { multi: true, search: true }
                        },
                        {
                            field: "VER_CRE_DTM",
                            title: "Version Created Date",
                            headerTemplate: "<div class='isRequired'>Version Created Date </div>",
                            template: "#= kendo.toString(new Date(gridUtils.stripMilliseconds(CHG_DTM)), 'M/d/yyyy') #",                            
                            width: 300,
                            filterable:
                            {
                                extra: false,
                                ui: "datepicker"
                            }
                        }
                        
                    ]
            };
        };

        //----------------------------------------------------------------------
        // To get the selected childgrid checkbox
        //----------------------------------------------------------------------

        $scope.selectItemChildGrid = function (event, dataItem) {
           
            if (event.target.checked) {
                for (var i = 0; i < filterDataChildGrid.length; i++) {
                    if (filterDataChildGrid[i].VER_NBR == dataItem.VER_NBR) {
                        filterDataChildGrid[i].IS_SELECTED = true;
                        filterDataChildGrid[i].IS_ChildGrid = true;
                        filterDataChildGrid[i].PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
                        filterDataChildGrid[i].PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
                        filterDataChildGrid[i].DT_APRV = moment(dataItem.DT_APRV).format("l");
                        filterDataChildGrid[i].CHG_DTM = moment(dataItem.CHG_DTM).format("l");
                    }
                }
               
            }
            else {
                for (var i = 0; i < filterDataChildGrid.length; i++) {
                    if (filterDataChildGrid[i].VER_NBR == dataItem.VER_NBR) {
                        filterDataChildGrid[i].IS_SELECTED = false;
                        filterDataChildGrid[i].IS_ChildGrid = false;

                    }
                }
               
            }
        }

        //----------------------------------------------------------------------
        // To get the selected checkbox data and make the IS_Selected as 'true'
        //----------------------------------------------------------------------
                
        $scope.selectItem = function (ChildGrid, event, dataItem)
        {
            var dataSource = $("#grid").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            filterData = query.filter(filters).data;

            if (dataItem.Select_All)
            {
                for (var i = 0; i < filterData.length; i++)
                {                  
                        filterData[i].IS_SELECTED = true;
                                       
                }     
            }
            else if (dataItem.Select_All == false)
            {
                for (var i = 0; i < filterData.length; i++) {
                    filterData[i].IS_SELECTED = false;                    
                }   
            }
            else
            {
                if (event.target.checked) {
                    for (var i = 0; i < filterData.length; i++)
                    {
                        if (filterData[i].id == dataItem.id)
                        {
                            filterData[i].IS_SELECTED = true;
                            filterData[i].PCT_LGL_EXCPT_STRT_DT = moment(dataItem.PCT_LGL_EXCPT_STRT_DT).format("l");
                            filterData[i].PCT_LGL_EXCPT_END_DT = moment(dataItem.PCT_LGL_EXCPT_END_DT).format("l");
                            filterData[i].DT_APRV = moment(dataItem.DT_APRV).format("l");
                            filterData[i].CHG_DTM = moment(dataItem.CHG_DTM).format("l");
                        }
                    }              
                }
                else {
                    for (var i = 0; i < filterData.length; i++) {
                        if (filterData[i].id == dataItem.id) {
                            filterData[i].IS_SELECTED = false;

                        }
                    }              
                }
            }
        }

        //--------------------------------------------------------------------
        // Open Amendment
        //--------------------------------------------------------------------

        $scope.openAmendment = function ()
        {    
            var selectedData = $linq.Enumerable().From(filterData)
                .Where(function (x) {
                    return (x.IS_SELECTED == true);
                })
                .ToArray();         

            var selectedChildGrid = $linq.Enumerable().From(filterDataChildGrid)
                .Where(function (x) {
                    return (x.IS_ChildGrid == true);
                })
                .ToArray();
            
            if (selectedChildGrid.length == 0)
            {
                if (selectedData.length != 0) {
                    if (selectedData.length == 1) {
                        var usedInDeal = selectedData[0]['USED_IN_DL'];
                        if (usedInDeal == 'Y') {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                backdrop: 'static',
                                templateUrl: 'app/admin/legalExceptions/addAmendment.html',
                                controller: 'addAmendmentController',
                                controllerAs: 'vm',
                                size: 'sm',
                                windowClass: 'prdSelector-modal-window',
                                resolve: {
                                    RuleConfig: ['legalExceptionService', function () {

                                    }],
                                    dataItem: function () {

                                        return selectedData;
                                    }
                                }
                            });
                            modalInstance.result.then(function (returnData) {
                                $("#grid").data("kendoGrid").refresh();
                                var grid = $("#childGrid").data("kendoGrid");
                                grid.refresh();                                
                                vm.cancel();
                            }, function () { });
                        }
                        else {
                            logger.warning('Exceptions without deals must be edited not amended');
                        }
                    }
                    else {
                        logger.warning('Please select only one Exception to add an amendment');
                    }
                }
                else
                {
                    logger.warning('Please select an Exception to add an amendment');
                }
            }
            else
            {
                logger.warning('Please select the current version of the exception to add an amendment');
            }           
        }

        //--------------------------------------------------------------------
        // Grid Menu Buttons
        //--------------------------------------------------------------------

        function GridMenuButton(addRecordsNotAllowed, amendmentAllowed) {
            var rtn = '';

            if (addRecordsNotAllowed)
            {
                rtn += '<a  role="button" class="k-button k-button-icontext" ng-click="addLegalException()"><span class="k-icon k-i-plus"></span>Add new record</a>';
            }

            rtn += '<a role="button" class="k-button k-button-icontext" href="\\#" onClick="gridUtils.clearAllFilters()"><span class="k-icon intelicon-cancel-filter-solid"></span>CLEAR FILTERS</a>';
            rtn += '<a  role="button" class="k-button k-button-icontext" ng-click="openCompareLegalException()"><span class="k-icon intelicon-related" style="font-size:30px;color: white !important;height: 20px;"></span>Compare</a>';

            if (amendmentAllowed)
            {
                rtn += '<a role="button" class="k-button k-button-icontext"  ng-click="openAmendment()"><span class="k-icon k-i-plus"></span>Add Amendment</a> ';
            }
            if (amendmentAllowed)
            {
                rtn += '<a role="button" class="k-button k-button-icontext"  ng-click="downloadException()"><span class="intelicon-ms-excel-outlined" style="font-size:23px;"></span>Download</a> ';
            }
          
            rtn += '<a role="button" class="k-button k-button-icontext" style="float: right; background-color: {{vm.btnColor}}" ng-click="showHideAllCol()"><i id="btnWordWrapControl" class="{{vm.btnName}}" title="{{vm.toolTip}}' +'" style="font-size:25px;"></i></a>';
            return rtn;
        }

        //--------------------------------------------------------------------
        // Child Grid
        //--------------------------------------------------------------------

        function ChildGrid(dataitem)
        {
            legalExceptionService.getVersionDetailsPCTExceptions(dataitem.id, 1)
                .then(function (response) {
                    if (response.data.length > 0) {
                        filterDataChildGrid = response.data;                                         
                    }
                }, function (response) {
                   
                });
            var grid = $("#childGrid").data("kendoGrid");
            grid.refresh();
          
        }

        //--------------------------------------------------------------------
        // Product Editor
        //--------------------------------------------------------------------

        function productEditor(container, options) {
            $('<input id="productEditor" validationMessage="* field is required" placeholder="Enter Products.."' +
                'required name="' + options.field + '" data-text-field="Name" data-value-field="Name" data-bind="value:' + options.field + '" />').appendTo(container)
                .kendoComboBox({
                    dataSource: {
                        serverFiltering: true,
                        transport: {
                            type: "json",
                            read: function (e) {
                                var param = e.data.filter.filters[0].value;
                                if (param === "") {
                                    e.success([]);
                                } else {
                                    var dto = {
                                        filter: param
                                    };
                                    productSelectorService.GetLegalExceptionProducts(dto).then(function (response) {
                                        e.success(response.data);
                                    }, function (response) {
                                        logger.error("Unable to get product suggestions.", response, response.statusText);
                                    });
                                }
                            },
                        }
                    },
                    autoBind: false,
                    serverFiltering: true,
                    filter: "startsWith",
                    height: 300,
                    delay: 700,
                    minLength: 2,
                    change: function (e) {
                        if (this.selectedIndex == -1) {
                            this.text("");
                        }
                    }
                });

            $('<span class="k-invalid-msg" data-for="' + options.field + '"></span>').appendTo(container);
        }

    }
    
})();