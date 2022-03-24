import * as angular from "angular";
import { Component } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { productsService } from "./admin.products.service";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, GroupDescriptor } from "@progress/kendo-data-query";
import { ThemePalette } from '@angular/material/core';


@Component({
    selector: "adminProducts",
    templateUrl: "Client/src/app/admin/products/admin.products.component.html",
})

export class adminProductsComponent {
    constructor(private productsSvc: productsService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private isLoading: boolean = true;
    private loadMessage: string = "Admin Customer Loading..";
    private type: string = "numeric";
    private info: boolean = true;
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

    loadProducts() {
        //Developer can see the Screen..
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.productsSvc.getProducts().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                this.loggerSvc.error('Unable to get Products', error);
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
        this.loadProducts();
    }

    ngOnInit() {
        this.loadProducts();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

};

angular.module("app").directive(
    "adminProducts",
    downgradeComponent({
        component: adminProductsComponent,
    })
);
