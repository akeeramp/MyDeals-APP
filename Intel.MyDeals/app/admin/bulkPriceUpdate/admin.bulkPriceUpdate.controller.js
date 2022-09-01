(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('BulkPriceUpdateController', BulkPriceUpdateController)
        .run(SetRequestVerificationToken);
    SetRequestVerificationToken.$inject = ['$http'];

    BulkPriceUpdateController.$inject = ['bulkPriceUpdateService', '$scope', 'gridConstants', 'logger', '$timeout', '$uibModal', 'dataService'];

    function BulkPriceUpdateController(bulkPriceUpdateService, $scope, gridConstants, logger, $timeout, $uibModal, dataService) {

        var vm = this;
        vm.spinnerMessageDescription = "Please wait while importing data..";
        vm.UpdatedResults = [];
        vm.Send_Vstx_Flg = {};
        vm.inValidBulkPriceUpdate = [];
        vm.uploadedData = [];
        vm.SpreadSheetRowsCount = 101;
        vm.basedate = moment("12/30/1899").format("MM/DD/YYYY");
        vm.count = 0

        vm.OpenBulkPriceUpdateModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/admin/bulkPriceUpdate/bulkPriceUpdateModal.html',
                controller: 'BulkPriceUpdateModelController',
                controllerAs: 'vm',
                size: 'lg',
                windowClass: 'prdSelector-modal-window'
            });
            modalInstance.rendered.then(function () {
                $("#fileUploader").removeAttr("multiple");
            });
            modalInstance.result.then(function (returnData) {
                if (returnData.length > 0) {
                    if (returnData.length > 100) {
                        logger.warning("The excel contains more than 100 records.Only first 100 records will be processed.", "");
                        vm.uploadedData = returnData.slice(0, 100);
                    }
                    else {
                        vm.uploadedData = returnData;
                    }
                    let existingcount = vm.SpreadSheetRowsCount;
                    
                    vm.inValidBulkPriceUpdate = vm.ValidateDateColumns(vm.uploadedData);
                    //vm.inValidBulkPriceUpdate = returnData;

                    if (existingcount > 0) {
                        vm.LoadDataToSpreadsheet();
                        vm.ValidateSheet()
                    }
                }
            }, function () { });
        }

        vm.uploadFile = function (e) {
            vm.spinnerMessageDescription = "Please wait while uploading the data..";
            $(".k-upload-selected").click();
        }

        vm.processData = function () {
            vm.generateDeals()
            if (vm.inValidBulkPriceUpdate.length > 0) {
                vm.ValidateSheet()

                if (vm.count !== 0)
                    return;

                let data = "{ 'BulkPriceUpdateRecord' : ["
                for (var i = 0; i < vm.inValidBulkPriceUpdate.length; i++) {
                    data += '{'

                    if (vm.inValidBulkPriceUpdate[i].DealId > 0) {
                        data += '"DealId": "' + vm.inValidBulkPriceUpdate[i].DealId.toString() + '",'
                    }

                    if (vm.inValidBulkPriceUpdate[i].DealDesc !== "") {
                        data += '"DealDesc": "' + vm.inValidBulkPriceUpdate[i].DealDesc.toString() + '",'
                    }

                    if (vm.inValidBulkPriceUpdate[i].EcapPrice !== "" && vm.inValidBulkPriceUpdate[i].EcapPrice > 0) {
                        data += '"EcapPrice": "' + vm.inValidBulkPriceUpdate[i].EcapPrice.toString() + '",'
                    }

                    if (vm.inValidBulkPriceUpdate[i].Volume !== "") {
                        data += '"Volume": "' + vm.inValidBulkPriceUpdate[i].Volume.toString() + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].DealStartDate !== "") {
                        data += '"DealStartDate": "' + moment(vm.inValidBulkPriceUpdate[i].DealStartDate.toString()).format("MM/DD/YYYY") + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].DealEndDate !== "") {
                        data += '"DealEndDate": "' + moment(vm.inValidBulkPriceUpdate[i].DealEndDate.toString()).format("MM/DD/YYYY") + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].ProjectName !== "") {
                        data += '"ProjectName": "' + vm.inValidBulkPriceUpdate[i].ProjectName.toString() + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].BillingsStartDate !== "") {
                        data += '"BillingsStartDate": "' + moment(vm.inValidBulkPriceUpdate[i].BillingsStartDate.toString()).format("MM/DD/YYYY") + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].BillingsEndDate !== "") {
                        data += '"BillingsEndDate": "' + moment(vm.inValidBulkPriceUpdate[i].BillingsEndDate.toString()).format("MM/DD/YYYY") + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate !== "") {
                        data += '"TrackerEffectiveStartDate": "' + moment(vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate.toString()).format("MM/DD/YYYY") + '",'
                    }
                    if (vm.inValidBulkPriceUpdate[i].AdditionalTermsAndConditions !== "") {
                        data += '"AdditionalTermsAndConditions": "' + vm.inValidBulkPriceUpdate[i].AdditionalTermsAndConditions.toString() + '",'
                    }

                    data += '},'
                }
                data += "]}";


                bulkPriceUpdateService.UpdatePriceRecord(data)
                    .then(function (response) {
                        //vm.inValidBulkPriceUpdate = response.data.BulkPriceUpdateRecord.filter(x => x.ValidationMessages !== null && x.ValidationMessages !== undefined && x.ValidationMessages !== "");
                        let processrecord = response.data.BulkPriceUpdateRecord.filter(x => x.ValidationMessages !== undefined && (x.ValidationMessages == null || x.ValidationMessages == ""));
                        if (processrecord !== undefined && vm.inValidBulkPriceUpdate !== undefined && vm.inValidBulkPriceUpdate.length > 0 && processrecord.length > 0) {
                            vm.inValidBulkPriceUpdate = vm.ValidateDateColumns(response.data.BulkPriceUpdateRecord);
                            vm.LoadDataToSpreadsheet()

                        }
                        else if (vm.inValidBulkPriceUpdate !== undefined && vm.inValidBulkPriceUpdate.length > 0) {
                            vm.inValidBulkPriceUpdate = vm.ValidateDateColumns(response.data.BulkPriceUpdateRecord);
                            vm.LoadDataToSpreadsheet()
                        }
                        else {
                            vm.inValidBulkPriceUpdate = vm.ValidateDateColumns(response.data.BulkPriceUpdateRecord);
                            vm.LoadDataToSpreadsheet()
                        }

                    }, function (response) {
                        logger.error("Unable to execute Price Record Updates.", response, response.statusText);
                    });
            } else {
                kendo.alert("There is no data to Process");
            }
        }

        vm.generateDeals = function () {
            var sheet = vm.spreadsheet.activeSheet();
            var count = 0;

            
            vm.inValidBulkPriceUpdate = [];
            var tempRange = sheet.range("A1:K" + vm.SpreadSheetRowsCount).values().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null && x[6] == null && x[7] == null && x[8] == null && x[9] == null && x[10] == null && x[11] == null));
            if (tempRange.length > 0) {
                vm.spinnerMessageDescription = "Please wait while reading Unification data..";
                for (var i = 0; i < tempRange.length; i++) {
                    var newDeals = {};
                    newDeals.DealId = tempRange[i][0] != null ? ($.isNumeric(tempRange[i][0]) && parseInt(tempRange[i][0]) > 0 ? tempRange[i][0] : 0) : 0;
                    newDeals.DealDesc = tempRange[i][1] != null ? tempRange[i][1] : "";
                    newDeals.EcapPrice = tempRange[i][2] != null ? tempRange[i][2] : "";
                    newDeals.Volume = tempRange[i][3] != null ? tempRange[i][3] : "";
                    if (tempRange[i][4] != null && tempRange[i][4] != "") {
                        newDeals.DealStartDate = Number(tempRange[i][4]).toString() == 'NaN' ? tempRange[i][4] : moment(vm.basedate).add(parseInt(tempRange[i][4]), 'days').format("MM/DD/YYYY");
                    } else {
                        newDeals.DealStartDate = "";
                    }
                   
                    if (tempRange[i][5] != null && tempRange[i][5] != "" ) {
                        newDeals.DealEndDate = Number(tempRange[i][5]).toString() == 'NaN' ? tempRange[i][5] : moment(vm.basedate).add(parseInt(tempRange[i][5]), 'days').format("MM/DD/YYYY");
                    } else {
                        newDeals.DealEndDate = "";
                    }
                    
                    if (tempRange[i][6] != null && tempRange[i][6] != "") {
                        newDeals.BillingsStartDate = Number(tempRange[i][6]).toString() == 'NaN' ? tempRange[i][6] : moment(vm.basedate).add(parseInt(tempRange[i][6]), 'days').format("MM/DD/YYYY");
                    } else {
                        newDeals.BillingsStartDate = "";
                    }

                    
                    if (tempRange[i][7] != null && tempRange[i][7]!= "") {
                        newDeals.BillingsEndDate = Number(tempRange[i][7]).toString() == 'NaN' ? tempRange[i][7] : moment(vm.basedate).add(parseInt(tempRange[i][7]), 'days').format("MM/DD/YYYY");
                    } else {
                        newDeals.BillingsEndDate = "";
                    }
                    newDeals.ProjectName = tempRange[i][8] != null ? tempRange[i][8].trimEnd() : "";
                    
                    if (tempRange[i][9] != null && tempRange[i][9] != "") {
                        newDeals.TrackerEffectiveStartDate = Number(tempRange[i][9]).toString() == 'NaN' ? tempRange[i][9] : moment(vm.basedate).add(parseInt(tempRange[i][9]), 'days').format("MM/DD/YYYY");
                    } else {
                        newDeals.TrackerEffectiveStartDate = "";
                    }
                    newDeals.AdditionalTermsAndConditions = tempRange[i][10] != null ? tempRange[i][10].trimEnd() : "";
                    vm.inValidBulkPriceUpdate.push(newDeals);
                }
            }
        }

        $scope.setBusy = function (msg, detail, msgType, isShowFunFact) {
            var newState = msg != undefined && msg !== "";
            isShowFunFact = true; // Always show fun fact
            // if no change in state, simple update the text
            if ($scope.isBusy === newState) {
                $scope.isBusyMsgTitle = msg;
                $scope.isBusyMsgDetail = !detail ? "" : detail;
                $scope.isBusyType = msgType;
                $scope.isBusyShowFunFact = isShowFunFact;
                return;
            }

            $scope.isBusy = newState;
            if ($scope.isBusy) {
                $scope.isBusyMsgTitle = msg;
                $scope.isBusyMsgDetail = !detail ? "" : detail;
                $scope.isBusyType = msgType;
                $scope.isBusyShowFunFact = isShowFunFact;
            } else {
                $timeout(function () {
                    $scope.isBusyMsgTitle = msg;
                    $scope.isBusyMsgDetail = !detail ? "" : detail;
                    $scope.isBusyType = msgType;
                    $scope.isBusyShowFunFact = isShowFunFact;
                }, 100);
            }
        }

        vm.SpreadSheetOptions = {
            change: function (arg) {
                vm.IsSpreadSheetEdited = true;
            }
        };

        vm.sheets = [{ name: "Sheet1" }];
        $scope.$on("kendoWidgetCreated", function (event, widget) {
            if (widget === vm.spreadsheet) {
                var sheets = vm.spreadsheet.sheets();
                var index = 0;
                vm.spreadsheet.activeSheet(sheets[0]);
                var sheet = vm.spreadsheet.activeSheet();
                sheet.columnWidth(0, 100);
                sheet.columnWidth(1, 130);
                sheet.columnWidth(2, 100);
                sheet.columnWidth(3, 100);
                sheet.columnWidth(4, 100);
                sheet.columnWidth(5, 100);
                sheet.columnWidth(6, 100);
                sheet.columnWidth(7, 100);
                sheet.columnWidth(8, 100);
                sheet.columnWidth(9, 130);
                sheet.columnWidth(10, 100);
                sheet.columnWidth(11, 100);
                sheet.columnWidth(12, 100);
                sheet.columnWidth(13, 240);
                index = 14;


                for (var i = index; i < 50; i++)
                    sheet.hideColumn(i);
                vm.LoadDataToSpreadsheet();
                vm.ValidateSheet();

            }
        });

        vm.ValidateDateColumns = function (returnData) {
            var DealDate;
            for (var i = 0; i < returnData.length; i++) {
                DealDate = moment(returnData[i].DealStartDate).format("MM/DD/YYYY");
                if (moment(DealDate, "MM/DD/YYYY", true).isValid())
                    returnData[i].DealStartDate = DealDate;

                DealDate = moment(returnData[i].DealEndDate).format("MM/DD/YYYY");
                if (moment(DealDate, "MM/DD/YYYY", true).isValid())
                    returnData[i].DealEndDate = DealDate;

                DealDate = moment(returnData[i].BillingsStartDate).format("MM/DD/YYYY");
                if (moment(DealDate, "MM/DD/YYYY", true).isValid())
                    returnData[i].BillingsStartDate = DealDate;

                DealDate = moment(returnData[i].BillingsEndDate).format("MM/DD/YYYY");
                if (moment(DealDate, "MM/DD/YYYY", true).isValid())
                    returnData[i].BillingsEndDate = DealDate;

                DealDate = moment(returnData[i].TrackerEffectiveStartDate).format("MM/DD/YYYY");
                if (moment(DealDate, "MM/DD/YYYY", true).isValid())
                    returnData[i].TrackerEffectiveStartDate = DealDate;
            }

            return returnData;
        }

        vm.LoadDataToSpreadsheet = function () {

            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[0]).find("div").html("Deal ID");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[2]).find("div").html("Deal Description");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[4]).find("div").html("ECAP Price");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[6]).find("div").html("Ceiling Volume");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[8]).find("div").html("Deal Start Date");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[10]).find("div").html("Deal End Date");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[12]).find("div").html("Billings Start Date");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[14]).find("div").html("Billings End Date");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[16]).find("div").html("Project Name");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[18]).find("div").html("Tracker Effective Date");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[20]).find("div").html("Additional Terms");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[22]).find("div").html("Deal stage");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[24]).find("div").html("Update Status");
            $($("#spreadsheetBulkPriceupdate .k-spreadsheet-column-header").find("div")[26]).find("div").html("Error Messages");


            var sheet = vm.spreadsheet.activeSheet();
            sheet.range(kendo.spreadsheet.SHEETREF).clear();
            sheet.range("L1:N" + vm.SpreadSheetRowsCount).wrap(true);
            
            sheet.setDataSource(vm.inValidBulkPriceUpdate, ["DealId", "DealDesc", "EcapPrice", "Volume", "DealStartDate", "DealEndDate", "BillingsStartDate", "BillingsEndDate", "ProjectName", "TrackerEffectiveStartDate", "AdditionalTermsAndConditions", "DealStage", "UpdateStatus", "ValidationMessages"]);

            //Auto header will be created as 1st row. This is not actual data
            sheet.deleteRow(0);
            vm.SpreadSheetRowsCount = 100;
            //For Disable column
            //sheet.range("L1:N").enable(false);
            sheet.batch(function () {
                for (var i = 0; i < vm.inValidBulkPriceUpdate.length; i++) {
                    if (vm.inValidBulkPriceUpdate[i].ValidationMessages !== undefined && vm.inValidBulkPriceUpdate[i].ValidationMessages !== null && vm.inValidBulkPriceUpdate[i].ValidationMessages !== "") {
                        var lengthOfMsg = vm.inValidBulkPriceUpdate[i].ValidationMessages.length;
                        var height = 1;
                        if (Math.ceil(lengthOfMsg / 40) > 1)
                            height = height + Math.ceil(lengthOfMsg / 40) - 1;
                        var rowht = height > 1 ? (height) * 15 : 30;
                        sheet.rowHeight(i, rowht);
                        sheet.range("N" + (i + 1)).verticalAlign("top");
                        sheet.range("N" + (i + 1)).background("#eeeeee").color("#ff0000"); //red
                    }
                    if (vm.inValidBulkPriceUpdate[i].UpdateStatus !== undefined && vm.inValidBulkPriceUpdate[i].UpdateStatus !== null && vm.inValidBulkPriceUpdate[i].UpdateStatus !== "") {
                        sheet.range("M" + (i + 1)).background("#eeeeee").color("#008000"); //Green

                    }
                }
            });
            sheet.range("L:N").background("#eeeeee");
            sheet._rows._count = vm.SpreadSheetRowsCount;

        }

        vm.ValidateSheet = function (action) {
            var sheet = vm.spreadsheet.activeSheet();
            sheet.range("A1:H" + vm.SpreadSheetRowsCount).validation($scope.UnifiedDealValidation(false, "", true))
            var strAlertMessage = "";
            var row = "";
            var mandatory = [];
            mandatory = [];
            vm.count = 0
            sheet.batch(function () {
                for (var i = 0; i < vm.inValidBulkPriceUpdate.length; i++) {
                    row = i + 1;
                    var rowMsg = "";
                    mandatory = [];


                    if (vm.inValidBulkPriceUpdate[i].DealId == "0") {
                        mandatory.push("Deal ID");
                        sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }

                    if ((vm.inValidBulkPriceUpdate[i].DealDesc == null || vm.inValidBulkPriceUpdate[i].DealDesc == "") &&
                        (vm.inValidBulkPriceUpdate[i].EcapPrice == null || vm.inValidBulkPriceUpdate[i].EcapPrice == "") &&
                        (vm.inValidBulkPriceUpdate[i].Volume == null || vm.inValidBulkPriceUpdate[i].Volume == "") &&
                        (vm.inValidBulkPriceUpdate[i].ProjectName == null || vm.inValidBulkPriceUpdate[i].ProjectName == "") &&
                        (vm.inValidBulkPriceUpdate[i].DealStartDate == null || vm.inValidBulkPriceUpdate[i].DealStartDate == "") &&
                        (vm.inValidBulkPriceUpdate[i].DealEndDate == null || vm.inValidBulkPriceUpdate[i].DealEndDate == "") &&
                        (vm.inValidBulkPriceUpdate[i].BillingsStartDate == null || vm.inValidBulkPriceUpdate[i].BillingsStartDate == "") &&
                        (vm.inValidBulkPriceUpdate[i].BillingsEndDate == null || vm.inValidBulkPriceUpdate[i].BillingsEndDate == "") &&
                        (vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate == null || vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate == "") &&
                        (vm.inValidBulkPriceUpdate[i].AdditionalTermsAndConditions == null || vm.inValidBulkPriceUpdate[i].AdditionalTermsAndConditions == "")) {
                        mandatory.push("One of the Deal");
                        sheet.range("B" + row + ":K" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }


                    if (mandatory.length > 0) {
                        rowMsg = rowMsg + mandatory.join(", ") + " is a mandatory field|";
                    }

                    if (vm.inValidBulkPriceUpdate[i].DealId !== "0" || vm.inValidBulkPriceUpdate[i].DealId !== "") {
                        if (Number(vm.inValidBulkPriceUpdate[i].DealId).toString() == 'NaN') {
                            rowMsg = rowMsg + "Deal ID must be a valid number|";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        else if (!Number.isInteger(Number(vm.inValidBulkPriceUpdate[i].DealId))) {
                            rowMsg = rowMsg + "Deal ID must be a valid number|";
                            sheet.range("A" + row + ":A" + row).validation($scope.UnifiedDealValidation(true, '', false));                            
                        }
                    }
                    if (vm.inValidBulkPriceUpdate[i].EcapPrice !== "0" && vm.inValidBulkPriceUpdate[i].EcapPrice !== '') {
                        if (Number(vm.inValidBulkPriceUpdate[i].EcapPrice).toString() == 'NaN') {
                            rowMsg = rowMsg + "ECAP Price must be valid number|";
                            sheet.range("C" + row + ":C" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }
                    if (vm.inValidBulkPriceUpdate[i].Volume !== "0" && vm.inValidBulkPriceUpdate[i].Volume !== '') {
                        if (Number(vm.inValidBulkPriceUpdate[i].Volume).toString() == 'NaN') {
                            rowMsg = rowMsg + "Ceiling Volume must be a valid non-decimal number. |";
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                        else if (!Number.isInteger(Number(vm.inValidBulkPriceUpdate[i].Volume))) {
                            rowMsg = rowMsg + "Ceiling Volume must be a valid non-decimal number. |";
                            sheet.range("D" + row + ":D" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }

                    if (vm.inValidBulkPriceUpdate[i].DealStartDate !== '') {
                        var DealStartDate = moment(vm.inValidBulkPriceUpdate[i].DealStartDate).format("MM/DD/YYYY");
                        if (!moment(DealStartDate, "MM/DD/YYYY", true).isValid()) {
                            rowMsg = rowMsg + "Deal Start Date must be in ''MM/DD/YYYY'' format|";
                            sheet.range("E" + row + ":E" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }

                    if (vm.inValidBulkPriceUpdate[i].DealEndDate !== '') {
                        var DealEndDate = moment(vm.inValidBulkPriceUpdate[i].DealEndDate).format("MM/DD/YYYY");
                        if (!moment(DealEndDate, "MM/DD/YYYY", true).isValid()) {
                            rowMsg = rowMsg + "Deal End Date must be in ''MM/DD/YYYY'' format|";
                            sheet.range("F" + row + ":F" + row).validation($scope.UnifiedDealValidation(true, '', false));
                        }
                    }


                    if (vm.inValidBulkPriceUpdate[i].BillingsStartDate !== '' && !moment(vm.inValidBulkPriceUpdate[i].BillingsStartDate, "MM/DD/YYYY", true).isValid()) {
                        rowMsg = rowMsg + "Billing StartDate must be in ''MM/DD/YYYY'' format|";
                        sheet.range("G" + row + ":G" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }

                    if (vm.inValidBulkPriceUpdate[i].BillingsEndDate !== '' && !moment(vm.inValidBulkPriceUpdate[i].BillingsEndDate, "MM/DD/YYYY", true).isValid()) {
                        rowMsg = rowMsg + "Billing End Date must be in ''MM/DD/YYYY'' format|";
                        sheet.range("H" + row + ":H" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }

                    if (vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate !== '' && !moment(vm.inValidBulkPriceUpdate[i].TrackerEffectiveStartDate, "MM/DD/YYYY", true).isValid()) {
                        rowMsg = rowMsg + "Tracker Effective Start Date must be in ''MM/DD/YYYY'' format|";
                        sheet.range("J" + row + ":J" + row).validation($scope.UnifiedDealValidation(true, '', false));
                    }

                    if (rowMsg != '') {
                        vm.count += 1;
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
                        sheet.range("N" + row).value(msg);
                        sheet.range("N" + row).verticalAlign("top");
                        sheet.range("N" + row).color("#ff0000"); //red
                    }
                }
            });
            vm.IsSpreadSheetEdited = false;
        }

        $scope.UnifiedDealValidation = function (isError, msg, isReq) {
            return {
                dataType: "custom",
                from: !isError,
                allowNulls: isReq,
                messageTemplate: msg
            };
        };
    }
})();