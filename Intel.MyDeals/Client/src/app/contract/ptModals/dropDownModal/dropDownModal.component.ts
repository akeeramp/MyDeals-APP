import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    selVal?: string;
    source?: any,
    name: string;
}

@Component({
    selector: "drop-down-modal-selector",
    templateUrl: "Client/src/app/contract/ptModals/dropDownModal/dropDownModal.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/dropDownModal/dropDownModal.component.css']
})
export class dropDownModalComponent {
    private listItems: Array<string> = [];
    private value: string = "";
    private errMsg: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<dropDownModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onSave() {
        let result = '';
        result = this.value != null ? this.value.toString() : '';
        this.dialogRef.close(result);
    }
    ngOnInit() {
        this.listItems = this.data.source;
        this.value = this.data.selVal ? this.data.selVal : null;
        if (this.listItems.length == 0) {
            this.errMsg = true;
        }
        
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}