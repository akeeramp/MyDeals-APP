import { logger } from "../../shared/logger/logger";
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pushDealsToVistexService } from "./admin.pushDealstoVistex.service";
import { GridDataResult, DataStateChangeEvent} from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from "@angular/router";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PushDealstoVistexResults } from "./admin.pushDealstoVistex.model";

@Component({
    selector: "admin-push-dealsto-vistex",
    templateUrl: "Client/src/app/admin/pushDealstoVistex/admin.pushDealstoVistex.component.html",
    styleUrls: ['Client/src/app/admin/pushDealstoVistex/admin.pushDealstoVistex.component.css']
})

export class adminPushDealsToVistexComponent implements PendingChangesGuard, OnDestroy{

    constructor(private loggerSvc: logger, private pushDealstoVistexSvc: pushDealsToVistexService, private formBuilder: FormBuilder, private route: ActivatedRoute) { }
    isDirty = false;
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private color: ThemePalette = 'primary';
    private pushDealsToVistexForm: FormGroup;
    private Results: PushDealstoVistexResults[] = [];
    private UpdCnt = { 'all': 0, 'error': 0, 'success': 0 };
    private showResults = false;
    public gridData: GridDataResult;
    public state: State = {
        group: [],
        sort: []
        // Initial filter descriptor
    };

    

    //get method for easy access to the form fields.
    get formData() { return this.pushDealsToVistexForm.controls; }

    ValidateAndSendDeals(): void {
        this.pushDealsToVistexForm.patchValue({
            //below line of code removes if any whitespaces or consecutives commas present in the user input
            DEAL_IDS: this.pushDealsToVistexForm.value.DEAL_IDS.replace(/\s/g, '').split(',').filter(x => x).join(',')
               
        });
        if (this.pushDealsToVistexForm.invalid) {
            this.showResults = false;
            this.loggerSvc.warn("Please fix validation errors","Validation error");
            return;
        }
        this.pushDealstoVistexSvc.PushDealstoVistex(this.pushDealsToVistexForm.value).pipe(takeUntil(this.destroy$)).subscribe((result: PushDealstoVistexResults[]) => {
            this.isDirty=false;
            this.Results = result;
            this.showResults = true;
            this.UpdCnt.all = this.Results.length;
            this.UpdCnt.error = this.Results.filter(x => x.ERR_FLAG === 1).length;
            this.UpdCnt.success = this.Results.filter(x => x.ERR_FLAG === 0).length;
            this.gridData = process(this.Results, this.state);
            this.loggerSvc.success("Please Check The Results.");
        },
            error => {
                this.loggerSvc.error("adminPushDealsToVistexComponent::PushDealstoVistex::Unable to push deals to vistex", error);
            }
        );
          
    }
    bindPathQueryParam(): string {
        const dealIds = this.route.snapshot.queryParams.r3ValidDeals;
        return dealIds ? dealIds : "";
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.Results, this.state);
    }
    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }
    ngOnInit(): void {
        
        //this is useful when validateVistexR3Checks screen redirects to this 'Push Deals to Vistex' page
        const dealIdString = this.bindPathQueryParam();

        this.pushDealsToVistexForm = this.formBuilder.group({
            DEAL_IDS: [dealIdString, Validators.required],
            VSTX_CUST_FLAG:true
        });

        this.pushDealsToVistexForm.valueChanges.subscribe(x=>{
            this.isDirty=true;
        })
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}