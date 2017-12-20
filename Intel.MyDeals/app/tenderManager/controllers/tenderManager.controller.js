(function () {
    'use strict';

    angular
        .module('app.tenderManager')
        .controller('TenderManagerController', TenderManagerController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    TenderManagerController.$inject = ['$scope', '$state', '$filter', '$localStorage', '$compile', '$uibModal', '$timeout', '$q', 'objsetService', 'templatesService', 'logger', '$window', '$linq'];

    function TenderManagerController($scope, $state, $filter, $localStorage, $compile, $uibModal, $timeout, $q, objsetService, templatesService, logger, $window, $linq) {

        $scope.data = [];
        $scope.options = {};
        $scope.optionsDetails = {};
        $scope.dataDetails = {};
        $scope.newDataItemToAddOnExpand = null;

        $scope.isBusy = false;
        $scope.isBusyMsgTitle = "";
        $scope.isBusyMsgDetail = "";
        $scope.isBusyType = "";
        $scope.newDealId = -100;
        $scope.startDt = "1/1/2017";
        $scope.endDt = "12/31/2017";
        $scope.searchText = "";
        $scope.curLinkedVal = "";

        $scope.ds = new kendo.data.DataSource({
            type: 'odata',
            transport: {
                read: {
                    url: function() {
                        var st = $scope.startDt.replace(/\//g, '-');
                        var en = $scope.endDt.replace(/\//g, '-');
                        var searchText = $scope.searchText;
                        if (searchText === "") searchText = "null";
                        return "/api/Tenders/v1/GetTenderList/" + st + "/" + en + "/" + searchText;
                    },
                    type: "GET",
                    //data: function() {
                    //    return $scope.buildData();
                    //},
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    fields: {
                        DC_ID: { type: "number" },
                        TITLE: { type: "string" },
                        BID_STATUS: { type: "string" },
                        OBJ_SET_TYPE_CD: { type: "string" },
                        PASSED_VALIDATION: { type: "string" },
                        WF_STG_CD: { type: "string" },
                        TRKR_NBR: { type: "object" },
                        PRODUCT_FILTER: { type: "object" },
                        START_DT: { type: "date" },
                        END_DT: { type: "date" },
                        VOLUME: { type: "number" },
                        REBATE_TYPE: { type: "string" },
                        END_CUSTOMER_RETAIL: { type: "string" },
                        ECAP_PRICE: { type: "object" },
                        CAP: { type: "object" },
                        QLTR_PROJECT: { type: "string" },
                        QLTR_BID_GEO: { type: "string" },
                        GEO_COMBINED: { type: "string" }
                    }
                },
                data: function(data) {
                    return data["Items"];
                },
                total: function(data) {
                    return data["Count"];
                }
            },
            pageSize: 25,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            requestStart: function(e) {
                $scope.setBusy("Searching...", "Searching for Tender Deals");
            },
            requestEnd: function(e) {
                $scope.setBusy("", "");
            }
        });

        $scope.gridOptions = {
            toolbar: kendo.template($("#toolbar-template").html()),
            autoBind: false,
            dataSource: $scope.ds,

            filterable: {
                extra: false,
                operators: {
                    string: {
                        contains: "Contains"
                    },
                    object: {
                        contains: "Contains"
                    }
                }
            },
            sortable: true,
            resizable: true,
            scrollable: true,            
            pageable: {
                pageSizes: [25, 100, 250, "all"]
            },

            columns: [
                {
                    field: "DC_ID",
                    title: "&nbsp;",
                    width: 50,
                    filterable: false,
                    sortable: false,
                    template: "<deal-tools-tender ng-model='dataItem' is-editable='true' ng-if='canShowCheckBox(dataItem)'></deal-tools>"
                }, {
                    field: "BID_STATUS",
                    title: "Bid Action",
                    template: "<div id='cb_actn_#=data.DC_ID#'>#=gridUtils.getBidActions(data)#</div>",
                    width: 110
                }, {
                    field: "DC_ID",
                    filterable: false,
                    title: "Deal",
                    width: 100,
                    template: "<div ng-click='navToPath(dataItem)' class='tenderDealId'>#=data.DC_ID#</div>"
                }, {
                    field: "PRODUCT_FILTER",
                    title: "Product",
                    width: 200,
                    filterable: {
                        ui: function (element) {
                            element.kendoAutoComplete({
                                dataSource: []
                            });
                        }
                    },
                    template: "#= gridUtils.tenderDim(data, 'PRODUCT_FILTER') #"
                }, {
                    field: "TRKR_NBR",
                    title: "Tracker #",
                    width: 180,
                    filterable: {
                        ui: function (element) {
                            element.kendoAutoComplete({
                                dataSource: []
                            });
                        }
                    },
                    template: "#= gridUtils.tenderDim(data, 'TRKR_NBR') #"
                }, {
                    field: "ECAP_PRICE",
                    title: "ECAP Price",
                    width: 130,
                    format: "{0:c}",
                    filterable: {
                        ui: function (element) {
                            element[0].className = "k-textbox";
                        }
                    },
                    template: "#= gridUtils.tenderDim(data, 'ECAP_PRICE', 'c') #"
                }, {
                    field: "CAP",
                    title: "CAP",
                    width: 130,
                    format: "{0:c}",
                    filterable: {
                        ui: function (element) {
                            element[0].className = "k-textbox";
                        }
                    },
                    template: "#= gridUtils.tenderDim(data, 'CAP', 'c') #"
                }, {
                    field: "YCS2_PRC_IRBT",
                    title: "YCS2",
                    width: 130,
                    format: "{0:c}",
                    filterable: {
                        ui: function (element) {
                            element[0].className = "k-textbox";
                        }
                    },
                    template: "#= gridUtils.tenderDim(data, 'YCS2_PRC_IRBT', 'c') #"
                }, {
                    field: "START_DT",
                    title: "Start Date",
                    template: "#= moment(START_DT).format('MM/DD/YYYY') #",
                    width: 110
                }, {
                    field: "END_DT",
                    title: "End Date",
                    template: "#= moment(END_DT).format('MM/DD/YYYY') #",
                    width: 110
                }, {
                    field: "VOLUME",
                    title: "Ceiling Vol",
                    width: 120
                }, {
                    field: "OBJ_SET_TYPE_CD",
                    title: "Type",
                    width: 100
                }, {
                    field: "END_CUSTOMER_RETAIL",
                    title: "End Customer",
                    width: 140
                }, {
                    field: "Customer.CUST_DIV_NM",
                    title: "OEM",
                    width: 140
                }, {
                    field: "QLTR_PROJECT",
                    title: "Project Name",
                    width: 140
                }, {
                    field: "QLTR_BID_GEO",
                    title: "Bid Geo",
                    width: 100
                }, {
                    field: "GEO_COMBINED",
                    title: "Geo",
                    width: 100
                }
            ]

        }

        $($window).resize(function () {
            $(".tender-grid").data("kendoGrid").resize();
        });

        $scope.navToPath = function(dataItem) {
            $scope.setBusy("Looking for Contract", "Looking for the deal's contract");
            objsetService.getPath(dataItem.DC_ID, "WIP_DEAL").then(
                    function (data) {

                        $scope.setBusy("Found Contract", "Redirecting you there now", "Success");
                        $timeout(function () {
                            $scope.setBusy("", "");
                        }, 4000);
                        topbar.hide();

                        document.location.href = "/Contract#/manager/" + data.data;

                    },
                    function (response) {
                        logger.error("Could not find the Deal's contract.", response, response.statusText);
                        topbar.hide();
                    }
                );
        }

        $scope.canShowCheckBox = function (dataItem) {
            if (dataItem.BID_ACTNS === undefined) return "";
            return dataItem.BID_ACTNS.length > 1 && ($scope.curLinkedVal === "" || $scope.curLinkedVal === dataItem.BID_STATUS);
        }

        $scope.chkClick = function (dataItem) {
            var isLinked = dataItem.isLinked;
            if (isLinked) {
                $scope.curLinkedVal = dataItem.BID_STATUS;
            } else {
                var data = $scope.ds.data();
                var linkedData = $linq.Enumerable().From(data)
                                .Where(function (x) {
                                    return (x.isLinked);
                                }).ToArray();
                if (linkedData.length === 0) $scope.curLinkedVal = "";
            }
        }

        $scope.changeBidAction = function (e) {
            var dataItem = e.sender.$angular_scope.dataItem;
            var newVal = dataItem.BID_STATUS;
            var dsData = $scope.ds.data();
            var ids = [];

            // now update all checked items if the current one is checked
            if (dataItem.isLinked) {
                for (var d = 0; d < dsData.length; d++) {
                    if (dsData[d].isLinked) {
                        dsData[d].BID_STATUS = newVal;
                        ids.push(dsData[d].DC_ID);
                    }
                }
            } else {
                ids.push(dataItem.DC_ID);   
            }

            var plural = ids.length > 1 ? "s" : "";
            var msg = "";
            if (newVal === "Won") msg = "Would you like to mark the Tender Deal" + plural + " as 'Won'?  This will generate a Tracker Number.";
            if (newVal === "Lost") msg = "Would you like to mark the Tender Deal" + plural + " as 'Lost'?";
            if (newVal === "Offer") msg = "Would you like to re-open the Tender Deal" + plural + " and set to 'Offer'?";

            kendo.confirm(msg)
                .then(function () {
                    //Save the changes
                    $scope.actionTenderDeals(ids.join(","), newVal);
                },
                function () {
                    dataItem["BID_STATUS"] = dataItem["orig_BID_STATUS"];
                    $scope.ds.read();
                });

        }

        $scope.actionTenderDeals = function (strIds, actn) {
            $scope.setBusy("Updating Tender Bids...", "Please wait as we update the Tender Deals!");
            objsetService.actionTenderDeals(strIds, actn).then(
                function (data) {

                    var foundIt = false;
                    $scope.messages = data.data.Messages;

                    for (var m = 0; m < $scope.messages.length; m++) {
                        if ($scope.messages[m].Message === "Action List") {
                            foundIt = true;
                        }
                    }

                    if (foundIt) {
                        $scope.curLinkedVal = "";
                        $scope.ds.read();
                    }

                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 50);
                },
                function (result) {
                    //debugger;
                }
            );
        }

        $scope.buildData = function () {
            var grid = $(".tender-grid").data("kendoGrid");
            var filters = grid.dataSource.filter();

            return {
                StrStart: $scope.startDt,
                StrEnd: $scope.endDt,
                StrWhere: $scope.searchText,
                StrFilters: filters,
                StrSorts: $scope.searchText
            };
        }
        $scope.setBusy = function (msg, detail, msgType) {
            $timeout(function () {
                var newState = msg != undefined && msg !== "";

                // if no change in state, simple update the text
                if ($scope.isBusy === newState) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    return;
                }

                $scope.isBusy = newState;
                if ($scope.isBusy) {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                } else {
                    $timeout(function () {
                        $scope.isBusyMsgTitle = msg;
                        $scope.isBusyMsgDetail = !detail ? "" : detail;
                        $scope.isBusyType = msgType;
                    }, 500);
                }
            });
        }

        $scope.loadData = function () {
            $scope.gridOptions.dataSource.read();
        }

        $scope.renderCustNm = function (dataItem) {
            return dataItem.CUST_MBR_SID;
        }

        function applyTempSecurities(data, mode) {
            // TODO temp override security until it can be setup
            for (var i = 0; i < data.length; i++) {
                applyTempSecurity(data[i], mode);
            }
        }
        function applyTempSecurity(data, mode) {
            // TODO temp override security until it can be setup

            if (!data._behaviors) data._behaviors = {};
            //if (!data._behaviors.isReadOnly)
            data._behaviors.isReadOnly = {};
            //if (!data._behaviors.isRequired)
            data._behaviors.isRequired = {};
            //if (!data._behaviors.isHidden)
            data._behaviors.isHidden = {};

            if (mode === "WIP_DEAL") {
                data._behaviors.isReadOnly["WF_STG_CD"] = true;
                data._behaviors.isReadOnly["CAP_INFO"] = true;
                data._behaviors.isReadOnly["PTR_USER_PRD"] = true;
                data._behaviors.isReadOnly["TITLE"] = true;
                data._behaviors.isReadOnly["END_CUSTOMER_RETAIL"] = true;
            } else if (mode === "MASTER") {
                data._behaviors.isReadOnly["Customer"] = true;
                data._behaviors.isReadOnly["CUST_MBR_SID"] = true;
                data._behaviors.isReadOnly["WF_STG_CD"] = true;
                data._behaviors.isReadOnly["CAP_INFO"] = true;
                data._behaviors.isReadOnly["TITLE"] = true;
            }

        }

        $scope.saveCell = function (dataItem, newField, scopeDirective, newValue) {
            debugger;
            $timeout(function () {
                if (newField === "Customer") dataItem.CUST_MBR_SID = dataItem.Customer.CUST_SID;

                if (dataItem._behaviors === undefined) dataItem._behaviors = {};
                if (dataItem._behaviors.isDirty === undefined) dataItem._behaviors.isDirty = {};
                dataItem._behaviors.isDirty[newField] = true;
                dataItem._dirty = true;
                $scope._dirty = true;

                $timeout(function () {
                    //scopeDirective.contractDs.sync();
                }, 100);
            }, 100);
            
        }

        $scope.saveEntireContract = function () {
            var data = $scope.data;
            debugger;
        }

        $scope.saveAndValidate = function () {
            debugger;
            $scope.$broadcast('saveOpGridData');
        }




    }
})();