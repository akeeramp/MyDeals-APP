import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { notificationsService } from './admin.notifications.service';
import { logger } from "../../shared/logger/logger";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: "notificationsModalDialog",
    templateUrl: "Client/src/app/admin/notifications/admin.notificationsModal.component.html",
    styleUrls: ['Client/src/app/admin/notifications/admin.notifications.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None 
})

export class notificationsModalDialog {
    constructor(public dialogRef: MatDialogRef<notificationsModalDialog>, @Inject(MAT_DIALOG_DATA) public dataItem: any, private notificationsSvc: notificationsService, private loggerSvc: logger, private sanitized: DomSanitizer) {
    }

    private role = (<any>window).usrRole;
    public loading = true;
    public emailTable: any = "<b>Loading...</b>";

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

    async loadEmailBody(dataItem) {        
        let response:any = await this.notificationsSvc.getEmailBodyTemplateUI(dataItem.NLT_ID).toPromise().catch(error => {
            this.loggerSvc.error("notificationsModalDialog::getEmailBodyTemplateUI::Unable to get the Template", error);
        });
        this.emailTable = this.sanitized.bypassSecurityTrustHtml(response.toString());
        this.loading = false;
        this.markAsRead(this.dataItem);
    }

    ngOnInit() {
        this.loadEmailBody(this.dataItem);
    }


}