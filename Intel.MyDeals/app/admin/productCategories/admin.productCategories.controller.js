(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductCategoryController', ProductCategoryController)

    ProductCategoryController.$inject = ['$uibModal', 'productCategoryService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function ProductCategoryController($uibModal, productCategoryService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        // Functions
		vm.toggleCheckBoxValue = toggleCheckBoxValue
        vm.clearFilters = clearFilters;
        vm.hasFilters = hasFilters;
    	//vm.addItem = addItem;
        vm.saveChanges = saveChanges;
        vm.cancelChanges = cancelChanges;

        // Variables
        vm.filters = {};


        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                	productCategoryService.getCategories()
                        .then(function (response) {
                        	e.success(response.data);
                        	stylizeEditableHeaders();
                        }, function (response) {
                        	logger.error("Unable to get Products.", response, response.statusText);
                        });
                },
                update: function (e) {
                	productCategoryService.updateCategory(e.data.models)
                        .then(function (response) {
                        	e.success(response.data);
                        	logger.success("Product Categories were successfully updated.");
                        }, function (response) {
                        	logger.error("Unable to update Product.", response, response.statusText);
                        });
                }
                //,create: function (e) {
                //	productCategoryService.insertCategory(e.data.models[0])
                //        .then(function (response) {
                //        	e.success(response.data);
                //        	logger.success("New Product added.");
                //        }, function (response) {
                //        	logger.error("Unable to add new Product.", response, response.statusText);
                //        });
                //}
            },
            batch: true,
            pageSize: 25,
            schema: {
            	model: {
            		id: "PRD_CAT_MAP_SID",
            		fields: {
            			PRD_CAT_MAP_SID: { editable: false }
						, DEAL_PRD_TYPE: { type: "string", nullable: true }
						, PRD_CAT_NM: { type: "string", nullable: true }
            			, ACTV_IND: { type: "boolean" }
						, GDM_PRD_TYPE_NM: { editable: false }
						, OP_CD: { editable: false }
						, GDM_VRT_NM: { editable: false }
						, DIV_NM: { editable: false }
						, CHG_EMP_NM: { type: "string",  editable: false }
						, CHG_DTM: {  type: "date", editable: false }
            		}
                }
            },
            sort: { field: "CHG_DTM", dir: "desc" }
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: gridConstants.filterable,
            sortable: true,
            selectable: true,
            resizable: true,
            groupable: true,
            pageable: {
            	refresh: true,
            	pageSizes: gridConstants.pageSizes,
            },

            editable: true,

            columns: [
			{
				field: "PRD_CAT_MAP_SID",
				hidden: true
			},
            {
            	field: "GDM_PRD_TYPE_NM",
            	title: "Gdm Product Type"
            },
            {
            	field: "GDM_VRT_NM",
            	title: "GDM Vertical Name"
            }			
            ,{
            	field: "DIV_NM",
            	title: "Division Short Name"
            }
            , {
            	field: "OP_CD",
            	width: 90,
            	title: "Op Code"
            }
            ,{
            	field: "DEAL_PRD_TYPE",
            	headerTemplate: "<div class='editableHeader'> Deal Product Type </div>",
            	template: "<div class='editableKendoCell'>#= DEAL_PRD_TYPE # </div>"
            }
            ,{
            	field: "PRD_CAT_NM",
            	headerTemplate: "<div class='editableHeader'> Product Category name </div>",
            	template: "<div class='editableKendoCell'>#= PRD_CAT_NM # </div>",
            }
            ,{
                field: "ACTV_IND",
                width: 80,
                headerTemplate: "<div class='editableHeader'> Actv Ind </div>",
                template: "<div class='editableKendoCell'><span ng-if='! #= ACTV_IND # ' ng-click='vm.toggleCheckBoxValue($event)' class='icon-md intelicon-empty-box'></span><span ng-if=' #= ACTV_IND # ' ng-click='vm.toggleCheckBoxValue($event)' class='icon-md intelicon-filled-box'></span></div>"
            }
            ,{
            	field: "CHG_EMP_NM",
            	title: "Last Updated By"
            }
			,{
                 field: "CHG_DTM",
                 title: "Last Update Date",
                 type: "date",
                 format: "{0:M/d/yyyy hh:mm tt}",
                 filterable: {
                 	ui: "datetimepicker"
                 }
            }
            ]
        }

    	// Toggles the value of a batch-editable kendo-grid's checkbox on first click
		// HACK: This is a workaround for kendo's default of making a user click 2x to change checkbox value
        function toggleCheckBoxValue($event) {
        	var currElem = angular.element($event.currentTarget);
        	var dataItem = $scope.grid.dataItem(currElem.closest("tr"));
			
        	// Update value
        	// NOTE: Unfortunately, the dataItem.set() method clears other dirty flags, so just update the column directly
        	dataItem.ACTV_IND = !dataItem.ACTV_IND;

			// Add the kendo dirty flag
        	dataItem.dirty = true;
        	var td = angular.element(currElem.closest("td"))
        	td.addClass('k-dirty-cell');
        	$('<span class="k-dirty"></span>').insertBefore($event.currentTarget.parentElement);
        }

        function hasFilters() {
        	return (typeof $scope.grid.dataSource._filter !== 'undefined');
        }

        function clearFilters() {
        	$scope.grid.dataSource.filter({});
        }

    	//// TODO: AddItem functionailty to be added in a future sprint
    	//function addItem() {
    	//    $scope.grid.addRow();
    	//}

        function saveChanges() {
			// Confirmation Dialog
        	var modalOptions = {
        		closeButtonText: 'Cancel',
        		actionButtonText: 'Save changes',
				hasActionButton: true,
        		headerText: 'Warning',
        		bodyText: 'Product hierarchy identifiers may change and existing deals may have to be updated. Are you sure you would like to save your changes?'
        	};

        	confirmationModal.showModal({}, modalOptions)
				.then(function (result) {
					// Save changes
					$scope.grid.saveChanges();
				});
        }

        function cancelChanges() {
        	$scope.grid.cancelChanges();
        }
		
        function stylizeEditableHeaders() {
        	// NOTE: the event is emitted for every widget; if we have multiple widgets in this controller, 
        	// we need to check that the event is for the one we're interested in.
        	var editableCols = $('.editableHeader');
        	for (var i = 0; i < editableCols.length; i++) {
        		$(editableCols[i]).closest('th').addClass('editableColumnHeader');
        	}
        }
    }
})();