angular
    .module('app.contract')
    .controller('PricingTableController', PricingTableController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
PricingTableController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'confirmationModal', 'dataService', 'logger', 'pricingTableData', 'productSelectorService', 'MrktSegMultiSelectService', '$uibModal', '$timeout', 'opGridTemplate'];

function PricingTableController($scope, $state, $stateParams, $filter, confirmationModal, dataService, logger, pricingTableData, productSelectorService, MrktSegMultiSelectService, $uibModal, $timeout, opGridTemplate) {
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
    $scope.validatePricingTableProducts = validatePricingTableProducts;
    $scope.validateSavepublishWipDeals = validateSavepublishWipDeals;
    $scope.pcVer = "Beta";
    $scope.numTiers = 1;


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
    vm.requiredStringColumns = {};
    //root.wipData;
    //root.wipOptions;
    var ssTools;
    var stealthOnChangeMode = false;
    root.isPtr = $state.current.name === "contract.manager.strategy";
    root.isWip = $state.current.name === "contract.manager.strategy.wip";

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

        if (root.isPtr)
            generateKendoSpreadSheetOptions();
        else {
            generateKendoGridOptions();
            root.pageTitle = "Deal Editor";
        }
    }

    function getMergedCells(numTiers) {
        //return [];
        var mergedCells = [];
        var rowNum = 2;
        while (rowNum < $scope.root.ptRowCount) {
            for (var c = 0; c < ptTemplate.columns.length; c++) {
                var letter = String.fromCharCode(intA + c);
                if (!ptTemplate.columns[c].isDimKey) {
                    mergedCells.push(letter + rowNum + ":" + letter + (rowNum + numTiers - 1));
                }
            }
            rowNum += numTiers;
        }
        return mergedCells;
    }

    // Generates options that kendo's html directives will use
    function generateKendoSpreadSheetOptions() {
        pricingTableData.data.PRC_TBL_ROW = root.pivotData(pricingTableData.data.PRC_TBL_ROW);

        var mergedCells = [];
        $scope.numTiers = 1;
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
            ptTemplate.columns[3].hidden = true;
        }

        if (!!root.curPricingTable.NUM_OF_TIERS) {
            $scope.numTiers = parseInt(root.curPricingTable.NUM_OF_TIERS);
            mergedCells = getMergedCells($scope.numTiers);
        }

        $scope.ptSpreadOptions = {
            headerWidth: 0, /* Hide the Row numbers */
            change: onChange,
            columns: columns.length,
            sheetsbar: false,
            defaultCellStyle: {
                fontSize: cellStyle.fontSize,
                fontFamily: cellStyle.fontfamily,
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
                    mergedCells: mergedCells,
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

    // Generates options that kendo's html directives will use
    function generateKendoGridOptions() {
        wipTemplate = root.templates.ModelTemplates.WIP_DEAL[root.curPricingTable.OBJ_SET_TYPE_CD];
        gTools = new gridTools(wipTemplate.model, wipTemplate.columns);
        gTools.assignColSettings();

        $timeout(function () {
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

            root.setBusy("Drawing Grid", "Applying security to the grid.");
            $timeout(function () {
                root.setBusy("", "");
            }, 1500);
        }, 10);
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
                        startDate: pricingTableRow.START_DT, endDate: pricingTableRow.END_DT
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
                    return root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD;
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

    function updateSpreadSheetFromSelector(productSelectorOutput, sheet, rowStart) {
        var validatedSelectedProducts = productSelectorOutput.validateSelectedProducts;
        if (!productSelectorOutput.splitProducts) {
            var usrInput = updateUserInput(validatedSelectedProducts);
            var contractProducts = usrInput.contractProducts;
            //PTR_SYS_PRD
            sheet.range('B' + (rowStart)).value(JSON.stringify(validatedSelectedProducts));
            systemModifiedProductInclude = true;
            sheet.range(root.colToLetter['PTR_USER_PRD'] + (rowStart)).value(contractProducts);

            if (root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD === "VOL_TIER") {
                sheet.range(root.colToLetter['PRD_EXCLDS'] + (rowStart)).value(usrInput.excludeProducts);
            }

            systemModifiedProductInclude = false;
            // can't use colToLetter for PTR_SYS_INVLD_PRD because it is hidden
            sheet.range('C' + (rowStart)).value("");

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
                    if (!!root.curPricingTable.NUM_OF_TIERS) {
                        var mergedRows = parseInt(row) + parseInt(root.curPricingTable.NUM_OF_TIERS);
                        for (var a = row; a < mergedRows ; a++) {
                            var validJSON = {};
                            validJSON[key] = singleProductJSON[key];
                            // can't use colToLetter for PTR_SYS_PRD because it is hidden
                            sheet.range('B' + (a)).value(JSON.stringify(validJSON));
                            systemModifiedProductInclude = true;
                            sheet.range(root.colToLetter['PTR_USER_PRD'] + (a)).value(key);
                            systemModifiedProductInclude = false;
                            // can't use colToLetter for PTR_SYS_INVLD_PRD because it is hidden
                            sheet.range('C' + (a)).value("");
                        }
                        row = mergedRows - 1;
                    } else {
                        var validJSON = {};
                        validJSON[key] = singleProductJSON[key];
                        // can't use colToLetter for PTR_SYS_PRD because it is hidden
                        sheet.range('B' + (row)).value(JSON.stringify(validJSON));
                        systemModifiedProductInclude = true;
                        sheet.range(root.colToLetter['PTR_USER_PRD'] + (row)).value(key);
                        systemModifiedProductInclude = false;
                        // can't use colToLetter for PTR_SYS_INVLD_PRD because it is hidden
                        sheet.range('C' + (row)).value("");
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

    var flushSysPrdFields = ["PTR_USER_PRD", "PRD_EXCLDS", "START_DT", "END_DT", "GEO_COMBINED", "PROD_INCLDS", "PROGRAM_PAYMENT"];
    var flushTrackerNumFields = ["START_DT", "END_DT", "GEO_COMBINED"];

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
        var bottomRightRowIndex = (range._ref.bottomRight.row + (range._ref.bottomRight.row % root.child.numTiers) + 1);

        var productColIndex = (root.colToLetter["PTR_USER_PRD"].charCodeAt(0) - intA);
        var excludeProductColIndex = root.colToLetter["PRD_EXCLDS"] ? (root.colToLetter["PRD_EXCLDS"].charCodeAt(0) - intA) : -1;

        var isProductColumnIncludedInChanges = (range._ref.topLeft.col <= productColIndex) && (range._ref.bottomRight.col >= productColIndex);
        var isExcludeProductColumnIncludedInChanges = (range._ref.topLeft.col <= excludeProductColIndex) && (range._ref.bottomRight.col >= excludeProductColIndex);

        // check for selections in te middle of a merge
        //if (range._ref.bottomRight.row % root.child.numTiers > 0) {
        //    range = sheet.range(String.fromCharCode(intA + range._ref.topLeft.col) + (range._ref.topLeft.row + 1) + ":" + String.fromCharCode(intA + range._ref.bottomRight.col) + (range._ref.bottomRight.row + (range._ref.bottomRight.row % root.child.numTiers) + 2));
        //}

        // VOL-TIER
        if (root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD == "VOL_TIER") {
            var endVolIndex = (root.colToLetter["END_VOL"].charCodeAt(0) - intA);
            var strtVolIndex = (root.colToLetter["STRT_VOL"].charCodeAt(0) - intA);
            var rateIndex = (root.colToLetter["RATE"].charCodeAt(0) - intA);

            var isEndVolColChanged = (range._ref.topLeft.col <= endVolIndex) && (range._ref.bottomRight.col >= endVolIndex);
            var isStrtVolColChanged = (range._ref.topLeft.col <= strtVolIndex) && (range._ref.bottomRight.col >= strtVolIndex);
            var isRateColChanged = (range._ref.topLeft.col <= rateIndex) && (range._ref.bottomRight.col >= rateIndex);

            // On End_vol col change
            if (isEndVolColChanged || isStrtVolColChanged || isRateColChanged) {
                var data = root.spreadDs.data();
                var sourceData = root.pricingTableData.PRC_TBL_ROW;

                range.forEachCell(
                    function (rowIndex, colIndex, value) {
                        var myRow = data[(rowIndex - 1)];
                        if (myRow != undefined && myRow.DC_ID != undefined && myRow.DC_ID != null) {

                            var isEndVolUnlimited = false;
                            var numOfTiers = parseInt(root.pricingTableData.PRC_TBL[0].NUM_OF_TIERS);

                            if (value.value !== null && value.value !== undefined && value.value.toString().toUpperCase() == unlimitedVal.toUpperCase() && colIndex === endVolIndex && myRow.TIER_NBR === numOfTiers) {
                                isEndVolUnlimited = true;
                            }

                            // Start vol, end vol, or rate changed
                            if (!isEndVolUnlimited) {

                                if (colIndex === endVolIndex || colIndex === strtVolIndex) {
                                    value.value = parseInt(value.value) || 0; // HACK: To make sure End vol has a numerical value so that validations work and show on these cells
                                    //value.format = "##,#"; // TODO: fomatting the end vol (a string with number possibilities) does not work. Figure out why.
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
                                myRow.END_VOL = value.value;
                                sourceData[(rowIndex - 1)].END_VOL = myRow.END_VOL;
                            }
                            // HACK: Set the other columns' values in our data and source data to value else they will not change to our newly expected values
                            var myColLetter = String.fromCharCode(intA + (colIndex));
                            var colName = root.letterToCol[myColLetter];
                            myRow[colName] = value.value;
                            sourceData[(rowIndex - 1)][colName] = value.value;
                        }
                    }
                );
                cleanupData(data);
                root.spreadDs.sync();
            }
        }

        var isRangeValueEmptyString = (range.value() !== null && range.value().toString().replace(/\s/g, "").length === 0);


        var hasValueInAtLeastOneCell = false;

        range.forEachCell(
            function (rowIndex, colIndex, value) {
                if (value.value !== null && value.value !== undefined && value.value.toString().replace(/\s/g, "").length !== 0) { // Product Col changed
                    hasValueInAtLeastOneCell = true;
                }
            }
        );

        if (isProductColumnIncludedInChanges && (!hasValueInAtLeastOneCell || isRangeValueEmptyString)) { // Delete row
            var rowStart = topLeftRowIndex - 2;
            var rowStop = bottomRightRowIndex - 2;
            if (root.spreadDs !== undefined) {
                var data = root.spreadDs.data();

                if (hasDataOrPurge(data, rowStart, rowStop)) {
                    stealthOnChangeMode = true; // NOTE: We need this here otherwise 2 pop-ups will show on top on one another when we input spaces to delete.

                    kendo.confirm("Are you sure you want to delete this product and the matching deal?")
                        .then(function () {
                            $timeout(function () {
                                if (root.spreadDs !== undefined) {
                                    // look for skipped lines
                                    var numToDel = rowStop + 1 - rowStart;
                                    data.splice(rowStart, numToDel);

                                    // now apply array to Datasource... one event triggered
                                    root.spreadDs.sync();

                                    $timeout(function () {
                                        var n = data.length + 2;
                                        disableRange(sheet.range("D" + n + ":D" + (n + numToDel + numToDel)));
                                        disableRange(sheet.range("F" + n + ":Z" + (n + numToDel + numToDel)));
                                    }, 10);

                                    clearUndoHistory();
                                    root.saveEntireContract(true);
                                }
                            },
                                10);
                        },
                        function () { });
                    stealthOnChangeMode = false;
                } else {
                    cleanupData(data);
                    root.spreadDs.sync();
                    $timeout(function () {
                        var cnt = 0;
                        for (var c = 0; c < data.length; c++) {
                            if (data[c].DC_ID !== null) cnt++;
                        }
                        var numToDel = rowStop + 1 - rowStart;
                        cnt = cnt + 2;
                        disableRange(sheet.range("D" + cnt + ":D" + (cnt + numToDel - 1)));
                        disableRange(sheet.range("F" + cnt + ":Z" + (cnt + numToDel - 1)));
                        clearUndoHistory();
                    }, 10);
                }
            }
        }
        else {
            // Trigger only if the changed range contains the product column

            // check for empty strings
            if (isRangeValueEmptyString) {
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
                    sheet.range("B" + topLeftRowIndex + ":C" + bottomRightRowIndex).value("");

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
                data[topLeftRowIndex - 2].ORIG_ECAP_TRKR_NBR = null;
            }

            if (isTrackerNumFlushed || (isProductColumnIncludedInChanges && hasValueInAtLeastOneCell) || (isPtrSysPrdFlushed && isExcludeProductColumnIncludedInChanges)) {
                syncSpreadRows(sheet, topLeftRowIndex, bottomRightRowIndex);
            }
        }

        if (!root._dirty) {
            root._dirty = true;
        }
    }

    function cleanupData(data) {
        // Remove any lingering blank rows from the data
        for (var n = data.length - 1; n >= 0; n--) {
            if (data[n].DC_ID === null && (data[n].PTR_USER_PRD === null || data[n].PTR_USER_PRD.toString().replace(/\s/g, "").length === 0)) {
                data.splice(n, 1);
            } else {
                if (util.isInvalidDate(data[n].START_DT)) data[n].START_DT = moment(root.contractData["START_DT"]).format("MM/DD/YYYY");
                if (util.isInvalidDate(data[n].END_DT)) data[n].END_DT = moment(root.contractData["END_DT"]).format("MM/DD/YYYY");
            }
        }

        // fix merge issues
        if (data.length > 0) {
            var lastItem = data[data.length - 1];
            var numTier = root.child.numTiers;
            var offset = data.length % numTier;
            if (offset > 0) {
                for (var a = 0; a < numTier - offset; a++) {
                    data.push(util.deepClone(lastItem));
                }
            }
        }

        return data;
    }

    function hasDataOrPurge(data, rowStart, rowStop) {
        if (data.length === 0) return false;
        for (var n = rowStop; n >= rowStart; n--) {
            if (!!data[n]) {
                if (data[n].DC_ID !== null && data[n].DC_ID > 0) {
                    return true;
                } else if (data[n].DC_ID !== null && data[n].DC_ID < 0) {
                    data.splice(n, 1);
                }
            }
        }
        return false;
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

                cleanupData(data);

                for (var r = 0; r < data.length; r++) {
                    if (data[r]["DC_ID"] !== null && data[r]["DC_ID"] !== undefined) continue;

                    newItems++;
                    data[r]["DC_ID"] = ((r + 1) % root.child.numTiers === 0) ? $scope.uid-- : $scope.uid;
                    data[r]["CUST_ACCNT_DIV"] = root.contractData.CUST_ACCNT_DIV;
                    data[r]["CUST_MBR_SID"] = root.contractData.CUST_MBR_SID;
                    if (!isAddedByTrackerNumber) {
                        data[r]["VOLUME"] = null;
                        data[r]["ECAP_PRICE"] = null;
                    }

                    if (!root.curPricingTable || !!root.curPricingTable.NUM_OF_TIERS) {
                        if (!data[r]["TIER_NBR"] || data[r]["TIER_NBR"] === "") {
                            var tierNumVal = (r % root.child.numTiers) + 1;
                            data[r]["TIER_NBR"] = tierNumVal;
                            data[r]["NUM_OF_TIERS"] = root.curPricingTable.NUM_OF_TIERS;

                            // Default to 0
                            data[r]["RATE"] = 0;

                            if (tierNumVal == parseInt(root.curPricingTable.NUM_OF_TIERS)) {
                                // default last end vol to "unlimited"
                                data[r]["END_VOL"] = unlimitedVal;
                            } else {
                                // Default to 0
                                data[r]["END_VOL"] = 0;
                            }
                            // disable non-first start vols
                            if (tierNumVal != 1) {
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
                            ) {
                                data[r][key] = root.curPricingTable[key];
                            }
                        }
                    }
                }

                // now apply array to Datasource... one event triggered
                root.spreadDs.sync();

                sheet.batch(function () {
                    // If we skipped spaces, we already collapsed, so remove the extra data outside the range
                    var finalColLetter = String.fromCharCode(intA + (ptTemplate.columns.length - 1));
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
                    } else {
                        //topLeftRowIndex = data.length;
                        //bottomRightRowIndex = topLeftRowIndex + newItems;
                    }

                    // check merge issues
                    var offset = ((bottomRightRowIndex - 1) % root.child.numTiers);
                    if (offset > 0) {
                        bottomRightRowIndex += root.child.numTiers - offset;
                    }

                    // Enable other cells
                    if (!!ptTemplate.model.fields["TIER_NBR"]) {
                        // Find tier nbr col
                        var tierColIndex = (root.colToLetter["TIER_NBR"]).charCodeAt(0);
                        var letterAfterTierCol = String.fromCharCode(tierColIndex + 1);
                        var letterBeforeTierCol = String.fromCharCode(tierColIndex - 1);
                        var spreadData = root.spreadDs.data();

                        // Find Strt_vol col
                        var startVolIndex = (root.colToLetter["STRT_VOL"]).charCodeAt(0);

                        // Enable cols except voltier
                        range = sheet.range("D" + topLeftRowIndex + ":" + letterBeforeTierCol + bottomRightRowIndex);
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
                    } else {
                        range = sheet.range("D" + topLeftRowIndex + ":" + finalColLetter + bottomRightRowIndex);
                        range.enable(true);
                        range.background(null);
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

                root.child.setRowIdStyle(data);
            }
        }, 10);
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
            //console.log("onRender");

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

            var t = 95 + (20 * $scope.numTiers);
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
                                sheet.range("A" + row + ":A" + row).background("#FC4C02").color("#FFFFFF");
                            }
                        }

                        // Product Status
                        if (!!data[key].PTR_SYS_INVLD_PRD) { // validated and failed
                            sheet.range("E" + row + ":E" + row).color("#FC4C02").bold(true);
                            //sheet.range("E" + row + ":E" + row).borderLeft({ size: 6, color: "#FC4C02" });
                            if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD == "VOL_TIER") { // validated and passed
                                sheet.range("F" + row + ":F" + row).color("#FC4C02").bold(true);
                            }
                        } else if (!!data[key].PTR_SYS_PRD) { // validated and passed
                            sheet.range("E" + row + ":E" + row).color("#9bc600").bold(true);
                            //vol tier
                            if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD == "VOL_TIER") { // validated and passed
                                sheet.range("F" + row + ":F" + row).color("#9bc600").bold(true);
                            }
                        } else { // not validated
                            sheet.range("E" + row + ":E" + row).color("#000000").bold(false);
                            //sheet.range("E" + row + ":E" + row).borderLeft({ size: 6, color: "transparent" });
                            if ($scope.$parent.$parent.curPricingTable.OBJ_SET_TYPE_CD == "VOL_TIER") { // validated and passed
                                sheet.range("F" + row + ":F" + row).color("#000000").bold(false);
                            }
                        }
                    } else {
                        sheet.range("A" + row + ":A" + row).background("#eeeeee").color("#003C71");
                    }
                    row++;
                }
            }
        }, { layout: true });
    }

    $scope.$on('saveWithWarnings',
        function (event, args) {
            $scope.setRowIdStyle(args.data.PRC_TBL_ROW);
            $scope.root.switchingTabs = false;
        });
    $scope.$on('saveComplete',
        function (event, args) {
            if ($scope.root.isWip && $scope.root.switchingTabs) {
                $scope.root.gotoToPricingTable();
            }
            $scope.setRowIdStyle(args.data.PRC_TBL_ROW);
            $scope.root.switchingTabs = false;
        });
    $scope.$on('addRowByTrackerNumber',
        function (event, args) {
            addRowByTrackerNumber(args);
        });

    function addRowByTrackerNumber(newRow) {// HACK: This function is needed for the $scope.$on to be able to access the pt $scope
        var spreadsheet = $("#pricingTableSpreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        newRow["PROGRAM_PAYMENT"] = root.curPricingTable["PROGRAM_PAYMENT"];
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

            sheet.range("A2:Z" + $scope.root.ptRowCount).verticalAlign("center");
            sheet.range("A2:Z" + $scope.root.ptRowCount).textAlign(cellStyle.textAlign);

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
                                disableRange(sheet.range(myColumnName + numRowsContainingData + ":" + myColumnName));
                            }
                        }
                    }

                    if (myFieldModel.field === "ORIG_ECAP_TRKR_NBR") {
                        // ecap tracker number
                        sheet.range(myColumnName + ":" + myColumnName).editor("ecapAdjTracker");
                    }
                    else if (myFieldModel.opLookupText === "DROP_DOWN" || myFieldModel.opLookupText === "dropdownName" || (myFieldModel.opLookupText === "CUST_DIV_NM" && isCorpDiv)) {
                        // Add validation dropdowns/multiselects onto the cells
                        applyDropDownsData(sheet, myFieldModel, myColumnName, dropdownValuesSheet);

                        if (myFieldModel.uiType === "RADIOBUTTONGROUP" || myFieldModel.uiType === "DROPDOWN") {
                            sheet.range(myColumnName + ":" + myColumnName).editor("dropdownEditor");
                            //applyDropDowns(sheet, myFieldModel, myColumnName);
                        } else if (myFieldModel.uiType === "EMBEDDEDMULTISELECT" || myFieldModel.uiType === "MULTISELECT") {
                            sheet.range(myColumnName + ":" + myColumnName).editor("multiSelectPopUpEditor");
                            vm.requiredStringColumns[key] = true;
                        }
                    } else {
                        // Add validations based on column type
                        switch (myFieldModel.type) {
                            case "date":
                                sheet.range(myColumnName + ":" + myColumnName).editor("datePickerEditor");
                                //sheet.range(myColumnName + ":" + myColumnName).format("MM/dd/yyyy");
                                vm.requiredStringColumns[key] = true;
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

                // total HACK here.  there must be a better way, but trying to POC options
                // pasting accross merged cells is not allowed, so need to bypass it
                if (!status.canPaste && !root.child.numTiers) {
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
                } else if (!!root.child.numTiers) {
                    this.customMergedPaste();
                    //range._adjustRowHeight();
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
            },
            customMergedPaste: function () {
                //
                // Modified paste for ONLY merged cells... VERY propiatary to
                //
                var row;
                var clip = this._clipboard;
                var state = clip._content;
                var sheet = clip.workbook.activeSheet();
                var newData = [];
                var padNumRows = 0;
                var nonMergedCols = [10, 11, 12, 13];

                // set paste data to Kendo cell (default Kendo code)
                var pasteRef = clip.pasteRef();

                if (clip.isExternal()) {
                    clip.origin = state.origRef;

                    // IDEA:
                    // Maybe get the clipboard data and modify it (pad by tier num) and allow the paste to continue
                    var numTiers = root.child.numTiers;
                    var colNum = pasteRef.topLeft.col;
                    if (nonMergedCols.indexOf(colNum) < 0) {
                        for (row = 0; row < state.data.length; row++) {
                            for (var t = 0; t < numTiers; t++) {
                                newData.push(util.deepClone(state.data[row]));
                            }
                            padNumRows += numTiers - 1;
                        }
                        state.data = newData;
                    }
                }

                // Non-default Kendo code for paste event
                for (row = 0; row < state.data.length; row++) {
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
            icon: "fa fa-check ssEditorBtn"
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
                ValidateProducts(data, false, currentRow + 1);
            }
            else { // open the selector
                var currentPricingTableRowData = context.range._sheet.dataSource._data[currentRow];
                var enableSplitProducts = context.range._sheet.dataSource._data.length <= context.range._ref.row;
                if (!!root.curPricingTable.NUM_OF_TIERS) {
                    enableSplitProducts = context.range._sheet.dataSource._data.length - parseInt(root.curPricingTable.NUM_OF_TIERS) <= context.range._ref.row;
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
                                startDate: pricingTableRow.START_DT, endDate: pricingTableRow.END_DT
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
                            return root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD;
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

    function ValidateProducts(currentPricingTableRowData, publishWipDeals, currentRowNumber) {
        var currentPricingTableRowData = currentPricingTableRowData.map(function (row, index) {
            return $.extend({}, row, { 'ROW_NUMBER': index + 1 });
        });

        currentPricingTableRowData = root.deNormalizeData(currentPricingTableRowData);

        // if row number is passed then its translation for single row
        if (!!currentRowNumber) {
            currentPricingTableRowData = currentPricingTableRowData.filter(function (x) {
                return x.ROW_NUMBER == currentRowNumber;
            });
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
        if (dealType == "VOL_TIER") {
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
        var invalidProductJSONRows = pricingTableRowData.filter(function (x) {
            return (x.PTR_SYS_INVLD_PRD != null && x.PTR_SYS_INVLD_PRD != "");
        })

        // Products that needs server side attention
        if (translationInputToSend.length > 0) {
            topbar.show();

            //Note: When changing the message here, also change the condition in $scope.saveEntireContractBase method in contract.controller.js
            root.setBusy("Validating your data...", "Please wait as we find your products!");
            productSelectorService.TranslateProducts(translationInputToSend, $scope.contractData.CUST_MBR_SID, dealType) //Once the database is fixed remove the hard coded geo_mbr_sid
                .then(function (response) {
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
        } else { // No products to validate, call the Validate and Save from contract manager
            if (!publishWipDeals) {
                root.validatePricingTable();
            } else {
                root.publishWipDealsBase();
            }
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
                var userInput = updateUserInput(transformResults.ValidProducts[key]);
                var contractProducts = userInput.contractProducts;
                data[r].PTR_USER_PRD = contractProducts;
                sourceData[r].PTR_USER_PRD = contractProducts;

                // VOL_TIER update exclude products
                if (root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD === "VOL_TIER") {
                    var excludeProducts = userInput.excludeProducts;
                    data[r].PRD_EXCLDS = excludeProducts;
                    sourceData[r].PRD_EXCLDS = excludeProducts;
                }
            }
        }
        root.spreadDs.sync();
        if (isAllValidated) {
            root.child.setRowIdStyle(data);
            // If current row is undefined its clicked from top bar validate button
            if (!currentRow) {
                if (!publishWipDeals) {
                    root.validatePricingTable(true);
                } else {
                    root.publishWipDealsBase();
                } // Call Save and Validate API from Contract Manager
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
                    return angular.copy(root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD);
                }
            }
        });
        modal.result.then(
            function (transformResult) {
                $timeout(function () {
                    var data = root.spreadDs.data();
                    var sourceData = root.pricingTableData.PRC_TBL_ROW;
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
                                var products = updateUserInputFromCorrector(transformResult.ValidProducts[key], transformResult.AutoValidatedProducts[key]);
                                data[r].PTR_USER_PRD = products.contractProducts;
                                sourceData[r].PTR_USER_PRD = products.contractProducts;

                                // VOL_TIER update exclude products
                                if (root.pricingTableData.PRC_TBL[0].OBJ_SET_TYPE_CD === "VOL_TIER") {
                                    data[r].PRD_EXCLDS = products.excludeProducts;
                                    sourceData[r].PRD_EXCLDS = products.excludeProducts;
                                }

                                // For VOL_TIER update the merged cells
                                if (!!root.curPricingTable.NUM_OF_TIERS && (products.contractProducts === "" || !products.contractProducts)) {
                                    var mergedRowsws = parseInt(r) + parseInt(root.curPricingTable.NUM_OF_TIERS);
                                    for (var a = r; a < mergedRowsws ; a++) {
                                        data[a].DC_ID = null;
                                        sourceData[a].DC_ID = null;
                                        data[a].PTR_USER_PRD = "";
                                        sourceData[a].PTR_USER_PRD = "";
                                    }
                                } else {
                                    data[r].DC_ID = (products.contractProducts === "" || !products.contractProducts) ? null : data[r].DC_ID;
                                    sourceData[r].DC_ID = (products.contractProducts === "" || !products.contractProducts) ? null : sourceData[r].DC_ID;
                                }
                            }
                        }
                    }
                    deleteRowFromCorrector(data);
                    root.spreadDs.sync();
                    if (root.spreadDs.data().length === 0) {
                        root.setBusy("No Products Found", "Please add products.");
                        $timeout(function () {
                            root.setBusy("", "");
                        }, 2000);
                        return;
                    }
                    root.child.setRowIdStyle(data);
                    if (!currentRow) { // If current row is undefined its clicked from top bar validate button
                        if (!publishWipDeals) {
                            root.validatePricingTable();
                        } else {
                            root.publishWipDealsBase();
                        } // Call Save and Validate API from Contract Manager
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
            disableRange(sheet.range("D" + cnt + ":D" + (cnt + numToDel)));
            disableRange(sheet.range("F" + cnt + ":Z" + (cnt + numToDel)));
        }
    }

    function updateUserInput(validProducts) {
        if (!validProducts) {
            return "";
        }
        var input = { 'contractProducts': '', 'excludeProducts': '' };
        for (var prd in validProducts) {
            if (validProducts.hasOwnProperty(prd)) {
                var contractProducts = "";
                var excludeProducts = "";

                // Include products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE == false;
                });
                if (products.length !== 0) {
                    var contDerivedUserInput = $filter('unique')(products, 'HIER_VAL_NM');
                    if (products.length === 1 && contDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() == contDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        contractProducts = contDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        contractProducts = contDerivedUserInput[0].DERIVED_USR_INPUT;
                    }
                    if (contractProducts != "") {
                        input.contractProducts = input.contractProducts === "" ? contractProducts : input.contractProducts + "," + contractProducts;
                    }
                }

                // Exclude Products
                var products = validProducts[prd].filter(function (x) {
                    return x.EXCLUDE == true;
                });
                if (products.length !== 0) {
                    var exclDerivedUserInput = $filter('unique')(products, 'HIER_VAL_NM');
                    if (products.length === 1 && exclDerivedUserInput[0].DERIVED_USR_INPUT.trim().toLowerCase() == exclDerivedUserInput[0].HIER_NM_HASH.trim().toLowerCase()) {
                        excludeProducts = exclDerivedUserInput[0].HIER_VAL_NM;
                    } else {
                        excludeProducts = exclDerivedUserInput[0].DERIVED_USR_INPUT
                    }
                    if (excludeProducts != "") {
                        input.excludeProducts = input.excludeProducts === "" ? excludeProducts : input.excludeProducts + "," + excludeProducts;
                    }
                }
            }
        }
        return input;
    }

    function updateUserInputFromCorrector(validProducts, autoValidatedProducts) {
        if (!validProducts) {
            return "";
        }
        var products = { 'contractProducts': '', 'excludeProducts': '' };
        for (var prd in validProducts) {
            if (!!autoValidatedProducts && autoValidatedProducts.hasOwnProperty(prd)) {
                var autoTranslated = {};
                autoTranslated[prd] = autoValidatedProducts[prd];
                var updatedUserInput = updateUserInput(autoTranslated)

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
                products.contractProducts = getUserInput(products.contractProducts, validProducts[prd], "I");
                products.excludeProducts = getUserInput(products.excludeProducts, validProducts[prd], "E");
            }
        }
        return products;
    }

    function getFullNameOfProduct(item) {
        if (item.PRD_ATRB_SID > 7005) return item.HIER_VAL_NM;
        return (item.PRD_CAT_NM + " " + (item.BRND_NM === 'NA' ? "" : item.BRND_NM) + " " + (item.FMLY_NM === 'NA' ? "" : item.FMLY_NM)).trim();
    }

    function getUserInput(updatedUserInput, products, typeOfProduct) {
        var userInput = products.filter(function (x) {
            return x.EXCLUDE == (typeOfProduct == "E");
        });
        userInput = $filter('unique')(userInput, 'HIER_VAL_NM');
        userInput = userInput.map(function (elem) {
            return elem.HIER_VAL_NM;
        }).join(",");

        if (userInput !== "") {
            updatedUserInput = updatedUserInput === "" ? userInput : updatedUserInput + "," + userInput;
        }
        return updatedUserInput;
    }

    function validatePricingTableProducts() {
        var data = cleanupData(root.spreadDs.data());
        ValidateProducts(data, false);
    }

    function validateSavepublishWipDeals() {
        var data = cleanupData(root.spreadDs.data());
        ValidateProducts(data, true);
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

            var currRowData = root.pricingTableData.PRC_TBL_ROW[context.range._ref.row - 1]; // minus one to account for index

            // Get data to filter ECAP numbers against
            /////// TODO: exact start date, end date, geo, cust product
            var filterData = {
                'DEAL_STRT_DT': currRowData.START_DT,
                'DEAL_END_DT': currRowData.END_DT,
                'GEO_MBR_SID': currRowData.GEO_COMBINED,
                'CUST_MBR_SID': currRowData.CUST_MBR_SID,
                'PRD_MBR_SID': currRowData.PTR_USER_PRD
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
            'DEAL_STRT_DT': dataItem.START_DT,
            'DEAL_END_DT': dataItem.END_DT,
            'getAvailable': 'N',
            'priceCondition': priceCondition
        }];
    }

    function openCAPBreakOut(dataItem, priceCondition) {
        var productData = {
            'CUST_MBR_SID': $scope.contractData.CUST_MBR_SID,
            'PRD_MBR_SID': dataItem.PRODUCT_FILTER,
            'GEO_MBR_SID': getFormatedGeos(dataItem.GEO_COMBINED),
            'DEAL_STRT_DT': dataItem.START_DT,
            'DEAL_END_DT': dataItem.END_DT,
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