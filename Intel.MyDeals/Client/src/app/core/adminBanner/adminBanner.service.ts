import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class adminBannerService {
    public apiBaseUrl = "api/AdminConstants/v1/";

    constructor(private httpClient: HttpClient) {
    }

    public getConstantsByName(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetConstantsByName/' + data;
        return this.httpClient.get(apiUrl);
    }
}
