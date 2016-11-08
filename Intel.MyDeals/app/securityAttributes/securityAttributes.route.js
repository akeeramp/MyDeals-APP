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
					, controller: 'securityAttributesController as vm'
				}
			}
			, {
				state: 'securityAttributes.securityActions',
				config: {
					templateUrl: 'app/securityAttributes/securityActions/securityActions.manage.html'
					, url: 'SecurityActions'
					, controller: 'securityAttributesController as vm'
				}
			}
			, {
				state: 'securityAttributes.roleTypes',
				config: {
					templateUrl: 'app/securityAttributes/roleTypes/roleTypes.manage.html'
					, url: 'RoleTypes'
					, controller: 'securityAttributesController as vm'
				}
			}
		];
	}
})();