import { logger } from "../../shared/logger/logger";
import { expireYcs2Service } from "./admin.expireYcs2.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "admin-expireycs2",
    templateUrl: "Client/src/app/admin/expireYcs2/admin.expireYcs2.component.html",
    styleUrls: ['Client/src/app/admin/expireYcs2/admin.expireYcs2.component.css']
   

})

export class ExpireYcs2Component implements OnInit,OnDestroy{    
    constructor(private expireYcs2Svc: expireYcs2Service, private loggerSvc: logger,private formBuilder: FormBuilder) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private responseData = [];
    private isLoading = false;        
    private expireYCS2Form: FormGroup;
    private state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
     //get method for easy access to the form fields.
    get formData() { return this.expireYCS2Form.controls; }
    submit() {                            
        this.expireYCS2Form.patchValue({
            //below line of code removes if any whitespaces or consecutives commas present in the user input
            DEAL_IDS: this.expireYCS2Form.value.DEAL_IDS.replace(/\s/g, '').split(',').filter(x => x).join(',')
        });
        if (this.expireYCS2Form.invalid) {
            this.loggerSvc.warn("Please fix validation errors","Validation error");                        
            return;
        }
        if (this.expireYCS2Form.valid) {
            this.isLoading = true;
            this.expireYcs2Svc.expireYcs2(this.expireYCS2Form.value).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
                if (result) {
                    this.isLoading = false;
                    this.gridResult = result;
                    this.gridData = process(result, this.state);
                    this.responseData.unshift(result);
                    this.loggerSvc.success("YCS2 is expired successfully for the valid deals.");                                        
                } else {
                    this.loggerSvc.error('DANG!! Something went wrong...', '');
                }

            }, (error) => {
                this.loggerSvc.error('Unable to run API', error);
            });
        }

    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }    
    ngOnInit(){
        this.expireYCS2Form = this.formBuilder.group({
            DEAL_IDS : ["", Validators.required]
        });
    }    
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}