angular
    .module('app.contract')
    .controller('DropdownModalCtrl', DropdownModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

DropdownModalCtrl.$inject = ['$scope', '$uibModalInstance', 'colData', 'cellCurrValues', 'colName'];

function DropdownModalCtrl($scope, $uibModalInstance, colData, cellCurrValues, colName) {
	var $ctrl = this;

	$ctrl.colData = colData;
	$ctrl.colName = colName;
	$ctrl.popupResult = [];
	$ctrl.popupResult.DropdownSelections = (cellCurrValues === null) ? "" : cellCurrValues;
	$ctrl.placeholderText = "Click to Select...";
	$ctrl.isEmptyList = colData.length > 0 ? false : true;

	$ctrl.EnterPressed = function (event) {
	        //KeyCode 13 is 'Enter'
	    if (event.keyCode === 13) {
	        $ctrl.ok();
	    }
	};

	$ctrl.ok = function () {
		var returnVal = $ctrl.popupResult.DropdownSelections;
		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

}