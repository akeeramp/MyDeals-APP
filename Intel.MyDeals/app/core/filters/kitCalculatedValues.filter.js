(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('kitCalculatedValues', kitCalculatedValues);

    kitCalculatedValues.$inject = ['$filter'];

    // This filter function calculates the Kit Deal's Rebate Bundle Discount value (sum of each product's QTY * DISCOUNT PER LINE within that deal)
    function kitCalculatedValues($filter) {
        return function (items, kittype, column) {
            return gridUtils.kitCalculatedValues(items, kittype, column);
        };
    }
})();