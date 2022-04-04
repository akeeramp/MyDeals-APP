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
    }

    cancelWidgetSetting(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}