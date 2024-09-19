import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { Product_categories } from './admin.productCategories.model';

@Injectable({
    providedIn: 'root'
})


export class productCategoryService {
    public readonly apiBaseUrl = "api/ProductCategories/";

    constructor(private httpClient: HttpClient) {

    }

    public getCategories(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductCategories';
        return this.httpClient.get(apiUrl);
    }
    public updateCategory(category: Array<Product_categories>): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateProductCategoryBulk';
        return this.httpClient.put(apiUrl, category);
    }
    

}
