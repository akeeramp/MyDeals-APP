angular
    .module('app.dashboard')
    .run(appRun);

/* @ngInject */
function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
}

function getStates() {
    return [
        {
            state: 'dashboard',
            config: {
                abstract: false,
                template: '<div ui-view></div>',
                url: '/'
            }
        },
        {
            state: 'dashboard.managelayouts',
            config: {
                templateUrl: 'app/dashboard/dashboard.manageLayouts.html',
                url: 'manageLayouts'
            }
        },
        {
            state: 'dashboard.configuration',
            config: {
                template: '<h1>Manage configuration</h1>',
                url: 'configuration'
            }
        },
        {
            state: 'dashboard.view',
            config: {
                template: '<h1>Dashboard</h1>',
                url: 'view'
            }
        }
    ];
}