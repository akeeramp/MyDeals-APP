angular
    .module('app.contract')
    .controller('EcapTrackerAutoFillModalCtrl', EcapTrackerAutoFillModalCtrl);

EcapTrackerAutoFillModalCtrl.$inject = ['$scope', 'logger', 'dataService', '$uibModalInstance', 'custId'];

function EcapTrackerAutoFillModalCtrl($scope, logger, dataService, $uibModalInstance, custId) {
	var vm = this;

	vm.custId = custId;

	vm.popupResult = [];
	vm.placeholderText = "Click to Select...";

	vm.isLoading = false;
	vm.hasValidTrackerInfo = false;
	vm.dealInfo = [];

	var selectedGridDict = {};

	var dataSourceSuggested = new kendo.data.DataSource({
		transport: {
			read: function (e) {
				e.success(vm.dealInfo);
			}
		},
		schema: {
			model: {
				fields: {
					OBJ_SID: {},
					//TRKR_NBR: {},
					START_DT: {},
					END_DT: {},
					PTR_SYS_PRD: {},
					GEO_COMBINED: {},
					MRKT_SEG: {},
					MEET_COMP_PRICE_QSTN: {},
					PAYOUT_BASED_ON: {},
					PROD_INCLDS: {},
					PROGRAM_PAYMENT: {},
					//TERMS: {},
					selected: {}
				}
			}
		},
		serverPaging: true,
		serverSorting: true
	});


	vm.selectProduct = function (dataItem) {
		if (dataItem.selected) {
			// checked
			selectedGridDict[dataItem.OVLP_DEAL_ID] = true;
		} else {
			// unchecked
			delete selectedGridDict[dataItem.OVLP_DEAL_ID];
		}
	}


	vm.gridOptionsSuggested = {
		dataSource: dataSourceSuggested,
		enableHorizontalScrollbar: true,
		filterable: true,
		sortable: true,
		resizable: false,
		groupable: false,
		editable: false,
		pageable: false,
		scrollable: true,
		filter: "startsWith",
		height: 300,
		noRecords: {
			template: "<div style='padding:40px;'>No overlapping deal groups were found.<div>"
		},
		columns: [
			{ field: "OBJ_SID", title: "Deal Id" },
			//{ field: "TRKR_NBR", title: "Tracker Number" },
			{ field: "START_DT", title: "Deal Start" /*, template: "#= kendo.toString(kendo.parseDate(START_DT, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" */},
			{ field: "END_DT", title: "Deal End"/*, template: "#= kendo.toString(kendo.parseDate(END_DT, 'yyyy-MM-dd'), 'MM/dd/yyyy') #" */},
			{ field: "PTR_SYS_PRD", title: "Product" },
			{ field: "GEO_COMBINED", title: "Geo" },
			{ field: "MRKT_SEG", title: "Market Segment" },
			{ field: "MEET_COMP_PRICE_QSTN", title: "Meet Comp" },
			{ field: "PAYOUT_BASED_ON", title: "Payout Based On" },
			{ field: "PROD_INCLDS", title: "Media" },
			{ field: "PROGRAM_PAYMENT", title: "Program Payment" },
			//{ field: "TERMS", title: "Terms" }
		]
	};
	
	vm.verify = function (unValidatedTrackerNumber) {
		vm.hasValidTrackerInfo = false;
		vm.dealInfo = [];

		if (unValidatedTrackerNumber === undefined || unValidatedTrackerNumber === null || unValidatedTrackerNumber.replace(/\s/g, "").length === 0) {
			return;
		}

		vm.isLoading = true;

		// Load dropdown info
		return dataService.get('/api/EcapTracker/GetDealDataViaTrackerNumber/' + unValidatedTrackerNumber + '/' + vm.custId).then( // TODO: change this
			function (response) {
				vm.hasValidTrackerInfo = true;

				if (response.data == null) {
					vm.dealInfo = [];
				} else {
					vm.dealInfo = response.data;
				}
				dataSourceSuggested.read();
				vm.isLoading = false;
			},
			function (response) {
				logger.error("Unable to get ECAP tracker dropdown data.", response, response.statusText);
				vm.hasValidTrackerInfo = false;
				vm.dealInfo = [];
				vm.isLoading = false;
			}
		);
	};

	vm.clearValidatedTrackerinfo = function () {
		vm.hasValidTrackerInfo = false;
		vm.dealInfo = null;
	}

	vm.submit = function () {
		if (vm.dealInfo.length === 0) { return; }

		vm.dealInfo["ORIG_ECAP_TRKR_NBR"] = vm.dealInfo["TRKR_NBR"]; // TODO: ask db to rename this
		vm.dealInfo["FRCST_VOL"] = null;
		vm.dealInfo["TOTAL_DOLLAR_AMOUNT"] = null;

		$uibModalInstance.close(vm.dealInfo);
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};

}