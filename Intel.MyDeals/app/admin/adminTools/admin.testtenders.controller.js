(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('TestTendersController', TestTendersController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    TestTendersController.$inject = ['$scope', 'logger'];

    function TestTendersController($scope, logger) {
        var vm = this;
        $scope.testTendersData = {};

        $scope.ExcutetestTendersData = function () {
            var JsonObj = {
                'CNTRCT_ID': $scope.testTendersData.CNTRCT_ID,
                'CNTRCT_SF_ID': $scope.testTendersData.CNTRCT_SF_ID,
                'DEAL_ID': $scope.testTendersData.DEAL_ID,
                'DEAL_SF_ID': $scope.testTendersData.DEAL_SF_ID,
                'START_DT': $scope.testTendersData.START_DT,
                'END_DT': $scope.testTendersData.END_DT,
                'PROD_IDs': $scope.testTendersData.PROD_IDs,
                'ECAP': $scope.testTendersData.ECAP,
                'VOLUME': $scope.testTendersData.VOLUME,
                'END_CUST': $scope.testTendersData.END_CUST
            } 
            alert(angular.toJson(JsonObj));

        }

    }
})();