angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', 'pricingTableData', 'dataService', 'logger', 'confirmationModal'];

function PricingTableController($scope, $state, $stateParams, pricingTableData, dataService, logger, confirmationModal) {

	var vm = this;

	// Functions
	vm.initCustomPaste = initCustomPaste;
	vm.resetDirty = resetDirty;
	vm.getColumns = getColumns;
	$scope.openProductSelector = openProductSelector;
	$scope.openInfoDialog = openInfoDialog;
	$scope.validatePricingTable = validatePricingTable;
	$scope.detailGridOptions = detailGridOptions;

	// Variables
	var root = $scope.$parent.$parent;	// Access to parent scope
	var cellStyle = {
		background: "white",
		textAlign: "left",
		verticalAlign: "center",
		color: "black",
		fontSize: 12,
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

	var ptTemplate = null;
	var columns = null;
	var gTools = null;
	var ssTools = null;
	var wipTemplate = null;
	//vm.colToLetter = {};



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

		$scope.$parent.$parent.spreadNeedsInitialization = true;

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

		$scope.dataSpreadSheet = root.pricingTableData.PRC_TBL_ROW;
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
				color: cellStyle.color,
				fontSize: cellStyle.fontSize,
				background: cellStyle.background,
				fontFamily: cellStyle.fontfamily
			},
			toolbar: {
				home: false,
				insert: false,
				data: false
			},
			sheets: [
			{
				columns: columns
			}],
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
		if (ptTemplate !== undefined && ptTemplate !== null) {
			angular.forEach(ptTemplate.columns, function (value, key) {
				var col = {};
				if (ptTemplate.columns[key].width) col.width = ptTemplate.columns[key].width;
				cols.push(col);
			});
		}
		return cols;
	}

	// On Spreadsheet change
	function onChange(e) {
		$scope.$apply(function () {
			root._dirty = true;
		});
	}

	// On spreadhseet Render
	function onRender(e) {
		if ($scope.$parent.$parent.spreadNeedsInitialization) {
			$scope.$parent.$parent.spreadNeedsInitialization = false;

			var sheet = e.sender.activeSheet();

			// With initial configuration of datasource spreadsheet displays all the fields as columns,
			// thus setting up datasource in reneder event where selective columns from datasource can be displayed.
			sheet.setDataSource(root.spreadDs, ptTemplate.columns);

			sheetBatch(sheet);

			vm.initCustomPaste("#pricingTableSpreadsheet");
			replaceUndoRedoBtns();


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

	// Initiates in a batch call (which may make the spreadsheet load faster
	function sheetBatch(sheet) {
		sheet.batch(function () {

			// TODO: Remove later. Temporary for stylizing
			sheet.range("B5:C10").validation({
				dataType: "number",
				from: 2,
				comparerType: "greaterThan",
				allowNulls: false,
				type: "warning",
				messageTemplate: "TEST error: Cell must be positive number."
			});


			var headerRange = sheet.range("1:1");

			// disable first row
			headerRange.enable(false); //("A0:ZZ0")

			// freeze first row
			sheet.frozenRows(1);

			// disable formula completion list
			$(".k-spreadsheet-formula-list").remove();

			// disable right click menu options
			$(".k-context-menu").remove();


			// Stylize header row
			headerRange.bold(true);
			headerRange.wrap(true);
			sheet.rowHeight(0, 40);

			headerRange.background(headerStyle.background);
			headerRange.color(headerStyle.color);
			headerRange.fontSize(headerStyle.fontSize);
			headerRange.textAlign(headerStyle.textAlign);
			headerRange.verticalAlign(headerStyle.verticalAlign);
			headerRange.bold(false);

			//var intA = "A".charCodeAt(0);
			//var c = 1;

			// This is nice, but has some flaws... sometime refresh breaks and sometime hidden rows don't hide properly.  Also, this requires hiding the first row which strops resize
			// If we don't do this... we need to make row 1 readonly as the title row
			//angular.forEach(ptTemplate.columns, function (value, key) {
			//    $(".k-spreadsheet-view .k-spreadsheet-fixed-container .k-spreadsheet-pane .k-spreadsheet-column-header div:nth-of-type(" + c + ") div").html(value.title);
			//    vm.colToLetter[value.title] = String.fromCharCode(intA + c);
			//    c++;
			//});

			// hide default binding name (first row)
			// This has an unfortunate side effect... can't resize rows
			//sheet.hideRow(0);

			// get all readonly columns
			var readonly = [];
			for (var key in ptTemplate.model.fields) {
				if (ptTemplate.model.fields.hasOwnProperty(key) && ptTemplate.model.fields[key].editable !== true)
					readonly.push(key);
			}

                // hide all columns based on templating
                c = 0;
                for (var i = 0; i < ptTemplate.columns.length; i++) {
                    //if (readonly.indexOf(ptTemplate.columns[i].field) >= 0) {
                    //    sheet.range(String.fromCharCode(intA + c) + "1:" + String.fromCharCode(intA + c) + "200").enable(false);
                    //}
                    if (ptTemplate.columns[i].hidden === true) {
                        sheet.hideColumn(i);
                    } else {
                       c++;
                    }
                }

		});
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
					//this._clipboard.paste();
					this.customPaste(); // override kendo's clipboard paste. Original code: //this._clipboard.paste();

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
						cellData.background = cellStyle.background;
						cellData.bold = null;
						cellData.borderBottom = null;
						cellData.borderLeft = null;
						cellData.borderRight = null;
						cellData.borderTop = null;
						cellData.color = cellStyle.color;
						cellData.fontFamily = null;
						cellData.fontSize = cellStyle.fontSize;
						cellData.italic = null;
						cellData.link = null;
						cellData.textAlign = cellStyle.textAlign;
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
		alert("TODO: Validate");
		//$scope.showWipDeals();
	}


	init();
}