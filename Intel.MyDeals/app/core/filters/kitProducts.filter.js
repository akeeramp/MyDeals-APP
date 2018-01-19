(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('kitProducts', kitProducts);

    kitProducts.$inject = ['$filter'];

    /*This filter function sorts the KIT products based on
      rules defined in US46816 */
    function kitProducts($filter) {
        function customOrder(item) {
            switch (item) {
                case 'CPU':
                    return 1; // CPU is priority without additional properties
                case 'CS':
                    return 2; // CS is priority if CPU is not around.
                default:
                    return 3; // Additional properties determines who is the boss, product with L1 status goes first, if multiple L1's then one with fat pocket(CAP) gets in first. These rules apply at every level.
            }
        }

        // Order by CAP descending in case of no CAP or CAP range it will go as last item.
        // "-" indicates descending order.
        var parseFloat = function (product) {
            return isNaN(product.CAP) ? -0 : -parseInt(product.CAP);
        };

        return function (items, field) {
            // If CPU or CS present it will take least precedence. If CPU has less CAP and CS has highest CAP, CS will be primary.
            var items = items.sort(function (a, b) {
                return (customOrder(a[field]) > customOrder(b[field]) ? 1 : -1);
            });

            var filtered = items;

            // L1 products will be primary irrespective of CAP and CPU/CS. Within L1 products with highest CAP will be primary. This applies to L2 as well.
            filtered = $filter('orderBy')(filtered, ['-HAS_L1', '-HAS_L2', parseFloat]);

            return filtered;
        };
    }
})();