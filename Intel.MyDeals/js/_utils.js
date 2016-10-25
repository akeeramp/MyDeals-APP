function utils() { }

utils.stripObject = function (obj) {
    var newObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== "_events" && key !== "_handlers" && key !== "uid" && key !== "parent") {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
utils.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
utils.joinList = function (mrktSeg, other1, other2) {
    var lst = [];
    if (mrktSeg !== "") lst.push('<li>' + mrktSeg + '</li>');
    if (other1 !== "") lst.push('<li>' + other1 + '</li>');
    if (other2 !== "") lst.push('<li>' + other2 + '</li>');
    return "<ul>" + lst.join(' ') + "</ul>";
}
utils.formatThreePrices = function (cap, net, ecap) {
    if ((cap === null || cap === "") && (net === null || net === "") && (ecap === null || ecap === "")) return "";
    return utils.formatMoney(cap) + "/" + utils.formatMoney(net) + "/" + utils.formatMoney(ecap);
}
utils.formatMoney = function (val, defVal) {
    if (val === null && defVal === null) return "";
    if (val === null) val = defVal;
    return kendo.format("{0:c}", val);
}

