import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PctMctFailureException } from "./pctMctFailureException.model";

@Injectable({
    providedIn: 'root'
})
export class PctMctExceptionReportService {

    public readonly API_URL = 'api/PctMctFailure';

    constructor(private httpClient: HttpClient) { }

    public GetPctMctFailureData(startYearQuarter: string | number, endYearQuarter: string | number, includeCurrentResult: boolean): Observable<PctMctFailureException[]> {
        const REQUEST_URL = `${this.API_URL}/GetPctMctFailedData?startYearQuarter=${startYearQuarter}&endYearQuarter=${endYearQuarter}&includeCurrentResult=${includeCurrentResult}`;
        return this.httpClient.get<PctMctFailureException[]>(REQUEST_URL);
    }

}