import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, ViewEncapsulation } from "@angular/core"
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { dbAuditToolsService } from "./admin.dbAuditTools.service";
import { forEach } from 'underscore';

@Component({
    selector: "dbAuditToolsViewModal",
    templateUrl: "Client/src/app/admin/dbAuditTools/admin.dbAuditToolsViewModal.component.html",
    styleUrls: ['Client/src/app/admin/dbAuditTools/admin.dbAuditTools.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class DbAuditToolsViewModalComponent {
    private jsonData = this.data.selectedDataInfoJson;
    private procName = this.data.selectedProcName;
    private envName = this.data.selectedEnvName;
    private myTextarea = "";

    constructor(
        private dbAuditToolsSVC: dbAuditToolsService,
        @Inject(MAT_DIALOG_DATA) public data, 
        private loggerSvc: logger,
        public dialogRef: MatDialogRef<DbAuditToolsViewModalComponent>) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }

    close() {
        this.dialogRef.close();
    }

    ngOnInit() {
        let b = 1;
        this.dbAuditToolsSVC.GetObjText(this.jsonData).subscribe((result: Array<any>) => {
            let ReturnData = (JSON.parse(result.toString()).DATA as any[]).sort((a, b) => (a.LineNbr - b.LineNbr));
            let tempTextareaData = "";
            for (let LineNbr in ReturnData) {
                tempTextareaData = tempTextareaData.concat(ReturnData[LineNbr].LineText);
            }

            this.myTextarea = tempTextareaData;

        }, (error) => {
            this.loggerSvc.error('Error in retreiving DB Object Text for ' + this.procName + ' - ' + this.envName, error);
        });
    }


}