(function () {
    'use strict';

angular
    .module('app.contract')
        .controller('managerDealTypeController', managerDealTypeController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

managerDealTypeController.$inject = ['$scope', '$timeout'];

function managerDealTypeController($scope, $timeout) {

    $scope.$parent.canEdit = false;
    $scope.$parent.canFilterDealTypes = true;
    $scope.$parent.isSummaryHidden = false;

    $timeout(function () {
        $("#approvalDiv").removeClass("active");
        $("#pctDiv").removeClass("active");
        $("#contractReviewDiv").removeClass("active");
        $("#dealReviewDiv").removeClass("active");
        $("#dealTypeDiv").addClass("active");
        $("#historyDiv").removeClass("active");
        $scope.selTab('ECAP');
        $scope.$apply();
    }, 50);

}
})();
