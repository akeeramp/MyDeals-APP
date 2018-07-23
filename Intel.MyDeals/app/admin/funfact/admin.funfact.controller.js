/// <reference path="funfact.service.js" />
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('FunfactController', FunfactController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    FunfactController.$inject = ['$scope', 'dataService', 'funfactService', 'logger', 'confirmationModal', 'gridConstants'];

    function FunfactController($scope, dataService, funfactService, logger, confirmationModal, gridConstants) {
        var wrokFlowAttibutes = '';
        var vm = this;
        vm.selectedItem = null;
        vm.filters = {};

        // declare dataSource bound to backend
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    funfactService.GetFunfactItems()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Fun Fact.", response, response.statusText);
                        });

                },
                update: function (e) {
                    funfactService.UpdateFunfact(e.data)
                    .then(function (response) {
                        e.success(response.data);
                        logger.success("Funfact updated.");
                    }, function (response) {
                        logger.error("Unable to update Fun Fact.", response, response.statusText);
                    });
                },
                destroy: function (e) {
                    var modalOptions = {
                        closeButtonText: 'Cancel',
                        actionButtonText: 'Delete Funfact',
                        hasActionButton: true,
                        headerText: 'Delete confirmation',
                        bodyText: 'Are you sure you would like to Delete this Fun Fact?'
                    };

                    confirmationModal.showModal({}, modalOptions)
                        .then(
                            function (result) {
                                $scope.funfactGrid.removeRow(vm.selectedItem);
                                funfactService.DeleteFunfact(e.data)
                                .then(
                                    function (response) {
                                        e.success(response.data);
                                        logger.success("Fun Fact Deleted.");
                                    },
                                    function (response) {
                                        $scope.funfactGrid.cancelChanges();
                                    });
                            },
                            function (response) {
                                $scope.funfactGrid.cancelChanges();
                            });
                },
                create: function (e) {
                    funfactService.SetFunfact(e.data)
                        .then(function (response) {                            
                            e.success(response.data[0]);                            
                            logger.success("New Fun Fact added.");
                        }, function (response) {
                            logger.error("Unable to insert Fun Fact.", response, response.statusText);
                        });
                }
            },
            pageSize: 25,
            schema: {
                model: {
                    id: "FACT_SID",
                    fields: {
                        FACT_SID: {
                            editable: false, nullable: true
                        },
                        FACT_TXT: { validation: { required: true } },
                        FACT_HDR: { validation: { required: true } },
                        FACT_ICON: { validation: { required: true } },
                        FACT_SRC: { validation: { required: false } },
                        ACTV_IND: { validation: { required: true } }
                    }
                }
            },
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
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            editable: { mode: "inline", confirmation: false },
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes
            },
            edit: function (e) {
                var commandCell = e.container.find("td:first");
                commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },            
            columns: [
              {
                  command: [
                      { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
                      //{ name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
                  ],
                  title: " ",
                  width: "6%"
              },
              { field: "FACT_SID", title: "Id", width: "6%" },
              { field: "FACT_TXT", title: "Fun Fact", width: "30%" },
              { field: "FACT_HDR", title: "Header", width: "14%" },
              { field: "FACT_ICON", template: "<div class='col-md-2' style='text-align:center'><i class='fa fa-#= FACT_ICON # ss-funfact-icon'></i></div><div class='col-md-6'>#= FACT_ICON #</div>", title:"Font Awesome Icon <i class='intelicon-help' uib-tooltip='Pick an icon from fontawesome.com/icons' tooltip-placement='right'>", width: "15%" },
              { field: "FACT_SRC", title: "Fact Source / Credentials <i class='intelicon-help' uib-tooltip='If copy/pasted, we must legally credit the source.' tooltip-placement='right'>", width: "19%" },
              { field: "ACTV_IND", title: "Active", width: "10%", template: gridUtils.boolViewer('ACTV_IND'), editor: gridUtils.boolEditor, attributes: { style: "text-align: center;" } }
            ]
        };
    }
})();