import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class dropdownService {
    public apiBaseUrl = "api/Dropdown/";
    public customerVendorApiBaseUrl = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) {

    }

    public getBasicDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.apiBaseUrl + 'GetBasicDropdowns';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDealTypesDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.apiBaseUrl + 'GetDealTypesDropdowns';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDropdownGroups(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.apiBaseUrl + 'GetDropdownGroups';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getCustsDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.apiBaseUrl + 'GetCustomersList';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public updateBasicDropdowns(dropdown): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'UpdateBasicDropdowns';
        return this.httpClient.put(apiUrl, dropdown);
    }

    public deleteBasicDropdowns(id): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'DeleteBasicDropdowns/' + id;
        return this.httpClient.delete(apiUrl);
    }

    public insertBasicDropdowns(id): Observable<any> {
        const apiUrl = this.apiBaseUrl + 'InsertBasicDropdowns';
        return this.httpClient.post(apiUrl, id);
    }
}

