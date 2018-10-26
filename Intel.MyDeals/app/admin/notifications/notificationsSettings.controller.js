(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('notificationsSettingsController', notificationsSettingsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    notificationsSettingsController.$inject = ['$scope', 'dataService', '$uibModalInstance', 'notificationsService', '$filter'];

    function notificationsSettingsController($scope, dataService, $uibModalInstance, notificationsService, $filter) {

        $scope.role = window.usrRole;
        $scope.wwid = window.usrWwid;

        $scope.subScriptions = [];

        // Select all default values
        $scope.selectAllDefaults = { 'EMAIL_IND': false, 'IN_TOOL_IND': true };

        $scope.selectAll = function (type) {
            for (var i = 0; i <= $scope.subScriptions.length - 1; i++) {
                $scope.subScriptions[i][type] = $scope.selectAllDefaults[type];
            }
        }

        // Close without saving data
        $scope.close = function () {
            $uibModalInstance.close();
        };

        var getUserSubscription = function () {
            notificationsService.getUserSubscriptions().then(function (response) {
                $scope.subScriptions = response.data;
                $scope.setSelectAllValues();
            }, function (response) {
                logger.error("Unable to get user subscription.", response, response.statusText);
            });
        }

        $scope.setSelectAllValues = function () {
            var emailON = $filter('where')($scope.subScriptions, { 'EMAIL_IND': true });
            $scope.selectAllDefaults.EMAIL_IND = emailON.length > 0;

            var inToolON = $filter('where')($scope.subScriptions, { 'IN_TOOL_IND': true });
            $scope.selectAllDefaults.IN_TOOL_IND = inToolON.length > 0;
        }

        // Save data and close
        $scope.saveAndClose = function () {
            notificationsService.updateUserSubscriptions($scope.subScriptions).then(function (response) {
                $uibModalInstance.close();
            }, function (response) {
                logger.error("Unable to get user subscription.", response, response.statusText);
            });
        }

        getUserSubscription();
    }
})();