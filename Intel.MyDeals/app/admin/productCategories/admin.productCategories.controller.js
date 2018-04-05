(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('ProductCategoryController', ProductCategoryController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    ProductCategoryController.$inject = ['productCategoryService', '$scope', 'logger', 'confirmationModal', 'gridConstants'];

    function ProductCategoryController(productCategoryService, $scope, logger, confirmationModal, gridConstants) {
        var vm = this;

        // Functions
        vm.clearFilters = clearFilters;
        vm.hasFilters = hasFilters;
    	//vm.addItem = addItem;
        vm.showValidationFlags = showValidationFlags;

        // Variables
        vm.filters = {};
        vm.showErrorMsg = false;

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
								logger.success("Product Verticals were successfully updated.");
							}, function (response) {
							    logger.error("Unable to update Product Vertical.", response, response.statusText);
							});
                	}
                	else {
                		// Error confirmation dialog
                		var modalOptions = {
                			closeButtonText: 'Okay',
                			hasActionButton: false,
                			headerText: 'Error',
                			bodyText: 'Product Vertical Name and Deal Product Type are required when the Active Indicator is checked. Please check your input and try again.'
                		};
                		confirmationModal.showModal({}, modalOptions);

						//// TODO: Find out why UI is not redrawing or scope is not binding without modal pop-up
                		//vm.showErrorMsg = true;
                		//$scope.$apply;
                		//$scope.grid.refresh();
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
					// work-around to allow for filtering that ignores time in the datepicker
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
            columnMenu: false,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.clearAllFiltersToolbar(),
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
			    field: "ACTV_IND",
			    width: 120,
			    headerTemplate: "<div class='editableHeader'> Actv Ind </div>",
			    template: gridUtils.boolViewer('ACTV_IND'),
			    editor: gridUtils.boolEditor,
			    attributes: { style: "text-align: center;" }
			},
			{
				field: "PRD_CAT_MAP_SID",
				hidden: true,
				filterable: { multi: true, search: true }
			},
            {
            	field: "GDM_PRD_TYPE_NM",
            	title: "Gdm Product Type",
            	filterable: { multi: true, search: true }
            },
            {
            	field: "GDM_VRT_NM",
            	title: "GDM Vertical Name",
            	filterable: { multi: true, search: true }
            },
			{
            	field: "DIV_NM",
            	title: "Division Short Name",
            	filterable: { multi: true, search: true }
			},
			{
            	field: "OP_CD",
            	width: 120,
            	title: "Op Code",
            	filterable: { multi: true, search: true }
			},
			{
            	field: "DEAL_PRD_TYPE",
            	headerTemplate: "<div class='editableHeader'> Deal Product Type </div>",
            	editor: customInlineEditor,
            	filterable: { multi: true, search: true }
			},
			{
            	field: "PRD_CAT_NM",
            	headerTemplate: "<div class='editableHeader'> Product Vertical </div>",
            	editor: customInlineEditor,
            	filterable: { multi: true, search: true }
			},
			{
            	field: "CHG_EMP_NM",
            	title: "Last Updated By",
            	filterable: { multi: true, search: true }
			},
			{
				field: "filterable_CHG_DTM",
				title: "Last Update Date",
				type: "date",
				template: "#= kendo.toString(new Date(CHG_DTM), 'M/d/yyyy hh:mm tt') #",
				filterable: {
                    extra: false,
					ui: "datepicker"
				}
			}
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
        	    options.model._behaviors.validMsg["PRD_CAT_NM"] = "Product Vertical is required when row is active";
        	}
        	if (options.model._behaviors['isError'] === undefined) {
        		options.model._behaviors['isError'] = {};
        	}

        	options.model._behaviors['isError'][options.field] = false;

        	// Inline editor element 
        	// TODO: For whatever reason, the ng-class does not update unless the input is hovered over or after save. Fix this if needed by business.
        	var tmplt = '<input name="' + options.field + '" class="k-input k-textbox" ';
        	tmplt += '	uib-tooltip="' + options.model._behaviors.validMsg[options.field] + '" tooltip-placement="bottom" tooltip-enable="(dataItem._behaviors.isError.' + options.field + ')" tooltip-is-open="true" tooltip-class="tooltip-error"';
        	tmplt += '	ng-class="{isError: (dataItem._behaviors.isError.' + options.field + ') }"';
        	tmplt += '/>';
        	$(tmplt).appendTo(container)
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

    	// HACK: Custom kendo validation where cells are dependant on one another. This function 
    	// is used in place of Kendo's custom or uilt-in validation because of the many bugs when using 
        // kendo custom validation with dependant columns. This function will actually validate the model.
		// It assumes we are using Kendo's inline editing (update one row at a time).
        function isModelValid(dataItem) {
        	var isValid = true;
			
        	if (dataItem['ACTV_IND'] == true){				
        		if (dataItem['DEAL_PRD_TYPE'].toString().replace(/\s/g, "").length === 0) {
        			// Display custom validation message
        			flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", true);        			
        			isValid = false;
        		} else {
					// Hide flag in case it was invalid previously
        			flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", false);
				}
        		if (dataItem['PRD_CAT_NM'].toString().replace(/\s/g, "").length === 0) {
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


		// HACK: Updates the model with the correct _behavior flag for depandant cell validation hack
        function flagBehavior(dataItem, $event, field, isError) {
        	if (dataItem._behaviors === undefined) {
        		dataItem._behaviors = {};
        	}
        	if (dataItem._behaviors['isError'] === undefined) {
        		dataItem._behaviors['isError'] = {};
        	}
        	dataItem._behaviors["isError"][field] = isError;
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
					flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", (input.val().toString().replace(/\s/g, "").length === 0));
				}
				    // Product Vertical
				else if (input.is("[name='PRD_CAT_NM']")) {
					flagBehavior(dataItem, "isError", "PRD_CAT_NM", (input.val().toString().replace(/\s/g, "").length === 0));
				}
				// Active Indicator
				else if (input.is("[name='ACTV_IND']") && input[0].checked) {
					flagBehavior(dataItem, "isError", "DEAL_PRD_TYPE", (dataItem.DEAL_PRD_TYPE.toString().replace(/\s/g, "").length === 0));
					flagBehavior(dataItem, "isError", "PRD_CAT_NM", (dataItem.PRD_CAT_NM.toString().replace(/\s/g, "").length === 0));
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