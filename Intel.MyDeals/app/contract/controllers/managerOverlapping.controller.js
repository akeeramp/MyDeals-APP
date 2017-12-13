(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerOverlappingController', managerOverlappingController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerOverlappingController.$inject = ['$scope', '$timeout'];

    function managerOverlappingController($scope, $timeout) {

        var root = $scope.$parent;	// Access to parent scope

        $scope.pctFilter = "";
        $scope.$parent.isSummaryHidden = false;

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#timelineDiv").removeClass("active");
            $("#overlappingDiv").addClass("active");
            $scope.$apply();
        }, 50);

    }
})();
