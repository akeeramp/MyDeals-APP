import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";
import { widgetConfig } from './widget.config';

export interface DialogData {
  name: string;
  widgets:Array<string>
}

@Component({
    selector: "add-widget",
    templateUrl:"Client/src/app/dashboard/addWidget.component.html"
  })

  export class addWidgetComponent {
    constructor(
      public dialogRef: MatDialogRef<addWidgetComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    public selWidget = "";
    public listItems: Array<string>;
  
    onNoClick(): void {
      this.dialogRef.close();
    }
    ngOnInit(){
        this.listItems=_.pluck(widgetConfig,"type");
        this.listItems =_.difference(this.listItems, this.data.widgets);
      }
  }
  