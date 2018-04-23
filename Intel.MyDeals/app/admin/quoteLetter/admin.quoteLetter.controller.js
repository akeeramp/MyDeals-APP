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

        $scope.init = function () {
            quoteLetterService.adminGetTemplates()
                .then(function (response) {
                    vm.menuItems = [];
                    for (var d = 0; d < response.data.length; d++) {
                        if (response.data[d]["OBJ_SET_TYPE_CD"] !== "KIT" || response.data[d]["PROGRAM_PAYMENT"] !== "FRONTEND") {
                            vm.menuItems.push(response.data[d]);
                        }
                    }

                    // For all menu items, set MenuText by concat OBJ_SET_TYPE_CD and PROGRAM_PAYMEN .
                    for (var i = 0; i < vm.menuItems.length; i++) {
                        vm.menuItems[i].MenuText = vm.menuItems[i].OBJ_SET_TYPE_CD + "-" + vm.menuItems[i].PROGRAM_PAYMENT;
                    }

                    vm.isDropdownsLoaded = true;
                }, function (response) {
                    logger.error("Unable to get template data.", response, response.statusText);
                });
        }

        $scope.onSaveChangesClick = function () {
            quoteLetterService.adminSaveTemplate(vm.selectedTemplate)
                .then(function (response) {
                    // Sync vm.menuItems w/ the changes that were just saved, then rebind the templates combobox.
                    for (var i = 0; i < vm.menuItems.length; i++) {
                        if (vm.menuItems[i].TMPLT_SID == vm.selectedTemplate.TMPLT_SID) {
                            vm.menuItems[i] = vm.selectedTemplate;
                        }
                    }
                    var combo = $("#templatesCombo").data("kendoDropDownList");
                    var selectedIndex = combo.select();
                    combo.dataSource.read();
                    combo.select(selectedIndex);

                    logger.success("Saved " + vm.menuItems[selectedIndex].MenuText + " content.");
                }, function (response) {
                    logger.error("Unable to save changes.", response, response.statusText);
                });
        };

        $scope.onGeneratePreviewClick = function () {
            quoteLetterService.adminPreviewQuoteLetterTemplate(vm.selectedTemplate)
                .then(function (response) {
                    var file = new Blob([response.data], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    // Work around to avoid being blocked by chrome pop up blocker indicating this is untrusted location - VN
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = fileURL;
                    a.download = "QuoteLetter_Preview.pdf";
                    a.click();
                    //window.open(fileURL, "Quote Letter Preview");
                    logger.success("Successfully generated quote letter preview.");
                }, function (response) {
                    logger.error("Unable to generate quote letter preview.", response, response.statusText);
                });
        };        

        $scope.init();
    }
})();