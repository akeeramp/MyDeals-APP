(function () {
    angular
        .module('app.contract')
        .controller('missingCapCostModalCtrl', missingCapCostModalCtrl)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    missingCapCostModalCtrl.$inject = ['$scope', '$uibModalStack', '$timeout']; //'objsetService', 'dataService', '$filter', 

    function missingCapCostModalCtrl($scope, $uibModalStack, $timeout) {

        kendo.culture("en-US");

        //var root = $scope.$parent;	// Access to parent scope
        //$scope.root = root;
        $scope.dealProducts = [];
        $scope.loading = true;
        $scope.msg = "Loading Missing CAP/Cost Deal Products";
        //$scope.$parent.isSummaryHidden = false;

        var hasPermissionPrice = window.usrRole === "DA" || window.usrRole === "Legal" || (window.usrRole === "SA" && window.isSuper);

        var dealRecord = $scope.$resolve.dataItem;
        $scope.dealId = dealRecord.DC_ID;

        $scope.dealproductsDs = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: 'api/Products/GetDealProducts/' + dealRecord.DC_ID + '/5/' + dealRecord.CUST_MBR_SID,
                    type: "GET",
                    dataType: "json"
                }
            },
            schema: {
                parse: function (data) {
                    if (!hasPermissionPrice) {
                        for (var d = 0; d < data.length; d++) {
                            if (data[d].PRD_COST !== "No Cost" && data[d].PRD_COST !== "NA") {
                                data[d]["PRD_COST"] = "No access";
                            }
                        }
                    }
                    if (hasPermissionPrice && usrVerticals.length > 0) {
                        for (var d = 0; d < data.length; d++) {
                            if (usrVerticals.indexOf(data[d].PRD_CAT_NM) === -1 && (data[d].PRD_COST !== "No Cost" && data[d].PRD_COST !== "NA")) {
                                data[d]["PRD_COST"] = "No access";
                            }
                        }
                    }
                    return data;
                },
                model: {
                    fields: {

                    }
                }
            },
            pageSize: 25,
            requestEnd: function (e) {
                $scope.msg = "Done";
                $scope.dealProducts = e.response;
                $timeout(function () {
                    $scope.loading = false;
                    window.setTimeout(function () {
                        resizeGrid();
                    }, 100);
                }, 500);
            }
        });


        $scope.gridOptions = {
            dataSource: $scope.dealproductsDs,
            sortable: true,
            resizable: true,
            pageable: true,
            filterable: true,
            scrollable: true,
            toolbar: [{ name: 'excel', text: '<div class="excelText"><span>Excel<br/>Export</span></div>' }],
            excel: {
                fileName: "Deal " + dealRecord.DC_ID + " Missing CAP/Cost Products.xlsx",
                filterable: true
            },
            columns: [{
                field: "OBJ_SID",
                title: "Deal Id",
                width: "160px"
            }, {
                field: "HIER_VAL_NM",
                title: "Product",
                width: "160px"
            }, {
                field: "CAP",
                title: "CAP-YCP1",
                width: "110px",
                template: function (dataItem) {
                    if (dataItem.CAP == 'No CAP') {
                        return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No CAP</div></div>'
                    }
                    return '<div style="text-align: center;">' + dataItem.CAP + '</div>';
                }
            }, {
                field: "PRD_COST",
                title: "Cost",
                width: "110px",
                template: function (dataItem) {
                    if (dataItem.PRD_COST === 'No Cost') {
                        return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No Cost</div></div>'
                    }
                    return '<div style="text-align: center;">' + dataItem.PRD_COST + '</div>';
                }

            }, {
                field: "DEAL_PRD_TYPE",
                title: "Product Type",
                width: "110px"
            }, {
                field: "PRD_CAT_NM",
                title: "Vertical",
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
                width: "140px"
            }, {
                field: "PRD_END_DTM",
                title: "Prod End Date",
                width: "140px"
            }, {
                field: "YCS2",
                title: "YCS2",
                width: "110px",
                template: function (dataItem) {
                    if (dataItem.YCS2 == 'No YCS2') {
                        return '<div class="uiControlDiv isSoftWarnCell" style="font-family: arial; text-align: center; color: white;"><div style="font-family: arial; text-align: center;font-weight:600">No YCS2</div></div>'
                    }
                    return '<div style="text-align: center;">' + dataItem.YCS2 + '</div>';
                }
            }]

        }

        $scope.dealproductsDs.read();

        function resizeGrid() {
            $("#missingCapCostGrid").css("height", $(window).height() - 250);
            $("#missingCapCostGrid").data("kendoGrid").resize();
        }

        $scope.dismissPopup = function () {
            $uibModalStack.dismissAll();
        }

    }
})();