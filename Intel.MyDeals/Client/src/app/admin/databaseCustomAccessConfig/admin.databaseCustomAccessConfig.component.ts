import { Component, OnDestroy, OnInit } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { DatabaseCustomAccessConfigService } from "./admin.databaseCustomAccessConfig.service";
import { constantsService } from "../constants/admin.constants.service";
import { DatabaseCustomAccessConfig } from "./admin.databaseCustomAccessConfig.model";
import { GridDataResult, DataStateChangeEvent, PageSizeItem, AddEvent, EditEvent, RemoveEvent, CancelEvent, SaveEvent, GridComponent } from "@progress/kendo-angular-grid";
import { process, State, distinct } from "@progress/kendo-data-query";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { ExcelExportEvent } from "@progress/kendo-angular-grid";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { logger } from "../../shared/logger/logger";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'databaseCustomAccessConfig',
    templateUrl: 'Client/src/app/admin/databaseCustomAccessConfig/admin.databaseCustomAccessConfig.component.html',
    styleUrls: ['Client/src/app/admin/databaseCustomAccessConfig/admin.databaseCustomAccessConfig.component.css']
})

export class databaseCustomAccessConfigComponent implements OnInit, OnDestroy {
    constructor(
        private DatabaseCustomAccessConfigSvc: DatabaseCustomAccessConfigService,
        public datepipe: DatePipe,
        private constantsService: constantsService,
        private loggerSvc: logger) {
        this.allData = this.allData.bind(this);
    }
    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject<void>();
    private isLoading = true;
    isDirty = false;
    public gridResult: Array<any>;
    public formGroup: FormGroup;
    public isFormChange = false;
    public isDbUsrNmEditable = false;
    public isErrTxtEditable = false;
    private editedRowIndex: number;
    private isDialogVisible = false;
    private isEdit = false;
    private deleteItem: any;
    private rowData: any;
    public gridData: GridDataResult;
    public envtNmList: any;
    private hasAccess = false;
    private validWWID: string;

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
            value: 250
        },
        {
            text: "All",
            value: "all",
        }
    ];

    distinctPrimitive(fieldName: string): Array<string> {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
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

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadConfigs(): void {
        this.DatabaseCustomAccessConfigSvc.dbCustomAccess([{}],'select')
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (result) => {
                    this.isLoading = false;
                    this.gridResult = result.dbCustomAccessValues;
                    this.envtNmList = result.ENVT_NM_LIST;
                    this.gridData = process(this.gridResult, this.state);
                },
                (response) => {
                    this.isLoading = false;
                    this.loggerSvc.error(
                        "Unable to get Configs Data.",
                        response,
                        response.statusText
                    );
                }
            );
    }
    closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }
    jsonValidator(control: FormControl) {
        if (!control.value) return null; // Let Validators.required handle empty/null
        try {
            const parsed = JSON.parse(control.value);
            // Only allow JSON objects or arrays, not the literal null, number, boolean, etc.
            if (typeof parsed === 'object' && parsed !== null) {
                return null; // Valid JSON object or array
            }
            return { invalidJson: true }; // Disallow "null", numbers, booleans, etc.
        } catch {
            return { invalidJson: true };
        }
        
    }
    addHandler({ sender }: AddEvent): void {
        this.isDirty = true;
        this.closeEditor(sender);
        this.isDbUsrNmEditable = true;
        this.isErrTxtEditable = true;
        this.formGroup = new FormGroup({
            ENVT: new FormControl("", Validators.required),
            DATABASEUSERNAME: new FormControl("", Validators.required),
            ACCESS_JSON: new FormControl("", [Validators.required,this.jsonValidator]),
            ERR_TXT: new FormControl(""),
            ACTV_IND: new FormControl(false, Validators.required),
            CRE_DTM: new FormControl({ value: "", disabled: true }),
            CRE_EMP_WWID: new FormControl({ value: "", disabled: true }),
            CHG_DTM: new FormControl({ value: "", disabled: true }),
            CHG_EMP_WWID: new FormControl({ value: "", disabled: true }),
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });

        sender.addRow(this.formGroup);
    }

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        this.isDirty = true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            ENVT: new FormControl(dataItem.ENVT.split(",").filter(x => x != ''), Validators.required),
            DATABASEUSERNAME: new FormControl({ value: dataItem.DATABASEUSERNAME, disabled: true }, Validators.required),
            ACCESS_JSON: new FormControl(dataItem.ACCESS_JSON, [Validators.required, this.jsonValidator]),
            ERR_TXT: new FormControl({ value: dataItem.ERR_TXT, disabled: true }),
            ACTV_IND: new FormControl(dataItem.ACTV_IND, Validators.required),
            CRE_DTM: new FormControl({ value: dataItem.CRE_DTM, disabled: true }),
            CRE_EMP_WWID: new FormControl({ value: dataItem.CRE_EMP_WWID, disabled: true }),
            CHG_DTM: new FormControl({ value: dataItem.CHG_DTM, disabled: true }),
            CHG_EMP_WWID: new FormControl({ value: dataItem.CHG_EMP_WWID, disabled: true }),
        });
        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    }

    removeHandler({ dataItem }: RemoveEvent): void {
        this.deleteItem = dataItem;
        this.isDialogVisible = true;
    }
    refresh(rowData: any) {
        let refreshData = [];
        refreshData.push(rowData);
        this.DatabaseCustomAccessConfigSvc.dbCustomAccess(refreshData, 'REFRESH').pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loggerSvc.success("Refresh completed");
            }, (error) => {
                this.loggerSvc.error('Unable to refresh configs', error.statusText);
            });
    }
    updateAllAccess(rowData: any) {
        this.DatabaseCustomAccessConfigSvc.dbCustomAccess(rowData.data, 'REFRESHALL').pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loggerSvc.success("Update all access completed");
            }, (error) => {
                this.loggerSvc.error('Unable to update all access', error.statusText);
            });
    }

    close(): void {
        this.isDialogVisible = false;
    }

    deleteRecord(): void {
        this.isDialogVisible = false;
        let deleteData = [];
        deleteData.push(this.deleteItem);
        this.DatabaseCustomAccessConfigSvc.dbCustomAccess(deleteData,'DELETE')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.refreshGrid();
                this.loggerSvc.success("Configs data Deleted.");
            },
                (response) => {
                    this.isLoading = false;
                    this.loggerSvc.error(
                        "Unable to delete configs Data.",
                        response,
                        response.statusText
                    );
                }
            )
    }

    cancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.closeEditor(sender, rowIndex);
        this.isDbUsrNmEditable = false;
        this.isErrTxtEditable = false;
    }

    saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }: SaveEvent): void {
        this.isDbUsrNmEditable = false;
        this.isErrTxtEditable = false;
        const databaseCustomAccessConfig: DatabaseCustomAccessConfig = formGroup.getRawValue();
        let configData = [];
        configData.push(databaseCustomAccessConfig);

        // Convert ENVT array to comma-separated string
        if (Array.isArray(databaseCustomAccessConfig.ENVT)) {
            databaseCustomAccessConfig.ENVT = databaseCustomAccessConfig.ENVT.join(',');
        }
        // Ensure CRE_EMP_WWID and CHG_EMP_WWID are integers, not empty string
        databaseCustomAccessConfig.CRE_EMP_WWID = databaseCustomAccessConfig.CRE_EMP_WWID ? Number(databaseCustomAccessConfig.CRE_EMP_WWID) : 0;
        databaseCustomAccessConfig.CHG_EMP_WWID = databaseCustomAccessConfig.CHG_EMP_WWID ? Number(databaseCustomAccessConfig.CHG_EMP_WWID) : 0;
        if (this.isFormChange) {
            this.isDirty = false;
            if (isNew) {
                this.isLoading = true;

                this.DatabaseCustomAccessConfigSvc.dbCustomAccess(configData,'UPDATE').pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.gridResult.push(databaseCustomAccessConfig);
                        this.loadConfigs();
                        this.loggerSvc.success("New configs added.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to save configs data.", error);
                            this.isLoading = false;
                        }
                    );
            }
            else {
                this.isLoading = true;
                this.isEdit = true;
                this.DatabaseCustomAccessConfigSvc.dbCustomAccess(configData,'UPDATE').pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.gridResult[rowIndex] = databaseCustomAccessConfig;
                        this.gridResult.push(databaseCustomAccessConfig);
                        this.loadConfigs();
                        this.isLoading = false;
                        this.loggerSvc.success("Configs data Updated.");
                    },
                        error => {
                            this.loggerSvc.error("Unable to update configs data.", error);
                            this.isLoading = false;
                        }
                    );
            }
        }
        sender.closeRow(rowIndex);
    }

    refreshGrid(): void {
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadConfigs()
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }


    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    private redirectInvalidAccess() {
        window.alert("User does not have access to the screen. Press OK to redirect to Dashboard.");
        document.location.href = "/Dashboard#/portal";
    }

    async checkPageAccess() {
        const response = await this.constantsService.getConstantsByName("UI_ACCESS_MYDL_DB_CD_ACCESS_CONFIG").toPromise().catch(error => {
            this.loggerSvc.error("Unable to fetch Employee Id", error, error.statusText);
        });

        if (response) {
            this.validWWID = response.CNST_VAL_TXT === "NA" ? "" : response.CNST_VAL_TXT;
            this.hasAccess = this.validWWID.indexOf((<any>window).usrDupWwid) > -1;
            if (this.hasAccess) {
                this.loadConfigs();
            } else {
                this.redirectInvalidAccess();
            }
        } else {
            this.redirectInvalidAccess();
        }
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.checkPageAccess();
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

    }
} 
