(function () {
    'use strict';
    angular
        .module('app.admin')
        .controller('QuoteLetterController', QuoteLetterController)
        .run(SetRequestVerificationToken);

    SetRequestVerificationToken.$inject = ['$http'];

    QuoteLetterController.$inject = ['quoteLetterService', '$scope', 'logger', 'confirmationModal', 'gridConstants', '$linq']

    function QuoteLetterController(quoteLetterService, $scope, logger, confirmationModal, gridConstants, $linq) {

        var vm = this;
        vm.isDropdownsLoaded = false;
        vm.selectedTemplate = null;

        function init() {
            quoteLetterService.adminGetTemplates()
                .then(function (response) {
                    vm.menuItems = response.data;

                    for (var i = 0; i < vm.menuItems.length; i++) {
                        vm.menuItems[i].MenuText = vm.menuItems[i].OBJ_SET_TYPE_CD + "-" + vm.menuItems[i].PROGRAM_PAYMENT;
                    }

                    vm.isDropdownsLoaded = true;
                }, function (response) {
                    logger.error("Unable to get template menu items.", response, response.statusText);
                });
        }

        vm.dropDownOptions = {
            placeholder: "select...",
            autoBind: false,
            dataTextField: "MenuText",
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: function (e) {
                        e.success(vm.menuItems);
                    }
                }
            }
        };

        $scope.onSaveChangesClick = function (index) {
            quoteLetterService.adminSaveTemplate(vm.selectedTemplate)
                .then(function (response) {
                }, function (response) {
                    logger.error("Unable to save changes.", response, response.statusText);
                });
        };

        init();
    }
})();