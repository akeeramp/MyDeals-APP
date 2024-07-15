import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class customerService {
    public readonly apiBaseUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
    }

    public getCustomers(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetCustomers/false';
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomersNameInfo(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetMyCustomersNameInfo';
        return this.httpClient.get(apiUrl);

    }

}
