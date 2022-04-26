import * as angular from "angular";
import { Component, Input } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";

@Component({
    selector: "tenderManager",
    templateUrl: "Client/src/app/contract/tenderManager/tenderManager.component.html",
})

export class tenderManagerComponent {
    public c_Id: number;

    ngOnInit() {
        let url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
    }
}

angular.module("app").directive(
    "tenderManager",
    downgradeComponent({
        component: tenderManagerComponent,
    })
);

