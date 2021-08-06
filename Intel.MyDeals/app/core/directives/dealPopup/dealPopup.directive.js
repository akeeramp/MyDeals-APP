angular
    .module('app.core')
    .directive('dealPopup', dealPopup);

dealPopup.$inject = ['objsetService', '$timeout', 'logger', 'colorDictionary', 'opGridTemplate', 'securityService'];

function dealPopup(objsetService, $timeout, logger, colorDictionary, opGridTemplate, securityService) {
    kendo.culture("en-US");
    return {
        scope: {
            dealId: '=',
            initLeft: '=',
            initTop: '=',
            isOpen: '='
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/dealPopup/dealPopup.directive.html',
        controller: ['$scope', 'objsetService', function ($scope, objsetService) {

            $scope.CAN_VIEW_COST_TEST = securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper); // Can view the pass/fail
            $scope.CAN_VIEW_MEET_COMP = securityService.chkDealRules('CAN_VIEW_MEET_COMP', window.usrRole, null, null, null);

            //open and close menu when the button is clicked
            $scope.open = false;
            $scope.openWithData = false;
            $scope.isLoading = true;
            $scope.data = {};
            $scope.path = {};
            $scope.atrbMap = {};
            $scope.sel = 0;
            $scope.showPanel = false;
            $scope.properties = [];
            $scope.helpTip = 0;
            $scope.percData = {};

            $scope.groups = [];
            $scope.groupColumns = {};

            $scope.timelineLoaded = false;
            $scope.timelineData = [];
            $scope.timelineDs = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "api/Timeline/GetObjTimelineDetails",
                        type: "POST",
                        data: {
                            objSid: $scope.dealId,
                            objTypeSid: 5,
                            objTypeIds: [5]
                        }
                    }
                },
                schema: {
                    parse: function (data) {
                        for (var d = 0; d < data.length; d++) {
                            data[d]["user"] = data[d]["FRST_NM"] + " " + data[d]["LST_NM"];
                            data[d]["ATRB_VAL"] = data[d]["ATRB_VAL"].replace(/; /g, '<br/>');
                        }
                        return data;
                    },
                    model: {
                        fields: {
                            user: { type: "string" }
                        }
                    }
                },
                requestEnd: function (e) {
                    $scope.timelineLoaded = true;
                    $scope.timelineData = e.response;

                    $timeout(function () {
                        $scope.$apply();
                    });
                }
            });
            $scope.timelineGridOptions = {
                dataSource: $scope.timelineDs,
                autoBind: false,
                sortable: true,
                scrollable: true,
                resizable: true,
                columns: [{
                    field: "ATRB_VAL",
                    title: "Comment Detail",
                    encoded: false
                }, {
                    field: "user",
                    title: "Changed By",
                    headerTemplate: "<i class='intelicon-find-a-person-solid' style='font-size: 18px;' title='Change Details'></i>",
                    template: "<i class='intelicon-find-a-person-solid' style='font-size: 18px;' title='#= user # (#= USR_ROLES #)\n#= HIST_EFF_FR_DTM #'></i>",
                    width: "35px"
                }]
            };

            $scope.productsLoaded = false;
            $scope.productsData = [];
            $scope.productsDs = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "/api/Products/GetProductsByIds",
                        type: "POST",
                        data: function() {
                            var prdIds = [];
                            var prods = $scope.data.PRODUCT_FILTER;
                            angular.forEach(prods, function (value, key) {
                                prdIds.push(value);
                            });
                            return {
                                "PrdIds": prdIds
                            }
                        }
                    }
                },
                requestEnd: function (e) {
                    $scope.productsLoaded = true;
                    $scope.productsData = e.response;

                    $timeout(function () {
                        $scope.$apply();
                    });
                }
            });
            $scope.productsGridOptions = {
                dataSource: $scope.productsDs,
                autoBind: false,
                sortable: true,
                scrollable: true,
                resizable: true,
                columns: [
                    {
                        field: "HIER_VAL_NM",
                        title: "Product",
                        width: "160px"
                    }, {
                        field: "CAP",
                        title: "CAP-YCP1",
                        width: "110px",
                        hidden: !$scope.showDealProducts,
                        template: function (dataItem) {
                            if (dataItem.CAP === 'No CAP') {
                                return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No CAP</div></div>';
                            }
                            return '<div style="text-align: center;">' + dataItem.CAP + '</div>';
                        }
                    }, {
                        field: "DEAL_PRD_TYPE",
                        title: "Product Type",
                        width: "110px"
                    }, {
                        field: "PRD_CAT_NM",
                        title: "Product Vertical",
                        width: "110px"
                    }, {
                        field: "BRND_NM",
                        title: "Brand",
                        width: "110px"
                    }, {
                        field: "FMLY_NM",
                        title: "Family",
                        width: "110px"
                    }, {
                        field: "PCSR_NBR",
                        title: "Processor",
                        width: "110px"
                    }, {
                        field: "MTRL_ID",
                        title: "Material Id",
                        width: "110px"
                    }, {
                        field: "MM_MEDIA_CD",
                        title: "Media Code",
                        width: "110px"
                    }, {
                        field: "PRD_STRT_DTM",
                        title: "Prod Start Date",
                        width: "110px"
                    }, {
                        field: "PRD_END_DTM",
                        title: "Prod End Date",
                        width: "110px"
                    }, {
                        field: "YCS2",
                        title: "YCS2",
                        width: "110px",
                        hidden: !$scope.showDealProducts,
                        template: function (dataItem) {
                            if (dataItem.YCS2 == 'No CAP') {
                                return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No YCS2</div></div>'
                            }
                            return '<div style="text-align: center;">' + dataItem.YCS2 + '</div>';
                        }
                    }, {
                        field: "SKU_NM",
                        title: "Sku Name",
                        width: "110px"
                    }, {
                        field: "CPU_CACHE",
                        title: "CPU Cache",
                        width: "110px"
                    }, {
                        field: "CPU_PACKAGE",
                        title: "CPU Package",
                        width: "110px"
                    }, {
                        field: "CPU_PROCESSOR_NUMBER",
                        title: "CPU Processor",
                        width: "110px"
                    }, {
                        field: "CPU_VOLTAGE_SEGMENT",
                        title: "CPU Voltage",
                        width: "110px"
                    }, {
                        field: "CPU_WATTAGE",
                        title: "CPU Wattage",
                        width: "110px"
                    }
                ]
            };

            $scope.propertiesDs = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        options.success($scope.properties);
                    }
                }
            });
            $scope.propertiesGridOptions = {
                dataSource: $scope.propertiesDs,
                autoBind: false,
                sortable: true,
                scrollable: true,
                resizable: true,
                columns: [
                    {
                        field: "key",
                        title: "Property",
                        width: "170px"
                    }, {
                        field: "value",
                        title: "Value",
                        template: "#=gridUtils.uiPropertyWrapper(data)#"
                    }
                ]
            };
            $scope.propertiesInclude = ["RATE", "STRT_VOL", "END_VOL"];
            $scope.propertiesExclude = ["PASSED_VALIDATION", "DC_PARENT_ID", "TIER_NBR"];
            $scope.$watch('propSearchFilter', function (newValue, oldValue, el) {
                if (newValue !== oldValue) {
                    $scope.propertiesDs.filter({ field: "key", operator: "contains", value: newValue });
                }
            }, true);
            $scope.tglGroup = function($event) {
                var state = $event.currentTarget.className.indexOf("active") >= 0;
                if (state) {
                    $scope.propertiesDs.group([]);
                } else {
                    $scope.propertiesDs.group({ field: "group" });
                }
            }
            $scope.tglGrdSize = function ($event, id) {
                var state = $event.currentTarget.className.indexOf("active") >= 0;
                $scope.setPropGrdSizeSmall(state, id);
            }
            $scope.setPropGrdSizeSmall = function (toSmall, id) {
                if (toSmall) {
                    $("#cn_prop_panel_" + id).removeClass("cn-panel-large");
                    $("#cn_prop_grid_" + id).removeClass("prop-grid-large");
                } else {
                    $("#cn_prop_panel_" + id).addClass("cn-panel-large");
                    $("#cn_prop_grid_" + id).addClass("prop-grid-large");
                }
                var grid = $("#cn_prop_grid_" + id).data("kendoGrid");
                if (grid !== undefined && grid !== null) grid.resize();
            }

            $scope.pieData = [];

            $scope.scheduleData = [];
            $scope.scheduleDs = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        options.success($scope.scheduleData);
                    }
                },
                schema: {
                    model: {
                        fields: {
                            TIER_NBR: { type: "number" },
                            STRT_VOL: { type: "number" },
                            END_VOL: { type: "number" },
                            RATE: { type: "number" },
                            ECAP_PRICE: { type: "number" },
                            QTY: { type: "number" },
                            DSCNT_PER_LN: { type: "number" }
                        }
                    }
                }
            });
            $scope.scheduleGridOptions = {
                dataSource: $scope.scheduleDs,
                autoBind: false,
                sortable: false,
                scrollable: true,
                resizable: false,
                columns: [
                    {
                        field: "TIER_NBR",
                        title: "Tier",
                        width: "40px",
                        hidden: true
                    },
                    {
                        field: "STRT_VOL",
                        title: "Start Vol",
                        width: "60px",
                        hidden: true
                    },
                    {
                        field: "END_VOL",
                        title: "End Vol",
                        width: "60px",
                        hidden: true
                    },
                    {
                        field: "RATE",
                        title: "Rate",
                        width: "60px",
                        hidden: true
                    },
                    {
                        field: "PRODUCT",
                        title: "Product",
                        width: "120px",
                        hidden: true
                    },
                    {
                        field: "PRD_TYPE",
                        title: "Component",
                        width: "80px",
                        hidden: true
                    },
                    {
                        field: "ECAP_PRICE",
                        title: "ECAP",
                        width: "60px",
                        format: "{0:c}",
                        hidden: true
                    },
                    {
                        field: "CAP",
                        title: "CAP",
                        width: "80px",
                        hidden: true
                    },
                    {
                        field: "YCS2_PRC_IRBT",
                        title: "YCS2",
                        width: "80px",
                        hidden: true
                    },
                    {
                        field: "QTY",
                        title: "Qty",
                        width: "50px",
                        hidden: true
                    },
                    {
                        field: "DSCNT_PER_LN",
                        title: "Discount per Line",
                        width: "90px",
                        format: "{0:c}",
                        hidden: true
                    }
                ]
            };

            $scope.menuClick = function (e) {
                if (!e) e = window.event;
                e.stopPropagation(); //so that it doesn't trigger click event on document

                if (!$scope.open) {
                    $scope.openNav(true);
                } else {
                    $scope.closeNav();
                }
            }

            $scope.wrapperClick = function (e) {
                if (!e) e = window.event;
                e.stopPropagation();
            };

            $scope.downloadQuoteLetter = function () {
                var customerSid = $scope.data["CUST_MBR_SID"];
                var objSid = $scope.data["DC_ID"];
                var objTypeSid = 5;

                var downloadPath = "/api/QuoteLetter/GetDealQuoteLetter/" + customerSid + "/" + objTypeSid + "/" + objSid + "/0";
                window.open(downloadPath, '_blank', '');
            }

            $scope.openNav = function (isInit, sel) {
                $scope.open = true;

                if ($scope.initLeft !== undefined && ($scope.initLeft + 600) > $(document).width()) {
                    $scope.initLeft = $(document).width() - 600;
                }

                objsetService.getWipDealById($scope.dealId).then(function (response) {

                    var numTiers, t;

                    $scope.data = response.data.Data;
                    if ($scope.data === null) {
                        op.notifyWarning("Unable to locate Deal # '" + $scope.dealId + "'", "No Deal");
                        $scope.closeNav();
                        return;
                    }

                    $scope.path = response.data.Path;
                    $scope.atrbMap = response.data.AtrbMap;

                    $scope.data["START_DT"] = moment($scope.data["START_DT"]).format("MM/DD/YY");
                    $scope.data["END_DT"] = moment($scope.data["END_DT"]).format("MM/DD/YY");
                    $scope.data["NOTES"] = $scope.data["NOTES"].replace(/\n/g, '<br/>');

                    $scope.isLoading = false;
                    $scope.openWithData = true;
                    $scope.sel = sel === undefined ? 1 : sel;
                    $scope.showPanel = true;

                    $scope.groups = opGridTemplate.groups[$scope.data["OBJ_SET_TYPE_CD"]];
                    $scope.groupColumns = opGridTemplate.templates[$scope.data["OBJ_SET_TYPE_CD"]];

                    if ($scope.data["OBJ_SET_TYPE_CD"] !== "ECAP" && $scope.data["OBJ_SET_TYPE_CD"] !== "KIT") {
                        $timeout(function () {
                            $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li:nth-child(7)").addClass("disabled");
                            $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li:nth-child(8)").addClass("disabled");
                        }, 200);
                    }

                    if ($scope.data["OBJ_SET_TYPE_CD"] === "PROGRAM" || $scope.data["OBJ_SET_TYPE_CD"] === "ECAP") {
                        $timeout(function () {
                            $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li:nth-child(2)").addClass("disabled");
                        }, 200);
                    }

                    // Breaking out as $scope.showQuote = function () fails since no data is passed.
                    if (!($scope.data["WF_STG_CD"] !== 'Cancelled' && ($scope.data["WF_STG_CD"] === 'Active' || $scope.data["WF_STG_CD"] === 'Won' || $scope.data["WF_STG_CD"] === 'Offer' || $scope.data["WF_STG_CD"] === 'Pending' || $scope.data["HAS_TRACKER"] === '1'))) {
                        $timeout(function () { 
                            $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li:nth-child(7)").addClass("disabled");
                        }, 200);
                    }

                    // Deal Volumes
                    if ($scope.data["CREDIT_VOLUME"] === "") $scope.data["CREDIT_VOLUME"] = 0;
                    if ($scope.data["DEBIT_VOLUME"] === "") $scope.data["DEBIT_VOLUME"] = 0;
                    if ($scope.data["CREDIT_AMT"] === "") $scope.data["CREDIT_AMT"] = 0;
                    if ($scope.data["DEBIT_AMT"] === "") $scope.data["DEBIT_AMT"] = 0;
                    $scope.percData = gridUtils.getTotalDealVolume($scope.data);
                    $scope.pieData = [];
                    $scope.pieData.push({ type: "Credit / Debit", percentage: $scope.percData.perc });
                    $scope.pieData.push({ type: "Accruable", percentage: (100 - $scope.percData.perc) });


                    // schedule
                    if ($scope.data["OBJ_SET_TYPE_CD"] === "VOL_TIER" || $scope.data["OBJ_SET_TYPE_CD"] === "FLEX"
                        || $scope.data["OBJ_SET_TYPE_CD"] === "REV_TIER" || $scope.data["OBJ_SET_TYPE_CD"] === "DENSITY") {
                        numTiers = parseInt($scope.data["NUM_OF_TIERS"]);
                        for (t = 1; t <= numTiers; t++) {
                            var r = $scope.data["RATE"]["10___" + t];
                            var rate = Number.isNaN(r) ? "" : "$" + parseFloat(r).toFixed(2);
                            $scope.scheduleData.push({
                                STRT_VOL: $scope.data["STRT_VOL"]["10___" + t],
                                END_VOL: $scope.data["END_VOL"]["10___" + t],
                                RATE: rate,
                                TIER_NBR: t
                            });
                        }
                    } else if ($scope.data["OBJ_SET_TYPE_CD"] === "KIT") {
                        var prd = $scope.data["PRODUCT_NAME"];
                        prd["20_____1"] = ""; // add KIT
                        for (var k in prd) {
                            if (prd.hasOwnProperty(k)) {
                                if (typeof prd[k] !== 'function') {
                                    var dimIndx = k.split("20___")[1];
                                    $scope.scheduleData.push({
                                        YCS2_PRC_IRBT: $scope.data["YCS2_PRC_IRBT"]["20___" + dimIndx],
                                        YCS2_END_DT: $scope.data["YCS2_END_DT"]["20___" + dimIndx],
                                        YCS2_START_DT: $scope.data["YCS2_START_DT"]["20___" + dimIndx],
                                        TRKR_NBR: $scope.data["TRKR_NBR"]["20___" + dimIndx],
                                        QTY: $scope.data["QTY"]["20___" + dimIndx],
                                        ECAP_PRICE: $scope.data["ECAP_PRICE"]["20___" + dimIndx],
                                        DSCNT_PER_LN: $scope.data["DSCNT_PER_LN"]["20___" + dimIndx],
                                        CAP: $scope.data["CAP"]["20___" + dimIndx],
                                        CAP_END_DT: $scope.data["CAP_END_DT"]["20___" + dimIndx],
                                        CAP_STRT_DT: $scope.data["CAP_STRT_DT"]["20___" + dimIndx],
                                        PRD_TYPE: gridUtils.getDimLabel("20___" + dimIndx),
                                        PRODUCT: prd[k]
                                    });
                                }
                            }
                        }
                    }

                    // populate properties
                    $scope.properties = [];
                    for (var k in $scope.data) {
                        if ($scope.data.hasOwnProperty(k)) {
                            if (typeof $scope.data[k] !== 'function') {
                                var mapVal;
                                var atrbVal;

                                // Properties
                                if ($scope.propertiesInclude.indexOf(k) >= 0 || ($scope.groupColumns[k] !== undefined && $scope.propertiesExclude.indexOf(k) < 0)) {

                                    mapVal = $scope.atrbMap[k] === undefined ? k : $scope.atrbMap[k];
                                    atrbVal = $scope.data[k];

                                    if (k === "CUST_MBR_SID") {
                                        mapVal = "Customer";
                                        atrbVal = $scope.data["Customer"].CUST_NM;
                                    }
                                    if (k === "DC_ID") {
                                        mapVal = "Deal #";
                                    }
                                    $scope.properties.push({
                                        key: mapVal,
                                        value: atrbVal,
                                        group: $scope.groupColumns[k] === undefined ? "All" : $scope.groupColumns[k].Groups[0]
                                    });
                                }
                            }
                        }
                    }

                    $scope.propertiesDs.sort({ field: "key", dir: "asc" });
                    $scope.propertiesDs.read();

                    $scope.scheduleDs.read();

                    $timeout(function () {
                        $scope.$apply();
                    });

                    $(".draggable").draggable({
                        stop: function () {
                            var el = document.getElementById("cn-draggable-" + $scope.dealId);
                            if (el !== undefined && el !== null) {
                                var elemRect = el.getBoundingClientRect();
                                $scope.$root.$broadcast('QuickDealWidgetMoved', $scope.dealId, elemRect.top, elemRect.left);
                            }
                        }
                    });

                }, function (response) {
                    op.notifyWarning("Unable to locate Deal # '" + $scope.dealId + "'", "No Deal");
                    $scope.closeNav();
                });
            }

            $scope.displayDealType = function () {
                return $scope.data["OBJ_SET_TYPE_CD"] === undefined ? "" : $scope.data["OBJ_SET_TYPE_CD"].replace(/_/g,' ');
            }

            $scope.closeNav = function () {
                $scope.sel = 0;
                $scope.open = false;
                $scope.openWithData = false;
                $scope.isLoading = true;
                $scope.timelineLoaded = false;
                if ($scope.data !== null) {
                    $scope.setPropGrdSizeSmall(true, $scope.data["DC_ID"]);
                }
                $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li").removeClass("active");
                $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li").first().addClass("active");

                $scope.$root.$broadcast('QuickDealWidgetClosed', $scope.dealId);
            }

            $scope.refresh = function () {
                var sel = $scope.sel;
                $scope.open = false;
                $scope.openWithData = false;
                $scope.isLoading = true;
                $scope.data = {};
                $scope.path = {};
                $scope.atrbMap = {};
                $scope.sel = 0;
                $scope.showPanel = false;
                $scope.properties = [];
                $scope.helpTip = 0;
                $scope.percData = {};
                $scope.groups = [];
                $scope.groupColumns = {};
                $scope.timelineLoaded = false;
                $scope.timelineData = [];
                $scope.productsLoaded = false;
                $scope.productsData = [];
                $scope.pieData = [];
                $scope.scheduleData = [];
                if ($scope.data !== null) {
                    $scope.setPropGrdSizeSmall(true, $scope.data["DC_ID"]);
                }

                $scope.openNav(true, sel);
            }

            $scope.$on('QuickDealOpen', function (event, id) {
                if (id !== $scope.dealId) return;
                $scope.openNav(true);
            });

            $scope.$on('QuickDealClosePanel', function (event, id) {
                if (id !== $scope.dealId) return;
                $scope.closePanel();
            });

            $scope.$on('QuickDealOpenPanel', function (event, id) {
                if (id !== $scope.dealId) return;
                $scope.openPanel();
            });

            $scope.closeControl = function () {
                $scope.closeNav();
            }

            $scope.refreshControl = function () {
                $scope.refresh();
            }

            $scope.numberWithCommas = function (x) {
                if (x === undefined) x = 0;
                var parts = x.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return parts.join(".");
            }

            $scope.getTrackerTitle = function() {
                return ($scope.data.HAS_TRACKER !== undefined && $scope.data.HAS_TRACKER === "1")
                    ? "Has a tracker number"
                    : "No Tracker Yet";
            }

            $scope.getStageBgColorStyle = function (c) {
                return { backgroundColor: $scope.getColorStage(c) };
            }
            $scope.getColorStyle = function (c) {
                return { color: $scope.getColorPct(c) };
            }

            $scope.getColor = function (k, c) {
                if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                    return colorDictionary[k][c];
                }
                return "#aaaaaa";
            }
            $scope.getColorType = function (d) {
                return $scope.getColor('type', d);
            }
            $scope.getColorStage = function (d) {
                if (!d) d = "Draft";
                return $scope.getColor('stage', d);
            }
            $scope.getColorPct = function (d) {
                if (!d) d = "InComplete";
                return $scope.getColor('pct', d);
            }
            $scope.getColorMct = function (d) {
                if (!d) d = "InComplete";
                return $scope.getColor('mct', d);
            }

            $scope.focusMenu = function ($event, id) {
                if ($("#cn-draggable-" + $scope.dealId + " .cn-wrapper li:nth-child(" + id + ")").hasClass("disabled")) return;

                $scope.sel = id;
                if ($scope.sel === 6) $scope.openTimeline();
                if ($scope.sel === 4) $scope.openProducts();
                if ($scope.sel === 8) {
                    $("#chart_" + $scope.dealId).kendoChart({
                        legend: {
                            position: "bottom"
                        },
                        dataSource: {
                            data: $scope.pieData
                        },
                        series: [{
                            type: "pie",
                            field: "percentage",
                            categoryField: "type"
                        }],
                        seriesColors: ["#0071C5", "#eeeeee"],
                        tooltip: {
                            visible: true,
                            template: "${ category } - ${ value }%"
                        }
                    });
                }
                if ($scope.sel === 2) {
                    var grid = $("#grid_sched_" + $scope.dealId).data("kendoGrid");
                    if (grid !== undefined && grid !== null) {
                        var cols = [];
                        // NEED TO CHANGE THIS FOR REV_TIER
                        if (($scope.data["OBJ_SET_TYPE_CD"] === "VOL_TIER" || $scope.data["OBJ_SET_TYPE_CD"] === "FLEX"
                            || $scope.data["OBJ_SET_TYPE_CD"] === "REV_TIER" || $scope.data["OBJ_SET_TYPE_CD"] === "DENSITY")) cols = ["STRT_VOL", "END_VOL", "RATE", "TIER_NBR"];
                        if (($scope.data["OBJ_SET_TYPE_CD"] === "KIT")) cols = ["PRODUCT", "PRD_TYPE", "ECAP_PRICE", "CAP", "YCS2_PRC_IRBT", "TRKR_NBR", "QTY", "DSCNT_PER_LN"];
                        for (var c = 0; c < cols.length; c++) {
                            grid.showColumn(cols[c]);
                        }
                    }
                }
                $scope.showPanel = true;
                $("#cn-draggable-" + $scope.dealId + " .cn-wrapper li").removeClass("active");
                if ($event !== undefined && $event !== null) $($event.currentTarget).addClass("active");
            }

            $scope.closePanel = function () {
                $scope.showPanel = false;
            }
            $scope.openPanel = function () {
                $scope.showPanel = true;
            }

            $scope.openTimeline = function () {
                $scope.timelineDs.read();
            }
            $scope.openProducts = function () {
                $scope.productsDs.read();
            }

            $timeout(function () {
                if ($scope.isOpen !== undefined && $scope.isOpen) {
                    $scope.openNav(true);
                }
            },100);


        }],
        link: function (scope, element, attrs) {
        }
    };
}