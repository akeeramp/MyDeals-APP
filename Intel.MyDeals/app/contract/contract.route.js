(function () {
    angular
        .module('app.contract')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '*path');
    }

    function getStates() {
        return [
            {
                state: 'contract',
                config: {
                    url: '/:cid',
                    abstract: true,
                    views: {
                        'bodyView': {
                            templateUrl: '/app/contract/partials/contract.html',
                            controller: 'ContractController',
                            controllerAs: 'contract',
                            resolve: {
                                contractData: function ($stateParams, objsetService) {
                                    if ($stateParams.cid <= 0) return null;
                                    topbar.show();
                                    return objsetService.readContract($stateParams.cid);
                                },
                                templateData: function ($stateParams, templatesService) {
                                    return templatesService.readTemplates();
                                }
                            }
                        }
                    }
                }
            }, {
                state: 'contract.details',
                config: {
                    url: '/details',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnav.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractDetail.html'
                        }
                    }
                }
            }, {
                state: 'contract.summary',
                config: {
                    url: '/summary',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnav.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummary.html'
                        }
                    }
                }
            }, {
                state: 'contract.manager',
                config: {
                    url: '/manager',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnav.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractBody.html'
                        }
                    }
                }
            }, {
                state: 'contract.manager.strategy',
                config: {
                    url: '/:sid/:pid',
                    views: {
                        'pricingTableView': {
                            templateUrl: '/app/contract/partials/pricingTable.html',
                            controller: 'PricingTableController',
                            resolve: {
                                pricingTableData: function ($stateParams, objsetService) {
                                    if ($stateParams.pid <= 0) return null;
                                    topbar.show();
                                    return objsetService.readPricingTable($stateParams.pid);
                                }
                            }
                        }
                    }
                }
            }, {
            state: 'contract.manager.strategy.wip',
                config: {
                    url: '/wip',
                    views: {
                        'wipDealView': {
                            templateUrl: '/app/contract/partials/wipDeals.html'
                        }
                    }
                }
            }, {
                state: 'otherwise',
                config: {
                    url: '*path',
                    views: {
                        'bodyView': {
                            templateUrl: '/app/contract/partials/otherwise.html'
                        }
                    }
                }
            }
        ];
    }
})();