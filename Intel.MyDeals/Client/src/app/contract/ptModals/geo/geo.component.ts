import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";

export interface DialogData {
  selVal?: string;
  source?:any,
  name: string;
}

@Component({
    selector: "geo-selector",
    templateUrl:"Client/src/app/contract/ptModals/geo/geo.component.html"
  })

  export class GeoSelectorComponent {
    private listItems:Array<string>=[];
    private value:Array<string>=[];
    private isBlend:boolean=false;
    private isBidGeo: boolean = false;
    private isCustDiv: boolean = false;
    constructor(
      public dialogRef: MatDialogRef<GeoSelectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    
    onSave(){
      let result='';
      if(this.isBlend){
       if(_.indexOf(this.value,'Worldwide')>=0){
        let nonWorld=_.reject(this.value,(itm)=>{return itm =='Worldwide'});
        result=`[${nonWorld.toString()}],Worldwide`
       }
       else{
        result=`[${this.value.toString()}]`
       }
      }
      else{
        result=this.value.toString();
      }
      this.dialogRef.close(result);
    }
    ngOnInit() {
        this.isBidGeo = this.data.name.includes("Bid");
        this.isCustDiv = this.data.name.includes("Divisions");
        this.listItems=this.data.source;
        //identifying blend is enabled or no if yes enable the flag and remove the scquare bracket
        this.isBlend=(this.data.selVal?.indexOf("[") >= 0);
        if(this.isBlend){
          this.value=this.data.selVal? this.data.selVal.replace('[','').replace(']','').split(','):null;
        }
        else{
          this.value=this.data.selVal? this.data.selVal.split(','):null;
        }
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }