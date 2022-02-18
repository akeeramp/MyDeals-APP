import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class pushDealsToVistexService {
    public apiBaseUrl: string = "api/PushDealstoVistex/";

    constructor(private httpClient: HttpClient) {

    }

    public PushDealstoVistex(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DealsPushtoVistex';
        return this.httpClient.post(apiUrl, data);
    }


}

