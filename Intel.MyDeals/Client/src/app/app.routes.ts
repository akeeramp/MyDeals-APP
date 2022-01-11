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
                        // templateUrl: "Client/src/app/reporting/reporting.component.html",
                        // controller: "ReportingDashboardController as vm"

                    }
                },
                resolve: {
                    securityLoaded: ['securityService', function (securityService) {
                        return securityService.loadSecurityData();
                    }],
                }

            })
            //*****************poc items starts here*****************
            .state("myhandsone", {
                url: "/myhandsone",
                abstract: false,
                views: {
                    mainView: {
                        template: '<my-handonse></my-handonse>'
                    }
                }
            })
            .state("mykendocontrol", {
                url: "/mykendocontrol",
                abstract: false,
                views: {
                    mainView: {
                        template: '<my-kendo-control></my-kendo-control>'
                    }
                }
            })

            //*****************poc items ends here*******************
            // Admin route  starts here 
            .state("adminemployeedashboard", {
                url: "/adminemployeedashboard",
                abstract: false,
                views: {
                    dashboardView: {
                        template: '<employee-dashboard></employee-dashboard>'
                        // templateUrl: "Client/src/app/admin/employee/admin.employee.component.html",
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
                        //templateUrl: "Client/src/app/admin/cache/admin.cache.component.html",
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
                        // templateUrl: "Client/src/app/admin/customer/admin.customer.component.html",
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
                        //  templateUrl: "Client/src/app/admin/CustomerVendors/admin.customerVendors.component.html",
                        //  controller: "CustomerVendorsController as vm"
                    }
                }
            })
            .state("oplog", {
                url: "/opLog",
                abstract: false,
                views: {
                    mainView: {
                        template: '<op-log></op-log>'
                        //  templateUrl: "Client/src/app/admin/oplog/admin.oplog.component.html",
                        //  controller: "OpLogController as vm"
                    }
                }
            })
            .state("batchTiming", {
                url: "/batchTiming",
                abstract: false,
                views: {
                    mainView: {
                        template: '<batch-timing></batch-timing>'
                        //  templateUrl: "Client/src/app/admin/batchTiming/admin.batchTiming.component.html",
                        //  controller: "batchTimingController as vm"
                    }
                }
            })
            .state("vistexCustomerMapping", {
                url: "/VistexCustomerMapping",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-vistex-customer-mapping></admin-vistex-customer-mapping>'
                        //  templateUrl: "Client/src/app/admin/VistexCustomerMapping/admin.vistexCustomerMapping.component.html",
                        //  controller: "VistexCustomerMappingController as vm"
                    }
                }
            })
            .state("primeCustomers", {
                url: "/UnifiedCustomerAdmin",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-prime-customers></admin-prime-customers>'
                    }
                }
            })
            .state("geo", {
                url: "/adminGeo",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-geo></admin-geo>'
                    }
                }
            })

            .state("constants", {
                url: "/constants",
                abstract: false,
                views: {
                    mainView: {
                        template: '<constants></constants>'
                        //  templateUrl: "Client/src/app/admin/constants/admin.constants.component.html",
                        //  controller: "ConstantsController as vm"
                    }
                }
            })
            .state("productAlias", {
                url: "/productAlias",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-product-alias></admin-product-alias>'
                        //  templateUrl: "Client/src/app/admin/productAlias/admin.productAlias.component.html",
                        //  controller: "productAliasController as vm"
                    }
                }
            })
            // Admin route  ends here 

    });