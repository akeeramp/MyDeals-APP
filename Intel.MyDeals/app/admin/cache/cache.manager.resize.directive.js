(function () {
	'use strict';

	angular
        .module('app.admin')
        .directive('resizeContainers', resizeContainers);

	resizeContainers.$inject = ['$window', '$timeout'];

	function resizeContainers($window, $timeout) {
		return {
			restrict: 'A',
			scope: {
				heightOffset: '@',
				widthOffset: '@'
			},
			link: function (scope, element, attrs) {
				var divElement = $(element);
				var heightOffset = (!!scope.heightOffset) ? parseInt(scope.heightOffset) : 200;
				var widthOffset = (!!scope.widthOffset) ? parseInt(scope.widthOffset) : 110;

				var divCacheList = divElement.find("#cacheList");
				var divViewResult = divElement.find('#viewResultsContainer');

				$($window).resize(function () {
					resizeContent();
				});

				$timeout(function () {
					$($window).trigger('resize');
				}, 100);

				function resizeContent() {
					var contentHeight = $(window).height() - heightOffset;
					var contentWidth = $(window).width() - widthOffset - divCacheList.width();

					divCacheList.css("height", contentHeight);
					divViewResult.css("height", contentHeight);
					divViewResult.css("width", contentWidth);
				}
			}
		}
	}
})();