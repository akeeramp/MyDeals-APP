import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs/Observable";
import { State } from "@progress/kendo-data-query";

@Injectable({
    providedIn: 'root'
})

export class managerPctservice {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/Dashboard/GetWipSummary/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";
    public loading: boolean;

    public getPctDetails(dealId): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'GetPctDetails/' + dealId;
        return this.httpClient.get(apiUrl);
    }
    public setPctOverride(data): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'SetPctOverride';
        return this.httpClient.post(apiUrl,data);
    }
    public GetLegalExceptionsPct(date): Observable<any> {
        const apiUrl: string = "/api/ProductCostTest/GetLegalExceptionsPct/"+ date;
        return this.httpClient.get(apiUrl);
    } 
    public queryForCategory(dealId: number, state?: State): void {
        Object.assign({}, state, {
            filter: {
                filters: [
                    {
                        field: "DEAL_ID",
                        operator: "eq",
                        value: dealId,
                    },
                ],
                logic: "and",
            },
        })
    }
}