angular
    .module("app.admin")
    .controller("BulkUploadMeetCompModalController", BulkUploadMeetCompModalController)
    .run(SetRequestVerificationToken);

SetRequestVerificationToken.$inject = ["$http"];

BulkUploadMeetCompModalController.$inject = ["$rootScope", "$location", "meetCompService", "$scope", "$stateParams", "logger", "$timeout", "gridConstants", "$uibModalInstance"];

function BulkUploadMeetCompModalController($rootScope, $location, meetCompService, $scope, $stateParams, logger, $timeout, gridConstants, $uibModalInstance) {
    var vm = this;
    vm.spinnerMessageHeader = "Bulk Upload Meet Comp";
    vm.spinnerMessageDescription = "Please wait while we importing meet comp data..";
    vm.isBusyShowFunFact = true;
    vm.MeetComps = [];
    vm.MeetCompValidation = null;

    var hasUnSavedFiles = false;
    var hasFiles = false;
    var uploadSuccessCount = 0;
    var uploadErrorCount = 0;

    vm.fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractMeetCompFile',
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".xlsx"]
        }
    };

    vm.onFileSelect = function (e) {
        // Hide default kendo upload and clear buttons as contract is not generated at this point. Upload files after contract id is generated.
        // TODO: Do we want to show them in edit scenario ?
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
        uploadSuccessCount++;
        vm.MeetComps = e.response;
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
        $(".k-upload-selected").click();
    }

    vm.ValidateMeetComps = function () {
        vm.generateMeetComps();
        if (vm.MeetComps.length > 0) {
            vm.spinnerMessageDescription = "Please wait while validating meet comp data..";
            meetCompService.validateMeetComps(vm.MeetComps).then(function (response) {
                vm.MeetCompValidation = response.data;
                vm.ValidateSheet();
            }, function (response) {
                logger.error("Operation failed");
            });
        } else
            kendo.alert("There is no meet comp to validate!");
    };

    vm.SaveMeetComps = function () {
        if (vm.MeetCompValidation != null && vm.MeetCompValidation.HasInvalidMeetComp == false && vm.MeetCompValidation.DistinctMeetComps.length > 0) {
            vm.spinnerMessageDescription = "Please wait while uploading meet comp data..";
            meetCompService.uploadMeetComp(vm.MeetCompValidation.DistinctMeetComps).then(function (response) {
                if (response.data) {
                    logger.success("Meet comps are uploaded successfully!");
                    vm.CloseWindow();
                }
                else
                    logger.error("Unable to upload meet comps!");
            }, function (response) {
                logger.error("Unable to upload meet comps!");
            });
        } else
            kendo.alert("There is no meet comp to save!");
    };

    kendo.spreadsheet.defineFunction("IS_VALID_PRODUCT", function (str) {
        return !(jQuery.inArray(jQuery.trim(str).toLowerCase(), vm.MeetCompValidation.InValidProducts) > -1);
    }).args([["str", "string"]]);

    kendo.spreadsheet.defineFunction("IS_VALID_CUSTOMER", function (str) {
        return !(jQuery.inArray(jQuery.trim(str).toLowerCase(), vm.MeetCompValidation.InValidCustomers) > -1);
    }).args([["str", "string"]]);

    vm.ValidateSheet = function () {
        if (vm.MeetCompValidation != null) {
            vm.MeetComps = vm.MeetCompValidation.DistinctMeetComps;
            vm.dataSourceSpreadSheet.read();
            vm.DeleteSpreadsheetAutoHeader();

            if (vm.MeetCompValidation.HasInvalidMeetComp) {
                var sheet = vm.spreadsheet.activeSheet();
                sheet.range("A1:A200").validation({
                    dataType: "custom",
                    from: "IS_VALID_CUSTOMER(A1)",
                    allowNulls: true,
                    messageTemplate: "Unauthorized customer found!"
                });

                sheet.range("B1:B200").validation({
                    dataType: "custom",
                    from: "IS_VALID_PRODUCT(B1)",
                    allowNulls: true,
                    messageTemplate: "Product not found!"
                });

                var maxItemsSize = 10;
                if (vm.MeetCompValidation.InValidCustomers.length > 0 || vm.MeetCompValidation.InValidProducts.length > 0) {
                    var strAlertMessage = "";
                    // Replaced with a generalized function call and restricted popup size to not flow off bottom
                    if (vm.MeetCompValidation.InValidCustomers.length > 0)
                        strAlertMessage += myFunction(vm.MeetCompValidation.InValidCustomers, maxItemsSize, "Invalid customers exist, please fix:");
                    if (vm.MeetCompValidation.InValidProducts.length > 0)
                        strAlertMessage += myFunction(vm.MeetCompValidation.InValidProducts, maxItemsSize, "Invalid products exist, please fix:");
                    kendo.alert(jQuery.trim(strAlertMessage));
                }
            } else
                kendo.alert("<b>All meet comps are valid</b></br>");
        }
    }

    vm.generateMeetComps = function () {
        var sheet = vm.spreadsheet.activeSheet();
        vm.MeetComps = [];
        var tempRange = sheet.range("A1:F200").values().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null));
        if (tempRange.length > 0) {
            vm.spinnerMessageDescription = "Please wait while reading meet comp data..";
            for (var i = 0; i < tempRange.length; i++) {
                var newMeetComp = {};
                newMeetComp.CUST_NM = tempRange[i][0] != null ? jQuery.trim(tempRange[i][0]) : "";
                newMeetComp.HIER_VAL_NM = tempRange[i][1] != null ? jQuery.trim(tempRange[i][1]) : "";
                newMeetComp.MEET_COMP_PRD = tempRange[i][2] != null ? jQuery.trim(tempRange[i][2]) : "";
                newMeetComp.MEET_COMP_PRC = tempRange[i][3] != null ? tempRange[i][3] : 0;
                newMeetComp.IA_BNCH = tempRange[i][4] != null ? tempRange[i][4] : 0;
                newMeetComp.COMP_BNCH = tempRange[i][5] != null ? tempRange[i][5] : 0;
                vm.MeetComps.push(newMeetComp);
            }
        }
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
            sheet.setDataSource(vm.dataSourceSpreadSheet, ["CUST_NM", "HIER_VAL_NM", "MEET_COMP_PRD", "MEET_COMP_PRC", "IA_BNCH", "COMP_BNCH"]);
            sheet.columnWidth(0, 160);
            sheet.columnWidth(1, 160);
            sheet.columnWidth(2, 160);
            for (var i = 6; i < 50; i++)
                sheet.hideColumn(i);
            vm.DeleteSpreadsheetAutoHeader();
        }
    });

    vm.DeleteSpreadsheetAutoHeader = function () {
        var sheet = vm.spreadsheet.activeSheet();
        sheet.deleteRow(0);
        sheet.range("A1:C200").color("black");
        sheet.range("A1:C200").textAlign("left");
        sheet.range("D1:F200").textAlign("right");
        sheet.range("D1:F200").format("$#,##0.00");
        sheet.range("D1:F200").validation({
            dataType: "custom",
            from: "REGEXP_MATCH_MONEY(D1)",
            allowNulls: true,
            type: "reject",
            titleTemplate: "Invalid Price",
            messageTemplate: "Format of the price is invalid. This should be greater than zero."
        });
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[0]).find("div").html("Customer");
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[2]).find("div").html("Deal Product Name (Only Processor, Lvl 4)");
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[4]).find("div").html("Meet Comp Sku");
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[6]).find("div").html("Meet Comp Price");
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[8]).find("div").html("IA Bench");
        $($("#spreadsheetMeetComp .k-spreadsheet-column-header").find("div")[10]).find("div").html("Comp Bench");

        var i;
        if (vm.MeetComps.length > 198) {
            for (i = 198; i <= vm.MeetComps.length; i++) {
                sheet.range("A" + i).value(vm.MeetComps[i - 1].CUST_NM);
                sheet.range("B" + i).value(vm.MeetComps[i - 1].HIER_VAL_NM);
                sheet.range("C" + i).value(vm.MeetComps[i - 1].MEET_COMP_PRD);
                sheet.range("D" + i).value(vm.MeetComps[i - 1].MEET_COMP_PRC);
                sheet.range("E" + i).value(vm.MeetComps[i - 1].IA_BNCH);
                sheet.range("F" + i).value(vm.MeetComps[i - 1].COMP_BNCH);
            }
        }
    }

    kendo.spreadsheet.defineFunction("REGEXP_MATCH_MONEY", function (str) {
        return $.isNumeric(str) && parseFloat(str) > 0;
    }).args([["str", "string"]]);

    vm.dataSourceSpreadSheet = new kendo.data.DataSource({
        transport: {
            read: function (e) {
                e.success(vm.MeetComps);
            }
        }
    });

    vm.CloseWindow = function () {
        $uibModalInstance.close();
    };

    function myFunction(itemsList, maxItemsSize, itemsMessage) {
        var retString = "";
        if (itemsList.length > 0) {
            var truncatedMatchedItems = itemsList.slice(0, maxItemsSize).map(function (data) { return " " + data });
            retString += "</br></br>";
            if (truncatedMatchedItems.length < itemsList.length) {
                retString += "<b>" + itemsMessage + " (top " + maxItemsSize + " of " + itemsList.length + " items)</b></br>" + $.unique(truncatedMatchedItems).join("</br>");
                retString += "<br>...<br>";
            } else {
                retString += "<b>" + itemsMessage + "</b></br>" + $.unique(itemsList).join("</br>");
            }
        }
        return retString;
    }
}
