/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Input, Component, OnInit } from "@angular/core";
import { each, sample } from 'underscore';

import { FunFact, LoadingPanelService } from "./loadingPanel.service";
import { logger } from "../../shared/logger/logger";

export interface FunFactDefined {
  Title: string,
  Description: string,
  FontAwesomeIcon: string
}

@Component({
  selector: 'loading-panel-angular',
  templateUrl: 'Client/src/app/core/loadingPanel/loadingPanel.component.html',
  styleUrls:['Client/src/app/core/loadingPanel/loadingPanel.component.css']
})
export class LoadingPanelComponent implements OnInit {

  constructor(private loadingPanelService: LoadingPanelService,
              private loggerService: logger) {}

  @Input() private show: string;
  @Input() private header: string;
  @Input() private description: string;
  @Input() private msgType: string;
  @Input() private isShowFunFact: string = 'false';

  private funfactsList: FunFactDefined[] = [];
  private funFactTitle = "";
  private funFactDesc = "";
  private funFactIcon = "";
  private isFunFactEnabled = true;
  private currFunFact: FunFactDefined = null;

  getRandomFact() {
    if (this.funfactsList == null || this.funfactsList.length == 0) {
      this.loadingPanelService.GetActiveFunfacts().subscribe((result: FunFact[]) => {
        if (result && result.length == 0) {
          this.isFunFactEnabled = false;
        } else {
          each(result, (item: FunFact) => {
            this.funfactsList.push({
              Title: item.FACT_HDR,
              Description: item.FACT_TXT,
              FontAwesomeIcon: `fa-${ item.FACT_ICON }`,
            });
          });
          this.setFacts();
        }
      }, (error) => {
        this.loggerService.error("LoadingPanelComponent::getRandomFact::GetActiveFunfacts::", error);
      });
    } else {
      this.setFacts();
    }
  }

  setFacts() {
    this.currFunFact = sample(this.funfactsList);
    if (!this.currFunFact.Title) {
      this.currFunFact.Title = "Fun Fact";
    }
    this.funFactTitle = this.currFunFact.Title;
    this.funFactDesc = this.currFunFact.Description.replace(/<br>/g, '\n');
    this.funFactIcon = this.currFunFact.FontAwesomeIcon;
  }

  ngOnInit() {
    if(this.isShowFunFact){
      this.isFunFactEnabled = String(this.isShowFunFact) == 'true' ? true : false;
      if (this.isFunFactEnabled === true) {
        this.getRandomFact();
      }
    }
  }

}