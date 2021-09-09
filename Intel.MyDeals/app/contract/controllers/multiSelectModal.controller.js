angular
    .module('app.contract')
    .controller('MultiSelectModalCtrl', MultiSelectModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

MultiSelectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'MrktSegMultiSelectService', 'items', 'cellCurrValues', 'colName', 'isBlendedGeo'];

function MultiSelectModalCtrl($scope, $uibModalInstance, mrktSegMultiSelectService, items, cellCurrValues, colName, isBlendedGeo) {
    var $ctrl = this;
    var geo = "GEO_COMBINED";
    var mrktSeg = "MRKT_SEG";
    var corp = "CUST_ACCNT_DIV";
    var consumptionFields = ["CONSUMPTION_CUST_PLATFORM", "CONSUMPTION_CUST_SEGMENT", "CONSUMPTION_CUST_RPT_GEO", "CONSUMPTION_COUNTRY", "CONSUMPTION_SYS_CONFIG","DEAL_SOLD_TO_ID"];
    var filterableFields = ["CONSUMPTION_CUST_PLATFORM", "CONSUMPTION_CUST_SEGMENT", "CONSUMPTION_CUST_RPT_GEO", "CONSUMPTION_COUNTRY", "CONSUMPTION_SYS_CONFIG", "DFLT_CUST_RPT_GEO","DEAL_SOLD_TO_ID"];

    $ctrl.multiSelectPopUpModal = items;
    $ctrl.popupResult = [];
    $ctrl.popupResult.MultiSelectSelections = (cellCurrValues === null) ? "" : cellCurrValues;
    $ctrl.colName = colName;
    $ctrl.placeholderText = "Click to Select...";

    $ctrl.isGeo = (colName === geo);
    $ctrl.isCorp = (colName === corp);
    $ctrl.isGeoBlend = isBlendedGeo;
    $ctrl.isEmptyList = false; // Set to false for non-consumption by default - proper set in $uibModalInstance.rendered.then for consumption
    $ctrl.isFilterEnabled = filterableFields.indexOf(colName) > -1;    

    $ctrl.EnterPressed = function (event) {
        // KeyCode 13 is 'Enter'
        if (event.keyCode === 13) {
            $ctrl.ok();
        }
    };

    $ctrl.ok = function () {
        var returnVal = "";
        if ($ctrl.popupResult.MultiSelectSelections !== undefined) {
            returnVal = $ctrl.popupResult.MultiSelectSelections;

            // Format geo
            if ($ctrl.isGeo) {
                var wwIndex = returnVal.indexOf("Worldwide");

                if ($ctrl.isGeoBlend) {
                    if (wwIndex > -1) {
                        returnVal.splice(wwIndex, 1);
                    }
                    if (returnVal.length > 0) {
                        returnVal = "[" + returnVal.join() + "]";
                    }

                    if (wwIndex > -1) {
                        if (returnVal.length !== 0) {
                            returnVal += ",";
                        }
                        returnVal += "Worldwide";
                    }
                }
            }

            if ($ctrl.isCorp) {
                returnVal = returnVal.join('/');
            }
        }

        // Turn returnVal into a string rather than an array to prevent Kendo UIs drag-to-copy spreadsheet errors
        if (Array.isArray(returnVal)) {
            returnVal = returnVal.join('|').toString();
            if ($ctrl.colName == "CONSUMPTION_COUNTRY") {
                returnVal = mrktSegMultiSelectService.setConsumptionCtrySelect("MultiSelectSelections", returnVal);
            }

        }


        $uibModalInstance.close(returnVal);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $ctrl.SelecAllCustomerReportedGeos = function () {
        $('#MultiSelectSelections input[type="checkbox"]:not(:checked)').click();
    }

    $ctrl.DeSelecAllCustomerReportedGeos = function () {
        $('#MultiSelectSelections input[type="checkbox"]:checked').click();
    }

    $uibModalInstance.rendered.then(function ()
    {
        if (consumptionFields.contains($ctrl.colName))
        {
            $ctrl.msg = false;
            var multiSelectData = $("#MultiSelectSelections").data("kendoTreeView");
                                       
            if (multiSelectData !== undefined && multiSelectData.dataSource != undefined)
            {
                    $ctrl.isEmptyList = (multiSelectData.dataSource._data.length == 0); // Post Admin Message if dropdown length = 0
                    //var chkSoldToID = multiSelectData.$angular_scope.opLookupUrl; //check for Sold_To_Id Field                                 
                    //if (chkSoldToID.contains("/api/Dropdown/GetSoldToIds")) {
                    var chkSoldToID = multiSelectData.$angular_scope.opLookupText; //check for Sold_To_Id Field  
                    if (chkSoldToID =="subAtrbCd") {
                        $ctrl.msg = true
                    }
                    else
                    {
                        $ctrl.msg = false;
                    }
                                 
            }
        }
    });

    // Watch for user changing global auto-fill default values
    $scope.$watch('$ctrl.popupResult.MultiSelectSelections',
        function (newValue, oldValue, el) {
            if (oldValue === newValue) return;

            if (oldValue === undefined || newValue === undefined) return;

            if (oldValue != null && newValue == null) return;

            if (oldValue == null && newValue != null) {
                oldValue = "";
            }
            else {
                // HACK: These get called twice because we set newValue via $ctrl.popupResult.MultiSelectSelections directly instead 
                // of newValue. However, we need to do this otherwise the newValue will not necessarily change  in the MrktSegMultiSelectService
                if ($ctrl.colName === mrktSeg) {
                    $ctrl.popupResult.MultiSelectSelections = mrktSegMultiSelectService.setMkrtSegMultiSelect("MultiSelectSelections", "MultiSelectSelections_MS", newValue, oldValue);
                } else if (($ctrl.isGeo) && (!$ctrl.isGeoBlend)) {
                    $ctrl.popupResult.MultiSelectSelections = mrktSegMultiSelectService.setGeoMultiSelect("MultiSelectSelections", newValue, oldValue);
                }
            }

        }, true);
}