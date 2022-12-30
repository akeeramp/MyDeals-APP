import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";

@Injectable({
    providedIn: 'root'
})

export class contractManagerservice {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/Dashboard/GetWipSummary/";
    public apiBaseCostTestUrl = "/api/CostTest/v1/";
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";


    public getWipSummary(id): Observable<any>{
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseUrl + id;
        return this.httpClient.get(apiUrl);
    }
    public runPctContract(id): Observable<any> {
        const apiUrl: string = this.apiBaseCostTestUrl + 'RunPctContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public createContract(sid,cid, contracts): Observable<any>{
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'SaveContract/' + sid+'/'+ cid;
        return this.httpClient.post(apiUrl, [contracts]);
    }
    public loggingPerfomanceTimes(uids): Observable<any> {
        const apiUrl: string = 'api/Logging/PerformanceTimes';
        return this.httpClient.post(apiUrl,uids);
    }
    public getActiveFunFacts(): Observable<any> {
        const apiUrl: string = 'api/Funfact/GetActiveFunfacts';
        return this.httpClient.get(apiUrl);
    }
    public actionPricingStrategies(custId,contractId,data, contractCustAccpt): Observable<any> {
        const apiUrl: string = this.apiBasePricingStrategyUrl + 'ActionPricingStrategies/' + custId + '/' + contractId + '/' + contractCustAccpt;
        return this.httpClient.post(apiUrl , data);
    }
    public getEmployeeProfile(): Observable<any> {
        const apiUrl: string = '/api/Employees/GetUsrProfileRole';
        return this.httpClient.get(apiUrl);
    }
    public emailNotification(emailInfo): Observable<any> {
        const apiUrl: string = '/Email/EmailNotification';
        return this.httpClient.post(apiUrl,emailInfo);
    }

}
