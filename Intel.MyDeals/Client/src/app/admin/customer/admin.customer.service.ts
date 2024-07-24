import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cust_Div_Map } from "./admin.customer.model";
import { Cust_Dropdown_Map } from "../CustomerVendors/admin.customerVendors.model";

@Injectable({
    providedIn: 'root'
})

export class customerService {
    public readonly apiBaseUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
    }

    public getCustomers(): Observable<Cust_Div_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetCustomers/false';
        return this.httpClient.get<Cust_Div_Map[]>(apiUrl);
    }

    public getMyCustomersNameInfo(): Observable<Cust_Dropdown_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetMyCustomersNameInfo';
        return this.httpClient.get<Cust_Dropdown_Map[]>(apiUrl);
    }

}
