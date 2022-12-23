(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(Config);

    Config.$inject = ['$httpProvider',  '$sceDelegateProvider', '$qProvider', '$locationProvider', '$compileProvider'];

    function Config( $httpProvider,  $sceDelegateProvider, $qProvider, $locationProvider, $compileProvider) {
        $locationProvider.hashPrefix('');
        //$compileProvider.preAssignBindingsEnabled(false);

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://appusage.intel.com/**',
            'https://www.googletagmanager.com/**'
        ]);

        $qProvider.errorOnUnhandledRejections(false);

    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'My Deals Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

})();
