// Independant static style functions
function gridUtils() { }

//gridUtils.formatValue = function (dataValue, dataFormat) {
//    if (dataFormat !== undefined && dataFormat !== "") {
//        kendo.culture("en-US");
//        dataValue = kendo.toString(dataValue, dataFormat);
//    }
//    return dataValue;
//}

gridUtils.uiControlWrapper = function (passedData, field, format) {
    // This is nicer, but slower... rendering template on large data is slower
    //var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.#=field#" kendo-tooltip k-content="dataItem._behaviors.validMsg.#=field#"></div>';
    //tmplt += '<div class="uiControlDiv"';
    //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.#=field#, isReadOnlyCell: dataItem._behaviors.isReadOnly.#=field#,';
    //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.#=field#, isErrorCell: dataItem._behaviors.isError.#=field#, isSavedCell: dataItem._behaviors.isSaved.#=field#, isDirtyCell: dataItem._behaviors.isDirty.#=field#}">';
    //tmplt += '    <span class="ng-binding" ng-bind="(dataItem.#=field# #=gridUtils.getFormat(field, format)#)"></span>';
    //tmplt += '</div>';

    //return kendo.template(tmplt)({
    //    "innerData": passedData,
    //    "field": field,
    //    "format": format
    //});

    // MUCH FASTER
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
    //    tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
    //    tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.booleanDisplay = function (passedData, field) {
    return passedData[field] === true ? "<i class='intelicon-passed-completed-solid' style='font-size: 26px; color:#C4D600;'></i>" : "";
}

gridUtils.uiParentControlWrapper = function (dataItem) {
    var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="showStage(dataItem)"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiBoolControlWrapper = function (dataItem, field) {
    var tmplt = '<div class="uiControlDiv isReadOnlyCell"';
    //tmplt += '    <div class="ng-binding vert-center" ng-show="(dataItem.' + field + ' == 1)">Yes</div>';
    //tmplt += '    <div class="ng-binding vert-center" ng-show="(dataItem.' + field + ' != 1)">No</div>';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="showBool(dataItem.' + field + ')"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiStartDateWrapper = function (passedData, field, format) {

    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center"><span ng-if="displayFrontEndDateMessage(dataItem)"> <i class="intelicon-information style="font- size: 12px; color: #00AEEF;" title="If the deal start date is in the past, the deal start date will change to the date when the deal becomes active."></i> </span>';
    tmplt += '    <span class="ng-binding" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')"></span></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiDimControlWrapper = function (passedData, field, dim, format) {
    var tmplt = '';
    if (passedData[field] === undefined) return tmplt;

    if (dim == "20_____2" && passedData.HAS_SUBKIT == "0") {
        //no subkit allowed case
        tmplt += '<div class="uiControlDiv" ng-class="{isReadOnlyCell:true}">';
        tmplt += '<div class="vert-center">No Sub KIT</div>';
        tmplt += '</div>';
    } else {
        if ((dim == "20_____2" || dim == "20_____1") && field == "ECAP_PRICE") {
            tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '_____' + dim + '" kendo-tooltip="" k-content="dataItem._behaviors.validMsg.' + field + '_____' + dim + '" style="" data-role="tooltip"></div>';
        } else {
            tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
        }

        tmplt += '<div class="uiControlDiv"';

        tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
        tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + '[\'' + dim + '\'] ' + gridUtils.getFormat(field, format) + ')"></div>';
        tmplt += '</div>';
    }
    return tmplt;
}
gridUtils.exportDimControlWrapper = function (passedData, field, dim, format) {
    var tmplt = '';
    if (passedData[field] === undefined) return tmplt;

    if (dim == "20_____2" && passedData.HAS_SUBKIT == "0") {
        //no subkit allowed case
        tmplt += 'No Sub KIT';
    } else {
        if (passedData[field] !== undefined) {
            var val = passedData[field][dim];
            val = gridUtils.formatValue(val, format);
            tmplt += val;
        }
    }
    return tmplt;
}

gridUtils.uiDimTrkrControlWrapper = function (passedData) {
    var tmplt = '';
    var dim = "";
    var field = "TRKR_NBR";
    var data = passedData[field];

    if (data === undefined || Object.keys(data) === undefined || Object.keys(data) === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
    tmplt += '<div class="vert-center">';

    dim = "20_____2"
    if (passedData[field][dim] != null) {
        tmplt += '    <div class="ng-binding" ng-bind="(dataItem.' + field + '[\'' + dim + '\'] )"></div>';
    }
    dim = "20_____1"
    if (passedData[field][dim] != null) {
        tmplt += '    <div class="ng-binding" ng-bind="(dataItem.' + field + '[\'' + dim + '\'] )"></div>';
    }

    for (var index in sortedKeys) { //only looking for positive dim keys
        dim = sortedKeys[index];
        if (data.hasOwnProperty(dim) && dim.indexOf("___") >= 0 && dim.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += '    <div class="ng-binding" ng-bind="(dataItem.' + field + '[\'' + dim + '\'] )"></div>';
        }
    }

    tmplt += '</div></div>';

    return tmplt;
}
gridUtils.exportDimTrkrControlWrapper = function (passedData) {
    var tmplt = '';
    var dim = "";
    var field = "TRKR_NBR";
    var data = passedData[field];

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    var tmplt = '';
    if (passedData[field] !== undefined) {
        dim = "20_____2"
        if (passedData[field][dim] != null) {
            tmplt += passedData[field][dim];
            tmplt += ", ";
        }
        dim = "20_____1"
        if (passedData[field][dim] != null) {
            tmplt += passedData[field][dim];
            tmplt += ", ";
        }

        for (var index in sortedKeys) { //only looking for positive dim keys
            dim = sortedKeys[index];
            if (data.hasOwnProperty(dim) && dim.indexOf("___") >= 0 && dim.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
                tmplt += passedData[field][dim];
                tmplt += ", ";
            }
        }
    }
    if (tmplt != '') {
        //shave off the last ", " in the return string
        tmplt = tmplt.slice(0, -2);
    }

    return tmplt;
}

gridUtils.getFormatedDim = function (dataItem, field, dim, format) {
    var item = dataItem[field];
    if (item === undefined || item[dim] === undefined) return item;
    return gridUtils.formatValue(item[dim], format);
}
gridUtils.formatValue = function (val, format) {
    if (val === undefined) {
        val = "";
    }
    else if (format !== undefined) {
        kendo.culture("en-US");
        if (format === "currency") {
            if (!isNaN(val))
                val = kendo.toString(parseFloat(val), "c");
        } else if (format === "number") {
            if (!isNaN(val))
                val = kendo.toString(parseFloat(val), "n");
        } else if (format === "date") {
            val = moment(val).format("MM/DD/YYYY");
        }
    }
    return val;
}

gridUtils.uiCustomerControlWrapper = function (passedData, field, altField) {
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv isReadOnlyCell">';
    tmplt += '     <div class="ng-binding vert-center" ng-if="dataItem.CUST_ACCNT_DIV === \'\'" ng-bind="dataItem.Customer.CUST_NM"></div>';
    tmplt += '     <div class="ng-binding vert-center" ng-if="dataItem.CUST_ACCNT_DIV !== \'\'" ng-bind="dataItem.CUST_ACCNT_DIV"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiControlEndDateWrapper = function (passedData, field, format) {
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
    //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
    //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')" ng-class="{\'redfont\': dataItem.EXPIRE_FLG == 1}"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiControlScheduleWrapper = function (passedData) {
    var tmplt = '<table>';
    var fields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Vol", "field": "STRT_VOL", "format": "number", "align": "right" },
        { "title": "End Vol", "field": "END_VOL", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
    ];

    tmplt += '<tr style="height: 15px;">';
    for (var t = 0; t < fields.length; t++) {
        var mjr = fields[t].title === "Tier" ? "" : "border-bottom: 2px solid #0071C5;";
        tmplt += '<th style="padding: 0 4px; font-weight: 400; text-transform: uppercase; font-size: 10px; background: #eeeeee; text-align: center; ' + mjr + '">' + fields[t].title + '</th>';
    }
    tmplt += '</tr>';

    var numTiers = 0;
    var tiers = passedData.TIER_NBR;
    for (var key in tiers) {
        if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
            numTiers++;
            var dim = "10___" + numTiers;
            tmplt += '<tr style="height: 25px;">';
            for (var f = 0; f < fields.length; f++) {
                tmplt += '<td style="text-align: ' + fields[f].align + ';"';
                tmplt += ' ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + fields[f].field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + fields[f].field + ', isRequiredCell: dataItem._behaviors.isRequired.' + fields[f].field + ', isErrorCell: dataItem._behaviors.isError.' + fields[f].field + ', isSavedCell: dataItem._behaviors.isSaved.' + fields[f].field + ', isDirtyCell: dataItem._behaviors.isDirty.' + fields[f].field + '}">';
                tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + fields[f].field + '_' + dim + '" kendo-tooltip="" k-content="dataItem._behaviors.validMsg.' + fields[f].field + '_' + dim + '" style="" data-role="tooltip"></div>';
                tmplt += '<span class="ng-binding" ng-if="dataItem.' + fields[f].field + '[\'' + dim + '\'] == \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + '\'] ' + gridUtils.getFormat(fields[f].field, "") + ')"></span>';
                tmplt += '<span class="ng-binding" ng-if="dataItem.' + fields[f].field + '[\'' + dim + '\'] != \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + fields[f].field + '[\'' + dim + '\'] ' + gridUtils.getFormat(fields[f].field, fields[f].format) + ')"></span>';
                tmplt += '</td>';
            }
            tmplt += '</tr>';
        }
    }

    tmplt += '</table>';

    return tmplt;
}
gridUtils.exportControlScheduleWrapper = function (passedData) {
    var tmplt = 'Tier, Start Vol, End Vol, Rate\n';
    var fields = [
        { "title": "Tier", "field": "TIER_NBR", "format": "number", "align": "right" },
        { "title": "Start Vol", "field": "STRT_VOL", "format": "number", "align": "right" },
        { "title": "End Vol", "field": "END_VOL", "format": "number", "align": "right" }, //TODO: inject angular $filter with new textOrNumber filter and use it as format, then we can avoid the double ng-if duplicate in the tmplt below, removing the ng-if all together
        { "title": "Rate", "field": "RATE", "format": "currency", "align": "right" }
    ];

    var numTiers = 0;
    var tiers = passedData.TIER_NBR;
    for (var key in tiers) {
        if (tiers.hasOwnProperty(key) && key.indexOf("___") >= 0) {
            numTiers++;
            var dim = "10___" + numTiers;
            var vals = [];
            for (var f = 0; f < fields.length; f++) {
                var val = passedData[fields[f].field][dim];
                if (val !== "Unlimited") {
                    val = gridUtils.formatValue(val, fields[f].format);
                }
                vals.push(val);
            }
            tmplt += vals.join(", ").replace(/null/g, '').replace(/undefined/g, '') + '\n';
        }
    }

    return tmplt;
}

