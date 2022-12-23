import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})


export class pushDealsToVistexService {
    public apiBaseUrl = "api/PushDealstoVistex/";

    constructor(private httpClient: HttpClient) {

    }

    public PushDealstoVistex(data: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DealsPushtoVistex';
        return this.httpClient.post(apiUrl, data);
    }


}

