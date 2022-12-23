import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class productAliasService {
    public apiBaseUrl = "api/Products/";

    constructor(private httpClient: HttpClient) {

    }
    public GetProductsFromAlias(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductsFromAlias/false';
        return this.httpClient.get(apiUrl);
    }
    public UpdateProductAlias(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'UpdateProductAlias';
        return this.httpClient.post(apiUrl, data);
    }
    public CreateProductAlias(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'CreateProductAlias';
        return this.httpClient.post(apiUrl, data);
    }
    public DeleteProductAlias(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'DeleteProductAlias';
        return this.httpClient.post(apiUrl, data);
    }

}
