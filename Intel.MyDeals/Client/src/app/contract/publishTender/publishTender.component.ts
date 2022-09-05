import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";

@Component({
    selector: "publish-tender",
    templateUrl: "Client/src/app/contract/publishTender/publishTender.component.html",
    styleUrls: ["Client/src/app/contract/publishTender/publishTender.component.css"]
})

export class publishTenderComponent {
    constructor(private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    public showMCTag = false;

    publishTenderDeal() {
        window.location.href = "/advancedSearch#/tenderDashboard";
    }

    ngOnInit() { }

}