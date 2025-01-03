import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridDataResult } from "@progress/kendo-angular-grid";

@Component({
    selector: "action-summary-dialog",
    templateUrl: "Client/src/app/contract/contractManager/actionSummaryModal/actionSummaryModal.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/actionSummaryModal/actionSummary.component.css'],
    //Added the below line to remove extra padding which is present for the default mat dialog container
    //To override the default css for the mat dialog and remove the extra padding then encapsulation should be set to none 
    encapsulation: ViewEncapsulation.None
})

export class actionSummaryModal {
    constructor(public dialogRef: MatDialogRef<actionSummaryModal>, @Inject(MAT_DIALOG_DATA) public data) {
    }
    public gridData: GridDataResult; 
    public showErrMsg: boolean;       
        ngOnInit() {
            if (this.data.cellCurrValues !== "" && this.data.cellCurrValues !== undefined) {
                this.gridData = this.data.cellCurrValues;
                this.showErrMsg = this.data.showErrMsg;

            }

        }
        ok(){
            this.dialogRef.close('success');
        }
        cancel(){
            this.dialogRef.close('cancel');
        }
    

}
