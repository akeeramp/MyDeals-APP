(function () {
    'use strict';

    angular
        .module('app.tenderManager')
        .controller('TenderManagerController', TenderManagerController);

    TenderManagerController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$uibModal', '$q', 'objsetService', 'templatesService', 'logger'];

    function TenderManagerController($scope, $state, $filter, $localStorage, $uibModal, $q, objsetService, templatesService, logger) {
        // store template information
        //
        //$scope.isAll = true;
        //$scope.isApproval = false;

        //$scope.data = [];

        //$scope.options = {
        //    "isLayoutConfigurable": false,
        //    "isPricingTableEnabled": true,
        //    "hideToolbar": true,
        //    "isEditable": true
        //};

        //$scope.options.default = {};
        //$scope.options.default.groups = [
        //    { "name": "Deal Info", "order": 0 },
        //    { "name": "Price Info", "order": 1 },
        //    { "name": "Consumption", "order": 2 },
        //    { "name": "Cost Test", "order": 3 },
        //    { "name": "Meet Comp", "order": 4 },
        //    { "name": "Retail Cycle", "order": 5 },
        //    { "name": "Backdate", "order": 6 },
        //    { "name": "All", "order": 99 }
        //];
        //$scope.options.default.groupColumns = {
        //    "tools": {
        //        "Groups": ["Deal Info", "Price Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate"]
        //    },
        //    "details": {
        //        "Groups": ["Price Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate"]
        //    },
        //    "DC_ID": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "START_DT": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "END_DT": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "WF_STG_CD": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "OBJ_SET_TYPE_CD": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "PTR_USER_PRD": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "DEAL_COMB_TYPE": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "VOLUME": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "CREDIT_VOLUME": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "DEBIT_VOLUME": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "BLLG_DT": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "ON_ADD_DT": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "DEAL_SOLD_TO_ID": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "EXPIRE_YCS2": {
        //        "Groups": ["Deal Info"]
        //    },
        //    "ECAP_PRICE": {
        //        "Groups": ["Price Info"]
        //    },
        //    "CAP": {
        //        "Groups": ["Price Info"]
        //    },
        //    "CAP_START_DT": {
        //        "Groups": ["Price Info"]
        //    },
        //    "CAP_END_DT": {
        //        "Groups": ["Price Info"]
        //    },
        //    "YCS2_PRC_IRBT": {
        //        "Groups": ["Price Info"]
        //    },
        //    "YCS2_START_DT": {
        //        "Groups": ["Price Info"]
        //    },
        //    "YCS2_END_DT": {
        //        "Groups": ["Price Info"]
        //    },
        //    "YCS2_OVERLAP_OVERRIDE": {
        //        "Groups": ["Price Info"]
        //    },
        //    //"PRD_COST": {
        //    //    "Groups": ["Cost Test"]
        //    //},
        //    "COST_TYPE_USED": {
        //        "Groups": ["Cost Test"]
        //    },
        //    "COST_TEST_RESULT": {
        //        "Groups": ["Cost Test"]
        //    },
        //    "COST_TEST_FAIL_OVERRIDE": {
        //        "Groups": ["Cost Test"]
        //    },
        //    "COST_TEST_FAIL_OVERRIDE_REASON": {
        //        "Groups": ["Cost Test"]
        //    },
        //    "MEET_COMP_PRICE_QSTN": {
        //        "Groups": ["Meet Comp"]
        //    },
        //    //"COMP_SKU": {
        //    //    "Groups": ["Meet Comp"]
        //    //},
        //    //"COMP_SKU_OTHR": {
        //    //    "Groups": ["Meet Comp"]
        //    //},
        //    //"COMPETITIVE_PRICE": {
        //    //    "Groups": ["Meet Comp"]
        //    //},
        //    //"COMP_BENCH": {
        //    //    "Groups": ["Meet Comp"]
        //    //},
        //    "IA_BENCH": {
        //        "Groups": ["Meet Comp"]
        //    },
        //    //"COMP_TARGET_SYSTEM_PRICE": {
        //    //    "Groups": ["Meet Comp"]
        //    //},
        //    "MEETCOMP_TEST_RESULT": {
        //        "Groups": ["Meet Comp"]
        //    },
        //    "MEETCOMP_TEST_FAIL_OVERRIDE": {
        //        "Groups": ["Meet Comp"]
        //    },
        //    "MEETCOMP_TEST_FAIL_OVERRIDE_REASON": {
        //        "Groups": ["Meet Comp"]
        //    },
        //    "RETAIL_CYCLE": {
        //        "Groups": ["Retail Cycle"]
        //    },
        //    //"RETAIL_PULL": {
        //    //    "Groups": ["Retail Cycle"]
        //    //},
        //    //"RETAIL_PULL_USR_DEF": {
        //    //    "Groups": ["Retail Cycle"]
        //    //},
        //    //"RETAIL_PULL_USR_DEF_CMNT": {
        //    //    "Groups": ["Retail Cycle"]
        //    //},
        //    "ECAP_FLR": {
        //        "Groups": ["Retail Cycle"]
        //    },
        //    "BACK_DATE_RSN": {
        //        "Groups": ["Backdate"]
        //    }
        //};


        $scope.loadData = function() {
            //$scope.data = [];
            $scope.data.push({ "DC_ID": 100, "START_DT": "1/1/2018" });
            $scope.$broadcast('syncDs');
        }

        //, objsetService.readPricingTable(270)]
        //$q.all([templatesService.readTemplates()])
        //    .then(function (responses) {

        //        $scope.templateData = responses[0].data;
        //        $scope.options.columns = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.columns;
        //        $scope.options.model = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.model;

        //    }).catch(function (data) {
        //        $scope.templateData = null;
        //    })['finally'](function () {

        //    });

        $scope.data = [];
        $scope.options = {};

        $q.all([templatesService.readTemplates(), objsetService.readPricingTable(1011)])
            .then(function (responses) {

                $scope.templateData = responses[0].data;
                //$scope.data = responses[1].data.WIP_DEAL;

                $scope.options = {
                    "isLayoutConfigurable": false,
                    "isPricingTableEnabled": true,
                    "hideToolbar": false,
                    "isEditable": true
                };

                $scope.options.columns = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.columns;
                $scope.options.model = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.model;

                $scope.options.default = {};
                $scope.options.default.groups = [
                    { "name": "Editor", "order": 0 },
                    { "name": "Approval", "order": 1 },
                    { "name": "Deal Info", "order": 2, "isPinned": true },
                    { "name": "All", "order": 99 }
                ];
                $scope.options.default.groupColumns = {
                    "tools": {
                        "Groups": ["Editor"]
                    },
                    "details": {
                        "Groups": ["Approval"]
                    },
                    "master_child": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "TITLE": {
                        "Groups": ["Deal Info"]
                    },
                    "PTR_USER_PRD": {
                        "Groups": ["Deal Info"]
                    },
                    "WF_STG_CD": {
                        "Groups": ["Deal Info"]
                    },
                    "PRJ_NM": {
                        "Groups": ["Deal Info"]
                    },
                    "END_CUSTOMER": {
                        "Groups": ["Deal Info"]
                    },
                    "OEM": {
                        "Groups": ["Deal Info"]
                    },
                    "ECAP_PRICE": {
                        "Groups": ["Deal Info"]
                    },
                    "CAP": {
                        "Groups": ["Deal Info"]
                    },
                    "CAP_START_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "CAP_END_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "BID_GEO": {
                        "Groups": ["Deal Info"]
                    },
                    "BID_RGN": {
                        "Groups": ["Deal Info"]
                    },
                    "GEO_COMBINED": {
                        "Groups": ["Deal Info"]
                    },
                    "VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "START_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "END_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "COMP_SKU": {
                        "Groups": ["Deal Info"]
                    },
                    "COMPETITIVE_PRICE": {
                        "Groups": ["Deal Info"]
                    },
                    "BACK_DATE_RSN": {
                        "Groups": ["Deal Info"]
                    },
                    "COMP_BENCH": {
                        "Groups": ["Deal Info"]
                    },
                    "IA_BENCH": {
                        "Groups": ["Deal Info"]
                    }
                };

            }).catch(function (data) {
                $scope.templateData = null;
                $scope.data = null;
            })['finally'](function () {

            });

    }
})();