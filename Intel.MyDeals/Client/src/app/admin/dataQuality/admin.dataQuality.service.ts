import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class dataQualityService {
    public apiBaseUrl: string = "api/dataquality/";

    constructor(private httpClient: HttpClient) {
    }

    public GetDataQualityUseCases(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetDataQualityUseCases';
        return this.httpClient.get(apiUrl);
    }

    public RunDQ(useCase): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'RunDQ';
        let headers = { 'content-type': 'application/json' };
        return this.httpClient.post(apiUrl, JSON.stringify(useCase), { 'headers': headers });
    }

    public ExecuteCostGapFiller(startYearQtr, endYearQtr, prodIds, inNullCost): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'ExecuteCostGapFiller/' + startYearQtr + '/' + endYearQtr + ',' + + ',' + inNullCost;
        return this.httpClient.post(apiUrl, startYearQtr, endYearQtr);
    }

}
