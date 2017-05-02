angular
    .module('app.contract')
    .controller('MultiSelectModalCtrl', MultiSelectModalCtrl);

MultiSelectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'MrktSegMultiSelectService', 'items', 'cellCurrValues'];

function MultiSelectModalCtrl($scope, $uibModalInstance, MrktSegMultiSelectService, items, cellCurrValues) {
	var $ctrl = this;
	$ctrl.multiSelectPopUpModel = items;
	$ctrl.popupResult = [];
	$ctrl.popupResult.MultiSelectSelections = cellCurrValues;

	$ctrl.placeholderText = "Click to Select..."
	
	$ctrl.ok = function () {
		var returnVal = "";
		if ($ctrl.popupResult.MultiSelectSelections !== undefined) {
			returnVal = $ctrl.popupResult.MultiSelectSelections;
		}
		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

	//setting a few constants for the strings that occur a lot
	var GEO = "GEO_COMBINED";
	var MRKT_SEG = "MRKT_SEG"

	//watch for user changing global auto-fill default values
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
				// of newValue. However, we need to do this otherwise the newValue will not neccessarly change  in the MrktSegMultiSelectService
				if ($ctrl.multiSelectPopUpModel.field == MRKT_SEG) {
					// TODO: Market Segment multiSelect logic doesn't work yet! 
					$ctrl.popupResult.MultiSelectSelections = MrktSegMultiSelectService.setMkrtSegMultiSelect("MultiSelectSelections", "MultiSelectSelections_MS", newValue, oldValue);
				} else if ($ctrl.multiSelectPopUpModel.field == GEO) {
					$ctrl.popupResult.MultiSelectSelections = MrktSegMultiSelectService.setGeoMultiSelect("MultiSelectSelections", newValue, oldValue);
				}
			}

		}, true);
}