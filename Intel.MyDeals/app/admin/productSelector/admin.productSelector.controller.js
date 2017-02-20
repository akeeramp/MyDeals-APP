(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductSelectorController', ProductSelectorController);

    ProductSelectorController.$inject = ['$scope', 'dataService', 'ProductSelectorService', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$state'];

    function ProductSelectorController($scope, dataService, ProductSelectorService, logger, confirmationModal, gridConstants, $linq, $state) {
        var vm = this;
        vm.showGrid = false;

        vm.userInpput = [];
        vm.products = "";// e.g. i7-4770(S/T), 430, 123, 111
        vm.invalidProducts = "";
        vm.multipleMatchProducts = "";
        vm.makeHierarchy = makeHierarchy;
        vm.translateProducts = translateProducts;
        vm.addToMydealProducts = addToMydealProducts;

        function translateProducts() {
            vm.userInpput.length = 0;
            vm.userInpput.push(vm.products);
            ProductSelectorService.TranslateProducts(vm.userInpput).then(function (response) {
                vm.showGrid = true;
                cookProducts(response.data);
            }, function (response) {
                logger.error("Unable to get products.", response, response.statusText);
            });
        }

        // Create a observable array so that any data push will refresh the grid
        vm.dataSource = new kendo.data.ObservableArray([]);

        vm.gridOptions = {
            dataSource: vm.dataSource,
            sortable: true,
            selectable: true,
            resizable: true,
            scrollable: true,
            filterable: true,
            columnMenu: true,
            pageable: {
                pageSize: 25
            },
            columns: [
            {
                field: "PRD_MBR_SID",
                title: "Id",
            },
            {
                field: "HIER_VAL_NM",
                title: "Name",
            },
            {
                field: "PRD_CAT_NM",
                title: "Category",
            },
            {
                field: "BRND_NM",
                title: "Brand",
            },
            {
                field: "FMLY_NM",
                title: "Family",
            },
            {
                field: "PCSR_NBR",
                title: "Processor #",
            },
            {
                field: "DEAL_PRD_NM",
                title: "Deal Product",
            },
            {
                field: "SKU_NM",
                title: "SKU Name",
            }]
        }

        function cookProducts(data) {
            for (var key in data.ProdctTransformResults) {
                // Make observable array empty
                vm.dataSource.splice(0, vm.dataSource.length);
                for (var i = 0; i < data.ValidProducts[key].length ; i++) {
                    vm.dataSource.push(data.ValidProducts[key][i]);
                }
                vm.invalidProducts = data.InValidProducts[key].join(", ")
                vm.multipleMatchProducts = !!data.DuplicateProducts[key] ? data.DuplicateProducts[key] : "";
            }
        }

        // Build the Hierarchy
        function makeHierarchy(productHierarchy) {
            var ph = productHierarchy.PRD_CAT_NM;
            if (productHierarchy.BRND_NM !== "") ph += " / " + productHierarchy.BRND_NM;
            if (productHierarchy.FMLY_NM !== "") ph += " / " + productHierarchy.FMLY_NM;
            if (productHierarchy.PCSR_NBR !== "") ph += " / " + productHierarchy.PCSR_NBR;
            if (productHierarchy.DEAL_PRD_NM !== "") ph += " / " + productHierarchy.DEAL_PRD_NM;
            return ph;
        }

        // Add to my deals products from multiple match bucket
        function addToMydealProducts(p) {
            //  linq less number lines
            var productExists = $linq.Enumerable().From(vm.dataSource)
                .Where(function (x) {
                    return x.PRD_MBR_SID == p.PRD_MBR_SID;
                })
                .ToArray().length > 0;

            if (productExists) {
                logger.error("Product already exists.", "", "Not allowed");
            } else {
                vm.dataSource.push(p);
            }
        }

        vm.gotoAddAlias = function () {
            $state.go('admin.productAlias');
        }
    }
})();