/* eslint-disable @typescript-eslint/no-inferrable-types, prefer-const, no-useless-escape */
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Handsontable from "handsontable";
import { CellChange, CellValue, ChangeSource } from "handsontable/common";
import { CellMeta, CellProperties, ColumnSettings, GridSettings } from "handsontable/settings";
import { HotTableRegisterer } from "@handsontable/angular";
import { read, utils } from "xlsx";
import { range } from "underscore";

import { logger } from "../../../shared/logger/logger";
import { DropdownService } from "../admin.dropdowns.service";
import { BulkDeleteResponse, UiDropdownItem } from "../admin.dropdowns.model";
import { BulkUploadDialogData, InsertResult, DropdownBaseData, BulkDropdownAction, ValidatorStatusMessageOptions, ReadonlyRow, ValueAction, DeleteResult, DeleteState, ValueSidRow } from "./admin.dropdowns.bulkUploadDialog.model";
import { HandsonLicenseKey } from "../../../shared/config/handsontable.licenseKey.config";

@Component({
    selector: 'dropdown-bulk-upload-dialog',
    templateUrl: 'Client/src/app/admin/dropdowns/dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component.html',
    styleUrls: ['Client/src/app/admin/dropdowns/dropdownBulkUploadDialog/admin.dropdowns.bulkUploadDialog.component.css']
})
export class DropdownBulkUploadDialogComponent implements OnInit, OnDestroy {

    private readonly destroy$ = new Subject<void>();

    constructor(private DIALOG_REF: MatDialogRef<DropdownBulkUploadDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: BulkUploadDialogData,
                private dropdownService: DropdownService,
                private changeDetectorRef: ChangeDetectorRef,
                private loggerService: logger) { }

    // Status Messages
    private readonly EXISTING_VALUE_MESSAGE: string = 'Existing value, can only delete.';
    private readonly MAX_LENGTH_MESSAGE: string = 'The maximum length for a value is up to 40 characters.';
    private readonly CHARACTERSET_MESSAGE: string = `This value has an invalid special character.`;
    private readonly DUPLICATE_GRID_VALUE_MESSAGE: string = `Duplicate entry, will be ignored.`

    private hotRegisterer = new HotTableRegisterer();
    private hotTable: Handsontable;

    private initializeHandsontableInstance(): void {
        this.hotTable = this.hotRegisterer.getInstance(this.HOT_ID);

        this.changeDetectorRef.detectChanges();
    }

    /**
     * @returns Returns index if there is a matching string, otherwise returns -1
     */
    private indexOfCaseInsensitive(values: string[], compareValue: string): number {
        return values.findIndex((value: string) => {
            if (value != null || value != undefined) {
                return value.trim().toUpperCase().localeCompare(compareValue.trim().toUpperCase(), undefined, { sensitivity: 'base' }) === 0;
            } else {
                return false;
            }
        });
    }

    private getLookupSidForExistingValue(BASIC_DROPDOWN_DATA: Array<UiDropdownItem>, existingValue: string): number {
        const INDEX_MATCH = this.indexOfCaseInsensitive(BASIC_DROPDOWN_DATA.map((value: UiDropdownItem) => { return value.DROP_DOWN }), existingValue);

        if (INDEX_MATCH !== -1) {
            return BASIC_DROPDOWN_DATA[INDEX_MATCH].ATRB_LKUP_SID as number;
        } else {
            return -1;
        }
    }

    private updateStatusMessagesByRow(rowIds: number[], statusMessage: string = '') {
        if (rowIds.length > 0) {
            this.hotTable.batchRender(() => {
                for (const ROW_ID of rowIds) {
                    this.hotTable.setDataAtRowProp(ROW_ID, 'statusMessage', `${ statusMessage }`, 'addStatusMessage');
                }
            });
        }
    }

    private formData: FormGroup;

    private disableFormInputs() {
        this.formData.disable();
    }

    private enableFormInputs() {
        this.formData.enable();
    }

    private getBasicDropdownDataByFormAttributes(basicDropdownData: Array<UiDropdownItem>, overrideGroup: string = ''): Array<UiDropdownItem> {
        if (this.formData.invalid) {
            return [];
        } else {
            const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
            let group: string = this.formData.get('ATRB_CD').value;
            const CUSTOMER: string = this.formData.get('CUST_NM').value;

            if (overrideGroup.length > 0) {
                group = overrideGroup;
            }
    
            const MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES: Array<UiDropdownItem> = basicDropdownData.filter((dropdown: UiDropdownItem) => {
                if (dropdown.OBJ_SET_TYPE_CD && dropdown.OBJ_SET_TYPE_CD.includes(DEAL_TYPE)) {
                    if (dropdown.ATRB_CD && dropdown.ATRB_CD.includes(group)) {
                        if (dropdown.CUST_NM && dropdown.CUST_NM.includes(CUSTOMER)) {
                            return true;
                        }
                    }
                }
    
                return false;
            }).map((dropdownItem) => dropdownItem);
    
            return MATCHED_MAIN_ATTRIBUTES_DROPDOWN_VALUES;    
        }
    }

    /**
     * Filters the Dropdown Response from the Basic Dropdowns API via the chosen form attributes (Deal Type, Group and Customer)
     * @param basicDropdownData Dropdown Response Items
     * @returns Array of dropdowns values relative to the chosen attributes (Deal Type, Group and Customer)
     */
    private filterBasicDropdownsByFormAttributes(basicDropdownData: Array<UiDropdownItem>, overrideGroup?: string): string[] {
        return this.getBasicDropdownDataByFormAttributes(basicDropdownData, overrideGroup).map((value: UiDropdownItem) => { return value.DROP_DOWN; });
    }

    private readonly BASIC_DROPDOWNS_ERROR = 'Could not load existing UI Dropdown Values to prevent duplicates, cannot continue with action.';
    private getBasicDropdowns(): Observable<Array<UiDropdownItem>> {
        let basicDropdownData = new BehaviorSubject<Array<UiDropdownItem>>([]);

        this.dropdownService.getBasicDropdowns(true).pipe(takeUntil(this.destroy$)).subscribe((BASIC_DROPDOWN_DATA: Array<UiDropdownItem>) => {
            if (BASIC_DROPDOWN_DATA != null && BASIC_DROPDOWN_DATA != undefined) {
                basicDropdownData.next(BASIC_DROPDOWN_DATA);
            } else {
                this.loggerService.error(this.BASIC_DROPDOWNS_ERROR, 'API Error', null);
                basicDropdownData.next([]);
            }
        }, (error) => {
            this.loggerService.error(this.BASIC_DROPDOWNS_ERROR, error.statusText, error);
            basicDropdownData.next([]);
        });

        return basicDropdownData.asObservable();
    }

