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
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @Input() dealDetail;

    colorStyle(){
        return { "background-color": colorDictionary["type"][this.dealDetail.OBJ_SET_TYPE_CD] };
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}
angular.module("app").directive(
    "deal-details-angular",
    downgradeComponent({
        component: dealDetailsComponent,
    })
);