import * as angular from 'angular';
import { Input,Output, Component, OnInit,EventEmitter } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { loadingPanelService } from './loadingpanel.service';
import { logger } from "../../shared/logger/logger";
import * as _ from 'underscore';

@Component({
  selector: 'loading-panel-angular',
  templateUrl: 'Client/src/app/core/loadingPanel/loadingpanel.component.html'
})
export class LoadingPanelComponent  {
  constructor(private loadingSvc: loadingPanelService, private loggerSvc: logger) {

   }
    @Input() private show: string;
    @Input() private header: string;
    @Input() private description: string;
    @Input() private msgType: string;
    @Input() private isShowFunFact:string

    private funfactsList:Array<any> = [];
    private funFactTitle:string = "";
    private funFactDesc:string = "";
    private funFactIcon:string = "";
    private isFunFactEnabled:boolean = true;
    private currFunFact:any=null;

    GetRandomFact(){
     if(this.isShowFunFact && this.isShowFunFact=='true'){
       if(this.funfactsList ==null || this.funfactsList.length==0){

        this.loadingSvc.GetActiveFunfacts().subscribe((result: Array<any>) => {
          if(result && result.length==0){
            this.isFunFactEnabled=false;
          }
          else{
            _.each(result,item =>{
              this.funfactsList.push({Title:item.FACT_HDR,Description:item.FACT_TXT,FontAwesomeIcon:`fa-${item.FACT_ICON}`}) 
            });
            this.setFacts();
          }
       
      }, (error) => {
          this.loggerSvc.error('LoadingPanelComponent::GetRandomFact::GetActiveFunfacts::', error);
      });
       }
       else{
         this.setFacts();
       }

     }
    }
    setFacts(){
      if(this.funfactsList.length>0){
        this.currFunFact=_.sample(this.funfactsList);
        if (!this.currFunFact.Title) {
          this.currFunFact.Title = "Fun Fact";
        }
        this.funFactTitle = this.currFunFact.Title;
        this.funFactDesc = this.currFunFact.Description.replace(/<br>/g, "\n");
        this.funFactIcon = this.currFunFact.FontAwesomeIcon;
      }
      
    }
    ngOnInit() {
      this.isFunFactEnabled = this.isShowFunFact=='true'?true:false;
      this.GetRandomFact();
  }
 }
angular
.module('app')
.directive("loadingPanelAngular", downgradeComponent({
  component: LoadingPanelComponent,
    inputs: ['show', 'header', 'description', 'msgType','isShowFunFact']
}));