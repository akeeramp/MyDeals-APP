(function () {
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
                    url: '/'
                }
            },
            {
                state: 'costtest.icostproducts',
                config: {
                    templateUrl: 'app/costtest/iCostProducts/iCostProducts.html',
                    url: 'icostproducts',
                    controller: 'iCostProductsController as vm'
                }
            }
        ];
    }
})();