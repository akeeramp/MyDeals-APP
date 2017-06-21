/* global toastr:false, moment:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('gridConstants', {
            pageSizes: [10, 25, 50, 100],
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
        .constant('colorDictionary', {
            "pct": {
                "FAIL": "#FC4C02",
                "PASS": "#C4D600",
                "INCOMPLETE": "#f3D54E",
                "NA": "#cccccc"
            },
            "mct": {
                "FAIL": "#FC4C02",
                "PASS": "#C4D600",
                "INCOMPLETE": "#f3D54E",
                "NA": "#cccccc"
            },
            "type": {
                "ALL_TYPES": "#0071C5",
                "ECAP": "#00AEEF",
                "PROGRAM": "#FFA300",
                "VOL_TIER": "#f3D54E",
                "CAP_BAND": "#C4D600"
            },
            "valid": {
                "Dirty": "#cccccc",
                "Complete": "#C4D600"
            },
            "stage": {
                "Complete": "#C4D600",
                "InComplete": "#FC4C02",
                "Draft": "#d8dddf",
                "Requested": "#f9eaa7",
                "Submitted": "#ffd180",
                "Approved": "#c4d600",
                "InProgress": "#d8dddf",
                "Processed": "#C4D600",
                "Active": "#c4d600",
                "Pending Bid": "#FFA300",
                "Lost Bid": "#FC4C02"
            }
        })
        .constant('contractManagerConstants', {
            "helpTipDateRanges": "Date ranges are based on customer selections above.",
            "helptipMsgCustAccpt": "Deals are defaulted to pending until an acceptance selection is made. If kept in the pending status, any deals sent for approval will be kept in pending status until marked into an accepted state below.",
            "helptipMsgAttachment": "Attach multiple files.<br/>Allowed File Types: doc, xls, txt, bmp, jpg, pdf, ppt, zip, xlsx, docx, pptx, odt, ods, ott, sxw, sxc, png, 7z, xps.",
            "pastDateConfirmText": "You have Selected a date in the past which means the dates you will enter will be considered backdated",
            "FileAttachementDesc": "Either an attachment to deal request is uploaded or C2A id or link is enter above.",
            "C2AIdDesc": "Either C2A id or link is entered or an attachment to deal request is uploaded below.",
            "ContractDetails": 'contract.details',
            "uplodaFileHelpText": "Save contract to upload files."
        });
})();