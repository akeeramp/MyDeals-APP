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
            updateUserSubscriptions: updateUserSubscriptions
        }

        function getUserSubscriptions() {
            return dataService.get(apiBaseUrl + 'GetUserSubscriptions');
        }

        function updateUserSubscriptions(subscriptions) {
            return dataService.post(apiBaseUrl + 'UpdateUserSubscriptions', subscriptions);
        }
    }
})();