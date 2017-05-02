angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'confirmationModal', 'dataService', 'logger', 'pricingTableData', 'ProductSelectorService', 'MrktSegMultiSelectService', '$uibModal'];

function PricingTableController($scope, $state, $stateParams, $filter, confirmationModal, dataService, logger, pricingTableData, ProductSelectorService, MrktSegMultiSelectService, $uibModal) {

	var vm = this;

	// Functions
	vm.initCustomPaste = initCustomPaste;
	vm.customDragDropAutoFill = customDragDropAutoFill;
	vm.resetDirty = resetDirty;
	vm.getColumns = getColumns;
	$scope.openProductSelector = openProductSelector;
	$scope.openInfoDialog = openInfoDialog;
	$scope.validatePricingTable = validatePricingTable;
	$scope.detailGridOptions = detailGridOptions;

	// Variables
	var root = $scope.$parent.$parent;	// Access to parent scope
	var cellStyle = {
		textAlign: "left",
		verticalAlign: "center",
		color: "black",
		fontSize: 13,
		fontfamily: "Intel Clear"
	}
	var headerStyle = {
		background: "#e7e7e8",
		textAlign: "center",
		verticalAlign: "center",
		color: "#003C71",
		fontSize: 13,
		fontWeight: "normal"
	};

	var intA = "A".charCodeAt(0);
	var ptTemplate = null;
	var columns = null;
	var gTools = null;
	var ssTools = null;
	var wipTemplate = null;
	var productLevel = null;
	vm.colToLetter = {}; // Contains "dictionary" of  (Key : Value) as (Db Column Name : Column Letter)
	vm.letterToCol = {};
	vm.readOnlyColLetters = [];
	vm.requiredStringColumns = {};

	function init() {
		// force a resize event to format page
		$scope.resizeEvent();

		topbar.hide();

		// Set Pricing Strategy ID and Object
		if (root.curPricingStrategyId !== $stateParams.sid) {
			root.curPricingStrategyId = $stateParams.sid;
			root.curPricingStrategy = util.findInArray(root.contractData.PRC_ST, root.curPricingStrategyId);
		}
		if (root.curPricingStrategy === null) {
			logger.error("Unable to locate Pricing Strategy " + $stateParams.sid);
			$state.go('contract.manager', { cid: root.contractData.DC_ID });
		}

		// Set Pricing Table ID and Object
		if (root.curPricingTableId !== $stateParams.pid) {
			root.curPricingTableId = $stateParams.pid;
			if (root.curPricingStrategy.PRC_TBL !== undefined)
				root.curPricingTable = util.findInArray(root.curPricingStrategy.PRC_TBL, root.curPricingTableId);
		}
		if (root.curPricingTable === null) {
			logger.error("Unable to locate Pricing Table " + $stateParams.pid);
			$state.go('contract.manager', { cid: root.contractData.DC_ID });
		}

		root.spreadNeedsInitialization = true;

		// Pricing Table data
		root.pricingTableData = pricingTableData.data;

		if (root.pricingTableData.PRC_TBL_ROW === undefined) {
			root.pricingTableData.PRC_TBL_ROW = [];
		}
		if (root.pricingTableData.PRC_TBL_ROW[0] === undefined) {
			root.pricingTableData.PRC_TBL_ROW[0] = {};
		}
		if (root.pricingTableData.WIP_DEAL === undefined) {
			root.pricingTableData.WIP_DEAL = [];
		}

		//$scope.dataSpreadSheet = root.pricingTableData.PRC_TBL_ROW;
		$scope.dataGrid = root.pricingTableData.WIP_DEAL;


		ptTemplate = root.templates.ModelTemplates.PRC_TBL_ROW[root.curPricingTable.OBJ_SET_TYPE_CD];
		columns = vm.getColumns(ptTemplate);


		//debugger;
		// Define Kendo Spreadsheet options
		//
		//root.spreadDs = new kendo.data.DataSource({
		//    data: $scope.dataSpreadSheet,
		//    schema: {
		//        model: ptTemplate.model
		//    }
		//});

		//debugger;
		var ssTools = new gridTools(ptTemplate.model, ptTemplate.columns);

		// now remove the header for new spreadsheet entries
		if (Array.isArray($scope.pricingTableData.PRC_TBL_ROW)) {
			root.pricingTableData.PRC_TBL_ROW = root.pricingTableData.PRC_TBL_ROW.filter(function (obj) {
				return obj.DC_ID !== undefined && obj.DC_ID !== null;
			});
		}

		root.spreadDs = ssTools.createDataSource(root.pricingTableData.PRC_TBL_ROW);

		//debugger;
		// sample reload data source call
		//root.spreadDs.read().then(function () {
		//    var view = root.spreadDs.view();
		//});

		wipTemplate = root.templates.ModelTemplates.WIP_DEAL[root.curPricingTable.OBJ_SET_TYPE_CD];
		gTools = new gridTools(wipTemplate.model, wipTemplate.columns);
		gTools.assignColSettings();

		// Get DealType for Validate Products functionaility
		ProductSelectorService.GetProdDealType()
			.then(
				function (response) {
					if (response.statusText == "OK") {
						var dealType = $filter('filter')(response.data, { OBJ_SET_TYPE_CD: root.curPricingTable.OBJ_SET_TYPE_CD }, true)[0];
						// Get Product Level
						ProductSelectorService.GetProdSelectionLevel(dealType.OBJ_SET_TYPE_SID).then(
							function (response) {
								// TODO: This code is only getting "Processor_Nbr" [0], but the user should be able to enter any of "Processor_Nbr", "MM", or "Level4". We need to change the Translate Products API to reflect this.
								productLevel = response.data[0]; // TODO
							},
							function (response) {
								logger.error("Unable to get Product Level.", response, response.statusText);
							});
					}
				},
				function (response) {
					logger.error("Unable to get Deal Types.", response, response.statusText);
				}
		);
		generateKendoOptions();

	}

	function openProductSelector() {
		alert('TODO: Product Selector');
	}

	function openInfoDialog() {
		var modalOptions = {
			closeButtonText: 'Close',
			hasActionButton: false,
			headerText: 'Info',
			bodyText: 'TODO: Put info text and shortcuts here'
		};
		confirmationModal.showModal({}, modalOptions);
	}

	// Generates options that kendo's html directives will use
	function generateKendoOptions() {

		$scope.ptSpreadOptions = {
			change: onChange,
			columns: columns.length,
			sheetsbar: false,
			defaultCellStyle: {
				fontSize: cellStyle.fontSize,
				fontFamily: cellStyle.fontfamily
				//background: cellStyle.background, // Adding this will hide the validation. Don't add this
			},
			toolbar: {
				home: false,
				insert: false,
				data: false
			},
			sheets: [
				{
					name: "Main",
					columns: columns
				},
				{
					name: "DropdownValuesSheet", // COntains lists of data used for dropdowns
				}
			],
			render: onRender
		};

		// Define Kendo Main Grid options
		gridUtils.onDataValueChange = function (e) {
			root._dirty = true;
		}

		root.gridDs = gTools.createDataSource($scope.dataGrid);
		$scope.mainGridOptions = {
			dataSource: root.gridDs,
			columns: gTools.cols,
			toolbar: "&nbsp;",
			scrollable: true,
			sortable: true,
			editable: true,
			navigatable: true,
			filterable: true,
			groupable: false,
			resizable: true,
			reorderable: true,
			columnMenu: true,
			save: gTools.saveCell,
			dataBound: function (e) {
				e.sender.thead.find("[data-index=0]>.k-header-column-menu").remove();
			}
		};

		// Define Kendo Details Grid options
		root.gridDetailsDs = {};
	}

	function detailGridOptions(dataItem, pivotName) {
		var gt = new gridTools(wipTemplate.detailsModel, wipTemplate.detailsColumns);
		gt.assignColSettings();

		var idIndx = $scope.dataGrid.indexOfField("DC_ID", dataItem["DC_ID"]);
		var src = $scope.dataGrid[idIndx][pivotName];

		// define datasource not inline so we can reference it
		if (root.gridDetailsDs[dataItem["DC_ID"]] === undefined) root.gridDetailsDs[dataItem["DC_ID"]] = gt.createDataSource(src);
		return {
			dataSource: root.gridDetailsDs[dataItem["DC_ID"]],
			columns: gt.cols,
			sortable: true,
			editable: true,
			resizable: true,
			reorderable: true,
			save: gTools.saveCell,
			dataBound: function (e) {
				e.sender.thead.find("[data-index=0]>.k-header-column-menu").remove();
			}
		};
	};

	function getColumns(ptTemplate) {
		var cols = [];
		var c = -1;

		if (ptTemplate !== undefined && ptTemplate !== null) {
			angular.forEach(ptTemplate.columns, function (value, key) {
				var col = {};
				if (ptTemplate.columns[key].width) col.width = ptTemplate.columns[key].width;
				cols.push(col);

				c += 1;
				if (value.hidden === false) {
					// Create column to letter mapping
					var letter = String.fromCharCode(intA + c);
					vm.colToLetter[value.field] = letter;
					vm.letterToCol[letter] = value.field;
				}
			});
		}
		return cols;
	}

	// On Spreadsheet change
	function onChange(arg) {
		var sheet = arg.sender.activeSheet();

		// Don't do onchange events for any sheet other than the Main one
		if (arg.range._sheet._sheetName !== "Main") {
			return;
		}
		var productColIndex = (vm.colToLetter["PTR_USER_PRD"].charCodeAt(0) - intA);
		var topLeftRowIndex = (arg.range._ref.topLeft.row + 1);
		var bottomRightRowIndex = (arg.range._ref.bottomRight.row + 1);

		var isProductColumnIncludedInChanges = (arg.range._ref.topLeft.col >= productColIndex) && (arg.range._ref.bottomRight.col <= productColIndex);

		sheet.batch(function () {
			// Trigger only if the changed range contains the product column
			// NOTE: The below condition assumes that a dragged range is dragged from top-to-bottom, left-to-right. If that ever 
			// changes (i.e. we move the products column so it's not the first editable column), then we should change this logic to accomodate that.
			if (isProductColumnIncludedInChanges) {

				var finalColLetter = String.fromCharCode(intA + (ptTemplate.columns.length - 1));
				// Enable other cells
				var range = sheet.range("B" + topLeftRowIndex + ":" + finalColLetter + bottomRightRowIndex);
				range.enable(true);
				range.background(null);

				// Re-disable columns that are readOnly
				for (var key in vm.readOnlyColLetters) {
					if (vm.readOnlyColLetters.hasOwnProperty(key)) {
						disableRange(sheet.range(key + topLeftRowIndex + ":" + key + bottomRightRowIndex));
					}
				}

				arg.range.forEachCell(
					function (rowIndex, colIndex, value) {
						if (colIndex == productColIndex) { // Product Col changed
							// Re-disable specific cells that are readOnly
							var rowInfo = root.pricingTableData.PRC_TBL_ROW[(rowIndex - 1)]; // This is -1 to account for the 0th rows in the spreadsheet
							if (rowInfo != undefined) { // The row was pre-existing
								disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, 1);
							}

							for (var key in ptTemplate.model.fields) {
								var hasExistingCellValue = (sheet.range(vm.colToLetter[key] + (rowIndex + 1)).value()) == "" || (sheet.range(vm.colToLetter[key] + (rowIndex + 1)).value() == null); // don't override existing values for autofill

								// Auto-fill default values from Contract level
								if ((root.contractData[key] !== undefined)
										&& (root.contractData[key] !== null)
										&& (vm.colToLetter[key] != undefined)
										&& (hasExistingCellValue)
									) {
									var fillValue = root.contractData[key];
									if (ptTemplate.model.fields[key].type == "date") {
										fillValue = new Date(root.contractData[key]);
									}
									sheet.range(vm.colToLetter[key] + (rowIndex + 1)).value(fillValue);
								}
								// Auto-fill default values from Pricing Strategy level
								if ((root.curPricingTable[key] !== undefined)
										&& (root.curPricingTable[key] !== null)
										&& (vm.colToLetter[key] != undefined)
										&& (hasExistingCellValue)
									) {
									sheet.range(vm.colToLetter[key] + (rowIndex + 1)).value(root.curPricingTable[key]);
								}

								// Add LEN validation for required string fields
								// NOTE: this is not validation for date or number fields as they do not require LEN validation
								if (vm.requiredStringColumns.hasOwnProperty(key)) {
									sheet.range(vm.colToLetter[key] + (rowIndex + 1)).validation({
										dataType: "custom",
										from: "LEN(" + vm.colToLetter[key] + (rowIndex + 1) + ")>0",
										allowNulls: false,
										type: "warning",
										messageTemplate: "This field is required."
									});
								}
							}
						}
					}
				);
			}
		});

		if (!root._dirty) {
			root._dirty = true;
		} 
	}


	function disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, rowIndexOffset) {
		for (var property in rowInfo._behaviors.isReadOnly) {
			if (rowInfo._behaviors.isReadOnly.hasOwnProperty(property)) {
				var colLetter = vm.colToLetter[property];
				if (colLetter != null) {
					//vm.readOnlyColLetters[vm.colToLetter[property]] = true;
					disableRange(sheet.range(colLetter + (rowIndex + rowIndexOffset)));
				}
			}
		}
	}

	// On spreadsheet Render
	function onRender(e) {
		if (root.spreadNeedsInitialization) {
			root.spreadNeedsInitialization = false;

			// Set Active sheet
			e.sender.activeSheet(e.sender.sheetByName("Main"));

			var sheet = e.sender.activeSheet();
			var dropdownValuesSheet = e.sender.sheetByName("DropdownValuesSheet");

			// With initial configuration of datasource spreadsheet displays all the fields as columns,
			// thus setting up datasource in render event where selective columns from datasource can be displayed.
			sheet.setDataSource(root.spreadDs, ptTemplate.columns);

			sheetBatchOnRender(sheet, dropdownValuesSheet); // Do all spreadsheet cell changes here

			vm.initCustomPaste("#pricingTableSpreadsheet");
			vm.customDragDropAutoFill("#pricingTableSpreadsheet");
			replaceUndoRedoBtns();

			//e.sender.activeSheet(e.sender.sheetByName("DropdownValuesSheet"));
		}
	}

	function replaceUndoRedoBtns() {
		var redoBtn = $('.k-i-redo');
		redoBtn.addClass('fa fa-share ssUndoButton');
		redoBtn.removeClass('k-i-redo k-icon');

		var undoBtn = $('.k-i-undo');
		undoBtn.addClass('fa fa-reply ssUndoButton');
		undoBtn.removeClass('k-i-undo k-icon');
	}


	// TDOO: This needs major perfromance refactoring because it makes things slow for poeple with bad computer specs :<
	// Initiates in a batch call (which may make the spreadsheet load faster
	function sheetBatchOnRender(sheet, dropdownValuesSheet) {
		var rowIndexOffset = 2; // This is 2 because row 0 and row 1 are hidden

		// disable formula completion list
		$(".k-spreadsheet-formula-list").remove();

		// disable right click menu options
		$(".k-context-menu").remove();

		sheet.batch(function () {

			var headerRange = sheet.range("1:1");

			// disable first row
			headerRange.enable(false); //("A0:ZZ0")

			// freeze first row
			sheet.frozenRows(1);

			// Stylize header row
			headerRange.bold(true);
			headerRange.wrap(true);
			sheet.rowHeight(0, 35);

			headerRange.background(headerStyle.background);
			headerRange.color(headerStyle.color);
			headerRange.fontSize(headerStyle.fontSize);
			headerRange.textAlign(headerStyle.textAlign);
			headerRange.verticalAlign(headerStyle.verticalAlign);

			// Add product selector editor on Product cells
			sheet.range(vm.colToLetter["PTR_USER_PRD"] + ":" + vm.colToLetter["PTR_USER_PRD"]).editor("cellProductSelector");


			for (var key in ptTemplate.model.fields) {
				if (ptTemplate.model.fields.hasOwnProperty(key) && vm.colToLetter[key] !== undefined) {
					// Disable all readonly columns
					if (ptTemplate.model.fields[key].editable !== true && vm.colToLetter[key] !== undefined) {
						vm.readOnlyColLetters[vm.colToLetter[key]] = true;
						disableRange(sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]));
					}

					// Flag which rows have something in them, ao we don't disable rows
					var numRowsContainingData = 0;
					if (root.pricingTableData.PRC_TBL_ROW.length > 0) {
						numRowsContainingData = root.pricingTableData.PRC_TBL_ROW.length + rowIndexOffset;
					}
					// Disable all cells except product and cells that are read-only from template
					if (key != "PTR_USER_PRD") {
						disableRange(sheet.range(vm.colToLetter[key] + numRowsContainingData + ":" + vm.colToLetter[key]));
					}

					// Add validation dropdowns/multiselects onto the cells
					// TODO ///
					// ptTemplate.column[].uiType == "RADIOBUTTONGROUP" "DROPDOWN" "EMBEDDEDMULTISELECT" "MULTISELECT"
					if (ptTemplate.model.fields[key].opLookupText == "DROP_DOWN" || ptTemplate.model.fields[key].opLookupText == "dropdownName") {
						dropdownValuesSheet.batch(function () {
							// Call API
							dataService.get(ptTemplate.model.fields[key].opLookupUrl).then(function (response) {
								for (var i = 0; i < response.data.length; i++) {
									var myKey = response.data[i].ATRB_CD;
									// TODO: Why is ECAP_TYPE called PROGRAM_ECAP_TYPE and can we change that?
									if (response.data[i].ATRB_CD == "PROGRAM_ECAP_TYPE") {
										myKey = "ECAP_TYPE";
									}
									// Add values onto the other sheet
									dropdownValuesSheet.range(vm.colToLetter[myKey] + (i + 1)).value(response.data[i].DROP_DOWN);
								}
							}, function (error) {
								logger.error("Unable to get dropdown data.", error, error.statusText);
							});
						});
						if (ptTemplate.model.fields[key].uiType == "RADIOBUTTONGROUP" || ptTemplate.model.fields[key].uiType == "DROPDOWN") {
							sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).validation({
								dataType: "list",
								showButton: true,
								from: "DropdownValuesSheet!" + vm.colToLetter[key] + ":" + vm.colToLetter[key],
								allowNulls: ptTemplate.model.fields[key].nullable,
								type: "warning",
								titleTemplate: "Invalid value",
								messageTemplate: "Invalid value. Please use dropdown"
							});
						} else if (ptTemplate.model.fields[key].uiType == "EMBEDDEDMULTISELECT"  || ptTemplate.model.fields[key].uiType == "MULTISELECT"){
							sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).editor("multiSelectPopUpEditor");
							// TODO: Add a better validator which makes sure the selected items are in the multiselect list
							vm.requiredStringColumns[key] = true;
						}
					}
					else {
						// Add validations based on column type
						switch (ptTemplate.model.fields[key].type) {
							case "date":
								// Add date picker editor and validation
								sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).validation({
									dataType: "date",
									showButton: true,
									comparerType: "between",
									from: 'DATEVALUE("1/1/1900")',
									to: 'DATEVALUE("12/31/9999")',
									allowNulls: ptTemplate.model.fields[key].nullable,
									type: "warning",
									messageTemplate: "Value must be a date"
								});
								sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).format("MM/dd/yyyy");
								break;
							case "number":
								if (!ptTemplate.model.fields[key].nullable) {
									sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).validation({
										dataType: "number",
										from: 0,
										comparerType: "greaterThan",
										allowNulls: false,
										type: "warning",
										messageTemplate: "Value must be positive number."
									});
								}
								// Money Formatting
								if (ptTemplate.model.fields[key].format == "{0:c}") {
									sheet.range(vm.colToLetter[key] + ":" + vm.colToLetter[key]).format("$#,##0.00");
								}
								break;
							case "string":
								if (!ptTemplate.model.fields[key].nullable) {
									// TODO: find out how we do an isRequired on strings without LEN?
									// Add required string columns to dictionay to add LEN validations onchange and later
									vm.requiredStringColumns[key] = true;
								}
								break;
							default:
								break;
						}
					}
				}
			}

			// Hide all columns based on templating
			for (var i = 0; i < ptTemplate.columns.length; i++) {
				if (ptTemplate.columns[i].hidden === true) {
					sheet.hideColumn(i);
				}
			}

			// Individual cell security via security mask's json obj behaviors
			for (var rowIndex = 0; rowIndex < root.pricingTableData.PRC_TBL_ROW.length; rowIndex++) {
				var rowInfo = root.pricingTableData.PRC_TBL_ROW[rowIndex];

				// Required cells
				for (var property in rowInfo._behaviors.isRequired) {
					if (rowInfo._behaviors.isRequired.hasOwnProperty(property)) {
						var colLetter = vm.colToLetter[property];
						if (colLetter != null) {
							sheet.range(colLetter + (rowIndex + rowIndexOffset)).validation({
								dataType: "custom",
								from: "LEN(" + colLetter + (rowIndex + rowIndexOffset) + ")>0",
								allowNulls: false,
								type: "warning",
								messageTemplate: "This field is required."
							});
						}
					}
				}
				// Read Only cells 
				disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, rowIndexOffset);

				for (var key in ptTemplate.model.fields) {
					// Required string validation via columns 
					// NOTE: LEN validation means that we need to put validation on ecah individual cell rather than bulk
					if ((vm.colToLetter[key] !== undefined) && (vm.requiredStringColumns.hasOwnProperty(key))) {
						sheet.range(vm.colToLetter[key] + (rowIndex + rowIndexOffset)).validation({
							dataType: "custom",
							from: "LEN(" + vm.colToLetter[key] + (rowIndex + rowIndexOffset) + ")>0",
							allowNulls: false,
							type: "warning",
							messageTemplate: "This field is required."
						});
					}
				}
			}
		});
	}

	function disableRange(range) {
		range.enable(false);
		range.background('#f5f5f5'); // HACK: Disabled cells with null values have no class we can stylize, so we must change the cell directly :(
	}

	// HACK: override kendo's autofill property
	// Note that a good amount of this code is Kendo's default code, Kendo v2017.1.118
	function customDragDropAutoFill(handle) {
		var spreadsheet = kendo.spreadsheet;
		var Range = spreadsheet.Range;

		// NOTE: range.fillFrom() is called by Kendo's AutoFillCommand, which is responsible for the drag-to-copy
		Range.prototype.fillFrom = function (srcRange, direction) {
			// Original kendo code
			var x = this._previewFillFrom(srcRange, direction);

			// Custom code
			for (var i = 0; i < x.props.length; i++) { // each col
				for (var j = 0; j < x.props[i].length; j++) { // each row
					var newVal = x.props[i][j].value;

					// Make a new object with only the value - no validation or editor properties
					x.props[i][j] = {
						value: newVal
					}
				}
			}
			// Original kendo code
			x.dest._properties(x.props);
			return x.dest;
		};
	}


	// HACK: override kendo's clipboard paste
	// Note that a good amount of this code is Kendo's default code, Kendo v2017.1.118
	function initCustomPaste(handle) {
		var spreadsheet = $(handle).data("kendoSpreadsheet");
		var sheet = spreadsheet.activeSheet();
		var Command = kendo.spreadsheet.Command;

		// This is all default Kendo code except customPaste()
		kendo.spreadsheet.PasteCommand = Command.extend({
			init: function (options) {
				Command.fn.init.call(this, options);
				this._clipboard = options.workbook.clipboard();
				this._event = options.event;
			}
			,
			getState: function () {
				this._range = this._workbook.activeSheet().range(this._clipboard.pasteRef());
				this._state = this._range.getState();
			},
			exec: function () {
				this.getState();
				this._clipboard.parse();
				var status = this._clipboard.canPaste();
				if (!status.canPaste) {
					if (status.menuInvoked) {
						return {
							reason: 'error',
							type: 'useKeyboard'
						};
					}
					if (status.pasteOnMerged) {
						return {
							reason: 'error',
							type: 'modifyMerged'
						};
					}
					if (status.overflow) {
						return {
							reason: 'error',
							type: 'overflow'
						};
					}
					if (status.pasteOnDisabled) {
						this._event.preventDefault();
						return {
							reason: 'error',
							type: 'cannotModifyDisabled'
						};
					}
					return { reason: 'error' };
				}

				var range = this._workbook.activeSheet().selection();
				var preventDefault = this._workbook.trigger('paste', { range: range });

				if (preventDefault) {
					this._event.preventDefault();
				} else {
					this.customPaste();
					range._adjustRowHeight();
				}
			},
			customPaste: function () {
				// Default Kendo code for paste event
				var clip = this._clipboard;
				var state = clip._content;
				var sheet = clip.workbook.activeSheet();

				if (clip.isExternal()) {
					clip.origin = state.origRef;
				}

				// Non-default Kendo code for paste event
				for (var row = 0; row < state.data.length; row++) {
					// Prevent error when user only pastes 2+ merged cells that expand mulpitle rows
					if (state.data[row] == null) { continue; }

					for (var col = 0; col < state.data[row].length; col++) {
						var cellData = state.data[row][col];

						// Prevent the user form pasting in new cell styles
						cellData.background = null;
						cellData.bold = null;
						cellData.borderBottom = null;
						cellData.borderLeft = null;
						cellData.borderRight = null;
						cellData.borderTop = null;
						cellData.color = cellStyle.color;
						cellData.fontFamily = cellStyle.fontfamily;
						cellData.fontSize = cellStyle.fontSize;
						cellData.italic = null;
						cellData.link = null;
						//cellData.textAlign = cellStyle.textAlign;
						cellData.underline = null;
						cellData.verticalAlign = cellStyle.verticalAlign;
						cellData.wrap = null;

						// Get the current cell
						var myRow = sheet.activeCell().topLeft.row + row;
						var myCol = sheet.activeCell().topLeft.col + col;

						// Workround to prevent Kendo bug where users can copy/paste another cell's validation onto a new cell
						var originalCellState = sheet.range(myRow, myCol).getState().data[0][0];
						if (originalCellState != null) {
							cellData.validation = originalCellState.validation;
							cellData.editor = originalCellState.editor;
						}
					}
				}

				// Prevent user from pasting merged cells
				state.mergedCells = null;

				// set paste data to Kendo cell (default Kendo code)
				var pasteRef = clip.pasteRef();
				sheet.range(pasteRef).setState(state, clip);
				sheet.triggerChange({
					recalc: true,
					ref: pasteRef
				});
			}
		});
	}

	// Reset relative dirty bits
	function resetDirty() {
		var field = "isDirty";
		var mainData = $scope.mainGridOptions.dataSource.data();

		if ($scope.dataGrid !== undefined) {
			for (var i = 0; i < $scope.dataGrid.length; i++) {
				if (mainData[i] !== undefined) mainData[i]._dirty = false;
				angular.forEach(mainData[i],
                    function (value, key) {
                    	var item = mainData[i];
                    	if (item._behaviors[field] === undefined) item._behaviors[field] = {};
                    	item._behaviors[field][key] = false;

                    	//_MultiDim
                    	if (!util.isNull(root.gridDetailsDs[item["DC_ID"]])) {
                    		var detailData = root.gridDetailsDs[item["DC_ID"]].data();
                    		for (var ii = 0; ii < item._MultiDim.length; ii++) {
                    			detailData[ii]._dirty = false;
                    			angular.forEach(detailData[ii],
                                    function (v1, k1) {
                                    	var item2 = detailData[ii];
                                    	if (item2._behaviors === undefined || item2._behaviors === null) item2._behaviors = {};
                                    	if (item2._behaviors[field] === undefined || item2._behaviors[field] === null) item2._behaviors[field] = {};
                                    	item2._behaviors[field][k1] = false;
                                    });
                    		}
                    	}
                    });
			}
		}
	}

	// Watch for any changes to contract data to set a dirty bit
	$scope.$watch('$parent.$parent._dirty', function (newValue, oldValue, el) {
		if (newValue === false) {
			vm.resetDirty();
		}
	}, true);


	function validatePricingTable() {
		// sync spreadsheet data
		if ($scope.spreadDs !== undefined) $scope.spreadDs.sync();
		var sData = $scope.spreadDs === undefined ? undefined : $scope.pricingTableData.PRC_TBL_ROW;

		var prdList = [];
		// Get products as list of string
		for (var i = 0; i < sData.length; i++) {
			prdList.push(
				{
					USR_INPUT: sData[i].PTR_USER_PRD
					, PRD_ATRB_SID: productLevel.PRD_ATRB_SID
					, PRD_SELC_LVL: productLevel.PRD_SELC_LVL
					, EXCLUDE: ""
					, FILTER: ""
					, START_DATE: sData[i].START_DT
					, END_DATE: sData[i].END_DT
				}
			);
		}

		// Send to API
		ProductSelectorService.TranslateProducts(prdList)
			.then(function (response) {
				// TODO: Put the data into the Processed Product list column?
				console.log(response.data);
				alert("TODO: Do something with the translated product response. Check the console for translated data.");
			}, function (response) {
				logger.error("Unable to translate products.", response, response.statusText);
			}
		);
	}
	
	// TODO: Product Selector dialog box below
	kendo.spreadsheet.registerEditor("cellProductSelector", function () {
		var context, dlg, model;

		// Further delay the initialization of the UI until the `edit` method is
		// actually called, so here just return the object with the required API.

		return {
			edit: function (options) {
				context = options;

				//// If the selected cell already contains some value, reflect
				//// it in the custom editor.
				//var value = context.range.value();
				//if (value != null) {
				//	model.set("value", value);
				//}

				// TODO: Replace with actual Product Selector!
				var modalOptions = {
					closeButtonText: 'Close',
					hasActionButton: false,
					headerText: 'Help Text',
					bodyText: 'TODO'
				};
				confirmationModal.showModal({}, modalOptions);

			},
			icon: "fa fa-mouse-pointer ssEditorBtn"
		};

	});

	

	kendo.spreadsheet.registerEditor("multiSelectPopUpEditor", function () {
		var context;

		// Further delay the initialization of the UI until the `edit` method is
		// actually called, so here just return the object with the required API.
		return {
			edit: function (options) {

				context = options;

				// Get selected cell
				var currColIndex = options.range._ref.col;

				// Get column name out of selected cell
				var colName = vm.letterToCol[String.fromCharCode(intA + currColIndex)]

				// Get columnData (urls, name, etc) from column name
				var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW['ECAP'].model.fields[colName];

				// We have a "generic" variable in the scope to be the model. Then we replace the generic with a copy of the columnData
				// Inside the script tag, we have a ng-if equals column name then use whichever multiselct. 


				// If the selected cell already contains some value, reflect it in the custom editor.
				var cellCurrVal = context.range.value();
				var typeoftest = (typeof cellCurrVal);
				if (cellCurrVal !== null && cellCurrVal !== "" && typeof cellCurrVal == "string") {
					cellCurrVal = cellCurrVal.split(',');
				}

				var modalInstance = $uibModal.open({
					//animation: $ctrl.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'cellPopupModal',
					controller: 'MultiSelectModalCtrl',
					controllerAs: '$ctrl',
					size: 'md',
					resolve: {
						items: function () {
							return colData;
						},
						cellCurrValues: function () {
							return cellCurrVal;
						}
					}
				});
				
				modalInstance.result.then(function (selectedItem) {
					context.callback(selectedItem);
				}, function () { });				
			},
			icon: "fa fa-mouse-pointer ssEditorBtn"
		};
	});

	init();
}