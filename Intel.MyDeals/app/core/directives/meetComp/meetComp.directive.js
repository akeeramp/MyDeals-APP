(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('meetComp', meetComp);

    meetComp.$inject = ['$compile', '$filter', 'dataService', 'securityService', '$timeout', 'logger', '$linq', '$uibModal'];

    function meetComp($compile, $filter, dataService, securityService, $timeout, logger, $linq, $uibModal) {
        kendo.culture("en-US");

        return {
            scope: {
                objSid: '=',
                isAdhoc: '=',
                objTypeId: '=',
                lastMeetCompRun: '=',
                pageNm: '@',
            },
            restrict: 'AE',
            transclude: true,
            templateUrl: '/app/core/directives/meetComp/meetComp.directive.html',
            controller: ['$scope', 'dataService', function ($scope, dataService) {

                // TODO: Configure security mask, these all workflow stage sec setting, we need to define one more deal sec 'CAN_OVERRIDE_MEET_COMP'
                var hideViewMeetCompResult = window.usrRole === "FSE";  //|| !$scope.root.CAN_VIEW_MEET_COMP;
                var hideViewMeetCompOverride = !(window.usrRole === "DA" || window.usrRole === "Legal"); //|| !$scope.root.CAN_VIEW_MEET_COMP;
                var canUpdateMeetCompSKUPriceBench = (usrRole === "FSE" || usrRole === "GA");
                
                var columnIndex = {
                    COMP_SKU: 7,
                    COMP_PRC: 7,
                    IA_BNCH: 9,
                    COMP_BNCH: 9,
                    COMP_OVRRD_FLG: 13,
                    COMP_OVRRD_RSN: 13
                };

                $scope.isVisible = true;
                $scope.isDataAvaialable = false;
                $scope.errorList = [];
                $scope.validationMessage = "";
                $scope.setUpdateFlag = false;
                $scope.runIfStaleByHours = 3;
                $scope.MC_MODE = "D";
                $scope.PAGE_NM = $scope.pageNm;
                
                $scope.meetCompMasterdata = [];

                $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
                    $timeout(function () {
                        var newState = msg != undefined && msg !== "";
                        isShowFunFact = true; // Always show fun fact
                        // if no change in state, simple update the text
                        if ($scope.isBusy === newState) {
                            $scope.isBusyMsgTitle = msg;
                            $scope.isBusyMsgDetail = !detail ? "" : detail;
                            $scope.isBusyType = msgType;
                            $scope.isBusyShowFunFact = isShowFunFact;
                            return;
                        }

                        $scope.isBusy = newState;
                        if ($scope.isBusy) {
                            $scope.isBusyMsgTitle = msg;
                            $scope.isBusyMsgDetail = !detail ? "" : detail;
                            $scope.isBusyType = msgType;
                            $scope.isBusyShowFunFact = isShowFunFact;
                        } else {
                            $timeout(function () {
                                $scope.isBusyMsgTitle = msg;
                                $scope.isBusyMsgDetail = !detail ? "" : detail;
                                $scope.isBusyType = msgType;
                                $scope.isBusyShowFunFact = isShowFunFact;
                            }, 100);
                        }
                    });
                }

                $scope.lastMeetCompRunCalc = function () {
                    var LAST_MEET_COMP_RUN = $scope.isAdhoc === 0 ? $scope.$parent.contractData.LAST_COST_TEST_RUN : $scope.lastMeetCompRun;
                    if (!!LAST_MEET_COMP_RUN) {
                        var localTime = gridUtils.convertLocalToPST(new Date());
                        var lastruntime = moment(LAST_MEET_COMP_RUN);
                        if (typeof $scope.$parent.forceRun != 'undefined') {
                            var forceRun = $scope.$parent.forceRun();
                        }
                        else {
                            var forceRun = true;
                        }                        

                        var serverMeetCompPSTTime = lastruntime.format("MM/DD/YY HH:mm:ss");

                        var timeDiff = moment.duration(moment(serverMeetCompPSTTime).diff(moment(localTime)));
                        var hh = Math.abs(timeDiff.asHours());
                        var mm = Math.abs(timeDiff.asMinutes());
                        var ss = Math.abs(timeDiff.asSeconds());
                        var zone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
                        $scope.lastMetCompRunLocalTime = moment(new Date()).subtract(-timeDiff).format("MM/DD/YYYY hh:mm A z") + "(" + zone + ")"; //lastruntime.format("MM/DD/YY HH:mm:ss");

                        var dsplNum = hh;
                        var dsplMsg = " hours ago";
                        $scope.needToRunPct = forceRun || ($scope.runIfStaleByHours > 0 && dsplNum >= $scope.runIfStaleByHours) ? true : false;

                        if (dsplNum < 1) {
                            dsplNum = mm;
                            dsplMsg = " mins ago";
                            if (!forceRun) $scope.needToRunPct = false;
                        }
                        if (dsplNum < 1) {
                            dsplNum = ss;
                            dsplMsg = " secs ago";
                            if (!forceRun) $scope.needToRunPct = false;
                        }

                        if ($scope.needToRunPct) {
                            $scope.MC_MODE = "A";
                            $scope.IsMeetCompRun = true;
                        } else {
                            $scope.IsMeetCompRun = false;
                        }

                    } else {
                        $scope.MC_MODE = "A";
                        $scope.IsMeetCompRun = true;
                    }

                    if (Math.round(dsplNum) > 0) {
                        return "Meet Comp Last Run: " + Math.round(dsplNum) + dsplMsg;
                    }
                    else {
                        return "";
                    }
                    
                }

                if (!!$scope.objSid) {
                    $scope.loading = true;
                    $scope.selectedCust = '';
                    $scope.selectedCustomerText = '';
                    $scope.curentRow = '';
                    $scope.setBusy("Meet Comp...", "Please wait we are fetching Meet Comp Data...");
                    
                    $scope.$parent.IsFirstLoad = true;
                    $scope.IsMeetCompRun = false;
                    $scope.lastMeetCompRunCalc();
                   
                    dataService.get("api/MeetComp/GetMeetCompProductDetails/" + $scope.objSid + "/" + $scope.MC_MODE + "/" + $scope.objTypeId).then(function (response) {
                        if (typeof $scope.$parent.setIsBusyFalse != 'undefined') {
                            $scope.$parent.setIsBusyFalse();
                        }
                        if (response.data.length == 0 && $scope.isAdhoc == 1) {
                            kendo.alert("Meet comp is not applicable for the Products selected in the Tender Table editor");
                            $scope.isBusy = false;                            
                            $scope.$parent.inCompleteDueToCapMissing(true);
                            if (typeof $scope.$parent.setMcTag != 'undefined') {
                                $scope.$parent.setMcTag(false);
                            }
                            if (typeof $scope.$parent.goToPublished != 'undefined') {
                                $scope.$parent.goToPublished();
                            }                           
                        }

                        if ($scope.isAdhoc == 0) {
                            $scope.$parent.refreshContractData();      
                        }                                                             
                        
                        if (response.data.length > 0) {
                            if (typeof $scope.$parent.setMcTag != 'undefined') {
                                $scope.$parent.setMcTag(false);
                            }                            
                            //Calculate InComplete due to CAP Missing
                            var isTrueOnce = false;
                            var inCompleteDueToCAPMissing = function (data) {
                                var isCapSet = true;
                                for(var i = 0; i < data.length; i++){
                                    if (data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet") {
                                        if (data[i].COMP_SKU.trim().length == 0 && data[i].COMP_PRC == 0 && ((data[i].PRD_CAT_NM.toLowerCase() == "svrws" && data[i].IA_BNCH == 0 && data[i].COMP_BNCH == 0) || data[i].PRD_CAT_NM.toLowerCase() != "svrws")) {
                                            $scope.$parent.inCompleteDueToCapMissing(false);
                                            isTrueOnce = false;
                                            return false;
                                        }
                                        else if (!isTrueOnce) {
                                            $scope.$parent.inCompleteDueToCapMissing(true);                                            
                                            isTrueOnce = true;
                                        }
                                    }
                                }
                                return true;
                            }

                            if ($scope.isAdhoc == 1 && typeof $scope.$parent.inCompleteDueToCapMissing != 'undefined') {
                                var isCapMissed = inCompleteDueToCAPMissing(response.data);
                                if (isCapMissed && typeof $scope.$parent.goToPublished != 'undefined') {
                                    $scope.$parent.goToPublished();
                                }               
                            }                           

                            response.data.forEach(function (obj) {
                                if ($scope.isAdhoc == 1) {
                                    $scope.$parent.resetDirty();
                                }
                                
                                obj.IS_SELECTED = false;

                                //Setting COMP_PRC to null. Its nullable Int
                                if (obj.COMP_PRC == 0) {
                                    obj.COMP_PRC = null;
                                }

                                //Setting IA_BNCH to null. Its nullable Int
                                if (obj.IA_BNCH == 0) {
                                    obj.IA_BNCH = null;
                                }

                                //Setting COMP_BNCH to null. Its nullable Int
                                if (obj.COMP_BNCH == 0) {
                                    obj.COMP_BNCH = null;
                                }

                            });

                            $scope.meetCompMasterdata = response.data;
                            $scope.meetCompUnchangedData = angular.copy(response.data);
                            $scope.meetCompUpdatedList = [];
                            $scope.isDataAvaialable = true;
                            $scope.isBusy = false;
                            $scope.selectedIDS = [];

                            var setFocusToCell = function (colName, selUID) {
                                var row = $("#grid").find("tr[data-uid='" + selUID + "']");
                                var cell = $(row).children().eq(columnIndex[colName]);
                                $('#grid').data('kendoGrid').editCell(cell);
                            }

                            var getProductLineData = function () {
                                var filterData = [];
                                var dataSource = $("#grid").data("kendoGrid").dataSource;
                                var filters = dataSource.filter();
                                if (filters) {
                                    var allData = dataSource.data();
                                    var query = new kendo.data.Query(allData);
                                    filterData = query.filter(filters).data;
                                }
                                else {
                                    filterData = $scope.meetCompMasterdata;
                                }
                                //UPDATE Selected Product ROWS
                                var selectedData = $linq.Enumerable().From(filterData)
                                    .Where(function (x) {
                                        return (x.IS_SELECTED == true);
                                    })
                                    .ToArray();
                                return selectedData;
                            }


                            var isModelValid = function (data) {
                                $scope.errorList = [];
                                for (var i = 0; i < data.length; i++) {
                                    var isError = false;
                                    var errorObj = {
                                        'COMP_SKU': false,
                                        'COMP_PRC': false,
                                        'COMP_BNCH': false,
                                        'IA_BNCH': false,
                                        'COMP_OVRRD_FLG': false,
                                        'COMP_OVRRD_RSN': false,
                                        'RW_NM': ""
                                    };

                                    //COMP_SKU Checking.....
                                    var isCompSkuZero = false;
                                    // per DE36513 removed this check... but left it here in case the request comes back
                                    //if (!isNaN(Math.abs(data[i].COMP_SKU))) {
                                    //    isCompSkuZero = true;
                                    //}

                                    if (isCompSkuZero && canUpdateMeetCompSKUPriceBench && data[i].MEET_COMP_STS.toLowerCase() != "na") {
                                        errorObj.COMP_SKU = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    if (data[i].COMP_SKU.trim().length == 0 && canUpdateMeetCompSKUPriceBench && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                                        errorObj.COMP_SKU = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    //COMP_PRC checking.....
                                    if (data[i].COMP_PRC <= 0 && canUpdateMeetCompSKUPriceBench && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                                        errorObj.COMP_PRC = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    //COMP_BNCH checking....
                                    if (data[i].COMP_BNCH <= 0 && data[i].PRD_CAT_NM.toLowerCase() == "svrws" && (usrRole === "GA") && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                                        errorObj.COMP_BNCH = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    //IA_BNCH checking....
                                    if (data[i].IA_BNCH <= 0 && data[i].PRD_CAT_NM.toLowerCase() == "svrws" && (usrRole === "GA") && (data[i].MEET_COMP_STS.toLowerCase() == "fail" || data[i].MEET_COMP_STS.toLowerCase() == "incomplete" || data[i].MEET_COMP_STS.toLowerCase() == "not run yet")) {
                                        errorObj.IA_BNCH = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    //COMP_OVRRD_FLG checking....
                                    if (data[i].COMP_OVRRD_FLG <= 0 && (usrRole == "DA")) {
                                        errorObj.COMP_OVRRD_FLG = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    //COMP_OVRRD_RSN checking....
                                    if (data[i].COMP_OVRRD_RSN <= 0 && (usrRole == "DA")) {
                                        errorObj.COMP_OVRRD_RSN = true;
                                        errorObj.RW_NM = data[i].RW_NM;
                                        isError = true;
                                    }

                                    if (isError)
                                        $scope.errorList.push(errorObj);
                                }

                                if ($scope.errorList.length > 0)
                                    return false;
                                else
                                    return true;
                            }

                            var expandSelected = function (colName, rowNumber) {
                                $scope.isVisible = false;
                                var grid = $("#grid").data("kendoGrid");
                                var row_NO = [];
                                var selectedUID = [];

                                var expanded = $.map(grid.tbody.children(":has(> .k-hierarchy-cell .k-i-collapse)"), function (row) {
                                    return $(row).data("uid");
                                });

                                for (var t = 0; t < expanded.length; t++) {
                                    $scope.dataSourceParent._view.forEach(function (o) {
                                        if (o.uid == expanded[t])
                                            row_NO.push(o.RW_NM);
                                    });
                                }

                                $scope.dataSourceParent.read();

                                if (row_NO.length > 0) {
                                    for (var t = 0; t < row_NO.length; t++) {
                                        $scope.dataSourceParent._view.forEach(function (o) {
                                            if (o.RW_NM == row_NO[t])
                                                selectedUID.push(o.uid);
                                        });
                                    }

                                    for (var cnt = 0; cnt < selectedUID.length; cnt++) {
                                        grid.expandRow("tr[data-uid='" + selectedUID[cnt] + "']");
                                    }

                                    if (colName) {
                                        var selUID = '';
                                        if (rowNumber) {
                                            $scope.dataSourceParent._view.forEach(function (o) {
                                                if (o.RW_NM == rowNumber)
                                                    selUID = o.uid
                                            });

                                        }
                                        else {
                                            selUID = selectedUID[0];
                                        }
                                        setFocusToCell(colName, selUID);
                                    }
                                }
                                else {
                                    var selUID = '';
                                    if (rowNumber) {
                                        $scope.dataSourceParent._view.forEach(function (o) {
                                            if (o.RW_NM == rowNumber)
                                                selUID = o.uid
                                        });
                                        setFocusToCell(colName, selUID);
                                    }
                                }
                                $scope.isVisible = true;
                            }

                            var isValid = false;
                            if (usrRole == "GA") {
                                isValid = isModelValid($scope.meetCompMasterdata);
                            }

                            $scope.selectProdIDS = function (selectedID, event, dataItem) {
                                var dataSource = $("#grid").data("kendoGrid").dataSource;
                                var filters = dataSource.filter();

                                if (filters) {
                                    //UPDATE Selected Filter ROWS
                                    var allData = dataSource.data();
                                    var query = new kendo.data.Query(allData);
                                    var filterData = query.filter(filters).data;

                                    if (selectedID == 'all') {
                                        if (event.target.checked) {
                                            for (var i = 0; i < filterData.length; i++) {
                                                if (filterData[i].MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                                                    $scope.meetCompMasterdata[filterData[i].RW_NM - 1].IS_SELECTED = true;
                                                }
                                            }
                                        }
                                        else {
                                            for (var i = 0; i < filterData.length; i++) {
                                                if (filterData[i].MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                                                    $scope.meetCompMasterdata[filterData[i].RW_NM - 1].IS_SELECTED = false;
                                                }
                                            }
                                        }


                                    }
                                    else {
                                        $scope.meetCompMasterdata[selectedID - 1].IS_SELECTED = event.target.checked;
                                    }
                                }
                                else {
                                    if (selectedID == 'all') {
                                        if (event.target.checked) {
                                            $scope.meetCompMasterdata.forEach(function (obj) {
                                                if (obj.MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                                                    obj.IS_SELECTED = true;
                                                }

                                            });
                                        }
                                        else {
                                            $scope.meetCompMasterdata.forEach(function (obj) {
                                                if (obj.MEET_COMP_UPD_FLG.toLowerCase() != 'n') {
                                                    obj.IS_SELECTED = false;
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        $scope.meetCompMasterdata[selectedID - 1].IS_SELECTED = event.target.checked;
                                    }
                                }
                                //Holding expanded column
                                if (selectedID == 'all') {
                                    expandSelected();
                                }
                            }

                            var addToUpdateList = function (dataItem, FIELD_NM) {
                                var indx = -1;
                                $scope.meetCompUpdatedList.some(function (e, i) {
                                    if (e.RW_NM == dataItem.RW_NM) {
                                        indx = i;
                                        return true;
                                    }
                                });

                                if (indx > -1) {
                                    $scope.meetCompUpdatedList.splice(indx, 1);
                                }

                                $scope.meetCompUpdatedList.push(dataItem);
                                $scope.setUpdateFlag = true;

                            }

                            //Add New Customer
                            $scope.addSKUForCustomer = function (mode, isSelected) {
                                if ($scope.selectedCustomerText.trim().length > 0) {
                                    $scope.meetCompMasterdata[$scope.curentRow - 1].COMP_SKU = $scope.selectedCustomerText;

                                    if (mode == "0" || mode == 0) {
                                        $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = $scope.selectedCust;
                                    }
                                    else {
                                        $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = 1;
                                    }

                                    addToUpdateList($scope.meetCompMasterdata[$scope.curentRow - 1], "COMP_SKU");
                                    var isUpdated = false;
                                    //Update child
                                    if ($scope.meetCompMasterdata[$scope.curentRow - 1].GRP == "PRD") {
                                        var selData = [];
                                        if (isSelected) {
                                            selData = getProductLineData();
                                        }
                                        if (selData.length > 0) {
                                            isUpdated = true;
                                            for (var cntData = 0; selData.length > cntData; cntData++) {
                                                var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                //Updating Product Line
                                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                                                    $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_SKU = $scope.selectedCustomerText;
                                                    addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_SKU");
                                                }

                                                //Updating Deal line
                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                    })
                                                    .ToArray();

                                                for (var i = 0; i < tempData.length; i++) {
                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_SKU = $scope.selectedCustomerText;
                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_SKU");
                                                }
                                            }
                                        }
                                        else {
                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                .Where(function (x) {
                                                    return (
                                                        x.GRP_PRD_SID == $scope.meetCompMasterdata[$scope.curentRow - 1].GRP_PRD_SID &&
                                                        x.GRP == "DEAL" &&
                                                        x.MC_NULL == true &&
                                                        x.MEET_COMP_UPD_FLG == "Y");
                                                })
                                                .ToArray();

                                            for (var i = 0; i < tempData.length; i++) {
                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_SKU = $scope.selectedCustomerText;
                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_SKU");
                                            }
                                            if (tempData.length > 0) {
                                                isUpdated = true;
                                            }
                                        }

                                        if (isUpdated) {
                                            expandSelected("COMP_SKU", $scope.curentRow);
                                        }
                                    }
                                }
                            };

                            $scope.dataSourceParent = new kendo.data.DataSource({
                                transport: {
                                    read: function (e) {
                                        e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                            .Where(function (x) {
                                                return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                                            })
                                            .OrderBy(function (x) { return x.MEET_COMP_STS }).ToArray());
                                    },
                                    create: function (e) {
                                    }
                                },
                                pageSize: 10,
                                batch: true,
                                schema: {
                                    model: {
                                        id: "RW_NM",
                                        fields: {
                                            DEAL_OBJ_SID: {
                                                editable: false, nullable: true
                                            },
                                            RW_NM: { validation: { required: true }, type: "string" },
                                            CAP: { editable: true, validation: { required: true }, type: "number" },
                                            COMP_OVRRD_FLG: { validation: { required: true } },
                                            GRP: { validation: { required: true } },
                                            COMP_OVRRD_RSN: { editable: true, validation: { required: false } },
                                            CUST_NM_SID: { editable: false, validation: { required: true } },
                                            DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                            GRP_PRD_NM: { editable: false, validation: { required: true } },
                                            GRP_PRD_SID: { editable: false, validation: { required: true } },
                                            IA_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                            COMP_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                            MC_LAST_RUN: { editable: false, validation: { required: true } },
                                            COMP_PRC: { editable: true, validation: { required: true }, type: "number" },
                                            COMP_SKU: { editable: true, validation: { required: false }, type: "string" },
                                            MEET_COMP_UPD_FLG: { editable: true, validation: { required: true } },
                                            OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                            PRD_CAT_NM: { editable: false, validation: { required: true } },
                                            MC_AVG_RPU: { editable: true, validation: { required: true } },
                                            MC_NULL: { editable: false, validation: { required: true } },
                                            MEET_COMP_STS: { editable: true, validation: { required: true } },
                                            CNTRCT_OBJ_SID: { editable: false, validation: { required: true } },
                                            PRC_ST_OBJ_SID: { editable: false, validation: { required: true } },
                                            PRC_TBL_OBJ_SID: { editable: false, validation: { required: true } },
                                            WF_STG_CD: { editable: false, validation: { required: true } },
                                            END_CUST_RETAIL: { editable: false, validation: { required: true } },
                                            "_behaviors": { type: "object" }
                                        }
                                    }
                                }
                            });

                            $scope.gridOptions = {
                                dataSource: $scope.dataSourceParent,
                                filterable: true,
                                scrollable: true,
                                sortable: true,
                                navigatable: true,
                                resizable: false,
                                reorderable: true,
                                columnMenu: false,
                                groupable: false,
                                sort: function (e) { gridUtils.cancelChanges(e); },
                                filter: function (e) { gridUtils.cancelChanges(e); },
                                editable: true,
                                pageable: {
                                    refresh: true,
                                    pageSizes: [10, 25, 50, 100],
                                    buttonCount: 5
                                },
                                detailTemplate: "<div class='childGrid' kendo-grid k-options='detailInit(dataItem)'></div>",
                                edit: function (e) {
                                    var input = e.container.find(".k-input");
                                    var value = input.val();
                                    var editedROW = e.model;
                                    var isEdited = true;
                                    if (usrRole == "DA" && editedROW.MEET_COMP_UPD_FLG == "Y" && (editedROW.MEET_COMP_STS.toLowerCase() == "pass" || editedROW.MEET_COMP_STS.toLowerCase() == "overridden")) {
                                        $('input[name=COMP_OVRRD_RSN]').parent().html(e.model.COMP_OVRRD_RSN);
                                    }
                                    else if (editedROW.MEET_COMP_UPD_FLG == "N") {
                                        $('input[name=COMP_OVRRD_RSN]').parent().html(e.model.COMP_OVRRD_RSN);
                                    }
                                    else {
                                        input.keyup(function () {
                                            value = input.val();
                                        });

                                        $("[name='COMP_OVRRD_RSN']", e.container).blur(function () {
                                            var input = $(this);
                                            //alert(value);
                                            editedROW.COMP_OVRRD_RSN = value;

                                            $scope.meetCompMasterdata[editedROW.RW_NM - 1].COMP_OVRRD_RSN = value.trim();
                                            editedROW.COMP_OVRRD_RSN = value.trim();
                                            addToUpdateList(editedROW, "COMP_OVRRD_RSN");
                                            var isUpdated = false;
                                            if (editedROW.GRP == "PRD") {
                                                var selData = [];
                                                if (editedROW.IS_SELECTED) {
                                                    selData = getProductLineData();
                                                }
                                                if (selData.length > 0) {
                                                    isUpdated = true;
                                                    for (var cntData = 0; selData.length > cntData; cntData++) {
                                                        var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                        //Updating Product Line
                                                        if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && (selData[cntData].MEET_COMP_STS.toLowerCase() == "fail" || selData[cntData].MEET_COMP_STS.toLowerCase() == "incomplete")) {
                                                            $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_OVRRD_RSN = editedROW.COMP_OVRRD_RSN;
                                                            addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_OVRRD_RSN");
                                                        }

                                                        //Updating Deal line
                                                        var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                            .Where(function (x) {
                                                                return (
                                                                    x.GRP_PRD_SID == temp_grp_prd &&
                                                                    x.GRP == "DEAL" &&
                                                                    x.MEET_COMP_UPD_FLG == "Y" &&
                                                                    x.MEET_COMP_STS.toLowerCase() != "pass"
                                                                );
                                                            })
                                                            .ToArray();

                                                        for (var i = 0; i < tempData.length; i++) {
                                                            if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_RSN = editedROW.COMP_OVRRD_RSN;
                                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_RSN");
                                                            }
                                                        }
                                                    }
                                                }
                                                else {
                                                    var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                        .Where(function (x) {
                                                            return (
                                                                x.GRP_PRD_SID == editedROW.GRP_PRD_SID &&
                                                                x.GRP == "DEAL" &&
                                                                x.MEET_COMP_UPD_FLG == "Y" &&
                                                                x.MEET_COMP_STS.toLowerCase() != "pass"
                                                            );
                                                        })
                                                        .ToArray();

                                                    for (var i = 0; i < tempData.length; i++) {
                                                        if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                                                            $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_RSN = editedROW.COMP_OVRRD_RSN;
                                                            addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_RSN");
                                                        }
                                                    }
                                                    if (tempData.length > 0) {
                                                        isUpdated = true;
                                                    }
                                                }

                                                //Retaining the same expand
                                                if (isUpdated) {
                                                    expandSelected("COMP_OVRRD_RSN", editedROW.RW_NM);
                                                }
                                            }
                                        });
                                    }

                                },
                                dataBound: function (e) {
                                    if ($scope.isAdhoc == 1) {
                                        this.expandRow(this.tbody.find("tr.k-master-row"));
                                    }                                  
                                    
                                    if ($scope.errorList.length > 0) {
                                        //// get the index of the UnitsInStock cell
                                        var columns = e.sender.columns;
                                        var columnCOMP_SKU = this.wrapper.find(".k-grid-header [data-field=" + "COMP_SKU" + "]").index();
                                        var columnCOMP_PRC = this.wrapper.find(".k-grid-header [data-field=" + "COMP_PRC" + "]").index();
                                        var columnCOMP_BNCH = this.wrapper.find(".k-grid-header [data-field=" + "COMP_BNCH" + "]").index();
                                        var columnIA_BNCH = this.wrapper.find(".k-grid-header [data-field=" + "IA_BNCH" + "]").index();
                                        var columnCOMP_OVRRD_FLG = this.wrapper.find(".k-grid-header [data-field=" + "COMP_OVRRD_FLG" + "]").index();
                                        var columnCOMP_OVRRD_RSN = this.wrapper.find(".k-grid-header [data-field=" + "COMP_OVRRD_RSN" + "]").index();

                                        // iterate the data items and apply row styles where necessary
                                        var dataItems = e.sender.dataSource.view();
                                        for (var j = 0; j < dataItems.length; j++) {
                                            var TEMP_RW_NM = dataItems[j].get("RW_NM");
                                            var indx = -1;
                                            $scope.errorList.some(function (e, i) {
                                                if (e.RW_NM == TEMP_RW_NM) {
                                                    indx = i;
                                                    return true;
                                                }
                                            });
                                            if (indx > -1) {
                                                if ($scope.errorList[indx].COMP_SKU) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnCOMP_SKU);
                                                    cell.addClass("errorItemList");
                                                }
                                                if ($scope.errorList[indx].COMP_PRC) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnCOMP_PRC);
                                                    cell.addClass("errorItemList");
                                                }
                                                if ($scope.errorList[indx].COMP_BNCH) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnCOMP_BNCH);
                                                    cell.addClass("errorItemList");
                                                }
                                                if ($scope.errorList[indx].IA_BNCH) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnIA_BNCH);
                                                    cell.addClass("errorItemList");
                                                }
                                                if ($scope.errorList[indx].COMP_OVRRD_FLG) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnCOMP_OVRRD_FLG);
                                                    cell.addClass("errorItemList");
                                                }
                                                if ($scope.errorList[indx].COMP_OVRRD_RSN) {
                                                    var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                    row.addClass("errorListRow");
                                                    var cell = row.children().eq(columnCOMP_OVRRD_RSN);
                                                    cell.addClass("errorItemList");
                                                }


                                            }

                                        }
                                    }

                                },
                                columns: [
                                    {
                                        field: "",
                                        width: "50px",
                                        headerTemplate: "<div class='dealTools' style='margin-left: -15px !important;'><input type='checkbox' class='grid-link-checkbox with-font' id='lnkChk_header' ng-click='selectProdIDS(\"all\", $event)' /> <label for='lnkChk_header' style='margin: 5px 0 0 0;' title='Check to apply changes to all rows checked'></label></div>",
                                        //template: "<div class='dealTools'><input type='checkbox' ng-model='dataItem.IS_SELECTED' class='grid-link-checkbox with-font' id='lnkChk_{{#=RW_NM#}}' ng-click='selectProdIDS(#=RW_NM#, $event, dataItem)' /> <label for='lnkChk_{{#=RW_NM#}}' style='margin: 5px 0 0 0;' title='Check to apply changes to all rows checked'></label></div>"
                                        template: "#if(MEET_COMP_UPD_FLG.toLowerCase() == 'n'){## ##} else {#<div class='dealTools'><input type='checkbox' ng-model='dataItem.IS_SELECTED' class='grid-link-checkbox with-font' id='lnkChk_{{#=RW_NM#}}' ng-click='selectProdIDS(#=RW_NM#, $event, dataItem)' /> <label for='lnkChk_{{#=RW_NM#}}' style='margin: 5px 0 0 0;' title='Check to apply changes to all rows checked'></label></div>#}#"
                                    },
                                    {
                                        field: "PRD_CAT_NM",
                                        title: "Vertical",
                                        width: 80,
                                        template: "<div class='readOnlyCell' title='#=PRD_CAT_NM#'>#=PRD_CAT_NM#</div>",
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; }
                                    },
                                    {
                                        field: "GRP_PRD_NM",
                                        title: "Product",
                                        width: 120,
                                        template: "<div class='readOnlyCell' title='#=GRP_PRD_NM#'>#=GRP_PRD_NM#</div>",
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; }
                                    },
                                    {
                                        field: "DEAL_OBJ_SID",
                                        title: "Deals",
                                        template: "<div class='readOnlyCell' title='#=DEAL_OBJ_SID#'>#=DEAL_OBJ_SID#</div>",
                                        width: 150,
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; }
                                    },
                                    {
                                        field: "END_CUST_RETAIL",
                                        title: "End Customer/Retail",
                                        width: 170,
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; },
                                        template: "<div title='End Customer' class='readOnlyCell'></div>"
                                    },
                                    {
                                        field: "COMP_SKU",
                                        title: "Meet Comp SKU",
                                        width: 170,
                                        template: "<div class='#if(usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#=COMP_SKU#</div>",
                                        filterable: { multi: true, search: true },
                                        editor: meetCompSKUEditor
                                    },
                                    {
                                        field: "COMP_PRC",
                                        title: "Meet Comp Price",
                                        width: 150,
                                        format: "{0:c}",
                                        template: "<div class='#if(usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#if(COMP_PRC == 0 || COMP_PRC == null){## ##} else {#$#:COMP_PRC##}#</div>",
                                        filterable: { multi: true, search: true },
                                        editor: meetCompPriceEditor
                                    },
                                    {
                                        field: "CAP",
                                        title: "CAP",
                                        width: 120,
                                        editable: function () { return false; },
                                        filterable: { multi: true, search: true },
                                        template: "<div title='#=CAP#' class='readOnlyCell'>#if(CAP == 0){## ##} else {#$#:CAP##}#</div>"
                                    },
                                    {
                                        field: "IA_BNCH",
                                        title: "IA Bench",
                                        width: 120,
                                        template: "<div class='#if(PRD_CAT_NM.toLowerCase() != 'svrws' || usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#if(IA_BNCH == 0 || IA_BNCH == null ){## ##} else {##:IA_BNCH##}#</div>",
                                        filterable: { multi: true, search: true },
                                        editor: editorIABench
                                    },
                                    {
                                        field: "COMP_BNCH",
                                        title: "Comp Bench",
                                        width: 120,
                                        template: "<div class='#if(PRD_CAT_NM.toLowerCase() != 'svrws' || usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#if(COMP_BNCH == 0 || COMP_BNCH == null ){## ##} else {##:COMP_BNCH##}#</div>",
                                        filterable: { multi: true, search: true },
                                        editor: editorCOMPBench
                                    },
                                    {
                                        field: "MEET_COMP_STS",
                                        title: "Test Results",
                                        width: 120,
                                        template: "#if(MEET_COMP_STS.toLowerCase() == 'overridden') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-passed-completed-solid complete' title='Passed with Override Status' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'pass') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-passed-completed-solid completeGreen' title='Passed' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'incomplete') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-help-solid incomplete' title='InComplete' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'fail'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-alert-solid errorIcon' title='Error/Failed' style='font-size:20px !important'></i></div>#}else if(MEET_COMP_STS.toLowerCase() == 'not run yet'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-help-outlined notRunYetIcon' title='Not run yet' style='font-size:20px !important'></i></div>#}else if(MEET_COMP_STS.toLowerCase() == 'na'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-information-solid notApplicableIcon' title='NA' style='font-size:20px !important'></i></div>#}#",
                                        editable: function () { return false; },
                                        hidden: hideViewMeetCompResult,
                                        filterable: { multi: true, search: true }
                                    },
                                    {
                                        field: "MC_AVG_RPU",
                                        title: "Avg. Net Price",
                                        width: 150,
                                        editable: function () { return false; },
                                        filterable: { multi: true, search: true },
                                        template: "<div title='#=MEET_COMP_FRMULA#' class='readOnlyCell'>#=MC_AVG_RPU#</div>",
                                    },
                                    {
                                        field: "COMP_OVRRD_FLG",
                                        title: "Analysis Override",
                                        width: 150,
                                        editor: meetCompResultStatusEditor,
                                        template: "<div class='#if(MEET_COMP_STS.toLowerCase() == 'pass' || ( MEET_COMP_STS.toLowerCase() == 'overridden' && COMP_OVRRD_FLG.toLowerCase() == 'yes')){#readOnlyCell#} else {## ##}#'>#=COMP_OVRRD_FLG#</div>",
                                        filterable: { multi: true, search: true },
                                        hidden: hideViewMeetCompOverride
                                    },
                                    {
                                        field: "COMP_OVRRD_RSN",
                                        title: "Analysis Override Comments",
                                        width: 220,
                                        filterable: { multi: true, search: true },
                                        template: "<div class='#if(MEET_COMP_STS.toLowerCase() == 'pass' || ( MEET_COMP_STS.toLowerCase() == 'overridden' && COMP_OVRRD_FLG.toLowerCase() == 'yes')){#readOnlyCell#} else {## ##}#'>#=COMP_OVRRD_RSN#</div>",
                                        hidden: hideViewMeetCompOverride
                                    },
                                    {
                                        field: "BRND_FMLY",
                                        title: "Brand / Family",
                                        width: 120,
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; },
                                        template: "<div title='#=BRND_FMLY#' class='readOnlyCell'>#=BRND_FMLY#</div>"
                                    },
                                    {
                                        field: "",
                                        title: "Group Deals",
                                        width: 150,
                                        filterable: { multi: true, search: true },
                                        editable: function () { return false; },
                                        template: "<div class='readOnlyCell'></div>"
                                    },
                                    {
                                        field: "MEET_COMP_ANALYSIS",
                                        title: "Meet Comp Analysis",
                                        width: 150,
                                        editable: function () { return false; },
                                        filterable: { multi: true, search: true },
                                        template: "<div class='readOnlyCell'>#=MEET_COMP_ANALYSIS#</div>"
                                    },
                                    {
                                        field: "",
                                        title: "ECAP Price",
                                        width: 120,
                                        editable: function () { return false; },
                                        filterable: { multi: true, search: true },
                                        template: "<div class='readOnlyCell'></div>"
                                    },
                                    {
                                        field: "",
                                        title: "YCS2 Price",
                                        width: 120,
                                        editable: function () { return false; },
                                        filterable: { multi: true, search: true },
                                        template: "<div class='readOnlyCell'></div>"
                                    },
                                    //{
                                    //    field: "MC_LAST_RUN",
                                    //    title: "Last Run",
                                    //    template: "<div class='readOnlyCell' title='#= gridUtils.convertPstToLocal(MC_LAST_RUN) #'>#= gridUtils.convertPstToLocal(MC_LAST_RUN) #</div>",
                                    //    width: 170,
                                    //    filterable: {
                                    //        extra: false,
                                    //        ui: "datepicker"
                                    //    },
                                    //    editable: function () { return false; }
                                    //}
                                ]
                            };

                            function editorIABench(container, options) {
                                // Remove the role conditions once security configured
                                if (!(canUpdateMeetCompSKUPriceBench && options.model.MEET_COMP_UPD_FLG === "Y"
                                    && options.model.COMP_SKU.length !== 0 && options.model.PRD_CAT_NM.toLowerCase() === "svrws")) {
                                }
                                else {
                                    $('<input id="IA_BNCH' + options.field + '" data-bind="value:' + options.field + '"/>')
                                        .appendTo(container)
                                        .kendoNumericTextBox({
                                            decimals: 2,
                                            min: 0.00,
                                            change: function (e) {
                                                if (options.model.IA_BNCH > 0) {
                                                    $scope.meetCompMasterdata[options.model.RW_NM - 1].IA_BNCH = options.model.IA_BNCH;
                                                    addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "IA_BNCH");
                                                    var isUpdated = false;
                                                    if (options.model.GRP == "PRD") {
                                                        var selData = [];
                                                        if (options.model.IS_SELECTED) {
                                                            selData = getProductLineData();
                                                        }
                                                        if (selData.length > 0) {
                                                            isUpdated = true;
                                                            for (var cntData = 0; selData.length > cntData; cntData++) {
                                                                var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                                //Updating Product Line
                                                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && selData[cntData].PRD_CAT_NM.toLowerCase() == "svrws") {
                                                                    $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].IA_BNCH = options.model.IA_BNCH;
                                                                    addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "IA_BNCH");
                                                                }

                                                                //Updating Deal line
                                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                    .Where(function (x) {
                                                                        return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                                                    })
                                                                    .ToArray();

                                                                for (var i = 0; i < tempData.length; i++) {
                                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].IA_BNCH = options.model.IA_BNCH;
                                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "IA_BNCH");
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                .Where(function (x) {
                                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                                                })
                                                                .ToArray();

                                                            for (var i = 0; i < tempData.length; i++) {
                                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].IA_BNCH = options.model.IA_BNCH;
                                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "IA_BNCH");
                                                            }

                                                            if (tempData.length > 0) {
                                                                isUpdated = true;
                                                            }
                                                        }
                                                        //Retaining the same expand
                                                        if (isUpdated) {
                                                            expandSelected("IA_BNCH", options.model.RW_NM);
                                                        }
                                                    }
                                                }
                                                else {
                                                    return false;
                                                }
                                            }
                                        });
                                }
                            }

                            function editorCOMPBench(container, options) {
                                if (!(canUpdateMeetCompSKUPriceBench && options.model.MEET_COMP_UPD_FLG === "Y"
                                    && options.model.COMP_SKU.length !== 0 && options.model.PRD_CAT_NM.toLowerCase() === "svrws")) {
                                }
                                else {
                                    $('<input id="COMP_BNCH' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                        .appendTo(container)
                                        .kendoNumericTextBox({
                                            decimals: 2,
                                            min: 0.00,
                                            change: function (e) {
                                                if (options.model.COMP_BNCH > 0) {
                                                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                                    addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "COMP_BNCH");
                                                    var isUpdated = false;

                                                    if (options.model.GRP == "PRD") {
                                                        var selData = [];
                                                        if (options.model.IS_SELECTED) {
                                                            selData = getProductLineData();
                                                        }
                                                        if (selData.length > 0) {
                                                            isUpdated = true;
                                                            for (var cntData = 0; selData.length > cntData; cntData++) {
                                                                var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                                //Updating Product Line
                                                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && selData[cntData].PRD_CAT_NM.toLowerCase() == "svrws") {
                                                                    $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                                                    addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_BNCH");
                                                                }

                                                                //Updating Deal line
                                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                    .Where(function (x) {
                                                                        return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                                                    })
                                                                    .ToArray();

                                                                for (var i = 0; i < tempData.length; i++) {
                                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_BNCH");
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                .Where(function (x) {
                                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM.toLowerCase() == "svrws");
                                                                })
                                                                .ToArray();

                                                            for (var i = 0; i < tempData.length; i++) {
                                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_BNCH");
                                                            }

                                                            if (tempData.length > 0) {
                                                                isUpdated = true;
                                                            }
                                                        }

                                                        //Retaining the same expand
                                                        if (isUpdated) {
                                                            expandSelected("COMP_BNCH", options.model.RW_NM);
                                                        }

                                                    }
                                                }
                                                else {
                                                    return false;
                                                }
                                            }
                                        });
                                }
                            }

                            function meetCompSKUEditor(container, options) {
                                if (!(canUpdateMeetCompSKUPriceBench && options.model.MEET_COMP_UPD_FLG == "Y")) {
                                }
                                else {
                                    var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                        .Where(function (x) {
                                            return (x.GRP_PRD_SID == options.model.GRP_PRD_SID);
                                        })
                                        .GroupBy(function (x) {
                                            return (x.COMP_SKU);
                                        })
                                        .Select(function (x) {
                                            return {
                                                'COMP_SKU': x.source[0].COMP_SKU,
                                                'key': x.source[0].RW_NM,
                                                'RW_NM': x.source[0].RW_NM
                                            };
                                        }).ToArray();

                                    $('<input id="compSKUEditor" validationMessage="* field is required" placeholder="Enter Comp SKU.."' +
                                        ' name="' + options.field + '" />')
                                        .appendTo(container)
                                        .kendoComboBox({
                                            optionLabel: "Select Comp SKU",
                                            filter: "startsWith",
                                            autoBind: true,
                                            dataTextField: "COMP_SKU",
                                            dataValueField: "COMP_SKU",
                                            dataSource: {
                                                data: tempData
                                            },
                                            change: function (e) {
                                                var selectedIndx = this.selectedIndex;
                                                $scope.selectedCustomerText = this.value().trim();
                                                this.value($scope.selectedCustomerText);
                                                $scope.selectedCust = options.model.CUST_NM_SID;
                                                $scope.curentRow = options.model.RW_NM;
                                                if (selectedIndx == -1 && $scope.selectedCustomerText.trim().length > 0) {
                                                    $scope.addSKUForCustomer("0", options.model.IS_SELECTED);
                                                    options.model.COMP_SKU = $scope.selectedCustomerText.trim();
                                                }
                                                else if (selectedIndx > -1 && $scope.selectedCustomerText.trim().length > 0) {
                                                    var selectedValue = e.sender.listView._dataItems["0"].RW_NM;
                                                    options.model.COMP_SKU = $scope.selectedCustomerText.trim();

                                                    var tempprcData = [];
                                                    options.model.COMP_PRC = parseFloat($scope.meetCompMasterdata[selectedValue - 1].COMP_PRC).toFixed(2);
                                                    var isUpdated = false;

                                                    if (options.model.GRP == "PRD") {
                                                        var selData = [];
                                                        if (options.model.IS_SELECTED) {
                                                            selData = getProductLineData();
                                                        }

                                                        $scope.addSKUForCustomer("0", options.model.IS_SELECTED);
                                                        if (selData.length > 0) {
                                                            isUpdated = true;
                                                            for (var cntData = 0; selData.length > cntData; cntData++) {
                                                                var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                                //Updating Product Line
                                                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                                                                    $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                    addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_PRC");
                                                                }

                                                                //Updating Deal line
                                                                tempprcData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                    .Where(function (x) {
                                                                        return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                                    })
                                                                    .ToArray();

                                                                for (var i = 0; i < tempprcData.length; i++) {
                                                                    if (options.model.COMP_PRC) {
                                                                        $scope.meetCompMasterdata[tempprcData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                    }
                                                                    addToUpdateList($scope.meetCompMasterdata[tempprcData[i].RW_NM - 1], "COMP_PRC");
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            tempprcData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                .Where(function (x) {
                                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                                })
                                                                .ToArray();

                                                            for (var i = 0; i < tempprcData.length; i++) {
                                                                if (options.model.COMP_PRC) {
                                                                    $scope.meetCompMasterdata[tempprcData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                }
                                                                addToUpdateList($scope.meetCompMasterdata[tempprcData[i].RW_NM - 1], "COMP_PRC");
                                                            }

                                                            if (tempprcData.length > 0) {
                                                                isUpdated = true;
                                                            }
                                                        }
                                                    }

                                                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_SKU = this.text().trim();
                                                    // Setting COMP PRC based on Comp SKU if available
                                                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat($scope.meetCompMasterdata[selectedValue - 1].COMP_PRC).toFixed(2);
                                                    addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "COMP_SKU");

                                                    //Retaining the same expand
                                                    if (isUpdated) {
                                                        expandSelected("COMP_SKU", options.model.RW_NM);
                                                    }

                                                }
                                            }
                                        });
                                }
                            }

                            function meetCompPriceEditor(container, options) {
                                if (!(canUpdateMeetCompSKUPriceBench && options.model.MEET_COMP_UPD_FLG == "Y" && options.model.COMP_SKU.length !== 0)) {
                                }
                                else {

                                    var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                        .Where(function (x) {
                                            return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.COMP_PRC != null);
                                        })
                                        .GroupBy(function (x) {
                                            return (x.COMP_PRC);
                                        })
                                        .Select(function (x) {
                                            return {
                                                'COMP_PRC': x.source[0].COMP_PRC,
                                                'key': x.source[0].RW_NM,
                                                'RW_NM': x.source[0].RW_NM
                                            };
                                        }).ToArray();

                                    $('<input id="COMP_PRC' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                        .appendTo(container)
                                        .kendoComboBox({
                                            optionLabel: "Select Comp PRC",
                                            filter: "eq",
                                            autoBind: true,
                                            dataTextField: "COMP_PRC",
                                            dataValueField: "COMP_PRC",
                                            dataSource: {
                                                data: tempData
                                            },
                                            change: function (e) {
                                                if (isNaN(options.model.COMP_PRC) || options.model.COMP_PRC == null) {
                                                    options.model.COMP_PRC = null;
                                                }
                                                if (options.model.COMP_PRC > 0) {
                                                    var tempData = [];
                                                    var isUpdated = false;
                                                    if (options.model.GRP == "PRD") {
                                                        var selData = [];
                                                        if (options.model.IS_SELECTED) {
                                                            selData = getProductLineData();
                                                        }
                                                        if (selData.length > 0) {
                                                            isUpdated = true;
                                                            for (var cntData = 0; selData.length > cntData; cntData++) {
                                                                var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                                //Updating Product Line
                                                                if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y") {
                                                                    $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                    addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_PRC");
                                                                }

                                                                //Updating Deal line
                                                                tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                    .Where(function (x) {
                                                                        return (x.GRP_PRD_SID == temp_grp_prd && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                                    })
                                                                    .ToArray();

                                                                for (var i = 0; i < tempData.length; i++) {
                                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_PRC");
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                .Where(function (x) {
                                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                                })
                                                                .ToArray();

                                                            for (var i = 0; i < tempData.length; i++) {
                                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_PRC");
                                                            }

                                                            if (tempData.length > 0) {
                                                                isUpdated = true;
                                                            }
                                                        }
                                                    }

                                                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                    addToUpdateList(options.model, "COMP_PRC");

                                                    //Retaining the same expand
                                                    if (isUpdated) {
                                                        expandSelected("COMP_PRC", options.model.RW_NM);
                                                    }
                                                }
                                                else {
                                                    return false;
                                                }
                                            }
                                        });
                                }
                            }

                            function meetCompResultStatusEditor(container, options) {
                                //IF MEET COMP STATUS FAILED THEN Only Override Option will be available.
                                if (options.model.MEET_COMP_STS.toLowerCase() == "pass" || (options.model.MEET_COMP_STS.toLowerCase() == "overridden" && options.model.COMP_OVRRD_FLG.toLowerCase() == "yes")) {

                                }
                                else if ((usrRole == "DA") && options.model.MEET_COMP_OVERRIDE_UPD_FLG.toLowerCase() === "y") {
                                    var tempData = [
                                        {
                                            "COMP_OVRRD_FLG": "Yes"
                                        },
                                        {
                                            "COMP_OVRRD_FLG": "No"
                                        }
                                    ];

                                    $('<input required name="' + options.field + '"/>')
                                        .appendTo(container)
                                        .kendoDropDownList({
                                            optionLabel: "Select Override",
                                            autoBind: true,
                                            dataTextField: "COMP_OVRRD_FLG",
                                            dataValueField: "COMP_OVRRD_FLG",
                                            dataSource: {
                                                data: tempData
                                            },
                                            change: function (e) {
                                                $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_OVRRD_FLG = this.text().trim();
                                                addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "COMP_OVRRD_FLG");
                                                var isUpdated = false;
                                                if (options.model.GRP == "PRD") {
                                                    var selData = [];
                                                    if (options.model.IS_SELECTED) {
                                                        selData = getProductLineData();
                                                    }
                                                    if (selData.length > 0) {
                                                        isUpdated = true;
                                                        for (var cntData = 0; selData.length > cntData; cntData++) {
                                                            var temp_grp_prd = selData[cntData].GRP_PRD_SID;

                                                            //Updating Product Line
                                                            if (selData[cntData].MEET_COMP_UPD_FLG.toLowerCase() == "y" && (selData[cntData].MEET_COMP_STS.toLowerCase() == "fail" || selData[cntData].MEET_COMP_STS.toLowerCase() == "incomplete")) {
                                                                $scope.meetCompMasterdata[selData[cntData].RW_NM - 1].COMP_OVRRD_FLG = options.model.COMP_OVRRD_FLG;
                                                                addToUpdateList($scope.meetCompMasterdata[selData[cntData].RW_NM - 1], "COMP_OVRRD_FLG");
                                                            }

                                                            //Updating Deal line
                                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                                .Where(function (x) {
                                                                    return (
                                                                        x.GRP_PRD_SID == temp_grp_prd &&
                                                                        x.GRP == "DEAL" &&
                                                                        x.MEET_COMP_UPD_FLG == "Y" &&
                                                                        x.MEET_COMP_STS.toLowerCase() != "pass");
                                                                })
                                                                .ToArray();

                                                            for (var i = 0; i < tempData.length; i++) {
                                                                if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_FLG = options.model.COMP_OVRRD_FLG;
                                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_FLG");
                                                                }
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        //Updating Deal line
                                                        var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                            .Where(function (x) {
                                                                return (
                                                                    x.GRP_PRD_SID == options.model.GRP_PRD_SID &&
                                                                    x.GRP == "DEAL" &&
                                                                    x.MEET_COMP_UPD_FLG == "Y" &&
                                                                    x.MEET_COMP_STS.toLowerCase() != "pass");
                                                            })
                                                            .ToArray();

                                                        for (var i = 0; i < tempData.length; i++) {
                                                            if (tempData[i].MEET_COMP_STS.toLowerCase() == "fail" || tempData[i].MEET_COMP_STS.toLowerCase() == "incomplete") {
                                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_FLG = options.model.COMP_OVRRD_FLG;
                                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_FLG");
                                                            }
                                                        }

                                                        if (tempData.length > 0) {
                                                            isUpdated = true;
                                                        }
                                                    }

                                                    //Retaining the same expand
                                                    if (isUpdated) {
                                                        expandSelected("COMP_OVRRD_FLG", options.model.RW_NM);
                                                    }
                                                }
                                            }
                                        });
                                }
                                else {
                                    if (usrRole == "DA") {
                                        logger.warning("Cannot Override Meet Comp since the deals could be in Active Stage or the Meet Comp Result is already Passed or you do not have access to for this stage.");
                                    }
                                    else {
                                        logger.warning("Cannot edit the Comp SKU since the Deal could be Active OR Pricing Strategy could be in Pending/Approved/Hold Status");
                                    }

                                }
                            }

                            $scope.saveAndRunMeetComp = function () {
                                $scope.isValid = true;
                                $scope.ROW_NMB = [];
                                $scope.tempUpdatedList = [];
                                var isValid = isModelValid($scope.meetCompUpdatedList);
                                if (isValid) {
                                    $scope.tempUpdatedList = $scope.meetCompUpdatedList.map(function (x) {
                                        return {
                                            GRP: x.GRP,
                                            CUST_NM_SID: x.CUST_NM_SID,
                                            DEAL_PRD_TYPE: x.DEAL_PRD_TYPE,
                                            PRD_CAT_NM: x.PRD_CAT_NM,
                                            GRP_PRD_NM: x.GRP_PRD_NM,
                                            GRP_PRD_SID: x.GRP_PRD_SID,
                                            DEAL_OBJ_SID: x.DEAL_OBJ_SID,
                                            DEAL_DESC: x.DEAL_DESC,
                                            COMP_SKU: x.COMP_SKU,
                                            COMP_PRC: x.COMP_PRC,
                                            COMP_BNCH: x.COMP_BNCH,
                                            IA_BNCH: x.IA_BNCH,
                                            COMP_OVRRD_RSN: x.COMP_OVRRD_RSN,
                                            COMP_OVRRD_FLG: x.COMP_OVRRD_FLG == 'Yes' ? true : false,
                                            MEET_COMP_UPD_FLG: x.MEET_COMP_UPD_FLG,
                                            MEET_COMP_OVERRIDE_UPD_FLG: x.MEET_COMP_OVERRIDE_UPD_FLG
                                        }

                                    });

                                    if ($scope.tempUpdatedList.length > 0) {
                                        $scope.updateMeetComp();
                                    }
                                    else if ($scope.tempUpdatedList.length == 0) {
                                        $scope.forceRunMeetComp();
                                        //kendo.alert('No new Meet Comp Changes detected to be saved.');
                                    }
                                }
                                else {
                                    if (usrRole == "DA") {
                                        kendo.alert("Analysis Override Status OR Analysis Override Comments can't be Blank.");
                                    }
                                    else {
                                        kendo.alert("Meet comp data is missing for some product(s).Please enter the data and save the changes.");
                                    }
                                    $scope.dataSourceParent.read();
                                }
                            }
                            
                            $scope.updateMeetComp = function () {
                                $scope.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                                dataService.post("api/MeetComp/UpdateMeetCompProductDetails/" + $scope.objSid + "/" + $scope.objTypeId, $scope.tempUpdatedList).then(function (response) {
                                    $scope.meetCompMasterdata = response.data;
                                    $scope.meetCompUnchangedData = angular.copy(response.data);

                                    var isTrueOnce = false;

                                    if ($scope.isAdhoc == 1) {
                                        var isCapMissed = inCompleteDueToCAPMissing(response.data);                                          
                                    }

                                    if (usrRole == "GA") {
                                        var isValid = isModelValid($scope.meetCompMasterdata);
                                    }
                                    $scope.dataSourceParent.read();
                                    $scope.isBusy = false;
                                    $scope.tempUpdatedList = [];
                                    $scope.meetCompUpdatedList = [];
                                    
                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM != 'MCTPOPUP' && typeof $scope.$parent.setForceNavigationForMC != 'undefined') {
                                        $scope.$parent.setForceNavigationForMC();
                                    }

                                    if ($scope.PAGE_NM != 'MCTPOPUP' && $scope.PAGE_NM != 'WIDGET') {
                                        $scope.$root.$broadcast('refreshContractData');
                                    }          

                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM == 'WIDGET') {
                                        $scope.$root.$broadcast('refreshPricingTableData', isCapMissed);
                                    }

                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM == 'MCTPOPUP') {
                                        $scope.$parent.$parent.$broadcast('refreshMCTData', $linq.Enumerable().From($scope.meetCompMasterdata)
                                            .Where(function (x) {
                                                return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                                            })
                                            .OrderBy(function (x) { return x.MEET_COMP_STS }).ToArray());
                                    }
                                    
                                },
                                    function (response) {
                                        logger.error("Unable to save UpdateMeetCompProductDetails data", response, response.statusText);
                                        $scope.isBusy = false;
                                    });
                            }
                            $scope.forceRunMeetComp = function () {
                                $scope.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                                
                                dataService.get("api/MeetComp/GetMeetCompProductDetails/" + $scope.objSid + "/" + 'A' + "/" + $scope.objTypeId).then(function (response) {
                                    $scope.meetCompMasterdata = response.data;
                                    $scope.meetCompUnchangedData = angular.copy(response.data);

                                    var isTrueOnce = false;

                                    if ($scope.isAdhoc == 1) {
                                        var isCapMissed = inCompleteDueToCAPMissing(response.data);                                        
                                    }

                                    if (usrRole == "GA") {
                                        var isValid = isModelValid($scope.meetCompMasterdata);
                                    }
                                    $scope.dataSourceParent.read();
                                    $scope.isBusy = false;
                                    $scope.tempUpdatedList = [];
                                    $scope.meetCompUpdatedList = [];

                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM != 'MCTPOPUP' && typeof $scope.$parent.setForceNavigationForMC !='undefined') {
                                        $scope.$parent.setForceNavigationForMC();
                                    }

                                    if ($scope.PAGE_NM != 'MCTPOPUP' && $scope.PAGE_NM != 'WIDGET') {
                                        $scope.$root.$broadcast('refreshContractData');
                                    }

                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM == 'WIDGET') {
                                        $scope.$root.$broadcast('refreshPricingTableData', isCapMissed);
                                    }

                                    if ($scope.isAdhoc == 1 && $scope.PAGE_NM == 'MCTPOPUP') {
                                        $scope.$parent.$parent.$broadcast('refreshMCTData', $linq.Enumerable().From($scope.meetCompMasterdata)
                                            .Where(function (x) {
                                                return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                                            })
                                            .OrderBy(function (x) { return x.MEET_COMP_STS }).ToArray());
                                    }
                                },
                                    function (response) {
                                        logger.error("Unable to get GetMeetCompProductDetails data", response, response.statusText);
                                        $scope.isBusy = false;
                                    });
                            }

                            $scope.getDealDeatils = function (DEAL_OBJ_SID, GRP_PRD_SID, DEAL_PRD_TYPE) {
                                $scope.isBusy = true;
                                $scope.setBusy("Meet Comp Deal Details...", "Please wait we are fetching Deal Details...");
                                dataService.post("api/MeetComp/GetDealDetails/" + DEAL_OBJ_SID + "/" + GRP_PRD_SID + "/" + DEAL_PRD_TYPE).then(function (response) {
                                    $scope.isBusy = false;
                                    if (response.data.length > 0) {
                                        var modal = $uibModal.open({
                                            backdrop: 'static',
                                            templateUrl: '/app/core/directives/meetComp/meetCompDealDetails.html',
                                            controller: 'MeetCompDealDetailsModalController',
                                            controllerAs: 'vm',
                                            size: 'lg',
                                            windowClass: 'prdSelector-modal-window',
                                            resolve: {
                                                GetDealDetailsData: function () {
                                                    return response.data;
                                                }
                                            }
                                        });

                                        modal.result.then(
                                            function (MeetCompDealDeatilsOutput) {


                                            },
                                            function () {
                                                // Do Nothing on cancel
                                            });
                                    }
                                    else {
                                        logger.warning('No overlapping deals found');
                                    }


                                },
                                    function (response) {
                                        logger.error("Unable to Get Deal Details", response, response.statusText);
                                        $scope.isBusy = false;
                                    });
                            }

                            $scope.detailInit = function (parentDataItem) {
                                return {
                                    dataSource: {
                                        transport: {
                                            read: function (e) {
                                                e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == parentDataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.DEFAULT_FLAG == "D");
                                                    }).OrderBy(function (x) { return x.MEET_COMP_STS }).ToArray());
                                            },
                                            create: function (e) {
                                            }
                                        },
                                        pageSize: 500,
                                        serverPaging: true,
                                        serverFiltering: true,
                                        serverSorting: false,
                                        schema: {
                                            model: {
                                                id: "RW_NM",
                                                fields: {
                                                    DEAL_OBJ_SID: {
                                                        editable: false, nullable: true
                                                    },
                                                    RW_NM: { editable: false, validation: { required: true }, type: "string" },
                                                    COMP_OVRRD_FLG: { validation: { required: true } },
                                                    GRP: { validation: { required: true } },
                                                    COMP_OVRRD_RSN: { editable: true, validation: { required: false } },
                                                    CUST_NM_SID: { editable: false, validation: { required: true } },
                                                    DEAL_DESC: { editable: false, validation: { required: true } },
                                                    DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                                    DEAL_PRD_TYPE: { editable: false, validation: { required: true } },
                                                    GRP_PRD_NM: { editable: false, validation: { required: true } },
                                                    GRP_PRD_SID: { editable: false, validation: { required: true } },
                                                    IA_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                                    COMP_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                                    MC_LAST_RUN: { editable: false, validation: { required: true } },
                                                    COMP_PRC: { editable: true, validation: { required: true }, type: "number" },
                                                    COMP_SKU: { editable: true, validation: { required: true }, type: "string" },
                                                    MEET_COMP_UPD_FLG: { editable: true, validation: { required: true } },
                                                    MEET_COMP_OVERRIDE_UPD_FLG: { editable: true, validation: { required: true } },
                                                    OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                                    PRD_CAT_NM: { editable: false, validation: { required: true } },
                                                    MC_AVG_RPU: { editable: true, validation: { required: true } },
                                                    MC_NULL: { editable: false, validation: { required: true } },
                                                    MEET_COMP_STS: { editable: true, validation: { required: true } },
                                                    CNTRCT_OBJ_SID: { editable: false, validation: { required: true } },
                                                    PRC_ST_OBJ_SID: { editable: false, validation: { required: true } },
                                                    PRC_TBL_OBJ_SID: { editable: false, validation: { required: true } },
                                                    WF_STG_CD: { editable: false, validation: { required: true } },
                                                    END_CUST_RETAIL: { editable: false, validation: { required: true } },
                                                    CAP: { editable: true, validation: { required: true }, type: "number" },
                                                    "_behaviors": { type: "object" }
                                                }
                                            }
                                        },
                                    },
                                    filterable: true,
                                    sortable: true,
                                    navigatable: true,
                                    resizable: false,
                                    reorderable: true,
                                    columnMenu: false,
                                    groupable: false,
                                    sort: function (e) { gridUtils.cancelChanges(e); },
                                    filter: function (e) { gridUtils.cancelChanges(e); },
                                    editable: true,
                                    pageable: false,
                                    edit: function (e) {
                                        var input = e.container.find(".k-input");
                                        var value = input.val();
                                        var editedROW = e.model;
                                        var isEdited = true;
                                        if (usrRole == "DA" && editedROW.MEET_COMP_UPD_FLG == "Y" && (editedROW.MEET_COMP_STS.toLowerCase() == "pass" || editedROW.MEET_COMP_STS.toLowerCase() == "overridden")) {
                                            $('input[name=COMP_OVRRD_RSN]').parent().html(e.model.COMP_OVRRD_RSN);
                                            logger.warning("Cannot Override Meet Comp since the deals could be in Active Stage or the Meet Comp Result is Passed.");
                                        }
                                        else {
                                            input.keyup(function () {
                                                value = input.val();
                                            });

                                            $("[name='COMP_OVRRD_RSN']", e.container).blur(function () {
                                                var input = $(this);
                                                $scope.meetCompMasterdata[editedROW.RW_NM - 1].COMP_OVRRD_RSN = value.trim();
                                                editedROW.COMP_OVRRD_RSN = value.trim();
                                                addToUpdateList(editedROW, "COMP_OVRRD_RSN");
                                            });
                                        }

                                    },
                                    dataBound: function (e) {
                                        if ($scope.errorList.length > 0) {
                                            //// get the index of the UnitsInStock cell
                                            var columns = e.sender.columns;
                                            var columnCOMP_SKU = this.wrapper.find(".k-grid-header [data-field=" + "COMP_SKU" + "]").index();
                                            var columnCOMP_PRC = this.wrapper.find(".k-grid-header [data-field=" + "COMP_PRC" + "]").index();
                                            var columnCOMP_BNCH = this.wrapper.find(".k-grid-header [data-field=" + "COMP_BNCH" + "]").index();
                                            var columnIA_BNCH = this.wrapper.find(".k-grid-header [data-field=" + "IA_BNCH" + "]").index();
                                            var columnCOMP_OVRRD_FLG = this.wrapper.find(".k-grid-header [data-field=" + "COMP_OVRRD_FLG" + "]").index();
                                            var columnCOMP_OVRRD_RSN = this.wrapper.find(".k-grid-header [data-field=" + "COMP_OVRRD_RSN" + "]").index();

                                            // iterate the data items and apply row styles where necessary
                                            var dataItems = e.sender.dataSource.view();
                                            for (var j = 0; j < dataItems.length; j++) {
                                                var TEMP_RW_NM = dataItems[j].get("RW_NM");
                                                var indx = -1;
                                                $scope.errorList.some(function (e, i) {
                                                    if (e.RW_NM == TEMP_RW_NM) {
                                                        indx = i;
                                                        return true;
                                                    }
                                                });
                                                if (indx > -1) {
                                                    if ($scope.errorList[indx].COMP_SKU) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnCOMP_SKU);
                                                        cell.addClass("errorItemList");
                                                    }
                                                    if ($scope.errorList[indx].COMP_PRC) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnCOMP_PRC);
                                                        cell.addClass("errorItemList");
                                                    }
                                                    if ($scope.errorList[indx].COMP_BNCH) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnCOMP_BNCH);
                                                        cell.addClass("errorItemList");
                                                    }
                                                    if ($scope.errorList[indx].IA_BNCH) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnIA_BNCH);
                                                        cell.addClass("errorItemList");
                                                    }
                                                    if ($scope.errorList[indx].COMP_OVRRD_FLG) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnCOMP_OVRRD_FLG);
                                                        cell.addClass("errorItemList");
                                                    }
                                                    if ($scope.errorList[indx].COMP_OVRRD_RSN) {
                                                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                                                        row.addClass("errorListRow");
                                                        var cell = row.children().eq(columnCOMP_OVRRD_RSN);
                                                        cell.addClass("errorItemList");
                                                    }


                                                }

                                            }
                                        }
                                    },
                                    columns: [
                                        {
                                            field: "OBJ_SET_TYPE",
                                            title: "Deal Type",
                                            template: "<div class='readOnlyCell' title='#=OBJ_SET_TYPE#'>#=OBJ_SET_TYPE#</div>",
                                            width: 125
                                        },
                                        {
                                            field: "DEAL_OBJ_SID",
                                            title: "Deal ID",
                                            width: 120,
                                            filterable: { multi: true, search: true },
                                            template: "<div class='ovlpCell readOnlyCell'><deal-popup-icon deal-id='#=DEAL_OBJ_SID#'></deal-popup-icon><span><a onclick='gotoDealDetails(#=CNTRCT_OBJ_SID#,#=PRC_ST_OBJ_SID#, #= PRC_TBL_OBJ_SID #, #=DEAL_OBJ_SID# )' class='btnDeal' title='Click to go to the Deal Editor'> #= DEAL_OBJ_SID # </a></span></div>"
                                        },
                                        {
                                            field: "DEAL_DESC",
                                            title: "Deal Description",
                                            width: 150,
                                            filterable: { multi: true, search: true },
                                            template: '<div class="readOnlyCell" title="#=DEAL_DESC#">#=DEAL_DESC#</div>'
                                        },
                                        {
                                            field: "END_CUST_RETAIL",
                                            title: "End Customer/Retail",
                                            width: 170,
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: "<div title='#=END_CUST_RETAIL#' class='readOnlyCell'>#=END_CUST_RETAIL#</div>"
                                        },
                                        {
                                            field: "COMP_SKU",
                                            title: "Meet Comp SKU",
                                            width: 170,
                                            template: "<div class='#if(usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#=COMP_SKU#</div>",
                                            filterable: { multi: true, search: true },
                                            editor: meetCompSKUEditor
                                        },
                                        {
                                            field: "COMP_PRC",
                                            title: "Meet Comp Price",
                                            width: 150,
                                            format: "{0:c}",
                                            template: "<div class='#if(usrRole == 'DA'){#readOnlyCell#} else {## ##}#'>#if(COMP_PRC == 0 || COMP_PRC == null){## ##} else {#$#:COMP_PRC##}#</div>",
                                            filterable: { multi: true, search: true },
                                            editor: meetCompPriceEditor
                                        },
                                        {
                                            field: "CAP",
                                            title: "CAP",
                                            width: 120,
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            format: "{0:c}",
                                            template: "<div title='#=CAP#' class='readOnlyCell'>#if(CAP == 0){## ##} else {#$#:CAP##}#</div>"
                                        },
                                        {
                                            field: "IA_BNCH",
                                            title: "IA Bench",
                                            width: 120,
                                            template: "<div class='#if(PRD_CAT_NM.toLowerCase() != 'svrws' || usrRole == 'DA' || (usrRole == 'FSE' && PS_STATUS.toLowerCase() != 'draft') || (usrRole == 'GA' && (PS_STATUS.toLowerCase() != 'draft' && PS_STATUS.toLowerCase() != 'requested')) ){#readOnlyCell#} else {## ##}#'>#if(IA_BNCH == 0 || IA_BNCH == null){## ##} else {##:IA_BNCH##}#</div>",
                                            filterable: { multi: true, search: true },
                                            editor: editorIABench
                                        },
                                        {
                                            field: "COMP_BNCH",
                                            title: "Comp Bench",
                                            width: 120,
                                            template: "<div class='#if(PRD_CAT_NM.toLowerCase() != 'svrws' || usrRole == 'DA' || (usrRole == 'FSE' && PS_STATUS.toLowerCase() != 'draft') || (usrRole == 'GA' && (PS_STATUS.toLowerCase() != 'draft' && PS_STATUS.toLowerCase() != 'requested')) ){#readOnlyCell#} else {## ##}#'>#if(COMP_BNCH == 0 || COMP_BNCH == null){## ##} else {##:COMP_BNCH##}#</div>",
                                            filterable: { multi: true, search: true },
                                            editor: editorCOMPBench
                                        },
                                        {
                                            field: "MEET_COMP_STS",
                                            title: "Test Results",
                                            width: 120,
                                            editable: function () { return false; },
                                            hidden: hideViewMeetCompResult,
                                            template: "#if(MEET_COMP_STS.toLowerCase() == 'overridden') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-passed-completed-solid complete' title='Passed with Override Status' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'pass') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-passed-completed-solid completeGreen' title='Passed' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'incomplete') {#<div class='textRunIcon readOnlyCell'><i class='intelicon-help-solid incomplete' title='InComplete' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS.toLowerCase() == 'fail'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-alert-solid errorIcon' title='Error/Failed' style='font-size:20px !important'></i></div>#}else if(MEET_COMP_STS.toLowerCase() == 'not run yet'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-help-outlined notRunYetIcon' title='Not run yet' style='font-size:20px !important'></i></div>#}else if(MEET_COMP_STS.toLowerCase() == 'na'){#<div class='textRunIcon readOnlyCell'><i class='intelicon-information-solid notApplicableIcon' title='NA' style='font-size:20px !important'></i></div>#}#",
                                            filterable: { multi: true, search: true }
                                        },
                                        {
                                            field: "MC_AVG_RPU",
                                            title: "Avg. Net Price",
                                            width: 150,
                                            editable: function () { return false; },
                                            filterable: { multi: true, search: true },
                                            template: "<div title='#=MEET_COMP_FRMULA#' class='readOnlyCell'>#=MC_AVG_RPU#</div>",
                                        },
                                        {
                                            field: "COMP_OVRRD_FLG",
                                            title: "Analysis Override",
                                            width: 150,
                                            editor: meetCompResultStatusEditor,
                                            filterable: { multi: true, search: true },
                                            template: "<div class='#if(MEET_COMP_STS.toLowerCase() == 'pass' || ( MEET_COMP_STS.toLowerCase() == 'overridden' && COMP_OVRRD_FLG.toLowerCase() == 'yes')){#readOnlyCell#} else {## ##}#'>#=COMP_OVRRD_FLG#</div>",
                                            hidden: hideViewMeetCompOverride
                                        },
                                        {
                                            field: "COMP_OVRRD_RSN",
                                            title: "Analysis Override Comments",
                                            width: 220,
                                            filterable: { multi: true, search: true },
                                            template: "<div class='#if(MEET_COMP_STS.toLowerCase() == 'pass' || ( MEET_COMP_STS.toLowerCase() == 'overridden' && COMP_OVRRD_FLG.toLowerCase() == 'yes' )){#readOnlyCell#} else {## ##}#'>#=COMP_OVRRD_RSN#</div>",
                                            hidden: hideViewMeetCompOverride
                                        },
                                        {
                                            field: "BRND_FMLY",
                                            title: "Brand / Family",
                                            width: 120,
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: "<div title='#=BRND_FMLY#' class='readOnlyCell'>#=BRND_FMLY#</div>"
                                        },
                                        {
                                            field: "",
                                            title: "Group Deals",
                                            width: 150,
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: '<div class="readOnlyCell" title="#=DEAL_DESC#"><a onclick="openDealDetails(#=DEAL_OBJ_SID#, #=GRP_PRD_SID#, \'#=DEAL_PRD_TYPE#\')" style="cursor: pointer" title="Click to view Deal Details">View</a></div>'
                                        },
                                        {
                                            field: "MEET_COMP_ANALYSIS",
                                            title: "Meet Comp Analysis",
                                            width: 150,
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: "<div class='readOnlyCell'>#=MEET_COMP_ANALYSIS#</div>"
                                        },
                                        {
                                            field: "ECAP_PRC",
                                            title: "ECAP Price",
                                            width: 120,
                                            format: "{0:c}",
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: "<div title='#=ECAP_PRC#' class='readOnlyCell'>#if(ECAP_PRC == 0){## ##} else {#$#:ECAP_PRC##}#</div>"
                                        },
                                        {
                                            field: "YCS2",
                                            title: "YCS2 Price",
                                            width: 120,
                                            format: "{0:c}",
                                            filterable: { multi: true, search: true },
                                            editable: function () { return false; },
                                            template: "<div title='#=YCS2#' class='readOnlyCell'>#if(YCS2 == 0){## ##} else {#$#:YCS2##}#</div>"
                                        },
                                    ]
                                };
                            };
                        }
                        else {
                            if ($scope.isAdhoc == 0) {
                                kendo.alert("No Meet Comp data available for product(s) in this Contract");
                            }                            
                            $scope.isBusy = false;
                            return;
                        }
                    },
                        function (response) {
                            logger.error("Unable to get GetMeetCompProductDetails data", response, response.statusText);
                            $scope.isBusy = false;
                        });
                }

            }],
            link: function (scope, element, attrs) {

            }
        };
    }
})();