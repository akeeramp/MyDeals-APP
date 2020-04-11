(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('VistexProductVerticalController', VistexProductVerticalController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    VistexProductVerticalController.$inject = ['$scope', 'logger', '$timeout', 'dsaService']

    function VistexProductVerticalController($scope, logger, $timeout, dsaService) {
        var vm = this;
        vm.spinnerMessageHeader = "Product Vertical Logs";
        vm.spinnerMessageDescription = "Please wait while we loading product vertical logs..";
        vm.isBusyShowFunFact = true;
        vm.Vistex = [];
        vm.SelectedStatus = null;
        vm.VistexStatuses = [];  

        vm.init = function () {
            var postData = {
                "Dealmode": 'PROD_VERT_RULES',
                "StartDate": moment().subtract(3, 'months').format("MM/DD/YYYY"),
                "EndDate": moment().format("MM/DD/YYYY")
            }
            dsaService.getVistexLogs(postData).then(function (response) {
                vm.Vistex = response.data;
                vm.vistexDataSource.read();
            }, function (response) {
                logger.error("Operation failed");
            });

            dsaService.getVistexStatuses().then(function (response) {
                vm.VistexStatuses = response.data;
                vm.VistexStatusesDataSource.read();
            }, function (response) {
                logger.error("Unable to get statuses of vistex");
            });
        }

        vm.UpdateVistexStatus = function (strTransantionId) {
            if (vm.EnteredMessage == '')
                vm.EnteredMessage = null;
            vm.spinnerMessageDescription = "Please wait while updating the status..";
            dsaService.updateVistexStatus(strTransantionId, vm.SelectedStatus, null, vm.EnteredMessage).then(function (response) {
                if (response.data == strTransantionId) {
                    angular.forEach(vm.Vistex.filter(x => x.BTCH_ID === response.data), function (dataItem) {
                        dataItem.RQST_STS = vm.SelectedStatus;
                        dataItem.ERR_MSG = vm.EnteredMessage == null ? '' : vm.EnteredMessage;
                    });
                    vm.vistexDataSource.read();
                    logger.success("Status has been updated with the message!");
                } else {
                    logger.error("Unable to update the status!");
                }
            }, function (response) {
                logger.error("Unable to update the status!");
            });
        }

        vm.vistexDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success(vm.Vistex);
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "RQST_SID",
                    fields: {
                        RQST_SID: { editable: false, nullable: false },
                        BTCH_ID: { editable: false, nullable: true },
                        RQST_STS: { editable: true },
                        ERR_MSG: { editable: true },
                        CRE_DTM: { editable: false, nullable: false },
                        INTRFC_RQST_DTM: { editable: false, nullable: true },
                        INTRFC_RSPN_DTM: { editable: false, nullable: true },
                    }
                }
            },
            //sort: { field: "CreatedOn", dir: "desc" }
        });

        vm.MessageEditor = function (container, options) {
            vm.EnteredMessage = options.model.ERR_MSG;
            var editor = $('<input class="form-control md" type="text" ng-model="vm.EnteredMessage" placeholder="Enter your message here.." title="Enter your message here.." style="width:95%;">').appendTo(container);
        }

        vm.StatusDropDownEditor = function (container, options) {
            vm.SelectedStatus = options.model.RQST_STS;
            var editor = $('<select kendo-drop-down-list k-data-source="vm.VistexStatusesDataSource" k-options="vm.StatusesOptions" k-ng-model="vm.SelectedStatus" style="width:100%"></select>').appendTo(container);
        }

        vm.StatusesOptions = {
            valuePrimitive: true,
            maxSelectedItems: 1,
            autoBind: true
        };

        vm.VistexStatusesDataSource = {
            transport: {
                read: function (e) {
                    e.success(vm.VistexStatuses);
                }
            }
        };

        vm.vistexOptions = {
            dataSource: vm.vistexDataSource,
            filterable: true,
            sortable: true,
            selectable: true,
            resizable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbarRestricted(true),
            editable: { mode: "inline", confirmation: false },
            pageable: {
                refresh: true
            },
            save: function (e) {
                vm.UpdateVistexStatus(e.model.BTCH_ID);
            },
            edit: function (e) {
                var commandCell = e.container.find("td:eq(1)");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },
            columns: [
                {
                    command: [
                        {
                            name: "edit",
                            template: "<a ng-if='dataItem.BTCH_ID != \"00000000-0000-0000-0000-000000000000\"' class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
                        }
                    ],
                    title: " ",
                    width: "70px"
                },
                { field: "BTCH_ID", title: "Transanction Id", width: "320px", filterable: { multi: true, search: true }, template: "<span>#if(BTCH_ID == '00000000-0000-0000-0000-000000000000'){#-#} else {##= BTCH_ID ##}#</span>" },                
                { field: "RQST_STS", title: "Status", width: "250px", filterable: { multi: true, search: true }, editor: vm.StatusDropDownEditor },
                { field: "ERR_MSG", title: "Message", filterable: { multi: true, search: true }, editor: vm.MessageEditor },
                { field: "CRE_DTM", title: "Created On", width: "125px", filterable: { multi: true, search: true } },
                { field: "INTRFC_RQST_DTM", title: "Send To PO On", width: "125px", filterable: { multi: true, search: true }, template: "<span>#if(INTRFC_RQST_DTM == '1/1/1900'){#-#} else {##= INTRFC_RQST_DTM ##}#</span>" },
                { field: "INTRFC_RSPN_DTM", title: "Processed On", width: "125px", filterable: { multi: true, search: true }, template: "<span>#if(INTRFC_RSPN_DTM == '1/1/1900'){#-#} else {##= INTRFC_RSPN_DTM ##}#</span>" }
            ]
        };

        vm.GetVistexDataBody = function (dataItem) {
            return {
                dataSource: {
                    transport: {
                        read: "/api/DSA/GetProductVerticalBody/" + dataItem.RQST_SID
                    },
                    pageSize: 25
                },
                filterable: true,
                sortable: true,
                selectable: true,
                resizable: true,
                columnMenu: true,
                pageable: {
                    refresh: true
                },
                columns: [
                    { field: "GDM_PRD_TYPE_NM", title: "Type", filterable: { multi: true, search: true } },
                    { field: "GDM_VRT_NM", title: "Name", filterable: { multi: true, search: true } },
                    { field: "OP_CD", title: "OP Code", filterable: { multi: true, search: true } },
                    { field: "DIV_NM", title: "Division", filterable: { multi: true, search: true } },
                    { field: "DEAL_PRD_TYPE", title: "Deal Type", filterable: { multi: true, search: true } },
                    { field: "PRD_CAT_NM", title: "Category", filterable: { multi: true, search: true } },
                    { field: "ACTV_IND", title: "Is Active?", filterable: { multi: true, search: true }, template: "<span>#if(ACTV_IND){#Yes#} else {#No#}#</span>" },
                    { field: "CRE_DTM", title: "Created On", filterable: { multi: true, search: true } },
                    { field: "CHG_DTM", title: "Updated On", filterable: { multi: true, search: true } }
                ]
            }
        }

        vm.init();
    }
})();