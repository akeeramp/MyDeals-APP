angular
    .module('app')
    .directive('dealPopupDock', dealPopupDock);

dealPopupDock.$inject = ['$timeout', '$localStorage', '$window', 'quickDealConstants'];

function dealPopupDock($timeout, $localStorage, $window, quickDealConstants) {
    kendo.culture("en-US");
    return {
        scope: {
        },
        restrict: 'AE',
        transclude: true,
        // templateUrl:'Client/src/app/shared/core/dealpopupdock/dealPopupDock.directive.html',
        template:`<div class="deal-popup-docking" ng-if="isEnabled">
        <div>
            <div class="dropdown">
                <a id="dLabel" role="button" data-toggle="dropdown" class="btn btn-primary" data-target="#" href="">
                    <span class="badge badge-docking" ng-show="ids.length > 0">{{ids.length}}</span>
                    <span class="fa-stack">
                        <i class="fa fa-circle-o-notch fa-rotate-90" style="font-size: 26px;"></i>
                        <i class="fa fa-bars fa-stack-1x" style="font-size: 12px; margin-top: -1px;"></i>
                    </span>
                    <i class="intelicon-down"></i>
                </a>
                <ul class="dropdown-menu scaleTopAnim multi-level" role="menu" aria-labelledby="dropdownMenu" style="left: -300px;">
                    <li style="width: 400px; color: #000000;">
                        <div class="fl cn-dock-title">Quick Deals</div>
                        <div class="fr cn-dock-btns" style="padding-right: 8px;">
                            <a href="" type="button" ng-click="closeAll()" ng-show="ids.length"><i class="fa fa-window-close-o" title="Close all Quick Deals"></i></a>
                            <a href="" type="button" ng-click="cascadeAll()" ng-show="ids.length"><i class="fa fa-clone" title="Cascade all Quick Deals"></i></a>
                            <a href="" type="button" ng-click="tileAll()" ng-show="ids.length"><i class="fa fa-th-large" title="Tile all Quick Deals"></i></a>
                            <a href="" type="button" ng-click="lowerAll()" ng-show="ids.length"><i class="fa fa-ellipsis-h" style="vertical-align: sub;" title="Line all Quick Deals to the bottom of the screen"></i></a>
                            &nbsp;
                        </div>
                        <div class="clearboth"></div>
    
                        <hr/>
                        
                        <div ng-show="ids.length === 0 && recent.length === 0" style="padding: 7px 20px; font-size: 12px; color: #666666;">
                            To use the Quick Deal feature, click on the 
                            <span class="cn-deal-popup-icon">
                                <span class="fa-stack" style="height: 16px; line-height: 18px; margin-bottom: 3px;">
                                    <i class="fa fa-circle-o-notch fa-rotate-90"></i>
                                    <i class="fa fa-bars fa-stack-1x" style="font-size: 9px; color: #FFA300;"></i>
                                </span>
                            </span>
                            icon next to deal numbers.  All opened Quick Deal or recently selected Quick Deals will appear here.
                        </div>
    
                        <div class="cn-deal-label" ng-show="ids.length > 0">Current Deals (click to close)</div>
                        <div ng-repeat="item in ids">
                            <div class="fl">
                                <span class="cn-deal-popup-recent-icon" ng-click="recentClicked($event, item.id)">
                                    <span class="fa-stack" style="height: 1.3em; line-height: 1.3em; margin-bottom: 3px;">
                                        <i class="fa fa-circle-o-notch fa-rotate-90"></i>
                                        <i class="fa fa-bars fa-stack-1x" style="font-size: 9px; color: #FFA300;"></i>
                                    </span>
                                    <span class="cn-deal-link">{{item.id}}</span>
                                </span>
                            </div>
                        </div>
                        <div class="clearboth"></div>
    
                        <div class="cn-deal-label" ng-show="recent.length > 0">Recent Deals</div>
                        <div ng-repeat="item in recent">
                            <div class="fl">
                                <span class="cn-deal-popup-recent-icon" ng-click="recentClicked($event, item.id)">
                                    <span class="fa-stack" style="height: 1.3em; line-height: 1.3em; margin-bottom: 3px;">
                                        <i class="fa fa-circle-o-notch fa-rotate-90"></i>
                                        <i class="fa fa-bars fa-stack-1x" style="font-size: 9px; color: #FFA300;"></i>
                                    </span>
                                    <span class="cn-deal-link">{{item.id}}</span>
                                </span>
                            </div>
                        </div>
                        <div class="clearboth"></div>
    
                    </li>
                </ul>
            </div>
        </div>
        <div ng-repeat="item in ids" style="position: absolute; top: 0; z-index: 1000; left: 0px;">
            <deal-popup deal-id="item.id" init-top="item.top" init-left="item.left" is-open="'true'"></deal-popup>
        </div>
    </div>`,
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