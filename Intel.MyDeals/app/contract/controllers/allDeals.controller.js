angular
    .module('app.contract')
    .controller('AllDealsController', AllDealsController)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

// logger :Injected logger service to for loging to remote database or throwing error on the ui
// dataService :Application level service, to be used for common api calls, eg: user token, department etc
AllDealsController.$inject = ['$scope', '$state', '$stateParams', '$filter', 'objsetService', 'confirmationModal', 'dataService', 'logger', '$uibModal', '$timeout'];

function AllDealsController($scope, $state, $stateParams, $filter, objsetService, confirmationModal, dataService, logger, $uibModal, $timeout) {


	// Variables
    var root = $scope.$parent;	// Access to parent scope
    root.curPricingTable.DC_ID = undefined;
    root.wipData = [];
    $scope.loading = true;
    $scope.msg = "Loading Deals";

    gridUtils.onDataValueChange = function (e) {
        root._dirty = true;
    }

    // Generates options that kendo's html directives will use
    function initGrid(data) {

		$timeout(function () {
		    var order = 0;
		    var dealTypes = [
                { dealType: "ECAP", name: "ECAP" },
                { dealType: "VOL_TIER", name: "Volume Tier" },
                { dealType: "KIT", name: "Kit" },
                { dealType: "PROGRAM", name: "Program" }
		    ];
		    var show = [
		        "DC_ID", "PASSED_VALIDATION", "CUST_MBR_SID", "TRKR_NBR", "START_DT", "END_DT", "OBJ_SET_TYPE_CD",
		        "WF_STG_CD", "PRODUCT_CATEGORIES", "TITLE", "DEAL_COMB_TYPE", "DEAL_DESC", "TIER_NBR", "ECAP_PRICE",
		        "KIT_ECAP", "VOLUME", "CONSUMPTION_REASON", "PAYOUT_BASED_ON", "PROGRAM_PAYMENT", "MRKT_SEG", "GEO_COMBINED",
		        "REBATE_TYPE", "TERMS", "TOTAL_DOLLAR_AMOUNT"
		    ];
		    var usedCols = [];
		    var excludeCols = ["details", "tools"];

		    root.wipOptions = {};
		    root.wipOptions.isPinEnabled = false;
		    root.wipOptions.default = {};
		    root.wipOptions.default.groups = [];
		    root.wipOptions.default.groupColumns = {};
		    root.wipOptions.columns = [];
		    root.wipOptions.model = { fields: {}, id: "DC_ID" };

		    var hasDeals = [];
            for (var x = 0; x < data.length; x++) {
                if (hasDeals.indexOf(data[x].OBJ_SET_TYPE_CD) < 0) hasDeals.push(data[x].OBJ_SET_TYPE_CD);
            }

		    for (var d = 0; d < dealTypes.length; d++) {
		        var dealType = dealTypes[d];
		        if (hasDeals.indexOf(dealType.dealType) >= 0) {
		            root.wipOptions.default.groups.push({ "name": dealType.name, "order": order++ });

		            var wipTemplate = root.templates.ModelTemplates.WIP_DEAL[dealType.dealType];
		            for (var c = 0; c < wipTemplate.columns.length; c++) {
		                var col = wipTemplate.columns[c];

		                col.hidden = show.indexOf(col.field) < 0;
		                col.locked = false;

		                //col.template = undefined;

		                if (excludeCols.indexOf(col.field) < 0) {
		                    // add to column
		                    if (usedCols.indexOf(col.field) < 0) {
		                        usedCols.push(col.field);
		                        root.wipOptions.columns.push(col);
		                    }

		                    // Add to group columns

		                    if (root.wipOptions.default.groupColumns[col.field] === undefined)
		                        root.wipOptions.default.groupColumns[col.field] = { Groups: [] };

		                    if (!col.hidden) {
		                        root.wipOptions.default.groupColumns[col.field].Groups.push(dealType.name);
		                    }
		                    if (root.wipOptions.default.groupColumns[col.field].Groups.indexOf("All") < 0)
		                        root.wipOptions.default.groupColumns[col.field].Groups.push("All");
		                }
		            }


		            Object.keys(wipTemplate.model.fields).forEach(function (key, index) {
		                if (excludeCols.indexOf(key) < 0) {
		                    if (root.wipOptions.model.fields[key] === undefined)
		                        root.wipOptions.model.fields[key] = this[key];
		                }
		            }, wipTemplate.model.fields);
		        }
		    }
		    root.wipOptions.default.groups.push({ "name": "All", "order": order++ });

		    root.wipData = data;
		}, 10);
	}

    // Get all WIP
    objsetService.readWipFromContract($scope.contractData.DC_ID).then(function (response) {
        if (response.data) {
            initGrid(response.data.WIP_DEAL);
            $scope.msg = "Drawing Grid";
            $timeout(function () {
                $scope.msg = "Done";
                $scope.loading = false;
            }, 2000);
        }
    });

    

}