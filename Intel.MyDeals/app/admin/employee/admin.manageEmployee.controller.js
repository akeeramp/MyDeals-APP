(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('manageEmployeeController', manageEmployeeController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    manageEmployeeController.$inject = ['manageEmployeeService', '$scope', 'logger', 'gridConstants', '$uibModal', '$location', '$timeout'];

    function manageEmployeeController(manageEmployeeService, $scope, logger, gridConstants, $uibModal, $location, $timeout) {
        $scope.isDropdownsLoaded = false;

        $scope.openEmployeeCustomers = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'manageEmployeeModal',
                controller: 'manageEmployeeModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return angular.copy(dataItem);
                    }
                }
            });

            modalInstance.result.then(function (returnData) {
                if (returnData !== undefined && returnData !== null)
                {
                    $scope.context.USR_CUST = returnData;
                }
            }, function () { });
        }

        $scope.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    manageEmployeeService.getEmployeeData()
                        .then(function (response) {
                            for (var c = 0; c < response.data.length; c++)
                            {
                                if (response.data[c].USR_CUST === "")
                                {
                                    response.data[c].USR_CUST = "[Please Add Customers]";
                                }
                            }
                            e.success(response.data);
                            $scope.isDropdownsLoaded = true;
                        }, function (response) {
                            logger.error("Unable to get User Data.", response, response.statusText);
                        });
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "EMP_WWID",
                    fields: {
                        EMP_WWID: { type: "number" },
                        FRST_NM: { type: "string" },
                        MI: { type: "string" },
                        LST_NM: { type: "string" },
                        ACTV_IND: { type: "boolean" },
                        USR_ROLE: { type: "string" },
                        USR_GEOS: { type: "string" },
                        USR_CUST: { type: "string" },
                        USR_VERTS: { type: "string" },
                        IS_SUPER: { type: "boolean" },
                        IS_DEVELOPER: { type: "boolean" },
                        IS_TESTER: { type: "boolean" },
                        LST_MOD_BY: { type: "string" },
                        LST_MOD_DT: { type: "string" }

                    }
                }
            }
        });

        $scope.gridOptions = {
            dataSource: $scope.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            columns: [
            {
                field: "EMP_WWID",
                title: "WWID",
                width: "100px"
            },
            {
                field: "LST_NM",
                title: "Name",
                width: "100px",
                template: "#=LST_NM#, #=FRST_NM# #=MI#"
            },
            {
                field: "USR_ROLE",
                title: "Roles",
                width: "100px",
            },
            {
                field: "USR_GEOS",
                title: "Geos",
                width: "100px",
            },
            {
                field: "USR_CUST",
                title: "Customers",
                template: "#=gridUtils.customersFormatting(data, 'USR_CUST', 'USR_ROLE', 'USR_GEOS')#",
                width: "250px",
            },
            {
                field: "USR_VERTS",
                title: "Verticals",
                width: "100px",
            },
            {
                field: "ACTV_IND",
                title: "Active",
                template: "#=gridUtils.booleanDisplay(data, 'ACTV_IND')#",
                attributes: { style: "text-align: center;" },
                filterable: false,
                width: "100px",
            },
            {
                field: "IS_SUPER",
                title: "Super",
                template: "#=gridUtils.booleanDisplay(data, 'IS_SUPER')#",
                attributes: { style: "text-align: center;" },
                filterable: false,
                width: "100px",
            },
            {
                field: "IS_DEVELOPER",
                title: "Developer",
                template: "#=gridUtils.booleanDisplay(data, 'IS_DEVELOPER')#",
                attributes: { style: "text-align: center;" },
                filterable: false,
                width: "100px",
            },
            {
                field: "IS_TESTER",
                title: "Tester",
                template: "#=gridUtils.booleanDisplay(data, 'IS_TESTER')#",
                attributes: { style: "text-align: center;" },
                filterable: false,
                width: "100px",
            },
            {
                field: "LST_MOD_BY",
                title: "Last Mod By",
                filterable: false,
                width: "100px",
            },
            {
                field: "LST_MOD_DT",
                title: "Last Mod Date",
                filterable: false,
                width: "100px",
            }]
        }

        $timeout(function () {
            if ($location.search().id !== undefined) {
                $("#grdManageEmployee").data("kendoGrid").dataSource.filter({
                    field: "EMP_WWID",
                    operator: "eq",
                    value: $location.search().id
                });
            }
        }, 50);
    }
})();