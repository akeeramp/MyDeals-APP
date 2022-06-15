
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  product?: string;
  source?:any,
  name: string;
}

@Component({
    selector: "geo-selector",
    templateUrl:"Client/src/app/contract/ptModals/geo/geo.component.html"
  })

  export class GeoSelectorComponent {
    private listItems:Array<string>=[];
    private value:any=null;

    constructor(
      public dialogRef: MatDialogRef<GeoSelectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    ngOnInit(){
        this.listItems=this.data.source;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  angular.module("app").directive(
    "geoSelector",
    downgradeComponent({
      component: GeoSelectorComponent,
    })
  );
  