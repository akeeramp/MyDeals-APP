(function () {
    angular
        .module('app.contract')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'contract',
                config: {
                    url: '/manager/{cid:int}',
                    abstract: true,
                    views: {
                        'bodyView': {
                            templateUrl: '/app/contract/partials/contract.html',
                            controller: 'ContractController',
                            controllerAs: 'contract',
                            resolve: {
                                contractData: ['$stateParams', 'objsetService', function ($stateParams, objsetService) {
                                    if ($stateParams.cid <= 0) return null;
                                    return objsetService.readContract($stateParams.cid);
                                }],
                                templateData: ['$stateParams', 'templatesService', function ($stateParams, templatesService) {
                                    return templatesService.readTemplates();
                                }],isNewContract: ['$stateParams', function ($stateParams) {
                                    return $stateParams.cid <= 0;
                                }],
                                securityLoaded: ['securityService', function (securityService) {
                                    return securityService.loadSecurityData();
                                }],
                                copyContractData: ['objsetService', function (objsetService) {
                                    return objsetService.readCopyContract();
                                }],
                                isTender: function () { return false }
                            }
                        }
                    }
                }
            }, {
                state: 'contract.pct',
                config: {
                    url: '/pct',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummaryPct.html',
                            controller: 'managerPctController',
                            resolve: {
                                contractData: function () {
                                    return '';
                                },
                                isToolReq: function () {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }, {
                state: 'contract.deals',
                config: {
                    url: '/deals',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummaryDeals.html',
                            controller: 'AllDealsController'
                        }
                    }
                }
            }, {
                state: 'contract.export',
                config: {
                    url: '/export',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractExportHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractExport.html',
                            controller: 'exportController'
                        }
                    }
                }
            }, {
                state: 'contract.compliance',
                config: {
                    url: '/compliance',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavCompliance.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractComplianceHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractCompliance.html',
                            controller: 'managerController'
                        }
                    }
                }
            }, {
                state: 'contract.summary',
                config: {
                    url: '/summary',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummary.html',
                            controller: 'managerController'
                        }
                    }
                }
            }, {
                state: 'contract.overlapping',
                config: {
                    url: '/overlapping',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummaryOverlapping.html',
                            controller: 'managerOverlappingController'
                        }
                    }
                }
            }, {
                state: 'contract.grouping',
                config: {
                    url: '/grouping',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummaryExcludeGroups.html',
                            controller: 'managerExcludeGroupsController'
                        }
                    }
                }
            }, {
                state: 'contract.timeline',
                config: {
                    url: '/timeline',
                    views: {
                        'lnavView': {
                            templateUrl: '/app/contract/partials/lnavSummary.html'
                        },
                        'contractHeaderView': {
                            templateUrl: '/app/contract/partials/contractSummaryHeader.html'
                        },
                        'contractWrapperView': {
                            templateUrl: '/app/contract/partials/contractSummaryTimeline.html',
                            controller: 'managerTimelineController'
                        }
                    }
                }
            }, {
                state: 'contract.details',
                config: {
                    url: '/details?copycid',
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
                state: 'contract.manager',
                config: {
                    url: '',
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
                    url: '/{sid:int}/{pid:int}',
                    views: {
                        'pricingTableView': {
                            templateUrl: '/app/contract/partials/pricingTable.html',
                            controller: 'PricingTableController',
                            resolve: {
                                pricingTableData: ['$stateParams', 'objsetService', function ($stateParams, objsetService) {
                                    if ($stateParams.pid <= 0) return null;
                                    return objsetService.readPricingTable($stateParams.pid);
                                }]
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
                state: 'nocontract',
                config: {
                    url: '/nocontract',
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