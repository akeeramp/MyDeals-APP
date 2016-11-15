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
        ];
    }
})();