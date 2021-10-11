angular
    .module("app.admin")
    .controller("BulkUnifyModelController", BulkUnifyModelController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

BulkUnifyModelController.$inject = ["$rootScope", "$location", "PrimeCustomersService", "$scope", "$stateParams", "logger", "$timeout", "gridConstants", "$uibModalInstance"];

function BulkUnifyModelController($rootScope, $location, PrimeCustomersService, $scope, $stateParams, logger, $timeout, gridConstants, $uibModalInstance) {
    var vm = this;
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
    };

    vm.onSuccess = function (e) {
        if (e.response == undefined || e.response == null || e.response == "") {
            kendo.alert("Template of the excel file which you ar trying to upload is not the correct.");
            $(".k-upload-files.k-reset").find("li").remove();
            $(".k-upload-files.k-reset").hide();
            $(".k-upload-status.k-upload-status-total").hide();
            return;
        }
        uploadSuccessCount++;
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
                    var pgmDealdata = data.filter(x => x.COMMENTS == "Program Tender Deal(s)");
                    if (pgmDealdata != undefined && pgmDealdata.length > 0) {
                        kendo.alert("Following Program Tender " + pgmDealdata[0].Deal_No + warningmsg);
                    }
                    var hybDealdata = data.filter(x => x.COMMENTS == "Voltier Hybrid Deal(s)");
                    if (hybDealdata != undefined && hybDealdata.length > 0) {
                        kendo.alert("Following Vol_Tier hybrid " + hybDealdata[0].Deal_No + warningmsg);
                    }
                    var dealsHasErrors = data.filter(x => x.COMMENTS == "Deal(s) Cannot be Unified");
                    if (data[0].COMMENTS == "Bulk Unified Deal(s)" && dealsHasErrors != undefined && dealsHasErrors.length == 0) {
                        kendo.alert("<b>" + data[0].No_Of_Deals + " Deal(s) are successfully unified");
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
                            if (data[i].COMMENTS != "Bulk Unified Deal(s)" && data[i].COMMENTS != "Program Tender Deal(s)" && data[i].COMMENTS != "Voltier Hybrid Deal(s)")
                                msg += "<br/><li><div style='word-wrap: break-word;'>" + data[i].COMMENTS + " : " + data[i].Deal_No + "</div></li>";
                            else if (data[i].COMMENTS != "Bulk Unified Deal(s)") {
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
                //vm.LoadDataToSpreadsheet();
                vm.ValidateSheet();
            }, function (response) {
                logger.error("Operation failed");
            });
        } else
            kendo.alert("There is no data to validate!");
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
            sheet.range("A1:G" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
            vm.LoadDataToSpreadsheet();
            var maxItemsSize = 5;
            var strAlertMessage = "";
            var isInvalidGlobalName = false;
            var isGlobalContainsAny = false;
            var isGlobalContainsNull = false;
            var isEmptyDealEndCustomerCountry = false;
            var isEmptyDealEndCustomerRetail = false;
            sheet.batch(function () {
                for (var i = 0; i < vm.inValidUnifyDeals.length; i++) {
                    row = i + 1;
                    if (vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == undefined || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == null
                        || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == '') {
                        isEmptyDealEndCustomerRetail = true;
                        msg = "Deal End_Customer_Retail must not be empty!";
                        sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                    }
                    if (vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == undefined || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == null
                        || vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == '') {
                        isEmptyDealEndCustomerCountry = true;
                        msg = "Deal End_Customer_Country must not be empty!";
                        sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                    }
                    if (vm.UnifyValidation.IsEmptyDealAvailable) {
                        msg = "Deal Id must not be empty and must be Integer!";
                        sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));                        
                    }
                    if (vm.UnifyValidation.DuplicateDealCombination.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.DuplicateDealCombination) != -1) {
                            msg = "Deal ID having same comnination of UCD_GLOBAL_ID, UCD_GLOBAL_NAME, UCD_COUNTRY_CUST_ID and UCD_COUNTRY multiple times";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }
                    if (vm.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.DuplicateDealEntryCombination) != -1) {
                            msg = "Deal ID having same comnination of DEAL_END_CUSTOMER_RETAIL and DEAL_END_CUSTOMER_COUNTRY multiple times";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCustIdAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_ID == "0") {
                            msg = "UCD_GLOBAL_ID must not be empty  and must be Integer!";
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCustNameAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME == null || vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME == "") {
                            msg = "UCD_GLOBAL_NAME must not be empty!";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCountryIdAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID == "0") {
                            msg = "UCD_COUNTRY_CUST_ID must not be empty and must be integer!";
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }
                    if (vm.UnifyValidation.IsEmptyCountryAvailable) {
                        if (vm.inValidUnifyDeals[i].UCD_COUNTRY == null || vm.inValidUnifyDeals[i].UCD_COUNTRY == "") {
                            msg = "UCD_COUNTRY must not be empty!";
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                    }
                    if (vm.UnifyValidation.InValidCountries.length > 0) {
                        if (jQuery.inArray(jQuery.trim(vm.inValidUnifyDeals[i].UCD_COUNTRY).toLowerCase(), vm.UnifyValidation.InValidCountries) != -1) {
                            msg = "UCD_COUNTRY does not exists in My Deals!";
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                    }

                    if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME != null && vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME != "") {
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "any") {
                            isGlobalContainsAny = true;
                            msg = "Any cannot be used as UCD Global for unification process!";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                        if (vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "null") {
                            isGlobalContainsNull = true;
                            msg = "null cannot be used as UCD Global for unification process!";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                        var patt = new RegExp("^[\\w\\s.,:'\&-]*$");
                        var res = patt.test(vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME);
                        if (!res || vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME.length > 65) {
                            isInvalidGlobalName = true;
                            msg = "UCD_GLOBAL_NAME contains invalid character or it has more than 65 characters!";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, msg, false));
                        }
                    }

                    if (vm.duplicateGlobalIds.length > 1) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].UCD_GLOBAL_ID, vm.duplicateGlobalIds) != -1) {
                            msg = "UCD_GLOBAL_ID already exists with another UCD_GLOBAL_NAME!";
                            sheet.range("B" + row + ":B" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }

                    if (vm.duplicateGlobalNames.length > 1) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].UCD_GLOBAL_NAME, vm.duplicateGlobalNames) != -1) {
                            msg = "UCD_GLOBAL_NAME already exists with another UCD_GLOBAL_ID!";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }

                    if (vm.UnifyValidation.UnifiedCombination.length > 0) {
                        var index = vm.UnifyValidation.UnifiedCombination.findIndex((x) => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                            && x.DEAL_END_CUSTOMER_COUNTRY == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                        if (index > -1) {
                            msg = "DEAL_END_CUSTOMER_RETAIL && DEAL_END_CUSTOMER_COUNTRY combination entered is already unified!"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }

                    if (vm.UnifyValidation.InvalidDeals.length > 0) {
                        if (jQuery.inArray(vm.inValidUnifyDeals[i].DEAL_ID, vm.UnifyValidation.InvalidDeals) != -1) {
                            msg = "DEAL_ID is having more combination of ununified end Customers than Deal Editor screen!"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }

                    if (vm.UnifyValidation.InValidCombination.length > 0) {
                        var index = vm.UnifyValidation.InValidCombination.findIndex((x) => x.DEAL_ID == vm.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                            && x.DEAL_END_CUSTOMER_COUNTRY == vm.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                        if (index > -1) {
                            msg = "DEAL_END_CUSTOMER_RETAIL && DEAL_END_CUSTOMER_COUNTRY combination not matched with Deal Editor Screen!"
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, msg, true));
                        }
                    }

                }
            });
            if (isEmptyDealEndCustomerRetail) {
                strAlertMessage += "</br></br>Deal_END_CUSTOMER_RETAIL must not be empty!, Please fix.";
            }
            if (isEmptyDealEndCustomerCountry) {
                strAlertMessage += "</br></br>Deal_END_CUSTOMER_COUNTRY must not be empty!, Please fix.";
            }
            if (vm.UnifyValidation.IsEmptyDealAvailable) {
                strAlertMessage += "</br></br>Deal Id must not be empty and must be Integer!, Please fix.";
            }
            if (vm.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                strAlertMessage += "</br></br>Deal ID having same comnination of DEAL_END_CUSTOMER_RETAIL and DEAL_END_CUSTOMER_COUNTRY multiple times";
            }
            if (vm.UnifyValidation.DuplicateDealCombination.length > 0) {
                strAlertMessage += "</br></br>Deal ID having same comnination of UCD_GLOBAL_ID, UCD_GLOBAL_NAME, UCD_COUNTRY_CUST_ID and UCD_COUNTRY multiple times";
            }
            if (vm.UnifyValidation.IsEmptyCustIdAvailable) {
                strAlertMessage += "</br></br>UCD_GLOBAL_ID must not be empty and must be Integer!, Please fix."
            }
            if (vm.UnifyValidation.IsEmptyCustNameAvailable) {
                strAlertMessage += "</br></br>UCD_GLOBAL_NAME must not be empty!, Please fix."
            }
            if (vm.UnifyValidation.IsEmptyCountryIdAvailable) {
                strAlertMessage += "</br></br>UCD_COUNTRY_CUST_ID must not be empty and must be integer!, Please fix."
            }
            if (vm.UnifyValidation.IsEmptyCountryAvailable) {
                strAlertMessage += "</br></br>UCD_COUNTRY must not be empty!, Please fix."
            }
            if (vm.UnifyValidation.InValidCountries.length > 0) {
                strAlertMessage += "</br></br>UCD_COUNTRY does not exists in My Deals!, Please fix."
            }
            if (isInvalidGlobalName) {
                strAlertMessage += "</br></br>UCD_GLOBAL_NAME contains invalid character or it has more than 65 characters!";
            }
            if (vm.duplicateGlobalIds.length > 1) {
                strAlertMessage += "</br></br>Same UCD_GLOBAL_ID exists for multiple UCD_GLOBAL_NAMES!";
            }
            if (vm.duplicateGlobalNames.length > 1) {
                strAlertMessage += "</br></br>Same UCD_GLOBAL_NAME exists for multiple UCD_GLOBAL_IDS!";
            }
            if (isGlobalContainsAny) {
                strAlertMessage += "</br></br>Any cannot be used as UCD Global for unification process!, Please fix."
            }
            if (isGlobalContainsNull) {
                strAlertMessage += "</br></br>null cannot be used as UCD Global for unification process!, Please fix."
            }
            if (vm.UnifyValidation.InValidCombination.length > 0) {
                strAlertMessage += "</br></br>For few deals, DEAL_END_CUSTOMER_RETAIL && DEAL_END_CUSTOMER_COUNTRY combination not matched with Deal Editor Screen!, Please fix."
            }
            if (vm.UnifyValidation.InvalidDeals.length > 0) {
                strAlertMessage += "</br></br>For few deals, DEAL_ID is having more combination of ununified End Customers than Deal Editor screen!, Please fix."
            }
            if (vm.UnifyValidation.UnifiedCombination.length > 0) {
                strAlertMessage += "</br></br>For few deals, DEAL_END_CUSTOMER_RETAIL && DEAL_END_CUSTOMER_COUNTRY combination entered is already unified!!, Please fix."
            }
            if (strAlertMessage != "") {
                kendo.alert(jQuery.trim(strAlertMessage));

            } else {
                PrimeCustomersService.updateBulkUnifyDeals(vm.validUnifyDeals).then(function (response) {
                    var data = response.data;
                    if (data != null && data != undefined) {
                        var warningmsg =" deal(s) got Unified. Please make ensure all other deals associated to the same pricing table having same End customer Combination"
                        var pgmDealdata = data.filter(x => x.COMMENTS == "Program Tender Deal(s)");
                        if (pgmDealdata != undefined && pgmDealdata.length > 0) {
                            kendo.alert("Following Program Tender " + pgmDealdata[0].Deal_No + warningmsg);
                        }
                        var hybDealdata = data.filter(x => x.COMMENTS == "Voltier Hybrid Deal(s)");
                        if (hybDealdata != undefined && hybDealdata.length > 0) {
                            kendo.alert("Following Vol_Tier hybrid " + hybDealdata[0].Deal_No + warningmsg);
                        }
                        var dealsHasErrors = data.filter(x => x.COMMENTS == "Deal(s) Cannot be Unified");
                        if (data[0].COMMENTS == "Bulk Unified Deal(s)" && dealsHasErrors != undefined && dealsHasErrors.length == 0) {
                            kendo.alert("<b>" + data[0].No_Of_Deals + " Deal(s) are successfully unified");
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
                                if (data[i].COMMENTS != "Bulk Unified Deal(s)" && data[i].COMMENTS != "Program Tender Deal(s)" && data[i].COMMENTS != "Voltier Hybrid Deal(s)")
                                    msg += "<br/><li><div style='word-wrap: break-word;'>" + data[i].COMMENTS + " : " + data[i].Deal_No + "</div></li>";
                                else if (data[i].COMMENTS != "Bulk Unified Deal(s)"){
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
        var tempRange = sheet.range("A1:G" + count).values().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null && x[6] == null && x[7]== null));
        if (tempRange.length > 0) {
            vm.spinnerMessageDescription = "Please wait while reading Unification data..";
            for (var i = 0; i < tempRange.length; i++) {
                var newUnifyDeals = {};
                newUnifyDeals.DEAL_ID = tempRange[i][0] != null ? ($.isNumeric(tempRange[i][0]) && parseInt(tempRange[i][0]) > 0 ? tempRange[i][0] : 0) : 0;
                newUnifyDeals.UCD_GLOBAL_ID = tempRange[i][1] != null ? ($.isNumeric(tempRange[i][1]) && parseInt(tempRange[i][1]) > 0 ? tempRange[i][1] : 0) : 0;
                newUnifyDeals.UCD_GLOBAL_NAME = tempRange[i][2] != null ? jQuery.trim(tempRange[i][2]) : "";
                newUnifyDeals.UCD_COUNTRY_CUST_ID = tempRange[i][3] != null ? ($.isNumeric(tempRange[i][3]) && parseInt(tempRange[i][3]) > 0 ? tempRange[i][3] : 0) : 0;
                newUnifyDeals.UCD_COUNTRY = tempRange[i][4] != null ? jQuery.trim(tempRange[i][4]) : "";
                newUnifyDeals.DEAL_END_CUSTOMER_RETAIL = tempRange[i][5] != null ? jQuery.trim(tempRange[i][5]) : "";
                newUnifyDeals.DEAL_END_CUSTOMER_COUNTRY = tempRange[i][6] != null ? jQuery.trim(tempRange[i][6]) : "";
                vm.inValidUnifyDeals.push(newUnifyDeals);
            }
        }
        vm.SpreadSheetRowsCount = vm.inValidUnifyDeals.length + 1;
    }

    vm.sheets = [{ name: "Sheet1" }];
    $scope.$on("kendoWidgetCreated", function (event, widget) {
        // the event is emitted for every widget; if we have multiple
        // widgets in this controller, we need to check that the event
        // is for the one we're interested in.
        if (widget === vm.spreadsheet) {
            var sheets = vm.spreadsheet.sheets();
            vm.spreadsheet.activeSheet(sheets[0]);
            var sheet = vm.spreadsheet.activeSheet();
            sheet.columnWidth(0, 100);
            sheet.columnWidth(1, 100);
            sheet.columnWidth(2, 160);
            sheet.columnWidth(3, 100);
            sheet.columnWidth(4, 160);
            sheet.columnWidth(5, 160);
            sheet.columnWidth(6, 160);
            for (var i = 7; i < 50; i++)
                sheet.hideColumn(i);
            //Header
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal Id");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[2]).find("div").html("Ucd Global Id");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[4]).find("div").html("Ucd Global Name");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[6]).find("div").html("Ucd Country Cust Id");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[8]).find("div").html("Ucd Country");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[10]).find("div").html("Deal End Customer Retail");
            $($("#spreadsheetUnifyDeals .k-spreadsheet-column-header").find("div")[12]).find("div").html("Deal End Customer Country");
            vm.LoadDataToSpreadsheet();
            vm.ValidateSheet();
        }
    });

    vm.LoadDataToSpreadsheet = function () {
        if (vm.inValidUnifyDeals.length > 0) {
            $('.modal-dialog').css("width", "1050px");
            $('#spreadsheetUnifyDeals').css("width", "1018px");
            var sheet = vm.spreadsheet.activeSheet();
            sheet.range(kendo.spreadsheet.SHEETREF).clear()
            sheet.setDataSource(vm.inValidUnifyDeals, ["DEAL_ID", "UCD_GLOBAL_ID", "UCD_GLOBAL_NAME", "UCD_COUNTRY_CUST_ID", "UCD_COUNTRY", "DEAL_END_CUSTOMER_RETAIL", "DEAL_END_CUSTOMER_COUNTRY"]);
            //Auto header will be created as 1st row. This is not actual data
            sheet.deleteRow(0);
            sheet._rows._count = vm.inValidUnifyDeals.length;
        }
    }


    vm.CloseWindow = function () {
        $uibModalInstance.close();
    };

}
