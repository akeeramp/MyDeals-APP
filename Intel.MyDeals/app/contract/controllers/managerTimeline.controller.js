(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerTimelineController', managerTimelineController);

    managerTimelineController.$inject = ['$scope', '$timeout'];

    function managerTimelineController($scope, $timeout) {

        var root = $scope.$parent;	// Access to parent scope

        $scope.pctFilter = "";
        $scope.$parent.isSummaryHidden = false;

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#timelineDiv").addClass("active");
            $("#overlappingDiv").removeClass("active");
            $scope.$apply();
        }, 50);

    }
})();
