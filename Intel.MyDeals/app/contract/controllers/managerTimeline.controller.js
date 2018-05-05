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
                    url: "api/Timeline/GetObjTimelineDetails",
                    type: "POST",
                    data: {
                        objSid: $scope.root.contractData.DC_ID,
                        objTypeSid: 1,
                        objTypeIds: [1,2,3,4,5]
                    },
                    dataType: "json"
                }
            },
            schema: {
                parse: function (data) {
                    for (var d = 0; d < data.length; d++) {
                        data[d]["user"] = data[d]["FRST_NM"] + " " + data[d]["LST_NM"];
                        data[d]["ATRB_VAL"] = data[d]["ATRB_VAL"].replace(/; /g, '<br/>');
                    }
                    return data;
                },
                model: {
                    fields: {
                        user: { type: "string" }
                    }
                }
            },
            pageSize: 25,
            requestEnd: function (e) {
                $scope.msg = "Done";
                $scope.timelineData = e.response;
                $timeout(function () {
                    $scope.loading = false;
                    window.setTimeout(function () {
                        resizeGrid();
                    }, 100);
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
                width: "140px",
                filterable: { multi: true, search: true }
            }, {
                field: "OBJ_SID",
                title: "Object Id",
                width: "120px",
                filterable: { multi: true, search: true }
            }, {
                field: "ATRB_VAL",
                title: "Comment Detail",
                encoded: false
            }, {
                field: "user",
                title: "Changed By",
                template: "#= user # (#= USR_ROLES #)",
                width: "200px",
                filterable: { multi: true, search: true }
            }, {
                field: "HIST_EFF_FR_DTM",
                title: "Date Changed",
                width: "160px"
            }]

        }

        $scope.timelineDs.read();

        function resizeGrid() {
            $("#grid-timeline").css("height", $(window).height() - 250);
            $("#grid-timeline").data("kendoGrid").resize();
        }

        $timeout(function () {
            $("#approvalDiv").removeClass("active");
            $("#pctDiv").removeClass("active");
            $("#contractReviewDiv").removeClass("active");
            $("#dealReviewDiv").removeClass("active");
            $("#historyDiv").addClass("active");
            $("#overlapDiv").removeClass("active");
            $("#groupExclusionDiv").removeClass("active");
            $scope.$apply();
        }, 50);

    }
})();
