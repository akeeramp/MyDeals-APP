(function () {
    angular
        .module('app.advancedSearch')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    //function getStates() {
    //    return [
    //        {
    //            state: 'advancedSearch',
    //            config: {
    //                url: '/',
    //                abstract: true,
    //                views: {
    //                    'bodyView': {
    //                        templateUrl: '/app/advancedSearch/advancedSearch.html',
    //                        controller: 'AdvancedSearchController as vm',
    //                        //controllerAs: 'dashboard',
    //                        resolve: {
    //                            securityLoaded: ['securityService', function (securityService) {
    //                                return securityService.loadSecurityData();
    //                            }]
    //                        }
    //                    }
    //                }
    //            }
    //        }

    //    ];
    //}

    function getStates() {
        return [
            {
                state: 'advancedSearch',
                config: {
                    url: '/',
                    //abstract: true,
                    templateUrl: '/app/advancedSearch/advancedSearch.html',
                    controller: 'AdvancedSearchController as vm',
                    //resolve: {
                    //    securityLoaded: ['securityService', function (securityService) {
                    //        return securityService.loadSecurityData();
                    //    }]
                    //}

                }
            },
                {
                    state: 'advancedSearch.advancedSearch',
                    config: {
                        url: '/advancedSearch',
                        //abstract: true,
                        templateUrl: '/app/advancedSearch/advancedSearch.html',
                        controller: 'AdvancedSearchController as vm'
                        //resolve: {
                        //            securityLoaded: ['securityService', function (securityService) {
                        //                return securityService.loadSecurityData();
                        //            }]
                        //        }
                        //views: {
                        //    'lnavView': {
                        //        templateUrl: '/app/dashboard/views/nav.html'
                        //    },
                        //    'dashboardHeaderView': {
                        //        templateUrl: '/app/dashboard/views/header.html'
                        //    },
                        //    'dashboardWrapperView': {
                        //        templateUrl: '/app/dashboard/views/content.html'
                        //    }
                        //}
                    }
                }
            
        ];
    }
})();