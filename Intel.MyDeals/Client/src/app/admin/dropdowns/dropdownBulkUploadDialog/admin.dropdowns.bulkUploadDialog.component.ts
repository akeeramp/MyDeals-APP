/* eslint-disable @typescript-eslint/no-inferrable-types, prefer-const */
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { State, process } from "@progress/kendo-data-query";
import { GridDataResult } from "@progress/kendo-angular-grid";

import { logger } from "../../../shared/logger/logger";
import { DropdownService } from "../admin.dropdowns.service";
import { UiDropdownItem, UiDropdownResponseItem } from "../admin.dropdowns.model";
import { BulkUploadDialogData, ValueProgress, InsertResult, DropdownBaseData } from "./admin.dropdowns.bulkUploadDialog.model";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'dropdown-bulk-upload-dialog',
    templateUrl: 'Client/src/app/admin/dropdowns/dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component.html',
    styleUrls: ['Client/src/app/admin/dropdowns/dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component.css']
})
export class DropdownBulkUploadDialogComponent implements OnInit {

    private formData: FormGroup;

    constructor(private DIALOG_REF: MatDialogRef<DropdownBulkUploadDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: BulkUploadDialogData,
                private dropdownService: DropdownService,
                private loggerService: logger) { }

    private disableFormInputs() {
        this.formData.disable();
    }

    private sanitizeCommaSeperatedValues(values: string): string[] {
        const NON_DUPLICATE_SPLIT_VALUES = Array.from(new Set(values.split(/\s*,\s*/g)));
        const NON_EMPTY_VALUES = NON_DUPLICATE_SPLIT_VALUES.filter((value: string) => {
            if (value == null || value == undefined || value.match(/^\s*$/g)) {
                return false;
            }

            return true;
        });
        return NON_EMPTY_VALUES;
    }

    private removeAndFlagExistingValues(valueData: ValueProgress, basicDropdownData: UiDropdownResponseItem[]): ValueProgress {
        // Filter to chosen attributes
        const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
        const GROUP: string = this.formData.get('ATRB_CD').value;
        const CUSTOMER: string = this.formData.get('CUST_NM').value;

        const MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES: string[] = basicDropdownData.filter((dropdown: UiDropdownResponseItem) => {
            if (dropdown.OBJ_SET_TYPE_CD && dropdown.OBJ_SET_TYPE_CD.includes(DEAL_TYPE)) {
                if (dropdown.ATRB_CD && dropdown.ATRB_CD.includes(GROUP)) {
                    if (dropdown.CUST_NM && dropdown.CUST_NM.includes(CUSTOMER)) {
                        return true;
                    }
                }
            }

            return false;
        }).map((dropdownItem) => dropdownItem.DROP_DOWN);

        if (MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES.length > 0) {
            let listOfDuplicates: InsertResult[] = [];

            MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES.forEach((existingDropdownValue: string) => {
                // WIP: CHANGE TO LOCALECOMPARE TO AVOID ISSUES W/ CASING // 'xyz'.localeCompare('XyZ', undefined, { sensitivity: 'base' }); // returns 0
                if (valueData.pendingValid.includes(existingDropdownValue)) {
                    listOfDuplicates.push({
                        value: existingDropdownValue,
                        resultMessage: 'Failed: Existing entry in dropdown table',
                        isSuccess: false
                    });

                    // Remove from prepared list
                    valueData.pendingValid.splice(valueData.pendingValid.indexOf(existingDropdownValue), 1);
                }
            });

            valueData.failedInsertWithMessage = listOfDuplicates;
        }

        return valueData;
    }

    private getSidFromName(DATA: DropdownBaseData[], NAME: string): number {
        return DATA.filter((dataObj: DropdownBaseData) => {
            return dataObj.dropdownName.includes(NAME);
        })[0].dropdownID;
    }

