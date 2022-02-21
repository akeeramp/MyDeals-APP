import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { drop } from 'underscore';

@Injectable({
    providedIn: 'root'
})

export class dropdownService {
    public apiBaseUrl: string = "api/Dropdown/";
    public customerVendorApiBaseUrl: string = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {

    }

    public getOpDataElements(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetOpDataElements';
        return this.httpClient.get(apiUrl);
    }

    public getDropdown(strDropDownType): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + strDropDownType;
        return this.httpClient.get(apiUrl);
    }

    public getVendorDropDown(getVendorDropDowntypeUrl): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + getVendorDropDowntypeUrl;
        return this.httpClient.get(apiUrl);
    }

    public getBasicDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache: boolean = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        let apiUrl: string = this.apiBaseUrl + 'GetBasicDropdowns';
        let param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDealTypesDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache: boolean = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        let apiUrl: string = this.apiBaseUrl + 'GetDealTypesDropdowns';
        let param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDropdownGroups(isForceReGet): Observable<any> {
        let isGetViaAngularCache: boolean = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        let apiUrl: string = this.apiBaseUrl + 'GetDropdownGroups';
        let param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getCustsDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache: boolean = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        let apiUrl: string = this.apiBaseUrl + 'GetCustomersList';
        let param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public updateBasicDropdowns(dropdown): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateBasicDropdowns';
        return this.httpClient.put(apiUrl, dropdown);
    }

    public deleteBasicDropdowns(id): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DeleteBasicDropdowns/' + id;
        return this.httpClient.delete(apiUrl);
    }

    public insertBasicDropdowns(id): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'InsertBasicDropdowns';
        return this.httpClient.post(apiUrl, id);
    }
}

angular
    .module('app')
    .factory('dropdownService', downgradeInjectable(dropdownService));