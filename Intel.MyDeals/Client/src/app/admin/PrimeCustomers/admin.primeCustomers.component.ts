import { logger } from "../../shared/logger/logger";
import { primeCustomerService } from "./admin.primeCustomers.service";
import { Component, ViewChild, OnDestroy } from "@angular/core";
import { Countires, PrimeCust_Map, RplStatusCode } from "./admin.primeCustomers.model";
import { ThemePalette } from "@angular/material/core";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, GridComponent, AddEvent, EditEvent, CancelEvent, SaveEvent } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { sortBy, uniq, pluck } from 'underscore';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DynamicObj } from "../employee/admin.employee.model";
import { FilterExpressBuilder } from "../../shared/util/filterExpressBuilder";
import { ExcelColumnsConfig } from '../ExcelColumnsconfig.util';
import { GridUtil } from "../../contract/grid.util";


@Component({
    selector: 'admin-prime-customers',
    templateUrl: 'Client/src/app/admin/PrimeCustomers/admin.primeCustomers.component.html',
    styleUrls: ['Client/src/app/admin/PrimeCustomers/admin.primeCustomers.component.css']
})
export class adminPrimeCustomersComponent implements PendingChangesGuard, OnDestroy {

    constructor(private primeCustSvc: primeCustomerService, private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    @ViewChild("primeCustDropDown") private primeCustDdl;
    @ViewChild("primeCustNmDropDown") private primeCustNmDdl;
    @ViewChild("ctryCustDropDown") private ctryCustDdl;
    @ViewChild("ctryCustNmDropDown") private ctryCustNmDdl;
    @ViewChild("primeCtryDropDown") private primeCtryDdl;
    @ViewChild("rplStsCdDropDown") private rplStsCdDdl;
    isDirty = false;
    private isLoading = true;
    private loadMessage = "Admin Customer Loading..";
    private type = "numeric";
    private info = true;
    private gridResult: Array<PrimeCust_Map>;
    private gridData: GridDataResult;
    private gridAllResult: Array<PrimeCust_Map>;
    private gridAllData: GridDataResult;
    private unifiedDealCustomerExcel = ExcelColumnsConfig.unifiedDealCustomerExcel;
    private color: ThemePalette = 'primary';
    public distinctPrimeCustNm: Array<string>;
    public distinctCtryCustNm: Array<string>;
    public distinctprimeCtry: Array<string>;
    public distinctRplCd: Array<string> = [];
    public rplValue: Array<any>;
    public primeCustData: Array<any>;
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public isFormChange = false;
    public distinctCountry: Array<any>;
    public errorMsg: Array<string> = [];
    private errorMessage = "";
    public allowCustom = true;
    public editAccess = true;
    private isNew: boolean; primeCust_map: PrimeCust_Map; rowIndex: number; saveAction = "Active";
    isCombExists = false; isDialogVisible = false; cancelConfirm = false;
    public isUnifiedIdEditable = false; isPrimCustNmEditable = false;
    isPrimLvlIdEditable = false; isPrimCustCtryEditable = false; isRplStsDdEditable = false;
    public virtual: any = { itemHeight: 28 };
    private sortData = "";
    private filterData = "";
    private dataforfilter: object;
    private columnFieldDataList: Map<string, Array<string>> = new Map();
    private totalCount = 0;
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
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "75", value: 75 },
        { text: "100", value: 100 }
    ];

    distinctPrimitive(fieldName: string): string[] {
        if (fieldName == 'PRIM_CUST_NM') {
            return sortBy(uniq(pluck(this.gridResult, fieldName)));
        } else if (fieldName == 'PRIM_CUST_CTRY') {
            return sortBy(uniq(pluck(this.gridResult, fieldName)));
        } else return uniq(pluck(this.gridResult, fieldName));
    }

    public onExcelExport(e: ExcelExportEvent): void {
        e.workbook.sheets[0].title = "Users Export";
    }
    public allData(): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, this.state)
        excelState.take = this.gridResult.length;

        const result: ExcelExportData = {
            data: process(this.gridResult, excelState).data,
        };

        return result;
    }

    loadPrimeCustomer(): void {
        //RA alone will have view access
        if ((<any>window).usrRole == "RA" && !(<any>window).isDeveloper) {
            this.editAccess = false;
        }
        //Developer can see the Screen.
        this.settingFilter();
        this.isLoading = true;
        this.primeCustSvc.GetPrimeCustomerDetailsByFilter(this.dataforfilter).pipe(takeUntil(this.destroy$)).subscribe((result: Array<PrimeCust_Map>) => {
            this.isLoading = false;
            this.gridResult = result;
            this.gridData = process(result, this.state);
            this.gridData.data = result;
            if (result.length > 0) {
                this.gridData.total = result[0].TotalRows;
                this.totalCount = result[0].TotalRows;
            }
        }, (error) => {
            this.loggerSvc.error('Prime Customer service', error);
        });   
        this.fieldLoad('PRIM_CUST_CTRY');
    }
    settingFilter() {
        this.sortData = "";
        this.filterData = "";
        if (this.state.sort) {
            this.state.sort.forEach((value, ind) => {
                if (value.dir) {
                    this.sortData = ind == 0 ? `${value.field} ${value.dir}` : `${this.sortData} AND ${value.field} ${value.dir}`;
                }
            });
        }
        const filterExpression = FilterExpressBuilder.createSqlExpression(JSON.stringify(this.state.filter));
        this.filterData = filterExpression;
        this.dataforfilter = {
            StrFilters: this.filterData,
            StrSorts: this.sortData,
            Skip: this.state.skip,
            Take: this.state.take
        };
    }
    fieldLoad(fieldName: string) {
        this.settingFilter();
        if (fieldName == 'PRIM_CUST_CTRY' || fieldName == 'PRIM_CUST_NM' || fieldName == 'RPL_STS_CD') {
            this.primeCustSvc.getPrimeCustData(fieldName).subscribe(data => {
                this.columnFieldDataList.set(fieldName, data);
            });

        }
    }
    GetColumnFieldData(fieldName: string): any {
        return this.columnFieldDataList.has(fieldName) ? this.columnFieldDataList.get(fieldName) : [];
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        /*  this.gridData = process(this.gridResult, this.state);*/
        this.loadPrimeCustomer();
    }
    exportToExcel() {
        this.isLoading = true;
        this.primeCustSvc.GetPrimeCustomerDetails().pipe(takeUntil(this.destroy$)).subscribe((result: Array<PrimeCust_Map>) => {
            this.isLoading = false;
            this.gridAllResult = result;
            GridUtil.dsToExcelUnifiedCustomerDealData(this.unifiedDealCustomerExcel, this.gridAllResult, "MyDealsUnifiedCustomerAdmin");
        }, (error) => {
            this.loggerSvc.error('GetPrimeCustomerDetails service', error);
        });
    }

    exportToExcelCustomColumns() {
        GridUtil.dsToExcelUnifiedCustomerDealData(this.unifiedDealCustomerExcel, this.gridResult, "MyDealsUnifiedCustomerAdmin");
    }

    closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }: AddEvent): void {
        this.isDirty = true;
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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
            this.isFormChange = true;
            this.saveAction = x.IS_ACTV == false ? "InActive" : "Active";
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty = true;
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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(x => {
            this.isFormChange = true;
            this.saveAction = x.IS_ACTV == false ? "InActive" : "Active";
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
        this.loadPrimeCustomer();
    }

    cancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.closeEditor(sender, rowIndex);
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;
    }

    saveConfirmation(): void {
        if (this.isDialogVisible)
            this.isDialogVisible = false;
        if (this.saveAction == "InActive" && !this.isCombExists) {
            this.isDialogVisible = false;
            this.isUnifiedIdEditable = false;
            this.isPrimCustNmEditable = false;
            this.isPrimLvlIdEditable = false;
            this.isPrimCustCtryEditable = false;
            this.isRplStsDdEditable = false;
            this.insertUpdateOperation(this.rowIndex, this.isNew, this.primeCust_map);
            this.isDialogVisible = false;
        } else {
            this.isDialogVisible = false;
        }
    }
    saveCancel(): void {
        this.isDialogVisible = false;
        this.cancelConfirm = false;
        this.isUnifiedIdEditable = false;
        this.isPrimCustNmEditable = false;
        this.isPrimLvlIdEditable = false;
        this.isPrimCustCtryEditable = false;
        this.isRplStsDdEditable = false;
    }

    IsValidCombination(model: PrimeCust_Map): boolean {
        let retCond = false;
        const isPrimeIdexist = this.gridResult.filter(x => x.PRIM_CUST_ID === parseInt(model.PRIM_CUST_ID));

        this.gridResult.map(
            (x) => {
                const x_Prim_Cust_Nm = (x.PRIM_CUST_NM ? x.PRIM_CUST_NM.toLowerCase().trim() : '');
                const model_Cust_Nm = (model.PRIM_CUST_NM ? model.PRIM_CUST_NM.toLowerCase().trim() : '');
                const patt = new RegExp("^[\\w\\s.,:'\&+-/]*$");
                const res = patt.test(model_Cust_Nm);

                if (!res) {
                    if (!this.errorMsg.includes("Invalid Character identified in Unified Customer Name. Please remove it and Save."))
                        this.errorMsg.push("Invalid Character identified in Unified Customer Name. Please remove it and Save.");
                    retCond = true;
                } else if (isPrimeIdexist.length >= 1 && model.PRIM_SID !== x.PRIM_SID) {
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm !== model_Cust_Nm && model_Cust_Nm != "" && model_Cust_Nm != null && x.IS_ACTV == true) {
                        if (!this.errorMsg.includes("Unified ID \"" + model.PRIM_CUST_ID + "\" is associated with \"" + x.PRIM_CUST_NM + "\" Unified Customer is active"))
                            this.errorMsg.push("Unified ID \"" + model.PRIM_CUST_ID + "\" is associated with \"" + x.PRIM_CUST_NM + "\" Unified Customer is active");
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID == model.PRIM_LVL_ID && x.PRIM_CUST_CTRY != model.PRIM_CUST_CTRY && x.IS_ACTV) {
                        if (!this.errorMsg.includes("For this combination of Unified Id \"" + model.PRIM_CUST_ID + "\" and Unified Customer Name \"" + model.PRIM_CUST_NM + "\" this Level 2 ID already exists in active status"))
                            this.errorMsg.push("For this combination of Unified Id \"" + model.PRIM_CUST_ID + "\" and Unified Customer Name \"" + model.PRIM_CUST_NM + "\" this Level 2 ID already exists in active status");
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID == model.PRIM_LVL_ID && x.PRIM_CUST_CTRY == model.PRIM_CUST_CTRY) {
                        if (!this.errorMsg.includes("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists"))
                            this.errorMsg.push("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists");
                        retCond = true;
                    } else if (x.PRIM_CUST_ID == model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && x.PRIM_LVL_ID != model.PRIM_LVL_ID && x.PRIM_CUST_CTRY == model.PRIM_CUST_CTRY && x.IS_ACTV) {
                        if (!this.errorMsg.includes("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists in active status"))
                            this.errorMsg.push("This combination of Unified Id \"" + model.PRIM_CUST_ID + "\" , Unified Customer Name \"" + model.PRIM_CUST_NM + "\" and Unified Customer Country \"" + model.PRIM_CUST_CTRY + "\" already exists in active status");
                        retCond = true;
                    }
                    if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm == model_Cust_Nm && isPrimeIdexist.length == 1 && model.PRIM_SID !== "" && x.IS_ACTV) {
                        if (!this.errorMsg.includes("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active"))
                            this.errorMsg.push("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active");
                        retCond = true;
                    }
                } else if (x.PRIM_CUST_ID !== model.PRIM_CUST_ID && x_Prim_Cust_Nm === model_Cust_Nm && isPrimeIdexist.length < 1 && x.PRIM_SID !== model.PRIM_SID && model.PRIM_CUST_ID != null && model.PRIM_CUST_ID != "" && x.IS_ACTV) {
                    if (!this.errorMsg.includes("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active"))
                        this.errorMsg.push("\"" + x.PRIM_CUST_NM + "\" Unified Customer Name is already associated with Unified ID \"" + x.PRIM_CUST_ID + "\" is active");
                    retCond = true;
                }
            }
        );

        if (model.PRIM_CUST_ID == null || model.PRIM_CUST_ID == '') {
            this.errorMsg.push("Please provide Valid Unified ID");
            retCond = true;
        }
        if (model.PRIM_CUST_NM == null || model.PRIM_CUST_NM == '') {
            this.errorMsg.push("Please Provide Valid Unified Customer Name");
            retCond = true;
        } else if (model.PRIM_CUST_NM.length > 65) {
            this.errorMsg.push("Unified Customer Name Length should not be greater than 65 characters");
            retCond = true;
        }

        if (model.PRIM_LVL_ID == null || model.PRIM_LVL_ID == '') {
            this.errorMsg.push("Please Provide Valid Level 2 ID");
            retCond = true;
        }

        if (model.PRIM_CUST_CTRY == null || model.PRIM_CUST_CTRY == '' || this.columnFieldDataList.get("PRIM_CUST_CTRY").filter(x=>x === model.PRIM_CUST_CTRY).length==0) {
            this.errorMsg.push("Please Select Valid Country.");
            retCond = true;
        }

        return retCond;
    }

    insertUpdateOperation(rowIndex: number, isNew: boolean, primeCust_map: PrimeCust_Map): void {
        this.isDirty = false;
        if (!this.isCombExists) {
            if (isNew) {
                this.isLoading = true;
                this.primeCustSvc.SetPrimeCustomers(primeCust_map).pipe(takeUntil(this.destroy$)).subscribe(
                    () => {
                        this.gridResult.push(primeCust_map);
                        this.loadPrimeCustomer();
                        this.loggerSvc.success("New Unified Customer Added.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to insert Unified Customer.", error);
                        this.isLoading = false;
                    }
                );
            } else {
                this.isLoading = true;
                this.primeCustSvc.UpdatePrimeCustomer(primeCust_map).pipe(takeUntil(this.destroy$)).subscribe(
                    () => {
                        this.gridResult[rowIndex] = primeCust_map;
                        this.gridResult.push(primeCust_map);
                        this.loadPrimeCustomer();
                        this.loggerSvc.success("Unified Customer updated.");
                    },
                    error => {
                        this.loggerSvc.error("Unable to update unified customer data.", error);
                        this.isLoading = false;
                    }
                );
            }
        }
    }

    saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
        const primeCust_map: PrimeCust_Map = formGroup.getRawValue();
        if (primeCust_map.RPL_STS_CD) {
            primeCust_map.RPL_STS_CD = primeCust_map.RPL_STS_CD.join();
        }
        this.errorMsg = [];
        if (formGroup.invalid && !this.isFormChange) {
            this.IsValidCombination(primeCust_map);
            if (this.errorMsg.length > 0) {
                this.errorMessage = this.errorMsg.join('\n');
            }
            this.isDialogVisible = true;
            this.cancelConfirm = false;
        }

        //check the combination exists
        if (this.isFormChange) {
            this.isCombExists = this.IsValidCombination(primeCust_map);
            if (this.errorMsg.length > 0) {
                this.errorMessage = this.errorMsg.join('\n');
            }
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
                    this.errorMessage = "There may be a chance of deals associated with this combination.\n Are you sure want to deactivate this combination ?";
                } else {
                    this.isUnifiedIdEditable = false;
                    this.isPrimCustNmEditable = false;
                    this.isPrimLvlIdEditable = false;
                    this.isPrimCustCtryEditable = false;
                    this.isRplStsDdEditable = false;
                    this.insertUpdateOperation(rowIndex, isNew, primeCust_map);
                }
                sender.closeRow(rowIndex);
            } else {
                this.isDialogVisible = true;
                this.cancelConfirm = false;
            }
        }
    }


    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadPrimeCustomer();
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadPrimeCustomer();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}