//this control wrapper to be used for dimentionalized attributes (0-based index, so not for VT attributes like numTiers)
gridUtils.uiPositiveDimControlWrapper = function (passedData, field, format) {
    var data = passedData[field];

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    var tmplt = '<table>';
    for (var index in sortedKeys) { //only looking for positive dim keys
        dimkey = sortedKeys[index];
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += '<tr style="height: 25px;">';
            tmplt += '<td style="text-align:right;"';
            tmplt += ' ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
            tmplt += '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '_' + dimkey + '" kendo-tooltip="" k-content="dataItem._behaviors.validMsg.' + field + '_' + dimkey + '" style="" data-role="tooltip"></div>';
            tmplt += '<span class="ng-binding" ng-if="dataItem.' + field + '[\'' + dimkey + '\'] == \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + field + '[\'' + dimkey + '\'] ' + gridUtils.getFormat(field, "") + ')"></span>';
            tmplt += '<span class="ng-binding" ng-if="dataItem.' + field + '[\'' + dimkey + '\'] != \'Unlimited\'" style="padding: 0 4px;" ng-bind="(dataItem.' + field + '[\'' + dimkey + '\'] ' + gridUtils.getFormat(field, format) + ')"></span>';
            tmplt += '</td>';
            tmplt += '</tr>';
        }
    }
    tmplt += '</table>';

    if (tmplt == '<table></table>') {   //if table comes out empty, just set same behavior as single dim version, generally just a blank readonly div
        tmplt = gridUtils.uiDimControlWrapper(passedData, field, '20___0', format);
    }

    return tmplt;
}
gridUtils.exportPositiveDimControlWrapper = function (passedData, field, format) {
    var data = passedData[field];

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    var tmplt = '';
    for (var index in sortedKeys) { //only looking for positive dim keys
        dimkey = sortedKeys[index];
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            var val = passedData[field][dimkey];
            if (val !== "Unlimited") {
                val = gridUtils.formatValue(val, format);
            }
            tmplt += val + '\n';
        }
    }

    return tmplt;
}

gridUtils.uiDimInfoControlWrapper = function (passedData, field) {
    var data = passedData["ECAP_PRICE"];    //iterate dim keys with ecap price because it is a guaranteed to exist required field - TODO: replace with TIER_NBR or something that would be better to formally iterate on?

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    var YCS2modifier = "";
    if (field === "YCS2") {
        YCS2modifier = "_PRC_IRBT";
    }

    var tmplt = '<table>';
    for (var index in sortedKeys) { //only looking for positive dim keys
        dimkey = sortedKeys[index];
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += '<tr style="height: 25px;">';
            tmplt += '<td style="text-align:right;"';
            tmplt += ' ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
            tmplt += "<op-popover ";
            if (field === "CAP") {
                tmplt += "ng-click='openCAPBreakOut(dataItem, \"" + field + "\", \"" + dimkey + "\")'";
            }
            tmplt += "op-options='" + field + "' op-label='' op-data='getPrductDetails(dataItem, \"" + field + "\", \"" + dimkey + "\")'>";
            var fieldText = field + '_STRT_DT';
            // Special handling for YCS2, naming convention is not followed in defining start date attribute..
            if (field === "YCS2") {
                fieldText = field + '_START_DT'
            }
            tmplt += gridUtils.uiMoneyDatesControlWrapper(passedData, field + YCS2modifier, fieldText, field + '_END_DT', dimkey);
            tmplt += "</op-popover>";
            tmplt += '</td>';
            tmplt += '</tr>';
        }
    }
    tmplt += '</table>';

    return tmplt;

}

//this control wrapper to be used for displaying which product is associated with each dimention
gridUtils.uiProductDimControlWrapper = function (passedData, type) {
    var data = passedData["PTR_USER_PRD"].split(',');
    var tmplt = '';
    if (type == "kit") {
        tmplt += '<table>';
        for (var i = 0; i < data.length; i++) {
            tmplt += '<tr style="height: 25px;">';
            tmplt += '<td style="text-align:right;"';
            tmplt += ' ng-class="{isReadOnlyCell:true}">';
            tmplt += '<span class="ng-binding" style="padding: 0 4px; color: #0071C5; cursor: pointer;" ng-click="openDealProducts(dataItem)" ng-bind="\'' + data[i] + '\'"></span>';
            tmplt += '</td>';
            tmplt += '</tr>';
        }
        tmplt += '</table>';
    } else if (type == "subkit" && passedData.HAS_SUBKIT == "1") {
        tmplt += '<table>';
        for (var i = 0; i < data.length; i++) {
            if (i <= 1) {   //primary or secondary1
                tmplt += '<tr style="height: 25px;">';
                tmplt += '<td style="text-align:right;"';
                tmplt += ' ng-class="{isReadOnlyCell:true}">';
                tmplt += '<span class="ng-binding" style="padding: 0 4px; color: #0071C5; cursor: pointer;" ng-click="openDealProducts(dataItem)" ng-bind="\'' + data[i] + '\'"></span>';
                tmplt += '</td>';
                tmplt += '</tr>';
            } else {
                tmplt += '<tr style="height: 25px;">';
                tmplt += '<td style="text-align:right;"';
                tmplt += ' ng-class="{isReadOnlyCell:true}">';
                tmplt += '<span class="" style="padding: 0 4px;"></span>';
                tmplt += '</td>';
                tmplt += '</tr>';
            }
        }
        tmplt += '</table>';
    } else {
        //no subkit allowed case, i.e. type = "subkit" and HAS_SUBKIT == 0
        tmplt += '<div class="uiControlDiv isReadOnlyCell">';
        tmplt += '<div class="ng-binding vert-center">No Sub KIT</div>';
        tmplt += '</div>';
    }
    return tmplt;
}

