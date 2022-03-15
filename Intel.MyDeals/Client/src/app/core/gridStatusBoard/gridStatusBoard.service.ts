import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, toODataString } from '@progress/kendo-data-query';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GridStatusBoard_Model } from './gridsStatusBoard.model';
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