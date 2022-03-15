import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class adminBannerService {
    public apiBaseUrl: string = "api/AdminConstants/v1/";

    constructor(private httpClient: HttpClient) {
    }

    public getConstantsByName(data): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetConstantsByName/' + data;
        return this.httpClient.get(apiUrl);
    }
}
