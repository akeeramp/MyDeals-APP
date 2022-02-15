import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class workflowStagesService {
    public apiBaseUrl: string = "api/WorkFlow/";

    constructor(private httpClient: HttpClient) {

    }
    public GetWorkFlowStages(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetWorkFlowStages';
        return this.httpClient.get(apiUrl);
    }
    public GetWFStgDDLValues(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetWFStgDDLValues';
        return this.httpClient.get(apiUrl);
    }
    public UpdateWorkflowStages(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }
    public SetWorkflowStages(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'SetWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteWorkflowStages(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DeleteWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }

}
