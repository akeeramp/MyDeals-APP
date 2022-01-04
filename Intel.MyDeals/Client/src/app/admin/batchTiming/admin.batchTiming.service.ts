import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class batchTimingService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl: string = "api/Logging/";
    public service: any = {
        getBatchJobTiming: this.getBatchJobTiming,
    }

    public getBatchJobTiming(logType): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetBatchJobTiming/' + logType;

        return this.httpClient.get(apiUrl);
    }
}
