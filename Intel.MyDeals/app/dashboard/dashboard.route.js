(function () {
    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/',
                    abstract: true,
                    views: {
                        'bodyView': {
                            templateUrl: '/app/dashboard/views/portal.html',
                            controller: 'DashboardController',
                            controllerAs: 'dashboard',
                            resolve: {
                                securityLoaded: ['securityService', function (securityService) {
                                    return securityService.loadSecurityData();
                                }]
                            }
                        }
                    }
                }
            }, {
                state: 'dashboard.portal',
                config: {
                    url: 'portal',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/dashboard/views/nav.html'
                        },
                        'dashboardHeaderView': {
                            templateUrl: '/app/dashboard/views/header.html'
                        },
                        'dashboardWrapperView': {
                            templateUrl: '/app/dashboard/views/content.html'
                        }
                    }
                }
            }
        ];
    }
})();