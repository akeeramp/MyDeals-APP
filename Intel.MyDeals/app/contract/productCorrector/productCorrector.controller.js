angular
    .module('app.admin')
    .controller('ProductCorrectorModalController', ProductCorrectorModalController);

ProductCorrectorModalController.$inject = ['$filter', '$scope', '$uibModalInstance', 'GetProductCorrectorData', 'ProductSelectorService', 'productCorrectorService', 'contractData', 'RowId', '$linq', '$timeout', 'logger'];

function ProductCorrectorModalController($filter, $scope, $uibModalInstance, GetProductCorrectorData, ProductSelectorService, productCorrectorService, contractData,RowId, $linq, $timeout, logger) {
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

    //Page number calculation and navigation 
    var generatePagination = function (e) {        
        var pageNumber = '';
        for (var key in GetProductCorrectorData.ProdctTransformResults) {
            vm.rows += 1;
        }

        if (vm.rows == 1) {
            vm.hideNavigation = true;
        }
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
                    var PROD_HIER_NM = ["DEAL_PRD_TYPE", "PRD_CAT_NM", "BRND_NM", "FMLY_NM", "PCSR_NBR", "DEAL_PRD_NM"]; // Product HIERARCHY 
                    var conflictLevel = ''; //Will hold the conflicting Level
                    var object = { "Row": "", "Items": [] }; //Multiple Match Key Value pair
                    object.Row = key;
                    object.Items = !!data.DuplicateProducts[key] ? data.DuplicateProducts[key] : "";

                    var isConflict = false;
                    for (var prod in object.Items) {
                        prod = prod.replace(new RegExp('/', 'g'), " ");
                        vm.productName = prod;
                        if (object.Items[prod].length > 0) {                            

                            vm.selectedDataSet = object.Items[prod];

                            result = checkNextLevelOfConflict();
                            if (result)
                                break;
                        }
                    }                    
                }
                // Process invalid product(s) to make html to display
                else if (!!data.InValidProducts[key]) {
                    vm.invalidProducts = [];
                    vm.opMode = 'I';
                    vm.isInvalidProduct = false;
                    vm.isMultipleProduct = true;
                    vm.productName = data.InValidProducts[vm.currentRow]["0"];                    
                    for (var j = 0; j < data.InValidProducts[vm.currentRow].length; j++) {
                        vm.invalidProducts.push({ "USR_INPUT": data.InValidProducts[vm.currentRow][j] });
                    }
                    
                }
                // Checking for Valid Product(s)
                else if (data.ValidProducts[key].length > 0) {
                    vm.items = [];
                    var dataSelectedProd = GetProductCorrectorData.ValidProducts[vm.currentRow];
                    angular.forEach(dataSelectedProd, function (value, key) {
                        //Duplicate check                                
                        if (!$filter("where")(vm.addedProducts, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                            vm.addedProducts.push(value);
                        }
                    });
                }
            }
        }       
    }

    // Checking for Conflict up to FAMILY LEVEL
    function cehckingConflict(data, _selectionLevel) {
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
        }
        //Checking for conflict in Category Name i.e. DT OR Mb or etc                               
        if (_selectionLevel == 1) {
            isConflict = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.PRD_CAT_NM);
                            }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
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
        }
        //Checking for conflict in Brand Name i.e. ci3 or ci5, ci7 etc
        if (_selectionLevel == 2) {
            isConflict = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.BRND_NM);
                            }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
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
        }
        //Checking for conflict in Family Name i.e  Haswell, Kaby Lake, Skylake etc                         
        if (_selectionLevel == 3) {
            isConflict = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.FMLY_NM);
                            }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
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
                conflictLevel = "PCSR_NBR";                
            }
        }
        //Checking for conflict in Processor Number                                
        if (_selectionLevel == 4) {
            isConflict = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.PCSR_NBR);
                            }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.PCSR_NBR);
                            }).Select(function (x) {
                                return { 'PCSR_NBR': x.source[0].PCSR_NBR };
                            })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].PCSR_NBR });
                }
                conflictLevel = "PCSR_NBR";
                //break;
            }
        }
        //Checking for conflict in Product Number
        if (_selectionLevel == 5) {
            isConflict = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.DEAL_PRD_NM);
                            }).ToArray().length > 1;

            if (isConflict) {
                var dataS = $linq.Enumerable().From(data)
                            .GroupBy(function (x) {
                                return (x.DEAL_PRD_NM);
                            }).Select(function (x) {
                                return { 'DEAL_PRD_NM': x.source[0].DEAL_PRD_NM };
                            })
                    .ToArray();

                vm.items = []; // Reseting selected Items

                for (var i = 0; i < dataS.length; i++) {
                    vm.items.push({ 'name': dataS[i].DEAL_PRD_NM });
                }
                conflictLevel = "DEAL_PRD_NM";                
            }
        }
        return isConflict;
    }

    // Loop to drill down for Conflict up to FAMILY LEVEL
    function checkNextLevelOfConflict() {
        if (_selectionLevel > -1 && _selectionLevel < 4) {
            for (var cnt = _selectionLevel ; cnt < 5; cnt++) {
                var result = cehckingConflict(vm.selectedDataSet, _selectionLevel);
                _selectionLevel = cnt + 1;
                if (result) {
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
        var result = checkNextLevelOfConflict(); // Checking for conflict        

        if (result) {

        }
        else {
            var dataSelected = [];
            // Checking PRODUCT DEAL TYPE
            if (_selectionLevel == 1) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                                .Where(function (x) {
                                    return (x.DEAL_PRD_TYPE == item.name);
                                })
                        .ToArray();
            }
                // Checking PRODUCT CATEGORY NAME
            else if (_selectionLevel == 2) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                                .Where(function (x) {
                                    return (x.PRD_CAT_NM == item.name);
                                })
                        .ToArray();
            }
            // Checking BRAND NAME
            else if (_selectionLevel == 3) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                                                .Where(function (x) {
                                                    return (x.BRND_NM == item.name);
                                                })
                                        .ToArray();
            }
            // Checking FAMILY NAME
            else if (_selectionLevel == 4) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                                                .Where(function (x) {
                                                    return (x.FMLY_NM == item.name);
                                                })
                                        .ToArray();
            }
            // Checking PROCESSOR NUMBER
            else if (_selectionLevel == 5) {
                dataSelected = $linq.Enumerable().From(vm.selectedDataSet)
                                                .Where(function (x) {
                                                    return (x.PCSR_NBR == item.name);
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
                logger.success("Product added for " + dataSelected["0"].FMLY_NM);
            }
            else {
                logger.error("Can not insert duplicate product " + dataSelected["0"].FMLY_NM);
            }

        }

    }

    //Go to Next ROW for conflict or Invalid Product
    function nextRow() {
        if (vm.currentRow < vm.rows) {
            vm.currentRow += 1;
            vm.addedProducts = [];
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.currentRow == vm.rows) {
            vm.isNextDisabled = true;
        }
    }

    //Go to Previous ROW for conflict or Invalid Product
    function prevRow() {
        if (vm.currentRow > 1) {
            vm.currentRow -= 1;
            vm.addedProducts = [];
            _selectionLevel = 0;
            cookProducts();
        }
        if (vm.currentRow == 1) {
            vm.isPrevDisabled = true;
        }
    }

    //Add suggestion to the suggestion product
    function productSuggestion(item) {
        productCorrectorService.FindSuggestedProduct(item.USR_INPUT)
        .then(function (response) {
            angular.forEach(response.data, function (value, key) {
                if (!$filter("where")(vm.suggestedProduct, { PRD_MBR_SID: value.PRD_MBR_SID }).length > 0) {
                    vm.suggestedProduct.push(value);
                }
            });

        }, function (response) {
            logger.error("Unable to run Suggest Product 2.", response, response.statusText);
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
            for (var i = 0; i < vm.addedProducts.length; i++) {
                GetProductCorrectorData.ValidProducts[vm.currentRow][i] = vm.addedProducts[i];
            }

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
                delete GetProductCorrectorData.InValidProducts[vm.currentRow];
                vm.invalidProducts = [];
            }

            logger.success("Product added successfully");
            _selectionLevel = 0;
            cookProducts();
        }
        else {
            logger.error("Product ");
        }
        
    }
    
}