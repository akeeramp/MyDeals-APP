(function () {
	'use strict';

	angular
        .module('app.core')
        .directive('trashcan', trashcan);

	trashcan.$inject = ['$compile'];

	function trashcan($compile) {
		return {
			restrict: 'E',
			scope: {
			},
			templateUrl: '/app/core/directives/trashcan/trashcan.directive.html',
			compile: function (element, attrs) {
			}
		}
	}
})();