import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class dealPopupService {
    private apiBaseUrl = "api/PricingTables/v1/";
    private templateUrl = "api/Timeline/";
    private productUrl = "/api/Products/";

    constructor(private httpClient: HttpClient) {

    } 

    public getWipDealById(id): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetWipDeal/'+id;
        return this.httpClient.get(apiUrl);
    }

    public getTimelineDetails(data): Observable<any> {
        const apiUrl: string = this.templateUrl + 'GetObjTimelineDetails';
        return this.httpClient.post(apiUrl,data);
    }

    public getProductsByIds(data): Observable<any> {
        const apiUrl: string = this.productUrl + 'GetProductsByIds';
        return this.httpClient.post(apiUrl, data);
    }


}