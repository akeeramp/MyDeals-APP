angular
    .module('app.contract')
    .factory('objsetService', objsetService);

// Minification safe dependency injection
objsetService.$inject = ['$http', 'dataService', 'logger', '$q', '$location'];

function objsetService($http, dataService, logger, $q, $location) {
    // defining the base url on top, subsequent calls in the service
    // will be action methods under this controller
    var apiBaseContractUrl = "/api/Contracts/v1/";
    var apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";
    var apiBasePricingTableUrl = "/api/PricingTables/v1/";
    var apiBaseQuoteLetterUrl = "/api/QuoteLetter/";
    var apiBaseCostTestUrl = "/api/CostTest/v1/";
    var apiBaseTenderUrl = "/api/Tenders/v1/";
    var apiBaseEmailUrl = "/api/Email/";
    var dropDownApiUrl = "/api/Dropdown/";
    var apiBaseSearchUrl = "/api/Search/"

    var service = {
        createTenderContract: createTenderContract,
        publishTenderDeals: publishTenderDeals,
        createContract: createContract,
        copyContract: copyContract,
        copyTenderFolioContract: copyTenderFolioContract,
        copyContractPivot: copyContractPivot,
        readContract: readContract,
        readCopyContract:readCopyContract,
        updateContract: updateContract,
        deleteContract: deleteContract,
        isDuplicateContractTitle: isDuplicateContractTitle,
        getExportContract: getExportContract,
        
        createPricingStrategy: createPricingStrategy,
        copyPricingStrategy: copyPricingStrategy,
        readPricingStrategy: readPricingStrategy,
        updatePricingStrategy: updatePricingStrategy,
        deletePricingStrategy: deletePricingStrategy,
        deletePricingStrategyById: deletePricingStrategyById,
        rollBackPricingStrategy: rollBackPricingStrategy,
        cancelPricingStrategy: cancelPricingStrategy,

        createPricingTable: createPricingTable,
        copyPricingTable: copyPricingTable,
        readPricingTable: readPricingTable,
        updatePricingTable: updatePricingTable,
        deletePricingTable: deletePricingTable,
        rollBackPricingTable: rollBackPricingTable,
        cancelPricingTable: cancelPricingTable,

        updateWipDeals: updateWipDeals,

        readTender: readTender,
        readTenderChildren: readTenderChildren,
        searchTender: searchTender,
        bulkTenderUpdate: bulkTenderUpdate,
        getTendersByIds: getTendersByIds,

        deletePricingTableRow: deletePricingTableRow,
        rollbackPricingTableRow: rollbackPricingTableRow,
        unGroupPricingTableRow: unGroupPricingTableRow,
        getPath: getPath,
        emailActions: emailActions,

        updateContractAndCurPricingTable: updateContractAndCurPricingTable,
        updateContractAndCurPricingTableInBulk: updateContractAndCurPricingTableInBulk,
        readContractStatus: readContractStatus,
        readWipFromContract: readWipFromContract,
        readWipExclusionFromContract: readWipExclusionFromContract,
        updateAtrbValue: updateAtrbValue,

        getWipDealsByPtr: getWipDealsByPtr,
        getWipDealById: getWipDealById,
        actionPricingStrategy: actionPricingStrategy,
        actionPricingStrategies: actionPricingStrategies,
        actionWipDeal: actionWipDeal,
        actionWipDeals: actionWipDeals,
        actionTenderDeals: actionTenderDeals,
        getPctDetails: getPctDetails,
        setPctOverride: setPctOverride,
        runPctContract: runPctContract,
        runBulkPctPricingStrategy: runBulkPctPricingStrategy,
        getOverlappingDealsFromContract: getOverlappingDealsFromContract,
        getOverlappingDealsFromPricingStrategy: getOverlappingDealsFromPricingStrategy,
        getOverlappingDealsFromPricingTable: getOverlappingDealsFromPricingTable,
        updateOverlappingDeals: updateOverlappingDeals,
        //getDealQuoteLetter: getDealQuoteLetter,

        getDefaultValuesForTenderKit: getDefaultValuesForTenderKit
    }

    return service;

    // #### CONTRACT CRUD ####
    function createTenderContract(custId, contractId, data) {        
        return dataService.post(apiBaseContractUrl + 'SaveTenderContract/' + custId + '/' + contractId, data);
    }
    function publishTenderDeals(contractId) {
        return dataService.post(apiBaseContractUrl + 'PublishTenderContract/' + contractId);
    }    
    function createContract(custId, contractId, ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/' + custId + '/' + contractId, [ct]);
    }
    function copyContract(custId, contractId, srcContractId, ct) {
        return dataService.post(apiBaseContractUrl + 'CopyContract/' + custId + '/' + contractId + '/' + srcContractId, [ct]);
    }
    function copyContractPivot(custId, contractId, srcContractId, ct) {
        return dataService.post(apiBaseContractUrl + 'CopyContractPivot/' + custId + '/' + contractId + '/' + srcContractId, [ct]);
    }
    function copyTenderFolioContract(ct, dealIds) {
        ct[0].dealIds = dealIds;
        return dataService.post(apiBaseContractUrl + 'CopyTenderFolioContract', ct);
    }
    function readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id);
    }
    function readCopyContract() {
        var queryParameters = $location.search();
        var id = queryParameters["copycid"]; // Property is case sensitive
        if (id === undefined) {
            return;
        }
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id);
    }
    function updateContract(custId, contractId, ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/' + custId + '/' + contractId, [ct]);
    }
    function deleteContract(custId, contractId) {
        return dataService.get(apiBaseContractUrl + 'DeleteContract/' + custId + '/' + contractId);
    }
    function isDuplicateContractTitle(dcId, title) {
        return dataService.get(apiBaseContractUrl + 'IsDuplicateContractTitle/' + dcId + '/' + title);
    }
    function getExportContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetExportContract/' + id);
    }

    // #### PRICING STRATEGY CRUD ####    
    function createPricingStrategy(custId, contractId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'SavePricingStrategy/' + custId + '/' + contractId, [ps]);
    }
    function copyPricingStrategy(custId, contractId, srcId, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'CopyPricingStrategy/' + custId + '/' + contractId + '/' + srcId, [ps]);
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
    function deletePricingStrategyById(custId, contractId, dcId) {
        return dataService.get(apiBasePricingStrategyUrl + 'DeletePricingStrategyById/' + custId + '/' + contractId + '/' + dcId);
    }
    function rollBackPricingStrategy(custId, contractId, dcId) {
        return dataService.get(apiBasePricingStrategyUrl + 'RollBackPricingStrategy/' + custId + '/' + contractId + '/' + dcId);
    }
    function cancelPricingStrategy(custId, contractId, contractCustAccpt, ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'CancelPricingStrategy/' + custId + '/' + contractId + '/' + contractCustAccpt, [ps]);
    }

    // #### PRICING TABLE CRUD ####

    function createPricingTable(custId, contractId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId, [pt]);
    }
    function copyPricingTable(custId, contractId, srcId, pt) {
        return dataService.post(apiBasePricingTableUrl + 'CopyPricingTable/' + custId + '/' + contractId + '/' + srcId, [pt]);
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
    function rollBackPricingTable(custId, contractId, dcId) {
        return dataService.get(apiBasePricingTableUrl + 'RollBackPricingTable/' + custId + '/' + contractId + '/' + dcId);
    }
    function cancelPricingTable(custId, contractId, contractCustAccpt, pt) {
        return dataService.post(apiBasePricingTableUrl + 'CancelPricingTable/' + custId + '/' + contractId + '/' + contractCustAccpt, [pt]);
    }

    // #### PRICING TABLE CRUD ####

    function readTender() {
        return dataService.get(apiBaseTenderUrl + 'GetTenderList');
    }
    function readTenderChildren(id) {
        return dataService.get(apiBaseTenderUrl + 'GetChildren/' + id);
    }
    function searchTender(st, en, searchText) {
        return dataService.get(apiBaseSearchUrl + "GetTenderDashboardList/" + st + "/" + en + "/" + searchText.replace(/\./g, '&per;'))
    }
    function bulkTenderUpdate(data) {
        return dataService.post(apiBaseTenderUrl + "BulkTenderUpdate", data);
    }
    function getTendersByIds(ids) {
        return dataService.get(apiBaseTenderUrl + "GetTendersByIds/" + ids)
    }


    // #### PRICING TABLE ROW ####
    function deletePricingTableRow(custId, contractId, ptrId) {
        return dataService.get(apiBasePricingTableUrl + 'DeletePricingTableRow/' + custId + '/' + contractId + '/' + ptrId);
    }
    function rollbackPricingTableRow(custId, contractId, dcId) {
        return dataService.get(apiBasePricingTableUrl + 'RollBackPricingTableRow/' + custId + '/' + contractId + '/' + dcId);
    }
    function unGroupPricingTableRow(custId, contractId, ptrId) {
        return dataService.get(apiBasePricingTableUrl + 'UnGroupPricingTableRow/' + custId + '/' + contractId + '/' + ptrId);
    }
    function getPath(id, opType) {
        return dataService.get(apiBasePricingTableUrl + 'getPath/' + id + '/' + opType);
    }
    function emailActions(data) {
        return dataService.post(apiBaseEmailUrl + 'ActionChanges', data);
    }


    // #### WIP DEAL ####
    function updateWipDeals(custId, contractId, wips) {
        return dataService.post(apiBasePricingTableUrl + 'UpdateWipDeals/' + custId + '/' + contractId, wips);
    }

    // #### CONTRACT CRUD ####

    function updateContractAndCurPricingTable(custId, contractId, data, forceValidation, forcePublish, delPtr) {
        if (!delPtr) delPtr = false;

        if (forceValidation && forcePublish) {
            return dataService.post(apiBaseContractUrl + "SaveAndValidateAndPublishContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        } else if (forceValidation) {
            return dataService.post(apiBaseContractUrl + "SaveAndValidateContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        } else {
            return dataService.post(apiBaseContractUrl + "SaveAndValidateAndPublishContractAndPricingTable/" + custId + '/' + contractId + '/' + delPtr, data);
        }
    }
    function updateContractAndCurPricingTableInBulk(data) {
        return dataService.post(apiBaseContractUrl + "SaveAndValidateAndPublishContractAndPricingTableInBulk", data);
    }
    function readContractStatus(id) {
        return dataService.get(apiBaseContractUrl + 'GetContractStatus/' + id);
    }
    function readWipFromContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetWipFromContract/' + id);
    }
    function readWipExclusionFromContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetWipExclusionFromContract/' + id);
    }
    function updateAtrbValue(custId, contractId, data) {
        return dataService.post(apiBaseContractUrl + "UpdateAtrbValue/" + custId + '/' + contractId, data);
    }


    function getWipDealsByPtr(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetWipDealsByPtr/' + id);
    }
    function getWipDealById(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetWipDeal/' + id);
    }
    function actionPricingStrategy(custId, contractId, contractCustAccpt, pt, actn) {
        return dataService.post(apiBasePricingStrategyUrl + 'ActionPricingStrategy/' + custId + '/' + contractId + '/' + contractCustAccpt + '/' + actn, [pt]);
    }
    function actionPricingStrategies(custId, contractId, contractCustAccpt, data) {
        return dataService.post(apiBasePricingStrategyUrl + 'ActionPricingStrategies/' + custId + '/' + contractId + '/' + contractCustAccpt, data);
    }

    function actionWipDeal(custId, contractId, wip, actn) {
        return dataService.post(apiBasePricingTableUrl + 'actionWipDeal/' + custId + '/' + contractId + '/' + actn, [wip]);
    }
    function actionWipDeals(custId, contractId, data) {
        return dataService.post(apiBasePricingTableUrl + 'actionWipDeals/' + custId + '/' + contractId, data);
    }

    function actionTenderDeals(tenders, actn) {
        return dataService.post(apiBaseTenderUrl + 'ActionTenders/' + actn, tenders);
    }


    function getPctDetails(dealId) {
        return dataService.get(apiBasePricingTableUrl + 'GetPctDetails/' + dealId);
    }
    function setPctOverride(data) {
        return dataService.post(apiBasePricingTableUrl + 'SetPctOverride', data);
    }
    function runPctContract(id) {
        return dataService.get(apiBaseCostTestUrl + 'RunPctContract/' + id);
    }
    function runBulkPctPricingStrategy(psIDS) {
        return dataService.post(apiBaseCostTestUrl + 'RunBulkPctPricingStrategy', psIDS);
    }

    // #### Overlapping CRUD operation ####

    function getOverlappingDealsFromContract(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetOverlappingDealsFromContract/' + id);
    }
    function getOverlappingDealsFromPricingStrategy(ids) {
        return dataService.get(apiBasePricingTableUrl + 'GetOverlappingDealsFromPricingStrategy/' + ids);
    }
    function getOverlappingDealsFromPricingTable(ids) {
        return dataService.get(apiBasePricingTableUrl + 'GetOverlappingDealsFromPricingTable/' + ids);
    }

    function updateOverlappingDeals(PRICING_TABLES_ID, YCS2_OVERLAP_OVERRIDE) {
        return dataService.post(apiBasePricingTableUrl + 'UpdateOverlappingDeals/' + YCS2_OVERLAP_OVERRIDE, PRICING_TABLES_ID);
    }

    // #### Quote Letter
    function getDealQuoteLetter(dealId) {
        return dataService.get(apiBaseQuoteLetterUrl + 'GetDealQuoteLetter/' + dealId);
    }

    // #### Get Default Values for KIT - TENDER
    function getDefaultValuesForTenderKit() {
        return dataService.get(dropDownApiUrl + 'GetTenderDefaultDropDown/');
    }

}