import { logger } from "../../shared/logger/logger";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, Inject, OnDestroy } from "@angular/core";
import { FileRestrictions } from "@progress/kendo-angular-upload";
import { ThemePalette } from "@angular/material/core";
import Handsontable from 'handsontable';
import { HotTableRegisterer } from '@handsontable/angular';
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { unifiedDealReconService } from './admin.unifiedDealRecon.service';
import { each } from 'underscore';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "retrigger-UCD",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.retriggerUnifyModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class retriggerUnifyModalComponent implements OnDestroy {
    constructor(public dialogRef: MatDialogRef<retriggerUnifyModalComponent>, private loggerSvc: logger, private unifiedDealReconSvc: unifiedDealReconService) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private endCustCountries: any[] = [];
    private countries: any[];
    private dealId: string = '';
    private endCustomer: string = '';
    private endCustCountry: string = '';
    private END_CUST_OBJ: any;
    private isAlert: boolean = false;
    private alertMsg: string = ''
    private isError: boolean = false;
    private isErrorEndCustomer: boolean = false;
    private isErrorEndCustCountry: boolean = false;
    private validateDealId: boolean = true;
    public formGroup: FormGroup;
    loadDetails() {
        this.unifiedDealReconSvc.getCountries().pipe(takeUntil(this.destroy$)).subscribe((response) => {
            this.endCustCountries = this.countries = response.map(x => x.CTRY_NM);
        }, (error) => {
            this.loggerSvc.error('Failed to get Data', 'Error', error);
        });
    }

    filter(event) {
        this.endCustCountries = event != '' ? this.countries.filter(x => x.toLowerCase().includes(event.toLowerCase())) : this.countries;
    }

    submit(retriggerFormData) {

        Object.keys(retriggerFormData.controls).forEach(key => {
            retriggerFormData.controls[key].markAsTouched();

        });


        if (this.dealId == "" || this.endCustomer == "" || this.endCustCountry == "") {
            this.isError = true;
        }

        this.END_CUST_OBJ = {
            "END_CUSTOMER": this.endCustomer,
            "END_CUSTOMER_COUNTRY": this.endCustCountry
        }
        if (this.isError == false && this.validateDealId == true) {
            this.unifiedDealReconSvc.ResubmissionDeals(this.dealId, this.END_CUST_OBJ).pipe(takeUntil(this.destroy$)).subscribe((response) => {
                let result: any = response;
                if (result.toString() == "true") {
                    this.alertMsg = "Re-Submission Successfull";
                }
                else if (result.toString() == "IQR Deals") {
                    this.alertMsg = "Retrigger UCD request is Enabled only for My Deals originated deals and not IQR Deals";
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
    }

    closeWindow() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.formGroup = new FormGroup({
            
            DEAL_ID: new FormControl("", Validators.required),
            END_CUSTOMER: new FormControl("", Validators.required),
            END_CUSTOMER_COUNTRY: new FormControl(
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^[0-9]+(,[0-9]+)*$")
                    
                ]))
           
        });
        this.loadDetails();
    }
    closeAlert() {
        this.isAlert = false;
        if (this.alertMsg == "Re-Submission Successfull") this.closeWindow();
    }
    validateEndCustomer() {

        if (this.endCustomer == "") {
            this.isErrorEndCustomer = true;
        }
        else {
            this.isErrorEndCustomer = false;
        }
    }

    validateDealID() {
        this.isError = false;
        let exactMatch = new RegExp("^[0-9]+(,[0-9]+)*$");

        if (!exactMatch.test(this.dealId)) {
            this.validateDealId = false;
        }
        else {
            this.validateDealId = true;
        }

    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}