import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class workflowService {
    public apiBaseUrl: string = "api/WorkFlow/";

    constructor(private httpClient: HttpClient) {

    }
    public GetWorkFlowItems(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetWorkFlowItems';
        return this.httpClient.get(apiUrl);
    }
    public GetDropDownValues(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetDropDownValues';
        return this.httpClient.get(apiUrl);
    }
    public UpdateWorkflow(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateWorkflow';
        return this.httpClient.post(apiUrl, data);
    }
    public SetWorkFlows(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SetWorkFlows';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteWorkflow(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DeleteWorkflow';
        return this.httpClient.post(apiUrl, data);
    }

}
