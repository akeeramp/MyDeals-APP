import { logger } from "../../shared/logger/logger";
import { Component, OnDestroy } from "@angular/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { uniq, pluck } from 'underscore';
import { jobMonitorDetailsService } from "./jobMonitorDetails.service";
import { ActivatedRoute } from "@angular/router";
import { MomentService } from "../../shared/moment/moment.service";

@Component({
    selector: 'job-monitor-details',
    templateUrl: 'Client/src/app/dashboard/jobMonitorDetails/jobMonitorDetails.component.html',
    styleUrls: ['Client/src/app/dashboard/jobMonitorDetails/jobMonitorDetails.component.css']
})

export class jobMonitorDetailsComponent implements PendingChangesGuard, OnDestroy {

    constructor(private jobMonDetSvc: jobMonitorDetailsService,
                private loggerSvc: logger, private route: ActivatedRoute,
                private momentService: MomentService) {}

    private readonly destroy$ = new Subject<void>();
    private gridResult: Array<any[]>;
    private gridHistResult: Array<any[]>;
    private isDirty = false;
    private isLoading = false;
    private isHistVisible = false;
    private windowTop = 75; windowLeft = 300; windowWidth = 1100; windowHeight = 600; windowMinWidth = 100; windowMinHeight = 100;
    private inputJobName: string = null;
    public gridData: GridDataResult;
    public gridHistData: GridDataResult;
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

    loadJobMonitorDetails(): void {
        this.isLoading = true;
        this.jobMonDetSvc.GetBatchStepsRunHealthStatus(this.inputJobName).pipe(takeUntil(this.destroy$)).subscribe((result: Array<any[]>) => {
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state);
            this.isLoading = false;
        },(err)=> {
            this.loggerSvc.error("Unable to get Batch Job Steps Health Details",err,err.statusText);
        });
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadJobMonitorDetails();
    }

    windowClose() {
        this.isHistVisible = false;
    }

    formatDateTimeForDisplay(inputDt) {
        if (inputDt.includes("1/1/1900"))
            return "NULL";
        else {
            const formattedDt = this.momentService.moment(inputDt).format("MM/DD/YYYY,  hh:mm:ss a");
            return formattedDt;
        }
    }

    formatTimeForDisplay(inputTm) {
        const min = Math.floor(inputTm / 60);
        const secs = inputTm % 60;
        let formattedTm = "";
        if (min == 0 && secs == 0)
            formattedTm = "" + secs + " secs";
        else
            formattedTm = "" + (min > 0 ? "" + min + " min " : "") + (secs > 0 ? secs + " secs" : "");
        return formattedTm;  
    }

    getHistory(stepNm): void {
        const histState: State = {
            skip: 0,
            take: 10
        };
        this.isHistVisible = false;
        this.isLoading = true;
        this.jobMonDetSvc.GetBatchStepRunHistory(this.inputJobName, stepNm, 10).pipe(takeUntil(this.destroy$)).subscribe((result: Array<any[]>) => {
            this.gridHistResult = result;
            this.gridHistData = process(this.gridHistResult, histState);
            this.isHistVisible = true;
            this.isLoading = false;
        },(err)=> {
            this.loggerSvc.error("Unable to get Batch job Steps History", err, err.statusText);
            this.isLoading = false;
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.inputJobName = params.get('jobName');
            if (this.inputJobName != null && this.inputJobName.trim() != "") {
                this.loadJobMonitorDetails();
            }else{
                this.loggerSvc.error("Job Name is not provided.","Invalid Job Name");
            }  
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