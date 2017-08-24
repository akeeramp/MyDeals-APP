angular
    .module('app.contract')
    .controller('DropdownModalCtrl', DropdownModalCtrl);

DropdownModalCtrl.$inject = ['$scope', '$uibModalInstance', 'colData', 'cellCurrValues', 'colName'];

function DropdownModalCtrl($scope, $uibModalInstance, colData, cellCurrValues, colName) {
	var $ctrl = this;

	$ctrl.colData = colData;
	$ctrl.colName = colName;
	$ctrl.popupResult = [];
	$ctrl.popupResult.DropdownSelections = (cellCurrValues === null) ? "" : cellCurrValues;
	$ctrl.placeholderText = "Click to Select...";

	$ctrl.ok = function () {
		var returnVal = $ctrl.popupResult.DropdownSelections;
		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

}