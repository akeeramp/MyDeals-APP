(function () {
    'use strict';

    angular
        .module('blocks.confirmationModal')
        .service('confirmationModal', confirmationModal);

    confirmationModal.$inject = ['$uibModal'];

    function confirmationModal($uibModal) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/app/blocks/confirmationModal/confirmationModal.html'
        };

        var modalOptions = {
            closeButtonText: 'Cancel',
            actionButtonText: 'OK',
            hasActionButton: true,
            headerText: 'Proceed?',
            bodyText: 'Perform this action?',
            actionResults: null,
        	closeResults: null
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            // Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            // Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            // Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = modalController;

                // inject the dependency here
                modalController.$inject = ['$scope', '$uibModalInstance'];

                function modalController($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                    	if (result == null){ result = 'cancel' }
                    	$uibModalInstance.dismiss(result);
                    };
                };
            }

            return $uibModal.open(tempModalDefaults).result;
        };
    }
}());