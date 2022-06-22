angular
    .module("app.admin")
    .controller("BulkUnifyModelController", BulkUnifyModelController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

BulkUnifyModelController.$inject = ["$rootScope", "$location", "PrimeCustomersService", "$scope", "$stateParams", "logger", "$timeout", "gridConstants", "$uibModalInstance"];

function BulkUnifyModelController($rootScope, $location, PrimeCustomersService, $scope, $stateParams, logger, $timeout, gridConstants, $uibModalInstance) {
    var vm = this;
    vm.isBulkUnify = true;
    vm.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
    //vm.isUpdateAllDeals = !vm.isBulkUnify;
    vm.screenTitle = "Bulk Unify - Deals";
    vm.spinnerMessageHeader = "Bulk Upload Unify Deals";
    vm.spinnerMessageDescription = "Please wait while we importing unification deal data..";
    vm.isBusyShowFunFact = true;
    vm.validUnifyDeals = [];
    vm.inValidUnifyDeals = [];
    vm.duplicateGlobalIds = [];
    vm.duplicateGlobalNames = [];
    
    vm.SpreadSheetRowsCount = 0;
    vm.HasBulkUploadAccess = ((window.usrRole == "SA" && !window.isCustomerAdmin) || window.isDeveloper);
    vm.IsSpreadSheetEdited = true;
    var hasUnSavedFiles = false;
    var hasFiles = false;
    var uploadSuccessCount = 0;
    var uploadErrorCount = 0;
    vm.dealReconValidationSummary = [];
    vm.backendValidation = false;
    
    vm.toggleType = function (e) {
        if (e) {
            vm.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
            vm.screenTitle = "Bulk Unify - Deals";
        }
        else {
            vm.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/DealRecon";
            vm.screenTitle = "Deal Reconciliation";
        }
    }
    vm.fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractBulkUnifyFile',
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

    vm.filePostAddParams = function (e) {
        uploadSuccessCount = 0;
        uploadErrorCount = 0;
        if (vm.isBulkUnify)
            e.sender.options.async.saveUrl = '/FileAttachments/ExtractBulkUnifyFile'
        else {
            e.sender.options.async.saveUrl = '/FileAttachments/ExtractDealReconFile'
        }
    };

    vm.onSuccess = function (e) {
        if (e.response == undefined || e.response == null || e.response == "") {
            kendo.alert("Uploaded file not having any data");
            $(".k-upload-files.k-reset").find("li").remove();
            $(".k-upload-files.k-reset").hide();
            $(".k-upload-status.k-upload-status-total").hide();
            return;
        }
        uploadSuccessCount++;
        if (vm.isBulkUnify) {
            vm.UnifyValidation = e.response;
            vm.validUnifyDeals = e.response.ValidUnifyDeals;
            vm.inValidUnifyDeals = e.response.InValidUnifyDeals;
            vm.duplicateGlobalIds = e.response.DuplicateGlobalIds;
            vm.duplicateGlobalNames = e.response.DuplicateGlobalNames;
            if (vm.validUnifyDeals.length == 0 && vm.inValidUnifyDeals.length == 0)
                kendo.alert('There is no Unify Data in the file to upload!');
            else if (vm.inValidUnifyDeals.length == 0 && vm.validUnifyDeals.length > 0) {
                PrimeCustomersService.updateBulkUnifyDeals(vm.validUnifyDeals).then(function (response) {
                    var data = response.data;
                    if (data != null && data != undefined) {
                        var warningmsg = " deal(s) got Unified. Please make ensure all other deals associated to the same pricing table having same End customer Combination"
                        var ecapdealdata = data.filter(x => x.COMMENTS == "ECAP Hybrid Deal(s)");
                        if (ecapdealdata != undefined && ecapdealdata.length > 0) {
                            kendo.alert("Following ECAP hybrid " + ecapdealdata[0].Deal_No + warningmsg);
                        }
                        var hybDealdata = data.filter(x => x.COMMENTS == "Voltier Hybrid Deal(s)");
                        if (hybDealdata != undefined && hybDealdata.length > 0) {
                            kendo.alert("Following Vol_Tier hybrid " + hybDealdata[0].Deal_No + warningmsg);
                        }
                        var dealsHasErrors = data.filter(x => x.COMMENTS == "Deal(s) Cannot be Unified");
                        if (data[0].COMMENTS == "Bulk Unified Deal(s)" && dealsHasErrors != undefined && dealsHasErrors.length == 0) {
                            if (data[0].COMMENTS == "Bulk Unified Deal(s)") {
                                var alertMsg = "<b>" + data[0].No_Of_Deals + " Deal(s) are successfully unified</b><br/>"
                            }
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].COMMENTS == "Deal(s) unified with already mapped RPL Status code") {
                                    alertMsg += "<br/><li><span>" + data[i].No_Of_Deals + " " + data[i].COMMENTS + " : " + data[i].Deal_No + "</span></li>";
                                }
                            }
                            kendo.alert(alertMsg);
                        }
                        else {
                            var failedDealsCount = 0;
                            if (data[0].COMMENTS == "Deal(s) Cannot be Unified") {
                                failedDealsCount = data[0].No_Of_Deals;
                            }
                            else if (data[1].COMMENTS == "Deal(s) Cannot be Unified") {
                                failedDealsCount = data[1].No_Of_Deals;
                            }
                            var msg = "<b>" + failedDealsCount + " deal(s) cannot be to unified</b>.<br/><br/>Following are the validation messages<br/><ul>";
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].COMMENTS != "Bulk Unified Deal(s)" && data[i].COMMENTS != "ECAP Hybrid Deal(s)" && data[i].COMMENTS != "Voltier Hybrid Deal(s)")
                                    msg += "<br/><li><div style='word-wrap: break-word;'>" + data[i].COMMENTS + " : " + data[i].Deal_No + "</div></li>";
                                else if (data[i].COMMENTS == "Bulk Unified Deal(s)") {
                                    msg = "<b>Successfully Unified " + data[i].No_Of_Deals + " deal(s)</b><br/><br/>" + msg;
                                }
                            }
                            msg += "</ul>"
                            kendo.alert(msg);
                        }
                    }
                    vm.validUnifyDeals = [];
                    vm.inValidUnifyDeals = [];
                    vm.CloseWindow();
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
            else {
                vm.SpreadSheetRowsCount = vm.inValidUnifyDeals.length + vm.validUnifyDeals.length + 1;//With header
            }
        }
        else {
            vm.dealReconValidationSummary = e.response;
            if (vm.dealReconValidationSummary.validRecords.length == 0 && vm.dealReconValidationSummary.inValidRecords.length == 0)
                kendo.alert('There is no Deal Recon Data in the file to upload!');
            else if (vm.dealReconValidationSummary.validRecords.length > 0 && vm.dealReconValidationSummary.inValidRecords.length == 0)
                vm.ValidateDealReconSheet();            
            else {
                vm.SpreadSheetRowsCount = vm.dealReconValidationSummary.validRecords.length + vm.dealReconValidationSummary.inValidRecords.length + 1;//With header
            }
        }
    }

    vm.onError = function (e) {
        uploadErrorCount++;
    }

    vm.onComplete = function (e) {
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

    vm.uploadFile = function (e) {
        vm.spinnerMessageDescription = "Please wait while uploading Unification data..";
        $(".k-upload-selected").click();
    }

    vm.ValidateUnifyDeals = function () {
        if (vm.isBulkUnify) {
            vm.generateUnifyDeals();
            if (vm.validUnifyDeals.length > 0)
                vm.inValidUnifyDeals = $.merge(vm.inValidUnifyDeals, vm.validUnifyDeals);
            if (vm.inValidUnifyDeals.length > 0) {
                vm.spinnerMessageDescription = "Please wait while validating deal unification data..";
                PrimeCustomersService.ValidateUnifyDeals(vm.inValidUnifyDeals).then(function (e) {
                    vm.UnifyValidation = e.data;
                    vm.validUnifyDeals = e.data.ValidUnifyDeals;
                    vm.inValidUnifyDeals = e.data.InValidUnifyDeals;
                    vm.duplicateGlobalIds = e.data.DuplicateGlobalIds;
                    vm.duplicateGlobalNames = e.data.DuplicateGlobalNames;
                    vm.SpreadSheetRowsCount = vm.inValidUnifyDeals.length + vm.validUnifyDeals.length + 1;
                    vm.ValidateSheet();
                }, function (response) {
                    logger.error("Operation failed");
                });
            } else
                kendo.alert("There is no data to validate");
        }
        else {
            vm.generateDealReconRecords();
            if (vm.dealReconValidationSummary.validRecords.length > 0)
                vm.dealReconValidationSummary.inValidRecords = $.merge(vm.dealReconValidationSummary.inValidRecords, vm.dealReconValidationSummary.validRecords);
            if (vm.dealReconValidationSummary.inValidRecords.length > 0) {
                vm.spinnerMessageDescription = "Please wait while validating deal unification data..";
                PrimeCustomersService.ValidateDealReconRecords(vm.dealReconValidationSummary.inValidRecords).then(function (e) {
                    vm.dealReconValidationSummary = e.data;
                    vm.SpreadSheetRowsCount = vm.dealReconValidationSummary.inValidRecords.length + vm.dealReconValidationSummary.validRecords.length + 1;
                    vm.ValidateDealReconSheet();
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
            else {
                kendo.alert("There is no data to validate");
            }
        }
    };

    $scope.UnifiedDealValidation = function (isError, msg, isReq) {
        return {
            dataType: "custom",
            from: !isError,
            allowNulls: isReq,
            messageTemplate: msg
        };
    };

    vm.ValidateSheet = function (action) {
        if (vm.UnifyValidation != null) {
            var sheet = vm.spreadsheet.activeSheet();
            sheet.range("A1:H" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
            vm.LoadDataToSpreadsheet();
            var strAlertMessage = "";
            var isInvalidGlobalName = false;
            var isGlobalContainsAny = false;
            var isGlobalContainsNull = false;
            var isEmptyDealEndCustomerCountry = false;
            var isEmptyDealEndCustomerRetail = false;
            var isSameGlobalandCtryId = false;
            var isCtrySame = false;
            var mandatory = [];
            var invalidRPLStatusCode = [];
            sheet.batch(function () {
                for (var i = 0; i < vm.inValidUnifyDeals.length; i++) {
                    row = i + 1;
                    var rowMsg = "";                    
                    mandatory = [];
                    if (vm.UnifyValidation.IsEmptyDealAvailable) {
                        if (vm.inValidUnifyDeals[i].DEAL_ID == "0") {
                            mandatory.push("Deal ID");
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCustIdAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_ID == "0") {
                            mandatory.push("Unified Customer ID");
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCustNameAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME == null || vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME == "") {
                            mandatory.push("Unified Customer Name");
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCountryIdAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID == "0") {
                            mandatory.push("Country/Region Customer ID");
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCountryAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_COUNTRY == null || vm.inValidUnifyDeals[i].UCD_COUNTRY == "") {
                            mandatory.push("Unified Country/Region");
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }
                    if (vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == undefined || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == null
                        || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == '') {
                        isEmptyDealEndCustomerRetail = true;
                        mandatory.push("End Customer Retail");
                        sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }
                    if (vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == undefined || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == null
                        || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == '') {
                        isEmptyDealEndCustomerCountry = true;
                        mandatory.push("End Customer Country/Region");
                        sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }
                    if (mandatory.length > 0) {
                        rowMsg = rowMsg + mandatory.join(", ") + " is a mandatory field|";
                    }
                    var validRows = vm.inValidUnifyDeals.filter(x => x.DEAL_ID != 0 && x.UCD_GLOBAL_ID != 0 && x.UCD_GLOBAL_NAME != "" && x.UCD_COUNTRY_CUST_ID != 0 && x.UCD_COUNTRY != "");
                    
                    if (vm.UnifyValidation.DuplicateDealCombination.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.DuplicateDealCombination) != -1
                            && validRows.filter(x => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.UCD_GLOBAL_ID == vm.inValidUnifyDeals[i].UCD_GLOBAL_ID && x.UCD_GLOBAL_NAME == vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME
                                && x.UCD_COUNTRY_CUST_ID == vm.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID && x.UCD_COUNTRY == vm.inValidUnifyDeals[i].UCD_COUNTRY).length > 1) {
                            rowMsg = rowMsg + "Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region|";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    if (vm.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.DuplicateDealEntryCombination) != -1
                            && validRows.filter(x => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL &&
                                x.DEAL_END_CUSTOMER_COUNTRY == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY).length > 1) {
                            rowMsg = rowMsg + "Duplicate rows found with same combinations for Deal ID, End Customer Retail and End Customer Country/Region|";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }                    
                    if (vm.inValidUnifyDeals[i].UCD_GLOBAL_ID != 0 && vm.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID != 0 && vm.inValidUnifyDeals[i].UCD_GLOBAL_ID == vm.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID) {
                        rowMsg = rowMsg + "Unified Customer ID and Country/Region Customer ID cannot be same|";
                        isSameGlobalandCtryId = true;
                        sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }
                    if (vm.UnifyValidation.InValidCountries.length > 0) {
                        if (jQuery.inArray(jQuery.trim(vm.inValidUnifyDeals[i].UCD_COUNTRY).toLowerCase(), vm.UnifyValidation.InValidCountries) != -1) {
                            rowMsg = rowMsg + "Unified Country/Region does not exist in My Deals|";
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }

                    if (vm.inValidUnifyDeals[i].UCD_COUNTRY != "" && vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY != "" &&
                        vm.inValidUnifyDeals[i].UCD_COUNTRY.toLowerCase() != vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY.toLowerCase()) {
                        rowMsg = rowMsg + "Unified Country/Region and End Customer Country/Region needs to be same|";
                        isCtrySame = true;
                        sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }

                    if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME != null && vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME != "") {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "any") {
                            isGlobalContainsAny = true;
                            rowMsg = rowMsg + "'ANY' cannot be used as Unified Customer Name|";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "null") {
                            isGlobalContainsNull = true;
                            rowMsg = rowMsg + "NULL cannot be used as Unified Customer Name|";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        var patt = new RegExp("^[\\w\\s.,:'\&+-]*$");
                        var res = patt.test(vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME);
                        if (!res || vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.length > 65) {
                            isInvalidGlobalName = true;
                            rowMsg = rowMsg + "Unified Customer Name either contains more than 65 characters or invalid characters|";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }

                    if (vm.duplicateGlobalIds.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].UCD_GLOBAL_ID, vm.duplicateGlobalIds) != -1) {
                            rowMsg = rowMsg + "Same Unified Customer ID cannot be associated with multiple Unified Customer Names|";
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }

                    if (vm.duplicateGlobalNames.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME, vm.duplicateGlobalNames) != -1) {
                            rowMsg = rowMsg + "Same Unified Customer Name cannot be associated with multiple Unified Customer IDs|";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }

                    if (vm.UnifyValidation.AlreadyUnifiedDeals.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.AlreadyUnifiedDeals) != -1) {
                            rowMsg = rowMsg + "Deal is already Unified|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }

                    if (vm.UnifyValidation.UnifiedCombination.length > 0) {
                        var index = vm.UnifyValidation.UnifiedCombination.findIndex((x) => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                            && x.DEAL_END_CUSTOMER_COUNTRY == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                        if (index > -1) {
                            rowMsg = rowMsg + "End Customer Retail and End Customer Country/Region combination for this deal has already been unified|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }

                    if (vm.UnifyValidation.InvalidDeals.length > 0) {
                        if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "count mismatch").length > 0) {
                            rowMsg = rowMsg + "End Customer - Country/Region combination is not a user entered value in the Deal|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        else if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "not exist").length > 0) {
                            rowMsg = rowMsg + "Deal ID does not exists in MyDeals|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        else if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "cancelled").length > 0) {
                            rowMsg = rowMsg + "Deal is in Cancelled Stage and cannot be unified|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        else if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "lost").length > 0) {
                            rowMsg = rowMsg + "Deal is in Lost Stage and cannot be unified|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        else if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "deal expired").length > 0) {
                            rowMsg = rowMsg + "Deal is in Expired Stage and cannot be unified|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        else if (vm.UnifyValidation.InvalidDeals.filter(x => x.Key == vm.inValidUnifyDeals[i].DEAL_ID && x.Value == "end cust obj not exists").length > 0) {
                            rowMsg = rowMsg + "Deal is not having all end customer related information|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }

                    if (vm.UnifyValidation.InValidCombination.length > 0) {
                        var index = vm.UnifyValidation.InValidCombination.findIndex((x) => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                            && x.DEAL_END_CUSTOMER_COUNTRY == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                        if (index > -1) {
                            rowMsg = rowMsg + "Incorrect values of End Customer Retail and End Customer Country/Region associated with the Deal ID|"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    var RPLStsCodepattern = new RegExp("^[A-Za-z\\s,]*$");
                    var isValidRPLSTSCode = RPLStsCodepattern.test(vm.inValidUnifyDeals[i].RPL_STS_CODE);
                    if (!isValidRPLSTSCode) {
                        invalidRPLStatusCode.push(vm.inValidUnifyDeals[i].DEAL_ID)
                        rowMsg = rowMsg + "The RPL Status code contains invalid characters. Please remove spaces and special characters.|";
                        sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }
                    else if (vm.UnifyValidation.InvalidRPLStsCode.length > 0) {
                        if ((vm.UnifyValidation.InvalidRPLStsCode.filter(x => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID).length > 0) && vm.inValidUnifyDeals[i].RPL_STS_CODE != "") {
                            rowMsg = rowMsg + "Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code.|"
                            sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                    }
                    if (rowMsg != '') {
                        var rowMsg = rowMsg.slice(0, -1);
                        var arr = rowMsg.split('|');
                        var height = arr.length + 1;
                        var index = 1;
                        var msg = "";
                        angular.forEach(arr, function (row) {
                            msg = msg + (index++) + ". " + row + "\n";
                            if (Math.ceil(row.length / 40) > 1)
                                height = height + Math.ceil(row.length / 40) -1;
                        });
                        var rowht = height > 1 ? height * 15 : 30;
                        sheet.rowHeight(i, rowht);
                        sheet.range("I" + row).value(msg);
                        sheet.range("I" + row).verticalAlign("top");
                    }
                }
            });
            mandatory = [];
            if (vm.UnifyValidation.IsEmptyDealAvailable) {
                mandatory.push("Deal ID");
            }
            if (vm.UnifyValidation.IsEmptyCustIdAvailable) {
                mandatory.push("Unified Customer ID");
            }
            if (vm.UnifyValidation.IsEmptyCustNameAvailable) {
                mandatory.push("Unified Customer Name");
            }
            if (vm.UnifyValidation.IsEmptyCountryIdAvailable) {
                mandatory.push("Country/Region Customer ID");
            }
            if (vm.UnifyValidation.IsEmptyCountryAvailable) {
                mandatory.push("Unified Country/Region");
            }
            if (isEmptyDealEndCustomerRetail) {
                mandatory.push("End Customer Retail");
            }
            if (isEmptyDealEndCustomerCountry) {
                mandatory.push("End Customer Country/Region");
            }
            if (mandatory.length > 0) {
                strAlertMessage += "<li>" + mandatory.join(", ") + " is a mandatory field</li>"
            }
            if (vm.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                strAlertMessage += "<li>Duplicate rows found with same combinations for Deal ID, End Customer Retail and End Customer Country/Region.</li>";
            }
            if (vm.UnifyValidation.DuplicateDealCombination.length > 0) {
                strAlertMessage += "<li>Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region.</li>";
            }            
            if (isSameGlobalandCtryId) {
                strAlertMessage += "<li>Unified Customer ID and Country/Region Customer ID cannot be same.</li>"
            }
            if (vm.UnifyValidation.InValidCountries.length > 0) {
                strAlertMessage += "<li>Unified Country/Region does not exist in My Deals.</li>"
            }
            if (invalidRPLStatusCode.length>0) {
                strAlertMessage += "<li>The RPL Status code contains invalid characters. Please remove spaces and special characters.</li>"
            }
            if (vm.UnifyValidation.InvalidRPLStsCode.length > 0) {
                strAlertMessage += "<li>Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code.</li>"
            }
            if (isCtrySame) {
                strAlertMessage += "<li>Unified Country/Region and End Customer Country/Region needs to be same.</li>"
            }
            if (isInvalidGlobalName) {
                strAlertMessage += "<li>Unified Customer Name either contains more than 65 characters or invalid characters.</li>";
            }
            if (vm.duplicateGlobalIds.length > 0) {
                strAlertMessage += "<li>Same Unified Customer ID cannot be associated with multiple Unified Customer Names.</li>";
            }
            if (vm.duplicateGlobalNames.length > 0) {
                strAlertMessage += "<li>Same Unified Customer Name cannot be associated with multiple Unified Customer IDs.</li>";
            }
            if (isGlobalContainsAny) {
                strAlertMessage += "<li>'ANY' cannot be used as Unified Customer Name.</li>"
            }
            if (isGlobalContainsNull) {
                strAlertMessage += "<li>NULL cannot be used as Unified Customer Name.</li>"
            }
            if (vm.UnifyValidation.InValidCombination.length > 0) {
                strAlertMessage += "<li>Incorrect values of End Customer Retail and End Customer Country/Region associated with the Deal ID.</li>"
            }
            if (vm.UnifyValidation.InvalidDeals.length > 0) {
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "count mismatch").length > 0) {
                    strAlertMessage += "<li>End Customer - Country/Region combination is not a user entered value in the Deal.</li>"
                }
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "not exist").length > 0) {
                    strAlertMessage += "<li>Deal ID does not exist in My Deals.</li>";
                }
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "cancelled").length > 0) {
                    strAlertMessage += "<li>Deal is in Cancelled Stage and cannot be unified.</li>";
                }
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "lost").length > 0) {
                    strAlertMessage += "<li>Deal is in Lost stage and cannot be unified.</li>";                    
                }
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "deal expired").length > 0) {
                    strAlertMessage += "<li>Deal is in Expired Stage and cannot be unified.</li>";
                }
                if (vm.UnifyValidation.InvalidDeals.filter(x => x.Value == "end cust obj not exists").length > 0) {
                    strAlertMessage += "<li>Deal is not having all end customer related information.</li>";
                }
            }
            if (vm.UnifyValidation.AlreadyUnifiedDeals.length > 0) {
                strAlertMessage += "<li>Deal is already Unified.</li>"
            }
            if (vm.UnifyValidation.UnifiedCombination.length > 0) {
                strAlertMessage += "<li>End Customer Retail and End Customer Country/Region combination have already been unified.</li>"
            }
            if (strAlertMessage != "") {
                strAlertMessage = "<b>The highlighted row(s) in the excel have not been updated in the MyDeals because of the following error(s).</b></br>" + strAlertMessage;
                kendo.alert(jQuery.trim(strAlertMessage));

            } else {
                PrimeCustomersService.updateBulkUnifyDeals(vm.validUnifyDeals).then(function (response) {
                    var data = response.data;
                    if (data != null && data != undefined) {
                        var warningmsg =" deal(s) got Unified. Please make ensure all other deals associated to the same pricing table having same End customer Combination"
                        var ecapdealdata = data.filter(x => x.COMMENTS == "ECAP Hybrid Deal(s)");
                        if (ecapdealdata != undefined && ecapdealdata.length > 0) {
                            kendo.alert("Following ECAP hybrid " + ecapdealdata[0].Deal_No + warningmsg);
                        }
                        var hybDealdata = data.filter(x => x.COMMENTS == "Voltier Hybrid Deal(s)");
                        if (hybDealdata != undefined && hybDealdata.length > 0) {
                            kendo.alert("Following Vol_Tier hybrid " + hybDealdata[0].Deal_No + warningmsg);
                        }
                        var dealsHasErrors = data.filter(x => x.COMMENTS == "Deal(s) Cannot be Unified");
                   
                        if (data[0].COMMENTS == "Bulk Unified Deal(s)"  && dealsHasErrors != undefined && dealsHasErrors.length == 0) {
                            if (data[0].COMMENTS == "Bulk Unified Deal(s)") {
                                var alertMsg = "<b>" + data[0].No_Of_Deals + " Deal(s) are successfully unified</b><br/>"
                            }
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].COMMENTS == "Deal(s) unified with already mapped RPL Status code") {
                                    alertMsg += "<br/><li><span>" + data[i].No_Of_Deals + " " + data[i].COMMENTS + " : " + data[i].Deal_No + "</span></li>";
                                }
                            }
                            kendo.alert(alertMsg);
                        }

                        else {
                            var failedDealsCount = 0;
                            if (data[0].COMMENTS == "Deal(s) Cannot be Unified") {
                                failedDealsCount = data[0].No_Of_Deals;
                            }
                            else if (data[1].COMMENTS == "Deal(s) Cannot be Unified") {
                                failedDealsCount = data[1].No_Of_Deals;
                            }
                            var msg = "<b>" + failedDealsCount + " deal(s) cannot be to unified</b>.<br/><br/>Following are the validation messages<br/><ul>";
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].COMMENTS != "Bulk Unified Deal(s)" && data[i].COMMENTS != "ECAP Hybrid Deal(s)" && data[i].COMMENTS != "Voltier Hybrid Deal(s)")
                                    msg += "<br/><li><div style='word-wrap: break-word;'>" + data[i].COMMENTS + " : " + data[i].Deal_No + "</div></li>";
                                else if (data[i].COMMENTS == "Bulk Unified Deal(s)"){
                                    msg = "<b>Successfully Unified " + data[i].No_Of_Deals + " deal(s)</b><br/><br/>" + msg;
                                }
                            }
                            msg += "</ul>";
                            kendo.alert(msg);
                        }
                    }
                    vm.validUnifyDeals = [];
                    vm.inValidUnifyDeals = [];
                    vm.CloseWindow();
                }, function (response) {
                    logger.error("Operation failed");
                });
            }
        }
        vm.IsSpreadSheetEdited = false;
    }

    vm.SpreadSheetOptions = {
        change: function (arg) {
            vm.IsSpreadSheetEdited = true;
        }
    };

    vm.generateUnifyDeals = function () {
        var sheet = vm.spreadsheet.activeSheet();
        var count = vm.inValidUnifyDeals.length;
        vm.inValidUnifyDeals = [];
        var tempRange = sheet.range("A1:H" + count).values().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null && x[6] == null && x[7] == null && x[8] == null));
        if (tempRange.length > 0) {
            vm.spinnerMessageDescription = "Please wait while reading Unification data..";
            for (var i = 0; i < tempRange.length; i++) {
                var newUnifyDeals = {};
                newUnifyDeals.DEAL_ID = tempRange[i][0] != null ? ($.isNumeric(tempRange[i][0]) && parseInt(tempRange[i][0]) > 0 ? tempRange[i][0] : 0) : 0;
                newUnifyDeals.UCD_GLOBAL_ID = tempRange[i][1] != null ? ($.isNumeric(tempRange[i][1]) && parseInt(tempRange[i][1]) > 0 ? tempRange[i][1] : 0) : 0;
                newUnifyDeals.UCD_GLOBAL_NAME = tempRange[i][2] != null ? tempRange[i][2].trimEnd() : "";
                newUnifyDeals.UCD_COUNTRY_CUST_ID = tempRange[i][3] != null ? ($.isNumeric(tempRange[i][3]) && parseInt(tempRange[i][3]) > 0 ? tempRange[i][3] : 0) : 0;
                newUnifyDeals.UCD_COUNTRY = tempRange[i][4] != null ? tempRange[i][4].trimEnd() : "";
                newUnifyDeals.DEAL_END_CUSTOMER_RETAIL = tempRange[i][5] != null ? tempRange[i][5].trimEnd() : "";
                newUnifyDeals.DEAL_END_CUSTOMER_COUNTRY = tempRange[i][6] != null ? tempRange[i][6].trimEnd() : "";
                //Added this check because if number is given in the RPL sts code column tempRange[i][7].trimEnd() present in the below line of code throws err.
                if (typeof tempRange[i][7] != "string" && tempRange[i][7] != null) {
                    tempRange[i][7] = tempRange[i][7].toString();
                }
                newUnifyDeals.RPL_STS_CODE = tempRange[i][7] != null ? tempRange[i][7].trimEnd() : "";
                
                vm.inValidUnifyDeals.push(newUnifyDeals);
            }
        }
        vm.SpreadSheetRowsCount = vm.inValidUnifyDeals.length + 1;
    }

    vm.generateDealReconRecords = function () {
        var sheet = vm.spreadsheet.activeSheet();
        var count = vm.dealReconValidationSummary.inValidRecords.length;
        vm.dealReconValidationSummary.inValidRecords = [];
        var tempRange = sheet.range("A1:J" + count).values().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null && x[6] == null && x[7] == null && x[8] == null && x[9] == null && x[10] == null));
        if (tempRange.length > 0) {
            vm.spinnerMessageDescription = "Please wait while reading Unification data..";
            for (var i = 0; i < tempRange.length; i++) {
                var newDealReconRecord = {};
                newDealReconRecord.Deal_ID = tempRange[i][0] != null ? ($.isNumeric(tempRange[i][0]) && parseInt(tempRange[i][0]) > 0 ? tempRange[i][0] : 0) : 0;
                newDealReconRecord.Unified_Customer_ID = tempRange[i][1] != null ? ($.isNumeric(tempRange[i][1]) && parseInt(tempRange[i][1]) > 0 ? tempRange[i][1] : 0) : 0;
                newDealReconRecord.Unified_Customer_Name = tempRange[i][2] != null ? tempRange[i][2].trimEnd() : "";
                newDealReconRecord.Country_Region_Customer_ID = tempRange[i][3] != null ? ($.isNumeric(tempRange[i][3]) && parseInt(tempRange[i][3]) > 0 ? tempRange[i][3] : 0) : 0;
                newDealReconRecord.Unified_Country_Region = tempRange[i][4] != null ? tempRange[i][4].trimEnd() : "";
                newDealReconRecord.To_be_Unified_Customer_ID = tempRange[i][5] != null ? ($.isNumeric(tempRange[i][5]) && parseInt(tempRange[i][5]) > 0 ? tempRange[i][5] : 0) : 0;
                newDealReconRecord.To_be_Unified_Customer_Name = tempRange[i][6] != null ? tempRange[i][6].trimEnd() : "";
                newDealReconRecord.To_be_Country_Region_Customer_ID = tempRange[i][7] != null ? ($.isNumeric(tempRange[i][7]) && parseInt(tempRange[i][7]) > 0 ? tempRange[i][7] : 0) : 0;
                newDealReconRecord.To_be_Unified_Country_Region = tempRange[i][8] != null ? tempRange[i][8].trimEnd() : "";
                //Added this check because if number is given in the RPL sts code column tempRange[i][7].trimEnd() present in the below line of code throws err.
                if (typeof tempRange[i][9] != "string" && tempRange[i][9] != null) {
                    tempRange[i][9] = tempRange[i][9].toString();
                }
                newDealReconRecord.Rpl_Status_Code = tempRange[i][9] != null ? tempRange[i][9].trimEnd() : "";

                vm.dealReconValidationSummary.inValidRecords.push(newDealReconRecord);
            }
        }
        vm.SpreadSheetRowsCount = vm.dealReconValidationSummary.inValidRecords.length + 1;
    }

    vm.sheets = [{ name: "Sheet1" }];
    $scope.$on("kendoWidgetCreated", function (event, widget) {
        // the event is emitted for every widget; if we have multiple
        // widgets in this controller, we need to check that the event
        // is for the one we're interested in.
        if (widget === vm.spreadsheet) {
            var sheets = vm.spreadsheet.sheets();
            var index = 0;
            vm.spreadsheet.activeSheet(sheets[0]);
            var sheet = vm.spreadsheet.activeSheet();
            if (vm.isBulkUnify) {
                sheet.columnWidth(0, 100);
                sheet.columnWidth(1, 130);
                sheet.columnWidth(2, 180);
                sheet.columnWidth(3, 130);
                sheet.columnWidth(4, 180);
                sheet.columnWidth(5, 180);
                sheet.columnWidth(6, 180);
                sheet.columnWidth(7, 180);
                sheet.columnWidth(8, 260);
                index = 9;
            }
            else {
                sheet.columnWidth(0, 70);
                sheet.columnWidth(1, 100);
                sheet.columnWidth(2, 150);
                sheet.columnWidth(3, 100);
                sheet.columnWidth(4, 150);
                sheet.columnWidth(5, 150);
                sheet.columnWidth(6, 120);
                sheet.columnWidth(7, 150);
                sheet.columnWidth(8, 120);
                sheet.columnWidth(9, 150);
                sheet.columnWidth(10, 260);
                index = 11;
            }

            for (var i = index; i < 50; i++)
                sheet.hideColumn(i);

            vm.LoadDataToSpreadsheet();
            if (vm.backendValidation) {
                var sheet = vm.spreadsheet.activeSheet();
                sheet.range("A1:K" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
                sheet.range("A1:A" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(true, '', true));
                sheet.batch(function () {
                    for (var i = 0; i < vm.dealReconValidationSummary.inValidRecords.length; i++) {
                        var lengthOfMsg = vm.dealReconValidationSummary.inValidRecords[i].ERR_MSG.length;
                        var height = 1;
                        if (Math.ceil(lengthOfMsg / 40) > 1)
                            height = height + Math.ceil(lengthOfMsg / 40) - 1;
                        var rowht = height > 1 ? height * 15 : 30;
                        sheet.rowHeight(i, rowht);
                        sheet.range("K" + (i + 1)).verticalAlign("top");
                    }
                });
            }
            if (vm.isBulkUnify)
                vm.ValidateSheet();
            else if (!vm.isBulkUnify && !vm.backendValidation)
                vm.ValidateDealReconSheet();
        }
    });

    vm.LoadDataToSpreadsheet = function () {
        if (vm.backendValidation) {
            $('.modal-dialog').css("width", "1530px");
            $('#spreadsheetUnifyDeals').css("width", "1500px");
            $('#endCustomerUnifyModal').css("max-height", "500px");

            var sheet = vm.spreadsheet.activeSheet();
            sheet.range(kendo.spreadsheet.SHEETREF).clear();
            sheet.range("A1:K" + vm.SpreadSheetRowsCount).wrap(true);
            sheet.setDataSource(vm.dealReconValidationSummary.inValidRecords, ["DEAL_ID", "EXISTING_UCD_GLOBAL_ID", "EXISTING_UCD_GLOBAL_NAME", "EXISTING_UCD_COUNTRY_CUST_ID", "EXISTING_UCD_COUNTRY", "NEW_UCD_GLOBAL_ID", "NEW_UCD_GLOBAL_NAME", "NEW_UCD_COUNTRY_CUST_ID", "NEW_UCD_COUNTRY", "RPL_STS_CD", "ERR_MSG"]);
            //Auto header will be created as 1st row. This is not actual data
            sheet.deleteRow(0);
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal ID");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[2]).find("div").html("Unified Customer ID");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[4]).find("div").html("Unified Customer Name");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[6]).find("div").html("Country/Region Customer ID");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[8]).find("div").html("Unified Country/Region");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[10]).find("div").html("To Be Unified Customer ID");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[12]).find("div").html("To Be Unified Customer Name");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[14]).find("div").html("To Be Country/Region Customer ID");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[16]).find("div").html("To Be Unified Country/Region");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[18]).find("div").html("RPL Status Code");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[20]).find("div").html("Error Messages");

            sheet._rows._count = vm.dealReconValidationSummary.inValidRecords.length;
        }
        else {
            if (vm.isBulkUnify) {
                if (vm.inValidUnifyDeals.length > 0) {
                    $('.modal-dialog').css("width", "1530px");
                    $('#spreadsheetUnifyDeals').css("width", "1500px");
                    $('#endCustomerUnifyModal').css("max-height", "500px");
                    //Header
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[2]).find("div").html("Unified Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[4]).find("div").html("Unified Customer Name");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[6]).find("div").html("Country/Region Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[8]).find("div").html("Unified Country/Region");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[10]).find("div").html("End Customer Retail");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[12]).find("div").html("End Customer Country/Region");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[14]).find("div").html("RPL Status Code");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[16]).find("div").html("Error Messages");


                    var sheet = vm.spreadsheet.activeSheet();
                    sheet.range(kendo.spreadsheet.SHEETREF).clear();
                    sheet.range("H1:I" + vm.SpreadSheetRowsCount).wrap(true);
                    sheet.setDataSource(vm.inValidUnifyDeals, ["DEAL_ID", "UCD_GLOBAL_ID", "UCD_GLOBAL_NAME", "UCD_COUNTRY_CUST_ID", "UCD_COUNTRY", "DEAL_END_CUSTOMER_RETAIL", "DEAL_END_CUSTOMER_COUNTRY", "RPL_STS_CODE"]);
                    //Auto header will be created as 1st row. This is not actual data
                    sheet.deleteRow(0);
                    sheet._rows._count = vm.inValidUnifyDeals.length;
                }
            }
            else {
                if (vm.dealReconValidationSummary.inValidRecords.length > 0) {
                    $('.modal-dialog').css("width", "1530px");
                    $('#spreadsheetUnifyDeals').css("width", "1500px");
                    $('#endCustomerUnifyModal').css("max-height", "500px");

                    var sheet = vm.spreadsheet.activeSheet();
                    sheet.range(kendo.spreadsheet.SHEETREF).clear();
                    sheet.range("A1:K" + vm.SpreadSheetRowsCount).wrap(true);
                    sheet.setDataSource(vm.dealReconValidationSummary.inValidRecords, ["Deal_ID", "Unified_Customer_ID", "Unified_Customer_Name", "Country_Region_Customer_ID", "Unified_Country_Region", "To_be_Unified_Customer_ID", "To_be_Unified_Customer_Name", "To_be_Country_Region_Customer_ID", "To_be_Unified_Country_Region", "Rpl_Status_Code"]);
                    //Auto header will be created as 1st row. This is not actual data
                    sheet.deleteRow(0);
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[2]).find("div").html("Unified Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[4]).find("div").html("Unified Customer Name");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[6]).find("div").html("Country/Region Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[8]).find("div").html("Unified Country/Region");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[10]).find("div").html("To Be Unified Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[12]).find("div").html("To Be Unified Customer Name");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[14]).find("div").html("To Be Country/Region Customer ID");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[16]).find("div").html("To Be Unified Country/Region");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[18]).find("div").html("RPL Status Code");
                    $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[20]).find("div").html("Error Messages");

                    sheet._rows._count = vm.dealReconValidationSummary.inValidRecords.length;
                }
            }
        }
    }

    vm.ValidateDealReconSheet = function () {
        if (vm.dealReconValidationSummary.inValidRecords.length > 0) {
            var sheet = vm.spreadsheet.activeSheet();
            sheet.range("A1:K" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
            vm.LoadDataToSpreadsheet();
            var strAlertMessage = "";
            var isEmptyDealId = false;
            var isEmptyGlobalId = false;
            var isEmptyGlobalName = false;
            var isEmptyCtryId = false;
            var isEmptyCtryName = false;
            var isEmptyToBeGlobalId = false;
            var isEmptyToBeGlobalName = false;
            var isEmptyToBeCtryId = false;
            var isEmptyToBeCtryName = false;
            var isGlobalContainsAny = false;
            var isGlobalContainsNull = false;
            var isInvalidGlobalName = false;
            var isToBeGlobalContainsAny = false;
            var isToBeGlobalContainsNull = false;
            var isInvalidToBeGlobalName = false;
            var isSameGlobalandCtryId = false;
            var isSameToBeGlobalandToBeCtryId = false;
            var isCtrySame = false;
            var invalidRPLStatusCode = [];
            var row = 0;
            if (vm.dealReconValidationSummary != undefined && vm.dealReconValidationSummary.inValidRecords != undefined
                && vm.dealReconValidationSummary.inValidRecords.length > 0) {
                sheet.batch(function () {
                    for (var i = 0; i < vm.dealReconValidationSummary.inValidRecords.length; i++) {
                        row = i + 1;
                        var rowMsg = "";
                        mandatory = [];
                        if (vm.dealReconValidationSummary.inValidRecords[i].Deal_ID == "0") {
                            isEmptyDealId = true;
                            mandatory.push("Deal ID");
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID == "0") {
                            isEmptyGlobalId = true;
                            mandatory.push("Unified Customer ID");
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name == null || vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name == "") {
                            isEmptyGlobalName = true;
                            mandatory.push("Unified Customer Name");
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID == "0") {
                            isEmptyCtryId = true;
                            mandatory.push("Country Region Customer ID");
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region == null || vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region == "") {
                            isEmptyCtryName = true;
                            mandatory.push("Unified Country Region");
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID == "0") {
                            isEmptyToBeGlobalId = true;
                            mandatory.push("To be Unified Customer ID");
                            sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name == null || vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name == "") {
                            isEmptyToBeGlobalName = true;
                            mandatory.push("To be Unified Customer Name");
                            sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID == "0") {
                            isEmptyToBeCtryId = true;
                            mandatory.push("To be Country Region Customer ID");
                            sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', true));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region == null || vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region == "") {
                            isEmptyToBeCtryName = true;
                            mandatory.push("To be Unified Country Region");
                            sheet.range("I" + row + ":I" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (mandatory.length > 0) {
                            rowMsg = rowMsg + mandatory.join(", ") + " is a mandatory field|";
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name != null && vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name != "") {
                            if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name.toLowerCase() == "any") {
                                isGlobalContainsAny = true;
                                rowMsg = rowMsg + "'ANY' cannot be used as Unified Customer Name|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                            if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name.toLowerCase() == "null") {
                                isGlobalContainsNull = true;
                                rowMsg = rowMsg + "NULL cannot be used as Unified Customer Name|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                            var patt = new RegExp("^[\\w\\s.,:'\&+-]*$");
                            var res = patt.test(vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name);
                            if (!res || vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name.length > 65) {
                                isInvalidGlobalName = true;
                                rowMsg = rowMsg + "Unified Customer Name either contains more than 65 characters or invalid characters|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name != null && vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name != "") {
                            if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name.toLowerCase() == "any") {
                                isToBeGlobalContainsAny = true;
                                rowMsg = rowMsg + "'ANY' cannot be used as 'To Be Unified Customer Name'|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                            if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name.toLowerCase() == "null") {
                                isToBeGlobalContainsNull = true;
                                rowMsg = rowMsg + "NULL cannot be used as 'To Be Unified Customer Name'|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                            var patt = new RegExp("^[\\w\\s.,:'\&+-]*$");
                            var res = patt.test(vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name);
                            if (!res || vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name.length > 65) {
                                isToBeInvalidGlobalName = true;
                                rowMsg = rowMsg + "Unified Customer Name either contains more than 65 characters or invalid characters|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID != 0
                            && vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID != 0 &&
                            vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID == vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID) {
                            rowMsg = rowMsg + "Unified Customer ID and Country/Region Customer ID cannot be same|";
                            isSameGlobalandCtryId = true;
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID != 0
                            && vm.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID != 0 &&
                            vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID == vm.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID) {
                            rowMsg = rowMsg + "'To Be Unified Customer ID' and 'To Be Country/Region Customer ID' cannot be same|";
                            isSameToBeGlobalandToBeCtryId = true;
                            sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        if (vm.dealReconValidationSummary.invalidCountries.length > 0) {
                            if (jQuery.inArray(jQuery.trim(vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region).toLowerCase(), vm.dealReconValidationSummary.invalidCountries) != -1) {
                                rowMsg = rowMsg + "Unified Country/Region does not exist in My Deals|";
                                sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        if (vm.dealReconValidationSummary.toBeInvalidCountries.length > 0) {
                            if (jQuery.inArray(jQuery.trim(vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region).toLowerCase(), vm.dealReconValidationSummary.toBeInvalidCountries) != -1) {
                                rowMsg = rowMsg + "'To Be Unified Country/Region' does not exist in My Deals|";
                                sheet.range("I" + row + ":I" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        if (vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region != "" && vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region != "" &&
                            vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region.toLowerCase() != vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region.toLowerCase()) {
                            rowMsg = rowMsg + "Unified Country/Region and 'To Be Unifief Country/Region' needs to be same|";
                            isCtrySame = true;
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            sheet.range("I" + row + ":I" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        var validRows = vm.dealReconValidationSummary.inValidRecords.filter(x => x.Deal_ID != 0 && x.Unified_Customer_ID != 0 && x.Unified_Customer_Name != "" && x.Country_Region_Customer_ID != 0 && x.Unified_Country_Region != "");
                        if (vm.dealReconValidationSummary.duplicateDealCombination.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].Deal_ID, vm.dealReconValidationSummary.duplicateDealCombination) != -1
                                && validRows.filter(x => x.Deal_ID == vm.dealReconValidationSummary.inValidRecords[i].Deal_ID
                                    && x.Unified_Customer_ID == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                                    && x.Unified_Customer_Name == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                                    && x.Country_Region_Customer_ID == vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID
                                    && x.Unified_Country_Region == vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region).length > 1) {
                                rowMsg = rowMsg + "Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region|";
                                sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateCustIds.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID, vm.dealReconValidationSummary.duplicateCustIds) != -1) {
                                rowMsg = rowMsg + "Same Unified Customer ID cannot be associated with multiple Unified Customer Names|";
                                sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateCustNames.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name, vm.dealReconValidationSummary.duplicateCustNames) != -1) {
                                rowMsg = rowMsg + "Same Unified Customer Name cannot be associated with multiple Unified Customer IDs|";
                                sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateCtryIds.length > 0) {
                            if (vm.dealReconValidationSummary.duplicateCtryIds.filter(x => x.cust_Id == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                                && x.cust_Nm == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                                && x.ctry_Id == vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID).length > 0) {
                                rowMsg = rowMsg + "Same Country/Region Customer ID cannot be associated with multiple Unified Country/Regions|";
                                sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateCtryNms.length > 0) {
                            if (vm.dealReconValidationSummary.duplicateCtryNms.filter(x => x.cust_Id == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                                && x.cust_Nm == vm.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                                && x.ctry_Nm == vm.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region
                                && x.ctry_Id == vm.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID).length > 0) {
                                rowMsg = rowMsg + "Same Unified Country/Regions cannot be associated with multiple Country/Region Customer ID|";
                                sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateToBeCustIds.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID, vm.dealReconValidationSummary.duplicateToBeCustIds) != -1) {
                                rowMsg = rowMsg + "Same 'To Be Unified Customer ID' cannot be associated with multiple 'To Be Unified Customer Names'|";
                                sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateToBeCustNames.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name, vm.dealReconValidationSummary.duplicateToBeCustNames) != -1) {
                                rowMsg = rowMsg + "Same 'To Be Unified Customer Name' cannot be associated with multiple 'To Be Unified Customer IDs'|";
                                sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateToBeCtryIds.length > 0) {
                            if (vm.dealReconValidationSummary.duplicateToBeCtryIds.filter(x => x.cust_Id == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID
                                && x.cust_Nm == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name
                                && x.ctry_Nm == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region
                                && x.ctry_Id == vm.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID).length > 0) {
                                rowMsg = rowMsg + "Same 'To Be Country/Region Customer ID' cannot be associated with multiple 'To Be Unified Country/Region'|";
                                sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (vm.dealReconValidationSummary.duplicateToBeCtryNms.length > 0) {
                            if (vm.dealReconValidationSummary.duplicateToBeCtryNms.filter(x => x.cust_Id == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID
                                && x.cust_Nm == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name
                                && x.ctry_Nm == vm.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region
                                && x.ctry_Id == vm.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID).length > 0) {
                                rowMsg = rowMsg + "Same 'To Be Unified Country/Region' cannot be associated with multiple 'To Be Country/Region Customer ID'|";
                                sheet.range("I" + row + ":I" + row).validation($scope.UnifiedDealValidation(true, '', false));
                            }
                        }
                        var RPLStsCodepattern = new RegExp("^[A-Za-z\\s,]*$");
                        var isValidRPLSTSCode = RPLStsCodepattern.test(vm.dealReconValidationSummary.inValidRecords[i].Rpl_Status_Code);
                        if (!isValidRPLSTSCode) {
                            invalidRPLStatusCode.push(vm.dealReconValidationSummary.inValidRecords[i].Deal_ID)
                            rowMsg = rowMsg + "The RPL Status code contains invalid characters. Please remove spaces and special characters.|";
                            sheet.range("J" + row + ":J" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        else if (vm.dealReconValidationSummary.invalidRplStatusCodes.length > 0) {
                            if (jQuery.inArray(vm.dealReconValidationSummary.inValidRecords[i].Rpl_Status_Code, vm.dealReconValidationSummary.invalidRplStatusCodes) != -1) {
                                rowMsg = rowMsg + "Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code.|"
                                sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', true));
                            }
                        }
                        if (rowMsg != '') {
                            var rowMsg = rowMsg.slice(0, -1);
                            var arr = rowMsg.split('|');
                            var height = arr.length + 1;
                            var index = 1;
                            var msg = "";
                            angular.forEach(arr, function (row) {
                                msg = msg + (index++) + ". " + row + "\n";
                                if (Math.ceil(row.length / 40) > 1)
                                    height = height + Math.ceil(row.length / 40) - 1;
                            });
                            var rowht = height > 1 ? height * 15 : 30;
                            sheet.rowHeight(i, rowht);
                            sheet.range("K" + row).value(msg);
                            sheet.range("K" + row).verticalAlign("top");
                        }
                    }
                });
                var mandatoryFields = [];
                if (isEmptyDealId)
                    mandatoryFields.push("Deal ID");
                if (isEmptyGlobalId)
                    mandatoryFields.push("Unified Customer ID");
                if (isEmptyGlobalName)
                    mandatoryFields.push("Unified Customer Name");
                if (isEmptyCtryId)
                    mandatoryFields.push("Country Region Customer ID");
                if (isEmptyCtryName)
                    mandatoryFields.push("Unified Country Region");
                if (isEmptyToBeGlobalId)
                    mandatoryFields.push("To be Unified Customer ID");
                if (isEmptyToBeGlobalName)
                    mandatoryFields.push("To be Unified Customer Name");
                if (isEmptyToBeCtryId)
                    mandatoryFields.push("To be Country Region Customer ID");
                if (isEmptyToBeCtryName)
                    mandatoryFields.push("To be Unified Country Region");
                if (mandatoryFields.length > 0) {
                    strAlertMessage += "<li>" + mandatoryFields.join(", ") + " is a mandatory field</li>"
                }
                if (isGlobalContainsAny)
                    strAlertMessage += "<li style='word-wrap: break-word;'>'ANY' cannot be used as Unified Customer Name</li>";
                if (isGlobalContainsNull)
                    strAlertMessage += "<li style='word-wrap: break-word;'>NULL cannot be used as Unified Customer Name</li>";
                if (isToBeGlobalContainsAny)
                    strAlertMessage += "<li style='word-wrap: break-word;'>'ANY' cannot be used as 'To Be Unified Customer Name'</li>";
                if (isToBeGlobalContainsNull)
                    strAlertMessage += "<li style='word-wrap: break-word;'>NULL cannot be used as 'To Be Unified Customer Name'</li>";
                if (isInvalidGlobalName)
                    strAlertMessage += "<li style='word-wrap: break-word;'>Unified Customer Name either contains more than 65 characters or invalid characters</li>";
                if (isInvalidToBeGlobalName)
                    strAlertMessage += "<li style='word-wrap: break-word;'>'To Be Unified Customer Name' either contains more than 65 characters or invalid characters</li>";
                if (isSameGlobalandCtryId)
                    strAlertMessage += "<li style='word-wrap: break-word;'>Unified Customer ID and Country/Region Customer ID cannot be same</li>";
                if (isSameToBeGlobalandToBeCtryId)
                    strAlertMessage += "<li style='word-wrap: break-word;'>'To Be Unified Customer ID' and 'To Be Country/Region Customer ID' cannot be same</li>"
                if (vm.dealReconValidationSummary.invalidCountries.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Unified Country/Region does not exist in My Deals</li>";
                }
                if (vm.dealReconValidationSummary.toBeInvalidCountries.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>'To Be Unified Country/Region' does not exist in My Deals</li>";
                }
                if (isCtrySame) {
                    strAlertMessage += "<li>Unified Country/Region and 'To Be Unified Country/Region' needs to be same.</li>"
                }
                if (vm.dealReconValidationSummary.duplicateDealCombination.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region</li>";
                }
                if (vm.dealReconValidationSummary.duplicateCustIds.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same Unified Customer ID cannot be associated with multiple Unified Customer Names</li>";
                }
                if (vm.dealReconValidationSummary.duplicateCustNames.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same Unified Customer Name cannot be associated with multiple Unified Customer IDs</li>";
                }
                if (vm.dealReconValidationSummary.duplicateCtryIds.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same Country/Region Customer ID cannot be associated with multiple Unified Country/Regions</li>";
                }
                if (vm.dealReconValidationSummary.duplicateCtryNms.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same Unified Country/Regions cannot be associated with multiple Country/Region Customer ID</li>";
                }
                if (vm.dealReconValidationSummary.duplicateToBeCustIds.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same 'To Be Unified Customer ID' cannot be associated with multiple 'To Be Unified Customer Names'</li>";
                }
                if (vm.dealReconValidationSummary.duplicateToBeCustNames.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same 'To Be Unified Customer Name' cannot be associated with multiple 'To Be Unified Customer IDs'</li>";
                }
                if (vm.dealReconValidationSummary.duplicateToBeCtryIds.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same 'To Be Country/Region Customer ID' cannot be associated with multiple 'To Be Unified Country/Region'</li>";
                }
                if (vm.dealReconValidationSummary.duplicateToBeCtryNms.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Same 'To Be Unified Country/Region' cannot be associated with multiple 'To Be Country/Region Customer ID'</li>";
                }
                if (invalidRPLStatusCode.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>The RPL Status code contains invalid characters. Please remove spaces and special characters</li>";
                }
                if (vm.dealReconValidationSummary.invalidRplStatusCodes.length > 0) {
                    strAlertMessage += "<li style='word-wrap: break-word;'>Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code.</li>"
                }
                if (strAlertMessage != "") {
                    strAlertMessage = "<span style='word-wrap: break-word;'><b>The highlighted row(s) in the excel have not been updated in the MyDeals because of the following error(s).</b></span></br>" + strAlertMessage;
                    kendo.alert(jQuery.trim(strAlertMessage));
                }
            }
        }
        else if (vm.dealReconValidationSummary.inValidRecords.length == 0 && vm.dealReconValidationSummary.validRecords.length > 0) {
            PrimeCustomersService.updateDealRecon(vm.dealReconValidationSummary.validRecords).then(function (response) {
                if (response == null || response.data.length == 0) {
                    kendo.alert("Updated Successfully");
                    vm.dealReconValidationSummary = [];
                    vm.CloseWindow();
                }
                else {
                    vm.backendValidation = true;
                    vm.dealReconValidationSummary = [];
                    vm.dealReconValidationSummary.inValidRecords = response.data;
                    vm.SpreadSheetRowsCount = response.data.length + 1;
                }
            }, function (response) {
                logger.error("Operation failed");
            });
        }
    }
    vm.CloseWindow = function () {
        $uibModalInstance.close();
    };

}
