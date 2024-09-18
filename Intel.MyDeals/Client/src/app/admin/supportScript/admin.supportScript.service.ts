import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { TenderTransferRootObject } from "./admin.supportScript.model";

@Injectable({
    providedIn: 'root'
})

export class adminsupportScriptService {
    public readonly apiBaseUrl = "api/dataquality/";
    public readonly apiIntegrationUrl = "api/Integration/";
    
    constructor(private httpClient: HttpClient) { }
    
    public ExecuteCostGapFiller(startYearQtr: any, endYearQtr: any, isnullCheck: boolean, prodIds: string): Observable<boolean> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + "ExecuteCostGapFiller/" + startYearQtr + "/" + endYearQtr + "/" + isnullCheck;
        return this.httpClient.post<boolean>(apiUrl, prodIds, { 'headers': headers }); 
    }

    public ExecutePostTest(jsonDataPacket: any): Observable<TenderTransferRootObject> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiIntegrationUrl + 'SaveSalesForceTenderData/' ;
        return this.httpClient.post<TenderTransferRootObject>(apiUrl, jsonDataPacket, { 'headers': headers });
    }

}