import { logger } from "../../shared/logger/logger";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
import { unifiedDealReconService } from './admin.unifiedDealRecon.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { END_CUST_OBJ } from "./admin.unifiedDealRecon.model";
import { Countires } from "../PrimeCustomers/admin.primeCustomers.model";

@Component({
    selector: "retrigger-UCD",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.retriggerUnifyModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class retriggerUnifyModalComponent implements OnDestroy {
    constructor(public dialogRef: MatDialogRef<retriggerUnifyModalComponent>, private loggerSvc: logger, private unifiedDealReconSvc: unifiedDealReconService) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private endCustCountries: string[] = [];
    private countries: string[];
    private dealId = '';
    private endCustomer = '';
    private endCustCountry = '';
    private END_CUST_OBJ: END_CUST_OBJ;
    private isAlert = false;
    private alertMsg = ''
    private isError = false;
    private isErrorEndCustomer = false;
    private validateDealId = true;
    public formGroup: FormGroup;
    loadDetails(): void {
        this.unifiedDealReconSvc.getCountries().pipe(takeUntil(this.destroy$)).subscribe((response: Countires[]) => {
            this.endCustCountries = this.countries = response.map(x => x.CTRY_NM);
        }, (error) => {
            this.loggerSvc.error('Failed to get Data', 'Error', error);
        });
    }

    filter(event: string): void {
        this.endCustCountries = event != '' ? this.countries.filter(x => x.toLowerCase().includes(event.toLowerCase())) : this.countries;
    }

    submit(retriggerFormData: any): void {

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
            this.unifiedDealReconSvc.ResubmissionDeals(this.dealId, this.END_CUST_OBJ).pipe(takeUntil(this.destroy$)).subscribe((response: string) => {
                const result: string = response;
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
                () => {
                    this.alertMsg = "Re-Submission Failed";
                    this.isAlert = true;
                });
        }
    }

    closeWindow(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
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
    closeAlert(): void {
        this.isAlert = false;
        if (this.alertMsg == "Re-Submission Successfull") this.closeWindow();
    }
    validateEndCustomer(): void {

        if (this.endCustomer == "") {
            this.isErrorEndCustomer = true;
        }
        else {
            this.isErrorEndCustomer = false;
        }
    }

    validateDealID() {
        this.isError = false;
        const exactMatch = new RegExp("^[0-9]+(,[0-9]+)*$");

        if (!exactMatch.test(this.dealId)) {
            this.validateDealId = false;
        }
        else {
            this.validateDealId = true;
        }

    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}