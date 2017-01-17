(function () {
	angular
    .module('app.testCases')
    .run(appRun);

	appRun.$inject = ['routerHelper'];

	/* @ngInject */
	function appRun(routerHelper) {
		routerHelper.configureStates(getStates());
	}

	function getStates() {
		return [
            {
            	state: 'testCases',
            	abstract: true,
            	config: {
                    abstract: false,
                    template: '<div ui-view></div>',
                    url: '/',
                    controller: 'uiControlsController as vm'
            	}
            },
            {
                state: 'testCases.uiControls',
                config: {
                    templateUrl: 'app/testCases/uiControls/uiControls.manage.html',
                    url: 'uiControls'
                }
            }
		];
	}
})();
