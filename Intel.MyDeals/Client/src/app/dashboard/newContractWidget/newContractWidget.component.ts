import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridsterItem } from 'angular-gridster2';
import { NewContractWidgetService } from "./newContractWidget.service"
import { MatDialog } from '@angular/material/dialog';
import { CopyContractComponent } from '../copyContract/copyContract.component';
import { TenderFolioComponent } from "../../contract/tenderFolio/tenderFolio.component";
import { DynamicEnablementService } from '../../shared/services/dynamicEnablement.service';

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
    C_CREATE_CONTRACT = this.newContractWidgetService.chkDealRules('C_CREATE_CONTRACT', (<any>window).usrRole, null, null, null); //this create contract will be implemented after header component is ready

    //Need to change these text fields on resize event when width increases & decreases
    createContractText = 'Create a My Deals Contract';
    copyContractText = 'Copy a My Deals Contract';
    createTenderFolioText = 'Create a Customer Tender Folio';

    //To load angular Contract details page change value to true, will be removed once contract details migration is done
    public angularEnabled:boolean=false;

     constructor(private newContractWidgetService: NewContractWidgetService, private dynamicEnablementService: DynamicEnablementService, protected dialog: MatDialog) {
        
    }


    openTenderFolioDialog() {
        //Tender folio component needs to be called and opened from here as a modal
        const dialogRef = this.dialog.open(TenderFolioComponent, {
            panelClass: 'tender-folio-dialog',
            width: '600px',
            height: '400px',
            disableClose: true,
            data: { name: "Tender Folio Details" },
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //Redirect to contract detail screen for tender creation
                // document.location.href = "/Contract#/manager/0/details?tender=1";
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
        if (this.angularEnabled){
            window.location.href = "#/contractdetails/0";
        } 
        else {
            window.location.href = "/Contract#/manager/0/details";
        } 
    }
    async getAngularStatus(){
       this.angularEnabled=await this.dynamicEnablementService.isAngularEnabled();
    }
    ngOnInit(): void {
        //this code tells where to route  either Angular or AngularJS
        this.getAngularStatus();
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
