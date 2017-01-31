angular
    .module('app.contract')
    .directive('opControl', opControl);

// Minification safe dependency injection
opControl.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q'];

function opControl($http, lookupsService, $compile, $templateCache, logger, $q) {
    var getTemplate = function (controlType) {
        var baseUrl = 'app/shared/uiControls/';
        var templateMap = {
            'VERTICAL_TEXTBOX': 'verticalTextBox.html',
            'VERTICAL_DATEPICKER': 'verticalDatePicker.html',
            'VERTICAL_NUMERIC': 'verticalNumericTextBox.html',
            'VERTICAL_DROPDOWN': 'verticalDropDown.html',
            'VERTICAL_COMBOBOX': 'verticalComboBox.html',
            'VERTICAL_CHECKBOX': 'verticalCheckBox.html',
            'HORIZONTAL_TEXTBOX': 'horizontalTextBox.html',
            'HORIZONTAL_DATEPICKER': 'horizontalDatePicker.html',
            'HORIZONTAL_NUMERIC': 'horizontalNumericTextBox.html',
            'HORIZONTAL_DROPDOWN': 'horizontalDropDown.html',
            'HORIZONTAL_COMBOBOX': 'horizontalComboBox.html',
            'HORIZONTAL_CHECKBOX': 'horizontalCheckBox.html'
        };

        var templateUrl = baseUrl + templateMap[controlType.toUpperCase()];
        var templateLoader = $http.get(templateUrl, { cache: $templateCache });

        return templateLoader;
    }

    var linker = function (scope, element, attrs) {
        //debugger;
        if (scope.opCd === "_dirty") {
            //debugger;
            return;
        }
        //debugger;
        if (scope.opIsReadOnly === undefined) scope.opIsReadOnly = false;
        if (scope.opIsRequired === undefined) scope.opIsRequired = false;
        if (scope.opIsHidden === undefined) scope.opIsHidden = false;
        if (scope.opIsDirty === undefined) scope.opIsDirty = false;
        if (scope.opIsError === undefined) scope.opIsError = false;
        if (scope.opIsSaved === undefined) scope.opIsSaved = false;
        if (scope.opValidMsg === undefined) scope.opValidMsg = "";

        if (scope.opLookupUrl !== undefined && scope.opLookupUrl !== "undefined") {
            scope.values = {
                transport: {
                    read: {
                        url: scope.opLookupUrl,
                        dataType: "json"
                    }
                },
                schema: {
                    parse: function (data) {
                        var newData = [];
                        $.each(data, function (idx, elem) {
                            newData.push({ 'text': elem[scope.opLookupText], 'value': elem[scope.opLookupValue] });
                        });
                        return newData;
                    }
                }
            }
        }

        var loader = getTemplate(scope.opUiMode + '_' + scope.opType);
        var promise = loader.success(function (html) {
            element.html(html);
        })
            .then(function (response) {
                element.replaceWith($compile(element.html())(scope));
            });

        scope.$watch('value',
            function (newValue, oldValue, el) {
                //debugger;
                if (oldValue === newValue) return;
                el.opIsDirty = true;
                if (el.$parent.opValue !== undefined) el.$parent.opValue._dirty = true;
                if (el.$parent.value !== undefined) el.$parent.value._dirty = true;
                //alert("value changed");
                //debugger;
            });

        // Kendo tooltip content doesn't observe binding data changes, work around it to observe changes.
        scope.tooltipMsg = "{{opValidMsg}}";
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
            opUiMode: '=',
            opCd: '=',
            opType: '=',
            opValidMsg: '='
        },
        link: linker
    }
}