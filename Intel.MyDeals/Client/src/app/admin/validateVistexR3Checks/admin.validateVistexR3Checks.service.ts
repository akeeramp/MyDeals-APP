import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ValidateVistexR3ChecksService {

    public readonly apiBaseUrl = "api/ValidateVistexR3Checks/";
    public readonly apiCustUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
    }

    public getVistexCustomersMapList(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'VistexR3Checks';
        return this.httpClient.post(apiUrl, data);
    }

    public getActiveCustomers(): Observable<any> {
        const apiUrl: string = this.apiCustUrl + 'GetActiveCustomers';
        return this.httpClient.get(apiUrl);
    }
}