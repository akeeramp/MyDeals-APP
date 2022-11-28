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
                    }
                },
                resolve: {
                    securityLoaded: ['securityService', function (securityService) {
                        return securityService.loadSecurityData();
                    }],
                }

            })
            //*****************poc items starts here*****************
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
                    }
                }
            })
            .state("customers", {
                url: "/customers",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-customer></admin-customer>'
                    }
                }
            })
            .state("CustomerVendors", {
                url: "/CustomerVendors",
                abstract: false,
                views: {
                    mainView: { 
                        template: '<admin-vendors-customer></admin-vendors-customer>'
                    }
                }
            })
            .state("opLog", {
                url: "/opLog",
                abstract: false,
                views: {
                    mainView: {
                        template: '<op-log></op-log>'
                    }
                }
            })
            .state("batchTiming", {
                url: "/batchTiming",
                abstract: false,
                views: {
                    mainView: {
                        template: '<batch-timing></batch-timing>'
                    }
                }
            })
            .state("VistexCustomerMapping", {
                url: "/VistexCustomerMapping",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-vistex-customer-mapping></admin-vistex-customer-mapping>'
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
                    }
                }
            })
            .state("ruleOwner", {
                url: "/ruleOwner",
                abstract: false,
                views: {
                    mainView: {
                        template: '<rule-owner></rule-owner>'
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
            //removed as part of partial completeness will move back once fully migrated
            // .state("rules", {
            //     url: "/rules/:rid",
            //     abstract: false,
            //     views: {
            //         mainView: {
            //             template: '<admin-rules></admin-rules>'
            //         }
            //     }
            // })
            .state("dataFix", {
                url: "/dataFix",
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-data-fix></admin-data-fix>'
                    }
                }
            })
            .state("vistex", {
                url: '/vistex',
                abstract: false,
                views: {
                    mainView: {
                        template: '<vistex-integration-log></vistex-integration-log>'
                    }
                }
            })
            .state("meetComp", {
                url: '/meetComp',
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-meetcomp></admin-meetcomp>'
                    }
                }
            })
            .state("testTenders", {
                url: '/testTenders',
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-test-tenders></admin-test-tenders>'
                    }
                }
            })
            .state("supportScript", {
                url: '/supportScript',
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-support-script></admin-support-script>'
                    }
                }
            })

             .state("legalException", {
                url: '/legalException',
                abstract: false,
                views: {
                    mainView: {
                        template: '<admin-legal-exception></admin-legal-exception>'
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
            .state("manager", {
                url: "/manager/:cid",
                abstract: false,
                views: {
                    mainView: {
                        template: '<global-route></global-route>',
                    }
                }
            })
            .state("searchManager", {
                url: "/manager/:type/:cid/:PSID/:PTID/:DealID",
                abstract: false,
                views: {
                    mainView: {
                        template: '<global-route></global-route>',
                    }
                }
            })
            .state("contractmanager", {
                url: "/contractmanager/:type/:cid/:PSID/:PTID/:DealID",
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