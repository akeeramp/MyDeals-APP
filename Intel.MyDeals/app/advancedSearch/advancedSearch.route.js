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
                    abstract: false,
                    template: '<div ui-view></div>',
                    url: '/',
                    resolve: {
                        securityLoaded: ['securityService', function (securityService) {
                            return securityService.loadSecurityData();
                        }]
                    }
                }
            },
            {
                state: 'advancedSearch.search',
                abstract: false,
                config: {
                    templateUrl: '/app/advancedSearch/advancedSearch.html',
                    url: 'search',
                    controller: 'AdvancedSearchController as vm'
                }
            },
            {
                state: 'advancedSearch.attributeSearch',
                abstract: false,
                config: {
                    templateUrl: '/app/advancedSearch/attributeSearch.html',
                    url: 'attributeSearch',
                    controller: 'attributeSearchController'
                }
            },
            {
                state: 'advancedSearch.tenderSearch',
                abstract: false,
                config: {
                    templateUrl: '/app/advancedSearch/tenderSearch.html',
                    url: 'tenderSearch',
                    controller: 'tenderSearchController'
                }
            },
            {
                state: 'advancedSearch.gotoPs',
                config: {
                    url: 'gotoPs/{dcid:int}',
                    templateUrl: '/app/advancedSearch/psSearch.html',
                    controller: 'PsSearchController'
                }
            },
            {
                state: 'advancedSearch.gotoDeal',
                config: {
                    url: 'gotoDeal/{dcid:int}',
                    templateUrl: '/app/advancedSearch/dealSearch.html',
                    controller: 'DealSearchController'
                }
            }
        ];
    }
})();