gridUtils.uiProductControlWrapper = function (passedData, type) {
    var tmplt = '<div class="uiControlDiv isReadOnlyCell">';
    tmplt += '     <div class="ng-binding vert-center" style="color: #0071C5; cursor: pointer;" ng-click="openDealProducts(dataItem)" ng-bind="dataItem.TITLE" ng-attr-title="{{dataItem.TITLE}}"></div>';
    tmplt += '</div>';
    return tmplt;
}

//this control wrapper to be used for system generated column values that are or depend on dimentionalized attributes
gridUtils.uiPrimarySecondaryDimControlWrapper = function (passedData) {
    var data = passedData["ECAP_PRICE"];    //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order
    var setPrimary = true;

    var tmplt = '<table>';
    for (var index in sortedKeys) { //only looking for positive dim keys
        dimkey = sortedKeys[index];
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += '<tr style="height: 25px;">';
            tmplt += '<td style="text-align:right;"';
            tmplt += ' ng-class="{isReadOnlyCell:true}">';
            if (setPrimary) {
                tmplt += '<span class="ng-binding" style="padding: 0 4px;" ng-bind="\'P\'"></span>';
                setPrimary = false;
            } else {
                tmplt += '<span class="ng-binding" style="padding: 0 4px;" ng-bind="\'S\'"></span>';
            }
            tmplt += '</td>';
            tmplt += '</tr>';
        }
    }
    tmplt += '</table>';

    return tmplt;
}
gridUtils.exportPrimarySecondaryDimControlWrapper = function (passedData) {
    var data = passedData["ECAP_PRICE"];    //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers
    var setPrimary = true;

    var tmplt = '';
    for (var dimkey in data) {
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            if (setPrimary) {
                tmplt += 'Primary';
                setPrimary = false;
            } else {
                tmplt += 'Secondary';
            }
            tmplt += '\n';
        }
    }

    return tmplt;
}

