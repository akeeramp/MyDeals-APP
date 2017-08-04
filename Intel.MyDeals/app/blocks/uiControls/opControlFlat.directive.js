angular
    .module('blocks.uiControls')
    .directive('opControlFlat', opControlFlat);

// Minification safe dependency injection
opControlFlat.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q'];

function opControlFlat($http, lookupsService, $compile, $templateCache, logger, $q) {
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
		el += ' ng-model="value.' + scope.opCd + '"';
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
		el += ' op-extra="' + scope.opExtra + '"';
		el += ' op-class="\'' + scope.opClass + '\'"';
		el += ' op-style="\'' + scope.opStyle + '\'"';
		el += ' op-placeholder="\'' + placeholder + '\'"';
        el += ' op-valid-msg="value._behaviors.validMsg.' + scope.opCd + '"';
        el += ' op-help-msg="value._behaviors.helpMsg.' + scope.opCd + '"';
        el += ' op-is-error="value._behaviors.isError.' + scope.opCd + '"';
        el += ' op-is-dirty="value._behaviors.isDirty.' + scope.opCd + '"';
        el += ' op-is-saved="value._behaviors.isSaved.' + scope.opCd + '"';
        el += ' op-is-stealth="' + scope.opIsStealth + '"';
        el += ' op-is-required="value._behaviors.isRequired.' + scope.opCd + '"';
        el += ' op-is-read-only="value._behaviors.isReadOnly.' + scope.opCd + '"';
        el += ' op-is-hidden="value._behaviors.isHidden.' + scope.opCd + '">';
        el += '</div>';

        var x = angular.element(el);
        element.append(x);
        $compile(x)(scope);
    }

    return {
        restrict: 'AE', //E = element, A = attribute, C = class, M = comment

        // add binding to ng-model
        scope: {
            value: '=ngModel',
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
            opIsForm: '=',
            opIsStealth: '=?',
            opClass: '=',
            opStyle: '=',
            opPlaceholder: '=',
            opExpanded: '=',
            opExtra: '='
        },
        link: linker
    }
}

