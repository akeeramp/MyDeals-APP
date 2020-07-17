(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DataFixController', DataFixController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];
    DataFixController.$inject = ['$rootScope', '$scope', '$timeout', 'dataFixService', 'logger', 'gridConstants', 'dropdownsService', 'customerService'];

    function DataFixController($rootScope, $scope, $timeout, dataFixService, logger, gridConstants, dropdownsService, customerService) {
        $scope.accessAllowed = true;
        if (!(window.usrRole === 'SA' || window.isDeveloper)) {
            // Kick not valid users out of the page
            $scope.accessAllowed = false;
            document.location.href = "/Dashboard#/portal";
        }

        var vm = this;
        vm.DataFixes = [];
        vm.currentDataFix = {};
        vm.IsEditMode = false;
        vm.OpDataElements = [];
        vm.MyCustomersInfo = [];
        vm.Actions = [];

        vm.Init = function () {
            dataFixService.getDataFixes().then(function (result) {
                vm.DataFixes = result.data;
                vm.dataSourceDataFixes.read();
            }, function (response) {
                logger.error("Unable to get data fixes");
            });

            dataFixService.getDataFixActions().then(function (result) {
                vm.Actions = result.data;
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
                if (vm.currentDataFix.IncidentNumber === null || jQuery.trim(vm.currentDataFix.IncidentNumber) === "")
                    requiredFields.push("Incident Number");
                if (isExecute && vm.currentDataFix.DataFixAttributes.filter(x => ((x.value === undefined || x.value == null || jQuery.trim(x.value) === "") && (x.values === undefined || x.values === null || x.values.length === 0))
                    || x.DataElement === "" || x.Attribute === "" || jQuery.trim(x.RvsNumber) === "" || jQuery.trim(x.ObjectId) === "" || jQuery.trim(x.ObjectId) === "0" || x.MDX === "" || x.CustId === "").length > 0)
                    requiredFields.push("Mandatory data in attributes section cannot be empty");
                if (isExecute && vm.currentDataFix.DataFixActions.filter(x => x.DataElement === "" || x.Action === "" || jQuery.trim(x.TargetObjectIds) === "").length > 0)
                    requiredFields.push("Mandatory data in actions section cannot be empty");

                var regExpForObjectIds = /[0-9,]+$/;
                if (vm.currentDataFix.DataFixActions.filter(x => jQuery.trim(x.TargetObjectIds) !== "" && !regExpForObjectIds.exec(jQuery.trim(x.TargetObjectIds))).length > 0)
                    requiredFields.push("Target object IDs in actions has illegal characters!");

                if (requiredFields.length > 0) {
                    kendo.alert("<b>Please fill the following required fields!</b></br>" + requiredFields.join("</br>"));
                } else {
                    dataFixService.updateDataFix(vm.currentDataFix, isExecute).then(function (result) {
                        if (isExecute && result.data.DataFixActions.filter(x => x.TargetObjectIds === "").length > 0) {
                            kendo.alert("Target Object Ids cannot be empty in actions!");
                        } else {
                            if (vm.DataFixes.filter(x => x.IncidentNumber == result.data.IncidentNumber).length > 0)
                                vm.DataFixes.filter(x => x.IncidentNumber == result.data.IncidentNumber)[0] = result.data;
                            else
                                vm.DataFixes.push(result.data);

                            vm.dataSourceDataFixes.read();
                            if (isExecute) {
                                kendo.alert("Executed and Data has been fixed!");
                            } else
                                vm.IsEditMode = false;
                            logger.success("Data fix has been updated successfully!");
                        }                        
                    }, function (response) {
                        logger.error("Unable to update data fix");
                    });
                }
            });
        }

        vm.EditDataFix = function (incidentNumber) {
            vm.currentDataFix = vm.DataFixes.find(x => x.IncidentNumber == incidentNumber);
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
                    field: "IncidentNumber",
                    title: "Incident Number",
                    template: "<div class='incNbr' ng-click='vm.EditDataFix(#= IncidentNumber #)'>#=IncidentNumber#</div>",
                },
                {
                    field: "Message",
                    title: "Message"
                },
                {
                    width: "250px",
                    field: "CreatedBy",
                    title: "Created By"
                },
                {
                    width: "250px",
                    field: "CreatedOn",
                    title: "Created On"
                }
            ]
        }

        var allowedRoleForCreatedBy = ["GA", "FSE"];
        vm.AttributeSettings = [
            {
                field: "CRE_EMP_NAME",
                title: "Created by name",
                type: "list",
                width: 150.0,
                lookupText: "NAME",
                lookupValue: "EMP_WWID",
                lookupUrl: "/api/Employees/GetUsrProfileRoleByRoleCd/" + allowedRoleForCreatedBy.join()
            },
            {
                field: "WIP_DEAL_OBJ_SID",
                title: "Deal #",
                type: "string_limited",
                width: 150
            },
            {
                field: "OBJ_SET_TYPE_CD",
                title: "Deal Type",
                type: "singleselect_read_only",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "ECAP" }]
            },
            {
                field: "CUST_NM",
                title: "Customer",
                type: "list",
                width: 150.0,
                lookupText: "CUST_NM",
                lookupValue: "CUST_SID",
                lookupUrl: "/api/Customers/GetMyCustomersNameInfo"
            },
            {
                field: "END_CUSTOMER_RETAIL",
                title: "End Customer",
                type: "string_with_in",
                width: 150
            },
            {
                field: "GEO_COMBINED",
                title: "Deal Geo",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Worldwide" }, { Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
            },
            {
                field: "HOST_GEO",
                title: "Customer Geo",
                type: "list",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "APAC" }, { Value: "ASMO" }, { Value: "EMEA" }, { Value: "IJKK" }, { Value: "PRC" }]
            },
            {
                field: "PRODUCT_FILTER",
                title: "Product",
                type: "string",
                width: 150,
                dimKey: 20
            },
            {
                field: "DEAL_DESC",
                title: "Deal Description",
                type: "string",
                width: 150,
                dimKey: 20
            },
            {
                field: "OP_CD",
                title: "Op Code",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/OP_CD"
            },
            {
                field: "DIV_NM",
                title: "Product Division",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/DIV_NM"
            },
            {
                field: "FMLY_NM",
                title: "Family",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/FMLY_NM"
            },
            {
                field: "PRD_CAT_NM",
                title: "Product Verticals",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/PRD_CAT_NM"
            },
            {
                field: "SERVER_DEAL_TYPE",
                title: "Server Deal Type",
                type: "list",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/SERVER_DEAL_TYPE/ECAP"
            },
            {
                field: "MRKT_SEG",
                title: "Market Segment",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdownHierarchy/MRKT_SEG"
            },
            {
                field: "PAYOUT_BASED_ON",
                title: "Payout Based On",
                type: "singleselect_ext",
                width: 150,
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN",
                lookupUrl: "/api/Dropdown/GetDropdowns/PAYOUT_BASED_ON"
            },
            {
                field: "COMP_SKU",
                title: "Meet Comp Sku",
                type: "string_with_in",
                width: 150
            },
            {
                field: "ECAP_PRICE",
                title: "ECAP (Price)",
                type: "money",
                width: 150,
                dimKey: 20,
                format: "{0:c}"
            },
            {
                field: "VOLUME",
                title: "Ceiling Volume",
                type: "number",
                width: 150
            },
            {
                field: "VOL_INCR",
                title: "Ceiling Volume Increase",
                type: "numericOrPercentage",
                width: 150
            },
            {
                field: "END_DT",
                title: "End Date",
                type: "date",
                template: "#if(END_DT==null){#  #}else{# #= moment(END_DT).format('MM/DD/YYYY') # #}#",
                width: 150
            },
            {
                field: "END_DT_PUSH",
                title: "End Date Push",
                type: "number",
                width: 150,
                post_label: "Days"
            },
            {
                field: "HAS_TRCK",
                title: "Has Tracker",
                type: "singleselect",
                width: 150,
                lookupText: "Value",
                lookupValue: "Value",
                lookups: [{ Value: "Yes" }, { Value: "No" }]
            },
            {
                field: "MTRL_ID",
                title: "Material Id",
                type: "autocomplete",
                width: 150
            },
            {
                field: "DEAL_PRD_NM",
                title: "Level 4",
                type: "autocomplete",
                width: 150
            },
            {
                field: "PCSR_NBR",
                title: "Processor Number",
                type: "list",
                width: 150,
                lookupText: "value",
                lookupValue: "value",
                lookupUrl: "/api/Dropdown/GetDictDropDown/PCSR_NBR"
            },
            {
                field: "QLTR_BID_GEO",
                title: "Bid Geo",
                type: "list",
                subType: "xml",
                width: 150,
                lookupText: "dropdownName",
                lookupValue: "dropdownName",
                lookupUrl: "/api/Dropdown/GetGeosDropdowns"
            }
        ];

        vm.Init();
    }
})();