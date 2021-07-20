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
                        template: '<reporting-dashboard></reporting-dashboard>'
                        // templateUrl: "Client/src/app/reporting/ReportDashboard.html",
                        // controller: "ReportingDashboardController as vm"

                    }
                },
                resolve: {
                    securityLoaded: ['securityService', function (securityService) {
                        return securityService.loadSecurityData();
                    }],
                }

            })
            .state("mykendo", {
                url: "/mykendo",
                abstract: false,
                views: {
                    reportingView: {
                       template:'<my-kendo></my-kendo>'
                    }
                }
            })
            // Admin route of Admin/Employee
            .state("adminemployeedashboard", {
                url: "/adminemployeedashboard",
                abstract: false,
                views: {
                    dashboardView: {
                        template: '<employee-dashboard></employee-dashboard>'
                        // templateUrl: "Client/src/app/reporting/ReportDashboard.html",
                        // controller: "ReportingDashboardController as vm"
                    }
                },
                resolve: {
                    securityLoaded: ['securityService', function (securityService) {
                        return securityService.loadSecurityData();
                    }],
                }
            })
    });