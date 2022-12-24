import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { NewContractWidgetService } from "./newContractWidget.service"
import { MatDialog } from '@angular/material/dialog';
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
    C_CREATE_CONTRACT = false;

    //Need to change these text fields on resize event when width increases & decreases
    createContractText = 'Create a My Deals Contract';
    copyContractText = 'Copy a My Deals Contract';
    createTenderFolioText = 'Create a Customer Tender Folio';

     constructor(private newContractWidgetService: NewContractWidgetService, protected dialog: MatDialog) {
        
    }


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
                window.location.href = "#tendermanager/" + result;
            }
        });
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
                document.location.href = "#contractdetails/copycid=" + result.CNTRCT_OBJ_SID;
            }
        });
    }
    goToCreateContract(){
        const selectedCustomerValue  = (this.custIds && this.custIds.length > 0) ? this.custIds[0] : undefined;
        /*=> Emitting "value/undefined" both since the behavioursubject's getvalue() method holds the last emitted value.
                So even when no customer is selected in dashboard , we're emitting "undefined". Thus at time of checking/listening
                it doesn't get last customer's value and instead get "undefined" which signifies no customer was selected. */   
        this.newContractWidgetService.selectedCustomer.next(selectedCustomerValue);
        window.location.href = "#/contractdetails/0";
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
