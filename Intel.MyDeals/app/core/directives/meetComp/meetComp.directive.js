angular
    .module('app.core')
    .directive('meetComp', meetComp);

meetComp.$inject = ['$compile', '$filter', 'dataService', 'securityService', '$timeout', 'logger', '$linq'];

function meetComp($compile, $filter, dataService, securityService, $timeout, logger, $linq) {
    kendo.culture("en-US");

    return {
        scope: {
            objSid: '='
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/meetComp/meetComp.directive.html',
        controller: ['$scope', 'dataService', function ($scope, dataService) {
            $scope.CAN_VIEW_MEET_COMP = true; //securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null);
            $scope.CAN_EDIT_MEET_COMP = true; //securityService.chkDealRules('C_EDIT_MEET_COMP', window.usrRole, null, null, null);
            $scope.errorList = [];
            $scope.validationMessage = "";
            $scope.setUpdateFlag = false;
            if (!$scope.CAN_VIEW_MEET_COMP) {
                $scope.validationMessage = "No Access. You do not have permissions to view this page";
            }
            $scope.meetCompMasterdata = [];
            if (!!$scope.objSid) {
                $scope.loading = true;
                $scope.selectedCust = '';
                $scope.selectedCustomerText = '';
                $scope.curentRow = '';

                //WEB API call
                dataService.get("api/MeetComp/GetMeetCompProductDetails/" + $scope.objSid).then(function (response) {
                    $scope.meetCompMasterdata = response.data;
                    $scope.meetCompUnchangedData = angular.copy(response.data);
                    $scope.meetCompUpdatedList = [];

                    //Add New Customer
                    $scope.addSKUForCustomer = function (mode) {
                        $scope.meetCompMasterdata[$scope.curentRow - 1].COMP_SKU = $scope.selectedCustomerText;

                        if (mode == "0" || mode == 0) {
                            $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = $scope.selectedCust;
                        }
                        else {
                            $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = 1;
                        }

                        addToUpdateList($scope.meetCompMasterdata[$scope.curentRow - 1], "COMP_SKU");

                        //Update child
                        if ($scope.meetCompMasterdata[$scope.curentRow - 1].GRP == "PRD") {
                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                .Where(function (x) {
                                    return (x.GRP_PRD_SID == $scope.meetCompMasterdata[$scope.curentRow - 1].GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                })
                                .ToArray();

                            for (var i = 0; i < tempData.length; i++) {
                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_SKU = $scope.selectedCustomerText;
                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_SKU");
                            }

                        }

                        //Update Grid
                        $scope.dataSourceParent.read();
                    };

                    //Column Level Security Implementation
                    if (usrRole == 'FSE') {
                        $scope.hide_MC_LAST_RUN = true;
                        $scope.hide_MEET_COMP_STS = true;
                    }
                    else {
                        $scope.hide_MC_LAST_RUN = false;
                        $scope.hide_MEET_COMP_STS = false;
                    }

                    if (usrRole == 'GA' || usrRole == 'Super GA' || usrRole == 'FSE') {
                        $scope.hide_MC_AVG_RPU = true;
                        $scope.hide_COMP_OVRRD_FLG = true;
                        $scope.hide_COMP_OVRRD_RSN = true;
                    }
                    else {
                        $scope.hide_MC_AVG_RPU = false;
                        $scope.hide_COMP_OVRRD_FLG = false;
                        $scope.hide_COMP_OVRRD_RSN = false;
                    }


                    $scope.dataSourceParent = new kendo.data.DataSource({
                        transport: {
                            read: function (e) {
                                e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                    .Where(function (x) {
                                        return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                                    }).ToArray());
                            },
                            create: function (e) {
                            }
                        },
                        pageSize: 8,
                        batch: true,
                        schema: {
                            model: {
                                id: "RW_NM",
                                fields: {
                                    DEAL_OBJ_SID: {
                                        editable: false, nullable: true
                                    },
                                    RW_NM: { validation: { required: true }, type: "string" },
                                    COMP_OVRRD_FLG: { validation: { required: true } },
                                    GRP: { validation: { required: true } },
                                    COMP_OVRRD_RSN: { editable: true, validation: { required: false } },
                                    CUST_NM_SID: { editable: false, validation: { required: true } },
                                    DEAL_OBJ_SID: { editable: false, validation: { required: true } },
                                    DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                    GRP_PRD_NM: { editable: false, validation: { required: true } },
                                    GRP_PRD_SID: { editable: false, validation: { required: true } },
                                    IA_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                    COMP_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                    MC_LAST_RUN: { editable: false, validation: { required: true } },
                                    COMP_PRC: { editable: true, validation: { required: true }, type: "number" },
                                    COMP_SKU: { editable: true, validation: { required: true }, type: "string" },
                                    MEET_COMP_UPD_FLG: { editable: true, validation: { required: true } },
                                    OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                    PRD_CAT_NM: { editable: false, validation: { required: true } },
                                    MC_AVG_RPU: { editable: true, validation: { required: true } },
                                    MC_NULL: { editable: false, validation: { required: true } },
                                    MEET_COMP_STS: { editable: true, validation: { required: true } },
                                    CNTRCT_OBJ_SID: { editable: false, validation: { required: true } },
                                    PRC_ST_OBJ_SID: { editable: false, validation: { required: true } },
                                    PRC_TBL_OBJ_SID: { editable: false, validation: { required: true } },
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
                        pageable: true,
                        detailInit: detailInit,
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
                                field: "PRD_CAT_NM",
                                title: "Vertical",
                                width: 80,
                                filterable: { multi: true, search: true, search: true },
                                editable: function () { return false; }
                            },
                            {
                                field: "GRP_PRD_NM",
                                title: "Product",
                                width: 120,
                                template: "<div title='#=GRP_PRD_NM#'>#=GRP_PRD_NM#</div>",
                                filterable: { multi: true, search: true, search: true },
                                editable: function () { return false; }
                            },
                            {
                                field: "DEAL_OBJ_SID",
                                title: "Deals",
                                width: 120,
                                filterable: { multi: true, search: true, search: true },
                                editable: function () { return false; }
                            },
                            {
                                field: "COMP_SKU",
                                title: "Meet Comp SKU",
                                template: "#= COMP_SKU#",
                                width: 170,
                                filterable: { multi: true, search: true, search: true },
                                editor: meetCompSKUEditor
                            },
                            {
                                field: "COMP_PRC",
                                title: "Meet Comp Price",
                                width: 150,
                                format: "{0:c}",
                                editor: meetCompPriceEditor
                            },
                            {
                                field: "IA_BNCH",
                                title: "IA Bench",
                                width: 120,
                                editor: editorIABench
                            },
                            {
                                field: "COMP_BNCH",
                                title: "Comp Bench",
                                width: 120,
                                editor: editorCOMPBench
                            },
                            {
                                field: "MEET_COMP_STS",
                                title: "Test Results",
                                width: 120,
                                template: "#if(MEET_COMP_STS == 'Pass' && COMP_OVRRD_FLG.length > 0) {#<div class='textRunIcon'><i class='intelicon-passed-completed-solid complete' title='Passed with Override Status' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS == 'Pass' && COMP_OVRRD_FLG.length == 0) {#<div class='textRunIcon'><i class='intelicon-passed-completed-solid completeGreen' title='Passed' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS == 'Incomplete') {#<div class='textRunIcon'><i class='intelicon-help-solid incomplete' title='Incomplete' style='font-size:20px !important'></i></div>#} else{#<div class='textRunIcon'><i class='intelicon-alert-solid errorIcon' title='Error/Failed' style='font-size:20px !important'></i></div>#}#",
                                editable: function () { return false; },
                                hidden: $scope.hide_MEET_COMP_STS
                            },
                            {
                                field: "MC_LAST_RUN",
                                title: "Last Run",
                                template: "#= kendo.toString(new Date(MC_LAST_RUN), 'M/d/yyyy hh:MM:ss') #",
                                width: 120,
                                filterable: {
                                    extra: false,
                                    ui: "datepicker"
                                },
                                editable: function () { return false; },
                                hidden: $scope.hide_MC_LAST_RUN
                            },
                            {
                                field: "MC_AVG_RPU",
                                title: "Avg. Net Price",
                                width: 150,
                                editable: function () { return false; },
                                hidden: $scope.hide_MC_AVG_RPU
                            },
                            {
                                field: "COMP_OVRRD_FLG",
                                title: "Analysis Override",
                                width: 150,
                                editor: meetCompResultStatusEditor,
                                filterable: { multi: true, search: true, search: true },
                                hidden: $scope.hide_COMP_OVRRD_FLG
                            },
                            {
                                field: "COMP_OVRRD_RSN",
                                title: "Analysis Override Comments",
                                width: 150,
                                editor: editorORReason,
                                filterable: { multi: true, search: true, search: true },
                                hidden: $scope.hide_COMP_OVRRD_RSN
                            }
                        ]
                    };

                    function editorIABench(container, options) {
                        if (usrRole == "DA" || usrRole == "SA" || options.model.PRD_CAT_NM != "SvrWS" || options.model.COMP_SKU.length == 0) {
                            //DA only view
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

                                            if (options.model.GRP == "PRD") {
                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM=="SvrWS");
                                                    })
                                                    .ToArray();

                                                for (var i = 0; i < tempData.length; i++) {
                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].IA_BNCH = options.model.IA_BNCH;
                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "IA_BNCH");
                                                }

                                                $scope.dataSourceParent.read();
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
                        if (usrRole == "DA" || usrRole == "SA" || options.model.PRD_CAT_NM != "SvrWS" || options.model.COMP_SKU.length == 0) {
                            //DA only view
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

                                            if (options.model.GRP == "PRD") {
                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.PRD_CAT_NM == "SvrWS");
                                                    })
                                                    .ToArray();

                                                for (var i = 0; i < tempData.length; i++) {
                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_BNCH");
                                                }

                                                $scope.dataSourceParent.read();
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
                        if (usrRole == "DA" || usrRole == "SA") {
                            //DA only view
                        }
                        else {
                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                .Where(function (x) {
                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == options.model.GRP);
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

                            $('<input id="productEditor" validationMessage="* field is required" placeholder="Enter Comp SKU.."' +
                                'required name="' + options.field + '" />')
                                .appendTo(container)
                                .kendoComboBox({
                                    optionLabel: "Select Comp SKU",
                                    filter: "startsWith",
                                    autoBind: true,
                                    dataTextField: "COMP_SKU",
                                    dataValueField: "COMP_SKU",
                                    noDataTemplate: $("#noDataTemplate").html(),
                                    dataSource: {
                                        data: tempData
                                    },
                                    change: function (e) {
                                        var selectedIndx = this.selectedIndex;
                                        if (selectedIndx == -1) {
                                            $scope.selectedCust = options.model.CUST_NM_SID;
                                            $scope.selectedCustomerText = this.value();
                                            $scope.curentRow = options.model.RW_NM;
                                        }
                                        else {
                                            var selectedValue = e.sender.listView._dataItems["0"].RW_NM;
                                            options.model.COMP_SKU = this.text();
                                            options.model.COMP_PRC = parseFloat($scope.meetCompMasterdata[selectedValue - 1].COMP_PRC).toFixed(2);
                                            if (options.model.GRP == "PRD") {
                                                var tempprcData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                    })
                                                    .ToArray();

                                                for (var i = 0; i < tempprcData.length; i++) {
                                                    $scope.meetCompMasterdata[tempprcData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                    addToUpdateList($scope.meetCompMasterdata[tempprcData[i].RW_NM - 1], "COMP_PRC");
                                                }
                                            }

                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_SKU = this.text();
                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat($scope.meetCompMasterdata[selectedValue - 1].COMP_PRC).toFixed(2);
                                            addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "COMP_SKU");
                                            $scope.dataSourceParent.read();


                                        }
                                    }
                                });
                        }
                    }

                    function meetCompPriceEditor(container, options) {
                        if (usrRole == "DA" || usrRole == "SA" || options.model.COMP_SKU.length == 0) {
                            //DA only view
                        }
                        else {
                            $('<input id="COMP_PRC' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 2,
                                    min: 0.00,
                                    format: "{0:c}",
                                    change: function (e) {
                                        if (options.model.COMP_PRC > 0) {
                                            if (options.model.GRP == "PRD") {
                                                var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                    .Where(function (x) {
                                                        return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true && x.MEET_COMP_UPD_FLG == "Y");
                                                    })
                                                    .ToArray();

                                                for (var i = 0; i < tempData.length; i++) {
                                                    $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                                    addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_PRC");
                                                }
                                            }
                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                            addToUpdateList(options.model, "COMP_PRC");
                                        }
                                        else {
                                            return false;
                                        }

                                        $scope.dataSourceParent.read();

                                    }
                                });
                        }
                    }

                    function meetCompResultStatusEditor(container, options) {
                        //IF MEET COMP STATUS FAILED THEN Only Override Option will be available.
                        if (options.model.MEET_COMP_STS == 'Fail' && usrRole == "DA") {
                            var tempData = [
                                {
                                    "COMP_OVRRD_FLG": "Y"
                                },
                                {
                                    "COMP_OVRRD_FLG": "N"
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
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_OVRRD_FLG = this.text();
                                        addToUpdateList($scope.meetCompMasterdata[options.model.RW_NM - 1], "COMP_OVRRD_FLG");

                                        if (options.model.GRP == "PRD") {
                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                .Where(function (x) {
                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.MEET_COMP_STS != "Pass");
                                                })
                                                .ToArray();

                                            for (var i = 0; i < tempData.length; i++) {
                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_FLG = options.model.COMP_OVRRD_FLG;
                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_FLG");
                                            }

                                            $scope.dataSourceParent.read();
                                        }
                                    }
                                });
                        }

                    }

                    function editorORReason(container, options) {
                        if (options.model.COMP_OVRRD_FLG.length > 0 && usrRole == "DA") {
                            var tempReason = [
                                {
                                    "COMP_OVRRD_RSN": options.model.COMP_OVRRD_RSN
                                }
                            ];
                            $('<input required name="' + options.field + '"/>')
                                .appendTo(container)
                                .kendoComboBox({
                                    optionLabel: "type comments",
                                    autoBind: true,
                                    dataTextField: "COMP_OVRRD_RSN",
                                    dataValueField: "RW_ID",
                                    dataSource: {
                                        data: tempReason
                                    },
                                    change: function (e) {
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_OVRRD_RSN = this.text();
                                        addToUpdateList(options.model, "COMP_OVRRD_RSN");

                                        if (options.model.GRP == "PRD") {
                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                .Where(function (x) {
                                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == "DEAL" && x.MEET_COMP_UPD_FLG == "Y" && x.MEET_COMP_STS != "Pass");
                                                })
                                                .ToArray();

                                            for (var i = 0; i < tempData.length; i++) {
                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_OVRRD_RSN = options.model.COMP_OVRRD_RSN;
                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_OVRRD_RSN");
                                            }

                                            $scope.dataSourceParent.read();
                                        }

                                    }
                                });
                        }
                        else {
                            logger.error("Meet Comp Override Status can not be blank");
                        }

                    }

                    function addToUpdateList(dataItem, FIELD_NM) {                       
                        // findIndex() is not supported in IE11 and hence replacing with 'some()' that is supported in all browsers - VN
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

                    function isModelValid() {
                        $scope.errorList = [];
                        
                        for (var i = 0; i < $scope.meetCompUpdatedList.length; i++) {
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
                            if ($scope.meetCompUpdatedList[i].COMP_SKU.length == 0 && usrRole == "GA") {
                                errorObj.COMP_SKU = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
                                isError = true;
                            }

                            //COMP_PRC checking.....
                            if ($scope.meetCompUpdatedList[i].COMP_PRC <= 0) {
                                errorObj.COMP_PRC = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
                                isError = true;
                            }

                            //COMP_BNCH checking....
                            if ($scope.meetCompUpdatedList[i].COMP_BNCH <= 0 && $scope.meetCompUpdatedList[i].PRD_CAT_NM == "SvrWS") {
                                errorObj.COMP_BNCH = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
                                isError = true;
                            }

                            //IA_BNCH checking....
                            if ($scope.meetCompUpdatedList[i].IA_BNCH <= 0 && $scope.meetCompUpdatedList[i].PRD_CAT_NM == "SvrWS") {
                                errorObj.IA_BNCH = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
                                isError = true;
                            }

                            //COMP_OVRRD_FLG checking....
                            if ($scope.meetCompUpdatedList[i].COMP_OVRRD_FLG <= 0 && usrRole == "DA") {
                                errorObj.COMP_OVRRD_FLG = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
                                isError = true;
                            }

                            //COMP_OVRRD_RSN checking....
                            if ($scope.meetCompUpdatedList[i].COMP_OVRRD_RSN <= 0 && usrRole == "DA") {
                                errorObj.COMP_OVRRD_RSN = true;
                                errorObj.RW_NM = $scope.meetCompUpdatedList[i].RW_NM;
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

                    $scope.setBusy = function (msg, detail) {
                        $timeout(function () {
                            var newState = msg != undefined && msg !== "";

                            // if no change in state, simple update the text
                            if ($scope.isBusy === newState) {
                                $scope.isBusyMsgTitle = msg;
                                $scope.isBusyMsgDetail = !detail ? "" : detail;
                                return;
                            }

                            $scope.isBusy = newState;
                            if ($scope.isBusy) {
                                $scope.isBusyMsgTitle = msg;
                                $scope.isBusyMsgDetail = !detail ? "" : detail;
                            } else {
                                $timeout(function () {
                                    $scope.isBusyMsgTitle = msg;
                                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                                }, 500);
                            }
                        });
                    }

                    $scope.saveAndRunMeetComp = function () {
                        $scope.isValid = true;
                        $scope.ROW_NMB = [];
                        $scope.tempUpdatedList = [];
                        var isValid = isModelValid();
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
                                    COMP_SKU: x.COMP_SKU,
                                    COMP_PRC: x.COMP_PRC,
                                    COMP_BNCH: x.COMP_BNCH,
                                    IA_BNCH: x.IA_BNCH,
                                    COMP_OVRRD_RSN: x.COMP_OVRRD_RSN,
                                    COMP_OVRRD_FLG: x.COMP_OVRRD_FLG == 'Y' ? true : false,
                                    MEET_COMP_UPD_FLG: x.MEET_COMP_UPD_FLG
                                }

                            });

                            if ($scope.tempUpdatedList.length > 0) {
                                $scope.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                                dataService.post("api/MeetComp/UpdateMeetCompProductDetails/" + $scope.objSid, $scope.tempUpdatedList).then(function (response) {
                                    $scope.meetCompMasterdata = response.data;
                                    $scope.meetCompUnchangedData = angular.copy(response.data);
                                    $scope.dataSourceParent.read();
                                    $scope.isBusy = false;
                                    $scope.tempUpdatedList = [];
                                    $scope.meetCompUpdatedList = [];
                                },
                                    function (response) {
                                        logger.error("Unable to save data", response, response.statusText);
                                        $scope.isBusy = false;
                                    });

                            }
                            else {
                                kendo.alert('No data Found');
                            }
                        }
                        else {
                            $scope.dataSourceParent.read();
                        }

                        //Error Checking: COMP_PRC, IA_BNCH, COMP_BNCH
                        //var C_I_RST = $linq.Enumerable().From($scope.meetCompUpdatedList)
                        //    .Where(function (x) {
                        //        return ((x.COMP_BNCH <= 0 && x.IA_BNCH <= 0 && x.PRD_CAT_NM == "SvrWS") || x.COMP_PRC <= 0);
                        //    }).ToArray();

                        //var U_F_CMT = $linq.Enumerable().From($scope.meetCompUpdatedList)
                        //    .Where(function (x) {
                        //        return ((x.COMP_OVRRD_FLG.length == 0 || x.MEET_COMP_UPD_FLG.length == 0) && usrRole == "DA");
                        //    }).ToArray();

                        //var C_SKU = $linq.Enumerable().From($scope.meetCompUpdatedList)
                        //    .Where(function (x) {
                        //        return ((x.COMP_SKU.length == 0) && usrRole == "GA");
                        //    }).ToArray();


                    }

                    function detailInit(e) {
                        $scope.TEMP_GRP_PRD_SID = e.data.GRP_PRD_SID;
                        $("<div class='childGrid'/>").appendTo(e.detailCell).kendoGrid({
                            dataSource: {
                                transport: {
                                    read: function (e) {
                                        e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                            .Where(function (x) {
                                                return (x.GRP_PRD_SID == $scope.TEMP_GRP_PRD_SID && x.GRP == "DEAL" && x.DEFAULT_FLAG == "D");
                                            }).ToArray());
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
                                            DEAL_OBJ_SID: { editable: false, validation: { required: true } },
                                            DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                            GRP_PRD_NM: { editable: false, validation: { required: true } },
                                            GRP_PRD_SID: { editable: false, validation: { required: true } },
                                            IA_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                            COMP_BNCH: { editable: true, validation: { required: true }, type: "number" },
                                            MC_LAST_RUN: { editable: false, validation: { required: true } },
                                            COMP_PRC: { editable: true, validation: { required: true }, type: "number" },
                                            COMP_SKU: { editable: true, validation: { required: true }, type: "string" },
                                            MEET_COMP_UPD_FLG: { editable: true, validation: { required: true } },
                                            OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                            PRD_CAT_NM: { editable: false, validation: { required: true } },
                                            MC_AVG_RPU: { editable: true, validation: { required: true } },
                                            MC_NULL: { editable: false, validation: { required: true } },
                                            MEET_COMP_STS: { editable: true, validation: { required: true } },
                                            CNTRCT_OBJ_SID: { editable: false, validation: { required: true } },
                                            PRC_ST_OBJ_SID: { editable: false, validation: { required: true } },
                                            PRC_TBL_OBJ_SID: { editable: false, validation: { required: true } },
                                            "_behaviors": { type: "object" }
                                        }
                                    }
                                },
                            },

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
                            pageable: false,
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
                                    field: "PRD_CAT_NM",
                                    title: "Vertical",
                                    width: 80,
                                    filterable: { multi: true, search: true, search: true },
                                    editable: function () { return false; }
                                },
                                {
                                    field: "OBJ_SET_TYPE",
                                    title: "Deal Type",
                                    width: 120
                                },
                                {
                                    field: "DEAL_OBJ_SID",
                                    title: "Deal ID",
                                    width: 120,
                                    filterable: { multi: true, search: true, search: true },
                                    template: "<div class='ovlpCell'><a onclick='gotoDealDetails(#=CNTRCT_OBJ_SID#,#=PRC_ST_OBJ_SID#, #= PRC_TBL_OBJ_SID # )' class='btnDeal'> #= DEAL_OBJ_SID # </a></div>"
                                },
                                {
                                    field: "COMP_SKU",
                                    title: "Meet Comp SKU",
                                    width: 170,
                                    filterable: { multi: true, search: true, search: true },
                                    editor: meetCompSKUEditor
                                },
                                {
                                    field: "COMP_PRC",
                                    title: "Meet Comp Price",
                                    width: "150px",
                                    format: "{0:c}",
                                    editor: meetCompPriceEditor
                                },
                                {
                                    field: "IA_BNCH",
                                    title: "IA Bench",
                                    width: 120,
                                    editor: editorIABench
                                },
                                {
                                    field: "COMP_BNCH",
                                    title: "Comp Bench",
                                    width: 120,
                                    editor: editorCOMPBench
                                },
                                {
                                    field: "MEET_COMP_STS",
                                    title: "Test Results",
                                    width: 120,
                                    editable: function () { return false; },
                                    hidden: $scope.hide_MEET_COMP_STS,
                                    template: "#if(MEET_COMP_STS == 'Pass' && COMP_OVRRD_FLG.length > 0) {#<div class='textRunIcon'><i class='intelicon-passed-completed-solid complete' title='Passed with Override Status' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS == 'Pass' && COMP_OVRRD_FLG.length == 0) {#<div class='textRunIcon'><i class='intelicon-passed-completed-solid completeGreen' title='Passed' style='font-size:20px !important'></i></div>#} else if(MEET_COMP_STS == 'Incomplete') {#<div class='textRunIcon'><i class='intelicon-help-solid incomplete' title='Incomplete' style='font-size:20px !important'></i></div>#} else{#<div class='textRunIcon'><i class='intelicon-alert-solid errorIcon' title='Error/Failed' style='font-size:20px !important'></i></div>#}#",

                                },
                                {
                                    field: "MC_LAST_RUN",
                                    title: "Last Run",
                                    template: "#= kendo.toString(new Date(MC_LAST_RUN), 'M/d/yyyy hh:MM:ss') #",
                                    width: 120,
                                    filterable: {
                                        extra: false,
                                        ui: "datepicker"
                                    },
                                    editable: function () { return false; },
                                    hidden: $scope.hide_MC_LAST_RUN
                                },
                                {
                                    field: "MC_AVG_RPU",
                                    title: "Avg. Net Price",
                                    width: 150,
                                    editable: function () { return false; },
                                    hidden: $scope.hide_MC_AVG_RPU
                                },
                                {
                                    field: "COMP_OVRRD_FLG",
                                    title: "Analysis Override",
                                    width: 150,
                                    editor: meetCompResultStatusEditor,
                                    filterable: { multi: true, search: true, search: true },
                                    hidden: $scope.hide_COMP_OVRRD_FLG
                                },
                                {
                                    field: "COMP_OVRRD_RSN",
                                    title: "Analysis Override Comments",
                                    width: 150,
                                    editor: editorORReason,
                                    filterable: { multi: true, search: true, search: true },
                                    hidden: $scope.hide_COMP_OVRRD_RSN
                                }
                            ]
                        });
                    };

                },
                    function (response) {
                        logger.error("Unable to get data", response, response.statusText);
                    });
            }


        }],
        link: function (scope, element, attrs) {

        }
    };
}