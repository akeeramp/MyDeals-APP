import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class sdsDealOverridesService {

    constructor(private httpClient: HttpClient) { }
    public apiBaseUrl = "api/SdsDealOverride/";

    public service: any = {
        getRules: this.getRules,
        SaveSdsDealOverrides: this.SaveSdsDealOverrides,
        SdsGetActiveOverrides: this.SdsGetActiveOverrides,
        SdsGetHistoryOverrides: this.SdsGetHistoryOverrides
    }

    public getRules():Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetSdsDealOverrideRules';
        return this.httpClient.get(apiUrl);
    }

    public SaveSdsDealOverrides(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SaveSdsDealOverrides';
        return this.httpClient.post(apiUrl,data);
    }

    public SdsGetActiveOverrides(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SdsGetActiveOverrides';
        return this.httpClient.get(apiUrl);
    }

    public SdsGetHistoryOverrides(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SdsGetHistoryOverrides';
        return this.httpClient.get(apiUrl);
    }

}