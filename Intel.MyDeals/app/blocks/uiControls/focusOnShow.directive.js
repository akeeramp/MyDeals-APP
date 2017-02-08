angular
    .module('blocks.uiControls')
    .directive('focusOnShow', focusOnShow);

// Minification safe dependency injection
focusOnShow.$inject = ['$timeout'];

function focusOnShow($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            if ($attr.ngShow) {
                $scope.$watch($attr.ngShow,
                    function (newvalue) {
                        if (newvalue) {
                            $timeout(function () {
                                $element[0].focus();
                            }, 0);
                        }
                    });
            }
            if ($attr.ngHide) {
                $scope.$watch($attr.ngHide,
                    function (newvalue) {
                        if (newvalue) {
                            $timeout(function () {
                                $element[0].focus();
                            }, 0);
                        }
                    });
            }
        }
    }
}