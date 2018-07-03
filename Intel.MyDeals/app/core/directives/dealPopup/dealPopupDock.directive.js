angular
    .module('app.core')
    .directive('dealPopupDock', dealPopupDock);

dealPopupDock.$inject = ['$timeout', '$localStorage', '$window', 'quickDealConstants'];

function dealPopupDock($timeout, $localStorage, $window, quickDealConstants) {
    kendo.culture("en-US");
    return {
        scope: {
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/dealPopup/dealPopupDock.directive.html',
        controller: ['$scope', function ($scope) {

            $scope.cnt = 0;
            $scope.$storage = $localStorage;
            $scope.maxItems = quickDealConstants.maxQuickDeals;
            $scope.maxRecent = quickDealConstants.maxRecent;

            // only for Chrome
            $scope.isEnabled = quickDealConstants.enabled;
            if ($window.navigator.userAgent.indexOf("Chrome") < 0) $scope.isEnabled = false;


            $scope.ids = $scope.$storage.dealPopupDockData;
            if ($scope.ids === undefined) $scope.ids = [];

            $scope.recent = $scope.$storage.dealPopupDockRecentData;
            if ($scope.recent === undefined) $scope.recent = [];

            $scope.menuOrientation = "horizontal";
            $scope.onSelect = function (ev) {
                alert($(ev.item.firstChild).text());
            };

            $scope.closeAll = function () {
                $scope.ids = [];
                $scope.$storage.dealPopupDockData = [];
            }
            $scope.cascadeAll = function () {
                var offset = 50;
                var initX = 150;
                var initY = 200;
                for (var i = 0; i < $scope.ids.length; i++) {
                    var item = $scope.ids[i];
                    $scope.$root.$broadcast('QuickDealOpenPanel', item.id);
                    var qDeal = $("#cn-draggable-" + item.id);
                    qDeal.addClass("animation");
                    var l = initX + (i * offset);
                    var t = initY + (i * offset);
                    item.left = l;
                    item.top = t;
                    qDeal.css("left", l);
                    qDeal.css("top", t);
                }

                $timeout(function () {
                    $(".draggable").removeClass("animation");
                    $scope.save();
                }, 500);
            }
            $scope.tileAll = function () {
                $scope.save();
                var offsetX = 600;
                var offsetY = 180;
                var initX = 150;
                var initY = 200;
                var docWidth = $(document).width();
                var r = 0;
                var c = 0;

                for (var i = 0; i < $scope.ids.length; i++) {
                    var item = $scope.ids[i];
                    $scope.$root.$broadcast('QuickDealOpenPanel', item.id);
                    var qDeal = $("#cn-draggable-" + item.id);
                    qDeal.addClass("animation");
                    var l = initX + (c * offsetX);
                    var t = initY + (r * offsetY);
                    item.left = l;
                    item.top = t;
                    qDeal.css("left", l);
                    qDeal.css("top", t);
                    c++;

                    if (((c + 1) * offsetX) > docWidth) {
                        c = 0;
                        r++;
                    }
                }

                $timeout(function () {
                    $(".draggable").removeClass("animation");
                    $scope.save();
                }, 500);
            }
            $scope.lowerAll = function () {
                var initX = 150;
                var initY = $(document).height() - 100;
                var offsetX = 200;
                for (var i = 0; i < $scope.ids.length; i++) {
                    var item = $scope.ids[i];
                    $scope.$root.$broadcast('QuickDealClosePanel', item.id);
                    var qDeal = $("#cn-draggable-" + item.id);
                    qDeal.addClass("animation");
                    var l = initX + (i * offsetX);
                    item.left = l;
                    item.top = initY;
                    qDeal.css("left", l);
                    qDeal.css("top", initY);
                }

                $timeout(function () {
                    $(".draggable").removeClass("animation");
                    $scope.save();
                }, 500);
            }
            
            $scope.save = function() {
                $scope.$storage.dealPopupDockData = $scope.ids;
                $scope.$storage.dealPopupDockRecentData = $scope.recent;
                if ($scope.$storage.dealPopupDockRecentData.length > $scope.maxRecent) {
                    $scope.$storage.dealPopupDockRecentData.pop();
                }
            }

            $scope.addIdBase = function(id, top, left, isOpen) {
                if (isOpen === undefined) isOpen = false;

                var found = false;
                for (var i = 0; i < $scope.ids.length; i++) {
                    if ($scope.ids[i].id === id) {
                        found = true;
                        $scope.ids[i].top = top;
                        $scope.ids[i].left = left;
                    }
                }
                if (!found) {
                    $scope.ids.push({
                        id: id,
                        top: top,
                        left: left,
                        isOpen: isOpen
                    });
                }

                var foundRecent = false;
                for (var i = 0; i < $scope.recent.length; i++) {
                    if ($scope.recent[i].id === id) {
                        foundRecent = true;
                        $scope.recent[i].top = top;
                        $scope.recent[i].left = left;
                    }
                }
                if (!foundRecent) {
                    $scope.recent.push({
                        id: id,
                        top: top,
                        left: left,
                        isOpen: false
                    });
                }
                $scope.save();
            }
            $scope.addId = function (id, top, left) {
                $scope.addIdBase(id, top, left);
            }
            $scope.addToDockId = function (id, top, left) {
                $scope.addIdBase(id, top, left, true);
            }
            $scope.delId = function (id) {
                for (var i = $scope.ids.length - 1; i >= 0; --i) {
                    if ($scope.ids[i].id === id) {
                        $scope.ids.splice(i, 1);
                    }
                }

                $scope.$storage.dealPopupDockData = $scope.ids;
            }
            $scope.recentClicked = function($event, id) {
                var x = $event.clientX + 12;
                var y = $event.clientY + 2;
                $scope.$root.$broadcast('QuickDealToggleDeal', id, y, x);
            }
            
            $scope.$on('QuickDealToggleDeal', function (event, id, top, left) {
                if ($scope.ids.length >= $scope.maxItems) {
                    kendo.alert("Only " + $scope.maxItems + " Quick Deals can be opened at one time.<br\>Please close one before trying to open this deal.");
                    return;
                }

                var found = false;
                for (var i = 0; i < $scope.ids.length; i++) {
                    if ($scope.ids[i].id === id) {
                        found = true;
                    }
                }
                if (found) {
                    $scope.delId(id);
                } else {
                    $scope.addToDockId(id, top, left);
                }
            });
            $scope.$on('QuickDealWidgetOpened', function (event, id, top, left, type) {
                $scope.addId(id, top, left, type);
            });
            $scope.$on('QuickDealWidgetClosed', function (event, id) {
                $scope.delId(id);
            });
            $scope.$on('QuickDealWidgetMoved', function (event, id, top, left) {
                $scope.addId(id, top, left);
            });
            

        }],
        link: function (scope, element, attrs) {
        }
    };
}