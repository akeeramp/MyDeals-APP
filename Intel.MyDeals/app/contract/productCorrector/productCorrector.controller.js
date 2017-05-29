angular
    .module('app.admin')
    .controller('ProductCorrectorModalController', ProductCorrectorModalController);

ProductCorrectorModalController.$inject = ['$filter', '$scope', '$uibModalInstance', 'GetProductCorrectorData', 'ProductSelectorService', 'productCorrectorService', 'contractData', 'RowId', '$linq', '$timeout', 'logger'];

function ProductCorrectorModalController($filter, $scope, $uibModalInstance, GetProductCorrectorData, ProductSelectorService, productCorrectorService, contractData, RowId, $linq, $timeout, logger) {
    var vm = this;
    vm.selectedPathParts = [];
    vm.invalidProducts = [];
    vm.suggestedProduct = [];
    vm.items = []; // This will have Different dimension where conflicts arises 
    vm.addedProducts = []; // This will hold the product added by the User without conflict
    vm.hideSelection = false; // This will determine when to show Invalid Product(s) and when to show Multiple
    vm.nextRow = nextRow; // This method will help to navigate to next Rows
    vm.prevRow = prevRow; // This method will help to navigate to previous Rows
    vm.clearProducts = clearProducts; // Clear all the selected Products
    vm.selectedDataSet = []; // Container for Selected Data
    //vm.selectionLevel = ''; // Hold current dimension Level
    vm.rows = 0; // will give number of ROW
    vm.currentRow = RowId; // Will Give current ROW Number.. This value is passed from the Parent page
    vm.isMultipleProduct = true; // Any Use Input having Multiple Product(s)
    vm.isInvalidProduct = true; // Any Use Input having Invalid Product(s)
    vm.isNextDisabled = false; // This will enable disable Next Navigation button
    vm.isPrevDisabled = false; // This will enable disable Previous Navigation button
    vm.productSuggestion = productSuggestion;
    vm.saveProducts = saveProducts; // This method actually moved Multiple or invalid product to the Valid products    
    vm.addProductSuggested = addProductSuggested; //Added Product from the Suggestion List
    vm.opMode = ''; // To determine its a Duplicate product Ops or InValid Product ops
    vm.hideNavigation = false; // This ill determine when to hide the navigation
    var isConflict = false;
    var _selectionLevel = 0;
    vm.productName = '';
    var _lastConflictedState = 0;
    var lastConflictedColumn = '';
    var pageNumber = [];
    vm.rowNumber = 1;
    vm.resetAddedList = 1;
    //Page number calculation and navigation 
    var generatePagination = function (e) {
        pageNumber = [];
        for (var key in GetProductCorrectorData.ProdctTransformResults) {
            if (!!GetProductCorrectorData.DuplicateProducts[key]) {
                if (pageNumber.indexOf(key) == -1) {
                    pageNumber.push(key);
                }
            }
            if (!!GetProductCorrectorData.InValidProducts[key]) {
                if (GetProductCorrectorData.InValidProducts[key].length > 0) {
                    if (pageNumber.indexOf(key) == -1) {
                        pageNumber.push(key);
                    }
                }
            }
        }

        if (pageNumber.length > 0) {
            vm.rows = pageNumber.length;
            if (pageNumber.length != 1) {
                vm.currentRow = pageNumber[vm.rowNumber - 1];
            }
            else {
                vm.currentRow = pageNumber[0];
            }

        }

        if (vm.rows <= 1) {
            vm.hideNavigation = true;
        }
    }

    // Invalid Product Grid/////
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.invalidProducts);
            },
            update: function (e) {

            },
            destroy: function (e) {

            },
            create: function (e) {

            }
        },
        schema: {
            model: {
                fields: {
                    USR_INPUT: {}
                }
            }
        },
        pageSize: 5,
        serverPaging: true,
        serverSorting: true
    });
    vm.handleChange = function (data, dataItem, columns) {
        productSuggestion(dataItem);
    };
    vm.gridOptions = {
        dataSource: dataSource,
        filterable: false,
        sortable: false,
        selectable: "row",
        resizable: false,
        groupable: false,
        columnMenu: false,
        scrollable: false,
        editable: false,
        pageable: false,
        dataBound: function (e) {
            e.sender.select("tr:eq(1)");
        },
        columns: [
            { field: "USR_INPUT", template: "#= USR_INPUT #", title: "User Entered Prduct", width: "200px" },
        ]
    };


    // Suggested Product Grid
    // Invalid Product Grid/////
    var dataSourceSuggested = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.suggestedProduct);
            },
            update: function (e) {

            },
            destroy: function (e) {

            },
            create: function (e) {

            }
        },
        schema: {
            model: {
                fields: {
                    PRD_MBR_SID: {},
                    DEAL_PRD_NM: {},
                    MM_CUST_CUSTOMER: {}
                }
            }
        },
        pageSize: 5,
        serverPaging: true,
        serverSorting: true
    });
    vm.addChange = function (data, dataItem, columns) {
        addProductSuggested(dataItem);
    };
    vm.gridOptionsSuggested = {
        dataSource: dataSourceSuggested,
        filterable: false,
        sortable: false,
        selectable: "row",
        resizable: false,
        groupable: false,
        columnMenu: false,
        scrollable: false,
        editable: false,
        pageable: false,
        columns: [
            { field: "PRD_MBR_SID", template: " #= PRD_MBR_SID # ", title: "Product No", width: "200px" },
            { field: "DEAL_PRD_NM", title: "Product Name", width: "200px" },
            { field: "MM_CUST_CUSTOMER", title: "MM Customer", width: "200px" },
        ]
    };
    function addProducts() {

    }
    // Master Product(s) massaging
    var cookProducts = function (e) {
        var result = false;
        var data = GetProductCorrectorData;
        for (var key in data.ProdctTransformResults) {
            if (key == vm.currentRow) {
                // Process multiple match product(s) to make html to display
                if (!!data.DuplicateProducts[key]) {
                    vm.opMode = 'D';
                    vm.isInvalidProduct = true;;
                    vm.isMultipleProduct = false;
                    var object = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
                    object.Row = key;
                    object.Items = !!data.DuplicateProducts[key] ? data.DuplicateProducts[key] : "";

                    var isConflict = false;
                    for (var prod in object.Items) {
                        vm.productName = prod;
                        if (object.Items[prod].length > 0) {
                            vm.selectedDataSet = object.Items[prod];
                            var item = {
                                name: ""
                            };
                            result = checkNextLevelOfConflict();
                            if (result)
                                break;
                        }
                    }
                }
                // Process invalid product(s) to make html to display
                else if (!!data.InValidProducts[key] && data.InValidProducts[vm.currentRow].length > 0) {
                    vm.invalidProducts = [];
                    vm.opMode = 'I';
                    vm.isInvalidProduct = false;
                    vm.isMultipleProduct = true;
                    vm.productName = data.InValidProducts[vm.currentRow]["0"];
                    for (var j = 0; j < data.InValidProducts[vm.currentRow].length; j++) {
                        vm.invalidProducts.push({ "USR_INPUT": data.InValidProducts[vm.currentRow][j] });
                    }
                    dataSource.read();
                }
                // Checking for Valid Product(s)
                else if (!!data.ValidProducts[key]) {
                    vm.items = [];
                    for (var a = 0; a < data.ProdctTransformResults[key].length; a++) {
                        var value = data.ProdctTransformResults[key][a];
                        if (!!data.ValidProducts[key][value]) {
                            for (var i = 0; i < data.ValidProducts[key][value].length; i++) {
                                data.ValidProducts[key][value][i]["ROW_NUMBER"] = key;
                                vm.addedProducts.push(data.ValidProducts[key][value][i]);
                            }
                        }
                    }
                }                
                if (!!data.ValidProducts[key]) {
                    includedListPopulation();
                }
            }
        }

        //productSuggestion(item);

    }
    //populating Valid product in Included list
    function includedListPopulation() {
        vm.addedProducts = [];
        var data = GetProductCorrectorData;
        for (var key in data.ProdctTransformResults) {
            if (!!data.ValidProducts[key]) {
                for (var a = 0; a < data.ProdctTransformResults[key].length; a++) {
                    var value = data.ProdctTransformResults[key][a];
                    if (!!data.ValidProducts[key][value]) {
                        for (var i = 0; i < data.ValidProducts[key][value].length; i++) {
                            data.ValidProducts[key][value][i]["ROW_NUMBER"] = key;
                            vm.addedProducts.push(data.ValidProducts[key][value][i]);
                        }
                    }
                }
            }
        }
    }


    // Checking for Conflict up to FAMILY LEVEL
    function cehckingConflict(data, _selectionLevel, item) {
        // Checking for conflict in Deal Product Type i.e. CPU or EIA products
        if (_selectionLevel == 0) {
            isConflict = $linq.Enumerable().From(data)
                .GroupBy(function (x) {
                    return (x.DEAL_PRD_TYPE);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .GroupBy(function (x) {
                        return (x.DEAL_PRD_TYPE);
                    }).Select(function (x) {
                        return { 'DEAL_PRD_TYPE': x.source[0].DEAL_PRD_TYPE };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].DEAL_PRD_TYPE });
                }
                conflictLevel = "DEAL_PRD_TYPE";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .GroupBy(function (x) {
                        return (x.DEAL_PRD_TYPE);
                    }).Select(function (x) {
                        return { 'DEAL_PRD_TYPE': x.source[0].DEAL_PRD_TYPE };
                    })
                    .ToArray();

                if (dataS.length > 0) {
                    item.name = dataS[0].DEAL_PRD_TYPE;
                }
            }
        }
        //Checking for conflict in Category Name i.e. DT OR Mb or etc                               
        if (_selectionLevel == 1) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.DEAL_PRD_TYPE == item.name);
                })
                .GroupBy(function (x) {
                    return (x.PRD_CAT_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.DEAL_PRD_TYPE == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.PRD_CAT_NM);
                    }).Select(function (x) {
                        return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].PRD_CAT_NM });
                }
                conflictLevel = "PRD_CAT_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.DEAL_PRD_TYPE == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.PRD_CAT_NM);
                    }).Select(function (x) {
                        return { 'PRD_CAT_NM': x.source[0].PRD_CAT_NM };
                    })
                    .ToArray();

                if (dataS.length > 0) {
                    item.name = dataS[0].PRD_CAT_NM;
                }
            }
        }
        //Checking for conflict in Brand Name i.e. ci3 or ci5, ci7 etc
        if (_selectionLevel == 2) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.PRD_CAT_NM == item.name);
                })
                .GroupBy(function (x) {
                    return (x.BRND_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.PRD_CAT_NM == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.BRND_NM);
                    }).Select(function (x) {
                        return { 'BRND_NM': x.source[0].BRND_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].BRND_NM });
                }
                conflictLevel = "BRND_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.PRD_CAT_NM == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.BRND_NM);
                    }).Select(function (x) {
                        return { 'BRND_NM': x.source[0].BRND_NM };
                    })
                    .ToArray();

                if (dataS.length > 0) {
                    item.name = dataS[0].BRND_NM;
                }
            }
        }
        //Checking for conflict in Family Name i.e  Haswell, Kaby Lake, Skylake etc                         
        if (_selectionLevel == 3) {
            isConflict = $linq.Enumerable().From(data)
                .Where(function (x) {
                    return (x.BRND_NM == item.name);
                })
                .GroupBy(function (x) {
                    return (x.FMLY_NM);
                }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.BRND_NM == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.FMLY_NM);
                    }).Select(function (x) {
                        return { 'FMLY_NM': x.source[0].FMLY_NM };
                    })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].FMLY_NM });
                }
                conflictLevel = "FMLY_NM";
            }
            else {
                var dataS = $linq.Enumerable().From(data)
                    .Where(function (x) {
                        return (x.BRND_NM == item.name);
                    })
                    .GroupBy(function (x) {
                        return (x.FMLY_NM);
                    }).Select(function (x) {
                        return { 'FMLY_NM': x.source[0].FMLY_NM };
                    })
                    .ToArray();
                if (dataS.length > 0) {
                    item.name = dataS[0].FMLY_NM;
                }
            }
        }

        return isConflict;
    }

    // Loop to drill down for Conflict up to FAMILY LEVEL
    function checkNextLevelOfConflict(item) {
        if (_selectionLevel > -1 && _selectionLevel < 4) {
            for (var cnt = _selectionLevel; cnt < 4; cnt++) {
                if (!item) {
                    item = { name: "" };
                }
                var result = cehckingConflict(vm.selectedDataSet, _selectionLevel, item);
                _selectionLevel = cnt + 1;
                if (result) {
                    _lastConflictedState = _selectionLevel;
                    return result;
                }
            }
        }
        return result = false;
    }

    //Calling for generating number of Rows
    generatePagination();

    //Master Product Data massaging
    cookProducts();

    // Click on Selected ITEM. Check Next Conflict or Show Product
    vm.selectsearchItem = function (item) {
        var data = GetProductCorrectorData; // assigning data to a local copy
        lastConflictedColumn = item.name;

        var result = checkNextLevelOfConflict(item); // Checking for conflict       

        if (result) {

        }
        else {
            var dataSelected = [];
            // Checking PRODUCT DEAL TYPE
            if (_lastConflictedState == 1) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                    .Where(function (x) {
                        return (x.DEAL_PRD_TYPE == lastConflictedColumn);
                    })
                    .ToArray();
            }
            // Checking PRODUCT CATEGORY NAME
            else if (_lastConflictedState == 2) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                    .Where(function (x) {
                        return (x.PRD_CAT_NM == lastConflictedColumn);
                    })
                    .ToArray();
            }
            // Checking BRAND NAME
            else if (_lastConflictedState == 3) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                    .Where(function (x) {
                        return (x.BRND_NM == lastConflictedColumn);
                    })
                    .ToArray();
            }
            // Checking FAMILY NAME
            else if (_lastConflictedState == 4) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                    .Where(function (x) {
                        return (x.FMLY_NM == lastConflictedColumn);
                    })
                    .ToArray();
            }
            // Checking PROCESSOR NUMBER
            else if (_lastConflictedState == 5) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                    .Where(function (x) {
                        return (x.PCSR_NBR == lastConflictedColumn);
                    })
                    .ToArray();
            }
            var flag = 0;

            // Adding Products to the Selected List
            angular.forEach(dataSelected, function (value, key) {
                //Duplicate check                                
                if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                    vm.addedProducts.push(value);

                    if (!flag)
                        flag = 1;
                }
            });

            if (flag == 1) {
                saveProducts();
                logger.success("Product added for " + dataSelected["0"].FMLY_NM);
            }
            else {                
                logger.error("Can not insert duplicate product " + dataSelected["0"].FMLY_NM);
            }

        }

    }

    //Go to Next ROW for conflict or Invalid Product
    function nextRow() {
        if (vm.rowNumber < vm.rows) {
            vm.rowNumber = +vm.rowNumber + 1;
            vm.currentRow = pageNumber[vm.rowNumber - 1];
            vm.addedProducts = [];
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.rowNumber == vm.rows) {
            vm.isNextDisabled = true;
        }
    }

    //Go to Previous ROW for conflict or Invalid Product
    function prevRow() {
        if (vm.rowNumber > 1) {
            vm.rowNumber = vm.rowNumber - 1;
            vm.currentRow = +pageNumber[vm.rowNumber - 1];
            vm.addedProducts = [];
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.rowNumber == 1) {
            vm.isPrevDisabled = true;
        }
    }

    //Add suggestion to the suggestion product
    function productSuggestion(item) {
        productCorrectorService.FindSuggestedProduct(item.USR_INPUT)
            .then(function (response) {
                if (response.data.length > 1) {
                    vm.suggestedProduct = [];
                    angular.forEach(response.data, function (value, key) {
                        if (!$filter("where")(vm.suggestedProduct, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                            vm.suggestedProduct.push(value);
                        }
                    });
                    dataSourceSuggested.read();
                }
                else {
                    vm.suggestedProduct = [];
                    dataSourceSuggested.read();
                    logger.error("No suggestion found");
                }


            }, function (response) {
                logger.error("Unable to run Suggest Product", response, response.statusText);
            });
    }

    // Add selected Products from the Product Suggestion
    function addProductSuggested(item) {
        if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: item.PRD_MBR_SID }).length > 0) {
            vm.addedProducts.push(item);
        }
        // TODO: DELETE the Invalid product and add to Valid Logic
    }
    // Clear all the selected Product from the Selected BOX
    function clearProducts() {
        vm.addedProducts = [];
    }

    // Dismiss the Modal popup by clicking Cancel button
    vm.cancel = function () {
        //$uibModalInstance.dismiss();
        $uibModalInstance.close(GetProductCorrectorData);
        //$scope.$emit('GetProductCorrectorData', GetProductCorrectorData);
    }

    // Save Selected product(s) for the Row
    function saveProducts() {
        if (vm.addedProducts.length > 0) {
            var validObject = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
            for (var s = 0; s < vm.addedProducts.length; s++) {
                vm.addedProducts[s]["ROW_NUMBER"] = vm.currentRow;
            }
            var selectedInput = $linq.Enumerable().From(vm.addedProducts)
                .GroupBy(function (x) {
                    return (x.USR_INPUT);
                }).Select(function (x) {
                    return { 'USR_INPUT': x.source[0].USR_INPUT };
                }).ToArray();
            var obj = {};
            for (var m = 0; m < selectedInput.length; m++) {
                var products = $linq.Enumerable().From(vm.addedProducts)
                    .Where(function (x) {
                        return (x.USR_INPUT == selectedInput[m].USR_INPUT);
                    })
                    .ToArray();
                const prodName = selectedInput[m].USR_INPUT;

                obj[prodName] = products;

            }
            GetProductCorrectorData.ValidProducts[vm.currentRow] = obj;

            if (vm.opMode == 'D') {
                // Deleting User input from the Particular Row
                delete GetProductCorrectorData.DuplicateProducts[vm.currentRow][vm.productName];

                // Deleting Complete Row fromDuplicate Product
                var flag = 0;
                var object = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
                object.Row = vm.currentRow;
                object.Items = !!GetProductCorrectorData.DuplicateProducts[vm.currentRow] ? GetProductCorrectorData.DuplicateProducts[vm.currentRow] : "";
                for (var prod in object.Items) {
                    flag = 1;
                }
                if (flag == 0)
                    delete GetProductCorrectorData.DuplicateProducts[vm.currentRow];
            }
            else {
                var dataSelected = $linq.Enumerable().From(vm.addedProducts)
                    .GroupBy(function (x) {
                        return (x.USR_INPUT);
                    }).Select(function (x) {
                        return { 'USR_INPUT': x.source[0].USR_INPUT };
                    }).ToArray();

                for (var j = 0; j < GetProductCorrectorData.InValidProducts[vm.currentRow].length; j++) {
                    for (var z = 0; z < dataSelected.length; z++) {
                        if (GetProductCorrectorData.InValidProducts[vm.currentRow][j] == dataSelected[z].USR_INPUT) {
                            GetProductCorrectorData.InValidProducts[vm.currentRow].splice(j, 1);
                        }
                    }
                }
                if (GetProductCorrectorData.InValidProducts[vm.currentRow].length == 0) {
                    vm.invalidProducts = [];
                }
                else {

                }
            }

            logger.success("Product added successfully");
            _selectionLevel = 0;
            generatePagination();

            //Added List reset logic
            for (var p = 0; p < pageNumber.length; p++) {
                if (pageNumber[p] == vm.currentRow) {
                    vm.resetAddedList = 0;
                    break;
                }
            }

            if (vm.resetAddedList == 1) {
                vm.addedProducts = [];
            }

            if ((pageNumber.length + 1) == vm.rowNumber || (pageNumber.length == 1)) {
                vm.rowNumber = 1;
            }
            if (pageNumber.length != 0) {
                cookProducts();
            }
            else {
                vm.cancel();
            }

        }
        else {
            logger.error("No product selected");
        }

    }



}