import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { productCategoryService } from "./admin.productCategories.service";
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
    distinct,
} from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Product_categories } from "./admin.productCategories.model";
import * as _ from "underscore";
import { DatePipe } from "@angular/common";

@Component({
    selector: "admin-product-categories",
    templateUrl: "Client/src/app/admin/productCategories/admin.productCategories.component.html",
    styleUrls: ["Client/src/app/admin/productCategories/admin.productCategories.component.css"]
})

export class adminProductCategoriesComponent {
    constructor(private productCategorySvc: productCategoryService, public datepipe: DatePipe, private loggerSvc: logger) { }
    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult: Array<any>;
    public productData: Array<any>;
    public gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    private isDataValid = false;

    @ViewChild('dealPdctTooltip', { static: false }) dealPdctTooltip: NgbTooltip;
    @ViewChild('pdctVerticalTooltip', { static: false }) pdctVerticalTooltip: NgbTooltip;

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
                    _.each(response, item => {
                        item['CHG_DTM'] = this.datepipe.transform(new Date(item['CHG_DTM']), 'M/d/yyyy');
                        item['CHG_DTM'] = new Date(item['CHG_DTM']);
                    })
                    
                    this.gridResult = response;
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
        this.formGroup.valueChanges.subscribe(() => {
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
        const product_categories: Product_categories[]=[];
        product_categories.push(formGroup.value);
        this.isDataValid = this.formGroup.valid;
        if (!this.isDataValid) {
            this.toolTipvalidationMsgs(this.formGroup.controls);
        }
        else if (this.isFormChange) {
            this.isLoading = true;
            this.productCategorySvc.updateCategory(product_categories).subscribe(
                result => {
                    //getting the index value of the grid result by comparing the edited row PRD_CAT_MAP_SID to the grid result PRD_CAT_MAP_SID. so that we can update the user edited/modified data to proper grid result index
                    const index = this.gridResult.findIndex(x => product_categories[0].PRD_CAT_MAP_SID == x.PRD_CAT_MAP_SID);
                    //In the below line of code result.length check is added because some times when user edit the data and if user saves it how it was previously there without any changes at that scenario, we are not receiving any data from this service call so at that case we set product_categories(grid row level data) data to the grid result.
                    this.gridResult[index] = (result.length > 0) ? result[0] : product_categories[0];
                    //as we get the CHG_DTM value as string in the response, converting into date data type and assigning it to grid result so that date filter works properly
                    if (result.length > 0) {
                        this.gridResult[index].CHG_DTM = new Date(this.gridResult[index].CHG_DTM);
                    }
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
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
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadproductCategoriesData()
    }

    toolTipvalidationMsgs(data) {
        this.formGroup.markAllAsTouched();
        (data.PRD_CAT_NM.value == "" && data.ACTV_IND.value) ? this.pdctVerticalTooltip.open() : this.pdctVerticalTooltip.close();
        (data.DEAL_PRD_TYPE.value == "" && data.ACTV_IND.value) ? this.dealPdctTooltip.open() : this.dealPdctTooltip.close();
    }

    ngOnInit() {
        this.loadproductCategoriesData();
    }

}

angular.module("app").directive(
    "adminProductCategories",
    downgradeComponent({
        component: adminProductCategoriesComponent,
    })
);
