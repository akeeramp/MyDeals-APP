
(function () {

    var cacheController = function ($scope, $http) {

        $scope.cacheData = [];
        $scope.currentCacheDetails = "";
        $scope.clearAllUrl = "/api/Cache/v1/GetCacheClear";
        $scope.reloadAllUrl = "/api/Cache/v1/GetCacheReload";
        $scope.loadCacheUrl = "/api/Cache/v1/GetCacheStatus";
        $scope.loadCacheByNameUrl = "/api/Cache/v1/GetCacheLoad/";
        $scope.clearCacheByNameUrl = "/api/Cache/v1/GetCacheClear/";
        $scope.viewCacheByNameUrl = "/api/Cache/v1/GetCacheView/";

        $scope.apiCacheData = [];
        $scope.getApiCacheStatusUrl = "/api/Cache/v1/GetApiCacheStatus";
        $scope.getApiCacheClearUrl = "/api/Cache/v1/GetApiCacheClear";
        $scope.clearApiCacheurl = "/api/Cache/v1/ClearApiCache";
        
        $scope.clearAll = function () {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.clearAllUrl)
                .then(function () {
                    $scope.loadCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Clear Cache");
                    $scope.defaultStatus();
                });
        }

        $scope.clearAll = function () {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.clearAllUrl)
                .then(function () {
                    $scope.loadCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Clear Cache");
                    $scope.defaultStatus();
                });
        }

        $scope.reloadAll = function () {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.reloadAllUrl)
                .then(function () {
                    $scope.loadCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Load Cache Status");
                    $scope.defaultStatus();
                });
        }

        $scope.loadCache = function () {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.loadCacheUrl)
                .then(function (response) {
                    $scope.cacheData = response.data;
                    $scope.defaultStatus();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Load Cache Status");
                    $scope.defaultStatus();
                });
        }

        $scope.loadCacheByName = function (data) {
            data.loading = true;
            $scope.currentCacheDetails = "";
            $http.get($scope.loadCacheByNameUrl + data.CacheName)
                .then(function () {
                    $scope.loadCache();
                }, function(e) {
                    op.notifyError(e.statusText, "Unable to load cache.");
                    data.loading = false;
                });
        }

        $scope.clearCacheByName = function (data) {
            data.loading = true;
            $scope.currentCacheDetails = "";
            $http.get($scope.clearCacheByNameUrl + data.CacheName)
                .then(function () {
                    $scope.loadCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to clear cache.");
                    data.loading = false;
                });
        }

        $scope.viewCacheByName = function(data) {
            data.loading = true;
            $scope.currentCacheDetails = "";
            $http.get($scope.viewCacheByNameUrl + data.CacheName)
                .then(function (response) {
                    $scope.currentCacheDetails = util.isNull(response.data) ? "<< no data found >>" : response.data;
                    data.loading = false;
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to retrieve cache details.");
                    data.loading = false;
                });
        }

        $scope.loadApiCache = function () {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.getApiCacheStatusUrl)
                .then(function (response) {
                    $scope.apiCacheData = response.data;
                    $scope.defaultStatus();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Load Cache Status");
                    $scope.defaultStatus();
                });
        }

        $scope.clearApiCacheByName = function (data) {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.post($scope.clearApiCacheurl, data)
                .then(function (response) {
                    $scope.loadApiCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Load Cache Status");
                });
        }

        $scope.clearAllApiCache = function (data) {
            $scope.loadingStatus();
            $scope.currentCacheDetails = "";
            $http.get($scope.getApiCacheClearUrl)
                .then(function (response) {
                    $scope.loadApiCache();
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to Load Cache Status");
                });
        }

        $scope.defaultStatus = function() {
            for (var i = 0; i < $scope.cacheData.length; i++) {
                $scope.cacheData[i]["loading"] = false;
            }
        }

        $scope.loadingStatus = function () {
            for (var i = 0; i < $scope.cacheData.length; i++) {
                $scope.cacheData[i]["loading"] = true;
            }
        }

        $scope.loadApiCache();
    }

    var app = angular.module('MyDealsApp', []);
    app.controller('CacheCtrl', cacheController);

}());