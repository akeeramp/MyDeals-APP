angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'confirmationModal', 'dataService', 'logger', '$linq', 'pricingTableData', 'productSelectorService', 'MrktSegMultiSelectService', '$uibModal', '$timeout', 'opGridTemplate', 'confirmationModal'];

function PricingTableController($scope, $state, $stateParams, $filter, confirmationModal, dataService, logger, $linq, pricingTableData, productSelectorService, MrktSegMultiSelectService, $uibModal, $timeout, opGridTemplate, confirmationModal) {
    var vm = this;

    // HACK: Not sure why this controller gets called twice.  This is to see if it is already started and exit.
    // If this controller gets called twice, 2 scopes are instanciated and Datasource syncing gets confused producing not data to save.
    if ($scope.$parent.$parent.spreadDs !== undefined) return;

    // Functions
    vm.initCustomPaste = initCustomPaste;
    vm.customDragDropAutoFill = customDragDropAutoFill;
    vm.resetDirty = resetDirty;
    vm.getColumns = getColumns;
    vm.openProdCorrector = openProdCorrector;
    $scope.openProductSelector = openProductSelector;
    $scope.openInfoDialog = openInfoDialog;
    $scope.validateOnlyProducts = validateOnlyProducts;
    $scope.validatePricingTableProducts = validatePricingTableProducts;
    $scope.validateSavepublishWipDeals = validateSavepublishWipDeals;
    $scope.pcVer = "Beta";


    // If product corrector or selector modifies the product column do not clear PRD_SYS
    var systemModifiedProductInclude = false;

    // Variables
    var root = $scope.$parent.$parent;	// Access to parent scope
    $scope.root = root;
    root.setBusy("Loading Deals", "Gathering deals and security settings.");
    root.child = $scope;
    root.ptRowCount = 200;
    root.switchingTabs = false;
    var unlimitedVal = "Unlimited"; // TODO: Hook up to default from db maybe?

    root.uncompressJson(pricingTableData.data.PRC_TBL_ROW);

    var cellStyle = {
        textAlign: "left",
        verticalAlign: "center",
        color: "black",
        fontSize: 12,
        fontfamily: "Intel Clear"
    }
    var headerStyle = {
        background: "#ffffff",
        textAlign: "center",
        verticalAlign: "center",
        color: "#003C71",
        fontSize: 13,
        fontWeight: "bold"
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
    var lastHiddenBeginningColLetter; // The letter of the last hidden column before the user editable columns. Calculated using the firstEditableColBeforeProduct
    var finalColLetter = 'Z'; // Don't worry, this gets overrided to get the dynamic final col letter
    //root.wipData;
    //root.wipOptions;
    var ssTools;
    var stealthOnChangeMode = false;
    var nonMergedColIndexesDict = {}; // AKA col indexes with non merged cells
    root.isPtr = $state.current.name === "contract.manager.strategy";
    root.isWip = $state.current.name === "contract.manager.strategy.wip";

    // Hard-coded sadnesses, but are better than other hard-coded sadness solutions
    var productValidationDependencies = [
        "GEO_COMBINED",
        "PROGRAM_PAYMENT",
        "PROD_INCLDS"
    ];
    var firstEditableColBeforeProduct = null; // used along with to properly disable/enable cols before PTR_USR_PRD. Is calucated using editableColsBeforeProduct. Defaults to PTR_USR_PRD when editableColsBeforeProduct is empty
    var editableColsBeforeProduct = [
// keep track of columns that are before the PTR_USR_PRD column that can be edited by users, to properly enable/disable them
        "CUST_ACCNT_DIV"
    ];

    // Performance and UX... removed this.  We will need to handle these in the MT rules
    var flushSysPrdFields = ["PTR_USER_PRD", "PRD_EXCLDS", "START_DT", "END_DT", "GEO_COMBINED", "PROD_INCLDS", "PROGRAM_PAYMENT"];
    var flushTrackerNumFields = ["START_DT", "END_DT", "GEO_COMBINED"];


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

        pricingTableData.data["PRC_ST"] = [];
        pricingTableData.data["PRC_TBL"] = [];

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

        if (root.isPtr) {
            FixEcapKitField();
            generateKendoSpreadSheetOptions();
        }
        else {
            generateKendoGridOptions();
            root.pageTitle = "Deal Editor";
        }
    }

    function FixEcapKitField() {
        // Implement a rule to set KIT_ECAP column read only property = source column read only setting
        for (var i = 0; i < root.pricingTableData.PRC_TBL_ROW.length; i++) {
            var item = root.pricingTableData.PRC_TBL_ROW[i];
            if (item._behaviors !== undefined && item._behaviors.isReadOnly !== undefined && item._behaviors.isReadOnly["ECAP_PRICE"] !== undefined && item._behaviors.isReadOnly["ECAP_PRICE"] === true) {
                item._behaviors.isReadOnly["ECAP_PRICE_____20_____1"] = true;
            }
        }
    }

    function colToInt(colName) {
        return root.colToLetter[colName].charCodeAt(0) - "A".charCodeAt(0);
    }

    // Generates options that kendo's html directives will use
    function generateKendoSpreadSheetOptions() {
        pricingTableData.data.PRC_TBL_ROW = root.pivotData(pricingTableData.data.PRC_TBL_ROW);

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

        if (!root.contractData.CustomerDivisions || root.contractData.CustomerDivisions.length <= 1) {
            // hide Cust Div
            ptTemplate.columns[colToInt('CUST_ACCNT_DIV')].hidden = true;
        }

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
                    name: "DropdownValuesSheet" // COntains lists of data used for dropdowns
                }
            ],
            render: onRender
        };

        // Define Kendo Main Grid options
        gridUtils.onDataValueChange = function (e) {
            root._dirty = true;
        }
    }

    $scope.applySpreadsheetMerge = function () {
        var c, letter;
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
        var sheet = spreadsheet.activeSheet();
        var numTiers = 2;
        var rowOffset = 2;
        var data = root.spreadDs._data;
        var dcId = 0;
        nonMergedColIndexesDict = {};
        var numDeleted = 0;
		
        sheet.batch(function () {
            sheet.range("A" + (rowOffset) + ":ZZ" + root.ptRowCount).unmerge();
            for (var d = 0; d < data.length; d++) {
                if (dcId !== data[d].DC_ID) {
                    dcId = data[d].DC_ID;
                    numTiers = root.numOfPivot(data[d]);

                    for (c = 0; c < ptTemplate.columns.length; c++) {
                        letter = String.fromCharCode(intA + c);
                        // If there are more than 25 columns, 26th column letter name should be "AA", This will break again if we ahve more than 50 columns
                        var letter = (c > 25) ? String.fromCharCode(intA) + String.fromCharCode(intA + c - 26) : String.fromCharCode(intA + c);
                        if (!ptTemplate.columns[c].isDimKey) {
                            sheet.range(letter + rowOffset + ":" + letter + (rowOffset + numTiers - 1)).merge();
                        } else {
                            nonMergedColIndexesDict[c] = true;
                        }
                    }

                    if (data[d].id === null) numDeleted++;
                    rowOffset += numTiers;
                }
            }

            // TODO maybe we need to clean up items past data length to merge = 1
            //debugger;
            sheet.range("A" + (rowOffset - numDeleted) + ":" + finalColLetter + root.ptRowCount).unmerge();

        });

    }

    // Generates options that kendo's html directives will use
    function generateKendoGridOptions() {
        wipTemplate = root.templates.ModelTemplates.WIP_DEAL[root.curPricingTable.OBJ_SET_TYPE_CD];
        gTools = new gridTools(wipTemplate.model, wipTemplate.columns);
        gTools.assignColSettings();


        root.wipOptions = {
            "isLayoutConfigurable": true,
            "isPricingTableEnabled": true,
            "isVisibleAdditionalDiscounts": true,
            "isExportable": true,
            "isEditable": true,
            "exportableExcludeFields": ["CAP_INFO", "CUST_MBR_SID", "DC_PARENT_ID", "PASSED_VALIDATION", "YCS2_INFO", "details", "tools"]
        };
        root.wipOptions.columns = wipTemplate.columns;
        root.wipOptions.model = wipTemplate.model;
        root.wipOptions.default = {};
        root.wipOptions.default.groups = opGridTemplate.groups[root.curPricingTable.OBJ_SET_TYPE_CD];
        root.wipOptions.default.groupColumns = opGridTemplate.templates[root.curPricingTable.OBJ_SET_TYPE_CD];

        root.wipOptions.isOverlapNeeded = (root.curPricingStrategy !== undefined && (root.curPricingStrategy.WF_STG_CD === "Draft" || root.curPricingStrategy.WF_STG_CD === "Requested"));

        //root.wipOptions.default.groups = [
        //    { "name": "Deal Info", "order": 0 },
        //    { "name": "Consumption", "order": 1 },
        //    { "name": "Meet Comp", "order": 2 },
        //    { "name": "Backdate", "order": 4 },
        //    { "name": "Overlapping", "order": 5 },
        //    { "name": "Cost Test", "order": 6 },
        //    { "name": "All", "order": 99 }
        //];

        // check for soft warnings
        var numWarn = 0;
        for (var w = 0; w < root.pricingTableData.WIP_DEAL.length; w++) {
            if (!!root.pricingTableData.WIP_DEAL[w]["CAP"]) {
                if (root.pricingTableData.WIP_DEAL[w]["CAP"] === "No CAP") {
                    numWarn++;
                }
                var cap = parseFloat(root.pricingTableData.WIP_DEAL[w]["CAP"]);
                var ecap = parseFloat(root.pricingTableData.WIP_DEAL[w]["ECAP_PRICE"]);
                if (ecap > cap) {
                    numWarn++;
                }
            }
        }

        root.wipOptions.numSoftWarn = numWarn;

        root.wipData = root.pricingTableData.WIP_DEAL;

        // If no data was returned, we should redirect back to PTR
        if (root.wipData.length === 0 || anyPtrDirtyValidation()) { // Make PT dirty
            $state.go('contract.manager.strategy',
                {
                    cid: $scope.contractData.DC_ID,
                    sid: $scope.curPricingStrategyId,
                    pid: $scope.curPricingTableId
                },
                { reload: true });
        }

        root.setBusy("Drawing Grid", "Applying security to the grid.", "Info", true, true);
    }

    function anyPtrDirtyValidation() {
        var dirtyItems = $linq.Enumerable().From($scope.pricingTableData.PRC_TBL_ROW).Where(
                function (x) {
                    return x.PASSED_VALIDATION === "Dirty";
                }).ToArray();

        return dirtyItems.length > 0;
    }

    function getFormatedGeos(geos) {
        if (geos == null) { return null; }
        var isBlendedGeo = (geos.indexOf('[') > -1) ? true : false;
        if (isBlendedGeo) {
            geos = geos.replace('[', '');
            geos = geos.replace(']', '');
            geos = geos.replace(' ', '');
        }
        return geos;
    }

    function openProductSelector(currentPricingTableRow, enableSplitProducts) {
        var contract = $scope.$parent.$parent.contractData;

        var pricingTableRow = {
            'START_DT': moment(contract.START_DT).format("l"),
            'END_DT': moment(contract.END_DT).format("l"),
            'CUST_MBR_SID': contract.CUST_MBR_SID,
            'GEO_COMBINED': getFormatedGeos(root.curPricingTable["GEO_COMBINED"]),
            'PTR_SYS_PRD': "",
            'PTR_SYS_INVLD_PRD': "",
            'PROGRAM_PAYMENT': root.curPricingTable["PROGRAM_PAYMENT"],
            'PROD_INCLDS': root.curPricingTable["PROD_INCLDS"]
        };

        var suggestedProduct = {
            'mode': 'manual',
            'prodname': vm.productName
        };

        var modal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productSelector/productSelector.html',
            controller: 'ProductSelectorModalController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: 'prdSelector-modal-window',
            resolve: {
                productSelectionLevels: ['productSelectorService', function (productSelectorService) {
                    var dtoDateRange = {
                        startDate: pricingTableRow.START_DT, endDate: pricingTableRow.END_DT, mediaCode: pricingTableRow.PROD_INCLDS
                    };
                    root.setBusy("Please wait...", "");
                    return productSelectorService.GetProductSelectorWrapper(dtoDateRange).then(function (response) {
                        root.setBusy("", "");
                        return response;
                    }, function (response) {
                        root.setBusy("", "");
                        logger.error("Unable to launch product selector.", response, response.statusText);
                    });
                }],
                pricingTableRow: angular.copy(pricingTableRow),
                suggestedProduct: function () {
                    return suggestedProduct;
                },
                enableSplitProducts: function () {
                    return true;
                },
                dealType: function () {
                    return root.curPricingTable.OBJ_SET_TYPE_CD;
                }
            }
        });

        modal.result.then(
            function (productSelectorOutput) {
                // Available blank row from the spreadsheet
                var rowStart = root.spreadDs._data.length + 2;
                var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
                var sheet = spreadsheet.activeSheet();
                updateSpreadSheetFromSelector(productSelectorOutput, sheet, rowStart);
            },
            function () {
                // Do Nothing on cancel
            });
    }
    // Converts JSON sysproducts to array
    function populateValidProducts(sysProducts) {
        var kitReOrderObject = { 'ReOrderedJSON': '', 'PRD_DRAWING_ORD': '' };

        var addedProducts = [];
        for (var key in sysProducts) {
            if (sysProducts.hasOwnProperty(key)) {
                angular.forEach(sysProducts[key], function (item) {
                    addedProducts.push(item);
                });
            }
        }
        // Orders KIT products
        addedProducts = $filter('kitProducts')(addedProducts, 'DEAL_PRD_TYPE');
        var pricingTableSysProducts = {};
        // Construct the new reordered JSON for KIT, if user input is Ci3, derived user input will be selected products
        angular.forEach(addedProducts, function (item, key) {
            if (!pricingTableSysProducts.hasOwnProperty(item.DERIVED_USR_INPUT)) {
                pricingTableSysProducts[item.DERIVED_USR_INPUT] = [item];
            } else {
                pricingTableSysProducts[item.DERIVED_USR_INPUT].push(item);
            }
        });

        kitReOrderObject.ReOrderedJSON = pricingTableSysProducts;
        kitReOrderObject.PRD_DRAWING_ORD = addedProducts.map(function (p) {
            return p.PRD_MBR_SID;
        }).join(',');

        kitReOrderObject.contractProducts = addedProducts.map(function (p) {
            return p.DERIVED_USR_INPUT;
        }).join(',');

        return kitReOrderObject;
    }

    function updateSpreadSheetFromSelector(productSelectorOutput, sheet, rowStart) {
        var validatedSelectedProducts = productSelectorOutput.validateSelectedProducts;
        if (!productSelectorOutput.splitProducts) {
            var usrInput = updateUserInput(validatedSelectedProducts, productSelectorOutput.contractProduct);
            var contractProducts = usrInput.contractProducts;

            //PTR_SYS_PRD
            sheet.range(root.colToLetter["PTR_SYS_PRD"] + (rowStart)).value(JSON.stringify(validatedSelectedProducts));
            systemModifiedProductInclude = true;
            sheet.range(root.colToLetter['PTR_USER_PRD'] + (rowStart)).value(contractProducts); 
            if (root.colToLetter["PRD_DRAWING_ORD"] != undefined) {
                sheet.range(root.colToLetter['PRD_DRAWING_ORD'] + (rowStart)).value(productSelectorOutput.prdDrawingOrd);
            }
            if (root.colToLetter["PRD_EXCLDS"] != undefined) {
                sheet.range(root.colToLetter['PRD_EXCLDS'] + (rowStart)).value(usrInput.excludeProducts);
            }
            if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                var numTiers = sheet.range(root.colToLetter['NUM_OF_TIERS'] + (rowStart)).value();
                var modifiedNumTiers = contractProducts.split(',').length;
                if (root.isPivotable() && numTiers !== null) {
                    var mergedRows = parseInt(rowStart) + sheet.range(root.colToLetter['NUM_OF_TIERS'] + (rowStart)).value();
                    modifiedNumTiers = modifiedNumTiers < numTiers ? numTiers : modifiedNumTiers;
                    for (var a = mergedRows - 1; a >= rowStart ; a--) {
                        sheet.range(root.colToLetter["PTR_SYS_PRD"] + (a)).value(JSON.stringify(validatedSelectedProducts));
                        sheet.range(root.colToLetter['PRD_DRAWING_ORD'] + (a)).value(productSelectorOutput.prdDrawingOrd);
                        //sheet.range(root.colToLetter['TIER_NBR'] + (a)).value(modifiedNumTiers);
                        modifiedNumTiers--;
                        systemModifiedProductInclude = true;
                        sheet.range(root.colToLetter['PTR_USER_PRD'] + (a)).value(contractProducts); 
                        systemModifiedProductInclude = false;
                    }
                    rowStart = mergedRows - 1;
                }
            }

            systemModifiedProductInclude = false;
            sheet.range(root.colToLetter['PTR_SYS_INVLD_PRD'] + (rowStart)).value("");

            syncSpreadRows(sheet, rowStart, rowStart);

            root._dirty = true;

            $timeout(function () {
                validateSingleRowProducts(sheet.dataSource._data[rowStart - 2], rowStart - 1);
            }, 50);
        } else {
            var initRow = rowStart;
            var row = initRow;
            var singleProductJSON = {}
            for (var key in validatedSelectedProducts) {
                if (validatedSelectedProducts[key].length > 1) {
                    angular.forEach(validatedSelectedProducts[key], function (value, i) {
                        if (!value.EXCLUDE) {
                            singleProductJSON[value.HIER_VAL_NM] = value;
                        }
                    });
                } else {
                    if (!validatedSelectedProducts[key][0].EXCLUDE) {
                        singleProductJSON[validatedSelectedProducts[key][0].HIER_VAL_NM] = validatedSelectedProducts[key];
                    }
                }
            }
            for (var key in singleProductJSON) {
                if (singleProductJSON.hasOwnProperty(key)) {
                    if (root.isPivotable()) {
                        var mergedRows = parseInt(row) + root.numOfPivot();
                        for (var a = row; a < mergedRows ; a++) {
                            var validJSON = {};
                            validJSON[key] = singleProductJSON[key];
                            sheet.range(root.colToLetter["PTR_SYS_PRD"] + (a)).value(JSON.stringify(validJSON));
                            systemModifiedProductInclude = true;
                            sheet.range(root.colToLetter['PTR_USER_PRD'] + (a)).value(key);
                            systemModifiedProductInclude = false;
                            sheet.range(root.colToLetter['PTR_SYS_INVLD_PRD'] + (a)).value("");
                        }
                        row = mergedRows - 1;
                    } else {
                        var validJSON = {};
                        validJSON[key] = singleProductJSON[key];
                        sheet.range(root.colToLetter["PTR_SYS_PRD"] + (row)).value(JSON.stringify(validJSON));
                        systemModifiedProductInclude = true;
                        sheet.range(root.colToLetter['PTR_USER_PRD'] + (row)).value(key);
                        systemModifiedProductInclude = false;
                        sheet.range(root.colToLetter['PTR_SYS_INVLD_PRD'] + (row)).value("");
                    }
                    row++;
                }
            }
            syncSpreadRows(sheet, initRow, row - 1);
        }
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
                // Create column to letter mapping
                var letter = (c > 25) ? String.fromCharCode(intA) + String.fromCharCode(intA + c - 26) : String.fromCharCode(intA + c);
                root.colToLetter[value.field] = letter;
                root.letterToCol[letter] = value.field;
            });
            finalColLetter = (ptTemplate.columns.length > 26) ? String.fromCharCode(intA) + String.fromCharCode(intA + (ptTemplate.columns.length - 27))
                : String.fromCharCode(intA + (ptTemplate.columns.length - 1));
        }

        lastHiddenBeginningColLetter = String.fromCharCode(root.colToLetter[GetFirstEdiatableBeforeProductCol()].charCodeAt(0) - 1);

        return cols;
    }

    // On Spreadsheet change
    function onChange(arg) {
        if (stealthOnChangeMode) {
            //stealthOnChangeMode = false;
            return;
        }

        syncUndoRedoCounters();

        //if (Object.prototype.toString.call(arg.range._ref) === "[object Object]") {
        //    arg.preventDefault();
        //    return;
        //}

        var sheet = arg.sender.activeSheet();
        var range = arg.range;

        // Don't do onchange events for any sheet other than the Main one
        if (range._sheet._sheetName !== "Main" || range._ref.topLeft === undefined) {
            return;
        }

        var topLeftRowIndex = (range._ref.topLeft.row + 1);
        // THIS ASSUMES ALL PIVOTS ROWS ARE THE SAME NUMBER
        //var bottomRightRowIndex = (range._ref.bottomRight.row + (range._ref.bottomRight.row % root.numOfPivot()) + 1);
        var bottomRightRowIndex = (range._ref.bottomRight.row + 1);

        var productColIndex = (root.colToLetter["PTR_USER_PRD"].charCodeAt(0) - intA);
        var excludeProductColIndex = root.colToLetter["PRD_EXCLDS"] ? (root.colToLetter["PRD_EXCLDS"].charCodeAt(0) - intA) : -1;

        var isProductColumnIncludedInChanges = (range._ref.topLeft.col <= productColIndex) && (range._ref.bottomRight.col >= productColIndex);
        var isExcludeProductColumnIncludedInChanges = (range._ref.topLeft.col <= excludeProductColIndex) && (range._ref.bottomRight.col >= excludeProductColIndex);

        var data = root.spreadDs.data();
        var sourceData = root.pricingTableData.PRC_TBL_ROW;


        // KIT
        if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            var dealGrpColIndex = (root.colToLetter["DEAL_GRP_NM"].charCodeAt(0) - intA);
            var dscntPerLnIndex = (root.colToLetter["DSCNT_PER_LN"].charCodeAt(0) - intA);
            var qtyIndex = (root.colToLetter["QTY"].charCodeAt(0) - intA);
            var ecapIndex = (root.colToLetter["ECAP_PRICE"].charCodeAt(0) - intA);
            var kitEcapIndex = (root.colToLetter["ECAP_PRICE_____20_____1"].charCodeAt(0) - intA);
            var ptTemplate = root.templates.ModelTemplates.PRC_TBL_ROW[root.curPricingTable.OBJ_SET_TYPE_CD];

            var isDealGrpColumnIncludedInChanges = (range._ref.topLeft.col <= dealGrpColIndex) && (range._ref.bottomRight.col >= dealGrpColIndex);
            var isDscntPerLnColChanged = (range._ref.topLeft.col <= dscntPerLnIndex) && (range._ref.bottomRight.col >= dscntPerLnIndex);
            var isQtyColChanged = (range._ref.topLeft.col <= qtyIndex) && (range._ref.bottomRight.col >= qtyIndex);
            var isEcapColChanged = (range._ref.topLeft.col <= ecapIndex) && (range._ref.bottomRight.col >= ecapIndex);
            var isKitEcapColChanged = (range._ref.topLeft.col <= kitEcapIndex) && (range._ref.bottomRight.col >= kitEcapIndex);

            if (isDealGrpColumnIncludedInChanges || isQtyColChanged || isDscntPerLnColChanged || isEcapColChanged || isKitEcapColChanged) {
                var skipUntilRow = null; // HACK: used so we don't check deal group type of merged tiers
                var dealGrpSkipVal = "";
                var confirmationModPerDealGrp = {};

                range.forEachCell(
					function (rowIndex, colIndex, value) {
					    var myRowIndex = (rowIndex - 1);
					    var myRow = data[myRowIndex];
					    var myColLetter = String.fromCharCode(intA + (colIndex));
					    var colName = root.letterToCol[myColLetter];

					    if (myRow != undefined && myRow.DC_ID != undefined && myRow.DC_ID != null) {
					        var prevValue = angular.copy(myRow[colName]);
					        var numOfTiers = root.numOfPivot(myRow);

					        // HACK: Set the other columns' values in our data and source data to value else they will not change to our newly expected values
					        var myColLetter = String.fromCharCode(intA + (colIndex));
					        var colName = root.letterToCol[myColLetter];
					        var tierNbr = myRow["TIER_NBR"];
					        if (ptTemplate.model.fields[colName].type == "number") {
					            // format numbers based on templating
					        	myRow[colName] = (parseFloat(value.value) || 0);
					        } else {
					            myRow[colName] = value.value;
					        }

					        // Update Total Discount per line if DSCNT_PER_LN or QTY are changed
					        if (colIndex == dscntPerLnIndex || colIndex == qtyIndex) {
					            // Transform negative numbers into positive
					            if (colIndex == qtyIndex) {
					                myRow["QTY"] = (Math.abs(parseInt(value.value) || 0) || 0);
					            }
					            myRow["TEMP_TOTAL_DSCNT_PER_LN"] = root.calculateTotalDsctPerLine(myRow["DSCNT_PER_LN"], myRow["QTY"]);
					        }

					        // Logic to apply to merge cells (multiple tiers)
					        if (skipUntilRow != null && rowIndex < skipUntilRow) { // Subsequent (non-first) row of a merged cell
					            // Set the deal group val to be the same as the first one of the merged rows
					        	if (colIndex == dealGrpColIndex) {
					        		value.value = dealGrpSkipVal;
					        		myRow["DEAL_GRP_NM"] = dealGrpSkipVal;
					            }
					        }
					        else { // Either a cell that is not merged OR the first row of a merged cell
					            // If it's a merged cell (multiple tiers) then find out how many rows to skip for
					            if (numOfTiers > 1) {
					                skipUntilRow = rowIndex + numOfTiers;
					                dealGrpSkipVal = value.value;
					            }

					            if (colIndex == dealGrpColIndex) {	// DEAL_GRP functionality // Check for Deal Group Type merges and renames
 
					                var dealGrpKeyFirstIndex = myRowIndex;
					                data = root.spreadDs.data();

					            	// Update the other tiers (because they may not update the other tiers if user drag-drops through only some of the rows of the merged row
					                for (var i = 0; i < parseInt(data[myRowIndex]["NUM_OF_TIERS"]); i++) {
					                	data[myRowIndex + i]["DEAL_GRP_NM"] = data[myRowIndex]["DEAL_GRP_NM"];
									}

					                // Look for another occurance of the Deal Group Name (AKA - Kit Name)
					                for (var i = 0; i < data.length; i++) {
					                    if (formatStringForDictKey(data[i]["DEAL_GRP_NM"]) == formatStringForDictKey(myRow["DEAL_GRP_NM"])
											&& parseInt(data[i]["TIER_NBR"]) == 1
											&& i != myRowIndex) {
					                        dealGrpKeyFirstIndex = i;
					                        break;
					                    }
					                }

					                if (dealGrpKeyFirstIndex != myRowIndex) { // Another occurance of the Deal Group Name (AKA - Kit Name) exists
					                    var existingRow = data[dealGrpKeyFirstIndex];
					                    var isNonEditableKITname = ((parseInt(existingRow["HAS_TRACKER"]) || 0) == 1 || (!!existingRow._behaviors && !!existingRow._behaviors.isReadOnly && existingRow._behaviors.isReadOnly["PTR_USER_PRD"] == true));

					                	// Prepare deal groups for merging confirmation after the range.forEachCell() is done
					                    var myKey = formatStringForDictKey(myRow["DEAL_GRP_NM"]);
					                    if (!confirmationModPerDealGrp.hasOwnProperty(myKey)) {
					                    	confirmationModPerDealGrp[myKey] = {
					                    		"existingDcID": existingRow["DC_ID"],
					                    		"RowCount": parseInt(existingRow["NUM_OF_TIERS"]) + parseInt(myRow["NUM_OF_TIERS"]),
					                    		"isNonEditableKITname": isNonEditableKITname
					                    	}
					                    } else {
					                    	// Add to count for validation purposes
					                    	confirmationModPerDealGrp[myKey].RowCount = confirmationModPerDealGrp[myKey].RowCount + parseInt(myRow["NUM_OF_TIERS"]);
					                    }
					                }
					            }
					        }
					        // Get the first tier row
					        var firstTierRowIndex = (rowIndex - tierNbr);
					        var firstTierRow = data[firstTierRowIndex];

					        // Update Kit Rebate / Bundle Discount if DSCNT_PER_LN or QTY are changed
					        if (colIndex == ecapIndex || colIndex == kitEcapIndex) {

					            // TODO:  NOTE: this only sets the correct TEMP_KIT_REBATE value to the first row. If we need to set all the TEMP_KIT_REBATE values of each row, then we should revisit this
					            firstTierRow["TEMP_KIT_REBATE"] = root.calculateKitRebate(data, firstTierRowIndex, numOfTiers, false); //kitRebateTotalVal;
					        }

					        myRow["dirty"] = true; // NOTE: this is needed to have sourceData sync correctly with data.
					        //sourceData[(rowIndex - 1)]["dirty"] = true;

					        // HACK: Make the firstTierRow dirty or else we'd have a very weird re-tiering bug where 1st tier turns into the last changed
					        //		tier on sync's e.success(). It doesn't what column was changed - any dim-ed/tiered column will cause this issue.
					        //		TODO: Still have no idea why this happens. Figuring out why is a todo.
					        firstTierRow["dirty"] = true;
					    }
					}
				);

                var modalOptions = null;

                // Deal Group Merging
                for (var key in confirmationModPerDealGrp) {
                	if (confirmationModPerDealGrp.hasOwnProperty(key)) {
                		if (confirmationModPerDealGrp[key].isNonEditableKITname) {
                			// User tried to merge a deal group name that exists and cannot be edited (like when it has a tracker number)
							modalOptions = {
                				closeButtonText: "Okay",
                				hasActionButton: false,
                				headerText: "Cannot merge KIT name",
                				bodyText: "A Kit with the name \"" + key + "\" already exists and its products cannot be edited. Please choose a different KIT name.",
                				closeResults: { "key": key }
                			};
                		}
                		else if (confirmationModPerDealGrp[key].RowCount > $scope.$parent.$parent.maxKITproducts) {
                            // Cannot merge
                            modalOptions = {
                                closeButtonText: "Okay",
                                hasActionButton: false,
                                headerText: "Cannot merge KIT name",
                                bodyText: "A Kit with the name \"" + key + "\" already exists.  Unfortunately, you cannot merge these rows since merging them will exceed the max limit of products you can have (which is 10).  Please specify a different Kit Name or remove products from this row and try again.",
                                closeResults: { "key": key }
                            };
                        } else {
                            // Ask user if they want to merge
                            modalOptions = {
                                closeButtonText: "Cancel",
                                actionButtonText: "Merge rows",
                                hasActionButton: true,
                                headerText: "KIT name merge confirmation",
                                bodyText: "A Kit with the name \"" + key + "\" already exists.  Would you like to merge rows containing this Kit Name?  Please note that any duplicate products will automatically be removed upon merging.",
                                actionResults: { "key": key }, // HACK: without this, we won't get the correct key in the modal's .then()
                                closeResults: { "key": key }
                            };
                        }

                        confirmationModal.showModal({}, modalOptions)
							.then(function (result) { // Merge existing row with currently-changing row
							    var originalExistingCopy = null;
							    var originalExistingIndex = null;
							    var prevValues = [];
							    var root = $scope.$parent.$parent;	// Access to parent scope
							    var sourceData = root.pricingTableData.PRC_TBL_ROW;
							    var data = root.spreadDs.data();
							    var numOfExistingTiers = 0;

							    // Find the existing's index since the original existing index can be located below one of the merging-into rows, which were spliced
							    for (var i = 0; i < data.length; i++) {
							        if (originalExistingCopy == null && parseInt(data[i]["TIER_NBR"]) == 1 && data[i]["DC_ID"] == confirmationModPerDealGrp[result.key].existingDcID) {
							            // get the original existing copy to merge everything into
							            originalExistingCopy = angular.copy(data[i]);
							            originalExistingIndex = i;
							            break;
							        }
							    }
							    // Find/get all occurances with deal-grp-nm
							    for (var i = data.length - 1; i >= 0 && prevValues.length <= 10; i--) {
							    	if (formatStringForDictKey(data[i]["DEAL_GRP_NM"]) == result.key) {
							    		for (var j = (i + parseInt(data[i]["NUM_OF_TIERS"]) - 1); j >= i; j--) { // NOTE: only the first row of a merged group has DEAL_GRP_NM, so we want to backtrack to include the other tiers within that group 
							    			prevValues.push(angular.copy(data[j]));

							    			if (data[j]["DC_ID"] == confirmationModPerDealGrp[result.key].existingDcID) {
							    				// HACK: Note that we cannot splice the existing rows that we'd later to merge into, or else sourceData will not sync correctly.
							    				//		The reason is that Kendo will think that the a row with the same DC_ID and TIER_NBR is an Update() instead of a Create() and therefore not update the data correctly

							    				numOfExistingTiers++;

							    				if (parseInt(data[j]["TIER_NBR"]) == 1) {
							    					continue;
							    				}
							    			}
							    			else {
							    				if (j < originalExistingIndex) {
							    					// the original index will change if the row is above the original and gets spliced
							    					originalExistingIndex -= 1;
							    				}
							    				// "delete" the rows to merge
							    				data.splice(j, 1);
							    			}
							    		}
							        }
							    }
							    var numOfDuplicates = 0;
							    // Check for and remove duplicates
							    var duplicateCheckerDict = {};
							    for (var i = prevValues.length - 1; i >= 0; i--) {
							        if (duplicateCheckerDict.hasOwnProperty(formatStringForDictKey(prevValues[i]["PRD_BCKT"]))) {
							            prevValues.splice(i, 1);
							            numOfDuplicates++;
							        } else {
							            duplicateCheckerDict[formatStringForDictKey(prevValues[i]["PRD_BCKT"])] = true;
							        }
							    }

							    prevValues = prevValues.reverse();

							    // Update the row to have merged deal grp names
							    for (var i = 0; i < numOfExistingTiers; i++) {
							        var updateIndex = originalExistingIndex + i;
							        data[updateIndex]["PTR_USER_PRD"] = prevValues.map(function (e) { return e["PRD_BCKT"] }).join(",");
							        data[updateIndex]["PTR_SYS_PRD"] = null; // force revalidation
							        data[updateIndex]["NUM_OF_TIERS"] = parseInt(prevValues.length);
							        data[updateIndex]['dirty'] = true;
							    }

							    cleanupData(data); // Cleanup to get KIT re-tiering
							    sheet.batch(function (e) {
							        // TODO: disable numOfDuplicates below data
							        // Disable user editable columns
							        disableRange(sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + (data.length + 2) + ":" + finalColLetter + (data.length + 2 + numOfDuplicates)));

							        // Re-enable Product column
							        var prdRange = sheet.range(root.colToLetter["PTR_USER_PRD"] + (data.length + 2) + ":" + root.colToLetter["PTR_USER_PRD"] + (data.length + 2 + numOfDuplicates));
							        prdRange.enable(true);
							        prdRange.background(null);
							    });
							    // Re-put old merged dimensionalized values into the new merged rows
							    for (var i = 0; i < parseInt(prevValues.length) ; i++) {
							        var newRowIndex = originalExistingIndex + i; // data.length - (parseInt(prevValues.length) - i); // + existingNumTiers to start at new numTiers index
							        for (var d = 0; d < root.kitDimAtrbs.length; d++) {
							            if (root.kitDimAtrbs[d] == "TIER_NBR") {
							                continue;
							            }
							            data[newRowIndex][root.kitDimAtrbs[d]] = prevValues[i][root.kitDimAtrbs[d]];
							        }
							    }
							    // Recalculate KIT Rebate
							    // TODO:  NOTE: this only sets the correct TEMP_KIT_REBATE value to the first row. If we need to set all the TEMP_KIT_REBATE values of each row, then we should revisit this
							    data[originalExistingIndex]["TEMP_KIT_REBATE"] = root.calculateKitRebate(data, originalExistingIndex, parseInt(data[originalExistingIndex]["NUM_OF_TIERS"]), false);

							    data[originalExistingIndex]['dirty'] = true;
							    sourceData[originalExistingIndex]['dirty'] = true;

								//sync
							    spreadDsSync();
							    clearUndoHistory();
							    root.child.setRowIdStyle(data);

							}
							, function (response) { // Cancel Merge
							    // Find all occurances with deal-grp-nm
							    for (var i = data.length - 1; i >= 0; i--) {
							        if (formatStringForDictKey(data[i]["DEAL_GRP_NM"]) == response.key) {
							            // Don't clear the existing
							            if (data[i]["DC_ID"] == confirmationModPerDealGrp[response.key].existingDcID) {
							                continue;
							            }
							        	// Clear
							            data[i]["DEAL_GRP_NM"]= "";
							            data[i]["dirty"]= true;
							        }
							    }
							    spreadDsSync();
							}
						);
                    }
                }

            	// sync
            	spreadDsSync();
            }
        }

        // check for selections in te middle of a merge
        //if (range._ref.bottomRight.row % root.child.numTiers > 0) {
        //    range = sheet.range(String.fromCharCode(intA + range._ref.topLeft.col) + (range._ref.topLeft.row + 1) + ":" + String.fromCharCode(intA + range._ref.bottomRight.col) + (range._ref.bottomRight.row + (range._ref.bottomRight.row % root.child.numTiers) + 2));
        //}

        // VOL-TIER
        if (root.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER") {
            var endVolIndex = (root.colToLetter["END_VOL"].charCodeAt(0) - intA);
            var strtVolIndex = (root.colToLetter["STRT_VOL"].charCodeAt(0) - intA);
            var rateIndex = (root.colToLetter["RATE"].charCodeAt(0) - intA);
			
            var isEndVolColChanged = (range._ref.topLeft.col <= endVolIndex) && (range._ref.bottomRight.col >= endVolIndex);
            var isStrtVolColChanged = (range._ref.topLeft.col <= strtVolIndex) && (range._ref.bottomRight.col >= strtVolIndex);
            var isRateColChanged = (range._ref.topLeft.col <= rateIndex) && (range._ref.bottomRight.col >= rateIndex);

            // On End_vol col change
            if (isEndVolColChanged || isStrtVolColChanged || isRateColChanged || isProductColumnIncludedInChanges) {

                range.forEachCell(
                    function (rowIndex, colIndex, value) {
                    	var myRow = data[(rowIndex - 1)];
                    	var myColLetter = String.fromCharCode(intA + (colIndex));
                    	var colName = root.letterToCol[myColLetter];

                        if (myRow != undefined && myRow.DC_ID != undefined && myRow.DC_ID != null) {

                            var isEndVolUnlimited = false;
                            var numOfTiers = root.numOfPivot(myRow);

                            if (value.value !== null && value.value !== undefined && value.value.toString().toUpperCase() == unlimitedVal.toUpperCase() && colIndex === endVolIndex && myRow.TIER_NBR === numOfTiers) {
                                isEndVolUnlimited = true;
                            }

                            // Start vol, end vol, or rate changed
                            if (!isEndVolUnlimited) {

                                if (colIndex === endVolIndex || colIndex === strtVolIndex) {
                                	value.value = parseInt(value.value.toString().replace(/,/g, '')) || 0; // HACK: To make sure End vol has a numerical value so that validations work and show on these cells
                                }
                                else if (colIndex === rateIndex) {
                                    value.value = parseFloat(value.value) || 0; // HACK: To make sure End vol has a numerical value so that validations work and show on these cells
                                }

                                // Transform negative numbers into positive
                                if (value.value < 0) {
                                    value.value = Math.abs(value.value);
                                }
                            }

                            // End_Vol Col changed
                            if (colIndex === endVolIndex) {
                                // If this vol tier isn't the last of its vol tier rows
                                if (myRow.TIER_NBR != numOfTiers) {
                                    var nextRow = data[(rowIndex)];
                                    // Calculate next start vol using end vol
                                    if (nextRow !== undefined && !isEndVolUnlimited) {
                                        nextRow.STRT_VOL = (value.value + 1);
                                        sourceData[(rowIndex)].STRT_VOL = nextRow.STRT_VOL;
                                    }
                                }
                            	// HACK: To give end vols commas, we had to format the numbers as strings with actual commas. Note that we'll have to turn them back into numbers before saving.
                                value.value = kendo.toString(value.value, "n0");
								
                                myRow.END_VOL = value.value;
                                sourceData[(rowIndex - 1)].END_VOL = myRow.END_VOL;
                            }

                        	// Tracker number shenanigans
							// TODO: better shenanigan check
                            if (colIndex == productColIndex) {
                            	// Make sure that the user doesn't delete all products when we have a tracker number								
                            	if (myRow.HAS_TRACKER == 1
									&& (value.value == null || value.value.toString().replace(/\s/g, "").length === 0)
								) {
                            		if (myRow.TIER_NBR == 1){
                            			var modalOptions = {
                            				closeButtonText: 'Close',
                            				hasActionButton: false,
                            				headerText: 'Cannot remove deal with tracker',
                            				bodyText: 'You cannot remove all products from a deal that has a tracker. Reverting back'
                            			};
                            			confirmationModal.showModal({}, modalOptions);
                            		}
                            		value.value = myRow.PTR_USER_PRD; // revert
                            	}
                            }

                            // HACK: Set the other columns' values in our data and source data to value else they will not change to our newly expected values
                            myRow[colName] = value.value;
                            sourceData[(rowIndex - 1)][colName] = value.value;
                        }
                    }
                );
                cleanupData(data);
                spreadDsSync();
            }
        }


        var isRangeValueEmptyString = ((range.value() !== null && range.value().toString().replace(/\s/g, "").length === 0));

        var hasValueInAtLeastOneCell = false;

        range.forEachCell(
            function (rowIndex, colIndex, value) {
                if (value.value !== null && value.value !== undefined && value.value.toString().replace(/\s/g, "").length !== 0) { // Product Col changed
                    hasValueInAtLeastOneCell = true;
                }
            }
		);

        if (isProductColumnIncludedInChanges && !hasValueInAtLeastOneCell) { // Delete row
            var rowStart = topLeftRowIndex - 2;
            var rowStop = bottomRightRowIndex - 2;
            if (root.spreadDs !== undefined) {

                var delIds = hasDataOrPurge(data, rowStart, rowStop);
                if (delIds.length > 0) {
                    stealthOnChangeMode = true; // NOTE: We need this here otherwise 2 pop-ups will show on top on one another when we input spaces to delete.

                    kendo.confirm("Are you sure you want to delete this product and the matching deal?")
                        .then(function () {
                            $timeout(function () {
                                if (root.spreadDs !== undefined) {
                                    // look for skipped lines
                                    var numToDel = rowStop + 1 - rowStart;

                                    data.splice(rowStart, numToDel);

                                	// now apply array to Datasource... one event triggered
                                    spreadDsSync();

                                    $timeout(function () {
                                        var n = data.length + 2;

                                        sheet.batch(function () {
                                            // Disable user editable columns
                                            disableRange(sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + n + ":" + finalColLetter + (n + numToDel + numToDel)));

                                            // Re-enable Product column
                                            var prdRange = sheet.range(root.colToLetter["PTR_USER_PRD"] + topLeftRowIndex + ":" + root.colToLetter["PTR_USER_PRD"] + (n + numToDel + numToDel));
                                            prdRange.enable(true);
                                            prdRange.background(null);
                                        });
                                    }, 10);

                                    clearUndoHistory();
                                    root.delPtrs(delIds);
                                    //root.saveEntireContract(true, true, true);
                                }
                            },
                          10);
                        },
                        function () {
                            $(".k-button[title=Undo]").click();
                            syncUndoRedoCounters();
                        });
                    stealthOnChangeMode = false;
                } else { // delete row with a temp id (ex: -101)
                    $timeout(function () {
                    	var cnt = 0;

                        for (var c = 0; c < data.length; c++) {
                            if (data[c].DC_ID !== null) cnt++;
                        }
                        var numToDel = rowStop + 1 - rowStart;
                        cnt = cnt + 2;

                        // Disable user editable columns
                        disableRange(sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + cnt + ":" + finalColLetter + (cnt + numToDel - 1)));

                        // Re-enable Product column
                        var prdRange = sheet.range(root.colToLetter["PTR_USER_PRD"] + topLeftRowIndex + ":" + root.colToLetter["PTR_USER_PRD"] + (cnt + numToDel - 1));
                        prdRange.enable(true);
                        prdRange.background(null);

                		cleanupData(data);
                		spreadDsSync();
                        clearUndoHistory();

                        $scope.applySpreadsheetMerge();

                    }, 10);
                }
            }
        }
        else {
            // Trigger only if the changed range contains the product column

            // check for empty strings
            if (isRangeValueEmptyString && !hasValueInAtLeastOneCell) {
                return;
            }

            // need to see if an item changed that would cause the PTR_SYS_PRD to be cleared out
            var isPtrSysPrdFlushed = false;
            for (var f = 0; f < flushSysPrdFields.length; f++) {
                if (root.colToLetter[flushSysPrdFields[f]] !== undefined) {
                    var colIndx = root.colToLetter[flushSysPrdFields[f]].charCodeAt(0) - intA;
                    if (range._ref.topLeft.col <= colIndx && range._ref.bottomRight.col >= colIndx) {
                        isPtrSysPrdFlushed = true;
                        break;
                    }
                }
            }

            if (isPtrSysPrdFlushed) {
                if (!systemModifiedProductInclude) {
                    // TODO we will need to revisit.  There are cases where we CANNOT remove products and reload... active deals for example
                    // NOTE: do not wrap the below in a sheet.batch call! We need it to recall the onChange event to clear out old valid and invalid products when the product column changes
                    sheet.range(root.colToLetter["PTR_SYS_PRD"] + topLeftRowIndex + ":" + lastHiddenBeginningColLetter + bottomRightRowIndex).value("");

                    range.forEachCell(
                        function (rowIndex, colIndex, value) {
                            if (colIndex === productColIndex) { // Product Col changed
                                // Re-disable specific cells that are readOnly
                                var rowInfo = root.pricingTableData.PRC_TBL_ROW[(rowIndex - 1)]; // This is -1 to account for the 0th rows in the spreadsheet
                                if (rowInfo != undefined) { // The row was pre-existing
                                    disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, 1);
                                }
                            }
                        });
                } else {
                    systemModifiedProductInclude = false;
                }
            }



            // need to see if an item changed that would cause the ADJ_ECAP_UNIT to be cleared out
            var isTrackerNumFlushed = false;
            for (var f = 0; f < flushTrackerNumFields.length; f++) {
                if (root.colToLetter[flushTrackerNumFields[f]] !== undefined) {
                    var colIndx = root.colToLetter[flushTrackerNumFields[f]].charCodeAt(0) - intA;
                    if (range._ref.topLeft.col <= colIndx && range._ref.bottomRight.col >= colIndx) {
                        isTrackerNumFlushed = true;
                        break;
                    }
                }
            }
            if (isTrackerNumFlushed) {
                // Clear out tracker number
                var data = root.spreadDs.data();
                if (data[topLeftRowIndex - 2] !== undefined) { // NOTE: this will be undefined if user enters a new product while skipping rows
                    data[topLeftRowIndex - 2].ORIG_ECAP_TRKR_NBR = null;
                }
            }

            if ((isProductColumnIncludedInChanges && hasValueInAtLeastOneCell) || (isPtrSysPrdFlushed && isExcludeProductColumnIncludedInChanges)) {
                syncSpreadRows(sheet, topLeftRowIndex, bottomRightRowIndex);
            }

            $timeout(function () {
            	$scope.applySpreadsheetMerge();
            }, 10);

        }

        if (!root._dirty) {
            root._dirty = true;
        }
    }


    //// <summary>
    //// Formats a given dictionary key to a format that ignores spaces and capitalization for easier key comparisons.
    //// Note that all keys put into the dealGrpKey should use this function for proper deal grp name merging validation.
    //// </summary>
    function formatStringForDictKey(valueToFormat) {
        var result = "";
        if (valueToFormat != null) {
            result = valueToFormat.toString().toUpperCase().replace(/\s/g, "")
        }
        return result;
    }

    function pivotKITDeals(data, n, dcIdDict, dictId, masterData, maxKITproducts) {
        // NOTE: cleanpData does a backwards for-loop that calls pivotKITDeals, so param "n" comes in backwards    	
        if ((data[n]["PTR_USER_PRD"] === "" || data[n]["PTR_USER_PRD"] === null) && data[n]["DC_ID"] === null) {
            return;
        }
        if (data[n]["PTR_USER_PRD"] !== null) {
            var products = data[n]["PTR_USER_PRD"].split(",");
            if (!dcIdDict.hasOwnProperty(data[n].DC_ID) && data[n].DC_ID != null && Number.isInteger(parseInt(masterData[n].DC_ID))) {
                // Because of dynamic teiring, the NUM_OF_TIERS might change, but only on the first row of a merged cell.
                // Since we're going backwards, we need to find the first cell to get the accurate NUM_OF_TIERS
                var firstTierProds = $filter('where')(masterData, { 'DC_ID': data[n].DC_ID, 'TIER_NBR': 1 });
                if (firstTierProds.length > 0) {
                    products = firstTierProds[0]["PTR_USER_PRD"].split(",");
                }
            }

            // Update number of tiers
            var numTier = products.length;
            data[n]["NUM_OF_TIERS"] = numTier > maxKITproducts ? maxKITproducts : numTier;
        }
        if (numTier !== undefined && numTier > maxKITproducts) {
            data[n]["NUM_OF_TIERS"] = numTier = maxKITproducts;
            if (data[n] === undefined) { return; }
            if (!data[n]._behaviors) data[n]._behaviors = {};
            if (!data[n]._behaviors) data[n]._behaviors = {};
            if (!data[n]._behaviors.isError) data[n]._behaviors.isError = {};
            if (!data[n]._behaviors.validMsg) data[n]._behaviors.validMsg = {};
            data[n]._behaviors.isError["PTR_USER_PRD"] = true;
            data[n]._behaviors.validMsg["PTR_USER_PRD"] = "You have too many products! You may have up to 10 products";
        }
        if (!dcIdDict.hasOwnProperty(data[n].DC_ID) && data[n]["PTR_USER_PRD"] !== null) {
            if (data[n].DC_ID === null) {
                data[n].DC_ID = "k" + dictId;
            }
            dcIdDict[data[n].DC_ID] = true;
            // Check if num of merged rows are more than new num tiers if so delete them
            var pivottedRows = $filter('where')(masterData, { 'DC_ID': data[n].DC_ID });
            var offset = getOffsetByIndex(data, n, numTier);
            var offSetRows = offset > 0 ? numTier - offset : offset;
            var rowAdded = offSetRows;
            var deleteRows = pivottedRows.length - numTier;
            var rowDeleted = 0;
            var numExistingRows = pivottedRows.length;// Existing pivotted rows
            for (var a = 0; a < pivottedRows.length - numTier; a++) {
                //  Make following properties null, it will be picked up for deletion in next iteration
                data[n - a].DC_ID = null;
                data[n - a].PTR_USER_PRD = null;
                data[n - a].NUM_OF_TIERS = numTier;
                rowDeleted++;
            }

            // if row deleted count > 0  no need to add rows
            rowAdded = offSetRows = rowDeleted > 0 ? 0 : offSetRows;

            for (var a = 0; a < numTier; a++) {
                if (numTier == pivottedRows.length) {
                    // If user/system is reshuffling products check if that product exists, if so copy attributes, else rename bucket to new product name
                    data[n - (numTier - 1 - a)] = updateProductBucket(data[n - (numTier - 1 - a)], pivottedRows, products[a], numTier, a);
                    continue;
                }
                // Update existing rows, offset number of deleted rows
                if ((numExistingRows - rowDeleted) > 0) { // update the existing rows
                    data[n - (numExistingRows - 1)] = updateProductBucket(data[n - rowDeleted], pivottedRows, products[a], numTier, a);
                    numExistingRows--;
                } else {
                    if (rowDeleted == 0 && offSetRows > 0) {
                        // adding products / new rows
                        var copy = angular.copy(data[n - rowDeleted]);
                        copy = updateProductBucket(copy, pivottedRows, products[a], numTier, a);
                        data.splice(n + a - (offset - 1), 0, copy); // add rows below the existing rows in order
                        // (n(AKA the index the data is located in) + a(AKA basically what tier nbr) + offset(AKA # of existing rows) +1 (one below the offset))
                        data[n + a - (offset - 1)].id = null;
                        // Clear out any tiered values because this is a new row
                        data[n + a - (offset - 1)]["ECAP_PRICE"] = 0;
                        data[n + a - (offset - 1)]["DSCNT_PER_LN"] = 0;
                        data[n + a - (offset - 1)]["QTY"] = 1;
                        data[n + a - (offset - 1)]["TEMP_TOTAL_DSCNT_PER_LN"] = 0;

                        offSetRows--;
                    } else {
                        // removed a product from the tiers, so instead update the current tiers with the correct data (think of it like shifting row data up by the amount removed)
                        data[n - rowDeleted + rowAdded - (numTier - 1 - a)] =
                            updateProductBucket(data[n - rowDeleted + rowAdded - (numTier - 1 - a)], pivottedRows, products[a], numTier, a);
                    }
                }
            }
        }
    }

    function updateProductBucket(row, pivottedRows, productBcktName, numTier, tierNumber) {
        var row = angular.copy(row);
        var buckProd = $filter('where')(pivottedRows,
                        { 'DC_ID': row["DC_ID"], 'PRD_BCKT': productBcktName });
        if (buckProd.length === 0) {
            row.PRD_BCKT = productBcktName;
        } else {
            row = buckProd[0]; //Select the first one even of there are duplicates
        }
        row["NUM_OF_TIERS"] = numTier;
        row["TIER_NBR"] = tierNumber + 1;
        return row;
    }

    function cleanupData(data) {
        var dcIdDict = {};
        var dictId = 0;
        var copyOfData = angular.copy(data);

        // clear validations for KIT in case the user added or removed a product from the PTR_USER_PRD csv. Otheriwse red validation flags will show on the wrong rows from dynamic tiering.
        if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            root.clearValidations();
			clearUndoHistory();
        }
		
        // Remove any lingering blank rows from the data
        for (var n = data.length - 1; n >= 0; n--) {
            if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            	pivotKITDeals(data, n, dcIdDict, dictId, copyOfData, $scope.$parent.$parent.maxKITproducts);
                dictId++;
            }
            if (data[n].DC_ID === null && (data[n].PTR_USER_PRD === null || data[n].PTR_USER_PRD === undefined || data[n].PTR_USER_PRD.toString().replace(/\s/g, "").length === 0)) {
                //Sync uses DC_ID to remove items from source data
                if (!!data[n].id) {
                    data[n].DC_ID = data[n].id;
                }
                data.splice(n, 1);
            } else {
                if (util.isInvalidDate(data[n].START_DT)) data[n].START_DT = moment(root.contractData["START_DT"]).format("MM/DD/YYYY");
                if (util.isInvalidDate(data[n].END_DT)) data[n].END_DT = moment(root.contractData["END_DT"]).format("MM/DD/YYYY");
            }
        }

        // fix merge issues
        if (data.length > 0) {
        	var lastItem = data[data.length - 1];
            var numTier = root.numOfPivot(lastItem);
            var offset = getOffsetByIndex(data, data.length - 1, numTier);
            if (offset > 0) {
                for (var a = 0; a < numTier - offset; a++) {
                    data.push(util.deepClone(lastItem));
                }
            }
        }
        return data;
    }

    function getOffsetByIndex(data, indx, numTier) {
        var offset = 0;
        if (data.length <= 0) return offset;

        var i = indx;
        var lastItem = data[indx];
        var dcId = lastItem.DC_ID;

        if (numTier === undefined) numTier = root.numOfPivot(lastItem);

        while (i >= 0 && data[i].DC_ID === dcId) {
            offset++;
            i--;
        }

        return offset % numTier;
    }

    function hasDataOrPurge(data, rowStart, rowStop) {
        var ids = [];
        if (data.length === 0) return ids;
        for (var n = rowStop; n >= rowStart; n--) {
            if (!!data[n]) {
                if (data[n].DC_ID !== null && data[n].DC_ID > 0) {
                    if (ids.indexOf(data[n].DC_ID) < 0) ids.push(data[n].DC_ID);
                } else if (data[n].DC_ID !== null && data[n].DC_ID < 0) {
                    data.splice(n, 1);
                }
            }
        }
        return ids;
    }


	/// <summary>
	//	Sanitize data to remove non-ascii characters and hidden line breaks (Mainly for excel copy/paste) then resize the spreadsheet row
	/// </summary> 
    function sanitizeAndResizeRow(stringToSanitize, sheet, sheetRowIndex) {
    	var lineBreakMatches = stringToSanitize.match(/\r?\n|\r/g); // NOTE: put this before the sanitize!
    	stringToSanitize = sanitizeString(stringToSanitize, ", ")

    	if (lineBreakMatches != null && lineBreakMatches.length > 10) { // NOTE: 10 is arbitrary. We can increase/decrease this without effect on other parts of the tool.
    		var rowSizeHeight = 150;
    		if (root.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER") {
    			rowSizeHeight = 50;
    		}
    		sheet.rowHeight(sheetRowIndex, rowSizeHeight);
    	}

    	return stringToSanitize;
    }

	/// <summary>
	//	Sanitize data to remove non-ascii characters and hidden line breaks (Mainly for excel copy/paste)  
	/// </summary>  
    function sanitizeString(stringToSanitize, lineBreakReplacementCharacter) {
    	var lineBreakMatches = stringToSanitize.match(/\r?\n|\r/g);
    	if (lineBreakReplacementCharacter == null) { lineBreakReplacementCharacter = ""; }
    	///
    	//stringToSanitize = stringToSanitize.replace(/[^\x00-\x7F]/g, ""); // NOTE: Remove non-ASCII characters (also takes out hidden characters that causes js dictionary breaking)

    	stringToSanitize = stringToSanitize.replace(/\r?\n\r?\n?|\n|\r/g, lineBreakReplacementCharacter) // replace all new line characters with commas 			
   
    	return stringToSanitize;
    }

    function syncSpreadRows(sheet, topLeftRowIndex, bottomRightRowIndex, isAddedByTrackerNumber) {
        // Now lets sync all values.
        // This is a performance boost
        // Instead of batch and cell manipulation, we will
        //   1) dump the spreadsheet to a datasource
        //   2) update the datasource array
        //   3) reapply it to the datasource
        //   4) sync it to the spreadsheet
        //
        //  Doesn't make sense why this is faster, but it is and it also doesn't look values as they are applied
        var range;

        $timeout(function () {
            if (root.spreadDs !== undefined) {
                var data = root.spreadDs.data();
                var newItems = 0;
                var pivotDim = 1;

                var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
                var sheet = spreadsheet.activeSheet();
				
                // before we clean the data, need to check for offset to see if the top row needs updating
                for (var k = 0; k < (topLeftRowIndex - 2) ; k++) {
                	if (data[k] !== undefined && data[k].PTR_USER_PRD === null) topLeftRowIndex -= 1;
                }

                // For KITs, remove duplicate products. Must be before cleanup()
                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    for (var r = 0; r < data.length; r++) {
                        if (data[r]["PTR_USER_PRD"] === undefined || data[r]["PTR_USER_PRD"] === null) { continue; }
                        var usrPrdArr = data[r]["PTR_USER_PRD"].split(",");
                        var duplicateCheckerDict = {};
                        for (var i = usrPrdArr.length - 1; i >= 0; i--) {
                            usrPrdArr[i] = usrPrdArr[i].toString().trim(); // trim products
                            if (duplicateCheckerDict.hasOwnProperty(formatStringForDictKey(usrPrdArr[i].toString()))) {
                                // This is a duplicate, remove from list
                                usrPrdArr.splice(i, 1);
                            } else {
                                duplicateCheckerDict[formatStringForDictKey(usrPrdArr[i])] = true;
                            }
                        }
                        data[r]["PTR_USER_PRD"] = usrPrdArr.join(",");
                        data[r]["PTR_USER_PRD"] = sanitizeAndResizeRow(data[r]["PTR_USER_PRD"].toString(), sheet, (r + 1));
                    }
                }
                cleanupData(data);

                var tierNbr = 0;
				
                sheet.batch(function () {
                	for (var r = 0; r < data.length; r++) {
                		if (data[r]["DC_ID"] !== null && data[r]["DC_ID"] !== undefined && !data[r]["DC_ID"].toString().startsWith("k")) {
                			// Calcuate the KIT Rebate in case the number of products/tiers changes
                			if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                				tierNbr = data[r]["TIER_NBR"];
                				if (tierNbr == 1) {
                					data[r]["TEMP_KIT_REBATE"] = root.calculateKitRebate(data, r, data[r]["NUM_OF_TIERS"], false);
                				}
                			}

                			// This is an existing row. Don't do anything else
                			continue;
                		}
						
						// Sanitize data. // HACK: if the user were to double click onto a cell, our customPaste code is not hit, so we need to sanitize here
                		data[r]["PTR_USER_PRD"] = sanitizeAndResizeRow(data[r]["PTR_USER_PRD"].toString(), sheet, (r + 1));
                	

                		newItems++;
                		var numPivotRows = root.numOfPivot(data[r]);
                		data[r]["DC_ID"] = (pivotDim === numPivotRows) ? $scope.uid-- : $scope.uid;
                		data[r]["CUST_ACCNT_DIV"] = root.contractData.CUST_ACCNT_DIV;
                		data[r]["CUST_MBR_SID"] = root.contractData.CUST_MBR_SID;
                		if (!isAddedByTrackerNumber) {
                			data[r]["VOLUME"] = null;
                			data[r]["ECAP_PRICE"] = null;
                		}

                		// Defaulted row values for specific SET TYPEs
                		if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                			data[r]["DSCNT_PER_LN"] = 0;
                			data[r]["DSCNT_PER_LN"] = 0;
                			data[r]["QTY"] = 1;
                			data[r]["ECAP_PRICE"] = 0;
                			data[r]["ECAP_PRICE_____20_____1"] = 0; // KIT ECAP
                			data[r]["TEMP_KIT_REBATE"] = 0;
                			data[r]["TEMP_TOTAL_DSCNT_PER_LN"] = 0;
                			data[r]["TEMP_SUM_TOTAL_DSCNT_PER_LN"] = 0;
                		} else if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "PROGRAM") {
                			// TODO: this is defaulted because for some reason the ADJ_ECAP_UNIT col won't have a requred flag with no value. We need to find out why that is :<
                			data[r]["ADJ_ECAP_UNIT"] = 0;
                		} else if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "ECAP") {
                			// TODO: this is defaulted because for some reason the ADJ_ECAP_UNIT col won't have a requred flag with no value. We need to find out why that is :<
                			data[r]["ECAP_PRICE"] = 0;
                		}

                		if (!root.curPricingTable || root.isPivotable()) {
                			if (!data[r]["TIER_NBR"] || data[r]["TIER_NBR"] === "") {
                				// must be a new row... use the autofilter tier number info
                				data[r]["TIER_NBR"] = pivotDim;
                				data[r]["NUM_OF_TIERS"] = numPivotRows;

                				if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER") {
                					// Default to 0
                					data[r]["RATE"] = 0;

                					if (pivotDim === parseInt(numPivotRows)) {
                						// default last end vol to "unlimited"
                						data[r]["END_VOL"] = unlimitedVal;
                					} else {
                						// Default to 0
                						data[r]["END_VOL"] = 0;
                					}
                					// disable non-first start vols
                					if (pivotDim !== 1) {
                						if (!data[r]._behaviors) {
                							data[r]._behaviors = {};
                						}
                						if (!data[r]._behaviors.isReadOnly) {
                							data[r]._behaviors.isReadOnly = {};
                						}
                						// Flag start vol cols to disable
                						var rowInfo = data[r];
                						data[r]._behaviors.isReadOnly["STRT_VOL"] = true;
                						// Default to 0
                						data[r]["STRT_VOL"] = 0;
                					} else {
                						// 1st tier row
                						data[r]["STRT_VOL"] = 1;
                					}
                				}
                			}
                		}


                		for (var key in ptTemplate.model.fields) {
                			if (ptTemplate.model.fields.hasOwnProperty(key)) {
                				// Autofill default values from Contract level
                				if ((root.contractData[key] !== undefined) &&
									(root.contractData[key] !== null) &&
									(root.colToLetter[key] != undefined) &&
									key !== "DC_ID"
								) {
                					var fillValue = root.contractData[key];
                					if (ptTemplate.model.fields[key].type === "date") {
                						fillValue = new Date(root.contractData[key]);
                					}
                					data[r][key] = fillValue;
                				}

                				// Auto fill default values from Pricing Strategy level
                				if ((root.curPricingTable[key] !== undefined) &&
									(root.curPricingTable[key] !== null) &&
									(root.colToLetter[key] != undefined) &&
									key !== "DC_ID"
									&& !isAddedByTrackerNumber
									&& (data[r][key] === null || data[r][key] === "") // don't override if there is an existing value
								) {
                					if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT" && key === "NUM_OF_TIERS") {
                						// Dont override the row num tiers with pricing table numtiiers for kit deals
                					} else {
                						data[r][key] = root.curPricingTable[key];
                					}
                				}
                			}
                		}
                		// increment pivot dim (example tier 1 to tier 2)
                		pivotDim++;
                		if (pivotDim > numPivotRows) pivotDim = 1;
                	}
                });

                spreadDsSync();

                sheet.batch(function () {
                    if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                		// HACK: fix column formatting for the first row. Unsure why, but these columns will lose formatting sometimes
                		var KitEcapRange = sheet.range(root.colToLetter["ECAP_PRICE_____20_____1"] + (topLeftRowIndex));
                		var KitRebateRange = sheet.range(root.colToLetter["TEMP_KIT_REBATE"] + (topLeftRowIndex));

                		if (KitEcapRange.format() != "$##,#0.00") {
                			KitEcapRange.format("$##,#0.00");
                		}
                		if (KitRebateRange.format() != "$##,#0.00") {
                			KitRebateRange.format("$##,#0.00");
                		}
                	}

                    // If we skipped spaces, we already collapsed, so remove the extra data outside the range
                    var st = data.length + 1;
                    var en = bottomRightRowIndex;
                    var numBlanks = en - st;
                    if (numBlanks > 0) {
                        stealthOnChangeMode = true;
                        sheet.range("A" + (data.length + 2) + ":" + finalColLetter + (bottomRightRowIndex + numBlanks)).value("");
                        topLeftRowIndex -= numBlanks;
                        if (topLeftRowIndex < 2) { // prevent topLeftRowIndex from becoming negative to prevent out of bounds errors. It is "2" to account for the headers.
                            topLeftRowIndex = 2;
                        }
                        bottomRightRowIndex -= numBlanks;
                        stealthOnChangeMode = false;
                    }

                    // check merge issues
                    var numPivotRows = root.numOfPivot(data[data.length - 1]);
                    var offset = getOffsetByIndex(data, bottomRightRowIndex - 2);
                    if (offset > 0) {
                        bottomRightRowIndex += numPivotRows - offset;
                    }
                    if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                        bottomRightRowIndex = (data.length + 1);
                    }

                    // Enable other cells
                    if (!!ptTemplate.model.fields["TIER_NBR"] && $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER") {
                        // Find tier nbr col
                        var tierColIndex = (root.colToLetter["TIER_NBR"]).charCodeAt(0);
                        var letterAfterTierCol = String.fromCharCode(tierColIndex + 1);
                        var letterBeforeTierCol = String.fromCharCode(tierColIndex - 1);
                        var spreadData = root.spreadDs.data();

                        // Enable cols except voltier
                        range = sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + topLeftRowIndex + ":" + letterBeforeTierCol + bottomRightRowIndex);
                        range.enable(true);
                        range.background(null);
                        range = sheet.range(letterAfterTierCol + topLeftRowIndex + ":" + finalColLetter + bottomRightRowIndex);
                        range.enable(true);
                        range.background(null);

                        // Disable Program Payment col
                        var programPaymentLetter = root.colToLetter["PROGRAM_PAYMENT"];
                        range = sheet.range(programPaymentLetter + topLeftRowIndex + ":" + programPaymentLetter + bottomRightRowIndex);
                        disableRange(range);

                        // Disable flagged Start Vol cols (Note that not all start voll cols get disabled)
                        var startVolLetter = root.colToLetter["STRT_VOL"];
                        range = sheet.range(startVolLetter + topLeftRowIndex + ":" + startVolLetter + bottomRightRowIndex);
                        range.forEachCell(
                            function (rowIndex, colIndex, value) {
                                // Re-disable specific cells that are readOnly
                                var rowInfo = spreadData[(rowIndex - 1)]; // This is -1 to account for the 0th rows in the spreadsheet
                                if (rowInfo != undefined) { // The row was pre-existing
                                    disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, 1);
                                }
                            }
                        );
                    }
                    else {
                        // if additional rows are inserted due to change in number of products for KIT deal bottomrowIndexis lower than nuber of rows...Thus aasigning bottomrowIndex same as data.length
                        range = sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + topLeftRowIndex + ":" + finalColLetter + bottomRightRowIndex);
                        range.enable(true);
                        range.background(null);

                        // If row is deleted when num tier changes for KIT. Disable the empty rows.
                        if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                            disableRange(sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + (data.length + 2) + ":" + finalColLetter + root.ptRowCount));
                            var prdRange = sheet.range(root.colToLetter["PTR_USER_PRD"] + (data.length + 2) + ":" + root.colToLetter["PTR_USER_PRD"] + root.ptRowCount);
                            prdRange.enable(true);
                            prdRange.background(null);
                        }
                    }

                    // Re-disable cols that are disabled by template
                    for (var key in ptTemplate.model.fields) {
                        if (ptTemplate.model.fields.hasOwnProperty(key) && !ptTemplate.model.fields[key].editable) {
                            var myColLetter = root.colToLetter[key];
                            range = sheet.range(myColLetter + topLeftRowIndex + ":" + myColLetter + bottomRightRowIndex);
                            disableRange(range);
                        }
                    }

                    // Re-add dropdowns on new product add to work around save-then-dropdwons-not-showing bug
                    //for (var key in ptTemplate.model.fields) {
                    //    var myColumnName = root.colToLetter[key];
                    //    var myFieldModel = ptTemplate.model.fields[key];

                    //    if (ptTemplate.model.fields.hasOwnProperty(key) && myColumnName !== undefined) {
                    //    	if (myFieldModel.uiType === "RADIOBUTTONGROUP" || myFieldModel.uiType === "DROPDOWN") {
                    //    		applyDropDowns(sheet, myFieldModel, myColumnName);
                    //    	}
                    //    }
                    //}
                });

                spreadDsSync();

                root.child.setRowIdStyle(data);

                // reset num of tiers
                if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    // TODO: maybe not use NUM_OF_TIERS?
                    root.curPricingTable["NUM_OF_TIERS"] = 1;
                }
            }
        }, 10);
    }

    function spreadDsSync() {
    	root.spreadDs.sync();

    	// NOTE: We need this after a sync for KIT and VOL-TIER to fix DE36447
    	if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "KIT" || $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER") {
    		$scope.applySpreadsheetMerge(); // NOTE: This MUST be after the sync or else DE36447 will happen
    	}
    }

    function GetFirstEdiatableBeforeProductCol() {
        if (firstEditableColBeforeProduct !== null) {
            return firstEditableColBeforeProduct;
        } else {
            return CalculateFirstEdiatableBeforeProductCol();
        }
    }

    function CalculateFirstEdiatableBeforeProductCol() {
        if (editableColsBeforeProduct.length > 0) {
            for (var i = 0; i < editableColsBeforeProduct.length; i++) {
                if (firstEditableColBeforeProduct === null) {
                    firstEditableColBeforeProduct = editableColsBeforeProduct[i];
                } else if (root.colToLetter[firstEditableColBeforeProduct] > root.colToLetter[editableColsBeforeProduct[i]]) {
                    // set to new firstEditableColBeforeProduct if that column is the before the previous firstEditableColBeforeProduct because they might be out of order
                    firstEditableColBeforeProduct = editableColsBeforeProduct;
                }
            }
        } else {
            firstEditableColBeforeProduct = "PTR_USER_PRD";
        }

        return firstEditableColBeforeProduct;
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
            root.spreadNeedsInitialization = false;

            // Set Active sheet
            e.sender.activeSheet(e.sender.sheetByName("Main"));

            var sheet = e.sender.activeSheet();
            var dropdownValuesSheet = e.sender.sheetByName("DropdownValuesSheet");

            // With initial configuration of datasource spreadsheet displays all the fields as columns,
            // thus setting up datasource in render event where selective columns from datasource can be displayed.
            sheet.setDataSource(root.spreadDs, ptTemplate.columns);

            sheetBatchOnRender(sheet, dropdownValuesSheet); // Do all spreadsheet cell changes here

            $scope.applySpreadsheetMerge();

            vm.initCustomPaste("#pricingTableSpreadsheet");
            vm.customDragDropAutoFill("#pricingTableSpreadsheet");
            replaceUndoRedoBtns();

            root.setBusy("", "");

            $scope.setRowIdStyle(root.pricingTableData.PRC_TBL_ROW);
            //e.sender.activeSheet(e.sender.sheetByName("DropdownValuesSheet"));

            showHelp();
        }
    }

    function showHelp() {
        $timeout(function () {
            if (!root.pricingTableData.PRC_TBL_ROW && root.pricingTableData.PRC_TBL_ROW.length > 0) return;

            var item = null;
            var items = $(".k-spreadsheet-cell");
            for (var c = 0; c < items.length; c++) {
                if ($(items[c]).text() === "Contract Product *") {
                    item = $(items[c]);
                    c = items.length;
                }
            }

            if (!item || item.length === 0) return;

            var t = 95 + (20 * root.numOfPivot());
            $("#divHelpAddProd").css("left", item.offset().left - 300);
            $("#divHelpAddProd").animate({
                opacity: 1,
                top: t
            }, 2000, function () {
                $timeout(function () {
                    $("#divHelpAddProd").animate({
                        opacity: 0
                    }, 2000, function () {
                        $("#divHelpAddProd").css({
                            display: "none"
                        });
                    });
                }, 4000);
            });
        }, 2000);
    }

    $scope.setRowIdStyle = function (data) {
        if (!data) return;
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
        if (!spreadsheet) return;
        var sheet = spreadsheet.activeSheet();

        sheet.batch(function () {
            var row = 2;
            // reset row colors
            sheet.range("A" + 2 + ":A" + root.ptRowCount).background("#eeeeee").color("#003C71");

            for (var key in data) {
                if (data.hasOwnProperty(key) && !data[key]._actions) {
                    if (!!data[key].DC_ID && data[key].DC_ID !== "") {
                        // Row error colors
                        if (!!data[key]._behaviors) {
                            var errors = data[key]._behaviors.isError;
                            if (errors && Object.keys(errors).length !== 0) {
                                // Put all validation errors as csv on the DC_ID (row A)
                                sheet.range(root.colToLetter["DC_ID"] + row + ":" + root.colToLetter["DC_ID"] + row).background("#FC4C02").color("#FFFFFF");
                                var myVal = "";
                                var validMsg = data[key]._behaviors.validMsg;
                                for (var myKey in validMsg) {
                                    if (validMsg.hasOwnProperty(myKey) && ptTemplate.model.fields[myKey] !== undefined) {
                                        myVal += ptTemplate.model.fields[myKey].label + ": " + validMsg[myKey];
                                    }
                                }
                                validMsg["DC_ID"] = myVal;
                                var isError = myVal !== "";
                                data[key]._behaviors.isError["DC_ID"] = isError;
                                sheet.range(root.colToLetter["DC_ID"] + row + ":" + root.colToLetter["DC_ID"] + row).validation(root.myDealsValidation(isError, myVal, false));
                            }
                        }
                        // Product Status
                        if (!!data[key].PTR_SYS_INVLD_PRD) { // validated and failed
                            sheet.range(root.colToLetter["PTR_USER_PRD"] + row + ":" + root.colToLetter["PTR_USER_PRD"] + row).color("#FC4C02").bold(true);
                            if (root.colToLetter["PRD_EXCLDS"] !== undefined) { // validated and passed
                                sheet.range(root.colToLetter["PRD_EXCLDS"] + row + ":" + root.colToLetter["PRD_EXCLDS"] + row).color("#FC4C02").bold(true);
                            }
                        } else if (!!data[key].PTR_SYS_PRD) { // validated and passed
                            //vol tier
                            sheet.range(root.colToLetter["PTR_USER_PRD"] + row + ":" + root.colToLetter["PTR_USER_PRD"] + row).color("#9bc600").bold(true);
                            if (root.colToLetter["PRD_EXCLDS"] !== undefined) { // validated and passed
                                sheet.range(root.colToLetter["PRD_EXCLDS"] + row + ":" + root.colToLetter["PRD_EXCLDS"] + row).color("#9bc600").bold(true);
                            }
                        } else { // not validated
                            sheet.range(root.colToLetter["PTR_USER_PRD"] + row + ":" + root.colToLetter["PTR_USER_PRD"] + row).color("#000000").bold(false);
                            if (root.colToLetter["PRD_EXCLDS"] !== undefined) { // validated and passed
                                sheet.range(root.colToLetter["PRD_EXCLDS"] + row + ":" + root.colToLetter["PRD_EXCLDS"] + row).color("#000000").bold(false);
                            }
                        }
                    } else {
                        sheet.range("A" + row + ":A" + row).background("#eeeeee").color("#003C71");
                    }
                    row++;
                }
            }
        }, {
            layout: true
        });
    }
    $scope.$on('saveWithWarnings',
        function (event, args) {
            if (!!$scope.root.spreadDs) {
                $scope.setRowIdStyle($scope.root.spreadDs._data);
                if (root.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER" || root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    // apply spreadsheet merges after save because if the user deleted a product and the next row doesn't have the same # of tiers as the deleted row
                    //		then the rows will all look like they have the wrong Num of tiers (though the data would be fine).
                    $scope.applySpreadsheetMerge();
                }
            } else {
                $scope.setRowIdStyle(args.PRC_TBL_ROW);
            }
            $scope.root.switchingTabs = false;
        });
    $scope.$on('saveComplete',
        function (event, args) {
            if ($scope.root.isWip && $scope.root.switchingTabs) {
                $scope.root.gotoToPricingTable();
            }
            if (!!$scope.root.spreadDs) {
                $scope.setRowIdStyle($scope.root.spreadDs._data);
                if (root.curPricingTable.OBJ_SET_TYPE_CD === "VOL_TIER" || root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    // apply spreadsheet merges after save because if the user deleted a product and the next row doesn't have the same # of tiers as the deleted row
                    //		then the rows will all look like they have the wrong Num of tiers (though the data would be fine).
                    $scope.applySpreadsheetMerge();
                }
            } else {
                $scope.setRowIdStyle(args.PRC_TBL_ROW);
            }
            $scope.root.switchingTabs = false;
        });
    $scope.$on('addRowByTrackerNumber',
        function (event, args) {
            addRowByTrackerNumber(args);
        });

    function addRowByTrackerNumber(newRow) {// HACK: This function is needed for the $scope.$on to be able to access the pt $scope
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();
        root.spreadDs.insert(newRow);

        syncSpreadRows(sheet, 2, 200, true); // NOTE: 2 accounts for the top row
        root._dirty = true;
    }

    // TDOO: This needs major perfromance refactoring because it makes things slow for poeple with bad computer specs :<
    // Initiates in a batch call (which may make the spreadsheet load faster
    function sheetBatchOnRender(sheet, dropdownValuesSheet) {
        var rowIndexOffset = 2; // This is 2 because row 0 and row 1 are hidden

        // disable formula completion list
        $(".k-spreadsheet-formula-list").remove();

        // disable right click menu options
        $(".k-context-menu").remove();

        var isCorpDiv = (!!root.contractData.CustomerDivisions && root.contractData.CustomerDivisions.length > 1);

        sheet.batch(function () {
            var headerRange = sheet.range("1:1");

            // disable first row
            headerRange.enable(false); //("A0:ZZ0")

            // freeze first row and column
            sheet.frozenRows(1);
            sheet.frozenColumns(1);

            // Stylize header row
            headerRange.bold(true);
            headerRange.wrap(true);
            sheet.rowHeight(0, 35);

            headerRange.background(headerStyle.background);
            headerRange.color(headerStyle.color);
            headerRange.fontSize(headerStyle.fontSize);
            headerRange.textAlign(headerStyle.textAlign);
            headerRange.verticalAlign(headerStyle.verticalAlign);

            sheet.range("A2:" + finalColLetter + $scope.root.ptRowCount).verticalAlign("center");
            sheet.range("A2:" + finalColLetter + $scope.root.ptRowCount).textAlign(cellStyle.textAlign);

            // Add product selector editor on Product cells
            sheet.range(root.colToLetter["PTR_USER_PRD"] + ":" + root.colToLetter["PTR_USER_PRD"]).editor("cellProductSelector");

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
                        if (key !== "PTR_USER_PRD") {
                            disableRange(sheet.range(myColumnName + numRowsContainingData + ":" + myColumnName));
                        } else {
                            if (!root.curPricingStrategy._settings || !root.curPricingStrategy._settings.C_EDIT_PRODUCT) {
                                disableRange(sheet.range(myColumnName + "0:" + myColumnName));
                            }
                        }
                    }

                    if (myFieldModel.field === "ORIG_ECAP_TRKR_NBR") {
                        // ecap tracker number
                        //// NOTE: We may need to revisit the ECAP Tracker Number dropdwon list in the future, when if we do uncomment the below lines to make the dropdwon re-appear.
                        //sheet.range(myColumnName + ":" + myColumnName).editor("ecapAdjTracker");
                    }
                    else if (myFieldModel.opLookupText === "DROP_DOWN" || myFieldModel.opLookupText === "dropdownName" || (myFieldModel.opLookupText === "CUST_DIV_NM" && isCorpDiv)) {
                        // Add validation dropdowns/multiselects onto the cells
                        applyDropDownsData(sheet, myFieldModel, myColumnName, dropdownValuesSheet);

                        if (myFieldModel.uiType === "RADIOBUTTONGROUP" || myFieldModel.uiType === "DROPDOWN") {
                            sheet.range(myColumnName + ":" + myColumnName).editor("dropdownEditor");
                            //applyDropDowns(sheet, myFieldModel, myColumnName);
                        } else if (myFieldModel.uiType === "EMBEDDEDMULTISELECT" || myFieldModel.uiType === "MULTISELECT") {
                            sheet.range(myColumnName + ":" + myColumnName).editor("multiSelectPopUpEditor");
                        }
                    } else {
                        // Add validations based on column type
                        switch (myFieldModel.type) {
                            case "date":
                                sheet.range(myColumnName + ":" + myColumnName).editor("datePickerEditor");
                                //sheet.range(myColumnName + ":" + myColumnName).format("MM/dd/yyyy");
                                break;
                            case "number":
                                // Money Formatting
                            	if (myFieldModel.format == "{0:c}") {
                                    sheet.range(myColumnName + ":" + myColumnName).format("$##,#0.00");
                                } else {
                                    sheet.range(myColumnName + ":" + myColumnName).format("##,#");
                                }
                                break;
                        	case "string":
                        		if (key == "END_VOL") {
                        			sheet.range(myColumnName + ":" + myColumnName).format("##,#");
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

                // Read Only cells
                disableIndividualReadOnlyCells(sheet, rowInfo, rowIndex, rowIndexOffset);
            }
        });
    }

    function applyDropDownsData(sheet, myFieldModel, myColumnName, dropdownValuesSheet) {
        // Call API
        if (myFieldModel.opLookupText === "CUST_DIV_NM") {
            myFieldModel.opLookupUrl = "/api/Customers/GetCustomerDivisionsByCustNmSid/" + root.contractData.CUST_MBR_SID;
        }

        //// TODO: In the future. Dropdowns do work, but their (red highlighting) validations do not allow us to ignore case-sensitivity.
        //// If we can figure out how to ignore case-sesitive, we can put these dropdwons back in
        //dataService.get(myFieldModel.opLookupUrl, null, null, true).then(function (response) {
        //    dropdownValuesSheet.batch(function () {
        //        for (var i = 0; i < response.data.length; i++) {
        //            var myKey = response.data[i].ATRB_CD;
        //            if (myKey === null || myKey === undefined) {
        //                myKey = response.data[i].subAtrbValue;
        //                // HACK: this is for Product Level's atrb code because it pulls form a different dropdown sp
        //            }

        //            if (response.data[i].ATRB_CD === "REBATE_TYPE") {
        //                myKey = "REBATE_TYPE";
        //            }
        //            // Add values onto the other sheet
        //            var dropdownValue = response.data[i].DROP_DOWN;
        //            if (dropdownValue === undefined || dropdownValue === null) {
        //                dropdownValue = response.data[i].dropdownName;
        //                // HACK: this is for Product Level's atrb code because it pulls form a different dropdown sp
        //            }

        //            dropdownValuesSheet.range(root.colToLetter[myKey] + (i + 1)).value(dropdownValue);
        //        }
        //    });
        //},
        //function (error) {
        //    logger.error("Unable to get dropdown data.", error, error.statusText);
        //});
    }

    //// TODO: In the future. Dropdowns do work, but their (red highlighting) validations do not allow us to ignore case-sensitivity.
    //// If we can figure out how to ignore case-sesitive, we can put these dropdwons back in
    //function applyDropDowns(sheet, myFieldModel, myColumnName) {
    //    sheet.range(myColumnName + "2:" + myColumnName + $scope.root.ptRowCount).validation({
    //        dataType: "list",
    //        showButton: true,
    //        from: "DropdownValuesSheet!" + myColumnName + ":" + myColumnName,
    //        allowNulls: true, //myFieldModel.nullable,
    //        type: "warning",
    //        titleTemplate: "Invalid value",
    //        messageTemplate: "Invalid value. Please use the dropdown for available options."
    //    });
    //}

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
            var firstDraggedVal = this.value();
            var newVal = "";

            for (var i = 0; i < x.props.length; i++) { // each col
                for (var j = 0; j < x.props[i].length; j++) { // each row

                    // HACK: this is to prevent dragged cells that have numbers in them from incrementing on drag.
                    newVal = this.value();

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

                // total HACK here.  there must be a better way, but trying to POC options
                // pasting accross merged cells is not allowed, so need to bypass it
                if (!status.canPaste && !root.numOfPivot()) {
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
                } else if (root.isPivotable()) {
                    this.customMergedPaste();
                    //range._adjustRowHeight();
                } else {
                    this.customPaste();
                    range._adjustRowHeight();
                }
            },
            sanitizeAndFormatPasteData: function (state, sheet) { // Non-default Kendo code for paste event
            	for (row = state.data.length - 1; row >= 0; row--) {
            		// Prevent error when user only pastes 2+ merged cells that expand mulpitle rows
            		if (state.data[row] == null) { continue; }

            		for (var col = state.data[row].length - 1; col >= 0; col--) {
            			var cellData = state.data[row][col];

            			if (typeof cellData.value == "string") {
            				var sanitizedString = sanitizeString(cellData.value, ""); // NOTE: This replace function takes out hidden new line characters, which break js dictionaries

            				// NOTE: we need to check that all the values are ot null or empty again because now have have sanitized the string
            				if (cellData.value != sanitizedString) {
            					cellData.value = sanitizedString;
            					// Don't allow paste of the value if the pasted value is empty (empty string or only white space), which it could be after sanitizing the data
            					if (cellData.value.replace(/\s/g, "").length === 0) {
            						state.data[row].splice(col, 1);
            					}
            					if (state.data[row].length === 0) {
            						state.data.splice(row, 1);
            						continue;
            					}
            				}
            			}

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
            			if (sheet.range(myRow, myCol).getState().data[0] !== undefined) {
            				var originalCellState = sheet.range(myRow, myCol).getState().data[0][0];
            				if (originalCellState != null) {
            					cellData.validation = originalCellState.validation;
            					cellData.editor = originalCellState.editor;
            				}
            			}
            		}
            	}
            	return state;
            },
            customPaste: function () {
                // Default Kendo code for paste event
                var clip = this._clipboard;
                var state = angular.copy(clip._content);
                var sheet = clip.workbook.activeSheet();

                if (clip.isExternal()) {
                    clip.origin = state.origRef;
                }

            	// Non-default Kendo code for paste event
                this.sanitizeAndFormatPasteData(state, sheet);

                // Prevent user from pasting merged cells
                state.mergedCells = null;

                // set paste data to Kendo cell (default Kendo code)
                var pasteRef = clip.pasteRef();
                sheet.range(pasteRef).setState(state, clip);
                sheet.triggerChange({
                    recalc: true,
                    ref: pasteRef
                });
                $scope.applySpreadsheetMerge();
            },
            customMergedPaste: function () {
                //
                // Modified paste for ONLY merged cells... VERY propiatary to
                //
                var row;
                var clip = this._clipboard;
                var state = angular.copy(clip._content);  //we need to create a copy of clip._content because we modify state below.  Because js copies by reference for objects, not creating an copy of it would cause the clipboard's content to change and exponentially grow by numoftier padding in consecutive pastes.

                for (var i = state.data.length - 1; i >= 0; i--) {  //remove any leftover "padding" rows that contain null values
                    if (state.data[i][0]["value"] == null) {
                        state.data.splice(i, 1);
                    }
                }

                var sheet = clip.workbook.activeSheet();
                var newData = [];
                var padNumRows = 0;

                // set paste data to Kendo cell (default Kendo code)
                var pasteRef = clip.pasteRef();

                //if (clip.isExternal()) {
                clip.origin = state.origRef;

                // IDEA:
                // Maybe get the clipboard data and modify it (pad by tier num) and allow the paste to continue
                var colNum = pasteRef.topLeft.col;
                if (!nonMergedColIndexesDict.hasOwnProperty(colNum)) { // Non tiered data (merged cells) only
                    for (row = 0; row < state.data.length; row++) {
                        var numTiers = root.numOfPivot(row);    //Note: numOfPivot will "incorrectly" return 1 here for KIT deals, but that is fine as the tiering logic is more dependant on the commas and is executed separately later
                        for (var t = 0; t < numTiers; t++) {
                            newData.push(util.deepClone(state.data[row]));
                        }
                        padNumRows += numTiers - 1;
                    }
                    state.data = newData;
                }
            	//}

            	// Non-default Kendo code for paste event
                this.sanitizeAndFormatPasteData(state, sheet);

                // Prevent user from pasting merged cells
                state.mergedCells = null;

                // need to pad range ref
                pasteRef.bottomRight.row += padNumRows;

                var i = state.data.length;
                while (i--) {
                    if (state.data[i] === undefined) {
                        state.data.splice(i, 1);
                    }
                }

                sheet.range(pasteRef).setState(state, clip);
                sheet.triggerChange({
                    recalc: true,
                    ref: pasteRef
                });
                $scope.applySpreadsheetMerge();
                clearUndoHistory();
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

        var contract = $scope.$parent.$parent.contractData;
        // Further delay the initialization of the UI until the `edit` method is
        // actually called, so here just return the object with the required API.

        return {
            edit: function (options) {
                context = options;
                open();
            },
            icon: "intelicon-search ssEditorBtn"
        };

        function open() {
            var currentRow = context.range._ref.row - 1;

            // Products that has [ValidJSON(HasValue), InvalidJSON(HasValue)] or [ValidJSON(NoValue), InvalidJSON(HasValue)] or
            // [ValidJSON(NoValue), InvalidJSON(NoValue)] send them to translator
            var productsWhichNeedTranslation = [];
            if (!!context.range._sheet.dataSource._data[currentRow]) {
                productsWhichNeedTranslation = context.range._sheet.dataSource._data.filter(function (x, i) {
                    return (x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) && i == currentRow &&
                        ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true);
                });
            }
            if (productsWhichNeedTranslation.length > 0) {
                // Runs the translation that eventually may open up corrector
                // Send the whole data function is intelligent to handle single and multiple rows
                var data = root.spreadDs.data();
                ValidateProducts(data, false, true, currentRow + 1);
            }
            else { // open the selector
                var currentPricingTableRowData = context.range._sheet.dataSource._data[currentRow];
                var enableSplitProducts = context.range._sheet.dataSource._data.length <= context.range._ref.row;
                if (root.isPivotable()) {
                    enableSplitProducts = context.range._sheet.dataSource._data.length - root.numOfPivot(currentPricingTableRowData) <= context.range._ref.row;
                }
                if (!!currentPricingTableRowData && currentPricingTableRowData.PROGRAM_PAYMENT !== null
                    && currentPricingTableRowData.PROGRAM_PAYMENT !== "" && currentPricingTableRowData.PROD_INCLDS != null && currentPricingTableRowData.PROD_INCLDS !== ""
                    && currentPricingTableRowData.GEO_COMBINED != null && currentPricingTableRowData.GEO_COMBINED !== "") {
                    var pricingTableRow = {
                        'START_DT': moment(currentPricingTableRowData.START_DT).format("l"),
                        'END_DT': moment(currentPricingTableRowData.END_DT).format("l"),
                        'CUST_MBR_SID': $scope.contractData.CUST_MBR_SID,
                        'GEO_COMBINED': getFormatedGeos(currentPricingTableRowData.GEO_COMBINED),
                        'PTR_SYS_PRD': currentPricingTableRowData.PTR_SYS_PRD,
                        'PROGRAM_PAYMENT': currentPricingTableRowData.PROGRAM_PAYMENT,
                        'PROD_INCLDS': currentPricingTableRowData.PROD_INCLDS,
                    };
                } else {
                    var pricingTableRow = {
                        'START_DT': moment(contract.START_DT).format("l"),
                        'END_DT': moment(contract.END_DT).format("l"),
                        'CUST_MBR_SID': contract.CUST_MBR_SID,
                        'GEO_COMBINED': getFormatedGeos(root.curPricingTable["GEO_COMBINED"]),
                        'PTR_SYS_PRD': "",
                        'PTR_SYS_INVLD_PRD': "",
                        'PROGRAM_PAYMENT': root.curPricingTable["PROGRAM_PAYMENT"],
                        'PROD_INCLDS': root.curPricingTable["PROD_INCLDS"]
                    };
                }

                var suggestedProduct = {
                    'mode': 'manual',
                    'prodname': ""
                };

                var modal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/productSelector/productSelector.html',
                    controller: 'ProductSelectorModalController',
                    controllerAs: 'vm',
                    size: 'lg',
                    windowClass: 'prdSelector-modal-window',
                    resolve: {
                        productSelectionLevels: ['productSelectorService', function (productSelectorService) {
                            var dtoDateRange = {
                                startDate: pricingTableRow.START_DT, endDate: pricingTableRow.END_DT, mediaCode: pricingTableRow.PROD_INCLDS
                            };
                            root.setBusy("Please wait...", "");
                            return productSelectorService.GetProductSelectorWrapper(dtoDateRange).then(function (response) {
                                root.setBusy("", "");
                                return response;
                            }, function (response) {
                                root.setBusy("", "");
                                logger.error("Unable to launch product selector.", response, response.statusText);
                            });
                        }],
                        pricingTableRow: angular.copy(pricingTableRow),
                        suggestedProduct: function () {
                            return suggestedProduct;
                        },
                        enableSplitProducts: function () {
                            return enableSplitProducts;
                        },
                        dealType: function () {
                            return root.curPricingTable.OBJ_SET_TYPE_CD;
                        }
                    }
                });

                modal.result.then(
                    function (productSelectorOutput) {
                        var rowStart = context.range._ref.row + 1;
                        var sheet = context.range._sheet;
                        updateSpreadSheetFromSelector(productSelectorOutput, sheet, rowStart);
                    },
                    function () {
                        // Do Nothing on cancel
                    });
            }
        }
    });

    function validateSingleRowProducts(sData, row) {
        if (sData === undefined) { return; }
        if (!sData._behaviors) sData._behaviors = {};
        if (!sData._behaviors) sData._behaviors = {};
        if (!sData._behaviors.isError) sData._behaviors.isError = {};
        if (!sData._behaviors.validMsg) sData._behaviors.validMsg = {};

        if ((sData.PTR_USER_PRD !== "" && sData.PTR_USER_PRD !== null) && ((sData.PTR_SYS_PRD != "" && sData.PTR_SYS_PRD != null) ?
            ((sData.PTR_SYS_INVLD_PRD != "" && sData.PTR_SYS_INVLD_PRD != null) ? true : false) : true)) {
            sData._behaviors.isError["PTR_USER_PRD"] = true;
            sData._behaviors.validMsg["PTR_USER_PRD"] = "Product Translator needs to run.";
        } else {
            sData._behaviors.isError["PTR_USER_PRD"] = false;
            sData._behaviors.validMsg["PTR_USER_PRD"] = "";
        }
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
        if (!spreadsheet) return;

        var sheet = spreadsheet.activeSheet();
        var beh = sData._behaviors;
        if (!beh) beh = {};
        var isError = !!beh.isError["PTR_USER_PRD"];
        var msg = isError ? beh.validMsg["PTR_USER_PRD"] : "";
        sheet.range(root.colToLetter['PTR_USER_PRD'] + (row + 1)).validation(root.myDealsValidation(isError, msg, false));
    }

    function ValidateProducts(currentPricingTableRowData, publishWipDeals, saveOnContinue, currentRowNumber) {
        var pcUi = new perfCacheBlock("Validate Products", "UI");

        var currentPricingTableRowData = currentPricingTableRowData.map(function (row, index) {
            return $.extend({}, row, { 'ROW_NUMBER': index + 1 });
        });

        if (saveOnContinue === undefined || saveOnContinue === null) saveOnContinue = false;

        currentPricingTableRowData = root.deNormalizeData(currentPricingTableRowData);

        // if row number is passed then its translation for single row
        if (!!currentRowNumber) {
            currentPricingTableRowData = currentPricingTableRowData.filter(function (x) {
                return x.ROW_NUMBER == currentRowNumber;
            });
        }

        var hasProductDependencyErr = false;

        // Validate columns that product is dependent on
        for (var i = 0; i < currentPricingTableRowData.length; i++) {
            for (var d = 0; d < productValidationDependencies.length; d++) {
                if (currentPricingTableRowData[i][productValidationDependencies[d]] === null || currentPricingTableRowData[i][productValidationDependencies[d]] === "") {

                    if (currentPricingTableRowData[i]._behaviors === undefined) { currentPricingTableRowData[i]._behaviors = {} }
                    if (currentPricingTableRowData[i]._behaviors.isError === undefined) { currentPricingTableRowData[i]._behaviors.isError = {} }
                    if (currentPricingTableRowData[i]._behaviors.validMsg === undefined) { currentPricingTableRowData[i]._behaviors.validMsg = {} }
                    if (currentPricingTableRowData[i]._behaviors.isRequired === undefined) { currentPricingTableRowData[i]._behaviors.isRequired = {} }

                    currentPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]] = true;
                    currentPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]] = "This field is required.";
                    currentPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]] = true;
                    hasProductDependencyErr = true;
                }
                else {
                    if (currentPricingTableRowData[i]._behaviors !== undefined
        				&& currentPricingTableRowData[i]._behaviors.isError !== undefined
						&& currentPricingTableRowData[i]._behaviors.validMsg !== undefined
						&& currentPricingTableRowData[i]._behaviors.isRequired !== undefined) {
                        delete currentPricingTableRowData[i]._behaviors.isError[productValidationDependencies[d]];
                        delete currentPricingTableRowData[i]._behaviors.validMsg[productValidationDependencies[d]];
                        delete currentPricingTableRowData[i]._behaviors.isRequired[productValidationDependencies[d]];
                    }
                }
            }
        }

        if (hasProductDependencyErr) {
            // Sync to show errors
            root.syncCellValidationsOnAllRows(currentPricingTableRowData);

            // Tell user to fix errors
            root.setBusy("Not saved. Please fix errors.", "Please fix the errors so we can properly validate your products", "Error");
            $timeout(function () {
                root.setBusy("", "");
            }, 1300);
            return;
        }

        // Pricing table rows products to be translated
        var pricingTableRowData = currentPricingTableRowData.filter(function (x) {
            return (x.PTR_USER_PRD != "" && x.PTR_USER_PRD != null) &&
                ((x.PTR_SYS_PRD != "" && x.PTR_SYS_PRD != null) ? ((x.PTR_SYS_INVLD_PRD != "" && x.PTR_SYS_INVLD_PRD != null) ? true : false) : true);
        });
        //Getting deal type
        var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;
        // Convert into format accepted by translator API
        var translationInput = pricingTableRowData.map(function (row, index) {
            return {
                ROW_NUMBER: row.ROW_NUMBER,
                USR_INPUT: row.PTR_USER_PRD,
                EXCLUDE: false,
                FILTER: row.PROD_INCLDS,
                START_DATE: moment(row.START_DT).format("l"),
                END_DATE: moment(row.END_DT).format("l"),
                GEO_COMBINED: getFormatedGeos(row.GEO_COMBINED),
                PROGRAM_PAYMENT: row.PROGRAM_PAYMENT,
                CUST_MBR_SID: $scope.contractData.CUST_MBR_SID,
                SendToTranslation: !(row.PTR_SYS_INVLD_PRD != null && row.PTR_SYS_INVLD_PRD != "")
            }
        });
        //adding Exclude
        if (root.colToLetter["PRD_EXCLDS"] != undefined) {
            angular.forEach(pricingTableRowData, function (obj) {
                if (!!obj.PRD_EXCLDS && obj.PRD_EXCLDS.length > 0) {
                    var object = {
                        "ROW_NUMBER": obj.ROW_NUMBER,
                        "USR_INPUT": obj.PRD_EXCLDS,
                        "EXCLUDE": true,
                        "FILTER": obj.PROD_INCLDS,
                        "START_DATE": moment(obj.START_DT).format("l"),
                        "END_DATE": moment(obj.END_DT).format("l"),
                        "GEO_COMBINED": getFormatedGeos(obj.GEO_COMBINED),
                        "PROGRAM_PAYMENT": obj.PROGRAM_PAYMENT,
                        "CUST_MBR_SID": $scope.contractData.CUST_MBR_SID,
                        "SendToTranslation": !(obj.PTR_SYS_INVLD_PRD != null && obj.PTR_SYS_INVLD_PRD != "")
                    }
                    translationInput.push(object);
                }
            });
        }

        //if (util.isInvalidDate(data[n].START_DT)) data[n].START_DT = root.contractData["START_DT"]

        var translationInputToSend = translationInput.filter(function (x) {
            // If we already have the invalid JSON don't translate the products again
            return x.SendToTranslation == true;
        });

        // Products invalid JSON data present in the row
        var invalidProductJSONRows = pricingTableRowData.filter(function(x) {
            return (x.PTR_SYS_INVLD_PRD != null && x.PTR_SYS_INVLD_PRD != "");
        });

        $scope.pc.add(pcUi.stop());

        // Products that needs server side attention
        if (translationInputToSend.length > 0) {
            topbar.show();

            // Validate products
            // Note: When changing the message here, also change the condition in $scope.saveEntireContractBase method in contract.controller.js
            root.setBusy("Validating your data...", "Please wait as we find your products!", "Info", true);
            var pcMt = new perfCacheBlock("Translate Products (DB not logged)", "MT");

            productSelectorService.TranslateProducts(translationInputToSend, $scope.contractData.CUST_MBR_SID, dealType) //Once the database is fixed remove the hard coded geo_mbr_sid
                .then(function (response) {
                    $scope.pc.add(pcMt.stop());
                    topbar.hide();
                    if (response.statusText === "OK") {
                        response.data = buildTranslatorOutputObject(invalidProductJSONRows, response.data);
                        cookProducts(currentRowNumber, response.data, currentPricingTableRowData, publishWipDeals);
                    }
                }, function (response) {
                    topbar.hide();
                    root.setBusy("Validating products...", "Error in translating products");
                    $timeout(function () {
                        root.setBusy("", "");
                    }, 300);
                });

        } // Products where client side has invalid and duplicate product information
        else if (invalidProductJSONRows.length > 0) {
            var data = { 'ProdctTransformResults': {}, 'InValidProducts': {}, 'DuplicateProducts': {}, 'ValidProducts': {} };
            data = buildTranslatorOutputObject(invalidProductJSONRows, data);
            cookProducts(currentRowNumber, data, currentPricingTableRowData, publishWipDeals);
        } else if (saveOnContinue) { // No products to validate, call the Validate and Save from contract manager
            if (!publishWipDeals) {
                root.validatePricingTable();
            } else {
                root.publishWipDealsBase();
            }
        } else {
            // maybe we need to close down the busy indicatore here... not sure what else needs to happen.
        }
    }

    // Combine the valid and invalid JSON into single object, corrector understands following object type
    function buildTranslatorOutputObject(invalidProductJSONRows, data) {
        angular.forEach(invalidProductJSONRows, function (item) {
            var inValidJSON = JSON.parse(item.PTR_SYS_INVLD_PRD);
            var validJSON = (item.PTR_SYS_PRD != null && item.PTR_SYS_PRD != "") ? JSON.parse(item.PTR_SYS_PRD) : "";
            data.ValidProducts[item.ROW_NUMBER] = validJSON;
            data.ProdctTransformResults[item.ROW_NUMBER] = inValidJSON.ProdctTransformResults;
            data.DuplicateProducts[item.ROW_NUMBER] = inValidJSON.DuplicateProducts;
            data.InValidProducts[item.ROW_NUMBER] = inValidJSON.InValidProducts;
        });
        return data;
    }

    function cookProducts(currentRow, transformResults, rowData, publishWipDeals) {
        var data = root.spreadDs.data();
        var sourceData = root.pricingTableData.PRC_TBL_ROW;
        // Process multiple match products
        var isAllValidated = true;
        for (var key in transformResults.ProdctTransformResults) {
            var r = key - 1;

            // Flag dependency column errors - these columns may cause product translator to not find a valid product
            if (!!transformResults.InvalidDependancyColumns && !!transformResults.InvalidDependancyColumns[key] && transformResults.InvalidDependancyColumns[key].length > 0) {
                for (var i = 0; i < transformResults.InvalidDependancyColumns[key].length; i++) {
                    data[r]._behaviors.isError[transformResults.InvalidDependancyColumns[key][i]] = true;
                    data[r]._behaviors.validMsg[transformResults.InvalidDependancyColumns[key][i]] = "Value is invalid and may cause the product to validate incorrectly."
                }
            }

            //Trimming unwanted Property to make JSON light
            if (!!transformResults.ValidProducts[key]) {
                transformResults = massagingObjectsForJSON(key, transformResults);
            }

            // If no duplicate or invalid add valid JSON
            data[r].PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
            sourceData[r].PTR_SYS_PRD = data[r].PTR_SYS_PRD;

            if ((!!transformResults.InValidProducts[key] && (transformResults.InValidProducts[key]["I"].length > 0
                    || transformResults.InValidProducts[key]["E"].length > 0)) || !!transformResults.DuplicateProducts[key]) {
                root.setBusy("", "");
                vm.openProdCorrector(currentRow, transformResults, rowData, publishWipDeals);
                isAllValidated = false;
                break;
            }

            if (isAllValidated) {
                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    var kitObject = populateValidProducts(transformResults.ValidProducts[key]);
                    transformResults.ValidProducts[key] = kitObject.ReOrderedJSON;
                    var userInput = updateUserInput(transformResults.ValidProducts[key], kitObject.contractProducts);
                } else {
                    var userInput = updateUserInput(transformResults.ValidProducts[key]);
                }

                var contractProducts = userInput.contractProducts.toString().replace(/(\r\n|\n|\r)/gm, ""); // TODO: probably move all these replace functions should into the custom paste instead
                var originalProducts = data[r].PTR_USER_PRD.toString().replace(/(\r\n|\n|\r)/gm, ""); // NOTE: This replace function takes out hidden new line characters, which break js dictionaries

                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    var orignalUnswappedDataDict = {}; // Dictionary<product, original dataItem>
                    var originalProductsArr = originalProducts.split(',');
                    var isProductOrderChanged = (contractProducts !== originalProducts);

                    if (isProductOrderChanged) {
                        // Create a dictionary of products with their original tiered data
                        for (var i = 0; i < originalProductsArr.length; i++) {
                            var originalIndex = parseInt(r) + i; // i+1 is essentially the tier assuming the usr prd is in the right order. But then we minus 1 for getting the index so it's just i.
                            orignalUnswappedDataDict[formatStringForDictKey(originalProductsArr[i])] = angular.copy(data[originalIndex]);
                        }
                    }
                }

                data[r].PTR_USER_PRD = contractProducts;   // Change the PTR_USER_PRD to the re-ordered product list
                sourceData[r].PTR_USER_PRD = contractProducts;

                data[r].PTR_SYS_PRD = !!transformResults.ValidProducts[key] ? JSON.stringify(transformResults.ValidProducts[key]) : "";
                sourceData[r].PTR_SYS_PRD = data[r].PTR_SYS_PRD;

                // KIT update PRD_DRWAING_ORDER and merged rows
                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                    data[r].PRD_DRAWING_ORD = kitObject.PRD_DRAWING_ORD;
                    sourceData[r].PRD_DRAWING_ORD = data[r].PRD_DRAWING_ORD
                    data[r]['dirty'] = true;
                    sourceData[r]['dirty'] = true;
                    var tierNbr = root.numOfPivot(data[r]);
                    var mergedRows = parseInt(r) + tierNbr;
                    var modifiedNumTiers = data[r].PTR_USER_PRD.split(',').length;
                    modifiedNumTiers = modifiedNumTiers < tierNbr ? tierNbr : modifiedNumTiers;
                    for (var a = mergedRows - 1; a >= r ; a--) { // look at each tier by it's index, going backwards
                        if (isProductOrderChanged) {
                            // We had swapped around the product order, so we need to map corresponding dimmed/tiered attributes to their new product order too
                            var newContractProdArr = contractProducts.split(',');
                            var currProduct = newContractProdArr[(a - r)]; // NOTE: this asssumes we swapped the PTR_USER_PRD to the re-ordered product list already
                            for (var d = 0; d < root.kitDimAtrbs.length; d++) {
                                if (root.kitDimAtrbs[d] == "TIER_NBR") { continue; }
                                // Check for undefined..Extra product might have been from user input translated e.g., 7230(F) ==> 7230F,7230
                                if (orignalUnswappedDataDict[formatStringForDictKey(currProduct)] !== undefined) {
                                    data[a][root.kitDimAtrbs[d]] = orignalUnswappedDataDict[formatStringForDictKey(currProduct)][root.kitDimAtrbs[d]];
                                }
                            }
                        }

                        data[a].PTR_USER_PRD = data[r].PTR_USER_PRD;
                        sourceData[a].PTR_USER_PRD = data[r].PTR_USER_PRD;
                        data[a].PRD_DRAWING_ORD = data[r].PRD_DRAWING_ORD;
                        sourceData[a].PRD_DRAWING_ORD = sourceData[r].PRD_DRAWING_ORD
                        data[a].PTR_SYS_PRD = data[r].PTR_SYS_PRD;
                        sourceData[a].PTR_SYS_PRD = data[r].PTR_SYS_PRD;
                        data[a]['dirty'] = true;
                        sourceData[a]['dirty'] = true;
                        //sourceData[a]['TIER_NBR'] = modifiedNumTiers;
                        modifiedNumTiers--;
                    }
                }

                // VOL_TIER update exclude products
                if (root.colToLetter["PRD_EXCLDS"] != undefined) {
                    var excludeProducts = userInput.excludeProducts;
                    data[r].PRD_EXCLDS = excludeProducts;
                    sourceData[r].PRD_EXCLDS = excludeProducts;
                }
            }
        }

        if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
            var sheet = spreadsheet.activeSheet();
            syncSpreadRows(sheet, 2, 200);// This will also call root.spreadDs.sync();
        } else {
        	spreadDsSync();
        }
        if (isAllValidated) {
            root.child.setRowIdStyle(data);
            // If current row is undefined its clicked from top bar validate button
            if (!currentRow) {
                $timeout(function () {
                    if (!publishWipDeals) {
                        root.validatePricingTable();
                    } else {
                        root.publishWipDealsBase();
                    } // Call Save and Validate API from Contract Manager
                }, 20);
            }
            else {
                root.setBusy("", "");
                $timeout(function () {
                    validateSingleRowProducts(data[currentRow - 1], currentRow);
                }, 10)
            }
        }
    }

    function openProdCorrector(currentRow, transformResults, rowData, publishWipDeals) {
        var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;

        var modal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productCorrector/productCorrector' + $scope.pcVer + '.html',
            controller: 'ProductCorrector' + $scope.pcVer + 'ModalController',
            controllerAs: 'vm',
            size: 'lg',
            windowClass: 'prdCorrector-modal-window',
            resolve: {
                GetProductCorrectorData: angular.copy(transformResults), //Product Master List
                contractData: angular.copy($scope.contractData), // Contract data
                RowId: currentRow, // Row ID which should be validated
                CustSid: function () {
                    return root.getCustId();
                },
                ProductRows: function () {
                    return angular.copy(rowData);
                },
                dealType: function () {
                    return angular.copy(root.curPricingTable.OBJ_SET_TYPE_CD);
                }
            }
        });
        modal.result.then(
            function (transformResult) {
                $timeout(function () {
                    var data = root.spreadDs.data();
                    var sourceData = root.pricingTableData.PRC_TBL_ROW;

                    if (Object.keys(transformResult.DuplicateProducts).length > 0 || Object.keys(transformResult.InValidProducts).length > 0) {
                        publishWipDeals = false;
                    }

                    if (!!transformResult && !!transformResult.ProdctTransformResults) {
                        for (var key in transformResult.ProdctTransformResults) {
                            var r = key - 1;
                            var allIssuesDone = false;

                            //Trimming unwanted Property to make JSON light
                            if (!!transformResult.ValidProducts[key]) {
                                transformResult = massagingObjectsForJSON(key, transformResult);
                            }

                            // Save Valid and InValid JSO into spreadsheet hidden columns
                            if (transformResult.InValidProducts[key]["I"].length !== 0 || transformResult.InValidProducts[key]["E"].length !== 0 || !!transformResult.DuplicateProducts[key]) {
                                var invalidJSON = {
                                    'ProdctTransformResults': transformResult.ProdctTransformResults[key],
                                    'InValidProducts': transformResult.InValidProducts[key], 'DuplicateProducts': transformResult.DuplicateProducts[key]
                                }
                                data[r].PTR_SYS_INVLD_PRD = JSON.stringify(invalidJSON);
                                sourceData[r].PTR_SYS_INVLD_PRD = data[r].PTR_SYS_INVLD_PRD;
                            } else {
                                data[r].PTR_SYS_INVLD_PRD = "";
                                sourceData[r].PTR_SYS_INVLD_PRD = data[r].PTR_SYS_INVLD_PRD;
                                allIssuesDone = true;
                            }

                            data[r].PTR_SYS_PRD = !!transformResult.ValidProducts[key] ? JSON.stringify(transformResult.ValidProducts[key]) : "";
                            sourceData[r].PTR_SYS_PRD = data[r].PTR_SYS_PRD;

                            // Update user input if all the issues are done
                            if (allIssuesDone) {
                                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                                    var kitObject = populateValidProducts(transformResult.ValidProducts[key]);
                                    transformResult.ValidProducts[key] = kitObject.ReOrderedJSON;
                                    var products = updateUserInputFromCorrector(transformResult.ValidProducts[key],
                                                        transformResult.AutoValidatedProducts[key], kitObject.contractProducts);
                                } else {
                                    var products = updateUserInputFromCorrector(transformResult.ValidProducts[key],
                                                        transformResult.AutoValidatedProducts[key]);
                                }

                                data[r].PTR_USER_PRD = products.contractProducts;
                                sourceData[r].PTR_USER_PRD = products.contractProducts;

                                data[r].PTR_SYS_PRD = !!transformResult.ValidProducts[key] ? JSON.stringify(transformResult.ValidProducts[key]) : "";
                                sourceData[r].PTR_SYS_PRD = data[r].PTR_SYS_PRD;

                                // VOL_TIER update exclude products
                                if (root.colToLetter["PRD_EXCLDS"] != undefined) {
                                    data[r].PRD_EXCLDS = products.excludeProducts;
                                    sourceData[r].PRD_EXCLDS = products.excludeProducts;
                                }
                                // KIT update PRD_DRAWING_ORD
                                if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                                    data[r].PRD_DRAWING_ORD = kitObject.PRD_DRAWING_ORD;
                                    sourceData[r].PRD_DRAWING_ORD = data[r].PRD_DRAWING_ORD;
                                    data[r]['dirty'] = true;
                                    sourceData[r]['dirty'] = true;
                                    var tierNbr = root.numOfPivot(data[r]);
                                    var mergedRows = parseInt(r) + tierNbr;
                                    var modifiedNumTiers = data[r].PTR_USER_PRD.split(',').length;
                                    modifiedNumTiers = modifiedNumTiers < tierNbr ? tierNbr : modifiedNumTiers;
                                    for (var a = mergedRows - 1; a >= r ; a--) {
                                        data[a].PTR_USER_PRD = data[r].PTR_USER_PRD;
                                        sourceData[a].PTR_USER_PRD = data[r].PTR_USER_PRD;
                                        data[a].PRD_DRAWING_ORD = data[r].PRD_DRAWING_ORD;
                                        sourceData[a].PRD_DRAWING_ORD = sourceData[r].PRD_DRAWING_ORD
                                        data[a].PTR_SYS_PRD = data[r].PTR_SYS_PRD;
                                        sourceData[a].PTR_SYS_PRD = data[r].PTR_SYS_PRD;
                                        data[a]['dirty'] = true;
                                        sourceData[a]['dirty'] = true;
                                        //sourceData[a]['TIER_NBR'] = modifiedNumTiers;
                                        modifiedNumTiers--;
                                    }
                                }
                                // For VOL_TIER update the merged cells
                                if (root.isPivotable() && (products.contractProducts === "" || !products.contractProducts)) {
                                    var mergedRows = parseInt(r) + root.numOfPivot(data[r]);
                                    for (var a = r; a < mergedRows ; a++) {
                                        data[a].DC_ID = null;
                                        data[a].PTR_USER_PRD = "";
                                        sourceData[a].PTR_USER_PRD = "";
                                    }
                                } else {
                                    data[r].DC_ID = (products.contractProducts === "" || !products.contractProducts) ? null : data[r].DC_ID;
                                }
                            }
                        }
                    }

                    if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
                        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
                        var sheet = spreadsheet.activeSheet();
                        syncSpreadRows(sheet, 2, 200); // NOTE: 2 accounts for the top row
                    } else {
                    	deleteRowFromCorrector(data);
                    	spreadDsSync();
                    }
                    if (root.spreadDs.data().length === 0) {
                        root.setBusy("No Products Found", "Please add products.", "Warning");
                        $timeout(function () {
                            root.setBusy("", "");
                        }, 2000);
                        return;
                    }
                    root.child.setRowIdStyle(data);
                    if (!currentRow) { // If current row is undefined its clicked from top bar validate button
                        root.setBusy("", "");
                        $timeout(function () {
                            if (transformResult.AbortProgration) {
                                return true;
                            }
                            if (!publishWipDeals) {
                                root.validatePricingTable();
                            } else {
                                root.publishWipDealsBase();
                            } // Call Save and Validate API from Contract Manager
                        }, 20);
                    } else {
                        $timeout(function () {
                            validateSingleRowProducts(data[currentRow - 1], currentRow);
                        }, 10);
                    }
                },
                    function () { });
            }, 10);
    }

    //Trimming unwanted Property to make JSON light
    function massagingObjectsForJSON(key, transformResult) {
        for (var validKey in transformResult.ValidProducts[key]) {
            transformResult.ValidProducts[key][validKey] = transformResult.ValidProducts[key][validKey].map(function (x) {
                return {
                    BRND_NM: x.BRND_NM,
                    CAP: x.CAP,
                    CAP_END: x.CAP_END,
                    CAP_START: x.CAP_START,
                    DEAL_PRD_NM: x.DEAL_PRD_NM,
                    DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                    DERIVED_USR_INPUT: x.DERIVED_USR_INPUT,
                    FMLY_NM: x.FMLY_NM,
                    HAS_L1: x.HAS_L1,
                    HAS_L2: x.HAS_L2,
                    HIER_NM_HASH: x.HIER_NM_HASH,
                    HIER_VAL_NM: x.HIER_VAL_NM,
                    MM_MEDIA_CD: x.MM_MEDIA_CD,
                    MTRL_ID: x.MTRL_ID,
                    PCSR_NBR: x.PCSR_NBR,
                    PRD_ATRB_SID: x.PRD_ATRB_SID,
                    PRD_CAT_NM: x.PRD_CAT_NM,
                    PRD_END_DTM: x.PRD_END_DTM,
                    PRD_MBR_SID: x.PRD_MBR_SID,
                    PRD_STRT_DTM: x.PRD_STRT_DTM,
                    USR_INPUT: x.USR_INPUT,
                    YCS2: x.YCS2,
                    YCS2_END: x.YCS2_END,
                    YCS2_START: x.YCS2_START,
                    EXCLUDE: x.EXCLUDE
                }
            });
        }
        return transformResult;
    }

    function deleteRowFromCorrector(data) {
        var dataCountBeforeDelete = data.length;
        cleanupData(data);
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");
        var sheet = spreadsheet.activeSheet();
        if (!!sheet) {
            var cnt = data.length;
            var numToDel = dataCountBeforeDelete - cnt;
            cnt = cnt + 2;
            sheet.batch(function () {
                // Disable user editable columns
                disableRange(sheet.range(root.colToLetter[GetFirstEdiatableBeforeProductCol()] + cnt + ":" + finalColLetter + (cnt + numToDel)));

                // Re-enable Product column
                var prdRange = sheet.range(root.colToLetter["PTR_USER_PRD"] + cnt + ":" + root.colToLetter["PTR_USER_PRD"] + (cnt + numToDel));
                prdRange.enable(true);
                prdRange.background(null);
            });
        }
    }

    function updateUserInput(validProducts, kiProducts) {
        if (!validProducts) {
            return "";
        }
        var input = { 'contractProducts': '', 'excludeProducts': '' };
        if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            input.contractProducts = kiProducts;
            return input;
        }
        for (var prd in validProducts) {
            if (validProducts.hasOwnProperty(prd)) {
                var contractProducts = "";
                var excludeProducts = "";

                // Include products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === false;
                });
                if (products.length !== 0) {
                    var contDerivedUserInput = $filter('unique')(products, 'HIER_VAL_NM');
                    if (products.length === 1 && contDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() == contDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        contractProducts = contDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        contractProducts = contDerivedUserInput.length == 1 ? getFullNameOfProduct(contDerivedUserInput[0], contDerivedUserInput[0].DERIVED_USR_INPUT) : contDerivedUserInput[0].DERIVED_USR_INPUT;
                    }
                    if (contractProducts !== "") {
                        input.contractProducts = input.contractProducts === "" ? contractProducts : input.contractProducts + "," + contractProducts;
                    }
                }

                // Exclude Products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE === true;
                });
                if (products.length !== 0) {
                    var exclDerivedUserInput = $filter('unique')(products, 'HIER_VAL_NM');
                    if (products.length === 1 && exclDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() === exclDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        excludeProducts = exclDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        excludeProducts = exclDerivedUserInput.length == 1 ? getFullNameOfProduct(exclDerivedUserInput[0], exclDerivedUserInput[0].DERIVED_USR_INPUT) : exclDerivedUserInput[0].DERIVED_USR_INPUT;
                    }
                    if (excludeProducts !== "") {
                        input.excludeProducts = input.excludeProducts === "" ? excludeProducts : input.excludeProducts + "," + excludeProducts;
                    }
                }
            }
        }
        return input;
    }

    function updateUserInputFromCorrector(validProducts, autoValidatedProducts, kiProducts) {
        if (!validProducts) {
            return "";
        }
        var products = { 'contractProducts': '', 'excludeProducts': '' };
        if (root.curPricingTable.OBJ_SET_TYPE_CD === "KIT") {
            products.contractProducts = kiProducts;
            return products;
        }
        for (var prd in validProducts) {
            if (!!autoValidatedProducts && autoValidatedProducts.hasOwnProperty(prd)) {
                var autoTranslated = {};
                autoTranslated[prd] = autoValidatedProducts[prd];

                var updatedUserInput = updateUserInput(autoTranslated);

                // Include products
                var autoValidContProd = updatedUserInput.contractProducts;
                if (autoValidContProd !== "") {
                    products.contractProducts = products.contractProducts === "" ? autoValidContProd : products.contractProducts + "," + autoValidContProd;
                }

                // Exclude Products
                var autoValidExcludeProd = updatedUserInput.excludeProducts;
                if (autoValidExcludeProd !== "") {
                    products.excludeProducts = products.excludeProducts === "" ? autoValidExcludeProd : products.excludeProducts + "," + autoValidExcludeProd;
                }
            }
            else if (validProducts.hasOwnProperty(prd)) {
                products.contractProducts = getUserInput(products.contractProducts, validProducts[prd], "I", 'HIER_VAL_NM');
                products.excludeProducts = getUserInput(products.excludeProducts, validProducts[prd], "E", 'HIER_VAL_NM');
            }
        }
        return products;
    }

    function getFullNameOfProduct(item, prodName) {
        if (item.PRD_ATRB_SID > 7005) return prodName;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }

    function getUserInput(updatedUserInput, products, typeOfProduct, fieldNm) {

        var userInput = products.filter(function (x) {
            return x.EXCLUDE === (typeOfProduct === "E");
        });
        userInput = $filter('unique')(userInput, fieldNm);

        userInput = userInput.map(function (elem) {
            return elem[fieldNm];
        }).join(",");

        if (userInput !== "") {
            updatedUserInput = updatedUserInput === "" || fieldNm !== 'HIER_VAL_NM' ? userInput : updatedUserInput + "," + userInput;
        }
        return updatedUserInput;
    }

    function validateOnlyProducts() {
        var data = cleanupData(root.spreadDs.data());
        ValidateProducts(data, false, false);
    }

    function validatePricingTableProducts() {
        $scope.root.pc = new perfCacheBlock("Pricing Table Editor Save & Validate", "UX");
        var data = cleanupData(root.spreadDs.data());
        ValidateProducts(data, false, true);
    }

    function validateSavepublishWipDeals() {
        var data = cleanupData(root.spreadDs.data());
        ValidateProducts(data, true, true);
    }

    // NOTE: Thhis is a workaround because the bulit-in kendo spreadsheet datepicker causes major perfromance issues in IE
    kendo.spreadsheet.registerEditor("dropdownEditor", function () {
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
            var cellCurrVal = context.range.value();

            // Get column name out of selected cell
            var colName = root.letterToCol[String.fromCharCode(intA + currColIndex)]

            // Get columnData (urls, name, etc) from column name
            var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;
            var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW[dealType].model.fields[colName];

            var modalInstance = $uibModal.open({
                //animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'dropdownModal',
                controller: 'DropdownModalCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    cellCurrValues: function () {
                        return cellCurrVal;
                    },
                    colData: function () {
                        return colData;
                    },
                    colName: function () {
                        return colName;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                context.callback(selectedItem);
            }, function () { });
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
            var colName = root.letterToCol[String.fromCharCode(intA + currColIndex)];

            // Get columnData (urls, name, etc) from column name
            var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;
            var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW[dealType].model.fields[colName];

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

                if (colName === "CUST_ACCNT_DIV") {
                    cellCurrVal = cellCurrVal.replace(/\//g, ",");
                }

                cellCurrVal = cellCurrVal.split(',');

                // Trim the front space (if exists) so that the multiselect controls know the correct selection
                // TODO: Figure out how to make pre-selected values non case-sensitive (harder han it sounds unfortunately)
                for (var i = 0; i < cellCurrVal.length; i++) {
                    cellCurrVal[i] = cellCurrVal[i].trim();
                }
            }

            var modalInstance = $uibModal.open({
                //animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'multiSelectModal',
                controller: 'MultiSelectModalCtrl',
                controllerAs: '$ctrl',
                windowClass: 'multiselect-modal-window',
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
            var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;
            var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW[dealType].model.fields[colName];

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


    // NOTE: Thhis is a workaround because the bulit-in kendo spreadsheet datepicker causes major perfromance issues in IE
    kendo.spreadsheet.registerEditor("ecapAdjTracker", function () {
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
            var cellCurrVal = context.range.value();

            // Get column name out of selected cell
            var colName = root.letterToCol[String.fromCharCode(intA + currColIndex)]

            // Get columnData (urls, name, etc) from column name
            var dealType = $scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD;
            var colData = $scope.$parent.$parent.templates.ModelTemplates.PRC_TBL_ROW[dealType].model.fields[colName];

            var currRowData = root.spreadDs.data()[context.range._ref.row - 1]; //root.pricingTableData.PRC_TBL_ROW[context.range._ref.row - 1]; // minus one to account for index

            if (currRowData.PTR_SYS_PRD === "" || currRowData.PTR_SYS_PRD === null) {
                // Confirmation Dialog
                var modalOptions = {
                    closeButtonText: 'Close',
                    hasActionButton: false,
                    headerText: 'Product Validator needs to run',
                    bodyText: 'The product validator must run before we can find a list of tracker numbers for this row. Please run the product validator then try again.'
                };
                confirmationModal.showModal({}, modalOptions);
                return;
            }

            var prdObj = JSON.parse(currRowData.PTR_SYS_PRD);
            var prdList = [];
            for (var key in prdObj) {
                if (prdObj.hasOwnProperty(key)) {
                    prdList.push(prdObj[key][0].PRD_MBR_SID);
                }
            }

            // Get data to filter ECAP numbers against
            var filterData = {
                'START_DT': currRowData.START_DT,
                'END_DT': currRowData.END_DT,
                'GEO_COMBINED': currRowData.GEO_COMBINED,
                'CUST_MBR_SID': currRowData.CUST_MBR_SID,
                'PRD_MBR_SID': prdList[0]
            };

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'ecapTrackerModal',
                controller: 'EcapTrackerModalCtrl',
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    cellCurrValues: function () {
                        return cellCurrVal;
                    },
                    colData: function () {
                        return colData;
                    },
                    colName: function () {
                        return colName;
                    },
                    filterData: function () {
                        return filterData;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                context.callback(selectedItem);
            }, function () { });
        }
    });

    function getPrductDetails(dataItem, priceCondition) {
        return [{
            'CUST_MBR_SID': $scope.contractData.CUST_MBR_SID,
            'PRD_MBR_SID': dataItem.PRODUCT_FILTER,
            'GEO_MBR_SID': getFormatedGeos(dataItem.GEO_COMBINED),
            'START_DT': dataItem.START_DT,
            'END_DT': dataItem.END_DT,
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }];
    }

    function openCAPBreakOut(dataItem, priceCondition) {
        var productData = {
            'CUST_MBR_SID': $scope.contractData.CUST_MBR_SID,
            'PRD_MBR_SID': dataItem.PRODUCT_FILTER,
            'GEO_MBR_SID': getFormatedGeos(dataItem.GEO_COMBINED),
            'START_DT': dataItem.START_DT,
            'END_DT': dataItem.END_DT,
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }
        var capModal = $uibModal.open({
            backdrop: 'static',
            templateUrl: 'app/contract/productCAPBreakout/productCAPBreakout.html',
            controller: 'ProductCAPBreakoutController',
            controllerAs: 'vm',
            windowClass: 'cap-modal-window',
            size: 'lg',
            resolve: {
                productData: angular.copy(productData),
            }
        });

        capModal.result.then(
            function () {
            },
            function () {
            });
    }

    /*
     * -------------------------------------------
     * CUSTOM UNDO / REDO
     * -------------------------------------------
     */

    $scope.undoCounter = 0;
    $scope.redoCounter = 0;
    var isFirstUndo = true;
    var clearedUndoCount = 0; // Keep cleared counter so that syncUndo$scope.redoCounters does not allow for cleared history to still be undo'ed
    var clearedRedoCount = 0;

    function replaceUndoRedoBtns() {
        // Hide the default undo/red buttons in favor of the custom undo/redo buttons
        // But note that our custom undo/redo solution requires these buttons to still be in the page

        var redoBtn = $('.k-i-redo');
        redoBtn.addClass('hidden'); // fa fa-share ssUndoButton
        redoBtn.removeClass('k-i-redo k-icon');

        var undoBtn = $('.k-i-undo');
        undoBtn.addClass('hidden'); // fa fa-reply ssUndoButton
        undoBtn.removeClass('k-i-undo k-icon');
    }

    $scope.customUndo = function () {
        if ($scope.undoCounter > 0) {
            $(".k-button[title=Undo]").click();
            syncUndoRedoCounters();
        }
    }

    $scope.showBidStatusWip = function (dataItem) {
        return gridUtils.showBidStatusWip(dataItem);
    }

    $scope.customRedo = function () {
        // NOTE: Redo calls the onChange event (but undo does not), so there is no need to call syncUndo$scope.redoCounters() here
        if ($scope.redoCounter > 0) {
            $(".k-button[title=Redo]").click();
        }
    }

    // Reset the undo/redo counters. Doesn't actually clear Kendo's undo/redo stack
    function clearUndoHistory() {
        clearedUndoCount += $scope.undoCounter;
        clearedRedoCount += $scope.redoCounter - 1;
        $scope.undoCounter = 0;
        $scope.redoCounter = 0;
    }

    // Capture Ctrl Z and Ctrl Y then sync undo/redo counters
    $(document).keydown(function (e) {
        // Ctrl Z
        if (e.ctrlKey && e.keyCode == 90) {
            syncUndoRedoCounters();
        }
            // Ctrl Y
        else if (e.ctrlKey && e.keyCode == 89) {
            syncUndoRedoCounters();
        }
    });

    // Sync undo/redo counters with Kendo's built-in undo/redo stack and our custom cleared undo/redo history counters
    function syncUndoRedoCounters() {
        var undoRedoStack = $('#pricingTableSpreadsheet').data("kendoSpreadsheet")._workbook.undoRedoStack;
        var currentCommandIndex = (undoRedoStack.currentCommandIndex + 1);

        $scope.undoCounter = currentCommandIndex - clearedUndoCount;
        $scope.redoCounter = undoRedoStack.stack.length - currentCommandIndex - clearedRedoCount;

        if (isFirstUndo) { // Workaround because for some reason Kendo's undo/redo stack is 1 off on first available undo (but not 2nd onwards)
            $scope.undoCounter += 1;
            isFirstUndo = false;
        }
    }

    init();
}