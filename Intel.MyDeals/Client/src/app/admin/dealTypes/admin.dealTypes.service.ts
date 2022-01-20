import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class dealTypesService {
    public apiBaseUrl: string = "api/SecurityAttributes/";

    constructor(private httpClient: HttpClient) {

    }
    public getDealTypes(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetAdminDealTypes';
        return this.httpClient.get(apiUrl);
    }
}
