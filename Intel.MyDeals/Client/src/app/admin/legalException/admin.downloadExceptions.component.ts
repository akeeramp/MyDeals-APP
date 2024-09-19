import { logger } from "../../shared/logger/logger";
import { Component, Inject, ViewEncapsulation, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { adminlegalExceptionService } from "./admin.legalException.service";
import { GridUtil } from "../../contract/grid.util";
import { ExcelColumnsConfig } from "../ExcelColumnsconfig.util";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "admin-download-exceptions",
    templateUrl: "Client/src/app/admin/legalException/admin.downloadExceptions.component.html",
    styleUrls: ['Client/src/app/admin/legalException/admin.legalException.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class adminDownloadExceptionscomponent implements OnDestroy {
    constructor(public dialogRef: MatDialogRef<adminDownloadExceptionscomponent>
        , private logger: logger
        , private adminlegalExceptionSvc: adminlegalExceptionService,
        @Inject(MAT_DIALOG_DATA) public data) {        
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();

    private legalExceptionData: any;
    private legalExceptionColumns = ExcelColumnsConfig.legalExceptionExcelColumns;
    private chkData = {};

    download() {
        const arr = [];
        for (let j = 0; j < this.legalExceptionData.length; j++) {
            arr.push(this.legalExceptionData[j]['MYDL_PCT_LGL_EXCPT_SID']);
        }
        const chkPreviousVersion = this.chkData['PreviousVersion'];
        const chkDealList = this.chkData['DealList'];
        if (arr.length > 0 ) {
            this.adminlegalExceptionSvc.getDownloadLegalException(arr, chkPreviousVersion, chkDealList).pipe(takeUntil(this.destroy$))
                .subscribe((response: any) => {
                if (response && response.length > 0) {
                    GridUtil.dsToExcelLegalException(this.legalExceptionColumns, response, "Legal Exception Export.xlsx", false, chkDealList);
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

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
