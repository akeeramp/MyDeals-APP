import * as angular from 'angular';

//There is no longer app.reporting module or route all are moving to main app route
angular
    .module("app")
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("reportingdashboard", {
                url: "/reportingdashboard",
                abstract: false,
                views: {
                    reportingView: {
                        templateUrl: "Client/src/app/reporting/ReportDashboard.html",
                        controller: "ReportingDashboardController as vm"

                    }
                },
                resolve: {
                    securityLoaded: ['securityService', function (securityService) {
                        return securityService.loadSecurityData();
                    }],
                }

            });
    });