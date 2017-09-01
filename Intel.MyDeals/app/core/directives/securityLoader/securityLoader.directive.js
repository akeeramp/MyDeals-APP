//TODO : Delete this once service method is approved
(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('securityLoader', securityLoader);

    securityLoader.$inject = ['$compile', 'securityService', 'cacheService'];
    function securityLoader($compile, securityService, cacheService) {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            templateUrl: '/app/core/directives/securityLoader/securityLoader.directive.html',
            link: function (scope, element, attrs) {

                scope.$root.securityAttributes = null;
                //if (scope.$root.securityAttributes === null) {
                	var securityAttributes = sessionStorage.getItem('securityAttributes');
                	var securityMasks = sessionStorage.getItem('securityMasks');
                	var sessionComparisonHash = sessionStorage.getItem('sessionComparisonHash');

                	cacheService.getSessionComparisonHash().then(function (data) {
						// check if user's session hash is the same as the server's session hash
                		if (data.data.toString() !== sessionComparisonHash) {
                			sessionStorage.setItem('sessionComparisonHash', data.data);
                			getSetSecurityData();
                		}
                	});

                	if (!securityAttributes) {
                		getSetSecurityData();
                	} else {
                		securityService.setSecurityData(JSON.parse(securityAttributes), JSON.parse(securityMasks));
                	}
            	//} else {
			    // 	securityService.setSecurityData(scope.$root.securityAttributes, scope.$root.securityMasks);
				//}

                function getSetSecurityData() {
                	securityService.getSecurityData().then(function (data) {
                		if (!!data.data) {
                			scope.$root.securityAttributes = data.data.SecurityAttributes;
                			scope.$root.securityMasks = data.data.SecurityMasks;

                			sessionStorage.setItem('securityAttributes', JSON.stringify(scope.$root.securityAttributes));
                			sessionStorage.setItem('securityMasks', JSON.stringify(scope.$root.securityMasks));

                			securityService.setSecurityData(data.data.SecurityAttributes, data.data.SecurityMasks);
                		}
                	});
                }
            }
        }
    }
})();