angular
    .module('app.contract')
    .controller('MultiSelectModalCtrl', MultiSelectModalCtrl);

MultiSelectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'MrktSegMultiSelectService', 'items', 'cellCurrValues', 'colName', 'isBlendedGeo'];

function MultiSelectModalCtrl($scope, $uibModalInstance, MrktSegMultiSelectService, items, cellCurrValues, colName, isBlendedGeo) {
	var $ctrl = this;
	var GEO = "GEO_COMBINED";
	var MRKT_SEG = "MRKT_SEG";
	var CORP = "CUST_ACCNT_DIV";

	$ctrl.multiSelectPopUpModal = items;
	$ctrl.popupResult = [];
	$ctrl.popupResult.MultiSelectSelections = (cellCurrValues === null) ? "" : cellCurrValues;
	$ctrl.colName = colName;
    $ctrl.placeholderText = "Click to Select...";

    $ctrl.isGeo = (colName === GEO);
    $ctrl.isCorp = (colName === CORP);
    $ctrl.isGeoBlend = isBlendedGeo;
	
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

		// Turn returnVal into a string rather than an array to prevent Kendo's drag-to-copy spreadsheet errors
		if (Array.isArray(returnVal)) {
			returnVal = returnVal.toString();
		}

		
		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};


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
				if ($ctrl.colName === MRKT_SEG) {
					$ctrl.popupResult.MultiSelectSelections = MrktSegMultiSelectService.setMkrtSegMultiSelect("MultiSelectSelections", "MultiSelectSelections_MS", newValue, oldValue);
				} else if (($ctrl.isGeo) && (!$ctrl.isGeoBlend)) {
					$ctrl.popupResult.MultiSelectSelections = MrktSegMultiSelectService.setGeoMultiSelect("MultiSelectSelections", newValue, oldValue);
				}
			}

		}, true);
}