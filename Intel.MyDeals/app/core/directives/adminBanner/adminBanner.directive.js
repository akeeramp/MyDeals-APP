(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('adminBanner', adminBanner);

    adminBanner.$inject = ['$compile'];
    function adminBanner($compile) {
        return {
            restrict: 'E',
            scope: {
            },
            transclude: true,
            templateUrl: '/app/core/directives/adminBanner/adminBanner.directive.html',
            link: function (scope, element, attrs) {
                scope.$root.adminBannerMessage = "";

                var userDismissed = sessionStorage.getItem('userDismissedAdminBanner');

                // If user has closed the banner message he wont see it for the current session again.
                if (!userDismissed) {
                    // TODO read it from constant table, make an api call.
                    scope.$root.adminBannerMessage = "<b>Warning!</b> Message from Admin.";
                }

                scope.close = function () {
                    sessionStorage.setItem('userDismissedAdminBanner', true);
                }
            }
        }
    }
})();