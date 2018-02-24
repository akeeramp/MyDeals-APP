angular
    .module('app.contract')
    .controller('ExcludeDealGroupMultiSelectCtrl', ExcludeDealGroupMultiSelectCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

ExcludeDealGroupMultiSelectCtrl.$inject = ['$scope', '$uibModalInstance', 'dataService', 'logger', 'dealId', 'cellCurrValues', 'cellCommentValue', 'colInfo'];

function ExcludeDealGroupMultiSelectCtrl($scope, $uibModalInstance, dataService, logger, dealId, cellCurrValues, cellCommentValue, colInfo) {
	var vm = this;

	var selectedGridDict = {};
	vm.returnVal = {};
	vm.cellCurrValues = angular.copy(cellCurrValues);
	vm.returnVal.DEAL_GRP_CMNT = (cellCommentValue === null) ? "" : cellCommentValue;
	vm.colInfo = colInfo;
	vm.isLoading = true;
	vm.gridData = [];
	vm.hasComment = false;

	var dataSourceSuggested = new kendo.data.DataSource({
		transport: {
			read: function (e) {

				var currValsArr = vm.cellCurrValues.split(',');

				// put in dictionary for easier lookup
				for(var i=0; i<currValsArr.length; i++){
					selectedGridDict[currValsArr[i]] = true;
				}

				// find all curr passed in values in our list and select them
				for (var i = 0; i < vm.gridData.length; i++) {
					if (selectedGridDict.hasOwnProperty(vm.gridData[i].OVLP_DEAL_ID)) {
						vm.gridData[i].selected = true;
					}
				}

				e.success(vm.gridData);
			}
		},
		schema: {
			model: {
				fields: {
					EXCLD_DEAL_FLAG: {},
					OVLP_ADDITIVE: {},
					OVLP_CNSMPTN_RSN: {},
					OVLP_CNTRCT_NM: {},
				    OVLP_DEAL_DESC: {},
				    OVLP_DEAL_END_DT: { type: "date" },
					OVLP_DEAL_ID: {},
					OVLP_DEAL_STRT_DT: { type: "date" },
					OVLP_DEAL_TYPE: {},
					OVLP_WF_STG_CD: {},
					selected: {}
				}
			}
		},
		serverPaging: true,
		serverSorting: true
	});

	function init() {

		return dataService.get(colInfo.lookupUrl + "/" + dealId).then(
			function (response) {
				vm.gridData = response.data;
				dataSourceSuggested.read();
				vm.isLoading = false;
			},
			function (response) {
				logger.error("Unable to get ECAP tracker dropdown data.", response, response.statusText);
				vm.isLoading = false;
			}
		);
	}

	vm.gridOptionsSuggested = {
		dataSource: dataSourceSuggested,
		enableHorizontalScrollbar: true,
		filterable: true,
		sortable: true,
		resizable: true,
		groupable: false,
		editable: false,
		pageable: false,
		scrollable: true,
		filter: "startsWith",
		noRecords: {
			template: "<div style='padding:40px;'>No overlapping deal groups were found.<div>"
		},
		columns: [
			{ field: "OVLP_DEAL_ID", title: "Deal #", width: "120px" },
			{ field: "OVLP_DEAL_TYPE", title: "Deal Type", width: "120px" },
			{ field: "OVLP_CNTRCT_NM", title: "Contract" },
			{ field: "OVLP_WF_STG_CD", title: "Stage", width: "120px" },
			{ field: "OVLP_DEAL_STRT_DT", title: "Deal Start", width: "120px", template: "#= moment(OVLP_DEAL_STRT_DT).format('MM/DD/YYYY') #" },
			{ field: "OVLP_DEAL_END_DT", title: "Deal End", width: "120px", template: "#= moment(OVLP_DEAL_END_DT).format('MM/DD/YYYY') #" },
			{ field: "OVLP_ADDITIVE", title: "Additive", width: "120px" },
            { field: "OVLP_DEAL_DESC", title: "Deal Description", width: "180px" },
			{ field: "OVLP_CNSMPTN_RSN", title: "Comsumption Reason" }
		]
	};

	vm.selectProduct = function (dataItem) {
		if (dataItem.selected) {
			// checked
			selectedGridDict[dataItem.OVLP_DEAL_ID] = true;
		} else {
			// unchecked
			delete selectedGridDict[dataItem.OVLP_DEAL_ID];
		}
	}

	vm.ok = function () {

		// turn dictionary to csv string
		vm.returnVal.DEAL_GRP_EXCLDS = Object.keys(selectedGridDict).map(function (key) {
		    return key;
		}).join(",").replace(/,\s*$/, "");

		if (vm.returnVal.DEAL_GRP_EXCLDS !== null && vm.returnVal.DEAL_GRP_EXCLDS !== "" && vm.returnVal.DEAL_GRP_CMNT === "") {
		    kendo.alert("When excluding deals, a reason must be provied.");
		    return;
		}

		//// Remove comment if no selected exluded deal groups
		//if (vm.returnVal.DEAL_GRP_EXCLDS === null || vm.returnVal.DEAL_GRP_EXCLDS === "") {
		//	vm.returnVal.DEAL_GRP_CMNT = "";
		//}
		$uibModalInstance.close(vm.returnVal);
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();
}