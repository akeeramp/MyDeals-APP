import { Component, Inject, Input, ViewEncapsulation } from "@angular/core"; 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "admin-compare-exceptions",
    templateUrl: "Client/src/app/admin/legalException/admin.compareExceptions.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class admincompareExceptionscomponent {
    constructor(public dialogRef: MatDialogRef<admincompareExceptionscomponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    public exdetails1: any;
    public exdetails2: any;
    public dialogTitle: any;

    close() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.exdetails1 = this.data.exdetails1;
        this.exdetails2 = this.data.exdetails2; 
        this.dialogTitle = this.data.dialogTitle;
    }
} 