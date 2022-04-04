import * as angular from "angular";
import { Component, ViewChild  } from "@angular/core";
import { logger } from "../../shared/logger/logger";
import { funFactService } from "./admin.funFact.service";
import { downgradeComponent } from "@angular/upgrade/static";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { ThemePalette } from '@angular/material/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Fun_Facts } from './admin.funFact.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
    process,
    State,
    distinct
} from "@progress/kendo-data-query";

@Component({
    selector: "adminFunFact",
    templateUrl: "Client/src/app/admin/funFact/admin.funFact.component.html",
})

export class adminFunFactComponent {
    constructor(private funFactSvc: funFactService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    private isNew: boolean; rowIndex: number; isDataValid = false;
    @ViewChild('funFactTooltip', { static: false }) funFactTooltip: NgbTooltip;
    @ViewChild('headerTooltip', { static: false }) headerTooltip: NgbTooltip;
    @ViewChild('fontAwesomeTooltip', { static: false }) fontAwesomeTooltip: NgbTooltip;
    public state: State = {
        skip: 0,
        take: 25,
        group: [],
        sort:[],
        // Initial filter descriptor
        filter: {
            logic: "and",
            filters: [],
        },
    };
    public pageSizes: PageSizeItem[] = [
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

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        const fun_facts: Fun_Facts = formGroup.value;
        this.isDataValid = this.formGroup.valid;
        if (!this.isDataValid) {
            this.formGroup.markAllAsTouched();
            this.toolTipvalidationMsgs(this.formGroup.controls,isNew);
        }
        else if (this.isFormChange) {
            this.insertUpdateOperation(rowIndex, isNew, fun_facts);
            sender.closeRow(rowIndex);
        }
    }

    insertUpdateOperation(rowIndex, isNew, fun_facts) {
            if (isNew) {
                this.isLoading = true;
                this.funFactSvc.setFunfact(fun_facts).subscribe(
                    result => {
                        //TO show the new saved record at whatever page currently selected by the user
                        //if already any filters or sorting is applied to the grid then those filters/sorting will get cleared when user try to add a new record and newly added record will be shown in first page in that case
                        this.gridResult.splice(this.state.skip, 0, result[0]);
                        this.gridData = process(this.gridResult, this.state);
                        this.isLoading = false;
                        this.loggerSvc.success("New Fun Fact added.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to insert Fun Fact.", error);
                        this.isLoading = false;
                    }
                );
            } else {
                this.isLoading = true;
                this.funFactSvc.updateFunFact(fun_facts).subscribe(
                    result => {
                        //getting the index value of the grid result by comparing the edited row FACT_SID to the grid result FACT_SID. so that we can update the user edited/modified data to proper grid result index
                        const index = this.gridResult.findIndex(x => fun_facts.FACT_SID == x.FACT_SID);  
                        this.gridResult[index] = result[0];
                        this.gridData = process(this.gridResult, this.state);
                        this.isLoading = false;
                        //this.loadFunFacts();
                        this.loggerSvc.success("Funfact updated.");
                        //sender.closeRow(rowIndex);
                    },
                    error => {
                        this.loggerSvc.error("Unable to Update Fun Fact.", error);
                        this.isLoading = false;
                    }
                );
        }
    }
    
    loadFunFacts() {
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.funFactSvc.getFunFactItems().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
            }, (error) => {
                    this.loggerSvc.error('Unable to get Fun Fact.', error);
            });
        }
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    clearFilterandSorting() {
        this.state={
            skip: 0,
            take: 25,
            group: [],
            sort: [],
            filter: {
                logic: "and",
                filters: [],
            },
        };
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
        this.loadFunFacts();

    }
    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }
    addHandler({ sender }) {
        //if there are any filters or sorting applied on the grid, at this scenario if users try to add new record,
        //then the below line of code clears all the filters and sorting applied so that the newly added data is visible in the first page.
        //if no filters/sorting applied then newly added record will be shown in whatever page user is in
        if (this.state.filter.filters.length || this.state.sort.length) {
            this.clearFilterandSorting();
        }
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            FACT_SID: new FormControl(""),
            FACT_TXT: new FormControl("", Validators.required),
            FACT_HDR: new FormControl("", Validators.required),
            FACT_ICON: new FormControl("", Validators.required),
            FACT_SRC: new FormControl(""),
            ACTV_IND: new FormControl(false)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
            // sending isNew as true for the toolTipvalidationMsgs function as it is add action
            this.toolTipvalidationMsgs(this.formGroup.controls,true);
        });

        sender.addRow(this.formGroup);
    }
    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            FACT_SID: new FormControl(dataItem.FACT_SID),
            FACT_TXT: new FormControl(dataItem.FACT_TXT, Validators.required),
            FACT_HDR: new FormControl(dataItem.FACT_HDR, Validators.required),
            FACT_ICON: new FormControl(dataItem.FACT_ICON, Validators.required),
            FACT_SRC: new FormControl(dataItem.FACT_SRC),
            ACTV_IND: new FormControl(dataItem.ACTV_IND)
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }
    toolTipvalidationMsgs(data, isNew=false) {
        //these conditions are added because for the new record, we should not show tool tip error messages if user doesnt touch/make any changes to the input field
        //if this condition is not added tooltip messages will immediately show for the required fields even if other fields are not yet touched when user starts typing any one of the input.
        if (isNew) {
            (data.FACT_TXT.value == "" && (data.FACT_TXT.touched || !data.FACT_TXT.pristine)) ? this.funFactTooltip.open() : this.funFactTooltip.close();
            (data.FACT_HDR.value == "" && (data.FACT_HDR.touched || !data.FACT_HDR.pristine)) ? this.headerTooltip.open() : this.headerTooltip.close();
            (data.FACT_ICON.value == "" && (data.FACT_ICON.touched || !data.FACT_ICON.pristine)) ? this.fontAwesomeTooltip.open() : this.fontAwesomeTooltip.close();
        }
        else {
            (data.FACT_TXT.value == "") ? this.funFactTooltip.open() : this.funFactTooltip.close();
            (data.FACT_HDR.value == "" ) ? this.headerTooltip.open() : this.headerTooltip.close();
            (data.FACT_ICON.value == "") ? this.fontAwesomeTooltip.open() : this.fontAwesomeTooltip.close();
        }
    }
    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }
    ngOnInit() {
        this.loadFunFacts();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular.module("app").directive(
    "adminFunFact",
    downgradeComponent({
        component: adminFunFactComponent,
    })
);
