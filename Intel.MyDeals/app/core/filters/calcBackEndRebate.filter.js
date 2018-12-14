(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('calcBackEndRebate', calcBackEndRebate);

    calcBackEndRebate.$inject = ['$filter'];

    // This filter function calculates basic mathematical operations between grid cells
    function calcBackEndRebate($filter) {
        return function (items, dealType, atrb2, dim2, format) {
            if (dealType == "ECAP") {
                return gridUtils.calculateECAPBackEndRebate(items, atrb2, dim2);
            } else {
                return gridUtils.calcKITBackendRebate(items, atrb2, dim2);
            }
        };
    }
})();