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
                config: {
                    abstract: true,
                    template: '<div ui-view></div>',
                    url: '/'
                }
            },
            {
                state: 'testCases.uiControls',
                config: {
                    templateUrl: 'app/testCases/uiControls/uiControls.manage.html',
                    url: 'uiControls',
                    controller: 'uiControlsController as vm'
                }
            },
            {
                state: 'testCases.basicGrid',
                config: {
                    templateUrl: 'app/testCases/grids/basic.manage.html',
                    url: 'basicGrid',
                    controller: 'basicController'
                }
            },
            {
                state: 'testCases.businessRules',
                config: {
                    templateUrl: 'app/testCases/rules/businessRules.manage.html',
                    url: 'businessRules',
                    controller: 'businessRulesController'
                }
            },
            {
                state: 'testCases.opMessages',
                config: {
                    templateUrl: 'app/testCases/opMessages/opMessages.html',
                    url: 'opMessages',
                    controller: 'opMessagesController as vm'
                }
            },
            {
                state: 'testCases.suggestProduct',
                config: {
                    templateUrl: 'app/testCases/suggestProduct/suggestProduct.manage.html',
                    url: 'suggestProduct',
                    controller: 'suggestProductController'
                }
            }
        ];
    }
})();