//this control wrapper is only used to calculate KIT deal's TOTAL_DISCOUNT_PER_LINE
gridUtils.uiTotalDiscountPerLineControlWrapper = function (passedData, format) {
    var data = passedData["QTY"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - are QTY and dscnt_per_line required columns?

    if (data === undefined || data === null) return "";

    var sortedKeys = Object.keys(data).sort();  //to enforce primary listed before secondaries and dims are shown in order

    var tmplt = '<table>';
    for (var index in sortedKeys) { //only looking for positive dim keys
        dimkey = sortedKeys[index];
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += '<tr style="height: 25px;">';
            tmplt += '<td style="text-align:right;"';
            tmplt += ' ng-class="{isReadOnlyCell:true}">';
            tmplt += '<span class="ng-binding" style="padding: 0 4px;" ng-bind="((dataItem.QTY[\'' + dimkey + '\'] * dataItem.DSCNT_PER_LN[\'' + dimkey + '\']) ' + gridUtils.getFormat("", format) + ')"></span>';
            tmplt += '</td>';
            tmplt += '</tr>';
        }
    }
    tmplt += '</table>';

    return tmplt;
}
gridUtils.exportTotalDiscountPerLineControlWrapper = function (passedData, format) {
    var data = passedData["QTY"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - are QTY and dscnt_per_line required columns?

    var tmplt = '';
    for (var dimkey in data) {
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {  //capture the non-negative dimensions (we've indicated negative as five underscores), skipping things like ._events
            tmplt += gridUtils.formatValue(passedData.QTY[dimkey] * passedData.DSCNT_PER_LN[dimkey], "currency") + "\n";
        }
    }

    return tmplt;
}

//this control wrapper is only used to calculate KIT deal's system generated currency values such as rebate bundle discount and sum of total discounts per line
gridUtils.uiKitCalculatedValuesControlWrapper = function (passedData, kittype, column) {
    var tmplt = '';
    tmplt += '<div class="uiControlDiv" ng-class="{isReadOnlyCell:true}">';
    if (passedData.HAS_SUBKIT == "0" && kittype == "subkit") {
        //no subkit allowed case
        tmplt += '    <div class="vert-center">No Sub KIT</div>';
    } else {
        tmplt += '    <div class="ng-binding vert-center" ng-bind="((dataItem | kitCalculatedValues : \'' + kittype + '\':\'' + column + '\') ' + gridUtils.getFormat("", 'currency') + ')"></div>';
    }
    tmplt += '</div>';
    return tmplt;
}

gridUtils.exportKitCalculatedValuesControlWrapper = function (passedData, kittype, column) {
    var tmplt = '';
    if (passedData.HAS_SUBKIT == "0" && kittype == "subkit") {
        //no subkit allowed case
        tmplt += 'No Sub KIT';
    } else {
        var val = gridUtils.kitCalculatedValues(passedData, kittype, column);
        tmplt += gridUtils.formatValue(val, "currency");
    }
    return tmplt;
}

gridUtils.uiMoneyDatesControlWrapper = function (passedData, field, startDt, endDt, dimKey) {
    var msg = "";
    var msgClass = "";
    var tmplt = '';

    if (!dimKey) dimKey = "";
    var dimKeyWrapper = dimKey === "" ? dimKey : "[\'" + dimKey + "\']";

    var fieldVal = (dimKey !== "")
        ? !!passedData[field] && !!passedData[field][dimKey] ? passedData[field][dimKey] : ""
        : !!passedData[field] && !!passedData[field] ? passedData[field] : "";

    var startVal = (dimKey !== "")
        ? !!passedData[startDt] && !!passedData[startDt][dimKey] ? passedData[startDt][dimKey] : ""
        : !!passedData[startDt] && !!passedData[startDt] ? passedData[startDt] : "";

    if (field === "CAP" && fieldVal === "No CAP") {
        tmplt += '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;">';
        tmplt += '<div style="line-height: 1em; font-family: arial; text-align: center;font-weight:600">No CAP</div>';
        if (startVal !== "" && kendo.toString(new Date(startVal), 'MM/dd/yyyy') !== '01/01/1900') {
            tmplt += '<div>Availability:<span class="ng-binding" ng-bind="(dataItem.' + startDt + dimKeyWrapper + ' | date:\'MM/dd/yy\')"></span><span></div>';
        }
        tmplt += '</div>';

    } else if (field === "YCS2_PRC_IRBT" && fieldVal === "No YCS2") {
        tmplt += '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;">';
        tmplt += '<div style="line-height: 1em; font-family: arial; text-align: center;font-weight:600">No YCS2</div>';
        if (startVal !== "" && kendo.toString(new Date(startVal), 'MM/dd/yyyy') !== '01/01/1900') {
            tmplt += '<div>Availability:<span class="ng-binding" ng-bind="(dataItem.' + startDt + dimKeyWrapper + ' | date:\'MM/dd/yy\')"></span><span></div>';
        }
        tmplt += '</div>';

    } else {
        if (field === "CAP") {
            var cap = (dimKey !== "")
                ? !!passedData[startDt] && !!passedData.CAP[dimKey] ? parseFloat(passedData.CAP[dimKey]) : ""
                : !!passedData[startDt] && !!passedData.CAP ? parseFloat(passedData.CAP) : "";

            var ecap = (dimKey !== "")
                ? !!passedData[startDt] && !!passedData.ECAP_PRICE[dimKey] ? parseFloat(passedData.ECAP_PRICE[dimKey]) : ""
                : !!passedData[startDt] && !!passedData.ECAP_PRICE ? parseFloat(passedData.ECAP_PRICE) : "";

            if (ecap > cap) {
                var dsplCap = cap === "" ? "No CAP" : cap.toFixed(2);
                var dsplEcap = ecap === "" ? "No ECAP" : ecap.toFixed(2);
                msg = "title = 'ECAP ($" + dsplEcap + ") is greater than the CAP ($" + dsplCap + ")'";
                msgClass = "isSoftWarnCell";
            }
        }
        var capText = '<span class="ng-binding" ng-bind="(dataItem.' + field + dimKeyWrapper + ' ' + gridUtils.getFormat(field, 'currency') + ')" style="font-weight: bold;"></span>';

        if (fieldVal !== "" && fieldVal.indexOf("-") > -1) {
            msg = "CAP price " + fieldVal + " cannot be a range.";
            msgClass = "isSoftWarnCell";
            capText = '<span class="ng-binding" ng-bind="(dataItem.' + field + dimKeyWrapper + ')" style="font-weight: bold;"></span>';
        }

        tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
        tmplt += '<div class="uiControlDiv ' + msgClass + '" style="line-height: 1em; font-family: arial; text-align: center;" ' + msg;
        tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
        //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
        //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', ';
        //tmplt += '     isErrorCell: dataItem._behaviors.isError.' + field + ', ';
        //tmplt += '     isSavedCell: dataItem._behaviors.isSaved.' + field + ', ';
        //tmplt += '     isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
        tmplt += capText;
        tmplt += '    <div>';
        tmplt += '    <span class="ng-binding" ng-bind="(dataItem.' + startDt + dimKeyWrapper + ' | date:\'MM/dd/yy\')"></span> - ';
        tmplt += '    <span class="ng-binding" ng-bind="(dataItem.' + endDt + dimKeyWrapper + ' ' + gridUtils.getFormat(field, "date:'MM/dd/yy'") + ')"></span>';
        tmplt += '    </div>';
        tmplt += '</div>';
    }

    return tmplt;
}

gridUtils.uiBidStatusControlWrapper = function (passedData, field) {
    var tmplt = '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind-html="(passThoughFunc(root.showBidStatusWip, dataItem))"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiMultiselectArrayControlWrapper = function (passedData, field) {
    var displayStr = (Array.isArray(passedData[field]) || Object.prototype.toString.call(passedData[field]) === "[object Object]")
        ? passedData[field].join()
        : passedData[field];

    //TODO: various copy pasted validation flags, need to confirm if they work or actually do anything
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv" style="line-height: 1em; font-family: arial; text-align: center;"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + '}">';
    //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
    //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="vert-center">';
    tmplt += '          ' + displayStr + ' ';
    //tmplt += '    <span class="ng-binding" ng-bind="(dataItem.' + field + ')"></span>';
    tmplt += '    </div>';
    tmplt += '</div>';

    return tmplt;
}

gridUtils.uiMasterChildWrapper = function (passedData, field) {
    var tmplt = '<div class="uiControlDiv" class="isReadOnlyCell">';
    tmplt += '    <div class="vert-center">' + gridUtils.renderMasterChild(passedData) + '</div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiIconWrapper = function (passedData, field, format) {
    var tmplt = '<div class="isDirtyIconGridContainer">';
    tmplt += '<i class="intelicon-upload-solid" style="font-size: 20px; margin-left: 10px;" ng-class="{isDirtyIcon: dataItem.' + field + '}"></i>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.concatDimElements = function (passedData, field) {

    var data = [];

    if (!!passedData[field]) {
        Object.keys(passedData[field]).forEach(function (key, index) {
            if (key.indexOf("___") >= 0) {
                data.push(passedData[field][key]);
            }
        });
    }
    var displayData = data.join(", ");

    var tmplt = '<span class="ng-binding">' + displayData + '</span>';

    return tmplt;
}

gridUtils.getFormat = function (lType, lFormat) {
    return !lFormat ? "" : "| " + lFormat;
}

gridUtils.hasAttachments = function (passedData, field) {
    if (passedData[field] === undefined || passedData[field] !== "1") return "";
    return "<div style='margin: 0 5px;' title='To view attachments, please go to the Deal Editor'><i class='intelicon-attach'></i></div>";
}

gridUtils.convertPstToLocal = function (strDt) {
    moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
    return moment.tz(strDt, 'America/Los_Angeles').local().format('MM/DD/YYYY hh:mm:ss A');
}

gridUtils.convertLocalToPST = function (strDt) {
    moment.tz.add('America/Los_Angeles|PST PDT|80 70|01010101010|1Lzm0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0');
    return moment.tz(strDt, "America/Los_Angeles").format("MM/DD/YY HH:mm:ss");
}

gridUtils.renderCustNm = function (data) {
    var custs = [];
    if (!!data.CustomerDivisions) {
        for (var i = 0; i < data.CustomerDivisions.length; i++) {
            custs.push(data.CustomerDivisions[i].CUST_NM);
        }
    }
    return custs.join(',');
}

gridUtils.renderMasterChild = function (data) {
    if (data.dc_type === 'PRC_TBL_ROW' || data.dc_type === 'MASTER') return '<b>Master</b>';
    if (data.dc_type === 'WIP_DEAL') return 'Child';
    return '';
}

gridUtils.onDataValueChange = function (e) {
    return null;
}

gridUtils.kitCalculatedValues = function (items, kittype, column) {
    var data = items["ECAP_PRICE"];   //TODO: replace with TIER_NBR or PRD_DRAWING_ORD?  ECAP works as each dim must have one but there is likely a more formal way of iterating the tiers - also are QTY and dscnt_per_line required columns? if not we are going to need to put in checks
    if (data === undefined) return "";
    var total = 0.00;
    var subkitSumCounter = 2;   //subkits are always going to be the primary and first secondary item, so only sum those two dims in that case

    var tmplt = '<table>';
    for (var dimkey in data) {
        if (subkitSumCounter == 0) {
            break;
        }
        if (data.hasOwnProperty(dimkey) && dimkey.indexOf("___") >= 0 && dimkey.indexOf("_____") < 0) {
            if (kittype == "subkit") {
                subkitSumCounter--;
            }
            if (column == "rebateBundle" && items["ECAP_PRICE"] !== undefined) {
                total += parseFloat(items["ECAP_PRICE"][dimkey]);
            }
            if (column == "sumTD" && items["DSCNT_PER_LN"] !== undefined) {
                total += items["QTY"][dimkey] * items["DSCNT_PER_LN"][dimkey];
            }
        }
    }

    if (column == "rebateBundle") {
        if (kittype == "subkit") {
            total = total - items["ECAP_PRICE"]["20_____2"];
        }
        if (kittype == "kit") {
            total = total - items["ECAP_PRICE"]["20_____1"];
        }
    }

    return total;
};

gridUtils.formatDate = function (data) {
    return moment(data).format("MM/DD/YYYY");
}

gridUtils.cancelChanges = function (e) {
    $(e.sender.table).closest(".k-grid").data('kendoGrid').dataSource.cancelChanges();
}

gridUtils.clearAllFiltersAndSorts = function () {
    if ($(".k-grid").data("kendoGrid").dataSource.total() > 0) {
        gridUtils.clearAllFilters();
        gridUtils.clearAllSorts();
    }
}
gridUtils.clearAllSorts = function () {
    $(".k-grid").data("kendoGrid").dataSource.sort({});
}
gridUtils.clearAllFilters = function () {
    $("form.k-filter-menu button[type='reset']").trigger("click");
}
gridUtils.clearAllFiltersToolbar = function () {
    return '<a role="button" class="k-button k-button-icontext" href="\\#" onClick="gridUtils.clearAllFilters()"><span class="k-icon intelicon-cancel-filter-solid"></span>CLEAR FILTERS</a>';
}
gridUtils.inLineClearAllFiltersToolbar = function () {
    var rtn = '';
    rtn += '<a role="button" class="k-button k-button-icontext k-grid-add" href="\\#" onClick="gridUtils.clearAllFiltersAndSorts()"><span class="k-icon k-i-plus"></span>Add new record</a> ';
    rtn += '<a role="button" class="k-button k-button-icontext" href="\\#" onClick="gridUtils.clearAllFilters()"><span class="k-icon intelicon-cancel-filter-solid"></span>CLEAR FILTERS</a>';
    return rtn;
}

gridUtils.boolViewer = function (field) {
    return "<toggle size='btn-sm' ng-model='dataItem." + field + "' ng-disabled='true'></toggle>";
}
gridUtils.boolEditor = function (container, options) {
    $("<toggle size='btn-sm' field='" + options.field + "' ng-model='dataItem." + options.field + "' ></toggle>").appendTo(container);
}
gridUtils.lookupEditor = function (container, options) {
    var field = $(container).closest("[data-role=grid]").data("kendoGrid").dataSource.options.schema.model.fields[options.field];
    var cols = $(container).closest("[data-role=grid]").data("kendoGrid").columns;
    var col = { field: options.field };

    for (var c = 0; c < cols.length; c++) {
        if (cols[c].field === options.field) col = cols[c];
    }

    if (col.uiType === "ComboBox") {
        //debugger;
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoComboBox({
                autoBind: false,
                valuePrimitive: true,
                dataTextField: field.opLookupText,
                dataValueField: field.opLookupValue,
                dataSource: {
                    type: "json",
                    transport: {
                        read: field.opLookupUrl
                    }
                }
            });
    } else {
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                valuePrimitive: true,
                dataTextField: field.opLookupText,
                dataValueField: field.opLookupValue,
                dataSource: {
                    type: "json",
                    transport: {
                        read: field.opLookupUrl
                    }
                }
            });
    }
}

