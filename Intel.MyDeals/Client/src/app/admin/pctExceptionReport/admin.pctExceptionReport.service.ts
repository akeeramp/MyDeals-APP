import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PctExceptionReportService {

    public readonly API_URL = 'api/PricingTableException';

    constructor(private httpClient: HttpClient) { }

    public GetPricingTables(startYearQuarter: string | number, endYearQuarter: string | number): Observable<unknown> {
        const REQUEST_URL = `${ this.API_URL }/GetPricingTables?startYearQuarter=${ startYearQuarter }&endYearQuarter=${ endYearQuarter }`;
        return this.httpClient.get(REQUEST_URL);
    }

}