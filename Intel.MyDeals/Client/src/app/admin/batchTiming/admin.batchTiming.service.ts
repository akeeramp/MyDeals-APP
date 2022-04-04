import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class batchTimingService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "api/Logging/";
    public service: any = {
        getBatchJobTiming: this.getBatchJobTiming,
    }

    public getBatchJobTiming(logType): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetBatchJobTiming/' + logType;

        return this.httpClient.get(apiUrl);
    }
}
