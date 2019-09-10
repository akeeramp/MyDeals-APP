(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('adminBanner', adminBanner);

    adminBanner.$inject = ['$localStorage', 'constantsService', '$rootScope', '$state', '$location'];
    function adminBanner($localStorage, constantsService, $rootScope, $state, $location) {
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



                //----------------------------Recents code-------------------------------------------------------------------
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

                // Admin banner is a global directory, we track url changes from here and add it to the recent vistited links
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                    // store recents on a local storage,
                    if ($localStorage.recents === undefined) $localStorage.recents = [];

                    // Get the recents on local variable
                    var recents = $localStorage.recents;

                    // Get the url from the state change venet
                    var url = $state.href($state.current.name, $state.params, { absolute: true });

                    // $state doesnt capture the query string, get that here from $location
                    var queryString = $location.url().split('?');
                    queryString[1] !== undefined ? url += "?" + queryString[1] : url = url;

                    // if there is already entry in recents, to make it appear in top remove and add
                    recents = recents.filter(function (item) {
                        return item.url != url;
                    });

                    var date = new Date();

                    recents.unshift({ 'url': url, 'time': date.getTime() });

                    if (recents.length > 10) {
                        recents.length = 10;
                    }

                    // replace recents on localstorage
                    $localStorage.recents = recents;
                });
            }
        }
    }
})();