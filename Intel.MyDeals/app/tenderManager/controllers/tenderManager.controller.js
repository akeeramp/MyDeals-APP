(function () {
    'use strict';

    angular
        .module('app.tenderManager')
        .controller('TenderManagerController', TenderManagerController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    TenderManagerController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger'];

    function TenderManagerController($scope, $state, $filter, $localStorage, $compile, $uibModal, $timeout, $q, objsetService, templatesService, logger) {

        $scope.data = [];
        $scope.options = {};
        $scope.optionsDetails = {};
        $scope.dataDetails = {};
        $scope.newDataItemToAddOnExpand = null;

        $scope.isBusy = false;
        $scope.isBusyMsgTitle = "";
        $scope.isBusyMsgDetail = "";
        $scope.isBusyType = "";
        $scope.newDealId = -100;

        $scope.setBusy = function (msg, detail, msgType) {
            $timeout(function () {
                var newState = msg != undefined && msg !== "";

                // if no change in state, simple update the text
                if ($scope.isBusy === newState) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    return;
                }

                $scope.isBusy = newState;
                if ($scope.isBusy) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                } else {
                    $timeout(function () {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                    }, 500);
                }
            });
        }

        $scope.loadData = function () {
            $scope.setBusy("Searching...", "Searching for Tender Deals");

            objsetService.readTender(2).then(
            function (response) {
                var data = response.data.MASTER;
                applyTempSecurities(data, "MASTER");
                $scope.data = data;
                $scope.setBusy("", "");
            },
            function (result) {
                $scope.setBusy("Search Failed", "Unable to Search for Tender Deals");
                $timeout(function () {
                    $scope.setBusy("", "");
                }, 4000);
            });
        }

        $scope.renderCustNm = function (dataItem) {
            return dataItem.CUST_MBR_SID;
        }

        function detailInit(e) {
            var detailRow = e.detailRow;

            var prntId = e.data.DC_ID;
            var row = detailRow.find(".tenderChildGrid");
            var tmplt = '<div op-grid class="tender-grid" op-data="dataDetails.DC_ID_' + prntId + '" op-options="optionsDetails"></div>';

            if (!!$scope.dataDetails['DC_ID_' + prntId]) {
                $(row).append($compile(tmplt)($scope));
                return;
            }

            detailRow.find(".tenderChildGrid").html('<div><img src="/images/032.gif" style="padding: 0 10px;"/> Loading Related Tender Bids</div>');

            objsetService.readTenderChildren(e.data.DC_ID).then(
            function (response) {

                row.html('');
                var data = response.data["WIP_DEAL"];

                applyDefaults(data, "WIP_DEAL");
                applyTempSecurity(data, "WIP_DEAL");

                if ($scope.newDataItemToAddOnExpand !== null) {
                    data.unshift($scope.newDataItemToAddOnExpand);
                    $scope.newDataItemToAddOnExpand = null;
                }

                $scope.dataDetails['DC_ID_' + prntId] = data;

                $(row).append($compile(tmplt)($scope));

            },
            function (result) {
                //debugger;
            });

        }

        function applyTempSecurities(data, mode) {
            // TODO temp override security until it can be setup
            for (var i = 0; i < data.length; i++) {
                applyTempSecurity(data[i], mode);
            }
        }
        function applyTempSecurity(data, mode) {
            // TODO temp override security until it can be setup

            if (!data._behaviors) data._behaviors = {};
            //if (!data._behaviors.isReadOnly)
            data._behaviors.isReadOnly = {};
            //if (!data._behaviors.isRequired)
            data._behaviors.isRequired = {};
            //if (!data._behaviors.isHidden)
            data._behaviors.isHidden = {};

            if (mode === "WIP_DEAL") {
                data._behaviors.isReadOnly["WF_STG_CD"] = true;
                data._behaviors.isReadOnly["CAP_INFO"] = true;
                data._behaviors.isReadOnly["PTR_USER_PRD"] = true;
                data._behaviors.isReadOnly["TITLE"] = true;
                data._behaviors.isReadOnly["END_CUSTOMER_RETAIL"] = true;
            } else if (mode === "MASTER") {
                data._behaviors.isReadOnly["Customer"] = true;
                data._behaviors.isReadOnly["CUST_MBR_SID"] = true;
                data._behaviors.isReadOnly["WF_STG_CD"] = true;
                data._behaviors.isReadOnly["CAP_INFO"] = true;
                data._behaviors.isReadOnly["TITLE"] = true;
            }

        }

        function applyDefaults(data, mode, applyDefault) {
            data.id = $scope.newDealId--;
            data.DC_ID = $scope.newDealId--;
            data.OBJ_SET_TYPE_CD = "TENDER";
            data.WF_STG_CD = "Draft";

            if (applyDefault) {
                data.GEO_COMBINED = "Worldwide";
                data.PROGRAM_PAYMENT = "Backend";
                data.PAYOUT_BASED_ON = "Consumption";
                data.DEAL_COMB_TYPE = "Mutually Exclusive";
            }

            if (!data.Customer) data.Customer = {};
            data.dc_parent_type = "";
            data.dc_type = mode;
            data.CUST_MBR_SID = (mode === "MASTER") ? 1 : ""; // Master if for all customers
            data.dc_parent_type = (mode === "WIP_DEAL") ? "MASTER" : "";
        }

        $scope.create = function (mode) {
            var newData = util.deepClone($scope.templateData.ObjectTemplates.MASTER.TENDER);
            applyDefaults(newData, "MASTER", true);
            applyTempSecurity(newData, "MASTER");
            $scope.$broadcast('addRow', newData);
        }

        $scope.addDeal = function (dataItem) {
            var newData = util.deepClone(dataItem);
            newData.DC_PARENT_ID = dataItem.DC_ID;
            applyDefaults(newData, "WIP_DEAL", true);
            applyTempSecurity(newData, "WIP_DEAL");
            return newData;
        }

        $scope.copyDeal = function (dataItem) {
            var newData = util.deepClone(dataItem);
            newData.CUST_MBR_SID = "";
            newData.Customer = {};
            applyDefaults(newData, "WIP_DEAL");
            applyTempSecurity(newData, "WIP_DEAL");
            return newData;
        }

        $scope.saveCell = function (dataItem, newField, scopeDirective, newValue) {
            $timeout(function () {
                if (newField === "Customer") dataItem.CUST_MBR_SID = dataItem.Customer.CUST_SID;

                if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
                dataItem._behaviors.isDirty[newField] = true;
                dataItem._dirty = true;
                $scope._dirty = true;

                $timeout(function () {
                    //scopeDirective.contractDs.sync();
                }, 100);
            }, 100);
            
        }

        $scope.saveEntireContract = function() {
            var data = $scope.data;
            debugger;
        }

        $scope.saveAndValidate = function() {
            $scope.$broadcast('saveOpGridData');
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
                    "isEditable": true,
                    "resizable":false,
                    "detailTemplateName": "detail-template",
                    "detailInit": detailInit
                };

                $scope.options.columns = $scope.templateData.ModelTemplates.MASTER.TENDER.columns;
                $scope.options.model = $scope.templateData.ModelTemplates.MASTER.TENDER.model;
                
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
                    "dc_type": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_PARENT_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "_dirty": {
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
                    "QLTR_PROJECT": {
                        "Groups": ["Deal Info"]
                    },
                    "END_CUSTOMER_RETAIL": {
                        "Groups": ["Deal Info"]
                    },
                    "Customer": {
                        "Groups": ["Deal Info"]
                    },
                    "ECAP_PRICE": {
                        "Groups": ["Deal Info"]
                    },
                    "CAP_INFO": {
                        "Groups": ["Deal Info"]
                    },
                    "QLTR_BID_GEO": {
                        "Groups": ["Deal Info"]
                    },
                    "GEO_COMBINED": {
                        "Groups": ["Deal Info"]
                    },
                    "VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "MRKT_SEG": {
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

                // details settings
                $scope.optionsDetails = util.deepClone($scope.options);
                $scope.optionsDetails.hideToolbar = true;
                $scope.optionsDetails.scrollable = false;
                $scope.optionsDetails.pageable = false;
            },
            function (result) {
                //debugger;
            });



    }
})();