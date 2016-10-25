
function cache() { }

cache.callAjax = function(url, errMsg, waitingHandle, waitingMsg) {
    if (waitingHandle === undefined || waitingHandle === null) waitingHandle = "";
    if (waitingMsg !== "") util.waitMsg(waitingMsg);
    if (waitingHandle !== "") $(waitingHandle).show();

    op.ajaxGetAsync(url,
        function (data) {
            cache.LoadCacheStatus();
            if (waitingHandle !== "") $(waitingHandle).hide();
            util.waitMsg('');
        },
        function (e, xhr) {
            op.notifyError(e.responseJSON.Message, errMsg);
            if (waitingHandle !== "") $(waitingHandle).hide();
            util.waitMsg('');
        }
    );
}

cache.ClearCacheByName = function(cacheName) {
    cache.callAjax("/api/Cache/v1/GetCacheClear/" + cacheName, "Unable to Clear Cache", "#anim_" + cacheName, "");
}

cache.LoadCacheByName = function(cacheName) {
    cache.callAjax("/api/Cache/v1/GetCacheLoad/" + cacheName, "Unable to Load Cache", "#anim_" + cacheName, "");
}

cache.ClearCacheAll = function() {
    $("#viewResultsContainer").hide();
    cache.callAjax("/api/Cache/v1/GetCacheClear/", "Unable to Clear Cache", "", "Clearing Cache...");
}

cache.ReloadCacheAll = function() {
    $("#viewResultsContainer").hide();
    cache.callAjax("/api/Cache/v1/GetCacheReload/", "Unable to Clear Cache", "", "Reloading Cache...");
}

cache.ViewCache = function(cacheName) {
    cache.resizeContent();
    $("#cName").html("( " + cacheName + " )");
    $("#viewResults").html('<i class="fa fa-refresh  fa-spin fa-3x fa-fw"></i><div>Loading</div>');
    $("#viewResultsContainer").show();

    op.ajaxGetAsync("/api/Cache/v1/GetCacheView/" + cacheName,
        function (data) {
            $("#viewResults").html(kendo.stringify(data));
            //debugger;
        },
        function (e, xhr) {
            op.notifyError(e.responseJSON.Message, "Unable to View Cache");
        }
    );
}

cache.LoadCacheStatus = function() {
    op.ajaxGetAsync("/api/Cache/v1/GetCacheStatus",
        function (data) {
            var template = kendo.template($("#cache-status-template").html());
            var result = template(data); //Execute the template
            $("#cacheContainer").html(result); //Append the result

            $("#btnClearAll").kendoButton({
                click: function () {
                    cache.ClearCacheAll();
                }
            });
            $("#btnReload").kendoButton({
                click: function () {
                    cache.ReloadCacheAll();
                }
            });

        },
        function (e, xhr) {
            var title = (e.responseJSON.Message === undefined) ? xhr : e.responseJSON.Message;
            op.notifyError(title, "Unable to Load Cache Status");
        });
}

cache.resizeContent = function () {
    var offset = 200;
    var widthOffset = 100;
    var h = $(".cacheList").height() + 19;

    var contentHeight = (h > offset) ? h : $(window).height() - offset;
    var contentWidth = $(window).width() - widthOffset - $(".cacheList").width();

    //cacheList
    $("#viewResultsContainer").css("height", contentHeight);
    $("#viewResultsContainer").css("width", contentWidth);
}


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
                    $scope.currentCacheDetails = response.data;
                    data.loading = false;
                }, function (e) {
                    op.notifyError(e.statusText, "Unable to retrieve cache details.");
                    data.loading = false;
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
    }

    var app = angular.module('MyDealsApp', []);
    app.controller('CacheCtrl', cacheController);

    //app.directive('resizable',
    //    function($window) {
    //        return function($scope) {
    //            $scope.initializeWindowSize = function() {
    //                $scope.windowHeight = $window.innerHeight;
    //                return $scope.windowWidth = $window.innerWidth;
    //            };
    //            $scope.initializeWindowSize();
    //            return angular.element($window)
    //                .bind('resize',
    //                    function() {
    //                        $scope.initializeWindowSize();
    //                        return $scope.$apply();
    //                    });
    //        };
    //    });

}());