function util() { }

util.isNullOrEmpty = function (obj) {
    return (util.isNull(obj) || obj === "");
}

util.isNull = function (obj) {
    return (obj === undefined || obj === null);
}

util.waitMsg = function (msg, iconClass) {

    if (util.isNull(iconClass)) iconClass = "fa fa-cog fa-spin fa-3x fa-fw";

    // make sure container exists
    if ($("#waitMsg").length <= 0) {
        $("body").append('<div class="waitingCenterDiv"><div id="waitMsg"></div></div>');
    }

    if (msg === "") {
        // if current message is empty... hide waiting message
        $(".waitingCenterDiv").fadeOut("slow", function() {
            $("#waitMsg").html(msg);
        });

    } else {
        var hadPrevMsg = $("#waitMsg").html().length <= 0;

        msg = '<i class="' + iconClass + '"></i><div>' + msg + '</div>';
        $("#waitMsg").html(msg);

        if (hadPrevMsg) {
            // new waiting... show waiting
            $(".waitingCenterDiv").fadeIn("slow", function () { });
        }
    }
}

util.isEmpty = function(map)
{
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

util.findInArray = function (input, id) {
    var len = input.length;
    for (var i = 0; i < len; i++) {
        if (+input[i].DC_ID === +id) {
            return input[i];
        }
    }
    return null;
}

util.stripObject = function (obj) {
    var newObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && key !== "_events" && key !== "_handlers" && key !== "uid" && key !== "parent") {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}
util.generateUUID = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
util.joinList = function (mrktSeg, other1, other2) {
    var lst = [];
    if (mrktSeg !== "") lst.push('<li style="margin-left: -25px;">' + mrktSeg + '</li>');
    if (other1 !== "") lst.push('<li style="margin-left: -25px;">' + other1 + '</li>');
    if (other2 !== "") lst.push('<li style="margin-left: -25px;">' + other2 + '</li>');
    return "<ul>" + lst.join(' ') + "</ul>";
}
util.formatThreePrices = function (cap, net, ecap) {
    if ((cap === null || cap === "") && (net === null || net === "") && (ecap === null || ecap === "")) return "";
    return util.formatMoney(cap) + "/" + util.formatMoney(net) + "/" + util.formatMoney(ecap);
}
util.formatMoney = function (val, defVal) {
    if (val === null && defVal === null) return "";
    if (val === null) val = defVal;
    return kendo.format("{0:c}", val);
}

util.toJS = function (json) {
    return JSON.parse(kendo.stringify(json));
}

util.log = function (msg, startMs) {
    var curMs = new Date().getTime();
    var appendMsg = (startMs !== null && startMs !== undefined) ? " in " + (curMs - startMs) + "ms" : "";
    if (typeof console != "undefined") {
        console.log(curMs + ": " + msg + appendMsg);
    }
}

util.decodeHtml = function (string) {
    return String(string).replace(/&quote;/g, '"').replace(/&#39;/g, "'");
}

util.ToJavaScriptDate = function (value) {
    var pattern = /Date\(([^)]+)\)/;
    var results = pattern.exec(value);
    if (results === null) return value;

    var dt = new Date(parseFloat(results[1]));
    return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
}

util.sort_by = function (field, reverse, primer) {
    // Sort by price high to low
    //homes.sort(sort_by('price', true, parseInt));

    // Sort by city, case-insensitive, A-Z
    //homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));

    var key = primer ?
        function (x) { return primer(x[field]) } :
        function (x) { return x[field] };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}

util.findReg = function (arr, templateKey) {
    var match = templateKey;
    match = match.replace(/-99999/g, '[0-9]+');
    var reg = new RegExp(match);

    for (var index in arr) {
        if (!arr.hasOwnProperty(index)) {
            continue;
        }
        if (reg.test(index)) {
            return index;
        }
    }
    return templateKey;
}

util.formateDate = function (dt, sep) {
    var sepVal = (util.isNull(sep)) ? "/" : sep;
    var theDate = new Date(dt);
    return (theDate.getMonth() + 1) + sepVal + theDate.getDate() + sepVal + theDate.getFullYear();
}

util.formateDateTime = function (dt, sep, sep2) {
    var sepVal = (util.isNull(sep)) ? "/" : sep;
    var sep2Val = (util.isNull(sep2)) ? ":" : sep2;
    var theDate = new Date(dt);
    return (theDate.getMonth() + 1) + sepVal + theDate.getDate() + sepVal + theDate.getFullYear() + " " + theDate.getHour() + sep2Val + theDate.getMinute() + sep2Val + theDate.getSecond();
}

util.error = function (ex, msg) {
    if (!(util.isNull(ex))) {
        try {
            var innerMsg = JSON.parse(ex.responseText).ExceptionMessage.replace(/\r\n/g, '<br/>');
            if (util.isNull(innerMsg)) {
                msg = innerMsg;
            }
        } catch (e) {
        }
        op.error(ex, msg, window.opUrlRoot, window.opAppName, window.opIdsid, window.opRole, window.opEnv, window.opVer, window.opSource);
    }
    if (msg !== "") {
        op.notifyError({ title: "Error", message: msg });
    }
}

util.notify = function (msg) {
    if (msg !== "") {
        op.notifySuccess({ title: "Success", message: msg });
    }
}

util.clone = function (obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


util.getFirstKey = function(data) {
    for (var prop in data)
        if (data.hasOwnProperty(prop))
            if (data.propertyIsEnumerable(prop))
                return prop;
    return null;
}

util.markFormElPass = function (elName) {
    var obj = $(elName);
    if (null == obj || "object" != typeof obj) return;

    obj.siblings(".k-dropdown-wrap").css("borderColor", "#bababa");
    obj.parent(".k-picker-wrap").css("borderColor", "#bababa");

    obj.parent().removeClass("has-error");
    obj.parent().removeClass("has-feedback");

    var objStatus = $(elName + "Status");
    if (null == objStatus || "object" != typeof objStatus) return;

    objStatus.removeClass("intelicon-alert-solid");
    objStatus.removeClass("form-feedback");
    objStatus.attr('title', '');
}

util.markFormElFail = function (elName, msg) {
    var obj = $(elName);
    if (null == obj || "object" != typeof obj) return false;

    obj.siblings(".k-dropdown-wrap").css("borderColor", "#ed1c24");
    obj.parent(".k-picker-wrap").css("borderColor", "#ed1c24");

    obj.parent().addClass("has-error");
    obj.parent().addClass("has-feedback");

    var objStatus = $(elName + "Status");
    if (null == objStatus || "object" != typeof objStatus) return false;

    objStatus.addClass("intelicon-alert-solid");
    objStatus.addClass("form-feedback");
    objStatus.attr('title', msg);

    return true;
}













//(function (f, define) {
//    define(["kendo"], f);
//})(function () {

//    (function ($, undefined) {

//        var kendo = window.kendo,
//            binders = kendo.data.binders,
//            Binder = kendo.data.Binder,
//            toString = kendo.toString;

//        var parsers = {
//            "number": function (value) {
//                return kendo.parseFloat(value);
//            },

//            "date": function (value) {
//                return kendo.parseDate(value);
//            },

//            "boolean": function (value) {
//                if (typeof value === "string") {
//                    return value.toLowerCase() === "true";
//                }
//                return value != null ? !!value : value;
//            },

//            "string": function (value) {
//                return value != null ? (value + "") : value;
//            },

//            "default": function (value) {
//                return value;
//            }
//        };

//        binders.text = Binder.extend({
//            init: function (element, bindings, options) {
//                //call the base constructor
//                Binder.fn.init.call(this, element, bindings, options);
//                this.jelement = $(element);
//                this.format = this.jelement.attr("data-format");
//                this.parser = parsers[this.jelement.attr("data-parser") || "default"];
//            },
//            refresh: function () {
//                var text = this.bindings.text.get();
//                if (text === null) {
//                    text = "";
//                }
//                else if (this.format) {
//                    text = toString(this.parser(text), this.format);
//                }
//                this.jelement.text(text);
//            }
//        });

//    })(window.kendo.jQuery);

//    return window.kendo;
//}, typeof define == 'function' && define.amd ? define : function (_, f) { f(); });


