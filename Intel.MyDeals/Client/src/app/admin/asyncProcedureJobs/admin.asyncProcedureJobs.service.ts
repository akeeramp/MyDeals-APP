import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AsyncProcTrigger, CreateAsyncProcTriggerData } from "./admin.asyncProcedureJobs.models";

@Injectable({
    providedIn: 'root'
})
export class AsyncProcedureJobsService {

    private API_URL_ASYNC_PROC_JOBS = 'api/AsyncProcTrigger/';

    constructor(private httpClient: HttpClient) { }

    public getGetAsyncProcTriggers(): Observable<AsyncProcTrigger[]> {
        const apiUrl = this.API_URL_ASYNC_PROC_JOBS + 'GetAsyncProcTriggers';
        return this.httpClient.get(apiUrl) as Observable<AsyncProcTrigger[]>;
    }

    public saveAsyncProcTrigger(data: CreateAsyncProcTriggerData): Observable<AsyncProcTrigger[]> {
        const apiUrl = this.API_URL_ASYNC_PROC_JOBS + 'SaveAsyncProcTrigger';
        return this.httpClient.post(apiUrl, data) as Observable<AsyncProcTrigger[]>;
    }

}