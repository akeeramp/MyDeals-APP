import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class productSelectorService {
    public apiBaseUrl = "api/Products/";

    constructor(private httpClient: HttpClient) { }

    public GetProductSelectorWrapper(dto: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductSelectorWrapper';
        return this.httpClient.post(apiUrl, dto);
    }
    public GetProductSelectionResults(prodSelectionLevels: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductSelectionResults';
        return this.httpClient.post(apiUrl, prodSelectionLevels);
    }
    // This method skips all the translator logic (product split, duplicate and invalid etc etc..) and hits the database
    public GetProductDetails(products, CUST_CD, dealType): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'SearchProduct/' + CUST_CD + '/' + dealType + '/true';
        return this.httpClient.post(apiUrl, products);
    }

    public GetSuggestions(products, CUST_CD, dealType): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetSuggestions/' + CUST_CD + '/' + dealType;
        return this.httpClient.post(apiUrl, products);
    }

    public GetProductCAPYCS2Data(getAvailable, priceCondition, data): Observable<any> {
        const apiUrl = `${this.apiBaseUrl}GetProductCAPYCS2Data/${getAvailable}/${priceCondition}`;
        return this.httpClient.post(apiUrl, data);
    }

    public GetSearchString(dto) {
        const apiUrl = this.apiBaseUrl + 'GetSearchString';
        return this.httpClient.post(apiUrl, dto);
    }
}

