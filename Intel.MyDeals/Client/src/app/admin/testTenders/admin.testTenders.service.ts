import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { TenderTransferRootObject } from "../supportScript/admin.supportScript.model";

@Injectable({
    providedIn: 'root'
})

export class admintestTendersService {
    public readonly apiBaseUrl = "api/Integration/";

    constructor(private httpClient: HttpClient) {

    }
     
    public ExecutePostTest(jsonDataPacket): Observable<TenderTransferRootObject> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'SaveSalesForceTenderData/';
        return this.httpClient.post<TenderTransferRootObject>(apiUrl, jsonDataPacket, { 'headers': headers });
    }

  

}