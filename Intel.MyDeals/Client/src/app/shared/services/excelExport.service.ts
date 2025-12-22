import { Injectable } from '@angular/core';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { process, State } from "@progress/kendo-data-query";

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    constructor() { }

    public allData(state: State, gridResult: any[]): ExcelExportData {
        const excelState: State = {};
        Object.assign(excelState, state);
        excelState.take = gridResult.length;
        excelState.skip = 0;

        const result: ExcelExportData = {
            data: process(gridResult, excelState).data,
        };

        return result;
    }

}