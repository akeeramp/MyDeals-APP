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

    public readonly apiBaseUrl = "api/VistexCustomerMappings/";
    public readonly customerUrl = "api/Customers/";
    public readonly dropdownUrl = "api/Dropdown/";
    public readonly customerVendorApiBaseUrl = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {
    }

    public getVistexCustomersMapList(): Observable<Vistex_Cust_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'GetVistexCustomersMapList/false';
        return this.httpClient.get<Vistex_Cust_Map[]>(apiUrl);
    }

    public UpdateVistexCustomer(data: Vistex_Cust_Map): Observable<Vistex_Cust_Map[]> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateVistexCustomer';
        return this.httpClient.post<Vistex_Cust_Map[]>(apiUrl, data);
    }

    public getDropdown(strDropDownType: string): Observable<UiDropdownResponseItem[]> {
        const apiUrl: string = this.dropdownUrl + strDropDownType;
        return this.httpClient.get<UiDropdownResponseItem[]>(apiUrl);
    }

    public getVendorDropDown(getVendorDropDowntypeUrl: string): Observable<Cust_Map[]> {
        const apiUrl: string = this.customerVendorApiBaseUrl + getVendorDropDowntypeUrl;
        return this.httpClient.get<Cust_Map[]>(apiUrl);
    }

}