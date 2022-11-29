import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { FileRestrictions, UploadEvent } from "@progress/kendo-angular-upload";
import { ThemePalette } from "@angular/material/core";
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { unifiedDealReconService } from './admin.unifiedDealRecon.service'

@Component({
    selector: "bulk-unify-deals",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.bulkUnifyModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class bulkUnifyModalComponent {
    SpreadSheetRowsCount: any;
    dealReconValidationSummary: any;
    invalidDeals: any;
    constructor(public dialogRef: MatDialogRef<bulkUnifyModalComponent>, private loggerSvc: logger,
        @Inject(MAT_DIALOG_DATA) public data, private unifiedDealSvc: unifiedDealReconService) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private color: ThemePalette = 'primary';
    public isBulkUnify = true;
    public screenTitle = "Bulk Unify - Deals";
    public fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
    private uploadSaveUrl: any;
    private hotRegisterer = new HotTableRegisterer();
    private hotId = "spreadsheet";
    private hotTable: Handsontable;
    private files: any = [];
    private hasUnsavedFiles: boolean = false;
    private hasFiles: boolean = true;
    private uploadSuccess: boolean = false;
    private isAlert: boolean = false;
    private alertMsg: string = "";
    private inValidUnifyDeals: any = [];
    private validUnifyDeals: any = [];
    private UnifyValidation: any;
    private duplicateGlobalIds: any = [];
    private duplicateGlobalNames: any = [];
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        colHeaders: this.getColHeaders(),
        autoWrapCol: true,
        minRows: 1,
        data: this.inValidUnifyDeals,
        //afterChange: (changes, source) => { this.afterTableEdited(changes) },
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
        if (e.response == undefined || e.response.body == undefined || e.response.body == "") {
            this.isAlert = true;
            this.alertMsg = "Uploaded file not having any data";
        }
        else {
            if (this.isBulkUnify) {
                this.UnifyValidation = e.response.body;
                this.validUnifyDeals = e.response.body.ValidUnifyDeals;
                this.inValidUnifyDeals = e.response.body.InValidUnifyDeals;
                this.duplicateGlobalIds = e.response.body.DuplicateGlobalIds;
                this.duplicateGlobalNames = e.response.body.DuplicateGlobalNames;
            }
            /*else {
                this.dealReconValidationSummary = e.response.body;
                this.invalidDeals = this.dealReconValidationSummary.inValidRecords
            }*/
        }
    }

    generateHandsonTable() {
        if (this.isBulkUnify) return this.inValidUnifyDeals;
        else return this.invalidDeals;
    }
    
    getColHeaders() {
        if (this.isBulkUnify)
            return ExcelColumnsConfig.bulkUnifyColHeaders;
        else {
            return ExcelColumnsConfig.bulkUnifyDealReconColHeaders;
        }
    }
    getColumns() {
        if (this.isBulkUnify)
            return ExcelColumnsConfig.bulkUnifyColumns;
        else {
            return ExcelColumnsConfig.bulkUnifyDealReconColumns;
        }
    }
    onFileUploadError() {
        this.files = [];
        this.loggerSvc.error("Unable to upload " + this.files.length + " attachment(s).", "Upload failed");
    }
    cancel() {
        this.dialogRef.close();
    }
    CloseWindow() {
        this.dialogRef.close();
    }
    uploadFile(e) {
        if (this.isBulkUnify) this.uploadSaveUrl = "/FileAttachments/ExtractBulkUnifyFile";
        //else this.uploadSaveUrl = "/FileAttachments/ExtractDealReconFile";
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
    }

    validateBulkData() {
        for (let i = 0; i < this.inValidUnifyDeals.length; i++) {
            //row = i + 1;
            let rowMsg = "";
            let mandatory = [];
            if (this.UnifyValidation.IsEmptyDealAvailable) {
                if (this.inValidUnifyDeals[i].DEAL_ID == "0") {
                    mandatory.push("Deal ID");
                }
            }
            if (this.UnifyValidation.IsEmptyCustIdAvailable) {
                if (this.inValidUnifyDeals[i].UCD_GLOBAL_ID == "0") {
                    mandatory.push("Unified Customer ID");
                }
            }
            if (this.UnifyValidation.IsEmptyCustNameAvailable) {
                if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME == null || this.inValidUnifyDeals[i].UCD_GLOBAL_NAME == "") {
                    mandatory.push("Unified Customer Name");
                }
            }
            if (this.UnifyValidation.IsEmptyCountryIdAvailable) {
                if (this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID == "0") {
                    mandatory.push("Country/Region Customer ID");
                }
            }
            if (this.UnifyValidation.IsEmptyCountryAvailable) {
                if (this.inValidUnifyDeals[i].UCD_COUNTRY == null || this.inValidUnifyDeals[i].UCD_COUNTRY == "") {
                    mandatory.push("Unified Country/Region");
                }
            }
            if (this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == undefined || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == null
                || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL == '') {
                //isEmptyDealEndCustomerRetail = true;
                mandatory.push("End Customer Retail");
            }
            if (this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == undefined || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == null
                || this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY == '') {
                //isEmptyDealEndCustomerCountry = true;
                mandatory.push("End Customer Country/Region");
            }
            if (mandatory.length > 0) {
                rowMsg = rowMsg + mandatory.join(", ") + " is a mandatory field|";
            }
            var validRows = this.inValidUnifyDeals.filter(x => x.DEAL_ID != 0 && x.UCD_GLOBAL_ID != 0 && x.UCD_GLOBAL_NAME != "" && x.UCD_COUNTRY_CUST_ID != 0 && x.UCD_COUNTRY != "");

            if (this.UnifyValidation.DuplicateDealCombination.length > 0) {
                if (this.UnifyValidation.DuplicateDealCombination.find(this.inValidUnifyDeals[i].DEAL_ID)
                    && validRows.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.UCD_GLOBAL_ID == this.inValidUnifyDeals[i].UCD_GLOBAL_ID && x.UCD_GLOBAL_NAME == this.inValidUnifyDeals[i].UCD_GLOBAL_NAME
                        && x.UCD_COUNTRY_CUST_ID == this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID && x.UCD_COUNTRY == this.inValidUnifyDeals[i].UCD_COUNTRY).length > 1) {
                    rowMsg = rowMsg + "Duplicate rows found with same combinations for Deal ID, Unified Customer ID, Unified Customer Name, Country/Region Customer ID and Unified Country/Region|";
                }
            }
            if (this.UnifyValidation.DuplicateDealEntryCombination.length > 0) {
                if (jQuery.inArray(this.inValidUnifyDeals[i].DEAL_ID, this.UnifyValidation.DuplicateDealEntryCombination) != -1
                    && validRows.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL &&
                        x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY).length > 1) {
                    rowMsg = rowMsg + "Duplicate rows found with same combinations for Deal ID, End Customer Retail and End Customer Country/Region|";
                }
            }
            if (this.inValidUnifyDeals[i].UCD_GLOBAL_ID != 0 && this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID != 0 && this.inValidUnifyDeals[i].UCD_GLOBAL_ID == this.inValidUnifyDeals[i].UCD_COUNTRY_CUST_ID) {
                rowMsg = rowMsg + "Unified Customer ID and Country/Region Customer ID cannot be same|";
                //isSameGlobalandCtryId = true;
            }
            if (this.UnifyValidation.InValidCountries.length > 0) {
                if (jQuery.inArray(jQuery.trim(this.inValidUnifyDeals[i].UCD_COUNTRY).toLowerCase(), this.UnifyValidation.InValidCountries) != -1) {
                    rowMsg = rowMsg + "Unified Country/Region does not exist in My Deals|";
                }
            }

            if (this.inValidUnifyDeals[i].UCD_COUNTRY != "" && this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY != "" &&
                this.inValidUnifyDeals[i].UCD_COUNTRY.toLowerCase() != this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY.toLowerCase()) {
                rowMsg = rowMsg + "Unified Country/Region and End Customer Country/Region needs to be same|";
                //isCtrySame = true;
            }

            if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME != null && this.inValidUnifyDeals[i].UCD_GLOBAL_NAME != "") {
                if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "any") {
                    //isGlobalContainsAny = true;
                    rowMsg = rowMsg + "'ANY' cannot be used as Unified Customer Name|";
                }
                if (this.inValidUnifyDeals[i].UCD_GLOBAL_NAME.toLowerCase() == "null") {
                    //isGlobalContainsNull = true;
                    rowMsg = rowMsg + "NULL cannot be used as Unified Customer Name|";
                }
                var patt = new RegExp("^[\\w\\s.,:'\&+-]*$");
                var res = patt.test(this.inValidUnifyDeals[i].UCD_GLOBAL_NAME);
                if (!res) {
                    //isInvalidGlobalName = true;
                    rowMsg = rowMsg + "Unified Customer Name contains invalid characters|";
                }
            }

            if (this.duplicateGlobalIds.length > 0) {
                if (jQuery.inArray(this.inValidUnifyDeals[i].UCD_GLOBAL_ID, this.duplicateGlobalIds) != -1) {
                    rowMsg = rowMsg + "Same Unified Customer ID cannot be associated with multiple Unified Customer Names|";
                }
            }

            if (this.duplicateGlobalNames.length > 0) {
                if (jQuery.inArray(this.inValidUnifyDeals[i].UCD_GLOBAL_NAME, this.duplicateGlobalNames) != -1) {
                    rowMsg = rowMsg + "Same Unified Customer Name cannot be associated with multiple Unified Customer IDs|";
                }
            }

            if (this.UnifyValidation.AlreadyUnifiedDeals.length > 0) {
                if (jQuery.inArray(this.inValidUnifyDeals[i].DEAL_ID, this.UnifyValidation.AlreadyUnifiedDeals) != -1) {
                    rowMsg = rowMsg + "Deal is already Unified|"
                }
            }

            if (this.UnifyValidation.UnifiedCombination.length > 0) {
                var index = this.UnifyValidation.UnifiedCombination.findIndex((x) => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                    && x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                if (index > -1) {
                    rowMsg = rowMsg + "End Customer Retail and End Customer Country/Region combination for this deal has already been unified|"
                }
            }

            if (this.UnifyValidation.InvalidDeals.length > 0) {
                if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "count mismatch").length > 0) {
                    rowMsg = rowMsg + "End Customer - Country/Region combination is not a user entered value in the Deal|"
                }
                else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "not exist").length > 0) {
                    rowMsg = rowMsg + "Deal ID does not exists in MyDeals|"
                }
                else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "cancelled").length > 0) {
                    rowMsg = rowMsg + "Deal is in Cancelled Stage and cannot be unified|"
                }
                else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "lost").length > 0) {
                    rowMsg = rowMsg + "Deal is in Lost Stage and cannot be unified|"
                }
                else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "deal expired").length > 0) {
                    rowMsg = rowMsg + "Deal is in Expired Stage and cannot be unified|"
                }
                else if (this.UnifyValidation.InvalidDeals.filter(x => x.Key == this.inValidUnifyDeals[i].DEAL_ID && x.Value == "end cust obj not exists").length > 0) {
                    rowMsg = rowMsg + "Deal is not having all end customer related information|"
                }
            }

            if (this.UnifyValidation.InValidCombination.length > 0) {
                var index = this.UnifyValidation.InValidCombination.findIndex((x) => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID && x.DEAL_END_CUSTOMER_RETAIL == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_RETAIL
                    && x.DEAL_END_CUSTOMER_COUNTRY == this.inValidUnifyDeals[i].DEAL_END_CUSTOMER_COUNTRY);

                if (index > -1) {
                    rowMsg = rowMsg + "Incorrect values of End Customer Retail and End Customer Country/Region associated with the Deal ID|"
                }
            }
            var RPLStsCodepattern = new RegExp("^[A-Za-z\\s,]*$");
            var isValidRPLSTSCode = RPLStsCodepattern.test(this.inValidUnifyDeals[i].RPL_STS_CODE);
            if (!isValidRPLSTSCode) {
                //invalidRPLStatusCode.push(this.inValidUnifyDeals[i].DEAL_ID)
                rowMsg = rowMsg + "The RPL Status code contains invalid characters. Please remove spaces and special characters.|";
            }
            else if (this.UnifyValidation.InvalidRPLStsCode.length > 0) {
                if ((this.UnifyValidation.InvalidRPLStsCode.filter(x => x.DEAL_ID == this.inValidUnifyDeals[i].DEAL_ID).length > 0) && this.inValidUnifyDeals[i].RPL_STS_CODE != "") {
                    rowMsg = rowMsg + "Invalid RPL Status code. Please refer to the notes section for allowed possible values of the RPL status code.|"
                }
            }
            console.log(rowMsg);
        }
        
    }

    invalidValuesCellComments(colName, celMsg, comments, colNo, value) {
        this.inValidUnifyDeals.forEach((row, rowInd) => {
            if (row[colName] != '' && row[colName] != null && this.inValidUnifyDeals.length > 0) {
                if (colName === 'ProductName') {
                    if (row[colName] == value[colName])
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'warning-product error-cell'
                        });
                }
            }
            if (row[colName] != '' && row[colName] != null && celMsg.length > 1) {
                if (colName === 'ProductName') {
                    if (row[colName].toLowerCase() == value)
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'error-product error-cell'
                        });

                } else {
                    if (row[colName] != '' && row[colName] != null && (row[colName] == value || row[colName] == 0)) {
                        comments.push({
                            row: (rowInd),
                            col: colNo,
                            comment: { value: celMsg, readOnly: false },
                            className: 'error-product error-cell'
                        });
                        comments.push({
                            row: (rowInd),
                            col: 0,
                            comment: { value: '', readOnly: false },
                            className: 'warning-product'
                        });
                    }

                }
            } else {
                if (row[colName] != '' && row[colName] != null && row[colName].toLowerCase() == value)
                    comments.push({
                        row: (rowInd),
                        col: colNo,
                        comment: { value: '', readOnly: false },
                        className: 'success-product'
                    });

            }
        });
        return comments;
    }

    toggleType(e) {
        this.isBulkUnify = !this.isBulkUnify;
        if (e) {
            this.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkUnify";
            this.screenTitle = "Bulk Unify - Deals";

            //this.isBulkUnify=true
        }
        else {
            this.fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/DealRecon";
            this.screenTitle = "Deal Reconciliation";
            //this.isBulkUnify = false
            // this.isBulkUnify = !this.isBulkUnify;
        }
    }

    ok() {
        this.dialogRef.close();
    }
    ngOnInit() {
        //this.operator = { id: 1, name: '<=' };
        //if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
        //    var splitValue = this.data.cellCurrValues.split("$");
        //    this.operator = this.operators.find(element => element.name == splitValue[0]);
        //    this.price = parseFloat(splitValue[1]);
        //}
        //this.label = this.data.label;
    }
}