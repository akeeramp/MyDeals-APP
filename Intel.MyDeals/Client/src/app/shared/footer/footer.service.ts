import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class footerService {
    public apiBaseUrl = "api/SharedService/";

    constructor(private httpClient: HttpClient) { }
    public getFooterDetails(): Observable<any> {
        const apiUrl: string = this.apiBaseUrl + 'getFooter';
        return this.httpClient.get(apiUrl);
    }
}