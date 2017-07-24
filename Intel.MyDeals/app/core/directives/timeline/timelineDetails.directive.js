angular
    .module('app.core')
    .directive('timelineDetails', timelineDetails);

timelineDetails.$inject = ['$compile', 'dataService', '$timeout', 'logger', '$linq'];

function timelineDetails($compile, dataService, $timeout, logger, $linq) {
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
                    $scope.timelineData = response.data;
                    $scope.selectedObj = response.data;
                    $scope.isFilterApplied = false;
                    $scope.approverList = $linq.Enumerable().From(response.data)
                        .GroupBy(function (x) {
                            return (x.CHG_EMP_WWID);
                        }).Select(function (x) {
                            return {
                                'CHG_EMP_WWID': x.source[0].CHG_EMP_WWID,
                                'NAME': x.source[0].FRST_NM + ' ' + x.source[0].LST_NM
                            };
                        })
                        .ToArray();
                    $scope.approverList = $scope.approverList.filter(function (value) {
                        return value.NAME.trim().length > 0;
                    });


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

            $scope.approverChange = function (data) {
                $scope.selectedObj = $scope.timelineData;
                if (data) {
                    $scope.selectedApprover = data.CHG_EMP_WWID;
                }
                else {
                    $scope.selectedApprover = null;
                }
                $scope.approverFilter(); 
            };

            $scope.changeStartDate = function (data) {                
                $scope.selectedObj = $scope.timelineData;
                $scope.startDate = moment(data).format("l");
                $scope.approverFilter(); 
            };
            $scope.changeEndDate = function (data) {                
                $scope.selectedObj = $scope.timelineData;
                $scope.endDate = moment(data).format("l");
                $scope.approverFilter(); 
            };
            $scope.approverFilter = function () {
                $scope.isFilterApplied = false;
                if ($scope.selectedApprover) {
                    $scope.isFilterApplied = true;
                    $scope.selectedObj = $scope.selectedObj.filter(function (item) {
                        return item.CHG_EMP_WWID == $scope.selectedApprover;
                    });
                }                

                if ($scope.startDate) {
                    $scope.isFilterApplied = true;
                    $scope.selectedObj = $scope.selectedObj.filter(function (item) {
                        return Date.parse(moment(item.HIST_EFF_FR_DTM).format("l")) >= Date.parse($scope.startDate);
                    });
                }

                if ($scope.endDate) {
                    $scope.isFilterApplied = true;
                    $scope.selectedObj = $scope.selectedObj.filter(function (item) {
                        return Date.parse(moment(item.HIST_EFF_FR_DTM).format("l")) <= Date.parse($scope.endDate);
                    });
                }                
            };

            $scope.removeFilter = function () {
                $scope.selectedObj = $scope.timelineData;
                $scope.isFilterApplied = false;
                $scope.selectedApprover = null;
                $scope.startDate = null;
                $scope.endDate = null;

                $("#approverList").data("kendoDropDownList").select(-1);
                $("#startDatePicker").data("kendoDatePicker").value(null);
                $("#endDatePicker").data("kendoDatePicker").value(null);
                

            };
        }],
        link: function (scope, element, attrs) {
            
        }
    };
}