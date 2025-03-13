import { Component, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { AddEvent, CancelEvent, DataStateChangeEvent, EditEvent, GridComponent, GridDataResult, PageSizeItem, RemoveEvent, SaveEvent } from "@progress/kendo-angular-grid";
import { State, distinct, process } from "@progress/kendo-data-query";
import { Observable, Subject } from "rxjs";
import { PendingChangesGuard } from "src/app/shared/util/gaurdprotectionDeactivate";
import { logger } from "../../shared/logger/logger";
import { logArchivalService } from "./admin.logArchival.service";

@Component({
    selector: 'logArchival',
    templateUrl: 'Client/src/app/admin/logArchival/admin.logArchival.component.html',
    styleUrls: ['Client/src/app/admin/logArchival/admin.logArchival.component.css']
})
export class LogArchivalComponent implements PendingChangesGuard, OnDestroy {
    constructor(private logArchivalSvc: logArchivalService, private loggerSvc: logger) {
    }

    //RXJS subject for takeuntil
    private readonly destroy$ = new Subject();
    private isLoading = false;
    private color: ThemePalette = "primary";
    isDirty = false;
    public gridResult;
    public formGroup: FormGroup;
    public isFormChange = false;
    private editedRowIndex: number;
    private isDeleteDialogVisible = false;
    private deleteItem;
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

    public gridData: GridDataResult;
    
    distinctPrimitive(fieldName: string): Array<string> {
        return distinct(this.gridResult, fieldName).map(item => item[fieldName]);
    }

    clearFilter(): void {
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.gridData = process(this.gridResult, this.state);
    }

    loadLogTable(): void {
        this.isLoading = true;
        this.logArchivalSvc.getLogArchivalDetails().subscribe(
            (result: any) => {
                this.gridResult = result;
                this.gridData = process(this.gridResult, this.state);
                this.isLoading = false;              
            },
            (err) => {
                this.loggerSvc.error("Something went wrong, unable to load the Log Archival Data. Please check and try again.", err, err.statusText);
            }
        )
    }
    
    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.gridResult, this.state);
    }

    closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex): void {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    addHandler({ sender }: AddEvent): void {        
        this.isDirty = true;
        this.closeEditor(sender);
        this.formGroup = new FormGroup({
            SRT_ORDR: new FormControl('', Validators.required),
            DB_NAME: new FormControl('', Validators.required),
            SCHEMA: new FormControl('', Validators.required),
            LOG_TBL_NM: new FormControl('',Validators.required),
            IS_PURGE: new FormControl(false),
            IS_ARCHV: new FormControl(false),
            ARCHV_DB_NAME: new FormControl({ value:'', disabled: true }),
            ARCHV_SCHEMA: new FormControl({ value: '', disabled: true }),
            ARCHV_TBL_NM: new FormControl({ value: '', disabled: true }),
            JSON_COND: new FormControl('', [Validators.required, Validators.pattern(/\{(("[a-zA-Z0-9_]+":\s*\{"[a-zA-Z0-9_]+":\s*[0-9]+,?\s*("[a-zA-Z0-9_]+":\s*"[a-zA-Z0-9_=''\s*]+",?\s*)+\}),?\s*)+\}$/)]),
            ACTV_IND: new FormControl(false)
        });
        this.formGroup.get('IS_ARCHV').valueChanges.subscribe((isArchv) => {
            if (isArchv == true) {
                this.formGroup.get('ARCHV_DB_NAME').enable();
                this.formGroup.get('ARCHV_SCHEMA').enable();
                this.formGroup.get('ARCHV_TBL_NM').enable();
            } else {
                this.formGroup.get('ARCHV_DB_NAME').setValue('');
                this.formGroup.get('ARCHV_DB_NAME').disable();
                this.formGroup.get('ARCHV_SCHEMA').setValue('');
                this.formGroup.get('ARCHV_SCHEMA').disable();
                this.formGroup.get('ARCHV_TBL_NM').setValue('');
                this.formGroup.get('ARCHV_TBL_NM').disable();
            }
        });        

        this.formGroup.get('ARCHV_DB_NAME').valueChanges.subscribe((isArchvDb) => {
            const archvSchemaValidator = this.formGroup.controls['ARCHV_SCHEMA'].validator;
            const archvTblValidator = this.formGroup.controls['ARCHV_TBL_NM'].validator;
            if (isArchvDb) {
                if (archvSchemaValidator == null) {
                    this.formGroup.controls['ARCHV_SCHEMA'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                } if (archvTblValidator == null) {
                    this.formGroup.controls['ARCHV_TBL_NM'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                }                  
            } else {
                if (this.formGroup.get('ARCHV_SCHEMA').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvSchemaValidator != null) {
                        this.formGroup.controls['ARCHV_SCHEMA'].clearValidators();
                        this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                    } if (archvTblValidator != null) {
                        this.formGroup.controls['ARCHV_TBL_NM'].clearValidators();
                        this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                    }                    
                }
            }
        });

        this.formGroup.get('ARCHV_SCHEMA').valueChanges.subscribe((isArchvSchema) => {
            const archvDbValidator = this.formGroup.controls['ARCHV_DB_NAME'].validator;
            const archvTblValidator = this.formGroup.controls['ARCHV_TBL_NM'].validator;
            if (isArchvSchema) {
                if (archvDbValidator == null) {
                    this.formGroup.controls['ARCHV_DB_NAME'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                } if (archvTblValidator == null) {
                    this.formGroup.controls['ARCHV_TBL_NM'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                }               
            } else {
                if (this.formGroup.get('ARCHV_TBL_NM').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvDbValidator != null) {
                        this.formGroup.controls['ARCHV_DB_NAME'].clearValidators();
                        this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                    } if (archvTblValidator != null) {
                        this.formGroup.controls['ARCHV_TBL_NM'].clearValidators();
                        this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                    }                    
                }
            }
        });

        this.formGroup.get('ARCHV_TBL_NM').valueChanges.subscribe((isArchvTbl) => {
            const archvDbValidator = this.formGroup.controls['ARCHV_DB_NAME'].validator;
            const archvSchemaValidator = this.formGroup.controls['ARCHV_SCHEMA'].validator;
            if (isArchvTbl) {
                if (archvSchemaValidator == null) {
                    this.formGroup.controls['ARCHV_SCHEMA'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                }
                if (archvDbValidator == null) {
                    this.formGroup.controls['ARCHV_DB_NAME'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                }
            } else {
                if (this.formGroup.get('ARCHV_SCHEMA').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvSchemaValidator != null) {
                        this.formGroup.controls['ARCHV_SCHEMA'].clearValidators();
                        this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                    } if (archvDbValidator != null) {
                        this.formGroup.controls['ARCHV_DB_NAME'].clearValidators();
                        this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                    }                    
                }
            }
        });

        //this.formGroup.get('SRT_ORDR').valueChanges.subscribe((res) => {
        //    let ind = this.gridResult.findIndex(x => x.SRT_ORDR == res);
        //    if (ind > -1) {
        //        this.loggerSvc.error("SortOrder already exists.", "Validation Error"); //sort order already exists error message
        //        this.formGroup.setValue({ "SRT_ORDR": null });
        //    }
        //});

        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });
        
        sender.addRow(this.formGroup);

    }

    onSortBlur(val) {
        let ind = this.gridResult.findIndex(x => x.SRT_ORDR == val);
        if (ind > -1) {
            this.loggerSvc.error("Sort order already exists.", "Validation Error"); //sort order already exists error message
            this.formGroup.controls['SRT_ORDR'].setErrors({ 'error': "Sort order already exists." });
        }
    }

    editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
        // needs to be modified   
        this.isDirty = true;
        this.closeEditor(sender);
        this.isFormChange = false;
        this.formGroup = new FormGroup({
            SRT_ORDR: new FormControl({ value: dataItem.SRT_ORDR, disabled: true }),
            DB_NAME: new FormControl({ value: dataItem.DB_NAME, disabled: true }),
            SCHEMA: new FormControl({ value: dataItem.SCHEMA, disabled: true }),
            LOG_TBL_NM: new FormControl({ value: dataItem.LOG_TBL_NM, disabled: true }),
            IS_PURGE: new FormControl(dataItem.IS_PURGE),
            IS_ARCHV: new FormControl(dataItem.IS_ARCHV),
            ARCHV_DB_NAME: new FormControl({ value: dataItem.ARCHV_DB_NAME, disabled: !dataItem.IS_ARCHV }),
            ARCHV_SCHEMA: new FormControl({ value: dataItem.ARCHV_SCHEMA, disabled: !dataItem.IS_ARCHV }),
            ARCHV_TBL_NM: new FormControl({ value: dataItem.ARCHV_TBL_NM, disabled: !dataItem.IS_ARCHV }),
            JSON_COND: new FormControl(dataItem.JSON_COND, [Validators.required, Validators.pattern(/\{(("[a-zA-Z0-9_]+":\s?\{"[a-zA-Z0-9_]+":\s?[0-9]+,?\s?("[a-zA-Z0-9_]+":\s?"[a-zA-Z0-9_=''\s?]+",?\s?)+\}),?\s?)+\}$/)]),
            ACTV_IND: new FormControl(dataItem.ACTV_IND)
        });

     this.formGroup.get('IS_ARCHV').valueChanges.subscribe((isArchv) => {
            if (isArchv == true) {
                this.formGroup.get('ARCHV_DB_NAME').enable();
                this.formGroup.get('ARCHV_SCHEMA').enable();
                this.formGroup.get('ARCHV_TBL_NM').enable();
            } else {
                this.formGroup.get('ARCHV_DB_NAME').setValue('');
                this.formGroup.get('ARCHV_DB_NAME').disable();
                this.formGroup.get('ARCHV_SCHEMA').setValue('');
                this.formGroup.get('ARCHV_SCHEMA').disable();
                this.formGroup.get('ARCHV_TBL_NM').setValue('');
                this.formGroup.get('ARCHV_TBL_NM').disable();
            }
        });  

        this.formGroup.get('ARCHV_DB_NAME').valueChanges.subscribe((isArchvDb) => {
            const archvSchemaValidator = this.formGroup.controls['ARCHV_SCHEMA'].validator;
            const archvTblValidator = this.formGroup.controls['ARCHV_TBL_NM'].validator;
            if (isArchvDb) {
                if (archvSchemaValidator == null) {
                    this.formGroup.controls['ARCHV_SCHEMA'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                } if (archvTblValidator == null) {
                    this.formGroup.controls['ARCHV_TBL_NM'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                }
            } else {
                if (this.formGroup.get('ARCHV_SCHEMA').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvSchemaValidator != null) {
                        this.formGroup.controls['ARCHV_SCHEMA'].clearValidators();
                        this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                    } if (archvTblValidator != null) {
                        this.formGroup.controls['ARCHV_TBL_NM'].clearValidators();
                        this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                    }
                }
            }
        });

        this.formGroup.get('ARCHV_SCHEMA').valueChanges.subscribe((isArchvSchema) => {
            const archvDbValidator = this.formGroup.controls['ARCHV_DB_NAME'].validator;
            const archvTblValidator = this.formGroup.controls['ARCHV_TBL_NM'].validator;
            if (isArchvSchema) {
                if (archvDbValidator == null) {
                    this.formGroup.controls['ARCHV_DB_NAME'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                } if (archvTblValidator == null) {
                    this.formGroup.controls['ARCHV_TBL_NM'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                }
            } else {
                if (this.formGroup.get('ARCHV_TBL_NM').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvDbValidator != null) {
                        this.formGroup.controls['ARCHV_DB_NAME'].clearValidators();
                        this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                    } if (archvTblValidator != null) {
                        this.formGroup.controls['ARCHV_TBL_NM'].clearValidators();
                        this.formGroup.controls['ARCHV_TBL_NM'].updateValueAndValidity();
                    }
                }
            }
        });

        this.formGroup.get('ARCHV_TBL_NM').valueChanges.subscribe((isArchvTbl) => {
            const archvDbValidator = this.formGroup.controls['ARCHV_DB_NAME'].validator;
            const archvSchemaValidator = this.formGroup.controls['ARCHV_SCHEMA'].validator;
            if (isArchvTbl) {
                if (archvSchemaValidator == null) {
                    this.formGroup.controls['ARCHV_SCHEMA'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                }
                if (archvDbValidator == null) {
                    this.formGroup.controls['ARCHV_DB_NAME'].setValidators([Validators.required]);
                    this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                }
            } else {
                if (this.formGroup.get('ARCHV_SCHEMA').value == "" && this.formGroup.get('ARCHV_DB_NAME').value == "") {
                    if (archvSchemaValidator != null) {
                        this.formGroup.controls['ARCHV_SCHEMA'].clearValidators();
                        this.formGroup.controls['ARCHV_SCHEMA'].updateValueAndValidity();
                    } if (archvDbValidator != null) {
                        this.formGroup.controls['ARCHV_DB_NAME'].clearValidators();
                        this.formGroup.controls['ARCHV_DB_NAME'].updateValueAndValidity();
                    }
                }
            }
        });

        this.formGroup.valueChanges.subscribe(() => {
            this.isFormChange = true;
        });
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);

    }    

    removeHandler({ dataItem }: RemoveEvent): void {        
        this.deleteItem = [];
        this.deleteItem.push(dataItem);
        this.isDeleteDialogVisible = true;
    }

    closeDeleteDialog(): void {
        this.isDeleteDialogVisible = false;
    }

    deleteRecord(): void {        
        this.isDeleteDialogVisible = false;
        this.logArchivalSvc.updateLogArchivalRecord(this.deleteItem, 'delete').subscribe(
            () => {
                this.loggerSvc.success("The record deleted successfully.")
                this.loadLogTable();
            },
            (err) => {
                this.loggerSvc.error("Unable to delete the record.", err, err.statusText)
            }
        )
    }
    
    cancelHandler({ sender, rowIndex }: CancelEvent): void {
        this.closeEditor(sender, rowIndex);
    }

    saveHandler({ sender, rowIndex, isNew, dataItem }: SaveEvent): void {
        const inData = [];
        inData.push(this.formGroup.value);
        inData[0]['LOG_ARCHVL_PRG_TBL_DTL_SID'] = dataItem.LOG_ARCHVL_PRG_TBL_DTL_SID ? dataItem.LOG_ARCHVL_PRG_TBL_DTL_SID : -1;
        const msg = isNew ? 'inserted' : 'updated';
        this.isLoading = true;
        this.logArchivalSvc.updateLogArchivalRecord(inData, 'update').subscribe(
            () => {
                this.isLoading = false;
                this.loggerSvc.success("The record " + msg + " successfully.")
                this.loadLogTable();
            },
            (err) => {
                this.loggerSvc.error("Unable to save the record.", err, err.statusText);
                this.isLoading = false;
            }
        )
        sender.closeRow(rowIndex);        
    }

    refreshGrid(): void {                
        this.isLoading = true;
        this.state.filter = {
            logic: "and",
            filters: [],
        };
        this.loadLogTable();     
    }

    canDeactivate(): Observable<boolean> | boolean {
        return !this.isDirty;
    }

    ngOnInit(): void {
        this.loadLogTable()
    }

    //destroy the subject so in this casee all RXJS observable will stop once we move out of the component
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}