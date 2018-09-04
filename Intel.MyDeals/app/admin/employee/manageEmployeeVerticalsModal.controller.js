angular
    .module('app.admin')
    .controller('manageEmployeeVerticalsModalCtrl', manageEmployeeVerticalsModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

manageEmployeeVerticalsModalCtrl.$inject = ['productService', 'manageEmployeeService', '$scope', '$uibModalInstance', 'dataItem', 'logger'];

function manageEmployeeVerticalsModalCtrl(productService, manageEmployeeService, $scope, $uibModalInstance, dataItem, logger) {

    $scope.LST_NM = dataItem.LST_NM;
    $scope.FRST_NM = dataItem.FRST_NM;

    $scope.vertdataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: function (e) {
                productService.getProductCategoriesWithAll()
                    .then(function (response) {
                        $scope.selectedIds = [];
                        var selectedVerticals = dataItem["USR_VERTS"].replace(/, /g, ",").split(",");
                        for (var c = 0; c < response.data.length; c++) {
                            if (selectedVerticals.indexOf(response.data[c].PRD_CAT_NM) >= 0) {
                                $scope.selectedIds.push(response.data[c]);
                            }
                        }
                        e.success(response.data);
                    }, function (response) {
                        logger.error("Unable to get Product Verticals Data.", response, response.statusText);
                    });
            },
        },
    });

    $scope.selectOptions = {
        change: function () {
            $scope.$apply(function () {
                if ($scope.selectedIds.length > 0) { // Safety check for empty list
                    var lastSelected = $scope.selectedIds[$scope.selectedIds.length - 1];
                    if (lastSelected.PRD_CAT_NM === 'All Products') // If they just selected All Custs, clear out their list and leave only this one.
                    {
                        $scope.selectedIds = [];
                        $scope.selectedIds.push(lastSelected);
                    }
                    else if ($scope.selectedIds[0].PRD_CAT_NM === 'All Products') {
                        $scope.selectedIds = [];
                        $scope.selectedIds.push(lastSelected);
                    }
                }
            });
        },
        placeholder: "Select product catagories...",
        dataTextField: "PRD_CAT_NM",
        dataValueField: "PRD_MBR_SID",
        valuePrimitive: false, // false makes us go to object, not ID only
        autoClose: false,
        dataSource: $scope.vertdataSource
    };

    $scope.ok = function () {
        // Save the selected verticals list here.
        var saveIds = [];
        var saveNames = [];

        for (var i = 0; i < $scope.selectedIds.length ; i++) {
            saveIds.push($scope.selectedIds[i].PRD_MBR_SID);
            saveNames.push($scope.selectedIds[i].PRD_CAT_NM);
        }

        var data = {
            "empWWID": dataItem["EMP_WWID"],
            "custIds": [],
            "vertIds": saveIds
        }

        manageEmployeeService.setEmployeeVerticalData(data)
                .then(function (response) {
                    if (saveNames.length === 0) {
                        saveNames.push("[Please Add Products]");
                    }
                    $uibModalInstance.close(saveNames.sort().join(", ")); // Post back the results to parent screen.

                    logger.success("User's Verticals list was saved", "Done");
                    kendo.alert("<i class='fa fa-check' aria-hidden='true' style='margin-right: 10px;'></i> Your changes have been saved<div style='margin-top: 15px;'>Please ensure you notify the user you made changes.</div>");
                }, function (response) {
                    logger.error("Unable to save this User's Verticals Data.", response, response.statusText);
                });
    };

    $scope.clear = function () {
        $scope.selectedIds = [];
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

}