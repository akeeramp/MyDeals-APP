(function () {
    angular
        .module('app.tenderManager')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'tender',
                config: {
                    url: '/tender',
                    views: {
                        'bodyView': {
                            templateUrl: '/app/tenderManager/partials/tenderManager.html',
                            controller: 'TenderManagerController'
                        }
                    }
                }
            }
        ];
    }
})();