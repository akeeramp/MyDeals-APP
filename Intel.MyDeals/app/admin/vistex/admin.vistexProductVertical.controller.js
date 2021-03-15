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
        //Developer can see the Screen..
        //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        vm.spinnerMessageHeader = "Product Vertical Logs";
        vm.spinnerMessageDescription = "Please wait while we loading product vertical logs..";
        vm.isBusyShowFunFact = true;
        vm.Vistex = [];
        vm.SelectedStatus = null;
        vm.VistexStatuses = [];
        vm.startDate = moment().subtract(30, 'days').format("MM/DD/YYYY");
        vm.endDate = moment().format("MM/DD/YYYY");

        vm.init = function () {
            vm.startDate = moment(vm.startDate).format("MM/DD/YYYY");
            vm.endDate = moment(vm.endDate).format("MM/DD/YYYY");

            if (moment(vm.startDate, "MM/DD/YYYY", true).isValid() && moment(vm.endDate, "MM/DD/YYYY", true).isValid() && moment(vm.startDate).isBefore(vm.endDate)) {
                var postData = {
                    "Dealmode": 'PROD_VERT_RULES',
                    "StartDate": vm.startDate,
                    "EndDate": vm.endDate
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
            else {
                kendo.alert("Please provide valid <b>Start and End Date</b>");
                vm.startDate = moment().subtract(30, 'days').format("MM/DD/YYYY");
                vm.endDate = moment().format("MM/DD/YYYY");
            }
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
                        RQST_JSON_DATA: { editable: false, nullable: true }
                    }
                }
            },
            //sort: { field: "CreatedOn", dir: "desc" }
        });

        $scope.detailInit = function (parentDataItem) {
            var columns = [];

            if (parentDataItem.RQST_JSON_DATA.length > 0) {
                columns.push({
                    field: "RQST_JSON_DATA",
                    title: "Request JSON Data",
                    template: "<div>#=RQST_JSON_DATA#</div>",
                    width: "50%",
                    filterable: { multi: true, search: false }
                });
            }

            return {
                dataSource: {
                    transport: {
                        read: function (e) {
                            e.success(parentDataItem);
                        },
                        create: function (e) {
                        }
                    },
                    pageSize: 1,
                    serverPaging: false,
                    serverFiltering: false,
                    serverSorting: false,
                    schema: {
                        model: {
                            id: "ID",
                            fields: {
                                ID: {
                                    nullable: true
                                },
                                RQST_JSON_DATA: { type: "string" },
                            }
                        }
                    },
                },
                filterable: false,
                sortable: false,
                resizable: true,
                reorderable: false,
                columns: columns
            };
        };

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
            detailTemplate: "<div class='childGrid opUiContainer md k-grid k-widget' kendo-grid k-options='detailInit(dataItem)'></div>",
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
                { field: "RQST_SID", title: "Request ID", width: "130px", filterable: { multi: true, search: true } },
                { field: "BTCH_ID", title: "Batch ID", width: "320px", filterable: { multi: true, search: true }, template: "<span>#if(BTCH_ID == '00000000-0000-0000-0000-000000000000'){#-#} else {##= BTCH_ID ##}#</span>" },
                { field: "RQST_STS", title: "Status", width: "250px", filterable: { multi: true, search: true }, editor: vm.StatusDropDownEditor },
                { field: "ERR_MSG", title: "Message", filterable: { multi: true, search: true }, editor: vm.MessageEditor },
                { field: "INTRFC_RQST_DTM", title: "Send To PO On", width: "160px", filterable: { multi: true, search: true }, template: "<span>#if(INTRFC_RQST_DTM == '1/1/1900'){#-#} else {##= INTRFC_RQST_DTM ##}#</span>" },
                { field: "INTRFC_RSPN_DTM", title: "Processed On", width: "150px", filterable: { multi: true, search: true }, template: "<span>#if(INTRFC_RSPN_DTM == '1/1/1900'){#-#} else {##= INTRFC_RSPN_DTM ##}#</span>" },
                { field: "CRE_DTM", title: "Created On", width: "140px", filterable: { multi: true, search: true } }

            ]
        };


        vm.init();
    }
})();