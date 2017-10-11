angular
    .module('app.contract')
    .controller('ExcludeDealGroupMultiSelectCtrl', ExcludeDealGroupMultiSelectCtrl);

ExcludeDealGroupMultiSelectCtrl.$inject = ['$scope', '$uibModalInstance', 'dataService', 'logger', 'dealId', 'cellCurrValues', 'cellCommentValue', 'colInfo'];

function ExcludeDealGroupMultiSelectCtrl($scope, $uibModalInstance, dataService, logger, dealId, cellCurrValues, cellCommentValue, colInfo) {
	var vm = this;
	
	var selectedGridDict = {};
	vm.returnVal = {};
	//vm.returnVal.DEAL_GRP_EXCLDS = TODO
	vm.returnVal.DEAL_GRP_CMNT = (cellCommentValue === null) ? "" : cellCommentValue;
	vm.colInfo = colInfo;

	var dataSourceSuggested = new kendo.data.DataSource({
		transport: {
			read: {
				url: colInfo.lookupUrl + "/" + dealId,
				dataType: "json" 
			}
		},
		schema: {
			model: {
				fields: {
					EXCLD_DEAL_FLAG: {},
					OVLP_ADDITIVE: {},
					OVLP_CNSMPTN_RSN: {},
					OVLP_CNTRCT_NM: {},
					OVLP_DEAL_END_DT: {},
					OVLP_DEAL_ID: {},
					OVLP_DEAL_STRT_DT: {},
					OVLP_DEAL_TYPE: {},
					OVLP_WF_STG_CD: {},
					selected: {}
				}
			}
		},
		serverPaging: true,
		serverSorting: true
	});;
	vm.isLoading = false; //true;
	vm.dataList = []; // TODO

	function init() {
		console.log("initted")
		
		// TODO: get previously selected checkboxes
	}


	vm.gridOptionsSuggested = {
		dataSource: dataSourceSuggested,
		filterable: false,
		sortable: false,
		selectable: "row",
		resizable: false,
		groupable: false,
		columnMenu: false,
		scrollable: false,
		editable: false,
		pageable: false,
		noRecords: {
			template: "<div style='padding:40px;'>No overlapping deal groups were found.<div>"
		},
		columns: [
			{ field: "OVLP_DEAL_ID", title: "Deal #" },
			{ field: "OVLP_DEAL_TYPE", title: "Deal Type" },
			{ field: "EXCLD_DEAL_FLAG", template: "<div>Test: #=EXCLD_DEAL_FLAG#</div>" },
			{ field: "OVLP_CNTRCT_NM", title: "Contract" },
			{ field: "OVLP_WF_STG_CD", title: "Stage" },
			{ field: "OVLP_DEAL_END_DT", title: "Deal Start" },
			{ field: "OVLP_DEAL_STRT_DT", title: "Deal End" },
			{ field: "OVLP_ADDITIVE", title: "Additive" },
			{ field: "OVLP_CNSMPTN_RSN", title: "Comsumption Reason" },
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
			return key
		}).join(",");

		$uibModalInstance.close(vm.returnVal);
	};


	vm.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();
}