(function () {
    'use strict';
    angular
        .module('app.admin')
        .factory('ApplicationsService', ApplicationsService);

    ApplicationsService.$inject = ['$cacheFactory', '$q', '$http', 'dataService'];

    function ApplicationsService($cacheFactory, $q, $http, dataService) {
        var URL = '/api/SecurityAttributes/' // TODO: Maybe put this in a nicer place to reference off of

        return {
            getApplications: getApplications
			, insertApplication: insertApplication
			, updateApplication: updateApplication
			, deleteApplication: deleteApplication
        }

        function getApplications() {
            return dataService.get(URL + 'GetAdminApplications');
        }

        function insertApplication(application) {
            return dataService.post(URL + 'InsertAdminApplication', application);
        }

        function updateApplication(application) {
            return dataService.put(URL + 'UpdateAdminApplication', application);
        }

        ////DEV_REBUILD_REMOVALS
        //function deleteApplication(id) {
        //    return dataService.Delete(URL + 'DeleteAdminApplication?id=' + id);
        //}
    }
})();
