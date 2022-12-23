import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

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

    public validateProducts(lstProducts): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'ValidateProducts'
        return this.httpClient.post(apiUrl, lstProducts);
    }

    public deletePriceRule(iRuleSid): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeletePriceRule/' + iRuleSid;
        return this.httpClient.post(apiUrl, iRuleSid);
    }

    public updatePriceRule(priceRuleCriteria, strActionName): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePriceRule/' + strActionName;
        return this.httpClient.post(apiUrl, priceRuleCriteria);
    }

    public getRuleSimulationResults(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetRuleSimulationResults';
        return this.httpClient.post(apiUrl, data);//data will be 2 lists, ruleIDs and dealIDs
    }

    public copyPriceRule(iRuleSid): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'CopyPriceRule/' + iRuleSid;
        return this.httpClient.post(apiUrl, iRuleSid);
    }
    
    public isDuplicateTitle(iRuleSid, strTitle): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'IsDuplicateTitle/' + iRuleSid + "/" + strTitle;
        return this.httpClient.post(apiUrl, iRuleSid);
    }

    public getRuleConditionsByRuleId(ruleId): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'getRuleConditionsByRuleId/' + ruleId;
        return this.httpClient.get(apiUrl);
    }

    public getRuleSets(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetRuleSets';
        return this.httpClient.get(apiUrl);
    }

    public getPassedRuleTasksByRuleId(ruleId): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'getPassedRuleTasksByRuleId/' + ruleId ;
        return this.httpClient.get(apiUrl);
    }

    public getRuleItemById(ruleId): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetRuleItemById/' + ruleId;
        return this.httpClient.get(apiUrl, ruleId);
    }

    public getFailedRuleTasksByRuleId(ruleId): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'getFailedRuleTasksByRuleId/' + ruleId;
        return this.httpClient.get(apiUrl);
    }

    //adding this to remove dependency from adminBanner service func
    public getConstantsByName(data): Observable<any> {
        const apiBaseUrlCnst = "api/AdminConstants/v1/";
        const apiUrl = apiBaseUrlCnst + 'GetConstantsByName/' + data;
        return this.httpClient.get(apiUrl);
    }
}