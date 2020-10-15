(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DataFixController', DataFixController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];
    DataFixController.$inject = ['$rootScope', '$scope', '$timeout','$linq', 'dataFixService', 'logger', 'gridConstants', 'dropdownsService', 'customerService'];

    function DataFixController($rootScope, $scope, $timeout, $linq, dataFixService, logger, gridConstants, dropdownsService, customerService) {
        $scope.accessAllowed = true;
        if (!window.isDeveloper) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }
        
        var vm = this;
        vm.disabled = false;
        vm.DataFixes = [];
        vm.currentDataFix = {};
        vm.IsEditMode = false;
        vm.OpDataElements = [];
        vm.MyCustomersInfo = [];
        vm.Actions = [];
        vm.isSuccess = false;
        vm.isAtrbSelected = true;
        vm.isActnSelected = true;

        vm.Init = function () {
            dataFixService.getDataFixes().then(function (result) {
                vm.DataFixes = result.data;
                vm.dataSourceDataFixes.read();
            }, function (response) {
                logger.error("Unable to get data fixes");
            });

            dataFixService.getDataFixActions().then(function (result) {
                vm.Actions = $linq.Enumerable().From(result.data)
                    .Where(function (x) {
                        return (x.DdlType === 'ACTN_LIST');
                    }).ToArray();
                
                vm.AttributeSettings = $linq.Enumerable().From(result.data)
                    .Where(function (x) {
                        return (x.DdlType === 'ATRB_LIST');
                    }).ToArray();
                
            }, function (response) {
                logger.error("Unable to get actions");
            });

            dropdownsService.getOpDataElements().then(function (response) {                
                vm.OpDataElements = response.data;
            }, function (response) {
                logger.error("Unable to get op data elements.", response, response.statusText);
            });

            customerService.getMyCustomersNameInfo().then(function (response) {
                vm.MyCustomersInfo = response.data;
            }, function (response) {
                logger.error("Unable to get customers.", response, response.statusText);
            });
        }

        vm.SaveFix = function (isExecute) {
            $rootScope.$broadcast("save-datafix-attribute");
            $rootScope.$broadcast("save-datafix-action");
            $timeout(function () {
                var requiredFields = [];
                if (vm.currentDataFix.INCDN_NBR === null || jQuery.trim(vm.currentDataFix.INCDN_NBR) === "")
                    requiredFields.push("Incident Number");
                if (vm.isAtrbSelected && isExecute && vm.currentDataFix.DataFixAttributes.filter(x => x.OBJ_TYPE_SID === "" || jQuery.trim(x.ATRB_RVS_NBR) === "" || jQuery.trim(x.OBJ_SID) === "" || jQuery.trim(x.OBJ_SID) === "0" || x.MDX_CD === "" || x.CUST_MBR_SID === "").length > 0)
                    requiredFields.push("Mandatory data in attributes section cannot be empty");
                if (vm.isActnSelected && isExecute && vm.currentDataFix.DataFixActions.filter(x => x.OBJ_TYPE_SID === "" || x.ACTN_NM === "").length > 0)
                    requiredFields.push("Mandatory data in actions section cannot be empty");
                var regExpForObjectIds = /[0-9,]+$/;
                if (vm.currentDataFix.DataFixActions.filter(x => jQuery.trim(x.ACTN_VAL_LIST) !== "" && !regExpForObjectIds.exec(jQuery.trim(x.ACTN_VAL_LIST))).length > 0)
                    requiredFields.push("Target object IDs in actions has illegal characters!");
                if (requiredFields.length > 0) {
                    kendo.alert("<b>Please fill the following required fields!</b></br>" + requiredFields.join("</br>"));
                } else {
                    vm.disabled = true;
                    dataFixService.updateDataFix(vm.currentDataFix, isExecute).then(function (result) {
                        if (result.data.RESULT == "1") {                            
                            vm.isSuccess = true;
                            logger.success("Data fix has been updated successfully!");
                        } else {
                            logger.error("Unable to update data fix");
                        }                        

                    }, function (response) {
                        logger.error("Unable to update data fix");
                    });
                }
            });
        }

        vm.EditDataFix = function (INCDN_NBR) {
            vm.currentDataFix = vm.DataFixes.find(x => x.INCDN_NBR == INCDN_NBR);
            vm.IsEditMode = true;
        }

        vm.addNewFix = function () {
            vm.currentDataFix = { DataFixAttributes: [], DataFixActions: [] };
            vm.IsEditMode = true;
        }

        vm.ok = function () {
            vm.IsEditMode = false;
        }

        vm.dataSourceDataFixes = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.DataFixes);
                }
            },
            pageSize: 25
        });

        vm.gridOptions = {
            dataSource: vm.dataSourceDataFixes,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            reorderable: true,
            scrollable: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            pageable: {
                refresh: true,
                pageSizes: [25, 100, 500] //gridConstants.pageSizes
            },
            columns: [
                {
                    width: "250px",
                    field: "INCDN_NBR",
                    title: "Incident Number",
                    template: "<div class='incNbr'>#=INCDN_NBR#</div>",
                },
                {
                    field: "INCDN_MSG",
                    title: "Message"
                },
                {
                    field: "INCDN_STS",
                    title: "Incident Status"
                },
                {
                    width: "250px",
                    field: "CRE_EMP_NM",
                    title: "Created By"
                },
                {
                    width: "250px",
                    field: "CRE_DTM",
                    title: "Created On"
                }
            ]
        }

        var allowedRoleForCreatedBy = ["GA", "FSE"];       

        vm.Init();
    }
})();