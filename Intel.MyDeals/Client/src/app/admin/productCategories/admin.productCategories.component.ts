import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { productCategoryService } from "./admin.productCategories.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { ThemePalette } from "@angular/material/core";
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
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
import { Product_categories } from "./admin.productCategories.model";

@Component({
    selector: "adminProductCategories",
    templateUrl: "Client/src/app/admin/productCategories/admin.productCategories.component.html"
})

export class adminProductCategoriesComponent {
    constructor(private productCategorySvc: productCategoryService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $('link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]').remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }
    private isLoading: boolean = true;
    private loadMessage: string = "Admin Customer Loading..";
    private type: string = "numeric";
    private info: boolean = true;
    private gridResult: Array<any>;
    public productData: Array<any>;
    public gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;
    private isDataValid: boolean = false;

    @ViewChild('dealPdctTooltip', { static: false }) dealPdctTooltip: NgbTooltip;
    @ViewChild('pdctVerticalTooltip', { static: false }) pdctVerticalTooltip: NgbTooltip;

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

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }
    loadproductCategoriesData() {
        if ((<any>window).usrRole != "SA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.productCategorySvc.getCategories()
                .subscribe((response: Array<any>) => {
                    //as we get the CHG_DTM value as string in the response, converting into date data type and assigning it to grid result so that date filter works properly
                    var data = response.map(function (x) {
                        x.CHG_DTM = new Date(x.CHG_DTM);
                        return x;
                    });
                    this.gridResult = data;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
                }, function (response) {
                    this.loggerSvc.error("Unable to get Products.", response, response.statusText);
                });
        }
    }
    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }
    closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
            GDM_PRD_TYPE_NM: new FormControl(dataItem.GDM_PRD_TYPE_NM),
            GDM_VRT_NM: new FormControl(dataItem.GDM_VRT_NM),
            DIV_NM: new FormControl(dataItem.DIV_NM),
            OP_CD: new FormControl(dataItem.OP_CD),
            DEAL_PRD_TYPE: new FormControl(dataItem.DEAL_PRD_TYPE, dataItem.ACTV_IND == true ? Validators.required : Validators.nullValidator),
            PRD_CAT_NM: new FormControl(dataItem.PRD_CAT_NM , dataItem.ACTV_IND == true ? Validators.required : Validators.nullValidator),
            CHG_EMP_NM: new FormControl(dataItem.CHG_EMP_NM),
            CHG_DTM: new FormControl(dataItem.CHG_DTM),
            PRD_CAT_MAP_SID: new FormControl(dataItem.PRD_CAT_MAP_SID),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            this.toolTipvalidationMsgs(this.formGroup.controls);
        });

        //below line of code is to set the validations to the formgroup based on ACTV_IND change
        this.formGroup.get("ACTV_IND").valueChanges
            .subscribe(value => {
                if (value) {
                    this.formGroup.get("PRD_CAT_NM").setValidators(Validators.required);
                    this.formGroup.get("DEAL_PRD_TYPE").setValidators(Validators.required);
                } else {
                    this.formGroup.get("PRD_CAT_NM").clearValidators();
                    this.formGroup.get("DEAL_PRD_TYPE").clearValidators();
                }
                this.formGroup.get("PRD_CAT_NM").updateValueAndValidity();
                this.formGroup.get("DEAL_PRD_TYPE").updateValueAndValidity();
            });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
    }
    saveHandler({ sender, rowIndex, formGroup }) {
        //As updateCategory method in the server side expects product category as a list, sending it as array object
        let product_categories: Product_categories[]=[];
        product_categories.push(formGroup.value);
        this.isDataValid = this.formGroup.valid;
        if (!this.isDataValid) {
            this.toolTipvalidationMsgs(this.formGroup.controls);
        }
        else if (this.isFormChange) {
            this.isLoading = true;
            this.productCategorySvc.updateCategory(product_categories).subscribe(
                result => {
                    this.loadproductCategoriesData();
                    //sender.closeRow(rowIndex);
                    this.loggerSvc.success("Product Verticals were successfully updated.");
                },
                error => {
                    this.loggerSvc.error("Unable to update Product Vertical.", error);
                    this.isLoading = false;
                }
            );
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
        vm.loadproductCategoriesData()
    }

    toolTipvalidationMsgs(data) {
        this.formGroup.markAllAsTouched();
        (data.PRD_CAT_NM.value == "" && data.ACTV_IND.value) ? this.pdctVerticalTooltip.open() : this.pdctVerticalTooltip.close();
        (data.DEAL_PRD_TYPE.value == "" && data.ACTV_IND.value) ? this.dealPdctTooltip.open() : this.dealPdctTooltip.close();
    }

    ngOnInit() {
        this.loadproductCategoriesData();
    }
    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

};

angular.module("app").directive(
    "adminProductCategories",
    downgradeComponent({
        component: adminProductCategoriesComponent,
    })
);
