import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class jobMonitorService {

    public readonly apiDashUrl = "api/JobMonitor/";

    constructor(private httpClient: HttpClient) {}

    public GetBatchRunHealthStatus(): Observable<any> {  
        const apiUrl: string = this.apiDashUrl + 'GetBatchRunHealthStatus';
        return this.httpClient.get(apiUrl);
    }
}
