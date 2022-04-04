import * as angular from "angular";
import {Component} from "@angular/core";
import {downgradeComponent} from "@angular/upgrade/static";
import {LoadingSpinnerService} from "./loadingspinner.service";
import {logger} from "../logger/logger";
import * as _ from "underscore";

@Component({
  selector: "app-loader",
  templateUrl:
    "Client/src/app/shared/loadingSpinner/loadingspinner.component.html",
})
export class LoadingSpinnerComponent {
  private isLoading = true;
  private dontAddTheseInRecents = "portal";
  private recents: Array<any> = [];
  private distinctURL: Array<any> = [];

  constructor(
    private loaderSvc: LoadingSpinnerService,
    private loggerSVC: logger
  ) {
    this.loaderSvc.isLoading.subscribe(
      res => {
        this.isLoading = res;
        /* moved the below logic from adminBanner to track url changes from here and add it to the recent visited links */
        this.setRecentURLs();
      },
      err => {
        this.loggerSVC.error(
          "LoadingSpinnerComponent::loaderSvc**********",
          err
        );
      }
    );
  }
  setRecentURLs() {
    const recentsUrls = localStorage.getItem("recentsURLs");
    if (recentsUrls != null && recentsUrls != undefined) {
      let recentArray = recentsUrls.split(",");
      //check for the Url present in Array
      if (!_.contains(recentArray, window.location.href)) {
        //pushing to the begening 
        recentArray.unshift(window.location.href);
        //identifying the recent 10 records 
        recentArray = _.first(recentArray, 10);
        localStorage.setItem("recentsURLs", recentArray.toString());
      }
    } else {
      localStorage.setItem("recentsURLs", window.location.href);
    }

  }
  
}
angular.module("app").directive(
  "appLoader",
  downgradeComponent({
    component: LoadingSpinnerComponent,
  })
);
