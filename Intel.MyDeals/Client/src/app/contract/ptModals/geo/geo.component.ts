import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { indexOf, reject } from 'underscore';

export interface DialogData {
  selVal?: string;
  source?:any,
  name: string;
}
@Component({
    selector: "geo-selector",
    templateUrl: "Client/src/app/contract/ptModals/geo/geo.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/geo/geo.component.css']
  })

  export class GeoSelectorComponent {
    private listItems:Array<string>=[];
    private value:Array<string>=[];
    private isBlend:boolean=false;
    private isBidGeo: boolean = false;
    private isCustDiv: boolean = false;
    private geoMarkArr: Array<string> = [];
    private newEmptyArr: Array<string> = [];

    constructor(
      public dialogRef: MatDialogRef<GeoSelectorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
    
    onSave(){
      let result='';
      if(this.isBlend){
       if(indexOf(this.value,'Worldwide')>=0){
        let nonWorld=reject(this.value,(itm)=>{return itm =='Worldwide'});
        result=`[${nonWorld.toString()}],Worldwide`
       }
       else{
        result= this.value.length > 0 ? `[${this.value.toString()}]` : ''
       }
      }
      else if (this.isCustDiv) {
          result = this.value.join('/');
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
          this.value=this.data.selVal? this.data.selVal.replace('[','').replace(']','').split(','):[];
        }
        else if (this.isCustDiv) {
            this.value = this.data.selVal ? this.data.selVal.split('/') : [];
        }
        else{
          this.value=this.data.selVal? this.data.selVal.split(','): [];
        }

        let valTmps = this.value;
        let tmps = this.listItems;
        this.value = this.newEmptyArr;
        for (var i = 0; i < valTmps.length; i++) {
            let valTmp = valTmps[i];
            for (var j = 0; j < tmps.length; j++) {
                let tmp = tmps[j];
                if (tmp == valTmp) {
                    this.geoMarkArr.push(valTmp);
                    this.value = this.geoMarkArr;
                }
            }
        }
        
    }
    onNoClick(): void {
      this.dialogRef.close();
    }
  }