(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('CacheController', CacheController);

    // logger :Injected logger service to for loging to remote database or throwing error on the ui
    // dataService :Application level service, to be used for common api calls, eg: user token, department etc
    CacheController.$inject = ['dataService', 'cacheService', 'logger'];

    function CacheController(dataService, cacheService, logger) {

        // Decalre public variables, function at top followed by private functions
        var vm = this;
        vm.title = "Cache Manager";
        vm.cacheData = [];
        vm.apiCacheData = [];
        vm.currentCacheDetails = "";
        vm.loadCache = loadCache;
        vm.clearAll = clearAll;
        vm.reloadAll = reloadAll;
        vm.loadCacheByName = loadCacheByName;
        vm.clearCacheByName = clearCacheByName;
        vm.viewCacheByName = viewCacheByName;
        vm.loadApiCache = loadApiCache;
        vm.clearApiCacheByName = clearApiCacheByName
        vm.clearAllApiCache = clearAllApiCache;

        //Get the cache Status
        function loadCache() {
            cacheService.getStaticCacheStatus().then(
                function (data) {
                    vm.cacheData = data;
                    // TODO: Create a http interceptor service to show the loading status
                }, function (data) {
                    logger.error("Error in getting cache staus.")
                });
        }

        // Clear all the cache
        function clearAll() {
            resetCache();
            cacheService.clearStaticCache().then(function () {
                logger.success("Deleted successfully.")
                vm.loadCache();
            }, function (e) {
                //  TODO: Wrap thse functions under logger service along with Opaque utilities
                op.notifyError(e.statusText, "Unable to Clear Cache");
            });
        }

        // Reload all the cache
        function reloadAll() {
            resetCache();
            cacheService.reloadAllStaticCache().then(function () {
                vm.loadCache();
            }, function (e) {
                // TODO: Wrap thse functions under logger service along with Opaque utilities
                op.notifyError(e.statusText, "Unable to Load Cache Status");
                vm.defaultStatus();
            });
        }

        //load cache by name
        function loadCacheByName(data) {
            data.loading = true;
            vm.currentCacheDetails = "";
            cacheService.loadStaticCacheByName(data).then(function () {
                vm.loadCache();
            }, function (e) {
                // TODO: Wrap thse functions under logger service along with Opaque utilities along with Opaque utilities
                op.notifyError(e.statusText, "Unable to load cache.");
                data.loading = false;
            });
        }

        // Clear cache by name
        function clearCacheByName(data) {
            data.loading = true;
            vm.currentCacheDetails = "";
            cacheService.clearStaticCacheByName(data).then(function () {
                logger.success("Deleted successfully")
                vm.loadCache();
            }, function (e) {
                // TODO: Wrap thse functions under logger service along with Opaque utilities along with Opaque utilities
                op.notifyError(e.statusText, "Unable to clear cache.");
                data.loading = false;
            });
        }

        // View static cache by name
        function viewCacheByName(data) {
            data.loading = true;
            vm.currentCacheDetails = "";
            cacheService.viewStaticCacheByName(data).then(function (result) {
                vm.currentCacheDetails = util.isNull(result) ? "<< no data found >>" : result;
                data.loading = false;
            }, function (e) {
                op.notifyError(e.statusText, "Unable to retrieve cache details.");
                data.loading = false;
            });
        }

        // Load the api cache details
        function loadApiCache() {
            vm.currentCacheDetails = "";
            cacheService.getApiCacheStatus().then(function (data) {
                vm.apiCacheData = data;
            }, function (e) {
                op.notifyError(e.statusText, "Unable to Load Cache Status");
            });
        }

        // Clear api cache by name
        function clearApiCacheByName(data) {
            vm.currentCacheDetails = "";
            cacheService.clearApiCacheByName(data).then(function () {
                vm.loadApiCache();
            }, function (e) {
                op.notifyError(e.statusText, "Unable to Load Cache Status");
            });
        }

        // Clear all api cache
        function clearAllApiCache() {
            vm.currentCacheDetails = "";
            cacheService.clearApiCache().then(function () {
                logger.success("Api cache cleared successfully");
                vm.loadApiCache();
            }, function (e) {
                op.notifyError(e.statusText, "Unable to Load Cache Status");
            });
        }

        function defaultStatus() {
            for (var i = 0; i < vm.cacheData.length; i++) {
                vm.cacheData[i]["loading"] = false;
            }
        }

        function loadingStatus() {
            for (var i = 0; i < vm.cacheData.length; i++) {
                vm.cacheData[i]["loading"] = true;
            }
        }

        function resetCache() {
            loadingStatus();
            vm.currentCacheDetails = "";
        }

        //Initial load functions to be called at the end
        vm.loadCache();
        vm.loadApiCache();
    }
})();