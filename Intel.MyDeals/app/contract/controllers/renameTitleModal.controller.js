angular
    .module('app.contract')
    .controller('renameTitleModalCtrl', renameTitleModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

renameTitleModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'mode', 'defVal', 'errMsg', 'objsetService'];

function renameTitleModalCtrl($scope, $uibModalInstance, dataItem, mode, defVal, errMsg, objsetService) {

    $scope.mode = mode;
    $scope.dataItem = dataItem;
    $scope.TITLE = (defVal === undefined) ? dataItem.TITLE : defVal;
    $scope.ORIGTITLE = dataItem.TITLE;
    $scope.errMsg = errMsg;

    $scope.enterPressed = function (event) {
        //KeyCode 13 is 'Enter'
        if (event.keyCode === 13 && $scope.TITLE.length > 0) {
            $scope.ok();
        }
    };

    $scope.ok = function () {
        $scope.errMsg = $scope.TITLE === "" ? "Please enter a name." : "";
        $scope.dataItem.TITLE = $scope.TITLE;
        $uibModalInstance.close($scope.ORIGTITLE);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

}