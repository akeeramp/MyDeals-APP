angular
    .module('app.contract')
    .controller('DatePickerModalCtrl', DatePickerModalCtrl);

DatePickerModalCtrl.$inject = ['$scope', '$uibModalInstance', 'MrktSegMultiSelectService', 'cellCurrValues', 'colName', 'contractStartDate', 'contractEndDate'];

function DatePickerModalCtrl($scope, $uibModalInstance, MrktSegMultiSelectService, cellCurrValues, colName, contractStartDate, contractEndDate) {
	var $ctrl = this;
	$ctrl.popupResult = cellCurrValues;
	$ctrl.placeholderText = "Click to Select..."

	$ctrl.errorMsg = "Dates must be within contract's start date (" + contractStartDate.split(' ')[0] + ") and end date (" + contractEndDate.split(' ')[0] + ")."

	$ctrl.isStartDate = (colName == "START_DT");
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


	$ctrl.datepickerOptions = {
		change: function () {
			var value = this.value();
			var today = new Date();

			if ( (value < new Date(contractStartDate)) || (value > new Date(contractEndDate)) ) {
				$ctrl.isValidDate = false;
			} else {
				$ctrl.isValidDate = true;
			}

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