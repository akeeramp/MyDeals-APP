import * as angular from "angular";
import {Component,ViewChild } from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import { GlobalSearchResultsComponent } from "../globalSearchResults/globalSearchResults.component";

@Component({
  selector: "global-search-angular",
  templateUrl: "Client/src/app/advanceSearch/globalSearch/globalSearch.component.html",
  styleUrls:["Client/src/app/advanceSearch/globalSearch/globalSearch.component.css"],
  
})

export class GlobalSearchComponent  {
  //for calling Child function from Parent
  @ViewChild(GlobalSearchResultsComponent) GlobalSearchResults: GlobalSearchResultsComponent; 
    private searchText="";
    private opType="ALL";
    private searchDialogVisible=false;
    private resultTake=5;
    private windowOpened= false;
    private windowTop = 220;windowLeft = 370;windowWidth = 950;windowHeight = 500;windowMinWidth = 100;
 
    enterPressed(event:any) {
      //KeyCode 13 is 'Enter'
      if (event.keyCode === 13 && this.searchText != "") {
         //opening kendo window
         this.executeOnly('ALL');
         this.setWindowWidth();
         this.windowOpened=true;
      }
      if(event.keyCode === 13 && this.searchText == ""){
        this.searchDialogVisible=true;
      }
    }
    setWindowWidth(){
      if(this.opType=="ALL"){
        this.windowWidth=1000;
      }
      else{
        this.windowWidth=600;
      }
    }
    closeDialog(){
      this.searchDialogVisible=false;
    }
    executeOnly(opType:string){
        if (this.searchText != "") {
            //opening kendo window
            this.opType=opType;
            this.setWindowWidth();
            //this condition is required since this should work only if kendo window is open 
            if (this.GlobalSearchResults) {
                this.GlobalSearchResults.onOpTypeChange(this.opType);
                this.windowOpened = true;
            }
            else {
                this.windowOpened = true;
            }
        }
        else {
            this.searchDialogVisible = true;
        }
    }
    windowClose() {
      this.windowOpened = false;
    }
    //these methond is an output method from globaslsearchresult component
    getWindowWidth($event:number){
      this.windowWidth=$event;
    }
    isWindowOpen($event:boolean){
        this.windowOpened = $event;
        this.searchText = "";
    }
}

angular.module("app").directive(
  "globalSearchAngular",
  downgradeComponent({
    component: GlobalSearchComponent,
  })
);
