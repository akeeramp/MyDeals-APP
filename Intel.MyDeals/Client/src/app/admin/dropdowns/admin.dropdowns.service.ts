import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DropdownService {

    private readonly API_URL_DROPDOWN = "api/Dropdown/";
    private readonly API_URL_CUSTOMER_VENDOR = "api/CustomerVendor/";

    constructor(private httpClient: HttpClient) { }

    public getBasicDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.API_URL_DROPDOWN + 'GetBasicDropdowns';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDealTypesDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.API_URL_DROPDOWN + 'GetDealTypesDropdowns';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getDropdownGroups(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.API_URL_DROPDOWN + 'GetDropdownGroups';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public getCustsDropdowns(isForceReGet): Observable<any> {
        let isGetViaAngularCache = true;
        if (isForceReGet) {
            isGetViaAngularCache = false;
        }
        const apiUrl = this.API_URL_DROPDOWN + 'GetCustomersList';
        const param = new HttpParams();
        param.set('cache', isGetViaAngularCache.toString());
        return this.httpClient.get(apiUrl, { params: param });
    }

    public updateBasicDropdowns(dropdown): Observable<any> {
        const apiUrl = this.API_URL_DROPDOWN + 'UpdateBasicDropdowns';
        return this.httpClient.put(apiUrl, dropdown);
    }

    public deleteBasicDropdowns(dropdown): Observable<any> {
        const apiUrl = this.API_URL_DROPDOWN + 'DeleteBasicDropdowns';
        return this.httpClient.put(apiUrl, dropdown);
    }

    public insertBasicDropdowns(id): Observable<any> {
        const apiUrl = this.API_URL_DROPDOWN + 'InsertBasicDropdowns';
        return this.httpClient.post(apiUrl, id);
    }

}