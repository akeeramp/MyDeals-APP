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
            "uplodaFileHelpText": "Your attachments will upload after clicking the Save Contract button."
        })
        .constant('opGridTemplate', {
            "groups": {
                "ECAP": [
                    { "name": "Deal Info", "order": 0 },
                    { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                    { "name": "Backdate", "order": 2 },
                    { "name": "CAP Info", "order": 98 },
                    { "name": "All", "order": 99 }
                ],
                "VOL_TIER": [
                    { "name": "Deal Info", "order": 0 },
                    { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                    { "name": "Backdate", "order": 2 },
                    { "name": "RPU", "order": 3 },
                    { "name": "All", "order": 99 }
                ],
                "PROGRAM": [
                    { "name": "Deal Info", "order": 0 },
                    { "name": "Consumption", "order": 1, "rules": [{ "logical": "HideIfAll", "atrb": "PAYOUT_BASED_ON", "value": "Billings" }] },
                    { "name": "Backdate", "order": 2 },
                    { "name": "RPU", "order": 3 },
                    { "name": "All", "order": 99 }
                ]
            },
            "templates": {
                "ECAP": {
                    "tools": {
                        "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info"]
                    },
                    "details": {
                        "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "CAP Info"]
                    },
                    "DC_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_PARENT_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "PASSED_VALIDATION": {
                        "Groups": ["Deal Info"]
                    },
                    "START_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "END_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "WF_STG_CD": {
                        "Groups": ["Deal Info"]
                    },
                    "TRKR_NBR": {
                        "Groups": ["Deal Info"]
                    },
                    "OBJ_SET_TYPE_CD": {
                        "Groups": ["All"]
                    },
                    "PTR_USER_PRD": {
                        "Groups": ["Deal Info"]
                    },
                    "TITLE": {
                        "Groups": ["Deal Info"]
                    },
                    "SERVER_DEAL_TYPE": {
                        "Groups": ["All"]
                    },
                    "DEAL_COMB_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "ECAP_PRICE": {
                        "Groups": ["Deal Info", "CAP Info"]
                    },
                    "CAP_INFO": {
                        "Groups": ["Deal Info", "CAP Info"]
                    },
                    "CAP": {
                        "Groups": ["All", "CAP Info"]
                    },
                    "CAP_STRT_DT": {
                        "Groups": ["All", "CAP Info"]
                    },
                    "CAP_END_DT": {
                        "Groups": ["All", "CAP Info"]
                    },
                    "YCS2_INFO": {
                        "Groups": ["Deal Info"]
                    },
                    "YCS2_PRC_IRBT": {
                        "Groups": ["All"]
                    },
                    "YCS2_START_DT": {
                        "Groups": ["All"]
                    },
                    "YCS2_END_DT": {
                        "Groups": ["All"]
                    },
                    "VOLUME": {
                        "Groups": ["Deal Info"]
                    },
                    "ON_ADD_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "DEAL_SOLD_TO_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "EXPIRE_YCS2": {
                        "Groups": ["Deal Info"]
                    },
                    "REBATE_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "MRKT_SEG": {
                        "Groups": ["Deal Info"]
                    },
                    "GEO_COMBINED": {
                        "Groups": ["Deal Info"]
                    },
                    "TRGT_RGN": {
                        "Groups": ["Deal Info"]
                    },
                    "PAYOUT_BASED_ON": {
                        "Groups": ["Deal Info", "Consumption"]
                    },
                    "PROGRAM_PAYMENT": {
                        "Groups": ["Deal Info"]
                    },
                    "TERMS": {
                        "Groups": ["Deal Info"]
                    },
                    //"YCS2_OVERLAP_OVERRIDE": {
                    //    "Groups": ["Deal Info"]
                    //},
                    "REBATE_BILLING_START": {
                        "Groups": ["Consumption"]
                    },
                    "REBATE_BILLING_END": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON_CMNT": {
                        "Groups": ["Consumption"]
                    },
                    //"COST_TEST_RESULT": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"PRD_COST": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TYPE_USED": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TEST_FAIL_OVERRIDE": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TEST_FAIL_OVERRIDE_REASON": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"MEET_COMP_PRICE_QSTN": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_SKU": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_SKU_OTHR": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMPETITIVE_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_BENCH": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"IA_BENCH": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_TARGET_SYSTEM_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_RESULT": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_FAIL_OVERRIDE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_FAIL_OVERRIDE_REASON": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"RETAIL_CYCLE": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF_CMNT": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"ECAP_FLR": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    "BACK_DATE_RSN": {
                        "Groups": ["Backdate"]
                    }
                },
                "VOL_TIER": {
                    "tools": {
                        "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU"]
                    },
                    "details": {
                        "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "RPU"]
                    },
                    "DC_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_PARENT_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "PASSED_VALIDATION": {
                        "Groups": ["Deal Info"]
                    },
                    "START_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "END_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "WF_STG_CD": {
                        "Groups": ["Deal Info"]
                    },
                    "TRKR_NBR": {
                        "Groups": ["Deal Info"]
                    },
                    "OBJ_SET_TYPE_CD": {
                        "Groups": ["All"]
                    },
                    "PTR_USER_PRD": {
                        "Groups": ["Deal Info", "RPU"]
                    },
                    "TITLE": {
                        "Groups": ["Deal Info", "RPU"]
                    },
                    "SERVER_DEAL_TYPE": {
                        "Groups": ["All"]
                    },
                    "DEAL_COMB_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "TIER_NBR": {
                        "Groups": ["Deal Info"]
                    },
                    "REBATE_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "MRKT_SEG": {
                        "Groups": ["Deal Info"]
                    },
                    "GEO_COMBINED": {
                        "Groups": ["Deal Info"]
                    },
                    "TRGT_RGN": {
                        "Groups": ["Deal Info"]
                    },
                    "PAYOUT_BASED_ON": {
                        "Groups": ["Deal Info", "Consumption"]
                    },
                    "PROGRAM_PAYMENT": {
                        "Groups": ["Deal Info"]
                    },
                    "TERMS": {
                        "Groups": ["Deal Info"]
                    },
                    "REBATE_BILLING_START": {
                        "Groups": ["Consumption"]
                    },
                    "REBATE_BILLING_END": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON_CMNT": {
                        "Groups": ["Consumption"]
                    },
                    "BACK_DATE_RSN": {
                        "Groups": ["Backdate"]
                    },
                    "FRCST_VOL": {
                        "Groups": ["RPU"]
                    },
                    "MAX_RPU": {
                        "Groups": ["RPU"]
                    },
                    "USER_MAX_RPU": {
                        "Groups": ["RPU"]
                    },
                    "AVG_RPU": {
                        "Groups": ["RPU"]
                    },
                    "USER_AVG_RPU": {
                        "Groups": ["RPU"]
                    },
                    "RPU_OVERRIDE_CMNT": {
                        "Groups": ["RPU"]
                    }
                },
                "PROGRAM": {
                    "tools": {
                        "Groups": ["Deal Info", "Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU"]
                    },
                    "details": {
                        "Groups": ["Consumption", "Cost Test", "Meet Comp", "Backdate", "Overlapping", "RPU"]
                    },
                    "DC_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "DC_PARENT_ID": {
                        "Groups": ["Deal Info"]
                    },
                    "PASSED_VALIDATION": {
                        "Groups": ["Deal Info"]
                    },
                    "START_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "END_DT": {
                        "Groups": ["Deal Info"]
                    },
                    "WF_STG_CD": {
                        "Groups": ["Deal Info"]
                    },
                    "TRKR_NBR": {
                        "Groups": ["Deal Info"]
                    },
                    "OBJ_SET_TYPE_CD": {
                        "Groups": ["All"]
                    },
                    "PTR_USER_PRD": {
                        "Groups": ["Deal Info", "RPU"]
                    },
                    "TITLE": {
                        "Groups": ["Deal Info", "RPU"]
                    },
                    "SERVER_DEAL_TYPE": {
                        "Groups": ["All"]
                    },
                    "DEAL_COMB_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "REBATE_TYPE": {
                        "Groups": ["Deal Info"]
                    },
                    "MRKT_SEG": {
                        "Groups": ["Deal Info"]
                    },
                    "GEO_COMBINED": {
                        "Groups": ["Deal Info"]
                    },
                    "TRGT_RGN": {
                        "Groups": ["Deal Info"]
                    },
                    "PAYOUT_BASED_ON": {
                        "Groups": ["Deal Info", "Consumption"]
                    },
                    "PROGRAM_PAYMENT": {
                        "Groups": ["Deal Info"]
                    },
                    "TERMS": {
                        "Groups": ["Deal Info"]
                    },
                    //"YCS2_OVERLAP_OVERRIDE": {
                    //    "Groups": ["Deal Info"]
                    //},
                    "REBATE_BILLING_START": {
                        "Groups": ["Consumption"]
                    },
                    "REBATE_BILLING_END": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON": {
                        "Groups": ["Consumption"]
                    },
                    "CONSUMPTION_REASON_CMNT": {
                        "Groups": ["Consumption"]
                    },
                    //"COST_TEST_RESULT": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"PRD_COST": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TYPE_USED": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TEST_FAIL_OVERRIDE": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"COST_TEST_FAIL_OVERRIDE_REASON": {
                    //    "Groups": ["Cost Test"]
                    //},
                    //"MEET_COMP_PRICE_QSTN": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_SKU": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_SKU_OTHR": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMPETITIVE_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_BENCH": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"IA_BENCH": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"COMP_TARGET_SYSTEM_PRICE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_RESULT": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_FAIL_OVERRIDE": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"MEETCOMP_TEST_FAIL_OVERRIDE_REASON": {
                    //    "Groups": ["Meet Comp"]
                    //},
                    //"RETAIL_CYCLE": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"RETAIL_PULL_USR_DEF_CMNT": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    //"ECAP_FLR": {
                    //    "Groups": ["Retail Cycle"]
                    //},
                    "BACK_DATE_RSN": {
                        "Groups": ["Backdate"]
                    },
                    "FRCST_VOL": {
                        "Groups": ["RPU"]
                    },
                    "MAX_RPU": {
                        "Groups": ["RPU"]
                    },
                    "USER_MAX_RPU": {
                        "Groups": ["RPU"]
                    },
                    "AVG_RPU": {
                        "Groups": ["RPU"]
                    },
                    "USER_AVG_RPU": {
                        "Groups": ["RPU"]
                    },
                    "RPU_OVERRIDE_CMNT": {
                        "Groups": ["RPU"]
                    }
                }
            }
        });
})();