(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerPctController', managerPctController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerPctController.$inject = ['$scope', '$uibModalStack', '$state', 'securityService', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal', '$linq', '$window', 'contractData', 'dataItem', 'isToolReq'];

    function managerPctController($scope, $uibModalStack, $state, securityService, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal, $linq, $window, contractData, dataItem, isToolReq) {
        if (isToolReq === undefined) isToolReq = true;
        var root = $scope.$parent;	// Access to parent scope
        if (!isToolReq) {
            root.contractData = contractData;
            $scope.PRC_ST_OBJ_SID = dataItem.PRC_ST_OBJ_SID;
            $scope.dataItem = dataItem;
            $scope.isToolReq = isToolReq;
        }
        $scope.root = root;
        $scope.isFroceRunPresent = typeof root.forceRun !== 'undefined' && typeof root.forceRun === 'function' ? 'root.forceRun()' : false;
        $scope.isRefreshReq = false;
        if (isToolReq == undefined) {
            $scope.isToolReq = true;
            var container = angular.element(".sumPsContainer");
            container.scope().isCollapsed = true;
            $scope.isAllCollapsed = true;
        }
        else {
            $scope.isToolReq = isToolReq;
        }

        $scope.pctFilter = "";
        $scope.$parent.isSummaryHidden = false;
        gridPctUtils.columns = {};
        $scope.isAllCollapsed = true;
        $scope.context = {};
        $scope.needToRunPct = false;
        $scope.dealPtIdDict = {};
        $scope.CostTestGroupDetails = {};
        $scope.dataItemDict = {};
        root.enablePCT = false;

        // change negative values in grid from "()" to "-"
        kendo.culture().numberFormat.currency.pattern[0] = "-$n";

        var hasNoPermission = !($scope.root.CAN_EDIT_COST_TEST == undefined ? securityService.chkDealRules('C_EDIT_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "SA" && window.isSuper) : $scope.root.CAN_EDIT_COST_TEST);
        var hasNoPermissionOvr = hasNoPermission && window.usrRole !== "Legal";
        var hasPermissionPrice = window.usrRole === "DA" || window.usrRole === "Legal" || (window.usrRole === "SA" && window.isSuper);
        // This variable gives Super GA to see RTL_PULL_DLR and CAP (CAP column only for ECAP deals)
        var hasSpecialPricePermission = (hasPermissionPrice || (window.usrRole === "GA" && window.isSuper));

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").addClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").removeClass("active");
            $("#overlapDiv").removeClass("active");
            $("#groupExclusionDiv").removeClass("active");
            $("#dealProducts").removeClass("active");
            $scope.$apply();
        }, 50);
        //DE121587
        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            $timeout(function () {
                var newState = msg != undefined && msg !== "";
                if (isShowFunFact == null) { isShowFunFact = false; }

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
                    }, 500);
                }
            });
        }
        //DE121587 END
        $scope.selTab = function (tabName) {
            $scope.pctFilter = tabName === "All" ? "" : tabName;

            // If any grids are exposed... update their datasource
            $(".opUiContainer.k-grid").each(function (i, obj) {
                var grid = $(obj).data('kendoGrid');
                var ds = grid.dataSource;
                ds.filter($scope.getFilters());
                ds.read();
            });

        }

        $scope.getColorStyle = function (c) {
            return { color: $scope.getColorPct(c) };
        }
        $scope.getColorPct = function (d) {
            if (!d) d = "InComplete";
            return $scope.getColor('pct', d);
        }
        $scope.getColor = function (k, c) {
            if (colorDictionary[k] !== undefined && colorDictionary[k][c] !== undefined) {
                return colorDictionary[k][c];
            }
            return "#aaaaaa";
        }

        $scope.dismissPopup = function () {
            for (var dc_id in $scope.CostTestGroupDetails) {
                $scope.$parent.$broadcast('refreshPCTData', $scope.sumGridOptions["dc" + dc_id].dataSource.data);
                break;
            }
            $uibModalStack.dismissAll();
        }

        $scope.getFilters = function () {
            if ($scope.pctFilter === "") return [];
            return [{ field: "PRC_CST_TST_STS", operator: "eq", value: $scope.pctFilter }];
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

        $scope.toggleSum = function () {
            var container = angular.element(".sumPsContainer");
            while (container.length !== 0) {
                //isCollapsed is only defined in the ng-repeat's local scope, so we need to iterate through them here
                container.scope().isCollapsed = $scope.isAllCollapsed;
                container = container.next();
            }
            $scope.isAllCollapsed = !$scope.isAllCollapsed;
        }

        $scope.$on('refreshContractDataComplete', function (event) {
            $scope.calcNeedToRunStatus();
        });

        $scope.calcNeedToRunStatus = function () {
            root.enablePCT = false;
            if (root.contractData.PRC_ST === undefined || root.contractData.PRC_ST === null) return;

            for (var d = 0; d < root.contractData.PRC_ST.length; d++) {
                var stg = root.contractData.PRC_ST[d].WF_STG_CD;
                if (stg !== "Pending" && stg !== "Approved") {
                    root.enablePCT = true;
                }
            }
        }

        $scope.$on('ExecutionPctMctComplete', function (event, executedFromBtn) {
            objsetService.readContract($scope.root.contractData.DC_ID).then(function (data) {
                var atrbs = ["WF_STG_CD", "PASSED_VALIDATION", "COST_TEST_RESULT", "MEETCOMP_TEST_RESULT"];

                //Tender Dashboard Change
                if (!isToolReq) {
                    var tempcontractDataPS = {};
                    for (var i = 0; i < data.data[0].PRC_ST.length; i++) {
                        if (data.data[0].PRC_ST[i].DC_ID === dataItem.PRC_ST_OBJ_SID) {
                            tempcontractDataPS = (data.data[0].PRC_ST[i]);
                        }
                    }
                    data.data[0].PRC_ST = [];
                    data.data[0].PRC_ST.push(tempcontractDataPS);
                    $scope.curPricingStrategy = util.findInArray(data.data[0].PRC_ST, dataItem.PRC_ST_OBJ_SID);
                    $scope.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, $scope.curPricingStrategy.PRC_TBL[0].DC_ID);
                    $scope.curPricingTable.isPtCollapsed = true;
                }

                if (typeof $scope.root.initContract != 'undefined') {
                    var newContractData = $scope.root.initContract(data);
                }
                else {
                    var newContractData = data.data[0];
                }


                var tmpNewPs = util.stripContractTree(newContractData, atrbs);
                var tmpPs = util.stripContractTree($scope.root.contractData, atrbs);
                var hasKeyDataChanged = angular.toJson(tmpNewPs) !== angular.toJson(tmpPs);



                var anyExpanded = $(".chevron.intelicon-down").length > 0;

                // only update the screen if atrbs changed AND user did not "touch" the screen layout
                if (executedFromBtn || hasKeyDataChanged) {

                    if (executedFromBtn || !anyExpanded) {
                        $scope.root.contractData = newContractData;
                        $scope.root.contractData.CUST_ACCNT_DIV_UI = "";

                        $timeout(function () {
                            $scope.root.$apply();
                        });
                    } else {
                        op.notifyInfo("Refresh the screen to see latest Cost Test Results", "Cost Test Complete");
                    }

                }

                //Update Grid
                if (!isToolReq) {
                    $scope.isRefreshReq = true;
                    $scope.togglePt($scope.curPricingStrategy, $scope.curPricingTable);
                }
            });
        });

        $scope.gotoContractEditor = function (ps, pt) {
            root.gotoContractEditor(ps, pt);
        }

        $scope.onOff = function (val) {
            return val ? "Yes" : "No";
        }

        $scope.openReason = function (dataItem) {
            $scope.context = dataItem;

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'pctOverrideReasonModal',
                controller: 'pctOverrideReasonModalCtrl',
                controllerAs: '$ctrl',
                windowClass: 'costTestReason-modal-window',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return dataItem;
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
                $scope.context.saved = true;
                $timeout(function () {
                    $scope.context.saved = false;
                    op.notifyWarning("You have made a change that may affect Cost Test results.", "Please re-run Cost Test");
                    //kendo.confirm("Would you like to run Price Cost Test now?")
                    //    .then(function () {
                    //        $scope.$broadcast('runForcedPctMct', {});
                    //    },
                    //    function () { });
                }, 3000);
            }, function () { });
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        $scope.customFilter = function (ps) {
            return (
                ($scope.pctFilter === undefined || $scope.pctFilter === '' || ps.COST_TEST_RESULT === '' || ps.COST_TEST_RESULT.toUpperCase() === $scope.pctFilter.toUpperCase()) &&
                ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp(escapeRegExp($scope.titleFilter), "i")) >= 0 || $scope.titleInPt(ps))
            );
        }

        $scope.titleInPt = function (ps) {
            if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
            for (var i = 0; i < ps.PRC_TBL.length; i++) {
                if (ps.PRC_TBL[i].TITLE.search(new RegExp(escapeRegExp($scope.titleFilter), "i")) >= 0) return ps;
            }
            return null;
        }

        $scope.unLockedGroupData = {};

        $scope.expColAll = function (id) {
            var grid = $("#sumWipGrid_" + id + " .k-grid").data("kendoGrid");

            if ($("#sumWipGrid_exp_" + id + " i").hasClass("k-i-expand")) {
                $("#sumWipGrid_" + id + " .k-grid .k-grouping-row").each(function (index) {
                    grid.expandRow(this);
                });
                $("#sumWipGrid_exp_" + id + " i").removeClass("k-i-expand");
                $("#sumWipGrid_exp_" + id + " i").addClass("k-i-collapse");
            } else {
                $("#sumWipGrid_" + id + " .k-grid .k-grouping-row").each(function (index) {
                    grid.collapseRow(this);
                });
                $("#sumWipGrid_exp_" + id + " i").removeClass("k-i-collapse");
                $("#sumWipGrid_exp_" + id + " i").addClass("k-i-expand");
            }
        }

        // Get the hroup header checkbox a unique id
        function getColumnTemplateByObjType(pt) {
            var template = angular.copy($scope.templates.columns[pt.OBJ_SET_TYPE_CD]);
            if (template[0].field === "TOOLS" && $scope.isToolReq) {
                template[0].headerTemplate = template[0].headerTemplate.replace(/PT_ID/g, pt.DC_ID);
            }
            else if (template[0].field === "TOOLS" && !$scope.isToolReq) {
                template.splice(0, 1);
            }
            return template;
        }

        $scope.clkAllItems = function (ev, id) {
            var isChecked = document.getElementById("chkDealTools_" + id).checked;
            var grid = $('#detailGrid_' + id).data("kendoGrid");
            var data = grid.dataSource.view();
            for (var i = 0; i < data.length; i++) {
                if (data[i]['items'] !== undefined && data[i]['items'][0] !== undefined) {
                    data[i]['items'][0]['isLinked'] = isChecked;
                    $(".lnkChk_" + data[i]['items'][0].DC_ID).each(function () {
                        this.checked = isChecked;
                    });
                }
            }
        }

        function stickGridHeader(context) {
            var wrapper = context.wrapper,
                header = wrapper.find(".k-grid-header");

            function scrollFixed() {

                // Position of y-scroll
                var offset = $(this).scrollTop() + 120,
                    tableOffsetTop = wrapper[0].offsetTop,
                    tableOffsetBottom = tableOffsetTop + wrapper.height() - header.height();

                // When scroll position is greater than table header position apply fix header css else remove it
                if (offset < tableOffsetTop || offset > tableOffsetBottom) {
                    header.removeClass("fixed-header");
                } else if (offset >= tableOffsetTop && offset <= tableOffsetBottom && !header.hasClass("fixed")) {
                    header.addClass("fixed-header");
                }
            }

            // Grids container where scroll appears
            $("#sum-container").scroll(scrollFixed);
        }

        $scope.togglePt = function (ps, pt) {

            if (!!!pt.isPtCollapsed) {
                return;
            }

            $("#sumWipGrid_" + pt.DC_ID).html("<div style='margin: 10px; position: relative; z-index: 4000; background-color: #ffffff;;'><ul class='fa-ul'><li><i class='fa-li fa fa-spinner fa-spin'></i>Loading...</li></ul></div>");

            objsetService.getPctDetails(pt.DC_ID).then(
                function (e) {
                    //Cherry Picking the Deal for Tender Dashboard
                    if (!$scope.isToolReq) {
                        var tempItem = [];
                        e.data["CostTestDetailItems"].some(function (e, i) {
                            if (e.DEAL_ID == $scope.dataItem.DC_ID) {
                                tempItem.push(e);
                            }
                        });
                        if (tempItem.length > 0) {
                            e.data.CostTestDetailItems = [];
                            e.data.CostTestDetailItems = tempItem;
                        }
                    }
                    $scope.CostTestGroupDetails[pt.DC_ID] = e.data["CostTestGroupDetailItems"];

                    var response = e.data["CostTestDetailItems"];
                    var rollupPctBydeal = {};
                    for (var j = 0; j < response.length; j++) {

                        response[j]['DC_ID'] = response[j]["DEAL_ID"];
                        response[j]['PS_WF_STG_CD'] = pt.PS_WF_STG_CD;

                        // Copy PS actions to deal to deal tools to work
                        response[j]['_actionsPS'] = ps._actions;

                        // Deal id is not parent id here..Make deal tool directive work assigning this value
                        response[j]['DC_PARENT_ID'] = response[j]["DEAL_ID"];

                        $scope.dealPtIdDict[response[j]["DEAL_ID"]] = pt.DC_ID;
                        var isOverridden = response[j]["COST_TEST_OVRRD_FLG"] === "Yes";
                        var pct = isOverridden ? "Pass" : response[j]["PRC_CST_TST_STS"];
                        var pctItem = rollupPctBydeal[response[j]["DEAL_ID"]];
                        if (!pctItem) {
                            rollupPctBydeal[response[j]["DEAL_ID"]] = pct;
                        } else {
                            if (pct === "Fail") {
                                rollupPctBydeal[response[j]["DEAL_ID"]] = "Fail";
                            } else if (pct === "InComplete" && pctItem !== "Fail") {
                                rollupPctBydeal[response[j]["DEAL_ID"]] = "InComplete";
                            } else if (pct === "Pass" && pctItem === "NA") {
                                rollupPctBydeal[response[j]["DEAL_ID"]] = "Pass";
                            }
                        }
                    }

                    for (var i = 0; i < response.length; i++) {
                        var item = response[i];

                        //if (!gridPctUtils.columns[item.DEAL_ID]) {
                        var cols = $scope.templates.columns[pt.OBJ_SET_TYPE_CD];
                        if (cols[0].field === "TOOLS" && !$scope.isToolReq) {
                            cols.splice(0, 1);
                        }
                        var tmplt = "<table style='float: left; margin-top: -20px;'>"; // <colgroup><col style='width: 30px;'>
                        var trLocked = "<td style='width: 30px;'></td>";
                        var trUnLocked = "";

                        for (var c = 0; c < cols.length; c++) {
                            var val = item[cols[c].field];
                            if (!!cols[c].format) {
                                val = kendo.toString(val, cols[c].format.replace("{0:", "").replace("}", ""));
                            }
                            if (!!cols[c].template) {
                                var newVal = kendo.template(cols[c].template)(item);
                                if (newVal.indexOf("ng-bind") < 0) {
                                    val = newVal;
                                }
                            }
                            if (cols[c].field === "DEAL_ID") {
                                val = "<b>" + val + "</b>";
                            } else if (cols[c].field === "GRP_DEALS") {

                                $scope.dataItemDict[item["DEAL_ID"]] = {
                                    DEAL_COMB_TYPE: "",
                                    CONSUMPTION_REASON: item["CNSMPTN_RSN"],
                                    TITLE: item["PRODUCT"],
                                    DEAL_DESC: item["DEAL_DESC"],
                                    END_DT: item["DEAL_END_DT"],
                                    DC_ID: item["DEAL_ID"],
                                    START_DT: item["DEAL_STRT_DT"],
                                    OEM_PLTFRM_LNCH_DT: item["OEM_PLTFRM_LNCH_DT"],
                                    OEM_PLTFRM_EOL_DT: item["OEM_PLTFRM_EOL_DT"],
                                    OBJ_SET_TYPE_CD: pt.OBJ_SET_TYPE_CD,
                                    REBT_TYPE: item["REBT_TYPE"],
                                    ADDITIVE: item["ADDITIVE"],
                                    ECAP_PRICE: item["ECAP_PRC"],
                                    MAX_RPU: item["MAX_RPU"],
                                    DSPL_WF_STG_CD: item["WF_STG_CD"]
                                };

                                var grp = item["PRC_CST_TST_STS"] !== "NA" ? "<div class='lnkBasic' ng-click='showDealGroups(" + item["DEAL_ID"] + ", \"" + item["DEAL_GRP_CMNT"].replace(/'/g, " ") + "\")'>View</div>" : "";
                                val = "<div style='text-align: center;'>" + grp + "</div>";
                            }

                            if (!cols[c].hidden) {
                                if (cols[c].locked) {
                                    if (cols[c].field === "PRC_CST_TST_STS") {
                                        var icon = gridPctUtils.getResultSingleIcon(rollupPctBydeal[response[i]["DEAL_ID"]], "font-size: 20px !important;");
                                        trLocked += "<td style='padding-left: 0; padding-right: 6px; width:" + (parseInt(cols[c].width) - 6) + "px'><div style='text-align: center;'>" + (cols[c].parent ? icon : "") + "<div></td>";
                                    } else {
                                        trLocked += "<td style='padding-left: 6px; padding-right: 6px; width:" + (parseInt(cols[c].width) - 12) + "px'>" + (cols[c].parent ? val : "") + "</td>";
                                    }
                                } else {
                                    trUnLocked += "<td style='padding-left: 0px; padding-right: 6px; width:" + (parseInt(cols[c].width) - 12) + "px'>" + (cols[c].parent ? val : "") + "</td>";
                                }
                            }
                        }

                        gridPctUtils.columns[item.DEAL_ID] = tmplt + "<tbody><tr>" + trLocked + "</tr></tbody></table>";
                        $scope.unLockedGroupData[item.DEAL_ID] = "<table><tbody><tr>" + trUnLocked + "</tr></tbody></table>";
                        //}
                    }

                    if (!$scope.sumGridOptions) $scope.sumGridOptions = {};

                    $scope.sumGridOptions["dc" + pt.DC_ID] = {
                        dataSource: {
                            data: response,
                            schema: {
                                model: $scope.templates.models[pt.OBJ_SET_TYPE_CD]
                            },
                            filter: $scope.getFilters(),
                            group: { field: "DEAL_ID" }
                        },
                        sortable: false,
                        scrollable: true,
                        height: 250,
                        filterable: true,
                        resizable: true,
                        columns: getColumnTemplateByObjType(pt),
                        dataBound: function (e) {

                            var grid = this;
                            this.lockedTable.find(".k-grouping-row").each(function (index) {
                                var html = $scope.unLockedGroupData[grid.dataItem(this).DEAL_ID];
                                var template = angular.element(html);
                                var linkFunction = $compile(template);
                                linkFunction($scope);
                                grid.tbody.find(".k-grouping-row:eq(" + index + ") td").html(template);
                            });

                            // Set background colors
                            var rows = e.sender.content.find('tr');
                            var capIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "CAP" + "]").index();
                            var ecapIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "ECAP_PRC" + "]").index();
                            var netIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "LOW_NET_PRC" + "]").index();
                            var costIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "PRD_COST" + "]").index();
                            var retailIndex = e.sender.wrapper.find(".k-grid-header [data-field=" + "RTL_CYC_NM" + "]").index();

                            rows.each(function (index, row) {
                                var dataItem = e.sender.dataItem(row);

                                var validCost = false;
                                var validNet = false;

                                if (dataItem.COST_TEST_OVRRD_FLG !== "Yes" && dataItem.PRC_CST_TST_STS !== "NA") {
                                    if (!dataItem.CAP || dataItem.CAP === "" || dataItem.CAP < 0) {
                                        if (capIndex >= 0) $(row).children('td:eq(' + capIndex + ')').addClass('cell-warning');
                                    }
                                    if (!dataItem.ECAP_PRC || dataItem.ECAP_PRC === "" || dataItem.ECAP_PRC < 0) {
                                        if (ecapIndex >= 0) $(row).children('td:eq(' + ecapIndex + ')').addClass('cell-warning');
                                    }
                                    if (!dataItem.PRD_COST || dataItem.PRD_COST === "" || dataItem.PRD_COST < 0) {
                                        if (costIndex >= 0) $(row).children('td:eq(' + costIndex + ')').addClass('cell-warning');
                                    } else validCost = true;
                                    if (!dataItem.LOW_NET_PRC || dataItem.LOW_NET_PRC === "" || dataItem.LOW_NET_PRC < dataItem.PRD_COST) {
                                        if (netIndex >= 0) $(row).children('td:eq(' + netIndex + ')').addClass('cell-error');
                                    } else validNet = true;
                                    if (validCost && validNet && dataItem.LOW_NET_PRC <= 0) {
                                        if (netIndex >= 0) $(row).children('td:eq(' + netIndex + ')').addClass('cell-error');
                                    }
                                    if (!dataItem.RTL_CYC_NM || dataItem.RTL_CYC_NM === "") {
                                        if (retailIndex >= 0) $(row).children('td:eq(' + retailIndex + ')').addClass('cell-warning');
                                    }
                                }
                                else // In cases where lines are in Override or are simply Not Applicable for Cost Testing, Highlight missing with light grey as per Gaya (DE39032)
                                {
                                    if (!dataItem.CAP || dataItem.CAP === "" || dataItem.CAP < 0) {
                                        if (capIndex >= 0) $(row).children('td:eq(' + capIndex + ')').addClass('cell-information');
                                    }
                                    if (!dataItem.ECAP_PRC || dataItem.ECAP_PRC === "" || dataItem.ECAP_PRC < 0) {
                                        if (ecapIndex >= 0) $(row).children('td:eq(' + ecapIndex + ')').addClass('cell-information');
                                    }
                                    if (!dataItem.PRD_COST || dataItem.PRD_COST === "" || dataItem.PRD_COST < 0) {
                                        if (costIndex >= 0) $(row).children('td:eq(' + costIndex + ')').addClass('cell-information');
                                    } else validCost = true;
                                    if (!dataItem.LOW_NET_PRC || dataItem.LOW_NET_PRC === "" || dataItem.LOW_NET_PRC < dataItem.PRD_COST) {
                                        if (netIndex >= 0) $(row).children('td:eq(' + netIndex + ')').addClass('cell-information');
                                    } else validNet = true;
                                    if (validCost && validNet && dataItem.LOW_NET_PRC <= 0) {
                                        if (netIndex >= 0) $(row).children('td:eq(' + netIndex + ')').addClass('cell-information');
                                    }
                                    if (!dataItem.RTL_CYC_NM || dataItem.RTL_CYC_NM === "") {
                                        if (retailIndex >= 0) $(row).children('td:eq(' + retailIndex + ')').addClass('cell-information');
                                    }
                                }

                            });

                            $timeout(function () {
                                $scope.setOverrideMarkup(ps, pt);
                            }, 100);

                            stickGridHeader(this);
                        }
                    }

                    if ($("#detailGrid_" + pt.DC_ID).length === 0) {
                        var html = "<kendo-grid options='sumGridOptions.dc" + pt.DC_ID + "' k-ng-delay='sumGridOptions.dc" + pt.DC_ID + "' id='detailGrid_" + pt.DC_ID + "' class='opUiContainer md dashboard sumGridOptionsExpand'></kendo-grid>";
                        var template = angular.element(html);
                        var linkFunction = $compile(template);
                        linkFunction($scope);

                        $("#sumWipGrid_exp" + pt.DC_ID).show();
                        $("#sumWipGrid_" + pt.DC_ID).html(template);
                    }
                    if ($scope.isRefreshReq == true) {
                        $timeout(function () {
                            reloadGrid();
                            $scope.isRefreshReq = false;
                        }, 2000);
                    }

                },
                function (response) {
                    $scope.setBusy("Error", "Could not load data.");
                    logger.error("Could not load data.", response, response.statusText);
                    $timeout(function () {
                        $scope.setBusy("", "");
                    }, 2000);
                }
            );
        }

        $scope.setOverrideMarkup = function (ps, pt) {
            var grid = $("#detailGrid_" + pt.DC_ID).data("kendoGrid");
            if (grid === undefined || grid === null) return;

            grid.resize();

            if (grid.dataSource.group().length > 0) {
                $("#detailGrid_" + pt.DC_ID).find('.k-icon.k-i-collapse').trigger('click');
            }

            // lame workaround.  checkboxes were not binding properly, so wait for them to load and set them.  True will pickup and check checkboxes
            var data = grid.dataSource.data();
            for (var d = 0; d < data.length; d++) {
                data[d]["COST_TEST_OVRRD_FLG"] = data[d]["COST_TEST_OVRRD_FLG"] === "Yes" || data[d]["COST_TEST_OVRRD_FLG"] === true;
                if (data[d]["COST_TEST_OVRRD_FLG"] === "") data[d]["COST_TEST_OVRRD_FLG"] = "No";
                if (data[d]["PRC_CST_TST_STS"] === "") data[d]["PRC_CST_TST_STS"] = "InComplete";

                data[d]["_readonly"] = ps.WF_STG_CD !== "Submitted";
            }

            $("#detailGrid_" + pt.DC_ID + " .k-grouping-row .k-icon").on("click", function (e) {

                var row = $(e.currentTarget).closest("tr");
                var distance = $(row).position().top;

                $(e.currentTarget).parent().closest(".k-grid-content-locked").parent().find(".k-grid-content").animate({
                    scrollTop: distance
                }, 400);

            });
        }

        $scope.gotoDealDetails = function (dcid) {
            $scope.setBusy("Loading..", "Redirecting to deal editor.");
            var win = $window.open('');
            dataService.get("api/Search/GotoDeal/" + dcid).then(function (response) {
                $scope.setBusy("", "");
                var url = "/Contract#/manager/" + response.data.ContractId;
                if (response.data.PricingStrategyId > 0 && response.data.PricingTableId > 0) {
                    url += "/" + response.data.PricingStrategyId + "/" + response.data.PricingTableId;
                }
                if (response.data.WipDealId > 0) url += "/wip?searchTxt=" + response.data.WipDealId;
                win.location.href = url;
                win.focus();
            }, function (response) {
                $scope.setBusy("Error", "Could not load deal data.");
                logger.error("Could not load deal data.", response, response.statusText);
                $timeout(function () {
                    $scope.setBusy("", "");
                }, 2000);
            });
        }

        $scope.showGroups = function (dealId, dataItem) {
            $scope.context = $linq.Enumerable()
                .From($scope.CostTestGroupDetails[$scope.dealPtIdDict[dataItem.DEAL_ID]])
                .Where(function (x) {
                    return x.DEAL_PRD_RNK === dealId;
                }).ToArray();

            var modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'pctGroupModal',
                controller: 'pctGroupModalCtrl',
                controllerAs: '$ctrl',
                size: 'lg',
                resolve: {
                    dataItem: function () {
                        return $scope.context;
                    },
                    dealId: function () {
                        return dataItem === undefined ? dealId : dataItem.DEAL_ID;
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
            }, function () { });
        }

        $scope.showDealGroups = function (dealId, cmnt) {
            var dataItem = $scope.dataItemDict[dealId];

            var col = {
                lookupUrl: "/api/Dropdown/GetDealGroupDropdown",
                lookupText: "DROP_DOWN",
                lookupValue: "DROP_DOWN"
            }

            dataItem["DEAL_GRP_EXCLDS"] = "calc";
            dataItem["DEAL_GRP_CMNT"] = cmnt;

            var modal = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'app/contract/partials/ptModals/excludeDealGroupMultiSelectModal.html',
                controller: 'ExcludeDealGroupMultiSelectCtrl',
                controllerAs: 'vm',
                windowClass: '',
                size: 'lg',
                resolve: {
                    dataItem: angular.copy(dataItem),
                    cellCurrValues: function () {
                        return angular.copy(dataItem["DEAL_GRP_EXCLDS"]);
                    },
                    cellCommentValue: function () {
                        return angular.copy(dataItem["DEAL_GRP_CMNT"]);
                    },
                    colInfo: function () {
                        return col;
                    },
                    enableCheckbox: function () {
                        return false;
                    },
                    excludeOutliers: function () {
                        return true;
                    }
                }
            });

            modal.result.then(
                function (result) { },
                function () {
                });
        }

        $scope.changeReasonFlg = function (dataItem) {
            if (dataItem.COST_TEST_OVRRD_FLG === false) {
                var newItem = {
                    "CUST_NM_SID": dataItem.CUST_NM_SID,
                    "DEAL_OBJ_TYPE_SID": 5,
                    "DEAL_OBJ_SID": dataItem.DEAL_ID,
                    "PRD_MBR_SIDS": dataItem.PRD_MBR_SIDS,
                    "CST_OVRRD_FLG": 0,
                    "CST_OVRRD_RSN": ""
                };

                objsetService.setPctOverride(newItem).then(
                    function (data) {
                        dataItem.saved = true;
                        $timeout(function () {
                            dataItem.saved = false;
                        }, 3000);

                        op.notifyWarning("You have made a change that may affect Cost Test results.", "Please re-run Cost Test");
                        //kendo.confirm("Would you like to run Price Cost Test now?")
                        //    .then(function () {
                        //        $scope.$broadcast('runForcedPctMct', {});
                        //    },
                        //    function () { });
                    });
            }
        }

        $scope.getResultMapping = function (result, flg, className, style) {
            return gridPctUtils.getResultMapping(result, flg, '', '', className, style);
        }

        $scope.gotoExclude = function () {
            if (!$scope.isToolReq && typeof $scope.isToolReq != 'undefined') {
                root.curPricingStrategy = util.findInArray($scope.contractData.PRC_ST, $scope.PRC_ST_OBJ_SID);
                root.curPricingTable = util.findInArray($scope.curPricingStrategy.PRC_TBL, $scope.curPricingStrategy.PRC_TBL[0].DC_ID);
                var modal = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'app/contract/partials/ptModals/groupExclusionModal.html',
                    controller: 'managerExcludeGroupsController',
                    //controllerAs: 'contract',
                    size: 'lg',
                    windowClass: 'tenderPctFolio-modal-window',
                    resolve: {
                        rootDataItem: function () {
                            return dataItem;
                        },
                        isToolReq: function () {
                            return false;
                        }
                    }
                });

                modal.result.then(
                    function () {
                        //Close Event will come here
                    },
                    function () {
                        // Do Nothing on cancel
                    });


            }
            else {
                //$scope.selectedTAB = 'GE';
                $state.go('contract.grouping');
            }

        }

        root["CAN_VIEW_COST_TEST"] = root.CAN_VIEW_COST_TEST === undefined ?
            securityService.chkDealRules('CAN_VIEW_COST_TEST', window.usrRole, null, null, null) || (window.usrRole === "GA" && window.isSuper)
            : root.CAN_VIEW_COST_TEST; // Can view the pass/fail

        // Global Settings
        var pctTemplate = root.CAN_VIEW_COST_TEST ? "#= gridPctUtils.getResultMapping(PRC_CST_TST_STS, '!dataItem.COST_TEST_OVRRD_FLG || !dataItem.COST_TEST_OVRRD_CMT', 'dataItem.COST_TEST_OVRRD_FLG', 'dataItem.COST_TEST_OVRRD_CMT', '', 'font-size: 20px !important;', INCMPL_COST_TEST_RSN) #" : "&nbsp;";
        $scope.cellColumns = {
            "TOOLS": {
                field: "TOOLS",
                title: "Tools",
                width: "150px",
                locked: true,
                template: "<div><deal-tools ng-model='dataItem' is-split-enabled='false' is-file-attachment-enabled='false' is-history-enabled='true' is-comment-enabled='false' is-editable='true' is-quote-letter-enabled='false' is-delete-enabled='false'></deal-tools></div>",
                headerTemplate: "<input type='checkbox' ng-click='clkAllItems($event, PT_ID)' class='with-font' id='chkDealTools_PT_ID' /><label for='chkDealTools_PT_ID'>Tools</label>",
                filterable: false,
                sortable: false,
                parent: true,
            },
            "PRC_CST_TST_STS": {
                field: "PRC_CST_TST_STS",
                title: "PCT Result",
                width: "120px",
                template: pctTemplate,
                locked: true,
                parent: true,
                filterable: { multi: true, search: true },
            },
            "DEAL_ID": {
                field: "DEAL_ID",
                title: "Deal Id",
                width: "100px",
                template: "<deal-popup-icon deal-id=\"'#=DEAL_ID#'\"></deal-popup-icon><a ng-click='gotoDealDetails(#= DEAL_ID #)' role='button' title='Click to go to the Deal Editor'> #= DEAL_ID # </a>",
                groupHeaderTemplate: "#= gridPctUtils.getColumnTemplate(value) #",
                locked: true,
                parent: true,
                filterable: { multi: true, search: true },
            },
            "PRODUCT": {
                field: "PRODUCT",
                title: "My Deals Product",
                width: "170px",
                locked: true,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "PCSR_NBR": {
                field: "PCSR_NBR",
                title: "Processor #",
                width: "170px",
                locked: false,
                parent: false,
                filterable: { multi: true, search: true },
            },            
            "DEAL_DESC": {
                field: "DEAL_DESC",
                title: "Deal Description",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "DEAL_STRT_DT": {
                field: "DEAL_STRT_DT",
                title: "Deal Start/End",
                width: "180px",
                template: "#= kendo.toString(new Date(DEAL_STRT_DT), 'M/d/yyyy') # - #= kendo.toString(new Date(DEAL_END_DT), 'M/d/yyyy') #",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "OEM_PLTFRM_LNCH_DT": {
                field: "OEM_PLTFRM_LNCH_DT",
                title: "OEM Platform Launch Date",
                width: "180px",
                template: "#=gridUtils.displayOEMDates(data, 'OEM_PLTFRM_LNCH_DT')#",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "OEM_PLTFRM_EOL_DT": {
                field: "OEM_PLTFRM_EOL_DT",
                title: "OEM Platform EOL Date",
                width: "180px",
                template: "#=gridUtils.displayOEMDates(data, 'OEM_PLTFRM_EOL_DT')#",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "WF_STG_CD": {
                field: "WF_STG_CD",
                title: "Deal Stage",
                width: "80px",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "CAP": {
                field: "CAP",
                title: "CAP",
                format: "{0:c}",
                template: "#= (CAP == null) ? ' ' : kendo.toString(CAP, 'c') #",
                width: "100px",
                hidden: !hasPermissionPrice,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "ECAP_DEAL_CAP": {//ECAP_DEAL_CAP is custom column which displays CAP details, it is used in ECAP deals only.
                field: "CAP",
                title: "CAP",
                format: "{0:c}",
                template: "#= (CAP == null) ? ' ' : kendo.toString(CAP, 'c') #",
                width: "100px",
                hidden: !hasSpecialPricePermission,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "MAX_RPU": {
                field: "MAX_RPU",
                title: "Max RPU",
                format: "{0:c}",
                template: "#= (MAX_RPU == null) ? ' ' : kendo.toString(MAX_RPU, 'c') #",
                width: "100px",
                hidden: !hasPermissionPrice,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "ECAP_PRC": {
                field: "ECAP_PRC",
                title: "ECAP Price",
                template: "#= (ECAP_PRC == null) ? ' ' : kendo.toString(ECAP_PRC, 'c') #",
                width: "120px",
                filterable: { multi: true, search: true },
                parent: false
            },
            "ECAP_FLR": {
                field: "ECAP_FLR",
                title: "ECAP Floor",
                template: "#= (ECAP_FLR == null) ? ' ' : kendo.toString(ECAP_FLR, 'c') #",
                width: "120px",
                hidden: !hasPermissionPrice,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "LOW_NET_PRC": {
                field: "LOW_NET_PRC",
                title: "Lowest Net Price",
                format: "{0:c}",
                template: "<div title='#= LNP_FRMULA #'>#= (LOW_NET_PRC == null) ? ' ' : kendo.toString(LOW_NET_PRC, 'c') #</div>",
                width: "140px",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "PRD_COST": {
                field: "PRD_COST",
                title: "Cost",
                format: "{0:c}",
                width: "100px",
                hidden: !hasPermissionPrice,
                template: "#= (PRD_COST == null) ? ' ' : kendo.toString(PRD_COST, 'c') #",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "CST_TYPE": {
                field: "CST_TYPE",
                title: "Cost Type",
                width: "120px",
                hidden: !hasPermissionPrice,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "COST_TEST_OVRRD_FLG": {
                field: "COST_TEST_OVRRD_FLG",
                title: "Cost Test Analysis<br\>Override",
                width: "150px",
                template: '#= gridPctUtils.getPctFlag("dataItem.COST_TEST_OVRRD_FLG", "dataItem.PRC_CST_TST_STS", "dataItem._readonly", ' + hasNoPermission + ') #',
                hidden: hasNoPermissionOvr,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "COST_TEST_OVRRD_CMT": {
                field: "COST_TEST_OVRRD_CMT",
                title: "Cost Test Analysis<br\>Override Comments",
                width: "150px",
                template: '<button class="btn btn-sm btn-skyblue" ng-if="dataItem.COST_TEST_OVRRD_FLG === \'Yes\' || dataItem.COST_TEST_OVRRD_FLG === true" ng-click="openReason(dataItem)" type="button" style="width: 100px;" title="Save and Validate"><span style="color: \\#FC4C02;">*</span> {{dataItem.COST_TEST_OVRRD_CMT === "" ? "Select" : "View Overrides"}}</button>',
                hidden: hasNoPermissionOvr,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "RTL_CYC_NM": {
                field: "RTL_CYC_NM",
                title: "Retail Cycle",
                width: "140px",
                hidden: hasNoPermission,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "RTL_PULL_DLR": {
                field: "RTL_PULL_DLR",
                title: "Retail Pull $",
                width: "140px",
                format: "{0:c}",
                template: "#= (RTL_PULL_DLR == null) ? ' ' : kendo.toString(RTL_PULL_DLR, 'c') #",
                hidden: !hasSpecialPricePermission,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "MKT_SEG": {
                field: "MKT_SEG",
                title: "Market Segment",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "GEO": {
                field: "GEO",
                title: "GEO",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "PYOUT_BASE_ON": {
                field: "PYOUT_BASE_ON",
                title: "Payout Based On",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "GRP_DEALS": {
                field: "GRP_DEALS",
                title: "Group Deals",
                width: "140px",
                template: "<div style='text-align: center;' ng-if='dataItem.PRC_CST_TST_STS !== \"NA\"'><div class='lnkBasic' ng-click='showGroups(#=DEAL_PRD_RNK#, dataItem)'>View</div></div>",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "DEAL_GRP_CMNT": {
                field: "DEAL_GRP_CMNT",
                title: "Deal Group Comments",
                width: "160px",
                parent: false,
                filterable: { multi: true, search: true },
            },
            //"REBT_TYPE": {
            //    field: "REBT_TYPE",
            //    title: "Rebate Type",
            //    width: "160px",
            //    parent: false,
            //    filterable: { multi: true, search: true },
            //},
            //"ADDITIVE": {
            //    field: "ADDITIVE",
            //    title: "Additive",
            //    width: "160px",
            //    parent: false,
            //    filterable: { multi: true, search: true },
            //},
            "LAST_COST_TEST_RUN": {
                field: "LAST_COST_TEST_RUN",
                title: "Time / Date Last Cost Ran",
                width: "180px",
                template: "<span ng-if='dataItem.PRC_CST_TST_STS !== \"NA\"'>#= kendo.toString(new Date(gridUtils.stripMilliseconds(LAST_COST_TEST_RUN)), 'M/d/yyyy HH:mm:ss') #</span>",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "CNSMPTN_RSN": {
                field: "CNSMPTN_RSN",
                title: "Consumption Reason",
                width: "160px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "PROG_PMT": {
                field: "PROG_PMT",
                title: "Program Payment",
                width: "150px",
                parent: true,
                filterable: { multi: true, search: true },
            }
        }
        $scope.templates = {
            "models": {
                "ECAP": {
                    id: "DEAL_ID",
                    fields: {
                        TOOLS: { type: "string" },
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        PCSR_NBR: { type: "string" },
                        DEAL_DESC: { type: "string" },
                        GRP_DEALS: { type: "string" },
                        REBT_TYPE: { type: "string" },
                        ADDITIVE: { type: "string" },
                        DEAL_STRT_DT: { type: "string" },
                        ECAP_DEAL_CAP: { type: "number" },
                        ECAP_PRC: { type: "number" },
                        ECAP_FLR: { type: "number" },
                        LOW_NET_PRC: { type: "number" },
                        PRD_COST: { type: "number" },
                        CST_TYPE: { type: "string" },
                        COST_TEST_OVRRD_FLG: { type: "string" },
                        COST_TEST_OVRRD_CMT: { type: "string" },
                        RTL_CYC_NM: { type: "string" },
                        RTL_PULL_DLR: { type: "number" },
                        MKT_SEG: { type: "string" },
                        GEO: { type: "string" },
                        PYOUT_BASE_ON: { type: "string" },
                        CNSMPTN_RSN: { type: "string" },
                        PROG_PMT: { type: "string" },
                        DEAL_GRP_CMNT: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "KIT": {
                    id: "DEAL_ID",
                    fields: {
                        TOOLS: { type: "string" },
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        PCSR_NBR: { type: "string" },
                        DEAL_DESC: { type: "string" },
                        GRP_DEALS: { type: "string" },
                        REBT_TYPE: { type: "string" },
                        ADDITIVE: { type: "string" },
                        DEAL_STRT_DT: { type: "string" },
                        CAP: { type: "number" },
                        ECAP_PRC: { type: "number" },
                        ECAP_FLR: { type: "number" },
                        LOW_NET_PRC: { type: "number" },
                        PRD_COST: { type: "number" },
                        CST_TYPE: { type: "string" },
                        COST_TEST_OVRRD_FLG: { type: "string" },
                        COST_TEST_OVRRD_CMT: { type: "string" },
                        RTL_CYC_NM: { type: "string" },
                        RTL_PULL_DLR: { type: "number" },
                        MKT_SEG: { type: "string" },
                        GEO: { type: "string" },
                        PYOUT_BASE_ON: { type: "string" },
                        CNSMPTN_RSN: { type: "string" },
                        PROG_PMT: { type: "string" },
                        DEAL_GRP_CMNT: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "VOL_TIER": {
                    id: "DEAL_ID",
                    fields: {
                        TOOLS: { type: "string" },
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        PCSR_NBR: { type: "string" },
                        DEAL_DESC: { type: "string" },
                        GRP_DEALS: { type: "string" },
                        REBT_TYPE: { type: "string" },
                        ADDITIVE: { type: "string" },
                        DEAL_STRT_DT: { type: "string" },
                        MAX_RPU: { type: "number" },
                        LOW_NET_PRC: { type: "number" },
                        PRD_COST: { type: "number" },
                        CST_TYPE: { type: "string" },
                        COST_TEST_OVRRD_FLG: { type: "string" },
                        COST_TEST_OVRRD_CMT: { type: "string" },
                        RTL_CYC_NM: { type: "string" },
                        RTL_PULL_DLR: { type: "number" },
                        MKT_SEG: { type: "string" },
                        GEO: { type: "string" },
                        PYOUT_BASE_ON: { type: "string" },
                        CNSMPTN_RSN: { type: "string" },
                        PROG_PMT: { type: "string" },
                        DEAL_GRP_CMNT: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "FLEX": {
                    id: "DEAL_ID",
                    fields: {
                        TOOLS: { type: "string" },
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        PCSR_NBR: { type: "string" },                        
                        DEAL_DESC: { type: "string" },
                        GRP_DEALS: { type: "string" },
                        REBT_TYPE: { type: "string" },
                        ADDITIVE: { type: "string" },
                        DEAL_STRT_DT: { type: "string" },
                        MAX_RPU: { type: "number" },
                        LOW_NET_PRC: { type: "number" },
                        PRD_COST: { type: "number" },
                        CST_TYPE: { type: "string" },
                        COST_TEST_OVRRD_FLG: { type: "string" },
                        COST_TEST_OVRRD_CMT: { type: "string" },
                        RTL_CYC_NM: { type: "string" },
                        RTL_PULL_DLR: { type: "number" },
                        MKT_SEG: { type: "string" },
                        GEO: { type: "string" },
                        PYOUT_BASE_ON: { type: "string" },
                        CNSMPTN_RSN: { type: "string" },
                        PROG_PMT: { type: "string" },
                        DEAL_GRP_CMNT: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "PROGRAM": {
                    id: "DEAL_ID",
                    fields: {
                        TOOLS: { type: "string" },
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        PCSR_NBR: { type: "string" },
                        GRP_DEALS: { type: "string" },
                        REBT_TYPE: { type: "string" },
                        ADDITIVE: { type: "string" },
                        DEAL_DESC: { type: "string" },
                        DEAL_STRT_DT: { type: "string" },
                        OEM_PLTFRM_LNCH_DT: { type: "string" },
                        OEM_PLTFRM_EOL_DT: { type: "string" },
                        MAX_RPU: { type: "number" },
                        LOW_NET_PRC: { type: "number" },
                        PRD_COST: { type: "number" },
                        CST_TYPE: { type: "string" },
                        COST_TEST_OVRRD_FLG: { type: "string" },
                        COST_TEST_OVRRD_CMT: { type: "string" },
                        RTL_CYC_NM: { type: "string" },
                        RTL_PULL_DLR: { type: "number" },
                        MKT_SEG: { type: "string" },
                        GEO: { type: "string" },
                        PYOUT_BASE_ON: { type: "string" },
                        CNSMPTN_RSN: { type: "string" },
                        PROG_PMT: { type: "string" },
                        DEAL_GRP_CMNT: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" },
                        WF_STG_CD: { type: 'string' }
                    }
                }
            },
            "columns": {
                "ECAP": [
                    $scope.cellColumns["TOOLS"],
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["PCSR_NBR"],
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["GRP_DEALS"],
                    //$scope.cellColumns["REBT_TYPE"],
                    //$scope.cellColumns["ADDITIVE"],
                    $scope.cellColumns["DEAL_STRT_DT"],
                    $scope.cellColumns["ECAP_DEAL_CAP"], // ECAP_DEAL_CAP is custom column which displays CAP details, it has different security setting than other deal type
                    $scope.cellColumns["ECAP_PRC"],
                    $scope.cellColumns["ECAP_FLR"],
                    $scope.cellColumns["LOW_NET_PRC"],
                    $scope.cellColumns["PRD_COST"],
                    $scope.cellColumns["CST_TYPE"],
                    $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                    $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                    $scope.cellColumns["RTL_CYC_NM"],
                    $scope.cellColumns["RTL_PULL_DLR"],
                    $scope.cellColumns["MKT_SEG"],
                    $scope.cellColumns["GEO"],
                    $scope.cellColumns["PYOUT_BASE_ON"],
                    $scope.cellColumns["CNSMPTN_RSN"],
                    $scope.cellColumns["PROG_PMT"],
                    $scope.cellColumns["DEAL_GRP_CMNT"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "KIT": [
                    $scope.cellColumns["TOOLS"],
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["PCSR_NBR"],
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["GRP_DEALS"],
                    //$scope.cellColumns["REBT_TYPE"],
                    //$scope.cellColumns["ADDITIVE"],
                    $scope.cellColumns["DEAL_STRT_DT"],
                    $scope.cellColumns["CAP"],
                    $scope.cellColumns["ECAP_PRC"],
                    $scope.cellColumns["ECAP_FLR"],
                    $scope.cellColumns["LOW_NET_PRC"],
                    $scope.cellColumns["PRD_COST"],
                    $scope.cellColumns["CST_TYPE"],
                    $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                    $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                    $scope.cellColumns["RTL_CYC_NM"],
                    $scope.cellColumns["RTL_PULL_DLR"],
                    $scope.cellColumns["MKT_SEG"],
                    $scope.cellColumns["GEO"],
                    $scope.cellColumns["PYOUT_BASE_ON"],
                    $scope.cellColumns["CNSMPTN_RSN"],
                    $scope.cellColumns["PROG_PMT"],
                    $scope.cellColumns["DEAL_GRP_CMNT"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "VOL_TIER": [
                    $scope.cellColumns["TOOLS"],
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["PCSR_NBR"],
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["GRP_DEALS"],
                    //$scope.cellColumns["REBT_TYPE"],
                    //$scope.cellColumns["ADDITIVE"],
                    $scope.cellColumns["DEAL_STRT_DT"],
                    $scope.cellColumns["MAX_RPU"],
                    $scope.cellColumns["LOW_NET_PRC"],
                    $scope.cellColumns["PRD_COST"],
                    $scope.cellColumns["CST_TYPE"],
                    $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                    $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                    $scope.cellColumns["RTL_CYC_NM"],
                    $scope.cellColumns["RTL_PULL_DLR"],
                    $scope.cellColumns["MKT_SEG"],
                    $scope.cellColumns["GEO"],
                    $scope.cellColumns["PYOUT_BASE_ON"],
                    $scope.cellColumns["CNSMPTN_RSN"],
                    $scope.cellColumns["PROG_PMT"],
                    $scope.cellColumns["DEAL_GRP_CMNT"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "FLEX": [
                    $scope.cellColumns["TOOLS"],
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["PCSR_NBR"],                    
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["GRP_DEALS"],
                    //$scope.cellColumns["REBT_TYPE"],
                    //$scope.cellColumns["ADDITIVE"],
                    $scope.cellColumns["DEAL_STRT_DT"],
                    $scope.cellColumns["MAX_RPU"],
                    $scope.cellColumns["LOW_NET_PRC"],
                    $scope.cellColumns["PRD_COST"],
                    $scope.cellColumns["CST_TYPE"],
                    $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                    $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                    $scope.cellColumns["RTL_CYC_NM"],
                    $scope.cellColumns["RTL_PULL_DLR"],
                    $scope.cellColumns["MKT_SEG"],
                    $scope.cellColumns["GEO"],
                    $scope.cellColumns["PYOUT_BASE_ON"],
                    $scope.cellColumns["CNSMPTN_RSN"],
                    $scope.cellColumns["PROG_PMT"],
                    $scope.cellColumns["DEAL_GRP_CMNT"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "PROGRAM": [
                    $scope.cellColumns["TOOLS"],
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["PCSR_NBR"],
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["GRP_DEALS"],
                    //$scope.cellColumns["REBT_TYPE"],
                    //$scope.cellColumns["ADDITIVE"],
                    $scope.cellColumns["DEAL_STRT_DT"],
                    $scope.cellColumns["OEM_PLTFRM_LNCH_DT"],
                    $scope.cellColumns["OEM_PLTFRM_EOL_DT"],
                    $scope.cellColumns["MAX_RPU"],
                    $scope.cellColumns["LOW_NET_PRC"],
                    $scope.cellColumns["PRD_COST"],
                    $scope.cellColumns["CST_TYPE"],
                    $scope.cellColumns["COST_TEST_OVRRD_FLG"],
                    $scope.cellColumns["COST_TEST_OVRRD_CMT"],
                    $scope.cellColumns["RTL_CYC_NM"],
                    $scope.cellColumns["RTL_PULL_DLR"],
                    $scope.cellColumns["MKT_SEG"],
                    $scope.cellColumns["GEO"],
                    $scope.cellColumns["PYOUT_BASE_ON"],
                    $scope.cellColumns["CNSMPTN_RSN"],
                    $scope.cellColumns["PROG_PMT"],
                    $scope.cellColumns["DEAL_GRP_CMNT"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ]
            }
        }

        $scope.calcNeedToRunStatus();

        $timeout(function () {

            var html = '<li class="btnGoToExclude" style="display: inline;" ng-click="gotoExclude()" class="k-item k-state-default"><span unselectable="on" class="k-link" style="width: 150px;" title="Click to Exclude Deals in Groupings">Grouping Exclusions</span></li>';
            var template = angular.element(html);
            var linkFunction = $compile(template);
            linkFunction($scope);

            $(".k-tabstrip-wrapper ul.k-tabstrip-items").append(template);
        }, 500);

    }
})();
