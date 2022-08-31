angular
    .module('app')
    .directive('notificationDock', notificationDock);

notificationDock.$inject = ['$compile', '$timeout', 'objsetService', '$uibModal', '$location', '$window'];

function notificationDock($compile, $timeout, objsetService, $uibModal, $location, $window) {

    return {
        scope: {
        },
        restrict: 'AE',
        // templateUrl:'Client/src/app/shared/core/notification/notificationDock.directive.html',
        template:`<div>
        <div>
            <div class="dropdown notificationDock">
                <a id="dLabel" role="button" ng-click="getNotification('SELECT')" data-toggle="dropdown" class="btn btn-primary" data-target="#" href="">
                    <span class="badge badge-docking" ng-show="unreadMessages > 0">{{unreadMessages}}</span>
                    <i class="intelicon-notification" style="font-size:20px"></i>
                </a>
                <ul class="dropdown-menu scaleTopAnim multi-level" role="menu" style="width: 500px;padding-top:0px;padding-bottom:0px;width: 500px;" aria-labelledby="dropdownMenu">
                    <li style="background-color: #0071C5;color: #fff;font-size:18px;padding:2px; padding-bottom:6px;">
                        &nbsp;Notifications
                        <span title="Settings" ng-click="gotoNotificationSettings()" style="padding-right:9px;font-size:18px" class="fr">
                            <i class="intelicon-settings-solid"></i>
                        </span>
                    </li>
                    <li ng-click="openMessage(msg)" ng-class="{'unread':!msg.IS_READ_IND, 'read':msg.IS_READ_IND}" ng-repeat="msg in notifications">
                        {{msg.NOTIF_SHR_DSC}}
                    </li>
                    <li class="read" ng-if="notifications.length === 0">
                        No messages
                    </li>
                    <li class="text-center" ng-click="seeAllNotifications()" style="color: #0071C5;height:25px">
                        See All
                    </li>
                </ul>
            </div>
        </div>
        <div style="position: absolute; top: 0; z-index: 1000; left: 0px;">
        </div>
    </div>
    <style>
        .notificationDock .unread {
            color: #00AEEF;
            padding: 2px;
            font-size: 12px;
            font-weight:bold;
        }
    
        .notificationDock .read {
            color: #000;
            padding: 2px;
            font-size: 12px;
        }
        </style>`,
        controller: ['$scope', '$http', '$location', '$window', 'notificationsService', 'logger',
            function ($scope, $http, $location, $window, notificationsService, logger) {

                $scope.unreadMessages = 0;
                $scope.notifications = [];

                $scope.gotoNotificationSettings = function (dataItem) {

                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'app/admin/notifications/notificationsSettings.html',
                        controller: 'notificationsSettingsController',
                        controllerAs: 'vm',
                        size: 'lg'
                    });

                    modalInstance.result.then(function () { }, function () { });
                }

                function getUnreadNotification() {
                    notificationsService.getUnreadNotificationCount().then(function (response) {
                        $scope.unreadMessages = response.data;
                    }, function (response) {
                        logger.error("Unable to get user unread messages.", response, response.statusText);
                    })
                }

                $scope.openMessage = function (dataItem) {

                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'app/admin/notifications/notificationsModal.html',
                        controller: 'notificationsModalController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            dataItem: function () {
                                return dataItem;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        dataItem.IS_READ_IND = true;
                    }, function () {
                        dataItem.IS_READ_IND = true;
                    });
                }

                $scope.getNotification = function (mode) {
                    notificationsService.getNotification(mode).then(function (response) {
                        $scope.notifications = response.data;
                    }, function (response) {
                        //logger.error("Unable to get user unread messages.", response, response.statusText);
                    })
                }

                $scope.seeAllNotifications = function () {
                    $window.open('/Admin#/notifications', '_blank');
                }

                // Fix some sloopy bug when we are trying to engage an old easter egg
                if ($location.absUrl().indexOf('Snow') < 0)
                {
                    getUnreadNotification();
                }

                $scope.$on('refreshUnreadCount', function (event, data) {
                    getUnreadNotification();
                });

            }],
        link: function (scope, element, attr) {
        }
    };
}
