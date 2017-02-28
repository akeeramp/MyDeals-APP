(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('bindToHeight', bindToHeight);

    bindToHeight.$inject = ['$timeout'];

    function bindToHeight($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var attributes = scope.$eval(attrs['bindToHeight']);
                var fixedHeight = attributes[0];
                var targetElem = angular.element(document.querySelector(attributes[1]));
                var targetWrapperStyle = attributes[2];
                var targetWrapper = angular.element(document.querySelector(attributes[3]));
                var targetHeaderStyle = attributes[4];
                var targetHeader = angular.element(document.querySelector(attributes[5]));

                var scopeTimeout;
                scope.$watch(function () {
                        if (scopeTimeout) $timeout.cancel(scopeTimeout);
                        scopeTimeout = $timeout(function () {
                            var newValue = targetElem.height();
                            angular.element(targetWrapper).css(targetWrapperStyle, newValue + fixedHeight);
                            angular.element(targetHeader).css(targetHeaderStyle, -(newValue + fixedHeight));

                        }, 50);
                        return targetElem.height();
                });

            }
        }
    }

})();
