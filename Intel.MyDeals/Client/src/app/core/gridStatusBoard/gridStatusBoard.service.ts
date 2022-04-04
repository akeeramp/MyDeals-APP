import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'underscore';


@Injectable()
export class GridStatusBoardService {

    public apiBaseUrl = "api/Dashboard/";

    constructor(private httpClient: HttpClient) {
    }

    public getContracts(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDashboardContractSummary';
        return this.httpClient.post(apiUrl, data);
    }
}