import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Cust_Dropdown_Map, Cust_Map, Vendor_Map } from "./admin.customerVendors.model";

@Injectable({
    providedIn: 'root'
 })


export class customerVendorService { 
    public readonly apiBaseUrl = "api/CustomerVendor/";
    public readonly dropdownUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) {
      
      }
    public getCustomerDropdowns(): Observable<Cust_Dropdown_Map[]> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get<Cust_Dropdown_Map[]>(apiUrl);
    }
    public updateCustomerVendor(dropdown: Cust_Map): Observable<Cust_Map>  {
        const apiUrl: string = this.apiBaseUrl + 'UpdateCustomerVendor';
        return this.httpClient.put<Cust_Map>(apiUrl,dropdown);
    }
    public insertCustomerVendor(dropdown: Cust_Map): Observable<Cust_Map>  {
        const apiUrl: string = this.apiBaseUrl + 'InsertCustomerVendor';
        return this.httpClient.post<Cust_Map>(apiUrl,dropdown);
    }
    public getCustomerVendors(): Observable<Cust_Map[]>  {
        const apiUrl: string = this.apiBaseUrl + 'GetCustomerVendors/0';
        return this.httpClient.get<Cust_Map[]>(apiUrl);
    }
    public getVendorsData(): Observable<Vendor_Map[]>  {
        const apiUrl: string = this.apiBaseUrl + 'GetVendorsData';
        return this.httpClient.get<Vendor_Map[]>(apiUrl);
    }
    
}
