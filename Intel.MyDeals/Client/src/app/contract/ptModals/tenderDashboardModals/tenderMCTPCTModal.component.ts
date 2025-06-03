import { logger } from "../../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject, OnDestroy } from "@angular/core";
import { pricingTableservice } from "../../pricingTable/pricingTable.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "tender-mct-pct-modal",
    templateUrl: "Client/src/app/contract/ptModals/tenderDashboardModals/tenderMCTPCTModal.component.html",
    encapsulation: ViewEncapsulation.None
})
export class tenderMCTPCTModalComponent implements OnDestroy {
    constructor(private loggerSvc: logger, public dialogRef: MatDialogRef<tenderMCTPCTModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private pricingTableSvc: pricingTableservice) {
        dialogRef.disableClose = true;// prevents pop up from closing when user clicks outside of the MATDIALOG
    }
    private c_Id: any;
    private isMeetComp: boolean = false;
    private selLnav: string = "pctDiv";
    private contractData: any;
    private UItemplate: any;
    private selectedTab: number = 0;
    private modifieddata: any;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();

    loadAllContractDetails() {
        this.pricingTableSvc.readContract(this.c_Id).pipe(takeUntil(this.destroy$)).subscribe((response: Array<any>) => {
            if (response && response.length > 0) {
                this.contractData = response[0];
                this.contractData.PRC_ST = response[0].PRC_ST.filter(x => x.DC_ID == this.data.PRC_ST_OBJ_SID);
            }
            else {
                this.loggerSvc.error('No result found.', 'Error');
            }
        }, (error) => {
            this.loggerSvc.error('loadAllContractDetails::readContract:: service', error);
        })

    }
    refreshMCTData(data) {
        if (data.length > 0)
            this.modifieddata = data;
    }
    closeWindow() {
        this.dialogRef.close(this.modifieddata);
    }
    ngOnInit() {
        this.c_Id = this.data.CNTRCT_OBJ_SID;
        this.isMeetComp = this.data.isMeetComp;
        if (!this.isMeetComp) {
            this.loadAllContractDetails();
            this.UItemplate = this.data.UItemplate;
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}