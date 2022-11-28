import { logger } from "../../shared/logger/logger";
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { adminlegalExceptionService } from "./admin.legalException.service";
import { GridUtil } from "../../contract/grid.util";

@Component({
    selector: "admin-download-exceptions",
    templateUrl: "Client/src/app/admin/legalException/admin.downloadExceptions.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class adminDownloadExceptionscomponent {
    constructor(public dialogRef: MatDialogRef<adminDownloadExceptionscomponent>
        , private logger: logger
        , private adminlegalExceptionSvc: adminlegalExceptionService,
        @Inject(MAT_DIALOG_DATA) public data) {        
    }

    private legalExceptionData : any;
    private chkData = {};

    download() {
        var arr = [];
        for (var j = 0; j < this.legalExceptionData.length; j++) {
            arr.push(this.legalExceptionData[j]['MYDL_PCT_LGL_EXCPT_SID']);
        }
        var pctExceptionList = arr.join();
        var chkPreviousVersion = this.chkData['PreviousVersion'];
        var chkDealList = this.chkData['DealList'];
        if (pctExceptionList != "") {
            this.adminlegalExceptionSvc.getDownloadLegalException(pctExceptionList, chkPreviousVersion, chkDealList).subscribe((response: any) => {
                if (response && response.length > 0) {
                    GridUtil.dsToExcelLegalException(this.data.grid, response, "Legal Exception Export.xlsx", false, chkDealList);
                    this.dialogRef.close();
                }
                else
                    this.logger.warn('No records exists to download', "");
            }, (error) => {
                this.logger.error('Unable to download PCT Legal exception.', error);
            });
        }
    }

    ok() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.legalExceptionData = this.data.dataItem;
        this.chkData = { PreviousVersion: false, DealList: false };
    }
}
