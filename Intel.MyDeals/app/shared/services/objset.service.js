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

        createPricingStrategy: createPricingStrategy,
        readPricingStrategy: readPricingStrategy,
        updatePricingStrategy: updatePricingStrategy,
        deletePricingStrategy: deletePricingStrategy,

        createPricingTable: createPricingTable,
        readPricingTable: readPricingTable,
        updatePricingTable: updatePricingTable,
        deletePricingTable: deletePricingTable,

        updateContractAndCurPricingTable: updateContractAndCurPricingTable
    }

    return service;


    // #### CONTRACT CRUD ####

    function createContract(custId, ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/' + custId, [ct]);
    }
    function readContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id);
    }
    function updateContract(custId, ct) {
        return dataService.post(apiBaseContractUrl + 'UpdateContract/' + custId, ct);
    }
    function deleteContract(id) {
        return dataService.get(apiBaseContractUrl + 'DeleteContract/' + id);
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
    function deletePricingStrategy(id) {
        return dataService.get(apiBasePricingStrategyUrl + 'DeletePricingStrategy/' + id);
    }


    // #### PRICING TABLE CRUD ####

    function createPricingTable(custId, ps) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/' + custId, [ps]);
    }
    function readPricingTable(id) {
        return dataService.get(apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id);
    }
    function updatePricingTable(custId, ps) {
        return dataService.post(apiBasePricingTableUrl + 'UpdatePricingTable/' + custId, [ps]);
    }
    function deletePricingTable(id) {
        return dataService.get(apiBasePricingTableUrl + 'DeletePricingTable/' + id);
    }


    // #### CONTRACT CRUD ####

    function updateContractAndCurPricingTable(custId, ct, pt, sData, gData, source) {
        // Contract is Contract + Pricing Strategies + Pricing Tables in heierarchial format
        // sData is the raw spreadsheet data
        // gData is the raw grid data

        var modCt = [];
        var modPs = [];
        var cnt = -1000;

        for (var c = 0; c < ct.length; c++) {
            var mCt = {};
            Object.keys(ct[c]).forEach(function (key, index) {
                if (key[0] !== '_' && key !== "Customer" && key !== "PRC_ST") mCt[key] = this[key];
            }, ct[c]);
            modCt.push(mCt);

            if (ct[c]["PRC_ST"] === undefined) ct[c]["PRC_ST"] = [];
            var item = ct[c]["PRC_ST"];
            for (var p = 0; p < item.length; p++) {
                var mPs = {};
                Object.keys(item[p]).forEach(function (key, index) {
                    if (key[0] !== '_' && key !== "PRC_TBL") mPs[key] = this[key];
                }, item[p]);
                modPs.push(mPs);
            }
        }

        if (pt.length > 0) {
            for (var s = 0; s < sData.length; s++) {
                if (sData[s].DC_ID === null) sData[s].DC_ID = cnt--;
                sData[s].DC_PARENT_ID = pt[0].DC_ID;
                sData[s].dc_type = "PRC_TBL_ROW";
                sData[s].dc_parent_type = pt[0].dc_type;
                sData[s].OBJ_SET_TYPE_CD = pt[0].OBJ_SET_TYPE_CD;
            }
        }

        var data = {
            "Contract": modCt,
            "PricingStrategy": modPs,
            "PricingTable": pt,
            "PricingTableRow": sData === undefined ? [] : sData,
            "WipDeals": gData === undefined ? [] : gData,
            "EventSource": source
        }

        //debugger;
        return dataService.post(apiBaseContractUrl + "SaveContractAndPricingTable/" + custId, data);
    }

}