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
                $scope.IS_COMP_BNCH_CHNG = false;
                $scope.IS_IA_BNCH_CHNG = false;
                $scope.usrColor = 'RED';
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
                        var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                            .Where(function (x) {
                                return (x.GRP_PRD_SID == $scope.meetCompMasterdata[$scope.curentRow - 1].GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true);
                            })
                            .ToArray();


                        for (var i = 0; i < tempData.length; i++) {
                            $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_SKU = $scope.selectedCustomerText;
                            addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_SKU");
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
                        columnMenu: true,
                        groupable: false,
                        sort: function (e) { gridUtils.cancelChanges(e); },
                        filter: function (e) { gridUtils.cancelChanges(e); },
                        editable: true,
                        pageable: true,
                        detailInit: detailInit,
                        dataBound: function () {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());
                            //var child = $(e.detailCell).children().data('kendoGrid');
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
                                width: 200,
                                filterable: { multi: true, search: true, search: true },
                                editor: meetCompSKUEditor
                            },
                            {
                                field: "COMP_PRC",
                                title: "Meet Comp Price",
                                width: 120,
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
                                template: "#if(MEET_COMP_STS == 'Pass') {#<i class='intelicon-passed-completed-solid complete' style='font-size:20px !important'></i>#} else if(MEET_COMP_STS == 'Incomplete') {#<i class='intelicon-help-solid incomplete' style='font-size:20px !important'></i>#} else{#<i class='intelicon-alert-solid errorIcon' style='font-size:20px !important'></i>#}#",
                                editable: function () { return false; },
                                hidden: $scope.hide_MEET_COMP_STS
                            },
                            {
                                field: "MC_LAST_RUN",
                                title: "Last Run",
                                template: "#= kendo.toString(new Date(MC_LAST_RUN), 'M/d/yyyy') #",
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
                        if (usrRole == "DA" || usrRole == "SA" || options.model.PRD_CAT_NM != "SvrWS") {
                            //DA only view
                        }
                        else {
                            $('<input id="IA_BNCH' + options.field + '" data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 0,
                                    min: 0,
                                    format: "{0:c}",
                                    change: function (e) {
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].IA_BNCH = options.model.IA_BNCH;

                                        addToUpdateList(options.model, "IA_BNCH");

                                        $scope.IS_IA_BNCH_CHNG = true;
                                    }
                                });
                        }
                    }

                    function editorCOMPBench(container, options) {
                        if (usrRole == "DA" || usrRole == "SA" || options.model.PRD_CAT_NM != "SvrWS") {
                            //DA only view
                        }
                        else {
                            $('<input id="COMP_BNCH' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 0,
                                    min: 0,
                                    format: "{0:c}",
                                    change: function (e) {
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                        addToUpdateList(options.model, "COMP_BNCH");
                                        $scope.IS_COMP_BNCH_CHNG = true;
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
                                    dataValueField: "RW_NM",
                                    noDataTemplate: $("#noDataTemplate").html(),
                                    //noDataTemplate: '<div>No data found. Do you want to add new item ?</div><br /><button class="k-button" ng-click="addConfirm()">Add new item</button>',
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
                                            //TODO: UPDATE COMP_PRC -- UPDATE PRC of CHILD if something is BLANK     
                                            if (options.model.GRP == "PRD") {

                                            }

                                            $scope.dataSourceParent.sync();
                                            var selectedValue = this.value();
                                            options.model.COMP_SKU = this.text();
                                            options.model.COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);
                                            if (options.model.GRP == "PRD")
                                                $("#grid").find("tr[data-uid='" + options.model.uid + "'] td:eq(5)").text("$" + parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2));
                                            else
                                                $("#myDealsGrid").find("tr[data-uid='" + options.model.uid + "'] td:eq(3)").text("$" + parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2));



                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_SKU = this.text();
                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);

                                            $scope.dataSource.read();

                                            addToUpdateList(options.model, "COMP_SKU");
                                        }
                                    }
                                });
                        }
                    }

                    function meetCompPriceEditor(container, options) {
                        if (usrRole == "DA" || usrRole == "SA") {
                            //DA only view
                        }
                        else {
                            $('<input id="COMP_PRC' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 2,
                                    min: 0.01,
                                    format: "{0:c}",
                                    change: function (e) {
                                        if (options.model.GRP == "PRD") {
                                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                                .Where(function (x) {
                                                    return (x.GRP_PRD_SID == options.model.RW_NM.GRP_PRD_SID && x.GRP == "DEAL" && x.MC_NULL == true);
                                                })
                                                .ToArray();

                                            for (var i = 0; i < tempData.length; i++) {
                                                $scope.meetCompMasterdata[tempData[i].RW_NM - 1].COMP_PRC = $scope.selectedCustomerText;
                                                addToUpdateList($scope.meetCompMasterdata[tempData[i].RW_NM - 1], "COMP_PRC");
                                            }
                                        }
                                        else {
                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = options.model.COMP_PRC;
                                            addToUpdateList(options.model, "COMP_PRC");
                                        }

                                        $scope.dataSourceParent.read();
                                    }
                                });
                        }
                        //    var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                        //        .Where(function(x) {
                        //            return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == options.model.GRP);
                        //        })
                        //        .GroupBy(function(x) {
                        //            return (x.COMP_PRC);
                        //        })
                        //        .Select(function(x) {
                        //            return {
                        //                'COMP_PRC': parseFloat(x.source[0].COMP_PRC).toFixed(2),
                        //                'RW_NM': x.source[0].RW_NM
                        //            };
                        //        }).ToArray();

                        //    $('<input id="productEditor" validationMessage="* field is required" placeholder="Enter Comp Price.."' +
                        //        'required name="' + options.field + '" />')
                        //        .appendTo(container)
                        //        .kendoComboBox({
                        //            optionLabel: "Select Comp Prices",
                        //            filter: "startsWith",
                        //            autoBind: true,
                        //            dataTextField: "COMP_PRC",
                        //            dataValueField: "RW_NM",
                        //            format: "{0:c}",
                        //            dataSource: {
                        //                data: tempData
                        //            },
                        //            change: function(e) {
                        //                var selectedIndx = this.selectedIndex;
                        //                var selectedValue = this.value();
                        //                if (selectedIndx == -1) {
                        //                    options.model.COMP_PRC = parseFloat(this.text()).toFixed(2);

                        //                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat(this.text()).toFixed(2);

                        //                }
                        //                else {
                        //                    options.model.COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);

                        //                    $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);

                        //                }

                        //                if (options.model.GRP == "PRD")
                        //                    $("#grid").find("tr[data-uid='" + options.model.uid + "'] td:eq(5)").text("$" + parseFloat(this.text()).toFixed(2));
                        //                else
                        //                    $("#myDealsGrid").find("tr[data-uid='" + options.model.uid + "'] td:eq(5)").text("$" + parseFloat(this.text()).toFixed(2));

                        //                $scope.dataSource.read();

                        //                addToUpdateList(options.model, "COMP_PRC");

                        //            }
                        //        });
                        //}
                    }

                    function meetCompResultStatusEditor(container, options) {
                        //IF MEET COMP STATUS FAILED THEN Only Override Option will be available.
                        if (options.model.MEET_COMP_STS != 'Failed' && usrRole == "DA") {
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
                                        addToUpdateList(options.model, "COMP_OVRRD_FLG");
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
                                    }
                                });

                            //$('<textarea data-bind="value: ' + options.field + '"></textarea>')
                            //    .appendTo(container)
                            //    .kendoEditor({
                            //        change: function(e) {
                            //            alert('UFF');
                            //        }
                            //    });
                            //return options.model.COMP_OVRRD_RSN;

                        }
                        else {
                            logger.error("Meet Comp Override Status can not be blank");
                        }

                    }

                    function addToUpdateList(dataItem, FIELD_NM) {
                        var indx = $scope.meetCompUpdatedList.findIndex(item => item.RW_NM == dataItem.RW_NM);

                        if (indx > -1) {
                            $scope.meetCompUpdatedList.splice(indx, 1);
                        }

                        $scope.meetCompUpdatedList.push(dataItem);

                        $scope.setUpdateFlag = true;
                        //var dataSource = $("#grid").data("kendoGrid").dataSource.data();

                        //var dirty = $.grep(dataSource, function (item) {
                        //    return item.dirty
                        //});
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
                        $scope.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                        $scope.isValid = true;
                        $scope.ROW_NMB = [];

                        $scope.meetCompUpdatedList = $scope.meetCompUpdatedList.map(function (x) {
                            if (usrRole == "GA" || usrRole == "FSE" || usrRole == "Super GA") {
                                if (x.COMP_BNCH < 1 && $scope.IS_COMP_BNCH_CHNG) {   
                                    $scope.isValid = false;                                    
                                }
                                if (x.IA_BNCH < 1 && $scope.IS_IA_BNCH_CHNG) {
                                    $scope.isValid = false;                                    
                                }
                                if (!$scope.isValid) {
                                    $scope.ROW_NMB.push(x.RW_NM);
                                }

                            }
                            else {
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
                            }

                        });
                        if ($scope.meetCompUpdatedList.length > 0) {  
                            if ($scope.isValid) {
                                dataService.post("api/MeetComp/UpdateMeetCompProductDetails/" + $scope.objSid, $scope.meetCompUpdatedList).then(function (response) {
                                    $scope.meetCompMasterdata = response.data;
                                    $scope.meetCompUnchangedData = angular.copy(response.data);
                                    $scope.dataSourceParent.read();
                                    $scope.isBusy = false;
                                },
                                    function (response) {
                                        logger.error("Unable to save data", response, response.statusText);
                                        $scope.isBusy = false;
                                    }); 
                            }
                            else {
                                kendo.alert("ROW(s): " + $scope.ROW_NMB.toString() + " Error in IA Bench or Comp Bench");
                            }
                                                           
                        }
                        else {
                            kendo.alert('No data Found');
                        }
                    }

                    $scope.gotoDealDetails = function (dataItem) {
                        var win = window.open("Contract#/manager/" + dataItem.CNTRCT_OBJ_SID + "/" + dataItem.PRC_ST_OBJ_SID + "/" + dataItem.PRC_TBL_OBJ_SID + "/wip", '_blank');
                        win.focus();
                    }

                    function detailInit(e) {
                        $scope.TEMP_GRP_PRD_SID = e.data.GRP_PRD_SID;
                        $("<div class='childGrid'/>").appendTo(e.detailCell).kendoGrid({
                            dataSource: {
                                transport: {
                                    read: function (e) {
                                        //e.success($scope.meetCompMasterdata)
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
                                //filter: [{ field: "GRP_PRD_SID", operator: "eq", value: $scope.TEMP_GRP_PRD_SID }, { field: "GRP", operator: "eq", value: "DEAL" }, { field: "DEFAULT_FLAG", operator: "eq", value: "D" }],
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
                            columns: [
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
                                    template: "<div class='ovlpCell'><a ng-click='gotoDealDetails(dataItem)' class='btnDeal'> #= DEAL_OBJ_SID # </a></div>"
                                },
                                {
                                    field: "COMP_SKU",
                                    title: "Meet Comp SKU",
                                    width: 200,
                                    filterable: { multi: true, search: true, search: true },
                                    editor: meetCompSKUEditor
                                },
                                {
                                    field: "COMP_PRC",
                                    title: "Meet Comp Price",
                                    width: "120px",
                                    format: "{0:c}",
                                    editor: meetCompPriceEditor
                                },
                                {
                                    field: "IA_BNCH",
                                    title: "IA Bench",
                                    width: 120,
                                    template: "<div style='color: {{usrColor}}'> </div>",
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
                                    template: "#if(MEET_COMP_STS == 'Pass') {#<i class='intelicon-passed-completed-solid complete' style='font-size:20px !important'></i>#} else if(MEET_COMP_STS == 'Incomplete') {#<i class='intelicon-help-solid incomplete' style='font-size:20px !important'></i>#} else{#<i class='intelicon-alert-solid errorIcon' style='font-size:20px !important'></i>#}#"

                                },
                                {
                                    field: "MC_LAST_RUN",
                                    title: "Last Run",
                                    template: "#= kendo.toString(new Date(MC_LAST_RUN), 'M/d/yyyy') #",
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