import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GridStatusBoardService {

    public readonly API_URL_DASHBOARD = "api/Dashboard/";

    constructor(private httpClient: HttpClient) {}

    public getContracts(data): Observable<any> {
        const apiUrl: string = this.API_URL_DASHBOARD + 'GetDashboardContractSummary';
        return this.httpClient.post(apiUrl, data);
    }

}