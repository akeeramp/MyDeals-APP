import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: "notificationsModalDialog",
    template: `<link href="/Client/node_modules/@angular/material/prebuilt-themes/indigo-pink.css" rel="stylesheet" />
                <h1 mat-dialog-title>Notification Modal</h1>
                <div mat-dialog-content>
                    <p>notification Modal HTML controller need to be migrated</p>
                </div>
                <div mat-dialog-actions>
                    <button mat-button (click)="closeDialog()">Ok</button>
                </div>`,
})

export class notificationsModalDialog {
    constructor(
        public dialogRef: MatDialogRef<notificationsModalDialog>) { }

    closeDialog(): void {
        this.dialogRef.close();
    }
}

angular.module("app").directive(
    "modalPopComponent",
    downgradeComponent({
        component: notificationsModalDialog,
    })
);