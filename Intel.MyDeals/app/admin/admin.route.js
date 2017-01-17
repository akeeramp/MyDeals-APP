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
                    url: '/'
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
                state: 'admin.constants',
                abstract: false,
                config: {
                    templateUrl: 'app/admin/constants/constants.html',
                    url: 'constants',
                    controller: 'ConstantsController as vm',
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
                state: 'admin.securityAttributes',
                config: {
                    abstract: false
                    , template: '<div ui-view></div>'
					, url: 'SecurityAttributes'
                }
            },
            {
                state: 'admin.securityAttributes.securityActions',
                config: {
                    templateUrl: 'app/admin/securityAttributes/securityActions/securityActions.manage.html'
					, url: '/Actions'
					, controller: 'securityActionsController as vm'
                }
            },
            {
                state: 'admin.securityAttributes.applications',
                config: {
                    templateUrl: 'app/admin/securityAttributes/adminApplications/adminApplications.manage.html'
					, url: '/Applications'
					, controller: 'applicationsController as vm'
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
			    state: 'admin.securityAttributes.roleTypes',
			    config: {
			        templateUrl: 'app/admin/securityAttributes/adminRoleTypes/adminRoleTypes.manage.html'
					, url: '/RoleTypes'
					, controller: 'roleTypesController as vm'
			    }
			}
        ];
    }
})();