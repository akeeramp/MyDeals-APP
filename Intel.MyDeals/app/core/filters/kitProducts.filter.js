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
                    return 1; // CPU overrides everything, its goes first irrespective of CAP and L1 and L2. CPU is the boss..
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
            // Order by L1, L2 then by CAP
            var items = $filter('orderBy')(items, ['-HAS_L1', '-HAS_L2', parseFloat]);
            var filtered = items;

            // Special condition: if CPU or CS present it will override all the previous rules.
            filtered.sort(function (a, b) {
                return (customOrder(a[field]) > customOrder(b[field]) ? 1 : -1);
            });

            // TODO: modify output to get array of products or comma separated PRD_MBR_SID or HIER_VAL_NM
            //filtered = filtered.map(function (p) {
            //    return p.PRD_MBR_SID;
            //}).join(',');

            return filtered;
        };
    }
})();