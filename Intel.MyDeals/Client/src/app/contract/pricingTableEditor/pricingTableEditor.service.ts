import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class pricingTableEditorService {

    constructor(private httpClient: HttpClient) { }

    public apiBasePricingTableUrl = "/api/PricingTables/v1/";
    
    public readPricingTable(id): Observable<any> {
        const apiUrl: string = this.apiBasePricingTableUrl + 'GetFullNestedPricingTable/' + id;
        return this.httpClient.get(apiUrl);
    }

    public readDropdownEndpoint(lookupUrl: string) {
        if (lookupUrl.toLowerCase().includes('api/Dropdown'.toLowerCase())) {
            const apiUrl: string = lookupUrl;
            return this.httpClient.get(apiUrl);    
        }
    }

}