import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { productsService } from "./admin.products.service";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor, process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Products } from "./admin.products.model";
import { GridUtil } from "../../contract/grid.util";
import { ExcelColumnsConfig } from "../ExcelColumnsconfig.util";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";

@Component({
    selector: 'admin-products',
    templateUrl: 'Client/src/app/admin/products/admin.products.component.html',
    styleUrls: ['Client/src/app/admin/products/admin.products.component.css']
})
export class adminProductsComponent implements OnDestroy {
    constructor(private productsSvc: productsService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    private type = "numeric";
    private info = true;
    private gridResult: Array<Products> = [];
    private excelExport: Array<Products> = [];
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    private productsExcel = ExcelColumnsConfig.GetproductsExcelCalDef;
    private sortData = "";
    private filterData = "";
    private dataforfilter: object;
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
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "100", value: 100 }
    ];

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }

    public allData(): ExcelExportData {
        const excelState: any = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    loadProducts() {
        this.settingFilter();
        //Developer can see the Screen..
        this.productsSvc.getProducts(this.dataforfilter).pipe(takeUntil(this.destroy$)).subscribe((result: Array<Products>) => { 
            this.isLoading = false; 
            this.gridResult = result;
            this.gridData = process(this.gridResult, this.state); 
            this.gridData.data = this.gridResult;
            if (result.length > 0) {
                this.gridData.total = parseInt(result[0].TOTAL_ROWS);
            } 
        }, (error) => {
            this.loggerSvc.error('Unable to get Products', error);
        });
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.isLoading = true;
        this.loadProducts();
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
        this.loadProducts();
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadProducts();
    }

    exportToExcel() {
        this.isLoading = true;
        this.productsSvc.getProducts(null).pipe(takeUntil(this.destroy$)).subscribe((result: Array<Products>) => {
            this.isLoading = false;
            this.excelExport = result;
            GridUtil.dsToExcelProductsData(this.productsExcel, this.excelExport, "MyDealsProducts");
        }, (error) => {
            this.loggerSvc.error('GetPrimeCustomerDetails service', error);
        });
    }

    exportToExcelCustomColumns() {
        GridUtil.dsToExcelProductsData(this.productsExcel, this.gridResult, "MyDealsProducts");
    }

    pageChange(state) {
        this.state.take = state.take;
        this.state.skip = state.skip;
    }

    ngOnInit() {
        this.loadProducts();
    }
    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `${value.field} ${value.dir}` : `${this.sortData} AND ${value.field} ${value.dir}`;
                }
            });
        }
        var filter = JSON.parse(JSON.stringify(this.state.filter));
        filter.filters.forEach((item: CompositeFilterDescriptor) => {
            if (item && item.filters && item.filters.length > 0)
                item.filters.forEach((filter: FilterDescriptor) => {
                    if (filter.field == 'PRD_MBR_SID') {
                        filter.field = 'P.PRD_MBR_SID'
                    }
                });
        });
        const filterExpression = FilterExpressBuilder.createSqlExpression(JSON.stringify(filter));
        this.filterData = filterExpression;
        this.dataforfilter = {
            StrFilters: this.filterData,
            StrSorts: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take
        };
    }
}