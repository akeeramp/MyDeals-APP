import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PushValidateVistexR3Data, ValidateVistexR3Wrapper } from "./admin.validateVistexR3Checks.model";
import { Cust_Div_Map } from "../customer/admin.customer.model";

@Injectable({
    providedIn: 'root'
})

export class ValidateVistexR3ChecksService {

    public readonly apiBaseUrl = "api/ValidateVistexR3Checks/";
    public readonly apiCustUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
    }

    public getVistexCustomersMapList(data: PushValidateVistexR3Data): Observable<ValidateVistexR3Wrapper> {
        const apiUrl: string = this.apiBaseUrl + 'VistexR3Checks';
        return this.httpClient.post<ValidateVistexR3Wrapper>(apiUrl, data);
    }

    public getActiveCustomers(): Observable<Cust_Div_Map[]> {
        const apiUrl: string = this.apiCustUrl + 'GetActiveCustomers';
        return this.httpClient.get<Cust_Div_Map[]>(apiUrl);
    }
}