(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('notificationsController', notificationsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    notificationsController.$inject = ['$scope', 'dataService', 'notificationsService', 'gridConstants', '$uibModal'];

    function notificationsController($scope, dataService, notificationsService, gridConstants, $uibModal) {
        var vm = this;

        vm.gridData = [];
        $scope.filter = "";

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    e.success(vm.gridData);
                },
            },
            batch: true,
            pageSize: 25,
            schema: {
                model: {
                    id: "NLT_ID",
                    fields: {
                        IS_READ_IND: { validation: { required: true } },
                        IsSelected: { type: "boolean" },
                        NOTIF_SHR_DSC: { type: "string" }
                    }
                }
            }
        });

        function loadData() {
            notificationsService.getNotification('SELECT ALL')
                            .then(function (response) {
                                vm.gridData = response.data;
                                vm.dataSource.read();
                            }, function (response) {
                                logger.error("Unable to get Notifications.", response, response.statusText);
                            });
        }

        loadData();

        $scope.clkAllItems = function ($event) {
            angular.forEach(vm.gridData, function (row) {
                row["IsSelected"] = $event.target.checked;
            });

            vm.dataSource.read();
        }

        $scope.checkItems = function ($event, dataItem) {
            dataItem["IsSelected"] = $event.target.checked;
        }

        $scope.$watch('filter', function (newValue, oldValue) {
            if (newValue === oldValue) return;
            vm.dataSource.filter({
                field: 'NOTIF_SHR_DSC',
                operator: 'contains',
                value: newValue
            });
        });

        function getSelectedIds(ev) {
            var ids = [];
            var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
            var data = grid.dataSource.data();
            var filters = grid.dataSource.filter();
            var query = new kendo.data.Query(data);
            var items = query.filter(filters).data;

            angular.forEach(items, function (row) {
                if (row["IsSelected"] === true) {
                    ids.push(row.NLT_ID)
                }
            });
            return ids;
        }


        $scope.markAsRead = function (ev) {
            var ids = getSelectedIds(ev);
            notificationsService.manageNotifications("UPDATE", true, ids).then(function () {
                //Success
                loadData();
            });
        }

        $scope.markAsUnRead = function (ev) {
            var ids = getSelectedIds(ev);
            notificationsService.manageNotifications("UPDATE", false, ids).then(function () {
                loadData();//Success
            });
        }

        $scope.delete = function (ev) {
            var ids = getSelectedIds(ev);
            notificationsService.manageNotifications("DELETE", false, ids).then(function () {
                loadData();//Success
            });
        }

        $scope.openMessage = function (dataItem) {

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'app/admin/notifications/notificationsModal.html',
                controller: 'notificationsModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function () {
                dataItem.IS_READ_IND = true;
            }, function () {
                dataItem.IS_READ_IND = true;
            });
        }

        var toolbar = '<a role="button" class="k-button k-button-icontext" ng-click=markAsRead($event)><span class="fa fa-eye"></span> MARK AS READ</a>' +
                      '<a role="button" class="k-button k-button-icontext" ng-click=markAsUnRead($event)><span class="fa fa-eye-slash"></span> MARK AS UNREAD</a>' +
                      '<a role="button" class="k-button k-button-icontext" ng-click=delete($event)><span class="fa fa-trash-o"></span> DELETE</a>' +
                      '<input class="input-sm searchNotif" ng-model-options="{ debounce: 200 }" placeholder="SEARCH" style="width:400px;" ng-model="filter" />';

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: toolbar,
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            change: vm.onChange,
            columns: [
            {
                field: "NLT_ID",
                template: "<input id='chk_#= NLT_ID #' type='checkbox' ng-click='checkItems($event, dataItem)' class='with-font' ng-model='dataItem.IsSelected'></input><label for='chk_#= NLT_ID #'></label>",
                headerTemplate: "<input id='chkAll' type='checkbox' ng-click='clkAllItems($event)' class='with-font' id='chkAll' /><label for='chkAll'></label>",
                width: "60px",
                filterable: false,
                sortable: false
            },
            {
                field: "NOTIF_NM",
                title: "Notification Type",
                width: "300px",
                filterable: { multi: true, search: true }
            },
            {
                field: "NOTIF_SHR_DSC",
                template: "<div ng-click='openMessage(dataItem)' role='hand' ng-class='{unread: !dataItem.IS_READ_IND }'>{{dataItem.NOTIF_SHR_DSC}}</div>",
                title: "Message",
                filterable: false
            },
            {
                field: "CRE_DTM",
                title: "Created Date Time",
                width: "200px",
                filterable: false
            }]
        }
    }
})();