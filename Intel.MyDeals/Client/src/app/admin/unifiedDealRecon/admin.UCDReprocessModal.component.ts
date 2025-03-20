import { logger } from "../../shared/logger/logger";
import { MatDialogRef } from "@angular/material/dialog";
import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
import { unifiedDealReconService } from './admin.unifiedDealRecon.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { END_CUST_OBJ, ReprocessUCD_OBJ } from "./admin.unifiedDealRecon.model";
import { Countires } from "../PrimeCustomers/admin.primeCustomers.model";

@Component({
    selector: "reprocess-UCD",
    templateUrl: "Client/src/app/admin/unifiedDealRecon/admin.UCDReprocessModal.component.html",
    styleUrls: ['Client/src/app/admin/unifiedDealRecon/admin.unifiedDealRecon.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class reprocessUCDModalComponent implements OnDestroy {
    constructor(public dialogRef: MatDialogRef<reprocessUCDModalComponent>, private loggerSvc: logger, private unifiedDealReconSvc: unifiedDealReconService) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private endCustCountries: string[] = [];
    private countries: string[];
    private dealId = '';
    private endCustomer = '';
    private endCustCountry = '';
    private objReprocessUCD_OBJ: ReprocessUCD_OBJ;
    private isAlert = false;
    private alertMsg = ''
    private isError = true; 
    private isErrordeal = false;
    private isErrorCust = false;
    private isErrorctry = false;
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

    submit(): void {
        Object.keys(this.formGroup.controls).forEach(key => {
            this.formGroup.controls[key].markAsTouched();
        }); 
        this.validateControls();
        this.objReprocessUCD_OBJ = {
            "DEAL_ID": this.dealId, 
            "END_CUSTOMER": this.endCustomer,
            "END_CUSTOMER_COUNTRY": this.endCustCountry
        }
        if (this.isError == false) {
            this.unifiedDealReconSvc.ReprocessUCD(this.objReprocessUCD_OBJ).pipe(takeUntil(this.destroy$)).subscribe((response: string) => {
                const result: string = response;
                this.alertMsg = result.toString(); 
                this.isAlert = true;
            },
                () => {
                    this.alertMsg = "Re-Process Failed";
                    this.isAlert = true;
                });
        }
    }

    closeWindow(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            DEAL_ID: new FormControl("",
                Validators.compose([
                    Validators.pattern("^[0-9]*$")
            ])),
            END_CUSTOMER: new FormControl(""),
            END_CUSTOMER_COUNTRY: new FormControl("")
        });
        this.loadDetails();
    }
    closeAlert(): void {
        this.isAlert = false;
        if (this.alertMsg == "Re-Process Successfull") this.closeWindow();
    }

    validateControls(): void {
        if (this.dealId.split(",").length > 5) {
            this.alertMsg = "Max 5 deals allowed in case deal is entered";
            this.isError = true;
            this.isAlert = true;
        } else {
            if (this.dealId == "" && this.endCustomer == "" && (this.endCustCountry == "" || this.endCustCountry == undefined)) {
                this.isErrordeal = true;
                this.isErrorCust = true;
                this.isErrorctry = true;
                this.isError = true;
            }
            if (this.dealId != "" && this.endCustomer == "" && (this.endCustCountry == "" || this.endCustCountry == undefined)) {
                const exactMatch = new RegExp("^[0-9]*$");
                if (!exactMatch.test(this.dealId)) {
                    this.isErrordeal = true; 
                    this.isErrorCust = false;
                    this.isErrorctry = false;
                    this.isError = true;
                }
                else {
                    this.isErrordeal = false;
                    this.isErrorCust = false;
                    this.isErrorctry = false;
                    this.isError = false;
                } 
            }
            if (this.dealId == "" && this.endCustomer != "" && (this.endCustCountry == "" || this.endCustCountry == undefined)) {
                this.isErrordeal = false;
                this.isErrorCust = false;
                this.isErrorctry = true;
                this.isError = true;
            }
            if (this.dealId == "" && this.endCustomer == "" && this.endCustCountry != "" && this.endCustCountry != undefined) {
                this.isErrordeal = false;
                this.isErrorCust = true;
                this.isErrorctry = false;
                this.isError = true;
            }
            if (this.dealId == "" && this.endCustomer != "" && this.endCustCountry != "" && this.endCustCountry != undefined) {
                this.isErrordeal = false;
                this.isErrorCust = false;
                this.isErrorctry = false;
                this.isError = false;
            }
        } 
    }

  
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}