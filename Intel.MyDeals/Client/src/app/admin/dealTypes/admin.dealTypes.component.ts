import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { dealTypesService } from "./admin.dealTypes.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, GroupDescriptor, CompositeFilterDescriptor, distinct, filterBy } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: "adminDealTypes",
    templateUrl: "Client/src/app/admin/dealTypes/admin.dealTypes.component.html",
    //styleUrls: ['Client/src/app/admin/dealTypes/admin.dealTypes.component.css']
})
export class adminDealTypesComponent {
    constructor(private dealTypesSvc: dealTypesService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private isLoading: boolean = true;
    private errorMsg: string = "";
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;

    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
        {
            text: "10",
            value: 10,
        },
        {
            text: "25",
            value: 25,
        },
        {
            text: "50",
            value: 50,
        },
        {
            text: "100",
            value: 100,
        },
    ];

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadDealTypes() {
        let vm = this;
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.dealTypesSvc.getDealTypes().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    vm.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Deal Types.",
                        response,
                        response.statusText
                    );
                }
            );
        }
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.loadDealTypes()
    }

    ngOnInit() {
        this.loadDealTypes();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular
    .module("app")
    .directive(
        "adminDealTypes",
        downgradeComponent({ component: adminDealTypesComponent })
    );
