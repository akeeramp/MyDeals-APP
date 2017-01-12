(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(Config);

    Config.$inject = ['toastr', '$httpProvider'];

    function Config(toastr, $httpProvider) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
        $httpProvider.interceptors.push('progressInterceptor');
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'MyDeals Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);
    
})();
