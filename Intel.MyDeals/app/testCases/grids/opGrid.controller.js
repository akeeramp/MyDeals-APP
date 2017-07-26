(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('opGridController', opGridController);

    opGridController.$inject = ['$uibModal', '$scope', '$q', 'objsetService', 'templatesService', 'logger'];

    function opGridController($uibModal, $scope, $q, objsetService, templatesService, logger) {

        $scope.data = [];
        $scope.options = {};

        $q.all([templatesService.readTemplates(), objsetService.readPricingTable(270)])
            .then(function (responses) {
            
                $scope.templateData = responses[0].data;
                $scope.data = responses[1].data.WIP_DEAL;

                $scope.options.columns = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.columns;
                $scope.options.model = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.model;

                //debugger;
                // Now, let's stage the data so we can test
                $scope.data[3]._behaviors.isReadOnly["VOLUME"] = true;
                $scope.data[2]._behaviors.isHidden["VOLUME"] = true;
                $scope.data[0]._behaviors.isRequired["VOLUME"] = true;
                $scope.data[1]._behaviors.isRequired["VOLUME"] = true;
                $scope.data[2]._behaviors.isRequired["VOLUME"] = true;
                $scope.data[3]._behaviors.isRequired["VOLUME"] = true;

                $scope.data[5].VOLUME = null;
                $scope.data[5]._behaviors.isReadOnly["VOLUME"] = true;
                $scope.data[5]._behaviors.isRequired["VOLUME"] = true;


                $scope.options.default = {};
                $scope.options.default.groups = [
                    { "name": "Deal Info", "order": 0 },
                    { "name": "Price Info", "order": 1 },
                    { "name": "Consumption", "order": 2 },
                    { "name": "Cost Test", "order": 3 },
                    { "name": "Meet Comp", "order": 4 },
                    { "name": "Retail Cycle", "order": 5 },
                    { "name": "Backdate", "order": 6 },
                    { "name": "All", "order": 99 }
                ];
                $scope.options.default.groupColumns = {
                    "tools": {
                        "Groups": ["Deal Info", "Price Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate"]
                    },
                    "details": {
                        "Groups": ["Price Info", "Consumption", "Cost Test", "Meet Comp", "Retail Cycle", "Backdate"]
                    },
                    "DC_ID": {
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
                    "DEAL_COMB_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "CREDIT_VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "DEBIT_VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "BLLG_DT": {
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
                    "ECAP_PRICE": {
                        "Groups": ["Price Info"]
                    },
                    "CAP": {
                        "Groups": ["Price Info"]
                    },
                    "CAP_START_DT": {
                        "Groups": ["Price Info"]
                    },
                    "CAP_END_DT": {
                        "Groups": ["Price Info"]
                    },
                    "YCS2_PRC_IRBT": {
                        "Groups": ["Price Info"]
                    },
                    "YCS2_START_DT": {
                        "Groups": ["Price Info"]
                    },
                    "YCS2_END_DT": {
                        "Groups": ["Price Info"]
                    },
                    "YCS2_OVERLAP_OVERRIDE": {
                        "Groups": ["Price Info"]
                    },
                    //"PRD_COST": {
                    //    "Groups": ["Cost Test"]
                    //},
                    "COST_TYPE_USED": {
                        "Groups": ["Cost Test"]
                    },
                    "COST_TEST_RESULT": {
                        "Groups": ["Cost Test"]
                    },
                    "COST_TEST_FAIL_OVERRIDE": {
                        "Groups": ["Cost Test"]
                    },
                    "COST_TEST_FAIL_OVERRIDE_REASON": {
                        "Groups": ["Cost Test"]
                    },
                    "MEET_COMP_PRICE_QSTN": {
                        "Groups": ["Meet Comp"]
                    },
                    //"COMP_SKU": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_SKU_OTHR": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMPETITIVE_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_BENCH": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    "IA_BENCH": {
                        "Groups": ["Meet Comp"]
                    },
                    //"COMP_TARGET_SYSTEM_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    "MEETCOMP_TEST_RESULT": {
                        "Groups": ["Meet Comp"]
                    },
                    "MEETCOMP_TEST_FAIL_OVERRIDE": {
                        "Groups": ["Meet Comp"]
                    },
                    "MEETCOMP_TEST_FAIL_OVERRIDE_REASON": {
                        "Groups": ["Meet Comp"]
                    },
                    "RETAIL_CYCLE": {
                        "Groups": ["Retail Cycle"]
                    },
                    //"RETAIL_PULL": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF_CMNT": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    "ECAP_FLR": {
                        "Groups": ["Retail Cycle"]
                    },
                    "BACK_DATE_RSN": {
                        "Groups": ["Backdate"]
                    }
                };

            }).catch(function (data) {
                $scope.templateData = null;
                $scope.data = null;
            })['finally'](function() {
                
            });

        //$scope.templateData = null;
        //function loadTemplates() {
        //    templatesService.readTemplates().then(
        //        function (results) {
        //            $scope.templateData = results.data;
        //        },
        //        function (response) {
        //            logger.error("Could not save the contract.", response, response.statusText);
        //        }
        //    );

        //}

        //loadTemplates();
    };
})();

