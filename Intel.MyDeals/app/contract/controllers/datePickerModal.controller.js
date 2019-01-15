(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('DatePickerModalCtrl', DatePickerModalCtrl)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    DatePickerModalCtrl.$inject = ['$scope', '$uibModalInstance', 'cellCurrValues', 'colName', 'contractStartDate', 'contractEndDate', 'contractIsTender', 'isOEM'];

function DatePickerModalCtrl($scope, $uibModalInstance, cellCurrValues, colName, contractStartDate, contractEndDate, contractIsTender, isOEM) {
    var $ctrl = this;
	$ctrl.popupResult = cellCurrValues;
    $ctrl.placeholderText = "Click to Select...";
    $ctrl.errorMsg = "Dates must overlap contract's date range (" + contractStartDate.split(' ')[0] + " - " + contractEndDate.split(' ')[0] + ").";

	$ctrl.isStartDate = (colName === "START_DT");
	$ctrl.backDateReason = "";
	$ctrl.isBackDateReasonRequired = false;

	$ctrl.ok = function () {
		var returnVal = "";
		if ($ctrl.popupResult !== undefined) {
			returnVal = $ctrl.popupResult;
		}

		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

	$ctrl.EnterPressed = function (event) {
        //KeyCode 13 is 'Enter'
	    if (event.keyCode === 13 && $ctrl.isValidDate === true)
	    {
	     	    $ctrl.ok();   
	    }
	};



	$ctrl.datepickerOptions = {
		change: function () {
			var value = this.value();
			var today = new Date();

			$ctrl.isValidDate = true;

		    // date must overlapp contract range... not inside of the range - Tender contracts don't observe start/end date within contract.
			if ($ctrl.isStartDate && value > new Date(contractEndDate) && contractIsTender !== "1")
			{
			    $ctrl.isValidDate = false;
			}
			if (!$ctrl.isStartDate && value < new Date(contractStartDate) && contractIsTender !== "1")
			{
			    $ctrl.isValidDate = false;
			}
			if (isOEM)
			{
			    $ctrl.isValidDate = true;
			}

		    //// NO BACKDATE HERE.  It will be set in the Grid
		    //// TODO: maybe. Backdate is still being hashed out (5/15/2017). When we find out, either uncomment below code if needed, else just remove it
		    //// Back Date
		    //if ($ctrl.isStartDate) {
		    //	if ((value < today) && ($ctrl.backDateReason === "")) { // If the contract start date is selected before today's date
		    //		$ctrl.isBackDateReasonRequired = true;
		    //	}
		    //	else {
		    //		// Clear backdate reason in case there is any
		    //		$ctrl.backDateReason = "";
		    //		$ctrl.isBackDateReasonRequired = false;
		    //	}
		    //} 
		}
	}

	$ctrl.init = function () {
		if (cellCurrValues != null) {
			// Set original values from the spreadsheet
			var datepicker = $("#datePickerPopup").data("kendoDatePicker");
			datepicker.value(new Date(cellCurrValues));
			datepicker.trigger("change");
		}
	}
}

})();
