(function () {
    'use strict';

    angular
        .module('app.contract')
        .controller('managerTimelineController', managerTimelineController)
        .run(SetRequestVerificationToken);


    SetRequestVerificationToken.$inject = ['$http'];

    managerTimelineController.$inject = ['$scope', '$timeout', '$window'];

    function managerTimelineController($scope, $timeout, $window) {

        kendo.culture("en-US");

        var root = $scope.$parent;	// Access to parent scope
        $scope.root = root;
        $scope.timelineData = [];
        $scope.loading = true;
        $scope.msg = "Loading Contract History";
        $scope.$parent.isSummaryHidden = false;


        $scope.timelineDs = new kendo.data.DataSource({
            type: "json",
            transport: {
                read: {
                    url: "api/Timeline/GetTimelineDetails/" + $scope.root.contractData.DC_ID + "/1",
                    type: "GET",
                    dataType: "json"
                }
            },
            requestEnd: function (e) {
                $scope.msg = "Done";
                $scope.timelineData = e.response;
                $timeout(function () {
                    $scope.loading = false;
                }, 500);
            }
        });

        $scope.gridOptions = {
            dataSource: $scope.timelineDs,
            sortable: true,
            resizable: true,
            pageable: true,
            filterable: true,
            scrollable: true,
            columns: [{
                field: "OBJ_DESC",
                title: "Object Type",
                width: "140px"
            }, {
                field: "OBJ_SID",
                title: "Object Id",
                width: "120px"
            }, {
                field: "FLAG",
                title: "Flag",
                width: "90px",
                filterable: { multi: true, search: true }
            }, {
                field: "ATRB_DESC",
                title: "Action Source",
                width: "140px",
                filterable: { multi: true, search: true }
            }, {
                field: "ATRB_VAL",
                title: "Action Value",
                width: "200px"
            }, {
                field: "FRST_NM",
                title: "Changed By",
                template: "#= FRST_NM # #= LST_NM #",
                width: "200px",
                filterable: { multi: true, search: true }
            }, {
                field: "HIST_EFF_FR_DTM",
                title: "Date Changed",
                width: "160px"
            }]

        }

        $scope.timelineDs.read();

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").addClass("active");
            $scope.$apply();
        }, 50);

    }
})();
