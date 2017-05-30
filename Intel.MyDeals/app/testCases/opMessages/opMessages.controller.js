(function () {
    'use strict';

    angular.module('app.testCases')
        .controller('opMessagesController', opMessagesController);

    opMessagesController.$inject = ['$compile', '$scope', '$timeout', 'templatesService', '$filter', 'confirmationModal', 'objsetService'];

    function opMessagesController($compile, $scope, $timeout, templatesService, $filter, confirmationModal, objsetService) {
        $scope.messagetypes = { 'inline': true };
        $scope.warningMessages = {};
        $scope.infoMessages = {};

        $scope.contractData = {
            "TITLE": "",
            "CONTRACT_STATUS": "",
            "OBJ_SET_TYPE_CD": "ALL_TYPES",
            "CUST_MBR_SID": "",
            "START_DT": "",
            "END_DT": "",
            "C2A_DATA_C2A_ID": "",
            "CUST_ACCNT_DIV": "",
            "BACK_DATE_RSN": "",
            "CUST_ACCPT": "",
            "NOTES": "",
            "DC_ID": 0,
            "DC_PARENT_ID": 0,
            "dc_type": 1,
            "dc_parent_type": 0,
            "_behaviors": {
                "isRequired": {
                    "TITLE": true,
                    "CUST_MBR_SID": true,
                    "START_DT": true,
                    "END_DT": true
                },
                "isReadOnly": {},
                "isHidden": {},
                "isError": {},
                "validMsg": {}
            },
            "PRC_ST": []
        }
        $scope.save = function () {
            $scope.isValid = true;
            // As is from contract manager
            angular.forEach($scope.contractData, function (value, key) {
                $scope.contractData._behaviors.validMsg[key] = "";
                $scope.contractData._behaviors.isError[key] = false;
            });

            // Get the error messages, validation messages
            angular.forEach($scope.contractData, function (value, key) {
                if (key[0] !== '_' && value !== undefined && value !== null && !Array.isArray(value) &&
                    typeof (value) !== "object" && (typeof (value) === "string" && value.trim() === "") && $scope.contractData._behaviors.isRequired[key] === true
                    && $scope.contractData._behaviors.validMsg[key] === "") {
                    $scope.contractData._behaviors.validMsg[key] = "* field is required";
                    $scope.contractData._behaviors.isError[key] = true;
                    $scope.isValid = false;
                }
                if ($scope.contractData._behaviors.validMsg[key] !== "") {
                    $scope.isValid = false;
                }
            });

            if ($scope.isValid) {
                $scope.contractData.DC_ID = -101;
                createContract();
            }
        }

        var createContract = function () {
            objsetService.createContract($scope.contractData.CUST_MBR_SID, $scope.contractData).then(function (data) {
                $scope.checkForMessages($scope.contractData, 'CNTRCT', data);
            });
        }

        // Check the messages from MT and DB, map them at attribute level behaviors also in Validation summary
        $scope.checkForMessages = function (collection, key, data) {
            var isValid = true;
            if (data.data[key] !== undefined) {
                for (var i = 0; i < data.data[key].length; i++) {
                    if (data.data[key][i].DC_ID !== undefined && data.data[key][i].DC_ID === collection.DC_ID && data.data[key][i].warningMessages.length > 0) {
                        angular.forEach(data.data[key][i]._behaviors.validMsg,
                        function (value, key) {
                            collection._behaviors.validMsg[key] = value;
                            collection._behaviors.isError[key] = value !== "";
                            isValid = false;
                        });
                    }
                }

                // Only one contract, for PS and PT it will be multiple
                $scope.warningMessages = data.data[key][0].warningMessages;
                $scope.infoMessages = data.data[key][0].infoMessages;

                // Add a info message to simulate info messages
                $scope.infoMessages.push("Example info message!!");

                $timeout(function () {
                    if ($scope.messagetypes.modal) {
                        var modalOptions = {
                            closeButtonText: 'Ok',
                            hasActionButton: false,
                            headerText: 'Message from Web Page',
                            bodyText: generateHtmlString()
                        };
                        confirmationModal.showModal({}, modalOptions).then(function (result) {
                        }, function () {
                        });
                    }
                }, 1);

            }
            return isValid;
        }

        var generateHtmlString = function () {
            var html = '<div>Messages from MT and DB:'
                                +'<ul style="font-size:12px">'
                                +'<li ng-repeat="message in warningMessages" ng-if="warningMessages.length > 0">'
                                    + '<p>{{message}}</p>'
                                + '</li>'
                            +'</ul></div>'
            var template = angular.element(html);
            var linkFunction = $compile(template);
            var result = linkFunction($scope);
            $scope.$apply();
            return template.html();
        }
    }
})();