import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import {LoadingSpinnerService} from './loadingspinner.service';
import { logger } from "../logger/logger";

@Component({
    selector: "app-loader",
    templateUrl:"Client/src/app/shared/loadingSpinner/loadingspinner.component.html",
})

export class LoadingSpinnerComponent {
    private isLoading: boolean=true;

    constructor(private loaderSvc: LoadingSpinnerService,private loggerSVC:logger) {
        this.loaderSvc.isLoading.subscribe(res => {
            this.isLoading=res;
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
