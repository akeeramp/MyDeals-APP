(function () {
    'use strict';

angular
    .module('app.contract')
    .controller('managerDealTypeController', managerDealTypeController);

managerDealTypeController.$inject = ['$scope', '$timeout'];

function managerDealTypeController($scope, $timeout) {

    $scope.$parent.canEdit = false;
    $scope.$parent.canFilterDealTypes = true;
    $scope.$parent.isSummaryHidden = false;

    $timeout(function () {
        $("#approvalDiv").removeClass("active");
        $("#pctDiv").removeClass("active");
        $("#dealTypeDiv").addClass("active");
        $scope.selTab('ECAP');
        $scope.$apply();
    }, 50);

}
})();
