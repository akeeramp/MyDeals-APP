angular
    .module('app.contract')
    .factory('objsetService', objsetService);

// Minification safe dependency injection
objsetService.$inject = ['$http', 'dataService', 'logger', '$q'];

function objsetService($http, dataService, logger, $q) {
    // defining the base url on top, subsequent calls in the service
    // will be action methods under this controller
    var apiBaseContractUrl = "/api/Contracts/v1/";
    var apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";
    var apiBasePricingTableUrl = "/api/PricingTables/v1/";

    var service = {
        createContract: createContract,
        readContract: readContract,
        updateContract: updateContract,
        deleteContract: deleteContract,
        isDuplicateContractTitle: isDuplicateContractTitle,

        createPricingStrategy: createPricingStrategy,
        readPricingStrategy: readPricingStrategy,
        updatePricingStrategy: updatePricingStrategy,
        deletePricingStrategy: deletePricingStrategy,

        createPricingTable: createPricingTable,
        readPricingTable: readPricingTable,
        updatePricingTable: updatePricingTable,
        deletePricingTable: deletePricingTable,

        updateContractAndCurPricingTable: updateContractAndCurPricingTable,
        readContractStatus: readContractStatus
    }

    return service;

    // #### CONTRACT CRUD ####

    function createContract(custId, ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/' + custId, [ct]);
    }
    function readContract(id) {
    	// NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id, null, null, true); 
    }
    function updateContract(custId, ct) {
        return dataService.post(apiBaseContractUrl + 'UpdateContract/' + custId, ct);
    }
    function deleteContract(id) {
        return dataService.get(apiBaseContractUrl + 'DeleteContract/' + id);
    }
    function isDuplicateContractTitle(dcId, title) {
        return dataService.get(apiBaseContractUrl + 'IsDuplicateContractTitle/' + dcId + '/' + title);
    }
    // #### PRICING STRATEGY CRUD ####

    function createPricingStrategy(custId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'SavePricingStrategy/' + custId, [ps]);
    }
    function readPricingStrategy(id) {
        return dataService.get(apiBasePricingStrategyUrl + 'GetPricingStrategy/' + id);
    }
    function updatePricingStrategy(custId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'UpdatePricingStrategy/' + custId, [ps]);
    }
    function deletePricingStrategy(custId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'DeletePricingStrategy/' + custId, [ps]);
    }

    // #### PRICING TABLE CRUD ####

    function createPricingTable(custId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId, [pt]);
    }
    function readPricingTable(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id);
    }
    function updatePricingTable(custId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId, [pt]);
    }
    function deletePricingTable(custId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'DeletePricingTable/' + custId, [pt]);
    }

    // #### CONTRACT CRUD ####

    function updateContractAndCurPricingTable(custId, data) {
        return dataService.post(apiBaseContractUrl + "SaveContractAndPricingTable/" + custId, data);
    }

    function readContractStatus(id) {
        return dataService.get(apiBaseContractUrl + 'GetContractStatus/' + id);
    }

    
}