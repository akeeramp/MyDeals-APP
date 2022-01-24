import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from "rxjs";
import 'rxjs/add/operator/toPromise';
import { AuthService } from '../../shared/authorization/auth.service';
import { logger } from "../../shared/logger/logger";

@Injectable({
    providedIn: 'root'
})

export class quoteLetterService {
    public apiBaseUrl: string = "api/QuoteLetter/";

    constructor(private httpClient: HttpClient, private loggerSvc: logger) {

    }

    public adminGetTemplates(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'AdminGetTemplates';
        return this.httpClient.get(apiUrl);
    }

    public adminSaveTemplate(template): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'AdminSaveTemplate';
        return this.httpClient.put(apiUrl, template);
    }

    public adminPreviewQuoteLetterTemplate(template): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'GetDealQuoteLetterPreview';
        return this.httpClient.post(apiUrl, template, { responseType: 'blob', observe: "response" })
    }
}
