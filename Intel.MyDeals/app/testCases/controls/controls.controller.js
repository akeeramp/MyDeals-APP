(function () {
    'use strict';

    angular.module('app.testCases')
        .controller('controlsController', controlsController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    controlsController.$inject = ['$uibModal', '$scope'];

    function controlsController($uibModal, $scope) {
        $scope.dealId = 508649;
    }
})();