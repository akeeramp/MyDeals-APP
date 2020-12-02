(function () {
    'use strict';
    angular
        .module('app.core')
        .factory('userPreferencesService', userPreferencesService);

    userPreferencesService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function userPreferencesService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/UserPreferences/';

        return {
            getActions: getActions
            , updateAction: updateAction
            , clearAction: clearAction
        }

        function getActions(category, subCategory) {
            return dataService.get(URL + 'Get/' + category + '/' + subCategory);
        }

        function updateAction(category, subCategory, key, value) {
            var dto = {
                'value': value
            }

            return dataService.post(URL + 'Update/' + category + '/' + subCategory + '/' + key, dto);
        }

        function clearAction(category, subCategory) {
            return dataService.post(URL + 'Clear/' + category + '/' + subCategory, null);
        }
    }
})();
