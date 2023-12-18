import { Component, Inject, ViewEncapsulation,OnDestroy } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridStatusBoardService } from "../../core/gridStatusBoard/gridStatusBoard.service";
import { logger } from "../../shared/logger/logger";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { MomentService } from "../../shared/moment/moment.service";
import { contractStatusWidgetService } from '../contractStatusWidget.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface DialogData {
    startDate: string;
    endDate: string;
    selectedCustIds: any;
}

@Component({
    providers: [GridStatusBoardService],
    selector: "copy-contract",
    templateUrl: "Client/src/app/dashboard/copyContract/copyContract.component.html",
    styleUrls: ['Client/src/app/dashboard/copyContract/copyContract.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CopyContractComponent implements OnDestroy {
    constructor(public dialogRef: MatDialogRef<CopyContractComponent>,
                private loggerSvc: logger,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private dataService: GridStatusBoardService,
                private ctrctWdgtSvc: contractStatusWidgetService,
                private momentService: MomentService) {}

    private copyLoading = true;
    private copyCntrctCustomerName = '<All>';
    private copyCntrctSelectedItem = {};
    private copyCntrctStartDate = this.momentService.moment(this.data.startDate).format("MM/DD/YYYY");
    private copyCntrctEndDate = this.momentService.moment(this.data.endDate).format("MM/DD/YYYY");
    private includeTenders = true;
    private selectedCustomerIds: Array<any> = [];
    private copyCntrctList: any;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    //public copyLoading = true;
    private spinnerMessageHeader = "Loading contracts";
    private spinnerMessageDescription = "Please wait while we load your contracts.";

    public gridData: GridDataResult;
    public orgGridData: GridDataResult;
    private isCreateDisabled = true;

    public state: State = {
        skip: 0,
        group: []
    };

    onCopyCntrctCancelClick(): void {
        this.dialogRef.close();
    }

    dismissPopup(): void {
        this.dialogRef.close();
    }

    onCopyCntrctSearchTextChanged(searchValue): void {
        this.copyCntrctSelectedItem = {};
        this.isCreateDisabled = true;
        if(this.orgGridData && this.orgGridData['data'] && this.orgGridData['data'].length>0){
            this.gridData['data'] = this.orgGridData['data'].filter(
                item => ((item.TITLE.toLowerCase()).includes(searchValue.toLowerCase())
                    || (item.CNTRCT_OBJ_SID.toString()).includes(searchValue))
            )
        }
    }

    rowSelectionChange(selection): void {
        Object.assign(this.copyCntrctSelectedItem, selection.selectedRows[0].dataItem);
        this.isCreateDisabled = false;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.copyCntrctList, this.state);
    }

    loadCopyContract() {
        if (this.data.selectedCustIds) {
            this.selectedCustomerIds = this.data.selectedCustIds.map(obj => {
                return obj['CUST_SID'];
            })
        }

        this.ctrctWdgtSvc.getCustomerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
                const custNms = [];
                for (let i = 0; i < response.length; i++) {
                    if (this.selectedCustomerIds.indexOf(response[i].CUST_SID) >= 0) {
                        custNms.push(response[i].CUST_NM);
                    }
                }
                this.copyCntrctCustomerName = custNms.length === 0
                    ? "All" : custNms.length > 4 ? custNms.length + " customers selected" : custNms.join(", ");
            },
                function (error) {
                    this.logger.error("CopContract::loadCopyContract::Unable to GetMyCustomerNames.", error);
                });

        const postData = {
            "CustomerIds": this.selectedCustomerIds,
            "StartDate": this.copyCntrctStartDate,
            "EndDate": this.copyCntrctEndDate,
            "DontIncludeTenders": this.includeTenders
        }
        this.dataService.getContracts(postData)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
                this.copyCntrctList = response;
                this.gridData = process(this.copyCntrctList, this.state);
                this.orgGridData = process(this.copyCntrctList, this.state);
                //this.isCopyCntrctListLoaded = true;
                this.copyLoading = false;
            }, (error) => {
                this.loggerSvc.error("copyContract::ngOnInit::Unable to GetDashboardContractSummary.", error);
            }
            );

        this.copyCntrctSelectedItem = {};
        this.isCreateDisabled = true;
    }

    ngOnInit(): void {
        this.loadCopyContract();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}