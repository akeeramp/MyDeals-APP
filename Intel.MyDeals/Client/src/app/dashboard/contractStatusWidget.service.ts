import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class contractStatusWidgetService {

    public dropdownUrl = "api/Customers/";
    private readonly API_URL_CONTRACTS = "/api/Contracts/v1/";

    constructor(private httpClient: HttpClient) { }
    public isRefresh = new BehaviorSubject(false);

    public getCustomerDropdowns(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }

    public readCopyContract(id) {
        const apiUrl: string = this.API_URL_CONTRACTS + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }
}