(function() {
    'use strict';

    var ngModule = angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate'
		,'ngSanitize'
		,'ui.router'
		, 'kendo.directives'
		, 'ui.bootstrap'
        /*
         * Our reusable cross app code modules
         */
        ,'blocks.exception'
		,'blocks.logger'
		,'blocks.router'
		
    ]);
})();
