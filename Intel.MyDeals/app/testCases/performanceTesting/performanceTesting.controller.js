(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('performanceTestingController', performanceTestingController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    performanceTestingController.$inject = ['$scope', 'performanceTestingService', 'productSelectorService', 'logger', 'objsetService', '$timeout'];

    function performanceTestingController($scope, performanceTestingService, productSelectorService, logger, objsetService, $timeout) {

        $scope.roles = ["FSE", "GA", "DA", "Finance", "Legal", "CBA", "ALL"];
        $scope.roleFilter = "ALL";

        $scope.testRunName = "Performance Testing";
        $scope.contractIds = "5693,5657";
        $scope.contracts = [];
        $scope.numThreads = 1;

        $scope.testingDone = false;
        $scope.testingStartTime = null;
        $scope.testingEndTime = null;
        $scope.testingLapseTime = 0;
        $scope.testingResults = [];

        $scope.bulkPrdTranslateData = [];
        $scope.bulkSaveData = [];

        $scope.threadMode = "natural";

        $scope.pageTitle = "Setup";
        $scope.pageDesc = "Let's start by defining exactly what kind of test you would like to perform.  Please fill in the details and click continue.";

        $scope.startDate = moment().format('MM/DD/YYYY');
        $scope.startDtObject = "";
        $scope.endDate = moment().add(3, 'M').format('MM/DD/YYYY');
        $scope.endDtObject = "";

        $scope.isThreaded = false;
        $scope.isMultipleCustomers = false;
        $scope.isMultipleUsers = false;
        $scope.populatingProducts = false;
        $scope.foundProduct = false;

        $scope.customers = [];
        $scope.users = [];
        $scope.defCustId = 498;

        $scope.errContracts = "";
        $scope.errDateRange = "";
        $scope.errCusts = "";
        $scope.errUsers = "";
        $scope.errThreads = "";
        $scope.errDefCust = "";

        $scope.cnt = 0;
        $scope.uid = -100;
        $scope.workingContracts = [];

        $scope.prdResultDict = {};
        $scope.saveResultDict = {};

        $scope.threadOption = {
            min: 0,
            max: 100,
            decimals: 0,
            format: "#"
        }

        $scope.showCustomers = function () {
            if ($scope.customers === undefined) return "";

            return $scope.customers.join(", ");
        }

        $scope.customersDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Customers/GetMyCustomersNameInfo",
                    dataType: "json"
                }
            }
        });

        $scope.selAllCust = function() {
            $scope.customers = [];
            var data = $scope.customersDataSource.data();
            for (var d = 0; d < data.length; d++) {
                $scope.customers.push(data[d].CUST_SID);
            }
        }

        $scope.applyRoleClass = function (item) {
            return $scope.roleFilter === item;
        }

        $scope.getFilter = function () {
            if ($scope.roleFilter === "ALL") {
                return {};
            } else {
                return {
                    field: "ROLE_NM",
                    operator: "eq",
                    value: $scope.roleFilter
                };
            }
        }

        $scope.selectRole = function (item) {
            $scope.roleFilter = item;
            $scope.usersDataSource.filter($scope.getFilter());
            $scope.usersDataSource.read();
        }

        $scope.usersDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "/api/Employees/GetUsrProfileRole",
                    dataType: "json"
                }
            },
            schema: {
                parse: function (data) {
                    // Example adding a new field to the received data
                    // that computes price as price times quantity.
                    $.each(data, function (idx, elem) {
                        elem.searchText = elem.LST_NM + ", " + elem.FRST_NM + " " + elem.EMAIL_ADDR;
                    });
                    return data;
                }
            },
            filter: $scope.getFilter()
        });

        $scope.selectUserOptions = {
            placeholder: "Select users...",
            dataTextField: "searchText",
            dataValueField: "searchText",
            itemTemplate: '<div class="tmpltItem">' +
                            '<div class="fl tmpltContract"><div class="tmpltPrimary">#: data.LST_NM #, #: data.FRST_NM #</div></div>' +
                            '<div class="fr tmpltRole">#: data.ROLE_NM #</div>' +
                            '<div class="clearboth"></div>' +
                            '</div>',
            valuePrimitive: false,
            filter: "contains",
            autoBind: false,
            tagMode: "single:",
            autoClose: false,
            dataSource: $scope.usersDataSource
        };
        $scope.selectedIds = [];


        $scope.gotoInit = function () {
            var hasErrors = false;

            $scope.prdResultDict = {};
            $scope.saveResultDict = {};
            $scope.workingContracts = [];
            $scope.contracts = [];
            $scope.errContracts = "";
            $scope.errDateRange = "";
            $scope.errCusts = "";
            $scope.errUsers = "";
            $scope.errThreads = "";
            $scope.pageTitle = "Initializing Contracts";
            $scope.pageDesc = "We are copying all of the contracts you have selected.  It might take a while based on the number of threads selected.";

            $scope.testingStartTime = new Date();
            $scope.testingDone = false;
            $scope.testingResults = [];

            var tmpContracts = $scope.contractIds.split(',');

            if ($scope.contractIds === "") {
                hasErrors = true;
                $scope.errContracts = "Please enter at least one Contract Id";
            } else {
                for (var i = 0; i < tmpContracts.length; i++) {
                    $scope.contracts.push({
                        id: parseInt(tmpContracts[i]),
                        status: "",
                        running: false
                    });
                    if (isNaN($scope.contracts[i].id) && $scope.errContracts.indexOf("Please enter a valid comma separated list of Contract Ids") < 0) {
                        hasErrors = true;
                        $scope.errContracts = "Please enter a valid comma separated list of Contract Ids";
                    }
                }
            }
            
            if ($scope.testRunName === "") {
                hasErrors = true;
                $scope.errTestRunName = "Please enter a name for this performance test";
            }

            if ($scope.startDate === "" || $scope.endDate === "") {
                hasErrors = true;
                $scope.errDateRange = "Please enter a valid date range";
            }

            if ($scope.numThreads === "" || $scope.numThreads < 1 || $scope.numThreads > 100) {
                hasErrors = true;
                $scope.errThreads = "Please enter a thread count between 1 and 100";
            }

            if ($scope.isMultipleCustomers && $scope.customers.length === 0) {
                hasErrors = true;
                $scope.errCusts = "Please enter at least one customer";
            }

            if ($scope.isMultipleUsers && $scope.users.length === 0) {
                hasErrors = true;
                $scope.errUsers = "Please enter at least one user";
            }

            if (hasErrors) return;

            $("#step2").addClass("complete");
            $(".container-step1").hide();
            $(".container-step2").show();

            // if here... start getting contract information

            $scope.cnt = 0;
            $scope.uid = -100;

            for (var t = 0; t < $scope.numThreads; t++) {
                var custId = $scope.defCustId;
                if ($scope.customers.length > 0) {
                    custId = $scope.customers[t % $scope.customers.length];
                }
                var sourceCntrctId = tmpContracts[t % tmpContracts.length];

                var item = {
                    id: $scope.uid,
                    status: "",
                    running: false,
                    data: {},
                    performanceGatheringPrd: {},
                    performanceGatheringSave: {}
                };
                $scope.workingContracts.push(item);

                $scope.copyContract(item, custId, sourceCntrctId, function () {
                    if ($scope.isAllDoneWithCopy()) $scope.gotoSave();
                });
            }
        }

        $scope.copyContract = function (context, custId, sourceCntrctId, callback) {
            context.status = "Copying Contract " + sourceCntrctId;
            context.running = true;
            context.startTime = new Date();

            var ct = {
                DC_ID: $scope.uid,
                DC_PARENT_ID: 0,
                OBJ_SET_TYPE_CD: "ALL_TYPES",
                TITLE: $scope.testRunName + '_' + $scope.cnt++ + '_' + moment().format("DD_MM_YYYY_HH_mm_ss"),
                CUST_MBR_SID: custId,
                START_DT: $scope.startDate,
                END_DT: $scope.endDate,
                WF_STG_CD: "",
                dc_parent_type: 0,
                dc_type: 1
            };

            objsetService.copyContractPivot(custId, $scope.uid, sourceCntrctId, ct).then(
                function (results) {
                    context.data = results.data[1];
                    context.cntrctId = context.data.DC_ID;
                    context.numPS = context.data.PRC_ST.length;
                    context.numPT = 0;
                    context.numPTR = 0;
                    for (var p = 0; p < context.data.PRC_ST.length; p++) {
                        context.data.PRC_ST[p].prdProgress = 0;
                        context.data.PRC_ST[p].saveProgress = 0;
                        context.data.PRC_ST[p].prdProgress = 0;
                        context.data.PRC_ST[p].maxProgress = 0;
                        if (context.data.PRC_ST[p].PRC_TBL !== undefined) {
                            var pt = context.data.PRC_ST[p].PRC_TBL;
                            context.numPT += pt.length;
                            context.data.PRC_ST[p].maxProgress += pt.length;

                            for (var r = 0; r < pt.length; r++) {
                                if (context.data.PRC_ST[p].PRC_TBL[r].PRC_TBL_ROW !== undefined) {
                                    context.numPTR += context.data.PRC_ST[p].PRC_TBL[r].PRC_TBL_ROW.length;
                                }
                            }
                        }
                    }

                    var deltaMs = (new Date()).getTime() - context.startTime.getTime();
                    context.status = "Done in " + deltaMs / 1000 + "s";
                    context.running = false;
                    callback();
                },
                function (data) {
                    context.status = "FAILED TO COPY";
                    context.running = false;
                });

            $scope.uid--;

        }

        $scope.isAllDoneWithCopy = function() {
            for (var i = 0; i < $scope.workingContracts.length; i++) {
                if ($scope.workingContracts[i].running) return false;
            }
            return true;
        }

        $scope.isAllDoneWithTest = function () {
            for (var i = 0; i < $scope.workingContracts.length; i++) {
                if ($scope.workingContracts[i].running) return false;
                var pss = $scope.workingContracts[i].data.PRC_ST;
                for (var s = 0; s < pss.length; s++) {
                    if (pss[s].prdRunning) return false;
                    if (pss[s].saveRunning) return false;
                }
            }

            $scope.testingEndTime = new Date();
            $scope.testingLapseTime = ($scope.testingEndTime.getTime() - $scope.testingStartTime.getTime()) / 1000;
            $scope.testingDone = true;

            op.notifySuccess("Test Run is Complete", "Done");
            return true;
        }

        $scope.validateAllProdAndSave = function() {
            var rNum = 1;
            $scope.prdResultDict = {};
            $scope.saveResultDict = {};

            // build prod validation packets
            for (var c = 0; c < $scope.workingContracts.length; c++) {
                var contract = $scope.workingContracts[c];
                var pss = contract.data.PRC_ST;
                contract.prdPackets = [];

                for (var p = 0; p < pss.length; p++) {
                    pss[p].prdRunning = true;
                    pss[p].saveRunning = true;
                    var pts = pss[p].PRC_TBL;
                    for (var t = 0; t < pts.length; t++) {
                        var dealType = pts[t].OBJ_SET_TYPE_CD;
                        var ptrs = pts[t].PRC_TBL_ROW;
                        var packet = [];

                        for (var r = 0; r < ptrs.length; r++) {
                            ptrs[r].ROW_NUMBER = rNum;
                            packet.push({
                                dealType: dealType,
                                psId: pss[p].DC_ID,
                                ptId: pts[t].DC_ID,
                                CUST_MBR_SID: ptrs[r].CUST_MBR_SID,
                                END_DATE: ptrs[r].END_DT,
                                EXCLUDE: false,
                                FILTER: ptrs[r].PROD_INCLDS,
                                GEO_COMBINED: ptrs[r].GEO_COMBINED,
                                PROGRAM_PAYMENT: ptrs[r].PROGRAM_PAYMENT,
                                ROW_NUMBER: rNum++,
                                START_DATE: ptrs[r].START_DT,
                                SendToTranslation: true,
                                USR_INPUT: ptrs[r].PTR_USER_PRD
                            });
                        }

                        contract.prdPackets.push(packet);
                    }
                }
            }

            $scope.bulkPrdTranslateData = [];

            // need to make this threaded and serial
            for (var i = 0; i < $scope.workingContracts.length; i++) {
                var contractPacket = $scope.workingContracts[i];
                for (var d = 0; d < contractPacket.prdPackets.length; d++) {
                    var savePacket = contractPacket.prdPackets[d];

                    if ($scope.threadMode === "emulate") {
                        $scope.prdResultDict[contractPacket.cntrctId + "_" + savePacket[0].psId + "_" + savePacket[0].ptId] = new perfCacheBlock("Product Validation", "MT");

                        $scope.bulkPrdTranslateData.push({
                            usrData: savePacket,
                            CUST_MBR_SID: savePacket[0].CUST_MBR_SID, 
                            IS_TENDER: savePacket[0].IS_TENDER, 
                            DEAL_TYPE: savePacket[0].dealType,
                            contractId: contractPacket.cntrctId,
                            pricingStrategyId: savePacket[0].psId,
                            pricingTableId: savePacket[0].ptId
                        });
                    } else {
                        $scope.prdResultDict[contractPacket.cntrctId + "_" + savePacket[0].psId + "_" + savePacket[0].ptId] = new perfCacheBlock("Product Validation", "MT");

                        productSelectorService.TranslateProductsWithMapping(savePacket, savePacket[0].CUST_MBR_SID, savePacket[0].dealType, contractPacket.cntrctId, contractPacket.IS_TENDER, savePacket[0].psId, savePacket[0].ptId)
                            .then(function (response) {
                                $scope.processTranslatedResult(response);
                            }, function (response) {
                                debugger;
                            });
                    }
                }
            }

            if ($scope.bulkPrdTranslateData.length > 0) {
                productSelectorService.TranslateProductsWithMappingInBulk($scope.bulkPrdTranslateData)
                    .then(function (response) {
                        $scope.processTranslatedResultBulk(response);
                    }, function (response) {
                        debugger;
                    });

            }
        }

        $scope.processTranslatedResult = function(response) {
            var perfTimes = response.data.PerformanceTimes;
            var prdRunTime = 0;
            for (var r = 0; r < perfTimes.length; r++) {
                prdRunTime += perfTimes[r].ExecutionTime;
            }

            // TODO check for invalid products or errored products


            var cId = response.data.ContractId;
            var psId = response.data.PricingStrategyId;
            var ptId = response.data.PricingTableId;
            $scope.prdResultDict[cId + "_" + psId + "_" + ptId].addPerfTimes(perfTimes);
            $scope.prdResultDict[cId + "_" + psId + "_" + ptId].stop();

            for (var c = 0; c < $scope.workingContracts.length; c++) {
                if ($scope.workingContracts[c].cntrctId === cId) {
                    var pss = $scope.workingContracts[c].data.PRC_ST;
                    for (var p = 0; p < pss.length; p++) {
                        if (pss[p].DC_ID === psId) {
                            pss[p].prdProgress++;
                            pss[p].prdRunTime = "in " + (prdRunTime / 1000).toFixed(3) + "s";
                            if (pss[p].prdProgress === pss[p].maxProgress) pss[p].prdRunning = false;

                            for (var t = 0; t < pss[p].PRC_TBL.length; t++) {
                                if (pss[p].PRC_TBL[t].DC_ID === ptId) {

                                    // set the PTR_SYS_PRD value
                                    var ptrs = pss[p].PRC_TBL[t].PRC_TBL_ROW;
                                    for (var row = 0; row < ptrs.length; row++) {
                                        var key = ptrs[row].ROW_NUMBER;
                                        ptrs[row].PTR_SYS_PRD = !!response.data.Data.ValidProducts[key] ? JSON.stringify(response.data.Data.ValidProducts[key]) : "";
                                    }

                                    var ptData = $scope.buildPtData(pss[p].PRC_TBL[t]);
                                    $scope.saveResultDict[$scope.workingContracts[c].cntrctId + "_" + pss[p].DC_ID + "_" + pss[p].PRC_TBL[t].DC_ID] = new perfCacheBlock("Save & Validation", "MT");
                                    objsetService.updateContractAndCurPricingTable($scope.workingContracts[c].data.CUST_MBR_SID, cId, ptData, true, true, false).then(
                                        function (results) {
                                            var savePerfTimes = results.data.PerformanceTimes;
                                            var saveRunTime = 0;
                                            for (var r = 0; r < savePerfTimes.length; r++) {
                                                saveRunTime += savePerfTimes[r].ExecutionTime;
                                            }

                                            $scope.saveResultDict[cId + "_" + psId + "_" + ptId].addPerfTimes(savePerfTimes);
                                            $scope.saveResultDict[cId + "_" + psId + "_" + ptId].stop();

                                            for (var sc = 0; sc < $scope.workingContracts.length; sc++) {
                                                if ($scope.workingContracts[sc].cntrctId === cId) {
                                                    var pss = $scope.workingContracts[sc].data.PRC_ST;
                                                    for (var p = 0; p < pss.length; p++) {
                                                        if (pss[p].DC_ID === psId) {
                                                            pss[p].saveProgress++;
                                                            pss[p].saveRunTime = "in " + (saveRunTime / 1000).toFixed(3) + "s";
                                                            if (pss[p].saveProgress === pss[p].maxProgress) pss[p].saveRunning = false;
                                                        }
                                                    }
                                                }
                                            }

                                            // CHECK FOR FULL COMPLETION
                                            $scope.isAllDoneWithTest();
                                        },
                                        function (response) {
                                            debugger;
                                        }
                                    );
                                }
                            }

                        }
                    }
                }
            }
        }

        $scope.processTranslatedResultBulk = function (response) {

            $scope.bulkSaveData = [];

            for (var d = 0; d < response.data.length; d++) {
                var data = response.data[d];

                var perfTimes = data.PerformanceTimes;
                var prdRunTime = 0;
                for (var r = 0; r < perfTimes.length; r++) {
                    prdRunTime += perfTimes[r].ExecutionTime;
                }

                // TODO check for invalid products or errored products


                var cId = data.ContractId;
                var psId = data.PricingStrategyId;
                var ptId = data.PricingTableId;
                $scope.prdResultDict[cId + "_" + psId + "_" + ptId].addPerfTimes(perfTimes);
                $scope.prdResultDict[cId + "_" + psId + "_" + ptId].stop();

                for (var c = 0; c < $scope.workingContracts.length; c++) {
                    if ($scope.workingContracts[c].cntrctId === cId) {
                        var pss = $scope.workingContracts[c].data.PRC_ST;
                        for (var p = 0; p < pss.length; p++) {
                            if (pss[p].DC_ID === psId) {
                                pss[p].prdProgress++;
                                pss[p].prdRunTime = "in " + (prdRunTime / 1000).toFixed(3) + "s";
                                if (pss[p].prdProgress === pss[p].maxProgress) pss[p].prdRunning = false;

                                for (var t = 0; t < pss[p].PRC_TBL.length; t++) {
                                    if (pss[p].PRC_TBL[t].DC_ID === ptId) {

                                        // set the PTR_SYS_PRD value
                                        var ptrs = pss[p].PRC_TBL[t].PRC_TBL_ROW;
                                        for (var row = 0; row < ptrs.length; row++) {
                                            var key = ptrs[row].ROW_NUMBER;
                                            ptrs[row].PTR_SYS_PRD = !!data.Data.ValidProducts[key] ? JSON.stringify(data.Data.ValidProducts[key]) : "";
                                        }

                                        var ptData = $scope.buildPtData(pss[p].PRC_TBL[t]);
                                        $scope.saveResultDict[$scope.workingContracts[c].cntrctId + "_" + pss[p].DC_ID + "_" + pss[p].PRC_TBL[t].DC_ID] = new perfCacheBlock("Save & Validation", "MT");

                                        $scope.bulkSaveData.push({
                                            custId: $scope.workingContracts[c].data.CUST_MBR_SID,
                                            contractId: cId,
                                            psId: pss[p].DC_ID,
                                            ptId: pss[p].PRC_TBL[t].DC_ID,
                                            contractAndPricingTable: ptData
                                        });

                                    }
                                }

                            }
                        }
                    }
                }
            }

            if ($scope.bulkSaveData.length > 0) {
                objsetService.updateContractAndCurPricingTableInBulk($scope.bulkSaveData, true, true, false).then(
                    function (results) {
                        for (var d = 0; d < results.data.length; d++) {
                            var data = results.data[d];

                            var savePerfTimes = data.PerformanceTimes;
                            var saveRunTime = 0;
                            for (var r = 0; r < savePerfTimes.length; r++) {
                                saveRunTime += savePerfTimes[r].ExecutionTime;
                            }

                            $scope.saveResultDict[data.cId + "_" + data.psId + "_" + data.ptId].addPerfTimes(savePerfTimes);
                            $scope.saveResultDict[data.cId + "_" + data.psId + "_" + data.ptId].stop();

                            for (var sc = 0; sc < $scope.workingContracts.length; sc++) {
                                if ($scope.workingContracts[sc].cntrctId === data.cId) {
                                    var pss = $scope.workingContracts[sc].data.PRC_ST;
                                    for (var p = 0; p < pss.length; p++) {
                                        if (pss[p].DC_ID === data.psId) {
                                            pss[p].saveProgress++;
                                            pss[p].saveRunTime = "in " + (saveRunTime / 1000).toFixed(3) + "s";
                                            if (pss[p].saveProgress === pss[p].maxProgress) pss[p].saveRunning = false;
                                        }
                                    }
                                }
                            }

                        }

                        // CHECK FOR FULL COMPLETION
                        $scope.isAllDoneWithTest();
                    },
                    function (response) {
                        debugger;
                    }
                );
            }




        }

        $scope.buildPtData = function (pt) {
            var ptAtrbs = ["REBATE_TYPE", "TITLE", "PAYOUT_BASED_ON", "OBJ_SET_TYPE_CD", "MRKT_SEG", "PROGRAM_PAYMENT", "GEO_COMBINED", "PROD_INCLDS", "OVERLAP_RESULT", "SYS_COMMENTS", "IN_REDEAL", "COMP_MISSING_FLG", "PS_WF_STG_CD", "MEETCOMP_TEST_RESULT", "COST_TEST_RESULT", "PASSED_VALIDATION", "HAS_L1", "HAS_L2", "HAS_TRACKER", "OBJ_PATH_HASH", "CAP_MISSING_FLG", "DC_ID", "DC_PARENT_ID", "dc_type", "dc_parent_type"];
            var ptrs = [];
            var savePt = {};

            for (var a = 0; a < ptAtrbs.length; a++) {
                if (pt[ptAtrbs[a]] !== undefined) savePt[ptAtrbs[a]] = pt[ptAtrbs[a]];
            }

            for (var p = 0; p < pt.PRC_TBL_ROW.length; p++) {
                ptrs.push(util.deepClone(pt.PRC_TBL_ROW[p]));
            }

            return {
                "Contract": [],
                "PricingStrategy": [],
                "PricingTable": [savePt],
                "PricingTableRow": ptrs,
                "WipDeals": [],
                "EventSource": "PRC_TBL",
                "Errors": {}
            };
        }

        $scope.gotoSave = function () {
            $("#step3").addClass("complete");
            $scope.pageTitle = "Save & Validate";
            $scope.pageDesc = "Now we are validating and saving the Products and Pricing Tables.";

            $scope.validateAllProdAndSave();
            //$(".container-step2").hide();
            //$(".container-step3").show();
        }

        $scope.gotoResults = function () {
            $("#step4").addClass("complete");
            $scope.pageTitle = "Results";
            $scope.pageDesc = "Below are the testing results broken down to the Pricing Table level by <b>Product Validate</b> and <b>Validate & Save</b>.";

            $scope.testingResults = [];

            var cId = 0;
            var psId = 0;
            var ptId = 0;

            for (var c = 0; c < $scope.workingContracts.length; c++) {
                cId = $scope.workingContracts[c].cntrctId;
                var pss = $scope.workingContracts[c].data.PRC_ST;
                for (var p = 0; p < pss.length; p++) {
                    psId = pss[p].DC_ID;
                    var pts = pss[p].PRC_TBL;
                    for (var t = 0; t < pts.length; t++) {
                        ptId = pts[t].DC_ID;
                        $scope.testingResults.push({
                            cId: cId,
                            psId: psId,
                            ptId: ptId,
                            prdResult: $scope.prdResultDict[cId + "_" + psId + "_" + ptId],
                            saveResult: $scope.saveResultDict[cId + "_" + psId + "_" + ptId]
                        });
                    }
                }
            }

            // second pass... delayed and threaded to give time for the controls to render
            $timeout(function () {
                for (var r = 0; r < $scope.testingResults.length; r++) {
                    var item = $scope.testingResults[r];
                    var key = "_" + item.cId + "_" + item.psId + "_" + item.ptId;
                    $scope.testingResults[r].prdResult.drawChart("perfChart_prd" + key, "perfMs_prd" + key, "perfLegend_prd" + key);
                    $scope.testingResults[r].saveResult.drawChart("perfChart_save" + key, "perfMs_save" + key, "perfLegend_save" + key);
                }
            }, 500);

            $(".container-step2").hide();
            $(".container-step3").hide();
            $(".container-step4").show();
        }

        $scope.gotoSetup = function () {
            $scope.pageTitle = "Setup";
            $scope.pageDesc = "Let's start by defining exactly what kind of test you would like to perform.  Please fill in the details and click continue.";

            $scope.testingDone = false;
            $scope.testingStartTime = null;
            $scope.testingEndTime = null;
            $scope.testingLapseTime = 0;
            $scope.testingResults = [];

            $("#step2").removeClass("complete");
            $("#step3").removeClass("complete");
            $("#step4").removeClass("complete");
            $(".container-step1").show();
            $(".container-step2").hide();
            $(".container-step3").hide();
            $(".container-step4").hide();
        }






        // Check for product cache
        performanceTestingService.getFirstProduct().then(
            function (results) {
                $scope.populatingProducts = false;
                $scope.foundProduct = true;
            },
            function (data) {
                $scope.populatingProducts = false;
                $scope.foundProduct = true;
            });

        $timeout(function () {
            if (!$scope.foundProduct) {
                $scope.populatingProducts = true;
            }
        }, 2000);

    };
})();

