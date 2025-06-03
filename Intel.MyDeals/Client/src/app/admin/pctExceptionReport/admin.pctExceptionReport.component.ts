import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";

import { logger } from "../../shared/logger/logger";
import { PctExceptionReportService } from "./admin.pctExceptionReport.service";

@Component({
    selector: 'pct-exception-report',
    templateUrl: "Client/src/app/admin/pctExceptionReport/admin.pctExceptionReport.component.html",
    styleUrls: ["Client/src/app/admin/pctExceptionReport/admin.pctExceptionReport.component.css"]
})
export class PctExceptionReportComponent implements OnInit, OnDestroy {

    private readonly destroy$ = new Subject();
    private readonly CUR_YEAR = new Date().getFullYear();
    private readonly MIN_YEAR = this.CUR_YEAR - 5;
    private readonly MAX_YEAR = this.CUR_YEAR + 5;

    private readonly DEFAULT_STATE_CONFIG: State = {
        group: [],
    };

    constructor(private pctExceptionReportService: PctExceptionReportService,
                private ngZone: NgZone,
                private loggerService: logger) { }

    private isLoading: boolean = false;
    private gridData: GridDataResult;
    private state: State = { ...this.DEFAULT_STATE_CONFIG };

    private startYearValue = this.CUR_YEAR - 1;
    private startQuarterValue = 1;
    private endYearValue = this.CUR_YEAR;
    private endQuarterValue = 1;
    private calculatedQuarters: string = '';
    private isYearQuarterSelectionInvalid = false;

    private calculateQuarters(startYear: number, startQuarter: number, endYear: number, endQuarter: number): string {
        let builtResponse: string = '';

        for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
            const startQ = (currentYear === startYear) ? startQuarter : 1;
            const endQ = (currentYear === endYear) ? endQuarter : 4;
    
            for (let currentQuarter = startQ; currentQuarter <= endQ; currentQuarter++) {
                builtResponse += `${currentYear}Q${currentQuarter}, `;
            }
        }

        return builtResponse.slice(0, -2); // Remove the trailing comma and space
    }

    private updateSelectedQuarters(): void {
        this.calculatedQuarters = '';

        if (this.endYearValue < this.startYearValue) {
            this.calculatedQuarters = 'The END year cannot be before the START year';
            this.isYearQuarterSelectionInvalid = true;
        } else if (this.endYearValue == this.startYearValue) {
            if (this.endQuarterValue < this.startQuarterValue) {
                this.calculatedQuarters = 'The END quarter cannot be before the START quarter';
                this.isYearQuarterSelectionInvalid = true;
            } else {
                this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
                this.isYearQuarterSelectionInvalid = false;
            }
        } else {
            this.calculatedQuarters = this.calculateQuarters(this.startYearValue, this.startQuarterValue, this.endYearValue, this.endQuarterValue);
            this.isYearQuarterSelectionInvalid = false;
        }
    }

    private hasExecuteRun: boolean = false;
    private executeReportLookup(): void {
        this.hasExecuteRun = true;
        this.isLoading = true;
        const START_YEAR_QUARTER: string = `${ this.startYearValue }0${ this.startQuarterValue }`;
        const END_YEAR_QUARTER: string = `${ this.endYearValue }0${ this.endQuarterValue }`;

        this.pctExceptionReportService.GetPricingTables(START_YEAR_QUARTER, END_YEAR_QUARTER)
            .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<unknown>) => {
                this.gridData = process(result, this.state);
                this.isLoading = false;

                this.fitColumns();
            }, (error) => {
                this.loggerService.error('PCT Exception Service', error);
                this.isLoading = false;
            });
    }

    @ViewChild(GridComponent) public grid: GridComponent;
    private fitColumns(): void {
        // this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        //     this.grid.autoFitColumns();
        //   });
        this.grid.autoFitColumns();
    }

    private onDataStateChange(): void {
        this.fitColumns();
    }

    private get excelFileName(): string {
        return `PctExceptionReport_${ this.startYearValue }Q${ this.startQuarterValue }-${ this.endYearValue }Q${ this.endQuarterValue }.xlsx`;
    }

    ngOnInit(): void {
        this.updateSelectedQuarters();
    }

    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

}