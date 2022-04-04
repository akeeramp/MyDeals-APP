import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { logger } from "../../shared/logger/logger";

@Injectable({
    providedIn: 'root'
})

export class quoteLetterService {
    public apiBaseUrl = "api/QuoteLetter/";

    constructor(private httpClient: HttpClient, private loggerSvc: logger) {

    }

    public adminGetTemplates(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'AdminGetTemplates';
        return this.httpClient.get(apiUrl);
    }

    public adminSaveTemplate(template): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'AdminSaveTemplate';
        return this.httpClient.put(apiUrl, template);
    }

    public adminPreviewQuoteLetterTemplate(template): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDealQuoteLetterPreview';
        return this.httpClient.post(apiUrl, template, { responseType: 'blob', observe: "response" })
    }
}
