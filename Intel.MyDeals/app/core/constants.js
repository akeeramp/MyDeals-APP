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
            "helpTipDateRanges": "Date ranges are based on customer selections above.",
            "helptipMsgCustAccpt": "Deals are defaulted to pending until an acceptance selection is made. If kept in the pending status, any deals sent for approval will be kept in pending status until marked into an accepted state below.",
            "helptipMsgAttachment": "***Will need to have the guideline for what type of attachment, maximum size etc.",
            "pastDateConfirmText": "You have Selected a date in the past which means the dates you will enter will be considered backdated",
            "FileAttachementDesc": "Either an attachment to deal request is uploaded or C2A id or link is enter above.",
            "C2AIdDesc": "Either C2A id or link is entered or an attachment to deal request is uploaded below.",
            "ContractDetails": 'contract.details',
        });
})();