(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('gridMath', gridMath);

    gridMath.$inject = ['$filter'];

    // This filter function calculates basic mathematical operations between grid cells
    function gridMath($filter) {
        return function (items, atrb1, dim1, atrb2, dim2, operation) {
            return gridUtils.gridMath(items, atrb1, dim1, atrb2, dim2, operation);
        };
    }
})();