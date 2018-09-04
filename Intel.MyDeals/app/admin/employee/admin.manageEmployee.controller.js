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

        $scope.openEmployeeVerticals = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'manageEmployeeVerticalsModal',
                controller: 'manageEmployeeVerticalsModalCtrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return angular.copy(dataItem);
                    }
                }
            });

            modalInstance.result.then(function (returnData) {
                if (returnData !== undefined && returnData !== null) {
                    $scope.context.USR_VERTS = returnData;
                }
            }, function () { });
        }
        
        $scope.dataSourceOptions = {
            type: "json",
            transport: {
                read: function (e) {
                    manageEmployeeService.getEmployeeData()
                        .then(function (response) {
                            for (var c = 0; c < response.data.length; c++) {
                                if (response.data[c].USR_CUST === "") {
                                    response.data[c].USR_CUST = "[Please Add Customers]";
                                }
                                if (response.data[c].USR_VERTS === "") {
                                    response.data[c].USR_VERTS = "[Please Add Products]";
                                }
                                response.data[c].FULL_NAME = response.data[c].LST_NM + ", " + response.data[c].FRST_NM + " " + response.data[c].MI
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
                        EMP_WWID: { type: "string" }, // Changed from number to string so that we can remove the JS number formatting of inserting commas
                        FRST_NM: { type: "string" },
                        MI: { type: "string" },
                        LST_NM: { type: "string" },
                        FULL_NAME: { type: "string" },
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
        };
        $scope.dataSource = new kendo.data.DataSource($scope.dataSourceOptions);

        $scope.clearFilters = function () {
            $("form.k-filter-menu button[type='reset']").trigger("click");
        };

        $scope.exportExcel = function () {
            var previousPageSize = $scope.dataSource._take;
            var dataLength = $scope.dataSource._total;
            $scope.dataSource.pageSize(dataLength); // 'all' didn't work here and blanked out data.

            gridUtils.dsToExcel($scope.grid, $scope.dataSource, "Users Export", true);

            $scope.dataSource.pageSize(previousPageSize);
        };

        $scope.gridOptions = {
            toolbar: [
                { text: "", template: kendo.template($("#grid_toolbar_clearbutton").html()) },
                { text: "", template: kendo.template($("#grid_toolbar_exportexcel").html()) }
            ],
            dataSource: $scope.dataSource,
            filterable: true, //gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            pageable: {
                refresh: true,
                pageSizes: [25, 100, 500, "all"] //gridConstants.pageSizes
            },
            filter: function (e) {
                if (e.field == "USR_ROLE") {
                    if (e.filter !== undefined && e.filter !== null) { // Safety check for clearing out set.
                        e.filter.filters.forEach(function (f) {
                            //f.operator = "eq";
                            f.operator = "contains"; // Forced checkable items to reflect into concatonated list as a contains instead of equals
                        })
                    }
                }
                if (e.field == "USR_GEOS") {
                    if (e.filter !== undefined && e.filter !== null) { // Safety check for clearing out set.
                        e.filter.filters.forEach(function (f) {
                            f.operator = "contains";
                        })
                    }
                }
            },
            // This only works in Kendo UI 2017 R2, we are on 2017 R1
            filterMenuOpen: function (e) {
                //if (e.field == "USR_ROLE" || e.field == "USR_GEOS") { // Snazy code to remove the clear button from columns not needed due to safety check above.
                //    e.container.find("button[type='reset']").hide();
                //    e.container.find("button[type='submit']").css("width", "100%");
                //}
                if (e.sender.dataSource.filter()) {
                    e.sender.dataSource.filter().filters.forEach(function (f) {
                        if (f.filters === undefined) // Single-instance - no sub filters defined
                        {
                            if (f.field == "USR_ROLE" || f.field == "USR_GEOS") {
                                var checkbox = e.container.find("input[value='" + f.value + "']");
                                if (checkbox[0] !== undefined && !checkbox[0].checked) {
                                    e.container.find("input[value='" + f.value + "']").click()
                                }
                            }
                        }
                        else // Multi-instance - go through each instance
                        { 
                            if (f.field == "USR_ROLE" || f.field == "USR_GEOS") { // Safety code in case there is a single isolated element hanging off the object - likely not needed
                                var checkbox = e.container.find("input[value='" + f.value + "']");
                                if (checkbox[0] !== undefined && !checkbox[0].checked) {
                                    e.container.find("input[value='" + f.value + "']").click()
                                }
                            }
                            else // Branch taken if there is an embedded filter set..
                            {
                                f.filters.forEach(function (g) {
                                    if (g.field == "USR_ROLE" || g.field == "USR_GEOS") {
                                        var checkbox = e.container.find("input[value='" + g.value + "']");
                                        if (checkbox[0] !== undefined && !checkbox[0].checked) {
                                            e.container.find("input[value='" + g.value + "']").click()
                                        }
                                    }
                                })
                            }

                        }

                    })
                }
            },
            columns: [
            {
                field: "EMP_WWID",
                title: "WWID",
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            eq: "Is equal to",
                            contains: "Contains"
                        }
                    }
                },
                width: "100px"
            },
            {
                field: "FULL_NAME",
                title: "Name",
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }
                },
                width: "100px"
                //template: "#=LST_NM#, #=FRST_NM# #=MI#" // Replaced by FULL_NAME
            },
            {
                field: "USR_ROLE",
                title: "Roles",
                filterable: {
                    multi: true,
                    dataSource: [
                        { USR_ROLE: "CBA"},
                        { USR_ROLE: "DA" },
                        { USR_ROLE: "Finance" },
                        { USR_ROLE: "FSE"},
                        { USR_ROLE: "GA"} ,
                        { USR_ROLE: "Legal" },
                        { USR_ROLE: "RA" },
                        { USR_ROLE: "SA" },
                        { USR_ROLE: "MyDeals SA"},
                        { USR_ROLE: "Net ASP SA"},
                        { USR_ROLE: "Rebate Forecast SA"},
                        { USR_ROLE: "WRAP SA"}]
                },
                width: "100px",
            },
            {
                field: "USR_GEOS",
                title: "Geos",
                filterable: {
                    multi: true,
                    dataSource: [
                        { USR_GEOS: "APAC"} ,
                        { USR_GEOS: "ASMO"} ,
                        { USR_GEOS: "EMEA"} ,
                        { USR_GEOS: "IJKK"} ,
                        { USR_GEOS: "PRC"} ,
                        { USR_GEOS: "Worldwide"}]
                },
                width: "100px",
            },
            {
                field: "USR_CUST",
                title: "Customers",
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }
                },
                template: "#=gridUtils.customersFormatting(data, 'USR_CUST', 'USR_ROLE', 'USR_GEOS')#",
                width: "250px",
            },
            {
                field: "USR_VERTS",
                title: "Verticals",
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }
                },
                template: "#=gridUtils.verticalsFormatting(data, 'USR_VERTS', 'USR_ROLE', 'USR_GEOS')#",
                width: "200px",
            },
            {
                field: "ACTV_IND",
                title: "Active",
                template: "#=gridUtils.booleanDisplay(data, 'ACTV_IND')#",
                attributes: { style: "text-align: center;" },
                width: "100px",
            },
            {
                field: "IS_SUPER",
                title: "Super",
                template: "#=gridUtils.booleanDisplay(data, 'IS_SUPER')#",
                attributes: { style: "text-align: center;" },
                width: "100px",
            },
            {
                field: "IS_DEVELOPER",
                title: "Developer",
                template: "#=gridUtils.booleanDisplay(data, 'IS_DEVELOPER')#",
                attributes: { style: "text-align: center;" },
                width: "100px",
            },
            {
                field: "IS_TESTER",
                title: "Tester",
                template: "#=gridUtils.booleanDisplay(data, 'IS_TESTER')#",
                attributes: { style: "text-align: center;" },
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
            // Set active indicator filter to default = true
            $("#grdManageEmployee").data("kendoGrid").dataSource.filter({
                field: "ACTV_IND",
                operator: "eq",
                value: true
            });

            // If this page passes a WWID, Force filter upon that WWID.
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