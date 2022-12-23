import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class pingService {
    constructor(private httpClient: HttpClient) { }

    public pingHost(): Observable<any> {
        const url = "/Ping";
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(url, { params: param, responseType: 'text' });
    }

    public getBatchStatus(): Observable<any> {
        const url = "/api/AdminConstants/v1/GetConstantsByNameNonCached/BATCH_STATUS";
        const param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(url, { params: param });
    }
}
