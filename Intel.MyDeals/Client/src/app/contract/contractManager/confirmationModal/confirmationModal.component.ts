import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    confirmationModalName: string;
    confirmationMessage: string;  
}

@Component({
    selector: "confirmation-modal",
    templateUrl: "Client/src/app/contract/contractManager/confirmationModal/confirmationModal.component.html",
    styleUrls: ['Client/src/app/contract/contractManager/confirmationModal/confirmationModal.component.css']
})
export class confirmationModalComponent {
    public confirmationModalName: string = "";
    public confirmationMessage: string = "";
    constructor(
        public dialogRef: MatDialogRef<confirmationModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onConfirm() {
        this.dialogRef.close(true);
    }

    ngOnInit() {
        this.confirmationModalName = this.data.confirmationModalName;
        this.confirmationMessage = this.data.confirmationMessage;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}