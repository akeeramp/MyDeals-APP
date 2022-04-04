import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class workflowStagesService {
    public apiBaseUrl = "api/WorkFlow/";

    constructor(private httpClient: HttpClient) {

    }
    public GetWorkFlowStages(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetWorkFlowStages';
        return this.httpClient.get(apiUrl);
    }
    public GetWFStgDDLValues(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetWFStgDDLValues';
        return this.httpClient.get(apiUrl);
    }
    public UpdateWorkflowStages(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }
    public SetWorkflowStages(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SetWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteWorkflowStages(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteWorkFlowStages';
        return this.httpClient.post(apiUrl, data);
    }

}