gridUtils.getDimLabel = function (key) {
    var dim = "";
    if (key.indexOf("20____2") >= 0) dim = "SubKit";
    if (key.indexOf("20_____2") >= 0) dim = "SubKit";
    if (key.indexOf("20____1") >= 0) dim = "Kit";
    if (key.indexOf("20_____1") >= 0) dim = "Kit";
    if (key.indexOf("20___0") >= 0) dim = "Primary";
    if (key.indexOf("20___1") >= 0) dim = "Secondary 1";
    if (key.indexOf("20___2") >= 0) dim = "Secondary 2";
    if (key.indexOf("20___3") >= 0) dim = "Secondary 3";
    if (key.indexOf("20___4") >= 0) dim = "Secondary 4";
    if (key.indexOf("20___5") >= 0) dim = "Secondary 5";
    if (key.indexOf("20___6") >= 0) dim = "Secondary 6";
    if (key.indexOf("20___7") >= 0) dim = "Secondary 7";
    if (key.indexOf("20___8") >= 0) dim = "Secondary 8";
    if (key.indexOf("20___9") >= 0) dim = "Secondary 9";
    if (key.indexOf("10___1") >= 0) dim = "Tier 1";
    if (key.indexOf("10___2") >= 0) dim = "Tier 2";
    if (key.indexOf("10___3") >= 0) dim = "Tier 3";
    if (key.indexOf("10___4") >= 0) dim = "Tier 4";
    if (key.indexOf("10___5") >= 0) dim = "Tier 5";
    if (key.indexOf("10___6") >= 0) dim = "Tier 6";
    if (key.indexOf("10___7") >= 0) dim = "Tier 7";
    if (key.indexOf("10___8") >= 0) dim = "Tier 8";
    if (key.indexOf("10___9") >= 0) dim = "Tier 9";

    return dim;
}

gridUtils.tenderDim = function (dataItem, field, format) {
    var rtn = [];
    var rtnKit = [];
    var key, dim, val;
    var ar = dataItem[field];
    if (ar !== undefined && ar !== null && ar === "no access") {
        return "<div class='noaccess'>no access</div>";
    }

    function compare(a, b) {
        debugger;
        if (a.last_nom < b.last_nom)
            return -1;
        if (a.last_nom > b.last_nom)
            return 1;
        return 0;
    }

    //if (ar !== undefined && ar !== null) {
    //    debugger;
    //    ar = ar.sort(compare);
    //}

    if (dataItem.OBJ_SET_TYPE_CD.toUpperCase() === "ECAP" || dataItem.OBJ_SET_TYPE_CD.toUpperCase() === "KIT") {
        for (key in ar) {
            if (ar.hasOwnProperty(key) && key.indexOf("20___") >= 0) {
                dim = gridUtils.getDimLabel(key);

                val = ar[key];
                if (format !== undefined) {
                    if (format === "c" && !isNaN(val)) {
                        val = kendo.toString(parseFloat(val), format);
                    } else {
                        val = kendo.toString(val, format);
                    }
                }

                rtn.push(val);
                rtnKit.push("<div class='fl dimTitle'>" + dim + ":</div> <div class='fl dimValue'>" + val + "</div> ");
            }
        }

        rtnKit.sort();
        return (rtn.length <= 1) ? rtn.join("<div class='clearboth'></div>") : rtnKit.join("<div class='clearboth'></div>");
    } else {
        for (key in ar) {
            if (ar.hasOwnProperty(key) && key.indexOf("20___") >= 0) {
                val = ar[key];
                if (format !== undefined) {
                    if (format === "c" && !isNaN(val)) {
                        val = kendo.toString(parseFloat(val), format);
                    } else {
                        val = kendo.toString(val, format);
                    }
                }

                rtn.push(val);
            }
        }

        return rtn.join(", ");
    }

}

gridUtils.tierDim = function (dataItem, field, format) {
    var rtn = [];
    var rtnKit = [];
    var key, dim, val;
    var ar = dataItem[field];

    for (key in ar) {
        if (ar.hasOwnProperty(key) && key.indexOf("10___") >= 0) {
            dim = gridUtils.getDimLabel(key);

            val = ar[key];
            if (format !== undefined) {
                if (format === "c" && !isNaN(val)) {
                    val = kendo.toString(parseFloat(val), format);
                } else {
                    val = kendo.toString(val, format);
                }
            }

            rtn.push(val);
            rtnKit.push("<div class='fl dimTitle'>" + dim + ":</div> <div class='fl dimValue'>" + val + "</div> ");
        }
    }

    return (rtn.length <= 1) ? rtn.join("<div class='clearboth'></div>") : rtnKit.join("<div class='clearboth'></div>");

}

gridUtils.msgIcon = function (dataItem) {
    if (dataItem.MsgType === 1) {
        return "<i class='intelicon-information-solid' style='font-size: 16px; color: #C4D600;'></i>";
    }
    if (dataItem.MsgType === 2) {
        return "<i class='intelicon-alert-solid' style='font-size: 16px; color: #FC4C02;'></i>";
    }
    return dataItem.MsgType;
}

gridUtils.customersFormatting = function (passedData, field) {
    var val = passedData[field];
    // Pad en empty user with something to click from manage employee screen
    if (val === "[Please Add Customers]")
    {
        return "<span class='ng-binding' style='padding: 0 4px; color: #0071C5; cursor: pointer;' ng-click='openEmployeeCustomers(dataItem)' ng-bind='dataItem.USR_CUST'></span>";
    }
    // Don't allow edits on GEO or GLOBAL provisioned customers, they are role based
    else if (val === "All Customers") {
        return "All Customers";
    }
    // All other people, just make their customers list clickable
    return "<span class='ng-binding' style='padding: 0 4px; color: #0071C5; cursor: pointer;' ng-click='openEmployeeCustomers(dataItem)' ng-bind='dataItem.USR_CUST'></span>";
}

