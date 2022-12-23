import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { customerService } from "./admin.customer.service";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';


@Component({
    selector: "admin-customer",
    templateUrl: "Client/src/app/admin/customer/admin.customer.component.html",
})

export class adminCustomerComponent {
    constructor(private customerSvc: customerService, private loggerSvc: logger) { }
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

    loadCustomer() {
        //Developer can see the Screen..
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.customerSvc.getCustomers().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.loggerSvc.error('Customer service', error);
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
        this.loadCustomer();

    }
    ngOnInit() {
        this.loadCustomer();
    }

}

angular.module("app").directive(
    "adminCustomer",
    downgradeComponent({
        component: adminCustomerComponent,
    })
);
