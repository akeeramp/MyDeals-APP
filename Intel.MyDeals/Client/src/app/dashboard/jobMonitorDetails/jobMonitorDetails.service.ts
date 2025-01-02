import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class jobMonitorDetailsService {

    public readonly apiDashUrl = "api/JobMonitor/";

    constructor(private httpClient: HttpClient) {}

    public GetBatchStepsRunHealthStatus(jobNm): Observable<any> {  
        const apiUrl: string = this.apiDashUrl + 'GetBatchStepsRunHealthStatus/' + jobNm;
        return this.httpClient.get(apiUrl);
    }
    
    public GetBatchStepRunHistory(btchNm, stepnm, take): Observable<any> {  
        const apiUrl: string = this.apiDashUrl + 'GetBatchStepRunHistory';
        const dataObj = {
            btchNm: btchNm,
            stepnm: stepnm,
            take: take
        }
        return this.httpClient.post(apiUrl,dataObj);
    }
}
