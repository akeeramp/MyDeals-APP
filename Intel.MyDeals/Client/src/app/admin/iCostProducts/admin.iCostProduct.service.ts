import * as angular from 'angular';
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class iCostProductService {
    public apiBaseUrl: string = "api/ProductCostTest/";

    constructor(private httpClient: HttpClient) {
    }

    public getProductCostTestRules(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetProductCostTestRules';
        return this.httpClient.get(apiUrl);
    }

    public getProductTypeMappings(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetProductTypeMappings';
        return this.httpClient.get(apiUrl);
    }

    public getProductAttributeValues(verticalId): Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'GetProductAttributeValues/' + verticalId;
        return this.httpClient.get(apiUrl);
    }

    public createPCTRules(dto): Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'CreatePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }

    public updatePCTRule(dto): Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'UpdatePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }

    public deletePCTRule(dto): Observable<any>  {
        let apiUrl: string = this.apiBaseUrl + 'DeletePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }
}
