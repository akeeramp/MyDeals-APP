(function () {
    'use strict';

    angular
        .module('app.tenderManager')
        .controller('TenderManagerController', TenderManagerController);

    TenderManagerController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger'];

    function TenderManagerController($scope, $state, $filter, $localStorage, $uibModal, $timeout, $q, objsetService, templatesService, logger) {

        $scope.data = [];
        $scope.options = {};

        $scope.isBusy = false;
        $scope.isBusyMsgTitle = "";
        $scope.isBusyMsgDetail = "";

        $scope.setBusy = function (msg, detail) {
            $timeout(function () {
                var newState = msg != undefined && msg !== "";

                // if no change in state, simple update the text
                if ($scope.isBusy === newState) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    return;
                }

                $scope.isBusy = newState;
                if ($scope.isBusy) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                } else {
                    $timeout(function () {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                    }, 500);
                }
            });
        }



        $scope.loadData = function () {
            $scope.setBusy("Searching...", "Searching for Tender Deals");

            templatesService.readTemplates().then(
            function (response) {
                $scope.data.push({ "DC_ID": 100, "START_DT": "1/1/2018" });
                $scope.data.push({ "DC_ID": 101, "START_DT": "1/1/2018" });
                $scope.data.push({ "DC_ID": 102, "START_DT": "1/1/2018" });
                $scope.data.push({ "DC_ID": 103, "START_DT": "1/1/2018" });
                $scope.data.push({ "DC_ID": 104, "START_DT": "1/1/2018" });
                $scope.data.push({ "DC_ID": 105, "START_DT": "1/1/2018" });
                $scope.setBusy("", "");
            },
            function (result) {
                $scope.setBusy("Search Failed", "Unable to Search for Tender Deals");
                $timeout(function () {
                    $scope.setBusy("", "");
                }, 4000);
            });
        }



        templatesService.readTemplates().then(
            function (response) {
                $scope.templateData = response.data;

                $scope.options = {
                    "isLayoutConfigurable": false,
                    "isPricingTableEnabled": true,
                    "isVisibleAdditionalDiscounts": false,
                    "hideToolbar": false,
                    "isCustomToolbarEnabled": true,
                    "isPinEnabled": false,
                    "isEditable": true
                };

                $scope.options.columns = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.columns;
                $scope.options.model = $scope.templateData.ModelTemplates.WIP_DEAL.ECAP.model;

                $scope.options.default = {};
                $scope.options.default.groups = [
                    { "name": "All Tenders", "order": 0 },
                    { "name": "Approval Status", "order": 1 },
                    { "name": "Deal Info", "order": 2, "isPinned": true, "isTabHidden": true }
                ];
                $scope.options.default.groupColumns = {
                    "tools": {
                        "Groups": ["All Tenders"]
                    },
                    "details": {
                        "Groups": ["Approval Status"]
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

            },
            function (result) {
                //debugger;
            });



    }
})();