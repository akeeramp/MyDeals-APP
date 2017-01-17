/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('gridConstants', {
            pageSizes: [25, 50, 100],
            filterable: {
                extra: false,
                operators: {
                    string: {
                        contains: "Contains",
                        doesnotcontain: "Does not contain",
                        startswith: "Starts with",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    },
                    number: {
                        gt: "Greater than",
                        lt: "Less than",
                        eq: "Is equal to",
                        neq: "Is not equal to"
                    }
                }
            }
        });
})();
