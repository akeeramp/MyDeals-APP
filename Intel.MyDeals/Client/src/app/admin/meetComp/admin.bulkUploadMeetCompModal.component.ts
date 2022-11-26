import { Component, ViewEncapsulation } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { meetCompService } from './admin.meetComp.service';
import { MatDialogRef } from '@angular/material/dialog';
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';

@Component({
    selector: "bulkUploadMeetCompModal",
    templateUrl: "Client/src/app/admin/meetComp/admin.bulkUploadMeetCompModal.component.html",
    styleUrls: ['Client/src/app/admin/meetComp/admin.meetComp.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BulkUploadMeetCompModalComponent {

    constructor(
        private meetCompSvc: meetCompService,
        private loggerSvc: logger, public dialogRef: MatDialogRef<BulkUploadMeetCompModalComponent>) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    spinnerMessageHeader = "Bulk Upload Meet Comp";
    spinnerMessageDescription = "Please wait while we importing meet comp data..";
    meetComps = [];
    files = [];
    cellMessages = [];
    uploadMeetCompUrl = "/FileAttachments/ExtractMeetCompFile";
    MeetCompValidation = null;
    uploadSuccess: boolean;
    selectedFileCount: any;
    HasBulkUploadAccess = (<any>window).usrRole == "DA";
    IsSpreadSheetEdited = false;
    hasUnSavedFiles = false;
    hasFiles = false;
    uploadSuccessCount = 0;
    uploadErrorCount = 0;
    isAlert = false;
    isPrevDuplicateSku = false;
    private isConfirmationReqd: boolean = false;
    private confirmationMsg: string = "";
    alertMsg = "";
    private isBusy = false;
    private hotRegisterer = new HotTableRegisterer();
    private hotId = "spreadsheet";
    private hotTable: Handsontable;
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        colHeaders: ExcelColumnsConfig.meetCompExcelColHeaders,
        autoWrapCol: true,
        minRows:1,
        data: this.meetComps,
        afterChange: (changes, source) => { this.afterTableEdited(changes) },
        columns: ExcelColumnsConfig.meetCompExcel,
        rowHeaders: true,
        copyPaste: true,
        comments: true,
        manualColumnResize: true,
        licenseKey: "8cab5-12f1d-9a900-04238-a4819",
    };

    fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractMeetCompFile',
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".xlsx"]
        }
    };

    afterTableEdited(changes) {
        if (changes && changes.length > 0 && changes[0][1] == "CUST_NM" && changes[0][3] == null) {
            this.meetComps[changes[0][0]][changes[0][1]] = "";
        }
        this.IsSpreadSheetEdited = true;
        if (this.cellMessages.length > 0) {
            this.cellMessages.map((cell) => {
                let colInd = ExcelColumnsConfig.meetCompExcel.findIndex((col) => col.data === changes[0][1])
                if (cell.row === changes[0][0] && cell.col === colInd) {
                    if (this.hotRegisterer && this.hotRegisterer.getInstance(this.hotId)) {
                        this.hotTable.setCellMetaObject(cell.row, colInd, { 'className': 'normal-product', comment: { value: '' } });
                    }
                }
            });
            this.hotTable.render();
        }
    }

    onFileSelect() {
        this.selectedFileCount++;
        this.hasUnSavedFiles = true;
    }

    uploadFile(e) {
        var element = document.getElementsByClassName('k-upload-selected') as HTMLCollectionOf<HTMLElement>;
        if (element && element.length > 0)
            element[0].click();
    }

    closeWindow() {
        this.dialogRef.close();
    }

    closeAlert() {
        this.isAlert = false;
    }

    closeConfirmation() {
        this.isConfirmationReqd = false;
    }

    successEventHandler(e) {
        this.uploadSuccess = true;
        this.meetComps = e.response.body;
        if (this.meetComps.length == 0) {
            this.isAlert = true;
            this.alertMsg = "There is no meet comp in the file to upload!";
        }
    }

    onFileRemove() {
        this.selectedFileCount--;
    }

    onFileUploadError(e) {
        this.loggerSvc.error("Unable to upload " + " attachment(s).", "Upload failed");
    }

    onFileUploadComplete() {
        if (this.uploadSuccess) {
            this.loggerSvc.success("Successfully uploaded " + this.files.length + " attachment(s).", "Upload successful");
        }
    }

    validateMeetComps() {
        this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        if (this.meetComps.length > 0) {
            this.isBusy = true;
            this.spinnerMessageDescription = "Please wait while validating meet comp data..";
            this.meetCompSvc.validateMeetComps(this.meetComps).subscribe((response) => {
                this.isBusy = false;
                this.MeetCompValidation = response;
                if (response.HasInvalidMeetComp) {
                    this.isAlert = true;
                    this.cellMessages = this.showMeetCompValidationMessages();
                    this.hotTable.updateSettings({
                        cell: this.cellMessages
                    })
                    this.IsSpreadSheetEdited = true;
                } else {
                    this.isAlert = true;
                    this.alertMsg = 'All meet comps are valid';
                    this.IsSpreadSheetEdited = false;
                }
                if (this.isPrevDuplicateSku && this.MeetCompValidation.DuplicateMeetCompsSKU.length == 0) {
                    this.isPrevDuplicateSku = false;
                    this.cellMessages.forEach((cell) => {
                        this.hotTable.setCellMetaObject(cell.row, cell.col, { 'className': 'normal-product', comment: { value: '' } });
                    });
                    this.hotTable.render();
                }
            }, (err) => {
                this.isBusy = false;
                this.loggerSvc.error("Operation failed", err);
            });

        }

    };

    showMeetCompValidationMessages() {
        let comments = [];
        this.alertMsg = "";
        if (this.MeetCompValidation.IsEmptyProductAvailable) {
            this.alertMsg += "Product name cannot be empty!, please fix.";}
        if (this.MeetCompValidation.IsEmptyMeetCompSkuAvailable) {        
            this.alertMsg += "</br></br>Meet Comp SKU cannot be empty!, please fix.";
            this.invalidValuesCellComments('MEET_COMP_PRD','Meet Comp SKU cannot be empty!',comments,2,'')} 
        if (this.MeetCompValidation.IsEmptyMeetCompPriceAvailable){
            this.invalidValuesCellComments('MEET_COMP_PRC','Format of the price is invalid. This should be greater than zero.',comments,3,'')
            this.alertMsg += "</br></br>Meet Comp price should be greater than zero!, please fix.";}
        if (this.MeetCompValidation.IsInvalidIABenchAvailable){
            this.alertMsg += "</br></br>IA Bench should be greater than zero for server products!, please fix.";
            this.invalidValuesCellComments('IA_BNCH','IA Bench should be greater than zero for server product!',comments,4,'')}
        if (this.MeetCompValidation.IsInvalidCompBenchAvailable){
            this.alertMsg += "</br></br>Comp Bench should be greater than zero for server products!, please fix.";
            this.invalidValuesCellComments('COMP_BNCH','Comp Bench should be greater than zero for server product!',comments,5,'')}
        if (this.MeetCompValidation.InValidCustomers.length > 0) {
            let invalidCustList = Array.from(new Set(this.MeetCompValidation.InValidCustomers));
            invalidCustList.map((cust) => (this.invalidValuesCellComments('CUST_NM','Customer should be valid and authorized!',comments,0,cust)));
            this.alertMsg += this.maxPrdCustInAlert(invalidCustList, 5, "Invalid customers exist, please fix:")}
        if (this.MeetCompValidation.InValidProducts.length > 0) {
            let invalidPrdList = Array.from(new Set(this.MeetCompValidation.InValidProducts));
            this.alertMsg += this.maxPrdCustInAlert(invalidPrdList, 5, "Invalid products exist, please fix:")
            this.MeetCompValidation.InValidProducts.map((pro => this.invalidValuesCellComments('HIER_VAL_NM','Please enter the products at L4 or Processor Level!',comments,1,pro)));}
        if (this.MeetCompValidation.DuplicateMeetCompsSKU.length > 0) {
            this.isPrevDuplicateSku = true;
            this.alertMsg += "</br></br>Meet Comp SKU with different prices is not allowed for same customer and product!, please fix.";
            this.invalidValuesCellComments('MEET_COMP_PRD','Meet Comp SKU with different prices is not allowed for same customer and product!',comments,2,'')}
        return comments;
    }

    invalidValuesCellComments(colName,celMsg,comments,colNo,value){
        this.meetComps.forEach((row, rowInd) => {
            if (colName === 'MEET_COMP_PRD' && this.MeetCompValidation.DuplicateMeetCompsSKU.length > 0){
                if (row['CUST_NM'] === this.MeetCompValidation.DuplicateMeetCompsSKU[0].CUST_NM && row['HIER_VAL_NM'] === this.MeetCompValidation.DuplicateMeetCompsSKU[0].HIER_VAL_NM) {
                           comments.push({ row: (rowInd), col: 2, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
                }
            } else if (colName === 'CUST_NM' || colName === 'HIER_VAL_NM'){
                if (row[colName] === value) {
                    comments.push ({ row: (rowInd), col: colNo, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
                }
            }
            else{            
                if ((row[colName] === 0 ||  row[colName] == null || row[colName] == '')) {
                    comments.push({ row: (rowInd), col: colNo, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
            }
        }
        });
        return comments;
    }

     maxPrdCustInAlert(itemsList, maxItemsSize, itemsMessage) {
        let retString = "";
        if (itemsList.length > 0) {
            var truncatedMatchedItems = itemsList.slice(0, maxItemsSize).map(function (data) { return " " + data });
            retString += "</br></br>";
            if (truncatedMatchedItems.length < itemsList.length) {
                retString += "<b>" + itemsMessage + " (top " + maxItemsSize + " of " + itemsList.length + " items)</b></br>" + (truncatedMatchedItems).join("</br>");
                retString += "<br>...<br>";
            } else {
                retString += "<b>" + itemsMessage + "</b></br>" + itemsList.join("</br>");}}
        return retString;
    }

    saveMeetComps() {
        if (this.MeetCompValidation != null && this.MeetCompValidation.HasInvalidMeetComp == false && this.MeetCompValidation.ValidatedMeetComps.length > 0) {
            if (this.IsSpreadSheetEdited) {
                this.alertMsg = "Spreadsheet has been edited! Please validate meet comp data before uploading.";
                this.isAlert = true;
            } else {
                if (this.MeetCompValidation.IsEmptyCustomerAvailable) {
                    this.confirmationMsg = "<div style='max-width:350px;'>This spreadsheet did not have Customer entered for one or more line item. If no Customer is entered, this Meet Comp SKU and Price will be entered for ALL customers.<div><br/><br/><b>Would you like to continue?</b>"
                    this.isConfirmationReqd = true;
                } else
                    this.UploadMeetComps();
            }
        } else {
            this.isAlert = true;
            this.alertMsg = "There is no meet comp to upload!";}
        };

    UploadMeetComps() {
        this.isBusy = true;
        this.spinnerMessageDescription = "Please wait while uploading meet comp data..";
        this.meetCompSvc.uploadMeetComp(this.MeetCompValidation.ValidatedMeetComps).subscribe((response) => {
            this.isBusy = false;
            if (response) {
                this.loggerSvc.success("Meet comps are uploaded successfully!");
                this.closeWindow();
            }
            else
                this.loggerSvc.error("Unable to upload meet comps!", "");
        }, err => {
            this.isBusy = false;
            this.loggerSvc.error("Unable to upload meet comps!", "");
        });
    }
}