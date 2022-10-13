import * as angular from "angular";
import { Component, Input, ViewEncapsulation } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { colorDictionary } from "../../angular.constants";

@Component({
    selector: "deal-details-angular",
    templateUrl: "Client/src/app/core/gridCell/dealDetail/dealDetail.component.html",
    styleUrls: ['Client/src/app/core/gridCell/dealDetail/dealDetail.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class dealDetailsComponent{
    constructor() {
       
    }

    @Input() dealDetail;

    colorStyle(){
        return { "background-color": colorDictionary["type"][this.dealDetail.OBJ_SET_TYPE_CD] };
    }
    ngOnDestroy() {
    }
}
angular.module("app").directive(
    "deal-details-angular",
    downgradeComponent({
        component: dealDetailsComponent,
    })
);