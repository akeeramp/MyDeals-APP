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

export interface InsertDropdownResponse {
    isSuccess: boolean;
    message: string;
}

export interface DropdownBaseData {
    dropdownName: string;
    dropdownID: number;
}