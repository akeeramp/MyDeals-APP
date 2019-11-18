(function () {
    angular
        .module('app.reporting')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'reporting',
                config: {
                    abstract: false,
                    template: '<div ui-view></div>',
                    url: '/',
                    resolve: {
                        securityLoaded: ['securityService', function (securityService) {
                            return securityService.loadSecurityData();
                        }],
                    }
                }
            },
            {
                state: 'reporting.dashboard',
                abstract: false,
                config: {
                    templateUrl: 'app/reporting/dash/ReportDashboard.html',
                    url: 'dashboard',
                    controller: 'ReportingDashboardController as vm'
                }
            }
        ];
    }
})();