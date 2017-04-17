(function() {
    'use strict';

    angular.module('app.testCases')
        .controller('suggestProductController', suggestProductController);

    suggestProductController.$inject = ['$scope', 'suggestProductService', 'logger'];

    function suggestProductController($scope, suggestProductService, logger) {
        $scope.userProduct = "e4400";

        $scope.findProductsClick = function () {
            $scope.output = "Loading";
            op.ajaxPostWait("/api/Products/FindSuggestedProduct",
                $scope.userProduct,
                function (response) {
                    if (Array.isArray(response)) {
                        var a = [];
                        for (var i = 0; i < response.length; i++) {
                            a.push(response[i].PRD_MBR_SID + " - [" + response[i].BRND_NM + "][" + response[i].FMLY_NM + "][" + response[i].PRCSSR_NBR + "][" + response[i].DEAL_PRD_NM + "][" + response[i].MTRL_ID + "]");
                        }
                        $scope.output = a.join(", ");
                    } else {
                        $scope.output = "Nothing found.";
                    }
                },
                function(response) {
                    logger.error("Unable to run Suggest Product.", response, response.statusText);
                });
        }

        $scope.output = "";

    };
})();

