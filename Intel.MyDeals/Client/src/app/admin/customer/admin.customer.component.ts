import { Component, OnDestroy } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { customerService } from "./admin.customer.service";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Cust_Div_Map } from "./admin.customer.model";

@Component({
    selector: "admin-customer",
    templateUrl: "Client/src/app/admin/customer/admin.customer.component.html",
    styleUrls: ['Client/src/app/admin/customer/admin.customer.component.css']
})

export class adminCustomerComponent implements OnDestroy {
    constructor(private customerSvc: customerService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    private type = "numeric";
    private info = true;    
    private gridResult: Cust_Div_Map[] = [];
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
            value: "all",
        }
    ];

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

    loadCustomer(): void {
        //Developer can see the Screen..
        this.customerSvc.getCustomers()
        .pipe(takeUntil(this.destroy$))
            .subscribe((result: Array<Cust_Div_Map>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
        }, (error) => {
            this.loggerSvc.error('Customer service', error);
        });
        
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
        this.loadCustomer();

    }
    ngOnInit(): void {
        this.loadCustomer();
    }
   //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

}
