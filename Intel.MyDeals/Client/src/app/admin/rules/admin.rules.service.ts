import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class adminRulesService {
    public apiBaseUrl = "api/Rules/";

    constructor(private httpClient: HttpClient) {

    }

    public getPriceRules(id, strActnNm): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPriceRules/' + id + '/' + strActnNm;
        return this.httpClient.get(apiUrl);
    }

    public getPriceRulesConfig(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetPriceRulesConfig/';
        return this.httpClient.get(apiUrl);
    }

    public deletePriceRule(iRuleSid): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeletePriceRule/' + iRuleSid;
        return this.httpClient.get(apiUrl);
    }

    public updatePriceRule(priceRuleCriteria, strActionName): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePriceRule/' + strActionName;
        return this.httpClient.get(apiUrl, priceRuleCriteria);
    }
}