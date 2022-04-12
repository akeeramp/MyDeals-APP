import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from "underscore";
import { NgForm } from '@angular/forms';
import { TenderFolioService } from '../tenderFolio/tenderFolio.service';

@Component({
    providers: [TenderFolioService],
    selector: "app-tender-folio",
    templateUrl: "Client/src/app/contract/tenderFolio/tenderFolio.component.html",
    styleUrls: ["Client/src/app/contract/tenderFolio/tenderFolio.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class TenderFolioComponent {

    constructor(
        public dialogRef: MatDialogRef<TenderFolioComponent>,
        @Inject(MAT_DIALOG_DATA) public data, private dataService: TenderFolioService

    ) { }

    private isLoading = true;
    private contractType = "Tender Folio";
    private custName;
    private tenderName;
    public listItems: Array<string> = [
        "A", "B", "C"
    ];
    private contractData: any;
    private selectedData: any;
    private isCustSelected = false;
    private custSID: any;
    private custDIV: any;

    dismissPopup(): void {
        this.dialogRef.close();
    }
    selectDealType() {
        //selecting deal type for tender folio
    }

    valueChange(value: any) {
        this.isCustSelected = false;
        if (value) {
            //this.selectedData = value;
            this.custSID = value;
            this.dataService.getCustDivBySID(this.custSID.CUST_SID)
                .subscribe(res => {
                    if (res) {
                        res = res.filter(data => data.CUST_LVL_SID === 2003);
                        if (res[0].PRC_GRP_CD == '') {
                            window.alert("Missing Price Group Code");
                        }
                        this.selectedData = res;
                        this.isCustSelected = this.selectedData.length <= 1 ? false : true;
                        if (this.isCustSelected) {
                            this.dialogRef.updateSize('600px', '485px');
                        } else {
                            this.dialogRef.updateSize('600px', '380px')
                        }
                    }
                });
        }
    }

    getAllCustomers() {
        this.dataService.getCustomerDropdowns().subscribe(res => {
            if (res) {
                this.contractData = res;
                this.isLoading = false;
                this.isCustSelected = false;
            }
        })
    }

    customContractValidate() {
        //to be implemented when logic will be picked

    }

    ngOnInit() {
        this.getAllCustomers();
    }
}