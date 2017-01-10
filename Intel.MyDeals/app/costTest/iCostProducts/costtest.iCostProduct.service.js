(function () {
	'use strict';

	angular
		.module('app.costtest')
		.factory('iCostProductService', iCostProductService);

	// Minification safe dependency injection
	iCostProductService.$inject = ['dataService', 'logger', '$q'];

	function iCostProductService(dataService, logger, $q) {
		var service = {
			//getGeos: getGeos,
		}

		return service;
	}
})();