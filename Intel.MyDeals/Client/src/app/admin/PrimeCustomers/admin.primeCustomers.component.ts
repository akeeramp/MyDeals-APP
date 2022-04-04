import * as angular from "angular";
import { logger } from "../../shared/logger/logger";
import { primeCustomerService } from "./admin.primeCustomers.service";
import { Component, ViewChild } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { PrimeCust_Map } from "./admin.primeCustomers.model";
import { ThemePalette } from "@angular/material/core";
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
    selector: "adminPrimeCustomers",
    templateUrl: "Client/src/app/admin/PrimeCustomers/admin.primeCustomers.component.html",
    //styleUrls: ['Client/src/app/admin/PrimeCustomers/admin.primeCustomers.component.css']
})
export class adminPrimeCustomersComponent {
    constructor(private primeCustSvc: primeCustomerService, private loggerSvc: logger) {
        //Since both kendo makes issue in Angular and AngularJS dynamically removing AngularJS
        $(
            'link[rel=stylesheet][href="/Content/kendo/2017.R1/kendo.common-material.min.css"]'
        ).remove();
        $('link[rel=stylesheet][href="/css/kendo.intel.css"]').remove();
    }

    @ViewChild("primeCustDropDown") private primeCustDdl;
    @ViewChild("primeCustNmDropDown") private primeCustNmDdl;
    @ViewChild("ctryCustDropDown") private ctryCustDdl;
    @ViewChild("ctryCustNmDropDown") private ctryCustNmDdl;
    @ViewChild("primeCtryDropDown") private primeCtryDdl;
    @ViewChild("rplStsCdDropDown") private rplStsCdDdl;

    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult: Array<any>;
    private gridData: GridDataResult;
    private color: ThemePalette = 'primary';
    public distinctPrimeCustNm: Array<any>;
    public distinctCtryCustNm: Array<any>;
    public distinctprimeCtry: Array<any>;
    public distinctRplCd: Array<any> = [];
    public rplValue: Array<any>;
    public primeCustData: Array<any>;
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public isFormChange = false;
    public distinctCountry: Array<any>;
    public errorMsg = "";
    public allowCustom = true;
    public editAccess = true;
    private isNew: boolean; primeCust_map: any; rowIndex: number; saveAction = "Active";
    isCombExists = false; isDialogVisible = false; cancelConfirm = false;
    public isUnifiedIdEditable = false; isPrimCustNmEditable = false;
    isPrimLvlIdEditable = false; isPrimCustCtryEditable = false; isRplStsDdEditable = false;
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

