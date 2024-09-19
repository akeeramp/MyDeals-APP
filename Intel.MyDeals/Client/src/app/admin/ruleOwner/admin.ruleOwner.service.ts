import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ruleOwnerService {
    public readonly apiBaseUrl = "api/Rules/";

    constructor(private httpClient: HttpClient) {

    }
    
    public getPriceRulesConfig(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPriceRulesConfig';
        return this.httpClient.get(apiUrl);
    }

    public updatePriceRule(priceRuleCriteria, strActionName): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePriceRule/';
        return this.httpClient.post(apiUrl + strActionName, priceRuleCriteria);
    }

    public getPriceRules(id, strActionName): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPriceRules/';
        return this.httpClient.get(apiUrl + id + "/" + strActionName);
    }
}

