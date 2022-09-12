import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { dataQualityService } from "./admin.dataQuality.service";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: "adminDataquality",
    templateUrl: "Client/src/app/admin/dataQuality/admin.dataQuality.component.html",
    styleUrls: ['Client/src/app/admin/dataQuality/admin.dataQuality.component.css']
})

export class admindataQualityComponent {
    constructor(private dataQualitySvc: dataQualityService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult = [];
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

    loadDataQualityUseCases() {
        //Developer can see the Screen..
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.dataQualitySvc.GetDataQualityUseCases().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.loggerSvc.error('Unable to get Data Quality UseCases', error);
            });
        }
    }

    //Run DQ
    runDQ(useCase) {
        this.loggerSvc.info('DQ Queued..', '');
        this.dataQualitySvc.RunDQ(useCase).subscribe(() => {
            this.loggerSvc.success("DQ Run completed");
        }, (error) => {
            this.loggerSvc.error('Unable to Run DQ', error.statusText);
        });
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
        this.loadDataQualityUseCases();
    }

    ngOnInit() {
        this.loadDataQualityUseCases();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular.module("app").directive(
    "adminDataquality",
    downgradeComponent({
        component: admindataQualityComponent,
    })
);
