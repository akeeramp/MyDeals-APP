(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('kitRebateBundleDiscount', kitRebateBundleDiscount);

    kitRebateBundleDiscount.$inject = ['$filter'];

    // This filter function calculates the Kit Deal's Rebate Bundle Discount value (sum of each product's QTY * DISCOUNT PER LINE within that deal)
    function kitRebateBundleDiscount($filter) {
        return function (items, type) {
            return gridUtils.kitRebateBundleDiscount(items, type);
        };
    }
})();