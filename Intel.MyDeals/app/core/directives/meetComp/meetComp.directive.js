angular
    .module('app.core')
    .directive('meetComp', meetComp);

meetComp.$inject = ['$compile', '$filter', 'dataService','securityService', '$timeout', 'logger', '$linq'];

function meetComp($compile, $filter, dataService, securityService, $timeout, logger, $linq) {
    kendo.culture("en-US");

    return {
        scope: {
            objSid: '='
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/meetComp/meetComp.directive.html',
        controller: ['$scope', 'dataService', function($scope, dataService) {
            $scope.CAN_VIEW_MEET_COMP = securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null);
            $scope.CAN_EDIT_MEET_COMP = securityService.chkDealRules('C_EDIT_MEET_COMP', window.usrRole, null, null, null);

            $scope.validationMessage = "";
            if (!$scope.CAN_VIEW_MEET_COMP) {
                $scope.validationMessage = "No Access. You do not have permissions to view this page";                
            }
            $scope.meetCompMasterdata = [];
            if (!!$scope.objSid) {
                $scope.loading = true;
                $scope.selectedCust = '';
                $scope.selectedCustomerText = '';
                $scope.curentRow = '';
                $scope.gridWidth = "1222px";
                dataService.get("api/MeetComp/GetMeetCompProductDetails/" + $scope.objSid).then(function(response) {
                    //https://stackoverflow.com/questions/27120928/getting-only-modified-or-new-kendo-ui-grid-rows-to-send-to-the-server
                    $scope.meetCompMasterdata = response.data;
                    $scope.meetCompUnchangedData = angular.copy(response.data);
                    $scope.meetCompUpdatedList = [];

                    //Add New Customer
                    $scope.addSKUForCustomer = function(mode) {
                        $scope.meetCompMasterdata[$scope.curentRow - 1].COMP_SKU = $scope.selectedCustomerText;

                        if (mode == "0" || mode == 0) {
                            $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = $scope.selectedCust;
                        }
                        else {
                            $scope.meetCompMasterdata[$scope.curentRow - 1].CUST_NM_SID = 1;
                        }

                        addToUpdateList(options.model, "COMP_SKU");
                    };

                    //Show Hide Column based on Role
                    function showHideColumnBasedOnRole(data) {
                        //Parent Grid
                        var grid = $("#grid").data("kendoGrid");
                        if (!!grid) {
                            angular.forEach(grid.columns, function(item, key) {
                                var columnValue = $filter('unique')(data, item.field);
                                if (usrRole == "FSE" && item.field !== undefined && (item.field == "MC_LAST_RUN" || item.field == "MEET_COMP_STS" || item.field == "MC_AVG_RPU" || item.field == "COMP_OVRRD_FLG" || item.field == "COMP_OVRRD_RSN")) {
                                    grid.hideColumn(item.field);//hide column
                                    $scope.gridWidth = "916px";
                                }
                                else if ((usrRole == "GA" || usrRole == "Super GA" || usrRole == "SA") && item.field !== undefined && (item.field == "MC_AVG_RPU" || item.field == "COMP_OVRRD_FLG" || item.field == "COMP_OVRRD_RSN")) {
                                    grid.hideColumn(item.field);//hide column
                                    $scope.gridWidth = "1187px";
                                }                                
                                else {
                                    grid.showColumn(item.field); //show column
                                }
                            });
                        }
                        $("#grid").data("kendoGrid").resize();

                    }


                    $scope.dataSource = new kendo.data.DataSource({
                        transport: {
                            read: function(e) {
                                e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                    .Where(function(x) {
                                        return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                                    }).ToArray());
                            },
                            create: function(e) {
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
                                    COMP_OVRRD_RSN: { editable: false, validation: { required: false } },
                                    CUST_NM_SID: { editable: false, validation: { required: true } },
                                    DEAL_OBJ_SID: { editable: false, validation: { required: true } },
                                    DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                    GRP_PRD_NM: { editable: false, validation: { required: true } },
                                    GRP_PRD_SID: { editable: false, validation: { required: true } },
                                    IA_BNCH: { editable: false, validation: { required: true }, type: "number" },
                                    COMP_BNCH: { editable: false, validation: { required: true }, type: "number" },
                                    MC_LAST_RUN: { editable: false, validation: { required: true } },
                                    COMP_PRC: { editable: false, validation: { required: true }, type: "number" },
                                    COMP_SKU: { editable: false, validation: { required: true } },
                                    MEET_COMP_UPD_FLG: { editable: false, validation: { required: true } },
                                    OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                    PRD_CAT_NM: { editable: false, validation: { required: true } },
                                    MC_AVG_RPU: { editable: false, validation: { required: true } },
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
                        dataSource: ($linq.Enumerable().From($scope.meetCompMasterdata)
                            .Where(function(x) {
                                return (x.GRP == "PRD" && x.DEFAULT_FLAG == "Y");
                            }).ToArray()),
                        filterable: true,
                        scrollable: true,
                        sortable: true,
                        navigatable: true,
                        resizable: false,
                        reorderable: true,
                        columnMenu: false,
                        groupable: false,
                        sort: function(e) { gridUtils.cancelChanges(e); },
                        filter: function(e) { gridUtils.cancelChanges(e); },
                        editable: true,
                        pageable: false,                        
                        dataBound: function() {
                            this.expandRow(this.tbody.find("tr.k-master-row").first());
                        },
                        columns: [
                            {
                                field: "PRD_CAT_NM",
                                title: "Vertical",
                                width: 80,
                                filterable: { multi: true, search: true, search: true },
                                editable: function() { return false; }
                            },
                            {
                                field: "GRP_PRD_NM",
                                title: "Product",
                                width: 120,
                                template: "<div title='#=GRP_PRD_NM#'>#=GRP_PRD_NM#</div>",
                                filterable: { multi: true, search: true, search: true },
                                editable: function() { return false; }
                            },
                            {
                                field: "DEAL_OBJ_SID",
                                title: "Deals",
                                width: 120,
                                filterable: { multi: true, search: true, search: true },
                                editable: function() { return false; }
                            },
                            {
                                field: "COMP_SKU",
                                title: "Meet Comp SKU",
                                width: 200,
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
                                template: "#if(MEET_COMP_STS == 'Pass') {#<i class='intelicon-passed-completed-solid complete'></i>#} else if(MEET_COMP_STS == 'Incomplete') {#<i class='intelicon-help-solid incomplete'></i>#} else{#<i class='intelicon-alert-solid errorIcon'></i>#}#",
                                editable: function() { return false; }
                            },
                            {
                                field: "MC_LAST_RUN",
                                title: "Last Run",
                                template: "#= kendo.toString(new Date(MC_LAST_RUN), 'M/d/yyyy') #",
                                width: 150,
                                filterable: {
                                    extra: false,
                                    ui: "datepicker"
                                },
                                editable: function() { return false; }
                            },
                            {
                                field: "MC_AVG_RPU",
                                title: "Avg. Net Price",
                                width: 150,
                                editable: function() { return false; }
                            },
                            {
                                field: "COMP_OVRRD_FLG",
                                title: "Analysis Override",
                                width: 150,
                                editor: meetCompResultStatusEditor
                            },
                            {
                                field: "COMP_OVRRD_RSN",
                                title: "Analysis Override Comments",
                                width: 150,
                                editor: editorORReason
                            }
                        ]
                    };

                    function editorIABench(container, options) {
                        if (usrRole == "DA" || usrRole == "SA") {
                            //DA only view
                        }
                        else {
                            $('<input id="IA_BNCH' + options.field + '" data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 2,
                                    format: "{0:c}",
                                    change: function(e) {
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].IA_BNCH = options.model.IA_BNCH;

                                        addToUpdateList(options.model, "IA_BNCH");
                                    }
                                });
                        }
                    }

                    function editorCOMPBench(container, options) {
                        if (usrRole == "DA" || usrRole == "SA") {
                            //DA only view
                        }
                        else {
                            $('<input id="COMP_BNCH' + options.field + '"  data-bind="value:' + options.field + '"/>')
                                .appendTo(container)
                                .kendoNumericTextBox({
                                    decimals: 2,
                                    format: "{0:c}",
                                    change: function(e) {
                                        $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_BNCH = options.model.COMP_BNCH;
                                        addToUpdateList(options.model, "COMP_BNCH");
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
                                .Where(function(x) {
                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == options.model.GRP);
                                })
                                .GroupBy(function(x) {
                                    return (x.COMP_SKU);
                                })
                                .Select(function(x) {
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
                                    change: function(e) {
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

                                            $scope.dataSource.sync();
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

                                        //var uid = this.element.closest("[data-uid]").data("uid"),
                                        //    dataSource = $("#grid").data("kendoGrid").dataSource,
                                        //    item = dataSource.getByUid(uid);
                                        //item.dirty = true;


                                        //kendo.confirm("Would you like to save your new entry for your customer only or publish for others to use?<br/><input type='radio' name='custType' value='ADD' onclick='addConfirm(value)' checked>Publish for just this Customer<br><input type='radio' name='custType' value='1'>Publish for all customers ").then(function () {
                                        //    options.model.COMP_PRC = this.value();
                                        //    //$scope.dataSource.read();
                                        //    //$("#grid").find("tr[data-uid='" + options.model.uid + "'] td:eq(6)").text(parseFloat(this.value()).toFixed(2));
                                        //    alert('clicked');
                                        //}, function () {
                                        //    kendo.alert("You chose to Cancel action.");
                                        //});    
                                    }
                                });
                        }
                    }

                    function meetCompPriceEditor(container, options) {
                        if (usrRole == "DA" || usrRole == "SA") {
                            //DA only view
                        }
                        else {
                            var tempData = $linq.Enumerable().From($scope.meetCompUnchangedData)
                                .Where(function(x) {
                                    return (x.GRP_PRD_SID == options.model.GRP_PRD_SID && x.GRP == options.model.GRP);
                                })
                                .GroupBy(function(x) {
                                    return (x.COMP_PRC);
                                })
                                .Select(function(x) {
                                    return {
                                        'COMP_PRC': parseFloat(x.source[0].COMP_PRC).toFixed(2),
                                        'RW_NM': x.source[0].RW_NM
                                    };
                                }).ToArray();

                            $('<input id="productEditor" validationMessage="* field is required" placeholder="Enter Comp Price.."' +
                                'required name="' + options.field + '" />')
                                .appendTo(container)
                                .kendoComboBox({
                                    optionLabel: "Select Comp Prices",
                                    filter: "startsWith",
                                    autoBind: true,
                                    dataTextField: "COMP_PRC",
                                    dataValueField: "RW_NM",
                                    format: "{0:c}",
                                    dataSource: {
                                        data: tempData
                                    },
                                    change: function(e) {
                                        var selectedIndx = this.selectedIndex;
                                        var selectedValue = this.value();
                                        if (selectedIndx == -1) {
                                            options.model.COMP_PRC = parseFloat(this.text()).toFixed(2);

                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat(this.text()).toFixed(2);

                                        }
                                        else {
                                            options.model.COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);

                                            $scope.meetCompMasterdata[options.model.RW_NM - 1].COMP_PRC = parseFloat($scope.meetCompUnchangedData[selectedValue - 1].COMP_PRC).toFixed(2);

                                        }

                                        if (options.model.GRP == "PRD")
                                            $("#grid").find("tr[data-uid='" + options.model.uid + "'] td:eq(5)").text("$" + parseFloat(this.text()).toFixed(2));
                                        else
                                            $("#myDealsGrid").find("tr[data-uid='" + options.model.uid + "'] td:eq(5)").text("$" + parseFloat(this.text()).toFixed(2));

                                        $scope.dataSource.read();

                                        addToUpdateList(options.model, "COMP_PRC");

                                    }
                                });
                        }
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
                                    change: function(e) {
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
                                    change: function(e) {
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

                        //var dataSource = $("#grid").data("kendoGrid").dataSource.data();

                        //var dirty = $.grep(dataSource, function (item) {
                        //    return item.dirty
                        //});
                    }
                    $scope.setBusy = function(msg, detail) {
                        $timeout(function() {
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
                                $timeout(function() {
                                    $scope.isBusyMsgTitle = msg;
                                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                                }, 500);
                            }
                        });
                    }
                    $scope.saveAndRunMeetComp = function() {
                        $scope.setBusy("Running Meet Comp...", "Please wait running Meet Comp...");
                    }

                    $scope.gotoDealDetails = function(dataItem) {
                        var win = window.open("Contract#/manager/" + dataItem.CNTRCT_OBJ_SID + "/" + dataItem.PRC_ST_OBJ_SID + "/" + dataItem.PRC_TBL_OBJ_SID + "/wip", '_blank');
                        win.focus();
                    }
                    function gridDataBound(e) {
                        var childGrid = $("#myDealsGrid").data("kendoGrid");
                        if (!!childGrid) {
                            angular.forEach(childGrid.columns, function(item, key) {
                                var columnValue = $filter('unique')($scope.meetCompUnchangedData, item.field);
                                if (usrRole == "FSE" && item.field !== undefined && (item.field == "MC_LAST_RUN" || item.field == "MEET_COMP_STS" || item.field == "MC_AVG_RPU" || item.field == "COMP_OVRRD_FLG" || item.field == "COMP_OVRRD_RSN")) {
                                    childGrid.hideColumn(item.field);//hide column
                                }
                                else if ((usrRole == "GA" || usrRole == "Super GA" || usrRole == "SA") && item.field !== undefined && (item.field == "MC_AVG_RPU" || item.field == "COMP_OVRRD_FLG" || item.field == "COMP_OVRRD_RSN")) {
                                    childGrid.hideColumn(item.field);//hide column                                    
                                }
                                else {
                                    childGrid.showColumn(item.field); //show column
                                }
                            });
                        }
                    };
                    $scope.detailGridOptions = function(dataItem) {
                        return {
                            dataSource: {
                                transport: {
                                    read: function(e) {
                                        e.success($linq.Enumerable().From($scope.meetCompMasterdata)
                                            .Where(function(x) {
                                                return (x.GRP_PRD_SID == dataItem.GRP_PRD_SID && x.GRP == "DEAL" && x.DEFAULT_FLAG == "D");
                                            }).ToArray());
                                    },
                                    create: function(e) {
                                    }
                                },
                                pageSize: 500,
                                schema: {
                                    model: {
                                        id: "RW_NM",
                                        fields: {
                                            DEAL_OBJ_SID: {
                                                editable: false, nullable: true
                                            },
                                            RW_NM: { editable: false, validation: { required: true } },
                                            COMP_OVRRD_FLG: { editable: true, validation: { required: true } },
                                            COMP_OVRRD_RSN: { editable: true, validation: { required: false } },
                                            CUST_NM_SID: { editable: false, validation: { required: true } },
                                            DEAL_OBJ_SID: { editable: false, validation: { required: true } },
                                            DEAL_OBJ_TYPE_SID: { editable: false, validation: { required: true } },
                                            GRP_PRD_NM: { editable: false, validation: { required: true } },
                                            GRP_PRD_SID: { editable: false, validation: { required: true } },
                                            IA_BNCH: { editable: false, validation: { required: true } },
                                            MC_LAST_RUN: { editable: false, validation: { required: true } },
                                            COMP_SKU: { editable: true, validation: { required: true } },
                                            COMP_PRC: { editable: true, validation: { required: true } },
                                            MEET_COMP_UPD_FLG: { editable: false, validation: { required: true } },
                                            OBJ_SET_TYPE: { editable: false, validation: { required: true } },
                                            PRD_CAT_NM: { editable: false, validation: { required: true } },
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
                            sort: function(e) { gridUtils.cancelChanges(e); },
                            filter: function(e) { gridUtils.cancelChanges(e); },
                            editable: true,
                            pageable: false,
                            dataBound: gridDataBound,                            
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
                                    editor: meetCompSKUEditor
                                },
                                { field: "COMP_PRC", title: "Meet Comp Price", width: "120px", format: "{0:c}" },
                                {
                                    field: "MEET_COMP_STS",
                                    title: "Test Results",
                                    width: 120,
                                    editable: function() { return false; },
                                    template: "#if(MEET_COMP_STS == 'Pass') {#<i class='intelicon-passed-completed-solid complete'></i>#} else if(MEET_COMP_STS == 'Incomplete') {#<i class='intelicon-help-solid incomplete'></i>#} else{#<i class='intelicon-alert-solid errorIcon'></i>#}#"

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
                                    editable: function() { return false; }
                                },
                                {
                                    field: "MC_AVG_RPU",
                                    title: "Avg. Net Price",
                                    width: 120,
                                    editable: function() { return false; }
                                },
                                {
                                    field: "COMP_OVRRD_FLG",
                                    title: "Analysis Override",
                                    width: 150,
                                    editor: meetCompResultStatusEditor
                                },
                                {
                                    field: "COMP_OVRRD_RSN",
                                    title: "Analysis Override Comments",
                                    width: 150,
                                    editor: editorORReason
                                }
                            ]
                        };
                    };

                    $timeout(function() {
                        showHideColumnBasedOnRole($scope.meetCompUnchangedData);
                    });


                },
                    function(response) {
                        logger.error("Unable to get data", response, response.statusText);
                    });
            }


        }],
        link: function(scope, element, attrs) {

        }
    };
}