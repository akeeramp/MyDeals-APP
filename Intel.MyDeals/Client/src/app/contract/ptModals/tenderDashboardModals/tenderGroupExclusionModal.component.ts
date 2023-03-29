import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";

@Component({
    selector: "tender-group-exclusion-modal",
    templateUrl: "Client/src/app/contract/ptModals/tenderDashboardModals/tenderGroupExclusionModal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class tenderGroupExclusionModalComponent {
    constructor( public dialogRef: MatDialogRef<tenderGroupExclusionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    private isShowPCT: boolean = false;
    private contractData: any = this.data.contractData;
    private selLnav: string = this.data.selLnav;
    private UItemplate: any = this.data.UItemplate;
    private wipIDs: any = [];
    closeWindow() {
        this.dialogRef.close();
    }
}