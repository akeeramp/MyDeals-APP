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
    vm.spinnerMessageDescription = "Please wait while bulk pricing deal date is imported..";

    vm.HasBulkUpdateAccess = ((window.usrRole == "SA" && !window.isCustomerAdmin) || window.isDeveloper);

    vm.isBusyShowFunFact = true;
    vm.validUnifyDeals = [];
    vm.inValidUnifyDeals = [];
    vm.duplicateGlobalIds = [];
    vm.duplicateGlobalNames = [];

    vm.SpreadSheetRowsCount = 0;
    vm.IsSpreadSheetEdited = true;
    var hasUnSavedFiles = false;
    var hasFiles = false;
    var uploadSuccessCount = 0;
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
            //alert("Populate sheet and close dialog down");
            //vm.ValidateBulkPriceUpdatesSheet();
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
        vm.spinnerMessageDescription = "Please wait while the Bulk Price Updates data is loaded..";
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


    //vm.sheets = [{ name: "Sheet1" }];
    //$scope.$on("kendoWidgetCreated", function (event, widget) {
    //    // the event is emitted for every widget; if we have multiple
    //    // widgets in this controller, we need to check that the event
    //    // is for the one we're interested in.
    //    if (widget === vm.spreadsheet) {
    //        var sheets = vm.spreadsheet.sheets();
    //        var index = 0;
    //        vm.spreadsheet.activeSheet(sheets[0]);
    //        var sheet = vm.spreadsheet.activeSheet();

    //        sheet.columnWidth(0, 70);
    //        sheet.columnWidth(1, 100);
    //        sheet.columnWidth(2, 150);
    //        sheet.columnWidth(3, 100);
    //        sheet.columnWidth(4, 150);
    //        sheet.columnWidth(5, 150);
    //        sheet.columnWidth(6, 120);
    //        sheet.columnWidth(7, 150);
    //        sheet.columnWidth(8, 120);
    //        sheet.columnWidth(9, 150);
    //        sheet.columnWidth(10, 260);
    //        index = 11;

    //        for (var i = index; i < 50; i++)
    //            sheet.hideColumn(i);

    //        vm.LoadDataToSpreadsheet();
    //        if (vm.backendValidation) {
    //            var sheet = vm.spreadsheet.activeSheet();
    //            sheet.range("A1:K" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
    //            sheet.range("A1:A" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(true, '', true));
    //            sheet.batch(function () {
    //                for (var i = 0; i < vm.bulkProceUploadValidationSummary.inValidRecords.length; i++) {
    //                    var lengthOfMsg = vm.bulkProceUploadValidationSummary.inValidRecords[i].ERR_MSG.length;
    //                    var height = 1;
    //                    if (Math.ceil(lengthOfMsg / 40) > 1)
    //                        height = height + Math.ceil(lengthOfMsg / 40) - 1;
    //                    var rowht = height > 1 ? height * 15 : 30;
    //                    sheet.rowHeight(i, rowht);
    //                    sheet.range("K" + (i + 1)).verticalAlign("top");
    //                }
    //            });
    //        }

    //        alert("kendoWidgetCreated");
    //        //vm.ValidateBulkPriceUpdatesSheet();
    //    }
    //});

    //vm.LoadDataToSpreadsheet = function () {
    //    $('.modal-dialog').css("width", "1530px");
    //    $('#spreadsheetBulkPriceUpdates').css("width", "1500px");
    //    $('#bulkPriceUpdateModalWindow').css("max-height", "500px");

    //    var sheet = vm.spreadsheet.activeSheet();
    //    sheet.range(kendo.spreadsheet.SHEETREF).clear();
    //    sheet.range("A1:J" + vm.SpreadSheetRowsCount).wrap(true);
    //    sheet.setDataSource(vm.bulkProceUploadValidationSummary, ["DealId", "DealDesc", "EcapPrice", "Volume", "DealStartDate", "DealEndDate", "BillingsStartDate", "BillingsEndDate", "ProjectName", "AdditionalTermsAndConditions"]);
    //    //Auto header will be created as 1st row. This is not actual data
    //    sheet.deleteRow(0);
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal ID");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[2]).find("div").html("Deal Description");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[4]).find("div").html("ECAP Price");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[6]).find("div").html("Ceiling Volume");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[8]).find("div").html("Deal Start Date");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[10]).find("div").html("Deal End Date");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[12]).find("div").html("Billings Start Date");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[14]).find("div").html("Billings End Date");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[16]).find("div").html("Project Name");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[18]).find("div").html("Additional Terms");
    //    $($("#spreadsheetBulkPriceUpdates .k-spreadsheet-column-header").find("div")[20]).find("div").html("Error Messages");

    //    sheet._rows._count = vm.bulkProceUploadValidationSummary.inValidRecords.length;
    //}

    vm.CloseWindow = function () {
        $uibModalInstance.close();
    };

}
