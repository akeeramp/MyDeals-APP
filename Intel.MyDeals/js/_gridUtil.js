// Independant static style functions
function gridUtils() { }
gridUtils.formatValue = function (dataValue, dataFormat) {
    if (dataFormat !== undefined && dataFormat !== "") {
        kendo.culture("en-US");
        dataValue = kendo.toString(dataValue, dataFormat);
    }
    return dataValue;
}


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
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
//    tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
//    tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')"></div>';
    tmplt += '</div>';
    return tmplt;
}

gridUtils.uiStartDateWrapper = function (passedData, field, format) {

    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center"><span ng-if="displayFrontEndDateMessage(dataItem)"> <i class="intelicon-information style="font- size: 12px; color: #00AEEF;" title="If the deal start date is in the past, the deal start date will change to the date when the deal becomes active."></i> </span>';
    tmplt += '    <span class="ng-binding" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')"></span></div>';
    tmplt += '</div>';
    return tmplt;
}
gridUtils.uiDimControlWrapper = function (passedData, field, dim, format) {
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
    //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + '[\'' + dim + '\'] ' + gridUtils.getFormat(field, format) + ')"></div>';
    tmplt += '</div>';

    return tmplt;
}
gridUtils.uiCustomerControlWrapper = function(passedData, field, altField) {
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
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    //tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.' + field + ', isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ',';
    //tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.' + field + ', isErrorCell: dataItem._behaviors.isError.' + field + ', isSavedCell: dataItem._behaviors.isSaved.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
    tmplt += '    <div class="ng-binding vert-center" ng-bind="(dataItem.' + field + ' ' + gridUtils.getFormat(field, format) + ')" ng-class="{\'redfont\': dataItem.EXPIRE_FLG}"></div>';
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
        if (startVal !== "" && kendo.toString(new Date(startVal), 'MM/dd/yy') !== '01/01/01') {
            tmplt += '<div>Availability:<span class="ng-binding" ng-bind="(dataItem.' + startDt + dimKeyWrapper + ' | date:\'MM/dd/yy\')"></span><span></div>';
        }
        tmplt += '</div>';

    } else if (field === "YCS2_PRC_IRBT" && fieldVal === "No YCS2") {
        tmplt += '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;">';
        tmplt += '<div style="line-height: 1em; font-family: arial; text-align: center;font-weight:600">No YCS2</div>';
        if (startVal !== "" && kendo.toString(new Date(startVal), 'MM/dd/yy') !== '01/01/01') {
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
                msg = "title = 'ECAP ($" + ecap.toFixed(2) + ") is greater than the CAP ($" + cap.toFixed(2) + ")'";
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
        tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
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
gridUtils.uiMultiselectArrayControlWrapper = function (passedData, field) {
    var displayStr = (Array.isArray(passedData[field]) || Object.prototype.toString.call(passedData[field]) === "[object Object]")
        ? passedData[field].join()
        : passedData[field];

    //TODO: various copy pasted validation flags, need to confirm if they work or actually do anything
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.' + field + '" kendo-tooltip k-content="dataItem._behaviors.validMsg.' + field + '"></div>';
    tmplt += '<div class="uiControlDiv" style="line-height: 1em; font-family: arial; text-align: center;"';
    tmplt += '     ng-class="{isReadOnlyCell: dataItem._behaviors.isReadOnly.' + field + ', isDirtyCell: dataItem._behaviors.isDirty.' + field + '}">';
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

gridUtils.renderCustNm = function (data) {
    var custs = [];
    if (!!data.CustomerDivisions) {
        for (var i = 0; i < data.CustomerDivisions.length; i++) {
            custs.push(data.CustomerDivisions[i].CUST_NM);
        }
    }
    return custs.join(',');
}
gridUtils.renderMasterChild = function(data) {
    if (data.dc_type === 'PRC_TBL_ROW' || data.dc_type === 'MASTER') return '<b>Master</b>';
    if (data.dc_type === 'WIP_DEAL') return 'Child';
    return '';
}

gridUtils.onDataValueChange = function (e) {
    return null;
}

gridUtils.cancelChanges = function (e) {
    $(e.sender.table).closest(".k-grid").data('kendoGrid').dataSource.cancelChanges();
}

gridUtils.clearAllFiltersAndSorts = function () {
    gridUtils.clearAllFilters();
    gridUtils.clearAllSorts();
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

gridUtils.msgIcon = function (dataItem) {
    if (dataItem.MsgType === 1) {
        return "<i class='intelicon-information-solid' style='font-size: 16px; color: #C4D600;'></i>";
    }
    if (dataItem.MsgType === 2) {
        return "<i class='intelicon-alert-solid' style='font-size: 16px; color: #FC4C02;'></i>";
    }
    return dataItem.MsgType;
}

gridUtils.dialogShow = function () {
    dialog.open();
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

                    // assign an ID to the new item
                    //item.DC_ID = gTools.nextId--;
                    // save data item to the original datasource
                    source.push(item);
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
                            var indx = item["TIER_NBR"] - 1;

                            for (var j = 0; j < source.length; j++) {
                                if (source[j].DC_ID === item.DC_ID && indx === (source[j]["TIER_NBR"] - 1)) {
                                    source[j] = item;
                                }
                            }
                        } else {
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
                    source.splice(gTools.getIndexByDcId(item.DC_ID, source), 1);
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
gridPctUtils.getResultMapping = function (result, flg, overrideFlg, className, style) {
    var rtn = "<div style='text-align: center;'>";

    if (overrideFlg !== "") rtn += '<i ng-if="' + overrideFlg + '" class="intelicon-passed-completed-solid ' + className + '" style="' + style + '" style="color: #0071C5;" title="Passed with Override Status"></i>';

    var iconNm = gridPctUtils.getResultMappingIconClass(result);
    var iconTitle = iconNm === "intelicon-help-outlined" ? "Not Run Yet" : result;

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

