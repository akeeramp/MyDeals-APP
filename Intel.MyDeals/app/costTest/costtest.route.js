/// <reference path="costtest.meetcomp.html" />
(function() {
    angular
        .module('app.costtest')
        .run(appRun);

    
    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'costtest',
                config: {
                    abstract: false,
                    template: '<div ui-view></div>',
                    url: ''
                }
            },
            {
                state: 'costtest.meetcomp',
                config: {
                    templateUrl: 'app/costtest/costtest.meetcomp.html',
                    url: 'meetcomp'
                }
            },
            {
                state: 'costtest.group',
                config: {
                    template: '<h1>Manage Grouping</h1>',
                    url: 'group'
                }
            },
            {
                state: 'costtest.pricing',
                config: {
                    template: '<h1>Pricing</h1>',
                    url: 'pricing'
                }
            },
            {
                state: 'costtest.audit',
                config: {
                    template: '<h1>Audit</h1>',
                    url: 'audit'
                }
            },

        ];
    }
})();