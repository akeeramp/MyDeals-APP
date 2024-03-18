import { logger } from "../../shared/logger/logger";
import { expireYcs2Service } from "./admin.expireYcs2.service";
import { Component, OnDestroy } from "@angular/core";
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

@Component({
    selector: "admin-expireycs2",
    templateUrl: "Client/src/app/admin/expireYcs2/admin.expireYcs2.component.html",
    styleUrls: ['Client/src/app/admin/expireYcs2/admin.expireYcs2.component.css']
   

})

export class ExpireYcs2Component implements OnDestroy{
    constructor(private expireYcs2Svc: expireYcs2Service, private loggerSvc: logger) { }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private responseData = [];
    private isLoading = false;
    private dealId: string = '';
    private validateDealId: boolean = true;
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
    submit() {            
        if (this.dealId.trim() == '') {            
            this.validateDealID();            
        }
        
        if (this.validateDealId && this.dealId != '') {
            this.isLoading = true;
            this.expireYcs2Svc.expireYcs2(this.dealId).pipe(takeUntil(this.destroy$)).subscribe((result: any) => {
                if (result) {
                    this.isLoading = false;
                    this.gridResult = result;
                    this.gridData = process(result, this.state);
                    this.responseData.unshift(result);

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
    validateDealID() {
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