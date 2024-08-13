import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { DownloadExpireYcs2Data, ExpireYcs2_Payload } from "./admin.expireYcs2.model";

@Injectable({
    providedIn: 'root'
})

export class expireYcs2Service {
    public apiBaseUrl = "api/ExpireYcs2/";

    constructor(private httpClient: HttpClient) {

    }
    public expireYcs2(dealId: ExpireYcs2_Payload): Observable<DownloadExpireYcs2Data[]> {
        const apiUrl: string = this.apiBaseUrl + 'ExpireYcs2';
        return this.httpClient.post<DownloadExpireYcs2Data[]>(apiUrl,dealId);
    }
}