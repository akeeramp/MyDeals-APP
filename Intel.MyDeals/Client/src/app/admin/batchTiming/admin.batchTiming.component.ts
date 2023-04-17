import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { batchTimingService } from "./admin.batchTiming.service";

@Component({
    selector: 'batch-timing',
    templateUrl: 'Client/src/app/admin/batchTiming/admin.batchTiming.component.html',
    styleUrls: ['Client/src/app/admin/batchTiming/admin.batchTiming.component.css']
})
export class batchTimingComponent {
    constructor(private batchTimingSvc: batchTimingService, private loggerSvc: logger) { }

    // Variables
    private isLoading = true;
    private loadMessage = "Batch Job Details Loading..";
    private type = "numeric";
    private info = true;
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
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
    private pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10
        },
        {
            text: "25",
            value: 25
        },
        {
            text: "50",
            value: 50
        },
        {
            text: "100",
            value: 100
        }
    ];

    loadBatchTiming() {
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.batchTimingSvc.getBatchJobTiming('BTCH_JOB_DTL')
                .subscribe((result: Array<any>) => {
                    this.isLoading = false;
                    this.gridResult = result;
                    this.gridData = process(result, this.state);
                }, (error) => {
                    this.loggerSvc.error('Batch Timing service', error);
                });
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.batchTimingSvc.getBatchJobTiming('BTCH_JOB_DTL')
            .subscribe((result: Array<any>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('Batch Timing service', error);
        });

    }

    ngOnInit() {
        this.loadBatchTiming();
    }

}