import { Component,OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { geoService } from "./admin.geo.service";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GeoDimension } from "./admin.geo.model";

@Component({
    selector: "admin-geo",
    templateUrl: "Client/src/app/admin/geo/admin.geo.component.html",
    styleUrls: ['Client/src/app/admin/geo/admin.geo.component.css']
})

export class geoComponent implements OnDestroy {
    constructor(private geoSvc: geoService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
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
        },
        {
            text: "250",
            value: 250
        },
        {
            text: "All",
            value: "all"
        }
    ];

    loadGeo(): void {
        //Developer can see the Screen..
        this.geoSvc.getGeos().pipe(takeUntil(this.destroy$)).subscribe((result: Array<GeoDimension>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('Geo service', error);
        });
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.geoSvc.getGeos().pipe(takeUntil(this.destroy$)).subscribe((result: Array<GeoDimension>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('Geo service', error);
        });
    }

    ngOnInit(): void {
        this.loadGeo();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


}
