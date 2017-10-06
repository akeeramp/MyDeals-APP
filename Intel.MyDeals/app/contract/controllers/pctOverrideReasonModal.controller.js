angular
    .module('app.contract')
    .controller('pctOverrideReasonModalCtrl', pctOverrideReasonModalCtrl);

pctOverrideReasonModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'objsetService'];

function pctOverrideReasonModalCtrl($scope, $uibModalInstance, dataItem, objsetService) {

    $scope.curData = dataItem.COST_TEST_OVRRD_CMT.split(",");
    $scope.dataItem = dataItem;
    $scope.seeMore = false;
    $scope.extendedCols = ["MEET_COMP_PRD", "MEET_COMP_PRC", "BUSNS_OBJ", "PTNTL_MKT_IMPCT", "APRV_ATRNY", "DT_APRV"];

    $scope.toggleSee = function () {
        var c;
        var grid = $("#gridOverrideReason").data("kendoGrid");

        if ($scope.seeMore) {
            for (c = 0; c < $scope.extendedCols.length; c++) {
                grid.hideColumn($scope.extendedCols[c]);
            }
        } else {
            for (c = 0; c < $scope.extendedCols.length; c++) {
                grid.showColumn($scope.extendedCols[c]);
            }
        }

        $scope.seeMore = !$scope.seeMore;
    }

    $scope.gridOptions = {
        dataSource: {
            type: "json",
            transport: {
                read: "/api/ProductCostTest/GetLegalExceptionsPct/" + moment(dataItem.DEAL_END_DT).format("MM-DD-YYYY")
            },
            requestEnd: function (e) {
                if (!e.response) return;

                var response = e.response;
                for (var i = 0; i < response.length; i++) {
                    response[i]["isSelected"] = $scope.curData.indexOf(response[i]["MYDL_PCT_LGL_EXCPT_SID"].toString()) >= 0;
                }
            }
        },
        height: 300,
        sortable: true,
        filterable: true,
        resizable: true,
        columns: [
            {
                field: "isSelected",
                title: "&nbsp;",
                filterable: false,
                template: "<div style='padding-left: 6px;'><input type='checkbox' ng-model='dataItem.isSelected' id='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' class='with-font'/><label for='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' style='margin-top: 6px; margin-bottom: 0;'>&nbsp;</label></div>",
                width: "60px"
            },
            {
                field: "INTEL_PRD",
                title: "Intel Product",
                width: "120px"
            },
            {
                field: "SCPE",
                title: "Scope",
                width: "200px"
            },
            {
                field: "COST",
                title: "Cost",
                format: "{0:c}",
                width: "120px"
            },
            {
                field: "PCT_LGL_EXCPT_STRT_DT",
                title: "Exception Start Date",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_STRT_DT), 'M/d/yyyy') #",
                width: "120px"
            },
            {
                field: "PCT_LGL_EXCPT_END_DT",
                title: "Exception End Date",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_END_DT), 'M/d/yyyy') #",
                width: "120px"
            },
            {
                field: "MEET_COMP_PRD",
                title: "Comp Product",
                hidden: true,
                width: "120px"
            },
            {
                field: "MEET_COMP_PRC",
                title: "Comp Price",
                hidden: true,
                width: "120px"
            },
            {
                field: "BUSNS_OBJ",
                title: "Business Object",
                hidden: true,
                width: "120px"
            },
            {
                field: "PTNTL_MKT_IMPCT",
                title: "Potential Market Impact",
                hidden: true,
                width: "120px"
            },
            {
                field: "APRV_ATRNY",
                title: "Approving Attorney",
                hidden: true,
                width: "120px"
            },
            {
                field: "DT_APRV",
                title: "Date Approved",
                hidden: true,
                template: "#= kendo.toString(new Date(DT_APRV), 'M/d/yyyy') #",
                width: "120px"
            }
        ]
    };


    $scope.ok = function () {
        var grid = $("#gridOverrideReason").data("kendoGrid");
        var data = grid.dataSource.data();
        var rtnVal = [];

        for (var r = 0; r < data.length; r++) {
            if (data[r].isSelected) rtnVal.push(data[r].MYDL_PCT_LGL_EXCPT_SID);
        }

        $scope.dataItem.COST_TEST_OVRRD_CMT = rtnVal.join(",");

        var newItem = {
            "CUST_NM_SID": $scope.dataItem.CUST_NM_SID,
            "DEAL_OBJ_TYPE_SID": 5,
            "DEAL_OBJ_SID": $scope.dataItem.DEAL_ID,
            "PRD_MBR_SIDS": $scope.dataItem.PRD_MBR_SIDS,
            "CST_OVRRD_FLG": 1,
            "CST_OVRRD_RSN": $scope.dataItem.COST_TEST_OVRRD_CMT
        };

        objsetService.setPctOverride(newItem).then(
            function (data) {

                //debugger;
            });

        $uibModalInstance.close(rtnVal);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

}