import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as moment from 'moment';
import * as _ from "underscore";


@Component({
    selector: "kendo-calendar-angular",
    template: `<div class="container-fluid overflow">
    <div class="row">
        <div class="col">
            <h1 class="another-header-geo" mat-dialog-title>Please select a date</h1>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div mat-dialog-content>
                <kendo-datepicker
                  calendarType="classic"
                  [(value)]="value"
              ></kendo-datepicker>
            </div>
        </div>
    </div>
    <div class="row justify-content-end">
        <div class="col">
            <div class="bottom-btns" mat-dialog-actions>
                <button mat-button (click)="onNoClick()" class="btn btn-warning">Cancel</button>
                <button mat-button (click)="onSave()" cdkFocusInitial class="btn btn-primary">Save & Close</button>
            </div>
        </div>
    </div>
</div>`,
  
  })


  export class kendoCalendarComponent {
   public value: Date = new Date(2000, 2, 10);
    constructor(
      public dialogRef: MatDialogRef<kendoCalendarComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {}
    
    onSave(){
      let date=moment(this.value).format('MM/DD/YYYY');
      this.dialogRef.close(date);
    }
    ngOnInit() {
      if(this.data && this.data.cellCurrValues){
        this.value = new Date(this.data.cellCurrValues);
      }
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }