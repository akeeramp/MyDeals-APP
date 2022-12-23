import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { notificationsService } from './admin.notifications.service';
import { logger } from "../../shared/logger/logger";
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicEnablementService } from '../../shared/services/dynamicEnablement.service';

@Component({
    selector: "notificationsModalDialog",
    templateUrl: "Client/src/app/admin/notifications/admin.notificationsModal.component.html",
    styleUrls: ['Client/src/app/admin/notifications/admin.notifications.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None 
})

export class notificationsModalDialog {
    constructor(public dialogRef: MatDialogRef<notificationsModalDialog>, @Inject(MAT_DIALOG_DATA) public dataItem: any, private notificationsSvc: notificationsService, private loggerSvc: logger, private sanitized: DomSanitizer, private dynamicEnablementService: DynamicEnablementService) {
    }

    private role = (<any>window).usrRole;
    private wwid = (<any>window).usrWwid;
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";
    private angularEnabled: boolean = false;

    public markAsRead(dataItem) {
        const ids = [dataItem.NLT_ID];
        // If unread mark as read
        if (!dataItem.IS_READ_IND) {
            this.notificationsSvc.manageNotifications("UPDATE", true, ids).subscribe(() => {
                //to update the notification count on the notification icon
                this.notificationsSvc.refreshUnreadCount();
            },
                error => {
                    this.loggerSvc.error("notificationsModalDialog::manageNotifications::Unable to Update notifications", error);
                }
            );
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    loadEmailBody(dataItem) {
        if (this.angularEnabled) {
            this.notificationsSvc.getEmailBodyTemplateUIAngular(dataItem.NLT_ID).subscribe(response => {
                this.emailTable = this.sanitized.bypassSecurityTrustHtml(response.toString());
                this.loading = false;
            },
                error => {
                    this.loggerSvc.error("notificationsModalDialog::getEmailBodyTemplateUI::Unable to get the Template", error);
                }
            );
        }
        else {
            this.notificationsSvc.getEmailBodyTemplateUI(dataItem.NLT_ID).subscribe(response => {
                //To retain the styles which received through the response and bind response to html template, bypassSecurityTrustHtml is used
                this.emailTable = this.sanitized.bypassSecurityTrustHtml(response.toString());
                this.loading = false;
            },
                error => {
                    this.loggerSvc.error("notificationsModalDialog::getEmailBodyTemplateUI::Unable to get the Template", error);
                }
            );
        }
    }

    async getAngularStatus() {
        this.angularEnabled = await this.dynamicEnablementService.isAngularEnabled();
    }

    async ngOnInit() {
        await this.getAngularStatus();
        this.loadEmailBody(this.dataItem);
        this.markAsRead(this.dataItem);
    }


}

