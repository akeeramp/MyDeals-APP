
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";

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
    
    valueChange(event:any){
      if(event && event.length>0){
        if(_.indexOf(event,'All Direct Market Segments')>=0){
          this.value=['All Direct Market Segments'];
        }
      }
    }
    ngOnInit(){
        this.listItems=this.data.source;
        this.value=this.data.selVal?this.data.selVal.split(','):null;
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
  