import { logger } from "../../shared/logger/logger";
import { productAliasService } from "./admin.productAlias.service";
import { Component, ViewChild } from "@angular/core";
import { Product_Alias_Map } from "./admin.productAlias.model";
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
    selector: 'admin-product-alias',
    templateUrl: 'Client/src/app/admin/productAlias/admin.productAlias.component.html',
    styleUrls: ['Client/src/app/admin/productAlias/admin.productAlias.component.css']
})
export class adminProductAliasComponent {
    constructor(private productAliasSvc: productAliasService, private loggerSvc: logger) { }
    @ViewChild("catDropDown") private catDdl;
    @ViewChild("custDropDown") private custDdl;
    @ViewChild("countDropDown") private countDdl;
    @ViewChild("partDropDown") private partDdl;

    private isLoading = true;
    private errorMsg = "";
    private dataSource;
    private gridOptions;
    private allowCustom = true;
    private color: ThemePalette = "primary";

    public gridResult = [];
    public type = "numeric";
    public info = true;
    public product_map;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    private isNew: boolean; rowIndex: number; isCombExists = false;
    isDialogVisible = false; cancelConfirm = false; isDelete = false; isOk = false;

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
        {
            text: "250",
            value: 250,
        },
        {
            text: "All",
            value: "all"
        }
    ];

    public gridData: GridDataResult;

    distinctPrimitive(fieldName: string) {
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
        if (!((<any>window).usrRole === 'SA' || (<any>window).isDeveloper)) {
            document.location.href = "/Dashboard#/portal";
        } else {
            this.isLoading = true;
            this.productAliasSvc.GetProductsFromAlias().subscribe(
                (result: Array<any>) => {
                    this.gridResult = result;
                    this.gridData = process(this.gridResult, this.state);
                    this.isLoading = false;
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

    IsValidCombination(model, isNew: boolean) {
        let retCond = false;
        const cond = this.gridResult.filter(x => x.PRD_ALS_NM == model.PRD_ALS_NM);
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
            PRD_NM: new FormControl("", Validators.required),
            PRD_ALS_NM: new FormControl("", Validators.required),
        });
        this.formGroup.valueChanges.subscribe(() => {
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
        this.formGroup.valueChanges.subscribe(() => {
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
            () => {
                this.loadProductAlias();
                this.loggerSvc.success("Product Alias Deleted.");
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
                () => {
                    this.gridResult.push(product_map);
                    this.loadProductAlias();
                    this.loggerSvc.success("Product Alias Mapping successfully added.");
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
                () => {
                    this.gridResult[rowIndex] = product_map;
                    this.gridResult.push(product_map);
                    this.loadProductAlias();
                    this.loggerSvc.success("Product Alias Mapping successfully updated.");
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
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadProductAlias()
    }

    ngOnInit() {
        this.loadProductAlias();
    }
}