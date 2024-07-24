import { Injectable } from "@angular/core";
import { HttpClient, } from '@angular/common/http';
import { Observable } from "rxjs";
import { DynamicObj, EmployeeCustomers, ManageUsersInfo, Product } from "./admin.employee.model";
import { Cust_Div_Map } from "../customer/admin.customer.model";

@Injectable({
    providedIn: 'root'
})

export class manageEmployeeService {
    public readonly apiBaseUrl = "api/UserPreferences/";
    public usrWwid = 0;
    public usrRole = "UNKNOWN";
    public usrCustomerAdmin = false;

    constructor(private httpClient: HttpClient) {
        // Get the ROLE and WWID of the user if needed, SA users get a free pass and get to play with everyone   
        this.usrRole = (<any>window).usrRole;
        this.usrCustomerAdmin = (<any>window).isCustomerAdmin;

        if (this.usrRole === "SA" || this.usrCustomerAdmin === true) {
            this.usrWwid = (<any>window).usrWwid = 0;
        }
        else {
            this.usrWwid = (<any>window).usrWwid;
        }
    }

    public getEmployeeData(): Observable<ManageUsersInfo[]> {
        const apiUrl = this.apiBaseUrl + 'GetManageUserData/';
        return this.httpClient.get<ManageUsersInfo[]>(apiUrl + this.usrWwid); // Passing 0 as a WWID for all users, other services might pass WWID to get specific user records.
    }

    public getCustomersFromGeos(geos: string): Observable<Cust_Div_Map[]> {
        const apiUrl = this.apiBaseUrl + 'GetManageUserDataGetCustomersInGeos/';
        return this.httpClient.get<Cust_Div_Map[]>(apiUrl + geos);
    }
    public setEmployeeData(data: EmployeeCustomers): Observable<DynamicObj> {
        const apiUrl = this.apiBaseUrl + 'SetManageUserData';
        return this.httpClient.post(apiUrl, data);
    }
    public setEmployeeVerticalData(data: EmployeeCustomers): Observable<DynamicObj> {
        const apiUrl = this.apiBaseUrl + 'SetEmployeeVerticalData';
        return this.httpClient.post(apiUrl, data);
    }
    public getProductCategoriesWithAll(): Observable<Product[]> {
        const apiUrl: string = "api/Products/" + 'GetProductCategoriesWithAll';
        return this.httpClient.get<Product[]>(apiUrl);
    }
}