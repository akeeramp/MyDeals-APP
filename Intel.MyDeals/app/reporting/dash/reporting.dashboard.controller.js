(function () {
    'use strict';

    angular
        .module('app.reporting')
        .controller('ReportingDashboardController', ReportingDashboardController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    ReportingDashboardController.$inject = ['$scope', 'reportingService','$linq'];

    function ReportingDashboardController($scope, reportingService, $linq) {
        var vm = this;
        vm.reportLogView = true;
        vm.numberOfRecrods = 10;
        vm.masterData = '';
        vm.loadMoreRecords;
        vm.btnText = 'Show more ';
        vm.isRecordAvailable = false;
        //Creating Color Code Dictionary
        vm.colorNameDict = {
            'Search Report Deal': 'ng-fluscnt',
            'Approved After Start Date': 'ng-teal',
            'Sheet Report': 'ng-green',
            'Search Report Details': 'ng-yellow',
            'Query Studio': 'ng-red',
            'others': 'ng-blue'
        };
        vm.colorCodeDict = {
            'Search Report Deal': '#C4D600',
            'Approved After Start Date': '#288DAB',
            'Sheet Report': '#2BA703',
            'Search Report Details': '#F9CC04',
            'Query Studio': '#DD4B39',
            'others': '#00C0EF'
        };
        var getColor = function (RPT_NM, mode) {
            if (vm.colorNameDict.hasOwnProperty(RPT_NM)) {
                // Remove item
                if (mode === 'chart') {
                    return vm.colorCodeDict[RPT_NM];
                }
                else {
                    return vm.colorNameDict[RPT_NM];
                }                
            }
            else {
                if (mode === 'chart') {
                    return vm.colorCodeDict['others'];
                }
                else {
                    return vm.colorNameDict['others'];
                }
            }
        }
        var loadReportDashboard = function (e) {
            reportingService.getReportData()
                .then(function (response) {

                    if (response.data["ReportLogDeatils"].length > 0) { 
                        vm.isRecordAvailable = true;
                    }

                    vm.masterData = response.data;
                    vm.totalDealCount = 0;
                    vm.dealCountTooltip = '';
                    vm.productUsed = vm.masterData["ReportDealType"][0] ? vm.masterData["ReportDealType"][0].Product_Count : 0;
                    vm.cutomerServiced = vm.masterData["ReportDealType"][0] ? vm.masterData["ReportDealType"][0].Distinct_Customer : 0;
                    vm.totalDollarAmount = 0;
                    vm.searchDealTime = 0;
                    vm.searchDetailsTime = 0;
                    vm.queryStudioTime = 0;
                    vm.dealSheetTime = 0;
                    vm.dealApprovedTime = 0;

                    //Only RA will have access to Unified Customer Management Report
                    if (window.usrRole != 'RA') {
                        vm.masterData["ReportName"] = response.data.ReportName.filter(x => x.RPT_UNIQ_NM != "Unified Customer Management Report");
                    }


                    //Report Name Group
                    vm.getReportCatagory = $linq.Enumerable().From(vm.masterData["ReportName"])
                        .GroupBy(function (x) {
                            return (x.CTGR_NM);
                        })
                        .Select(function (x) {
                            return { 'CTGR_NM': x.source[0].CTGR_NM };
                        })
                        .ToArray();
                    //Report SUb Catagory
                    vm.getReportSubCatagory = $linq.Enumerable().From(vm.masterData["ReportName"])
                        .GroupBy(function (x) {
                            return (x.SUB_CTGR_NM);
                        })
                        .Select(function (x) {
                            return {
                                'SUB_CTGR_NM': x.source[0].SUB_CTGR_NM,
                                'CTGR_NM': x.source[0].CTGR_NM
                            };
                        })
                        .ToArray();
                    
                    vm.totalReportTime = vm.masterData["ReportSummary"][0] ? vm.masterData["ReportSummary"][0].SUM_AMOUNT : 0;
                    if (vm.masterData["ReportDealType"].length > 0) {
                        for (var cnt = 0; cnt < vm.masterData["ReportDealType"].length; cnt++) {
                            if (vm.masterData["ReportDealType"][cnt].DEAL_TYPE == 'PROGRAM') {
                                vm.totalDollarAmount = vm.masterData["ReportDealType"][cnt].Total_Dollar_Amount;
                            }
                            vm.totalDealCount += vm.masterData["ReportDealType"][cnt].Deal_Count;
                            vm.dealCountTooltip += vm.masterData["ReportDealType"][cnt].DEAL_TYPE + ": " + vm.masterData["ReportDealType"][cnt].Deal_Count + " ";
                            if (vm.masterData["ReportDealType"][cnt].DEAL_TYPE === 'ECAP') {
                                vm.masterData["ReportDealType"][cnt].COLOR = 'yellow';
                            }
                            else if (vm.masterData["ReportDealType"][cnt].DEAL_TYPE === 'VOL_TIER') {
                                vm.masterData["ReportDealType"][cnt].COLOR = 'green';
                            }
                            else if (vm.masterData["ReportDealType"][cnt].DEAL_TYPE === 'FLEX') {
                                vm.masterData["ReportDealType"][cnt].COLOR = 'blue';
                            }
                            else if (vm.masterData["ReportDealType"][cnt].DEAL_TYPE === 'KIT') {
                                vm.masterData["ReportDealType"][cnt].COLOR = 'red';
                            }
                            else {
                                vm.masterData["ReportDealType"][cnt].COLOR = 'aqua';
                            }
                        }

                    }
                    if (vm.masterData["ReportDashboardData"].length > 0) {
                        for (var cnt = 0; cnt < vm.masterData["ReportDashboardData"].length; cnt++) {
                            vm.masterData["ReportDashboardData"][cnt].COLOR_CD = getColor(vm.masterData["ReportDashboardData"][cnt].RPT_NM, 'widget');

                        }
                    }
                    vm.chartDataBAR = [];
                    vm.reportCounterPie = [];
                    //Getting Report Name
                    if (vm.masterData["ReportLogDeatils"].length > 0) {
                        var getReportGroup = $linq.Enumerable().From(vm.masterData["ReportLogDeatils"])
                            .GroupBy(function (x) {
                                return (x.RPT_ALS_NM);
                            })
                            .Select(function (x) {
                                return { 'RPT_ALS_NM': x.source[0].RPT_ALS_NM };
                            })
                            .ToArray();

                        for (var rpt_name_cnt = 0; rpt_name_cnt < getReportGroup.length; rpt_name_cnt++) {
                            var dataPoint = $linq.Enumerable().From(vm.masterData["ReportLogDeatils"])
                                .Where(function (x) { return x.RPT_ALS_NM == getReportGroup[rpt_name_cnt].RPT_ALS_NM })
                                .OrderByDescending(function (x) { return x.TOTAL_REPORT_TIME_TAKEN })
                                .Select(function (x) {
                                    return { 'TOTAL_REPORT_TIME_TAKEN': x.TOTAL_REPORT_TIME_TAKEN };
                                })
                                .ToArray();
                            var dataPtr = [];
                            for (var cntt = 0; cntt < dataPoint.length && cntt < 10; cntt++) {
                                dataPtr.push(dataPoint[cntt]["TOTAL_REPORT_TIME_TAKEN"]);
                            }
                            //Determine color
                            var COLOR_CD = getColor(getReportGroup[rpt_name_cnt].RPT_ALS_NM, 'chart');
                            var data = { name: getReportGroup[rpt_name_cnt].RPT_ALS_NM, data: dataPtr, color: COLOR_CD };
                            vm.chartDataBAR.push(data);
                        }


                        for (var countBar = 0; countBar < vm.masterData["ReportDashboardData"].length; countBar++) {
                            var CLR_CD = getColor(vm.masterData["ReportDashboardData"][countBar].RPT_NM, 'chart');
                            var data = { category: vm.masterData["ReportDashboardData"][countBar].RPT_NM, value: (vm.masterData["ReportDashboardData"][countBar].TOTAL_TIME * 100 / vm.masterData["ReportDashboardData"][countBar].TOTAL_REPORT_TIME).toFixed(2), color: CLR_CD };
                            vm.reportCounterPie.push(data);
                        }
                        vm.reportCounterTotal = [];
                        vm.totalReportCount = 0;
                        vm.sumMaxCounter = 0;
                        vm.sumMinCounter = 0;
                        for (var rptTolCounter = 0; rptTolCounter < vm.masterData["ReportDashboardData"].length; rptTolCounter++) {
                            vm.totalReportCount += vm.masterData["ReportDashboardData"][rptTolCounter].RPT_COUNT;
                        }
                        for (var counterDonut = 0; counterDonut < vm.masterData["ReportDashboardData"].length; counterDonut++) {
                            var COLR_CD = getColor(vm.masterData["ReportDashboardData"][counterDonut].RPT_NM, 'chart');
                            var dataTotalCount = { category: vm.masterData["ReportDashboardData"][counterDonut].RPT_NM, value: (vm.masterData["ReportDashboardData"][counterDonut].RPT_COUNT * 100 / vm.totalReportCount).toFixed(2), color: COLR_CD };

                            vm.reportCounterTotal.push(dataTotalCount);
                        }

                        //Drawing Chart
                        createChart(vm.chartDataBAR, vm.reportCounterPie, vm.reportCounterTotal);
                    }
                }, function (response) {
                    logger.error("Unable to get Report Data.", response, response.statusText);
                });
        }

        loadReportDashboard();
        $scope.showFilter = function (atrb_list) {
            var filterObject = {};
            vm.filterResult = JSON.parse(atrb_list);
            for (var x in vm.filterResult) {
                var r = vm.filterResult[x];
                for (var obj in vm.filterResult[x]) {
                    var o = obj;

                }
            }
        }
        $scope.showAll = function (recordCnt) {
            if (recordCnt == 10 && vm.masterData['ReportLogDeatils'].length > 10) {
                vm.btnText = 'Show less ';
                vm.numberOfRecrods = vm.masterData['ReportLogDeatils'].length;
            }
            else {
                vm.btnText = 'Show more ';
                vm.numberOfRecrods = 10;
            }

        }     
        
    }
})();