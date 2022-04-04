import * as angular from 'angular';
import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import {downgradeInjectable} from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
 })


export class customerVendorService { 
    public apiBaseUrl ="api/CustomerVendor/";
    public dropdownUrl ="api/Customers/";

    constructor(private httpClient: HttpClient) {
      
      }
      public getCustomerDropdowns():Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
     }
     public updateCustomerVendor(dropdown:any):Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'UpdateCustomerVendor';
        return this.httpClient.put(apiUrl,dropdown);
    }
    public insertCustomerVendor(dropdown:any):Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'InsertCustomerVendor';
        return this.httpClient.post(apiUrl,dropdown);
    }
    public getCustomerVendors():Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'GetCustomerVendors/0';
        return this.httpClient.get(apiUrl);
    }
    public getVendorsData():Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'GetVendorsData';
        return this.httpClient.get(apiUrl);
    }
    
}

    angular
    .module('app')
    .factory('customerVendorsService', downgradeInjectable(customerVendorService));