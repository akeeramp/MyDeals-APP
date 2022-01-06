import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class vistexCustomerMappingService {
    public apiBaseUrl: string = "api/VistexCustomerMappings/";
    public customerUrl: string = "api/Customers/";
    public dropdownUrl: string = "api/Dropdown/";
    public customerVendorApiBaseUrl = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {
    }

    public getVistexCustomersMapList(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetVistexCustomersMapList/false';
        return this.httpClient.get(apiUrl);
    }

    public UpdateVistexCustomer(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateVistexCustomer';
        return this.httpClient.post(apiUrl, data);

    }

    public getDropdown(strDropDownType): Observable<any> {
        let apiUrl: string = this.dropdownUrl + strDropDownType;
        return this.httpClient.get(apiUrl);

    }

    public getVendorDropDown(getVendorDropDowntypeUrl): Observable<any> {
        let apiUrl: string = this.customerVendorApiBaseUrl + getVendorDropDowntypeUrl;
        return this.httpClient.get(apiUrl);

    }


}

