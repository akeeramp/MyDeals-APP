import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: "notificationsSettingsDialog",
    template: `<link href="/Client/node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet" />
                <h1 mat-dialog-title>Notification Settings</h1>
                <div mat-dialog-content>
                    <p>notification Settings HTML controller need to be migrated</p>
                </div>
                <div mat-dialog-actions>
                    <button mat-button (click)="closeDialog()">Ok</button>
                </div>`,
})

export class notificationsSettingsDialog {
    constructor(
        public dialogRef: MatDialogRef<notificationsSettingsDialog>) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}

angular.module("app").directive(
    "modalPopComponent",
    downgradeComponent({
        component: notificationsSettingsDialog,
    })
);