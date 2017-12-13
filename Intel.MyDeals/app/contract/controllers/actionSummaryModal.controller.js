angular
    .module('app.contract')
    .controller('actionSummaryModalCtrl', actionSummaryModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

actionSummaryModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItems', 'showErrMsg'];

function actionSummaryModalCtrl($scope, $uibModalInstance, dataItems, showErrMsg) {

    $scope.curData = dataItems;
    $scope.showErrMsg = showErrMsg;

    $scope.gridOptions = {
        dataSource: {
            data: $scope.curData
        },
        sortable: true,
        scollable: true,
        resizable: true,
        columns: [
            {
                field: "TITLE",
                title: "Strategy Name"
            },
            {
                field: "ACTN",
                title: "Approve or Revise",
                width: "200px"
            }
        ]
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
    $scope.ok = function () {
        $uibModalInstance.close(false);
    };
    $scope.okMail = function () {
        $uibModalInstance.close(true);
    };

}