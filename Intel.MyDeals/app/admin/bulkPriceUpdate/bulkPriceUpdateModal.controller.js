angular
    .module("app.admin")
    .controller("BulkPriceUpdateModelController", BulkPriceUpdateModelController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

BulkPriceUpdateModelController.$inject = ["$rootScope", "$location", "PrimeCustomersService", "$scope", "$stateParams", "logger", "$timeout", "gridConstants", "$uibModalInstance"];

function BulkPriceUpdateModelController($rootScope, $location, PrimeCustomersService, $scope, $stateParams, logger, $timeout, gridConstants, $uibModalInstance) {
    var vm = this;
    vm.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkPriceUpdate";

    vm.screenTitle = "Bulk Price Uploads - Deals";
    vm.spinnerMessageHeader = "Bulk Price Uploads Deals";
    vm.spinnerMessageDescription = "Please wait while bulk pricing deal data is imported..";

    vm.HasBulkUpdateAccess = ((window.usrRole == "SA" && !window.isCustomerAdmin) || window.isDeveloper);

    vm.isBusyShowFunFact = true;

    vm.SpreadSheetRowsCount = 0;
    vm.IsSpreadSheetEdited = true;
    var hasUnSavedFiles = false;
    var hasFiles = false;
    var uploadSuccessCount = 0;
    var uploadErrorCount = 0;
    vm.bulkProceUploadValidationSummary = [];
    vm.backendValidation = false;


    vm.fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractBulkPriceUpdateFile',
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".xlsx"]
        }
        , remove: function (e) {
            var fileInfo = $("#fileUploader").data("kendoUpload").getFiles();
            if (fileInfo.length > 0) {
                LocalDeletedFile = false;
            }
            else {
                LocalDeletedFile = true;
            }
        }
    };

    vm.onFileSelect = function (e) {
        // Hide default kendo upload and clear buttons as contract is not generated at this point. Upload files after contract id is generated.
        // TODO: Do we want to show them in edit scenario ?
        $(".k-upload-files.k-reset").show();
        $(".k-upload-files.k-reset").find("li").remove();
        $timeout(function () {
            $(".k-clear-selected").hide();
            $(".k-upload-selected").hide();
        });

        hasUnSavedFiles = true;
    }

    vm.filePostAddParams = function (e) { // Load 2
        uploadSuccessCount = 0;
        uploadErrorCount = 0;
        e.sender.options.async.saveUrl = '/FileAttachments/ExtractBulkPriceUpdateFile'
    };

    vm.onSuccess = function (e) {  // Load 4 (Post)
        if (e.response == undefined || e.response == null || e.response == "") {
            kendo.alert("Uploaded file not having any data");
            $(".k-upload-files.k-reset").find("li").remove();
            $(".k-upload-files.k-reset").hide();
            $(".k-upload-status.k-upload-status-total").hide();
            return;
        }
        uploadSuccessCount++;

        vm.bulkProceUploadValidationSummary = e.response;
        if (vm.bulkProceUploadValidationSummary.length == 0)
        {
            kendo.alert('There is no Bulk Pricing Upload Data in the file to load!');
        }
        else (vm.bulkProceUploadValidationSummary.length > 0)
        {
            $uibModalInstance.close(vm.bulkProceUploadValidationSummary);
        }
    }

    vm.onError = function (e) {
        uploadErrorCount++;
    }

    vm.onComplete = function (e) { // Load 3 (Post)
        if (uploadSuccessCount > 0) {
            logger.success("Successfully uploaded " + uploadSuccessCount + " attachment(s).", null, "Upload successful");
        }
        if (uploadErrorCount > 0) {
            logger.error("Unable to upload " + uploadErrorCount + " attachment(s).", null, "Upload failed");
        }
        $timeout(function () {
            $scope._dirty = false; // don't want to kick of listeners
        });
    }

    vm.uploadFile = function (e) { // Load 1
        vm.spinnerMessageDescription = "Please wait while the Deal data is loaded..";
        $(".k-upload-selected").click();
    }


    $scope.UnifiedDealValidation = function (isError, msg, isReq) {
        return {
            dataType: "custom",
            from: !isError,
            allowNulls: isReq,
            messageTemplate: msg
        };
    };

    vm.SpreadSheetOptions = {
        change: function (arg) {
            vm.IsSpreadSheetEdited = true;
        }
    };

      
    vm.CloseWindow = function () {
        $uibModalInstance.close();
    };

}
