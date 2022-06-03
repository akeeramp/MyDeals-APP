import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { dataFixService } from "./admin.dataFix.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: "adminDataFix",
    templateUrl: "Client/src/app/admin/dataFix/admin.dataFix.component.html",
    styleUrls: ['Client/src/app/admin/dataFix/admin.dataFix.component.css']
})
export class adminDataFixComponent {
    constructor(private dataFixSvc: dataFixService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private isLoading = true;
    private errorMsg = "";
    private dataSource: any;
    private gridOptions: any;
    private allowCustom = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any> = [];
    public type = "numeric";
    public info = true;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    private isDataValid: any;
    private isNew: boolean; rowIndex: number;
    IsEditMode = false; IsExpertMode = false;

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

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    loadDataFix() {
        if (!((<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            this.dataFixSvc.getDataFixes().subscribe(
                (result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Data Fixes.",
                        response,
                        response.statusText
                    );
                }
            );
        }
    }

    addNewFix() {
        this.IsEditMode = true;
        this.IsExpertMode = false;
    }

    addNewFixExpert() {
        this.IsEditMode = true;
        this.IsExpertMode = true;
    }

    okDataFix() {
        this.IsEditMode = false;
        this.IsExpertMode = false;
    }

    okExpert() {
        this.IsEditMode = false;
        this.IsExpertMode = true;
    }

    refreshGrid() {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadDataFix();
    }


    ngOnInit() {
        this.loadDataFix();
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
        "adminDataFix",
        downgradeComponent({ component: adminDataFixComponent })
    );
