(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('notificationsModalController', notificationsModalController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    notificationsModalController.$inject = ['$scope', 'dataService', '$uibModalInstance', 'notificationsService', 'dataItem'];

    function notificationsModalController($scope, dataService, $uibModalInstance, notificationsService, dataItem) {
        $scope.role = window.usrRole;
        $scope.wwid = window.usrWwid;
        $scope.dataItem = dataItem;

        // Close without saving data
        $scope.close = function () {
            $uibModalInstance.close();
        };

        function markAsRead(dataItem) {
            var ids = [dataItem.NLT_ID];

            // If unread mark as read
            if (!dataItem.IS_READ_IND) {
                notificationsService.manageNotifications("UPDATE", true, ids).then(function () {
                    // Marked as Read
                });
            }
        }
        $scope.emailTable = "loading...";

        function loadEmailBody(){
            notificationsService.getEmailBodyTemplateUI(dataItem.NLT_ID).then(function (response) {
                $scope.emailTable = response.data;
            });
        }

        loadEmailBody();
        markAsRead(dataItem);
    }
})();