import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

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

}