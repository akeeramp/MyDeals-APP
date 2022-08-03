import * as angular from "angular";
import {Component,ElementRef,EventEmitter,Input, Output,ChangeDetectorRef} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {globalSearchResultsService} from "./globalSearchResults.service";
import {logger} from "../../shared/logger/logger";
import { Observable } from "rxjs";
import { DynamicEnablementService } from "../../shared/services/dynamicEnablement.service";

@Component({
  selector: "global-search-results-angular",
  templateUrl: "Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.html",
  styleUrls:["Client/src/app/advanceSearch/globalSearchResults/globalSearchResults.component.css"]
})

export class GlobalSearchResultsComponent  {
    constructor(protected globalSearchSVC: globalSearchResultsService, private dynamicEnablementService: DynamicEnablementService, private loggerSvc: logger, private ref: ChangeDetectorRef) {}
    //these are input coming from gloablsearch component
    @Input() searchText = "";
    response :any
    
    @Input() opType="ALL";
    @Output() getWindowWidth = new EventEmitter;  
    @Output() isWindowOpen=new EventEmitter;
    private resultTake=5;
    private viewMoreVisible = true;
    //To load angular Contract Manager from search change value to false, will be removed once contract manager migration is done
    public readonly angularJSEnabled = this.dynamicEnablementService.isAngularJSEnabled();
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
    gotoOBJ(item: any, opType: string) {
        let DCID = item.DC_ID
        this.isWindowOpen.emit(false);
        if (DCID <= 0) {
            this.loggerSvc.error("Unable to locate the Pricing Strategy.", "error")
            return;
        }
      if (opType == 'CNTRCT' ) {
          if (this.angularJSEnabled) window.location.href = "/Contract#/manager/" + DCID;
          else  window.location.href = "/Dashboard#/contractmanager/CNTRCT/" + DCID + "/0/0/0";
     }
      else if (opType == 'PRC_ST' || opType == 'PRC_TBL' || opType == 'WIP_DEAL') {
          if (this.angularJSEnabled) window.location.href = (opType == 'PRC_ST') ? "/advancedSearch#/gotoPs/" + DCID : (opType == 'PRC_TBL') ? "/advancedSearch#/gotoPt/" + DCID : "/advancedSearch#/gotoDeal/" + DCID;
          else {
              // calling this function because to navigate to the PS we need contract data,PS ID and PT ID -- in the item we dont have PT ID for opType ->PS so hitting API to get data
              //in case of WIp deal click on the global search results we need contract id ,PS and PT ID to navigate to respective deal so calling this function to hit the api to get the details
              //in case of PT ID click on the global search results we need contract ID which is not present in item so calling API to get the data
              this.getIDs(DCID, item.DC_PARENT_ID, opType)
          }
     }
    }

    viewMore(opType:string){
      this.resultTake=50;
      this.getObjectTypeResult(opType);
    }

    getIDs(dcId, parentdcID, opType = "") {
        this.globalSearchSVC.getContractIDDetails(dcId,opType).subscribe(res => {
            if (res) {
                this.response = res;
                console.log(this.response.ContractId)
                if (opType == "WIP_DEAL")
                window.location.href = "/Dashboard#/contractmanager/WIP/" + this.response.ContractId + "/" + this.response.PricingStrategyId + "/" + this.response.PricingTableId + "/" + dcId;
                else if (opType == "PRC_ST")
                    window.location.href = "/Dashboard#/contractmanager/PS/" + this.response.ContractId + "/" + this.response.PricingStrategyId + "/" + this.response.PricingTableId + "/0";
                else window.location.href = "/Dashboard#/contractmanager/PT/" + this.response.ContractId + "/" + parentdcID + "/" + dcId + "/0";
            }
        },
            error => {
                this.loggerSvc.error("GlobalSearchResultsComponent::getContractIDDetails::Unable to get Contract Data", error);
            }
        );
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
