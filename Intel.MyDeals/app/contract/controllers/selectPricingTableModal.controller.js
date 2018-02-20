angular
    .module('app.contract')
    .controller('selectPricingTableModalCtrl', selectPricingTableModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

selectPricingTableModalCtrl.$inject = ['$scope', '$uibModalInstance', 'pts'];

function selectPricingTableModalCtrl($scope, $uibModalInstance, pts) {

    $scope.pts = pts;

    $scope.pickPt = function(pt) {
        $uibModalInstance.close(pt);
    }
    $scope.ok = function () {
        $uibModalInstance.close("hi");
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

}