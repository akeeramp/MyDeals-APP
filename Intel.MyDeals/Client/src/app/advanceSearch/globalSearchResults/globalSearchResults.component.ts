import * as angular from "angular";
import {Component,ElementRef,EventEmitter,Input, Output,ChangeDetectorRef} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {globalSearchResultsService} from "./globalSearchResults.service";
import {logger} from "../../shared/logger/logger";
import { Observable } from "rxjs";

@Component({
  selector: "global-search-results-angular",
  templateUrl: "Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.html",
  styleUrls:["Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.css"]
})

export class GlobalSearchResultsComponent  {
    constructor(protected globalSearchSVC:globalSearchResultsService,private loggerSvc:logger,private ref:ChangeDetectorRef) {
    
    }
    //these are input coming from gloablsearch component
    @Input() searchText="";
    @Input() opType="ALL";
    @Output() getWindowWidth = new EventEmitter;  
    @Output() isWindowOpen=new EventEmitter;
    private resultTake=5;
    private viewMoreVisible=true;
    private opTypes:Array<any> = [
      {
          value: "ALL",
          label: "ALL"
      },
      {
          value: "CNTRCT",
          label: "Contract"
      },
      {
          value: "PRC_ST",
          label: "Pricing Strategy"
      },
      {
          value: "PRC_TBL",
          label: "Pricing Table"
      },
      {
          value: "WIP_DEAL",
          label: "Deals"
      }
    ]
    private objTypes:any={
      'CNTRCT':{result:[],loading:true,viewMore:false},
      'PRC_ST':{result:[],loading:true,viewMore:false},
      'PRC_TBL':{result:[],loading:true,viewMore:false},
      'WIP_DEAL':{result:[],loading:true,viewMore:false}
    };

    getOBJonly(type:string){
      this.objTypes[type].loading=true;
      this.objTypes[type].viewMore=false;
      this.globalSearchSVC.getObjectType(this.searchText,this.resultTake,type).subscribe(Result =>{
          this.objTypes[type].result=Result;
          this.objTypes[type].loading=false;
          //this method is added for UI to render proper. without this line the UI databinding is not happening from dashboard search screen but it will work fine for header search
          this.ref.detectChanges();
        if(this.objTypes[type].result.length==5){
          this.objTypes[type].viewMore=true;
        }
      },err=>{
        this.loggerSvc.error("GlobalSearchResultsComponent::getOBJonly",err);
      })
    }
    getObjectTypeResult(opType:string){
      //setting loading to default true
       if(opType=="ALL"){
        this.getOBJonly('CNTRCT');
        this.getOBJonly('PRC_ST');
        this.getOBJonly('PRC_TBL');
        this.getOBJonly('WIP_DEAL');
       }
       else if(opType=="CNTRCT"){
        this.getOBJonly('CNTRCT');
       }
       else if(opType=="PRC_ST"){
        this.getOBJonly('PRC_ST');
       }
       else if(opType=="PRC_TBL"){
        this.getOBJonly('PRC_TBL');
       }
       else {
        this.getOBJonly('WIP_DEAL');
       }
    }
    txtEnterPressed(event:any) {
      //KeyCode 13 is 'Enter'
      if (event.keyCode === 13 && this.searchText != "") {
        //opening kendo window
         this.getObjectTypeResult(this.opType);
      }
    }
    windowResize(){
      if(this.opType =="ALL"){
        this.getWindowWidth.emit(950);
      }
      else{
        this.getWindowWidth.emit(565);
      }
    }
    onOpTypeChange(opType:string) {
      if (this.searchText != "") {
        this.opType=opType;
        this.resultTake=5;
        this.windowResize();
        this.getObjectTypeResult(this.opType);
     }
    }
    gotoOBJ(DCID:any,opType:string){
     this.isWindowOpen.emit(false);
     if(opType=='CNTRCT'){
      window.location.href = "/Contract#/manager/" + DCID;
     }
     else if(opType=='PRC_ST'){
      window.location.href = "/advancedSearch#/gotoPs/" + DCID;
     }
     else if(opType=='PRC_TBL'){
      window.location.href = "/advancedSearch#/gotoPt/" + DCID;
     }
     else {
      window.location.href = "/advancedSearch#/gotoDeal/" + DCID;
     }
    }
    viewMore(opType:string){
      this.resultTake=50;
      this.getObjectTypeResult(opType);
    }
    //yet to migrate Advance Search Screen
    gotoAdvanced() {
        //$("#winGlobalSearchResults").data("kendoWindow").close();
        //let force = (window.location.href.indexOf("advancedSearch#") >= 0);
        window.location.href = "/advancedSearch#/attributeSearch";
        //if (force) window.location.reload(true);
    }
    ngOnInit() {
        this.getObjectTypeResult(this.opType);
   }
   
}

angular.module("app").directive(
  "globalSearchResultsAngular",
  downgradeComponent({
    component: GlobalSearchResultsComponent,
  })
);
