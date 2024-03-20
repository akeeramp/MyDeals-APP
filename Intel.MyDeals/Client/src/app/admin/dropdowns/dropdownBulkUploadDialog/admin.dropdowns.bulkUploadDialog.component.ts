/* eslint-disable @typescript-eslint/no-inferrable-types, prefer-const, no-useless-escape */
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { State, process } from "@progress/kendo-data-query";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BehaviorSubject, Observable } from "rxjs";

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

    // Global shared function candidate
    /**
     * Returns an empty generic array if the input array is null, undefined or empty, otherwise returns the same array if valid
     * @param arrayToValidate Array of any type
     * @returns The same array if it is valid and has values, otherwise returns an empty array
     */
    private returnEmptyIfUndefinedOrNull(arrayToValidate: Array<unknown>): Array<unknown> {
        if (arrayToValidate != null && arrayToValidate != undefined && arrayToValidate.length > 0) {
            return arrayToValidate;
        } else {
            return [];
        }
    }

    /**
     * @param value Array of strings to generate the InsertResult objects for
     * @returns Array of completed InsertResult objects
     */
    private createMessageForValues(value: string[], resultMessage: string, isSuccess: boolean): Array<InsertResult> {
        return value.map((value: string) => {
            return {
                value: value,
                resultMessage: resultMessage,
                isSuccess: isSuccess
            }
        });
    }

    private readonly MESSAGE_ACCEPTABLE_CHARACTERS = `? ! @ # $ ^ & * ( ) - _ = + . ; : © ™ ® \' \" \\ \/`;
    private sanitizeCommaSeperatedValues(values: string): ValueProgress {
        // Treat all line breaks and whitespaces as regular spaces
        const REGEX_REPLACE_TO_SPACE = /(\r\n|\r|\n|\s)/g;
        let wipValues: string = values.replace(REGEX_REPLACE_TO_SPACE, ' ');

        // Character Replacements (in order)
        wipValues = wipValues.replace(/((?<!\\)`)|(\\`)|(\`)/g, '\'')   // Backtick -> Single-quote
                             .replace(/((?<!\\)')|(\\')|(\')/g, '\'\'') // Convert single-quote to two single-quotes w/ escape characters (SQL limitation)
                             .replace(/(?<!\\)"/g, '\"')                // Add escape character to double-quote
                             .replace(/\'{3,}/g, '\'\'')                // Limit multiple (>= 3) single-quotes to just two single-quotes
                             .replace(/-{2,}/g, '-')                    // Multiple hyphens to single (SQL limitation)
                             .replace(/\s{2,}/g, ' ').trim();           // Multiple spaces to single space

        // Split strings
        const SPLIT_VALUES: string[] = Array.from(new Set(wipValues.split(/\s*,\s*/g)));
        const EMPTY_STRING = /^\s*$/g;
        let noEmptyValues: string[] = [];

        for (const VALUE of SPLIT_VALUES) {
            let wipValue: string = VALUE.trim();

            // FUTURE VALIDATION LOGIC HERE, Validation for individual values

            if (wipValue != null && wipValue != undefined && !EMPTY_STRING.test(wipValue)) {
                noEmptyValues.push(wipValue);
            }
        }
        const NO_DUPLICATE_OR_EMPTY: string[] = Array.from(new Set(noEmptyValues));

        // Remove values that do not adhere to our characterset
        const PATTERN_ACCEPTABLE_CHARACTERS = /^[A-Za-z0-9?!@#$^&*()-_=+.;:©™®\'\"\/\\\s]+$/;
        let failedValues: string[] = [];
        const PASSED_VALUES: string[] = NO_DUPLICATE_OR_EMPTY.filter((value: string) => {
            if (value.match(PATTERN_ACCEPTABLE_CHARACTERS)) {
                return true;
            }

            failedValues.push(value);
            return false;
        });
        const FAILED_VALUES_WITH_MESSAGE: Array<InsertResult> = this.createMessageForValues(failedValues,
            `Failed: This value contains an unsupported character, the accepted characterset for this field is latin alphanumeric (a-z, A-Z, 0-9) and certain special characters (${ this.MESSAGE_ACCEPTABLE_CHARACTERS })`,
            false);

        return {
            pendingValid: this.returnEmptyIfUndefinedOrNull(PASSED_VALUES) as string[],
            failedInsertWithMessage: this.returnEmptyIfUndefinedOrNull(FAILED_VALUES_WITH_MESSAGE) as Array<InsertResult>,
            successfullyInserted: []
        };
    }

    // Global shared function candidate
    /**
     * @returns Returns index if there is a matching string, otherwise returns -1
     */
    private indexOfCaseInsensitive(values: string[], compareValue: string): number {
        return values.findIndex((value: string) => {
            return value.trim().toUpperCase().localeCompare(compareValue.trim().toUpperCase(), undefined, { sensitivity: 'base' }) === 0;
        });
    }

    /**
     * Compares new dropdown values to an array of existing dropdown values, labels pre-existing items
     * @param valueProgressData New dropdown values to sort
     * @param basicDropdownData Existing dropdown value objects
     * @returns ValueProgress object with non-existing pending candidates and labeled existing dropdown values
     */
    private removeAndFlagExistingValues(valueProgressData: ValueProgress, basicDropdownData: Array<UiDropdownResponseItem>): ValueProgress {
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
            let existingValues: string[] = [];
            let nonExistingValues: string[] = [];
            
            for (const PENDING_VALUE of valueProgressData.pendingValid) {
                const INDEX_MATCH = this.indexOfCaseInsensitive(MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES, PENDING_VALUE);

                if (INDEX_MATCH != -1) {
                    existingValues.push(PENDING_VALUE);
                } else {
                    nonExistingValues.push(PENDING_VALUE);
                }
            }

            const EXISTING_VALUES_WITH_MESSAGE: Array<InsertResult> = this.createMessageForValues(existingValues, 'Failed: Existing entry in dropdown table', false);

            valueProgressData.failedInsertWithMessage.push(...EXISTING_VALUES_WITH_MESSAGE);
            valueProgressData.pendingValid = nonExistingValues;
        }

        return valueProgressData;
    }

    private getSidFromName(DATA: Array<DropdownBaseData>, NAME: string): number {
        return DATA.filter((dataObj: DropdownBaseData) => {
            return dataObj.dropdownName.includes(NAME);
        })[0].dropdownID;
    }

    private generateDropdownInsertPayloads(values: string[]): Array<UiDropdownItem> {
        let generatedDropdownPayloads: Array<UiDropdownItem> = [];

        if (values.length > 0) {
            const ACTV_IND: boolean = this.formData.get('ACTV_IND').value;
            const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
            const GROUP: string = this.formData.get('ATRB_CD').value;
            const CUSTOMER: string = this.formData.get('CUST_NM').value;

            const DEAL_TYPE_SID = this.getSidFromName(this.data.dealTypeData, DEAL_TYPE);
            const GROUP_SID = this.getSidFromName(this.data.groupData, GROUP);
            const CUSTOMER_SID = this.getSidFromName(this.data.customerData, CUSTOMER);

            if (DEAL_TYPE_SID != undefined && GROUP_SID != undefined && CUSTOMER_SID != undefined) {
                const GENERATED_PAYLOADS: Array<UiDropdownItem> = values.map((value: string) => {
                    return {
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
                    }
                });

                generatedDropdownPayloads.push(...GENERATED_PAYLOADS);
            } else {
                this.loggerService.error('DropdownBulkUploadDialogComponent: generateDropdownItemsForApi():: Could not get SID required for insert', null);
            }
        }

        return generatedDropdownPayloads;
    }

    private valueProgressToInsertResults(valueProgress: ValueProgress, ignorePending: boolean, pendingErrorMessage: string = ''): Array<InsertResult> {
        const PENDING_VALUES: string[] = valueProgress.pendingValid;
        let failedWithMessageAndConcatValueProgress: Array<InsertResult> = valueProgress.failedInsertWithMessage;

        if (!ignorePending && PENDING_VALUES.length > 0) {
            failedWithMessageAndConcatValueProgress.push(...this.createMessageForValues(PENDING_VALUES, pendingErrorMessage, false));
        }

        const SUCCESSFUL_WITH_MESSAGE: Array<InsertResult> = this.createMessageForValues(valueProgress.successfullyInserted, 'Successful', true);

        return [
            ...failedWithMessageAndConcatValueProgress,
            ...SUCCESSFUL_WITH_MESSAGE
        ];
    }

    private insertResults: Array<InsertResult> = [];
    private insertBulkDropdowns(preparedDropdownPayloads: Array<UiDropdownItem>): Observable<boolean> {
        let isComplete = new BehaviorSubject<boolean>(false);

        if (preparedDropdownPayloads && preparedDropdownPayloads.length > 0) {
            this.dropdownService.insertBulkBasicDropdowns(preparedDropdownPayloads).subscribe((result: Array<UiDropdownResponseItem>) => {
                // API response only contains items that were successfully added, assume others have failed from an internal error
                const SUCCESSFUL_VALUES: string[] = result.map((responseItem: UiDropdownResponseItem) => { return responseItem.DROP_DOWN });
                this.insertResults.push(...this.createMessageForValues(SUCCESSFUL_VALUES, 'Successful', true));

                // Label failed values
                if (result.length < preparedDropdownPayloads.length) {
                    const FAILED_VALUES: string[] = preparedDropdownPayloads.filter((valuePayload: UiDropdownItem) => {
                        return this.indexOfCaseInsensitive(SUCCESSFUL_VALUES, valuePayload.DROP_DOWN) === -1;
                    }).map((valuePayload: UiDropdownItem) => valuePayload.DROP_DOWN);

                    this.insertResults.push(...this.createMessageForValues(FAILED_VALUES, 'Failed: Unable to insert Dropdown, API Error', false));
                }

                isComplete.next(true);
            }, (error) => {
                console.log('ERROR: Admin Dropdowns:: Bulk Upload Dialog Component:: insertBulkDropdowns()');
                console.log(error);
    
                isComplete.next(true);
            });
        } else {
            isComplete.next(true);
        }

        return isComplete.asObservable();
    }

    private insertResultsGridData: GridDataResult;
    private insertResultsGridState: State = {
        skip: 0,
        sort: [{ field: 'value', dir: 'asc' }]
    };

    private triggerToastNotification(amountFailed: number, amountSuccess: number): void {
        if (amountFailed > 0 && amountSuccess === 0) {
            this.loggerService.error('', 'All dropdown values failed to be added')
        } else if (amountSuccess > 0 && amountFailed === 0) {
            this.loggerService.success('', 'All dropdown values were added successfully');
        } else {
            this.loggerService.warn('', 'Some dropdown values failed to be added');
        }
    }

    private insertIsLoading = true;
    private updateGridData(resultData: Array<InsertResult>) {
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

    /**
     * @returns Observable pair of boolean values, should be read in this order: [Completetion Status, Success Status]
     */
    private recycleBasicDropdownsCache(): Observable<[boolean, boolean]> {
        let completionAndSuccessPair = new BehaviorSubject<[boolean, boolean]>([false, false]);

        this.dropdownService.recycleBasicDropdownsCache().subscribe(() => {
            console.log('Successfully reset Basic Dropdowns cache');
            completionAndSuccessPair.next([true, true]);
        }, (error) => {
            // this.loggerService.error('Please manually recycle GetBasicDropdowns cache to load all values', 'Recycling Basic Dropdowns Failed', error);
            completionAndSuccessPair.next([true, false]);
        });

        return completionAndSuccessPair.asObservable();
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
                const BASIC_DROPDOWNS_ERROR = 'Could not load existing UI Dropdown Values to prevent duplicates, cannot continue with insertion';

                // Run recycle cache before pulling dropdowns
                this.recycleBasicDropdownsCache().subscribe((completionAndSuccessPair: [boolean, boolean]) => {
                    if (completionAndSuccessPair[0]) {  // When complete
                        if (completionAndSuccessPair[1]) { // Successfully reset cache
                            this.dropdownService.getBasicDropdowns(true).subscribe((BASIC_DROPDOWN_DATA: Array<UiDropdownResponseItem>) => {
                                if (BASIC_DROPDOWN_DATA !== null && BASIC_DROPDOWN_DATA !== undefined) {
                                    valueProgress = this.removeAndFlagExistingValues(valueProgress, BASIC_DROPDOWN_DATA);
            
                                    if (valueProgress != null && valueProgress != undefined) {
                                        this.insertResults.push(...valueProgress.failedInsertWithMessage);
            
                                        const GENERATED_DROPDOWN_ITEMS: Array<UiDropdownItem> = this.generateDropdownInsertPayloads(valueProgress.pendingValid);

                                        this.insertBulkDropdowns(GENERATED_DROPDOWN_ITEMS).subscribe((isComplete: boolean) => {
                                            if (isComplete) {
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
                        } else {    // Failed to reset cache
                            this.handleFailedState(valueProgress, 'Failed to recycle the Basic Dropdowns cache, cannot continue with insertion', 'Failed to Recycle Basic Dropdowns cache');
                        }
                    }
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