import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    renameItem: string
}
@Component({
    selector: "widget-settings",
    templateUrl: "Client/src/app/dashboard/widgetSettings/widgetSettings.component.html",
    styleUrls: ["Client/src/app/dashboard/widgetSettings/widgetSettings.component.css"]
})
export class widgetSettingsComponent {
    constructor(public dialogRef: MatDialogRef<widgetSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }
    cancelWidgetSetting(): void {
        this.dialogRef.close();
    }
    onKeyDown(pressedKey) {
        if (pressedKey.key === "Enter" && this.data.renameItem.trim().length != 0) {
            this.data.renameItem;
            this.dialogRef.close(this.data.renameItem);
        }
    }
}