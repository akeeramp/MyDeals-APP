(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('EmployeeController', EmployeeController);

    EmployeeController.$inject = ['employeeService', '$scope', 'logger'];

    function EmployeeController(employeeService, $scope, logger) {

        // Functions
        $scope.roleTypeId = window.usrRoleId;
        $scope.isDeveloper = window.isDeveloper;
        $scope.isTester = window.isTester;
        $scope.isSuper = window.isSuper;
        $scope.isAdmin = window.isAdmin;
        $scope.isFinanceAdmin = window.isFinanceAdmin;

        $scope.save = function()
        {
            var data = {
                "roleTypeId": $scope.roleTypeId,
                "isDeveloper": $scope.isDeveloper? 1: 0,
                "isTester": $scope.isTester ? 1 : 0,
                "isSuper": $scope.isSuper ? 1 : 0,
                "isAdmin": $scope.isAdmin ? 1 : 0,
                "isFinanceAdmin": $scope.isFinanceAdmin ? 1 : 0
            }

            employeeService.setEmployees(data)
                .then(function (response) {
                    logger.success("Role was changed", "Done");
                    window.clearSessionData();
                    document.location.href = "/error/ResetAVM";
                }, function (response) {
                    logger.error("Unable to set User Roles.", response, response.statusText);
                });
        }

    }
})();