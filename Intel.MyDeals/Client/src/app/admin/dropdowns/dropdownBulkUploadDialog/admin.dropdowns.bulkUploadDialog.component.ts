/* eslint-disable @typescript-eslint/no-inferrable-types, prefer-const, no-useless-escape */
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { State, process } from "@progress/kendo-data-query";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { logger } from "../../../shared/logger/logger";
import { DropdownService } from "../admin.dropdowns.service";
import { UiDropdownItem, UiDropdownResponseItem } from "../admin.dropdowns.model";
import { BulkUploadDialogData, ValueProgress, InsertResult, DropdownBaseData } from "./admin.dropdowns.bulkUploadDialog.model";

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

    private returnEmptyIfUndefinedOrNull(arrayToValidate: Array<unknown>): Array<unknown> {
        if (arrayToValidate != null || arrayToValidate != undefined || arrayToValidate.length > 0) {
            return arrayToValidate;
        } else {
            return [];
        }
    }

    private sanitizeCommaSeperatedValues(values: string): ValueProgress {
        const NON_DUPLICATE_SPLIT_VALUES = Array.from(new Set(values.split(/\s*,\s*/g)));

        const REGEX_REPLACE_TO_SPACE = /(\r\n|\r|\n|\s)/g;
        const REGEX_WHITESPACE_BEGINNING_OR_ENDING = /(^\s+)|(\s+$)/g;
        let newLineAndWhitespaceFiltered: string[] = [];
        for (const VALUE of NON_DUPLICATE_SPLIT_VALUES) {
            let wipValue = VALUE;

            // Replace new line characters (\r\n, \r, \n) and all whitespaces (\s) with a regular space
            if (REGEX_REPLACE_TO_SPACE.test(VALUE)) {
                wipValue = wipValue.replace(REGEX_REPLACE_TO_SPACE, ' ');
            }

            // Redo removal of whitespaces at the beginning or end of the value since new ones may have been introduced
            if (REGEX_WHITESPACE_BEGINNING_OR_ENDING.test(VALUE)) {
                wipValue = wipValue.trim();
            }

            newLineAndWhitespaceFiltered.push(wipValue);
        }
        const NON_DUPLICATE_NEW_LINE_AND_WHITESPACE_FILTERED_VALUES = Array.from(new Set(newLineAndWhitespaceFiltered));

        // Remove values that only have spaces or empty values
        const NON_EMPTY_VALUES = NON_DUPLICATE_NEW_LINE_AND_WHITESPACE_FILTERED_VALUES.filter((value: string) => {
            if (value == null || value == undefined || value.match(/^\s*$/g)) {
                return false;
            }

            return true;
        });

        // Remove values that do not adhere to our characterset
        const REGEX_LATIN_ALPHANUMERIC_AND_SYMBOLS = /^[ a-z0-9!@#$%^&*()\-_=+.\/;'`":™®\\]+$/i;
        let invalidValuesUnsupportedCharacters: InsertResult[] = [];
        const VALID_CHARACTERSET_VALUES = NON_EMPTY_VALUES.filter((value: string) => {
            if (value.match(REGEX_LATIN_ALPHANUMERIC_AND_SYMBOLS)) {
                return true;
            }

            invalidValuesUnsupportedCharacters.push({
                value: value,
                resultMessage: `Failed: This value contains an unsupported character, the accepted characterset for this field is latin alphanumeric (a-z, A-Z, 0-9) and certain special characters (! @ # $ % ^ & * ( ) - _ = + . / ; ' \` \" : ™ ® \\)`,
                isSuccess: false
            });
            return false;
        });

        return {
            pendingValid: this.returnEmptyIfUndefinedOrNull(VALID_CHARACTERSET_VALUES) as string[],
            failedInsertWithMessage: this.returnEmptyIfUndefinedOrNull(invalidValuesUnsupportedCharacters) as InsertResult[],
            successfullyInserted: []
        };
    }

    private indexOfCaseInsensitive(values: string[], compareTo: string): number {
        return values.findIndex((value: string) => {
            return compareTo.toUpperCase() === value.toUpperCase();
        });
    }

    private removeAndFlagExistingValues(valueProgressData: ValueProgress, basicDropdownData: UiDropdownResponseItem[]): ValueProgress {
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
            let listOfDuplicates: Array<InsertResult> = [];

            for (const EXISTING_DROPDOWN_VALUE of MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES) {
                const INDEX_MATCH = this.indexOfCaseInsensitive(valueProgressData.pendingValid, EXISTING_DROPDOWN_VALUE);

                if (INDEX_MATCH !== -1) {
                    listOfDuplicates.push({
                        value: EXISTING_DROPDOWN_VALUE,
                        resultMessage: 'Failed: Existing entry in dropdown table',
                        isSuccess: false
                    });

                    valueProgressData.pendingValid.splice(INDEX_MATCH, 1);
                }
            }

            valueProgressData.failedInsertWithMessage.push(...listOfDuplicates);
        }

        return valueProgressData;
    }

    private getSidFromName(DATA: DropdownBaseData[], NAME: string): number {
        return DATA.filter((dataObj: DropdownBaseData) => {
            return dataObj.dropdownName.includes(NAME);
        })[0].dropdownID;
    }

    private generateDropdownItemsForApi(values: string[]): Array<UiDropdownItem> {
        let generatedItems: Array<UiDropdownItem> = [];

        if (values.length > 0) {
            const ACTV_IND: boolean = this.formData.get('ACTV_IND').value;
            const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
            const GROUP: string = this.formData.get('ATRB_CD').value;
            const CUSTOMER: string = this.formData.get('CUST_NM').value;

            const DEAL_TYPE_SID = this.getSidFromName(this.data.dealTypeData, DEAL_TYPE);
            const GROUP_SID = this.getSidFromName(this.data.groupData, GROUP);
            const CUSTOMER_SID = this.getSidFromName(this.data.customerData, CUSTOMER);

            if (DEAL_TYPE_SID !== undefined || GROUP_SID !== undefined || CUSTOMER_SID !== undefined) {
                for (const VALUE of values) {
                    generatedItems.push({
                        ACTV_IND: ACTV_IND,
                        OBJ_SET_TYPE_CD: DEAL_TYPE,
                        OBJ_SET_TYPE_SID: DEAL_TYPE_SID,
                        ATRB_CD: GROUP,
                        ATRB_SID: GROUP_SID,
                        CUST_NM: CUSTOMER,
                        CUST_MBR_SID: CUSTOMER_SID,
                        DROP_DOWN: VALUE,
                        ATRB_LKUP_DESC: "",
                        ATRB_LKUP_TTIP: "",
                        ORD: null
                    });
                }
            } else {
                this.loggerService.error('DropdownBulkUploadDialogComponent: generateDropdownItemsForApi():: Could not get SID required for insert', null);
            }
        }

        return generatedItems;
    }

    private valueProgressToInsertResults(valueProgress: ValueProgress, ignorePending: boolean, pendingErrorMessage: string = ''): Array<InsertResult> {
        const PENDING_VALUES: string[] = valueProgress.pendingValid;
        let failedDropdownValuesWithMessage: Array<InsertResult> = valueProgress.failedInsertWithMessage;

        if (!ignorePending && PENDING_VALUES.length > 0) {
            for (const PENDING_VALUE of PENDING_VALUES) {
                failedDropdownValuesWithMessage.push({
                    value: PENDING_VALUE,
                    resultMessage: pendingErrorMessage,
                    isSuccess: false
                });
            }
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

    private insertResults: Array<InsertResult> = [];
    private insertAllDropdowns(preparedDropdownPayloads: UiDropdownItem[]): Observable<number> {
        let pendingValueCounter = new BehaviorSubject<number>(0);

        for (const PREPARED_PAYLOAD of preparedDropdownPayloads) {
            const DROPDOWN_VALUE = PREPARED_PAYLOAD.DROP_DOWN;

            this.dropdownService.insertBasicDropdowns(PREPARED_PAYLOAD).subscribe((result: UiDropdownResponseItem) => {
                this.insertResults.push({
                    value: DROPDOWN_VALUE,
                    resultMessage: 'Successful',
                    isSuccess: true
                });
                pendingValueCounter.next(pendingValueCounter.value + 1);
            }, (error) => {
                this.insertResults.push({
                    value: DROPDOWN_VALUE,
                    resultMessage: `Failed: DropdownBulkUploadDialogComponent: insertBasicDropdown(): Unable to insert Dropdown:: Status ${ (error as HttpErrorResponse).status } ${ (error as HttpErrorResponse).statusText }`,
                    isSuccess: false
                });
                pendingValueCounter.next(pendingValueCounter.value + 1);
            });
        }

        return pendingValueCounter.asObservable();
    }

    private insertResultsGridData: GridDataResult;
    private insertResultsGridState: State = {
        skip: 0,
        sort: [{ field: 'value', dir: 'asc' }]
    };

    private triggerToastNotification(amountFailed: number, amountSuccess: number): void {
        if (amountFailed > 0 && amountSuccess === 0) {
            this.loggerService.error('All dropdown values failed to be added', '')
        } else if (amountSuccess > 0 && amountFailed === 0) {
            this.loggerService.success('All dropdown values were added successfully');
        } else {
            this.loggerService.warn('Some dropdown values failed to be added', '');
        }
    }

    private insertIsLoading = true;
    private updateGridData(resultData: InsertResult[]) {
        const COUNT_SUCCESS = resultData.reduce((counter, value) => {
            return counter + (value.isSuccess ? 1 : 0);
        }, 0);
        const COUNT_FAILED = resultData.length - COUNT_SUCCESS;
        this.triggerToastNotification(COUNT_FAILED, COUNT_SUCCESS);

        this.insertResultsGridData = process(resultData, this.insertResultsGridState);
        this.insertIsLoading = false;
    }

    private handleFailedState(valueProgress: ValueProgress | null, errorMessage: string, errorTitle: string, error: any = {}) {
        this.loggerService.error(errorMessage, errorTitle, error);

        if (valueProgress != null) {
            const INSERT_RESULTS_CURRENT_STATUS: Array<InsertResult> = this.valueProgressToInsertResults(valueProgress, false, `Not able to execute: ${ errorTitle } - ${ errorMessage }`);
            this.updateGridData(INSERT_RESULTS_CURRENT_STATUS);
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

            const SANITIZED_VALUES = this.sanitizeCommaSeperatedValues(this.formData.get('DROP_DOWN_CSV').value as string);
            valueProgress.pendingValid.push(...SANITIZED_VALUES.pendingValid);
            valueProgress.failedInsertWithMessage.push(...SANITIZED_VALUES.failedInsertWithMessage);

            if (valueProgress.pendingValid && valueProgress.pendingValid.length > 0) {
                const BASIC_DROPDOWNS_ERROR = 'Could not load existing UI Dropdown Values to prevent duplicates';

                this.dropdownService.getBasicDropdowns(true).subscribe((BASIC_DROPDOWN_DATA: UiDropdownResponseItem[]) => {
                    if (BASIC_DROPDOWN_DATA !== null || BASIC_DROPDOWN_DATA !== undefined) {
                        valueProgress = this.removeAndFlagExistingValues(valueProgress, BASIC_DROPDOWN_DATA);

                        if (valueProgress != null || valueProgress != undefined) {
                            this.insertResults.push(...valueProgress.failedInsertWithMessage);

                            const GENERATED_DROPDOWN_ITEMS: Array<UiDropdownItem> = this.generateDropdownItemsForApi(valueProgress.pendingValid);
                            this.insertAllDropdowns(GENERATED_DROPDOWN_ITEMS).subscribe((counter: number) => {
                                if (counter >= GENERATED_DROPDOWN_ITEMS.length) {
                                    this.updateGridData(this.insertResults);
                                }
                            });
                        } else {
                            this.handleFailedState(null, 'Invalid Value Progress object was generated, cannot continue with insertion', '');
                        }
                    } else {
                        this.handleFailedState(valueProgress, BASIC_DROPDOWNS_ERROR, 'API Error');
                    }
                }, (error) => {
                    this.handleFailedState(valueProgress, BASIC_DROPDOWNS_ERROR, error.statusText, error);
                });
            } else {
                this.handleFailedState(valueProgress, 'No valid values were added', 'Validation Error');
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