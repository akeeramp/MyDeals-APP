import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { ThemePalette } from "@angular/material/core";
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { unifiedDealReconService } from './admin.unifiedDealRecon.service';

@Component({
    selector: "bulk-unify-deals",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.bulkUnifyModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class bulkUnifyModalComponent {
    SpreadSheetRowsCount: any;
    dealReconValidationSummary: any;
    tableData: any[] = [];
    unifiedVal: any;

    constructor(public dialogRef: MatDialogRef<bulkUnifyModalComponent>, private loggerSvc: logger,
        @Inject(MAT_DIALOG_DATA) public data, private unifiedDealSvc: unifiedDealReconService) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    public cellMessages = [];
    private color: ThemePalette = 'primary';
    public isBulkUnify = true;
    public screenTitle = "Bulk Unify - Deals";
    public fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
    private uploadSaveUrl: any = "/FileAttachments/ExtractBulkUnifyFile";
    private hotRegisterer = new HotTableRegisterer();
    private hotId = "spreadsheet";
    private hotTable: Handsontable;
    private files: any = [];
    private uploadSuccess: boolean = false;
    private isAlert: boolean = false;
    private alertMsg: string = "";
    private inValidUnifyDeals = [];
    private validUnifyDeals: any = [];
    private UnifyValidation: any;
    public invalidRPLStatusCode = [];
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        colHeaders: this.getColHeaders(),
        autoWrapCol: true,
        minRows: 1,
        rowHeaderWidth: 20,
        columns: this.getColumns(),
        rowHeaders: true,
        copyPaste: true,
        comments: true,
        manualColumnResize: true,
        licenseKey: "8cab5-12f1d-9a900-04238-a4819",
    };

    myRestrictions: FileRestrictions = {
        allowedExtensions: ["xlsx"],
    };

    successEventHandler(e) {
        this.uploadSuccess = true;
        this.hotSettings.colHeaders = this.getColHeaders();
        this.hotSettings.columns = this.getColumns();
        if (this.isBulkUnify) {
            this.UnifyValidation = e.response.body;
            if (this.UnifyValidation == '') {
                this.isAlert = true;
                this.alertMsg = 'There is no Unify Data in the file to upload!';
            } else {
                this.generateTableData()
            }
        }
        else {
            this.dealReconValidationSummary = e.response.body;
            if (this.dealReconValidationSummary == '') {
                this.isAlert = true;
                this.alertMsg = 'There is no Deal Recon Data in the file to upload!';
            }
            else {
                this.generateTableData();
            }
        }
    }

    generateTableData() {
        this.tableData = [];
        //for Bulk unify files
        if (this.isBulkUnify) {
            if (this.UnifyValidation.InValidUnifyDeals.length > 0)
                this.UnifyValidation.InValidUnifyDeals.forEach((row) => {
                    if (row.RPL_STS_CODE != undefined) row.RPL_STS_CODE = row.RPL_STS_CODE.toUpperCase();
                    this.tableData.push(row)
                });
            if (this.UnifyValidation.ValidUnifyDeals.length > 0)
                this.UnifyValidation.ValidUnifyDeals.forEach((row) => {
                    if (row.RPL_STS_CODE != undefined) row.RPL_STS_CODE = row.RPL_STS_CODE.toUpperCase();
                    this.tableData.push(row)
                })
            //setting a delay for hotTable to populate the tabledata
            setTimeout(() => {
                this.hotTable = this.hotRegisterer.getInstance(this.hotId);
                this.validateBulkData();
            }, 100);
        } else { // for deal recon files
            if (this.dealReconValidationSummary.validRecords.length > 0) {
                this.dealReconValidationSummary.validRecords.forEach((row) => {
                    if (row.Rpl_Status_Code != undefined) row.Rpl_Status_Code = row.Rpl_Status_Code.toUpperCase();
                    this.tableData.push(row)
                })
            }
            if (this.dealReconValidationSummary.inValidRecords.length > 0)
                this.dealReconValidationSummary.inValidRecords.forEach((row) => {
                    if (row.Rpl_Status_Code != undefined) row.Rpl_Status_Code = row.Rpl_Status_Code.toUpperCase();
                    this.tableData.push(row)
                });
            //setting a delay for hotTable to populate the tabledata
            setTimeout(() => {
                this.hotTable = this.hotRegisterer.getInstance(this.hotId);
                this.validateDealRecon();
            }, 100);
        }

    }

    setErrorCell(rowInd, colInd) {//setting error cell
        this.hotTable.setCellMetaObject(rowInd, colInd, { 'className': 'error-product error-cell', comment: { value: '' } });
    }

    validateDealRecon() {
        let rowMsgs = [];
        if (this.dealReconValidationSummary.inValidRecords.length > 0) {
            for (let i = 0; i < this.dealReconValidationSummary.inValidRecords.length; i++) {
                let alertMsg = "";
                let mandatory = [];
                //for finding empty or invalid cells
                if (this.dealReconValidationSummary.inValidRecords[i].Deal_ID == "0") {
                    mandatory.push("Deal ID");
                    this.setErrorCell(i, 0);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID == "0") {
                    mandatory.push("Unified Customer ID");
                    this.setErrorCell(i, 1);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name == null || this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name == "") {
                    mandatory.push("Unified Customer Name");
                    this.setErrorCell(i, 2);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID == "0") {

                    mandatory.push("Country Region Customer ID");
                    this.setErrorCell(i, 3);

                }
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region == null || this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region == "") {

                    mandatory.push("Unified Country Region");
                    this.setErrorCell(i, 4);

                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID == "0") {
                    mandatory.push("To be Unified Customer ID");
                    this.setErrorCell(i, 5);

                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name == null || this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name == "") {
                    mandatory.push("To be Unified Customer Name");
                    this.setErrorCell(i, 6);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID == "0") {
                    mandatory.push("To be Country Region Customer ID");
                    this.setErrorCell(i, 7);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region == null || this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region == "") {
                    mandatory.push("To be Unified Country Region");
                    this.setErrorCell(i, 8);
                }
                if (mandatory.length > 0) {
                    alertMsg += '•' + mandatory.join(", ") + " is a mandatory field" + '\n'; 
                }
                //Other Validations
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name != null && this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name != "") {
                    if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name.toLowerCase() == "any") {
                        alertMsg = alertMsg + '•' + "'ANY' cannot be used as Unified Customer Name" + '\n';
                        this.setErrorCell(i, 2);
                    }
                    if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name.toLowerCase() == "null") {
                        alertMsg = alertMsg + '•' + "NULL cannot be used as Unified Customer Name" + '\n';
                        this.setErrorCell(i, 2);
                    }
                    //var patt = new RegExp("^[\\w\\s.,:'\&+-/]*$");
                    //var res = patt.test(this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name);
                    //if (!res) {
                    //    alertMsg = alertMsg + '•' + "Unified Customer Name contains invalid characters" + '\n';
                    //    this.setErrorCell(i, 2);
                    //}
                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name != null && this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name != "") {
                    if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name.toLowerCase() == "any") {
                        alertMsg = alertMsg + '•' + "'ANY' cannot be used as 'To Be Unified Customer Name'" + '\n';
                        this.setErrorCell(i, 6);
                    }
                    if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name.toLowerCase() == "null") {
                        alertMsg = alertMsg + '•' + "NULL cannot be used as 'To Be Unified Customer Name'" + '\n';
                        this.setErrorCell(i, 6);
                    }
                    var patt = new RegExp("^[\\w\\s.,:'\&+-/]*$");
                    var res = patt.test(this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name);
                    if (!res) {
                        alertMsg = alertMsg + '•' + "'To Be Unified Customer Name' contains invalid characters" + '\n';
                        this.setErrorCell(i, 6);
                    }

                }
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID != 0
                    && this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID != 0 &&
                    this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID == this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID) {
                    alertMsg = alertMsg + '•' + "Unified Customer ID and Country/Region Customer ID cannot be same" + '\n';
                    this.setErrorCell(i, 1);
                    this.setErrorCell(i, 3);
                }
                if (this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID != 0
                    && this.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID != 0 &&
                    this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID == this.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID) {
                    alertMsg = alertMsg + '•' + "'To Be Unified Customer ID' and 'To Be Country/Region Customer ID' cannot be same" + '\n';
                    this.setErrorCell(i, 7);
                    this.setErrorCell(i, 5);
                }
                if (this.dealReconValidationSummary.invalidCountries.length > 0) {
                    if (this.dealReconValidationSummary.toBeInvalidCountries.includes(this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region.toLowerCase())) {
                        alertMsg = alertMsg + '•' + "Unified Country/Region does not exist in My Deals" + '\n';
                        this.setErrorCell(i, 4);
                    }
                }
                if (this.dealReconValidationSummary.toBeInvalidCountries.length > 0) { 
                    if (this.dealReconValidationSummary.toBeInvalidCountries.includes(this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region.toLowerCase())) {
                        alertMsg = alertMsg + '•' + "'To Be Unified Country/Region' does not exist in My Deals" + '\n';
                        this.setErrorCell(i, 8);
                    }
                }
                if (this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region != "" && this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region != "" &&
                    this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region.toLowerCase() != this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region.toLowerCase()) {
                    alertMsg = alertMsg + '•' + "Unified Country/Region and 'To Be Unified Country/Region' needs to be same" + '\n';
                    this.setErrorCell(i, 4);
                    this.setErrorCell(i, 8);
                }
                var validRows = this.dealReconValidationSummary.inValidRecords.filter(x => x.Deal_ID != 0 && x.Unified_Customer_ID != 0 && x.Unified_Customer_Name != "" && x.Country_Region_Customer_ID != 0 && x.Unified_Country_Region != "");
                if (this.dealReconValidationSummary.duplicateDealCombination.length > 0) {//
                    if (this.dealReconValidationSummary.duplicateDealCombination.includes(this.dealReconValidationSummary.inValidRecords[i].Deal_ID)
                        && validRows.filter(x => x.Deal_ID == this.dealReconValidationSummary.inValidRecords[i].Deal_ID
                            && x.Unified_Customer_ID == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                            && x.Unified_Customer_Name == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                            && x.Country_Region_Customer_ID == this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID
                            && x.Unified_Country_Region == this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region).length > 1) {
                        alertMsg = alertMsg + '•' + "Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region" + '\n';
                        this.setErrorCell(i, 0);
                    }
                }
                if (this.dealReconValidationSummary.duplicateCustIds.length > 0) {//
                    if (this.dealReconValidationSummary.duplicateCustIds.includes(this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID)) {
                        alertMsg = alertMsg + '•' + "Same Unified Customer ID cannot be associated with multiple Unified Customer Names" + '\n';
                        this.setErrorCell(i, 1);
                    }
                }
                if (this.dealReconValidationSummary.duplicateCustNames.length > 0) {//
                    if (this.dealReconValidationSummary.duplicateCustNames.includes(this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name)) {
                        alertMsg = alertMsg + '•' + "Same Unified Customer Name cannot be associated with multiple Unified Customer IDs" + '\n';
                        this.setErrorCell(i, 2);
                    }
                }
                if (this.dealReconValidationSummary.duplicateCtryIds.length > 0) {
                    if (this.dealReconValidationSummary.duplicateCtryIds.filter(x => x.cust_Id == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                        && x.cust_Nm == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                        && x.ctry_Id == this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID).length > 0) {
                        alertMsg = alertMsg + '•' + "Same Country/Region Customer ID cannot be associated with multiple Unified Country/Regions" + '\n';
                        this.setErrorCell(i, 3);//Country/Region Customer ID error
                    }
                }
                if (this.dealReconValidationSummary.duplicateCtryNms.length > 0) {
                    if (this.dealReconValidationSummary.duplicateCtryNms.filter(x => x.cust_Id == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_ID
                        && x.cust_Nm == this.dealReconValidationSummary.inValidRecords[i].Unified_Customer_Name
                        && x.ctry_Nm == this.dealReconValidationSummary.inValidRecords[i].Unified_Country_Region
                        && x.ctry_Id == this.dealReconValidationSummary.inValidRecords[i].Country_Region_Customer_ID).length > 0) {
                        alertMsg = alertMsg + '•' + "Same Unified Country/Regions cannot be associated with multiple Country/Region Customer ID" + '\n';
                        this.setErrorCell(i, 4);//Unified Country/Regions error
                    }
                }
                if (this.dealReconValidationSummary.duplicateToBeCustIds.length > 0) {//
                    if (this.dealReconValidationSummary.duplicateToBeCustIds.includes(this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID)) {
                        alertMsg = alertMsg + '•' + "Same 'To Be Unified Customer ID' cannot be associated with multiple 'To Be Unified Customer Names'" + '\n';
                        this.setErrorCell(i, 5);
                    }
                }
                if (this.dealReconValidationSummary.duplicateToBeCustNames.length > 0) {
                    if (this.dealReconValidationSummary.duplicateToBeCustNames.includes(this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name)) {
                        alertMsg = alertMsg + '•' + "Same 'To Be Unified Customer Name' cannot be associated with multiple 'To Be Unified Customer IDs'" + '\n';
                        this.setErrorCell(i, 6);//To Be Unified Customer Name error
                    }
                }
                if (this.dealReconValidationSummary.duplicateToBeCtryIds.length > 0) {
                    if (this.dealReconValidationSummary.duplicateToBeCtryIds.filter(x => x.cust_Id == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID
                        && x.cust_Nm == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name
                        && x.ctry_Nm == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region
                        && x.ctry_Id == this.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID).length > 0) {
                        alertMsg = alertMsg + '•' + "Same 'To Be Country/Region Customer ID' cannot be associated with multiple 'To Be Unified Country/Region'" + '\n';
                        this.setErrorCell(i, 7);//To Be Country/Region Customer ID error
                    }
                }
                if (this.dealReconValidationSummary.duplicateToBeCtryNms.length > 0) {
                    if (this.dealReconValidationSummary.duplicateToBeCtryNms.filter(x => x.cust_Id == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_ID
                        && x.cust_Nm == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Customer_Name
                        && x.ctry_Nm == this.dealReconValidationSummary.inValidRecords[i].To_be_Unified_Country_Region
                        && x.ctry_Id == this.dealReconValidationSummary.inValidRecords[i].To_be_Country_Region_Customer_ID).length > 0) {
                        alertMsg = alertMsg + '•' + "Same 'To Be Unified Country/Region' cannot be associated with multiple 'To Be Country/Region Customer ID'" + '\n';
                        this.setErrorCell(i, 8);//To Be Unified Country/Region error
                    }
                }
                var RPLStsCodepattern = new RegExp("^[A-Za-z\\s,]*$");
                var isValidRPLSTSCode = RPLStsCodepattern.test(this.dealReconValidationSummary.inValidRecords[i].Rpl_Status_Code);
                if (!isValidRPLSTSCode) {
                    alertMsg = alertMsg + '•' +"The RPL Status code contains invalid characters. Please remove spaces and special characters." + '\n';
                    this.setErrorCell(i, 9);//rpl status error
                }
                else if (this.dealReconValidationSummary.invalidRplStatusCodes.length > 0) {
                    if (this.dealReconValidationSummary.invalidRplStatusCodes.includes(this.dealReconValidationSummary.inValidRecords[i].Rpl_Status_Code)) {
                        alertMsg = alertMsg + '•' + "Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code." + '\n';
                        this.setErrorCell(i, 9);//rpl status error
                    }
                }
                
                if (alertMsg != '') {
                    //setting the error messages in error messages cell in hottable
                    this.hotTable.setDataAtCell(i, 10, alertMsg);
                    let alert = alertMsg.split("\n");//for setting error messages in kendo dialog
                    alert.forEach((row) => {
                        //to remove duplicate and empty messages from displaying in kendo dialog box (revisit the logic - need to modify .split("\n"))
                        if (row != '' && !(rowMsgs.includes(row)))
                            rowMsgs.push(row);
                    });
                }
            }
            if (rowMsgs.length > 0) {//displaying error messages
                this.isAlert = true;
                this.alertMsg = "<b>The highlighted row(s) in the excel have not been updated in the MyDeals because of the following error(s).</b></br>" + rowMsgs.join("</br>");
            } else {
                // if no error then populating data into validRecords and updating
                this.dealReconValidationSummary.inValidRecords.forEach((row) => {
                    this.dealReconValidationSummary.validRecords.push(row);
                });
                this.dealReconValidationSummary.inValidRecords = [];
                this.updateDealRecon();
            }
        } else {
            // if no error and has valid records then updating the deal recon 
            if (this.dealReconValidationSummary.inValidRecords.length == 0 && this.dealReconValidationSummary.validRecords.length > 0) {
                this.updateDealRecon()
            }
        }
    }

    updateDealRecon() {
        //dealrecon updation
        this.unifiedDealSvc.updateDealRecon(this.dealReconValidationSummary.validRecords).subscribe((response) => {
            if (response == null || response.length == 0) {
                this.isAlert = true;
                this.alertMsg = "Updated Successfully"
                this.dealReconValidationSummary = [];
            }
            else {
                this.dealReconValidationSummary = [];
                this.dealReconValidationSummary.validRecords = [];
                this.dealReconValidationSummary.inValidRecords = response;
                this.generateTableData();
            }
        }, (response) => {
            this.loggerSvc.error('Operation failed', '');
        });

    }

    ValidateUnifyDeals() {
        //On click of save and validate button
        if (this.isBulkUnify) {
            this.tableData.forEach((row, rowInd) => {
                for (let i = 0; i < ExcelColumnsConfig.bulkUnifyColumns.length; i++)//removing all the cell comments 
                    this.hotTable.setCellMetaObject(rowInd, i, { 'className': 'normal-cell', comment: { value: '' } });
            })
            if (this.tableData.length > 0) {
                //validating
                this.unifiedDealSvc.ValidateUnifyDeals(this.tableData).subscribe((response) => {
                    this.UnifyValidation = response;
                    this.generateTableData();
                }, (response) => {
                    this.loggerSvc.error('Operation failed', '');
                });
            } else {
                this.isAlert = true;
                this.alertMsg = "There is no data to validate";
            }
        }
        else {
            this.tableData.forEach((row, rowInd) => {
                for (let i = 0; i < ExcelColumnsConfig.DealReconColumns.length; i++)
                    this.hotTable.setCellMetaObject(rowInd, i, { 'className': 'normal-cell', comment: { value: '' } });
            })
            if (this.tableData.length > 0) {
                this.unifiedDealSvc.ValidateDealReconRecords(this.dealReconValidationSummary.inValidRecords).subscribe((response) => {
                    this.dealReconValidationSummary = response;
                    this.generateTableData();
                }, (response) => {
                    this.loggerSvc.error('Operation failed', '');
                });
            } else {
                this.isAlert = true;
                this.alertMsg = "There is no data to validate";
            }
        }
    };


    validateBulkData() {
        //validation for bulk unify files
        let rowMsgs = [];
        this.validUnifyDeals = this.UnifyValidation.ValidUnifyDeals;
        this.inValidUnifyDeals = this.UnifyValidation.InValidUnifyDeals;
        if (this.inValidUnifyDeals.length > 0) {
            for (let i = 0; i < this.inValidUnifyDeals.length; i++) {
                let alertMsg = "";
                let mandatory = [];
                if (this.UnifyValidation.IsEmptyDealAvailable) {
                    if (this.inValidUnifyDeals[i].DEAL_ID == "0") {
                        mandatory.push("Deal ID");
                        this.setErrorCell(i, 0);
                    }
                }
                if (this.UnifyValidation.IsEmptyCustIdAvailable) {
                    if (this.inValidUnifyDeals[i].UCD_GLOBAL_ID == "0") {
                        mandatory.push("Unified Customer ID");
                        this.hotTable.setCellMeta(i, 1, 'className', 'normal-product');
                        this.setErrorCell(i, 1);
                    }
                }
                if (this.UnifyValidation.IsEmptyCustNameAvailable) {
                    if (this.inValidUnifyDeals.length != 0 && (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME == null || this.inValidUnifyDeals[i].UCD_GLOBAL_NAME == "")) {
                        mandatory.push("Unified Customer Name");
                        this.setErrorCell(i, 2);
                    }
                }
                if (this.UnifyValidation.IsEmptyCountryIdAvailable) {
                    if (this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID == "0") {
                        mandatory.push("Country/Region Customer ID");
                        this.setErrorCell(i, 3);
                    }
                }
                if (this.UnifyValidation.IsEmptyCountryAvailable) {
                    if ((this.inValidUnifyDeals[i].UCD_COUNTRY == null || this.inValidUnifyDeals[i].UCD_COUNTRY == "")) {
                        mandatory.push("Unified Country/Region");
                        this.setErrorCell(i, 4);
                    }
                }
                if ((this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == undefined || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == null
                    || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == '')) {
                    mandatory.push("End Customer Retail");
                    this.setErrorCell(i, 5);
                }
                if ((this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == undefined || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == null
                    || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == '')) {
                    mandatory.push("End Customer Country/Region");
                    this.setErrorCell(i, 6);
                }
                if (mandatory.length > 0) {

                    alertMsg += '•' + mandatory.join(", ") + " is a mandatory field" + '\n';

                }
                let validRows = this.inValidUnifyDeals.filter(x => x.DEAL_ID != 0 && x.UCD_GLOBAL_ID != 0 && x.UCD_GLOBAL_NAME != "" && x.UCD_COUNTRY_CUST_ID != 0 && x.UCD_COUNTRY != "");

                if (this.UnifyValidation.DuplicateDealCombination.length > 0) {
                    if (this.UnifyValidation.DuplicateDealCombination.includes(this.inValidUnifyDeals[i].DEAL_ID)
                        && validRows.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.UCD_GLOBAL_ID == this.inValidUnifyDeals[i].UCD_GLOBAL_ID && x.UCD_GLOBAL_NAME == this.inValidUnifyDeals[i].UCD_GLOBAL_NAME
                            && x.UCD_COUNTRY_CUST_ID == this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID && x.UCD_COUNTRY == this.inValidUnifyDeals[i].UCD_COUNTRY).length > 1) {
                        alertMsg += '•' + "Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region" + '\n';
                        this.setErrorCell(i, 0);
                    }
                }
                if (this.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                    if (this.UnifyValidation.DuplicateDealCombination.includes(this.inValidUnifyDeals[i].DEAL_ID)
                        && validRows.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL &&
                            x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY).length > 1) {
                        alertMsg += '•' + "Duplicate rows found with same combinations for Deal ID, End Customer Retail and End Customer Country/Region" + '\n';
                        this.setErrorCell(i, 0);
                    }
                }
                if (this.inValidUnifyDeals[i].UCD_GLOBAL_ID != 0 && this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID != 0 && this.inValidUnifyDeals[i].UCD_GLOBAL_ID == this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID) {
                    alertMsg += '•' + "Unified Customer ID and Country/Region Customer ID cannot be same" + '\n';
                    this.setErrorCell(i, 1);
                    this.setErrorCell(i, 3);
                }
                if (this.UnifyValidation.InValidCountries.length > 0) {
                    if (this.UnifyValidation.InValidCountries.includes(this.inValidUnifyDeals[i].UCD_COUNTRY.toLowerCase())) {
                        alertMsg += '•' + "Unified Country/Region does not exist in My Deals" + '\n';
                        this.setErrorCell(i, 4);
                    }
                }

                if (this.inValidUnifyDeals[i].UCD_COUNTRY != "" && this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY != "" &&
                    this.inValidUnifyDeals[i].UCD_COUNTRY.toLowerCase() != this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY.toLowerCase()) {
                    alertMsg += '•' + "Unified Country/Region and End Customer Country/Region needs to be same" + '\n';
                    this.setErrorCell(i, 4);
                    this.setErrorCell(i, 6);
                }

                if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME != null && this.inValidUnifyDeals[i].UCD_GLOBAL_NAME != "") {
                    if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "any") {
                        alertMsg += '•' + "'ANY' cannot be used as Unified Customer Name" + '\n';
                        this.setErrorCell(i, 2);
                    }
                    if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "null") {
                        alertMsg += '•' + "NULL cannot be used as Unified Customer Name" + '\n';
                        this.setErrorCell(i, 2);
                    }
                    let patt = new RegExp("^[\\w\\s.,:'\&+-/]*$");
                    let res = patt.test(this.inValidUnifyDeals[i].UCD_GLOBAL_NAME);
                    if (!res) {
                        alertMsg += '•' + "Unified Customer Name contains invalid characters" + '\n';
                        this.setErrorCell(i, 2);
                    }
                }

                if (this.UnifyValidation.DuplicateGlobalIds.length > 0) {
                    if (this.UnifyValidation.DuplicateGlobalIds.includes(this.inValidUnifyDeals[i].UCD_GLOBAL_ID)) {
                        alertMsg += '•' + "Same Unified Customer ID cannot be associated with multiple Unified Customer Names" + '\n';
                        this.setErrorCell(i, 1);
                    }
                }

                if (this.UnifyValidation.DuplicateGlobalNames.length > 0) {
                    if (this.UnifyValidation.DuplicateGlobalNames.includes(this.inValidUnifyDeals[i].UCD_GLOBAL_NAME)) {
                        alertMsg += '•' + "Same Unified Customer Name cannot be associated with multiple Unified Customer IDs" + '\n';
                        this.setErrorCell(i, 2);
                    }
                }

                if (this.UnifyValidation.AlreadyUnifiedDeals.length > 0) {
                    if (this.UnifyValidation.AlreadyUnifiedDeals.includes(this.inValidUnifyDeals[i].DEAL_ID)) {
                        alertMsg += '•' + "Deal is already Unified" + '\n'
                        this.setErrorCell(i, 0);
                    }
                }

                if (this.UnifyValidation.UnifiedCombination.length > 0) {
                    let index = this.UnifyValidation.UnifiedCombination.findIndex((x) => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                        && x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                    if (index > -1) {
                        alertMsg += '•' + "End Customer Retail and End Customer Country/Region combination for this deal has already been unified" + '\n'
                        this.setErrorCell(i, 5);
                        this.setErrorCell(i, 4);
                    }
                }

                if (this.UnifyValidation.InvalidDeals.length > 0) {
                    if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "count mismatch").length > 0) {
                        alertMsg += '•' + "End Customer - Country/Region combination is not a user entered value in the Deal" + '\n'
                    }
                    else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "not exist").length > 0) {
                        alertMsg += '•' + "Deal ID does not exists in MyDeals" + '\n'
                    }
                    else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "cancelled").length > 0) {
                        alertMsg += '•' + "Deal is in Cancelled Stage and cannot be unified" + '\n'
                    }
                    else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "lost").length > 0) {
                        alertMsg += '•' + "Deal is in Lost Stage and cannot be unified" + '\n'
                    }
                    else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "deal expired").length > 0) {
                        alertMsg += '•' + "Deal is in Expired Stage and cannot be unified" + '\n'
                    }
                    else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "end cust obj not exists").length > 0) {
                        alertMsg += '•' + "Deal is not having all end customer related information" + '\n'
                    }
                    this.setErrorCell(i, 0);
                }

                if (this.UnifyValidation.InValidCombination.length > 0) {
                    let index = this.UnifyValidation.InValidCombination.findIndex((x) => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                        && x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                    if (index > -1) {
                        alertMsg += '•' + "Incorrect values of End Customer Retail and End Customer Country/Region associated with the Deal ID" + '\n'
                        this.setErrorCell(i, 5);
                        this.setErrorCell(i, 6);
                    }
                }
                let RPLStsCodepattern = new RegExp("^[A-Za-z\\s,]*$");
                let isValidRPLSTSCode = RPLStsCodepattern.test(this.inValidUnifyDeals[i].RPL_STS_CODE);
                if (!isValidRPLSTSCode) {
                    alertMsg += '•' + "The RPL Status code contains invalid characters. Please remove spaces and special characters." + '\n';
                    this.setErrorCell(i, 7);
                }
                else if (this.UnifyValidation.InvalidRPLStsCode.length > 0) {
                    if ((this.UnifyValidation.InvalidRPLStsCode.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID).length > 0) && this.inValidUnifyDeals[i].RPL_STS_CODE != "") {
                        alertMsg += '•' + "Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code." + '\n'
                        this.setErrorCell(i, 7);
                    }
                }
                if (alertMsg != '') {
                    //setting alert message in hottable column
                    this.hotTable.setDataAtCell(i, 8, alertMsg);
                    let alert = alertMsg.split("\n");
                    alert.forEach((row) => {
                        // removing duplicates for kendo alert(revisit the logic - need to modify .split("\n"))
                        if (row != '' && !(rowMsgs.includes(row)))
                            rowMsgs.push(row);
                    })
                } 
            }
            if (rowMsgs.length > 0) {
                // displaying kendo alert if error is found
                this.isAlert = true;
                this.alertMsg = "<b>The highlighted row(s) in the excel have not been updated in the MyDeals because of the following error(s).</b></br>" + rowMsgs.join("</br>");
            } else {
                //if no error is found setting data into valid cell and updating
                this.UnifyValidation.InValidUnifyDeals.forEach((row) => {
                    this.UnifyValidation.ValidUnifyDeals.push(row);
                })
                this.UnifyValidation.InValidUnifyDeals = [];
                this.updateBulkUnify();
            }
        } else {
            if (this.UnifyValidation.InValidUnifyDeals.length == 0 && this.UnifyValidation.ValidUnifyDeals.length > 0) {
                this.updateBulkUnify()
            }
        }
    }

    updateBulkUnify() {
        //updation fn
        this.unifiedDealSvc.updateBulkUnifyDeals(this.UnifyValidation.ValidUnifyDeals).subscribe((response) => {
            let data = response;
            this.unifiedVal = data.length;
            let alertMsg;
            if (data != null && data != undefined) {
                let warningmsg = " deal(s) got Unified. Please make ensure all other deals associated to the same pricing table having same End customer Combination"
                let ecapdealdata = data.filter(x => x.COMMENTS == "ECAP Hybrid Deal(s)");
                if (ecapdealdata != undefined && ecapdealdata.length > 0) {
                    this.isAlert = true;
                    this.alertMsg = "Following ECAP hybrid " + ecapdealdata[0].Deal_No + warningmsg;
                }
                let hybDealdata = data.filter(x => x.COMMENTS == "Voltier Hybrid Deal(s)");
                if (hybDealdata != undefined && hybDealdata.length > 0) {
                    this.isAlert = true;
                    this.alertMsg = "Following Vol_Tier hybrid " + hybDealdata[0].Deal_No + warningmsg;
                }
                let dealsHasErrors = data.filter(x => x.COMMENTS == "Deal(s) Cannot be Unified");
                if (data[0].COMMENTS == "Bulk Unified Deal(s)" && dealsHasErrors != undefined && dealsHasErrors.length == 0) {
                    if (data[0].COMMENTS == "Bulk Unified Deal(s)") {
                        alertMsg = "<b>" + data[0].No_Of_Deals + " Deal(s) are successfully unified</b><br/>"
                    }
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].COMMENTS == "Deal(s) unified with already mapped RPL Status code") {
                            alertMsg += "<br/><li><span>" + data[i].No_Of_Deals + " " + data[i].COMMENTS + " : " + data[i].Deal_No + "</span></li>";
                        }
                    }
                    this.isAlert = true;
                    this.alertMsg = alertMsg;
                }
                else {
                    let failedDealsCount = 0;
                    if (data[0].COMMENTS == "Deal(s) Cannot be Unified") {
                        failedDealsCount = data[0].No_Of_Deals;
                    }
                    else if (data[1].COMMENTS == "Deal(s) Cannot be Unified") {
                        failedDealsCount = data[1].No_Of_Deals;
                    }
                    let msg = "<b>" + failedDealsCount + " deal(s) cannot be to unified</b>.<br/><br/>Following are the validation messages<br/><ul>";
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].COMMENTS != "Bulk Unified Deal(s)" && data[i].COMMENTS != "ECAP Hybrid Deal(s)" && data[i].COMMENTS != "Voltier Hybrid Deal(s)")
                            msg += "<br/><li><div style='word-wrap: break-word;'>" + data[i].COMMENTS + " : " + data[i].Deal_No + "</div></li>";
                        else if (data[i].COMMENTS == "Bulk Unified Deal(s)") {
                            msg = "<b>Successfully Unified " + data[i].No_Of_Deals + " deal(s)</b><br/><br/>" + msg;
                        }
                    }
                    msg += "</ul>"
                    this.isAlert = true;
                    this.alertMsg = msg;
                }
            }
            this.validUnifyDeals = [];
            this.inValidUnifyDeals = [];
            if (!this.isAlert) this.closeWindow();
        }, (response) => {
            this.loggerSvc.error('Operation failed', '');
        })
    }

    getColHeaders() {// for getting column headers from config file
        if (this.isBulkUnify)
            return ExcelColumnsConfig.bulkUnifyColHeaders;
        else {
            return ExcelColumnsConfig.DealReconColHeaders;
        }
    }

    getColumns() {// for getting column meta-data from config file
        if (this.isBulkUnify)
            return ExcelColumnsConfig.bulkUnifyColumns;
        else {
            return ExcelColumnsConfig.DealReconColumns;
        }
    }

    onFileUploadError() {
        this.files = [];
        this.loggerSvc.error("Unable to upload " + this.files.length + " attachment(s).", "Upload failed");
    }


    closeWindow() {
        this.dialogRef.close();
    }

    uploadFile(e) {
        let element = document.getElementsByClassName('k-upload-selected') as HTMLCollectionOf<HTMLElement>;
        if (element && element.length > 0)
            element[0].click();
    }

    onFileUploadComplete() {
        if (this.uploadSuccess) {
            this.loggerSvc.success("Successfully uploaded " + this.files.length + " attachment(s).", "Upload successful");
        }
    }

    closeAlert() {
        this.isAlert = false;
        if (this.unifiedVal > 0) {
            this.closeWindow();
        } else if (this.alertMsg == "Updated Successfully") {
            this.closeWindow();
        }
    }

    toggleType(change) {//on toggle change - changing the api for bulk unify and deal recon
        this.isBulkUnify = change;
        if (this.isBulkUnify) {
            this.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
            this.uploadSaveUrl = "/FileAttachments/ExtractBulkUnifyFile";
            this.screenTitle = "Bulk Unify - Deals";
        }
        else {
            this.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/DealRecon";
            this.uploadSaveUrl = "/FileAttachments/ExtractDealReconFile";
            this.screenTitle = "Deal Reconciliation";
        }
    }

    ok() {
        this.dialogRef.close();
    }
}