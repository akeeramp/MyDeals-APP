angular
    .module('blocks.uiControls')
    .directive('opControl', opControl);

// Minification safe dependency injection
opControl.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q', 'dataService', '$filter', '$timeout'];

function opControl($http, lookupsService, $compile, $templateCache, logger, $q, dataService, $filter, $timeout) {
    var getTemplate = function (controlType) {
        var baseUrl = 'app/blocks/uiControls/partials/';
        var templateMap = {
            'VERTICAL_TEXTBOX': 'verticalTextBox.html',
            'VERTICAL_TEXTAREA': 'verticalTextArea.html',
            'VERTICAL_DATEPICKER': 'verticalDatePicker.html',
            'VERTICAL_NUMERIC': 'verticalNumericTextBox.html',
            'VERTICAL_DROPDOWN': 'verticalDropDown.html',
            'VERTICAL_COMBOBOX': 'verticalComboBox.html',
            'VERTICAL_MULTISELECT': 'verticalMultiSelect.html',
            'VERTICAL_EMBEDDEDMULTISELECT': 'verticalEmbeddedMultiSelect.html',
            'VERTICAL_CHECKBOX': 'verticalCheckBox.html',
            'VERTICAL_SLIDER': 'verticalSlider.html',
            'VERTICAL_RADIOBUTTONGROUP': 'verticalRadioButtonGroup.html',
            'HORIZONTAL_TEXTBOX': 'horizontalTextBox.html',
            'HORIZONTAL_TEXTAREA': 'horizontalTextArea.html',
            'HORIZONTAL_DATEPICKER': 'horizontalDatePicker.html',
            'HORIZONTAL_NUMERIC': 'horizontalNumericTextBox.html',
            'HORIZONTAL_DROPDOWN': 'horizontalDropDown.html',
            'HORIZONTAL_COMBOBOX': 'horizontalComboBox.html',
            'HORIZONTAL_MULTISELECT': 'horizontalMultiSelect.html',
            'HORIZONTAL_EMBEDDEDMULTISELECT': 'horizontalEmbeddedMultiSelect.html',
            'HORIZONTAL_CHECKBOX': 'horizontalCheckBox.html',
            'HORIZONTAL_SLIDER': 'horizontalSlider.html',
            'HORIZONTAL_RADIOBUTTONGROUP': 'horizontalRadioButtonGroup.html'
        };

        var templateUrl = baseUrl + templateMap[controlType.toUpperCase()];
        var templateLoader = $http.get(templateUrl, { cache: $templateCache });

        return templateLoader;
    }

    var linker = function (scope, element, attrs) {
        if (scope.opCd === "_dirty") {
            return;
        }
        if (scope.opIsReadOnly === undefined) scope.opIsReadOnly = false;
        if (scope.opIsRequired === undefined) scope.opIsRequired = false;
        if (scope.opIsHidden === undefined) scope.opIsHidden = false;
        if (scope.opIsDirty === undefined) scope.opIsDirty = false;
        if (scope.opIsError === undefined) scope.opIsError = false;
        if (scope.opIsSaved === undefined) scope.opIsSaved = false;
        if (scope.opValidMsg === undefined) scope.opValidMsg = "";
        if (scope.opHelpMsg === undefined) scope.opHelpMsg = "";

        // TODO make changes to propagate from directive bindings, used for numeric text box formating
        scope.opOptions = {
            format: "#",
            decimals: 0
        }

        var serviceData = []; // data from the service will be pushed into this.
        if ((scope.opType === 'COMBOBOX' || scope.opType === 'DROPDOWN' || scope.opType === 'MULTISELECT' || scope.opType === 'EMBEDDEDMULTISELECT')) {
            if ((scope.opLookupUrl !== undefined && scope.opLookupUrl !== "undefined")) {
            	scope.values = {
                    transport: {
                    	read: function(e) {
                    		// Use dataService to take advantage of ng caching							
                    		dataService.get(scope.opLookupUrl, null, null, true)
								.then(function (response) {
									e.success(response.data);
								}, function (response) {
									logger.error("Unable to get data for dropdowns.", response, response.statusText);
								});
                        }
                    },
                    schema: {
                        parse: function (data) {
                            // Values in the list should be unique
                            serviceData = $filter('unique')(data, scope.opLookupValue);
                            // data from the service will be pushed into this.
                            if (scope.opType === 'EMBEDDEDMULTISELECT') {
                                var hDS = {
                                    data: serviceData
                                };
                                
                                //check first item by default
                                //hDS.data[0].checked = true;

                                //treelist datasource
                                scope.opHierarchicalDataSource = {
                                    dataSource: hDS,
                                    dataBound: function (e) {
                                        var treeview = $("#" + scope.opCd).data("kendoTreeView");
                                        // collapse all items
                                        if (!!treeview) {
                                            treeview.collapse(".k-item");
                                        }
                                    }
                                };

                                //flatten service data for use by paired multiselect
                                serviceData = flattenTreeData(serviceData);
                                
                            }
                            return serviceData;
                        }
                    }
                }
            } else if (scope.opLookupValues !== undefined) {
                scope.values = scope.opLookupValues;
            }
        }

        if (scope.opType === 'RADIOBUTTONGROUP') {
            if (scope.opLookupUrl !== undefined && scope.opLookupUrl !== "undefined") {
                dataService.get(scope.opLookupUrl, null, null, true).then(function (response) {
                    scope.values = response.data;
                }, function (response) {
                    logger.error("Unable to get lookup values.", response, response.statusText);
                });
            }
        }

        if (scope.opType === 'MULTISELECT') {
              
            if (!!scope.value && !Array.isArray(scope.value) && !(typeof scope.value === "object")) {
                scope.value = scope.value.split(",");
            }
        }

        if (scope.opType === 'EMBEDDEDMULTISELECT') {

            if (!!scope.value && !Array.isArray(scope.value) && !(typeof scope.value === "object")) {
                scope.value = scope.value.split(",");
            }

            //when user clicks multiselect to open treeview, ensure that treeview's checked values match to those of the multiselect.
            var updateTreeView = function () {
                if (scope.showTreeView === true) {
                    var msValues = $("#" + scope.opCd + "_MS").data("kendoMultiSelect").value();
                    var treeview = $("#" + scope.opCd).data("kendoTreeView");

                    for (var i = 0; i < msValues.length; i++) {
                        var matches = treeview.findByText(msValues[i]);
                        if (matches.length > 1) {
                            //quickfix for Region having same name as Country - however this will become an issue if a geo/blended geo ends up having 2 different regions with the same country name
                            //for now we select the deepest level node, aka the last one found by jquery in the treeview.findByText call
                            treeview.dataItem(treeview.findByText(msValues[i])[matches.length - 1]).set("checked", true);
                        } else {
                            treeview.dataItem(treeview.findByText(msValues[i])).set("checked", true);
                        }
                    }
                }
            }

            scope.onOpen = function () {
                $timeout(function () {
                    $(".k-animation-container").last().css("display", "none");
                    //$(".k-animation-container").last().css("opacity", "0");
                    //$(".k-animation-container").last().css("z-index", "0");
                }, 10);
                scope.showTreeView = true;
                updateTreeView();
            }

            scope.onClose = function () {
                scope.showTreeView = false;
                updateTreeView();
            }

            scope.onDeselect = function (e) {
                var item = e.item[0].innerText.toUpperCase();
                var treeview = $("#" + scope.opCd).data("kendoTreeView");
                var ds = treeview.dataSource.data();

                for (var d = 0; d < ds.length; d++) {
                    if (ds[d].DROP_DOWN.toUpperCase() === item) {
                        ds[d].set('checked', false);
                    }
                }

                scope.value = scope.value.filter(function (el) {
                    return el.toUpperCase() !== item;
                });
            }

        	// Onclick event for embedded Multiselects
            scope.onEmbeddedMultiSelectClick = function () {
                return;
                //$(".k-animation-container").last().css("display", "none");
        	    //scope.showTreeView = !scope.showTreeView;
        	    //updateTreeView();
        	}
            scope.onCheckFunction = function (e) {
                var treeview = $("#" + scope.opCd).data("kendoTreeView");
                var checkedNodes = [];

                function gatherStates(nodes) {
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].checked) {
                            checkedNodes.push(nodes[i].DROP_DOWN);
                        }

                        if (nodes[i].hasChildren) {
                            gatherStates(nodes[i].children.view());
                        }
                    }
                }
                gatherStates(treeview.dataSource.view());

                //multiselect should display same data as checked treelist nodes
                $("#" + scope.opCd + "_MS").data("kendoMultiSelect").value(checkedNodes);
                scope.value = checkedNodes;
            }

            scope.onSelectFunction = function (e) {
                //TODO: clicking the name of a treeview node, it should check its respective checkbox as well
            }

            var flattenTreeData = function (sd) {
                var ret = [];
                for (var i = 0; i < sd.length; i++) {
                    if (sd[i].items == null || sd[i].items.length == 0) {
                        ret = ret.concat(sd[i]);
                    } else {
                        ret = ret.concat(sd[i]);
                        ret = ret.concat(flattenTreeData(sd[i].items));
                    }
                }
                return ret;
            }

            ////Note: this doesn't work, clicking anywhere causes the doc-hide to trigger.  also would need to move elsewhere as each time you open an editor it will link the event causing double/triple/etc hits on these debuggers.
            //$("#" + scope.opCd + "_MS").click(function (e) {
            //    debugger;
            //    $("#" + scope.opCd).toggle();
            //    e.stopPropagation();
            //});
            //$(document).click(function () {
            //    debugger;
            //    $("#" + scope.opCd).hide();
            //});
            //$("#" + scope.opCd).click(function (e) {
            //    debugger;
            //    e.stopPropagation();
            //});
        }

        var loader = getTemplate(scope.opUiMode + '_' + scope.opType);
        //var promise = loader.success(function (html) {
        //    element.html(html);
        //}).then(function (response) {
        //    element.replaceWith($compile(element.html())(scope));
        //});
        loader.success(function (html) {
            if (element.html() !== "") return;
            if (element.parent().find(".opUiElement").length > 0) return;
            html = html.replace(/id="{{opCd}}"/g, 'id="' + scope.opCd + '"');
            var x = angular.element(html);
            element.html(x);
            $compile(x)(scope);
        });

        scope.$watch('value',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;
                el.opIsDirty = true;
                el.$parent.$parent.opIsDirty = true;
                el.$parent.$parent.$parent._dirty = true;
                if (!!el.$parent.$parent.dataItem) el.$parent.$parent.dataItem.dirty = true;

                if (el.$parent.opValue !== undefined) {
                    el.$parent.opValue._dirty = true;
                    if (!!scope.opSelectedObject) el.$parent.opValue[scope.opSelectedObject] = updateSeletedObject();
                }

                if (el.$parent.value !== undefined) {
                    el.$parent.value._dirty = true;
                    if (!!scope.opSelectedObject) el.$parent.value[scope.opSelectedObject] = updateSeletedObject();
                }

                // if the field is required and user has entered a value(OpIsDirty = true), remove the required field error message.
                if (el.opIsDirty) {
                    if (el.$parent.opValue !== undefined) {
                        if (el.$parent.opValue[el.opCd] !== null && el.$parent.opValue[el.opCd] !== undefined
                                && el.$parent.opValue[el.opCd] !== "" && el.opIsRequired === true && el.opValidMsg === "* field is required") {
                            el.opIsError = false;
                            el.opValidMsg = "";
                        }
                    }

                    if (el.$parent.value !== undefined) {
                        if (el.$parent.value[el.opCd] !== null && el.$parent.value[el.opCd] !== undefined
                                && el.$parent.value[el.opCd] !== "" && el.opIsRequired && el.opValidMsg === "* field is required") {
                            el.opIsError = false;
                            el.opValidMsg = "";
                        }
                    }
                }

            });

        // Kendo tooltip content doesn't observe binding data changes, work around it to observe changes.
        scope.tooltipMsg = "{{opValidMsg}}";
        scope.helptipMsg = "{{opHelpMsg}}";

        function updateSeletedObject() {
            if (!!scope.opSelectedObject && (scope.opType === 'DROPDOWN' || scope.opType === 'COMBOBOX' || scope.opType === 'MULTISELECT' || scope.opType === 'EMBEDDEDMULTISELECT')) {
                var selected = [];
                $.each(serviceData, function (idx, elem) {

                    if (elem[scope.opLookupValue] === scope.value) {
                        selected = elem;
                        return false;
                    }
                });
                return selected;
            }
        }
    }

    return {
        restrict: 'AE', //E = element, A = attribute, C = class, M = comment

        scope: {
            value: '=ngModel',
            opLabel: '=',
            opIsDirty: '=',
            opIsReadOnly: '=',
            opIsRequired: '=',
            opIsHidden: '=',
            opIsError: '=',
            opIsSaved: '=',
            opLookupUrl: '=',
            opLookupText: '=',
            opLookupValue: '=',
            opLookupValues: '=',
            opSelectedObject: '=',
            opMinValue: '=',
            opMaxValue: '=',
            opUiMode: '=',
            opCd: '=',
            opType: '=',
            opValidMsg: '=',
            opHelpMsg: '=',
            opIsForm: '=',
            opClass: '=',
            opStyle: '=',
            opPlaceholder: '='
        },
        link: linker
    }
}