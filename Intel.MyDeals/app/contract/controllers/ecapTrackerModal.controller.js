angular
    .module('app.contract')
    .controller('EcapTrackerModalCtrl', EcapTrackerModalCtrl) 
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

EcapTrackerModalCtrl.$inject = ['$scope', 'logger', 'dataService', '$uibModalInstance', 'colData', 'cellCurrValues', 'colName', 'filterData'];

function EcapTrackerModalCtrl($scope, logger, dataService, $uibModalInstance, colData, cellCurrValues, colName, filterData) {
	var $ctrl = this;

	$ctrl.colData = colData;
	$ctrl.colName = colName;
	$ctrl.filterData = filterData;
	$ctrl.popupResult = [];
	$ctrl.popupResult.DropdownSelections = (cellCurrValues === null) ? "" : cellCurrValues;
	$ctrl.placeholderText = "Click to Select...";
	$ctrl.editedLookupUrl = $ctrl.colData.opLookupUrl;

	$ctrl.isDropdownsLoaded = false;
	$ctrl.needsProductValidation = false;


	function init() {
		if (filterData["PRD_MBR_SID"] === undefined || filterData["PRD_MBR_SID"] === null) {
			$ctrl.needsProductValidation = true;
		} else {
			// Load dropdown info
			return dataService.post($ctrl.colData.opLookupUrl, filterData).then(
				function (response) {
					$ctrl.dropDownDatasource = response.data;
					$ctrl.isDropdownsLoaded = true;
				},
				function (response) {
					logger.error("Unable to get ECAP tracker dropdown data.", response, response.statusText);
				}
			);
		}
	}
	
	$ctrl.dropDownOptions = {
		autoBind: false,
		dataTextField: $ctrl.colData.opLookupText,
		dataValueField: $ctrl.colData.opLookupValue,
		dataSource: {
			type: "json",
			serverFiltering: true,
			transport: {
				read: function (e) {
					e.success($ctrl.dropDownDatasource);
				}
			}
		}
	};

	$ctrl.ok = function () {
		var returnVal = $ctrl.popupResult[$ctrl.colData.opLookupText];
		$uibModalInstance.close(returnVal);
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();
}