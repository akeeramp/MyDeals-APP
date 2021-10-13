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
                    mainView: {
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
                    mainView: {
                        template: '<my-kendo></my-kendo>'
                    }
                }
            })
            .state("myspread", {
                url: "/myspread",
                abstract: false,
                views: {
                    mainView: {
                        template: '<my-spread></my-spread>'
                    }
                }
            })
            // Admin route  starts here 
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
            .state("admincache", {
                url: "/admincache",
                abstract: false,
                views: {
                    mainView: {
                        template: '<cache></cache>'
                        //templateUrl: "Client/src/app/admin/cache/cache.html",
                        //controller: "CacheController as vm"

                    }
                }
            })
            .state("customers", {
                url: "/customers",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-customer></admin-customer>'
                        // templateUrl: "Client/src/app/admin/customer/customer.html",
                        // controller: "CustomerController as vm"
                    }
                }
            })
            .state("customervendors", {
                url: "/CustomerVendors",
                abstract: false,
                views: {
                    mainView: { 
                        template: '<admin-vendors-customer></admin-vendors-customer>'
                        //  templateUrl: "Client/src/app/admin/CustomerVendors/customerVendors.html",
                        //  controller: "CustomerVendorsController as vm"
                    }
                }
            })
            // Admin route  ends here 

    });