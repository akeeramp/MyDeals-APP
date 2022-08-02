
import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { logger } from "../../../shared/logger/logger";
import * as _ from "underscore";



@Component({
  selector: "product-corrector",
  templateUrl: "Client/src/app/contract/ptModals/productCorrector/productcorrector.component.html",
  styleUrls:['Client/src/app/contract/ptModals/productCorrector/productcorrector.component.css']
})

export class ProductCorrectorComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductCorrectorComponent>,
      @Inject(MAT_DIALOG_DATA) public inValidProd: any,
    private loggerSvc: logger
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
     this.inValidProd=_.uniq(this.inValidProd);
      console.log(this.inValidProd);
  }
}

angular.module("app").directive(
  "productCorrector",
  downgradeComponent({
    component: ProductCorrectorComponent,
  })
);
