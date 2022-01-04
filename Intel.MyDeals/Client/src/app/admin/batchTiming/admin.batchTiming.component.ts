import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, GroupDescriptor } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { batchTimingService } from "./admin.batchTiming.service";


@Component({
    selector: "batchTiming",
    templateUrl: "Client/src/app/admin/batchTiming/admin.batchTiming.component.html",
})

export class batchTimingComponent {
    constructor(private batchTimingSvc: batchTimingService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    // Variables
    private selectedItem: any = null;
    private isButtonDisabled: boolean = true;

    private isLoading: boolean = true;
    private loadMessage: string = "Batch Job Details Loading..";
    private type: string = "numeric";
    private info: boolean = true;
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    private state: State = {
        skip: 0,
        take: 10,
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
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular.module("app").directive(
    "batchTiming",
    downgradeComponent({
        component: batchTimingComponent,
    })
);
