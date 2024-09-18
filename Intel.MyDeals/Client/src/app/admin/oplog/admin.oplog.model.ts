export interface logDate_Map {
    startDate: Date;
    endDate: Date;
}

export interface logFileObject {
    fileName: string;
    creationDate: Date;
    modifiedDate: Date;
    errorType: string;
    errorMessage: string;
    WWID: number;
}