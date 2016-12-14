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