gridUtils.dialogShow = function () {
    dialog.open();
}

gridUtils.dsToExcel = function (grid, ds, title, onlyVisible) {
    var rows = [{ cells: [] }];
    var gridColumns = grid.columns;
    var colWidths = [];
    var colHidden = false;
    if (onlyVisible === undefined || onlyVisible === null) onlyVisible = false;

    // Create element to generate templates in.
    var elem = document.createElement('div');

    for (var i = 0; i < gridColumns.length; i++) {
        colHidden = onlyVisible && gridColumns[i].hidden !== undefined && gridColumns[i].hidden === true;
        if (!colHidden && (gridColumns[i].bypassExport === undefined || gridColumns[i].bypassExport === false)) {
            var colTitle = gridColumns[i].excelHeaderLabel !== undefined && gridColumns[i].excelHeaderLabel !== ""
                ? gridColumns[i].excelHeaderLabel
                : gridColumns[i].title;

            rows[0].cells.push({
                value: colTitle,
                textAlign: "center",
                background: "#0071C5",
                color: "#ffffff",
                wrap: true
            });

            if (gridColumns[i].width !== undefined) {
                colWidths.push({ width: gridColumns[i].width });
            } else {
                colWidths.push({ autoWidth: true });
            }
        }
    }

    var data = ds.data();
    for (var i = 0; i < data.length; i++) {
        //push single row for every record

        var dataItem = data[i];
        if (dataItem !== undefined && dataItem !== null) {
            var cells = [];
            for (var c = 0; c < gridColumns.length; c++) {
                colHidden = onlyVisible && gridColumns[c].hidden !== undefined && gridColumns[c].hidden === true;
                if (!colHidden && (gridColumns[c].bypassExport === undefined || gridColumns[c].bypassExport === false)) {
                    // get default value
                    var val = dataItem[gridColumns[c].field];

                    // now look for templates
                    if (gridColumns[c].template || gridColumns[c].excelTemplate) {
                        var templateHtml = gridColumns[c].excelTemplate !== undefined
                            ? gridColumns[c].excelTemplate
                            : gridColumns[c].template;

                        if (templateHtml.indexOf("gridUtils.uiControlWrapper") >= 0) {
                            templateHtml = "#=" + gridColumns[c].field + "#";
                        }

                        var columnTemplate = kendo.template(templateHtml);

                        // Generate the template content for the current cell.
                        var newHtmlVal = columnTemplate(dataItem);
                        newHtmlVal = newHtmlVal.replace(/<div class='clearboth'><\/div>/g, 'LINEBREAKTOKEN');
                        elem.innerHTML = newHtmlVal;

                        // Output the text content of the templated cell into the exported cell.
                        val = (elem.textContent || elem.innerText || "").replace(/null/g, '').replace(/undefined/g, '')
                            .replace(/LINEBREAKTOKEN/g, '\n');
                    }

                    cells.push({
                        value: val,
                        wrap: true
                    });

                }
            }


            rows.push({
                cells: cells
            });
        }


    }
    var workbook = new kendo.ooxml.Workbook({
        sheets: [
          {
              columns: colWidths,
              title: title,
              frozenRows: 1,
              rows: rows
          }
        ]
    });

    //save the file as Excel file with extension xlsx
    kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "MyDealsSearchResults.xlsx" });

}

gridUtils.stgOneChar = function (dataItem) {
    if (dataItem.WF_STG_CD === "Draft") {
        return dataItem.PS_WF_STG_CD === undefined ? "&nbsp;" : dataItem.PS_WF_STG_CD[0];
    }
    else {
        return dataItem.WF_STG_CD === undefined ? "&nbsp;" : dataItem.WF_STG_CD[0];
    }
}

gridUtils.getBidActionsLabel = function (data) {
    var bidActns = gridUtils.getBidActionsList(data);
    if (bidActns.length === 0) return "Not Actionable";
    return data.BID_STATUS;
}

gridUtils.getBidActionsList = function (data) {
    var bidActns = [];
    if (data.BID_ACTNS !== undefined) {
        for (var i = 0; i < data.BID_ACTNS.length; i++) {
            bidActns.push({
                "BidActnName": data.BID_ACTNS[i],
                "BidActnValue": data.BID_ACTNS[i]
            });
        }
    }
    return bidActns;
}

gridUtils.getBidActions = function (data) {
    if (data.BID_ACTNS === undefined) return "";

    var bidActns = gridUtils.getBidActionsList(data);
    data["orig_BID_STATUS"] = data.BID_STATUS;
    data.BID_ACTNS = bidActns;

    if (bidActns.length === 0) return "<div style='text-align: center; width: 100%; line-height: 1.1em;'>{{dataItem.BID_STATUS}}<div style='color: #aaaaaa;' title='This deal is currently being negotiated and is not Active yet.  Once the deal gets approved, it will be availble to action.'>(<i>Not Actionable</i>)</div></div>";
    if (bidActns.length === 1) return "<div style='text-align: center; width: 100%;'>{{dataItem.BID_STATUS}}</div>";

    return '<select kendo-drop-down-list ng-model="(dataItem.BID_STATUS)" ' +
        'k-data-text-field="\'BidActnName\'" ' +
        'k-data-value-field="\'BidActnValue\'" ' +
        'k-data-source="dataItem.BID_ACTNS" ' +
        'k-change="changeBidAction" ' +
        'style="width: 100%;"></select>';
}

gridUtils.showBidStatusWip = function (data) {
    //if (data.WF_STG_CD === "Draft") return data.REBATE_TYPE === "TENDER" ? "<i>Not Actionable</i>" : "";
    // new requirement... show blank for tender also
    if (data.WF_STG_CD === "Draft") return "";
    return "<a href='/advancedSearch#/tenderSearch?id=" + data.DC_ID + "'>" + data.BID_STATUS + "</a>";
}

gridUtils.stgFullTitleChar = function (dataItem) {
    return dataItem.WF_STG_CD === "Draft" ? dataItem.PS_WF_STG_CD : dataItem.WF_STG_CD;
}

gridUtils.closeDetails = function () {
    $("#perfDetails").html("");
}

gridUtils.showDetails = function (data) {
    var rtn = "<div style='border: 1px solid #666666; padding: 6px;'>";
    rtn += "<div class='fr'><i class='intelicon-close-solid closePerf' onClick='gridUtils.closeDetails()'></i></div>";
    rtn += "<div style='font-size: 16px; margin-left: 10px; font-weight: 200;'>Performance Times</div>";
    rtn += "<table><tr><th></th><th></th><th>Task / Action performed</th><th>Time in sec</th></tr>";

    for (var d = 0; d < data.data.length; d++) {
        rtn += "<tr>";
        rtn += "<td><i class='intelicon-information-solid' style='font-size: 14px; color: " + data.data[d].color + ";'></i></td>";
        rtn += "<td>" + data.data[d].name + "</td>";
        rtn += "<td>" + data.data[d].title + "</td>";
        rtn += "<td style='text-align: right;'>" + (data.data[d].data[0]/1000).toFixed(4) + "s</td>";
        rtn += "</tr>";
    }

    rtn += "</table></div>";

    $("#perfDetails").html(rtn);
}




function gridTools(model, cols) {
    this.model = model;
    this.cols = cols;
}

gridTools.prototype.fields = {};
gridTools.prototype.model = {};
gridTools.prototype.lookupDict = {};
gridTools.prototype.cols = [];
gridTools.prototype.nextId = -101;

gridTools.prototype.init = function () {
    this.cols = this.assignColSettings(this.cols);
}

gridTools.prototype.loadDropDownAndAction = function (aLookups) {
    for (var l = 0; l < aLookups.length; l++) {
        this.getLookupData(aLookups[l], function (data, lookupType) { this.setValAndDefault(lookupType, data); });
    }
}

