/// <reference path="constants/admin.constants.controller.js" />
(function () {
    angular
        .module('app.admin')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'admin',
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
                state: 'admin.cache',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/cache/cache.html',
                    url: 'cache',
                    controller: 'CacheController as vm',
                }
            },
            {
                state: 'admin.oplog',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/oplog/oplog.html',
                    url: 'oplog',
                    controller: 'OpLogController as vm',
                }
            },
            {
                state: 'admin.constants',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/constants/constants.html',
                    url: 'constants',
                    controller: 'ConstantsController as vm',
                }
            },
            {
                state: 'admin.funfact',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/funfact/funfact.html',
                    url: 'funfact',
                    controller: 'FunfactController as vm',
                }
            },
            {
                state: 'admin.workflow',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/workflow/workflow.html',
                    url: 'workflow',
                    controller: 'WorkflowController as vm',
                }
            },
            {
                state: 'admin.workflowstage',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/workflowStage/workflowStages.html',
                    url: 'workflowstage',
                    controller: 'WorkflowStageController as vm',
                }
            },
            {
                state: 'admin.meetcomp',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/meetComp/meetComp.html',
                    url: 'meetcomp',
                    controller: 'meetCompController as vm',
                }
            },
            {
                state: 'admin.customers',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/customer/customer.html',
                    url: 'customers',
                    controller: 'CustomerController as vm',
                }
            },
            {
                state: 'admin.employee',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/employee/employee.html',
                    url: 'employee',
                    controller: 'EmployeeController',
                }
            },
            {
                state: 'admin.manageemployee',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/employee/manageEmployee.html',
                    url: 'manageEmployee',
                    controller: 'manageEmployeeController',
                }
            },
            {
                state: 'admin.mydealsmanual',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/mydealsmanual/MyDealsManual.html',
                    url: 'MyDealsManual',
                    controller: 'ManualsController as vm',
                }
            },
            {
                state: 'admin.geo',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/geo/geo.html',
                    url: 'geo',
                    controller: 'GeoController as vm',
                }
            },
            {
                state: 'admin.products',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/products/products.html',
                    url: 'products',
                    controller: 'ProductController as vm',
                }
            },
            {
                state: 'admin.productSelector',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/productSelector/productSelector.html',
                    url: 'productSelector',
                    controller: 'ProductSelectorController as vm',
                }
            },
            {
                state: 'admin.productEntryIncExc',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/productIncExc/productEntryIncExc.html',
                    url: 'productEntryIncExc',
                    controller: 'ProductEntryIncExcController as vm',
                }
            },
            {
                state: 'admin.productAlias',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/productAlias/productAlias.html',
                    url: 'productAlias',
                    controller: 'ProductAliasController as vm',
                }
            },
            {
                state: 'admin.quoteLetter',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/quoteLetter/quoteLetter.html',
                    url: 'quoteLetter',
                    controller: 'QuoteLetterController as vm',
                }
            },
            {
                state: 'admin.productCategories',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/productCategories/productCategories.html',
                    url: 'productCategories',
                    controller: 'ProductCategoryController as vm',
                }
            },
            {
                state: 'admin.costtest',
                config: {
                    abstract: false
                    , template: '<div ui-view></div>'
                    , url: 'CostTest'
                }
            },
            {
                state: 'admin.costtest.icostproducts',
                config: {
                    templateUrl: 'app/admin/iCostProducts/iCostProducts.html'
                    , url: '/icostproducts'
                    , controller: 'iCostProductsController as vm'
                }
            },
            {
                state: 'admin.costtest.icostproducts.manage',
                config: {
                    url: ''
                    , views: {
                        'addNewRules': {
                            templateUrl: 'app/admin/iCostProducts/iCostProducts.manage.html'
                        }
                    }
                }
            },
            {
                state: 'admin.rules',
                abstract: true,
                config: {
                    url: 'rules/:rid',
                    templateUrl: 'app/admin/rules/rules.html',
                    controller: 'RuleController as vm',
                    resolve: {
                        rid: ['$stateParams', 'objsetService', function ($stateParams, objsetService) {
                            return $stateParams.rid;
                        }],
                    }

                }
            },
            {
                state: 'admin.ruleOwner',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/ruleOwner/ruleOwner.html',
                    url: 'ruleOwner',
                    controller: 'RuleOwnerController as vm',
                }
            },
            {
                state: 'admin.vistexOutbound',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/vistex/vistexOutbound.html',
                    url: 'vistex/vistexOutbound',
                    controller: 'VistexOutboundController as vm',
                }
            },
            {
                state: 'admin.vistex',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/vistex/vistex.html',
                    url: 'vistex',
                    controller: 'VistexController as vm',
                }
            },
            {
                state: 'admin.securityAttributes',
                config: {
                    abstract: false
                    , template: '<div ui-view></div>'
                    , url: 'SecurityAttributes'
                }
            },
            {
                state: 'admin.securityAttributes.dealTypes',
                config: {
                    templateUrl: 'app/admin/securityAttributes/adminDealTypes/adminDealTypes.manage.html'
                    , url: '/DealTypes'
                    , controller: 'dealTypesController as vm'
                }
            },
            {
                state: 'admin.securityEngine',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/securityEngine/securityEngine.html'
                    , url: 'SecurityEngine'
                    , controller: 'securityEngineController as vm'
                }
            },
            {
                state: 'admin.dropdowns',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/dropdowns/dropdowns.html'
                    , url: 'dropdowns'
                    , controller: 'DropdownsController as vm'
                }
            },
            {
                state: 'admin.legalexceptions',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/legalExceptions/legalExceptions.html'
                    , url: 'legalexceptions'
                    , controller: 'legalExceptionsController as vm'
                }
            },
            {
                state: 'admin.notifications',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/notifications/notifications.html'
                    , url: 'notifications'
                    , controller: 'notificationsController as vm'
                }
            },
            {
                state: 'admin.dataquality',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/dataquality/dataquality.html'
                    , url: 'dataquality'
                    , controller: 'DataQualityController as vm'
                }
            },
            {
                state: 'admin.admintools',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/admintools/admintools.html'
                    , url: 'AdminTools'
                    , controller: 'AdminToolsController as vm'
                }
            },
            {
                state: 'admin.mydealssupport',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/mydealssupport/mydealssupport.html'
                    , url: 'MyDealsSupport'
                }
            },
            {
                state: 'admin.vistexcustomermapping',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/vistexcustomermapping/vistexcustomermapping.html'
                    , url: 'vistexcustomermapping'
                    , controller: 'VistexcustomermappingController as vm'
                }
            },
            {
                state: 'admin.testtenders',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/admintools/testtenders.html'
                    , url: 'testtenders'
                    , controller: 'TestTendersController as vm'
                }
            }

        ];
    }
})();