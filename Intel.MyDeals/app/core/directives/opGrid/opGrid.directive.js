angular
    .module('app.core')
    .directive('opGrid', opGrid);

opGrid.$inject = ['$compile', 'objsetService', '$timeout', 'colorDictionary'];

function opGrid($compile, objsetService, $timeout, colorDictionary) {
    return {
        scope: {
            opData: '=',
            opOptions: '='
        },
        restrict: 'AE',
        templateUrl: '/app/core/directives/opGrid/opGrid.directive.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            
            $timeout(function () {
                $scope.tabStripDelay = true;
                $timeout(function () {
                    $scope.configureSortableTab();
                }, 10);
            }, 10);


            $scope.stages = [];
            $scope.initDsLoaded = false;
            $scope.stageCnt = 0;
            $scope.elGrid = null;
            $scope.grid = null;
            $scope.isToolbarVisible = false;
            $scope.ds = {};
            $scope.contractDs = null;
            $scope.isGridVisible = false;
            $scope.curGroup = "";
            $scope._dirty = false;

            
            $scope.assignColSettings = function () {
                if ($scope.opOptions.columns === undefined) return [];

                var indxs = {};
                var cnt = 0;
                angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                    this[key] = cnt++;
                }, indxs);

                var cols = $scope.opOptions.columns;
                for (var c = 0; c < cols.length; c++) {

                    if (cols[c].editor !== undefined) {
                        if (cols[c].editor === "multiDimEditor") {
                            cols[c].editor = $scope.multiDimEditor;
                        }
                    } else if (cols[c].lookupUrl !== undefined && cols[c].lookupUrl !== "") {
                        cols[c].editor = $scope.lookupEditor;
                    }

                    //fix multi dim to single dim column for nested data
                    cols[c].field = cols[c].field.split("_____")[0];

                    // mark index order
                    cols[c].indx = indxs[cols[c].field] === undefined ? 0 : indxs[cols[c].field];

                    // mark everything hidden by default
                    cols[c].hidden = true;

                    if (cols[c].filterable !== undefined && cols[c].filterable) {
                        cols[c].filterable = { "multi": true, search: true };
                    }
                }
                // now sort the columns based on the group settings
                cols.sort(function(a, b) {
                    return a.indx - b.indx;
                });
                return cols;
            }

            $scope.cloneWithOrder = function (source) {
                var newArray = [];
                var grps = $scope.opOptions[source].groups;
                for (var i = 0; i < grps.length; i++) {
                    newArray.push({ "name": grps[i].name, "order": grps[i].order, "isPinned": grps[i].isPinned });
                }
                $scope.opOptions.groups = newArray;

                var newObj = {};
                var cols = $scope.opOptions[source].groupColumns;
                for (var key in cols) {
                    if (cols.hasOwnProperty(key)) {
                        newArray = [];
                        for (i = 0; i < cols[key].Groups.length; i++) {
                            newArray.push(cols[key].Groups[i]);
                        }
                        newObj[key] = {};
                        newObj[key].Groups = newArray;
                    }
                }
                $scope.opOptions.groupColumns = newObj;
                //debugger;
                //util.clone($scope.opOptions[source].groupColumns);
                //debugger;
            }

            if ($scope.opOptions.custom === undefined) {
                $scope.cloneWithOrder("default");
            }

            $scope.configureSortableTab = function() {
                $("#tabstrip ul.k-tabstrip-items").kendoSortable({
                    filter: "li.k-item",
                    axis: "x",
                    container: "ul.k-tabstrip-items",
                    hint: function (element) {
                        return $("<div id='hint' class='gradTab k-widget k-header k-tabstrip'><ul class='k-tabstrip-items k-reset'><li class='k-item k-tab-on-top'>" + element.html() + "</li></ul></div>");
                    },
                    change: function (e) {
                        var tabstrip = $("#tabstrip").data("kendoTabStrip"),
                            reference = tabstrip.tabGroup.children().eq(e.newIndex);

                        if (e.oldIndex < e.newIndex) {
                            tabstrip.insertAfter(e.item, reference);
                        } else {
                            tabstrip.insertBefore(e.item, reference);
                        }
                    }
                });
            }

            $scope.alignGroupOrder = function() {
                var tabstrip = $("#tabstrip").data("kendoTabStrip");
                var grps = $scope.opOptions.groups;
                for (var g = 0; g < grps.length; g++) {
                    if (grps[g].name === "All") {
                        grps[g].order = 99;
                    } else {
                        grps[g].order = tabstrip.tabGroup.find(':contains("' + grps[g].name + '")').index();
                        // if we can't find the tab... it is probably a new one being added and not rendered yet. 
                        if (grps[g].order === -1) grps[g].order = 50;
                    }
                }
            }

            $scope.clkAllItems = function () {
                var isChecked = document.getElementById('chkDealTools').checked;
                var data = $scope.contractDs.view();
                for (var i = 0; i < data.length; i++) {
                    data[i].isLinked = isChecked;
                }
            }

            $scope.clickPin = function (e, grpName) {
                var el = $(e.currentTarget);
                var isPinned;
                if (el.hasClass("active")) {
                    el.removeClass("active");
                    isPinned = false;
                } else {
                    el.addClass("active");
                    isPinned = true;
                }

                for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                    if ($scope.opOptions.groups[g].name === grpName) {
                        $scope.opOptions.groups[g].isPinned = isPinned;
                    }
                }
            }
            
            $scope.restoreLayout = function () {
                $scope.opOptions.groups = [];
                
                $timeout(function () {
                    $scope.cloneWithOrder("default");

                    $timeout(function () {
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                        $scope.configureSortableTab();
                        $scope.selectFirstTab();
                    }, 10);
                }, 10);
            }

            $scope.customLayout = function () {
                if ($scope.opOptions.custom === undefined) {
                    kendo.alert("You do not currently have a custom layout saved.");
                    return;
                }

                $scope.opOptions.groups = [];

                $timeout(function () {
                    $scope.cloneWithOrder("custom");

                    $timeout(function () {
                        $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                        $scope.configureSortableTab();
                        $scope.selectFirstTab();
                    }, 10);
                }, 10);
            }

            $scope.saveLayout = function () {
                $scope.alignGroupOrder();
                $scope.opOptions.custom = {};
                $scope.opOptions.custom.groups = util.clone($scope.opOptions.groups);
                $scope.opOptions.custom.groupColumns = util.clone($scope.opOptions.groupColumns);

                kendo.alert("This is where the save routine goes.");
            }

            $scope.addGrp = function () {
                kendo.prompt("Please, enter your new group name:", "").then(function (data) {
                    if (data === "") data = "New Group";
                    $scope.opOptions.groups.push({ "name": data, "order": 50 });

                    // Add Tools
                    if ($scope.opOptions.groupColumns.tools.Groups === undefined) $scope.opOptions.groupColumns.tools.Groups = [];
                    $scope.opOptions.groupColumns.tools.Groups.push(data);

                    // Add Deal Details
                    if ($scope.opOptions.groupColumns.details.Groups === undefined) $scope.opOptions.groupColumns.details.Groups = [];
                    $scope.opOptions.groupColumns.details.Groups.push(data);

                    $scope.alignGroupOrder();
                    $scope.$apply();
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                    $scope.configureSortableTab();
                },
                function () {
                    // cancel
                });
            }
            
            $scope.renameGrp = function () {
                kendo.prompt("Please, change the group name:", $scope.curGroup).then(function (data) {
                    if (data === "") return;

                    for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                        if ($scope.opOptions.groups[g].name === $scope.curGroup) {
                            $scope.opOptions.groups[g].name = data;
                        }
                    }

                    // change group name in column list
                    angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                        var index = value.Groups.indexOf($scope.curGroup);
                        if (index > -1) {
                            value.Groups[index] = data;
                        }
                    });

                    $scope.curGroup = data;
                    $scope.alignGroupOrder();
                    $scope.$apply();
                    $("#tabstrip").kendoTabStrip().data("kendoTabStrip").reload();
                    $scope.configureSortableTab();
                },
                function () {
                    // cancel
                });
            }

            $scope.removeGrp = function (e, grpName) {
                for (var i = 0; i < $scope.opOptions.groups.length; i++) {
                    if ($scope.opOptions.groups[i].name === grpName) {
                        $scope.opOptions.groups.splice(i, 1);
                        break;
                    }
                }

                angular.forEach($scope.opOptions.groupColumns, function (value, key) {
                    var index = value.Groups.indexOf(grpName);
                    if (index > -1) {
                        value.Groups.splice(index, 1);
                    }
                });

                $scope.selectFirstTab();
            }

            $scope.contractDs = new kendo.data.DataSource({
                transport: {
                    read: function (e) {
                        var childParent = {};
                        for (var i = 0; i < $scope.opData.length; i++) {
                            var item = $scope.opData[i];
                            if (item.isLinked === undefined) item.isLinked = false;
                            if (childParent[item.DC_PARENT_ID] === undefined) childParent[item.DC_PARENT_ID] = 0;
                            childParent[item.DC_PARENT_ID]++;
                        }

                        // now set total values
                        for (var j = 0; j < $scope.opData.length; j++) {
                            $scope.opData[j]["_parentCnt"] = childParent[$scope.opData[j].DC_PARENT_ID];
                        }
                        
                        var source = $scope.opData;

                        // on success
                        e.success(source);
                    },
                    create: function (e) {
                        var source = $scope.opData;
                        for (var i = 0; i < e.data.models.length; i++) {
                            var item = e.data.models[i];

                            // assign an ID to the new item
                            source.push(item);

                            // on success
                            e.success(item);
                        }
                    },
                    update: function (e) {
                        var source = $scope.opData;

                        // locate item in original datasource and update it
                        for (var i = 0; i < e.data.models.length; i++) {
                            var item = e.data.models[i];
                            source[$scope.getIndexById(item.DC_ID, source)] = item;
                        }
                        // on success
                        e.success();
                    },
                    destroy: function (e) {
                        var source = $scope.opData;

                        // locate item in original datasource and remove it
                        source.splice($scope.getIndexById(e.data.DC_ID, source), 1);

                        // on success
                        e.success();
                    }
                },
                error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
                },
                batch: true,
                schema: {
                    model: $scope.opOptions.model
                },
                pageSize: 25
            });

            $scope.ds = {
                dataSource: $scope.contractDs,
                columns: $scope.opOptions.columns,
                scrollable: true,
                sortable: true,
                editable: true,
                navigatable: true,
                filterable: true,
                resizable: true,
                reorderable: true,
                columnMenu: true,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 25, 50, "all"],
                    buttonCount: 5
                },
                save: function (e) {
                    var newField = util.getFirstKey(e.values);
                    $scope.saveCell(e.model, newField);

                    if (e.model.isLinked !== undefined && e.model.isLinked) {
                        $scope.syncLinked(newField, e.values[newField]);
                    }

                    gridUtils.onDataValueChange(e);

                },
                edit: function (e) {
                    var grid = this;
                    var fieldName = grid.columns[e.container.index()].field;
                    if (e.model._behaviors.isReadOnly[fieldName] || e.model._behaviors.isHidden[fieldName]) {
                        $scope.grid.closeCell();
                    }
                },
                dataBound: function (e, f) {
                    if ($scope.curGroup === "") {
                        $scope.selectFirstTab();
                        $scope.validateGrid();
                    }
                }
            };

            $scope.selectFirstTab = function () {
                $scope.curGroup = $scope.opOptions.groups[0].name;

                $timeout(function () {
                    // select the first column
                    var tabStrip = $("#tabstrip").kendoTabStrip().data("kendoTabStrip");
                    tabStrip.select(0);
                    if ($scope.opOptions.groups !== undefined) {
                        $scope.showCols($scope.curGroup);
                    }
                }, 10);
            }

            $scope.drawDetails = function (data) {
                return "hh";
            }

            $scope.getIndexById = function (id, source) {
                var l = source.length;

                for (var j = 0; j < l; j++) {
                    if (source[j].ID === id) {
                        return j;
                    }
                }
                return null;
            }

            $scope.lookupEditor = function (container, options) {
                var field = $(container).closest("[data-role=grid]").data("kendoGrid").dataSource.options.schema.model.fields[options.field];
                var cols = $(container).closest("[data-role=grid]").data("kendoGrid").columns;
                var col = { field: options.field };

                for (var c = 0; c < cols.length; c++) {
                    if (cols[c].field === options.field) col = cols[c];
                }

                if (col.uiType === "ComboBox") {
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
            
            $scope.multiDimEditor = function(container, options) {
                var field = $(container).closest("[data-role=grid]").data("kendoGrid").dataSource.options.schema.model.fields[options.field];
                var cols = $(container).closest("[data-role=grid]").data("kendoGrid").columns;
                var col = { field: options.field };

                for (var c = 0; c < cols.length; c++) {
                    if (cols[c].field === options.field) col = cols[c];
                }

                var el = "";
                var model = options.model[options.field];
                for (var key in model) {
                    if (model.hasOwnProperty(key) && key[0] !== '_' && key !== "parent" && key !== "uid") {
                        el += $scope.createEditEl(options.field, field.uiType, key, field.format);
                    }
                }

                $(el).appendTo(container);
            }

            $scope.createEditEl = function (field, type, dimKey, format) {
                var el = '<div class="dimKey">' + $scope.translateDimKey(dimKey) + ':</div>';
                if (type === "TextBox") {
                    el += '<input k-ng-model="dataItem.' + field + '[\'' + dimKey + '\']" style="width: 100%;" />';

                } else if (type === "ComboBox") {
                    
                } else if (type === "DropDown") {
                    
                } else if (type === "DatePicker") {
                    
                } else if (type === "Label") {
                    
                } else if (type === "CheckBox") {
                    
                } else if (type === "NumericTextBox") {
                    el += '<input kendo-numeric-text-box k-ng-model="dataItem.' + field + '[\'' + dimKey + '\']" style="width: 100%;" />';

                } else {
                    el += '<input k-ng-model="dataItem.' + field + '[\'' + dimKey + '\']" style="width: 100%;" />';
                }

                return el;
            }

            $scope.translateDimKey = function(key) {
                if (key === "10___0") return "Primary";
                if (key === "10____1") return "Kit";
                if (key === "10___1") return "Secondary 1";
                if (key === "10___2") return "Secondary 2";
                if (key === "10___3") return "Secondary 3";
                if (key === "10___4") return "Secondary 4";
                return "";
            }

            $scope.showCols = function (grpName) {
                var c;
                var colNames = [];

                $scope.curGroup = grpName;

                for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                    var item = $scope.opOptions.groups[g];
                    if (item.name === grpName || item.isPinned)
                        angular.forEach($scope.opOptions.groupColumns, function (v, k) {
                            if (v.Groups.indexOf(item.name) >= 0 && this.indexOf(item.name) < 0) this.push(k);
                        }, colNames);
                }

                var useKendo = true;

                if (useKendo) {
                    // KENDO WAY... but it is slow

                    if (grpName === "All") {
                        for (c = 0; c < $scope.grid.columns.length; c++) {
                            $scope.grid.showColumn(c);
                        }

                    } else {

                        //hide all columns
                        for (c = 0; c <= $scope.grid.columns.length; c++) {
                            if ($scope.grid.columns[c] !== undefined && $scope.grid.columns[c].field !== "")
                                $scope.grid.hideColumn(c);
                        }

                        //show columns in list
                        for (c = 0; c < colNames.length; c++) {
                            $scope.grid.showColumn(colNames[c]);
                        }
                    }

                    $scope.grid.resize();
                } else {
                    // CSS WAY... faster... not seeing any side effects yet
                    // hide all columns
                    for (c = 0; c < $scope.grid.columns.length; c++) {
                        $(".op-grid table th:nth-child(" + (c + 1) + "),td:nth-child(" + (c + 1) + "),col:nth-child(" + (c + 1) + ")").hide();
                    }

                    // show columns in list
                    for (c = 0; c < $scope.grid.columns.length; c++) {
                        if (colNames.indexOf($scope.grid.columns[c].field) >= 0) {
                            $(".op-grid table th:nth-child(" + (c + 1) + "),td:nth-child(" + (c + 1) + "),col:nth-child(" + (c + 1) + ")").show();
                        }
                    }
                }

            }

            $scope.syncLinked = function (newField, newValue) {
                var data = $scope.contractDs.view();
                for (var v = 0; v < data.length; v++) {
                    var dataItem = data[v];
                    if (dataItem.isLinked !== undefined && dataItem.isLinked) {
                        if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                        if (dataItem._behaviors.isReadOnly === undefined) dataItem._behaviors.isReadOnly = {};
                        if (dataItem._behaviors.isReadOnly[newField] === undefined || dataItem._behaviors.isReadOnly[newField] === false) {
                            if (dataItem._behaviors.isHidden === undefined) dataItem._behaviors.isHidden = {};
                            if (dataItem._behaviors.isHidden[newField] === undefined || dataItem._behaviors.isHidden[newField] === false) {
                                dataItem.set(newField, newValue);
                                $scope.saveCell(dataItem, newField);
                            }
                        }
                    }
                }
            }

            $scope.saveCell = function (dataItem, newField) {
                if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
                dataItem._behaviors.isDirty[newField] = true;
                dataItem._dirty = true;
                $scope._dirty = true;
            }

            $scope.$on('refresh', function (event, args) {

            });

            $scope.$on('saveComplete', function (event, args) {
                // need to clean out all flags... dirty, error, validMsg
                $scope.cleanFlags();

                if (!!args.data.WIP_DEAL) {
                    for (var i = 0; i < args.data.WIP_DEAL.length; i++) {
                        var dataItem = $scope.findDataItemById(args.data.WIP_DEAL[i]["DC_ID"]);
                        dataItem["PASSED_VALIDATION"] = args.data.WIP_DEAL[i]["PASSED_VALIDATION"];
                    }
                }
            });

            $scope.$on('saveWithWarnings', function (event, args) {
                // need to clean out all flags... dirty, error, validMsg
                $scope.cleanFlags();

                // need to set all flags... dirty, error, validMsg
                if (!!args.data.WIP_DEAL) {
                    for (var i = 0; i < args.data.WIP_DEAL.length; i++) {
                        var dataItem = $scope.findDataItemById(args.data.WIP_DEAL[i]["DC_ID"]);
                        if (dataItem != null) dataItem["PASSED_VALIDATION"] = args.data.WIP_DEAL[i]["PASSED_VALIDATION"];

                        if (args.data.WIP_DEAL[i].warningMessages.length !== 0) {
                            var beh = args.data.WIP_DEAL[i]._behaviors;
                            if (!beh) beh = {};
                            if (beh.isError === undefined) beh.isError = {};
                            if (beh.validMsg === undefined) beh.validMsg = {};

                            if (dataItem != null) {
                                Object.keys(beh.isError).forEach(function(key, index) {

                                        dataItem._behaviors.isError[key] = beh.isError[key];
                                        dataItem._behaviors.validMsg[key] = beh.validMsg[key];
                                        $scope.increaseBadgeCnt(key);

                                    },
                                    beh.isError);
                            }
                        }
                    }
                }

            });

            $scope.increaseBadgeCnt = function(key) {
                if ($scope.opOptions.groupColumns[key] === undefined) return;
                for (var i = 0; i < $scope.opOptions.groupColumns[key].Groups.length; i++) {
                    for (var g = 0; g < $scope.opOptions.groups.length; g++) {
                        if ($scope.opOptions.groups[g].name === $scope.opOptions.groupColumns[key].Groups[i] || $scope.opOptions.groups[g].name === "All") {
                            $scope.opOptions.groups[g].numErrors++;
                        }
                    }
                }
            }

            $scope.findDataItemById = function (id) {
                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (!!data[d]["DC_ID"] && data[d]["DC_ID"] === id) return data[d];
                }
                return null;
            }
            
            $scope.$on('syncDs', function (event, args) {
                event.currentScope.contractDs.sync();
            });

            $scope.cleanFlags = function () {
                $scope.clearBadges();

                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    var beh = data[d]._behaviors;

                    // clear items for this row
                    beh.isError = {};
                    beh.validMsg = {};
                    beh.isDirty = {};
                }

                $scope._dirty = false;
            }

            $scope.saveWipDeals = function() {
                $scope.$parent.$parent.$parent.saveEntireContract();
            }

            $scope.backToPricingTable = function () {
                $scope.$parent.$parent.$parent.backToPricingTable();
            }

            $scope.clearBadges = function() {
                var grps = $scope.opOptions.groups;
                angular.forEach(grps, function (value, key) {
                    grps[key].numErrors = 0;
                });
            }

            $scope.validateGrid = function () {
                var valid = true;

                // clear out badges
                $scope.clearBadges();

                var data = $scope.contractDs.data();
                for (var d = 0; d < data.length; d++) {
                    if (!$scope.validateRow(data[d], $scope)) valid = false;
                }

                if (valid) {
                    $scope.$parent.$parent.$parent.validateWipDeals();
                } else {
                    $scope.$parent.$parent.$parent.setBusy("Validation Failed", "Looks like there are items that need to be fixed.");
                    op.notifyWarning("Looks like there are items that need to be fixed.", "Validation Results");
                    $timeout(function () {
                        $scope.$parent.$parent.$parent.setBusy("", "");
                    }, 4000);

                }
            }

            $scope.validateRow = function (row, scope) {
                var valid = true;
                if (row._behaviors === undefined || row._behaviors.isError === undefined) return true;

                var beh = row._behaviors;
                if (beh.isRequired === undefined) beh.isRequired = {};
                if (beh.isReadOnly === undefined) beh.isReadOnly = {};
                if (beh.isHidden === undefined) beh.isHidden = {};

                // clear validation for this row
                //beh.isError = {};
                //beh.validMsg = {};

                // check for required fields
                //angular.forEach(beh.isRequired, function (value, key) {
                //    if ((row[key] === undefined || row[key] === null || row[key] === '') && (beh.isReadOnly[key] === undefined && !beh.isReadOnly[key]) && (beh.isHidden[key] === undefined && !beh.isHidden[key])) {
                //        var cols = this.grid.columns;
                //        var title = cols.find(function (v, i) {
                //            return cols[i].field === key;
                //        }).title;
                //        beh.isError[key] = true;

                //        if (beh.validMsg[key] === undefined) beh.validMsg[key] = "";
                //        beh.validMsg[key] += title + " is required<br/>";

                //        $scope.increaseBadgeCnt(key);
                //        valid = false;
                //        row["PASSED_VALIDATION"] = "Dirty";
                //    }
                //}, scope);

                // check for errors
                //debugger;
                angular.forEach(beh.isError, function (value, key) {
                    if ((beh.isReadOnly[key] === undefined || !beh.isReadOnly[key]) && (beh.isHidden[key] === undefined || !beh.isHidden[key])) {
                        $scope.increaseBadgeCnt(key);
                        valid = false;
                        row["PASSED_VALIDATION"] = "Dirty";
                    } else {
                        beh.isError[key] = false;
                        beh.validMsg[key] = false;
                    }
                }, scope);

                return valid;
            }

            $scope.opOptions.columns = $scope.assignColSettings();
        }],
        link: function (scope, element, attr) {
            scope.elGrid = element;
            scope.grid = $(element).find(".op-grid").data("kendoGrid");
            scope.isToolbarVisible = true;
        }
    };
}

