var HelpTopicEnum = Object.freeze({
    "MeetComp_AutoPopulation":          "meetauto",
    "DealManager_ContractNavigator":    "nav",
    "PriceTableEditor_Features":        "PTEFeatures",
    "DealEditor_Features":              "dealedit",
    "Dashboard_Filtering":              "filterDashboard"
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