    private existingValuesFromChosenAttributes: string[] = [];
    private persistentDropdownData: Array<UiDropdownItem> = undefined;
    private updatePersistentDropdownData(): Observable<boolean> {
        let isComplete = new BehaviorSubject<boolean>(false);

        this.getBasicDropdowns().subscribe((BASIC_DROPDOW_DATA: Array<UiDropdownItem>) => {
            this.persistentDropdownData = BASIC_DROPDOW_DATA;
            isComplete.next(true);
        }, (error) => {
            this.persistentDropdownData = undefined;
            isComplete.next(true);
        });
        
        return isComplete.asObservable();
    }

    private marketSegmentInvalidValues: string[] = [];

    private readonly MARKET_SEGMENT_CASES = ['MRKT_SEG_NON_CORP', 'MRKT_SEG'];
    private existingValuesMarketSegment: string[] = [];
    private existingValuesMarketSegmentNonCorp: string[] = [];
    private updateExistingValuesFromValidForm(): void {
        this.existingValuesFromChosenAttributes = this.filterBasicDropdownsByFormAttributes(this.persistentDropdownData);

        this.marketSegmentInvalidValues = [];
        if (this.formData.valid && this.MARKET_SEGMENT_CASES.includes(this.formData.get('ATRB_CD').value)) {
            this.existingValuesMarketSegment = this.filterBasicDropdownsByFormAttributes(this.persistentDropdownData, 'MRKT_SEG');
            this.existingValuesMarketSegmentNonCorp = this.filterBasicDropdownsByFormAttributes(this.persistentDropdownData, 'MRKT_SEG_NON_CORP');
        } else {
            this.existingValuesMarketSegment = [];
            this.existingValuesMarketSegmentNonCorp = [];
        }
    }

