(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('kitRebateBundleDiscount', kitRebateBundleDiscount);

    kitRebateBundleDiscount.$inject = ['$filter'];

    // This filter function calculates the Kit Deal's Rebate Bundle Discount value (sum of each product's QTY * DISCOUNT PER LINE within that deal)
    function kitRebateBundleDiscount($filter) {

        return function (items, type) {

            var data = items["ECAP_PRICE"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - also are QTY and dscnt_per_line required columns? if not we are going to need to put in checks
            var total = 0;
            var subkitSumCounter = 2;   //subkits are always going to be the primary and first secondary item, so only sum those two dims in that case

            var tmplt = '<table>';
            for (var dimkey in data) {
                if (subkitSumCounter == 0) {
                    break;
                }
                if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {
                    if (type == "subkit") {
                        subkitSumCounter--;
                    }
                    total += items["QTY"][dimkey] * items["DSCNT_PER_LN"][dimkey];
                }
            }

            return total;
        };
    }
})();