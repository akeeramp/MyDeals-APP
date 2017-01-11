(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductCategoryController', ProductCategoryController)

    ProductCategoryController.$inject = ['$uibModal', 'productCategoryService', '$scope', 'logger']

    function ProductCategoryController($uibModal, productCategoryService, $scope, logger) {
        var vm = this;

        // Functions
        //vm.addItem = addItem;
        vm.updateItem = updateItem;
        vm.saveChanges = saveChanges;
        vm.cancelChanges = cancelChanges;

        // Variables
        vm.isEditMode = false; // Flag to help show which grid fields are editable

        vm.dataSource = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: function (e) {
                	productCategoryService.getCategories()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                        	logger.error("Unable to get Products.", response, response.statusText);
                        });
                },
                update: function (e) {
                	productCategoryService.updateCategory(e.data.models)
                        .then(function (response) {
                        	e.success(response.data);
                        	logger.success("Product Categories were successfully updated.");
                        	vm.isEditMode = false;
                        }, function (response) {
                        	logger.error("Unable to update Product.", response, response.statusText);
                        });
                }
                //,create: function (e) {
                //	productCategoryService.insertCategory(e.data.models[0])
                //        .then(function (response) {
                //        	e.success(response.data);
                //        	logger.success("New Product added.");
                //        	vm.isEditMode = false;
                //        }, function (response) {
                //        	logger.error("Unable to add new Product.", response, response.statusText);
                //        });
                //}
            },
            batch: true,
            pageSize: 20,
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
            sortable: true,
            sort : disableEditMode,
            selectable: true,
            pageable: {
            	change: disableEditMode
            },
            filterable: {
            		extra: false,
            		operators: {
            			string: {
            				contains: "Contains",
            				doesnotcontain: "Does not contain",
            				startswith: "Starts with",
            				eq: "Is equal to",
            				neq: "Is not equal to"
            			},
            			number: {
            				gt: "Greater than",
            				lt: "Less than",
            				eq: "Is equal to",
            				neq: "Is not equal to"
            			}
            		}
            	},
            editable: true,
            resizable : true,
            //toolbar: ["create", "save", "cancel"], // We're not using toolbar because stylizing is not flexible enough
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
            	headerTemplate: "<div ng-class='{editableHeader: vm.isEditMode == true}'> Deal Product Type </div>",
            	template: "<div ng-class='{editableKendoCell: vm.isEditMode == true}'>#= DEAL_PRD_TYPE # </div>"
            }
            ,{
            	field: "PRD_CAT_NM",
            	headerTemplate: "<div ng-class='{editableHeader: vm.isEditMode == true}'> Product Category name </div>",
            	template: "<div ng-class='{editableKendoCell: vm.isEditMode == true}'>#= PRD_CAT_NM # </div>",
            }
            ,{
                field: "ACTV_IND",
                width: 80,
                headerTemplate: "<div ng-class='{editableHeader: vm.isEditMode == true}'> Actv Ind </div>",
                template: "<div ng-class='{editableKendoCell: vm.isEditMode == true}'><span ng-if='! #= ACTV_IND # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= ACTV_IND # ' class='icon-md intelicon-filled-box'></span></div>"
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

        function disableEditMode() {
        	// Changing the page or sorting makes automatically take away the dirty marker, so just kill user changes on UI to lessen user confusion
        	// TODO: The better option would be to not let Kendo automatically take away the dirty marker. Maybe look for this solution later.
        	cancelChanges();
        }
		
		//// TODO: AddItem functionailty to be added in a future sprint
        //function addItem() {
        //    $scope.grid.addRow();
    	//}

        function updateItem() {
        	vm.isEditMode = true;
        }
        function saveChanges() {
			// Confirmation Dialog
        	//var modalOptions = {
        	//	closeButtonText: 'Cancel',
        	//	actionButtonText: 'Save changes',
        	//	headerText: 'Warning',
        	//	bodyText: 'Product hierarchy identifiers may change and existing deals may have to be updated. Are you sure you would like to save your changes?'
        	//};

        	//confirmationModal.showModal({}, modalOptions)
			//	.then(function (result) {
			//		// Save changes
			//		$scope.grid.saveChanges();
        	//	});
        	console.log("test confirmation modal removal");
        }
        function cancelChanges() {
        	$scope.grid.cancelChanges();
        	vm.isEditMode = false;
        }
    }
})();