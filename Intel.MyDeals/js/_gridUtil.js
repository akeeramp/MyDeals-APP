
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
    var tmplt = '<div class="err-bit" ng-show="dataItem._behaviors.isError.#=field#" kendo-tooltip k-content="dataItem._behaviors.validMsg.#=field#"></div>';
    tmplt += '<div class="uiControlDiv"';
    tmplt += '     ng-class="{isHiddenCell: dataItem._behaviors.isHidden.#=field#, isReadOnlyCell: dataItem._behaviors.isReadOnly.#=field#,';
    tmplt += '     isRequiredCell: dataItem._behaviors.isRequired.#=field#, isErrorCell: dataItem._behaviors.isError.#=field#, isSavedCell: dataItem._behaviors.isSaved.#=field#, isDirtyCell: dataItem._behaviors.isDirty.#=field#}">';
    tmplt += '    <span class="ng-binding" ng-bind="(dataItem.#=field# #=gridUtils.getFormat(field, format)#)"></span>';
    tmplt += '</div>';

    return kendo.template(tmplt)({
        "innerData": passedData,
        "field": field,
        "format": format
    });
}
gridUtils.uiIconWrapper = function (passedData, field, format) {
    var tmplt = '<div class="isDirtyIconGridContainer">';
    tmplt += '<i class="intelicon-upload-solid" ng-class="{isDirtyIcon: dataItem.#=field#}"></i>';
    tmplt += '</div>';

    return kendo.template(tmplt)({
        "innerData": passedData,
        "field": field,
        "format": format
    });
}
gridUtils.getFormat = function (lType, lFormat) {
    return lFormat === undefined ? "" : "| " + lFormat;
}

gridUtils.onDataValueChange = function (e) {
    return null;
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
                dataTextField: field.valuesText,
                dataValueField: field.valuesValue,
                dataSource: {
                    type: "json",
                    transport: {
                        read: field.values
                    }
                }
            });
    } else {
        $('<input required name="' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                valuePrimitive: true,
                dataTextField: field.valuesText,
                dataValueField: field.valuesValue,
                dataSource: {
                    type: "json",
                    transport: {
                        read: field.values
                    }
                }
            });
    }
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
    if (e.model.fields._behaviors === undefined) e.model.fields._behaviors = {};
    if (e.model.fields._behaviors.isDirty === undefined) e.model.fields._behaviors.isDirty = {};
    e.model.fields._behaviors.isDirty[util.getFirstKey(e.values)] = true;
    e.model.fields._dirty = true;

    // now if we are in the details... set the parent dirty
    var parentRow = e.container.closest(".k-detail-row").prev();
    var parentGrid = parentRow.closest("[data-role=grid").data("kendoGrid");
    if (!util.isNull(parentGrid)) {
        var parentModel = parentGrid.dataItem(parentRow);
        parentModel.fields._dirty = true;
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
    debugger;
    if (this.model.fields[lookupType] === undefined) {
        alert("Lookup values were not defined for " + lookupType);
        return null;
    }
    var valuesText = this.model.fields[lookupType].valuesText;
    var valuesValue = this.model.fields[lookupType].valuesValue;
    var gTools = this;

    op.ajaxGetWait(this.model.fields[lookupType].values,
        function (data) {
            //debugger;
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
                    item.ID = gTools.nextId--;
                    // save data item to the original datasource
                    source.push(item);

                    // on success
                    e.success(item);
                    // on failure
                    //e.error("XHR response", "E501", "INT value must by greater than 0");
                }
            },
            update: function (e) {
                var source = parentSource;

                // locate item in original datasource and update it
                for (var i = 0; i < e.data.models.length; i++) {
                    var item = e.data.models[i];
                    source[gTools.getIndexById(item.ID, source)] = item;
                }
                // on success
                e.success();
                // on failure
                //e.error("XHR response", "status code", "error message");
            },
            destroy: function (e) {
                debugger;
                var source = parentSource;

                // locate item in original datasource and remove it
                source.splice(gTools.getIndexById(e.data.ID, source), 1);
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