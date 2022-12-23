import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class flexoverLappingcheckDealService {
    public apiBaseUrl = "api/Products/";
    constructor(private httpClient: HttpClient) {
    }

    public GetProductOVLPValidation(data): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'validateOverlapProduct';
        return this.httpClient.post(apiUrl, data);
    }
}