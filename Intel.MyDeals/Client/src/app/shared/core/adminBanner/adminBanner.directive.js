(function () {
    'use strict';

    angular
        .module('app')
        .directive('adminBanner', adminBanner);

    adminBanner.$inject = ['$localStorage', 'constantsService', '$rootScope', '$state', '$location'];
    function adminBanner($localStorage, constantsService, $rootScope, $state, $location) {
        return {
            restrict: 'E',
            scope: {
            },
            transclude: true,
            // templateUrl:'Client/src/app/shared/core/adminBanner/adminBanner.directive.html',
            template:`<div ng-if="$root.adminBannerMessage != ''" class="col-md-6">
            <div ng-if="userDismissed == 'false'" class="alert alert-dismissible adminBanner" role="alert" style="position: absolute; right: 120px">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="top: 3px; right: 5px; color: red;"><span aria-hidden="true" class="intelicon-close-solid" ng-click="close(true)" ></span></button>
                <p ng-bind-html="$root.adminBannerMessage" style="line-height: 1.1em; padding-right: 8px;" /> 
            </div>
            <div ng-if="userDismissed == 'true'" class="text-center adminBannerIcon" style="position: absolute; right: 50px">
                <i role="button" ng-click="close(false)" class="intelicon-email-message-solid"></i>
            </div>
        </div>`,
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

                //----------------------------Recent Widget code-------------------------------------------------------------------
                // Admin banner is a global directory, we track url changes from here and add it to the recent visited links

                var dontAddTheseInRecents = "portal";

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

                    // store recents on a local storage,
                    if ($localStorage.recents === undefined) $localStorage.recents = [];

                    // Get the recents on local variable
                    var recents = $localStorage.recents;

                    // Get the url from the state change venet
                    var url = $location.absUrl();
                    if (!url.endsWith(dontAddTheseInRecents)) {
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
                    }
                });
            }
        }
    }
})();