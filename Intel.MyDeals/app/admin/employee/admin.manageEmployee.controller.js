(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('manageEmployeeController', manageEmployeeController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    manageEmployeeController.$inject = ['manageEmployeeService', '$scope', 'logger', 'gridConstants'];

    function manageEmployeeController(manageEmployeeService, $scope, logger, gridConstants) {
        // Functions
        //$scope.roleTypeId = window.usrRoleId;
        //$scope.isDeveloper = window.isDeveloper;
        //$scope.isTester = window.isTester;
        //$scope.isSuper = window.isSuper;
        //$scope.isAdmin = window.isAdmin;
        //$scope.isFinanceAdmin = window.isFinanceAdmin;

        $scope.isDropdownsLoaded = true;
        $scope.tbWWID = "";
        $scope.tbIDSID = "";
        $scope.cbUser = "";

        $scope.selectedUser = {};

        $scope.getUserData = function()
        {
            debugger;
            var wwid =  $scope.tbWWID ? $scope.tbWWID : "";
            var idsid = $scope.tbIDSID ? $scope.tbIDSID : "";

            //var data = {
            //    "WWID": $scope.tbWWID ? $scope.tbWWID : "",
            //    "IDSID": $scope.tbIDSID ? $scope.tbIDSID : "",
            //    "USER": $scope.cbUser ? $scope.cbUser : ""
            //}

            manageEmployeeService.getEmployee(wwid, idsid)
                .then(function (response) {
                    debugger;
                    logger.success("Role was changed", "Done");
                }, function (response) {
                    debugger;
                    logger.error("Unable to get User Information.", response, response.statusText);
                });
        }

        $scope.ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Employees/GetUsrProfileRole",
                    dataType: "json"
                }
            },
        });

        $scope.systemUsers = {
            placeholder: "Pick a user",
            autoBind: true,
            dataTextField: "IDSID",
            dataValueField: "EMP_WWID",
            valueTemplate: '<span class="k-state-default">#: data.FRST_NM # #: data.LST_NM #</span>',
            template: '<span class="k-state-default">#: data.FRST_NM # #: data.LST_NM #</span>',
            dataSource: $scope.ds
        };
        //debugger;

        $scope.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    manageEmployeeService.getEmployeeData()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get User Data.", response, response.statusText);
                        });
                },
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
                pageSizes: gridConstants.pageSizes,
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

    }
})();