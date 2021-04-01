angular
    .module('app.contract')
    .controller('EndCustomerRetailCtrl', EndCustomerRetailCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

EndCustomerRetailCtrl.$inject = ['$scope', '$uibModalInstance', 'items', 'cellCurrValues', 'colName', 'country', 'dataService', 'PrimeCustomersService', '$uibModal'];

function EndCustomerRetailCtrl($scope, $uibModalInstance, items, cellCurrValues, colName, country, dataService, PrimeCustomersService, $uibModal) {
    var $ctrl = this;
    $ctrl.IsError = false;
    var endCustomer = "END_CUSTOMER_RETAIL"
    var data = [];
    $ctrl.endCustomerRetailPopUpModal = items;
    $ctrl.popupResult = [];
    $ctrl.popupResult.ComboBoxSelect = (cellCurrValues.END_CUSTOMER_RETAIL === null) ? "" : cellCurrValues.END_CUSTOMER_RETAIL;
    $ctrl.popupResult.DropdownSelections = (country === null) ? "" : country;
    $ctrl.colName = colName;
    $ctrl.placeholderText = "Click to Select...";

    $ctrl.isEndCustomer = (colName === endCustomer);
    $ctrl.isEmptyList = false;

    $ctrl.ok = function () {
        var endCustVal = "";
        var countryVal = "";
        var isEndCustomerSelected = ($ctrl.popupResult.ComboBoxSelect == "" || $ctrl.popupResult.ComboBoxSelect == null || $ctrl.popupResult.ComboBoxSelect == undefined) ? false : true;
        var isPrimeCountrySelected = ($ctrl.popupResult.DropdownSelections == "" || $ctrl.popupResult.DropdownSelections == null || $ctrl.popupResult.DropdownSelections == undefined) ? false : true;
        if (isEndCustomerSelected) {
            endCustVal = $ctrl.popupResult.ComboBoxSelect
        }
        if (isPrimeCountrySelected) {
            countryVal = $ctrl.popupResult.DropdownSelections;
        }


        var endCustomerOnly = $('#ComboBoxSelect').parent().find("input").val();
        if (endCustomerOnly != '' && endCustomerOnly != null && endCustomerOnly != undefined && !isEndCustomerSelected) {
            if (isPrimeCountrySelected) {
                data.IS_PRIME = 0;
                data.PRIM_CUST_NM = "";
                data.PRIM_CUST_ID = null;
                data.PRIMED_CUST_CNTRY = countryVal;
                data.END_CUSTOMER_RETAIL = endCustomerOnly;
                //$ctrl.popupResult.ComboBoxSelect = "";
                //$ctrl.popupResult.DropdownSelections = "";
                $uibModalInstance.close(data);
            }
            else {
                $ctrl.IsError = true;
                $ctrl.msg = "Please select End Customer Country";
            }

        }
        else if (endCustVal !== "ANY" && isEndCustomerSelected && isPrimeCountrySelected) {
            if (isEndCustomerSelected && isPrimeCountrySelected) {
                var temp = new Array(endCustVal, countryVal);
                PrimeCustomersService.getEndCustomerData(temp).then(
                    function (res) {
                        var response = res.data[0];
                        validate(response);
                    },
                    function (res) {
                        logger.error("Unable to get Prime Customers.", response, response.statusText);
                    }
                );

                var validate = function (response) {

                    data.IS_PRIME = response.IS_PRIME;
                    data.PRIM_CUST_NM = response.PRIM_CUST_NM;
                    data.PRIM_CUST_ID = response.PRIM_CUST_ID;
                    data.PRIMED_CUST_CNTRY = countryVal;
                    data.END_CUSTOMER_RETAIL = endCustVal;
                    //if (data.IS_PRIME == 1) {
                    $uibModalInstance.close(data);
                    //}
                    //else {
                    //    $ctrl.IsError = true;
                    //    $ctrl.msg = "Please select valid Prime customer and country";
                    //}

                }

            }

        }
        else if ((isEndCustomerSelected || endCustVal !== "") && !isPrimeCountrySelected && endCustVal !== "ANY") {
            $ctrl.IsError = true;
            //if (!isEndCustomerSelected && !isPrimeCountrySelected)
            //    $ctrl.msg = "Please select valid Prime customer and country";
            //else if (!isEndCustomerSelected)
            //    $ctrl.msg = "Please select valid Prime customer";
            //else
            $ctrl.msg = "Please select End Customer Country";
        }
        else if (!isEndCustomerSelected && !isPrimeCountrySelected && (endCustomerOnly === null || endCustomerOnly === "")) {

            $ctrl.IsError = true;

            $ctrl.msg = "Please select End customer/Retail and End customer country";
        }
        else if (!isEndCustomerSelected) {
            $ctrl.IsError = true;

            $ctrl.msg = "Please select End customer/Retail";
        }
        else {
            $ctrl.IsError = false;
            if (endCustVal == "ANY") {
                data.IS_PRIME = 1;
                data.PRIM_CUST_NM = "";
                data.PRIM_CUST_ID = null;
                data.PRIMED_CUST_CNTRY = countryVal;
                data.END_CUSTOMER_RETAIL = endCustVal;
                $uibModalInstance.close(data);
            }

        }

    };

    var primeddata = function (action) {
        data.IS_PRIME = 0;
        data.PRIM_CUST_NM = "";
        data.PRIM_CUST_ID = null;
        data.PRIMED_CUST_CNTRY = "";
        if (action == "remove") {
            data.END_CUSTOMER_RETAIL = "";
            $ctrl.popupResult.ComboBoxSelect = "";
        }
        else if (action == "unprime") {
            data.END_CUSTOMER_RETAIL = $ctrl.popupResult.ComboBoxSelect;
        }

        $ctrl.popupResult.DropdownSelections = "";
        return data;

    }

    $ctrl.remove = function () {
        if (cellCurrValues.END_CUSTOMER_RETAIL != null && cellCurrValues.END_CUSTOMER_RETAIL != '' && cellCurrValues.END_CUSTOMER_RETAIL != undefined) {
            var PrimeData = primeddata("remove")
            $uibModalInstance.close(PrimeData);
        }
        else {
            $ctrl.IsError = true;
            $ctrl.msg = "There is no End customer to remove";
        }
    };

    //$ctrl.unPrime = function () {
    //    if (cellCurrValues.IS_PRIME == 1) {
    //        var PrimeData = primeddata("remove")
    //        $uibModalInstance.close(PrimeData);
    //    }
    //    else {
    //        $ctrl.IsError = true;
    //        $ctrl.msg = "This Deal is Not a Primed Deal";
    //    }
    //}


    $ctrl.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $ctrl.EnterPressed = function (event) {
        if (event.keyCode === 13) {
            $ctrl.ok();
        }
    };

    $scope.$watch('$ctrl.popupResult.ComboBoxSelect',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue === undefined || newValue === undefined) return;

            if (newValue !== null) {
                $ctrl.IsError = false;
                $ctrl.msg = "";
                return;
            }
        }, true);
    $scope.$watch('$ctrl.popupResult.DropdownSelections',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue === undefined || newValue === undefined) return;

            if (newValue !== null) {
                $ctrl.IsError = false;
                $ctrl.msg = "";
                return;
            }
        }, true);

}