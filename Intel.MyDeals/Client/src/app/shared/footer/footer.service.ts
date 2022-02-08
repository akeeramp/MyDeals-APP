import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,of } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class footerService {
    public apiBaseUrl: string = "api/SharedService/";

    constructor(private httpClient: HttpClient) { }
    public getFooterDetails(): Observable<any> {
        let apiUrl: string = this.apiBaseUrl + 'getFooter';
        return this.httpClient.get(apiUrl);
    }
}