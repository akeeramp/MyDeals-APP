import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class batchJobConstantsService {
    
    public apiBaseUrl = "api/AdminConstants/v1/";
    constructor(private httpClient: HttpClient) { }

    public getAllBatchJobConstDetails(mode:string): Observable<any>{
        const apiURL: string = this.apiBaseUrl + 'UpdateBatchJobConstants/?mode='+ mode;
        return this.httpClient.post(apiURL,{});
    }

    public updateBatchJobConstants(dto, mode:string): Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'UpdateBatchJobConstants/?mode='+ mode;
        return this.httpClient.post(apiUrl, dto);
    }

    public updateBatchJobStepConstants(mode:string, batchSid : number , json): Observable<any>  {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'UpdateBatchJobStepConstants/?mode=' + mode + '&batchSid=' + batchSid;
        return this.httpClient.post(apiUrl, json, { 'headers': headers });
    }
}