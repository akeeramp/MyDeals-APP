import * as angular from "angular";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";

@Component({
    selector: "tenderManager",
    templateUrl: "Client/src/app/contract/tenderManager/tenderManager.component.html",
})

export class tenderManagerComponent {
    public c_Id: number;

    ngOnInit() {
        const url = window.location.href.split('/');
        this.c_Id = Number(url[url.length - 1]);
    }
}

angular.module("app").directive(
    "tenderManager",
    downgradeComponent({
        component: tenderManagerComponent,
    })
);

