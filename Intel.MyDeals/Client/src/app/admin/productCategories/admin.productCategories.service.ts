import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { Product_categories } from './admin.productCategories.model';

@Injectable({
    providedIn: 'root'
})


export class productCategoryService {
    public apiBaseUrl: string = "api/ProductCategories/";

    constructor(private httpClient: HttpClient) {

    }

    public getCategories(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetProductCategories';
        return this.httpClient.get(apiUrl);
    }
    public updateCategory(category: Array<Product_categories>): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateProductCategoryBulk';
        return this.httpClient.put(apiUrl, category);
    }
    

}

angular
    .module('app')
    .factory('productCategoryService', downgradeInjectable(productCategoryService));