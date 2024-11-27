import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class managerExcludeGroupsService {
    constructor(private httpClient: HttpClient) { }

    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiLookupUrl = "/api/Dropdown/GetDealGroupDropdown/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/"
    public apiBaseCostTestUrl = "/api/CostTest/v1/";
    public loading: boolean;

    public readWipExclusionFromContract(id): Observable<any> {
        const apiUrl: string = this.apiBaseContractUrl + 'GetWipExclusionFromContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public getExcludeGroupDetails(dealId, isToggleOn): Observable<any> {
        const apiUrl: string = this.apiLookupUrl + dealId + '/' + isToggleOn;
        return this.httpClient.get(apiUrl);
    }

    public updateWipDeals(custId, contractId, wips): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'UpdateWipDeals/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, wips);
    }

    public runPctContract(id): Observable<any> {
        const apiUrl: string = this.apiBaseCostTestUrl + 'RunPctContract/' + id;
        return this.httpClient.get(apiUrl);
    }
}