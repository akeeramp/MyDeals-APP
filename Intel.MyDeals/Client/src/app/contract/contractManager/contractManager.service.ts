import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
//import { wipSummary } from './contractManager.component'
import { Observable } from "rxjs/Observable";

@Injectable({
    providedIn: 'root'
})

export class contractManagerservice {
    constructor(private httpClient: HttpClient) { }

    public apiBaseUrl = "/api/Dashboard/GetWipSummary/";

    public getWipSummary(id): Observable<any>{
        // NOTE: Don't get angular-cached data b/c it needs latest data for the $state.go to work correctly in the contact.controller.js' createPricingTable()
        const apiUrl: string = this.apiBaseUrl + id;
        return this.httpClient.get(apiUrl);
    }

}
