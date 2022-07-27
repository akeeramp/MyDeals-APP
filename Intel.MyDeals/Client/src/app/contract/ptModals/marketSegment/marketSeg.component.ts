
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";
import { Observable, of } from "rxjs";
import { CheckedState } from "@progress/kendo-angular-treeview";

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
     private checkedKeys:any[]=[];
     public key = "DROP_DOWN";

    constructor(
      public dialogRef: MatDialogRef<marketSegComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    onSelectionChange(event:any){
      if(event && event.length>0){
        if(_.indexOf(event,'All Direct Market Segments')>=0){
          this.checkedKeys=['All Direct Market Segments'];
        }
      }
    }
    hasChildren(node: any): boolean {
      return node.items && node.items.length > 0;
    }
    public fetchChildren(node: any): Observable<any[]> {
      // returns the items collection of the parent node as children
      return of(node.items);
    }
    ngOnInit(){
        this.listItems=this.data.source;
        this.checkedKeys=this.data.selVal?this.data.selVal.split(','):null;
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
    onSave():void{
      this.dialogRef.close(this.checkedKeys.toString());
    }
  }
  
  angular.module("app").directive(
    "marketSelector",
    downgradeComponent({
      component: marketSegComponent,
    })
  );
  