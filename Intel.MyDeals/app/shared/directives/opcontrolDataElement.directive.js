angular
    .module('app.contract')
    .directive('opControlDataElement', opControlDataElement);

// Minification safe dependency injection
opControlDataElement.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q'];

function opControlDataElement($http, lookupsService, $compile, $templateCache, logger, $q) {

    var linker = function (scope, element, attrs) {

        var el = "";
        el += '<div op-control';
        el += ' ng-model="opValue.' + scope.opCd + '.value"';
        el += ' op-ui-mode="\'' + scope.opUiMode + '\'"';
        el += ' op-cd="\'' + scope.opCd + '\'"';
        el += ' op-type="\'' + scope.opType + '\'"';
        el += ' op-label="\'' + scope.opLabel + '\'"';
        el += ' op-lookup-url="\'' + scope.opLookupUrl + '\'"';
        el += ' op-lookup-text="\'' + scope.opLookupText + '\'"';
        el += ' op-lookup-value="\'' + scope.opLookupValue + '\'"';
        el += ' op-valid-msg="opValue.' + scope.opCd + '.validMsg"';
        el += ' op-is-error="opValue.' + scope.opCd + '.isError"';
        el += ' op-is-saved="opValue.' + scope.opCd + '.isSaved"';
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
            opLookupValue: '='
        },
        link: linker
    }
}