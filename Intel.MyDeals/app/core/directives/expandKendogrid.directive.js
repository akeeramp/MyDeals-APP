(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('expandKGrid', expandKGrid);

    expandKGrid.$inject = ['$window', '$timeout'];

    function expandKGrid($window, $timeout) {
        return {
            restrict: 'A',
            require: 'kendoGrid', // Ensure the directive is set on a <kendo-grid> element
            scope: {
                gridTopOffset: '@',
                footerOffset: '@'
            },
            link: function (scope, element, attrs) {
                var gridElement = $(element);
                var gridTopOffset = (!!scope.gridTopOffset) ? parseInt(scope.gridTopOffset) : 250;
                var footerOffset = (!!scope.footerOffset) ? parseInt(scope.footerOffset) : 70;
                var minHeight = 200;
                var defHeight = 500;
                $($window).resize(function () {
                    var dataElement = gridElement.find(".k-grid-content");
                    var newGridHeight = $(window).height() - gridTopOffset;
                    if (newGridHeight < minHeight) newGridHeight = defHeight;
                    var newDataAreaHeight = newGridHeight - footerOffset;
                    dataElement.height(newDataAreaHeight);
                    gridElement.height(newGridHeight);
                });

                $timeout(function () {
                    $($window).trigger('resize');
                });
            }
        }
    }
})();
