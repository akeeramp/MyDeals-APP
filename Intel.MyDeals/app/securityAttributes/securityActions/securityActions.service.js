(function () {
    'use strict';
    angular
        .module('app.securityAttributes')
        .factory('SecurityActionsService', SecurityActionsService);

    SecurityActionsService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function SecurityActionsService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/SecurityAttributesAPI/' // TODO: Maaybe put this in a nicer place to reference off of

        return {
            getActions: getActions
			, insertAction: insertAction
			, updateAction: updateAction
			, deleteAction: deleteAction
        }

        function getActions() {
            return dataService.get(URL + 'GetSecurityActions');
        }

        function insertAction(action) {
            return dataService.post(URL + 'InsertAction', action);
        }

        function updateAction(action) {
            return dataService.post(URL + 'UpdateAction', action);
        }

        function deleteAction(id) {
            return dataService.Delete(URL + 'DeleteAction?id=' + id);
        }
    }
})();
