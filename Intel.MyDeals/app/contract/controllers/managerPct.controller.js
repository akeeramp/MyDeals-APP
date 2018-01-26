(function () {
    'use strict';

    angular
        .module('app.contract')
            .controller('managerPctController', managerPctController)
            .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerPctController.$inject = ['$scope', '$state', 'objsetService', 'logger', '$timeout', 'dataService', '$compile', 'colorDictionary', '$uibModal', '$linq', '$window'];

    function managerPctController($scope, $state, objsetService, logger, $timeout, dataService, $compile, colorDictionary, $uibModal, $linq, $window) {

        var root = $scope.$parent;	// Access to parent scope
        $scope.root = root;

        $scope.pctFilter = "";
        $scope.$parent.isSummaryHidden = false;
        gridPctUtils.columns = {};
        $scope.isAllCollapsed = true;
        $scope.context = {};
        $scope.needToRunPct = false;
        $scope.dealPtIdDict = {};
        $scope.CostTestGroupDetails = {};
        $scope.CostTestGroupDealDetails = {};

        // change negative values in grid from "()" to "-"
        kendo.culture().numberFormat.currency.pattern[0] = "-$n";

        var hasNoPermission = !$scope.root.CAN_EDIT_COST_TEST;
        var hasNoPermissionOvr = !$scope.root.CAN_EDIT_COST_TEST && window.usrRole !== "Legal";
        var hasPermissionPrice = window.usrRole === "DA" || window.usrRole === "Legal" || (window.usrRole === "SA" && window.isSuper);

        $timeout(function () {
            $("#dealTypeDiv").removeClass("active");
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").addClass("active");
            $scope.$apply();
        }, 50);

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

        $scope.refreshContractDataIfNeeded = function (e, executedFromBtn) {
            objsetService.readContract($scope.root.contractData.DC_ID).then(function (data) {
                var atrbs = ["WF_STG_CD", "PASSED_VALIDATION", "COST_TEST_RESULT", "MEETCOMP_TEST_RESULT"];
                var newContractData = $scope.root.initContract(data);

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
            });
        }

        $scope.gotoContractEditor = function (ps, pt) {
            root.isPtr = false;
            root.isWip = false;

            if (!pt) {
                $state.go('contract.manager',
                    {
                        cid: ps.DC_PARENT_ID
                    });
            }

            if (!!pt) {
                $state.go('contract.manager.strategy',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID,
                        pid: pt.DC_ID
                    });
            } else {
                $state.go('contract.manager.strategy',
                    {
                        cid: ps.DC_PARENT_ID,
                        sid: ps.DC_ID
                    });
            }
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
                }, 3000);
            }, function () { });
        }

        $scope.customFilter = function (ps) {
            return (
                ($scope.pctFilter === undefined || $scope.pctFilter === '' || ps.COST_TEST_RESULT === '' || ps.COST_TEST_RESULT.toUpperCase() === $scope.pctFilter.toUpperCase()) &&
                ($scope.titleFilter === undefined || $scope.titleFilter === '' || ps.TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0 || $scope.titleInPt(ps))
                );
        }

        $scope.titleInPt = function (ps) {
            if (ps.PRC_TBL === undefined || $scope.titleFilter === '') return ps;
            for (var i = 0; i < ps.PRC_TBL.length; i++) {
                if (ps.PRC_TBL[i].TITLE.search(new RegExp($scope.titleFilter, "i")) >= 0) return ps;
            }
            return null;
        }

        $scope.unLockedGroupData = {};

        $scope.togglePt = function (ps, pt) {

            if (!!!pt.isPtCollapsed) {
                return;
            }

            //if ($("#detailGrid_" + pt.DC_ID).length === 0) {
            //    var html = "<kendo-grid options='sumGridOptions.dc" + pt.DC_ID + "' k-ng-delay='sumGridOptions.dc" + pt.DC_ID + "' id='detailGrid_" + pt.DC_ID + "' class='opUiContainer md dashboard'></kendo-grid>";
            //    var template = angular.element(html);
            //    var linkFunction = $compile(template);
            //    linkFunction($scope);

            //    $("#sumWipGrid_" + pt.DC_ID).html(template);
            //}
            $("#sumWipGrid_" + pt.DC_ID).html("<div style='margin: 10px;'><ul class='fa-ul'><li><i class='fa-li fa fa-spinner fa-spin'></i>Loading...</li></ul></div>");

            objsetService.getPctDetails(pt.DC_ID).then(
                function (e) {

                    if ($("#detailGrid_" + pt.DC_ID).length === 0) {
                        var html = "<kendo-grid options='sumGridOptions.dc" + pt.DC_ID + "' k-ng-delay='sumGridOptions.dc" + pt.DC_ID + "' id='detailGrid_" + pt.DC_ID + "' class='opUiContainer md dashboard'></kendo-grid>";
                        var template = angular.element(html);
                        var linkFunction = $compile(template);
                        linkFunction($scope);

                        $("#sumWipGrid_" + pt.DC_ID).html(template);
                    }

                    $scope.CostTestGroupDetails[pt.DC_ID] = e.data["CostTestGroupDetailItems"];
                    $scope.CostTestGroupDealDetails[pt.DC_ID] = e.data["CostTestGroupDealDetailItems"];

                    var response = e.data["CostTestDetailItems"];

                    var rollupPctBydeal = {};
                    for (var j = 0; j < response.length; j++) {
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
                                    var grp = item["PRC_CST_TST_STS"] !== "NA" ? "<div class='lnkBasic' ng-click='showGroups(true, " + item["DEAL_ID"] + ")'>View</div>" : "";
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
                        columns: $scope.templates.columns[pt.OBJ_SET_TYPE_CD],
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

                                if (dataItem.COST_TEST_OVRRD_FLG !== "Yes" && dataItem.PRC_CST_TST_STS !== "NA") {
                                    var validCost = false;
                                    var validNet = false;

                                    if (!dataItem.CAP || dataItem.CAP === "" || dataItem.CAP < 0) {
                                        $(row).children('td:eq(' + capIndex + ')').addClass('cell-warning');
                                    }
                                    if (!dataItem.ECAP_PRC || dataItem.ECAP_PRC === "" || dataItem.ECAP_PRC < 0) {
                                        $(row).children('td:eq(' + ecapIndex + ')').addClass('cell-warning');
                                    }
                                    if (!dataItem.PRD_COST || dataItem.PRD_COST === "" || dataItem.PRD_COST < 0) {
                                        $(row).children('td:eq(' + costIndex + ')').addClass('cell-warning');
                                    } else validCost = true;
                                    if (!dataItem.LOW_NET_PRC || dataItem.LOW_NET_PRC === "" || dataItem.LOW_NET_PRC < dataItem.PRD_COST) {
                                        $(row).children('td:eq(' + netIndex + ')').addClass('cell-error');
                                    } else validNet = true;
                                    if (validCost && validNet && dataItem.LOW_NET_PRC <= 0) {
                                        $(row).children('td:eq(' + netIndex + ')').addClass('cell-error');
                                    }
                                    if (!dataItem.RTL_CYC_NM || dataItem.RTL_CYC_NM === "") {
                                        $(row).children('td:eq(' + retailIndex + ')').addClass('cell-warning');
                                    }
                                }
                            });



                            $timeout(function () {
                                var grid = $("#detailGrid_" + pt.DC_ID).data("kendoGrid");
                                if (grid === undefined || grid === null) return;

                                grid.resize();

                                if (grid.dataSource.group().length > 0) {
                                    $("#detailGrid_" + pt.DC_ID).find('.k-icon.k-i-collapse').trigger('click');
                                }

                                // lame workaround.  checkboxes were not binding properly, so wait for them to load and set them.  True will pickup and check checkboxes
                                var data = grid.dataSource.data();
                                for (var d = 0; d < data.length; d++) {
                                    data[d]["COST_TEST_OVRRD_FLG"] = data[d]["COST_TEST_OVRRD_FLG"] === "Yes";
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

                            }, 100);

                        }
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

        $scope.gotoDealDetails = function (dcid) {
            $scope.setBusy("Loading..", "Redirecting to deal editor.");

            dataService.get("api/Search/GotoDeal/" + dcid).then(function (response) {
                $scope.setBusy("", "");
                var url = "/Contract#/manager/" + response.data.ContractId;
                if (response.data.PricingStrategyId > 0 && response.data.PricingTableId > 0) {
                    url += "/" + response.data.PricingStrategyId + "/" + response.data.PricingTableId;
                }
                if (response.data.WipDealId > 0) url += "/wip";
                var win = $window.open(url);
            }, function (response) {
                $scope.setBusy("Error", "Could not load deal data.");
                logger.error("Could not load deal data.", response, response.statusText);
                $timeout(function () {
                    $scope.setBusy("", "");
                }, 2000);
            });
        }

        $scope.showGroups = function (isDealMode, dealId, dataItem) {

            if (isDealMode) {
                $scope.context = $linq.Enumerable()
                    .From($scope.CostTestGroupDealDetails[$scope.dealPtIdDict[dealId]])
                    .Where(function (x) {
                        return x.DEAL_ID === dealId;
                    }).ToArray();
            } else {
                $scope.context = $linq.Enumerable()
                    .From($scope.CostTestGroupDetails[$scope.dealPtIdDict[dataItem.DEAL_ID]])
                    .Where(function (x) {
                        return x.DEAL_PRD_RNK === dealId;
                    }).ToArray();
            }

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
                    }
                }
            });

            modalInstance.result.then(function (selectedItems) {
            }, function () { });
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

                        kendo.confirm("Would you like to run Price Cost Test now?")
                            .then(function () {
                                root.refreshContractData();
                            },
                            function () { });
                    });
            }
        }

        $scope.getResultMapping = function (result, flg, className, style) {
            return gridPctUtils.getResultMapping(result, flg, '', className, style);
        }

        // Global Settings
        var pctTemplate = root.CAN_VIEW_COST_TEST ? "#= gridPctUtils.getResultMapping(PRC_CST_TST_STS, '!dataItem.COST_TEST_OVRRD_FLG', 'dataItem.COST_TEST_OVRRD_FLG', '', 'font-size: 20px !important;') #" : "&nbsp;";
        $scope.cellColumns = {
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
                template: "<a ng-click='gotoDealDetails(#= DEAL_ID #)' role='button' title='Click to go to the Deal Editor'> #= DEAL_ID # </a>",
                groupHeaderTemplate: "#= gridPctUtils.getColumnTemplate(value) #",
                locked: true,
                parent: true,
                filterable: { multi: true, search: true },
            },
            "PRODUCT": {
                field: "PRODUCT",
                title: "Product",
                width: "170px",
                locked: true,
                parent: false,
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
                width: "100px",
                filterable: { multi: true, search: true },
                parent: false
            },
            "ECAP_FLR": {
                field: "ECAP_FLR",
                title: "ECAP Floor",
                template: "#= (ECAP_FLR == null) ? ' ' : kendo.toString(ECAP_FLR, 'c') #",
                width: "100px",
                hidden: !hasPermissionPrice,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "LOW_NET_PRC": {
                field: "LOW_NET_PRC",
                title: "Lowest Net Price",
                format: "{0:c}",
                template: "#= (LOW_NET_PRC == null) ? ' ' : kendo.toString(LOW_NET_PRC, 'c') #",
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
                width: "140px",
                template: '#= gridPctUtils.getPctFlag("dataItem.COST_TEST_OVRRD_FLG", "dataItem.PRC_CST_TST_STS", "dataItem._readonly", ' + hasNoPermission + ') #',
                hidden: hasNoPermissionOvr,
                parent: false,
                filterable: { multi: true, search: true },
            },
            "COST_TEST_OVRRD_CMT": {
                field: "COST_TEST_OVRRD_CMT",
                title: "Cost Test Analysis<br\>Override Comments",
                width: "140px",
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
                hidden: !hasPermissionPrice,
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
                template: "<div style='text-align: center;' ng-if='dataItem.PRC_CST_TST_STS !== \"NA\"'><div class='lnkBasic' ng-click='showGroups(false, #=DEAL_PRD_RNK#, dataItem)'>View</div></div>",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "DEAL_GRP_CMNT": {
                field: "DEAL_GRP_CMNT",
                title: "Deal Group Comments",
                width: "140px",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "DEAL_DESC": {
                field: "DEAL_DESC",
                title: "Deal Description",
                width: "140px",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "LAST_COST_TEST_RUN": {
                field: "LAST_COST_TEST_RUN",
                title: "Time / Date Last Cost Ran",
                width: "160px",
                template: "<span ng-if='dataItem.PRC_CST_TST_STS !== \"NA\"'>#= kendo.toString(new Date(LAST_COST_TEST_RUN), 'M/d/yyyy HH:mm:ss') #</span>",
                parent: false,
                filterable: { multi: true, search: true },
            },
            "CNSMPTN_RSN": {
                field: "CNSMPTN_RSN",
                title: "Consumption Reason",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            },
            "PROG_PMT": {
                field: "PROG_PMT",
                title: "Program Payment",
                width: "140px",
                parent: true,
                filterable: { multi: true, search: true },
            }
        }
        $scope.templates = {
            "models": {
                "ECAP": {
                    id: "DEAL_ID",
                    fields: {
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        GRP_DEALS: { type: "string" },
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
                        DEAL_DESC: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "KIT": {
                    id: "DEAL_ID",
                    fields: {
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        GRP_DEALS: { type: "string" },
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
                        DEAL_DESC: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "VOL_TIER": {
                    id: "DEAL_ID",
                    fields: {
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        GRP_DEALS: { type: "string" },
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
                        DEAL_DESC: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                },
                "PROGRAM": {
                    id: "DEAL_ID",
                    fields: {
                        PRC_CST_TST_STS: { type: "string" },
                        DEAL_ID: { type: "number" },
                        PRODUCT: { type: "string" },
                        GRP_DEALS: { type: "string" },
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
                        DEAL_DESC: { type: "string" },
                        LAST_COST_TEST_RUN: { type: "string" }
                    }
                }
            },
            "columns": {
                "ECAP": [
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["GRP_DEALS"],
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
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "KIT": [
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["GRP_DEALS"],
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
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "VOL_TIER": [
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["GRP_DEALS"],
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
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ],
                "PROGRAM": [
                    $scope.cellColumns["PRC_CST_TST_STS"],
                    $scope.cellColumns["DEAL_ID"],
                    $scope.cellColumns["PRODUCT"],
                    $scope.cellColumns["GRP_DEALS"],
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
                    $scope.cellColumns["DEAL_DESC"],
                    $scope.cellColumns["LAST_COST_TEST_RUN"]
                ]
            }
        }

    }
})();
