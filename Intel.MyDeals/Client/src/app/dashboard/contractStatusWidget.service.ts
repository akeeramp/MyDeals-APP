import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class contractStatusWidgetService {

    public dropdownUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) { }
    public isRefresh = new BehaviorSubject(false);

    public getCustomerDropdowns(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }
}