import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class iCostProductService {
    public apiBaseUrl = "api/ProductCostTest/";

    constructor(private httpClient: HttpClient) {
    }

    public getProductCostTestRules(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductCostTestRules';
        return this.httpClient.get(apiUrl);
    }

    public getProductTypeMappings(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductTypeMappings';
        return this.httpClient.get(apiUrl);
    }

    public getProductAttributeValues(verticalId): Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'GetProductAttributeValues/' + verticalId;
        return this.httpClient.get(apiUrl);
    }

    public createPCTRules(dto): Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'CreatePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }

    public updatePCTRule(dto): Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'UpdatePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }

    public deletePCTRule(dto): Observable<any>  {
        const apiUrl: string = this.apiBaseUrl + 'DeletePCTRule';
        return this.httpClient.post(apiUrl, dto);
    }
}
