angular
    .module('app.contract')
    .controller('EndCustomerRetailCtrl', EndCustomerRetailCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

EndCustomerRetailCtrl.$inject = ['$scope', '$uibModalInstance', 'items', 'cellCurrValues', 'colName', 'country', 'dataService', 'PrimeCustomersService', '$uibModal', 'isAdmin'];

function EndCustomerRetailCtrl($scope, $uibModalInstance, items, cellCurrValues, colName, country, dataService, PrimeCustomersService, $uibModal, isAdmin) {
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
    $ctrl.embValidationMsg = 'Intel is currently unable to approve deals with the selected End Customer country. Please verify the agreement.';

    $ctrl.isEndCustomer = (colName === endCustomer);
    $ctrl.isEmptyList = false;

    //Get country details
    $scope.countries = PrimeCustomersService.getCountries().then(function (response) {
        $ctrl.countries = response.data;
    }, function (response) {
        logger.error("Unable to get Country details.", response, response.statusText);
    });

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


        var endCustomerOnly = $('#ComboBoxSelect').parent().find("input").val().trim();
        if (endCustomerOnly.toUpperCase() == "ANY" && isAdmin == true) {
            $ctrl.IsError = false;
            kendo.alert("Any can not be selected from Deal reconciliation screen.");
        }
        else if (endCustomerOnly != '' && endCustomerOnly != null && endCustomerOnly != undefined && !isEndCustomerSelected) {
            if (isPrimeCountrySelected && endCustomerOnly.toUpperCase() !== "ANY") {
                data.IS_PRIME = 0;
                data.PRIM_CUST_NM = "";
                data.PRIM_CUST_ID = null;
                data.PRIMED_CUST_CNTRY = countryVal;
                data.END_CUSTOMER_RETAIL = endCustomerOnly;
                //$ctrl.popupResult.ComboBoxSelect = "";
                //$ctrl.popupResult.DropdownSelections = "";
                $uibModalInstance.close(data);
            }
            else if (endCustomerOnly.toUpperCase() == "ANY") {
                data.IS_PRIME = 1;
                data.PRIM_CUST_NM = "ANY";
                data.PRIM_CUST_ID = null;
                data.PRIMED_CUST_CNTRY = countryVal;
                data.END_CUSTOMER_RETAIL = endCustomerOnly;
                $uibModalInstance.close(data);
            }
            else {
                $ctrl.IsError = true;
                $ctrl.msg = "Please select End Customer Country";
            }

        }
        else if (endCustVal.toUpperCase() !== "ANY" && isEndCustomerSelected && isPrimeCountrySelected) {
            if (isEndCustomerSelected && isPrimeCountrySelected) {
                var temp = new Array(endCustVal, countryVal);
                PrimeCustomersService.getEndCustomerData(temp).then(
                    function (res) {
                        var response = res.data[0];
                        validate(response);
                    },
                    function (res) {
                        logger.error("Unable to get Unified Customers.", response, response.statusText);
                    }
                );

                var validate = function (response) {

                    data.IS_PRIME = response.IS_PRIME;
                    data.PRIM_CUST_NM = response.PRIM_CUST_NM;
                    data.PRIM_CUST_ID = response.PRIM_CUST_ID;
                    if (data.IS_PRIME == 0) {
                        data.PRIM_CUST_ID = '';
                    }
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
        else if ((isEndCustomerSelected || endCustVal !== "") && !isPrimeCountrySelected && endCustVal.toUpperCase() !== "ANY") {
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
            if (endCustVal.toUpperCase() == "ANY") {
                data.IS_PRIME = 1;
                data.PRIM_CUST_NM = "ANY";
                data.PRIM_CUST_ID = null;
                data.PRIMED_CUST_CNTRY = countryVal;
                data.END_CUSTOMER_RETAIL = endCustVal;
                $uibModalInstance.close(data);
            }

        }

        //Embargo country validation alert.
        if ($scope.ovlapObjType == "PricingTable") {
            $ctrl.showEmbAlert($ctrl.embValidationMsg, $ctrl.popupResult.DropdownSelections, 'ok');
            return;
        }
    };


    $ctrl.showEmbAlert = function (validationMsg, country, type) {
        var countryVal = '';
        if ($ctrl.countries != null) {
            countryVal = $ctrl.countries.find(x => x.CTRY_NM == country);
            if (countryVal != null && countryVal.CTRY_XPORT_CTRL_CD == 'EC') {
                if (type == 'ok') {
                    kendo.alert(validationMsg);
                }
                else {
                    $ctrl.IsError = true;
                    $ctrl.msg = validationMsg;
                }
            }
        }
    }

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

            //Embargo country validation alert.
            if ($scope.ovlapObjType == "PricingTable") {
                $ctrl.showEmbAlert($ctrl.embValidationMsg, newValue, 'selection');
                return;
            }

            if (newValue !== null) {
                $ctrl.IsError = false;
                $ctrl.msg = "";
                return;
            }
        }, true);

}