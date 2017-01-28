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

        updateContractAndCurStrategy: updateContractAndCurStrategy
    }

    return service;


    // #### CONTRACT CRUD ####

    function createContract(ct) {
        return dataService.post(apiBaseContractUrl + 'SaveContract/', [ct]);
    }
    function readContract(id) {
        return dataService.get(apiBaseContractUrl + 'GetUpperContract/' + id);
    }
    function updateContract(ct) {
        return dataService.post(apiBaseContractUrl + 'UpdateContract/', ct);
    }
    function deleteContract(id) {
        return dataService.get(apiBaseContractUrl + 'DeleteContract/' + id);
    }


    // #### PRICING STRATEGY CRUD ####

    function createPricingStrategy(ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'SavePricingStrategy/', [ps]);
    }
    function readPricingStrategy(id) {
        return dataService.get(apiBasePricingStrategyUrl + 'GetContract/' + id);
    }
    function updatePricingStrategy(ps) {
        return dataService.post(apiBasePricingStrategyUrl + 'UpdateContract/', [ps]);
    }
    function deletePricingStrategy(id) {
        return dataService.get(apiBasePricingStrategyUrl + 'DeleteContract/' + id);
    }


    // #### PRICING TABLE CRUD ####

    function createPricingTable(ps) {
        return dataService.post(apiBasePricingTableUrl + 'SavePricingTable/', [ps]);
    }
    function readPricingTable(id) {
        // TODO finallize service call.  this is still in progress so for now still using the hard codded structure
        return dataService.get(apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id);

        // TODO won't need this after real call to DB return neg to pos ids
        // fake a new table        
        if (id < 110) {
            return {
                "PricingTable": [],
                "WipDeals": []
            };
        }

        return {
            "PricingTable": [
                {
                    "dc_id": 1,
                    "TEXT": "Hello World 1",
                    "_MultiDim": [
                        {
                            "dc_id": -300,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "DATE": "2/1/2016",
                            "INT": 1231,
                            "data": "Deal Type",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "validMsg": {}
                            }
                        },
                        {
                            "dc_id": -301,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "data": "Deal Type",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "validMsg": {}
                            }
                        },
                        {
                            "dc_id": -302,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "data": "Deal Type",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "validMsg": {}
                            }
                        }
                    ],
                    "_pivot": {
                        "_MultiDim": {
                            "Kit": "-1",
                            "Primary": "0",
                            "Secondary 1": "1",
                            "Secondary 2": "2"
                        }
                    },
                    "_behaviors": {
                        "isRequired": {},
                        "isReadOnly": {},
                        "isHidden": {},
                        "isSaved": {},
                        "isError": {},
                        "validMsg": {
                            "TEXT": "That did not work"
                        }
                    },
                    "_defaultAtrbs": {
                        "TEXT": {
                            "value": "We are the World",
                            "label": "TEXT: ",
                            "type": "TEXTBOX",
                            "isRequired": false
                        },
                        "INT": {
                            "value": 2001,
                            "label": "INT: ",
                            "type": "NUMERIC",
                            "isRequired": false
                        }
                    }

                }
            ],
            "WipDeals": [
                {
                    "dc_id": 1,
                    "TEXT": "Hello World 1",
                    "INT": 123,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "DROPDOWN 3",
                    "COMBOBOX": "COMBOBOX 5",
                    "_MultiDim": [
                        {
                            "dc_id": -300,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "DROPDOWN 3",
                            "COMBOBOX": "COMBOBOX 5",
                            "_behaviors": {
                                "isRequired": {},
                                "isReadOnly": {},
                                "isHidden": {},
                                "isSaved": {},
                                "isError": {},
                                "validMsg": {
                                    "TEXT": "That did not work"
                                }
                            }
                        },
                        {
                            "dc_id": -301,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "OPTION2",
                            "COMBOBOX": "COMBOBOX 2"
                        },
                        {
                            "dc_id": -302,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "OPTION3",
                            "COMBOBOX": "COMBOBOX 3"
                        }
                    ],
                    "_pivot": {
                        "_MultiDim": {
                            "Kit": "-1",
                            "Primary": "0",
                            "Secondary 1": "1",
                            "Secondary 2": "2"
                        }
                    },
                    "_behaviors": {
                        "isRequired": {},
                        "isReadOnly": {},
                        "isHidden": {},
                        "isSaved": {},
                        "isError": {},
                        "validMsg": {
                            "TEXT": "That did not work"
                        }
                    }
                },
                {
                    "dc_id": 2,
                    "TEXT": "Hello World 2",
                    "INT": 124,
                    "DATE": "2/4/2016",
                    "DROPDOWN": "DROPDOWN 2",
                    "COMBOBOX": "COMBOBOX 3",
                    "_MultiDim": [
                        {
                            "dc_id": -304,
                            "PIVOT": -1,
                            "TITLE": "Kit",
                            "TEXT": "Hello World 1",
                            "INT": 1231,
                            "DATE": "2/1/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 3"
                        },
                        {
                            "dc_id": -305,
                            "PIVOT": 0,
                            "TITLE": "Primary",
                            "TEXT": "Hello World 2",
                            "INT": 1232,
                            "DATE": "2/2/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 3"
                        },
                        {
                            "dc_id": -306,
                            "PIVOT": 1,
                            "TITLE": "Secondary 1",
                            "TEXT": "Hello World 3",
                            "INT": 1233,
                            "DATE": "2/3/2016",
                            "DROPDOWN": "DROPDOWN 2",
                            "COMBOBOX": "COMBOBOX 3"
                        }
                    ],
                    "_pivot": {
                        "_MultiDim": {
                            "Kit": "-1",
                            "Primary": "0",
                            "Secondary 1": "1",
                            "Secondary 2": "2"
                        }
                    },
                    "_behaviors": {
                        "isRequired": {},
                        "isReadOnly": {},
                        "isHidden": {},
                        "isSaved": {},
                        "isError": {},
                        "validMsg": {
                            "TEXT": "That did not work"
                        }
                    }
                }
            ]
        };
    }
    function updatePricingTable(ps) {
        return dataService.post(apiBasePricingTableUrl + 'UpdateContract/', [ps]);
    }
    function deletePricingTable(id) {
        return dataService.get(apiBasePricingTableUrl + 'DeletePricingTable/' + id);
    }


    // #### CONTRACT CRUD ####

    function updateContractAndCurStrategy(ct, pt, sData, gData, source) {
        // Contract is Contract + Pricing Strategies + Pricing Tables (Single dim only) in heierarchial format
        // sData is the raw spreadsheet data
        // gData is the raw grid data

        // combine single dim current pt (pricing table) with 2 dim (sData) data
        if (pt.length > 0) pt["_MultiDim"] = sData;

        var data = {
            "Contract": ct,
            "PricingTable": pt,
            "WipDeals": gData === undefined ? [] : gData,
            "EventSource": source
        }

        return dataService.post(apiBaseContractUrl + "SaveContractAndStrategy", data);
    }

}