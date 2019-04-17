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
                    var regex1 = /Quote letter generated/gi;
                    var regex2 = /Created Deals:/gi;
                    data[d]["ATRB_VAL"] = data[d]["ATRB_VAL"].replace(regex1, '');
                    data[d]["ATRB_VAL"] = data[d]["ATRB_VAL"].replace(regex2, 'Created Deal(s) for product:');
                    if (data[d]["ATRB_VAL"].toLowerCase() == "quote letter generated") {
                        delete data[d];
                    }
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

    //Export to Excel
    $scope.exportToExcelTimeline = function () {
        gridUtils.dsToExcelTimeLine($scope.gridOptions, $scope.gridOptions.dataSource, "Deal " + $scope.dataItem.DC_ID + " Timeline Export.xlsx", false);
    }

    $scope.changeSubString = function (dataItem) {
        var tempString = dataItem.ATRB_VAL;
        var regex1 = /Created Folio:/gi;
        var regex2 = /Created Deals:/gi;
        //tempString = tempString.replace(regex1, 'Created Folio for product(s):');
        tempString = tempString.replace(regex2, 'Created Deal(s) for product:');
        
        return tempString;
    }

    $scope.gridOptions = {
        dataSource: $scope.timelineDs,         
        sortable: true,
        scrollable: true,
        resizable: true,
        columns: [{
            field: "ATRB_VAL",
            template:"#=ATRB_VAL#",
            title: "Comment Detail",
            encoded: true
        }, {
            field: "user",
            title: "Changed By",
            template: "#= user # (#= USR_ROLES #) (#= CHG_EMP_WWID #)",
            width: "240px",
            filterable: { multi: true, search: true }
        }, {
            field: "HIST_EFF_FR_DTM",
            title: "Date Changed",
            width: "160px",
                template: "#=kendo.toString(new Date(HIST_EFF_FR_DTM), 'MM/dd/yyyy hh:mm tt')#"
        }]
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };

}