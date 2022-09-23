import * as angular from "angular";
import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { dealToolsService } from "../dealTools/dealTools.service";
import { FileRestrictions, UploadEvent } from "@progress/kendo-angular-upload";
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { GridUtil } from "../../../contract/grid.util";
import { DatePipe } from '@angular/common';

@Component({
    selector: "file-attachment-modal",
    templateUrl: "Client/src/app/core/gridCell/fileAttachmentModal/fileAttachmentModal.component.html",
    styleUrls: ["Client/src/app/core/gridCell/fileAttachmentModal/fileAttachmentModal.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class fileAttachmentComponent {
    constructor(private dealToolsSvc: dealToolsService, private loggerSvc: logger, private datePipe: DatePipe, public dialogRef: MatDialogRef<fileAttachmentComponent>, @Inject(MAT_DIALOG_DATA) public data) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    public dataItem = this.data.dataItem;
    public C_ADD_ATTACHMENTS: boolean = this.dealToolsSvc.chkDealRules('C_ADD_ATTACHMENTS', (<any>window).usrRole, null, null, null);
    public C_DELETE_ATTACHMENTS: boolean = ((this.dataItem.HAS_TRACKER === "1") ? false : (this.dealToolsSvc.chkDealRules('C_DELETE_ATTACHMENTS', (<any>window).usrRole, null, null, this.dataItem.PS_WF_STG_CD)));
    public isDeleteAttachment: boolean = false;
    private deleteAttachmentParams: any = {};
    private fileUploading= false;
    public attachmentCount = 0;
    public initComplete = false;
    public uploadSaveUrl = "/FileAttachments/Save";
    public selectedFileCount = 0;
    public uploadErrorCount = 0;
    public uploadSuccessCount = 0;
    private gridResult = [];
    private gridData: GridDataResult;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        filter: {
            logic: "and",
            filters: [],
        },
    };
    private isLoading = true;

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    myRestrictions: FileRestrictions = {
        allowedExtensions: ["doc", "xls", "txt", "bmp", "jpg", "pdf", "ppt", "zip", "xlsx", "docx", "pptx", "odt", "ods", "ott", "sxw", "sxc", "png", "7z", "xps"],
    };
    successEventHandler() {
        this.uploadSuccessCount++;
        this.fileUploading = false;
        this.loadAttachments();
    }
    onFileUploadComplete() {
        if (this.uploadSuccessCount) {
            this.loggerSvc.success("Successfully uploaded " + this.uploadSuccessCount + " attachment(s).", "Upload successful");
        }
        if (this.uploadErrorCount) {
            this.loggerSvc.error("Unable to upload " + this.uploadErrorCount + " attachment(s).", null, "Upload failed");
        }
    }
    onFileSelect() {
        this.selectedFileCount++;
    }
    onFileRemove() {
        this.selectedFileCount--;
    }
    errorEventHandler() {
        this.uploadErrorCount++;
    }
    uploadEventHandler(e: UploadEvent) {
        this.fileUploading = true;
        this.uploadSuccessCount = 0;
        this.uploadErrorCount = 0;
        e.data = {
            custMbrSid: this.dataItem.CUST_MBR_SID,
            objSid: this.dataItem.DC_ID,
            objTypeSid: 5 // WIP_DEAL
        }
    }
    deleteFileAttachment(data) {
        this.deleteAttachmentParams = { custMbrSid: data.CUST_MBR_SID, objTypeSid: data.OBJ_TYPE_SID, objSid: data.OBJ_SID, fileDataSid: data.FILE_DATA_SID };
        this.isDeleteAttachment = true;
    }
    deleteAttachmentActions(action: boolean) {
        if (action == true) {
            this.dealToolsSvc.deleteAttachment(this.deleteAttachmentParams.custMbrSid, this.deleteAttachmentParams.objTypeSid, this.deleteAttachmentParams.objSid,
                this.deleteAttachmentParams.fileDataSid).subscribe((response: any) => {
                    this.isDeleteAttachment = false;
                    this.loggerSvc.success("Successfully deleted attachment.", "Delete successful");
                    this.loadAttachments();
                }, error => {
                    this.loggerSvc.error("Unable to delete attachment.", "Delete failed");
                    this.loadAttachments();
                });
        }
        else {
            this.isDeleteAttachment = false;
        }
    }
    stripMilliseconds(dateTime) {
        let date = this.datePipe.transform(new Date(GridUtil.stripMilliseconds(dateTime)), 'M/d/yyyy');
        return date;
    }
    loadAttachments() {
        this.isLoading = true;
        this.dealToolsSvc.getAttachments(this.dataItem.CUST_MBR_SID, this.dataItem.DC_ID, this.dataItem.dc_type).subscribe(response => {
            if (response != undefined && response != null) {
                    this.gridResult = response;
                    this.gridData = process(this.gridResult, this.state);
                    this.attachmentCount = response.length;
                    this.dataItem = this.dataItem;
                    this.initComplete = true;
                    this.dataItem.HAS_ATTACHED_FILES = this.attachmentCount > 0 ? "1" : "0";
                    this.isLoading = false;
            }
        }, error => {
                this.loggerSvc.error("Unable to get Files.", error);
                this.initComplete = true;
        });
    }    
    close() {
        this.dialogRef.close();
    }
    ngOnInit() {
        this.loadAttachments();
    }
}
angular.module("app").directive(
    "fileAttachmentModal",
    downgradeComponent({
        component: fileAttachmentComponent,
    })
);