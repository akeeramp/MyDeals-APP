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
            'HORIZONTAL_BUTTONGROUP': 'horizontalButtonGroup.html',
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
        if (scope.opIsStealth === undefined) scope.opIsStealth = false;
        if (scope.opValidMsg === undefined) scope.opValidMsg = "";
        if (scope.opHelpMsg === undefined) scope.opHelpMsg = "";
        if (scope.opFilterable === undefined) scope.opFilterable = false;

        //enable/disable UI control
        scope.isUIDisable = function (name, label) {
            if (scope.$parent.$parent.vm === undefined || scope.$parent.$parent.vm.autofillData === undefined) return false;
            var dealType = scope.$parent.$parent.vm.autofillData.DEALTYPE;
            var rebateType = scope.$parent.$parent.vm.autofillData.DEFAULT.REBATE_TYPE.value;
            var rowType = dealType == 'FLEX' ? scope.$parent.$parent.vm.autofillData.DEFAULT.FLEX_ROW_TYPE.value : true;
            if (label.trim() == 'Number of Tiers' ) {
                var hybCond = scope.$parent.$parent.vm.autofillData.isVistexHybrid;
                //for now the change is only for hybrid Voltier 
                if ((hybCond == '1' || rowType == 'Draining') && label.trim() == 'Number of Tiers') {
                    if (name == 1) {
                        if (scope.$parent.$parent.vm.autofillData.DEFAULT.NUM_OF_TIERS.value != "1") {
                            scope.$parent.$parent.vm.autofillData.DEFAULT.NUM_OF_TIERS.value = "1";
                        }
                        return scope.opIsReadOnly;
                    }
                    else
                        return true;
                }
                else {
                    return scope.opIsReadOnly;
                }
            }
            else if (label.trim() == 'Payout Based On') {
                var isVistex = scope.$parent.$parent.vm.autofillData.ISVISTEX;
                if (isVistex && name == 'Billings' && dealType == 'KIT') {
                    return true;
                }
                else if (dealType == 'FLEX' && name == 'Consumption') {
                    return true;
                }
                else if ((dealType === 'VOL_TIER' || dealType === 'PROGRAM') && (rebateType === 'TENDER' || rebateType === 'TENDER ACCRUAL')) {
                    scope.$parent.$parent.vm.autofillData.DEFAULT.PAYOUT_BASED_ON.value = "Consumption";
                   // return true;
                }
                else {
                    return scope.opIsReadOnly;
                }
            }
            else if ((label.trim() == 'Overarching Maximum Volume' || label.trim() == 'Overarching Maximum Dollar($)') && rowType == 'Draining' && dealType == 'FLEX') {
                // Clear existing values for overarching fields
                scope.$parent.$parent.vm.autofillData.DEFAULT.REBATE_OA_MAX_AMT.value = "";
                scope.$parent.$parent.vm.autofillData.DEFAULT.REBATE_OA_MAX_VOL.value = "";
                return true;
            }
            else {
                return scope.opIsReadOnly;
            }
        };
      
        // TODO make changes to propagate from directive bindings, used for numeric text box formating
        scope.opOptions = {
            format: "#",
            decimals: 0
        }

        var serviceData = []; // data from the service will be pushed into this.
        if ((scope.opType === 'COMBOBOX' || scope.opType === 'DROPDOWN' || scope.opType === 'MULTISELECT' || scope.opType === 'EMBEDDEDMULTISELECT')) {
            if ((scope.opLookupUrl !== undefined && scope.opLookupUrl !== "undefined")) {
                var custId = 0;
                var colName = "";
                if (scope.$parent.$parent.$ctrl != null && scope.$parent.$parent.$ctrl != undefined
                    && scope.$parent.$parent.$ctrl.colData != null
                    && scope.$parent.$parent.$ctrl.colData != undefined) {
                    custId = parseInt(scope.$parent.$parent.$ctrl.colData.custId);
                    colName = scope.$parent.$parent.$ctrl.colName;
                    if (custId == null || custId == undefined || custId == '') {
                        custId = 0;
                    }
                }
                scope.values = {
                    transport: {
                        read: function (e) {
                            // Use dataService to take advantage of ng caching
                            if (colName == "SETTLEMENT_PARTNER") {
                                dataService.get(scope.opLookupUrl + "/" + custId, null, null, true)
                                    .then(function (response) {
                                        e.success(response.data);
                                    }, function (response) {
                                        logger.error("Unable to get data for dropdowns.", response, response.statusText);
                                    });
                            }
                            else {
                                dataService.get(scope.opLookupUrl, null, null, true)
                                    .then(function (response) {
                                        e.success(response.data);
                                    }, function (response) {
                                        logger.error("Unable to get data for dropdowns.", response, response.statusText);
                                    });
                            }
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

                                //flatten service data for use by paired multi-select
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

        if (scope.opType === 'RADIOBUTTONGROUP' || scope.opType === 'BUTTONGROUP') {
            if (scope.opLookupUrl !== undefined && scope.opLookupUrl !== "undefined") {
                dataService.get(scope.opLookupUrl, null, null, true).then(function (response) {                 
                    scope.values = response.data;
                }, function (response) {
                    logger.error("Unable to get lookup values.", response, response.statusText);
                });
            }

            scope.blend = {
                //checkboxes refuse to ng-bind to bool primitives...
                blended: (scope.value !== undefined && scope.value.indexOf("[") > -1)
            };

            scope.getWidth = function (length) {
                ret = { 'width': 100.00 / length + '%' }
                return ret;
            }

            scope.hasMultipleGeos = function () {
                if (scope.opCd === "GEO_COMBINED" && scope.value.length > 1) {
                    return true;
                }
                return false;
            }

            scope.updateBlend = function () {
                if (scope.blend.blended) {
                    scope.value = convertToBlend(scope.value);
                } else {
                    scope.value = convertFromBlend(scope.value);
                }
            }

            var convertToBlend = function (geos) {  //geos is array
                if (geos.indexOf("Worldwide") > -1) {    //contains WW
                    if (geos.length > 1) {   //contains an item other than WW
                        geos.splice(geos.indexOf("Worldwide"), 1);
                        geos = "[" + geos.join() + "],Worldwide";
                    }
                } else {
                    if (geos.length > 0) {   //does not contain geo and is not empty
                        geos = "[" + scope.value.join() + "]";
                    }
                }
                return geos;
            }

            var convertFromBlend = function (geos) {    //geos is blend string
                if (geos.length > 1) {
                    return geos.replace('[', '').replace(']', '').split(',');
                } else {
                    return geos;
                }
            }

            scope.setValue = function (val) {
                if (scope.$parent.$parent.vm.autofillData.DEALTYPE == 'FLEX') {
                    var label = scope.$parent.$parent.vm.autofillData.DEFAULT.NUM_OF_TIERS.label;
                }
                
                if (!!scope.opExtra) {
                    //if extra, scope.value should be an array unless blended
                    if (scope.blend.blended) scope.value = convertFromBlend(scope.value); //convert to unblended format for calculations

                    if (scope.value.indexOf(val) > -1) {
                        //already in values, deselect
                        scope.value.splice(scope.value.indexOf(val), 1);
                    } else {
                        //not in values, add
                        scope.value.push(val);
                        scope.value.sort();
                    }

                    if (scope.blend.blended) scope.value = convertToBlend(scope.value); //convert back to blended format

                } else {
                    scope.value = val;
                }
                if (scope.$parent.$parent.vm.autofillData.DEALTYPE == 'FLEX') {
                    if (val == 'Draining' || val == 'Accrual') {
                        rowType = val;
                        scope.isUIDisable(val == 'Draining' ? 1 : 10, label);
                    }
                }
            }

            scope.isSelected = function (lookupVal) { //todo: add boolean to check differently if it is an array
                if (!!scope.opExtra) {
                    if (scope.blend.blended) scope.value = convertFromBlend(scope.value); //convert to unblended format for calculations
                    var ret = (scope.value.indexOf(lookupVal) > -1);
                    if (scope.blend.blended) scope.value = convertToBlend(scope.value); //convert back to blended format
                    return ret;
                } else {
                    return (scope.value.toLowerCase() == lookupVal.toString().toLowerCase());
                }
            }

            
        }

        if (scope.opType === 'MULTISELECT') {

            if (!!scope.value && !Array.isArray(scope.value) && !(typeof scope.value === "object")) {
                scope.value = scope.value.toString().split(",");
            }
        }

        if (scope.opType === 'EMBEDDEDMULTISELECT') {
            if (!!scope.value && !Array.isArray(scope.value) && !(typeof scope.value === "object")) {
                scope.value = scope.value.toString().split(",");
            }

            if (scope.opExpanded !== undefined) {
                scope.showTreeView = scope.opExpanded;
            }

            var msDataBound = false;
            var tvDataBound = false;

            //when user clicks multiselect to open treeview, ensure that treeview's checked values match to those of the multiselect.
            var updateTreeView = function () {
                if (scope.showTreeView === true && msDataBound === true && tvDataBound === true) {
                    var multiselect = $("#" + scope.opCd + "_MS").data("kendoMultiSelect");
                    multiselect.input.attr("readonly", true);
                    var treeview = $("#" + scope.opCd).data("kendoTreeView");

                    if (multiselect == null || treeview == null) {
                        //TODO: for some reason on IE, the initial click to open the editor for TRGT_RGN causes this code to trigger, i.e. both kendo editors finished databinding but the multiselect remains un-rendered
                        //whats more, it even triggers a whopping 9 times (why?)
                        //FIXME: for now we fail silently and users will likely think they just misclicked the first time, but this does need to be addressed eventually.
                        //console.log("ouch")
                    } else {
                       
                        var msValues = multiselect.dataItems();
                        //var test = multiselect.value();
                        var soldToIdVal = [];
                        for (var k = 0; k < msValues.length; k++)
                        {
                            if (msValues[k].subAtrbCd)
                            {
                                soldToIdVal.push(msValues[k].subAtrbCd);
                            }                            
                        }
                        if (soldToIdVal.length > 0) {

                            var msValues= soldToIdVal
                        }
                        else
                        {
                            var msValues = multiselect.value();
                        }
                        

                        for (var i = 0; i < msValues.length; i++) {
                            var matches = treeview.findByText(msValues[i]);
                            if (matches.length > 1) {
                                //quickfix for Region having same name as Country - however this will become an issue if a geo/blended geo ends up having 2 different regions with the same country name
                                //for now we select the deepest level node, aka the childless nodes

                                for (var j = 0; j < matches.length; j++) {
                                    var dataItem = treeview.dataItem(matches[j]);
                                    if (!dataItem.hasChildren) {    //only check nodes that are childless (base level leaf nodes)
                                        treeview.dataItem(matches[j]).set("checked", true);
                                    }
                                }
                            } else {
                                var node = treeview.dataItem(matches);
                                if (typeof node != 'undefined' && node !== null) {    //for reason yet unknown to me, this for loop is executed multiple times and the first time findbytext does not detect children node at the country level and will sometimes thus error out - this fixes it but is only a hacky bandaid - figuring out why it does multiple calls may optimize runtime
                                    treeview.dataItem(matches).set("checked", true);  //only one match, let's check it regardless
                                }
                            }
                        }
                    }
                }
            }

            scope.onMSDataBound = function () {
                msDataBound = true;
                updateTreeView();
            }
            scope.onTVDataBound = function () {
                tvDataBound = true;
                updateTreeView();
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


            scope.onDeselect = function (e) {
                var chkSoldToID = e.dataItem.subAtrbCd;
                if (chkSoldToID) {
                    var item = chkSoldToID;
                }
                else
                {
                    var item = e.dataItem.DROP_DOWN;
                }
               
                var treeview = $("#" + scope.opCd).data("kendoTreeView");

                var matches = treeview.findByText(item);
                if (matches.length > 1) {
                    for (var i = 0; i < matches.length; i++) {
                        var dataItem = treeview.dataItem(matches[i]);
                        if (!dataItem.hasChildren) {    //only uncheck nodes that are childless (base level leaf nodes)
                            treeview.dataItem(matches[i]).set("checked", false);
                        }
                    }
                } else {
                    treeview.dataItem(matches).set("checked", false);  //only one match, let's uncheck it regardless
                }

                scope.value = scope.value.filter(function (el) {    //update bound multiselect value as well
                    return el.toUpperCase() !== item.toUpperCase();
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

                            var chkSoldToID = treeview.$angular_scope.opLookupText; //check for Sold_To_Id Field  
                            if (chkSoldToID == "subAtrbCd")
                            {
                                checkedNodes.push(nodes[i].dropdownName);
                            }
                            else
                            {
                                checkedNodes.push(nodes[i].DROP_DOWN);
                            }                                                       
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

            scope.onFilterKeyUpFunction = function (e) {
                var strFilterKey = e.target.value.trim().toLowerCase();
                if (strFilterKey != "") {
                    $("#MultiSelectSelections .k-in").each(function () {
                        if ($(this).html().toLowerCase().indexOf(strFilterKey) > -1)
                            $(this).closest('li').show();
                        else
                            $(this).closest('li').hide();
                    });
                } else
                    $("#MultiSelectSelections li").show();
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
        loader.then(function (html) {
            if (element.html() !== "") return;
            if (element.parent().find(".opUiElement").length > 0) return;
            html = html.data.replace(/id="{{opCd}}"/g, 'id="' + scope.opCd + '"');  //html = html.replace(/id="{{opCd}}"/g, 'id="' + scope.opCd + '"');
            var x = angular.element(html);
            element.html(x);
            $compile(x)(scope);
        });

        scope.$watch('value',
            function (newValue, oldValue, el) {
                if (oldValue === newValue) return;

                el.opIsDirty = true;
                el.$parent.$parent.opIsDirty = true;

                if (!el.opIsStealth) {
                    el.$parent.$parent.$parent._dirty = true;
                    if (!!el.$parent.$parent.dataItem) {
                        el.$parent.$parent.dataItem.dirty = true;

                        if (el.$parent.$parent.$parent.root !== undefined) {
                            el.$parent.$parent.$parent.root.saveCell(el.$parent.$parent.dataItem, el.opCd, el.$parent.$parent.$parent);
                            el.$parent.$parent.$parent.root.$broadcast('data-item-changed', el.opCd, el.$parent.$parent.dataItem, el);
                        }

                        //Note: the above 2 lines would update the wip deal level cell and mark it as dirty while ensuring it will be detected for saving.  the line below will instead do the same but will additionally update wip deal cells that are grouped (may be buggy with some editors)
                        //el.$parent.$parent.$parent.saveFunctions(el.$parent.$parent.dataItem, el.opCd, el.$parent.$parent.dataItem[el.opCd])
                    }

                }

                if (el.$parent.opValue !== undefined) {
                    el.$parent.opValue._dirty = true;
                    if (!!scope.opSelectedObject)
                        el.$parent.opValue[scope.opSelectedObject] = updateSeletedObject();
                }

                if (el.$parent.value !== undefined) {
                    el.$parent.value._dirty = true;
                    if (!!scope.opSelectedObject) el.$parent.value[scope.opSelectedObject] = updateSeletedObject();
                }

                // if the field is required and user has entered a value(OpIsDirty = true), remove the required field error message.
                if (el.opIsDirty) {
                    if (el.$parent.opValue !== undefined) {
                        if (el.$parent.opValue[el.opCd] !== null &&
                            el.$parent.opValue[el.opCd] !== undefined &&
                            el.$parent.opValue[el.opCd] !== "" &&
                            el.opIsRequired === true &&
                            el.opValidMsg === "* field is required") {
                            el.opIsError = false;
                            el.opValidMsg = "";
                        }
                    }

                    if (el.$parent.value !== undefined) {
                        if (el.$parent.value[el.opCd] !== null &&
                            el.$parent.value[el.opCd] !== undefined &&
                            el.$parent.value[el.opCd] !== "" &&
                            el.opIsRequired &&
                            el.opValidMsg === "* field is required") {
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
            opIsStealth: '=?',
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
            opExpanded: '=',
            opExtra: '=',
            opClass: '=',
            opStyle: '=',
            opPlaceholder: '=',
            opFilterable: '=?'
        },
        link: linker
    }
}