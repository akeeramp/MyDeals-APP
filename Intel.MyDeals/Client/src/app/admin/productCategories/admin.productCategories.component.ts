import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { productCategoryService } from "./admin.productCategories.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
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
import { Product_categories } from "./admin.productCategories.model";

@Component({
    selector: "adminProductCategories",
    templateUrl: "Client/src/app/admin/productCategories/admin.productCategories.component.html",
    styleUrls: ['Client/src/app/admin/productCategories/admin.productCategories.component.css']
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
    //private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    public formGroup: FormGroup;
    public isFormChange: boolean = false;
    private editedRowIndex: number;
    public isValid: boolean;
    private isInValidData: boolean = false;
    private errorMsg: string = "";
    private isVisibilityProductErrMsg: boolean = false; isVisibilityDealErrMsg: boolean = false;


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
        let vm = this;
        if (
            (<any>window).usrRole != "SA" &&
            !(<any>window).isDeveloper
        ) {
            document.location.href = "/Dashboard#/portal";
        } else {
            this.productCategorySvc.getCategories()
                .subscribe((response: Array<any>) => {
                    var data = response.map(function (x) {
                        x.filterableCHG_DTM = new Date(x.CHG_DTM);
                        return x;
                    });
                    this.gridResult = data;
                    vm.gridData = process(this.gridResult, this.state);
                    vm.isLoading = false;
                    //this.loggerSvc.success(response.s);
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
        this.isVisibilityProductErrMsg = false;
        this.isVisibilityDealErrMsg = false;
        this.formGroup = new FormGroup({
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
            GDM_PRD_TYPE_NM: new FormControl(dataItem.GDM_PRD_TYPE_NM),
            GDM_VRT_NM: new FormControl(dataItem.GDM_VRT_NM),
            DIV_NM: new FormControl(dataItem.DIV_NM),
            OP_CD: new FormControl(dataItem.OP_CD),
            DEAL_PRD_TYPE: new FormControl(dataItem.DEAL_PRD_TYPE ,dataItem.ACTV_IND == true ? Validators.required : Validators.nullValidator),
            PRD_CAT_NM: new FormControl(dataItem.PRD_CAT_NM ,dataItem.ACTV_IND == true ? Validators.required : Validators.nullValidator),
            CHG_EMP_NM: new FormControl(dataItem.CHG_EMP_NM),
            CHG_DTM: new FormControl(dataItem.CHG_DTM),
            PRD_CAT_MAP_SID: new FormControl(dataItem.PRD_CAT_MAP_SID),
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            if (this.formGroup.get("ACTV_IND").value) {
                this.isVisibilityProductErrMsg = (this.formGroup.get("PRD_CAT_NM").value.length > 0) ? false : true;
                this.isVisibilityDealErrMsg = (this.formGroup.get("DEAL_PRD_TYPE").value.length > 0) ? false : true;
            }
            else {
                this.isVisibilityProductErrMsg = false;
                this.isVisibilityDealErrMsg = false;
            }
        });
        this.formGroup.get("ACTV_IND").valueChanges
			.subscribe(value => {
			    if (value) {
			        this.formGroup.get("PRD_CAT_NM").setValidators(Validators.required);
			        this.formGroup.get("DEAL_PRD_TYPE").setValidators(Validators.required);
			        this.isVisibilityProductErrMsg = (this.formGroup.get("PRD_CAT_NM").value.length > 0) ? false : true;
			        this.isVisibilityDealErrMsg = (this.formGroup.get("DEAL_PRD_TYPE").value.length > 0) ? false : true;
			    } else {
			        this.formGroup.get("PRD_CAT_NM").clearValidators();
			        this.formGroup.get("DEAL_PRD_TYPE").clearValidators();
			        this.isVisibilityProductErrMsg = false;
			        this.isVisibilityDealErrMsg = false;
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
    closeDialog() {
        this.isInValidData = false;
    }
    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        let product_categories: Product_categories[]=[];
        product_categories.push(formGroup.value);
        //As updateCategory method in the server side expects product category as a list, sending it as array object
        var product_categoriesData = product_categories[0];
        if (this.isFormChange) {
            this.isInValidData = this.validateData(product_categoriesData);
            if (!this.isInValidData) {
                this.isLoading = true;
                this.productCategorySvc.updateCategory(product_categories).subscribe(
                    result => {
                        var response = result[0];
                        this.gridResult[rowIndex] = response;
                        this.gridResult.push(response);
                        this.loadproductCategoriesData();
                        sender.closeRow(rowIndex);
                        this.loggerSvc.success("Product Verticals were successfully updated.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to update Product Vertical.", error);
                        this.isLoading = false;
                    }
                );
            }
        }
        //sender.closeRow(rowIndex);
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
    validateData(model: any) {
        let retCond = false;
        if (model.ACTV_IND == true) {
             if (model.DEAL_PRD_TYPE.length == 0 && model.PRD_CAT_NM.length == 0) {
                this.errorMsg = "Product Vertical Name and Deal Product Type are required when the Active Indicator is checked. Please check your input and try again.";
                this.formGroup.markAllAsTouched();
                retCond = true;
            }
            else if (model.DEAL_PRD_TYPE.length == 0) {
                this.errorMsg = "Deal Product Type is required when the Active Indicator is checked. Please check your input and try again.";
                this.formGroup.markAllAsTouched();
                retCond = true;
            }
            else if (model.PRD_CAT_NM.length == 0) {
                this.errorMsg = "Product Vertical Name is required when the Active Indicator is checked. Please check your input and try again.";
                this.formGroup.markAllAsTouched();
                retCond = true;
            }
           
        }
        else {
            retCond = false;
        }
       
        
        return retCond;
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
