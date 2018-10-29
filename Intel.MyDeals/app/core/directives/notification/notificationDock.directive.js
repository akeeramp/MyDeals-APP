angular
    .module('app.core')
    .directive('notificationDock', notificationDock);

notificationDock.$inject = ['$compile', '$timeout', 'objsetService', '$uibModal', '$location', '$window'];

function notificationDock($compile, $timeout, objsetService, $uibModal, $location, $window) {

    return {
        scope: {
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/notification/notificationDock.directive.html',
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

                getUnreadNotification();

                $scope.$on('refreshUnreadCount', function (event, data) {
                    debugger;
                    getUnreadNotification();
                });

            }],
        link: function (scope, element, attr) {
        }
    };
}
