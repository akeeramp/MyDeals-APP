function linkUtil() { }

linkUtil.getLinkIcon = function (dataItem) {
    return '<i class="fa fa-link"></i>';
//    var linkVal = linkUtil.getLinkval(dataItem);
//    return linkUtil.getLinkIconByVal(linkVal);
}

linkUtil.getLinkIconByVal = function (val) {
    return (val == 0) ? "&nbsp;" : '<i class="fa fa-link"></i>';
}

linkUtil.getLinkval = function (dataItem) {
    if (dataItem === undefined || dataItem === null || dataItem.uid === undefined) return 0;
    if (linkUtil.vals[dataItem.uid] === undefined || linkUtil.vals[dataItem.uid] === null) linkUtil.vals[dataItem.uid] = 0;
    return linkUtil.vals[dataItem.uid];
}

linkUtil.toggleLink = function (obj, uid) {
    if (obj === undefined || obj === null) return;

    var uid = $(obj).find(".linkContainer").attr("uid")
    if (uid === undefined || uid === null) return;

    var tt = obj.dataset;
    //debugger;
    return;
    if (linkUtil.vals[uid] === undefined) linkUtil.vals[uid] = 0;
    linkUtil.vals[uid] = (linkUtil.vals[uid] == 0) ? 1 : 0;

    $(obj).html(linkUtil.getLinkIconByVal(linkUtil.vals[uid]));
}

