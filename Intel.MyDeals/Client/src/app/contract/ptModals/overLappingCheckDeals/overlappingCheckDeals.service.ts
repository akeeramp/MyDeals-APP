import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class overLappingcheckDealService {
    public apiBaseContractUrl = "/api/Contracts/v1/";
    public apiCustomerVendorUrl = "api/CustomerVendor/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";

    constructor(private httpClient: HttpClient) {
    }

    public getCustomerVendors(id): Observable<any> {
        const apiUrl: string = this.apiCustomerVendorUrl + 'GetCustomerVendors/' + id;
        return this.httpClient.get(apiUrl);
    }
    public readContract(id) {
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseContractUrl + 'GetUpperContract/' + id;
        return this.httpClient.get(apiUrl);
    }
    public getOverLappingCheckDealsDetails(id): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'getOverlappingDealsFromPricingTable/' + id;
        return this.httpClient.get(apiUrl);
    }

    public updateOverlappingDeals(PRICING_TABLES_ID, YCS2_OVERLAP_OVERRIDE): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'UpdateOverlappingDeals/' + YCS2_OVERLAP_OVERRIDE;
        return this.httpClient.post(apiUrl, PRICING_TABLES_ID);
    }

    public getOverLappingDealsDetails(id): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'GetOverlappingDealsFromContract/' + id;
        return this.httpClient.get(apiUrl);
    }

}