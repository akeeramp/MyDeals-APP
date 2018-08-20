angular
    .module('app.contract')
    .controller('pctOverrideReasonModalCtrl', pctOverrideReasonModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

pctOverrideReasonModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'objsetService'];

function pctOverrideReasonModalCtrl($scope, $uibModalInstance, dataItem, objsetService) {

    $scope.curData = dataItem.COST_TEST_OVRRD_CMT.split(",");
    $scope.dataItem = dataItem;
    $scope.seeMore = false;
    $scope.extendedCols = ["MEET_COMP_PRD", "MEET_COMP_PRC", "BUSNS_OBJ", "PTNTL_MKT_IMPCT", "APRV_ATRNY", "DT_APRV"];
    $scope.disabled = dataItem._readonly || window.usrRole === "Legal" ? "disabled" : "";

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
                for (var i = response.length - 1; i >= 0; i -= 1) {
                    response[i]["isSelected"] = $scope.curData.indexOf(response[i]["MYDL_PCT_LGL_EXCPT_SID"].toString()) >= 0;

                    // If not read only then remove the hidden exception
                    if ((!dataItem._readonly && response[i].IS_DSBL) || (dataItem._readonly && !response[i].isSelected && response[i].IS_DSBL)) {
                        response.splice(i, 1);
                    }
                }
            }
        },
        sortable: true,
        filterable: true,
        resizable: true,
        scrollable: true,
        columns: [
            {
                field: "isSelected",
                title: "&nbsp;",
                filterable: false,
                template: "<div ng-if='#=MYDL_PCT_LGL_EXCPT_SID# == -1' style='padding-left: 6px;'>"                                //if legal exception sid is -1, aka "See DCS...", we need to disable the checkbox to prevent users from changing it from its' current state.
                        +   "<input type='checkbox' " + 'disabled' + " ng-model='dataItem.isSelected' id='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' class='with-font disabled'/>"
                        +   "<label for='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' style='margin-top: 6px; margin-bottom: 0;'>&nbsp;</label>"
                        + "</div>"
                        + "<div ng-if='#=MYDL_PCT_LGL_EXCPT_SID# != -1' style='padding-left: 6px;'>"                                //all other legal exceptions get an ordinary checkbox
                        + "<input type='checkbox' " + $scope.disabled + " ng-class='{disabled: dataItem.IS_DSBL}' ng-disabled='dataItem.IS_DSBL' ng-model='dataItem.isSelected' id='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' class='with-font' ng-class='disabled'/>"
                        + "<label for='chkId_#=MYDL_PCT_LGL_EXCPT_SID#' title='{{dataItem.IS_DSBL ? \"Exception is disabled for selection. Please contact legal\" : \"\"}}' style='margin-top: 6px; margin-bottom: 0;'>&nbsp;</label>"
                        + "</div>",
                width: "60px",
                locked: true,
            },
            {
                field: "INTEL_PRD",
                title: "Intel Product",
                width: "220px",
                locked:true
            },
            {
                field: "SCPE",
                title: "Scope",
                width: "350px"
            },
            {
                field: "COST",
                title: "Cost",
                format: "{0:c}",
                width: "140px"
            },
            {
                field: "PCT_LGL_EXCPT_STRT_DT",
                title: "Exception Start Date",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_STRT_DT), 'M/d/yyyy') #",
                width: "150px"
            },
            {
                field: "PCT_LGL_EXCPT_END_DT",
                title: "Exception End Date",
                template: "#= kendo.toString(new Date(PCT_LGL_EXCPT_END_DT), 'M/d/yyyy') #",
                width: "150px"
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

        if (rtnVal.length == 0) {
			// Nothing was selected
        	$uibModalInstance.dismiss();
        	return;
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