    private readonly MAX_VALUE_LENGTH = 40;
    private readonly MESSAGE_ACCEPTABLE_CHARACTERS = `? ! @ # $ ^ & * ( ) - _ = + . ; : © ™ ® \' \" \\ \/`;
    private readonly PATTERN_ACCEPTABLE_CHARACTERS = /^[A-Za-z0-9?!@#$^&*()-_=+.;:©™®\'\"\/\\\s]+$/;   // When updating, remember to update MESSAGE_ACCEPTABLE_CHARACTERS
    private readonly PATTERN_NOT_ACCEPTABLE_SPECIAL_CHARACTERS = /^([^\[\]\<\>\,]*)$/;   // Characters that bypass Acceptable Character pattern (RegEx limitation)
    private readonly EMPTY_STRING = /^\s*$/g;
    private validatorStatusMessage: ValidatorStatusMessageOptions = ValidatorStatusMessageOptions.NONE;
    private hotValueValidator = (value: string, callback) => {
        if (value != undefined && value != null) {
            setTimeout(() => {
                if (value.length > this.MAX_VALUE_LENGTH) {
                    this.validatorStatusMessage = ValidatorStatusMessageOptions.MAX_LENGTH;
                    callback(false);
                } else if (this.PATTERN_ACCEPTABLE_CHARACTERS.test(value) && this.PATTERN_NOT_ACCEPTABLE_SPECIAL_CHARACTERS.test(value)) {
                    // Market Segment check (only check when value is otherwise valid)
                    if(this.MARKET_SEGMENT_CASES.includes(this.formData.get('ATRB_CD').value)) {
                        if (this.indexOfCaseInsensitive(this.marketSegmentInvalidValues, value)) {
                            callback(false);
                        }
                    }

                    this.validatorStatusMessage = ValidatorStatusMessageOptions.NONE;
                    callback(true);
                } else {
                    this.validatorStatusMessage = ValidatorStatusMessageOptions.CHARACTERSET_INVALID;
                    callback(false);
                }
            }, 50);
        } else {
            this.validatorStatusMessage = ValidatorStatusMessageOptions.NONE;
        }
    }

    /**
     * Custom Checkbox Renderer which disables input fields when the cell is set to read-only
     */
    private checkboxRenderer = (instance: Handsontable, TD: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: CellProperties) => {
        Handsontable.renderers.CheckboxRenderer.apply(this, [ instance, TD, row, col, prop, value, cellProperties ]);

        if (cellProperties.readOnly) {
            TD.firstElementChild.setAttribute('disabled', '');
        } else {
            TD.firstElementChild.removeAttribute('disabled');
        }

        return TD;
    }

    /**
     * Custom Status Message cell renderer that sets text color depending on if the message is for a success or failed bulk action
     */
    private statusMessageRenderer = (instance: Handsontable, TD: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: CellProperties) => {
        Handsontable.renderers.TextRenderer.apply(this, [ instance, TD, row, col, prop, value, cellProperties ]);

        if (value != null && value != undefined && value.length > 0) {
            if (value.toUpperCase().includes('SUCCESS')) {
                TD.style.color = 'forestgreen';
            } else if (value.toUpperCase().includes('FAIL')) {
                TD.style.color = 'orangered';
            }
        }

        return TD;
    }

    private readonly HOT_ID = 'bulkUploadValueTable';
    private readonly HOT_COLUMNS: Array<ColumnSettings> = [
        {
            data: 'value',
            title: 'Value',
            type: 'text',
            readOnly: false,
            allowInvalid: true,
            allowEmpty: true,
            validator: this.hotValueValidator,
        }, {
            data: 'isActive',
            title: 'Is Active',
            type: 'checkbox',
            readOnly: false,
            renderer: this.checkboxRenderer
        }, {
            data: 'isDelete',
            title: 'Delete',
            type: 'checkbox',
            readOnly: false,
            renderer: this.checkboxRenderer
        }, {
            data: 'statusMessage',
            title: 'Status',
            type: 'text',
            readOnly: true,
            allowEmpty: true,
            renderer: this.statusMessageRenderer
        }
    ];

    private readonlyRows: Array<ReadonlyRow> = [];
    private updateReadonlyRows(row: number, isActiveReadonly: boolean, isDeleteReadonly: boolean): void {
        const ROWS: number[] = this.readonlyRows.map((value: ReadonlyRow) => {
            return value.row;
        });

        const NEW_ROW_DATA: ReadonlyRow = {
            row: row,
            isActiveReadonly: isActiveReadonly,
            isDeleteReadonly: isDeleteReadonly
        };

        const ROW_MATCH_INDEX: number = ROWS.indexOf(row);
        if (this.readonlyRows.length > 0 && ROW_MATCH_INDEX !== -1) {
            this.readonlyRows[ROW_MATCH_INDEX] = NEW_ROW_DATA;
        } else {
            this.readonlyRows.push(NEW_ROW_DATA);
        }
    }

    private hotAfterValidate = (isValid: boolean, value: CellValue, row: number, prop: string | number, source: ChangeSource | string): boolean | void => {
        if (prop == 'value') {
            this.hotTable.batchRender(() => {
                if (isValid) {
                    const INDEX_MATCH = this.indexOfCaseInsensitive(this.existingValuesFromChosenAttributes, value as string);
                    if (INDEX_MATCH !== -1) {    // Existing Value (for same Attribute combo)
                        this.hotTable.setDataAtRowProp(row, 'statusMessage', `${ this.EXISTING_VALUE_MESSAGE }`, 'addStatusMessage');

                        this.hotTable.setDataAtRowProp(row, 'isActive', false, 'updateCheckboxState');
                        this.hotTable.setDataAtRowProp(row, 'isDelete', true, 'updateCheckboxState');

                        this.updateReadonlyRows(row, true, false);

                        // Market Segment check
                        if (this.formData.valid && 'MRKT_SEG'.includes(this.formData.get('ATRB_CD').value)) {
                            // If MRKT_SEG is being deleted, need to check MRKT_SEG_NON_CORP for match, if match => prevent and warn user to remove MRKT_SEG_NON_CORP first
                            if (this.indexOfCaseInsensitive(this.existingValuesMarketSegmentNonCorp, value) !== -1) {
                                this.hotTable.setDataAtRowProp(row, 'isDelete', false, 'updateCheckboxState');
                                this.updateReadonlyRows(row, true, true);
            
                                this.hotTable.setDataAtRowProp(row, 'statusMessage', `Invalid - Cannot delete a MRKT_SEG value if there is a matching MRKT_SEG_NON_CORP value, delete from MRKT_SEG_NON_CORP first.`, 'addStatusMessage');
                                this.marketSegmentInvalidValues.push(value);
                            }
                        }
                    } else {    // Novel Value
                        this.hotTable.setDataAtRowProp(row, 'statusMessage', ``, 'addStatusMessage');  // Novel values without validation errors should clear Status Message cell
                        this.hotTable.setDataAtRowProp(row, 'isDelete', false, 'updateCheckboxState');

                        this.updateReadonlyRows(row, false, true);

                        // Market Segment check
                        if (this.formData.valid && 'MRKT_SEG_NON_CORP'.includes(this.formData.get('ATRB_CD').value)) {
                            // If MRKT_SEG_NON_CORP is being added, need to check MRKT_SEG for match, if no match => prevent and warn user to add to MRKT_SEG first
                            if (this.indexOfCaseInsensitive(this.existingValuesMarketSegment, value) === -1) {
                                this.hotTable.setDataAtRowProp(row, 'statusMessage', `Invalid - Cannot create a MRKT_SEG_NON_CORP value if there is no matching MRKT_SEG / MRKT_SEG_COMBINED value, add to MRKT_SEG / MRKT_SEG_COMBINED first.`, 'addStatusMessage');
                                this.marketSegmentInvalidValues.push(value);
                            }
                        }
                    }    
                } else {    // State determined by the Validator `hotValueValidator()`
                    if (this.validatorStatusMessage === ValidatorStatusMessageOptions.MAX_LENGTH) {
                        this.hotTable.setDataAtRowProp(row, 'statusMessage', `${ this.MAX_LENGTH_MESSAGE }`, 'addStatusMessage');
                    } else if (this.validatorStatusMessage === ValidatorStatusMessageOptions.CHARACTERSET_INVALID) {
                        this.hotTable.setDataAtRowProp(row, 'statusMessage', `${ this.CHARACTERSET_MESSAGE }`, 'addStatusMessage');
                    }

                    this.updateReadonlyRows(row, false, false);

                    this.validatorStatusMessage = ValidatorStatusMessageOptions.NONE;
                }    
            });
        }
    }

    // WIP - need to modify logic to update `this.readonlyRows`
    private hotRemoveRows(rowsToRemove: number[]): void {
        if (rowsToRemove.length > 0) {
            rowsToRemove = rowsToRemove.sort((a, b) => { return b - a });   // Descending order to prevent issues with changes row IDs from other removals

            this.hotTable.batchRender(() => {
                for (const row of rowsToRemove) {
                    this.hotTable.alter('remove_row', row, 1, 'no-edit', true);
                }
            });
        }
    }

    private sanitizeValue(value: any): string {
        let wipValue = ''; // Initialize wipValue to an empty string

        if (value != null && value != undefined) {
            if (typeof value === 'string') {
                if (value.length > 0) {
                    const REGEX_REPLACE_TO_SPACE = /(\r\n|\r|\n|\s)/g;
                    wipValue = value.replace(REGEX_REPLACE_TO_SPACE, ' ');

                    // Character Replacements (in order)
                    wipValue = wipValue.replace(/((?<!\\)`)|(\\`)|(\`)/g, '\'')     // Backtick -> Single-quote
                        .replace(/((?<!\\)')|(\\')|(\')/g, '\'\'')   // Convert single-quote to two single-quotes w/ escape characters (SQL limitation)
                        .replace(/(?<!\\)"/g, '\"')                  // Add escape character to double-quote
                        .replace(/\'{3,}/g, '\'\'')                  // Limit multiple (>= 3) single-quotes to just two single-quotes
                        .replace(/-{2,}/g, '-')                      // Multiple hyphens to single (SQL limitation)
                        .replace(/\s{2,}/g, ' ').trim();             // Multiple spaces to single space
                }
            } else if (typeof value === 'number') {
                wipValue = value.toString(); // Convert number to string
            }
        }

        return wipValue;
    }

    /**
     * Handles input sanitization for grid data from manual input or Copy/Paste
     */
    private hotAfterChanges(changes, source): void {
        if (this.hotTable != undefined && this.hotTable != null) {
            if (!['afterChange', 'addStatusMessage', 'updateCheckboxState'].includes(source)) {
                const ROWS_TO_REMOVE: Set<number> = new Set<number>();

                const VALUES_IN_GRID: string[] = this.hotTable.getDataAtProp('value');

                this.hotTable.batchRender(() => {
                    changes?.forEach(([row, prop, oldValue, newValue]) => {
                        // Sanitize new cells in 'Value' column
                        if (prop === 'value' && (newValue != null && newValue != undefined)) {
                            const SANITIZED_VALUE: string = this.sanitizeValue(newValue);

                            // Update cell with sanitized value if necessary
                            if (SANITIZED_VALUE !== newValue) {
                                // this.hotTable.setDataAtCell(row, VALUE_COLUMN_INDEX, SANITIZED_VALUE, 'addStatusMessage');
                                this.hotTable.setDataAtRowProp(row, 'value', SANITIZED_VALUE, 'updateValue');
                            }

                            // Remove Empty Values
                            if (this.EMPTY_STRING.test(SANITIZED_VALUE)) {
                                ROWS_TO_REMOVE.add(row);
                            }

                            // Handle Duplicate Values
                            const INDEX_MATCH_VALUE = this.indexOfCaseInsensitive(VALUES_IN_GRID, SANITIZED_VALUE);
                            if (INDEX_MATCH_VALUE !== -1) {
                                if (INDEX_MATCH_VALUE !== row && !ROWS_TO_REMOVE.has(INDEX_MATCH_VALUE)) {
                                    this.hotTable.setDataAtRowProp(row, 'statusMessage', `${ this.DUPLICATE_GRID_VALUE_MESSAGE }`, 'addStatusMessage');
                                }
                            }
                        }
                    });
                });

                this.hotRemoveRows(Array.from(ROWS_TO_REMOVE));
            }
        }
    }

    /**
     * Enables the usage of the Backspace and Delete key to trigger deleting row(s)
     */
    private hotEnableDeleteFromKeys = (event: KeyboardEvent): void => {
        if (event.key != undefined && (event.key === 'Backspace' || event.key === 'Delete')) {
            const HOT_ACTIVE_CELL_EDITOR = this.hotTable.getActiveEditor();
            if (HOT_ACTIVE_CELL_EDITOR == undefined || !HOT_ACTIVE_CELL_EDITOR.isOpened()) {    // Ignore if the Cell Editor is opened
                const SELECTED_RANGE: [number, number, number, number] = this.hotTable.getSelected()[0];    // Selection Mode is set to a single range w/ 'range'
                if (SELECTED_RANGE != undefined) {
                    const ROW_START = SELECTED_RANGE[0];
                    const ROW_END = SELECTED_RANGE[2];

                    const ROW_RANGE: number[] = range(ROW_START, ROW_END + 1);

                    this.hotRemoveRows(ROW_RANGE);
                }
            }
        }
    }

    private get isValueGridValid(): boolean {
        const COUNT_INVALID_CELLS: number = document.getElementsByClassName('htInvalid').length;
        if (COUNT_INVALID_CELLS > 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Returns the number of rows with entries in the `value` column from the Handsontable grid
     */
    private get countNonEmptyRows(): number {
        if (this.hotTable == undefined) {
            return 0;
        } else {
            return this.hotTable.countRows() - this.hotTable.countEmptyRows();
        }
    }

    private onlySubmitValidToggle: boolean = false; // Allows user to bypass validation for whole values grid and only insert / delete values that passed validation

    private get isExecuteButtonDisabled(): boolean {
        return (!(this.isValueGridValid || this.onlySubmitValidToggle) || this.countNonEmptyRows === 0 || (this.formData.invalid && (this.formData.dirty || this.formData.touched)) || this.submitTriggered);
    }

    /**
     * Adds hover messages to Handsontable column headers
     */
    private defineHeaderTitle = (column, TH): void => {
        if (column === 0) {  // 'Value' column
            TH.children[0].setAttribute('title', `Acceptable special characters: ${ this.MESSAGE_ACCEPTABLE_CHARACTERS }`);
        } else if (column === 2) {  // 'Delete' column
            TH.children[0].setAttribute('title', `Will attempt to delete this value for the chosen attributes, but if it is used in any existing contracts, it will be simply deactivated.`);
        } 
    }

    /**
     * Returns an empty generic array if the input array is null, undefined or empty, otherwise returns the same array if valid
     * @param arrayToValidate Array of any type
     * @returns The same array if it is valid and has values, otherwise returns an empty array
     */
    private returnEmptyIfUndefinedOrNull(arrayToValidate: Array<unknown>): Array<unknown> {
        if (arrayToValidate !== null && arrayToValidate !== undefined && arrayToValidate.length > 0) {
            return arrayToValidate;
        } else {
            return [];
        }
    }

    /**
     * Handles setting the `Value`, `Is Active` and `Delete` column read-only state
     */
    private hotCells = (cellRow: number, cellCol: number, cellProp: string | number): CellMeta => {
        if (this.returnEmptyIfUndefinedOrNull(this.readonlyRows).length > 0) {
            let cellProperties: CellMeta = {};

            // Update Read-only status of 'Is Active' and 'Delete' columns
            const ROWS = this.readonlyRows.map((value) => {
                return value.row;
            });
            const ROW_READONLY_INDEX: number = ROWS.indexOf(cellRow);
            if (ROW_READONLY_INDEX !== -1) {
                if (cellProp === 'isActive') {
                    cellProperties.readOnly = this.readonlyRows[ROW_READONLY_INDEX].isActiveReadonly;
                } else if (cellProp === 'isDelete') {
                    cellProperties.readOnly = this.readonlyRows[ROW_READONLY_INDEX].isDeleteReadonly;
                }
            }

            // Update Read-only status of 'Value' column
            if (this.submitTriggered) {
                cellProperties.readOnly = (this.hotSettingsStateBeforeDisable !== null);
            }

            return cellProperties;
        }
    }

    private readonly BASE_HOT_SETTINGS: GridSettings = {
        licenseKey: HandsonLicenseKey.license,
        columns: this.HOT_COLUMNS,
        manualColumnResize: true,
        rowHeaders: true,
        minRows: 20,
        rowHeaderWidth: 20,
        stretchH: 'last',
        copyPaste: true,
        comments: false,
        wordWrap: true,
        width: '44vw',
        height: '40vh',
        preventOverflow: 'horizontal',
        selectionMode: 'range',
        afterChange: (changes: Array<CellChange>, source: ChangeSource) => {
            this.hotAfterChanges(changes, source);

            setTimeout(() => {
                this.changeDetectorRef.detectChanges();
            }, 500);
        },
        afterGetColHeader: this.defineHeaderTitle,
        afterValidate: this.hotAfterValidate,
        afterInit: () => {
            if (!this.hotTable || this.hotTable === null || this.hotTable === undefined) {
                this.initializeHandsontableInstance();
            }

            /**
             * Initialize `existingValuesFromChosenAttributes` with default attributes
             * Put here to run after ngOnInit()
             */
            setTimeout(() => {
                this.updateExistingValuesFromValidForm();
            }, 500);
        },
        beforeKeyDown: this.hotEnableDeleteFromKeys,
        cells: this.hotCells,
    }

    private hotTableData: Array<BulkDropdownAction> = [];
    private hotSettings: GridSettings = this.BASE_HOT_SETTINGS;

    /**
     * Clears helper variables when changing data states for the Handsontable table data
     */
    private updateHotGridData(newGridData: Array<BulkDropdownAction>): void {
        this.readonlyRows = [];
        this.marketSegmentInvalidValues = [];
        this.validatorStatusMessage = ValidatorStatusMessageOptions.NONE;

        this.hotTableData = this.returnEmptyIfUndefinedOrNull(newGridData) as Array<BulkDropdownAction>;
    }

    private initializeAndValidateTable(): void {
        setTimeout(() => {
            this.initializeHandsontableInstance();
            this.hotTable.validateCells();
        }, 500);
    }

    /**
     * Parses cell value to match a truth label (i.e. usage of Yes to indicate true), otherwise defaults to false
     * @returns False unless the `cellValue` parameter matches a known `true` string
     */
    private parseTextToBoolean(cellValue: string | boolean): boolean {
        const TRUE_STRINGS: string[] = ['TRUE', 'YES', 'Y', '1'];

        if (cellValue != undefined && ((typeof(cellValue) == 'boolean' && cellValue) || TRUE_STRINGS.includes(cellValue.toString().toUpperCase()))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param value Array of strings to generate the InsertResult objects for
     * @returns Array of completed InsertResult objects
     */
    private createMessageForValues(value: string[], resultMessage: string, isSuccess: boolean): Array<InsertResult> {   // REMOVE
        return value.map((value: string) => {
            return {
                value: value,
                resultMessage: resultMessage,
                isSuccess: isSuccess
            }
        });
    }

    /**
     * Gets the SID for the specified object when compared to the Base Data array
     * @param DATA Dropdown Base Data
     * @param NAME Expected label for data object in base data
     * @returns SID from Base Data formatching data object label
     */
    private getSidFromName(DATA: Array<DropdownBaseData>, NAME: string): number {
        return DATA.filter((dataObj: DropdownBaseData) => {
            return dataObj.dropdownName.includes(NAME);
        })[0].dropdownID;
    }

    private generateDropdownInsertPayloads(values: Array<ValueAction>): Array<UiDropdownItem> {
        let generatedDropdownPayloads: Array<UiDropdownItem> = [];

        if (values.length > 0) {
            const DEAL_TYPE: string = this.formData.get('OBJ_SET_TYPE_CD').value;
            const GROUP: string = this.formData.get('ATRB_CD').value;
            const CUSTOMER: string = this.formData.get('CUST_NM').value;

            const DEAL_TYPE_SID = this.getSidFromName(this.data.dealTypeData, DEAL_TYPE);
            const GROUP_SID = this.getSidFromName(this.data.groupData, GROUP);
            const CUSTOMER_SID = this.getSidFromName(this.data.customerData, CUSTOMER);

            if (DEAL_TYPE_SID != undefined && GROUP_SID != undefined && CUSTOMER_SID != undefined) {
                const GENERATED_PAYLOADS: Array<UiDropdownItem> = values.map((value: ValueAction) => {
                    return {
                        ACTV_IND: value.isActive,
                        OBJ_SET_TYPE_CD: DEAL_TYPE,
                        OBJ_SET_TYPE_SID: DEAL_TYPE_SID,
                        ATRB_CD: GROUP,
                        ATRB_SID: GROUP_SID,
                        CUST_NM: CUSTOMER,
                        CUST_MBR_SID: CUSTOMER_SID,
                        DROP_DOWN: value.value,
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

    private insertResults: Array<InsertResult> = [];
    private insertBulkDropdowns(preparedDropdownPayloads: Array<UiDropdownItem>): Observable<boolean> {
        let isComplete = new BehaviorSubject<boolean>(false);

        if (preparedDropdownPayloads && preparedDropdownPayloads.length > 0) {
            this.dropdownService.insertBulkBasicDropdowns(preparedDropdownPayloads).pipe(takeUntil(this.destroy$)).subscribe((result: Array<UiDropdownItem>) => {
                // API response only contains items that were successfully added, assume others have failed from an internal error
                const SUCCESSFUL_VALUES: string[] = result.map((responseItem: UiDropdownItem) => { return responseItem.DROP_DOWN });
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

    private deleteResults: Array<DeleteResult> = [];
    private addDeleteResults(dropdownSids: number[], state: DeleteState): void {
        if (dropdownSids != null && dropdownSids != undefined && dropdownSids.length > 0) {
            const GENERATED_DELETE_RESULTS: Array<DeleteResult> = dropdownSids.map((sid: number) => {
                return {
                    lookupSid: sid,
                    state: state
                }
            });

            this.deleteResults.push(...GENERATED_DELETE_RESULTS);
        }
    }
    private deleteBulkDropdowns(dropdownLookupSid: number[]): Observable<boolean> {
        let isComplete = new BehaviorSubject<boolean>(false);

        if (dropdownLookupSid.length > 0) {
            this.dropdownService.bulkDeleteDropdowns(dropdownLookupSid).pipe(takeUntil(this.destroy$)).subscribe((result: Array<BulkDeleteResponse>) => {
                // Results only exist if there was a dropdown value set to Inactive rather than deleted (when the value is in use in a deal / contract)
                if (result != null && result != undefined && result.length > 0) {
                    const DEACTIVATED_SIDS: number[] = result.map((value: BulkDeleteResponse) => { return value.ATRB_LKUP_SID });
                    this.addDeleteResults(DEACTIVATED_SIDS.map(Number), DeleteState.Deactivated);

                    const REMAINDER_DELETED_SIDS: number[] = dropdownLookupSid.filter((value: number) => {
                        return !DEACTIVATED_SIDS.includes(value);
                    });
                    this.addDeleteResults(REMAINDER_DELETED_SIDS, DeleteState.Deleted);
                } else {
                    this.addDeleteResults(dropdownLookupSid, DeleteState.Deleted);
                }

                isComplete.next(true);
            }, (error) => {
                this.addDeleteResults(dropdownLookupSid, DeleteState.Error);

                isComplete.next(true);
            });
        }

        return isComplete.asObservable();
    }

    private triggerToastNotification(amountFailed: number, amountSuccess: number): void {
        if (amountFailed > 0 && amountSuccess === 0) {
            this.loggerService.error('', 'All dropdown values failed to be added')
        } else if (amountSuccess > 0 && amountFailed === 0) {
            this.loggerService.success('', 'All dropdown values were added successfully');
        } else {
            this.loggerService.warn('', 'Some dropdown values failed to be added');
        }
    }

    /**
     * @returns Observable pair of boolean values, should be read in this order: [Completetion Status, Success Status]
     */
    private recycleBasicDropdownsCache(): Observable<[boolean, boolean]> {
        let completionAndSuccessPair = new BehaviorSubject<[boolean, boolean]>([false, false]);

        this.dropdownService.recycleBasicDropdownsCache().pipe(takeUntil(this.destroy$)).subscribe(() => {
            completionAndSuccessPair.next([true, true]);
        }, (error) => {
            completionAndSuccessPair.next([true, false]);
        });

        return completionAndSuccessPair.asObservable();
    }

    private hotSettingsStateBeforeDisable: GridSettings = null;
    private disableAllFields(): void {
        // Disable form
        this.disableFormInputs();

        // Disable grid input
        this.hotSettingsStateBeforeDisable = this.hotTable.getSettings();
        // Cell Settings will look at `this.hotSettingsStateBeforeDisable` if defined to disable grid, if settings are reloaded and cleared, then it will re-enable cells

        // Rerender grid after settings update (to apply settings)
        this.hotTable.render();
    }

    /**
     * Should only be called after `disableAllFields()` since it will restore the Handsontable GridSettings cached in that function
     */
    private reenableAllFields(): void {
        if (this.hotSettingsStateBeforeDisable != null) {
            this.enableFormInputs();

            this.hotTable.updateSettings(this.hotSettingsStateBeforeDisable);

            this.hotSettingsStateBeforeDisable = null;

            // Rerender grid after settings update (to apply settings)
            this.hotTable.render();
        }
    }

    private submitTriggered = false;
    private triggerLoading = false;

    private enableFormAndGrid(): void {
        this.reenableAllFields();

        this.submitTriggered = false;
        this.triggerLoading = false;
    }

    private clearHotGridData(): void {
        this.updateHotGridData([]);

        this.hotTable.batch(() => {
            this.hotTable.updateSettings(this.BASE_HOT_SETTINGS);
            setTimeout(() => {
                this.hotTable.clear();
            }, 500);

            this.initializeAndValidateTable();
        });

        if (this.submitTriggered) {
            this.insertResults = [];
            this.deleteResults = [];

            // Reload ALL Dropdown data
            this.recycleBasicDropdownsCache().subscribe((completionAndSuccessPair: [boolean, boolean]) => {
                if (completionAndSuccessPair[0]) {  // When complete
                    if (completionAndSuccessPair[1]) { // Successfully reset cache
                        setTimeout(() => {
                            this.reloadDropdownAndValidate();

                            // Only enable the form if the Cache Recycle was successful, otherwise this can cause benign API Errors and not allow the UI logic to prevent inserting existing dropdown values
                            this.enableFormAndGrid();
                        }, 500);
                    } else {    // Failed to reset cache
                        // Tell user to close and reopen Dialog
                        this.loggerService.error('Please close and reopen the Bulk Action Dialog to force-Recycle the dropdown cache', 'API Error - Recycle Cache', null);
                    }
                }
            });
        }
    }

    // Excel Template
    private CSV_TEMPLATE_DATA: string = `data:text/csv;charset=utf-8,"Value","Is Active [TRUE / FALSE]","Delete [TRUE / FALSE]"\n`;
    private getExcelTemplate(): void {
        const ENCODED_URI = encodeURI(this.CSV_TEMPLATE_DATA);
        window.open(ENCODED_URI);
    }

    private sanitizeImportData(values: Array<BulkDropdownAction>): Array<BulkDropdownAction> {
        let sanitizedData: Array<BulkDropdownAction> = [];

        if (values != null && values != undefined && values.length > 0) {
            values.forEach((value: BulkDropdownAction) => {
                if (value.value != undefined && value.value != null) {  // Remove Empty Values
                    let currentValue = value;
                    currentValue.value = this.sanitizeValue(value.value);   // Default to sanitized values

                    const SANITIZED_VALUES: string[] = sanitizedData.map((value: BulkDropdownAction) => { return value.value });
                    const INDEX_MATCH_VALUE: number = this.indexOfCaseInsensitive(SANITIZED_VALUES, currentValue.value);

                    if (INDEX_MATCH_VALUE == -1) { // Handle Duplicate Values
                        sanitizedData.push(currentValue);
                    }
                }
            });
        }

        return sanitizedData;
    }

    // Excel Upload
    private async onFileChange(event) {
        this.triggerLoading = true;

        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) {
            this.triggerLoading = false;
            throw new Error('Cannot upload multiple files');
        } else {
            const DATA = await target.files[0].arrayBuffer();
            const uploadedWorkbook = read(DATA);

            const workbookData = utils.sheet_to_json(uploadedWorkbook.Sheets[uploadedWorkbook.SheetNames[0]], { header: 1 }).slice(1);
            
            const MAPPED_VALUES: Array<BulkDropdownAction> = workbookData.map((value) => {
                return {
                    value: value[0],
                    isActive: this.parseTextToBoolean(value[1]),
                    isDelete: this.parseTextToBoolean(value[2])
                } as BulkDropdownAction;
            });

            const SANITIZED_VALUES: Array<BulkDropdownAction> = this.sanitizeImportData(MAPPED_VALUES);

            if (SANITIZED_VALUES.length > 0) {
                this.clearHotGridData();

                setTimeout(() => {
                    this.updateHotGridData(SANITIZED_VALUES);
        
                    this.hotTable.batch(() => {
                        this.hotTable.updateSettings(this.BASE_HOT_SETTINGS);
                        this.hotTable.loadData(SANITIZED_VALUES, 'onFileChange');
    
                        this.initializeAndValidateTable();
                    });
    
                    this.triggerLoading = false;
                }, 1000);
            } else {
                this.triggerLoading = false;
            }
        }
    }

    private reloadDropdownAndValidate(): void {
        this.updatePersistentDropdownData().subscribe((isComplete: boolean) => {
            if (isComplete) {
                this.updateExistingValuesFromValidForm();   // WIP - Need to add error handling in case this fails again, use `afterRemoveRow` hook

                this.hotTable.validateCells();        
            }
        });
    }

    private onSubmit(): void {
        this.submitTriggered = true;
        this.triggerLoading = true;

        // Get persistent data if not loaded already
        if (this.persistentDropdownData == undefined || this.persistentDropdownData.length < 1) {
            this.reloadDropdownAndValidate();
        }

        if (this.persistentDropdownData != undefined) {
            // Verify Form and Grid are Valid
            if (this.formData.valid && (this.isValueGridValid || this.onlySubmitValidToggle) && this.countNonEmptyRows > 0) {
                this.disableAllFields();

                const BULK_INSERT_VALUES: Array<ValueAction> = [];
                const BULK_DELETE_VALUES: Array<ValueAction> = [];

                const PENDING_VALUES: Set<string> = new Set<string>(); // To keep track of all values to avoid duplicate / existing values
                for (const READONLY_ROW of this.readonlyRows) {
                    const VALUE_COLUMN_INDEX: number = this.hotTable.propToCol('value');
        
                    const ROW_METADATA: Array<CellProperties> = this.hotTable.getCellMetaAtRow(READONLY_ROW.row);

                    // If row has duplicate status message, ignore
                    const ROW_STATUS_MESSAGE: string = (this.hotTable.getDataAtRowProp(READONLY_ROW.row, 'statusMessage') as string);
                    if (ROW_STATUS_MESSAGE == undefined || ROW_STATUS_MESSAGE == '' || !ROW_STATUS_MESSAGE.toUpperCase().includes('DUPLICATE')) {
                        // Get values that are for bulk insertion
                        if (!READONLY_ROW.isActiveReadonly) {  // If !value.isActive then it's a Insert Row
                            if (ROW_METADATA[VALUE_COLUMN_INDEX].valid && !ROW_STATUS_MESSAGE.toUpperCase().includes('EXISTING')) {    // Is 'value' column valid
                                const ROW_VALUE: string = this.hotTable.getDataAtRowProp(READONLY_ROW.row, 'value');
                                const ROW_IS_ACTIVE: boolean = this.hotTable.getDataAtRowProp(READONLY_ROW.row, 'isActive');

                                if (!PENDING_VALUES.has(ROW_VALUE)) {
                                    PENDING_VALUES.add(ROW_VALUE);
                                    BULK_INSERT_VALUES.push({ rowIndex: READONLY_ROW.row, value: ROW_VALUE, isActive: ROW_IS_ACTIVE });
                                }
                            }
                        }

                        // Get values that are for bulk deletion
                        if (!READONLY_ROW.isDeleteReadonly) {  // If !value.isDelete then it's a Delete Row
                            if (ROW_METADATA[VALUE_COLUMN_INDEX].valid) {    // Is 'value' column valid
                                const ROW_VALUE: string = this.hotTable.getDataAtRowProp(READONLY_ROW.row, 'value');
                                const ROW_IS_DELETE: boolean = this.hotTable.getDataAtRowProp(READONLY_ROW.row, 'isDelete');

                                if (ROW_IS_DELETE && !PENDING_VALUES.has(ROW_VALUE)) {    // If is an existing value and not set to delete, ignore
                                    PENDING_VALUES.add(ROW_VALUE);
                                    BULK_DELETE_VALUES.push({ rowIndex: READONLY_ROW.row, value: ROW_VALUE, isDelete: ROW_IS_DELETE })
                                }
                            }
                        }
                    }
                }

                this.recycleBasicDropdownsCache().subscribe((completionAndSuccessPair: [boolean, boolean]) => {
                    if (completionAndSuccessPair[0]) {  // When complete
                        if (completionAndSuccessPair[1]) { // Successfully reset cache
                            // Handle Loading Status
                            let payloadsCompleted = new BehaviorSubject(0);
                            const EXPECTED_PAYLOAD_COUNT: number = 0 + (BULK_INSERT_VALUES.length > 0 ? 1 : 0) + (BULK_DELETE_VALUES.length > 0 ? 1 : 0);

                            // Insert Values
                            if (BULK_INSERT_VALUES.length > 0) {
                                const INSERT_PAYLOADS: Array<UiDropdownItem> = this.returnEmptyIfUndefinedOrNull(this.generateDropdownInsertPayloads(BULK_INSERT_VALUES)) as Array<UiDropdownItem>;

                                if (INSERT_PAYLOADS.length > 0) {
                                    this.insertBulkDropdowns(INSERT_PAYLOADS).subscribe((isComplete: boolean) => {
                                        if (isComplete) {
                                            // Insert result status message (success / failure)
                                            for (const INSERT_RESULT of this.insertResults) {
                                                // Should just return one value
                                                const INSERT_VALUE_ROW_MATCHES = this.returnEmptyIfUndefinedOrNull(BULK_INSERT_VALUES.filter((value: ValueAction) => {
                                                    return (value.value == INSERT_RESULT.value);
                                                }).map((value: ValueAction) => { return value.rowIndex })) as number[];

                                                if (INSERT_VALUE_ROW_MATCHES.length === 1) {
                                                    this.updateStatusMessagesByRow(INSERT_VALUE_ROW_MATCHES, INSERT_RESULT.resultMessage);
                                                }
                                            }

                                            payloadsCompleted.next(payloadsCompleted.getValue() + 1);
                                        }
                                    });
                                }
                            }

                            // Delete Values
                            if (BULK_DELETE_VALUES.length > 0) {
                                const BASIC_DROPDOWN_DATA_FROM_ATTRIBUTES = this.getBasicDropdownDataByFormAttributes(this.persistentDropdownData);

                                let dropdownSidToDeleteWithRowIndex: ValueSidRow[] = [];
                                let rowsFailedToMatchForDelete: number[] = [];

                                for (const VALUE of BULK_DELETE_VALUES) {
                                    const VALUE_LOOKUP_SID: number = this.getLookupSidForExistingValue(BASIC_DROPDOWN_DATA_FROM_ATTRIBUTES, VALUE.value);
                
                                    if (VALUE_LOOKUP_SID !== -1) {
                                        dropdownSidToDeleteWithRowIndex.push({
                                            lookupSid: VALUE_LOOKUP_SID,
                                            hotRow: VALUE.rowIndex
                                        });
                                    } else {
                                        rowsFailedToMatchForDelete.push(VALUE.rowIndex);
                                    }
                                }

                                this.updateStatusMessagesByRow(rowsFailedToMatchForDelete, 'Failed - Could not confirm match with an existing value.');

                                const DROPDOWN_SID_TO_DELETE: number[] = dropdownSidToDeleteWithRowIndex.map((value: ValueSidRow) => { return value.lookupSid });
                                this.deleteBulkDropdowns(DROPDOWN_SID_TO_DELETE).subscribe((isComplete: boolean) => {
                                    if (isComplete) {
                                        let successfulDeletionRows: number[] = [];
                                        let successfulDeactivateRows: number[] = [];
                                        let errorRows: number[] = [];
                                        this.deleteResults.map((deleteResult: DeleteResult) => {
                                            // Get Handsontable Row Index
                                            const SID_HOT_ROW_INDEX = dropdownSidToDeleteWithRowIndex.filter((value: ValueSidRow) => {
                                                return (value.lookupSid === deleteResult.lookupSid);
                                            })[0]?.hotRow;

                                            if (SID_HOT_ROW_INDEX != null && SID_HOT_ROW_INDEX != undefined) {
                                                if (deleteResult.state == DeleteState.Deleted) {
                                                    successfulDeletionRows.push(SID_HOT_ROW_INDEX);
                                                } else if (deleteResult.state == DeleteState.Deactivated) {
                                                    successfulDeactivateRows.push(SID_HOT_ROW_INDEX);
                                                } else if (deleteResult.state == DeleteState.Error) {
                                                    errorRows.push(SID_HOT_ROW_INDEX);
                                                }
                                            }
                                        });

                                        this.updateStatusMessagesByRow(successfulDeletionRows, `Successful - Deleted value`);
                                        this.updateStatusMessagesByRow(successfulDeactivateRows, `Successful - Value currently used by deal, deactivated value`);
                                        this.updateStatusMessagesByRow(errorRows, `Failed - Could not delete / deactivate value`);

                                        payloadsCompleted.next(payloadsCompleted.getValue() + 1);
                                    }
                                });
                            }

                            // Handle updating Loading status
                            payloadsCompleted.asObservable().subscribe((completionCount: number) => {
                                if (completionCount >= EXPECTED_PAYLOAD_COUNT) {
                                    this.triggerLoading = false;
                                }
                            });
                        } else {    // Failed to reset cache
                            const ALL_ROW_INDEX: number[] = this.returnEmptyIfUndefinedOrNull([...BULK_INSERT_VALUES.map((value) => { return value.rowIndex; }),
                                ...BULK_DELETE_VALUES.map((value) => { return value.rowIndex; })]) as number[];
                            this.updateStatusMessagesByRow(ALL_ROW_INDEX, 'Failed - Could not recycle Basic Dropdowns cache.');
                            this.loggerService.error('Failed to recycle the Basic Dropdowns cache, cannot continue with insertion / deletion. Try again.', 'Failed to Recycle Basic Dropdowns cache');

                            this.enableFormAndGrid();
                        }
                    }
                });
            } else {
                if (!this.formData.valid) {
                    this.loggerService.warn('', 'Please select attribute values (Deal Type, Group and Customer).');
                } else if (!(this.isValueGridValid || this.onlySubmitValidToggle)) {
                    this.loggerService.warn('', 'Value grid is not valid, cannot submit.');
                } else if (this.countNonEmptyRows > 0) {
                    this.loggerService.warn('', 'No values in grid.');
                }

                this.submitTriggered = false;
                this.triggerLoading = true;
            }
        }
    }

    closeDialog() {
        this.DIALOG_REF.close();
    }

    private setupFormGroup() {
        this.formData = new FormGroup({
            OBJ_SET_TYPE_CD: new FormControl(this.data.dealTypeDropdownData[0], [Validators.required, Validators.minLength(1)]),
            ATRB_CD: new FormControl(this.data.groupDropdownData[0], [Validators.required, Validators.minLength(1)]),
            CUST_NM: new FormControl(this.data.customerDropdownData[0], [Validators.required, Validators.minLength(1)])
        });
    }

    ngOnInit(): void {
        this.setupFormGroup();
        this.updateHotGridData([]);
        this.initializeAndValidateTable();

        this.updatePersistentDropdownData().subscribe((isComplete: boolean) => {
            if (isComplete) {
                // No need to wait for this here 
            }
        });

        this.formData.valueChanges.subscribe(() => { // trigger loading values to a global array to compare for existing values
            if (this.persistentDropdownData != undefined || this.persistentDropdownData.length > 0) {
                this.updateExistingValuesFromValidForm();

                if (this.hotTable && this.hotTable != null && this.hotTable != undefined) {
                    this.hotTable.validateCells();
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}