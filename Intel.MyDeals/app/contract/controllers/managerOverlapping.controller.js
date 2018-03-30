(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerOverlappingController', managerOverlappingController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerOverlappingController.$inject = ['$scope', '$timeout', '$compile'];

    function managerOverlappingController($scope, $timeout, $compile) {

        var root = $scope.$parent;	// Access to parent scope

        $scope.pctFilter = "";
        $scope.$parent.isSummaryHidden = false;

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").removeClass("active");
            $("#overlapDiv").addClass("active");
            $("#groupExclusionDiv").removeClass("active");
            $scope.$apply();
        }, 50);

        $scope.objSids = [$scope.$parent.contractData.DC_ID];
        $scope.objType = "Contract";
        $scope.openModal = function () {
            var myWindow = $("#smbWindow");
            var html = "<overlapping-deals obj-sids='objSids' obj-type='objType' style='height: 100%;'></overlapping-deals>";
            var template = angular.element(html);
            $compile(template)($scope);
            
            $("#smbWindow").html(template);

            myWindow.kendoWindow({
                width: "800px",
                height: "500px",
                title: "Overlapping Deals",
                visible: false,
                actions: [
                    "Minimize",
                    "Maximize",
                    "Close"
                ],
                close: function () {
                    $("#smbWindow").html("");
                }
            }).data("kendoWindow").center().open();

        }

        $scope.refreshOverlappingDeals = function () {
            $scope.$root.$broadcast("overlappingDealSearch", null);
        }

        $scope.$on('overlappingDealSearching', function (event) {
        });
        $scope.$on('overlappingDealFinished', function (event) {
        });
        $scope.$on('overlappingDealUpdating', function (event) {
            $scope.setBusy("Overlapping Deals...", "Updating Overlapping Deals!");
        });
        $scope.$on('overlappingDealUpdateFinished', function (event) {
            $scope.setBusy("", "");
        });
        $scope.$on('overlappingDealFailed', function (event) {
            op.notifyWarning("Unable to get Overlapping Deals", "Overlap Warning");
            $scope.setBusy("", "");
        });
        

    }
})();
