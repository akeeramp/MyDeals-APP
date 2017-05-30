angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'confirmationModal', 'dataService', 'logger', 'pricingTableData', 'ProductSelectorService', 'MrktSegMultiSelectService', '$uibModal', '$timeout'];

function PricingTableController($scope, $state, $stateParams, $filter, confirmationModal, dataService, logger, pricingTableData, ProductSelectorService, MrktSegMultiSelectService, $uibModal, $timeout) {

	var vm = this;

    // HACK: Not sure why this controller gets called twice.  This is to see if it is already started and exit.
    // If this controller gets called twice, 2 scopes are instanciated and Datasource syncing gets confused producing not data to save.
	if ($scope.$parent.$parent.spreadDs !== undefined) return;

	// Functions
	vm.initCustomPaste = initCustomPaste;
	vm.customDragDropAutoFill = customDragDropAutoFill;
	vm.resetDirty = resetDirty;
	vm.getColumns = getColumns;
	$scope.openProductSelector = openProductSelector;
	$scope.openInfoDialog = openInfoDialog;

	// Variables
	var root = $scope.$parent.$parent;	// Access to parent scope
	root.setBusy("Loading Deals", "Gathering deals and security settings.");
	var cellStyle = {
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
		fontSize: 12,
		fontWeight: "normal"
	};

	var intA = "A".charCodeAt(0);
	var ptTemplate = null;
	var columns = null;
	var gTools = null;
	var ssTools = null;
	var wipTemplate = null;
	var productLevel = null;
	root.colToLetter = {}; // Contains "dictionary" of  (Key : Value) as (Db Column Name : Column Letter)
	root.letterToCol = {};
	vm.readOnlyColLetters = [];
	vm.requiredStringColumns = {};
	root.wipData;
	root.wipOptions;
    var ssTools;

	function init() {
		// force a resize event to format page
		//$scope.resizeEvent();

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
				root.curPricingTable = util.findInArray(root.curPricingStrategy.PRC_TBL, root.curPricingTableId); // TODO: It's not finding the curPricingTable after adding a new one :<
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

		//$scope.dataGrid = root.pricingTableData.WIP_DEAL;

		generateKendoSpreadheetOptions();
	    generateKendoGridOptions();
	}

	// Generates options that kendo's html directives will use
	function generateKendoSpreadheetOptions() {
	    ptTemplate = root.templates.ModelTemplates.PRC_TBL_ROW[root.curPricingTable.OBJ_SET_TYPE_CD];
	    columns = vm.getColumns(ptTemplate);

	    ssTools = new gridTools(ptTemplate.model, ptTemplate.columns);

	    // now remove the header for new spreadsheet entries
	    if (Array.isArray($scope.pricingTableData.PRC_TBL_ROW)) {
	        root.pricingTableData.PRC_TBL_ROW = root.pricingTableData.PRC_TBL_ROW.filter(function (obj) {
	            return obj.DC_ID !== undefined && obj.DC_ID !== null;
	        });
	    }

	    root.spreadDs = ssTools.createDataSource(root.pricingTableData.PRC_TBL_ROW);
	    
		$scope.ptSpreadOptions = {
			headerWidth: 0, /* Hide the Row numbers */
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
	}

    // Generates options that kendo's html directives will use
	function generateKendoGridOptions() {
		wipTemplate = root.templates.ModelTemplates.WIP_DEAL[root.curPricingTable.OBJ_SET_TYPE_CD];
		gTools = new gridTools(wipTemplate.model, wipTemplate.columns);
		gTools.assignColSettings();

		$timeout(function () {
		    root.wipOptions = {};
		    root.wipOptions.columns = wipTemplate.columns;
		    root.wipOptions.model = wipTemplate.model;
		    root.wipOptions.default = {};
		    root.wipOptions.default.groups = [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1 },
                { "name": "Meet Comp", "order": 2 },
                { "name": "Retail Cycle", "order": 3 },
                { "name": "Backdate", "order": 4 },
                { "name": "Overlapping", "order": 5 },
                { "name": "Cost Test", "order": 6 },
                { "name": "All", "order": 99 }
		    ];
		    root.wipOptions.default.groupColumns = {
		        "tools": {
		            "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate", "Overlapping"]
		        },
		        "details": {
		            "Groups": ["Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate", "Overlapping"]
		        },
		        "DC_ID": {
		            "Groups": ["Deal Info"]
		        },
		        "DC_PARENT_ID": {
		            "Groups": ["Deal Info"]
		        },
		        "PASSED_VALIDATION": {
		            "Groups": ["Deal Info"]
		        },
		        "START_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "END_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "WF_STG_CD": {
		            "Groups": ["Deal Info"]
		        },
		        "OBJ_SET_TYPE_CD": {
		            "Groups": ["Deal Info"]
		        },
		        "PTR_USER_PRD": {
		            "Groups": ["Deal Info"]
		        },
		        "TITLE": {
		            "Groups": ["Deal Info"]
		        },
		        "PRODUCT_FILTER": {
		            "Groups": ["Deal Info"]
		        },
		        "DEAL_COMB_TYPE": {
		            "Groups": ["Deal Info"]
		        },
		        "ECAP_PRICE": {
		            "Groups": ["Deal Info"]
		        },
		        "CAP_INFO": {
		            "Groups": ["Deal Info"]
		        },
		        "CAP": {
		            "Groups": ["All"]
		        },
		        "CAP_STRT_DT": {
		            "Groups": ["All"]
		        },
		        "CAP_END_DT": {
		            "Groups": ["All"]
		        },
		        "YCS2_INFO": {
		            "Groups": ["Deal Info"]
		        },
		        "YCS2_PRC_IRBT": {
		            "Groups": ["All"]
		        },
		        "YCS2_START_DT": {
		            "Groups": ["All"]
		        },
		        "YCS2_END_DT": {
		            "Groups": ["All"]
		        },
		        "VOLUME": {
		            "Groups": ["Deal Info"]
		        },
		        "ON_ADD_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "DEAL_SOLD_TO_ID": {
		            "Groups": ["Deal Info"]
		        },
		        "EXPIRE_YCS2": {
		            "Groups": ["Deal Info"]
		        },
		        "ECAP_TYPE": {
		            "Groups": ["Deal Info"]
		        },
		        "MRKT_SEG": {
		            "Groups": ["Deal Info"]
		        },
		        "GEO_COMBINED": {
		            "Groups": ["Deal Info"]
		        },
		        "TRGT_RGN": {
		            "Groups": ["Deal Info"]
		        },
		        "PAYOUT_BASED_ON": {
		            "Groups": ["Deal Info"]
		        },
		        "PROGRAM_PAYMENT": {
		            "Groups": ["Deal Info"]
		        },
		        "TERMS": {
		            "Groups": ["Deal Info"]
		        },
		        "REBATE_BILLING_START": {
		            "Groups": ["Consumption"]
		        },
		        "REBATE_BILLING_END": {
		            "Groups": ["Consumption"]
		        },
		        "CONSUMPTION_REASON": {
		            "Groups": ["Consumption"]
		        },
		        "CONSUMPTION_REASON_CMNT": {
		            "Groups": ["Consumption"]
		        },
		        "COST_TEST_RESULT": {
		            "Groups": ["Cost Test"]
		        },
		        "PRD_COST": {
		            "Groups": ["Cost Test"]
		        },
		        "COST_TYPE_USED": {
		            "Groups": ["Cost Test"]
		        },
		        "COST_TEST_FAIL_OVERRIDE": {
		            "Groups": ["Cost Test"]
		        },
		        "COST_TEST_FAIL_OVERRIDE_REASON": {
		            "Groups": ["Cost Test"]
		        },
		        "YCS2_OVERLAP_OVERRIDE": {
		            "Groups": ["Cost Test"]
		        },
		        "MEET_COMP_PRICE_QSTN": {
		            "Groups": ["Meet Comp"]
		        },
		        "COMP_SKU": {
		            "Groups": ["Meet Comp"]
		        },
		        "COMP_SKU_OTHR": {
		            "Groups": ["Meet Comp"]
		        },
		        "COMPETITIVE_PRICE": {
		            "Groups": ["Meet Comp"]
		        },
		        "COMP_BENCH": {
		            "Groups": ["Meet Comp"]
		        },
		        "IA_BENCH": {
		            "Groups": ["Meet Comp"]
		        },
		        "COMP_TARGET_SYSTEM_PRICE": {
		            "Groups": ["Meet Comp"]
		        },
		        "MEETCOMP_TEST_RESULT": {
		            "Groups": ["Meet Comp"]
		        },
		        "MEETCOMP_TEST_FAIL_OVERRIDE": {
		            "Groups": ["Meet Comp"]
		        },
		        "MEETCOMP_TEST_FAIL_OVERRIDE_REASON": {
		            "Groups": ["Meet Comp"]
		        },
		        "RETAIL_CYCLE": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL_USR_DEF": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL_USR_DEF_CMNT": {
		            "Groups": ["Retail Cycle"]
		        },
		        "ECAP_FLR": {
		            "Groups": ["Retail Cycle"]
		        },
		        "BACK_DATE_RSN": {
		            "Groups": ["Backdate"]
		        }
		    };
		    root.wipData = root.pricingTableData.WIP_DEAL;
		    root.setBusy("Drawing Grid", "Applying security to the grid.");
		    $timeout(function () {
		        root.setBusy("", "");
		    }, 2000);
		}, 10);
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
					root.colToLetter[value.field] = letter;
					root.letterToCol[letter] = value.field;
				}
			});
		}
		return cols;
	}

	// On Spreadsheet change
	function onChange(arg) {
	    var sheet = arg.sender.activeSheet();
	    var flushSysPrdFields = ["PTR_USER_PRD", "START_DT", "END_DT", "GEO_COMBINED", "PROD_INCLDS"];

		// Don't do onchange events for any sheet other than the Main one
		if (arg.range._sheet._sheetName !== "Main") {
			return;
		}

		if (arg.range._ref.topLeft === undefined) {
			return;
		}

		var productColIndex = (root.colToLetter["PTR_USER_PRD"].charCodeAt(0) - intA);
		var topLeftRowIndex = (arg.range._ref.topLeft.row + 1);
		var bottomRightRowIndex = (arg.range._ref.bottomRight.row + 1);

		var isProductColumnIncludedInChanges = (arg.range._ref.topLeft.col >= productColIndex) && (arg.range._ref.bottomRight.col <= productColIndex);

		if (isProductColumnIncludedInChanges && arg.range.value() === null) {
		    kendo.confirm("Are you sure you want to delete this product and the matching deal?").then(function() {
		        $timeout(function () {
		            if (root.spreadDs !== undefined) {
		                var data = root.spreadDs.data();

		                var rowStart = topLeftRowIndex - 2;
		                var rowStop = bottomRightRowIndex - 2;

		                // look for skipped lines
		                var numToDel = rowStop + 1 - rowStart;
		                data.splice(rowStart, numToDel);

		                // now apply array to Datasource... one event triggered
		                root.spreadDs.sync();

		                $timeout(function () {
		                    var n = data.length + 2;
		                    disableRange(sheet.range("C" + n + ":Z" + (n + numToDel - 1)));
		                }, 10);
		            }

		        }, 10);
		    },
            function () { });
		}

		//sheet.batch(function () {
			// Trigger only if the changed range contains the product column
			// NOTE: The below condition assumes that a dragged range is dragged from top-to-bottom, left-to-right. If that ever 
			// changes (i.e. we move the products column so it's not the first editable column), then we should change this logic to accomodate that.
		if (isProductColumnIncludedInChanges && arg.range.value() !== null) {

				sheet.batch(function () {
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
				});
				//arg.range.forEachCell(
				//	function (rowIndex, colIndex, value) {
				//		if (colIndex === productColIndex) { // Product Col changed
				//			// Re-disable specific cells that are readOnly
				//			var rowInfo = root.pricingTableData.PRC_TBL_ROW[(rowIndex - 1)]; // This is -1 to account for the 0th rows in the spreadsheet
				//			if (rowInfo != undefined) { // The row was pre-existing
				//				disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, 1);
				//			}
				//			for (var key in ptTemplate.model.fields) { 
				//			    var hasExistingCellValue = (sheet.range(root.colToLetter[key] + (rowIndex + 1)).value()) === "" || (sheet.range(root.colToLetter[key] + (rowIndex + 1)).value() == null); // don't override existing values for autofill
				//				// Auto-fill default values from Contract level
				//				if ((root.contractData[key] !== undefined)
				//						&& (root.contractData[key] !== null)
				//						&& (root.colToLetter[key] != undefined)
				//						&& (hasExistingCellValue)
				//					) {
				//					var fillValue = root.contractData[key];
				//					if (ptTemplate.model.fields[key].type == "date") { 
				//						fillValue = new Date(root.contractData[key]);
				//					}
				//					sheet.range(root.colToLetter[key] + (rowIndex + 1)).value(fillValue);
				//				}
				//				// Auto-fill default values from Pricing Strategy level
				//				if ((root.curPricingTable[key] !== undefined)
				//						&& (root.curPricingTable[key] !== null)
				//						&& (root.colToLetter[key] != undefined)
				//						&& (hasExistingCellValue)
				//					) {
				//				    sheet.range(root.colToLetter[key] + (rowIndex + 1)).value(root.curPricingTable[key]);
				//				}
				//			}
				//		}
				//	}
				//);
			}
        
	    if (isProductColumnIncludedInChanges && arg.range.value() !== null) {
	        // Now lets sync all values.
	        // This is a performance boost
	        // Instead of batch and cell manipulation, we will 
	        //   1) dump the spreadsheet to a datasource
	        //   2) update the datasource array
	        //   3) reapply it to the datasource
	        //   4) sync it to the spreadsheet
	        //
	        //  Doesn't make sense why this is faster, but it is and it also doesn't look values as they are applied

	        $timeout(function () {
	            if (root.spreadDs !== undefined) {
	                var data = root.spreadDs.data();

	                var rowStart = topLeftRowIndex-2;
	                var rowStop = bottomRightRowIndex - 2;

	                // look for skipped lines
	                var insertNumRows = rowStart + 1 - data.length;
	                for (var n = 0; n < insertNumRows; n++) {
	                    data.splice(data.length - 1, 0,
                        {
                            "DC_ID": null,
                            "uid": util.generateUUID(),
                            "PTR_USER_PRD" : null,
                            "ECAP_PRICE" : null,
                            "VOLUME" : null,
                            "START_DT" : null,
                            "END_DT" : null
                        });
                    }
                    //debugger;

                    for (var r = rowStart; r <= rowStop; r++) {
                        //if (data[r] === undefined || data[r] === null) continue;
                        //if (data[r] === undefined || data[r] === null) {
                        //    data[r] = {};
                        //    data[r]["DC_ID"] = null;
                        //}
                        if (data[r] === undefined) data.push({});
                        var isNew = data[r]["DC_ID"] === null || data[r]["DC_ID"] === undefined;
                        if (isNew) {
                            data[r]["DC_ID"] = 0;
                            data[r]["VOLUME"] = null;
                            data[r]["ECAP_PRICE"] = null;
                        }

	                    for (var key in ptTemplate.model.fields) {
	                        if (ptTemplate.model.fields.hasOwnProperty(key)) {
	                            //var existingValue = data[r][key];

	                            // Auto-fill default values from Contract level
	                            if ((root.contractData[key] !== undefined) &&
	                                (root.contractData[key] !== null) &&
	                                (root.colToLetter[key] != undefined) &&
	                                isNew &&
	                                key !== "DC_ID"
	                            ) {
	                                var fillValue = root.contractData[key];
	                                if (ptTemplate.model.fields[key].type === "date") {
	                                    fillValue = new Date(root.contractData[key]);
	                                }
	                                // proper way to apply data to datasource, but triggers events and is slow
                                    // instead we will map to array and apply the entire array to DS firing only one event
	                                //data[r].set(key, fillValue);  
	                                data[r][key] = fillValue;
	                            }

	                            // Auto-fill default values from Pricing Strategy level
	                            if ((root.curPricingTable[key] !== undefined) &&
	                                (root.curPricingTable[key] !== null) &&
	                                (root.colToLetter[key] != undefined) &&
	                                isNew &&
	                                key !== "DC_ID"
	                            ) {
	                                // proper way to apply data to datasource, but triggers events and is slow
	                                // instead we will map to array and apply the entire array to DS firing only one event
	                                //data[r].set(key, root.curPricingTable[key]);
	                                data[r][key] = root.curPricingTable[key];
	                            }
	                        }
	                    }
                    }

                    // now apply array to Datasource... one event triggered
	                root.spreadDs.sync();
	            }

	        }, 10);

	            //arg.range.forEachCell(
                //    function (rowIndex, colIndex, value) {
                //        if (colIndex === productColIndex) { // Product Col changed

                //            for (var key in ptTemplate.model.fields) {
                //                var hasExistingCellValue = (sheet.range(root.colToLetter[key] + (rowIndex + 1)).value()) === "" || (sheet.range(root.colToLetter[key] + (rowIndex + 1)).value() == null); // don't override existing values for autofill

                //                // Auto-fill default values from Contract level
                //                if ((root.contractData[key] !== undefined)
                //                        && (root.contractData[key] !== null)
                //                        && (root.colToLetter[key] != undefined)
                //                        && (hasExistingCellValue)
                //                    ) {
                //                    var fillValue = root.contractData[key];
                //                    if (ptTemplate.model.fields[key].type == "date") {
                //                        fillValue = new Date(root.contractData[key]);
                //                    }
                //                    sheet.range(root.colToLetter[key] + (rowIndex + 1)).value(fillValue);
                //                }
                //                // Auto-fill default values from Pricing Strategy level
                //                if ((root.curPricingTable[key] !== undefined)
                //                        && (root.curPricingTable[key] !== null)
                //                        && (root.colToLetter[key] != undefined)
                //                        && (hasExistingCellValue)
                //                    ) {
                //                    sheet.range(root.colToLetter[key] + (rowIndex + 1)).value(root.curPricingTable[key]);
                //                }
                //            }

                //        }
                //    });

	    }

	    sheet.batch(function () {
	        // need to see if an item changed that would cause the PTR_SYS_PRD to be cleared out
	        var isPtrSysPrdFlushed = false;
	        for (var f = 0; f < flushSysPrdFields.length; f++) {
	            var colIndx = root.colToLetter[flushSysPrdFields[f]].charCodeAt(0) - intA;
	            if (arg.range._ref.topLeft.col <= colIndx && arg.range._ref.bottomRight.col >= colIndx) isPtrSysPrdFlushed = true;
	        }

	        if (isPtrSysPrdFlushed) {
	            // TODO we will need to revisit.  There are cases where we CANNOT remove products and reload... active deals for example
	            var range = sheet.range("C" + topLeftRowIndex + ":C" + bottomRightRowIndex);
	            range.value("");

	            arg.range.forEachCell(
                    function (rowIndex, colIndex, value) {
                        if (colIndex === productColIndex) { // Product Col changed
                            // Re-disable specific cells that are readOnly
                            var rowInfo = root.pricingTableData.PRC_TBL_ROW[(rowIndex - 1)]; // This is -1 to account for the 0th rows in the spreadsheet
                            if (rowInfo != undefined) { // The row was pre-existing
                                disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, 1);
                            }

                        }
                    });
	        }
	    });

	    //});

		
		if (!root._dirty) {
			root._dirty = true;
        }
}


	function disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, rowIndexOffset) {
	    sheet.batch(function () {
	        if (!rowInfo._behaviors) return;
			for (var property in rowInfo._behaviors.isReadOnly) {
				if (rowInfo._behaviors.isReadOnly.hasOwnProperty(property)) {
				    var colLetter = root.colToLetter[property];
					if (colLetter != null) {
					    //vm.readOnlyColLetters[root.colToLetter[property]] = true;
						disableRange(sheet.range(colLetter + (rowIndex + rowIndexOffset)));
					}
				}
			}
		});
	}

	// On spreadsheet Render
	function onRender(e) {
	    if (root.spreadNeedsInitialization) {
	        console.log("onRender");

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

    $scope.$on('saveWithWarnings',
        function (event, args) {
            var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
            if (!spreadsheet) return;
            var sheet = spreadsheet.activeSheet();
            var dropdownValuesSheet = spreadsheet.sheetByName("DropdownValuesSheet");
            sheetBatchOnRender(sheet, dropdownValuesSheet);
        });

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

	    sheet.batch(function() {

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
	        sheet.range(root.colToLetter["PTR_USER_PRD"] + ":" + root.colToLetter["PTR_USER_PRD"])
	            .editor("cellProductSelector");

	        for (var key in ptTemplate.model.fields) {

	            var myColumnName = root.colToLetter[key];
	            var myFieldModel = ptTemplate.model.fields[key];

	            if (ptTemplate.model.fields.hasOwnProperty(key) && myColumnName !== undefined) {

	                // Disabling logic
	                if (myFieldModel.editable !== true) {
	                    // Disable all readonly columns
	                    vm.readOnlyColLetters[myColumnName] = true;
	                    disableRange(sheet.range(myColumnName + ":" + myColumnName));
	                } else {
	                    // Flag which rows have something in them, ao we don't disable rows
	                    var numRowsContainingData = 0;
	                    if (root.pricingTableData.PRC_TBL_ROW.length > 0) {
	                        numRowsContainingData = root.pricingTableData.PRC_TBL_ROW.length + rowIndexOffset;
	                    }
	                    // Disable all cells except product and cells that are read-only from template
	                    if (key != "PTR_USER_PRD") {
	                        disableRange(sheet.range(myColumnName + numRowsContainingData + ":" + myColumnName));
	                    }
	                }

	                // Add validation dropdowns/multiselects onto the cells
	                if (myFieldModel.opLookupText == "DROP_DOWN" || myFieldModel.opLookupText == "dropdownName") {
	                    // Call API
	                    dataService.get(myFieldModel.opLookupUrl, null, null, true).then(function(response) {
	                            dropdownValuesSheet.batch(function() {
	                                for (var i = 0; i < response.data.length; i++) {
	                                    var myKey = response.data[i].ATRB_CD;
	                                    if (myKey === null || myKey === undefined) {
	                                        myKey = response.data[i]
	                                            .subAtrbValue;
// HACK: this is for Product Level's atrb code because it pulls form a different dropdown sp
	                                    }

	                                    // TODO: Why is ECAP_TYPE called PROGRAM_ECAP_TYPE and can we change that?
	                                    if (response.data[i].ATRB_CD == "PROGRAM_ECAP_TYPE") {
	                                        myKey = "ECAP_TYPE";
	                                    }
	                                    // Add values onto the other sheet
	                                    var dropdownValue = response.data[i].DROP_DOWN;
	                                    if (dropdownValue === undefined || dropdownValue === null) {
	                                        dropdownValue = response.data[i]
	                                            .dropdownName;
// HACK: this is for Product Level's atrb code because it pulls form a different dropdown sp
	                                    }

	                                    dropdownValuesSheet.range(root.colToLetter[myKey] + (i + 1)).value(dropdownValue);
	                                }
	                            });
	                        },
	                        function(error) {
	                            logger.error("Unable to get dropdown data.", error, error.statusText);
	                        });
	                    if (myFieldModel.uiType == "RADIOBUTTONGROUP" || myFieldModel.uiType == "DROPDOWN") {
	                        // MOVED TO MT VALIDATION AS MULTIPLE VALIDATIONS ARE NOT SUPPORTED AND MYDEALS_ERROR IS THE VALIDATION WE WILL USE
	                        sheet.range(myColumnName + ":" + myColumnName).validation({
	                            dataType: "list",
	                            showButton: true,
	                            from: "DropdownValuesSheet!" + myColumnName + ":" + myColumnName,
	                            allowNulls: myFieldModel.nullable,
	                            type: "warning",
	                            titleTemplate: "Invalid value",
	                            messageTemplate: "Invalid value. Please use the dropdown for available options."
	                        });
	                    } else if (myFieldModel.uiType == "EMBEDDEDMULTISELECT" || myFieldModel.uiType == "MULTISELECT") {
	                        sheet.range(myColumnName + ":" + myColumnName).editor("multiSelectPopUpEditor");
	                        // TODO: Add a better validator which makes sure the selected items are in the multiselect list
	                        vm.requiredStringColumns[key] = true;
	                    }
	                } else {
	                    // Add validations based on column type
	                    switch (myFieldModel.type) {
	                        case "date":
	                            var cellSelection = sheet.range(myColumnName + ":" + myColumnName);
	                        //sheet.range(myColumnName + ":" + myColumnName).format("MM/dd/yyyy");								
	                        cellSelection.editor("datePickerEditor");

	                        vm.requiredStringColumns[key] = true;
	                        break;
	                    case "number":
	                        if (!myFieldModel.nullable) {
	                            // MOVED TO MT VALIDATION AS MULTIPLE VALIDATIONS ARE NOT SUPPORTED AND MYDEALS_ERROR IS THE VALIDATION WE WILL USE
	                            //sheet.range(myColumnName + ":" + myColumnName).validation({
	                            //    dataType: "number",
	                            //    from: 0,
	                            //    comparerType: "greaterThan",
	                            //    allowNulls: false,
	                            //    type: "warning",
	                            //    messageTemplate: "Value must be positive number."
	                            //});
	                        }
	                        // Money Formatting
	                        if (myFieldModel.format == "{0:c}") {
	                            sheet.range(myColumnName + ":" + myColumnName).format("$#,##0.00");
	                        }
	                        break;
	                    case "string":
	                        if (!myFieldModel.nullable) {
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

	        // Hide columns based on templating
	        for (var i = 0; i < ptTemplate.columns.length; i++) {
	            if (ptTemplate.columns[i].hidden === true) {
	                sheet.hideColumn(i);
	            }
	        }

	        // Individual cell security via security mask's json obj behaviors
	        for (var rowIndex = 0; rowIndex < root.pricingTableData.PRC_TBL_ROW.length; rowIndex++) {
	            var rowInfo = root.pricingTableData.PRC_TBL_ROW[rowIndex];

	            // Required cells
	            //if (!!rowInfo._behaviors) {
	            //    for (var property in rowInfo._behaviors.isRequired) {
	            //        if (rowInfo._behaviors.isRequired.hasOwnProperty(property)) {
	            //            var colLetter = root.colToLetter[property];
	            //            if (colLetter != null) {
	            //                // MOVED TO MT VALIDATION AS MULTIPLE VALIDATIONS ARE NOT SUPPORTED AND MYDEALS_ERROR IS THE VALIDATION WE WILL USE
	            //                //sheet.range(colLetter + (rowIndex + rowIndexOffset)).validation({
	            //                //    dataType: "custom",
	            //                //    from: "LEN(" + colLetter + (rowIndex + rowIndexOffset) + ")>0",
	            //                //    allowNulls: false,
	            //                //    type: "warning",
	            //                //    messageTemplate: "This field is required."
	            //                //});
	            //            }
	            //        }
	            //    }
	            //}

			    // Read Only cells 
	            disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, rowIndexOffset);

	            //root.syncCellsOnSingleRow(sheet, rowInfo, rowIndex);

				//for (var key in ptTemplate.model.fields) { 
				//	// Required string validation via columns 
				//	// NOTE: LEN validation means that we need to put validation on ecah individual cell rather than bulk
	            //    if ((root.colToLetter[key] !== undefined) && (vm.requiredStringColumns.hasOwnProperty(key))) {
				//        // MOVED TO MT VALIDATION AS MULTIPLE VALIDATIONS ARE NOT SUPPORTED AND MYDEALS_ERROR IS THE VALIDATION WE WILL USE
	            //	    //sheet.range(root.colToLetter[key] + (rowIndex + rowIndexOffset)).validation({
				//		//	dataType: "custom",
	            //		//	from: "LEN(" + root.colToLetter[key] + (rowIndex + rowIndexOffset) + ")>0",
				//		//	allowNulls: false,
				//		//	type: "warning",
				//		//	messageTemplate: "This field is required."
				//		//});
				//	}
				//}
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
		//var sheet = spreadsheet.activeSheet();
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
		//var mainData = $scope.mainGridOptions.dataSource.data();

		//if ($scope.dataGrid !== undefined) {
		//	for (var i = 0; i < $scope.dataGrid.length; i++) {
		//		if (mainData[i] !== undefined) mainData[i]._dirty = false;
		//		angular.forEach(mainData[i],
        //            function (value, key) {
        //            	var item = mainData[i];
        //            	if (item._behaviors[field] === undefined) item._behaviors[field] = {};
        //            	item._behaviors[field][key] = false;

        //            	//_MultiDim
        //            	if (!util.isNull(root.gridDetailsDs[item["DC_ID"]])) {
        //            		var detailData = root.gridDetailsDs[item["DC_ID"]].data();
        //            		for (var ii = 0; ii < item._MultiDim.length; ii++) {
        //            			detailData[ii]._dirty = false;
        //            			angular.forEach(detailData[ii],
        //                            function (v1, k1) {
        //                            	var item2 = detailData[ii];
        //                            	if (item2._behaviors === undefined || item2._behaviors === null) item2._behaviors = {};
        //                            	if (item2._behaviors[field] === undefined || item2._behaviors[field] === null) item2._behaviors[field] = {};
        //                            	item2._behaviors[field][k1] = false;
        //                            });
        //            		}
        //            	}
        //            });
		//	}
		//}
	}

	// Watch for any changes to contract data to set a dirty bit
	$scope.$watch('$parent.$parent._dirty', function (newValue, oldValue, el) {
		if (newValue === false) {
			vm.resetDirty();
		}
	}, true);

	// TODO: Product Selector dialog box below
	kendo.spreadsheet.registerEditor("cellProductSelector", function () {
		var context, dlg, model;

		// Further delay the initialization of the UI until the `edit` method is
		// actually called, so here just return the object with the required API.

		return {
			edit: function (options) {
				context = options;
				open();
			},
			icon: "fa fa-check ssEditorBtn"
		};
		function open() {
			//var value = context.range.value();

			// TODO: Replace with actual Product Selector!
			var modalOptions = {
				closeButtonText: 'Close',
				hasActionButton: false,
				headerText: 'Help Text',
				bodyText: 'TODO'
			};
			confirmationModal.showModal({}, modalOptions);
		}
	});

	

	kendo.spreadsheet.registerEditor("multiSelectPopUpEditor", function () {
		var context;

		// Further delay the initialization of the UI until the `edit` method is
		// actually called, so here just return the object with the required API.
		return {
			edit: function (options) {
				context = options;
				open();
			},
			icon: "fa fa-check ssEditorBtn"
		};

		function open() {
			// Get selected cell
			var currColIndex = context.range._ref.col;

			// Get column name out of selected cell
			var colName = root.letterToCol[String.fromCharCode(intA + currColIndex)]

			// Get columnData (urls, name, etc) from column name
			var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW['ECAP'].model.fields[colName];

			// We have a "generic" variable in the scope to be the model. Then we replace the generic with a copy of the columnData
			// Inside the script tag, we have a ng-if equals column name then use whichever multiselct. 


			// If the selected cell already contains some value, reflect it in the custom editor.
			var cellCurrVal = context.range.value();
			var typeoftest = (typeof cellCurrVal);
			var isBlendedGeo = false;
			if (cellCurrVal !== null && cellCurrVal !== "" && typeof cellCurrVal == "string") {
				isBlendedGeo = (cellCurrVal.indexOf("[") >= 0);
				// Remove brackets
				cellCurrVal = cellCurrVal.replace(/\[(.*?)\]/g, "$1");

				cellCurrVal = cellCurrVal.trim();
				cellCurrVal = cellCurrVal.split(',');
			}

			var modalInstance = $uibModal.open({
				//animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'multiSelectPopUpModel',
				controller: 'MultiSelectModalCtrl',
				controllerAs: '$ctrl',
				size: 'md',
				resolve: {
					items: function () {
						return colData;
					},
					cellCurrValues: function () {
						return cellCurrVal;
					},
					colName: function () {
						return colName;
					},
					isBlendedGeo: function () {
						return isBlendedGeo;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				context.callback(selectedItem);
			}, function () { });
		}
	});



	// NOTE: Thhis is a workaround because the bulit-in kendo spreadsheet datepicker causes major perfromance issues in IE
	kendo.spreadsheet.registerEditor("datePickerEditor", function () {
		var context;

		// Further delay the initialization of the UI until the `edit` method is
		// actually called, so here just return the object with the required API.
		return {
			edit: function (options) {
				context = options;
				open();
			},
			icon: "k-icon k-i-calendar ssEditorBtn"
		};

        function fromOaDate(oadate) {
            var date = new Date(((oadate - 25569) * 86400000));
            var tz = date.getTimezoneOffset();
            return new Date(((oadate - 25569 + (tz / (60 * 24))) * 86400000));
        }

		function open() {
			// Get selected cell
			var currColIndex = context.range._ref.col;

			// Get column name out of selected cell
			var colName = root.letterToCol[String.fromCharCode(intA + currColIndex)]

			// Get columnData (urls, name, etc) from column name
			var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW['ECAP'].model.fields[colName];

			var cellDate = fromOaDate(context.range.value());

			var contractStartDate = $scope.$parent.$parent.contractData["START_DT"];
			var contractEndDate = $scope.$parent.$parent.contractData["END_DT"];

			var modalInstance = $uibModal.open({
				//animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'datePickerPopupModal',
				controller: 'DatePickerModalCtrl',
				controllerAs: '$ctrl',
				size: 'md',
				resolve: {
				    cellCurrValues: function () {
				        return cellDate;
					},
					colName: function () {
						return colName;
					},
					contractStartDate: function () {
						return contractStartDate;
					},
					contractEndDate: function () {
						return contractEndDate;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
			    context.callback(new Date(selectedItem));
			}, function () { });
		}
	});
	
	init();
}