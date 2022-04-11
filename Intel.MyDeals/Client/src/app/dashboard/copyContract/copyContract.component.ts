import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridStatusBoardService } from "../../core/gridStatusBoard/gridStatusBoard.service";
import { logger } from "../../shared/logger/logger";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import * as moment from 'moment';

export interface DialogData {
    startDate: string;
    endDate: string;
}


@Component({
    providers: [GridStatusBoardService],
    selector: "copy-contract",
    templateUrl: "Client/src/app/dashboard/copyContract/copyContract.component.html",
    styleUrls: ['Client/src/app/dashboard/copyContract/copyContract.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class CopyContractComponent {
    constructor(public dialogRef: MatDialogRef<CopyContractComponent>, private loggerSvc: logger,
        @Inject(MAT_DIALOG_DATA) public data: DialogData, private dataService: GridStatusBoardService) {

    }

    private isCopyCntrctListLoaded = false;
    private copyCntrctCustomerName: string = '<All>';
    private copyCntrctSelectedItem = {};
    private copyCntrctSearchText: string = "";
    private copyCntrctStartDate = moment(this.data.startDate).format("MM/DD/YYYY");
    private copyCntrctEndDate = moment(this.data.endDate).format("MM/DD/YYYY");
    private includeTenders = true;
    private selectedCustomerIds: Array<any> = [];
    private copyCntrctList: any;

    private isLoading = true;
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

    onCopyCntrctCreateClick(): void {

    }

    onCopyCntrctSearchTextChanged(searchValue): void {
        this.gridData['data'] = this.orgGridData['data'].filter(
            item => (item.TITLE.toLowerCase()).includes(searchValue.toLowerCase())
        )
    }

    rowSelectionChange(selection): void {
        Object.assign(this.copyCntrctSelectedItem, selection.selectedRows[0].dataItem);
        this.isCreateDisabled = false;
    }

    loadCopyContract() {
        let postData = {
            "CustomerIds": this.selectedCustomerIds,
            "StartDate": this.copyCntrctStartDate,
            "EndDate": this.copyCntrctEndDate,
            "DontIncludeTenders": this.includeTenders
        }
        this.dataService.getContracts(postData)
            .subscribe(response => {
                this.copyCntrctList = response;
                this.gridData = process(this.copyCntrctList, this.state);
                this.orgGridData = process(this.copyCntrctList, this.state);
                this.isLoading = false;
                this.isCopyCntrctListLoaded = true;
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


    ngOnDestroy() {

    }
}