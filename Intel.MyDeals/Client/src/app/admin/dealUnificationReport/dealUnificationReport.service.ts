import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DealUnificationReportService {

    private readonly API_URL_DEAL_UNIFICATION = 'api/DealUnification/';

    constructor(private httpClient: HttpClient) {}

    public getUnificationDealReport(): Observable<unknown> {
        const API_URL = `${ this.API_URL_DEAL_UNIFICATION }GetUnificationDealReport`
        return this.httpClient.get(API_URL);
    }

}