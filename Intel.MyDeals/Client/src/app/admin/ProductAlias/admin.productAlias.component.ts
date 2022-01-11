import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { productAliasService } from "./admin.productAlias.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { Product_Alias_Map } from "./admin.productAlias.model";
import { ThemePalette } from "@angular/material/core";
import * as _ from "underscore";
import {
    GridDataResult,
    PageChangeEvent,
    DataStateChangeEvent,
    PageSizeItem,
} from "@progress/kendo-angular-grid";
import {
    process,
    State,
    GroupDescriptor,
    CompositeFilterDescriptor,
    distinct,
    filterBy,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: "adminProductAlias",
    templateUrl: "Client/src/app/admin/productAlias/admin.productAlias.component.html",
    //styleUrls: ['Client/src/app/admin/productAlias/admin.productAlias.component.css']
})
export class adminProductAliasComponent {
    constructor(private productAliasSvc: productAliasService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    @ViewChild("catDropDown") private catDdl;
    @ViewChild("custDropDown") private custDdl;
    @ViewChild("countDropDown") private countDdl;
    @ViewChild("partDropDown") private partDdl;

    private isLoading: boolean = true;
    private errorMsg: string = "";
    private dataSource: any;
    private gridOptions: any;
    private allowCustom: boolean = true;
    private color: ThemePalette = "primary";

    public gridResult: Array<any>;
    public type: string = "numeric";
    public info: boolean = true;
    public product_map: any;
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;
    private isNew: boolean; rowIndex: number; isCombExists: boolean = false;
    isDialogVisible: boolean = false; cancelConfirm: boolean = false; isDelete: boolean = false; isOk: boolean = false;

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

    loadProductAlias() {
        let vm = this;
        if (!((<any>window).usrRole === 'SA' || (<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            vm.productAliasSvc.GetProductsFromAlias().subscribe(
                (result: Array<any>) => {
                    vm.gridResult = result;
                    vm.gridData = process(vm.gridResult, this.state);
                    vm.isLoading = false;
                },
                function (response) {
                    this.loggerSvc.error(
                        "Unable to get Product Alias Mappings.",
                        response,
                        response.statusText
                    );
                }
            );
        }
    }

    IsValidCombination(model: any, isNew: boolean) {
        let retCond = false;
        let cond = this.gridResult.filter(x => x.PRD_ALS_NM == model.PRD_ALS_NM);
        if (isNew && cond.length > 0) {
            this.errorMsg = "This Combination of Product Alias name already exists.";
            retCond = true;
        }

        else {
            if (cond.length > 0) {
                this.errorMsg = "This Combination of Product Alias name already exists.";
                retCond = true;
            }
        }
        return retCond;
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
        this.formGroup = new FormGroup({
            //PRD_ALS_SID: new FormControl(),
            PRD_NM: new FormControl("", Validators.required),
            PRD_ALS_NM: new FormControl("", Validators.required),
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
            PRD_ALS_SID: new FormControl(dataItem.PRD_ALS_SID),
            PRD_NM: new FormControl(dataItem.PRD_NM, Validators.required),
            PRD_ALS_NM: new FormControl(dataItem.PRD_ALS_NM, Validators.required),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    removeHandler({ dataItem }) {
        this.isDelete = true;
        this.isDialogVisible = true;
        this.errorMsg = "Are you sure you would like to Delete this Product Alias Mapping?";
        this.cancelConfirm = true;
        this.isCombExists = false;
        this.product_map = dataItem;
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }

    deleteOperation() {
        this.productAliasSvc.DeleteProductAlias(this.product_map).subscribe(
            result => {
                this.loadProductAlias();
                /*sender.closeRow(rowIndex);*/
            },
            error => {
                this.loggerSvc.error("Unable to delete Product Alias Mappings", error.statusText);
                this.isLoading = false;
            }
        );
    }

    deleteConfirmation() {
        this.isDialogVisible = false;
        this.cancelConfirm = false;
        this.isDelete = false;
        this.isOk = false;
        this.deleteOperation();

    }

    saveCancel() {
        this.isDialogVisible = false;
        this.cancelConfirm = false;
        this.isDelete = false;
        this.isOk = false;
    }
    insertUpdateOperation(rowIndex, isNew, product_map) {
        if (isNew) {
            this.isLoading = true;
            this.productAliasSvc.CreateProductAlias(product_map).subscribe(
                result => {
                    this.gridResult.push(product_map);
                    this.loadProductAlias();
                    /*sender.closeRow(rowIndex);*/
                },
                error => {
                    this.isDialogVisible = true;
                    this.isOk = true;
                    this.errorMsg = error.error;
                    this.loggerSvc.error("Unable to insert Product Alias Mapping.", error.statusText);
                    this.isLoading = false;
                }
            );
        } else {
            this.isLoading = true;
            this.productAliasSvc.UpdateProductAlias(product_map).subscribe(
                result => {
                    this.gridResult[rowIndex] = product_map;
                    this.gridResult.push(product_map);
                    this.loadProductAlias();
                    /*sender.closeRow(rowIndex);*/
                },
                error => {
                    this.isDialogVisible = true;
                    this.isOk = true;
                    this.errorMsg = error.error;
                    this.loggerSvc.error("Unable to update Product Alias Mappings", error.statusText);
                    this.isLoading = false;
                }
            );
        }


    }
    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        const product_map: Product_Alias_Map = formGroup.value;
        this.errorMsg = "";
        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCombination(product_map, isNew);
            if (!this.isCombExists) {
                this.insertUpdateOperation(rowIndex, isNew, product_map);
            }
            else {
                this.isDialogVisible = true;
                this.cancelConfirm = false;
                this.isOk = true;
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
        vm.loadProductAlias()
    }

    ngOnInit() {
        this.loadProductAlias();
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
        "adminProductAlias",
        downgradeComponent({ component: adminProductAliasComponent })
    );
