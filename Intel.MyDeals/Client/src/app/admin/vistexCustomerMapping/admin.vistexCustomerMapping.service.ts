import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class vistexCustomerMappingService {
    public apiBaseUrl = "api/VistexCustomerMappings/";
    public customerUrl = "api/Customers/";
    public dropdownUrl = "api/Dropdown/";
    public customerVendorApiBaseUrl = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {
    }

    public getVistexCustomersMapList(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetVistexCustomersMapList/false';
        return this.httpClient.get(apiUrl);
    }

    public UpdateVistexCustomer(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateVistexCustomer';
        return this.httpClient.post(apiUrl, data);

    }

    public getDropdown(strDropDownType): Observable<any> {
        const apiUrl: string = this.dropdownUrl + strDropDownType;
        return this.httpClient.get(apiUrl);

    }

    public getVendorDropDown(getVendorDropDowntypeUrl): Observable<any> {
        const apiUrl: string = this.customerVendorApiBaseUrl + getVendorDropDowntypeUrl;
        return this.httpClient.get(apiUrl);

    }


}

