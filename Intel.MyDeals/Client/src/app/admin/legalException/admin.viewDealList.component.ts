import { Component, Inject, ViewEncapsulation } from "@angular/core"; 
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
@Component({
    selector: "admin-viewdeal-list",
    templateUrl: "Client/src/app/admin/legalException/admin.viewDealList.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminviewDealListcomponent {
    constructor(public dialogRef: MatDialogRef<adminviewDealListcomponent>,
        @Inject(MAT_DIALOG_DATA) public data) {}

    public dealList: string;
    public pctException: string;
    public dialogTitle: string;
    public type: string;

    delete() {
        this.dialogRef.close("delete");
    }

    close() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.dealList = this.data.dealList;
        this.type = this.data.type;
        this.pctException = this.data.pctException;
        this.dialogTitle = this.data.dialogTitle;        
    }
}