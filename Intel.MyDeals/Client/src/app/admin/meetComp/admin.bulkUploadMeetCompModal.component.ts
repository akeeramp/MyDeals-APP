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
    priceVal = [] ;
    MeetCompValidation = null;
    uploadSuccess: boolean;
    selectedFileCount: any;
    HasBulkUploadAccess = (<any>window).usrRole == "DA";
    IsSpreadSheetEdited = true;
    hasUnSavedFiles = false;
    hasFiles = false;
    uploadSuccessCount = 0;
    uploadErrorCount = 0;
    isAlert = false;
    isPrevDuplicateSku = false;
    private isConfirmationReqd: boolean = false;
    private confirmationMsg: string = "";
    alertMsg = "";
    invalPrcRow: any;
    isInvalidPrice: boolean;
    priceMsg: string;
    private isBusy = false;
    private hotRegisterer = new HotTableRegisterer();
    private hotId = "spreadsheet";
    private hotTable: Handsontable;
    private hotSettings: Handsontable.GridSettings = {
        wordWrap: true,
        colHeaders: ExcelColumnsConfig.meetCompExcelColHeaders,
        autoWrapCol: true,
        minRows:1,
        afterChange: (changes, source) => { this.afterTableEdited(changes,source) },
        columns: ExcelColumnsConfig.meetCompExcel,
        rowHeaders: true,
        copyPaste: true,
        comments: true,
        manualColumnResize: true,
        licenseKey: "470b6-15eca-ea440-24021-aa526",
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

    afterTableEdited(changes,source) {
    if (changes && changes.length > 0){
        let colInd = ExcelColumnsConfig.meetCompExcel.findIndex((col) => col.data === changes[0][1])
         if ((changes[0][1] == "CUST_NM" || changes[0][1] == "HIER_VAL_NM") &&  changes[0][3] == null) {
            this.meetComps[changes[0][0]][changes[0][1]] = "";
        }
    
        if (this.cellMessages.length > 0) {
            this.cellMessages.find((cell,ind) => {
                if (ind < this.cellMessages.length){
                if (cell.row === changes[0][0] && cell.col === colInd ) {
                    if( !(changes[0][1] == "MEET_COMP_PRC" && changes[0][3] === 0) ) {
                        this.hotTable.setCellMetaObject(cell.row, colInd, { 'className': 'normal-product', comment: { value: '' } });
                        this.cellMessages.splice(ind,1)
                    }
                }
            }
                this.hotTable.render();
            });   
        }  
    
    if( changes[0][1] == "MEET_COMP_PRC" && this.MeetCompValidation && this.isAlert ==false){
        if (isNaN(changes[0][3])){
            this.isInvalidPrice = true ;
            this.priceMsg = "Format of the price is invalid. This should be greater than zero."
            this.invalPrcRow = changes[0][0];
        } 
        if(!isNaN(changes[0][2])){
            this.priceVal.push(changes[0][2] != null ? changes[0][2] != '' ? changes [0][2] : 0 : 0)
            if (!isNaN(changes[0][3])){
                this.priceVal.push(changes[0][3] != null ? changes[0][3] != '' ? changes [0][3] : 0 : 0);
            }
        }
    }
    if ((changes [0][1] == "IA_BNCH" || changes [0][1] == "COMP_BNCH") && ((isNaN(changes[0][3]) && (!(parseInt(changes[0][3]) > 0))) || changes[0][3] === 0 || changes[0][3] === '') && this.MeetCompValidation ){
        let msg = changes [0][1] == "IA_BNCH" ? 'IA Bench should be greater than zero for server product!' : 'Comp Bench should be greater than zero for server product!'
        this.checkIsitServerProd(changes [0][0],colInd,msg,changes [0][1],this.cellMessages);
        this.hotTable.updateSettings({cell: this.cellMessages})   
        this.hotTable.render();
    }
        this.IsSpreadSheetEdited = true;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    }
    }

    checkIsitServerProd(row,col,msg,colName,cmnts){
        if (this.MeetCompValidation){
        this.MeetCompValidation.ProductsRequiredBench.filter(prod => {
                    if (prod === (this.meetComps[row]['HIER_VAL_NM']).toLowerCase() && (isNaN (this.meetComps[row][colName])  || this.meetComps[row][colName] === 0 || this.meetComps[row][colName] === null)){
                        cmnts.push ({ row: (row), col: col, comment: { value: msg, readOnly: true }, className: 'error-product' })
                    } 
                });
            }
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

    closePriceAlert(flag){
        if (flag == 'close') {
            this.hotTable.setDataAtCell(this.invalPrcRow,3,this.priceVal[(this.priceVal.length - 1)])
        } 
        this.isInvalidPrice = false;
    }

    successEventHandler(e) {
        this.uploadSuccess = true;
        this.meetComps = e.response.body;
        if (this.meetComps.length == 0) {
            this.isAlert = true;
            this.alertMsg = "There is no meet comp in the file to upload!";
        }
    }

    onFileUploadError(e) {
        this.loggerSvc.error("Unable to upload " + this.files.length + " attachment(s).", "Upload failed");
    }

    onFileUploadComplete() {
        if (this.uploadSuccess) {
            this.loggerSvc.success("Successfully uploaded " + this.files.length + " attachment(s).", "Upload successful");
        }  
    }

    validateMeetComps() {
        this.hotTable = this.hotRegisterer.getInstance(this.hotId);
        this.generateMeetComps();
        this.priceVal = [];
        if (this.meetComps.length > 0) {
            this.isBusy = true;
            this.spinnerMessageDescription = "Please wait while validating meet comp data..";
            this.meetCompSvc.validateMeetComps(this.meetComps).subscribe((response) => {
                this.isBusy = false;
                this.MeetCompValidation = response;
                if (response.HasInvalidMeetComp) {
                    this.isAlert = true;
                    this.cellMessages = [... this.showMeetCompValidationMessages()];
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
                        if(cell.col === 2)
                            this.hotTable.setCellMetaObject(cell.row, cell.col, { 'className': 'normal-product', comment: { value: '' } });
                    });
                    this.hotTable.render();
                }
                this.setInvalidBenchValsZero();
            }, (err) => {
                this.isBusy = false;
                this.loggerSvc.error("Operation failed", err);
            });
        }
    };

    generateMeetComps () {
        this.meetComps = [];
        var tempRange = this.hotTable.getData().filter(x => !(x[0] == null && x[1] == null && x[2] == null && x[3] == null && x[4] == null && x[5] == null));
        if (tempRange.length > 0) {
            this.spinnerMessageDescription = "Please wait while reading meet comp data..";
            for (var i = 0; i < tempRange.length; i++) {
                var newMeetComp = {};
                newMeetComp['CUST_NM'] = tempRange[i][0] != null ? ((tempRange[i][0]).trim()) : "";
                newMeetComp['HIER_VAL_NM'] = tempRange[i][1] != null ? ((tempRange[i][1]).trim()) : "";
                newMeetComp['MEET_COMP_PRD'] = tempRange[i][2] != null ? ((tempRange[i][2]).trim()) : "";
                newMeetComp['MEET_COMP_PRC'] = tempRange[i][3] != null ? tempRange[i][3] : 0;
                newMeetComp['IA_BNCH'] = tempRange[i][4] != null ? (!isNaN(tempRange[i][4]) && parseInt(tempRange[i][4]) > 0 ? tempRange[i][4] : 0) : 0;
                newMeetComp['COMP_BNCH'] = tempRange[i][5] != null ? (!isNaN(tempRange[i][5]) && parseInt(tempRange[i][5]) > 0 ? tempRange[i][5] : 0) : 0;
                this.meetComps.push(newMeetComp);
            }
        }
    }

    setInvalidBenchValsZero(){
        this.meetComps.forEach((row,rowInd) => {
            if (isNaN(row['IA_BNCH']) ){
                this.hotTable.setDataAtCell(rowInd,4,0);
          }
            if (isNaN(row['COMP_BNCH']) ) {
                this.hotTable.setDataAtCell(rowInd,5,0);
             }
            if (isNaN(row['MEET_COMP_PRC']) ) {
                this.hotTable.setDataAtCell(rowInd,3,0);
                this.cellMessages.push({ row: (rowInd), col: 3, comment: { value: 'Format of the price is invalid. This should be greater than zero.', readOnly: true }, className: 'error-product' })
            }
        })
        this.hotTable.render();
    }

    showMeetCompValidationMessages() {
        let comments = [];
        this.alertMsg = "";
        if (this.MeetCompValidation.IsEmptyProductAvailable) {
            this.alertMsg += "Product name cannot be empty!, please fix.";}
        if (this.MeetCompValidation.IsEmptyMeetCompSkuAvailable) {        
            this.alertMsg += "</br></br>Meet Comp SKU cannot be empty!, please fix."; }
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
           if (colName === 'MEET_COMP_PRD' && this.MeetCompValidation.DuplicateMeetCompsSKU.length > 0 && !(row['MEET_COMP_PRD'] === '' || row['MEET_COMP_PRD'] === null )){
                if (row['CUST_NM'] === this.MeetCompValidation.DuplicateMeetCompsSKU[0].CUST_NM && row['HIER_VAL_NM'] === this.MeetCompValidation.DuplicateMeetCompsSKU[0].HIER_VAL_NM) {
                           comments.push({ row: (rowInd), col: 2, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
                }
            } else if (colName === 'CUST_NM' || colName === 'HIER_VAL_NM'){
                if (row[colName].toLowerCase() === value) {
                    comments.push ({ row: (rowInd), col: colNo, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
                }
            }
            else if (colName === 'IA_BNCH' || colName === 'COMP_BNCH' || colName === 'MEET_COMP_PRC'){ 
                if (this.MeetCompValidation.ProductsRequiredBench.length > 0 && colName !== 'MEET_COMP_PRC') {
                    this.checkIsitServerProd(rowInd,colNo,celMsg,colName,comments);
                }  else {
                    if ((row[colName] === 0 ||  row[colName] == null || row[colName] == '')) {
                        comments.push({ row: (rowInd), col: colNo, comment: { value: celMsg, readOnly: true }, className: 'error-product' });
                    }
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