angular
    .module('blocks.uiControls')
    .directive('opControlDataElement', opControlDataElement);

// Minification safe dependency injection
opControlDataElement.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q'];

function opControlDataElement($http, lookupsService, $compile, $templateCache, logger, $q) {
	var linker = function (scope, element, attrs) {
		
		var placeholder = "";
		var label = "";
		if (scope.opPlaceholder !== undefined) {
			placeholder = scope.opPlaceholder;
		}
		if (scope.opLabel !== undefined) {
			label = scope.opLabel;
		}

		if (scope.opIsStealth === undefined) scope.opIsStealth = false;

        var el = "";
        el += '<div op-control';
        el += ' ng-model="opValue.' + scope.opCd + '.value"';
        el += ' op-ui-mode="\'' + scope.opUiMode + '\'"';
        el += ' op-cd="\'' + scope.opCd + '\'"';
        el += ' op-type="\'' + scope.opType + '\'"';
        el += ' op-label="\'' + label + '\'"';
        el += ' op-lookup-url="\'' + scope.opLookupUrl + '\'"';
        el += ' op-lookup-text="\'' + scope.opLookupText + '\'"';
        el += ' op-lookup-value="\'' + scope.opLookupValue + '\'"';
        el += ' op-lookup-values="\'' + scope.opLookupValues + '\'"';
        el += ' op-selected-object="\'' + scope.opSelectedObject + '\'"';
        el += ' op-min-value="' + scope.opMinValue + '"';
        el += ' op-max-value="' + scope.opMaxValue + '"';
        el += ' op-is-form="' + scope.opIsForm + '"';
        el += ' op-expanded="' + scope.opExpanded + '"';
        el += ' op-class="\'' + scope.opClass + '\'"';
        el += ' op-style="\'' + scope.opStyle + '\'"';
        el += ' op-placeholder="\'' + placeholder + '\'"';
        el += ' op-valid-msg="opValue.' + scope.opCd + '.validMsg"';
        el += ' op-help-msg="opValue.' + scope.opCd + '.helpMsg"';
        el += ' op-is-error="opValue.' + scope.opCd + '.isError"';
        el += ' op-is-saved="opValue.' + scope.opCd + '.isSaved"';
        el += ' op-is-stealth="' + scope.opIsStealth + '"';
        el += ' op-is-dirty="opValue.' + scope.opCd + '.isDirty"';
        el += ' op-is-required="opValue.' + scope.opCd + '.isRequired"';
        el += ' op-is-read-only="opValue.' + scope.opCd + '.isReadOnly"';
        el += ' op-is-hidden="opValue.' + scope.opCd + '.isHidden">';
        el += '</div>';

        var x = angular.element(el);
        element.append(x);
        $compile(x)(scope);
    }

    return {
        restrict: 'AE', //E = element, A = attribute, C = class, M = comment

        // add binding to ng-model
        scope: {
            opValue: '=ngModel',
            opUiMode: '=',
            opLabel: '=',
            opType: '=',
            opCd: '=',
            opLookupUrl: '=',
            opLookupText: '=',
            opLookupValue: '=',
            opLookupValues: '=',
            opSelectedObject: '=',
            opMinValue: '=',
            opMaxValue: '=',
            opIsForm: "=",
            opIsStealth: "=?",
            opClass: "=",
            opStyle: "=",
            opPlaceholder: '=',
            opExpanded: '='
        },
        link: linker
    }
}