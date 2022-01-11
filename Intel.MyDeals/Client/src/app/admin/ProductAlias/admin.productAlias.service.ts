import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})


export class productAliasService {
    public apiBaseUrl: string = "api/Products/";

    constructor(private httpClient: HttpClient) {

    }
    public GetProductsFromAlias(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetProductsFromAlias/false';
        return this.httpClient.get(apiUrl);
    }
    public UpdateProductAlias(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'UpdateProductAlias';
        return this.httpClient.post(apiUrl, data);
    }
    public CreateProductAlias(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'CreateProductAlias';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteProductAlias(data: any): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'DeleteProductAlias';
        return this.httpClient.post(apiUrl, data);
    }

}
