(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('dirtyTracking', dirtyTracking);

    dirtyTracking.$inject = ['$window', '$timeout'];

    function dirtyTracking($window, $timeout) {
        return {
            restrict: 'A',
            scope: {
                objType: '='
            },
            link: function (scope, element, attrs) {
                scope.onExit = function () {
                    return "Page has unsaved changes.";
                }

                // Watch the object for _dirty flag if its dirty prompt browser alert
                scope.$watch('objType._dirty', function (newValue, oldValue, el) {
                    window.onbeforeunload = null;
                    if (newValue) {
                        window.onbeforeunload = scope.onExit;
                    }
                }, true);

            }
        }
    }
})();