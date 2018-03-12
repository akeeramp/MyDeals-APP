angular
    .module('app.admin')
    .controller('manageEmployeeModalCtrl', manageEmployeeModalCtrl)
    .run(SetRequestVerificationToken);


SetRequestVerificationToken.$inject = ['$http'];

manageEmployeeModalCtrl.$inject = ['manageEmployeeService', '$scope', '$uibModalInstance', 'dataItem', 'logger'];

function manageEmployeeModalCtrl(manageEmployeeService, $scope, $uibModalInstance, dataItem, logger) {

    $scope.custdataSource = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: function (e) {
                manageEmployeeService.getCustomers()
                    .then(function (response) {
                        $scope.selectedIds = [];
                        var selectedCustomers = dataItem["USR_CUST"].replace(/, /g, ",").split(",");
                        for (var c = 0; c < response.data.length; c++)
                        {
                            if (selectedCustomers.indexOf(response.data[c].CUST_NM) >= 0)
                            {
                                $scope.selectedIds.push(response.data[c]);
                            }
                        }
                        e.success(response.data);
                    }, function (response) {
                        logger.error("Unable to get Customers Data.", response, response.statusText);
                    });
            },
        },
    });

    $scope.selectOptions = {
        placeholder: "Select customers...",
        dataTextField: "CUST_NM",
        dataValueField: "CUST_NM_SID",
        valuePrimitive: false, // false makes us go to object, not ID only
        autoClose: false,
        dataSource: $scope.custdataSource
    };
    $scope.selectedIds = [];


    $scope.ok = function () {
        // Save the selected customers list here.
        var saveIds = [];
        var saveNames = [];

        for (var i = 0; i < $scope.selectedIds.length ; i++)
        {
            saveIds.push($scope.selectedIds[i].CUST_NM_SID);
            saveNames.push($scope.selectedIds[i].CUST_NM);
        }

        var data = {
            "empWWID": dataItem["EMP_WWID"],
            "custIds": saveIds
        }

        manageEmployeeService.setEmployeeData(data)
                .then(function (response) {
                    if (saveNames.length === 0) {
                        saveNames.push("[Please Add Customers]");
                    }
                    $uibModalInstance.close(saveNames.sort().join(", ")); // Pose back the results to parent screen.

                    logger.success("User's Customers list was saved", "Done");
                }, function (response) {
                    logger.error("Unable to save this User's Customer Data.", response, response.statusText);
                });
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

}