import { Component,  Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "admin-view-exceptions",
    templateUrl: "Client/src/app/admin/legalException/admin.viewExceptions.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminviewExceptionsComponent {
    constructor() {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @Input() exdetails: any;
    @Input() childhidden: any;
}