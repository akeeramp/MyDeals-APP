/// <reference path="securityAttributes.manage.html" />
(function () {
	angular
    .module('app.securityAttributes')
    .run(appRun);

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
			{
				state: 'securityAttributes',
				config: {
					abstract: false
					, template: '<div ui-view></div>'
					, url: '/'
				}
			}
			, {
				state: 'securityAttributes.securityActions',
				config: {
					templateUrl: 'app/securityAttributes/securityActions/securityActions.manage.html'
					, url: 'SecurityActions'
					, controller: 'securityActionsController as vm'
				}
			}
            , {
                state: 'securityAttributes.applications',
                config: {
                    templateUrl: 'app/securityAttributes/adminApplications/adminApplications.manage.html'
					, url: 'Applications'
					, controller: 'applicationsController as vm'
                }
            }
            , {
                state: 'securityAttributes.dealTypes',
                config: {
                	templateUrl: 'app/securityAttributes/adminDealTypes/adminDealTypes.manage.html'
					, url: 'DealTypes'
					, controller: 'dealTypesController as vm'
                }
            }
			, {
				state: 'securityAttributes.roleTypes',
				config: {
					templateUrl: 'app/securityAttributes/adminRoleTypes/adminRoleTypes.manage.html'
					, url: 'RoleTypes'
					, controller: 'roleTypesController as vm'
				}
			}
		];
	}
})();