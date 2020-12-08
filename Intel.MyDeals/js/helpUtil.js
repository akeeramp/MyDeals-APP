// NOTE: All values (right-hand column) must correspond to one of the href found in the Help\index.cshtml file.
var HelpTopicEnum = Object.freeze({
    "MeetComp_AutoPopulation":          "Auto+Population",
    "DealManager_ContractNavigator":    "Contract+Navigator",
    "PriceTableEditor_Features":        "Pricing+Table+Editor+Features",
    "DealEditor_Features":              "Deal+Editor+Features",
    "Dashboard_Filtering":              "Filtering+Dashboard",
    "ContractManager_Features":         "Features",
    "CostTest_DA":                      "Cost+Test",
    "CostTest_SuperGA":                 "Cost+Test",
    "ContractManager_OverlappingDealsCheck": "Overlapping+Deals+Check",
    "ContractManager_ContractAndDealViews":  "Contract+and+Deals+Views",
    "CreateContract_ContractDetails":   "Contract+Details",
    "Dashboard_AdvancedSearch":         "Advanced+Search",
    "Tenders_ManagingTenders":          "Managing+Tenders",
    "ContractManager_GroupingExclusions":    "Grouping+Exclusions"
});

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function showHelpTopic(helpTopic) {
    if (helpTopic && String(helpTopic).length > 0) {
        openInNewTab('https://wiki.ith.intel.com/display/Handbook/' + helpTopic + '?src=contextnavpagetreemode', '_blank');
    } else {
        openInNewTab('https://wiki.ith.intel.com/spaces/viewspace.action?key=Handbook', '_blank');
    }
}
