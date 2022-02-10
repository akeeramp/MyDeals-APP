import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { constantsService } from "./admin.constants.service";
import { Component } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Cnst_Map } from './admin.constants.model';
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";

import {
    GridDataResult,
    DataStateChangeEvent,
    PageSizeItem,

} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";


@Component({
    selector: "constants",
    templateUrl: "Client/src/app/admin/constants/admin.constants.component.html",
    styleUrls: ['Client/src/app/admin/CustomerVendors/admin.customerVendors.component.css']
})

export class ConstantsComponent {
    constructor(private constantsSvc: constantsService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    private isLoading: boolean = true;
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public cnstName: string;
    public description: string;
    public value: string;
    public uiUpdateable: boolean = false;
    public constData: Array<any>;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    public isCnstNmEditable: boolean = false;
    private editedRowIndex: number;
    private adminBannerMessage: string;
    private isDialogVisible: boolean = false;
    private isEdit: boolean = false;
    private deleteItem: any;

    public state: State = {
        skip: 0,
        take: 10,
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

    loadConstants() {
        let vm = this;
        if (!(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            vm.constantsSvc.getConstants()
                .subscribe(
                    (result: Array<any>) => {
                        vm.gridResult = result;
                        vm.constData = result;
                        vm.gridData = process(vm.gridResult, this.state);
                        vm.isLoading = false;
                    },
                    function (response) {
                        this.loggerSvc.error(
                            "Unable to get Constants Data.",
                            response,
                            response.statusText
                        );
                    }
                )
        }
    }

    updateBannerMessage(constant) {
        if (constant.CNST_NM == 'ADMIN_MESSAGE') {
            this.adminBannerMessage = constant.CNST_VAL_TXT == 'NA'
                ? "" : constant.CNST_VAL_TXT;
        }
    }


    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }) {
        this.closeEditor(sender);
        this.isCnstNmEditable = true;
        this.formGroup = new FormGroup({
            CNST_SID: new FormControl(),
            CNST_NM: new FormControl("", Validators.required),
            CNST_DESC: new FormControl("", Validators.required),
            CNST_VAL_TXT: new FormControl("", Validators.required),
            UI_UPD_FLG: new FormControl(true, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            CNST_SID: new FormControl(),
            CNST_NM: new FormControl({ value: dataItem.CNST_NM, disabled: true }, Validators.required),
            CNST_DESC: new FormControl(dataItem.CNST_DESC, Validators.required),
            CNST_VAL_TXT: new FormControl(dataItem.CNST_VAL_TXT, Validators.required),
            UI_UPD_FLG: new FormControl(dataItem.UI_UPD_FLG, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    removeHandler({ dataItem }) {
        this.deleteItem = dataItem;
        this.isDialogVisible = true;
    }

    close() {
        this.isDialogVisible = false;
    }

    deleteRecord() {
        this.isDialogVisible = false;
        this.constantsSvc.deleteConstants(this.deleteItem)
            .subscribe(
                (result: Array<any>) => {
                    this.refreshGrid();
                    this.loggerSvc.success("Constant Deleted.");
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to delete row Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }


    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
        this.isCnstNmEditable = false;
    }

    saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
        this.isCnstNmEditable = false;
        const cnst_map: Cnst_Map = formGroup.value;
        if (!isNew) {
            formGroup.value.CNST_NM = dataItem.CNST_NM;
        }

        let filteredCnst = this.gridResult.filter(x => x.CNST_NM === cnst_map.CNST_NM);
        if (filteredCnst.length > 0) {
            cnst_map.CNST_SID = filteredCnst[0].CNST_SID;
        }
        if (this.isFormChange) {
            if (isNew) {
                this.isLoading = true;
                this.constantsSvc.insertConstants(cnst_map).subscribe(
                    result => {
                        this.gridResult.push(cnst_map);
                        this.updateBannerMessage(cnst_map);
                        this.loadConstants();
                        this.loggerSvc.success("New constant added.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to save constants data.", error);
                        this.isLoading = false;
                    }
                );
            }
            else {
                this.isLoading = true;
                this.isEdit = true;
                this.constantsSvc.updateConstants(cnst_map).subscribe(
                    result => {
                        this.gridResult[rowIndex] = cnst_map;
                        this.gridResult.push(cnst_map);
                        this.loadConstants();
                        this.updateBannerMessage(cnst_map);
                        this.loggerSvc.success("Constant Updated.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to update constants data.", error);
                        this.isLoading = false;
                    }
                );
            }
        }
        sender.closeRow(rowIndex);
    }

    refreshGrid() {
        let vm = this;
        vm.isLoading = true;
        vm.state.filter = {
            logic: "and",
            filters: [],
        };
        vm.loadConstants()
    }


    ngOnInit() {
        this.loadConstants()
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }
}

angular.module("app").directive(
    "constants",
    downgradeComponent({
        component: ConstantsComponent,
    })
);