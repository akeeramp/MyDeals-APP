// NOTE: All values (right-hand column) must correspond to one of the href found in the Help\index.cshtml file.
var HelpTopicEnum = Object.freeze({
    "MeetComp_AutoPopulation":          "meetauto",
    "DealManager_ContractNavigator":    "nav",
    "PriceTableEditor_Features":        "PTEFeatures",
    "DealEditor_Features":              "dealedit",
    "Dashboard_Filtering":              "filterDashboard",
    "ContractManager_Features":         "managefeatures",
    "CostTest_DA":                      "costtestda",
    "CostTest_SuperGA":                 "costtestga",
    "ContractManager_OverlappingDealsCheck": "overlap",
    "ContractManager_ContractAndDealViews": "contractdeal",
    "CreateContract_ContractDetails": "details",
    "Dashboard_AdvancedSearch": "advsearch"
});

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function showHelpTopic(helpTopic) {
    if (helpTopic && String(helpTopic).length > 0) {
        openInNewTab('Help?topic=' + helpTopic, '_blank');
    } else {
        openInNewTab('Help', '_blank');
    }
}
