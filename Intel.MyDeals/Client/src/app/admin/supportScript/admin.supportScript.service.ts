import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class adminsupportScriptService {
    public apiBaseUrl = "api/dataquality/";
    public apiIntegrationUrl = "api/Integration/";
    
    constructor(private httpClient: HttpClient) { }
    
    public ExecuteCostGapFiller(startYearQtr, endYearQtr, isnullCheck, prodIds) {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + "ExecuteCostGapFiller/" + startYearQtr + "/" + endYearQtr + "/" + isnullCheck;
        return this.httpClient.post(apiUrl, prodIds, { 'headers': headers }); 
    }


    public ExecutePostTest(jsonDataPacket) {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiIntegrationUrl + 'SaveSalesForceTenderData/' ;
        return this.httpClient.post(apiUrl, jsonDataPacket, { 'headers': headers });
    }

}