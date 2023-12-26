import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SdsDealOverridesService {

    constructor(private httpClient: HttpClient) { }

    private readonly API_URL_SDS_DEAL_OVERRIDE = "api/SdsDealOverride/";

    public service: any = {
        getRules: this.getRules,
        SaveSdsDealOverrides: this.SaveSdsDealOverrides,
        SdsGetActiveOverrides: this.SdsGetActiveOverrides,
        SdsGetHistoryOverrides: this.SdsGetHistoryOverrides
    }

    public getRules():Observable<any> {
        const apiUrl: string = this.API_URL_SDS_DEAL_OVERRIDE + 'GetSdsDealOverrideRules';
        return this.httpClient.get(apiUrl);
    }

    public SaveSdsDealOverrides(data): Observable<any> {
        const apiUrl: string = this.API_URL_SDS_DEAL_OVERRIDE + 'SaveSdsDealOverrides';
        return this.httpClient.post(apiUrl,data);
    }

    public SdsGetActiveOverrides(): Observable<any> {
        const apiUrl: string = this.API_URL_SDS_DEAL_OVERRIDE + 'SdsGetActiveOverrides';
        return this.httpClient.get(apiUrl);
    }

    public SdsGetHistoryOverrides(): Observable<any> {
        const apiUrl: string = this.API_URL_SDS_DEAL_OVERRIDE + 'SdsGetHistoryOverrides';
        return this.httpClient.get(apiUrl);
    }

}