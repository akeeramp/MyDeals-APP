import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class dealProductsService {
    constructor(private httpClient: HttpClient) { }
    private apiProductBase = "/api/Products/";
    public getProductDetailsFromDealId(dcId, custId): Observable<any> {
        const apiUrl: string = this.apiProductBase + 'GetDealProducts/' + dcId + '/5/' + custId + '/false';
        return this.httpClient.get(apiUrl);
    }
    public getProductDetailsFromProductId(prdData): Observable<any> {
        const apiUrl: string = this.apiProductBase + 'GetProductsByIds';
        return this.httpClient.post(apiUrl, prdData);
    }
}