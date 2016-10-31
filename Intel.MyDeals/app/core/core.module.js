(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngSanitize', 'ui.router',
        /*
         * Our reusable cross app code modules
         */
        'blocks.exception', 'blocks.logger', 'blocks.router'        
    ]);
})();
