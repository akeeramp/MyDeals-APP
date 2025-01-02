import { logger } from "../../shared/logger/logger";
import { Component, OnDestroy } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { uniq, pluck } from 'underscore';
import { jobMonitorService } from "./jobMonitor.service";
import { MomentService } from "../../shared/moment/moment.service";
import { format } from "@progress/kendo-angular-intl";

@Component({
    selector: 'job-monitor',
    templateUrl: 'Client/src/app/dashboard/jobMonitor/jobMonitor.component.html',
    styleUrls: ['Client/src/app/dashboard/jobMonitor/jobMonitor.component.css']
})

export class jobMonitorComponent implements PendingChangesGuard, OnDestroy {
    
    constructor(private jobMonitorSvc: jobMonitorService,
                private loggerSvc: logger,
                private momentService: MomentService) {}

    private readonly destroy$ = new Subject();
    private gridResult: Array<any[]>;
    private isDirty = false;
    private isLoading = false;
    public gridData: GridDataResult;

    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };

    public pageSizes: PageSizeItem[] = [
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
        {
            text: "250",
            value: 250,
        },
        {
            text: "All",
            value: "all"
        }
    ];

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    distinctPrimitive(fieldName: string): Array<string> {
        return uniq(pluck(this.gridResult, fieldName));
    }

    formatDateTimeForDisplay(inputDt) {
        const formattedDt = this.momentService.moment(inputDt).format("MM/DD/YYYY,  hh:mm:ss a");
        return formattedDt
    }
    
    formatTimeForDisplay(inputTm){
        const min = Math.floor(inputTm / 60);
        const secs = inputTm % 60;
        let formattedTm = ""
        if (min == 0 && secs == 0)
            formattedTm = "" + secs + " secs";
        else
            formattedTm = "" + (min > 0 ? "" + min + " min " : "") + (secs > 0 ? secs + " secs" : "");
        return formattedTm;
    }

    loadJobMonitor(): void {
        this.isLoading = true;
        this.jobMonitorSvc.GetBatchRunHealthStatus().pipe(takeUntil(this.destroy$)).subscribe((result: Array<any[]>) => {
            console.log(result);
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        },(err)=> {
            this.loggerSvc.error("Unable to get Batch Job Health Status",err,err.statusText);
            this.isLoading = false;
        });
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadJobMonitor()
    }

    ngOnInit(): void {
        this.loadJobMonitor();
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
/*
this.jobMonitorSvc.GetBatchStepsRunHealthStatus('idfcdudealdsa301a').pipe(takeUntil(this.destroy$)).subscribe(
            (result: Array<any[]>) => {
                console.log(result);
            },

            function (response) {
                this.loggerSvc.error(
                    "Unable to get Job Monitor.",
                    response,
                    response.statusText
                );

            }
        );
        this.jobMonitorSvc.GetBatchStepRunHistory('idfcdudealdsa301a', 'PR_LOAD_RPT_MSP_DEAL_FACT', 10).pipe(takeUntil(this.destroy$)).subscribe(
            (result: Array<any[]>) => {
                console.log(result);
            },

            function (response) {
                this.loggerSvc.error(
                    "Unable to get Job Monitor.",
                    response,
                    response.statusText
                );

            }
        );
*/