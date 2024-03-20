import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class expireYcs2Service {
    public apiBaseUrl = "api/ExpireYcs2/";

    constructor(private httpClient: HttpClient) {

    }
    public expireYcs2(dealId:any):Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ExpireYcs2';
        return this.httpClient.post(apiUrl,dealId);
    }
}