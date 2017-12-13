(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('suggestProductController', suggestProductController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    suggestProductController.$inject = ['$scope', 'suggestProductService', 'logger'];

    function suggestProductController($scope, suggestProductService, logger) {
        debugger;
        $scope.userProduct = "hello world";

        $scope.findProductsClick = function () {
            debugger;
            suggestProductService.FindSuggestedProduct($scope.userProduct)
                                    .then(function (response) {
                    debugger;
                }, function (response) {
                                        logger.error("Unable to run Suggest Product 2.", response, response.statusText);
                                    });
        }

        $scope.output = "Some string";

    };
})();

