(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('adminBanner', adminBanner);

    adminBanner.$inject = ['$compile', 'constantsService'];
    function adminBanner($compile, constantsService) {
        return {
            restrict: 'E',
            scope: {
            },
            transclude: true,
            templateUrl: '/app/core/directives/adminBanner/adminBanner.directive.html',
            link: function (scope, element, attrs) {
                scope.$root.adminBannerMessage = "";

                scope.userDismissed = sessionStorage.getItem('userDismissedAdminBanner') == null ? 'false' :
                    sessionStorage.getItem('userDismissedAdminBanner');


                // If user has closed the banner message he wont see it for the current session again.
                constantsService.getConstantsByName("ADMIN_MESSAGE").then(function (data) {
                    if (!!data.data) {
                        scope.$root.adminBannerMessage = data.data.CNST_VAL_TXT == 'NA'
                            ? "" : data.data.CNST_VAL_TXT;
                    }
                });

                scope.close = function (value) {
                    sessionStorage.setItem('userDismissedAdminBanner', value);
                    scope.userDismissed = sessionStorage.getItem('userDismissedAdminBanner');
                }
            }
        }
    }
})();