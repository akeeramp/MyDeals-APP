
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
    selector: "product-selector",
    templateUrl:"Client/src/app/contract/productSelector/productselector.component.html"
  })

  export class ProductSelectorComponent {
    constructor(
      public dialogRef: MatDialogRef<ProductSelectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  angular.module("app").directive(
    "productSelector",
    downgradeComponent({
      component: ProductSelectorComponent,
    })
  );
  