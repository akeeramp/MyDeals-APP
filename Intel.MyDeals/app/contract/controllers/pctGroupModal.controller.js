angular
    .module('app.contract')
    .controller('pctGroupModalCtrl', pctGroupModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

pctGroupModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem'];

function pctGroupModalCtrl($scope, $uibModalInstance, dataItems) {

    $scope.curData = dataItems;
    $scope.disabled = "disabled";
    //$scope.disabled = window.usrRole === "DA" ? "disabled" : "";

    for (var d = 0; d < $scope.curData.length; d++) {
        $scope.curData[d].EXCLD_DEAL_FLAG = ($scope.curData[d].EXCLD_DEAL_FLAG === 1 || $scope.curData[d].EXCLD_DEAL_FLAG === true);
    }

    $scope.gridOptions = {
        dataSource: {
            data: $scope.curData
        },
        height: 300,
        sortable: true,
        scollable: true,
        filterable: true,
        resizable: true,
        columns: [
            {
                field: "EXCLD_DEAL_FLAG",
                title: "&nbsp;",
                filterable: false,
                template: "<div style='padding-left: 6px;'><input type='checkbox' " + $scope.disabled + " ng-model='dataItem.EXCLD_DEAL_FLAG' id='chkId_#=OVLP_DEAL_ID#' class='with-font'/><label for='chkId_#=OVLP_DEAL_ID#' style='margin-top: 6px; margin-bottom: 0;'>&nbsp;</label></div>",
                width: "60px"
            },
            {
                field: "OVLP_DEAL_ID",
                title: "Deal #",
                width: "80px"
            },
            {
                field: "OVLP_DEAL_TYPE",
                title: "Deal Type",
                width: "80px"
            },
            {
                field: "OVLP_CNTRCT_NM",
                title: "Contract",
                width: "160px"
            },
            {
                field: "OVLP_WF_STG_CD",
                title: "Stage",
                width: "80px"
            }, {
                field: "OVLP_DEAL_DESC",
                title: "Deal Description",
                width: "120px"
            }, {
                field: "OVLP_DEAL_STRT_DT",
                title: "Start Date",
                template: "#= kendo.toString(new Date(OVLP_DEAL_STRT_DT), 'M/d/yyyy') #",
                width: "80px"
            },
            {
                field: "OVLP_DEAL_END_DT",
                title: "End Date",
                template: "#= kendo.toString(new Date(OVLP_DEAL_END_DT), 'M/d/yyyy') #",
                width: "80px"
            },
            {
                field: "OVLP_ADDITIVE",
                title: "Additive",
                width: "120px"
            },
            {
                field: "OVLP_CNSMPTN_RSN",
                title: "Consumption Reason",
                width: "120px"
            }
        ]
    };

    $scope.ok = function () {
        $uibModalInstance.dismiss();
    };

}