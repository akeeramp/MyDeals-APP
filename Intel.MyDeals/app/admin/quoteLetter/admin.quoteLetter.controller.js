(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('QuoteLetterController', QuoteLetterController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    QuoteLetterController.$inject = ['quoteLetterService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq']

    function QuoteLetterController(quoteLetterService, $scope, logger, confirmationModal, gridConstants, $linq) {

        var vm = this;
        vm.dropDownOptions = {
            placeholder: "select...",
            autoBind: false,
            //dataTextField: "Alias",
            //dataSource: {
            //    type: "json",
            //    serverFiltering: true,
            //    transport: {
            //        read: function (e) {
            //            e.success(vm.drilledDownDealTypes);
            //        }
            //    }
            //}
        };

        vm.upperContent = "asdf";
        vm.lowerContent = "fdsa";

        //vm.validationMessage = "";

        //vm.dataSource = new kendo.data.DataSource({
        //    transport: {
        //        read: function (e) {
        //            productAliasService.GetProductsFromAlias()
        //                .then(function (response) {
        //                    e.success(response.data);
        //                }, function (response) {
        //                    logger.error("Unable to get Product Alias Mappings.", response, response.statusText);
        //                });
        //        },
        //        update: function (e) {
        //            var d = $scope.grid._data;
        //            var aliasExists = $linq.Enumerable().From(d)
        //                                .Where(function (x) {
        //                                    return x.PRD_ALS_NM == e.data.PRD_ALS_NM;
        //                                })
        //                                .ToArray().length > 1; //why 1 ? It should exclude the row getting updated.
        //            if (aliasExists) {
        //                e.error();
        //                $scope.$apply(function () {
        //                    vm.validationMessage = 'Product Alias name ' + e.data.PRD_ALS_NM + ' already exists';
        //                })
        //            } else {
        //                productAliasService.UpdateProductAlias(e.data)
        //                    .then(function (response) {
        //                        vm.validationMessage = '';
        //                        e.success(response.data);
        //                        logger.success("Product Alias Mappings successfully updated.");
        //                    }, function (response) {
        //                        var errorMessage = typeof response.data === 'string' ? response.data : "Unable to update Product Alias Mappings";
        //                        vm.validationMessage = errorMessage;
        //                        logger.error(errorMessage, response, response.statusText);
        //                    });
        //            }
        //        },
        //        destroy: function (e) {
        //            var modalOptions = {
        //                closeButtonText: 'Cancel',
        //                actionButtonText: 'Delete Product Alias',
        //                hasActionButton: true,
        //                headerText: 'Delete confirmation',
        //                bodyText: 'Are you sure you would like to Delete this Product Alias Mapping?'
        //            };

        //            confirmationModal.showModal({}, modalOptions).then(function (result) {
        //                productAliasService.DeleteProductAlias(e.data).then(function (response) {
        //                    $scope.grid.removeRow();
        //                    e.success(response.data);
        //                    logger.success("Product Alias Deleted.");
        //                }, function (response) {
        //                    cancelChanges();
        //                });
        //            }, function (response) {
        //                cancelChanges();
        //            });
        //        },
        //        create: function (e) {
        //            var d = $scope.grid._data;
        //            var aliasExists = $linq.Enumerable().From(d)
        //                                .Where(function (x) {
        //                                    return x.PRD_ALS_NM == e.data.PRD_ALS_NM;
        //                                })
        //                                .ToArray().length > 1;
        //            if (aliasExists) {
        //                e.error();
        //                $scope.$apply(function () {
        //                    vm.validationMessage = 'Product Alias name ' + e.data.PRD_ALS_NM + ' already exists';
        //                })
        //            } else {
        //                productAliasService.CreateProductAlias(e.data)
        //                    .then(function (response) {
        //                        vm.validationMessage = '';
        //                        e.success(response.data[0]);
        //                        logger.success("Product Alias Mapping successfully added.");
        //                    }, function (response) {
        //                        var errorMessage = typeof response.data === 'string' ? response.data : "Unable to insert Product Alias Mappings";
        //                        vm.validationMessage = errorMessage;
        //                        logger.error("Unable to insert Product Alias Mapping.", response, response.statusText);
        //                    });
        //            }
        //        }
        //    },
        //    pageSize: 25,
        //    schema: {
        //        model: {
        //            id: "PRD_ALS_SID",
        //            fields: {
        //                PRD_ALS_SID: { editable: false, nullable: true },
        //                PRD_NM: { validation: { required: true }, editable: true },
        //                PRD_ALS_NM: { validation: { required: true }, editable: true },
        //            }
        //        }
        //    },
        //});

        //vm.gridOptions = {
        //    dataSource: vm.dataSource,
        //    filterable: true,
        //    scrollable: true,
        //    sortable: true,
        //    navigatable: true,
        //    resizable: true,
        //    reorderable: true,
        //    columnMenu: true,
        //    sort: function (e) { gridUtils.cancelChanges(e); },
        //    filter: function (e) { gridUtils.cancelChanges(e); },
        //    toolbar: gridUtils.inLineClearAllFiltersToolbar(),
        //    editable: { mode: "inline", confirmation: false },
        //    edit: function (e) {
        //        var commandCell = e.container.find("td:first");
        //        commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
        //    },
        //    destroy: function (e) {
        //        var commandCell = e.container.find("td:first");
        //        commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
        //    },
        //    cancel: function (e) {
        //        vm.validationMessage = '';
        //    },
        //    pageable: {
        //        refresh: true,
        //        pageSizes: gridConstants.pageSizes,
        //    },
        //    columns: [
        //        {
        //            command: [
        //                { name: "edit", template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>" },
        //                { name: "destroy", template: "<a class='k-grid-delete' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-close'></span></a>" }
        //            ],
        //            title: " ",
        //            width: "6%"
        //        },
        //      { field: "PRD_ALS_SID", title: "Id", width: "7%", hidden: true },
        //      { field: "PRD_NM", title: "Product Name", width: "10%" },
        //      { field: "PRD_ALS_NM", title: "Product Alias", width: "20%" }
        //    ]
        //};

        //// Clear out changes
        //function cancelChanges() {
        //    vm.validationMessage = '';
        //    $scope.grid.cancelChanges();
        //}
    }
})();