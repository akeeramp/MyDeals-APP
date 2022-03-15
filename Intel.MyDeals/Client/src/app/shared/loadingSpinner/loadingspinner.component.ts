import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import {LoadingSpinnerService} from './loadingspinner.service';
import { logger } from "../logger/logger";
import * as _ from "underscore";

@Component({
    selector: "app-loader",
    templateUrl:"Client/src/app/shared/loadingSpinner/loadingspinner.component.html",
})

export class LoadingSpinnerComponent {
    private isLoading: boolean=true;
    private dontAddTheseInRecents: string = 'portal';
    private recents: Array<any> = [];
    private distinctURL: Array<any> = [];

    constructor(private loaderSvc: LoadingSpinnerService,private loggerSVC:logger) {
        this.loaderSvc.isLoading.subscribe(res => {
            this.isLoading = res;
            /* moved the below logic from adminBanner to track url changes from here and add it to the recent visited links */
            // store recents on a local storage,
            if (localStorage.recents === undefined) localStorage.setItem('recents', JSON.stringify(this.recents));
            // Get the recents on local variable
            this.recents = JSON.parse(localStorage.getItem('recents'));
            // Get the url from the state change event
            let url = window.location.href;
            if (!url.endsWith(this.dontAddTheseInRecents)) {
                // if there is already entry in recents, to make it appear in top remove and add
                this.recents.push(url);
                this.recents.unshift(url);
                this.distinctURL = _.uniq(this.recents);
                if (this.distinctURL.length > 10) {
                    this.distinctURL.length = 10;
                }
                // replace recents on localstorage
                localStorage.setItem('recents', JSON.stringify(this.distinctURL));
            }
          }, err => {
            this.loggerSVC.error("LoadingSpinnerComponent::loaderSvc**********",err);
          });
     }

    ngOnInit() {
     
    }
}

angular.module("app").directive(
    "appLoader",
    downgradeComponent({
        component: LoadingSpinnerComponent,
    })
);
