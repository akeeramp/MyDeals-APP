import { Component,  Input, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "admin-view-exceptions",
    templateUrl: "Client/src/app/admin/legalException/admin.viewExceptions.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminviewExceptionsComponent {
    constructor() { }

    @Input() exdetails: any;
    @Input() childhidden: any;
}