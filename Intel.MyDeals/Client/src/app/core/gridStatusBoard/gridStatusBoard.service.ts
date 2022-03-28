import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from 'underscore';


@Injectable()
export class GridStatusBoardService {

    public apiBaseUrl: string = "api/Dashboard/";

    constructor(private httpClient: HttpClient) {
    }

    public getContracts(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetDashboardContractSummary';
        return this.httpClient.post(apiUrl, data);
    }
}