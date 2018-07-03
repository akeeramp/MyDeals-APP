(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('OpLogController', OpLogController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    // logger :Injected logger service to for logging to remote database or throwing error on the ui
    // dataService :Application level service, to be used for common api calls, eg: user token, department etc
    OpLogController.$inject = ['dataService', 'oplogService', 'logger'];

    function OpLogController(dataService, oplogService, logger) {

        // Declare public variables, function at top followed by private functions
        var vm = this;
        vm.title = "Opaque Log Watcher";
        vm.opLogData = [];
        vm.logDetails = '';
        var stDate = new Date();
        var enDate = new Date();
        enDate.setDate(enDate.getDate() - 30);
        vm.startDate = kendo.toString(kendo.parseDate(enDate), 'MM/dd/yyyy');
        vm.endDate = kendo.toString(kendo.parseDate(stDate), 'MM/dd/yyyy');

        vm.getDateFormat = function (timestamp) {
            return new Date(timestamp);
        }

        vm.getOpaqueLog = function (startDate, endDate) {
            var logDate = {
                'startDate': startDate,
                'endDate': endDate
            }
            oplogService.getOpaqueLog(logDate).then(
                function (response) {
                    vm.opLogData = response.data;
                    vm.logDetails = '';
                }, function (e) {
                    logger.error("Error in getting Opaque Log.", e, e.statusText)
                });
        }

        vm.getDetailsOpaqueLog = function (data) {
            vm.logDetails = '';            
            oplogService.getDetailsOpaqueLog(data.fileName.substring(0, data.fileName.length - 4)).then(
                function (response) {
					var entityMap = {
						"&": "&amp;",
						"<": "&lt;",
						">": "&gt;",
						'"': '&quot;',
						"'": '&#39;',
						"/": '&#x2F;'
					};
					response.data = String(response.data).replace(/[&<>"'\/]/g, function (s) {
						return entityMap[s];
					});
                    vm.logDetails = response.data;
                }, function (e) {
                    logger.error("Error in getting Opaque Log.", e, e.statusText)
                });
        }

        vm.getOpaqueLog(vm.startDate, vm.endDate);

        vm.refreshAllLog = function (mode) {
            var one_day = 1000 * 60 * 60 * 24;
            var dateDifference = new Date(vm.endDate) - new Date(vm.startDate);
            var noOfDays = dateDifference / one_day;
            if (noOfDays <= 30 && noOfDays > 0) {
                vm.opLogData = [];
                vm.getOpaqueLog(vm.startDate, vm.endDate);
            }
            else {
                kendo.alert('Please Check Dates. Log can be fetched for maximum 30 days...');
            }            
        }
    }
})();