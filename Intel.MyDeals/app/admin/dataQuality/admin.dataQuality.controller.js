(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('DataQualityController', DataQualityController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    DataQualityController.$inject = ['dataQualityService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq']

    function DataQualityController(dataQualityService, $scope, logger, confirmationModal, gridConstants, $linq) {
        var vm = this;
        vm.validationMessage = "";
           //Added By Bhuvaneswari for US932213
        if (!window.isDeveloper && window.usrRole != 'SA') {
            document.location.href = "/Dashboard#/portal";
        }
        vm.dataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    dataQualityService.GetDataQualityUseCases()
                        .then(function (response) {
                            e.success(response.data);
                        }, function (response) {
                            logger.error("Unable to get Data Quality ", response, response.statusText);
                        });
                }
            },
            pageSize: 25
        });

        vm.gridOptions = {
            dataSource: vm.dataSource,
            filterable: true,
            scrollable: true,
            sortable: true,
            navigatable: true,
            resizable: true,
            reorderable: true,
            columnMenu: true,
            sort: function (e) { gridUtils.cancelChanges(e); },
            filter: function (e) { gridUtils.cancelChanges(e); },
            toolbar: gridUtils.inLineClearAllFiltersToolbar(),
            pageable: {
                refresh: true,
                pageSizes: gridConstants.pageSizes,
            },
            columns: [
                { field: "", title: "", width: "5%", template: "<div role='button' title='Run DQ' class='text-center' ng-click='vm.runDQ(dataItem.DQ_USE_CASE_CD)'><i class='fa fa-play'></i></div>" },
                { field: "DQ_USE_CASE_CD", title: "Use case", width: "20%" },
                { field: "DQ_USE_CASE_DSC", title: "Description" }
            ]
        };

        vm.runDQ = function (useCase) {
            logger.info("DQ Queued..");
            dataQualityService.RunDQ(useCase)
                .then(function (response) {
                    if (response.data) logger.success("DQ Run completed");
                }, function (response) {
                    logger.error("Unable to Run DQ ", response, response.statusText);
                });
        }
    }
})();