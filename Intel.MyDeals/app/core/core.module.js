(function () {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate'
		, 'ngSanitize'
		, 'ui.router'
		, 'kendo.directives'
		, 'ui.bootstrap'
        , 'ui.select'
        , 'ui.toggle'
        , 'angular-linq'
        , 'angular.filter'
        /*
         * Our reusable cross app code modules
         */
		, 'blocks.confirmationModal'
        , 'blocks.exception'
		, 'blocks.logger'
		, 'blocks.router'
        , 'blocks.uiControls'
		, 'blocks.secUtil'

    ]);

    //TODO: Is there a better location to place the global js error handling?
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            alert('Script Error');
        } else {
            //These are unused variables we can potentially use for display/logging:
            //'Message: ' + msg,
            //'URL: ' + url,
            //'Line: ' + lineNo,
            //'Column: ' + columnNo,
            //'Error object: ' + JSON.stringify(error)

            op.handleError(msg, 'Javascript has encountered a problem.');
        }
        return false;
    };
})();