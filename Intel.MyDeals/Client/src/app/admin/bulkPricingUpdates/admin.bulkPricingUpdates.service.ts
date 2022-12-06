import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class bulkPricingUpdatesService {
    
    public apiBaseUrl = "api/BulkPriceUpdate/";
    constructor(private httpClient: HttpClient) {}
    public UpdatePriceRecord(data): Observable<any> {
        return this.httpClient.post(this.apiBaseUrl + 'UpdatePriceRecord', data);
    }
}