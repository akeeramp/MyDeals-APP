export interface BulkUploadDialogData {
    dealTypeDropdownData: unknown[];
    dealTypeData?: DropdownBaseData[];
    groupDropdownData: unknown[];
    groupData?: DropdownBaseData[];
    customerDropdownData: unknown[];
    customerData?: DropdownBaseData[];
}

export class ValueProgress {
    pendingValid: string[] = [];
    successfullyInserted: string[] = [];
    failedInsertWithMessage: InsertResult[] = [];
}

export interface InsertResult {
    value: string;
    resultMessage: string;
    isSuccess: boolean;
}

export enum DeleteState {
    'Deleted',
    'Deactivated',
    'Error'
}
export type DeleteResult = {
    lookupSid: number,
    state: DeleteState
}

export interface InsertDropdownResponse {
    isSuccess: boolean;
    message: string;
}

export interface DropdownBaseData {
    dropdownName: string;
    dropdownID: number;
}

export interface FailedValue {
    failMessage: string;
    values: string[];
}

export type BulkDropdownAction = {
    value: string;
    isActive?: boolean;
    isDelete?: boolean;
    statusMessage?: string;
}

export enum ValidatorStatusMessageOptions {
    MAX_LENGTH,
    CHARACTERSET_INVALID,
    NONE
}

export type ReadonlyRow = {
    row: number,
    isActiveReadonly: boolean,
    isDeleteReadonly: boolean
}

export type ValueAction = {
    rowIndex: number,
    value: string,
    isActive?: boolean,
    isDelete?: boolean
}

export type RowValue = {
    row: number,
    value: string;
}

export type ValueSidRow = {
    hotRow: number,
    lookupSid: number
}