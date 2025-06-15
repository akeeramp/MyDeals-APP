import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductDetailsReportService {
    public apiBaseUrl = "api/Products/";
    public dropdownUrl = "api/Customers/";

    constructor(private httpClient: HttpClient) { }

    public GetProductSelectorFamilyDtl(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductSelectorFamilyDtl';
        return this.httpClient.get(apiUrl);
    }
    public GetProductSelectorDtl(prodSelectionLevels: any): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetProductSelectorDtl';
        return this.httpClient.post(apiUrl, prodSelectionLevels);
    }
    public getCustomerDropdowns(): Observable<any> {
        const apiUrl: string = this.dropdownUrl + 'GetMyCustomerNames';
        return this.httpClient.get(apiUrl);
    }

}

