
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  selVal?: string;
  source?:any,
  name: string;
}

@Component({
    selector: "market-selector",
    templateUrl:"Client/src/app/contract/ptModals/marketSegment/marketSeg.component.html"
  })

  export class marketSegComponent {
    private listItems:Array<string>=[];
    private value:Array<string>=[];


    constructor(
      public dialogRef: MatDialogRef<marketSegComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    ngOnInit(){
        this.listItems=this.data.source;
        this.value=this.data.selVal.split(',');
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  angular.module("app").directive(
    "marketSelector",
    downgradeComponent({
      component: marketSegComponent,
    })
  );
  