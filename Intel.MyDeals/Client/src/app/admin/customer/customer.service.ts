import * as angular from 'angular';
import {Injectable, Inject} from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import {downgradeInjectable} from '@angular/upgrade/static';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
 })

export class customerService { 
    public apiBaseUrl: string = "api/Customers/";

    constructor(private httpClient: HttpClient) {
      }

      public getCustomers():Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetCustomers/false';
        return this.httpClient.get(apiUrl);
    }

    public getMyCustomersNameInfo():Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'GetMyCustomersNameInfo';
        return this.httpClient.get(apiUrl);

    }

}

angular
    .module('app')
    .service('customerService',downgradeInjectable(customerService));
