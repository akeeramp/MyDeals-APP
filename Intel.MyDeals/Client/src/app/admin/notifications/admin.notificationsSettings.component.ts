import { logger } from "../../shared/logger/logger";
import { Component,ViewEncapsulation} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { notificationsService } from './admin.notifications.service';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: "notificationsSettingsDialog",
    templateUrl: "Client/src/app/admin/notifications/admin.notificationsSettings.component.html",
    styleUrls: ['Client/src/app/admin/notifications/admin.notifications.component.css'],
    //Added the below line to remove padding for the default mat dialog class
    //To override the default css for the mat dialog and give our own css then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None 
})

export class notificationsSettingsDialog {
    constructor(
        public dialogRef: MatDialogRef<notificationsSettingsDialog>, private notificationsSvc: notificationsService, private loggerSvc: logger) { }

    private role = (<any>window).usrRole;
    public loading = true;
    private color: ThemePalette = 'primary';
    public subScriptions;

    // Select all default values
    public selectAllDefaults = { 'EMAIL_IND': false, 'IN_TOOL_IND': true };

   selectAll(type) {
        for (let i = 0; i <= this.subScriptions.length - 1; i++) {
            this.subScriptions[i][type] = this.selectAllDefaults[type];
        }
    }

    // Close without saving data
    close() {
        this.dialogRef.close();
    }

    getUserSubscription() {
        this.notificationsSvc.getUserSubscriptions().subscribe(response=>  {
            this.subScriptions = response;
            this.setSelectAllValues();
            this.loading = false;
        },
            error => {
                this.loggerSvc.error("notificationsSettingsDialog::getUserSubscriptions::Unable to get user subscription.", error);
                this.loading = false;
            }
        );
    }
    setSelectAllValues() {
        const emailON = this.subScriptions.filter(x => x.EMAIL_IND == true);
        this.selectAllDefaults.EMAIL_IND = emailON.length > 0;

        const inToolON = this.subScriptions.filter(x => x.IN_TOOL_IND == true);
        this.selectAllDefaults.IN_TOOL_IND = inToolON.length > 0;
    }

    setSubscription(i, event,input) {
            if (input == "EMAIL_IND") {
                this.subScriptions[i].EMAIL_IND = event.checked? true:false;
                const emailON = this.subScriptions.filter(x => x.EMAIL_IND == true);
                this.selectAllDefaults.EMAIL_IND = emailON.length > 0;
            }
            else {
                this.subScriptions[i].IN_TOOL_IND = event.checked ? true : false;
                const inToolON = this.subScriptions.filter(x => x.IN_TOOL_IND == true);
                this.selectAllDefaults.IN_TOOL_IND = inToolON.length > 0;
            }
    }

     //Save data and close
    saveAndClose() {
        this.loading = true;
        this.notificationsSvc.updateUserSubscriptions(this.subScriptions).subscribe(() => 
        {
            this.dialogRef.close();
            this.loading = false;
        },
            error => {
                this.loggerSvc.error("notificationsSettingsDialog::updateUserSubscriptions::Unable to Update user subscription.", error);
                this.loading = false;
            }
        );
    }
    ngOnInit() {
        this.getUserSubscription();
    }
}

