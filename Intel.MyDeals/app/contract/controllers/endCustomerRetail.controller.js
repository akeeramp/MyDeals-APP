angular
    .module('app.contract')
    .controller('EndCustomerRetailCtrl', EndCustomerRetailCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

EndCustomerRetailCtrl.$inject = ['$scope', '$uibModalInstance', 'items', 'cellCurrValues', 'colName', 'country', 'dataService', 'PrimeCustomersService', '$uibModal', 'dealId', 'isAdmin','logger'];

function EndCustomerRetailCtrl($scope, $uibModalInstance, items, cellCurrValues, colName, country, dataService, PrimeCustomersService, $uibModal, dealId, isAdmin, logger) {
    var $ctrl = this;
    $ctrl.IsError = false;
    $ctrl.ChangeErrorFlag = false;
    $ctrl.endCustomerValues = []
    $ctrl.countryValues = []
    $ctrl.validateFlag = true;
    $ctrl.ecOptionsFlag = true;
    $ctrl.spinnerMessageHeader = "Loading...";
    $ctrl.spinnerMessageDescription = "Loading the End Customer/Retail information.";
    $ctrl.isBusyShowFunFact = true;
    var endCustomer = "END_CUSTOMER_RETAIL"
    var data = [];
    $ctrl.endCustomerRetailPopUpModal = items;
    $ctrl.END_CUST_OBJ = [
        {
            "END_CUSTOMER_RETAIL": "",
            "PRIMED_CUST_ID": "",
            "PRIMED_CUST_NM": "",
            "PRIMED_CUST_CNTRY": "",
            "IS_PRIMED_CUST": 0,
            "IS_EXCLUDE": 0,
            "IS_RPL": 0,
            "RPL_STS_CD":""
        }];
    if (cellCurrValues.END_CUST_OBJ !== "") {
        if (cellCurrValues.END_CUST_OBJ != undefined && cellCurrValues.END_CUST_OBJ != null) {
            cellCurrValues.END_CUST_OBJ = JSON.parse(cellCurrValues.END_CUST_OBJ)
            $ctrl.END_CUST_OBJ = (cellCurrValues.END_CUST_OBJ.length == 0) ? $ctrl.END_CUST_OBJ : cellCurrValues.END_CUST_OBJ
        }
    }
    $ctrl.IsAny = false;
    $ctrl.IsAny = $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != null && $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != undefined && $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL.toUpperCase() == 'ANY';
    $ctrl.colName = colName;
    $ctrl.embValidationMsg = 'Intel is currently unable to approve deals with the selected End Customer country. Please verify the agreement.';

    $ctrl.isEndCustomer = (colName === endCustomer);
    $ctrl.isEmptyList = false;
    //call to get End customer details
    $scope.endCustOptions = PrimeCustomersService.getPrimeCustomers().then(function (response) {
        $ctrl.endCustOptions = response.data;
        $ctrl.ecOptionsFlag = false;
        $ctrl.endCustOptionswithOutAny = response.data.filter(x => x.Value.toUpperCase() !== "ANY");


    }, function (response) {
        logger.error("Unable to get endCustomer details.", response, response.statusText);
    });

    //Get country details
    $scope.countries = PrimeCustomersService.getCountries().then(function (response) {
        $ctrl.countries = response.data;
    }, function (response) {
        logger.error("Unable to get Country details.", response, response.statusText);
    });


    $scope.addRow = function (e) {
        $ctrl.validateFlag = true;
        var index = $ctrl.END_CUST_OBJ.indexOf(e);

        if (index > -1) {
            $ctrl.END_CUST_OBJ.splice(index + 1, 0,
                {
                    "END_CUSTOMER_RETAIL": "",
                    "PRIMED_CUST_ID": "",
                    "PRIMED_CUST_NM": "",
                    "PRIMED_CUST_CNTRY": "",
                    "IS_PRIMED_CUST": 0,
                    "IS_EXCLUDE": 0,
                    "IS_RPL": 0,
                    "RPL_STS_CD": ""
                });
        }
    }

    $scope.removeRow = function (e) {
       $ctrl.validateFlag = true;
        if ($ctrl.END_CUST_OBJ.length === 1) {
            $ctrl.END_CUST_OBJ[0] = {
                "END_CUSTOMER_RETAIL": "",
                "PRIMED_CUST_ID": "",
                "PRIMED_CUST_NM": "",
                "PRIMED_CUST_CNTRY": "",
                "IS_PRIMED_CUST": 0,
                "IS_EXCLUDE": 0,
                "IS_RPL": 0,
                "RPL_STS_CD": ""
            }
            return;
        }
        var index = $ctrl.END_CUST_OBJ.indexOf(e);
        if (index > -1) {
            $ctrl.END_CUST_OBJ.splice(index, 1);
        }
    }      

    //on click on validate in pop up-to check for the errors in the selected data
    $ctrl.ok = function () {
        $ctrl.spinnerMessageHeader = "Validating...";
        $ctrl.spinnerMessageDescription = "Validating the End Customer/Retail information.";
        $ctrl.IsError = false;
        var ecValues = $ctrl.END_CUST_OBJ.map(getEndcustvalues)

        function getEndcustvalues(item) {
            return [item.END_CUSTOMER_RETAIL].join(",");
        }
        //endCustVal = ecValues;
        var ctryValues = $ctrl.END_CUST_OBJ.map(getCtryvalues)
        function getCtryvalues(item) {
            return [item.PRIMED_CUST_CNTRY].join(",");
        }
        //countryVal = ctryValues
        var patt = new RegExp("^[\\w .,:'\&-]*$");
        var isExclude = 0;
        $ctrl.endCustomerValues = ecValues
        $ctrl.countryValues = ctryValues
        // Check to find whether first combination End customer is "any" , TO set IS_EXCLUDE to true 
        if (ecValues.length > 1) {
            if (ecValues[0].toUpperCase() == "ANY") {
                isExclude = 1;                
            }
        }
        for (var i = 0; i < ecValues.length; i++) {
            var rowError = false;
            if (i > 0) {
                $ctrl.END_CUST_OBJ[i].IS_EXCLUDE = isExclude;
            }
            else {
                $ctrl.END_CUST_OBJ[i].IS_EXCLUDE = 0;
            }
            if (ecValues[i] == "" && ctryValues[i] == "") {
                $ctrl.IsError = true;
                rowError = true;
                $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "red");
                $("#ComboBoxSelect_" + i).parent().find("span").attr("title", "Please select End customer/Retail and End customer country")
                $("#DropdownSelections_" + i).parent().find("span").css("background-color", "red");
                $("#DropdownSelections_" + i).parent().find("span").attr("title", "Please select End customer/Retail and End customer country")
            }
            else if (ecValues[i] == "") {
                rowError = true;
                $ctrl.IsError = true;
                $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "red");
                $("#ComboBoxSelect_" + i).parent().find("span").attr("title", "Please select End customer/Retail")
            }

            else if (ctryValues[i] == "") {
                $ctrl.IsError = true;
                rowError = true;
                $("#DropdownSelections_" + i).parent().find("span").css("background-color", "red");
                $("#DropdownSelections_" + i).parent().find("span").attr("title", "Please select End customer country")
            }

            else {
                rowError = $scope.validateDuplicateEntry(i, ecValues[i], ctryValues[i])
            }

            //to check whether user entered End customer/retail value is valid or not
            var res = patt.test(ecValues[i]);

            var IsECSelected = ($ctrl.endCustOptions !== undefined && $ctrl.endCustOptions !== null) ? ($ctrl.endCustOptions.find(x => x.Value === ecValues[i])) : undefined;

            if (!res && IsECSelected === undefined) {
                $ctrl.IsError = true;
                rowError = true;
                $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "red");
                $("#ComboBoxSelect_" + i).parent().find("span").attr("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.")
            }

            if (ecValues[i].toUpperCase() == "ANY" && isAdmin == true) {
                $ctrl.IsError = true;
                rowError = false;
                kendo.alert("Any can not be selected from Deal reconciliation screen.");
            }
            else if (ecValues[i].toUpperCase() == "ANY") {
               if (i > 0) {
                  $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "red");
                  $("#ComboBoxSelect_" + i).parent().find("span").attr("title", "Any can be selected only in the First combination")
                   $ctrl.IsError = true;
                   rowError = true;
               }
            }
            if (!rowError) {
                $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "white");
                $("#ComboBoxSelect_" + i).parent().find("span").removeAttr("title")
                $("#DropdownSelections_" + i).parent().find("span").css("background-color", "white");
                $("#DropdownSelections_" + i).parent().find("span").removeAttr("title")
            }
        }

        angular.forEach(ctryValues, (item,i) => {
            //Embargo country validation alert.
                embCtry = $ctrl.showEmbAlert($ctrl.embValidationMsg, item, 'ok');
                if (embCtry) {
                    $ctrl.IsError = true;
                    rowError = true;
                    $("#DropdownSelections_" + i).parent().find("span").css("background-color", "red");
                    $("#DropdownSelections_" + i).parent().find("span").attr("title", $ctrl.embValidationMsg)
                }
        });
        
        if (!$ctrl.IsError) {
            PrimeCustomersService.validateEndCustomer(JSON.stringify(angular.toJson($ctrl.END_CUST_OBJ))).then(
                function (res) {
                    $ctrl.END_CUST_OBJ = res.data;
                    $ctrl.validateFlag = false;
                },
                function (res) {
                    logger.error("Unable to get Unified Customers.", response, response.statusText);
                }
            );
        }

    }

    $scope.validateDuplicateEntry = function (i, ecVal, ctryVal) {
        var duplicateIndex = 0;
        var rowError = false;
        angular.forEach($ctrl.END_CUST_OBJ, (item) => {
            if (i != duplicateIndex && item.END_CUSTOMER_RETAIL.toUpperCase() == ecVal.toUpperCase() && item.PRIMED_CUST_CNTRY == ctryVal) {
                $ctrl.IsError = true;
                $ctrl.validateFlag = true;
                rowError = true;
                $("#ComboBoxSelect_" + duplicateIndex).parent().find("span").css("background-color", "red");
                $("#ComboBoxSelect_" + duplicateIndex).parent().find("span").attr("title", "End Customer/Retail and End Customer Country Combination must be unique")
                $("#DropdownSelections_" + duplicateIndex).parent().find("span").css("background-color", "red");
                $("#DropdownSelections_" + duplicateIndex).parent().find("span").attr("title", "End Customer/Retail and End Customer Country Combination must be unique")
                $("#ComboBoxSelect_" + i).parent().find("span").css("background-color", "red");
                $("#ComboBoxSelect_" + i).parent().find("span").attr("title", "End Customer/Retail and End Customer Country Combination must be unique")
                $("#DropdownSelections_" + i).parent().find("span").css("background-color", "red");
                $("#DropdownSelections_" + i).parent().find("span").attr("title", "End Customer/Retail and End Customer Country Combination must be unique")
            }
            duplicateIndex++;
        });
        return rowError;
    }

    $ctrl.saveEndcustomerData = function () {
        if ($ctrl.IsError == false && $ctrl.END_CUST_OBJ.length !== 0) {
            // to set unprimed combinations as n/a(not applicable)
            var primeNotApplicable = 'n/a';
            data.PRIMED_CUST_NM = $ctrl.END_CUST_OBJ.map(getPrimeCustNames).join();
            function getPrimeCustNames(item) {
                if (item.IS_PRIMED_CUST == "0") {
                    return [primeNotApplicable].join(",");
                }
                else
                    return [item.PRIMED_CUST_NM].join(",")
            }
            data.IS_PRIME = $ctrl.END_CUST_OBJ.filter(x => x.IS_PRIMED_CUST == 0).length > 0 ? 0 : 1;
            //RPL status of Excluded End Customer should not be Considered in determining the deal level IS_RPL attribute
            data.IS_RPL = $ctrl.END_CUST_OBJ.filter(x => x.IS_RPL == 1 && x.IS_EXCLUDE != "1").length > 0 ? 1 : 0;

            // setting PRIMED_CUST_ID to n/a to all the combinations except for any(as for End customer "any" PRIMED_CUST_ID is null)
            var primeCustObjWithoutAny = $ctrl.END_CUST_OBJ.filter(x => x.PRIMED_CUST_NM.toUpperCase() != "ANY")
            var ecIdList = primeCustObjWithoutAny.map(getPrimeCustIds);

            function getPrimeCustIds(item) {
                if (item.IS_PRIMED_CUST == "0") {
                    return [primeNotApplicable].join(",");
                }
                else
                    return [item.PRIMED_CUST_ID].join(",");
            }
            data.PRIMED_CUST_ID = ecIdList.join();
            data.PRIMED_CUST_CNTRY = $ctrl.countryValues.join();
            data.END_CUSTOMER_RETAIL = $ctrl.endCustomerValues.join();
            data.END_CUST_OBJ = angular.toJson($ctrl.END_CUST_OBJ);
            $uibModalInstance.close(data);
        }
    }
     // Commenting below lines of code to disable the UCD Code changes
    //$ctrl.saveAndClose = function () {
    //    if ($ctrl.IsError == false && $ctrl.END_CUST_OBJ.length !== 0) {
    //        PrimeCustomersService.UnPrimeDealsLogs(dealId,JSON.stringify(angular.toJson($ctrl.END_CUST_OBJ.filter(x => x.PRIMED_CUST_NM.toUpperCase() != "ANY")))).then(
    //            function (response) {
                   
    //                if (response.data == "true") {
    //                    logger.success("Request successfully sent to UCD.");

    //                }
    //                else if (response.data == "false") {
    //                    logger.error("Unable to sent UCD request.", response, "Error");

    //                }
    //                else if (response.data == "Yes") {
    //                    //"Yes" indicates one of the end customer which is not present in our master table gone through the UCD approval flow and got Unified
    //                    //AS new record got unified in our table we need to re validate the selected End customer and save the End customer atrbs
    //                    PrimeCustomersService.validateEndCustomer(JSON.stringify(angular.toJson($ctrl.END_CUST_OBJ))).then(
    //                        function (res) {
    //                            $ctrl.END_CUST_OBJ = res.data;
    //                            //$ctrl.validateFlag = false;
    //                            $ctrl.saveEndcustomerData();
    //                            logger.success("Request successfully sent to UCD.");
    //                        },
    //                        function (res) {
    //                            //$ctrl.saveEndcustomerData();
    //                            logger.error("Unable to get Unified Customers.", response, response.statusText);
    //                        }
    //                    );
    //                }

    //                if (response.data !== "Yes") {
    //                    $ctrl.saveEndcustomerData();
    //                }
                    
    //            },
    //            function (response) {
    //               logger.error("Unable to process UCD request.", response, response.statusText);
    //                $ctrl.saveEndcustomerData();
                   
    //            }
    //        );
           

    //    }
    //}

    $ctrl.showEmbAlert = function (validationMsg, country, type) {
        var countryVal = '';
        if ($ctrl.countries != null) {
            countryVal = $ctrl.countries.find(x => x.CTRY_NM == country);
            if (countryVal != null && countryVal.CTRY_XPORT_CTRL_CD == 'EC') {
                if (type == 'ok') {
                    kendo.alert(validationMsg);
                    return countryVal;
                }
                else {
                    $ctrl.IsError = true;
                    $ctrl.msg = validationMsg;
                }
            }
        }
    }

    var primeddata = function (action) {
        data.END_CUST_OBJ = "";
        if (action == "remove") {
            data.END_CUSTOMER_RETAIL = "";
        }
        data.IS_PRIME = "";
        data.PRIMED_CUST_NM = "";
        data.PRIMED_CUST_ID = "";
        data.PRIMED_CUST_CNTRY = "";
        data.END_CUSTOMER_RETAIL = "";
        return data;

    }

    $ctrl.remove = function () {
        if (cellCurrValues.END_CUST_OBJ.length > 0) {
            var PrimeData = primeddata("remove")
            $uibModalInstance.close(PrimeData);
        }
        else {
            kendo.alert("There is no end customer to remove");
        }
    };

    $ctrl.cancel = function () {
        $uibModalInstance.close();
    };



    //change event for end customer combo box
    $ctrl.changeField = function (e) {
        $ctrl.IsAny = $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != null && $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL != undefined && $ctrl.END_CUST_OBJ[0].END_CUSTOMER_RETAIL.toUpperCase() == 'ANY';
        //to disable Save and close button immediately when change event is triggered(deal Recon screen)
        $('#saveandclose').attr('disabled', true);
        $ctrl.validateFlag = true;
        var id = e.sender.element[0].id;
        var index = id.substring(id.indexOf('_') + 1, id.length);
        var dataElement = e.sender.$angular_scope.e;
        var dataItem = dataElement.END_CUSTOMER_RETAIL;
        //on change event Re-setting Unified Values(PRIMED_CUST_ID,IS_PRIMED_CUST and PRIMED_CUST_NM) to empty(initial) values
        dataElement.IS_PRIMED_CUST = 0;
        dataElement.IS_RPL = 0;
        dataElement.PRIMED_CUST_ID = "";
        dataElement.PRIMED_CUST_NM = "";
        dataElement.RPL_STS_CD = "";
        $ctrl.ChangeErrorFlag = false;
        var patt = new RegExp("^[\\w .,:'\&-]*$");
        var isECUserText = false;
        //to get the user entered free text end customer value
        if (dataItem === undefined || dataItem === null) {
            dataItem = $('#' + id).parent().find("input").val();
            if (dataItem != null && dataItem != undefined && dataItem != "") {
                dataItem = dataItem.trim();
                var ecIndex = id.slice(-1);
                //Added this line to make sure alignment of the popup data doesnt go off when user enters "any" in the first EC pair before EC dropdown data load
                $ctrl.IsAny = (dataItem.toUpperCase() == "ANY" && ecIndex==0) ? true : $ctrl.IsAny;
            }
            isECUserText = true;
            $ctrl.END_CUST_OBJ[index].END_CUSTOMER_RETAIL = dataItem;            
        };

        if (isECUserText) {
            var isEndCustomerValid = patt.test(dataItem);
            if (isEndCustomerValid) {
                $ctrl.ChangeErrorFlag = false;
            }
            else {
                $ctrl.ChangeErrorFlag = true;
                $ctrl.validateFlag = true;
                $("#" + id).parent().find("span").css("background-color", "red");
                $("#" + id).parent().find("span").attr("title", "Invalid Character identified in End customer/Retail. Please remove it and Save.")
            }
        }
        
        // var isFirstcombinationAny = (dataItem.toUpperCase() == "ANY" && id == "ComboBoxSelect_0") ? true : false;
        if (dataItem.toUpperCase() == "ANY") {
            if (isAdmin == true) {
                $ctrl.ChangeErrorFlag = false;
                kendo.alert("Any can not be selected from Deal reconciliation screen.");
            }
            else {
                if (parseInt(index) > 0) {
                    $("#" + id).parent().find("span").css("background-color", "red");
                    $("#" + id).parent().find("span").attr("title", "Any can be selected only in the First combination")
                    $ctrl.ChangeErrorFlag = true
                    $ctrl.validateFlag = true;
                }
                else {
                    dataElement.PRIMED_CUST_CNTRY = "Any";
                    $('#DropdownSelections_' + index).attr('disabled', true);

                }
            }
        }


        else if (dataItem !== null && !$ctrl.ChangeErrorFlag) {
            $("#" + id).parent().find("span").css("background-color", "white");
            $("#" + id).parent().find("span").removeAttr("title");
            if (parseInt(index) == 0 && $ctrl.END_CUST_OBJ[0].PRIMED_CUST_CNTRY.toUpperCase() == "ANY") {
                dataElement.PRIMED_CUST_CNTRY = "";
                $('#DropdownSelections_' + index).attr('disabled', false);
                $("#DropdownSelections_" + index).parent().find("span").css("background-color", "white");
                $("#DropdownSelections_" + index).parent().find("span").removeAttr("title")
            }
            angular.forEach($ctrl.END_CUST_OBJ, (item) => {
                //Embargo country validation alert.
                if (item.END_CUSTOMER_RETAIL === dataItem && item.PRIMED_CUST_CNTRY === dataElement.PRIMED_CUST_CNTRY) {
                    $ctrl.showEmbAlert($ctrl.embValidationMsg, item, 'ok');
                }
            });

        }
        $scope.$apply();
    }

    $ctrl.changeCountryField = function (e) {
        $('#saveandclose').attr('disabled', true);
        var id = e.sender.element[0].id;
        $ctrl.validateFlag = true;
        var dataElement = e.sender.$angular_scope.e;
        var dataItem = dataElement.PRIMED_CUST_CNTRY;
        dataElement.IS_PRIMED_CUST = 0;
        dataElement.IS_RPL = 0;
        dataElement.PRIMED_CUST_ID = "";
        dataElement.PRIMED_CUST_NM = "";
        dataElement.RPL_STS_CD = "";
        var embCountry = $ctrl.showEmbAlert($ctrl.embValidationMsg, dataItem, 'ok');
        if (dataItem === undefined || dataItem === null && dataItem === "") {
            $("#" + id).parent().find("span").css("background-color", "red");
            $("#" + id).parent().find("span").attr("title", "Please Select End Customer Country from the dropdown")
        }
        else if (embCountry) {
            $("#" + id).parent().find("span").css("background-color", "red");
            $("#" + id).parent().find("span").attr("title", $ctrl.embValidationMsg)
        }
        else {
            $("#" + id).parent().find("span").css("background-color", "white");
            $("#" + id).parent().find("span").removeAttr("title");
        }
    }

}



