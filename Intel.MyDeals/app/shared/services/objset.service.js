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

        validatePricingTableRow: validatePricingTableRow,

        updateContractAndCurPricingTable: updateContractAndCurPricingTable,
        readContractStatus: readContractStatus,
        readWipFromContract: readWipFromContract,
        actionPricingStrategy: actionPricingStrategy,
        actionPricingStrategies: actionPricingStrategies
    }

    return service;

    // #### CONTRACT CRUD ####

    function createContract(custId, contractId, ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/' + custId + '/' + contractId, [ct]);
    }
    function readContract(id) {
    	// NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id); 
    }
    function updateContract(custId, contractId, ct) {
        return dataService.post(apiBaseContractUrl + 'UpdateContract/' + custId + '/' + contractId, ct);
    }
    function deleteContract(id) {
        return dataService.get(apiBaseContractUrl + 'DeleteContract/' + id);
    }
    function isDuplicateContractTitle(dcId, title) {
        return dataService.get(apiBaseContractUrl + 'IsDuplicateContractTitle/' + dcId + '/' + title);
    }
    // #### PRICING STRATEGY CRUD ####

    function createPricingStrategy(custId, contractId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'SavePricingStrategy/' + custId + '/' + contractId, [ps]);
    }
    function readPricingStrategy(id) {
        return dataService.get(apiBasePricingStrategyUrl + 'GetPricingStrategy/' + id);
    }
    function updatePricingStrategy(custId, contractId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'UpdatePricingStrategy/' + custId + '/' + contractId, [ps]);
    }
    function deletePricingStrategy(custId, contractId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'DeletePricingStrategy/' + custId + '/' + contractId, [ps]);
    }

    // #### PRICING TABLE CRUD ####

    function createPricingTable(custId, contractId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId, [pt]);
    }
    function readPricingTable(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id);
    }
    function updatePricingTable(custId, contractId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId, [pt]);
    }
    function deletePricingTable(custId, contractId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'DeletePricingTable/' + custId + '/' + contractId, [pt]);
    }

	// #### PRICING TABLE ROW ####
    function validatePricingTableRow(data) {
    	return dataService.post(apiBaseContractUrl + 'ValidatePricingTableRows/', data);
    }

    // #### CONTRACT CRUD ####

    function updateContractAndCurPricingTable(custId, contractId, data, forceValidation, forcePublish, delPtr) {
        if (!delPtr) delPtr = false;
        if (forceValidation && forcePublish) {
            return dataService.post(apiBaseContractUrl + "SaveAndValidateAndPublishContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        } else if (forceValidation) {
            return dataService.post(apiBaseContractUrl + "SaveAndValidateContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        } else {
            return dataService.post(apiBaseContractUrl + "SaveContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        }
    }
    function readContractStatus(id) {
        return dataService.get(apiBaseContractUrl + 'GetContractStatus/' + id);
    }
    function readWipFromContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetWipFromContract/' + id);
    }


    function actionPricingStrategy(custId, contractId, pt, actn) {
        return dataService.post(apiBasePricingStrategyUrl + 'ActionPricingStrategy/' + custId + '/' + contractId + '/' + actn, [pt]);
    }
    function actionPricingStrategies(custId, contractId, data) {
        return dataService.post(apiBasePricingStrategyUrl + 'ActionPricingStrategies/' + custId + '/' + contractId, data);
    }
}