angular
    .module('app.core')
    .directive('timelineDetails', timelineDetails);

timelineDetails.$inject = ['$compile', 'dataService', '$timeout', 'logger', '$linq', '$state'];

function timelineDetails($compile, dataService, $timeout, logger, $linq, $state) {
    kendo.culture("en-US");

    return {
        scope: {
            opId: '=',
            opObjType: '=' // This will determine which DB proc to call Exam: 1 for Contact, 2 for Pricing table etc
        },
        restrict: 'AE',
        transclude: true,
        templateUrl: '/app/core/directives/timeline/timelineDetails.directive.html',
        controller: ['$scope', 'dataService', function ($scope, dataService) {
            $scope.timelineData = [];
            $scope.approverList = [];
            $scope.selectedObj = [];
            $scope.btnText = 'Show more ';
            $scope.numberOfRecrods = 5;
            if (!!$scope.opId) {
                $scope.loading = true;
                dataService.get("api/Timeline/GetTimelineDetails/" + $scope.opId + "/" + $scope.opObjType).then(function (response) {
                    $scope.loading = false;
                    response.data.forEach(function (obj) {
                        obj.HIST_EFF_FR_DTM = new Date(obj.HIST_EFF_FR_DTM);
                    });
                    $scope.timelineData = response.data;
                    $scope.selectedObj = response.data;
                    $scope.isFilterApplied = false;
                    return response.data;
                },
                    function (response) {
                        logger.error("Unable to get data", response, response.statusText);
                    });
            }

            $scope.showAll = function (recordCnt) {
                if (recordCnt == 5 && $scope.timelineData.length > 5) {
                    $scope.btnText = 'Show less ';
                    $scope.numberOfRecrods = $scope.timelineData.length;
                }
                else {
                    $scope.btnText = 'Show more ';
                    $scope.numberOfRecrods = 5;
                }                    
               
            }          

            $scope.gotoHistory = function () {
                $state.go('contract.timeline',
                    {
                        cid: $scope.opId
                    }, { reload: true });
            }
            
        }],
        link: function (scope, element, attrs) {
            
        }
    };
}