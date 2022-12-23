import { Component, Inject } from '@angular/core';
import { logger } from '../../../shared/logger/logger';
import { renameTitleService } from '../renameTitle/renameTitle.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: "rename-title",
    templateUrl: "Client/src/app/contract/ptModals/renameTitle/renameTitle.component.html",
    styleUrls: ['Client/src/app/contract/ptModals/renameTitle/renameTitle.component.css'],
})

export class RenameTitleComponent {
    constructor(
        private reNmSvc: renameTitleService,
        private loggerSvc: logger,
        public dialogRef: MatDialogRef<RenameTitleComponent>,
        @Inject(MAT_DIALOG_DATA) public renameData: any
    ) { }

    private mode: string = "";
    private TITLE: string = "";
    private hideErrMsg: boolean = true;
    private errMsg: string = "";

    onCancel(): void {
        this.dialogRef.close();
    }

    onSave() {
        this.updateAtrbValue(this.renameData.data.dc_type, this.renameData.data.DC_ID, "TITLE", this.TITLE);
    }

    updateAtrbValue(objSetType, ids, atrb, value) {
        this.loggerSvc.info("Saving", "Please wait while your information is being saved.");
        const data = {
            objSetType: objSetType,
            ids: [ids],
            attribute: atrb,
            value: value
        };
        const custId = this.renameData.contractData.CUST_MBR_SID;
        const contractId = this.renameData.contractData.DC_ID
        this.reNmSvc.updateAtrbValue(custId, contractId, data).subscribe((response: any) => {
            this.loggerSvc.success("Done", "Save Complete.");
            this.dialogRef.close(this.TITLE);
        }), err => {
            this.loggerSvc.error("Error", "Could not save the value.");
        };
    }

    ngOnInit() {
        this.mode = this.renameData.mode;
        this.TITLE = this.renameData.data.TITLE;
    }

}