gridTools.prototype.saveCell = function (e) {
    if (e.model._behaviors === undefined) e.model._behaviors = {};
    if (e.model._behaviors.isDirty === undefined) e.model._behaviors.isDirty = {};
    e.model._behaviors.isDirty[util.getFirstKey(e.values)] = true;
    e.model._dirty = true;

    // now if we are in the details... set the parent dirty
    var parentRow = e.container.closest(".k-detail-row").prev();
    var parentGrid = parentRow.closest("[data-role=grid").data("kendoGrid");
    if (!util.isNull(parentGrid)) {
        var parentModel = parentGrid.dataItem(parentRow);
        parentModel._dirty = true;
    }

    // Lastly... execute change value function
    gridUtils.onDataValueChange(e);
}

gridTools.prototype.formatValue = function (dataValue, dataFormat) {
    if (dataFormat !== undefined && dataFormat !== "") {
        kendo.culture("en-US");
        dataValue = kendo.toString(dataValue, dataFormat);
    }
    return dataValue;
}

gridTools.prototype.getLookupData = function (lookupType) {
    if (this.model.fields[lookupType] === undefined) {
        alert("Lookup values were not defined for " + lookupType);
        return null;
    }
    var valuesText = this.model.fields[lookupType].valuesText;
    var valuesValue = this.model.fields[lookupType].valuesValue;
    var gTools = this;

    op.ajaxGetWait(this.model.fields[lookupType].values,
        function (data) {
            var items = [];
            items.push({ text: " ", value: "" });
            for (var i = 0; i < data.length; i++) {
                items.push({ text: data[i][valuesText], value: data[i][valuesValue] });
            }

            for (var g = 0; g < data.length; g++) {
                var lType = data[g]["ATRB_COL_NM"];
                if (this.lookupDict[lType] === undefined) {
                    this.lookupDict[lType] = [];
                    this.lookupDict[lType].push({ text: " ", value: "" });
                }
                this.lookupDict[lType].push({ text: data[g][valuesText], value: data[g][valuesValue] });

                if (this.model.fields[type] !== undefined && data[g][valuesValue] === this.model.fields[type].defValue) {
                    this.fields[type] = data[g];
                }
            }

            /////function(data) { gTools.setValAndDefault("OPTION", data, true); }
            //gTools.setValAndDefault(lookupType, data, true);
            //callback(gTools.getDistinctArray(items, "value"), lookupType);
        },
        function (result) {
            return false;
        });

    return true;
}

gridTools.prototype.getDistinctArray = function (array, distinctBy) {
    var dupes = {};
    var singles = [];

    $.each(array, function (j, el) {
        if (!dupes[el[distinctBy]]) {
            dupes[el[distinctBy]] = true;
            singles.push(el);
        }
    });
    return singles;
}

gridTools.prototype.setValAndDefault = function (type, data, stripBlanks) {
    if (stripBlanks !== undefined && stripBlanks !== null && stripBlanks) data = this.stripBlanks(data);

    this.lookupDict[type] = data;
    for (var g = 0; g < data.length; g++) {
        if (this.model.fields[type] !== undefined && data[g].text === this.model.fields[type].defValue) {
            this.fields[type] = data[g];
        }
    }
}

gridTools.prototype.getIndexById = function (id, source) {
    var l = source.length;

    for (var j = 0; j < l; j++) {
        if (source[j].ID === id) {
            return j;
        }
    }
    return null;
}

gridTools.prototype.getIndexByDcId = function (id, source) {
    var l = source.length;

    for (var j = 0; j < l; j++) {
        if (source[j].DC_ID === id) {
            return j;
        }
    }
    return null;
}

gridTools.prototype.getLastIndexByDcId = function (id, source) {
    var l = source.length;

    for (var j = l - 1; j >= 0; j--) {
        if (source[j].DC_ID === id) {
            return j;
        }
    }
    return null;
}

gridTools.prototype.stripBlanks = function (data) {
    return data.filter(function (el) {
        return el.value !== "";
    });
}

gridTools.prototype.assignColSettings = function () {
    var cols = this.cols;
    for (var c = 0; c < cols.length; c++) {
        if (cols[c].editor !== undefined && cols[c].editor === "gridUtils.lookupEditor") {
            cols[c].editor = gridUtils.lookupEditor;
        }
        //if (colModel.values !== undefined && colModel.values !== null && colModel.values !== "" && this.lookupDict[col.field] !== undefined) {
        //    col.values = this.lookupDict[col.field];
        //}
    }
    return cols;
}

gridTools.prototype.dropdownsLoaded = function () {
    this.init();
}

gridTools.prototype.createDataSource = function (parentSource, pageSize) {
    var gTools = this;
    var pSize = (pageSize === undefined) ? 1000 : pageSize;

    return new kendo.data.DataSource({
        transport: {
            read: function (e) {
                var source = parentSource;
                // on success

                e.success(source);
                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            create: function (e) {
                var source = parentSource;
                for (var i = 0; i < e.data.models.length; i++) {
                    var item = e.data.models[i];
                    item._dirty = true;
                    if (!!item["PRD_BCKT"]) {
                        // User can insert row in between for KIT deals
                        var indx = gTools.getLastIndexByDcId(item.DC_ID, source);
                        indx = indx == null ? source.length : indx + 1;
                        source.splice(indx, 0, item);
                    } else {
                        // assign an ID to the new item
                        //item.DC_ID = gTools.nextId--;
                        // save data item to the original datasource
                        source.push(item);
                    }
                }
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "E501", "INT value must by greater than 0");
            },
            update: function (e) {
                var source = parentSource;

                // locate item in original datasource and update it
                for (var i = 0; i < e.data.models.length; i++) {
                    var item = e.data.models[i];
                    if (!!item.DC_ID) {
                        if (!!item["TIER_NBR"]) {
                            item._dirty = true;
                            var indx = item["TIER_NBR"] - 1;

                            for (var j = 0; j < source.length; j++) {
                                if (source[j].DC_ID === item.DC_ID && indx === (source[j]["TIER_NBR"] - 1)) {
                                    source[j] = item;
                                }
                            }
                        } else {
                            item._dirty = true;
                            source[gTools.getIndexByDcId(item.DC_ID, source)] = item;
                        }
                    }
                }
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            destroy: function (e) {
                var source = parentSource;

                // locate item in original datasource and remove it
                for (var i = 0; i < e.data.models.length; i++) {
                    var item = e.data.models[i];
                    item._dirty = true;
                    // Remove the last matching row from the source data
                    if (!!item["PRD_BCKT"]) {
                        source.splice(gTools.getLastIndexByDcId(item.DC_ID, source), 1);
                    } else {
                        source.splice(gTools.getIndexByDcId(item.DC_ID, source), 1);
                    }
                }
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "status code", "error message");
            }
        },
        error: function (e) {
            // handle data operation error
            alert("Status: " + e.status + "; Error message: " + e.errorThrown);
        },
        batch: true,
        schema: {
            model: gTools.model
        },
        pageSize: pSize
    });
};

Array.prototype.indexOfField = function (propertyName, value) {
    for (var i = 0; i < this.length; i++)
        if (this[i][propertyName] === value)
            return i;
    return -1;
}



function gridPctUtils() { }

