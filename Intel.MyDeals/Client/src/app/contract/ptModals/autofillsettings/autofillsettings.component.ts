
import * as angular from "angular";
import {downgradeComponent} from "@angular/upgrade/static";
import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from "underscore";
import { forkJoin } from 'rxjs';
import { autoFillService } from "./autofillsetting.service";
import { logger } from '../../../shared/logger/logger';

@Component({
    selector: "autofill-selector",
    templateUrl:"Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.html",
    styleUrls:["Client/src/app/contract/ptModals/autofillsettings/autofillsettings.component.css"]
  })

  export class AutoFillComponent {
    private dropdownResponses:any = null;
    private isLoading:boolean=false;
    private spinnerMessageHeader:string="AutoFillSetting Loading";
    private rebateTypeTitle:string="";
    private spinnerMessageDescription:string="AutoFillSetting loading please wait";
    private geoValues:Array<string>=[];
    private isBlend:boolean=false;

    constructor(
      private autoSvc: autoFillService,
      private loggerSvc: logger,
      public dialogRef: MatDialogRef<AutoFillComponent>,
      @Inject(MAT_DIALOG_DATA) public autofillData:any
    ) {}
  

    async getAllDrowdownValues(){
      let dropObjs={};
      _.each(this.autofillData.DEFAULT,(val,key)=>{
        if(val.opLookupUrl && val.opLookupUrl !='' && val.opLookupUrl !=undefined){
          if(key=='PERIOD_PROFILE'){
            let custId =this.autofillData.CUSTSID? parseInt(this.autofillData.CUSTSID):0;
            dropObjs[`${key}`]=this.autoSvc.readDropdownEndpoint(val.opLookupUrl+`/${custId}`);
          }
          else{
            dropObjs[`${key}`]=this.autoSvc.readDropdownEndpoint(val.opLookupUrl);
          }
        }
           
        });
        let result= await forkJoin(dropObjs).toPromise().catch((err) => {
          this.loggerSvc.error('AutoFillComponent::getAllDrowdownValues::service', err);
        });
        return result;
  
      }
    onNoClick(): void {
      this.dialogRef.close();
    }
    onSave(){
      this.dialogRef.close(this.autofillData);
    }
    async loadAutoFill() {
      this.isLoading=true;
      this.dropdownResponses= await this.getAllDrowdownValues();
      let geoVals=this.autofillData.DEFAULT?this.autofillData.DEFAULT['GEO_COMBINED'].value:'';
      this.isBlend=(geoVals?.indexOf("[") >= 0);
      if(this.isBlend){
        this.geoValues=geoVals? geoVals.replace('[','').replace(']','').split(','):[];
      }
      else{
        this.geoValues=geoVals;
      }
      this.isLoading=false;
    }
    onAutoChange(elem:string,val:string){
      this.autofillData.DEFAULT[`${elem}`].value=val;
    }
    OnGeoChange(elem:string,val:Array<string>){
      this.geoValues=val;
      this.autofillData.DEFAULT[`${elem}`].value=val;
    }
    ngOnInit(){
      this.rebateTypeTitle = this.autofillData.ISTENDER ? "Tender Table" : "Pricing Table";
      this.loadAutoFill();
    }
  
  }
  
  angular.module("app").directive(
    "autofillSelector",
    downgradeComponent({
      component: AutoFillComponent,
    })
  );
  