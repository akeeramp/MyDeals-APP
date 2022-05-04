import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "underscore";
import { configWidgets } from '../widget.config';

export interface DialogData {
    name: string;
    widgets: Array<string>;
}

@Component({
    selector: "add-widget",
    templateUrl: "Client/src/app/dashboard/addWidget/addWidget.component.html"
})

export class addWidgetComponent {
    constructor(
        public dialogRef: MatDialogRef<addWidgetComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    public listItems: Array<any>=[];
    public finalItems: Array<any> = [];

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.finalItems = configWidgets;
        _.each(this.finalItems, item => {
            const currentWidget = this.data.widgets.filter(o1 => o1["type"] === item.type);
            if (currentWidget.length==0) {
                item.isAdded = true;
            }
            else { item.isAdded = false;}
        })
    }

    add(widget) {
        if (widget.isAdded == true) {
            this.dialogRef.close(widget.type);
        }
    }
}
