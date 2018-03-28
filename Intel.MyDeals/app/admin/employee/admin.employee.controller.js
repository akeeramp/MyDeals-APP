(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('EmployeeController', EmployeeController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    EmployeeController.$inject = ['employeeService', '$scope', 'logger'];

    function EmployeeController(employeeService, $scope, logger) {

        // Functions
        $scope.roleTypeId = window.usrRoleId;
        $scope.isDeveloper = window.isDeveloper;
        $scope.isTester = window.isTester;
        $scope.isSuper = window.isSuper;

        $scope.save = function()
        {
            var data = {
                "roleTypeId": $scope.roleTypeId,
                "isDeveloper": $scope.isDeveloper? 1: 0,
                "isTester": $scope.isTester ? 1 : 0,
                "isSuper": $scope.isSuper ? 1 : 0
            }

            employeeService.setEmployees(data)
                .then(function (response) {
                    logger.success("Role was changed", "Done");
                    window.clearSessionData('/error/ResetMyCache');
                    document.location.href = "/error/ResetMyCache";
                }, function (response) {
                    logger.error("Unable to set User Roles.", response, response.statusText);
                });
        }

    }
})();