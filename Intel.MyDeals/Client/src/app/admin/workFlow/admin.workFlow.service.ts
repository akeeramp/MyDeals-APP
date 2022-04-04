import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class workflowService {
    public apiBaseUrl = "api/WorkFlow/";

    constructor(private httpClient: HttpClient) {

    }
    public GetWorkFlowItems(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetWorkFlowItems';
        return this.httpClient.get(apiUrl);
    }
    public GetDropDownValues(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDropDownValues';
        return this.httpClient.get(apiUrl);
    }
    public UpdateWorkflow(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateWorkflow';
        return this.httpClient.post(apiUrl, data);
    }
    public SetWorkFlows(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SetWorkFlows';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteWorkflow(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteWorkflow';
        return this.httpClient.post(apiUrl, data);
    }

}