gridPctUtils.columns = {};
gridPctUtils.resultMappings = {
    "Fail": 0,
    "InComplete": 1,
    "Pass": 2,
    "NA": 3
};
gridPctUtils.getColumnTemplate = function (dealId) {
    return gridPctUtils.columns[dealId];
}
gridPctUtils.getResultMappingIconClass = function (result) {
    if (result === "NA") {
        return "intelicon-information-solid";
    } else if (result === "Pass") {
        return "intelicon-passed-completed-solid";
    } else if (result === "InComplete") {
        return "intelicon-help-solid";
    } else if (result === "Fail") {
        return "intelicon-alert-solid";
    } else {
        return "intelicon-help-outlined";
    }
}
gridPctUtils.getResultSingleIcon = function (result, style) {
    var iconNm = gridPctUtils.getResultMappingIconClass(result);
    var iconTitle = iconNm === "intelicon-help-outlined" ? "Not Run Yet" : result;
    return '<i class="' + iconNm + '" style="' + style + '" ng-style="getColorStyle(\'' + result + '\')" title="' + iconTitle + '"></i>';
}
gridPctUtils.getResultMapping = function (result, flg, overrideFlg, className, style, incompleteReason) {
    var rtn = "<div style='text-align: center;'>";

    if (overrideFlg !== "") rtn += '<i ng-if="' + overrideFlg + '" class="intelicon-passed-completed-solid ' + className + '" style="' + style + '" style="color: #0071C5;" title="Passed with Override Status"></i>';

    var iconNm = gridPctUtils.getResultMappingIconClass(result);
    var iconTitle = iconNm === "intelicon-help-outlined" ? "Not Run Yet" : result;

    // If reason is incomplete display incomplete reason
    if (result === "InComplete") {
        iconTitle = "Incomplete: " + incompleteReason;
    }

    rtn += '<i ng-if="' + flg + '" class="' + iconNm + '" style="' + style + '" ng-style="getColorStyle(\'' + result + '\')" title="' + iconTitle + '"></i>';
    rtn += "</div>";
    return rtn;
}
gridPctUtils.getPctFlag = function (flg, results, forceReadOnly, hasNoPermission) {
    var rtn = '<div style="text-align: center;">';
    rtn += '<span ng-if="' + results + ' === \'Pass\' || ' + results + ' === \'NA\' || ' + forceReadOnly + ' === true || ' + hasNoPermission + ' === true" ng-bind="onOff(' + flg + ')" style="vertical-align: -webkit-baseline-middle;"></span>';
    rtn += '<span ng-if="' + results + ' !== \'Pass\' && ' + results + ' !== \'NA\' && ' + forceReadOnly + ' !== true && ' + hasNoPermission + ' !== true">';
    rtn += '<toggle size="btn-sm" ng-change="changeReasonFlg(dataItem)" off="No" on="Yes" ng-model="' + flg + '"></toggle>';
    rtn += '</span>';
    rtn += '<div class="boxSave" ng-class="{\'showReason\': dataItem.saved, \'hideReason\': !dataItem.saved}">SAVED</div>';
    rtn += '</div';
    return rtn;
}






function perfCacheMark(title) {
    this.title = title;
    this.type = "mark";
    this.start = moment();
}

perfCacheMark.prototype.timeFormat = "MM/DD/YYYY HH:mm:ss:SSS";
perfCacheMark.prototype.title = "";
perfCacheMark.prototype.type = "";
perfCacheMark.prototype.start = "";




function perfCacheBlock(title, category) {
    this.title = title;
    this.category = category;
    this.type = "block";
    this.start = moment();
    this.marks = [];
    this.end = null;
    this.executionMs = 0;
}

perfCacheBlock.prototype.timeFormat = "MM/DD/YYYY HH:mm:ss:SSS";
perfCacheBlock.prototype.title = "";
perfCacheBlock.prototype.category = "";
perfCacheBlock.prototype.type = "";
perfCacheBlock.prototype.start = "";
perfCacheBlock.prototype.end = "";
perfCacheBlock.prototype.lapse = 0;
perfCacheBlock.prototype.executionMs = 0;
perfCacheBlock.prototype.marks = [];

perfCacheBlock.prototype.stop = function () {
    this.end = moment();
    this.executionMs = this.end.diff(this.start);
    return this;
};

perfCacheBlock.prototype.mark = function (title) {
    this.add(new perfCacheMark(title));
};

perfCacheBlock.prototype.block = function (data) {
};

perfCacheBlock.prototype.add = function (data) {
    data.lapse = moment().diff(this.start);
    if (data.type === "block") data.lapse -= data.executionMs;
    this.marks.push(data);
};

perfCacheBlock.prototype.getChartColor = function (key) {
    if (key === "UI") return "#FFA300";
    if (key === "MT") return "#00AEEF";
    if (key === "DB") return "#C4D600";
    if (key === "Network") return "#FC4C02";
    return "#dddddd";
};

perfCacheBlock.prototype.getChartData = function () {
    if (this.marks.length > 0) {
        var rtn = [];

        // get all blocks
        for (var m = 0; m < this.marks.length; m++) {
            if (this.marks[m].type === "block") {
                var data = this.marks[m].getChartData();
                for (var d = 0; d < data.length; d++) {
                    rtn.push(data[d]);
                }
            }
        }

        // get gap time
        var totTime = 0;
        for (var r = 0; r < rtn.length; r++) {
            totTime += rtn[r].data[0];
        }
        if (this.executionMs > totTime) {
            rtn.push({
                name: "Unknown" ,
                title: this.title,
                data: [this.executionMs - totTime],
                color: "#dddddd"
            });
        }

        return rtn;
    } else {
        return [
            {
                name: this.category,
                title: this.title,
                data: [this.executionMs],
                color: this.getChartColor(this.category)
            }
        ];
    }
}

perfCacheBlock.prototype.drawChart = function (chartId, titleId, legendId) {
    if (!window.isDeveloper && !window.isTester) return;

    var data = {
        executionMs: this.executionMs,
        data: this.getChartData()
    };

    perfCacheBlock.data = data;

    var totTimes = {};
    var uid = util.generateUUID();

    var logData = [];
    for (var d = 0; d < data.data.length; d++) {
        var item = data.data[d];
        if (totTimes[item.name] === undefined) totTimes[item.name] = 0;
        totTimes[item.name] += item.data[0];
        logData.push({
            uid: uid,
            title: this.title,
            executionMs: this.executionMs,
            start: this.start,
            end: this.end,
            mode: item.name,
            task: item.title,
            taskMs: item.data[0]
        });
    }

    op.ajaxPostAsync("/api/Logging/PerformanceTimes", logData, function () { }, function () { });

    var legend = "";
    var block = this;
    Object.keys(totTimes).forEach(function (key, index) {
        legend += "<div class='fl legKey' style='background-color: " + block.getChartColor(key) + ";'></div>";
        legend += "<div class='fl legData'>" + key + ": " + (this[key] / 1000).toFixed(4) + "s</div>";
    }, totTimes);

    $("#" + legendId).html(legend + "<div class='clearboth'></div>");
    $("#" + titleId).html("Total Execution Time: <b>" + (data.executionMs / 1000) + "sec</b> <i class='intelicon-show-results-outlined showMore' onClick='gridUtils.showDetails(perfCacheBlock.data)'></i>");
    $("#" + chartId).kendoChart({
        legend: {
            visible: false
        },
        chartArea: {
            width: 400
        },
        seriesDefaults: {
            type: "bar",
            stack: {
                type: "100%"
            }
        },
        series: data.data,
        valueAxis: {
            line: { visible: false },
            labels: { visible: false },
            minorGridLines: { visible: false },
            majorGridLines: { visible: false }
        },
        categoryAxis: {
            line: { visible: false },
            minorGridLines: { visible: false },
            majorGridLines: { visible: false }
        },
        tooltip: {
            visible: true,
            template: "#= series.name #: #= (value / 1000).toFixed(4) #s<br/><span style='color: \\#cccccc !important; font-size: 10px !important;'>#=series.title#</span>"
        }
    });
};

perfCacheBlock.prototype.addPerfTimes = function (performanceTimes) {
    var lapse = 0;
    for (var p = 0; p < performanceTimes.length; p++) {
        var item = performanceTimes[p];
        var media = "UI";
        if (item.Media === 2) media = "MT";
        if (item.Media === 3) media = "DB";
        var perf = new perfCacheBlock(item.Title, media);
        perf.type = "block";
        perf.lapse = lapse;
        perf.executionMs = item.ExecutionTime;
        this.marks.push(perf);
        lapse += item.ExecutionTime;
    }
}


