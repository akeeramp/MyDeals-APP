import { Component, ViewEncapsulation } from "@angular/core"
import { logger } from "../../shared/logger/logger";
import { MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: "admin-bulk-pricing-update-modal",
    templateUrl: "Client/src/app/admin/bulkPricingUpdates/admin.bulkPricingUpdateModal.component.html",
    styleUrls: ['Client/src/app/admin/bulkPricingUpdates/admin.bulkPricingUpdates.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class BulkPricingUpdateModalComponent {
    constructor(
        private loggerSvc: logger, public dialogRef: MatDialogRef<BulkPricingUpdateModalComponent>) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    uploadSuccess: boolean = false;
    removeFile: boolean = false;
    showAlert: boolean;
    alertMsg: string;
    files = [];
    fileURL = "/api/FileAttachments/GetBulkUnifyTemplateFile/BulkPriceUpdate";
    screenTitle = "Bulk Price Uploads - Deals";
    spinnerMessageHeader = "Bulk Price Uploads Deals";
    spinnerMessageDescription = "Please wait while bulk pricing deal data is imported..";
    HasBulkUpdateAccess = (((<any>window).usrRole == "SA" && !(<any>window).isCustomerAdmin) || (<any>window).isDeveloper);
    isBusyShowFunFact = true;
    SpreadSheetRowsCount = 0;
    bulkProceUploadValidationSummary = [];
    fileUploadOptions = {
        async: {
            saveUrl: '/FileAttachments/ExtractBulkPriceUpdateFile',
            autoUpload: false
        },
        validation: {
            allowedExtensions: [".xlsx"]
        }
    }

    uploadFile(e) {
        var element = document.getElementsByClassName('k-upload-selected') as HTMLCollectionOf<HTMLElement>;
        if (element && element.length > 0)
            element[0].click();
    }

    closeWindow() {
        this.dialogRef.close(this.bulkProceUploadValidationSummary);
    }

    onFileUploadError(e) {
        this.loggerSvc.error("Unable to upload " + this.files.length + " attachment(s).", "Upload failed");
    }

    successEventHandler(e){
        if (e.response.body == undefined || e.response.body == null || e.response.body == "") {
            this.showAlert = true;
            this.alertMsg ="Uploaded file not having any data";
            this.removeFile = true;
            return;
        }
        this.uploadSuccess = true;
        this.bulkProceUploadValidationSummary = e.response.body;
        if (this.bulkProceUploadValidationSummary.length == 0)
        {
            this.showAlert = true;
            this.alertMsg = 'There is no Bulk Pricing Upload Data in the file to load!';
        }
        else if (this.bulkProceUploadValidationSummary.length > 0){
            this.closeWindow();
        }
    }

    onFileUploadComplete() {
        if (this.removeFile){
            this.files = [];
            this.removeFile = false;
        }
        if (this.uploadSuccess) {
            this.loggerSvc.success("Successfully uploaded " + this.files.length + " attachment(s).", "Upload successful");
        } 
    }

    closeAlert() {
        this.showAlert = false;
    }
}