angular
    .module('app.contract')
    .controller('EcapTrackerAutoFillModalCtrl', EcapTrackerAutoFillModalCtrl);

EcapTrackerAutoFillModalCtrl.$inject = ['$scope', 'logger', 'dataService', '$uibModalInstance'];

function EcapTrackerAutoFillModalCtrl($scope, logger, dataService, $uibModalInstance) {
	var $ctrl = this;

	$ctrl.popupResult = [];
	$ctrl.placeholderText = "Click to Select...";

	$ctrl.isLoading = false;
	$ctrl.hasValidTrackerInfo = false;
	$ctrl.dealInfo = null;
		

	$ctrl.verify = function (unValidatedTrackerNumber) {
		$ctrl.hasValidTrackerInfo = false;
		$ctrl.dealInfo = null;

		if (unValidatedTrackerNumber === undefined || unValidatedTrackerNumber === null || unValidatedTrackerNumber.replace(/\s/g, "").length === 0) {
			return;
		}

		$ctrl.isLoading = true;

		// Load dropdown info
		return dataService.get('/api/EcapTracker/GetDealDataViaTrackerNumber/' + unValidatedTrackerNumber).then( // TODO: change this
			function (response) {
				$ctrl.hasValidTrackerInfo = true;
				// TODO: get the SP information for the new row
				$ctrl.dealInfo = response.data; // TODO
				$ctrl.isLoading = false;
			},
			function (response) {
				logger.error("Unable to get ECAP tracker dropdown data.", response, response.statusText);
				$ctrl.isLoading = false;
				$ctrl.hasValidTrackerInfo = false;
				$ctrl.dealInfo = null;
			}
		);
	};

	$ctrl.clearValidatedTrackerinfo = function () {
		$ctrl.hasValidTrackerInfo = false;
		$ctrl.dealInfo = null;
	}

	$ctrl.submit = function () {
		if (!$ctrl.hasValidTrackerInfo) { return; }
		
		// TODO: remove below obj and replace with $ctrl.dealInfo once we get the actual data
		var tempNewRow = {
			"ADJ_ECAP_UNIT": null,
			"CUST_ACCNT_DIV": null,
			"CUST_MBR_SID": null,
			"DC_ID": null,
			"ECAP_PRICE": null,
			"END_DT": "",  // TO GET
			"FRCST_VOL": null,
			"GEO_COMBINED": "", // TO GET
			"MEET_COMP_PRICE_QSTN": "", // TO GET
			"MRKT_SEG": null,
			"ORIG_ECAP_TRKR_NBR": 11111111, // TO SET
			"PAYOUT_BASED_ON": null,
			"PROD_INCLDS": null,
			"PROGRAM_PAYMENT": null,
			"PTR_SYS_INVLD_PRD": "",
			"PTR_SYS_PRD": "",  // TO GET
			"PTR_USER_PRD": "TODO",  // TO GET
			"REBATE_TYPE": "ECAP ADJ",
			"START_DT": "", // TO GET
			"TERMS": null,
			"TOTAL_DOLLAR_AMOUNT": null,
			"VOLUME": null,
			"dirty": true,
			"id": null,
		}

		$uibModalInstance.close(tempNewRow); //$ctrl.dealInfo
	};

	$ctrl.cancel = function () {
		$uibModalInstance.dismiss();
	};

}