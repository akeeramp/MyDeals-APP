import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { AdminQuoteLetter, DownloadQuoteLetterData } from "./admin.quoteLetter.model";

@Injectable({
    providedIn: 'root'
})

export class quoteLetterService {
    public apiBaseUrl = "api/QuoteLetter/";

    constructor(private httpClient: HttpClient) {

    }

    public adminGetTemplates(): Observable<AdminQuoteLetter[]> {
        const apiUrl: string = this.apiBaseUrl + 'AdminGetTemplates';
        return this.httpClient.get<AdminQuoteLetter[]>(apiUrl);
    }

    public adminSaveTemplate(template: AdminQuoteLetter): Observable<AdminQuoteLetter> {
        const apiUrl: string = this.apiBaseUrl + 'AdminSaveTemplate';
        return this.httpClient.put<AdminQuoteLetter>(apiUrl, template);
    }

    public adminPreviewQuoteLetterTemplate(template: AdminQuoteLetter): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'GetDealQuoteLetterPreview';
        return this.httpClient.post(apiUrl, template, { responseType: 'blob', observe: "response" })
    }
    public regenerateQuoteLetter(dealId: string): Observable<DownloadQuoteLetterData[]> {
        const apiUrl: string = this.apiBaseUrl + 'RegenerateQuoteLetter/' + dealId;
        return this.httpClient.get<DownloadQuoteLetterData[]>(apiUrl);
    }
}