(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductCategoryController', ProductCategoryController)

    ProductCategoryController.$inject = ['$uibModal', 'productCategoryService', '$scope', 'logger', 'confirmationModal', 'gridConstants']

    function ProductCategoryController($uibModal, productCategoryService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        // Functions
        vm.clearFilters = clearFilters;
        vm.hasFilters = hasFilters;
    	//vm.addItem = addItem;
        vm.showValidationFlags = showValidationFlags;

        // Variables
        vm.filters = {};

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
                	// HACK: Do actual validation here rather than in kendo's custom validation because of the many
                	// bugs when using kendo custom validation with dependant columns 
                	var isValid = true;

					// Check validation of all rows and update ui _behavior flags
                	for (var i = 0; i < e.data.models.length; i++) {
                		if (!isModelValid(e.data.models[i])) {
                			isValid = false;
                		}
                	}

                	if (isValid) {
                		// Save
                		productCategoryService.updateCategory(e.data.models)
							.then(function (response) {
								e.success(response.data);
								logger.success("Product Categories were successfully updated.");
							}, function (response) {
								logger.error("Unable to update Product Category.", response, response.statusText);
							});
                	}
                	else {
                		// Error confirmation dialog
                		var modalOptions = {
                			closeButtonText: 'Okay',
                			hasActionButton: false,
                			headerText: 'Warning',
                			bodyText: 'Product Category Name and Deal Product Type are required when the Active Indicator is checked. Please check your input and try again.'
                		};
                		confirmationModal.showModal({}, modalOptions);;
                	}

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
						, DEAL_PRD_TYPE: {
							type: "string"
							, validation: {						
								customValidation: vm.showValidationFlags
							}
						}
						, PRD_CAT_NM: {
							type: "string"
							, validation: {
								customValidation: vm.showValidationFlags
							}
						}
            			, ACTV_IND: {
            				type: "boolean"
							, validation: {
								customValidation: vm.showValidationFlags
							}
            			}
						, GDM_PRD_TYPE_NM: { editable: false }
						, OP_CD: { editable: false }
						, GDM_VRT_NM: { editable: false }
						, DIV_NM: { editable: false }
						, CHG_EMP_NM: { type: "string",  editable: false }
						, CHG_DTM: { type: "date", editable: false }
						, filterable_CHG_DTM: { type: "date", editable: false }
						, "_behaviors": { type: "object" }
            		}
            	},
            	parse: function (d) {
            		// HACK: Create a new attribute (filterable_CHG_DTM) in the model for the UI to consume as a 
					// workaorund to allow for filtering that ignores time in the datepicker
            		var date = null;
            		$.each(d, function (idx, elem) {
            			date = new Date(elem.CHG_DTM);
            			elem.filterable_CHG_DTM = kendo.toString(date, "d")
            		});
            		return d;
            	}
            },
            sort: { field: "filterable_CHG_DTM", dir: "desc" }
        });

        vm.gridOptions = {
        	dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            pageable: {
            	refresh: true,
            	pageSizes: gridConstants.pageSizes
            },
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            editable: "inline",
            edit: function (e) {
            	var commandCell = e.container.find("td:first");
            	commandCell.html('<a class="k-grid-update" href="#"><span class="k-icon k-i-check"></span></a><a class="k-grid-cancel" href="#"><span class="k-icon k-i-cancel"></span></a>');
            },

            columns: [
			{
				command: [
					{
						name: "edit",
						template: "<a class='k-grid-edit' href='\\#' style='margin-right: 6px;'><span class='k-icon k-i-edit'></span></a>"
					}
				],
				title: " ",
				width: "80px"
			},
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
            },
			{
            	field: "DIV_NM",
            	title: "Division Short Name"
			},
			{
            	field: "OP_CD",
            	width: 90,
            	title: "Op Code"
			},
			{
            	field: "DEAL_PRD_TYPE",
            	headerTemplate: "<div class='editableHeader'> Deal Product Type </div>",
            	editor: customInlineEditor
			},
			{
            	field: "PRD_CAT_NM",
            	headerTemplate: "<div class='editableHeader'> Product Category Name </div>",
            	editor: customInlineEditor
			},
			{
                field: "ACTV_IND",
                width: 80,
                headerTemplate: "<div class='editableHeader'> Actv Ind </div>",
                template: "<span ng-if='! #= ACTV_IND # ' class='icon-md intelicon-empty-box'></span><span ng-if=' #= ACTV_IND # ' class='icon-md intelicon-filled-box'></span>"
			},
			{
            	field: "CHG_EMP_NM",
            	title: "Last Updated By"
			},
			{
				field: "filterable_CHG_DTM",
				title: "Last Update Date",
				type: "date",
				template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy hh:mm tt') #",
				filterable: {
					ui: "datepicker"
				}
			}
			//,{ command: ["edit"], title: "&nbsp;", width: "200px" }
            ]
        }

        function customInlineEditor(container, options) {
        	// Edit model to have variables for ui valid flags
        	if (options.model._behaviors === undefined) {
        		options.model._behaviors = {};
        	}
        	if (options.model._behaviors.validMsg === undefined) {
        		options.model._behaviors.validMsg = {};
        	}
        	if (options.model._behaviors.validMsg["DEAL_PRD_TYPE"] === undefined) {
        		options.model._behaviors.validMsg["DEAL_PRD_TYPE"] = "Deal Product Type is required when row is active";
        	}
        	if (options.model._behaviors.validMsg["PRD_CAT_NM"] === undefined) {
        		options.model._behaviors.validMsg["PRD_CAT_NM"] = "Product Category Name is required when row is active";
        	}
        	if (options.model._behaviors['isError'] === undefined) {
        		options.model._behaviors['isError'] = {};
        	}

        	options.model._behaviors['isError'][options.field] = false;

        	// Inline editor element 
        	// TODO: For whatever reason, the ng-class does not update unless the input is hovered over or after save. Fix this if needed by business.
        	var tmplt = '<input name="' + options.field + '" class="k-input k-textbox" ';
        	tmplt += '	uib-tooltip="' + options.model._behaviors.validMsg[options.field] + '" tooltip-placement="bottom" tooltip-enable="(dataItem._behaviors.isError.' + options.field + ')" tooltip-is-open="true"';
        	tmplt += '	ng-class="{isError: (dataItem._behaviors.isError.' + options.field + ') }"';
        	tmplt += '/>';
        	$(tmplt).appendTo(container)
        }


    	//// Toggles the value of a batch-editable kendo-grid's checkbox on first click
		//// HACK: This is a workaround for kendo's default of making a user click 2x to change checkbox value
        //function toggleCheckBoxValue($event) {
        //	var currElem = angular.element($event.currentTarget);
        //	var dataItem = $scope.grid.dataItem(currElem.closest("tr"));
			
        //	// Update value
        //	// NOTE: Unfortunately, the dataItem.set() method clears other dirty flags, so just update the column directly
        //	dataItem.ACTV_IND = !dataItem.ACTV_IND;

		//	// Add the kendo dirty flag
        //	dataItem.dirty = true;
        //	var td = angular.element(currElem.closest("td"))
        //	td.addClass('k-dirty-cell');
        //	$('<span class="k-dirty"></span>').insertBefore($event.currentTarget.parentElement);
        //}

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

    	// Custom kendo validation where cells are dependant on one another. Actually valiates model.
		// Assumes we are using Kendo's inline editing (update one row at a time)
        function isModelValid(dataItem) {
        	var isValid = true;
			
        	if (dataItem['ACTV_IND'] == true){				
        		if (dataItem['DEAL_PRD_TYPE'] == "") {
        			// Display custom validation message
        			flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", true);        			
        			isValid = false;
        		} else {
					// Hide flag in case it was invalid previously
        			flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", false);
				}
        		if (dataItem['PRD_CAT_NM'] == "") {
        			// Display custom validation message
        			flagBehavior(dataItem, "isError", "PRD_CAT_NM", true);
        			isValid = false;
        		} else {
        			// Hide flag in case it was invalid previously
        			flagBehavior(dataItem, "isError", "PRD_CAT_NM", false);
        		}
        	}
        	return isValid;
        }


		// Updates the model with the correct _behavior flag
        function flagBehavior(dataItem, $event, field, isTrue) {
        	if (dataItem._behaviors === undefined) {
        		dataItem._behaviors = {};
        	}
        	if (dataItem._behaviors['isError'] === undefined) {
        		dataItem._behaviors['isError'] = {};
        	}
        	dataItem._behaviors["isError"][field] = isTrue;
		}


    	// <summary> Appends validation message to correct dependant cell where cells are dependant on one another
		// Note that the actual validation occurs on clicking the Update button

    	// HACK: This isn't actually using kendo's built-in validation method. This grid has cells that 
    	// depend on one another to add/remove validation. With the built-in method users must edit and go 
    	// out of focus of the cell to trigger validation, but Kendo will not update the model with an invalid input
    	// even if that cell becomes valid through another cell's update. Retriggering validation within the dependee
    	// cell's validation method will also not work as Kendo will not update the dependee's value in model until 
        // after the dependee cell is validated.

		// <param> Input: the input element being altered 
		// <returns> True if the column is valid, false if it is invalid
        function showValidationFlags(input, e)
        {
			var row = input.closest("tr");
			var grid = row.closest("[data-role=grid]").data("kendoGrid");
			var dataItem = grid.dataItem(row);

			if ((dataItem.ACTV_IND && !input.is("[name='ACTV_IND']")) || (input.is("[name='ACTV_IND']") && input[0].checked)) {
				// Deal Prodct Type
				if (input.is("[name='DEAL_PRD_TYPE']")) {
					flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", (input.val() == ""));
				}
				// Product Category Name
				else if (input.is("[name='PRD_CAT_NM']")) {
					flagBehavior(dataItem, "isError", "PRD_CAT_NM", (input.val() == ""));
				}
				// Active Indicator
				else if (input.is("[name='ACTV_IND']") && input[0].checked) {
					flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", (dataItem.DEAL_PRD_TYPE == ""));
					flagBehavior(dataItem, "isError", "PRD_CAT_NM", (dataItem.PRD_CAT_NM == ""));
				} 
			} else {
				// Clear flags
				flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", false);
				flagBehavior(dataItem, "isError", "PRD_CAT_NM", false);
			}
			// return true as that is what kendo's validation expects
			return true;
        }
    }
})();