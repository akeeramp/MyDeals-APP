import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Btch_Job_Tmng_Map } from "./admin.batchTiming.model";

@Injectable({
    providedIn: 'root'
})

export class batchTimingService {

    constructor(private httpClient: HttpClient) { }

    public readonly apiBaseUrl = "api/Logging/";
    public service = {
        getBatchJobTiming: this.getBatchJobTiming,
    }

    public getBatchJobTiming(logType: string): Observable<Btch_Job_Tmng_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetBatchJobTiming/' + logType;

        return this.httpClient.get<Btch_Job_Tmng_Map[]>(apiUrl);
    }
}