    distinctPrimitive(fieldName: string): any {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    loadPrimeCustomer() {
        //RA alone will have view access
        if ((<any>window).usrRole == "RA" && !(<any>window).isDeveloper) {
            this.editAccess = false;
        }
        //Developer can see the Screen..
        if (!(<any>window).isCustomerAdmin && (<any>window).usrRole != "SA" && (<any>window).usrRole != "RA" && !(<any>window).isDeveloper) {
            document.location.href = "/Dashboard#/portal";
        }
        else {
            this.primeCustSvc.GetPrimeCustomerDetails().subscribe((result: Array<any>) => {
                this.isLoading = false;
                this.gridResult = result;
                this.gridData = process(result, this.state);
                this.getPrimeCustomersDataSource();
            }, (error) => {
                this.loggerSvc.error('Prime Customer service', error);
            });
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
        this.isUnifiedIdEditable = true;
        this.isPrimCustNmEditable = true;
        this.isPrimLvlIdEditable = true;
        this.isPrimCustCtryEditable = true;
        this.formGroup = new FormGroup({
            IS_ACTV: new FormControl(false, Validators.required),
            PRIM_CUST_ID: new FormControl("", Validators.compose([
                Validators.required,
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(10)
            ])
            ),
            PRIM_CUST_NM: new FormControl("", Validators.required),
            PRIM_LVL_ID: new FormControl("", Validators.compose([
                Validators.required,
                Validators.pattern("^[0-9]*$"),
                Validators.maxLength(10)
            ])
            ),
            PRIM_LVL_NM: new FormControl({ value: "", disabled: true }),
            PRIM_CUST_CTRY: new FormControl("", Validators.required),
            RPL_STS_CD: new FormControl({ value: "", disabled: true }),

        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            this.saveAction = x.IS_ACTV == false ? "InActive" : "Active";
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }) {
        this.isRplStsDdEditable = true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            IS_ACTV: new FormControl(dataItem.IS_ACTV),
            PRIM_SID: new FormControl(dataItem.PRIM_SID),
            PRIM_CUST_ID: new FormControl({ value: dataItem.PRIM_CUST_ID, disabled: true }),
            PRIM_CUST_NM: new FormControl({ value: dataItem.PRIM_CUST_NM, disabled: true }),
            PRIM_LVL_ID: new FormControl({ value: dataItem.PRIM_LVL_ID, disabled: true }),
            PRIM_LVL_NM: new FormControl({ value: dataItem.PRIM_LVL_NM, disabled: true }),
            PRIM_CUST_CTRY: new FormControl({ value: dataItem.PRIM_CUST_CTRY, disabled: true }),
            RPL_STS_CD: new FormControl(dataItem.RPL_STS_CD.split(",").filter(x => x != ''))
        });
        this.formGroup.valueChanges.subscribe(x => {
            this.isFormChange = true;
            this.saveAction = x.IS_ACTV == false ? "InActive" : "Active";
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    clearFilter() {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    //API connections
    getPrimeCustomersDataSource() {
        this.primeCustSvc.getPrimeCustomers()
            .subscribe((response: Array<any>) => {
                this.distinctPrimeCustNm = distinct(response, "Value").map(
                    item => item.Value
                );
                this.distinctCtryCustNm = distinct(response, "Text").map(
                    item => item.Text
                );
            }, function (response) {
                this.loggerSvc.error("Unable to get Unified Customers.", response, response.statusText);
            });

        /*Hiding the column temporarily as part of UCD Development.This might be enabled in future(functionality is implemented)*/
        /*this.primeCustSvc.getRplStatusCodes()
            .subscribe((response: Array<any>) => {
                this.distinctRplCd = distinct(response, "RPL_STS_CD").map(
                    item => item.RPL_STS_CD
                );
            }, function (response) {
                    this.loggerSvc.error("Unable to get RPL status code.", response, response.statusText);
            });*/
        this.primeCustSvc.getCountries()
            .subscribe((response: Array<any>) => {
                this.distinctprimeCtry = distinct(response, "CTRY_NM").map(
                    item => item.CTRY_NM
                );
            }, function (response) {
                this.loggerSvc.error("Unable to get Countries.", response, response.statusText);
            });
    }

    cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;
    }

    saveConfirmation() {
        this.isDialogVisible = false;
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;

        if (this.isDialogVisible)
            this.isDialogVisible = false;
        if (this.saveAction == "InActive" && !this.isCombExists) {
            this.insertUpdateOperation(this.rowIndex, this.isNew, this.primeCust_map);
            this.isDialogVisible = false;
        }
        else {
            this.isDialogVisible = false;
        }
    }
    saveCancel() {
        this.isDialogVisible = false;
        this.cancelConfirm = false;
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;
    }


    IsValidCombination(model: any) {
        let retCond = false;
        const isPrimeIdexist = this.gridResult.filter(x => x.PRIM_CUST_ID === parseInt(model.PRIM_CUST_ID));
        

        this.gridResult.map(
            (x)=> {
                const x_Prim_Cust_Nm = (x.PRIM_CUST_NM ? x.PRIM_CUST_NM.toLowerCase().trim() : '');
                const model_Cust_Nm = (model.PRIM_CUST_NM ? model.PRIM_CUST_NM.toLowerCase().trim() : '');
                const patt = new RegExp("^[\\w .,:'&-]*$");
                const res = patt.test(model_Cust_Nm);

                if (!res) {
                    this.errorMsg = "Invalid Character identified in Unified Customer Name. Please remove it and Save.";
                    retCond = true;
                }
                else if (isPrimeIdexist.length >= 1 && model.PRIM_SID !== x.PRIM_SID) {
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm !== model_Cust_Nm && model_Cust_Nm != "" && model_Cust_Nm != null && x.IS_ACTV == true) {
                        this.errorMsg = "Unified ID \"" + model.PRIM_CUST_ID + "\" is associated with \"" + x.PRIM_CUST_NM + "\" Unified Customer is active";
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID == model.PRIM_LVL_ID && x.PRIM_CUST_CTRY != model.PRIM_CUST_CTRY && x.IS_ACTV) {
                        this.errorMsg = "For this combination of Unified Id \"" + model.PRIM_CUST_ID + "\" and Unified Customer Name \"" + model.PRIM_CUST_NM + "\" this Level 2 ID already exists in active status";
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID == model.PRIM_LVL_ID && x.PRIM_CUST_CTRY == model.PRIM_CUST_CTRY) {
                        this.errorMsg = "This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists";
                        retCond = true;
                    }
                    else if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID != model.PRIM_LVL_ID && x.PRIM_CUST_CTRY == model.PRIM_CUST_CTRY && x.IS_ACTV) {
                        this.errorMsg = "This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists in active status";
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && isPrimeIdexist.length == 1 && model.PRIM_SID !== "" && x.IS_ACTV) {
                        this.errorMsg = "\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active";
                        retCond = true;
                    }
                }
                else if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && isPrimeIdexist.length < 1 && x.PRIM_SID !== model.PRIM_SID && model.PRIM_CUST_ID != null && model.PRIM_CUST_ID != "" && x.IS_ACTV) {
                    this.errorMsg = "\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active";
                    retCond = true;
                }
            }
        );

        if (model.PRIM_CUST_ID == null || model.PRIM_CUST_ID == '') {
            this.errorMsg = "Please provide Valid Unified ID";
            retCond = true;
        }
        if (model.PRIM_CUST_NM == null || model.PRIM_CUST_NM == '') {
            this.errorMsg = "Please Provide Valid Unified Customer Name";
            retCond = true;
        }
        else if (model.PRIM_CUST_NM.length > 65) {
            this.errorMsg = "Unified Customer Name Length should not be greater than 65 characters";
            retCond = true;
        }

        if (model.PRIM_LVL_ID == null || model.PRIM_LVL_ID == '') {
            this.errorMsg = "Please Provide Valid Level 2 ID";
            retCond = true;
        }

        if (model.PRIM_CUST_CTRY == null || model.PRIM_CUST_CTRY == '' || this.distinctprimeCtry.filter(x => x === model.PRIM_CUST_CTRY).length == 0) {
            this.errorMsg = "Please Select Valid Country.";
            retCond = true;
        }

        return retCond;
    }

    insertUpdateOperation(rowIndex, isNew, primeCust_map) {
        if (!this.isCombExists) {
            if (isNew) {
                this.isLoading = true;
                this.primeCustSvc.SetPrimeCustomers(primeCust_map).subscribe(
                    () => {
                        this.gridResult.push(primeCust_map);
                        this.loadPrimeCustomer();
                        this.loggerSvc.success("New Unified Customer Added.");
                        //sender.closeRow(rowIndex);
                    },
                    error => {
                        this.loggerSvc.error("Unable to insert Unified Customer.", error);
                        this.isLoading = false;
                    }
                );
            } else {
                this.isLoading = true;
                this.primeCustSvc.UpdatePrimeCustomer(primeCust_map).subscribe(
                    () => {
                        this.gridResult[rowIndex] = primeCust_map;
                        this.gridResult.push(primeCust_map);
                        this.loadPrimeCustomer();
                        this.loggerSvc.success("Unified Customer updated.");
                        //sender.closeRow(rowIndex);
                    },
                    error => {
                        this.loggerSvc.error("Unable to update unified customer data.", error);
                        this.isLoading = false;
                    }
                );
            }
        }
    }

    saveHandler({ sender, rowIndex, formGroup, isNew }) {
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;
        const primeCust_map: PrimeCust_Map = formGroup.getRawValue();
        if (primeCust_map.RPL_STS_CD) {
            primeCust_map.RPL_STS_CD = primeCust_map.RPL_STS_CD.join();
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCombination(primeCust_map);
            const updatedData = this.gridResult.filter(x => x.PRIM_CUST_ID == primeCust_map.PRIM_CUST_ID && x.PRIM_CUST_NM == primeCust_map.PRIM_CUST_NM &&
                x.PRIM_LVL_ID == primeCust_map.PRIM_LVL_ID && x.PRIM_LVL_NM == primeCust_map.PRIM_LVL_NM);
            if (!this.isCombExists) {
                //giving validation message if user inactive a customer
                if (!primeCust_map.IS_ACTV && updatedData.length > 0 && updatedData[0].IS_ACTV != primeCust_map.IS_ACTV) {
                    this.isCombExists = false;
                    this.isDialogVisible = true;
                    this.cancelConfirm = true;
                    this.isNew = isNew;
                    this.primeCust_map = primeCust_map;
                    this.rowIndex = rowIndex;
                    this.errorMsg = "There may be a chance of deals associated with this combination.\n Are you sure want to deactivate this combination ?";
                }
                else {
                    this.insertUpdateOperation(rowIndex, isNew, primeCust_map);
                }
            }
            else {
                this.isDialogVisible = true;
                this.cancelConfirm = false;
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
        this.loadPrimeCustomer();
    }

    ngOnInit() {
        this.loadPrimeCustomer();
    }

    ngOnDestroy() {
        //The style removed are adding back
        $('head').append('<link rel="stylesheet" type="text/css" href="/Content/kendo/2017.R1/kendo.common-material.min.css">');
        $('head').append('<link rel="stylesheet" type="text/css" href="/css/kendo.intel.css">');
    }

}

angular
    .module("app")
    .directive("adminPrimeCustomers",
        downgradeComponent({ component: adminPrimeCustomersComponent })
    );
