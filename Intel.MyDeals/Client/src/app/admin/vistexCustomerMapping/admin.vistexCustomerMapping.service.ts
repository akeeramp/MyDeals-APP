import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vistex_Cust_Map } from "./admin.vistexCustomerMapping.model";
import { UiDropdownResponseItem } from "../dropdowns/admin.dropdowns.model";
import { Cust_Map } from "../CustomerVendors/admin.customerVendors.model";

@Injectable({
    providedIn: 'root'
})
export class vistexCustomerMappingService {

    public readonly API_URL_CUSTOMER_MAPPING = "api/VistexCustomerMappings/";
    public readonly API_URL_CUSTOMERS = "api/Customers/";
    public readonly API_URL_DROPDOWN = "api/Dropdown/";
    public readonly API_URL_CUSTOMER_VENDOR = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {}

    public getVistexCustomersMapList(): Observable<Vistex_Cust_Map[]> {
        const apiUrl: string = this.API_URL_CUSTOMER_MAPPING + 'GetVistexCustomersMapList/false';
        return this.httpClient.get<Vistex_Cust_Map[]>(apiUrl);
    }

    public UpdateVistexCustomer(data: Vistex_Cust_Map): Observable<Vistex_Cust_Map[]> {
        const apiUrl: string = this.API_URL_CUSTOMER_MAPPING + 'UpdateVistexCustomer';
        return this.httpClient.post<Vistex_Cust_Map[]>(apiUrl, data);
    }

    public getDropdown(strDropDownType: string): Observable<UiDropdownResponseItem[]> {
        const apiUrl: string = this.API_URL_DROPDOWN + strDropDownType;
        return this.httpClient.get<UiDropdownResponseItem[]>(apiUrl);
    }

    public getVendorDropDown(getVendorDropDowntypeUrl: string): Observable<Cust_Map[]> {
        const apiUrl: string = this.API_URL_CUSTOMER_VENDOR + getVendorDropDowntypeUrl;
        return this.httpClient.get<Cust_Map[]>(apiUrl);
    }

}