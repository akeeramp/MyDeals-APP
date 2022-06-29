
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";

@Component({
    selector: "autofill-selector",
    templateUrl:"Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.html"
  })

  export class AutoFillComponent {
    constructor(
      public dialogRef: MatDialogRef<AutoFillComponent>,
      @Inject(MAT_DIALOG_DATA) public PT:any
    ) {}
    
    ngOnInit(){
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }
  
  angular.module("app").directive(
    "autofillSelector",
    downgradeComponent({
      component: AutoFillComponent,
    })
  );
  