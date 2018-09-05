angular
    .module('app.contract')
    .controller('dealTimelineModalCtrl', dealTimelineModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

dealTimelineModalCtrl.$inject = ['$scope', '$uibModalInstance', 'dataItem', 'objsetService', 'dataService', 'logger', '$timeout'];

function dealTimelineModalCtrl($scope, $uibModalInstance, dataItem, objsetService, dataService, logger, $timeout) {

    $scope.dataItem = dataItem;
    $scope.loading = true;

    $scope.timelineDs = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: {
                url: "api/Timeline/GetObjTimelineDetails",
                type: "POST",
                data: {
                    objSid: $scope.dataItem.DC_ID,
                    objTypeSid: 5,
                    objTypeIds: [5]
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
                //window.setTimeout(function () {
                //    resizeGrid();
                //}, 100);
            }, 500);
        }
    });

    $scope.gridOptions = {
        dataSource: $scope.timelineDs,
        toolbar: [{ name: 'excel', text: '<div class="excelText"><span>Excel<br/>Export</span></div>' }],
        excel: {
            fileName: "Deal " + $scope.dataItem.DC_ID + " Timeline Export.xlsx",
            filterable: true
        },
        sortable: true,
        scrollable: true,
        resizable: true,
        columns: [{
            field: "ATRB_VAL",
            title: "Comment Detail",
            encoded: false
        }, {
            field: "user",
            title: "Changed By",
            template: "#= user # (#= USR_ROLES #) (#= CHG_EMP_WWID #)",
            width: "240px",
            filterable: { multi: true, search: true }
        }, {
            field: "HIST_EFF_FR_DTM",
            title: "Date Changed",
            width: "160px"
        }]
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

}