    private generateDropdownItemsForApi(values: string[]): UiDropdownItem[] {
        let generatedItems: UiDropdownItem[] = [];

        if (values.length > 0) {
            const ACTV_IND: boolean = this.formData.get('ACTV_IND').value;
            const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
            const GROUP: string = this.formData.get('ATRB_CD').value;
            const CUSTOMER: string = this.formData.get('CUST_NM').value;

            const DEAL_TYPE_SID = this.getSidFromName(this.data.dealTypeData, DEAL_TYPE);
            const GROUP_SID = this.getSidFromName(this.data.groupData, GROUP);
            const CUSTOMER_SID = this.getSidFromName(this.data.customerData, CUSTOMER);

            if (DEAL_TYPE_SID == undefined || GROUP_SID == undefined || CUSTOMER_SID ==  undefined) {
                this.loggerService.error('DropdownBulkUploadDialogComponent: generateDropdownItemsForApi():: Could not get SID required for insert', null);
            } else {
                values.forEach((value: string) => {
                    generatedItems.push({
                        ACTV_IND: ACTV_IND,
                        OBJ_SET_TYPE_CD: DEAL_TYPE,
                        OBJ_SET_TYPE_SID: DEAL_TYPE_SID,
                        ATRB_CD: GROUP,
                        ATRB_SID: GROUP_SID,
                        CUST_NM: CUSTOMER,
                        CUST_MBR_SID: CUSTOMER_SID,
                        DROP_DOWN: value,
                        ATRB_LKUP_DESC: "",
                        ATRB_LKUP_TTIP: "",
                        ORD: null
                    });
                });
            }
        }

        return generatedItems;
    }

    private valueProgressToInsertResults(valueProgress: ValueProgress, ignorePending: boolean, pendingErrorMessage: string = ''): InsertResult[] {
        let pendingValues: string[] = valueProgress.pendingValid;
        let failedDropdownValuesWithMessage: InsertResult[] = valueProgress.failedInsertWithMessage;

        if (!ignorePending && pendingValues.length > 0) {
            pendingValues.forEach((pendingValue) => {
                failedDropdownValuesWithMessage.push({
                    value: pendingValue,
                    resultMessage: pendingErrorMessage,
                    isSuccess: false
                });
            });
        }

        return [
            ...failedDropdownValuesWithMessage,
            ...(valueProgress.successfullyInserted.map((successValue: string) => {
                return {
                    value: successValue,
                    resultMessage: 'Successful',
                    isSuccess: true
                };
            }))
        ];
    }

    private insertResults: InsertResult[] = [];
    private insertAllDropdowns(preparedDropdownPayloads: UiDropdownItem[]): Observable<number> {
        let pendingValueCounter = new BehaviorSubject<number>(0);

        for (const preparedPayload of preparedDropdownPayloads) {
            const DROPDOWN_VALUE = preparedPayload.DROP_DOWN;

            this.dropdownService.insertBasicDropdowns(preparedPayload).subscribe((result: UiDropdownResponseItem) => {
                this.insertResults.push({
                    value: DROPDOWN_VALUE,
                    resultMessage: 'Successful',
                    isSuccess: true
                });
                pendingValueCounter.next(pendingValueCounter.value + 1);
                this.loggerService.success("New Dropdown Added.");
            }, (error) => {
                this.insertResults.push({
                    value: DROPDOWN_VALUE,
                    resultMessage: `Failed: DropdownBulkUploadDialogComponent: insertBasicDropdown(): Unable to insert Dropdown:: Status ${ (error as HttpErrorResponse).status } ${ (error as HttpErrorResponse).statusText }`,
                    isSuccess: false
                });
                console.log('ERROR::');
                console.log(`typeof(): ${ typeof error }`);
                console.table(error);
                pendingValueCounter.next(pendingValueCounter.value + 1);
                this.loggerService.error("Unable to insert Dropdown.", error);
            });
        }

        return pendingValueCounter.asObservable();
    }

