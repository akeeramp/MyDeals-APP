import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { PushDealIdstoVistex, PushDealstoVistexResults } from "./admin.pushDealstoVistex.model";

@Injectable({
    providedIn: 'root'
})


export class pushDealsToVistexService {
    public readonly apiBaseUrl = "api/PushDealstoVistex/";

    constructor(private httpClient: HttpClient) {

    }

    public PushDealstoVistex(data: PushDealIdstoVistex): Observable<PushDealstoVistexResults[]> {
        const apiUrl: string = this.apiBaseUrl + 'DealsPushtoVistex';
        return this.httpClient.post<PushDealstoVistexResults[]>(apiUrl, data);
    }


}

