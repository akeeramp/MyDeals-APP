import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class dealTypesService {
    public apiBaseUrl = "api/SecurityAttributes/";

    constructor(private httpClient: HttpClient) {

    }
    public getDealTypes(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetAdminDealTypes';
        return this.httpClient.get(apiUrl);
    }
}
