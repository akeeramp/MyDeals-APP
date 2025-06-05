import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class productsService {
    public readonly apiBaseUrl = "api/Products/";

    constructor(private httpClient: HttpClient) {
    }

    public getProducts(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductByCategoryName';
        return this.httpClient.post(apiUrl, data);
    }

    public getProductCategories(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductCategories';
        return this.httpClient.get(apiUrl);
    }

    public getProductCategoriesWithAll(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductCategoriesWithAll';
        return this.httpClient.get(apiUrl);
    }

}