    private insertResultsGridData: GridDataResult;
    private insertResultsGridState: State = {
        skip: 0,
        sort: [{ field: 'value', dir: 'asc' }]
    };

    private insertIsLoading = true;
    private updateGridData(resultData: InsertResult[]) {
        this.insertResultsGridData = process(resultData, this.insertResultsGridState);
        this.insertIsLoading = false;
    }

    private handleFailedState(valueProgress: ValueProgress | null, errorStatus: string) {
        if (valueProgress != null) {
            const currentStatusInsertResults: InsertResult[] = this.valueProgressToInsertResults(valueProgress, false, `Not able to execute: ${ errorStatus }`);
            this.updateGridData(currentStatusInsertResults);
        } else {
            this.updateGridData([]);
        }
    }

    private insertTriggered = false;
    onSubmit(): void {
        if (this.formData.valid){
            this.insertTriggered = true;
            this.disableFormInputs();

            let valueProgress: ValueProgress = new ValueProgress();
            valueProgress.pendingValid = this.sanitizeCommaSeperatedValues(this.formData.get('DROP_DOWN_CSV').value as string);

            if (valueProgress.pendingValid && valueProgress.pendingValid.length > 0) {
                const BASIC_DROPDOWNS_ERROR = 'Could not load existing UI Dropdown Values to prevent duplicates';
                this.dropdownService.getBasicDropdowns(true).subscribe((BASIC_DROPDOWN_DATA: UiDropdownResponseItem[]) => {
                    if (BASIC_DROPDOWN_DATA == null || BASIC_DROPDOWN_DATA == undefined) {
                        this.loggerService.warn(BASIC_DROPDOWNS_ERROR, 'API Error');
                        this.handleFailedState(valueProgress, `API Error: ${ BASIC_DROPDOWNS_ERROR }`);
                    } else {
                        valueProgress = this.removeAndFlagExistingValues(valueProgress, BASIC_DROPDOWN_DATA);

                        if (valueProgress != null || valueProgress != undefined) {
                            this.insertResults.push(...valueProgress.failedInsertWithMessage);

                            const GENERATED_DROPDOWN_ITEMS: UiDropdownItem[] = this.generateDropdownItemsForApi(valueProgress.pendingValid);
                            this.insertAllDropdowns(GENERATED_DROPDOWN_ITEMS).subscribe((counter: number) => {
                                if (counter >= GENERATED_DROPDOWN_ITEMS.length) {
                                    this.updateGridData(this.insertResults);
                                }
                            });
                        } else {
                            const NULL_VALUE_PROGRESS = 'Invalid Value Progress object was generated, cannot continue with insertion';
                            this.loggerService.error(NULL_VALUE_PROGRESS, null);
                            this.handleFailedState(null, NULL_VALUE_PROGRESS);
                        }
                    }
                }, (error) => {
                    this.loggerService.error(BASIC_DROPDOWNS_ERROR, error, error.statusText);
                    this.handleFailedState(valueProgress, BASIC_DROPDOWNS_ERROR);
                });
            } else {
                this.loggerService.warn('No valid values were added', 'Validation Error');
            }
        } else {
            this.loggerService.warn('Please fix validation errors', 'Validation Error');
        }
    }

    closeDialog() {
        this.DIALOG_REF.close();
    }

    private setupFormGroup() {
        this.formData = new FormGroup({
            ACTV_IND: new FormControl(false, Validators.required),
            OBJ_SET_TYPE_CD: new FormControl(this.data.dealTypeDropdownData[0], [Validators.required, Validators.minLength(1)]),
            ATRB_CD: new FormControl(this.data.groupDropdownData[0], [Validators.required, Validators.minLength(1)]),
            CUST_NM: new FormControl(this.data.customerDropdownData[0], [Validators.required, Validators.minLength(1)]),
            DROP_DOWN_CSV: new FormControl('', [Validators.required, Validators.minLength(1)]),
        });
    }

    ngOnInit(): void {
        this.setupFormGroup();
    }

}