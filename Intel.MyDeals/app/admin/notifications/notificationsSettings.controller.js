(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('notificationsController', notificationsController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    notificationsController.$inject = ['$scope', 'dataService', '$uibModalInstance', 'notificationsService'];

    function notificationsController($scope, dataService, $uibModalInstance, notificationsService) {

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
            }, function (response) {
                logger.error("Unable to get user subscription.", response, response.statusText);
            });
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