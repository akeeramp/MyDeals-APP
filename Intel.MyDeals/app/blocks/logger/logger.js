(function () {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var URL = 'api/Logging/';

        var service = {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,

            // straight to console; bypass toastr
            log: $log.log

            //TODO: include the op.error in the logger
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error: ' + message, data);
            if (typeof data !== 'string') {
                data = 'message: '+ message +' statusText: '+ data['statusText'] + ' responnseText : ' + data['responseText'] + ' ErrorStack: ' + data['data'];
            }
            op.ajaxPostAsync(URL + "LogError", data);
        }

        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info: ' + message, data);
            op.ajaxPostAsync(URL + "PostLogMessage", message);
        }

        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warn('Warning: ' + message, data);
            op.ajaxPostAsync(URL + "PostLogWarning", message);
        }
    }
}());