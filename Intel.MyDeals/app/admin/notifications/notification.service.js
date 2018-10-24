(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('notificationsService', notificationsService);

    // Minification safe dependency injection
    notificationsService.$inject = ['$http', 'dataService', 'logger', '$q'];

    function notificationsService($http, dataService, logger, $q) {
        var apiBaseUrl = "api/Notifications/";

        return {
            getUserSubscriptions: getUserSubscriptions,
            updateUserSubscriptions: updateUserSubscriptions,
            getUnreadNotificationCount: getUnreadNotificationCount,
            getNotification: getNotification,
            manageNotifications: manageNotifications,
            getEmailBodyTemplateUI: getEmailBodyTemplateUI
        }

        function getUnreadNotificationCount() {
            return dataService.get(apiBaseUrl + 'GetUnreadNotificationCount');
        }

        function manageNotifications(mode, isRead, ids) {
            return dataService.post(apiBaseUrl + 'manageNotifications/' + mode + '/' + isRead, ids);
        }

        function getNotification(mode) {
            return dataService.get(apiBaseUrl + 'GetNotification/' + mode);
        }

        function getUserSubscriptions() {
            return dataService.get(apiBaseUrl + 'GetUserSubscriptions');
        }

        function updateUserSubscriptions(subscriptions) {
            return dataService.post(apiBaseUrl + 'UpdateUserSubscriptions', subscriptions);
        }

        function getEmailBodyTemplateUI(id) {
            return dataService.get(apiBaseUrl + 'GetEmailBodyTemplateUI/' + id);
        }
    }
})();