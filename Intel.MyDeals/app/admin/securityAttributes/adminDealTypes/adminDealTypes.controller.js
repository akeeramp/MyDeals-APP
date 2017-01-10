(function() {
    'use strict';

    angular
        .module('app.admin')
        .controller('dealTypesController',dealTypesController)

    dealTypesController.$inject = ['$uibModal', 'DealTypesService', '$scope', 'logger'];

    function dealTypesController($uibModal, DealTypesService, $scope, logger) {
        var vm = this;

        // Functions
        vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.deleteItem = deleteItem
        vm.onChange = onChange;

        // Variables
        vm.selectedItem = null;
        vm.isButtonDisabled = true;

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                    DealTypesService.getDealTypes()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get deal types.", response, response.statusText);
                        });
                },
                update: function (e) {
                    DealTypesService.updateDealType(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Update successful.');
                        }, function (response) {
                            logger.error("Unable to update role type.", response, response.statusText);
                        });
                },
                destroy: function (e) {
                    DealTypesService.deleteDealType(e.data.models[0].DEAL_TYPE_SID)
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('Delete successful.');
                        }, function (response) {
                            logger.error("Unable to delete Application", response, response.statusText);
                        });
                },
                create: function (e) {
                    DealTypesService.insertDealType(e.data.models[0])
                        .then(function (response) {
                        	e.success(response.data);
                            logger.success('New Deal Type added');
                        }, function (response) {
                            logger.error("Unable to insert Application.", response, response.statusText);
                        });
                }
            },
            batch: true,
            pageSize: 20,
            schema: {
                model: {
                    id: "DEAL_TYPE_SID",
                    fields: {
                        DEAL_TYPE_SID: { editable: false, nullable: true },
                        DEAL_ATRB_SID: { type: "number" , validation: { required: true } },
                        DEAL_TYPE_CD: { validation: { required: true } },
                        DEAL_TYPE_DESC: { validation: { required: true } },
                        TEMPLT_DEAL_SID: {},
                        TEMPLT_DEAL_NBR: { type: "number", validation: { format:"{0:n0}", decimals:0 } },
                        TRKR_NBR_DT_LTR: {},
                        PERFORM_CTST: { type: "boolean" },
                        ACTV_IND: { type: "boolean" }
                    }
                }
            }
        });

        vm.mainGridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            selectable: true,
            pageable: true,
            editable: "popup",
            change: vm.onChange,
            //toolbar: [
            //	"create",
            //	{ name: "customEdit", text: "Edit", imageClass: "k-edit", className: "k-custom-edit btn btn-primary", iconClass: "k-icon" },
            //	{ name: "customDelete", text: "Delete", imageClass: "k-delete", className: "k-custom-delete btn btn-default", iconClass: "k-icon" }
            //],
            columns: [
            {
                field: "DEAL_TYPE_SID",
                title: "ID",
            }, {
                field: "DEAL_ATRB_SID",
                title: "Deal ATRB ID"
            }, {
                field: "DEAL_TYPE_CD",
                title: "Name"
            }, {
                field: "DEAL_TYPE_DESC",
                title: "Description"
            }, {
                field: "TEMPLT_DEAL_SID",
                title: "Template Deal ID"
            }, {
                field: "TEMPLT_DEAL_NBR",
                title: "Template Deal Number"
            }, {
                field: "TRKR_NBR_DT_LTR",
                title: "TRKR_NBR_DT_LTR"
            }, {
                field: "PERFORM_CTST",
                title: "Perform CTST"
            }, {
                field: "ACTV_IND",
                title: "Active"
            }]
        }

        // Gets and sets the selected row
        function onChange() {
            vm.selectedItem = $scope.dealTypesGrid.select();
            if (vm.selectedItem.length == 0) {
                vm.isButtonDisabled = true;
            } else {
                vm.isButtonDisabled = false;
            }
            $scope.$apply();
        }

        function addItem() {
            vm.isButtonDisabled = true;
            $scope.dealTypesGrid.addRow();
        }
        function updateItem() {
            $scope.dealTypesGrid.editRow(vm.selectedItem);
        }
        function deleteItem() {
            $scope.dealTypesGrid.removeRow(vm.selectedItem);
        }

    }
})();