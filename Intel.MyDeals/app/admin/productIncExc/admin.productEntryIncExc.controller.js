(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ProductEntryIncExcController', ProductEntryIncExcController);

    ProductEntryIncExcController.$inject = ['$scope', 'dataService', 'productEntryIncExcService', 'logger', 'confirmationModal', 'gridConstants', '$linq', '$state'];

    function ProductEntryIncExcController($scope, dataService, productEntryIncExcService, logger, confirmationModal, gridConstants, $linq, $state) {
        var vm = this;
        vm.showGrid = false;
        var attributeMasterValues = '';
        var IncludeAttributeSelected ;
        var ExcludeAttributeSelected ;
        vm.setIncludeAttibute = setIncludeAttibute;
        vm.setExcludeAttibute = setExcludeAttibute;        

        var loadDDLValues = function (e) {
            productEntryIncExcService.FetchAttributeMaster()
                .then(
                    function (response) {
                        if (response.statusText == "OK") {                            
                            attributeMasterValues = response.data.IncExcAttributeMaster;
                            
                            $scope.selectedIds = response.data.ProductIncExcAttributeSelected[0].ATRB_SID_INC.split(',').map(function (item) {
                                return parseInt(item, 10);
                            });
                            $scope.selectedExcludeIds = response.data.ProductIncExcAttributeSelected[0].ATRB_SID_EXC.split(',').map(function (item) {
                                return parseInt(item, 10);
                            });
                            
                            loadDDL();
                        }
                    },
                    function (response) {
                        logger.error("Unable to get Product.", response, response.statusText);
                    }
                );                       
        };

        function setIncludeAttibute()
        {
            vm.userInput = [];
            var multiselect = $("#multiInculdeDropDown").data("kendoMultiSelect");
            var value = multiselect.value();

            $.each(value, function (i, line) {
                vm.ProductIncExcObj = {                    
                    ATTR_VAL: ""
                };
                
                vm.ProductIncExcObj.ATTR_VAL = line;
                vm.userInput.push(vm.ProductIncExcObj);
                
            });

            productEntryIncExcService.SetIncludeAttibute(vm.userInput)
                        .then(function (response) {
                            logger.success("Saved Successfully");
                        }, function (response) {
                            logger.error("Unable to Save Include", response, response.statusText);
                        });
            
        }

        function setExcludeAttibute() {
            vm.userInput = [];
            var multiselect = $("#multiExcludeDropDown").data("kendoMultiSelect");
            var value = multiselect.value();

            $.each(value, function (i, line) {
                vm.ProductIncExcObj = {
                    ATTR_VAL: ""
                };

                vm.ProductIncExcObj.ATTR_VAL = line;
                vm.userInput.push(vm.ProductIncExcObj);
            });

            productEntryIncExcService.SetExcludeAttibute(vm.userInput).then(function (response) {
                logger.success("Saved Successfully");
            }, function (response) {
                logger.error("Unable to get products.", response, response.statusText);
            });
        }
        loadDDLValues();

        function loadDDL() {
            $scope.selectOptions = {
                placeholder: "Select products...",
                dataTextField: "ATRB_DESC",
                dataValueField: "ATRB_SID",
                valuePrimitive: true,
                autoBind: false,
                dataSource: {
                    data: attributeMasterValues,
                }
            };
        }
     }
})();