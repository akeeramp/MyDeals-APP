import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { MatDialog } from '@angular/material/dialog';

import { NewContractWidgetService } from "./newContractWidget.service"
import { CopyContractComponent } from '../copyContract/copyContract.component';
import { TenderFolioComponent } from "../../contract/tenderFolio/tenderFolio.component";

@Component({
    selector: 'app-widget-newcontract',
    templateUrl: "Client/src/app/dashboard/newContractWidget/newContractWidget.component.html",
    styleUrls: ["Client/src/app/dashboard/newContractWidget/newContractWidget.component.css"]
})
export class NewContractWidgetComponent implements OnInit, OnDestroy {

    @Input() widget;
    @Input() resizeEvent: EventEmitter<GridsterItem>;
    @Input() private startDt: string;
    @Input() private endDt: string;
    @Input() private custIds: any;

    resizeSub: Subscription;
    isTender = false;
    C_CREATE_CONTRACT = this.newContractWidgetService.chkDealRules('C_CREATE_CONTRACT', (<any>window).usrRole, null, null, null);

    //Need to change these text fields on resize event when width increases & decreases
    createContractText = 'Create a My Deals Contract';
    copyContractText = 'Copy a My Deals Contract';
    createTenderFolioText = 'Create a Customer Tender Folio';

    constructor(private newContractWidgetService: NewContractWidgetService,
                protected dialog: MatDialog) { }

    openTenderFolioDialog() {
        //Tender folio component needs to be called and opened from here as a modal
        const dialogRef = this.dialog.open(TenderFolioComponent, {
            panelClass: 'tender-folio-dialog',
            width: '600px',
            height: '400px',
            disableClose: true,
            data: {
                 name: "Tender Folio Details",
                 selectedCustomers: this.custIds
                }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //Redirect to contract detail screen for tender creation
                window.location.href = "Contract#/tendermanager/" + result;
            }
        });
    }

    private MIN_VALID_DATE: Date = new Date(1753, 1, 1);  // SQL Limit
    private MAX_VALID_DATE: Date = new Date(9999, 12, 31);  // SQL Limit
    private isDateValid(dateToValidate: Date): boolean {
        if (dateToValidate == null || dateToValidate.toString().includes('Invalid') || dateToValidate < this.MIN_VALID_DATE || dateToValidate > this.MAX_VALID_DATE) {
            return false;
        } else {
            return true;
        }
    }
    // Checks that dates are valid on their own and that they are in the right order (Start <= End)
    private get areDatesValid(): boolean {
        const START_DATE = new Date(this.startDt);
        const END_DATE = new Date(this.endDt);
        return this.isDateValid(START_DATE) && this.isDateValid(END_DATE) && (START_DATE <= END_DATE);
    }
    openCopyCntrctDlg() {
        const dialogref = this.dialog.open(CopyContractComponent, {
            width: "800px",
            height: "620px",
            disableClose: true,
            data: {
                'startDate': this.startDt,
                'endDate': this.endDt,
                'selectedCustIds': this.custIds
            },
        });
        dialogref.afterClosed().subscribe(result => {
            if (result) {
                document.location.href = "Contract#/contractdetails/copycid/" + result.CNTRCT_OBJ_SID;
            }
        });
    }

    goToCreateContract(){
        const selectedCustomerValue  = (this.custIds && this.custIds.length > 0) ? this.custIds[0] : undefined;
        /*=> Emitting "value/undefined" both since the behavioursubject's getvalue() method holds the last emitted value.
                So even when no customer is selected in dashboard , we're emitting "undefined". Thus at time of checking/listening
                it doesn't get last customer's value and instead get "undefined" which signifies no customer was selected. */   
        this.newContractWidgetService.selectedCustomer.next(selectedCustomerValue);
        window.location.href = "Contract#/contractdetails/0";
    }

    ngOnInit(): void {
        this.resizeSub = this.resizeEvent.subscribe((widget) => {
            if (widget === this.widget) { // or check id , type or whatever you have there
                // resize your widget, chart, map , etc.
            }
        });
    }

    ngOnDestroy(): void {
        this.resizeSub.unsubscribe();
    }

}