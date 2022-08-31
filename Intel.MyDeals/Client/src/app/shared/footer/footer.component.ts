import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { footerService } from "./footer.service";
import { logger } from "../logger/logger";

@Component({
    selector: "app-footer",
    templateUrl: "Client/src/app/shared/footer/footer.component.html",
    styleUrls: ['Client/src/app/shared/footer/footer.component.css']
})

export class FooterComponent {
    constructor(private footerSvc: footerService,private loggerSVC:logger) { }
    private appVersion: string;
    private environment: string;

    loadFooter() {
        this.footerSvc.getFooterDetails().subscribe(res => {
            this.appVersion=res.AppVer;
            this.environment=res.AppEnv;
        }, err => {
           this.loggerSVC.error("FooterComponent::getFooterDetails::",err);
        });
    }
    eggDd(){
        console.log('eggDd************************');
        window.open(
            "Client/src/egg/dd/DbDug.html",
            "_blank",
            "toolbar=no,scrollbars=no,menubar=no,status=no,titlebar=no,resizable=no,width=623,height=625,top=200,left=200"
          );
    }
    ngOnInit() {
        this.loadFooter();
    }
}

angular.module("app").directive(
    "appFooter",
    downgradeComponent({
        component: FooterComponent,
    })
);
