import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class dealToolsService {
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiBasePricingStrategyUrl = "/api/PricingStrategies/v1/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";

    constructor(private httpClient: HttpClient) { }

    public readContract(id): Observable<any>  {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public copyPricingStrategy(custId, contractId, srcId, ps): Observable<any> {
        return this.httpClient.post(this.apiBasePricingStrategyUrl + 'CopyPricingStrategy/' + custId + '/' + contractId + '/' + srcId, [ps]);
    }
    public actionWipDeals(custId, contractId, data): Observable<any> {
        return this.httpClient.post(this.apiBasePricingTableUrl + 'actionWipDeals/' + custId + '/' + contractId, data);
    }
}