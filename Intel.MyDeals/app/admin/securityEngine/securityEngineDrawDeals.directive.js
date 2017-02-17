// HACK: This directive is a work-around to ng-click not compiling inside an ng-bind-html
// It assumes the page using the direct has a $parent scope with a vm.drawDealTypes() function
'use strict';
angular
	.module('app.admin')
	.directive('securityEngineDrawDeals', securityEngineDrawDeals);

// Minification safe dependency injection
securityEngineDrawDeals.$inject = ['$http', 'lookupsService', '$compile', '$templateCache', 'logger', '$q'];

function securityEngineDrawDeals($http, lookupsService, $compile, $templateCache, logger, $q) {

	var linker = function (scope, element, attr) {
		// Get HTML for each deal box 
		var html = scope.$parent.vm.drawDealTypes(scope.attrId, scope.atrbCd, scope.stgId, scope.stgName);
		// Compile html so that ng-click works
		var x = $compile(html)(scope);
		// append to original directive element
		element.append(x);
	}

	return {
		restrict: 'E', // E = element, A = attribute, C = class, M = comment
		scope: {
			atrbCd: '@' // '@' is one-way binding (reads the value), '=' is two-way binding, '&' is used to bind functions
			, attrId: '@'
			, stgId: '@'
			, stgName: '@'
		},
		link: linker
	};
}