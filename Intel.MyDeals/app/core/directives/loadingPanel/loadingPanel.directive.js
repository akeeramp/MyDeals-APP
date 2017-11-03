// SUMMARY:		Loading panel that fills the enitre parent's height and width. 
// EXAMPLE USAGE:	 <loading-panel show="true" header="'TEST'" description="'hello'" msg-type="'Info'"></loading-panel>

angular
    .module('app.core')
    .directive('loadingPanel', loadingPanel);

loadingPanel.$inject = [];

function loadingPanel() {
	return {
		scope: {
			show: '=',
			header: '=',
			description: '=',
			msgType: '='
		},
		restrict: 'E',
		transclude: 'true',
		templateUrl: '/app/core/directives/loadingPanel/loadingPanel.directive.html',
		link: function (scope, element, attr) {
		}
	};
}