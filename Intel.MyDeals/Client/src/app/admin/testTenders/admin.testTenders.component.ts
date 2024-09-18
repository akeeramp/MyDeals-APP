import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { logger } from "../../shared/logger/logger";
import { admintestTendersService } from "./admin.testTenders.service";
import { Component, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TenderTransferRootObject } from "../supportScript/admin.supportScript.model";

@Component({
    selector: "admin-test-tenders",
    templateUrl: "Client/src/app/admin/testTenders/admin.testTenders.component.html",
    styleUrls: ['Client/src/app/admin/testTenders/admin.testTenders.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class adminTestTendersComponent implements PendingChangesGuard, OnDestroy{
    constructor(private loggerSvc: logger, private admintestTendersService: admintestTendersService, private formBuilder: FormBuilder,) {}


    private admintestTendersForm: FormGroup;
    private dateValue: Date;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    isDirty = false;
    //get method for easy access to the form fields.
    get formData() { return this.admintestTendersForm.controls; }

    excutetestTendersData(): void {
        const JsonObj = {
            'header': {
                'source_system': 'pricing_tenders',
                'target_system': 'mydeals',
                'action': 'create',
                'xid': '152547827hdhdh'
            },
            'recordDetails': {
                'SBQQ__Quote__c': {
                    'Id': this.admintestTendersForm.value.CNTRCT_SF_ID,
                    'Name': 'Q-02446',
                    'Pricing_Folio_ID_Nm__c': '',
                    'SBQQ__Account__c': {
                        'Id': this.admintestTendersForm.value.CNTRCT_SF_ID,
                        'Name': this.admintestTendersForm.value.CNTRCT_CUST,
                        'Core_CIM_ID__c': ''
                    },
                    'Pricing_Deal_Type_Nm__c': 'ECAP',
                    'Pricing_Customer_Nm__c': this.admintestTendersForm.value.END_CUST,
                    'Pricing_Project_Name_Nm__c': 'FMH',
                    'Pricing_ShipmentStDate_Dt__c': this.admintestTendersForm.value.START_DT,
                    'Pricing_ShipmentEndDate_Dt__c': this.admintestTendersForm.value.END_DT,
                    'Pricing_Server_Deal_Type_Nm__c': 'HPC',
                    'Pricing_Region_Nm__c': this.admintestTendersForm.value.GEO,
                    'SBQQ__QuoteLine__c': [
                        {
                            'Id': this.admintestTendersForm.value.DEAL_SF_ID,
                            'Name': 'QL-0200061',
                            'Pricing_Deal_RFQ_Status_Nm__c': '',
                            'Pricing_ECAP_Price__c': this.admintestTendersForm.value.ECAP,
                            'Pricing_Meet_Comp_Price_Amt__c': '90',
                            'Pricing_Unit_Qty__c': this.admintestTendersForm.value.VOLUME,
                            'Pricing_Deal_RFQ_Id__c': this.admintestTendersForm.value.DEAL_ID,
                            'Pricing_Status_Nm__c': '',
                            'SBQQ__Product__c': {
                                'Id': this.admintestTendersForm.value.DEAL_SF_ID,
                                'Name': this.admintestTendersForm.value.PROD_IDs,
                                'Core_Product_Name_EPM_ID__c': '192283'
                            },
                            'Pricing_Competetor_Product__c': {
                                'Id': '',
                                'Name': ''
                            },
                            'Pricing_Performance_Metric__c': [
                                {
                                    'Id': this.admintestTendersForm.value.DEAL_SF_ID,
                                    'Name': 'PM-000010',
                                    'Pricing_Performance_Metric_Nm__c': 'SpecInt',
                                    'Pricing_Intel_SKU_Performance_Nbr__c': '10',
                                    'Pricing_Comp_SKU_Performance_Nbr__c': '9',
                                    'Pricing_Weighting_Pct__c': '100'
                                }
                            ]
                        }
                    ],
                    'Pricing_Comments__c': [
                        {
                            'Id': '',
                            'Name': '',
                            'Pricing_Question__c': '',
                            'Pricing_Answer__c': ''
                        }
                    ]
                }
            }
        }
        const jsonDataPacket = JSON.stringify(JsonObj);
        this.admintestTendersService.ExecutePostTest(jsonDataPacket).pipe(takeUntil(this.destroy$)).subscribe((res: TenderTransferRootObject) => {
            if (res) {
                this.isDirty=false;
                this.loggerSvc.success("Post Test executed succesfully");
            }
        });
    }

    ngOnInit(): void {
        this.admintestTendersForm = new FormGroup({
            CNTRCT_SF_ID: new FormControl('50130000000X1', Validators.required),
            CNTRCT_CUST: new FormControl('Dell', Validators.required),
            END_CUST: new FormControl('Facebook', Validators.required),
            START_DT: new FormControl((new Date()), Validators.required),
            END_DT: new FormControl((new Date()), Validators.required),
            GEO: new FormControl('EMEA', Validators.required),
            DEAL_SF_ID: new FormControl('001i000001AWbWu', Validators.required),
            ECAP: new FormControl('100', Validators.required),
            VOLUME: new FormControl('300', Validators.required),
            DEAL_ID: new FormControl('543212', Validators.required),
            PROD_IDs: new FormControl('Intel® Xeon® Processor E7 - 8870 v4', Validators.required)
        });
        this.admintestTendersForm.valueChanges.subscribe((x) => {
          this.isDirty=true;
          });
    }
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}