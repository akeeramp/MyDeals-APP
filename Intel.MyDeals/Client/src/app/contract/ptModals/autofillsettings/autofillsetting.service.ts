import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class autoFillService {
    public apiBaseUrl = "api/Customers/";
    public apiBasePricingTableUrl = "/api/PricingTables/v1/";
    constructor(private httpClient: HttpClient) {
    }

    public readDropdownEndpoint(lookupUrl: string) {
        if (lookupUrl.toLowerCase().includes('api/Dropdown'.toLowerCase())) {
            const apiUrl: string = lookupUrl;
            return this.httpClient.get(apiUrl);
        }
    }

    public updatePricingTable(custId, contractId, pt): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [pt]);
    }

    public createPricingTable(custId, contractId, pt) {
        const apiUrl: string = this.apiBasePricingTableUrl + 'SavePricingTable/' + custId + '/' + contractId;
        return this.httpClient.post(apiUrl, [pt]);
    }
}

