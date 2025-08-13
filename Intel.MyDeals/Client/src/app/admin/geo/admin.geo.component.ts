import { Component,OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { geoService } from "./admin.geo.service";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, CompositeFilterDescriptor } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";
import { GridUtil } from "../../contract/grid.util";
import { ExcelColumnsConfig } from "../ExcelColumnsconfig.util";

@Component({
    selector: "admin-geo",
    templateUrl: "Client/src/app/admin/geo/admin.geo.component.html",
    styleUrls: ['Client/src/app/admin/geo/admin.geo.component.css']
})

export class geoComponent implements OnDestroy {
    constructor(private geoSvc: geoService, private loggerSvc: logger) {
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    private type = "numeric";
    private info = true;
    private gridResult = [];
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    private sortData = "";
    private filterData = "";
    private dataforfilter: object;
    public ftchCnt = true;
    public totalCnt;
    private state: State = {
        skip: 0,
        take: 25,
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
    private geosExcel = ExcelColumnsConfig.geosExcel;

    loadGeo(): void {
        //Developer can see the Screen..
        this.settingFilter();
        this.isLoading = true;
        this.geoSvc.getGeosNew(this.dataforfilter).pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.isLoading = false;
            this.gridResult = result.Items;
            const state: State = {
                skip: 0,
                take: this.state.take,
                group: this.state.group,
                filter: {
                    logic: "and",
                    filters: [],
                }
            };
            this.gridData = process(this.gridResult, state);
            if (this.dataforfilter["FtchCnt"] == true)
                this.totalCnt = result.TotalRows;
            this.gridData.total = this.totalCnt;
            this.dataforfilter["FtchCnt"] = false;
            this.isLoading = false;

        }, (error) => {
            this.loggerSvc.error('Geo service', error);
        });
    }

    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `ORDER BY ${value.field} ${value.dir}` : `${this.sortData} , ${value.field} ${value.dir}`;
                }
            });
        }
        const filterExpression = FilterExpressBuilder.createSqlExpression(JSON.stringify(this.state.filter));
        this.filterData = filterExpression;        
        this.dataforfilter = {
            InFilters: this.filterData,
            Sort: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take,
            FtchCnt: this.ftchCnt
        };
    }

    exportToExcel() {        
        this.settingFilter();
        this.dataforfilter["Skip"] = 0;
        this.dataforfilter["Take"] = this.gridData.total;
        this.dataforfilter["FtchCnt"] = false;
        this.isLoading = true;
        this.geoSvc.getGeosNew(this.dataforfilter).pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.isLoading = false;
            GridUtil.dsToGeoData(this.geosExcel, result.Items, "MyDealsGeos");
        }, (error) => {
            this.loggerSvc.error('Geo service', error);
        });
    }
    
    
    pageChange(state: DataStateChangeEvent) {
        this.state.take = state.take;
        this.state.skip = state.skip;
        this.ftchCnt = false;
        this.loadGeo();
    }

    clearFilter(): void {
        this.state.take = 25;
        this.state.skip = 0;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.ftchCnt = true;
        this.loadGeo();
    }

    public filterChange(filter: CompositeFilterDescriptor): void {
        this.state.filter = filter;
        this.state.skip = 0;
        this.ftchCnt = true;
        this.loadGeo();
    }
    sortChange(state) {
        this.state["sort"] = state;
        this.ftchCnt = false;
        this.loadGeo();
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state = {
            skip: 0,
            take: 25,
            group: [],
            filter: {
                logic: "and",
                filters: [],
            },
        };
        this.ftchCnt = true;
        this.loadGeo();
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
