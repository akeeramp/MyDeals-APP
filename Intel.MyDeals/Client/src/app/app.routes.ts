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
            .state("mydashboard", {
                url: "/mydashboard",
                abstract: false,
                views: {
                    mainView: {
                        template: '<app-dashboard></app-dashboard>'
                    }, resolve: {
                        securityLoaded: ['securityService', function (securityService) {
                            return securityService.loadSecurityData();
                        }],
                    }
                }
            })
             .state("portal", {
                 url: "/portal",
                 abstract: false,
                 views: {
                     mainView: {
                         template: '<app-dashboard></app-dashboard>'
                     }
                 },
                 resolve: {
                     securityLoaded: ['securityService', function (securityService) {
                         return securityService.loadSecurityData();
                     }],
                 }
             })
     
            //*****************poc items ends here*******************
            //*****************Admin route  starts here*******************  
            .state("adminemployeedashboard", {
                url: "/adminemployeedashboard",
                abstract: false,
                views: {
                    mainView: {
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
            .state("CustomerVendors", {
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
            .state("opLog", {
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
            .state("VistexCustomerMapping", {
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
            .state("UnifiedCustomerAdmin", {
                url: "/UnifiedCustomerAdmin",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-prime-customers></admin-prime-customers>'
                    }
                }
            })
            .state("adminGeo", {
                url: "/adminGeo",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-geo></admin-geo>'
                    }
                }
            })
            .state("productCategories", {
                url: "/productCategories",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-product-categories></admin-product-categories>'
                        //  templateUrl: "Client/src/app/admin/CustomerVendors/customerVendors.html",
                        //  controller: "CustomerVendorsController as vm"
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
            .state("products", {
                url: "/products",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-products></admin-products>'
                    }
                }
            })
            .state("funfact", {
                url: "/funfact",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-fun-fact></admin-fun-fact>'
                    }
                }
            })
            .state("dealTypes", {
                url: "/dealTypes",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-deal-types></admin-deal-types>'
                        //  templateUrl: "Client/src/app/admin/dealTypes/admin.dealTypes.component.html",
                        //  controller: "dealTypesController as vm"
                    }
                }
            })
            .state("dataquality", {
                url: "/dataquality",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-dataquality></admin-dataquality>'
                    }
                }
            })
            .state("quoteLetter", {
                url: "/quoteLetter",
                abstract: false,
                views: {
                    mainView: {
                        template: '<quote-letter></quote-letter>'
                        //  templateUrl: "Client/src/app/admin/quoteLetter/admin.quoteLetter.component.html",
                        //  controller: "QuoteLetterController as vm"
                    }
                }
            })
            .state("ruleOwner", {
                url: "/ruleOwner",
                abstract: false,
                views: {
                    mainView: {
                        template: '<rule-owner></rule-owner>'
                        //  templateUrl: "Client/src/app/admin/ruleOwner/admin.ruleOwner.component.html",
                        //  controller: "ruleOwnerController as vm"
                    }
                }
            })
            .state("workflowStages", {
                url: "/workflowStages",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-workflow-stages></admin-workflow-stages>'
                    }
                }
            })
            .state("workFlow", {
                url: "/workFlow",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-work-flow></admin-work-flow>'
                        //  templateUrl: "Client/src/app/admin/ruleOwner/admin.ruleOwner.component.html",
                        //  controller: "ruleOwnerController as vm"
                    }
                }
            })
            .state("dropdowns", {
                url: "/dropdowns",
                abstract: false,
                views: {
                    mainView: {
                        template: '<dropdowns></dropdowns>'
                    }
                }
            })
            .state("consumptionCountry", {
                url: "/consumptionCountry",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-consumption-country></admin-consumption-country>'
                    }
                }
            })
            .state("pushDealstoVistex", {
                url: "/pushDealstoVistex",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-push-dealsto-vistex></admin-push-dealsto-vistex>'
                    }
                }
            })
            .state("vistexTestApi", {
                url: "/vistexTestApi",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-vistex></admin-vistex>'
                    }
                }
            })
            .state("icostproducts", {
                url: "/icostproducts",
                abstract: false,
                views: {
                    mainView: {
                        template: '<i-cost-products></i-cost-products>',
                    }
                }
            })
            .state("notifications", {
                url: "/notifications",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-notifications></admin-notifications>'
                    }
                }
            })
            .state("dealmassupdate", {
                url: "/dealmassupdate",
                abstract: false,
                views: {
                    mainView: {
                        template: '<deal-mass-update></deal-mass-update>'
                    }
                }
            })
            .state("validateVistexR3Checks", {
                url: '/validateVistexR3Checks',
                abstract: false,
                views: {
                    mainView: {
                        template: '<validate-vistex-checks></validate-vistex-checks>'
                    }
                }
            })
            .state("manageEmployee", {
                url: '/manageEmployee',
                abstract: false,
                views: {
                    mainView: {
                        template: '<manage-employee></manage-employee>'
                    }
                }
            })
            //********************* Admin route  ends here **************

            // ********************* Contract route  starts here ************** 
            .state("contractdetails", {
                url: "/contractdetails/:cid",
                abstract: false,
                views: {
                    mainView: {
                        template: '<contract-details></contract-details>',
                    }
                }
            })

            .state("contractmanager", {
                url: "/contractmanager/:cid",
                abstract: false,
                views: {
                    mainView: {
                        template: '<pricing-table></pricing-table>',
                    }
                }
            })

            .state("tendermanager", {
                url: "/tendermanager/:cid",
                abstract: false,
                views: {
                    mainView: {
                        template: '<tender-manager></tender-manager>',
                    }
                }
            })

             //// ********************* Contract route  ends here  **************  
    });