import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class dataQualityService {
    public readonly apiBaseUrl = "api/dataquality/";

    constructor(private httpClient: HttpClient) {
    }

    public GetDataQualityUseCases(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDataQualityUseCases';
        return this.httpClient.get(apiUrl);
    }

    public RunDQ(useCase): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'RunDQ';
        const headers = { 'content-type': 'application/json' };
        return this.httpClient.post(apiUrl, JSON.stringify(useCase), { 'headers': headers });
    }

    public ExecuteCostGapFiller(startYearQtr, endYearQtr, prodIds, inNullCost): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ExecuteCostGapFiller/' + startYearQtr + '/' + endYearQtr + ',' + + ',' + inNullCost;
        return this.httpClient.post(apiUrl, startYearQtr, endYearQtr);
    }

}
