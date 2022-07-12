import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})

export class productSelectorService {

    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "api/Products/";

    TranslateProducts(products, CUST_CD, DEAL_TYPE, contractId, isTender) {
        var is_Tender = isTender == 1 ? true : false;
        return this.httpClient.post(this.apiBaseUrl + 'TranslateProducts/' + CUST_CD + "/" + DEAL_TYPE + "/" + contractId + "/" + is_Tender, products);
    }
}