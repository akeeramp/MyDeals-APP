(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('CacheController', CacheController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    // logger :Injected logger service to for logging to remote database or throwing error on the ui
    // dataService :Application level service, to be used for common api calls, eg: user token, department etc
    CacheController.$inject = ['dataService', 'cacheService', 'logger'];

    function CacheController(dataService, cacheService, logger) {

        // Declare public variables, function at top followed by private functions
        var vm = this;
        //Developer can see the Screen..
        //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
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

        //Initial load functions to be called at the end
        vm.loadCache();
        vm.loadApiCache();

        //Get the cache Status
        function loadCache() {
            cacheService.getStaticCacheStatus().then(
                function (response) {
                    vm.cacheData = response.data;
                }, function (e) {
                    logger.error("Error in getting cache status.", e, e.statusText)
                });
        }

        // Clear all the cache
        function clearAll() {
            resetCache();
            cacheService.clearStaticCache().then(function () {
                logger.success("Deleted successfully.");
                vm.loadCache();
            }, function (e) {
                logger.error("Unable to Clear Cache.", e, e.statusText);
            });
        }

        // Reload all the cache
        function reloadAll() {
            resetCache();
            cacheService.reloadAllStaticCache().then(function () {
                vm.loadCache();
            }, function (e) {
                logger.error("Unable to Load Cache Status", e, e.statusText);
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
                logger.error("Unable to load cache.", e, e.statusText);
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
                logger.error("Unable to clear cache.", e, e.statusText);
                data.loading = false;
            });
        }

        // View static cache by name
        function viewCacheByName(data) {
            data.loading = true;
            vm.currentCacheDetails = "";
            cacheService.viewStaticCacheByName(data).then(function (result) {
                vm.currentCacheDetails = util.isNull(result.data) ? "<< no data found >>" : result.data;
                data.loading = false;
            }, function (e) {
                op.notifyError(e.statusText, "Unable to retrieve cache details.");
                data.loading = false;
            });
        }

        // Load the api cache details
        function loadApiCache() {
            vm.currentCacheDetails = "";
            cacheService.getApiCacheStatus().then(function (response) {
                vm.apiCacheData = response.data;
            }, function (e) {
                logger.error("Unable to Load Api Cache Status", e, e.statusText);
            });
        }

        // Clear api cache by name
        function clearApiCacheByName(data) {
            vm.currentCacheDetails = "";
            cacheService.clearApiCacheByName(data).then(function () {
                vm.loadApiCache();
            }, function (e) {
                logger.error("Unable to clear Api Cache Status", e, e.statusText);
            });
        }

        // Clear all api cache
        function clearAllApiCache() {
            vm.currentCacheDetails = "";
            cacheService.clearApiCache().then(function () {
                logger.success("Api cache cleared successfully");
                vm.loadApiCache();
            }, function (e) {
                logger.error("Unable to clear Cache Status.", e, e.statusText);
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
    }
})();