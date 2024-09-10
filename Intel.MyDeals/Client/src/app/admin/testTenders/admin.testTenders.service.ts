import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class admintestTendersService {
    public readonly apiBaseUrl = "api/Integration/";

    constructor(private httpClient: HttpClient) {

    }
     
    public ExecutePostTest(jsonDataPacket): Observable<any> {
        const headers = { 'content-type': 'application/json' };
        const apiUrl: string = this.apiBaseUrl + 'SaveSalesForceTenderData/';
        return this.httpClient.post(apiUrl, jsonDataPacket, { 'headers': headers });
    }

  

}