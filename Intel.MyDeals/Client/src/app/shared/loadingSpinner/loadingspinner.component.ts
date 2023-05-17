import { Component } from "@angular/core";
import { LoadingSpinnerService } from "./loadingspinner.service";
import { logger } from "../logger/logger";
import { contains, first } from 'underscore';

@Component({
  selector: 'app-loader',
  templateUrl: 'Client/src/app/shared/loadingSpinner/loadingspinner.component.html',
    styles: [`
      #saving-bar {
        position: absolute;
        right: 1px;
        bottom: 0;
        opacity: .8;
        margin-bottom: -2px;
        overflow: hidden;
      }

      #saving-text {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 210px;
        height: 12px;
        font-size: 10px;
        font-family: arial;
        line-height: .9em;
        text-align: center;
        overflow: hidden;
        text-transform: uppercase;
      }`]
})
export class LoadingSpinnerComponent {
  private isLoading = true;
  private dontAddTheseInRecents = "portal";
  private recents: Array<any> = [];
  private distinctURL: Array<any> = [];

  constructor(private loaderSvc: LoadingSpinnerService,
              private loggerSVC: logger) {
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
      if (!contains(recentArray, window.location.href)) {
        //pushing to the begening 
        recentArray.unshift(window.location.href);
        //identifying the recent 10 records 
        recentArray = first(recentArray, 10);
        localStorage.setItem("recentsURLs", recentArray.toString());
      }
    } else {
      localStorage.setItem("recentsURLs", window.location.href);
    }
  } 
}