import * as angular from 'angular';
import {Input, Component, OnInit} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {loadingPanelService} from "./loadingpanel.service";
import {logger} from "../../shared/logger/logger";
import * as _ from "underscore";

@Component({
  selector: 'loading-panel-angular',
  templateUrl: 'Client/src/app/core/loadingPanel/loadingpanel.component.html'
})
export class LoadingPanelComponent implements OnInit {

  constructor(
    private loadingSvc: loadingPanelService,
    private loggerSvc: logger
  ) {}

  @Input() private show: string;
  @Input() private header: string;
  @Input() private description: string;
  @Input() private msgType: string;
  @Input() private isShowFunFact: string='false';

  private funfactsList: Array<any> = [];
  private funFactTitle = "";
  private funFactDesc = "";
  private funFactIcon = "";
  private isFunFactEnabled = true;
  private currFunFact = null;

  GetRandomFact() {
    if (this.funfactsList == null || this.funfactsList.length == 0) {
      this.loadingSvc.GetActiveFunfacts().subscribe(
        (result: Array<any>) => {
          if (result && result.length == 0) {
            this.isFunFactEnabled = false;
          } else {
            _.each(result, item => {
              this.funfactsList.push({
                Title: item.FACT_HDR,
                Description: item.FACT_TXT,
                FontAwesomeIcon: `fa-${item.FACT_ICON}`,
              });
            });
            this.setFacts();
          }
        },
        error => {
          this.loggerSvc.error(
            "LoadingPanelComponent::GetRandomFact::GetActiveFunfacts::",
            error
          );
        }
      );
    } else {
      this.setFacts();
    }
  }

  setFacts() {
    this.currFunFact = _.sample(this.funfactsList);
    if (!this.currFunFact.Title) {
      this.currFunFact.Title = "Fun Fact";
    }
    this.funFactTitle = this.currFunFact.Title;
    this.funFactDesc = this.currFunFact.Description.replace(/<br>/g, "\n");
    this.funFactIcon = this.currFunFact.FontAwesomeIcon;
  }

  ngOnInit() {    
    if(this.isShowFunFact){
      this.isFunFactEnabled = String(this.isShowFunFact) == 'true' ? true : false;
      if (this.isFunFactEnabled === true) {
        this.GetRandomFact();
      }
    }
  }
}

angular.module("app").directive(
  "loadingPanelAngular",
  downgradeComponent({
    component: LoadingPanelComponent,
    inputs: ["show", "header", "description", "msgType", "isShowFunFact"],
  })
);
