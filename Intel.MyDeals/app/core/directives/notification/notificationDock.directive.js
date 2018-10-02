angular
    .module('app.core')
    .directive('notificationDock', notificationDock);

notificationDock.$inject = ['$compile', '$timeout', 'objsetService', '$uibModal', '$location', '$window'];

function notificationDock($compile, $timeout, objsetService, $uibModal, $location, $window) {

    return {
        scope: {
            messages: '=ngModel',
            idTitle: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/notification/notificationDock.directive.html',
        controller: ['$scope', '$http', '$location', '$window', function ($scope, $http, $location, $window) {

            $scope.ids = [1, 2, 3, 4];

            $scope.gotoNotificationSettings = function (dataItem) {

                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'app/admin/notifications/notificationsSettings.html',
                    controller: 'notificationsController',
                    controllerAs: 'vm',
                    size: 'lg'
                });

                modalInstance.result.then(function () { }, function () { });
            }

        }],
        link: function (scope, element, attr) {
        }
    };
}
