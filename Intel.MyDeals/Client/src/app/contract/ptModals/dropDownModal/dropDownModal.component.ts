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
    public valCheck: string = '';
    private errMsg: boolean = false;
    private infoMsg: string = "";
    constructor(
        public dialogRef: MatDialogRef<dropDownModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onSave() {
        let result = '';
        result = this.value != null ? this.value.toString() : '';
        this.valCheck = this.data.selVal;
        if (this.valCheck === result) {
            this.dialogRef.close();
        } else {
            this.dialogRef.close(result);
        }
    }

    checkInfoMessages(dlgTitle, dlgValue) {
        // Standard place to put information updates for this type of dialog if needed
        // TO DO: would be nice to drive this off of element title instead of dialog title
        this.infoMsg = "";
        var applicableRebateTypes: string[];
        applicableRebateTypes = ["MDF ACCRUAL", "NRE ACCRUAL", "MDF/NRE ACCRUAL"];
        if (dlgTitle == "Select Rebate Type *" && applicableRebateTypes.indexOf(dlgValue) !== -1) {
            this.infoMsg = "Note: 'Rebate Type Selection of Accrual' will result in Payout based upon accruals earned via Billings or Consumption";
        }
    }

    ngOnInit() {
        this.listItems = this.data.source;
        this.value = this.data.selVal ? this.data.selVal : null;
        this.checkInfoMessages(this.data.name, this.data.selVal); // Post information updates if needed
        if (this.listItems.length == 0) { // Post errors if needed
            this.errMsg = true;
        }
    }

    onDropChange(value: any) { // Post information updates if needed
        this.checkInfoMessages(this.data.name, value);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}