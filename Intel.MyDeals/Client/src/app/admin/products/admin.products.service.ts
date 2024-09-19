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

    public getProducts(): Observable<any> {
        // TODO: Hard coded 'EIA CPU' as default category, once we decide which drop down controls to use we can hook this
        // up with drop down change event containing product Vertical
        // Getting all the products is a costly operations as it brings ~75K records
        const apiUrl: string = this.apiBaseUrl + 'GetProductByCategoryName/EIA CPU/false';
        return this.httpClient.get(apiUrl);
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
