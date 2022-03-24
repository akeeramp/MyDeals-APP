import * as angular from "angular";
import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
    renameItem: string
}

@Component({
    selector: "widget-settings",
    templateUrl: "Client/src/app/dashboard/widgetSettings/widgetSettings.component.html",
})

export class widgetSettingsComponent {
    constructor(public dialogRef: MatDialogRef<widgetSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {

        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    cancelWidgetSetting(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}