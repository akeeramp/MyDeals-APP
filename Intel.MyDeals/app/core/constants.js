/* global toastr:false, moment:false */
(function () {
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
        })
        .constant('pctRulesDrpDownValues', {
            costTestProductType: [{ 'name': 'L1' }, { 'name': 'L2' }],
            conditionCriteria: [{ 'name': 'Include' }, { 'name': 'Exclude' }],
        })
        .constant('contractManagerConstants', {
            "helptipMsgCustAccpt": "Deals are defaulted to pending until a acceptance selection is made. If kept in the pending status, any deals sent for approval will be kept in pending status until marked into a accepted state below.",
            "helptipMsgAttachment": "***Will need to have the guideline for what type of attachment, maximum size etc.",
            "pastDateConfirmText": "You have Selected a date in the past which means the dates you will enter will be considered backdated"
        });
})();
