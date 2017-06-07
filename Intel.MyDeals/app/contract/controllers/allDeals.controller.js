angular
    .module('app.contract')
    .controller('AllDealsController', AllDealsController);

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
AllDealsController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger', '$uibModal', '$timeout'];

function AllDealsController($scope, $state, $stateParams, $filter, objsetService, confirmationModal, dataService, logger, $uibModal, $timeout) {


	// Variables
    var root = $scope.$parent;	// Access to parent scope
    root.curPricingTable.DC_ID = undefined;
    var wipTemplate;
    root.wipData = [];

    gridUtils.onDataValueChange = function (e) {
        root._dirty = true;
    }

    // Generates options that kendo's html directives will use
    function initGrid(data) {

		// Define Kendo Main Grid options
		wipTemplate = root.templates.ModelTemplates.WIP_DEAL["ECAP"];

		$timeout(function () {
		    root.wipOptions = {};
		    root.wipOptions.columns = wipTemplate.columns;
		    root.wipOptions.model = wipTemplate.model;
		    root.wipOptions.default = {};
		    root.wipOptions.default.groups = [
                { "name": "Deal Info", "order": 0 },
                { "name": "Consumption", "order": 1 },
                { "name": "Retail Cycle", "order": 2 },
                { "name": "Backdate", "order": 3 },
                { "name": "All", "order": 99 }
		    ];
		    root.wipOptions.default.groupColumns = {
		        "tools": {
		            "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate", "Overlapping"]
		        },
		        "details": {
		            "Groups": ["Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate", "Overlapping"]
		        },
		        "DC_ID": {
		            "Groups": ["Deal Info"]
		        },
		        "PASSED_VALIDATION": {
		            "Groups": ["Deal Info"]
		        },
		        "START_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "END_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "WF_STG_CD": {
		            "Groups": ["Deal Info"]
		        },
		        "OBJ_SET_TYPE_CD": {
		            "Groups": ["Deal Info"]
		        },
		        "PTR_USER_PRD": {
		            "Groups": ["Deal Info"]
		        },
		        "TITLE": {
		            "Groups": ["Deal Info"]
		        },
		        "PRODUCT_FILTER": {
		            "Groups": ["Deal Info"]
		        },
		        "DEAL_COMB_TYPE": {
		            "Groups": ["Deal Info"]
		        },
		        "ECAP_PRICE": {
		            "Groups": ["Deal Info"]
		        },
		        "CAP_INFO": {
		            "Groups": ["Deal Info"]
		        },
		        "CAP": {
		            "Groups": ["All"]
		        },
		        "CAP_STRT_DT": {
		            "Groups": ["All"]
		        },
		        "CAP_END_DT": {
		            "Groups": ["All"]
		        },
		        "YCS2_INFO": {
		            "Groups": ["Deal Info"]
		        },
		        "YCS2_PRC_IRBT": {
		            "Groups": ["All"]
		        },
		        "YCS2_START_DT": {
		            "Groups": ["All"]
		        },
		        "YCS2_END_DT": {
		            "Groups": ["All"]
		        },
		        "VOLUME": {
		            "Groups": ["Deal Info"]
		        },
		        "ON_ADD_DT": {
		            "Groups": ["Deal Info"]
		        },
		        "DEAL_SOLD_TO_ID": {
		            "Groups": ["Deal Info"]
		        },
		        "EXPIRE_YCS2": {
		            "Groups": ["Deal Info"]
		        },
		        "REBATE_TYPE": {
		            "Groups": ["Deal Info"]
		        },
		        "MRKT_SEG": {
		            "Groups": ["Deal Info"]
		        },
		        "GEO_COMBINED": {
		            "Groups": ["Deal Info"]
		        },
		        "TRGT_RGN": {
		            "Groups": ["Deal Info"]
		        },
		        "PAYOUT_BASED_ON": {
		            "Groups": ["Deal Info"]
		        },
		        "PROGRAM_PAYMENT": {
		            "Groups": ["Deal Info"]
		        },
		        "TERMS": {
		            "Groups": ["Deal Info"]
		        },
		        "REBATE_BILLING_START": {
		            "Groups": ["Consumption"]
		        },
		        "REBATE_BILLING_END": {
		            "Groups": ["Consumption"]
		        },
		        "CONSUMPTION_REASON": {
		            "Groups": ["Consumption"]
		        },
		        "CONSUMPTION_REASON_CMNT": {
		            "Groups": ["Consumption"]
		        },
		        "RETAIL_CYCLE": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL_USR_DEF": {
		            "Groups": ["Retail Cycle"]
		        },
		        "RETAIL_PULL_USR_DEF_CMNT": {
		            "Groups": ["Retail Cycle"]
		        },
		        "ECAP_FLR": {
		            "Groups": ["Retail Cycle"]
		        },
		        "BACK_DATE_RSN": {
		            "Groups": ["Backdate"]
		        }
		    };

		    root.wipData = data;
		}, 10);
	}

    // Get all WIP
    objsetService.readWipFromContract($scope.contractData.DC_ID).then(function (response) {
        if (response.data) {
            initGrid(response.data.WIP_DEAL);
        } else {
            debugger;
        }
    });

    

}