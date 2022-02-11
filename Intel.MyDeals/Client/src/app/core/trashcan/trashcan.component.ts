import * as angular from "angular";
import { downgradeComponent } from "@angular/upgrade/static";
import { Component } from "@angular/core";

@Component({
    selector: "trashcan",
    template: `<span role="button" class="trash">
                <span></span>
                <i></i>
               </span>`,
    styleUrls: ['Client/src/app/core/trashcan/trashcan.component.css']
})

export class TrashcanComponent {
    constructor() {

    }
}

angular.module("app").directive(
    "trashcan",
    downgradeComponent({
        component: TrashcanComponent,
    })
);
