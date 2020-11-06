(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(Config);

    Config.$inject = ['toastr', '$httpProvider', 'intcAnalyticsProvider', '$sceDelegateProvider', '$qProvider', '$locationProvider', '$compileProvider'];

    function Config(toastr, $httpProvider, intcAnalyticsProvider, $sceDelegateProvider, $qProvider, $locationProvider, $compileProvider) {
        toastr.options.timeOut = 5000;
        toastr.options.positionClass = 'toast-bottom-right';
        $httpProvider.interceptors.push('progressInterceptor');
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

        intcAnalyticsProvider.setDebugging(true);                   //Optional line - for debugging
        intcAnalyticsProvider.setLocalhostMode(true);               //Optional line - for local dev testing
        intcAnalyticsProvider.setConfig({
            config: {
                appId: 114464,
                localhostMode: true,                                //Optional
                //googleAnalyticsId: 'UA-XXXXXX-X',
                uiEnvironment: '',
                saUsageUrl: 'https://appusage.intel.com/Service/api/LogUser' //optional
            }
        });

    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'My Deals Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

})();
