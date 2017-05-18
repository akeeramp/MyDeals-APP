//OpaqueUtils
function op() { }

op.userToken = {};
op.appToken = {};
op.useToastr = true;
op.OpaqueServiceUrlRoot = "http://localhost:25942/";
op.appVersion = "1";



/*
 * CREDENTIALS SECTION
 */

op.getMyRole = function () {
    if (op.userToken === undefined || op.userToken.Usr === undefined) return "";
    return op.userToken.Role.RoleTypeCd;
}
op.getMyFullName = function () {
    if (op.userToken === undefined || op.userToken.Usr === undefined) return "";
    return op.userToken.Usr.FullName;
}
op.getMyWwid = function () {
    if (op.userToken === undefined || op.userToken.Usr === undefined) return "";
    return op.userToken.Usr.WWID;
}
op.getMyIdsid = function () {
    if (op.userToken === undefined || op.userToken.Usr === undefined) return "";
    return op.userToken.Usr.Idsid;
}



/*
 * NOTIFY SECTION
 */

op.notifySuccess = function (msg, title) {
    op.notify("success", msg, title);
}

op.notifyInfo = function (msg, title) {
    op.notify("info", msg, title);
}

op.notifyWarning = function (msg, title) {
    op.notify("warning", msg, title);
}

op.notifyError = function (msg, title) {
    op.notify("error", msg, title);
}

op.notify = function (mode, msg, title) {
    if (op.useToastr) {
        toastr[mode](msg, title);
    } else {
        alert((title === undefined) ? "" : title + ": " + msg);
    }
}


/*
 * AJAX SECTION
 */

op.ajaxGetAsync = function (url, sucessFunc, errorFunc) {
    op.ajax(url, true, "GET", null, sucessFunc, errorFunc);
}

op.ajaxGetWait = function (url, sucessFunc, errorFunc) {
    op.ajax(url, false, "GET", null, sucessFunc, errorFunc);
}

op.ajaxPostAsync = function (url, context, sucessFunc, errorFunc) {
    op.ajax(url, true, "POST", context, sucessFunc, errorFunc);
}
op.ajaxPostWait = function (url, context, sucessFunc, errorFunc) {
    op.ajax(url, false, "POST", context, sucessFunc, errorFunc);
}

op.ajax = function (url, isAsync, ajaxType, context, sucessFunc, errorFunc) {
    var data = (context === null || context === undefined) ? "" : kendo.stringify(context);
    $.ajax({
        url: url,
        traditional: true,
        type: ajaxType,
        dataType: "json",
        data: data,
        async: isAsync,
        contentType: "application/json; charset=utf-8",
        success: sucessFunc,
        error: errorFunc
    });
}



/*
 * BASICS SECTION - Log, Email, Error
 */

op.log = function (json) {
    return;
}

op.email = function (json) {
    return;
}

op.toJS = function (json) {
    return JSON.parse(kendo.stringify(json));
}

op.error = function (ex, msg) {
    return;
    var ver = (op.appVersion !== undefined) ? op.appVersion : "1";
    var app = (op.appToken !== undefined && op.appToken.AppCd !== undefined) ? op.appToken.AppCd : "UNKNOWN";
    var env = (op.appToken !== undefined && op.appToken.Environment !== undefined && op.appToken.Environment.Location !== undefined) ? op.appToken.Environment.Location : "UNKNOWN";
    var idsid = (op.userToken.Usr !== undefined && op.userToken.Usr.Idsid != undefined) ? op.userToken.Usr.Idsid : "UNKNOWN";
    var role = (op.userToken !== undefined && op.userToken.Role != undefined && op.userToken.Role.RoleTypeCd != undefined) ? op.userToken.Role.RoleTypeCd : "UNKNOWN";
    var opaqueCrashLogUrl = op.OpaqueServiceUrlRoot + "api/" + app + "/" + env + "/" + ver + "/StgIncomingItems";

    if (ex !== null && ex !== undefined) {
        if (!(ex.xhr === undefined)) ex = ex.xhr;
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    var msec = today.getMilliseconds();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = mm + '/' + dd + '/' + yyyy + ' ' + hour + ":" + min + ":" + sec + "." + msec;

    var errMsg = "";
    if (ex == null) {
        errMsg = msg;
    } else {
        if (ex.status !== undefined && ex.statusText !== undefined) errMsg += ex.status + " - " + ex.statusText + " : " + msg;
        if (ex.stack !== undefined) errMsg += ex.stack;
    }

    var exMsg = "";
    if (ex == null) {
        errMsg = msg;
    } else {
        if (ex.responseText !== undefined) exMsg += ex.responseText;
        if (ex.stack !== undefined) exMsg += ex.stack;
    }

    if (errMsg === "") errMsg = "UNKNOWN ERROR";
    if (exMsg === "") exMsg = "UNKNOWN ERROR";
    exMsg = exMsg.replace(/\\r\\n/g, '<br />');

    var item =
    {
        Id: 0,
        Dispositioned: false,
        DispositionedTo: 0,
        SubjectTitle: app + "[" + env + "] - " + errMsg,
        Source: "client",
        SigBody: "<HTML><HEAD><style>body {font-size: 11px; font-family: verdana;}</style></HEAD><BODY>" + "<p>" +
            "IDSID: " + idsid + "<br />" +
            "Role: " + role + "<br />" +
            "Version: " + ver + "<br />" +
            "Environment: " + env + "</p>" +
            "<p>" + exMsg + "</p></BODY></HTML>",
        Environment: env,
        Idsid: idsid,
        PotentialMatches: "",
        Attachment: null,
        Role: role,
        Version: ver,
        SubmittedBy: idsid,
        SubmittedDate: today
    };

    op.ajaxPostAsync(opaqueCrashLogUrl, item, function (data) {
        debugger;
    },
    function (e, xhr) {
        //debugger;
    });


    return;
}


/*
 * EXCEPTIONS SECTION - Exception Handling
 */

op.handleError = function (data, simpleError) {

    if (data instanceof Error) {
        op.notifyError(simpleError, 'Something went wrong!');   //TODO: is 'something went wrong' what we want to show the user in each error toast?  Usability question.
        op.error(data, simpleError);                 //TODO: change how we log the failure response once logging is finalized.  how will op.error consume different types of failure responses?
        //TODO: log to our own db as well (not only opaque)?
    } else {
        if (typeof data !== 'string') {
            data = data['statusText'] + ': ' + data['responseText'];
        }
        op.notifyError(simpleError, 'Something went wrong!');   
        op.error(null, data);
        //TODO: log to our own db as well (not only opaque)?
    }
        
}
