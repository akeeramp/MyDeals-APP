import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    sourceKey?: string;
    PTR?: any,
    name: string;
}

@Component({
    selector: "info-modal-selector",
    templateUrl: "Client/src/app/contract/ptModals/infoModal/infoModal.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/infoModal/infoModal.component.css']
})
export class infoModalComponent {
    public warningMessage: string = "";
    constructor(
        public dialogRef: MatDialogRef<infoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onConfirm() {
        this.dialogRef.close(true);
    }

    ngOnInit() {        
        const { PTR, sourceKey } = this.data;
        const warningMessages = [];
        PTR.forEach(element => {
            if (element._behaviors && element._behaviors.warningMsg) {
                if (warningMessages.indexOf(element._behaviors.warningMsg[sourceKey]) === -1) {
                    warningMessages.push(element._behaviors.warningMsg[sourceKey]);
                }
            }
        });
        this.warningMessage = warningMessages.join('</br>');
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}