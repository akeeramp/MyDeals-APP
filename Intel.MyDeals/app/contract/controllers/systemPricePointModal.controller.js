angular
    .module('app.contract')
    .controller('SystemPricePointModalCtrl', SystemPricePointModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

SystemPricePointModalCtrl.$inject = ['$scope', '$uibModalInstance', 'items', 'cellCurrValues', 'colName'];

function SystemPricePointModalCtrl($scope, $uibModalInstance, items, cellCurrValues, colName) {
    var blah = 0;
    var $ctrl = this;

    var operators = [
        { id: 1, name: '<=' }
        //{ id: 2, name: '>=' }
    ];
    $ctrl.operator = { id: 1, name: '<=' };
    $ctrl.price = "";


    if (cellCurrValues[0] !== "" && cellCurrValues[0] !== undefined) {
        var splitValue = cellCurrValues[0].split("$");
        $ctrl.operator = operators.find(element => element.name == splitValue[0]);
        $ctrl.price = splitValue[1];

    }

    $ctrl.dropDownOptions = {
        dataTextField: "name",
        dataValueField: "id",
        dataSource: operators,
    };


    $ctrl.label = items.label;

    $ctrl.EnterPressed = function (event) {
        // KeyCode 13 is 'Enter'
        if (event.keyCode === 13) {
            $ctrl.ok();
        }
    };

    $ctrl.ok = function () {
        var returnVal = "";


        if (($ctrl.price != null && $ctrl.price !== "") && ($ctrl.operator.name !== undefined && $ctrl.operator !== "") ) {
            returnVal = $ctrl.operator.name + "$" + $ctrl.price;
        }

        // Turn returnVal into a string rather than an array to prevent Kendo UIs drag-to-copy spreadsheet errors
        if (Array.isArray(returnVal)) {
            returnVal = returnVal.toString();
        }


        $uibModalInstance.close(returnVal);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $uibModalInstance.rendered.then(function ()
    {
        if (consumptionFields.contains($ctrl.colName))
        {
            $ctrl.msg = false;
            //var multiSelectData = $("#MultiSelectSelections").data("kendoTreeView");
                                       
            //if (multiSelectData !== undefined && multiSelectData.dataSource != undefined)
            //{
            //        $ctrl.isEmptyList = (multiSelectData.dataSource._data.length == 0); // Post Admin Message if dropdown length = 0
            //        //var chkSoldToID = multiSelectData.$angular_scope.opLookupUrl; //check for Sold_To_Id Field                                 
            //        //if (chkSoldToID.contains("/api/Dropdown/GetSoldToIds")) {
            //        var chkSoldToID = multiSelectData.$angular_scope.opLookupText; //check for Sold_To_Id Field  
            //        if (chkSoldToID =="subAtrbCd") {
            //            $ctrl.msg = true
            //        }
            //        else
            //        {
            //            $ctrl.msg = false;
            //        }
                                 
            //}
            $ctrl.msg = true;
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
                    var x = 0;
                    //$ctrl.popupResult.MultiSelectSelections = mrktSegMultiSelectService.setMkrtSegMultiSelect("MultiSelectSelections", "MultiSelectSelections_MS", newValue, oldValue);
                //} else if (($ctrl.isGeo) && (!$ctrl.isGeoBlend)) {
                    //$ctrl.popupResult.MultiSelectSelections = mrktSegMultiSelectService.setGeoMultiSelect("MultiSelectSelections", newValue, oldValue);
                }
            }

        }, true);
}