import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class pingService {
    constructor(private httpClient: HttpClient) { }

    public pingHost(): Observable<any> {
        let url: string = "/Ping";
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(url, { params: param, responseType: 'text' });
    }

    public getBatchStatus(): Observable<any> {
        let url: string = "/api/AdminConstants/v1/GetConstantsByNameNonCached/BATCH_STATUS";
        let param = new HttpParams();
        param.set('cache', 'false');
        return this.httpClient.get(url, { params: param });
    }
}
