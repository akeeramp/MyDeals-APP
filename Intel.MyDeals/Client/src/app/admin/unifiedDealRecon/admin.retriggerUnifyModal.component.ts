import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject } from "@angular/core";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { ThemePalette } from "@angular/material/core";
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { unifiedDealReconService } from './admin.unifiedDealRecon.service';
import { each } from 'underscore';

@Component({
    selector: "retrigger-UCD",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.retriggerUnifyModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class retriggerUnifyModalComponent {
    constructor(public dialogRef: MatDialogRef<retriggerUnifyModalComponent>, private loggerSvc: logger, private unifiedDealReconSvc: unifiedDealReconService) { }
    private endCustCountries: any[] = [];
    private countries: any[];
    private dealId: string = '';
    private endCustomer: string = '';
    private endCustCountry: string = '';
    private END_CUST_OBJ: any;
    private isAlert: boolean = false;
    private alertMsg: string = ''
    loadDetails() {
        this.unifiedDealReconSvc.getCountries().subscribe((response) => {
            this.endCustCountries = this.countries = response.map(x => x.CTRY_NM);
        }, (error) => {
            this.loggerSvc.error('Failed to get Data', 'Error', error);
        });
    }

    filter(event) {
        this.endCustCountries = event != '' ? this.countries.filter(x => x.toLowerCase().includes(event.toLowerCase())) : this.countries;
    }

    submit() {
        this.END_CUST_OBJ = {
            "END_CUSTOMER": this.endCustomer,
            "END_CUSTOMER_COUNTRY": this.endCustCountry
        }
        this.unifiedDealReconSvc.ResubmissionDeals(this.dealId, this.END_CUST_OBJ).subscribe((response) => {
            let result: any = response;
            if (result.toString() == "true") {
                this.alertMsg = "Re-Submission Successfull";
            }
            else if (result.toString() == "false") {
                this.alertMsg = "Re-Submission Failed";
            }
            else {
                this.alertMsg = result.toString();
            }
            this.isAlert = true;

        },
        (error) => {
            this.alertMsg = "Re-Submission Failed";
            this.isAlert = true;
        });
    }

    closeWindow() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.loadDetails();
    }
    closeAlert() {
        this.isAlert = false;
        if (this.alertMsg == "Re-Submission Successfull") this.closeWindow();
    }

}